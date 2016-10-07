/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        file.js
 *  Part of	Go-Lab Reflection Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Dealing with persistency of resources
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     28/11/14  (Created)
 *		18/04/15  (Last modified)
 */ 

(function() {
    "use strict";

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var utils = ut.commons.utils = ut.commons.utils || {};
    var reflect = tools.reflect = tools.reflect || {};
    var Model = reflect.Model;

    var RESOURCE_NAME = 'Reflections time spent';

    printf('************ LOADING file.js');

    reflect.load_configuration = function(callback) {
        var sh = reflect.configurationStorageHandler;
        
        printf('------------ .load_configuration enter');
        reflect.configuration_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);
        
        sh.readLatestResource('configuration', function(error, resource) {
            try {
                if (error) {
                    printf('[Reflect] readLatestResource failed');
                    throw 'readLatestResource failed';
                }

                var content = resource.content;

                if (content === undefined) {
                    printf('[Reflect] resource.content undefined');
                    throw 'resource.content undefined';
                }
                printf('------------ .load_configuration  loaded');
                reflect.configuration = content.configuration;
                reflect.configuration.auto_save = true;
                reflect.configuration.show_help = true;
                reflect.configuration_id = resource.metadata.id;
                reflect.set_context();
                printf('------------ .load_configuration  callback');
                return callback();
            } catch(e) {
                sh.createResource({
                    configuration: reflect.configuration
                }, function(error, resource) {
                    if (error) {
                        printf('sh.createResource error ' + JSON.stringify(error));
                        return callback();
                    }
                    
                    printf('------------ .load_configuration  created');
                    printf('CONFIGURATION');
                    printf(JSON.stringify(reflect.configuration,null,4));
                    reflect.configuration_id = resource.metadata.id;
                    reflect.set_context();
                    printf('------------ .load_configuration  callback');
                    return callback();
                });
            }
        });
    };

    reflect.save_configuration = function() {
        var sh = reflect.configurationStorageHandler;
        var content = reflect.remove_hashKeys({ configuration: reflect.configuration });
        var id = reflect.configuration_id;

        printf('------------ .save_configuration enter');

        sh.updateResource(id, content, function(error, resource) {
            if (error)
                return printf('  save_configuration error ' + JSON.stringify(error,null,4));
            printf('------------ .save_configuration done');
            printf('CONFIGURATION');
            printf(JSON.stringify(content,null,4));
        });
    };

    reflect.load_resource = function(callback) {
        var sh = reflect.storageHandler;

        printf('------------ .load_resource enter ');

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, true, true, true);
        sh.listResourceMetaDatas(function(error, meta) {
            if (error) {
                printf('reflect.load_resource ' + error);
                return callback();
            }

            if (meta.length === 0) {
                printf('------------ .load_resource none found ');
                return callback();
            }

            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                reflect.resource_id = entry.id;
                sh.readResource(entry.id, function(error,resource) {
                    if (error) {
                        printf('reflect.load_resource ' + error);
                        return callback();
                    }
                    printf('------------ .load_resource found ' + i);
                    var content = resource.content;
                    reflect.model.load_resource(content);
                    printf('------------ .load_resource callback ' + i);
                    return callback();
                });
                break;
            }
        });
    };

    reflect.save_resource = function(model) {
        var sh = reflect.storageHandler;
        var mh = reflect.metadataHandler;
        var data = model.resource_json();

        printf('------------ .save_resource enter');

        mh.setTargetDisplayName(RESOURCE_NAME);
        if (reflect.resource_id) {
            printf('------------ .save_resource update');
            sh.updateResource(reflect.resource_id, data,
                              function(error, resource) {
                                  if (error)
                                      printf('reflect.update_resource: ' + error);
                              });
        } else {
            printf('------------ .save_resource create');
            sh.createResource(data,
                              function (error, resource) {
                                  if (error) {
                                      printf('reflect.create_resource: failed ' + error);
                                      return;
                                  }
                                  reflect.resource_id = resource.metadata.id;
                              });
        }
    };

    reflect.clear_previous_resources = function() {
        reflect.storageHandler.configureFilters(true, true, false);
        reflect.storageHandler.listResourceMetaDatas(function(error, meta) {
            var func = function(error,resource) {};

            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                reflect.storageHandler.deleteResource(entry.id, func);
            }
        });
    };

    reflect.set_context = function() {
        var ils = window.golab.ils;
        var context = reflect.configurationStorageHandler.getMetadataHandler ?
            reflect.configurationStorageHandler.getMetadataHandler().getContext() :
            ils.context.unknown;

        var runningInGraasp = false;
        var runningInIls = false;
        var runningInGolabz = false;
        var runningStandalone = false;

        switch (context) {
        case ils.context.graasp:     runningInGraasp = true; break;
        case ils.context.ils:        runningInIls = true; break;
        case ils.context.preview:    runningInGolabz = true; break;
        case ils.context.standalone: runningStandalone = true; break;
        }

        reflect.configuration.show_configuration = !runningInIls;
        reflect.configuration.show_about = !runningInIls;
    };

}).call(this);
