(function run(conceptCloud) {
    var TOOL_NAME = 'conceptCloud';
    var DOCUMENT_TYPES = ['configuration', 'conceptCloudRetriever', 'conceptCloudCache'];
    var FALLBACK_LANGUAGE = 'en';

    try {
        var errorDisplay = ErrorDisplay($('#error'), $('#error .alert .message'));
        var loadingIndicator = LoadingIndicator($('#loading_indicator'));
        var handleStartupError = getErrorHandler(errorDisplay, loadingIndicator);

        loadingIndicator.show();

        var options = golab.tools.configuration.conceptCloud.environmentHandlerOptions;

        golab.common.createEnvironmentHandlers(DOCUMENT_TYPES, TOOL_NAME, FALLBACK_LANGUAGE, options,
            function(envHandlers) {

                conceptCloud.environmentHandlers = envHandlers;

                conceptCloud.environmentHandlers.conceptCloudRetriever.storageHandler.configureFilters(false, false, false, false);
                conceptCloud.environmentHandlers.conceptCloudCache.storageHandler.configureFilters(true, false, false, false);

                console.log(conceptCloud.environmentHandlers.conceptCloudRetriever.storageHandler);

                try {
                    conceptCloud.environmentHandlers.configHandler = conceptCloud.ConfigHandler(TOOL_NAME);
                    errorDisplay.setLanguageHandler(conceptCloud.environmentHandlers.languageHandler);

                    conceptCloud.environmentHandlers.configHandler.loadConfig(function(error) {
                        if (error) {
                            return handleStartupError(error);
                        }
                        try {
                            conceptCloud.Application(
                                conceptCloud.environmentHandlers, loadingIndicator, errorDisplay
                            );
                        } catch(err) {
                            return handleStartupError(err);
                        }
                    });
                } catch(error) {
                    handleStartupError(error);
                }
            });


    } catch(error) {
        console.error(error);
        document.getElementsByTagName('body')[0].innerHTML =
            'An error occured while starting the application.';
    }

    function getErrorHandler(errorDisplay, loadingIndicator) {
        return function(error) {
            console.error(error.stack);
            errorDisplay.show('An error occured while starting the application.');
            loadingIndicator.hide();
        };
    }

    function LoadingIndicator(container) {
        var $container = $(container);
        return {
            show: function() {
                $container.show();
            },
            hide: function() {
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
            hide: function() {
                container.hide();
            },
            show: function(message) {
                if (message) {
                    messageElement.text(message);
                }
                container.show();
            },
            setLanguageHandler: function(l) {
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
})(golab.tools.conceptCloud);
