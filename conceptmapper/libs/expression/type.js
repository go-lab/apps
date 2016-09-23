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

    printf('========== loading libs/expression/js/types.js');

    var Base;
    var   Natural;
    var   Integer;
    var   Rational;
    var   Real;
    var   Complex;
    var   Irrational;
    var   Whole;
    var   Prime;

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

    extend(Natural, Base);

    Integer = type.Integer = function() {
        Base.call({
            description: 'All positive and negative numbers including 0.',
            symbol: 'Z',
            html: '<b>Z</b>',
            latex: '\\mathbb{Z}'
        });
    };

    extend(Integer, Base);

    Rational = type.Rational = function() {
        Base.call({
            description: 'A number that can be represented as a fraction of integers.',
            symbol: 'Q',
            html: '<b>Q</b>',
            latex: '\\mathbb{Q}'
        });
    };

    extend(Rational, Base);

    Real = type.Real = function() {
        Base.call({
            description: 'All measurable numbers.',
            symbol: 'R',
            html: '<b>R</b>',
            latex: '\\mathbb{R}'
        });
    };

    extend(Real, Base);

    Complex = type.Complex = function() {
        Base.call({
            description: 'Complex numbers.',
            symbol: 'C',
            html: '<b>C</b>',
            latex: '\\mathbb{C}'
        });
    };

    extend(Complex, Base);

    Irrational = type.Irrational = function() {
        Base.call({
            description: 'Irrational numbers.',
            symbol: 'I',
            html: '<b>I</b>',
            latex: '\\mathbb{I}'
        });
    };

    extend(Irrational, Base);

    Whole = type.Whole = function() {
        Base.call({
            description: 'Whole numbers.',
            symbol: 'W',
            html: '<b>W</b>',
            latex: '\\mathbb{W}'
        });
    };

    extend(Whole, Base);

    Prime = type.Prime = function() {
        Base.call({
            description: 'Whole numbers.',
            symbol: 'P',
            html: '<b>P</b>',
            latex: '\\mathbb{P}'
        });
    };

    extend(Prime, Base);

    if (is.in_nodejs())
        module.exports = timo.type;
}).call(this);
