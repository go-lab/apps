"use strict";

@golab = @golab || {}
@golab.common = @golab.common || {}
@golab.common.resourceLoader = @golab.common.resourceLoader || {}

debug = false

if window.location.host is "shindig.epfl.ch"
  # old Graasp, use the old ils library
  if (debug) then console.log "Configuring resource modules: old Graasp detected, using ils.js"
  ils_library = "/commons/js/ils.js"
else
  # new Graasp, use the new library
  if (debug) then console.log "Configuring resource modules: new Graasp detected, using ils_graaspeu.js"
  # link to the latest stable version:
  ils_library = "http://shindig2.epfl.ch/ils/main/ils_graaspeu.js"
  # the current working branch:
  #ils_library = "https://rawgit.com/go-lab/ils/config_storage/main/ils_graaspeu.js"
  # the local copy:
  ils_library = "/commons/js/ils_graaspeu.js"


if (@golab.common.resourceLoader.isRunningInGraasp())
#  console.log("we are running in graasp/ils")
  angular15Url = "https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"
  jquery22Url = "https://code.jquery.com/jquery-2.2.4.min.js"
  fontAweSome46Url = "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
else
#  console.log("we are running outside graasp/ils")
  angular15Url = "/libs/js/angular1.5/angular.js"
  jquery22Url = "/libs/js/jquery2.2/jquery.js"
  fontAweSome46Url = "/libs/fonts/font-awesome-4.6.3/css/font-awesome.css"


resourceModules = {
  "jquery-ui": [
    ["/libs/js/jquery-ui.custom.js",
     "/libs/js/jquery.ui.touch-punch.js",
     "/libs/css/jquery.ui.all.css",
     "/commons/css/golabJqueryUi.css"]
  ]
  "goLabUtils": [
    [ "/commons/js/utils.js"
      "/commons/js/angular/golabUtils.js",
      "/commons/js/angular/golabUtils2.js",
    ]
    [
      "/commons/js/angular/configuration.js"
      "/commons/css/golabUtils.css"
      "/commons/js/LeavePageDetector.js"
    ]
  ]
  "goLabModels": [
    [ "/libs/js/jsonr.js",
      "/commons/js/angular/golabUtils.js",
      "/commons/js/angular/resourceIOUI.js",
      "/commons/js/angular/loadSaveUI.js",
      "/commons/js/resourceEventEmitterModel.js",
      "/commons/js/configurationModel.js",
      "/commons/js/undoRedoManager.js",
      "/commons/css/golabUtils.css"
      "ui-notification"
    ]
  ]
  "createEnvironmentHandlers": [
    [
      "/libs/js/socket.io-1.2.1.js",
      "/libs/js/jquery.cookie.js",
      "/libs/js/angular/localStorageModule.js",
      "/libs/js/lodash.js",
      ils_library,
      "/commons/js/MetadataHandler.js",
      "/commons/js/StorageHandler.js",
      "/commons/js/CachingStorageHandler.js",
      "/commons/js/ActionLogger.js",
      "/commons/js/languageHandlers.js"
      "/commons/js/notificationClient.js"
      "/commons/js/createEnvironmentHandlers.js"
      "/commons/js/loggingModelVerifier.js"
    ]
  ]
  "qunit": [
    ["/libs/js/qunit.js",
     "/libs/css/qunit.css"]
  ]
  "textAngular": [
    [
      "/libs/js/angular/textAngular.js"
      "/libs/js/angular/textAngularSetup.js"
    ]
  ]
  "textAngular1.5": [
    [
      "/libs/js/angular/textAngular/textAngular-rangy.min.js"
    ]
    [
      "/libs/js/angular/textAngular/textAngular.js"
      "/libs/js/angular/textAngular/textAngularSetup.js"
      "/libs/js/angular/textAngular/textAngular.css"
    ]
  ]
  "angular1.2":[
    ["/libs/js/angular1.2/angular.js"
     "/libs/js/angular1.2/angular-sanitize.js"
    ]
  ]
  "angular1.3":[
    ["/libs/js/angular1.3/angular.js"
    ]
    [
     "/libs/js/angular1.3/angular-sanitize.js"
    ]
  ]
  "angular1.5":[
    [
      angular15Url
    ]
    [
     "/libs/js/angular1.5/angular-sanitize.js"
    ]
  ]
  "ui-notification":[
    ["/libs/js/angular/angular-ui-notification/angular-ui-notification.js"
     "/libs/js/angular/angular-ui-notification/angular-ui-notification.css"
     "/commons/css/golabAngularUiNotification.css"
    ]
  ]
  "collaboration":[
    [
      "/commons/js/TogetherClient.js"
      "/commons/js/angular/collaboration.js"
    ]
  ]
}

@golab.common.resourceLoader.addResourceModules(resourceModules)

resourcePaths = {
  angular: "/libs/js/angular/angular.js"
  jquery: jquery22Url
  eventEmitter: "/libs/js/eventEmitter.js"
  "font-awesome": fontAweSome46Url
  bootstrap: "/libs/bootstrap/css/bootstrap.css"
}

@golab.common.resourceLoader.addResourcePaths(resourcePaths)