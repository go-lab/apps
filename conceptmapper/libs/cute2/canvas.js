/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	canvas.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Canvas
 *  Works with	ECMAScript 5.1
 *  
 *  Notice	Copyright (c) 2012-2014  University of Twente
 *  
 *  Historh	04/07/12  (Created)
 *  		15/11/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Canvas
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

var canvas_uid = 0; // TBD - remove

(function() {
    var cute = this.cute;

    var Canvas = cute.Canvas = function(spec) {
        var canvas = this;
        var dom = null;
        var id = null;

        canvas._gesture = null;

        canvas._dom = null;
        canvas._context = null;
        canvas._uid = canvas_uid++;

        canvas._block_events = false;

        cute.Device.call(canvas);

        if (typeof(spec) === 'string')
            id = spec;
        else
            id = spec.id;

        if (id) {
            //  Remove initial # when present
            if (id.charAt(0) === '#') {
                id = id.substring(1, id.length);
            }
            dom = document.getElementById(id);
            if (!dom) {
                console.log('Warning: cute.Canvas: "' + id + '" not a canvas');
                return null;
            }
            canvas._canvas = dom;
            canvas._context = new cute.Context(canvas._canvas.getContext('2d'), canvas);
            canvas.id(id);
        } else {
            if (spec && spec.dummy) {
                dom = 'dummy';
                canvas._context = new cute.Context('dummy', canvas).dummy(true);
            } else
                if (spec) {
                    dom = spec.dom;
                    canvas._canvas = dom;
                    canvas._context = new cute.Context(dom.getContext('2d'), canvas);
                }
        }

        if (!dom || !canvas._context) {
            console.log('Error: cute.Canvas: ' + JSON.stringify(spec,null,4) + ' not a canvas');
            return null;
        }

        if (!canvas._context.dummy()) {
            canvas._area = new cute.Area(0, 0, canvas._canvas.width, canvas._canvas.height);
            canvas._width = canvas._canvas.width;
            canvas._height = canvas._canvas.height;
            canvas._modified = false;
            cute.ctx = canvas._context;

            canvas._gesture = null;

            if (spec.ignore_events !== true) {
                dom.onmousedown = function(ev) { canvas.mouse_event(ev, 'mouse_down'); };
                dom.onmouseup = function(ev) { canvas.mouse_event(ev, 'mouse_up'); };
                dom.onmouseout = function(ev) { canvas.mouse_event(ev, 'mouse_out'); };
                dom.onmousemove = function(ev) { canvas.mouse_event(ev, 'mouse_move'); };

                dom.ontouchstart = function(ev) { canvas.touch_event(ev, 'touch_start'); };
                dom.ontouchmove = function(ev) { canvas.touch_event(ev, 'touch_move'); };
                dom.ontouchend = function(ev) { canvas.touch_event(ev, 'touch_end'); };
                dom.ontouchleave = function(ev) { canvas.touch_event(ev, 'touch_out'); };
                dom.ontouchcancel = function(ev) { canvas.touch_event(ev, 'touch_cancel'); };
            }
        }

        return canvas;
    }

    { var F = function() {}; F.prototype = cute.Device.prototype; Canvas.prototype = new F(); Canvas.prototype.constructor = Canvas; Canvas.superclass = cute.Device.prototype; if (cute.Device.prototype.constructor == Object.prototype.constructor) cute.Device.prototype.constructor = cute.Device; };;

    Canvas.prototype.context = function() { return this._context; };
    Canvas.prototype.block_events = function(v0) { if (v0 === undefined) return this._block_events; this._block_events = v0; return this; };

    Canvas.prototype.clear = function(how) {
        cute.Figure.prototype.clear.call(this, how);
    }

    Canvas.prototype.is_a_canvas = function() {
        return (this._dom && this._context);
    }

    /** Override graphical width to return the real width of the canvas.
     */
    Canvas.prototype.width = function() {
        return this._canvas.width;
    }

    Canvas.prototype.height = function() {
        return this._canvas.height;
    }

    /*  Canvas has been modified. 
        Schedule a render as soon as possible.
     */
    Canvas.prototype.modified = function() {
        var canvas = this;

        if (canvas._modified)
            return canvas;
        canvas._modified = true;
//        printf('  **************** ignoring canvas.modified');
//        return canvas;
        setTimeout(function () { canvas.render(); }, 0);
        return canvas;
    }

    /**  Render the content of the canvas. This is effectively a complete redraw.
     *
     *   Options are:
     *       debug: [false],     // Debug information
     *       clear: [true],      // Clear screen before drawing
     *       scale: [1],         // Scale, 0.5 image is half in both x- and y direction
     *       offset: {x: 0, y: 0}// Offset
     */
    Canvas.prototype.render = function(opts) {
        opts = opts || {};
        var canvas = this;
        var ctx = canvas._context;
        var grs = canvas.graphicals();
        var ox = (opts.offset ? opts.offset.x : canvas._offset.x());
        var oy = (opts.offset ? opts.offset.y : canvas._offset.y());

        canvas._modified = false;

        if (opts.debug) {
            console.log('[Cute] Canvas render ');
        }

        if (opts.log) {
            console.log('Canvas.render ' + opts.log);
        }

            /* Clear the original size of the DOM canvas.
               The canvas._area changes dynamically.
             */
        if (opts.clear !== false) {
            if (opts.debug) {
                console.log('clear ' + canvas._width + ' ' + canvas._height);
                console.log('ox / oy ' + ox + ' ' + oy);
            }
            ctx.clearRect(0, 0, canvas._width, canvas._height);
        }

        if (canvas._background) {
            ctx.fillStyle(canvas._background);
            ctx.rect(0, 0, canvas._width, canvas._height);
            ctx.fill();
        }

        ctx.save();
        ctx.textBaseline('top');

        //  Make sure origin is x+0.5 such that if falls on whole pixels.
        //  Assumes that drawing functions (see context.src) round to integers.
        ox = Math.round(ox+0.49) + 0.5;
        oy = Math.round(oy+0.49) + 0.5;
        ctx.translate(ox, oy);

        if (opts.scale && opts.scale !== 1)
            ctx.scale(opts.scale, opts.scale);

        if (opts.debug) {
            console.log('[] Rendering ' + grs.length + ' objects');
        }

//        printf('canvas.grid ' + canvas.grid());
        if (canvas.grid())
            canvas.draw_grid(ctx);

        for (var i=0; i<grs.length; i++) {
            var gr = grs[i];

            if (gr instanceof cute.Plane) {
                gr.render_canvas(ctx, canvas);
                continue;
            }

            gr.Compute();

            if (gr._displayed === false)
                continue;

            gr.render_canvas(ctx, canvas);
            if (opts.debug) {
                console.log('  [Cute] ' + i + ' ' + gr);
                console.log('         ' + gr._area);
            }
        }

        ctx.translate(-ox, -oy);
        ctx.restore();

        if (opts.debug) {
            console.log('[] Rendering finished');
            ctx.debug(false);
        }

        return canvas;
    }

    Canvas.prototype.flash_colour = function(obj, colour, millis) {
        var c = this;
        var old = obj.colour();

        setTimeout(function() {
            obj.colour(colour);
            c.render();
        }, 0);
        setTimeout(function() {
            obj.colour(old);
            c.render();
        }, millis);
    }


    function relative_xy(event, c){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = c._canvas;

        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return {x:canvasX, y:canvasY}
    }



    /*  Touch event.  For the time being we forward this as the corresponding
        mouse event.
     */
    Canvas.prototype.touch_event = function(ev, type) {
        var canvas = this;

        if (type == 'touch_start') return this.mouse_event(ev, 'mouse_down');
        if (type == 'touch_end') return this.mouse_event(ev, 'mouse_up');
        if (type == 'touch_move') return this.mouse_event(ev, 'mouse_move');
        if (type == 'touch_leave') return this.mouse_event(ev, 'mouse_out');
        if (type == 'touch_cancel') {
            if (canvas._gesture)
                canvas._gesture.cancel();
            canvas._gesture = null;
            return canvas;
        }
    }

    /*  Mouse event.  At the moment this can only deal with one gesture at a
        time.

        TBD -- When two events are physically close on the screen it could be that
        the decision on which gesture (e.g., move or click) has to be delayed
        until the next event comes in.
     */
    Canvas.prototype.mouse_event = function(ev, type) {
        var canvas = this;

        if (canvas._block_events) {
            return canvas;
        }

        var coords = relative_xy(ev, canvas);
        var x = coords.x;
        var y = coords.y;
        var event = new cute.Event(ev, type, canvas, x, y, ev.timeStamp);
        var g = canvas._gesture;
        var c = ', ';

        if (type === 'mouse_move' && !g)
            return canvas;

        ev.preventDefault();

        if (type === 'mouse_down') { // find matching gesture
            if (g) {
                console.log('THIS SHOULD NOT HAPPEN');
                console.log('  terminate ' + g + ' because of new mouse_down');
                g.terminate(event);
                canvas._gesture;
                return canvas;
            }
            canvas._gesture = null;
            canvas.event(event, x, y);
            canvas._gesture = event._gesture;

            return canvas;
        }

        if (type === 'mouse_move') { // call .drag
            if (g) {
                event._gesture = g;
                g.drag(event);
                canvas._gesture = event._gesture;
    //	    ev.preventDefault();
            }
            return canvas;
        }

        if (type === 'mouse_up') { // call .terminate
            if (g) {
                event._gesture = g;
                g.terminate(event);
                canvas._gesture = null;
    //	    ev.preventDefault();
            }
            return canvas;
        }

        if (type === 'mouse_out') { // call .cancel
            if (g) {
                event._gesture = g;
                g.cancel(event);
                canvas._gesture = null;
    //	    ev.preventDefault();
            }
            return canvas;
        }
    }


    /*  Reset internal and visible state of the canvas.
     */
    Canvas.prototype.reset = function() {
        var canvas = this;
        var g = canvas._gesture;

        canvas._gesture = null;
        if (g) {
            g.cancel(); // TBD - sometimes fails
        }

        return canvas;
    }
}).call(this);
