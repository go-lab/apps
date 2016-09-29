/**
 * `ActivityProvider` connects to the analytics server using the vertx.EventBus
 * library, transforms the data it receives into something the application can
 * work with and emits events containing this data. The conversion of the raw
 * data from the server into events is handled by `RawPhaseDataHandler` and
 * `RawAppDataHandler` respectively.
 */
'use strict';

(function (activityStatistics) {
    var RawPhaseDataHandler = activityStatistics.RawPhaseDataHandler;
    var RawAppDataHandler = activityStatistics.RawAppDataHandler;

    var eventBusReceivePrefix = 'client.browser.sessionControllerCommand';
    var eventBusSendPrefix = 'client.sessionController.browserCommand';
    var activityDataKey = 'PhaseAppHistory';
    var phaseDataKey = 'StudentPhaseActivityTimeline';
    var log = function log() {
        arguments[0] = '[ActivityProvider] ' + arguments[0];
        console.log.apply(console, arguments);
    };

    var publishEvents = function publishEvents(pubSub, events) {
        if (!Array.isArray(events)) {
            events = [events];
        }
        events.forEach(function (event) {
            if (!event) return;
            log('event %s published with data %O', event.name, event.data);
            pubSub.publish(event.name, event.data);
        });
    };

    var ActivityProvider = function ActivityProvider(_ref) {
        var clientId = _ref.clientId;
        var ilsId = _ref.ilsId;
        var eventBusAddress = _ref.eventBusAddress;

        var events = activityStatistics.PubSub();
        var phaseDataHandler = RawPhaseDataHandler();
        var appDataHandler = RawAppDataHandler();
        var eventBus = new vertx.EventBus(eventBusAddress);
        eventBus.onopen = function () {
            registerMessageHandlers();
            registerClient();
            events.publish('connection_opened');
        };
        eventBus.onclose = function () {
            return events.publish('connection_closed');
        };

        return {
            on: function on(targetedEventName, listener) {
                events.subscribe(function (eventName) {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    if (eventName === targetedEventName) {
                        listener.apply(null, args);
                    }
                });
            }
        };

        function registerMessageHandlers() {
            var activityRegisterKey = eventBusReceivePrefix + '.' + activityDataKey + clientId;
            var phaseRegisterKey = eventBusReceivePrefix + '.' + phaseDataKey + clientId;
            eventBus.registerHandler(activityRegisterKey, function (message, replier) {
                replier('ok');
                log('Received message for %s from eventbus: %O', activityDataKey, message);
                if (message.action === 'ping') return;
                publishEvents(events, appDataHandler.handle(message));
            });
            eventBus.registerHandler(phaseRegisterKey, function (message, replier) {
                replier('ok');
                log('Received message for %s from eventbus: %O', phaseDataKey, message);
                if (message.action === 'ping') return;
                publishEvents(events, phaseDataHandler.handle(message));
            });
        }

        function registerClient() {
            var message = {
                action: 'register',
                key: {
                    ilsId: ilsId,
                    clientId: clientId,
                    start: null,
                    stop: null,
                    appSpecificSettings: null
                }
            };

            var activitySessionKey = eventBusSendPrefix + '.' + activityDataKey;
            var phaseSessionKey = eventBusSendPrefix + '.' + phaseDataKey;

            eventBus.send(activitySessionKey, message, function (response) {
                log('Registered for activity data.', 'Response:', response);
            });
            eventBus.send(phaseSessionKey, message, function (response) {
                log('Registered for phase data.', 'Response:', response);
            });
        }
    };

    activityStatistics.ActivityProvider = ActivityProvider;
})(golab.tools.activityStatistics);
//# sourceMappingURL=activity_provider.js.map
