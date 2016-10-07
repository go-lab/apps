/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        teacher.js
 *  Part of     Go-Lab Questionnaire tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Teacher view
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     30/06/16  (Created)
 *		03/07/16  (Last modified)
 */

(function() {
    "use strict";
    console.log('========== loading tools/quest/js/teacher.js');

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var quest = tools.quest = tools.quest || {};

    quest.teacher_view = function(configuration, resources) {
        console.log('teacher_view ' + resources.length + ' resources');

        var view = JSON.parse(JSON.stringify(configuration));
        var questions = view.questions;
        var question;
        var qmap = {};
        var i, j;

        for (i=0; i<questions.length; i++) {
            question = questions[i];

            qmap[question.id] = question;

            question.data = {};
            if (question.type === quest.LIKERT) {
                question.data = new Array(20);
                for (j=0; j<20; j++)
                    question.data[j] = 0;
            }
            if (question.type === quest.OPEN)
                question.data = [];
        }

        for (i=0; i<resources.length; i++) {
            var resource = resources[i];
            var student = resource.student;
            var answers = resource.text.answers;

            for (j in answers) {
                var a = answers[j];

                if (a.value === undefined)
                    continue;

                var q = qmap[j];

                if (!q) {
                    console.log('[Quest] Question not found for ' + student + ' ' + a.value);
                    continue;
                }

                if (q.type === quest.LIKERT) {
                    q.data[parseInt(a.value,10)]++;
                    continue;
                }

                if (q.type === quest.OPEN) {
                    q.data.push({
                        student: student,
                        text: a.value
                    });
                    continue;
                }

                if (q.data[a.value])
                    q.data[a.value]++;
                else
                    q.data[a.value] = 1;
            }
        }

        quest.scope.student_data = quest.student_data = view;
    };

}).call(this);
