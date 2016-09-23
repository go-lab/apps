/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	unit_test.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Unit tests
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	03/10/15  (Created)
 *		21/11/15  (Last modified)
 */ 

(function() {
    "use strict";
 
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = (libs.timo || require('./expression'));
    var Rules = (timo.rules || require('./rules'));
    var UnitTest = timo.UnitTest = {};

    printf('========== loading libs/expression/js/unit_test.js');

    function check(ex, out) {
        printf('check ' + ex);
        try {
            if (ex === out)
                return;
        } catch(e) {
            printf('calling failed');
            printf(ex);
        }
        printf('check failed');
        printf('  in  - ' + ex);
        printf('  out - ' + out);
    }

    check(add(1,2).class_name(), 'Add');
    check(multiply(1,2).class_name(), 'Multiply');
    check(subtract(1,2).class_name(), 'Subtract');
    check(divide(1,2).class_name(), 'Divide');
    check(fraction(1,2).class_name(), 'Fraction');
    check(minus(1,2).class_name(), 'Minus');
    check(plus(1,2).class_name(), 'Plus');
    check(power(1,2).class_name(), 'Power');
    check(sqrt(1).class_name(), 'Sqrt');
    check(log(1).class_name(), 'Logarithm');
    check(equals(1,2).class_name(), 'Equals');
    check(variable('a').class_name(), 'Variable');
    check(handle(variable('a')).class_name(), 'Handle');
    check(numerical(1).class_name(), 'Numerical');
    check(real(1).class_name(), 'Real');
    check(irrational(1).class_name(), 'Irrational');
    check(rational(1).class_name(), 'Rational');
    check(integer(1).class_name(), 'Integer');
    check(sin(1).class_name(), 'Sine');
    check(cos(1).class_name(), 'Cosine');
    check(tan(1).class_name(), 'Tangent');
    check(constant({symbol: '1', value: 1}).class_name(), 'Constant');
    check(any(1).class_name(), 'Any');
    check(any_numerical(1).class_name(), 'AnyNumerical');
    check(any_real(1).class_name(), 'AnyReal');
    check(any_integer(1).class_name(), 'AnyInteger');

    printf('UNIT TEST FINISHED');

    return;


    var add_1 = equals(add('a',0), 'a');
    var add_2 = equals(add('a','a'), multiply(2,'a'));
    var sub_1 = equals(subtract('a',0), 'a');
    var mul_1 = equals(multiply('a',1), 'a');
    var mul_2 = equals(multiply('a',0), 0);
    var div_1 = equals(divide('a', 1), 'a');
    var div_2 = equals(divide('a', 'a'), 1);
    var frac_1 = equals(add(fraction(1, 'a'), fraction(2, 'a')), fraction(3,'a'));
    var min_1 = equals(minus(minus('a')), 'a');
    var plus_1 = equals(plus('a'), 'a');

    var pow_1_2 = power(1, 2);
    var sqrt_4 = sqrt(4);
    var eq_a_1 = equals('a',1);
    var sin_1 = sin(1);
    var cos_1 = cos(1);
    var tan_1 = tan(1);
    var eq, copy;
    var i;

    var equations = [
        add_1,
        add_2,
        sub_1,
        mul_1,
        mul_2,
        div_1,
        div_2,
        frac_1,
        min_1,
        plus_1,
        pow_1_2,	// 7
        sqrt_4,		// 8
        eq_a_1,		// 9
        sin_1,		// 10
        cos_1,		// 11
        tan_1		// 12
    ];

    UnitTest.test_printing_precedence = function() {
        var prec1 = add(1, multiply(5,3));
        var prec2 = multiply(add(1,5), 3);

        printf('1 value  ' + prec1.evaluate());
        printf('  string ' + prec1.toString());
        printf('2 value  ' + prec2.evaluate());
        printf('  string ' + prec2.toString());
    };

    UnitTest.toString = function() {
        printf('----------------- TESTING  .toString() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];

            printf(i + ': ' + eq.toString());
        }
        printf('----------------- END TEST .toString() ---------------');
    };

    UnitTest.latex = function() {
        printf('----------------- TESTING  .latex() ---------------');
        printf('\\begin{tabular}{l l} \\\\');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            
            printf('\\verb@' + eq + '@ & ' + eq.latex('$') + ' \\\\');
        }
        printf('\\end{tabular}');
        printf('----------------- END TEST .latex() ---------------');
    };

    UnitTest.copy = function() {
        printf('----------------- TESTING  .copy() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            copy = eq.copy();

            printf(i + ': ' + eq.toString() + ' @ ' + copy.toString());
        }
        printf('----------------- END TEST .copy() ---------------');
    };

    UnitTest.equal = function() {
        printf('----------------- TESTING  .equal() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            copy = eq.copy();
            var bool = eq.equal(copy);

            printf(i + ': ' + eq.toString() + ' ' + bool);
        }
        printf('----------------- END TEST .equal() ---------------');
    };

    UnitTest.evaluate = function() {
        printf('----------------- TESTING  .evaluate() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            var value = eq.evaluate();

            printf(i + ': ' + eq.toString() + ' ----> ' + value);
        }
        printf('----------------- END TEST .evaluate() ---------------');
    };

#include "shorthands.h"

    if (is.in_nodejs())
        module.exports = UnitTest;

}).call(this);
