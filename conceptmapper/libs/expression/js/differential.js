/*  Use with gcc -E -x c -P -C *.h > *.js 
 */
/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        differential.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Algorithms for differential equations
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     20/11/15  (Created)
 *		21/11/15  (Last modified)
 */
(function() {
    "use strict";
    console.log('========== loading libs/expression/js/differential.js');

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));

    var timo = (libs.timo || require('./expression'));
    var Differential = timo.differential = timo.differential || {};

    if (is.in_nodejs())
        module.exports = Differential;

    Differential.RungeKutta4 = function(t, y, secs, f) {
        var rval = [];
        var h = 0.1;
        var n = (1/h * secs) + 1;
        var inc = 0;

        rval.push({ t: t, y: y});
        for (var i=0; i<n; i++) {
            var k1 = f.compute({ t: t, y: y });
            var k2 = f.compute({ t: t + h/2, y: y + h/2 * k1 });
            var k3 = f.compute({ t: t + h/2, y: y + h/2 * k2 });
            var k4 = f.compute({ t: t + h, y: y + h*k3 });
            inc = h/6 * (k1 + 2*k2 + 2*k3 + k4);

            y = y + inc;
            t = t + h;

            var result = { t: t, y: y, inc: inc, k1: k1, k2: k2, k3: k3, k4: k4};
            console.log(result);

            rval.push(result);
        }

        return rval;
    };

    Differential.StepRungeKutta4 = function(t, t0, y, y0, h, f, ks) {
        console.log('STEP ' + y0.toFixed(3) + ' ' + f);
        var e1 = {};
        e1[t] = t0;
        e1[y] = y0;
        if (ks)
            e1.v = t0 * 9.8;
        var k1 = f.compute(e1);

        var e2 = {};
        e2[t] = t0 + h/2;
        e2[y] = y0 + h/2 * k1;
        if (ks)
            e2.v = (t0+h/2) * 9.8;
        var k2 = f.compute(e2);

        var e3 = {};
        e3[t] = t0 + h/2;
        e3[y] = y0 + h/2 * k2;
        if (ks)
            e3.v = (t0+h/2) * 9.8;
        var k3 = f.compute(e3);

        var e4 = {};
        e4[t] = t0 + h;
        e4[y] = y0 + h * k3;
        if (ks)
            e4.v = (t0+h) * 9.8;
        var k4 = f.compute(e4);

        var rval = {
            value: h/6 * (k1 + 2*k2 + 2*k3 + k4),
            ks: [k1,k2,k3,k4]
        };
        console.log('------------- ' + y + ' ' + rval.value);

        return rval;
    };
}).call(this);
