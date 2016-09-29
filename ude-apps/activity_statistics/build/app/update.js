'use strict';

(function (activityStatistics) {
    var _Immutable = Immutable;
    var IMap = _Immutable.Map;
    var State = activityStatistics.State;

    function setPrettyTargetName(activity) {
        activity.targetname = golab.commons.prettyToolName(activity.targetname);
        return activity;
    }

    var updaters = IMap({
        'init': function init(state, rootElement) {
            return State.init(rootElement);
        },
        'init_with_preloaded_lanes': function init_with_preloaded_lanes(state, rootElement, lanes) {
            return State.initWithPreloadedLanes(rootElement, lanes);
        },
        'set_phases': function set_phases(state) {
            var phases = arguments.length <= 1 || arguments[1] === undefined ? ISet() : arguments[1];

            return state.set('phases', phases);
        },
        'set_apps': function set_apps(state) {
            var apps = arguments.length <= 1 || arguments[1] === undefined ? ISet() : arguments[1];

            return state.set('apps', apps);
        },
        'minimize_status_bar': function minimize_status_bar(state) {
            return state.set('statusBarMinimized', true);
        },
        'maximize_status_bar': function maximize_status_bar(state) {
            return state.set('statusBarMinimized', false);
        },
        'set_show_app_activities': function set_show_app_activities(state, showsApps) {
            return state.set('showAppActivities', showsApps);
        },
        'minimize_lane': function minimize_lane(state, laneId) {
            return State.updateLane(state, laneId, function (l) {
                return l.set('minimized', true);
            });
        },
        'maximize_lane': function maximize_lane(state, laneId) {
            return State.updateLane(state, laneId, function (l) {
                return l.set('minimized', false);
            });
        },
        'minimize_all_lanes': function minimize_all_lanes(state) {
            return State.updateLanes(state, function (lanes) {
                return lanes.map(function (l) {
                    return l.set('minimized', true);
                });
            });
        },
        'maximize_all_lanes': function maximize_all_lanes(state) {
            return State.updateLanes(state, function (lanes) {
                return lanes.map(function (l) {
                    return l.set('minimized', false);
                });
            });
        },
        'set_connection_status_open': function set_connection_status_open(state) {
            return state.set('connectionStatus', State.CONN_OPEN);
        },
        'set_connection_status_closed': function set_connection_status_closed(state) {
            return state.set('connectionStatus', State.CONN_CLOSED);
        },
        'set_selected_day': function set_selected_day(state, date) {
            return State.updateSelectedDay(state, date);
        },
        'highlight_phase': function highlight_phase(state, phaseName) {
            return state.set('highlightedPhase', phaseName).set('highlightedApp', '');
        },
        'dehighlight_phase': function dehighlight_phase(state) {
            return state.set('highlightedPhase', '');
        },
        'highlight_app': function highlight_app(state, appName) {
            return state.set('highlightedApp', appName).set('highlightedPhase', '').set('showAppActivities', true);
        },
        'dehighlight_app': function dehighlight_app(state) {
            return state.set('highlightedApp', '');
        },
        'focus_phase_activity': function focus_phase_activity(state, username, rawActivity) {
            rawActivity.focussed = true;
            // make sure immutable activities reflect change
            state = State.updatePhaseActivities(state, username);
            return state.set('activityInFocus', IMap({
                type: 'phase', data: rawActivity
            }));
        },
        'focus_app_activity': function focus_app_activity(state, username, rawActivity) {
            rawActivity.focussed = true;
            // make sure immutable activities reflect change
            state = State.updateAppActivities(state, username);
            return state.set('activityInFocus', IMap({
                type: 'app', data: rawActivity
            }));
        },
        'unfocus_phase_activity': function unfocus_phase_activity(state, username, rawActivity) {
            rawActivity.focussed = false;
            // make sure immutable activities reflect change
            state = State.updatePhaseActivities(state, username);
            return state.set('activityInFocus', null);
        },
        'unfocus_app_activity': function unfocus_app_activity(state, username, rawActivity) {
            rawActivity.focussed = false;
            // make sure immutable activities reflect change
            state = State.updateAppActivities(state, username);
            return state.set('activityInFocus', null);
        },
        'set_time_selection': function set_time_selection(state, _ref) {
            var min = _ref.min;
            var max = _ref.max;

            return state.update('selectedTimeRange', function (range) {
                return range.set('min', min).set('max', max);
            });
        },
        'set_marker_position': function set_marker_position(state, x) {
            return state.set('timeMarkerX', x);
        },
        'set_top_height': function set_top_height(state, topHeight) {
            return State.updateDimensions(state, { topHeight: topHeight });
        },
        'set_bottom_height': function set_bottom_height(state, bottomHeight) {
            return State.updateDimensions(state, { bottomHeight: bottomHeight });
        },
        'set_initial_phase_activities': function set_initial_phase_activities(state, _ref2) {
            var username = _ref2.username;
            var activities = _ref2.activities;

            var phaseNames = activities.map(function (activity) {
                return activity.phase;
            });
            state = activities.reduce(function (state, activity) {
                state = State.updateAvailableDays(state, activity.start);
                return state.update('phases', function (phases) {
                    return phases.add(activity.phase);
                });
            }, state);
            return State.updatePhaseActivities(state, username, function () {
                return activities;
            });
        },
        'add_phase_activity': function add_phase_activity(state, _ref3) {
            var username = _ref3.username;
            var activity = _ref3.activity;

            state = State.updateAvailableDays(state, activity.start);
            state = State.updatePhaseActivities(state, username, function (activities) {
                activities.push(activity);
                return activities;
            });
            return state.update('phases', function (phases) {
                return phases.add(activity.phase);
            });
        },
        'change_phase_activity': function change_phase_activity(state, change) {
            var username = change.username;
            var property = change.property;
            var value = change.value;
            var activityIndex = change.activityIndex;

            return State.updatePhaseActivities(state, username, function (activities) {
                activities[activityIndex][property] = value;
                return activities;
            });
        },
        'set_initial_app_activities': function set_initial_app_activities(state, _ref4) {
            var username = _ref4.username;
            var activities = _ref4.activities;

            activities = activities.map(setPrettyTargetName);
            state = State.updateAppActivities(state, username, function () {
                return activities;
            });
            var appNames = activities.map(function (activity) {
                return activity.targetname;
            });
            return state.update('apps', function (apps) {
                return apps.union(appNames);
            });
        },
        'add_app_activity': function add_app_activity(state, _ref5) {
            var username = _ref5.username;
            var activity = _ref5.activity;

            activity = setPrettyTargetName(activity);
            state = State.updateAppActivities(state, username, function (activities) {
                activities.push(activity);
                return activities;
            });
            return state.update('apps', function (apps) {
                return apps.add(activity.targetname);
            });
        },
        'change_app_activity': function change_app_activity(state, change) {
            var username = change.username;
            var property = change.property;
            var value = change.value;
            var activityIndex = change.activityIndex;

            return State.updateAppActivities(state, username, function (activities) {
                activities[activityIndex][property] = value;
                return activities;
            });
        },
        'resize': function resize(state) {
            return State.updateDimensions(state);
        }
    });

    activityStatistics.update = function (state, actionName) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
        }

        var updater = updaters.get(actionName);
        if (typeof updater !== 'function') {
            throw new Error('Unhandled action "' + actionName + '".');
        }
        console.log('Handling action "' + actionName + '". Args: %O', args);
        return updater.apply(null, [state].concat(args));
    };
})(golab.tools.activityStatistics);
//# sourceMappingURL=update.js.map
