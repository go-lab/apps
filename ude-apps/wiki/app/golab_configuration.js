import { p }                 from 'app/util';
import GoLabPageData         from 'app/go_lab_page_data';
import GoLabWikiActionLogger from 'app/go_lab_wiki_action_logger';
import GoLabLocalizedStrings from 'app/go_lab_localized_strings';
import GoLabConfigHandler    from 'app/go_lab_config_handler';

var RESOURCE_TYPES = ['collide wiki', 'collide wiki config'];
var TOOL_NAME = 'collide wiki';
var ENV_HANDLERS_OPTIONS = {
//    storageServer: null,
    notificationServer: null,
    cache: false
};

function correctGraaspUrl(location) {
    if (location.hash.contains('rpctoken')) location.hash = '#';
}

function getEnvironmentHandlers(locale) {
    return new Promise((resolve, reject) => {
        golab.common.createEnvironmentHandlers(RESOURCE_TYPES,
            TOOL_NAME,
            locale,
            ENV_HANDLERS_OPTIONS,
            (envHandlers) => {
                var {
                    metadataHandler,
                    storageHandler,
                    actionLogger,
                    } = envHandlers[RESOURCE_TYPES[0]];

                var configStorageHandler =
                    envHandlers[RESOURCE_TYPES[1]].storageHandler;


                // setting targetDisplayName
                envHandlers[RESOURCE_TYPES[0]].metadataHandler.setTargetDisplayName("wiki");
                envHandlers[RESOURCE_TYPES[1]].metadataHandler.setTargetDisplayName("wiki configuration");

                resolve({
                    metadataHandler,
                    storageHandler,
                    actionLogger,
                    languageHandler: envHandlers.languageHandler,
                    notificationClient: envHandlers.notificationClient,
                    configStorageHandler,
                });
            });
    });
}

function getLocale() {
    if (typeof gadgets !== 'undefined') {
        var prefs = new gadgets.Prefs();
        return prefs.getLang();
    }
    return 'en';
}

function isCollaborative(configHandler, metadataHandler) {
    return configHandler.getEntry('collaborative') === 'true' ||
        metadataHandler.getContext() === 'graasp' ||
        metadataHandler.getContext() === 'standalone';
}

function setMetadataTarget(metadataHandler) {
    var metaData = metadataHandler.getMetadata();
    var target = metaData.target;
    target.id = metaData.provider.id;
    target.displayName = `${TOOL_NAME} in ${metaData.provider.displayName}`;
    metadataHandler.setTarget(target);
    metadataHandler.setTargetDisplayName("wiki");
}

export default function (collaborative = false) {
    //correctGraaspUrl(window.location);

    return p.spawn(function*() {
        var locale = getLocale();

        var {
            metadataHandler,
            storageHandler,
            actionLogger,
            notificationClient,
            languageHandler,
            configStorageHandler,
            } = yield getEnvironmentHandlers(locale);

        setMetadataTarget(metadataHandler);
        metadataHandler.setTargetDisplayName("wiki");

        var localizedStrings = GoLabLocalizedStrings(
            languageHandler
        );

        var configHandler = GoLabConfigHandler(
            configStorageHandler,
            window.golab.tools.configurationDefinition.wiki,
            window.golab.tools.configuration.wiki
        );
        yield configHandler.loadConfig();

        storageHandler.setForUserFilter(
            !isCollaborative(configHandler, metadataHandler)
        );
        var pageData = GoLabPageData(storageHandler, RESOURCE_TYPES[0]);

        actionLogger = GoLabWikiActionLogger(actionLogger);

        return {
            pageData,
            actionLogger,
            metadataHandler,
            locale,
            localizedStrings,
            configHandler,
        };
    });
}
