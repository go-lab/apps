"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

dummy = {
  en: ""
  help: ""
}

forceAutoSave = false
#forceAutoSave = true
forceAuthoringMode = false
if (golab.common.resourceLoader)
  authorMode = golab.common.resourceLoader.getUrlParameter("author")
  if (authorMode)
    switch (authorMode.toLowerCase())
      when "true", "on"
        forceAuthoringMode = true
#forceAuthoringMode = true
if (forceAuthoringMode)
  console.warn("configuration model is forced to author mode!")

collaborationStartupOptions = ["disabled", "manualStart", "autoStart"]

defaultCommonConfigurationValues = {
  help: ""
  useConfigurationHelp: false
  autoLoadLatestResource: true
  singleDocumentMode: true
  showResourceName: true
  showImportExport: false
  showLoadExamples: false
  showLoadConfiguration: true
  showModelJson: false
  autoSave: true
  defaultResourceName: ""
  loadInitialResource: true
  initialResourceString: null
  collaborationStartup: "disabled"
  specialLanguageTerms: {}
}

class window.ut.commons.ConfigurationModel extends window.ut.commons.ResourceEventEmitterModel
  constructor: (environmentHandlers, defaultHelp, toolId)->
    super(environmentHandlers, "configuration")
#    @_debug = true
    @startupFinished = false
    configurationStorageHandler = @getStorageHandler()
    if (configurationStorageHandler.configureFilters)
      configurationStorageHandler.setForUserFilter(false)
    forApplication = environmentHandlers.toolName
    forApplicationFilter = (metadata)->
      if (metadata && metadata.target && metadata.target.forApplication)
        metadata.target.forApplication == forApplication
      else
        false
    configurationStorageHandler.setCustomFilter(forApplicationFilter)
    configurationStorageHandler.getMetadataHandler().getTarget().forApplication = forApplication
    @_context = if (configurationStorageHandler.getMetadataHandler)
      configurationStorageHandler.getMetadataHandler().getContext()
    else
      window.golab.ils.context.unknown
    @_runningInGraasp = false
    @_runningInIls = false
    @_runningInGolabz = false
    switch @_context
      when window.golab.ils.context.graasp
        @_runningInGraasp = true
      when window.golab.ils.context.ils
        @_runningInIls = true
      when window.golab.ils.context.preview
        @_runningInGolabz = true
    @_toolId = environmentHandlers.toolName
    if (toolId)
      @_toolId = toolId
    @_helpHtml = defaultCommonConfigurationValues.help
    @_useConfigurationHelp = defaultCommonConfigurationValues.useConfigurationHelp
    @_autoLoadLatestResource = defaultCommonConfigurationValues.autoLoadLatestResource
    @_singleDocumentMode = defaultCommonConfigurationValues.singleDocumentMode
    @_showResourceName = defaultCommonConfigurationValues.showResourceName
    @_showImportExport = defaultCommonConfigurationValues.showImportExport
    @_showLoadExamples = defaultCommonConfigurationValues.showLoadExamples
    @_showLoadConfiguration = defaultCommonConfigurationValues.showLoadConfiguration
    @_showModelJson = defaultCommonConfigurationValues.showModelJson
    @_autoSave = defaultCommonConfigurationValues.autoSave
    @_defaultResourceName = defaultCommonConfigurationValues.defaultResourceName
    @_loadInitialResource = defaultCommonConfigurationValues.loadInitialResource
    @_initialResourceString = defaultCommonConfigurationValues.initialResourceString
    @_collaborationStartup = defaultCommonConfigurationValues.collaborationStartup
    @_specialLanguageTerms = defaultCommonConfigurationValues.specialLanguageTerms
    @_applicationModel = null
    @_authoringMode = @_runningInGraasp || forceAuthoringMode
    @_forceShowConfiguration = false
    environmentHandlers.languageHandler.setSpecialTranslationFunction(@getSpecialLanguageTranslation)
    @initHelp(defaultHelp)
    Object.defineProperties(@, {
      context: {
        get: @getContext
      }
      runningInGolab: {
        get: @getRunningInGolab
      }
      runningInGolabz: {
        get: @getRunningInGolabz
      }
      runningInGraasp: {
        get: @getRunningInGraasp
      }
      runningInIls: {
        get: @getRunningInIls
      }
      toolId: {
        get: @getToolId
      }
      helpHtml: {
        get: @getHelpHtml
        set: @setHelpHtml
      }
      standardHelpHtml: {
        get: @getStandardHelpHtml
      }
      useConfigurationHelp: {
        get: @getUseConfigurationHelp
        set: @setUseConfigurationHelp
      }
      autoLoadLatestResource: {
        get: @getAutoLoadLatestResource
        set: @setAutoLoadLatestResource
      }
      singleDocumentMode: {
        get: @getSingleDocumentMode
        set: @setSingleDocumentMode
      }
      multiDocumentMode: {
        get: @getMultiDocumentMode
        set: @setMultiDocumentMode
      }
      showResourceName: {
        get: @getShowResourceName
        set: @setShowResourceName
      }
      showImportExport: {
        get: @getShowImportExport
        set: @setShowImportExport
      }
      showLoadExamples: {
        get: @getShowLoadExamples
        set: @setShowLoadExamples
      }
      showLoadConfiguration: {
        get: @getShowLoadConfiguration
        set: @setShowLoadConfiguration
      }
      showModelJson: {
        get: @getShowModelJson
        set: @setShowModelJson
      }
      autoSave: {
        get: @getAutoSave
        set: @setAutoSave
      }
      defaultResourceName: {
        get: @getDefaultResourceName
        set: @setDefaultResourceName
      }
      loadInitialResource: {
        get: @getLoadInitialResource
        set: @setLoadInitialResource
      }
      initialResourceString: {
        get: @getInitialResourceString
        set: @setInitialResourceString
      }
      collaborationStartup: {
        get: @getCollaborationStartup
        set: @setCollaborationStartup
      }
      collaborationStartupOptions: {
        get: @getCollaborationStartupOptions
      }
      applicationModel: {
        get: @getApplicationModel
        set: @setApplicationModel
      }
      authoringMode: {
        get: @getAuthoringMode
        set: @setAuthoringMode
      }
    })
#    @_debug = true
#    console.log("created new ConfigurationModel")

  initHelp: (defaultHelp)->
    helpHtml = null
    helpContentKey = "help.helpDialog.content.#{@getToolId()}"
    if (@getLanguageHandler().existsMessage(helpContentKey))
      helpHtml = @getLanguageHandler().getMessage(helpContentKey)
    if (!helpHtml)
      if (defaultHelp)
        helpHtml = defaultHelp
        console.warn("could not find help in language file")
      else
        console.warn("could not find help in language file and there is no default help given")
    @_standardHelpHtml = helpHtml
    @_helpHtml = helpHtml

  isChangeTrackingFullyImplemented: ->
    true

  getContext: ->
    @_context

  getRunningInGolab: ->
    switch @context
      when window.golab.ils.context.graasp, window.golab.ils.context.ils, window.golab.ils.context.preview
        true
      else
        false

  getRunningInGolabz: ->
    @_runningInGolabz

  getRunningInGraasp: ->
    if (forceAuthoringMode)
      return true
    @_runningInGraasp

  getRunningInIls: ->
    @_runningInIls

  getToolId: ->
    @_toolId

  getStandardHelpHtml: ->
    @_standardHelpHtml

  getHelpHtml: ->
    @_helpHtml

  setHelpHtml: (helpHtml) ->
    if (helpHtml != @_helpHtml)
      @_helpHtml = helpHtml
      @emitModelChanged()

  getUseConfigurationHelp: ->
    @_useConfigurationHelp

  setUseConfigurationHelp: (useConfigurationHelp)->
    if (useConfigurationHelp != @_useConfigurationHelp)
      @_useConfigurationHelp = useConfigurationHelp
      @emitModelChanged()

  getAutoLoadLatestResource: ->
    @_autoLoadLatestResource

  setAutoLoadLatestResource: (autoLoadLatestResource)->
    if (autoLoadLatestResource != @_autoLoadLatestResource)
      @_autoLoadLatestResource = autoLoadLatestResource
      @emitModelChanged()

  getSingleDocumentMode: ->
    @_singleDocumentMode

  setSingleDocumentMode: (singleDocumentMode)->
    if (singleDocumentMode != @_singleDocumentMode)
      @_singleDocumentMode = singleDocumentMode
      @emitModelChanged()

  getMultiDocumentMode: ->
    !@getSingleDocumentMode()

  setMultiDocumentMode: (multiDocumentMode)->
    @setSingleDocumentMode(!multiDocumentMode)

  getShowResourceName: ->
    @_showResourceName

  setShowResourceName: (showResourceName)->
    if (showResourceName != @_showResourceName)
      @_showResourceName = showResourceName
      @emitModelChanged()

  getShowImportExport: ->
    @_showImportExport

  setShowImportExport: (showImportExport)->
    if (showImportExport != @_showImportExport)
      @_showImportExport = showImportExport
      @emitModelChanged()

  getShowLoadExamples: ->
    @_showLoadExamples

  setShowLoadExamples: (showLoadExamples)->
    if (showLoadExamples != @_showLoadExamples)
      @_showLoadExamples = showLoadExamples
      @emitModelChanged()

  getShowLoadConfiguration: ->
    if (@_runningInGraasp)
      true
    else if (@_runningInIls)
      false
    else
      @_showLoadConfiguration

  setShowLoadConfiguration: (showLoadConfiguration)->
    if (showLoadConfiguration != @_showLoadConfiguration)
      @_showLoadConfiguration = showLoadConfiguration
      @emitModelChanged()

  getForceShowLoadConfiguration: ->
    @_forceShowConfiguration

  setForceShowLoadConfiguration: (forceShowLoadConfiguration)->
    if (forceShowLoadConfiguration != @_forceShowConfiguration)
      @_forceShowConfiguration = forceShowLoadConfiguration
      @emitModelChanged()

  getShowModelJson: ->
    @_showModelJson

  setShowModelJson: (showModelJson)->
    if (showModelJson != @_showModelJson)
      @_showModelJson = showModelJson
      @emitModelChanged()

  getAutoSave: ->
    @_autoSave
#    true

  setAutoSave: (autoSave)->
    if (autoSave != @_autoSave)
      @_autoSave = autoSave
      @emitModelChanged()

  getDefaultResourceName: ->
    @_defaultResourceName

  setDefaultResourceName: (defaultResourceName)->
    if (defaultResourceName != @_autoSave)
      @_defaultResourceName = defaultResourceName
      @emitModelChanged()

  getLoadInitialResource: ->
    @_loadInitialResource

  setLoadInitialResource: (loadInitialResource)->
    if (loadInitialResource != @_loadInitialResource)
      @_loadInitialResource = loadInitialResource
      @emitModelChanged()

  getInitialResourceString: ->
    @_initialResourceString

  setInitialResourceString: (initialResourceString)->
    if (initialResourceString != @_initialResourceString)
      @_initialResourceString = initialResourceString
      @emitModelChanged()

  updateInitialResourceString: ->
    if (@authoringMode && @applicationModel)
      @setInitialResourceString(JSON.stringify(@applicationModel.getResource()))

  getCollaborationStartup: ->
    @_collaborationStartup

  setCollaborationStartup: (collaborationStartup)->
    if (@_collaborationStartup != collaborationStartup)
      @_collaborationStartup = collaborationStartup
      @emitModelChanged()

  getSpecialLanguageTermKeys: ->
    Object.keys(@_specialLanguageTerms)

  addSpecialLanguageTermKey: (key) ->
    @_specialLanguageTerms[key] = ""
    @emitEvent("specialLanguageTermsChanged")
    @emitModelChanged()

  removeSpecialLanguageTermKey: (key) ->
    delete @_specialLanguageTerms[key]
    @emitEvent("specialLanguageTermsChanged")
    @emitModelChanged()

  changeSpecialLanguageTermKey: (oldKey, newKey) ->
    @_specialLanguageTerms[newKey] = @_specialLanguageTerms[oldKey]
    delete @_specialLanguageTerms[oldKey]
    @emitEvent("specialLanguageTermsChanged")
    @emitModelChanged()

  getSpecialLanguageTermValue: (key) ->
    @_specialLanguageTerms[key]

  setSpecialLanguageTermValue: (key, value) ->
    if (@_specialLanguageTerms[key] != value)
      @_specialLanguageTerms[key] = value
      @emitEvent("specialLanguageTermsChanged")
      @emitModelChanged()

  getSpecialLanguageTranslation: (key) =>
    if (@_specialLanguageTerms[key])
      @_specialLanguageTerms[key]
    else
      null

  getCollaborationStartupOptions: ->
    collaborationStartupOptions

  getApplicationModel: ->
    @_applicationModel

  setApplicationModel: (applicationModel)->
    # no need to check for changes, the applicationModel is not directly stored
    @_applicationModel = applicationModel
    if (applicationModel)
      applicationModel.addListener("modelChanged", =>
        @emitModelChanged()
      )
      applicationModel.addListener("modelLoaded", =>
        @emitModelLoaded()
      )

  getAuthoringMode: ->
    @_authoringMode && @_applicationModel!=null

  setAuthoringMode: (authoringMode)->
    # no need to check for changes, the authoringMode is not stored
    @_authoringMode = authoringMode

  loadDefaultConfiguration: ->

  getJsonProperty: (content, name, defaultConfigurationValues = defaultCommonConfigurationValues)->
    if (content && typeof content[name] != "undefined")
      content[name]
    else
      defaultConfigurationValues[name]

  ###
  # override and call super()
  ###
  loadFromResourceContent: (content)->
    @clearContent()
    super(content)
    if (content.help)
      @_helpHtml = @getJsonProperty(content, "help")
    @_useConfigurationHelp = @getJsonProperty(content, "useConfigurationHelp")
    @_autoLoadLatestResource = @getJsonProperty(content, "autoLoadLatestResource")
    @_singleDocumentMode = @getJsonProperty(content, "singleDocumentMode")
    @_showResourceName = @getJsonProperty(content, "showResourceName")
    @_showImportExport = @getJsonProperty(content, "showImportExport")
    @_showLoadExamples = @getJsonProperty(content, "showLoadExamples")
    @_showLoadConfiguration = @getJsonProperty(content, "showLoadConfiguration")
    @_showModelJson = @getJsonProperty(content, "showModelJson")
    @_autoSave = @getJsonProperty(content, "autoSave")
    @_defaultResourceName = @getJsonProperty(content, "defaultResourceName")
    @_loadInitialResource = @getJsonProperty(content, "loadInitialResource")
    @_initialResourceString = @getJsonProperty(content, "initialResourceString")
    @_collaborationStartup = @getJsonProperty(content, "collaborationStartup")
    @_specialLanguageTerms = @getJsonProperty(content, "specialLanguageTerms")
    if (forceAutoSave)
      @_autoSave = true
    @emitEvent("specialLanguageTermsChanged")

  ###
  # override and don't call super()
  ###
  getResourceContent: ->
    content = super()
    @updateInitialResourceString()
    initialResourceString = if (@authoringMode && @applicationModel && !@applicationModel.isEmpty())
      @_initialResourceString
    else
      null
    content.help = @_helpHtml
    content.useConfigurationHelp = @_useConfigurationHelp
    content.autoLoadLatestResource = @_autoLoadLatestResource
    content.showResourceName = @_showResourceName
    content.singleDocumentMode = @_singleDocumentMode
    content.showImportExport = @_showImportExport
    content.showLoadExamples = @_showLoadExamples
    content.showLoadConfiguration = @_showLoadConfiguration
    content.showModelJson = @_showModelJson
    content.autoSave = @_autoSave
    content.defaultResourceName = @_defaultResourceName
    content.loadInitialResource = @_loadInitialResource
    content.initialResourceString = initialResourceString
    content.collaborationStartup = @_collaborationStartup
    content.specialLanguageTerms = @_specialLanguageTerms
    content

