/**
 * `ActivityProvider` connects to the analytics server using the vertx.EventBus
 * library, transforms the data it receives into something the application can
 * work with and emits events containing this data. The conversion of the raw
 * data from the server into events is handled by `RawPhaseDataHandler` and
 * `RawAppDataHandler` respectively.
 */
((activityStatistics) => {
    const {
        RawPhaseDataHandler,
        RawAppDataHandler,
    } = activityStatistics;
    const eventBusReceivePrefix = 'client.browser.sessionControllerCommand';
    const eventBusSendPrefix = 'client.sessionController.browserCommand';
    const activityDataKey = 'PhaseAppHistory';
    const phaseDataKey = 'StudentPhaseActivityTimeline';
    const log = (...args) => {
        args[0] = '[ActivityProvider] ' + args[0];
        console.log(...args);
    };

    const publishEvents = (pubSub, events) => {
        if (!Array.isArray(events)) {
            events = [events];
        }
        events.forEach((event) => {
            if (!event) return;
            log('event %s published with data %O', event.name, event.data);
            pubSub.publish(event.name, event.data);
        });
    };

    const ActivityProvider = ({ clientId, ilsId, eventBusAddress }) => {
        const events = activityStatistics.PubSub();
        const phaseDataHandler = RawPhaseDataHandler();
        const appDataHandler = RawAppDataHandler();
        const eventBus = new vertx.EventBus(eventBusAddress);
        eventBus.onopen = () => {
            registerMessageHandlers();
            registerClient();
            events.publish('connection_opened');
        };
        eventBus.onclose = () => events.publish('connection_closed');

        return {
            on: (targetedEventName, listener) => {
                events.subscribe((eventName, ...args) => {
                    if (eventName === targetedEventName) {
                        listener.apply(null, args);
                    }
                });
            },
        };

        function registerMessageHandlers() {
            const activityRegisterKey = `${eventBusReceivePrefix}.${activityDataKey}${clientId}`;
            const phaseRegisterKey = `${eventBusReceivePrefix}.${phaseDataKey}${clientId}`;
            eventBus.registerHandler(activityRegisterKey, (message, replier) => {
                replier('ok');
                log('Received message for %s from eventbus: %O', activityDataKey, message);
                if (message.action === 'ping') return;
                publishEvents(events, appDataHandler.handle(message));
            });
            eventBus.registerHandler(phaseRegisterKey, (message, replier) => {
                replier('ok');
                log('Received message for %s from eventbus: %O', phaseDataKey, message);
                if (message.action === 'ping') return;
                publishEvents(events, phaseDataHandler.handle(message));
            });
        }

        function registerClient() {
            const message = {
                action: 'register',
                key: {
                    ilsId,
                    clientId,
                    start: null,
                    stop: null,
                    appSpecificSettings: null
                }
            };

            const activitySessionKey = `${eventBusSendPrefix}.${activityDataKey}`;
            const phaseSessionKey = `${eventBusSendPrefix}.${phaseDataKey}`;

            eventBus.send(activitySessionKey, message, (response) => {
                log('Registered for activity data.', 'Response:', response);
            });
            eventBus.send(phaseSessionKey, message, (response) => {
                log('Registered for phase data.', 'Response:', response);
            });
        }
    };

    activityStatistics.ActivityProvider = ActivityProvider;
})(golab.tools.activityStatistics);
