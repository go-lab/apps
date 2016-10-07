/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        chempy.js
 *  Part of	Go-Lab Chemical Equation Entry
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Main code and angular handling
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History	23/03/15  (Created)
 *		05/11/15  (Last modified)
 */

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var chempy = tools.chempy = tools.chempy || {};
    var utils = this.ut.commons.utils = this.ut.commons.utils || {};
    var libs = ut.libs = ut.libs || {};
    var Chemistry = libs.chemistry = libs.chemistry || {};
    var Formula = Chemistry.formula = Chemistry.formula || {};

    console.log('========== loading tools/chempy2/js/chempy.js');

    chempy.equations = [];

    chempy.configuration = {
        answer: 'NaCl',
        help_button: true,
        show_help: false,
        tries: 3,
        auto_save: true,
        show_configuration: true
/*
        text: '',
        html: '',
        css_class: 'chempy_input_field',
        correct: false,
        attempts: 0
*/
    };

    /**
     *  Called before angular is started.
     */
    chempy.configure = function(spec, callback) {
        var sh = chempy.configurationStorageHandler;

        chempy.configuration_resource_id = null;

        //  resource-type, user, provider, app-id
        sh.configureFilters(true, false, true, true);

        sh.listResourceMetaDatas(function(error,meta) {
            for (var i=0; i<meta.length; i++) {
                var entry = meta[i];

                console.log('resource ' + entry.metadata.target.objectType);
                if (entry.metadata.target.objectType === 'configuration') {
                    chempy.configuration_resource_id = entry.id;

                    sh.readResource(entry.id, function(error, resource) {
                        var json = resource.content;

                        chempy.configuration = json.configuration;
                        chempy.set_context();
                        console.log('LOADED CONFIGURATION');

                        return callback();
                    });
                    break;
                }
            }

            if (chempy.configuration_resource_id === null) {
                sh.createResource({
                    configuration: chempy.configuration
                }, function(error, resource) {
                    if (error) {
                        console.log('sh.createResource error ' + JSON.stringify(error));
                        console.log('(5) ' + chempy.configuration.auto_save);
                        return callback();
                    }

                    chempy.set_context();
                    console.log('CREATED CONFIGURATION');

                    chempy.configuration_resource_id = resource.metadata.id;
                    return callback();
                });
            }
        });
    };

    /**
     *  Called after angular is finished.
     */
    chempy.start = function() {
    };


    /**
     *  Call $apply() when changes made did not originate from angular.
     */
    chempy.scope_apply = function() {
        var scope = chempy.scope;

        if (!scope.$$phase)
            scope.$apply();
    };

    /**
     *  Log the action given by verb and content.  If save is true or
     *  undefined, and auto_save is active then the current model is also
     *  saved.
     */
    chempy.log = function(verb, content, save) {
        save = (save === undefined ? true : save);

        chempy.actionLogger.log(verb, content);
        if (save && chempy.configuration.auto_save) {
            chempy.model.save_resource();
        }
    };


    /**
     * Set up angular.
     */
    var ng_chempy = angular.module("chempy", ['ngSanitize',
                                              'LocalStorageModule',
                                              'golabUtils']).config(
        function($sceDelegateProvider) {
            var url1 = chempy.base_url + '/**';
            var url2 = 'http://go-lab.collide.info' + '/**';

            $sceDelegateProvider.resourceUrlWhitelist(
                [ url1, url2
                ]);
        });

    ng_chempy.controller("chempy_controller", function($scope) {
        chempy.scope = $scope;

        $scope.this_scope = 'Chempy scope';
        $scope.base_url = chempy.base_url;

        $scope.configuration = chempy.configuration;

        $scope.key_up = function(event, eq) {
            if (event.keyCode === 11 || event.keyCode === 13) {
                $scope.check_answer(event, eq);
                return;
            }
            format_equation(eq);
        };

        $scope.help = function(eq) {
            eq.show_help = !eq.show_help;
        };

        $scope.blur = function(event, eq) {
        };

        $scope.check_answer = function(event, eq) {
            chempy.check_answer(eq);

            if (eq.correct) {
                eq.css_class = 'chempy_input_correct';
            } else
                eq.css_class = 'chempy_input_wrong';

            if (!eq.correct && eq.attempts >= eq.tries) {
                console.log('eq.correct ' + eq.correct);
                console.log('eq.attempts ' + eq.attempts);
                console.log('eq.tries ' + eq.tries);
                eq.text = Formula.decorated(eq.answer);
                chempy.check_answer(eq);
                eq.css_class = 'chempy_input_tries';
            }
        };

        $scope.focus = function(event, eq) {
            eq.css_class = 'chempy_input_field';
        };

        $scope.edit_configuration = function() {
            var id = "#chempy_configuration";
            var title = 'Specify answer';

            $(id).dialog({ title: title,
                           modal: true,
                           resizable: true,
                           width: 500,
                           minHeight: 400,
                           draggable: true,
                           create: function() {
                               console.log('setting gadgetResize');
                               setTimeout(function() {
                                   console.log('calling gadgetResize');
                                   ut.commons.utils.gadgetResize();
                               }, 250);
                           },
                           buttons: {
                               "Ready": function() {
                                   $(this).dialog('close');

                                   chempy.save_configuration();
                                   chempy.scope_apply();
                               }
                           }
                         });
        };
    });

    chempy.check_answer = function(eq) {
        var decorated = Formula.decorated(eq.answer);

        eq.attempts++;
        eq.correct = false;

        if (decorated === eq.text) {
            eq.correct = true;
            return;
        }

        console.log('>>>>>>>>> checking >>>>>>>>>');
        console.log('  text:   ' + eq.text);
        console.log('  answer: ' + eq.answer);

        var parts = Formula.parts(eq.answer);
        console.log('  parts   ' + JSON.stringify(parts));

        if (parts.length === 2) {
            var alt = parts[1] + parts[0];

            decorated = Formula.decorated(alt);
            console.log('  decorated ' + decorated);
            if (decorated === eq.text) {
                eq.correct = true;
                return;
            }
        }

        var answer = eq.answer;
        var answer_match;
        var text_match;

        var answer_parts = Formula.equation_parts(eq.answer);
        var text_parts = Formula.equation_parts(eq.text);
        console.log('  answer parts   ' + JSON.stringify(answer_parts));
        console.log('  text parts   ' + JSON.stringify(text_parts));

        if (answer_parts && text_parts && answer_parts.length === 3 && text_parts.length === 3) {
            if (Formula.same_formula(answer_parts[2], text_parts[2])) {
                if (Formula.same_formula(answer_parts[0], text_parts[0]) &&
                    Formula.same_formula(answer_parts[1], text_parts[1]))
                    return (eq.correct = true);
                if (Formula.same_formula(answer_parts[1], text_parts[0]) &&
                    Formula.same_formula(answer_parts[0], text_parts[1]))
                    return (eq.correct = true);
            }
        }

        if (answer_parts && text_parts && answer_parts.length === 2 && text_parts.length === 2) {
            if (Formula.same_formula(answer_parts[0], text_parts[0]) &&
                Formula.same_formula(answer_parts[1], text_parts[1]))
                return (eq.correct = true);
            if (Formula.same_formula(answer_parts[1], text_parts[0]) &&
                Formula.same_formula(answer_parts[0], text_parts[1]))
                return (eq.correct = true);
        }
    };

    ng_chempy.directive('chempy', function($compile) {
        var template =
'          <div style="width: 500px; display: table">' +
'            <div ng-show="eq.correct"' +
'                 class="{{eq.css_class}} full row">' +
'              <span ng-bind-html="eq.html" class="cell full center">' +
'              </span>' +
'            </div>' +
'' +
'            <div ng-hide="eq.correct"' +
'                 class="{{eq.css_class}}"' +
'                 style="max-width: 500px; min-height: 40px;">' +
'              <input type="text" ng-model="eq.text"' +
'                     ng-keyup="key_up($event, eq)"' +
'                     ng-blur="blur($event, eq)"' +
'                     ng-focus="focus($event, eq)"/>' +
'              <span style="color: blue;">' +
'                <i ng-show="eq.help_button"' +
'                   ng-click="help(eq)" class="fa fa-question"></i>' +
'                <span ng-bind-html="eq.html"></span>' +
'              </span>' +
'              <div ng-show="eq.show_help"' +
'                   style="background-color: white; border: 1px solid black;">' +
'                <table style="width: 100%"><tr style="width: 100%"><td>J_2 = J<sub>2</sub></td> <td>J^2+ = J<sup>2+</sup></td> <td>&lt;&gt; = <span class="equilibriumarrow"></span></td> <td>&gt; = <span class="longrightarrow"></span></td></tr></table>' +
'              </div>' +
'            </div>' +
'          </div>';

        return {
            restrict: 'E',
            template: template,
            scope: true,
            link: function(scope, element, atts) {
                scope.eq = chempy.reset_configuration(atts);
            }
        };
    });

    chempy.reset_configuration = function(atts) {
        var conf = chempy.configuration;
        var answer = (atts.answer === undefined ? conf.answer : atts.answer);
        var help_button = (atts.help_button === undefined ? conf.help_button : atts.help_button);
        var tries = (atts.tries === undefined ? conf.tries : atts.tries);

        conf.text = '';
        conf.html = '';
        conf.css_class = 'chempy_input_field';
        conf.answer = answer;
        conf.correct = false;
        conf.help_button = help_button;
        conf.tries = parseInt(tries, 10);
        conf.attempts = 0;

        return conf;
    };

    //  Strip all special characters.
    function canonical_equation(eq) {
        var str = eq.text;
        var len = str.length;
        var rval = '';

        for (var c=0; c<str.length; c++) {
            var chr = str[c];

            if (chr === ' ')
                continue;
            if (chr === '^')
                continue;
            if (chr === '_')
                continue;
            if (chr === '-' && str[c+1] === '>')
                continue;
            rval += chr;
        }
    }

    function format_equation(eq) {
        var rval = '';
        var str = eq.text;
        var len = str.length;

        for (var c=0; c<str.length; c++) {
            var chr = str[c];

            if (chr === '_') {
                if ((c+1) === len) {
                    rval += '<sub>_</sub>';
                    continue;
                }

                rval += '<sub>';
                rval += eq.text[c+1];
                rval += '</sub>';
                c++;
                continue;
            }
            if (chr === '^') {
                var c_next = c+1;

                if ((c+1) === len) {
                    rval += '<sup>^</sup>';
                    continue;
                }

                rval += '<sup>';
                for (var c1=c+1; c1<str.length; c1++) {
                    if (str[c1].match(/[0-9]/) || str[c1] === '+') {
                        rval += str[c1];
                        console.log('      rval ' + rval);
                        continue;
                    }
                    if (str[c1] === '-') {
                        rval += '\u2212';
                        continue;
                    }
                    break;
                }
                rval += '</sup>';
                c = c1 - 1;
                continue;
            }
            if (chr === '<' && str[c+1] === '>') {
//                rval += '\u21CC';
                rval += '<span class="equilibriumarrow"></span>';
                c++;
                continue;
            }
            if (chr === '-' && str[c+1] === '>') {
//                rval += '\u2192';
                rval += '<span class="longrightarrow"></span>';
                c++;
                continue;
            }
            if (str[c+1] === '>') {
//                rval += '\u2192';
                rval += '<span class="longrightarrow"></span>';
                c++;
                continue;
            }
            if (chr === '-') {
                rval += '\u2212';
                continue;
            }
            rval += chr;
        }

        eq.html = rval;
    }

    ng_chempy.factory('languageHandler', function() {
        return chempy.languageHandler;
    });

    ng_chempy.factory('environmentHandlers', function() {
        return chempy.ehs;
    });

    ng_chempy.filter('capitalize', function() {
        return function (val) {
            return (typeof(val) === 'string' ? utils.capitalize(val) : val);
        };});
}).call(this);
