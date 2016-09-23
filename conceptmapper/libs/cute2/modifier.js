/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	modifier.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Modified
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		17/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Modifier
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Modifier = cute.Modifier = function(shift, control, meta) {
        var m = this;

        if (typeof(shift) == 'string')
            m.convert(shift);
        else {
            m._shift = shift || false;
            m._control = control || false;
            m._meta = meta || false;
        }

        return m;
    }

    Modifier.prototype.convert = function(str) {
        var m = this;

        m._shift = false;
        m._control = false;
        m._meta = false;
        for (var i=0; i<str.length; i++)
            switch (str[i]) {
            case 's': m._shift = true; break;
            case 'c': m._control = true; break;
            case 'm': m._meta = true; break;
            }
        return this;
    }

    Modifier.prototype.shift = function(val) {
        if (val === undefined)
            return m._shift;
        m._shift = val;
        return this;
    }

    Modifier.prototype.control = function(val) {
        if (val === undefined)
            return m._control;
        m._control = val;
        return this;
    }

    Modifier.prototype.meta = function(val) {
        if (val === undefined)
            return m._meta;
        m._meta = val;
        return this;
    }
}).call(this);
