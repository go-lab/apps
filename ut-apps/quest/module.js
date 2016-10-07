/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        module.js
 *  Part of     Go-Lab Questionnaire tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading the source code
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     30/06/16  (Created)
 *		30/06/16  (Last modified)
 */ 

(function() {
    "use strict";
    printf('========== loading tools/quest/js/module.js');

    var golab = this.golab = this.golab || {};
    var common = golab.common = golab.common || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var quest = tools.quest = tools.quest || {};

    console.log('QUEST: ' + __DATE__ + ' ' + __TIME__);

    common.resourceLoader = common.resourceLoader || {};

    var quest_scripts_module = {
        quest_scripts: [
            [ "css/quest.css",
              "js/is.js",
              "js/sortable.js",
              "js/ui-bootstrap.js"
            ],
            [ "js/model.js"
            ],
            [ "js/quest.js"
            ],
            [ "js/resource.js",
              'js/teacher.js'
            ]
        ]
    };

    common.resourceLoader.addResourceModules(quest_scripts_module, "/tools/quest/");

    var module = {
        quest: [
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
            [ "quest_scripts"
            ]
        ]
    };

    common.resourceLoader.addResourceModules(module);

    var startQuest = function(configuration) {
        var loadAndStartQuest = function() {
            common.resourceLoader.orderedLoad([["quest"]]);

            return common.resourceLoader.ready(function() {
                return common.createEnvironmentHandlers(
                    ["quest", "configuration"],
                    "quest",
                    common.resourceLoader.getDesiredLanguage(),
                    { notificationServer: null,
                      cache: false
                    },
                    function(ehs) {
                        quest.ehs = ehs;
                        quest.base_url = common.resourceLoader.getRootUrl();
                        quest.languageHandler = ehs.languageHandler;
                        quest.actionLogger = ehs.quest.actionLogger;
                        quest.metadataHandler = ehs.quest.metadataHandler;
                        quest.storageHandler = ehs.quest.storageHandler;
                        var sh = quest.configurationStorageHandler = ehs.configuration.storageHandler;
                        var forApplication = "quest";
                        var forApplicationFilter = function(metadata) {
                            if (metadata && metadata.target && metadata.target.forApplication) {
                                return metadata.target.forApplication === forApplication;
                            } else {
                                return false;
                            }
                        };
                        sh.setCustomFilter(forApplicationFilter);
                        sh.getMetadataHandler().getTarget().forApplication = forApplication;
                        quest.configure(configuration, function() {
                            angular.bootstrap(document.body, ['quest']);
                            quest.start();
                        });
                    });
            });
        };

        if (typeof gadgets !== "undefined") {
            return gadgets.util.registerOnLoadHandler(loadAndStartQuest);
        } else {
            return loadAndStartQuest();
        }
    };

    quest.startQuest = function(conf) {
        return startQuest(conf);
    };
}).call(this);
