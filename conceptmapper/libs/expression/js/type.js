/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	type.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Number types (like rational)
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		05/11/15  (Last modified)
 */
(function() {
    "use strict";
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = (libs.timo || require('./expression.js'));

    var type = timo.type = timo.type || {};

    console.log('========== loading libs/expression/js/types.js');

    var Base;
    var Natural;
    var Integer;
    var Rational;
    var Real;
    var Complex;
    var Irrational;
    var Whole;
    var Prime;

    Base = type.Base = function(spec) {
        for (var p in spec)
            this[p] = spec[p];
    };

    Natural = type.Natural = function() {
        Base.call({
            description: 'All counting numbers: 0, 1, ...',
            symbol: 'N',
            html: '<b>N</b>',
            latex: '\\mathbb{N}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Natural.prototype = new F(); Natural.prototype.constructor = Natural; Natural.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Integer = type.Integer = function() {
        Base.call({
            description: 'All positive and negative numbers including 0.',
            symbol: 'Z',
            html: '<b>Z</b>',
            latex: '\\mathbb{Z}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Integer.prototype = new F(); Integer.prototype.constructor = Integer; Integer.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Rational = type.Rational = function() {
        Base.call({
            description: 'A number that can be represented as a fraction of integers.',
            symbol: 'Q',
            html: '<b>Q</b>',
            latex: '\\mathbb{Q}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Rational.prototype = new F(); Rational.prototype.constructor = Rational; Rational.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Real = type.Real = function() {
        Base.call({
            description: 'All measurable numbers.',
            symbol: 'R',
            html: '<b>R</b>',
            latex: '\\mathbb{R}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Real.prototype = new F(); Real.prototype.constructor = Real; Real.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Complex = type.Complex = function() {
        Base.call({
            description: 'Complex numbers.',
            symbol: 'C',
            html: '<b>C</b>',
            latex: '\\mathbb{C}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Complex.prototype = new F(); Complex.prototype.constructor = Complex; Complex.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Irrational = type.Irrational = function() {
        Base.call({
            description: 'Irrational numbers.',
            symbol: 'I',
            html: '<b>I</b>',
            latex: '\\mathbb{I}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Irrational.prototype = new F(); Irrational.prototype.constructor = Irrational; Irrational.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Whole = type.Whole = function() {
        Base.call({
            description: 'Whole numbers.',
            symbol: 'W',
            html: '<b>W</b>',
            latex: '\\mathbb{W}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Whole.prototype = new F(); Whole.prototype.constructor = Whole; Whole.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Prime = type.Prime = function() {
        Base.call({
            description: 'Whole numbers.',
            symbol: 'P',
            html: '<b>P</b>',
            latex: '\\mathbb{P}'
        });
    };

    { var F = function() {}; F.prototype = Base.prototype; Prime.prototype = new F(); Prime.prototype.constructor = Prime; Prime.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    if (is.in_nodejs())
        module.exports = timo.type;
}).call(this);
