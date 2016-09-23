/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        module.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading of source code
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     19/11/15  (Created)
 *		22/11/15  (Last modified)
 */ 

(function() {
    "use strict";

    var commons = this.golab.common;
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var timo = libs.timo = libs.timo || {};

    printf('========== loading libs/expression/js/module.js');

    console.log('COMPILED timo ' + __DATE__ + ' ' + __TIME__);

    var timo_scripts_module = {
        timo_scripts: [
            [ "css/timo.css"
            ],
            [ "js/is.js"
            ],
            [ "libs/decimal.min.js"
            ],
            [ "js/calculate.js"
            ],
            [ "js/expression.js"
            ],
            [ "js/functor.js",
              "js/type.js",
              "js/plot.js",
              "js/symbols.js",
              "js/parser.js"		// Last
            ],
            [ "js/timo.js"
            ]
        ]
    };

    commons.resourceLoader.addResourceModules(timo_scripts_module, "/libs/expression/");

    var module = {
        timo: [
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
            [ "timo_scripts"
            ]
        ]
    };

    commons.resourceLoader.addResourceModules(module);

    var startTimo = function(conf) {
        var loadAndStartTimo = function() {
            commons.resourceLoader.orderedLoad([["timo"]]);

            return commons.resourceLoader.ready(function() {
                return commons.createEnvironmentHandlers(
                    ["timo", "configuration"], 
                    "timo",
                    commons.resourceLoader.getDesiredLanguage(),
                    function(ehs) {
                        timo.ehs = ehs;
                        timo.languageHandler = ehs.languageHandler;
                        timo.metadataHandler = ehs.timo.metadataHandler;
                        timo.storageHandler = ehs.timo.storageHandler;
                        timo.actionLogger = ehs.timo.actionLogger;
                        timo.base_url = commons.resourceLoader.getRootUrl();

                        var sh = timo.configurationStorageHandler = ehs.configuration.storageHandler;
                        //  resource-type, user, provider, app-id
                        sh.configureFilters(true, false, true, true);
                        
                        var forApplication = "timo";
                        var forApplicationFilter = function(metadata) {
                            if (metadata && metadata.target && metadata.target.forApplication) {
                                return metadata.target.forApplication === forApplication;
                            } else {
                                return false;
                            }
                        };
                        sh.setCustomFilter(forApplicationFilter);
                        sh.getMetadataHandler().getTarget().forApplication = forApplication;
                
                        timo.configure(conf, function() {
                            angular.bootstrap(document.body, ['timo']);
                            timo.start();
                        });
                    });
            });
        };

        if (typeof(gadgets) !== "undefined")
            gadgets.util.registerOnLoadHandler(loadAndStartTimo);
        else
            loadAndStartTimo();
    };

    timo.startTimo = function(conf) {
        startTimo(conf);
    };
}).call(this);
