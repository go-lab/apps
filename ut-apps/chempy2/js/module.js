/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        module.js
 *  Part of	Go-Lab Chemical Equation Editor
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading of source code
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     23/03/15  (Created)
 *		01/12/15  (Last modified)
 */

(function() {
    "use strict";

    console.log('========== loading tools/chempy2/js/module.js');

    var golab = this.golab = this.golab || {};
    var common = golab.common = golab.common || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var chempy = tools.chempy = tools.chempy || {};

    console.log('COMPILED chempy ' + "Jan 29 2016" + ' ' + "13:42:44");

    var chempy_scripts_module = {
        chempy_scripts: [
            [ "css/chempy.css",
              "js/file.js"
            ],
            [ "js/chemistry.js",
              "js/chempy.js"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(chempy_scripts_module, "/tools/chempy/");

    var module = {
        Chempy: [
            [ "font-awesome",
              "/libs/js/jsonr.js",
              "jquery"
            ],
            [ "jquery-ui"
            ],
            [ "angular1.3"
            ],
            [ "ui-notification"
            ],
            [ "goLabUtils",
              "eventEmitter",
              "/libs/js/angular/localStorageModule.js",
              "/libs/js/jquery.filter_input.js",
              "/libs/h/goodies.js"
            ],
            [ "createEnvironmentHandlers"
            ],
            [ "/commons/js/PersistencyUtils.js",
              "/commons/js/utils.js",
              "/commons/js/angular/dragAndDrop.js",
              "/commons/js/angular/ngDataStore.js",
              "/commons/js/angular/resourceIOUI.js",
              "/commons/js/dataSource.js",
              "/commons/js/dataStore.js"
            ],
            [ "chempy_scripts"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(module);

    var startChempy = function(conf) {
        var loadAndStartChempy = function() {
            common.resourceLoader.orderedLoad([["Chempy"]]);

            common.resourceLoader.ready(function() {
                common.createEnvironmentHandlers(
                    ["chempy", "configuration"],
                    "chempy",
                    common.resourceLoader.getDesiredLanguage(),
                    { notificationServer: null },
                    function(ehs) {
                        chempy.ehs = ehs;
                        chempy.metadataHandler = ehs.chempy.metadataHandler;
                        chempy.storageHandler = ehs.chempy.storageHandler;
                        chempy.actionLogger = ehs.chempy.actionLogger;
                        chempy.languageHandler = ehs.languageHandler;
                        chempy.base_url = common.resourceLoader.getRootUrl();
                        var sh = chempy.configurationStorageHandler = ehs.configuration.storageHandler;
                        var forApplication = "chempy";
                        var forApplicationFilter = function(metadata) {
                            if (metadata && metadata.target && metadata.target.forApplication) {
                                return metadata.target.forApplication === forApplication;
                            } else {
                                return false;
                            }
                        };
                        sh.setCustomFilter(forApplicationFilter);
                        sh.getMetadataHandler().getTarget().forApplication = forApplication;

                        chempy.configure(conf, function() {
                            angular.bootstrap(document.body, ['chempy']);
                            chempy.start();
                        });
                    });
                });
        };

        if (typeof gadgets !== "undefined")
            gadgets.util.registerOnLoadHandler(loadAndStartChempy);
        else
            loadAndStartChempy();
    };

    chempy.startChempy = function(conf) {
        startChempy(conf);
    };
}).call(this);
