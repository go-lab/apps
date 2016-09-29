(function run(cmDashboard) {
    var TOOL_NAME = 'cmDashboard';
    var DOCUMENT_TYPES = ['configuration', 'conceptMap'];
    var FALLBACK_LANGUAGE = 'en';

    try {
        var errorDisplay = ErrorDisplay($('#error'), $('#error .alert .message'));
        var loadingIndicator = LoadingIndicator($('#loading_indicator'));
        var handleStartupError = getErrorHandler(errorDisplay, loadingIndicator);

        loadingIndicator.show();

        var options = golab.tools.configuration.cmdashboard.environmentHandlerOptions;

        golab.common.createEnvironmentHandlers(DOCUMENT_TYPES, TOOL_NAME, FALLBACK_LANGUAGE, options,
            function (envHandlers) {
                cmDashboard.environmentHandlers = envHandlers;

                //FIXME Workaround - this should have a conceptMapper handling mechanism
                cmDashboard.environmentHandlers.conceptMap.storageHandler.configureFilters(true, false, false, false);

                try {
                    cmDashboard.environmentHandlers.configHandler = cmDashboard.ConfigHandler(TOOL_NAME);
                    errorDisplay.setLanguageHandler(cmDashboard.environmentHandlers.languageHandler);
                    moment.locale(cmDashboard.environmentHandlers.languageHandler.getLanguage());

                    cmDashboard.environmentHandlers.configHandler.loadConfig(function (error) {
                        if (error) {
                            return handleStartupError(error);
                        }
                        try {
                            cmDashboard.Application(
                                cmDashboard.environmentHandlers, loadingIndicator, errorDisplay
                            );
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
        document.getElementsByTagName('body')[0].innerHTML =
            'An error occured while starting the application.';
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
            show: function () {
                $container.show();
            },
            hide: function () {
                $container.hide();
            },
        };
    }

    function ErrorDisplay(container, messageElement, languageHandler) {
        container = $(container);
        messageElement = messageElement ? $(messageElement) : container;
        if (languageHandler) {
            setAriaLabel();
        }
        return {
            hide: function () {
                container.hide();
            },
            show: function (message) {
                if (message) {
                    messageElement.text(message);
                }
                container.show();
            },
            setLanguageHandler: function (l) {
                languageHandler = l;
                setAriaLabel(languageHandler);
            }
        };

        function setAriaLabel(languageHandler) {
            container
                .find('button')
                .attr('aria-label', languageHandler.getMessage('close_alert'));
        }
    }
})(golab.tools.cmDashboard);


$(window).resize();
