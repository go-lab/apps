/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        resource.js
 *  Part of     Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading and saving of resources
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     03/11/14  (Created)
 *		04/12/15  (Last modified)
 */ 

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var edt = tools.edt = tools.edt || {};

    var RESOURCE_NAME = edt.configuration.resource_name;
    var RESOURCE_TYPE = 'experiment_designs';

    var SLIDER = 'slider';
    var NUMERICAL = 'numerical';
    var TEXT = 'text';
    var CATEGORICAL = 'categorical';

    edt.set_context = function() {
        var ils = window.golab.ils;
        var context = edt.configurationStorageHandler.getMetadataHandler ?
            edt.configurationStorageHandler.getMetadataHandler().getContext() :
            window.golab.ils.context.unknown;

        var runningInGraasp = false;
        var runningInIls = false;
        var runningInGolabz = false;
        var runningStandalone = false;

        switch (context) {
        case window.golab.ils.context.graasp: runningInGraasp = true; break;
        case window.golab.ils.context.ils: runningInIls = true; break;
        case window.golab.ils.context.preview: runningInGolabz = true; break;
        case window.golab.ils.context.standalone: runningStandalone = true; break;
        }

        if (runningInIls) {
            edt.configuration.show_configuration = false;
            edt.configuration.show_about = false;
        }

        if (runningInGolabz) {
            edt.model.specification.properties =  [
                {
                    "name": "Mass",
                    "initial": 50,
                    "precision": 0,
                    "unit": "g",
                    "minimum": 25,
                    "maximum": 2000,
                    "increment": null,
                    "scale": null,
                    "values": [],
                    "type": "property",
                    "input": "slider"
                },
                {
                    "name": "Volume",
                    "initial": null,
                    "precision": 0,
                    "unit": "cm^3",
                    "minimum": 0,
                    "maximum": 500,
                    "increment": null,
                    "scale": null,
                    "values": [],
                    "type": "property",
                    "input": "numerical"
                }
            ];
            edt.model.specification.measures = [
                {
                    "name": "Sinks, drifts, floats",
                    "initial": null,
                    "precision": null,
                    "unit": "",
                    "minimum": null,
                    "maximum": null,
                    "increment": null,
                    "scale": null,
                    "values": [
                        "Sinks",
                        "Drifts",
                        "Floats"
                    ],
                    "type": "measure",
                    "input": "categorical"
                }
            ];
            edt.model.executable_from_specification();
        }
    };

    edt.load_configuration = function(callback) {
        var sh = edt.configurationStorageHandler;
        
        edt.configuration_resource_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);

        sh.readLatestResource('configuration', function(error, resource) {
            if (error) {
                printf('          [EDT] readLatestResource failed');
                printf('--------- CB load_configuration');
                return callback();
            }

            if (resource === null) {
                printf('          creating empty configuration');
                sh.createResource({
                    configuration: edt.configuration,
                    specification: {
                        properties: [],
                        measures: []
                    }
                }, function(error, resource) {
                    printf('          CB createResource');
                    if (error) {
                        printf('sh.createResource error ' + JSON.stringify(error));
                        printf('(5) ' + edt.configuration.auto_save);
                        printf('--------- CB load_configuration');
                        return callback();
                    }
                    
                    edt.configuration_resource_id = resource.metadata.id;
                    edt.model = new edt.Model({
                        properties: [],
                        measures: []
                    }, edt.configuration);
                    edt.design = edt.model.design;
                    edt.experiments = edt.model.experiments;
                    edt.set_context();

                    return callback();
                });
            } else {
                var json = resource.content;

                edt.configuration_resource_id = resource.metadata.id;
                if (json === undefined || json.configuration === undefined) {
                    edt.configuration.resource_id = null;
                    return callback();
                }

                edt.configuration = json.configuration;
                edt.configuration.auto_save = true;	// TBD - temporary
                edt.configuration.show_help = true;	// TBD - temporary
                edt.configuration.auto_load = true; // TBD - temporary
                edt.configuration.enable_lab = 0;
                edt.model = new edt.Model(json.specification, json.configuration);
                edt.design = edt.model.design;
                edt.experiments = edt.model.experiments;

                if (edt.configuration.auto_load) {
                    edt.model_from_last_resource(edt.model, function() {
                        edt.set_context();
                        return callback();
                    });
                }
            }
        });
    };

    edt.save_configuration = function() {
        var sh = edt.configurationStorageHandler;
        edt.configuration.initial_design = edt.design.json();
        var content = { configuration: edt.configuration,
                        specification: edt.model.json()
                      };
        var id = edt.configuration_resource_id;

        sh.updateResource(id, content, function(error,resource) {
            if (error)
                printf('  [EDT4] save_configuration error ' + JSON.stringify(error,null,4));
        });
    };

    edt.model_from_last_resource = function(model, callback) {
        var sh = edt.storageHandler;

        sh.listResourceMetaDatas(function(error, meta) {
            edt.resource_id = null;

            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                if (entry.metadata.target.objectType === RESOURCE_TYPE) {
                    if (edt.resource_id) {
                        sh.deleteResource(entry.id, function(error,resource) {
                        });
                    } else {
                        edt.resource_id = entry.id;

                        sh.readResource(edt.resource_id, function(error,resource) {
                            if (error) {
                                printf('readResource ' + edt.resource_id + ' ' + error);
                                return;
                            }

                            var data = resource.content;
                            model.design.load_json(data.design);
                            model.experiments.load_json(data.experiments);
                            model.init();		// Update
                            return callback();
                        });
                    }
                }
            }

            if (edt.resource_id === null) {
                if (edt.configuration.initial_design) {
                    model.design.load_json(edt.configuration.initial_design);
                    model.init();		// Update
                }
                return callback();		// Nothing found
            }
        });
    };

    edt.save_resource = function(model) {
        var sh = edt.storageHandler;
        var mh = edt.metadataHandler;
        var data = model.resource_json();

        if (edt.resource_id) {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.updateResource(edt.resource_id, data, function(error, resource) {
                if (error) {
                    printf('edt.save_resource error - ' + JSON.stringify(error));
                }
            });
        } else {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.createResource(data, function(error, resource) {
                if (error) {
                    printf('edt.create_resource error - ' + JSON.stringify(error));
                }
                edt.resource_id = resource.metadata.id;
            });
        }
    };

    /*------------------------------------------------------------
     *  Data sets
     *------------------------------------------------------------*/

    edt.data_set_from_last_resource = function(callback) {
        var sh = edt.dataSetStorageHandler;
        var resources = sh.listResourceMetaDatas(function(error, meta) {
            edt.data_set_resource = null;

            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                if (entry.metadata.target.objectType === 'dataSet' &&
                    entry.metadata.target.displayName === RESOURCE_NAME) {
                    if (edt.data_set_resource) {
                        sh.deleteResource(edt.data_set_resource, function(error,resource) {
                        });
                    } else {
                        edt.data_set_resource = entry.id;
                    }
                }
            }
            return callback();
        });
    };

    edt.save_data_set = function(design) {
        var sh = edt.dataSetStorageHandler;
        var mh = edt.dataSetMetadataHandler;
        var data = edt.data_set(design);

        if (edt.data_set_resource) {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.updateResource(edt.data_set_resource, data, function(error, resource) {
                if (error) {
                    printf('  [EDT3]: Updated data set ' + edt.data_set_resource);
                    printf('    error ' + error);

                    printf('    resource');
                    printf(JSON.stringify(resource,null,4));
                    return;
                }
            });
        } else {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.createResource(data, function(error, resource) {
                edt.data_set_resource = resource.metadata.id;
                if (error) {
                    printf('  [EDT3]: Created data set ' + edt.data_set_resource);
                    printf('    error ' + error);
                }
            });
        }
    };

    edt.data_set = function(design) {
        var data_cols = [];
        var data_rows = [];
        var c, r;

        for(c=0; c<design.columns.length; c++) {
            var col = design.columns[c];
            var type;

            switch (col.input) {
            case SLIDER:
            case NUMERICAL:
                type = 'number';
                break;
            case CATEGORICAL:
            case TEXT:
                type = 'string';
                break;
            default:
            }
            data_cols.push({
                id: col.variable,
                label: col.variable,
                pattern: '',
                type: type
            });
        }

        for (r=0; r<design.rows.length; r++) {
            var row = design.rows[r];

            var data_cells = [];
            for (c=0; c<row.cells.length; c++) {
                var cell = row.cells[c];
                data_cells.push({
                    v: cell.value,
                    f: cell.value
                });
            }
            data_rows.push({c: data_cells});
        }

        var headers = [];

        for (c=0; c<design.columns.length; c++) {
            var col2 = design.columns[c];

            headers.push({
                "unit": col2.unit});
        }

        return {
            dataSourceColumns: headers,
            dataTable: {
                cols: data_cols,
                rows: data_rows
            }
        };
    };
}).call(this);

