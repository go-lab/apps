"use strict";

#if (GLOBAL)
#  GLOBAL.ut = GLOBAL.ut || {}
#  @.ut = GLOBAL.ut

@.ut = @.ut || {}
@.ut.commons = @.ut.commons || {}

JSONR = @.JSONR

EventEmitter = this.EventEmitter
#if (EventEmitter == undefined)
#  EventEmitter = require("../../libs/js/eventEmitter")

#console.log(EventEmitter)

class @.ut.commons.EventArray
  constructor: (@resourceEventEmitterModel, @eventLabel) ->
    @_array = []
    Object.defineProperties(@, {
      length: {
        get: ->
          @_array.length
      }
    })

  push: (value) ->
    @_array.push(value)
    @resourceEventEmitterModel.emitEvent("#{@eventLabel}Pushed", [@getEventValue(value)])
    @resourceEventEmitterModel.emitModelChanged()

  getEventValue: (value)->
    value

  remove: (index) ->
    @_array.splice(index, 1)
    @resourceEventEmitterModel.emitEvent("#{@eventLabel}Removed", [index])
    @resourceEventEmitterModel.emitModelChanged()

  clear: ->
    @_array.splice(0, @_array.length)
    @resourceEventEmitterModel.emitEvent("#{@eventLabel}Cleared", [])
    @resourceEventEmitterModel.emitModelChanged()

  isEmpty: ->
    @_array.length == 0

  getValue: (index)->
    @_array[index]

  setValue: (index, value)->
    if (@_array[index] != value)
      @_array[index] = value
      @resourceEventEmitterModel.emitEvent("#{@eventLabel}ValueChanged", [index, @getEventValue(value)])
      @resourceEventEmitterModel.emitModelChanged()

  swapValues: (index1, index2) ->
    value1 = @_array[index1]
    @_array[index1] = @_array[index2]
    @_array[index2] = value1
    @resourceEventEmitterModel.emitEvent("#{@eventLabel}ValuesSwapped", [index1, index2])
    @resourceEventEmitterModel.emitEvent("#{@eventLabel}ValueChanged", [index1, @getEventValue(@_array[index1])])
    @resourceEventEmitterModel.emitEvent("#{@eventLabel}ValueChanged", [index2, @getEventValue(@_array[index2])])
    @resourceEventEmitterModel.emitModelChanged()

  getValues: (skipEmptyValues = true) ->
    values = if (skipEmptyValues)
      for value in @_array when value.length > 0
        value
    else
      @_array.slice()
    values

  setValues: (values)->
    if (JSON.stringify(@_array) != JSON.stringify(values))
      @_array = values
      eventValues = values.map((value)=>
        @getEventValue(value)
      )
      @resourceEventEmitterModel.emitEvent("#{@eventLabel}ValuesChanged", eventValues)
      @resourceEventEmitterModel.emitModelChanged()


class @.ut.commons.NamedEventArray extends @.ut.commons.EventArray

  addNewName: ->
    @push("")

  getNameValue: (index)->
    @getValue(index)

  setNameValue: (index, value)->
    @setValue(index, value)

  getNameValues: (skipEmptyValues = true) ->
    @getValues(skipEmptyValues)

  getValues: (skipEmptyValues = true) ->
    values = super(false)
    if (skipEmptyValues)
      nonEmptyValues = []
      for i in [0...values.length]
        nameValue = @getNameValue(i)
        if (nameValue.length>0)
          nonEmptyValues.push(values[i])
      nonEmptyValues
    else
      values


class @.ut.commons.ResourceEventEmitterModel extends EventEmitter
  constructor: (environmentHandlers, resourceType)->
    if (typeof environmentHandlers != "object")
      throw "environmentHandlers must be the result of the createEnvironmentHandlers call"
    if (typeof resourceType != "string")
      throw "resourceType must be a non empty string"
    if (resourceType.length == 0)
      throw "resourceType must be a non empty string"
    if (!environmentHandlers[resourceType])
      throw "resourceType (#{resourceType}) must be defined in the environmentHandlers"
    @storageHandler = environmentHandlers[resourceType].storageHandler
    @actionLogger = environmentHandlers[resourceType].actionLogger
    @languageHandler = environmentHandlers.languageHandler
    if (!@storageHandler)
      console.error("storageHandler not defined!")
    if (!@actionLogger)
      console.error("actionLogger not defined!")
    if (!@languageHandler)
      console.error("languageHandler not defined!")
    @_id = null
    @_metadata = null
    #    @_content = null
    @_resource = null
    @_updateFromExternalStateInProgress = false
    @_emitEvents = true
    @_debug = false
    #    @_debug = true
    @_isSaved = false
    @_checkResourceTypes = true
    @_isChanged = false
    @_firstChangeMillis = 0
    @_lastChangeMillis = 0
    @addListener("modelChanged", @_changed)
    ###
    # set the startupFinished property to false (for example in the .run method),
    # if you want to delay the initial handling of model loading in the loadSaveUI
    # and set it to true again, when the loadSaveUI can do the initial handling of model loading
    ###
    @_configUISettings = {}
    Object.defineProperties(@, {
      "startupFinished": {
        writable: true
        value: true
      }
      "mainModelClass": {
        writable: true
        value: true
      }
      configUISettings: {
        get: @getConfigUISetting
      }
      id: {
        get: @getId
      }
      updateFromExternalStateInProgress: {
        get: () ->
          @_updateFromExternalStateInProgress
      }
      environmentHandlers: {
        get: () ->
          environmentHandlers
      }
    })

  ###
  # create new instance of this model
  #
  # this must most likely be overwritten with no call to super
  ###
  createNewModel: () ->
    new window.ut.commons.ResourceEventEmitterModel(@environmentHandlers, @getResourceType())

  ###
  # called when the loadSaveUI has finished the initial loading
  ###
  initialLoadingFinished: ->

  getConfigUISetting: ->
    @_configUISettings

  getId: ->
    @_id

  getPublished: () ->
    if (@_metadata)
      @_metadata.published
    else
      ""

  isSaved: ->
    @_isSaved

  setSaved: (saved)->
    if (@_debug) then console.log("#{@getDebugLabel()}.setSaved(#{saved})")
    @_isSaved = saved

  findIfSaved: ()->
    if (@_metadata && @_metadata.id)
      @storageHandler.resourceExists(@_metadata.id, (error, exists)=>
        if (error)
          console.error("#{@getDebugLabel()}: storageHandler.resourceExists failed: #{error}")
          @setSaved(false)
        else
          @setSaved(exists)
      )
    else
      @setSaved(false)

  isReadOnly: ->
    @getMetadataFlag("readOnly")

  setMetadataFlag: (flag, value)->
    @storageHandler.getMetadataHandler().setMetadataFlag(flag, value)
    if (@_metadata)
      @_metadata.flags = @_metadata.flags || {}
      @_metadata.flags[flag] = value

  getMetadataFlag: (flag) ->
    if (@_metadata)
      @_metadata.flags = @_metadata.flags || {}
      @_metadata.flags[flag]
    else
      @storageHandler.getMetadataHandler().getMetadataFlag(flag)

  isContentCopy: ->
    false

  isChangeTrackingFullyImplemented: ->
    false

  isChanged: ->
    @_isChanged

  clearChanged: ->
    @_isChanged = false
    @_firstChangeMillis = 0
    @_lastChangeMillis = 0

  _changed: ->
    @_isChanged = true
    @_lastChangeMillis = Date.now()
    if (@_firstChangeMillis == 0)
      @_firstChangeMillis = @_lastChangeMillis

  isEmpty: ->
    false

  getMetadata: ->
    @_metadata

  getResource: ->
    {
    metadata: @getMetadata()
    content: @getResourceContent()
    }

  getResourceType: ->
    if (@storageHandler && @storageHandler.getMetadataHandler && @storageHandler.getMetadataHandler().getTarget)
      @storageHandler.getMetadataHandler().getTarget().objectType
    else
      "?? resource type ??"

  getResourceTarget: ->
    @storageHandler.getMetadataHandler().getTarget()

  getPublished: ->
    if (@_metadata)
      @_metadata.published
    else
      @storageHandler.getMetadataHandler().published

  getNickName: ->
    if (@_metadata)
      @_metadata.actor.displayName
    else
      @storageHandler.getMetadataHandler().actor.displayName

  getApplication: ->
    @storageHandler.getMetadataHandler().getGenerator().displayName

  getAppId: ->
    if (@_metadata)
      @_metadata.generator.id
    else
      @storageHandler.getMetadataHandler().getGenerator().id

  getStorageHandler: ->
    @storageHandler

  getMetadataHandler: ->
    @storageHandler.getMetadataHandler()

  getActionLogger: ->
    @actionLogger

  getLanguageHandler: ->
    @languageHandler

  getDebugLabel: ->
    "#{@getResourceType()}:#{@getDisplayName()}"

  loadFromResourceId: (resourceId, callback) ->
    @storageHandler.readResource(resourceId, (error, resource) =>
      if (error)
        callback(error)
      else
        @loadFromResource(resource)
        callback(null)
    )

  loadFromResource: (resource, importing = false) ->
    if (@_debug)
      console.log("#{@getDebugLabel()}.loadFromResource:")
      console.log(resource)
    if (resource.metadata && resource.metadata.target)
      if (@_checkResourceTypes && @getResourceType() != resource.metadata.target.objectType)
        console.error("trying to load a resource of type '#{resource.metadata.target.objectType}', but it should be '#{@getResourceType()}'")
    @_emitEvents = false
    @_id = if (resource.metadata)
      resource.metadata.id
    else
      null
    @_metadata = resource.metadata
    @loadContentFromResource(resource.content)
    @_resource = resource
    # copy resource content specific metadata
    if (resource.metadata && resource.metadata.target)
      @storageHandler.getMetadataHandler().setTarget(resource.metadata.target)
    if (importing)
      @updateIdsAfterImportingResource()
    @setSaved(true) # assume it is saved
    @findIfSaved()
    @_emitEvents = true
    @emitModelLoaded()
    @clearChanged()

  updateIdsAfterImportingResource: ->
    @updateIdsInMetadataAfterImportingResource()
    @updateIdsInContentAfterImportingResource()

  updateIdsInMetadataAfterImportingResource: ->
    if (@_id)
      @storageHandler.getMetadataHandler().updateIdsAfterImporting()
      @_id = @storageHandler.getMetadataHandler().getId()
      if (@_metadata)
        @_metadata.id = @_id
        if (@_metadata.target)
          @_metadata.target.id = @storageHandler.getMetadataHandler().getTargetId()

  ###
  # override if needed and don't call super()
  ###
  updateIdsInContentAfterImportingResource: ->

  importFromResource: (importResource) ->
    resource = JSON.parse(JSON.stringify(importResource))
    @loadFromResource(resource, true)

  importFromFile: (file, content) ->
    console.log("importFromFile(#{JSON.stringify(file)}):")
    console.log("file: name: #{file.name}, type: #{file.type}, size: #{file.size}")
    # just try to see if the content is json and try to load it as a resource
    resource = JSON.parse(content)
    @importFromResource(resource)
#    console.log(content)
#    resource = JSON.parse(JSON.stringify(importResource))
#    @loadFromResource(resource)

  clear: ->
    if (@_debug)
      console.log("#{@getDebugLabel()}.clear()")
    @_id = null
    @_metadata = null
    @_resource = null
    @setSaved(false)
    @clearContent()
    @emitEvent("modelCleared")
    @emitModelChanged()
    @clearChanged()

  deleteResource: (callback)->
    @storageHandler.deleteResource(@getId(), callback)

  hasResource: ->
    @getId() != null

  reload: ->
    @loadFromResource(@getResource())

  ###
  # override if needed
  ###
  equals: (otherResource)->
    myResourceJsonString = JSON.stringify(@getResource())
    otherResourceJsonString = JSON.stringify(otherResource.getResource())
    myResourceJsonString == otherResourceJsonString

  ###
  # override and don't call super()
  ###
  getResourceContent: ->
#    @_content
    {
    configUISettings: @_configUISettings
    }
  loadContentFromExternalState: (content) ->
    @_updateFromExternalStateInProgress = true
    try
      @loadContentFromResource(content)
    finally
      @_updateFromExternalStateInProgress = false

  loadContentFromResource: (content)->
    @loadFromResourceContent(content)
    @emitContentLoaded()
    @clearChanged()

  ###
  # override and call super()
  ###
  loadFromResourceContent: (content)->
    if (content.configUISettings)
      @_configUISettings = content.configUISettings
#    @_content = content

  ###
  # override and call super() at the end
  ###
  clearContent: ->
#    @_content = null
    @emitEvent("contentCleared")
    @emitModelChanged()

  applyLogAction: (activityStreamObject, callback)->
    getResourceType = ->
      resourceType = activityStreamObject.object.objectType
      if (resourceType == "resource")
        resource = activityStreamObject.object.content
        if (resource.metadata && resource.metadata.target && resource.metadata.target.objectType)
          resourceType = resource.metadata.target.objectType
        else
          resourceType = activityStreamObject.target.objectType
      resourceType

    switch activityStreamObject.verb
      when "open"
        @applyLogLoad(activityStreamObject, getResourceType(), callback)
      when "create"
        @applyLogSaveAs(activityStreamObject, getResourceType(), callback)
      when "update"
        @applyLogSave(activityStreamObject, getResourceType(), callback)
      when "delete"
        @applyLogDelete(activityStreamObject, getResourceType(), callback)
      when "clear"
        @applyLogClear(activityStreamObject, getResourceType(), callback)
      when "add"
        @applyLogAdd(activityStreamObject, callback)
      when "change"
        @applyLogChange(activityStreamObject, callback)
      when "remove"
        @applyLogRemove(activityStreamObject, callback)
      else
        console.log("no code yet for action logging verb: #{activityStreamObject.verb}")

  ###
  # override if needed
  ###
  applyLogLoad: (activityStreamObject, resourceType, callback)->
    if (resourceType == @getResourceType())
      @loadFromResource(activityStreamObject.object.content)
    else if (resourceType == "configuration")
      console.log("not syncing loading of the configuration model")
    else
      console.warn("Wrong resource type: #{resourceType}, expected: #{@getResourceType()}")
    callback(null) if callback?

  ###
  # override if needed
  ###
  applyLogSaveAs: (activityStreamObject, resourceType, callback)->
# just load the just saved resource
    @applyLogLoad(activityStreamObject, resourceType, callback)

  ###
  # override if needed
  ###
  applyLogSave: (activityStreamObject, resourceType, callback)->
# just load the just saved resource
    @applyLogLoad(activityStreamObject, resourceType, callback)

  ###
  # override if needed
  ###
  applyLogDelete: (activityStreamObject, resourceType, callback)->
# just load the just saved resource
    @applyLogClear(activityStreamObject, resourceType, callback)

  ###
  # override if needed
  ###
  applyLogClear: (activityStreamObject, resourceType, callback)->
    if (resourceType == @getResourceType())
      @clearContent()
      if (activityStreamObject.object.content.initialContent)
        @loadContentFromResource(activityStreamObject.object.content.initialContent)
    else
      console.warn("Wrong resource type: #{resourceType}, expected: #{@getResourceType()}")
    callback(null) if callback?

  ###
  # override if used
  ###
  applyLogAdd: (activityStreamObject, callback)->
    console.warn("please override the applyLogAdd method!")
    callback(null) if callback?

  ###
  # override if used
  ###
  applyLogChange: (activityStreamObject, callback)->
    callbackUsed = false
    switch (activityStreamObject.object.objectType)
      when "golabSection"
        key = activityStreamObject.object.id
        value = activityStreamObject.object.content
        @configUISettings.showHideSections = @configUISettings.showHideSections || {}
        @configUISettings.showHideSections[key] = value
      when "undo", "redo"
        resourceType = "????"
        resource = activityStreamObject.object.content
        if (resource.metadata && resource.metadata.target && resource.metadata.target.objectType)
          resourceType = resource.metadata.target.objectType
        @applyLogLoad(activityStreamObject, resourceType, callback)
        callbackUsed = true
      else
        console.warn("Unknown object type: #{activityStreamObject.object.objectType}")
    if (!callbackUsed)
      callback?(null)

  ###
  # override if used
  ###
  applyLogRemove: (activityStreamObject, callback)->
    console.warn("please override the applyLogRemove method!")
    callback(null) if callback?

  emitEvents: ->
    @_emitEvents

  emitEvent: (event, args)->
    if (@emitEvents())
      if (@_debug)
        console.log("#{@getDebugLabel()}.emitEvent(#{JSONR.stringify(arguments)})")
      super(event, args)

  emitModelChanged: (bigChange = true)->
    @_changed()
    @emitEvent("modelChanged", [{bigChange: bigChange}])

  ###
  # you can override this, if you want to emit events for the loading of the model
  # when you override it, call super() at the end
  ###
  emitModelLoaded: ->
    @emitEvent("modelLoaded")
    @emitModelChanged()

  emitContentLoaded: ->
    @emitEvent("contentLoaded")
    @emitModelChanged()

  emitModelResourceCreated: ->
    @emitEvent("modelResourceCreated")

  emitModelResourceUpdated: ->
    @emitEvent("modelResourceUpdated")

  addListener: (event, listener)->
    if (@_debug)
      console.log("#{@getDebugLabel()}.addListener(#{event})")
    super

  addListeners: (events, listener)->
    for event in events
      @addListener(event, listener)

  createResource: (callback) ->
    content = @getResourceContent()
    @storageHandler.createResource(content, (error, resource)=>
      if (!error)
        @_resource = resource
        @_id = resource.metadata.id
        @_metadata = resource.metadata
        @setSaved(true)
        @emitModelResourceCreated()
        @clearChanged()
        if (@_debug)
          console.log("#{@getDebugLabel()}.createdResource:")
          console.log(resource)
      if (callback)
        callback(error, resource)
    )

  getResourceBundle: ()->
    id = @getId()
    content = @getResourceContent()
    resourceBundle = if (id)
      @storageHandler.getResourceBundle(content, id)
    else
      @storageHandler.getResourceBundle(content)
    @_resource = resourceBundle
    @_id = resourceBundle.metadata.id
    @_metadata = resourceBundle.metadata
    if (@_debug)
      console.log("#{@getDebugLabel()}.getResourceBundle:")
      console.log(resourceBundle)
    resourceBundle

  updateResource: (callback, async = true)->
    content = @getResourceContent()
    #    console.log("---- start updateResource")
    @storageHandler.updateResource(@getId(), content, (error, resource)=>
#      console.log("---- end updateResource")
      if (!error)
        @_resource = resource
        @_id = resource.metadata.id
        @_metadata = resource.metadata
        @setSaved(true)
        @emitModelResourceUpdated()
        @clearChanged()
        if (@_debug)
          console.log("#{@getDebugLabel()}.updateResource:")
          console.log(resource)
      if (callback)
        callback(error, resource)
    , async)

  getDisplayName: () ->
    if (@_metadata && @_metadata.target)
      @_metadata.target.displayName
    else if (@storageHandler && @storageHandler.getMetadataHandler && @storageHandler.getMetadataHandler().getTargetDisplayName)
      @storageHandler.getMetadataHandler().getTargetDisplayName()
    else
      "?? display name ??"

  setDisplayName: (displayName) ->
    if (displayName != @getDisplayName)
      @storageHandler.getMetadataHandler().setTargetDisplayName(displayName)
      if (@_metadata && @_metadata.target)
        @_metadata.target.displayName = displayName
      @emitEvent("displayNameChanged", [displayName])
      @emitModelChanged()

  getResourceDescription: ->
    if (@_resource)
      @storageHandler.getResourceDescription(@_resource)
    else
      {
      id: @getId()
      title: @storageHandler.getMetadataHandler().getTarget().displayName
      type: @storageHandler.getMetadataHandler().getTarget().objectType
      tool: @storageHandler.getMetadataHandler().getGenerator().displayName
      author: @storageHandler.getMetadataHandler().getActor().displayName
      modified: new Date(0)
      }

  loadLatestResource: (callback)->
    if (@_debug)
      console.log("#{@getDebugLabel()}.loadLatestResource for type #{@getResourceType()}")
    @storageHandler.readLatestResource(@getResourceType(), (error, latestResource)=>
      if (latestResource)
        try
          if (@_debug)
            console.log("found a latest resource of type #{@getResourceType()}")
          @loadFromResource(latestResource)
          @setSaved(true)
          @clearChanged()
          callback?(error, latestResource)
        catch exception
#          console.log(exception)
          callback?(exception, null)
      else if (error)
        console.error("failed to read latest resource: #{error}")
        callback?(error, latestResource)
      else
        if (@_debug)
          console.log("did not find a latest resource of type #{@getResourceType()}")
        callback?(error, latestResource)
    )

  canReloadFromStorage: ()->
    @isSaved() && @getId() != null && @getId().length > 0

  reloadFromStorage: (callback)->
    if (@canReloadFromStorage())
      @loadFromResourceId(@getId(), callback)
    else
      setTimeout(callback)

  equalValues: (value1, value2)->
    if (value1 == value2)
      true
    else if (typeof value1 != typeof value2)
      false
    else if (typeof value1 != "object")
      value1 == value2
    else
      JSON.stringify(value1) == JSON.stringify(value2)


#if (typeof module == 'object' && module.exports)
#  module.exports = {
#    ut: {
#      commons: {
#        ResourceEventEmitterModel: @.ut.commons.ResourceEventEmitterModel
#        EventArray: @.ut.commons.EventArray
#        NamedEventArray: @.ut.commons.NamedEventArray
#      }
#    }
#    ResourceEventEmitterModel: @.ut.commons.ResourceEventEmitterModel
#    EventArray: @.ut.commons.EventArray
#    NamedEventArray: @.ut.commons.NamedEventArray
#  }