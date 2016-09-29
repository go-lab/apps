((ReflectionPoll) => {
    const { Map: IMap, List: IList } = Immutable;
    const util = ReflectionPoll.util;

    // defines the version of the poll data structure. Increment this
    // version when backwards incompatible changes are made to the poll data
    // structure
    const DATA_VERSION = 1;
    const ITEM_TYPESPECS = IMap({
        'single-choice': IMap({
            hasPredefinedAnswers: true,
            labelKey: 'single_choice_question',
            defaultAnswer: null,
        }),
        'multiple-choice': IMap({
            hasPredefinedAnswers: true,
            labelKey: 'multiple_choice_question',
            defaultAnswer: Immutable.Set(),
        }),
        'open': IMap({
            hasPredefinedAnswers: false,
            labelKey: 'open_question',
            defaultAnswer: '',
        }),
        'smiley': IMap({
            hasPredefinedAnswers: false,
            labelKey: 'smiley_question',
            defaultAnswer: null,
        }),
        'likert-scale': IMap({
            hasPredefinedAnswers: false,
            labelKey: 'likert_scale_question',
            defaultAnswer: null,
        }),
    });

    const SMILEY_VALUES = Immutable.List([
        'angry',
        'disappointed',
        'neutral',
        'satisfied',
        'happy'
    ]);

    const LIKERT_5_SCALE = Immutable.List([
        '1',
        '2',
        '3',
        '4',
        '5'
    ]);

    const assertTypeDefined = (itemType) => {
        let spec = ITEM_TYPESPECS.get(itemType);
        assert(spec, 'Undefined item type "' + itemType + '".');
    };

    const listSwap = (list, index1, index2) => {
        let item1 = list.get(index1);
        let item2 = list.get(index2);
        return list.set(index1, item2).set(index2, item1);
    };

    const answersString = (answers) => {
        return answers.reduce((string, answer) => {
            return string + answer.get('text');
        }, '');
    };

    const itemsString = (items) => {
        return items.reduce((string, item) => {
            return string +
                item.get('question') +
                item.get('type') +
                answersString(item.get('answers', Immutable.Set()));
        }, '');
    };

    const Poll = {
        defaultQuestion: 'New Question',
        defaultAnswerText: 'Answer',
        defaultPollHeading: 'New poll',
        newPoll() {
            return IMap({
                heading: Poll.defaultPollHeading,
                items: IList(),
                appVersion: DATA_VERSION,
            });
        },
        newItem(type, question, answers) {
            let item = Immutable.Map({
                id: util.uuid(),
                type: type,
                question: question || Poll.defaultQuestion,
            });
            if (Poll.itemHasUserSpecifiedAnswers(type)) {
                if (answers === undefined) {
                    answers = IList([
                        Poll.newAnswer(Poll.defaultAnswerText + ' 1'),
                        Poll.newAnswer(Poll.defaultAnswerText + ' 2'),
                    ]);
                } else {
                    answers = IList(answers);
                }
                item = item.set('answers', answers);
            }
            return item;
        },
        newAnswer(text) {
            if (text === undefined) {
                text = Poll.defaultAnswerText;
            }
            return IMap({ id: util.uuid(), text: text });
        },
        addItem(poll, type, question, answers) {
            return poll.update('items', function(items) {
                return items.push(Poll.newItem(type, question, answers));
            });
        },
        removeItem(poll, itemId) {
            return poll.update('items', function(items) {
                return items.filterNot(function(item) {
                    return item.get('id') === itemId;
                });
            });
        },
        moveItemUp(poll, itemId) {
            return poll.update('items', function(items) {
                const index = items.findIndex(function(item) {
                    return item.get('id') === itemId;
                });
                const alreadyOnTop = index === 0;
                if (alreadyOnTop) {
                    return items;
                }
                return listSwap(items, index, index - 1);
            });
        },
        moveItemDown(poll, itemId) {
            return poll.update('items', function(items) {
                const index = items.findIndex(function(item) {
                    return item.get('id') === itemId;
                });
                const lastIndex = items.count() - 1;
                const alreadyAtTheBottom = index === lastIndex;
                if (alreadyAtTheBottom) {
                    return items;
                }
                return listSwap(items, index, index + 1);
            });
        },
        setQuestion(poll, itemId, question) {
            return Poll.updateItem(poll, itemId, function(item) {
                return item.set('question', question);
            });
        },
        setAnswers(poll, itemId, answers) {
            return Poll.updateItem(poll, itemId, function(item) {
                return item.set('answers', answers);
            });
        },
        updateItem(poll, itemId, updater) {
            return poll.update('items', function(items) {
                const index = items.findIndex(function(item) {
                    return item.get('id') === itemId;
                });
                return items.update(index, updater);
            });
        },
        itemHasUserSpecifiedAnswers(itemType) {
            assertTypeDefined(itemType);
            return ITEM_TYPESPECS.getIn([itemType, 'hasPredefinedAnswers']);
        },
        getAnswers(poll, givenAnswers=IMap()) {
            return poll.get('items').reduce((answers, item) => {
                return answers.update(item.get('id'), (answer) => {
                    return answer || Poll.getItemDefaultAnswer(item.get('type'));
                });
            }, givenAnswers);
        },
        getItemDefaultAnswer(itemType) {
            assertTypeDefined(itemType);
            return Poll.getItemTypeSpec(itemType).get('defaultAnswer');
        },
        getItemTypeSpec(itemType) {
            assertTypeDefined(itemType);
            return ITEM_TYPESPECS.get(itemType);
        },
        getItemTypeSpecs() {
            return ITEM_TYPESPECS;
        },
        getItemTypeLabelKey(itemType) {
            return Poll.getItemTypeSpec(itemType).get('labelKey');
        },
        setContentHash(poll) {
            const contentString = poll.get('heading') +
                itemsString(poll.get('items'));
            return poll.set('contentHash', util.sha256(contentString));
        },
        addAnswerState(poll) {
            return poll.update('items', (item) => {
                if (!Poll.itemHasUserSpecifiedAnswers(item.get('type'))) {
                    return item.set('givenAnswer', '');
                }
                return item.update('answers', (answers) => {
                    return answers.map((answer) => answer.set('selected', false));
                });
            });
        },
        mergePolls(poll1, poll2) {
            return poll1
            .update('items', (items) => {
                return items.concat(poll2.get('items'));
            })
            .update('heading', (heading) => {
                if (heading === Poll.defaultPollHeading) {
                    return poll2.get('heading', Poll.defaultPollHeading);
                }
                return heading;
            });
        },
        answersFromJSToImmutable(poll, answers) {
            answers = Immutable.fromJS(answers);
            poll.get('items').forEach((item) => {
                answers = answers.update(item.get('id'), (answer) => {
                    return correctAnswerType(item, answer);
                });
            });
            return answers;
        },
        getSmileyValues() {
            return SMILEY_VALUES;
        },
        getLikertScale() {
            return LIKERT_5_SCALE;
        }
    };

    function correctAnswerType(item, answer) {
        const spec = Poll.getItemTypeSpec(item.get('type'));
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
