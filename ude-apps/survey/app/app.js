((ReflectionPoll) => {
    const { util, fetchAggregatedResults } = ReflectionPoll;
    const ANSWER_CHANGE_ACTION_DELAY = 1000;
    const DOWNLOAD_CSV_URL = "http://golab-dev.collide.info/analytics/reflection_poll_responses/download";

    ReflectionPoll.Application =
        function Application(envHandlers, loadingIndicator, errorDisplay, config) {
            const pollActionLogger = envHandlers['survey'].actionLogger;
            const pollStorageHandler = envHandlers['survey'].storageHandler;
            envHandlers['survey'].metadataHandler.setTargetDisplayName('survey');
            const pollMetadataHandler = envHandlers['survey'].metadataHandler;

            const answersActionLogger = envHandlers['survey_responses'].actionLogger;
            const answersStorageHandler = envHandlers['survey_responses'].storageHandler;
            const answersMetadataHandler = envHandlers['survey_responses'].metadataHandler.setTargetDisplayName('survey_responses');

            /*const pollActionLogger = envHandlers['configuration'].actionLogger;
             const pollStorageHandler = envHandlers['configuration'].storageHandler;
             envHandlers['configuration'].metadataHandler.setTargetDisplayName('survey');
             const pollMetadataHandler = envHandlers['configuration'].metadataHandler;

             const answersActionLogger = envHandlers['survey_responses'].actionLogger;
             const answersStorageHandler = envHandlers['survey_responses'].storageHandler;
             envHandlers['survey_responses'].metadataHandler.setTargetDisplayName('survey_responses');
             const answersMetadataHandler = envHandlers['survey_responses'].metadataHandler;
             */

            const languageHandler = envHandlers.languageHandler;

            const getMsg = languageHandler.getMessage.bind(languageHandler);

            const pollRepo = ReflectionPoll.PollRepo(pollStorageHandler);
            const answersRepo = ReflectionPoll.AnswersRepo(answersStorageHandler);
            const toolbar = ReflectionPoll.Toolbar($('#toolbar'), getMsg, {
                showLabels: true,
            });
            const configView = ReflectionPoll.ConfigView($('#config'), getMsg);
            const pollView = ReflectionPoll.PollView($('#poll_view')[0], getMsg, config.imgPath);
            const resultsView = ReflectionPoll.ResultsView($('#results_view')[0], getMsg);
            const importDialog = ReflectionPoll.ImportDialog(getMsg);
            const exportDialog = ReflectionPoll.ExportDialog(getMsg);
            const context = pollMetadataHandler.getContext();

            const logAnswerChange = (function () {
                let previousAnswers;
                return function logAnswerChange(poll, answers) {
                    if (!answers.equals(previousAnswers)) {
                        answersActionLogger.logChange({
                            objectType: 'answers',
                            id: answers.get('id', ReflectionPoll.util.uuid()),
                            content: answers.toJS(),
                            pollId: poll.get('id'),
                            pollContentHash: poll.get('contentHash'),
                        });
                    }
                    previousAnswers = answers;
                };
            })();

            if (context === 'ils') {
                $('#toolbar').hide();
            }

            translateAppTitle();
            translatePollDefaults(ReflectionPoll.Poll, getMsg);
            pollRepo.load().then((poll) => {
                return answersRepo.load(poll).then((answers) => {
                    try {
                        start(poll, answers);
                    } catch (error) {
                        handleError(error, getMsg('start_error'));
                    }
                }).catch((error) => {
                    handleError(error, getMsg('load_answers_error'));
                });
            }).catch((error) => {
                handleError(error, getMsg('load_poll_error'));
            });

            function start(poll, answers) {
                showPollView(poll, answers);
                answersActionLogger.logApplicationStarted();
                loadingIndicator.hide();
                pollView.onAnswersChange(util.debounce((newAnswers) => {
                    if (context === 'graasp') return;
                    if (newAnswers.equals(answers)) return;
                    answers = newAnswers;
                    logAnswerChange(poll, answers);
                    console.log('saveing answers %O', answers.toJS());
                    answersRepo.save(poll, answers).catch((error) => {
                        handleError(error, getMsg('save_answers_error'));
                    });
                }, ANSWER_CHANGE_ACTION_DELAY));

                toolbar.onActionClick('configure', () => {
                    showConfigView(poll);
                });
                toolbar.onActionClick('view_results', () => {
                    showResultsView(poll);
                });
                toolbar.onActionClick('view_poll', () => {
                    showPollView(poll, answers);
                });
                toolbar.onActionClick('abort', () => {
                    showPollView(poll, answers);
                });
                toolbar.onActionClick('results', () => {
                    showResultsView(poll);
                });

                toolbar.onActionClick('download', () => {
                    downloadCSVFile(poll);
                });

                toolbar.onActionClick('save', () => {
                    loadingIndicator.show();
                    let newPoll = configView.getPoll();
                    newPoll = ReflectionPoll.Poll.setContentHash(newPoll);
                    if (newPoll.get('contentHash') === poll.get('contentHash')) {
                        return showPollView(poll, answers);
                    }
                    poll = newPoll;
                    console.log('saving poll %O', poll.toJS());
                    savePoll(poll).then(() => {
                        pollActionLogger.logChange({
                            objectType: 'poll',
                            id: poll.get('id'),
                            content: poll.toJS(),
                        });
                        return answersRepo.load(poll);
                    }).then((newAnswers) => {
                        answers = newAnswers;
                        showPollView(poll, answers);
                    });
                });
                toolbar.onActionClick('export', () => {
                    exportDialog.show(
                        JSON.stringify(configView.getPoll().toJS())
                    );
                });
                toolbar.onActionClick('import', () => {
                    importDialog.show();
                });
                importDialog.onImport((pollDataString) => {
                    let referencePoll =
                        ReflectionPoll.Poll.newPoll().set('id', poll.get('id'));
                    let conversion = ReflectionPoll.PollImporter.convert(
                        pollDataString,
                        referencePoll
                    );
                    if (conversion.get('error')) {
                        showConversionError(conversion.get('error'));
                        return showConfigView(poll);
                    } else if (conversion.get('isDowngrade')) {
                        showConversionError('downgrade');
                    } else {
                        errorDisplay.hide();
                    }
                    showConfigView(conversion.get('poll'));
                });
            }

            function showPollView(poll, answers) {
                try {
                    loadingIndicator.hide();
                    toolbar.showPollViewTools();
                    pollView.render(poll, answers);
                    configView.hide();
                    resultsView.hide();
                    pollView.show();
                } catch (error) {
                    handleError(error, getMsg('show_poll_error'));
                }
            }

            function showConfigView(poll) {
                try {
                    loadingIndicator.hide();
                    toolbar.showConfigTools();
                    configView.render(poll);
                    pollView.hide();
                    resultsView.hide();
                    configView.show();
                } catch (error) {
                    handleError(error, getMsg('show_config_error'));
                }
            }

            function showResultsView(poll) {
                loadingIndicator.show();
                try {
                    fetchAggregatedResults(poll).then((results) => {
                        loadingIndicator.hide();
                        toolbar.showResultsViewTools();
                        resultsView.render(poll, results, getMsg);
                        pollView.hide();
                        configView.hide();
                        resultsView.show();
                    }).catch((error) => {
                        handleError(error, getMsg('show_results_error'));
                    });
                } catch (error) {
                    handleError(error, getMsg('show_results_error'));
                }
            }

            function downloadCSVFile(poll) {
                loadingIndicator.show();
                try {
                    window.alert("download CSV");
                    fetchAggregatedResults(poll).then((results) => {
                        loadingIndicator.hide();
                        //create csv
                        $.ajax({
                            type: "POST",
                            url: DOWNLOAD_CSV_URL,
                            data: JSON.stringify({poll: poll, results: results}),
                            contentType: "application/json",
                            success: function (data) {
                                loadingIndicator.hide();
                            },
                            error: function () {
                                console.warn("POST update failed");
                                errorDisplay.show(getMsg('error_download_csv'));
                                loadingIndicator.hide();
                            }
                        });
                    }).catch((error) => {
                        handleError(error, getMsg('show_results_error'));
                    });
                } catch (error) {
                    handleError(error, getMsg('show_results_error'));
                }
            }

            function showConversionError(error) {
                errorDisplay.show(getMsg('conversion_error_' + error));
            }

            function savePoll(poll) {
                return pollRepo.save(poll).catch(function (error) {
                    handleError(error, getMsg('save_poll_error'));
                });
            }

            function translateAppTitle() {
                $('h1, title').text(getMsg('survey_app'));
            }

            function handleError(error, userMessage) {
                userMessage = userMessage || getMsg('error_occured');
                errorDisplay.show(userMessage);
                console.error(error.stack);
                if (error.details) {
                    console.error('Details: %O', error.details);
                }
                loadingIndicator.hide();
            }
        };

    function translatePollDefaults(pollModule, getMsg) {
        pollModule.defaultQuestion = getMsg('new_question');
        pollModule.defaultAnswerText = getMsg('answer');
        pollModule.defaultPollHeading = getMsg('new_poll');
    }
})(golab.tools.ReflectionPoll);
