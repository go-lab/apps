/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
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

    console.log('========== loading libs/expression/js/unit_test.js');

    function check(ex, out) {
        console.log('check ' + ex);
        try {
            if (ex === out)
                return;
        } catch(e) {
            console.log('calling failed');
            console.log(ex);
        }
        console.log('check failed');
        console.log('  in  - ' + ex);
        console.log('  out - ' + out);
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

    console.log('UNIT TEST FINISHED');

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
        pow_1_2, // 7
        sqrt_4, // 8
        eq_a_1, // 9
        sin_1, // 10
        cos_1, // 11
        tan_1 // 12
    ];

    UnitTest.test_printing_precedence = function() {
        var prec1 = add(1, multiply(5,3));
        var prec2 = multiply(add(1,5), 3);

        console.log('1 value  ' + prec1.evaluate());
        console.log('  string ' + prec1.toString());
        console.log('2 value  ' + prec2.evaluate());
        console.log('  string ' + prec2.toString());
    };

    UnitTest.toString = function() {
        console.log('----------------- TESTING  .toString() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];

            console.log(i + ': ' + eq.toString());
        }
        console.log('----------------- END TEST .toString() ---------------');
    };

    UnitTest.latex = function() {
        console.log('----------------- TESTING  .latex() ---------------');
        console.log('\\begin{tabular}{l l} \\\\');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];

            console.log('\\verb@' + eq + '@ & ' + eq.latex('$') + ' \\\\');
        }
        console.log('\\end{tabular}');
        console.log('----------------- END TEST .latex() ---------------');
    };

    UnitTest.copy = function() {
        console.log('----------------- TESTING  .copy() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            copy = eq.copy();

            console.log(i + ': ' + eq.toString() + ' @ ' + copy.toString());
        }
        console.log('----------------- END TEST .copy() ---------------');
    };

    UnitTest.equal = function() {
        console.log('----------------- TESTING  .equal() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            copy = eq.copy();
            var bool = eq.equal(copy);

            console.log(i + ': ' + eq.toString() + ' ' + bool);
        }
        console.log('----------------- END TEST .equal() ---------------');
    };

    UnitTest.evaluate = function() {
        console.log('----------------- TESTING  .evaluate() ---------------');
        for (i=0; i<equations.length; i++) {
            eq = equations[i];
            var value = eq.evaluate();

            console.log(i + ': ' + eq.toString() + ' ----> ' + value);
        }
        console.log('----------------- END TEST .evaluate() ---------------');
    };
    /**
     *  Either cut-and-paste this or use #include with cpp.
     */
    //  Base algebra
    function add() {
        var args = [];
        for (var i=0; i<arguments.length; i++) args[i] = arguments[i];
        return new timo.Add(args);
    }
    function multiply() {
        var args = [];
        for (var i=0; i<arguments.length; i++) args[i] = arguments[i];
        return new timo.Multiply(args);
    }
    function subtract(lhs, rhs) { return new timo.Subtract(lhs, rhs); }
    function divide(lhs, rhs) { return new timo.Divide(lhs, rhs); }
    //  Unary algebra
    function minus(val) { return new timo.Minus(val); }
    function plus(val) { return new timo.Plus(val); }
    //  Extended algebra
    function fraction(lhs, rhs) { return new timo.Fraction(lhs, rhs); }
    function power(base, exp) { return new timo.Power(base,exp); }
    function sqrt(arg,deg) { return new timo.Sqrt(arg,deg); }
    function log(arg,base) { return new timo.Logarithm(arg,base); }
    //  Equals
    function equals(lhs, rhs) { return new timo.Equals(lhs, rhs); }
    function variable(s,spec) { return new timo.Variable(s,spec); }
    function handle(v) { return new timo.Handle(v); }
    //  Numbers
    function make_numerical(val) { return timo.make_numerical(val); }
    function numerical(val) { return new timo.Numerical(val); }
    function real(val) { return new timo.Real(val); }
    function irrational(val) { return new timo.Irrational(val); }
    function rational(val) { return new timo.Rational(val); }
    function integer(val) { return new timo.Integer(val); }
    //  Trigonometry
    function sin(arg) { return new timo.Sine(arg); }
    function cos(arg) { return new timo.Cosine(arg); }
    function tan(arg) { return new timo.Tangent(arg); }
    function constant(name) {
      if (is.object(name))
        return new timo.Constant(name);
      return timo.constants[name];
    }
    //  Logical variables
    function any(name) { return new timo.Any(name); }
    function any_numerical(name) { return new timo.AnyNumerical(name); }
    function any_real(name) { return new timo.AnyReal(name); }
    function any_integer(name) { return new timo.AnyInteger(name); }
    if (is.in_nodejs())
        module.exports = UnitTest;
}).call(this);
