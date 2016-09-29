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

            return $('<div class="form-group"/>').append(conceptExtraction());

            function conceptExtraction() {

                var extractionConfigPanel = $('<div id="extractorSelectionDiv" class="panel panel-default"></div>')
                    .append($('<div class="panel-heading"></div>')
                        .append('<h3 class="panel-title">Concept extractors:</h3>'))
                    .append('<div class="panel-body"></div>');

                var panelBody = extractionConfigPanel.find('.panel-body');

                var artifactSources = starterApp.configHandler.getEntry("artifactSources");


                for(var i = 0; i < artifactSources.length; i++) {

                    var appName = artifactSources[i].appName;
                    var extractors = artifactSources[i].extractors;
                    var preferredPos = artifactSources[i].preferred;

                    var appExtractorDiv = $('<div class="appExtractorDiv"></div>')
                        .append('<h4>App: ' + '<span class="appName">' +appName +'</span></h4>')
                        .append('<p>Extractor: <span class="selectedExtractor">'+ extractors[preferredPos] +'</span></p>');

                    if(extractors.length > 1) {

                        var extractorDropDown = $('<div class="dropdown"></div>')
                            .append($('<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></button>')
                                .append('Change' + '<span class="caret"></span>'))
                            .append($('<ul class="dropdown-menu"></ul>'));

                        var ul = extractorDropDown.find('ul');
                        ul.attr('aria-labelledby',extractorDropDown.find('button'));

                        for(var x=0; x<extractors.length; x++){

                            var li = $('<li><a href="#">'+ extractors[x] +'</a></li>');

                            if(x==preferredPos)
                            {
                                li.hide();
                            }

                            li.click(function() {

                                var li = $(this);

                                var extractorSpan = li.closest('div').prev('p').find('span');
                                var oldExtractor = extractorSpan.text().trim();

                                var selectedExtractor = li.find('a').text().trim();

                                extractorSpan.text(selectedExtractor);
                                li.find('a').text(oldExtractor);

                            });

                            ul.append(li);
                        }

                        appExtractorDiv.append(extractorDropDown);

                    }

                    panelBody.append(appExtractorDiv);

                    if(i!=(artifactSources.length - 1))
                        panelBody.append('<hr>');

                }

                return extractionConfigPanel;
            }

        }

        function initialize() {

            modal.modal({
                show: false,
            });

            modal.find('.modal-footer').append([resetButton(), ' ', saveButton()]);

            modal.on('click', 'button.save', function(event) {
                event.preventDefault();

                var extractorSelectionDiv = $('#extractorSelectionDiv');
                var panelBody = extractorSelectionDiv.find('.panel-body');
                var appExtractorDivs = panelBody.find('.appExtractorDiv');
                var appNames = [];
                var selectedExtractor = [];

                appExtractorDivs.find('.appName').each(function() {
                    appNames.push($(this).text());
                });

                appExtractorDivs.find('.selectedExtractor').each(function() {
                    selectedExtractor.push($(this).text());
                });


                var artifactSourcesConfig = starterApp.configHandler.getEntry("artifactSources");

                for(var i=0; i < artifactSourcesConfig.length; i++) {

                    var configAppName = artifactSourcesConfig[i].appName;
                    var configExtractors = artifactSourcesConfig[i].extractors;

                    for(var x=0; x < appNames.length; x++){

                        if(configAppName == appNames[x]){


                            var newPos;

                            for(var s=0; s < configExtractors.length; s++){

                                if(configExtractors[s] == selectedExtractor[x]) {
                                    newPos = s;
                                }

                            }

                            artifactSourcesConfig[i].preferred = newPos;

                        }

                    }

                }


                var newConfig = {
                    artifactSources: artifactSourcesConfig
                };

                console.log("New Config:");
                console.log(JSON.stringify(newConfig));

                starterApp.configHandler.writeConfig(newConfig, function() {
                    console.log("callback writeConfig");
                });

                hide();

            });

            modal.on('click', 'button.reset', function(event) {
                event.preventDefault();
                var userIsSure = confirm(
                    languageHandler.getMessage('config_reset_confirmation'));
                if (userIsSure) {
                    //resetEvents.publish();

                    starterApp.configHandler.resetToDefaultConfig(function(error) {
                        if(error){
                            console.log("Could not reset Config");
                        }
                        else {
                            hide();
                            show();
                        }
                    });

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
