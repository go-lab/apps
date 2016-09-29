(function (conceptCloud) {
    conceptCloud.ResourceController = ResourceController;

    function ResourceController() {
        var storageHandler = conceptCloud.retrieverStorageHandler;
        var metadataHandler = conceptCloud.retrieverMetadataHandler;

        // var forwardUrl = "http://golab-dev.collide.info/aggregation/concept_aggregation";
        // var updateUrl = "http://golab-dev.collide.info/aggregation/check_updates";
        // var actionUrl = "http://golab-dev.collide.info/aggregation/concept_action";

        var forwardUrl = "http://golab.collide.info/aggregation/concept_aggregation";
        var updateUrl = "http://golab.collide.info/aggregation/check_updates";
        var actionUrl = "http://golab.collide.info/aggregation/concept_action";

        // var forwardUrl = "http://localhost:3090/aggregation/concept_aggregation";
        // var updateUrl = "http://localhost:3090/aggregation/check_updates";
        // var actionUrl = "http://localhost:3090/aggregation/concept_action";

        return {
            forward: forward,
            update: update,
            getReflectionData: getReflectionData
        };


        /*
         get ILS data
         if !aggegregatedView
         check for cached ConceptCloud
         if cached conceptCloud
         callback with cached conceptCloud
         else

         build vaultObject
         send vaultObject to aggregationService
         success: callback with aggregationService result
         else
         build vaultObject
         send vaultObject to aggregationService
         success: callback with aggregationService result
         */


        function forward(callback) {

            // get ILS data
            retrieveIlsData(function () {
                console.log("[ConceptCloud] context: " + metadataHandler.getContext());
                if (metadataHandler.getContext() !== 'graasp' && metadataHandler.getContext() !== 'preview') {

                    console.log("[ConceptCloud] not in 'graasp', check for cached conceptCloud");

                    if (conceptCloud.useCache) {
                        //check for cached ConceptCloud
                        conceptCloud.conceptController.loadLatestConceptCloud(function (content, message) {


                            if (content == null) {
                                console.log("[ConceptCloud] No conceptCloud in cache");
                                // no cached conceptCloud -> get data from vault
                                // build VaultObject
                                // send vaultObject to aggregationService
                                // success: callback with aggregationService result
                                getResources(function (content) {
                                    requestService(content, callback);
                                });
                            } else if (message == "outdated") {
                                console.log("[ConceptCloud] Outdated conceptCloud in cache, try to retrieve newest data")
                                getResources(function (new_content) {
                                    if (new_content == null) {
                                        callback(content);
                                    } else {
                                        requestService(new_content, callback);
                                    }

                                });
                            } else {
                                console.log("[ConceptCloud] found conceptCloud in cache");
                                console.log(content);
                                callback(content);
                            }
                        });
                    } else {
                        console.log("[ConceptCloud] cache is disabled");
                        getResources(function (new_content) {
                            requestService(new_content, callback);
                        });
                    }

                } else {

                    console.log("[ConceptCloud] in 'graasp' or 'preview' mode, don't check for cached conceptCloud");
                    // build VaultObject
                    // send vaultObject to aggregationService
                    // success: callback with aggregationService result

                    getResources(function (content) {
                        requestService(content, callback);
                    });
                }
            });
        }


        function retrieveIlsData(callback) {

            if (metadataHandler.getContext() === 'ils' || metadataHandler.getContext() === 'graasp') {
                metadataHandler.getILSStructure(function (err, result) {
                    if (err) {
                        console.log('[ConceptCloud] metadataHandler.getILSStructure');
                        console.log('ERROR ' + JSON.stringify(err, null, 4));
                        conceptCloud.errorHandler.handleError(err, languageHandler.getMessage('err_could_not_access_ils_structure'));

                    } else {
                        conceptCloud.ilsStructure = result;
                        conceptCloud.ilsPhases = getIlsPhases(result);
                        conceptCloud.ilsApps = getIlsApps(result);
                        conceptCloud.ilsPhasesWithApps = getIlsPhasesWithApps(result);
                        console.log("[ConceptCloud] ils structure ready...");
                        callback();
                    }
                });
            } else {
                // get dummy ils data in preview or standalone mode
                // Preview and standalone data
                var standaloneIlsStructure = {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "url": "http://graasp.eu/spaces/9",
                    "displayName": "DummyILSStructure",
                    "phases": [{
                        "id": "56937d5d7ec4757d0bffc0e9",
                        "type": "Vault",
                        "displayName": "Orientation",
                        "apps": [{
                            "id": "56937d987ec4757d0bffc1ea",
                            "displayName": "Wiki App",
                            "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                            "itemType": "Application",
                            "appType": "WidgetGadget"
                        }, {
                            "id": "56937da87ec4757d0bffc224",
                            "displayName": "Concept Mapper",
                            "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml",
                            "itemType": "Application",
                            "appType": "WidgetGadget"
                        }]
                    }, {
                        "id": "56937d5d7ec4757d0bffc0ee",
                        "type": "Vault",
                        "displayName": "Conceptualisation",
                        "apps": [{
                            "id": "56937f397ec4757d0bffe924",
                            "displayName": "Wiki App",
                            "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                            "itemType": "Application",
                            "appType": "WidgetGadget"
                        }]
                    }, {
                        "id": "56937d5d7ec4757d0bffc0f3",
                        "type": "Vault",
                        "displayName": "Investigation",
                        "apps": [{
                            "id": "569381277ec4757d0b001fb8",
                            "displayName": "Hypothesis Scratchpad",
                            "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml",
                            "itemType": "Application",
                            "appType": "WidgetGadget"
                        }]
                    }, {
                        "id": "56937d5d7ec4757d0bffc0f8",
                        "type": "Vault",
                        "displayName": "Conclusion",
                        "apps": []
                    }, {
                        "id": "56937d5d7ec4757d0bffc0fd",
                        "type": "Vault",
                        "displayName": "Discussion",
                        "apps": [{
                            "id": "5694ce939379a211a432d7a2",
                            "displayName": "Concept Cloud",
                            "url": "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml",
                            "itemType": "Application",
                            "appType": "WidgetGadget"
                        }]
                    }],
                    "apps": []
                };
                conceptCloud.ilsStructure = standaloneIlsStructure;
                conceptCloud.ilsPhases = getIlsPhases(standaloneIlsStructure);
                conceptCloud.ilsApps = getIlsApps(standaloneIlsStructure);
                conceptCloud.ilsPhasesWithApps = getIlsPhasesWithApps(standaloneIlsStructure);

                console.log("[ConceptCloud] Standalone/preview ils structure ready...");
                callback();

            }

        }

        function update(callback) {
            console.log("[ConceptCloud] check for updates!");

            var actor = metadataHandler.getActor();
            var timestamp = '0';

            if (conceptCloud.timestamp !== undefined) {
                timestamp = conceptCloud.timestamp;
            }
            // console.log(metadataHandler.getContext());
            switch (metadataHandler.getContext()) {
                /*  case "standalone":
                 console.log("Standalone mode");
                 callback(generateTestData(metadataHandler.getActor()));
                 break; */
                case "preview":
                    console.log("Standalone mode");
                    callback(generateTestData(metadataHandler.getActor()));
                    break;
                default:
                    $.ajax({
                        type: "POST",
                        url: updateUrl,
                        data: JSON.stringify({actor: actor, timestamp: timestamp}),
                        contentType: "application/json",
                        success: function (data) {
                            callback(data);
                        },
                        error: function () {
                            console.warn("POST update failed")
                        }
                    });
            }
        }

        function requestService(content, callback) {
            var vaultResourceObject = {};
            vaultResourceObject.published = new Date().toISOString();
            vaultResourceObject.actor = metadataHandler.getActor();
            vaultResourceObject.target = metadataHandler.getTarget();
            vaultResourceObject.generator = metadataHandler.getGenerator();
            vaultResourceObject.provider = metadataHandler.getProvider();
            vaultResourceObject.content = content;
            // for caching aggregatedView option is needed to get data and save data from all students
            // vaultResourceObject.aggregatedView = conceptCloud.aggregatedView;
            vaultResourceObject.aggregatedView = true;
            vaultResourceObject.ils = {};
            vaultResourceObject.ils.structure = conceptCloud.ilsStructure;
            vaultResourceObject.ils.apps = conceptCloud.ilsApps;
            vaultResourceObject.ils.phases = conceptCloud.ilsPhases;
            vaultResourceObject.ils.phasesWithApps = conceptCloud.ilsPhasesWithApps;

            switch (metadataHandler.getContext()) {
                case "preview":
                    console.log("Preview mode");
                    generateTestData(metadataHandler.getActor(), callback);
                    break;

                default:
                    $.ajax({
                        type: "POST",
                        url: forwardUrl,
                        data: JSON.stringify(vaultResourceObject),
                        contentType: "application/json",
                        success: function (data) {

                            getNow(function (dateNow) {
                                data.metadata.generated = dateNow;
                                data.metadata.dataSource = "vault";
                                callback(data);
                            });

                        },
                        error: function () {
                            console.warn("POST forward failed");
                        }
                    });
            }
        }


        // get all phases from ILS Structure
        function getIlsPhases(data) {
            var phaseNames = [];
            for (var phase in data.phases) {
                if (phaseNames.indexOf(data.phases[phase].displayName) == -1) {
                    phaseNames.push(data.phases[phase].displayName + '@' + data.phases[phase].id);
                }
            }
            console.log("...phases...");
            return phaseNames;

        }

        // get all apps within ILS Structure
        function getIlsApps(data) {

            var apps = [];
            for (var phase in data.phases) {
                for (var app in data.phases[phase].apps) {
                    // app = displayName@appID
                    // exclude conceptCloud
                    if (data.phases[phase].apps[app].url !== "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml" && data.phases[phase].apps[app].url !== "http://golab.collide.info/client/tools/concept_cloud/gadget.xml") {
                        var app = data.phases[phase].apps[app].displayName + "@" + data.phases[phase].apps[app].id;
                        if (apps.indexOf(app) == -1) {
                            apps.push(app);
                        }
                    }

                }
            }
            console.log("...apps...");
            return apps;
        }

        // get all phases with apps within ILS Structure
        function getIlsPhasesWithApps(data) {
            var phaseWithApps = [];
            for (var phase in data.phases) {
                if (data.phases[phase].apps.length > 0) {
                    for (var app in data.phases[phase].apps) {
                        // exclude conceptCloud
                        if (data.phases[phase].apps[app].url !== "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml" && data.phases[phase].apps[app].url !== "http://golab.collide.info/client/tools/concept_cloud/gadget.xml") {
                            if (phaseWithApps.indexOf(data.phases[phase].displayName) == -1) {
                                phaseWithApps.push(data.phases[phase].displayName + '@' + data.phases[phase].id);
                            }
                        }
                    }
                }
            }
            console.log("...phasesWithApps...");
            return phaseWithApps;
        }


        // Get Reflection Data
        function getReflectionData(concepts, callback) {
            var content = {};

            content.userID = metadataHandler.getActor().id;
            content.ilsId = metadataHandler.getProvider().id;
            content.concepts = concepts;

            switch (metadataHandler.getContext()) {
                /*  case "standalone":
                 console.log("Standalone mode");
                 callback(generateTestData(metadataHandler.getActor()));
                 break; */
                case "preview":
                    console.log("Preview mode");
                    callback(generateTestData(metadataHandler.getActor()));
                    break;

                default:
                    $.ajax({
                        type: "POST",
                        url: actionUrl,
                        data: JSON.stringify(content),
                        contentType: "application/json",
                        success: function (data) {
                            callback(data);
                        },
                        error: function () {
                            console.warn("POST getReflectionData failed");
                            conceptCloud.errorHandler.handleError("POST getReflectionData failed", languageHandler.getMessage('err_could_not_get_questions'));
                        }
                    });
            }
        }


        // Get Resources
        function getResources(callback) {
            var content = [];
            if (metadataHandler.getContext() === "standalone") {
                console.log("Standalone mode");
                generateVaultTestData(metadataHandler.getActor(), function (content) {
                    callback(content);
                });
                // callback(generateVaultTestData(metadataHandler.getActor()));
            } else if (metadataHandler.getContext() === "preview") {
                console.log("Preview mode");
                generateTestData(metadataHandler.getActor(), function (content) {
                    callback(content);
                });
                // callback(generateTestData(metadataHandler.getActor()));
            } else {

                // get resource Metadata
                storageHandler.listResourceMetaDatas(function (error, metaDatas) {
                    if (error) {
                        console.log("Error reading resource metadata");
                    } else {
                        // filter resourceData
                        filterMetaData(metaDatas, function (ids) {
                            // read resourceData
                            readVaultData(0, content, ids, callback);
                        });
                    }
                });

                // filter retrieved metaData
                function filterMetaData(metaDatas, callback) {
                   // console.log(metaDatas);
                    var resourceIds = [];

                    for (var i in metaDatas) {

                        if (metaDatas[i].metadata.generator.objectType === "application"
                            && (metaDatas[i].metadata.target.objectType !== "configuration" && metaDatas[i].metadata.target.objectType !== "config"
                            && metaDatas[i].metadata.target.objectType !== "conceptCloudCache" && metaDatas[i].metadata.target.objectType !== "conceptCloud"
                            && metaDatas[i].metadata.target.objectType !== "conceptClouds")) {

                            resourceIds.push(metaDatas[i].id);

                        }
                    }
                    // console.log(resourceIds);
                    callback(resourceIds);
                }

                // read data from vault
                function readVaultData(i, content, ids, callback) {

                    var resourceId = ids[i];

                    if (i === ids.length) {
                        console.log("[ConceptCloud] reading complete!");
                        console.log(content);
                        callback(content);
                        return;
                    }

                    if (resourceId === undefined) {
                        console.error("resourceId is undefined!");
                        return;
                    }

                    // read resource
                    console.log("[ConceptCloud] try to read vaultData #" + i + " (id:  " + resourceId);
                    storageHandler.readResource(resourceId, function (error, object) {
                        if (error) {
                            console.error("Error reading resource with id " + resourceId);
                            console.error(error);
                        } else {
                            content.push(object);
                        }
                        return readVaultData((i + 1), content, ids, callback);
                    });
                }

            }
        }
    }

})(golab.tools.conceptCloud);

function getNow(callback) {
    now = Date.now();
    callback(now);
}


function generateTestData(actor, callback) {
    // console.log(actor.displayName);
    var replacedTestData = JSON.parse(JSON.stringify(testData).replace("Neuer", actor.displayName).replace("55e575a81b9081bd86fa7e04", actor.id));
    // console.log(replacedTestData);
    callback(replacedTestData);
    // return replacedTestData;
}

function generateVaultTestData(actor, callback) {
    // console.log(actor.displayName);
    var replacedTestDataName = replaceAll(JSON.stringify(testVaultData), "testName", actor.displayName);
    var replacedTestData = JSON.parse(replaceAll(replacedTestDataName, "9999999999999999999999", actor.id));
    // console.log("TestData: ");
    // console.log(replacedTestData);
    callback(replacedTestData);
    // return replacedTestData;
}

var testVaultData =
    [
        {
            "id": "56937d7e7ec4757d0bffc1af",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "40b3e8e4-f7f9-4a24-c67c-8f2b5850d945",
                    "displayName": "unnamed ConceptCloud configuration",
                    "objectType": "ConceptCloud configuration"
                },
                "generator": {
                    "id": "56937d6d7ec4757d0bffc14f",
                    "displayName": "ConceptCloud",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/concept_cloud/gadget.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Discussion",
                    "inquiryPhase": "Discussion",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0fd",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "name@http://localhost:63342/",
                    "displayName": "Name",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:01:37.223Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "56937d7e7ec4757d0bffc1af"
            },
            "content": {
                "defaultTitle": {
                    "value": "Unnamed post"
                }
            }
        },
        {
            "id": "56937dc47ec4757d0bffc286",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "ac78487f-acc5-49b3-fdba-79fe5d9902eb",
                    "displayName": "unnamed collide wiki config",
                    "objectType": "collide wiki config"
                },
                "generator": {
                    "id": "56937d987ec4757d0bffc1ea",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "9999999999999999999999",
                    "displayName": "testName",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:02:47.771Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "56937dc47ec4757d0bffc286"
            },
            "content": {
                "collaborative": {
                    "value": "false"
                }
            }
        },
        {
            "id": "56937dc97ec4757d0bffc2bf",
            "metadata": {
                "id": "56937dc97ec4757d0bffc2bf",
                "storageType": "folder",
                "target": {
                    "id": "0d98b332-7a40-4eb1-ffb1-0c68576b660a",
                    "displayName": "Concept map",
                    "objectType": "conceptMap"
                },
                "generator": {
                    "id": "56937da87ec4757d0bffc224",
                    "displayName": "conceptmapper",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "9999999999999999999999",
                    "displayName": "testName",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:56:50.548Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": {
                "concepts": [
                    {
                        "id": "3283bf81-c340-4760-fc26-993e6f95543f",
                        "content": "Erde",
                        "x": 454,
                        "y": 346.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "5ab971f3-8d35-485c-c479-f26479743682",
                        "content": "Pluto",
                        "x": 681,
                        "y": 223.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "c086e242-8703-4e45-fde1-66bc01e4cf0d",
                        "content": "saturn",
                        "x": 270,
                        "y": 158.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "d3d44c1d-19a0-4dc5-f2c6-180d385213fd",
                        "content": "galaxis",
                        "x": 212,
                        "y": 290.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "89a6058a-134f-425e-86a0-b00eefe852e2",
                        "content": "moon",
                        "x": 458,
                        "y": 212.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "69af49ba-d277-4a0d-8338-cb3fa98d039b",
                        "content": "sky",
                        "x": 264,
                        "y": 409.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "71094a2f-2f11-4786-cacb-a4d23469d20c",
                        "content": "solar system",
                        "x": 113,
                        "y": 215.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }
                ],
                "relations": [
                    {
                        "id": "07185ea2-c021-4bea-cdb6-5322f2f9093e",
                        "source": "c086e242-8703-4e45-fde1-66bc01e4cf0d",
                        "target": "89a6058a-134f-425e-86a0-b00eefe852e2",
                        "content": "is bigger than"
                    },
                    {
                        "id": "46461534-1c23-430f-8ecc-825584218b6c",
                        "source": "89a6058a-134f-425e-86a0-b00eefe852e2",
                        "target": "d3d44c1d-19a0-4dc5-f2c6-180d385213fd",
                        "content": "is a"
                    },
                    {
                        "id": "94724ba9-7f9c-4f51-da59-12cc2aceed53",
                        "source": "c086e242-8703-4e45-fde1-66bc01e4cf0d",
                        "target": "d3d44c1d-19a0-4dc5-f2c6-180d385213fd",
                        "content": "belongs to"
                    },
                    {
                        "id": "b2676bb7-57ab-42a2-ca4f-1bdd741ea6cd",
                        "source": "69af49ba-d277-4a0d-8338-cb3fa98d039b",
                        "target": "d3d44c1d-19a0-4dc5-f2c6-180d385213fd",
                        "content": "is part of"
                    },
                    {
                        "id": "8806fdad-63e3-4f6d-94e6-b7e6b9a95ad4",
                        "source": "3283bf81-c340-4760-fc26-993e6f95543f",
                        "target": "d3d44c1d-19a0-4dc5-f2c6-180d385213fd",
                        "content": "belongs to"
                    },
                    {
                        "id": "66cfcea3-b022-4919-ee00-21bacd30fcb5",
                        "source": "89a6058a-134f-425e-86a0-b00eefe852e2",
                        "target": "3283bf81-c340-4760-fc26-993e6f95543f",
                        "content": "is smaller than"
                    },
                    {
                        "id": "73f92198-a558-4fc4-a4ec-c0fa6660aaa9",
                        "source": "5ab971f3-8d35-485c-c479-f26479743682",
                        "target": "89a6058a-134f-425e-86a0-b00eefe852e2",
                        "content": "is bigger than"
                    },
                    {
                        "id": "cf603648-78d5-4bbf-a1d6-02bd28fc8863",
                        "source": "d3d44c1d-19a0-4dc5-f2c6-180d385213fd",
                        "target": "71094a2f-2f11-4786-cacb-a4d23469d20c",
                        "content": "is part of"
                    }
                ]
            }
        },
        {
            "id": "56937ddf7ec4757d0bffc2d9",
            "metadata": {
                "id": "56937ddf7ec4757d0bffc2d9",
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937d987ec4757d0bffc1ea",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "9999999999999999999999",
                    "displayName": "testName",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:05:21.071Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": {
                "title": "testNames Wiki",
                "isIndex": true,
                "currentRevision": {
                    "author": "testName",
                    "content": "A star is a luminous sphere of plasma held together by its own gravity.",
                    "timestamp": "Mon Jan 11 2016 11:05:21 GMT+0100 (Mitteleuropäische Zeit)",
                    "id": "1"
                },
                "revisions": [
                    {
                        "author": "testName",
                        "content": "A star is a luminous sphere of plasma held together by its own gravity.",
                        "timestamp": "Mon Jan 11 2016 11:05:21 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    },
                    {
                        "id": "0",
                        "content": "Stern\nPlanet\nSonne",
                        "author": "testName",
                        "timestamp": "2016-01-11T10:03:14.000Z"
                    }
                ],
                "author": "testName",
                "id": "56937ddf7ec4757d0bffc2d9"
            }
        },
        {
            "id": "56937f697ec4757d0bffef93",
            "metadata": {
                "id": "56937f697ec4757d0bffef93",
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937f397ec4757d0bffe924",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Conceptualisation",
                    "inquiryPhase": "Conceptualisation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0ee",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "9999999999999999999999",
                    "displayName": "testName",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:13:26.197Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": {
                "title": "testNames Wiki2",
                "isIndex": true,
                "currentRevision": {
                    "author": "testName",
                    "content": "For at least a portion of its life, a star shines due to thermonuclear fusion of hydrogen into helium in its core, releasing energy that traverses the star's interior and then radiates into outer space.",
                    "timestamp": "Mon Jan 11 2016 11:13:26 GMT+0100 (Mitteleuropäische Zeit)",
                    "id": "2"
                },
                "revisions": [
                    {
                        "author": "testName",
                        "content": "For at least a portion of its life, a star shines due to thermonuclear fusion of hydrogen into helium in its core, releasing energy that traverses the star's interior and then radiates into outer space. .",
                        "timestamp": "Mon Jan 11 2016 11:13:26 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "2"
                    },
                    {
                        "author": "testName",
                        "content": "For at least a portion of its life, a star shines due to thermonuclear fusion of hydrogen into helium in its core, releasing energy that traverses the star's interior and then radiates into outer space.Pluto is also a planet.",
                        "timestamp": "2016-01-11T10:12:28.000Z",
                        "id": "1"
                    },
                    {
                        "id": "0",
                        "content": "For at least a portion of its life, a star shines due to thermonuclear fusion of hydrogen into helium in its core, releasing energy that traverses the star's interior and then radiates into outer space. ",
                        "author": "testName",
                        "timestamp": "2016-01-11T10:09:48.000Z"
                    }
                ],
                "author": "testName",
                "id": "56937f697ec4757d0bffef93"
            }
        },
        {
            "id": "5693826b7ec4757d0b003ccd",
            "metadata": {
                "id": "5693826b7ec4757d0b003ccd",
                "storageType": "folder",
                "target": {
                    "id": "6c115ec5-8392-41ae-e46f-57de28799386",
                    "displayName": "Hypotheses",
                    "objectType": "hypotheses"
                },
                "generator": {
                    "id": "569381277ec4757d0b001fb8",
                    "displayName": "hypothesis scratchpad",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Investigation",
                    "inquiryPhase": "Investigation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0f3",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "9999999999999999999999",
                    "displayName": "testName",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T11:00:03.316Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": [
                {
                    "id": "c066014e-3b14-4161-afda-80c80ce5e82c",
                    "elements": [
                        {
                            "text": "IF",
                            "type": "conditional"
                        },
                        {
                            "text": "the sun",
                            "type": "free"
                        },
                        {
                            "text": "is larger than",
                            "type": "conditional"
                        },
                        {
                            "text": "than",
                            "type": "free"
                        },
                        {
                            "text": "the earth",
                            "type": "free"
                        },
                        {
                            "text": "THEN",
                            "type": "conditional"
                        },
                        {
                            "text": "the earth",
                            "type": "free"
                        },
                        {
                            "text": "is smaller than",
                            "type": "conditional"
                        },
                        {
                            "text": "the sun",
                            "type": "free"
                        }
                    ],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }
            ]
        },
        {
            "id": "569384177ec4757d0b005a07",
            "metadata": {
                "id": "569384177ec4757d0b005a07",
                "storageType": "folder",
                "target": {
                    "id": "520a4988-35be-4473-c06e-26fd48251331",
                    "displayName": "Concept map",
                    "objectType": "conceptMap"
                },
                "generator": {
                    "id": "56937da87ec4757d0bffc224",
                    "displayName": "conceptmapper",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569384117ec4757d0b005941",
                    "displayName": "Kevin",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:52:03.529Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": {
                "concepts": [
                    {
                        "id": "f0cb6c01-909d-4864-eff7-2c806023a7a8",
                        "content": "neptun",
                        "x": 103,
                        "y": 357.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "5255561d-60cc-448e-99f0-d2a8d4532db1",
                        "content": "sun",
                        "x": 520,
                        "y": 234.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "6684f9b1-732d-42ba-a36e-1b5bc0009700",
                        "content": "venus",
                        "x": 705,
                        "y": 124.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "5c680eda-0a1c-43aa-b488-a822483772d6",
                        "content": "moon",
                        "x": 341,
                        "y": 365.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "73a86cce-fa3d-4d3e-cb49-efec12e0ede3",
                        "content": "earth",
                        "x": 533,
                        "y": 360.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "170bd629-8c92-4411-c945-e433e0d6f3b5",
                        "content": "mercury",
                        "x": 51,
                        "y": 228.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "5d1b383f-e9ce-46a2-aead-ff6c5a41ad00",
                        "content": "planet",
                        "x": 433,
                        "y": 164.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }
                ],
                "relations": [
                    {
                        "id": "58413168-9a80-428f-8563-7edabbbb543f",
                        "source": "f0cb6c01-909d-4864-eff7-2c806023a7a8",
                        "target": "5d1b383f-e9ce-46a2-aead-ff6c5a41ad00",
                        "content": "is a"
                    },
                    {
                        "id": "f13ebc18-ae40-4af9-f478-b0ca2c132963",
                        "source": "170bd629-8c92-4411-c945-e433e0d6f3b5",
                        "target": "5d1b383f-e9ce-46a2-aead-ff6c5a41ad00",
                        "content": "is a"
                    },
                    {
                        "id": "5258ef01-142f-4215-ac1f-d504bab169b7",
                        "source": "f0cb6c01-909d-4864-eff7-2c806023a7a8",
                        "target": "170bd629-8c92-4411-c945-e433e0d6f3b5",
                        "content": "is bigger than"
                    },
                    {
                        "id": "45e06f93-bbad-4408-d710-4d6910262e4a",
                        "source": "f0cb6c01-909d-4864-eff7-2c806023a7a8",
                        "target": "5c680eda-0a1c-43aa-b488-a822483772d6",
                        "content": "is smaller than"
                    },
                    {
                        "id": "2229ef10-b0c4-4107-8361-4278b3b29551",
                        "source": "5255561d-60cc-448e-99f0-d2a8d4532db1",
                        "target": "73a86cce-fa3d-4d3e-cb49-efec12e0ede3",
                        "content": "is bigger than"
                    },
                    {
                        "id": "62d7f3a5-7779-4c24-9b8c-eb412152dfaf",
                        "source": "6684f9b1-732d-42ba-a36e-1b5bc0009700",
                        "target": "5d1b383f-e9ce-46a2-aead-ff6c5a41ad00",
                        "content": "is a"
                    },
                    {
                        "id": "da7b120b-90d2-4294-b6c2-50c4b719d7e6",
                        "source": "6684f9b1-732d-42ba-a36e-1b5bc0009700",
                        "target": "5255561d-60cc-448e-99f0-d2a8d4532db1",
                        "content": "is smaller than"
                    },
                    {
                        "id": "e4e20feb-8cd4-4e93-e0be-50c90f9c9379",
                        "source": "5c680eda-0a1c-43aa-b488-a822483772d6",
                        "target": "73a86cce-fa3d-4d3e-cb49-efec12e0ede3",
                        "content": "is smaller than"
                    }
                ]
            }
        },
        {
            "id": "5693841e7ec4757d0b005a13",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937d987ec4757d0bffc1ea",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569384117ec4757d0b005941",
                    "displayName": "Kevin",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:29:53.900Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "5693841e7ec4757d0b005a13"
            },
            "content": {
                "title": "Kevin Wiki",
                "isIndex": true,
                "currentRevision": {
                    "id": "0",
                    "content": "For at least a portion of its life, a star shines due to thermonuclear fusion of hydrogen into helium in its core, releasing energy that traverses the star's interior and then radiates into outer space.",
                    "author": "Kevin",
                    "timestamp": "Mon Jan 11 2016 11:29:53 GMT+0100 (Mitteleuropäische Zeit)"
                },
                "revisions": [
                    {
                        "id": "0",
                        "content": "For at least a portion of its life, a star shines due to thermonuclear fusion of hydrogen into helium in its core, releasing energy that traverses the star's interior and then radiates into outer space.",
                        "author": "Kevin",
                        "timestamp": "Mon Jan 11 2016 11:29:53 GMT+0100 (Mitteleuropäische Zeit)"
                    }
                ],
                "author": "Kevin"
            }
        },
        {
            "id": "5693844c7ec4757d0b005b64",
            "metadata": {
                "id": "5693844c7ec4757d0b005b64",
                "storageType": "folder",
                "target": {
                    "id": "71e7d34b-75f7-4d1a-e933-4f8d256259a2",
                    "displayName": "Hypotheses",
                    "objectType": "hypotheses"
                },
                "generator": {
                    "id": "569381277ec4757d0b001fb8",
                    "displayName": "hypothesis scratchpad",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Investigation",
                    "inquiryPhase": "Investigation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0f3",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569384117ec4757d0b005941",
                    "displayName": "Kevin",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:38:57.293Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": [
                {
                    "id": "4714eace-151c-4d30-cc3b-d62d49e642e1",
                    "elements": [
                        {
                            "text": "IF",
                            "type": "conditional"
                        },
                        {
                            "text": "star",
                            "type": "free"
                        },
                        {
                            "text": "is larger than",
                            "type": "conditional"
                        },
                        {
                            "text": "sun",
                            "type": "free"
                        },
                        {
                            "text": "THEN",
                            "type": "conditional"
                        },
                        {
                            "text": "earth",
                            "type": "free"
                        },
                        {
                            "text": "is smaller than",
                            "type": "conditional"
                        },
                        {
                            "text": "star",
                            "type": "free"
                        }
                    ],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                },
                {
                    "id": "e7ddbcdb-f6ef-4eb7-ee51-c6554642e240",
                    "elements": [
                        {
                            "text": "IF",
                            "type": "conditional"
                        },
                        {
                            "text": "saturn",
                            "type": "free"
                        },
                        {
                            "text": "is larger than",
                            "type": "conditional"
                        },
                        {
                            "text": "jupiter",
                            "type": "free"
                        },
                        {
                            "text": "THEN",
                            "type": "conditional"
                        },
                        {
                            "text": "mars",
                            "type": "free"
                        },
                        {
                            "text": "is smaller than",
                            "type": "conditional"
                        },
                        {
                            "text": "jupiter",
                            "type": "free"
                        }
                    ],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }
            ]
        },
        {
            "id": "569386be7ec4757d0b006b56",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937f397ec4757d0bffe924",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Conceptualisation",
                    "inquiryPhase": "Conceptualisation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0ee",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569384117ec4757d0b005941",
                    "displayName": "Kevin",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:41:05.914Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "569386be7ec4757d0b006b56"
            },
            "content": {
                "title": "Kevins Wiki2",
                "isIndex": true,
                "currentRevision": {
                    "id": "0",
                    "content": "A star's life begins with the gravitational collapse of a gaseous nebula of material composed primarily of hydrogen, along with helium and trace amounts of heavier elements. Once the stellar core is sufficiently dense, hydrogen becomes steadily converted into helium through nuclear fusion, releasing energy in the process.",
                    "author": "Kevin",
                    "timestamp": "Mon Jan 11 2016 11:41:05 GMT+0100 (Mitteleuropäische Zeit)"
                },
                "revisions": [
                    {
                        "id": "0",
                        "content": "A star's life begins with the gravitational collapse of a gaseous nebula of material composed primarily of hydrogen, along with helium and trace amounts of heavier elements. Once the stellar core is sufficiently dense, hydrogen becomes steadily converted into helium through nuclear fusion, releasing energy in the process.",
                        "author": "Kevin",
                        "timestamp": "Mon Jan 11 2016 11:41:05 GMT+0100 (Mitteleuropäische Zeit)"
                    }
                ],
                "author": "Kevin"
            }
        },
        {
            "id": "5693871a7ec4757d0b00700b",
            "metadata": {
                "id": "5693871a7ec4757d0b00700b",
                "storageType": "folder",
                "target": {
                    "id": "8c1eaaa2-ff5d-4acd-842a-49fb0f6abe33",
                    "displayName": "Concept map",
                    "objectType": "conceptMap"
                },
                "generator": {
                    "id": "56937da87ec4757d0bffc224",
                    "displayName": "conceptmapper",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569387127ec4757d0b006f3e",
                    "displayName": "Mandy",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:45:02.241Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": {
                "concepts": [
                    {
                        "id": "e8ab1406-df19-4512-cf80-59fd0dd819f8",
                        "content": "star",
                        "x": 310,
                        "y": 141.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "e11324a7-baa1-428c-a7fa-42fe9f130468",
                        "content": "pluto",
                        "x": 717,
                        "y": 185.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "10bc2b71-e006-4435-d491-2e1915ccec53",
                        "content": "sun",
                        "x": 184,
                        "y": 107.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "8c96cefb-f86b-4282-dad0-0d5c88207843",
                        "content": "jupiter",
                        "x": 289,
                        "y": 277.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "4395f2c4-4901-4ad0-b76c-dc57b44411e8",
                        "content": "earth",
                        "x": 422,
                        "y": 352.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "eaaf3efd-e79c-4355-cf5e-2e74ee1557b1",
                        "content": "saturn",
                        "x": 173,
                        "y": 170.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    },
                    {
                        "id": "c8bf5c7c-aecb-4709-93e6-0a3b166d4375",
                        "content": "planet",
                        "x": 535,
                        "y": 114.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }
                ],
                "relations": [
                    {
                        "id": "95846a8f-c121-4f41-f997-cd22c5aef873",
                        "source": "10bc2b71-e006-4435-d491-2e1915ccec53",
                        "target": "e8ab1406-df19-4512-cf80-59fd0dd819f8",
                        "content": "is a"
                    },
                    {
                        "id": "7f119d1b-8eb5-406e-fca5-5f427b3f7bcf",
                        "source": "eaaf3efd-e79c-4355-cf5e-2e74ee1557b1",
                        "target": "c8bf5c7c-aecb-4709-93e6-0a3b166d4375",
                        "content": "is a"
                    },
                    {
                        "id": "c9f948c1-8c91-4248-852e-1ae3872cae99",
                        "source": "8c96cefb-f86b-4282-dad0-0d5c88207843",
                        "target": "c8bf5c7c-aecb-4709-93e6-0a3b166d4375",
                        "content": "is a"
                    },
                    {
                        "id": "5c3b4830-378c-4d90-9fcc-5a82f352da59",
                        "source": "4395f2c4-4901-4ad0-b76c-dc57b44411e8",
                        "target": "c8bf5c7c-aecb-4709-93e6-0a3b166d4375",
                        "content": "is a"
                    },
                    {
                        "id": "6f850c41-8362-44bd-84a6-0e9502f8c71f",
                        "source": "4395f2c4-4901-4ad0-b76c-dc57b44411e8",
                        "target": "8c96cefb-f86b-4282-dad0-0d5c88207843",
                        "content": "is smaller than"
                    },
                    {
                        "id": "bfb6e82b-6b30-46d4-e211-a5fd336076b1",
                        "source": "8c96cefb-f86b-4282-dad0-0d5c88207843",
                        "target": "eaaf3efd-e79c-4355-cf5e-2e74ee1557b1",
                        "content": "is bigger than"
                    },
                    {
                        "id": "5696781d-32bd-4de8-ad84-7cad0888433f",
                        "source": "e11324a7-baa1-428c-a7fa-42fe9f130468",
                        "target": "c8bf5c7c-aecb-4709-93e6-0a3b166d4375",
                        "content": "is a"
                    },
                    {
                        "id": "081bfb0d-2daa-464f-f9ca-f5b73bcabb2d",
                        "source": "e11324a7-baa1-428c-a7fa-42fe9f130468",
                        "target": "4395f2c4-4901-4ad0-b76c-dc57b44411e8",
                        "content": "is as big as"
                    }
                ]
            }
        },
        {
            "id": "569387237ec4757d0b007014",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937d987ec4757d0bffc1ea",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569387127ec4757d0b006f3e",
                    "displayName": "Mandy",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:42:46.795Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "569387237ec4757d0b007014"
            },
            "content": {
                "title": "Mandy Wiki",
                "isIndex": true,
                "currentRevision": {
                    "id": "0",
                    "content": "Binary and multi-star systems consist of two or more stars that are gravitationally bound, and generally move around each other in stable orbits. When two such stars have a relatively close orbit, their gravitational interaction can have a significant impact on their evolution.[4] Stars can form part of a much larger gravitationally bound structure, such as a star cluster or a galaxy.",
                    "author": "Mandy",
                    "timestamp": "Mon Jan 11 2016 11:42:46 GMT+0100 (Mitteleuropäische Zeit)"
                },
                "revisions": [
                    {
                        "id": "0",
                        "content": "Binary and multi-star systems consist of two or more stars that are gravitationally bound, and generally move around each other in stable orbits. When two such stars have a relatively close orbit, their gravitational interaction can have a significant impact on their evolution.[4] Stars can form part of a much larger gravitationally bound structure, such as a star cluster or a galaxy.",
                        "author": "Mandy",
                        "timestamp": "Mon Jan 11 2016 11:42:46 GMT+0100 (Mitteleuropäische Zeit)"
                    }
                ],
                "author": "Mandy"
            }
        },
        {
            "id": "569388147ec4757d0b007a2b",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937f397ec4757d0bffe924",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Conceptualisation",
                    "inquiryPhase": "Conceptualisation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0ee",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569387127ec4757d0b006f3e",
                    "displayName": "Mandy",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:46:47.378Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "569388147ec4757d0b007a2b"
            },
            "content": {
                "title": "Mandy Wiki2",
                "isIndex": true,
                "currentRevision": {
                    "id": "0",
                    "content": "Historically, stars have been important to civilizations throughout the world. They have been part of religious practices and used for celestial navigation and orientation. Many ancient astronomers believed that stars were permanently affixed to a heavenly sphere, and that they were immutable.",
                    "author": "Mandy",
                    "timestamp": "Mon Jan 11 2016 11:46:47 GMT+0100 (Mitteleuropäische Zeit)"
                },
                "revisions": [
                    {
                        "id": "0",
                        "content": "Historically, stars have been important to civilizations throughout the world. They have been part of religious practices and used for celestial navigation and orientation. Many ancient astronomers believed that stars were permanently affixed to a heavenly sphere, and that they were immutable.",
                        "author": "Mandy",
                        "timestamp": "Mon Jan 11 2016 11:46:47 GMT+0100 (Mitteleuropäische Zeit)"
                    }
                ],
                "author": "Mandy"
            }
        },
        {
            "id": "569388227ec4757d0b007d93",
            "metadata": {
                "id": "569388227ec4757d0b007d93",
                "storageType": "folder",
                "target": {
                    "id": "ce43ea37-3f5d-4b50-eae3-6e59738ef82b",
                    "displayName": "Hypotheses",
                    "objectType": "hypotheses"
                },
                "generator": {
                    "id": "569381277ec4757d0b001fb8",
                    "displayName": "hypothesis scratchpad",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Investigation",
                    "inquiryPhase": "Investigation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0f3",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "569387127ec4757d0b006f3e",
                    "displayName": "Mandy",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T10:47:33.270Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": [
                {
                    "id": "720922ab-6207-421f-fafa-0ff7d20de365",
                    "elements": [
                        {
                            "text": "IF",
                            "type": "conditional"
                        },
                        {
                            "text": "the sun",
                            "type": "free"
                        },
                        {
                            "text": "is larger than",
                            "type": "conditional"
                        },
                        {
                            "text": "the earth",
                            "type": "free"
                        },
                        {
                            "text": "THEN",
                            "type": "conditional"
                        },
                        {
                            "text": "the earth",
                            "type": "free"
                        },
                        {
                            "text": "is smaller than",
                            "type": "conditional"
                        },
                        {
                            "text": "the moon",
                            "type": "free"
                        }
                    ],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50
                }
            ]
        },
        {
            "id": "56939d346bf9876e27a26640",
            "metadata": {
                "id": "56939d346bf9876e27a26640",
                "storageType": "folder",
                "target": {
                    "id": "ac26b0a1-2331-4781-c6f4-a42923982600",
                    "displayName": "Concept map",
                    "objectType": "conceptMap"
                },
                "generator": {
                    "id": "56937da87ec4757d0bffc224",
                    "displayName": "conceptmapper",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "56939d2f6bf9876e27a2655c",
                    "displayName": "Test",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T12:27:05.058Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": {
                "concepts": [
                    {
                        "id": "f7a6ad7f-2ea8-487a-abfc-6240c94f4c68",
                        "content": "pluto",
                        "x": 692,
                        "y": 165.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }
                ],
                "relations": []
            }
        },
        {
            "id": "56939db06bf9876e27a26723",
            "metadata": {
                "id": "56939db06bf9876e27a26723",
                "storageType": "folder",
                "target": {
                    "id": "1bf6265f-c37d-4da1-cafd-35b4c60317bc",
                    "displayName": "Hypotheses",
                    "objectType": "hypotheses"
                },
                "generator": {
                    "id": "569381277ec4757d0b001fb8",
                    "displayName": "hypothesis scratchpad",
                    "objectType": "application",
                    "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Investigation",
                    "inquiryPhase": "Investigation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0f3",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "56939d2f6bf9876e27a2655c",
                    "displayName": "Test",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T12:27:29.936Z",
                "storageId": "56937d5d7ec4757d0bffc107"
            },
            "content": [
                {
                    "id": "c7de3969-e379-4261-9663-f5e4e32776ec",
                    "elements": [
                        {
                            "text": "constellations asterisms",
                            "type": "free"
                        },
                        {
                            "text": "pluto",
                            "type": "free"
                        }
                    ],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }
            ]
        },
        {
            "id": "56939f8e6bf9876e27a278ed",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937d987ec4757d0bffc1ea",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Orientation",
                    "inquiryPhase": "Orientation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0e9",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "56939d2f6bf9876e27a2655c",
                    "displayName": "Test",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T12:26:54.430Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "56939f8e6bf9876e27a278ed"
            },
            "content": {
                "title": "pluto",
                "isIndex": true,
                "currentRevision": {
                    "id": "0",
                    "content": "pluto",
                    "author": "Test",
                    "timestamp": "Mon Jan 11 2016 13:26:54 GMT+0100 (CET)"
                },
                "revisions": [
                    {
                        "id": "0",
                        "content": "pluto",
                        "author": "Test",
                        "timestamp": "Mon Jan 11 2016 13:26:54 GMT+0100 (CET)"
                    }
                ],
                "author": "Test"
            }
        },
        {
            "id": "56939fa46bf9876e27a27942",
            "metadata": {
                "storageType": "folder",
                "target": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "displayName": "collide wiki in Neu",
                    "objectType": "collide wiki"
                },
                "generator": {
                    "id": "56937f397ec4757d0bffe924",
                    "displayName": "collide wiki",
                    "objectType": "application",
                    "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                },
                "provider": {
                    "id": "56937d5c7ec4757d0bffc0d1",
                    "inquiryPhaseName": "Conceptualisation",
                    "inquiryPhase": "Conceptualisation",
                    "inquiryPhaseId": "56937d5d7ec4757d0bffc0ee",
                    "displayName": "Neu",
                    "objectType": "ils",
                    "url": "http://graasp.eu/spaces/56937d5c7ec4757d0bffc0d1"
                },
                "actor": {
                    "id": "56939d2f6bf9876e27a2655c",
                    "displayName": "Test",
                    "objectType": "graasp_student"
                },
                "published": "2016-01-11T12:27:16.235Z",
                "storageId": "56937d5d7ec4757d0bffc107",
                "id": "56939fa46bf9876e27a27942"
            },
            "content": {
                "title": "Pluto Text",
                "isIndex": true,
                "currentRevision": {
                    "id": "0",
                    "content": "pluto",
                    "author": "Test",
                    "timestamp": "Mon Jan 11 2016 13:27:16 GMT+0100 (CET)"
                },
                "revisions": [
                    {
                        "id": "0",
                        "content": "pluto",
                        "author": "Test",
                        "timestamp": "Mon Jan 11 2016 13:27:16 GMT+0100 (CET)"
                    }
                ],
                "author": "Test"
            }
        }
    ];

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

var testData = {
    "data": {
        "general": {
            "§concept": {
                "frequency": 4,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 4,
                    "conceptmapper": {"frequency": 4}
                }
            },
            "§caesar cipher": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },
            "§frequency analysis": {
                "frequency": 2,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 2,
                    "hypothesis scratchpad": {"frequency": 2}
                }
            },
            "§contained": {
                "frequency": 1,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                }
            },

            "§polyalphabetic": {
                "frequency": 1,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                }
            },
            "§encryption": {
                "frequency": 3,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                },
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 3,
                    "conceptmapper": {"frequency": 3}
                }
            },
            "§substitution": {
                "frequency": 1,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                }
            },
            "§trials": {
                "frequency": 2,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 2,
                    "hypothesis scratchpad": {"frequency": 2}
                }
            },
            "§vigenére": {
                "frequency": 5,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 5,
                    "conceptmapper": {"frequency": 5}
                }
            },
            "§sender": {
                "frequency": 2,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 2,
                    "conceptmapper": {"frequency": 2}
                }
            },
            "§receiver": {
                "frequency": 2,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 2,
                    "conceptmapper": {"frequency": 2}
                }
            },
            "§caesar": {
                "frequency": 5,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 5,
                    "conceptmapper": {"frequency": 5}
                }
            },
            "§letters": {
                "frequency": 1,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                }
            },
            "§alphabet": {
                "frequency": 2,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 2,
                    "hypothesis scratchpad": {"frequency": 2}
                },
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },
            "§encryptionen": {
                "frequency": 1,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                }
            },
            "§insecure": {
                "frequency": 1,
                "Conceptualisation@55db99928cbc42fef68e173a": {
                    "frequency": 1,
                    "hypothesis scratchpad": {"frequency": 1}
                }
            },
            "§monoalphabetic": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },

            "§symmetric encryption": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },
            "§translation": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },
            "§secrecy": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },
            "§decryption": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            },
            "§security": {
                "frequency": 1,
                "Conclusion@55d82222d2ca9952ebf02547": {
                    "frequency": 1,
                    "conceptmapper": {"frequency": 1}
                }
            }
        },
        "user": {
            "mertesacker@55e575a11b9081bd86fa7b8d": {
                "content": {
                    "§concept": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§caesar cipher": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§frequency analysis": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§contained": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}}
                },
                "metacontent": {
                    "conceptScore": 0.13793103448275862,
                    "flashy": false,
                    "fancy": false
                }
            },
            "Ronaldo@55e575a11b9081bd86fa7b8c": {
                "content": {

                    "§polyalphabetic": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§encryption": {
                        "Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}},
                        "Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}
                    },
                    "§substitution": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§trials": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§vigenére": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§sender": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§receiver": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§caesar": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}}
                },
                "metacontent": {
                    "conceptScore": 0.3448275862068966,
                    "flashy": false,
                    "fancy": true
                }
            },
            "Timm@55dc281dcd98cdd006ca5619": {
                "content": {"§ ": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}}},
                "metacontent": {
                    "conceptScore": 0.034482758620689655,
                    "flashy": true,
                    "fancy": false
                }
            },
            "Bürki@55e5759f1b9081bd86fa7b0a": {
                "content": {"§caesar": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}}},
                "metacontent": {
                    "conceptScore": 0.034482758620689655,
                    "flashy": true,
                    "fancy": false
                }
            },
            "Schweinsteiger@55e575a61b9081bd86fa7d9c": {
                "content": {
                    "§encryption": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§vigenére": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§concept": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}}
                },
                "metacontent": {
                    "conceptScore": 0.10344827586206896,
                    "flashy": true,
                    "fancy": false
                }
            },
            "Neuer@55e575a81b9081bd86fa7e04": {
                "content": {
                    "§frequency analysis": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§letters": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§alphabet": {
                        "Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}},
                        "Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}
                    },
                    "§trials": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},

                    "§polyalphabetic": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§encryptionen": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},
                    "§insecure": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}},

                    "§monoalphabetic": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§sender": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§caesar": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},

                    "§symmetric encryption": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§encryption": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§concept": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§translation": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§secrecy": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§decryption": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§vigenére": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§receiver": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}}
                },
                "metacontent": {
                    "conceptScore": 0.7931034482758621,
                    "flashy": false,
                    "fancy": true
                }
            },
            "Schürrle@55e5718e1b9081bd86fa7750": {
                "content": {
                    "§caesar": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§security": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§vigenére": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§concept": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}}
                },
                "metacontent": {
                    "conceptScore": 0.13793103448275862,
                    "flashy": false,
                    "fancy": false
                }
            },
            "test@55dc5c11cd98cdd006caa339": {
                "content": {
                    "§vigenére": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},
                    "§caesar": {"Conclusion@55d82222d2ca9952ebf02547": {"conceptmapper": {"verb": "Something"}}},

                    "§alphabet": {"Conceptualisation@55db99928cbc42fef68e173a": {"hypothesis scratchpad": {"verb": "Something"}}}
                },
                "metacontent": {
                    "conceptScore": 0.13793103448275862,
                    "flashy": false,
                    "fancy": false
                }
            }
        }
    },
    "metadata": {"timestamp": "2015-11-04T13:50:16.913Z"}
};