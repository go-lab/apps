"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

transpiledMillis = "__buildMillis__"

isTranspiledMillisAvailable = ->
  transpiledMillis.length > 0 && transpiledMillis.charAt(0) != "_"

getTranspiledMillis = ->
  parseInt(transpiledMillis)

ut.commons.golabUtils = angular.module('golabUtils', ["ui-notification"])

ut.commons.golabUtils.run(["$rootScope", "$templateCache", "dateTimeFormat",
  ($rootScope, $templateCache, dateTimeFormat)->
    $rootScope.dateTimeFormat = dateTimeFormat
    $templateCache.put('angular-ui-notification.html', """
<div class="ui-notification">
    <h3 ng-show="title" ng-bind-html="title"></h3>
    <div class="message" ng-bind-html="message"></div>
</div>
""");

])

ut.commons.golabUtils.value("dateTimeFormat", "dd MMM yy, H:mm:ss")

ut.commons.golabUtils.factory("configurationModel", ["environmentHandlers", (environmentHandlers)->
  if (window.ut.commons.ConfigurationModel)
    new window.ut.commons.ConfigurationModel(environmentHandlers)
  else
    {}
])

ut.commons.golabUtils.factory("browser", ->
  # from http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  testCSS = (prop)->
    prop of document.documentElement.style;
  # At least Safari 3+: "[object HTMLElementConstructor]"
  isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
  browser = {
    isOpera: !!(window.opera && window.opera.version)  # Opera 8.0+
    isFirefox: testCSS('MozBoxSizing')                 # FF 0.8+
    isSafari: isSafari
    isChrome: !isSafari && testCSS('WebkitTransform')  # Chrome 1+
    isIE: false || testCSS('msTransform')  # At least IE6
    isWebKit: testCSS('WebkitTransform')
  }
  #  console.log("browser: " + JSON.stringify(browser))
  browser
)

getCssPixelValue = (element, cssName) ->
  value = element.css(cssName)
  parseInt(value)

ut.commons.golabUtils.factory("resourceLoader", [() ->
  if (golab.common.resourceLoader)
    golab.common.resourceLoader
  else
    null
])

errorHandlerFactory =  (resourceLoader, actionLogger, Notification) ->
  getErrorObject = (errorType, message)->
    url = if (window["gadgets"])
      window["gadgets"]["util"].getUrlParameters().url
    else
      window.location.href
    errorObject = {
      objectType: "error"
      id: url
      content: {
        errorType: errorType
        message: message
        device: actionLogger.getDeviceInfo()
      }
    }
    if (resourceLoader)
      errorObject.content.commonsInfo = resourceLoader.getCommonsInfo()
      errorObject.content.libsInfo = resourceLoader.getLibsInfo()
      errorObject.content.toolInfo = resourceLoader.getToolInfo()
    errorObject

  start = () ->
    window.onerror = (message, url, line) ->
      showAlert = false
      showAlert = head.mobile
      if (showAlert)
        alert("Error: " + message + "\nurl: " + url + "\nline #: " + line)

      if (actionLogger)
        object = getErrorObject("uncatched exception", message)
        object.content.url = url
        object.content.line = line
        actionLogger.logSend(object)

      suppressErrorAlert = false
      # If you return true, then error alerts (like in older versions of
      # Internet Explorer) will be suppressed.
      suppressErrorAlert
#    console.log("Installed uncatched error handler")

  shouldSendErrorUsingActionLogger = ()->
    serverDnsNames = ["go-lab.gw.utwente.nl"]
    isFromOneOfTheServers = (href)->
      lcHref = href.toLowerCase()
      for serverDnsName in serverDnsNames
        if (lcHref.indexOf(serverDnsName)>=0)
          return true
      false
    switch (actionLogger.metadataHandler.getContext())
      when window.golab.ils.context.graasp, window.golab.ils.context.ils, window.golab.ils.context.preview, window.golab.ils.context.standalone
        isFromOneOfTheServers(actionLogger.metadataHandler.getGenerator().url)
      else
        false

  reportError = (displayMessage, consoleMessage, error)->
    if (!consoleMessage)
      consoleMessage = displayMessage
    console.warn(consoleMessage.trim())
    if (error)
      console.warn(error)
    Notification.error({
      message: displayMessage
      delay: 20000
    })
    if (actionLogger)
      if (shouldSendErrorUsingActionLogger())
        object = getErrorObject("reported error", consoleMessage)
        object.content.display = displayMessage
        if (error)
          object.content.error = error
#        activityStreamObject = actionLogger.createActivityStreamObject(actionLogger.verbs.send, object)
#        actionLogger.httpPostLogging(activityStreamObject, true, window.ut.commons.actionlogging.collideUrl)
        actionLogger.logSend(object)

  start()
  {
  start: ->
  reportError: reportError
  }

ut.commons.golabUtils.factory("errorHandler", ["resourceLoader", "actionLogger", "Notification", errorHandlerFactory])


ut.commons.golabUtils.factory("leavePageDetector", [->
  handlers = []
  leavePageHandled = false
  debug = false
#  debug = true
  addHandler = (handler)->
    handlers.push(handler)
  leavingPage = (realPageLeave = true)->
    console.log("lpd: leavingPage, leavePageHandled: #{leavePageHandled}") if (debug)
    #    return
    if (!leavePageHandled)
      console.log("lpd: calling #{handlers.length} handlers") if (debug)
      #      alert("handling leaving page, #{handlers.length} handlers")
      for handler in handlers
        try
          handler()
        catch error
          debugger
          console.error(error)
          alert(error)
    #      alert("handled leaving page")
    leavePageHandled = realPageLeave
    return
  window.onbeforeunload = ->
    console.log("lpd: window.onbeforeunload start") if (debug)
    leavingPage()
    console.log("lpd: window.onbeforeunload end") if (debug)
  window.onunload = ->
    console.log("lpd: window.onunload start") if (debug)
    leavingPage()
    console.log("lpd: window.onunload end") if (debug)
  if (head.mobile)
    ###
    on desktops the onbeforeunload and onunload are working
    but on mobile devices devices (iPad/ios8 and nexus4/andriod5) the onbeforeunload and onunload are not send/catched? when
    - tab is closed
    - browser app is left
    In order to make the change to loose data smaller, catch the window.onblur
    The change detection will de a save after 2 seconds of no changes, but it waits no longer then 20 seconds.
    Handle the onblur sooner then 2 seconds, but give the job after the onblur some time to get ready.
    ###
    window.onblur = ->
      console.log("lpd: window.onblur start") if (debug)
      #    alert("window.onblur")
      setTimeout(->
        leavingPage(false)
        console.log("lpd: window.onblur end") if (debug)
      , 500)
  #    window.onbeforepagehide = ->
  #      console.log("lpd: window.onbeforepagehide start") if (debug)
  #      leavingPage(false)
  #      console.log("lpd: window.onbeforepagehide end") if (debug)
  #    window.onpagehide = ->
  #      console.log("lpd: window.onpagehide start") if (debug)
  #  #    alert("window.onpagehide")
  #      leavingPage(false)
  #      console.log("lpd: window.onpagehide end") if (debug)
  simulateLeave = ->
    return
    console.log("lpd: simulating leave page....") if (debug)
    # call leavingPage outside the angular event cycle
    setTimeout(->
      leavingPage(false)
    , 50)
  console.log("lpd: setup finished") if (debug)
  {
  addHandler: addHandler
  simulateLeave: simulateLeave
  }
])

dummy = {
  $parent: {}
}

golabContainerDirective = ($timeout, languageHandler) ->
  {
  restrict: "E"
  scope: {
    containertitle: "@"
  }
  template: """
<div class="golabContainer">
  <div class="golabContainerHeader">
    <span ng-show="showMinimize">
      <i class="fa fa-plus-square-o fa-fw activeButton fontAweSomeButton fontAweSomeGolabContainerButton"
        ng-click="unMinimize()" ng-show="minimized"></i>
      <i class="fa fa-minus-square-o fa-fw activeButton fontAweSomeButton fontAweSomeGolabContainerButton"
        ng-click="minimize()" ng-hide="minimized"></i>
    </span>
    <span class="golabContainerTitle">{{title}}</span>
  </div>
  <div class="golabContainerContent">
    <div ng-transclude></div>
  </div>
</div>
"""
  replace: true
  transclude: true
  link: (scope, element, attrs)->
    scope.configurationModel = scope.$root.configurationModel
    titleWithoutResourceName = languageHandler.getI_Message(scope.containertitle)
    scope.title = titleWithoutResourceName
    updateTitle = ->
      if (model && scope.configurationModel.showResourceName)
        scope.title = languageHandler.getI_Message(scope.containertitle + "WithResourceName", model.getDisplayName())
      else
        scope.title = titleWithoutResourceName

    modelName = ut.commons.utils.getAttributeValue(attrs, "modelName", "")
    if (modelName)
      model = scope.$parent[modelName]
      if (model)
        model.addListeners(["modelChanged", "modelLoaded", "modelCleared", "displayNameChanged"], ->
          updateTitle()
          false
        )
        updateTitle()
    #    console.log(scope.configurationModel)
    #    console.log(scope.configurationModel())
    ##    console.log(scope.resourceLoader)
    ##    console.log(scope.$root.configurationModel)
    ##    $timeout(->
    ##      console.log(scope.configurationModel)
    ##      console.log(scope.$root.configurationModel)
    ##    1000)
    #    console.log(scope.configurationModel.showResourceName)
    scope.$watch("configurationModel.showResourceName", (newValue, oldValue)->
      updateTitle()
    )
    sizeComponentSelector = ut.commons.utils.getAttributeValue(attrs, "sizeComponent", "")
    if (sizeComponentSelector)
      sizeComponent = element.find(sizeComponentSelector)
      if (sizeComponent && sizeComponent.length)
        if (sizeComponent.prop("tagName") == "TEXTAREA")
          sizeComponent.css("resize", "none")
        scope.element = element
        oldHeight = element.height()
        adjustHeight = (newHeight)->
          #          console.log("#{scope.containertitle}.height(): #{newHeight}")
          sizeComponent.height(sizeComponent.height() + newHeight - oldHeight)
          oldHeight = newHeight
        $timeout(->
          currentHeight = element.height()
          if (oldHeight != currentHeight)
            adjustHeight(currentHeight)
        , 200)
    scope.showMinimize = false
    scope.minimizeImage = ""
    scope.minimized = false
    minimizeDirection = ut.commons.utils.getAttributeValue(attrs, "minimize", "").toLowerCase()
    minimizeClassExtension = ""
    minimizeVertical = false
    switch minimizeDirection
      when ""
        minimizeClassExtension = ""
      when "vertical"
        minimizeClassExtension = "Vertical"
        minimizeVertical = true
      when "horizontal"
        minimizeClassExtension = "Horizontal"
      else
        console.log("unknown minimize value: #{minimizeDirection}")
    if (minimizeClassExtension)
      scope.showMinimize = true
      golabContainer = element
      golabContainerHeader = golabContainer.find(".golabContainerHeader")
      golabContainerContent = golabContainer.find(".golabContainerContent")
      golabContainerTitle = golabContainer.find(".golabContainerTitle")
      scope.minimized = false
      headerHeight = golabContainerHeader.height()
      contentHeight = golabContainerContent.height()
      containerHeight = golabContainer.height()
      gadgetResize = ->
        ut.commons.utils.gadgetResize()
      scope.minimize = ->
        if (!scope.minimized)
          containerHeight = golabContainer.height()
          element.addClass("golabContainerMinimized#{minimizeClassExtension}")
          golabContainerContent.addClass("golabContainerContentMinimized")
          if (minimizeVertical)
            contentHeight = golabContainerContent.height()
            golabContainerTitle.addClass("golabContainerTitleVertical")
            newContainerHeight = headerHeight + golabContainerTitle.width() - 1 +
              getCssPixelValue(golabContainerTitle, "padding-left") + getCssPixelValue(golabContainerTitle,
              "padding-right")
            #            console.log("newContainerHeight: #{newContainerHeight}")
            golabContainer.height(newContainerHeight)
          else
            gadgetResize()
          scope.minimized = true

      scope.unMinimize = ->
        if (scope.minimized)
          element.removeClass("golabContainerMinimized#{minimizeClassExtension}")
          golabContainerContent.removeClass("golabContainerContentMinimized")
          if (minimizeVertical)
            golabContainerTitle.removeClass("golabContainerTitleVertical")
            golabContainer.height(containerHeight)
          else
            gadgetResize()
          scope.minimized = false

  }

ut.commons.golabUtils.directive("golabContainer".toLowerCase(), ["$timeout", "languageHandler", "configurationModel",
                                                                 golabContainerDirective])

dummy = {
  dialogBoxes: []
  $root: null
}

maxGetIdTries = 10

dialogBoxDirective = ($timeout, languageHandler, $rootScope) ->
  $rootScope.dialogBoxes = $rootScope.dialogBoxes || []
  {
  restrict: "E"
  scope: {
    title: "@"
    id: "@"
  }
  template: """
            <div ng-transclude class="dialogBoxContent"></div>
            """
  replace: true
  transclude: true
  link: (scope, element, attrs)->
    if (!$rootScope.dialogBoxes)
      throw new Error("there must be a dialogBoxes property on the scope in order to use the dialogBox tag")
    dialogBoxObject = {}
    tryCounter = 0
    id = null
    addDialogBox = ->
      tryCounter++
      id = attrs["id"]
      if (!id)
        id = scope.id
      if (!id && tryCounter < maxGetIdTries)
        $timeout(addDialogBox, 0)
        return
      if (!id)
        throw new Error("id attribute must be specified for dialogBox tag")
      if ($rootScope.dialogBoxes[id])
        throw new Error("duplicate id attribute (#{id}) of dialogBox tag")
      $rootScope.dialogBoxes[id] = dialogBoxObject
    #      console.log("found id after #{tryCounter} tries")
    addDialogBox()
    #    if (id)
    #      addDialogBox()
    #    else
    #      # possibly a "dynamic" id, which is not yet set
    #      $timeout(addDialogBox, 0)

    dialogBoxShown = false
    dialogOptions = {
      beforeClose: (event, ui)->
        # make sure dialog elements are hided
        if (typeof scope["beforeCloseDialogBox"] == "function")
          scope.beforeCloseDialogBox(id)
        $timeout(->
          element.dialog("close")
          dialogBoxShown = false
        , 0)
      minHeight: 50
    }
    addSpecifiedAttributeValue = (name, defaultValue)->
      lcName = name.toLowerCase()
      if (attrs[lcName])
        dialogOptions[name] = attrs[lcName]
      else if (defaultValue)
        dialogOptions[name] = defaultValue
    addSpecifiedAttributeValue("modal", true)
    addSpecifiedAttributeValue("resizable")
    addSpecifiedAttributeValue("width")
    addSpecifiedAttributeValue("height")
    addSpecifiedAttributeValue("minWidth")
    addSpecifiedAttributeValue("maxWidth")
    addSpecifiedAttributeValue("minHeight")
    addSpecifiedAttributeValue("maxHeight")

    iconName = ut.commons.utils.getAttributeValue(attrs, "icon", null)
    iconHtml = ut.commons.utils.getAttributeValue(attrs, "iconHtml", null)
#    20160510 JS: don't show any icons in the title bar
    iconName = null
    iconHtml = null
    iconElement = if (iconName)
      $("<i class='fa fa-#{iconName} fa-fw dialogBoxIcon'></i>")
    else if (iconHtml)
      spanElement = $("<span class='dialogBoxIcon'></span>")
      spanElement.add($(iconHtml))
    else null

    updateDialogBoxIcon = ()->
      if (iconElement)
        titleBarElement = element.parent().children(".ui-dialog-titlebar")
        titleBarTitle = titleBarElement.children(".ui-dialog-title")
        if (titleBarTitle.children(".dialogBoxIcon").length == 0)
          titleBarTitle.prepend(iconElement);
#        console.log("added icon to dialog...")

    scope.$watch("title", (newTitle)->
      dialogTitle = languageHandler.getI_Message(newTitle)
      if (dialogOptions)
        dialogOptions.title = dialogTitle
      else
        element.dialog("option", "title", dialogTitle)
      updateDialogBoxIcon()
    )

    element.hide()

    if (typeof scope.$root.dialogBoxChangeCounter == "undefined")
      scope.$root.dialogBoxChangeCounter = 0
    incrementDialogBoxChangeCounter = ->
      scope.$root.dialogBoxChangeCounter++

    dialogBoxObject.show = ()->
#      console.log("dialogBox directive: show dialog #{id}")
      if (!dialogBoxShown)
        element.dialog(dialogOptions)
        if (dialogOptions && dialogOptions.maxWidth)
          element.parent().css({'max-width': dialogOptions.maxWidth})
        updateDialogBoxIcon()
        dialogOptions = null
        incrementDialogBoxChangeCounter()
        dialogBoxShown = true
        ut.commons.utils.gadgetResize()

    dialogBoxObject.close = ()->
#      console.log("dialogBox directive: close dialog #{id}")
      if (dialogBoxShown && element.dialog("isOpen"))
        element.dialog("close")
        incrementDialogBoxChangeCounter()
        ut.commons.utils.gadgetResize()
      dialogBoxShown = false
  }

ut.commons.golabUtils.directive("dialogBox".toLowerCase(),
  ["$timeout", "languageHandler", "$rootScope", dialogBoxDirective])

dummy = {
  questionParams: {}
  dialogBoxId: ""
  answer: ""
  okLabel: ""
  questionOkAnswer: null
  questionCancelAnswer: null
}

askQuestionDirective = ($timeout, languageHandler, $rootScope) ->
  $rootScope.askQuestion = {

  }
  {
  restrict: "E"
  template: """
<div>
  <div ng-show='askQuestion.questionParams.question' class="questionQuestion">{{askQuestion.questionParams.question}}</div>
  <input ng-model="askQuestion.questionParams.answer" ng-enter="ok()" ng-show="showInput" class="questionInput"/>
  <div class="dialogButtonRow">
    <ul class="toolbar">
      <li ng-show="okLabel">
        <span class="activeButton textButton" ng-class="{disabledButton: okDisabled}" ng-click='ok()'>{{okLabel}}</span>
      </li>
      <li ng-show="ok2Label">
        <span class="activeButton textButton" ng-class="{disabledButton: okDisabled}" ng-click='ok2()'>{{ok2Label}}</span>
      </li>
      <li ng-show="cancelLabel">
        <span class="activeButton textButton" ng-click='cancel()'>{{cancelLabel}}</span>
      </li>
    </ul>
  </div>
</div>
"""
  replace: true
  transclude: false
  link: (scope, element, attrs)->
    askQuestionOptions = {}
    addSpecifiedAttributeValue = (name, defaultValue)->
      lcName = name.toLowerCase()
      if (attrs[lcName])
        askQuestionOptions[name] = attrs[lcName]
      else if (defaultValue)
        askQuestionOptions[name] = defaultValue
    addSpecifiedAttributeValue("ok")
    addSpecifiedAttributeValue("ok2")
    addSpecifiedAttributeValue("cancel")
    if (askQuestionOptions.ok)
      askQuestionOptions.ok = languageHandler.getI_Message(askQuestionOptions.ok)
    if (askQuestionOptions.ok2)
      askQuestionOptions.ok2 = languageHandler.getI_Message(askQuestionOptions.ok2)
    if (askQuestionOptions.cancel)
      askQuestionOptions.cancel = languageHandler.getI_Message(askQuestionOptions.cancel)
    scope.okLabel = askQuestionOptions.ok
    scope.ok2Label = askQuestionOptions.ok2
    scope.cancelLabel = askQuestionOptions.cancel
    scope.showInput = true
    scope.okDisabled = false
    updateOkDisabled = ->
      scope.okDisabled = false
      if (scope.showInput)
        if (scope.askQuestion && scope.askQuestion.questionParams)
          if (typeof scope.askQuestion.questionParams.answer == "string")
            answer = scope.askQuestion.questionParams.answer.trim()
            scope.okDisabled = answer.length == 0

    scope.$watch("askQuestion.questionParams.answer", updateOkDisabled)
    dialogBoxId = ""
    updateState = ->
#      console.log("updateState #{JSON.stringify(scope.askQuestion.questionParams)}")
      if (scope.askQuestion.questionParams)
        if (typeof scope.askQuestion.questionParams.answer != "string")
          scope.showInput = false
        if (scope.askQuestion.questionParams.okLabel)
          scope.okLabel = scope.askQuestion.questionParams.okLabel
        if (scope.askQuestion.questionParams.ok2Label)
          scope.ok2Label = scope.askQuestion.questionParams.ok2Label
        if (scope.askQuestion.questionParams.cancelLabel)
          scope.cancelLabel = scope.askQuestion.questionParams.cancelLabel
        if (scope.askQuestion.questionParams.dialogBoxId)
          dialogBoxId = scope.askQuestion.questionParams.dialogBoxId
        updateOkDisabled()
      if (!scope.okLabel && !scope.ok2Label && !scope.cancelLabel)
        console.error("askQuestion directive: at least one of the labels must be defined!")

    scope.elem = element
    scope.$watch("dialogBoxChangeCounter", () ->
#      console.log("dialogBoxChangeCounter changed")
      if (element.is(':visible'))
        updateState()
    )
    closeDialogBox = ->
      if (dialogBoxId)
        $rootScope.dialogBoxes[dialogBoxId].close()
    #      if (scope.askQuestion.questionParams.dialogBoxId)
    #        $rootScope.dialogBoxes[scope.askQuestion.questionParams.dialogBoxId].close()
    scope.ok = ->
#      console.log("OK: #{scope.askQuestion.questionParams.answer}")
      if (scope.okDisabled)
        return
      if (scope.askQuestion.questionParams.questionOkAnswer)
        scope.askQuestion.questionParams.questionOkAnswer(scope.askQuestion.questionParams.answer)
      closeDialogBox()
    scope.ok2 = ->
#      console.log("OK: #{scope.askQuestion.questionParams.answer}")
      if (scope.okDisabled)
        return
      if (scope.askQuestion.questionParams.questionOk2Answer)
        scope.askQuestion.questionParams.questionOk2Answer(scope.askQuestion.questionParams.answer)
      closeDialogBox()
    scope.cancel = ->
#      console.log("cancel: #{scope.askQuestion.questionParams.answer}")
      if (scope.askQuestion.questionParams.questionCancelAnswer)
        scope.askQuestion.questionParams.questionCancelAnswer()
      closeDialogBox()

  }

ut.commons.golabUtils.directive("askQuestion".toLowerCase(), ["$timeout", "languageHandler", "$rootScope",
                                                              askQuestionDirective])

toolBarDirective = () ->
  {
  restrict: "E"
  template: """
<ul class="toolbar" ng-class="{verticalToolbar:verticalToolbar}">
  <li class="toolBarBeginSpace"></li>
  <span ng-transclude></span>
</ul>
"""
  scope: true
  replace: true
  transclude: true
  link: (scope, element, attrs)->
    scope.verticalToolbar = false
    if (attrs["vertical"])
      scope.verticalToolbar = attrs["vertical"].toLowerCase() == "true"
  }

ut.commons.golabUtils.directive("toolbar", [toolBarDirective])

g4i18nFilter = (languageHandler)->
  (key)->
#    console.log("key: #{key}")
    languageHandler.getMessage(arguments...)

ut.commons.golabUtils.filter("g4i18n", ["languageHandler", g4i18nFilter])

i_g4i18nFilter = (languageHandler)->
  (key)->
#    console.log("key: #{key}")
    languageHandler.getI_Message(arguments...)

ut.commons.golabUtils.filter("i_g4i18n", ["languageHandler", i_g4i18nFilter])

g4i18nDirective = (languageHandler) ->
  {
  restrict: "A"
  link: (scope, element, attrs)->
    key = attrs["g4i18n"]
    element.text(languageHandler.getMessage(key))
  }

ut.commons.golabUtils.directive("g4i18n", ["languageHandler", g4i18nDirective])

durationFilter = ()->
  (millis)->
    numTo2DigitsString = (num)->
      if (num < 10)
        "0" + num
      else
        "" + num
    seconds = Math.floor(millis / 1000)
    hours = Math.floor(seconds / (60 * 60))
    secondsLeft = seconds - 60 * 60 * hours
    minutes = Math.floor(secondsLeft / 60)
    secondsLeft -= minutes * 60
    if (hours == 0)
      "#{minutes}:#{numTo2DigitsString(secondsLeft)}"
    else
      "#{hours}:#{numTo2DigitsString(minutes)}:#{numTo2DigitsString(secondsLeft)}"

ut.commons.golabUtils.filter("duration", [durationFilter])

keyCodes = {
  esc: 27,
  space: 32,
  enter: 13,
  tab: 9,
  backspace: 8,
  shift: 16,
  ctrl: 17,
  alt: 18,
  capslock: 20,
  numlock: 144,
  leftArrow: 37,
  upArrow: 38,
  rightArrow: 39,
  downArrow: 40
}

defineKeyPressDirective = (app, label, keyCode)->
  app.directive(label,[ ->
    {
    restrict: "A"
    link: (scope, element, attrs)->
      element.bind("keypress", (event)->
#        console.log("#{label}, event:which: #{event.which}")
        if (event.which == keyCode)
          scope.$apply(->
            scope.$eval(attrs[label], {"event": event})
          )
      )
    }
  ])

defineKeyDownDirective = (app, label, keyCode)->
  app.directive(label,[ ->
    {
    restrict: "A"
    link: (scope, element, attrs)->
      element.bind("keydown", (event)->
#        console.log("#{label}, event:which: #{event.which}")
        if (event.which == keyCode)
          event.preventDefault()
          scope.$apply(->
            scope.$eval(attrs[label], {"event": event})
          )
      )
    }
  ])

defineKeyPressDirective(ut.commons.golabUtils, "ngEnter", keyCodes.enter)
defineKeyPressDirective(ut.commons.golabUtils, "ngSpace", keyCodes.space)
defineKeyDownDirective(ut.commons.golabUtils, "ngUpArrow", keyCodes.upArrow)
defineKeyDownDirective(ut.commons.golabUtils, "ngDownArrow", keyCodes.downArrow)


helpIdCounter = 0

helpDirective = (configurationModel, languageHandler, $filter, dateTimeFormat, leavePageDetector) ->
  {
  restrict: "E"
  template: """
<span ng-show="helpHtml">
  <li>
    <i class="fa fa-question fa-fw activeButton fontAweSomeButton" ng-click='showHelp($event)'
      title="{{'help.openButton.tooltip' | g4i18n}}"></i>
  </li>
  <dialogBox id="{{helpDialogId}}" title="{{helpDialogTitle}}" icon="question" resizable="false" width="500">
    <div ng-bind-html="helpHtml"></div>
    <div class="transpiledDate" ng-show='showTranspiledDate'>{{transpiledDate | date}}</div>
    <div class="dialogButtonRow">
      <ul class="toolbar">
        <li>
           <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton"
             ng-click='closeHelp($event)' title="{{'loadSave.showModelJsonDialog.close' | g4i18n}}"></i>
        </li>
      </ul>
    </div>
  </div>
  </dialogBox>
</span>
"""
  replace: true
  link: (scope, element, attrs)->
    id = helpIdCounter++
    helpDialogId = "helpDialogBox#{id}"
    scope.helpDialogId = helpDialogId
    scope.helpDialogTitle = languageHandler.getMessage("help.helpDialog.dialogTitle")
    scope.showTranspiledDate = false
    if (isTranspiledMillisAvailable())
      scope.showTranspiledDate = true
      transpiledDate =  $filter("date")(getTranspiledMillis(), dateTimeFormat)
      scope.transpiledDate = languageHandler.getMessage("help.helpDialog.buildDate", transpiledDate)
    scope.helpHtml = ""
    updateHelpHtml = ->
      if (configurationModel.useConfigurationHelp)
        helpHtml = configurationModel.getHelpHtml()
      else
        helpHtml = configurationModel.getStandardHelpHtml()
      scope.helpHtml = helpHtml
    updateHelpHtml()
    configurationModel.addListener("modelChanged", ->
      updateHelpHtml()
    )
    mayShowConfiguration = false
    scope.showHelp = ->
#      console.log("show help....")
      scope.dialogBoxes[helpDialogId].show()
      mayShowConfiguration = (event.ctrlKey || event.altKey) && event.shiftKey

    scope.closeHelp = ->
      scope.dialogBoxes[helpDialogId].close()
      leavePageDetector?.simulateLeave()
      if (mayShowConfiguration && (event.ctrlKey || event.altKey) && !event.shiftKey)
        configurationModel.setForceShowLoadConfiguration(!configurationModel.getForceShowLoadConfiguration())
      mayShowConfiguration = false

  }

ut.commons.golabUtils.directive("help",
  ["configurationModel", "languageHandler", "$filter", "dateTimeFormat", "leavePageDetector",
   helpDirective])


testMessageIdCounter = 0

testMessageDirective = () ->
  {
  restrict: "E"
  template: """
<span>
  <li>
    <i class="fa fa-bell-o fa-fw activeButton fontAweSomeButton" ng-click='showMessage()'></i>
  </li>
  <dialogBox id="{{testMessageDialogId}}" title="test message" resizable="false" width="350">
      <askQuestion cancel="read it"></askQuestion>
  </dialogBox>
</span>
"""
  replace: true
  link: (scope, element, attrs)->
    id = testMessageIdCounter++
    testMessageDialogId = "testMessageDialogBox#{id}"
    scope.testMessageDialogId = testMessageDialogId

    scope.showMessage = ->
      scope.askQuestion.questionParams = {
        question: "The very important message....."
        answer: null
        dialogBoxId: testMessageDialogId
      }
      scope.dialogBoxes[testMessageDialogId].show()
  }

ut.commons.golabUtils.directive("testMessage".toLowerCase(), [testMessageDirective])


gadgetResizeAtInitDirective = ($timeout) ->
  {
  restrict: "A"
  link: (scope, element, attrs)->
    resizeAtInit = ->
#      console.log("element.is(':visible'): #{element.is(':visible')}, #{window.getComputedStyle(element[0]).display}")
      if (element.is(':visible'))
        ut.commons.utils.gadgetResize()
      else
        $timeout(resizeAtInit, 250)

    $timeout(resizeAtInit, 10)
  }

ut.commons.golabUtils.directive("resizeAtInit".toLowerCase(), ["$timeout", gadgetResizeAtInitDirective])

reverseFilter = ()->
  (items)->
    items.slice().reverse()

ut.commons.golabUtils.filter("reverse", [reverseFilter])

startupTimeReported = false

golabCloakDirective = ($rootScope, $timeout) ->
  if (!$rootScope.golab)
    $rootScope.golab = {
      startupFinished: false
    }
  {
  restrict: "A"
  link: (scope, element, attrs)->
    element.addClass('golabCloak');
    if (!watchingGolabStartupFinished)
      watchingGolabStartupFinished = true
      unwatch = scope.$watch("golab.startupFinished", (value)->
        if (value)
          element.removeClass('golabCloak')
          attrs.$set("golabCloak".toLowerCase(), undefined)
          unwatch()
          if (window.startupMillis && !startupTimeReported)
            startingMillis = Date.now()-window.startupMillis
            toolInfo = {
              "name": "unknown",
              "version": "unknown",
              "buildMillis": "__buildMillis__"
            }
            if (window.golab.common.resourceLoader)
              toolInfo= window.golab.common.resourceLoader.getToolInfo()
            buildMillis = parseInt(toolInfo.buildMillis)
            buildTime = if (!isNaN(buildMillis))
              new Date(buildMillis)
            else 
              "unknown"
            console.log("Startup of '#{toolInfo.name}' (version #{toolInfo.version}, build on #{buildTime}) took #{startingMillis} ms.")
#            console.log(scope.environmentHandlers)
            startupTimeReported = true
      )
  }

ut.commons.golabUtils.directive("golabCloak".toLowerCase(), ["$rootScope", "$timeout", golabCloakDirective])

#showHideSourceInitDirective = ($interval) ->
#  {
#  restrict: "A"
#  link: (scope, element, attrs)->
#    $window = $(window)
#
#    elementIsVisible = (element)->
#      console.log("showHide.elementIsVisible(#{element[0]}, hidden: #{element.is(':hidden')}, visible: #{element.is(':visible')}")
#      if (element.is(':hidden'))
#        false
#      else
#        parent = element.parent()
#        console.log(parent)
#        if (parent.length==1)
#          elementIsVisible(parent)
#        else
#          true
#
#    elementIsVisibleTest = (element)->
#      parents = element.parents()
#      for parent in parents
#        console.log(parent)
#        jqParent = $(parent)
#        console.log("showHide: hidden: #{jqParent.is(':hidden')}, visible: #{jqParent.is(':visible')}")
#        console.log("showHide: position: #{JSON.stringify(jqParent.position())}, offset: #{JSON.stringify(jqParent.offset())}")
#      false
#
##    elementIsVisible = ->
##      if (!element.is(':visible'))
##        return false
##
##      window_left = $window.scrollLeft();
##      window_top = $window.scrollTop();
##      offset = element.offset();
##      left = offset.left;
##      top = offset.top;
##
##      if (top + element.height() >= window_top &&
##        top - (element.data('appear-top-offset') || 0) <= window_top + $window.height() &&
##        left + element.width() >= window_left &&
##        left - (element.data('appear-left-offset') || 0) <= window_left + $window.width())
##          true
##      else
##        false
#
#    body = $("body")
#    visibleCheck = ->
##      isVisible = elementIsVisibleTest(element)
##      console.log("showHide: gadget visible: #{isVisible}")
#      isVisible = elementIsVisibleTest(body)
#      console.log("showHide: body visible: #{isVisible}")
#
#    $interval(visibleCheck, 1000)
#  }
#
#ut.commons.golabUtils.directive("showHideSource".toLowerCase(), ["$interval", showHideSourceInitDirective])
#

golabSectionDirective = (languageHandler, $timeout)->
  {
  restrict: "E"
  template: """
<div class="test" title=''>
  <div class="golabSectionTitle" ng-class="{firstGolabSectionTitle: firstSection}">
    <span title='{{showHideTooltip}}'>
      <i class="fa fa-chevron-right fa-fw activeButton fontAweSomeButtonSmall" ng-class='{disabledButton: !allowShowHide}'
       ng-hide="sectionShown" ng-click="showSection()" Xtitle="{{'editConfiguration.showSection.tooltip' | g4i18n}}"></i>
      <i class="fa fa-chevron-down fa-fw activeButton fontAweSomeButtonSmall" ng-class='{disabledButton: !allowShowHide}'
       ng-show="sectionShown" ng-click="hideSection()" Xtitle="{{'editConfiguration.hideSection.tooltip' | g4i18n}}"></i>
      <span class="secondaryTextButton" ng-class='{notActiveTextButton: !allowShowHide}' ng-click='showHideSection()'>{{title}}</span>
    </span>
  </div>
  <div ng-transclude ng-show='sectionShown' class="golabSectionContent"></div>
</div>

"""
  replace: false
  transclude: true
  scope: true
#  scope: {
#    title: "&"
#  }
  link: (scope, element, attrs)->
    scope.firstSection = ut.commons.utils.getBooleanAttributeValue(attrs,"firstSection", false)
    configKey = ut.commons.utils.getAttributeValue(attrs,"key","???")
    titleKey = ut.commons.utils.getAttributeValue(attrs,"title","")
    showSectionTooltip = languageHandler.getMessage('editConfiguration.showSection.tooltip')
    hideSectionTooltip = languageHandler.getMessage('editConfiguration.hideSection.tooltip')
    hideSectionNotAllowedTooltip = languageHandler.getMessage('editConfiguration.hideSectionNotAllowed.tooltip')
    scope.title = languageHandler.getI_Message(titleKey)
    scope.sectionShown = false
    scope.allowShowHide = true
    updateShowHideTooltip = ()->
      scope.showHideTooltip = if (scope.sectionShown)
        if (scope.allowShowHide)
          hideSectionTooltip
        else
          hideSectionNotAllowedTooltip
      else
        showSectionTooltip
    updateShowHideTooltip()
    configKey = configKey.replace(/\./g,"_")
    configModel = null
    configModelName = attrs["modelname"]
    if (configModelName)
      configModel = scope[configModelName]
      if (!configModel)
        console.error("expected to find a model class object on the scope, named #{configModelName}")
        return
      if (!configModel instanceof window.ut.commons.ResourceEventEmitterModel)
        console.error("expected to find a model class object on the scope, named #{configModelName}, which must be an instance of window.ut.commons.ResourceEventEmitterModel")
        return
    createShowHideSections = ->
      if (configModel && !configModel.configUISettings.showHideSections)
        configModel.configUISettings.showHideSections = {}
    loadInitialShowHide = ->
      createShowHideSections()
      if (configModel && typeof configModel.configUISettings.showHideSections[configKey] == "boolean")
        scope.sectionShown = configModel.configUISettings.showHideSections[configKey]
    configModel?.addListeners(["modelLoaded"],->
      loadInitialShowHide()
    )
    loadInitialShowHide()
    updateStoredShowHide = ->
      createShowHideSections()
      configModel?.configUISettings.showHideSections[configKey] = scope.sectionShown
    showSection = ->
      scope.sectionShown = true
      updateStoredShowHide()
      updateShowHideTooltip()
      $timeout(->
#        golabSectionContent = element.find(".golabSectionContent")
        golabSectionContent = element.find(".test")
        ut.commons.utils.scrollVerticalToVisible(golabSectionContent)
      )
      ut.commons.utils.gadgetResize()
    hideSection = ->
      scope.sectionShown = false
      updateStoredShowHide()
      updateShowHideTooltip()
      ut.commons.utils.gadgetResize()
    logShowHide = ->
      configModel?.getActionLogger().logChange({
        objectType: "golabSection"
        id: configKey
        content: scope.sectionShown
      })
    scope.showSection = ->
      if (scope.allowShowHide)
        showSection()
        logShowHide()
    scope.hideSection = ->
      if (scope.allowShowHide)
        hideSection()
        logShowHide()
    scope.showHideSection = ->
      if (scope.sectionShown)
        scope.hideSection()
      else
        scope.showSection()

    if (scope.mustSectionBeShown)
      scope.$watch("mustSectionBeShown('#{configKey}')", (newValue, oldValue)->
        if (newValue)
          scope.allowShowHide = false
          showSection()
        else
          scope.allowShowHide = true
        updateShowHideTooltip()
      )
  }

ut.commons.golabUtils.directive("golabSection".toLowerCase(),
  ["languageHandler", "$timeout", golabSectionDirective])


busyDirective = ()->
  {
  restrict: "E"
  template: """
<div class="busyWithResources" ng-show="busy"></div>
"""
  replace: false
  scope: {
    busy: "="
  }
  link: (scope, element, attrs)->
  }

ut.commons.golabUtils.directive("busy".toLowerCase(),
  [busyDirective])


ut.commons.golabUtils.updateSpecialLanguageTerms = (configurationModel, languageHandler) ->
  updateableElements = $("[g4i18n]")
  $.each(updateableElements, (index) ->
    updateableElement = $(updateableElements[index])
    languageKey = updateableElement.attr('g4i18n')
    if (languageKey)
      languageValue = languageHandler.getMessage(languageKey)
#      console.log("language key: #{languageKey}, value: #{languageValue}")
      updateableElement.text(languageValue)
  )
  
