(function (cmDashboard) {
    cmDashboard.Application = Application;

    function Application(environmentHandlers, loadingIndicator, errorDisplay) {
        environmentHandlers.conceptMap.storageHandler.configureFilters(false, false, false, false);

        var actionLogger = environmentHandlers.conceptMap.actionLogger;
        var notificationClient = environmentHandlers.conceptMap.notificationClient;
        var storageHandler = environmentHandlers.conceptMap.storageHandler;
        var configStorageHandler = environmentHandlers.configuration.storageHandler;
        var metadataHandler = environmentHandlers.conceptMap.metadataHandler;
        var configMetadataHandler = environmentHandlers.configuration.metadataHandler;
        var languageHandler = environmentHandlers.languageHandler;

        var resourceController = cmDashboard.resourceController = cmDashboard.ResourceController();

        var graph       = cmDashboard.graph       = cmDashboard.Graph();
        var interaction = cmDashboard.interaction = cmDashboard.Interaction();


        var app = this;
        // app.serviceUrl = "http://localhost:3090/analytics/cm-dashboard/aggregation";
        app.serviceUrl = "http://golab-dev.collide.info/analytics/cm-dashboard/aggregation";

        var cm1, cm2, cm3, cm4;
        var toolbar = Toolbar($('#toolbar'), languageHandler, {
            showLabels: false
        });


        var hashmapResourceId;
        var resources_loaded;
        var isFirstRefresh = true;
        var unequal = true;

        var savedHashmap;


        console.log('The application started. Yay!');

        actionLogger.logApplicationStarted();

        toolbar.onActionClick('refresh', function () {
            try {
                console.log("... refreshing Data...");

                function refresh() {
                    var keys = [];
                    $('.key').each(function () {
                        keys.push($(this).data("key").toUpperCase());
                    });
                    var values = [];
                    $('.value').each(function () {
                        values.push($(this).text().toUpperCase());
                    });
                    for (var i = 0; i < keys.length; i++) {
                        for (var z = 0; z < values.length; z++) {
                            if (keys[i] === values[z]) {
                                console.log('****ADJUSTMENT****');
                                window.confirm('Please visualize or refresh after you delete the row with Item: ' + keys[i] + ' or replaced Item: ' + values[z] + '. You cant merge multi-Node dependencies at once')
                                unequal = false;
                            }
                        }
                    }

                    if (unequal) {
                        $('div[name=modalDynamic]').remove();
                        refreshData();
                        $('#cmd-nav').removeClass('Off').addClass('On');
                        refreshNav(hashVisualize());
                        refreshEvolutionLegend();
                    } else {
                        unequal = true;
                    }
                }

                refresh();
            } catch (error) {
                handleError(error, languageHandler.getMessage('refresh_error'));
            }
        });

        toolbar.onActionClick('aggregation', function () {
            try {
                console.log("...switch to Aggregation-View...");
                $(this).on("click touch", function () {
                    $('.MapSvgMain').removeClass("Off").addClass("On");
                    $('.evolution').removeClass("On").addClass("Off");
                    $('#cmd-nav').removeClass("Off").addClass("On");
                    $('.to-evolution').removeClass("active");
                    $('.to-aggregation').addClass("active");
                })
            } catch (error) {
                handleError(error, languageHandler.getMessage('aggregation_error'));
            }
        });

        toolbar.onActionClick('evolution', function () {
            try {
                console.log("...switch to Evolution-View...");
                $(this).on("click touch", function () {
                    $('.MapSvgMain').addClass("Off");
                    $('.evolution').removeClass("Off").addClass("On");
                    $('#cmd-nav').removeClass("On").addClass("Off");
                    $('.to-evolution').addClass("active");
                    $('.to-aggregation').removeClass("active");

                })
            } catch (error) {
                handleError(error, languageHandler.getMessage('evolution_error'));
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

            resources_loaded = true;
            var parameters = {};
            var savedHashmap;
            var keys = [];

            $('.key').each(function () {
                keys.push($(this).data("key").toUpperCase());
            });

            if (keys.length === 0 && hashmapResourceId) {
                storageHandler.readResource(hashmapResourceId, function (error, resource) {
                    savedHashmap = resource.content.hashmap;
                    carryOn();
                })
            } else {
                carryOn();
            }

            function carryOn() {
                var nodeMapping = hashVisualize(savedHashmap);

                console.log(conceptMaps);

                var reqData = createRequestObject(conceptMaps, parameters, nodeMapping);

                console.log(reqData);

                $.ajax({
                    url: app.serviceUrl,
                    type: "POST",
                    data: JSON.stringify(reqData),
                    contentType: "application/json",
                    beforeSend: function () {
                        $('.progressCircle').css('display', 'inline-block');
                        $('.LoadText').css('display', 'inline-block');
                        $('.MapSvgMain').css('opacity', '0.1');
                        $('.evolution').css('opacity', '0.1');
                        $('#nav').css('opacity', '0.1');
                    },
                    success: function (data) {
                        console.log("[ConceptMapAggregation App] RECEIVED DATA:");
                        console.log(data);
                        remove();
                        $('.progressCircle').css('display', 'none');
                        $('.LoadText').css('display', 'none');
                        $('.MapSvgMain').css('opacity', '1');
                        $('.evolution').css('opacity', '1');
                        $('#nav').css('opacity', '1');

                        if (data == undefined || data.data==undefined || data.data.nodes.length == 0) {
                            handleError(null, languageHandler.getMessage('no_artefacts'));
                        } else {
                            loadingIndicator.hide();
                            graph.visualizeGraph(data, false);
                            evolutionJSON(data.data.AN, data.data.AR, data.data.AD, data.data.NC, languageHandler);
                        }
                    },
                    error: function (error) {
                        console.log("[ConceptMapAggregation] ");
                        console.log(error)
                    }

                })
            }

        }

        function createRequestObject(conceptMaps, parameters, nodeMerge) {
            //collide.info/widgetLabOwner/lab=254
            parameters.provider = metadataHandler.getProvider();
            //ils ID: parameters.provider.id
            console.log(conceptMaps);
            var data = {
                conceptMaps: conceptMaps,
                parameters: parameters,
                nodeMerge: nodeMerge
            };

            console.log(data);
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
                cb({error: "[CMAggregation.readConceptMap] Found undefined resource id - cannot retrieve concept map."});
                return;
            }
            storageHandler.readResource(resourceId, function (error, object) {
                if (error) {
                    console.log("Error reading resource");
                    console.log(error);
                } else {
                    console.log("[CMAggregation] read CM: " + object);

                    if (object.metadata.generator.objectType === "application" && (object.metadata.generator.displayName.toLowerCase() === "concept mapper" || object.metadata.generator.displayName.toLowerCase() === "conceptmapper" ) && object.metadata.target.objectType !== "configuration") {
                        content.push(object);
                    } else if (object.content.metadata && object.content.metadata.target.objectType === "hashmap") hashmapResourceId = object.metadata.id;
                }
                return readConceptMap(storageHandler, (i + 1), content, ids, cb);
            })
        }

        //refresh Nav template
        function refreshNav(hashmap) {
            if (resources_loaded) {
                console.log(hashmap);
                var savedHashmap;
                if (isFirstRefresh && hashmapResourceId) {
                    storageHandler.readResource(hashmapResourceId, function (error, resource) {
                        savedHashmap = resource.content.hashmap;
                        carryOn(savedHashmap);
                    });
                } else {
                    carryOn(hashmap);
                }

                function carryOn(hashmap) {

                    var msg = escapeHTML(languageHandler.getMessage('visualize'));
                    var msgPop = escapeHTML(languageHandler.getMessage('popUps'));
                    var msgNor = escapeHTML(languageHandler.getMessage('normal'));
                    var msgNod = escapeHTML(languageHandler.getMessage('nodes'));
                    var msgQuan = escapeHTML(languageHandler.getMessage('quantity'));
                    var msgLT = escapeHTML(languageHandler.getMessage('linkText'));
                    var msgScale = escapeHTML(languageHandler.getMessage('scaleY'));
                    var highlight = escapeHTML(languageHandler.getMessage('highlight'));
                    var collection = escapeHTML(languageHandler.getMessage('collection'));
                    var filter = escapeHTML(languageHandler.getMessage('filter'));
                    var nodeMerger = escapeHTML(languageHandler.getMessage('nodeMerger'));
                    var mergerText = escapeHTML(languageHandler.getMessage('mergerText'));
                    //TODO erweitern der Internationalisierung

                    isFirstRefresh = false;
                    var keyValueList = '<tr class="trTmp"><p id="pText"><i>' + mergerText + '</i></p></tr>';

                    if (hashmap && (!$.isEmptyObject(hashmap))) {
                        var list = '<tr class="trTmp"></tr>';
                        var count = 1;

                        for (var key in hashmap) {
                            list += '<tr class="Mapping" id="Mapping_' + count + '">'
                                + '<td class="key" id="key_' + count + '" data-key="' + key + '">' + key + '</td>'
                                + '<td class="value" id="value_' + count + '">' + hashmap[key] + '</td>'
                                + '<td id="edit_' + count + '" class="edit" title="edit">'
                                + '<a class="edit_' + count + '" data-toggle="modal" data-target="#myModal_' + count + '">'
                                + '<span class="glyphicon glyphicon-edit"></span></a></td>'
                                + '<td id="remove_' + count + '" class="remove" title="remove" onclick="removeTr(' + count + ')">'
                                + '<a class="remove_' + count + '"><span class="glyphicon glyphicon-remove"></span></a></td>'
                                + '</tr>';


                            $("#myModal")
                                .clone().empty()
                                .attr("id", "myModal_" + count + "")
                                .attr("name", "modalDynamic")
                                .append(
                                    '<div class="modal-dialog">' +
                                    '<div class="modal-content">' +
                                    '<div class="modal-header">' +
                                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                                    '<h4 class="modal-title">Edit Row</h4>' +
                                    '</div>' +
                                    '<div class="modal-body">' +
                                    '<p><i>Please change the term</i></p>' +
                                    '<br />' +
                                    '<label for="newTerm"><b style="padding:1.1em">New Term:</b></label>' +
                                    '<input id="newTerm_' + count + '" type="text" value="' + hashmap[key] + '" />' +
                                    '</div>' +
                                    '<div class="modal-footer">' +
                                    '<button type="button" id = "Set_' + count + '" title="Set Item" onclick="setNewItem(' + count + ')" class="btn btn-primary Set_' + count + '" data-dismiss="modal">Set</button>' +
                                    '<button type="button" id = "Delete_' + count + '" title="Delete Item" onclick="deleteNewItem(' + count + ')" class="btn btn-default Delete_' + count + '">Delete</button>' +
                                    '</div></div></div>').appendTo("body");

                            count++;
                        }
                        keyValueList = list;
                    }

                    // Panels
                    var panel_merger = $('#merger').find('.panel-body');
                    var panel_collection = $('#collection').find('.panel-body');
                    var panel_highlight = $('#highlight').find('.panel-body');
                    var panel_filter = $('#filter').find('.panel-body');
                    var panel_zoom = $('#zoom').find('.panel-body');

                    // Merger
                    panel_merger.find('.tableBody').html(keyValueList);
                    panel_merger.find('#btnVisualize').attr("title", msg);
                    panel_merger.find('#btnVisualize').html(msg);

                    // Collection
                    panel_collection.find('.msgNor').attr("title", msgNor);
                    panel_collection.find('.msgNor-label').html(msgNor);

                    panel_collection.find('.msgPop').attr("title", msgPop);
                    panel_collection.find('.msgPop-label').html(msgPop);

                    panel_collection.find('.msgNod').attr("title", msgNod);
                    panel_collection.find('.msgNod-label').html(msgNod);

                    panel_collection.find('.msgQuan').attr("title", msgQuan);
                    panel_collection.find('.msgQuan-label').html(msgQuan);

                    panel_collection.find('.msgLT').attr("title", msgLT);
                    panel_collection.find('.msgLT-label').html(msgLT);

                    panel_collection.find('.msgScale').attr("title", msgScale);
                    panel_collection.find('.msgScale-label').html(msgScale);

                    resources_loaded = false;
                    if ($('#btnVisualize').hasClass('Off')) {
                        $('#btnVisualize').removeClass('Off').addClass('On');
                    }
                    $("#btnVisualize").on("click", function () {
                        console.log("VISUALIZE!");

                        var keys = [];
                        $('.key').each(function () {
                            keys.push($(this).data("key").toUpperCase());
                        });
                        var values = [];
                        $('.value').each(function () {
                            values.push($(this).text().toUpperCase());
                        });

                        for (var i = 0; i < keys.length; i++) {
                            for (var z = 0; z < values.length; z++) {
                                if (keys[i] === values[z]) {
                                    console.log('****ADJUSTMENT****');
                                    window.confirm('Please visualize or refresh after you delete the row with Item: ' + keys[i] + ' or replaced Item: ' + values[z] + '. You cant merge multi-Node dependencies at once')
                                    unequal = false;
                                }
                            }
                        }

                        if (unequal) {
                            refreshData(hashmap);

                        } else {
                            unequal = true;
                        }
                    });

                }

            } else {
                setTimeout(timedCall, 50);
                function timedCall() {
                    refreshNav(hashmap);
                }
            }
        }


        //refresh EvolutionLegend template
        function refreshEvolutionLegend() {
            var consoleEvolution = $('#consoleEvolution');
            var msgNodes = escapeHTML(languageHandler.getMessage('msgNodes'));
            var msgRelations = escapeHTML(languageHandler.getMessage('msgRelations'));
            var msgDensity = escapeHTML(languageHandler.getMessage('msgDensity'));
            var msgCover = escapeHTML(languageHandler.getMessage('msgCover'));


            consoleEvolution.empty().append(
                ' <div class="row" id="coEvo">'
                + '<div class="col-sm-3">'
                + '<div class="[ form-group ]">'
                + '<input type="radio" name="radioEvolution" checked="checked" id="AN" autocomplete="off"/>'
                + '<div title=' + msgNodes + ' class="[ btn-group ]">'
                + '<label for="AN" class="[ btn btn-primary ]" style="height: 35px">'
                + '<span class="[ glyphicon glyphicon-ok ]"></span>'
                + '<span></span>'
                + '</label>'
                + '<label for="AN" class="[ btn btn-default ]">'
                + msgNodes + ':</label>'
                + '</div></div> </div>'

                + '<div class="col-sm-3">'
                + '<div class="[ form-group ]">'
                + '<input type="radio" name="radioEvolution" id="AR" autocomplete="off"/>'
                + ' <div title=' + msgRelations + ' class="[ btn-group ]">'
                + '<label for="AR" class="[ btn btn-primary ]" style="height: 35px">'
                + '<span class="[ glyphicon glyphicon-ok ]"></span>'
                + '<span></span>'
                + '</label>'
                + '<label for="AR" class="[ btn btn-default ]">'
                + msgRelations + ':</label>'
                + '</div></div></div>'

                + '<div class="col-sm-3">'
                + '<div class="[ form-group ]">'
                + '<input type="radio" name="radioEvolution" id="AD" autocomplete="off"/>'
                + '<div title=' + msgDensity + ' class="[ btn-group ]">'
                + '<label for="AD" class="[ btn btn-primary ]" style="height: 35px">'
                + '<span class="[ glyphicon glyphicon-ok ]"></span>'
                + '<span></span>'
                + '</label>'
                + '<label for="AD" class="[ btn btn-default ]">'
                + msgDensity + ':</label>'
                + '</div></div></div>'

                + '<div class="col-sm-3">'
                + '<div class="[ form-group ]">'
                + '<input type="radio" name="radioEvolution" id="NC" autocomplete="off"/>'
                + '<div title=' + msgCover + ' class="[ btn-group ]">'
                + '<label for="NC" class="[ btn btn-primary ]" style="height: 35px">'
                + '<span class="[ glyphicon glyphicon-ok ]"></span>'
                + '<span></span>'
                + '</label>'
                + '<label for="NC" class="[ btn btn-default ]">'
                + msgCover + ':</label>'
                + '</div></div></div>'
                + '</div>'
            )
        }

        function refreshData() {

            loadingIndicator.show();

            if (metadataHandler.getContext() == "standalone" || metadataHandler.getContext() == "preview") {

                // define localStorageHandler
                storageHandler = new golab.ils.storage.LocalStorageHandler(metadataHandler);

                cm1 = {
                    "metadata": {
                        "id": "2e90ab41-2893-42ca-9169-b2dcd10285a6",
                        "published": "2014-11-12T09:27:14.186Z",
                        "actor": {
                            "objectType": "person",
                            "id": "lars@5458b041427dd6ce7cbf7006",
                            "displayName": "Lars"
                        },
                        "target": {
                            "objectType": "concept map",
                            "id": "4b8f69e3-2914-3a1a-454e-f4c157734bd1",
                            "displayName": "my first concept map"
                        }
                    },
                    "content": {
                        "concepts": [
                            {
                                "id": "7801ec67-778e-45c1-d2be-7c4136a0bc23",
                                "content": "Caesar",
                                "x": 223,
                                "y": 290.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "content": "time",
                                "x": 482,
                                "y": 285.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "3aa428a7-a04b-4551-cdba-002da108a8fc",
                                "content": "Verschluesselung",
                                "x": 537,
                                "y": 170.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "3e7e8ce0-c75d-4c96-b9ff-a3de4010a8fb",
                                "content": "everything",
                                "x": 692,
                                "y": 288.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "10c13a0d-768f-4448-b5e6-18ab7d2dea4a",
                                "content": "electric current",
                                "x": 580,
                                "y": 381.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "92d809d0-26dd-4662-f92a-29f372c4ec29",
                                "content": "concept",
                                "x": 695,
                                "y": 192.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "59554754-b67f-48d4-92b8-0daa5c3135ea",
                                "content": "concept",
                                "x": 389,
                                "y": 178.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "f46c7d47-70a5-411f-cd6a-68c7fdc5693b",
                                "content": "Zeit",
                                "x": 394,
                                "y": 395.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "65415962-a9f1-4b4f-ca1e-1a9dc041b831",
                                "content": "Table",
                                "x": 241,
                                "y": 180.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            },
                            {
                                "id": "2e4ddd4f-d04f-45e8-dcca-ecc0c9f702d0",
                                "content": "concept",
                                "x": 216,
                                "y": 386.75,
                                "type": "ut_tools_conceptmapper_conceptSelector",
                                "colorClass": "ut_tools_conceptmapper_blue"
                            }
                        ],
                        "relations": [
                            {
                                "id": "2ca1cff2-bfde-405d-8536-1b4db57b7957",
                                "source": "7801ec67-778e-45c1-d2be-7c4136a0bc23",
                                "target": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "content": "is part of"
                            },
                            {
                                "id": "0c7d04bf-dca4-4eb5-906a-14ddcee2b76c",
                                "source": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "target": "3aa428a7-a04b-4551-cdba-002da108a8fc",
                                "content": "has"
                            },
                            {
                                "id": "5cc3a61b-6909-456b-f531-32f36e3fd30c",
                                "source": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "target": "3e7e8ce0-c75d-4c96-b9ff-a3de4010a8fb",
                                "content": "influences"
                            },
                            {
                                "id": "59f2127b-a2ee-42fa-9e09-943bcf344fe4",
                                "source": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "target": "10c13a0d-768f-4448-b5e6-18ab7d2dea4a",
                                "content": "is a"
                            },
                            {
                                "id": "516e983c-2cd5-4ef8-b834-ab1a4d219dfe",
                                "source": "65415962-a9f1-4b4f-ca1e-1a9dc041b831",
                                "target": "7801ec67-778e-45c1-d2be-7c4136a0bc23",
                                "content": "has"
                            },
                            {
                                "id": "2da1406e-3c47-4aa4-a370-945ce8f2bf69",
                                "source": "59554754-b67f-48d4-92b8-0daa5c3135ea",
                                "target": "3aa428a7-a04b-4551-cdba-002da108a8fc",
                                "content": "is a"
                            },
                            {
                                "id": "ac7a1ec0-f1e3-4800-90f7-02775600dfea",
                                "source": "2e4ddd4f-d04f-45e8-dcca-ecc0c9f702d0",
                                "target": "f46c7d47-70a5-411f-cd6a-68c7fdc5693b",
                                "content": "like"
                            },
                            {
                                "id": "aff1863e-6edb-4d45-ac6c-44892e51d4e3",
                                "source": "f46c7d47-70a5-411f-cd6a-68c7fdc5693b",
                                "target": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "content": "is a"
                            },
                            {
                                "id": "ec240e80-03be-494a-850d-e13437e960c9",
                                "source": "bbb5fed8-1646-4b8c-9fa9-efb127669928",
                                "target": "92d809d0-26dd-4662-f92a-29f372c4ec29",
                                "content": "is a"
                            }
                        ]
                    }

                };
                cm2 = {
                    "metadata": {
                        "id": "2e93ab42-2833-42ca-3139-b2dde10285a6",
                        "published": "2014-11-12T09:27:14.186Z",
                        "actor": {
                            "objectType": "person",
                            "id": "christian@5348b041427dd6ce7cbf7006",
                            "displayName": "Christian"
                        },
                        "target": {
                            "objectType": "concept map",
                            "id": "4b8f6933-2214-3ada-454e-f4c157734bd1",
                            "displayName": "my first concept map"
                        }
                    },
                    "content": {
                        "concepts": [{
                            "id": "5de48f8f-0a88-49ae-cb2a-a2a78f9a571c",
                            "content": "A",
                            "x": 205,
                            "y": 189.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }, {
                            "id": "44e9c843-bd4a-4b2b-e7f8-0ecd55c83125",
                            "content": "Light",
                            "x": 413,
                            "y": 208.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }, {
                            "id": "bed4f2d8-3e4t-3dfc-fda9-efb127669928",
                            "content": "time",
                            "x": 282,
                            "y": 125.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }
                        ],
                        "relations": [
                            {
                                "id": "add1863e-6ecb-4d45-ac6c-44892e54d4e3",
                                "source": "5de48f8f-0a88-49ae-cb2a-a2a78f9a571c",
                                "target": "44e9c843-bd4a-4b2b-e7f8-0ecd55c83125",
                                "content": "is a"
                            },
                            {
                                "id": "afd3863e-6scv-4d45-ar6c-21892e54d4e3",
                                "source": "44e9c843-bd4a-4b2b-e7f8-0ecd55c83125",
                                "target": "bed4f2d8-3e4t-3dfc-fda9-efb127669928",
                                "content": "is part of"
                            }
                        ]
                    }

                };
                cm3 = {
                    "metadata": {
                        "id": "2e90a781-2693-45ca-9139-b232d10285a6",
                        "published": "2014-11-12T09:27:14.186Z",
                        "actor": {
                            "objectType": "person",
                            "id": "hans@545eb0w1427ed6cw7crv7036",
                            "displayName": "Hans"
                        },
                        "target": {
                            "objectType": "concept map",
                            "id": "4b8f69e3-2914-3a1a-454e-f4c157734bd1",
                            "displayName": "my first concept map"
                        }
                    },
                    "content": {
                        "concepts": [{
                            "id": "5de48f8f-0687-49ae-db2f-a2g78f9a571c",
                            "content": "Light",
                            "x": 255,
                            "y": 109.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }, {
                            "id": "44e9d843-wd4a-4r2t-e7g8-0jcd55c83125",
                            "content": "Licht",
                            "x": 303,
                            "y": 228.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }], "relations": [
                            {
                                "id": "aae3864e-65cv-4dt5-az6c-2iu92e54d4e3",
                                "source": "44e9d843-wd4a-4r2t-e7g8-0jcd55c83125",
                                "target": "5de48f8f-0687-49ae-db2f-a2g78f9a571c",
                                "content": "is part of"
                            }
                        ]
                    }

                };
                cm4 = {
                    "metadata": {
                        "id": "2g90a771-2693-45da-9139-b232d10284a9",
                        "published": "2014-11-12T09:27:12.186Z",
                        "actor": {
                            "objectType": "person",
                            "id": "hans@545eb0w1427ed6cw7crw7031",
                            "displayName": "Lisa"
                        },
                        "target": {
                            "objectType": "concept map",
                            "id": "4b8f49e3-2914-361a-454e-f4c157734bd1",
                            "displayName": "my First"
                        }
                    },
                    "content": {
                        "concepts": [{
                            "id": "5de48f8f-t687-49ag-db2f-a2g78f9c591l",
                            "content": "VIGENERE",
                            "x": 255,
                            "y": 109.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }, {
                            "id": "44e9d443-wd4a-4r2t-e7g8-0jsd55c83155",
                            "content": "Lichter",
                            "x": 303,
                            "y": 228.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }, {
                            "id": "4434d442-wd5a-4rtt-e7g9-0jsd5e383155",
                            "content": "MONOALPHABETISCH(E)",
                            "x": 303,
                            "y": 228.75,
                            "type": "ut_tools_conceptmapper_conceptSelector",
                            "colorClass": "ut_tools_conceptmapper_blue"
                        }
                        ], "relations": [
                            {
                                "id": "aae3464e-65tv-4dt5-ac6c-2iu92e54e4p3",
                                "source": "5de48f8f-t687-49ag-db2f-a2g78f9c591l",
                                "target": "4434d442-wd5a-4rtt-e7g9-0jsd5e383155",
                                "content": "is part of"
                            },
                            {
                                "id": "aaee864e-65cv-4dt5-au6c-2pu12e54d4e2",
                                "source": "44e9d443-wd4a-4r2t-e7g8-0jsd55c83155",
                                "target": "4434d442-wd5a-4rtt-e7g9-0jsd5e383155",
                                "content": "is part of"
                            }
                        ]
                    }

                };

                var dummyConceptMaps = [cm1, cm2, cm3, cm4];

                var conceptMaps = [];
                var callCount;

                var conceptMapsCounter = 0;
                var hashmapCounter = 0;

                getConceptMaps(function(resourceIds){
                    // Save DummyData in LocalStorage

                    if (conceptMapsCounter == 0) {
                        console.log("No ConceptMaps found");

                        callCount = 4;

                        for(var cm in dummyConceptMaps) {
                            storageHandler.createResource(dummyConceptMaps[cm], function(error, resource) {
                                if(error) {
                                    console.log(error)
                                }
                                conceptMaps.push(resource.content);
                                carryOn();
                            })
                        }

                    }

                    console.log(resourceIds);

                    if (resourceIds.length > 0) {

                        console.log(resourceIds.length + " RESOURCES FOUND");
                        callCount = resourceIds.length;

                        for(var i in resourceIds) {
                            storageHandler.readResource(resourceIds[i], function (error, resource) {
                                if(error){
                                    console.log(error);
                                }
                                if(resource) {
                                    if(resource.content.metadata.target.objectType == "conceptMap" ||
                                        resource.content.metadata.target.objectType == "concept map") {
                                        conceptMaps.push(resource.content);
                                        carryOn();
                                    }

                                    if(resource.content.metadata.target.objectType != "conceptMap" ||
                                        resource.content.metadata.target.objectType != "concept map") {

                                        if(resource.content.metadata.target.objectType == "hashmap") {

                                            if(resource.content.hashmap) {
                                                hashmapResourceId = resource.metadata.id;
                                                if (isFirstRefresh) {
                                                    savedHashmap = resource.content.hashmap;
                                                }
                                            }
                                            callCount--;
                                            carryOn();
                                        }
                                    }


                                }
                            });
                        }
                    }
                });

                function getConceptMaps (callback) {
                    var resourceIds = [];


                    storageHandler.listResourceMetaDatas(function (error, metadatas) {
                        if(error) {
                            console.log(error);
                        }

                        for(var object in metadatas) {
                            console.log("ObjectType: " + metadatas[object].metadata.target.objectType);
                            if(metadatas[object].metadata.target.objectType === "concept map" ||
                                metadatas[object].metadata.target.objectType === "conceptMap") {
                                conceptMapsCounter++;
                                resourceIds.push(metadatas[object].id);
                            }
                            if(metadatas[object].metadata.target.objectType === "hashmap") {
                                hashmapCounter++;
                                resourceIds.push(metadatas[object].id);
                            }
                        }

                        console.log("#hashmaps: " + hashmapCounter);
                        console.log("#conceptMaps: " + conceptMapsCounter);

                        callback(resourceIds);
                    });

                }

                function carryOn() {
                    if (callCount === conceptMaps.length) {
                        console.log("READY READING RESOURCES FROM STORAGE HANDLER");
                        callCount = undefined;
                        console.log(conceptMaps);
                        console.log(savedHashmap);
                        postMergeRequest(conceptMaps, {}, hashVisualize(savedHashmap));
                    }
                }

            } else {

                var content = [];
                storageHandler.listResourceIds(function (error, ids) {
                    console.log("[CM-Dashboard] listResourceIds found ids: " + ids);
                    if (ids.length == 0) {
                        console.log("[CM-Dashboard] No resources found.");
                        handleError(data.error, "No Concept Maps found. Check if there are Concept Maps saved in the vault. Only the teacher can see the vault-space.");
                    } else if (error) {
                        console.log("[CM-Dashboard] Error reading resource IDs");
                    } else {
                        readConceptMap(storageHandler, 0, content, ids, requestAggregatedConceptMap);
                    }
                });
            }

        }

        // loadingIndicator.hide();
        $(window).resize(function () {
            var titleHeight = $("#toolbar-wrapper").outerHeight() + $("#title-bar").outerHeight() + 4;
            $("#canvas").css("height", window.innerHeight - titleHeight);
        });


        // Main Request
        function postMergeRequest(conceptMaps, reqParams, hashmap) {
            saveHashmap(hashmap);
            var reqData = createRequestObject(conceptMaps, reqParams, hashmap);
            console.log(arguments);
            console.log(reqData);
            $.ajax({
                url: app.serviceUrl,
                type: "POST",
                data: JSON.stringify(reqData),
                contentType: "application/json",
                beforeSend: function () {
                    $('#progressCircle').css('display', 'inline-block');
                    $('#cmd-nav').css('opacity', '0.1');
                    $('.LoadText').css('display', 'inline-block');
                    $('.MapSvgMain').css('opacity', '0.1');
                    $('.evolution').css('opacity', '0.1');

                },
                success: function (data) {
                    console.log("[ConceptMapAggregation App] RECEIVED DATA:");
                    console.log(data);
                    remove();
                    $('#progressCircle').css('display', 'none');
                    $('#cmd-nav').css('opacity', '0.1');
                    $('.LoadText').css('display', 'none');
                    $('.MapSvgMain').css('opacity', '1');
                    $('.evolution').css('opacity', '1');
                    $('#cmd-nav').css('opacity', '1');
                    if (data == undefined || data.data == undefined || data.data.nodes.length == 0) {
                        handleError(null, languageHandler.getMessage('no_artefacts'));
                    } else {
                        loadingIndicator.hide();
                        graph.visualizeGraph(data, false);
                        evolutionJSON(data.data.AN, data.data.AR, data.data.AD, data.data.NC, languageHandler);
                    }
                },
                error: function (error) {
                    console.log("[ConceptMapAggregation] ");
                    console.log(error);
                }
            })
        }

        // save Hashmap
        function saveHashmap(hashmap) {

            console.log("[CM-Dashboard] Save hashmap");
            console.log(hashmap);

            if(hashmap == undefined) {
                console.log("[CM-Dashboard] hashmap is undefined");
            }

            if (!hashmapResourceId) {
                var map = {
                    "metadata": {
                        "published": new Date(),
                        "target": {
                            "objectType": "hashmap",
                            "displayName": "Hashmap"
                        }
                    },
                    "hashmap": hashmap

                };

                console.log('[CM-Dashboard] Create empty hashmap');
                console.log(map);

                storageHandler.createResource(map, function (error, resource) {
                    if (error) {
                        console.log(error);
                    }
                    if (resource) {
                        console.log(resource);
                        hashmapResourceId = resource.metadata.id;
                        resources_loaded = true;
                    }


                });
            }
            else {
                var content = {
                    "metadata": {
                        "published": new Date(),
                        "target": {
                            "objectType": "hashmap",
                            "displayName": "Hashmap"
                        }
                    },
                    "hashmap": hashmap
                };
                storageHandler.updateResource(hashmapResourceId, content, function (err, res) {
                    console.log(err, res);
                    resources_loaded = true;
                });
            }
        }

        $('div[name=modalDynamic]').remove();
        refreshData();
        $('#cmd-nav').removeClass('Off').addClass('On');
        refreshNav(hashVisualize());
        refreshEvolutionLegend();
        // loadingIndicator.hide();
    }


})(golab.tools.cmDashboard);