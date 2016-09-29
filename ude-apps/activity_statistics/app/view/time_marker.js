((activityStatistics) => {
    const { PropTypes, createClass } = React;

    activityStatistics.TimeMarker = createClass({
        propTypes: {
            x: PropTypes.number,
            offset: PropTypes.number
        },
        getDefaultProps() {
            return { offset: 0 };
        },
        shouldComponentUpdate(nextProps) {
            return !R.equals(nextProps, this.props);
        },
        render() {
            let line = null;
            if (this.props.x !== null) {
                const x = this.props.offset + this.props.x;
                line = <line x1={x} x2={x} y1={0} y2={10000} />;
            }
            return (
                <svg className='marker'>
                    {line}
                </svg>
            );
        },
    });
})(golab.tools.activityStatistics);
