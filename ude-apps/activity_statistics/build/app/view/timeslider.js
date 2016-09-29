'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function (activityStatistics) {
    var _React = React;
    var PropTypes = _React.PropTypes;
    var createClass = _React.createClass;
    var scaleEquals = activityStatistics.util.scaleEquals;

    var mapTime = R.map(function (d) {
        return d.getTime();
    });
    var ONE_MINUTE = 60 * 1000;

    var Timeslider = createClass({
        displayName: 'Timeslider',
        propTypes: {
            selectedScale: PropTypes.func.isRequired,
            fullScale: PropTypes.func.isRequired,
            action: PropTypes.func.isRequired,
            width: PropTypes.number
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
            return !(scaleEquals(nextProps.selectedScale, this.props.selectedScale) && scaleEquals(nextProps.fullScale, this.props.fullScale) && nextProps.width === this.props.width);
        },
        render: function render() {
            return React.createElement(
                'div',
                { id: 'timeslider' },
                React.createElement('input', {
                    type: 'text',
                    ref: 'slider',
                    style: { width: this.props.width || 100 }
                })
            );
        },
        componentDidMount: function componentDidMount() {
            var input = this.refs.slider;

            this.slider = new Slider(input, {
                range: true,
                step: ONE_MINUTE,
                tooltip: 'hide'
            });

            this.update();
        },
        componentDidUpdate: function componentDidUpdate() {
            this.update();
        },
        update: function update() {
            var _mapTime = mapTime(this.props.fullScale.domain());

            var _mapTime2 = _slicedToArray(_mapTime, 2);

            var start = _mapTime2[0];
            var end = _mapTime2[1];

            var _mapTime3 = mapTime(this.props.selectedScale.domain());

            var _mapTime32 = _slicedToArray(_mapTime3, 2);

            var selectedStart = _mapTime32[0];
            var selectedEnd = _mapTime32[1];

            this.slider.setAttribute('min', start);
            this.slider.setAttribute('max', end);
            this.slider.setValue([selectedStart, selectedEnd]);
            this.slider.refresh();
            this.slider.on('change', this.onSliderChange);
        },
        onSliderChange: function onSliderChange(_ref) {
            var oldValue = _ref.oldValue;
            var newValue = _ref.newValue;

            var noChange = oldValue[0] === newValue[0] && oldValue[1] === newValue[1];
            if (noChange) return;

            var min = newValue[0];
            var max = newValue[1];

            var _mapTime4 = mapTime(this.props.fullScale.domain());

            var _mapTime42 = _slicedToArray(_mapTime4, 2);

            var start = _mapTime42[0];
            var end = _mapTime42[1];

            if (min <= start) {
                min = null;
            }
            if (max >= end) {
                max = null;
            }
            this.props.action('set_time_selection', { min: min, max: max });
        }
    });

    activityStatistics.Timeslider = Timeslider;
})(golab.tools.activityStatistics);
//# sourceMappingURL=timeslider.js.map
