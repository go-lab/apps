"use strict";var ut;!function(e){var o;!function(e){var o;!function(e){function o(e,o,a){return{restrict:"E",template:'\n<div class=\'loadResource\'>\n   <i class="fa fa-folder-open-o fa-fw activeButton fontAweSomeButton faEditButton" ng-click=\'askForResource()\'\n      title="{{openTooltip}}"></i>\n  <dialogBox id="{{loadResourceDialogId}}" title="{{loadResourceDialogTitle}}" icon="folder-open-o" resizable="false" width="500"\n          Xheight="400">\n   <resourceSelection resourceType="{{resourceType}}" storageHandler="" g4i18nbasekey="loadSave.loadDialog"></resourceSelection>\n  </dialogBox>\n\n</div>\n',replace:!1,link:function(o,t,l){var n=o,i=r++,s="loadResourceBox"+i;n.loadResourceDialogId=s,n.resourceType=n.reportParagraph.resourceType;var c=a.getMessage("resources.type.name."+n.resourceType);n.loadResourceDialogTitle=a.getMessage("reportingTool.includeDialog.title",c),n.openTooltip=a.getMessage("reportingTool.include.tooltip",c),n.askForResource=function(){n.storageHandler=n.reportParagraph.resource.getStorageHandler(),n.storageHandler.setForAppIdFilter(!1),n.dialogBoxes[s].show(),n.loadResource=function(o){console.log(o),n.dialogBoxes[s].close();var r=n.reportParagraph;r.loadResource(o),e.reportActionLogger.logResourceLoaded(n.reportParagraph)},n.cancel=function(){n.dialogBoxes[s].close()}}}}}var r=0;e.reportingTool.directive("loadResource".toLowerCase(),["reportModel","configurationModel","languageHandler",o])}(o=e.reportingtool||(e.reportingtool={}))}(o=e.tools||(e.tools={}))}(ut||(ut={}));
//# sourceMappingURL=loadResource.js.map