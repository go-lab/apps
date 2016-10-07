(function(){"use strict";var t,i,s,r,e,c,o,a,l,u,n;this.golab=this.golab||{},this.golab.common=this.golab.common||{},this.golab.common.resourceLoader=this.golab.common.resourceLoader||{},u=this.golab.common.resourceLoader,o=!1,s={circuitSimulatorLibs:[["font-awesome","/commons/css/commonImages.css","/libs/js/jsonr.js","jquery"],["jquery-ui","bootstrap"],["angular1.5"],["goLabUtils","eventEmitter","/libs/js/jquery.filter_input.js"],["createEnvironmentHandlers","goLabModels"],["collaboration"],["/commons/js/PersistencyUtils.js","/commons/js/utils.js","/commons/js/tsUtils.js","/commons/js/angular/dragAndDrop.js","/commons/js/angular/ngDataStore.js","/commons/js/dataSource.js","/commons/js/dataStore.js"]]},u.addResourceModules(s),r={circuitSimulatorModels:[["scripts/model/meterModels.js"],["scripts/model/powerModels.js"],["scripts/model/circuitLabConfigurationModel.js","scripts/model/resistorValueModels.js","scripts/model/componentModel.js","scripts/model/circuitBoardModel.js","scripts/model/circuitSimulatorActionLogger.js","scripts/model/circuitStoreModel.js","scripts/model/calculations/links.js"],["scripts/model/calculations/graphs.js","scripts/model/calculations/connections.js","scripts/model/calculations/createGraph.js","scripts/model/calculations/graphBuilder.js","scripts/model/calculations/createBiDirectionalGraph.js","scripts/model/calculations/biDirectionalGraphSplitter.js","scripts/model/calculations/createDirectedGraph.js","scripts/model/calculations/createDirectedGraph2.js","scripts/model/calculations/circuitCalculator.js","scripts/model/calculations/circuitSimulator.js"]]},u.addResourceModules(r,"/labs/ngElectricity/src/main/webapp/"),t={circuitSimulatorControllers:[["scripts/controllers/boxCtrls.js","scripts/controllers/circuitBoardCtrl.js","scripts/controllers/circuitStoreCtrl.js","scripts/controllers/circuitTester.js"]]},u.addResourceModules(t,"/labs/ngElectricity/src/main/webapp/"),i={circuitSimulatorDirectives:[["scripts/directives/component.js","scripts/directives/resistorValues.js","scripts/directives/lightBulb.js","scripts/directives/editSelection.js","scripts/directives/meter.js","scripts/directives/power.js","scripts/directives/circuitBoard.js","scripts/directives/componentList.js","scripts/directives/meterList.js","scripts/directives/circuits.js","scripts/directives/testCircuits.js","scripts/directives/circuitLabConfigurationOptions.js","scripts/directives/configurationOptions.js"]]},u.addResourceModules(i,"/labs/ngElectricity/src/main/webapp/"),e={circuitSimulatorScripts:[["styles/electricity.css","styles/component.css","styles/editResistors.css","styles/meters.css","styles/circuitTester.css","scripts/predefinedCircuits.js","scripts/labConfigurations.js"]],circuitSimulatorTestCircuits:[["scripts/testCircuits.js","scripts/testUtils.js"]]},u.addResourceModules(e,"/labs/ngElectricity/src/main/webapp/"),u.addResourceModules({circuitSimulatorMain:[["scripts/circuitSimulator.js"]]},"/labs/ngElectricity/src/main/webapp/"),u.addResourceModules({circuitSimulator:[["dataViewer"],["circuitSimulatorLibs","circuitSimulatorMain"],["circuitSimulatorModels","circuitSimulatorControllers","circuitSimulatorDirectives","circuitSimulatorScripts"]]}),this.ut=this.ut||{},this.ut.simulations=this.ut.simulations||{},this.ut.simulations.electricity=this.ut.simulations.electricity||{},this.ut.simulations.electricity.circuits=this.ut.simulations.electricity.circuits||{},a=this.ut.simulations.electricity,c=this.ut.simulations.electricity.circuits,l=[["circuitSimulator"]],n=function(t,i){var s,r,e,c;return golab.activeTool="circuitLab",r=function(){return a.electricityLabDependencies=["LocalStorageModule","golabUtils","textAngular","dynamicNumber"],t&&a.electricityLabDependencies.push("dataViewerTool"),u.setToolName("circuitLab"),i&&l[0].push("circuitSimulatorTestCircuits"),u.orderedLoad(l),u.ready(function(){return window.golab.common.createEnvironmentHandlers(["circuit","dataGraph","dataSet","configuration"],"circuitLab",u.getDesiredLanguage(),{notificationServer:null},function(t){return ut.simulations.electricity.environmentHandlers=t,t.dataSet.metadataHandler.getGenerator().displayName="circuitLab",t.dataSet.metadataHandler.setTargetDisplayName("unnamed data set"),angular.bootstrap(document.body,["circuitLab"])})})},c=function(){return"undefined"!=typeof gadgets?(o&&console.log("loadAndStartCircuitSimulator through gadgets.util"),gadgets.util.registerOnLoadHandler(r)):(o&&console.log("direct loadAndStartCircuitSimulator"),r())},t?(s=window.google,s.setOnLoadCallback(c),o&&console.log("loading google visualisation....."),e={packages:["corechart","table","charteditor"]},{language:u.getDesiredLanguage()},s.load("visualization","1",e)):c()},a.startCircuitSimulator=function(t,i){return null==i&&(i=!1),n(t,i)}}).call(this);
//# sourceMappingURL=circuitSimulatorModule.js.map