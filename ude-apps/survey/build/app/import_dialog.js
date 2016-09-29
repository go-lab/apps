'use strict';

(function (ReflectionPoll) {
    ReflectionPoll.ImportDialog = function ImportDialog(getMsg) {
        var modal = ReflectionPoll.Modal('import', getMsg);
        var importEvents = ReflectionPoll.PubSub();
        var pollDataInput = undefined;

        modal.setHeading(getMsg('export_poll_config'));
        modal.setFooter(getTools());

        return {
            show: function show() {
                var explanation = $('<p />').text(getMsg('import_explanation'));
                pollDataInput = getPollDataInput();
                modal.setBody($('<div />').append([explanation, pollDataInput]));
                modal.open();
            },
            onImport: importEvents.subscribe
        };

        function getPollDataInput() {
            return $('<textarea />').attr('class', 'form-control');
        }

        function getTools() {
            var cancelBtn = $('<button />').attr({
                'class': 'btn btn-default'
            }).on('click', modal.close).text(getMsg('cancel'));

            var importBtn = $('<button />').attr({
                'class': 'btn btn-primary'
            }).on('click', onImportClick).text(getMsg('import_poll'));

            return $('<div />').append([cancelBtn, importBtn]);
        }

        function onImportClick() {
            modal.close();
            importEvents.publish(getPollData());
        }

        function getPollData() {
            if (!pollDataInput) {
                throw new Error('Poll data import input not rendered yet.');
            }
            return pollDataInput.val();
        }
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=import_dialog.js.map
