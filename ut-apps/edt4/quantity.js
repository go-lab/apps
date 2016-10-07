/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        quantity.js
 *  Part of     General JavaScript library
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Handling quantities
 *  Works with  ECMAScript 5.1, js-quantities.js
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     10/11/14  (Created)
 *		01/05/15  (Last modified)
 */ 

/**
 *  This package is mainly a wrapper around the jq-quantities package (Qty):
 *  
 *    https://github.com/gentooboontoo/js-quantities/blob/master/README.md
 *
 *  Qty works really well when dealing with quantities, but the API is a
 *  little primitive.  This package addresses that.
 *
 *  Qty is also a little picky when both dimensionless and normal quantities
 *  are, for example, multiplied.  This package takes that into account.
 *
 *  A Quantity is defined to be a JavaScript object with a scalar and unit
 *  property.  You can define your own objects that act as quantities as long
 *  as it has these two properties.
 *
 *  A dimensionless quantity, a number, has unit: null.
 */
(function() {
    "use strict";
    this.ut = this.ut || {};
    this.ut.libs = this.ut.libs || {};
    var Qty = this.Qty;		// in libs/math/quantity.js
    var Quantity = this.ut.libs.quantity = this.ut.libs.quantity || {};

    var DIMENSIONLESS = null;

    /**
     *  Create a Quantity from a scalar and a unit.
     */
    Quantity.create = function(scalar, unit) {
        scalar = use_default(scalar, 1);
        unit = use_default(unit, DIMENSIONLESS);
        
        if (!isNumber(scalar))
            throw new QuantityError('First argument (scalar) not a number');

        if (!isString(unit) && unit !== DIMENSIONLESS)
            throw new QuantityError('Second argument (unit: ' + unit + ') not a string');

        return {
            scalar: scalar,
            unit: unit
        };
    };

    /**
     *  Pretty print.
     */
    Quantity.pp = function(q, label) {
        if (label)
            printf(label + ': ' + q.scalar + ' ' + q.unit);
        else
            printf('Quantity.pp: ' + q.scalar + ' ' + q.unit);
    };

    Quantity.copy = function(q) {
        var rval = {};

        for (var p in q) {
            var val = q[p];

            if (val && typeof(val) === 'object' && typeof(val.copy) === 'function')
                rval[p] = val.copy();
            else
                rval[p] = val;
        }

        return rval;
    };

    /**
     *  Multiply two quantities q1 and q2 and the outcome in result (can be undefined).
     *  The outcome of the multiplication is returned.
     */
    Quantity.multiply = function(q1, q2, result) {
        var qty1 = pack(q1);
        var qty2 = pack(q2);
        var tmp;

        result = use_default(result, Quantity.create());

        if (isNumber(qty1)) {
            if (isNumber(qty2)) {
                result.scalar = qty1 * qty2;
                result.unit = DIMENSIONLESS;

                return result;
            }
            tmp = qty2.mul(qty1);
        } else {
            if (isNumber(qty2))
                tmp = qty1.mul(qty2);
            else
                tmp = qty1.mul(qty2);
        }

        if (result.unit !== DIMENSIONLESS)
            tmp = tmp.to(result.unit);

        unpack(tmp, result);
        return result;
    };

    /**
     *  Add two quantities q1 and q2 and put the outcome in result.
     */
    Quantity.add = function(q1, q2, result) {
        var qty1 = pack(q1);
        var qty2 = pack(q2);

        result = use_default(result, Quantity.create());

        if (isNumber(qty1) && isNumber(qty2)) {
                result.scalar = qty1 + qty2;
                result.unit = DIMENSIONLESS;

                return result;
        }

        unpack(qty1.add(qty2), result);

        return result;
    };

    /**
     *  Subtract two quantities q1 and q2 and put the outcome in result.
     */
    Quantity.subtract = function(q1, q2, result) {
        var qty1 = pack(q1);
        var qty2 = pack(q2);

        result = use_default(result, Quantity.create());

        if (isNumber(qty1) && isNumber(qty2)) {
                result.scalar = qty1 - qty2;
                result.unit = DIMENSIONLESS;

                return result;
        }

        unpack(qty1.sub(qty2), result);

        return result;
    };

    /**
     *  Divide two quantities q1 and q2 and put the outcome in result.
     */
    Quantity.divide = function(q1, q2, result) {
        var qty1 = pack(q1);
        var qty2 = pack(q2);

        result = use_default(result, Quantity.create());

        if (isNumber(qty1) && isNumber(qty2)) {
            result.scalar = qty1 / qty2;
            result.unit = DIMENSIONLESS;

            return result;
        }

        unpack(qty1.div(qty2), result);

        return result;
    };

    /**
     *  Power, second argument is a number.
     */
    Quantity.power = function(q1, q2, result) {
        result = use_default(result, Quantity.create());

        var n1;
        var n2;
        var unit;

        if (isNumber(q1) && isNumber(q2)) {
            n1 = q1;
            n2 = q2;
            unit = DIMENSIONLESS;
        } else
            if (isNumber(q1)) {
                n1 = q1;
                n2 = q2.scalar;
                unit = q2.unit;
            } else
                if (isNumber(q2)) {
                    n1 = q1.scalar;
                    n2 = q2;
                    unit = q1.unit;
                } else
                    throw new QuantityError('At least one of the arguments needs be a number');

        result.scalar = Math.pow(n1, n2);
        result.unit = unit;

        return result;
    };

    Quantity.to = function(q, unit) {
        var qty = pack(q);

        qty = qty.to(unit);

        unpack(qty, q);

        return q;
    };

    /**
     *  Succeeds if argument is a quantity.
     */
    Quantity.isA = function(q) {
        return (typeof(q.scalar) !== 'undefined' && typeof(q.unit) !== 'undefined');
    };

    /**
     *  Convert quantity to HTML.
     *
     *  TBD - Under development.
     */
    Quantity.html = function(q, precision, unit_only) {
        var value = q.scalar;
        var str = q.unit;
        var times = '\u00D7';
        var division = /(.*)\/(.*)/;
        var parts;
        var unit;
        var rval;

        if ((parts=str.match(division))) {
            var l = exponent(parts[1]);
            var r = exponent(parts[2]);
            
            unit = l + '/' + r;
        } else
            unit = exponent(str);

        function exponent(str) {
            var res = str.split('^');

            if (res.length === 2) {
                return res[0] + '<sup>' + res[1] + '</sup>';
            }
            return str;
        }
        
        if (unit_only) {
            return unit;
        }

        if (typeof(value) !== 'number') 
            throw new QuantityError('Value not a number (' + value + ')');

        if (value === 0)
            return value.toFixed(Math.abs(precision)) + ' ' + unit;

        return value.toFixed(Math.abs(precision)) + ' ' + unit;
    };


    /**
     *  Pack.  Convert from our quantity to a Qty.
     */
    function pack(q) {
        if (isNumber(q))
            return q;

        mustScalar(q.scalar);
        mustUnit(q.unit);

        if (q.unit === undefined || q.unit === null || q.unit === '')
            return q.scalar;
        
        return new Qty(q.scalar + ' ' + q.unit);
    }

    /**
     *  Unpack.  Convert from a Qty to our quantity.
     */
    function unpack(qty, result) {
        var rval = qty.format(converter());

        result.scalar = rval.scalar;
        result.unit = rval.unit;
    }

    var converter = function() {
        return function(scalar, units) {
            return {
                scalar: scalar,
                unit: units
            };
        };
    };

    function mustScalar(x) {
        if (isNumber(x))
            return true;
        throw new QuantityError('Expecting a number (scalar: ' + x + ')');
    }

    function mustUnit(x) {
        if (isString(x) || x === DIMENSIONLESS)
            return true;
        throw new QuantityError('Expecting a string or null (unit: ' + x + ')');
    }

    function isNumber(x) {
        return typeof(x) === 'number';
    }

    function isString(x) {
        return typeof(x) === 'string';
    }

    /**
     * Custom error type definition
     * @constructor
     */
    function QuantityError() {
        var err;
        if(!this) { // Allows to instantiate QtyError without new()
            err = Object.create(QuantityError.prototype);
            QuantityError.apply(err, arguments);
            return err;
        }
        err = Error.apply(this, arguments);
        this.name = "QuantityError";
        this.message = err.message;
        this.stack = err.stack;
    }
    QuantityError.prototype = Object.create(Error.prototype, {constructor: { value: QuantityError }});
    Quantity.Error = QuantityError;
}).call(this);



