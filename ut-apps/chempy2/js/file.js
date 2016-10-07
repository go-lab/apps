/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        file.js
 *  Part of	Chemical Equation Entry
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading and saving
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     12/04/15  (Created)
 *		05/11/15  (Last modified)
 */

(function() {
    "use strict";

    console.log('========== loading tools/chempy2/js/file.js');

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var labs = ut.labs = ut.labs || {};
    var utils = ut.commons.utils = ut.commons.utils || {};
    var chempy = tools.chempy = tools.chempy || {};

    var RESOURCE_NAME = 'chempy';

    chempy.set_context = function() {
        var context = chempy.configurationStorageHandler.getMetadataHandler ?
            chempy.configurationStorageHandler.getMetadataHandler().getContext() :
            window.golab.ils.context.unknown;

        var runningInGraasp = false;
        var runningInIls = false;
        var runningInGolabz = false;
        var runningStandalone = false;

        switch (context) {
        case window.golab.ils.context.graasp:
            runningInGraasp = true;
            break;
        case window.golab.ils.context.ils:
            runningInIls = true;
            break;
        case window.golab.ils.context.preview:
            runningInGolabz = true;
            break;
        case window.golab.ils.context.standalone:
            runningStandalone = true;
            break;
        }

        if (runningInIls) {
            chempy.configuration.show_configuration = false;
            chempy.configuration.show_about = false;
        }
    };

    chempy.save_configuration = function() {
        var sh = chempy.configurationStorageHandler;
        var content = { configuration: chempy.configuration
                      };
        var id = chempy.configuration_resource_id;

        sh.updateResource(id, content, function(error,resource) {
            if (error) {
                console.log('chempy.save_configuration error ');
                console.log(JSON.stringify(error,null,4));
            }
        });
    };

    chempy.save_resource = function(model) {
        var storage_handler = chempy.storageHandler;
        var metadata_handler = chempy.metadataHandler;
        var data = model.resource_json();

        if (chempy.resource_id) {
            metadata_handler.setTargetDisplayName(RESOURCE_NAME);
            storage_handler.updateResource(chempy.resource_id, data, function(error, resource) {
                if (error) {
                    console.log('chempy.save_resource error - ' + JSON.stringify(error));
                }
            });
        } else {
            metadata_handler.setTargetDisplayName(RESOURCE_NAME);
            storage_handler.createResource(data, function(error, resource) {
                chempy.resource_id = resource.metadata.id;
                if (error) {
                    console.log('chempy.create_resource error - ' + JSON.stringify(error));
                }
            });
        }
    };
}).call(this);
