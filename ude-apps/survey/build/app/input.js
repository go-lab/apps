'use strict';

(function (ReflectionPoll) {
    ReflectionPoll.Input = React.createClass({
        displayName: 'Input',
        getDefaultProps: function getDefaultProps() {
            return {
                type: 'text',
                id: ReflectionPoll.util.uuid(),
                onChange: function onChange() {},
                onBlur: function onBlur() {}
            };
        },
        render: function render() {
            return React.createElement(
                'div',
                { className: 'form-group' },
                this.renderLabel(),
                this.renderInput()
            );
        },
        renderLabel: function renderLabel() {
            return React.createElement(
                'label',
                { htmlFor: this.props.id },
                this.props.label
            );
        },
        renderInput: function renderInput() {
            var props = {
                className: 'form-control',
                id: this.props.id,
                value: this.props.value,
                onChange: this.props.onChange,
                onBlur: this.props.onBlur
            };
            if (this.props.type === 'textarea') {
                return React.createElement('textarea', props);
            } else {
                props.type = this.props.type;
                return React.createElement('input', props);
            }
        }
    });
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=input.js.map
