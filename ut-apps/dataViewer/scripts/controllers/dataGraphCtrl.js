(function(){"use strict";var t,a,e,o,r;window.ut=window.ut||{},ut.commons=ut.commons||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},window.google=window.google||{},window.google.visualization=window.google.visualization||{},t=window.JSONR||{},o=function(t,a){var e,o,r,n,u;for(n=[],o=0,u=a.length;o<u;o++)e=a[o],r=t.getDataSourceColumns().indexOf(e),n.push(r);return n},r=function(t,a){var e;return e=t.indexOf(a),e>=0&&(t.splice(e,1),!0)},e={dropTargetType:""},a=function(t,a){var e;return t.dataSourcesMarker={counter:0},t.dataSet=a,t.xDataSources=[],t.yDataSources=[],t.chartTypes=t.chartTypes=["BarChart","ColumnChart","ScatterChart","LineChart","AreaChart","Table"],t.selectedChartType=t.chartTypes[0],e=function(){var a,e,r;return t.dataView=new google.visualization.DataView(t.dataSet.getDataTable()),e=o(t.dataSet,t.xDataSources),r=o(t.dataSet,t.yDataSources),a=e.concat(r),t.dataView.setColumns(a)},t.$watch("dataSourcesMarker.counter",e),t.dataSet.addListeners(["newDataSet","modelCleared","modelLoaded"],function(){return t.xDataSources.splice(0,t.xDataSources.length),t.yDataSources.splice(0,t.yDataSources.length),e()}),t.dataSet.addListener("removedDataSourceColumn",function(a){if(r(t.xDataSources,a)||r(t.yDataSources,a))return e()}),t.dataSet.addListener("addedDataRow",function(){return e()})},ut.tools.dataviewer.dataViewerTool.controller("dataGraphCtrl",["$scope","dataSetModel",a])}).call(this);
//# sourceMappingURL=dataGraphCtrl.js.map
