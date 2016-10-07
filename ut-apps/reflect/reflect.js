/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        reflect.js
 *  Part of     Go-Lab Reflection tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Main code and angular handling
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     27/10/14  (Created)
 *		02/11/15  (Last modified)
 */ 

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var golab = this.golab = this.golab || {};
    var tools = ut.tools = ut.tools || {};
    var reflect = tools.reflect = tools.reflect || {};
    var utils = this.ut.commons.utils = this.ut.commons.utils || {};

    var WEBSERVICE_URL = "http://golab-dev.collide.info/analytics/reflect";
//    var WEBSERVICE_URL = "http://localhost:3090/analytics/reflect";

    printf('========== loading tools/reflect/js/reflect.js');

    reflect.model = null;		// See model.js
    reflect.ils_structure = null;	// See phases.js
    reflect.resource_id = null;		// Student resource id
    reflect.configuration_id = null;	// Configuration resource id
    reflect.chart_package = 'highcharts';
    reflect.ils_context = null;		// Set by .set_context()

    reflect.default_model = {
        time_spent: {
            type: 'time_spent',
            phases: [
                { name: "Orientation",
                  norm: 5
                },
                { name: "Conceptualisation",
                  norm: 15
                },
                { name: "Investigation",
                  norm: 50
                },
                { name: "Conclusion",
                  norm: 20
                },
                { name: "Discussion",
                  norm: 10
                }
            ],
            questions: [
                { name: "General time spent",
                  text: "Did you spend relatively more time than could be expected in one or more of the phases?  If so, please consider why this was the case (e.g., a phase particularly difficult or a phase engaged your attention).  Explain why you think your time in the inquiry phases differed from the suggested norm time.  If your time was the same then explain if you think all inquiry projects follow this general distribution."
                }
            ]
        },
        transition: {
            type: 'transition',
            phases: [
                { name: "Orientation",
                  norm: 5
                },
                { name: "Conceptualisation",
                  norm: 15
                },
                { name: "Investigation",
                  norm: 50
                },
                { name: "Conclusion",
                  norm: 20
                },
                { name: "Discussion",
                  norm: 10
                }
            ],
            questions: [
                { name: "General transition",
                  text: "Did you visit the phases in the order given (shown from top to bottom in the chart below)? If not, could you explain why?"
                }
            ]
        }
    };

    reflect.configuration = {
        timestamp: new Date().toISOString(),
        auto_save: true,
        show_configuration: true,	// Changed by set_context
        show_about: true,
        help_text: 'Enter your text here.',
        introduction: 'Enter an introduction here',
        type: 'time_spent',
        model: reflect.default_model.time_spent		// Reset by .configure
    };

    /**
     *  Called before angular is started.
     */
    reflect.configure = function(spec, callback) {
        var type = spec.type || 'time_spent';
        var phase_names;

        if (reflect.default_model[type]) {
            reflect.configuration.type = type;
            reflect.configuration.model = reflect.default_model[type];
        }

        reflect.set_context();
        printf('configure [Enter] ' + reflect.ils_context);
        if (reflect.ils_context === 'ils' || reflect.ils_context === 'graasp') {
            var mh = reflect.metadataHandler;
            mh.getILSStructure(function(err, result) {
                if (err) {
                    printf('mh.getILSStructure');
                    printf('ERROR ' + JSON.stringify(err,null,4));
                    return callback();
                } else {
                    reflect.ils_structure = result;
                    phase_names = reflect.phases_from_ils_structure(result);
                    printf('configure [In ILS]');
                    printf('  ILS PHASE NAMES ' + phase_names);
                    load_all(phase_names, callback);
                }
            });
        } else {
            phase_names = reflect.default_phases();
            printf('configure [Standalone]');
            printf('   default phases ' + phase_names);
            load_all(phase_names, callback);
        }

        function load_all(phase_names, callback) {
            if (reflect.ils_context === "ils" || reflect.ils_context === "graasp")
                reflect.update_phase_names_for_configuration(phase_names);
            reflect.load_configuration(function() {
                reflect.model = new reflect.Model(reflect.configuration, {});
                printf('  [ils_context] = ' + reflect.ils_context);
                if (reflect.ils_context === 'ils')
                    reflect.configuration.show_configuration = false;
                printf('  [show_configuration] = ' + reflect.configuration.show_configuration);
                printf('load_all [Configuration] ');
                reflect.model.summarize();
                reflect.load_resource(function() {
                    callback();
                });
            });
        }
    };

    reflect.update_phase_names_for_configuration = function(names) {
        var phases = reflect.configuration.model.phases;
        var len = names.length;

        printf('update_phase_names_for_configuration [Enter]');

        //  Delete old phases
        for (var i=0; i<phases.length;) {
            if (names.indexOf(phases[i].name) < 0) {
                phases.splice(i, 1);
                i = 0;
                continue;
            }
            i++;
        }

        //  Add new phases
        for (i=0; i<names.length; i++) {
            var seen = false;

            for (var j=0; j<phases.length; j++) {
                if (names[i] === phases[j].name) {
                    seen = true;
                    break;
                }
            }
            if (seen)
                continue;
            phases.push({
                name: names[i],
                norm: Math.round(100 / len)
            });
        }
        printf('  update_phase_names_for_configuration [Phases]');
        pp(reflect.configuration.model.phases);
        printf('update_phase_names_for_configuration [Done]');
    };

    /**
     *  Called after angular is finished.
     */
    reflect.start = function(spec) {
        printf('start [Enter] ');
        printf('  configuration ' + reflect.configuration_id);
        printf('  resource_     ' + reflect.resource_id);
        reflect.model.summarize();
        reflect.scope.questions = reflect.model.questions;
        reflect.scope.answers = reflect.model.answers;
        reflect.scope.informative = 'Reflection tool has started';
        reflect.scope_apply();
        printf('start [Exit]');
//        request_data();
    };


    /**
     *  Call $apply() when changes made did not originate from angular.
     */
    reflect.scope_apply = function() {
        var scope = reflect.scope;

        if (!scope.$$phase) 
            scope.$apply();
    };

    reflect.userId = function() {
        var handler = reflect.metadataHandler;
        var md = handler.getMetadata();

        return md.actor.id;
    };

    reflect.ilsId = function() {
        var handler = reflect.metadataHandler;
        var md = handler.getMetadata();

        return md.provider.id;
    };

    /**
     *  Log the action given by verb and content.  If save is true or
     *  undefined, and auto_save is active then the current model is also
     *  saved.
     */
    reflect.log = function(verb, content, save) {
        save = use_default(save, true);

        reflect.actionLogger.log(verb, content);
        if (save && reflect.configuration.auto_save) {
            reflect.save_resource(reflect.model);
        }
    };


    /**
     * Set up angular.
     */
    var ng_reflect = angular.module("reflect", ['ngSanitize',
                                                'LocalStorageModule',
                                                'golabUtils',
                                                'textAngular'
                                               ]).config(
        function($sceDelegateProvider) {
            var url1 = reflect.base_url + '/**';
            var url2 = 'http://go-lab.collide.info' + '/**';
            var url3 = 'http://golab.collide.info' + '/**';

            $sceDelegateProvider.resourceUrlWhitelist(
                [ url1, url2, url3
                ]);
        });

    ng_reflect.filter('translate', function() {
        return function (msg) {
            return reflect.translate(msg);
        };
    });

    ng_reflect.controller("reflect_controller", function($scope) {
        reflect.scope = $scope;
        printf('[Reflect] .reflect controller');
        
        $scope.this_scope = 'Reflect scope';
        $scope.base_url = reflect.base_url;
        $scope.model = reflect.model;
        $scope.configuration = reflect.configuration;
        $scope.configuring = 'questions';	// norms, questions, help

        $scope.status = {
            agent_data_available: false
        };

        $scope.show_help = function() {
            reflect.log("open", {
                userAction: 'show_help'
            });
            $("#reflect_dialog_help").dialog({
                title: 'Help ...',
                width: 600,
                buttons: {
                    "OK": function() {
                        $(this).dialog('close');
                    }
                }
            });
        };

        /*  Edit configuration calls.
         */
        $scope.edit_question = function(question) {
            reflect.log("change", { 
                userAction: 'edit_question',
                question: question
            });
            $scope.specify_question = reflect.model.question(question.name);
        };

        $scope.add_question = function() {
            reflect.log("change", { 
                userAction: 'add_question',
                question: question
            });
            var question = reflect.model.create_question();

            $scope.edit_question(question);
        };

        $scope.delete_question = function(question) {
            reflect.log("change", { 
                userAction: 'delete_question',
                question: question
            });
            if ($scope.specify_question.name === question.name)
                $scope.specify_question = null;
            reflect.model.delete_question(question.name);
        };

        $scope.up_question = function(question) {
            reflect.log("change", { 
                userAction: 'up_question',
                question: question
            });
            reflect.model.move_up_question(question.name);
        };

        $scope.down_question = function(question) {
            reflect.log("change", { 
                userAction: 'down_question',
                question: question
            });
            reflect.model.move_down_question(question.name);
        };

        $scope.edit_configuration = function() {
            var id = "#reflect_configuration";
            var title = 'Configure questions, norms and help';

            reflect.log("open", { 
                userAction: 'edit_configuration'
            });

            $(id).dialog({ title: title,
                           modal: true,
                           resizable: true,
                           width: 800,
                           minHeight: 400,
                           draggable: true,
                           create: function() {
                               setTimeout(function() {
                                   ut.commons.utils.gadgetResize();
                               }, 250);
                           }
                         });
        };

        $scope.close_configuration = function() {
            var id = "#reflect_configuration";

            reflect.log("close", { 
                userAction: 'close_configuration'
            });

            $(id).dialog('close');
            reflect.save_configuration();
            reflect.model.configuration_update();
        };

        $scope.set_configuring = function(mode) {
            $scope.configuring = mode;
            reflect.save_configuration();
        };

        $scope.answers_on_blur = function() {
            reflect.log("save", { 
                userAction: 'answers_on_blur',
                model: reflect.model.resource_json()
            });

            reflect.save_resource(reflect.model);
        };

        $scope.request_data = function() {
            reflect.log("send", { 
                userAction: 'request_data'
            });
            request_data();
        };

    });

    function request_data() {
        printf('request_data [Enter]');
        var scope = reflect.scope;

        scope.status.agent_data_available = true;

        var ils_id = reflect.ilsId();
        var user_id = reflect.userId();

        var spec = {
            ilsId: ils_id,
            userId: user_id,
            agentType: "reflect",
            agentName: "reflect",
            parameters: {}
        };

        console.log('request');
        console.log('WEBSERVICE ' + WEBSERVICE_URL);
        console.log(JSON.stringify(spec,null,4));
        
        $.post(WEBSERVICE_URL, spec,
               function(data) {
                   handle_response(data);
               });

        function handle_response(response) {
            console.log('AGENT RECEIVED');
            console.log(response);

            if (response.error) {
                printf('REFLECT ERROR ' + pp(response.error));
                scope.informative = 'Error retrieving data from logging service';
//                scope.model.agent_update();
                reflect.scope_apply();
                return;
            }

            scope.status.agent_data_available = true;
            scope.model.agent_update(response.phase_ranges);
            scope.informative = 'Data has been updated';

            reflect.scope_apply();
        }
    }

    ng_reflect.factory('languageHandler', function() {
        return reflect.languageHandler;
    });

    ng_reflect.factory('environmentHandlers', function() {
        return reflect.ehs;
    });

    reflect.translate = function(msg) {
        return (reflect.languageHandler ? reflect.languageHandler.getMessage(msg) : msg);
    };

}).call(this);
