"use strict";var ut;!function(t){var o;!function(t){var o;!function(t){function o(t,o,e){return{restrict:"E",template:"\n<div class='reportSectionConfigurationOptions'>\n  <div class='row titleRow'>\n    <div class='col-md-12' g4i18n='reportingTool.configuration.explanation'></div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <text-angular class=\"htmlEditor sectionExplanationEditor\" ng-model=\"reportSection.explanation\" ta-disabled='!reportSection'\n         ta-toolbar=\""+n+"\" ng-blur='textBlurred()'></text-angular>\n    </div>\n  </div>\n</div>\n",replace:!1,link:function(t,n,e){var i=t,r=function(){i.selectedReportSectionIndex>=0?i.reportSection=o.getReportSectionConfiguration(i.selectedReportSectionIndex):i.reportSection=null};r(),t.$watch("selectedReportSectionIndex",r),o.addListeners(["modelLoaded","reportSectionConfigurationsRemoved"],r)}}}var n="[['bold','italics','underline'],['ul','ol','indent','outdent']]";t.reportingTool.directive("reportSectionConfigurationOptions".toLowerCase(),["reportModel","configurationModel","languageHandler",o])}(o=t.reportingtool||(t.reportingtool={}))}(o=t.tools||(t.tools={}))}(ut||(ut={}));
//# sourceMappingURL=reportSectionConfigurationOptions.js.map