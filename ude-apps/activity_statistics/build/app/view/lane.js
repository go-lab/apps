'use strict';

(function (activityStatistics) {
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;
    var LaneControls = activityStatistics.LaneControls;
    var util = activityStatistics.util;
    var scaleEquals = util.scaleEquals;

    var highlight = function highlight(color) {
        return util.blendColors(color, '#FFFFFF', 0.4);
    };
    var blendOut = function blendOut(color) {
        return util.blendColors(color, '#FFFFFF', 0.8);
    };

    var LaneList = React.createClass({
        displayName: 'LaneList',
        propTypes: {
            action: PropTypes.func.isRequired,
            getMsg: PropTypes.func.isRequired,
            configs: PropTypes.instanceOf(Immutable.List),
            timeScale: PropTypes.func.isRequired,
            appTypeScale: PropTypes.func.isRequired,
            phaseTypeScale: PropTypes.func.isRequired,
            menuWidth: PropTypes.number.isRequired,
            timelineWidth: PropTypes.number.isRequired,
            lanesHeight: PropTypes.number.isRequired,
            laneWidth: PropTypes.number.isRequired,
            showAppActivities: PropTypes.bool.isRequired,
            highlightedPhase: PropTypes.string.isRequired,
            highlightedApp: PropTypes.string.isRequired
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(scaleEquals(nextProps.timeScale, this.props.timeScale) && scaleEquals(nextProps.appTypeScale, this.props.appTypeScale) && scaleEquals(nextProps.phaseTypeScale, this.props.phaseTypeScale) && nextProps.menuWidth === this.props.menuWidth && nextProps.timelineWidth === this.props.timelineWidth && nextProps.lanesHeight === this.props.lanesHeight && nextProps.laneWidth === this.props.laneWidth && nextProps.highlightedPhase === this.props.highlightedPhase && nextProps.highlightedApp === this.props.highlightedApp && nextProps.showAppActivities === this.props.showAppActivities && nextProps.configs.equals(this.props.configs));
        },
        render: function render() {
            var _this = this;

            var lanes = this.props.configs.map(function (config) {
                return React.createElement(Lane, {
                    action: _this.props.action,
                    config: config,
                    timeScale: _this.props.timeScale,
                    appTypeScale: _this.props.appTypeScale,
                    phaseTypeScale: _this.props.phaseTypeScale,
                    menuWidth: _this.props.menuWidth,
                    laneWidth: _this.props.laneWidth,
                    timelineWidth: _this.props.timelineWidth,
                    getMsg: _this.props.getMsg,
                    highlightedPhase: _this.props.highlightedPhase,
                    showAppActivities: _this.props.showAppActivities,
                    highlightedApp: _this.props.highlightedApp,
                    key: config.get('username') });
            });
            return React.createElement(
                'ul',
                { style: { maxHeight: this.props.lanesHeight } },
                lanes
            );
        }
    });

    var Lane = createClass({
        displayName: 'Lane',
        propTypes: {
            action: PropTypes.func.isRequired,
            getMsg: PropTypes.func.isRequired,
            config: PropTypes.instanceOf(Immutable.Map),
            timeScale: PropTypes.func.isRequired,
            appTypeScale: PropTypes.func.isRequired,
            phaseTypeScale: PropTypes.func.isRequired,
            menuWidth: PropTypes.number.isRequired,
            timelineWidth: PropTypes.number.isRequired,
            laneWidth: PropTypes.number.isRequired,
            showAppActivities: PropTypes.bool.isRequired,
            highlightedPhase: PropTypes.string.isRequired,
            highlightedApp: PropTypes.string.isRequired
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(scaleEquals(nextProps.timeScale, this.props.timeScale) && scaleEquals(nextProps.appTypeScale, this.props.appTypeScale) && scaleEquals(nextProps.phaseTypeScale, this.props.phaseTypeScale) && nextProps.menuWidth === this.props.menuWidth && nextProps.timelineWidth === this.props.timelineWidth && nextProps.laneWidth === this.props.laneWidth && nextProps.highlightedPhase === this.props.highlightedPhase && nextProps.highlightedApp === this.props.highlightedApp && nextProps.showAppActivities === this.props.showAppActivities && nextProps.config.equals(this.props.config));
        },
        render: function render() {
            var _props = this.props;
            var config = _props.config;
            var action = _props.action;
            var laneWidth = _props.laneWidth;
            var menuWidth = _props.menuWidth;
            var timelineWidth = _props.timelineWidth;

            var dimensions = this.getActivityDimensions();
            var timelineBorder = 1;
            var timeline = null;
            if (!config.get('minimized')) {
                timeline = React.createElement(
                    'svg',
                    {
                        onMouseMove: this.onTimelineMouseMove,
                        onMouseOut: this.onTimelineMouseOut,
                        ref: 'timeline',
                        width: timelineWidth - timelineBorder },
                    React.createElement('g', { className: 'phases' }),
                    React.createElement('g', { className: 'apps' })
                );
            }
            return React.createElement(
                'li',
                {
                    className: 'lane',
                    style: { width: laneWidth, height: dimensions.totalHeight } },
                React.createElement(
                    'div',
                    {
                        className: 'menu',
                        style: { width: menuWidth } },
                    React.createElement(LaneControls, {
                        isMinimized: config.get('minimized'),
                        getMsg: this.props.getMsg,
                        username: config.get('username'),
                        action: action
                    }),
                    React.createElement(
                        'h3',
                        null,
                        config.get('username')
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'timeline' },
                    timeline
                )
            );
        },
        onTimelineMouseMove: function onTimelineMouseMove(event) {
            var _refs$timeline$getBoundingClientRect = this.refs.timeline.getBoundingClientRect();

            var left = _refs$timeline$getBoundingClientRect.left;

            this.props.action('set_marker_position', event.clientX - left);
        },
        onTimelineMouseOut: function onTimelineMouseOut() {
            this.props.action('set_marker_position', null);
        },
        componentDidMount: function componentDidMount() {
            this.updateTimeline();
        },
        componentDidUpdate: function componentDidUpdate() {
            this.updateTimeline();
        },
        updateTimeline: function updateTimeline() {
            var _this2 = this;

            var _props2 = this.props;
            var config = _props2.config;
            var timeScale = _props2.timeScale;
            var phaseTypeScale = _props2.phaseTypeScale;
            var appTypeScale = _props2.appTypeScale;
            var action = _props2.action;
            var highlightedPhase = _props2.highlightedPhase;
            var highlightedApp = _props2.highlightedApp;
            var showAppActivities = _props2.showAppActivities;

            if (config.get('minimized')) {
                return;
            }

            var svg = d3.select(this.refs.timeline);
            var phaseActivities = config.get('rawPhaseActivities');
            var appActivities = config.get('rawAppActivities');
            var phases = svg.select('.phases').selectAll('rect').data(phaseActivities);
            var apps = svg.select('.apps').selectAll('path').data(appActivities);

            var _getActivityDimensions = this.getActivityDimensions();

            var phaseHeight = _getActivityDimensions.phaseHeight;
            var appHeight = _getActivityDimensions.appHeight;

            // phases
            phases.enter().append('rect').attr('y', 0).attr('tabindex', 0).attr('fill', function (d) {
                return phaseTypeScale(d.phase);
            }).attr('aria-describedby', 'info');

            phases.classed('highlight', this.shouldHighlightPhase).transition().duration(125).attr('x', function (d) {
                return timeScale(d.start);
            }).attr('width', function (d) {
                return timeScale(d.end) - timeScale(d.start);
            }).attr('height', phaseHeight).attr('fill', function (d) {
                var color = phaseTypeScale(d.phase);
                if (d.focussed) return highlight(color);
                if (_this2.shouldBlendOutPhase(d)) return blendOut(color);
                return color;
            });

            // apps
            if (showAppActivities) {
                apps.enter().append('path').attr('d', d3.svg.symbol().type('triangle-up').size(util.math.equiTri.areaFromHeight(appHeight))).attr('transform', 'translate(0 0)').attr('tabindex', 0).attr('aria-describedby', 'info');

                apps.classed('highlight', this.shouldHighlightApp).transition().duration(125).attr('transform', function (d) {
                    return 'translate(' + timeScale(d.timestamp) + ' ' + (phaseHeight + appHeight / 2) + ')';
                }).attr('fill', function (d) {
                    var color = appTypeScale(d.targetname);
                    if (d.focussed) return highlight(color);
                    if (_this2.shouldBlendOutApp(d)) return blendOut(color);
                    return color;
                });

                svg.select('.apps').transition().style('opacity', 1);
            } else {
                svg.select('.apps').transition().style('opacity', 0);
            }

            this.setFocusHandlers(phases, this.focusActivity('phase'), this.unfocusActivity('phase'));
            this.setFocusHandlers(apps, this.focusActivity('app'), this.unfocusActivity('app'));
        },
        setFocusHandlers: function setFocusHandlers(selection, focus, unfocus) {
            selection.on('focus', focus);
            selection.on('mouseover', focus);
            selection.on('mouseout', unfocus);
            selection.on('blur', unfocus);
        },
        focusActivity: function focusActivity(type) {
            var _this3 = this;

            return function (d) {
                return _this3.props.action('focus_' + type + '_activity', _this3.props.config.get('username'), d);
            };
        },
        unfocusActivity: function unfocusActivity(type, d) {
            var _this4 = this;

            return function (d) {
                return _this4.props.action('unfocus_' + type + '_activity', _this4.props.config.get('username'), d);
            };
        },
        shouldHighlightPhase: function shouldHighlightPhase(phaseActivity) {
            return phaseActivity.focussed || this.props.highlightedApp === '' && phaseActivity.phase === this.props.highlightedPhase;
        },
        shouldHighlightApp: function shouldHighlightApp(appActivity) {
            return appActivity.focussed || this.props.highlightedPhase === '' && appActivity.targetname === this.props.highlightedApp;
        },
        shouldBlendOutPhase: function shouldBlendOutPhase(phaseActivity) {
            return this.props.highlightedApp !== '' || this.props.highlightedPhase !== '' && phaseActivity.phase !== this.props.highlightedPhase;
        },
        shouldBlendOutApp: function shouldBlendOutApp(appActivity) {
            return this.props.highlightedPhase !== '' || this.props.highlightedApp !== '' && appActivity.phase !== this.props.highlightedApp;
        },
        getActivityDimensions: function getActivityDimensions() {
            var phaseHeight = 25;
            var appHeight = 0;
            if (!this.props.config.get('minimized') && this.props.showAppActivities) {
                phaseHeight = 50;
                appHeight = phaseHeight * 1 / 3;
                phaseHeight *= 2 / 3;
            }
            return {
                totalHeight: appHeight + phaseHeight,
                phaseHeight: phaseHeight,
                appHeight: appHeight
            };
        }
    });

    activityStatistics.LaneList = LaneList;
})(golab.tools.activityStatistics);
//# sourceMappingURL=lane.js.map
