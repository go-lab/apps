(function(){"use strict";var a,t;window.ut=window.ut||{},ut.commons=ut.commons||{},ut.tools=ut.tools||{},ut.tools.conclusions=ut.tools.conclusions||{},a=0,t=function(t){return{restrict:"E",template:'<span class="dataThumbnail" ng-dblclick=\'showDataDetails()\'>\n  {{data.getPublished() | date : dateTimeFormat}}\n  <dataGraphView></dataGraphView>\n  {{data.getDisplayName()}}\n  <dialogBox id="{{dataDetailsDialogBoxId}}" title="{{dataDetailsDialogTitle}}" resizable="false" width="600">\n    <dataDetailed></dataDetailed>\n    <div class="dialogButtonRow">\n      <toolbar>\n        <li>\n           <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton" ng-click=\'cancel()\'\n             title="{{\'editConfiguration.close\' | g4i18n}}"></i>\n        </li>\n      </toolbar>\n    </div>\n  </dialogBox>\n</span>',replace:!0,link:function(o,i,l){var n,e;return o.graphShown=!1,o.dataGraphModel=o.data,e=a++,n="dataDetailsDialogBox"+e,o.dataDetailsDialogBoxId=n,o.dataDetailsDialogTitle=t.getMessage("conclusions.dataDetails.dialogTitle",o.data.getDisplayName()),o.showDataDetails=function(){return o.graphShown=!0,o.dialogBoxes[n].show()},o.cancel=function(){return o.graphShown=!1,o.dialogBoxes[n].close()}}}},ut.tools.conclusions.conclusionTool.directive("dataThumbnail".toLowerCase(),["languageHandler",t])}).call(this);
//# sourceMappingURL=dataThumbnail.js.map