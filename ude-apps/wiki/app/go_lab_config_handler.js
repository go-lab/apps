import { p }       from 'app/util';
var LOAD_ERROR_MSG = 'ConfigHandler: dynamic config not yet loaded, call ' +
                     'configManager.loadConfig first.';

export default function(_storageHandler, configDefinition, defaultConfig) {
    var dynamicConfig = null;
    var storageHandler = p.promisifyObject(_storageHandler, [
        'createResource',
        'updateResource',
        'readLatestResource',
        'configureFilters'
    ]);

    return {
        loadConfig: loadConfig,
        getEntry: getConfigEntry,
        writeConfig: writeConfigFromMap,
        resetToDefaultConfig: resetConfig,
    };

    function writeConfigFromMap(configMap) {
        return writeDynamicConfig(convertMapToConfig(configMap));
    }

    function loadConfig(callback) {
        // filter by resource type
        storageHandler.configureFilters(true, false, false, false);
        return storageHandler.readLatestResource(null)
        .then(function(resource) {
            if (resource === null) {
                return storageHandler.createResource(defaultConfig);
            } else {
                return resource;
            }
        }).then(setDynamicConfigFromResource);
    }

    function getConfigEntry(key) {
        assertDynamicConfigLoaded();
        var entry = dynamicConfig[key] || defaultConfig[key];
        if (typeof entry !== 'object') {
            throw new Error('Entry with key ' + key + ' not found in config.');
        }
        if (Array.isArray(entry.value)) {
            return entry.value.slice();
        }
        return entry.value;
    }

    function writeDynamicConfig(newConfig) {
        return Promise.try(assertDynamicConfigLoaded)
        .then(() => {
            newConfig.id = dynamicConfig.id;
            newConfig.metadata = metadataHandler.getMetadata();
            return storageHandler.updateResource(
                dynamicConfig.id,
                newConfig
            );
        }).then(setDynamicConfigFromResource);
    }

    function resetConfig(callback) {
        return Promise.try(assertDynamicConfigLoaded)
        .then(() => writeDynamicConfig(defaultConfig));
    }

    function assertDynamicConfigLoaded() {
        if (dynamicConfig === null) {
            throw new Error(LOAD_ERROR_MSG);
        }
    }

    function setDynamicConfigFromResource(resource) {
        dynamicConfig = resource.content;
        dynamicConfig.id = resource.metadata.id;
    }

    // from `{ key: 'val' }` to `{ key: { value: 'val' }}`
    function convertMapToConfig(map) {
        return Object.keys(map).reduce(function(config, key) {
            config[key] = { value: map[key] };
            return config;
        }, {});
    }
}
