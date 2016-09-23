/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	goodies.js
 *  Part of	JavaScript
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Goodies for JavaScript
 *  Works with	Ecmascript 5.1
 *  
 *  Notice	Copyright (c) 2013, 2014  University of Twente
 *  
 *  History	16/04/13  (Created)
 *  		11/09/14  (Last modified)
 */ 

/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/

"use strict";

(function() {
    this.ut = this.ut || {};
    this.ut.commons = this.ut.commons || {};
    var utils = this.ut.commons.utils = this.ut.commons.utils || {};

    if (typeof(utils.capitalize) === 'undefined') {
        utils.capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
    }

    if (typeof(utils.random_element) === 'undefined') {
        utils.random_element = function(array) {
            return array[Math.floor(Math.random() * array.length)];
        };
    }

    if (typeof(utils.member) === 'undefined') {
        utils.member = function(array, elem) {
            return array.indexOf(elem) !== -1;
        };
    }

    if (typeof(utils.delete_element) === 'undefined') {
        utils.delete_element = function(array, elem) {
            for (var i=0; i<array.length;) {
                if (array[i] === elem) {
                    array.splice(i, 1);
                    continue;
                }
                i++;
            }
        };
    }
}).call(this);
