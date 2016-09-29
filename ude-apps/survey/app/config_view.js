/* eslint no-alert: 0 */
((ReflectionPoll) => {
    const { util, Poll, pollTemplates } = ReflectionPoll;
    const createElement = React.createElement;
    const DOM = React.DOM;
    const Input = ReflectionPoll.Input;

    ReflectionPoll.ConfigView =
    function ConfigView(container, getMsg) {
        container = $(container);
        const templates = pollTemplates(getMsg);

        const Heading = React.createClass({
            displayName: 'Heading',
            render: function() {
                return DOM.div(
                    { className: 'item' },
                    DOM.h2({}, getMsg('configure_poll'))
                );
            },
        });

        const HeadingInput = React.createClass({
            displayName: 'HeadingInput',
            render: function() {
                return DOM.div(
                    { className: 'item' },
                    createElement(Input, {
                        id: 'heading',
                        value: this.props.value,
                        label: getMsg('heading'),
                        onChange: this.onHeadingChange,
                    })
                );
            },
            onHeadingChange: function(event) {
                this.props.action('set_heading', event.target.value);
            },
        });

        const IconButton = React.createClass({
            displayName: 'IconButton',
            getDefaultProps: function() {
                return {
                    label: '',
                    showLabel: true,
                    glyphicon: '',
                    size: 'md',
                    type: 'default',
                    className: '',
                    onClick: function() {},
                };
            },
            render: function() {
                let title = '';
                let label = ` ${this.props.label}`;
                if (!this.props.showLabel) {
                    title = this.props.label;
                    label = '';
                }
                const className = util.classNames(
                    'btn',
                    `btn-${this.props.type}`,
                    `btn-${this.props.size}`,
                    this.props.className
                );
                return DOM.button(
                    {
                        type: 'button',
                        title: title,
                        className: className,
                        onClick: this.props.onClick,
                    },
                    DOM.i({
                        className: `glyphicon glyphicon-${this.props.glyphicon}`,
                    }),
                    label
                );
            }
        });


        const ItemMenu = React.createClass({
            displayName: 'ItemMenu',
            buttonSpecs: [{
                title: getMsg('move_question_up'),
                glyphicon: 'chevron-up',
                action: 'move_item_up',
            }, {
                title: getMsg('move_question_down'),
                glyphicon: 'chevron-down',
                action: 'move_item_down',
            }, {
                title: getMsg('remove_question'),
                glyphicon: 'remove',
                action: 'remove_item',
            }],
            render: function() {
                const buttons = this.buttonSpecs.map(this.renderButton);
                return DOM.div({ className: 'question_menu' }, buttons);
            },
            renderButton: function(spec) {
                return createElement(IconButton, {
                    key: spec.title,
                    label: spec.title,
                    showLabel: false,
                    glyphicon: spec.glyphicon,
                    size: 'sm',
                    className: spec.action,
                    onClick: this.onButtonClick.bind(this, spec),
                });
            },
            onButtonClick: function(buttonSpec, event) {
                event.preventDefault();
                this.props.action(buttonSpec.action);
            }
        });

        const AnswerInput = React.createClass({
            displayName: 'AnswerInput',
            getInitialState: function() {
                return { rawAnswers: null };
            },
            componentWillReceiveProps: function(nextProps) {
                if (!nextProps.answers.equals(this.props.answers)) {
                    this.setRawAnswers(nextProps.answers);
                }
            },
            componentWillMount: function() {
                this.setRawAnswers(this.props.answers);
            },
            render: function() {
                return createElement(Input, {
                    id: this.props.id,
                    label: getMsg('answers'),
                    value: this.state.rawAnswers,
                    type: 'textarea',
                    onBlur: this.onAnswerBlur,
                    onChange: this.onAnswerChange,
                });
            },
            setRawAnswers: function(rawAnswers) {
                this.setState({
                    rawAnswers: answersToString(rawAnswers)
                });
            },
            onAnswerChange: function(event) {
                this.setState({ rawAnswers: event.target.value });
            },
            onAnswerBlur: function(event) {
                this.props.onChange(rawAnswersToList(event.target.value));
            },
        });

        const Item = React.createClass({
            displayName: 'Item',
            render: function() {
                const className = util.classNames({
                    item: true,
                    first: this.props.isFirst,
                    last: this.props.isLast
                });
                return DOM.div(
                    { className },
                    createElement(ItemMenu, { action: this.menuAction }),
                    this.renderQuestionInput(),
                    this.renderAnswerInput()
                );
            },
            renderQuestionInput: function() {
                const labelKey = Poll.getItemTypeLabelKey(this.props.item.get('type'));
                return createElement(Input, {
                    id: `question_${this.props.item.get('id')}`,
                    label: getMsg(labelKey),
                    value: this.props.item.get('question'),
                    onChange: this.onQuestionChange,
                });
            },
            renderAnswerInput: function() {
                if (!Poll.itemHasUserSpecifiedAnswers(this.props.item.get('type'))) {
                    return undefined;
                }
                return createElement(AnswerInput, {
                    id: `answer_${this.props.item.get('id')}`,
                    onChange: this.onAnswerChange,
                    answers: this.props.item.get('answers'),
                });
            },
            menuAction: function(actionName) {
                this.props.action(actionName, this.props.item.get('id'));
            },
            onQuestionChange: function(event) {
                this.props.action(
                    'set_question',
                    this.props.item.get('id'),
                    event.target.value
                );
            },
            onAnswerChange: function(newAnswers) {
                this.props.action(
                    'set_answers',
                    this.props.item.get('id'),
                    newAnswers
                );
            },
        });

        const Dropdown = React.createClass({
            displayName: 'Dropdown',
            getDefaultProps() {
                return {
                    id: util.uuid(),
                    btnType: 'default',
                    onSelectItemType: () => {},
                };
            },
            render: function() {
                return DOM.div(
                    { className: 'dropup' },
                    this.renderButton(),
                    this.renderDropdown()
                );
            },
            renderButton: function() {
                return DOM.button(
                    {
                        className: util.classNames(
                            'btn', `btn-${this.props.btnType}`, 'dropdown-toggle'
                        ),
                        type: 'button',
                        'aria-hasexpanded': 'false',
                        'aria-haspopup': 'true',
                        'data-toggle': 'dropdown',
                        id: this.props.id,
                    },
                    DOM.i({ className: 'glyphicon glyphicon-plus' }),
                    ` ${this.props.label}...`
                );
            },
            renderDropdown: function() {
                const items = this.props.items.map(this.renderDropdownItem);
                return DOM.ul({
                    role: 'menu',
                    className: 'dropdown-menu',
                    'aria-labelledby': this.props.id,
                }, items.toArray());
            },
            renderDropdownItem: function({ id, text }) {
                return DOM.li(
                    { key: id, role: 'presentation' },
                    DOM.a(
                        {
                            href: '#',
                            tabIndex: '-1',
                            role: 'menuitem',
                            onClick: this.props.onSelectItemType.bind(null, id),
                        },
                        text
                    )
                );
            }
        });

        const AddAnswerTool = React.createClass({
            displayName: 'AddAnswerTool',
            render: function() {
                const items = Poll.getItemTypeSpecs().map((spec, type) => {
                    return { id: type, text: getMsg(spec.get('labelKey')) };
                });
                return DOM.li(
                    {},
                    React.createElement(Dropdown, {
                        items,
                        label: getMsg('add_question'),
                        btnType: 'primary',
                        id: 'add_question_btn',
                        onSelectItemType: this.onSelectItemType,
                    })
                );
            },
            onSelectItemType: function(type, event) {
                event.preventDefault();
                this.props.action('add_item', type);
            }
        });

        const AddFromTemplateTool = React.createClass({
            displayName: 'AddFromTemplateTool',
            render() {
                const items = templates.map((template, templateName) => {
                    return { id: templateName, text: template.get('heading') };
                });
                return DOM.li(
                    {},
                    React.createElement(Dropdown, {
                        items,
                        btnType: 'default',
                        id: 'add_from_template_btn',
                        label: getMsg('add_questions_from_template'),
                        onSelectItemType: this.onSelectItemType,
                    })
                );
            },
            onSelectItemType: function(templateName, event) {
                event.preventDefault();
                this.props.action('append_questions_from_template', templateName);
            }
        });

        const Tools = React.createClass({
            displayName: 'Tools',
            render() {
                return DOM.ul(
                    { className: 'item list-inline', id: 'tools' },
                    React.createElement(AddAnswerTool, {
                        action: this.props.action,
                    }),
                    React.createElement(AddFromTemplateTool, {
                        action: this.props.action
                    })
                );
            },
        });

        const ConfigComponent = React.createClass({
            displayName: 'ConfigComponent',
            render: function() {
                const poll = this.props.poll;
                const items = poll.get('items').map(this.renderItem);
                return DOM.div(
                    {},
                    React.createElement(Heading),
                    React.createElement(HeadingInput, {
                        value: poll.get('heading'),
                        action: this.props.action,
                    }),
                    items,
                    React.createElement(Tools, {
                        action: this.props.action
                    })
                );
            },
            renderItem: function(item, index, items) {
                return createElement(Item, {
                    item: item,
                    key: item.get('id'),
                    action: this.props.action,
                    isFirst: index === 0,
                    isLast: index === items.count() - 1,
                });
            },
        });

        const actions = Immutable.Map({
            'add_item': function addItem(poll, type) {
                return Poll.addItem(poll, type);
            },
            'remove_item': function removeItem(poll, itemId) {
                if (!confirm(getMsg('confirm_question_removal'))) {
                    return poll;
                }
                return Poll.removeItem(poll, itemId);
            },
            'move_item_up': function moveItemUp(poll, itemId) {
                return Poll.moveItemUp(poll, itemId);
            },
            'move_item_down': function moveItemUp(poll, itemId) {
                return Poll.moveItemDown(poll, itemId);
            },
            'set_question': function setQuestion(poll, itemId, question) {
                return Poll.setQuestion(poll, itemId, question);
            },
            'set_answers': function setAnswers(poll, itemId, answers) {
                return Poll.setAnswers(poll, itemId, answers);
            },
            'set_heading': function(poll, heading) {
                return poll.set('heading', heading);
            },
            'append_questions_from_template': function(poll, templateName) {
                return Poll.mergePolls(poll, templates.get(templateName));
            }
        });

        function actionHandler(state, actions, render, actionName) {
            const handler = actions.get(actionName);
            if (typeof handler !== 'function') {
                throw new Error(`Unhandled action "${actionName}"`);
            }
            const args = Array.prototype.slice.call(arguments, 4);
            args.unshift(state);
            const newState = handler.apply(null, args);
            render(newState);
        }

        let currentPoll;
        function render(poll) {
            console.log('rendering config with %O', poll.toJS());
            const rootComponent = React.createElement(ConfigComponent, {
                poll: poll,
                action: actionHandler.bind(null, poll, actions, render),
            });
            currentPoll = poll;
            React.render(rootComponent, container[0]);
        }

        function answersToString(answers) {
            return answers.map(function(answer) {
                return `- ${answer.get('text')}`;
            }).join('\n');
        }

        function rawAnswersToList(rawAnswers) {
            const beginningDashAndWhitespace = /^\s*-\s*/;
            const answerTexts = Immutable.List(rawAnswers.split('\n'));
            return answerTexts.map(function answer(answerText) {
                return answerText.replace(beginningDashAndWhitespace, '');
            }).filterNot(function(answerText) {
                return answerText.trim() === '';
            }).map(function(answerText) {
                return Poll.newAnswer(answerText);
            });
        }

        return {
            render: render,
            show: function() {
                container.show();
            },
            hide: function() {
                container.hide();
            },
            getPoll: function() {
                return currentPoll;
            }
        };
    };
})(golab.tools.ReflectionPoll);
