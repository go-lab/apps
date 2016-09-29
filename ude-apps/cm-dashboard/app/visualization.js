// NOT USED!!!

function visualizeJSON(data) {
    console.log(data);

    var nodes = data.data.nodes;
    console.log(nodes);
    var links = data.data.edges;
    console.log(links);

    var userInfo = data.data.userInfo;

    var nameArray1 = [];
    var nameArray = [];
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

    // Color Control for Highlighting Collection Panel
    var ChangeColor = d3.scale.linear().domain([1, 10])
        .range([d3.rgb('steelblue')
            .brighter(), d3.rgb(31, 58, 147).brighter()]);

    ChangeColor.domain(d3.extent(nodes, function (d) {
        return d.oc;
    }));

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

    var stylesRadius = {
        r: function (d) {
            return (d.oc * 10);
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

    var width = 1020,
        height = 700;
    var counter = 0;

    //var ChangeColor =  d3.scale.linear().domain([1,20]).range(["#2980b9"]);
    // var ChangeColor =  d3.scale.category20b();

    var yScale = d3.scale.linear().range([height - 100, 100]);

    function visualizeScaleY() {

        console.log("ScaleY");

        var force = d3.layout.force()
            .size([width, height])
            .nodes(nodes)
            .links(links)
            .linkDistance(200)
            .on("tick", tick)
            .start();

        ChangeColor.domain(d3.extent(nodes, function (d) {
            return d.oc;
        }));

        yScale.domain(d3.extent(nodes, function (d) {
            return d.oc;
        }));

        var zoom = d3.behavior.zoom()
            .scaleExtent([0.4, 2])
            .on("zoom", zoomed);

        var drag = force.drag()
            .on("dragstart", dragstart);

        var slider = d3.select(".zoomSlider").append("p")
            .attr("class", "pSlider")
            .append("input")
            .attr("class", "slider")
            .attr("type", "range")
            .attr("value", 1)
            .attr("min", zoom.scaleExtent()[0])
            .attr("max", zoom.scaleExtent()[1])
            .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 400)
            .on("input", slide);


        var svg = d3.select('.MapSvgMain').append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr("viewBox", " 0 0 1020 700")
            .attr("preserveAspectRatio", "xMidYMid")
            .call(zoom);
        var container = svg.append('g');

        // div for tooltips
        var div = d3.select(".MapSvgMain")
            .append("div")
            .attr("class", "tooltip");


        var glink = container.selectAll('.glink')
            .data(links)
            .enter()
            .append("g")
            .attr("class", "glink")
            .attr("name", function (d) {
                return d.source.nameUser;
            })
            .attr("data", function (d) {
                return d.target.nameUser;
            })
            .append('line')
            .attr('class', 'link')
            .filter(function (d) {
                return d.source.label !== d.target.label
            })
            .attr("marker-end", "url(#end)");

        var gnode = container.selectAll('g.gnode')
            .data(nodes)
            .enter()
            .append('g')
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .attr("name", function (d) {
                return d.nameUser;
            })
            .classed('gnode', true)
            .call(drag);

        // Add one circle in each group
        var circle = gnode.append("circle")
            .attr("class", "nodeC")
            .attr("name", function (d) {
                return d.nameUser;
            })
            .attr("r", function (d) {
                return d.oc * 10
            })
            .style("fill", function (d) {
                return ChangeColor(d.oc);
            });

        // Append the labels to each group
        var text = gnode.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "textNode")
            .attr("name", function (d) {
                return d.nameUser;
            })
            .attr("y", function (d) {
                return -d.oc * 12
            })
            .text(function (d) {
                return d.label;
            });

        // build the arrow
        svg.append("svg:g").selectAll("marker")
            .data(["end"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 100)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");


        function tick() {
            //Set Target down and Source to top
            nodes.forEach(function (d) {
                d.y = yScale(d.oc);
            });

            gnode.attr("transform", function (d) {
                return 'translate(' + [d.x, d.y] + ')';
            });

            glink.filter(function (d) {
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

            gnode.each(collide(0.1)); //Add collide to each node
        }

        function zoomed() {
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            slider.property("value", d3.event.scale);
        }

        function slide() {
            zoom.scale(d3.select(this).property("value")).event(container);
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

            if ($('#cbxWell').is(':checked')) {
                $(".tooltip").addClass("active");
            }
        }

        function mouseout() {
            $('.tooltip').removeClass("active");
        }


        // padding between circles
        var padding = 20,
            radius = function (d) {
                return d.oc * 10
            };

        //set new nodes with padding
        function collide(alpha) {
            var qt = d3.geom.quadtree(nodes)
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

// Input Content

    $("#cbxStandard").on("click touch", function() {
        $('.tableBodyListNamesHigh').find('input').removeAttr('checked');
        $('input[name=cbxF]').prop('checked', true);
        if (userInfo !== undefined) {
            nameArray1 = [];
            for (var k in userInfo) {
                var userInfoNew = userInfo[k];
                var name = userInfoNew.name;
                nameArray1.push(name);
            }
        }
        if ($("#cbxStandard").is(':checked')) {
            // Todo: Remove all applied filters...
            $("#highlightCollapseDefaultId").css("display", "block")
        }
    });

    $("#cbxContent").on("click touch", function() {
        $('.tableBodyListNamesHigh').find('input').removeAttr('checked');
        $('input[name=cbxF]').prop('checked', true);
        if (userInfo !== undefined) {
            nameArray1 = [];
            for (var k in userInfo) {
                var userInfoNew = userInfo[k];
                var name = userInfoNew.name;
                nameArray1.push(name);
            }
        }
        if ($("#cbxContent").is(':checked')) {
            // hide ArrowHeads
            d3.select("defs").style("display", "none");
        } else {
            d3.select("defs").style("display", "inline-block");
        }
    });

    $("#cbxScaleY").on("click touch", function() {
        removeBasic();
        $('.tableBodyListNamesHigh').find('input').removeAttr('checked');
        $('input[name=cbxF]').prop('checked', true);
        if (userInfo !== undefined) {
            nameArray1 = [];
            for (var k in userInfo) {
                var userInfoNew = userInfo[k];
                var name = userInfoNew.name;
                nameArray1.push(name);
            }
        }
        if ($("#cbxScaleY").is(':checked')) {
            visualizeScaleY();
        }
    });

    $("#cbxLinkText").on("click touch", function() {
        $('.tableBodyListNamesHigh').find('input').removeAttr('checked');
        $('input[name=cbxF]').prop('checked', true);
        if (userInfo !== undefined) {
            nameArray1 = [];
            for (var k in userInfo) {
                var userInfoNew = userInfo[k];
                var name = userInfoNew.name;
                nameArray1.push(name);
            }
        }
        var edgeLabels = d3.select('.MapSvgMain').selectAll('.gText');
        if ($("#cbxLinkText").is(':checked')) {
            edgeLabels.classed("hidden", false);
        } else {
            edgeLabels.classed("hidden", true);

        }
    });

    $("#cbxOnlyNodes").on("click touch", function () {
        $('.tableBodyListNamesHigh').find('input').removeAttr('checked');
        $('input[name=cbxF]').prop('checked', true);
        if (userInfo !== undefined) {
            nameArray1 = [];
            for (var k in userInfo) {
                var userInfoNew = userInfo[k];
                var name = userInfoNew.name;
                nameArray1.push(name);
            }
        }
        var edges = d3.select('.MapSvgMain').selectAll('.link');
        if ($("#cbxOnlyNodes").is(':checked')) {
            console.log("hide");
            edges.classed("hidden", true);
        } else {
            edges.classed("hidden", false);
        }
    });

}