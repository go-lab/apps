((activityStatistics) => {
    const { PropTypes, createClass } = React;
    const { Button } = activityStatistics;

    const DaySeletor = createClass({
        displayName: 'DaySeletor',
        propTypes: {
            getMsg: PropTypes.func.isRequired,
            availableDays: PropTypes.object.isRequired,
            selectedDay: PropTypes.object.isRequired,
            onSelectedDayChange: PropTypes.func.isRequired,
        },
        render() {
            const dayOptions = this.props.availableDays.map((day) => (
                <option
                    key={day.getTime()}
                    value={day.getTime()}>
                    {moment(day).format('LL')}
                </option>
            )).toArray();

            return (
                <div className='form-group day_selection'>
                    <label htmlFor='day_selector'>{this.props.getMsg('show_data_from')}</label>
                    <select
                        className='form-control input-sm'
                        id='day_selector'
                        onChange={this.props.onSelectedDayChange}
                        value={this.props.selectedDay.getTime()}>
                        {dayOptions}
                    </select>
                </div>
            );
        },
    });

    const TimelineControls = createClass({
        displayName: 'TimelineControls',
        propTypes: {
            action: PropTypes.func.isRequired,
            getMsg: PropTypes.func.isRequired,
            allLanesShowApps: PropTypes.bool.isRequired,
            allLanesMaximized: PropTypes.bool.isRequired,
            availableDays: PropTypes.object.isRequired,
            selectedDay: PropTypes.object.isRequired,
        },
        shouldComponentUpdate(nextProps) {
            return !(
                nextProps.allLanesShowApps === this.props.allLanesShowApps &&
                nextProps.allLanesMaximized === this.props.allLanesMaximized &&
                nextProps.availableDays.equals(this.props.availableDays) &&
                R.propEq('selectedDay', nextProps, this.props)
            );
        },
        render() {
            const { availableDays, selectedDay, getMsg } = this.props;
            return (
                <div className='timeline_controls'>
                    {this.renderToggleAppsBtn()}
                    {this.renderMinimizeLanesBtn()}
                    <DaySeletor
                        getMsg={getMsg}
                        availableDays={availableDays}
                        selectedDay={selectedDay}
                        onSelectedDayChange={this.onSelectedDayChange}
                    />
                </div>
            );
        },
        renderToggleAppsBtn() {
            const btnClass = classNames(this.baseBtnClass, {
                'active': this.props.allLanesShowApps,
            });
            return (
                <Button
                    active={this.props.allLanesShowApps}
                    onClick={this.onShowAppsClick}
                    glyphicon='text-background'
                    label={this.props.getMsg('show_app_activities')}
                />
            );
        },
        renderMinimizeLanesBtn() {
            const { getMsg, allLanesMaximized } = this.props;
            let label = getMsg('maximize_timelines');
            let glyphicon = 'eye-close';
            if (allLanesMaximized) {
                label = getMsg('minimize_timelines');
                glyphicon = 'eye-open';
            }
            return (
                <Button
                    active={true}
                    onClick={this.onToggleMinimizationClick}
                    glyphicon={glyphicon}
                    label={label}
                />
            );
        },
        onSelectedDayChange(event) {
            this.props.action('set_selected_day', new Date(parseInt(event.target.value, 10)));
        },
        onShowAppsClick() {
            this.props.action('set_show_app_activities', !this.props.allLanesShowApps);
        },
        onToggleMinimizationClick() {
            if (this.props.allLanesMaximized) {
                this.props.action('minimize_all_lanes');
            } else {
                this.props.action('maximize_all_lanes');
            }
        },
        baseBtnClass: classNames({
            'btn': true,
            'btn-flat': true,
        })
    });

    activityStatistics.TimelineControls = TimelineControls;
})(golab.tools.activityStatistics);
