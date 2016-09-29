'use strict';

(function (activityStatistics) {
    var _React = React;
    var createClass = _React.createClass;
    var propTypes = _React.propTypes;

    activityStatistics.Button = createClass({
        displayName: 'Button',
        getDefaultProps: function getDefaultProps() {
            return {
                id: '',
                className: '',
                label: '',
                glyphicon: null,
                active: false,
                onClick: function onClick() {},
                screenReaderOnlyLabel: false
            };
        },
        render: function render() {
            var _props = this.props;
            var active = _props.active;
            var onClick = _props.onClick;
            var label = _props.label;

            var btnClass = classNames({
                'btn': true,
                'btn-flat': true,
                active: active
            });
            return React.createElement(
                'button',
                { className: btnClass, onClick: onClick },
                this.renderIcon(),
                ' ',
                this.renderLabel()
            );
        },
        renderIcon: function renderIcon() {
            var glyphicon = this.props.glyphicon;

            if (!glyphicon) {
                return null;
            }
            return React.createElement('i', { className: 'glyphicon glyphicon-' + glyphicon });
        },
        renderLabel: function renderLabel() {
            var className = classNames({
                'sr-only': this.props.screenReaderOnlyLabel
            });
            return React.createElement(
                'span',
                { className: className },
                this.props.label
            );
        }
    });
})(golab.tools.activityStatistics);
//# sourceMappingURL=button.js.map
