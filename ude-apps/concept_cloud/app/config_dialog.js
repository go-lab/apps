(function(conceptCloud) {
    conceptCloud.ConfigDialog = ConfigDialog;

    function ConfigDialog(modal, languageHandler) {
        modal = $(modal);
        var saveEvents = conceptCloud.PubSub();
        var resetEvents = conceptCloud.PubSub();
        translateMarkup();
        initialize();

        return {
            show: show,
            hide: hide,
            onSave: saveEvents.subscribe,
            onReset: resetEvents.subscribe,
        };

        function show(config) {
            modal.find('.modal-body').empty().append(configForm(config));
            modal.modal('show');
        }

        function hide() {
            modal.modal('hide');
        }

        function configForm(config) {
            var label_reflection = $('<label for="reflection_checkbox" class="reflection"></label>').text(languageHandler.getMessage('reflection_label'));
            var input_reflection = $('<input>').attr({
                                        'id': 'reflection_checkbox',
                                        'class': 'reflection',
                                        'type': 'checkbox',
                                        'checked': config.reflection
                                    });
            var description_reflection = $('<div>').attr({'class':'description reflection'}).text(languageHandler.getMessage('reflection_description'));
            var reflection = $('<div>').attr({'class':'input-group'}).append([label_reflection], input_reflection, description_reflection);

            var label_timeOffset = $('<label for="timeOffset_range" class="timeOffset"></label>').text(languageHandler.getMessage('timeOffset_label'));
            var input_timeOffset = $('<input />').attr({
                'id':'timeOffset',
                'class':'timeOffset',
                'type':'text',
                'aria-describedby':'timeOffset_addon',
                'value': config.timeOffset/60000
            });


            var description_timeOffset = $('<div>').attr({'class':'description timeOffset'}).text(languageHandler.getMessage('timeOffset_description'));

            var timeOffset = $('<div>').attr({'class':'input-group'}).append([label_timeOffset, input_timeOffset, description_timeOffset]);


            return $('<div class="form-group" />').append(reflection).append(timeOffset);
        }

        function initialize() {
            modal.modal({
                show: false,
            });
            modal.find('.modal-footer').append([resetButton(), ' ', saveButton()]);
            modal.on('click', 'button.save', function(event) {

                event.preventDefault();
                saveEvents.publish({
                    defaultTitle: $('#default_post_title').val(),
                    reflection: $('#reflection_checkbox').prop('checked'),
                    timeOffset: ($('#timeOffset').val()*60000)
                });
            });
            modal.on('click', 'button.reset', function(event) {
                event.preventDefault();
                var userIsSure = confirm(
                    languageHandler.getMessage('config_reset_confirmation'));
                if (userIsSure) {
                    resetEvents.publish();
                }
            });
        }

        function resetButton() {
            var label = languageHandler.getMessage('reset_to_default');
            return $('<button class="btn btn-default reset" type="button" role="button" />')
                .append($('<span class="glyphicon glyphicon-undo" />'))
                .append($('<span />').text(' ' + label));
        }

        function saveButton() {
            var label = languageHandler.getMessage('save');
            return $('<button class="btn btn-primary save" type="submit" role="button" />')
                .append($('<span class="glyphicon glyphicon-save"></span>'))
                .append($('<span />').text(' ' + label));
        }


        function translateMarkup() {
            modal.find('#posts_list_label')
                .text(languageHandler.getMessage('configuration'));
            modal.find('.modal-header button')
                .attr('aria-label', languageHandler.getMessage('close'));
        }
    }
})(golab.tools.conceptCloud);