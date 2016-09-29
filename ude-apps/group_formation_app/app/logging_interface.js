/**
 * Created by richard on 16.01.16.
 */

(function(starterApp){
    starterApp.LoggingInterface = LoggingInterface;
    var actionLogger;

    function LoggingInterface(){
        actionLogger = starterApp.actionLogger;
        actionLogger.setLoggingTargetByName("console");

        return {
            logApplicationStarted : logApplicationStarted
        }

        function logApplicationStarted() {
            actionLogger.logApplicationStarted();
        }

    }


})(golab.tools.starterApp);