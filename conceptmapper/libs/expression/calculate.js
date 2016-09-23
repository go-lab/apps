/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	calculate.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Calculus
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	16/10/15  (Created)
 *		20/11/15  (Last modified)
 */ 

(function() {
    "use strict";
 
    printf('========== loading libs/expression/js/calculate.js (naive implementations)');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));

    var Decimal = is.in_nodejs() ? require('../libs/decimal.min') : this.Decimal;
    var timo;
    var Calculate;
 
    if (is.in_nodejs()) {
        timo = require('./expression');
        Calculate = require('./calculate');
    } else {
        timo = libs.timo = libs.timo || {};
        Calculate = timo.calculate = {};
    }

    var pi;
    var pi2;
    var pi_half;
    var pi_32;

    var USE_BIG = false;

    /**
     *  @module Calculate
     *
     *  All calculations (with real numbers) are found in this package.  The
     *  main reason is that there is a single location that needs to be
     *  changed when switching the number package (currently Decimal.js).
     *
     *  This package does not perform type-checking.  All type checking should
     *  be done by the caller (mostly expression.js).
     *
     *  @author Anjo Anjewierden, a.a.anjewierden@utwente.nl
     */

    var num = Calculate.Number = function(value) {
        if (USE_BIG)
            return new Decimal(value);
        if (is.string(value))
            return parseFloat(value);
        return value;
    };

    Calculate.BigNumber = function(value) {
        return new Decimal(value);
    };

    var ZERO = num(0);
    var ONE = num(1);

    is.BigNumber = function(obj) {
        return obj instanceof Decimal;
    };

    Calculate.isInteger = function(num) {
        if (USE_BIG)
            return num.isInt();
        return Math.floor(num) === num;
    };

    Calculate.add = function(a, b) {
        if (USE_BIG)
            return a.plus(b);
        return a + b;
    };

    Calculate.subtract = function(a, b) {
        if (USE_BIG)
            return a.minus(b);
        return a - b;
    };

    Calculate.divide = function(a, b) {
        if (USE_BIG)
            return a.div(b);
        return a / b;
    };

    Calculate.multiply = function(a, b) {
        if (USE_BIG)
            return a.times(b);
        return a * b;
    };

    Calculate.power = function(a, b) {
        if (USE_BIG)
            return a.pow(b);
        return Math.pow(a, b);
    };

    Calculate.minus = function(a) {
        if (USE_BIG)
            return a.neg();
        return -a;
    };

    Calculate.equal = function(a, b) {
        if (USE_BIG)
            return a.eq(b);
        return a === b;
    };

    Calculate.sqrt = function(a, degree) {
        if (USE_BIG) {
            if (degree === 2)
                return a.sqrt();
            return a.power(1/degree);
        }
        if (degree === 2)
            return Math.sqrt(a);
        return Math.pow(a, 1/degree);
    };

    Calculate.gcd = function(a, b) {
        if (USE_BIG) {
            while (!b.isZero()) {
                var t = b;
                b = a.mod(b);
                a = t;
            }
            return a;
        }
        while (b > 0) {
            var t2 = b;
            b = a % b;
            a = t2;
        }
        return a;
    };

    Calculate.PI = function() {
        if (USE_BIG)
            return num('3.14159265358979323846264338327950288419716939937510');
        return Math.PI;
    };

    Calculate.E = function() {
        if (USE_BIG)
            return num('2.71828182845904523536028747135266249775724709369995');
        return Math.E;
    };

    Calculate.degree = function() {
        if (USE_BIG)
            return Calculate.PI().div(180);
        return Calculate.PI() / 180;
    };

    Calculate.native = function(n) {
        if (is.number(n))
            return n;
        if (is.BigNumber(n))
            return parseFloat(n.valueOf());
    };

    Calculate.nativeInteger = function(n) {
        if (is.number(n))
            return Math.floor(n);
        if (is.BigNumber(n))
            return Math.floor(n.valueOf());
    };

    Calculate.factorial = function(a) {
        var value = ONE;
        var n = num(a);

        while (n.gt(1)) {
            value = value.times(n);
            n = n.minus(1);
        }
        return value;
    };

    Calculate.arctangent = function(bn) {
        var value = num(bn);
        var s = -1;

        for (var p=3; p<10000; p+=2) {
            var term = bn.pow(p).div(p);
            value = (s > 0 ? value.plus(term) : value.minus(term));
            s = -s;
        }

        printf('arctan ' + bn);
        printf('  ' + value);
        printf('Math.atan ' + Math.atan(bn.valueOf()));

        return value;
    };

    Calculate.in_range = function(bn, min, max, diff) {
        var factor;

        if (bn.lt(min)) {
//            factor = floor((min - bn) / diff);
            factor = num(min).minus(bn).div(diff).floor();

            if (factor.isZero())
                factor = num(1);

            return Calculate.in_range(bn.plus(factor.times(diff)), min, max, diff);
        }
        if (bn.gt(max)) {
            //factor = floor(bn - max) / diff;
            factor = bn.minus(max).div(diff).floor();
            
            if (factor.isZero())
                factor = num(1);

            return Calculate.in_range(bn.minus(factor.times(diff)), min, max, diff);
        }

        return bn;
    };

    Calculate.minimum = function(a, b) {
        return Decimal.min(a, b);
    };

    Calculate.maximum = function(a, b) {
        return Decimal.max(a, b);
    };

    /**
     *
     */
    Calculate.sine = function(bn, fast) {
        if (!USE_BIG)
            return Math.sin(bn);
        if (fast)
            return Math.sin(bn.toValue());
        var angle = Calculate.in_range(bn, 0, pi2, pi2);
        var neg = false;
        
        if (angle.gt(pi)) {
            neg = true;
            angle = angle.minus(pi);
        }

        if (angle.lt(pi_half)) {
            if (neg)
                return sine(angle).neg();
            else
                return sine(angle);
        }

        if (neg) 
            return sine(pi.minus(angle)).neg();
        return sine(pi.minus(angle));

        function sine(angle, iterations) {
            iterations = use_default(iterations, 20);
            var value = angle;
            var s = -1;
            var numerator = angle.pow(3);
            var denominator = Calculate.factorial(num(3));

            for (var p=3; p<iterations; p+=2) {
                var term = numerator.div(denominator);
                value = (s > 0 ? value.plus(term) : value.minus(term));
                s = -s;
                numerator = numerator.times(angle).times(angle);
                denominator = denominator.times(p+1).times(p+2);
            }
            return value;
        }
    };

    Calculate.cosine = function(bn) {
        if (!USE_BIG)
            return Math.cos(bn);

        var value = num(1);
        var s = -1;

        for (var p=2; p<10; p+=2) {
            var term = bn.pow(p).div(Calculate.factorial(num(p)));
            value = (s > 0 ? value.plus(term) : value.minus(term));
            s = -s;
        }

        printf('cosine ' + bn);
        printf('  ' + value);
        printf('math.cos ' + Math.cos(bn.valueOf()));

        return value;
    };

    Calculate.logarithm = function(bn, base) {
        // TBD - Calculate.logarithm base not used
        if (!USE_BIG) {
            return Math.log(bn);
        }
        var value = num(0);
        var x1 = Calculate.minus(bn, 1).div(bn);
        var one = num(1);

        for (var p=1; p<100; p+=1) {
            var term = x1.pow(p).times(one.div(p));
            value = value.plus(term);
        }

        return value;
    };

    Calculate.tangent = function(bn) {
        if (!USE_BIG)
            return Math.tan(bn);

        var sin = Calculate.sine(bn);
        var cos = Calculate.cosine(bn);

        if (cos.isZero())
            return NaN;

        var value = sin.div(cos);

        return value;
    };

    function init_constants() {
        pi = Calculate.PI();
        pi2 = Calculate.multiply(pi, 2);
        pi_half = Calculate.divide(pi, 2);
        pi_32 = Calculate.add(pi, pi_half);
    }

    init_constants();

    if (is.in_nodejs())
        module.exports = Calculate;
}).call(this);
