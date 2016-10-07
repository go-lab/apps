/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        module.js
 *  Part of	Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading the source code
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2013, 2014, 2015  University of Twente
 *  
 *  History     04/07/13  (Created)
 *		07/12/15  (Last modified)
 */ 

(function() {
    "use strict";

    console.log('EDT4: ' + __DATE__ + ' ' + __TIME__);

    var golab = this.golab = this.golab || {};
    var common = golab.common = golab.common || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var edt = tools.edt = tools.edt || {};

    common.resourceLoader = common.resourceLoader || {};

    var edt_scripts_module = {
        edt_scripts: [
            [ "css/edt.css",
              "js/js-quantities.js",	// Before model.js and edt.js
              "js/quantity.js",
              "js/parse_number.js",
              "js/is.js"
            ],
            [ "js/expression.js"
            ],
            [ "js/model.js"		// After expression, before edt.js
            ],
            [ "js/edt.js",
              "js/messages.js"
            ],
            [ "js/resource.js"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(edt_scripts_module, "/tools/edt3/");

    var module = {
        EDT: [
            [ "font-awesome",
              "/libs/js/jsonr.js",
              "jquery"
            ],
            [ "jquery-ui"
            ],
            [ "angular1.5"
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
            [ "textAngular",
              "/commons/js/PersistencyUtils.js",
              "/commons/js/utils.js",
              "/commons/js/angular/dragAndDrop.js",
              "/commons/js/angular/ngDataStore.js",
              "/commons/js/angular/resourceIOUI.js",
              "/commons/js/dataSource.js",
              "/commons/js/dataStore.js"
            ],
            [ "edt_scripts"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(module);

    var startEDT = function(configuration) {
        var loadAndStartEDT = function() {
            common.resourceLoader.orderedLoad([["EDT"]]);

            return common.resourceLoader.ready(function() {
                return common.createEnvironmentHandlers(
                    ["experiment_designs", "configuration", "dataSet"],
                    "edt",
                    common.resourceLoader.getDesiredLanguage(),
                    { notificationServer: null },
                    function(ehs) {
                        edt.ehs = ehs;
                        edt.base_url = common.resourceLoader.getRootUrl();
                        edt.languageHandler = ehs.languageHandler;
                        edt.actionLogger = ehs.experiment_designs.actionLogger;
                        edt.metadataHandler = ehs.experiment_designs.metadataHandler;
                        edt.storageHandler = ehs.experiment_designs.storageHandler;
                        edt.dataSetStorageHandler = ehs.dataSet.storageHandler;
                        edt.dataSetMetadataHandler = ehs.dataSet.metadataHandler;
                        var sh = edt.configurationStorageHandler = ehs.configuration.storageHandler;
                        var forApplication = "edt";
                        var forApplicationFilter = function(metadata) {
                            if (metadata && metadata.target && metadata.target.forApplication) {
                                return metadata.target.forApplication === forApplication;
                            } else {
                                return false;
                            }
                        };
                        sh.setCustomFilter(forApplicationFilter);
                        sh.getMetadataHandler().getTarget().forApplication = forApplication;
                        edt.configure(configuration, function() {
                            angular.bootstrap(document.body, ['edt']);
                            edt.start();
                        });
                    });
            });
        };

        if (typeof gadgets !== "undefined") {
            return gadgets.util.registerOnLoadHandler(loadAndStartEDT);
        } else {
            return loadAndStartEDT();
        }
    };

    edt.startEDT = function(conf) {
        return startEDT(conf);
    };
}).call(this);
