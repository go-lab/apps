((activityStatistics) => {
    const { util } = activityStatistics;
    const SCROLLBAR_WIDTH = util.measureScrollBarWidth();
    const { Map: IMap, List: IList, Set: ISet } = Immutable;
    const counter = util.counter();
    const defaultLane = (username) => {
        return IMap({
            phaseActivities: IList(),
            rawPhaseActivities: [],
            appActivities: IList(),
            rawAppActivities: [],
            username: username || `Unnamed ${counter()}`,
            minimized: false,
        });
    };

    const State = {
        CONN_INIT: 0,
        CONN_OPEN: 1,
        CONN_CLOSED: 2,
        init(rootElement) {
            const state = IMap({
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
                rootElement,
                lanes: IList(),
                projectedLanes: IList(),
            });
            return State.updateDimensions(state, {
                topHeight: 200,
                bottomHeight: 75,
            });
        },
        initWithPreloadedLanes(rootElement, lanes=IMap()) {
            let state = State.init(rootElement).set('lanes', lanes);
            state = loadAvailableDays(state);
            return State.updateSelectedDay(state, state.get('availableDays').last());
        },
        updateLanes(state, updater) {
            state = state.update('lanes', updater);
            return setProjectedLanes(state);
        },
        updateLane(state, username, updater) {
            return State.updateLanes(state, (lanes) => {
                let laneIndex = lanes.findIndex(l => l.get('username') === username);
                if (laneIndex === -1) {
                    laneIndex = lanes.count();
                    lanes = lanes.set(laneIndex, defaultLane(username));
                }
                return lanes.update(laneIndex, updater);
            });
        },
        updateAvailableDays(state, date) {
            const normalizedDate = stripTime(date);
            state = state
            .update('availableDays', (days) => days.add(normalizedDate));
            if (state.get('selectedDay') === null) {
                state = State.updateSelectedDay(state, normalizedDate);
            }
            return state;
        },
        updateSelectedDay(state, date) {
            if (isSameDay(state.get('selectedDay'), date)) {
                return;
            }
            const normalizedDate = stripTime(date);
            state = state
            .set('selectedDay', date)
            .set('selectedTimeRange', IMap({ min: null, max: null }));
            return setProjectedLanes(state);
        },
        updatePhaseActivities(state, username, updater=R.identity) {
            return State.updateLane(state, username, (lane) => {
                const phaseActivities = updater(lane.get('rawPhaseActivities'));
                return lane
                .set('rawPhaseActivities', phaseActivities)
                .set('phaseActivities', Immutable.fromJS(phaseActivities));
            });
        },
        updateAppActivities(state, username, updater=R.identity) {
            return State.updateLane(state, username, (lane) => {
                const appActivities = updater(lane.get('rawAppActivities'));
                return lane
                .set('rawAppActivities', appActivities)
                .set('appActivities', Immutable.fromJS(appActivities));
            });
        },
        updateDimensions(state, { topHeight, bottomHeight } = {}) {
            return state.update('dimensions', (dimensions) => {
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
        },
    };

    function getDimensions(rootElement, previousDimensions=IMap()) {
        const laneBorder = 2;
        let laneWidth = getAvailableWidth(rootElement);
        let lanesHeight = getAvailableHeight(rootElement, previousDimensions);
        let menuWidth = 250;
        if (laneWidth < 700) {
            menuWidth = 160;
        }
        if (laneWidth < 600) {
            laneWidth = 600;
        }
        const timelineWidth = laneWidth - menuWidth - laneBorder;
        return previousDimensions
        .set('laneWidth', laneWidth)
        .set('menuWidth', menuWidth)
        .set('timelineWidth', timelineWidth)
        .set('lanesHeight', lanesHeight);
    }

    function getAvailableWidth(element) {
        return element.clientWidth - SCROLLBAR_WIDTH - 3;
    }

    function getAvailableHeight(rootElement, dimensions) {
        const topMenuHeight = dimensions.get('topHeight', 200) + 10;
        const bottomAxisHeight = dimensions.get('bottomHeight', 75) + 10;
        const offsetTop = rootElement.offsetTop;
        const viewportHeight = window.innerHeight;
        return viewportHeight - topMenuHeight - bottomAxisHeight - offsetTop;
    }

    function stripTime(date) {
        return new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        ));
    }

    // Resets `availableDays` to include all days contained in `lanes`. For
    // adding values to `availableDays` use `State.updateAvailableDays`
    function loadAvailableDays(state) {
        return state.get('lanes').reduce((state, lane) => {
            return lane.get('phaseActivities').reduce((state, activity) => {
                return State.updateAvailableDays(state, activity.get('start'));
            }, state);
        }, state);
    }

    function setProjectedLanes(state) {
        const lanes = R.compose(
            withPhaseActivity,
            filterActivitiesForDay(state.get('selectedDay'))
        )(state.get('lanes'));

        return state.set('projectedLanes', lanes);
    }

    function isSameDay(date1, date2) {
        if (date1 === null || date2 === null) {
            return false;
        }
        return date1.getUTCFullYear() === date2.getUTCFullYear() &&
            date1.getUTCMonth() === date2.getUTCMonth() &&
            date1.getUTCDate() === date2.getUTCDate();
    }

    function filterActivitiesForDay(day) {
        return (lanes) => lanes.map((lane) => {
            return lane
            .update('phaseActivities', (as) => as.filter((a) => isSameDay(a.get('start'), day)))
            .update('rawPhaseActivities', (as) => as.filter((a) => isSameDay(a.start, day)))
            .update('appActivities', (as) => as.filter((a) => isSameDay(a.get('timestamp'), day)))
            .update('rawAppActivities', (as) => as.filter((a) => isSameDay(a.timestamp, day)));
        });
    }

    function withPhaseActivity(lanes) {
        return lanes.filter((lane) => {
            return lane.get('phaseActivities').count() !== 0;
        });
    }


    activityStatistics.State = State;
})(golab.tools.activityStatistics);
