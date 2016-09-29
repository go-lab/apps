/**
 * Created by richard on 16.01.16.
 */

(function(starterApp) {

    starterApp.GroupFormation = GroupFormation;
    var resourceController;
    var configHandler;
    var loadingIndicator;
    var interactionController;

    var validArtifactSources = [];

    var artifactTestData;
    var artifactList = [];   //contains all loaded artifacts inclusive configurations and artifact sources which are not used by group formation
    var cleanedArtifactList = []; //contains all artifacts with implementation (concept extractors...) for groupFormation
    var artifactSources = []; //contains unique sources with actor participation
    var actorList = [];  //contains all actors read from artifactList
    var numStudents = 0;
    var refSolutionOptionSelected = false;

    var calculatedGroupData = [];
    var aggregatedReferenceConcepts = [];

    function GroupFormation() {

        initialize();

        return {
            actorList : actorList,
            artifactSources : artifactSources,
            cleanedArtifactList : cleanedArtifactList,
            artifactList : artifactList,
            getCntMissingResourcesByActorId : getCntMissingResourcesForSelectedArtifactsByActorId,
            numStudents : getNumStudents,
            getActorById : getActorById,
            isActorIncludedById : isActorIncludedById,
            getCntParticipationBySourceId : getCntParticipationBySourceId,
            getActorParticipationListBySourceId : getActorParticipationListBySourceId,
            getActorMissingParticipationListBySourceId : getActorMissingParticipationListBySourceId,
            includeAllStudents: includeAllStudents,
            getDistinctNoParticipationActorList : getDistinctNoParticipationActorList,
            initialize: initialize,
            refreshArtifactData: refreshArtifactData,
            getArtifactSourceById : getArtifactSourceById,
            includeAllSources : includeAllSources,
            getAllStudents : getAllStudents,
            checkParticipation : checkParticipation,
            isResourceReferencedByOtherActor : isResourceReferencedByOtherActor,
            setResourceReference : setResourceReference,
            removeReferencedResourceByActorIdGenId : removeReferencedResourceByActorIdGenId,
            removeResourceReference : removeResourceReference,
            refModelSelectedForEverySelectedArtifact : refModelSelectedForEverySelectedArtifact,
            getSelectedArtifactSources : getSelectedArtifactSources,
            getSelectedActors : getSelectedActors,
            assembleCleanedArtifactList : assembleCleanedArtifactList,
            isArtifactSourceIncludedById : isArtifactSourceIncludedByID,
            setCalculationData : setCalculationData,
            calculatedGroupData : calculatedGroupData,
            aggregatedReferenceConcepts : aggregatedReferenceConcepts,
            clearCalculationData: clearCalculationData,
            getGroupDataByPosition: getGroupDataByPosition,
            prepareVisualisationData: prepareVisualisationData,
            isRefSolutionOptionSelected: isRefSolutionOptionSelected,
            selectRefSolutionOption: selectRefSolutionOption,
            getArtifactListByGenId: getArtifactListByGenId,
            getActorsForGF: getActorsForGF,
            artifactSourceReferencingActor: artifactSourceReferencingActor
        };

        function initialize() {
            interactionController = starterApp.interactionController;
            resourceController = starterApp.resourceController;
            loadingIndicator = starterApp.loadingIndicator;
            configHandler = starterApp.configHandler;

            setValidArtifactSources();

            artifactTestData = resourceController.getTestData();

            function setValidArtifactSources() {

                validArtifactSources = configHandler.getEntry("artifactSources").map(function (artifactConfig) {
                    return artifactConfig.displayName;
                });
            }
        }

        function refreshArtifactData(callback) {

            clearArtifactDataStructure();

            resourceController.retrieveArtifacts(function(receivedArtifactList) {


                if(starterApp.metaContext == 'standalone' || starterApp.metaContext == 'preview')
                    artifactList = artifactTestData.slice(0);
                else
                    artifactList = receivedArtifactList;

                if(artifactList.length == 0)
                    starterApp.errorDisplay.show('No artifact sources found!');
                else
                    processArtifactList();

                callback();

            });

        }

        function processArtifactList() {

            artifactList.forEach(function (artifact) {

                if(isValidArtifact(artifact)) {

                    cleanedArtifactList.push(artifact);
                    addActorIfNotExisting(artifact.metadata.actor);
                    addSourceIfNotExisting(artifact);
                    addActorParticipation(artifact);
                }

            });

            addProcessedListsToStarterApp();
            sortArtifactSources();
            sortActors();
            countStudents();

            function sortActors() {

                actorList.sort(function (a, b){

                    var aActorNick = a.displayName.toLowerCase();
                    var bActorNick = b.displayName.toLowerCase();

                    return ((aActorNick < bActorNick) ? -1 : ((aActorNick > bActorNick) ? 1 : 0));

                });

            }

            function countStudents() {

                numStudents = actorList.filter(function(actor) {

                    return actor.objectType == 'graasp_student';

                }).length;

            }

            function sortArtifactSources() {

                artifactSources.sort(function (a, b) {

                    var aPhaseName = a.metadata.provider.inquiryPhase;
                    var bPhaseName = b.metadata.provider.inquiryPhase;

                    var aId = phaseId(aPhaseName);
                    var bId = phaseId(bPhaseName);
                    var aAppName = a.metadata.generator.displayName;
                    var bAppName = b.metadata.generator.displayName;

                    if(aId < bId) {
                        return -1;
                    } else if((aId == bId) && (aAppName < bAppName)) {
                        return 0;
                    } else if((aId == bId) && (aAppName == bAppName)){
                        return 1;
                    } else if((aId == bId) && (aAppName > bAppName)){
                        return 2;
                    } else {
                        return 3;
                    }

                    //return ((aId < bId) ? -1 : ((aId > bId) ? 1 : 0));

                });

                function phaseId(phaseName) {
                    switch (phaseName) {

                        case 'Orientation' :
                            return 0;

                        case 'Conceptualisation' :
                            return 1;

                        case 'Investigation' :
                            return 2;

                        case 'Conclusion' :
                            return 3;

                        case 'Discussion' :
                            return 4;

                        default :
                            return 5;
                    }
                }
            }

            function isValidArtifact(artifact) {
                //XXX quick fix
                var validArtifactSources =["conceptmapper","hypothesis scratchpad","collide wiki"];
                var objectType = artifact.metadata.target.objectType;
                var appName = artifact.metadata.generator.displayName;

                return (objectType != 'configuration') && (objectType != 'collide wiki config') && validArtifactSources.indexOf(appName) != -1;

            }

            function addActorIfNotExisting(actor) {

                if(actorList.map(function(actor) { return actor.id; }).indexOf(actor.id) === -1) {

                    if (actor.objectType == 'graasp_student')
                        actor.includeActor = true;

                    actorList.push(actor);

                }

            }

            function addSourceIfNotExisting(artifact) {

                if(artifactSources.map(function(artifact) {return artifact.metadata.generator.id;}).indexOf(artifact.metadata.generator.id) === -1) {

                    artifact.participation = [];
                    artifact.refModelActorIds = [];
                    artifact.includeSource = true;
                    artifact.noParticipationActorList = [];
                    artifactSources.push(artifact);

                }

            }

            function addActorParticipation(artifact) {

                for(var i=0; i < artifactSources.length; i++) {

                    if(artifactSources[i].metadata.generator.id === artifact.metadata.generator.id) {

                        var participationList = artifactSources[i].participation;

                        if (participationList.map(function (actor) {
                                return actor.id;
                            }).indexOf(artifact.metadata.actor.id) == -1)
                            participationList.push(artifact.metadata.actor);

                        break;
                    }
                }
            }

            function addProcessedListsToStarterApp(){

                starterApp.artifactList = artifactList;
                starterApp.cleanedArtifactList = cleanedArtifactList;
                starterApp.artifactSources = artifactSources;
                starterApp.actorList = actorList;

            }
        }

        function clearArtifactDataStructure() {
            artifactList.splice(0, artifactList.length);
            cleanedArtifactList.splice(0, cleanedArtifactList.length);
            artifactSources.splice(0, artifactSources.length);
            actorList.splice(0, actorList.length);
            numStudents = 0;
            refSolutionOptionSelected = false;
        }

        function getNumStudents() {
            return numStudents;
        }

        function isActorIncludedById(id) {

            for(var i = 0; i < actorList.length; i++){

                if((actorList[i].id == id) && (actorList[i].includeActor))
                    return true;

            }

            return false;
        }

        function getActorsForGF() {

            var allRefModelIds = [];

            artifactSources.map(function (artifactSource) {
                return artifactSource.refModelActorIds;
            }).forEach(function (idArray) {
                allRefModelIds = allRefModelIds.concat(idArray);
            });

            console.log(allRefModelIds);

            return actorList.filter(function (actor) {

                return actor.includeActor || allRefModelIds.indexOf(actor.id) != -1;

            });

        }

        function getActorById(id) {

            for(var i = 0; i < actorList.length; i++) {

                if(actorList[i].id == id){

                    return actorList[i];

                }

            }

        }

        function getCntMissingResourcesForSelectedArtifactsByActorId(actorId) {

            var actor = getActorById(actorId);
            actor.missingResourcesIds = [];

            for(var i = 0; i < artifactSources.length; i++) {

                if(artifactSources[i].includeSource && !resourceExistingByActorBySourceId(actorId,artifactSources[i].metadata.generator.id))
                    actor.missingResourcesIds.push(artifactSources[i].metadata.generator.id);

            }

            return actor.missingResourcesIds.length;

            function resourceExistingByActorBySourceId(actorId, sourceId) {

                for(var i = 0; i < cleanedArtifactList.length; i++) {

                    if(cleanedArtifactList[i].metadata.generator.id == sourceId && cleanedArtifactList[i].metadata.actor.id == actorId)
                        return true;

                }

                return false;

            }
        }

        function getCntParticipationBySourceId(sourceId) {

            return cleanedArtifactList.filter(function (artifact) {

                return (artifact.metadata.generator.id == sourceId && isActorIncludedById(artifact.metadata.actor.id));

            }).length;

        }

        function getActorParticipationListBySourceId(sourceId) {

            var actorParticipationList = [];

            for(var i = 0; i < cleanedArtifactList.length; i++){

                if(cleanedArtifactList[i].metadata.generator.id == sourceId && isActorIncludedById(cleanedArtifactList[i].metadata.actor.id)){

                    if(actorParticipationList.map(function(actor) { return actor.id; }).indexOf(cleanedArtifactList[i].metadata.actor.id) === -1)
                        actorParticipationList.push(cleanedArtifactList[i].metadata.actor);

                }
            }

            return actorParticipationList;

        }

        function getActorMissingParticipationListBySourceId(sourceId) {

            var actorParticipationList = getActorParticipationListBySourceId(sourceId);
            var actorMissingParticipationList = [];

            for(var i = 0; i < actorList.length; i++){

                if(actorList[i].includeActor && actorParticipationList.map(function(actor) { return actor.id; }).indexOf(actorList[i].id) === -1)
                    actorMissingParticipationList.push(actorList[i]);

            }

            return actorMissingParticipationList;

        }

        function getArtifactSourceById(sourceId) {

            for(var i = 0; i < artifactSources.length; i++) {

                if(artifactSources[i].metadata.generator.id == sourceId)
                    return artifactSources[i];

            }
        }

        function includeAllStudents(include) {

            getAllStudents().forEach(function (student) {
                student.includeActor = include;
            });

        }

        function getDistinctNoParticipationActorList() {

            var distinctNoParticipationActorList = [];

            for(var i = 0; i < artifactSources.length; i++) {

                if(artifactSources[i].includeSource){

                    for (var s = 0; s < artifactSources[i].noParticipationActorList.length; s++) {

                        if (distinctNoParticipationActorList.map(function (actor) {
                                return actor.id;
                            }).indexOf(artifactSources[i].noParticipationActorList[s].id) == -1)
                            distinctNoParticipationActorList.push(artifactSources[i].noParticipationActorList[s]);

                    }

                }
            }

            return distinctNoParticipationActorList;
        }

        function includeAllSources(include) {

            for(var i=0; i < artifactSources.length; i++) {

                artifactSources[i].includeSource = include;

            }

        }

        function getAllStudents() {

            return actorList.filter(function(actor) {

                return actor.objectType == 'graasp_student';

            });

        }

        function checkParticipation() {

            var participationIssueExisting = false;

            for(var i = 0; i < artifactSources.length; i++) {

                artifactSources[i].noParticipationActorList = [];

                if(artifactSources[i].includeSource) {

                    for(var x = 0; x < actorList.length; x++) {

                        if(actorList[x].includeActor && cleanedArtifactList.filter(function(artifact) {

                                return artifact.metadata.generator.id == artifactSources[i].metadata.generator.id && artifact.metadata.actor.id == actorList[x].id

                            }).length <= 0){

                            artifactSources[i].noParticipationActorList.push(actorList[x]);
                            participationIssueExisting = true;

                        }
                    }
                }
            }

            return participationIssueExisting;

        }

        function isResourceReferencedByOtherActor(actorId, referencedActorId, generatorId) {

            var actor = getActorById(actorId);

            for(var i = 0; i < actor.referencedResources.length; i++){

                if(actor.referencedResources[i].generatorId == generatorId && actor.referencedResources[i].referencedActorId == referencedActorId)
                    return true;
            }

            return false;
        }


        function setResourceReference(actorId, referencedActorId, generatorId) {

            //marked as used
            console.log('Setting Resource reference for actor : ' + getActorById(actorId).displayName + ' for resource ' + getArtifactSourceById(generatorId).metadata.generator.displayName);

            var actor = getActorById(actorId);
            var found = false;

            for(var i = 0; i < actor.referencedResources.length; i++) {

                if(actor.referencedResources[i].generatorId == generatorId){
                    actor.referencedResources[i].referencedActorId = referencedActorId;
                    found = true;
                    break;
                }

            }

            if(!found){

                actor.referencedResources.push({generatorId : generatorId, referencedActorId : referencedActorId});

            }

        }

        function removeReferencedResourceByActorIdGenId (actorId, generatorId) {

            var actor = getActorById(actorId);

            actor.referencedResources = actor.referencedResources.filter(function(referencedResource) {

                return referencedResource.generatorId != generatorId;

            });
        }


        function getResourceReferencesCntForActor(actorId) {

            var actor = getActorById(actorId);

            return actor.referencedResources.length;

        }

        function removeResourceReference(actorId, generatorId) {

            var actor = getActorById(actorId);

            actor.referencedResources = actor.referencedResources.filter(function(referencedResource) {

                return referencedResource.generatorId != generatorId;

            });

        }


        function refModelSelectedForEverySelectedArtifact() {

            for (var i = 0; i < artifactSources.length; i++) {

                if(artifactSources[i].includeSource && !artifactSources[i].refModelActorIds.length) {
                    return false;
                }

            }

            return true;

        }

        function getSelectedArtifactSources() {

            return artifactSources.filter(function(artifactSource) {

                return artifactSource.includeSource;

            });

        }

        function getSelectedActors() {

            return actorList.filter(function(actor) {

                return actor.includeActor;

            });
        }

        function isArtifactSourceIncludedByID(generatorId) {

            for(var i = 0; i < artifactSources.length; i++){
                if(artifactSources[i].metadata.generator.id == generatorId && artifactSources[i].includeSource)
                    return true;
            }

            return false;

        }

        function assembleCleanedArtifactList() {

            return cleanedArtifactList.filter(function(artifact) {

                return isArtifactSourceIncludedByID(artifact.metadata.generator.id) && (isActorIncludedById(artifact.metadata.actor.id) || getArtifactSourceById(artifact.metadata.generator.id).refModelActorIds.indexOf(artifact.metadata.actor.id) != -1);

            });

        }

        function setCalculationData(calculationDataParam) {

            for(var i = 0; i < calculationDataParam.calculatedGroupData.length; i++) {

                calculatedGroupData.push(calculationDataParam.calculatedGroupData[i]);

            }

            for(i = 0; i < calculationDataParam.aggregatedReferenceConcepts; i++) {

                aggregatedReferenceConcepts.push(calculationDataParam.aggregatedReferenceConcepts[i]);

            }

        }

        function clearCalculationData() {

            calculatedGroupData.splice(0, calculatedGroupData.length);
            aggregatedReferenceConcepts.splice(0, aggregatedReferenceConcepts.length);

        }

        function getGroupDataByPosition(position) {

            return calculatedGroupData[position];

        }

        function isRefSolutionOptionSelected() {
            return refSolutionOptionSelected;
        }

        function selectRefSolutionOption(selected) {
            refSolutionOptionSelected = selected;
        }

        function getArtifactListByGenId(genId) {

            return cleanedArtifactList.filter(function (artifact) {
                return artifact.metadata.generator.id == genId
            });
        }

        function artifactSourceReferencingActor(generatorId, actorId) {

            return getArtifactSourceById(generatorId).refModelActorIds.indexOf(actorId) != -1;

        }

        function prepareVisualisationData(position) {

            var groupData = getGroupDataByPosition(position);

            var data = prepareData();
            var groupConcepts = prepareGroupConcepts();
            var network = prepareNetwork(groupConcepts);

            groupData.data = data;
            groupData.groupConcepts = groupConcepts;
            groupData.network = network;

            function prepareData() {

                var data = [];

                for (var i = 0; i < groupData.groupMemberIds.length; i++) {

                    data.push({
                        id: i,
                        name: getActorById(groupData.groupMemberIds[i]).displayName,
                        r: 40
                    });

                }

                return data;

            }

            function prepareGroupConcepts() {

                var groupConcepts = {};

                for (var i = 0; i < groupData.students.length; i++) {

                    for (var s = 0; s < groupData.students[i].aggregatedConceptList.length; s++) {

                        if (groupConcepts[groupData.students[i].aggregatedConceptList[s]])
                            groupConcepts[groupData.students[i].aggregatedConceptList[s]].push(i);
                        else {
                            groupConcepts[groupData.students[i].aggregatedConceptList[s]] = [];
                            groupConcepts[groupData.students[i].aggregatedConceptList[s]].push(i);
                        }
                    }
                }

                return groupConcepts;

            }

            function prepareNetwork(groupConcepts) {

                var network = {};
                network.data = {};
                network.metadata = {};
                network.data.edges = [];
                network.data.nodes = [];

                for (i in groupConcepts) {

                    network.data.nodes.push(
                        {
                            "id": groupConcepts[i].slice(0),
                            "id_b": groupConcepts[i].slice(0),
                            "name": i,
                            "r": groupConcepts[i].slice(0).length * 5
                        }
                    )
                }

                return network;
            }

        }


    }

})(golab.tools.starterApp);
