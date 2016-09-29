((activityStatistics) => {
    const { util, State } = activityStatistics;
    const { scaleEquals } = util;
    const { PropTypes, createClass } = React;
    const ONE_MINUTE = 60 * 1000;
    const ONE_DAY = 24 * 60 * ONE_MINUTE;
    const ONE_YEAR = 365 * ONE_DAY;
    const timeFormatter = ({ start, end }) => {
        const duration = end - start;
        let formatString = 'LT';
        if (duration > ONE_YEAR) {
            formatString = 'LLLL';
        } else if (duration > ONE_DAY) {
            formatString = 'dddd, MMMM Do LT';
        }
        return (time) => moment(time).format(formatString);
    };
    const maybeGet = (map, prop) => {
        if (map === undefined || map === null) {
            return undefined;
        }
        return map.get(prop);
    };

    const TimelineStatus = createClass({
        displayName: 'TimelineStatus',
        propTypes: {
            activityInFocus: PropTypes.instanceOf(Immutable.Map),
            selectedTimeScale: PropTypes.func.isRequired,
            fullTimeScale: PropTypes.func.isRequired,
            connectionStatus: PropTypes.number.isRequired,
            getMsg: PropTypes.func.isRequired,
        },
        shouldComponentUpdate(nextProps) {
            const activityInFocus = this.props.activityInFocus;
            const nextActivityInFocus = nextProps.activityInFocus;
            return !(
                scaleEquals(nextProps.selectedTimeScale, this.props.selectedTimeScale) &&
                scaleEquals(nextProps.fullTimeScale, this.props.fullTimeScale) &&
                R.equals(nextProps.connectionStatus, this.props.connectionStatus) &&
                R.equals(activityInFocus, nextActivityInFocus) &&
                R.equals(
                    maybeGet(activityInFocus, 'data'),
                    maybeGet(nextActivityInFocus, 'data')
                )
            );
        },
        render() {
            const activity = this.props.activityInFocus;
            let status;
            if (!activity) {
                status = this.renderTimeScaleInfo();
            } else {
                if (activity.get('type') === 'phase') {
                    status = this.renderPhaseInfo();
                } else {
                    status = this.renderAppInfo();
                }
            }
            return (
                <div>
                    {this.renderMessage()}
                    <div id='info'>{status}</div>
                </div>
            );
        },
        renderMessage() {
            if (this.props.connectionStatus !== State.CONN_CLOSED) {
                return undefined;
            }
            return (
                <div>
                    <p className='text-danger'>
                        {this.props.getMsg('connection_closed')}
                    </p>
                </div>
            );
        },
        renderTimeScaleInfo() {
            const [start, end] = this.props.fullTimeScale.domain();
            const [selectedStart, selectedEnd] = this.props.selectedTimeScale.domain();
            const format = timeFormatter({ start, end });

            return (
                <span>
                    {this.props.getMsg('timescale_status', format(selectedStart), format(selectedEnd))}
                </span>
            );
        },
        renderPhaseInfo() {
            const data = this.props.activityInFocus.get('data');
            return (
                <span>
                    <strong>{this.props.getMsg('phase')}:</strong> {data.phase}

                    <strong> {this.props.getMsg('start')}:</strong>
                    <time dateTime={data.start.toISOString()}> {moment(data.start).format('LT')}</time>

                    <strong> {this.props.getMsg('end')}:</strong>
                    <time dateTime={data.end.toISOString()}> {moment(data.end).format('LT')}</time>

                    <strong> {this.props.getMsg('duration')}:</strong>
                    {' ' + moment.duration(data.end - data.start).humanize()}
                </span>
            );
        },
        renderAppInfo() {
            const data = this.props.activityInFocus.get('data');
            return (
                <span>
                    <strong>{this.props.getMsg('app')}:</strong> {data.targetname}
                    <strong> {this.props.getMsg('time')}:</strong>
                    <time dateTime={data.timestamp.toISOString()}>
                        {' ' + moment(data.timestamp).format('LT')}
                    </time>
                </span>
            );
        },
    });

    activityStatistics.TimelineStatus = TimelineStatus;
})(golab.tools.activityStatistics);
