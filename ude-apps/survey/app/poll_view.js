(function (ReflectionPoll) {
    const { util, Poll, PubSub } = ReflectionPoll;
    const answersChangeEvents = PubSub();

    const SingleChoiceAnswers = React.createClass({
        displayName: 'SingleChoiceAnswers',
        render() {
            return <div>{this.renderAnswers()}</div>;
        },
        renderAnswers() {
            return this.props.item.get('answers').map((answer) => {
                return (
                    <div className='radio' key={answer.get('id')}>
                        <label>
                            <input
                                type='radio'
                                name={this.props.item.get('id')}
                                value={answer.get('id')}
                                checked={answer.get('id') === this.props.givenAnswer}
                                onChange={this.onChange}
                            />
                            {answer.get('text')}
                        </label>
                    </div>
                );
            });
        },
        onChange(event) {
            if (!event.target.checked) return;
            this.props.action(
                'onSingleChoiceAnswerSelect',
                this.props.item.get('id'),
                event.target.value
            );
        }
    });

    const MultipleChoiceAnswers = React.createClass({
        displayName: 'MultipleChoiceAnswers',
        render() {
            return <div>{this.renderAnswers()}</div>;
        },
        renderAnswers() {
            return this.props.item.get('answers').map((answer) => {
                return (
                    <div className='checkbox' key={answer.get('id')}>
                        <label>
                            <input
                                type='checkbox'
                                name={this.props.item.get('id')}
                                onChange={this.onChange}
                                value={answer.get('id')}
                                checked={this.isChecked(answer)}
                            />
                            {answer.get('text')}
                        </label>
                    </div>
                );
            });
        },
        onChange(event) {
            let actionName = 'onAddMultipleChoiceAnswer';
            if (!event.target.checked) {
                actionName = 'onRemoveMultipleChoiceAnswer';
            }
            this.props.action(
                actionName,
                this.props.item.get('id'),
                event.target.value
            );
        },
        isChecked(answer) {
            return this.props.givenAnswer.has(answer.get('id'));
        },
    });

    const SmileyAnswers = React.createClass({
        displayName: 'SmileyAnswers',
        render() {
            return <div>{this.renderAnswers()}</div>;
        },
        renderAnswers() {
            return Poll.getSmileyValues().map((smiley) => {
                let smileySrc =
                    `${this.props.imgPath}/smiley_${smiley}.png`;
                return (
                    <div className='radio' key={smiley}>
                        <label>
                            <input
                                type='radio'
                                name={this.props.item.get('id')}
                                onChange={this.onChange}
                                value={smiley}
                                checked={this.isChecked(smiley)}
                            />
                            <img src={smileySrc}/>
                        </label>
                    </div>
                );
            });
        },
        onChange(event) {
            if (!event.target.checked) return;
            this.props.action(
                'onSmileyAnswerSelect',
                this.props.item.get('id'),
                event.target.value
            );
        },
        isChecked(smiley) {
            return this.props.givenAnswer === smiley;
        }
    });

    const LikertScaleAnswers = React.createClass({
        displayName: 'LikertScaleAnswers',
        render() {
            return <div>{this.renderAnswers()}</div>;
        },
        renderAnswers() {
            return Poll.getLikertScale().map((smiley) => {
                return (
                    <div className='radio' key={smiley}>
                        <label>
                            <input
                                type='radio'
                                name={this.props.item.get('id')}
                                onChange={this.onChange}
                                value={smiley}
                                checked={this.isChecked(smiley)}
                            />
                            <span>{smiley}</span>
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
        isChecked(smiley) {
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

    const OpenAnswer = React.createClass({
        displayName: 'OpenAnswer',
        render() {
            const itemId = this.props.item.get('id');
            return (
                <textarea
                    className='form-control'
                    id={itemId}
                    onChange={this.onChange}
                    value={this.props.givenAnswer}
                />
            );
        },
        onChange(event) {
            this.props.action(
                'onOpenAnswerChange',
                this.props.item.get('id'),
                event.target.value
            );
        }
    });

    const answerComponentsForType = Immutable.Map({
        'single-choice': SingleChoiceAnswers,
        'multiple-choice': MultipleChoiceAnswers,
        'open': OpenAnswer,
        'smiley': SmileyAnswers,
        'likert-scale': LikertScaleAnswers,
    });

    const Item = React.createClass({
        displayName: 'Item',
        render() {
            return (
                <div className={`form-group ${this.props.item.get('type')}`}>
                    {this.renderQuestion()}
                    {this.renderAnswer()}
                </div>
            );
        },
        renderQuestion() {
            return (
                <label htmlFor={this.props.item.get('id')}>
                    {this.props.item.get('question')}
                </label>
            );
        },
        renderAnswer() {
            const { item } = this.props;
            const Component = answerComponentsForType.get(this.props.item.get('type'));
            return (
                <Component
                    item={item}
                    action={this.props.action}
                    givenAnswer={this.props.givenAnswers.get(item.get('id'))}
                    imgPath={this.props.imgPath}
                />
            );
        },
    });

    const PollView = React.createClass({
        displayName: 'PollView',
        render() {
            return (
                <div id='poll'>
                    {this.renderHeading()}
                    {this.renderItems()}
                </div>
            );
        },
        renderHeading() {
            return <div><h2>{ this.props.state.getIn(['poll', 'heading']) }</h2></div>;
        },
        renderItems() {
            let items = this.props.state.getIn(['poll', 'items']);
            if (items.count() === 0) {
                return <div><p>{this.props.getMsg('no_items_yet')}</p></div>;
            }
            return items.map((item) => {
                return (
                    <Item
                        key={item.get('id')}
                        item={item}
                        givenAnswers={this.props.state.get('givenAnswers')}
                        getMsg={this.props.getMsg}
                        imgPath={this.props.imgPath}
                        action={this.props.action}
                    />
                );
            });
        }
    });

    const setAnswer = (state, itemId, value) => {
        return state.update('givenAnswers', (answers) => {
            return answers.set(itemId, value);
        });
    };

    ReflectionPoll.PollView = function (container, getMsg, imgPath) {
        const actions = Immutable.Map({
            onSmileyAnswerSelect: setAnswer,
            onLikertScaleAnswerSelect: setAnswer,
            onSingleChoiceAnswerSelect: setAnswer,
            onOpenAnswerChange: setAnswer,
            onAddMultipleChoiceAnswer(state, itemId, answerId) {
                return state.update('givenAnswers', Immutable.Set(), (answers) => {
                    return answers.update(itemId, Immutable.Set(), (mcAnswers) => {
                        return mcAnswers.add(answerId);
                    });
                });
            },
            onRemoveMultipleChoiceAnswer(state, itemId, answerId) {
                return state.update('givenAnswers', Immutable.Set(), (answers) => {
                    return answers.update(itemId, Immutable.Set(), (mcAnswers) => {
                        return mcAnswers.remove(answerId);
                    });
                });
            },
        });

        const render = (state) => {
            console.log('rendering poll with state %O', state.toJS());
            answersChangeEvents.publish(state.get('givenAnswers'));
            React.render(
                React.createElement(PollView, {
                    state,
                    getMsg,
                    imgPath: imgPath,
                    action: util.actionHandler.bind(null, state, actions, render)
                }),
                container
            );
        };

        return {
            render: function (poll, answers) {
                answers =
                    ReflectionPoll.Poll.getAnswers(poll, answers);

                const state = Immutable.Map({
                    givenAnswers: answers,
                    poll,
                });
                render(state);
            },
            show: function () {
                container.style.display = 'block';
            },
            hide: function () {
                container.style.display = 'none';
            },
            onAnswersChange: answersChangeEvents.subscribe,
        };
    };
})(golab.tools.ReflectionPoll);
