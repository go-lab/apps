/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        parse_number.js
 *  Part of     Javascript utilities
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Parse a string to a number
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     16/03/15  (Created)
 *		16/03/15  (Last modified)
 */

(function() {
    "use strict";

    /**
     *  Returns a floating point number from a string.  If the string contains
     *  decimal comma's, these are interpreted as decimal points.  An
     *  exception are constructs like '1,234.56' or '1.234,56' which are both
     *  interpreted as the number 1234.56.
     */
    String.prototype.parse_float = function() {
        var str = this.replace(/\s/g, ""); // 100 000 -> 100000
        var dot = str.indexOf(".");
        var comma = str.indexOf(",");

        if (dot >= 0 && comma >= 0) {
            if (dot < comma) { // 1.234,56
                str = str.replace(".", ""); // 1234,56
                str = str.replace(",", "."); // 1234.56
            } else { // 1,234.56
                str = str.replace(",", ""); // 1234.56
            }
        } else {
            if (comma >= 0) // 1234,56
                str = str.replace(",", "."); // 1234.56
        }

        return parseFloat(str);
    };

    String.prototype.parse_int = function() {
        var num = this.parse_float();

        return parseInt(num, 10);
    };

}).call(this);
