/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        quiz.js
 *  Part of     Go-Lab Quiz Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Initialization and angular interface
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     07/01/16  (Created)
 *		20/02/16  (Last modified)
 */

(function() {
    "use strict";
    console.log('========== loading tools/quiz/js/quiz.js');

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var quiz = tools.quiz = tools.quiz || {};
    var stem = libs.stem = libs.stem || {};
    var Parser = stem.parser = stem.parser || {};

    var Chemistry = libs.chemistry = libs.chemistry || {};
    var Formula = Chemistry.formula = Chemistry.formula || {};
    var chempy = tools.chempy = tools.chempy || {};

    quiz.model = null;
    quiz.scope = null;

    //  String constants
    quiz.MULTIPLE_CHOICE = "multiple_choice";
    quiz.OPEN = "open";
    quiz.YES_NO = "yes_no";
    quiz.MATH = "math";
    quiz.CHEMISTRY = "chemistry";

    //  Modes
    quiz.OVERVIEW = "overview";
    quiz.EDIT = "edit";
    quiz.STUDENT = "student"; // Implicit

    quiz.configuration = {
        version: 'Quiz tool ' + "10:36:00" + '/' + "Jun 30 2016",
        auto_load: true,
        auto_save: true,
        show_help: false,
        show_configuration: true,// Set by quiz.set_context() in resource.js

        resource_name: 'Quiz',
        help_text: '',

        questions: []
    };

    //  Before angular
    quiz.configure = function(conf, callback) {
        console.log('>> quiz.configure ***************************************');
        for (var p in conf) {
            if (quiz.configuration.hasOwnProperty(p))
                quiz.configuration[p] = conf[p];
        }

        quiz.set_context();
        quiz.model = new quiz.Model({
            configuration: quiz.configuration
        });

        quiz.load_configuration(function() { // Asynchronous
            quiz.load_resource(quiz.model, callback);
        });
    };

    //  After angular
    quiz.start = function() {
        console.log('>> quiz.start');
        quiz.log('start', {
            objectType: 'tool',
            content: {
                configuration: quiz.model.json_configuration()
            }
        }, false);

        quiz.scope.state.mode = quiz.OVERVIEW;

        if (!quiz.scope.state.context)
            quiz.scope.state.context = quiz.context;

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });
        $('[data-toggle="popover"]').popover({
            container: 'body'
        });
        $('body').on('click', function (e) {
            $('[data-toggle="popover"]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                $('[data-toggle="popover"]').each(function () {
                    //the 'is' for buttons that trigger popups
                    //the 'has' for icons within a button that triggers a popup
                    if (!$(this).is(evt.target) && $(this).has(evt.target).length === 0 && $('.popover').has(evt.target).length === 0) {
                        $(this).popover('hide');
                    }
                });
                evt.preventDefault();
            }
        };

        ut.commons.utils.gadgetResize();
        quiz.scope_apply();
/*
        printf('ANSWERS');
        pp(quiz.model.answers);
        printf('QUESTIONS');
        pp(quiz.model.questions);
        printf('<< quiz.start');
*/
    };

    quiz.test_questions = [
        { text: 'You have not configured a quiz yet.  Use the gears icon to start configuring.',
          type: quiz.OPEN,
          open: {
              rows: 1,
              placeholder: ''
          }
        }
    ];

    quiz.scope_apply = function() {
        var scope = quiz.scope;

        if (!scope.$$phase)
            scope.$apply();
    };

    /*  Set up angular */
    var ng_quiz = angular.module('quiz', [
        'ngSanitize',
        'LocalStorageModule',
        'golabUtils',
        'textAngular',
        'ui.sortable',
        'ui.bootstrap'
    ]).config(
            function($sceDelegateProvider) {
                var url = quiz.base_url + '/**';
                var url2 = 'http://go-lab.collide.info' + '/**';
                var url3 = 'http://golab.collide.info' + '/**';

                $sceDelegateProvider.resourceUrlWhitelist(
                    [ url, url2, url3
                    ]);
            });

    ng_quiz.controller('controller_quiz', function($scope) {
        quiz.scope = $scope;

        $scope.this_scope = 'Quiz scope';
        $scope.base_url = quiz.base_url;

        $scope.configuration = quiz.configuration;
        $scope.model = quiz.model;
        $scope.questions = quiz.model.questions;

        //  For some reason, Angular does not detect top-level changes
        //  (e.g. $scope.mode) sometimes, so we put the mode inside a state
        //  ($scope.state.mode).
        $scope.state = {
            mode: quiz.STUDENT,
            edit_image: false // Editing image attributes
        };

        if (!quiz.model)
            alert('quiz.model not created');

        quiz.model.answers_make_consistent();
        set_current_question(quiz.model.questions[0]);

        /*------------------------------------------------------------
         *  Configuration overview (list of questions)
         *------------------------------------------------------------*/

        $scope.overview_click = function(question) {
            quiz.model.questions_make_consistent();
            set_current_question(question);
        };

        $scope.overview_blur = function(question) {
            quiz.model.questions_make_consistent();
            set_current_question(question);
        };

        $scope.overview_keyup = function(question, event) {
            if (event.keyCode === 11 || event.keyCode === 13) {
                quiz.model.questions_make_consistent();
                if (event.keyCode === 11)
                    set_next_question(question);
                else
                    set_current_question(question);
            }
        };

        /*------------------------------------------------------------
         *  Configuration questions
         *------------------------------------------------------------*/

        $scope.question_type_clicked = function(question, type) {
            quiz.model.question_must_have_type(question, type);
            $scope.state.edit_image = false;
        };

        $scope.question_delete = function(question) {
            $scope.previous_question = $scope.current;
            set_current_question(question);
            $scope.dialog_question_delete(question);
        };

        $scope.dialog_question_delete = function(question) {
            var id = '#quiz_question_delete';

            $(id).dialog({ title: 'Really delete',
                           width: 500,
                           modal: true,
                           draggable: false
                         });
        };

        $scope.confirm_question_delete = function(question) {
            var id = '#quiz_question_delete';

            quiz.model.question_delete(question);
            set_current_question($scope.previous_question);
            $(id).dialog('close');
        };

        /*------------------------------------------------------------
         *  Configuration images
         *------------------------------------------------------------*/

        $scope.image_clicked = function(question) {
            if ($scope.state.edit_image)
                quiz.model.question_must_have_image(question);
        };

        $scope.image_url_keyup = function(question, event) {
            if (event.keyCode === 11 || event.keyCode === 13)
                quiz.model.load_image(question, question.image.url_input);
        };

        $scope.image_url_blur = function(question) {
            if (question.image.url_input.length === 0)
                return quiz.model.image_clear(question);
            quiz.model.load_image(question, question.image.url_input);
        };

        $scope.image_scale_change = function(question) {
            quiz.model.image_scale_change(question);
        };

        /*------------------------------------------------------------
         *  Open 
         *------------------------------------------------------------*/

        $scope.open_answer = function(question) {
            quiz.model.open_answer(question);
            quiz.log('change', {
                objectType: 'quiz_answer',
                content: {
                    question: question.id,
                    type: quiz.OPEN,
                    answer: question.answer.current.value
                }
            }, true);
        };

        /*------------------------------------------------------------
         *  Multiple choice
         *------------------------------------------------------------*/

        $scope.multiple_choice_answer = function(question, option) {
            quiz.model.multiple_choice_answer(question, option);
            quiz.log('change', {
                objectType: 'quiz_answer',
                content: {
                    question: question.id,
                    type: quiz.MULTIPLE_CHOICE,
                    answer: option.text
                }
            }, true);
        };

        $scope.option_blur = function(question, option) {
            quiz.model.questions_make_consistent();
        };

        $scope.option_keyup = function(question, event, option) {
            if (event.keyCode === 11 || event.keyCode === 13) {
                $scope.option_blur(question, option);
            }
        };

        $scope.option_delete = function(question, option) {
            quiz.model.option_delete(question, option);
        };

        $scope.option_correctness = function(question, option, bool) {
            quiz.model.option_correctness(question, option, bool);
        };

        /*------------------------------------------------------------
         *  Configuration Yes / no (two way)
         *------------------------------------------------------------*/

        $scope.yes_no_correctness = function(question, yes_no, bool) {
            quiz.model.yes_no_correctness(question, yes_no, bool);
        };

        $scope.yes_no_answer = function(question, answer) {
            quiz.model.yes_no_answer(question, answer);
            quiz.log('change', {
                objectType: 'quiz_answer',
                content: {
                    question: question.id,
                    type: quiz.YES_NO,
                    answer: answer
                }
            }, true);
        };

        /*------------------------------------------------------------
         *  Configuration general
         *------------------------------------------------------------*/

        $scope.configuration_close = function() {
            var id = '#quiz_configuration';

            $(id).dialog('close');
            quiz.save_configuration();

            quiz.model.answers_clear_all(); // Make it testable
            quiz.model.empty_cells_clear();
            quiz.model.answers_make_consistent();
            $scope.state.mode = quiz.STUDENT;
            quiz.scope_apply(); // TBD - because of jquery ui
        };

        $scope.configuration_edit = function() {
            var id = '#quiz_configuration';
            var title = 'Specify questions for this quiz';

            $scope.state.mode = quiz.OVERVIEW;
            $scope.state.edit_image = false;
            $(id).dialog({ title: title,
                           modal: true,
                           resizable: false,
                           width: 800,
                           height: 700,
                           minHeight: 700,
                           draggable: true,
                           create: function() {
                               ut.commons.utils.gadgetResize();
                           }
                         });
        };

        $scope.dialog_close = function(id) {
            $('#'+id).dialog('close');
        };

        /*------------------------------------------------------------
         *  Chemistry
         *------------------------------------------------------------*/

        $scope.chemistry = {
            formula: '',
            string: '',
            html: '',
            latex: ''
        };

        var Parser = libs.stem.chemistry.parser;

        $scope.chemistry_answer_keyup = function(question, event) {
            console.log('chemistry_answer_keyup ' + event.keyCode);
            console.log(question.chemistry.formula);
            if (event.keyCode === 11 || event.keyCode === 13) {
                console.log('CALLING chemistry_answer_check');
                $scope.chemistry_answer_check(question);
                return;
            }
            $scope.chemistry_answer_blur(question);
        };

        $scope.chemistry_answer_blur = function(question) {
            var formula = question.chemistry.formula;

            quiz.log('change', {
                objectType: 'quiz_answer',
                content: {
                    question: question.id,
                    type: question.type,
                    answer: formula
                }
            }, true);

            try {
                var chem;

                if (question.chemistry.require_scripts)
                    chem = Parser.parse(formula, {student: true});
                else
                    chem = Parser.parse(formula);

                question.chemistry.error = '';
                question.chemistry.string = chem.toString();
                question.chemistry.latex = chem.toLatex();
                question.chemistry.html = chem.toHtml();
           } catch (e) {
               question.chemistry.error = 'Error ' + JSON.stringify(e,null,4);

           }
        }

        $scope.chemistry_answer_check = function(question) {
            console.log('chemistry_answer_check');
            console.log(JSON.stringify(question.chemistry,null,4));
        };

        $scope.chemistry_formula_blur = function(question, formula) {
            try {
                console.log('chemistry_formula_change');
                console.log(JSON.stringify(formula,null,4));
                var chem = Parser.parse(formula.formula);

                formula.html = chem.toHtml();
            } catch (e) {
                console.log('Chemistry error ' + formula.formula);
                console.log(JSON.stringify(e,null,4));
            }
        };

        $scope.chemistry_formula_keyup = function(question, formula, event) {
            $scope.chemistry_formula_blur(question, formula);
        };

        $scope.formula_correctness = function(question, formula, bool) {
            quiz.model.formula_correctness(question, formula, bool);
        };

        $scope.chemistry_help = function() {
            var id = '#quiz_chemistry_help';

            $(id).dialog({ title: 'Help on entering chemistry ...',
                           width: 700,
                           draggable: false
                         });
        };

        $scope.chemistry_formula_correct = function(question, formula, bool) {
            quiz.model.chemistry_formula_correct(question, formula, bool);
        };

        $scope.chemistry_check_answer = function(question, event) {
            var chem = question.chemistry;

            console.log('chemistry_check_answer');
            console.log(JSON.stringify(chem,null,4));

            chempy.check_answer(chem);

            if (chem.correct) {
                chem.answer_style = 'correct-answer';
            } else
                chem.answer_style = 'wrong-answer';

            if (!chem.correct && chem.tries >= question.attempts) {
                chem.text = Formula.decorated(chem.answer);
                chempy.check_answer(chem);
                chem.answer_style = 'too-many-tries-answer';
            }
        };

        $scope.chemistry_focus = function(question, event) {
            question.answer_style = 'enter-answer';
        };

        $scope.chemistry_formula_delete = function(question, formula) {
            quiz.model.chemistry_formula_delete(question, formula);
        };

        //  $scope.current = current (selected) question
        //  $scope.current_nth1 = index of selected question
        function set_current_question(question) {
            if (!question) {
                quiz.model.questions_make_consistent();
                $scope.current = $scope.questions[0];
                $scope.current_nth1 = 0;
            } else {
                var nth1 = quiz.model.question_index(question);

                if (!nth1) {
                    if ($scope.questions.length > 0)
                        $scope.current = $scope.questions[0];
                    else
                        $scope.current = null;
                    $scope.current_nth1 = 0;
                } else {
                    $scope.current = question;
                    $scope.current_nth1 = nth1;
                }
            }
        }

        //  Set current ot next question (after a TAB)
        function set_next_question(question) {
            set_current_question(question);
            var nth1 = $scope.current_nth1;

            if ((nth1+1) <= $scope.questions.length) {
                $scope.current = $scope.questions[nth1];
                $scope.current_nth1++;
            }
        }

    });

    ng_quiz.directive("mathjaxBind", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
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

    ng_quiz.factory('languageHandler', function() {
        return quiz.languageHandler;
    });

    ng_quiz.factory('environmentHandlers', function() {
        return quiz.ehs;
    });

    quiz.translate = function(msg) {
        return quiz.languageHandler.getMessage(msg);
    };

    /**
     *  Log the action given by verb and content.  If save is true or
     *  undefined, and auto_save is active then the current model is also
     *  saved.
     */
    quiz.log = function(verb, content, save) {
        save = (save === undefined ? true : save);

        //  Student mode
        quiz.actionLogger.log(verb, content);
        if (save && quiz.configuration.auto_save) {
            quiz.save_resource(quiz.model);
        }
    };

    chempy.check_answer = function(eq) {
        console.log('check_answer');
        console.log(JSON.stringify(eq,null,4));
        var decorated = Formula.decorated(eq.answer);

        eq.tries++;
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

    chempy.reset_current = function(atts) {
        console.log('reset_configuration');
        console.log(JSON.stringify(atts,null,4));
//        var conf = chempy.configuration;
        var question = quiz.scope.current;
        var conf = question.chemistry; // TBD -- neater
        var formula = (atts.formula === undefined ? conf.formula : atts.formula);
        var help_button = (atts.help_button === undefined ? conf.help_button : atts.help_button);
        var attempts = (atts.attempts === undefined ? conf.attempts : atts.attempts);

        conf.text = '';
        conf.html = '';
        conf.answer_style = 'enter-answer';
        conf.formula = formula;
        conf.correct = false;
        conf.help_button = help_button;
        conf.attempts = parseInt(attempts, 10);
        conf.tries = 0;

        return conf;
    };

    //  Strip all special characters.
    function canonical_equation(eq) {
        var str = eq.text;
        var len = str.length;
        var rval = '';
        var chr, c;

        for (c=0; c<str.length; c++) {
            chr = str[c];
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
        var chr, c;

        for (c=0; c<str.length; c++) {
            chr = str[c];
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

    quiz.uuid = function() {
        return ut.commons.utils.generateUUID();
    };
}).call(this);
