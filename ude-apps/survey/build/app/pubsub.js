"use strict";

(function (ReflectionPoll) {
    ReflectionPoll.PubSub = PubSub;

    /*
     * A simple publish-subscribe mechanism for coordinating events.
     */
    function PubSub() {
        var eventListeners = [];

        return {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        function publish() {
            var args = Array.prototype.slice.call(arguments);
            eventListeners.forEach(function callListener(listener) {
                listener.apply(null, args);
            });
        }

        function subscribe(listener) {
            eventListeners.push(listener);
        }

        function unsubscribe(listener) {
            eventListeners = eventListeners.filter(function (otherListener) {
                return otherListener !== listener;
            });
        }
    }
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=pubsub.js.map