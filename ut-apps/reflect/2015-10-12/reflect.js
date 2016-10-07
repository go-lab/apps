/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        reflect.js
 *  Part of     Go-Lab Reflection tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Main code and Angular handling
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014, 2015  University of Twente
 *  
 *  History     27/10/14  (Created)
 *		16/07/15  (Last modified)
 */ 

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var golab = this.golab = this.golab || {};
    var tools = ut.tools = ut.tools || {};
    var reflect = tools.reflect = tools.reflect || {};
    var utils = this.ut.commons.utils = this.ut.commons.utils || {};

    var WEBSERVICE_URL = "http://golab-dev.collide.info/analytics/reflection";
//    var WEBSERVICE_URL = "http://localhost:3090/analytics/reflection";
    var language = null;

    printf('************ LOADING reflect.js');

    reflect.model = null;		// See model.js
    reflect.ils_structure = null;	// See phases.js
    reflect.resource_id = null;		// Student resource id
    reflect.configuration_id = null;	// Configuration resource id
    reflect.chart_package = 'highcharts';	// Or highcharts

    reflect.configuration = {
        auto_save: true,
        show_configuration: true,	// Changed by set_context
        show_about: true,
        help_text: 'Enter your text here.',
        introduction: 'Enter an introduction here',
        model: {
            type: 'time_spent',
            phases: [
                { name: "Orientation",
                  norm: 20
                },
                { name: "Conceptualisation",
                  norm: 20
                },
                { name: "Investigation",
                  norm: 20
                },
                { name: "Conclusion",
                  norm: 20
                },
                { name: "Discussion",
                  norm: 20
                }
            ],
            questions: [
                { name: "General time spent",
                  text: "Did you spend relatively more time than could be expected in one or more of the phases?  If so, please consider why this was the case (e.g., a phase particularly difficult or a phase engaged your attention).  Explain why you think your time in the inquiry phases differed from the suggested norm time.  If your time was the same then explain if you think all inquiry projects follow this general distribution."
                }
            ]
        }
    };

    /**
     *  Called before angular is started.
     */
    reflect.configure = function(spec, callback) {
        var type = spec.type || 'time_spent';
        var phase_names;

        printf('------------ .configure enter');
        if (window.ils) {

            var mh = reflect.metadataHandler;
            mh.getILSStructure(function(err, result) {
                if (err) {
                    printf('mh.getILSStructure');
                    printf('ERROR ' + JSON.stringify(err,null,4));
                    return callback();
                } else {
                    reflect.ils_structure = result;
                    phase_names = reflect.phases_from_ils_structure(result);
                    printf('------------ .configure in ILS');
                    printf('ILS PHASE NAMES ' + phase_names);
                    load_all(phase_names, callback);
                }
            });
/*
            reflect.get_phase_and_tool_structure(function(result) {
                if (result.error) {
                    printf('window.ils.get_phase_and_tool_structure');
                    printf('ERROR ' + JSON.stringify(result,null,4));
                    return callback();
                } else {
                    reflect.ils_structure = result;
                    phase_names = reflect.phases_from_ils_structure(result);
                    printf('------------ .configure in ILS');
                    printf('ILS PHASE NAMES ' + phase_names);
                    load_all(phase_names, callback);
                }
            });
*/
        } else {
            phase_names = reflect.default_phases();
            printf('------------ .configure standalone');
            load_all(reflect.default_phases(), callback);
        }

        function load_all(phase_names, callback) {
            reflect.load_configuration(function() {
                if (window.ils)
                    reflect.update_phase_names_for_configuration(phase_names);
                reflect.model = new reflect.Model(reflect.configuration, {});
                reflect.load_resource(function() {
                    printf('------------ .configure load_all callback ');
                    callback();
                });
            });
        }
    };

    reflect.update_phase_names_for_configuration = function(names) {
        var phases = reflect.configuration.model.phases;
        var len = names.length;

        printf('---------------- update_phase_names_for_configuration');

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

    };

    /**
     *  Called after angular is finished.
     */
    reflect.start = function(spec) {
        printf('######################### STARTING ####################');
        printf('configuration_id ' + reflect.configuration_id);
        printf('resource_id ' + reflect.resource_id);
/*
        printf('CONFIGURATION');
        printf(JSON.stringify(reflect.configuration,null,4));
        printf('MODEL ** ');
        printf(JSON.stringify(reflect.model.json(),null,4));
*/
        reflect.scope.questions = reflect.model.questions;
        reflect.scope.answers = reflect.model.answers;
        reflect.scope_apply();
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
/*
            console.log('$sceDelegateProvider ' + url1);
            console.log('$sceDelegateProvider ' + url2);
            console.log('$sceDelegateProvider ' + url3);
*/
        });

    ng_reflect.filter('translate', function() {
        
        return function (msg) {
            return reflect.translate(msg);
        };
    });

    ng_reflect.controller("reflect_controller", function($scope) {
        reflect.scope = $scope;
        
        $scope.this_scope = 'Reflect scope';
        $scope.base_url = reflect.base_url;
        $scope.model = reflect.model;
        $scope.configuration = reflect.configuration;
        $scope.configuring = 'questions';	// norms, questions, help

        $scope.status = {
            agent_data_available: false
        };

        $scope.show_help = function() {
            printf('calling show help');
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
            printf('------------ $scope.edit_question ' + question.name);
            $scope.specify_question = reflect.model.question(question.name);
            printf('------------ specify_question = ');
            printf(JSON.stringify($scope.specify_question,null,4));
        };

        $scope.add_question = function() {
            printf('------------ $scope.add_question ');
            var question = reflect.model.create_question();

            $scope.edit_question(question);
        };

        $scope.delete_question = function(question) {
            printf('------------ $scope.delete_question ');
            if ($scope.specify_question.name === question.name)
                $scope.specify_question = null;
            reflect.model.delete_question(question.name);
        };

        $scope.up_question = function(question) {
            printf('------------ $scope.up_question ');
            reflect.model.move_up_question(question.name);
        };

        $scope.down_question = function(question) {
            printf('------------ $scope.down_question ');
            reflect.model.move_down_question(question.name);
        };

        $scope.edit_configuration = function() {
            printf('------------ .edit_configuration enter');
            var id = "#reflect_configuration";
            var title = 'Configure norms, questions and help';

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
                           },
                           buttons: {
                               "Ready": function() {
                                   $(this).dialog('close');
                                   reflect.model.configuration_update();
                                   reflect.save_configuration();
                                   reflect.scope_apply();
                               }
                           }
                         });
        };

        $scope.set_configuring = function(mode) {
            printf('------------ $scope.set_configuring ' + mode);
            $scope.configuring = mode;
            reflect.save_configuration();
        };

        $scope.answers_on_blur = function() {
            reflect.save_resource(reflect.model);
        };

        $scope.request_data = function() {
            request_data();
        };

    });

    ng_reflect.controller('reflect1_controller', function($scope) {
        reflect.scope1 = $scope;
        $scope.this_scope = 'Reflect1 scope';
        $scope.model = reflect.model;

        reflect.chart_package = 'highcharts';
    });

    function request_data() {
        var scope = reflect.scope;

        scope.status.agent_data_available = true;

        var spec = {
            userId: reflect.userId(),
            ilsId: reflect.ilsId(),
            agentType: "reflection",
            agentName: "time_spent",
            parameters: {}
        };

        console.log('request');
        console.log('WEBSERVICE ' + WEBSERVICE_URL);
        console.log(JSON.stringify(spec,null,4));
        
        $.post(WEBSERVICE_URL, spec, function(result) {
            var data;

            if (typeof(result) === 'string')
                data = JSON.parse(result);
            else
                data = result;

            console.log('DATA RECEIVED FROM AGENT');
            console.log('------------------------');
            console.log(JSON.stringify(data,null,4));
            console.log('------------------------');
            console.log('ERROR ' + JSON.stringify(data.err,null,4));
            console.log('------------------------');

            if (data.err) {
                scope.model.agent_update();
            } else {
                scope.model.agent_update(data);
            }
            scope.status.agent_data_available = true;

            reflect.scope_apply();
        });

/*
        var spec2 = {
            userId: reflect.userId(),
            ilsId: reflect.ilsId(),
            agentType: "reflection",
            agentName: "tool_usage",
            parameters: {}
        };

        console.log('request');
        console.log('WEBSERVICE ' + WEBSERVICE_URL);
        console.log(JSON.stringify(spec2,null,4));
        
        $.post(WEBSERVICE_URL, spec2, function(result) {
            var data;

            if (typeof(result) === 'string')
                data = JSON.parse(result);
            else
                data = result;

            console.log('DATA RECEIVED FROM AGENT');
            console.log('------------------------');
            console.log(JSON.stringify(data,null,4));
            console.log('------------------------');
            console.log(JSON.stringify(data.err,null,4));
            console.log('------------------------');

            if (data.err) {
                scope.model.agent_update();
            } else {
                scope.model.agent_update(data);
            }
            scope.status.agent_data_available = true;
            });
*/
        reflect.scope_apply();
    }

    ng_reflect.factory('languageHandler', function() {
        return reflect.languageHandler;
    });

    reflect.translate = function(msg) {
        if (reflect.languageHandler) {
            return reflect.languageHandler.getMessage(msg);
        }
        return msg;
    };

}).call(this);
