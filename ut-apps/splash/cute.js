/*  $Id$
 *  
 *  File	main.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Define kernel
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Cute
 *------------------------------------------------------------*/

var cute = {
    version: '2013.02.03',
    author:  'Anjo Anjewierden',
    email:   'a.a.anjewierden@utwente.nl',

    ctx:     null,

    extend: function(sub_class, super_class) {
	var F = function() {};
    
	F.prototype = super_class.prototype;
	sub_class.prototype = new F();
	sub_class.prototype.constructor = sub_class;
    
	sub_class.superclass = super_class.prototype;
	if (super_class.prototype.constructor == Object.prototype.constructor)
	    super_class.prototype.constructor = super_class;
    },

    distance: function(x1, y1, x2, y2) {
	return  Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
    },

    toInt: function(n) {
	return Math.round(n);
    },

    delete_from_array: function(array, elem) {
	for (var i=0; i<array.length; i++)
	    if (array[i] === elem)  {
		array.splice(i, 1);
		return;
	    }
	return;
    },

    orientation_area: function(w, h) {
	return (w>=0 ? (h>=0 ? "north_west" : "south_west")
		: (h>=0 ? "north_east" : "south_east"));
    },

/*------------------------------------------------------------
 *  Check whether the area or figure of a graphical has changed
 *------------------------------------------------------------*/

    gr_old_x: 0,
    gr_old_y: 0,
    gr_old_w: 0,
    gr_old_h: 0,
    gr_old_fig: null,

    changing_graphical: function(gr) {
	var a = gr._area;

	cute.gr_old_x = a._x;
	cute.gr_old_y = a._y;
	cute.gr_old_w = a._w;
	cute.gr_old_h = a._h;
	cute.gr_old_fig = a._figure;
    },

    changed_graphical: function(gr) {
	var a = gr._area;

	if ((a._x !== cute.gr_old_x ||
	     a._y !== cute.gr_old_y ||
	     a._w !== cute.gr_old_w ||
	     a._h !== cute.gr_old_h) && a._figure === cute.gr_old_fig)
	    gr.changed_area(a._x, a._y, a._w, a._h);
    }
};
/*  $Id$
 *  
 *  File	area.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of the class Area
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Area
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Area = function(x, y, w, h) {
    this._x = (x ? cute.toInt(x) : 0);
    this._y = (y ? cute.toInt(y) : 0);
    this._w = (w ? cute.toInt(w) : 0);
    this._h = (h ? cute.toInt(h) : 0);

    return this;
}

cute.Area.prototype.x = function(x) {
    if (x) {
	this._x = x;
	return this;
    }
    return this._x;
}

cute.Area.prototype.y = function(y) {
    if (y) {
	this._y = y;
	return this;
    }
    return this._y;
}

cute.Area.prototype.w = function(w) {
    if (w) {
	this._w = w;
	return this;
    }
    return this._w;
}

cute.Area.prototype.h = function(h) {
    if (h) {
	this._h = h;
	return this;
    }
    return this._h;
}

cute.Area.prototype.toString = function() {
    var a = this;
    return '[' + [a._x,+a._y,a._w,a._h].join(', ') + '] ';
}

cute.Area.prototype.normalise = function() {
    if (this._w < 0) this._x += w + 1, this._w = -w;
    if (this._h < 0) this._y += h + 1, this._h = -h;
    return this;
}

cute.Area.prototype.equal = function(a) {
    this.normalise();
    a.normalise();
    return (this._x === a._x && this._y === a._y
	    && this._w === a._w && this._h === a._h);
}
	   
cute.Area.prototype.clear = function() {
    this._x = 0;
    this._y = 0;
    this._w = 0;
    this._h = 0;

    return this;
}

cute.Area.prototype.intersection = function(a) {
    var x, y, w, h;
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
    var bx = b._x, by = b._y, bw = b._w, bh = b._h;
    var orient;
    var norm;

    orient = cute.orientation_area(aw, ah);

    this.normalise();
    a.normalise();

    x = (ax > bx ? ax : bx);
    y = (ay > by ? ay : by);
    w = (ax + aw < bx + bw ? ax + aw : bx + bw) - x;
    h = (ay + ah < by + bh ? ay + ah : by + bh) - y;

    if (w < 0 || h < 0) {
	this.clear();
	return false;
    }

    return this.orientate_area(orientation);
}

cute.Area.prototype.orientate_area = function(d) {
    var a = this;
    var w = a._w, h = a._h;

    if (d === 'north_west')
    { if (w < 0) a._x += w+1, w = -w;
      if (h < 0) a._yy += h+1, h = -h;
    } else if (d == 'south_west')
    { if (w < 0) a._x += w+1, w = -w;
      if (h > 0) a._y += h-1, h = -h;
    } else if (d == 'north_east')
    { if (w > 0) a._x += w-1, w = -w;
      if (h < 0) a._y += h+1, h = -h;
    } else if (d == 'south_east')
    { if (w > 0) a._x += w-1, w = -w;
      if (h > 0) a._y += h-1, h = -h;
    }

    return a;
}

cute.Area.prototype.orientate = function(a, d) {
    var x = a._x, y = a._y, w = a._w, h = a._h;

    switch (d) {
    case 'north_west':
	if (w < 0) x += w+1, w = -w;
	if (h < 0) y += h+1, h = -h;
	break;
    case 'south_west':
	if (w < 0) x += w+1, w = -w;
	if (h > 0) y += h-1, h = -h;
	break;
    case 'north_east':
	if (w > 0) x += w-1, w = -w;
	if (h < 0) y += h+1, h = -h;
	break;
    case 'south_east':
	if (w > 0) x += w-1, w = -w;
	if (h > 0) y += h-1, h = -h;
    }
    a._x = x, a._y = y, a._w = w, a._h = h;

    return this;
}

cute.Area.prototype.orientation = function(orient) {
    if (orient === undefined)
      return cute.orientation_area(this._w, this._h);

    return this.orientate(orient);
}    
      

cute.Area.prototype.union = function(b) {
    var x, y, w, h;
    var bx = b._x, by = b._y, bw = b._w, bh = b._h;
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;

    this.normalise();
    a.normalise();

    x = (ax < bx ? ax : bx);
    y = (ay < by ? ay : by);
    w = (ax + aw > bx + bw ? ax + aw : bx + bw) - x;
    h = (ay + ah > by + bh ? ay + ah : by + bh) - y;

    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;

    return this;
}

cute.Area.prototype.union_normalised = function(b) {
    if (b._w === 0 && b._h === 0)
	return this;
    if (this._w === 0 && this._h === 0) {
	this.copy(b);
	return this.normalise();
    }

    b.normalise();

    var x, y, w, h;
    var bx = b._x, by = b._y, bw = b._w, bh = b._h;
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;

    x = (ax < bx ? ax : bx);
    y = (ay < by ? ay : by);
    w = (ax + aw > bx + bw ? ax + aw : bx + bw) - x;
    h = (ay + ah > by + bh ? ay + ah : by + bh) - y;

    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;

    return this;
}


cute.Area.prototype.size = function(s) {
    if (s === undefined)
	return new cute.Size(this._w, this._h);
    this._w = s._w;
    this._h = s._h;

    return this;
}

cute.Area.prototype.measure = function() {
    return this._w * this._h;
}

cute.Area.prototype.point_in = function(p) {
    var x = p._x, y = p._y;
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;

    this.normalise();
    return (x >= ax && x <= ax+aw && y >= ay && y <= ay+ah);
}

cute.Area.prototype.overlap = function(b) {
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
    var bx = b._x, by = b._y, bw = b._w, bh = b._h;

    this.normalise();
    b.normalise();

    return (by >= ay+ah || by+bh <= ay || bx >= ax+aw || bx+bw <= ax);
}

cute.Area.prototype.relative_move = function(p) {
    this._x += p._x;
    this._y += p._y;

    return this;
}

cute.Area.prototype.relative_move_back = function(p) {
    this._x -= p._x;
    this._y -= p._y;

    return this;
}

cute.Area.prototype.position = function(p) {
    if (p === undefined)
	return new cute.Point(this._x, this._y);
    this._x = p._x;
    this._y = p._y;

    return this;
}

cute.Area.prototype.copy = function(a) {
    if (a) {
	this._x = a._x;
	this._y = a._y;
	this._w = a._w;
	this._h = a._h;
	return this;
    }
    return new cute.Area(this._x, this._y, this._w, this._h);
}

cute.Area.prototype.inside = function(b) {
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
    var bx = b._x, by = b._y, bw = b._w, bh = b._h;

    this.normalise();
    b.normalise();

    if (bx < ax)		return false;
    if (bx+bw > ax+aw-1)	return false;
    if (by < ay)		return false;
    if (by+bh > ay+ah-1)	return false;

    return true;
}

cute.Area.prototype.distance_x = function(b) {
    var ax = this._x, aw = this._w;
    var bx = b._x, bw = b._w;

    if ( aw < 0 ) ax += aw, aw = -aw;
    if ( bw < 0 ) bx += bw, bw = -bw;

    if ( ax + aw < bx ) return cute.toInt(bx-(ax+aw));
    if ( bx + bw < ax ) return cute.toInt(ax-(bx+bw));

    return 0;
}

cute.Area.prototype.distance_y = function(b) {
    var ay = this._y, ah = this._h;
    var by = b._y, bh = b._h;

    if ( ah < 0 ) ay += ah, ah = -ah;
    if ( bh < 0 ) by += bh, bh = -bh;

    if ( ay + ah < by ) return cute.toInt(by-(ay+ah));
    if ( by + bh < ay ) return cute.toInt(ay-(by+bh));

    return 0;
}

cute.Area.prototype.distance = function(b) {
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
    var bx = b._x, by = b._y, bw = b._w, bh = b._h;

    this.normalise();
    b.normalise();

    if (a.overlap(b))
	return 0;

    if (ay+ah < by)
    { if (bx+bw < ax)
	return cute.toInt(distance(bx+bw, by, ax, ay+ah));
      if (bx > ax+aw)
	  return cute.toInt(distance(ax+aw, ay+ah, bx, by));
      return cute.toInt(by-(ay+ah));
    }

    if (by+bh < ay)
    { if (ax+aw < bx)
	return cute.toInt(distance(ax+aw, ay, bx, by+bh));
      if (bx+bw < ax)
	  return cute.toInt(distance(bx+bw, by+bh, ax, ay));
      return cute.toInt(ay-(by+bh));
    }

    if (ax+aw < bx)
	return cute.toInt(bx-(ax+aw));

    return cute.toInt(ax-(bx+bw));

    return 0;
}

cute.Area.prototype.center = function(p) {
    if (p === undefined)
	return new cute.Point(this._x + this._w/2, this._y + this._h/2);
    this._x = p._x - this._w/2;
    this._y = p._y - this._h/2;

    return this;
}

cute.Area.prototype.left_side = function(p) {
    if (this._w >= 0)
	return this._x;
    return this._x + this._w;
}

cute.Area.prototype.right_side = function(p) {
    if (this._w >= 0)
	return this._x + this._w;
    return this._x;
}

cute.Area.prototype.top_side = function(p) {
    if (this._h >= 0)
	return this._y;
    return this._y + this._h;
}

cute.Area.prototype.bottom_side = function(p) {
    if (this._h >= 0)
	return this._y + this._h;
    return this._y;
}

cute.Area.prototype.corner = function(p) {
    if (p === undefined)
	return new cute.Point(this._x + this._w, this._y + this._h);
    var w, h;

    w = p._x - this._x;
    w += (w>=0 ? 1 : -1);
    h = p._y - this._y;
    h += (h>=0 ? 1 : -1);

    this._w = cute.toInt(w);
    this._h = cute.toInt(h);

    return this;
}

cute.Area.prototype.set = function(x, y, w, h) {
    if (x) this._x = x;
    if (y) this._y = y;
    if (w) this._w = w;
    if (h) this._h = h;

    return this;
}

cute.Area.prototype.increase = function(n) {
    var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
    var d = cute.toInt(n);

    if (aw >= 0)
	aw += 2*d, ax -= d;
    else
	aw -= 2*d, ax += d;

    if (ah >= 0)
	ah += 2*d, ay -= d;
    else
	ah -= 2*d, ay += d;

    this._x = cute.toInt(ax);
    this._y = cute.toInt(ay);
    this._w = cute.toInt(aw);
    this._h = cute.toInt(ah);

    return this;
}


cute.Area.prototype.decrease = function(n) {
    return this.increase(-n);
}
/*  $Id$
 *  
 *  File	point.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Point
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Point
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Point = function(x, y) {
    this._x = (x ? cute.toInt(x) : 0);
    this._y = (y ? cute.toInt(y) : 0);

    return this;
}

cute.Point.prototype.x = function(x) {
    if (x) {
	this._x = x;
	return this;
    }
    return this._x;
}

cute.Point.prototype.y = function(y) {
    if (y) {
	this._y = y;
	return this;
    }
    return this._y;
}

cute.Point.prototype.toString = function() {
    var pt = this;
    var c = ", ";

    return 'cute.Point(' + pt._x + c + pt._y + ')';
}

cute.Point.prototype.equal = function(p) {
    return this._x === p._x && this._y === p._y;
}

cute.Point.prototype.copy = function(p) {
    if (p) {
	this._x = p._x;
	this._y = p._y;
	return this;
    }
    return new cute.Point(this._x, this._y);
}

cute.Point.prototype.set = function(x, y) {
    if (x) this._x = cute.toInt(x);
    if (y) this._y = cute.toInt(y);

    return this;
}

cute.Point.prototype.offset = function(x, y) {
    this._x += cute.toInt(x);
    this._y += cute.toInt(y);

    return this;
}

cute.Point.prototype.difference = function(p) {
    return new cute.Point(this._x - p._x, this._y - p._y);
}

cute.Point.prototype.distance = function(p) {
    return cute.distance(this._x, this._y, p._x, p._y);
}

cute.Point.prototype.mid_point = function(p) {
    return new cute.Point(cute.toInt((this._x+p._x+1)/2),
			  cute.toInt((this._y+p._y+1)/2));
}

cute.Point.prototype.plus = function(p) {
    this._x += p._x;
    this._y += p._y;
}

cute.Point.prototype.minus = function(p) {
    this._x -= p._x;
    this._y -= p._y;
}

cute.Point.prototype.mirror = function(p) {
    var mx = 0, my = 0;

    if (p !== undefined)
	mx = p._x, my = p._y;

    this._x = mx - p._x;
    this._y = my - p._y;

    return this;
}
/*  $Id$
 *  
 *  File	size.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Size
 *  Works with	JavaScript
 *  
 *  Notice	Cophright (c) 2012, 2013  Universith of Twente
 *  
 *  Historh	06/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Size
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Size = function(w, h) {
    this._w = (w ? cute.toInt(w) : 0);
    this._h = (h ? cute.toInt(h) : 0);

    return this;
}

cute.Size.prototype.w = function(w) {
    if (w) {
	this._w = w;
	return this;
    }
    return this._w;
}

cute.Size.prototype.h = function(h) {
    if (h) {
	this._h = h;
	return this;
    }
    return this._h;
}

cute.Size.prototype.toString = function() {
    var comma = ", ";
    return "size(" + this._w + comma+ this._h + ")";
}

cute.Size.prototype.equal = function(s) {
    return this._w === s._w && this._h === s._h;
}

cute.Size.prototype.union = function(s) {
    if (this._w < s._w)
	this._w = s._w;
    if (this._h < s._h)
	this._h = s._h;

    return this;
}

cute.Size.prototype.copy = function(s) {
    if (s) {
	this._w = s._w;
	this._h = s._h;
	return this;
    }
    return new cute.Size(this._w, this._h);
}

cute.Size.prototype.set = function(w, h) {
    if (w) this._w = w;
    if (h) this._h = h;

    return this;
}

cute.Size.prototype.offset = function(w, h) {
    this._w += cute.toInt(w);
    this._h += cute.toInt(h);

    return this;
}
/*  $Id$
 *  
 *  File	draw.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Low-level drawing routines
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	11/07/12  (Created)
 *  		06/08/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Debugging
 *------------------------------------------------------------*/

function debug_ctx(ctx, label) {
    console.log(label);
    console.log('  lineWidth:     ' + ctx.lineWidth);
    console.log('  strokeStyle:   ' + ctx.strokeStyle);
    console.log('  fillStyle:     ' + ctx.fillStyle);
    console.log('  font:          ' + ctx.font);
    console.log('  shadowColor:   ' + ctx.shadowColor);
    console.log('  shadowBlur:    ' + ctx.shadowBlur);
    console.log('  shadowOffsetX: ' + ctx.shadowOffsetX);
    console.log('  shadowOffsetY: ' + ctx.shadowOffsetY);
}


/*------------------------------------------------------------
 *  Low-level drawing routines
 *------------------------------------------------------------*/

function r_clear(ctx, x, y, w, h) {
    ctx.clearRect(x, y, w, h);
}

function r_line_width(ctx, pen) {
    ctx.lineWidth = pen;
}

function r_font(ctx, font) {
    if (font instanceof cute.Font) 
	ctx.font = font.css();
    else 
	ctx.font = font;
}

function r_stroke_style(ctx, colour) {
    if (colour === undefined)
	ctx.strokeStyle = '#000000'
    else if (colour instanceof cute.Colour)
	ctx.strokeStyle = colour._css;
    else
	ctx.strokeStyle = colour;
}

function r_fill_style(ctx, fill) {
    if (fill === undefined)
	ctx.fillStyle = '#000000';
    else if (fill instanceof cute.Colour)
	ctx.fillStyle = fill._css;
    else
	ctx.fillStyle = fill;
}

function r_shadow(ctx, sh) {
    if (sh instanceof cute.Shadow) {
	ctx.shadowColor = sh._colour;
	ctx.shadowBlur = sh._blur;
	ctx.shadowOffsetX = sh._offset_x;
	ctx.shadowOffsetY = sh._offset_y;
	return;
    }
    if (sh === undefined) {
	ctx.shadowBlur = 0;
    }
}

function r_text(ctx, str, x, y, base) {
    ctx.textBaseline = base || 'alphabetic';
    ctx.fillText(str, x, y);
//  ctx.strokeText(str, x, y);
}


function r_rect(ctx, x, y, w, h) {
    ctx.rect(x, y, w, h);
}

function r_fill(ctx) {
//  debug_ctx('r_fill', ctx);
    console.log('r_fill ' + ctx.fillStyle);
    ctx.fill();
}

function r_stroke(ctx) {
//  debug_ctx('r_stroke', ctx);
    ctx.stroke();
}

function r_fill_rect(ctx, x, y, w, h) {
//  debug_ctx(ctx);
    ctx.fillRect(x, y, w, h);
}


function r_draw_image(ctx, img, x, y) {
    ctx.drawImage(img, x, y);
}

function r_stroke_rect(ctx, x, y, w, h) {
    ctx.strokeRect(x, y, w, h);
}


/**
 *  Rounded corner triangle using arcTo.
 *
 *  @author http://www.dbp-consulting.com/tutorials/canvas/CanvasArcTo.html
 */
function r_rounded_rect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.save(); // save the context so we don't mess up others
    ctx.beginPath(); // draw top and top right corner
    ctx.moveTo(x+radius,y);
    ctx.arcTo(x+width,y,x+width,y+radius,radius);
    // draw right side and bottom right corner
    ctx.arcTo(x+width,y+height,x+width-radius,y+height,radius); // draw bottom and bottom left corner
    ctx.arcTo(x,y+height,x,y+height-radius,radius); // draw left and top left corner
    ctx.arcTo(x,y,x+radius,y,radius);
    if (fill)
	ctx.fill();
    if (stroke)
	ctx.stroke();
    ctx.restore(); 
}

function r_stroke_rounded_rect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.stroke();
}

function r_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function r_fill_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function r_stroke_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
}


/*------------------------------------------------------------
 *  Ellipse
 *------------------------------------------------------------*/

function r_ellipse(ctx, x, y, w, h) {
    r_draw_ellipse(ctx, x, y, w, h, true, true);
}

function r_stroke_ellipse(ctx, x, y, w, h) {
    r_draw_ellipse(ctx, x, y, w, h, false, true);
}

function r_fill_ellipse(ctx, x, y, w, h) {
    r_draw_ellipse(ctx, x, y, w, h, true, false);
}

function r_draw_ellipse(ctx, x, y, w, h, fill, stroke) {
    var kappa = 0.5522848;
    var ox, oy, xe, ye, xm, ym;

    ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w,           // x-end
    ye = y + h,           // y-end
    xm = x + w / 2,       // x-middle
    ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    if (fill)
	ctx.fill();
    if (stroke)
	ctx.stroke();
}


function r_arc(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function r_stroke_arc(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, true);
    ctx.closePath();
    ctx.stroke();
}

function r_fill_arc(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, true);
    ctx.closePath();
    ctx.fill();
}

function r_line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
//  ctx.lineCap = 'square';
    if (ctx.lineWidth === 1) {
	ctx.moveTo(x1-0.5, y1-0.5);
	ctx.lineTo(x2-0.5, y2-0.5);
    } else {
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.stroke();
}


function r_fill_polygon(ctx, a) {
    var x = 0, y = 1;

    ctx.beginPath();
    ctx.moveTo(a[x], a[y]);
    for (x=2, y=3; x<a.length; x+=2, y+=2)
	ctx.lineTo(a[x], a[y]);
    ctx.closePath();
    ctx.fill();
}


function r_path(ctx, points, ox, oy, closed, fill) {
    if (points.length < 2)
	return;

    var x0 = 0, y0 = 0;

    ctx.beginPath();
    for (i=0; i<points.length; i++) {
	var x = points[i]._x + ox;
	var y = points[i]._y + oy;
	
	if (i === 0) {
	    ctx.moveTo(x, y);
	    x0 = x, y0 = y;
	} else {
	    ctx.lineTo(x, y);
	}
    }
    if (closed) {
	ctx.lineTo(x0, y0);
    }
    ctx.closePath();
    if (ctx.lineWidth > 0) {
	ctx.stroke();
    }
    if (fill) {
	r_fill_style(ctx, fill);
	ctx.fill();
    }
}


function new_radial_gradient(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var grd;

    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (var i=0; i<stops.length; i++) {
	grd.addColorStop(stops[i].value, stops[i].color);
    }

    return grd;
}


function r_radial_gradient(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var grd;

    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (var i=0; i<stops.length; i++) {
	grd.addColorStop(stops[i].value, stops[i].color);
    }

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x0, y0, Math.max(r0,r1), 0, 2 * Math.PI, true);
    ctx.fill();
}


function r_radial_box(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var grd;

    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (var i=0; i<stops.length; i++) {
	grd.addColorStop(stops[i].value, stops[i].color);
    }
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.rect(x0, y0, r0, r1);
    ctx.fill();
}


function r_gradient_box(ctx, x, y, w, h, stops) {
    var grd;

    grd = ctx.createLinearGradient(x, y, x, y+h);
    for (var i=0; i<stops.length; i++) {
	grd.addColorStop(stops[i].value, stops[i].color);
    }
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
}

/*  $Id$
 *  
 *  File	graphical.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Graphical
 *  Works with	JavaScript
 *  
 *  Notice	Cophright (c) 2012  Universith of Twente
 *  
 *  Historh	06/07/12  (Created)
 *  		23/11/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Graphical
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Graphical = function(x, y, w, h) {
    this._id = undefined;
    this._class_name = undefined;

    this._figure = null;
    this._area = new cute.Area(x, y, w, h);
    this._displayed = false;
    this._pen = 1;
    this._colour = 'black';
    this._fill_pattern = undefined;
    this._handles = [];
    this._connections = [];
    this._name = undefined;
    this._selected = false;
    this._inverted = false;
    this._active = true;
    this._cursor = undefined;
    this._request_compute = true;
    this._shadow = undefined;
    this._layout_manager = null;

    this._recognisers = [];

    return this;
}

cute.Graphical.prototype.toString = function() {
    var comma = ", ";

    return "graphical(" + this._id + comma + this._name + ")";
}

cute.Graphical.prototype.print_tree = function(depth) {
    var gr = this;
    var tab = '';

    if (depth === undefined)
	depth = 0;
    
    for (var d=0; d<depth; d++)
	tab += '  ';
    console.log(tab + gr);

    return gr;
}

cute.Graphical.prototype.free = function() {
    return this.unlink();
}

cute.Graphical.prototype.unlink = function() {
    var gr = this;

    gr.disconnect();
    gr.figure(null);

    return gr;
}

cute.Graphical.prototype.disconnect = function() {
//  console.log('Graphical.disconnect not defined');	// TBD
}

cute.Graphical.prototype.id = function(id) {
    if (id) {
	this._id = id;
	return this;
    }
    return this._id;
}
	
cute.Graphical.prototype.class_name = function(name) {
    var gr = this;

    if (name === undefined) 
	return gr._class_name;
    gr._class_name = name;

    return gr;
}
	
cute.Graphical.prototype.name = function(name) {
    if (name) {
	this._name = name;
	return this;
    }
    return this._name;
}

cute.Graphical.prototype.colour = function(col) {
    var gr = this;

    if (col) {
	if (gr._colour != col) {
	    gr._colour = col;
	    gr.request_compute();
	}
	return gr;
    }
    return gr._colour;
}

cute.Graphical.prototype.shadow = function(sh) {
    var gr = this;

    if (sh === undefined)
	return gr._shadow;
    if (gr._shadow != sh) {
	gr._shadow = sh;
	gr.request_compute(true);
    }
    return gr;
}

cute.Graphical.prototype.fill_pattern = function(pat) {
    if (pat) {
	if (this._fill_pattern != pat)
	    this._fill_pattern = pat;
	this.request_compute(true);
	return this;
    }
    return this._fill_pattern;
}
	
cute.Graphical.prototype.pen = function(pen) {
    var gr = this;

    if (pen === undefined)
	return gr._pen;
    if (gr._pen !== pen) {
	gr._pen = pen;
	gr.request_compute();
    }
    return gr;
}
	

/** Shake graphical for a certain duration.
 *
 *  @param {xd} Amount to shake in the x direction (10 is reasonable)
 *  @param {yd} Amount to shake in the y direction (0)
 *  @param {interval} Number of milliseconds between moves (60)
 *  @param {duration} Total duration (milliseconds) of the shake (1000)
 *  @param {done} Function to call when shake is finished, gr is passed
 */
cute.Graphical.prototype.shake = function(xd, yd, interval, duration, done) {
    var gr = this;

    setTimeout(function()
	       { shake_gr(gr, xd, yd, 1, interval, duration-interval, done);},
	       interval);
}

function shake_gr(gr, xd, yd, state, interval, duration, done) {
    var canvas = gr.device();
    var x, y;

    console.log(Date.now() + ' ' + 'shake ' + duration);
    if ((state % 4) === 1 || (state % 4) === 0) {
	x = -xd;
	y = -yd;
    } else {
	x = xd;
	y = yd;
    }

    gr.relative_move_xy(x, y);
    console.log('  x ' + gr._area._x + ' ' + gr._area._y);
    canvas.render();

    if (duration < interval) {
	console.log('***************** done ****************');
	if (typeof(done) === 'function')
	    done(gr);
	return;
    }
    setTimeout(function()
	       { shake_gr(gr, xd, yd, state+1, interval, duration-interval, done);},
	       interval);
}


cute.Graphical.prototype.render_canvas = function(ctx) {
    console.log("Graphical.render_canvas called for " + this);
}

cute.Graphical.prototype.copy = function(gr) {
    var gr1, gr2;

    if (gr)
	gr1 = this, gr2 = gr;
    else
	gr1 = new cute.Graphical(), gr2 = this;
    gr1._area = gr2._area.copy();
    gr1._colour = gr2._colour;
    gr1._cursor = gr2._cursor;
    gr1._displayed = gr2._displayed;
    gr1._handles = gr2._handles;
    gr1._inverted = gr2._inverted;
    gr1._name = gr2._name;
    gr1._pen = gr2._pen;
    gr1._selected = gr2._selected;
	
    return gr1;
}

cute.Graphical.prototype.device = function() {
    var gr = this;

    while (gr._figure) {
	if (gr._figure instanceof cute.Device)
	    return gr._figure;
	gr = gr._figure;
    }
    return false;
}

cute.Graphical.prototype.figure = function(f) {
    var gr = this;

    if (f === undefined)
	return gr._figure;

    if (gr._figure === f)
	return gr;
    if (gr._figure) {
	var tmp_fig = gr._figure;
//	console.log('bef gr._figure ' + gr._figure._graphicals);
	gr._figure.erase(gr);
//	console.log('aft gr._figure ' + tmp_fig._graphicals);
    }
    if (f)
	f.append(gr);

    return gr;
}

cute.Graphical.prototype.displayed = function(val) {
    var gr = this;

    if (gr._displayed !== val) {
	if (val)
	    gr._displayed = true;
	if (gr._figure)
	    gr._figure.displayed_graphical(gr, val);
	if (val === false)
	    gr._displayed = val;
    }
    return gr;
}

cute.Graphical.prototype.is_displayed = function(f) {
    var gr = this;

    while (gr) {
	if (gr._displayed && gr._figure === f)
	    return true;
	if (gr._displayed === false)
	    return false;
	gr = gr._figure;
    }

    return f === undefined;
}
    

cute.Graphical.prototype.common_figure = function(gr2) {
    var gr = this;
    var f1 = gr._figure;
    var f2 = gr2._figure;

    if (f1 == f2)
    { if (f1)
	return f1;
      return null;
    }

    if (f2 == null)
	return null;
    while (f1 != null && f1._level > f2._level)
	f1 = f1._figure;

    if (f1 == null)
	return null;
    while (f2 != null && f2._level > f1._level)
	f2 = f2._figure;

    while (f1 != null && f2 != null)
    { if (f1 == f2)
	return f1;
      f1 = f1._figure;
      f2 = f2._figure;
    }

    return null;
}

cute.Graphical.prototype.request_compute = function(val) {
    var gr = this;

    if (gr._request_compute && val === undefined)
	return gr;
    if (val === false) {
	gr._request_compute = false;
	return gr;
    }
    gr._request_compute = true;
    if (gr._request_compute && gr._figure)
	gr._figure.request_compute();
    return gr;
}
	
cute.Graphical.prototype.block_compute = function() {
    this._blocked_compute = this._request_compute;
    this._request_compute = false;
}

cute.Graphical.prototype.unblock_compute = function() {
    this._request_compute = this._blocked_compute;
}

cute.Graphical.prototype.Compute = function() {		// Internal
    var gr = this;
    
    if (gr._inside_compute === true) {
	if (gr instanceof cute.Figure)
	    gr.compute_bounding_box();
	return gr;
    }

    if (gr._request_compute) {
	gr._inside_compute = true;
	gr.compute();
	gr._request_compute = false;
	gr._inside_compute = false;
    }

    return gr;
}

cute.Graphical.prototype.compute = function() {
    var gr = this;

    gr._request_compute = false;

    return gr;
}

cute.Graphical.prototype.hide = function(gr2) {
    var gr1 = this;

    if (gr1._figure && (gr2 === undefined || gr2._figure ===  gr1._figure))
    { gr1._figure.hide(gr1, gr2);
      gr1.update_hide_expose_connections();
    }

    return this;
}

cute.Graphical.prototype.expose = function(gr2) {
    var gr1 = this;

    if (gr1._figure && (gr2 === undefined || gr2._figure ===  gr1._figure))
    { gr1._figure.expose(gr1, gr2);
      gr1.update_hide_expose_connections();
    }

    return this;
}

cute.Graphical.prototype.swap = function(gr2) {
    var gr1 = this;

    if (gr1._figure == gr2._figure && gr1._figure)
	gr1._figure.swap_graphicals(gr1, gr2);

    return this;
}


/*------------------------------------------------------------
 *  Geometry
 *------------------------------------------------------------*/

cute.Graphical.prototype.set = function(x, y, w, h) {
    return this.geometry(x, y, w, h);
}

cute.Graphical.prototype.geometry = function(x, y, w, h) {
    var a = this._area;
    var changed = false;

    if (   (x && a._x != x)
	|| (y && a._y != y)
	|| (w && a._w != w)
	|| (h && a._h != h))
	changed = true;

    if (x) a._x = x;
    if (y) a._y = y;
    if (w) a._w = w;
    if (h) a._h = h;

    if (changed)
	this.changed_area(x, y, w, h);
    return this;
}

cute.Graphical.prototype.area = function(a) {
    var gr = this;

    if (a)
	return gr.set(a._x, a._y, a._w, a._h);
    gr.Compute();

    return gr._area;
}

cute.Graphical.prototype.x = function(x) {
    var gr = this;

    if (x === undefined) {
        gr.Compute();
        return gr._area._x;
    }

    return gr.set(a._x);
}

cute.Graphical.prototype.y = function(y) {
    var gr = this;

    if (y)
	return gr.set(undefined, a._y);
    gr.Compute();

    return gr._area._y;
}

cute.Graphical.prototype.width = function(w) {
    var gr = this;

    if (w === undefined) {
	gr.Compute();
	return gr._area._w;
    }

    return gr.set(undefined, undefined, w);
}

cute.Graphical.prototype.height = function(h) {
    var gr = this;

    if (h === undefined) {
        gr.Compute();
        return gr._area._h;
    }

    return gr.set(undefined, undefined, undefined, h);
}

cute.Graphical.prototype.position = function(p) {
    var gr = this;

    if (p === undefined)
	return new cute.Point(gr._x, gr._y);

    gr.Compute();
    if (p)
	return gr.set(p._x, p._y);
}

cute.Graphical.prototype.size = function(s) {
    var gr = this;

    if (s)
	return gr.set(undefined, undefined, s._w, s._h);
    gr.Compute();

    return new cute.Size(s._w, s._h);
}

cute.Graphical.prototype.center = function(p) {
    var gr = this;

    if (p) {
	gr.Compute();
	return gr.set(p._x - gr._area._w / 2,
		      p._y - gr._area._h / 2);
    }

    return new cute.Point(gr._area._x + gr._area._w/2,
			  gr._area._y + gr._area._h/2);
}

cute.Graphical.prototype.set_corner = function(x, y) {
    var gr = this;
    var a = gr._area;

    if (x === undefined)
	x = a._x + a._w;
    if (y === undefined)
	y = a._y + a._h;

    return gr.set(undefined, undefined, x-a._x, y-a._y);
}

cute.Graphical.prototype.corner_x = function(x) {
    return this.set_corner(p._x);
}

cute.Graphical.prototype.corner_y = function(y) {
    return this.set_corner(undefined, p._y);
}

cute.Graphical.prototype.center_x = function(c) {
    this.Compute();
    return this.set(c + this._area._w / 2);
}

cute.Graphical.prototype.center_y = function(c) {
    this.Compute();
    return this.set(c + this._area._h / 2);
}

cute.Graphical.prototype.relative_move = function(p) {
    this.Compute();
    return this.set(this._area._x + p._x, this._area._y + p._y);
}

cute.Graphical.prototype.relative_move_xy = function(x, y) {
    this.Compute();
    return this.set(this._area._x + x, this._area._y + y);
}

cute.Graphical.prototype.rotate = function(degrees) {
//  console.log("Graphical.rotate not implemented");
}

cute.Graphical.prototype.normalise = function() {
    this._area.orientation("north_west");
    return this;
}

cute.Graphical.prototype,orientation = function(orient) {
    if (orient === undefined)
	return this._area.orientation();

    if (this instanceof cute.Box ||
	this instanceof cute.Circle ||
	this instanceof cute.Ellipse)
	this._area.orientation(orientation);
    return this;
}

cute.Graphical.prototype.displayed_cursor = function() {
    return this._cursor;
}

cute.Graphical.prototype.reparent = function() {
    var gr = this;
    var cons = gr._connections;
    
    for (var i=0; i<cons.length; i++)
	cons[i].update_figure();
    return gr;
}

cute.Graphical.prototype.sub = function(sub) {
    while (sub)
    { if (this === sub)
	return true;
      sub = this._figure;
    }
    return false;
}
	
cute.Graphical.prototype.update_connections = function(level) {
    var conns = this._connections;

    for (var i=0; i<conns.length; i++) {
	var c = conns[i];

	if (c._figure && c._figure._level <= level)
	    cute.Graphical.prototype.request_compute.call(c);
    }
    
    return this;
}

cute.Graphical.prototype.changed_entire_image = function() {
//    console.log("Graphical.changed_entire_image not implemented");
}

cute.Graphical.prototype.changed_area = function(x, y, w, h) {
    var gr = this;
    if (gr._figure && gr._displayed) {
	var f = gr._figure;

	f.request_compute();
	gr.update_connections(f._level);
    }
//  if (gr._has_constraints) gr.update_constraints();
}


cute.Graphical.prototype.absolute_xy = function(f) {
    var gr = this;
    var x, y;

    gr.Compute();
    x = gr._area._x;
    y = gr._area._y;

    while (gr._figure && gr._figure != f) {
	x += gr._figure._offset._x;
	y += gr._figure._offset._y;
	gr = gr._figure;
    }

    return {x: x, y: y};
}

/*  Return absolute area of this graphical.
 */
cute.Graphical.prototype.absolute_area = function() {
    var gr = this;
    var abs = gr.absolute_xy();

    return new cute.Area(abs.x, abs.y, gr._area._w, gr._area._h);
}

cute.Graphical.prototype.attach_connection = function(c) {
    this._connections.push(c);
    return this;
}

cute.Graphical.prototype.detach_connection = function(c) {
    var gr = this;

    cute.delete_from_array(gr._connections, c);
    return gr;
}

cute.Graphical.prototype.get_handle = function(name) {
    var hdls = this._handles;
    for (var i=0; i<hdls.length; i++) {
	if (hdls[i]._name == name)
	    return hdls[i];
    }
    return false;
}

cute.Graphical.prototype.handle = function(h) {
    this._handles.push(h);
    return this;
}


/*------------------------------------------------------------
 *  Event handling
 *------------------------------------------------------------*/

cute.Graphical.prototype.event = function(ev, x, y) {
    var gr = this;

    ev._receiver = gr;
    ev._receiver_x = x;
    ev._receiver_y = y;
    if (gr._active) {
	for (var i=0; i<gr._recognisers.length; i++)
	    if (gr._recognisers[i].event(ev, gr))
		return true;
    }
    return false;
}

cute.Graphical.prototype.pointed_objects = function(x, y, array) {
    var gr = this;

    if (gr._displayed && gr.in_event_area(x,y))
	array.push(gr);
    return gr;
}

cute.Graphical.prototype.in_event_area = function(x, y) {
    var gr = this;
    var a = gr._area;
    var ax, ay, aw, ah;
    var evtol = 5;
    var c = ", ";

//  gr.compute();
    a.normalise();
    ax = a._x, ay = a._y, aw = a._w, ah = a._h;
    if (aw < evtol) ax -= (evtol-aw)/2, aw = evtol;
    if (ah < evtol) ay -= (evtol-ah)/2, ah = evtol;

    if (x >= ax && x <= ax + aw && y >= ay && y <= ay + ah) {
	return true;
    }
    return false;
}

cute.Graphical.prototype.recogniser = function(r) {
    this._recognisers.push(r);
    return this;
}

cute.Graphical.prototype.append_recogniser = function(r) {
    this._recognisers.push(r);
    return this;
}

cute.Graphical.prototype.prepend_recogniser = function(r) {
    this._recognisers.unshift(r);
    return this;
}

cute.Graphical.prototype.delete_recognisers = function() {
    this._recognisers = [];
    return this;
}

cute.Graphical.prototype.recognisers = function() {
    return this._recognisers;
}

cute.Graphical.prototype.offset_figure = function() {
    var gr = this;
    var x = 0, y = 0;
    var fig = gr._figure;

    while (fig._figure) {
	var pt = fig._offset;

	x += pt._x;
	y += pt._y;
//	console.log("offset_figure " + x + "," + y + " " + fig);
	fig = fig._figure;
    }
    return {x: x, y: y};
}
/*  $Id$
 *  
 *  File	format.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Format layout manager
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/

var cute = cute || {};


cute.Format = function(spec) {
    var f = this;

    if (typeof(spec) === 'object') {
	f._direction = spec.direction || 'horizontal';
	f._columns = (spec.columns === undefined ? true : spec.columns);
	f._width = spec.width || 1;
	f._row_separator = spec.row_separator || 10;
	f._column_separator = spec.column_separator || 10;
    } else {
	f._direction = arguments[0] || 'horizontal';
	f._width = arguments[1] || 1;
	f._coloums = (arguments[2] === undefined ? true : arguments[2]);
	f._row_separator = 10;
	f._column_separator = 10;
    }

    return f;
}
/*  $Id$
 *  
 *  File	figure.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Figure
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Figure
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Figure = function() {
    var fig = this;

    cute.Graphical.call(fig);
    fig._level = 0;
    fig._offset = new cute.Point(0,0);
    fig._clip_area = null;
    fig._graphicals = [];
    fig._layout_manager = null;
    fig._format = null;
    fig._bad_format = false;
    fig._bad_bounding_box = false;
    fig._recompute = [];
    fig._background = null;
    fig._pen = 0;
    fig._border = 0;
    fig._radius = 0;
    fig._grid = undefined;

    fig.request_compute(true);

    return fig;
}

cute.Figure.prototype = new cute.Graphical();
cute.Figure.prototype.constructor = cute.Figure;

cute.Figure.prototype.toString = function() {
    var fig = this;

    return 'cute.Figure(' + fig._offset._x + ' ' + fig._offset._y + ') [' + fig._area + ']';
}

cute.Figure.prototype.format = function(fmt) {
    var fig = this;

    if (fmt === undefined)
	return fig._format;
    fig._format = fmt;

    return fig;
}

cute.Figure.prototype.print_tree = function(depth) {
    var fig = this;
    var tab = '';

    if (depth === undefined)
	depth = 0;
    
    for (var d=0; d<depth; d++)
	tab += '  ';

    if (fig._displayed)
	display = '';
    else
	display = '*hidden*';

    if (fig.pp)
	console.log(tab + display + ' [' + fig.area() + '] ' + fig + ' ' + fig.pp());
    else
	console.log(tab + display + ' [' + fig.area() + '] ' + fig);

    for (var i=0; i<fig._graphicals.length; i++) 
	fig._graphicals[i].print_tree(depth+1);

    return fig;
}

cute.Figure.prototype.unlink = function() {
    var f = this;
    var grs = f._graphicals;

    for (var i=0; i<grs.length; i++)
	grs[i].figure(null);
    cute.Graphical.prototype.unlink.call(f);

    return null;
}


/*------------------------------------------------------------
 *  Event handling
 *------------------------------------------------------------*/

cute.Figure.prototype.inspected = function(ev) {
    console.log("Figure.inspected not implemented");
    return this;
}

cute.Figure.prototype.find = function(location, cond) {
    console.log("Figure.find not implemented");
    return this;
}

cute.Figure.prototype.typed = function(id, delegate) {
    console.log("Figure.typed not implemented");
    return this;
}

cute.Figure.prototype.default_button = function() {
    console.log("Figure.default_button not implemented");
    return this;
}

cute.Figure.prototype.wants_keyboard_focus = function() {
    console.log("Figure.wants_keyboard_focus not implemented");
    return this;
}

cute.Figure.prototype.advance = function() {
    console.log("Figure.advance not implemented");
    return this;
}

/*------------------------------------------------------------
 *  Repaint management
 *------------------------------------------------------------*/

cute.Figure.prototype.request_compute = function(val) {
    var f = this;

    f._bad_bounding_box = true;
    f._bad_format = true;
    cute.Graphical.prototype.request_compute.call(f, val);

    return f;
}

cute.Figure.prototype.compute_graphicals = function() {
    var f = this;
    var a = f._recompute;

    if (a === undefined) {	// TBD - Why?
	return f;
    }
    for (var i=0; i<a.length; i++) {
	var gr = a[i];
	if (gr)
	    gr.Compute();
    }
    f._recompute = [];

    return f;
}
	
cute.Figure.prototype.compute_layout = function() {
//   console.log("Figure.compute_layout not implemented");
    return this;
}

cute.Figure.enter_redraw_area = function() {
    console.log("Figure.enter_redraw_area not implemented");
    return this;
}

cute.Figure.exit_redraw_area = function() {
    console.log("Figure.exit_redraw_area not implemented");
    return this;
}

cute.Figure.redraw_area = function () {
    console.log("Figure.redraw_area not implemented");
    return this;
}

cute.Figure.flash = function() {
    console.log("Figure.flash not implemented");
    return this;
}


/*------------------------------------------------------------
 *  Display / Erase
 *------------------------------------------------------------*/

cute.Figure.prototype.clear = function(how) {
    var f = this;
    var grs = new Array();

    for (var i=0; i<f._graphicals.length; i++)
	grs.push(f._graphicals[i]);

    if (how === 'free') {
	for (var i=0; i<grs.length; i++)
	    grs[i].free();
    }
    else if (how === 'erase') {
	for (var i=0; i<grs,length; i++)
	    if (grs[i]) f.erase(grs[i]);
    }

    f._graphicals = [];

    return f;
}

cute.Figure.prototype.free = function() {
    var f = this;

    f.clear('free');
    f.unlink();

    return f;
}

cute.Figure.prototype.display = function(gr, pos) {
    var f = this;

    if (pos)
	gr.set(pos._x, pos._y, undefined, undefined);
    gr.figure(f);
    gr.displayed(true);

    return f;
}

cute.Figure.prototype.append = function(gr) {
    var f = this;

    if (f._graphicals === undefined)	// TBD -- why
	f._graphicals = [];
    if (f._recompute === undefined)	// TBD -- why?
	f._recompute = [];

    f._graphicals.push(gr);
    gr._figure = f;
    if (!gr._request_compute) {
	f._recompute.push(gr);
	if (!f._request_compute)
	    f.request_compute();
    }
    if (gr._displayed)
	f.displayed_graphical(gr, true);
    gr.reparent();

    return f;
}


cute.Figure.prototype.erase = function(gr) {
    var f = this;

    if (gr._figure === f) {
		/* Omitted.  Reset keyboard focus in window. */
	if (gr._displayed)
	    f.displayed_graphical(gr, false);
	cute.delete_from_array(f._recompute, gr);
	gr._figure = null;
	cute.delete_from_array(f._graphicals, gr);
		/* !isFreed -- TBD */
	gr.reparent();
    }
    return f;
}

cute.Figure.prototype.displayed_graphical = function(gr, val) {
    var f = this;
//  var old = gr._displayed;

    gr._displayed = val;
    if (gr instanceof cute.Figure)
	cute.Figure.prototype.update_connections.call(gr, f._level);
    else
	gr.update_connections(f._level);

    f.request_compute();
//  gr._displayed = old;

    return f;
}


cute.Figure.prototype.expose = function(gr, gr2) {
    var f = this;

    if (gr._figure !== f || (gr2 && gr2._figure !== f))
	return f;
    if (gr2) {
	cute.delete_from_array(f._graphicals, gr);
	f._graphicals.push(gr);
    } else
	f._graphicals = move_after_array(f._graphicals, gr, gr2);
    f.request_compute();

    return f;
}


cute.Figure.prototype.hide = function(gr, gr2) {
    var f = this;

    if (gr._figure !== f || (gr2 && gr2._figure !== f))
	return f;
    if (gr2) {
	cute.delete_from_array(f._graphicals, gr);
	f._graphicals = f._graphicals.splice(0, 0, gr);
    } else
	f._graphicals = move_after_array(f._graphicals, gr, gr2);
    f.request_compute();

    return f;
}

cute.Figure.prototype.swap_graphicals = function(gr, gr2) {
    console.log("Figure.swap_graphicals not implemented");
}


/*------------------------------------------------------------
 *  Selection
 *------------------------------------------------------------*/

cute.Figure.prototype.selection = function(obj) {
    console.log("Figure.selection not implemented");
}


cute.Figure.prototype.offset = function() {
    var fig = this;

    return new cute.Point(fig._offset._x, fig._offset._y);
}

/*------------------------------------------------------------
 *  Event handling
 *------------------------------------------------------------*/

cute.Figure.prototype.event = function(ev, ex, ey) {
    var f = this;

    if (f._active) {
	var x = ex - f._offset._x;
	var y = ey - f._offset._y;
	var grs = f._graphicals;

	for (var i=grs.length; i>0; i--) {
	    var gr = grs[i-1];

	    if (gr._displayed && gr.in_event_area(x,y) && gr.event(ev,x,y))
		return true;
	}
	return cute.Graphical.prototype.event.call(f, ev, x, y);
    }
	
    return false;
}

cute.Figure.prototype.pointed_objects = function(ex, ey, array) {
    var f = this;

    if (f._active && f.in_event_area(ex, ey)) {
	var x = ex - f._offset._x;
	var y = ey - f._offset._y;
	var grs = f._graphicals;

	array.push(f);

	for (var i=grs.length; i>0; i--) {
	    var gr = grs[i-1];

	    gr.pointed_objects(x, y, array);
	}
    }

    return f;
}


/*------------------------------------------------------------
 *  Membership
 *------------------------------------------------------------*/

cute.Figure.prototype.member = function(name) {
    var fig = this;
    var grs = fig._graphicals;

    for (var i=0; i<grs.length; i++) {
	if (grs[i]._name == name)
	    return grs[i];
    }
    
    return false;
}


/*------------------------------------------------------------
 *  Geometry
 *------------------------------------------------------------*/

cute.Figure.prototype.update_connections = function(level) {
    var f = this;
    var grs = f._graphicals;

    for (var i=0; i<grs.length; i++)
	grs[i].update_connections(level);
    cute.Graphical.prototype.update_connections.call(f, level);
    return f;
}

cute.Figure.prototype.geometry = function(x, y, w, h) {
    var f = this;
    var a = f._area;

    cute.Graphical.prototype.Compute.call(f);

    if (!x) x = a._x;
    if (!y) y = a._y;

    if (x != a._x || y != a._y) {
	var dx = x - a._x;
	var dy = y - a._y;
	var ax = a._x, ay = a._y, aw = a._w, ah = a._h;

	f._offset._x = f._offset._x + dx;
	f._offset._y = f._offset._y + dy;
	a._x = x;
	a._y = y;

	if (ax != a._x || ay != a._y || aw != a._w || ah != a._h)
	    f.changed_area(ax, ay, aw, ah);

	f.update_connections(f._level-1);
    }

    return this;
}


cute.Figure.prototype.compute = function() {
    var f = this;

    if (f._request_compute) {
	if (f._pen !== 0 || f._background) {
//	    changing_graphical(f);
	    f.compute_graphicals();
	    f.compute_layout();
	    f.compute_bounding_box();
//	    changed_graphical(f);
	} else {
	    f.compute_graphicals();
	    f.compute_layout(f);
	    f.compute_bounding_box();
	}
	f._request_compute = false;
    }

    return f;
}


cute.Figure.prototype.background = function(bg) {
    var f = this;

    if (bg) {
	if (f._background !== bg) {
	    f._background = bg;
	    f.request_compute();
	    return f;
	}
    }
    return f._background;
}


cute.Figure.prototype.clip_area = function(a) {
    var f = this;

    if (a) {
	f._bad_bounding_box = true;
	f._clip_area = a.copy();
	f.request_compute();
	return this;
    }
    return f._clip_area;
}

cute.Figure.prototype.shadow = function(shadow) {
    var f = this;

    if (shadow) {    // TBD -- shadow code
	if (f._shadow !== shadow) {
	    f._shadow = shadow;
	    f.request_compute();
	}
	return this;
    }
    return f._shadow;
}


cute.Figure.prototype.radius = function(radius) {
    var f = this;

    if (radius) {
	if (f._radius !== radius) {
	    f._radius = radius;
	    f.request_compute(true);
	}
	return this;
    }
    return f._radius;
}


cute.Figure.prototype.border = function(border) {
    var f = this;

    if (border) {
	if (f._border !== border) {
	    f._border = border;
	    f.request_compute();
	}
	return this;
    }
    return f._border;
}


cute.Figure.prototype.update_bounding_box = function() {
    var f = this;
    var a = f._area;
    var grs = f._graphicals;
    var ax = a._x, ay = a._y, aw = a._w, ah = a._h;

    a.clear();
    for (var i=0; i<grs.length; i++) {
	var gr = grs[i];

	if (gr._displayed) {
	    gr.Compute();
	    a.union_normalised(gr._area);
	}
    }
    a.relative_move(f._offset);

    return (ax !== a._x || ay !== a._y || aw !== a._w || ah !== a._h);
}

cute.Figure.prototype.compute_bounding_box = function() {
    var f = this;

    if (f._bad_bounding_box) {
	var a = f._area;
	var ox = a._x, oy = a._y, ow = a._w, oh = a._h;

	if (f.update_bounding_box()) {
	    if (f._figure) {
		f._figure.request_compute();
		cute.Graphical.prototype.update_connections.call(f, f._level-1);
	    }
	}

	if (f._clip_area) {
	    a = f._area;

	    a.relative_move_back(f._offset);
	    if (!a.intersection(f._clip_area)) 
		a._w = 0, a._h = 0;
	    a.relative_move(f._offset);
	}
	f._bad_bounding_box = false;

	if (f._border)
	    f._area.increase(f._border);
	if (ox !== a._x || oy !== a._y || ow !== a._w || oh !== a._h)
	    f.changed_area(ox, oy, ow, oh);
    }
    return f;
}


cute.Figure.prototype.grid = function(gap) {
    var fig = this;

    if (gap === undefined)
	return fig._grid;
    fig._grid = gap;

    return fig;
}

/*  Draw a grid (for debugging of coordinates).
 */
cute.Figure.prototype.draw_grid = function(ctx, gap) {
    var fig = this;
    var canvas = fig.device();
    var w = canvas._width;
    var h = canvas._height;

    for (var x=0; x<w; x+=gap) 
	for (var y=0; y<h; y+=gap) {
	    r_line(ctx, 0, y, w, y);
	    r_line(ctx, x, 0, x, h);
	}

    return fig;
}

cute.Figure.prototype.render_canvas = function(ctx) {
    var f = this;

    if (f._displayed === false) {
	console.log('f._displayed = false ' + f);
	return f;
    }

    var a = f._area;
    var ox = f._offset._x;
    var oy = f._offset._y;
    var x = f._area._x;
    var y = f._area._y;
    var grs = f._graphicals;
    var tx = x-ox;
    var ty = y-oy;
    var fill = false;
    var stroke = false;

    if (f._grid)
	f.draw_grid(ctx, f._grid);

    if (f._pen > 0) {
	r_line_width(ctx, f._pen);
	r_stroke_style(ctx, f._colour);
	stroke = true;
    }
    if (f._shadow) {
	r_shadow(ctx, f._shadow);
	fill = true;
    }
    if (f._background) {
	fill = true;
	r_fill_style(ctx, f._background);
    }
    if (fill)
	r_fill_rect(ctx, x, y, a._w, a._h);
    if (stroke)
	r_stroke_rect(ctx, x, y, a._w, a._h);

    ctx.save();
    ctx.translate(ox, oy);
    for (var i=0; i<grs.length; i++) {
	var gr = grs[i];

	gr.Compute();
	if (gr._displayed)
	    gr.render_canvas(ctx);
    }
    ctx.translate(-ox, -oy);
    ctx.restore();
}


/*  $Id$
 *  
 *  File	device.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Device
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		16/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Device
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Device = function() {
    cute.Figure.call(this);
    return this;
}

cute.Device.prototype = new cute.Figure();
cute.Device.prototype.constructor = cute.Device;

/*  $Id$
 *  
 *  File	canvas.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Canvas
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Cophright (c) 2012  University of Twente
 *  
 *  Historh	04/07/12  (Created)
 *  		16/10/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Canvas
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Canvas = function(id) {
    var canvas = this;

    cute.Device.call(canvas);

    if (id) {
	var dom = document.getElementById(id);

	canvas.id(id);
	canvas._canvas = dom;
	canvas._context = canvas._canvas.getContext('2d');
	canvas._area = new cute.Area(0, 0, canvas._canvas.width, canvas._canvas.height);
	canvas._width = canvas._canvas.width;
	canvas._height = canvas._canvas.height;
	canvas._modified = false;
	cute.ctx = canvas._context;

	canvas._gesture = undefined;

	dom.onmousedown = function(ev) { canvas.mouse_event(ev, 'mouse_down'); };
	dom.onmouseup = function(ev) { canvas.mouse_event(ev, 'mouse_up'); };
	dom.onmouseout = function(ev) { canvas.mouse_event(ev, 'mouse_out'); };
	dom.onmousemove = function(ev) { canvas.mouse_event(ev, 'mouse_move'); };
	
	dom.ontouchstart = function(ev) { canvas.touch_event(ev, 'touch_start'); };
	dom.ontouchmove = function(ev) { canvas.touch_event(ev, 'touch_move'); };
	dom.ontouchend = function(ev) { canvas.touch_event(ev, 'touch_end'); };
	dom.ontouchleave = function(ev) { canvas.touch_event(ev, 'touch_out'); };
	dom.ontouchcancel = function(ev) { canvas.touch_event(ev, 'touch_cancel'); };

//	document.onkeyup = function(ev) { canvas.key_event(ev, 'key_up'); };

/*  can.onclick = function(e) { canvas.mouse_event(e, 'click'); };
    can.ondblclick = function(e) { canvas.mouse_event(e, 'double_click'); };
    can.onkeydown = function(e) { canvas.key_event(e, 'key_down'); };
*/
    }

    return canvas;
}

cute.Canvas.prototype = new cute.Device();
cute.Canvas.prototype.constructor = cute.Canvas;


cute.Canvas.prototype.key_event = function(ev, type) {
    var canvas = this;

    console.log('key event ' + type);
    if (type === 'key_up') {
	console.log('resetting canvas');
	canvas.reset();
    }
    return canvas;
}


/** Override graphical width to return the real width of the canvas.
 */
cute.Canvas.prototype.width = function() {
    return this._canvas.width;
}

cute.Canvas.prototype.height = function() {
    return this._canvas.height;
}

/*  Canvas has been modified. 
    Schedule a render as soon as possible.
 */
cute.Canvas.prototype.modified = function() {
    var canvas = this;

    if (canvas._modified)
	return;
    canvas._modified = true;
    setTimeout(function () { canvas.render(); }, 0);
}

    
/*  Render the content of the canvas.
    This is effectively a complete redraw.
 */
cute.Canvas.prototype.render = function() {
    var canvas = this;
    var ctx = canvas._context;
    var ox = canvas._offset.x();
    var oy = canvas._offset.y();
    var grs = canvas._graphicals;
//  var millis = Date.now();

    canvas._modified = false;

	/* Clear the original size of the DOM canvas.
	   The canvas._area changes dynamically.
	 */
    r_clear(ctx, 0, 0, canvas._width, canvas._height);
    if (canvas._background) {
	r_fill_style(ctx, canvas._background);
	r_rect(ctx, 0, 0, canvas._width, canvas._height);
	r_fill(ctx);
    }

    ctx.save();
    ctx.textBaseline = 'top';
    ctx.translate(ox, oy);

//  console.log('canvas.render');

    for (var i=0; i<grs.length; i++) {
	var gr = grs[i];

//	console.log('  gr[' + i + '] = ' + gr);
	gr.Compute();
	gr.render_canvas(ctx);
    }

    ctx.translate(-ox, -oy);
    ctx.restore();

//  console.log('Canvas.render: ' + (Date.now()-millis) + 'ms');

//  millis = Date.now() - millis;
//  debug('time_render', 'after render ' + Date.now());
//  debug('render', '    canvas.render took ' + millis + ' milliseconds');
//  debug('render', '      offset ' + c._offset.x() + ' ' + c._offset.y());

    return canvas;
}

cute.Canvas.prototype.flash_colour = function(obj, colour, millis) {
    var c = this;
    var old = obj.colour();

    setTimeout(function() {
	obj.colour(colour);
	c.render(); 
	console.log('flash init ' + colour + ' ' + obj);
    }, 0);
    setTimeout(function() {
	obj.colour(old);
	c.render();
	console.log('flash stop ' + old + ' ' + obj);
    }, millis);
}


function relative_xy(event, c){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = c._canvas;

    do{
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
cute.Canvas.prototype.touch_event = function(ev, type) {
    var canvas = this;
//  var x = relative_x(ev, canvas);
//  var y = relative_y(ev, canvas);

//  post_touch_event(ev, type, c);
//  console.log('  after post_touch_event');
//  for (var i=0; i<ev.touches.length; i++) {
//	x = relative_x(ev.touches[i], c);
//	y = relative_y(ev.touches[i], c);
    if (type == 'touch_start') return this.mouse_event(ev, 'mouse_down');
    if (type == 'touch_end') return this.mouse_event(ev, 'mouse_up');
    if (type == 'touch_move') return this.mouse_event(ev, 'mouse_move');
    if (type == 'touch_leave') return this.mouse_event(ev, 'mouse_out');
    if (type == 'touch_cancel') {
	if (canvas._gesture)
	    canvas._gesture.cancel();
	canvas._gesture = undefined;
	return canvas;
    }
}


/*  Mouse event.  At the moment this can only deal with one gesture at a
    time.

    TBD -- When two events are physically close on the screen it could be that
    the decision on which gesture (e.g., move or click) has to be delayed
    until the next event comes in.
 */
cute.Canvas.prototype.mouse_event = function(ev, type) {
    var canvas = this;
    var coords = relative_xy(ev, canvas);
    var x = coords.x;
    var y = coords.y;
    var event = new cute.Event(ev, type, canvas, x, y, ev.timeStamp);
    var g = canvas._gesture;

    ev.preventDefault();
//  console.log(type + ' ' + x + ' ' + y);

    if (type === 'mouse_down') {	// find matching gesture
	if (g) {
	    console.log('THIS SHOULD NOT HAPPEN');
	    console.log('  terminate ' + g + ' because of new mouse_down');
	    g.terminate(event);
	}
	canvas._gesture = undefined;
	canvas.event(event, x, y);
	canvas._gesture = event._gesture;
	if (canvas._gesture)
	    g = canvas._gesture;
//	ev.preventDefault();

	return canvas;
    }

    if (type === 'mouse_move') {	// call .drag
	if (g) {
	    event._gesture = g;
	    g.drag(event);
	    canvas._gesture = event._gesture;
//	    ev.preventDefault();
	}
	return canvas;
    }

    if (type === 'mouse_up') {		// call .terminate
	if (g) {
	    event._gesture = g;
	    g.terminate(event);
	    canvas._gesture = undefined;
//	    ev.preventDefault();
	}
	return canvas;
    }

    if (type === 'mouse_out') {		// call .cancel
	if (g) {
	    event._gesture = g;
	    g.cancel(event);
	    canvas._gesture = undefined;
//	    ev.preventDefault();
	}
	return canvas;
    }
}


/*  Reset internal and visible state of the canvas.
 */
cute.Canvas.prototype.reset = function() {
    var canvas = this;
    var g = canvas._gesture;

    console.log('canvas.reset');
    if (g) {
	console.log('  cancelling gesture ' + canvas._gesture);
	canvas._gesture = undefined;
	g.cancel();	// TBD - sometimes fails
	console.log('  gesture cancelled');
    }

    return canvas.render();
}


/*  $Id$
 *  
 *  File	box.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Box
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Box
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Box = function (w, h) {
    var b = this;

    cute.Graphical.call(b, 0,0,w,h);
    b._radius = 0;
    b._shadow = undefined;
    b._fill_pattern = undefined;
    b._stops = undefined;

    return this;
}

cute.Box.prototype = new cute.Graphical();
cute.Box.prototype.constructor = cute.Box;

cute.Box.prototype.stops = function(stops) {
    var b = this;

    if (stops === undefined)
	return b._stops;

    if (b._stops != stops) {
	b._stops = stops;
	b.request_compute();
    }
    return b;
}

cute.Box.prototype.render_canvas = function(ctx) {
    var b = this;
    var a = b._area;
    var x = a._x;
    var y = a._y;
    var w = a._w;
    var h = a._h;
    var fill = b._fill_pattern !== undefined;
    var stroke = b._pen > 0;
    var stops = b._stops !== undefined;
    var rounded = b._radius > 0;

    if (stops)
	r_gradient_box(ctx, x, y, w, h, b._stops);

    if (b._fill_pattern) {
	r_fill_style(ctx, b._fill_pattern);
/*	if (b._shadow)
	    r_shadow(ctx, b._shadow);
	r_fill_rect(ctx, x, y, w, h);
	if (b._shadow)
	    r_shadow(ctx);
*/    }

    if (b._pen > 0) {
	r_stroke_style(ctx, b._colour);
	r_line_width(ctx, b._pen);
    }

    if (b._radius > 0)
	r_rounded_rect(ctx, x, y, w, h, b._radius, fill, stroke);
    else {
	if (fill)
	    r_fill_rect(ctx, x, y, w, h);
	if (stroke)
	    r_stroke_rect(ctx, x, y, w, h);
    }

    return b;
}

cute.Box.prototype.radius = function(r) {
    if (r) {
	if (r !== this._radius) {
	    this._radius = r;
	    this.changed_entire_image();
	}
	return this;
    }
    return this._radius;
}

cute.Box.prototype.fill_pattern = function(img) {
    if (img) {
	if (img !== this._fill_pattern) {
	    this._fill_pattern = img;
	    this.changed_entire_image();
	}
	return this;
    }
    return this._fill_pattern;
}
	    
cute.Box.prototype.toString = function() {
    var b = this;
    var a = b._area;
    var name = b._name ? (b._name + ': ') : '';

    return name + 'Box(' + [a._x, a._y, a._w, a._h].join(', ') + ') ' +
	'pen(' + b._pen + ') ' +
	'colour(' + b._colour + ')';
}



/*  $Id$
 *  
 *  File	circle.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Circle
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Circle
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Circle = function (r) {
    var c = this;

    cute.Graphical.call(c, 0,0,r*2,r*2);

    c._radius = r;

    return r;
}

cute.Circle.prototype = new cute.Graphical();
cute.Circle.prototype.constructor = cute.Circle;

cute.Circle.prototype.render_canvas = function(ctx) {
    var c = this;
    var r, x, y;

    c._area.normalise();
    r = c._radius;
    x = c._area._x + r;
    y = c._area._y + r;

    if (c._fill_pattern)
	r_fill_style(ctx, c._fill_pattern);
    if (c._pen > 0) {
	r_line_width(ctx, c._pen);
	r_stroke_style(ctx, c._colour);
    }

    if (c._fill_pattern && c._pen > 0)
	r_circle(ctx, x, y, r);
    else if (c._fill_pattern)
	r_fill_circle(ctx, x, y, r);
    else if (c._pen > 0) 
	r_stroke_circle(ctx, x, y, r);

    return c;
}

cute.Circle.prototype.radius = function(r) {
    var c = this;

    if (r === undefined)
	return c._radius;
    if (r !== c._radius) {
	c._radius = r;
	c.set(undefined, undefined, 2*r, 2*r);
    }
    return c;
}

cute.Circle.prototype.geometry = function(x, y, w, h) {
    var c = this;

    if (!w && !h)
	return cute.Graphical.prototype.geometry.call(c, x,y);
    if (w && h) {
	var r = c._radius = Math.max(w,h)/2;
	return cute.Graphical.prototype.geometry.call(c, x,y,r*2,r*2);
    }
    if (w) {
	c._radius = w/2;
	return cute.Graphical.prototype.geometry.call(c, x,y,w,w);
    }

    c._radius = h/2;
    return cute.Graphical.prototype.geometry.call(c, x,y,h,h);
}

cute.Circle.prototype.toString = function() {
    var c = this;

    return "circle(" + c._radius + ")";
}



/*  $Id$
 *  
 *  File	joint.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Joint
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	10/07/12  (Created)
 *  		10/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Joint
 *------------------------------------------------------------*/

cute = cute || {};

cute.Joint = function (x, y, w, h, arrows) {
    cute.Graphical.call(this, x, y, w, h);

    this._first_arrow = null;
    this._second_arrow = null;
    this.arrows(arrows);

    return this;
}

cute.Joint.prototype = new cute.Graphical();
cute.Joint.prototype.constructor = cute.Joint;

cute.Joint.prototype.set_arrows = function(first, second) {
    first = first || this._first_arrow;
    second = second || this._second_arrow;
    if (this._first_arrow == first && this._second_arrow == second)
	return this;
    this._first_arrow = first;
    this._second_arrow = second;
    this.request_compute(true);

    return this;
}

cute.Joint.prototype.first_arrow = function(arrow) {
    return this.set_arrows(arrow);
}

cute.Joint.prototype.second_arrow = function(arrow) {
    return this.set_arrows(undefined, arrow);
}

cute.Joint.prototype.arrows = function(arrows) {
    if (arrows) {
	switch (arrows) {
	case "none":	
	    first = null;
	    second = null;
	    break;
	case "first":
	    first = this._first_arrow || this.default_arrow();
	    second = null;
	case "second":
	    first = null;
	    second = this._second_arrow || this.default_arrow();
	case "both":
	    first = this._first_arrow || this.default_arrow();
	    second = this._second_arrow || this.default_arrow();
	    break;
	default:
	    console.log("Joint.arrows, unknown name " + arrows);
	}
	return this.set_arrows(first, second);
    }
    if (this._first_arrow) {
	if (this._second_arrow)
	    return "both";
	return "first";
    } else
	if (this._second_arrow)
	    return "second";
    return "none";
}
	

cute.Joint.prototype.default_arrow = function() {
    return new cute.Arrow();
}

/*  $Id$
 *  
 *  File	arrow.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Arrow
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	10/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Arrow
 *------------------------------------------------------------*/

cute.Arrow = function (length, wing, style, fill) {
    cute.Graphical.call(this, 0, 0, 1, 1);

    this._length = length || 10;
    this._wing = wing || 7;
    this._style = style || "closed";
    this._fill_pattern = fill || "black";

    this._tip = new cute.Point(10, 10);
    this._reference = new cute.Point(0, 0);
    this._left = new cute.Point(0, 0);
    this._right = new cute.Point(0, 0);

    this.request_compute(true);

    return this;
}

cute.Arrow.prototype = new cute.Graphical();
cute.Arrow.prototype.constructor = cute.Arrow;


cute.Arrow.prototype.compute = function() {
    var a = this;

    if (a._request_compute) {
	var x1, y1, x2, y2;
	var x, y, w, h;
	var sx, sy, rx, ry;
	var xdiff, ydiff;
	var cdl1, sdl1, cl2, sl2;
	var l1, l2, d;
	var sin_theta, cos_theta;
	var changed = 0;

	x1 = a._reference._x;
	y1 = a._reference._y;
	x2 = a._tip._x;
	y2 = a._tip._y;

	l1 = a._length;
	l2 = a._wing / 2.0;

	xdiff = x2 - x1;
	ydiff = y2 - y1;

	d = Math.sqrt((xdiff*xdiff + ydiff*ydiff));
	if (d < 0.0000001)
	{ cos_theta = 1.0;
	  sin_theta = 0.0;
	} else
	{ cos_theta = xdiff / d;
	  sin_theta = ydiff / d;
	}

	cdl1 = cute.toInt(cos_theta * (d-l1));
	sdl1 = cute.toInt(sin_theta * (d-l1));
	cl2 = cute.toInt(cos_theta * l2);
	sl2 = cute.toInt(sin_theta * l2);

	sx = x1 + cdl1 - sl2;
	sy = y1 + sdl1 + cl2;
	rx = x1 + cdl1 + sl2;
	ry = y1 + sdl1 - cl2;

	if (a._left._x != cute.toInt(sx)) {
	    a._left._x = cute.toInt(sx);
	    changed++;
	}
	if (a._left._y != cute.toInt(sy)) {
	    a._left._y =  cute.toInt(sy);
	    changed++;
	}
	if (a._right._x != cute.toInt(rx)) {
	    a._right._x = cute.toInt(rx);
	    changed++;
	}
	if (a._right._y != cute.toInt(ry)) {
	    a._right._y = cute.toInt(ry);
	    changed++;
	}

	x = Math.min(x2, Math.min(sx, rx));
	y = Math.min(y2, Math.min(sy, ry));
	w = Math.max(x2, Math.max(sx, rx)) - x + 1;
	h = Math.max(y2, Math.max(sy, ry)) - y + 1;

	a._area.set(x, y, w, h);
	if (changed)
	    a.changed_entire_image();
	a._request_compute = false;
    }
    return this;
}


cute.Arrow.prototype.geometry = function(x, y, w, h) {
    var a = this;

    if (x && y) {	/* TBD -- in Prolog this is || */
	var dx, dy;

	if (a._request_compute)
	    a.compute();
	dx = cute.toInt(x) - a._area._x;
	dy = cute.toInt(y) - a._area._y;

	a.points(a._tip._x + dx,
		 a._tip._y + dy,
		 a._reference._x + dx,
		 a._reference._y + dy);
    }
    return this;
}

cute.Arrow.prototype.points = function(tx, ty, rx, ry) {
    var a = this;
    var tip = a._tip;
    var ref = a._reference;

    tx = tx || tip._x;
    ty = ty || tip._y;
    rx = rx || ref._x;
    ry = ry || ref._y;

    if (tx != tip._x || ty != tip._y || rx != ref._x || ry != ref._y) {
	tip._x = tx;
	tip._y = ty;
	ref._x = rx;
	ref._y = ry;
    }
    a.request_compute(true);

    return this;
}


cute.Arrow.prototype.tip = function(p) {
    return this.points(p._x, p._y);
}

cute.Arrow.prototype.tip_x = function(x) {
    if (x)
	return this.points(x);
    return this._tip._x;
}

cute.Arrow.prototype.tip_y = function(y) {
    if (y)
	return this.points(undefined, y);
    return this._tip._y;
}

cute.Arrow.prototype.reference = function(p) {
    return this.points(undefined, undefined, p._x, p._y);
}

cute.Arrow.prototype.reference_x = function(x) {
    if (x)
	return this.points(undefined, undefined, x);
    return this._reference._x;
}

cute.Arrow.prototype.reference_y = function(y) {
    if (y)
	return this.points(undefined, undefined, undefined, y);
    return this._reference._y;
}

cute.Arrow.prototype.style = function(style) {
    if (style) {
	if (style != this._style) {
	    this._style = style;
	    this.changed_entire_image();
	}
	return this;
    }
    return this._style;
}

cute.Arrow.prototype.length = function(length) {
    if (length) {
	if (length != this._length) {
	    this._length = length;
	    this.request_compute(true);
	}
	return this;
    }
    return this._length;
}

cute.Arrow.prototype.wing = function(wing) {
    if (wing) {
	if (wing != this._wing) {
	    this._wing = wing;
	    this.request_compute(true);
	}
	return this;
    }
    return this._wing;
}


/*------------------------------------------------------------
 *  Render
 *------------------------------------------------------------*/

cute.Arrow.prototype.render_canvas = function(ctx) {
    var a = this;
    var x1 = a._left._x;
    var y1 = a._left._y;
    var x2 = a._tip._x;
    var y2 = a._tip._y;
    var x3 = a._right._x;
    var y3 = a._right._y;
    var fill = a._fill_pattern;
    var pen = a._pen;
    var style = a._style;

    a.compute();

    var comma = ", ";
    if (fill) {
	r_fill_style(ctx, fill);
	r_fill_polygon(ctx, [x1, y1, x2, y2, x3, y3]);
    }

    if (pen > 0) {
	r_line_width(ctx, pen);
	r_line(ctx, x1, y1, x2, y2);
	r_line(ctx, x2, y2, x3, y3);
	if (style == "closed")
	    r_line(ctx, x3, y3, x1, y1);
    }
}
/*  $Id$
 *  
 *  File	line.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of the class Line
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Line
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Line = function (x1, y1, x2, y2, arrows) {
    cute.Joint.call(this, 0, 0, 0, 0, arrows);

    this._start_x = (x1 ? cute.toInt(x1) : 0);
    this._start_y = (y1 ? cute.toInt(y1) : 0);
    this._end_x = (x2 ? cute.toInt(x2) : 0);
    this._end_y = (y2 ? cute.toInt(y2) : 0);
    this._arrows = arrows;

    this.request_compute(true);

    return this;
}

cute.Line.prototype = new cute.Joint();
cute.Line.prototype.constructor = cute.Line;

cute.Line.prototype.toString = function() {
    var ln = this;
    var c = ", ";
    return "cute.Line(" + ln._start_x + c + ln._start_y + c + ln._end_x + c + ln._end_y + ")";
}

cute.Line.prototype.start_x = function(x) {
    var ln = this;

    if (x) {
	if (x !== ln._start_x) {
	    ln._start_x = x;
	    ln.request_compute();
	}
	return ln;
    }
    return ln._start_x;
}

cute.Line.prototype.start_y = function(y) {
    var ln = this;

    if (y) {
	if (y !== ln._start_y) {
	    ln._start_y = y;
	    ln.request_compute();
	}
	return ln;
    }
    return ln._start_y;
}


cute.Line.prototype.end_x = function(x) {
    var ln = this;

    if (x) {
	if (x !== ln._end_x) {
	    ln._end_x = x;
	    ln.request_compute();
	}
	return ln;
    }
    return ln._end_x;
}

cute.Line.prototype.end_y = function(y) {
    var ln = this;

    if (y) {
	if (y !== ln._end_y) {
	    ln._end_y = y;
	    ln.request_compute();
	}
	return ln;
    }
    return ln._end_y;
}


cute.Line.prototype.points = function(sx, sy, ex, ey) {
    var ln = this;

    if (sx) ln._start_x = sx;
    if (sy) ln._start_y = sy;
    if (ex) ln._end_x = ex;
    if (ey) ln._end_y = ey;

    return ln.request_compute();
}

cute.Line.prototype.adjust_first_arrow = function() {
    var ln = this;

    if (ln._first_arrow) {
	ln._first_arrow.points(ln._start_x, ln._start_y, ln._end_x, ln._end_y);
	ln._first_arrow._displayed = true;
	ln._first_arrow.Compute();
	return true;
    }
    return false;
}

cute.Line.prototype.adjust_second_arrow = function() {
    var ln = this;

    if (ln._second_arrow) {
	ln._second_arrow.points(ln._start_x, ln._start_y, ln._end_x, ln._end_y);
	ln._second_arrow._displayed = true;
	ln._second_arrow.Compute();
	return true;
    }
    return false;
}

cute.Line.prototype.compute = function() {
    var ln = this;

    if (ln._request_compute) {
	var x1  = ln._start_x;
	var x2  = ln._end_x;
	var y1  = ln._start_y;
	var y2  = ln._end_y;
	var pen = ln._pen;
	var x, y, w, h;
	var a = ln._area;

	if (x1 < x2) 
	    x = x1, w = x2-x1;
	else
	    x = x2, w = x1-x2;
	if (y1 < y2)
	    y = y1, h = y2-y1;
	else
	    y = y2, h = y1-y2;

	if (pen === 1)
	    w++, h++;
	else
	    if (pen > 1) {
		var ex = (h > 0 ? (pen*h)/(w+h) : 0); /* h=0: horizontal */
		var ey = (w > 0 ? (pen*w)/(w+h) : 0); /* w=0: vertical */
		var hx = ex/2;
		var hy = ey/2;

		x -= hx;
		w += ex;
		y -= hy;
		h += ey;
	    }

	if (ln._selected === true)	/* should be solved elsewhere */
	    x -= 3, y -= 3, w += 6, h += 6;

	a._x = x;
	a._y = y;
	a._w = w;
	a._h = h;

	if (ln.adjust_first_arrow())
	    a.union_normalised(ln._first_arrow._area);
	if (ln.adjust_second_arrow())
	    a.union_normalised(ln._second_arrow._area);
	ln.changed_entire_image();

	ln._request_compute = false;
    }      
    return ln;
}

cute.Line.prototype.copy = function(l2) {
    var l1 = this;

    cute.Joint.prototype.copy(l1, l2);
    l1._start_x = l2._start_x;
    l1._start_y = l2._start_y;
    l1._end_x = l2._end_x;
    l1._end_y = l2._end_y;

    return l1;
}

cute.Line.prototype.render_canvas = function(ctx) {
    var ln = this;
    var x1 = ln._start_x;
    var x2 = ln._end_x;
    var y1 = ln._start_y;
    var y2 = ln._end_y;
    var pen = ln._pen;

    if (pen > 0) {
	r_stroke_style(ctx, ln._colour);
	r_line_width(ctx, pen);
	r_line(ctx, x1, y1, x2, y2);
    }

    if (ln._first_arrow)
	ln._first_arrow.render_canvas(ctx);
    if (ln._second_arrow)
	ln._second_arrow.render_canvas(ctx);

    return this;
}
/*  $Id$
 *  
 *  File	font.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Font
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	22/07/12  (Created)
 *  		30/08/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Font
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Font = function(family, points, style, weight) {
    var f = this;

    f._family = family || "sans-serif";
    f._points = points || 10;
    f._style = style || "normal";
    f._weight = weight || "normal";
    f._pixels = undefined;
    f._css = null;
    f._css_set = false;		/* If true user has specified full CSS font */
    f._height = 0;
    f._ascent = 0;
    f._descent = 0;

    f.request_compute();

    return f;
}


cute.Font.prototype.request_compute = function() {
    this._request_compute = true;
    return this;
}


cute.Font.prototype.compute = function() {
    var f = this;

    if (f._request_compute) {
	var w = f._weight == 'normal' ? "" : f._weight;
	var s = f._style == 'normal' ? "" : f._style;
	var text, block, div, body;
	
	if (!f._css_set) {
	    if (f._pixels)
		f._css = w + ' ' + s + ' ' + f._pixels + 'px ' + f._family + " ";
	    else
		f._css = w + ' ' + s + ' ' + f._points + 'pt ' + f._family + " ";
	}

	text = $('<span style="font: ' + f._css + '">Hg</span>');
	block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
	div = $('<div></div>');
	body = $('body');
	div.append(text, block);
	body.append(div);

	try {
	    block.css({ verticalAlign: 'baseline' });
	    f._ascent = block.offset().top - text.offset().top;
	    block.css({ verticalAlign: 'bottom' });
	    f._height = Math.ceil(block.offset().top - text.offset().top);
	    f._descent = f._height - f._ascent;
	} finally {
	    div.remove();
	}

	f._request_compute = false;
    }
    return f;
}


cute.Font.prototype.width = function(str) {
    var f = this;
    var w;

    r_font(cute.ctx, f.css());

    return cute.ctx.measureText(str).width;
}

cute.Font.prototype.height = function() {
    var f = this;

    f.compute();
    return f._height;
}


cute.Font.prototype.ascent = function() {
    var f = this;

    f.compute();
    return f._ascent;
}


cute.Font.prototype.descent = function() {
    var f = this;

    f.compute();
    return f._descent;
}


cute.Font.prototype.family = function(fam) {
    var f = this;

    if (fam === undefined)
	return f._family;

    if (f._family != fam) {
	f._family = fam;
	f._css = undefined;
	f._css_set = false;
	f.request_compute();
    }

    return f;
}


cute.Font.prototype.style = function(s) {
    var f = this;

    if (s === undefined)
	return f._style;

    if (f._style != s) {
	f._style = s;
	f._css = undefined;
	f._css_set = false;
	f.request_compute();
    }

    return f;
}


cute.Font.prototype.weight = function(w) {
    var f = this;

    if (w === undefined)
	return f._weight;

    if (f._weight != w) {
	f._weight = w;
	f._css = undefined;
	f._css_set = false;
	f.request_compute();
    }

    return f;
}


cute.Font.prototype.pixels = function(p) {
    var f = this;

    if (p === undefined)
	return f._pixels;

    if (f._pixels !== p) {
	f._pixels = p;
	f._css = undefined;
	f._css_set = false;
	f.request_compute();
    }

    return f;
}


cute.Font.prototype.points = function(p) {
    var f = this;

    if (p === undefined)
	return f._points;

    if (f._points !== p) {
	f._points = p;
	f._css = undefined;
	f._css_set = false;
	f.request_compute();
    }

    return f;
}


cute.Font.prototype.css = function(font) {
    var f = this;

    if (font === undefined) {
	f.compute();
	return f._css;
    }

    f._css = font;
    f._css_set = true;
    f.request_compute();
    f.compute();

    return f;
}
/*  $Id$
 *  
 *  File	text.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Text
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Text
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Text = function (str, font, fmt, base) {
    var t = this;

    cute.Graphical.call(t);
    t._string = str || "";
    t._font = font || new cute.Font("sans-serif", 10);
    t._format = fmt || 'left';
    t._baseline = base || 'top';
    t._position = new cute.Point(0,0);
    t._background = null;
    t._selection = null;

    if (cute.ctx) {	/* TBD -- initialisation of constructor */
	t.init_size();
    }

    return t;
}

cute.Text.prototype = new cute.Graphical();
cute.Text.prototype.constructor = cute.Text;

cute.Text.prototype.toString = function() {
    var t = this;
    var a = t._area;

    return 'cute.Text(' + t._string + ') area [' + a._x + ' ' + a._y + ' ' + a._w + ' ' + a._h + ']';
}


cute.Text.prototype.init_size = function() {
    var t = this;
    var w, h;
    
    h = t._font.height();
    r_font(cute.ctx, t._font);
    w = cute.ctx.measureText(t._string).width;

    if (h !== t._area._h || w !== t._area._w)
	t.set(undefined, undefined, w, h);

    return t;
}

cute.Text.prototype.init_height = function() {
    var t = this;
    var h;
    
    h = t._font.height();
    if (h !== t._area._h)
	t.set(undefined, undefined, undefined, h);

    return t;
}

cute.Text.prototype.init_width = function() {
    var t = this;
    var w;

    r_font(cute.ctx, t._font);
    w = cute.ctx.measureText(t._string).width;
    if (w !== t._area._w)
	t.set(undefined, undefined, w, undefined);

    return t;
}

cute.Text.prototype.font = function(ft) {
    var t = this;

    if (ft === undefined)
	return t._font;
    if (ft !== t._font) {
	t._font = ft;
	t.init_size();
	t.request_compute(true);
    }

    return t;
}
	    
cute.Text.prototype.string = function(str) {
    var t = this;

    if (str === undefined)
	return t._string;
    if (str != t._string) {
	t._string = str;
	t.init_width();
	t.request_compute(true);
    }
    return t;
}

cute.Text.prototype.render_canvas = function(ctx) {
    var t = this;
    var a = t._area;

    r_font(ctx, t._font.css());
    r_line_width(ctx, t._pen);
//  r_stroke_style(ctx, t._colour);
    r_fill_style(ctx, t._colour);

    r_text(ctx, t._string, a._x, a._y, t._baseline);

    if (t._shadow)
	t._shadow.render_reset(ctx);  
    return t;
}
/*  $Id$
 *  
 *  File	connection.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Connection
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	11/07/12  (Created)
 *  		11/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Connection
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Connection = function(from, to, link, from_handle, to_handle) {
    var c = this;

    cute.Line.call(c, 0,0,0,0);
    if (!link)
	link = new cute.Link();
    cute.Line.prototype.copy.call(c, link._line);

    c._link = link;
    c._from_handle = from_handle || null;
    c._to_handle = to_handle || null;
    c._fixed_from = (from_handle ? true : false);
    c._fixed_to = (to_handle ? true : false);

    return c.relate(from, to);
}

cute.Connection.prototype = new cute.Line();
cute.Connection.prototype.constructor = cute.Connection;

cute.Connection.prototype.toString = function() {
    var cn = this;
    var c = ", ";
    return "connection(" + cn._from + c + cn._to + c + cn._link + ")";
}

cute.Connection.prototype.unlink = function() {
    var c = this;

    if (c._from) c._from.detach_connection(c);
    if (c._to) c._to.detach_connection(c);

    cute.Graphical.prototype.unlink.call(c);

    return c;
}

cute.Connection.prototype.relate = function(from, to) {
    var c = this;

    if (from != c._from && c._from) {
	c._from.detach_connection(c);
	c._from = null;
    }
    
    if (to != c._to && c._to) {
	c._to.detach_connection(c);
	c._to = null;
    }

    if (from) {
	from.attach_connection(c);
	c._from = from;
    }

    if (to) {
	to.attach_connection(c);
	c._to = to;
    }

  return c.update_device();
}


cute.Connection.prototype.update_device = function() {	// Internal?
    var c = this;
    var from = this._from;
    var to = this._to;
    var dev;

    if (!from || !to || !(dev = from.common_device(to)))
	return c.device(null);
    c.device(dev);

    return c.request_compute();
}


function available_from_handles(c, gr) {
    if (c._from_handle && c._fixed_from)
	return [gr.get_handle(c._from_handle)];
    return available_handles(c, c._link._from, gr);
}

function available_to_handles(c, gr) {
    if (c._to_handle && c._fixed_to)
	return [gr.get_handle(c._to_handle)];
    return available_handles(c, c._link._to, gr);
}

function available_handles(c, kind, gr) {
    var handles = [];
    var hdls = gr._handles;

    for (var i=0; i<hdls.length; i++) {
	var h = hdls[i];
	if (h._kind == kind)
	    handles.push(h);
    }

    return handles;
}
    
/*  Find the best handles and return the connection points in result.
    Implementation is naive, it finds the matching handles in from and to that
    have the shortest distance.
 */
    
cute.Connection.prototype.connection_points = function(from, to, result) {
    var c = this;
    var hfs = available_from_handles(c, from);
    var hts = available_to_handles(c, to);
    var dev = c._device;
    var xfs = new Array(hfs.length);
    var yfs = new Array(hfs.length);
    var xts = new Array(hts.length);
    var yts = new Array(hts.length);

    for (var i=0; i<hfs.length; i++) {
	var xy = hfs[i].xy(from, dev);
	xfs[i] = xy.x;
	yfs[i] = xy.y;
    }
    for (var i=0; i<hts.length; i++) {
	var xy = hts[i].xy(to, dev);
	xts[i] = xy.x;
	yts[i] = xy.y;
    }

    var bestf = 0, bestt = 0, bestd = Infinity;
    var found = false;

    for (var i=0; i<hfs.length; i++) {
	for (var j=0; j<hts.length; j++) {
	    var d = distance(xfs[i], yfs[i], xts[j], yts[j]);
	    if (found === false || d < bestd) {
		bestd = d;
		bestf = i;
		bestt = j;
		found = true;
	    }
	}
    }

    if (found) {
	var hf = hfs[bestf];
	var ht = hts[bestt];

	result.x1 = xfs[bestf];
	result.y1 = yfs[bestf];
	result.x2 = xts[bestt];
	result.y2 = yts[bestt];

	c._from_handle = hf._name;
	c._to_handle = ht._name;
	return true;
    }

    return false;
}

cute.Connection.prototype.update_line = function(x1, y1, x2, y2) {
    var c = this;

    if (x1 != cute.Line.prototype.start_x.call(c) ||
	y1 != cute.Line.prototype.start_y.call(c) ||
	x2 != cute.Line.prototype.end_x.call(c) ||
	y2 != cute.Line.prototype.end_y.call(c))
	c.points(x1, y1, x2, y2);
    return this;
}

cute.Connection.prototype.compute = function() {
    var c = this;

    if (c._request_compute) {
	var from = c._from;
	var to = c._to;
	var dev = c._device;

	if (from.is_displayed(dev) && to.is_displayed(dev)) {
	    var r = {x1: 0, y1:0, x2: 0, y2: 0};

	    if (c.connection_points(from, to, r)) {
		c.update_line(r.x1, r.y1, r.x2, r.y2);
		cute.Line.prototype.compute.call(c);
		c.displayed(true);
		c._request_compute = false;
		return this;
	    }
	}
	c._request_compute = false;
	c.displayed(false);
    }

    return this;
}

var connection_in_points = 0;

cute.Connection.prototype.points = function(x1, y1, x2, y2) {
    connection_in_points++;
    cute.Line.prototype.points.call(this, x1, y1, x2, y2);
    connection_in_points--;

    return this;
}

cute.Connection.prototype.geometry = function(x, y, w, h) {
    if (connection_in_points > 0)
	cute.Graphical.prototype.geometry(x, y, w, h);
    return this;
}

cute.Connection.prototype.opposite = function(gr) {
    var c = this;

    if (c._to === gr)
	return c._from;
    if (c._from === gr)
	return c._to;
    return null;
}

cute.Connection.prototype.update_link_attributes = function() {
    var c = this;
    var proto = c._link._line;

    // CHANGING_GRAPHICAL
    c._pen = proto._pen;
    c.set_arrows(proto._first_arrow, proto._second_arrow);
    // CHANGED_ENTIRE_IMAGE_GRAPHICAL

    return c.request_compute();
}
/*  $Id$
 *  
 *  File	handle.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Handle
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Cophright (c) 2012  Universith of Twente
 *  
 *  Historh	12/07/12  (Created)
 *  		12/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Handle
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Handle = function(func_x, func_y, kind, name) {
    var h = this;

    if (!kind)
	kind = "link";
    if (!name)
	name = kind;

    h._x_position = func_x;	/* Call as: func_x(w, h) */
    h._y_position = func_y;
    h._kind = kind;
    h._name = name;

    return h;
}


cute.Handle.prototype.toString = function() {
    var c = ", ";
    return "handle(" + this._kind + c + this._name + ")";
}


/*------------------------------------------------------------
 *  Assessors
 *------------------------------------------------------------*/

cute.Handle.prototype.y_position = function(f) {
    if (f) {
	this._y_position = f;
	return this;
    }
    return this._y_position;
}

cute.Handle.prototype.x_position = function(f) {
    if (f) {
	this._x_position = f;
	return this;
    }
    return this._x_position;
}

cute.Handle.prototype.kind = function(kind) {
    if (kind) {
	this._kind = kind;
	return this;
    }
    return this._kind;
}

cute.Handle.prototype.name = function(name) {
    if (name) {
	this._name = name;
	return this;
    }
    return this._name;
}


/*------------------------------------------------------------
 *  Computing the xy position
 *------------------------------------------------------------*/

cute.Handle.prototype.xy = function(gr, dev) {
    var h = this;
    var x, y, gx, gy;
    var xy;

    if (!dev)
	dev = gr._device;

    if (xy = gr.absolute_xy(dev)) {
	gx = xy.x;
	gy = xy.y;
    } else
	return false;

    x = h._x_position(gr._area._w, gr._area._h);
    y = h._y_position(gr._area._w, gr._area._h);

    return {x: x+gx, y: y+gy};
}


cute.Handle.prototype.position = function(gr, dev) {
    var xy = this.xy(gr, dev);

    if (xy)
	return new cute.Point(xy.x, xy.y);
    return false;
}


cute.Handle.prototype.x = function(gr, dev) {
    var xy = this.xy(gr, dev);

    if (xy)
	return xy.x;
    return false;
}


cute.Handle.prototype.y = function(gr, dev) {
    var xy = this.xy(gr, dev);

    if (xy)
	return xy.y;
    return false;
}


/*  $Id$
 *  
 *  File	link.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Link
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	12/07/12  (Created)
 *  		12/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Link
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Link = function(from, to, link, line, func) {
    var l = this;

    if (!from)
	from = "link";
    l._from = from;
    l._to = to || from;
    l._line = line || new cute.Line();
    l._connection_constructor = func;

    return l;
}

cute.Link.prototype.toString = function() {
    var l = this;
    var c = ", ";

    return "link(" + l._from + c + l._to + c + l._link + ")";
}


/*   Returns a new connection based on the link.
 */
cute.Link.prototype.connection = function(gr, gr2, from, to) {
    return l._connection_constructor(gr, gr2, this, from, to);
}


cute.Link.prototype.from = function(gr) {
    if (gr) {
	this._from = gr;
	return this;
    }
    return this._from;
}

cute.Link.prototype.to = function(gr) {
    if (gr) {
	this._to = gr;
	return this;
    }
    return this._to;
}

cute.Link.prototype.line = function(ln) {
    if (ln) {
	this._line = ln;
	return this;
    }
    return this._line;
}

cute.Link.prototype.connection_constructor = function(f) {
    if (f) {
	this._connection_constructor = f;
	return this;
    }
    return this._connection_constructor;
}
/*  $Id$
 *  
 *  File	ellipse.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Ellipse
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	13/07/12  (Created)
 *  		13/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Ellipse
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Ellipse = function (w, h) {
    cute.Graphical.call(this, 0,0,w,h);

    return this;
}

cute.Ellipse.prototype = new cute.Graphical();
cute.Ellipse.prototype.constructor = cute.Ellipse;


cute.Ellipse.prototype.render_canvas = function(ctx) {
    var e = this;
    var a = e._area;
    var x, y, w, h;

    e._area.normalise();
    x = a._x + r;
    y = a._y + r;
    w = a._w;
    h = a._h;

    if (c._fill_pattern)
	r_fill_style(e._fill_pattern);
    if (c._pen > 0) {
	r_line_width(ctx, e._pen);
	r_stroke_style(ctx, e._colour);
    }

    if (e._fill_pattern && e._pen > 0)
	r_ellipse(ctx, x, y, w, h);
    else if (e._fill_pattern)
	r_fill_ellipse(ctx, x, y, w, h);
    else if (e._pen > 0) 
	r_stroke_ellipse(ctx, x, y, w, h);

    return e;
}

cute.Ellipse.prototype.toString = function() {
    var e = this;
    return "ellipse(" + e._w, + ", " + e._h + ")";
}



/*  $Id$
 *  
 *  File	path.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Path
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	13/07/12  (Created)
 *  		13/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Path
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Path = function(points) {
    var p = this;
    
    cute.Joint.call(p);
    p._offset = new cute.Point(0,0);
    p._points = (points || []);
    p._closed = false;
    p._mark = null;

    if (points) 
	p.points(points);

    return p;
}

cute.Path.prototype = new cute.Joint();
cute.Path.prototype.constructor = cute.Path;

cute.Path.prototype.toString = function() {
    var p = this;
    return "path(" + p._w, + ", " + p._h + ")";
}

cute.Path.prototype.adjust_first_arrow = function() {
    var p = this;

    if (p._first_arrow) {
	if (p._points.length >= 2) {
	    var tip = p._points[0];
	    var ref = p._points[1];

	    p._first_arrow.points(tip.x + p._offset._x,
				  tip.y + p._offset._y,
				  ref.x + p._offset._x,
				  ref.y + p._offset._y);
	    p._first_arrow.Compute();
	    return true;
	}
    }
    return false;
}


cute.Path.prototype.adjust_second_arrow = function() {
    var p = this;

    if (p._second_arrow) {
	if (p._points.length >= 2) {
	    var tip = p._points[p._points.length-1];
	    var ref = p._points[p._points.length-2];

	    p._second_arrow.points(tip.x + p._offset._x,
				   tip.y + p._offset._y,
				   ref.x + p._offset._x,
				   ref.y + p._offset._y);
	    p._second_arrow.Compute();
	    return true;
	}
    }
    return false;
}

cute.Path.prototype.render_canvas = function(ctx) {
    var p = this;
    var ox, oy;

    ox = p._area._x + p._offset._x;
    oy = p._area._y + p._offset._y;

    r_fill_style(ctx, p._colour);
    r_line_width(ctx, p._pen);
    r_path(ctx, p._points, ox, oy, p._closed, p._fill_pattern);

    // TBD -- mark

    if (p.adjust_first_arrow())
	p._first_arrow.render_canvas(ctx);
    if (p.adjust_second_arrow())
	p._second_arrow.render_canvas(ctx);

    return this;
}


cute.Path.prototype.append = function(pt) {
    this._points.push(pt);
    this.request_compute();
    return this;
}

cute.Path.prototype.clear = function() {
    var p = this;

    p._points = [];
    p.request_compute();

    return p;
}

cute.Path.prototype.points = function(pts) {
    var p = this;
    p._points = pts;
    p.request_compute();

    return p;
}


cute.Path.prototype.closed = function(val) {
    if (val) {
	if (val != this._closed) {
	    this._closed = val;
	    this.request_compute();
	    return this;
	}
	return this;
    }
    return this._closed;
}


cute.Path.prototype.mark = function(img) {
    if (img) {
	if (img != this._mark) {
	    this._mark = img;
	    this.request_compute();
	    return this;
	}
	return this;
    }
    return this._mark;
}


cute.Path.prototype.compute = function() {
    var p = this;

    if (p._request_compute) {
	p.compute_bounding_box();
	cute.Graphical.prototype.changed_area(p);
	p._request_compute = false;
    }
    return p;
}


cute.Path.prototype.compute_bounding_box = function() {
    var p = this;
    var points = p._points;
    var minx = 1000000, miny = 1000000, maxx = -1000000, maxy = -10000000;

    for (var i=0; i<points.length; i++) {
	var pt = points[i];
	var px = pt._x;
	var py = pt._y;

	if (px < minx) minx = px;
	if (px > maxx) maxx = px;
	if (py < miny) miny = py;
	if (py > maxy) maxy = py;
    }

    if (p._mark || p._selected === true) {
	var mw = 0;
	var mh = 0;
	
	if (p._mark) {
	    mw = p._mark._size._w;
	    mh = p._mark._size._h;
	}
	if (p._selected === true) {		/* selection bubbles */
	    mw = Math.max(mw, 5);
	    mh = Math.max(mh, 5);
	}

	minx -= (mw+1)/2;
	maxx += (mw+1)/2;
	miny -= (mh+1)/2;
	maxy += (mh+1)/2;
    }

    if (maxx >= minx && maxy >= miny) {
	var pens = p._pen / 2;
	var pena = p._pen % 2 == 0 ? pens : pens + 1;

	minx -= pens; maxx += pena;
	miny -= pens; maxy += pena;

	p._area._x = minx + p._offset._x;
	p._area._y = miny + p._offset._y;
	p._area._w = maxx - minx;
	p._area._h = maxy - miny;
    } else
	p._area.clear();

    if (p.adjust_first_arrow())
	p._area.union_normalised(p._first_arrow._area);
    if (p.adjust_second_arrow())
	p._area.union_normalised(p._second_arrow._area);

    return this;
}


cute.Path.prototype.geometry = function(x, y, w, h) {
    var p = this;
    var a = p._area;
    var ox, ax, offx, ooffx;
    var oy, ay, offy, ooffy;
    var ow, oh;
    var xf, yf;

    cute.Graphical.prototype.Compute.call(p);
    ox = a._x;
    oy = a._y;
    ow = a._w;
    oh = a._h;

    // CHANGING_GRAPHICAL
    if (ow == 0 || oh == 0) {
	a.set(x, y, ow, oh);
	if (ox !== a._x || oy !== a._y || ow !== a._w || oh !== a._h)
	  p.changed_area(ox, oy, ow, oh);
	return p;
    }

    a.set(x, y, w, h);
    ax = a._x;
    ay = a._y;
    ooffx = p._offset._x;
    ooffy = p._offset._y;
    offx = ooffx + ax - ox;
    offy = ooffy + ay - oy;
    xf = a._w / ow;
    yf = a._h / oh;

    p._offset._x = offx;
    p._offset._y = offy;

    for (var i=0; i<p._points.length; i++) {
	var pt = p._points[i];
	var nx = ax + ((pt._x-ox+ooffx) * xf) - offx;
	var ny = ay + ((pt._y-oy+ooffy) * yf) - offy;

	pt._x = nx;
	pt._y = ny;
    }
    if (ox !== a._x || oy !== a._y || ow !== a._w || oh !== a._h)
	p.changed_area(ox, oy, ow, oh);

    return this;
}
/*  $Id$
 *  
 *  File	events.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Handling mouse and touch events
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		14/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Events
 *------------------------------------------------------------*/

var cute = cute || {};


cute.Event = function(ev, type, device, x, y, time) {
    var ev = this;

    ev._ev = ev;
    ev._type = type;
    ev._device = device;
    ev._x = x;
    ev._y = y;
    ev._gesture = null;

    return ev;
}


cute.Event.prototype.toString = function() {
    var ev = this;
    var c = ", ";
    
    return "event(" + ev._type + c + ev._x + c + ev._y + ")";
}


cute.Event.prototype.gesture = function(g) {
    var ev = this;
 
    if (g) {
	ev._gesture = g;
	return ev;
    }
    return ev._gesture;
}
    

cute.Event.prototype.xy_figure = function(gr) {
    var ev = this;
    var xy = gr.offset_figure();
    var x = ev._x - xy.x;
    var y = ev._y - xy.y;

    console.log("xy_figure " + ev._x + " " + ev._y + ", " + xy.x + " " + xy.y);

    return {x: x, y: y};
}
    
/*  $Id$
 *  
 *  File	modifier.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Modified
 *  Works with	JavaScript 1.5
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		17/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Modifier
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Modifier = function(shift, control, meta) {
    var m = this;

    if (typeof(shift) == 'string')
	m.convert(shift);
    else {
	m._shift = shift || false;
	m._control = control || false;
	m._meta = meta || false;
    }
    
    return m;
}

cute.Modifier.prototype.convert = function(str) {
    var m = this;

    m._shift = false;
    m._control = false;
    m._meta = false;
    for (var i=0; i<str.length; i++)
	switch (str[i]) {
	case 's':	m._shift = true; break;
	case 'c':	m._control = true; break;
	case 'm':	m._meta = true; break;
	}
    return this;
}
	
cute.Modifier.prototype.shift = function(val) {
    if (val === undefined)
	return m._shift;
    m._shift = val;
    return this;
}

cute.Modifier.prototype.control = function(val) {
    if (val === undefined)
	return m._control;
    m._control = val;
    return this;
}

cute.Modifier.prototype.meta = function(val) {
    if (val === undefined)
	return m._meta;
    m._meta = val;
    return this;
}
/*  $Id$
 *  
 *  File	gesture.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Gesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		14/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class Gesture
 *------------------------------------------------------------*/

var cute = cute || {};

cute.Gesture = function() {
    var g = this;
    
    g._modifier = undefined;
    g._button = undefined;
    g._condition = null;
    g._active = true;		
    g._status = 'inactive';
    g._cursor = undefined;

    return g;
}


cute.Gesture.prototype.modifier = function(mod) {
    var g = this;

    if (modifier === undefined)
	return g._modifier;

    if (typeof(modifier) == 'string')
	g._modifier = new cute.Modifier(modifier);
    else
	g._modifier = modifier;

    return g;
}
    

cute.Gesture.prototype.modifiers_match = function(ev) {
    return true;
}

cute.Gesture.prototype.event = function(ev) {
    return false;
}


/*  Called on proper finish of gesture (e.g., mouse_up).
 */
cute.Gesture.prototype.terminate = function(ev) {
    return true;
}


/*  Called on unproper finish of gesture (e.g., mouse out of window).
 */
cute.Gesture.prototype.cancel = function(ev) {
    return this.terminate(ev);
}
/*  $Id$
 *  
 *  File	move_gesture.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class MoveGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.MoveGesture
 *------------------------------------------------------------*/

var cute = cute || {};

cute.MoveGesture = function() {
    var g = this;

    cute.Gesture.call(g);
    g._offset = new cute.Point(0,0);
    g._event = null;
    g._receiver = null;

    return g;
}

cute.MoveGesture.prototype = new cute.Gesture();
cute.MoveGesture.prototype.constructor = cute.MoveGesture;

cute.MoveGesture.prototype.toString = function() {
    var g = this;
    return "move_gesture(" + g._offset._x + ", " + g._offset._y + ")";
}


cute.MoveGesture.prototype.event = function(ev, gr) {
    var g = this;

    g._receiver = gr;
    if (g.initiate(ev)) {
	ev._gesture = g;
	return true;
    }
    return false;
}


cute.MoveGesture.prototype.initiate = function(ev) {
    var g = this;
    var gr = ev._receiver;

    if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
	g._offset._x = ev._x;
	g._offset._y = ev._y;
	g._initial_x = gr._area._x;
	g._initial_y = gr._area._y;

	return true;
    }

    return false;
}

cute.MoveGesture.prototype.verify = function(ev) {
    return true;
}

cute.MoveGesture.prototype.drag = function(ev) {
    var g = this;
    var dx = ev._x - g._offset._x;
    var dy = ev._y - g._offset._y;
    var gr = g._receiver;

    gr.relative_move_xy(dx, dy);
    g._offset._x = ev._x;
    g._offset._y = ev._y;
    ev._device.modified();

    return true;
}

cute.MoveGesture.prototype.terminate = function(ev) {
    return this;
}

/*  $Id$
 *  
 *  File	constraint_move_gesture.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ConstraintMoveGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	06/08/12  (Created)
 *  		06/08/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.ConstraintMoveGesture
 *------------------------------------------------------------*/

var cute = cute || {};

cute.ConstraintMoveGesture = function(direction) {
    var g = this;

    cute.MoveGesture.call(g);
    g._direction = direction || 'horizontal';

    return g;
}

cute.ConstraintMoveGesture.prototype = new cute.MoveGesture();
cute.ConstraintMoveGesture.prototype.constructor = cute.ConstraintMoveGesture;

cute.ConstraintMoveGesture.prototype.toString = function() {
    var g = this;
    return "constraint_move_gesture(" + g._offset._x + " " + g._offset._y + ")";
}


cute.ConstraintMoveGesture.prototype.drag = function(ev) {
    var g = this;
    var abs_xy = g._receiver.absolute_xy(g._device);
    var x = ev._x - abs_xy.x - g._offset._x;
    var y = ev._y - abs_xy.y - g._offset._y;

    switch (g._direction) {
    case 'horizontal':
	g._receiver.relative_move_xy(x, 0);
	break;
    case 'vertical':
	g._receiver.relative_move_xy(0, y);
    }
    ev._device.modified();

    return true;
}
/*  $Id$
 *  
 *  File	radial_button.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class RadialButton
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/08/12  (Created)
 *  		04/08/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class RadialButton
 *------------------------------------------------------------*/

var cute = cute || {};

cute.RadialButton = function(r0, x1, y1, r1, stops) {
    var b = this;
    var r = Math.max(r0, r1);

    cute.Circle.call(b, r);

    b._radius0 = r0 || 10;
    b._radius1 = r1 || b._radius0;
    b._x1 = x1 || 0;
    b._y1 = y1 || 0;
    b._stops = stops || [];

    return b;
}

cute.RadialButton.prototype = new cute.Circle();
cute.RadialButton.prototype.constructor = cute.RadialButton;

cute.RadialButton.prototype.toString = function() {
    return "  = RadialButton(" + this._area + ")";
}


cute.RadialButton.prototype.stops = function(stops) {
    var b = this;

    if (stops) {
	b._stops = stops;
	b.request_compute();
	return b;
    }
    return b._stops;
}


cute.RadialButton.prototype.render_canvas = function(ctx) {
    var b = this;
    var x0 = b._area._x;
    var y0 = b._area._y;
    var r0 = b._area._w / 2;
    var dx1 = b._x1;
    var dy1 = b._y1;
    var r1 = b._radius1;
    var stops = b._stops;

    r_radial_gradient(ctx, x0+r0, y0+r0, r0, x0+r0+dx1, y0+r0+dx1, r1, stops);
    return this;
}
/*  $Id$
 *  
 *  File	colour.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Colour
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	10/07/12  (Created)
 *  		10/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Colour
 *------------------------------------------------------------*/

cute.Colour = function(str, r,g,b,a) {
    var c = this;

    if (str) {
	c._css = str;
	return c;
    }
    	/* Transparent black is default */
    c._css = "rgba("+(r||0)+','+(g||0)+','+(b||0)+','+(a||1) +')';

    return c;
}


cute.Colour.prototype.toString = function() {
    return 'Colour(' + this._css + ')';
}

/*  $Id$
 *  
 *  File	shadow.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Shadow
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	17/09/12  (Created)
 *  		17/09/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.Shadow
 *------------------------------------------------------------*/

cute.Shadow = function(colour, blur, offset_x, offset_y) {
    var sh = this;

    sh._colour = colour || 'black';
    sh._blur = blur || 20;
    sh._offset_x = offset_x || 0;
    sh._offset_y = offset_y || 0;

    return sh;
}


cute.Shadow.prototype.render_canvas = function(ctx) {
    var sh = this;

    ctx.shadowColor = sh._colour;
    ctx.shadowBlur = sh._blur;
    ctx.shadowOffsetX = sh._offset_x;
    ctx.shadowOffsetY = sh._offset_y;

    return sh;
}


cute.Shadow.prototype.render_reset = function(ctx) {
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    return this;
}
/*  $Id$
 *  
 *  File	drag_drop_gesture.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class DragDropGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.DragDropGesture
 *------------------------------------------------------------*/

var cute = cute || {};

cute.DragDropGesture = function() {
    var g = this;

    cute.MoveGesture.call(g);
    g._target = undefined;
    g._middle = true;
    if ('ontouchend' in document)
	g._hover_above = 35;	// Number of pixels to shift receiver to make
    else			// it visible on touch devices 
	g._hover_above = 0;

    return g;
}

cute.DragDropGesture.prototype = new cute.MoveGesture();
cute.DragDropGesture.prototype.constructor = cute.DragDropGesture;

cute.DragDropGesture.prototype.toString = function() {
    var g = this;
    return "DragDropGesture(" + g._offset._x + ", " + g._offset._y + ")";
}


cute.DragDropGesture.prototype.middle = function(bool) {
    var g = this;

    if (bool === undefined)
	return g._middle;
    g._middle = bool;

    return g;
}

cute.DragDropGesture.prototype.hover_above = function(val) {
    var g = this;

    if (val === undefined)
	return g._hover_above;
    g._hover_above = val;

    return g;
}

cute.DragDropGesture.prototype.initiate = function(ev) {
    var g = this;
    var gr = ev._receiver;

    if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
	g._offset._x = ev._x;
	g._offset._y = ev._y;
	g._initial_x = gr._area._x;
	g._initial_y = gr._area._y;

	if (g._hover_above) {
	    var abs = gr.absolute_xy();
	    var desired_x = abs.x + gr.width() / 2;
	    var desired_y = abs.y + gr.height();
	    var dx = ev._x - desired_x;
	    var dy = ev._y - desired_y;

	    gr.relative_move_xy(dx, dy-g._hover_above);
	    gr.device().modified();
	}
	return true;
    }

    return false;
}

cute.DragDropGesture.prototype.verify = function(ev) {
}

cute.DragDropGesture.prototype.pointed_objects = function(ev) {
    var g = this;
    var dev = ev._device;
    var pointed = new Array();
    var x, y;

    if (g.middle()) {
	var gr = g._receiver;
	var abs = gr.absolute_xy();

	x = abs.x + gr._area._w/2;
	y = abs.y + gr._area._h/2;
    } else {
	x = ev._x;
	y = ev._y;
    }
    dev.pointed_objects(x, y, pointed);
    pointed.reverse();

    return pointed;
}

cute.DragDropGesture.prototype.terminate = function(ev) {
    var g = this;
    var dev = ev._device;
    var gr = g._receiver;
    var pointed;
    var i;
    
    pointed = g.pointed_objects(ev);

    g._target = undefined;
    for (i=0; i<pointed.length && !g._target; i++) {
	var target = pointed[i];

	if (gr === target)
	    continue;
	if (target.drop_target) {
	    switch (target.drop_target(gr, g)) {
	    case true:
		g._target = target;
		break;
	    case false:
		continue;
	    case 'refuse':
		console.log(Date.now() + ' ' + 'refuse seen in drag-and-drop');
		return g;		// TBD -- really exit here?
	    }
	}
    }

    gr.set(g._initial_x, g._initial_y);
    dev.modified();

    return g;
}
/*  $Id$
 *  
 *  File	click_gesture.js
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ClickGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */ 


/*------------------------------------------------------------
 *  Class cute.ClickGesture
 *------------------------------------------------------------*/

var cute = cute || {};

cute.ClickGesture = function() {
    var g = this;

    cute.Gesture.call(g);
    g._offset = new cute.Point(0,0);
    g._event = null;
    g._receiver = null;
    g._max_drag_distance = 5;

    return this;
}

cute.ClickGesture.prototype = new cute.Gesture();
cute.ClickGesture.prototype.constructor = cute.ClickGesture;

cute.ClickGesture.prototype.toString = function() {
    var g = this;
    return "cute.ClickGesture(" + g._offset._x + ", " + g._offset._y + ")";
}


cute.ClickGesture.prototype.event = function(ev, gr) {
    var g = this;

    g._receiver = gr;
    if (g.initiate(ev)) {
	ev._gesture = g;
	return true;
    }
    return false;
}


cute.ClickGesture.prototype.initiate = function(ev) {
    var g = this;
    var gr = ev._receiver;

    if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
	g._offset._x = ev._x;
	g._offset._y = ev._y;
	g._initial_x = ev._receiver._area._x;
	g._initial_y = ev._receiver._area._y;

	return true;
    }

    return false;
}


cute.ClickGesture.prototype.verify = function(ev) {
    return true;
}


cute.ClickGesture.prototype.drag = function(ev) {
    var g = this;
    var dx = ev._x - g._offset._x;
    var dy = ev._y - g._offset._y;
    var gr = g._receiver;

    if (cute.distance(ev._x, ev._y, g._offset._x, g._offset._y) > g._max_drag_distance) {
	ev._gesture = null;
	return true;
    }
    
    return true;
}


cute.ClickGesture.prototype.terminate = function(ev) {
    var g = this;
    var gr = g._receiver;

    if (gr.on_click) {
	if (gr.on_click(ev._x, ev._y))
	    ev._device.modified();
    }
    return g;
}
