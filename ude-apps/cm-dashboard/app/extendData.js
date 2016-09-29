/**
 * Created by Peter on 09.10.2015.
 */




        var mapData = {
            "data": [
            {
                "node": [
                    {
                        "id": 0,
                        "color": "yellow",
                        "Name": "Lizzy"
                    },
                    {
                        "id": 2,
                        "color": "green",
                        "Name": "Cally"
                    },
                    {
                        "id": 3,
                        "color": "blue",
                        "Name": "Sally"
                    },
                    {
                        "id": 4,
                        "color": "white",
                        "Name": "blue"
                    },
                    {
                        "id": 5,
                        "color": "yellow",
                        "Name": "Fuzzy"
                    },
                    {
                        "id": 6,
                        "color": "yellow",
                        "Name": "Susy"
                    }
                ],
                "links": [
                    {
                        "source": 0,
                        "target": 1
                    },
                    {
                        "source": 1,
                        "target": 2
                    },
                    {
                        "source": 1,
                        "target": 0
                    },
                    {
                        "source": 2,
                        "target": 2
                    },
                    {
                        "source": 3,
                        "target": 2
                    },
                    {
                        "source": 3,
                        "target": 3
                    }
                ]
            }
        ]
        };



var width = 1020,
    height = 800,
    ChangeColor = d3.scale.linear().range(["red","blue"])


var nodes = [
    {   x: width / 12,
        y: height / 2,
        name: "Werner"},
    {
        x: 2 * width / 6,
        y: height / 2,
        name: "Willi"},
    {
        x: 6 * width / 4,
        y: height / 8,
        name: "Hans"},
    {
        x: 3 * width / 12,
        y: height / 3,
        name: "Rudolf"}
];

var links = [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 2, target: 1},
    {source: 3, target: 2}
];


var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(links)
    .linkDistance(width / 3)
    .on("tick", tick)
    .start();

ChangeColor.domain(d3.extent(nodes, function (d) {
    return d.x + d.y;
}));

var drag = force.drag()
    .on("dragstart", dragstart);


var svg = d3.select('.well').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox"," 0 0 1020 800")
    .attr("preserveAspectRatio","xMidYMid");

// div for tooltips
var div = d3.select(".well")
    .append("div")
    .attr("class", "tooltip");

var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr("stroke", "#22313F")
    .attr("stroke-width", "2")
    .style("fill", "#22313F")
    .attr('class', 'link')
    .attr("marker-end", "url(#end)");

var gnode = svg.selectAll('g.gnode')
    .data(nodes)
    .enter()
    .append('g')
    .on("dblclick", dblclick)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .classed('gnode', true)
    .call(drag);

// Add one circle in each group
var circle = gnode.append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .style("fill", function (d){
        return ChangeColor(d.x + d.y);
    });

// Append the labels to each group
var text = gnode.append("text")
    .attr("x", -15)
    .attr("y", -25)
    .text(function(d) { return d.name;});

// build the arrow
svg.append("svg:g").selectAll("marker")
    .data(["end"])
    .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX",28)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

function tick(){
    gnode.attr("transform", function(d) {
        return 'translate(' + [d.x, d.y] + ')';
    });

    link.attr('x1', function (d) {
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
    }



    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }

function mouseover(d){
        $(".tooltip").addClass("on");
        div.transition()
            .duration(500)
            .style("opacity",.9);
        div.html(
            d.name + "<br/>" +
            "<br/>" + "X:" + "<b>"+ d.x + "</b>" +
            "<br/>" + "Y:" + "<b>"+ d.y + "</b>")
            .style("left", d.x + 50 + "px")
            .style("top", d.y +(-20)+ "px")
    }
function mouseout(){
    $(".on").removeClass("on");
}