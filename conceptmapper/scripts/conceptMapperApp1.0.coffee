"use strict"

window.ut = window.ut or {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}
resourceLoader = @golab.common.resourceLoader

conceptmapperLibsModule = {
  conceptmapperLibs: [
    ["font-awesome",
     "/libs/js/jsonr.js",
     "jquery"
    ]
    [
     "jquery-ui",
     "bootstrap"
    ]
    [
      "angular1.5"
    ]
    [
     "goLabUtils",
     "eventEmitter",
     "/libs/js/jquery.filter_input.js"
     "/libs/js/angular/elastic.js"
    ]
    ["createEnvironmentHandlers"
     "goLabModels"
    ]
    [
      "collaboration"
    ]
    [
      "/commons/js/PersistencyUtils.js",
      "/commons/js/utils.js",
      "/commons/js/angular/ngDataStore.js",
      "/commons/js/dataSource.js",
      "/commons/js/dataStore.js"
      "textAngular"
      "/libs/css/jquery.contextmenu.css"
      "/libs/js/jquery.contextmenu.js"
      "/libs/js/jquery.autogrow-textarea.js"
      "/libs/js/jquery.svg.js"
      "/libs/js/jquery.jsPlumb-1.4.1-all-fixed.js"
      "/commons/js/TogetherClient.js"
    ]
  ]
}
resourceLoader.addResourceModules(conceptmapperLibsModule)

conceptmapperScriptsModule = {
  conceptmapperScripts: [
    ["styles/conceptmap1.0.css"
     "scripts/ConceptMapController.js"
    ]
    [
     "scripts/ConceptMapper1.0.js"
     "scripts/ConceptMapDirective.js"
     "scripts/ConceptMapViewDirective.js"
     "scripts/ConceptMapModel.js"
     "scripts/ConceptMapConfigurationModel.js"
     "scripts/ConceptMapConfigurationOptions.js"
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
#  console.log "Initializing ConceptMapper..."
  resourceLoader.orderedLoad [["conceptmapper"]]
  resourceLoader.ready ->
#    console.log("all resources loaded for conceptmapper, starting tool")
    window.golab.common.createEnvironmentHandlers(["conceptMap","configuration"], "conceptmapper", resourceLoader.getDesiredLanguage(), {notificationServer: null},
      (environmentHandlers) ->
#        console.log("created environment handlers for conceptmapper.")
        configuration = window.golab.tools.configuration["conceptmapper"]
        # needed by the angular factories
        window.ut.tools.conceptmapper.environmentHandlers = environmentHandlers
        angular.bootstrap(document.body, ["ConceptMapAngularApp"])
    )
window.ut.tools.conceptmapper.start = () ->
  if gadgets?
#    console.log "Registering gadgets-loadhandler."
    gadgets.util.registerOnLoadHandler window.ut.tools.conceptmapper.init
  else
#    console.log "Registering window-loadhandler."
    window.onload = window.ut.tools.conceptmapper.init