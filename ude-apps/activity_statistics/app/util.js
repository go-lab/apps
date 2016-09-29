/* global moment */
(function(activityStatistics) {
    function escapeHTML(string) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
        };

        string = '' + string;
        return string.replace(/[&<>"'\/]/g, function(c) {
            return entityMap[c];
        });
    }

    function formatDate(date, format) {
        return moment(date).format(format);
    }

    // from http://stackoverflow.com/a/13542669
    function blendColors(color1, color2, percentage) {
        let f=parseInt(color1.slice(1),16),t=parseInt(color2.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
        return '#'+(0x1000000+(Math.round((R2-R1)*percentage)+R1)*0x10000+(Math.round((G2-G1)*percentage)+G1)*0x100+(Math.round((B2-B1)*percentage)+B1)).toString(16).slice(1);
    }

    const eventBus = {
        mapHeadersToRows(data) {
            if (!data.rows) return [];
            return data.rows.map((row) => {
                return data.header.reduce((result, header, index) => {
                    const title = header.title.toLowerCase();
                    let value = row[index];
                    if (header.dataType === 'zonedDateTime') {
                        value = new Date(value);
                    }
                    result[title] = value;
                    return result;
                }, {});
            });
        }
    };

    const throttle = (fn, delay) => $.throttle(delay, fn);

    // from http://davidwalsh.name/detect-scrollbar-width
    const measureScrollBarWidth = () => {
        const scrollDiv = document.createElement('div');
        scrollDiv.id = 'scrollbar_measure';
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    };

    const counter = () => {
        let current = 1;
        return () => current++;
    };

    const math = {
        // equilateral triangle
        equiTri: {
            areaFromHeight: (h) => Math.pow(h, 2) / Math.sqrt(3),
        },
    };

    const triggerActionOnEvent = (
        registerEvent,
        triggerAction,
        eventName,
        actionName
    ) => {
        registerEvent(eventName, (...args) => {
            triggerAction(actionName, ...args);
        });
    };

    const scaleEquals = (scaleA, scaleB) => {
        return (
            R.equals(scaleA.domain(), scaleB.domain()) &&
            R.equals(scaleA.range(), scaleB.range())
        );
    };

    activityStatistics.util = {
        triggerActionOnEvent,
        escapeHTML,
        formatDate,
        blendColors,
        eventBus,
        throttle,
        measureScrollBarWidth,
        counter,
        math,
        scaleEquals,
        colorBrewer: {
            paired: [
                '#a6cee3',
                '#1f78b4',
                '#b2df8a',
                '#33a02c',
                '#fb9a99',
                '#e31a1c',
                '#fdbf6f',
                '#ff7f00',
                '#cab2d6',
                '#6a3d9a',
                '#ffff99',
                '#b15928'
            ],
            set3: [
                '#8dd3c7',
                // '#ffffb3',
                '#bebada',
                '#fb8072',
                '#80b1d3',
                '#fdb462',
                '#b3de69',
                '#fccde5',
                '#d9d9d9',
                '#bc80bd',
                '#ccebc5',
                // '#ffed6f'
            ]
        },
    };
})(golab.tools.activityStatistics);
