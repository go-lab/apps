(function(starterApp) {
    starterApp.ConfigDialog = ConfigDialog;

    function ConfigDialog(modal, languageHandler) {
        modal = $(modal);
        var saveEvents = starterApp.PubSub();
        var resetEvents = starterApp.PubSub();
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
            var label = $('<label for="default_post_title"></label>').text(
                languageHandler.getMessage('default_post_title'));
            var input = $('<input />').attr({
                'id': 'default_post_title',
                'type': 'text',
                'value': config.defaultTitle,
                'class': 'form-control',
            });
            return $('<div class="form-group" />').append([label, input]);
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
})(golab.tools.starterApp);
