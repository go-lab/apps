(function(){"use strict";var e,t;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},window.google=window.google||{},window.google.visualization=window.google.visualization||{},window.google.visualization.events=window.google.visualization.events||{},t={detailedMessage:""},e=function(e,t){return{restrict:"E",template:'<div class="dataGraphView">\n  <div class=\'chartError\' ng-show="chartErrorMessage">{{chartErrorMessage}}</div>\n  <div class="dataChart"></div>\n</div>',replace:!0,link:function(t,r,a){var o,n,i,s,d,l,g,h,w,u,c;return n=null,l=r.find(".dataChart"),s=l[0],c=new google.visualization.ChartWrapper,t.chartErrorMessage="",t.graphShown=!1,o=function(e){return t.chartErrorMessage=e.message,e.detailedMessage&&(t.chartErrorMessage+="<br/><br/>"+e.detailedMessage),l.empty()},google.visualization.events.addListener(c,"error",o),i=function(){var r,a;return n.isEmpty()?l.empty():(c.setChartType(n.getChartType()),r=angular.copy(n.getChartOptions()),delete r.width,delete r.height,c.setOptions(r),c.setDataTable(n.getDataView()),t.chartErrorMessage="",c.draw(s),t.graphShown=!0,a=function(){if(""===t.chartErrorMessage&&0===l.children().length)return console.warn("trying to fix graph..."),console.log(n),c.setChartType("Table"),c.draw(s),c.setChartType(n.getChartType()),c.draw(s),console.log("draw graph: "+l.children().length)},e(function(){return a()}))},w=function(){return l.hide(),i(),l.show(),i()},g=$(window),h=g.width(),g.on("debouncedresize",function(){var e;if(e=g.width(),h!==e)return w(),h=e}),t.$watch("dataGraphModel",function(e){if(n&&n.removeListener("modelChanged"),n=e)return n.addListener("modelChanged",function(){return i()}),i()}),d=!1,u=t.$watch("graphShown",function(t){if(t&&!d)return u(),d=!0,e(w)})}}},window.ut.tools.dataviewer.dataViewerTool.directive("dataGraphView".toLowerCase(),["$timeout","languageHandler",e])}).call(this);
//# sourceMappingURL=dataGraphView.js.map