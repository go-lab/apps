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
        conceptMapperView = new window.ut.tools.conceptmapper.ConceptMapperView(theConceptMapModel, theConfigurationModel, languageHandler, conceptMapElement)
        conceptMapperView.modelLoadedIntoView()
      scope.$watch("conceptMapModel", ->
        theConceptMapModel = scope.conceptMapModel
        createNewConceptMapper()
      )
  }


window.ut.tools.conceptmapper.ConceptMapAngularApp.directive("conceptMapView".toLowerCase(),
  ["conceptMapModel", "configurationModel","languageHandler", conceptMap])

class window.ut.tools.conceptmapper.ConceptMapperView

  constructor: (@conceptMapModel, @configurationModel, @languageHandler, @root) ->
    @debug = false

    # connecting to the model from the ng-controller
    @model = @conceptMapModel
    @model.addListener("contentCleared", @deleteAllFromView)
    @model.addListener("addConcept", @addConceptToView)
    @model.addListener("removeConcept", @removeConceptFromView)
    @model.addListener("changeConceptColor", @changeConceptColorInView)
    @model.addListener("addRelation", @addRelationToView)
    @model.addListener("modelLoaded", @modelLoadedIntoView)
    @model.addListener("contentLoaded", @modelLoadedIntoView)

    @colorClasses = [
      "ut_tools_conceptmapper_blue",
      "ut_tools_conceptmapper_yellow",
      "ut_tools_conceptmapper_green",
      "ut_tools_conceptmapper_red",
      "ut_tools_conceptmapper_orange",
    ]
    @initJsPlumb()

  getModel: () =>
    @model

  initJsPlumb: () =>
    jsPlumbDefaults = {
      Connector : [ "Straight" ],
      ConnectorZIndex: 0,
      DragOptions : { cursor: "pointer", zIndex:2000 },
      PaintStyle : { strokeStyle:"#92D6E3", lineWidth:2 },
      EndpointStyle : {},
      Anchor: [ "Perimeter", { shape:"Ellipse"} ],
      ConnectionOverlays: [
        [ "Label", { label: @configurationModel.relations.getValue(0), location:0.5, id:"label" }]
      ],
      Detachable:false,
      Reattach:false
    }
    @rootId = ut.commons.utils.generateUUID()
    $(@root[0]).attr "id", @rootId
    @jsPlumbInstance = jsPlumb.getInstance(
      Container: @rootId
    )
    @jsPlumbInstance.importDefaults jsPlumbDefaults
    @jsPlumbInstance.setRenderMode jsPlumb.SVG

  addConceptToView: (concept) =>
    newConcept = $("<div>")
    newConcept.attr "id", concept.id+@rootId
    newConcept.css "position", "absolute"
    newConcept.css "top", concept.y
    newConcept.css "left", concept.x
    newConcept.addClass concept.type
    newConcept.addClass "ut_tools_conceptmapper_concept"
    @root.append(newConcept)
    newConcept.svg()
    svg = newConcept.svg("get")
    fill = "#4545AD"
    switch concept.colorClass
      when "ut_tools_conceptmapper_yellow"
        fill = "darkgoldenrod"
      when "ut_tools_conceptmapper_green"
        fill = "darkgreen"
      when "ut_tools_conceptmapper_red"
        fill = "red"
      when "ut_tools_conceptmapper_orange"
        fill = "darkorange"
    svg.text(4, 19, concept.content, {fill: 'white'})
    text = $("svg > text", newConcept)[0]

    box = text.getBBox()
    svg.rect(0, 0, box.width+16, box.height+8, {fill: fill})
    newConcept.css "width", box.width+18
    newConcept.css "height", box.height+10
    $("svg", newConcept).append(text)

  bringToFront: (elementId) =>
    element = $("##{elementId}")
    @root.append element

  addRelationToView: (newRelation) =>
    source = newRelation.source+@rootId
    target = newRelation.target+@rootId
    connection = @jsPlumbInstance.connect({source:source, target:target, cssClass: "connection"})
    connection.idPrefix = ""
    connection.id = newRelation.id
    if not newRelation.content?
      newRelation.content = " "
    connection.getOverlay("label").setLabel("")
    connection.addOverlay([ "PlainArrow", { location:0.85, width:10, height:8, id:"arrow"}])
    connection.getOverlay("label").addClass("ut_tools_conceptmapper_labelReadOnly")

    labelElement = $(connection.getOverlay("label").getElement())
    labelElement.svg()
    svg = labelElement.svg("get")
    $(svg.text(2, 14, newRelation.content, {fill: 'white'}))
    text = $("svg > text", labelElement)[0]
    box = text.getBBox()
    svg.rect(-box.width/2, 0, box.width*1.6, box.height+2, {fill: "#ABAEFF"})
    labelElement.css "width", box.width+12
    labelElement.css "height", box.height+2

    $("svg", labelElement).append(text)
    @jsPlumbInstance.repaintEverything()

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

  deleteAllFromView: () =>
    # delete all relations
    for connection in @jsPlumbInstance.getConnections()
      @jsPlumbInstance.detach(connection)
    @jsPlumbInstance.repaintEverything()
    # delete all concepts
    @root.find(".ut_tools_conceptmapper_concept").each (index, conceptElement) =>
      $(conceptElement).remove()

  shiftNodes: =>
    # move nodes to the top left as much as possible
    offsetX = Number.MAX_SAFE_INTEGER
    offsetY = Number.MAX_SAFE_INTEGER
    maxY = 0
    for concept in @model.getResourceContent().concepts
      if concept.x < offsetX then offsetX = concept.x
      if concept.y < offsetY then offsetY = concept.y
      if concept.y > maxY then maxY = concept.y
    for concept in @model.getResourceContent().concepts
      concept.x = concept.x - offsetX
      concept.y = concept.y - offsetY
    return (maxY - offsetY)

  modelLoadedIntoView: =>
    maxY = @shiftNodes()+35
    # potentially the root element for the concept map is not visible, yet
    # wait for it...
    waitForRoot = () =>
      if @root[0].clientWidth is 0
        setTimeout waitForRoot, 100
      else
        @deleteAllFromView()
        for concept in @model.getResourceContent().concepts
          @addConceptToView(concept)
        for relation in @model.getResourceContent().relations
          @addRelationToView(relation)
        for concept in @model.getResourceContent().concepts
          @bringToFront(concept.id)
        @jsPlumbInstance.repaintEverything()
        $(@root[0]).css "height", maxY
        $(@root[0]).css "min-height", maxY
        $(@root[0]).css "max-height", maxY
    waitForRoot()
