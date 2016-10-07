/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        model.js
 *  Part of     Go-Lab Entry Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Representation of the underlying model
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     01/03/16  (Created)
 *		01/03/16  (Last modified)
 */ 

(function() {
    "use strict";
    printf('========== loading tools/entry/js/model.js');

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = utils.is;
    var entry = tools.entry = tools.entry || {};

    var Model = entry.Model = function(spec) {
        this.configuration = use_default(spec.configuration, {});
        this.text = use_default(spec.text, '');

        if (this.configuration)	{	// TBD - remove
            this.configuration.questions = undefined;
            this.configuration.answers = undefined;
        }
    };

    Model.prototype.json_resource = function() {
        return { text: this.text };
    };

    Model.prototype.json_configuration = function() {
        var copy = JSON.parse(JSON.stringify(this.configuration));

        remove_hashKeys(copy);

        return copy;
    };

    Model.prototype.load_json = function(data) {
        data = (is.object(data) ? data : JSON.stringify(data));

        this.text = use_default(data.text, '');
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

}).call(this);
