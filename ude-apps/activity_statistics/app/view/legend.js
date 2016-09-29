((activityStatistics) => {
    const { scaleEquals } = activityStatistics.util;
    const { PropTypes, createClass } = React;
    const Legend = createClass({
        displayName: 'Legend',
        propTypes: {
            scale: PropTypes.func.isRequired,
            shape: PropTypes.oneOf([
                'circle', 'cross', 'diamond', 'square', 'triangle-down',
                'triangle-up',
            ]),
            highlightedItem: PropTypes.string,
            highlightAction: PropTypes.func,
            dehighlightAction: PropTypes.func,
        },
        getDefaultProps() {
            return {
                highlightedItem: '',
                highlightAction: () => {},
                dehighlightAction: () => {},
            };
        },
        shouldComponentUpdate(nextProps) {
            return !(
                nextProps.shape === this.props.shape &&
                nextProps.highlightedItem === this.props.highlightedItem &&
                scaleEquals(nextProps.scale, this.props.scale)
            );
        },
        render() {
            return (
                <svg width='100%' height='100' ref='svg' className='legend'>
                    <g></g>
                </svg>
            );
        },
        update() {
            const svg = d3.select(this.refs.svg);
            const g = svg.select('g');
            const { highlightedItem } = this.props;
            let legend = d3.legend.color()
            .scale(this.props.scale)
            .shapePadding(5);
            let padding = { x: 0, y: 0 };

            if (this.props.shape) {
                legend = legend.shape(
                    'path',
                    d3.svg.symbol().type(this.props.shape).size(100)()
                );
                padding = { x: 10, y: 5 };
                g.attr('transform', `translate(${padding.x}, ${padding.y})`);
            }

            legend.on('cellclick', (item) => {
                // this.getHighlightedItem is a workaround to this function not
                // being rebound on update, so higlightedItem doesn't change
                if (this.getHighlightedItem() !== item) {
                    this.props.highlightAction(item);
                } else {
                    this.props.dehighlightAction();
                }
            });

            g.call(legend);

            g.selectAll('.cell').each(function(item) {
                d3.select(this).classed('active', item === highlightedItem);
            });

            const dimensions = g[0][0].getBBox();
            svg
            .attr('width', dimensions.width + padding.x)
            .attr('height', dimensions.height + padding.y);

        },
        getHighlightedItem() {
            return this.props.highlightedItem;
        },
        componentDidMount() {
            this.update();
        },
        componentDidUpdate() {
            this.update();
        },
    });

    activityStatistics.Legend = Legend;
})(golab.tools.activityStatistics);
