/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        phases.src
 *  Part of     Go-Lab Reflection tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Returns the structure of an ILS in terms of phases and apps per phase
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     16/04/15  (Created)
 *		14/10/15  (Last modified)
 */ 

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var reflect = tools.reflect = tools.reflect || {};

    printf('========== loading tools/reflect/js/phases.js');

    reflect.default_phases = function() {
        var ORIENTATION = 'Orientation';
        var CONCEPTUALISATION = 'Conceptualisation';
        var INVESTIGATION = 'Investigation';
        var CONCLUSION = 'Conclusion';
        var DISCUSSION = 'Discussion';

        return [
            ORIENTATION,
            CONCEPTUALISATION,
            INVESTIGATION,
            CONCLUSION,
            DISCUSSION
        ];
    };

    reflect.phases_from_ils_structure = function(ils_structure) {
        var rval = [];

        for (var p=0; p<ils_structure.phases.length; p++) {
            var phase = ils_structure.phases[p];

            rval.push(phase.displayName);
        }

        return rval;
    };

}).call(this);
