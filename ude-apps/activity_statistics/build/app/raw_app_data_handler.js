'use strict';

(function (activityStatistics) {
    var util = activityStatistics.util;

    var isPhase = function isPhase(target) {
        return target === 'Orientation' || target === 'Conceptualisation' || target === 'Investigation' || target === 'Discussion' || target === 'Conclusion';
    };
    var onlyActivities = R.filter(function (a) {
        return !isPhase(a.targetname);
    });
    var rawDataHeader = [{
        dataType: 'string',
        title: 'targetname'
    }, {
        dataType: 'zonedDateTime',
        title: 'timestamp'
    }];

    // converts event bus messages to domain events
    // keeps track of the raw data to handle changes to data
    activityStatistics.RawAppDataHandler = function () {
        var rawData = {};

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
            rawData[message.multiResultKey] = {
                rows: message.rows || [],
                username: message.username
            };
            return R.pipe(util.eventBus.mapHeadersToRows, onlyActivities, function (activities) {
                return {
                    name: 'initial_app_activities',
                    data: { username: message.username, activities: activities }
                };
            })(message);
        }

        function handleDeltaMessage(message) {
            if (!message.logs) return undefined;
            var log = message.logs[0];
            if (!log) return undefined;
            if (log.actionName === 'appendRow') {
                return handleAppendRow(message.multiResultKey, log);
            }
            if (log.actionName === 'changeCell') {
                return handleChangeCell(message.multiResultKey, log);
            }
        }

        function handleChangeCell(key, data) {
            var affectedRow = rawData[key].rows[data.rowIndex];
            var affectedHeader = rawDataHeader[data.columnIndex];
            var previousValue = affectedRow[data.columnIndex];
            if (previousValue === data.newValue) {
                return null;
            }
            affectedRow[data.columnIndex] = data.newValue;
            var value = data.newValue;
            if (affectedHeader.dataType === 'zonedDateTime') {
                value = new Date(value);
            }
            return {
                name: 'app_activity_changed',
                data: {
                    username: rawData[key].username,
                    property: affectedHeader.title.toLowerCase(),
                    activityIndex: data.rowIndex,
                    value: value
                }
            };
        }

        function handleAppendRow(key, data) {
            rawData[key].rows[data.index] = data.values;
            var activity = util.eventBus.mapHeadersToRows({
                header: rawDataHeader,
                rows: [data.values]
            })[0];

            return {
                name: 'app_activity_added',
                data: {
                    username: rawData[key].username,
                    activity: activity
                }
            };
        }
    };
})(golab.tools.activityStatistics);
//# sourceMappingURL=raw_app_data_handler.js.map
