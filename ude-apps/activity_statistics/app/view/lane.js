((activityStatistics) => {
    const { PropTypes, createClass } = React;
    const { LaneControls, util } = activityStatistics;
    const { scaleEquals } = util;
    const highlight = (color) => util.blendColors(color, '#FFFFFF', 0.4);
    const blendOut  = (color) => util.blendColors(color, '#FFFFFF', 0.8);

    const LaneList = React.createClass({
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
            highlightedApp: PropTypes.string.isRequired,
        },
        shouldComponentUpdate(nextProps) {
            return !(
                scaleEquals(nextProps.timeScale, this.props.timeScale) &&
                scaleEquals(nextProps.appTypeScale, this.props.appTypeScale) &&
                scaleEquals(nextProps.phaseTypeScale, this.props.phaseTypeScale) &&
                nextProps.menuWidth === this.props.menuWidth &&
                nextProps.timelineWidth === this.props.timelineWidth &&
                nextProps.lanesHeight === this.props.lanesHeight &&
                nextProps.laneWidth === this.props.laneWidth &&
                nextProps.highlightedPhase === this.props.highlightedPhase &&
                nextProps.highlightedApp === this.props.highlightedApp &&
                nextProps.showAppActivities === this.props.showAppActivities &&
                nextProps.configs.equals(this.props.configs)
            );
        },
        render() {
            const lanes = this.props.configs.map((config) => {
                return (
                    <Lane
                        action={this.props.action}
                        config={config}
                        timeScale={this.props.timeScale}
                        appTypeScale={this.props.appTypeScale}
                        phaseTypeScale={this.props.phaseTypeScale}
                        menuWidth={this.props.menuWidth}
                        laneWidth={this.props.laneWidth}
                        timelineWidth={this.props.timelineWidth}
                        getMsg={this.props.getMsg}
                        highlightedPhase={this.props.highlightedPhase}
                        showAppActivities={this.props.showAppActivities}
                        highlightedApp={this.props.highlightedApp}
                        key={config.get('username')} />
                );
            });
            return (
                <ul style={{ maxHeight: this.props.lanesHeight }}>
                    {lanes}
                </ul>
            );
        },
    });

    const Lane = createClass({
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
            highlightedApp: PropTypes.string.isRequired,
        },
        shouldComponentUpdate(nextProps) {
            return !(
                scaleEquals(nextProps.timeScale, this.props.timeScale) &&
                scaleEquals(nextProps.appTypeScale, this.props.appTypeScale) &&
                scaleEquals(nextProps.phaseTypeScale, this.props.phaseTypeScale) &&
                nextProps.menuWidth === this.props.menuWidth &&
                nextProps.timelineWidth === this.props.timelineWidth &&
                nextProps.laneWidth === this.props.laneWidth &&
                nextProps.highlightedPhase === this.props.highlightedPhase &&
                nextProps.highlightedApp === this.props.highlightedApp &&
                nextProps.showAppActivities === this.props.showAppActivities &&
                nextProps.config.equals(this.props.config)
            );
        },
        render() {
            const {
                config,
                action,
                laneWidth,
                menuWidth,
                timelineWidth
            } = this.props;
            const dimensions = this.getActivityDimensions();
            const timelineBorder = 1;
            let timeline = null;
            if (!config.get('minimized')) {
                timeline = (
                    <svg
                        onMouseMove={this.onTimelineMouseMove}
                        onMouseOut={this.onTimelineMouseOut}
                        ref='timeline'
                        width={timelineWidth - timelineBorder}>
                        <g className='phases'></g>
                        <g className='apps'></g>
                    </svg>
                );
            }
            return (
                <li
                    className='lane'
                    style={{ width: laneWidth, height: dimensions.totalHeight }}>
                    <div
                        className='menu'
                        style={{ width: menuWidth }}>
                        <LaneControls
                            isMinimized={config.get('minimized')}
                            getMsg={this.props.getMsg}
                            username={config.get('username')}
                            action={action}
                        />
                        <h3>{config.get('username')}</h3>
                    </div>
                    <div className='timeline'>
                        {timeline}
                    </div>
                </li>
            );
        },
        onTimelineMouseMove(event) {
            const { left } = this.refs.timeline.getBoundingClientRect();
            this.props.action('set_marker_position', event.clientX - left);
        },
        onTimelineMouseOut() {
            this.props.action('set_marker_position', null);
        },
        componentDidMount() {
            this.updateTimeline();
        },
        componentDidUpdate() {
            this.updateTimeline();
        },
        updateTimeline() {
            const {
                config,
                timeScale,
                phaseTypeScale,
                appTypeScale,
                action,
                highlightedPhase,
                highlightedApp,
                showAppActivities,
            } = this.props;

            if (config.get('minimized')) {
                return;
            }

            const svg = d3.select(this.refs.timeline);
            const phaseActivities = config.get('rawPhaseActivities');
            const appActivities = config.get('rawAppActivities');
            const phases =
              svg.select('.phases').selectAll('rect').data(phaseActivities);
            const apps =
              svg.select('.apps').selectAll('path').data(appActivities);

            const { phaseHeight, appHeight } = this.getActivityDimensions();

            // phases
            phases
            .enter()
            .append('rect')
            .attr('y', 0)
            .attr('tabindex', 0)
            .attr('fill', d => phaseTypeScale(d.phase))
            .attr('aria-describedby', 'info');

            phases
            .classed('highlight', this.shouldHighlightPhase)
            .transition()
            .duration(125)
            .attr('x', d => timeScale(d.start))
            .attr('width', d => timeScale(d.end) - timeScale(d.start))
            .attr('height', phaseHeight)
            .attr('fill', (d) => {
                const color = phaseTypeScale(d.phase);
                if (d.focussed) return highlight(color);
                if (this.shouldBlendOutPhase(d)) return blendOut(color);
                return color;
            });

            // apps
            if (showAppActivities) {
                apps
                .enter()
                .append('path')
                .attr('d', d3.svg.symbol().type('triangle-up').size(
                    util.math.equiTri.areaFromHeight(appHeight))
                )
                .attr('transform', 'translate(0 0)')
                .attr('tabindex', 0)
                .attr('aria-describedby', 'info');

                apps
                .classed('highlight', this.shouldHighlightApp)
                .transition()
                .duration(125)
                .attr('transform', d => (
                    `translate(${timeScale(d.timestamp)} ${phaseHeight + appHeight / 2})`
                ))
                .attr('fill', (d) => {
                    const color = appTypeScale(d.targetname);
                    if (d.focussed) return highlight(color);
                    if (this.shouldBlendOutApp(d)) return blendOut(color);
                    return color;
                });

                svg.select('.apps').transition().style('opacity', 1);
            } else {
                svg.select('.apps').transition().style('opacity', 0);
            }

            this.setFocusHandlers(
                phases, this.focusActivity('phase'), this.unfocusActivity('phase')
            );
            this.setFocusHandlers(
                apps, this.focusActivity('app'), this.unfocusActivity('app')
            );
        },
        setFocusHandlers(selection, focus, unfocus) {
            selection.on('focus', focus);
            selection.on('mouseover', focus);
            selection.on('mouseout', unfocus);
            selection.on('blur', unfocus);
        },
        focusActivity(type) {
            return (d) => this.props.action(
              `focus_${type}_activity`, this.props.config.get('username'), d
            );
        },
        unfocusActivity(type, d) {
            return (d) => this.props.action(
              `unfocus_${type}_activity`, this.props.config.get('username'), d
            );
        },
        shouldHighlightPhase(phaseActivity) {
            return (
                phaseActivity.focussed || (
                    this.props.highlightedApp === '' &&
                    phaseActivity.phase === this.props.highlightedPhase
                )
            );
        },
        shouldHighlightApp(appActivity) {
            return (
                appActivity.focussed || (
                    this.props.highlightedPhase === '' &&
                    appActivity.targetname === this.props.highlightedApp
                )
            );
        },
        shouldBlendOutPhase(phaseActivity) {
            return (
                this.props.highlightedApp !== '' || (
                    this.props.highlightedPhase !== '' &&
                    phaseActivity.phase !== this.props.highlightedPhase
                )
            );
        },
        shouldBlendOutApp(appActivity) {
            return (
                this.props.highlightedPhase !== '' || (
                    this.props.highlightedApp !== '' &&
                    appActivity.phase !== this.props.highlightedApp
                )
            );
        },
        getActivityDimensions() {
            let phaseHeight = 25;
            let appHeight = 0;
            if (!this.props.config.get('minimized') && this.props.showAppActivities) {
                phaseHeight = 50;
                appHeight = phaseHeight * 1/3;
                phaseHeight *= 2 / 3;
            }
            return {
                totalHeight: appHeight + phaseHeight,
                phaseHeight,
                appHeight,
            };
        },
    });

    activityStatistics.LaneList = LaneList;
})(golab.tools.activityStatistics);
