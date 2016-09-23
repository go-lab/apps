/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        symbols.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Symbols (LaTeX, unicode)
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     22/11/15  (Created)
 *		22/11/15  (Last modified)
 */
(function() {
    "use strict";
    console.log('========== loading libs/expression/js/symbols.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));

    var timo = (libs.timo || require('./expression'));
    var Symbols = timo.symbols = timo.symbols || {};

    if (is.in_nodejs())
        module.exports = Symbols;

    Symbols.greek = {
        alpha: {
            latex: '\\alpha',
            unicode: '\u03B1'
        },
        beta: {
            latex: '\\beta',
            unicode: '\u03B2'
        },
        gamma: {
            latex: '\\gamma',
            unicode: '\u03B3'
        },
        delta: {
            latex: '\\delta',
            unicode: '\u03B4'
        },
        epsilon: {
            latex: '\\epsilon',
            unicode: '\u03B5'
        },
        zeta: {
            latex: '\\zeta',
            unicode: '\u03B6'
        },
        eta: {
            latex: '\\eta',
            unicode: '\u03B7'
        },
        theta: {
            latex: '\\theta',
            unicode: '\u03B8'
        },
        iota: {
            latex: '\\iota',
            unicode: '\u03B9'
        },
        kappa: {
            latex: '\\kappa',
            unicode: '\u03BA'
        },
        lambda: {
            latex: '\\lambda',
            unicode: '\u03BB'
        },
        mu: {
            latex: '\\mu',
            unicode: '\u03BC'
        },
        nu: {
            latex: '\\nu',
            unicode: '\u03BD'
        },
        xi: {
            latex: '\\xi',
            unicode: '\u03BE'
        },
        pi: {
            latex: '\\pi',
            unicode: '\u03C0'
        },
        rho: {
            latex: '\\rho',
            unicode: '\u03C1'
        },
        sigma: {
            latex: '\\sigma',
            unicode: '\u03C3'
        },
        tau: {
            latex: '\\tau',
            unicode: '\u03C4'
        },
        upsilon: {
            latex: '\\upsilon',
            unicode: '\u03C5'
        },
        phi: {
            latex: '\\phi',
            unicode: '\u03C6'
        },
        chi: {
            latex: '\\chi',
            unicode: '\u03C7'
        },
        psi: {
            latex: '\\psi',
            unicode: '\u03C8'
        },
        omega: {
            latex: '\\omega',
            unicode: '\u03C9'
        },
        Alpha: {
            latex: 'A',
            unicode: '\u0391'
        },
        Beta: {
            latex: 'B',
            unicode: '\u0392'
        },
        Gamma: {
            latex: '\\Gamma',
            unicode: '\u0393'
        },
        Delta: {
            latex: '\\Delta',
            unicode: '\u0394'
        },
        Epsilon: {
            latex: 'E',
            unicode: '\u0395'
        },
        Zeta: {
            latex: 'Z',
            unicode: '\u0396'
        },
        Eta: {
            latex: 'H',
            unicode: '\u0397'
        },
        Theta: {
            latex: '\\Theta',
            unicode: '\u0398'
        },
        Iota: {
            latex: 'I',
            unicode: '\u0399'
        },
        Kappa: {
            latex: 'K',
            unicode: '\u039A'
        },
        Lambda: {
            latex: '\\Lambda',
            unicode: '\u039B'
        },
        Mu: {
            latex: 'M',
            unicode: '\u039C'
        },
        Nu: {
            latex: 'N',
            unicode: '\u039D'
        },
        Xi: {
            latex: '\\Xi',
            unicode: '\u039E'
        },
        Pi: {
            latex: '\\Pi',
            unicode: '\u03A0'
        },
        Rho: {
            latex: 'P',
            unicode: '\u03A1'
        },
        Sigma: {
            latex: '\\Sigma',
            unicode: '\u03A3'
        },
        Tau: {
            latex: 'T',
            unicode: '\u03A4'
        },
        Upsilon: {
            latex: '\\Upsilon',
            unicode: '\u03A5'
        },
        Phi: {
            latex: '\\Phi',
            unicode: '\u03A6'
        },
        Chi: {
            latex: 'X',
            unicode: '\u03A7'
        },
        Psi: {
            latex: '\\Psi',
            unicode: '\u03A8'
        },
        Omega: {
            latex: '\\Omega',
            unicode: '\u03A9'
        }
    };
}).call(this);
