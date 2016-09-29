((activityStatistics) => {
    const {
        util,
        TimelineControls,
        TimelineStatus,
        Legend,
        Timeaxis,
        Timeslider,
        TimeMarker,
        LaneList,
        Button
    } = activityStatistics;

    const mapTime = R.map((d) => d.getTime());

    const extractTimestamps = (lane) => {
        const activityTimes = R.map((activity) => {
            return activity.timestamp;
        }, lane.get('rawAppActivities'));
        const phaseTimes = R.map((activity) => {
            return [activity.start, activity.end];
        }, lane.get('rawPhaseActivities'));
        return R.flatten(phaseTimes).concat(activityTimes);
    };

    const min = R.reduce(R.min, Infinity);
    const max = R.reduce(R.max, -Infinity);

    const getActivityTimeRange = (lanes) => {
        const timestamps = R.pipe(
            R.map(extractTimestamps),
            (t) => t.toJS(),
            R.flatten,
            mapTime
        )(lanes);

        return {
            min: new Date(min(timestamps)),
            max: new Date(max(timestamps))
        };
    };

    const withDefaults = (sourceMap, defaults) => {
        return sourceMap.map((val, key) => {
            return R.defaultTo(defaults[key], val);
        });
    };

    const View = React.createClass({
        displayName: 'View',
        render() {
            const dimensions = this.props.state.get('dimensions');
            const laneConfigs = this.props.state.get('projectedLanes');
            if (laneConfigs.count() === 0) {
                return <div className='cover' id='loading_indicator'></div>;
            }
            const scales = this.getScales(laneConfigs);
            return (
                <div>
                    {this.renderStatusBar(laneConfigs, scales)}
                    <div className='lanes'>
                        <h4 className='sr-only'>{this.props.getMsg('timelines')}</h4>
                        <TimeMarker
                            x={this.props.state.get('timeMarkerX')}
                            offset={dimensions.get('menuWidth')}
                        />
                        <LaneList
                            action={this.props.action}
                            configs={laneConfigs}
                            timeScale={scales.selectedTime}
                            appTypeScale={scales.appType}
                            phaseTypeScale={scales.phaseType}
                            menuWidth={dimensions.get('menuWidth')}
                            laneWidth={dimensions.get('laneWidth')}
                            timelineWidth={dimensions.get('timelineWidth')}
                            lanesHeight={dimensions.get('lanesHeight')}
                            highlightedPhase={this.props.state.get('highlightedPhase')}
                            highlightedApp={this.props.state.get('highlightedApp')}
                            showAppActivities={this.props.state.get('showAppActivities')}
                            getMsg={this.props.getMsg}
                        />
                    </div>
                    <div
                        ref='bottom'
                        style={{ marginLeft: dimensions.get('menuWidth') }}>
                        <Timeaxis
                            scale={scales.selectedTime}
                            width={dimensions.get('timelineWidth')}
                        />
                        <Timeslider
                            selectedScale={scales.selectedTime}
                            fullScale={scales.fullTime}
                            width={dimensions.get('timelineWidth')}
                            action={this.props.action}
                        />
                    </div>
                </div>
            );
        },
        renderStatusBar(laneConfigs, scales) {
            const allLanesMaximized = laneConfigs.every(l => !l.get('minimized'));
            const minimized = this.props.state.get('statusBarMinimized');
            return (
                <div ref='top' className={`top ${minimized ? 'minimized' : ''}`}>
                    <div id='toggle_status_visibility'>
                        <Button
                            onClick={this.toggleStatusVisibility}
                            glyphicon={`chevron-${minimized ? 'down' : 'up'}`}
                            screenReaderOnlyLabel={true}
                            label={
                                minimized ?
                                    this.props.getMsg('show_statusbar') :
                                    this.props.getMsg('hide_statusbar')
                            }
                        />
                    </div>
                    <div>
                        <h4>{this.props.getMsg('view_controls')}</h4>
                        <TimelineControls
                            getMsg={this.props.getMsg}
                            action={this.props.action}
                            allLanesShowApps={this.props.state.get('showAppActivities')}
                            allLanesMaximized={allLanesMaximized}
                            availableDays={this.props.state.get('availableDays')}
                            selectedDay={this.props.state.get('selectedDay')}
                        />
                    </div>
                    <div>
                        <h4>{this.props.getMsg('phases')}</h4>
                        <Legend
                            scale={scales.phaseType}
                            highlightedItem={this.props.state.get('highlightedPhase')}
                            highlightAction={R.partial(this.props.action, 'highlight_phase')}
                            dehighlightAction={R.partial(this.props.action, 'dehighlight_phase')}
                        />
                    </div>
                    <div>
                        <h4>{this.props.getMsg('apps')}</h4>
                        <Legend
                            scale={scales.appType}
                            shape='triangle-up'
                            highlightedItem={this.props.state.get('highlightedApp')}
                            highlightAction={R.partial(this.props.action, 'highlight_app')}
                            dehighlightAction={R.partial(this.props.action, 'dehighlight_app')}
                        />
                    </div>
                    <div className='timeline_status'>
                        <h4>{this.props.getMsg('info')}</h4>
                        <TimelineStatus
                            getMsg={this.props.getMsg}
                            activityInFocus={this.props.state.get('activityInFocus')}
                            selectedTimeScale={scales.selectedTime}
                            fullTimeScale={scales.fullTime}
                            connectionStatus={this.props.state.get('connectionStatus')}
                        />
                    </div>
                </div>
            );
        },
        componentDidUpdate() {
            this.checkDimensions();
        },
        getScales(lanes) {
            const width = this.props.state.getIn(['dimensions', 'timelineWidth']);
            const { min: minDate, max: maxDate } = getActivityTimeRange(lanes);
            const { min: selectedMinDate, max: selectedMaxDate } = withDefaults(
                this.props.state.get('selectedTimeRange'),
                { min: minDate, max: maxDate }
            ).toJS();
            const fullTime = d3.time.scale()
            .domain([minDate, maxDate])
            .range([0, width]);
            const selectedTime = d3.time.scale()
            .domain([selectedMinDate, selectedMaxDate])
            .range([0, width]);
            const phaseType = this.getPhaseTypeScale();
            const appType = this.getAppTypeScale();
            return { fullTime, selectedTime, phaseType, appType };
        },
        getPhaseTypeScale() {
            return d3.scale.ordinal()
                .range(util.colorBrewer.paired)
                .domain(this.props.state.get('phases').toArray());
        },
        getAppTypeScale() {
            return d3.scale.ordinal()
                .range(util.colorBrewer.set3)
                .domain(this.props.state.get('apps').toArray());
        },
        checkDimensions() {
            const dimensions = this.props.state.get('dimensions');
            if (this.refs.top) {
                const topHeight = this.refs.top.clientHeight;
                if (dimensions.get('topHeight') !== topHeight) {
                    this.props.action('set_top_height', topHeight);
                }
            }
            if (this.refs.bottom) {
                const bottomHeight = this.refs.bottom.clientHeight;
                if (dimensions.get('bottomHeight') !== bottomHeight) {
                    this.props.action('set_bottom_height', bottomHeight);
                }
            }
        },
        toggleStatusVisibility() {
            if (this.props.state.get('statusBarMinimized')) {
                this.props.action('maximize_status_bar');
            } else {
                this.props.action('minimize_status_bar');
            }
        },
    });

    activityStatistics.View = View;
})(golab.tools.activityStatistics);
