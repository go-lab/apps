((activityStatistics) => {
    const { Map: IMap } = Immutable;
    const { State } = activityStatistics;

    function setPrettyTargetName(activity) {
        activity.targetname = golab.commons.prettyToolName(activity.targetname);
        return activity;
    }

    const updaters = IMap({
        'init': (state, rootElement) => {
            return State.init(rootElement);
        },
        'init_with_preloaded_lanes': (state, rootElement, lanes) => {
            return State.initWithPreloadedLanes(rootElement, lanes);
        },
        'set_phases': (state, phases=ISet()) => {
            return state.set('phases', phases);
        },
        'set_apps': (state, apps=ISet()) => {
            return state.set('apps', apps);
        },
        'minimize_status_bar': (state) => {
            return state.set('statusBarMinimized', true);
        },
        'maximize_status_bar': (state) => {
            return state.set('statusBarMinimized', false);
        },
        'set_show_app_activities': (state, showsApps) => {
            return state.set('showAppActivities', showsApps);
        },
        'minimize_lane': (state, laneId) => {
            return State.updateLane(state, laneId, l => l.set('minimized', true));
        },
        'maximize_lane': (state, laneId) => {
            return State.updateLane(state, laneId, l => l.set('minimized', false));
        },
        'minimize_all_lanes': (state) => {
            return State.updateLanes(state, (lanes) => {
                return lanes.map(l => l.set('minimized', true));
            });
        },
        'maximize_all_lanes': (state) => {
            return State.updateLanes(state, (lanes) => {
                return lanes.map(l => l.set('minimized', false));
            });
        },
        'set_connection_status_open': (state) => {
            return state.set('connectionStatus', State.CONN_OPEN);
        },
        'set_connection_status_closed': (state) => {
            return state.set('connectionStatus', State.CONN_CLOSED);
        },
        'set_selected_day': (state, date) => {
            return State.updateSelectedDay(state, date);
        },
        'highlight_phase': (state, phaseName) => {
            return state
            .set('highlightedPhase', phaseName)
            .set('highlightedApp', '');
        },
        'dehighlight_phase': (state) => {
            return state.set('highlightedPhase', '');
        },
        'highlight_app': (state, appName) => {
            return state
            .set('highlightedApp', appName)
            .set('highlightedPhase', '')
            .set('showAppActivities', true);
        },
        'dehighlight_app': (state) => {
            return state.set('highlightedApp', '');
        },
        'focus_phase_activity': (state, username, rawActivity) => {
            rawActivity.focussed = true;
            // make sure immutable activities reflect change
            state = State.updatePhaseActivities(state, username);
            return state.set('activityInFocus', IMap({
                type: 'phase', data: rawActivity
            }));
        },
        'focus_app_activity': (state, username, rawActivity) => {
            rawActivity.focussed = true;
            // make sure immutable activities reflect change
            state = State.updateAppActivities(state, username);
            return state.set('activityInFocus', IMap({
                type: 'app', data: rawActivity
            }));
        },
        'unfocus_phase_activity': (state, username, rawActivity) => {
            rawActivity.focussed = false;
            // make sure immutable activities reflect change
            state = State.updatePhaseActivities(state, username);
            return state.set('activityInFocus', null);
        },
        'unfocus_app_activity': (state, username, rawActivity) => {
            rawActivity.focussed = false;
            // make sure immutable activities reflect change
            state = State.updateAppActivities(state, username);
            return state.set('activityInFocus', null);
        },
        'set_time_selection': (state, { min, max }) => {
            return state.update('selectedTimeRange', (range) => {
                return range.set('min', min).set('max', max);
            });
        },
        'set_marker_position': (state, x) => {
            return state.set('timeMarkerX', x);
        },
        'set_top_height': (state, topHeight) => {
            return State.updateDimensions(state, { topHeight });
        },
        'set_bottom_height': (state, bottomHeight) => {
            return State.updateDimensions(state, { bottomHeight });
        },
        'set_initial_phase_activities': (state, { username, activities }) => {
            const phaseNames = activities.map((activity) => activity.phase);
            state = activities.reduce((state, activity) => {
                state = State.updateAvailableDays(state, activity.start);
                return state.update('phases', (phases) => phases.add(activity.phase));
            }, state);
            return State.updatePhaseActivities(state, username, () => {
                return activities;
            });
        },
        'add_phase_activity': (state, { username, activity }) => {
            state = State.updateAvailableDays(state, activity.start);
            state = State.updatePhaseActivities(state, username, (activities) => {
                activities.push(activity);
                return activities;
            });
            return state.update('phases', (phases) => phases.add(activity.phase));
        },
        'change_phase_activity': (state, change) => {
            const { username, property, value, activityIndex } = change;
            return State.updatePhaseActivities(state, username, (activities) => {
                activities[activityIndex][property] = value;
                return activities;
            });
        },
        'set_initial_app_activities': (state, { username, activities }) => {
            activities = activities.map(setPrettyTargetName);
            state = State.updateAppActivities(state, username, () => activities);
            const appNames = activities.map((activity) => activity.targetname);
            return state.update('apps', (apps) => apps.union(appNames));
        },
        'add_app_activity': (state, { username, activity }) => {
            activity = setPrettyTargetName(activity);
            state = State.updateAppActivities(state, username, (activities) => {
                activities.push(activity);
                return activities;
            });
            return state.update('apps', (apps) => apps.add(activity.targetname));
        },
        'change_app_activity': (state, change) => {
            const { username, property, value, activityIndex } = change;
            return State.updateAppActivities(state, username, (activities) => {
                activities[activityIndex][property] = value;
                return activities;
            });
        },
        'resize': (state) => {
            return State.updateDimensions(state);
        },
    });

    activityStatistics.update = (state, actionName, ...args) => {
        const updater = updaters.get(actionName);
        if (typeof updater !== 'function') {
            throw new Error(`Unhandled action "${actionName}".`);
        }
        console.log(`Handling action "${actionName}". Args: %O`, args);
        return updater.apply(null, [state].concat(args));
    };
})(golab.tools.activityStatistics);
