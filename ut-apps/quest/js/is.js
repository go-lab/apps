/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        is.js
 *  Part of     Go-Lab utils
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     General (type) testing and goodies functions
 *  Works with  ECMAScript 5.1, nodejs
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     17/07/15  (Created)
 *		09/02/16  (Last modified)
 */

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = utils.is = utils.is || {};

    console.log('========== loading tools/track/js/is.js');

    /**
     *  Succeeds if the argument is an object.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when the argument is an object
     */
    is.object = function(obj) {
        return (obj !== null && typeof(obj) === 'object');
    };

    /**
     *  Succeeds if the argument is an array.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} 
     */
    is.array = function(obj) {
        if (Array.isArray)
            return Array.isArray(obj);
        return (Object.prototype.toString.call(obj) === '[object Array]');
    };

    /**
     *  Succeeds if the argument is an empty object ({}).
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} 
     */
    is.empty = function(obj) {
        if (!is.object(obj))
            return false;

        var keys = Object.keys(obj).length;

        return Object.keys(obj).length === 0;
    };

    /**
     *  Succeeds if the argument is not an empty object ({}).
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} 
     */
    is.not_empty = function(obj) {
        return !is.empty(obj);
    };

    /**
     *  Succeeds if the argument is a string.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a string
     */
    is.string = function(obj) {
        return typeof(obj) === 'string';
    };

    /**
     *  Succeeds if the argument is a number.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a number
     */
    is.number = function(obj) {
        return typeof(obj) === 'number';
    };

    /**
     *  Succeeds if the argument is an integer.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is an integer
     */
    is.integer = function(obj) {
        return typeof(obj) === 'number' &&
            isFinite(obj) && Math.floor(obj) === obj;
    };

    /**
     *  Succeeds if the argument is a non-negative integer.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a non-negative integer
     */
    is.non_negative_integer = function(obj) {
        return is.integer(obj) && obj >= 0;
    };

    /**
     *  Succeeds if the argument is a positive integer.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a positive integer
     */
    is.positive_integer = function(obj) {
        return is.integer(obj) && obj > 0;
    };

    /**
     *  Succeeds if the argument is a negative integer.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a negative integer
     */
    is.negative_integer = function(obj) {
        return is.integer(obj) && obj < 0;
    };

    /**
     *  Succeeds if the argument is a function.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a function
     */
    is.func = function(obj) {
        return typeof(obj) === 'function';
    };

    /**
     *  Succeeds if the argument is a boolean.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is a boolean
     */
    is.boolean = function(obj) {
        return typeof(obj) === 'boolean';
    };

    /**
     *  Succeeds if the argument is an array and does not contain elements.
     *
     *  @param {Object} obj - Anything
     *  @returns {Boolean} True when argument is an empty array
     */
    is.empty_array = function(obj) {
        return is.array(obj) && obj.length === 0;
    };

    /**
     *  Succeeds if we are running inside nodejs.
     *
     *  @returns {Boolean} True when we are running inside nodejs.
     */
    is.in_nodejs = function() {
        return (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined');
    };

    /**
     *  Returns a new string in which whitespace has been normalized (initial,
     *  and trailing spaces removed, and double spaces collapsed to a single
     *  space).
     *
     *  @param {String} String - String
     *  @returns {String} String - With normalized spacing
     */
    is.normalize_whitespace = function(str) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");
    };

    is.sort_by_length = function(array, key) {
        if (key === undefined)
            array.sort(function(a,b) {
                if (a.length < b.length)
                    return -1;
                if (a.length > b.length)
                    return 1;
                return 0;
            });
        else
            array.sort(function(a,b) {
                if (a[key].length < b[key].length)
                    return -1;
                if (a[key].length > b[key].length)
                    return 1;
                return 0;
            });
    };

    is.sort_by_key = function(array, key) {
        array.sort(function(a,b) {
            if (a[key] < b[key])
                return -1;
            if (a[key] > b[key])
                return 1;
            return 0;
        });
    };

    if (is.in_nodejs()) {
        module.exports = is;
    }

}).call(this);
