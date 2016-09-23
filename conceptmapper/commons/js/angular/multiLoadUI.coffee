"use strict";

window.ut = window.ut or {}
ut.commons = ut.commons || {}

debug = false
#debug = true

counter = 0

autoRefreshMillis = 250

listTemplate = """
<span>
  <div class="busyWithResources" ng-show="busyWithResources"></div>
  <ul class="toolbarPart">
      <li ng-show="showRefresh">
          <i class="fa fa-refresh fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: !canRefresh()}"
             ng-click='refreshContent()' title="{{'multiLoadSave.refresh.tooltip' | g4i18n}}"></i>
      </li>
      <li ng-show="showUndoRedo">
          <i class="fa fa-undo fa-fw activeButton fontAweSomeButton"  ng-class="{disabledButton: !undoRedoManager.canUndo}"
             ng-click='undo()' title="{{'multiLoadSave.undo.tooltip' | g4i18n}}"></i>
      </li>
      <li ng-show="showUndoRedo">
          <i class="fa fa-rotate-right fa-fw activeButton fontAweSomeButton"  ng-class="{disabledButton: !undoRedoManager.canRedo}"
             ng-click='redo()' title="{{'multiLoadSave.redo.tooltip' | g4i18n}}"></i>
      </li>
      <li ng-show="showModelJson">
          <i class="fa fa-eye fa-fw activeButton fontAweSomeButton"
             ng-click='showModelJsonDialog()' title="{{'loadSave.showModelJson' | g4i18n}}"></i>
      </li>
  </ul>
  <dialogBox id="{{showModelJsonDialogId}}" title="{{showModelJsonDialogTitle}}" resizable="false" width="670">
    <div class="modelJsonDialog">
      <textarea ng-model="model.json" class="modelJson"></textarea>
      <div class="dialogButtonRow">
        <ul class="toolbar">
          <li>
             <i class="fa fa-refresh fa-fw activeButton fontAweSomeButton dialogButton" ng-click='updateModelJson()'
              title="{{'loadSave.showModelJsonDialog.refresh' | g4i18n}}"></i>
          </li>
          <li>
             <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton"
               ng-click='closeShowModelJsonDialog()' title="{{'loadSave.showModelJsonDialog.close' | g4i18n}}"></i>
          </li>
        </ul>
      </div>
    </div>
  </dialogBox>
</span>

"""

multiLoadDirective = (languageHandler, fileStorage, localStorageService, configurationModel, leavePageDetector,
                     Notification, errorHandler, $timeout, $interval) ->
  {
  restrict: "E"
  template: listTemplate
  replace: true
  scope: true
  link: (scope, element, attrs)->
    scope.busyWithResources = false
    id = counter++
    showModelJsonDialogId = "multiShowModelJsonBox#{id}"
    scope.showModelJsonDialogId = showModelJsonDialogId
    scopeModelName = attrs["modelname"]
    if (typeof scopeModelName != "string" || scopeModelName == "")
      console.error("you must define an attribute 'modelName'")
      return
    model = scope[scopeModelName]
    if (!model)
      console.error("expected to find a model class object on the scope, named #{scopeModelName}")
      return
    if (!model instanceof window.ut.commons.ResourceEventEmitterModel)
      console.error("expected to find a model class object on the scope, named #{scopeModelName}, which must be an instance of window.ut.commons.ResourceEventEmitterModel")
      return
    if (!model instanceof window.ut.commons.MultiResourceEventEmitterModel)
      console.error("expected to find a model class object on the scope, named #{scopeModelName}, which must be an instance of window.ut.commons.MultiResourceEventEmitterModel")
      return
    modelIsConfiguration = model.getResourceType()=="configuration"
    undoRedoManager = null
    if (!modelIsConfiguration)
      if (model.isChangeTrackingFullyImplemented())
        undoRedoManager = new window.ut.commons.UndoRedoManager(model)
        scope.undoRedoManager = undoRedoManager

    debugLabel = "multiLoadSaveUI(#{model.getResourceType()}):"

    if (debug)
      console.log("#{debugLabel} start: resourceType: #{model.getResourceType()}, modelIsConfiguration: #{modelIsConfiguration}")

    updateShows = ->
      scope.showRefresh = ut.commons.utils.getBooleanAttributeValue(attrs, "refresh", !configurationModel.autoSave)
      scope.showModelJson = ut.commons.utils.getBooleanAttributeValue(attrs, "modelJson", configurationModel.getShowModelJson())
      scope.showUndoRedo = undoRedoManager && model.isChangeTrackingFullyImplemented() && ut.commons.utils.getBooleanAttributeValue(attrs, "undoRedo", false)
      #      console.log("updated shows, scope.showImExport: #{scope.showImExport}")
      # update shows might change the height of the gadget
      $timeout(ut.commons.utils.gadgetResize)

    updateShows()
    refreshContent = ->
      startMillis = Date.now()
      model.loadLatestResource((error, resources, reloadedResources)->
        scope.busyWithResources = false
        if (error)
          errorHandler.reportError(languageHandler.getMessage("loadSave.failure.load", error),
            "Failed to load one or more resources", error)
        else
          usedMillis = Date.now()-startMillis
          console.log("#{debugLabel} refreshContent: loaded #{model.getResources().length} resources in #{usedMillis} msec.") if debug
          if (reloadedResources.length>0)
            object = {
              objectType: "resources"
              id: reloadedResources.map((resource)->resource.getId())
              content: reloadedResources.map((resource)->resource.getResource())
            }
            model.getActionLogger().log(model.getActionLogger().verbs.open, object)
      )

    autoRefreshTask = ->
#      console.log("autoRefreshTask: configurationModel.autoSave: #{configurationModel.autoSave}")
      if (configurationModel.autoSave)
        refreshContent()

    $timeout(->
      $interval(autoRefreshTask, autoRefreshMillis)
    , autoRefreshMillis)

    # for some reason, a timeout is needed to get the listener working
    $timeout(->
      updateShows()
      configurationModel.addListeners(["modelChanged", "modelLoaded", "modelCleared"], ->
        updateShows()
        # return false, else the listener will be removed
        false
      )
    , 0)
    resourceType = model.getResourceType()
    resourceTypeLabel = languageHandler.getMessage("resources.type.name.#{resourceType}")
    application = model.getApplication()
    applicationLabel = languageHandler.getMessage("tools.name.#{application}")
    unnamedResourceName = if (modelIsConfiguration)
      languageHandler.getMessage("loadSave.titleConfiguration.unnamed", applicationLabel)
    else
      languageHandler.getMessage("loadSave.title.unnamed", resourceTypeLabel)
    #    console.log("loadSave directive for scope model name '#{scopeModelName}' of resource type: '#{resourceType}' and id: #{id}")
    savedNotificationMessage = languageHandler.getMessage("loadSave.notification.saved", resourceTypeLabel)
    scope.resourceType = resourceType
    scope.showModelJsonDialogTitle = languageHandler.getMessage("loadSave.showModelJsonDialog.dialogTitle",
      resourceTypeLabel)

    scope.refreshContent = ->
      console.log("#{debugLabel} refreshContent") if debug
      scope.busyWithResources = true
      refreshContent()

    scope.undo = ->
      undoRedoManager?.undo()

    scope.redo = ->
      undoRedoManager?.redo()

    scope.showModelJsonDialog = ->
      scope.updateModelJson()
      scope.dialogBoxes[showModelJsonDialogId].show()

    scope.closeShowModelJsonDialog = ->
      scope.dialogBoxes[showModelJsonDialogId].close()

    scope.model = {
      json: ""
    }
    scope.updateModelJson = ->
      resource = model.getResource()
      scope.model.json = JSON.stringify(resource, null, "  ")
  }

ut.commons.golabUtils.directive("multiLoad".toLowerCase(),
  [ "languageHandler", "fileStorage", "localStorageService", "configurationModel",
    "leavePageDetector", "Notification", "errorHandler", "$timeout", "$interval", multiLoadDirective])
