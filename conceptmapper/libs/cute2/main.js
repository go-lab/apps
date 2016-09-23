/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	main.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Define kernel
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		20/11/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Cute
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function () {
    var cute = this.cute = {
        version: "Dec  5 2014" + ' ' + "17:55:38",
        author: 'Anjo Anjewierden',
        email: 'a.a.anjewierden@utwente.nl',

        ctx: null,
        add_ons: {},
    };

    cute.delete_element = function(array, elem) {
        for (var i=0; i<array.length;) {
            if (array[i] === elem) {
                array.splice(i, 1);
                continue;
            }
            i++;
        }
    };

}).call(this);
