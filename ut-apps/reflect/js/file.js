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
 *		23/10/15  (Last modified)
 */

(function() {
    "use strict";

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var utils = ut.commons.utils = ut.commons.utils || {};
    var reflect = tools.reflect = tools.reflect || {};
    var Model = reflect.Model;

    var RESOURCE_NAME;

    function resource_name() {
        if (!RESOURCE_NAME) {
            if (!reflect.configuration)
                throw '[REFLECT] - no configuration found';
            if (reflect.configuration.type === 'time_spent')
                RESOURCE_NAME = 'Reflections time spent';
            else
                RESOURCE_NAME = 'Reflections transition';
            console.log('[REFLECT] RESOURCE_NAME ' + RESOURCE_NAME);
        }

        return RESOURCE_NAME;
    }

    console.log('========== loading tools/reflect/js/file.js');

    reflect.load_configuration = function(callback) {
        var sh = reflect.configurationStorageHandler;
        var mh = reflect.metadataHandler;

        console.log('load_configuration [Enter]');
        console.log('   reflect.configuration.type === ' + reflect.configuration.type);
        reflect.configuration_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);
        sh.readLatestResource('configuration', function(error, resource) {
            try {
                if (error) {
                    console.log('  load_configuration [Error]' + error);
                    throw '  load_configuration.readLatestResource() failed';
                }

                console.log(JSON.stringify(resource,null,4));

                var content = resource.content;

                var tdn = mh.getTargetDisplayName();
                console.log('RESOURCE TARGET LOADED ' + tdn);

                if (content === undefined) {
                    console.log('  resource.content undefined');
                    throw 'resource.content undefined';
                }

                if (content.configuration.model.type !== reflect.configuration.type) {
                    console.log('                             deleting resource');
                    sh.deleteResource(resource.id, function(error, res) {
                        if (error) {
                            console.log('ERROR DELETING RESOURCE ' + resource.id);
                            console.log(JSON.stringify(error,null,4));
                        }
                    });
                    reflect.create_configuration(callback);
                }

                reflect.configuration_id = resource.metadata.id;
                console.log('  [Loaded] ' + reflect.configuration_id);
                reflect.configuration = content.configuration;
                console.log('LOADED CONTENT.CONFIGURATION');
                console.log(JSON.stringify(content.configuration,null,4));
                console.log('LOADED CONTENT.CONFIGURATION');
                reflect.configuration.auto_save = true;
                reflect.configuration.show_help = true;
                if (reflect.ils_context === 'ils') {
                    reflect.configuration.show_configuration = false;
                    reflect.configuration.show_about = false;
                } else {
                    reflect.configuration.show_configuration = true;
                    reflect.configuration.show_about = false;
                }
                console.log('  [Done]');
                return callback();
            } catch(e) {
                reflect.create_configuration(callback);
            }
        });
    };

    reflect.create_configuration = function(callback) {
        var sh = reflect.configurationStorageHandler;

        sh.createResource({
            configuration: reflect.configuration
        }, function(error, resource) {
            if (error) {
                console.log('  [Error create] ' + error);
                return callback();
            }

            reflect.configuration_id = resource.metadata.id;
            console.log('  [Created] ' + reflect.configuration_id);
            return callback();
        });
    };

    reflect.save_configuration = function() {
        console.log('save_configuration [Enter]');
        var sh = reflect.configurationStorageHandler;
        var content = reflect.remove_hashKeys({ configuration: reflect.configuration });
        var id = reflect.configuration_id;

        content.timestamp = new Date().toISOString(),

        sh.updateResource(id, content, function(error, resource) {
            if (error)
                return console.log('save_configuration [Error] ' + error);
            console.log('SAVED CONTENT.CONFIGURATION');
            console.log(JSON.stringify(resource,null,4));
            console.log('SAVED CONTENT.CONFIGURATION');
            console.log('save_configuration [Done]');
        });
    };

    reflect.load_resource = function(callback) {
        var sh = reflect.storageHandler;

        console.log('load_resource [Enter] ');

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, true, true, true);
        sh.listResourceMetaDatas(function(error, meta) {
            if (error) {
                console.log('load_resource [Error] ' + error);
                return callback();
            }

            if (meta.length === 0) {
                console.log('load_resource [None found] ');
                return callback();
            }

            var entry = meta[0];

            reflect.resource_id = entry.id;
            sh.readResource(entry.id, function(error,resource) {
                if (error) {
                    console.log('load_resource [Error] ' + error);
                    return callback();
                }
                console.log('load_resource [Found] ' + entry.id);
                var content = resource.content;
                reflect.model.load_resource(content);
                console.log('load_resource [Done] ' + entry.id);
                return callback();
            });
        });
    };

    reflect.save_resource = function(model) {
        var sh = reflect.storageHandler;
        var mh = reflect.metadataHandler;
        var data = model.resource_json();

        console.log('save_resource [Enter]');

        mh.setTargetDisplayName(resource_name());
        if (reflect.resource_id) {
            console.log('save_resource [Update] ' + reflect.resource_id);
            sh.updateResource(reflect.resource_id, data,
                              function(error, resource) {
                                  if (error)
                                      console.log('save_resource [Error update] ' + error);
                              });
        } else {
            console.log('save_resource [Create]');
            sh.createResource(data,
                              function (error, resource) {
                                  if (error) {
                                      console.log('save_resource [Error create] ' + error);
                                      return;
                                  }
                                  reflect.resource_id = resource.metadata.id;
                                  console.log('save_resource [Done] ' + reflect.resource_id);
                              });
        }
    };

    reflect.set_context = function() {
        if (reflect.ils_context) {
            console.log('set_context [Already set] ' + reflect.ils_context);
            return;
        }
        console.log('set_context [Enter]');
        var ils = window.golab.ils;
        var context = reflect.configurationStorageHandler.getMetadataHandler ?
            reflect.configurationStorageHandler.getMetadataHandler().getContext() :
            ils.context.unknown;

        switch (context) {
        case ils.context.graasp:
            reflect.ils_context = 'graasp';
            break;
        case ils.context.ils:
            reflect.ils_context = 'ils';
            break;
        case ils.context.preview:
            reflect.ils_context = 'preview';
            break;
        case ils.context.standalone:
            reflect.ils_context = 'standalone';
            break;
        }

        console.log('set_context [Done] ' + reflect.ils_context);
    };

}).call(this);
