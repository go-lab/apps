"use strict"

window.ut = window.ut or {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}
resourceLoader = @golab.common.resourceLoader

resourceLoader.addResourcePaths({
  jquery: "/libs/js/jquery2.1/jquery.js"
  angular: "/libs/js/angular/angular.min.js"
})

conceptmapperLibsModule = {
  conceptmapperLibs: [
    ["font-awesome"
     "jquery"
     "jquery-ui"
     "angular"
     "goLabUtils"
     "eventEmitter"
     "goLabModels"
    ]
    [
      "createEnvironmentHandlers"
    ]
    [
      "/libs/css/jquery.contextmenu.css"
      "/libs/js/jquery.contextmenu.js"
      "/libs/js/jquery.autogrow-textarea.js"
      "/libs/js/jquery.jsPlumb-1.4.1-all-fixed.js"
    ]
  ]
}
resourceLoader.addResourceModules(conceptmapperLibsModule)

conceptmapperScriptsModule = {
  conceptmapperScripts: [
    ["styles/conceptmap1.0.css"
     "scripts/ConceptMapper1.0.js"
     "scripts/ConceptMapModel.js"
     "scripts/ConceptMapController.js"
    ]
  ]
}
resourceLoader.addResourceModules(conceptmapperScriptsModule, "/tools/conceptmap/src/main/webapp/")

resourceLoader.addResourceModules {
  conceptmapper: [
    ["conceptmapperLibs"]
    ["conceptmapperScripts"]
  ]
}

window.ut.tools.conceptmapper.init = () ->
  console.log "Initializing ConceptMapper..."
  resourceLoader.orderedLoad [["conceptmapper"]]
  resourceLoader.ready ->
    window.golab.common.createEnvironmentHandlers("conceptMap", "conceptmapper", resourceLoader.getDesiredLanguage(),
    (metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient) ->
      console.log("created environment handlers.")
      console.log("... all resources loaded, starting tool")
      configuration = window.golab.tools.configuration["conceptmapper"]
      # needed by the angular factories
      window.ut.tools.conceptmapper.languageHandler = languageHandler
      window.ut.tools.conceptmapper.storageHandler = storageHandler
      window.ut.tools.conceptmapper.actionLogger = actionLogger
      actionLogger.setLoggingTarget "console"

      $("#ut_tools_conceptmapper_logoContainer").hide()

      # ask for a username
      $usernameDiv = $("<div style='display:none' id='conceptmapper-username' title='What is your username?'><label for='name'>Username:  </label><input type='text' name='name' id='name' class='text ui-widget-content ui-corner-all'></div>")
      $("body").append($usernameDiv)
      $("#conceptmapper-username").dialog({
        draggable: false
        modal: true
        closeOnEscape: false
        dialogClass: "noclose"
        buttons: {
          Ok: () =>
            username = $("#conceptmapper-username input").val()
            console.log "username: #{username}"
            metadataHandler.setActor {
              objectType: "person"
              displayName: username
              id: username+"@"+metadataHandler.getProvider().id
            }
            $("#conceptmapper-username").dialog("close")
            angular.bootstrap(document.getElementById("ut_tools_conceptmapper_angularRoot"), ["ConceptMapAngularApp"])
            conceptMapper = new window.ut.tools.conceptmapper.ConceptMapper(configuration, metadataHandler, storageHandler, actionLogger, languageHandler, notificationClient)
            $("#ut_tools_conceptmapper_loadIcon").hide()
            $("#ut_tools_conceptmapper_root").show()

            if metadataHandler.getProvider().id is "sandra1"
              console.log "loading condition 1"
              conceptMapper.getModel().loadFromResource(window.golab.tools.resources["conceptmap_sandra_condition1"])
        }
      })
    )

if gadgets?
  console.log "Registering gadgets-loadhandler."
  gadgets.util.registerOnLoadHandler window.ut.tools.conceptmapper.init
else
  console.log "Registering window-loadhandler."
  window.onload = window.ut.tools.conceptmapper.init