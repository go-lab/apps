$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },

        credits: {
            enabled: false
        },

        title: {
            text: reflect.translate('percentage_time_spent')
        },

        xAxis: {
            categories: ["Orientation", "Conceptualisation", "Investigation", "Conclusion", "Discussion"],
            title: {
                text: null
            },
            labels: {
                style: {
                    'font-size': '18px'
                }
            }
        },

        yAxis: {
            min: 0,
            //                        max: 100,
            title: {
                text: null
            },
            labels: {
                formatter: function() {
                    return this.value + '%';
                }
            }
        },

        legend: {
        },
        
        series: [
            {
                "name": "Suggested",
                "data": [
                    20,
                    20,
                    20,
                    20,
                    20
                ]
            },
            {
                "name": "Yours",
                "data": [
                    20.24377272658598,
                    19.963894524141022,
                    19.787115406316747,
                    19.840281475611178,
                    20.16493586734507
                ]
            }
        ]
    });
});
