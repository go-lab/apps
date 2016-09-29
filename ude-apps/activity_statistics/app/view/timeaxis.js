((activityStatistics) => {
    const { PropTypes, createClass } = React;
    const { scaleEquals } = activityStatistics.util;

    const Timeaxis = createClass({
        displayName: 'Timeaxis',
        propTypes: {
            scale: PropTypes.func.isRequired,
            width: PropTypes.number
        },
        shouldComponentUpdate(nextProps) {
            return !(
                nextProps.width !== this.props.width &&
                scaleEquals(nextProps.scale, this.props.scale)
            );
        },
        render() {
            return (
                <svg
                    width={this.props.width || 100}
                    height='30'
                    ref='axis'
                    id='timeaxis'>
                </svg>
            );
        },
        update() {
            const svg = d3.select(this.refs.axis);
            const axis = this.axis.scale(this.props.scale);
            svg.call(axis);
        },
        componentDidMount() {
            this.axis = d3.svg.axis().tickSize(10, 1).orient('bottom');
            this.update();
        },
        componentDidUpdate() {
            this.update();
        },
    });

    activityStatistics.Timeaxis = Timeaxis;
})(golab.tools.activityStatistics);
