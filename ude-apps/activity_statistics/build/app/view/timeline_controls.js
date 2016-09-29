'use strict';

(function (activityStatistics) {
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;
    var Button = activityStatistics.Button;

    var DaySeletor = createClass({
        displayName: 'DaySeletor',
        propTypes: {
            getMsg: PropTypes.func.isRequired,
            availableDays: PropTypes.object.isRequired,
            selectedDay: PropTypes.object.isRequired,
            onSelectedDayChange: PropTypes.func.isRequired
        },
        render: function render() {
            var dayOptions = this.props.availableDays.map(function (day) {
                return React.createElement(
                    'option',
                    {
                        key: day.getTime(),
                        value: day.getTime() },
                    moment(day).format('LL')
                );
            }).toArray();

            return React.createElement(
                'div',
                { className: 'form-group day_selection' },
                React.createElement(
                    'label',
                    { htmlFor: 'day_selector' },
                    this.props.getMsg('show_data_from')
                ),
                React.createElement(
                    'select',
                    {
                        className: 'form-control input-sm',
                        id: 'day_selector',
                        onChange: this.props.onSelectedDayChange,
                        value: this.props.selectedDay.getTime() },
                    dayOptions
                )
            );
        }
    });

    var TimelineControls = createClass({
        displayName: 'TimelineControls',
        propTypes: {
            action: PropTypes.func.isRequired,
            getMsg: PropTypes.func.isRequired,
            allLanesShowApps: PropTypes.bool.isRequired,
            allLanesMaximized: PropTypes.bool.isRequired,
            availableDays: PropTypes.object.isRequired,
            selectedDay: PropTypes.object.isRequired
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(nextProps.allLanesShowApps === this.props.allLanesShowApps && nextProps.allLanesMaximized === this.props.allLanesMaximized && nextProps.availableDays.equals(this.props.availableDays) && R.propEq('selectedDay', nextProps, this.props));
        },
        render: function render() {
            var _props = this.props;
            var availableDays = _props.availableDays;
            var selectedDay = _props.selectedDay;
            var getMsg = _props.getMsg;

            return React.createElement(
                'div',
                { className: 'timeline_controls' },
                this.renderToggleAppsBtn(),
                this.renderMinimizeLanesBtn(),
                React.createElement(DaySeletor, {
                    getMsg: getMsg,
                    availableDays: availableDays,
                    selectedDay: selectedDay,
                    onSelectedDayChange: this.onSelectedDayChange
                })
            );
        },
        renderToggleAppsBtn: function renderToggleAppsBtn() {
            var btnClass = classNames(this.baseBtnClass, {
                'active': this.props.allLanesShowApps
            });
            return React.createElement(Button, {
                active: this.props.allLanesShowApps,
                onClick: this.onShowAppsClick,
                glyphicon: 'text-background',
                label: this.props.getMsg('show_app_activities')
            });
        },
        renderMinimizeLanesBtn: function renderMinimizeLanesBtn() {
            var _props2 = this.props;
            var getMsg = _props2.getMsg;
            var allLanesMaximized = _props2.allLanesMaximized;

            var label = getMsg('maximize_timelines');
            var glyphicon = 'eye-close';
            if (allLanesMaximized) {
                label = getMsg('minimize_timelines');
                glyphicon = 'eye-open';
            }
            return React.createElement(Button, {
                active: true,
                onClick: this.onToggleMinimizationClick,
                glyphicon: glyphicon,
                label: label
            });
        },
        onSelectedDayChange: function onSelectedDayChange(event) {
            this.props.action('set_selected_day', new Date(parseInt(event.target.value, 10)));
        },
        onShowAppsClick: function onShowAppsClick() {
            this.props.action('set_show_app_activities', !this.props.allLanesShowApps);
        },
        onToggleMinimizationClick: function onToggleMinimizationClick() {
            if (this.props.allLanesMaximized) {
                this.props.action('minimize_all_lanes');
            } else {
                this.props.action('maximize_all_lanes');
            }
        },
        baseBtnClass: classNames({
            'btn': true,
            'btn-flat': true
        })
    });

    activityStatistics.TimelineControls = TimelineControls;
})(golab.tools.activityStatistics);
//# sourceMappingURL=timeline_controls.js.map
