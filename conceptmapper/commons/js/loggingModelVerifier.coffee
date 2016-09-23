"use strict";

window.ut ?= {}
window.ut.commons ?= {}
window.ut.commons.actionlogging = window.ut.commons.actionlogging || {}

class window.ut.commons.actionlogging.LoggingModelVerifier
  constructor: (mainModel, additionalActionLoggers...)->
    actionLogger = mainModel.getActionLogger()
    verifyModel = mainModel.createNewModel()
    verifyModel.isVerifyModel = true
    @_errorHandler = null
    @_mainModel = mainModel
    @_verifyModel = verifyModel
    @_syncVerifyModel = true
    @_showJsonString = true
    @_lastMainModelJson = ""
    @_collaborationInProgress = false
    if (!actionLogger instanceof window.ut.commons.actionlogging.ActionLogger)
      console.error("actionLogger must be instance of window.ut.commons.actionlogging.ActionLogger")
    if (!mainModel instanceof window.ut.commons.ResourceEventEmitterModel)
      console.error("mainModel must be instance of window.ut.commons.ResourceEventEmitterModel")
    if (!verifyModel instanceof window.ut.commons.ResourceEventEmitterModel)
      console.error("verifyModel must be instance of window.ut.commons.ResourceEventEmitterModel")
    @_registerToActionLogger(actionLogger, true)
    if (additionalActionLoggers)
      # if there is only one LoggingModelVerifier, then always verify the log action
      # if there more then one, then only verify the main action logger
      # there is no way yet to select that
      additionalActionLoggers.map((aLogger)=> @_registerToActionLogger(aLogger, true))
    if (@areModelsEqual())
      console.log("successful created LoggingModelVerifier for #{mainModel.getDebugLabel()}")
    else
      console.warn("problems with creating LoggingModelVerifier for #{mainModel.getDebugLabel()}")
      @showVerifyError()
#    console.log("created LoggingModelVerifier for actionLogger: " + JSONR.stringify(actionLogger))

  _registerToActionLogger: (actionLogger, verify)->
    realActionLogger = if (actionLogger instanceof window.ut.commons.actionlogging.ActionLoggerWrapper)
      actionLogger.actionLogger
    else
      actionLogger
    realActionLogger.addLogListener({
        logAction: (activityStreamObject)=>
          @logAction(activityStreamObject, verify)
      }
    )

  getVerifyModel: () ->
    @_verifyModel

  setErrorHandler: (errorHandler)->
    @_errorHandler = errorHandler

  setSyncVerifyModel: (syncVerifyModel)->
    @_syncVerifyModel = syncVerifyModel

  getSyncVerifyModel: ()->
    @_syncVerifyModel

  setShowJsonString: (showJsonString)->
    @_showJsonString = showJsonString

  getShowJsonString: ()->
    @_showJsonString

  areModelsEqual: ->
    @_mainModel.equals(@_verifyModel)

  showVerifyError: (activityStreamObject)=>
    mainModelResource = @_mainModel.getResource()
    verifyModelResource = @_verifyModel.getResource()
    mainModelJson = JSON.stringify(mainModelResource)
    verifyModelJson = JSON.stringify(verifyModelResource)
    metadataDifferent = JSON.stringify(mainModelResource.metadata) != JSON.stringify(verifyModelResource.metadata)
    contentDifferent = JSON.stringify(mainModelResource.content) != JSON.stringify(verifyModelResource.content)
    showModel = (label, modelResource)=>
      modelPartLabel = ""
      modelPartObject = modelResource
      json = ""
      if (metadataDifferent && contentDifferent)
      else if (metadataDifferent && !contentDifferent)
        modelPartLabel = "metadata"
        modelPartObject = modelResource.metadata
      else if (!metadataDifferent && contentDifferent)
        modelPartLabel = "content"
        modelPartObject = modelResource.content
      if (@_showJsonString)
        json = JSON.stringify(modelPartObject)
      console.log("#{label} model resource: #{modelPartLabel}")
      console.log(modelPartObject)
      if (json)
        console.log(json)

    differentMessage = "The verify model is different from the main model after applying log action: "
    differentMessage += "#{@_mainModel.getActionLogger().getShortActionLogDescription(activityStreamObject)}!\n"
    differentMessage += "Parts that are different:"
    differentParts = ""
    if (metadataDifferent)
      differentParts += " metadata"
    if (contentDifferent)
      differentParts += " content"
    console.warn(differentMessage + differentParts)
    console.log("activity stream object:")
    if (activityStreamObject)
      console.log(activityStreamObject)
    else
      console.log("no activityStreamObject")
    showModel("main", mainModelResource, mainModelJson)
    showModel("verify", verifyModelResource, verifyModelJson)
    if (@_showJsonString)
      console.log("You can copy and compare the two resource strings on: http://nv.github.io/objectDiff.js/")
    if (@_errorHandler)
      displayMessage = "Error syncing from log action:<br/>#{activityStreamObject.verb} of #{activityStreamObject.object.objectType}." +
        "<br/>There are differences in the#{differentParts}."
      error = {
        activityStreamObject: activityStreamObject
        mainModelResource: mainModelResource
        verifyModelResource: verifyModelResource
      }
      @_errorHandler.reportError(displayMessage, displayMessage, error)

  logAction: (activityStreamObject, verify = true)=>
    isProcessOrientedLogAction = ->
      switch activityStreamObject.verb
        when "access", "start", "cancel", "send", "receive"
          true
        else
          false

    updateStoredState = () =>
      @_lastMainModelJson = JSON.stringify(@_mainModel.getResource())
#      console.log("new @_lastMainModelJson:\n#{@_lastMainModelJson}")

    if (!@_collaborationInProgress)
      if (!isProcessOrientedLogAction())
        if (verify)
          if (@_syncVerifyModel && @_lastMainModelJson)
            @_verifyModel.loadFromResource(JSON.parse(@_lastMainModelJson))
          @_verifyModel.applyLogAction(activityStreamObject, (error)=>
            if (error)
              console.error("failed to apply activity stream object:")
              console.log(activityStreamObject)
            else
              updateStoredState()
              if (@areModelsEqual())
                console.log("Correctly updated the sync model for log action: #{@_mainModel.getActionLogger().getShortActionLogDescription(activityStreamObject)}!")
              else
                @showVerifyError(activityStreamObject)
          )
        else
          # just update the stored state
          updateStoredState()
      else
        if (activityStreamObject.verb == "start")
          if (activityStreamObject.object && activityStreamObject.object.objectType == "collaboration")
            @_collaborationInProgress = true
#    else
#      console.log("not verifying log actions, because there is a collaboration in progress")

