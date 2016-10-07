/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        model.js
 *  Part of     Go-Lab Reflection Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Representation of the model
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2014  University of Twente
 *  
 *  History     28/11/14  (Created)
 *		16/07/15  (Last modified)
 */ 

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var reflect = tools.reflect = tools.reflect || {};

    printf('************ LOADING model.js');

    var Model = reflect.Model = function(configuration, spec) {
        spec = use_default(spec, {});
        this.type = configuration.model.type;
        this.phases = configuration.model.phases;
        this.questions = configuration.model.questions;

        this.load_resource({
            data: spec.data,
            answers: spec.answers
        });

        return this;
    };

    Model.prototype.question = function(name) {
        for (var q=0; q<this.questions.length; q++) {
            var question = this.questions[q];

            if (question.name === name)
                return question;
        }
        return null;
    };

    Model.prototype.create_question = function() {
        var question = {
            name: '',
            text: ''
        };

        this.questions.push(question);

        return question.name;
    };

    Model.prototype.delete_question = function(name) {
        for (var i=0; i<this.questions.length; i++) {
            var question = this.questions[i];

            if (question.name === name)
                return this.questions.splice(i, 1);
        }
    };

    Model.prototype.move_up_question = function(name) {
        var questions = this.questions;

        for (var i=0; i<questions.length; i++)
            if (questions[i].name === name)
                return swap(questions, i-1, i);

        return false;
    };

    Model.prototype.move_down_question = function(name) {
        var questions = this.questions;

        for (var i=0; i<questions.length; i++)
            if (questions[i].name === name)
                return swap(questions, i+1, i);

        return false;
    };

    Model.prototype.load_resource = function(spec) {
        this.data = spec.data || [];
        this.answers = spec.answers || {};

        for (var q=0; q<this.questions.length; q++) {
            var question = this.questions[q].name;

            if (typeof(this.answers[question]) === 'undefined')
                this.answers[question] = '';
        }

        this.init_data_array();
    };

    Model.prototype.init_data_array = function() {
        var phases = this.phases;
        var len = phases.length;

        this.data.splice(0, this.data.length);

        for (var p=0; p<len; p++) {
            var phase = this.phases[p];

            this.data[p] = {
                phase: phase.name,
                norm: phase.norm,
                student: 0
            };
        }
    };

    Model.prototype.resource_json = function() {
        var rval = {
            data: this.data,
            answers: this.answers
        };

        return reflect.remove_hashKeys(rval);
    };

    Model.prototype.json = function() {
        var rval = {
            type: this.type,
            phases: this.phases,
            questions: this.questions,
            data: this.data,
            answers: this.answers
        };

        return reflect.remove_hashKeys(rval);
    };

    Model.prototype.norm_sum = function() {
        var sum = 0;

        for (var p=0; p<this.phases.length; p++) {
            sum += this.phases[p].norm;
        }

        return sum;
    };

    Model.prototype.configuration_update = function() {
        printf('---------------- configuration update');
        this.init_data_array();
        this.agent_update();
    };

    /**
     *  Fill the student slots of the data.  Array is of the form:
     *  { PHASE: seconds, ... }
     */
    Model.prototype.agent_update = function(options) {
        var spec = options ? options.time_spent : undefined;
        var sum = 0;
        var transitions = [];
        var phase, i;
        
        printf('agent_update ' + JSON.stringify(options,null,4));

        //  Random data
        if (spec === undefined) {
            printf('############################# spec undefined');
            var len = this.phases.length;

            for (var p=0; p<len; p++) {
                phase = this.phases[p];
                var student = 100 / len + Math.random(5);

                this.data[p] = {
                    phase: phase.name,
                    norm: phase.norm,
                    student: student
                };
            }

            var default_phase_changes = [
                {
                    "phase": "Orientation",
                    "millis": 1434717049900
                },
                {
                    "phase": "Investigation",
                    "millis": 1434717076342
                },
                {
                    "phase": "Hello world",
                    "millis": 1434717089817
                },
                {
                    "phase": "Conceptualisation",
                    "millis": 1434717100946
                },
                {
                    "phase": "Investigation",
                    "millis": 1434718113584
                },
                {
                    "phase": "Conclusion",
                    "millis": 1434718120404
                },
                {
                    "phase": "Discussion",
                    "millis": 1434718124891
                },
                {
                    "phase": "Hello world",
                    "millis": 1434718129865
                }
            ];

            transitions = this.transitions(default_phase_changes);
        } else {
            printf('############################# spec defined');
            for (phase in spec) {
                sum += spec[phase];
            }

            for (phase in spec) {
                var pct = (sum > 0 ? spec[phase] / sum * 100 : 0);

                for (i=0; i<this.data.length; i++) {
                    var entry = this.data[i];

                    if (entry.phase === phase) {
                        entry.student = pct;
                    }
                }
            }
            transitions = this.transitions(options.phase_changes);
        }

        if (reflect.chart_package === 'highcharts') {
            var phase_names = [];
            var student_data = [];
            var norm_data = [];

            for (i=0, sum=0; i<this.data.length; i++) {
                var row = this.data[i];

                phase_names.push(row.phase);
                student_data.push(row.student);
                norm_data.push(row.norm);
                sum += row.student;
            }

            printf(student_data);
            printf(sum);

            for (i=0; i<student_data.length; i++)
                student_data[i] = student_data[i] / sum * 100;

            printf(phase_names);
            printf(student_data);
            printf(norm_data);

            var series = [ {
                name: reflect.translate('suggested'),
                data: norm_data
            }, {
                name: reflect.translate('yours'),
                data: student_data
            }
            ];

            printf('SERIES');
            printf(JSON.stringify(series,null,4));

            if ($('#time_spent').length > 0) {
                printf('CREATING TIME SPENT CHART');
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'time_spent',
                        type: 'column',
                        inverted: true,
                        animation: false
                    },

                    credits: {
                        enabled: false
                    },

                    title: {
                        text: reflect.translate('percentage_time_spent')
                    },

/*
                    subtitle: {
                        text: 'Time spent'
                    },
*/
                    xAxis: {
                        categories: phase_names,
                        title: {
                            text: null
                        },
                        labels: {
                            style: {
                                'font-size': '18px'
                            }
                        }
                    },

                    yAxis: {
                        min: 0,
//                        max: 100,
                        title: {
                            text: null
                        },
                        labels: {
                            formatter: function() {
                                return this.value + '%';
                            }
                        }
                    },

                    legend: {
                    },

                    series: series
                });
            }

            if ($('#transitions').length > 0) {
                printf('CREATING TRANSITIONS CHART');
                var points = [];
                var colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];

                printf('PHASE NAMES ' + phase_names);

                var plen = phase_names.length - 1;

                for (var t=0; t<transitions.length; t++) {
                    var item = transitions[t];
                    var idx = phase_names.indexOf(item.phase);

                    points.push({
                        x: item.start + 7200 * 1000,
                        x2: item.end + 7200 * 1000,
                        y: plen - idx,
                        color: colors[plen-idx]
                    });
                }

                series = [ {
                    showInLegend: false,
                    data: points
                } ];

                phase_names.reverse();
                printf('REVERSE PHASE NAMES ' + phase_names);

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'transitions',
                        type: 'xrange',
                        animation: false
                    },

                    credits: {
                        enabled: false
                    },

                    title: {
                        text: reflect.translate('transitions')
                    },

                    subtitle: {
                        text: reflect.translate('transitions_subtitle')
                    },

                    xAxis: {
                        type: 'datetime',
                        title: {
                            text: null
                        }
                    },

                    yAxis: {
                        categories: phase_names,
                        min: 0,
                        max: plen,
                        title: {
                            text: null
                        },
                        labels: {
                            style: {
                                'font-size': '18px'
                            }
                        }
                    },

                    series: series
                });
            }
        }
    };

    Model.prototype.transitions = function(phase_changes) {
        var len = phase_changes.length;
        var rval = [];
        var i;

        if (len === 0)
            return rval;

        var millis = phase_changes[0].millis;
        var phase = phase_changes[0].phase;
       
        for (i=1; i<len; i++) {
            var item = phase_changes[i];

            printf('item ' + i + ' ' + JSON.stringify(item));

            rval.push({
                phase: phase,
                start: millis,
                end: item.millis,
                seconds: (item.millis - millis) / 1000
            });

            millis = item.millis;
            phase = item.phase;
        }

        return rval;
    };

    reflect.remove_hashKeys = function(obj) {
        for (var p in obj) {
            if (p === '$$hashKey') {
                delete obj[p];
                continue;
            }
            var sub = obj[p];
            
            if (sub === null)
                continue;

            if (typeof sub === 'object')
                reflect.remove_hashKeys(sub);
        }
        return obj;
    }

    function swap(array, i, j) {
        var tmp = array[i];

        array[i] = array[j];
        array[j] = tmp;
    }

}).call(this);
