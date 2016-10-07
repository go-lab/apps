/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        module.js
 *  Part of     Go-Lab Entry Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading the source code
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     01/03/16  (Created)
 *		01/03/16  (Last modified)
 */

(function() {
    "use strict";
    console.log('========== loading tools/entry/js/module.js');

    var golab = this.golab = this.golab || {};
    var common = golab.common = golab.common || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var entry = tools.entry = tools.entry || {};

    console.log('ENTRY: ' + "Sep 19 2016" + ' ' + "15:46:03");

    common.resourceLoader = common.resourceLoader || {};

    var entry_scripts_module = {
        entry_scripts: [
            [ "css/entry.css",
              "js/is.js",
              "js/sortable.js",
              "js/ui-bootstrap.js"
            ],
            [ "js/model.js"
            ],
            [ "js/entry.js"
            ],
            [ "js/resource.js"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(entry_scripts_module, "/tools/entry/");

    var module = {
        entry: [
            [ "font-awesome",
              "/libs/js/jsonr.js",
              "jquery"
            ],
            [ "jquery-ui"
            ],
            [ "bootstrap",
              "/libs/bootstrap/js/bootstrap.min.js"
            ],
            [ "angular1.5"
            ],
            [ "ui-notification"
            ],
            [ "goLabUtils",
              "eventEmitter",
              "/libs/js/angular/localStorageModule.js",
              "/libs/js/jquery.filter_input.js",
              "/libs/js/angular/elastic.js",
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
            [ "entry_scripts"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(module);

    var startEntry = function(configuration) {
        var loadAndStartEntry = function() {
            common.resourceLoader.orderedLoad([["entry"]]);

            return common.resourceLoader.ready(function() {
                return common.createEnvironmentHandlers(
                    ["entry", "configuration"],
                    "entry",
                    common.resourceLoader.getDesiredLanguage(),
                    { notificationServer: null,
                      cache: false
                    },
                    function(ehs) {
                        entry.ehs = ehs;
                        entry.base_url = common.resourceLoader.getRootUrl();
                        entry.languageHandler = ehs.languageHandler;
                        entry.actionLogger = ehs.entry.actionLogger;
                        entry.metadataHandler = ehs.entry.metadataHandler;
                        entry.storageHandler = ehs.entry.storageHandler;
                        var sh = entry.configurationStorageHandler = ehs.configuration.storageHandler;
                        var forApplication = "entry";
                        var forApplicationFilter = function(metadata) {
                            if (metadata && metadata.target && metadata.target.forApplication) {
                                return metadata.target.forApplication === forApplication;
                            } else {
                                return false;
                            }
                        };
                        sh.setCustomFilter(forApplicationFilter);
                        sh.getMetadataHandler().getTarget().forApplication = forApplication;
                        entry.configure(configuration, function() {
                            angular.bootstrap(document.body, ['entry']);
                            entry.start();
                        });
                    });
            });
        };

        if (typeof gadgets !== "undefined") {
            return gadgets.util.registerOnLoadHandler(loadAndStartEntry);
        } else {
            return loadAndStartEntry();
        }
    };

    entry.startEntry = function(conf) {
        return startEntry(conf);
    };
}).call(this);
