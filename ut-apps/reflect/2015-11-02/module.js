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

    var ut = this.ut = this.ut || {};
//    var labs = ut.labs = ut.labs || {};
//    var libs = ut.libs = ut.libs || {};
    var tools = ut.tools = ut.tools || {};
//    var commons = ut.commons = ut.commons || {};
//    var utils = commons.utils = commons.utils || {};
    var reflect = tools.reflect = tools.reflect || {};

    var commons = this.golab.common;

    printf('========== loading tools/reflect/js/module.js');

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

    commons.resourceLoader.addResourceModules(reflect_scripts_module, "/tools/reflect/");

    var module = {
        Reflect: [
            [ "font-awesome",
              "/libs/js/jsonr.js",
              "jquery",
              "jquery-ui"
            ],
            [ "angular1.3"
            ],
            [ "ui-notification"
            ],
            [ "goLabUtils",
              "eventEmitter",
              "/libs/js/jquery.filter_input.js",
              "/libs/js/angular/localStorageModule.js",
              "/libs/h/goodies.js"
            ],
            [ "createEnvironmentHandlers",
              "goLabModels"
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

    commons.resourceLoader.addResourceModules(module);

    var startReflect = function(conf) {
        var loadAndStartReflect = function() {
            commons.resourceLoader.orderedLoad([["Reflect"]]);

            return commons.resourceLoader.ready(function() {
                return commons.createEnvironmentHandlers(
                    ["reflection", "configuration"], 
                    "reflect",
                    commons.resourceLoader.getDesiredLanguage(),
                    function(ehs) {
                        reflect.languageHandler = ehs.languageHandler;
                        reflect.metadataHandler = ehs.reflection.metadataHandler;
                        reflect.storageHandler = ehs.reflection.storageHandler;
                        reflect.actionLogger = ehs.reflection.actionLogger;
                        reflect.base_url = commons.resourceLoader.getRootUrl();

                        var sh = reflect.configurationStorageHandler = ehs.configuration.storageHandler;
                        //  resource-type, user, provider, app-id
                        sh.configureFilters(true, false, true, true);
                        
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
                            printf('*************** BEFORE ANGULAR');
                            angular.bootstrap(document.body, ['reflect']);
                            printf('*************** AFTER ANGULAR');
                            reflect.start();
                            printf('*************** AFTER START');
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