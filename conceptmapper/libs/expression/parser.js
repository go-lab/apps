/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	parser.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Expression parser
 *  Works with	ECMAScript 5.1, node.js, jison 0.4.15
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	20/09/15  (Created)
 *		21/11/15  (Last modified)
 */ 

(function() {
    printf('========== loading libs/expression/js/parser.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));

    var timo = (is.in_nodejs() ? require('./expression') : libs.timo);
    var Functor = (is.in_nodejs() ? require('./functor') : timo.functor);
    var Symbols = (is.in_nodejs() ? require('./symbols') : timo.symbols);
    var Parser = timo.parser = timo.parser || {};

    /**
     *  Parse an expression.
     *
     *  @param {String} string - An input expression as ASCII string.
     *  @returns {Expression|null} expr - Expression object or null.
     */
    Parser.parse = function(str) {
        return Parser.grammar.parse(str);
    };

#include "shorthands.h"

    /**
     *  Grammar is specified in ../grammar.jison.
     */
    Parser.grammar = (function(){
#include "js/grammar.js"
        return parser;
    })();

    if (is.in_nodejs())
        module.exports = Parser;
}).call(this);
