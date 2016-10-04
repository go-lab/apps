(function(){"use strict";var t,e;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},window.google=window.google||{},window.google.visualization=window.google.visualization||{},window.google.visualization.events=window.google.visualization.events||{},e={detailedMessage:"",series:null},t=function(t,e,a){return{restrict:"E",template:'<div>\n  <table border="0" width="100%">\n    <tr>\n      <td valign=\'top\' width="5%">\n        <axisDataSourceColumns image="yAxis.png" xAxis="false" class="yAxeDropZone"\n          title="{{\'dataGraph.dropArea.yAxis.tooltip\' | g4i18n}}"></axisDataSourceColumns>\n      </td>\n      <td style="width: 5px; min-width: 5px; max-width: 5px;"></td>\n      <td valign=\'top\'>\n        <div class="dataGraphView">\n          <div class=\'actionSuggestion\' ng-show="actionSuggestion">{{actionSuggestion}}</div>\n          <div class=\'chartError\' ng-show="chartErrorMessage">{{chartErrorMessage}}</div>\n          <div class="dataChart"></div>\n        </div>\n      </td>\n    </tr>\n  </table>\n  <table border="0" width="100%">\n    <tr>\n      <td Xvalign=\'top\'>\n        <select ng-model="selectedChartTypeName" ng-options="chartTypeName for chartTypeName in chartTypeNames"\n          title="{{\'dataGraph.chartType.tooltip\' | g4i18n}}">\n      </td>\n      <td width="5"></td>\n      <td valign=\'top\' width="80%">\n        <axisDataSourceColumns image="xAxis.png" xAxis="true" class="xAxeDropZone"\n          title="{{\'dataGraph.dropArea.xAxis.tooltip\' | g4i18n}}"></axisDataSourceColumns>\n      </td>\n    </tr>\n  </table>\n</div>',replace:!0,link:function(r,n,i){var o,s,g,d,l,u,h,c,p,w,v,C,f,y,T,m,x,S;return d=a.getDataGraphActionlogger(),c=n.find(".dataChart"),h=c[0],s={},g={},x=function(){var t,n;return s={},g={},r.chartTypeNames=function(){var r,i,o,d;for(o=a.getChartTypes(),d=[],r=0,i=o.length;r<i;r++)t=o[r],n=e.getMessage("dataGraph.graphType."+t),s[n]=t,g[t]=n,d.push(n);return d}()},x(),u=function(t){var a;return g[t]?g[t]:(a=e.getMessage("dataGraph.graphType."+t),a?(s[a]=t,g[t]=a,a):"???")},C="",r.$watch("selectedChartTypeName",function(t){var e,r;if(r=s[t],r!==a.getChartType())return a.setChartType(s[t]),e=a.getChartOptions(),e.series&&(delete e.series,a.setChartOptions(e)),d.logChartTypeChanged(a)}),m=function(){return r.selectedChartTypeName=u(a.getChartType())},m(),S=new google.visualization.ChartWrapper,r.chartErrorMessage="",o=function(t){return console.warn("chart error: "+JSON.stringify(t)),r.chartErrorMessage=t.message,t.detailedMessage&&(r.chartErrorMessage+="<br/><br/>"+t.detailedMessage),c.empty(),d.logChartError(a,t)},google.visualization.events.addListener(S,"error",o),r.actionSuggestion="",y=function(){return r.actionSuggestion="",0===a.getDataSet().getNrOfDataSourceColumns()?r.actionSuggestion=e.getMessage("dataSet.suggestion.loadDataSet"):0===a.getDataView().getNumberOfColumns()?r.actionSuggestion=e.getMessage("dataGraph.suggestion.addVariables"):void 0},l=function(){var e,n;return r.chartErrorMessage="",y(),r.actionSuggestion.length>0?c.empty():(S.setChartType(a.getChartType()),e=angular.copy(a.getChartOptions()),delete e.width,delete e.height,S.setOptions(e),S.setDataTable(a.getDataView()),S.draw(h),n=function(){if(""===r.chartErrorMessage&&0===c.children().length)return console.warn("trying to fix graph..."),console.log(a),S.setChartType("Table"),S.draw(h),S.setChartType(a.getChartType()),S.draw(h),console.log("draw graph: "+c.children().length)},t(function(){return n()}))},T=function(){return v()},a.addListener("chartTypesChanged",function(){return x()}),a.addListener("chartTypeChanged",function(){return m()}),a.addListener("modelChanged",function(){return T()}),v=function(){return c.hide(),l(),c.show(),l()},p=$(window),w=p.width(),p.on("debouncedresize",function(){var t;if(t=p.width(),w!==t)return v(),w=t}),f=r.$watch("golab.startupFinished",function(e){if(e)return f(),v(),t(v)}),r.functions.editChart=function(){var t,e;return t=new google.visualization.ChartEditor,e=function(){var e;return e=t.getChartWrapper(),a.setChartOptions(e.getOptions()),a.setChartType(e.getChartType()),l(),r.$apply(),d.logChartEdited(a)},google.visualization.events.addListener(t,"ok",e),t.openDialog(S,{})}}}},window.ut.tools.dataviewer.dataViewerTool.directive("dataGraph".toLowerCase(),["$timeout","languageHandler","dataGraphModel",t])}).call(this);
//# sourceMappingURL=dataGraph.js.map