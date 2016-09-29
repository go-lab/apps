((activityStatistics) => {
    const { util } = activityStatistics;
    const indexedForEach = R.addIndex(R.forEach);

    // converts event bus messages to domain events
    // keeps track of the raw data to handle changes to data
    activityStatistics.RawPhaseDataHandler = () => {
        const rawData = { header: [], rows: [] };
        // maps indexes of original data to indexes of data for a specific user
        const indexMap = [];
        const lastIndexForUser = {};

        let initializedUsers = Immutable.Set();

        return {
            handle(message) {
                if (message.sessionControllerResultType === 'initTable') {
                    return handleInitMessage(message);
                }
                if (message.sessionControllerResultType === 'deltaLogs') {
                    return handleDeltaMessage(message);
                }
            },
        };

        function handleInitMessage(message) {
            rawData.header = message.header;
            if (!message.rows) return undefined;
            rawData.rows = message.rows;

            return R.pipe(
                indexedForEach((d, index) => d.originalIndex = index),
                R.groupBy((d) => d.username),
                R.toPairs(),
                R.map(([username, activities]) => {
                    initializedUsers = initializedUsers.add(username);
                    setIndexes(username, activities);
                    return initialPhaseEvent(username, activities);
                })
            )(util.eventBus.mapHeadersToRows(message));
        }

        function handleDeltaMessage(message) {
            if (!message.logs) return undefined;
            const log = message.logs[0];
            if (!log) return undefined;
            if (log.actionName === 'appendRow') {
                return handleAppendRow(log);
            }
            if (log.actionName === 'changeCell') {
                return handleChangeCell(log);
            }
        }

        function handleChangeCell(data) {
            const affectedRow = rawData.rows[data.rowIndex];
            const affectedHeader = rawData.header[data.columnIndex];
            affectedRow[data.columnIndex] = data.newValue;
            let value = data.newValue;
            if (affectedHeader.dataType === 'zonedDateTime') {
                value = new Date(value);
            }
            return {
                name: 'phase_activity_changed',
                data: {
                    username: affectedRow[0],
                    property: affectedHeader.title.toLowerCase(),
                    activityIndex: indexMap[data.rowIndex],
                    value,
                }
            };
        }

        function handleAppendRow(data) {
            rawData.rows[data.index] = data.values;
            const activity = util.eventBus.mapHeadersToRows({
                header: rawData.header,
                rows: [data.values],
            })[0];
            activity.originalIndex = data.index;
            setIndexes(activity.username, [activity]);

            if (userAlreadyInitialized(activity.username)) {
                return {
                    name: 'phase_activity_added',
                    data: {
                        username: activity.username,
                        activity
                    },
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
                data: { username, activities },
            };
        }

        function setIndexes(username, activities) {
            if (lastIndexForUser[username] === undefined) {
                lastIndexForUser[username] = 0;
            }
            R.forEach((activity) => {
                indexMap[activity.originalIndex] = lastIndexForUser[username];
                lastIndexForUser[username]++;
            }, activities);
        }
    };
})(golab.tools.activityStatistics);
