(function(){"use strict";var e,t;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},t={commonsImagesDataSourcesPath:""},e=function(e){return{restrict:"E",template:'<div droppable class="graphAxeDropZone">\n  <div ng-repeat="dataSourceColumn in dataSourceColumns" class="dataSourceColumn" align="center">\n    <dataSourceColumn draggable objectType="dataSourceColumn" objectId="{{dataSourceColumn.getId()}}" helper="clone"></dataSourceColumn>\n  </div>\n</div>',replace:!0,scope:!0,link:function(t,o,a){var n,u,r,d;return n=e.getDataGraphActionlogger(),t.imageUrl=ut.commons.utils.commonsImagesDataSourcesPath+ut.commons.utils.getAttributeValue(a,"image"),d="true"===ut.commons.utils.getAttributeValue(a,"xAxis",!1),t.xAxis=d,r=function(){return t.dataSourceColumns=d?e.getXDataSourceColumns():e.getYDataSourceColumns()},u=d?"xAxisColumnIdChanged":"yAxisColumnIdsChanged",e.addListener(u,function(){return r()}),t.acceptObjectDrop=function(e,t){return"dataSourceColumn"===e.dropObjectType},t.objectDroppedInside=function(t,o){return o.remove(),d?(e.setXAxisColumnId(t.dropObjectId),n.logChartXAxisColumnChanged(e)):(e.addYAxisColumnId(t.dropObjectId),n.logChartYAxisColumnChanged(e))},t.objectDroppedOutside=function(t,o){return o.remove(),d?(e.setXAxisColumnId(""),n.logChartXAxisColumnChanged(e)):(e.removeYAxisColumnId(t.dropObjectId),n.logChartYAxisColumnChanged(e))}}}},window.ut.tools.dataviewer.dataViewerTool.directive("axisdatasourcecolumns",["dataGraphModel",e])}).call(this);
//# sourceMappingURL=axisDataSourceColumns.js.map