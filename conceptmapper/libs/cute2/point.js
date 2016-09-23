/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	point.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Point
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Point
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var sep;

    var Point = cute.Point = function(x, y) {
        this._x = (x === undefined ? 0 : x);
        this._y = (y === undefined ? 0 : y);

        return this;
    }

    Point.prototype.x = function(v0) { if (v0 === undefined) return this._x; this._x = v0; return this; };
    Point.prototype.y = function(v0) { if (v0 === undefined) return this._y; this._y = v0; return this; };

    Point.prototype.toString = function() {
        var pt = this;

        return 'cute.Point(' + pt._x + sep + pt._y + ')';
    }

    Point.prototype.equal = function(p) {
        return this._x === p._x && this._y === p._y;
    }

    Point.prototype.copy = function(p) {
        if (p) {
            this._x = p._x;
            this._y = p._y;
            return this;
        }
        return new Point(this._x, this._y);
    }

    Point.prototype.set = function(x, y) {
        if (x !== undefined) this._x = x;
        if (y !== undefined) this._y = y;

        return this;
    }

    Point.prototype.offset = function(x, y) {
        this._x += (x === undefined ? 0 : x);
        this._y += (y === undefined ? 0 : y);

        return this;
    }

    Point.prototype.difference = function(p) {
        return new Point(this._x - p._x, this._y - p._y);
    }

    Point.prototype.distance = function(p) {
        return geo.distance(this._x, this._y, p._x, p._y);
    }

    Point.prototype.mid_point = function(p) {
        return new Point((this._x+p._x+1)/2, (this._y+p._y+1)/2);
    }

    Point.prototype.plus = function(p) {
        this._x += p._x;
        this._y += p._y;
    }

    Point.prototype.minus = function(p) {
        this._x -= p._x;
        this._y -= p._y;
    }

    Point.prototype.mirror = function(p) {
        var mx = 0, my = 0;

        if (p !== undefined)
            mx = p._x, my = p._y;

        this._x = mx - p._x;
        this._y = my - p._y;

        return this;
    }
}).call(this);
