/**
 * Created with JetBrains WebStorm.
 * User: alfredo
 * Date: 12/4/13
 * Time: 9:28 AM
 * To change this template use File | Settings | File Templates.
 */

function visualizeStatic() {
    d3.json('0.json', visualizeFromJSON);
}


function visualizeFromJSONModalOnlyConcepts(network, data, actionLogger, metadataHandler) {

    console.log(network);

    var framework = new VisualizationFramework();
    var graphEngine = new VisualizationEngine(framework);

    $("#content-modal").html($('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>'));

    $('#myModal')
        .append('<div class="modal-dialog modal-lg"></div>');
    $('.modal-dialog')
        .append('<div class="modal-content"></div>');

    $('.modal-content')
        .append('<div class="modal-header"></div>');

    $('.modal-header')
        .append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');

    $('.modal-header')
        .append('<h3>Konzepte</h3>');

    $('.modal-content').append('<div class="modal-body"></div>');

    $('.modal-content')
        .append('<div class="modal-footer">');
    $('.modal-footer')
        .append('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');


    $('#myModal').modal('show');

    console.log((network != ""))
    console.log((network.data !== "undefined"))
    console.log((network.data.nodes !== "undefined"))
    console.log((network.data.nodes.length > 0))


    if ((network != "") && (network.data !== "undefined") && (network.data.nodes !== "undefined") && (network.data.nodes.length > 0)) {
        console.log("hallo");
        if (framework.initialize(network, '.modal-body')) {
            //graphEngine.initialize();
            graphEngine.startOnlyConcepts(data, actionLogger, metadataHandler);

        } else {
            console.log("hallo2")
            $("#content-body").text("No concept maps have been saved in this space, yet.");
        }
    } else {

        $("#content-body").text("No concept maps have been saved in this space, yet.");
    }

}


function visualizeFromJSONModal(network, data, group_concepts, groupNr) {

    console.log(network);

    var framework = new VisualizationFramework();
    var graphEngine = new VisualizationEngine(framework);

    var multiUseDialog = $('#d3FullDialog');
    var multiUseHeader = multiUseDialog.find('.modal-header').empty();
    var multiUseBody = multiUseDialog.find('.modal-body').empty();

    var singles = 0;
    var multiples = 0;
    for (i in group_concepts) {
        if (group_concepts[i].length === 1) {
            singles++;
        } else {
            multiples++;
        }
    }

    multiUseHeader.append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button> Conceptcloud <span>Group: </span>' + groupNr);

    var tableDiv = $('<div style="display: table; border-collapse: separate; border-spacing: 10px"></div>');

    var totalConceptsRow = $('<div style="display: table-row; overflow:visible"></div>')
        .append('<div style="display: table-cell;"><label style="display:inline">Total Concepts:</label></div>')
        .append($('<div class="groupMemberCell" style="display: table-cell"><span class="badge">' + Object.keys(group_concepts).length + '</span></div>'));

    var distributedKnowledgeRow = $('<div class="tableRow" style="display: table-row;"></div>')
        .append('<div style="display: table-cell;"><label style="display:inline">Distributed Knowledge:</label></div>')
        .append('<div style="display: table-cell"><span class="badge">' + singles + '</span></div>');

    var sharedKnowledgeRow = $('<div class="tableRow" style="display: table-row;"></div>')
        .append('<div style="display: table-cell;"><label style="display:inline">Shared Knowledge:</label></div>')
        .append('<div style="display: table-cell"><span class="badge">' + multiples + '</span></div>');

    tableDiv.append(totalConceptsRow)
        .append(distributedKnowledgeRow)
        .append(sharedKnowledgeRow);

    var rowDiv = $('<div class="row"></div>')
        .append($('<div class="d3Legend col-xs-6 col-md-2"></div>')
            .append(tableDiv))
        .append($('<div style="padding:0" class="col-xs-12 col-md-10"></div>')
            .append('<div class="svg-frame"></div>'));

    multiUseBody.append(rowDiv);

    multiUseDialog.modal('show');


    if ((network != "") && (network.data !== "undefined") && (network.data.nodes !== "undefined") && (network.data.nodes.length > 0)) {
        if (framework.initialize(network, '.svg-frame')) {
            //graphEngine.initialize();
            graphEngine.start(data);

        } else {
            multiUseBody.append("Not enough concept data.");
        }
    } else {

        $("#content-body").text("Not enough concept data");
    }

}

//JavaScript library for manipulating the user interface
function VisualizationFramework() {

    var gZoom;

    // the network title
    var title;
    // the network description
    var description;
    //the network type
    var networktype;
    // is the network directed
    var directed;
    //the current network time
    var networkTime;

    // the node measures
    var nodeMeasures;
    var nodeMeasureContext = 'oc';
    var nodeFilterValue = 0;
    var nodeSizeScale;
    var nodeAlplhaScale;

    //the edge measures
    var edgeMeasures;
    var edgeMeasureContext = 'weight';
    var edgeFilterValue = 0;
    var edgeSizeScale;
    var edgeAlphaScale;

    //the node properties
    var nodeproperties;
    var nodePropertyContext = 'default';

    //the edge properties
    var edgeproperties;
    var edgePropertyContext = 'default';

    //the network data links
    var datalinks;
    var currentTimeFrame = 0;

    // the node set
    var nodeset;
    // the edge set
    var edgeset;
    //the svg canvas
    var canvas;
    //canvas dimensions
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    //scope context
    var scopeContext = 0;
    var trailExploration = false;

    //initialization flag
    var frameworkInitialized = false;
    //the node notation
    var nodeNotation = '.node';
    //the edge notation
    var edgeNotation = '.edge';
    //the label notation
    var labelNotation = '.label';
    //node color scale
    var nodeColorScale = d3.scale.category10();
    // edge color scale
    var edgeColorScale = d3.scale.category10();
    //default node size
    var defaultNodeSize = 30;
    //default edge size
    var defaultEdgeSize = 0.5;
    //default label size
    var defaultLabelSize = 3;
    //the movie clip main control
    var movieControl;
    // variables that preserve the exploration perspective during each iteration
    var scale = 1;
    var translate = [0, 0];
    //the duration of the movie frame
    var duration = 1500;
    //visual stability
    var visualStability = false;
    //transition objects
    var transferLayer = new Array();

    //main initialization function
    this.initialize = function (dataFile, target) {
        //if (!frameworkInitialized) {
        //initializeUIListeners();
        //}

        //cleanCanvas();
        frameworkInitialized = initializeDataLoading(dataFile.metadata, dataFile.data);
        if (frameworkInitialized) {
            translateEdges();
            initializeCanvas(target);
            adjustScales();
            adjustExplorationContext();
        }
        return frameworkInitialized;
    };

    function adjustScales() {
        updateNodeSizeScale(nodeMeasureContext);
        updateNodeAlphaScale(nodeMeasureContext);
        updateEdgeSizeScale(edgeMeasureContext);
        updateEdgeAlphaScale(edgeMeasureContext);
    }

    //initializes the ui listeners
    function initializeUIListeners() {
        d3.select('#networkinfo').on('click', function () {
            removeMenuFocus();
            focusMenuElement('#networkinfo');
            showToolBar();
            displayNetworkInfo();
        });
        d3.select('#measures').on('click', function () {
            removeMenuFocus();
            focusMenuElement('#measures');
            showToolBar();
            displayMeasuresAndProperties();
        });

        d3.select('#search').on('click', function () {
            removeMenuFocus();
            focusMenuElement('#search');
            showToolBar();
            displaySearch();
        });
        d3.select('#timenavigation').on('click', function () {
            removeMenuFocus();
            focusMenuElement('#timenavigation');
            showToolBar();
            displayTimeNavigation();
        });


    }

    //initialize the network information
    function initializeDataLoading(metadata, data) {

        if (metadata != null && metadata != undefined && data != null && data != undefined) {
            //retrieving the meta data....
            title = (metadata.title != undefined) ? metadata.title : undefined;
            networkTime = (metadata.time != undefined) ? metadata.time : undefined;
            description = (metadata.description != undefined ) ? metadata.description : undefined;
            networktype = (metadata.type != undefined ) ? metadata.type : undefined;
            directed = (metadata.directed != undefined ) ? metadata.directed : undefined;
            datalinks = (metadata.datalinks != undefined ) ? metadata.datalinks : undefined;
            nodeMeasures = (metadata.measures != undefined ) ? extractMeasures(metadata.measures, 'node') : undefined;
            edgeMeasures = (metadata.measures != undefined ) ? extractMeasures(metadata.measures, 'edge') : undefined;
            nodeproperties = (metadata.nodeproperties != undefined ) ? metadata.nodeproperties : undefined;
            edgeproperties = (metadata.edgeproperties != undefined ) ? metadata.edgeproperties : undefined;

            nodeset = (data.nodes != undefined ) ? transferGraphState(data.nodes) : undefined;
            edgeset = (data.edges != undefined ) ? data.edges : undefined;


            return true;
        }
        return false;
    }

    //function that transfers the old graph coordinates to the new one
    function transferGraphState(newNodeSet) {
        if (visualStability) {
            if (nodeset != undefined || nodeset != null) {
                //transfer the coordinates of the current nodeset to the transfer layer
                for (var i = 0; i < nodeset.length; i++) {
                    var currentNode = nodeset[i];
                    var transferObjectIndex = retrieveTransferObjectIndex(currentNode);
                    if (transferObjectIndex != -1) {
                        var transferObject = transferLayer[transferObjectIndex];
                        transferObject.x = currentNode.x;
                        transferObject.y = currentNode.y;
                        transferObject.fixed = currentNode.fixed;
                    } else {
                        var transferObject = {
                            id: currentNode.id,
                            label: currentNode.label,
                            x: currentNode.x,
                            y: currentNode.y,
                            fixed: true
                        };
                        transferLayer.push(transferObject);
                    }
                }
                //transfer the coordinates of the transfer layer to the new nodeset
                for (var i = 0; i < newNodeSet.length; i++) {
                    var newNode = newNodeSet[i];
                    var transferObjectIndex = retrieveTransferObjectIndex(newNode);
                    //if the new node is a target object then...
                    if (transferObjectIndex != -1) {
                        var transferObject = transferLayer[transferObjectIndex];
                        newNode.x = transferObject.x;
                        newNode.y = transferObject.y;
                        newNode.fixed = transferObject.fixed;
                    }
                }
            }

        }
        return newNodeSet;
    }

    function retrieveTransferObjectIndex(object) {
        for (var i = 0; i < transferLayer.length; i++) {
            if (transferLayer[i].label.trim() == object.label.trim())
                return i;
        }
        return -1;
    }

    function edgeSetFutureTranslate(newEdgeSet) {

    }

    //support function for translating the edgeset into the appropriate way
    function translateEdges() {
        edgeset.forEach(
            function (edge) {
                edge.source = nodeset[translateNode(edge.source)];
                edge.target = nodeset[translateNode(edge.target)];
            }
        );
    }

    //search a node over the nodeset
    function translateNode(nodeID) {
        for (var i = 0; i < nodeset.length; i++) {
            if (nodeID == nodeset[i].id) {
                return i;
            }
        }
        return -1;
    }

    //canvas initialization function
    function initializeCanvas(target) {

        var dialog = $('#d3FullDialog');
        var mod = dialog.find('.modal-dialog');
        var titleHeight = $('#appTitle').outerHeight();
        var headerHeight = dialog.find('.modal-header').outerHeight();
        var calcHeight = window.innerHeight - titleHeight - headerHeight - 30;
        console.log(window.innerHeight);
        console.log(titleHeight);
        console.log(headerHeight);
        console.log(calcHeight);

        console.log(dialog.find('.d3Legend').outerWidth());
        var calcWidth = window.innerWidth - dialog.find('.d3Legend').outerWidth();

        /*     scale = 3;
         translate = [- window.innerWidth,(titleHeight - window.innerHeight)]
         */
        gZoom = d3.behavior.zoom().scale(scale).translate(translate).scaleExtent([1, 50]).on('zoom', function () {
            adjustZoom();
            adjustExplorationContext();
        });

        canvas = d3.select(target)
            .append('svg')
            .attr('id', 'canvas')
            .attr('viewBox', '0 0 ' + $(target).outerWidth() + ' ' + calcHeight)
            //.attr('viewBox', '0 0 ' + $(target).outerWidth() + ' ' + calcHeight)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style("height", calcHeight)
            .attr('width', $(target).outerWidth())
            .attr('height', calcHeight)
            .call(gZoom)
            .append('svg:g');

        /*canvas.append('svg:rect')
            .attr('width', canvasWidth)
            .attr('height', calcHeight)
            .style('fill', 'white')
            .style('stroke-width', '1')
         .style('pointer-events', 'all');*/


    }

    //zoom function
    function adjustZoom() {
        translate = d3.event.translate;
        scale = d3.event.scale;
    }

    function adjustExplorationContext() {
        canvas.attr('transform', 'translate(' + translate + ')' + ' scale(' + scale + ')');
    }

    //function responsable for cleaning the canvas
    function cleanCanvas() {
        canvas = d3.select('#canvas').remove();
    }

    //function for extracting any node or edge measure
    function extractMeasures(entities, entityclass) {
        var keys = new Array();
        entities.forEach(function (key) {
            if (key.class == entityclass) {
                keys.push(key);
            }
        });
        return keys;
    }

    //function for extracting any node or edge property
    function extractProperties(properties) {
        var keys = new Array();
        properties.forEach(function (property) {
            keys.push(Object.keys(property))
        })
        return keys;
    }

    //function for removing the focus of all menu elements
    function removeMenuFocus() {
        var menus = d3.selectAll('a');
        menus.style('background', '#5050D2');
        menus.style('text-decoration', 'none');
    }

    //function for focus the current menu element
    function focusMenuElement(selectionID) {
        var menu = d3.select(selectionID);
        menu.style('background', '#9698E2');
        menu.style('text-decoration', 'underline');
    }

    //function for displaying the toolbar
    function showToolBar() {
        d3.select('#customoptions').remove();
        d3.select('.side-right').append('div').attr('id', 'customoptions');
        d3.select('.side-right').transition().style('opacity', 1.0);
    }


    function switchToAlphagraph() {
        d3.selectAll(edgeNotation).attr("opacity", 0.1);
        d3.selectAll(labelNotation).attr("opacity", 0.1);
        d3.selectAll(nodeNotation).attr("opacity", 0.1);

    }

    function switchToNonAlphaGraph() {
        d3.selectAll(edgeNotation).attr("opacity", 1.0);
        d3.selectAll(labelNotation).attr("opacity", 1.0);
        d3.selectAll(nodeNotation).attr("opacity", 1.0);
    }

    /*-------------------------------------------------network info menu related function-------------------------------------------------------*/

    //function responsable for displaying the network information on the toolbar
    function displayNetworkInfo() {
        var customoptions = d3.select('#customoptions');
        customoptions.append('p').text('');
        if (title != undefined) {
            customoptions.append('p').text('Network title:');
            customoptions.append('p').text(title);
        } else {
            customoptions.append('p').text('Unable to detect the title of the network.');
        }

        customoptions.append('hr');

        if (networkTime != undefined) {
            customoptions.append('p').text('Current network time:');
            customoptions.append('p').text(networkTime);
        } else {
            customoptions.append('p').text('The network has no time information available.');
        }
        customoptions.append('hr');

        if (directed != undefined) {
            if (directed == "true")
                customoptions.append('p').text('The network is a directed graph.');
            else customoptions.append('p').text('The network is an undirected graph.');
        } else {
            customoptions.append('p').text('Unable To Detect Network Direction.');
        }

        customoptions.append('hr');

        if (description == undefined || description == 'undefined' || description == '' || description == ' ') {
            customoptions.append('p').text('Network Description Unavailable.');
        } else {
            customoptions.append('p').text(description);
        }
        customoptions.append('p').text('');
    }

    /*-------------------------------------------------measure menu related functions-------------------------------------------------------*/

    //function responsable for displaying the measure options on the toolbar
    function displayMeasuresAndProperties() {

        //initialize the html elements
        var customoptions = d3.select('#customoptions');

        //appends the node highlight box
        customoptions.append('p').text('Node Measures');
        customoptions.append('select').attr('id', 'nodehighlight');


        //appends the node filter slider
        customoptions.append('p').text('Node Filtering');
        customoptions.append('input').attr('id', 'nodefilter')
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', nodeFilterValue)
            .on('change', function () {
                if (nodeMeasureContext != 'default') {
                    nodeFilterValue = d3.select(this).property('value');
                    filterNodes();
                }
                else nodeFilterValue = 0;
            });
        updateNodeMeasureList();
        customoptions.append('hr');

        //appends the edge highlight box
        customoptions.append('p').text('Edge Measure');
        customoptions.append('select').attr('id', 'edgehighlight');

        //appends the edge filter slider
        customoptions.append('p').text('Edge Filtering');
        customoptions.append('input').attr('id', 'edgefilter')
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', edgeFilterValue)
            .on('change', function () {
                if (edgeMeasureContext != 'default') {
                    edgeFilterValue = d3.select(this).property('value');
                    filterEdges();
                }
                else edgeFilterValue = 0;
            });
        updateEdgeMeasureList();
        customoptions.append('hr');

        customoptions.append('p').text('Node Properties');
        customoptions.append('select').attr('id', 'nodeproperty');
        updateNodePropertyList();
        customoptions.append('p').text('Edge Properties');
        customoptions.append('select').attr('id', 'edgeproperty');
        updateEdgePropertyList();

    }

    //function for updating the node measure list
    function updateNodeMeasureList() {
        d3.select('#nodehighlight').append('option').attr('value', 'default').text('Default').attr('selected', function () {
            if (nodeMeasureContext == 'default') return 'selected'
        });
        nodeMeasures.forEach(function (measure) {
            d3.select('#nodehighlight').append('option').attr('value', measure.property).text(measure.title).attr('selected', function () {
                if (nodeMeasureContext == measure.property) return 'selected'
            });
        });

        d3.select('#nodehighlight').on('click', function () {
            updateNodeSizeScale(d3.select(this).property('value'));
            updateNodeAlphaScale(d3.select(this).property('value'));
            highlightNodeMeasure();

            if (nodeMeasureContext == 'default') {
                switchToNonAlphaGraph();
                nodeFilterValue = 0;
            }
        });
    }

    //function for updating the edge measure list
    function updateEdgeMeasureList() {
        d3.select('#edgehighlight').append('option').attr('value', 'default').text('Default').attr('selected', function () {
            if (edgeMeasureContext == 'default') return 'selected'
        });
        edgeMeasures.forEach(function (measure) {
            d3.select('#edgehighlight').append('option').attr('value', measure.property).text(measure.title).attr('selected', function () {
                if (edgeMeasureContext == measure.property) return 'selected'
            });
            ;
        });

        d3.select('#edgehighlight').on('click', function () {
            updateEdgeSizeScale(d3.select(this).property('value'));
            updateEdgeAlphaScale(d3.select(this).property('value'));
            highlightEdgeMeasure();

            if (edgeMeasureContext == 'default') {
                switchToNonAlphaGraph();
                edgeFilterValue = 0;
            }
        });
    }

    //function for filtering the nodes
    function filterNodes() {
        if (nodeFilterValue < 1) {
            switchToNonAlphaGraph();
        } else {
            d3.selectAll(nodeNotation).each(function () {
                d3.select(this).attr('opacity', function (node) {
                    return retrieveNodeAlphaValue(node)
                });
            });

            d3.selectAll(labelNotation).each(function () {
                d3.select(this).attr('opacity', function (node) {
                    return retrieveNodeAlphaValue(node)
                });
            });

            d3.selectAll(edgeNotation).attr('opacity', 0.1);

        }
    }

    //returns the correct node size depending on the selected measure
    function retrieveNodeSize(node) {
        if (nodeMeasureContext != 'default' && node != undefined)
            return nodeSizeScale(node[nodeMeasureContext]);
        return defaultNodeSize;
    }

    //returns the correct alpha value of a node depending on the selected measure
    function retrieveNodeAlphaValue(node) {
        if (nodeMeasureContext != 'default' && node != undefined) {
            if (node[nodeMeasureContext] != null && node[nodeMeasureContext] != undefined) {
                if (parseFloat(node[nodeMeasureContext]) < nodeAlplhaScale(nodeFilterValue)) {
                    return 0.1;
                }
            }
        }
        return 1.0;
    }

    //function for filtering the edges
    function filterEdges() {
        if (d3.select('#edgefilter').property('value') < 1) {
            switchToNonAlphaGraph()
        }
        else {
            d3.selectAll(edgeNotation).each(function () {
                d3.select(this).attr('opacity', function (edge) {
                    return retrieveEdgeAlphaValue(edge)
                });
            });
        }
    }

    //returns the correct edge size depending on the selected measure
    function retrieveEdgeSize(edge) {
        if (edgeMeasureContext != 'default' && edge != undefined) {
            return edgeSizeScale(edge[edgeMeasureContext]);
        }
        return defaultEdgeSize;
    }

    //returns the correct edge alpha value depending on the selected measure
    function retrieveEdgeAlphaValue(edge) {
        if (edgeMeasureContext != 'default' && edge != undefined) {
            if (edge[edgeMeasureContext] != null && edge[edgeMeasureContext] != undefined) {
                if (parseFloat(edge[edgeMeasureContext]) < edgeAlphaScale(edgeFilterValue))
                    return 0.1;
            }
        } else if (nodeFilterValue > 1)
            return 0.1;
        return 1.0;
    }

    //function to extract the node measure keyset
    function extractNodeMeasureKeySet(measureKey) {
        nodeScaleKeySet = new Array();

        nodeset.forEach(function (node) {
            if (node[measureKey] != null && node[measureKey] != undefined) {
                var nodeMeasure = parseFloat(node[measureKey]);
                var index = nodeScaleKeySet.indexOf(nodeMeasure);
                if (index == -1) {
                    nodeScaleKeySet.push(nodeMeasure);
                }

            }
        });

        return nodeScaleKeySet;
    };

    //function to extract the edge measure keyset
    function extractEdgeMeasureKeySet(measureKey) {
        edgeScaleKeySet = new Array();
        edgeset.forEach(function (edge) {
            if (edge[measureKey] != null && edge[measureKey] != undefined) {
                var edgeMeasure = parseFloat(edge[measureKey]);
                var index = edgeScaleKeySet.indexOf(edgeMeasure);
                if (index == -1) {
                    edgeScaleKeySet.push(edgeMeasure);
                }
            }
        });
        return edgeScaleKeySet;
    };


    //function for updating the node size scale
    function updateNodeSizeScale(measureKey) {
        var keySet = extractNodeMeasureKeySet(measureKey);
        var max = d3.max(keySet);
        var min = d3.min(keySet);
        if (min == max) {
            nodeSizeScale = d3.scale.linear().domain([min, max]).range([(defaultNodeSize), (defaultNodeSize)]);
        }
        else {
            nodeSizeScale = d3.scale.linear().domain([min, max]).range([defaultNodeSize, (defaultNodeSize * 6)]);
        }
        nodeMeasureContext = measureKey;
    }

    //function for updating the node alplha scale
    function updateNodeAlphaScale(measureKey) {
        var keySet = extractNodeMeasureKeySet(measureKey);
        var max = d3.max(keySet);
        var min = d3.min(keySet);
        nodeAlplhaScale = d3.scale.linear().domain([0, 100]).range([min, max]);
        nodeMeasureContext = measureKey;
    }

    //function for updating the edge size scale
    function updateEdgeSizeScale(measureKey) {
        var keySet = extractEdgeMeasureKeySet(measureKey);
        var max = d3.max(keySet);
        var min = d3.min(keySet);
        if (min == max) {
            edgeSizeScale = d3.scale.linear().domain([min, max]).range([(defaultEdgeSize), (defaultEdgeSize)]);
        }
        else {
            edgeSizeScale = d3.scale.linear().domain([min, max]).range([0.1, 2.0]);
        }
        edgeMeasureContext = measureKey;
    }

    //function for updating the edge alpha scale
    function updateEdgeAlphaScale(measureKey) {
        var keySet = extractEdgeMeasureKeySet(measureKey);
        var max = d3.max(keySet);
        var min = d3.min(keySet);
        edgeAlphaScale = d3.scale.linear().domain([0, 100]).range([min, max]);
        edgeMeasureContext = measureKey;
    }

    //function for highglighting the node measures
    function highlightNodeMeasure() {
        d3.selectAll(nodeNotation).transition().attr('d', d3.svg.symbol().size(function (node) {
            return retrieveNodeSize(node);
        }).type(function (node) {
            return retrieveNodeSymbol(node)
        }));
    }

    //function for highglighting the edge measures
    function highlightEdgeMeasure() {
        d3.selectAll(edgeNotation).transition().attr('stroke-width', function (edge) {
            return retrieveEdgeSize(edge)
        })
    }

    //function for updating the node property list
    function updateNodePropertyList() {
        d3.select("#nodeproperty").append('option').attr('value', 'default').text('Default').attr('selected', function () {
            if (nodePropertyContext == 'default')return 'selected'
        });

        extractProperties(nodeproperties).forEach(function (property) {
            d3.select("#nodeproperty").append('option').attr('value', property).text(property.toString().toUpperCase()).attr('selected', function () {
                if (nodePropertyContext == property) return 'selected'
            });
        });

        d3.select("#nodeproperty").on('click', function () {
            nodePropertyContext = d3.select(this).property('value');
            updateNodeColors();
            updateEdgeColors();
            updateConvexHullColors();

        });

    }

    //function for updating the edge property list
    function updateEdgePropertyList() {
        d3.select("#edgeproperty").append('option').attr('value', 'default').text('Default').attr('selected', function () {
            if (edgePropertyContext == 'default')return 'selected'
        });
        extractProperties(edgeproperties).forEach(function (property) {
            d3.select("#edgeproperty").append('option').attr('value', property).text(property.toString().toUpperCase()).attr('selected', function () {
                if (edgePropertyContext == property) return 'selected'
            });
        });

        d3.select("#edgeproperty").on('click', function () {
            edgePropertyContext = d3.select(this).property('value');
            updateEdgeColors();
        });
    }

    //function for updating the edge color
    function updateEdgeColors() {
        d3.selectAll(edgeNotation).each(function () {
            d3.select(this).attr("stroke", function (d) {
                return retrieveEdgeColor(d);
            })
        });
    };

    //function for updating the node colors
    function updateNodeColors() {
        d3.selectAll(nodeNotation).each(function () {
            d3.select(this).attr("fill", function (d) {
                return retrieveNodeColor(d);
            })
        })

    };

    function updateConvexHullColors() {
        d3.selectAll('.convexhull')
            .attr("opacity", function (d) {
                return 0.2;
            })
            .attr("fill", function (d) {
                return retrieveNodeColor(d.key);
            })
            .attr("stroke", function (d) {
                return retrieveNodeColor(d.key);
            })
            .attr("stroke-width", 20)
            .attr("stroke-linejoin", "round");
    };

    //function for retrieving the node symbol
    function retrieveNodeSymbol(node) {
        return d3.svg.symbolTypes[node.type];
    }

    // function for retrieving the node color
    function retrieveNodeColor(node) {
        if (nodePropertyContext != 'default') {
            if (nodePropertyContext == 'clusters') {
                var clusters = node[nodePropertyContext];
                if (clusters != undefined) {
                    if (clusters.length == 0)
                        return 'white';
                    else if (clusters.length > 1)
                        return 'black';
                    return nodeColorScale(clusters[0]);
                } else if (node == 'undefined') {
                    return 'white'
                }
                return nodeColorScale(node);
            }
            else if (nodePropertyContext == 'mp') {
                var mp = node[nodePropertyContext];
                if (mp.toLocaleString() == 'true')
                    return 'red';
                return nodeColorScale(node.type);
            }
            return nodeColorScale(node[nodePropertyContext]);
        }
        return nodeColorScale(node.type);
    }

    function retrieveEdgeColor(edge) {
        if (edgePropertyContext != 'default') {
            if (edgePropertyContext == 'mp') {
                var mp = edge[edgePropertyContext];
                if (mp.toLowerCase() == 'true')
                    return 'red';

                return 'black';
            }
            return edgeColorScale(edge[edgePropertyContext]);
        } else if (edgePropertyContext == 'default' && nodePropertyContext == 'clusters') {
            var clusters = edge.source[nodePropertyContext];
            if (clusters != undefined) {
                if (clusters.length == 0) {
                    return 'white';
                } else if (clusters.length > 1) {
                    return 'black';
                }
                return nodeColorScale(clusters[0])
            } else if (edge.source == 'undefined') {
                return 'white'
            }
            return nodeColorScale(edge.source);
        }
        return 'black';
    }

    /*-------------------------------------------------search related functions-------------------------------------------------------*/
    //function responsable for displaying the search options on the toolbar
    function displaySearch() {
        var customoptions = d3.select('.side-right');
        customoptions.append('p').text('Search Scopes');
        customoptions.append('select').attr('id', 'scope').on('click', function () {
            updateScope(d3.select(this).property('value'))
        });
        d3.select('#scope').append('option').attr('value', 0).text('None').attr('selected', function () {
            if (scopeContext == 1)return 'selected'
        })
        d3.select('#scope').append('option').attr('value', 1).text('1.0x').attr('selected', function () {
            if (scopeContext == 1)return 'selected'
        })
        d3.select('#scope').append('option').attr('value', 2).text('1.5x').attr('selected', function () {
            if (scopeContext == 2)return 'selected'
        })
        d3.select('#scope').append('option').attr('value', 3).text('2.0x').attr('selected', function () {
            if (scopeContext == 3)return 'selected'
        })
        d3.select('#scope').append('option').attr('value', 4).text('Trail').attr('selected', function () {
            if (scopeContext == 4)return 'selected'
        })
        customoptions.append('hr')
        customoptions.append('p').text('Search');
        customoptions.append("datalist").attr('id', 'suggestions').selectAll("option").data(nodeset.map(function (node) {
            return node.label
        })).enter().append("option").attr("value", function (node) {
            return node;
        });
        customoptions.append('input').attr('id', 'searchfield').attr('type', 'text').attr("list", "suggestions").style('align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                searchNode(d3.select(this).property("value").toString().trim());
            } else if (d3.event.keyCode == 27) {
                cleanSearch();
            }
        });
        customoptions.append('input').attr('id', 'searchbutton').attr('type', 'button').attr('value', 'Search').on('click', function () {
            searchNode(d3.select('#searchfield').property("value").toString().trim());
        });
        customoptions.append('input').attr('id', 'cleanbutton').attr('type', 'button').attr('value', 'Clean').on('click', function () {
            cleanSearch();
        });
        customoptions.append('div').attr('id', 'results');
    }

    function searchNode(keyword) {
        if (keyword === "") {
            switchToNonAlphaGraph()
        } else {
            switchToAlphagraph();
            d3.selectAll(nodeNotation).each(function (d) {
                if (d.label.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) != -1) {
                    var originalPath = d3.select(this).attr('d');
                    d3.select(this).attr("d", d3.svg.symbol().size(function (d) {
                        return retrieveNodeSize(d) * 100;
                    }).type(function (d) {
                        return retrieveNodeSymbol(d);
                    })).transition().attr("opacity", 1.0).transition().attr("d", originalPath);
                }
            });

            d3.selectAll(labelNotation).each(function (d) {
                if (d.label.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) != -1) {
                    d3.select(this).attr('opacity', 1.0);
                }
            });

            nodeset.forEach(function (d) {
                if (d.label.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) != -1) {
                    var result = "Id: " + d.id + "<br>" + " Label: " + d.label + "<br>" + " Time Information: " + d.timeappearance + "<br>";
                    if (d[nodeMeasureContext] != null)
                        result += " Measure:" + nodeMeasureContext + ": " + d[nodeMeasureContext];
                    if (d[nodePropertyContext] != null)
                        result += " Property:" + nodePropertyContext + ": " + d[nodePropertyContext];
                    result += "<hr>";
                    d3.select("#results").append('p').attr('class', 'info').html(result);
                }
            });
        }
    }

    function cleanSearch() {
        switchToNonAlphaGraph();
        d3.select('#searchfield').property('value', "");
        d3.selectAll('.info').remove();
    }

    function updateScope(scopeValue) {
        scopeContext = scopeValue;
        if (scopeContext == 0) {
            switchToNonAlphaGraph();
            trailExploration = false;
        }
    }

    function scopeSearch(sourceNodes, iteration) {
        var impactedNodes = [];

        sourceNodes.forEach(function (sourcenode) {
            //highlight the source node
            d3.select('#node' + sourcenode.id).attr('opacity', 1.0);
            d3.select('#label' + sourcenode.id).attr('opacity', 1.0);

            //retrieving the impacted neighbors
            searchNeighbors(sourcenode).forEach(function (impactedNeighbor) {
                impactedNodes.push(impactedNeighbor)
            });
        });

        iteration++;

        if (iteration < scopeContext)
            scopeSearch(impactedNodes, iteration);

    }

    function searchNeighbors(sourceNode) {
        var impactedNeighbors = [];
        edgeset.forEach(function (edge) {
            var neighbor = (sourceNode == edge.source) ? edge.target : (sourceNode == edge.target) ? edge.source : undefined;
            if (neighbor != undefined) {
                d3.select("#node" + neighbor.id).attr("opacity", 1.0);
                d3.select("#label" + neighbor.id).attr("opacity", 1.0);
                if (edge.source == neighbor || edge.target == neighbor)
                    d3.select("#edge" + edge.id).transition().attr("opacity", 1.0);
                impactedNeighbors.push(neighbor)
            }
        });
        return impactedNeighbors;

    }

    /*-------------------------------------------------time navigation functions-------------------------------------------------------*/
    //function responsable for displaying the time navigation options on the toolbar
    function displayTimeNavigation() {
        var customoptions = d3.select('#customoptions');
        customoptions.append('p').text('Time Frame Selector');
        customoptions.append('input').attr('id', 'backward').attr('type', 'button').attr('value', '<').on('click', function () {
            moveBackwards();
        });
        customoptions.append('input').attr('id', 'networktime').attr('type', 'text').attr('value', currentTimeFrame).attr('readonly', 'true').style('text-align', 'center');
        customoptions.append('input').attr('id', 'forward').attr('type', 'button').attr('value', '>').on('click', function () {
            moveForward();
        });
        customoptions.append('hr');
        customoptions.append('p').text('Movie Control');
        customoptions.append('input').attr('id', 'play').attr('type', 'button').attr('value', 'Play').on('click', function () {
            var text = d3.select(this).attr('value');
            if (text == 'Play') {
                d3.select(this).attr('value', 'Stop');
                playMovie();
            } else {
                d3.select(this).attr('value', 'Play');
                stopMovie();
            }
        });
        customoptions.append('input').attr('id', 'timeslider').attr('type', 'range').attr('min', '0').attr('max', function () {
            return (datalinks.length - 1)
        }).attr('value', currentTimeFrame).on('change', function () {
            currentTimeFrame = d3.select(this).property('value');
            updateTimeSelector();
            visualize(datalinks[currentTimeFrame]);
        });
        customoptions.append('hr');
        customoptions.append('p').text('Movie Frame Delay');
        customoptions.append('input').attr('id', 'frameduration').attr('type', 'text').property('value', duration).style('text-align', 'center').on('keydown', function () {
            if (d3.event.keyCode == 13) {
                updateMovieFrame();
            }
        });
        customoptions.append('input').attr('id', 'framedurationbutton').attr('type', 'button').attr('value', 'Apply').on('click', function () {
            updateMovieFrame();
        });
        customoptions.append('hr');
        customoptions.append('p').text('Visual Stability');
        customoptions.append('input').attr('id', 'vstability').attr('type', 'checkbox').property('checked', visualStability).on('change', function () {
            updateVisualStability();
        });

    }

    function updateVisualStability() {
        visualStability = d3.select('#vstability').property('checked');
        if (!visualStability) {
            transferLayer = [];
        }
    };

    function updateMovieFrame() {
        duration = d3.select('#frameduration').property('value');
    };

    function playMovie() {
        movieControl = setInterval(function () {
            if (currentTimeFrame == (datalinks.length - 1)) {
                stopMovie();
                d3.select('#play').attr('value', 'Play');

            }
            else moveForward();
        }, duration)
    }

    function stopMovie() {
        clearTimeout(movieControl);
    }

    function updateTimeSelector() {
        d3.select('#networktime').property('value', currentTimeFrame);
        d3.select('#timeslider').property('value', currentTimeFrame);
    }

    function moveBackwards() {
        currentTimeFrame--;
        if (currentTimeFrame == -1) {
            currentTimeFrame = 0;
        } else {
            updateTimeSelector();
            visualize(datalinks[currentTimeFrame]);
        }
    }

    function moveForward() {
        currentTimeFrame++;
        if (currentTimeFrame == datalinks.length) {
            currentTimeFrame = datalinks.length - 1;
        } else {
            updateTimeSelector();
            visualize(datalinks[currentTimeFrame]);
        }
    }


    //-------------------------------public interface methods--------------------------------------

    //request the nodeset
    this.requestNodeSet = function () {
        return nodeset;
    };

    //request the edgeset
    this.requestEdgeSet = function () {
        return edgeset;
    };

    //request canvas
    this.requestCanvas = function () {
        return canvas;
    };

    //request the canvas width
    this.requestCanvasWidth = function () {
        return canvasWidth;
    };

    //request the canvas height
    this.requestCanvasHeight = function () {
        return canvasHeight;
    };

    //request the node notation
    this.requestNodeNotation = function () {
        return nodeNotation;
    };

    //request the node class
    this.requestNodeClassNotation = function () {
        return nodeNotation.substring(1, nodeNotation.length);
    };

    //request the edge notation
    this.requestEdgeNotation = function () {
        return edgeNotation;
    };

    //request the edge class
    this.requestEdgeClassNotation = function () {
        return edgeNotation.substring(1, edgeNotation.length);
    };

    //request label notation
    this.requestLabelNotation = function () {
        return labelNotation;
    };

    //request the label class
    this.requestLabelClassNotation = function () {
        return labelNotation.substring(1, labelNotation.length);
    };

    //request a node color
    this.requestNodeColor = function (node) {
        return retrieveNodeColor(node);
    };

    //request an edge color
    this.requestEdgeColor = function (edge) {
        return retrieveEdgeColor(edge)
    };

    //request the node symbol
    this.requestNodeSymbol = function (node) {
        return retrieveNodeSymbol(node);
    };

    //request the default node size
    this.requestNodeSize = function (node) {
        return retrieveNodeSize(node);
    };

    //request the default edge size
    this.requestEdgeSize = function (edge) {
        return retrieveEdgeSize(edge);
    };

    //request the default label size
    this.requestLabelSize = function () {
        return defaultLabelSize
    };

    //request the node alpha value
    this.requestNodeAlpha = function (node) {
        return retrieveNodeAlphaValue(node);
    };

    //request the edge alplha value
    this.requestEdgeAlpha = function (edge) {
        return retrieveEdgeAlphaValue(edge);
    };

    //request the label alpha value
    this.requestLabelAlpha = function (label) {
        return retrieveNodeAlphaValue(label);
    };

    //request scope search
    this.requestScopeSearch = function (node) {
        if (scopeContext != 0) {
            if (scopeContext < 4) {
                switchToAlphagraph();
                scopeSearch([node], 0);
            } else {
                if (!trailExploration) {
                    switchToAlphagraph();
                    trailExploration = !trailExploration;
                }
                scopeSearch([node], 3);
            }
        }
    };

    //request the index I of a specific node based on its ID
    this.requestNodeIndex = function (nodeID) {
        return translateNode(nodeID);
    };
    //requests information about the network direction. it returns true if the network is directed and false otherwise
    this.requestNetworkDirection = function () {
        return directed;
    };
    //requests an update to the label size
    this.requestLabelSizeUpdate = function (parameter) {
        defaultLabelSize = parameter;
    };
    //requests  an update to the node size
    this.requestNodeSizeUpdate = function (parameter) {
        defaultNodeSize = parameter;
    };
    // request and update to the edge size
    this.requestEdgeSizeUpdate = function (parameter) {
        defaultEdgeSize = parameter;
    };
    //request a numeric validation to a given parameter
    this.requestNumberValidation = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // User Interface Public Methods
    //requests the framework to adjust the exploration context
    this.requestContextAdjustment = function () {
        adjustExplorationContext();
    };

    //request node information
    this.requestNodeInformation = function (node) {
        d3.selectAll(nodeNotation).each(function (d) {
            if (d.id == node.id) {
                var htmlContent = "Node ID: " + node.id + " Label: " + node.label
                if (d[nodeMeasureContext] != null)
                    htmlContent += ", Measure: " + nodeMeasureContext + ": " + node[nodeMeasureContext];
                if (d[nodePropertyContext] != null)
                    htmlContent += ", Property: " + nodePropertyContext + ": " + node[nodePropertyContext];
                var selection = d3.select(this);
                selection.transition().attr("d", d3.svg.symbol().size(function () {
                    if (nodeMeasureContext != 'default') {
                        return nodeSizeScale(node[nodeMeasureContext]);
                    }
                    return defaultNodeSize * 5;
                }).type(function (node) {
                    return retrieveNodeSymbol(node)
                }));
                selection.append("svg:title").data([htmlContent]).attr('class', 'tooltip').text(function (d) {
                    return d
                });
            }
        })
    };

    // request node info removal
    this.requestNodeInformationRemoval = function (node) {
        d3.selectAll(nodeNotation).each(function (d) {
            if (d.id == node.id) {
                var selection = d3.select(this);
                selection.transition().attr("d", d3.svg.symbol().size(function () {
                    if (nodeMeasureContext != 'default') {
                        return nodeSizeScale(node[nodeMeasureContext]);
                    }
                    return defaultNodeSize;
                }).type(function (node) {
                    return retrieveNodeSymbol(node)
                }));
                selection.selectAll('.tooltip').remove();
            }
        })
    };

    //request a new canvas
    this.requestNewCanvas = function (target) {
        cleanCanvas();
        initializeCanvas(target);
    };

    //request the layout options to be displayed
    this.requestLayoutOptionsMenu = function () {
        showToolBar();
    };

    //removes the focus of all menus
    this.requestMenuFocusRemoval = function () {
        removeMenuFocus();
    };

    //request a menu to be focused
    this.requestFocusMenu = function (menuID) {
        focusMenuElement(menuID);
    };

    //request a global update to the framework
    this.requestUpdate = function (target) {
        cleanCanvas();
        initializeCanvas(target);
        adjustExplorationContext();
        adjustScales();
    };

    //Change Scale factor
    this.requestScaleChange = function (newScale) {
        scale = newScale

    };

    //Change translation
    this.requestTranslation = function (newTranslation) {
        translate = newTranslation;
    };

    //Zoom at runtime externally
    this.requestRuntimeZoom = function (data) {
        gZoom.translate([data.tx, data.ty]).scale(data.s)

    }


}