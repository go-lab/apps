'use strict';

(function (activityStatistics) {
    var util = activityStatistics.util;
    var TimelineControls = activityStatistics.TimelineControls;
    var TimelineStatus = activityStatistics.TimelineStatus;
    var Legend = activityStatistics.Legend;
    var Timeaxis = activityStatistics.Timeaxis;
    var Timeslider = activityStatistics.Timeslider;
    var TimeMarker = activityStatistics.TimeMarker;
    var LaneList = activityStatistics.LaneList;
    var Button = activityStatistics.Button;

    var mapTime = R.map(function (d) {
        return d.getTime();
    });

    var extractTimestamps = function extractTimestamps(lane) {
        var activityTimes = R.map(function (activity) {
            return activity.timestamp;
        }, lane.get('rawAppActivities'));
        var phaseTimes = R.map(function (activity) {
            return [activity.start, activity.end];
        }, lane.get('rawPhaseActivities'));
        return R.flatten(phaseTimes).concat(activityTimes);
    };

    var min = R.reduce(R.min, Infinity);
    var max = R.reduce(R.max, -Infinity);

    var getActivityTimeRange = function getActivityTimeRange(lanes) {
        var timestamps = R.pipe(R.map(extractTimestamps), function (t) {
            return t.toJS();
        }, R.flatten, mapTime)(lanes);

        return {
            min: new Date(min(timestamps)),
            max: new Date(max(timestamps))
        };
    };

    var withDefaults = function withDefaults(sourceMap, defaults) {
        return sourceMap.map(function (val, key) {
            return R.defaultTo(defaults[key], val);
        });
    };

    var View = React.createClass({
        displayName: 'View',
        render: function render() {
            var dimensions = this.props.state.get('dimensions');
            var laneConfigs = this.props.state.get('projectedLanes');
            if (laneConfigs.count() === 0) {
                return React.createElement('div', { className: 'cover', id: 'loading_indicator' });
            }
            var scales = this.getScales(laneConfigs);
            return React.createElement(
                'div',
                null,
                this.renderStatusBar(laneConfigs, scales),
                React.createElement(
                    'div',
                    { className: 'lanes' },
                    React.createElement(
                        'h4',
                        { className: 'sr-only' },
                        this.props.getMsg('timelines')
                    ),
                    React.createElement(TimeMarker, {
                        x: this.props.state.get('timeMarkerX'),
                        offset: dimensions.get('menuWidth')
                    }),
                    React.createElement(LaneList, {
                        action: this.props.action,
                        configs: laneConfigs,
                        timeScale: scales.selectedTime,
                        appTypeScale: scales.appType,
                        phaseTypeScale: scales.phaseType,
                        menuWidth: dimensions.get('menuWidth'),
                        laneWidth: dimensions.get('laneWidth'),
                        timelineWidth: dimensions.get('timelineWidth'),
                        lanesHeight: dimensions.get('lanesHeight'),
                        highlightedPhase: this.props.state.get('highlightedPhase'),
                        highlightedApp: this.props.state.get('highlightedApp'),
                        showAppActivities: this.props.state.get('showAppActivities'),
                        getMsg: this.props.getMsg
                    })
                ),
                React.createElement(
                    'div',
                    {
                        ref: 'bottom',
                        style: { marginLeft: dimensions.get('menuWidth') } },
                    React.createElement(Timeaxis, {
                        scale: scales.selectedTime,
                        width: dimensions.get('timelineWidth')
                    }),
                    React.createElement(Timeslider, {
                        selectedScale: scales.selectedTime,
                        fullScale: scales.fullTime,
                        width: dimensions.get('timelineWidth'),
                        action: this.props.action
                    })
                )
            );
        },
        renderStatusBar: function renderStatusBar(laneConfigs, scales) {
            var allLanesMaximized = laneConfigs.every(function (l) {
                return !l.get('minimized');
            });
            var minimized = this.props.state.get('statusBarMinimized');
            return React.createElement(
                'div',
                { ref: 'top', className: 'top ' + (minimized ? 'minimized' : '') },
                React.createElement(
                    'div',
                    { id: 'toggle_status_visibility' },
                    React.createElement(Button, {
                        onClick: this.toggleStatusVisibility,
                        glyphicon: 'chevron-' + (minimized ? 'down' : 'up'),
                        screenReaderOnlyLabel: true,
                        label: minimized ? this.props.getMsg('show_statusbar') : this.props.getMsg('hide_statusbar')
                    })
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        null,
                        this.props.getMsg('view_controls')
                    ),
                    React.createElement(TimelineControls, {
                        getMsg: this.props.getMsg,
                        action: this.props.action,
                        allLanesShowApps: this.props.state.get('showAppActivities'),
                        allLanesMaximized: allLanesMaximized,
                        availableDays: this.props.state.get('availableDays'),
                        selectedDay: this.props.state.get('selectedDay')
                    })
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        null,
                        this.props.getMsg('phases')
                    ),
                    React.createElement(Legend, {
                        scale: scales.phaseType,
                        highlightedItem: this.props.state.get('highlightedPhase'),
                        highlightAction: R.partial(this.props.action, 'highlight_phase'),
                        dehighlightAction: R.partial(this.props.action, 'dehighlight_phase')
                    })
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        null,
                        this.props.getMsg('apps')
                    ),
                    React.createElement(Legend, {
                        scale: scales.appType,
                        shape: 'triangle-up',
                        highlightedItem: this.props.state.get('highlightedApp'),
                        highlightAction: R.partial(this.props.action, 'highlight_app'),
                        dehighlightAction: R.partial(this.props.action, 'dehighlight_app')
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'timeline_status' },
                    React.createElement(
                        'h4',
                        null,
                        this.props.getMsg('info')
                    ),
                    React.createElement(TimelineStatus, {
                        getMsg: this.props.getMsg,
                        activityInFocus: this.props.state.get('activityInFocus'),
                        selectedTimeScale: scales.selectedTime,
                        fullTimeScale: scales.fullTime,
                        connectionStatus: this.props.state.get('connectionStatus')
                    })
                )
            );
        },
        componentDidUpdate: function componentDidUpdate() {
            this.checkDimensions();
        },
        getScales: function getScales(lanes) {
            var width = this.props.state.getIn(['dimensions', 'timelineWidth']);

            var _getActivityTimeRange = getActivityTimeRange(lanes);

            var minDate = _getActivityTimeRange.min;
            var maxDate = _getActivityTimeRange.max;

            var _withDefaults$toJS = withDefaults(this.props.state.get('selectedTimeRange'), { min: minDate, max: maxDate }).toJS();

            var selectedMinDate = _withDefaults$toJS.min;
            var selectedMaxDate = _withDefaults$toJS.max;

            var fullTime = d3.time.scale().domain([minDate, maxDate]).range([0, width]);
            var selectedTime = d3.time.scale().domain([selectedMinDate, selectedMaxDate]).range([0, width]);
            var phaseType = this.getPhaseTypeScale();
            var appType = this.getAppTypeScale();
            return { fullTime: fullTime, selectedTime: selectedTime, phaseType: phaseType, appType: appType };
        },
        getPhaseTypeScale: function getPhaseTypeScale() {
            return d3.scale.ordinal().range(util.colorBrewer.paired).domain(this.props.state.get('phases').toArray());
        },
        getAppTypeScale: function getAppTypeScale() {
            return d3.scale.ordinal().range(util.colorBrewer.set3).domain(this.props.state.get('apps').toArray());
        },
        checkDimensions: function checkDimensions() {
            var dimensions = this.props.state.get('dimensions');
            if (this.refs.top) {
                var topHeight = this.refs.top.clientHeight;
                if (dimensions.get('topHeight') !== topHeight) {
                    this.props.action('set_top_height', topHeight);
                }
            }
            if (this.refs.bottom) {
                var bottomHeight = this.refs.bottom.clientHeight;
                if (dimensions.get('bottomHeight') !== bottomHeight) {
                    this.props.action('set_bottom_height', bottomHeight);
                }
            }
        },
        toggleStatusVisibility: function toggleStatusVisibility() {
            if (this.props.state.get('statusBarMinimized')) {
                this.props.action('maximize_status_bar');
            } else {
                this.props.action('minimize_status_bar');
            }
        }
    });

    activityStatistics.View = View;
})(golab.tools.activityStatistics);
//# sourceMappingURL=view.js.map
