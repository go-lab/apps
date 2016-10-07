/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        resource.js
 *  Part of     Go-Lab Questionnaire tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading and saving of resources
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     30/06/16  (Created)
 *		30/06/16  (Last modified)
 */

(function() {
    "use strict";
    console.log('========== loading tools/quest/js/resource.js');

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var quest = tools.quest = tools.quest || {};

    var RESOURCE_NAME = quest.configuration.resource_name;
    var RESOURCE_TYPE = 'quest';

    quest.set_context = function() {
        var ils = window.golab.ils;
        var context = quest.configurationStorageHandler.getMetadataHandler ?
            quest.configurationStorageHandler.getMetadataHandler().getContext() :
            window.golab.ils.context.unknown;

        var runningInGraasp = false;
        var runningInIls = false;
        var runningInGolabz = false;
        var runningStandalone = false;

        switch (context) {
        case window.golab.ils.context.graasp:
            runningInGraasp = true;
            quest.context = 'graasp';
            break;
        case window.golab.ils.context.ils:
            runningInIls = true;
            quest.context = 'ils';
            break;
        case window.golab.ils.context.preview:
            runningInGolabz = true;
            quest.context = 'golabz';
            break;
        case window.golab.ils.context.standalone:
            runningStandalone = true;
            quest.context = 'standalone';
            break;
        }

        if (runningInIls) {
            quest.configuration.show_configuration = false;
            quest.configuration.show_about = false;
        }

        if (runningInGolabz) {
            quest.model = [];
        }
    };

    quest.load_configuration = function(callback) {
        var sh = quest.configurationStorageHandler;

        quest.configuration_resource_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);

        if (quest.context === 'preview') {
            sh.createResource({
                configuration: quest.configuration,
                model: []
            }, function(error, resource) {
                if (error) {
                    log_error('quest.createResource error ', error);
                    return callback();
                }

                quest.configuration_resource_id = resource.metadata.id;
                quest.configuration.questions = quest.test_questions;
                quest.model = new quest.Model({
                    configuration: quest.configuration
                });
                return callback();
            });
            return;
        }

        sh.readLatestResource('configuration', function(error, resource) {
            if (error) {
                log_error('quest.readLatestResource failed ', error);
                return callback();
            }

            var version;

            if (resource && resource.content && resource.content.configuration)
                version = resource.content.configuration.version;

            if (resource === null || !(version >= 2.4)) {
                sh.createResource({
                    configuration: quest.configuration,
                    model: []
                }, function(error, resource) {
                    if (error) {
                        log_error('quest.createResource error ', error);
                        return callback();
                    }

                    if (version)
                        console.log('Creating new configuration for version ' + version);

                    quest.configuration_resource_id = resource.metadata.id;
                    quest.configuration.questions = quest.test_questions;
                    quest.model = new quest.Model({
                        configuration: quest.configuration
                    });
                    return callback();
                });
                return;
            }

            var json = resource.content;

            if (json === undefined || json.configuration === undefined) {
                quest.configuration.resource_id = null;
                return callback();
            }

            if (json.configuration.configuration)
                json.configuration = json.configuration.configuration;

            quest.configuration_resource_id = resource.metadata.id;

            quest.configuration = json.configuration;
            quest.model = new quest.Model({
                configuration: quest.configuration
            });

            return callback();
        });
    };

    quest.save_configuration = function() {
        var sh = quest.configurationStorageHandler;
        var content = {
            configuration: quest.model.json_configuration()
        };
        var id = quest.configuration_resource_id;

        sh.updateResource(id, content, function(error,resource) {
            if (error)
                log_error('quest updateResource ', error);
        });
    };

    quest.save_resource = function(model) {
        var sh = quest.storageHandler;
        var mh = quest.metadataHandler;
        var data = model.json_answers();

        if (quest.resource_id) {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.updateResource(quest.resource_id, data, function(error, resource) {
                if (error)
                    log_error('quest.save_resource error', error);
            });
        } else {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.createResource(data, function(error, resource) {
                if (error)
                    log_error('quest.create_resource error', error);
                quest.resource_id = resource.metadata.id;
            });
        }
    };

    quest.load_resource = function(model, callback) {
        if (quest.context === 'preview')
            return callback();

        var sh = quest.storageHandler;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, true, true, true);

        sh.readLatestResource('quest', function(error, resource) {
            if (error) {
                log_error('quest.load_resource failed', error);
                return callback();
            }

            if (resource !== null) {
                quest.resource_id = resource.metadata.id;
                model.load_answers(resource.content);
            }

            return callback();
        });
    };

    quest.load_student_resources = function(callback) {
        var sh = quest.storageHandler;

        quest.student_resources.splice(0, quest.student_resources.length);

        //  resource-type, user, provider, app-id
        sh.configureFilters(false, false, true, true);

        sh.listResourceMetaDatas(function(error, meta) {
            if (error) {
                log_error('quest.load_student_resources failed ', error);
                return callback();
            }

            if (meta.length === 0)
                return callback();

            var count = 0;

            for (var i=0; i<meta.length; i++) {
                var item = meta[i];

                if (item.metadata.target.objectType !== RESOURCE_TYPE) {
                    count++;
                    if (count >= meta.length)
                        return callback();
                    continue;
                }

                sh.readResource(item.id, function(error,resource) {
                    if (!error) {
                        quest.student_resources.push({
                            student: resource.metadata.actor.displayName,
                            text: resource.content
                        });
                    }
                    count++;
                    if (count >= meta.length)
                        return callback();
                });
            }
        });
    };

    function log_error(label, error) {
        console.log(label);
        { var seen = []; console.log(JSON.stringify(error,function(_,value) { if (typeof value === 'object' && value !== null) { if (seen.indexOf(value) !== -1) return; else seen.push(value); } return value; },4)); };
        console.log('-----');
    }
}).call(this);
