/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        file.src
 *  Part of     Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Dealing with persistency of resources
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014  University of Twente
 *  
 *  History     28/11/14  (Created)
 *		29/11/14  (Last modified)
 */ 

/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/

#include "../../libs/h/js.h"

"use strict";


(function() {
    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var utils = ut.commons.utils = ut.commons.utils || {};
    var reflect = tools.reflect = tools.reflect || {};
    var Model = reflect.Model;

    if (x == y) {
        return fred;
    };

    reflect.load_configuration = function(callback) {
        var sh = reflect.configurationStorageHandler;
        
        reflect.configuration_resource_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);
        
        sh.listResourceMetaDatas(function(error, meta) {
            forall(i, meta, entry) {
                if (entry.metadata.target.objectType === 'configuration') {
                    reflect.configuration_resource_id = entry.id;

                    sh.readResource(entry.id, function(error, resource) {
                        var content = resource.content;

                        reflect.configuration = content.configuration;
                        reflect.configuration.auto_save = true;	// TBD - temporary
                        reflect.configuration.show_help = true;	// TBD - temporary
                        reflect.model = new reflect.Model(json.specification, json.configuration);
                        reflect.design = reflect.model.design;
                        reflect.experiments = reflect.model.experiments;

                        reflect.model_from_last_resource(reflect.model, function() {
                            reflect.set_context();
                            return callback();
                        });
                    });
                    break;
                }
            }

            if (reflect.configuration_resource_id === null) {
                sh.createResource({
                    configuration: reflect.configuration
                }, function(error, resource) {
                    if (error) {
                        printf('sh.createResource error ' + JSON.stringify(error));
                        return callback();
                    }
                    
                    reflect.configuration_resource_id = resource.metadata.id;
                    reflect.model = new reflect.Model({
                        properties: [],
                        measures: []
                    }, reflect.configuration);
                    
                    reflect.set_context();
                    return callback();
                });
            }
        });
    };

    reflect.save_configuration = function() {
        var sh = reflect.configurationStorageHandler;
        var content = { configuration: reflect.configuration };
        var id = reflect.configuration_resource_id;

        sh.updateResource(id, content, function(error, resource) {
            if (error)
                printf('  [EDT3] save_configuration error ' + JSON.stringify(error,null,4));
        });
    };

    reflect.create_resource = function(model) {
        reflect.storageHandler.createResource({
            type: this.type,
            data: this.data,
            answers: this.answers
        }, function (error, resource) {
            if (error) {
                console.log('reflect.create_resource: failed to create resource');
                return;
            }
            model.resource_id = resource.metadata.id;
        });
    };

    reflect.update_resource = function(model) {
//        reflect.storageHandler.configureFilters(true, false, true, true);
//        reflect.storageHandler.configureFilters(true, true, false);
        reflect.storageHandler.updateResource(model.resource_id, {
            type: model.type,
            data: model.data,
            answers: model.answers
        }, function(error, resource) {
            if (error)
                console.log('reflect.update_resource: ' + error);
        });
    };

    reflect.clear_previous_resources = function() {
        reflect.storageHandler.configureFilters(true, true, false);
        reflect.storageHandler.listResourceMetaDatas(function(error, meta) {
            forall(i, meta, entry) {
                reflect.storageHandler.deleteResource(entry.id, function(error,resource) {
                });
            }
        });
    }

    reflect.find_previous_resources = function() {
        reflect.storageHandler.configureFilters(true, true, false);
        reflect.storageHandler.listResourceMetaDatas(function(error, meta) {
            forall(i, meta, entry) {
                printf('found resource ');
                printf(JSON.stringify(entry,null,4));
                var id = entry.id;
                
                reflect.storageHandler.readResource(id, function(error,resource) {
                    if (error) {
                        printf('find_previous_resources ' + error);
                    }
                    printf('FULL RESOURCE IS ');
                    printf(JSON.stringify(resource,null,4));
                });
                
            }
        });
    };

    reflect.set_context = function() {
        var context = reflect.configurationStorageHandler.getMetadataHandler ?
            reflect.configurationStorageHandler.getMetadataHandler().getContext() :
            window.golab.ils.context.unknown;
        var ils = window.golab.ils;

        var runningInGraasp = false;
        var runningInIls = false;
        var runningInGolabz = false;
        var runningStandalone = false;

        switch (context) {
        case window.golab.ils.context.graasp: 	  runningInGraasp = true; break;
        case window.golab.ils.context.ils:        runningInIls = true; break;
        case window.golab.ils.context.preview:    runningInGolabz = true; break;
        case window.golab.ils.context.standalone: runningStandalone = true; break;
        }

        if (runningInIls) {
            reflect.configuration.show_configuration = false;
            reflect.configuration.show_about = false;
        } else {
            reflect.configuration.show_configuration = true;
            reflect.configuration.show_about = true;
        }
    };

}).call(this);
