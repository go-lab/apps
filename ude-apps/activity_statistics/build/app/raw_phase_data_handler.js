'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function (activityStatistics) {
    var util = activityStatistics.util;

    var indexedForEach = R.addIndex(R.forEach);

    // converts event bus messages to domain events
    // keeps track of the raw data to handle changes to data
    activityStatistics.RawPhaseDataHandler = function () {
        var rawData = { header: [], rows: [] };
        // maps indexes of original data to indexes of data for a specific user
        var indexMap = [];
        var lastIndexForUser = {};

        var initializedUsers = Immutable.Set();

        return {
            handle: function handle(message) {
                if (message.sessionControllerResultType === 'initTable') {
                    return handleInitMessage(message);
                }
                if (message.sessionControllerResultType === 'deltaLogs') {
                    return handleDeltaMessage(message);
                }
            }
        };

        function handleInitMessage(message) {
            rawData.header = message.header;
            if (!message.rows) return undefined;
            rawData.rows = message.rows;

            return R.pipe(indexedForEach(function (d, index) {
                return d.originalIndex = index;
            }), R.groupBy(function (d) {
                return d.username;
            }), R.toPairs(), R.map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2);

                var username = _ref2[0];
                var activities = _ref2[1];

                initializedUsers = initializedUsers.add(username);
                setIndexes(username, activities);
                return initialPhaseEvent(username, activities);
            }))(util.eventBus.mapHeadersToRows(message));
        }

        function handleDeltaMessage(message) {
            if (!message.logs) return undefined;
            var log = message.logs[0];
            if (!log) return undefined;
            if (log.actionName === 'appendRow') {
                return handleAppendRow(log);
            }
            if (log.actionName === 'changeCell') {
                return handleChangeCell(log);
            }
        }

        function handleChangeCell(data) {
            var affectedRow = rawData.rows[data.rowIndex];
            var affectedHeader = rawData.header[data.columnIndex];
            affectedRow[data.columnIndex] = data.newValue;
            var value = data.newValue;
            if (affectedHeader.dataType === 'zonedDateTime') {
                value = new Date(value);
            }
            return {
                name: 'phase_activity_changed',
                data: {
                    username: affectedRow[0],
                    property: affectedHeader.title.toLowerCase(),
                    activityIndex: indexMap[data.rowIndex],
                    value: value
                }
            };
        }

        function handleAppendRow(data) {
            rawData.rows[data.index] = data.values;
            var activity = util.eventBus.mapHeadersToRows({
                header: rawData.header,
                rows: [data.values]
            })[0];
            activity.originalIndex = data.index;
            setIndexes(activity.username, [activity]);

            if (userAlreadyInitialized(activity.username)) {
                return {
                    name: 'phase_activity_added',
                    data: {
                        username: activity.username,
                        activity: activity
                    }
                };
            }

            return initialPhaseEvent(activity.username, [activity]);
        }

        function userAlreadyInitialized(username) {
            return initializedUsers.includes(username);
        }

        function initialPhaseEvent(username, activities) {
            initializedUsers = initializedUsers.add(username);
            return {
                name: 'initial_phase_activities',
                data: { username: username, activities: activities }
            };
        }

        function setIndexes(username, activities) {
            if (lastIndexForUser[username] === undefined) {
                lastIndexForUser[username] = 0;
            }
            R.forEach(function (activity) {
                indexMap[activity.originalIndex] = lastIndexForUser[username];
                lastIndexForUser[username]++;
            }, activities);
        }
    };
})(golab.tools.activityStatistics);
//# sourceMappingURL=raw_phase_data_handler.js.map
