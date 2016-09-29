'use strict';

(function (activityStatistics) {
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;

    activityStatistics.TimeMarker = createClass({
        propTypes: {
            x: PropTypes.number,
            offset: PropTypes.number
        },
        getDefaultProps: function getDefaultProps() {
            return { offset: 0 };
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !R.equals(nextProps, this.props);
        },
        render: function render() {
            var line = null;
            if (this.props.x !== null) {
                var x = this.props.offset + this.props.x;
                line = React.createElement('line', { x1: x, x2: x, y1: 0, y2: 10000 });
            }
            return React.createElement(
                'svg',
                { className: 'marker' },
                line
            );
        }
    });
})(golab.tools.activityStatistics);
//# sourceMappingURL=time_marker.js.map
