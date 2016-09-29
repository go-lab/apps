(function run(activityStatistics) {
    const TOOL_NAME = 'Timeline';
    const DOCUMENT_TYPE = 'not specified';
    const FALLBACK_LANGUAGE = 'en';

    try {
        const errorDisplay = ErrorDisplay($('#error'), $('#error .alert .message'));
        const loadingIndicator = LoadingIndicator($('#loading_indicator'));
        const handleStartupError = getErrorHandler(errorDisplay, loadingIndicator);

        loadingIndicator.show();

        golab.common.createEnvironmentHandlers(DOCUMENT_TYPE, TOOL_NAME, FALLBACK_LANGUAGE,
        function() {
            const envHandlers = {
                metadataHandler: arguments[0],
                storageHandler: arguments[1],
                actionLogger: arguments[2],
                languageHandler: arguments[3],
                notificationClient: arguments[4]
            };
            try {
                moment.locale(envHandlers.languageHandler.getLanguage());
                errorDisplay.setLanguageHandler(envHandlers.languageHandler);

                try {
                    activityStatistics.Application(
                        envHandlers, loadingIndicator, getRoot(), errorDisplay
                    );
                } catch(err) {
                    return handleStartupError(err);
                }
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
        const $container = $(container);
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

        const closeBtn = container.find('button');
        setCloseBtnBehaviour();

        if (languageHandler) {
            setAriaLabel();
        }

        return {
            hide: hide,
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

        function hide() {
            container.hide();
        }

        function setAriaLabel(languageHandler) {
            closeBtn
            .attr('aria-label', languageHandler.getMessage('close_alert'));
        }

        function setCloseBtnBehaviour() {
            closeBtn.on('click', function() {
                hide();
            });
        }
    }

    function getRoot() {
        if (typeof gadgets !== 'undefined' && gadgets.util &&
            gadgets.util.getUrlParameters) {
            const root = gadgets.util.getUrlParameters().url;
            return root.substr(0, root.lastIndexOf('/') + 1);
        }
        return '';
    }

})(golab.tools.activityStatistics);
