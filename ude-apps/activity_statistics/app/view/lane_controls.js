((activityStatistics) => {
    const { PropTypes, createClass } = React;

    const LaneControls = createClass({
        displayName: 'LaneControls',
        propTypes: {
            isMinimized: PropTypes.bool.isRequired,
            username: PropTypes.string.isRequired,
            action: PropTypes.func.isRequired,
            getMsg: PropTypes.func.isRequired,
        },
        shouldComponentUpdate(nextProps) {
            return !(
                R.eqProps('username', nextProps, this.props) &&
                R.eqProps('isMinimized', nextProps, this.props)
             );
        },
        render() {
            const { isMinimized } = this.props;
            const btnClass = classNames({
                'btn': true,
                'btn-flat': true,
                'btn-xs': true,
            });
            const icon = `glyphicon-eye-${isMinimized ? 'open' : 'close'}`;

            return (
                <div className='controls'>
                    <button
                        className={btnClass}
                        onClick={this.onToggleClick}>
                        <i className={`glyphicon ${icon}`}></i>
                        <span className='sr-only'>{this.props.getMsg('minimize_this_timeline')}</span>
                    </button>
                </div>
            );
        },
        onToggleClick() {
            if (this.props.isMinimized) {
                this.props.action('maximize_lane', this.props.username);
            } else {
                this.props.action('minimize_lane', this.props.username);
            }
        }
    });

    activityStatistics.LaneControls = LaneControls;
})(golab.tools.activityStatistics);
