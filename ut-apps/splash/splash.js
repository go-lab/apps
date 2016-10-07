/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        splash.js
 *  Part of     Splash - Go-Lab buoyancy lab
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Definition
 *  Works with  JavaScript
 *  
 *  Notice      Copyright (c) 2013  University of Twente
 *  
 *  History     11/08/13  (Created)
 *              18/08/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

var a3 = a3 || {};
var cute = cute || {};

var splash = (function() {
    var self = {};

    var Property = a3.Property;
    var Thing = a3.Thing;
    var Fluid;
    var Tank;
    var Dropject;
    var Shape;
    var experiment_timer = null;

    /*------------------------------------------------------------
     *  Shapes
     *------------------------------------------------------------*/

    Shape = self.Shape = function(atts0) {
        var atts = atts0 || {};
        var shape = this;

        shape.drag_coefficient = new Property({
            name: 'drag_coefficient'
        });

        Thing.call(shape, atts);

        return shape;
    }

    cute.extend(Shape, Thing);

    Shape.prototype.toString = function() {
        return this.name;
    }

    var Cube = new Shape({ name: 'cube', drag_coefficient: 1.05 });
    var Sphere = new Shape({ name: 'sphere', drag_coefficient: 0.47 });
    var HalfSphere = new Shape({ name: 'half_sphere', drag_coefficient: 0.42 });
    var Cone = new Shape({ name: 'cone', drag_coefficient: 0.5 });
    var AngledCube = new Shape({ name: 'angled_cube', drag_coefficient: 0.8 });

    self.shape = {
        cube: Cube,
        sphere: Sphere,
        half_sphere: HalfSphere,
        cone: Cone,
        angled_cube: AngledCube
    };

    Shape.prototype.volume = function(obj) {
        if (obj.volume.value !== null)
            return obj.volume.value;

        if (this === Cube) {
            var a = obj.get_value('edge_length'); // TBD -- .get

            return (a === undefined ? undefined : a * a * a);
        }

        if (this === Sphere) {
            var r = obj.get_value('radius'); // TBD -- .get

            return (r === undefined ? undefined : 4/3 * Math.PI * r*r*r);
        }
    }

    /**
     *  Displacement of the volume if the bottom of an object is 'h'
     *  relative to the fluid.
     */
    Shape.prototype.displacement = function(obj, h) {
        if (h >= 0) // Above fluid
            return 0;

        h = Math.abs(h);

        if (this === Sphere) {
            var r = obj.get_value('radius'); // TBD -- .get

            if (h > 2*r) // Totally immersed
                return this.volume(obj);
            return ((h*h * Math.PI)/3) * (3*r - h);
        }

        if (this === Cube) {
            var a = obj.get_value('edge_length'); // TBD -- .get

            if (h > a) // Totally immersed
                return this.volume(obj);
            return a * a * h;
        }
    }

    /*------------------------------------------------------------
     *  Substances
     *------------------------------------------------------------*/

    Substance = self.Substance = function(atts0) {
        var atts = atts0 || {};
        var substance = this;

        substance.density = new Property({
            name: 'density',
            unit: 'kg / m^3'
        });

        substance.viscosity = new Property({
            name: 'viscosity',
            symbol: 'greek n',
            unit: 'm*Pa / s'
        });

        Thing.call(substance, atts);

        return substance;
    }

    cute.extend(Substance, Thing);

    Substance.prototype.toString = function() {
        return this.name;
    }

    self.substance = {
        iron: new Substance({ name: 'iron', density: 7874 }),
        water: new Substance({ name: 'water', density: 1000 }),
        oil: new Substance({ name: 'oil', density: 780 }),
        wood: new Substance({ name: 'wood', density: 980 })
    };

    /** Dropjects are used to specify droppable objects.
     */
    Dropject = self.Dropject = function(atts0) {
        var atts = atts0 || {};
        var obj = this;

        obj.substance = new Property({
            name: 'substance',
            is_a: Substance
        });
        obj.shape = new Property({
            name: 'shape',
            is_a: Shape
        });
        obj.volume = new Property({
            name: 'volume',
            unit: 'm^3'
        });
        obj.mass = new Property({
            name: 'mass',
            unit: 'kg'
        });
        obj.density = new Property({
            name: 'density',
            unit: 'kg / m^3'
        });
        obj.radius = new Property({
            name: 'radius',
            unit: 'm'
        });
        obj.edge_length = new Property({
            name: 'edge_length',
            unit: 'm'
        });

        Thing.call(obj, atts);

        obj.update();

        return obj;
    }

    cute.extend(Dropject, Thing);

    Dropject.prototype.toString = function() {
        return JSON.stringify(this, null, 4);
    }

    Dropject.prototype.get_value = function(prop) {
        var val = Thing.prototype.get_value.call(this, prop);

        if (val)
            return val;
        return this.compute_value(prop);
    }

    Dropject.prototype.compute_value = function(prop) {
        var obj = this;

        switch (prop) {
        case 'radius':
            var v = obj.get_value('volume');
            var r = Math.pow(v * 3/4 * 1/Math.PI, 1/3);

            obj.set_value('radius', r);
            return r;

        case 'edge_length':
            var v = obj.get_value('volume');
            var a = Math.pow(v, 1/3);

            obj.set_value('edge_length', a);
            return a;

        case 'density':
            var d;

            if (obj.substance.value) {
                d = obj.set_value('density', obj.substance.value.density.value);
                return d;
            }

            var v = obj.get_value('volume');
            var m = obj.get_value('mass');

            d = m / v;
            obj.set_value('density', d);

            return d;
        }
        return null;
    }

    Dropject.prototype.update_substance = function() {
        var obj = this;

        if (obj.substance.value !== null) {
            obj.density.value = obj.substance.value.density.value;
            obj.volume.value = null;
            obj.update();
        }
    }

    Dropject.prototype.update_mass = function() {
        var obj = this;

        if (obj.substance.value === null)
            obj.density.value = null;
        else
            obj.volume.value = null;
        obj.update();
    }

    Dropject.prototype.update_volume = function() {
        var obj = this;

        if (obj.substance.value === null)
            obj.density.value = null;
        else
            obj.mass.value = null;
        obj.update();
    }

    Dropject.prototype.update = function() {
        var obj = this;

        if (obj.shape.value)
            obj.volume.value = obj.shape.value.volume(obj);

        if (obj.substance.value === null) {
            if (obj.density.value === null) {
                if (obj.mass.value !== null && obj.volume.value !== null)
                    obj.density.value = obj.mass.value / obj.volume.value;
            }
            if (obj.mass.value === null) {
                if (obj.density.value !== null && obj.volume.value !== null)
                    obj.mass.value = obj.density.value * obj.volume.value;
            }
            if (obj.volume.value === null) {
                if (obj.density.value !== null && obj.mass.value !== null)
                    obj.volume.value = obj.mass.value * obj.density.value;
            }
        } else {
            obj.density.value = obj.substance.value.density.value;

            if (obj.mass.value === null) {
                if (obj.substance.value !== null && obj.volume.value !== null)
                    obj.mass.value = obj.density.value * obj.volume.value;
            }

            if (obj.volume.value === null) {
                if (obj.substance.value !== null && obj.mass.value !== null)
                    obj.mass.value = obj.density.value * obj.volume.value;
            }
        }
    }

    Dropject.prototype.force_gravitation = function() {
        var m = this.mass.value; // kg
        var g = 9.80665; // m / s^2

        return (m * g); // kg m / s^2
    }

    Dropject.prototype.force_buoyancy = function(fluid, immersed) {
        if (immersed === 0)
            return 0;

        var rho = fluid.substance.value.density.value;
        var g = 9.80665; // m / s^2

        return (rho * immersed * g);
    }

    Dropject.prototype.force_drag = function(fluid, v, h) {
        var rho = fluid.substance.value.density.value;
        var C_d = this.drag_coefficient();
        var A = this.reference_area(h);

        return (1/2) * rho * v*v * C_d * A;
    }

    Dropject.prototype.reference_area = function(h) {
        var obj = this;

        if (obj.shape.value === Sphere) {
            var r = obj.get_value('radius'); // TBD . get
            var a;

            if (h < -r || h > 0)
                a = Math.PI * r * r;
            else {
                h = -h;
                a = Math.PI * (h * (2*r-h));
            }
            return a;
        }
        if (obj.shape.value === Cube) {
            var a = obj.get_value('edge_length'); // TBD .get
            return a * a;
        }
        throw 'Error: reference_area unknown for ' + obj;
    }

    Dropject.prototype.drag_coefficient = function() {
        var obj = this;

        return obj.shape.value.get_value('drag_coefficient');
    }

    Dropject.prototype.displacement = function(h) {
        return this.shape.value.displacement(this, h);
    }

    Fluid = self.Fluid = function(atts0) {
        var atts = atts0 || {};
        var fluid = this;

        fluid.substance = new Property({
            name: 'substance',
            is_a: Substance
        });
        fluid.volume = new Property({
            name: 'volume',
            unit: 'm^3'
        });
        fluid.mass = new Property({
            name: 'mass',
            unit: 'kg'
        });

        Thing.call(fluid, atts);

        fluid.update();

        return fluid;
    }

    cute.extend(Fluid, Thing);

    Fluid.prototype.update = function() {
        var fluid = this;

        if (fluid.mass.value === null && fluid.substance && fluid.volume.value)
            fluid.mass.value = fluid.substance.value.density.value * fluid.volume.value;
        if (fluid.volume.value === null && fluid.substance && fluid.mass.value)
            fluid.volume.value = fluid.mass.value / fluid.substance.value.density.value;
    }

    Fluid.prototype.immersed = function(obj) {
        var fluid = this;
        var d_fluid = fluid.substance.value.get_value('density');
//      var d_obj = obj.substance.value.get_value('density');
        var d_obj = obj.get_value('density');

        if (d_fluid < d_obj)
            return obj.get_value('volume');
        return obj.get_value('volume') * d_obj / d_fluid;
    }

    Tank = self.Tank = function(atts0) {
        var atts = atts0 || {};
        var tank = this;

        tank.width =
            new Property({
                name: 'width',
                symbol: 'w',
                unit: 'm'
            });
        tank.height =
            new Property({
                name: 'height',
                symbol: 'h',
                unit: 'm'
            });
        tank.depth =
            new Property({
                name: 'depth',
                symbol: 'd',
                unit: 'm'
            });

        tank.volume = new Property({
            name: 'volume',
            symbol: 'V',
            unit: 'cm^3'
        });

        Thing.call(this, atts);

        tank.update_volume();

        return this;
    };

    cute.extend(Tank, Thing);

    Tank.prototype.toString = function() {
        return 'Tank: V ' + this.volume.value;
    };

    Tank.prototype.update_volume = function() {
        var tank = this;

        tank.volume.value = tank.width.value * tank.height.value * tank.depth.value;
        return this;
    };

    Tank.prototype.fluid_level = function(v_fluid) {
        var tank = this;

        return v_fluid / (tank.get_value('width') * tank.get_value('depth'));
    }

    if (typeof(angular) !== 'undefined') {
        var my_tank = new Tank();
        var ng_tank = angular.module("tank", []);

    ng_tank.controller("tank_controller", function($scope) {
        var tank = my_tank;
        var canvas = new cute.Canvas('tank_canvas');
        var box;

        $scope.tank = tank;

        $scope.$watch('tank.width.value', function() {
            $scope.tank.update_volume();
            box.width(tank.width.value);
            canvas.modified();
        });
        $scope.$watch('tank.height.value', function() {
            $scope.tank.update_volume();
            box.height(tank.height.value);
            canvas.modified();
        });
        $scope.$watch('tank.depth.value', function() {
            $scope.tank.update_volume();
            box.depth(tank.depth.value);
            canvas.modified();
        });
        $scope.$watch('tank.width.fixed', function() {
        });

        box = new self.Box3d(
            { w: tank.width.value,
              h: tank.height.value,
              d: tank.depth.value
            });

        canvas.display(box, new cute.Point(100,50));
        canvas.render();
    });

    ng_tank.directive('slider', function() {
        return {
            restrict: 'E',
            link: function(scope, element, atts) {
                var obj = atts.object;
                var prop = atts.prop;
                var model = scope[obj];

                function slide(event, ui) {
                    var val = $(element).slider("option", "value");
                    model[prop].value = val;
                    scope.$apply();
                }

                $(element).slider({
                    min: 1,
                    max: 100,
                    value: model[prop].value,
                    slide: slide,
                    change: slide
                });
            }
        }
    });

    var ng_dropject = angular.module('dropject', []);

    ng_dropject.controller('dropject_controller', function ($scope) {
        var obj = {};
        var options = {};

        obj = { substance: { name: 'substance',
                            label: 'Materiaal'
                          },
                shape: { name: 'shape',
                         label: 'Vorm'
                       },
                mass: { name: 'mass',
                        label: 'Gewicht',
                        value: 1
                      },
                volume: { name: 'volume',
                          label: 'Volume',
                          value: 1
                        }
              };

        options = { substances: [ { name: 'wood', label: 'hout'},
                                 { name: 'plastic', label: 'plastic'},
                                 { name: 'iron', label: 'ijzer'},
                                 { name: 'oil', label: 'olie'}
                               ],
                    shapes: [ { name: 'cube', label: 'kubus' },
                              { name: 'sphere', label: 'bol' }
                            ]
                  };

        $scope.select_substance = function(val) {
            obj.substance.value = val;
        }

        $scope.dropject = obj;
        $scope.options = options;
    });

    ng_dropject.directive('slider', function() {
        return {
            restrict: 'EA',
            link: function(scope, element, atts) {
                var obj = atts.object;
                var prop = atts.prop;
                var model = scope[obj];

                function slide(event, ui) {
                    var val = $(element).slider("option", "value");
                    model[prop].value = val;
                    scope.$apply();
                }

                $(element).slider({
                    min: 1,
                    max: 100,
                    value: model[prop].value,
                    slide: slide,
                    change: slide
                });
            }
        }
    });

        var ng_experiment = angular.module('experiment', []).
            filter('nullorname', function() {
                return function (val) {
                    if (val === null)
                        return 'Unknown';
                    return val.name;
                };});
        var ng_experiment_dropject = new Dropject({
            shape: Cube,
            volume: 0.00001,
            mass: 0.01
        });

        ng_experiment.controller('experiment_controller', function ($scope) {
            var obj = ng_experiment_dropject;
            var options = {};

            obj.time = 0.00;
            obj.dt = 0.01;
            obj.width = 0.00;
            obj.status = 'not started';

            $("#experiment_run").click(function() {
                if (experiment_timer) {
                    $("#experiment_already_running").dialog({
                        model: true,
                        buttons: {
                            ok: function() {
                                $(this).dialog('close');
                            }
                        }
                    });
                } else
                    experiment(obj, $scope);
            });

            $("#experiment_stop").click(function() {
                if (experiment_timer) {
                    clearInterval(experiment_timer);
                    experiment_timer = null;
                    ng_experiment_dropject.status = 'stopped';
                }
            });

            options = { substances: [ self.substance.wood,
                                      self.substance.iron
                                    ],
                        shapes: [ self.shape.cube,
                                  self.shape.sphere
                                ],
                        fluids: [ self.substance.water,
                                  self.substance.oil
                                ]
                      };

            $scope.experiment = obj;
            $scope.options = options;

            $scope.$watch('experiment.substance.value', function() {
                $scope.experiment.update_substance();
            });
            $scope.$watch('experiment.mass.value', function() {
                $scope.experiment.update_mass();
            });
            $scope.$watch('experiment.volume.value', function() {
                $scope.experiment.update_volume();
            });
        });

        ng_experiment.directive('slider', function() {
            return {
                restrict: 'EA',
                link: function(scope, element, atts) {
                    var obj = atts.object;
                    var prop = atts.prop;
                    var model = scope[obj];

                    function slide(event, ui) {
                        var val = $(element).slider("option", "value");
                        if (prop === 'volume')
                            model.set_value(prop, val / 1000000);
                        else // 'mass'
                            model.set_value(prop, val / 1000);
                        scope.$apply();
                    }

                    $(element).slider({
                        min: (prop === 'volume' ? 100 : 250),
                        max: (prop === 'volume' ? 2000 : 2500),
                        value: model.get_value(prop) * (prop === 'volume' ? 1000000 : 1000),
                        slide: slide,
                        change: slide
                    });
                }
            }
        });

    }
    function translate(x) {
        return x;
    }


    /*------------------------------------------------------------
     *  View of a tank
     *------------------------------------------------------------*/

    self.view = {};

    self.view.Tank = function(obj, scale) {
        var fig = this;

        cute.Figure.call(this);

        fig._object = obj;
        fig._scale = scale || 100;

        fig.paint();

        return fig;
    }

    cute.extend(self.view.Tank, cute.Figure);

    self.view.Tank.prototype.paint = function() {
        var fig = this;
        var tank = fig._object;

        var x = 0;
        var y = 0;
        var w = tank.width.value * fig._scale;
        var h = tank.height.value * fig._scale;

        fig.display(new cute.Line(x, y, x, y+h));
        fig.display(new cute.Line(x, y+h, x+w, y+h));
        fig.display(new cute.Line(x+w, y+h, x+w, y));

        return fig;
    }

    self.view.Dropject = function(obj, scale) {
        var fig = this;

        cute.Figure.call(this);

        fig._object = obj;
        fig._scale = scale || 100;

        fig.paint();

        return fig;
    }

    cute.extend(self.view.Dropject, cute.Figure);

    self.view.Dropject.prototype.paint = function() {
        var fig = this;
        var obj = fig._object;

        if (obj.shape.value === Cube) {
            var a = obj.get_value('edge_length');
            var w = a * fig._scale;
            var box = new cute.Box(w, w).fill_pattern(new cute.Colour('grey'));

            fig.display(box, new cute.Point(0,0));
        }

        if (obj.shape.value === Sphere) {
            var r = obj.get_value('radius') * fig._scale;
            var circle = new cute.Circle(r).fill_pattern(new cute.Colour('grey'));

            fig.display(circle, new cute.Point(0,0));
        }

        return fig;
    };

    self.view.Dropject.prototype.h = function(h) {
        var fig = this;

        fig._h = h;
        fig._view.center(new cute.Point(fig._cx, -h * fig._scale / 2));
        fig.request_compute();

        return fig;
    }

    self.view.Fluid = function(fluid, w, h, scale) {
        var fig = this;

        cute.Figure.call(this);

        fig._fluid = fluid;
        fig._scale = scale || 100;
        fig._w = w;
        fig._h = h;

        var box = new cute.Box(w*scale, h*scale);
        box.fill_pattern(new cute.Colour('lightblue'));
        box.pen(0);
        fig.display(box, new cute.Point(0,0));
        fig._box = box;

        return fig;
    }

    cute.extend(self.view.Fluid, cute.Figure);

    self.view.Fluid.prototype.set_fluid_level = function(fl) {
        var fig = this;
        fig._box.geometry(undefined, fl * fig._scale);
        return fig;
    }

    self.view.Fluid.prototype.paint = function() {
        return fig;
    };

    self.view.TankSystem = function(atts) {
        var fig = this;

        cute.Figure.call(this);

        fig.scale = atts.scale || 100;
        fig.w = atts.width;
        fig.h = atts.height;
        fig.tank = atts.tank;
        fig.fluid = atts.fluid;
        fig.dropject = atts.dropject;
        fig.offset_x = atts.offset_x;
        fig.offset_y = atts.offset_y;
        fig.object_x = atts.object_x;
        fig.fluid_level = atts.fluid_level;
        fig.object_height = atts.object_height;

        return fig;
    }

    cute.extend(self.view.TankSystem, cute.Figure);

    self.view.TankSystem.prototype.compute = function() {
        var fig = this;
        var tank = fig.tank;
        var dropject = fig.dropject;
        var fluid = fig.fluid;
        var scale = fig.scale;
        var cy = fig.offset_y * scale;
        var fl = fig.fluid_level;
        var oh = fig.object_height * scale;

        var tank_x = (fig.w - tank.width()) / 2;
        var tank_y = (fig.h - tank.height() - cy);

        tank.position(new cute.Point(tank_x, tank_y));

        var fluid_x = tank_x;
        var fluid_y = (fig.h - fluid.height() - cy);

        fluid.position(new cute.Point(fluid_x, fluid_y));

        var obj_x = (fig.w - dropject.width()) / 2;
        var obj_y = (fluid_y - oh - dropject.height());

        dropject.position(new cute.Point(obj_x, obj_y));

        cute.Figure.prototype.request_compute();

        return fig;
    }

    self.view.TankSystem.prototype.set_fluid_level = function(fl) {
        var fig = this;

        if (fig.fluid_level !== fl) {
            fig.fluid.set_fluid_level(fl);
            fig.request_compute();
        }

        return fig;
    };

    self.view.TankSystem.prototype.set_object_height = function(h) {
        var fig = this;

        if (fig.object_height !== h) {
            fig.object_height = h;
            fig.request_compute();
        }

        return fig;
    };

    self.Box3d = function(atts, scale) {
        var box = this;

        cute.Figure.call(this);
        box.w = atts.w;
        box.h = atts.h;
        box.d = atts.d;

        return box;
    };

    cute.extend(self.Box3d, cute.Figure);

    self.Box3d.prototype.width = function(val) {
        this.w = val;
        this.request_compute();
        return this;
    }

    self.Box3d.prototype.height = function(val) {
        this.h = val;
        this.request_compute();
        return this;
    }

    self.Box3d.prototype.depth = function(val) {
        this.d = val;
        this.request_compute();
        return this;
    }


    self.Box3d.prototype.compute = function() {
        var box = this;
        var w = box.w;
        var h = box.h;
        var d = box.d;
        var dx = d / Math.sqrt(3);
        var dy = dx * 2/3;
        var top = h + dy;

        if (box.displayed()) {
            box.clear();
            box.display(new cute.Line(0, 0, w, 0));
            box.display(new cute.Line(0, 0, 0, h));
            box.display(new cute.Line(w, 0, w+dx, dy));
            box.display(new cute.Line(w+dx, dy, w+dx, dy+h));
            box.display(new cute.Line(w+dx, dy+h, dx, h+dy));
            box.display(new cute.Line(dx, h+dy, dx, dy));
            box.display(new cute.Line(dx, dy, 0, 0));
            box.display(new cute.Line(dx, dy, w+dx, dy));
            box.display(new cute.Line(0, h, dx, h+dy));

            cute.Figure.prototype.compute.call(this);
        }

        return this;
    }

    //  y_fluid = top of the fluid
    //  y_object = bottom of the object
    //  Returns the volume displaced
    function displaced(y_fluid, y_object, shape, dims) {
        var h;

        if (y_fluid < y_object - r) {
            return 0;
        }

        if (shape === 'sphere') {
            var r = dims.radius;

            if (y_fluid > y_object + r)
                return 4/3 * Math.PI * r*r*r;
            h = r - y_object + y_fluid;

            return ((h*h * Math.PI)/3) * (3*r - h);
        }

        if (shape === 'cube') {
            var a = dims.edge_length;

            if (y_fluid > y_object + a)
                return a * a * a;
            h = a - y_object + y_fluid;
            return a * a * h;
        }
    }

    self.TankSystem = function(tank, obj, fluid) {
        var ts = this;

        ts.tank = tank;
        ts.object = obj;
        ts.fluid = fluid;
        ts.fluid_substance = fluid.substance;
        ts.fluid_volume = fluid.volume;
        ts.fluid_density = ts.fluid.substance.density;
        ts.object_density = obj.density;
        ts.object_mass = obj.mass;
        ts.object_volume = obj.volume;
        ts.object_shape = obj.shape;
        ts.object_reference_area = obj.reference_area(0);
        ts.object_drag_coefficient = obj.drag_coefficient();
    }

    self.TankSystem.prototype.pp = function() {
        var tank = this.tank;
        var object = this.object;
        var fluid = this.fluid;

        printf('');
        printf('----------');
        printf('TankSystem');
        printf('  tank ' +
               tank.width.value.toFixed(2) + ' ' +
               tank.depth.value.toFixed(2) + ' ' +
               tank.height.value.toFixed(2));
        printf('  fluid ' +
               fluid.volume.value.toFixed(2) + ' ' +
               fluid.substance.value);
        printf('  object ' +
               object.mass.value.toFixed(2) + ' ' +
               object.volume.value.toFixed(2) + ' ' +
               object.shape.value + ' ' +
               object.substance.value);
        printf('  object immersed volume ' +
               fluid.immersed(object).toFixed(4));
        printf('  fluid leval (w/o object) ' +
               tank.fluid_level(fluid.get_value('volume')).toFixed(2));
        printf('  fluid leval (w object) ' +
               tank.fluid_level(fluid.get_value('volume')+fluid.immersed(object)).toFixed(2));
        printf('----------');
    }

    //  Drop object from height above fluid
    self.TankSystem.prototype.drop = function(h, scope) {
        var ts = this;
        var object = ts.object;
        var fluid = ts.fluid;
        var tank = ts.tank;
        var mass = object.mass.value;

        var distance = [];
        var acceleration = [];
        var velocity = [];
        var net_force = [];
        var drag_force = [];
        var buoyancy_force = [];

        var scale = 200;
        var canvas = new cute.Canvas("canvas_splash_lab");
        var fl = tank.fluid_level(fluid.get_value('volume')+ object.displacement(h));
        var vTank = new self.view.Tank(tank, scale);
        var vDropject = new self.view.Dropject(object, scale);
        var vFluid = new self.view.Fluid(fluid,
                                         tank.get_value('width'),
                                         fl,
                                         scale);
        var lab = new self.view.TankSystem({ width: canvas.width(),
                                             height: canvas.height(),
                                             tank: vTank,
                                             dropject: vDropject,
                                             fluid: vFluid,
                                             scale: scale,
                                             offset_y: 0.05,
                                             object_x: 1.2,
                                             fluid_level: fl,
                                             object_height: h
                                           });

        lab.display(vFluid);
        lab.display(vTank);
        lab.display(vDropject);

        canvas.display(lab, new cute.Point(0,0));

        var dt = 1/250;
//      var damping = 0.99 * 0.01 / dt;
        var damping = 1 - dt;
        var v = 0;
        var t = 0;
        var secs = 10;
        var plot_update = 0;
        var refresh_rate = 1/25;

        object.dt = dt;
        object.width = (object.shape.value === Sphere ?
                        object.get_value('radius') * 2:
                        object.get_value('edge_length'));
        object.time = 0.01;
        object.status = 'running';

        var displaced;
        var F_g;
        var F_b;
        var F_d;
        var a;

        var date = new Date();

        experiment_timer = setInterval(function() { update(object); }, refresh_rate * 1000);

        function euler(obj, runs) {
            var i;

            for (i=0; i<runs; i++) {
                displaced = obj.displacement(h);
                F_g = obj.force_gravitation();

                if (displaced !== 0) {
                    F_b = obj.force_buoyancy(fluid, displaced);
                    F_d = obj.force_drag(fluid, v, h);
                    F_d = (v > 0 ? -F_d : F_d);
                } else
                    F_b = F_d = 0;

                F_net = F_g - F_b + F_d;
                a = F_net / mass;

                h -= v*dt + 1/2 * a * dt*dt;
                v = (v + a * dt) * damping;
                t += dt;
            }
        }

        function update(obj) {
            euler(obj, refresh_rate/dt);
            fl = tank.fluid_level(fluid.get_value('volume')+displaced);
            lab.set_fluid_level(fl);
            lab.set_object_height(h);
            lab.request_compute();
            canvas.render();

            distance.push([t, h]);
            acceleration.push([t, a]);
            velocity.push([t, v]);
            net_force.push([t, F_net]);
            drag_force.push([t, F_d]);
            buoyancy_force.push([t, F_b]);

            obj.time = t;
            scope.$apply();
//          printf(JSON.stringify(obj, 4, null));
            if (t > secs || Math.abs(h)+obj.width/2 > fl) {
                clearInterval(experiment_timer);
                obj.status = 'finished';
                experiment_timer = null;
            }

            plot_update += refresh_rate;

            if (plot_update > 0.2) {
                plot_update = 0;
                var options = {
                    xaxis: {
                        min: 0,
                        max: secs
                    },
                    series: {
                        lines: { show: true }
                    }
                };

                $.plot("#graph_splash_distance", [distance], options);
                $.plot("#graph_splash_velocity", [velocity], options);
                $.plot("#graph_splash_acceleration", [acceleration], options);
                $.plot("#graph_splash_net_force", [net_force], options);
                $.plot("#graph_splash_drag_force", [drag_force], options);
                $.plot("#graph_splash_buoyancy_force", [buoyancy_force], options);
            }
        }

/*      return { distance: distance,
                 acceleration: acceleration,
                 velocity: velocity,
                 net_force: net_force,
                 drag_force: drag_force,
                 buoyancy_force: buoyancy_force
               };
*/
    }

    self.start = function() {
        function hide_tabs() {
            $(".tab_splash").hide();
        }

        $("#nav_splash_define_tank").click(function() {
            hide_tabs();
            $("#tab_splash_define_tank").show();
        });
        $("#nav_splash_define_fluid").click(function() {
            hide_tabs();
            $("#tab_splash_define_fluid").show();
        });
        $("#nav_splash_define_dropject").click(function() {
            hide_tabs();
            $("#tab_splash_define_dropject").show();
        });
        $("#nav_splash_run_lab").click(function() {
            hide_tabs();
            $("#tab_splash_run_lab").show();
        });

//      experiment();

/*        var data = experiment();
        var options = {
            xaxis: {
                min: 0,
            },
            series: { 
                lines: { show: true }
            }   
        };

        $.plot("#graph_splash_distance", [data.distance], options);
        $.plot("#graph_splash_velocity", [data.velocity], options);
        $.plot("#graph_splash_acceleration", [data.acceleration], options);
        $.plot("#graph_splash_net_force", [data.net_force], options);
        $.plot("#graph_splash_drag_force", [data.drag_force], options);
        $.plot("#graph_splash_buoyancy_force", [data.buoyancy_force], options);
*/ };

    return self;
})();


function experiment(obj0, scope) {
   var Property = a3.Property;
   var Cube = splash.shape.cube;
   var Sphere = splash.shape.sphere;
   var Wood = splash.substance.wood;
   var Iron = splash.substance.iron;
   var Water = splash.substance.water;
   var Tank = splash.Tank;
   var Dropject = splash.Dropject;
   var Fluid = splash.Fluid;

   var tank = new Tank(
       { width: 0.24,
         height: 0.95,
         depth: 0.24
       });

   var obj = obj0 || new Dropject({
       name: 'wooden sphere',
       shape: Sphere,
       substance: Wood,
       radius: new Property({
           name: 'radius',
           value: 0.05,
           unit: 'm'
       }),
       edge_length: new Property({
           name: 'edge_length',
           value: 0.125,
           unit: 'm'})
   });

   var fluid = new Fluid({
       name: 'water',
       substance: Water,
       volume: 0.04
   });

    obj.set_value('radius', null);
    obj.set_value('edge_length', null);

    var ts = new splash.TankSystem(tank, obj, fluid);

/*
    printf('**** EXPERIMENT ****');
    printf('  volume  = ' + obj.get_value('volume'));
    printf('  mass    = ' + obj.get_value('mass'));
    printf('  radius  = ' + obj.get_value('radius'));
    printf('  density = ' + obj.get_value('density'));
    printf('  edge    = ' + obj.get_value('edge_length'));
*/
    return ts.drop(0.0, scope);
}
