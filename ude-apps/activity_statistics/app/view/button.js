((activityStatistics) => {
    const { createClass, propTypes } = React;

    activityStatistics.Button = createClass({
        displayName: 'Button',
        getDefaultProps() {
            return {
                id: '',
                className: '',
                label: '',
                glyphicon: null,
                active: false,
                onClick: () => {},
                screenReaderOnlyLabel: false,
            };
        },
        render() {
            const { active, onClick, label } = this.props;
            const btnClass = classNames({
                'btn': true,
                'btn-flat': true,
                active,
            })
            return (
                <button className={btnClass} onClick={onClick}>
                    {this.renderIcon()} {this.renderLabel()}
                </button>
            );
        },
        renderIcon() {
            const { glyphicon } = this.props;
            if (! glyphicon) {
                return null;
            }
            return (
                <i className={`glyphicon glyphicon-${glyphicon}`}></i>
            );
        },
        renderLabel() {
            const className = classNames({
                'sr-only': this.props.screenReaderOnlyLabel,
            });
            return <span className={className}>{this.props.label}</span>
        },
    });
})(golab.tools.activityStatistics);

