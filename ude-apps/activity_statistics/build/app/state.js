'use strict';

(function (activityStatistics) {
    var util = activityStatistics.util;

    var SCROLLBAR_WIDTH = util.measureScrollBarWidth();
    var _Immutable = Immutable;
    var IMap = _Immutable.Map;
    var IList = _Immutable.List;
    var ISet = _Immutable.Set;

    var counter = util.counter();
    var defaultLane = function defaultLane(username) {
        return IMap({
            phaseActivities: IList(),
            rawPhaseActivities: [],
            appActivities: IList(),
            rawAppActivities: [],
            username: username || 'Unnamed ' + counter(),
            minimized: false
        });
    };

    var State = {
        CONN_INIT: 0,
        CONN_OPEN: 1,
        CONN_CLOSED: 2,
        init: function init(rootElement) {
            var state = IMap({
                statusBarMinimized: false,
                connectionStatus: State.CONN_INIT,
                activityInFocus: null,
                highlightedPhase: '',
                highlightedApp: '',
                phases: ISet(),
                apps: ISet(),
                showAppActivities: false,
                timeMarkerX: null,
                selectedTimeRange: IMap({ min: null, max: null }),
                availableDays: ISet(),
                selectedDay: null,
                width: 700,
                rootElement: rootElement,
                lanes: IList(),
                projectedLanes: IList()
            });
            return State.updateDimensions(state, {
                topHeight: 200,
                bottomHeight: 75
            });
        },
        initWithPreloadedLanes: function initWithPreloadedLanes(rootElement) {
            var lanes = arguments.length <= 1 || arguments[1] === undefined ? IMap() : arguments[1];

            var state = State.init(rootElement).set('lanes', lanes);
            state = loadAvailableDays(state);
            return State.updateSelectedDay(state, state.get('availableDays').last());
        },
        updateLanes: function updateLanes(state, updater) {
            state = state.update('lanes', updater);
            return setProjectedLanes(state);
        },
        updateLane: function updateLane(state, username, updater) {
            return State.updateLanes(state, function (lanes) {
                var laneIndex = lanes.findIndex(function (l) {
                    return l.get('username') === username;
                });
                if (laneIndex === -1) {
                    laneIndex = lanes.count();
                    lanes = lanes.set(laneIndex, defaultLane(username));
                }
                return lanes.update(laneIndex, updater);
            });
        },
        updateAvailableDays: function updateAvailableDays(state, date) {
            var normalizedDate = stripTime(date);
            state = state.update('availableDays', function (days) {
                return days.add(normalizedDate);
            });
            if (state.get('selectedDay') === null) {
                state = State.updateSelectedDay(state, normalizedDate);
            }
            return state;
        },
        updateSelectedDay: function updateSelectedDay(state, date) {
            if (isSameDay(state.get('selectedDay'), date)) {
                return;
            }
            var normalizedDate = stripTime(date);
            state = state.set('selectedDay', date).set('selectedTimeRange', IMap({ min: null, max: null }));
            return setProjectedLanes(state);
        },
        updatePhaseActivities: function updatePhaseActivities(state, username) {
            var updater = arguments.length <= 2 || arguments[2] === undefined ? R.identity : arguments[2];

            return State.updateLane(state, username, function (lane) {
                var phaseActivities = updater(lane.get('rawPhaseActivities'));
                return lane.set('rawPhaseActivities', phaseActivities).set('phaseActivities', Immutable.fromJS(phaseActivities));
            });
        },
        updateAppActivities: function updateAppActivities(state, username) {
            var updater = arguments.length <= 2 || arguments[2] === undefined ? R.identity : arguments[2];

            return State.updateLane(state, username, function (lane) {
                var appActivities = updater(lane.get('rawAppActivities'));
                return lane.set('rawAppActivities', appActivities).set('appActivities', Immutable.fromJS(appActivities));
            });
        },
        updateDimensions: function updateDimensions(state) {
            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var topHeight = _ref.topHeight;
            var bottomHeight = _ref.bottomHeight;

            return state.update('dimensions', function (dimensions) {
                if (dimensions === undefined) {
                    dimensions = IMap();
                }
                if (topHeight !== undefined) {
                    dimensions = dimensions.set('topHeight', topHeight);
                }
                if (bottomHeight !== undefined) {
                    dimensions = dimensions.set('bottomHeight', bottomHeight);
                }
                return getDimensions(state.get('rootElement'), dimensions);
            });
        }
    };

    function getDimensions(rootElement) {
        var previousDimensions = arguments.length <= 1 || arguments[1] === undefined ? IMap() : arguments[1];

        var laneBorder = 2;
        var laneWidth = getAvailableWidth(rootElement);
        var lanesHeight = getAvailableHeight(rootElement, previousDimensions);
        var menuWidth = 250;
        if (laneWidth < 700) {
            menuWidth = 160;
        }
        if (laneWidth < 600) {
            laneWidth = 600;
        }
        var timelineWidth = laneWidth - menuWidth - laneBorder;
        return previousDimensions.set('laneWidth', laneWidth).set('menuWidth', menuWidth).set('timelineWidth', timelineWidth).set('lanesHeight', lanesHeight);
    }

    function getAvailableWidth(element) {
        return element.clientWidth - SCROLLBAR_WIDTH - 3;
    }

    function getAvailableHeight(rootElement, dimensions) {
        var topMenuHeight = dimensions.get('topHeight', 200) + 10;
        var bottomAxisHeight = dimensions.get('bottomHeight', 75) + 10;
        var offsetTop = rootElement.offsetTop;
        var viewportHeight = window.innerHeight;
        return viewportHeight - topMenuHeight - bottomAxisHeight - offsetTop;
    }

    function stripTime(date) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }

    // Resets `availableDays` to include all days contained in `lanes`. For
    // adding values to `availableDays` use `State.updateAvailableDays`
    function loadAvailableDays(state) {
        return state.get('lanes').reduce(function (state, lane) {
            return lane.get('phaseActivities').reduce(function (state, activity) {
                return State.updateAvailableDays(state, activity.get('start'));
            }, state);
        }, state);
    }

    function setProjectedLanes(state) {
        var lanes = R.compose(withPhaseActivity, filterActivitiesForDay(state.get('selectedDay')))(state.get('lanes'));

        return state.set('projectedLanes', lanes);
    }

    function isSameDay(date1, date2) {
        if (date1 === null || date2 === null) {
            return false;
        }
        return date1.getUTCFullYear() === date2.getUTCFullYear() && date1.getUTCMonth() === date2.getUTCMonth() && date1.getUTCDate() === date2.getUTCDate();
    }

    function filterActivitiesForDay(day) {
        return function (lanes) {
            return lanes.map(function (lane) {
                return lane.update('phaseActivities', function (as) {
                    return as.filter(function (a) {
                        return isSameDay(a.get('start'), day);
                    });
                }).update('rawPhaseActivities', function (as) {
                    return as.filter(function (a) {
                        return isSameDay(a.start, day);
                    });
                }).update('appActivities', function (as) {
                    return as.filter(function (a) {
                        return isSameDay(a.get('timestamp'), day);
                    });
                }).update('rawAppActivities', function (as) {
                    return as.filter(function (a) {
                        return isSameDay(a.timestamp, day);
                    });
                });
            });
        };
    }

    function withPhaseActivity(lanes) {
        return lanes.filter(function (lane) {
            return lane.get('phaseActivities').count() !== 0;
        });
    }

    activityStatistics.State = State;
})(golab.tools.activityStatistics);
//# sourceMappingURL=state.js.map
