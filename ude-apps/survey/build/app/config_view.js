/* eslint no-alert: 0 */
'use strict';

(function (ReflectionPoll) {
    var util = ReflectionPoll.util;
    var Poll = ReflectionPoll.Poll;
    var pollTemplates = ReflectionPoll.pollTemplates;

    var createElement = React.createElement;
    var DOM = React.DOM;
    var Input = ReflectionPoll.Input;

    ReflectionPoll.ConfigView = function ConfigView(container, getMsg) {
        container = $(container);
        var templates = pollTemplates(getMsg);

        var Heading = React.createClass({
            displayName: 'Heading',
            render: function render() {
                return DOM.div({ className: 'item' }, DOM.h2({}, getMsg('configure_poll')));
            }
        });

        var HeadingInput = React.createClass({
            displayName: 'HeadingInput',
            render: function render() {
                return DOM.div({ className: 'item' }, createElement(Input, {
                    id: 'heading',
                    value: this.props.value,
                    label: getMsg('heading'),
                    onChange: this.onHeadingChange
                }));
            },
            onHeadingChange: function onHeadingChange(event) {
                this.props.action('set_heading', event.target.value);
            }
        });

        var IconButton = React.createClass({
            displayName: 'IconButton',
            getDefaultProps: function getDefaultProps() {
                return {
                    label: '',
                    showLabel: true,
                    glyphicon: '',
                    size: 'md',
                    type: 'default',
                    className: '',
                    onClick: function onClick() {}
                };
            },
            render: function render() {
                var title = '';
                var label = ' ' + this.props.label;
                if (!this.props.showLabel) {
                    title = this.props.label;
                    label = '';
                }
                var className = util.classNames('btn', 'btn-' + this.props.type, 'btn-' + this.props.size, this.props.className);
                return DOM.button({
                    type: 'button',
                    title: title,
                    className: className,
                    onClick: this.props.onClick
                }, DOM.i({
                    className: 'glyphicon glyphicon-' + this.props.glyphicon
                }), label);
            }
        });

        var ItemMenu = React.createClass({
            displayName: 'ItemMenu',
            buttonSpecs: [{
                title: getMsg('move_question_up'),
                glyphicon: 'chevron-up',
                action: 'move_item_up'
            }, {
                title: getMsg('move_question_down'),
                glyphicon: 'chevron-down',
                action: 'move_item_down'
            }, {
                title: getMsg('remove_question'),
                glyphicon: 'remove',
                action: 'remove_item'
            }],
            render: function render() {
                var buttons = this.buttonSpecs.map(this.renderButton);
                return DOM.div({ className: 'question_menu' }, buttons);
            },
            renderButton: function renderButton(spec) {
                return createElement(IconButton, {
                    key: spec.title,
                    label: spec.title,
                    showLabel: false,
                    glyphicon: spec.glyphicon,
                    size: 'sm',
                    className: spec.action,
                    onClick: this.onButtonClick.bind(this, spec)
                });
            },
            onButtonClick: function onButtonClick(buttonSpec, event) {
                event.preventDefault();
                this.props.action(buttonSpec.action);
            }
        });

        var AnswerInput = React.createClass({
            displayName: 'AnswerInput',
            getInitialState: function getInitialState() {
                return { rawAnswers: null };
            },
            componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
                if (!nextProps.answers.equals(this.props.answers)) {
                    this.setRawAnswers(nextProps.answers);
                }
            },
            componentWillMount: function componentWillMount() {
                this.setRawAnswers(this.props.answers);
            },
            render: function render() {
                return createElement(Input, {
                    id: this.props.id,
                    label: getMsg('answers'),
                    value: this.state.rawAnswers,
                    type: 'textarea',
                    onBlur: this.onAnswerBlur,
                    onChange: this.onAnswerChange
                });
            },
            setRawAnswers: function setRawAnswers(rawAnswers) {
                this.setState({
                    rawAnswers: answersToString(rawAnswers)
                });
            },
            onAnswerChange: function onAnswerChange(event) {
                this.setState({ rawAnswers: event.target.value });
            },
            onAnswerBlur: function onAnswerBlur(event) {
                this.props.onChange(rawAnswersToList(event.target.value));
            }
        });

        var Item = React.createClass({
            displayName: 'Item',
            render: function render() {
                var className = util.classNames({
                    item: true,
                    first: this.props.isFirst,
                    last: this.props.isLast
                });
                return DOM.div({ className: className }, createElement(ItemMenu, { action: this.menuAction }), this.renderQuestionInput(), this.renderAnswerInput());
            },
            renderQuestionInput: function renderQuestionInput() {
                var labelKey = Poll.getItemTypeLabelKey(this.props.item.get('type'));
                return createElement(Input, {
                    id: 'question_' + this.props.item.get('id'),
                    label: getMsg(labelKey),
                    value: this.props.item.get('question'),
                    onChange: this.onQuestionChange
                });
            },
            renderAnswerInput: function renderAnswerInput() {
                if (!Poll.itemHasUserSpecifiedAnswers(this.props.item.get('type'))) {
                    return undefined;
                }
                return createElement(AnswerInput, {
                    id: 'answer_' + this.props.item.get('id'),
                    onChange: this.onAnswerChange,
                    answers: this.props.item.get('answers')
                });
            },
            menuAction: function menuAction(actionName) {
                this.props.action(actionName, this.props.item.get('id'));
            },
            onQuestionChange: function onQuestionChange(event) {
                this.props.action('set_question', this.props.item.get('id'), event.target.value);
            },
            onAnswerChange: function onAnswerChange(newAnswers) {
                this.props.action('set_answers', this.props.item.get('id'), newAnswers);
            }
        });

        var Dropdown = React.createClass({
            displayName: 'Dropdown',
            getDefaultProps: function getDefaultProps() {
                return {
                    id: util.uuid(),
                    btnType: 'default',
                    onSelectItemType: function onSelectItemType() {}
                };
            },
            render: function render() {
                return DOM.div({ className: 'dropup' }, this.renderButton(), this.renderDropdown());
            },
            renderButton: function renderButton() {
                return DOM.button({
                    className: util.classNames('btn', 'btn-' + this.props.btnType, 'dropdown-toggle'),
                    type: 'button',
                    'aria-hasexpanded': 'false',
                    'aria-haspopup': 'true',
                    'data-toggle': 'dropdown',
                    id: this.props.id
                }, DOM.i({ className: 'glyphicon glyphicon-plus' }), ' ' + this.props.label + '...');
            },
            renderDropdown: function renderDropdown() {
                var items = this.props.items.map(this.renderDropdownItem);
                return DOM.ul({
                    role: 'menu',
                    className: 'dropdown-menu',
                    'aria-labelledby': this.props.id
                }, items.toArray());
            },
            renderDropdownItem: function renderDropdownItem(_ref) {
                var id = _ref.id;
                var text = _ref.text;

                return DOM.li({ key: id, role: 'presentation' }, DOM.a({
                    href: '#',
                    tabIndex: '-1',
                    role: 'menuitem',
                    onClick: this.props.onSelectItemType.bind(null, id)
                }, text));
            }
        });

        var AddAnswerTool = React.createClass({
            displayName: 'AddAnswerTool',
            render: function render() {
                var items = Poll.getItemTypeSpecs().map(function (spec, type) {
                    return { id: type, text: getMsg(spec.get('labelKey')) };
                });
                return DOM.li({}, React.createElement(Dropdown, {
                    items: items,
                    label: getMsg('add_question'),
                    btnType: 'primary',
                    id: 'add_question_btn',
                    onSelectItemType: this.onSelectItemType
                }));
            },
            onSelectItemType: function onSelectItemType(type, event) {
                event.preventDefault();
                this.props.action('add_item', type);
            }
        });

        var AddFromTemplateTool = React.createClass({
            displayName: 'AddFromTemplateTool',
            render: function render() {
                var items = templates.map(function (template, templateName) {
                    return { id: templateName, text: template.get('heading') };
                });
                return DOM.li({}, React.createElement(Dropdown, {
                    items: items,
                    btnType: 'default',
                    id: 'add_from_template_btn',
                    label: getMsg('add_questions_from_template'),
                    onSelectItemType: this.onSelectItemType
                }));
            },
            onSelectItemType: function onSelectItemType(templateName, event) {
                event.preventDefault();
                this.props.action('append_questions_from_template', templateName);
            }
        });

        var Tools = React.createClass({
            displayName: 'Tools',
            render: function render() {
                return DOM.ul({ className: 'item list-inline', id: 'tools' }, React.createElement(AddAnswerTool, {
                    action: this.props.action
                }), React.createElement(AddFromTemplateTool, {
                    action: this.props.action
                }));
            }
        });

        var ConfigComponent = React.createClass({
            displayName: 'ConfigComponent',
            render: function render() {
                var poll = this.props.poll;
                var items = poll.get('items').map(this.renderItem);
                return DOM.div({}, React.createElement(Heading), React.createElement(HeadingInput, {
                    value: poll.get('heading'),
                    action: this.props.action
                }), items, React.createElement(Tools, {
                    action: this.props.action
                }));
            },
            renderItem: function renderItem(item, index, items) {
                return createElement(Item, {
                    item: item,
                    key: item.get('id'),
                    action: this.props.action,
                    isFirst: index === 0,
                    isLast: index === items.count() - 1
                });
            }
        });

        var actions = Immutable.Map({
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
            'set_heading': function set_heading(poll, heading) {
                return poll.set('heading', heading);
            },
            'append_questions_from_template': function append_questions_from_template(poll, templateName) {
                return Poll.mergePolls(poll, templates.get(templateName));
            }
        });

        function actionHandler(state, actions, render, actionName) {
            var handler = actions.get(actionName);
            if (typeof handler !== 'function') {
                throw new Error('Unhandled action "' + actionName + '"');
            }
            var args = Array.prototype.slice.call(arguments, 4);
            args.unshift(state);
            var newState = handler.apply(null, args);
            render(newState);
        }

        var currentPoll = undefined;
        function render(poll) {
            console.log('rendering config with %O', poll.toJS());
            var rootComponent = React.createElement(ConfigComponent, {
                poll: poll,
                action: actionHandler.bind(null, poll, actions, render)
            });
            currentPoll = poll;
            React.render(rootComponent, container[0]);
        }

        function answersToString(answers) {
            return answers.map(function (answer) {
                return '- ' + answer.get('text');
            }).join('\n');
        }

        function rawAnswersToList(rawAnswers) {
            var beginningDashAndWhitespace = /^\s*-\s*/;
            var answerTexts = Immutable.List(rawAnswers.split('\n'));
            return answerTexts.map(function answer(answerText) {
                return answerText.replace(beginningDashAndWhitespace, '');
            }).filterNot(function (answerText) {
                return answerText.trim() === '';
            }).map(function (answerText) {
                return Poll.newAnswer(answerText);
            });
        }

        return {
            render: render,
            show: function show() {
                container.show();
            },
            hide: function hide() {
                container.hide();
            },
            getPoll: function getPoll() {
                return currentPoll;
            }
        };
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=config_view.js.map
