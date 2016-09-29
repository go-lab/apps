(function (conceptCloud) {
    conceptCloud.ErrorHandler = ErrorHandler;
    var errorDisplay;

    function ErrorHandler(errorDisplay) {
        this.errorDisplay = conceptCloud.errorDisplay = errorDisplay;
        return {
            handleError: handleError,
        };

        function handleError(error, userMessage) {
            userMessage = userMessage || languageHandler.getMessage('error_occured');
            conceptCloud.errorDisplay.show(userMessage);
            console.error(error.stack);
            loadingIndicator.hide();
        }

    }
})(golab.tools.conceptCloud);
