/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        model.js
 *  Part of     Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Representation of the underlying model
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     21/03/13  (Created)
 *		03/12/15  (Last modified)
 */

/** Terminology:

    Independent variable: vary
    Control variable: keep constant
    Dependent variable: measure
    System variable: system

    design:
    { specified: enough I, C, D
      enable_lab: minimum number of rows that should be specified
      runnable: number of runnable rows > enable_lab
    }


    column: 
    { variable: 'mass',
      role: 'independent',
      value: 100,
      unit: 'g',
      image: 'mass.png',
      sort_order: 'ascending' | 'descending',
      formula: [<'string'>]

      in_use:			// true: there is something with a value (experiments)
    };

    cell: 
    { variable: 'mass',
      role: 'independent',
      value: 100,
      unit: 'g',
      image: 'mass.png'
    };

    row:
    { nth: index		// 1, ...
      uuid: uuid,
//      nth_experiment:		// Deprecated, see Model.fix_rows();
      experiment: index,	// 1 or null

      runnable: boolean		// true: if specified and values of I, C given
      completed: boolean	// true: if all measures, properties filled
      editable: boolean		// true: user can edit values
      selected: boolean		// true: shown in lab

      in_use:			// true: there is something with a value (experiments)

      cells: [ cell1, cell2, ... ]
    }
*/

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = utils.is;
    var edt = tools.edt = tools.edt || {};
    var Quantity = libs.quantity;
    var timo = libs.timo;

    function swap(array, i, j) {
        var tmp = array[i];

        array[i] = array[j];
        array[j] = tmp;
    }

    edt.constants = {
        INDEPENDENT: 'independent',
        CONTROL: 'control',
        DEPENDENT: 'dependent',
        SYSTEM: 'system',
        NONE: 'none',

        PROPERTY: 'property',
        MEASURE: 'measure',
        VARIABLE: 'variable',

        ASCENDING: 'ascending',
        DESCENDING: 'descending',

        COLUMN_WIDTH: 100-3-7-3 // Available space % for I,C,D
    };

    var INDEPENDENT = edt.constants.INDEPENDENT;
    var CONTROL = edt.constants.CONTROL;
    var DEPENDENT = edt.constants.DEPENDENT;
    var SYSTEM = edt.constants.SYSTEM;
    var NONE = edt.constants.NONE;

    var PROPERTY = edt.constants.PROPERTY;
    var MEASURE = edt.constants.MEASURE;

    var ASCENDING = edt.constants.ASCENDING;
    var DESCENDING = edt.constants.DESCENDING;

    var SLIDER = 'slider';
    var NUMERICAL = 'numerical';
    var TEXT = 'text';
    var CATEGORICAL = 'categorical';

    /**
     *  Create a new model.  Properties are:
     *
     *  this.specification - Domain specification as configured by teacher.
     *  this.configuration - EDT configuration.
     *  this.executable.properties - Properties extracted specification.
     *  this.executable.measures - Measures extracted specification.
     *  this.executable.system - System variables extracted specification.
     *  this.design - Design by student, columns with roles and rows with values.
     *  this.experiments - Table with (past) experiments of student.
     */
    var Model = edt.Model = function(specification, configuration) {
        this.specification = specification;
        this.configuration = configuration;

        this.executable = {};
        this.executable_from_specification();

        this.design = new edt.Design(this);
        this.experiments = new edt.Experiments(this);

        this.init();

        return this;
    };

    /**
     *  Copy the properties and variables from the specification and fill the
     *  executable struture.
     */
    Model.prototype.executable_from_specification = function() {
        var exec = this.executable;
        var i;

        exec.properties = []; // Properties user can select from
        exec.measures = []; // Measures user can select from
        exec.system = []; // Computed variables automatically selected
        exec.variables = []; // All of the above

        for (i=0; i<this.specification.properties.length; i++) {
            var p = this.specification.properties[i];

            exec.variables.push(p);

            if (is.string(p.formula) && p.formula !== '')
                exec.system.push(p);
            else
                exec.properties.push(p);
        }

        for (i=0; i<this.specification.measures.length; i++) {
            var m = this.specification.measures[i];

            exec.variables.push(m);
            exec.measures.push(m);
        }
    };

    Model.prototype.reset = function() {
        this.delete_experiment();
        this.experiments.reset();
        this.design.reset();
    };

    /**
     *  Initialise the model.  Normally used at the beginning and after
     *  loading a model from a resource.
     */
    Model.prototype.init = function() {
//        this.fix_rows();
        this.mode = 'plan';

        this.synchronise();
    };

    /**
     *  Renumber the rows.
     */
    Model.prototype.renumber = function() {
        if (this.design)
            renumber_rows(this.design.rows);
        if (this.experiments)
            renumber_rows(this.experiments.rows);

        function renumber_rows(rows) {
            for (var i=0; i<rows.length; i++) {
                rows[i].nth = i+1;
            }
        }
    };

    Model.prototype.synchronise = function() {
        var design = this.design;

        design.completion_flags();

        for (var r=0; r<design.rows.length; r++) {
            var row = design.rows[r];

            if (row.completed) {
                row.editable = false;
                this.add_experiment(design, row);
            }
        }
    };

    /**
     *  Returns JSON for the specifications.
     */
    Model.prototype.json = function() {
        var content = remove_hashKeys({
            properties: this.specification.properties,
            measures: this.specification.measures
        });

        return JSON.parse(JSON.stringify(content));
    };

    Model.prototype.resource_json = function() {
        var content = remove_hashKeys({
            design: this.design.json(),
            experiments: this.experiments.json()
        });

        return JSON.parse(JSON.stringify(content));
    };

    Model.prototype.column_cell = function(variable, role) {
        var v = this.find_variable(variable);

        return {
            variable: variable,
            input: this.variable_input(variable),
            role: role,
            lab: v.lab || null,
            formula: v.formula || null,
            value: null,
            unit: this.variable_unit(variable),
            image: this.variable_image(variable),
            sort_order: ASCENDING
        };
    };

    Model.prototype.row_cell = function(variable, role) {
        return {
            variable: variable,
            input: this.variable_input(variable),
            role: role,
            value: null,
            unit: this.variable_unit(variable)
        };
    };

    Model.prototype.variable_precision = function(name) {
        var v = this.find_variable(name);
        var def = 2;

        if (v && is.number(v.precision))
            return v.precision;

        return def;
    };

    //  Succeeds if the cell is in the required range.
    //  Otherwise, runs a valid value for the cell.
    Model.prototype.check_range_cell = function(cell) {
        var mv = this.find_variable(cell.variable);
        var value = this.coerce_variable_value(mv, cell.value);

        if (value === null) {
            cell.value = '';
            return true;
        }

        if (is_number(value) && mv.input === NUMERICAL) {
            if (is_given(mv.minimum)) {
                if (value < mv.minimum)
                    return mv.minimum;
            }
            if (is_given(mv.maximum)) {
                if (value > mv.maximum)
                    return mv.maximum;
            }
        }

        return true;
    };

    //  Coerce the variable value based on the type.
    Model.prototype.coerce_variable_value = function(variable, value) {
        value = (value === undefined ? variable.value : value);

        if (variable.input === SLIDER || variable.input === NUMERICAL) {
            if (is_number(value)) {
                return value;
            }
            if (is_string(value)) {
                value = value.parse_float(); // See parse_number.src

                return (isNaN(value) ? null : value);
            }
        }
        return value;
    };

    //  Coerce the variable initial based on the type.
    Model.prototype.coerce_variable_initial = function(variable) {
        if (variable.input === SLIDER || variable.input === NUMERICAL) {
            if (is_number(variable.initial)) {
                return variable.initial;
            }
            if (is_string(variable.initial)) {
                var value = variable.initial.parse_float();

                return (isNaN(value) ? null : value);
            }
        }
        return null;
    };

    Model.prototype.variable_unit = function(name) {
        var v = this.find_variable(name);
        var def = '';

        return (v.unit || def);
    };

    Model.prototype.variable_input = function(name) {
        var v = this.find_variable(name);
        var def = 'text';

        return (v.input || def);
    };

    Model.prototype.variable_image = function(name) {
        var v = this.find_variable(name);
        var def = null;

        return (v.image || def);
    };

    /**
     *  Find a variable in the model by name.
     */
    Model.prototype.find_variable = function(name) {
        var vars = this.executable.variables;

        for (var i=0; i<vars.length; i++) {
            var v = vars[i];

            if (v.name === name)
                return v;
        }

        return null;
    };

    Model.prototype.variable_formula = function(variable) {
        for (var i=0; i<this.executable.system.length; i++) {
            var spec = this.executable.system[i];

            if (spec.name === variable)
                return spec.formula;
        }
        return null;
    };

    /*------------------------------------------------------------
     *  Specification variables (during configuration)
     *------------------------------------------------------------*/

    Model.prototype.create_specification_variable = function(type) {
        var variable = {
            name: null,
            initial: null,
            precision: null,
            unit: '',
            minimum: null,
            maximum: null,
            increment: null,
            values: [],
            formula: null
        };

        if (type === PROPERTY) {
            variable.type = PROPERTY;
            variable.input = SLIDER;
            this.specification.properties.push(variable);
        }

        if (type === MEASURE) {
            variable.type = MEASURE;
            variable.input = TEXT;
            this.specification.measures.push(variable);
        }

        return variable;
    };

    Model.prototype.specification_variable = function(name) {
        var specification = this.specification;
        var i, spec;

        for (i=0; i<specification.properties.length; i++) {
            spec = specification.properties[i];

            if (spec.name === name)
                return spec;
        }

        for (i=0; i<specification.measures.length; i++) {
            spec = specification.measures[i];

            if (spec.name === name)
                return spec;
        }

        return null;
    };

    Model.prototype.delete_specification_variable = function(name) {
        var specification = this.specification;
        var i, spec;

        for (i=0; i<specification.properties.length; i++) {
            spec = specification.properties[i];

            if (spec.name === name) {
                specification.properties.splice(i, 1);
                this.reset(); // TBD - also call converting to executable??
                return true;
            }
        }

        for (i=0; i<specification.measures.length; i++) {
            spec = specification.measures[i];

            if (spec.name === name) {
                specification.measures.splice(i, 1);
                this.reset();
                return true;
            }
        }

        return false;
    };

    Model.prototype.move_up_specification_variable = function(name) {
        var specification = this.specification;
        var i, spec;

        for (i=0; i<specification.properties.length; i++) {
            spec = specification.properties[i];

            if (spec.name === name)
                return swap(specification.properties, i-1, i);
        }

        for (i=0; i<specification.measures.length; i++) {
            spec = specification.measures[i];

            if (spec.name === name)
                return swap(specification.measures, i-1, i);
        }

        return false;
    };

    Model.prototype.move_down_specification_variable = function(name) {
        var specification = this.specification;
        var i, spec;

        for (i=0; i<specification.properties.length; i++) {
            spec = specification.properties[i];

            if (spec.name === name)
                return swap(specification.properties, i+1, i);
        }

        for (i=0; i<specification.measures.length; i++) {
            spec = specification.measures[i];

            if (spec.name === name)
                return swap(specification.measures, i+1, i);
        }
    };

    /**
     *  Delete an experiment by nth1.  If argument is undefined then all
     *  experiments are deleted.
     */
    Model.prototype.delete_experiment = function(nth1) {
        if (nth1 === undefined) {
            while (this.experiments.rows.length > 0)
                this.delete_experiment(1);
            return;
        }
        this.experiments.rows.splice(nth1 - 1, 1);
        for (var r=0; r<this.experiments.rows.length; r++) {
            this.experiments.rows[r].nth = r + 1;
        }
    };

    /**
     *  Does this check whether experiments are still in the design?
     */
    Model.prototype.check_columns_in_use = function() {
        var cols = this.experiments.columns;
        var rows = this.experiments.rows;
        var count = 0;
        var i, j, row, col;

        //  Set in_use flag for all columns and rows.
        for (i=0; i<cols.length; i++) {
            col = cols[i];

            col.in_use = false;

            for (j=0; j<rows.length; j++) {
                row = rows[j];

                if (row.cells[i].value !== null) {
                    col.in_use = true;
                    break;
                }
            }

            if (col.in_use)
                count++;

            for (j=0; j<rows.length; j++) {
                row = rows[j];
                row.cells[i].in_use = col.in_use;
            }
        }

        var width = edt.constants.COLUMN_WIDTH / count;

        for (i=0; i<cols.length; i++)
            cols[i].width = width;
    };

    Model.prototype.add_experiment = function(design, row) {
        //  Existing
        if (this.experiments.row_by_uuid(row.uuid))
            return;

        var nth = this.experiments.rows.length + 1;
        var cols = this.experiments.columns;
        var rows = this.experiments.rows;
        var experiment = {
            nth: nth,
            uuid: row.uuid,
            cells: []
        };
        var i, j, col, cell;

        for (i=0; i<cols.length; i++) {
            col = cols[i];
            var seen = false;

            for (j=0; j<row.cells.length; j++) {
                cell = row.cells[j];
                if (col.variable === cell.variable) {
                    experiment.cells.push(cell);
                    seen = true;
                    break;
                }
            }
            if (!seen)
                experiment.cells.push(copy_cell(col));
        }

        this.experiments.rows.push(experiment);

        this.check_columns_in_use();
    };

    /*------------------------------------------------------------
     *  Experiments
     *------------------------------------------------------------*/

    var Experiments = edt.Experiments = function(model) {
        this.model = model;

        this.columns = [];
        this.rows = [];
        this.sort_order = ASCENDING;

        this.init();

        return this;
    };

    Experiments.prototype.reset = function() {
        if (this.columns) {
            while (this.columns.length)
                this.columns.pop();
        } else
            this.columns = [];
        this.init();
    };

    Experiments.prototype.toString = function() {
        return 'Experiments: ' + this.columns.length + ' ' + this.rows.length;
    };

    Experiments.prototype.init = function() {
        var model = this.model;
        var exec = this.model.executable;
        var cols = this.columns;
        var i, spec;

        for (i=0; i<exec.properties.length; i++) {
            spec = exec.properties[i];
            cols.push(model.column_cell(spec.name, PROPERTY));
        }

        for (i=0; i<exec.system.length; i++) {
            spec = exec.system[i];
            cols.push(model.column_cell(spec.name, SYSTEM));
        }

        for (i=0; i<exec.measures.length; i++) {
            spec = exec.measures[i];
            cols.push(model.column_cell(spec.name, MEASURE));
        }

        var width = edt.constants.COLUMN_WIDTH / cols.length;

        for (i=0; i<cols.length; i++)
            cols[i].width = width;

        return this;
    };

    Experiments.prototype.row_by_uuid = function(id) {
        var rows = this.rows;

        for (var i=0; i<rows.length; i++) {
            if (rows[i].uuid == id)
                return rows[i];
        }

        return null;
    };

    Experiments.prototype.json = function() {
        var content = remove_hashKeys({
            rows: this.rows,
            columns: this.columns
        });

        return JSON.parse(JSON.stringify(content));
    };

    Experiments.prototype.load_json = function(content) {
/*
        separator('Experiments.load_json ');
        pp(content);
        separator();
*/

        if (content) { // Because of osapi bug
            this.rows = (content.rows || []);
//            this.columns = (content.columns || []);	-- Set by .init() or .reset()
        } else {
            this.rows = [];
//            this.columns = [];
        }
    };

    Experiments.prototype.find_column_index = function(variable) {
        for (var i=0; i<this.columns.length; i++) {
            var col = this.columns[i];

            if (col.variable === variable)
                return i;
        }
        return null;
    };

    Experiments.prototype.sort = function(cell) {
        var order = cell.sort_order;
        var nth0 = this.find_column_index(cell.variable);

        this.rows.sort(function(a,b) {
            var cell_a = a.cells[nth0];
            var cell_b = b.cells[nth0];

            //  Value not given, cannot compare
            if (cell_a.value === null || cell_b.value === null)
                return 0;

            if (is_number(cell_a.value) && is_number(cell_b.value)) {
                return (order === ASCENDING ?
                        cell_a.value > cell_b.value :
                        cell_b.value > cell_a.value);
            }

            var str1 = is_string(cell_a.value) ? cell_a.value : cell_a.value.toString();
            var str2 = is_string(cell_b.value) ? cell_b.value : cell_b.value.toString();

            return (order === ASCENDING ? str1 > str2 : str1 < str2);
        });

        cell.sort_order = (order === ASCENDING ? DESCENDING : ASCENDING);
    };

    Experiments.prototype.sort_by_nth = function(cell) {
        var order = this.sort_order;

        this.rows.sort(function(a,b) {
            return (order === ASCENDING ? a.nth > b.nth : a.nth < b.nth);
        });

        this.sort_order = (order === ASCENDING ? DESCENDING : ASCENDING);
    };

    /*------------------------------------------------------------
     *  Design
     *------------------------------------------------------------*/

    var Design = edt.Design = function(model) {
        this.model = model;

        Object.defineProperty(this, 'columns', {
            enumerable: true,
            writable: false,
            value: []
        });
        Object.defineProperty(this, 'rows', {
            enumerable: true,
            writable: false,
            value: []
        });
//        this.columns = [];
//        this.rows = [];

        this.specified = false; // Independent, control
        this.runnable = false; // Enough rows
        this.enable_lab = edt.configuration.enable_lab;

        this.cache = {}; // Cache previous values

        this.reset();

        this.add_row();

        return this;
    };

    Design.prototype.reset = function(rows, cols) {
        rows = (rows === undefined ? [] : rows);
        cols = (cols === undefined ? [] : cols);

        this.rows.splice(0, this.rows.length); // Clear
        this.columns.splice(0, this.columns.length); // Clear
        this.cache = {};

        for (var r=0; r<rows.length; r++)
            this.rows.push(rows[r]);

        for (var c=0; c<cols.length; c++)
            this.columns.push(cols[c]);

        this.init_system_variables();

        return this;
    };

    Design.prototype.init_system_variables = function() {
        var svs = this.model.executable.system;

        for (var i=0; i<svs.length; i++)
            this.assign_variable(svs[i].name, SYSTEM);
    };

    Design.prototype.pretty_print = function(label) {
        var cols = this.columns;
        var rows = this.rows;

        console.log('================================================');
        console.log('Design.pretty_print ' + label);
        console.log('===================');
        var str = 'Columns ';

        for (var c=0; c<cols.length; c++) {
            var col = cols[c];
            str += c + ' ' + col.variable + '/' + col.role + '/' + col.lab + '; ';
        }
        console.log(str);
        for (var r=0; r<rows.length; r++) {
            var row = rows[r];
            str = 'Row ' + r + ': ';
            for (var i=0; i<row.cells.length; i++) {
                var cell = row.cells[i];
                str += i + ' ' + cell.variable + ' ' + cell.value + '; ';
            }
            console.log(str);
        }
        console.log('===================');
    };

    Design.prototype.select_row = function(row) {
        for (var r=0; r<this.rows.length; r++) {
            var row2 = this.rows[r];

            if (row2.nth === row.nth) {
                row2.selected = true;
                return;
            }
        }
    };

    Design.prototype.deselect_row = function(row) {
        for (var r=0; r<this.rows.length; r++) {
            var row2 = this.rows[r];

            if (row2.nth === row.nth) {
                row2.selected = false;
                return;
            }
        }
    };

    Design.prototype.delete_column = function(variable) {
        if (this.find_column_index(variable) !== null) {
            var col = this.find_column_index(variable);
            this.columns.splice(col, 1);
            this.delete_row_variable(variable);
        }
    };

    /**
     *  Set role for a variable.  Returns true when the role has changed.
     */
    Design.prototype.set_variable_role = function(variable, role) {
        var old = this.find_column_index(variable);
        var r, c, row, cell;

        if (old === null) {
            this.add_column(this.model.column_cell(variable,role));
            return true;
        }

        if (old.role === role)
            return false;

        this.columns[old].role = role;
        this.check_specified();

        for (r=0; r<this.rows.length; r++) {
            row = this.rows[r];

            if (row.completed) {
                for (c=0; c<row.cells.length; c++) {
                    cell = row.cells[c];
                    if (cell.variable === variable) {
                        cell.role = role;
                        cell.drop_role = role;
                    }
                }
                continue;
            }

            row.editable = true;
            row.completed = false;
            row.runnable = this.specified;

            for (c=0; c<row.cells.length; c++) {
                cell = row.cells[c];
                if (cell.variable === variable)
                    cell.role = role;
                if (!cell.value && cell.role !== DEPENDENT)
                    row.runnable = false;
            }

            if (!row.runnable)
                row.selected = false;
        }

        this.count_runnable_rows();

        return true;
    };

    Design.prototype.delete_row_variable = function(variable) {
        var rows = this.rows;

        for (var r=0; r<rows.length; r++) {
            var row = rows[r];
            for (var c=0; c<row.cells.length; c++) {
                var cell = row.cells[c];

                if (cell.variable === variable) {
                    row.cells.splice(c, 1);
                    break;
                }
            }
        }
    };

    /**
     *  Returns a list of variable names by their role.
     */
    Design.prototype.columns_by_role = function(role) {
        var rval = [];

        for (var c=0; c<this.columns.length; c++) {
            var col = this.columns[c];

            if (col.role === role)
                rval.push(col.variable);
        }

        return rval;
    };

    Design.prototype.independent = function() {
        return this.columns_by_role(INDEPENDENT);
    };

    Design.prototype.control = function() {
        return this.columns_by_role(CONTROL);
    };

    Design.prototype.system = function() {
        return this.columns_by_role(SYSTEM);
    };

    Design.prototype.dependent = function() {
        return this.columns_by_role(DEPENDENT);
    };

    Design.prototype.variable_clear_values = function(variable) {
        var c, r, row, col, cell;

        for (c=0; c<this.columns.length; c++) {
            col = this.columns[c];
            if (col.variable === variable)
                col.value = null;
        }

        for (r=0; r<this.rows.length; r++) {
            row = this.rows[r];
            if (row.completed)
                continue;

            row.selected = false;
            row.editable = true;
            row.completed = false;
            row.runnable = false;

            for (c=0; c<row.cells.length; c++) {
                cell = row.cells[c];
                if (cell.variable === variable) {
                    cell.value = null;
                }
            }
        }
        this.count_runnable_rows();
    };

    /**
     *  Succeed if the variable name has been assigned a role in this design.
     */
    Design.prototype.variable_assigned = function(variable) {
        for (var c=0; c<this.columns.length; c++) {
            var col = this.columns[c];
            if (col.variable === variable)
                return true;
        }
        return false;
    };

    /**
     *  Return the role of the variable in this design.
     */
    Design.prototype.variable_role = function(variable) {
        for (var c=0; c<this.columns.length; c++) {
            var col = this.columns[c];

            if (col.variable === variable)
                return col.role;
        }
        return null;
    };

    Design.prototype.modified = function(what) {
        this.cache = {};
        this.calculate(); // Calculate system variables
        this.completion_flags();
        this.model.renumber();

        return this;
    };

    /**
     *  Compute layout information for the variable headers.
     */
    Design.prototype.layout_variable_headers = function() {
        if (this.cache.layout_variable_headers) {
            return this.cache.layout_variable_headers;
        }

        var i_min = this.layout_columns_minimum(INDEPENDENT);
        var c_min = this.layout_columns_minimum(CONTROL);
        var s_min = this.layout_columns_minimum(SYSTEM);
        var d_min = this.layout_columns_minimum(DEPENDENT);
        var rval = [];

        if (i_min > 0 && c_min === 0) {
            rval.push({
                header: edt.translate('variables'),
                role: INDEPENDENT,
                colspan: i_min
            });
        }

        if (i_min > 0 && c_min !== 0)
            rval.push({
                header: edt.translate('vary'),
                role: INDEPENDENT,
                colspan: i_min
            });

        if (c_min > 0)
            rval.push({
                header: edt.translate('keep_constant'),
                role: CONTROL,
                colspan: c_min
            });

        if (s_min > 0)
            rval.push({
                header: edt.translate('system'),
                role: SYSTEM,
                colspan: s_min
            });

        if (d_min > 0)
            rval.push({
                header: edt.translate('measure'),
                role: DEPENDENT,
                colspan: d_min
            });

        this.cache.layout_variable_headers = rval;

        return rval;
    };

    /**
     *  Succeeds if at least one variable has been assigned a role.
     */
    Design.prototype.layout_columns_available = function() {
        var i = this.columns_by_role(INDEPENDENT).length;
        var c = this.columns_by_role(CONTROL).length;
        var d = this.columns_by_role(DEPENDENT).length;
        var s = this.columns_by_role(SYSTEM).length;
        var sum = i + c + d + s;

        return sum > 0;
    };


    Design.prototype.layout_columns_minimum = function(role) {
        var conf = edt.configuration[role];
        var count = this.columns_by_role(role).length;

        if (role === SYSTEM)
            return count;
        if (conf.maximum === 0)
            return 0;
        if (count > 0)
            return count;
        return 1;
    };

    /**
     *  Compute layout information for the variables.
     */
    Design.prototype.layout_variable_columns = function() {
        if (this.cache.layout_variable_columns) {
            return this.cache.layout_variable_columns;
        }

        var i_min = this.layout_columns_minimum(INDEPENDENT);
        var c_min = this.layout_columns_minimum(CONTROL);
        var s_min = this.layout_columns_minimum(SYSTEM);
        var d_min = this.layout_columns_minimum(DEPENDENT);
        var cols = i_min + c_min + d_min + s_min;
        var width = edt.constants.COLUMN_WIDTH/cols;

        var i_seen = (i_min > 0 ? false : true);
        var c_seen = (c_min > 0 ? false : true);
        var s_seen = (s_min > 0 ? false : true);
        var d_seen = (d_min > 0 ? false : true);
        var rval = [];

        for (var x=0; x<this.columns.length; x++) {
            var col = this.columns[x];

            col.width = width;
            if (col.role === INDEPENDENT) {
                col.drop_role = INDEPENDENT;
                i_seen = true;
                rval.push(col);
                continue;
            }
            if (col.role === CONTROL) {
                col.drop_role = CONTROL;
                if (i_seen === false)
                    rval.push({role: 'none', width: width, drop_role: INDEPENDENT});
                i_seen = c_seen = true;
                rval.push(col);
                continue;
            }
            if (col.role === SYSTEM) {
                col.drop_role = SYSTEM;
                if (i_seen === false)
                    rval.push({role: 'none', width: width, drop_role: INDEPENDENT});
                if (c_seen === false)
                    rval.push({role: 'none', width: width, drop_role: CONTROL});
                i_seen = c_seen = s_seen = true;
                rval.push(col);
                continue;
            }
            if (col.role === DEPENDENT) {
                col.drop_role = DEPENDENT;
                if (i_seen === false)
                    rval.push({role: 'none', width: width, drop_role: INDEPENDENT});
                if (c_seen === false)
                    rval.push({role: 'none', width: width, drop_role: CONTROL});
                i_seen = c_seen = d_seen = true;
                rval.push(col);
                continue;
            }
        }

        if (i_seen === false)
            rval.push({role: 'none', width: width, drop_role: INDEPENDENT});
        if (c_seen === false)
            rval.push({role: 'none', width: width, drop_role: CONTROL});
        if (d_seen === false)
            rval.push({role: 'none', width: width, drop_role: DEPENDENT});
        this.cache.layout_variable_columns = rval;

        return rval;
    };

    /**
     *  Compute layout for the rows.  Return value is a copy of the rows
     *  itself except that when one of the roles is missing a cell with role:
     *  'none' is inserted to align the columns to the headers.
     *
     *  NOTE.  Assumes the rows are in the same order as the columns.
     */
    Design.prototype.layout_rows = function() {
        if (this.cache.layout_rows) {
            return this.cache.layout_rows;
        }

        var i_min = this.layout_columns_minimum(INDEPENDENT);
        var c_min = this.layout_columns_minimum(CONTROL);
        var s_min = this.layout_columns_minimum(SYSTEM);
        var d_min = this.layout_columns_minimum(DEPENDENT);
        var rval = [];

        for (var x=0; x<this.rows.length; x++) {
            var row = this.rows[x];
            var i_seen = (i_min > 0 ? false : true);
            var c_seen = (c_min > 0 ? false : true);
            var s_seen = (s_min > 0 ? false : true);
            var d_seen = (d_min > 0 ? false : true);
            var r = copy_row(row);

            r.cells = [];

            for (var c=0; c<row.cells.length; c++) {
                var cell = row.cells[c];

                if (cell.role === INDEPENDENT) {
                    cell.drop_role = INDEPENDENT;
                    i_seen = true;
                    r.cells.push(cell);
                    continue;
                }
                if (cell.role === CONTROL) {
                    cell.drop_role = CONTROL;
                    if (i_seen === false) {
                        r.cells.push({role: 'none', drop_role: INDEPENDENT});
                        i_seen = true;
                    }
                    c_seen = true;
                    r.cells.push(cell);
                    continue;
                }
                if (cell.role === SYSTEM) {
                    cell.drop_role = NONE;
                    if (i_seen === false) {
                        r.cells.push({role: 'none', drop_role: INDEPENDENT});
                        i_seen = true;
                    }
                    if (c_seen === false) {
                        r.cells.push({role: 'none', drop_role: CONTROL});
                        c_seen = true;
                    }
                    s_seen = true;
                    r.cells.push(cell);
                    continue;
                }
                if (cell.role === DEPENDENT) {
                    cell.drop_role = DEPENDENT;
                    if (i_seen === false) {
                        r.cells.push({role: 'none', drop_role: INDEPENDENT});
                        i_seen = true;
                    }
                    if (c_seen === false) {
                        r.cells.push({role: 'none', drop_role: CONTROL});
                        c_seen = true;
                    }
                    d_seen = true;
                    r.cells.push(cell);
                    continue;
                }
            }

            if (i_seen === false)
                r.cells.push({role: 'none', drop_role: INDEPENDENT});
            if (c_seen === false)
                r.cells.push({role: 'none', drop_role: CONTROL});
            if (d_seen === false)
                r.cells.push({role: 'none', drop_role: DEPENDENT});

            rval.push(r);
        }

        this.cache.layout_rows = rval;

        return rval;
    };

    /**
     *  Return a count of rows that are runnable.
     */
    Design.prototype.count_runnable_rows = function() {
        var rval = 0;

        for (var r=0; r<this.rows.length; r++) {
            var row = this.rows[r];

            if (row.runnable)
                rval++;
        }

        //  Include previously ran experiments for 'enable_lab'
//        if (rval && this.model.experiments.rows.length >= this.enable_lab) {
//            this.runnable = true;
//            return rval;
//        }

        if (rval >= this.enable_lab)
            this.runnable = true;
        else
            this.runnable = false;

        return rval;
    };

    /**
     *  Return JSON for the model created by the student, normally returned by
     *  each log action.
     */
    Design.prototype.json = function() {
        var content = remove_hashKeys({
            rows: this.rows,
            columns: this.columns
        });

        return JSON.parse(JSON.stringify(content));
    };

    /**
     *  Load a design from a JSON specification.
     */
    Design.prototype.load_json = function(content) {
        if (content) // Because of osapi bug
            this.reset(content.rows, content.columns);
        else
            this.reset();

        this.modified();
    };

    Model.prototype.sort_experiments = function(cell) {
        this.experiments.sort(cell);
    };

    Model.prototype.sort_experiments_by_nth = function() {
        this.experiments.sort_by_nth();
    };

    /**
     *  Check that all properties have been assigned the correct number
     *  of variables (independent, control, measures).  If this is the case
     *  this.specified is true, otherwise it is false.
     */
    Design.prototype.check_specified = function() {
        var model = this.model;
        var conf = model.configuration;
        var v_spec = model.executable.properties.length;
        var m_spec = model.executable.measures.length;
        var i_min = (conf.independent.minimum === undefined ? 1 : conf.independent.minimum);
        var i_max = (conf.independent.maximum === undefined ? null : conf.independent.maximum);
        var c_min = (conf.control.minimum === undefined ? 1 : conf.control.minimum);
        var c_max = (conf.control.maximum === undefined ? null : conf.control.maximum);

        //  Backwards compatibility
        if (!conf.dependent)
            conf.dependent = conf.measure;

        var d_min = (conf.dependent.minimum === undefined ? 1 : conf.dependent.minimum);
        var d_max = (conf.dependent.maximum === undefined ? null : conf.dependent.maximum);
        var v_min = (conf.variable.minimum === undefined ? 1 : conf.variable.minimum);
        var v_max = (conf.variable.maximum === undefined ? null : conf.variable.maximum);
        var i = this.independent().length;
        var c = this.control().length;
        var d = this.dependent().length;
        var v = i + c;

        if (conf.variable.use_all) {
            v_min = v_max = v_spec;
        }

        if (!in_range(i, i_min, i_max)) {
            return this.specified = false;
        }

        if (!in_range(c, c_min, c_max)) {
            return this.specified = false;
        }

        if (!in_range(d, d_min, d_max)) {
            return this.specified = false;
        }

        if (!in_range(v, v_min, v_max)) {
            return this.specified = false;
        }

        return this.specified = true;

        function in_range(x, min, max) {
            if (is_number(min) && is_number(max))
                return x >= min && x <= max;
            if (is_number(min))
                return x >= min;
        }
    };

    Design.prototype.calculate = function() {
        if (this.rows.length === 0)
            return;

        var r, c, row, cell;

        for (r=0; r<this.rows.length; r++) {
            row = this.rows[r];

            for (c=0; c<row.cells.length; c++) {
                cell = row.cells[c];

                if (cell.role === SYSTEM) {
                    var formula = this.model.variable_formula(cell.variable);
                    if (!is.string(formula))
                        continue;
                    var expr = timo.parser.parse(formula);
                    var vars = expr.variables();
                    var values = {};
                    var complete = true;
                    for (var v in vars) {
                        var idx = this.find_column_index(v);

                        if (idx !== null) {
                            var cell2 = row.cells[idx];

                            if (cell2.value !== null) {
                                values[v] = cell2.value;
                                continue;
                            }
                        }
                        complete = false;
                    }

                    if (complete) {
                        cell.value = expr.compute(values);
                    }
                }
            }
        }
    };

    /**
     *  Update the "completion flags".
     */
    Design.prototype.completion_flags = function() {
        this.check_specified(); // The design

        if (this.rows.length === 0)
            return;

        var r, c, row, cell;

        if (this.specified) {
            for (r=0; r<this.rows.length; r++) {
                row = this.rows[r];
                if (row.completed)
                    continue;

                row.runnable = true;
                row.completed = true;

                for (c=0; c<row.cells.length; c++) {
                    cell = row.cells[c];
                    if (cell.role === DEPENDENT) {
                        if (cell.value === null) {
                            row.completed = false;
                        }
                        continue;
                    }
                    if (cell.value === null) {
                        row.runnable = false;
                        row.completed = false;
                        break;
                    }
                }

                if (row.completed) {
                    row.editable = false; // TBD - Correct?
                    this.model.add_experiment(this, row);
                }
            }
        } else {
            for (r=0; r<this.rows.length; r++) {
                row = this.rows[r];
                if (row.completed)
                    continue;
                row.runnable = false;
            }
        }

        for (r=0; r<this.rows.length; r++) {
            row = this.rows[r];
            row.editable = !row.completed;
        }

        this.count_runnable_rows();
    };

    /**
     *  Succeed when all rows have been completed.
     */
    Design.prototype.can_clear_design = function() {
        for (var r=0; r<this.rows.length; r++) {
            var row = this.rows[r];

            if (!row.completed)
                return false;
        }
        return true;
    };

    /**
     *  Clear the current design.
     */
    Design.prototype.clear_design = function() {
        this.reset();
    };

    /**
     *  Update value according to cell (which contains the new value and
     *  unit).  The row to be updated is given by nth1.
     */
    Design.prototype.update_value = function(cell, nth1) {
        var index = this.find_column_index(cell.variable);
        var col = this.columns[index];
        var row = this.rows[nth1-1];
        var c, r, row2, row_cell;

        //  Clear values in dependent
        if (cell.role === INDEPENDENT) {
            row.runnable = false;
            row.completed = false;

            for (c=0; c<row.cells.length; c++) {
                row_cell = row.cells[c];

                if (row_cell.role === DEPENDENT)
                    row_cell.value = null;
            }
        }

        if (cell.role === CONTROL) {
            for (r=0; r<this.rows.length; r++) {
                row2 = this.rows[r];

                if (!row2.editable)
                    continue;

                row2.runnable = false;
                row2.completed = false;

                for (c=0; c<row2.cells.length; c++) {
                    row_cell = row2.cells[c];

                    if (row_cell.role === DEPENDENT)
                        row_cell.value = null;
                }
            }
        }

        if (cell.role === CONTROL) {
            col.value = cell.value;
            col.unit = cell.unit;
            for (r=0; r<this.rows.length; r++) {
                row2 = this.rows[r];
                if (row2.editable) {
                    row2.cells[index].value = cell.value;
                    row2.cells[index].unit = cell.unit;
                }
            }
        } else {
            row.cells[index].value = cell.value;
            row.cells[index].unit = cell.unit;
        }

        if (row.completed && cell.role === DEPENDENT) {
            var model = this.model;

            for (var e=0; e<model.experiments.rows.length; e++) {
                var exp_row = model.experiments.rows[e];

                if (row.uuid === exp_row.uuid) { // TBD - watch out was nth_experiment
                    for (c=0; c<exp_row.cells.length; c++) {
                        var exp_cell = exp_row.cells[c];

                        if (cell.variable === exp_cell.variable) {
                            exp_cell.value = cell.value;
                            exp_cell.unit = cell.unit;
                            return;
                        }
                    }
                }
            }
            return;
        }

        this.modified();
    };


    /**
     *  Reorder the columns according to their role.  Reordering is only
     *  applied to the active rows.
     */
    Design.prototype.reorder = function() {
        var cols = this.columns;
        var rows = this.rows;

        //  Re-order the columns.
        for (var i=0; i<cols.length-1; i++) {
            if (ordered_cells(cols[i], cols[i+1]))
                continue;

            swap(cols, i, (i+1));
            swap_row_cells(rows, i, i+1);

            return this.reorder();
        }

        function swap_row_cells(rows, i, j) {
            for (var r=0; r<rows.length; r++)
                swap(rows[r].cells, i, j);
        }

        /**
         *  Two cells are ordered if the role is in this order:
         *    independent < control < system < dependent
         */
        function ordered_cells(cell1, cell2) {
            var priority = {
                independent: 0,
                control: 1,
                system: 2,
                dependent: 3
            };

            return (priority[cell1.role] <= priority[cell2.role]);
        }
    };

    /**
     *  Succeed if the values for variable are consistent in all rows.
     *  Consistent means that at most one real value is present.
     *  Returns false when the values are inconsistent and the consistent
     *  value otherwise.
     */
    Design.prototype.consistent_values = function(variable) {
        var index = this.find_column_index(variable);
        var seen = null;

        for (var r=0; r<this.rows.length; r++) {
            var row = this.rows[r];
            var cell = row.cells[index];

            if (cell.value === seen)
                continue;
            if (cell.value === null)
                continue;
            if (seen !== null)
                return false;
            seen = cell.value;
        }

        return seen;
    };

    Design.prototype.assign_column_value = function(variable, value) {
        var index = this.find_column_index(variable);
        var col = this.columns[index];

        col.value = value;
    };

    /**
     *  Variable has been assigned a role.
     *  Normally called after a drop.
     */
    Design.prototype.assign_variable = function(variable, role, clear) {
        this.set_variable_role(variable, role);
        if (clear)
            this.variable_clear_values(variable);
        this.reorder();
        this.modified('assign_variable');
    };

    /**
     *  Current role removed from a variable.
     *  Normally called after a drop.
     */
    Design.prototype.unassign_variable = function(variable) {
        this.delete_column(variable);
        this.modified('unassign_variable');
    };

    /**
     *  Add a row.
     */
    Design.prototype.add_row = function() {
        var row = {
            nth: this.rows.length + 1,
            uuid: edt.uuid(),
            runnable: false,
            completed: false,
            selected: false,
            editable: true,
            cells: []
        };

        this.rows.push(row);

        for (var i=0; i<this.columns.length; i++) {
            var col = this.columns[i];
            if (col.role === INDEPENDENT || col.role === SYSTEM)
                col.value = null;
            row.cells.push(copy_cell(col));
        }

        this.modified();
    };

    /**
     *  Delete a row.
     */
    Design.prototype.delete_row = function(nth1) {
        this.rows.splice(nth1-1, 1);

        for (var i=0; i<this.rows.length; i++)
            this.rows[i].nth = i+1;

        this.modified();
    };

    Design.prototype.add_column = function(cell) {
        this.columns.push(copy_cell(cell));

        for (var r=0; r<this.rows.length; r++) {
            var row = this.rows[r];

            row.cells.push(copy_cell(cell));
        }

        this.reorder();
    };

    Design.prototype.find_column = function(variable) {
        for (var i=0; i<this.columns.length; i++) {
            var col = this.columns[i];

            if (col.variable === variable)
                return col;
        }
        return null;
    };

    Design.prototype.find_column_index = function(variable) {
        for (var i=0; i<this.columns.length; i++) {
            var col = this.columns[i];

            if (col.variable === variable)
                return i;
        }
        return null;
    };

    Design.prototype.clear_cell_values = function(index) {
        for (var r=0; r<this.rows.length; r++) {
            var row = this.rows[r];

            row.cells[index].value = null;
        }
    };

    /*------------------------------------------------------------
     *  Cell
     *------------------------------------------------------------*/

    /**
     *  Copy a single cell.
     */
    function copy_cell(cell) {
        var rval = {};

        for (var p in cell)
            if (cell.hasOwnProperty(p)) {
                rval[p] = cell[p];
            }

        return rval;
    }

    /**
     *  Copy a single row.
     */
    function copy_row(row) {
        var rval = {};

        for (var p in row)
            if (row.hasOwnProperty(p)) {
                rval[p] = row[p];
            }

        return rval;
    }

    Model.prototype.coerce_variable_precision = function(variable) {
        if (is_not_given(variable.precision))
            return null;

        var precision = variable.precision.parse_int();

        if (isNaN(precision))
            return null;

        precision = precision > 0 ? precision : 0;
        precision = Math.min(precision, 20);

        return precision;
    };

    Model.prototype.specification_complete = function() {
        var i, v;

        for (i=0; i<this.specification.properties.length; i++) {
            v = this.specification.properties[i];
            if (this.check_variable(v, true).length !== 0) {
                return v;
            }
        }

        for (i=0; i<this.specification.measures.length; i++) {
            v = this.specification.measures[i];
            if (this.check_variable(v, true).length !== 0) {
                return v;
            }
        }

        this.executable_from_specification();

        return true;
    };

    Model.prototype.check_variable = function(v, required) {
        var errors = [];
        var str;

        if (is.string(v.formula)) {
            v.role = SYSTEM;
            return errors;
        }

        if (v.input === CATEGORICAL) {
            var len = v.values.length;

            if (len < 1)
                errors.push({ property: 'values',
                              error: 'At least one value is required'
                            });
            return errors;
        }

        if (v.input === SLIDER || v.input === NUMERICAL) {
            if (is_given(v.initial)) {
                if ((str=this.invalid_variable_property(v, 'initial')))
                    errors.push({property: 'initial', error: str});
            }
            if (is_given(v.minimum)) {
                if ((str=this.invalid_variable_property(v, 'minimum')))
                    errors.push({property: 'minimum', error: str});
            } else
                if (v.input === SLIDER && required)
                    errors.push({property: 'minimum', error: 'Required field'});
            if (is_given(v.maximum)) {
                if ((str=this.invalid_variable_property(v, 'maximum')))
                    errors.push({property: 'maximum', error: str});
            } else
                if (v.input === SLIDER && required)
                    errors.push({property: 'maximum', error: 'Required field'});

            if (is_number(v.minimum) && is_number(v.maximum)) {
                if (v.maximum <= v.minimum) {
                    errors.push({property: 'maximum', error: 'Maximum smaller than minimum'});
                } else {
                    if (is_number(v.increment) && v.input === SLIDER) {
                        var range = v.maximum - v.minimum;

                        if (v.increment > range / 4) {
                            errors.push({property: 'increment',
                                         error: 'Increment too large given the range'});
                        }
                        if (v.increment < range / 400) {
                            errors.push({property: 'increment',
                                         error: 'Increment too small given the range'});
                        }
                    }
                }

                if (is_number(v.initial)) {
                    if (v.initial < v.minimum)
                        errors.push({property: 'initial',
                                     error: 'Initial smaller than minimum'});
                    if (v.initial > v.maximum)
                        errors.push({property: 'initial',
                                     error: 'Initial larger than maximum'});
                }
            }

            if (is_given(v.precision)) {
                if ((str=this.invalid_variable_property(v, 'precision')))
                    errors.push({property: 'precision', error: str});
            }

            if (is_number(v.precision)) {
                if (v.precision < 0)
                    v.precision = 0;
                v.precision = Math.round(v.precision);
                if (v.precision > 10)
                    errors.push({property: 'precision',
                                 error: 'Precision is too large'});
            }
        }

        if (v.input === SLIDER) {
            if (is_given(v.increment)) {
                if ((str=this.invalid_variable_property(v, 'increment')))
                    errors.push({property: 'increment', error: str});
            }
        }

        return errors;
    };

    Model.prototype.invalid_variable_property = function(variable, property) {
        if (property === 'minimum' || property === 'maximum' || property === 'increment' || property === 'precision' || ((variable.input === SLIDER || variable.input === NUMERICAL) && property === 'initial')) {
            var value = this.type_check_variable_value(variable, variable[property]);

            if (value === null)
                return 'Value not a number';

            variable[property] = value; // Set the value
            return false;
        }

        return 'Not implemented: invalid ' + property;
    };

    Model.prototype.type_check_variable_value = function(variable, value) {
        value = (value === undefined ? variable.value : value);
        var numerical = variable.input === SLIDER || variable.input === NUMERICAL;

        if (!numerical)
            return value;

        if (is_number(value)) {
            return value;
        }

        if (is_string(value)) {
            var tmp = value.parse_float();

            if (isNaN(tmp))
                return null;
            return tmp;
        }

        return null;
    };

    Model.prototype.html_variable_unit = function(v) {
        var unit = v.unit;

        if (is_not_given(unit))
            return '';

        var q = Quantity.create(1, unit);

        return Quantity.html(q, undefined, true);
    };

    Model.prototype.html_variable_value = function(v) {
        var is_cell = (v.variable ? true : false);
        var name = (is_cell ? v.variable : v.name);
        var mv = this.find_variable(name);
        var value;
        var q;

        if (mv === null)
            return '?';

        if (is_cell)
            value = v.value;
        else {
            if (mv.initial !== null)
                value = mv.initial;
            else {
                if (is_given(mv.minimum) && is_given(mv.maximum))
                    value = (mv.maximum + mv.minimum) / 2;
                else
                    value = 1.23;
            }
        }

        var precision = mv.precision;
        var unit = mv.unit;

        if (is_not_given(unit)) {
            if (is_not_given(value))
                return '?';
            if (is_number(value) && is_given(precision))
                return value.toFixed(precision);
            return value;
        }

        if (is_not_given(value)) {
            q = Quantity.create(1, unit);

            return '? ' + Quantity.html(q, undefined, true);
        }

        value = this.coerce_variable_value(mv, value);

        if (value !== null && is_number(value)) {
            q = Quantity.create(value, unit);

            return Quantity.html(q, is_not_given(precision) ? undefined : precision);
        }

        return value + ' ' + unit;
    };

    function remove_hashKeys(obj) {
        for (var p in obj) {
            if (p === '$$hashKey') {
                delete obj[p];
                continue;
            }
            var sub = obj[p];

            if (sub === null)
                continue;

            if (typeof sub === 'object')
                remove_hashKeys(sub);
        }
        return obj;
    }

    function is_string(obj) {
        return typeof(obj) === 'string';
    }

    function is_number(obj) {
        return typeof(obj) === 'number';
    }

    function is_not_given(obj) {
        return obj === null || obj === undefined || obj === '';
    }

    function is_given(obj) {
        return !is_not_given(obj);
    }

    function separator(label) {
        var line = '------------------------------------------------------';

        console.log(line);
        console.log(label || '');
    }
}).call(this);
