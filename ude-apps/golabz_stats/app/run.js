(function run() {
    var TOOL_NAME = 'Golabz Statistics';
    var DOCUMENT_TYPE = 'post';
    var FALLBACK_LANGUAGE = 'en';
    var config = golab.tools.configuration.golabzStatistics;

    try {
        var errorDisplay = ErrorDisplay($('#error'), $('#error .alert .message'));
        var loadingIndicator = LoadingIndicator($('#loading_indicator'));

        loadingIndicator.show();

        golab.common.createEnvironmentHandlers(DOCUMENT_TYPE, TOOL_NAME, FALLBACK_LANGUAGE,
        function() {
            var envHandlers = {
                metadataHandler:    arguments[0],
                storageHandler:     arguments[1],
                actionLogger:       arguments[2],
                languageHandler:    arguments[3],
                notificationClient: arguments[4]
            };
            try {
                errorDisplay.setLanguageHandler(envHandlers.languageHandler);
                Application(envHandlers, config, loadingIndicator, errorDisplay);
            } catch(error) {
                console.error(error.stack);
                errorDisplay.show('An error occured while starting the application.');
                loadingIndicator.hide();
            }
        });
    } catch(error) {
        console.error(error);
        document.getElementsByTagName('body')[0].innerHTML =
            'An error occured while starting the application.';
    }

    function LoadingIndicator(container) {
        var $container = $(container);
        return {
            show: function() {
                $container.show();
            },
            hide: function() {
                $container.hide();
            }
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
})();

$(window).resize();
