/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	device.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Device
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		17/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Device
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Device = cute.Device = function() {
        cute.Figure.call(this);
        return this;
    }

    { var F = function() {}; F.prototype = cute.Figure.prototype; Device.prototype = new F(); Device.prototype.constructor = Device; Device.superclass = cute.Figure.prototype; if (cute.Figure.prototype.constructor == Object.prototype.constructor) cute.Figure.prototype.constructor = cute.Figure; };;
}).call(this);
