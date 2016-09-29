(function(activityStatistics) {
    activityStatistics.Application = Application;

    const { Map: IMap, Set: ISet } = Immutable;
    const { View, ActivityProvider, util, update } = activityStatistics;
    const RESIZE_REFRESH_RATE = 500;
    const getItemsBySpaceId = (spaceId) => {
        return new Promise((resolve, reject) => {
            ils.getItemsBySpaceId(spaceId, (result) => {
                if (result.error) return reject(result.error);
                resolve(result);
            });
        });
    };

    function Application(environmentHandlers, loadingIndicator, urlRoot, errorDisplay) {
        const {
            actionLogger,
            languageHandler,
            metadataHandler
        } = environmentHandlers;
        const getMsg = languageHandler.getMessage.bind(languageHandler);
        const context = metadataHandler.getContext();
        const ilsId = getIlsId(metadataHandler);

        console.log('The application started. Yay!');
        actionLogger.logApplicationStarted();

        const rootElement = document.querySelector('#timeline');

        const lifecycle = Lifecyle(update, (state) => {
            ReactDOM.render(
                <View state={state} action={lifecycle.executeAction} getMsg={getMsg} />,
                rootElement
            );
        }, handleError);

        const resize = () => lifecycle.executeAction('resize');
        window.addEventListener(
            'resize',
            util.throttle(resize, RESIZE_REFRESH_RATE)
        );

        loadingIndicator.hide();

        if (context === 'preview') {
            console.log('Loading sample data since we are in preview mode');
            loadSampleData(urlRoot).then((sampleData) => {
                lifecycle.executeAction(
                    'init_with_preloaded_lanes',
                    rootElement,
                    sampleData.get('lanes')
                );
                lifecycle.executeAction('set_phases', sampleData.get('phases'));
                lifecycle.executeAction('set_apps', sampleData.get('apps'));
                lifecycle.executeAction('set_connection_status_open');
            }).catch(handleError);
            return;
        }

        lifecycle.executeAction('init', rootElement);

        if (context === 'graasp' || context === 'ils') {
            loadIlsItems(ilsId).then((items) => {
                lifecycle.executeAction('set_phases', items.get('phases'));
                lifecycle.executeAction('set_apps', items.get('apps'));
            }).catch(handleError);
        }

        const activityProvider = ActivityProvider({
            clientId: Math.random().toString(),
            eventBusAddress: 'http://golab-dev.collide.info/eventbus',
            // eventBusAddress: 'http://localhost:8901/eventbus',
            ilsId,
            // ilsId: '55ba0fb4b03892f8b2bcba88' // http://graasp.eu/ils/55ba0fb4b5a072ca556738e0/?lang=en
        });

        triggerActionsOnActivityProviderEvents(
            activityProvider,
            lifecycle.executeAction,
            IMap({
                'connection_opened': 'set_connection_status_open',
                'connection_closed': 'set_connection_status_closed',
                'initial_phase_activities': 'set_initial_phase_activities',
                'phase_activity_added': 'add_phase_activity',
                'phase_activity_changed': 'change_phase_activity',
                'initial_app_activities': 'set_initial_app_activities',
                'app_activity_added': 'add_app_activity',
                'app_activity_changed': 'change_app_activity',
            })
        );

        function handleError(error, userMessage) {
            userMessage = userMessage || getMsg('error_occured');
            errorDisplay.show(userMessage);
            console.error(error.stack);
            loadingIndicator.hide();
        }
    }

    function Lifecyle(update, render, handleError) {
        let state;
        function executeAction(actionName, ...args) {
            try {
                state = update(state, actionName, ...args);
                console.log('rendering state. Raw: %O. As JS: %O', state, state.toJS());
                render(state);
            } catch(error) {
                handleError(error);
            }
        }
        return { executeAction };
    }

    function triggerActionsOnActivityProviderEvents(
        provider,
        triggerAction,
        eventToActionMap
    ) {
        const triggerActionForProviderEvent = util.triggerActionOnEvent.bind(
            null,
            provider.on,
            triggerAction
        );

        eventToActionMap.forEach((actionName, eventName) => {
            triggerActionForProviderEvent(eventName, actionName);
        });
    }

    function loadIlsItems(ilsId) {
        let items = IMap({ phases: ISet(), apps: ISet() });
        return getItemsBySpaceId(ilsId).then((phases) => {
            phases = phases.filter((phase) => phase.visibilityLevel === 'public');
            items = items.set(
                'phases',
                ISet(phases.map((phase) => phase.displayName))
            );
            const loadApps = phases.map((phase) => getItemsBySpaceId(phase.id));
            return Promise.all(loadApps);
        }).then((apps) => {
            apps = R.flatten(apps)
            .filter((app) => app.itemType === 'Application')
            .map((app) => app.displayName);
            return items.set('apps', ISet(apps));
        });
    }


    function getIlsId(metadataHandler) {
        switch (metadataHandler.getContext()) {
            case 'ils': case 'graasp': return metadataHandler.getProvider().id;
            default: return 'demo-space-id';
        }
    }

    function loadSampleData(urlRoot) {
        return new Promise((resolve, reject) => {
            const scr = document.createElement('script');
            scr.src = `${urlRoot}build/app/sampleData.js`;
            document.body.appendChild(scr);
            scr.onload = () => resolve(activityStatistics.sampleData);
            scr.onerror = (error) => reject(
                new Error('sample data could not be loaded'));
        });
    }
})(golab.tools.activityStatistics);
