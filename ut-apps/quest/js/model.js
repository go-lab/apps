/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        model.js
 *  Part of     Go-Lab Questionnaire tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Representation of the underlying model
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2016  University of Twente
 *  
 *  History     30/06/16  (Created)
 *		24/07/16  (Last modified)
 */

(function() {
    "use strict";
    console.log('========== loading tools/quest/js/model.js');

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = utils.is;
    var quest = tools.quest = tools.quest || {};

    var icons = {
        'open': 'fa-font',
        'likert': 'fa-circle-o',
        'multiple_choice': 'fa-list'
    };

    var all_colors = [
        '#058DC7',
        '#DF5353',
        '#ED561B',
        '#7CB5EC',
        '#8085E9',
        '#1F949A',
        '#24CBE5',
        '#2B908F',
        '#82914E',
        '#86777F',
        '#7798BF',
        '#9B5E4A',
        '#AAEEEE',
        '#F7A35C',
        '#8D4654',
        '#42A07B',
        '#50B432',
        '#90EE7E',
        '#514F78',
        '#55BF3B',
        '#64E572',
        '#6AF9C4',
        '#72727F',
        '#FF0066',
        '#FF9655',
        '#DDDF0D',
        '#EEAAEE',
        '#F45B5B',
        '#FFF263'
    ];

    var Model = quest.Model = function(spec) {
        var scale;
        var i;

        this.configuration = spec.configuration;
        this.questions = spec.configuration.questions || [];
        this.scales = spec.configuration.scales || [];
        this.answers = spec.answers || {}; // Indexed on question.id

        for (i=0; i<this.questions.length; i++) {
            var question = this.questions[i];

            if (question.type === quest.LIKERT && question.likert.scale_id)
                question.likert.scale = this.find_scale(question.likert.scale_id);
        }

        //  Remove colors already used
        for (i=0; i<this.scales.length; i++) {
            scale = this.scales[i];

            if (scale.color) {
                var idx = all_colors.indexOf(scale.color);

                if (idx >= 0)
                    all_colors.splice(idx, 1);
            } else {
                if (all_colors.length > 0) {
                    scale.color = all_colors[0];
                    all_colors.splice(0, 1);
                } else
                    scale.color = '#000000';
            }
        }

        //  Check that one of the scales contains smileys
        var smileys_seen = false;

        for (i=0; !smileys_seen && i<this.scales.length; i++) {
            scale = this.scales[i];
            if (scale.smileys)
                smileys_seen = true;
        }

        if (!smileys_seen)
            this.smileys_scale();
    };

    Model.prototype.json_answers = function() {
        var content = remove_hashKeys({
            answers: this.answers
        });

        return JSON.parse(JSON.stringify(content));
    };

    Model.prototype.json_configuration = function() {
        var copy = JSON.parse(JSON.stringify(this.configuration));

        remove_hashKeys(copy);

        for (var i=0; i<copy.questions.length; i++) {
            var question = copy.questions[i];

            question.answer = undefined; // Remove answers
            if (question.image) // Remove loaded images
                question.image.is_loaded = false;
            if (question.type === quest.LIKERT && question.likert.scale)
                question.likert.scale_id = question.likert.scale.id;
        }

        return copy;
    };

    Model.prototype.load_answers = function(content) {
        this.answers = content.answers || {};
        this.answers_make_consistent();
    };


    /**
     *  Return the question index (first is 1)
     */
    Model.prototype.question_index = function(question) {
        for (var i=0; i<this.questions.length; i++) {
            if (this.questions[i] === question)
                return i+1;
        }

        return null;
    };

    /**
     *  Delete a question.
     */
    Model.prototype.question_delete = function(question) {
        for (var i=0; i<this.questions.length; i++) {
            var q = this.questions[i];

            if (question === q) {
                this.questions.splice(i, 1);
                this.questions_make_consistent();
                return;
            }
        }
    };

    /**
     *  Delete the option of a question.
     */
    Model.prototype.option_delete = function(question, option) {
        var i;
        var opt;

        if (question.type === quest.MULTIPLE_CHOICE) {
            for (i=0; i<question.multiple_choice.options.length; i++) {
                opt = question.multiple_choice.options[i];

                if (opt === option) {
                    question.multiple_choice.options.splice(i, 1);
                    this.questions_make_consistent();
                    return;
                }
            }
        }
        if (question.type === quest.LIKERT) {
            for (i=0; i<question.likert.scale.options.length; i++) {
                opt = question.likert.scale.options[i];

                if (opt === option) {
                    question.likert.scale.options.splice(i, 1);
                    this.questions_make_consistent();
                    return;
                }
            }
        }
    };

    Model.prototype.multiple_choice_option_by_id = function(question, id) {
        for (var i=0; i<question.multiple_choice.options.length; i++)
            if (question.multiple_choice.options[i].id === id)
                return question.multiple_choice.options[i];
        return null;
    };

    Model.prototype.multiple_choice_option_by_text = function(question, text) {
        if (question.type !== quest.MULTIPLE_CHOICE)
            return null;
        for (var i=0; i<question.multiple_choice.options.length; i++)
            if (question.multiple_choice.options[i].text === text)
                return question.multiple_choice.options[i];
        return null;
    };

    Model.prototype.open_answer = function(question) {
        var answer = question.answer;

        answer.answered = true;
    };

    Model.prototype.likert_answer = function(question) {
        var answer = question.answer;

        answer.answered = true;
    };

    Model.prototype.multiple_choice_answer = function(question, option) {
        var answer = question.answer;
        option = option || this.multiple_choice_option_by_text(answer.value);

        answer.answered = true;

        if (option)
            answer.option = option.id;
    };

    Model.prototype.question_by_id = function(id) {
        for (var i=0; i<this.questions.length; i++)
            if (this.questions[i].id === id)
                return this.questions[i];
        return null;
    };

    Model.prototype.answers_make_consistent = function() {
        var answers = this.answers;
        var question, answer;
        var i, j;

        this.questions_make_consistent();

        //  Delete answers of which the question no longer exists
        for (var id in this.answers) {
            question = this.question_by_id(id);
            if (!question || question.empty)
                delete answers[id];
        }

        for (i=0; i<this.questions.length; i++) {
            question = this.questions[i];

            if (question.empty)
                continue;

            var type = question.type;

            if (!answers[question.id])
                answers[question.id] = this.empty_answer();
            answer = question.answer = answers[question.id];
            answer.id = question.id;
            answer.type = type;
            answer.question = question.text;

            if (answer.answered) {
                if (type === quest.OPEN)
                    this.open_answer(question, answer.value);
                if (type === quest.MULTIPLE_CHOICE) {
                    var option = this.multiple_choice_option_by_id(question, answer.option);
                    this.multiple_choice_answer(question, option);
                }
            }
        }
    };

    /**
     *  Clear all student answers.  Usually called when edit configuration is
     *  started.
     */
    Model.prototype.answers_clear_all = function() {
        var answers = this.answers;

        for (var i=0; i<this.questions.length; i++) {
            var question = this.questions[i];

            question.answer = null;
        }

        for (var key in answers)
            delete answers[key];

        this.answers_make_consistent();
    };

    Model.prototype.empty_cells_clear = function() {
        var i, j;

        for (i=0; i<this.questions.length; i++) {
            var question = this.questions[i];

            if (!question.text || question.text.length === 0) {
                this.questions.splice(i--, 1);
                continue;
            }

            if (question.type === quest.MULTIPLE_CHOICE) {
                var options = question.multiple_choice.options;

                for (j=0; j<options.length; j++) {
                    if (options[j].text.length === 0)
                        options.splice(j--, 1);
                }
            }
        }
    };

    Model.prototype.delete_unused_scales = function() {
        var scales = this.scales;
        var questions = this.questions;
        var i;

        for (i=0; i<scales.length; i++) {
            if (scales[i].smileys)
                scales[i].used = true;
            else
                scales[i].used = false;
        }

        for (i=0; i<questions.length; i++) {
            var question = questions[i];

            if (question.type === quest.LIKERT && question.likert.scale)
                question.likert.scale.used = true;
        }

        for (i=scales.length-1; i>=0; i--) {
            if (scales[i].used === false)
                scales.splice(i, 1);
            else
                scales[i].used = undefined;
        }
    };

    var init_question_scales = false;

    Model.prototype.init_question_scales = function() {
        var i, j, k;

        for (i=0; i<this.questions.length; i++) {
            var question1 = this.questions[i];

            if (question1.type === quest.LIKERT &&
                !question1.empty && !question1.scale_checked) {
                var scale1 = question1.likert.scale.options;

                for (j=i+1; j<this.questions.length; j++) {
                    var question2 = this.questions[j];

                    if (question2.type === quest.LIKERT &&
                        !question2.empty && !question2.scale_checked) {
                        var scale2 = question2.likert.scale.options;
                        var same = true;

                        if (scale1.length !== scale2.length)
                            break;

                        for (k=0; k<scale1.length; k++)
                            if (scale1[k].text !== scale2[k].text) {
                                same = false;
                                break;
                            }
                        if (same === true) {
                            question2.likert.scale = question1.likert.scale;
                            question2.scale_checked = true;
                        }
                    }
                }
            }
        }

        //  Remove flag (not saved as .json)
        for (i=0; i<this.questions.length; i++)
            this.questions[i].scale_checked = undefined;
    };

    Model.prototype.questions_make_consistent = function() {
        var empty_seen;
        var question;
        var answer;
        var scale = null;
        var index = 1;
        var len;
        var i, j;

        if (!init_question_scales) {
            this.init_question_scales();
            init_question_scales = true;
        }

        if (this.questions.length === 0) {
            if (this.configuration.questions)
                this.questions = this.configuration.questions;
        }

        //  Label the scales
        for (i=0; i<this.scales.length; i++) {
            scale = this.scales[i];

            if (scale.smileys === true) {
                scale.label = 'Smileys';
                continue;
            }

            options = scale.options;
            len = options.length - 1; // One is empty
            var labels = [];

            if (len === 0) {
                scale.label = 'No options provided';
                continue;
            }

            for (j=0; j<options.length; j++)
                if (options[j].text.length > 0)
                    labels.push(options[j].text);
            scale.label = labels.join(' | ');
        }

        //  Make sure all attributes are available
        for (i=0; i<this.questions.length; i++) {
            question = this.questions[i];

            question.icon = icons[question.type];

            if (!question.id)
                question.id = quest.uuid();
            if (question.has_image === undefined)
                question.has_image = false;
            if (question.has_image) {
                if (question.image.is_loaded === false)
                    this.load_image(question, question.image.url);
            }

            if (question.type === quest.LIKERT) {
                if (question.likert.scale) {
                    scale = question.likert.scale;
                } else {
                    if (scale)
                        question.likert.scale = scale;
                    else {
                        question.likert.scale = this.empty_scale();
                        scale = question.likert.scale;
                    }
                }
            } else
                scale = null;

            question.font = 'plain';
            question.index = (index++) + '. ';
        }

        //  Check that at least one question is empty
        empty_seen = false;

        for (i=0; i<this.questions.length; i++) {
            question = this.questions[i];

            if (question.text && question.text.length > 0)
                question.empty = false;
            else {
                question.empty = true;
                empty_seen = true;
            }
        }

        if (!empty_seen) {
            var empty_question = this.empty_question();
            var last = this.questions.length;

            if (last > 0 && this.questions[last-1].type === quest.LIKERT) {
                empty_question.type = quest.LIKERT;
                empty_question.likert = this.empty_question_type(quest.LIKERT);
                empty_question.likert.scale = this.questions[last-1].scale;
                empty_question.likert.same_scale = true;
            }

            this.questions.push(empty_question);
        }

        for (i=0; i<this.questions.length; i++) {
            question = this.questions[i];
            answer = question.answer;
            var type = question.type;

            //  Check that for a multiple choice/scale question at least one option is empty
            if (type === quest.MULTIPLE_CHOICE && !question.empty) {
                if (!question.multiple_choice.options)
                    question.multiple_choice = this.empty_question_type(quest.MULTIPLE_CHOICE);

                var options = question.multiple_choice.options;

                empty_seen = false;

                for (j=0; j<options.length; j++) {
                    var option = options[j];

                    if (!option.id)
                        option.id = quest.uuid();

                    if (option.text.length > 0) {
                        option.empty = false;
                        continue;
                    }

                    empty_seen = true;
                }

                if (!empty_seen)
                    options.push(this.empty_multiple_choice_option());
            }

            //  Check that for a likert scale question at least one option is empty
            if (type === quest.LIKERT && !question.empty) {
                var options = question.likert.scale.options;

                empty_seen = false;

                for (j=0; j<options.length; j++) {
                    var option = options[j];

                    if (!option.id)
                        option.id = quest.uuid();

                    if (option.text.length > 0) {
                        option.empty = false;
                        continue;
                    }

                    empty_seen = true;
                }

                if (!empty_seen)
                    options.push(this.empty_scale_option());
            }
        }

        //  Add same_scale attribute if scales of subsequent questions are the same
        for (i=0; i<this.questions.length; i++) {
            question = this.questions[i];
            if (question.type === quest.LIKERT)
                question.likert.same_scale = false;
        }

        for (i=0; i<this.questions.length; i++) {
            question = this.questions[i];

            if (question.type === quest.LIKERT) {
                if (i+1 < this.questions.length) {
                    var question2 = this.questions[i+1];
                    if (question2.type === quest.LIKERT) {
                        if (question.likert.scale === question2.likert.scale) {
                            question2.likert.same_scale = true;
                        }
                    }
                }
            }
        }
    };

    /**
     *  Ensure the question has keys to represent the given type.
     */
    Model.prototype.question_must_have_type = function(question, type) {
        if (question[type])
            return;
        question[type] = this.empty_question_type(type);
    };

    /**
     *  Ensure the question has a field for the image specification.
     */
    Model.prototype.question_must_have_image = function(question) {
        question.has_image = true;
        if (!question.image)
            question.image = this.empty_image();
    };

    /**
     *  Load the image and set the default attributes.
     */
    Model.prototype.load_image = function(question, url) {
        var model = this;

        this.question_must_have_image(question);

        var image = question.image;

        if (image.is_loaded && image.url === url)
            return;

        var img = new Image();

        img.onload = function() {
            image.is_loaded = true;
            image.real_width = this.width;
            image.real_height = this.height;
            image.url = url;
            image.src = this.src;

            if (image.scale === null) { // First time
                image.width = image.real_width;
                image.height = image.real_height;
                image.scale = 100;
            } else
                model.image_scale_change(question); // After loading from resource
            quest.scope_apply();
        };
        img.src = url;
    };

    Model.prototype.image_clear = function(question) {
        var image = question.image;

        question.has_image = false;
        image.is_loaded = false;
        image.real_width = 0;
        image.real_height = 0;
        image.url = null;
        image.src = null;
        image.scale = 100;
        this.image_scale_change(question);
    };

    Model.prototype.image_scale_change = function(question) {
        var image = question.image;

        image.height = Math.floor((image.scale / 100) * image.real_height);
        image.width = Math.floor((image.scale / 100) * image.real_width);
    };

    Model.prototype.empty_image = function() {
        return {
            is_loaded: false, // True when image is loaded
            src: null, // URL (full form)
            url: null, // Given by user
            url_input: '', // Avoid updating image while typing URL
            real_width: null,
            real_height: null,
            width: null,
            height: null,
            scale: 100,
            layout: 'left'
        };
    };

    Model.prototype.empty_question = function() {
        return {
            text: '',
            font: 'plain',
            placeholder: 'Enter a question',
            type: quest.LIKERT,
            empty: true,
            likert: this.empty_question_type(quest.LIKERT),
            id: quest.uuid()
        };
    };

    Model.prototype.empty_answer = function() {
        var rval = {
            id: null,
            question: null,
            answered: false,
            type: null
        };

        return rval;
    };

    Model.prototype.empty_answer_try = function() {
        return {
            id: null,
            value: null
        };
    };

    Model.prototype.find_scale = function(id) {
        for (var i=0; i<this.scales.length; i++)
            if (this.scales[i].id === id)
                return this.scales[i];
        return null;
    };

    Model.prototype.smileys_scale = function() {
        var color;

        if (all_colors.length > 0) {
            color = all_colors[0];
            all_colors.splice(0, 1);
        } else
            color = '#000000';

        var head = '<img width="30px" height="30px" src="http://go-lab.gw.utwente.nl/production/quest/build/img/';
        var tail = '"/>';

        var scale = {
            width: 1, // col-sm-{{ width }}
            smileys: true,
            options: [ {
                text: head + 'smiley_angry.png' + tail,
                placeholder: '',
                answer_style: 'possible-answer',
                id: quest.uuid(),
                question_width: 2,
                width: 1
            }, {
                text: head + 'smiley_disappointed.png' + tail,
                placeholder: '',
                answer_style: 'possible-answer',
                id: quest.uuid(),
                question_width: 2,
                width: 1
            }, {
                text: head + 'smiley_neutral.png' + tail,
                placeholder: '',
                answer_style: 'possible-answer',
                id: quest.uuid(),
                question_width: 2,
                width: 1
            }, {
                text: head + 'smiley_satisfied.png' + tail,
                placeholder: '',
                answer_style: 'possible-answer',
                id: quest.uuid(),
                question_width: 2,
                width: 1
            }, {
                text: head + 'smiley_happy.png' + tail,
                placeholder: '',
                answer_style: 'possible-answer',
                id: quest.uuid(),
                question_width: 2,
                width: 1
            } ],
            color: color,
            id: quest.uuid()
        };

        this.scales.unshift(scale);

        return scale;
    };

    Model.prototype.empty_scale = function() {
        var color;

        if (all_colors.length > 0) {
            color = all_colors[0];
            all_colors.splice(0, 1);
        } else
            color = '#000000';

        var scale = {
            width: 1, // col-sm-{{ width }}
            options: [ {
                text: '',
                placeholder: 'Enter an option',
                answer_style: 'possible-answer',
                id: quest.uuid(),
                question_width: 2,
                width: 1
            } ],
            color: color,
            id: quest.uuid()
        };

        this.scales.push(scale);

        return scale;
    };

    Model.prototype.empty_question_type = function(type) {
        switch (type) {
        case quest.MULTIPLE_CHOICE:
            return {
                options: [ {
                    text: '',
                    placeholder: 'Enter an option',
                    answer_style: 'possible-answer',
                    id: quest.uuid()
                } ]
            };
        case quest.OPEN:
            return {
                rows: 1,
                placeholder: ''
            };
        case quest.LIKERT:
            return {
                scale: null
            };
        default:
            throw '[Quest] - Unknown question type ' + type;
        }
    };

    Model.prototype.empty_multiple_choice_option = function() {
        return {
            text: '',
            placeholder: 'Enter an option ',
            empty: true,
            id: quest.uuid()
        };
    };

    Model.prototype.empty_scale_option = function() {
        return {
            text: '',
            placeholder: 'Enter an option',
            empty: true,
            id: quest.uuid()
        };
    };

    function remove_hashKeys(obj) {
        for (var p in obj) {
            if (p === '$$hashKey') {
                delete obj[p];
                continue;
            }

            if (is.object(obj[p]))
                remove_hashKeys(obj[p]);
        }
        return obj;
    }

}).call(this);
