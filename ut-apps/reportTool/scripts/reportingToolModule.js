"use strict";var ut;!function(o){var r;!function(o){var r;!function(o){var r=!1,s=golab.common.resourceLoader,e={reportingToolLibs:[["font-awesome","/libs/js/jsonr.js","jquery"],["jquery-ui","bootstrap"],["angular1.5"],["goLabUtils","eventEmitter","/libs/js/jquery.filter_input.js","/libs/js/angular/elastic.js","/libs/js/angular/angular-ui-sortable.js"],["createEnvironmentHandlers","goLabModels","/commons/js/multiResourceEventEmitterModel.js"],["collaboration"],["/commons/js/PersistencyUtils.js","/commons/js/utils.js","/commons/js/tsUtils.js","/commons/js/angular/dragAndDrop.js","/commons/js/angular/ngDataStore.js","/commons/js/dataSource.js","/commons/js/dataStore.js","/commons/js/undoRedoManager.js","textAngular1.5"]]};s.addResourceModules(e);var t={reportingToolScripts:[["styles/reportingTool.css","scripts/reportingTool.js"],["scripts/controllers/reportingToolCtrl.js","scripts/directives/report.js","scripts/directives/reportSection.js","scripts/directives/reportParagraph.js","scripts/directives/textParagraph.js","scripts/directives/dataGraphParagraph.js","scripts/directives/loadResource.js","scripts/directives/observationParagraph.js","scripts/directives/imageParagraph.js","scripts/directives/hypothesisParagraph.js","scripts/directives/questionParagraph.js","scripts/directives/conceptMapParagraph.js","scripts/directives/tableParagraph.js","scripts/directives/loadThing.js","scripts/directives/paragraphType.js","scripts/directives/editModeButton.js","scripts/directives/floatingToolbar.js","scripts/directives/paragraphTypesToolbar.js","scripts/directives/reportToolConfigurationOptions.js","scripts/directives/reportSectionConfigurationOptions.js","scripts/directives/printButton.js","scripts/model/reportToolConfigurationModel.js","scripts/model/reportParagraphFactory.js"],["scripts/model/reportParagraphs.js","scripts/model/ReportSection.js","scripts/model/ReportModel.js","scripts/model/ReportActionLogger.js","scripts/reportConfigurations.js"]]};s.addResourceModules(t,"/tools/reportingTool/src/main/webapp/"),s.addResourceModules({reportingTool:[["dataViewer","observationTool","hypothesisApp","questioningApp","conceptmapper","tableTool"],["reportingToolLibs"],["reportingToolScripts"]]});var i=[["reportingTool"]];o.environmentHandlers={},o.startReportingTool=function(){function e(){"undefined"!=typeof window.gadgets?(r&&console.log("loadAndStartReportingTool through gadgets.util"),window.gadgets.util.registerOnLoadHandler(t)):(r&&console.log("direct loadAndStartReportingTool"),t())}var t=function(){s.orderedLoad(i),s.ready(function(){golab.common.createEnvironmentHandlers(["report","configuration","dataSet","dataGraph","observations","hypotheses","questions","conceptMap","table"],"reportingTool",s.getDesiredLanguage(),{},function(r){o.environmentHandlers=r,golab.ils.storage.utils.loadPreviewResources(o.environmentHandlers.report.metadataHandler,o.environmentHandlers.report.storageHandler,r.languageHandler,golab.common.resourceLoader.getIncludeUrl("/reportToolPreviewResources.json"),function(){angular.bootstrap(document.body,["reportingTool"])},!0)})})};google.setOnLoadCallback(e),r&&console.log("loading google visualisation.....");var a={packages:["corechart","table"],language:s.getDesiredLanguage()};google.load("visualization","1",a)}}(r=o.reportingtool||(o.reportingtool={}))}(r=o.tools||(o.tools={}))}(ut||(ut={}));
//# sourceMappingURL=reportingToolModule.js.map