((activityStatistics) => {
    const { util } = activityStatistics;
    const isPhase = (target) => {
        return (
            target === 'Orientation' || target === 'Conceptualisation' ||
            target === 'Investigation' || target === 'Discussion' ||
            target === 'Conclusion'
        );
    };
    const onlyActivities = R.filter((a) => !isPhase(a.targetname));
    const rawDataHeader = [{
        dataType: 'string',
        title: 'targetname'
    }, {
        dataType: 'zonedDateTime',
        title: 'timestamp'
    }];

    // converts event bus messages to domain events
    // keeps track of the raw data to handle changes to data
    activityStatistics.RawAppDataHandler = () => {
        const rawData = {};

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
            rawData[message.multiResultKey] = {
                rows: message.rows || [],
                username: message.username
            };
            return R.pipe(
                util.eventBus.mapHeadersToRows,
                onlyActivities,
                (activities) => {
                    return {
                        name: 'initial_app_activities',
                        data: { username: message.username, activities }
                    };
                }
            )(message);
        }

        function handleDeltaMessage(message) {
            if (!message.logs) return undefined;
            const log = message.logs[0];
            if (!log) return undefined;
            if (log.actionName === 'appendRow') {
                return handleAppendRow(message.multiResultKey, log);
            }
            if (log.actionName === 'changeCell') {
                return handleChangeCell(message.multiResultKey, log);
            }
        }

        function handleChangeCell(key, data) {
            const affectedRow = rawData[key].rows[data.rowIndex];
            const affectedHeader = rawDataHeader[data.columnIndex];
            const previousValue = affectedRow[data.columnIndex];
            if (previousValue === data.newValue) {
                return null;
            }
            affectedRow[data.columnIndex] = data.newValue;
            let value = data.newValue;
            if (affectedHeader.dataType === 'zonedDateTime') {
                value = new Date(value);
            }
            return {
                name: 'app_activity_changed',
                data: {
                    username: rawData[key].username,
                    property: affectedHeader.title.toLowerCase(),
                    activityIndex: data.rowIndex,
                    value,
                }
            };
        }

        function handleAppendRow(key, data) {
            rawData[key].rows[data.index] = data.values;
            const activity = util.eventBus.mapHeadersToRows({
                header: rawDataHeader,
                rows: [data.values],
            })[0];

            return {
                name: 'app_activity_added',
                data: {
                    username: rawData[key].username,
                    activity
                },
            };
        }
    };
})(golab.tools.activityStatistics);
