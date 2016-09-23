"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

class window.ut.commons.MultiResourceEventEmitterModel extends window.ut.commons.ResourceEventEmitterModel
  constructor: (environmentHandlers, resourceTypes, @singleResourceCreator)->
    super(environmentHandlers, resourceTypes[0])
#    @_debug = true
#    @storageHandler._debug = true
#    @storageHandler.storageHandler._debug = true if (@storageHandler.storageHandler)
    if (typeof @singleResourceCreator != "function")
      throw Error("singleResourceCreator must be a function")
    @storageHandler.setForAppIdFilter(false)
    @_resourceTypesLabel = @getResourceType()
    if (resourceTypes.length>1)
      resourceTypeFilter = (metadata)->
        resourceType = metadata.target.objectType
        resourceType in resourceTypes

      @storageHandler.setForResourceTypeFilter(false)
      @storageHandler.setCustomFilter(resourceTypeFilter)
      @_resourceTypesLabel = "[#{resourceTypes.join(",")}]"
    @_resourceTypes = resourceTypes
    @_resources = []
    @_orderedResources = []
    @_ilsStructure = null
    @_ilsStructureLoaded = true
    @_appsMap = null
    metadataHandler = @storageHandler.getMetadataHandler()
    switch (metadataHandler.getContext())
      when window.golab.ils.context.graasp, window.golab.ils.context.ils
        @_ilsStructureLoaded = false
        metadataHandler.getILSStructure((error, ilsStructure)=>
          @_ilsStructureLoaded = true
          if (error)
            console.warn("problems getting ILS structure: #{JSON.stringify(error)}")
            # send event so that any one waiting the ils structure can continue (without an ils structure)
            @emitEvent("ilsStructureChanged",ilsStructure)
          else
            if (@_debug)
              console.log("ILS structure:")
              console.log(ilsStructure)
            @setIlsStructure(ilsStructure)
    )

  createNewModel: () ->
    new window.ut.commons.MultiResourceEventEmitterModel(@environmentHandlers, @_resourceTypes, @singleResourceCreator)

  applyLogLoad: (activityStreamObject, resourceType, callback)->
    switch (resourceType)
      when "resources"
        @reloadResources(activityStreamObject.object.content)
        callback()
      else
        super(activityStreamObject, resourceType, callback)

  reloadResources: (resourcesToReload)->
    for resourceToReload in resourcesToReload
      singleResource = @getResourceById(resourceToReload.metadata.id)
      reload = singleResource!=null
      if (singleResource==null)
        singleResource = @singleResourceCreator(resourceToReload.metadata)
        @_resources.push(singleResource)
      singleResource.loadFromResource(resourceToReload)
#      console.log("reload (#{reload}) of resource #{singleResource.getDebugLabel()}")
    @emitModelLoaded()

  getDebugLabel: ->
    "#{@_resourceTypesLabel}:#{@getDisplayName()}"

  createResource: (callback) ->
    throw Error("MultiResourceEventEmitterModel does not support writing")

  updateResource: (callback) ->
    throw Error("MultiResourceEventEmitterModel does not support writing")

  deleteResource: (callback) ->
    throw Error("MultiResourceEventEmitterModel does not support writing")

  loadFromResourceContent: (content)->
    super(content)
    resources = []
    if (content.resources)
      for resourceContent in content.resources
        if (@appExists(resourceContent.metadata))
          singleResource = @singleResourceCreator(resourceContent.metadata)
          singleResource.loadFromResource(resourceContent)
          resources.push(singleResource)
    @_resources = resources

  filterLatestMatadatas: (latestMetadatas) =>
    latestMetadatas

  loadLatestResource: (callback)->
    startLoadLatestResource = ()=>
      @storageHandler.listResourceMetaDatas((error, metadatas)=>
        if (error)
          callback(error, null)
          return

        findLatestMetadatas = ()->
          latestMetadataMap = {}
          for aMetadata in metadatas
            metadata = aMetadata.metadata
            appId = metadata.generator.id
            if (latestMetadataMap[appId])
              metadataPublished = new Date(metadata.published)
              latestMetadataPublished = new Date(latestMetadataMap[appId].published)
              if (metadataPublished > latestMetadataPublished)
                latestMetadataMap[appId] = metadata
            else
              latestMetadataMap[appId] = metadata
          for appId, metadata of latestMetadataMap
            metadata

        filterOutNonExistingApplications = (latestMetadatas)=>
          for metadata in latestMetadatas when @appExists(metadata)
            metadata

        resources = []
        reloadedResources = []

        getUpToDateLoadedResource = (metadata)=>
          loadedResource = @getResourceById(metadata.id)
          if (loadedResource)
            resourcePublishedDate = new Date(metadata.published)
            loadedResourcePublishedDate = new Date(loadedResource.getMetadata().published)
            if (resourcePublishedDate.getTime()<=loadedResourcePublishedDate.getTime())
              return loadedResource
          null

        loadLatestResourceForMetadatas = (metadataList) =>
#          console.log("loadLatestResourceForMetadatas(#{metadataList.length})")
          if (metadataList.length==0)
            @_resources = resources.slice()
            updateOrderedResources()
            @emitModelLoaded()
            @clearChanged()
            callback(error, resources, reloadedResources)
          else
            metadata = metadataList[0]
            singleResource = getUpToDateLoadedResource(metadata)
            if (singleResource)
              resources.push(singleResource)
              loadLatestResourceForMetadatas(metadataList.slice(1))
            else
              resourceId = metadata.id
              singleResource = @singleResourceCreator(metadataList[0])
              singleResource.loadFromResourceId(resourceId, (error) ->
                if (error)
                  callback(error, null)
                else
                  resources.push(singleResource)
                  reloadedResources.push(singleResource)
                  loadLatestResourceForMetadatas(metadataList.slice(1))
            )

        updateOrderedResources = () =>
          ilsStructure = @getIlsStructure()

          findResourceByAppId = (appId) =>
            for resource in @_resources when resource.getAppId() == appId
              return resource
            return null

          addResourcesByApps = (phaseTitle, apps) =>
            orderedResources = []
            for app in apps
              resource = findResourceByAppId(app.id)
              if (resource)
                orderedResources.push(resource)
            if (orderedResources.length)
              @_orderedResources.push({
                phaseTitle: phaseTitle
                orderedResources: orderedResources
              })

          @_orderedResources.length = 0
          if (ilsStructure == null)
            @_orderedResources.push({
              phaseTitle: ""
              orderedResources: @_resources
            })
          else
            addResourcesByApps("__tools__", ilsStructure.apps)
            for phase in ilsStructure.phases
              addResourcesByApps(phase.displayName, phase.apps)
          if (@_debug)
            console.log("@_orderedResources")
            console.log(@_orderedResources)

        latestMetadatas = findLatestMetadatas()
        if (@getIlsStructure() != null)
          latestMetadatas = filterOutNonExistingApplications(latestMetadatas)
        latestMetadatas = @filterLatestMatadatas(latestMetadatas)

        loadLatestResourceForMetadatas(latestMetadatas)
      )
    if (@_ilsStructureLoaded)
      startLoadLatestResource()
    else
      @addListener("ilsStructureChanged", ()=>
        startLoadLatestResource()
      )

  getResources: ->
    @_resources

  getOrderedResources: ->
    @_orderedResources

  getResourceById: (id)->
    for resource in @_resources when resource.getId()==id
      return resource
    null

  getResourceContent: ->
    content = super()
    content.resources = for resource in @_resources
      resource.getResource()
    content

  clearContent: ->
    @_resources.splice(0, @_resources.length)
    super()

  getIlsStructure: ->
    @_ilsStructure

  setIlsStructure: (ilsStructure)=>
    createAppsMap = (ilsStructure)->
      appsMap = {}
      for app in ilsStructure.apps
        appsMap[app.id] = app
      for phase in ilsStructure.phases
        for app in phase.apps
          appsMap[app.id] = app
      appsMap

    if (@_ilsStructure!=ilsStructure)
      try
        @_appsMap = createAppsMap(ilsStructure)
        @_ilsStructure = ilsStructure
      finally
        @emitEvent("ilsStructureChanged",ilsStructure)

  isIlsStructureLoaded: ()->
    @_ilsStructureLoaded

  appExists: (metadata)->
    if (@_appsMap==null)
      true
    else if (@_appsMap[metadata.generator.id])
      true
    else
      false