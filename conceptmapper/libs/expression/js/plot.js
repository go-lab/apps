/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	plot.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Plotting using Highcharts
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	17/10/15  (Created)
 *		20/11/15  (Last modified)
 */
(function() {
    "use strict";
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = utils.is = utils.is || {};
    var timo = libs.timo = libs.timo || {};
    var cute3 = libs.cute3 = libs.cute3 || {};
    var Plot = timo.plot = timo.plot || {};

    Plot.plot = function(series, spec) {
        spec = spec || {};

        var x_axis_labels = {};

        if (spec.trigonometry === true) {
            x_axis_labels = {
                formatter: function() {
                    var val = this.value;
                    var pi = val/Math.PI;

                    return pi.toFixed(2) + '&pi;';
                },
                useHTML: true
            };
        }

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'plot',
                type: 'line',
                animation: false
            },

            credits: {
                enabled: false
            },

            title: {
                text: ''
            },

            subtitle: {
                text: ''
            },

            xAxis: {
                labels: x_axis_labels
            },

            legend: {
                enabled: false
            },

            series: series
        });
    };

}).call(this);
