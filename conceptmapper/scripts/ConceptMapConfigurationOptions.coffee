"use strict"

window.ut = window.ut || {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}
ut.commons = ut.commons || {}
ut.commons.utils = ut.commons.utils || {}

inputTable = (conceptMapModel, configurationModel)->
  {
  restrict: "E"
  template: """
            <configurationSection label="i_ut_tools_conceptmap_configuration_title">

              <!--
              <div class="row evenColumnBackground">
                <div class="col-md-4" g4i18n="ut_tools_conceptmap_configuration_combobox"></div>
                <div class="col-md-2"><input type="checkbox" ng-model="configurationModel.combobox_concepts"/></div>
                <div class="col-md-4" g4i18n="ut_tools_conceptmap_configuration_textarea"></div>
                <div class="col-md-2"><input type="checkbox" ng-model="configurationModel.textarea_concepts"/></div>
              </div>
              -->

              <div class="row oddColumnBackground">
                <div class="col-md-6">
                  <nameListEditor nameList="configurationModel.concepts" label="ut_tools_conceptmap_configuration_concepts"></nameListEditor>
                </div>
                <div class="col-md-6">
                  <nameListEditor nameList="configurationModel.relations" label="ut_tools_conceptmap_configuration_relations"></nameListEditor>
                </div>
              </div>
            </configurationSection
            """
  replace: false
  link: (scope, element, attrs)->
    scope.configurationModel = configurationModel
    scope.conceptMapModel = conceptMapModel
  }

window.ut.tools.conceptmapper.ConceptMapAngularApp.directive("conceptMapConfigurationOptions".toLowerCase(), ["conceptMapModel", "configurationModel", inputTable])
