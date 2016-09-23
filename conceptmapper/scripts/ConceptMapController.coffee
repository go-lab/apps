"use strict"

window.ut = window.ut || {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}

angular = window.angular
resourceLoader = golab.common.resourceLoader

window.ut.tools.conceptmapper.ConceptMapAngularApp = angular.module('ConceptMapAngularApp',  ['LocalStorageModule', 'textAngular', "monospaced.elastic", 'golabUtils'])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("resourceLoader", [()->
  golab.common.resourceLoader
])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("environmentHandlers", [()->
  window.ut.tools.conceptmapper.environmentHandlers
])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("languageHandler",
  ["environmentHandlers", (environmentHandlers)->
    environmentHandlers.languageHandler
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("actionLogger",
  ["environmentHandlers", (environmentHandlers)->
    actionlogger = environmentHandlers.conceptMap.actionLogger
    actionlogger
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("fileStorage", [()->
  new ut.commons.persistency.FileStorage()
])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("storageHandler",
  [ "environmentHandlers", (environmentHandlers)->
    storageHandler = environmentHandlers.conceptMap.storageHandler
#    storageHandler.configureFilters(true, true, true)
    storageHandler
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("conceptMapModel",
  ["environmentHandlers", "configurationModel", (environmentHandlers, configurationModel)->
    conceptMapModel = new window.ut.tools.conceptmapper.ConceptMapModel(environmentHandlers, configurationModel)
    conceptMapModel
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("configurationStorageHandler",
  ["environmentHandlers", (environmentHandlers)->
    environmentHandlers.configuration.storageHandler
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.factory("configurationModel",
  ["environmentHandlers", (environmentHandlers)->
    configurationModel = new window.ut.tools.conceptmapper.ConceptMapConfigurationModel(environmentHandlers)
    configurationModel
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.config(
  ["$sceDelegateProvider", ($sceDelegateProvider)->
    $sceDelegateProvider.resourceUrlWhitelist(["self", resourceLoader.getBaseUrl() + "/**"])
  ])

window.ut.tools.conceptmapper.ConceptMapAngularApp.run(
  ["$rootScope", "conceptMapModel", "configurationModel", "actionLogger", "languageHandler",
    ($rootscope, conceptMapModel, configurationModel, actionLogger, languageHandler)->
#      console.log "ConceptMapAngularApp started."
      $rootscope.golab = {}
      $rootscope.golab.startupFinished = false
      $rootscope.conceptMapModel = conceptMapModel
      # make the model available to the non-angular part
      window.ut.tools.conceptmapper.model = $rootscope.conceptMapModel
      # make the configuration available to the non-angular part
      window.ut.tools.conceptmapper.configurationModel = configurationModel
      $rootscope.configurationModel = configurationModel
      $rootscope.resourceLoader = resourceLoader
      $rootscope.languageHandler = languageHandler
      $rootscope.actionLogger = actionLogger

      $rootscope.applyAlternativeConfiguration = (model) ->
        if (model instanceof window.ut.tools.conceptmapper.ConceptMapModel)
          if window.golab.tools.configuration["conceptmapper"]?
            console.log "no configuration resource found, but an 'old' js-configuration is present."
            # there is no configuration in the storage handler, but one via js-loading (the old way...) -> use that
            configurationModel.concepts.setValues(window.golab.tools.configuration["conceptmapper"].concepts.value)
            configurationModel.relations.setValues(window.golab.tools.configuration["conceptmapper"].relations.value)
            configurationModel.setSingleDocumentMode(true)
            if window.golab.tools.configuration["conceptmapper"]["auto_load"]? and window.golab.tools.configuration["conceptmapper"]["auto_load"].value is "true"
              configurationModel.setAutoLoadLatestResource(true)
            #else
              #configurationModel.setAutoLoadLatestResource(false)
            return true
        false

      $rootscope.parseLogs_ = () ->
        $("#ut_tools_conceptmapper_dialog").dialog {
          title: "Select log file to parse",
          resizable: false,
          modal: true,
          autoOpen: false,
          height: 200,
          width: 500,
          closeOnEscape: false,
          dialogClass: "ut_tools_conceptmapper_dialog",
          buttons: {
            "Go": () =>
              $("#ut_tools_conceptmapper_dialog").dialog("close")
              logUrl = $("#ut_tools_conceptmapper_dialog_input").val()
              $.ajax {
                url: logUrl
                dataType: "jsonp"
                success: (data) ->
                  console.log "ping"
                  #$.each data, (key, val) ->
                  #  console.log key
              }
          }
        }
        $("#ut_tools_conceptmapper_dialog_input").val("http://golab.collide.info/client/LochemC.json")
        # open dialog now and remove focus from buttons
        $('#ut_tools_conceptmapper_dialog').dialog('open')
        $('.ui-dialog :button').blur()

      $rootscope.parseLogs = () =>
        $rootscope.parseLogArray(window.actionlog_lochemee)

      $rootscope.parseLogArray = (logArray) =>
        console.log "log-entries arrived:"+logArray.length
        $scope.logModel = []
        for entry in logArray
          if entry.generator.displayName is "conceptmapper"
            # the log entry is from/for the conceptmapper, sort it in...
            if not $rootscope.logModel[entry.actor.id]?
              # an array for this actor.id doesn't exist yet? create one...
              $rootscope.logModel[entry.actor.id] = []
            $rootscope.logModel[entry.actor.id].push entry
        console.log $scope.logModel
        $rootscope.choseActor()

      $rootscope.choseActor = () =>
        console.log "chose actor..."
        $("#ut_tools_conceptmapper_dialog").dialog {
          title: "Chose actor to parse",
          resizable: false,
          modal: true,
          autoOpen: false,
          height: 600,
          width: 600,
          closeOnEscape: false,
          dialogClass: "ut_tools_conceptmapper_dialog",
          buttons: {
            "Go": () =>
              $("#ut_tools_conceptmapper_dialog").dialog("close")
              actorId = $("#ut_tools_conceptmapper_dialog_input").val()
              console.log "parsing #{actorId}"
              $rootscope.parseActor(actorId)
          }
        }
        actors = []
        for key, value of $scope.logModel
          actors.push key
        $("#ut_tools_conceptmapper_dialog_input").autocomplete {
          source: actors
          minLength: 0
          delay: 0
        }
        # open dialog now and remove focus from buttons
        $('#ut_tools_conceptmapper_dialog').dialog('open')
        $('.ui-dialog :button').blur()
        $("#ut_tools_conceptmapper_dialog_input").autocomplete( "search", "" )

      $rootscope.parseActor = (actorId) =>
        if not $scope.logModel[actorId]?
          console.log "no action from this actor can be found."
        else
          $rootscope.conceptMapModel.clearContent()
          for action in $scope.logModel[actorId]
            $rootscope.conceptMapModel.applyLogAction action
    ])

conceptMapCtrl = ($scope, configurationModel) ->

window.ut.tools.conceptmapper.ConceptMapAngularApp.controller("ConceptMapController", ["$scope", "configurationModel", conceptMapCtrl])