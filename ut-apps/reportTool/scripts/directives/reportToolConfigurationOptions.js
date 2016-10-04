"use strict";var ut;!function(e){var a;!function(e){var a;!function(e){function a(e,a,o){return{restrict:"E",template:'\n<configurationSection label="i_reportingTool.configuration.reportingTool">\n  <div class="row reportingToolOptions">\n    <div class="col-md-6">\n      <nameListEditor nameList="configurationModel.reportSectionConfigurations" label="reportingTool.configuration.reportSections"></nameListEditor>\n    </div>\n    <div class="col-md-6">\n      <div class=\'configurationOptionTitleReplacer\'>&nbsp;</div>\n      <reportSectionConfigurationOptions></reportSectionConfigurationOptions>\n    </div>\n  </div>\n  <div class="row configurationOptionTitle">\n    <div class="col-md-12" g4i18n="reportingTool.configuration.allowedParagraphTypes"></div>\n  </div>\n        <div class="row allowedParagraphTypes">\n            <div class="col-md-2" ng-repeat="paragraphType in paragraphTypes">\n                <selectableParagraphType></selectableParagraphType>\n            </div>\n        </div>\n  </div>\n</configurationSection>\n',replace:!1,link:function(n,r,t){function i(){var e=l.height();e>0?c.height(e+7):o(i,500)}var p=n;p.configurationModel=a,p.reportModel=e,p.selectedReportSectionIndex=-1,p.selectedIndexChanged=function(e){p.selectedReportSectionIndex=e},p.paragraphTypes=a.availableParagraphTypes;var l=r.find(".configurationOptionTitle"),c=r.find(".configurationOptionTitleReplacer");o(i,500)}}}function o(a,o){return{restrict:"E",template:'\n<div class="selectableParagraphType">\n    <paragraphType class="activeButton" ng-class="{pressedButton: selected}" ng-click=\'toggleSelected()\'></paragraphType>\n    <div class="paragraphTypeName">{{paragraphTypeTitle}}</div>\n</div>\n',replace:!0,link:function(n,r,t){var i=n,p=i.paragraphType;i.selected=a.getParagraphTypeAvailable(p),i.toggleSelected=function(){i.selected=!i.selected,a.setParagraphTypeAvailable(p,i.selected)},a.addListeners(["availabilityParagraphTypesChanged","modelLoaded"],function(){i.selected=a.getParagraphTypeAvailable(p)});var l=e.ParagraphType[i.paragraphType];i.paragraphTypeTitle=o.getMessage("reportingTool.paragraph.types."+l)}}}e.reportingTool.directive("reportToolConfigurationOptions".toLowerCase(),["reportModel","configurationModel","$timeout",a]),e.reportingTool.directive("selectableParagraphType".toLowerCase(),["configurationModel","languageHandler",o])}(a=e.reportingtool||(e.reportingtool={}))}(a=e.tools||(e.tools={}))}(ut||(ut={}));
//# sourceMappingURL=reportToolConfigurationOptions.js.map