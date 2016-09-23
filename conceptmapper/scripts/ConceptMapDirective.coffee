"use strict";

window.ut = window.ut || {}
window.ut.tools = window.ut.tools|| {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper || {}

conceptMap = (conceptMapModel, configurationModel, languageHandler)->
  {
    restrict: "E"
    template: """
"""
    replace: false
    link: (scope, element, attrs)->
      theConceptMapModel = conceptMapModel
      theConfigurationModel = configurationModel
      conceptMapElement = null
      createNewConceptMapper = () ->
        if (conceptMapElement)
          conceptMapElement.remove()
        conceptMapElement = $("<div class='conceptMap'></div>")
        element.append(conceptMapElement)
        conceptMapper = new window.ut.tools.conceptmapper.ConceptMapper(theConceptMapModel, theConfigurationModel, languageHandler, conceptMapElement)
        conceptMapper.modelLoadedIntoView()
#        console.log("created conceptMapper in conceptMap")
        
#      createNewConceptMapper()
      scope.$watch("conceptMapModel", ->
        theConceptMapModel = scope.conceptMapModel
        createNewConceptMapper()
      )
#      scope.$watch("configurationModel", ->
#        theConfigurationModel = scope.configurationModel
#        createNewConceptMapper()
#      )

#      console.log("end of link in conceptMap")
  }


window.ut.tools.conceptmapper.ConceptMapAngularApp.directive("conceptMap".toLowerCase(),
  ["conceptMapModel", "configurationModel","languageHandler", conceptMap])

class window.ut.tools.conceptmapper.ConceptMapper

  constructor: (@conceptMapModel, @configurationModel, @languageHandler, @root) ->
#    console.log("Initializing ConceptMapper1.0.")
    @debug = false

    @actionLogger = @conceptMapModel.getActionLogger()

    # connecting to the model from the ng-controller
    @model = @conceptMapModel
    @model.addListener("contentCleared", @deleteAllFromView)
    @model.addListener("addConcept", @addConceptToView)
    @model.addListener("removeConcept", @removeConceptFromView)
    @model.addListener("changeConceptContent", @changeConceptContentInView)
    @model.addListener("changeConceptColor", @changeConceptColorInView)
    @model.addListener("changeConceptPosition", @changeConceptPositionInView)
    @model.addListener("addRelation", @addRelationToView)
    @model.addListener("removeRelation", @removeRelationFromView)
    @model.addListener("changeRelationContent", @changeRelationContentInView)
    @model.addListener("modelLoaded", @modelLoadedIntoView)
    @model.addListener("contentLoaded", @modelLoadedIntoView)

    @configurationModel.addListener("modelChanged", @configure)

    @templateSource = $(".ut_tools_conceptmapper_template")
    @linkButton = $("#ut_tools_conceptmapper_linkButton")
    @toolbar = $("#ut_tools_conceptmapper_toolbar_container")

    # set language strings
    $("#ut_tools_conceptmapper_toolbar_title").text(@languageHandler.getMsg("ut_tools_conceptmapper_toolbar_title"))
    $(".ut_tools_conceptmapper_hint").text(@languageHandler.getMsg("ut_tools_conceptmapper_placeholder"))
    $("#ut_tools_conceptmapper_concept_template_text p").text(@languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text"))
    $("#ut_tools_conceptmapper_concept_template_selector p").text(@languageHandler.getMsg("ut_tools_conceptmapper_concept_template_selector"))
    $("#ut_tools_conceptmapper_concept_template_text").attr("title", @languageHandler.getMsg("ut_tools_conceptmapper_concept_template_tooltip"))
    $("#ut_tools_conceptmapper_concept_template_selector").attr("title",@languageHandler.getMsg("ut_tools_conceptmapper_concept_template_tooltip"))
    @linkButton.attr("title", @languageHandler.getMsg("ut_tools_conceptmapper_linkButton"))

    @colorClasses = [
      "ut_tools_conceptmapper_blue",
      "ut_tools_conceptmapper_yellow",
      "ut_tools_conceptmapper_green",
      "ut_tools_conceptmapper_red",
      "ut_tools_conceptmapper_orange",
    ]

    # keeps track of the current mode
    @LINK_MODE = "link_mode"
    @NODE_MODE = "node_mode"
    @mode = @NODE_MODE

    # flag to turn on/off logging, e.g. for loading
    @isCurrentlyLogging = true

    # global variables to keep track during editing
    @sourceNode = undefined
    @targetNode = undefined
    @editingLabel = undefined

    @configure()
    @_init()
    if @isCurrentlyLogging and @actionLogger? then @actionLogger.logApplicationStarted()

  getModel: () =>
    @model

  configure: () =>
# apply the settings from the configurationsModel
# jsPlumb needs to be initialized again to have the correct default relation label
    @_initJsPlumb()

  _init: () =>
# edge button
    @linkButton.click () =>
      if @mode is @LINK_MODE
        @setMode(@NODE_MODE)
      else
        @setMode(@LINK_MODE)
    @templateSource.click () =>
      @setMode(@NODE_MODE)
    @_initDnD()
    @_initJsPlumb()

  _initDnD: () =>
# make the toolbar-concepts draggable
    @templateSource.draggable {
      helper: "clone"
      cursor: "move"
      cursorAt:
        top: 5
        left: 5
      containment: "#ut_tools_coot"
      start: () =>
        @setMode(@NODE_MODE)
    }
    @root.bind 'dragover', (event) ->
      return false
    @root.droppable()
    # handle the drop...
    @root.bind 'drop', (event, ui) =>
      if (ui and $(ui.draggable).hasClass("ut_tools_hypothesis_condition"))
        return false
      else if (ui and $(ui.draggable).hasClass("ut_tools_conceptmapper_template"))
        newConcept = undefined
        if @debug then console.log("Concept template dropped. Clone and add to map.")
        if ($(ui.draggable).hasClass("ut_tools_conceptmapper_conceptTextarea"))
          newConcept = {
            id: ut.commons.utils.generateUUID()
            content: $(ui.draggable).text()
            x: ui.position.left + 19
            y: ui.position.top + 36
            type: "ut_tools_conceptmapper_conceptTextarea"
            colorClass: "ut_tools_conceptmapper_blue"
          }
        else if ($(ui.draggable).hasClass("ut_tools_conceptmapper_conceptSelector"))
          newConcept = {
            id: ut.commons.utils.generateUUID()
            content: $(ui.draggable).text()
            x: ui.position.left + 19
            y: ui.position.top + 36
            type: "ut_tools_conceptmapper_conceptSelector"
            colorClass: "ut_tools_conceptmapper_blue"
          }
      else if (event.originalEvent.dataTransfer)
#if @configuration.drop_external.value is "true"
        if true
          newConcept = {
            id: ut.commons.utils.generateUUID()
            content: event.originalEvent.dataTransfer.getData("Text")
            x: event.originalEvent.clientX - 5
            y: event.originalEvent.clientY - 5
            type: "ut_tools_conceptmapper_conceptTextarea"
            colorClass: "ut_tools_conceptmapper_blue"
          }
      else if (ui and $(ui.draggable).hasClass("ut_tools_conceptmapper_concept"))
        @model.changeConceptPosition($(ui.draggable).attr('id'), ui.position.left, ui.position.top)
        object = {
          "objectType": "concept",
          "id": $(ui.draggable).attr('id'),
          "x": ui.position.left
          "y": ui.position.top
        }
        if @isCurrentlyLogging and @actionLogger? then @actionLogger.logChange(object)
      if newConcept?
        @model.addConcept(newConcept)
        # logging
        logObject = newConcept
        logObject.objectType = "concept"
        if @isCurrentlyLogging and @actionLogger? then @actionLogger.logAdd(logObject)
      return false

    @toolbar.droppable()

    # handle the drop...
    @toolbar.bind 'drop', (event, ui) =>
      if $(ui.draggable).hasClass("ut_tools_conceptmapper_template")
# the template itself has been dropped, do nothing
      else if $(ui.draggable).hasClass("ut_tools_conceptmapper_concept")
        conceptId = $(ui.draggable).attr("id")
        @model.removeConcept conceptId
        @logRemoveConcept conceptId
      else if $(ui.draggable).hasClass("_jsPlumb_overlay")
        for connection in jsPlumb.getConnections()
          if $(ui.draggable).attr('id') is connection.getOverlay("label").canvas.id
# found the connection that needs to be deleted
            relationId = connection.getOverlay("label").component.id
            @model.removeRelation relationId
    # logging is done in removeRelationFromView
    # @logRemoveRelation relationId

  _initJsPlumb: () =>
    jsPlumbDefaults = {
#Connector : [ "Bezier", { curviness:0 } ],
      Connector : [ "Straight" ],
      ConnectorZIndex: 0,
      DragOptions : { cursor: "pointer", zIndex:2000 },
#PaintStyle : { strokeStyle:"#00b7cd" , lineWidth:4 },
      PaintStyle : { strokeStyle:"#92D6E3", lineWidth:2 },
      EndpointStyle : {},
      Anchor: [ "Perimeter", { shape:"Ellipse"} ],
      ConnectionOverlays: [
#[ "Arrow", { location:0.7 }, { foldback:0.7, fillStyle:"#00b7cd", width:15 }],
        [ "Label", { label: "", location:0.5, id:"label" }]
      ],
      Detachable:false,
      Reattach:false
    }
    jsPlumb.importDefaults jsPlumbDefaults
    jsPlumb.setRenderMode jsPlumb.SVG
    jsPlumb.unbind "jsPlumbConnection"
    jsPlumb.bind "jsPlumbConnection", (event) =>
# new connection has been created, bind the click handler
      event.connection.getOverlay("label").bind("click", @onClickHandlerConnectionLabel)

  setMode: (newMode) ->
    if (newMode is @mode)
# if the new mode is actually not new, do nothing...
      return
    else
      switch newMode
        when @NODE_MODE
          @root.find(".ut_tools_conceptmapper_concept").each (index, concept) => @setConceptNodeMode(concept)
          @templateSource.removeClass("ut_tools_conceptmapper_lowLight")
          @linkButton.removeClass("pressedButton")
          @linkButton.addClass("activeButton")
          jsPlumb.unmakeEverySource()
          jsPlumb.unmakeEveryTarget()
          $(@sourceNode).removeClass("highlight_concept")
          $(@targetNode).removeClass("highlight_concept")
          @sourceNode = undefined
          @targetNode = undefined
          @mode = newMode
        when @LINK_MODE
          @root.find(".ut_tools_conceptmapper_concept").each (index, concept) => @setConceptLinkMode(concept)
          # @root.find(".ut_tools_conceptmapper_concept").draggable("disable")
          @templateSource.addClass("ut_tools_conceptmapper_lowLight")
          @root.find(".ut_tools_conceptmapper_concept").css("opacity","1.0")
          @linkButton.addClass("pressedButton")
          @linkButton.removeClass("activeButton")
          @mode = newMode
        else
          console.warn("ConceptMapper.setMode: unrecognized mode #{newMode} doing nothing.")

  setConceptNodeMode: (concept) =>
    $(concept).draggable("enable")

  setConceptLinkMode: (concept) =>
    $(concept).draggable("disable")
    jsPlumb.makeSource concept, {}
    jsPlumb.makeTarget concept, {
      dropOptions:{ hoverClass:"jsPlumbHover" },
      beforeDrop: (params) =>
        if (params.sourceId is params.targetId)
          if @debug then console.log "Creating edges between same source and target is disallowed."
          return false
        else
          existingRelations = @model.getRelationsBetween(params.sourceId, params.targetId)
          if existingRelations.length
            if @debug then console.log "An edge between concepts already exists -> delete it (instead of create a new one)."
            for relation in existingRelations
              @model.removeRelation(relation.id)
            # logging is done in removeRelationFromView
            # @logRemoveRelation(relation.id)
            return false
          else
            if @debug then console.log "All conditions met, create a new edge."
            newRelation = {
              id: ut.commons.utils.generateUUID()
              source: params.sourceId
              target: params.targetId
              content: @configurationModel.relations.getValue(0)
            }
            @model.addRelation(newRelation)
            # action logging
            @logAddRelation(newRelation)
            # new relation is created through the model, so returning false here as well
            return false
    }

  onClickEdgeHandler: (event) =>
# creates/deletes relations by clicking nodes
    if @sourceNode is undefined
      @sourceNode = event.currentTarget
      $(@sourceNode).toggleClass("highlight_concept")
    else
      if event.currentTarget is @sourceNode
        $(event.currentTarget).toggleClass("highlight_concept")
        @sourceNode = undefined
      else
        @targetNode = event.currentTarget
    if (@sourceNode isnt undefined) and (@targetNode isnt undefined)
      sourceId = $(@sourceNode).attr("id")
      targetId = $(@targetNode).attr("id")
      existingRelations = @model.getRelationsBetween(sourceId, targetId)
      if existingRelations.length
        @model.removeRelationsBetween(sourceId, targetId)
# logging is done in removeRelationFromView
#for relation in existingRelations
#  @logRemoveRelation(relation.id)
      else
        if @debug then console.log "Connection does not exist -> create."
        newRelation = {
          id: ut.commons.utils.generateUUID()
          source: sourceId
          target: targetId
          content: @configurationModel.relations.getValue(0)
        }
        @model.addRelation(newRelation)
        @logAddRelation(newRelation)
      $(@sourceNode).removeClass("highlight_concept")
      $(@targetNode).removeClass("highlight_concept")
      @sourceNode = undefined
      @targetNode = undefined
      jsPlumb.repaintEverything()

  onClickHandlerConnectionLabel: (label) =>
    if $(label.canvas).data("dragging")
# the label has been dragged, so ignore the click event
      return
    if $("#"+label.canvas.id).find("input").length
# the combobox has already been created,
# open the search fields
      $("#"+label.canvas.id).find("input").autocomplete('search', '')
    else
      @editingLabel = label
      inputField = $('<input/>').val(@editingLabel.getLabel())
      @labelBeforeEdit = @editingLabel.getLabel()
      inputField.autocomplete {
        source: @configurationModel.relations.getValues(),
        minLength: 0
      }
      # empty the div
      $("#"+label.canvas.id).text("")
      # and inject the input field / selector
      inputField.addClass("_jsPlumb_overlay")
      inputField.css("text-align","left")
      $("#"+label.canvas.id).css("padding","0px")
      $("#"+label.canvas.id).append(inputField)
      inputField.blur(@onBlurHandlerInjectRelation)
      inputField.autocomplete('search', '')
      inputField.focus()
      jsPlumb.repaintEverything()

  onClickHandlerInjectTextarea: (event) =>
    if @mode is @LINK_MODE
# we are in link mode, delegate event
      @onClickEdgeHandler(event)
#else if not $(event.target).is("div")
    else if $(event.target).is("p")
# no textarea found -> replace paragraph with textarea
      @selectedConcept = $(event.currentTarget).attr("id")
      $p = $(event.target)
      if $p.text() is @languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text")
        textarea = $('<textarea/>').val("")
        textarea.attr "placeholder", @languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text")
      else
        textarea = $('<textarea/>').val($p.text())
      @contentBeforeEdit = $p.text()
      textarea.autogrow()
      $p.replaceWith(textarea)
      textarea.on("blur", @onBlurHandlerInjectParagraph)
      @appendMenuButton(event.currentTarget)
      textarea.focus()

  appendMenuButton: (target) =>
    menuButton = $('<i class="fa fa-gear ut_tools_conceptmapper_menubutton"></i>')
    menu = []
    for color, index in @colorClasses
      colorItem = {
        '&nbsp': {
          className: color
          onclick: (menuItem,menu) =>
# iterate over menuItems classes to find out which color to set
            classes = $(menuItem).attr('class').split(" ")
            for color in classes
              if $.inArray(color, @colorClasses) > -1
                @model.changeConceptColor(@selectedConcept, color)
                object = {
                  "objectType": "concept",
                  "id": @selectedConcept,
                  "colorClass": color
                }
                if @isCurrentlyLogging and @actionLogger? then @actionLogger.logChange(object)
                break
            return
        }
      }
      menu.push colorItem
    menu.push $.contextMenu.separator
    deleteItem = {}
    deleteItem[@languageHandler.getMsg("ut_tools_conceptmapper_delete")] = (menuItem,menu) =>
      conceptId = $("##{@selectedConcept}").attr("id")
      @model.removeConcept conceptId
      @logRemoveConcept conceptId
      return
    menu.push deleteItem
    $(menuButton).contextMenu(menu, {leftClick: true, rightClick: true})
    $(target).append(menuButton)
    $(menuButton).show()

  onClickHandlerInjectCombobox: (event) =>
    if (@mode is @LINK_MODE)
# we are in link mode, delegate event
      @onClickEdgeHandler(event)
    else if not $(event.target).is("div")
# no input found -> replace paragraph with textarea
      @selectedConcept = $(event.currentTarget).attr("id")
      $p = $(event.target)
      if $p.text() is @languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text")
        inputField = $('<input/>').val("")
        inputField.attr "placeholder", @languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text")
      else
        inputField = $('<input/>').val($p.text())
      @contentBeforeEdit = $p.text()
      inputField.autocomplete {
        source: @configurationModel.concepts.getValues(),
        minLength: 0
      }
      $p.replaceWith(inputField)
      inputField.blur(@onBlurHandlerInjectParagraph)
      inputField.autocomplete('search', '')
      @appendMenuButton(event.currentTarget)
      inputField.focus()

  onBlurHandlerInjectRelation: (event) =>
    newLabel = nl2br($(event.target).val())
    #@editingLabel.setLabel(newLabel)
    $(event.target).parent().text(@editingLabel.getLabel())
    $(event.target).remove()
    # @editingLabel = null;
    # repaint the links, as the size of the concept element might have changed
    # jsPlumb.repaintEverything()
    if newLabel isnt @labelBeforeEdit
      @model.changeRelationContent(@editingLabel.component.id, newLabel)
      object = {
        "objectType": "relation",
        "id": @editingLabel.component.id
        "content": newLabel
      }
      if @isCurrentlyLogging and @actionLogger? then @actionLogger.logChange(object)
    $("#"+@editingLabel.canvas.id).css("padding", "0.25em 0.5em 0.25em 0.5em")
    @labelBeforeEdit = ""
    @editingLabel = undefined

  onBlurHandlerInjectParagraph: (event) =>
# replace the input element (e.g. textArea) with paragraph
    inputElement = $(event.target)
    newContent = nl2br(inputElement.val())
    if newContent is ""
      newContent = @languageHandler.getMsg("ut_tools_conceptmapper_concept_template_text")
    conceptId = inputElement.parent().attr("id")
    # the new content will be set through the model
    p = $('<p/>').html("")
    $(".ut_tools_conceptmapper_menubutton").remove()
    if (newContent isnt @contentBeforeEdit)
# the content has really been changed,
# commit the change to the model and log the action
      inputElement.replaceWith(p)
      @model.changeConceptContent conceptId, newContent
      object = {
        "objectType": "concept",
        "id": conceptId,
        "content": newContent
      }
      if @isCurrentlyLogging and @actionLogger? then @actionLogger.logChange(object)
    else
# nothing has been changed, "newContent" is actually the old content
      p = $('<p/>').html(newContent)
      inputElement.replaceWith(p)
    @contentBeforeEdit = ""
    # repaint the links, as the size of the concept element might have changed
    jsPlumb.repaintEverything()

  ###
    some functions for action logging
  ###
  logRemoveConcept: (conceptId) =>
    object = {
      "objectType": "concept",
      "id": conceptId
    }
    if @isCurrentlyLogging and @actionLogger? then @actionLogger.logRemove(object)

  logRemoveRelation: (relationId) =>
    object = {
      "objectType": "relation",
      "id": relationId
    }
    if @isCurrentlyLogging and @actionLogger? then @actionLogger.logRemove(object)

  logAddRelation: (newRelation) =>
    object = {
      "objectType": "relation",
      "id": newRelation.id
      "content": newRelation.content
      "source": newRelation.source
      "target": newRelation.target
    }
    if @isCurrentlyLogging and @actionLogger? then @actionLogger.logAdd(object)

  ###
    the listeners connected to the model.
    responsible to update the view if the model has changed.
  ###

  addConceptToView: (concept) =>
    newConcept = $("<div>")
    newConcept.attr('id', concept.id)
    newConcept.addClass("ut_tools_conceptmapper_concept")
    newConcept.append($('<p/>').html(nl2br(concept.content)))
    jsPlumb.draggable newConcept, {
      cursor: "move",
      revert: "invalid",
      iframeFix: true,
      delay: 50,
#containment: "#ut_tools_conceptmapper_map"
      containment: "#ut_tools_conceptmapper_root"
    }
    newConcept.css('position', 'absolute');
    newConcept.css('top', concept.y);
    newConcept.css('left', concept.x);
    newConcept.addClass(concept.type);
    if concept.type is "ut_tools_conceptmapper_conceptTextarea"
      newConcept.click(@onClickHandlerInjectTextarea)
    else
      newConcept.click(@onClickHandlerInjectCombobox)
    @root.append(newConcept)
    @changeConceptColorInView(concept.id, concept.colorClass)
    if (@mode == @LINK_MODE) then @setConceptLinkMode(newConcept)
    else if (@mode == @LINK_MODE) then @setConceptNodeMode(newConcept)

  removeConceptFromView: (idToDelete) =>
    conceptElement = $("##{idToDelete}")
    if conceptElement?
      jsPlumb.detachAllConnections conceptElement
      #@deleteConnectionsBetween(id)
      $(conceptElement).fadeOut 300, =>
        $(conceptElement).remove()

  addRelationToView: (newRelation) =>
    connection = jsPlumb.connect({source:newRelation.source, target:newRelation.target, cssClass: "connection"})
    connection.idPrefix = ""
    connection.id = newRelation.id
    if not newRelation.content?
      newRelation.content = " "
    connection.getOverlay("label").setLabel(newRelation.content)
    connection.addOverlay([ "PlainArrow", { location:0.85, width:10, height:8, id:"arrow"}])
    $(connection.getOverlay("label").getElement()).draggable(
      cursor: "move",
      revert: "invalid",
      iframeFix: true,
      delay: 50,
      containment: "#ut_tools_conceptmapper_root"
      start: (event, ui) =>
        $(ui.helper.context).data('dragging', true)
      stop: (event, ui) =>
        setTimeout  (() => $(ui.helper.context).data('dragging', false)), 300
        jsPlumb.repaintEverything()
    )
    connection.getOverlay("label").addClass("ut_tools_conceptmapper_label")
    jsPlumb.repaintEverything()

  removeRelationFromView: (relationId) =>
    @logRemoveRelation relationId
    for connection in jsPlumb.getConnections()
      if connection.id is relationId
        jsPlumb.detach(connection)
        break
    jsPlumb.repaintEverything()

  changeConceptContentInView: (conceptId, newContent) ->
    $("##{conceptId} p").html(newContent)
    jsPlumb.repaintEverything()

  changeConceptPositionInView: (conceptId, newX, newY) ->
    $("##{conceptId}").css 'left', newX
    $("##{conceptId}").css 'top', newY
    jsPlumb.repaintEverything()

  changeConceptColorInView: (conceptId, newColorClass) =>
    concept = $("##{conceptId}")
    if concept?
      if newColorClass?
# remove the old color(s)
        for oldColor in @colorClasses
          concept.removeClass oldColor
        # set the new color
        concept.addClass newColorClass
      else
        concept.addClass "ut_tools_conceptmapper_blue"

  changeRelationContentInView: (relationId, newContent) ->
    for connection in jsPlumb.getConnections()
      if connection.id is relationId
        connection.getOverlay("label").setLabel(newContent)
        break
    jsPlumb.repaintEverything()

  deleteAllFromView: () =>
    # delete all relations
    for connection in jsPlumb.getConnections()
      jsPlumb.detach(connection)
    jsPlumb.repaintEverything()
    # delete all concepts
    @root.find(".ut_tools_conceptmapper_concept").each (index, conceptElement) =>
      $(conceptElement).remove()

  modelLoadedIntoView: =>
    @setMode(@NODE_MODE)
    @deleteAllFromView()
    for concept in @model.getResourceContent().concepts
      @addConceptToView(concept)
    for relation in @model.getResourceContent().relations
      @addRelationToView(relation)
    jsPlumb.repaintEverything()