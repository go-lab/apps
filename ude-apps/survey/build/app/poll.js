'use strict';

(function (ReflectionPoll) {
    var _Immutable = Immutable;
    var IMap = _Immutable.Map;
    var IList = _Immutable.List;

    var util = ReflectionPoll.util;

    // defines the version of the poll data structure. Increment this
    // version when backwards incompatible changes are made to the poll data
    // structure
    var DATA_VERSION = 1;
    var ITEM_TYPESPECS = IMap({
        'single-choice': IMap({
            hasPredefinedAnswers: true,
            labelKey: 'single_choice_question',
            defaultAnswer: null
        }),
        'multiple-choice': IMap({
            hasPredefinedAnswers: true,
            labelKey: 'multiple_choice_question',
            defaultAnswer: Immutable.Set()
        }),
        'open': IMap({
            hasPredefinedAnswers: false,
            labelKey: 'open_question',
            defaultAnswer: ''
        }),
        'smiley': IMap({
            hasPredefinedAnswers: false,
            labelKey: 'smiley_question',
            defaultAnswer: null
        }),
        'likert-scale': IMap({
            hasPredefinedAnswers: false,
            labelKey: 'likert_scale_question',
            defaultAnswer: null
        })
    });

    var SMILEY_VALUES = Immutable.List(['angry', 'disappointed', 'neutral', 'satisfied', 'happy']);

    var LIKERT_5_SCALE = Immutable.List(['1', '2', '3', '4', '5']);

    var assertTypeDefined = function assertTypeDefined(itemType) {
        var spec = ITEM_TYPESPECS.get(itemType);
        assert(spec, 'Undefined item type "' + itemType + '".');
    };

    var listSwap = function listSwap(list, index1, index2) {
        var item1 = list.get(index1);
        var item2 = list.get(index2);
        return list.set(index1, item2).set(index2, item1);
    };

    var answersString = function answersString(answers) {
        return answers.reduce(function (string, answer) {
            return string + answer.get('text');
        }, '');
    };

    var itemsString = function itemsString(items) {
        return items.reduce(function (string, item) {
            return string + item.get('question') + item.get('type') + answersString(item.get('answers', Immutable.Set()));
        }, '');
    };

    var Poll = {
        defaultQuestion: 'New Question',
        defaultAnswerText: 'Answer',
        defaultPollHeading: 'New poll',
        newPoll: function newPoll() {
            return IMap({
                heading: Poll.defaultPollHeading,
                items: IList(),
                appVersion: DATA_VERSION
            });
        },
        newItem: function newItem(type, question, answers) {
            var item = Immutable.Map({
                id: util.uuid(),
                type: type,
                question: question || Poll.defaultQuestion
            });
            if (Poll.itemHasUserSpecifiedAnswers(type)) {
                if (answers === undefined) {
                    answers = IList([Poll.newAnswer(Poll.defaultAnswerText + ' 1'), Poll.newAnswer(Poll.defaultAnswerText + ' 2')]);
                } else {
                    answers = IList(answers);
                }
                item = item.set('answers', answers);
            }
            return item;
        },
        newAnswer: function newAnswer(text) {
            if (text === undefined) {
                text = Poll.defaultAnswerText;
            }
            return IMap({ id: util.uuid(), text: text });
        },
        addItem: function addItem(poll, type, question, answers) {
            return poll.update('items', function (items) {
                return items.push(Poll.newItem(type, question, answers));
            });
        },
        removeItem: function removeItem(poll, itemId) {
            return poll.update('items', function (items) {
                return items.filterNot(function (item) {
                    return item.get('id') === itemId;
                });
            });
        },
        moveItemUp: function moveItemUp(poll, itemId) {
            return poll.update('items', function (items) {
                var index = items.findIndex(function (item) {
                    return item.get('id') === itemId;
                });
                var alreadyOnTop = index === 0;
                if (alreadyOnTop) {
                    return items;
                }
                return listSwap(items, index, index - 1);
            });
        },
        moveItemDown: function moveItemDown(poll, itemId) {
            return poll.update('items', function (items) {
                var index = items.findIndex(function (item) {
                    return item.get('id') === itemId;
                });
                var lastIndex = items.count() - 1;
                var alreadyAtTheBottom = index === lastIndex;
                if (alreadyAtTheBottom) {
                    return items;
                }
                return listSwap(items, index, index + 1);
            });
        },
        setQuestion: function setQuestion(poll, itemId, question) {
            return Poll.updateItem(poll, itemId, function (item) {
                return item.set('question', question);
            });
        },
        setAnswers: function setAnswers(poll, itemId, answers) {
            return Poll.updateItem(poll, itemId, function (item) {
                return item.set('answers', answers);
            });
        },
        updateItem: function updateItem(poll, itemId, updater) {
            return poll.update('items', function (items) {
                var index = items.findIndex(function (item) {
                    return item.get('id') === itemId;
                });
                return items.update(index, updater);
            });
        },
        itemHasUserSpecifiedAnswers: function itemHasUserSpecifiedAnswers(itemType) {
            assertTypeDefined(itemType);
            return ITEM_TYPESPECS.getIn([itemType, 'hasPredefinedAnswers']);
        },
        getAnswers: function getAnswers(poll) {
            var givenAnswers = arguments.length <= 1 || arguments[1] === undefined ? IMap() : arguments[1];

            return poll.get('items').reduce(function (answers, item) {
                return answers.update(item.get('id'), function (answer) {
                    return answer || Poll.getItemDefaultAnswer(item.get('type'));
                });
            }, givenAnswers);
        },
        getItemDefaultAnswer: function getItemDefaultAnswer(itemType) {
            assertTypeDefined(itemType);
            return Poll.getItemTypeSpec(itemType).get('defaultAnswer');
        },
        getItemTypeSpec: function getItemTypeSpec(itemType) {
            assertTypeDefined(itemType);
            return ITEM_TYPESPECS.get(itemType);
        },
        getItemTypeSpecs: function getItemTypeSpecs() {
            return ITEM_TYPESPECS;
        },
        getItemTypeLabelKey: function getItemTypeLabelKey(itemType) {
            return Poll.getItemTypeSpec(itemType).get('labelKey');
        },
        setContentHash: function setContentHash(poll) {
            var contentString = poll.get('heading') + itemsString(poll.get('items'));
            return poll.set('contentHash', util.sha256(contentString));
        },
        addAnswerState: function addAnswerState(poll) {
            return poll.update('items', function (item) {
                if (!Poll.itemHasUserSpecifiedAnswers(item.get('type'))) {
                    return item.set('givenAnswer', '');
                }
                return item.update('answers', function (answers) {
                    return answers.map(function (answer) {
                        return answer.set('selected', false);
                    });
                });
            });
        },
        mergePolls: function mergePolls(poll1, poll2) {
            return poll1.update('items', function (items) {
                return items.concat(poll2.get('items'));
            }).update('heading', function (heading) {
                if (heading === Poll.defaultPollHeading) {
                    return poll2.get('heading', Poll.defaultPollHeading);
                }
                return heading;
            });
        },
        answersFromJSToImmutable: function answersFromJSToImmutable(poll, answers) {
            answers = Immutable.fromJS(answers);
            poll.get('items').forEach(function (item) {
                answers = answers.update(item.get('id'), function (answer) {
                    return correctAnswerType(item, answer);
                });
            });
            return answers;
        },
        getSmileyValues: function getSmileyValues() {
            return SMILEY_VALUES;
        },
        getLikertScale: function getLikertScale() {
            return LIKERT_5_SCALE;
        }
    };

    function correctAnswerType(item, answer) {
        var spec = Poll.getItemTypeSpec(item.get('type'));
        if (Immutable.Set.isSet(spec.get('defaultAnswer'))) {
            if (answer === undefined) {
                return Immutable.Set();
            }
            return answer.toSet();
        }
        return answer;
    }

    ReflectionPoll.Poll = Poll;
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=poll.js.map
