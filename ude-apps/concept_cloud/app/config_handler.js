(function(conceptCloud) {
    var LOAD_ERROR_MSG = 'ConfigHandler: dynamic config not yet loaded, call ' +
        'configManager.loadConfig first.';

    conceptCloud.ConfigHandler = ConfigHandler;

    function ConfigHandler(toolName, configDefintion, defaultConfig) {
        configDefintion = golab.tools.configurationDefinition.conceptCloud;
        defaultConfig = golab.tools.configuration.conceptCloud;
        var dynamicConfig = null;
        var storageHandler;
        var options = defaultConfig.environmentHandlerOptions;

        return {
            loadConfig: loadConfig,
            getEntry: getConfigEntry,
            writeConfig: writeConfigFromMap,
            resetToDefaultConfig: resetConfig,
        };

        function writeConfigFromMap(configMap, callback) {
            writeDynamicConfig(convertMapToConfig(configMap), callback);
        }

        function loadConfig(callback) {

            setStorageHandlerAndLoadConfig(conceptCloud.environmentHandlers.configuration.metadataHandler, conceptCloud.environmentHandlers.configuration.storageHandler);

            function setStorageHandlerAndLoadConfig(_metadataHandler, _storageHandler) {
                storageHandler = _storageHandler;
                if(_metadataHandler.getContext()=="standalone"){
                    storageHandler = new golab.ils.storage.LocalStorageHandler(_metadataHandler);
                }
                // filter by resource type
                storageHandler.configureFilters(true, false, false, true);
                storageHandler.readLatestResource(null, function(error, resource) {
                    if (error) {
                        return callback(error);
                    }
                    try {
                        var setConfig = setDynamicConfigFromResource.bind(null, callback);
                        if (resource === null) {
                            storageHandler.createResource(defaultConfig, setConfig);
                        } else {
                            setConfig(null, resource);
                        }
                    } catch(err) {
                        callback(err);
                    }
                });

            }
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

        function writeDynamicConfig(newConfig, callback) {
            assertDynamicConfigLoaded(callback);
            newConfig.id = dynamicConfig.id;
            storageHandler.updateResource(
                dynamicConfig.id,
                newConfig,
                setDynamicConfigFromResource.bind(null, callback)
            );
        }

        function resetConfig(callback) {
            assertDynamicConfigLoaded(callback);
            writeDynamicConfig(defaultConfig, callback);
        }

        function assertDynamicConfigLoaded(callback) {
            if (dynamicConfig === null) {
                var error = new Error(LOAD_ERROR_MSG);
                if (callback) {
                    callback(error);
                } else {
                    throw error;
                }
            }
        }

        function setDynamicConfigFromResource(callback, error, resource) {
            if (error) {
                return callback(error);
            }
            dynamicConfig = resource.content;
            dynamicConfig.id = resource.metadata.id;
            callback(null);
        }

        // from `{ key: 'val' }` to `{ key: { value: 'val' }}`
        function convertMapToConfig(map) {
            return Object.keys(map).reduce(function(config, key) {
                config[key] = { value: map[key] };
                return config;
            }, {});
        }
    }
})(golab.tools.conceptCloud);
