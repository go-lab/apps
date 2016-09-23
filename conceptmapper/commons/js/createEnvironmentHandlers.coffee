"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}
@golab.ils = @golab.ils || {}
ils = @golab.ils
ils.context = @golab.ils.context || {}
ils.storage = @golab.ils.storage || {}
@ude = @ude || {}
@ude.commons = @ude.commons || {}

$ = window.$

###
  the dummy variable is only there to prevent unresolved variables/properties warnings in Intellij
  it is never used in the code
###
dummy = {
  storage: {}
  options: {
    cache: true
    notificationServer: {}
  }
  when: {}
}

DEFAULT_NOTIFICATION_SERVER = "http://golab.collide.info:80"

debug = false
#debug = true

forceLocal = false
#forceLocal = true

cacheCleared = false

createSingleEnvironmentHandlers = (documentType, toolName, desiredLanguage, options, callBack)->
  if typeof options == 'function'
    callBack = options
    options = {}

  receivedMetadataHandler = null
  receivedLanguageHandler = null

  getParameterFromUrl = (key) ->
    key = key.toLowerCase()
    parameter = null
    queryPart = location.search.trim().toLowerCase()
    if (queryPart && queryPart[0] == "?")
      parts = queryPart.substring(1).split("&")
      for part in parts
        partParts = part.split("=")
        if (partParts.length == 2 && partParts[0] == key)
          parameter = partParts[1]
    parameter

  findDesiredStorageServer = (metadataHandler)->
    if (forceLocal)
      return "local"
    server = getParameterFromUrl("storageServer")
    if server
      server = switch server.toLowerCase()
        when "local", "tomtest", "vault", "mongo",  "localmongo", "memory"
          server.toLowerCase()
        else
          console.warn("unknown storageServer parameter: #{server}")
          null
    if !server
      server = switch metadataHandler.getContext()
        when ils.context.standalone
          "mongo"
        when ils.context.ils, ils.context.graasp
          "vault"
        when ils.context.preview
          "memory"
        else
          "local"
    server

  findDesiredNotificationServer = (metadataHandler)->
    if (forceLocal || options.notificationServer == null)
      return null
    server = getParameterFromUrl("notificationServer")
    if server is "null"
      null
    else if server is null
      switch metadataHandler.getContext()
        when ils.context.preview, ils.context.unknown
          null
        else
          options.notificationServer
    else
      server

  getDesiredStorageHandler = (metadataHandler) ->
    if not metadataHandler?
# error case, no metadataHandler was given
      throw new Error("MetadataHandler is needed to create a StorageHandler, but parameter was undefined.")
    desiredStorageServer = findDesiredStorageServer(metadataHandler)
    storageHandler = switch desiredStorageServer
      when "local"
        new ils.storage.LocalStorageHandler(metadataHandler)
      when "tomtest"
        new ils.storage.MongoStorageHandler(metadataHandler, "http://tomtest.gw.utwente.nl:8080")
      when "localmongo"
        new ils.storage.MongoStorageHandler(metadataHandler, "http://localhost:8000")
      when "vault"
        new ils.storage.VaultStorageHandler(metadataHandler)
      when "mongo"
#        new ils.storage.MongoIISStorageHandler(metadataHandler, "http://go-lab.gw.utwente.nl/mongoStorage/iis_scripts")
        new ils.storage.MongoIISStorageHandler(metadataHandler, "#{window.location.protocol}//go-lab.gw.utwente.nl/mongoStorage/iis_scripts")
      when "memory"
        new ils.storage.MemoryStorageHandler(metadataHandler)
      else
        console.warn("Unknown storage server: #{desiredStorageServer}")
        new ils.storage.LocalStorageHandler(metadataHandler)

    switch metadataHandler.getContext()
      when ils.context.preview, ils.context.direct, ils.context.unknown
        storageHandler.setForUserFilter(false)
        storageHandler.setForAppIdFilter(false)
        storageHandler.setForProviderFilter(false)

    [storageHandler, desiredStorageServer]

  getDesiredLoggingTarget = (metadataHandler) ->
    if not metadataHandler?
# no metadataHandler was given -> warning
      console.warn("No metadataHandler was given to find the loggingTarget, use 'null' as default.")
      return "null"
    loggingTarget = getParameterFromUrl("loggingTarget")
    if !loggingTarget
      loggingTarget = switch metadataHandler.getContext()
        when ils.context.standalone
          "consoleObject"
          "consoleShort"
        when ils.context.ils, ils.context.graasp
          "openSocial"
        else
          "null"
    loggingTarget

  getNotificationClient = (metadataHandler) ->
    NotificationClient = window.ude.commons.NotificationClient.bind(null, metadataHandler)
    DisabledNotificationClient = window.ude.commons.DisabledNotificationClient
    desiredServer = findDesiredNotificationServer(metadataHandler)

    if (desiredServer is null)
      return DisabledNotificationClient("Intentionally disabled via query parameters
                                         (eg. 'notificationServer=null') or configuration.")

    if (desiredServer is undefined)
      desiredServer = DEFAULT_NOTIFICATION_SERVER

    if (window.location.protocol is "https:" && desiredServer.indexOf("https:") is 0)
      return DisabledNotificationClient("Preventing mixed content issues since we
                                         are running in https environment but
                                         requesting http server url (#{desiredServer}).")
    NotificationClient(desiredServer)

  getUseStorageCache = (desiredStorageServer)->
    cache = getParameterFromUrl("cache")
    if (cache)
      switch cache.toLocaleLowerCase()
        when "true", "on"
          return true
        when "false", "off"
          return false
    if (options.cache == false)
      return false
    #    return false
    switch desiredStorageServer
      when "local", "tomtest", "vault", "mongo"
        true
      else
        false

  getClearStorageCacheBeforeFirstUse = (desiredStorageServer, metadataHandler)->
#    return false
    switch metadataHandler.getContext()
      when window.golab.ils.context.ils
        false
      else
        true

  checkForReady = ->
    if (receivedMetadataHandler && receivedLanguageHandler)
      if (debug) then console.log "configuring environment handlers for context: #{receivedMetadataHandler.getContext()}"
      notificationClient = getNotificationClient(receivedMetadataHandler)
      actionLogger = new window.ut.commons.actionlogging.ActionLogger(receivedMetadataHandler)
      actionLogger.setLoggingTarget getDesiredLoggingTarget(receivedMetadataHandler)
      storageHandler = null
      desiredStorageServer = null
      [storageHandler, desiredStorageServer] = getDesiredStorageHandler(receivedMetadataHandler)

      if (getUseStorageCache(desiredStorageServer, receivedMetadataHandler))
        clearStorageCacheBeforeFirstUse = getClearStorageCacheBeforeFirstUse(desiredStorageServer,
          receivedMetadataHandler)
        if (clearStorageCacheBeforeFirstUse && !cacheCleared)
          window.golab.ils.storage.clearCachingStorageHandlerCache()
          cacheCleared = true
        window.golab.ils.storage.createCachingStorageHandler(storageHandler, true,
          (error, cachingStorageHandler)->
            if (error)
              console.warn("Something went wrong during the creation of a cache for the storageHandler, no cache wil be used")
              console.warn(error)
              callBack(receivedMetadataHandler, storageHandler, actionLogger, receivedLanguageHandler,
                notificationClient)
            else
              callBack(receivedMetadataHandler, cachingStorageHandler, actionLogger, receivedLanguageHandler,
                notificationClient)
        , toolName)
      else
        callBack(receivedMetadataHandler, storageHandler, actionLogger, receivedLanguageHandler, notificationClient)

  metadataHandlerCallback = (error, metadataHandler)->
    if (error)
      console.error("failed to create metadataHandler: #{error}")
    else
      receivedMetadataHandler = metadataHandler
      checkForReady()

  languageHandlerCallBack = (error, languageHandler)->
    if (error)
      console.error("failed to create languageHandler: #{error}")
      receivedLanguageHandler = "none"
      checkForReady()
    else
      receivedLanguageHandler = languageHandler
      checkForReady()

  # setting initial/default metadata
  metadata = {
# "id" and "published" are only given once a document has been stored
    "id": ""
    "published": ""
    "actor":
      "objectType": "person"
      "id": "unknown"
      "displayName": "unknown"
    "target":
      "objectType": documentType
      "id": ut.commons.utils.generateUUID()
      "displayName": "unnamed #{documentType}"
    "generator":
      "objectType": "application",
      "url": window.location.href,
      "id": ut.commons.utils.generateUUID()
      "displayName": toolName
    "provider":
      "objectType": "ils",
      "url": window.location.href,
      "id": "unknown"
      "inquiryPhase": "unknown"
      "inquiryPhaseId": "unknown"
      "inquiryPhaseName": "unknown"
      "displayName": "unknown"
  }
  if window.gadgets?
    new ils.metadata.GoLabMetadataHandler(metadata, metadataHandlerCallback)
  else
    new ils.metadata.LocalMetadataHandler(metadata, metadataHandlerCallback)
  window.golab.createLanguageHandler(desiredLanguage, languageHandlerCallBack)

updateDefaultTargetNames = (environmentHandlers, documentTypes) ->
  languageHandler = environmentHandlers.languageHandler
  for documentType in documentTypes
    documentTypeDisplay = languageHandler.getMessage("resources.type.name.#{documentType}")
    defaultTargetName = environmentHandlers.languageHandler.getMessage("loadSave.title.unnamed", documentTypeDisplay)
    environmentHandlers[documentType].metadataHandler.setTargetDisplayName(defaultTargetName)

createMultipleEnvironmentHandlers = (documentTypes, toolName, desiredLanguage, options, callBack)->
  if (documentTypes.length == 0)
    throw "documentTypes array may not be empty"
  environmentHandlers = {
    toolName: toolName
  }
  createSingleEnvironmentHandlersPromise = (documentType) =>
#read the phase content, i.e. the apps
    deferred = new $.Deferred()
    createSingleEnvironmentHandlers(documentType, toolName, desiredLanguage, options,
      (metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient)->
        myEnvironmentHandlers = {
          metadataHandler: metadataHandler
          storageHandler: storageHandler
          actionLogger: actionLogger
        }
        environmentHandlers[documentType] = myEnvironmentHandlers
        if (!environmentHandlers.languageHandler)
          environmentHandlers.languageHandler = languageHandler
        if (!environmentHandlers.notificationClient)
          environmentHandlers.notificationClient = notificationClient
        deferred.resolve()
    )
    return deferred.promise()

  createSingleEnvironmentHandlersPromises = []
  for documentType in documentTypes
    createSingleEnvironmentHandlersPromises.push(createSingleEnvironmentHandlersPromise(documentType))
  $.when.apply($, createSingleEnvironmentHandlersPromises).done(() ->
    updateDefaultTargetNames(environmentHandlers, documentTypes)
    console.log("createMultipleEnvironmentHandlers (desired language: #{desiredLanguage}, using: #{environmentHandlers.languageHandler.getLanguage()}):")
    console.log(environmentHandlers)
    callBack(environmentHandlers)
  )


createEnvironmentHandlers = (documentTypes, toolName, desiredLanguage, options, callBack)->
  if typeof options == 'function'
    callBack = options
    options = {}
  if (typeof options.notificationServer == "undefined")
    options.notificationServer = null
  if (Array.isArray(documentTypes))
    createMultipleEnvironmentHandlers(documentTypes, toolName, desiredLanguage, options, callBack)
  else
    createSingleEnvironmentHandlers(documentTypes, toolName, desiredLanguage, options, callBack)

@golab.common.createEnvironmentHandlers = createEnvironmentHandlers
