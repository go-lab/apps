(function (conceptCloud) {
    conceptCloud.ConceptCloudEvolution = ConceptCloudEvolution;

    var content;
    var evolutionWidth = $("#tag_cloud").width();
    var evolutionHeight = 300;
    var formatDate = conceptCloud.util.formatDate;

    function ConceptCloudEvolution() {
        return {
            generate: generate
        };

        function generate() {
            loadMessageBundles();
            // get all saved concepts from concept_controller
            conceptCloud.conceptController.loadConceptClouds(function (data, message) {

                if (data == null) {
                    console.log("[ConceptCloud] Nothing to show in evolution timeline...");

                } else {
                    console.log("[ConceptCloud] Generating evolution timeline...");
                    buildEvolutionModel(data).then(function (graphData) {
                        draw(graphData);
                    });
                }

            });

        }

        function buildEvolutionModel(conceptClouds) {
            return new Promise(function (fulfill, reject) {

                content = [];

                for (var conceptCloud in conceptClouds) {

                    if (conceptClouds[conceptCloud].data.general != undefined) {

                        var cc = {
                            x: null,
                            y: Object.size(conceptClouds[conceptCloud].data.general),
                            storageId: conceptClouds[conceptCloud].metadata.generated,
                            info: {
                                generated: conceptClouds[conceptCloud].metadata.generated,
                                cloudSize: Object.size(conceptClouds[conceptCloud].data.general),
                                graphic: conceptClouds[conceptCloud].graphic != undefined ? conceptClouds[conceptCloud].graphic.svg : null,
                                fancy: 0,
                                flashy: 0
                            }
                        };

                        for (var student in conceptClouds[conceptCloud].data.user) {
                            var studentName = student.split('@')[0];

                            if (cc.info.students == undefined) {
                                cc.info.students = {};
                            }

                            if(conceptClouds[conceptCloud].data.user[student].metacontent.fancy) cc.info.fancy++;
                            if(conceptClouds[conceptCloud].data.user[student].metacontent.flashy) cc.info.flashy++;

                            cc.info.students[studentName] = {};
                            cc.info.students[studentName].numberOfConcepts = (conceptClouds[conceptCloud].data.user[student].content).length;

                        }

                        content.push(cc);
                    }
                }

                content.sort(function (a, b) {
                    return new Date(a.info.generated) - new Date(b.info.generated);
                });

                var counter = 1;
                for (var i in content) {
                    content[i].x = counter;
                    counter++;
                }

                fulfill(content);
            });
        }

        function draw(graphData) {

            $(".visualisation").html('');

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return formatDate(d.info.generated, 'LLL');
                });


            var margin = {top: 20, right: 20, bottom: 25, left: 40},
                width = evolutionWidth - margin.left - margin.right,
                height = evolutionHeight - margin.top - margin.bottom;

            var vis = d3.select(".visualisation").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(tip),

                xRange = d3.scale.ordinal().rangeRoundBands([margin.left, width - margin.right], 0.1).domain(graphData.map(function (d) {
                    return d.x;
                })),


                yRange = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([0,
                    d3.max(graphData, function (d) {
                        return d.y;
                    })
                ]),

                xAxis = d3.svg.axis()
                    .scale(xRange)
                    .tickSize(5)
                    .tickSubdivide(false),

                yAxis = d3.svg.axis()
                    .scale(yRange)
                    .tickSize(5)
                    .orient("left")
                    .tickSubdivide(false);

            vis.append('g')
                .attr('class', 'x axis')
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("x", width/2)
                .attr("dy", "-5")
                .style("text-anchor", "middle")
                .text(conceptCloud.languageHandler.getMessage('legend_evolution_x_axis'));


            vis.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(conceptCloud.languageHandler.getMessage('legend_evolution_y_axis'));

            vis.selectAll('rect')
                .data(graphData)
                .enter()
                .append('rect')
                .attr("class", "bar")
                .attr("info_id", function (d) {
                    return d.x;
                })
                .attr('x', function (d) {
                    return xRange(d.x);
                })
                .attr('y', function (d) {
                    return yRange(d.y);
                })
                .attr('width', xRange.rangeBand())
                .attr('height', function (d) {
                    return ((height - margin.bottom) - yRange(d.y));
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)


            var x = $('.x.axis');

        }
    }


    $(function () {
        $('.visualisation').on('mouseover', 'rect', function () {
            showInfo(d3.select(this).attr("info_id"));
        });

        function showInfo(selection) {
            // get specific info from array
            var thisInfo = content.filter(function (info) {
                return info.x == selection
            });

            // html selectors
            var canvas = new fabric.Canvas('tagCloud_snapshot');

            var $generated = $('#evolution').find('.generated');
            var $cloudSize = $('#evolution').find('.cloud-size');
            var $cloudNumber = $('#evolution').find('.number');
            var $fancyStudents = $('#evolution').find('.fancy-students');
            var $flashyStudents = $('#evolution').find('.flashy-students');
            var $numberOfConcepts = $('#evolution').find('.number-concepts');
            var $screenshot = $('#evolution').find('.screenshot');

            // render tagCloud as canvas
            canvas.loadFromDatalessJSON(thisInfo[0].info.graphic);

            // resize
            resizeCanvas(0.55);

            // set canvas size
            canvas.setWidth($screenshot.width());
            canvas.setHeight($screenshot.height());

            // show information
            $generated.html(formatDate(thisInfo[0].info.generated, 'LLL'));
            $cloudSize.html(thisInfo[0].info.cloudSize + ' concepts');
            $cloudNumber.html("#" + selection);
            $fancyStudents.html(thisInfo[0].info.fancy);
            $flashyStudents.html(thisInfo[0].info.flashy);

            function resizeCanvas(factor) {
                if (canvas.backgroundImage) {
                    // Need to scale background images as well
                    var bi = canvas.backgroundImage;
                    bi.width = bi.width * factor;
                    bi.height = bi.height * factor;
                }
                var objects = canvas.getObjects();
                for (var i in objects) {
                    var scaleX = objects[i].scaleX;
                    var scaleY = objects[i].scaleY;
                    var left = objects[i].left;
                    var top = objects[i].top;

                    var tempScaleX = scaleX * factor;
                    var tempScaleY = scaleY * factor;
                    var tempLeft = left * factor;
                    var tempTop = top * factor;

                    objects[i].scaleX = tempScaleX;
                    objects[i].scaleY = tempScaleY;
                    objects[i].left = tempLeft;
                    objects[i].top = tempTop;

                    objects[i].setCoords();
                }
                canvas.renderAll();
                canvas.calcOffset();
            }

        }

    });

    function loadMessageBundles() {

        var $analyticsInfo =  $('.analytics-info');

        $analyticsInfo.find('.generated-title').text(conceptCloud.languageHandler.getMessage('legend_evolution_generated'));
        $analyticsInfo.find('.cloud-size-title').text(conceptCloud.languageHandler.getMessage('legend_evolution_cloud-size'));
        $analyticsInfo.find('.flashy-title').text(conceptCloud.languageHandler.getMessage('legend_evolution_flashy'));
        $analyticsInfo.find('.fancy-title').text(conceptCloud.languageHandler.getMessage('legend_evolution_fancy'));
    }

    // get the size of an object
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };


})(golab.tools.conceptCloud);
