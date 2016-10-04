(function(){"use strict";var t,o;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},o={},t=function(){return{restrict:"E",template:'<table width="100%" border="0" ng-show="dataSetResourceDescription.title">\n    <tr>\n        <td rowspan="99" valign="top" width="1%">\n            <i class="fa fa-fw fontAweSomeButtonSmall"\n               ng-class="{\'fa-plus-square-o\':!showMoreInfo, \'fa-minus-square-o\': showMoreInfo }"\n               ng-click=\'showHideMoreInfo()\'></i>\n        </td>\n        <td valign="top">{{dataSetResourceDescription.title}}</td>\n        <td rowspan="99" valign="top" width="1%">\n            <i class="fa fa-trash-o fa-fw activeButton fontAweSomeButtonSmall"\n               ng-click=\'clearDataSet()\'></i>\n        </td>\n    </tr>\n    <tr ng-show="showMoreInfo">\n        <td valign="top">{{dataSetResourceDescription.tool}}</td>\n    </tr>\n    <tr ng-show="showMoreInfo">\n        <td valign="top">{{dataSetResourceDescription.modified | date:"medium"}}</td>\n    </tr>\n    <tr ng-show="showMoreInfo">\n        <td valign="top">{{ \'dataSet.rows\' | g4i18n:dataSet.getNrOfDataRows()}}</td>\n    </tr>\n</table>',replace:!0,link:function(t,o,n){}}},window.ut.tools.dataviewer.dataViewerTool.directive("datasetdescription",[t])}).call(this);
//# sourceMappingURL=dataSetDescription.js.map
