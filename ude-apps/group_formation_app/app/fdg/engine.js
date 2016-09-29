function VisualizationEngine(framework) {
    var edgedistance = 100;
    var force = 200;
    var pausedlayout = false;

    this.start = function (data) {
        draw(data);
        //highlightNodeMeasure();

        if (pausedlayout)
            toggleLayoutMovement();
    };

    this.startOnlyConcepts = function (data, actionLogger, metadataHandler) {
        drawOnlyConcepts(data, actionLogger, metadataHandler);
        //highlightNodeMeasure();

        if (pausedlayout)
            toggleLayoutMovement();
    };

    function toggleLayoutMovement() {
        d3.selectAll(framework.requestNodeNotation()).each(function (d) {
            d.fixed = pausedlayout;
        });
    }

    function displayLayoutOptions() {
        var customoptions = d3.select('#customoptions');
        customoptions.append('p').text('Dwyer Force Directed Graph');
        customoptions.append('hr')
        customoptions.append('p').text('Label Size')
        customoptions.append('input').attr('id', 'lsize').attr('type', 'text').property('value', framework.requestLabelSize()).style('text-align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                redraw();
            }
        });
        customoptions.append('p').text('Node Size')
        customoptions.append('input').attr('id', 'nsize').attr('type', 'text').property('value', framework.requestNodeSize()).style('text-align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                redraw();
            }
        });
        customoptions.append('p').text('Edge Size')
        customoptions.append('input').attr('id', 'esize').attr('type', 'text').property('value', framework.requestEdgeSize()).style('text-align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                redraw();
            }
        });
        customoptions.append('p').text('Layout Repulsive Force')
        customoptions.append('input').attr('id', 'force').attr('type', 'text').property('value', force).style('text-align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                redraw()
            }
        });
        customoptions.append('p').text('').text('Edge Distance')
        customoptions.append('input').attr('id', 'edgedistance').attr('type', 'text').property('value', edgedistance).style('text-align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                redraw()
            }
        });
        ;
        customoptions.append('p').text('Layout Movement')
        customoptions.append('input').attr('id', 'pauselayout').attr('type', 'button').attr('value', function () {
            return (!pausedlayout) ? 'Pause' : 'Resume';
        }).on('click', function () {
            (!pausedlayout) ? d3.select(this).property('value', 'Resume') : d3.select(this).property('value', 'Pause');
            pausedlayout = !pausedlayout;
            toggleLayoutMovement();

        });
        customoptions.append('hr')
        customoptions.append('input').attr('id', 'updatelayout').attr('type', 'button').attr('value', 'Update Layout').on('click', function () {
            redraw();
        });
    };

    function updateLayoutOptions() {
        var input = d3.select('#nsize').property('value')
        if (framework.requestNumberValidation(input)) {
            framework.requestNodeSizeUpdate(input);
        }
        input = d3.select('#esize').property('value')
        if (framework.requestNumberValidation(input)) {
            framework.requestEdgeSizeUpdate(input);
        }
        input = d3.select('#lsize').property('value')
        if (framework.requestNumberValidation(input)) {
            framework.requestLabelSizeUpdate(input);
        }
        input = d3.select('#edgedistance').property('value');
        if (framework.requestNumberValidation(input)) {
            edgedistance = input;
        }
        input = d3.select('#force').property('value');
        if (framework.requestNumberValidation(input)) {
            force = input;
        }
    };

    function redraw() {
        updateLayoutOptions();
        framework.requestUpdate();
        draw();
        if (pausedlayout)
            toggleLayoutMovement();
    };

    function draw(data) {

        var canvas = framework.requestCanvas();

        var data2 =
            framework.requestNodeSet();

        var width = window.innerWidth;
        var height = window.innerHeight;


        var fill = d3.scale.category10();

        var nodes = [], labels = [],
            foci = orderInCircle(data.length);

        function orderInCircle(elements) {
            var arr = [];
            var winkel = 2 * Math.PI / elements;
            for (var i = 0; i < elements; i++) {
                var x = 300 * Math.sin(winkel * i) + width / 2;
                var y = 300 * Math.cos(winkel * i) + height / 2;
                arr.push({
                    x: x,
                    y: y
                });
            }
            return arr;
        }

        var svg = canvas.append("svg")
            .attr("width", "100%")
            .attr("height", "200%")
//.attr("domflag", '');

        var force = d3.layout.force()
            .nodes(nodes)
            .links([])
            .charge(-400)
            //.chargeDistance(200)
            .gravity(0.1)
            .friction(0.8)
            .size([width, height])
            .on("tick", tick);

//var node = svg.selectAll("circle");
        var node = svg.selectAll("g");

        var counter = 0;
        var counter2 = 0;

        function tick(e) {
            var k = .1 * e.alpha;

            // Push nodes toward their designated focus.
            nodes.forEach(function (o, i) {
                if (!o.student) {
                    if (o.id.length > 1) {
                        var x = 0;
                        var y = 0;
                        o.id.forEach(function (item) {
                            x += foci[item].x;
                            y += foci[item].y;
                        });
                        x = x / o.id.length;
                        y = y / o.id.length;
                        o.y += (y - o.y) * k;
                        o.x += (x - o.x) * k;
                    } else {
                        o.y += (foci[o.id[0]].y - o.y) * k;
                        o.x += (foci[o.id[0]].x - o.x) * k;
                    }
                } else {
                    foci[o.id].x = o.x;
                    foci[o.id].y = o.y;
                }
            });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }


        var timer = setInterval(function () {

            if (counter > data.length - 1) {
                clearInterval(timer);
                return;
            }

            var item = data[counter];
            nodes.push({id: item.id, r: item.r, name: item.name, student: true});
            force.start();

            node = node.data(nodes);

            var n = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .attr("id", item.id)
                .style('cursor', 'pointer')
                .on('mousedown', function () {
                    d3.event.stopPropagation();
                    var sel = d3.select(this);
                    sel.moveToFront();
                })
                .call(force.drag);

            n.append("circle")
                .attr("r", function (d) {
                    return d.r;
                })
                .style("fill", function (d) {
                    return fill(d.id);
                })

            n.append("text")
                .text(function (d) {
                    return d.name;
                })
                .style("font-size", function (d) {
                    console.log('test')
                    console.log(Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px")
                    return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px";
                })
                .attr("dy", ".35em")
                .attr("id", "circle")

            counter++;
        }, 200);


        var timer2 = setInterval(function () {

            if (counter2 > data2.length - 1) {
                clearInterval(timer2);
                return;
            }

            var item = data2[counter2];
            item.names = [];
            for (var subI = 0; subI < item.id.length; subI++) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name === item.id_b[subI]) {
                        item.id[subI] = data[i].id;
                        item.names.push(data[i].name);
                    }
                    ;
                }
            }

            nodes.push({id: item.id, r: item.r, name: item.name, students: item.names});
            force.start();

            node = node.data(nodes);

            var n = node.enter().append("g")
                .attr("class", "node")
                .classed('gnode', true)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .style('cursor', 'pointer')
                .on('mousedown', function () {
                    d3.event.stopPropagation();
                    var sel = d3.select(this);
                    sel.moveToFront();
                })
                .on("mouseover", function (d) {
                    text.classed('big', true);
                })
                .on("mouseout", function (d) {
                    text.classed('big', false)
                })
                .call(force.drag);

            n.append("circle")
                .attr("r", function (d) {
                    return d.r
                })
                .attr("class", function (d) {
                    return 'no-student'
                })
                .style("fill", function (d) {
                    if (d.id.length > 1) {
                        var r = 0;
                        var g = 0;
                        var b = 0;
                        d.id.forEach(function (item) {
                            var rgb = hexToRgb(fill(item));
                            r += rgb.r;
                            g += rgb.g;
                            b += rgb.b;
                        });
                        var rv = rgbToHex(r, g, b);
                        return rv;
                    } else {
                        return fill(d.id[0]);
                    }
                });

            var text = n.append("text")
                .classed('black', true)
                .text(function (d) {
                    return d.name;
                });


            $('svg circle.no-student').tipsy({
                gravity: 'n',
                html: true,
                title: function () {
                    var d = this.__data__,
                        s = "";
                    for (i in d.students) {
                        s += d.students[i] + '<br/>';
                    }
                    return 'Students:<br/>' + s;
                }
            });


            counter2++;
        }, 5);


        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };

        function resize() {
            width = window.innerWidth;
            force.size([width, height]);
            force.start();
        }


        d3.select(window).on('resize', resize);


        //define the node drag event
        function dragstart(d, i) {
            // stops the force auto positioning before you start dragging
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed('dragging', true);
            fdg.stop()
        };

        function dragmove(d) {
            // this is the key to make it work together with updating both px,py,x,y on d !
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            updateLayout();
        };

        function dragend(d) {
            // the force doesn't include the node in its auto positioning stuff
            d3.select(this).classed('dragging', true);
            d.fixed = true;
            updateLayout();
            fdg.resume();
        };

        //the update layout function
        function updateLayout() {
            /*       edgeset.attr('x1', function(d) { return d.source.x; })
             .attr('y1', function(d) { return d.source.y; })
             .attr('x2', function(d) { return d.target.x; })
             .attr('y2', function(d) { return d.target.y; });*/

            /*     nodeset.attr('transform', function(node) {
             return 'translate(' + node.x + ',' + node.y + ')';
             }); */

            /*    labels.attr('transform', function(label) {
             return 'translate(' + label.x + ',' + label.y + ')';
             });*/
        };

        var drag = d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on('dragstart', dragstart)
            .on('drag', dragmove)
            .on('dragend', dragend);

        //define the force directed layout
        var fdg = d3.layout.force()
            .nodes(framework.requestNodeSet())
            //            .links(framework.requestEdgeSet())
            .size([framework.requestCanvasWidth(), framework.requestCanvasHeight()])
            .charge(function () {
                return (-1 * force);
            })
            .linkDistance(function () {
                return edgedistance
            })
            .on('tick', updateLayout)
            .start();

        canvas.append('svg:defs').selectAll("marker")
            .data(["arrow"])
            .enter().append('svg:marker')
            .attr('id', 'endMarker')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        //define how to paint the edges
        /*        var edgeset = canvas.selectAll(framework.requestEdgeNotation())
         .data(fdg.links())
         .enter().append("svg:line")
         .attr("id", function (d) { return  framework.requestEdgeClassNotation()+d.id; } )
         .attr("class", function(){return framework.requestEdgeClassNotation()})
         .attr("stroke", function(d){return framework.requestEdgeColor(d)})
         .attr('opacity',function(edge){return framework.requestEdgeAlpha(edge)})
         .attr("stroke-width", function(edge){return framework.requestEdgeSize(edge)} )
         .attr("marker-end", function() {
         if(framework.requestNetworkDirection()=='true')
         return "url(#endMarker)";
         });

         //define the labels
         var labels = canvas.selectAll(framework.requestLabelNotation())
         .data(fdg.nodes())
         .enter().append("svg:text")
         .attr("id", function (d) { return framework.requestLabelClassNotation()+d.id; } )
         .attr("class",function(){return framework.requestLabelClassNotation()})
         .attr("x", 0)
         .attr("y", -10)
         .attr('opacity',function(label){return framework.requestLabelAlpha(label)})
         .attr("font-size",framework.requestLabelSize())
         .attr("text-anchor","middle")
         .text(function(d) { return d.label; });*/

        //define how to paint the nodes
        /*    var nodeset = canvas.selectAll(framework.requestNodeNotation())
         .data(fdg.nodes())
         .enter().append("svg:path")
         .attr("id", function (d) { return framework.requestNodeClassNotation()+d.id; } )
         .attr("class", function(){return framework.requestNodeClassNotation()})
         .attr("d", d3.svg.symbol()
         .size(function(d) { return framework.requestNodeSize(d);})
         .type(function(d) { return framework.requestNodeSymbol(d)}))
         .attr("fill",function(d){return framework.requestNodeColor(d);})
         .attr('opacity',function(node){return framework.requestNodeAlpha(node)})
         .attr("stroke", "black")
         .attr("stroke-width", "0.5")
         .on('click',function(node){framework.requestScopeSearch(node)})
         .on('mouseover',function(node){framework.requestNodeInformation(node)})
         .on('mouseout',function(node){framework.requestNodeInformationRemoval(node)})
         .call(drag);*/
    };


    function drawOnlyConcepts(data, actionLogger, metadataHandler) {
        //request the canvas
        var canvas = framework.requestCanvas();


        var data2 =
            framework.requestNodeSet();
        /*[
         {"id": 0, "name": "Concept", "r": 5 },

         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 0, "name": "Concept", "r": 5 },


         {"id": 1, "name": "Concept", "r": 5 },


         {"id": 1, "name": "Concept", "r": 5 },

         {"id": 1, "name": "Concept", "r": 5 },

         {"id": 1, "name": "Concept", "r": 5 },

         {"id": [0,1], "name": "Concept", "r": 5 },

         {"id": [0,1], "name": "Concept", "r": 5 },

         {"id": [0,1], "name": "Concept", "r": 5 },

         {"id": [0,1], "name": "Concept", "r": 5 },


         ]*/

        var width = window.innerWidth;
        var height = window.innerHeight;


        var fill = d3.scale.category10();

        var nodes = [], labels = [],
            foci = orderInCircle(1);

        function orderInCircle(elements) {
            var arr = [];
            var winkel = 2 * Math.PI / elements;
            for (var i = 0; i < elements; i++) {
                var x = 200 * Math.sin(winkel * i) + width / 2;
                var y = 200 * Math.cos(winkel * i) + height / 2;
                arr.push({
                    x: x,
                    y: y
                });
            }
            return arr;
        }

        var svg = canvas.append("svg")
            .attr("width", "100%")
            .attr("height", "250%")
//.attr("domflag", '');

        var force = d3.layout.force()
            .nodes(nodes)
            .links([])
            .charge(-400)
            //.chargeDistance(200)
            .gravity(0.1)
            .friction(0.8)
            .size([width, height])
            .on("tick", tick);

//var node = svg.selectAll("circle");
        var node = svg.selectAll("g");

        var counter = 0;
        var counter2 = 0;

        function tick(e) {
            var k = .1 * e.alpha;

            // Push nodes toward their designated focus.
            nodes.forEach(function (o, i) {
                o.y += (foci[o.id % foci.length].y - o.y) * k;
                o.x += (foci[o.id % foci.length].x - o.x) * k;
            });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }


        var timer2 = setInterval(function () {

            if (counter2 > data2.length - 1) {
                clearInterval(timer2);
                return;
            }

            var item = data2[counter2];

            nodes.push({id: item.id.length, r: item.r, name: item.name});
            force.start();

            node = node.data(nodes);


            var mergeMode = d3.select('input#checkboxForMerge');

            var n = node.enter().append("g")
                .attr("class", "node")
                .classed('gnode', true)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .style('cursor', 'pointer')
                .on('mousedown', function () {
                    d3.event.stopPropagation();
                    var sel = d3.select(this);
                    sel.moveToFront();
                })
                .on("mouseover", function (d) {
                    text.classed('big', true)
                })
                .on("mouseout", function (d) {
                    text.classed('big', false)
                })
                .on("click", function (d) {
                    if (!mergeMode.property('checked')) {

                    } else {
                        var sel = d3.select(this);
                        if (!window.tempNode) {
                            var text_ = sel.select('text');
                            text_.classed("chosen", true);
                            window.tempNode = sel;
                        } else {
                            var tempNodeText = window.tempNode.select('text');
                            var selText = sel.select('text');
                            if (tempNodeText.html() === selText.html()) {
                                console.log('same Node, remove Selection');
                                selText.classed("chosen", false);
                                window.tempNode = null;
                            } else {
                                console.log('same Node, add Node to New Node');
                                tempNodeCircle = window.tempNode.select('circle');
                                var temp_r = parseInt(tempNodeCircle.attr('r'));
                                d.r += temp_r;
                                d.id += (temp_r / 5);
                                var selCircle = sel.select('circle');
                                selCircle.attr("r", d.r)
                                    .style("fill", function (d) {
                                        return fill(d.id);
                                    });
                                var s = '<tr><td>' + tempNodeText.html() + '</td><td>' + selText.html() + '</td></tr>'
                                $('#modalTable').append(s);
                                window.tempNode.remove();
                                window.tempNode = null;

                                // weil tabelle parsen blöd ist
                                var first = false;
                                if (!window.ConceptStorage) {

                                    window.ConceptStorage = [];

                                    first = true;

                                    window.ConceptStorage.push({
                                        bad: tempNodeText.html(),
                                        good: selText.html()
                                    });
                                } else {
                                    window.ConceptStorage.push({
                                        bad: tempNodeText.html(),
                                        good: selText.html()
                                    });
                                }
                                if (first) {
                                    actionLogger.logSaveAs({
                                        content: window.ConceptStorage,
                                        metadata: metadataHandler.getMetadata()
                                    });
                                } else {
                                    actionLogger.logSave({
                                        content: window.ConceptStorage,
                                        metadata: metadataHandler.getMetadata()
                                    });
                                }


                            }
                        }
                    }
                })
                .call(force.drag);

            n.append("circle")
                .attr("r", function (d) {
                    return d.r
                })
                .style("fill", function (d) {
                    return fill(d.id);
                });

            var text = n.append("text")
                .classed('black', true)
                .text(function (d) {
                    return d.name;
                });

            counter2++;
        }, 50);


        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };

        function resize() {
            width = window.innerWidth;
            force.size([width, height]);
            force.start();
        }


        d3.select(window).on('resize', resize);


        //define the node drag event
        function dragstart(d, i) {
            // stops the force auto positioning before you start dragging
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed('dragging', true);
            fdg.stop()
        };

        function dragmove(d) {
            // this is the key to make it work together with updating both px,py,x,y on d !
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            updateLayout();
        };

        function dragend(d) {
            // the force doesn't include the node in its auto positioning stuff
            d3.select(this).classed('dragging', true);
            d.fixed = true;
            updateLayout();
            fdg.resume();
        };

        //the update layout function
        function updateLayout() {
            /*       edgeset.attr('x1', function(d) { return d.source.x; })
             .attr('y1', function(d) { return d.source.y; })
             .attr('x2', function(d) { return d.target.x; })
             .attr('y2', function(d) { return d.target.y; });*/

            /*     nodeset.attr('transform', function(node) {
             return 'translate(' + node.x + ',' + node.y + ')';
             }); */

            /*    labels.attr('transform', function(label) {
             return 'translate(' + label.x + ',' + label.y + ')';
             });*/
        };

        var drag = d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on('dragstart', dragstart)
            .on('drag', dragmove)
            .on('dragend', dragend);

        //define the force directed layout
        var fdg = d3.layout.force()
            .nodes(framework.requestNodeSet())
            //            .links(framework.requestEdgeSet())
            .size([framework.requestCanvasWidth(), framework.requestCanvasHeight()])
            .charge(function () {
                return (-1 * force);
            })
            .linkDistance(function () {
                return edgedistance
            })
            .on('tick', updateLayout)
            .start();

        canvas.append('svg:defs').selectAll("marker")
            .data(["arrow"])
            .enter().append('svg:marker')
            .attr('id', 'endMarker')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        //define how to paint the edges
        /*        var edgeset = canvas.selectAll(framework.requestEdgeNotation())
         .data(fdg.links())
         .enter().append("svg:line")
         .attr("id", function (d) { return  framework.requestEdgeClassNotation()+d.id; } )
         .attr("class", function(){return framework.requestEdgeClassNotation()})
         .attr("stroke", function(d){return framework.requestEdgeColor(d)})
         .attr('opacity',function(edge){return framework.requestEdgeAlpha(edge)})
         .attr("stroke-width", function(edge){return framework.requestEdgeSize(edge)} )
         .attr("marker-end", function() {
         if(framework.requestNetworkDirection()=='true')
         return "url(#endMarker)";
         });

         //define the labels
         var labels = canvas.selectAll(framework.requestLabelNotation())
         .data(fdg.nodes())
         .enter().append("svg:text")
         .attr("id", function (d) { return framework.requestLabelClassNotation()+d.id; } )
         .attr("class",function(){return framework.requestLabelClassNotation()})
         .attr("x", 0)
         .attr("y", -10)
         .attr('opacity',function(label){return framework.requestLabelAlpha(label)})
         .attr("font-size",framework.requestLabelSize())
         .attr("text-anchor","middle")
         .text(function(d) { return d.label; });*/

        //define how to paint the nodes
        /*    var nodeset = canvas.selectAll(framework.requestNodeNotation())
         .data(fdg.nodes())
         .enter().append("svg:path")
         .attr("id", function (d) { return framework.requestNodeClassNotation()+d.id; } )
         .attr("class", function(){return framework.requestNodeClassNotation()})
         .attr("d", d3.svg.symbol()
         .size(function(d) { return framework.requestNodeSize(d);})
         .type(function(d) { return framework.requestNodeSymbol(d)}))
         .attr("fill",function(d){return framework.requestNodeColor(d);})
         .attr('opacity',function(node){return framework.requestNodeAlpha(node)})
         .attr("stroke", "black")
         .attr("stroke-width", "0.5")
         .on('click',function(node){framework.requestScopeSearch(node)})
         .on('mouseover',function(node){framework.requestNodeInformation(node)})
         .on('mouseout',function(node){framework.requestNodeInformationRemoval(node)})
         .call(drag);*/
    };

}