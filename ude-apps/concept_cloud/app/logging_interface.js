(function(conceptCloud){
    conceptCloud.LoggingInterface = LoggingInterface;

    function LoggingInterface(){
        conceptCloud.retrieverActionLogger.setLoggingTarget("opensocial");

        return{
            /* Global */
            initialize : initialize,
            accessModal : accessModal,

            /* Teacher */
            accessFilter : accessFilter,
            conceptState : conceptState
        };
    }

    // verbs
    // logAccess(object), logStart(object), logCancel(object), logSend(object), logReceive(object).

    function initialize(modelType, model){
        var logObject = {
            "logSource" : "ConceptCloud",
            "aggregatedView" : conceptCloud.aggregatedView,
            "timeOffset" : conceptCloud.timeOffset,
            "modelType" : modelType,
            "model" : model
        };

        conceptCloud.retrieverActionLogger.log("create", logObject);

    }

    function accessModal(tagName, color, frequency){
        var logObject = {
            "logSource" : "ConceptCloud",
            "aggregatedView" : conceptCloud.aggregatedView,
            "concept" : tagName,
            "color" : color,
            "frequency" : frequency
        };

        conceptCloud.retrieverActionLogger.logAccess(logObject);

    }

    function accessFilter(content, contentType, filterType){
        var logObject = {
            "logSource" : "ConceptCloud",
            "filterType" : filterType,
            "contentType" : contentType,
            "content" : content
        };

        conceptCloud.retrieverActionLogger.logAccess(logObject);
    }

    function conceptState(model){
        var logObject = {
            "logSource" : "ConceptCloud",
            "concepts" : model
        };
        conceptCloud.retrieverActionLogger.log("update", logObject);
    }




})(golab.tools.conceptCloud);