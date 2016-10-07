/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        file.js
 *  Part of     Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Loading and saving
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     03/11/14  (Created)
 *		03/12/15  (Last modified)
 */
(function() {
    "use strict";
    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var utils = ut.commons.utils = ut.commons.utils || {};
    var edt = tools.edt = tools.edt || {};

    var Specification = edt.Specification;

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
            edt.model.specification.properties = [
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
        }
    };

    edt.save_configuration = function() {
        var sh = edt.configurationStorageHandler;
        edt.configuration.initial_design = edt.design.json();
        var content = { configuration: edt.configuration,
                        specification: edt.model.json()
                      };
        var id = edt.configuration_resource_id;

        sh.updateResource(id, content, function(error,resource) {
            console.log('save_configuration ++++++++++++++++++++++++++++++');
            console.log(edt.configuration_resource_id);
            console.log(JSON.stringify(content,null,4));
            console.log('save_configuration ******************************');
            if (error)
                console.log('  [EDT4] save_configuration error ' + JSON.stringify(error,null,4));
        });
    };

    edt.remove_all_resources = function(callback) {
        var sh = edt.storageHandler;
        var resources = sh.listResourceMetaDatas(function(error, meta) {
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
                            console.log('model_from_last_resource ++++++++++++++++++++++++++++++');
                            console.log(edt.configuration_resource_id);
                            console.log(JSON.stringify(resource,null,4));
                            console.log('model_from_last_resource ******************************');
                            if (error) {
                                console.log('readResource ' + edt.resource_id + ' ' + error);
                                return;
                            }

                            var data = resource.content;
                            model.design.load_json(data.design);
                            model.experiments.load_json(data.experiments);
                            model.init(); // Update and fix old version
                            callback();
                        });
                    }
                }
            }
            if (edt.resource_id === null) {
                //  Correct typo in old version
                if (edt.configuration.initial_design.colums &&
                    !edt.configuration.initial_design.columns) {
                    edt.configuration.initial_design.columns =
                        edt.configuration.initial_design.colums;
                }

                if (edt.configuration.initial_design) {
                    model.design.load_json(edt.configuration.initial_design);
                    model.init(); // Update and fix old version
                }
                callback(); // Nothing found
            }
        });
    };

    edt.save_resource = function(model) {
        var sh = edt.storageHandler;
        var mh = edt.metadataHandler;
        var data = model.resource_json();

        console.log('save_resource ++++++++++++++++++++++++++++++++++++++++++');
        console.log(JSON.stringify(data,null,4));
        console.log('save_resource ******************************************');

        if (edt.resource_id) {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.updateResource(edt.resource_id, data, function(error, resource) {
                if (error) {
                    console.log('edt.save_resource error - ' + JSON.stringify(error));
                }
            });
        } else {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.createResource(data, function(error, resource) {
                edt.resource_id = resource.metadata.id;
                if (error) {
                    console.log('edt.create_resource error - ' + JSON.stringify(error));
                }
            });
        }
    };

    /*------------------------------------------------------------
     *  Data sets
     *------------------------------------------------------------*/

    edt.remove_all_data_sets = function() {
        var sh = edt.dataSetStorageHandler;
        var resources = sh.listResourceMetaDatas(function(error, meta) {
            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                if (entry.metadata.target.objectType === 'dataSet' &&
                    entry.metadata.target.displayName === RESOURCE_NAME) {
                    sh.deleteResource(entry.id, function(error,resource) {
                    });
                }
            }
        });
    };

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
            callback();
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
                    console.log('  [EDT3]: Updated data set ' + edt.data_set_resource);
                    console.log('    error ' + error);

                    console.log('    resource');
                    console.log(JSON.stringify(resource,null,4));
                    return;
                }
            });
        } else {
            mh.setTargetDisplayName(RESOURCE_NAME);
            sh.createResource(data, function(error, resource) {
                edt.data_set_resource = resource.metadata.id;
                if (error) {
                    console.log('  [EDT3]: Created data set ' + edt.data_set_resource);
                    console.log('    error ' + error);
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

/*
{
   "id": "40790dc9-0a23-901b-1a0e-e97ce33fd4f8",
   "metadata": {"published": "2013-12-20T09:04:38.919Z",
      "author": {"objectType": "person", "id": "93186d69-bccc-3bcd-b851-5e5dbfa15d50", "displayName": "anonymized"},
      "target": {"objectType": "dataSet", "id": "c0bed402-187f-bc3c-fd90-380b8fde24be", "displayName": "only power"},
      "generator": {"objectType": "application", "url": "http://localhost:8080/golab/labs/ngElectricity/src/main/webapp/circuitSimulatorData.html",
         "id": "c61b9779-2b15-5031-0594-3f701afebdee", "displayName": "ut.tools.electricityLab"},
      "provider": {"objectType": "ils", "url": "http://graasp.epfl.ch/metawidget/1/b387b6f...",
         "id": "00b46529-b3bb-130f-93cc-999ca151c185", "displayName": "name-of-ils"}},
   "content": {
      "dataSourceColumns": [
         {"imageInformation": {"type": "commonImage", "value": "dcVoltageSourceMeter.png"}, "unit": "V"}
      ], "dataTable": {"cols": [
         {"id": "dcVoltageSource", "label": "power", "pattern": "", "type": "number"}
      ], "rows": [
         {"c": [
            {"v": 0, "f": "0.000 V"}
         ]},
         {"c": [
            {"v": 1, "f": "1.000 V"}
         ]},
         {"c": [
            {"v": 2, "f": "2.000 V"}
         ]},
         {"c": [
            {"v": 3, "f": "3.000 V"}
         ]},
         {"c": [
            {"v": 4, "f": "4.000 V"}
         ]},
         {"c": [
            {"v": 5, "f": "5.000 V"}
         ]}
      ], "p": null}}
})
*/
