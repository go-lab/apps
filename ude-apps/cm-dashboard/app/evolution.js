
function evolutionJSON(AN, AR, AD, NC, languageHandler) {


    var logsAN = [];
    var namesAN = [];
    for (var j = 0; j < AN.length; j++) {
        AN[j].log = MG.convert.date(AN[j].log, 'date', '%Y-%m-%dT%H:%M:%S.%LZ'); //bring isoDate:String in the right d3.Format than MG can visualize
        logsAN.push(AN[j].log);
        namesAN.push(AN[j].name);
    }

    var logsAR = [];
    var namesAR = [];
    for (var o = 0; o < AR.length; o++) {
        AR[o].log = MG.convert.date(AR[o].log, 'date', '%Y-%m-%dT%H:%M:%S.%LZ');
        logsAR.push(AR[o].log);
        namesAR.push(AR[o].name);
    }

    var logsAD = [];
    var namesAD = [];
    for (var i = 0; i < AD.length; i++) {
        AD[i].log = MG.convert.date(AD[i].log, 'date', '%Y-%m-%dT%H:%M:%S.%LZ');
        logsAD.push(AD[i].log);
        namesAD.push(AD[i].name);
    }

    var logsNC = [];
    var namesNC = [];
    for (var r = 0; r < NC.length; r++) {
        NC[r].log = MG.convert.date(NC[r].log, 'date', '%Y-%m-%dT%H:%M:%S.%LZ');
        logsNC.push(NC[r].log);
        namesNC.push(NC[r].name);
    }


    $('input[name=radioEvolution]').on("click", function () {
        if ($('#AN').is(':checked')) {
            visualizeAN(logsAN, namesAN);
        } else if ($('#AR').is(':checked')) {
            visualizeAR(logsAR, namesAR);
        } else if ($('#AD').is(':checked')) {
            visualizeAD(logsAD, namesAD);
        }
        if ($('#NC').is(':checked')) {
            visualizeNC(logsNC, namesNC);
        }
    });

    var msgAN = escapeHTML(languageHandler.getMessage('msgAN'));
    var msgANTitle = escapeHTML(languageHandler.getMessage('msgANTitle'));
    var msgAR = escapeHTML(languageHandler.getMessage('msgAR'));
    var msgARTitle = escapeHTML(languageHandler.getMessage('msgARTitle'));
    var msgAD = escapeHTML(languageHandler.getMessage('msgAD'));
    var msgADTitle = escapeHTML(languageHandler.getMessage('msgADTitle'));
    var msgNC = escapeHTML(languageHandler.getMessage('msgNC'));
    var msgNCTitle = escapeHTML(languageHandler.getMessage('msgNCTitle'));

    visualizeAN(logsAN, namesAN);

    function visualizeAN(logsAN, namesAN) {
        MG.data_graphic({
            title: ''+msgANTitle+'', //"Node Evolution",
            description: '' + msgAN + '',
            area: true,
            legend: namesAN,
            legend_target: '#legend',
            data: logsAN,
            width: 1020,
            interpolate: 'step-after',
            height: 550,
            show_secondary_x_label: true,
            y_extended_ticks: true,
            target: '#evoMap'

        });
    }

    function visualizeAR(logsAR, namesAR) {
        MG.data_graphic({
            title: msgARTitle, //"Relation Evolution",
            description: '' + msgAR + '',
            area: true,
            legend: namesAR,
            legend_target: '#legend',
            data: logsAR,
            width: 1020,
            height: 550,
            interpolate: 'step-after',
            show_secondary_x_label: true,
            y_extended_ticks: true,
            target: '#evoMap'
        });
    }

    function visualizeAD(logsAD, namesAD) {
        MG.data_graphic({
            title: msgADTitle, //"Density Evolution",
            description: '' + msgAD + '',
            area: true,
            legend: namesAD,
            legend_target: '#legend',
            data: logsAD,
            width: 1020,
            height: 550,
            interpolate: 'step-after',
            show_secondary_x_label: true,
            y_extended_ticks: true,
            target: '#evoMap'
        });
    }


    function visualizeNC(logsNC, namesNC) {
        MG.data_graphic({
            title: msgNCTitle, //"Cover Evolution",
            description: '' + msgNC + '',
            area: true,
            legend: namesNC,
            legend_target: '#legend',
            data: logsNC,
            format: 'percentage',
            width: 1020,
            height: 550,
            interpolate: 'step-after',
            show_secondary_x_label: true,
            y_extended_ticks: true,
            target: '#evoMap'
        });
    }
}