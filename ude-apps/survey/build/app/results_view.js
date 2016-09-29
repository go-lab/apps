'use strict';

(function (ReflectionPoll) {
    var Poll = ReflectionPoll.Poll;

    var maxCount = function maxCount(labeledCounts) {
        return labeledCounts.map(function (c) {
            return c.get('count');
        }).max();
    };

    var AnswerCountBarChart = React.createClass({
        displayName: 'AnswerCountBarChart',
        render: function render() {
            return React.createElement('svg', { ref: 'canvas' });
        },
        componentDidMount: function componentDidMount() {
            this.update();
        },
        componentDidUpdate: function componentDidUpdate() {
            this.update();
        },
        update: function update() {
            var _this = this;

            var _props = this.props;
            var values = _props.values;
            var answers = _props.answers;

            nv.addGraph(function () {
                return _this.createChart(_this.labeledAnswerCounts(answers, values));
            });
        },
        createChart: function createChart(labeledCounts) {
            var getMsg = this.props.getMsg;

            var chart = nv.models.discreteBarChart().x(function (d) {
                return d.get('label');
            }).y(function (d) {
                return d.get('count');
            }).staggerLabels(true).showValues(false).duration(250);

            chart.yAxis.axisLabel(getMsg('frequency_of_answer')).tickFormat(d3.format('.0f')).ticks(maxCount(labeledCounts));

            chart.tooltip.valueFormatter(function (v) {
                return getMsg('selected_n_times', v);
            });

            d3.select(this.refs.canvas.getDOMNode()).datum([{
                values: labeledCounts.toArray()
            }]).call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        },
        labeledAnswerCounts: function labeledAnswerCounts(answers, values) {
            return answers.map(function (answer) {
                return Immutable.Map({
                    label: answer.get('text') || answer.get("id"),
                    count: values.filter(function (value) {
                        return value === answer.get('id');
                    }).count()
                });
            });
        }
    });

    var SingleChoiceStats = React.createClass({
        displayName: 'SingleChoiceStats',
        render: function render() {
            var _props2 = this.props;
            var item = _props2.item;
            var response = _props2.response;
            var getMsg = _props2.getMsg;

            return React.createElement(AnswerCountBarChart, {
                values: response,
                answers: item.get('answers'),
                getMsg: getMsg
            });
        }
    });

    /*const LikertScaleStats = React.createClass({
        displayName: 'LikertScaleStats',
        render() {
            const { item, response, getMsg } = this.props;
            return (
                <AnswerCountBarChart
                    values={response}
                    answers={item.get('answers')}
                    getMsg={getMsg}
                />
            );
        },
    });*/

    var LikertScaleStats = React.createClass({
        displayName: 'LikertScaleStats',
        render: function render() {
            var _props3 = this.props;
            var response = _props3.response;
            var getMsg = _props3.getMsg;

            var smileyAnswers = Poll.getLikertScale().map(function (smiley) {
                return Immutable.Map({
                    text: smiley,
                    id: smiley
                });
            });

            return React.createElement(AnswerCountBarChart, {
                values: response,
                answers: smileyAnswers,
                getMsg: getMsg
            });
        }
    });

    var MultipleChoiceStats = React.createClass({
        displayName: 'MultipleChoiceStats',
        render: function render() {
            var _props4 = this.props;
            var item = _props4.item;
            var response = _props4.response;
            var getMsg = _props4.getMsg;

            return React.createElement(AnswerCountBarChart, {
                values: response,
                answers: item.get('answers'),
                getMsg: getMsg
            });
        }
    });

    var SmileyStats = React.createClass({
        displayName: 'SmileyStats',
        render: function render() {
            var _props5 = this.props;
            var response = _props5.response;
            var getMsg = _props5.getMsg;

            var smileyAnswers = Poll.getSmileyValues().map(function (smiley) {
                return Immutable.Map({
                    text: getMsg('smiley_' + smiley),
                    id: smiley
                });
            });

            return React.createElement(AnswerCountBarChart, {
                values: response,
                answers: smileyAnswers,
                getMsg: getMsg
            });
        }
    });

    var OpenStats = React.createClass({
        displayName: 'OpenStats',
        render: function render() {
            var answers = this.props.response.map(this.renderAnswer);
            if (answers.count() === 0) {
                answers = React.createElement(
                    'em',
                    null,
                    'No answers given yet'
                );
            }
            return React.createElement(
                'ul',
                { className: 'list-unstyled' },
                answers
            );
        },
        renderAnswer: function renderAnswer(answer) {
            return React.createElement(
                'li',
                { key: answer },
                React.createElement(
                    'blockquote',
                    null,
                    '"',
                    answer,
                    '"'
                )
            );
        }
    });

    var statComponentsForType = Immutable.Map({
        'single-choice': SingleChoiceStats,
        'multiple-choice': MultipleChoiceStats,
        'open': OpenStats,
        'smiley': SmileyStats,
        'likert-scale': LikertScaleStats
    });

    var Item = React.createClass({
        displayName: 'Item',
        render: function render() {
            return React.createElement(
                'div',
                { className: this.props.item.get('type') },
                this.renderQuestion(),
                this.renderAnswer()
            );
        },
        renderQuestion: function renderQuestion() {
            var _props6 = this.props;
            var item = _props6.item;
            var getMsg = _props6.getMsg;

            var questionLabelKey = Poll.getItemTypeLabelKey(item.get('type'));
            return React.createElement(
                'h3',
                null,
                this.props.item.get('question') + ' ',
                '(',
                getMsg(questionLabelKey),
                ')'
            );
        },
        renderAnswer: function renderAnswer() {
            var _props7 = this.props;
            var item = _props7.item;
            var response = _props7.response;
            var getMsg = _props7.getMsg;

            var Component = statComponentsForType.get(item.get('type'));
            return React.createElement(Component, {
                item: item,
                response: response,
                getMsg: getMsg
            });
        }
    });

    var ResultsViewComponent = React.createClass({
        displayName: 'ResultsViewComponent',
        render: function render() {
            var poll = this.props.state.get('poll');
            return React.createElement(
                'div',
                { id: 'results' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h2',
                        null,
                        'Results for "',
                        poll.get('heading'),
                        '"'
                    )
                ),
                poll.get('items').map(this.renderItem)
            );
        },
        renderItem: function renderItem(item) {
            var itemResponse = this.props.state.get('response').get(item.get('id'), Immutable.List());
            return React.createElement(Item, {
                key: item.get('id'),
                item: item,
                response: itemResponse,
                getMsg: this.props.getMsg
            });
        }
    });

    ReflectionPoll.ResultsView = function (container) {
        return {
            render: function render(poll, response, getMsg) {
                var state = Immutable.Map({
                    poll: poll,
                    response: response
                });
                console.log('rendering poll results with state %O', state.toJS());
                React.render(React.createElement(ResultsViewComponent, { state: state, getMsg: getMsg }), container);
            },
            show: function show() {
                container.style.display = 'block';
            },
            hide: function hide() {
                container.style.display = 'none';
            }
        };
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=results_view.js.map
