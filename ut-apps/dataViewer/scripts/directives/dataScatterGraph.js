(function(){"use strict";var t;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},window.google=window.google||{},window.google.visualization=window.google.visualization||{},t=function(){return{restrict:"E",replace:!1,link:function(t,o,a){var e,i,n;return i=o[0],e=new google.visualization.ScatterChart(i),n={},t.$watch("dataSet.changeCounter",function(){var o;return o=t.dataSet.getDataTable(),e.draw(o,n),console.log("updated graph")})}}},window.ut.tools.dataviewer.dataViewerTool.directive("datascattergraph",[t])}).call(this);
//# sourceMappingURL=dataScatterGraph.js.map
