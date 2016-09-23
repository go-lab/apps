/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	quantities.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Quantities, units and dimensions
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	24/10/15  (Created)
 *		24/10/15  (Last modified)
 */
(function() {
    "use strict";
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = libs.timo = (libs.timo || require('./expression'));

    var Unit = timo.Unit = function(spec) {
        if (is.object()) {
            this.name = spec.name;
            this.symbol = spec.symbol;
            this.label = spec.label || spec.name;
            return this;
        }
        if (is.string()) {
        }
    };


    /*------------------------------------------------------------
     *  Quantities
     *------------------------------------------------------------*/

    var Quantity = timo.Quantity = function(value, unit) {
        this.value = (value === null ? null : timo.make_numerical(value));
        this.unit = new Unit(unit);
    };

    Quantity.prototype.toString = function() {
        return this.value.toString() + ' ' + this.unit;
    };

    Quantity.prototype.copy = function() {
        return new Quantity(this.value, this.unit);
    };

    Quantity.prototype.unknown = function() {
        return this.value === null;
    }

    Quantity.prototype.coerce = function(q) {
        if (q instanceof Quantity)
            return q;
        if (typeof(q) === 'number')
            return new Quantity({value: q});
        return null;
    }


    /*------------------------------------------------------------
     *  Base units
     *------------------------------------------------------------*/

    var BaseUnit = timo.Unit = function(spec) {
        var unit = this;

        unit.name = spec.name;
        unit.label = spec.label;
        unit.symbol = spec.symbol;
        unit.definition = spec.definition || '';

        return unit;
    }

    { var F = function() {}; F.prototype = Unit.prototype; BaseUnit.prototype = new F(); BaseUnit.prototype.constructor = BaseUnit; BaseUnit.superclass = Unit.prototype; if (Unit.prototype.constructor == Object.prototype.constructor) Unit.prototype.constructor = Unit; };;

    var DerivedUnit = timo.DerivedUnit = function(spec) {
        var unit = this;

        BaseUnit.call(unit, spec);

        unit.expression = spec.expression;

        return unit;
    };

    { var F = function() {}; F.prototype = BaseUnit.prototype; DerivedUnit.prototype = new F(); DerivedUnit.prototype.constructor = DerivedUnit; DerivedUnit.superclass = BaseUnit.prototype; if (BaseUnit.prototype.constructor == Object.prototype.constructor) BaseUnit.prototype.constructor = BaseUnit; };;

    /*------------------------------------------------------------
     *  Prefixes for units
     *------------------------------------------------------------*/

    var PrefixUnit = timo.PrefixUnit = function(spec) {
        var pref = this;

        pref.name = spec.name;
        pref.label = spec.label;
        pref.symbol = spec.symbol;
        pref.factor = spec.factor;

        return pref;
    };


 // Define the base prefixes
    function define_base_prefixes() {
        timo.prefix.deca = new PrefixUnit(
            { name: 'deca',
              symbol: 'de',
              factor: 10
            });
        timo.prefix.hecto = new PrefixUnit(
            { name: 'hecto',
              symbol: 'h',
              factor: 100
            });
        timo.prefix.kilo = new PrefixUnit(
            { name: 'kilo',
              symbol: 'k',
              factor: 1000
            });
        timo.prefix.mega = new PrefixUnit(
            { name: 'mega',
              symbol: 'M',
              factor: 10E6
            });
        timo.prefix.giga = new PrefixUnit(
            { name: 'giga',
              symbol: 'G',
              factor: 10E9
            });
        timo.prefix.tera = new PrefixUnit(
            { name: 'tera',
              symbol: 'G',
              factor: 10E12
            });
        timo.prefix.peta = new PrefixUnit(
            { name: 'peta',
              symbol: 'P',
              factor: 10E15
            });
        timo.prefix.exa = new PrefixUnit(
            { name: 'peta',
              symbol: 'E',
              factor: 10E18
            });
        timo.prefix.zetta = new PrefixUnit(
            { name: 'zetta',
              symbol: 'E',
              factor: 10E21
            });
        timo.prefix.yotta = new PrefixUnit(
            { name: 'yotta',
              symbol: 'E',
              factor: 10E24
            });
        timo.prefix.deci = new PrefixUnit(
            { name: 'deci',
              symbol: 'd',
              factor: 10E-1
            });
        timo.prefix.centi = new PrefixUnit(
            { name: 'centi',
              symbol: 'c',
              factor: 10E-2
            });
        timo.prefix.milli = new PrefixUnit(
            { name: 'milli',
              symbol: 'm',
              factor: 10E-3
            });
        timo.prefix.micro = new PrefixUnit(
            { name: 'micro',
              symbol: '\u00B5',
              factor: 10E-6
            });
        timo.prefix.nano = new PrefixUnit(
            { name: 'nano',
              symbol: 'n',
              factor: 10E-9
            });
        timo.prefix.pico = new PrefixUnit(
            { name: 'pico',
              symbol: 'p',
              factor: 10E-12
            });
        timo.prefix.femto = new PrefixUnit(
            { name: 'femto',
              symbol: 'f',
              factor: 10E-15
            });
        timo.prefix.atto = new PrefixUnit(
            { name: 'atto',
              symbol: 'a',
              factor: 10E-18
            });
        timo.prefix.zepto = new PrefixUnit(
            { name: 'zepto',
              symbol: 'z',
              factor: 10E-21
            });
        timo.prefix.yocto = new PrefixUnit(
            { name: 'yocto',
              symbol: 'y',
              factor: 10E-24
            });
    }

    var Dimension = timo.Dimension = function(spec) {
        this.name = spec.name;
        this.unit = spec.unit;
    };

    var Dimensions = timo.Dimensions = {
        length: new Dimension({
            name: 'length',
            unit: 'meter'
        }),
        time: new Dimension({
            name: 'time',
            unit: 'second'
        }),
        mass: new Dimension({
            name: 'mass',
            unit: 'kilogram'
        }),
        temperature: new Dimension({
            name: 'temperature',
            unit: 'kelvin'
        }),
        'electric current': new Dimension({
            name: 'electric current',
            base: 'ampere'
        }),
        'luminous intensity': new Dimension({
            name: 'luminous intensity',
            base: 'candela'
        }),
        'amount of substance': new Dimension({
            name: 'amount of substance',
            base: 'mole'
        })
    };


    if (is.in_nodejs())
        module.exports = timo;
}).call(this);
