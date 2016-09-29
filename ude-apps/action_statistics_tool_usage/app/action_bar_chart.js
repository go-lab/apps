(function (actionStatistics) {
    function render(actionData, container, getMsg) {
        container = d3.select(container);
        container.select('svg').remove();

        var canvas = container
            .append('svg')
            .style('height', '100%');

        actionData = transformData(actionData, getMsg);

        nv.addGraph(createChart.bind(null, actionData, canvas, getMsg));
    }

    function createChart(data, canvas, getMsg) {
        var toPercentString = d3.format('.2p');
        var chart = nv.models.multiBarChart()
            .color(d3.scale.category20().range())
            .groupSpacing(0.3)
            .staggerLabels(true)
            .reduceXTicks(false);

        chart.yAxis
            .axisLabel(getMsg('usage_relative_to_max'))
            .tickFormat(toPercentString)
            .ticks(10);

        chart.tooltip.valueFormatter(function (usage) {
            return toPercentString(usage) + ' ' + getMsg('usage_relative_to_max');
        });

        chart.controlLabels({
            'grouped': getMsg('grouped'),
            'stacked': getMsg('stacked'),
        });

        canvas.datum(data);
        canvas.transition().duration(0).call(chart);

        nv.utils.windowResize(chart.update);

        //resize gadget after resizing the chart
        //fixed value - flexible version is not working inside the graasp view
        gadgets.window.adjustHeight(600);
        return chart;
    }

    function transformData(actionData, getMsg) {
        actionData.data = actionData.data.map(function (d) {
            if (d.label == "Average") {
                d.title = d.label = getMsg("average");
            }
            return d;
        });

        return actionData.metadata.measures.map(function (measure) {
            var maxValue = actionData.data.reduce(function (maxValue, datum) {
                if (datum[measure.property] > maxValue) {
                    return datum[measure.property];
                }
                return maxValue;
            }, -Infinity);
            var values = actionData.data.map(function (datum) {
                return {
                    x: datum.label,
                    y: datum[measure.property] / maxValue
                };
            });
            return {
                key: measure.title,
                values: values,
            };
        });
    }

    actionStatistics.actionBarChart = {
        render: render
    };
})(golab.tools.actionStatistics);
