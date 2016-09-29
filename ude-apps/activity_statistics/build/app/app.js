'use strict';

(function (activityStatistics) {
    activityStatistics.Application = Application;

    var _Immutable = Immutable;
    var IMap = _Immutable.Map;
    var ISet = _Immutable.Set;
    var View = activityStatistics.View;
    var ActivityProvider = activityStatistics.ActivityProvider;
    var util = activityStatistics.util;
    var update = activityStatistics.update;

    var RESIZE_REFRESH_RATE = 500;
    var getItemsBySpaceId = function getItemsBySpaceId(spaceId) {
        return new Promise(function (resolve, reject) {
            ils.getItemsBySpaceId(spaceId, function (result) {
                if (result.error) return reject(result.error);
                resolve(result);
            });
        });
    };

    function Application(environmentHandlers, loadingIndicator, urlRoot, errorDisplay) {
        var actionLogger = environmentHandlers.actionLogger;
        var languageHandler = environmentHandlers.languageHandler;
        var metadataHandler = environmentHandlers.metadataHandler;

        var getMsg = languageHandler.getMessage.bind(languageHandler);
        var context = metadataHandler.getContext();
        var ilsId = getIlsId(metadataHandler);

        console.log('The application started. Yay!');
        actionLogger.logApplicationStarted();

        var rootElement = document.querySelector('#timeline');

        var lifecycle = Lifecyle(update, function (state) {
            ReactDOM.render(React.createElement(View, { state: state, action: lifecycle.executeAction, getMsg: getMsg }), rootElement);
        }, handleError);

        var resize = function resize() {
            return lifecycle.executeAction('resize');
        };
        window.addEventListener('resize', util.throttle(resize, RESIZE_REFRESH_RATE));

        loadingIndicator.hide();

        if (context === 'preview') {
            console.log('Loading sample data since we are in preview mode');
            loadSampleData(urlRoot).then(function (sampleData) {
                lifecycle.executeAction('init_with_preloaded_lanes', rootElement, sampleData.get('lanes'));
                lifecycle.executeAction('set_phases', sampleData.get('phases'));
                lifecycle.executeAction('set_apps', sampleData.get('apps'));
                lifecycle.executeAction('set_connection_status_open');
            })['catch'](handleError);
            return;
        }

        lifecycle.executeAction('init', rootElement);

        if (context === 'graasp' || context === 'ils') {
            loadIlsItems(ilsId).then(function (items) {
                lifecycle.executeAction('set_phases', items.get('phases'));
                lifecycle.executeAction('set_apps', items.get('apps'));
            })['catch'](handleError);
        }

        var activityProvider = ActivityProvider({
            clientId: Math.random().toString(),
            eventBusAddress: 'http://golab-dev.collide.info/eventbus',
            // eventBusAddress: 'http://localhost:8901/eventbus',
            ilsId: ilsId
        });

        // ilsId: '55ba0fb4b03892f8b2bcba88' // http://graasp.eu/ils/55ba0fb4b5a072ca556738e0/?lang=en
        triggerActionsOnActivityProviderEvents(activityProvider, lifecycle.executeAction, IMap({
            'connection_opened': 'set_connection_status_open',
            'connection_closed': 'set_connection_status_closed',
            'initial_phase_activities': 'set_initial_phase_activities',
            'phase_activity_added': 'add_phase_activity',
            'phase_activity_changed': 'change_phase_activity',
            'initial_app_activities': 'set_initial_app_activities',
            'app_activity_added': 'add_app_activity',
            'app_activity_changed': 'change_app_activity'
        }));

        function handleError(error, userMessage) {
            userMessage = userMessage || getMsg('error_occured');
            errorDisplay.show(userMessage);
            console.error(error.stack);
            loadingIndicator.hide();
        }
    }

    function Lifecyle(update, render, handleError) {
        var state = undefined;
        function executeAction(actionName) {
            try {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                state = update.apply(undefined, [state, actionName].concat(args));
                console.log('rendering state. Raw: %O. As JS: %O', state, state.toJS());
                render(state);
            } catch (error) {
                handleError(error);
            }
        }
        return { executeAction: executeAction };
    }

    function triggerActionsOnActivityProviderEvents(provider, triggerAction, eventToActionMap) {
        var triggerActionForProviderEvent = util.triggerActionOnEvent.bind(null, provider.on, triggerAction);

        eventToActionMap.forEach(function (actionName, eventName) {
            triggerActionForProviderEvent(eventName, actionName);
        });
    }

    function loadIlsItems(ilsId) {
        var items = IMap({ phases: ISet(), apps: ISet() });
        return getItemsBySpaceId(ilsId).then(function (phases) {
            phases = phases.filter(function (phase) {
                return phase.visibilityLevel === 'public';
            });
            items = items.set('phases', ISet(phases.map(function (phase) {
                return phase.displayName;
            })));
            var loadApps = phases.map(function (phase) {
                return getItemsBySpaceId(phase.id);
            });
            return Promise.all(loadApps);
        }).then(function (apps) {
            apps = R.flatten(apps).filter(function (app) {
                return app.itemType === 'Application';
            }).map(function (app) {
                return app.displayName;
            });
            return items.set('apps', ISet(apps));
        });
    }

    function getIlsId(metadataHandler) {
        switch (metadataHandler.getContext()) {
            case 'ils':case 'graasp':
                return metadataHandler.getProvider().id;
            default:
                return 'demo-space-id';
        }
    }

    function loadSampleData(urlRoot) {
        return new Promise(function (resolve, reject) {
            var scr = document.createElement('script');
            scr.src = urlRoot + 'build/app/sampleData.js';
            document.body.appendChild(scr);
            scr.onload = function () {
                return resolve(activityStatistics.sampleData);
            };
            scr.onerror = function (error) {
                return reject(new Error('sample data could not be loaded'));
            };
        });
    }
})(golab.tools.activityStatistics);
//# sourceMappingURL=app.js.map
