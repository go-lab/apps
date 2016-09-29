(function(cmDashboard) {
    cmDashboard.Interaction = Interaction;

    function Interaction() {
        // Input Content

        var graph = cmDashboard.graph;

        var button_resetView = $('.reset');
        var button_popups = $(".popups");
        var button_edges = $(".edges");
        var button_directions = $('.arrowheads');
        var button_edgeLabels = $('.edgelabels');
        var button_hierarchical = $('.scale-y');

        button_resetView.on("click touch", function() {
            graph.resetView();
        });

        button_popups.on("click touch", function() {
            graph.togglePopUps(function(isActive) {
                isActive ? button_popups.addClass("active") : button_popups.removeClass("active");
            });
        });

        button_edges.on("click touch", function () {
            graph.toggleEdges(function(isVisible){
                isVisible ? button_edges.addClass("active") : button_edges.removeClass("active");

                if(isVisible){
                    button_directions.removeClass("disabled");
                    button_edgeLabels.removeClass("disabled");
                } else {
                    button_directions.addClass("disabled");
                    button_edgeLabels.addClass("disabled");
                }
            });
        });

        button_directions.on("click touch", function() {
            graph.toggleArrowHeads(function(isVisible) {
                isVisible ? button_directions.addClass("active") : button_directions.removeClass("active");
            });
        });

        button_edgeLabels.on("click touch", function() {
            graph.toggleEdgeLabels(function(isVisible){
                isVisible ? button_edgeLabels.addClass("active") : button_edgeLabels.removeClass("active");
            });
        });

        button_hierarchical.on("click touch", function() {
            graph.toggleHierarchicalView(function(isHierarchical){
                isHierarchical ? button_hierarchical.addClass("active") : button_hierarchical.removeClass("active");
            });
        });



    }
})(golab.tools.cmDashboard);