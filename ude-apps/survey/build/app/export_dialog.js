'use strict';

(function (ReflectionPoll) {
    ReflectionPoll.ExportDialog = function ExportDialog(getMsg) {
        var modal = ReflectionPoll.Modal('export', getMsg);
        var textContainer = getTextContainer();

        textContainer.on('focus click', function () {
            textContainer[0].focus();
            textContainer[0].select();
        });

        modal.setHeading(getMsg('export_poll_config'));

        return {
            show: function show(pollDataString) {
                var explanation = $('<p />').text(getMsg('export_explanation'));
                textContainer.text(pollDataString);
                modal.setBody($('<div />').append([explanation, textContainer]));
                modal.open();
            }
        };

        function getTextContainer() {
            return $('<textarea />').attr('class', 'form-control').attr('readonly', true);
        }
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=export_dialog.js.map
