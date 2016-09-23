/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	click_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ClickGesture
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */


/*------------------------------------------------------------
 *  Class cute.ClickGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var geo = this.geo;

    var ClickGesture = cute.ClickGesture = function() {
        var g = this;

        cute.Gesture.call(g);
        g._offset = new cute.Point(0,0);
        g._event = null;
        g._receiver = null;
        g._max_drag_distance = 5;

        return this;
    }

    { var F = function() {}; F.prototype = cute.Gesture.prototype; ClickGesture.prototype = new F(); ClickGesture.prototype.constructor = ClickGesture; ClickGesture.superclass = cute.Gesture.prototype; if (cute.Gesture.prototype.constructor == Object.prototype.constructor) cute.Gesture.prototype.constructor = cute.Gesture; };;

    ClickGesture.prototype.toString = function() {
        var g = this;
        return "ClickGesture(" + g._offset._x + ", " + g._offset._y + ")";
    }


    ClickGesture.prototype.event = function(ev, gr) {
        var g = this;

        g._receiver = gr;
        if (g.initiate(ev)) {
            ev._gesture = g;
            return true;
        }
        return false;
    }


    ClickGesture.prototype.initiate = function(ev) {
        var g = this;
        var gr = ev._receiver;

        if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
            g._offset._x = ev._x;
            g._offset._y = ev._y;
            g._initial_x = ev._receiver._area._x;
            g._initial_y = ev._receiver._area._y;

            return true;
        }

        return false;
    }


    ClickGesture.prototype.verify = function(ev) {
        return true;
    }


    ClickGesture.prototype.drag = function(ev) {
        var g = this;
        var dx = ev._x - g._offset._x;
        var dy = ev._y - g._offset._y;
        var gr = g._receiver;

        if (geo.distance(ev._x, ev._y, g._offset._x, g._offset._y) > g._max_drag_distance) {
            ev._gesture = null;
            return true;
        }

        return true;
    }


    ClickGesture.prototype.terminate = function(ev) {
        var g = this;
        var gr = g._receiver;

        if (gr.on_click) {
            if (gr.on_click(ev._x, ev._y))
                ev._device.modified();
        }
        return g;
    }
}).call(this);
