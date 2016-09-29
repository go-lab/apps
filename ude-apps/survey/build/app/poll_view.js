'use strict';

(function (ReflectionPoll) {
    var util = ReflectionPoll.util;
    var Poll = ReflectionPoll.Poll;
    var PubSub = ReflectionPoll.PubSub;

    var answersChangeEvents = PubSub();

    var SingleChoiceAnswers = React.createClass({
        displayName: 'SingleChoiceAnswers',
        render: function render() {
            return React.createElement(
                'div',
                null,
                this.renderAnswers()
            );
        },
        renderAnswers: function renderAnswers() {
            var _this = this;

            return this.props.item.get('answers').map(function (answer) {
                return React.createElement(
                    'div',
                    { className: 'radio', key: answer.get('id') },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', {
                            type: 'radio',
                            name: _this.props.item.get('id'),
                            value: answer.get('id'),
                            checked: answer.get('id') === _this.props.givenAnswer,
                            onChange: _this.onChange
                        }),
                        answer.get('text')
                    )
                );
            });
        },
        onChange: function onChange(event) {
            if (!event.target.checked) return;
            this.props.action('onSingleChoiceAnswerSelect', this.props.item.get('id'), event.target.value);
        }
    });

    var MultipleChoiceAnswers = React.createClass({
        displayName: 'MultipleChoiceAnswers',
        render: function render() {
            return React.createElement(
                'div',
                null,
                this.renderAnswers()
            );
        },
        renderAnswers: function renderAnswers() {
            var _this2 = this;

            return this.props.item.get('answers').map(function (answer) {
                return React.createElement(
                    'div',
                    { className: 'checkbox', key: answer.get('id') },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', {
                            type: 'checkbox',
                            name: _this2.props.item.get('id'),
                            onChange: _this2.onChange,
                            value: answer.get('id'),
                            checked: _this2.isChecked(answer)
                        }),
                        answer.get('text')
                    )
                );
            });
        },
        onChange: function onChange(event) {
            var actionName = 'onAddMultipleChoiceAnswer';
            if (!event.target.checked) {
                actionName = 'onRemoveMultipleChoiceAnswer';
            }
            this.props.action(actionName, this.props.item.get('id'), event.target.value);
        },
        isChecked: function isChecked(answer) {
            return this.props.givenAnswer.has(answer.get('id'));
        }
    });

    var SmileyAnswers = React.createClass({
        displayName: 'SmileyAnswers',
        render: function render() {
            return React.createElement(
                'div',
                null,
                this.renderAnswers()
            );
        },
        renderAnswers: function renderAnswers() {
            var _this3 = this;

            return Poll.getSmileyValues().map(function (smiley) {
                var smileySrc = _this3.props.imgPath + '/smiley_' + smiley + '.png';
                return React.createElement(
                    'div',
                    { className: 'radio', key: smiley },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', {
                            type: 'radio',
                            name: _this3.props.item.get('id'),
                            onChange: _this3.onChange,
                            value: smiley,
                            checked: _this3.isChecked(smiley)
                        }),
                        React.createElement('img', { src: smileySrc })
                    )
                );
            });
        },
        onChange: function onChange(event) {
            if (!event.target.checked) return;
            this.props.action('onSmileyAnswerSelect', this.props.item.get('id'), event.target.value);
        },
        isChecked: function isChecked(smiley) {
            return this.props.givenAnswer === smiley;
        }
    });

    var LikertScaleAnswers = React.createClass({
        displayName: 'LikertScaleAnswers',
        render: function render() {
            return React.createElement(
                'div',
                null,
                this.renderAnswers()
            );
        },
        renderAnswers: function renderAnswers() {
            var _this4 = this;

            return Poll.getLikertScale().map(function (smiley) {
                return React.createElement(
                    'div',
                    { className: 'radio', key: smiley },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', {
                            type: 'radio',
                            name: _this4.props.item.get('id'),
                            onChange: _this4.onChange,
                            value: smiley,
                            checked: _this4.isChecked(smiley)
                        }),
                        React.createElement(
                            'span',
                            null,
                            smiley
                        )
                    )
                );
            });
        },
        onChange: function onChange(event) {
            if (!event.target.checked) return;
            this.props.action('onLikertScaleAnswerSelect', this.props.item.get('id'), event.target.value);
        },
        isChecked: function isChecked(smiley) {
            return this.props.givenAnswer === smiley;
        }
    });

    /*const LikertScaleAnswers = React.createClass({
        displayName: 'LikertScaleAnswers',
        render() {
            return <div>{this.renderAnswers()}</div>;
        },
        renderAnswers() {
            return Poll.getLikertScale().map((scaleItem) => {
                console.log("SCALEITEM: "+scaleItem);
                return (
                    <div className='radio' key={scaleItem.get('id')}>
                        <label>
                            <input
                                type='radio'
                                name={this.props.item.get('id')}
                                onChange={this.onChange}
                                value={scaleItem}
                                checked={scaleItem.get('id') === this.props.givenAnswer}
                            />
                            <span>{scaleItem.get('text')}</span>
                        </label>
                    </div>
                );
            });
        },
        onChange(event) {
            if (!event.target.checked) return;
            this.props.action(
                'onLikertScaleAnswerSelect',
                this.props.item.get('id'),
                event.target.value
            );
        },
        isChecked(item) {
            return this.props.givenAnswer === item;
        }
    });*/

    var OpenAnswer = React.createClass({
        displayName: 'OpenAnswer',
        render: function render() {
            var itemId = this.props.item.get('id');
            return React.createElement('textarea', {
                className: 'form-control',
                id: itemId,
                onChange: this.onChange,
                value: this.props.givenAnswer
            });
        },
        onChange: function onChange(event) {
            this.props.action('onOpenAnswerChange', this.props.item.get('id'), event.target.value);
        }
    });

    var answerComponentsForType = Immutable.Map({
        'single-choice': SingleChoiceAnswers,
        'multiple-choice': MultipleChoiceAnswers,
        'open': OpenAnswer,
        'smiley': SmileyAnswers,
        'likert-scale': LikertScaleAnswers
    });

    var Item = React.createClass({
        displayName: 'Item',
        render: function render() {
            return React.createElement(
                'div',
                { className: 'form-group ' + this.props.item.get('type') },
                this.renderQuestion(),
                this.renderAnswer()
            );
        },
        renderQuestion: function renderQuestion() {
            return React.createElement(
                'label',
                { htmlFor: this.props.item.get('id') },
                this.props.item.get('question')
            );
        },
        renderAnswer: function renderAnswer() {
            var item = this.props.item;

            var Component = answerComponentsForType.get(this.props.item.get('type'));
            return React.createElement(Component, {
                item: item,
                action: this.props.action,
                givenAnswer: this.props.givenAnswers.get(item.get('id')),
                imgPath: this.props.imgPath
            });
        }
    });

    var PollView = React.createClass({
        displayName: 'PollView',
        render: function render() {
            return React.createElement(
                'div',
                { id: 'poll' },
                this.renderHeading(),
                this.renderItems()
            );
        },
        renderHeading: function renderHeading() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h2',
                    null,
                    this.props.state.getIn(['poll', 'heading'])
                )
            );
        },
        renderItems: function renderItems() {
            var _this5 = this;

            var items = this.props.state.getIn(['poll', 'items']);
            if (items.count() === 0) {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'p',
                        null,
                        this.props.getMsg('no_items_yet')
                    )
                );
            }
            return items.map(function (item) {
                return React.createElement(Item, {
                    key: item.get('id'),
                    item: item,
                    givenAnswers: _this5.props.state.get('givenAnswers'),
                    getMsg: _this5.props.getMsg,
                    imgPath: _this5.props.imgPath,
                    action: _this5.props.action
                });
            });
        }
    });

    var setAnswer = function setAnswer(state, itemId, value) {
        return state.update('givenAnswers', function (answers) {
            return answers.set(itemId, value);
        });
    };

    ReflectionPoll.PollView = function (container, getMsg, imgPath) {
        var actions = Immutable.Map({
            onSmileyAnswerSelect: setAnswer,
            onLikertScaleAnswerSelect: setAnswer,
            onSingleChoiceAnswerSelect: setAnswer,
            onOpenAnswerChange: setAnswer,
            onAddMultipleChoiceAnswer: function onAddMultipleChoiceAnswer(state, itemId, answerId) {
                return state.update('givenAnswers', Immutable.Set(), function (answers) {
                    return answers.update(itemId, Immutable.Set(), function (mcAnswers) {
                        return mcAnswers.add(answerId);
                    });
                });
            },
            onRemoveMultipleChoiceAnswer: function onRemoveMultipleChoiceAnswer(state, itemId, answerId) {
                return state.update('givenAnswers', Immutable.Set(), function (answers) {
                    return answers.update(itemId, Immutable.Set(), function (mcAnswers) {
                        return mcAnswers.remove(answerId);
                    });
                });
            }
        });

        var _render = function _render(state) {
            console.log('rendering poll with state %O', state.toJS());
            answersChangeEvents.publish(state.get('givenAnswers'));
            React.render(React.createElement(PollView, {
                state: state,
                getMsg: getMsg,
                imgPath: imgPath,
                action: util.actionHandler.bind(null, state, actions, _render)
            }), container);
        };

        return {
            render: function render(poll, answers) {
                answers = ReflectionPoll.Poll.getAnswers(poll, answers);

                var state = Immutable.Map({
                    givenAnswers: answers,
                    poll: poll
                });
                _render(state);
            },
            show: function show() {
                container.style.display = 'block';
            },
            hide: function hide() {
                container.style.display = 'none';
            },
            onAnswersChange: answersChangeEvents.subscribe
        };
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=poll_view.js.map
