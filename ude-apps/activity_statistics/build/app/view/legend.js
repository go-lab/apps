'use strict';

(function (activityStatistics) {
    var scaleEquals = activityStatistics.util.scaleEquals;
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;

    var Legend = createClass({
        displayName: 'Legend',
        propTypes: {
            scale: PropTypes.func.isRequired,
            shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'triangle-down', 'triangle-up']),
            highlightedItem: PropTypes.string,
            highlightAction: PropTypes.func,
            dehighlightAction: PropTypes.func
        },
        getDefaultProps: function getDefaultProps() {
            return {
                highlightedItem: '',
                highlightAction: function highlightAction() {},
                dehighlightAction: function dehighlightAction() {}
            };
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(nextProps.shape === this.props.shape && nextProps.highlightedItem === this.props.highlightedItem && scaleEquals(nextProps.scale, this.props.scale));
        },
        render: function render() {
            return React.createElement(
                'svg',
                { width: '100%', height: '100', ref: 'svg', className: 'legend' },
                React.createElement('g', null)
            );
        },
        update: function update() {
            var _this = this;

            var svg = d3.select(this.refs.svg);
            var g = svg.select('g');
            var highlightedItem = this.props.highlightedItem;

            var legend = d3.legend.color().scale(this.props.scale).shapePadding(5);
            var padding = { x: 0, y: 0 };

            if (this.props.shape) {
                legend = legend.shape('path', d3.svg.symbol().type(this.props.shape).size(100)());
                padding = { x: 10, y: 5 };
                g.attr('transform', 'translate(' + padding.x + ', ' + padding.y + ')');
            }

            legend.on('cellclick', function (item) {
                // this.getHighlightedItem is a workaround to this function not
                // being rebound on update, so higlightedItem doesn't change
                if (_this.getHighlightedItem() !== item) {
                    _this.props.highlightAction(item);
                } else {
                    _this.props.dehighlightAction();
                }
            });

            g.call(legend);

            g.selectAll('.cell').each(function (item) {
                d3.select(this).classed('active', item === highlightedItem);
            });

            var dimensions = g[0][0].getBBox();
            svg.attr('width', dimensions.width + padding.x).attr('height', dimensions.height + padding.y);
        },
        getHighlightedItem: function getHighlightedItem() {
            return this.props.highlightedItem;
        },
        componentDidMount: function componentDidMount() {
            this.update();
        },
        componentDidUpdate: function componentDidUpdate() {
            this.update();
        }
    });

    activityStatistics.Legend = Legend;
})(golab.tools.activityStatistics);
//# sourceMappingURL=legend.js.map
