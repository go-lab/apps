"use strict"

window.ut ?= {}
window.ut.commons ?= {}
window.ut.commons.actionlogging = window.ut.commons.actionlogging || {}

window.ut.commons.actionlogging.collideUrl = "http://golab.collide.info/activity"

debug = false
#debug = true

class window.ut.commons.actionlogging.ActionLogger

  constructor: (metadataHandler) ->
    @_debug = debug
    if (@_debug)
      console.log("Initializing ActionLogger.")
      console.log("...setting default logging target: nullLogging.")
    try
      metadataHandler.getMetadata()
      @metadataHandler = metadataHandler
    catch error
      throw "ActionLogger needs a MetadataHandler at construction!"
    # the defaults...
    @loggingTarget = @nullLogging
    @loggingUrl = null
    @loggedApplicationStarted = false
    @logListeners = []

  addLogListener: (logListener)->
    @logListeners.push(logListener)

  removeLogListener: (logListener)->
    index = @logListeners.indexOf(logListener)
    if (index >= 0)
      @logListeners.splice(index, 1)

  setLoggingTarget: (newLoggingTarget) ->
    if (typeof newLoggingTarget == "string")
      console.log("setLoggingTarget(#{newLoggingTarget})") if @_debug
      @loggingTarget = switch newLoggingTarget.toLowerCase()
        when "null"
          @nullLogging
        when "console"
          @consoleLogging
        when "consoleshort"
          @consoleLoggingShort
        when "consoleobject"
          @consoleLoggingObject
        when "dufftown"
          @loggingUrl = window.ut.commons.actionlogging.collideUrl
          @httpPostLogging
        when "opensocial"
          @opensocialLogging
        else
          @loggingUrl = newLoggingTarget
          @httpPostLogging
    else
      @loggingTarget = newLoggingTarget

  setLoggingTargetByName: (newLoggingTargetName) ->
    console.log("ActionLogger: setting logging target (by name) to #{newLoggingTargetName}") if @_debug
    if newLoggingTargetName is "null" then @loggingTarget = @nullLogging
    else if newLoggingTargetName is "console" then @loggingTarget = @consoleLogging
    else if newLoggingTargetName is "consoleShort" then @loggingTarget = @consoleLoggingShort
    else if newLoggingTargetName is "dufftown" then @loggingTarget = @dufftownLogging
    else if newLoggingTargetName is "opensocial" then @loggingTarget = @opensocialLogging
    else
      console.warn "ActionLogger: unknown logging target, setting to 'null'."
      @loggingTarget = @nullLogging

  checkVerb: (verb) ->
    # check if verb is accepted (see list of verbs at bottom of this class)
    verbAccepted = false
    for verbKey, verbValue of @verbs
      if verb is verbValue
        verbAccepted = true
    if not verbAccepted
      console.warn "ActionLogger: unknown verb: #{verb}"

  createActivityStreamObject: (verb, object) ->
    activityStreamObject = {}
    activityStreamObject.published = new Date().toISOString()
    activityStreamObject.actor = @metadataHandler.getActor()
    activityStreamObject.verb = verb
    activityStreamObject.object = object
    activityStreamObject.target = @metadataHandler.getTarget()
    activityStreamObject.generator = @metadataHandler.getGenerator()
    activityStreamObject.provider = @metadataHandler.getProvider()
    activityStreamObject

  log: (verb, object, async = true) =>
    @checkVerb(verb)
    activityStreamObject = {}
    try
      activityStreamObject = @createActivityStreamObject(verb, object)
      # ...and send it away
      @loggingTarget(activityStreamObject, async)
    catch error
      console.warn "something went wrong during logging:"
      console.warn error

    sendLogActionToListener = (logListener)->
      logListener.logAction(activityStreamObject)
    #      try
    #        logListener.logAction(activityStreamObject)
    #      catch error
    #        console.warn("something went wrong during logListener.logAction:")
    #        console.warn(error)

    for logListener in @logListeners
      sendLogActionToListener(logListener)
    activityStreamObject

  nullLogging: (action) ->
    return

  consoleLogging: (activityStreamObject) ->
    console.log JSON.stringify(activityStreamObject, undefined, 2)

  getShortActionLogDescription: (activityStreamObject) ->
    verb = activityStreamObject.verb
    objectType = activityStreamObject.object.objectType
    id = if (activityStreamObject.object.id)
      activityStreamObject.object.id
    else
      "not specified"
    resourceType = activityStreamObject.target.objectType
    "#{verb} - #{objectType} of #{resourceType}, id: #{id}"

  consoleLoggingShort: (activityStreamObject) ->
    console.log "ActionLogger: #{@getShortActionLogDescription(activityStreamObject)}"

  consoleLoggingObject: (activityStreamObject) ->
    console.log "ActionLogger: #{@getShortActionLogDescription(activityStreamObject)}, object:"
    console.log activityStreamObject.object

  opensocialLogging: (activityStreamObject) ->
    if osapi isnt undefined
      logObject = {
        "userId": "@viewer",
        "groupId": "@self",
        activity: activityStreamObject
      }
      shortActionLogDescription = @getShortActionLogDescription(activityStreamObject)
      if (@_debug)
        console.log "ActionLogger: logging to Graasp: #{shortActionLogDescription}, logObject:"
        console.log logObject
      osapi.activitystreams.create(logObject).execute (response) =>
        if response.id isnt undefined
          console.log "ActionLogger: sucessfully logged via osapi, response.id: #{response.id}" if @_debug
        else
          console.warn "ActionLogger: something went wrong when sending log action (#{shortActionLogDescription}) via osapi, response:"
          console.warn response
    else
      console.log "ActionLogger: can't log, osapi is undefined."

  httpPostLogging: (activityStreamObject, async = true, loggingUrl = @loggingUrl) ->
    shortActionLogDescription = @getShortActionLogDescription(activityStreamObject)
    console.log("ActionLogger: logging to #{loggingUrl}: #{shortActionLogDescription}")  if @_debug
    $.ajax({
      type: "POST",
      url: loggingUrl,
      data: JSON.stringify(activityStreamObject),
      contentType: "application/json",
      success: (responseData, textStatus, jqXHR) =>
        console.log("POST actionlog success, response: #{responseData}") if @_debug
      error: (responseData, textStatus, errorThrown) =>
        console.log "POST actionlog (#{shortActionLogDescription}) failed: #{responseData.status} (#{responseData.statusText}), response:"
        console.log(JSON.stringify(responseData))
    })

  getDeviceInfo: () ->
    {
      navigator: {
        appCodeName: navigator.appCodeName
        appName: navigator.appName
        appVersion: navigator.appVersion
        geoLocation: navigator.geolocation
        language: navigator.language
        oscpu: navigator.oscpu
        platform: navigator.platform
        product: navigator.product
        userAgent: navigator.userAgent
      }
      browser: head.browser
      screen: head.screen
      features: {
        mobile: head.mobile
        desktop: head.desktop
        touch: head.touch
        portrait: head.portrait
        landscape: head.landscape
        retina: head.retina
        transitions: head.transitions
        transforms: head.transforms
        gradients: head.gradients
        multiplebgs: head.multiplebgs
        boxshadow: head.boxshadow
        borderimage: head.borderimage
        borderradius: head.borderradius
        cssreflections: head.cssreflections
        fontface: head.fontface
        rgba: head.rgba
      }
    }

  logApplicationStarted: () ->
    head = window.head || {}
    app = @metadataHandler.getGenerator()

    if (!@loggedApplicationStarted)
      object = {
        id: app.id
        objectType: "application"
        content: {
          device: @getDeviceInfo()
        }
      }
      @log(@verbs.application_started, object)
      @loggedApplicationStarted = true

  ###
    content-oriented
  ###
  logAdd: (object) ->
    @log(@verbs.add, object)

  logRemove: (object) ->
    @log(@verbs.remove, object)

  logChange: (object) ->
    @log(@verbs.change, object)

# the clear-action indicates the removal of all content,
# typically the object is the current target ->
# if now object is given, the current target is used
  logClear: (object)->
    if (not object?)
      object = @metadataHandler.getTarget()
    @log(@verbs.clear, object)

  ###
   process-oriented
  ###
  logAccess: (object) ->
    @log(@verbs.access, object)

  logStart: (object) ->
    @log(@verbs.start, object)

  logCancel: (object) ->
    @log(@verbs.cancel, object)

  logSend: (object) ->
    @log(@verbs.send, object)

  logReceive: (object) ->
    @log(@verbs.receive, object)

  ###
    storage-oriented
  ###
# use the resource as the object for logging
  logNew: (resource) ->
    @_logStorageAction(@verbs.new, resource)

# use the resource as the object for logging
  logLoad: (resource, async = true) ->
    @_logStorageAction(@verbs.open, resource, async)

# use the resource as the object for logging
  logSaveAs: (resource) ->
    @_logStorageAction(@verbs.create, resource)

# use the resource as the object for logging
  logSave: (resource) ->
    @_logStorageAction(@verbs.update, resource)

# use the resource as the object for logging
  logDelete: (resource) ->
    @_logStorageAction(@verbs.delete, resource)

  _logStorageAction: (verb, resource, async = true) ->
    object = {
      objectType: "resource"
      content: resource
    }
    if (resource.metadata && resource.metadata.id)
      object.id = resource.metadata.id
    @log(verb, object, async)

  verbs: {
# content-oriented verbs
# indicate that the content/model of a tool has changed
    add: "add"
    remove: "remove"
    change: "change"
    clear: "clear"

# process-oriented verbs
# no change to the content/model of a tool has been made,
# but still the user has made a meaningful action
    access: "access"
    start: "start"
    cancel: "cancel"
    send: "send"
    receive: "receive"

# storage-oriented verbs
# the user has stored or retrieved something, or created a new resource from scratch
    new: "new"
    open: "open"
    create: "create"
    update: "update"
    delete: "delete"

# used to indicate the start of a tool, lab, ils, etc.
# the object specifies 'what' has been started
# - in the case of a tool or lab, the object should contain metadata.generator
# - in the case of an ILS, the object should contain metadata.provider
    application_started: "access"
    phase_changed: "access"
  }


class window.ut.commons.actionlogging.ActionLoggerWrapper

  constructor: (@actionLogger)->
    if (!(@actionLogger instanceof window.ut.commons.actionlogging.ActionLogger))
      throw "the actionLogger parameter must be an instance of window.ut.commons.actionlogging.ActionLogger"

  setLoggingTarget: (newLoggingTarget) ->
    @actionLogger.setLoggingTarget(newLoggingTarget)

  getShortActionLogDescription: (activityStreamObject) ->
    @actionLogger.getShortActionLogDescription(activityStreamObject)

  logApplicationStarted: () ->
    @actionLogger.logApplicationStarted()

  ###
  content-oriented
  ###
  logAdd: (object) ->
    @actionLogger.logAdd(object)

  logRemove: (object) ->
    @actionLogger.logRemove(object)

  logChange: (object) ->
    @actionLogger.logChange(object)

# the clear-action indicates the removal of all content,
# typically the object is the current target ->
# if now object is given, the current target is used
  logClear: (object)->
    @actionLogger.logClear(object)

  ###
   process-oriented
  ###
  logAccess: (object) ->
    @actionLogger.logAccess(object)

  logStart: (object) ->
    @actionLogger.logStart(object)

  logCancel: (object) ->
    @actionLogger.logCancel(object)

  logSend: (object) ->
    @actionLogger.logSend(object)

  logReceive: (object) ->
    @actionLogger.logReceive(object)

  ###
    storage-oriented
  ###
# use the resource as the object for logging
  logNew: (resource) ->
    @actionLogger.logNew(resource)

# use the resource as the object for logging
  logLoad: (resource) ->
    @actionLogger.logLoad(resource)

# use the resource as the object for logging
  logSaveAs: (resource) ->
    @actionLogger.logSaveAs(resource)

# use the resource as the object for logging
  logSave: (resource) ->
    @actionLogger.logSave(resource)

# use the resource as the object for logging
  logDelete: (resource) ->
    @actionLogger.logDelete(resource)

  log: (action, object) ->
    @actionLogger.log(action, object)
