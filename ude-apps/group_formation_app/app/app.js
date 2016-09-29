(function(starterApp) {
    starterApp.Application = Application;

    function Application(environmentHandlers, loadingIndicator, errorDisplay) {

        var actionLogger       = starterApp.actionLogger        = environmentHandlers.actionLogger;
        var notificationClient = starterApp.notificationClient  = environmentHandlers.notificationClient;
        var storageHandler     = starterApp.storageHandler      = environmentHandlers.storageHandler;
        var metadataHandler    = starterApp.metadataHandler     = environmentHandlers.metadataHandler;
        var languageHandler    = starterApp.languageHandler     = environmentHandlers.languageHandler;
        var configHandler      = starterApp.configHandler       = environmentHandlers.configHandler;

        var notificationDisplay = starterApp.notficationDisplay = starterApp.NotificationDisplay($('#notifications'));

        notificationClient.register(function (notification) {
            return true;
        }, handleNotification);

        starterApp.metaContext = metadataHandler.getContext();

        if(starterApp.metaContext == 'standalone')
            starterApp.devFlag = false;

        var toolbar = starterApp.toolbar = starterApp.Toolbar($('#toolbar'), languageHandler, {
            showLabels: false,
            hideConfiguration: metadataHandler.getContext() === 'ils'
        });

        starterApp.handleError = handleError;
        starterApp.loadingIndicator = loadingIndicator;
        starterApp.errorDisplay = errorDisplay;

        var configDialog = starterApp.configDialog = starterApp.ConfigDialog($('#config'), languageHandler);
        var loggingInterface = starterApp.loggingInterface = starterApp.LoggingInterface();
        var resourceController = starterApp.resourceController = starterApp.ResourceController();
        var interactionController = starterApp.interactionController = starterApp.InteractionController();

        var groupFormation = starterApp.groupFormation = starterApp.GroupFormation();
        interactionController.setGroupFormation(groupFormation);
        resourceController.setGroupFormation(groupFormation);
        interactionController.refresh();

        loadingIndicator.hide();

        console.log('Printing metadata :\n' + JSON.stringify(metadataHandler.getMetadata()));
        console.log('The application started.');
        loggingInterface.logApplicationStarted();


        function handleNotification(notification) {
            console.log('Notification received: %o', notification);
            notificationDisplay.display(notification);
        }

        function handleError(error, userMessage) {
            userMessage = userMessage || languageHandler.getMessage("error_occured");
            errorDisplay.show(userMessage);
            console.error(error.stack);
            loadingIndicator.hide();
        }

    }
})(golab.tools.starterApp);
