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
 *		14/10/15  (Last modified)
 */ 

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var reflect = tools.reflect = tools.reflect || {};

    printf('========== loading tools/reflect/js/model.js');

    var Model = reflect.Model = function(configuration, spec) {
        spec = use_default(spec, {});
        this.type = configuration.model.type;
        this.phases = configuration.model.phases;
        this.questions = configuration.model.questions;

        this.load_resource({
            data: spec.data,		// TBD - remove
            time_spent: spec.time_spent || spec.data,
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
        this.time_spent = spec.time_spent || spec.data || [];
        this.answers = spec.answers || {};

        for (var q=0; q<this.questions.length; q++) {
            var question = this.questions[q].name;

            if (typeof(this.answers[question]) === 'undefined')
                this.answers[question] = '';
        }

        this.init_time_spent_array();
    };

    Model.prototype.init_time_spent_array = function() {
        var phases = this.phases;
        var len = phases.length;

        this.time_spent.splice(0, this.time_spent.length);

        for (var p=0; p<len; p++) {
            var phase = this.phases[p];

            this.time_spent[p] = {
                phase: phase.name,
                norm: phase.norm,
                student: 0,
                millis: 0
            };
        }
    };

    Model.prototype.resource_json = function() {
        var rval = {
            time_spent: this.time_spent,
            answers: this.answers
        };

        return reflect.remove_hashKeys(rval);
    };

    Model.prototype.json = function() {
        var rval = {
            type: this.type,
            phases: this.phases,
            questions: this.questions,
            time_spent: this.time_spent,
            answers: this.answers
        };

        return reflect.remove_hashKeys(rval);
    };

    Model.prototype.summarize = function() {
        printf('Model.summarize [Enter]');
        for (var i=0; i<this.phases.length; i++)
            printf(i + ' ' + this.phases[i].name + ' ' + this.phases[i].norm);
        printf('Model.summarize [Exit]');
    };

    Model.prototype.norm_sum = function() {
        var sum = 0;

        for (var p=0; p<this.phases.length; p++) {
            sum += this.phases[p].norm;
        }

        return sum;
    };

    Model.prototype.configuration_update = function() {
        printf('Model.configuration update [Enter]');
        this.init_time_spent_array();
        this.agent_update();
        printf('Model.configuration update [Exit]');
    };

    /**
     *  Compute total time spent per phase from phase transition data.
     *
     *  Returns an array with objects { "phase": phase, "millis": millis }.
     */
    Model.prototype.compute_time_spent = function(phase_changes) {
        var phase_agg = {};
        var prev_stamp = null;
        var prev_phase = null;

        for (var i=0; i<phase_changes.length; i++) {
            var pc = phase_changes[i];
            var phase = pc.phase;
            var timestamp = pc.timestamp;
            var interval = (prev_stamp === null ? 0 : timestamp - prev_stamp);

            printf(i + ' ' + phase + ' ' + timestamp);

            if (prev_phase) {
                if (!phase_agg[prev_phase])
                    phase_agg[prev_phase] = {
                        phase: prev_phase,
                        millis: interval
                    };
                else
                    if (prev_stamp !== null)
                        phase_agg[prev_phase].millis += interval;
                printf('adding ' + interval + ' to ' + prev_phase + ' ' + phase_agg[prev_phase].millis);
            }

/*
            printf(i);
            printf(phase + ' ' + timestamp);
            pp(phase_agg);
*/

            prev_stamp = timestamp;
            prev_phase = phase;
        }

        return phase_agg;
    };



    /**
     *  Update of the data provided by the agent.  Format of the data is:
     *
     *  [
     *    phase: <phase>,
     *    timestamp: <timestamp>,
     *    published: <time as a string>,		// TBD - remove
     *    action_type: <action type as a string>	// TBD - remove
     *  ]
     */
    Model.prototype.agent_update = function(data) {
        var sum = 0;
        var transitions = [];
        var phase;
        var chart;
        var i, j;

        if (data === undefined) {
            printf('Model.agent_update called with no data - ignoring');
/*
            var spec = this.random_data();
            var millis_in_phases = spec.millis_in_phases;

            this.transitions = spec.transitions;
*/
            return;
        }

        printf('Model.agent_update ' + data.length + ' items');
//        pp(this.time_spent);

        var phase_agg = this.compute_time_spent(data);
        var time_spent = this.time_spent;

        for (j=0; j<time_spent.length; j++) {
            time_spent[j].student = 0;
            time_spent[j].millis = 0;
        }

/*
        printf('TIME_SPENT_AT_START');
        pp(time_spent);
        printf('------------------');

        printf('COMPUTE_TIME_SPENT');
        pp(phase_agg);
        printf('------------------');
*/

        for (var p in phase_agg) {
            var phase_seen = false;
            for (j=0; j<time_spent.length; j++) {
                if (p === time_spent[j].phase) {
                    time_spent[j].millis = phase_agg[p].millis;
                    phase_seen = true;
                    break;
                }
            }
            if (!phase_seen) {
                printf('  !phase_seen ' + p);
                time_spent.push({
                    phase: p,
                    norm: 0,
                    student: 0,
                    millis: phase_agg[p].millis
                });
            }
        }

        for (i=0, sum=0; i<time_spent.length; i++) {
            //  Ignore phase if norm is not given
            if (time_spent[i].norm > 0)
                sum += time_spent[i].millis;
        }

        for (i=0; i<time_spent.length; i++) {
            var item = time_spent[i];
            
            if (sum > 0)
                item.student = item.millis / sum * 100;
        }

        //            transitions = this.transitions(options.phase_changes);

        if (reflect.chart_package === 'highcharts') {
            var phase_names = [];
            var student_data = [];
            var norm_data = [];

            for (i=0, sum=0; i<this.time_spent.length; i++) {
                var row = this.time_spent[i];

                if (row.norm > 0) {
                    phase_names.push(row.phase);
                    student_data.push({
                        y: row.student,
                        millis: row.millis
                    });
                    norm_data.push(row.norm);
                }
            }

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
                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'time_spent',
                        type: 'column',
                        inverted: true
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

                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    //  Include minutes and seconds for user bars
                                    if (this.point.millis) {
                                        return toMMSS(this.point.millis/1000);
                                    }
                                    return '';
                                }
                            },
                            enableMouseTracking: false
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

                chart = new Highcharts.Chart({
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

    Model.prototype.random_data = function() {
        var len = this.phases.length;
        var phase;

        for (var p=0; p<len; p++) {
            phase = this.phases[p];
            var student = 100 / len + Math.random(5);

            this.time_spent[p] = {
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

        return {
            time_spent: time_spent,
            transitions: transitions
        };
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
    };

    function swap(array, i, j) {
        var tmp = array[i];

        array[i] = array[j];
        array[j] = tmp;
    }

    function toHHMMSS(secs) {
        var sec_num = parseInt(secs, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
    }

    function toMMSS(secs) {
        var sec_num = parseInt(secs, 10); // don't forget the second param
        var hours   = 0;
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

}).call(this);
