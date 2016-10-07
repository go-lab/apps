/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        module.js
 *  Part of	Go-Lab Reflection Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading of source code
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014  University of Twente
 *  
 *  History     27/10/14  (Created)
 *		04/08/15  (Last modified)
 */ 

(function() {
    "use strict";

    var golab = this.golab = this.golab || {};
    var common = golab.common = golab.common || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var reflect = tools.reflect = tools.reflect || {};

    console.log('REFLECT COMPILED ' + __DATE__ + ' ' + __TIME__);

    var reflect_scripts_module = {
        reflect_scripts: [
            [ "css/reflect.css"
            ],
            [ "js/model.js",
              "js/file.js",
              "js/reflect.js",
              "js/phases.js",
              "js/xrange.js"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(reflect_scripts_module, "/tools/reflect/");

    var module = {
        Reflect: [
            [ "font-awesome",
              "/libs/js/jsonr.js",
              "jquery",
              "jquery-ui",
              "angular1.3",
              "ui-notification",
              "goLabUtils",
              "eventEmitter",
              "/libs/js/angular/localStorageModule.js",
              "/libs/js/jquery.filter_input.js",
              "/libs/h/goodies.js"
            ],
            [ "createEnvironmentHandlers"
            ],
            [ "textAngular",
              "/commons/js/PersistencyUtils.js",
              "/commons/js/utils.js",
              "/commons/js/angular/dragAndDrop.js",
              "/commons/js/angular/ngDataStore.js",
              "/commons/js/angular/resourceIOUI.js",
              "/commons/js/dataSource.js",
              "/commons/js/dataStore.js"
            ],
            [ "reflect_scripts"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(module);

/*
    reflect.CONFIGURATIONHandlers = function(ready) {
        return common.createEnvironmentHandlers(
            "configuration",
            "reflect",
            common.resourceLoader.getDesiredLanguage(),
            function(metadataHandler, storageHandler, actionLogger, languageHandler) {
                var sh = reflect.configurationStorageHandler = storageHandler;
                var forApplication = "reflect";
                var forApplicationFilter = function(metadata) {
                    if (metadata && metadata.target && metadata.target.forApplication) {
                        return metadata.target.forApplication === forApplication;
                    } else {
                        return false;
                    }
                };
                sh.setCustomFilter(forApplicationFilter);
                sh.getMetadataHandler().getTarget().forApplication = forApplication;
                
                return ready();
            });
    };

    reflect.createEnvironmentHandlers = function(ready) {
        return common.createEnvironmentHandlers(
            "reflection",
            "reflect",
            common.resourceLoader.getDesiredLanguage(),
            function(metadataHandler, storageHandler, actionLogger, languageHandler) {
                reflect.metadataHandler = metadataHandler;
                reflect.storageHandler = storageHandler;
                reflect.actionLogger = actionLogger;
                reflect.languageHandler = languageHandler;
                reflect.resourceLoader = common.resourceLoader;

                reflect.base_url = common.resourceLoader.getRootUrl();
                
                return ready();
            });
    };
*/

    var startReflect = function(conf) {
        var loadAndStartReflect = function() {
            common.resourceLoader.orderedLoad([["Reflect"]]);

            return common.resourceLoader.ready(function() {
                return common.createEnvironmentHandlers(
                    ["reflection", "configuration"], 
                    "reflect",
                    common.resourceLoader.getDesiredLanguage(),
                    function(ehs) {
                        reflect.languageHandler = ehs.languageHandler;
                        reflect.metadataHandler = ehs.reflection.metadataHandler;
                        reflect.storageHandler = ehs.reflection.storageHandler;
                        reflect.actionLogger = ehs.reflection.actionLogger;
                        reflect.base_url = common.resourceLoader.getRootUrl();

                        var sh = reflect.configurationStorageHandler = ehs.configuration.storageHandler;
                        var forApplication = "reflect";
                        var forApplicationFilter = function(metadata) {
                            if (metadata && metadata.target && metadata.target.forApplication) {
                                return metadata.target.forApplication === forApplication;
                            } else {
                                return false;
                            }
                        };
                        sh.setCustomFilter(forApplicationFilter);
                        sh.getMetadataHandler().getTarget().forApplication = forApplication;
                
                        reflect.configure(conf, function() {
                            angular.bootstrap(document.body, ['reflect']);
                            reflect.start();
                        });
                    });
            });
        };

        if (typeof(gadgets) !== "undefined")
            gadgets.util.registerOnLoadHandler(loadAndStartReflect);
        else
            loadAndStartReflect();
    };

    reflect.startReflect = function(conf) {
        startReflect(conf);
    };
}).call(this);
