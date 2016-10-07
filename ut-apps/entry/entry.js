/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        entry.js
 *  Part of     Go-Lab Entry Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Initialization and angular interface
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     01/03/16  (Created)
 *		20/06/16  (Last modified)
 */ 

(function() {
    "use strict";
    printf('========== loading tools/entry/js/entry.js');

    var golab = this.golab = this.golab || {};
    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var entry = tools.entry = tools.entry || {};

    entry.student_responses = [];
    entry.model = null;
    entry.scope = null;

    entry.configuration = {
        version: 'Entry tool ' + __TIME__ + '/' + __DATE__,
        auto_load: true,
        auto_save: true,
        show_help: false,
        show_configuration: true,// Set by entry.set_context() in resource.js

        help_text: '',

        resource_name: 'Entry Box',
        rows: 3,
        placeholder: 'Enter your text here',
        default_placeholder: true,
        save_button: ''
    };

    //  Before angular
    entry.configure = function(conf, callback) {
        for (var p in conf) {
            if (entry.configuration.hasOwnProperty(p))
                entry.configuration[p] = conf[p];
        }

        var ph = entry.translate('placeholder');
        if (ph)
            entry.configuration.placeholder = ph;

        entry.model = new entry.Model({
            configuration: entry.configuration
        });

        if (!entry.context)
            entry.set_context();

        entry.load_configuration(function() {	// Asynchronous
            if (entry.context === 'graasp' || entry.context === 'standalone') 
                entry.load_resource(entry.model, function() {
                    entry.load_student_responses(callback);
                });
            else
                entry.load_resource(entry.model, callback);
        });
    };

    //  After angular
    entry.start = function() {
        entry.root_scope.golab.startupFinished = true;
        $("#all").show();
        entry.log('start', {
            objectType: 'tool',
            content: {
                configuration: entry.model.json_configuration()
            }
        }, false);

        if (!entry.scope.state.context) {
            entry.set_context();
            entry.scope.state.context = entry.context;
        }

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

        entry.scope_apply();
    };

    entry.scope_apply = function() {
        var scope = entry.scope;

        if (!scope.$$phase)
            scope.$apply();
    };

    /*  Set up angular */
    var ng_entry = angular.module('entry', [
        'ngSanitize',
        'LocalStorageModule',
        'golabUtils',
        'textAngular',
        'ui.sortable',
        'ui.bootstrap',
        "monospaced.elastic"
    ]).config(
            function($sceDelegateProvider) {
                var url = entry.base_url + '/**';
                var url2 = 'http://go-lab.collide.info' + '/**';
                var url3 = 'http://golab.collide.info' + '/**';

                $sceDelegateProvider.resourceUrlWhitelist(
                    [ url, url2, url3
                    ]);
            });

    ng_entry.controller('controller_entry', function($scope, $rootScope) {
        entry.scope = $scope;
        entry.root_scope = $rootScope;

        $scope.this_scope = 'Entry scope';
        $scope.base_url = entry.base_url;

        $scope.configuration = entry.configuration;
        $scope.model = entry.model;
        $scope.state = {
            student_responses: false
        };
        $scope.student_responses = entry.student_responses;

        $scope.student_responses_show = function() {
            $scope.state.student_responses = !$scope.state.student_responses;
            ut.commons.utils.gadgetResize();
        };

        $scope.input_blur = function() {
            entry.log('change', {
                objectType: 'text',
                content: {
                    text: entry.model.text
                }
            }, true);
        };

        var initial_height = -1;

        $scope.checkHeight = function(event) {
            var entry_box = $("#entry_box");
            var height = entry_box.height();

            if (initial_height !== height) {
                ut.commons.utils.gadgetResize();
                initial_height = height;
            }
        };
            
        $scope.input_save = function() {
            $scope.input_blur();
        };

        /*------------------------------------------------------------
         *  Configuration general
         *------------------------------------------------------------*/

        $scope.configuration_close = function() {
            var id = '#entry_configuration';

            $(id).dialog('close');
            entry.save_configuration();

            entry.scope_apply();		// TBD - because of jquery ui
            ut.commons.utils.gadgetResize();
        };

        $scope.student_responses_close = function() {
            var id = '#entry_student_responses';

            $(id).dialog('close');
            ut.commons.utils.gadgetResize();
        };

        $scope.configuration_edit = function() {
            var id = '#entry_configuration';
            var title = entry.translate('configure_this_entry');
//            printf('title ' + title);

            $(id).dialog({ title: title,
                           modal: true,
                           resizable: false,
                           width: 800,
                           height: 500,
                           minHeight: 500,
                           draggable: true
                         });
            ut.commons.utils.gadgetResize();
            entry.scope_apply();
        };

        $scope.student_responses_show = function() {
            var id = '#entry_student_responses';
            var title = entry.translate('student_entries');
//            printf('title ' + title);

            $(id).dialog({ title: title,
                           modal: true,
                           resizable: false,
                           width: 700,
                           height: 500,
                           minHeight: 500,
                           draggable: true
                         });
            ut.commons.utils.gadgetResize();
            entry.scope_apply();
        };

        $scope.dialog_close = function(id) {
            $('#'+id).dialog('close');
        };
    });

    ng_entry.factory('languageHandler', function() {
        return entry.languageHandler;
    });

    ng_entry.factory('environmentHandlers', function() {
        return entry.ehs;
    });

    entry.translate = function(msg) {
        return entry.languageHandler.getMessage(msg);
    };

    /**
     *  Log the action given by verb and content.  If save is true or
     *  undefined, and auto_save is active then the current model is also
     *  saved.
     */
    entry.log = function(verb, content, save) {
        save = use_default(save, true);

        entry.actionLogger.log(verb, content);
        if (save && entry.configuration.auto_save) {
            entry.save_resource(entry.model);
        }
    };

    entry.uuid = function() {
        return ut.commons.utils.generateUUID();
    };
}).call(this);
