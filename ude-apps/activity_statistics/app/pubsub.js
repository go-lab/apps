(function(activityStatistics) {
    activityStatistics.PubSub = PubSub;

    /*
     * A simple publish-subscribe mechanism for coordinating events.
     */
    function PubSub() {
        let eventListeners = [];

        return {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
        };

        function publish() {
            const args = Array.prototype.slice.call(arguments);
            eventListeners.forEach(function callListener(listener) {
                listener.apply(null, args);
            });
        }

        function subscribe(listener) {
            eventListeners.push(listener);
        }

        function unsubscribe(listener) {
            eventListeners = eventListeners.filter(function(otherListener) {
                return otherListener !== listener;
            });
        }
    }

})(golab.tools.activityStatistics);
