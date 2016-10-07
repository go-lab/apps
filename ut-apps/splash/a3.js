/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	expression.js
 *  Part of	A3
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Expression definition
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2013  University of Twente
 *  
 *  History	31/07/13  (Created)
 *  		31/07/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	printf.js
 *  Part of	Go-Lab Experimental Design Tool
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Printing messages
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2013  University of Twente
 *  
 *  History	04/04/13  (Created)
 *  		04/04/13  (Last modified)
 */
/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/
function printf(str) {
    if (typeof(console) !== 'undefined')
        console.log(str);
    else
        print(str);
}
var a3 = (function() {
    var self = {};
    var systems = {};
    var current_system = null;
    var System;
    var Thing; // With properties
    var Property; // Of an object
    var BaseUnit;
    var DerivedUnit;
    var PrefixUnit;
    var Variable; // When in an expression it is called Handle
    var Base;
    var Literal;
    var Number;
    var Handle;
    var Expression;
    var Equation;
    var Add;
    var Subtract;
    var Multiply;
    var Divide;
    var Negate;
    var Identity;
    var Any; // Logical variable
    var AnyNumber;
    var Marked;
    var Unmarked;
    self.unit = {}; // Collection of units
    self.prefix = {};
    function translate(str) {
        if (self.translate_function) {
            return self.translate_function.call(null, str);
        }
        return str;
    }
    Unit = self.Unit = function(atts) {
        var unit = this;
        unit.name = atts.name;
        unit.label = atts.label || unit.name;
        unit.symbol = atts.symbol;
        return unit;
    }
    /*------------------------------------------------------------
     *  Base units
     *------------------------------------------------------------*/
    BaseUnit = self.Unit = function(atts) {
        var u = this;
        unit.name = atts.name;
        unit.label = atts.label;
        unit.symbol = atts.symbol;
        unit.quantity = atts.quantity;
        unit.definition = atts.definition || '';
        return unit;
    }
    extend(BaseUnit, Unit);
    DerivedUnit = self.DerivedUnit = function(atts) {
        var unit = this;
        BaseUnit.call(this, atts);
        unit.expression = atts.expression;
        return unit;
    }

    extend(DerivedUnit, BaseUnit);

    /*------------------------------------------------------------
     *  Prefixes for units
     *------------------------------------------------------------*/

    PrefixUnit = self.PrefixUnit = function(atts) {
        var pref = this;

        pref.name = atts.name;
        pref.label = atts.label;
        pref.symbol = atts.symbol;
        pref.factor = atts.factor;

        return pref;
    }

 // Define the base prefixes
    function define_base_prefixes() {
        self.prefix.deca = new PrefixUnit(
            { name: 'deca',
              symbol: 'de',
              factor: 10
            });
        self.prefix.hecto = new PrefixUnit(
            { name: 'hecto',
              symbol: 'h',
              factor: 100
            });
        self.prefix.kilo = new PrefixUnit(
            { name: 'kilo',
              symbol: 'k',
              factor: 1000
            });
        self.prefix.mega = new PrefixUnit(
            { name: 'mega',
              symbol: 'M',
              factor: 10E6
            });
        self.prefix.giga = new PrefixUnit(
            { name: 'giga',
              symbol: 'G',
              factor: 10E9
            });
        self.prefix.tera = new PrefixUnit(
            { name: 'tera',
              symbol: 'G',
              factor: 10E12
            });
        self.prefix.peta = new PrefixUnit(
            { name: 'peta',
              symbol: 'P',
              factor: 10E15
            });
        self.prefix.exa = new PrefixUnit(
            { name: 'peta',
              symbol: 'E',
              factor: 10E18
            });
        self.prefix.zetta = new PrefixUnit(
            { name: 'zetta',
              symbol: 'E',
              factor: 10E21
            });
        self.prefix.yotta = new PrefixUnit(
            { name: 'yotta',
              symbol: 'E',
              factor: 10E24
            });
        self.prefix.deci = new PrefixUnit(
            { name: 'deci',
              symbol: 'd',
              factor: 10E-1
            });
        self.prefix.centi = new PrefixUnit(
            { name: 'centi',
              symbol: 'c',
              factor: 10E-2
            });
        self.prefix.milli = new PrefixUnit(
            { name: 'milli',
              symbol: 'm',
              factor: 10E-3
            });
        self.prefix.micro = new PrefixUnit(
            { name: 'micro',
              symbol: '\u00B5',
              factor: 10E-6
            });
        self.prefix.nano = new PrefixUnit(
            { name: 'nano',
              symbol: 'n',
              factor: 10E-9
            });
        self.prefix.pico = new PrefixUnit(
            { name: 'pico',
              symbol: 'p',
              factor: 10E-12
            });
        self.prefix.femto = new PrefixUnit(
            { name: 'femto',
              symbol: 'f',
              factor: 10E-15
            });
        self.prefix.atto = new PrefixUnit(
            { name: 'atto',
              symbol: 'a',
              factor: 10E-18
            });
        self.prefix.zepto = new PrefixUnit(
            { name: 'zepto',
              symbol: 'z',
              factor: 10E-21
            });
        self.prefix.yocto = new PrefixUnit(
            { name: 'yocto',
              symbol: 'y',
              factor: 10E-24
            });
    }

    /*------------------------------------------------------------
     *  Things (in the real world)
     *------------------------------------------------------------*/

    Thing = self.Thing = function(atts) {
        var obj = this;

        obj.name = atts.name;
        for (var p in atts) {
            if (atts[p] instanceof Property) {
                obj[p] = atts[p];
            } else
                obj.set_value(p, atts[p]);
        }

        return this;
    }

    Thing.prototype.property = function(prop) {
        var thing = this;

        if (thing[prop] instanceof Property)
            return thing[prop];
        for (var p in thing) {
            if (thing[p] instanceof Property && thing[p].name === prop)
                return thing[p];
        }

        return undefined;
    }

    Thing.prototype.get_value = function(prop) {
        var thing = this;
        var p = thing.property(prop);

        if (p === undefined)
            return undefined;
        return p.value;
    }

    Thing.prototype.get = function(prop) {
        var thing = this;
        var p = thing.property(prop);

        if (p === undefined)
            return undefined;
        return { value: p.value,
                 unit: p.unit
               };
    }

    Thing.prototype.set_value = function(prop, val) {
        var thing = this;
        var p = thing.property(prop);

        if (p === undefined)
            return undefined;
        p.value = val;

        return thing;
    }

    Thing.prototype.set = function(prop, val_unit) {
        var thing = this;
        var p = thing.property(prop);

        if (p === undefined)
            return undefined;
        p.value = val_unit.value;
        p.unit = val_unit.unit || p.unit;

        return thing;
    }

    Thing.prototype.properties = function() {
        var obj = this;
        var props = [];

        for (var p in this) {
            if (obj[p] instanceof Property)
                props.push(obj[p]);
        }
        return props;
    }

    Thing.prototype.toString = function() {
        return 'Thing(' + this.name + ')' + JSON.stringify(this.properties,null,4);
    }

    Property = self.Property = function(atts0) {
        var atts = atts0 || {};
        var prop = this;

        if (!atts.name) {
            throw 'No name for Property defined by: ' + atts0;
        }

        prop.value = null;
        prop.unit = null;

        for (var p in atts) {
            prop[p] = atts[p];
        }

        if (prop.label === undefined)
            prop.label = translate(prop.name);

        return prop;
    }


    /*------------------------------------------------------------
     *  Base: abstract class for everything (except variables)
     *------------------------------------------------------------*/

    Base = self.Base = function() {
        this._parent = null;
        this._value = null;
        this._marked = false;
    }

    Base.prototype.marked = function(bool) {
        if (bool === undefined)
            return this._marked;
        this._marked = bool;
    }

    Base.prototype.parent = function() {
        return this._parent;
    }

    Base.prototype.value = function() {
        return this._value;
    }

    Base.prototype.unify = function() {
        return false;
    }

    Base.prototype.deunify = function() {
        return this;
    }

    Base.prototype.equal = function() {
        return false;
    }

    Base.prototype.root = function() {
        if (this._parent)
            return this._parent.root();
        return this;
    }

    /**
     *  Substitute an expression if it unifies.
     */
    Base.prototype.substitute = function(from, to, counter) {
        if (this.unify(from)) {
            var cp = to.copy(true);

            from.deunify();

            if (this._parent) { // We have a parent
                this._parent.replace_arg(this, cp);
            } else
                if (cp instanceof Expression) {
                    this.replace(cp);
                } else
                    this.replace(new Identity(cp));

//          to.deunify();
            if (counter)
                counter.count++;
            return true;
        }

        from.deunify();
//      to.deunify();

        return false;
    }


    /**
     *  Rewrite an expression if it unifies and return rewritten expression.
     */
    Base.prototype.rewrite = function(from, to, state) {
        if (this.unify(from)) {
            if (to === 'evaluate') {
                var expr = from.copy(true);
                var cp = number(expr.value());
            } else
                var cp = to.copy(true);

            from.deunify();
            if (state) {
                state.count++;
            }

            return cp;
        }

        from.deunify();

        return this;
    }


    /*------------------------------------------------------------
     *  Expression: abstract class for all expressions (functor, arity, args)
     *------------------------------------------------------------*/

    Expression = self.Expression = function() {
        var len = arguments.length;
        var i;

        if (len < 2)
            throw 'Expression: less than two arguments';

        Base.call(this);

/*      printf('new Expression');
        for (i=0; i<len; i++)
            printf('  ' + i + ' ' + arguments[i]);
*/

        this._functor = check_functor(arguments[0]);
        this._args = [];

        if (len === 2 && typeof(arguments[1]) === 'array') {
            len = this._arity = arguments[1].length;
            this._args = arguments[1];
        } else {
            this._arity = len-1;
            for (i=1; i<len; i++) {
                this._args.push(check_expression(arguments[i]));
            }
        }
        for (i=0; i<this._arity; i++) {
            this._args[i]._parent = this;
        }

        return this;
    }

    extend(Expression, Base);

    Expression.prototype.toString = function() {
        if (this._arity === 2)
            return '(' + this._args[0] + ' ' + this._functor + ' ' +
            this._args[1] + ')' + (this._marked ? '$' : '');

        var str = this._functor + '(';

        str += this._args.join(', ') + ')';

        if (this._marked)
            str += '$';

        return str;
    }

    Expression.prototype.copy = function(unify) {
        var args = [];

        for (var i=0; i<this._arity; i++) {
            args.push(this._args[i].copy(unify));
        }

        return new Expression(this._functor, args);
    }

    Expression.prototype.equal = function(expr2) {
        var expr1 = this;

        if (expr1._functor === expr2._functor &&
            expr1._arity === expr2._arity) {
            for (var i=0; i<expr1._arity; i++)
                if (!(expr1._args[i].equal(expr2._args[i])))
                    return false;
            return true;
        }
        return false;
    }

    Expression.prototype.contains = function(expr2) {
        var expr1 = this;

        if (expr1.equal(expr2))
            return true;

        for (var i=0; i<expr1._arity; i++) {
            if (expr1._args[i].equal(expr2))
                return true;
        }

        return false;
    }

    /**
     *  Succeed when the value can be computed.
     */
    Expression.prototype.can_compute_value = function() {
        for (var i=0; i<this._arity; i++) {
            printf(this._args[i]);
            if (!this._args[i].can_compute_value())
                return false;
        }
        return true;
    }

    Expression.prototype.lhs = function() {
        if (this._arity != 2)
            throw 'Error: no lhs when arity unequal to 2';
        return this._args[0];
    }

    Expression.prototype.rhs = function() {
        if (this._arity != 2)
            throw 'Error: no rhs when arity unequal to 2';
        return this._args[1];
    }

    Expression.prototype.traverse = function(func) {
        var i =0;

        for (i=0; i<this._arity; i++) {
            var arg = this._args[i];

            func.call(arg);
            if (arg instanceof Expression)
                arg.traverse(func);
        }
    }

    Expression.prototype.unify = function(expr2) {
        var expr1 = this;
        var i;

        if (expr2 instanceof Any)
            return expr2.unify(expr1);

        if (expr2 instanceof Expression &&
            expr1._arity === expr2._arity &&
            expr1._functor === expr2._functor) {
            var rval = true;

            for (i=0; i<expr1._arity; i++) {
                var arg1 = expr1._args[i];
                var arg2 = expr2._args[i];

                if (arg1.unify(arg2))
                    continue;
                rval = false;
                break;
            }
        }

        return rval;
    }

    Expression.prototype.deunify = function() {
        var i;

        for (i=0; i<this._arity; i++) {
            this._args[i].deunify();
        }

        return this;
    }

    Expression.prototype.replace = function(expr2) {
        var expr1 = this;
        var i;

        expr1._functor = expr2._functor;
        expr1._arity = expr2._arity;
        for (var arg, i=0; i<expr2._args.length, arg=expr2._args[i]; i++) {
            expr1._args[i] = arg;
        }

        return this;
    }

    /**
     *  Replace an existing argument by a new value.  If ith is given that
     *  argument is replaced, otherwise the argument is determine through a
     *  look up.  INTERNAL ONLY.
     */
    Expression.prototype.replace_arg = function(old, new_expr, ith) {
        var i;

        if (ith === undefined) {
            for (i=0; i<this._args.length; i++) {
                if (this._args[i] === old) {
                    ith = i;
                    break;
                }
            }
        }

        if (ith === undefined) {
            throw 'Error: replace_arg ' + old + ' not found';
        }

        this._args[ith] = new_expr;

        return this;
    }

    Expression.prototype.substitute_all = function(from, to) {
        var i;

        for (i=0; i<this._arity; i++) {
            this._args[i].substitute(from, to);
            if (this._args[i] instanceof Expression)
                this._args[i].substitute_all(from, to);
        }
        from.deunify();
        to.deunify();

        return this;
    }

    Expression.prototype.unify_bindings = function() {
        var i;

        for (i=0; i<this._arity; i++) {
            var arg = this._args[i];

            if (arg instanceof Any) {
                this._args[i] = arg.binding().copy();
                continue;
            }
            if (arg instanceof Expression)
                arg.unify_bindings();
        }

        return this;
    }

    Expression.prototype.copy_unified = function() {
        var cp = new Expression(this._functor, this._args);

        for (var i=0; i<cp._arity; i++) {
            var arg = cp._args[i];

            if (arg instanceof Any)
                cp._args[i] = arg.binding().copy();
            else
                cp._args[i] = arg.copy();
        }

        return cp;
    }

    /**
     *  Mark a variable in this expression.  Both the handle of the variable
     *  are marked and the parent expression of the marked variable.
     */
    Expression.prototype.mark_variable = function(v) {
        for (var i=0; i<this._arity; i++) {
            var arg = this._args[i];

            if (arg instanceof Handle) {
                if (arg.variable() === v) {
                    arg.marked(true);
                    this.marked(true);
                }
                continue;
            }

            if (arg instanceof Expression) {
                arg.mark_variable(v);
            }
        }
    }

    Expression.prototype.unmark = function() {
        for (var i=0; i<this._arity; i++) {
            var arg = this._args[i];

            arg._marked = false;
            if (arg instanceof Expression)
                arg.unmark();
        }
    }

    /*------------------------------------------------------------
     *  Negate: negative
     *------------------------------------------------------------*/

    Negate = self.Negate = function(expr) {
        Expression.call(this, '-', expr);

        return this;
    }

    extend(Negate, Expression);

    Negate.prototype.toString = function() {
        return '-(' + this._args[0] + ')';
    }

    Negate.prototype.copy = function(unify) {
        return new Negate(this._args[0].copy(unify));
    }

    Negate.prototype.value = function() {
        if (!this._value && this.can_compute_value())
            this._value = -(this._args[0]);
        return this._value;
    }

    /*------------------------------------------------------------
     *  Identity: single argument is the real expression
     *------------------------------------------------------------*/

    Identity = self.Identity = function(expr) {
        Expression.call(this, 'identity', expr);

        return this;
    }

    extend(Identity, Expression);

    Identity.prototype.toString = function() {
        return 'Identity(' + this._args[0] + ')';
    }

    Identity.prototype.copy = function(bool) {
        return this._args[0].copy(bool);
    }


    /*------------------------------------------------------------
     *  Equation: equations
     *------------------------------------------------------------*/

    Equation = self.Equation = function(lhs, rhs) {
        Expression.call(this, '=', lhs, rhs);

        return this;
    }

    extend(Equation, Expression);

    Equation.prototype.copy = function(unify) {
        return new Equation(this.lhs().copy(unify), this.rhs().copy(unify));
    }

    Equation.prototype.isolate = function(v) {
        var expr = this.copy();

        var x = new Marked('x');
        var y = new Marked('y');
        var a = new Unmarked('a');
        var b = new Unmarked('b');

        do {
            var state = { changed: false, count: 0 };

            expr.simplify();
            expr.unmark();
            expr.mark_variable(v);

     // a = b + x --> a - x = b
            expr = expr.rewrite(equation(a, add(b,x)),
                                equation(subtract(a,x), b), state);

     // a = b - x --> a + x = b
            expr = expr.rewrite(equation(a, subtract(b,x)),
                                equation(add(a,x), b), state);

     // a = b * x --> a / x = b
            expr = expr.rewrite(equation(a, multiply(b,x)),
                                equation(divide(a,x), b), state);

     // a = b / x --> a * x = b
            expr = expr.rewrite(equation(a, divide(b,x)),
                                equation(multiply(a,x), b), state);

     // a + x = b --> x = b - a
            expr = expr.rewrite(equation(add(a,x), b),
                                equation(x, subtract(b,a)), state);

     // a / x = b --> x = b / a
            expr = expr.rewrite(equation(divide(a,x), b),
                                equation(x, divide(b,a)), state);

     // x = y * a --> x / y = a
            expr = expr.rewrite(equation(x, multiply(y,a)),
                                equation(divide(x,y), a), state);
        } while (state.count > 0);

        return expr;
    }

    Expression.prototype.simplify = function() {
        var expr = this;

        printf('SIMPLIFY ' + expr);

        var a = any('a');
        var b = any('b');
        var c = any('c');
        var one = number(1);
        var zero = number(0);
        var i = any_number('i');
        var j = any_number('j');

        var rules = [
            { from: add(i,j),
              to: 'evaluate'
            },
            { from: subtract(i,j),
              to: 'evaluate'
            },
            { from: divide(i,j),
              to: 'evaluate'
            },
            { from: multiply(i,j),
              to: 'evaluate'
            },
            { from: add(a,0),
              to: a
            },
            { from: divide(add(a,b), c),
              to: add(divide(a,c), divide(b,c))
            },
            { from: add(a, 0),
              to: a
            },
            { from: add(0, a),
              to: a
            },
            { from: add(a, a),
              to: multiply(a, 2)
            },
            { from: subtract(0,a),
              to: negate(a)
            },
            { from: subtract(a,0),
              to: a
            },
            { from: subtract(a,a),
              to: zero
            },
            { from: divide(a,a),
              to: one,
              constraint: 'a not equal to zero'
            },
            { from: multiply(a,1),
              to: a
            },
            { from: multiply(1,a),
              to: a
            },
            { from: multiply(0,a),
              to: zero
            },
            { from: multiply(a,0),
              to: zero
            }
        ];

        expr = simplify(expr, rules);

        printf('  SIMPLIFIED ' + expr);

        return expr;

        function simplify(expr, rules) {
            var state = { change: false, count: 0 };
            var i;

            for (i=0; i<rules.length; i++) {
                var rule = rules[i];

                expr = expr.rewrite(rule.from, rule.to, state);
            }

            for (i=0; i<expr._arity; i++) {
                if (expr._args[i] instanceof Expression) {
                    expr._args[i] = simplify(expr._args[i], rules, state);
                }
            }

            if (state.count > 0)
                return simplify(expr, rules);

            return expr;
        }
    }

    /*------------------------------------------------------------
     *  Add
     *------------------------------------------------------------*/

    Add = self.Add = function(lhs, rhs) {
        Expression.call(this, '+', lhs, rhs);
        return this;
    }

    extend(Add, Expression);

    Add.prototype.copy = function(unify) {
        return new Add(this.lhs().copy(unify), this.rhs().copy(unify));
    }

    Add.prototype.value = function() {
        if (!this._value && this.can_compute_value())
            this._value = this.lhs() + this.rhs();
        return this._value;
    }


    /*------------------------------------------------------------
     *  Subtract
     *------------------------------------------------------------*/

    Subtract = self.Subtract = function(lhs, rhs) {
        Expression.call(this, '-', lhs, rhs);
        return this;
    }

    extend(Subtract, Expression);

    Subtract.prototype.copy = function(unify) {
        return new Subtract(this.lhs().copy(unify), this.rhs().copy(unify));
    }

    Subtract.prototype.value = function() {
        if (!this._value && this.can_compute_value())
            this._value = this.lhs() - this.rhs();
        return this._value;
    }


    /*------------------------------------------------------------
     *  Multiply
     *------------------------------------------------------------*/

    Multiply = self.Multiply = function(lhs, rhs) {
        Expression.call(this, '*', lhs, rhs);
        return this;
    }

    extend(Multiply, Expression);

    Multiply.prototype.copy = function(unify) {
        return new Multiply(this.lhs().copy(unify), this.rhs().copy(unify));
    }

    Multiply.prototype.value = function() {
        if (!this._value && this.can_compute_value())
            this._value = this.lhs() * this.rhs();
        return this._value;
    }


    /*------------------------------------------------------------
     *  Divide
     *------------------------------------------------------------*/

    Divide = self.Divide = function(lhs, rhs) {
        Expression.call(this, '/', lhs, rhs);
        return this;
    }

    extend(Divide, Expression);

    Divide.prototype.copy = function(unify) {
        return new Divide(this.lhs().copy(unify), this.rhs().copy(unify));
    }

    Divide.prototype.value = function() {
        if (!this._value && this.can_compute_value())
            this._value = this.lhs() / this.rhs(); // TBD -- check 0
        return this._value;
    }


    /*------------------------------------------------------------
     *  Literal: abstract class for all literals (variables, numbers, ...)
     *------------------------------------------------------------*/

    Literal = self.Literal = function() {
        Base.call(this);

        this._value = null;
        this._parent = null;

        return this;
    }

    extend(Literal, Base);

    Literal.prototype.unify = function(l2) {
        if (l2 instanceof Any)
            return l2.unify(this);
        return this.equal(l2);
    }


    /*------------------------------------------------------------
     *  Number: class for numbers (precision currently depends on native numbers)
     *------------------------------------------------------------*/

    Number = self.Number = function(val) {
        if (!(typeof(val) === 'number'))
            throw 'Error: Number ' + val + ' is not a number';

        Literal.call(this);
        this._value = val;

        return this;
    }

    extend(Number, Literal);

    Number.prototype.toString = function() {
        return this._value;
    }

    Number.prototype.copy = function() {
        return new Number(this._value);
    }

    Number.prototype.equal = function(expr) {
        if (expr instanceof Number &&
            this._value === expr._value)
            return true;
        return false;
    }

    Number.prototype.can_compute_value = function() {
        return true;
    }


    /*------------------------------------------------------------
     *  Any: logical variables
     *------------------------------------------------------------*/

    Any = self.Any = function(name, bind) {
        Base.call(this);

        this._name = (name === undefined ? '_' : name);
        this._binding = (bind === undefined ? null : bind);

        return this;
    }

    extend(Any, Base);

    Any.prototype.toString = function() {
        if (this._binding)
            return 'var(' + this._name + '=' + this._binding + ')';
        return 'var(' + this._name + ')';
    }

    Any.prototype.copy = function(unify) {
        if (unify) {
            if (this._binding)
                return this._binding.copy();
            throw 'Error: trying to unify ' + this + ' with no binding';
        }
        return new Any(undefined, this._binding);
    }

    Any.prototype.unify = function(exp) {
        if (this._binding === null) {
            this._binding = exp;
            return true;
        }
        printf('ANY HAS BINDING ' + this._binding);
        printf('  TRYING ' + exp);
        if (this._binding.equal(exp))
            return true;
        return false;
    }

    Any.prototype.deunify = function() {
        this._binding = null;
    }


    /*------------------------------------------------------------
     *  AnyNumber: logical variable matching any number
     *------------------------------------------------------------*/

    AnyNumber = self.AnyNumber = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    }

    extend(AnyNumber, Any);

    AnyNumber.prototype.unify = function(expr) {
        if (expr instanceof Number) {
            this._binding = expr;
            printf('  --- unify: ' + this + '   ' + this._binding);
            return true;
        }
        return false;
    }


    /*------------------------------------------------------------
     *  Marked: logical variable matching marked variables
     *------------------------------------------------------------*/

    Marked = self.Marked = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    }

    extend(Marked, Any);

    Marked.prototype.unify = function(exp) {
        if (exp.marked()) {
            if (this._binding)
                return this._binding.equal(exp);
            this._binding = exp;
            printf('  --- unify: ' + this + '   ' + this._binding);
            return true;
        }
        return false;
    }


    /*------------------------------------------------------------
     *  Unmarked: logical variable matching unmarked variables
     *------------------------------------------------------------*/

    Unmarked = self.Unmarked = function(name, bind) {
        Any.call(this, name, bind);
    }

    extend(Unmarked, Any);

    Unmarked.prototype.unify = function(expr) {
        if (expr.marked() === false) {
            if (this._binding)
                return this._binding.equal(expr);
            this._binding = expr;
            printf('  --- unify: ' + this + '   ' + this._binding);
            return true;
        }
        return false;
    }


    /*------------------------------------------------------------
     *  System: a named system of equations
     *------------------------------------------------------------*/

    System = self.System = function(sys) {
        if (systems[sys]) {
            return systems[sys];
        }

        this._variables = {};
        this._equations = [];
        this._computed = [];
        this._name = sys;

        systems[sys] = this;

        return this;
    }

    System.prototype.pp = function() {
        var vars = this._variables;
        var v;

        printf('System ' + this._name);
        printf('  Variables');
        for (v in vars) {
            var rv = vars[v];
            printf('    ' + rv.symbol() + ' = ' + rv.value());
        }
        printf('');
        printf('  Equations');
        for (v=0; v<this._equations.length; v++) {
            printf('    ' + this._equations[v]);
        }
        printf('*** done ***\n');
    }

    System.prototype.add_variable = function(v) {
        var symb;

        assert_variable(v);
        symb = v.symbol();

        if (this._variables[symb]) {
            if (this._variables[symb] === v)
                return;
            throw 'Error: variable ' + symb + ' already in system';
        }

        this._variables[symb] = v;
    }

    /**
     * Add an equation to the system.  Any variables in the equation that are
     * already in the system are made to point to the same variable. 
     */
    System.prototype.add_equation = function(eq) {
        assert_equation(eq);

        var sys = this;

        eq.traverse(function() {
            var v;

            if (is_handle(this)) {
                if (v=(sys.lookup_variable(this.variable()))) {
                    this.variable(v);
                    return;
                }
                sys.add_variable(this.variable());
            }
        });
        this._equations.push(eq);
    }

    System.prototype.lookup_variable = function(v0) {
        var v = coerce_variable_string(v0);

        return this._variables[v] || null;
    }


    /*------------------------------------------------------------
     *  Variable: class for variables
     *------------------------------------------------------------*/

    Variable = self.Variable = function(str, val) {
        assert_string(str);
        assert_optional_number(val);

        this._symbol = str;
        this._value = (val || null);

        return this;
    }

    Variable.prototype.toString = function() {
        return this._symbol;
    }

    Variable.prototype.copy = function() {
        return new Handle(this);
    }

    Variable.prototype.symbol = function() {
        return this._symbol;
    }

    Variable.prototype.value = function() {
        return this._value;
    }


    /*------------------------------------------------------------
     *  Handle: class for a pointer to a variable
     *------------------------------------------------------------*/

    Handle = self.Handle = function(v) {
        assert_variable(v);

        Literal.call(this);
        this._variable = v;

        return this;
    }

    extend(Handle, Literal);

    Handle.prototype.toString = function() {
        return this.symbol();
    }

    Handle.prototype.copy = function() {
        return new Handle(this._variable);
    }

    Handle.prototype.equal = function(expr) {
        if (expr instanceof Handle &&
            this.variable() === expr.variable())
            return true;
        return false;
    }

    Handle.prototype.value = function() {
        return this._variable.value();
    }

    Handle.prototype.symbol = function() {
        return this._variable.symbol();
    }

    Handle.prototype.variable = function(v) {
        if (v === undefined)
            return this._variable;
        assert_variable(v);
        this._variable = v;

        return this;
    }


    /*------------------------------------------------------------
     *  Assert types
     *------------------------------------------------------------*/

    function assert_string(str) {
        if (typeof(str) !== 'string')
            throw 'Error: expected ' + str + ' to be a string';
    }

    function assert_number(num) {
        if (typeof(num) !== 'number')
            throw 'Error: expected ' + num + ' to be a number';
    }

    function assert_optional_number(num) {
        if (num === undefined)
            return;
        if (typeof(num) !== 'number')
            throw 'Error: expected ' + num + ' to be a number';
    }

    function assert_variable(v) {
        if (!(v instanceof Variable))
            throw 'Error: expected ' + v + ' to be a variable';
    }

    function assert_equation(v) {
        if (!(v instanceof Equation))
            throw 'Error: expected ' + v + ' to be an equation';
    }


    /*------------------------------------------------------------
     *  Identity functions
     *------------------------------------------------------------*/

    function is_string(str) {
        return typeof(str) === 'string';
    }

    function is_number(num) {
        return typeof(num) === 'number';
    }

    function is_variable(v) {
        return v instanceof Variable;
    }

    function is_handle(v) {
        return v instanceof Handle;
    }

    function is_expression(v) {
        return v instanceof Expression;
    }


    /*------------------------------------------------------------
     *  Utility functions
     *------------------------------------------------------------*/

    function coerce_variable_string(v) {
        if (is_string(v))
            return v;
        if (is_variable(v));
            return v.symbol();
        if (is_handle(v))
            return v.symbol();

        throw 'Variable ' + v0 + ' is not a variable (name)';
    }

    function check_functor(func) {
        if (typeof(func) !== 'string')
            throw 'Argument ' + func + ' is not a functor';
        return func;
    }

    function check_expression(exp) {
        if (is_expression(exp))
            return exp;
        if (is_variable(exp))
            return new Handle(exp);
        if (is_string(exp))
            return new Handle(new Variable(exp));
        if (is_number(exp))
            return new Number(exp);
        if (exp instanceof Literal)
            return exp;
        if (exp instanceof Any)
            return exp;

        throw 'Argument ' + exp + ' is not a valid argument';
    }

    function extend(sub_class, super_class) {
 var F = function() {};

        F.prototype = super_class.prototype;
        sub_class.prototype = new F();
        sub_class.prototype.constructor = sub_class;

        sub_class.superclass = super_class.prototype;
        if (super_class.prototype.constructor == Object.prototype.constructor)
            super_class.prototype.constructor = super_class;
    }


    /*------------------------------------------------------------
     *  Global functions
     *------------------------------------------------------------*/

    self.system = function(sys) {
        if (sys === undefined)
            return current_system;

        if (sys instanceof System)
            return (current_system = sys);
        if (systems[sys]) {
            return (current_system = systems[sys]);
        }

        throw 'Error: system ' + sys + ' not found';
    }

    function init() {
        self.system(new System('root'));
        define_base_prefixes();
    }

    init();

    return self;
})();


/*
function variable(s) { return new a3.Variable(s); }
function equation(lhs, rhs) { return new a3.Equation(lhs, rhs); }
function add(lhs, rhs) { return new a3.Add(lhs, rhs); }
function subtract(lhs, rhs) { return new a3.Subtract(lhs, rhs); }
function multiply(lhs, rhs) { return new a3.Multiply(lhs, rhs); }
function divide(lhs, rhs) { return new a3.Divide(lhs, rhs); }
function minus(lhs, rhs) { return new a3.Minus(lhs, rhs); }
function any(name) { return new a3.Any(name); }
function any_number(name) { return new a3.AnyNumber(name); }
function negate(exp) { return new a3.Negate(exp); }
function equation(lhs,rhs) { return new a3.Equation(lhs,rhs); }
function number(num) { return new a3.Number(num); }

var a = variable('a');
var b = variable('b');
var x = variable('x');
var c = variable('c');

printf('call');

var exp1 = equation(add(x,5), multiply(x,6));

printf('call');

printf(exp1);

var res1 = exp1.isolate(x);

printf('call');

printf('exp1 ' + exp1);
printf('res1 ' + res1);

var a = any('a');

var add_match = add(a, 0);
var add_result = a;

var add_y = equation(x, add(y,0));
printf('add_y ' + add_y);

printf('substitute returns ' + add_y.substitute_all(add_match, add_result));
printf(add_y);

printf('unify ' + add_y.unify(add_match));


exp.substitute(add_match, add_result);
printf('after sub ' + exp);

printf('y');
printf(y);

printf('ex1');
var ex1 = equation(add(y,3), 6);
printf(ex1);

printf('sys');
var sys = new a3.System('ex1');
printf(sys);

printf('add eq');
sys.add_equation(ex1);
printf(sys);

printf('iso');
sys.isolate(y);
printf(sys);
*/
