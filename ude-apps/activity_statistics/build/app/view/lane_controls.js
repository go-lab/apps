'use strict';

(function (activityStatistics) {
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;

    var LaneControls = createClass({
        displayName: 'LaneControls',
        propTypes: {
            isMinimized: PropTypes.bool.isRequired,
            username: PropTypes.string.isRequired,
            action: PropTypes.func.isRequired,
            getMsg: PropTypes.func.isRequired
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(R.eqProps('username', nextProps, this.props) && R.eqProps('isMinimized', nextProps, this.props));
        },
        render: function render() {
            var isMinimized = this.props.isMinimized;

            var btnClass = classNames({
                'btn': true,
                'btn-flat': true,
                'btn-xs': true
            });
            var icon = 'glyphicon-eye-' + (isMinimized ? 'open' : 'close');

            return React.createElement(
                'div',
                { className: 'controls' },
                React.createElement(
                    'button',
                    {
                        className: btnClass,
                        onClick: this.onToggleClick },
                    React.createElement('i', { className: 'glyphicon ' + icon }),
                    React.createElement(
                        'span',
                        { className: 'sr-only' },
                        this.props.getMsg('minimize_this_timeline')
                    )
                )
            );
        },
        onToggleClick: function onToggleClick() {
            if (this.props.isMinimized) {
                this.props.action('maximize_lane', this.props.username);
            } else {
                this.props.action('minimize_lane', this.props.username);
            }
        }
    });

    activityStatistics.LaneControls = LaneControls;
})(golab.tools.activityStatistics);
//# sourceMappingURL=lane_controls.js.map
