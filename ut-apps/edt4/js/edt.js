/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        edt.js
 *  Part of     Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Initialization and angular interface
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2013, 2014, 2015  University of Twente
 *  
 *  History     21/03/13  (Created)
 *		14/04/16  (Last modified)
 */

/** Terminology:

    Independent variable: vary
    Control variable: keep constant
    Dependent variable: measure
 */
(function() {
    "use strict";

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var edt = tools.edt = tools.edt || {};

    var Quantity = ut.libs.quantity;
    var language = null; // Normally set using edt.languageHandler

    edt.messages = []; // See messages.js
    edt.model = null;
    edt.design = null;
    edt.experiments = null;
    edt.scope = null;

    /*------------------------------------------------------------
     *  Constants (initialization in model.src)
     *------------------------------------------------------------*/

    var INDEPENDENT = edt.constants.INDEPENDENT;
    var CONTROL = edt.constants.CONTROL;
    var DEPENDENT = edt.constants.DEPENDENT;

    var PROPERTY = edt.constants.PROPERTY;
    var MEASURE = edt.constants.MEASURE;
    var VARIABLE = edt.constants.VARIABLE;

    var SLIDER = 'slider';
    var NUMERICAL = 'numerical';
    var TEXT = 'text';
    var CATEGORICAL = 'categorical';

    /*------------------------------------------------------------
     *  Configure EDT
     *------------------------------------------------------------*/

    edt.configuration = {
        version: '4.1-' + "Apr 15 2016",
        required_experiments: 1,// Number of experiments before entering measures
        max_experiments: 6, // Maximum number of experiments
        auto_load: true, // Auto loads the previous experiment design resource
        auto_save: true, // Auto saves the current experiment design resource
        show_help: true, // Activate the help button
        show_instructions: true,// Show instructions at the top on what to do
        experiments_sortable: true,// Can experiments be sorted?

        show_configuration: true,// Set by edt.set_context() in file.src
        show_about: true, // Info page about the tool (in configuration only)

        enable_lab: 0,

        initial_design: { // Initial design defined by the teacher
            rows: [],
            columns: []
        },

        resource_name: 'Experiment Designs',
        help_text: '',

        //  Constraints for the number of variables per role.  Possible combinations are:
        //
        //  { minimum: X }		At least X
        //  { minimum: X, maximum: Y }	At least X, at most Y
        //  { use_all: true }		Use all available in the specification
        //
        //  The default, given below, requires at least one independent,
        //  control and measure and that all variables (independent + control)
        //  are used.

        independent: { // Minimum and maximum for independent variables
            minimum: 1
        },
        control: {
            minimum: 1
        },
        measure: {
            minimum: 1
        },
        variable: {
            use_all: true
        }
    };

    //  Before angular
    edt.configure = function(conf, callback) {
        for (var p in conf) {
            if (edt.configuration.hasOwnProperty(p))
                edt.configuration[p] = conf[p];
        }

        edt.load_configuration(callback);
    };

    edt.start = function() {
        setTimeout(function() {
            ut.commons.utils.gadgetResize();
        }, 250);
        edt.scope.help_text = edt.configuration.help_text = translate('help_text');
        edt.log("start", {
            objectType: "tool",
            content: {
                specification: edt.model.json(),
                configuration: edt.configuration
            }
        }, false);
        edt.scope_apply();
    };

    edt.scope_apply = function() {
        var scope = edt.scope;

        if (!scope.$$phase)
            scope.$apply();
    };

    edt.uuid = function() {
        return ut.commons.utils.generateUUID();
    };

    edt.instruction = function(what) {
        var prefix = 'instruction_';

        edt.scope.instruction = edt.translate(prefix + what);
    };

    edt.modified_design = function() {
        var design = edt.design;

        design.check_specified();
        var runnable = design.count_runnable_rows(); // Checks for enable_lab

        if (design.specified) {
            var r, row;

            if (design.rows.length === 0) {
                return edt.instruction('add_trial');
            }

            for (r=0; r<design.rows.length; r++) {
                row = design.rows[r];
                if (row.runnable === false)
                    return edt.instruction('enter_values');
            }

            for (r=0; r<design.rows.length; r++) {
                row = design.rows[r];
                if (row.runnable && !row.completed) {
                    console.log('row ' + r);
                    return edt.instruction('enter_results');
                }
            }

            if (runnable >= edt.configuration.required_experiments)
                return edt.instruction('finished');

            return edt.instruction('add_trial');
        }

        return edt.instruction('drag_variables');
    };

    /*  Set up angular */
    var ng_edt = angular.module("edt", [
        'ngSanitize',
        'LocalStorageModule',
        'golabUtils',
        'textAngular']).config(
            function($sceDelegateProvider) {
                var url = edt.base_url + '/**';
                var url2 = 'http://go-lab.collide.info' + '/**';
                var url3 = 'http://golab.collide.info' + '/**';

                $sceDelegateProvider.resourceUrlWhitelist(
                    [ url, url2, url3
                    ]);
            });

    ng_edt.controller("controller_edt", function($scope) {
        edt.scope = $scope;

        $scope.input_value = '';

        $scope.dialog = {};
        $scope.dialog.selected_value = undefined;
        $scope.feedback = {};
        $scope.feedback.specification = {};

        $scope.this_scope = 'EDT scope';
        $scope.base_url = edt.base_url;

        $scope.configuration = edt.configuration;
        $scope.model = edt.model;
        $scope.design = edt.model.design;
        $scope.experiments = edt.model.experiments;

        $scope.instruction = '';
        $scope.configuring = 'domain';

        $scope.set_configuring = function(what) {
            var status = edt.model.specification_complete();

            if (status === true) {
                $scope.configuring = what;
                edt.save_configuration();
                return;
            }
            $scope.specify_variable = edt.model.specification_variable(status.name);
            $scope.blur_specify_variable(true);
        };

        $scope.help_text = edt.configuration.help_text;

        edt.modified_design(); // Force a specific instruction when required

        //  For adding degree, centigrade and micro symbols.
        $scope.append_unit_special_char = function(str) {
            $scope.specify_variable.unit += str;
            $("#edt_conf_unit_input").focus();
        };

        //  For dialog input values
        $scope.input = {
        };

        $scope.selected_property_value = function(value) {
            $scope.dialog.cell.value = value;
            $scope.dialog.selected_value = value;
        };

        $scope.reset = function() {
            $scope.columns = edt.design.columns;
            $scope.rows = edt.design.rows;
        };

        $scope.reset();

        $scope.hide_available_variables = function() {
            edt.log("access", {
                objectType: "layout",
                userAction: "hide_available_variables",
                content: {}
            }, false);
            edt.model.mode = 'design';
        };

        $scope.show_available_variables = function() {
            edt.log("access", {
                objectType: "layout",
                userAction: "show_available_variables",
                content: {}
            }, false);
            edt.model.mode = 'plan';
        };

        $scope.run_experiment = function(row) {
            edt.run_experiment(row);
        };

        $scope.show_help = function() {
            $("#edt_dialog_help").dialog({
                title: 'Help ...',
                width: 700,
                maxHeight: 500,
                draggable: true,
                resizable: true
            });
        };

        $scope.show_about = function() {
            $("#edt_dialog_about").dialog({
                title: 'About this tool ...',
                width: 600
            });
        };

        $scope.new_design = function() {
            var log_content = {
                objectType: 'design',
                userAction: "clear_design",
                content: {
                    design: edt.design.json()
                }
            };

            if (edt.design.can_clear_design()) {
                edt.design.clear_design();
                edt.log("change", log_content, true);
                edt.modified_design();
                edt.scope_apply();
                return;
            }

            var dialog_id = '#edt_dialog_warning';
            var warning = translate('warning');

            edt.dialog_buttons(dialog_id,
                               warning,
                               translate('really_clear_design'),
                               { ok: translate('continue'),
                                 cancel: translate('cancel')
                               },
                               function() {
                                   edt.design.clear_design();
                                   edt.log("change", log_content, true);
                                   edt.scope_apply();
                               });
        };

        $scope.blur_specify_variable = function(required) {
            var v = $scope.specify_variable;

            for (var p in $scope.feedback.specification)
                $scope.feedback.specification[p] = '';

            var unit = v.unit;

            if (unit.match(/[0-9]/)) { // Contains digit
                if (!unit.match(/\^/))

                    $scope.feedback.specification.unit = 'Use caret for an exponent, e.g. m/s^2';
            }

            var errors = edt.model.check_variable(v, required);

            for (var i=0; i<errors.length; i++) {
                var error = errors[i];
                $scope.feedback.specification[error.property] = error.error;
            }

            if (errors.length > 0)
                $scope.feedback.footer = 'Your specification is not complete.';
            else
                $scope.feedback.footer = 'Your specification is complete.';
        };

        $scope.edit_specification_variable = function(variable) {
            $scope.specify_variable = edt.model.specification_variable(variable.name);
            $scope.blur_specify_variable(); // Force update
        };

        $scope.add_specification_variable = function(type) {
            var variable = edt.model.create_specification_variable(type);

            $scope.edit_specification_variable(variable);
        };

        $scope.delete_specification_variable = function(variable) {
            if ($scope.specify_variable.name === variable.name)
                $scope.specify_variable = null;
            edt.model.delete_specification_variable(variable.name);
        };

        $scope.up_specification_variable = function(variable) {
            edt.model.move_up_specification_variable(variable.name);
        };

        $scope.down_specification_variable = function(variable) {
            edt.model.move_down_specification_variable(variable.name);
        };

        $scope.close_configuration = function() {
            var id = "#edt_configuration";
            var status = edt.model.specification_complete();

            if (status === true) {
                $(id).dialog('close');
                edt.save_configuration();
                return;
            }

            $scope.specify_variable = edt.model.specification_variable(status.name);
            $scope.blur_specify_variable(true);
            edt.scope_apply();
        };

        $scope.close_dialog = function(id) {
            $('#'+id).dialog('close');
        };

        $scope.edit_configuration = function() {
            edt.scope.specify_variable = null;
            if (edt.model.specification.properties.length > 0)
                edt.scope.specify_variable = edt.model.specification.properties[0];
            else
                if (edt.model.specification.measures.length > 0)
                    edt.scope.specify_variable = edt.model.specification.measures[0];

            var id = "#edt_configuration";
            var title = 'Specify domain, configuration and help';

            $(id).dialog({ title: title,
                           modal: true,
                           resizable: true,
                           width: 800,
                           minHeight: 1500,
                           draggable: true,
                           create: function() {
                               setTimeout(function() {
                                   ut.commons.utils.gadgetResize();
                               }, 250);
                           }
                         });
        };

        $scope.view_experiments = function(cell) {
            if (edt.model.experiments.rows.length === 0)
                return;

            edt.model.synchronise();
            edt.model.check_columns_in_use();

            edt.log("change", {
                objectType: "experiments",
                userAction: "view_experiments",
                content: {
                    experiments: edt.experiments.json()
                }
            }, false);

            var id = "#edt_experiments_table";
            var title = edt.translate('title_experiments_dialog');

            $(id).dialog({ title: title,
                           resizable: true,
                           width: 800,
                           maxHeight: 600,
                           draggable: true,
                           create: function() {
                               setTimeout(function() {
                                   ut.commons.utils.gadgetResize();
                               }, 250);
                           }
                         });
        };

        $scope.sort_experiments = function(cell) {
            var order = cell.sort_order;

            edt.model.sort_experiments(cell);

            edt.log("change", {
                objectType: "experiments",
                userAction: "sort_experiments",
                content: {
                    variable: cell.variable,
                    order: order,
                    view_experiments: edt.experiments.json()
                }
            }, false);
        };

        $scope.sort_experiments_by_nth = function(cell) {
            edt.model.sort_experiments_by_nth();

            edt.log("change", {
                objectType: "experiments",
                userAction: "sort_experiments_by_nth",
                content: {
                    order: edt.experiments.sort_order,
                    experiments: edt.experiments.json()
                }
            }, false);
        };

        $scope.specify_property_value = function(v, row) {
            var spec = edt.model.specification_variable(v.variable);

            specify_value(v, spec, row.nth);//  Logging inside dialog
        };

        $scope.add_row = function() {
            edt.design.add_row(false);
            edt.modified_design();
            edt.log("add", {
                objectType: "experiments",
                userAction: "add_row",
                content: {
                    design: edt.design.json()
                }
            }, true);
            ut.commons.utils.gadgetResize();
        };

        $scope.delete_row = function(row) {
            edt.design.delete_row(row.nth);
            edt.modified_design();
            edt.log("remove", {
                objectType: "experiments",
                userAction: "delete_row",
                content: {
                    row: row.nth,
                    design: edt.design.json()
                }
            }, true);
            ut.commons.utils.gadgetResize();
        };

        $scope.delete_result = function(row) {
            edt.model.delete_experiment(row.nth);
            edt.log("remove", {
                objectType: "experiments",
                userAction: "delete_result",
                content: {
                    row: row.nth,
                    experiments: edt.experiments.json()
                }
            }, true);
        };

        $scope.keypress_variable_value = function(event, cell, row) {
            if (event.keyCode === 13 || event.keyCode === 9)
                $scope.blur_variable_value(cell, row);
        };

        $scope.blur_variable_value = function(cell, row) {
            var status = edt.model.check_range_cell(cell);

            if (status !== true) {
                var mv = edt.model.specification_variable(cell.variable);
                var warning = edt.translate('warning');
                var dialog_id = '#edt_dialog_range_error';

                dialog(dialog_id, warning,
                       'Value should be between ' + mv.minimum +
                       ' and ' + mv.maximum);
                cell.value = null;
                return;
            }

            edt.design.update_value(cell, row.nth);
            edt.modified_design();
            edt.log("change", {
                objectType: "design",
                userAction: "entered_variable_value",
                content: {
                    variable: cell.variable,
                    row: row.nth,
                    design: edt.design.json()
                }
            });
        };

        $scope.acceptObjectDrop = function(info, dropject, target) {
            return true;
        };

        $scope.objectDroppedOutside = function(info, dropject, target) {
            var variable = info.dropObjectId;

            if (edt.design.find_column(variable)) {
                edt.design.unassign_variable(variable);
                edt.modified_design();
                edt.log("change", {
                    objectType: "design",
                    userAction: "delete_variable",
                    content: {
                        variable: variable,
                        design: edt.design.json()
                    }
                });
            }
        };

        $scope.objectDroppedInside = function(info, dropject, target) {
            var role = $(target).attr('targetType');// independent, control, dependent
            var drop_type = info.dropObjectType; // variable or measure
            var variable = info.dropObjectId; // e.g., mass
            var dialog_id = '#edt_dialog_warning';
            var warning = translate('warning');

            if (role === CONTROL) {
                if (edt.design.variable_role(variable) === INDEPENDENT) {
                    var consistent = edt.design.consistent_values(variable);

                    if (consistent !== false) {
                        edt.design.assign_column_value(variable, consistent);
                    }

                    if (consistent === false) {
                        var result = {};
                        edt.dialog_buttons(dialog_id,
                                           warning,
                                           translate('drop_independent_to_control',
                                                     { label: variable }),
                                           { ok: translate('continue'),
                                             cancel: translate('cancel')
                                           },
                                           function() {
                                               edt.design.assign_variable(variable, role, true);
                                               edt.modified_design();
                                               edt.log("change", {
                                                   objectType: VARIABLE,
                                                   userAction: "drop_variable",
                                                   content: {
                                                       variable: variable,
                                                       role: role,
                                                       design: edt.design.json()
                                                   }
                                               }, true);
                                               edt.scope_apply();
                                           });
                        return true;
                    }
                }
            }

            if (role === INDEPENDENT || role === CONTROL) {
                if (drop_type === VARIABLE) {
                    edt.design.assign_variable(variable, role, false);
                    edt.modified_design();
                    edt.log("change", {
                        objectType: VARIABLE,
                        userAction: "drop_variable",
                        content: {
                            variable: variable,
                            role: role,
                            design: edt.design.json()
                        }
                    }, true);
                    return true;
                }
                if (role === INDEPENDENT && drop_type === MEASURE) {
                    dialog(dialog_id, warning,
                           translate('drop_expecting_independent_variable_here',
                                     { label: variable
                                     }));
                }
                if (role === CONTROL && drop_type === MEASURE) {
                    dialog(dialog_id, warning,
                           translate('drop_expecting_control_variable_here',
                                     { label: variable
                                     }));
                }
                return false;
            }

            if (role === DEPENDENT && drop_type === MEASURE) {
                edt.design.assign_variable(variable, role, false);
                edt.modified_design();
                edt.log("change", {
                    objectType: VARIABLE,
                    userAction: "drop_variable",
                    content: {
                        variable: variable,
                        role: role,
                        design: edt.design.json()
                    }
                }, true);
                return true;
            }

            if (role === DEPENDENT && drop_type === VARIABLE) {
                dialog(dialog_id, warning,
                       translate('drop_expecting_dependent_variable_here',
                                 { label: variable
                                 }));
            }
            return false;
        };
    });

    ng_edt.factory('languageHandler', function() {
        return edt.languageHandler;
    });

    ng_edt.factory('environmentHandlers', function() {
        return edt.ehs;
    });

    ng_edt.filter('formatVariableValue', function() {
        return function (v) {
            // Mostly hidden things, e.g., slider input value
            if (v === undefined)
                return '';
            if (v.role === DEPENDENT) // TBD - not handle specially
                return v.value;
            return edt.model.html_variable_value(v);
        };});

    ng_edt.filter('formatVariableUnit', function() {
        return function (v) {
            // Mostly hidden things, e.g., slider input value
            if (v === undefined)
                return '';
            return edt.model.html_variable_unit(v);
        };});

    ng_edt.filter('exampleVariableValue', function() {
        return function (v) {
            // Mostly hidden things, e.g., slider input value
            if (v === undefined || v === null)
                return '';
            if (v.input === TEXT)
                return 'Text';
            if (v.input === CATEGORICAL) {
                if (v.values.length > 0)
                    return v.values[0];
                return '?';
            }
            return edt.model.html_variable_value(v);
        };});

    ng_edt.filter('rowIndex', function() {
        return function (row) {
            return row.nth;
        };});

    ng_edt.filter('nth', function() {
        return function (n) {
            return n;
        };});

    ng_edt.filter('boolean', function() {
        return function (v) {
            if (v === true) return 'TRUE';
            if (v === false) return 'FALSE';
            if (v === undefined) return 'UNDEFINED';
            return 'NON-BOOLEAN';
        };});

    ng_edt.filter('translate', function() {
        return function (msg) {
            var rval = translate(msg);
            return rval;
        };});

    ng_edt.directive('experimentDesign', function() {
        return {
            restrict: 'E',
            templateUrl: edt.base_url + '/design.html'
        };
    });

    ng_edt.directive('stringEditor', function() {
        return {
            restrict: "E",
            template: "<div><div class=\"edt_stringEditor\">\n    <input ng-model=\"name\" ng-focus='focused()' ng-blur='blurred()'>\n  </div></div>",
            replace: true,
            link: function(scope, element, attrs) {
                var index;
                index = ut.commons.utils.getAttributeValue(attrs, "index", 0);
                scope.name = scope.array[index];

                scope.$watch('array', function() {
                    scope.name = scope.array[index];
                }, true);
                scope.focused = function() {};
                return scope.blurred = function() {
                    index = ut.commons.utils.getAttributeValue(attrs, "index", 0);
                    if (scope.array[index] !== scope.name) {
                        scope.array[index] = scope.name;
                    }
                };
            }
        };
    });

    ng_edt.directive('stringListEditor', function($timeout) {
        return {
            restrict: "E",
            template: '<div>' +
                '<div class="row configurationOptionTitle\">' +
                '  <span class="nameListEditorTitle">{{title}}</span>' +
                '  <span class="nameListControls">' +
                '    <i class="fa fa-plus fa-fw activeButton fontAweSomeButtonSmall"' +
                '              ng-click="addName()"></i>' +
                '    <i class="fa fa-minus fa-fw activeButton fontAweSomeButtonSmall"' +
                '       ng-class="{disabledButton: selection.index<0}"' +
                '       ng-click="removeName()"></i>' +
                '    <i class="fa fa-arrow-up fa-fw activeButton fontAweSomeButtonSmall"' +
                '       ng-class="{disabledButton: !selection.canMoveUp}"' +
                '       ng-click="moveSelectionUp()"></i>' +
                '    <i class="fa fa-arrow-down fa-fw activeButton fontAweSomeButtonSmall"' +
                '       ng-class="{disabledButton: !selection.canMoveDown}"' +
                '       ng-click="moveSelectionDown()"></i>' +
                '  </span>' +
                '</div>' +
                '<div ng-repeat="str in array track by $index"' +
                '     class="row">' +
                '  <string_editor index="{{$index}}"' +
                '              ng-class="{edt_selectedStringEditor: $index==selection.index, edt_unselectedStringEditor: $index!=selection.index}"' +
                '              ng-click="changeSelection($index)"></string_editor>' +
                '</div>' +
                '</div>',
            replace: true,
            scope: {
                array: "=array"
            },
            link: function(scope, element, attrs) {
                scope.title = attrs.label || 'Values';
                scope.selection = {
                    index: -1,
                    canMoveUp: false,
                    canMoveDown: false
                };
                scope.addName = function() {
                    scope.array.push("");
                    $timeout(function() {
                        var newNameEditor = element.find(".nameEditor:last");
                        return newNameEditor.find("input:first").focus();
                    });
                };
                scope.removeName = function() {
                    if (scope.selection.index >= 0) {
                        scope.array.splice(scope.selection.index, 1);
                        return scope.selection.index = -1;
                    }
                };
                scope.changeSelection = function(index) {
                    if (scope.selection.index < 0 || scope.selection.index !== index) {
                        scope.selection.index = index;
                        scope.selection.canMoveUp = index > 0;
                        scope.selection.canMoveDown = index < scope.array.length - 1;
                    } else {
                        scope.selection.index = -1;
                        scope.selection.canMoveUp = false;
                        scope.selection.canMoveDown = false;
                    }
                };
                scope.moveSelectionUp = function() {
                    var index, selectionName;
                    index = scope.selection.index;
                    if (index > 0) {
                        selectionName = scope.array[index];
                        scope.array[index] = scope.array[index - 1];
                        scope.array[index - 1] = selectionName;
                        scope.changeSelection(index - 1);
                    }
                };
                scope.moveSelectionDown = function() {
                    var index, selectionName;
                    index = scope.selection.index;
                    if (index < scope.array.length - 1) {
                        selectionName = scope.array[index];
                        scope.array[index] = scope.array[index + 1];
                        scope.array[index + 1] = selectionName;
                        scope.changeSelection(index + 1);
                    }
                };
            }
        };
    });

    edt.dialog = function(id, title, html) {
        $(id).html(html);
        $(id).dialog({ title: title,
                       width: 500,
                       draggable: false,
                       buttons: {
                           "OK": function() {
                               $(this).dialog('close');
                           }
                       }
                     });
    };

    edt.dialog_buttons = function(id, title, html, buttons, confirm) {
        buttons = buttons || {};
        var ok = (buttons.ok === undefined ? 'OK' : buttons.ok);
        var cancel = (buttons.cancel === undefined ? 'Cancel' : buttons.cancel);
        var bs = {};

        bs[ok] = function() {
            $(this).dialog('close');
            confirm();
        };

        bs[cancel] = function() {
            $(this).dialog('close');
        };

        $(id).html(html);
        $(id).dialog({ title: title,
                       width: 500,
                       draggable: false,
                       buttons: bs
                     });
    };

    function dialog(id, title, html) {
        edt.dialog(id, title, html);
    }

    edt.translate = function(msg, atts, lang0) {
        return translate(msg, atts, lang0);
    };

    function translate(msg, atts, lang0) {
        if (!language) {
            if (typeof(edt.languageHandler.getLanguage) === 'function') {
                language = edt.languageHandler.getLanguage();
                if (language === 'ALL')
                    language = 'en';
            }
        }

        if (!language) {
            language = edt.languageHandler.getMessage('language');
        }

        var lang = lang0 || language;
        var struct = edt.messages[msg];

        if (struct && !struct[lang] && struct.all)
            return struct.all;

 // Use language file
        if (!(lang && struct && struct[lang])) {
            return edt.languageHandler.getMessage(msg);
        }

        struct = struct[lang];

 // Use edt.messages
        if (atts) {
            if (typeof(struct) === 'function')
                return struct.call(atts);
            console.log('*** Warning: message for "' + msg + '" not a function ');
            return msg;
        } else {
            if (typeof(struct) === 'function') {
                return struct.call();
            }
        }

        return struct;
    }

    edt.run_experiment = function(row) {
        if (row.selected) {
            edt.design.modified();
            edt.design.deselect_row(row);
            edt.modified_design();
            edt.scope_apply();
            return;
        }

        edt.design.modified();
        edt.design.select_row(row);
        edt.modified_design();

        edt.log("change", {
            objectType: "design",
            userAction: "select_lab",
            content: {
                row: row.nth,
                design: edt.design.json()
            }
        }, true);
    };

    /**
     *  Log the action given by verb and content.  If save is true or
     *  undefined, and auto_save is active then the current model is also
     *  saved.
     */
    edt.log = function(verb, content, save) {
        save = (save === undefined ? true : save);

        //  Student mode
        edt.actionLogger.log(verb, content);
        if (save && edt.configuration.auto_save) {
            edt.save_resource(edt.model);

              setTimeout(function() {
              edt.save_data_set(edt.design);
              }, 1000);
        }

        //  If we are in configuration mode, then save the configuration
        if (edt.configuration.show_configuration === true)
            edt.save_configuration();
    };

    function characterIndex(n) {
        var chars = ['A', 'B', 'C', 'D', 'E', 'F'];

        if (n >= 0 && n < chars.length)
            return chars[n];
        return n;
    }

    /** Specify a value for a variable.
     *
     *  Creates a dialog in which the user can enter a value based on the
     *  specification of the variable in the experiment description.
     *
     *  Returns false when the value has not been set, true otherwise.
     */
    function specify_value(cell, spec, row) {
        var repaint = false;
        var id;

        if (spec.input === 'slider') {
            id = '#edt_dialog_slider_value';
            var unit = (is_given(spec.unit) ? (' ' + spec.unit) : '');
            var old_value = cell.value;
            var value = (old_value === null ? (is_given(spec.initial) ? spec.initial : spec.minimum) : old_value);
            //            var scale = is_given(spec.scale) ? spec.scale : 1;
            var scale = 1; // TBD - do we still need this?
            var minimum = spec.minimum;
            var maximum = spec.maximum;
            var increment = is_given(spec.increment) ? spec.increment : 0;
            var precision = is_given(spec.precision) ? spec.precision : null;
            var id_slider = 'edt_slider_specify_value';

            //  Use cell directly
            edt.scope.input.unit = unit;
            edt.scope.input.variable = cell.variable;
            edt.scope.input.value = value;
            edt.scope.input.minimum = spec.minimum;
            edt.scope.input.maximum = spec.maximum;

            var template = {
                value: value * scale,
                min: minimum * scale,
                max: maximum * scale,
                //                  step: increment * scale,
                slide: function(event, ui) {
                    cell.value = ui.value / scale;
                    if (precision !== null)
                        edt.scope.input.value = cell.value.toFixed(precision);
                    else
                        edt.scope.input.value = cell.value;
                    edt.scope_apply();
                }
            };

            if (increment)
                template.step = increment * scale;

            $("#" + id_slider).slider(template);

            cell.value = value;
            show_dialog(id, { cancel_value: old_value }, cell, spec, row);

            edt.scope_apply();
        }

        if (spec.input === 'categorical') {
            id = "#edt_dialog_values";
            var scope = edt.scope;

            cell.value = null;

            scope.dialog.selected_value = null;
            scope.dialog.cell = cell; // Was dialog.var_spec
            scope.dialog.values = [];

            for (var i=0; i<spec.values.length; i++) {
                var name = spec.values[i];
                var label;

                if (typeof(name) === 'string')
                    label = spec.values[i];
                else
                    label = spec.values[i];
                scope.dialog.values.push({name: name, label: label});
            }

            $(id).selectable();

            show_dialog(id, {}, cell, spec, row);
        }

        function show_dialog(id, options, cell, spec, row) {
            var buttons = {};

            buttons.OK = function() {
                $(this).dialog("close");

                if (cell.value === null) {
                    if (options.cancel_value)
                        cell.value = options.cancel_value;
                    return;
                }
                edt.design.update_value(cell, row);
                edt.modified_design();
                edt.log("change", {
                    objectType: "variable",
                    userAction: "ok_variable_value",
                    content: {
                        variable: cell.variable,
                        value: cell.value,
                        design: edt.design.json()
                    }
                }, true);
                edt.scope_apply();
            };

            if (options.cancel_option !== false)
                buttons.Cancel = function() {
                    $(this).dialog("close");
                    if (options.hasOwnProperty('cancel_value')) {
                        cell.value = options.cancel_value;
                        edt.design.update_value(cell, row);
                    }
                    edt.log("cancel", {
                        objectType: "variable",
                        content: {
                            variable: cell.variable,
                            design: edt.design.json()
                        }
                    }, true);
                    edt.scope_apply();
                };

            $(id).dialog(
                { title: translate('specify_value') + ': ' + cell.variable,
                  width: 500,
                  dialogClass: 'no-close',
                  draggable: false,
                  modal: true,
                  buttons: buttons
                });
        }
    }

    function is_given(obj) {
        return !is_not_given(obj);
    }

    function is_not_given(obj) {
        return obj === null || obj === undefined || obj === '';
    }
}).call(this);
