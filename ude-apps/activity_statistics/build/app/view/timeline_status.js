'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function (activityStatistics) {
    var util = activityStatistics.util;
    var State = activityStatistics.State;
    var scaleEquals = util.scaleEquals;
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;

    var ONE_MINUTE = 60 * 1000;
    var ONE_DAY = 24 * 60 * ONE_MINUTE;
    var ONE_YEAR = 365 * ONE_DAY;
    var timeFormatter = function timeFormatter(_ref) {
        var start = _ref.start;
        var end = _ref.end;

        var duration = end - start;
        var formatString = 'LT';
        if (duration > ONE_YEAR) {
            formatString = 'LLLL';
        } else if (duration > ONE_DAY) {
            formatString = 'dddd, MMMM Do LT';
        }
        return function (time) {
            return moment(time).format(formatString);
        };
    };
    var maybeGet = function maybeGet(map, prop) {
        if (map === undefined || map === null) {
            return undefined;
        }
        return map.get(prop);
    };

    var TimelineStatus = createClass({
        displayName: 'TimelineStatus',
        propTypes: {
            activityInFocus: PropTypes.instanceOf(Immutable.Map),
            selectedTimeScale: PropTypes.func.isRequired,
            fullTimeScale: PropTypes.func.isRequired,
            connectionStatus: PropTypes.number.isRequired,
            getMsg: PropTypes.func.isRequired
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            var activityInFocus = this.props.activityInFocus;
            var nextActivityInFocus = nextProps.activityInFocus;
            return !(scaleEquals(nextProps.selectedTimeScale, this.props.selectedTimeScale) && scaleEquals(nextProps.fullTimeScale, this.props.fullTimeScale) && R.equals(nextProps.connectionStatus, this.props.connectionStatus) && R.equals(activityInFocus, nextActivityInFocus) && R.equals(maybeGet(activityInFocus, 'data'), maybeGet(nextActivityInFocus, 'data')));
        },
        render: function render() {
            var activity = this.props.activityInFocus;
            var status = undefined;
            if (!activity) {
                status = this.renderTimeScaleInfo();
            } else {
                if (activity.get('type') === 'phase') {
                    status = this.renderPhaseInfo();
                } else {
                    status = this.renderAppInfo();
                }
            }
            return React.createElement(
                'div',
                null,
                this.renderMessage(),
                React.createElement(
                    'div',
                    { id: 'info' },
                    status
                )
            );
        },
        renderMessage: function renderMessage() {
            if (this.props.connectionStatus !== State.CONN_CLOSED) {
                return undefined;
            }
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    { className: 'text-danger' },
                    this.props.getMsg('connection_closed')
                )
            );
        },
        renderTimeScaleInfo: function renderTimeScaleInfo() {
            var _props$fullTimeScale$domain = this.props.fullTimeScale.domain();

            var _props$fullTimeScale$domain2 = _slicedToArray(_props$fullTimeScale$domain, 2);

            var start = _props$fullTimeScale$domain2[0];
            var end = _props$fullTimeScale$domain2[1];

            var _props$selectedTimeScale$domain = this.props.selectedTimeScale.domain();

            var _props$selectedTimeScale$domain2 = _slicedToArray(_props$selectedTimeScale$domain, 2);

            var selectedStart = _props$selectedTimeScale$domain2[0];
            var selectedEnd = _props$selectedTimeScale$domain2[1];

            var format = timeFormatter({ start: start, end: end });

            return React.createElement(
                'span',
                null,
                this.props.getMsg('timescale_status', format(selectedStart), format(selectedEnd))
            );
        },
        renderPhaseInfo: function renderPhaseInfo() {
            var data = this.props.activityInFocus.get('data');
            return React.createElement(
                'span',
                null,
                React.createElement(
                    'strong',
                    null,
                    this.props.getMsg('phase'),
                    ':'
                ),
                ' ',
                data.phase,
                React.createElement(
                    'strong',
                    null,
                    ' ',
                    this.props.getMsg('start'),
                    ':'
                ),
                React.createElement(
                    'time',
                    { dateTime: data.start.toISOString() },
                    ' ',
                    moment(data.start).format('LT')
                ),
                React.createElement(
                    'strong',
                    null,
                    ' ',
                    this.props.getMsg('end'),
                    ':'
                ),
                React.createElement(
                    'time',
                    { dateTime: data.end.toISOString() },
                    ' ',
                    moment(data.end).format('LT')
                ),
                React.createElement(
                    'strong',
                    null,
                    ' ',
                    this.props.getMsg('duration'),
                    ':'
                ),
                ' ' + moment.duration(data.end - data.start).humanize()
            );
        },
        renderAppInfo: function renderAppInfo() {
            var data = this.props.activityInFocus.get('data');
            return React.createElement(
                'span',
                null,
                React.createElement(
                    'strong',
                    null,
                    this.props.getMsg('app'),
                    ':'
                ),
                ' ',
                data.targetname,
                React.createElement(
                    'strong',
                    null,
                    ' ',
                    this.props.getMsg('time'),
                    ':'
                ),
                React.createElement(
                    'time',
                    { dateTime: data.timestamp.toISOString() },
                    ' ' + moment(data.timestamp).format('LT')
                )
            );
        }
    });

    activityStatistics.TimelineStatus = TimelineStatus;
})(golab.tools.activityStatistics);
//# sourceMappingURL=timeline_status.js.map
