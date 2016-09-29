(function(conceptCloud) {
    conceptCloud.Application = Application;

    function Application(environmentHandlers, loadingIndicator, errorDisplay) {

        environmentHandlers.conceptCloudRetriever.storageHandler.configureFilters(false, false, false, false);
        environmentHandlers.conceptCloudCache.storageHandler.configureFilters(true, false, false, true);

        // setting targetDisplayName
        environmentHandlers.conceptCloudRetriever.metadataHandler.setTargetDisplayName("conceptCloud");
        environmentHandlers.conceptCloudCache.metadataHandler.setTargetDisplayName("conceptCloud");
        environmentHandlers.configuration.metadataHandler.setTargetDisplayName("conceptCloud");

        // conceptCloud.conceptCloudRetriever only for concepts from 3rd party apps
        // conceptCloud.conceptCloudCache only for precalculated conceptCloud data
        // conceptCloud.config- only for configuration

        conceptCloud.errorDisplay = errorDisplay;

        // ActionLogger
        var actionLogger                = conceptCloud.retrieverActionLogger    = environmentHandlers.conceptCloudRetriever.actionLogger;
        var conceptCloudActionLogger    = conceptCloud.cacheActionLogger        = environmentHandlers.conceptCloudCache.actionLogger;
        var configActionLogger          = conceptCloud.configActionLogger       = environmentHandlers.configuration.actionLogger;

        // NotificationClient
        var notificationClient          = conceptCloud.notificationClient       = environmentHandlers.notificationClient;

        // StorageHandler
        var storageHandler              = conceptCloud.retrieverStorageHandler  = environmentHandlers.conceptCloudRetriever.storageHandler;
        var cacheStorageHandler         = conceptCloud.cacheStorageHandler      = environmentHandlers.conceptCloudCache.storageHandler;
        var configStorageHandler        = conceptCloud.configStorageHandler     = environmentHandlers.configuration.storageHandler;

        // MetadataHandler
        var metadataHandler             = conceptCloud.retrieverMetadataHandler = environmentHandlers.conceptCloudRetriever.metadataHandler;
        var cacheMetadataHandler        = conceptCloud.cacheMetadataHandler     = environmentHandlers.conceptCloudCache.metadataHandler;
        var configMetadataHandler       = conceptCloud.configMetadataHandler    = environmentHandlers.configuration.metadataHandler;

        // Language
        var languageHandler             = conceptCloud.languageHandler          = environmentHandlers.languageHandler;

        // Configuration
        var configHandler               = conceptCloud.configHandler            = environmentHandlers.configHandler;

        var notificationDisplay         = conceptCloud.notficationDisplay       = conceptCloud.NotificationDisplay($('#notifications'));
        var aggregatedView              = conceptCloud.aggregatedView;
        var showQuestions               = conceptCloud.showQuestions;

        var configDialog = conceptCloud.ConfigDialog($('#config'), languageHandler);

        // App-specific variable
        var toolbar = conceptCloud.toolbar = conceptCloud.Toolbar($('#toolbar'), languageHandler, {
            showLabels: false,
            hideConfiguration: metadataHandler.getContext() === 'ils',
        });

        var errorHandler            = conceptCloud.errorHandler             = conceptCloud.ErrorHandler(errorDisplay);
        var loggingInterface        = conceptCloud.loggingInterface         = conceptCloud.LoggingInterface();
        var resourceController      = conceptCloud.resourceController       = conceptCloud.ResourceController();
        var conceptController       = conceptCloud.conceptController        = conceptCloud.ConceptController();
        var conceptModels           = conceptCloud.conceptModels            = conceptCloud.ConceptModels();
        var conceptCloudEvolution   = conceptCloud.conceptCloudEvolution    = conceptCloud.ConceptCloudEvolution();
        var tagCloud                = conceptCloud.tagCloud                 = conceptCloud.TagCloud();
        var interactionController   = conceptCloud.interactionController    = conceptCloud.InteractionController();

        switch(metadataHandler.getContext()){
            case "standalone"   : conceptCloud.aggregatedView   = false; conceptCloud.analytics = false; conceptCloud.useCache = false; break;
            case "preview"      : conceptCloud.aggregatedView   = false; conceptCloud.analytics = false; conceptCloud.useCache = false; break;
            case "graasp"       : conceptCloud.aggregatedView   = true; conceptCloud.analytics = true; conceptCloud.useCache = true; break;
            default             : conceptCloud.aggregatedView   = false; conceptCloud.analytics = false; conceptCloud.useCache = true; break;
        }

        var standaloneMetadata = {
            "actor": {
                "objectType": "html_student",
                "id": "e1b8948f-321e-78ca-d883-80500aae71b5",
                "displayName": "Luke"
            },
            "target": {
                "objectType": "conceptCloud",
                "id": "4b8f69e3-2914-3a1a-454e-f4c157734bd1",
                "displayName": "conceptCloud"
            },
            "generator": {
                "objectType": "application",
                "url": "http://www.golabz.eu/apps/conceptcloud",
                "id": "c9933ad6-dd4a-6f71-ce84-fb1676ea3aac",
                "displayName": "ConceptCloud"
            },
            "provider": {
                "objectType": "ils",
                "url": "http://www.golabz.eu/apps/conceptcloud",
                "id": "10548c30-72bd-0bb3-33d1-9c748266de45",
                "displayName": "Go Lab ConceptCloud"
            }
        };

        // configurations
        // show/hide reflection question
        conceptCloud.showQuestions = configHandler.getEntry('reflection');
        conceptCloud.timeOffset = configHandler.getEntry('timeOffset');
        conceptCloud.evolution = configHandler.getEntry('evolution');

        // DEV SETTINGS
        // conceptCloud.aggregatedView = true;
        // conceptCloud.evolution = true;
        // conceptCloud.analytics = true;
        // conceptCloud.useDummyData = false;
        // conceptCloud.useCache = true;
        // conceptCloud.showQuestions = true;

        conceptCloud.generalModel = {};
        conceptCloud.userModel = {};
        conceptCloud.ilsStructure = {};
        conceptCloud.ilsPhases = [];
        conceptCloud.ilsPhasesWithApps = [];
        conceptCloud.ilsApps = [];

        console.log(conceptCloud);

//      buildInteractionController(conceptCloud, resourceController, tagCloud);


        if(metadataHandler.getContext() === "standalone" || metadataHandler.getContext() === "preview") {
            if(metadataHandler.getActor().displayName == undefined || metadataHandler.getActor().displayName === null) {
                metadataHandler.setMetadata(standaloneMetadata);
            }
        }


        // configTool
        toolbar.onActionClick('configure', function() {
            try {
                openConfig();
            } catch(error) {
                errorHandler.handleError(error);
            }
        });


        configDialog.onReset(function() {
            loadingIndicator.show();
            configDialog.hide();
            configHandler.resetToDefaultConfig(function(error) {
                if (error) {
                    errorHandler.handleError(error,
                        languageHandler.getMessage('reset_config_error'));
                }
                loadingIndicator.hide();
            });
        });

        configDialog.onSave(function(newConfig) {
            loadingIndicator.show();
            configDialog.hide();
            configHandler.writeConfig(newConfig, function(error, newConfig) {
                if (error) {
                    errorHandler.handleError(error,
                        languageHandler.getMessage('save_config_error'));
                }
                loadingIndicator.hide();
            });
        });

        function openConfig() {
            configDialog.show({
                // defaultTitle: configHandler.getEntry('defaultTitle'),
                reflection: configHandler.getEntry('reflection'),
                timeOffset: configHandler.getEntry('timeOffset'),
                analytics: configHandler.getEntry('analytics'),
                evolution: configHandler.getEntry('evolution'),

            });
        }

        tagCloud.initialize();

        loadingIndicator.hide();

        console.log('[ConceptCloud] The application started. Yay!');
        actionLogger.logApplicationStarted();

    }


})(golab.tools.conceptCloud);
