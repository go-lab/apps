function Application(environmentHandlers, config, loadingIndicator, errorDisplay) {
    var actionLogger = environmentHandlers.actionLogger;
    var notificationClient = environmentHandlers.notificationClient;
    var storageHandler = environmentHandlers.storageHandler;
    var metadataHandler = environmentHandlers.metadataHandler;
    var languageHandler = environmentHandlers.languageHandler;
    var app = this;
    app.serviceUrlLocal = "http://localhost:3090/analytics/golabz";
    app.serviceUrl = "http://golab-dev.collide.info/analytics/golabz";
    var DEBUG = true;

    var toolbar = Toolbar($('#toolbar'), languageHandler, {
        showLabels: false
    });

    notificationClient.register(function (notification) {
        return true;
    }, handleNotification);

    console.log('The application started. Yay!');
    actionLogger.logApplicationStarted();

    toolbar.onActionClick('refresh', function () {
        try {
            console.log("... refreshing Data...");
            refreshData();
        } catch (error) {
            handleError(error, languageHandler.getMessage('refresh_error'));
        }
    });

    function handleNotification(notification) {
        console.log('Notification received: %o', notification);
        notificationDisplay.display(notification);
    }


    function handleError(error, userMessage) {
        userMessage = userMessage || languageHandler.getMessage('error_occured');
        errorDisplay.show(userMessage);
        console.error(error.stack);
        loadingIndicator.hide();
    }

    function triggerTestNotification(actionLogger, metadataHandler) {
        // there is an agent on the server that sends test notifications to clients
        // that send action logs with the `objectType` of the `target` set to
        // `notification-test`

        // we modify the target in the metadata so the test agent receives the log
        var originalTarget = metadataHandler.getTarget();
        metadataHandler.setTarget({
            'objectType': 'notification-test',
            'id': 'xxx'
        });

        // sending the log, which will trigger the test agent on the server
        actionLogger.log('access', {
            id: 'object',
            objectType: 'testObject',
            displayName: 'hi'
        });

        // resetting metadata
        metadataHandler.setTarget(originalTarget);
    }


    function loadDataFromFile(data) {
        createChart(data);
    }

    function createChart(data) {
        data = MG.convert.date(data, 'date');

        MG.data_graphic({
            //title: "Line Chart",
            description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
            data: data,
            width: 700 ,
            height: 400,
            right: 40,
            full_width: true,
            //full_height:true,
            interpolate: 'linear',
            target: document.getElementById('content'),
            x_accessor: 'date',
            y_accessor: 'value',
            //chart_type:'histogram',
            //binned:true
        });
    }

    function loadDataFromJSON(data) {
        if (typeof(data) === "string") {
            data = JSON.parse(data);
        }
        if (data.error){
            //display warning that there are no results

            handleError(data.error, "No stats found - your app or lab probably does not support action logging. Visit http://golab-dev.collide.info to get more information about action logging and its API.");
        } else {
            createChart(data);
        }


    }

    function createRequestObject(url, generatorObjectType, verb) {

        //collide.info/widgetLabOwner/lab=254

        var data = {};
        data.url = url;
        data.generatorObjectType = generatorObjectType;
        data.verb = verb;
        return data;
    }

    function refreshData() {
        if (metadataHandler.getContext() == "standalone") {
            //http://golab-dev.collide.info/client/tools/golabz_stats/gadget.xml?golabzId=25
            //test url: "http://golab-dev.collide.info/client/tools/golabz_stats/gadget.xml?golabzId=131#appId=560267bc3125c8b80a54cb77&owner=55f13d7d652f876dd059cbaa"
            var reqData = createRequestObject("http://golab-dev.collide.info/client/tools/golabz_stats/gadget.xml?golabzId=25#appId=560267bc3125c8b80a54cb77&owner=55f13d7d652f876dd059cbaa", "application", "access");

            var tempData = [{"date":"2015-03-05","value":2},{"date":"2015-03-06","value":11},{"date":"2015-03-07","value":3},{"date":"2015-03-09","value":27},{"date":"2015-03-11","value":12},{"date":"2015-03-12","value":26},{"date":"2015-03-16","value":10},{"date":"2015-03-17","value":11},{"date":"2015-03-18","value":6},{"date":"2015-03-19","value":45},{"date":"2015-03-20","value":6},{"date":"2015-03-21","value":21},{"date":"2015-03-22","value":34},{"date":"2015-03-23","value":60},{"date":"2015-03-24","value":26},{"date":"2015-03-25","value":138},{"date":"2015-03-26","value":148},{"date":"2015-03-27","value":80},{"date":"2015-03-28","value":4},{"date":"2015-03-29","value":91},{"date":"2015-03-30","value":213},{"date":"2015-03-31","value":111},{"date":"2015-04-01","value":19},{"date":"2015-04-02","value":73},{"date":"2015-04-03","value":14},{"date":"2015-04-04","value":5},{"date":"2015-04-05","value":3},{"date":"2015-04-06","value":14},{"date":"2015-04-07","value":47},{"date":"2015-04-08","value":30},{"date":"2015-04-09","value":20},{"date":"2015-04-10","value":8},{"date":"2015-04-12","value":20},{"date":"2015-04-13","value":16},{"date":"2015-04-14","value":49},{"date":"2015-04-15","value":56},{"date":"2015-04-16","value":61},{"date":"2015-04-17","value":99},{"date":"2015-04-18","value":56},{"date":"2015-04-19","value":32},{"date":"2015-04-20","value":48},{"date":"2015-04-21","value":105},{"date":"2015-04-22","value":148},{"date":"2015-04-23","value":194},{"date":"2015-04-24","value":69},{"date":"2015-04-25","value":16},{"date":"2015-04-26","value":52},{"date":"2015-04-27","value":55},{"date":"2015-04-28","value":129},{"date":"2015-05-28","value":138},{"date":"2015-04-29","value":85},{"date":"2015-04-30","value":72},{"date":"2015-05-01","value":3},{"date":"2015-05-02","value":26},{"date":"2015-05-03","value":18},{"date":"2015-05-04","value":60},{"date":"2015-05-05","value":78},{"date":"2015-05-06","value":47},{"date":"2015-05-07","value":58},{"date":"2015-05-08","value":52},{"date":"2015-05-09","value":19},{"date":"2015-05-10","value":55},{"date":"2015-05-11","value":131},{"date":"2015-05-12","value":86},{"date":"2015-05-13","value":91},{"date":"2015-05-14","value":62},{"date":"2015-05-15","value":35},{"date":"2015-05-16","value":16},{"date":"2015-05-17","value":12},{"date":"2015-05-18","value":54},{"date":"2015-05-19","value":37},{"date":"2015-05-20","value":53},{"date":"2015-05-21","value":42},{"date":"2015-05-22","value":128},{"date":"2015-05-23","value":23},{"date":"2015-05-24","value":14},{"date":"2015-05-25","value":119},{"date":"2015-05-26","value":111},{"date":"2015-05-27","value":101},{"date":"2015-05-29","value":162},{"date":"2015-05-30","value":9},{"date":"2015-05-31","value":24},{"date":"2015-06-01","value":223},{"date":"2015-06-02","value":151},{"date":"2015-06-03","value":63},{"date":"2015-06-04","value":135},{"date":"2015-06-05","value":128},{"date":"2015-06-06","value":27},{"date":"2015-06-07","value":35},{"date":"2015-06-08","value":122},{"date":"2015-06-09","value":73},{"date":"2015-06-10","value":40},{"date":"2015-06-11","value":65},{"date":"2015-06-12","value":78},{"date":"2015-06-13","value":4},{"date":"2015-06-14","value":20},{"date":"2015-06-15","value":258},{"date":"2015-06-16","value":71},{"date":"2015-06-17","value":78},{"date":"2015-06-18","value":17},{"date":"2015-06-19","value":14},{"date":"2015-06-20","value":15},{"date":"2015-06-21","value":32},{"date":"2015-06-22","value":32},{"date":"2015-06-23","value":23},{"date":"2015-06-24","value":67},{"date":"2015-06-25","value":51},{"date":"2015-06-26","value":232},{"date":"2015-06-27","value":6},{"date":"2015-06-28","value":5},{"date":"2015-06-29","value":143},{"date":"2015-06-30","value":103},{"date":"2015-07-01","value":216},{"date":"2015-07-02","value":76},{"date":"2015-07-03","value":49},{"date":"2015-07-04","value":18},{"date":"2015-07-05","value":14},{"date":"2015-07-06","value":43},{"date":"2015-07-07","value":46},{"date":"2015-07-08","value":42},{"date":"2015-07-09","value":72},{"date":"2015-07-10","value":25},{"date":"2015-07-11","value":1},{"date":"2015-07-12","value":24},{"date":"2015-07-13","value":81},{"date":"2015-07-14","value":240},{"date":"2015-07-15","value":99},{"date":"2015-07-16","value":159},{"date":"2015-07-17","value":50},{"date":"2015-07-18","value":11},{"date":"2015-07-19","value":20},{"date":"2015-07-20","value":43},{"date":"2015-07-21","value":23},{"date":"2015-07-22","value":10},{"date":"2015-07-23","value":31},{"date":"2015-07-24","value":59},{"date":"2015-07-25","value":25},{"date":"2015-07-26","value":7},{"date":"2015-07-27","value":29},{"date":"2015-07-28","value":33},{"date":"2015-07-29","value":3},{"date":"2015-07-30","value":23},{"date":"2015-07-31","value":22},{"date":"2015-08-02","value":3},{"date":"2015-08-03","value":123},{"date":"2015-08-04","value":10},{"date":"2015-08-05","value":20},{"date":"2015-08-06","value":73},{"date":"2015-08-07","value":8},{"date":"2015-08-08","value":8},{"date":"2015-08-09","value":14},{"date":"2015-08-10","value":9},{"date":"2015-08-13","value":14},{"date":"2015-08-11","value":72},{"date":"2015-08-12","value":26},{"date":"2015-08-14","value":17},{"date":"2015-08-15","value":1},{"date":"2015-08-16","value":19},{"date":"2015-08-17","value":76},{"date":"2015-08-18","value":12},{"date":"2015-08-19","value":37},{"date":"2015-08-20","value":12},{"date":"2015-08-21","value":41},{"date":"2015-08-22","value":18},{"date":"2015-08-23","value":22},{"date":"2015-08-24","value":122},{"date":"2015-08-25","value":85},{"date":"2015-08-26","value":80},{"date":"2015-08-27","value":124},{"date":"2015-08-28","value":37},{"date":"2015-08-29","value":5},{"date":"2015-08-30","value":9},{"date":"2015-08-31","value":42},{"date":"2015-09-01","value":56},{"date":"2015-09-03","value":49},{"date":"2015-09-02","value":59},{"date":"2015-09-04","value":14},{"date":"2015-09-05","value":8},{"date":"2015-09-06","value":9},{"date":"2015-09-07","value":22},{"date":"2015-09-08","value":48},{"date":"2015-09-09","value":270},{"date":"2015-09-10","value":36},{"date":"2015-09-25","value":7},{"date":"2015-09-26","value":16},{"date":"2015-09-27","value":11},{"date":"2015-09-28","value":71},{"date":"2015-09-29","value":145},{"date":"2015-09-30","value":76},{"date":"2015-10-01","value":79},{"date":"2015-10-02","value":67},{"date":"2015-10-03","value":34},{"date":"2015-10-04","value":47},{"date":"2015-10-05","value":102},{"date":"2015-10-06","value":114},{"date":"2015-10-07","value":205},{"date":"2015-10-08","value":104},{"date":"2015-10-09","value":90},{"date":"2015-10-10","value":30},{"date":"2015-10-11","value":91},{"date":"2015-10-12","value":151},{"date":"2015-10-13","value":222},{"date":"2015-10-14","value":224},{"date":"2015-10-15","value":325},{"date":"2015-10-16","value":234},{"date":"2015-10-17","value":4},{"date":"2015-10-18","value":16},{"date":"2015-10-19","value":275},{"date":"2015-10-20","value":222},{"date":"2015-10-21","value":181},{"date":"2015-10-22","value":220},{"date":"2015-10-23","value":98},{"date":"2015-10-24","value":12},{"date":"2015-10-25","value":49},{"date":"2015-10-26","value":182},{"date":"2015-10-27","value":174},{"date":"2015-10-28","value":457},{"date":"2015-10-29","value":58}];
            console.log("[Golabz Statistics] Standalone mode - using dummy data...");
            loadDataFromJSON(tempData);

            /*$.ajax({
                url: app.serviceUrl,
                type: "POST",
                data: reqData,
                success: loadDataFromJSON.bind(this),
                error: function (err) {
                    console.log("[GolabzStatistics app] " + err);
                }
            })*/

        }
        else if (metadataHandler.getContext() == "preview") {

            var gadgetUrl = gadgets.util.getUrlParameters().url;
            //extract parameters from the context url --> serverside
            var reqData = createRequestObject(gadgetUrl, "application", "access");

            //loadDataFromFile();
            $.ajax({
                url: app.serviceUrl,
                type: "POST",
                data: reqData,
                success: loadDataFromJSON.bind(this),
                error: function (err) {
                    console.log("[GolabzStatistics app] " + err);
                }
            })

        } else {

            //TODO extract parameters from the context url
            //http://golab-dev.collide.info/client/tools/golabz_stats/gadget.xml?golabzId=131
            //test url: http://www.golabz.eu/lab/splash-virtual-buoyancy-laboratory
            alert("TEST-Mode - the Golabz Stats App will only run properly in Golabz...");
            var reqData = createRequestObject("http://golab-dev.collide.info/client/tools/golabz_stats/gadget.xml?golabzId=25#appId=560267bc3125c8b80a54cb77&owner=55f13d7d652f876dd059cbaa", "application", "access");

            $.ajax({
                url: app.serviceUrl,
                type: "POST",
                data: reqData,
                success: loadDataFromJSON.bind(this),
                error: function (err) {
                    console.log("[GolabzStatistics app] " + err);
                }
            })

        }
    }

    loadingIndicator.hide();

    $(window).resize(function () {
        var titleHeight = $("#toolbar-wrapper").outerHeight() + $("#title-bar").outerHeight() + 4;
        $("#canvas").css("height", window.innerHeight - titleHeight);
    });
    refreshData();

}
