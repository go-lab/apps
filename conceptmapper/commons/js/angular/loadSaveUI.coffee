"use strict";

window.ut = window.ut or {}
ut.commons = ut.commons || {}

debug = false
#debug = true
testNotifications = true
testPageLeave = false
#testPageLeave = true
if (testPageLeave)
  console.warn("testing page leave!!!")
counter = 0

# auto save timing
autoSaveCheckInterval = 1000
minimumAutoSaveMillisAfterChanges = 2000
maximumAutoSaveMillisAfterChanges = 20000
if (debug)
  autoSaveCheckInterval = 5000
  minimumAutoSaveMillisAfterChanges = 10000
  maximumAutoSaveMillisAfterChanges = 20000

dummy = {
  ios: false
  safari: false
  applyAlternativeConfiguration: ()->
}

runningOnIOs = head.browser.ios || (head.browser.safari && head.mobile)

#resetIcons = """
#        <li ng-show="showReset">
#            <i class="fa fa-recycle fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: isEmpty()}"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}"></i>
#        </li>
#        <li ng-show="showReset">
#            <i class="fa fa-share-square-o fa-flip-horizontal fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: isEmpty()}"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}"></i>
#        </li>
#        <li ng-show="showReset">
#            <i class="fa fa-reply-all fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: isEmpty()}"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}"></i>
#        </li>
#        <li ng-show="showReset">
#            <i class="fa fa-angle-double-left fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: isEmpty()}"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}"></i>
#        </li>
#        <li ng-show="showReset">
#            <i class="fa fa-step-backward fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: isEmpty()}"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}"></i>
#        </li>
#        <li ng-show="showReset">
#            <i class="fa fa-fast-backward fa-fw activeButton fontAweSomeButtonSmall" Xng-class="{disabledButton: isEmpty()}" style="margin-left:7px; font-size: 17px; margin-bottom: 8px;"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}"></i>
#        </li>
#        <li ng-show="showReset">
#            <span class="fontAweSomeStacked fa-fw activeButton fontAweSomeButton" Xng-class="{disabledButton: isEmpty()}" Xstyle="margin-left:8px; font-size: 17px;"
#               ng-click='resetContentToInitialResource()' title="{{'loadSave.reset' | g4i18n}}">
#              <i class="fa fa-power-off fontAweSomeStack"></i>
#              <i class="fa fa-exclamation fontAweSomeStack" style="left:10.5px; font-size:18px;"></i>
#            </span>
#        </li>
#"""

listTemplate = """
<span>
  <div class="busyWithResources" ng-show="busyWithResources"></div>
  <ul class="toolbarPart">
      <li ng-show="showNew">
          <i class="fa fa-file-o fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: authorConfigurationMode}"
             ng-click='clearResource()' title="{{::newTooltip}}"></i>
      </li>
      <li ng-show="showOpen">
          <i class="fa fa-folder-open-o fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: authorConfigurationMode}"
             ng-click='openResource()' title="{{::openTooltip}}"></i>
      </li>
      <li ng-show="showExamples">
          <i class="fa fa-gift fa-fw activeButton fontAweSomeButton"
             ng-click='openExample()' title="{{::examplesTooltip}}"></i>
      </li>
      <li ng-show="showSave">
          <i class="fa fa-save fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: authorConfigurationMode}"
             ng-click='saveResource()' title="{{::saveTooltip}}"></i>
      </li>
      <li ng-show="showSaveAs">
          <span class="fontAweSomeStacked fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: authorConfigurationMode}"
            ng-click='saveAsResource()' title="{{::saveAsTooltip}}">
              <i class="fa fa-save fontAweSomeUnderStar"></i>
              <i class="fa fa-star fontAweSomeStack fontAweSomeStackedStar"></i>
          </span>
      </li>
      <li ng-show='showImExport'>
          <i class="fa fa-upload fa-fw activeButton fontAweSomeButton"
             ng-click='importResource()' title="{{::importTooltip}}"></i>
      </li>
      <li ng-show='showImExport' style="position: relative; top:2px;">
          <i class="fa fa-download fa-fw activeButton fontAweSomeButton"
             ng-click='exportResource()' title="{{::exportTooltip}}"></i>
      </li>
      <li ng-show="showRefresh">
          <i class="fa fa-refresh fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: !canRefresh()}"
             ng-click='refreshContent()' title="{{::refreshTooltip}}"></i>
      </li>
      <li ng-show="showClear">
          <i class="fa fa-eraser fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: !canEraseResetContent()}"
             ng-click='eraseResetContent()' title="{{::clearTooltip}}"></i>
      </li>
      <li ng-show="showDelete">
          <i class="fa fa-trash-o fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: cannotDelete}"
             ng-click='deleteResource()' title="{{::deleteTooltip}}"></i>
      </li>
      <li ng-show="showUndoRedo">
          <i class="fa fa-undo fa-fw activeButton fontAweSomeButton"  ng-class="{disabledButton: !undoRedoManager.canUndo}"
             ng-click='undo()' title="{{'loadSave.undo.tooltip' | g4i18n}}"></i>
      </li>
      <li ng-show="showUndoRedo">
          <i class="fa fa-rotate-right fa-fw activeButton fontAweSomeButton"  ng-class="{disabledButton: !undoRedoManager.canRedo}"
             ng-click='redo()' title="{{'loadSave.redo.tooltip' | g4i18n}}"></i>
      </li>
      <li ng-show="showModelJson">
          <i class="fa fa-book fa-fw activeButton fontAweSomeButton"
             ng-click='showModelJsonDialog()' title="{{'loadSave.showModelJson' | g4i18n}}"></i>
      </li>
  </ul>
  <dialogBox id="{{loadResourceDialogId}}" title="{{loadResourceDialogTitle}}" icon="folder-open-o" resizable="false" width="500"
             Xheight="400">
      <resourceSelection resourceType="{{resourceType}}" storageHandler="" g4i18nbasekey="loadSave.loadDialog"></resourceSelection>
  </dialogBox>
  <dialogBox id="{{loadExampleDialogId}}" title="{{loadExapleDialogTitle}}" resizable="false" width="500"
             Xheight="400">
    <loadExample exampleStoreName="dataStore" dialogId="{{loadExampleDialogId}}"></loadExample>
  </dialogBox>
  <dialogBox id="{{saveResourceDialogId}}" title="{{saveResourceDialogTitle}}" resizable="false" width="500">
      <resourceName resourceType="{{resourceType}}" storageHandler="" g4i18nbasekey="loadSave.loadDialog"></resourceName>
  </dialogBox>
  <dialogBox id="{{saveChangesDialogId}}" title="{{saveChangesDialogTitle}}" icon="warning" resizable="false">
      <askQuestion ok="i_loadSave.saveChangesDialog.save" ok2="i_loadSave.saveChangesDialog.discard" cancel="i_loadSave.saveChangesDialog.cancel"></askQuestion>
  </dialogBox>
  <dialogBox id="{{exportResourceDialogId}}" title="{{exportResourceDialogTitle}}" icon="upload" resizable="false" width="500">
      <askQuestion ok="i_loadSave.saveDialog.download" cancel="i_loadSave.saveDialog.cancel"></askQuestion>
  </dialogBox>
  <dialogBox id="{{eraseContentDialogId}}" title="{{eraseContentDialogTitle}}" icon="warning" resizable="false">
      <askQuestion ok="i_loadSave.eraseContentDialog.erase" cancel="i_loadSave.eraseContentDialog.cancel"></askQuestion>
  </dialogBox>
  <dialogBox id="{{eraseResetContentDialogId}}" title="{{eraseResetContentDialogTitle}}" icon="warning" resizable="false">
      <askQuestion ok="i_loadSave.eraseResetContentDialog.erase"  ok2="i_loadSave.eraseResetContentDialog.reset" cancel="i_loadSave.eraseResetContentDialog.cancel"></askQuestion>
  </dialogBox>
  <dialogBox id="{{deleteResourceDialogId}}" title="{{deleteResourceDialogTitle}}" icon="warning" resizable="false">
      <askQuestion ok="i_loadSave.deleteResourceDialog.delete" cancel="i_loadSave.deleteResourceDialog.cancel"></askQuestion>
  </dialogBox>
  <dialogBox id="{{showModelJsonDialogId}}" title="{{showModelJsonDialogTitle}}" icon="book" resizable="false" width="670">
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

loadSaveDirective = (languageHandler, fileStorage, localStorageService, configurationModel, leavePageDetector,
                     Notification, errorHandler, $timeout, $interval) ->
  {
  restrict: "E"
  template: listTemplate
  replace: true
  scope: true
  link: (scope, element, attrs)->
    scope.busyWithResources = false
    id = counter++
    loadResourceDialogId = "loadDialogBox#{id}"
    loadExampleDialogId = "loadExampleBox#{id}"
    saveResourceDialogId = "saveDialogBox#{id}"
    saveChangesDialogId = "saveChangesBox#{id}"
    exportResourceDialogId = "exportDialogBox#{id}"
    eraseContentDialogId = "eraseContentBox#{id}"
    eraseResetContentDialogId = "eraseResetContentBox#{id}"
    deleteResourceDialogId = "deleteResourceBox#{id}"
    showModelJsonDialogId = "showModelJsonBox#{id}"
    scope.loadResourceDialogId = loadResourceDialogId
    scope.loadExampleDialogId = loadExampleDialogId
    scope.saveResourceDialogId = saveResourceDialogId
    scope.saveChangesDialogId = saveChangesDialogId
    scope.exportResourceDialogId = exportResourceDialogId
    scope.eraseContentDialogId = eraseContentDialogId
    scope.eraseResetContentDialogId = eraseResetContentDialogId
    scope.deleteResourceDialogId = deleteResourceDialogId
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
    scope.dataStore = null
    scope.dataStoreName = ""
    examplesAvailable = false
    modelIsConfiguration = model.getResourceType()=="configuration"
    scope.authorConfigurationMode = !modelIsConfiguration && configurationModel.runningInGraasp
    allowAutoSaveModel = ut.commons.utils.getBooleanAttributeValue(attrs, "save", true)
    if (allowAutoSaveModel)
      # if scope.authorConfigurationMode then the saving will be done by the configuration model
      if (scope.authorConfigurationMode)
        allowAutoSaveModel = false
      if (modelIsConfiguration && model.runningInIls)
        allowAutoSaveModel = false
    $timeout(->
      dataStoreName = ut.commons.utils.getAttributeValue(attrs, "dataStoreName", "")
      if (dataStoreName)
        if (scope[dataStoreName])
          scope.dataStoreName = dataStoreName
          scope.dataStore = scope[dataStoreName]
          examplesAvailable = true
    )
    undoRedoManager = null
    if (!modelIsConfiguration)
      if (model.isChangeTrackingFullyImplemented())
        undoRedoManager = new window.ut.commons.UndoRedoManager(model)
        scope.undoRedoManager = undoRedoManager

    isAutoSave = ->
      ut.commons.utils.getBooleanAttributeValue(attrs, "save", true) &&
        ut.commons.utils.getBooleanAttributeValue(attrs, "autoSave", true) && configurationModel.autoSave

    debugLabel = "loadSaveUI(#{model.getResourceType()}):"

    if (debug)
      console.log("#{debugLabel} start: resourceType: #{model.getResourceType()}, modelIsConfiguration: #{modelIsConfiguration}, "+
          "scope.authorConfigurationMode: #{scope.authorConfigurationMode}, allowAutoSaveModel: #{allowAutoSaveModel}")

    updateShows = ->
      singleDocumentMode = ut.commons.utils.getBooleanAttributeValue(attrs, "single", configurationModel.getSingleDocumentMode())
      allowSave = ut.commons.utils.getBooleanAttributeValue(attrs, "save", true)
      scope.showNew = ut.commons.utils.getBooleanAttributeValue(attrs, "new", !singleDocumentMode)
      scope.showNew = ut.commons.utils.getBooleanAttributeValue(attrs, "new", false)
      scope.showOpen = ut.commons.utils.getBooleanAttributeValue(attrs, "open", !singleDocumentMode)
      scope.showSave = ut.commons.utils.getBooleanAttributeValue(attrs, "save", true) && !isAutoSave()
      scope.showSaveAs = allowSave && ut.commons.utils.getBooleanAttributeValue(attrs, "saveAs", !singleDocumentMode)
      scope.showImExport = ut.commons.utils.getBooleanAttributeValue(attrs, "imexport", configurationModel.getShowImportExport())
      scope.showExamples = examplesAvailable && ut.commons.utils.getBooleanAttributeValue(attrs, "examples", configurationModel.getShowLoadExamples())
      scope.showRefresh = ut.commons.utils.getBooleanAttributeValue(attrs, "refresh", false)
      scope.showClear = allowSave && ut.commons.utils.getBooleanAttributeValue(attrs, "clear", true)
      scope.showDelete = allowSave && ut.commons.utils.getBooleanAttributeValue(attrs, "delete", !singleDocumentMode)
      scope.showDelete = allowSave && ut.commons.utils.getBooleanAttributeValue(attrs, "delete", false)
      scope.showModelJson = ut.commons.utils.getBooleanAttributeValue(attrs, "modelJson", configurationModel.getShowModelJson())
      scope.showUndoRedo = undoRedoManager && model.isChangeTrackingFullyImplemented() && ut.commons.utils.getBooleanAttributeValue(attrs, "undoRedo", false)
#      console.log("updated shows, scope.showImExport: #{scope.showImExport}")
      # update shows might change the height of the gadget
      $timeout(ut.commons.utils.gadgetResize)

    updateShows()
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
    scope.newTooltip = languageHandler.getMessage("loadSave.new.tooltip", resourceTypeLabel)
    scope.openTooltip = languageHandler.getMessage("loadSave.open.tooltip", resourceTypeLabel)
    scope.examplesTooltip = languageHandler.getMessage("loadSave.examples.tooltip", resourceTypeLabel)
    scope.saveTooltip = languageHandler.getMessage("loadSave.save.tooltip", resourceTypeLabel)
    scope.saveAsTooltip = languageHandler.getMessage("loadSave.saveAs.tooltip", resourceTypeLabel)
    scope.importTooltip = languageHandler.getMessage("loadSave.import.tooltip", resourceTypeLabel)
    scope.exportTooltip = languageHandler.getMessage("loadSave.export.tooltip", resourceTypeLabel)
    scope.refreshTooltip = languageHandler.getMessage("loadSave.refresh.tooltip", resourceTypeLabel)
    scope.clearTooltip = languageHandler.getMessage("loadSave.clear.tooltip", resourceTypeLabel)
    scope.deleteTooltip = languageHandler.getMessage("loadSave.delete.tooltip", resourceTypeLabel)
    scope.resourceType = resourceType
    scope.loadResourceDialogTitle = languageHandler.getMessage("loadSave.loadDialog.dialogTitle", resourceTypeLabel)
    scope.loadExapleDialogTitle = languageHandler.getMessage("loadSave.examplesDialog.dialogTitle", resourceTypeLabel)
    scope.saveResourceDialogTitle = languageHandler.getMessage("loadSave.saveDialog.dialogTitle", resourceTypeLabel)
    scope.eraseContentDialogTitle = languageHandler.getMessage("loadSave.eraseContentDialog.dialogTitle", resourceTypeLabel)
    scope.exportResourceDialogTitle = languageHandler.getMessage("loadSave.saveDialog.dialogTitle", resourceTypeLabel)
    scope.eraseResetContentDialogTitle = languageHandler.getMessage("loadSave.eraseResetContentDialog.dialogTitle", resourceTypeLabel)
    scope.saveChangesDialogTitle = languageHandler.getMessage("loadSave.saveChangesDialog.dialogTitle", resourceTypeLabel)
    scope.deleteResourceDialogTitle = languageHandler.getMessage("loadSave.deleteResourceDialog.dialogTitle",
      resourceTypeLabel)
    scope.showModelJsonDialogTitle = languageHandler.getMessage("loadSave.showModelJsonDialog.dialogTitle",
      resourceTypeLabel)

    scope.showType = ut.commons.utils.getBooleanAttributeValue(attrs, "showType", false)
    scope.showAuthor = ut.commons.utils.getBooleanAttributeValue(attrs, "showAuthor", false)

    getInitialResourceName = ->
      initialResourceName = unnamedResourceName
      if (!modelIsConfiguration)
        if (configurationModel.defaultResourceName)
          initialResourceName = configurationModel.defaultResourceName
#        else if (configurationModel.loadInitialResource && configurationModel.initialResourceString)
#          initialResource = JSON.parse(configurationModel.initialResourceString)
#          if (initialResource.metadata && initialResource.metadata.target && initialResource.metadata.target.displayName)
#            initialResourceName = initialResource.metadata.target.displayName
      initialResourceName

    savedResourceJsonString = ""
    autoCheckJsonResourceString = ""
    getSavedResourceJsonString = ()->
      JSON.stringify(model.getResourceContent())

    setSavedResource = ()->
#      console.log("setting saved json string for #{model.getDisplayName()}")
      savedResourceJsonString = getSavedResourceJsonString()
      autoCheckJsonResourceString = savedResourceJsonString

    setSavedResource()

    updateCannotDelete = ->
      scope.cannotDelete = !model.isSaved() || scope.authorConfigurationMode
    model.addListeners(["modelLoaded", "modelCleared", "modelResourceCreated"], ->
      setSavedResource()
      # it depends on the sequence of actions if model.isSaved() has already the new value
      # so to be sure, use a timeout
      $timeout(->
        updateCannotDelete()
      , 0)
    )
    updateCannotDelete()

    scope.isEmpty = ->
      model.isEmpty()

    scope.canEraseResetContent = ->
      if (hasConfigurationModelInitialResource())
        true
      else if (!model.isEmpty())
        true
      else
        false

    scope.canRefresh = ->
#      console.log("#{debugLabel} canRefresh: #{model.canReloadFromStorage()}, isSaved: #{model.isSaved()}, id: #{model.getId()}")
      model.canReloadFromStorage()

    # if scope.authorConfigurationMode then the saving will be done by the configuration model
    if (allowAutoSaveModel)
      leavePageDetector.addHandler(->
        if (isAutoSave())
          if (debug)
            console.log("userName: #{model.getStorageHandler().getMetadataHandler().getActor().displayName}")
            console.log("#{model.getDebugLabel()}: try to do a final save....")
          if (resourceChangedAfterSave() || testPageLeave)
            console.log("#{model.getDebugLabel()}: there are changes...")
  #          debugger
            if (model.isSaved())
              async = true
              if (runningOnIOs)
                # 150121 jakob: for some reason async ajax call are not working on ios during page leave
                async= false
              model.updateResource(()->
                return
              , async)
              model.getActionLogger().logSave(model.getResource(), async)
              console.log("#{model.getDebugLabel()}: saved and logged changes")
            else if (debug)
              console.warn("#{debugLabel} cannot do a final save, because the model is not yet saved")
  #            model.setDisplayName(configurationModel.defaultResourceName)
  #            model.createResource(->)
  #            console.log("saved now logging it...")
  #            console.log(JSON.stringify(model.getResource()))
  #            model.getActionLogger().logSaveAs(model.getResource())
  #            console.log("logged!")
          else
            console.log("nothing changed")
      )

    firstChangedMillis = 0
    lastChangedMillis = 0
    changeFoundByJsonResource = false
    autoSaveInProgress = false

    clearChangedMillis = ->
      firstChangedMillis = 0
      lastChangedMillis = 0
      changeFoundByJsonResource = false
      setSavedResource()
      console.log("#{model.getDebugLabel()}.clearChangedMillis()") if (debug)

    updateChangedMillis = ->
      lastChangedMillis = Date.now()
      if (firstChangedMillis==0)
        firstChangedMillis = lastChangedMillis

    model.addListeners(["modelResourceCreated", "modelResourceUpdated"],
      clearChangedMillis)

    model.addListener("modelChanged", ->
      lastChangedMillis = Date.now()
      if (firstChangedMillis==0)
        firstChangedMillis = lastChangedMillis
      console.log("#{model.getDebugLabel()}.model changed") if (debug)
    )

    model.addListeners(["modelLoaded", "modelCleared"], ->
      clearChangedMillis()
      autoCheckJsonResourceString = getSavedResourceJsonString()
#      $timeout(->
#        clearChangedMillis()
#        autoCheckJsonResourceString = getSavedResourceJsonString()
#      )
    )

    autoSaveCheck = ->
      if (!autoCheckJsonResourceString)
        autoCheckJsonResourceString = getSavedResourceJsonString()
      isModelChanged = ->
        modelChanged = model.isChanged()
        if (!modelChanged && !model.isChangeTrackingFullyImplemented())
          resourceJsonString = getSavedResourceJsonString()
          if (resourceJsonString != autoCheckJsonResourceString)
            changeFoundByJsonResource = true
            updateChangedMillis()
            autoCheckJsonResourceString = resourceJsonString
          modelChanged = changeFoundByJsonResource
        console.log("#{model.getDebugLabel()}.isModelChanged: modelChanged: #{modelChanged}, model.isChanged(): #{model.isChanged()}") if (debug)
        modelChanged

      if (isAutoSave() && !autoSaveInProgress)
        modelChanged = isModelChanged()
        if (modelChanged)
          millisSinceLastChange = Date.now()-lastChangedMillis
          millisSinceFirstChange = Date.now()-firstChangedMillis
          console.log("millisSinceLastChange: #{millisSinceLastChange}, millisSinceFirstChange: #{millisSinceFirstChange}") if (debug)
          if (millisSinceLastChange>minimumAutoSaveMillisAfterChanges || millisSinceFirstChange>maximumAutoSaveMillisAfterChanges)
            autoSaveAction()
      else
        if (debug)
          console.log("#{model.getDebugLabel()}.autoSaveCheck() isAutoSave(): #{isAutoSave()}, autoSaveInProgress: #{autoSaveInProgress}")

    autoSaveAction = (forceChanged = false)->
      # TODO these next lines fixes the delayed loading of the latest resource in Chrome background tabs
      # TODO is this good enough, or does it cause trouble with the autosave elsewhere?
      if scope.golab?
        if not scope.golab.startupFinished
          console.warn "Skipping auto-save because startup is not finished, yet."
          return

      reportAutoSaved = ->
        millisSinceFirstChange = Date.now() - model._firstChangeMillis
        millisSinceLastChange = Date.now() - model._lastChangeMillis
        console.log("#{model.getDebugLabel()}.autoSaveAction: millis since changes: first: #{millisSinceFirstChange}, last: #{millisSinceLastChange}")
      modelChanged = true
      if (!forceChanged && !resourceChangedAfterSave())
        # the model apparently changed back to its saved state, so nothing has changed
        clearChangedMillis()
        modelChanged = false
        model.clearChanged()
      if (modelChanged)
        autoSaveInProgress = true
        console.log("#{model.getDebugLabel()}.autoSaveAction() trying to do an auto save") if (debug)
        callback = ->
          autoSaveInProgress = false
          clearChangedMillis()
        if (model.isSaved())
          reportAutoSaved() if (debug)
          model.updateResource(saveCallback(false, callback))
        else
#          if (configurationModel.singleDocumentMode)
          initialResourceName = getInitialResourceName()
          if (initialResourceName)
            model.setDisplayName(initialResourceName)
            if (model.isReadOnly())
              model.setMetadataFlag("readOnly", false)
            model.createResource(saveCallback(true, callback))

#    if (model.getResourceType()=="circuit")
#      $interval(autoSaveCheck, 1000)
    if (!testPageLeave)
      if (allowAutoSaveModel)
        $interval(autoSaveCheck, autoSaveCheckInterval)

    resourceChangedAfterSave = ()->
      resourceJsonString = getSavedResourceJsonString()
      resourceJsonString != savedResourceJsonString

    checkForChangesSaving = (callback)->
      if (scope.showSave && resourceChangedAfterSave())
        if (isAutoSave() &&
            (model.isSaved() || (configurationModel.singleDocumentMode && configurationModel.defaultResourceName)))
          autoSaveAction()
          callback()
        else
          scope.askQuestion.questionParams = {
            question: languageHandler.getMessage("loadSave.saveChangesDialog.question", resourceTypeLabel)
            answer: null
            dialogBoxId: saveChangesDialogId
            questionOkAnswer: ()->
  #            console.log("should now save changes")
              save(callback)
  #            callback
            questionOk2Answer: ()->
  #            console.log("ignore changes")
              callback()
            questionCancelAnswer: ()->
  #            console.log("cancel")
          }
        scope.dialogBoxes[saveChangesDialogId].show()
      else
        callback()

    loadModelFromResource = (newResource) ->
      try
        resource = JSON.parse(JSON.stringify(newResource))
        model.loadFromResource(resource)
        setSavedResource()
      catch error
        errorHandler.reportError(languageHandler.getMessage("loadSave.failure.load", error),
          "Failed to load resource from: #{JSON.stringify(newResource)}", error
        )

    importModelFromFile = (file, content) ->
      try
        model.importFromFile(file, content)
        setSavedResource()
      catch error
        errorHandler.reportError(languageHandler.getMessage("loadSave.failure.import", error),
          "Failed to import content from file: #{file.name}", error
        )

    scope.openResource = ->
      if (!scope.showOpen || scope.authorConfigurationMode)
        return
      console.log("#{debugLabel} openResource") if debug
      checkForChangesSaving(->
        scope.storageHandler = model.getStorageHandler()
        scope.dialogBoxes[loadResourceDialogId].show()
        scope.loadResource = (resource) ->
          console.log(resource) if debug
          scope.dialogBoxes[loadResourceDialogId].close()
          loadModelFromResource(resource)
          model.setSaved(true)
          model.getActionLogger().logLoad(resource)
        scope.cancel = ->
          scope.dialogBoxes[loadResourceDialogId].close()

      )

    scope.examples = {
      selectedCategory: ""
      selectedData: ""
    }
    scope.getDatas = ->
#      console.log("calling getDatas() for category: #{scope.examples.selectedCategory}")
      if (scope.dataStore)
        scope.dataStore.getDatas(scope.examples.selectedCategory)
      else
        []

    scope.openExample = ->
      if (!scope.showExamples)
        return
      console.log("#{debugLabel} openExample") if debug
      checkForChangesSaving(->
        scope.dialogBoxes[loadExampleDialogId].show()
        scope.loadExampleResource = (exampleResource)->
          loadModelFromResource(exampleResource)
          model.setSaved(false)
          if (isAutoSave())
            autoSaveAction(true)
          model.getActionLogger().logLoad(exampleResource)
      )

    scope.importResource = ->
      if (!scope.showImExport)
        return
      console.log("#{debugLabel} importResource") if debug
      $timeout(->
        checkForChangesSaving(->
          fileStorage.getTextFromDialog((error, file, content)->
            if (error)
              errorHandler.reportError(languageHandler.getMessage("loadSave.failure.import", error),
                "Failed to import resource", error
              )
            else
              scope.$apply(->
                importModelFromFile(file, content)
                model.setSaved(false)
              )
          )
        )
      )

    scope.refreshContent = ->
      if (!scope.canRefresh())
        return
      console.log("#{debugLabel} refreshContent") if debug
      model.reloadFromStorage((error)->
        if (error)
          errorHandler.reportError(languageHandler.getMessage("loadSave.failure.refresh", error),
            "Failed to refresh resource", error)
        scope.$apply()
      )

    doRenameInsteadOfSaveAs = false

    initialSaveAction = ->
      if (scope.authorConfigurationMode)
        resourceName = getInitialResourceName()
        model.setDisplayName(resourceName)
        return
      if (!allowAutoSaveModel)
        return
      if (isAutoSave())
        console.log("#{model.getDebugLabel()}: initialSaveAction") if (debug)
        if (model.isSaved())
          console.log("#{model.getDebugLabel()}: initialSaveAction: model is a saved model") if (debug)
          setSavedResource()
        else
          model.getStorageHandler().listResourceMetaDatas((error, metaDatas)->
            if (error)
              errorHandler.reportError(languageHandler.getMessage("loadSave.failure.listMetadata", error),
                "Failed to get list of metaDatas", error
              )
            else
              existingResourceNames = {}
              for metaData in metaDatas
                existingResourceNames[metaData.metadata.target.displayName] = metaData
              initialResourceName = getInitialResourceName()
              count = 0
              resourceName = initialResourceName
              while (existingResourceNames[resourceName])
                ++count
                resourceName = "#{initialResourceName} #{count}"
              model.setDisplayName(resourceName)
              if (model.isReadOnly())
                model.setMetadataFlag("readOnly", false)
              model.createResource(saveCallback(true, setSavedResource))
              doRenameInsteadOfSaveAs = true
              console.log("#{model.getDebugLabel()}: initialSaveAction: model is saved as #{resourceName}") if (debug)
          )
      else
        if (!model.isSaved())
          resourceName = getInitialResourceName()
          model.setDisplayName(resourceName)
          console.log("#{model.getDebugLabel()}: initialSaveAction: model renamed to #{resourceName}") if (debug)
        setSavedResource()

    loadInitialResourceContentIfConfigured = ->
      if (!modelIsConfiguration && configurationModel.loadInitialResource && configurationModel.initialResourceString)
        initialResource = JSON.parse(configurationModel.initialResourceString)
        model.loadContentFromResource(initialResource.content)

    clearAction = (callback)->
      model.setDisplayName(getInitialResourceName())
      model.setSaved(false)
      model.clear()
      loadInitialResourceContentIfConfigured()
      if (callback)
        callback()
      initialSaveAction()

    scope.clearResource = ->
      if (!scope.showNew || scope.authorConfigurationMode)
        return
      console.log("#{debugLabel} clearResource") if debug
      checkForChangesSaving(->
        clearAction(->
          # the actionlogger sets the current target as the log object by default
          object = {
            objectType: model.getResourceType()
            content: model.getResourceTarget()
          }
          model.getActionLogger().logClear(object)
        )
      )

    hasConfigurationModelInitialResource = ->
      configurationModel.loadInitialResource && configurationModel.initialResourceString &&
        configurationModel.initialResourceString.length>0

    scope.eraseResetContent = ->
      if (!scope.showClear || !scope.canEraseResetContent())
        return
      console.log("#{debugLabel} eraseResetContent") if debug
      if (hasConfigurationModelInitialResource())
        question = languageHandler.getMessage("loadSave.eraseResetContentDialog.question", resourceTypeLabel)
        dialogBoxId = eraseResetContentDialogId
      else
        question = languageHandler.getMessage("loadSave.eraseContentDialog.question", resourceTypeLabel)
        dialogBoxId = eraseContentDialogId
      eraseResetAction = (reset)->
        model.clearContent()
        object = {
          objectType: model.getResourceType()
          content: model.getResourceTarget()
        }
        if (reset)
          loadInitialResourceContentIfConfigured()
          object.content.initialContent = model.getResourceContent()
        model.getActionLogger().logClear(object)
      scope.askQuestion.questionParams = {
        question: question
        answer: null
        dialogBoxId: dialogBoxId
        questionOkAnswer: ()->
          eraseResetAction(false)
        questionOk2Answer: ()->
          eraseResetAction(true)
        questionCancelAnswer: ()->
      }
      scope.dialogBoxes[dialogBoxId].show()

    save = (savedCallback)->
      if (model.isSaved())
#        console.log("save: do a update...")
        callback = saveCallback(false, savedCallback)
        model.updateResource(callback)
      else
#        console.log("save: do a save as...")
        saveAs(savedCallback)

    saveAs = (savedCallback, suggestedResourceName)->
      scope.storageHandler = model.getStorageHandler()
      scope.resource = {
        name: if (suggestedResourceName) then suggestedResourceName else model.getDisplayName()
      }
      scope.dialogBoxes[saveResourceDialogId].show()
      scope.busyWithResources = false
      scope.saveAs = (resourceName, resourceMetadata)->
        console.log("do saveAs, resourceName: #{resourceName}, resourceMetadata: #{resourceMetadata}") if debug
        scope.dialogBoxes[saveResourceDialogId].close()
        model.setDisplayName(resourceName)
        if (resourceMetadata || doRenameInsteadOfSaveAs)
          #replace
          model.updateResource(saveCallback(false, savedCallback))
          doRenameInsteadOfSaveAs = false
        else
          #save as
          if (model.isReadOnly())
            model.setMetadataFlag("readOnly", false)
          model.createResource(saveCallback(true, savedCallback))
      scope.cancel = ->
        scope.dialogBoxes[saveResourceDialogId].close()

    saveCallback = (saveAs, savedCallback)->
      (error, resource)->
        if (error)
          action = "update"
          messageKey = "loadSave.failure.save"
          if (saveAs)
            action ="create"
            messageKey = "loadSave.failure.saveAs"
          errorHandler.reportError(languageHandler.getMessage(messageKey, error),
            "Failed to #{action} resource: #{JSON.stringify(model.getResourceDescription())}", error
          )
        else
          model.setSaved(true)
          setSavedResource()
          if (saveAs)
            model.getActionLogger().logSaveAs(resource)
          else
            model.getActionLogger().logSave(resource)
          if (savedCallback)
            savedCallback()
          if (testNotifications && !isAutoSave())
            Notification.success(savedNotificationMessage)
        $timeout(->
          scope.busyWithResources = false
        )

    scope.saveResource = ()->
      if (!scope.showSave || scope.authorConfigurationMode)
        return
      console.log("#{debugLabel} saveResource, saved: #{model.isSaved()}") if debug
      scope.busyWithResources = true
      if (model.isSaved() && !model.isReadOnly())
        callback = saveCallback(false)
        model.updateResource(callback)
      else
        if (model.isReadOnly())
          model.setMetadataFlag("readOnly", false)
        if (modelIsConfiguration)
          model.createResource(saveCallback(true))
        else
          saveAs()

    scope.saveAsResource = ->
      if (!scope.showSaveAs || scope.authorConfigurationMode)
        return
      console.log("#{debugLabel} saveAsResource") if debug
      scope.busyWithResources = true
      saveAs()

    scope.exportResource = ->
      if (!scope.showImExport)
        return
      console.log("#{debugLabel} exportResource") if debug
      scope.askQuestion.questionParams = {
        question: ""
        answer: model.getDisplayName()
        dialogBoxId: exportResourceDialogId
        questionOkAnswer: (resourceName)->
          model.setDisplayName(resourceName)
          resource = model.getResourceBundle()
          fileStorage.storeAsFile(resource, resourceName + ".json")
          model.emitModelLoaded()
          setSavedResource()
          model.getActionLogger().logSaveAs(resource)
      }
      scope.dialogBoxes[exportResourceDialogId].show()

    scope.deleteResource = ->
      if (!scope.showDelete || scope.cannotDelete)
        return
      console.log("#{debugLabel} deleteResource") if debug
      if (model.isSaved())
#        console.log("deleteResource")
        scope.askQuestion.questionParams = {
          question: languageHandler.getMessage("loadSave.deleteResourceDialog.question", resourceTypeLabel)
          dialogBoxId: deleteResourceDialogId
          questionOkAnswer: ()->
            scope.busyWithResources = true
            resource = model.getResource()
            model.deleteResource((error)->
              if (error)
                errorHandler.reportError(languageHandler.getMessage("loadSave.failure.delete", error),
                  "Failed to delete resource: #{JSON.stringify(model.getResourceDescription())}", error
                )
              else
                resourceMetadata = resource.metadata
                clearAction(->
                  model.getActionLogger().logDelete({metadata: resourceMetadata})
                )
              scope.busyWithResources = false
            )
        }
        scope.dialogBoxes[deleteResourceDialogId].show()

    doUndoOrRedo = (undo) ->
      if (undoRedoManager)
        if (undo)
          if (!undoRedoManager.getCanUndo())
            return
          undoRedoManager.undo()
          objectType = "undo"
        else
          if (!undoRedoManager.getCanRedo())
            return
          undoRedoManager.redo()
          objectType = "redo"
        object = {
          objectType: objectType
          id: model.getId()
          content: model.getResource()
        }
        model.getActionLogger().logChange(object)

    scope.undo = ->
      doUndoOrRedo(true)

    scope.redo = ->
      doUndoOrRedo(false)

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

    handleInitialLoading = ->
      if (modelIsConfiguration)
        # the loading of the configuration is handled by through the main model class
        return

      modelInitialResourceString = null
      fixConfigurationInitialResourceString = ->
        # fix initialResourceString, because this has been overwritten by save state model code of the configuration model
        # the initialResourceString is set during the getResourceContent call of the configurationModel
        if (modelInitialResourceString)
          configurationModel.setInitialResourceString(modelInitialResourceString)

      loadingFinished = ->
        model.initialLoadingFinished()
        if (scope.golab)
          scope.golab.startupFinished = true
        initialSaveAction()

      loadDefaultConfiguration = ->
        console.log("#{debugLabel} loadDefaultConfiguration") if (debug)
        configurationLoaded = false
        if (scope.applyAlternativeConfiguration)
          configurationLoaded = scope.applyAlternativeConfiguration(model)
        if (!configurationLoaded)
          configurationModel.loadDefaultConfiguration()
        # the configurationModel is not loaded from an existing configuration resource
        # let auto save save it in a new configuration resource
        configurationModel.setMetadataFlag("readOnly", true)
        configurationModel.setSaved(false)
        configurationModel.getActionLogger().logLoad(configurationModel.getResource())

      loadWhenNoLatestResource = ->
        if (configurationModel.loadInitialResource && configurationModel.initialResourceString)
          initialResource = JSON.parse(configurationModel.initialResourceString)
          if (typeof initialResource.metadata == "undefined" || initialResource.metadata==null)
            initialResource.metadata = {}
          if (typeof initialResource.metadata.flags == "undefined" || initialResource.metadata.flags==null)
            initialResource.metadata.flags = {}
          initialResource.metadata.flags.readOnly = true
          model.importFromResource(initialResource)
#          if (configurationModel.singleDocumentMode)
          initialResourceName = getInitialResourceName()
          if (initialResourceName)
            model.setDisplayName(initialResourceName)
          model.getActionLogger().logLoad(initialResource)
#          console.log("loaded initial resource")
#          console.log(initialResource)
#        else
#          console.log("do not load any initial resource")
        loadingFinished()

      if (configurationModel.getAutoLoadLatestResource())
#        console.log("cfg: load latest config")
        configurationModel.loadLatestResource((error, resource)->
#          console.log("cfg: latest config loaded")
          if (error)
            errorHandler.reportError(languageHandler.getMessage("loadSave.failure.loadLatestConfiguration", error),
              "Failed to load latest configuration resource: #{JSON.stringify(configurationModel.getResourceDescription())}", error
            )
          if (!error && !resource)
            loadDefaultConfiguration()
          else
            configurationModel.getActionLogger().logLoad(configurationModel.getResource())
          if (resource && resource.content && resource.content.initialResourceString)
            modelInitialResourceString = resource.content.initialResourceString
          configurationModel.startupFinished = true
#          console.log("cf: configurationModel.startupFinished = true")
          fixConfigurationInitialResourceString()
          if (configurationModel.getAutoLoadLatestResource() && !scope.authorConfigurationMode)
            model.loadLatestResource((error, resource) ->
              if (error)
                errorHandler.reportError(languageHandler.getMessage("loadSave.failure.loadLatest", error),
                  "Failed to load latest resource: #{JSON.stringify(model.getResourceDescription())}", error
                )
              if (!resource)
                loadWhenNoLatestResource()
                console.log("model: no latest resource") if (debug)
              else
                console.log("model: latest resource loaded") if (debug)
                model.getActionLogger().logLoad(model.getResource())
                loadingFinished()
              scope.$apply()
            )
          else
            loadWhenNoLatestResource()
            scope.$apply()
        )
      else
        loadDefaultConfiguration()
        configurationModel.startupFinished = true
#        console.log("cf: configurationModel.startupFinished = true")
        loadWhenNoLatestResource()

    if (modelIsConfiguration)
#      console.log("cfg: setup $watch for configurationModel.startupFinished")
      unwatchStartupFinished = scope.$watch("configurationModel.startupFinished", (value)->
#        console.log("cfg: $watch(configurationModel.startupFinished): #{value}")
        if (value)
          unwatchStartupFinished()
          initialSaveAction()
#          console.log("cfg: initialSaveAction")
      )
    else if (model.mainModelClass)
      if (model != configurationModel)
        configurationModel.setApplicationModel(model)
      if (model.startupFinished)
        handleInitialLoading()
      else
        console.log("setup $watch for #{scopeModelName}.startupFinished")
        unwatchStartupFinished = scope.$watch("#{scopeModelName}.startupFinished", (value)->
          console.log("$watch(#{scopeModelName}.startupFinished): #{value}")
          if (value)
            unwatchStartupFinished()
            handleInitialLoading()
        )
  }

ut.commons.golabUtils.directive("loadSave".toLowerCase(),
  [ "languageHandler", "fileStorage", "localStorageService", "configurationModel",
    "leavePageDetector", "Notification", "errorHandler", "$timeout", "$interval", loadSaveDirective])

