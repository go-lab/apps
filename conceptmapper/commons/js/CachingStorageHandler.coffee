"use strict";

window.golab = window.golab || {}
window.golab.ils = window.golab.ils || {}
window.golab.ils.storage = window.golab.ils.storage || {}
window.golab.ils.storage.memory = window.golab.ils.storage.memory || {}

_debug = false
#_debug = true
_logCacheStart = false
#_logCacheStart = true

goLabCacheStorageKey = "_goLabCache_"
goLabCacheStorageInfoKey = "_goLabCacheInfo_"

getIdentifyingUrl = ->
  path = window.location.pathname
  subPaths = window.location.pathname.split("/")
  if (subPaths.length > 1)
    switch subPaths[1].toLocaleLowerCase()
      when "production"
        path = subPaths[1]
      when "experiments"
        path = subPaths[1]
        if subPaths.length > 2
          path += "/" + subPaths[2]
      else
        path = ""
  "#{window.location.protocol}//#{window.location.host}/#{path}".toLowerCase()

identifyingUrl = getIdentifyingUrl()

maxCacheAge = 60 * 60 * 1000
#maxCacheAge = 0
maxCacheInitializedWait = 1000*3600*24*365 # make it large, so that it will not happen...
maxCacheInitializedWarnStep = 10000
maxCacheInitializedWaitStep = 100
#maxCacheInitializedWarnStep = 10
#maxCacheInitializedWaitStep = 1

window.golab.ils.storage.createCachingStorageHandler = (storageHandler, tryToReuseCache, callback, toolName = null)->
  if (typeof storageHandler.listAllResourcesForCaching == "function")
    cachingStorageHandler = new CachingStorageHandler(storageHandler, toolName)
    cachingStorageHandler._initCache(tryToReuseCache, (error)->
      if (error)
        callback(error, null)
      else
        if (_debug) then console.log("CachingStorageHandler: created for #{storageHandler.getDebugLabel()}")

        callback(null, cachingStorageHandler)
    )
  else
    if (_debug) then console.log("CachingStorageHandler: cannot use, because it is not supported by #{storageHandler.getDebugLabel()}")
    callback(null, storageHandler)

window.golab.ils.storage.clearCachingStorageHandlerCache = ->
  delete window.sessionStorage[goLabCacheStorageInfoKey]
  if (_debug) then console.log("CachingStorageHandler: cleared the cache")

class CachingStorageHandler
  constructor: (@storageHandler, toolName = null) ->
    @_debug = _debug
#    @_debug = false
#    @_debug = true
    if (toolName)
      @debugLabel = "CachingStorageHandler(#{toolName} - #{@storageHandler.getDebugLabel()})"
    else
      @debugLabel = "CachingStorageHandler(#{@storageHandler.getDebugLabel()})"
    @cacheStorage = window.sessionStorage
    @cacheInfo = null
    @ready = false
    if (@_debug) then console.log("#{@debugLabel}: object created")

  storeImage: (imageData, callback) ->
    @storageHandler.storeImage imageData, callback

  readImage: (imageId, callback) ->
    @storageHandler.readImage imageId, callback

  getDebugLabel: ->
    @debugLabel

  _getCacheInfo: ->
    cacheInfoItem = @cacheStorage.getItem(goLabCacheStorageInfoKey)
    if (cacheInfoItem && cacheInfoItem.length>20)
      cacheInfo = null
      try
        cacheInfo = JSON.parse(cacheInfoItem)
#        console.log("#{@debugLabel}: cacheInfo #{JSON.stringify(cacheInfo)}")
      catch error
        if (@_debug) then console.warn("#{@debugLabel}: error parsing cache info #{cacheInfoItem}, error: #{error}")
      cacheInfo
    else
      null

  _isCacheKey: (key) ->
    key.indexOf(goLabCacheStorageKey) == 0

  _updateCacheInfo: ->
    @cacheInfo.lastModified = Date.now()
    @cacheStorage.setItem(goLabCacheStorageInfoKey, JSON.stringify(@cacheInfo))

  _initCache: (tryToReuseCache, callback)->
    isValidCacheInfo = (cacheInfo)=>
      if @storageHandler.getMetadataHandler().getMetadata().contextualActor?
        currentActorId = @storageHandler.getMetadataHandler().getMetadata().contextualActor.id
      else
        currentActorId = @storageHandler.getMetadataHandler().getActor().id
      cacheInfo.url == identifyingUrl && cacheInfo.actorId == currentActorId && (Date.now() - cacheInfo.lastModified) < maxCacheAge

    waitUntilCacheIsInitialized = (cacheInfo) =>
      if (cacheInfo.initialized)
        @cacheInfo = cacheInfo
        @ready = true
        if (@_debug) then console.log("#{@debugLabel}: cache ready for use, nr items in sessionStorage: #{@cacheStorage.length}")
        callback(null)
      else if (Date.now() > maxCacheInitializedWaitMillis)
        console.warn("#{@debugLabel}: waited long enough for cache initializing by someone else, now doing it myself")
        initializeCache()
      else
        if (Date.now() > maxCacheInitializedWarnMillis)
          console.warn("#{@debugLabel}: still waiting for cache initializing by someone else.")
          maxCacheInitializedWarnMillis += maxCacheInitializedWarnStep
        if @_debug then console.log "#{@debugLabel}: waiting for cache initializing by someone else."
        setTimeout(=>
          waitUntilCacheIsInitialized(@_getCacheInfo())
        , maxCacheInitializedWaitStep)

    fillCache = (callback)=>
      @storageHandler.listAllResourcesForCaching((error, resources)=>
        if (error)
          @ready = false
          callback(error)
        else
          for resource in resources
            if (@_isValidResource(resource))
              @cacheStorage[goLabCacheStorageKey + resource.metadata.id] = JSON.stringify(resource)
            else
              error = "invalid resource for cache"
              console.warn(error + ", resource:")
              console.warn(resource)

          if @_debug then console.log("#{@debugLabel}: cacheInfo: #{JSON.stringify(@_getCacheInfo())}")

          @cacheInfo.initialized = true
          @_updateCacheInfo()
          @ready = true

          if (@_debug)
            console.warn "cache created, contents:"
            console.warn @cacheStorage

          if (@_debug || _logCacheStart)
            console.log("#{@debugLabel}: created cache and filled it with #{resources.length} resources.")
          callback(null)
      )

    clearCache = =>
      resourceIndices = []
      for i in [0...@cacheStorage.length]
        key = @cacheStorage.key(i)
        if (@_isCacheKey(key))
          resourceIndices.push(i)
      for resourceIndex in resourceIndices
        @cacheStorage.removeItem(resourceIndex)
      if (@_debug) then console.log("#{@debugLabel}: cache cleared by deleting #{resourceIndices.length} resources")

      @_updateCacheInfo()

    initializeCache = =>
      if (@_debug) then console.log("#{@debugLabel}: initializing....")
      if @storageHandler.getMetadataHandler().getMetadata().contextualActor?
        currentActorId = @storageHandler.getMetadataHandler().getMetadata().contextualActor.id
      else
        currentActorId = @storageHandler.getMetadataHandler().getActor().id
      @cacheInfo = {
        url: identifyingUrl
        actorId: currentActorId
        created: Date.now()
        initialized: false
      }
      @_updateCacheInfo()
      clearCache()
      if @_debug then console.log "#{@debugLabel}: initialized cache."
      fillCache(callback)

    cacheInfo = @_getCacheInfo()
    if (tryToReuseCache && cacheInfo && isValidCacheInfo(cacheInfo))
      if (@_debug || _logCacheStart)
        console.log("#{@debugLabel}: found valid cache.")
      maxCacheInitializedWarnMillis = Date.now()+maxCacheInitializedWarnStep
      maxCacheInitializedWaitMillis = Date.now()+maxCacheInitializedWait
      waitUntilCacheIsInitialized(cacheInfo)
    else
      initializeCache()

  _isValidResource: (resource) ->
    if (typeof resource != "object" || typeof resource.metadata != "object" || typeof resource.metadata.id != "string")
      false
    else
      true

  _updateResourceInCache: (resource)->
    if (@_isValidResource(resource))
      @cacheStorage.setItem(goLabCacheStorageKey + resource.metadata.id, JSON.stringify(resource))
      @_updateCacheInfo()
      true
    else
      false

  _checkForReady: ->
    if (!@ready)
      throw new Error("#{@debugLabel}: not ready!")

  readLatestResource: (objectType, cb) ->
    @_checkForReady()
    @listResourceMetaDatas((error, metadatas)=>
      if error?
        setTimeout(->
          cb(error, undefined)
        , 0)
      else
        latestId = @storageHandler._findLatestResourceId(objectType, metadatas)
        if (latestId)
          if @_debug then console.log "#{@debugLabel}.readLatestResource(#{objectType}): #{latestId}"
          @readResource(latestId, cb)
        else
          if @_debug
            console.log "#{@debugLabel}.readLatestResource(#{objectType}): nothing found"
          setTimeout(->
            cb(null, null)
          , 0)
    )

  ###
    Reads a resource with a given id.
    Takes a callback with (err, resource). err is null or contains the error if
    any error occured. It is an error if there is no resource with given id.
  ###
  readResource: (resourceId, cb) ->
    @_checkForReady()
    cachedResource = null
    cachedResourceItem = @cacheStorage.getItem(goLabCacheStorageKey + resourceId)
    if (cachedResourceItem)
      resource = JSON.parse(cachedResourceItem)
      if (resource.content)
        cachedResource = resource
    if (cachedResource)
      if @_debug then console.log("#{@debugLabel}.readResource(#{resourceId}) fetched from cache")
      setTimeout(->
        cb(null, cachedResource)
      )
    else
      if @_debug then console.log("#{@debugLabel}.readResource(#{resourceId}) not in cache")
      @storageHandler.readResource(resourceId, (error, resource)=>
        if (!error && resource)
          if (!@_updateResourceInCache(resource))
            error = "read returned invalid resource"
            console.warn(error + ", resource:")
            console.warn(resource)
        cb(error, resource)
      )

  ###
    Checks if there is a resource with given id.
    Takes a callback with (err, exists), where exists is true when there is a
    resource with given id, and false otherwise. err is null or contains the
    error if any error occured.
  ###
  resourceExists: (resourceId, cb) ->
    @_checkForReady()
    cachedResourceItem = @cacheStorage.getItem(goLabCacheStorageKey + resourceId)
    if (cachedResourceItem)
      if @_debug then console.log("#{@debugLabel}.resourceExists(#{resourceId}) fetched from cache")
      setTimeout(->
        cb(null, true)
      )
    else
      if @_debug then console.log("#{@debugLabel}.resourceExists(#{resourceId}) not in cache")
      @storageHandler.resourceExists(resourceId, (error, exists)->
        cb(error, exists)
      )

  ###
    Creates a resource with the given content.
    Takes a callback with (err, resource), where resource is the newly created
    resource. err is null or contains the error if any error occured.
  ###
  createResource: (content, cb) =>
    @_checkForReady()
    @storageHandler.createResource(content, (error, resource)=>
      if (!error && resource)
        @_updateResourceInCache(resource)
        if (!@_updateResourceInCache(resource))
          error = "create returned invalid resource"
          console.warn(error + ", resource:")
          console.warn(resource)
      cb(error, resource)
    )

  ###
    Updates an existing resource with new content.
    Takes a callback with(err, resource), where resource is the updated
    resource. err is null or contains the error if any error occured.
  ###
  updateResource: (resourceId, content, cb) ->
    @_checkForReady()
    # put it first in the cache, just in case this a final save before unload page
    resource = @getResourceBundle(content, resourceId)
    if (@_updateResourceInCache(resource))
      @storageHandler.updateResource(resourceId, content, (error, resource)=>
        if (!error && resource)
          @_updateResourceInCache(resource)
          if (!@_updateResourceInCache(resource))
            error = "update returned invalid resource"
            console.warn(error + ", resource:")
            console.warn(resource)
        cb(error, resource)
      )
    else
      error = "failed to create valid resource bundle"
      console.warn(error + ", resource:")
      console.warn(resource)
      setTimeout(->
        cb(error, null)
      )

  ###
    Deletes an existing resource.
    Requires the resourceId of the resource to be deleted,
    and a callback that returns an error if something went wrong,
    or is null on success.
    resource. err is null or contains the error if any error occured.
  ###
  deleteResource: (resourceId, cb) ->
    @_checkForReady()
    @storageHandler.deleteResource(resourceId, (error)=>
      if (!error)
        @cacheStorage.removeItem(goLabCacheStorageKey + resourceId)
        @_updateCacheInfo()
      cb(error)
    )

  ###
    Calls back with the ids of all existing resources.
    Takes a callback with (err, ids). err is null or contains the error if any
    error occured.
  ###
  listResourceIds: (cb) ->
    @_checkForReady()
    resourceIds = []
    for i in [0...@cacheStorage.length]
      key = @cacheStorage.key(i)
      if (@_isCacheKey(key))
        resourceString = @cacheStorage.getItem(key)
        resource = JSON.parse(resourceString)
        resource.id = resource.metadata.id
        resourceIds.push(resource.metadata.id)
    if @_debug then console.log("#{@debugLabel}.listResourceIds() fetched from cache")
    setTimeout(->
      cb(null, resourceIds)
    , 0)

  ###
    Calls back with the metadata of all existing resources.
    Takes a callback with (err, metadatas), where metadatas is an Array of
    { id, metadata: {} } objects. err is null or contains the error if any error
    occured. The metadatas are (potentially) filtered for username, resource type, and provider id.
  ###
  listResourceMetaDatas: (cb) ->
    @_checkForReady()
    resourceCount = 0
    allMetatadatas = []
    for i in [0...@cacheStorage.length]
      key = @cacheStorage.key(i)
      if (@_isCacheKey(key))
        ++resourceCount
        resourceString = @cacheStorage.getItem(key)
        resource = JSON.parse(resourceString)
        delete resource.content
        resource.id = resource.metadata.id
        allMetatadatas.push(resource)
    metadatas = @storageHandler.applyFilters(allMetatadatas)
#    console.log("nr of items in cacheStorage: #{@cacheStorage.length}, resourceCount: #{resourceCount}, nr of resources in cache: #{allMetatadatas.length}, after applyFilters: #{metadatas.length}")
    if @_debug then console.log("#{@debugLabel}.listResourceMetaDatas() fetched from cache: #{metadatas.length}")
    setTimeout(->
      cb(null, metadatas)
    , 0)

  generateUUID: () ->
    @storageHandler.generateUUID()

  # the three different filters can be activated or deactivated by setting them to true or false
  # the filter value is fetched from the metadataHandler
  # e.g. the default setting
  # configureFilters(true, true, true)
  # returns only resources that match the resource type, provider id and users id
  configureFilters: () ->
    @storageHandler.configureFilters(arguments...)

  setForResourceTypeFilter: (filterForResourceType)->
    @storageHandler.setForResourceTypeFilter(filterForResourceType)

  getForResourceTypeFilter: ()->
    @storageHandler.getForResourceTypeFilter()

  setForUserFilter: (filterForUser)->
    @storageHandler.setForUserFilter(filterForUser)

  getForUserFilter: ()->
    @storageHandler.getForUserFilter()

  setForProviderFilter: (filterForProvider)->
    @storageHandler.setForProviderFilter(filterForProvider)

  getForProviderFilter: ()->
    @storageHandler.getForProviderFilter()

  setForAppIdFilter: (filterForAppId)->
    @storageHandler.setForAppIdFilter(filterForAppId)

  getForAppIdFilter: ()->
    @storageHandler.getForAppIdFilter()

  setCustomFilter: (customFilter)->
    @storageHandler.setCustomFilter(customFilter)

  getCustomFilter: ()->
    @storageHandler.getCustomFilter()

  getMetadataHandler: ->
    @storageHandler.getMetadataHandler()

  # bundles and returns the most important/interesting features of a resource (for load/save dialogs)
  # for convenience only
  getResourceDescription: (resource)->
    @storageHandler.getResourceDescription(resource)

  # internal function, typically not used external
  getResourceBundle: () =>
    @storageHandler.getResourceBundle(arguments...)
