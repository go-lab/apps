(function(){"use strict";var o,t;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},ut.commons=ut.commons||{},ut.commons.persistency=ut.commons.persistency||{},ut.commons.actionlogging=ut.commons.actionlogging||{},window.golab=window.golab||{},window.golab.ils=window.golab.ils||{},window.golab.ils.storage=window.golab.ils.storage||{},o=window.angular,t={languageHandler:{}},ut.tools.dataviewer.dataEditorTool=o.module("dataEditorTool",["dataTool","LocalStorageModule","textAngular","golabUtils","smartTable.table","ui.bootstrap"]),ut.tools.dataviewer.dataEditorTool.run(["$rootScope","dataSetModel","actionLogger","configurationModel","configurationExampleStore","errorHandler","dataToolRunning","resourceLoader",function(o,t,a,e,n,r,i,l){var d,u;return o.configurationModel=e,o.configurationExampleStore=n,i?(t.mainModelClass=!0,t.getStorageHandler().setForAppIdFilter(!1)):t.mainModelClass=!1,d=!0,d&&!l.isProductionVersion()&&(u=new window.ut.commons.actionlogging.LoggingModelVerifier(t),u.setErrorHandler(r),a.setLoggingTarget("consoleObject")),a.logApplicationStarted()}]),ut.tools.dataviewer.dataEditorTool.factory("configurationModel",["environmentHandlers",function(o){var t;return t=new ut.tools.dataviewer.DataEditorConfigurationModel(o)}]),ut.tools.dataviewer.dataEditorTool.factory("configurationExampleStore",[function(){return window.dataViewerExampleConfigurationStore}]),ut.tools.dataviewer.dataEditorTool.factory("dataSetStore",[function(){return window.dataSetStore}]),ut.tools.dataviewer.dataEditorTool.factory("actionLogger",["environmentHandlers",function(o){return o.dataSet.actionLogger}])}).call(this);
//# sourceMappingURL=dataEditorTool.js.map
