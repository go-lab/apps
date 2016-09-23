/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	rules.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Rules
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		30/09/15  (Last modified)
 */ 

(function() {
    "use strict";
 
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};

    var is = (utils.is ? utils.is : require('./is'));
    var timo = (libs.timo ? libs.timo : require('./expression'));

    var Rules = timo.rules = {};

    printf('========== loading libs/expression/js/rules.js');

    Rules.basic_non_associative = function() {
        var a = any('a');
        var b = any('b');
        var c = any('c');
        var d = any('d');
        var i = any_integer('i');
        var j = any_integer('j');

        var rules = [
            { description: '-(-a) := a',
              pattern: minus(minus(a)),
              substitute: a
            },

            { description: 'a + 0 := a',
              pattern: add(a, integer(0)),
              substitute: a,
              commutative: true
            },

            { description: 'a - 0 := a',
              pattern: subtract(a, 0),
              substitute: a,
              commutative: false
            },

            { description: '0 - a := -(a)',
              pattern: subtract(0, a),
              substitute: minus(a),
              commutative: false
            },

            { description: 'a * 0 := 0',
              pattern: multiply(a, 0),
              substitute: integer(0),
              commutative: true
            },

            { description: '-(i) := i',
              pattern: minus(i),
              substitute: function() {
                  return integer(-i.binding.value);
              }
            },

            { description: 'a * 1 := a',
              pattern: multiply(a, 0),
              substitute: a,
              commutative: true
            },

            { description: 'a * i := i * a',
              pattern: multiply(a, i),
              substitute: multiply(i, a)
            },

            { description: 'i + j = eval(i+j)',
              pattern: add(i, j),
              substitute: function() {
                  var value = i.binding.value + j.binding.value;
                  return integer(value);
              }
            },

            { description: 'i - j = eval(i-j)',
              pattern: subtract(i, j),
              substitute: function() {
                  printf('i ' + i.binding.value);
                  printf('j ' + j.binding.value);
                  var value = i.binding.value - j.binding.value;
                  return integer(value);
              }
            },

            { description: 'i * j = eval(i*j)',
              pattern: multiply(i, j),
              substitute: function() {
                  var value = i.binding.value * j.binding.value;
                  return integer(value);
              }
            },

            { description: 'a * i := i * a',
              pattern: multiply(a, i),
              substitute: multiply(i, a)
            },

            { description: '-1 * a := -a',
              pattern: multiply(-1, a),
              substitute: minus(a)
            },

            { description: '-(i * a) := -i * a',
              pattern: minus(multiply(i, a)),
              substitute: function() {
                  var value = -i.binding.value;
                  return multiply(integer(value), a);
              }
            },

            { description: 'i * (a + b) := i * a + i * b',
              pattern: multiply(i, add(a,b)),
              substitute: add(multiply(i,a), multiply(i,b)),
              commutative: true
            },

            { description: 'i * (a - b) := i * a - i * b',
              pattern: multiply(i, subtract(a,b)),
              substitute: subtract(multiply(i,a), multiply(i,b)),
              commutative: true
            },

            { description: 'a * (b - c) := a * b - a * c',
              pattern: multiply(a, subtract(b,c)),
              substitute: subtract(multiply(a,b), multiply(a,c)),
              commutative: true
            },

            { description: 'a * (b + c) := a * b + a * c',
              pattern: multiply(a, add(b,c)),
              substitute: add(multiply(a,b), multiply(a,c)),
              commutative: true
            },

            { description: 'a + a := 2 * a',
              pattern: add(a,a),
              substitute: multiply(2,a),
              commutative: false
            }
        ];

        return rules;
    };

    Rules.eliminate_subtract = function() {
        var a = any('a');
        var b = any('b');

        var rules = [
            //  Eliminate subtract
            { description: 'a - b := a + (-b)',
              pattern: subtract(a,b),
              substitute: add(a, minus(b))
            }
        ];

        return rules;
    };

    Rules.introduce_subtract = function() {
        var a = any('a');
        var b = any('b');

        var rules = [
            //  Eliminate subtract
            { description: 'a + (-b) := a - b',
              pattern: add(a,minus(b)),
              substitute: subtract(a, b)
            }
        ];

        return rules;
    };

    Rules.addition_associative = function() {
        var a = any('a');
        var b = any('b');
        var i = any_integer('i');
        var j = any_integer('j');

        var rules = [
            { description: 'i + j = eval(i+j)',
              pattern: add(i, j),
              substitute: function() {
                  var value = i.binding.value + j.binding.value;
                  printf('   i ' + i.binding.value + ' + ' + j.binding.value);
                  return integer(value);
              },
              associative: true,
              functor: timo.FunctorAdd
            },

            { description: 'i * j = eval(i*j)',
              pattern: multiply(i, j),
              substitute: function() {
                  var value = i.binding.value * j.binding.value;
                  printf('   i ' + i.binding.value + ' * ' + j.binding.value);
                  return integer(value);
              },
              associative: true,
              functor: timo.FunctorMultiply
            },

            { description: 'a + a := 2 * a',
              pattern: add(a, a),
              substitute: multiply(2, a),
              associative: true,
              functor: timo.FunctorAdd
            },

            { description: 'i * a + j * a = (i+j) * a',
              pattern: add(multiply(i,a), multiply(j,a)),
              substitute: multiply(add(i,j), a),
              associative: true,
              commutative: false,
              functor: timo.FunctorAdd
            },

            { description: 'i * a + a = (i+1) * a',
              pattern: add(multiply(i,a), a),
              substitute: multiply(add(i,1), a),
              associative: true,
              commutative: true,
              functor: timo.FunctorAdd
            }
        ];

        return rules;
    };

    Rules.trigonometry = function() {
        var a = any('a');
        var b = any('b');

        var rules = [
            { description: 'sin(a + b)',
              pattern: sin(add(a,b)),
              substitute: add(multiply(sin(a),cos(b)),
                              multiply(cos(a),sin(b)))
            },
            { description: 'cos(a + b)',
              pattern: cos(add(a,b)),
              substitute: subtract(multiply(cos(a),cos(b)),
                                   multiply(sin(a),sin(b)))
            }
        ];

        return rules;
    };

    Rules.multiplication = function() {
        var a = any('a');
        var b = any('b');
        var i = any_integer('i');
        var j = any_integer('j');

        var rules = [
            { description: 'a * (1/a) := 1',
              pattern: multiply(a, divide(1,a)),
              substitute: integer(1),
              associative: true,
              commutative: true,
              functor: timo.FunctorMultiply
            },
            { description: 'i * j = eval(i+j)',
              pattern: multiply(i, j),
              substitute: function() {
                  var value = i.binding.value * j.binding.value;
                  return integer(value);
              },
              associative: true,
              functor: timo.FunctorMultiply
            },

            { description: 'a * b + b * a = 2 * a * b',
              pattern: add(multiply(a,b), multiply(b,a)),
              substitute: multiply(2, multiply(a,b)),
              associative: true,
              functor: timo.FunctorAdd
            }
        ];

        return rules;
    };

#include "shorthands.h"

    if (is.in_nodejs())
        module.exports = Rules;
}).call(this);
