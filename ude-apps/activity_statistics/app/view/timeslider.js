((activityStatistics) => {
    const { PropTypes, createClass } = React;
    const { scaleEquals } = activityStatistics.util;
    const mapTime = R.map((d) => d.getTime());
    const ONE_MINUTE = 60 * 1000;

    const Timeslider = createClass({
        displayName: 'Timeslider',
        propTypes: {
            selectedScale: PropTypes.func.isRequired,
            fullScale: PropTypes.func.isRequired,
            action: PropTypes.func.isRequired,
            width: PropTypes.number,
        },
        shouldComponentUpdate(nextProps) {
            return !(
                scaleEquals(nextProps.selectedScale, this.props.selectedScale) &&
                scaleEquals(nextProps.fullScale, this.props.fullScale) &&
                nextProps.width === this.props.width
            );
        },
        render() {
            return (
                <div id='timeslider'>
                    <input
                        type='text'
                        ref='slider'
                        style={{ width: this.props.width || 100 }}
                    />
                </div>
            );
        },
        componentDidMount() {
            const input = this.refs.slider;

            this.slider = new Slider(input, {
                range: true,
                step: ONE_MINUTE,
                tooltip: 'hide',
            });

            this.update();
        },
        componentDidUpdate() {
            this.update();
        },
        update() {
            const [start, end] = mapTime(this.props.fullScale.domain());
            const [selectedStart, selectedEnd] = mapTime(this.props.selectedScale.domain());

            this.slider.setAttribute('min', start);
            this.slider.setAttribute('max', end);
            this.slider.setValue([selectedStart, selectedEnd]);
            this.slider.refresh();
            this.slider.on('change', this.onSliderChange);
        },
        onSliderChange({ oldValue, newValue }) {
            const noChange = oldValue[0] === newValue[0] &&
                             oldValue[1] === newValue[1];
            if (noChange) return;

            let min = newValue[0];
            let max = newValue[1];
            const [start, end] = mapTime(this.props.fullScale.domain());
            if (min <= start) {
                min = null;
            }
            if (max >= end) {
                max = null;
            }
            this.props.action('set_time_selection', { min, max });
        },
    });

    activityStatistics.Timeslider = Timeslider;
})(golab.tools.activityStatistics);
