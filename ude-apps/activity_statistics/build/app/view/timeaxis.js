'use strict';

(function (activityStatistics) {
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;
    var scaleEquals = activityStatistics.util.scaleEquals;

    var Timeaxis = createClass({
        displayName: 'Timeaxis',
        propTypes: {
            scale: PropTypes.func.isRequired,
            width: PropTypes.number
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(nextProps.width !== this.props.width && scaleEquals(nextProps.scale, this.props.scale));
        },
        render: function render() {
            return React.createElement('svg', {
                width: this.props.width || 100,
                height: '30',
                ref: 'axis',
                id: 'timeaxis' });
        },
        update: function update() {
            var svg = d3.select(this.refs.axis);
            var axis = this.axis.scale(this.props.scale);
            svg.call(axis);
        },
        componentDidMount: function componentDidMount() {
            this.axis = d3.svg.axis().tickSize(10, 1).orient('bottom');
            this.update();
        },
        componentDidUpdate: function componentDidUpdate() {
            this.update();
        }
    });

    activityStatistics.Timeaxis = Timeaxis;
})(golab.tools.activityStatistics);
//# sourceMappingURL=timeaxis.js.map
