/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        resource.js
 *  Part of     Go-Lab Entry Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading and saving of resources
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     01/03/16  (Created)
 *		01/03/16  (Last modified)
 */ 

(function() {
    "use strict";
    printf('========== loading tools/entry/js/resource.js');

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var entry = tools.entry = tools.entry || {};

    var RESOURCE_NAME = entry.configuration.resource_name;
    var RESOURCE_TYPE = 'entry';

    entry.set_context = function() {
        var ils = window.golab.ils;
        var context = entry.configurationStorageHandler.getMetadataHandler ?
            entry.configurationStorageHandler.getMetadataHandler().getContext() :
            window.golab.ils.context.unknown;

        var runningInGraasp = false;
        var runningInIls = false;
        var runningInGolabz = false;
        var runningStandalone = false;

        switch (context) {
        case window.golab.ils.context.graasp:
            runningInGraasp = true;
            entry.context = 'graasp';
            break;
        case window.golab.ils.context.ils:
            runningInIls = true;
            entry.context = 'ils';
            break;
        case window.golab.ils.context.preview:
            runningInGolabz = true;
            entry.context = 'golabz';
            break;
        case window.golab.ils.context.standalone:
            runningStandalone = true;
            entry.context = 'standalone';
            break;
        }

        if (runningInIls) {
            entry.configuration.show_configuration = false;
            entry.configuration.show_about = false;
        }

        if (runningInGolabz) {
            if (!entry.model)
                entry.model = new entry.Model({
                    configuration: entry.configuration
                });
        }
    };

    entry.load_configuration = function(callback) {
        var sh = entry.configurationStorageHandler;
        
        entry.configuration_resource_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);

        sh.readLatestResource('configuration', function(error, resource) {
            if (error) {
                log_error('entry.readLatestResource failed ', error);
                return callback();
            }

            if (resource === null) {
                sh.createResource({
                    configuration: entry.configuration,
                    model: []
                }, function(error, resource) {
                    if (error) {
                        log_error('entry.createResource error ', error);
                        return callback();
                    }
                    
                    entry.configuration_resource_id = resource.metadata.id;
                    entry.configuration.questions = entry.test_questions;
                    entry.model = new entry.Model({
                        configuration: entry.configuration
                    });
                    entry.set_context();
                    return callback();
                });
            } else {
                var json = resource.content;

                if (json === undefined || json.configuration === undefined) {
                    entry.configuration.resource_id = null;
                    return callback();
                }

                if (json.configuration.configuration)
                    json.configuration = json.configuration.configuration;

                entry.configuration_resource_id = resource.metadata.id;

                entry.configuration = json.configuration;
                if (entry.configuration.default_placeholder === true)
                    entry.configuration.placeholder = entry.translate('placeholder');
                entry.model = new entry.Model({
                    configuration: entry.configuration
                });

                return callback();
            }
        });
    };

    entry.save_configuration = function() {
        var sh = entry.configurationStorageHandler;
        var id = entry.configuration_resource_id;

        var ph = entry.translate('placeholder');
        var rn = entry.translate('resource_name');

        if (ph !== entry.configuration)
            entry.configuration.default_placeholder = false;

        if (rn !== entry.configuration)
            entry.configuration.default_resource_name = false;

        var content = {
            configuration: entry.model.json_configuration()
        };

        sh.updateResource(id, content, function(error,resource) {
            if (error)
                log_error('entry updateResource ', error);
        });
    };

    entry.remove_all_resources = function(callback) {
        var sh = entry.storageHandler;
        var resources = sh.listResourceMetaDatas(function(error, meta) {
            if (error) {
                log_error('entry.listResourceMetaDatas failed ', error);
                return callback();
            }

            var func = function(error, resource) {};

            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                if (entry.metadata.target.objectType === RESOURCE_TYPE)
                    sh.deleteResource(entry.id, func);
            }
            if (callback)
                callback();
        });
    };

    entry.model_from_last_resource = function(model, callback) {
        var sh = entry.storageHandler;

        sh.listResourceMetaDatas(function(error, meta) {
            if (error) {
                log_error('entry.listResourceMetaDatas failed ', error);
                return callback();
            }

            entry.resource_id = null;

            for (var i=0; i<meta.length; i++) {
                var item = meta[i];

                if (item.metadata.target.objectType === RESOURCE_TYPE) {
                    if (item.resource_id) {
                        sh.deleteResource(item.id, function(error,resource) {
                        });
                    } else {
                        item.resource_id = item.id;

                        sh.readResource(item.resource_id, function(error,resource) {
                            if (error) {
                                log_error('entry.readResource ', error);
                                return;
                            }

                            var data = resource.content;
                            model.load_json(data.model);
                            return callback();
                        });
                    }
                }
            }

            return callback();		// Nothing found
        });
    };

    entry.save_resource = function(model) {
        var sh = entry.storageHandler;
        var mh = entry.metadataHandler;
        var data = model.json_resource();

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, true, true, true);

        if (entry.resource_id) {
            mh.setTargetDisplayName(entry.configuration.resource_name);
            sh.updateResource(entry.resource_id, data, function(error, resource) {
                if (error)
                    log_error('entry.save_resource error', error);
            });
        } else {
            mh.setTargetDisplayName(entry.configuration.resource_name);
            sh.createResource(data, function(error, resource) {
                if (error)
                    log_error('entry.create_resource error', error);
                entry.resource_id = resource.metadata.id;
            });
        }
    };

    entry.load_resource = function(model, callback) {
        var sh = entry.storageHandler;
        var mh = entry.metadataHandler;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, true, true, true);

        sh.readLatestResource('entry', function(error, resource) {
            if (error) {
                log_error('entry.load_resource failed', error);
                return callback();
            }

            if (resource !== null) {
                entry.resource_id = resource.metadata.id;
                model.load_json(resource.content);
            }
            return callback();
        });
    };

    entry.load_student_responses = function(callback) {
        var sh = entry.storageHandler;
        var mh = entry.metadataHandler;

        //  resource-type, user, provider, app-id
        sh.configureFilters(false, false, true, true);

//        printf('load student_responses');

        sh.listResourceMetaDatas(function(error, meta) {
            if (error) {
                log_error('entry.listResourceMetaDatas failed ', error);
                return callback();
            }

            var count = 0;

//            printf('looking at ' + meta.length + ' potential student responses');

            if (meta.length === 0)
                return callback();

            for (var i=0; i<meta.length; i++) {
                var item = meta[i];

//                pp(item);
//                printf('RESOURCE ' + item.metadata.target.objectType);

                if (item.metadata.target.objectType !== RESOURCE_TYPE) {
                    count++;
                    if (count >= meta.length) {
//                        printf('calling callback ' + callback);
                        return callback();
                    }
                    continue;
                }

                sh.readResource(item.id, function(error,resource) {
                    if (!error)
                        entry.student_responses.push({
                            student: resource.metadata.actor.displayName,
                            text: resource.content.text
                        });
//                    printf('response from ' + resource.metadata.actor.displayName);
//                    printf(resource.content.text);
                    count++;
                    if (count >= meta.length) {
//                        printf('calling callback ' + callback);
                        return callback();
                    }
                });
            }
        });
    };

    function log_error(label, error) {
        printf(label);
        pp(error);
        printf('-----');
    }
}).call(this);

