/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        quest.js
 *  Part of     Go-Lab Questionnaire tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Initialization and angular interface
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     30/06/16  (Created)
 *		03/07/16  (Last modified)
 */ 

(function() {
    "use strict";
    printf('========== loading tools/quest/js/quest.js');

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var quest = tools.quest = tools.quest || {};

    quest.model = null;
    quest.scope = null;

    //  Key codes
    var TAB = 9;
    var ENTER = 13;

    //  String constants
    quest.MULTIPLE_CHOICE = "multiple_choice";
    quest.OPEN = "open";
    quest.LIKERT = "likert";

    //  Modes
    quest.OVERVIEW = "overview";
    quest.EDIT = "edit";
    quest.STUDENT = "student";		// Student view
    quest.TEACHER = "teacher";		// Teacher view

    //  Teacher view
    quest.student_resources = [];

    quest.configuration = {
        version: 2.4,
        created: 'Quest tool ' + __TIME__ + '/' + __DATE__,
        auto_load: true,
        auto_save: true,
        show_help: false,
        show_configuration: true,// Set by quest.set_context() in resource.js

        resource_name: 'Questionnaire',
        help_text: '',

        questions: [],
        scales: []
    };

    //  Before angular
    quest.configure = function(conf, callback) {
        for (var p in conf) {
            if (quest.configuration.hasOwnProperty(p))
                quest.configuration[p] = conf[p];
        }

        quest.set_context();
        quest.model = new quest.Model({
            configuration: quest.configuration
        });

        quest.load_configuration(function() {	// Asynchronous
            quest.load_resource(quest.model, callback);
        });
    };

    //  After angular
    quest.start = function() {
        quest.root_scope.golab.startupFinished = true;
        $("#all").show();

        quest.log('start', {
            objectType: 'tool',
            content: {
                configuration: quest.model.json_configuration()
            }
        }, false);

        quest.scope.state.mode = quest.STUDENT;

        if (!quest.scope.state.context)
            quest.scope.state.context = quest.context;

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });
        $('[data-toggle="popover"]').popover({
            container: 'body'
        });
        $('body').on('click', function (e) {
            if (quest.scope.state.mode === quest.STUDENT)
                return;
            $('[data-toggle="popover"]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });

        ut.commons.utils.gadgetResize();
        quest.scope_apply();
    };

    quest.test_questions = [
        { text: 'You have not configured the questionnaire tool yet.  Use the gear icon to start.',
          type: quest.OPEN,
          open: {
              rows: 1,
              placeholder: ''
          }
        }
    ];

    quest.scope_apply = function() {
        var scope = quest.scope;

        if (!scope.$$phase)
            scope.$apply();
    };

    /*  Set up angular */
    var ng_quest = angular.module('quest', [
        'ngSanitize',
        'LocalStorageModule',
        'golabUtils',
        'textAngular',
        'ui.sortable',
        'ui.bootstrap'
    ]).config(
            function($sceDelegateProvider) {
                var url = quest.base_url + '/**';
                var url2 = 'http://go-lab.collide.info' + '/**';
                var url3 = 'http://golab.collide.info' + '/**';

                $sceDelegateProvider.resourceUrlWhitelist(
                    [ url, url2, url3
                    ]);
            });

    ng_quest.controller('controller_quest', function($scope, $rootScope) {
        quest.scope = $scope;
        quest.root_scope = $rootScope;

        $scope.this_scope = 'Quest scope';
        $scope.base_url = quest.base_url;

        $scope.configuration = quest.configuration;
        $scope.model = quest.model;
        $scope.questions = quest.model.questions;
        $scope.student_resources = quest.student_resources;
        $scope.student_data = quest.student_data;
        $scope.scales = quest.model.scales;

        $scope.sortableOptions = {
            axis: 'y',
/*
            revert: false,
            revertDuration: 50,
            tolerance: 'pointer',
            distance: 5,
            opacity: 0.75,
            scroll: false,
*/
            placeholder: 'sortable-placeholder',
            forcePlaceholderSize: true,
            stop: function(event, ui) {
                quest.model.questions_make_consistent();
            }
        };

        //  For some reason, Angular does not detect top-level changes
        //  (e.g. $scope.mode) sometimes, so we put the mode inside a state
        //  ($scope.state.mode).
        $scope.state = {
            mode: quest.STUDENT,
            edit_image: false,		// Editing image attributes
            edit_header: false
        };

        quest.model.answers_make_consistent();
        set_current_question(quest.model.questions[0]);

        /*------------------------------------------------------------
         *  Configuration overview (list of questions)
         *------------------------------------------------------------*/

        $scope.overview_click = function(question) {
//            printf('$scope.overview_click ' + question.text);
            quest.model.questions_make_consistent();
            set_current_question(question);
        };

        $scope.overview_blur = function(question) {
//            printf('$scope.overview_blur ' + question.text);
            quest.model.questions_make_consistent();
            set_current_question(question);
        };

        $scope.overview_keyup = function(question, event) {
//            printf('$scope.overview_keyup ');
            var code = key_code(event);

            if (code === TAB || code === ENTER) {
                quest.model.questions_make_consistent();
                if (event.keyCode === TAB)
                    set_next_question(question);
                else
                    set_current_question(question);
            }
        };

        $scope.overview_keydown = function(question, event) {
//            printf('$scope.overview_keydown ');
            var code = key_code(event);

            if (code === TAB || code === ENTER)
                quest.model.questions_make_consistent();
        };

        /*------------------------------------------------------------
         *  Configuration questions
         *------------------------------------------------------------*/

        $scope.update_model = function() {
            quest.model.questions_make_consistent();
        };

        $scope.question_type_clicked = function(question, type) {
//            printf('$scope.question_type_clicked ' + question.text);
//            printf('   ---> type ' + type);
            quest.model.question_must_have_type(question, type);
            $scope.state.edit_image = false;
            $scope.state.edit_header = false;
            quest.model.questions_make_consistent();
        };

        $scope.question_delete = function(question) {
//            printf('$scope.question_delete ' + question.text);
            $scope.previous_question = $scope.current;
            set_current_question(question);
            $scope.dialog_question_delete(question);
        };

        $scope.dialog_question_delete = function(question) {
            var id = '#quest_question_delete';

            $(id).dialog({ title: 'Really delete',
                           width: 500,
                           modal: true,
                           draggable: false
                         });
        };

        $scope.confirm_question_delete = function(question) {
            var id = '#quest_question_delete';

            quest.model.question_delete(question);
            set_current_question($scope.previous_question);
            $(id).dialog('close');
        };

        $scope.header_clicked = function(question) {
//            printf('$scope.header_clicked ' + question.text);
//            printf(' status ' + $scope.state.edit_header);
            if ($scope.state.edit_header)
                $scope.state.edit_image = false;
        };

        /*------------------------------------------------------------
         *  Configuration images
         *------------------------------------------------------------*/

        $scope.image_clicked = function(question) {
//            printf('$scope.image_clicked ' + question.text);
//            printf(' status ' + $scope.state.edit_image);
            if ($scope.state.edit_image) {
                quest.model.question_must_have_image(question);
                $scope.state.edit_header = false;
            }
        };

        $scope.image_url_keyup = function(question, event) {
//            printf('$scope.image_url_keyup ' + question.text);
            var key = key_code(event);

            if (key === TAB || key === ENTER)
                quest.model.load_image(question, question.image.url_input);
        };

        $scope.image_url_blur = function(question) {
//            printf('$scope.image_url_blur ' + question.text);
            if (question.image.url_input.length === 0)
                return quest.model.image_clear(question);
            quest.model.load_image(question, question.image.url_input);
        };

        $scope.image_scale_change = function(question) {
//            printf('$scope.image_scale_change ' + question.text);
            quest.model.image_scale_change(question);
        };

        /*------------------------------------------------------------
         *  Likert
         *------------------------------------------------------------*/

        $scope.create_likert_scale = function(question) {
//            printf('$scope.create_likert_scale ' + question.text);
            question.likert.scale = quest.model.empty_scale();
            quest.model.questions_make_consistent();
        };

        $scope.scale_selected = function(question, scale) {
//            printf('$scope.select_scale ' + question.text);
            question.likert.scale = scale;
            quest.model.questions_make_consistent();
        };

        $scope.delete_unused_scales = function() {
//            printf('$scope.delete_unused_scales ');
            quest.model.delete_unused_scales();
        };

        $scope.likert_answer = function(question) {
//            printf('$scope.likert_answer ' + question.text);
            quest.model.likert_answer(question);
            quest.log('change', {
                objectType: 'quest_answer',
                content: {
                    question: question.id,
                    type: quest.LIKERT,
                    answer: question.answer.value
                }
            }, true);
        };

        /*------------------------------------------------------------
         *  Open 
         *------------------------------------------------------------*/

        $scope.open_answer = function(question) {
//            printf('$scope.open_answer ' + question.text);
            quest.model.open_answer(question);
            quest.log('change', {
                objectType: 'quest_answer',
                content: {
                    question: question.id,
                    type: quest.OPEN,
                    answer: question.answer.value
                }
            }, true);
        };

        function key_code(event) {
            var key;

            if (event.keyCode !== undefined)
                return event.keyCode;
            if (event.keyIdentifier !== undefined)
                return event.keyIdentifier;
            if (event.key !== undefined)
                return event.key;
        }

        /*------------------------------------------------------------
         *  Multiple choice
         *------------------------------------------------------------*/

        $scope.multiple_choice_answer = function(question) {
//            printf('$scope.multiple_choice_answer ' + question.text);
            quest.model.multiple_choice_answer(question);
            quest.log('change', {
                objectType: 'quest_answer',
                content: {
                    question: question.id,
                    type: quest.MULTIPLE_CHOICE,
                    answer: question.answer.value
                }
            }, true);
        };

        $scope.option_blur = function(question, option) {
//            printf('$scope.option_blur ');
            quest.model.questions_make_consistent();
        };

        $scope.option_keyup = function(question, option, event) {
//            printf('$scope.option_keyup ');
            var key = key_code(event);

            if (key === TAB || key === ENTER) {
                $scope.option_blur(question, option);
            }

        };

        $scope.option_keydown = function(question, option, event) {
//            printf('$scope.option_keydown ');
            var key = key_code(event);

            if (key === TAB || key === ENTER) {
                $scope.option_blur(question, option);
            }

        };

        $scope.option_delete = function(question, option) {
//            printf('$scope.option_delete ' + question.text);
            quest.model.option_delete(question, option);
            $('.popover').hide();
        };

        /*------------------------------------------------------------
         *  Configuration general
         *------------------------------------------------------------*/

        $scope.configuration_close = function() {
            var id = '#quest_configuration';

            $(id).dialog('close');
            quest.save_configuration();

            quest.model.answers_clear_all();	// Make it testable
            quest.model.empty_cells_clear();
            quest.model.answers_make_consistent();
            $scope.state.mode = quest.STUDENT;
//            quest.model.questions_make_consistent();
            quest.scope_apply();		// TBD - because of jquery ui
        };

        $scope.configuration_edit = function() {
            var id = '#quest_configuration';
            var title = quest.translate('specify_questions');

            $scope.state.mode = quest.OVERVIEW;
            $scope.state.edit_image = false;
            $scope.state.edit_header = false;
            $(id).dialog({ title: title,
                           modal: true,
                           resizable: false,
                           width: 800,
                           height: 700,
                           minHeight: 700,
                           draggable: true
                         });
            ut.commons.utils.gadgetResize();
            quest.scope_apply();
        };

        $scope.teacher_view_show = function() {
            if (quest.scope.state.mode === quest.TEACHER) {
                quest.scope.state.mode = quest.STUDENT;
                quest.scope_apply();
                return;
            }
            var id = '#quest_teacher_view';
            var title = quest.translate('student_responses');
            var tmp = '#quest_teacher_loading';
            
            $(tmp).dialog({
                title: 'Loading student data'
            });
            quest.load_student_resources(function() {
                quest.teacher_view(quest.configuration, quest.student_resources);
                $(tmp).dialog('close');
/*
                $(id).dialog({ title: title,
                               modal: true,
                               resizable: false,
                               width: 800,
                               height: 700,
                               minHeight: 700,
                               draggable: true
                             });
                ut.commons.utils.gadgetResize();
*/
                quest.scope.state.mode = quest.TEACHER;
                quest.scope_apply();		// Necessary?
            });
        };

        $scope.teacher_view_close = function() {
            var id = '#quest_teacher_view';

            $(id).dialog('close');
            ut.commons.utils.gadgetResize();
        };

        $scope.dialog_close = function(id) {
            $('#'+id).dialog('close');
        };

        //  $scope.current = current (selected) question
        //  $scope.current_nth1 = index of selected question
        function set_current_question(question) {
            if (!question) {
                quest.model.questions_make_consistent();
                $scope.current = $scope.questions[0];
                $scope.current_nth1 = 0;
            } else {
                var nth1 = quest.model.question_index(question);

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

    ng_quest.factory('languageHandler', function() {
        return quest.languageHandler;
    });

    ng_quest.factory('environmentHandlers', function() {
        return quest.ehs;
    });

    quest.translate = function(msg) {
        return quest.languageHandler.getMessage(msg);
    };

    /**
     *  Log the action given by verb and content.  If save is true or
     *  undefined, and auto_save is active then the current model is also
     *  saved.
     */
    quest.log = function(verb, content, save) {
        save = use_default(save, true);

        //  Student mode
        quest.actionLogger.log(verb, content);
        if (save && quest.configuration.auto_save)
            quest.save_resource(quest.model);
    };

    quest.uuid = function() {
        return ut.commons.utils.generateUUID();
    };
}).call(this);
