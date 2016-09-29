'use strict';

(function (ReflectionPoll) {
    var Poll = ReflectionPoll.Poll;
    var util = ReflectionPoll.util;
    var _Immutable = Immutable;
    var IList = _Immutable.List;
    var IMap = _Immutable.Map;

    ReflectionPoll.pollTemplates = function (getMsg) {
        var createPoll = function createPoll(heading, items) {
            var poll = Poll.newPoll().set('items', IList(items).map(function (item) {
                return Poll.newItem(item.type, getMsg(item.question), IList(item.answers).map(getMsg).map(Poll.newAnswer));
            })).set('heading', getMsg(heading)).set('id', util.uuid());
            return Poll.setContentHash(poll);
        };

        var likertAnswers = ['likert_value_1', 'likert_value_2', 'likert_value_3', 'likert_value_4', 'likert_value_5'];

        return IMap({
            'emotion': createPoll('poll_emotion_heading', [{
                type: 'multiple-choice',
                question: 'poll_emotion_mc_question_2',
                answers: ['poll_emotion_mc_2_answer_1', 'poll_emotion_mc_2_answer_2', 'poll_emotion_mc_2_answer_3', 'poll_emotion_mc_2_answer_4', 'poll_emotion_mc_2_answer_5']
            }, {
                type: 'open',
                question: 'poll_emotion_open_question_2'
            }, {
                type: 'single-choice',
                question: 'poll_emotion_closed_question_3',
                answers: likertAnswers
            }, {
                type: 'multiple-choice',
                question: 'poll_emotion_mc_question_1',
                answers: ['poll_emotion_mc_1_answer_1', 'poll_emotion_mc_1_answer_2', 'poll_emotion_mc_1_answer_3', 'poll_emotion_mc_1_answer_4', 'poll_emotion_mc_1_answer_5']
            }, {
                type: 'smiley',
                question: 'poll_emotion_smiley_question_1'
            }]),

            'ambiguity': createPoll('poll_ambiguity_heading', [{
                type: 'single-choice',
                question: 'poll_ambiguity_closed_question_3',
                answers: likertAnswers
            }, {
                type: 'multiple-choice',
                question: 'poll_ambiguity_mc_question_2',
                answers: ['poll_ambiguity_mc_2_answer_1', 'poll_ambiguity_mc_2_answer_2', 'poll_ambiguity_mc_2_answer_3', 'poll_ambiguity_mc_2_answer_4', 'poll_ambiguity_mc_2_answer_5']
            }, {
                type: 'smiley',
                question: 'poll_ambiguity_smiley_question_1'
            }, {
                type: 'multiple-choice',
                question: 'poll_ambiguity_mc_question_1',
                answers: ['poll_ambiguity_mc_1_answer_1', 'poll_ambiguity_mc_1_answer_2', 'poll_ambiguity_mc_1_answer_3', 'poll_ambiguity_mc_1_answer_4', 'poll_ambiguity_mc_1_answer_5']
            }, {
                type: 'open',
                question: 'poll_ambiguity_open_question_4'
            }]),

            'groupwork': createPoll('poll_groupwork_heading', [{
                type: 'open',
                question: 'poll_groupwork_open_question_1'
            }, {
                type: 'multiple-choice',
                question: 'poll_groupwork_mc_question_2',
                answers: ['poll_groupwork_mc_2_answer_1', 'poll_groupwork_mc_2_answer_2', 'poll_groupwork_mc_2_answer_3', 'poll_groupwork_mc_2_answer_4', 'poll_groupwork_mc_2_answer_5']
            }, {
                type: 'single-choice',
                question: 'poll_groupwork_closed_question_3',
                answers: likertAnswers
            }, {
                type: 'open',
                question: 'poll_groupwork_open_question_3'
            }, {
                type: 'multiple-choice',
                question: 'poll_groupwork_mc_question_1',
                answers: ['poll_groupwork_mc_1_answer_1', 'poll_groupwork_mc_1_answer_2', 'poll_groupwork_mc_1_answer_3', 'poll_groupwork_mc_1_answer_4', 'poll_groupwork_mc_1_answer_5']
            }, {
                type: 'single-choice',
                question: 'poll_groupwork_closed_question_1',
                answers: likertAnswers
            }, {
                type: 'open',
                question: 'poll_groupwork_open_question_2'
            }, {
                type: 'smiley',
                question: 'poll_groupwork_smiley_question_1'
            }, {
                type: 'single-choice',
                question: 'poll_groupwork_closed_question_2',
                answers: likertAnswers
            }, {
                type: 'open',
                question: 'poll_groupwork_open_question_4'
            }]),

            'individual_performance': createPoll('poll_individual_performance_heading', [{
                type: 'single-choice',
                question: 'poll_individual_performance_closed_question_4',
                answers: likertAnswers
            }, {
                type: 'multiple-choice',
                question: 'poll_individual_performance_mc_question_2',
                answers: ['poll_individual_performance_mc_2_answer_1', 'poll_individual_performance_mc_2_answer_2', 'poll_individual_performance_mc_2_answer_3', 'poll_individual_performance_mc_2_answer_4', 'poll_individual_performance_mc_2_answer_5']
            }, {
                type: 'multiple-choice',
                question: 'poll_individual_performance_mc_question_1',
                answers: ['poll_individual_performance_mc_1_answer_1', 'poll_individual_performance_mc_1_answer_2', 'poll_individual_performance_mc_1_answer_3', 'poll_individual_performance_mc_1_answer_4', 'poll_individual_performance_mc_1_answer_5']
            }, {
                type: 'single-choice',
                question: 'poll_individual_performance_closed_question_3',
                answers: likertAnswers
            }, {
                type: 'smiley',
                question: 'poll_individual_performance_smiley_question_1'
            }]),

            'motivation': createPoll('poll_motivation_heading', [{
                type: 'smiley',
                question: 'poll_motivation_smiley_question_1'
            }, {
                type: 'single-choice',
                question: 'poll_motivation_closed_question_1',
                answers: likertAnswers
            }, {
                type: 'open',
                question: 'poll_motivation_open_question_1'
            }, {
                type: 'multiple-choice',
                question: 'poll_motivation_mc_question_2',
                answers: ['poll_motivation_mc_2_answer_1', 'poll_motivation_mc_2_answer_2', 'poll_motivation_mc_2_answer_3', 'poll_motivation_mc_2_answer_4', 'poll_motivation_mc_2_answer_5']
            }, {
                type: 'open',
                question: 'poll_motivation_open_question_2'
            }]),

            'satisfaction': createPoll('poll_satisfaction_heading', [{
                type: 'multiple-choice',
                question: 'poll_satisfaction_mc_question_1',
                answers: ['poll_satisfaction_mc_1_answer_1', 'poll_satisfaction_mc_1_answer_2', 'poll_satisfaction_mc_1_answer_3', 'poll_satisfaction_mc_1_answer_4', 'poll_satisfaction_mc_1_answer_5']
            }, {
                type: 'smiley',
                question: 'poll_satisfaction_smiley_question_1'
            }, {
                type: 'multiple-choice',
                question: 'poll_satisfaction_mc_question_2',
                answers: ['poll_satisfaction_mc_2_answer_1', 'poll_satisfaction_mc_2_answer_2', 'poll_satisfaction_mc_2_answer_3', 'poll_satisfaction_mc_2_answer_4', 'poll_satisfaction_mc_2_answer_5']
            }, {
                type: 'single-choice',
                question: 'poll_satisfaction_closed_question_1',
                answers: likertAnswers
            }, {
                type: 'open',
                question: 'poll_satisfaction_open_question_1'
            }])
        });
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=poll_templates.js.map
