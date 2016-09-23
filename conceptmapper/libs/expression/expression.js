/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	expression.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Expression definition
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		21/11/15  (Last modified)
 */ 

(function() {
    "use strict";
 
    printf('========== loading libs/expression/js/expression.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));

    var timo = libs.timo = libs.timo || {};

    if (is.in_nodejs())
        module.exports = timo;

    var Calculate;
    var Functor;

    /**
     *  Expression.  A package for representing mathematics as JavaScript
     *  objects.
     *
     *  @author Anjo Anjewierden, a.a.anjewierden@utwente.nl
     */

    var System;

    var Dimension;

    var Variable;	// When in an expression it is called Handle

    var Base;
    var   Literal;
    var     Numerical;	// Number is reserved according to .jshint
    var     Constant;
    var       Real;	
    var       Degree;
    var         Irrational;	
    var         Rational;	
    var           Integer;	
    var             Natural;	
    var     Handle;	// Necessary because a single variable / property 
			// may be in several places in an expression 
    var   Quantity;
    var   Expression;
    var     Equals;
    var     Add;
    var     Subtract;
    var     Multiply;
    var     Divide;
    var       Fraction;
    var     Minus;		// Negate - logical?
    var     Plus;
    var     Power;
    var     Logarithm;
    var     Sine;
    var     Cosine;
    var     Tangent;
    var     Sqrt;
    var     Funct;		// Better name?

    var Any;		// Logical variable
    var   AnyNumerical;
    var   AnyReal;
    var   AnyInteger;


    /**
     *  The evaluate method returns values.  Except for a numerical value is
     *  can return either NaN if the value is not defined, or 'null' if the
     *  value cannot be computed.  For example:
     *
     *  log(-1) will return NaN because the log of -1 is not defined.
     *  log(x) will return null if x has not been assigned a value, i.e. the
     *  value cannot be computed.
     *
     *  is.Value(obj) checks whether the value is a number.
     */
    is.Value = function(obj) {
        return !isNaN(obj) && obj !== null;
    };


    /*------------------------------------------------------------
     *  Base: abstract class for everything (except variables)
     *------------------------------------------------------------*/

    Base = timo.Base = function() {
        this.parent = null;
        this.depth = 0;			// Otherwise finding a common root takes very long
        this.id = id();			// TBD - required?
        this.value = null;		// TBD - required?
    };

    is.Base = function(obj) {
        return obj instanceof Base;
    };

    Base.prototype.class_name = function() {
        return 'Base';
    };

    Base.prototype.print_nested = function() {
        return this.toString();
    };

    /** @abstract */
    Base.prototype.evaluate = function() {
        throw 'Base.evaluate: not defined for ' + this;
    };

    Base.prototype.root = function() {
        return (this.parent ? this.parent.root() : this);
    };

    Base.prototype.print_structure = function(indent) {
        indent = use_default(indent, 0);
        printf(spaces(indent) + this);
        printf(spaces(indent+4) + 'parent ' + this.parent);
        printf(spaces(indent+4) + 'depth  ' + this.depth);
        if (is.Integer(this))
            printf(spaces(indent+4) + 'INTEGER');
        if (is.Numerical(this))
            printf(spaces(indent+4) + 'NUMERICAL');
        if (is.Real(this))
            printf(spaces(indent+4) + 'REAL');
    };

    Base.prototype.set_depth = function(depth) {
        this.depth = depth;
    };

    Base.prototype.rewrite_rule = function(rule) {
        if (this.unify(rule.pattern)) {
            var rval = copy_substition(rule.substitute);
            rule.pattern.deunify();
//            rval.check();
            return rval;
        }
        return this;
    };

    Base.prototype.precedence = function() {
        return -1;
    };

    Base.prototype.commutative = function() {
        return false;
    };

    Base.prototype.unify = function(exp) {
        return false;
    };

    Base.prototype.unify_deep = function(exp) {
        var rval = [];

        printf('Base.unify_deep ' + this + ' ' + exp);
        if (this.unify(exp)) {
            rval.push(this);
            exp.deunify();
        }

        return rval;
    };

    Base.prototype.deunify = function() {
        return this;
    };

    Base.prototype.equal = function(exp2) {
        return false;
    };

    Base.prototype.check = function() {
        this.check_parent();
        this.check_depth();
    };

    Base.prototype.check_parent = function() {
//        printf('ommitting check_parent for Base');
        return true;
    };

    Base.prototype.check_depth = function() {
//        printf('ommitting check_parent for Base');
        if (this.parent)
            return this.depth === this.parent.depth + 1;
        return this.depth === 0;
    };

    Base.prototype.reparent = function() {
        return this;
    };

    Base.prototype._reparent2 = function() {
        return this;
    };

    Base.prototype.contains = function(exp) {
        if (this.unify(exp))
            return true;
        return false;
    };

    Base.prototype.contains_property = function(property, func) {
        return false;
    };


    Base.prototype.compute = function(settings) {
        var vars = this.variables();

        for (var v in settings) {
            var variable = vars[v];

            if (variable)
                variable.set_value(settings[v]);
        }

        return this.evaluate();
    };


    Base.prototype.variables = function() {
        return this._variables({});
    };

    Base.prototype._variables = function(vars) {
        return vars;
    };

    /*------------------------------------------------------------
     *  Expression: abstract class for all expressions (functor, arity, args)
     *------------------------------------------------------------*/

    Expression = timo.Expression = function() {
        var exp = this;
        var len = arguments.length;
        var i;

        if (len === 0)
            throw 'Expression: at least one argument required (functor)';

        Base.call(exp);

        exp.functor = check_functor(arguments[0]);
        exp.args = [];

        if (len === 2 && is.array(arguments[1])) {
            exp.arity = arguments[1].length;
            var args = arguments[1];
            for (i=0; i<args.length; i++) {
                exp.args.push(check_expression(args[i]));
            }
        } else {
            exp.arity = len - 1;
            for (i=1; i<len; i++) {
                exp.args.push(check_expression(arguments[i]));
            }
        }

        for (i=0; i<exp.arity; i++) {
            exp.args[i].parent = exp;
            exp.args[i].set_depth(exp.depth + 1);
        }

        return exp;

        function check_functor(func) {
            if (is.object(func))
                return func;
            if (is.string(func)) {
                printf('CREATING FUNCTOR FOR ' + func);
                var rfunc = new Functor.Base({
                    name: func,
                    latex: func,
                    unicode: func,
                    arity: null
                });
                rfunc.create = function(args) {
                    return new timo.Funct(rfunc, args);
                };
                return rfunc;
            }
            trace('timo.Expression: ' + func + ' is not a functor');
        }

        function check_expression(exp) {
            if (is.Expression(exp))
                return exp;
            if (is.Variable(exp)) 
                return new Handle(exp);
            if (is.string(exp)) {
                if (exp[0].match(/(\d+\.?\d*)([Ee][\-+]?\d+)?/)) {
                    var snum = Calculate.Number(exp);

                    if (Calculate.isInteger(snum)) {
                        return new Integer(snum);
                    }
                    return new Real(snum);
                }
                return new Handle(new Variable(exp));
            }
            if (is.number(exp) || is.BigNumber(exp)) {
                var num = Calculate.Number(exp);

                if (Calculate.isInteger(num)) {
                    return new Integer(num);
                }
                return new Real(num);
            }
            if (is.Literal(exp))
                return exp;
            if (is.Any(exp))
                return exp;

            printf(exp);
            trace('Expression: ' + exp + ' is not a valid argument in ' + exp.functor);
        }
    };

    is.Expression = function(obj) {
        return obj instanceof Expression;
    };

    extend(Expression, Base);

    Expression.prototype.class_name = function() {
        return 'Expression';
    };

    /**
     *  Succeeds if this expression contains an element with the given
     *  property.  If second argument is true, the property must be a
     *  function.
     */
    Expression.prototype.contains_property = function(property, func) {
        var seen = false;

        if (this[property]) {
            if (!func) {
                printf('Expression.contains_property ' + property + ' true');
                return true;
            }
            if (typeof(this[property]) === 'function') {
                printf('Expression.contains_property ' + property + ' true');
                return true;
            }
        }
                
        for (var i=0; i<this.arity; i++) {
            if (this.arg(i).contains_property(property, func))
                return true;
        }

        return false;
    };

    Expression.prototype.print_structure = function(indent) {
        indent = use_default(indent, 0);

        printf(spaces(indent) + this);
        indent += 2;
        printf(spaces(indent) + 'parent ' + this.parent);
        printf(spaces(indent) + 'depth  ' + this.depth);
        printf(spaces(indent) + 'arity  ' + this.arity);
        for (var i=0; i<this.arity; i++) {
            printf(spaces(indent) + 'arg ' + i + ' ' + this.arg(i));
            
            this.arg(i).print_structure(indent+2);
        }
    };

    Expression.prototype.print_nested = function(indent) {
        indent = use_default(indent, 0);

        var str = spaces(indent);

        str += this.functor.symbol;
        str += '(';
        for (var i=0; i<this.arity; i++) {
            str += this.arg(i).print_nested();
            if (i+1 < this.arity)
                str += ', ';
        }
        str += ')';
            
        return str;
    };

    Expression.prototype.toString = function(options) {
        options = options || {};
        var functor = this.functor;
        var str = '';

        printf('Expression.toString ');

        if (options.brackets)
            str += '(';

        //  Unary operators
        if (functor.prefix && this.arity === 1) {
            var arg = this.args[0];
            var prec = arg.precedence();

            str += functor.symbol + ' ';
            if (functor.brackets)
                str += '(';
            if (prec === -1) 
                str += arg.toString();
            else {
                if (prec > this.precedence())
                    str += '(';
                str += arg.toString();
                if (prec > this.precedence())
                    str += ')';
            }
            if (functor.brackets)
                str += ')';
        } else {
            //  Binary operators
            if (functor.infix && this.arity === 2) {
                if (this.left().precedence() > this.precedence())
                    str += '(';
                str += this.left().toString(options);
                if (this.left().precedence() > this.precedence())
                    str += ')';
                str += ' ' + functor.symbol + ' ';
                if (this.right().precedence() > this.precedence())
                    str += '(';
                str += this.right().toString(options);
                if (this.right().precedence() > this.precedence())
                    str += ')';
            } else {

                //  Functions
                str += this.functor.symbol;
                if (functor.brackets)
                    str += '(';
                else
                    str += ' ';
                str += this.args.join(', ');
                if (functor.brackets)
                    str += ')';
            }
            if (options.brackets)
                str += ')';
        }

        printf('  --> ' + str);

        return str;
    };

    Expression.prototype.toLatex = function() {
        var functor = this.functor;
        var str = '';
        var arg;
        
        //  Unary operators
        if (functor.prefix && this.arity === 1) {
            arg = this.args[0];
            var prec = arg.precedence();

            str += functor.latex + ' ';

            if (functor.brackets && functor.curly) {
                str += '{' + arg.toLatex() + '}';
            } else {
                if (prec === -1) 
                    str += arg.toLatex();
                else {
                    if (prec > this.precedence())
                        str += '(';
                    str += arg.toString();
                    if (prec > this.precedence())
                        str += ')';
                }
            }
            return str;
        }

        if (this.arity === 2) {
            str += this.args[0].toLatex();
            str += ' ';
            str += this.functor.latex;
            str += ' ';
            str += this.args[1].toLatex();

            return str;
        }

        str += this.functor;

        str += '(';
        for (var i=0; i<this.arity; i++) {
            arg = this.args[i];

            if (arg.toLatex) 
                str += this.args[i].toLatex();
            else
                throw 'this.Expression.toLatex: no latex for ' + arg;
            if (i+1 < this.arity)
                str += ', ';
        }
        str += ')';

        return str;
    };

    /**
     *  Succeeds if the expression's functor is associative (when evaluating
     *  the order does not matter).  For example, + is associative: a + (b +
     *  c) = (a + b) + c.
     */
    Expression.prototype.associative = function() {
        return use_default(this.functor.associative, false);
    };

    Expression.prototype.reparent = function() {
        this.parent = null;

        for (var i=0; i<this.arity; i++) {
            this.arg(i).parent = this;
            this.arg(i).depth = 1;
            this.arg(i)._reparent2();
        }

        return this;
    };

    Expression.prototype._reparent2 = function() {
        for (var i=0; i<this.arity; i++) {
            this.arg(i).parent = this;
            this.arg(i).depth = this.depth + 1;
            this.arg(i)._reparent2();
        }
    };

    Expression.prototype.check_parent = function() {
        for (var i=0; i<this.arity; i++) {
            if (this.arg(i).parent !== this) {
                printf('Check_parent');
                printf('  root ' + this.root());
                printf('  this ' + this);
                printf('  arg  ' + i + ' ' + this.arg(i));
                trace('check_parent');
                return false;
            }
            if (is.Expression(this.arg(i)))
                this.arg(i).check_parent();
        }
        return true;
    };

    Expression.prototype.check_depth = function(depth) {
        if (depth === undefined) {
            var root = this.root();

            if (root.depth !== 0) {
                printf('Check_depth');
                printf('  root ' + this.root());
                printf('  non zero depth ' + root.depth);
                trace('check depth');
                return false;
            }
            return root.check_depth(0);
        }

        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);

            if (arg.depth !== depth+1) {
                printf('Check_depth');
                printf('  root  ' + this.root());
                printf('  this  ' + this);
                printf('  arg   ' + arg);
                printf('  arg d ' + arg.depth);
                printf('  depth ' + depth);
                trace('check depth');
                return false;
            }
            if (!arg.check_depth(depth+1))
                return false;
        }
        return true;
    };


    /**
     *  Succeeds if the expression's functor is commutative (the order does
     *  not matter.  For example, + is commutative: a + b = b + a.
     */
    Expression.prototype.commutative = function() {
        return use_default(this.functor.commutative, false);
    };

    Expression.prototype.arg = function(i) {
        return this.args[i];
    };

    Expression.prototype.set_arg = function(i, exp2) {
        this.args[i] = exp2;
        exp2.parent = this;
        exp2.set_depth(this.depth+1);

        return this;
    };

    Expression.prototype.set_depth = function(depth) {
        this.depth = depth;

        for (var i=0; i<this.arity; i++) {
            this.arg(i).set_depth(depth + 1);
        }
        return this;
    };

    Expression.prototype.precedence = function() {
        if (this.functor && this.functor.precedence !== undefined)
            return this.functor.precedence;
    };

    Expression.prototype.equal = function(exp2) {
        if (this.functor === exp2.functor && this.arity === exp2.arity) {
            for (var i=0; i<this.arity; i++) 
                if (!(this.args[i].equal(exp2.args[i])))
                    return false;
            return true;
        }
        return false;
    };

    /**
     *  Succeed when the expression is ground, i.e., does not contain wildcards
     *  (instances of Any).
     *
     *  @returns {Boolean} - true when expression is ground
     */
    Expression.prototype.ground = function() {
        for (var i=0; i<this.arity; i++) {
            if (is.Any(this.args[i])) {
                if (this.args[i].binding)
                    continue;
                return false;
            }
            if (is.Literal(this.args[i]))
                continue;
            if (!this.args[i].ground())
                return false;
        }
        return true;
    };

    /**
     *  Succeed when the expression is unbound, i.e., does not contain wildcards
     *  which have a binding.
     *
     *  @returns {Boolean} - true when expression is unbound
     */
    Expression.prototype.unbound = function() {
        for (var i=0; i<this.arity; i++) {
            if (is.Any(this.args[i])) {
                if (this.args[i].binding)
                    return false;
            }
            if (is.Expression(this.args[i]))
                if (!this.args[i].unbound())
                    return false;
        }
        return true;
    };

    /**
     *  Replace this expression by the argument.
     */
    Base.prototype.replace = function(exp2) {
        var parent = this.parent;

        if (!parent)
            return null;

        if (!is.Expression(parent))
            return null;

        for (var i=0; i<parent.arity; i++) {
            if (parent.args[i] === this) {
                parent.args[i] = exp2;
                exp2.parent = parent;
                exp2.set_depth(parent.depth + 1);
//                this.root().check();
                return this;
            }
        }

        return null;
    };

    Base.prototype.in_different_branches = function(exp2) {
        if (this === exp2)
            return false;
        if (this.depth < exp2.depth)
            return this.in_different_branches(exp2.parent);
        if (this.depth > exp2.depth)
            return this.parent.in_different_branches(exp2);
        return true;
    };

    Base.prototype.common_functor = function(exp2, functor) {
/*
        printf('COMMON FUNCTOR ' + functor.symbol);
        printf('  l = ' + this);
        printf('  r = ' + exp2);
        printf(' in = ' + this.root());
*/

        if (this.depth === exp2.depth) {
            var exp1 = this;

            while (exp1.parent) {
                exp1 = exp1.parent;
                exp2 = exp2.parent;

                if (exp1 === exp2)
                    return exp1.functor === functor;
                if (exp1.functor !== functor || exp2.functor !== functor)
                    return false;
            }
            return false;
        }

        if (this.depth < exp2.depth)
            return exp2.parent.functor === functor && this.common_functor(exp2.parent, functor);

        return this.parent.functor === functor && this.parent.common_functor(exp2, functor);
    };

    Expression.prototype.rewrite_rule = function(rule) {
//        printf('Expression.rewrite_rule ' + this);
//        printf('Expression.rewrite_rule ' + rule.pattern);

        var rval;

        if (rule.associative) {
            rval = this.rewrite_associative(rule);
            if (!rule.pattern.unbound()) {
                printf('================= pattern not unbound ' + rule.pattern);
                rule.pattern.deunify();
            }
            if (rule.status.rewritten)
                rval.root().set_depth(0);	// TBD - fixes wrong .depth
//            rval.check();
            return rval;
        }

        var exp2 = rule.pattern;
        var sub = rule.substitute;

        rule.status = { rewritten: false };

        var result = this.rewrite(exp2, sub, rule.status);

        if (rule.status.rewritten) {
            if (!rule.pattern.unbound()) {
                printf('================= pattern not unbound ' + rule.pattern);
                rule.pattern.deunify();
            }
            return result;
        }

        if (rule.commutative) {
            exp2.swap_left_right();
            result = this.rewrite(exp2, sub, rule.status);
            exp2.swap_left_right();
        }

        if (!rule.pattern.unbound()) {
            printf('================= pattern not unbound ' + rule.pattern);
            rule.pattern.deunify();
        }

        return result;
    };

    Expression.prototype.swap_left_right = function() {
        var r = this.args[1];

        this.args[1] = this.args[0];
        this.args[0] = r;

        return this;
    };

    Expression.prototype.rewrite = function(exp2, sub, status) {
//        printf('Expression.rewrite ' + this);
//        printf('  exp2 ' + exp2);
//        printf('  sub  ' + sub);
        var exp1 = this.rewrite2(exp2, sub, status);
//        printf(' ====> ' + exp1);
        exp1.check();

        for (var i=0; i<exp1.arity; i++) {
            if (is.Expression(exp1.args[i]))
                //  TBD - check status before set_arg (performance)
                exp1.set_arg(i, exp1.args[i].rewrite2(exp2, sub, status));
        }

        return exp1;
    };

    Expression.prototype.rewrite2 = function(exp2, sub, status) {
//        printf('  Expression.rewrite2 ' + this);
//        printf('    exp2 ' + exp2);
//        printf('    sub  ' + sub);

        var rval;

        if (this.arity === exp2.arity && this.functor === exp2.functor) {
            rval = this.rewrite3(exp2, sub, status);

            if (status.rewritten)
                return rval;
        }
        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);

            if (is.Expression(arg)) {
                rval = arg.rewrite2(exp2, sub, status);
                if (status.rewritten) {
                    this.set_arg(i, rval);
                    return this;
                }
            }
        }
        return this;
    };

    Expression.prototype.rewrite3 = function(exp2, sub, status) {
//        printf('    Expression.rewrite3 ' + this);
//        printf('      exp2 ' + exp2);
//        printf('      sub  ' + sub);

        for (var i=0; i<this.arity; i++) {
            if (exp2.arg(i).unify(this.arg(i))) {
                continue;
            }
            exp2.deunify();
            return this;
        }

        var rval = this;

        if (exp2.ground()) {
            rval = copy_substition(sub);
            status.rewritten = true;
        }

        exp2.deunify();

        rval.check();

        return rval;
    };

    Expression.prototype.rewrite_associative = function(rule) {
        var exp2 = rule.pattern;
        var sub = rule.substitute;
        var left = exp2.left();
        var right = exp2.right();
        var sub1 = [];
        var sub2 = [];

        rule.status = { rewritten: false };

        this.unifying_subs(left, sub1, right, sub2);	// TBD - expensive

        for (var i=0; i<sub1.length; i++) {
            var l = sub1[i];

            l.unify(left);
            for (var j=0; j<sub2.length; j++) {
                var r = sub2[j];

                if (!l.in_different_branches(r))
                    continue;

                if (r.unify(right)) {
                    if (l.common_functor(r, rule.functor)) {
                        var extra = copy_substition(sub);

/*
                        printf('    l ' + l);
                        printf('    r ' + r);
                        printf('    left  ' + left);
                        printf('    right ' + right);
*/
                        l.replace(extra);
                        r.replace(rule.functor.identity.copy());
                        left.deunify();
                        right.deunify();
                        rule.status.rewritten = true;

                        //  Return a new expression because we are at
                        //  the root.  For example: a + 0.
                        if (r.depth === 1)
                            return r.parent._clean_up2();

                        //  Clean up the identity we just introduced.
                        r.parent._clean_up();
                        return this;
                    }
                    right.deunify();
                }
            }
            left.deunify();
        }

        return this;
    };
                
    Expression.prototype._clean_up = function() {
        if (this.left().equal(this.functor.identity)) {
            return this.replace(this.right());
        }
        if (this.right().equal(this.functor.identity)) {
            return this.replace(this.left());
        }
        throw '_clean_up';
    };

    Expression.prototype._clean_up2 = function() {
        if (this.left().equal(this.functor.identity)) {
            return this.right().reparent();
        }
        if (this.right().equal(this.functor.identity)) {
            return this.left().reparent();
        }
        throw '_clean_up2';
    };

    Expression.prototype.unifying_subs = function(left, sub1, right, sub2) {
        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);

            if (arg.unify(left)) {
                sub1.push(arg);
                left.deunify();
            }
            if (arg.unify(right)) {
                sub2.push(arg);
                right.deunify();
            }
            if (is.Expression(arg))
                arg.unifying_subs(left, sub1, right, sub2);
        }
    };

    Expression.prototype.copy = function(unify) {
        var args = [];

        for (var i=0; i<this.arity; i++) {
            args.push(this.args[i].copy(unify));
        }

        return new Expression(this.functor, args);
    };

    Expression.prototype.contains = function(exp2) {
        if (this.equal(exp2))
            return true;

        for (var i=0; i<this.arity; i++) {
            if (this.args[i].contains(exp2))
                return true;
        }

        return false;
    };

    Expression.prototype.compute = function(settings) {
        var vars = this.variables();

        for (var v in settings) {
            var variable = vars[v];

            if (variable) {
                variable.set_value(settings[v]);
            }
        }

        return this.evaluate();
    };

    Expression.prototype._variables = function(vars) {
        for (var i=0; i<this.arity; i++) {
            this.args[i]._variables(vars);
        }

        return vars;
    };

    /**
     *  Succeed when the value can be computed.
     */
    Expression.prototype.can_compute_value = function() {
        for (var i=0; i<this.arity; i++) {
            if (!this.args[i].can_compute_value())
                return false;
        }
        return true;
    };

    Expression.prototype.left = function() {
        if (this.arity != 2)
            trace('Error: no left when arity unequal to 2');
        return this.args[0];
    };

    Expression.prototype.right = function() {
        if (this.arity != 2)
            throw 'Error: no right when arity unequal to 2';
        return this.args[1];
    };

    Expression.prototype.traverse = function(func) {
        for (var i=0; i<this.arity; i++) {
            var arg = this.args[i];

            func.call(arg);
            if (arg instanceof Expression)
                arg.traverse(func);
        }
    };

    Expression.prototype.unify = function(exp) {
//        printf('        Expression.unify ' + this + ' =/= ' + exp);
        var rval = false;

        if (is.Any(exp))
            return exp.unify(this);

        if (is.Expression(exp) && this.arity === exp.arity && this.functor === exp.functor) {
            rval = true;
            
            for (var i=0; i<this.arity; i++) {
                var arg1 = this.args[i];
                var arg2 = exp.args[i];

                if (arg1.unify(arg2))
                    continue;
                rval = false;
                break;
            }
            return rval;
        }

        if (is.Literal(exp))
            return this.equal(exp);

        return false;
    };

    Expression.prototype.unify_deep = function(exp) {
        var rval = [];

        this.unify_deep2(exp, rval);

        return rval;
    };

    Expression.prototype.unify_deep2 = function(exp, sofar) {
//        printf('unify_deep2 ' + this);
//        printf('unify_deep2 ' + exp);
        if (this.unify(exp)) {
            sofar.push(this);
            exp.deunify();
        }

        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);

            if (is.Expression(arg))
                arg.unify_deep2(exp, sofar);
            else {
                if (arg.unify(exp)) {
                    exp.deunify();
                    sofar.push(arg);
                }
            }
        }
    };

    Expression.prototype.deunify = function() {
        var i;

        for (i=0; i<this.arity; i++) {
            this.args[i].deunify();
        }

        return this;
    };


    /*------------------------------------------------------------
     *  Minus
     *------------------------------------------------------------*/

    Minus = timo.Minus = function(exp) {
        Expression.call(this, Functor.Minus, exp);

        return this;
    };

    is.Minus = function(obj) {
        return obj instanceof Minus;
    };

    extend(Minus, Expression);

    Minus.prototype.class_name = function() {
        return 'Minus';
    };

    Minus.prototype.copy = function(unify) {
        return new Minus(this.args[0].copy(unify));
    };

    Minus.prototype.evaluate = function() {
        var value = this.arg(0).evaluate();

        if (is.Value(value))
            return Calculate.minus(value);
        return null;
    };

    /*------------------------------------------------------------
     *  Plus
     *------------------------------------------------------------*/

    Plus = timo.Plus = function(exp) {
        Expression.call(this, Functor.Plus, exp);

        return this;
    };

    is.Plus = function(obj) {
        return obj instanceof Plus;
    };

    extend(Plus, Expression);

    Plus.prototype.class_name = function() {
        return 'Plus';
    };

    Plus.prototype.copy = function(unify) {
        return new Plus(this.args[0].copy(unify));
    };

    Plus.prototype.evaluate = function() {
        return this.arg(0).evaluate();
    };

    /*------------------------------------------------------------
     *  Equals
     *------------------------------------------------------------*/

    Equals = timo.Equals = function(left, right) {
        Expression.call(this, Functor.Equals, left, right);

        return this;
    };

    is.Equals = function(obj) {
        return obj instanceof Equals;
    };

    extend(Equals, Expression);

    Equals.prototype.class_name = function() {
        return 'Equals';
    };

    Equals.prototype.copy = function(unify) {
        return new Equals(this.left().copy(unify), this.right().copy(unify));
    };

    Equals.prototype.evaluate = function() {
        var left = this.left().evaluate();
        var right = this.right().evaluate();

        if (is.Value(left) || is.Value(right))
            return Calculate.equal(left, right);

        return null;
    };


    /*------------------------------------------------------------
     *  Add
     *------------------------------------------------------------*/

    Add = timo.Add = function() {
        var len = arguments.length;

        if (len === 1 && is.array(arguments[0]))
            Expression.call(this, Functor.Add, arguments[0]);
        else 
            Expression.call(this, Functor.Add, Array.prototype.slice.call(arguments));
    };

    is.Add = function(obj) {
        return obj instanceof Add;
    };

    extend(Add, Expression);

    Add.prototype.class_name = function() {
        return 'Add';
    };

    Add.prototype.copy = function(unify) {
        var args = [];

        for (var i=0; i<this.arity; i++)
            args[i] = this.arg(i).copy(unify);
        return new Add(args);
    };

    Add.prototype.evaluate = function() {
        var sum = Calculate.Number(0);

        for (var i=0; i<this.arity; i++) {
            var value = this.arg(i).evaluate();

            if (!is.Value(value))
                return null;

            sum = Calculate.add(sum, value);
        }

        return sum;
    };


    /*------------------------------------------------------------
     *  Funct
     *------------------------------------------------------------*/

    Funct = timo.Funct = function() {
        var len = arguments.length;

        if (len === 2 && is.array(arguments[1]))
            Expression.call(this, arguments[0], arguments[1]);
        else {
            var name = arguments[0][0];
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);
            Expression.call(this, name, args);
        }
    };

    is.Funct = function(obj) {
        return obj instanceof Funct;
    };

    extend(Funct, Expression);

    Funct.prototype.class_name = function() {
        return 'Funct';
    };

    Funct.prototype.copy = function(unify) {
        var args = [];
        
        for (var i=0; i<this.arity; i++)
            args[i] = this.arg(i).copy(unify);

        return new Funct(this.functor, args);
    };


    /*------------------------------------------------------------
     *  Sine
     *------------------------------------------------------------*/

    Sine = timo.Sine = function(arg) {
        pp(Functor.Sine);
        Expression.call(this, Functor.Sine, arg);
    };

    is.Sine = function(obj) {
        return obj instanceof Sine;
    };

    extend(Sine, Expression);

    Sine.prototype.class_name = function() {
        return 'Sine';
    };

    Sine.prototype.trigonometry = function() {
        return true;
    };

    Sine.prototype.copy = function(unify) {
        return new Sine(this.arg(0).copy(unify));
    };

    Sine.prototype.evaluate = function() {
        var arg = this.arg(0).evaluate();

        if (is.Value(arg))
            return Calculate.sine(arg);
        throw 'Sine.evaluate: argument invalid ' + this.arg(0);

        //  0 -> 0
        //  1/12 pi -> (sqrt(6) - sqrt(2)) / 4
        //  2/12 pi -> 0.5
        //  3/12 pi -> sqrt(2) / 2
        //  4/12 pi -> sqrt(3) / 2
        //  5/12 pi -> (sqrt(6) + sqrt(2)) / 4
        //  6/12 pi -> 1
    };

    Sine.prototype.minimum = function() {
        return Calculate.Number(-1);
    };

    Sine.prototype.maximum = function() {
        return Calculate.Number(1);
    };


    /*------------------------------------------------------------
     *  Cosine
     *------------------------------------------------------------*/

    Cosine = timo.Cosine = function(arg) {
        Expression.call(this, Functor.Cosine, arg);
        return this;
    };

    is.Cosine = function(obj) {
        return obj instanceof Cosine;
    };

    extend(Cosine, Expression);

    Cosine.prototype.class_name = function() {
        return 'Cosine';
    };

    Cosine.prototype.trigonometry = function() {
        return true;
    };

    Cosine.prototype.copy = function(unify) {
        return new Cosine(this.arg(0).copy(unify));
    };

    Cosine.prototype.evaluate = function() {
        var arg = this.arg(0).evaluate();

        if (is.Value(arg))
            return Calculate.cosine(arg);
        throw 'timo.Cosine.evaluate: argument invalid: ' + this.arg(0);
    };

    Cosine.prototype.value = function() {
        throw 'timo.Cosine.value: not defined, use .evaluate()';
    };


    /*------------------------------------------------------------
     *  Tangent
     *------------------------------------------------------------*/

    Tangent = timo.Tangent = function(arg) {
        Expression.call(this, Functor.Tangent, arg);
        return this;
    };

    is.Tangent = function(obj) {
        return obj instanceof Tangent;
    };

    extend(Tangent, Expression);

    Tangent.prototype.class_name = function() {
        return 'Tangent';
    };

    Tangent.prototype.trigonometry = function() {
        return true;
    };

    Tangent.prototype.copy = function(unify) {
        return new Tangent(this.arg(0).copy(unify));
    };

    Tangent.prototype.evaluate = function() {
        var arg = this.arg(0).evaluate();

        if (is.Value(arg))
            return Calculate.tangent(arg);
        throw 'timo.Tangent.evaluate: argument invalid: ' + this.arg(0);
    };



    /*------------------------------------------------------------
     *  Subtract
     *------------------------------------------------------------*/

    Subtract = timo.Subtract = function(left, right) {
        Expression.call(this, Functor.Subtract, left, right);
        return this;
    };

    is.Subtract = function(obj) {
        return obj instanceof Subtract;
    };

    extend(Subtract, Expression);

    Subtract.prototype.class_name = function() {
        return 'Subtract';
    };

    Subtract.prototype.copy = function(unify) {
        return new Subtract(this.left().copy(unify), this.right().copy(unify));
    };

    Subtract.prototype.evaluate = function() {
        var left = this.left().evaluate();
        var right = this.right().evaluate();

        if (is.Value(left) && is.Value(right))
            return Calculate.subtract(left, right);
        return null;
    };


    /*------------------------------------------------------------
     *  Multiply
     *------------------------------------------------------------*/

    Multiply = timo.Multiply = function() {
        var len = arguments.length;

        if (len === 1 && is.array(arguments[0]))
            Expression.call(this, Functor.Multiply, arguments[0]);
        else 
            Expression.call(this, Functor.Multiply, Array.prototype.slice.call(arguments));
    };

    is.Multiply = function(obj) {
        return obj instanceof Multiply;
    };

    extend(Multiply, Expression);

    Multiply.prototype.class_name = function() {
        return 'Multiply';
    };

    Multiply.prototype.copy = function(unify) {
        var args = [];

        for (var i=0; i<this.arity; i++)
            args.push(this.arg(i).copy(unify));
        return new Multiply(args);
    };

    Multiply.prototype.evaluate = function() {
        var product = Calculate.Number(1);

        for (var i=0; i<this.arity; i++) {
            var value = this.arg(i).evaluate();

            if (!is.Value(value))
                return null;
            product = Calculate.multiply(product, value);
        }

        return product;
    };


    /*------------------------------------------------------------
     *  Power
     *------------------------------------------------------------*/

    Power = timo.Power = function(left, right) {
        Expression.call(this, Functor.Power, left, right);
    };

    is.Power = function(obj) {
        return obj instanceof Power;
    };

    extend(Power, Expression);

    Power.prototype.class_name = function() {
        return 'Power';
    };

/* Should be a general case.*/
    Power.prototype.toLatex = function() {
        return this.left().toLatex() + this.functor.latex + '{' + this.right().toLatex() + '}';
    };
/**/

    Power.prototype.copy = function(unify) {
        return new Power(this.left().copy(unify), this.right().copy(unify));
    };

    Power.prototype.evaluate = function() {
        var left = this.left().evaluate();
        var right = this.right().evaluate();

        if (is.Value(right) && !Calculate.isInteger(right))
            throw 'Power.evaluate: exponent not an integer: ' + right;

        if (is.Value(left) && is.Value(right))
            return Calculate.power(left, right);

        return null;
    };


    /*------------------------------------------------------------
     *  Logarithm
     *------------------------------------------------------------*/

    Logarithm = timo.Logarithm = function(arg, base) {
        this.base = use_default(base, timo.e);
        Expression.call(this, Functor.Logarithm, arg);
    };

    is.Logarithm = function(obj) {
        return obj instanceof Logarithm;
    };

    extend(Logarithm, Expression);

    Logarithm.prototype.class_name = function() {
        return 'Logarithm';
    };

    Logarithm.prototype.toLatex = function() {
        if (this.base === timo.e)
            return this.functor.latex + '(' + this.arg(0).toLatex() + ')';
        return this.functor.latex + '_' + this.base + '(' + this.arg(0).toLatex() + ')';
    };

    Logarithm.prototype.copy = function(unify) {
        return new Logarithm(this.base, this.arg(0).copy(unify));
    };

    Logarithm.prototype.evaluate = function() {
        var val = this.arg(0).evaluate();

        if (is.Value(val)) {
            if (val < 0)
                return NaN;
            return Calculate.logarithm(val, this.base);
        }

        return null;
    };


    /*------------------------------------------------------------
     *  Square root
     *------------------------------------------------------------*/

    Sqrt = timo.Sqrt = function(arg, degree) {
        this.degree = use_default(degree, 2);	// TBD - degree should be an expression
        Expression.call(this, Functor.Sqrt, arg);
    };

    is.Sqrt = function(obj) {
        return obj instanceof Sqrt;
    };

    extend(Sqrt, Expression);

    Sqrt.prototype.class_name = function() {
        return 'Sqrt';
    };

    Sqrt.prototype.toLatex = function() {
        if (this.degree === 2)
            return this.functor.latex + '{' + this.arg(0).toLatex() + '}';
        return this.functor.latex + '[' + this.degree + ']' + '{' + this.arg(0).toLatex() + '}';
    };

    Sqrt.prototype.copy = function(unify) {
        return new Sqrt(this.arg(0).copy(unify), this.degree);
    };

    Sqrt.prototype.evaluate = function() {
        var arg = this.arg(0);

        var value = arg.evaluate();

        if (is.Value(value)) {
            if (value < 0)		// TBD - roots of negative numbers
                return NaN;
            return Calculate.sqrt(value, this.degree);
        }
        return null;
    };

 
    /*------------------------------------------------------------
     *  Divide
     *------------------------------------------------------------*/

    Divide = timo.Divide = function(left, right) {
        Expression.call(this, Functor.Divide, left, right);
        return this;
    };

    is.Divide = function(obj) {
        return obj instanceof Divide;
    };

    extend(Divide, Expression);

    Divide.prototype.class_name = function() {
        return 'Divide';
    };

    Divide.prototype.copy = function(unify) {
        return new Divide(this.left().copy(unify), this.right().copy(unify));
    };

    Divide.prototype.evaluate = function() {
        var den = this.args[0].evaluate();
        var num = this.args[1].evaluate();

        if (is.Value(den) && is.Value(num)) {
            if (num === 0)
                return NaN;
            return den / num;
        }
        return null;
    };

    /*------------------------------------------------------------
     *  Fraction
     *------------------------------------------------------------*/

    Fraction = timo.Fraction = function(left, right) {
        Expression.call(this, Functor.Fraction, left, right);
        return this;
    };

    is.Fraction = function(obj) {
        return obj instanceof Fraction;
    };

    extend(Fraction, Divide);

    Fraction.prototype.class_name = function() {
        return 'Fraction';
    };

    Fraction.prototype.toLatex = function() {
        return '\\frac{' + this.left().toLatex() + '}{' + this.right().toLatex() + '}';
    };

    Fraction.prototype.copy = function(unify) {
        return new Fraction(this.left().copy(unify), this.right().copy(unify));
    };

    Fraction.prototype.evaluate = function() {
        var den = this.args[0].evaluate();
        var num = this.args[1].evaluate();

        if (is.Value(den) && is.Value(num)) {
            if (num === 0)
                return NaN;
            return den / num;
        }
        return null;
    };

    /*------------------------------------------------------------
     *  Literal: abstract class for all literals (variables, numbers, ...)
     *------------------------------------------------------------*/

    Literal = timo.Literal = function() {
        Base.call(this);

        this.type = 'Literal';

        return this;
    };

    is.Literal = function(obj) {
        return obj instanceof Literal;
    };

    extend(Literal, Base);

    Literal.prototype.class_name = function() {
        return 'Literal';
    };

/*
    Literal.prototype.compute = function() {
        return this.value;
    };
*/

    Literal.prototype.evaluate = function() {
        return this.value;
    };

    Literal.prototype.unify = function(l2) {
        if (is.Any(l2))
            return l2.unify(this);
        return this.equal(l2);
    };

    Literal.prototype.rewrite = function() {
        return this;
    };

    /**
     *  Creates a Numerical (the overall class for numbers).
     *
     *  @class Numerical
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Numerical = timo.Numerical = function(val) {
        Literal.call(this);

        var value = null;

        if (is.string(val)) value = timo.make_numerical(val);
        if (is.Numerical(val)) value = val.value;
        if (is.BigNumber(val)) value = val;
        if (is.number(val)) value = Calculate.Number(val);

        if (is.Value(value)) {
            Object.defineProperty(this, 'value', {
                enumerable: true,
                writable: false,
                value: value
            });

            return;
        }

        throw 'Numerical: argument not a number ' + val;
    };

    is.Numerical = function(obj) {
        return obj instanceof Numerical;
    };

    extend(Numerical, Literal);

    Numerical.prototype.class_name = function() {
        return 'Numerical';
    };

    Numerical.prototype.toString = function() {
        if (this.string) {
            return this.string;
        }
        return this.value.toString();
    };

    Numerical.prototype.toLatex = function() {
        return this.value.toString();
    };

    Numerical.prototype.copy = function() {
        return new Numerical(this.value);
    };

    Numerical.prototype.equal = function(n2) {
        if (is.Numerical(n2))
            return this.value.equals(n2.value);		// BigNumber
        throw 'Numerical.equal: argument not a numerical';
    };


    /**
     *  Creates a Quantity
     *
     *  @class Quantity
     *  @param {number|BigNumber|Quantity} value - Quantity value.
     *  @throws Error when argument is not a number.
     */
    Quantity = timo.Quantity = function(val, unit) {
        Literal.call(this);

        this.unit = unit;

        var value = null;

        if (is.Quantity(val)) value = val.value;
        if (is.BigNumber(val)) value = val;
        if (is.number(val)) value = Calculate.Number(val);

        if (is.Value(value)) {
            Object.defineProperty(this, 'value', {
                enumerable: true,
                writable: false,
                value: value
            });

            return;
        }

        throw 'Quantity: argument not a number ' + val;
    };

    is.Quantity = function(obj) {
        return obj instanceof Quantity;
    };

    extend(Quantity, Literal);

    Quantity.prototype.class_name = function() {
        return 'Quantity';
    };

    Quantity.prototype.toString = function() {
        return this.value.toString() + ' ' + this.unit;
    };

    Quantity.prototype.toLatex = function() {
        return this.value.toString() + ' ' + this.unit;
    };

    Quantity.prototype.copy = function() {
        return new Quantity(this.value, this.unit);
    };

    Quantity.prototype.evaluate = function() {
        return this.value;
    };

    Quantity.prototype.equal = function(q2) {
        if (is.Quantity(q2))
            return this.value.equals(q2.value) && this.unit === q2.unit;
        throw 'Quantity.equal: argument not a quantity';
    };


    /**
     *  Creates a Real number.
     *
     *  @class Real
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Real = timo.Real = function(val) {
        Numerical.call(this, Calculate.Number(val));
    };

    is.Real = function(obj) {
        return obj instanceof Real;
    };

    extend(Real, Numerical);

    Real.prototype.class_name = function() {
        return 'Real';
    };

    Real.prototype.copy = function() {
        return new Real(this.value);
    };

    Real.prototype.evaluate = function() {
        return this.value;
    };


    /**
     *  Creates a Irrational number.
     *
     *  @class Irrational
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Irrational = timo.Irrational = function(val) {
        Real.call(this, val);

        return this;
    };

    is.Irrational = function(obj) {
        return obj instanceof Irrational;
    };

    extend(Irrational, Real);

    Irrational.prototype.class_name = function() {
        return 'Irrational';
    };

    Irrational.prototype.copy = function() {
        return new Irrational(this.value);
    };


    /**
     *  Creates a Rational number.
     *
     *  @class Irrational
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Rational = timo.Rational = function(val) {
        Real.call(this, val);

        return this;
    };

    is.Rational = function(obj) {
        return obj instanceof Rational;
    };

    extend(Rational, Real);

    Rational.prototype.class_name = function() {
        return 'Rational';
    };

    Rational.prototype.copy = function() {
        return new Rational(this.value);
    };


    /**
     *  Creates an Integer.
     *
     *  @class Integer
     *  @param {number|BigNumber|Integer} value - The numerical value.
     *  @throws Error when argument is not a number.
     */
    Integer = timo.Integer = function(val) {
        var value = Calculate.Number(val);

        if (!Calculate.isInteger(value))
            throw 'Integer: value not an integer ' + val;
        Real.call(this, value);
    };

    is.Integer = function(obj) {
        return obj instanceof Integer;
    };

    extend(Integer, Real);

    Integer.prototype.class_name = function() {
        return 'Integer';
    };

    Integer.prototype.copy = function() {
        return new Integer(this.value);
    };

    Integer.prototype.evaluate = function() {
        return this.value;
    };

    /**
     *  Creates an Natural number.
     *
     *  @class Natural
     *  @param {number|BigNumber|Natural} value - The numerical value.
     *  @throws Error when argument is not a number.
     */
    Natural = timo.Natural = function(val) {
        var value = Calculate.Number(val);

        if (!Calculate.isInteger(value))
            throw 'Natural: value not a natural ' + val;
        if (value.isNegative())
            throw 'Natural: value is negative (use Integer) ' + val;
        Integer.call(this, value);
    };

    extend(Natural, Integer);

    Natural.prototype.class_name = function() {
        return 'Natural';
    };

    Natural.prototype.copy = function() {
        return new Natural(this.value);
    };

    Constant = timo.Constant = function(spec) {
        this.description = spec.description || '';
        this.symbol = spec.symbol;
        this.latex = spec.latex || this.symbol;

        Object.defineProperty(this, 'value', {
            enumerable: true,
            writable: false,
            value: spec.value
        });
    };

    extend(Constant, Literal);

    Constant.prototype.class_name = function() {
        return 'Constant';
    };

    Constant.prototype.toLatex = function() {
        if (this.latex)
            return this.latex;
        throw '[Constant]: No latex for ' + this.symbol;
    };


    Degree = timo.Degree = function(val) {
        var value = Calculate.Number(val);

        Real.call(this, value);
    };

    is.Degree = function(obj) {
        return obj instanceof Degree;
    };

    extend(Degree, Real);

    Degree.prototype.class_name = function() {
        return 'Degree';
    };

    Degree.prototype.copy = function() {
        return new Degree(this.value);
    };

    Degree.prototype.radians = function() {
        return Calculate.multiply(this.value, Calculate.degree());
    };


    /*------------------------------------------------------------
     *  Any: logical variables
     *------------------------------------------------------------*/

    Any = timo.Any = function(name, bind) {
        Base.call(this);

        this.name = (name === undefined ? '_' : name);
        this.binding = (bind === undefined ? null : bind);

        return this;
    };

    is.Any = function(obj) {
        return obj instanceof Any;
    };

    extend(Any, Base);

    Any.prototype.class_name = function() {
        return 'Any';
    };

    Any.prototype.toString = function() {
        if (this.binding)
            return 'any(' + this.name + '=' + this.binding + ')';
        return 'any(' + this.name + ')';
    };

    Any.prototype.unbound = function() {
        return this.binding === null;
    };

    Any.prototype.copy = function(unify) {
        if (unify) {
            if (this.binding)
                return this.binding.copy();
            throw 'Error: trying to unify ' + this + ' with no binding';
        }
        return new Any(undefined, this.binding);
    };

    Any.prototype.unify = function(exp) {
        if (this.binding === null) {
            this.binding = exp;
            return true;
        }
        return this.binding.equal(exp);
    };

    Any.prototype.deunify = function() {
        this.binding = null;
    };


    /*------------------------------------------------------------
     *  AnyReal: logical variable matching any number
     *------------------------------------------------------------*/

    AnyReal = timo.AnyReal = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    };

    is.AnyReal = function(obj) {
        return obj instanceof AnyReal;
    };

    extend(AnyReal, Any);

    AnyReal.prototype.class_name = function() {
        return 'AnyReal';
    };

    AnyReal.prototype.toString = function() {
        if (this.binding)
            return 'any_real(' + this.name + '=' + this.binding + ')';
        return 'any_real(' + this.name + ')';
    };

    AnyReal.prototype.unify = function(exp) {
        if (is.Real(exp)) {
            this.binding = exp;
            return true;
        }
        return false;
    };


    /*------------------------------------------------------------
     *  AnyInteger: logical variable matching any integer
     *------------------------------------------------------------*/

    AnyInteger = timo.AnyInteger = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    };

    is.AnyInteger = function(obj) {
        return obj instanceof AnyInteger;
    };

    extend(AnyInteger, Any);

    AnyInteger.prototype.class_name = function() {
        return 'AnyInteger';
    };

    AnyInteger.prototype.toString = function() {
        if (this.binding)
            return 'any_integer(' + this.name + '=' + this.binding + ')';
        return 'any_integer(' + this.name + ')';
    };

    AnyInteger.prototype.unify = function(exp) {
//        printf('        AnyInteger.unify ' + this);
//        printf('          ' + exp + ' ' + is.Integer(exp));
        if (is.Integer(exp)) {
            this.binding = exp;
            return true;
        }
        return false;
    };


    /*------------------------------------------------------------
     *  AnyNumerical: logical variable matching any numerical
     *------------------------------------------------------------*/

    AnyNumerical = timo.AnyNumerical = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    };

    is.AnyNumerical = function(obj) {
        return obj instanceof AnyNumerical;
    };

    extend(AnyNumerical, Any);

    AnyNumerical.prototype.class_name = function() {
        return 'AnyNumerical';
    };

    AnyNumerical.prototype.toString = function() {
        if (this.binding)
            return 'any_numerical(' + this.name + '=' + this.binding + ')';
        return 'any_numerical(' + this.name + ')';
    };

    AnyNumerical.prototype.unify = function(exp) {
//        printf('        AnyNumerical.unify ' + this);
//        printf('          ' + exp + ' ' + is.Numerical(exp));
        if (is.Numerical(exp)) {
            this.binding = exp;
            return true;
        }
        return false;
    };


    /*------------------------------------------------------------
     *  Variable: class for variables
     *------------------------------------------------------------*/

    Variable = timo.Variable = function(str, spec) {
        spec = spec || {};

        pp(spec);

        var sys = use_default(spec.system, DefaultSystem);

        if (sys.lookup_variable(str))
            return sys.lookup_variable(str);

        for (var p in spec) {	// Required?
            if (this[p] === undefined)
                this[p] = spec[p];
        }

        this.id = id();
        this.symbol = str;
        this.greek = use_default(spec.greek, false);
        this.latex = use_default(spec.latex, null);
        this.unicode = use_default(spec.unicode, null);
        this.subscript = use_default(spec.subscript, null);
        this.set_value(use_default(spec.value, null));
        this.type = 'Variable';

        sys.add_variable(this);

        return this;
    };

    is.Variable = function(obj) {
        return obj instanceof Variable;
    };

    Variable.prototype.class_name = function() {
        return 'Variable';
    };

    Variable.prototype.toString = function() {
        var symbol = (this.unicode || this.symbol);
        var sub = (this.subscript ? (this.subscript.unicode || this.subscript.symbol) : undefined);
        printf('Variable ');
        printf('  symbol ' + symbol);
        printf('  subscript ' + sub);

        if (sub)
            return symbol + ';' + sub;
        return symbol;
    };

    Variable.prototype.toLatex = function() {
        var str;

        printf('Variable.toLatex ' + this.symbol);
        printf('  - .unicode ' + this.unicode);
        printf('  - .latex   ' + this.latex);
        printf('  - .greek   ' + this.greek);

        if (this.subscript) {
            printf('  * .symbol  ' + this.subscript.unicode);
            printf('  * .unicode ' + this.subscript.unicode);
            printf('  * .latex   ' + this.subscript.latex);
            printf('  * .greek   ' + this.subscript.greek);
        }

        str = this.latex || this.unicode || this.symbol;

        if (this.subscript) {
            str += '_{';
            if (this.subscript.greek)
                str += '\\' + this.subscript.symbol;
            else
                str += this.subscript.symbol || this.subscript.unicode;
            str += '}';
        }
        return str;
    };

    Variable.prototype.copy = function() {
        return new Handle(this);
    };

    Variable.prototype.evaluate = function() {
        return this.value.evaluate();
    };

    Variable.prototype.set_value = function(value) {
        if (value === null) {
            this.value = null;
            return this;
        }
        if (is.number(value) || is.BigNumber(value)) {// TBD - Numerical
            var num = Calculate.Number(value);
            
            if (Calculate.isInteger(num)) {
                this.value = new Integer(num);
            } else
                this.value = new Real(num);
            this.modified = true;
            return this;
        }
        throw 'Variable.set_value: value not a number ' + value;
    };


    /*------------------------------------------------------------
     *  Handle: class for a pointer to a variable
     *------------------------------------------------------------*/

    Handle = timo.Handle = function(v) {
        Literal.call(this);

        if (is.Variable(v)) {
            Object.defineProperty(this, 'variable', {
                enumerable: true,
                writable: false,
                value: v
            });
            return this;
        }

        throw 'Handle: argument not a Variable ' + v;
    };

    is.Handle = function(obj) {
        return obj instanceof Handle;
    };

    extend(Handle, Literal);
    
    Handle.prototype.class_name = function() {
        return 'Handle';
    };

    Handle.prototype.toString = function() {
        return this.variable.toString();
    };

    Handle.prototype.toLatex = function() {
        return this.variable.toLatex();
    };

    Handle.prototype.equal = function(h2) {
        if (is.Handle(h2))
            return this.variable.symbol === h2.variable.symbol;
        if (is.Variable(h2))
            return this.variable.symbol === h2.symbol;
        return false;
    };

    Handle.prototype.copy = function() {
        return new Handle(this.variable);
    };

    Handle.prototype._variables = function(vars) {
        vars[this.variable.symbol] = this.variable;
        return vars;
    };

    Handle.prototype.evaluate = function() {
        return this.variable.evaluate();
    };

    Handle.prototype.symbol = function() {
        return this.variable.symbol();
    };

    /** Return a new array in which all duplicate elements of the argument array
     *  are removed.
     *
     *  @param {Array} a	Input array.
     *  @returns {Array}	New array without any duplicate elements.
     */
    timo.remove_duplicates = function(array) {
        var rval = [];

        for (var i=0; i<array.length; i++) {
            var e = array[i];

            if (array.indexOf(e, i+1) === -1)
                rval.push(e);
        }

        return rval;
    };

    /*------------------------------------------------------------
     *  System: a (named) system of equalities
     *------------------------------------------------------------*/

    System = timo.System = function(name) {
        var sys = this;

        sys.id = id();
        sys.name = name;

        sys.variables = {};		// Indexed by symbol
        sys.dependencies = {};		// Dependencies of the variables,
					// array of EqualsVariables
        sys.equalities = [];
        sys.expressions = [];
        sys.modified = false;		// Equalss have been added

        return sys;
    };

    is.System = function(obj) {
        return obj instanceof System;
    };

    System.prototype.add_variable = function(v) {
        if (!this.lookup_variable(v))
            this.variables[v.symbol] = v;

        return this;
    };

    System.prototype.lookup_variable = function(v) {
        var str = (is.string(v) ? v : v.symbol);

        return (this.variables[str] || null);
    };

    /**
     *  Returns an array of dependencies for variable v.  The array contains
     *  object literals of the form { equation: eq, variables: vars} where eq
     *  is an equation and vars the variables that are dependent on v.
     *
     *  @param {Variable} v	Variable for which to find dependencies
     *  @returns {Array}	Array of dependencies as object literals
     */
    System.prototype.dependencies = function(v) {
        var sys = this;
        var vs = sys.variables;
        var eqs = sys.equalities;
        var rval = [];

        for (var i=0; i<eqs.length; i++) {
            var eq = eqs[i];

            if (eq.contains(v)) {
                var deps = [];

                for (var p in vs) {
                    var w = vs[p];

                    if (v === w)
                        continue;
                    if (eq.contains(w))
                        deps.push(w);
                }
                if (deps.length > 0)
                    rval.push({
                        equation: eq,
                        variables: deps
                    });
            }
        }

        return rval;
    };

    System.prototype.pp_status = function() {
        var sys = this;
        var vs = sys.variables;

        printf('System status ');
        for (var p in vs) {
            var v = vs[p];
            printf(v.symbol() + '  value=' + v.value() + ' m=' + v.modified() + ' l=' + v.locked() + ' c=' +
                   v.constant() + ' u=' + v.updated());
        }
    };

    System.prototype.pretty_print = function() {
        var vars = this.variables;
        var v;

        printf('---- pretty print ---');
        printf('System ' + this.name);
        printf('  Variables ');
        pp(vars);
        for (v in vars) {
            var rv = vars[v];
            printf('    ' + rv.id + ' ' + rv.symbol + ' = ' + rv.value);
        }
        printf('  --*--*--*--');
        printf('  Equalities');
        for (v=0; v<this.equalities.length; v++) {
            printf('    ' + this.equalities[v]);
        }
        printf('<<<<<<<<<<<<<<<< done');
    };

    /**
     * Add an equation to the system.  Any variables in the equation that are
     * already in the system are made to point to the same variable. 
     */
    System.prototype.add_equation = function(eq) {
        var sys = this;

        if (!eq instanceof Equals)
            throw 'timo.System.add_equation(): not an equation ' + eq;

        eq.traverse(function() {
            if (is.Handle(this)) {
                if (!sys.lookup_variable(this.variable))
                    sys.add_variable(this.variable);
            }
        });
        sys.equalities.push(eq);
        sys.modified = true;

        return sys;
    };

    System.prototype.add_expression = function(exp) {
        var sys = this;

        if (!is.Expression(exp))
            throw 'timo.System.add_expression(): not an equation ' + exp;

        sys.expressions.push(exp);

        return sys;
    };

    System.prototype.printf_status = function() {
        var vs = this.variables;
        var p;

        for (p in vs) {
            var v = vs[p];
            printf(v + ' ' + v.value() + ' u=' + v.updated() + ' m=' +
                   v.modified() + ' ' + v.role());
        }
    };


    System.prototype.solve_modified = function(v) {
        if (v.updated()) {
            v.modified(false);
            return;
        }

        var sys = this;
        var deps = sys.dependencies(v);
        var i, j;

        v.modified(false);
        v.updated(true);	// Prevent cycles

        for (i=0; i<deps.length; i++) {
            var eq = deps[i].equation;
            var vs = deps[i].variables;

            if (vs.length < 1)
                continue;

            //  Only one dependent variable in this equation.
            //  Compute new value of the variable, and set modified flag.
            if (vs.length === 1) {
                sys.solve_single(eq, vs[0]);
                continue;
            }

            //  Multiple dependent variables.  Find one that needs to be computed.
            for (j=0; j<vs.length; j++) {
                var w = vs[j];
                if (w.role() === 'input' || w.role() === 'constant' || w.role() === 'i/o')
                    continue;
                sys.solve_single(eq, w);
                break;
            }
        }
    };

    System.prototype.solve_single = function(eq, v) {
        var right = eq.isolate_left(v);
                
        if (right) {
            var value = right.evaluate();
            
            if (value !== null) {
                v.value(value);
                v.modified(true);
//              v.updated(true);
            }
        } else {
            printf('*** Could not isolate ' + v + ' in ' + eq);
            v.updated(true);
        }
    };

    System.prototype.evaluate_equation = function(base_eq, v) {
        var sys = this;
        var deps = sys.dependencies;
        var evs = deps[v.id];
        
        for (var i=0; i<evs.length; i++) {
            var ev = evs[i];

            if (ev.equation() === base_eq) {
                var val = ev.expression().evaluate();
                v.value(val);
            }
        }

        return sys;
    };

    System.prototype.solve_unknowns = function(prev) {
        var sys = this;
        var unknowns = [];
        var vs = sys.variables;
        var deps = sys.dependencies;

        for (var p in vs) {
            var v = vs[p];
            
            if (v.unknown())
                unknowns.push(v);
        }

        if (unknowns.length === 0)
            return sys;

        if (prev) {
            var identical = true;
 
            for (var x=0; x<prev.length; x++) {
                if (prev[x] === unknowns[x])
                    continue;
                identical = false;
            }
            if (identical) {
                sys.pp_status();
                throw 'Error: loop in System.solve_unknowns';
            }                
        }

        for (var i=0; i<unknowns.length; i++) {
            var v = unknowns[i];

            if (!v.unknown())
                continue;

            var evs = deps[v.id];

            for (var j=0; j<evs.length; j++) {
                var ev = evs[j];
                var vs2 = ev.variables();
                var can_compute = true;

                for (var k=0; k<vs2.length; k++) {
                    if (vs2[k].unknown()) {
                        can_compute = false;
                        break;
                    }
                }
                if (can_compute) {
                    v.value(ev.expression().evaluate());
                    break;
                }
            }
        }
        
        return sys.solve_unknowns(unknowns);
    };

    System.prototype.initialise = function() {
        var sys = this;

        if (sys.modified) {
            sys.isolate_all();
            sys.modified = false;
        }
        
        return sys;
    };

    System.prototype.variable = function(v) {
        var sys = this;
        var vs = this.variables;

        if (typeof(v) === 'string') {
            for (var p in vs) {
                if (vs[p].name() === v || vs[p].symbol() === v)
                    return vs[p];
            }
            return null;
        }

        if (v instanceof Variable)
            return vs[v.id] ? v : null;

        return null;
    };

    System.prototype.solve = function() {
        var sys = this;

        //  Initialise
        if (sys.modified) {
            sys.isolate_all();
            sys.modified = false;
        }

        sys.solve_unknowns();

        var vs = sys._variables;
        var mods = [];

        for (var p in vs) {
            if (vs[p].modified() === true) {
                if (vs[p].locked())
                    throw 'timo.System.solve: variable ' + vs[p].symbol() + ' is both modified and locked';
                mods.push(vs[p]);
            }
        }

        solve_using_dependencies(mods);
        sys.clear_modifications();

        return sys;

        function solve_using_dependencies(mods) {
            var new_mods = [];
            var deps = sys.dependencies;

            for (var k=0; k<mods.length; k++) {
                var v = mods[k];
                var evs = deps[v.id];

                if (v.locked())
                    throw 'timo.solve_using_dependencies(): trying to update locked variable ' + v.symbol();

                for (var i=0; i<evs.length; i++) {
                    var ev = evs[i];
                    var updatable = [];

                    for (var j=0; j<ev.variables().length; j++) {
                        var v2 = ev.variables()[j];

                        if (v2.is_modifiable() === false)
                            continue;
                        updatable.push(v2);
                    }

                    switch (updatable.length) {
                    case 0:
                        break;
                    case 1: 
                        v2 = updatable[0];
                        sys.evaluate_equation(ev.equation(), v2);
                        v2.modified(true);
                        new_mods.push(v2);
                        break;
                    default:
                        printf('---------------------------------');
                        printf('DETAILED ERROR REPORT');
                        printf('    variable ' + v.symbol());
                        printf('    dependencies ' + updatable);
                        sys.pp_status();
                        throw 'timo.System.solve: too many dependencies';
                    }
                }
                v.modified(false);
                v.updated(true);
            }

            if (new_mods.length > 0)
                return solve_using_dependencies(new_mods);
        }
    };

    var DefaultSystem = timo.DefaultSystem = new System('default');

    /*------------------------------------------------------------
     *  Utility functions
     *------------------------------------------------------------*/

    var current_id = 0;

    function spaces(n) {
        var str = '';
        while (n-- > 0)
            str += ' ';
        return str;
    }

    //  Used in rewriting
    function copy_substition(sub) {
        if (is.func(sub))
            return sub.call().copy(true);
        return sub.copy(true);
    }

    function id() {
        return ++current_id;
    }

    function trace(msg) {
        if (is.in_nodejs()) {
            console.trace(msg);
            throw msg;
        }
        throw msg;
    }

    timo.make_numerical = function(exp) {
        var rval, num;

        printf('timo.make_numerical ' + exp);
        if (is.Numerical(exp))
            return exp;
        if (is.string(exp)) {
            printf('is.string ' + exp);
            if (exp.match(/[\-+]?[0-9]/)) {
                printf('matches regex');
                num = Calculate.Number(exp);
                rval = (Calculate.isInteger(num) ? new Integer(num) : new Real(num));
                rval.string = exp;
                return rval;
            }
            throw 'make_numerical failed on ' + exp;
        }
        if (is.number(exp) || is.BigNumber(exp)) {
            printf('is.number');
            num = Calculate.Number(exp);

            if (Calculate.isInteger(num)) {
                return new Integer(num);
            }
            return new Real(num);
        }
        throw 'make_numerical failed on ' + exp;
    };

    if (is.in_nodejs()) {
        Calculate = require('./calculate');
        Functor = require('./functor');
    } else {
        Calculate = timo.calculate = timo.calculate || {};
        Functor = timo.functor = timo.functor || {};
    }

    var PI = timo.PI = new Constant({
        description: 'To be written.',
        symbol: 'pi',
        latex: '\\pi',
        value: Calculate.PI()
    });

    var E = timo.E = new Constant({
        description: "Euler's constant",
        symbol: 'e',
        latex: '\\mathrm{e}',
        value: Calculate.E()
    });

    timo.constants = {
        PI: PI,
        E: E
    };
}).call(this);
