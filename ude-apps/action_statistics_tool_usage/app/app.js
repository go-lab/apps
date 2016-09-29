(function (actionStatistics) {
    var SERVICE_URL = 'http://golab-dev.collide.info/analytics/aggregate_tool_logs';
    //var SERVICE_URL = 'http://localhost:3090/analytics/aggregate_tool_logs';
    //var SAMPLE_ILS_ID = '547f0de4b5012d08f3a1119f';
    var SAMPLE_ILS_ID = 'demo-space-id';
    var actionBarChart = actionStatistics.actionBarChart;
    var prettyToolName = golab.commons.prettyToolName;

    actionStatistics.Application =
        function Application(environmentHandlers, config, loadingIndicator, errorDisplay) {
            var actionLogger = environmentHandlers.actionLogger;
            var storageHandler = environmentHandlers.storageHandler;
            var metadataHandler = environmentHandlers.metadataHandler;
            var languageHandler = environmentHandlers.languageHandler;
            var getMsg = languageHandler.getMsg.bind(languageHandler);
            var context = metadataHandler.getContext();

            var toolbar = actionStatistics.Toolbar($('#toolbar'), getMsg, {
                showLabels: false,
                showGraaspUserFilter: context === 'graasp'
            });

            var container = document.getElementById('content');

            console.log('The application started. Yay!');

            setContentHeight();
            refreshData();

            $(window).resize(function () {
                setContentHeight();
                gadgets.window.adjustHeight()
            });

            actionLogger.logApplicationStarted();

            toolbar.onActionClick('refresh', refreshData);
            toolbar.onShowGraaspUsersChange(refreshData);

            function handleError(error, userMessage) {
                userMessage = userMessage || getMsg('error_occured');
                errorDisplay.show(userMessage);
                console.error(error.stack);
                loadingIndicator.hide();
            }

            function refreshData(showGraaspUsers) {

                //FIXME add angeLA detection
                if (context == 'ils' || context == 'graasp') {
                    var hasAngela = metadataHandler.getMetadata().provider.ilsHasAngeLA;
                    if (hasAngela != undefined && !hasAngela) {
                        handleError(error, getMsg('no_angela'));
                        return;
                    }

                }


                loadingIndicator.show();
                var showOwnDataOnly = context === 'ils';

                loadData(context, {
                    showOwnDataOnly: showOwnDataOnly,
                    showGraaspUsers: showGraaspUsers,
                }).then(function (actionData) {
                    actionData = readableAppNames(actionData);
                    actionBarChart.render(
                        actionData, container, getMsg
                    );
                    loadingIndicator.hide();
                }, function (error) {
                    handleError(error, getMsg('load_error'));
                }).catch(function (error) {
                    handleError(error, getMsg('display_error'));
                });
            }

            function readableAppNames(data) {
                data.metadata.measures = data.metadata.measures.map(function (measure) {
                    measure.title = prettyToolName(measure.title);
                    if (measure.title === 'ILS Metawidget') {
                        measure.title = getMsg('phase_changes');
                    }
                    return measure;
                });
                return data;
            }

            function setContentHeight() {
                var titleHeight =
                    $('h1').outerHeight() + 10 +
                    $('#toolbar-wrapper').outerHeight();
                $('#content').css('height', window.innerHeight - titleHeight);
            }

            function loadData(context, options) {
                if (context === 'preview') {
                    return Promise.resolve(SAMPLE_DATA);
                }

                var ilsId = SAMPLE_ILS_ID;

                if (context === 'ils' || context === 'graasp') {
                    ilsId = metadataHandler.getMetadata().provider.id;
                }

                return Promise.resolve(
                    $.ajax({
                        url: SERVICE_URL,
                        type: 'POST',
                        data: {
                            ilsId: ilsId,
                            actorName: metadataHandler.getActor().displayName,
                            aggregateKey: 'generator.displayName',
                            showOwnDataOnly: options.showOwnDataOnly || false,
                            showGraaspUsers: options.showGraaspUsers || false,
                        },
                    })
                ).then(throwLoadErrors);
            }
        };

    function throwLoadErrors(data) {
        if (data.error !== undefined) {
            throw new Error(data.error);
        }
        return data;
    }

    var SAMPLE_DATA = {
        "metadata": {
            "time": "undefined",
            "title": "actor_generator_statistics.stf",
            "description": "Number of logs for actors aggregated over generators.",
            "directed": "undefined",
            "datalinks": ["0.json"],
            "dimensions": [],
            "edgeproperties": [],
            "measures": [{
                "title": "conceptmapper",
                "description": "Occurences of conceptmapper",
                "class": "node",
                "property": "conceptmapper",
                "type": "double"
            }, {
                "title": "reflectionTool",
                "description": "Occurences of reflectionTool",
                "class": "node",
                "property": "reflectionTool",
                "type": "double"
            }, {
                "title": "circuitLab",
                "description": "Occurences of circuitSimulator",
                "class": "node",
                "property": "circuitLab",
                "type": "double"
            }, {
                "title": "hypothesis scratchpad",
                "description": "Occurences of ut.tools.hypothesisScratchpad",
                "class": "node",
                "property": "hypothesis scratchpad",
                "type": "double"
            }],
            "type": "undefined",
            "nodeproperties": []
        },
        "data": [{
            "id": "**average**",
            "hypothesis scratchpad": 6.5,
            "circuitLab": 9.5,
            "label": "Average",
            "reflectionTool": 2.25,
            "conceptmapper": 11.25
        }, {
            "id": "student 1",
            "hypothesis scratchpad": 3,
            "circuitLab": 12,
            "label": "student 1",
            "reflectionTool": 2,
            "conceptmapper": 10
        }, {
            "id": "student 2",
            "hypothesis scratchpad": 5,
            "circuitLab": 8,
            "label": "student 2",
            "reflectionTool": 1,
            "conceptmapper": 6
        }, {
            "id": "student 3",
            "hypothesis scratchpad": 8,
            "circuitLab": 15,
            "label": "student 3",
            "reflectionTool": 4,
            "conceptmapper": 17
        }, {
            "id": "student 4",
            "hypothesis scratchpad": 10,
            "circuitLab": 3,
            "label": "student 4",
            "reflectionTool": 2,
            "conceptmapper": 12
        }]
    };
})(golab.tools.actionStatistics);
