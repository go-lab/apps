### example metadata
  {
    "id": "f25d7eff-8859-49ed-85e9-e7c1f92bc111",
    "published": "2014-06-05T13:15:30Z",
    "actor":
    {
      "objectType": "person",
      "id": "f25d7eff-8859-49ed-85e9-e7c1f92bc334",
      "displayName": "anonymized"
    },
    "target":
    {
      "objectType": "conceptMap",
      "id": "9383fbbe-e071-49b2-9770-46ddc4f8cd6e",
      "displayName": "unnamed concept map"
    },
    "generator":
    {
      "objectType": "application",
      "url": document.URL,
      "id": "04123e9e-14d0-447b-a851-805b9262d9a6",
      "displayName": "ut.tools.conceptmapper"
    },
    "provider":
    {
      "objectType": "ils",
      "url": "http://graasp.epfl.ch/metawidget/1/b387b6f...",
      "id": "0f8184db-53ba-4868-9208-896c3d7c25bb",
      "inquiryPhase": "Orientation"
      "inquiryPhaseId": "543e7058ab0f540000e5821c"
      "inquiryPhaseName": "MyOrientation"
      "displayName": "name-of-ils"
    }
  }
###

### example ils and space data
ils:
	created: "2014-10-15T13:02:16.612Z"
	description: ""
	displayName: "test graasp-eu-library"
	id: "543e7058ab0f540000e58217"
	ilsRef: Object
		__v: 0
		_id: "543e70582e2c55fc49b62595"
		lang: "en"
		modified: "2014-10-15T13:02:16.680Z"
		spaceRef: "543e7058ab0f540000e58217"
		userRef: "5405e1e0da3a95cf9050e5f2"
  metadata: Object
		type: "ils"
	parentId: "5405e1ada5ecce255b4a7222"
	parentType: "@space"
	profileUrl: "http://graasp.eu/spaces/543e7058ab0f540000e58217"
	spaceType: "ils"
	updated: "2014-10-15T13:02:16.865Z"
	visibilityLevel: "public"

phase:
	created: "2014-10-15T13:02:16.678Z"
	description: "Welcome to the Orientation phase. You can describe here what students have to do in the Orientation phase."
	displayName: "MyOrientation"
	id: "543e7058ab0f540000e5821c"
	// metadata might be missing if it's a manually added phase space
  metadata:
		type: "Orientation"
	parentId: "543e7058ab0f540000e58217"
	parentType: "@space"
	profileUrl: "http://graasp.eu/spaces/543e7058ab0f540000e5821c"
	spaceType: "folder"
	updated: "2014-10-15T13:02:45.001Z"
	visibilityLevel: "public"
###

"use strict"

window.golab = window.golab || {}
window.golab.ils = window.golab.ils || {}
window.golab.ils.metadata = window.golab.ils.metadata || {}

window.golab.ils.context = window.golab.ils.context or {}
# the tool is running...
# ...inside Graasp / authoring mode
window.golab.ils.context.graasp = "graasp"
# ...in an ILS / student mode
window.golab.ils.context.ils = "ils"
# ...as a preview on golabz.eu
window.golab.ils.context.preview = "preview"
# ...directly rendered via shindig
window.golab.ils.context.direct = "direct"
# ...as a standalone HTML version
window.golab.ils.context.standalone = "standalone"
# ...in an unknown context
window.golab.ils.context.unknown = "unknown"

class window.golab.ils.metadata.MetadataHandler
  constructor: (metadata, cb) ->
    @_debug = false
#    @_debug = true
    if @_debug then console.log("Initializing MetadataHandler.")
    # the context might already be set through subclass-constructors. if not, do it now.
    @_context = @_context or @identifyContext()
    if metadata
      # cloning the parameter to avoid side-effects
      @_metadata = JSON.parse(JSON.stringify(metadata))
    else
      throw "MetadataHandler needs an initial set of metadata at construction!"

    setTimeout(=>
      cb(null, @) if cb
    , 0)
    if @_debug
      console.log "MetadataHandler construction for #{@_metadata.generator.displayName} complete. Using the following metadata:"
      console.log @_metadata
      console.log "context: #{@getContext()}"
    @

  generateUUID: () ->
    d = new Date().getTime()
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (char) ->
      r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      if char is 'x'
        return r.toString(16)
      else
        return (r & 0x7 | 0x8).toString(16)
    return uuid

  identifyContext: () =>
    @_context = null
    contextURLParameter = @getParameterFromUrl("context")
    if contextURLParameter?
      switch contextURLParameter.toLowerCase()
        when window.golab.ils.context.graasp, window.golab.ils.context.ils, window.golab.ils.context.preview, window.golab.ils.context.direct, window.golab.ils.context.standalone, window.golab.ils.context.unknown
          @_context = contextURLParameter.toLowerCase()
        else
          console.warn("unknown url context parameter value: #{contextURLParameter}")
    else
      previewUrlParameter = @getParameterFromUrl("preview")
      if (previewUrlParameter == "")
        @_context = window.golab.ils.context.preview
    if (!@_context)
      ilsContext = ils.identifyContext()
      if @_debug
        console.log "MetadataHandler.identifyContext. ils.identifyContext() returned:"
        console.log ilsContext
      # the new style. the return value from ils.identifyContext() is mapped to our values.
      # the "direct" rendering context is not used anymore.
      switch ilsContext
        when "graasp" then @_context = window.golab.ils.context.graasp
        when "preview" then @_context = window.golab.ils.context.preview
        when "standalone_ils" then @_context = window.golab.ils.context.ils
        when "standalone_html" then @_context = window.golab.ils.context.standalone
        else
          @_context = window.golab.ils.context.unknown
    if @_debug
      console.log "identified context:"
      console.log @_context

  getContext: () =>
    @_context

  getParameterFromUrl: (key) ->
    key = key.toLowerCase()
    parameter = null
    queryPart = location.search.trim().toLowerCase()
    if (queryPart && queryPart[0] == "?")
      parts = queryPart.substring(1).split("&")
      for part in parts
        partParts = part.split("=")
        if (parts.length && partParts[0] == key)
          if (partParts.length == 2)
            parameter = partParts[1]
          else if (partParts.length == 1)
            parameter = ""
    if parameter?
      return decodeURIComponent(parameter)
    else
      return null

  setId: (newId) ->
    @_metadata.id = newId
    @

  getId: () ->
    @_metadata.id

  setMetadata: (newMetadata) ->
    # cloning the parameter to avoid side-effects
    @_metadata = JSON.parse(JSON.stringify(newMetadata))
    @

  getMetadata: () ->
    @_metadata

  setActor: (newActor) ->
    @_metadata.actor = newActor

  getActor: () ->
    @_metadata.actor

  getTarget: () ->
    @_metadata.target

  setTarget: (newTarget) ->
    @_metadata.target = JSON.parse(JSON.stringify(newTarget))

  getGenerator: () ->
    @_metadata.generator

  getProvider: () ->
    @_metadata.provider

  getTargetDisplayName: () ->
    @_metadata.target.displayName

  setTargetDisplayName: (newName) ->
    @_metadata.target.displayName = newName

  getTargetId: () ->
    @_metadata.target.id

  setTargetId: (newId) ->
    @_metadata.target.id = newId

  getPublished: () ->
    @_metadata.published

  setMetadataFlag: (flag, value)->
    @_metadata.flags = @_metadata.flags || {}
    @_metadata.flags[flag] = value

  getMetadataFlag: (flag) ->
    @_metadata.flags = @_metadata.flags || {}
    @_metadata.flags[flag]

  getILSStructure: (callback) =>
    if window.ils?
      # do the retrieval
      window.ils.getIls (ils) =>
        if ils.error?
          callback {error: "ils.getIls failed, cannot get ILS structure.", detail: ils.error}, null
        else
          # the top-level ils-structure
          ilsStructure = {}
          ilsStructure.id = ils.id
          ilsStructure.url = ils.profileUrl
          ilsStructure.displayName = ils.displayName
          ilsStructure.phases = []
          ilsStructure.apps = []
          # retrieve the sub-spaces (i.e. phases)
          window.ils.getItemsBySpaceId ils.id, (phases) ->
            if phases.error?
              callback {error: 'ils.getItemsBySpaceId failed, cannot get ILS structure.', detail: phases.error}, null
            else
              # the sub-function to read the phase,
              # will be used as deferred promise:
              #---------------------------
              phaseReadPromise = (phase, phaseIndex) =>
              #read the phase content, i.e. the apps
                deferred = new $.Deferred()
                window.ils.getAppsBySpaceId phase.id, (apps) =>
                  if apps.error?
                    deferred.fail()
                  else
                    appList = []
                    for app, appIndex in apps
                      appInfo = {
                        id: app.id,
                        displayName: app.displayName,
                        url: app.appUrl,
                        itemType: app.itemType,
                        appType: app.appType,
                      }
                      if (app.metadata && app.metadata.settings)
                        try
                          configuration = {
                            metadata: {
                              actor: app.metadata.settings.actor
                              target: app.metadata.settings.target
                              id: app.metadata.settings.id
                              published: app.metadata.settings.published
                              # TODO: add the missing fields: generator and provider
                            }
                            content: JSON.parse(app.metadata.settings.content)
                          }
                          appInfo.configuration = configuration
                        catch exception
                          console.warn("an error occurred while creating the configuration resource from the app.metadata.setting")
                          console.warn(exception)
                          console.warn(app)
                      appList.push appInfo
                    ilsStructure.phases[phaseIndex] = {
                      id: phase.id,
                      type: phase.metadata.type,
                      displayName: phase.displayName,
                      visibilityLevel: phase.visibilityLevel,
                      apps: appList
                    }
                    deferred.resolve()
                return deferred.promise()
              #---------------------------

              deferredPhaseReads = [];
              for phase, index in phases
                if phase.metadata?
                  type = phase.metadata.type
                else
                  type = 'User defined'
                  phase.metadata = {}
                  phase.metadata.type = 'User defined'
                if type is 'Vault' or type is 'About'
                  # skipping the Vault and About space
                  continue
                if phase.itemType is "Application"
                  # if it's not a phase, but a global tool, add it to ilsStructure.globalTools
                  ilsStructure.apps.push phase
                  continue
                if phase.spaceType is "folder"
                  # this is a regular space/phase, add it to the queue
                  deferredPhaseReads.push phaseReadPromise(phase, index)
                  continue
                console.warn "ignoring a non-standard resource on top-level space."

              $.when.apply($, deferredPhaseReads).done () ->
                # all phases have been collected successfully
                # remove the non existing indices from the phases array
                ilsStructure.phases = ilsStructure.phases.filter((phase)-> typeof phase != "undefined")
                callback null, ilsStructure
              $.when.apply($, deferredPhaseReads).fail () ->
                callback {error: 'getILSStructure failed when retrieving phase information.'}, null
    else
      callback {error: "ILS library not present, cannot get ILS structure."}, null

  updateIdsAfterImporting: ->
    @setId(@generateUUID())
    @setTargetId(@generateUUID())


class window.golab.ils.metadata.GoLabMetadataHandler extends window.golab.ils.metadata.MetadataHandler

  constructor: (metadata, cb) ->
    @identifyContext()
    if osapi?
      # we in an OpenSocial context, try to get information from there...
      try
        if not ils
          throw "ILS library needs to be present before using the (GoLab)MetadataHandler."
        ils.getAppContextParameters (context) =>
          if (@_debug)
            console.log "received appContextParameters from ILS library:"
            console.log context
          # ----- information about the user
          metadata.actor.displayName = context.actor.displayName
          metadata.actor.id = context.actor.id
          metadata.actor.objectType = context.actor.objectType
          # ----- potentially information about the contextual actor
          if context.contextualActor?
            metadata.contextualActor = context.contextualActor
          # ------ information about the ILS and phase
          metadata.provider.displayName = context.provider.displayName
          metadata.provider.id = context.provider.id
          metadata.provider.objectType = context.provider.objectType
          metadata.provider.inquiryPhase = context.provider.inquiryPhase
          metadata.provider.inquiryPhaseId = context.provider.inquiryPhaseId
          metadata.provider.inquiryPhaseName = context.provider.inquiryPhaseName
          metadata.provider.url = context.provider.url
          if context.provider.ilsHasAngeLA?
            metadata.provider.ilsHasAngeLA = context.provider.ilsHasAngeLA
          else
            metadata.provider.ilsHasAngeLA = false
          if context.provider.ilsHasAngeLO?
            metadata.provider.ilsHasAngeLO = context.provider.ilsHasAngeLO
          else
          metadata.provider.ilsHasAngeLO = false
          # ------ information about the tool (in case of ILS metawidget, tool = provider
          # metadata.generator.displayName is given through the metadata in the constructor paramter
          if context.provider.id is undefined or context.provider.id is "unknown"
          # golabz preview context
            if (@_debug)
              console.log "MetadataHandler: preview context"
            metadata.provider.objectType = "unknown"
            metadata.provider.id = "unknown"
            metadata.provider.displayName = "unknown"
            metadata.provider.url = window.location.href
            metadata.generator.url = gadgets.util.getUrlParameters().url
            metadata.provider.inquiryPhase = undefined
            metadata.provider.inquiryPhaseId = undefined
            metadata.provider.inquiryPhaseName = undefined
          else if context.provider.inquiryPhaseId is undefined or context.provider.inquiryPhaseId is "unknown"
            # ILS metawidget context
            if (@_debug)
              console.log "MetadataHandler: ILS metawidget context"
            metadata.provider.inquiryPhase = "ils"
            metadata.provider.inquiryPhaseId = undefined
            metadata.provider.inquiryPhaseName = undefined
            metadata.generator.displayName = metadata.provider.displayName
            metadata.generator.id = metadata.provider.id
            metadata.generator.objectType = "ils"
            metadata.generator.url = metadata.provider.url
          else
            if (@_debug)
              console.log "MetadataHandler: application context"
            metadata.generator.id = context.generator.id
            metadata.generator.objectType = context.generator.objectType
            metadata.generator.url = context.generator.url
          # ------ information about the content and storage
          # metadata.target.id, displayName, objectType are given through constructor paramter
          metadata.storageId = context.storageId
          metadata.storageType = context.storageType
          # metadata generation finished, call super and trigger callback
          super metadata
          cb(null, @)
      catch error
        console.warn "error during metadata retrieval:"
        console.warn error
        console.log "metadata so far:"
        console.log metadata
    else
      if @_debug then console.log "Running outside osapi/ils, using given metadata."
      super metadata
      cb(null, @)

class window.golab.ils.metadata.LocalMetadataHandler extends window.golab.ils.metadata.MetadataHandler

  constructor: (metadata, cb) ->
    @identifyContext()
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

    # overriding some default values with the correct values for the "local" context
    metadata.provider.id = getIdentifyingUrl()
    # if present as URL, take from there
    if (@getParameterFromUrl("provider")?)
      metadata.provider.id = @getParameterFromUrl("provider")
    if document.title?
      metadata.provider.displayName = document.title
    else
      metadata.provider.displayName = "unnamed"
    metadata.provider.ilsHasAngeLA = false
    metadata.provider.ilsHasAngeLO = false
    if @_context is window.golab.ils.context.standalone
      if @getParameterFromUrl("author") is "true"
        metadata.actor.objectType = "html_author"
      else
        metadata.actor.objectType = "html_student"
    else
      metadata.actor.objectType = "person"

    # find nick name
    if (@getParameterFromUrl("username")?)
      userNickname = @getParameterFromUrl("username")
    else if (@getContext() == window.golab.ils.context.preview)
      userNickname = "Preview"
    else
      userNickname = localStorage.getItem('goLabNickName')
      if (!userNickname)
        while !userNickname
          userNickname = prompt("Please enter nick name:")
          if (userNickname)
            userNickname = userNickname.trim()
        localStorage.setItem('goLabNickName', userNickname)
    userNickname = userNickname.trim()

    # display nick name in window title
    windowTitle = window.document.title
    if (!windowTitle || windowTitle[0] != "[")
      window.document.title = "[#{userNickname}] #{windowTitle}"

    metadata.actor.displayName = userNickname
    actorId = userNickname.toLowerCase() + "@" + metadata.provider.id
    metadata.actor.id = actorId

    removeQueryAndFragmentFromUrl = (url) ->
      urlString = "#{url}"
      removePart = (character)->
        lastIndex = urlString.lastIndexOf(character)
        if (lastIndex >= 0)
          urlString = urlString.substr(0, lastIndex)
      removePart("?")
      removePart("#")
      urlString

    if (@getParameterFromUrl("generator")?)
      metadata.generator.id = @getParameterFromUrl("generator")
    else
      metadata.generator.id = metadata.generator.displayName + "@" + removeQueryAndFragmentFromUrl(metadata.provider.url)

    # set the metadata in the super-constructor
    # and return it via callback
    super metadata
    cb(null, @)