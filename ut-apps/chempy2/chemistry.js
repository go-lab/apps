/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        chemistry.js
 *  Part of	JavaScript library - chemistry related functions
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Functions for chemistry, parsing of formula's and equations
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     12/06/14  (Created)
 *		05/11/15  (Last modified)
 */ 

(function () {
    "use strict";

    printf('========== loading tools/chempy2/js/chemistry.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var Chemistry = libs.chemistry = libs.chemistry || {};
    var Formula = Chemistry.formula = Chemistry.formula || {};

    var minus = '&#8722';

    /**
     *  Parse string representation of a chemical formula and return the
     *  printable HTML representation.  See above for the syntax.
     *
     *  Example: 'H2O' returns 'H<sub>2</sub>O'.
     *
     *  Ions of an element with different charges are written as 'Fe2+' or
     *  'Fe3+'.  Normally, ions are given by the formula and the charge as the
     *  second argument.
     *
     *  Hydrates are written as 'CuSO4 . 5H2O' (with a dot surrounded by two spaces).
     *
     *  @param {String} formula Chemical formula in standard notation.
     *  @param {Number} charge Optional charge (for ions)
     *  @returns {String} HTML HTML representation of the formula.
     */
    Formula.html = function(formula, charge_given) {
        var atoms = {};
        var rval = '';
        var re_charged = /(.*)\^?([+\-])/;
        var re_charged_plus = /(.*)\^([0-9]+)([+\-])/;
        var re_hydrate = /(.*) \. (.*)/;
        var matches;
        var charge = 0;		// Is overriden by charge_given

        if ((matches = formula.match(re_hydrate))) {
            var head = matches[1];
            var rval_head = Formula.html(head);
            var rval_tail = '';
            var re_count = /(.*)(H2O)/;
            matches = matches[2].match(re_count);
            
            //  For example ... nH20
            if (isNaN(parseInt(matches[1], 10))) {	
                rval_tail = '<i>' + matches[1] + '</i>' + Formula.html(matches[2]);
            } else {
                rval_tail = matches[1] + Formula.html(matches[2]);
            }

            return rval_head + ' &middot; ' + rval_tail;
        }

        //  For example: Fe^2+
        if ((matches = formula.match(re_charged_plus))) {
            formula = matches[1];

            if (matches[3] === '+')
                charge = parseInt(matches[2], 10);
            else
                charge = -parseInt(matches[2], 10);
        }

        //  For example: Na^+ or Na+
        if ((matches = formula.match(re_charged))) {
            formula = matches[1];

            if (matches[2] === '+')
                charge = 1;
            else
                charge = -1;
        }

        charge = use_default(charge_given, charge);

        for (var n=0; n<formula.length; n++) {
            var chr = formula[n];

            if (/[0-9]/.test(chr))
                rval = rval + '<sub>' + chr + '</sub>';
            else
                rval = rval + chr;
        }

        switch (charge) {
        case 0:
        case null:
            break;
        case 1:
            rval += '<sup>+</sup>';
            break;
        case -1:
             rval += '<sup>'+minus+'</sup>';
            break;
        default:
            if (charge > 1)
                rval += '<sup>' + charge + '+</sup>';
            else
                rval += '<sup>' + Math.abs(charge) + minus + '</sup>';
        }

        return rval;
    };

    
    Formula.ion_counts = function(formula, ion1, ion2) {
        return (ion_counts2(formula, ion1, ion2) || ion_counts2(formula, ion2, ion1));
            
        function ion_counts2(formula, ion1, ion2) {
            var ion_counts = [];
            var left = ion1;
            var right = ion2;
            var l = '\\(?' + '(' + left + ')' + '\\)?' + '(' + '[0-9]?' + ')';
            var r = '\\(?' + '(' + right + ')' + '\\)?' + '(' + '[0-9]?' + ')';
            var str = '^' + l + r + '$';
            var regex = new RegExp(str);
            var match = regex.exec(formula);

            if (match) {
                for (var i=1; i<match.length; i+=2) {
                    ion_counts.push({
                        ion: match[i],
                        count: parseFloat(match[i+1] || 1)
                    });
                }
                return ion_counts;
            }
            return null;
        }
    };

    Formula.undecorated = function(formula) {
        return formula.replace(/\^/g, '').replace(/_/g, '');
    };

    Formula.decorated = function(formula, charge_given) {
        var atoms = {};
        var rval = '';
        var re_charged = /(.*)\^?([+\-])/;
        var re_charged_plus = /(.*)\^([0-9]+)([+\-])/;
        var matches;
        var charge = 0;		// Is overriden by charge_given

        //  For example: Fe^2+
        if ((matches = formula.match(re_charged_plus))) {
            formula = matches[1];
            charge = (matches[3] === '+' ? parseInt(matches[2], 10) : -parseInt(matches[2], 10));
        }

        //  For example: Na^+ or Na+
        if ((matches = formula.match(re_charged))) {
            formula = matches[1];
            charge = (matches[2] === '+' ? 1 : -1);
        }

        charge = use_default(charge_given, charge);

        for (var n=0; n<formula.length; n++) {
            var chr = formula[n];

            rval = (/[0-9]/.test(chr) ? rval + '_' + chr : rval + chr);
        }

        switch (charge) {
        case 0:
        case null:
            break;
        case 1:
            rval += '^+';
            break;
        case -1:
             rval += '^-';
            break;
        default:
            if (charge > 1)
                rval += '^' + charge + '+';
            else
                rval += '^' + Math.abs(charge) + '-';
        }

        return rval;
    };

    /**
     *  Parse string representation of a chemical formula and return the
     *  partial elements amd. possibly, compounds.  Whether elements or
     *  compounds are returned depends on the use of brackets in the formula.
     *
     *  Examples: "NaCl" returns ["Na", "Cl"], but "Fe(OH)2" returns ["Fe",
     *  "(OH)2"].
     *
     *  @param {String} formula	Chemical formula in standard notation.
     *  @returns {Array} parts	Array of chemical elements and compounds
     */
    Formula.parts = function(formula) {
        var element = '[A-Z][a-z]*[0-9]*';
        var bracketed = '\\((' + element + ')+\\)[0-9]+';
        var part = '(' + bracketed + '|' + element + ')';
        var rval = [];

        while (true) {
            var matches = formula.match(part);
            
            if (!matches)
                break;

            var match = matches[0];

            rval.push(match);
            formula = formula.slice(match.length, formula.length);
        }

        return rval;
    };

    /**
     *  Parse string representation of a chemical formula and return the
     *  printable LaTeX representation.  See above for the syntax.
     *
     *  Example: 'O3' returns 'O_3'
     *
     *  @param {String} formula Chemical formula in standard notation.
     *  @param {Number} charge Optional charge (for ions)
     *  @returns {String} LaTeX LaTeX representation of the formula.
     */
    Formula.latex = function(formula, charge) {
        var atoms = {};
        var rval = '';
        var len = formula.length;

        charge = use_default(charge, 0);

        for (var n=0; n<len; n++) {
            var chr = formula[n];

            if (/[0-9]/.test(chr))
                rval = rval + '_' + chr;
            else
                rval = rval + chr;
        }

        if (charge === 0)
            return rval;

        if (charge === 0)
            return rval;
        if (charge === 1)
            return rval + '^{+}';
        if (charge === -1)
            return rval + '^{-}';
        if (charge > 1)
            return rval + '^{' + charge + '}';
        return rval + '^{' + Math.abs(charge) + '-}';
    };

    Formula.equation_parts = function(eq) {
        var regex;
        var match;
        var i;

        var regexs3 = 
            [ /^(.*) +\+ +(.*) +<> +(.*) *$/,
              /^(.*) *\+ *(.*) *<> *(.*) *$/,
              /^(.*) +\+ +(.*) +> +(.*) *$/,
              /^(.*) *\+ *(.*) *> *(.*) *$/
            ];

        for (i=0; i<regexs3.length; i++) {
            regex = regexs3[i];
            match = eq.match(regex);
            if (match)
                return [match[1], match[2], match[3]];
        }

        var regexs2 = 
            [ /^(.*) +\+ +(.*) *$/,
              /^(.*) *\+ *(.*) *$/
            ];

        for (i=0; i<regexs2.length; i++) {
            regex = regexs2[i];
            match = eq.match(regex);
            if (match)
                return [match[1], match[2]];
        }

        return null;
    };

    Formula.same_formula = function(a, b) {
        a = a.replace(/ /g, '');
        b = b.replace(/ /g, '');

        //  Same string
        if (a == b)	
            return true;

        var ua = Formula.undecorated(a);
        var ub = Formula.undecorated(b);

        if (ua == ub)
            return true;

        var pa = Formula.parts(ua);
        var pb = Formula.parts(ub);

        if (pa.length === 2 && pb.length === 2) {
            if (pa[0] === pb[1] && pa[1] === pb[0])
                return true;
        }
    };
}).call(this);
