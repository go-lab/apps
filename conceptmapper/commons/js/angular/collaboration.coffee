"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

collaborationButton = (configurationModel, actionLogger, resourceLoader) ->
  {
    restrict: "E"
    template: """
<li ng-show="showStartCollaboration">
  <i class="fa fa-users fa-fw activeButton fontAweSomeButton" ng-click='startCollaboration()'
    title="{{'collaboration.start.tooltip' | g4i18n}}"></i>
</li>
"""
    replace: true
    link: (scope, element, attrs)->
      scope.showStartCollaboration = false
      if (resourceLoader.isProductionVersion())
        return
      getModelFromScope = (attributeName) ->
        scopeModelName = attrs[attributeName.toLowerCase()]
        if (typeof scopeModelName != "string" || scopeModelName == "")
          console.error("you must define an attribute '#{attributeName}'")
          return null
        model = scope[scopeModelName]
        if (!model)
          console.error("expected to find a model class object on the scope, named #{scopeModelName}")
          return null
        if (!model instanceof window.ut.commons.ResourceEventEmitterModel)
          console.error("expected to find a model class object on the scope, named #{scopeModelName}, which must be an instance of window.ut.commons.ResourceEventEmitterModel")
          return null
        model

      model = getModelFromScope("modelName")
      if (model == null)
        return

      updateStateFromModel = ->
        scope.showStartCollaboration = configurationModel.collaborationStartup == "manualStart"
#        console.log("scope.showStartCollaboration: #{scope.showStartCollaboration}")

      configurationModel.addListeners(["modelChanged"], updateStateFromModel)
      updateStateFromModel()

      collaborationStarted = false
      startCollaboration = ->
        if (!collaborationStarted)
          console.log("starting TogetherJS collaboration....")
          new window.ut.commons.TogetherClient(model, model.getMetadataHandler(), actionLogger)
          object = {
            objectType: "collaboration"
          }
          actionLogger.logStart(object)
          collaborationStarted = true

      scope.startCollaboration = ->
#        console.log("collaboration should started....")
        startCollaboration()

      autoStartCollaborationCheck = ->
        if (configurationModel.collaborationStartup == "autoStart")
          startCollaboration()
#        else
#          console.log("no auto start collaboration: #{configurationModel.collaborationStartup}")

      if (scope.golab.startupFinished)
        autoStartCollaborationCheck()
      else
        unwatchStartupFinished = scope.$watch("golab.startupFinished", (value)->
          if (value)
            unwatchStartupFinished()
            autoStartCollaborationCheck()
        )
#        console.log("setup watch for startupFinished: #{model.startupFinished}")
  }

ut.commons.golabUtils.directive("collaboration".toLowerCase(), ["configurationModel", "actionLogger",
  "resourceLoader", collaborationButton])
