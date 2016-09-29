function Application(environmentHandlers, config, loadingIndicator, errorDisplay) {
    var actionLogger = environmentHandlers.actionLogger;
    var notificationClient = environmentHandlers.notificationClient;
    var storageHandler = environmentHandlers.storageHandler;
    var metadataHandler = environmentHandlers.metadataHandler;
    var languageHandler = environmentHandlers.languageHandler;
    var app = this;
    var useServerForDebug = false;
    app.serviceUrlLocal = "http://localhost:3090/analytics/aggregate_concept_maps";
    app.serviceUrl = "http://golab-dev.collide.info/analytics/aggregate_concept_maps";
    var DEBUG = true;

    var toolbar = Toolbar($('#toolbar'), languageHandler, {
        showLabels: false
    });

    notificationClient.register(function (notification) {
        return true;
    }, handleNotification);

    console.log('The application started. Yay!');
    actionLogger.logApplicationStarted();

    toolbar.onActionClick('refresh', function () {
        try {
            console.log("... refreshing Data...");
            refreshData();
        } catch (error) {
            handleError(error, languageHandler.getMessage('refresh_error'));
        }
    });

    function handleNotification(notification) {
        console.log('Notification received: %o', notification);
        notificationDisplay.display(notification);
    }


    function handleError(error, userMessage) {
        userMessage = userMessage || languageHandler.getMessage('error_occured');
        errorDisplay.show(userMessage);
        if (error.stack) {
            console.error(error.stack);
        } else {
            console.error(error);
        }
        loadingIndicator.hide();
    }

    function requestAggregatedConceptMap(conceptMaps) {
        if (conceptMaps == undefined) {
            console.warn("[ConceptMapAggregation] conceptMaps === undefined. No concept maps found.");
            handleError(conceptMaps.error, "No Concept Maps found. Check if there are Concept Maps saved in the vault. Only the teacher can see the vault-space.");
        }
        if (conceptMaps.error) {
            console.warn("[ConceptMapAggregation] No concept maps found.");
            console.log(conceptMaps.error);
            handleError(conceptMaps.error, "No Concept Maps found. Check if there are Concept Maps saved in the vault. Only the teacher can see the vault-space.");
        }
        var parameters = {};
        var nodeMapping = {};

        var reqData = createRequestObject(conceptMaps, parameters, nodeMapping);

        $.ajax({
            url: app.serviceUrl,
            type: "POST",
            data: JSON.stringify(reqData),
            contentType: "application/json",
            success: function (data) {
                visualizeFromJSON(data);
            },
            error: function (err) {
                console.log("[ConceptMapAggregation] " + err);
            }
        })
    }

    function triggerTestNotification(actionLogger, metadataHandler) {
        // there is an agent on the server that sends test notifications to clients
        // that send action logs with the `objectType` of the `target` set to
        // `notification-test`

        // we modify the target in the metadata so the test agent receives the log
        var originalTarget = metadataHandler.getTarget();
        metadataHandler.setTarget({
            'objectType': 'notification-test',
            'id': 'xxx'
        });

        // sending the log, which will trigger the test agent on the server
        actionLogger.log('access', {
            id: 'object',
            objectType: 'testObject',
            displayName: 'hi'
        });

        // resetting metadata
        metadataHandler.setTarget(originalTarget);
    }


    function loadDataFromFile(data) {
        createChart(data);
    }

    function createChart(data) {
        data = MG.convert.date(data, 'date');

        MG.data_graphic({
            //title: "Line Chart",
            description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
            data: data,
            width: 700,
            height: 400,
            right: 40,
            target: document.getElementById('content'),
            x_accessor: 'date',
            y_accessor: 'value'
        });
    }


    function createRequestObject(conceptMaps, parameters, nodeMapping) {

        //collide.info/widgetLabOwner/lab=254

        var data = {
            conceptMaps: conceptMaps,
            parameters: parameters,
            nodeMapping: nodeMapping
        }
        return data;
    }

    function readConceptMap(storageHandler, i, content, ids, cb) {
        console.log("[CMAggregation] readConceptMap (i=" + i + ")");
        var resourceId = ids[i];
        if (i === ids.length) {
            console.log("[CMAggregation] i==ids.length (-->" + ids.length + ")");
            console.log(content);
            cb(content);
            return;
        }
        if (resourceId == undefined) {
            cb({error: "[CMAggregation.readConceptMap] Found undefined resource id - cannot retrieve concent map."})
            return;
        }
        storageHandler.readResource(resourceId, function (error, object) {
            if (error) {
                console.log("Error reading resource");
                console.log(error);
            } else {
                console.log("[CMAggregation] read CM: " + object);

                if (object.metadata.generator.objectType === "application" && object.metadata.generator.displayName === "conceptmapper" && object.metadata.target.objectType !== "configuration") {
                    content.push(object.content);
                }
            }
            return readConceptMap(storageHandler, (i + 1), content, ids, cb);
        })
    }

    function refreshData() {
        if (metadataHandler.getContext() == "standalone") {
            getDemoResponse();

            if (useServerForDebug) {
                var reqData = getTestData();
                $.ajax({
                        //url: app.serviceUrlLocal,
                        url: app.serviceUrl,
                        type: "POST",
                        data: JSON.stringify(reqData),
                        contentType: "application/json",
                        success: function (data) {
                            console.log("[ConceptMapAggregation App] RECEIVED DATA:");
                            console.log(data);
                            visualizeFromJSON(data);
                        },
                        error: function (err) {
                            console.log("[ConceptMapAggregation] " + err);
                        }
                    }
                );
            } else {
                var response = getDemoResponse();
                visualizeFromJSON(response);
            }
        }

        else if (metadataHandler.getContext() == "preview") {

            var gadgetUrl = gadgets.util.getUrlParameters().url;

            if (useServerForDebug) {
                var reqData = getTestData();
                $.ajax({
                        //url: app.serviceUrlLocal,
                        url: app.serviceUrl,
                        type: "POST",
                        data: JSON.stringify(reqData),
                        contentType: "application/json",
                        success: function (data) {
                            console.log("[ConceptMapAggregation App] RECEIVED DATA:");
                            console.log(data);
                            visualizeFromJSON(data);
                        },
                        error: function (err) {
                            console.log("[ConceptMapAggregation] " + err);
                        }
                    }
                );
            } else {
                var response = getDemoResponse();
                visualizeFromJSON(response);
            }

        } else {

            var content = [];
            storageHandler.listResourceIds(function (error, ids) {
                console.log("[CMAggregation] listResourceIds found ids: " + ids);
                if (ids.length == 0) {
                    console.log("No resources found.");
                    handleError(data.error, "No Concept Maps found. Check if there are Concept Maps saved in the vault. Only the teacher can see the vault-space.");
                } else if (error) {
                    console.log("Error reading resource IDs");
                } else {
                    readConceptMap(storageHandler, 0, content, ids, requestAggregatedConceptMap);
                }

            });
        }
    }

    loadingIndicator.hide();

    $(window).resize(function () {
        var titleHeight = $("#toolbar-wrapper").outerHeight() + $("#title-bar").outerHeight() + 4;
        $("#canvas").css("height", window.innerHeight - titleHeight);
    });
    refreshData();

    function getDemoResponse() {
        return {
            "metadata": {
                "title": "union_graph_by_label.gml",
                "time": "0",
                "directed": "true",
                "measures": [{
                    "title": "Occurences",
                    "description": "number_of_occurences",
                    "class": "node",
                    "property": "oc",
                    "type": "double"
                }, {"title": "Weight", "description": "none", "class": "edge", "property": "weight", "type": "double"}],
                "edgeproperties": [{"weight": ["string"]}],
                "type": "",
                "nodeproperties": [{"oc": ["string"]}]
            },
            "data": {
                "edges": [{"id": "0", "weight": 1, "source": "5", "target": "0"}, {
                    "id": "1",
                    "weight": 1,
                    "source": "0",
                    "target": "6"
                }, {"id": "2", "weight": 1, "source": "6", "target": "3"}, {
                    "id": "3",
                    "weight": 1,
                    "source": "6",
                    "target": "4"
                }, {"id": "4", "weight": 1, "source": "2", "target": "6"}, {
                    "id": "5",
                    "weight": 1,
                    "source": "2",
                    "target": "1"
                }, {"id": "6", "weight": 1, "source": "6", "target": "1"}, {
                    "id": "7",
                    "weight": 1,
                    "source": "7",
                    "target": "4"
                }, {"id": "8", "weight": 1, "source": "4", "target": "1"}, {
                    "id": "9",
                    "weight": 2,
                    "source": "8",
                    "target": "2"
                }, {"id": "10", "weight": 1, "source": "2", "target": "1"}, {
                    "id": "11",
                    "weight": 1,
                    "source": "7",
                    "target": "10"
                }, {"id": "12", "weight": 1, "source": "9", "target": "10"}, {
                    "id": "13",
                    "weight": 1,
                    "source": "10",
                    "target": "1"
                }, {"id": "14", "weight": 1, "source": "7", "target": "3"}, {
                    "id": "15",
                    "weight": 1,
                    "source": "9",
                    "target": "3"
                }, {"id": "16", "weight": 3, "source": "7", "target": "4"}, {
                    "id": "17",
                    "weight": 1,
                    "source": "9",
                    "target": "11"
                }, {"id": "18", "weight": 2, "source": "7", "target": "14"}, {
                    "id": "19",
                    "weight": 1,
                    "source": "14",
                    "target": "13"
                }, {"id": "20", "weight": 22, "source": "0", "target": "6"}],
                "nodes": [{"id": "0", "oc": 2, "label": "OSMOSE"}, {"id": "1", "oc": 4, "label": "ENERGY"}, {
                    "id": "2",
                    "oc": 4,
                    "label": "PRESSURE"
                }, {"id": "3", "oc": 4, "label": "TEMPERATURE"}, {"id": "4", "oc": 5, "label": "SALT"}, {
                    "id": "5",
                    "oc": 2,
                    "label": "OSMOTIC POWER PLANT"
                }, {"id": "6", "oc": 3, "label": "WATER"}, {"id": "7", "oc": 4, "label": "SALTWATER"}, {
                    "id": "8",
                    "oc": 1,
                    "label": "PRESSURE EXCHANGER"
                }, {"id": "9", "oc": 4, "label": "FRESHWATER"}, {
                    "id": "10",
                    "oc": 2,
                    "label": "CONCENTRATION"
                }, {"id": "11", "oc": 1, "label": "MEMBRANE"}, {"id": "12", "oc": 3, "label": "FILTER"}, {
                    "id": "13",
                    "oc": 2,
                    "label": "POWER"
                }, {"id": "14", "oc": 1, "label": "CONCENTRATION DIFFERENCE"}, {
                    "id": "15",
                    "oc": 1,
                    "label": "DIFFUSION"
                }]
            }
        };
    };

    function getTestData() {
        return testData;
    }

    var cm1 = {
        "concepts": [{
            "id": "f8baf25a-b502-4465-e0cd-dbb92c74a44a",
            "content": "Osmose",
            "x": 236,
            "y": 175.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "6eb6d5bd-42ad-420e-a045-da11bf500e7d",
            "content": "energy",
            "x": 281,
            "y": 504.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "c853663e-ca16-4097-b789-c5d1cf463a77",
            "content": "pressure",
            "x": 601,
            "y": 314.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "5be3ea3f-5d07-43b9-b219-eb9c08c77911",
            "content": "temperature",
            "x": 158,
            "y": 314.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "55b6f5bd-4f47-4a74-d068-8ad2164f063b",
            "content": "salt",
            "x": 436,
            "y": 353.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "2f5389d8-08c0-4821-e461-0e68fb07f289",
            "content": "osmotic power plant",
            "x": 18,
            "y": 129.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "37ac64cd-5f97-4a8c-9147-f2d03f672e15",
            "content": "water",
            "x": 349,
            "y": 255.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }],
        "relations": [{
            "id": "81f2b228-d13e-4d94-a79b-cdedf2e77f1d",
            "source": "2f5389d8-08c0-4821-e461-0e68fb07f289",
            "target": "f8baf25a-b502-4465-e0cd-dbb92c74a44a",
            "content": "uses"
        }, {
            "id": "c881076e-8003-4206-c687-58999e01f771",
            "source": "f8baf25a-b502-4465-e0cd-dbb92c74a44a",
            "target": "37ac64cd-5f97-4a8c-9147-f2d03f672e15",
            "content": "uses"
        }, {
            "id": "151279f8-9479-4d6f-f2d9-b998e7a1d94d",
            "source": "37ac64cd-5f97-4a8c-9147-f2d03f672e15",
            "target": "5be3ea3f-5d07-43b9-b219-eb9c08c77911",
            "content": "has"
        }, {
            "id": "2da51914-2522-42de-9329-163c6cac3651",
            "source": "37ac64cd-5f97-4a8c-9147-f2d03f672e15",
            "target": "55b6f5bd-4f47-4a74-d068-8ad2164f063b",
            "content": "has an amount of"
        }, {
            "id": "c0711757-441c-4f8d-b7d3-82e32a3ae217",
            "source": "c853663e-ca16-4097-b789-c5d1cf463a77",
            "target": "37ac64cd-5f97-4a8c-9147-f2d03f672e15",
            "content": "is a"
        }, {
            "id": "792d08e5-d148-414d-c253-1d0a58a34ee7",
            "source": "c853663e-ca16-4097-b789-c5d1cf463a77",
            "target": "6eb6d5bd-42ad-420e-a045-da11bf500e7d",
            "content": "influences"
        }, {
            "id": "0d1d138d-1883-4013-d5fd-5bac5e18aacd",
            "source": "37ac64cd-5f97-4a8c-9147-f2d03f672e15",
            "target": "6eb6d5bd-42ad-420e-a045-da11bf500e7d",
            "content": "generates"
        }]
    };
    var cm2 = {
        "concepts": [{
            "id": "b2f029dc-14f3-43a9-bd1b-c77fdec19c2d",
            "content": "saltwater",
            "x": 67,
            "y": 163.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "093118cf-8b81-4430-aa16-6073ee8d6154",
            "content": "salt",
            "x": 185,
            "y": 317.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "5342d1ab-5a75-49b0-a8d6-4923200a7924",
            "content": "pressure exchanger",
            "x": 533,
            "y": 302.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "b5b05ecd-7a27-4e68-ac97-6cd5b46e021e",
            "content": "temperature",
            "x": 155,
            "y": 614.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "f3eb9b24-4660-406c-d388-015ea373b7c3",
            "content": "freshwater",
            "x": 572,
            "y": 201.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "a8059f0a-2773-4112-c1ea-56a6245e55a5",
            "content": "pressure",
            "x": 633,
            "y": 424.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "4269cd33-455d-40d8-d9ec-75ca2b9317a1",
            "content": "energy",
            "x": 291,
            "y": 257.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "59424e67-fa9c-470a-da0c-0aa1689f611e",
            "content": "concentration",
            "x": 238,
            "y": 162.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }],
        "relations": [{
            "id": "e170e50c-e6e5-4784-b122-a6f4165ea66b",
            "source": "b2f029dc-14f3-43a9-bd1b-c77fdec19c2d",
            "target": "093118cf-8b81-4430-aa16-6073ee8d6154",
            "content": "has"
        }, {
            "id": "5b4073ad-1d00-4e38-9540-33a324e26ae9",
            "source": "093118cf-8b81-4430-aa16-6073ee8d6154",
            "target": "4269cd33-455d-40d8-d9ec-75ca2b9317a1",
            "content": "influences"
        }, {
            "id": "60653da3-71ed-4a04-b492-1092702ccb35",
            "source": "5342d1ab-5a75-49b0-a8d6-4923200a7924",
            "target": "a8059f0a-2773-4112-c1ea-56a6245e55a5",
            "content": "is a"
        }, {
            "id": "dbc7c716-d824-4bc1-e5fd-41f3246b6a6c",
            "source": "a8059f0a-2773-4112-c1ea-56a6245e55a5",
            "target": "4269cd33-455d-40d8-d9ec-75ca2b9317a1",
            "content": "influences"
        }, {
            "id": "f657b720-8e3f-4e30-b9e0-2c6c8ff7de92",
            "source": "b2f029dc-14f3-43a9-bd1b-c77fdec19c2d",
            "target": "59424e67-fa9c-470a-da0c-0aa1689f611e",
            "content": "has"
        }, {
            "id": "e39dddf3-9440-42d9-f9fa-ae161dbf7b5d",
            "source": "f3eb9b24-4660-406c-d388-015ea373b7c3",
            "target": "59424e67-fa9c-470a-da0c-0aa1689f611e",
            "content": "has"
        }, {
            "id": "dd358c25-b443-435a-fdfe-ac79e1b5d11c",
            "source": "59424e67-fa9c-470a-da0c-0aa1689f611e",
            "target": "4269cd33-455d-40d8-d9ec-75ca2b9317a1",
            "content": "influences"
        }, {
            "id": "0e6065d7-058f-4824-87d3-6d02af8c2539",
            "source": "b2f029dc-14f3-43a9-bd1b-c77fdec19c2d",
            "target": "b5b05ecd-7a27-4e68-ac97-6cd5b46e021e",
            "content": "has"
        }, {
            "id": "0cca026e-d787-486c-9bfa-9e1011726200",
            "source": "f3eb9b24-4660-406c-d388-015ea373b7c3",
            "target": "b5b05ecd-7a27-4e68-ac97-6cd5b46e021e",
            "content": "has"
        }, {
            "id": "943bc43d-0b43-464a-af20-3516bc1ed6e8",
            "source": "b5b05ecd-7a27-4e68-ac97-6cd5b46e021e",
            "target": "4269cd33-455d-40d8-d9ec-75ca2b9317a1",
            "content": "influences"
        }]
    };
    var cm3 = {
        "concepts": [{
            "id": "111fcae3-dae9-4027-f3c3-ad6409664f23",
            "content": "saltwater",
            "x": 128,
            "y": 229.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "df59b37c-2570-4a14-c933-c2f43b1411a7",
            "content": "freshwater",
            "x": 459,
            "y": 206.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "4bbe8966-1c7b-4a92-a007-84776fd566fb",
            "content": "membrane",
            "x": 237,
            "y": 220.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "d6cb80a2-ac57-49e6-98f3-e1ea84255e6f",
            "content": "filter",
            "x": 465,
            "y": 366.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "028a1cb8-4ae2-4544-c55f-2977315abfdf",
            "content": "salt",
            "x": 292,
            "y": 130.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "cb2dce21-ed13-4abd-b7ba-83ef905a2e03",
            "content": "power",
            "x": 480,
            "y": 511.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "b546cb02-ee66-4b6e-bf39-c6898bedf8fa",
            "content": "concentration difference",
            "x": 91,
            "y": 500.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }],
        "relations": [{
            "id": "ea429414-8a90-4fb4-cd34-072d3ea39d91",
            "source": "111fcae3-dae9-4027-f3c3-ad6409664f23",
            "target": "028a1cb8-4ae2-4544-c55f-2977315abfdf",
            "content": "has"
        }, {
            "id": "17843cfe-8933-4c6d-efe0-d82ad6b2070b",
            "source": "df59b37c-2570-4a14-c933-c2f43b1411a7",
            "target": "4bbe8966-1c7b-4a92-a007-84776fd566fb",
            "content": "diffuses through"
        }, {
            "id": "228e9a0a-d0ce-4d1a-f91b-1d78c380605b",
            "source": "df59b37c-2570-4a14-c933-c2f43b1411a7",
            "target": "d6cb80a2-ac57-49e6-98f3-e1ea84255e6f",
            "content": "flows through"
        }, {
            "id": "8d7247dd-fdcd-4eeb-b7be-07a6c500274e",
            "source": "111fcae3-dae9-4027-f3c3-ad6409664f23",
            "target": "d6cb80a2-ac57-49e6-98f3-e1ea84255e6f",
            "content": "flows through"
        }, {
            "id": "1948e318-3ad1-467c-ed6f-0c4fde71616a",
            "source": "111fcae3-dae9-4027-f3c3-ad6409664f23",
            "target": "b546cb02-ee66-4b6e-bf39-c6898bedf8fa",
            "content": "has"
        }, {
            "id": "523a59e5-427b-46ef-ea6e-704a636eb537",
            "source": "df59b37c-2570-4a14-c933-c2f43b1411a7",
            "target": "b546cb02-ee66-4b6e-bf39-c6898bedf8fa",
            "content": "has"
        }, {
            "id": "f6e0a719-7e89-420a-8c38-e6d929a21559",
            "source": "b546cb02-ee66-4b6e-bf39-c6898bedf8fa",
            "target": "cb2dce21-ed13-4abd-b7ba-83ef905a2e03",
            "content": "generates"
        }]
    };
    var cm4 = {
        "concepts": [{
            "id": "5fe1baaa-020c-4b96-e41f-cf57b2790590",
            "content": "diffusion",
            "x": 181,
            "y": 199.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "d5f1d36b-0143-41f4-b3a5-63f3a0388913",
            "content": "water",
            "x": 435,
            "y": 132.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "f734fd1d-8980-4331-b033-dc2283ea6704",
            "content": "osmotic power plant",
            "x": 701,
            "y": 373.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "cb7f2c55-7054-437b-91d6-bf2af882bad6",
            "content": "energy",
            "x": 600,
            "y": 548.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "560033ff-3531-41c5-de67-b76e429ec412",
            "content": "freshwater",
            "x": 319,
            "y": 242.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "54536697-1814-413b-84d1-ac1e89ff8388",
            "content": "saltwater",
            "x": 531,
            "y": 261.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "f07c4737-93e0-46f1-ff6c-18eb5a2aa4b6",
            "content": "osmose",
            "x": 662,
            "y": 147.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "86119208-8bb9-4a4e-96fd-d46fe725b0fe",
            "content": "concentration",
            "x": 392,
            "y": 360.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }],
        "relations": [{
            "id": "c57bd69d-e5bd-4277-a0bf-e63dcdefc8d2",
            "source": "f07c4737-93e0-46f1-ff6c-18eb5a2aa4b6",
            "target": "d5f1d36b-0143-41f4-b3a5-63f3a0388913",
            "content": "uses"
        }, {
            "id": "3f4a293a-7c72-4655-9db5-f3589d123e6f",
            "source": "5fe1baaa-020c-4b96-e41f-cf57b2790590",
            "target": "d5f1d36b-0143-41f4-b3a5-63f3a0388913",
            "content": "uses"
        }, {
            "id": "ea0b9521-b1bb-4619-fff1-34707af58bca",
            "source": "f734fd1d-8980-4331-b033-dc2283ea6704",
            "target": "f07c4737-93e0-46f1-ff6c-18eb5a2aa4b6",
            "content": "uses"
        }, {
            "id": "11631a2c-4cc1-49d8-d901-c59b08f8f97f",
            "source": "f734fd1d-8980-4331-b033-dc2283ea6704",
            "target": "cb7f2c55-7054-437b-91d6-bf2af882bad6",
            "content": "generates"
        }, {
            "id": "77d8ad78-a904-47b3-c24e-92ed29b4c706",
            "source": "d5f1d36b-0143-41f4-b3a5-63f3a0388913",
            "target": "560033ff-3531-41c5-de67-b76e429ec412",
            "content": "is"
        }, {
            "id": "4974eb27-1bc2-4fc9-af6b-22db23327bc3",
            "source": "d5f1d36b-0143-41f4-b3a5-63f3a0388913",
            "target": "54536697-1814-413b-84d1-ac1e89ff8388",
            "content": "is"
        }, {
            "id": "c2fe3e8e-360b-4278-80ea-660d65d68ab0",
            "source": "560033ff-3531-41c5-de67-b76e429ec412",
            "target": "86119208-8bb9-4a4e-96fd-d46fe725b0fe",
            "content": "has different"
        }, {
            "id": "4ec2f45e-f3b8-4902-eb63-6f70e07ceec8",
            "source": "54536697-1814-413b-84d1-ac1e89ff8388",
            "target": "86119208-8bb9-4a4e-96fd-d46fe725b0fe",
            "content": "has different"
        }, {
            "id": "a64f9094-97ae-439c-b122-3fc108b6d39b",
            "source": "86119208-8bb9-4a4e-96fd-d46fe725b0fe",
            "target": "cb7f2c55-7054-437b-91d6-bf2af882bad6",
            "content": "generates"
        }]
    };
    var cm5 = {
        "concepts": [{
            "id": "147dc710-d778-495f-ab1f-dac2034b4c4a",
            "content": "energy",
            "x": 232,
            "y": 210.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "ca3a884c-8fc7-4618-9014-662b5f1b6efd",
            "content": "filter",
            "x": 540,
            "y": 287.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "bbd463da-c253-47bb-96fe-02c931c3169f",
            "content": "salt",
            "x": 242,
            "y": 404.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "73ee2242-4f35-473f-9dc5-486e271a86b5",
            "content": "water",
            "x": 465,
            "y": 469.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "c33e9c61-f149-44b8-c91e-428e357c0174",
            "content": "pressure",
            "x": 394,
            "y": 173.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "0482461b-787e-4ab3-8a76-70f09c3119d2",
            "content": "temperature",
            "x": 240,
            "y": 555.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }],
        "relations": [{
            "id": "503a75a9-1deb-4037-b2fe-489b272281fa",
            "source": "73ee2242-4f35-473f-9dc5-486e271a86b5",
            "target": "0482461b-787e-4ab3-8a76-70f09c3119d2",
            "content": "has"
        }, {
            "id": "3c263fe9-3d92-411d-c6dd-bec37a9c7c6b",
            "source": "73ee2242-4f35-473f-9dc5-486e271a86b5",
            "target": "bbd463da-c253-47bb-96fe-02c931c3169f",
            "content": "has"
        }, {
            "id": "4d9acbb5-4d37-494b-8bab-5a19f46fd439",
            "source": "73ee2242-4f35-473f-9dc5-486e271a86b5",
            "target": "ca3a884c-8fc7-4618-9014-662b5f1b6efd",
            "content": "flows through"
        }, {
            "id": "5ff4abcd-0113-45f9-89d5-42871f3426b3",
            "source": "c33e9c61-f149-44b8-c91e-428e357c0174",
            "target": "73ee2242-4f35-473f-9dc5-486e271a86b5",
            "content": "influences"
        }, {
            "id": "d9384fc1-8cf4-4453-db7e-de258b04b361",
            "source": "73ee2242-4f35-473f-9dc5-486e271a86b5",
            "target": "147dc710-d778-495f-ab1f-dac2034b4c4a",
            "content": "generates"
        }]
    };
    var cm6 = {
        "concepts": [{
            "id": "5b53c42f-2ac2-4b6f-966b-8587c44ed94b",
            "content": "saltwater",
            "x": 115,
            "y": 183.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "6f50f9e4-cf9c-4c98-ecb2-ba5ceb84ae13",
            "content": "freshwater",
            "x": 586,
            "y": 173.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "95eb32ad-d7b0-43c4-9ed5-c00b56127196",
            "content": "salt",
            "x": 242,
            "y": 335.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "3f52bde7-14e0-4941-f2d7-a089da637c0b",
            "content": "filter",
            "x": 369,
            "y": 141.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "5083c2a6-5b44-427e-81d8-7f00c7857b01",
            "content": "power",
            "x": 355,
            "y": 537.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "b3c4a6dc-bf1e-489b-aecd-08cb95aba203",
            "content": "temperature",
            "x": 553,
            "y": 342.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }, {
            "id": "14903a4b-0a2c-4e29-cbc7-c87e2c49c2cd",
            "content": "pressure",
            "x": 714,
            "y": 549.75,
            "type": "ut_tools_conceptmapper_conceptSelector",
            "colorClass": "ut_tools_conceptmapper_blue"
        }],
        "relations": [{
            "id": "bef1db8b-62dd-43b7-e132-d55c2926f1e5",
            "source": "14903a4b-0a2c-4e29-cbc7-c87e2c49c2cd",
            "target": "5083c2a6-5b44-427e-81d8-7f00c7857b01",
            "content": "generates"
        }, {
            "id": "392c9aac-5a88-4fee-a1b0-c307d342a5c0",
            "source": "5b53c42f-2ac2-4b6f-966b-8587c44ed94b",
            "target": "95eb32ad-d7b0-43c4-9ed5-c00b56127196",
            "content": "has"
        }, {
            "id": "bf7353d5-5e1d-4b90-ae05-633b994121b5",
            "source": "5b53c42f-2ac2-4b6f-966b-8587c44ed94b",
            "target": "b3c4a6dc-bf1e-489b-aecd-08cb95aba203",
            "content": "has"
        }, {
            "id": "2ec5c7a4-3898-4415-adf4-853c640a6ae1",
            "source": "6f50f9e4-cf9c-4c98-ecb2-ba5ceb84ae13",
            "target": "b3c4a6dc-bf1e-489b-aecd-08cb95aba203",
            "content": "has"
        }, {
            "id": "9734f077-6f08-4efc-c4f2-48083306b25a",
            "source": "3f52bde7-14e0-4941-f2d7-a089da637c0b",
            "target": "6f50f9e4-cf9c-4c98-ecb2-ba5ceb84ae13",
            "content": "filters"
        }, {
            "id": "cee92163-57bb-4305-bf05-7a1599f8ae3f",
            "source": "3f52bde7-14e0-4941-f2d7-a089da637c0b",
            "target": "5b53c42f-2ac2-4b6f-966b-8587c44ed94b",
            "content": "filters"
        }, {
            "id": "f3eff9c6-18d6-4b58-dbb1-9bf1e4ab6772",
            "source": "5b53c42f-2ac2-4b6f-966b-8587c44ed94b",
            "target": "14903a4b-0a2c-4e29-cbc7-c87e2c49c2cd",
            "content": "generates"
        }, {
            "id": "a4e31538-6441-4b13-b40b-87e7defaf82a",
            "source": "6f50f9e4-cf9c-4c98-ecb2-ba5ceb84ae13",
            "target": "14903a4b-0a2c-4e29-cbc7-c87e2c49c2cd",
            "content": "generates"
        }]
    };

    var testData = createRequestObject([cm1, cm2, cm3, cm4, cm5, cm6], {}, {});
}


