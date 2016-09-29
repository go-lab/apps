(function(cmDashboard) {
    cmDashboard.Graph = Graph;

    var inputData = {};
    var userInfo = {};
    var hierarchicalView = false;
    var nameArray1 = [];
    var nameArray = [];

    // padding between circles
    var padding = 20;
    var radius = 20;

    var width = 1020;
    var height = 700;

    var counter = 0

    var popUpActive = true;
    var edgeLabelsActive = false;


    function Graph() {

        return {
            visualizeGraph : visualizeGraph,
            toggleEdges : toggleEdges,
            toggleEdgeLabels : toggleEdgeLabels,
            toggleArrowHeads : toggleArrowHeads,
            toggleHierarchicalView : toggleHierarchicalView,
            togglePopUps : togglePopUps,
            resetView : resetView
        };

        function togglePopUps(callback) {
            popUpActive ? popUpActive = false : popUpActive = true;
            callback(popUpActive);
        }

        function toggleEdges(callback) {
            var edges = d3.select('.MapSvgMain').selectAll('.link');
            var edgeLabels = d3.select('.MapSvgMain').selectAll('.gText');

            if(edges.classed("hidden")) {
                edges.classed("hidden", false);
                // if edgeLabels are active: show them!
                if(edgeLabelsActive){
                    edgeLabels.classed("hidden", false);
                }
            } else {
                edges.classed("hidden", true);
                // if edgeLabels are active: hide them!
                if(edgeLabelsActive) {
                    edgeLabels.classed("hidden", true);
                }
            }

            if (userInfo !== undefined) {
                buildNameArray(userInfo);
            }

            callback(!edges.classed("hidden"));
        }

        function toggleEdgeLabels(callback) {
            var edgeLabels = d3.select('.MapSvgMain').selectAll('.gText');
            edgeLabels.classed("hidden") ? edgeLabels.classed("hidden", false) : edgeLabels.classed("hidden", true);
            edgeLabels.classed("hidden") ? edgeLabelsActive = false : edgeLabelsActive  = true;
           
            if (userInfo !== undefined) {
                buildNameArray(userInfo);
            }
            callback(!edgeLabels.classed("hidden"));
        }

        function toggleArrowHeads(callback) {
            var edges = d3.selectAll(".link");
            edges.attr("marker-end") ? edges.attr("marker-end", null) : edges.attr("marker-end", "url(#arrowGray)");
            if (userInfo !== undefined) {
                buildNameArray(userInfo);
            }
            callback(edges.attr("marker-end"));
        }

        function toggleHierarchicalView(callback) {

            hierarchicalView === true ? hierarchicalView = false : hierarchicalView = true;
            visualizeGraph(inputData, hierarchicalView);
            callback(hierarchicalView);
        }

        function resetView() {
            // TODO: Reset Labels!
            var edges = d3.select('.MapSvgMain').selectAll('.link');
            var edgeLabels = d3.select('.MapSvgMain').selectAll('.gText');

            if (edges.classed("hidden")) { edges.classed("hidden", false); }
            if (!edges.attr("marker-end")) { edges.attr("marker-end", "url(#arrowGray)")};
            if (!edgeLabels.classed("hidden")) { edgeLabels.classed("hidden", true); }

            if (userInfo !== undefined) {
                buildNameArray(userInfo);
            }

        }

        function buildNameArray(userInfo) {
            nameArray1 = [];
            for (var k in userInfo) {
                var userInfoNew = userInfo[k];
                var name = userInfoNew.name;
                nameArray1.push(name);
            }
        }


        function visualizeGraph(data, hierarchical) {

            $('.MapSvgMain').html('');

            inputData = data;
            userInfo = data.data.userInfo;
            nameArray1 = [];
            nameArray = [];

            if (userInfo !== undefined) {
                nameArray1 = [];
                for (var k in userInfo) {
                    var userInfoNew = userInfo[k];
                    var name = userInfoNew.name;
                    $('.tableBodyListNamesHigh').append('<tr><td><input type="checkbox" name="cbxH" value="' + name + '"  id="' + name + '" /></td><td><strong><label for="' + name + '">' + name + '</label></strong></td></tr>');
                    $('.tableBodyListNamesFilter').append('<tr><td><input type="checkbox" autocomplete="on" checked="checked" name="cbxF" value="' + name + '" id="f_' + name + '" /></td><td><strong><label for="f_' + name + '">' + name + '</label></strong></td></tr>');

                    nameArray1.push(name); //fill array with names to highlight
                }
            }


            var styles = {
                node: {
                    fill: function (d) {
                        return ChangeColor(d.oc);
                    }
                }
            };

            var styles2 = {
                node: {
                    fill: "#ff7f0e"
                }
            };

            /***** Filter function*****/
            $('input[name=cbxF]').on('change', function () {
                var currentValF = $(this).val();

                if ($(this).is(':checked')) {
                    if (nameArray1.indexOf(currentValF) === -1) {
                        nameArray1.push(currentValF);
                    }

                    for (var naF in nameArray1) {
                        var namesCheckedFilter = nameArray1[naF];
                        var nodesF = $('.gnode[name*=' + namesCheckedFilter + ']');
                        var cirCF = $('.gnodeC[name*=' + namesCheckedFilter + ']');
                        var linksF = $('.glink[name*=' + namesCheckedFilter + '][data*=' + namesCheckedFilter + ']');
                        var linksTextF = $('.glinkText[name*=' + namesCheckedFilter + '][data*=' + namesCheckedFilter + ']');
                        var nodesSelectF = $('.node[name*=' + currentValF + ']');
                        var allNodes = $('.node');
                        d3.selectAll(allNodes).data(nodes).transition().duration(750).attr('r', function(d){return d.oc*10});
                        d3.selectAll(nodesF).transition().duration(750).style("opacity", 1);
                        d3.selectAll(linksF).transition().duration(750).style("opacity", 1);
                        d3.selectAll(cirCF).transition().duration(750).style("opacity", 1);
                        d3.selectAll(linksTextF).transition().duration(750).style("opacity", 1);
                    }

                } else if ($(this).not(':checked')) {
                    d3.selectAll('.gnode').transition().duration(750).style("opacity", 0);
                    d3.selectAll('.gnodeC').transition().duration(750).style("opacity", 0);
                    d3.selectAll('.glink').transition().duration(700).style("opacity", 0);
                    d3.selectAll('.glinkText').transition().duration(700).style("opacity", 0);
                    var indexF = nameArray1.indexOf(currentValF);
                    nameArray1.splice(indexF, 1);

                    var nodesSelect = $('.node[name*=' + currentValF + ']');
                    d3.selectAll(nodesSelect).data(nodes).transition().duration(750).attr("r",10);

                    for (var namArF in nameArray1) {
                        var namesUnCheckedFilter = nameArray1[namArF];

                        var nodesFun = $('.gnode[name*=' + namesUnCheckedFilter + ']');
                        var cirCFun = $('.gnodeC[name*=' + namesUnCheckedFilter + ']');
                        var linksFun = $('.glink[name*=' + namesUnCheckedFilter + '][data*=' + namesUnCheckedFilter + ']');
                        var linksTextFun = $('.glinkText[name*=' + namesUnCheckedFilter + '][data*=' + namesUnCheckedFilter + ']');

                        d3.selectAll(nodesFun).transition().duration(750).style("opacity", 1);
                        d3.selectAll(cirCFun).transition().duration(750).style("opacity", 1);
                        d3.selectAll(linksFun).transition().duration(750).style("opacity", 1);
                        d3.selectAll(linksTextFun).transition().duration(750).style("opacity", 1);
                    }
                } else {
                    console.log("ERROR* no name in Checkbox")
                }
                console.log(nameArray1);
            });
            /******Filter End*******/

            /***** Highlight function*****/
            $('input[name=cbxH]').on('change', function () {
                var currentVal = $(this).val();

                if ($(this).is(':checked')) {
                    if (nameArray.indexOf(currentVal) === -1) {
                        nameArray.push(currentVal);
                    }
                    for (var namA in nameArray) {
                        var namesChecked = nameArray[namA];
                        var circle = $('.node[name*=' + namesChecked + ']');
                        var circleC = $('.nodeC[name*=' + namesChecked + ']');
                        var circleText = $('.textNode[name*=' + namesChecked + ']');
                        var links = $('.glink[name*=' + namesChecked + '][data*=' + namesChecked + ']');
                        var linksT = $('.glinkText[name*=' + namesChecked + '][data*=' + namesChecked + ']');
                        d3.selectAll(circle).transition().duration(750).style("fill", "#ff7f0e");
                        d3.selectAll(circleC).transition().duration(750).style(styles2.node);
                        d3.selectAll(circleText).transition().duration(750).style("fill", "#9e5e04");
                        d3.selectAll(links).transition().duration(750).style("stroke", "#9e5e04").style("stroke-width", "2.5px");
                        d3.selectAll(linksT).transition().duration(750).style("stroke", "#9e5e04").style("stroke-width", "2.5px");
                    }

                } else if ($(this).not(':checked')) {

                    d3.selectAll('.node').transition().duration(750).style("fill", "#1F3A93");
                    d3.selectAll('.nodeC').transition().duration(750).style(styles.node);
                    d3.selectAll('.textNode').transition().duration(750).style("fill", "#22313F");
                    d3.selectAll('.glink').transition().duration(700).style("stroke", "#22313F").style("stroke-width", "2px");
                    d3.selectAll('.glinkText').transition().duration(700).style("stroke", "#22313F").style("stroke-width", "2px");
                    var index = nameArray.indexOf(currentVal);
                    nameArray.splice(index, 1);

                    for (var namAr in nameArray) {
                        var namesUnChecked = nameArray[namAr];
                        var circleU = $('.node[name*=' + namesUnChecked + ']');
                        var circleUC = $('.nodeC[name*=' + namesUnChecked + ']');
                        var circleTextU = $('.textNode[name*=' + namesUnChecked + ']');
                        var linksU = $('.glink[name*=' + namesUnChecked + '][data*=' + namesUnChecked + ']');
                        d3.selectAll(circleU).transition().duration(750).style("fill", " #ff7f0e");
                        d3.selectAll(circleUC).transition().duration(750).style(styles2.node);
                        d3.selectAll(circleTextU).transition().duration(750).style("fill", "#9e5e04");
                        d3.selectAll(linksU).transition().duration(750).style("stroke", "#9e5e04").style("stroke-width", "2.5px");
                    }
                } else {
                    console.log("ERROR* no name in Checkbox")
                }
                // console.log(nameArray);
            });
            /******Highlighting End*******/

            // CHECK CODE ABOVE!

            var nodes = data.data.nodes;
            var links = data.data.edges;

            var stylesRadius = {
                r: function (d) {
                    return (d.oc * 10);
                }
            };

            var lineX2 = function (d) {
                var nodeRadius = d.target.oc * 10;
                var length = Math.sqrt(Math.pow(d.target.y - d.source.y, 2) + Math.pow(d.target.x - d.source.x, 2));
                var scale = (length - nodeRadius) / length;
                var offset = (d.target.x - d.source.x) - (d.target.x - d.source.x) * scale;

                if (isNaN(d.target.x - offset)){
                    return 0;
                } else {
                    return d.target.x -offset;
                }

            };

            var lineY2 = function (d) {

                var nodeRadius = d.target.oc * 10;
                var length = Math.sqrt(Math.pow(d.target.y - d.source.y, 2) + Math.pow(d.target.x - d.source.x, 2));
                var scale = (length - nodeRadius) / length;
                var offset = (d.target.y - d.source.y) - (d.target.y - d.source.y) * scale;
                if(isNaN(d.target.y - offset)) {
                    return 0;
                } else {
                    return d.target.y - offset;
                }
            };

            var yScale = d3.scale.linear().range([height - 100, 100]);

            var ChangeColor = d3.scale.linear().domain([1, 10])
                .range([d3.rgb('steelblue')
                    .brighter(), d3.rgb(31, 58, 147).brighter()]);

            ChangeColor.domain(d3.extent(nodes, function (d) {
                return d.oc;
            }));

            visualize(hierarchical);

            function visualize(hierarchical) {

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .linkDistance(200)
                    .gravity(0.07)
                    .charge(-700)
                    .size([width, height])
                    .on("tick", tick)
                    .start();

                if(hierarchical) {
                    ChangeColor.domain(d3.extent(nodes, function (d) {
                        return d.oc;
                    }));

                    yScale.domain(d3.extent(nodes, function (d) {
                        return d.oc;
                    }));
                }

                var svg = d3.select(".MapSvgMain").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "svg")
                    .attr("viewBox", " 0 0 1020 700")
                    .attr("preserveAspectRatio", "xMidYMid");

                force.nodes(nodes)
                    .links(links)
                    .start();

                var link = svg.selectAll("line.link")
                    .data(links)
                    .enter()
                    .append("g")
                    .attr("class", "glink")
                    .append("svg:line")
                    .attr("class", "link")
                    .style("stroke-width", function (d) {
                        return Math.sqrt(d.value);
                    })
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", lineX2)
                    .attr("y2", lineY2)
                    .attr("marker-end", "url(#arrowGray)")
                    .attr("name", function (d) {
                        return d.source.nameUser;
                    })
                    .attr("data", function (d) {
                        return d.target.nameUser;
                    })
                    .on("click", function (d) {
                        link.style("stroke", "#dddddd");
                        node.style("stroke", "#FFFFFF");
                        d3.select(this).style("stroke", "red");
                        link.attr("marker-end", null);
                        link.attr("marker-end", "url(#arrowGray)");
                        d3.select(this).attr("marker-end", null);
                        d3.select(this).attr("marker-end", "url(#arrowRed)");
                    });

                var defs = svg.append('defs');

                defs.append("svg:marker")
                    .attr("id", "arrowGray")
                    .attr("viewBox", "0 0 10 10")
                    .attr("refX", "10")
                    .attr("refY", "5")
                    .attr("markerUnits", "strokeWidth")
                    .attr("markerWidth", "10")
                    .attr("markerHeight", "5")
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M 0 0 L 10 5 L 0 10 z")
                    .attr("fill", "#000");

                var gnode = svg.selectAll('g.gnode')
                    .data(nodes)
                    .enter()
                    .append('g')
                    .on("dblclick", dblclick)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("name", function (d) {
                        return d.nameUser;
                    })
                    .classed('gnode', true)
                    .call(force.drag);

                var circle = gnode.append("circle")
                    .attr("class", "node")
                    .attr("r", stylesRadius.r)
                    .style("fill", function (d) {
                        return color(d.group);
                    })
                    .on("dblclick", dblclick)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .attr("name", function (d) {
                        return d.nameUser;
                    })
                    .classed('gnode', true)
                    .call(force.drag);

                var text = gnode.append("text")
                    .attr("name", function (d) {
                        return d.nameUser;
                    })
                    .attr("class", "textNode")
                    .attr("text-anchor", "middle")
                    .attr("y", function (d) {
                        return -d.oc * 12
                    })
                    .text(function (d) {
                        return d.label;
                    });

                var textLink = svg.selectAll(".glink")
                    .data(links)
                    .filter(function (d) {
                        return d.source.label !== d.target.label
                    })
                    .append("text")
                    .attr("class", "gText hidden")
                    .text(function (d) {
                        return d.content;
                    });

                force.on("tick", function () {

                    if(hierarchical) {
                        //Set Target down and Source to top
                        nodes.forEach(function (d) {
                            d.y = yScale(d.oc);
                        });
                    }


                    link.attr("x1", function (d) {
                        return d.source.x;
                    })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", lineX2)
                        .attr("y2", lineY2);


                    textLink.attr("x", function (d) {
                        if (d.target.x > d.source.x) {
                            return (d.source.x + 5 + (d.target.x - d.source.x) / 2);
                        }
                        else {
                            return (d.target.x + 5 + (d.source.x - d.target.x) / 2);
                        }
                    }).attr("y", function (d) {
                        if (d.target.y > d.source.y) {
                            return (d.source.y - 10 + (d.target.y - d.source.y) / 2);
                        }
                        else {
                            return (d.target.y - 10 + (d.source.y - d.target.y) / 2);
                        }
                    });

                    gnode.attr("transform", function(d) {
                        return 'translate(' + [d.x, d.y] + ')';
                    });
                });

                var zoom = d3.behavior.zoom()
                    .scaleExtent([0.4, 2])
                    .on("zoom", zoomed);

                $('.zoomSlider').html("")

                var slider = d3.select(".zoomSlider")
                    .append("div")
                    .attr("class", "pSlider")
                    .append("input")
                    .attr("class", "slider")
                    .attr("type", "range")
                    .attr("value", 1)
                    .attr("min", zoom.scaleExtent()[0])
                    .attr("max", zoom.scaleExtent()[1])
                    .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 400)
                    .on("input", slide);

                setTimeout(timedCall, 8000);

                function timedCall() {
                    staticPosition();
                }

                function staticPosition() {
                    gnode.each(function (d) {
                        d.x = 0;
                        d.y = 0;
                        d.fixed = false;
                    });
                    tick();
                    gnode.each(function (d) {
                        d.fixed = true;
                    });
                    force.resume();
                }

                function tick() {

                    gnode.attr("transform", function (d) {
                        return 'translate(' + [d.x, d.y] + ')';
                    });

                    link.filter(function (d) {
                        return d.source.label !== d.target.label;
                    }).attr('x1', function (d) {
                        return d.source.x;
                    })
                        .attr('y1', function (d) {
                            return d.source.y;
                        })
                        .attr('x2', function (d) {
                            return d.target.x;
                        })
                        .attr('y2', function (d) {
                            return d.target.y;
                        });

                    textLink.attr("x", function (d) {
                        if (d.target.x > d.source.x) {
                            return (d.source.x + 5 + (d.target.x - d.source.x) / 2);
                        }
                        else {
                            return (d.target.x + 5 + (d.source.x - d.target.x) / 2);
                        }
                    }).attr("y", function (d) {
                        if (d.target.y > d.source.y) {
                            return (d.source.y - 10 + (d.target.y - d.source.y) / 2);
                        }
                        else {
                            return (d.target.y - 10 + (d.source.y - d.target.y) / 2);
                        }
                    });

                    gnode.each(collide(0.1)); //Add collide to each node
                }

                function dblclick(d) {
                    console.log("dblclick");
                    d3.select("svg").on("dblclick.zoom", null);
                    if ($(this).attr('aria-expanded') == 'false') {
                        d3.select(this).classed("fixed", d.fixed = false);
                    } else if ($('#NodeMappingId').attr('aria-expanded') == 'true') {
                        $('#pText').remove();
                        $('#btnVisualize').removeClass('Off').addClass('On');
                        var item = $(this).text();
                        counter++;
                        createTable(item, counter);
                        d3.select(this).transition().duration(750).style("opacity", 0.3);

                        if (counter === 2) {
                            d3.select(this).transition().duration(750).style("opacity", 0.3);
                            counter = counter - 2
                        }
                    }
                }

                function zoomed() {
                    console.log("zoomed");
                    svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                    slider.property("value", d3.event.scale);
                }

                function slide() {
                    zoom.scale(d3.select(this).property("value")).event(svg);
                }

                function dragstart(d) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("fixed", d.fixed = true);
                }

                function mouseover(d) {

                    var tooltip = $('.tooltip');
                    var popup_name = tooltip.find('.pop-up-content.name');
                    var popup_use = tooltip.find('.pop-up-content.use');
                    var popup_occurence = tooltip.find('.pop-up-content.occurence');

                    popup_name.html(d.label);
                    popup_use.html(d.nameUser);
                    popup_occurence.html(d.oc);

                    if(popUpActive) {
                        $(".tooltip").addClass("active");
                    }
                }

                function mouseout() {
                    $('.tooltip').removeClass("active");
                }

                //set new nodes with padding
                function collide(alpha) {
                    var qt = d3.geom.quadtree(nodes);
                    return function (d) {
                        var rb = 2 * radius + padding,
                            nx1 = d.x - rb,
                            nx2 = d.x + rb,
                            ny1 = d.y - rb,
                            ny2 = d.y + rb;

                        //.visit recursively visit nodes in the quadtree.
                        qt.visit(function (quad, x1, y1, x2, y2) {
                            if (quad.point && (quad.point !== d)) {
                                var x = d.x - quad.point.x,
                                    y = d.y - quad.point.y,
                                    l = Math.sqrt(x * x + y * y);
                                if (l < rb) {
                                    l = (l - rb) / l * alpha;
                                    d.x -= x *= l;
                                    d.y -= y *= l;
                                    quad.point.x += x;
                                    quad.point.y += y;
                                }
                            }
                            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                        });
                    };
                }

            }
        }

    }
})(golab.tools.cmDashboard);