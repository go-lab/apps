(function(ReflectionPoll) {
    ReflectionPoll.Input = React.createClass({
        displayName: 'Input',
        getDefaultProps: function() {
            return {
                type: 'text',
                id: ReflectionPoll.util.uuid(),
                onChange: function() {},
                onBlur: function() {},
            };
        },
        render: function() {
            return (
                <div className='form-group'>
                    {this.renderLabel()}
                    {this.renderInput()}
                </div>
            );
        },
        renderLabel: function() {
            return <label htmlFor={this.props.id}>{this.props.label}</label>;
        },
        renderInput: function() {
            let props = {
                className: 'form-control',
                id: this.props.id,
                value: this.props.value,
                onChange: this.props.onChange,
                onBlur: this.props.onBlur,
            };
            if (this.props.type === 'textarea') {
                return <textarea {...props} />;
            } else {
                props.type = this.props.type;
                return <input {...props} />;
            }
        }
    });
})(golab.tools.ReflectionPoll);
