'use strict';

(function run(ReflectionPoll) {
    var TOOL_NAME = 'survey';
    var DOCUMENT_TYPES = ['survey', 'survey_responses'];
    var FALLBACK_LANGUAGE = 'en';
    var IMG_PATH = 'app/img';

    var envHandlerOptions = {
        notificationServer: null,
        cache: false
    };

    try {
        var errorDisplay = ErrorDisplay($('#error'), $('#error .alert .message'));
        var loadingIndicator = LoadingIndicator($('#loading_indicator'));
        var handleStartupError = getErrorHandler(errorDisplay, loadingIndicator);

        loadingIndicator.show();

        golab.common.createEnvironmentHandlers(DOCUMENT_TYPES, TOOL_NAME, FALLBACK_LANGUAGE, envHandlerOptions, function (envHandlers) {
            try {
                envHandlers.configHandler = ReflectionPoll.ConfigHandler(TOOL_NAME, golab.tools.configurationDefinition.ReflectionPoll, golab.tools.configuration.ReflectionPoll);
                envHandlers.envHandlerOptions = envHandlerOptions;
                errorDisplay.setLanguageHandler(envHandlers.languageHandler);

                envHandlers.configHandler.loadConfig(function (error) {
                    if (error) {
                        return handleStartupError(error);
                    }
                    try {
                        ReflectionPoll.Application(envHandlers, loadingIndicator, errorDisplay, {
                            imgPath: getRoot() + IMG_PATH
                        });
                        adjustHeightInGraasp();
                    } catch (err) {
                        return handleStartupError(err);
                    }
                });
            } catch (error) {
                handleStartupError(error);
            }
        });
    } catch (error) {
        console.error(error);
        document.getElementsByTagName('body')[0].innerHTML = 'An error occured while starting the application.';
    }

    function getErrorHandler(errorDisplay, loadingIndicator) {
        return function (error) {
            console.error(error.stack);
            errorDisplay.show('An error occured while starting the application.');
            loadingIndicator.hide();
        };
    }

    function LoadingIndicator(container) {
        var $container = $(container);
        return {
            show: function show() {
                $container.show();
            },
            hide: function hide() {
                $container.hide();
            }
        };
    }

    function ErrorDisplay(container, messageElement, languageHandler) {
        container = $(container);
        messageElement = messageElement ? $(messageElement) : container;

        var closeBtn = container.find('button');
        setCloseBtnBehaviour();

        if (languageHandler) {
            setAriaLabel();
        }

        return {
            hide: hide,
            show: function show(message) {
                if (message) {
                    messageElement.text(message);
                }
                container.show();
            },
            setLanguageHandler: function setLanguageHandler(l) {
                languageHandler = l;
                setAriaLabel(languageHandler);
            }
        };

        function hide() {
            container.hide();
        }

        function setAriaLabel(languageHandler) {
            closeBtn.attr('aria-label', languageHandler.getMessage('close_alert'));
        }

        function setCloseBtnBehaviour() {
            closeBtn.on('click', function () {
                hide();
            });
        }
    }

    function getRoot() {
        if (typeof gadgets !== 'undefined' && gadgets.util && gadgets.util.getUrlParameters) {
            var root = gadgets.util.getUrlParameters().url;
            return root.substr(0, root.lastIndexOf('/') + 1);
        }
        return '';
    }

    function adjustHeightInGraasp() {
        if (typeof gadgets !== 'undefined' && gadgets.window && gadgets.window.adjustHeight) {
            gadgets.window.adjustHeight();
        }
    }
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=run.js.map
