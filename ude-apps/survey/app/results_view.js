((ReflectionPoll) => {
    const { Poll } = ReflectionPoll;

    const maxCount = (labeledCounts) => {
        return labeledCounts.map((c) => c.get('count')).max();
    };

    const AnswerCountBarChart = React.createClass({
        displayName: 'AnswerCountBarChart',
        render() {
            return <svg ref='canvas'></svg>;
        },
        componentDidMount() {
            this.update();
        },
        componentDidUpdate() {
            this.update();
        },
        update() {
            const { values, answers } = this.props;
            nv.addGraph(() => {
                return this.createChart(this.labeledAnswerCounts(answers, values));
            });
        },
        createChart(labeledCounts) {
            const { getMsg } = this.props;
            const chart = nv.models.discreteBarChart()
            .x((d) => d.get('label'))
            .y((d) => d.get('count'))
            .staggerLabels(true)
            .showValues(false)
            .duration(250);

            chart.yAxis
            .axisLabel(getMsg('frequency_of_answer'))
            .tickFormat(d3.format('.0f'))
            .ticks(maxCount(labeledCounts));

            chart.tooltip.valueFormatter((v) => getMsg('selected_n_times', v));

            d3.select(this.refs.canvas.getDOMNode())
            .datum([{
                values: labeledCounts.toArray()
            }])
            .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        },
        labeledAnswerCounts(answers, values) {
            return answers.map((answer) => {
                return Immutable.Map({
                    label: answer.get('text') || answer.get("id"),
                    count: values
                    .filter((value) => value === answer.get('id'))
                    .count(),
                });
            });
        }
    });

    const SingleChoiceStats = React.createClass({
        displayName: 'SingleChoiceStats',
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

    const LikertScaleStats = React.createClass({
        displayName: 'LikertScaleStats',
        render() {
            const { response, getMsg } = this.props;
            const smileyAnswers = Poll.getLikertScale().map((smiley) => {
                return Immutable.Map({
                    text: smiley,
                    id: smiley,
                });
            });

            return (
                <AnswerCountBarChart
                    values={response}
                    answers={smileyAnswers}
                    getMsg={getMsg}
                />
            );
        },
    });

    const MultipleChoiceStats = React.createClass({
        displayName: 'MultipleChoiceStats',
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
    });

    const SmileyStats = React.createClass({
        displayName: 'SmileyStats',
        render() {
            const { response, getMsg } = this.props;
            const smileyAnswers = Poll.getSmileyValues().map((smiley) => {
                return Immutable.Map({
                    text: getMsg(`smiley_${smiley}`),
                    id: smiley,
                });
            });

            return (
                <AnswerCountBarChart
                    values={response}
                    answers={smileyAnswers}
                    getMsg={getMsg}
                />
            );
        },
    });

    const OpenStats = React.createClass({
        displayName: 'OpenStats',
        render() {
            let answers = this.props.response.map(this.renderAnswer);
            if (answers.count() === 0) {
                answers = <em>No answers given yet</em>;
            }
            return (
                <ul className='list-unstyled'>
                    {answers}
                </ul>
            );
        },
        renderAnswer(answer) {
            return (
                <li key={answer}>
                    <blockquote>"{answer}"</blockquote>
                </li>
            );
        },
    });

    const statComponentsForType = Immutable.Map({
        'single-choice': SingleChoiceStats,
        'multiple-choice': MultipleChoiceStats,
        'open': OpenStats,
        'smiley': SmileyStats,
        'likert-scale': LikertScaleStats,
    });

    const Item = React.createClass({
        displayName: 'Item',
        render() {
            return (
                <div className={this.props.item.get('type')}>
                    {this.renderQuestion()}
                    {this.renderAnswer()}
                </div>
            );
        },
        renderQuestion() {
            const { item, getMsg } = this.props;
            const questionLabelKey = Poll.getItemTypeLabelKey(item.get('type'));
            return (
                <h3>
                    {this.props.item.get('question') + ' '}
                    ({getMsg(questionLabelKey)})
                </h3>
            );
        },
        renderAnswer() {
            const { item, response, getMsg } = this.props;
            const Component = statComponentsForType.get(item.get('type'));
            return (
                <Component
                    item={item}
                    response={response}
                    getMsg={getMsg}
                />
            );
        },
    });

    const ResultsViewComponent = React.createClass({
        displayName: 'ResultsViewComponent',
        render() {
            const poll = this.props.state.get('poll');
            return (
                <div id='results'>
                    <div><h2>Results for "{poll.get('heading')}"</h2></div>
                    {poll.get('items').map(this.renderItem)}
                </div>
            );
        },
        renderItem(item) {
            const itemResponse = this.props.state
            .get('response')
            .get(item.get('id'), Immutable.List());
            return (
                <Item
                    key={item.get('id')}
                    item={item}
                    response={itemResponse}
                    getMsg={this.props.getMsg}
                />
            );
        },
    });

    ReflectionPoll.ResultsView = function(container) {
        return {
            render: (poll, response, getMsg) => {
                const state = Immutable.Map({
                    poll,
                    response,
                });
                console.log('rendering poll results with state %O', state.toJS());
                React.render(
                    <ResultsViewComponent state={state} getMsg={getMsg} />,
                    container
                );
            },
            show: function() {
                container.style.display = 'block';
            },
            hide: function() {
                container.style.display = 'none';
            },
        };
    };
})(golab.tools.ReflectionPoll);
