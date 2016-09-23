/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	functor.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Functors (like add, sine, log, ...)
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		21/11/15  (Last modified)
 */ 

(function() {
    "use strict";
 
    printf('========== loading libs/expression/js/functor.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));

    var timo = (is.in_nodejs()) ? require('./expression') : libs.timo;

    //  Namespace
    var Functor = timo.functor = timo.functor || {};

    //  Indexes
    var Functors = Functor.Functors = {};	// Indexed by name (e.g., 'add')
    var Operators = Functor.Operators = {};	// Arrays, indexed by symbol (e.g., '+')

    var ZERO = new timo.Integer(0);

    var Base = Functor.Base = function(spec) {
        printf('Functor.Base ' + spec);
        for (var p in spec)
            if (!this.hasOwnProperty(p))
                this[p] = spec[p];

        if (this.name)
            Functors[this.name] = this;

        if (this.symbol) {
            if (!Operators[this.symbol])
                Operators[this.symbol] = [];
            Operators[this.symbol].push = this;
        } else {
            this.symbol = this.name;
            printf('this.symbol = this.name');
        }
    };

    var Add = function() {
        Base.call(this, {
            name: 'add',
            symbol: '+',
            latex: '+',
            unicode: '+',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 4,
            arity: {
                minimum: 2,
                maximum: Infinity
            },
            identity: ZERO,
            create: function(args) { return new timo.Add(args); }
        });
    };

    extend(Add, Base);

    var Plus = function() {
        Base.call(this, {
            symbol: 'plus',
            latex: '+',
            unicode: '+',
            prefix: true,
            associativity: 'right',
            precedence: 2,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Plus(args); }
        });
    };

    extend(Plus, Base);

    var Subtract = function() {
        Base.call(this, {
            name: 'subtract',
            symbol: '-',
            latex: '-',
            unicode: '\u2212',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 4,
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Subtract(args); }
        });
    };

    extend(Subtract, Base);

    var Minus = function() {
        Base.call(this, {
            name: 'minus',
            symbol: '-',
            latex: '-',
            unicode: '\u2212',
            prefix: true,
            associativity: 'right',
            precedence: 2,
            brackets: true,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Minus(args); }
        });
    };

    extend(Plus, Base);

    var Multiply = function() {
        Base.call(this, {
            name: 'miltiply',
            symbol: '*',
            latex: '\\cdot',
            unicode: '\u00D7',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 3,
            identity: timo.Integer(1),
            arity: {
                minimum: 2,
                maximum: Infinity
            },
            create: function(args) { return new timo.Multiply(args); }
        });
    };

    extend(Multiply, Base);

    var Divide = function() {
        Base.call(this, {
            name: 'divide',
            symbol: '/',
            latex: '/',
            unicode: '/',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 3,
            arity: {
                minimum: 2,
                maximum: Infinity
            },
            create: function(args) { return new timo.Divide(args); }
        });
    };

    extend(Divide, Base);

    var Equals = function() {
        Base.call(this, {
            name: 'equals',
            symbol: '=',
            latex: '=',
            unicode: '=',
            infix: true,
            precedence: 14,
            associativity: 'right',
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Equals(args); }
        });
    };

    var Fraction = function() {
        Base.call(this, {
            name: 'fraction',
            symbol: '/',
            latex: '\\frac',
            unicode: '\u00F7',
            infix: true,
            associativity: 'left',
            precedence: 3,
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Fraction(args); }
        });
    };

    extend(Fraction, Base);

    var Power = function() {
        Base.call(this, {
            name: 'power',
            symbol: '^',
            latex: '^',
            unicode: '^',
            infix: true,
            associativity: 'right',
            precedence: 1,
            curly: true,
            right_to_left: true,
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Power(args); }
        });
    };

    extend(Power, Base);

    var Logarithm = function() {
        Base.call(this, {
            name: 'log',
            latex: '\\log',
            unicode: 'log',
            brackets: true,
            prefix: true,
            func: true,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 2
            },
            range: {
                minimum: 0,
                maximum: Infinity
            },
            create: function(args) { return new timo.Logarithm(args); }
        });
    };

    extend(Logarithm, Base);

    var Sqrt = function() {
        Base.call(this, {
            name: 'sqrt',
            latex: '\\sqrt',
            unicode: '\u221A',
            brackets: true,
            curly: true,
            prefix: true,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Sqrt(args); }
        });
    };

    extend(Sqrt, Base);

    var Sine = function() {
        Base.call(this, {
            name: 'sin',
            latex: '\\sin',
            unicode: 'sin',
            prefix: true,
            brackets: false,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Sine(args); }
        });
    };

    extend(Sine, Base);

    var Cosine = function() {
        Base.call(this, {
            name: 'cos',
            latex: '\\cos',
            unicode: 'cos',
            prefix: true,
            brackets: false,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Cosine(args); }
        });
    };

    extend(Cosine, Base);

    var Tangent = function() {
        Base.call(this, {
            name: 'tan',
            latex: '\\tan',
            unicode: 'tan',
            prefix: true,
            brackets: false,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Tangent(args); }
        });
    };

    extend(Tangent, Base);


    /*------------------------------------------------------------
     *  Create the instances
     *------------------------------------------------------------*/

    Functor.Add = new Add();
    Functor.Plus = new Plus();
    Functor.Subtract = new Subtract();
    Functor.Minus = new Minus();
    Functor.Multiply = new Multiply();
    Functor.Divide = new Divide();
    Functor.Equals = new Equals();
    Functor.Fraction = new Fraction();
    Functor.Power = new Power();
    Functor.Logarithm = new Logarithm();
    Functor.Sqrt = new Sqrt();
    Functor.Sine = new Sine();
    printf(Functor.Sine);
    Functor.Cosine = new Cosine();
    Functor.Tangent = new Tangent();

    printf('Functor.Sine.symbol ' + Functor.Sine.symbol);

    if (is.in_nodejs())
        module.exports = Functor;
}).call(this);
