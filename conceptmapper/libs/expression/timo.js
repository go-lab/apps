/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        timo.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Main code and angular handling
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     19/11/15  (Created)
 *		19/11/15  (Last modified)
 */ 

(function() {
    "use strict";

    printf('========== loading libs/expression/js/timo.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = utils.is;

    var timo = libs.timo = libs.timo || {};
    var Plot = timo.plot;

    timo.configuration = {};

    /**
     *  Called before angular is started.
     */
    timo.configure = function(spec, callback) {
        for (var p in spec)
            timo.configuration[p] = spec[p];
        callback();
    };

    /**
     *  Called after angular is finished.
     */
    timo.start = function(spec) {
        var scope = timo.scope;

        if (typeof(scope.start) === 'function')
            scope.start();
    };


    /**
     *  Call $apply() when changes made did not originate from angular.
     */
    timo.scope_apply = function() {
        var scope = timo.scope;

        if (!scope.$$phase) 
            scope.$apply();
    };

    /**
     * Set up angular.
     */
    var ng_timo = angular.module("timo", ['ngSanitize',
                                        'LocalStorageModule',
                                        'golabUtils',
                                        'textAngular'
                                       ]).config(
        function($sceDelegateProvider) {
            var url1 = timo.base_url + '/**';
            var url2 = 'http://go-lab.collide.info' + '/**';
            var url3 = 'http://golab.collide.info' + '/**';

            $sceDelegateProvider.resourceUrlWhitelist(
                [ url1, url2, url3
                ]);
        });

    ng_timo.controller("entry_controller", function($scope) {
        timo.scope = $scope;
        
        $scope.this_scope = 'Entry scope';
        $scope.base_url = timo.base_url;
        $scope.configuration = timo.configuration;

        $scope.entries = [];

        for (var i=0; i<10; i++) {
            $scope.entries[i] = {
                expression: '',
                latex: '',
                error: ''
            };
        }

        //  Second argument is in an element of entries above
        $scope.keyup_entry = function(event, entry) {
            return $scope.parse_entry(entry);
        };

        $scope.parse_entry = function(entry) {
            var str = entry.expression;
            printf('PARSING ' + str);
            var expr;

            entry.error = '';

            try {
                expr = timo.parser.parse(str);
                entry.latex = expr.toLatex();
            } catch(e) {
                entry.error = e;
                printf('toLatex error ' + e);
                printf('  class_name ' + e.class_name());
            }
        };
    });

    ng_timo.controller("plotter_controller", function($scope) {
        timo.scope = $scope;
        
        $scope.this_scope = 'Plotter scope';
        $scope.base_url = timo.base_url;
        $scope.configuration = timo.configuration;

        $scope.expressions = [
            { color: 'blue',
              expression: 'sin(x)',
              string: '',
              latex: '',
              error: ''
            },
            { color: 'red',
              expression: 'sin(2*x)',
              string: '',
              latex: '',
              error: ''
            },
            { color: 'green',
              expression: 'sin(x) * 2',
              string: '',
              latex: '',
              error: ''
            }
        ];

        //  Called by timo.start()
        $scope.start = function() {
            var expressions = $scope.expressions;

            for (var i=0; i<expressions.length; i++) {
                $scope.parse_expression(expressions[i]);
            }
            timo.scope_apply();
        };

        //  Second argument is in an element of expressions above
        $scope.keyup_expression = function(event, expression) {
            expression.error = '';
            
            if (event.which === 13)
                return $scope.parse_expression(expression);

            try {
                $scope.parse_expression(expression);
            } catch (e) {
                expression.error = e;
            }
        };

        $scope.parse_expression = function(expression) {
            var str = expression.expression;
            var expr;
            var changed = false;

            expression.error = '';

            try {
                expr = timo.parser.parse(str);
            } catch(e) {
                expression.error = 'Keep typing!';
                if (expression.data.length > 0) {
                    expression.data = [];
                    do_plot(true);
                }
                return;
            }

            printf('  class    ' + expr.class_name());
            printf('  toString ' + expr.toString());
            printf('  toLatex  ' + expr.toLatex());

            expression.latex = expr.toLatex();
            expression.string = expr.toString();

            var vars = expr.variables();

            if (!vars.x) {
                expression.error = 'no x in expression';
                return;
            }

            if (str === '') {
                expression.data = [];
                return do_plot();
            }

            var trig;

            if (!is.Equals(expr)) {
                var data = expression.data = [];
                var x, y;
                var pi = Math.PI;
                var spec = {};
                var inc = 0.02;

                trig = expr.contains_property('trigonometry', true);

                if (trig) {
                    for (x=0; x<4; x+=inc) {
                        y = expr.compute({x: x*pi});
                        
                        if (is.number(y) && y < 10 && y > -10)
                            data.push([x,y]);
                        else
                            data.push([x,null]);
                    }
                    spec.trigonometry = true;
                } else {
                    for (x=-10; x<10; x+=inc) {
                        y = expr.compute({x: x}); 

                        if (is.number(y) && y < 100 && y > -100)
                            data.push([x,y]);
                        else
                            data.push([x,null]);
                    }
                }
                do_plot(true);
            }

            function do_plot(changed) {
                if (changed) {
                    var series = [];

                    for (var i=0; i<$scope.expressions.length; i++) {
                        expression = $scope.expressions[i];
                        var tex = '<span mathjax-bind="expressions['+i+'].latex"></span>';

                        printf(tex);
                        printf($scope.expressions[i].latex);

                        series.push({
//                            name: expression.string,
                            name: tex,
                            color: expression.color,
                            data: expression.data
                        });
                    }
                    
                    Plot.plot(series, { trigonometry: trig});
                }
            }
        };
    });

    ng_timo.directive("mathjaxBind", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                printf('mathjaxBind called for ' + $element[0]);
                $scope.$watch($attrs.mathjaxBind, function(value) {
                    var $script = angular.element("<script type='math/tex'>")
                        .html(value === undefined ? "" : value);
                    $element.html("");
                    $element.append($script);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });

    ng_timo.factory('languageHandler', function() {
        return timo.languageHandler;
    });

    ng_timo.factory('environmentHandlers', function() {
        return timo.ehs;
    });

}).call(this);
