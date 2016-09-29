(function(conceptCloud) {
    conceptCloud.TagCloud = TagCloud;
    var languageHandler;

    //Store x,y coordinates of cloud elements to fix their position.
    var coordinates = {};

    var conceptCloudData;

    var ScalingParameter = 15;
    var tagCloudHeight = 650;
    var tagCloudWidth = $("#tag_cloud").width();
    var studentList;
    var phaseList;
    var appList;
    var preview_data = {
        "actor":{
            "id":"ad@547be131ceec2f0000d6fd0e",
            "name":"ad"
        },
        "metaData":{
            "spaceId":"547be131ceec2f0000d6fd0e",
            "phases":[
                "Orientation@56937d5d7ec4757d0bffc0e9",
                "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                "Investigation@56937d5d7ec4757d0bffc0f3",
                "Conclusion@56937d5d7ec4757d0bffc0f8",
                "Discussion@56937d5d7ec4757d0bffc0fd"
            ],
            "applicationCount":5,
            "phaseCount":5,
        }
    };

    var reflectionQuestions = {};
    var questions = {
        "setR1": [
            "Wie ist dieses Konzept zu verstehen?",
            "Wie kannst du dieses Konzept besser verstehen?",
            "Warum hast du das bereits erklärte Konzept nicht aufgegriffen?",
            "Wie hängt dieses Konzept möglicherweise mit anderen zusammen, die du bereits verwendet hast?",
            "Ist dieses Konzept neu für dich? In welchem Zusammenhang steht dieses Konzept mit dir bereits Bekannten in Zusammenhang?"
        ],
        "setR2": [
            "Warum hast du das Konzept wieder verworfen?",
            "Überlege noch einmal welche Inhalte durch die Ausarbeitung ausgebaut und verfestigt wurden!",
            "Scheint dir der Sinn des Konzeptes schlüssig? Wenn nein, welche Phase könnte dir helfen, das Konzept besser zu verstehen?",
            "Wo kannst du das Konzept als erstes aufgreifen? Wo macht es als erstes Sinn?",
            "Was hilft dir dabei, das Konzept anzuwenden? Geh nochmal zurück, um dir den Inhalt anzusehen.",
            "Ist dir etwas nicht klar geworden? Wenn ja, überlege welche Inhalte dir helfen könnten, das Konzept besser zu verstehen."
        ],
        "setY1": [
            "Warum hast du das Konzept nur teilweise verwendet?",
            "War die Aufgabe für dich eindeutig gestellt?",
            "Welche Fragen wurden nicht geklärt?",
            "Wie hast du dir bei Unklarheiten Hilfe verschafft?",
            "An welchen Stellen hast du noch Probleme oder Fragen bezüglich des Konzeptes?",
            "Welche Querverbindung kannst du zu anderen Konzepten herstellen?",
            "Warst du bei der Verwendung des Konzeptes unsicher? Wenn ja, warum?"
        ],
        "setY2": [
            "Warum hast du das Konzept zwischenzeitlich verworfen?"
        ],
        "setG": [
            "Wie könntest du deine Annahmen anders formulieren?",
            "Was würdest du das nächste Mal beim Formulieren deiner Annahmen anders machen?",
            "Kannst du dieses Konzept mit den anderen verbinden? Lassen sich dadurch eventuell neue Schlüsse ziehen?",
            "Kannst du das Konzept mit eigenen Worten erklären?",
            "Mit wievielen anderen Konzepten lässt sich dieses Konzept in Verbindung bringen?",
            "Würdest du dieses Konzept als besonders wichtig einschätzen? Wenn ja, warum?",
            "Ist es dir leichter gefallen, dieses Konzept zu verstehen, als andere? Woran kann das liegen?",
            "Würdest du bei einer wiederholten Bearbeitung dieses Konzept wieder verwenden? Warum?",
            "Welche Themenbereiche sind dir aufgefallen, die zum aktuellen Konzept dazugehören bzw. eng damit verknüpft sind?",
            "Wie würdest du vorgehen, wenn du anderen Schülern den Inhalt des Konzeptes vermitteln müsstest?"
        ]
    };

    var uniqueRandoms = [];
    var numRandoms;

    var scale = d3.scale.linear().domain([10, 100]).range([14, 80]);

    //TODO Differentiate between aggregated and single model
    var currentStudent;

    function TagCloud() {
        return {
            initialize : initialize,
            returnTagFrequency : returnTagFrequency,
            applyStudentFilter : applyStudentFilter,
            applyPhaseFilter : applyPhaseFilter,
            applyAppFilter : applyAppFilter,
            setCurrentStudent : setCurrentStudent,
            returnCurrentStudent : returnCurrentStudent,
            removeCurrentStudent: removeCurrentStudent,
            buildFilteredStudentList: buildFilteredStudentList,
            setTagsToDefault : setTagsToDefault,
            returnQuestions : returnQuestions,
            findAppId : findApp,
            removeIds : removeIds,
            transferConcepts : transferConcepts,
            color : color
        };

        function initialize(){
            coordinates = {};

            languageHandler = conceptCloud.languageHandler;

            conceptCloud.resourceController.forward(function(data) {
                console.log("[ConceptCloud] ConceptCloud loaded from " + data.metadata.dataSource);
                console.log("[ConceptCloud] ConceptCloud Model was generated " + (Math.round((millisecondsBetween(data.metadata.generated, new Date())/60000) * 100)/100) + " minutes ago...");
                console.log("[ConceptCloud] Offset for new conceptCloud data: " + conceptCloud.timeOffset/60000 + " minutes");
                console.log("[ConceptCloud] retrieved data:");
                console.log(data);

                conceptCloudData = data;

                if(!jQuery.isEmptyObject(data.data.general)) {

                    // build userModel
                    conceptCloud.conceptModels.buildUserModel(data, true).then(function(userModel){
                        // build generalModel
                        conceptCloud.conceptModels.buildGeneralModel(data.data.general, true).then(function(generalModel){
                            buildContext(userModel, generalModel).then(function(){
                                conceptCloud.conceptModels.buildGeneralConcepts(userModel, generalModel).then(function(){

                                    if(!conceptCloud.aggregatedView) {
                                        var concepts = [];

                                        for(var i in generalModel.data) {
                                            concepts.push(i);
                                        }

                                        // show questions
                                        if(conceptCloud.showQuestions) {
                                            // only if reflection questions are enabled
                                            conceptCloud.resourceController.getReflectionData(concepts, function(data){
                                                conceptCloud.conceptModels.buildReflectionQuestions(data);
                                            });
                                        }
                                    }

                                    console.log("[ConceptCloud] userModel");
                                    console.log(userModel);

                                    console.log("[ConceptCloud] generalModel");
                                    console.log(generalModel);

                                    // Logging
                                    conceptCloud.loggingInterface.initialize("userModel", userModel);
                                    conceptCloud.loggingInterface.initialize("generalModel", generalModel);

                                    // Save ConceptCloud after building view
                                    buildView(userModel, generalModel).then(function (){
                                        console.log("[ConceptCloud] View is ready!");

                                        // Save ConceptCloud only in student view, NOT in graasp context!
                                        if(conceptCloud.retrieverMetadataHandler.getContext() !== 'graasp' && conceptCloud.retrieverMetadataHandler.getContext() !== 'preview' && !conceptCloud.aggregatedView) {
                                            saveConceptCloud();

                                        } else {
                                            console.log("[ConceptCloud] App is running in aggregation, graasp or preview context -> conceptCloud is not stored!");
                                        }

                                        // show analytics dashboard
                                        if(conceptCloud.aggregatedView && conceptCloud.analytics) {
                                            conceptCloud.conceptCloudEvolution.generate();
                                        }
                                    });
                                });
                            });
                        });
                    });


                } else {
                    conceptCloud.toolbar.setLastRefresh(new Date());
                    conceptCloud.errorHandler.handleError({error:"nothing_to_display", msg:"Nothing to display"}, languageHandler.getMessage('info_nothing_to_display'));
                    //$("#tag_cloud").append("<div>").html('<div class="info nothing-to-display">' + languageHandler.getMessage('info_nothing_to_display') + '</div>');
                }
            });
        }

        function saveConceptCloud() {
            // do not save cache loaded conceptCloud
            if(conceptCloudData.metadata.dataSource == "vault") {
                // save Latest conceptCloud
                // get svg element
                var cloud_svg = ($('#tag_cloud').html()).toString();

                // convert svg to json
                conceptCloud.conceptController.svgToJson(cloud_svg, function(object) {
                    // save conceptCloud
                    conceptCloud.conceptController.saveConceptCloud(conceptCloudData, object, function() {
                        console.log("[ConceptCloud] Saved!");
                    });
                });
            }
        }

        function buildContext(userModel, generalModel){
           return new Promise(function(fulfill, reject){
               // adding phase and app information to metadata
               generalModel.metadata.apps = conceptCloud.ilsApps;
               generalModel.metadata.phases = conceptCloud.ilsPhases;
               generalModel.metadata.phasesWithApps = conceptCloud.ilsPhasesWithApps;
               fulfill();
           })
        }

        function buildView(userModel, generalModel){
            return new Promise(function(fulfill, reject) {
                if (!conceptCloud.aggregatedView) {
                    studentView();
                    currentStudent = conceptCloud.retrieverMetadataHandler._metadata.actor.displayName;
                } else {
                    teacherView(userModel, generalModel);
                }

                conceptCloud.toolbar.setLastRefresh(new Date());
                fulfill();
            })
        }

        function transferConcepts(words){
            d3.layout.cloud().size([tagCloudWidth, tagCloudHeight])
                /* Maps from all loggedObjects (including their frequency) to the displayed word (including size) in the Tag-Cloud */
                .words(words.map(function (d) {
                    return {text: d.name, size: d.frequency * ScalingParameter};
                }))
                .padding(3, 10, 10, 3)
                .rotate(0)
                .font("Impact")
                .fontSize(function (d) {
                    return d.size;
                })
                .on("end", draw)
                .start();
        }

        function draw(words) {
            $('#tag_cloud').html('');

            d3.select("#tag_cloud").append("svg")
                .attr("width", tagCloudWidth)
                .attr("height", tagCloudHeight)
                .append("g")
                .attr("transform", "translate(" + tagCloudWidth/2 + "," + tagCloudHeight/2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) {
                    return scale(d.size) + "px";
                })
                .style("font-family", "Avant Garde")
                .attr("class", function (d, i) {
                    return color(conceptCloud.userModel, d.text);
                })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    if(coordinates[d.text] === undefined){
                        coordinates[d.text] = {};
                        coordinates[d.text].x = d.x;
                        coordinates[d.text].y = d.y;
                    }

                    return "translate(" + [coordinates[d.text].x, coordinates[d.text].y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                });
        }

        function color(model, text) {
            var contextDisplayName =  conceptCloud.retrieverMetadataHandler._metadata.actor.displayName;

            if (conceptCloud.aggregatedView && model === conceptCloud.userModel) {
                return 'default';
            }

            // Get the size of an object
            Object.size = function(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            };

            if(conceptCloud.retrieverMetadataHandler._context === "preview") {
                return model[contextDisplayName].data[text] === undefined ? "red" : (function () {
                    return Object.size(model[contextDisplayName].data[text]) == conceptCloud.ilsPhasesWithApps.length ? "green" : "yellow";
                })();
            } else {
                return model.data[text] === undefined ? "red" : (function () {
                    return Object.size(model.data[text]) == conceptCloud.ilsPhasesWithApps.length ? "green" : "yellow";
                })();
            }

        }

        function studentView() {
            // set up view for student view
            $('#wrapper-app').addClass("student-view");

            // set up modal for student view
            $('.teacher-modal-content').html('');
            $('#modal').addClass("student");
        }

        function teacherView(userModel, generalModel) {
            // set up view for teacher view
            $('#wrapper-app').addClass("teacher-view");

            // build Sidebar and show 'Filter' button
            buildStudentList(userModel);
            buildPhaseList(generalModel);
            buildAppList(generalModel);
            $('#wrapper-app').append('<button type="button" class="btn btn-default sidebar-toggler show-menu" title="timestamp"> <i class="fa fa-chevron-left"></i>Filter</button>');
            if(conceptCloud.analytics) {
                $('#wrapper-app').append('<button type="button" class="btn btn-default analytics-toggler show-menu" title="timestamp"> <i class="fa fa-chevron-left"></i>Analytics</button>');
            }

            // set up modal for teacher view
            $('#modal').addClass("teacher");
            $('.student-modal-content').html('');
        }

        function buildPhaseList(generalModel){
            // var phaseNames = removeIds(conceptCloud.ilsPhasesWithApps);
            var phaseNames = conceptCloud.ilsPhasesWithApps;

            phaseList = $('ul.phase-list');
            phaseList.html('');

            for(var phase in phaseNames) {
                $(phaseList).append(
                    $('<li>').addClass('phase')
                        .append(
                            $('<span>').addClass('phaseName')
                                .text(phaseNames[phase].split('@')[0])
                                .attr("id", phaseNames[phase].split('@')[1])
                                .attr("name", phaseNames[phase].split('@')[0])
                        )
                );
            }
        }

        function buildAppList(generalModel){

            var appNames = conceptCloud.ilsApps;
            appList = $('ul.app-list');
            appList.html('');

            for(var app in appNames) {

                var name = appNames[app].split('@')[0];
                var id = appNames[app].split('@')[1];

                // ignore the conceptCloud app in this list
                if(name.toLowerCase() != 'concept cloud' && name.toLowerCase() != 'concept_cloud' && name.toLowerCase() != 'conceptcloud') {

                    $(appList).append(
                        $('<li>').addClass('app')
                            .append(
                                $('<span>').addClass('appName')
                                    .text(name + (countInArray(appNames, name) != 1 ? " (" + findPhaseWithApp(id) + ")" : "")) // append phasename if app is used in multiple phases
                                    .attr("id", id) // add id as attribute
                                    .attr("name", name) // add name as attribute
                            )
                    );
                }
            }
        }

        function removeIds(array) {
            // remove ids and @ from array items: name@id -> name
            var temp = [];
            for(var i in array) {
                temp[i] = array[i].split('@')[0];
            }
            return temp;
        }

        function findApp(appName) {
            // returns the matching name@id combination for a appName
            for(var app in conceptCloud.ilsApps) {
                if(conceptCloud.ilsApps[app].indexOf(appName) > -1) {
                    return conceptCloud.ilsApps[app];
                }
            }
            return undefined;
        }

        function findPhaseWithApp(appId) {
            var ilsPhases = conceptCloud.ilsStructure.phases;
            for(var phase in ilsPhases) {
                for(var app in ilsPhases[phase].apps) {
                    if(ilsPhases[phase].apps[app].id == appId){
                        return ilsPhases[phase].displayName; // return the current phasename
                    }
                }
            }
        }

        function findPhaseId(phaseName) {
            // returns the matching name@id combination for a phaseName
            var phases = conceptCloud.ilsPhases
            for(var phase in phases) {
                if(phases[phase].indexOf(phaseName) > -1) {
                    return conceptCloud.phases[phase]; // return the name@id combination
                }
            }
            return undefined;
        }

        function matchPhases(phaseName) {
            var phases = conceptCloud.generalModel.metadata.phases;
            for(var i in phases) {
                if(phases[i].indexOf(phaseName) > -1){
                    return phases[i];
                }
            }
            return undefined;
        }

        function printStudentList(studentList, studentNames, listType) {

            studentList.html('');

            for(var i in studentNames) {
                $(studentList).append(
                    $('<li>').addClass('student ' + listType)
                        .append(
                            $('<span>').addClass('studentName')
                                .text(studentNames[i])
                        )
                );

                if(conceptCloud.userModel[studentNames[i]].metadata.flashy) {
                    $('.' + listType + ' li:eq(' + i + ')').prepend('<i class="notify flashy fa fa-exclamation-circle"></i>');
                }

                if(conceptCloud.userModel[studentNames[i]].metadata.fancy) {
                    $('.' + listType + ' li:eq(' + i + ')').prepend('<i class="notify fancy fa fa-star"></i>');
                }
            }
        }

        function buildStudentList (userModel) {
            var studentNames = [];
            for(var name in userModel){
                studentNames.push(name);
            }

            studentNames.sort();
            studentList = $('ul.student-list');

            printStudentList(studentList, studentNames, 'complete');

        }

        //List with students which used a specified concept
        function buildFilteredStudentList (conceptName) {
            var studentNames = [];
            for(var name in conceptCloud.userModel){
                for(var concept in conceptCloud.userModel[name].data) {
                    if (conceptName === concept) {
                        studentNames.push(name);
                    }
                }
            }
            studentNames.sort();
            studentList = $('ul.filtered');

            printStudentList(studentList, studentNames, 'filtered');
        }

        // StudentTagCloud -> Farben zuweisen
        function applyStudentFilter(studentName) {
            var model = conceptCloud.userModel[studentName];
            currentStudent = studentName;

            // Wrapper App Class zu student-view ändern, damit Legende angezeigt wird
            if($('#wrapper-app').hasClass('teacher-view')) {
                $('#wrapper-app').removeClass('teacher-view');
                $('#wrapper-app').addClass('student-view');
            }

            deleteTagColors();

            $('text').each(function() {
                // add user specific colors to tags
                d3.select(this).classed(color(model, d3.select(this).text()), true);

            });
        }

        function deleteTagColors() {
            $('text').each(function() {
                // delete color/default classes from tags
                if (($(this).attr('class')) === 'default') {
                    d3.select(this).classed('default', false);
                } else if ($(this).attr('class') === 'green') {
                    d3.select(this).classed('green', false);
                } else if ($(this).attr('class') === 'yellow') {
                    d3.select(this).classed('yellow', false);
                } else if ($(this).attr('class') === 'red') {
                    d3.select(this).classed('red', false);
                }
            });
        }

        function setTagsToDefault() {
            // delete all classes from tags
            deleteTagColors();
            // add default class to all tags
            $('text').each(function() {
                d3.select(this).classed('default', true);
            });
        }

        function applyPhaseFilter(phaseName){
            if(phaseName === null){
                conceptCloud.conceptModels.buildGeneralConcepts(conceptCloud.userModel, conceptCloud.generalModel);
            } else {
                phaseName = matchPhases(phaseName);
                if(phaseName != undefined) {
                    var filteredData = {};
                    for(var concept in conceptCloud.generalModel.data){
                        if(conceptCloud.generalModel.data[concept][phaseName] !== undefined){
                            filteredData[concept] = {};
                            filteredData[concept].frequency = conceptCloud.generalModel.data[concept][phaseName].frequency;
                        }
                    }
                }

                conceptCloud.conceptModels.buildGeneralModel(filteredData, false).then(function(generalModel){
                    conceptCloud.conceptModels.buildGeneralConcepts(conceptCloud.userModel, generalModel);
                });
            }
        }

        function applyAppFilter(appId){
            if(appId === null){
                conceptCloud.conceptModels.buildGeneralConcepts(conceptCloud.userModel, conceptCloud.generalModel);
            } else {
                var app = findApp(appId);
                var filteredData = {};
                for(var concept in conceptCloud.generalModel.data){
                    for(var phase in conceptCloud.generalModel.data[concept]){
                        if(conceptCloud.generalModel.data[concept][phase][app] !== undefined){
                            if(filteredData[concept] === undefined) {
                                filteredData[concept] = {};
                                filteredData[concept].frequency = 0;
                            }
                            filteredData[concept].frequency += conceptCloud.generalModel.data[concept][phase][app].frequency;
                        }
                    }
                }

                conceptCloud.conceptModels.buildGeneralModel(filteredData, false).then(function(generalModel){
                    conceptCloud.conceptModels.buildGeneralConcepts(conceptCloud.userModel, generalModel);
                });
            }
        }

        function setCurrentStudent(name) {
            currentStudent = name;
        }

        function returnCurrentStudent() {
            return currentStudent;
        }

        function removeCurrentStudent(){
            currentStudent = null;
        }

        function returnTagFrequency(tag) {
            return conceptCloud.generalModel.data[tag].frequency;
        }

        function returnQuestions() {
            return reflectionQuestions;
        }

        function countInArray(array, what) {
            var count = 0;
            for (var i = 0; i < array.length; i++) {

                if(array[i].indexOf(what) > -1) {
                    count++;
                }
            }
            return count;
        }

        function millisecondsBetween(date1, date2) {
            var _date1 = new Date(date1);
            var _date2 = new Date(date2);
            return _date2.getTime() - _date1.getTime();
        }

        function uniqueRandom() {
            // refill the array if needed
            if (!uniqueRandoms.length) {
                for (var i = 0; i < numRandoms; i++) {
                    uniqueRandoms.push(i);
                }
            }
            var index = Math.floor(Math.random() * uniqueRandoms.length);
            var val = uniqueRandoms[index];

            // now remove that value from the array
            uniqueRandoms.splice(index, 1);

            return val;

        }
    }

})(golab.tools.conceptCloud);
