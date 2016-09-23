"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}

debug = true
debug = false

replaceRegExps = for i in [0..10]
  new RegExp("\\{#{i}\\}", "g")

i_ = "i_"
undefinedKeyMessage = "???undefinedKey???"
cdataStart = "<![CDATA["
cdataEnd = "]]>"

class LanguageHandler
  constructor: ->
    @_debug = false
#    @_debug = true
    @_getSpecialTranslation = null

  setSpecialTranslationFunction: (specialTranslationFunction) ->
    @_getSpecialTranslation = specialTranslationFunction

# this function will handle things like string parameters etc.
  getMessage: (key, args...) ->
    message = ""
    if (typeof key != "undefined")
      if (typeof key != "string")
        key = key.toString()
      rawMessage = null
      if (@_getSpecialTranslation)
        rawMessage = @_getSpecialTranslation(key)
      if (rawMessage == null)
        rawMessage = @getMsg(key)
      message = rawMessage
      if (message?)
        for arg,index in args
          message = message.replace(replaceRegExps[index], arg)
        if (message.match(replaceRegExps[index + 1]))
          console.log("g4i18n: missing argument(s) for key '#{key}', value '#{rawMessage}', but only #{arguments.length - 1} arguments given")
      else
        console.log("g4i18n: missing value for key '#{key}'")
        message = "???'#{key}'???"
    else
      message = undefinedKeyMessage
    message

  getI_Message: (key, args...) ->
    if (typeof key != "undefined")
      if (typeof key != "string")
        key = key.toString()
      if (key.toLowerCase().indexOf(i_) == 0)
        @getMessage(key.substr(i_.length), args...)
      else
        key
    else
      undefinedKeyMessage

  getMsg: (key) ->
    console.error("this method must be overriden")

  existsMessage: (key) ->
    value = @getMsg(key)
    return typeof value == "string" && value.length

  getLanguage: () ->
    console.error("this method must be overriden")


class OpenSocialLanguageHandler extends LanguageHandler
  constructor: ->
    super()
    if (gadgets?)
      @gadgetPrefs = new gadgets.Prefs()
      if (@_debug)
        console.log("... running inside OpenSocial, gadgets.Prefs().getLang(): #{@gadgetPrefs.getLang()}")
    else
      throw "not running inside OpenSocial!"

  getMsg: (key) ->
    @gadgetPrefs.getMsg(key)

  getLanguage: () ->
    @gadgetPrefs.getLang()


loadFile = (fileName, readyHandler, errorHandler)->
  if (window.XMLHttpRequest)
    xhttp = new XMLHttpRequest()
  else # code for IE5 and IE6
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xhttp.open("GET", fileName, true);
  xhttp.onload = =>
    if (xhttp.readyState == 4 && xhttp.status == 200)
#      console.log(xhttp.response)
      readyHandler(xhttp)
  xhttp.onreadystatechange = ->
#    console.log("new ready state: #{xhttp.readyState}, status: #{xhttp.status}")
    if (xhttp.readyState == 4 && xhttp.status != 200)
      errorHandler(xhttp)
  xhttp.send();

getErrorMessage = (xhttp, filePath, fileType) ->
  "problems loading #{fileType} file #{filePath}, error: #{xhttp.status} (#{xhttp.statusText})"

languagePath = "/languages/"
indexFile = "list.txt"
resourceLoader = null
pathCacheControlPostFix = ""
if (golab.common.resourceLoader)
  resourceLoader = golab.common.resourceLoader
  pathCacheControlPostFix = resourceLoader.getToolCommonsPathCacheControlPostFix()

getFilePath = (fileName)->
  filePath = "#{languagePath}#{fileName}"
  if (resourceLoader)
    resourceLoader.getIncludeUrl(filePath)
  else
    ".#{filePath}#{pathCacheControlPostFix}"

handleCData = (content) ->
  cdataStartIndex = content.indexOf(cdataStart)
  if (cdataStartIndex >= 0)
    cdataEndIndex = content.indexOf(cdataEnd)
    content.substring(cdataStartIndex + cdataStart.length, cdataEndIndex)
  else
    content

class StandAloneLanguageHandler extends LanguageHandler
  constructor: (desiredLanguage, callback)->
    @languageMap = {}
    @fallBackLanguage = null
    @fallBackLanguageMap = {}
    @languageFiles = {}
    @currentLanguage = null
    if (arguments.length > 0)
      @loadLanguageFileIndex(=>
        @selectInitialLanguage(desiredLanguage, callback)
      , (errorMessage)=>
        console.error(errorMessage)
        callback(null, @)
      )

  loadLanguageFileIndex: (readyHandler, errorHandler)->
#    indexFilePath = languagePath + indexFile + pathCacheControlPostFix
#    if (resourceLoader)
#      indexFilePath = resourceLoader.getIncludeUrl(indexFilePath)
    indexFilePath = getFilePath(indexFile)
    loadFile(indexFilePath, (xhttp)=>
      @parseIndexFileContent(xhttp.responseText, readyHandler)
    , (xhttp)->
      errorHandler(getErrorMessage(xhttp, indexFilePath, "index"))
    )

  parseIndexFileContent: (indexFileContent, readyHandler) ->
    lines = indexFileContent.split("\n")
    for line in lines when line.trim().length && line.trim() != indexFile
      languageParts = line.split("_")
      if (languageParts.length >= 2)
        language = languageParts[languageParts.length - 2]
        @languageFiles[language] = line.trim()
        if (!@fallBackLanguage)
          @fallBackLanguage = language
      else
        console.error("can't understand language file name #{line}")
    if (@languageFiles.length == 0)
      console.error("could not find any language files in the language index file")
    else if (!@languageFiles["en"])
      console.error("there is no en_*.xml file in the language index file")
    if @_debug then console.log("found language files: #{JSON.stringify(@languageFiles)}")
    readyHandler()

  getCurrentLanguage: ->
    @currentLanguage

  getLanguages: ->
    for language,file of @languageFiles
      language

  selectInitialLanguage: (desiredLanguage, callback) =>
    if (@languageFiles.length == 0)
      @languageMap = {}
      setTimeout(callback, 0)
    else
      @setLanguage("en", (error, value) =>
        if (error)
          callback(error, null)
        else
          @fallBackLanguageMap = JSON.parse(JSON.stringify(@languageMap))
          simpleDesiredLanguage = @getSimpleLanguage(desiredLanguage)
          if (@getCurrentLanguage() != simpleDesiredLanguage)
            @setLanguage(desiredLanguage, callback)
          else
            callback(error, value)
      )

  setLanguage: (language, callback)=>
    useLanguage = @getSimpleLanguage(language)
    if (@currentLanguage != useLanguage)
      languageFileName = @getLanguageFileName(useLanguage)
      if (!languageFileName)
        if (@currentLanguage)
          console.log("desired language '#{language}' is not present, using 'en'")
          callback(null, this)
          return
        useLanguage = "en"
        languageFileName = @getLanguageFileName(useLanguage)
      #      console.log("loading language file for language #{useLanguage}")
      @loadLanguageFile(languageFileName, useLanguage, callback)

  getLanguageFileName: (language) ->
    @languageFiles[language]

  getSimpleLanguage: (language)->
    languageParts = language.split("-")
    languageParts[0]

  loadLanguageFile: (fileName, useLanguage, callback) ->
#    languageFilePath = languagePath + fileName + pathCacheControlPostFix
    languageFilePath = getFilePath(fileName)
    loadFile(languageFilePath, (xhttp)=>
      @parseLanguageFileContent(xhttp.responseText, languageFilePath, useLanguage)
      @currentLanguage = useLanguage
      callback(null, @)
    , (xhttp)->
      callback(getErrorMessage(xhttp, languageFilePath, "language"))
    )

  parseLanguageFileContent: (xmlContent, languageFilePath, language) ->
    @languageMap = {}
    loopLeftCount = 12345 # just to prevent an endless loop while developing
    nrOfKeys = 0
    startOpenTagString = "<msg "
    startNameAttributeString = "name=\""
    endNameAttributeString = "\""
    endOpenTagString = ">"
    closeTagString = "</msg>"
    startOpenTagIndex = xmlContent.indexOf(startOpenTagString)
    while (startOpenTagIndex >= 0 && --loopLeftCount >= 0)
      startNameAttributeIndex = xmlContent.indexOf(startNameAttributeString, startOpenTagIndex + startOpenTagString.length)
      if (startNameAttributeIndex < 0)
        console.warn("failed to find name attribute")
        startOpenTagIndex = -1
      else
        startNameValueIndex = startNameAttributeIndex + startNameAttributeString.length
        endNameAttributeIndex = xmlContent.indexOf(endNameAttributeString, startNameValueIndex)
        if (endNameAttributeIndex < 0)
          console.warn("failed to find end of name attribute")
          startOpenTagIndex = -1
        else
          key = xmlContent.slice(startNameValueIndex, endNameAttributeIndex).trim()
          endOpenTagIndex = xmlContent.indexOf(endOpenTagString, endNameAttributeIndex + endNameAttributeString.length)
          if (endOpenTagIndex < 0)
            console.warn("failed to find end op open msg tag")
            startOpenTagIndex = -1
          else
            startValueIndex = endOpenTagIndex + endOpenTagString.length
            closeTagIndex = xmlContent.indexOf(closeTagString, startValueIndex)
            if (closeTagIndex < 0)
              console.warn("failed to find close msg tag")
              startOpenTagIndex = -1
            else
              value = xmlContent.slice(startValueIndex, closeTagIndex).trim()
              value = handleCData(value)
              #              console.warn("found: key=#{key}, value=#{value}")
              @languageMap[key] = value
              ++nrOfKeys
              startOpenTagIndex = xmlContent.indexOf(startOpenTagString, closeTagIndex + closeTagString.length)
    if (loopLeftCount < 0)
      console.warn("loop terminated because of to many loops, probable there is an error some where")
    if @_debug then console.log("loaded #{nrOfKeys} keys from language file #{languageFilePath}, for language #{language}")

  getMsg: (key) ->
    if (@languageMap.hasOwnProperty(key))
      @languageMap[key]
    else
      @fallBackLanguageMap[key]

  getLanguage: () ->
    @currentLanguage

  getFallBackLanguage: () ->
    @fallBackLanguage

  getNrOfLanguageFiles: () ->
    nrOfKeys = 0
    for key, value of @languageFiles
      ++nrOfKeys
    nrOfKeys

  getLanguageFile: (language) ->


  getNrOfKeys: () ->
    nrOfKeys = 0
    for key, value of @languageMap
      ++nrOfKeys
    nrOfKeys

window.golab.testing = window.golab.testing || {}
window.golab.testing.languagehandlers = {
  handleCData: handleCData
  StandAloneLanguageHandler: StandAloneLanguageHandler
}

createResult = null
waitingCallbacks = []

window.golab.createLanguageHandler = (desiredLanguage, callback) ->

  languageHandlerCreated = (error, languageHandler) ->
    if (debug)
      console.log("new language handler created, nr of waiting callbacks: #{waitingCallbacks.length}")
    createResult = {
      error: error
      languageHandler: languageHandler
    }
    for callback in waitingCallbacks
      callback(error, languageHandler)
    waitingCallbacks.length = 0

  createTheLanguageHandler = () ->
#    console.log("start of creating the language handler")
    if (gadgets?)
      setTimeout(->
        if (debug)
          console.log("creating OpenSocialLanguageHandler")
        languageHandlerCreated(null, new OpenSocialLanguageHandler())
      , 0)
    else
      if (debug)
        console.log("creating StandAloneLanguageHandler for language: #{desiredLanguage}")
      new StandAloneLanguageHandler(desiredLanguage, languageHandlerCreated)


  if (createResult)
    setTimeout(->
      if (debug)
        console.log("using already created languageHandler")
      callback(createResult.error, createResult.languageHandler)
    , 0)
  else
    if (waitingCallbacks.length == 0)
      createTheLanguageHandler()
    waitingCallbacks.push(callback)

#  if (gadgets?)
#    setTimeout(->
#      if (debug)
#        console.log("creating OpenSocialLanguageHandler")
#      callback(null, new OpenSocialLanguageHandler())
#    , 0)
#  else
#    if (debug)
#      console.log("creating StandAloneLanguageHandler for language: #{desiredLanguage}")
#    new StandAloneLanguageHandler(desiredLanguage, callback)