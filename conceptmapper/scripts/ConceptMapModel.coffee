"use strict";

window.ut = window.ut or {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}

class window.ut.tools.conceptmapper.ConceptMapModel extends window.ut.commons.ResourceEventEmitterModel

  constructor: (environmentHandlers)->
    super(environmentHandlers, "conceptMap")
#    @debug = true
    @_clearContentInternal()

  createNewModel: () ->
    new window.ut.tools.conceptmapper.ConceptMapModel(@environmentHandlers)

  ###
  # override and don't call super()
  ###
  getResourceContent: =>
    @_content

  ###
  # override and don't call super()
  ###
  loadFromResourceContent: (content) =>
    console.log "ConceptMapModel.loadFromResourceContent called." if @debug
    @_clearContentInternal()
    if (content.concepts)
      @_content.concepts = content.concepts
    if (content.relations)
      @_content.relations = content.relations
    ###
    for concept in @_content.concepts
      @emitEvent("addConcept", [concept])
    for relation in @_content.relations
      @emitEvent("addRelation", [relation])
    @emitModelChanged()
    ###

  ###
  # override and call super() at the end
  ###
  clearContent: =>
    console.log "ConceptMapModel.clearContent called." if @debug
    @_clearContentInternal()
    @emitEvent("contentCleared")
    @emitModelChanged()

  _clearContentInternal: =>
    @_content = {
      concepts: []
      relations: []
    }

  isEmpty: ->
    @_content.concepts.length == 0

  addConcept: (newConcept) =>
    @_content.concepts.push(newConcept)
    @emitEvent("addConcept", [newConcept])
    @emitModelChanged()

  changeConceptContent: (id, newContent) =>
    for concept in @_content.concepts
      if concept.id is id
        concept.content = newContent
        @emitEvent("changeConceptContent", [id, newContent])
        @emitModelChanged()
        break

  changeConceptPosition: (id, newX, newY) =>
    for concept in @_content.concepts
      if concept.id is id
        concept.x = newX
        concept.y = newY
        @emitEvent("changeConceptPosition", [id, newX, newY])
        @emitModelChanged()
        break

  changeConceptColor: (id, newColorClass) =>
    for concept in @_content.concepts
      if concept.id is id
        concept.colorClass = newColorClass
        @emitEvent("changeConceptColor", [id, newColorClass])
        @emitModelChanged()
        break

  removeConcept: (idToDelete) =>
    @removeRelationsFromConcept(idToDelete)
    @_content.concepts = @_content.concepts.filter (concept) -> concept.id isnt idToDelete
    @emitEvent("removeConcept", [idToDelete])
    @emitModelChanged()

  addRelation: (newRelation) ->
    if @conceptExists(newRelation.source) and @conceptExists(newRelation.target)
      @_content.relations.push(newRelation)
      @emitEvent("addRelation", [newRelation])
      @emitModelChanged()
    else
      console.warn "cannot add the following relation, source or target concept doesn't exist:"
      console.warn newRelation

  changeRelationContent: (id, newContent) =>
    for relation in @_content.relations
      if relation.id is id
        relation.content = newContent
        @emitEvent("changeRelationContent", [id, newContent])
        @emitModelChanged()
        break

  removeRelation: (idToDelete) =>
    numberOfRelations = @_content.relations.length
    @_content.relations = @_content.relations.filter (relation) -> relation.id isnt idToDelete
    # check if a relation really has been deleted
    if numberOfRelations isnt @_content.relations.length
      @emitEvent("removeRelation", [idToDelete])
      @emitModelChanged()

  removeRelationsFromConcept: (conceptId) ->
    for relation in @_content.relations
      if (relation.source is conceptId) or (relation.target is conceptId)
        @removeRelation(relation.id)

  removeRelationsBetween: (sourceId, targetId) ->
    for relation in @_content.relations
      # check both directions
      if ((relation.source is sourceId) and (relation.target is targetId)) or ((relation.source is targetId) and (relation.target is sourceId))
        @removeRelation(relation.id)

  relationExists: (sourceId, targetId) ->
    # checks existence of a relation, directed
    for relation in @_content.relations
      if (relation.source is sourceId) and (relation.target is targetId)
        return true
    return false

  relationExistsBetween: (sourceId, targetId) ->
    # checks existence of a relation, undirected
    for relation in @_content.relations
      if ((relation.source is sourceId) and (relation.target is targetId)) or ((relation.source is targetId) and (relation.target is sourceId))
        return true
    return false

  getRelationsBetween: (sourceId, targetId) ->
    # returns relations between two concepts, undirected
    relations = []
    for relation in @_content.relations
      if ((relation.source is sourceId) and (relation.target is targetId)) or ((relation.source is targetId) and (relation.target is sourceId))
        relations.push relation
    relations

  conceptExists: (conceptId) ->
    for concept in @_content.concepts
      if concept.id is conceptId
        return true
    return false

  ###
    functions to apply log actions
  ###

  applyLogAction: (logObject, callback) =>
    console.log "applying log action:" if @debug
    console.log logObject if @debug
    switch logObject.verb
      when "add"
        switch logObject.object.objectType
          when "concept" then @addConcept logObject.object
          when "relation" then @addRelation logObject.object
          else console.warn "ignoring unknown objectType #{logObject.object.objectType} for verb #{logObject.verb}"
      when "remove"
        switch logObject.object.objectType
          when "concept" then @removeConcept logObject.object.id
          when "relation" then @removeRelation logObject.object.id
          else console.warn "ignoring unknown objectType #{logObject.object.objectType} for verb #{logObject.verb}"
      when "change"
        switch logObject.object.objectType
          when "concept"
            if logObject.object.content?
              @changeConceptContent logObject.object.id, logObject.object.content
            else if logObject.object.x?
              @changeConceptPosition logObject.object.id, logObject.object.x, logObject.object.y
            else if logObject.object.colorClass?
              @changeConceptColor logObject.object.id, logObject.object.colorClass
            else
              console.warn "ignoring unknown change to concept:"
              console.warn logObject.object
          when "relation"
            if logObject.object.content?
              @changeRelationContent logObject.object.id, logObject.object.content
          else console.warn "ignoring unknown objectType #{logObject.object.objectType} for verb #{logObject.verb}"
      else
        super(logObject, callback)
    callback() if callback?
    @emitEvent("logApplied")

# deprecated methods
  applyLogAdd: (activityStreamObject) ->
    console.log activityStreamObject
    switch activityStreamObject.object.objectType
      when "concept"
        if activityStreamObject.object.x? and activityStreamObject.object.y?
          x = activityStreamObject.object.x
          y = activityStreamObject.object.y
        else
          x = Math.floor((Math.random() * window.innerWidth) + 1)
          y = Math.floor((Math.random() * (window.innerHeight)) + 1)
        if activityStreamObject.object.type? and activityStreamObject.object.colorClass?
          type = activityStreamObject.object.type
          colorClass = activityStreamObject.object.colorClass
        else
          type = "ut_tools_conceptmapper_conceptTextarea"
          colorClass = "ut_tools_conceptmapper_blue"
        newConcept = {
          id: activityStreamObject.object.id
          content: activityStreamObject.object.content
          x: x
          y: y
          type: type
          colorClass: colorClass
        }
        @addConcept(newConcept)
      when "relation"
        newRelation = {
          id: activityStreamObject.object.id
          source: activityStreamObject.object.source
          target: activityStreamObject.object.target
          content: activityStreamObject.object.content
        }
        @addRelation(newRelation)
      else
        console.warn("don't know how to add a #{activityStreamObject.object.objectType}")

  applyLogChange: (activityStreamObject) ->
    console.log "applying change: "
    console.log activityStreamObject
    switch activityStreamObject.object.objectType
      when "concept"
        # TODO changing other things, like color or position
        @changeConceptContent(activityStreamObject.object.id, activityStreamObject.object.content)
      when "relation"
        @changeRelationContent(activityStreamObject.object.id, activityStreamObject.object.content)
        console.log "changing relation"
      else
        console.warn("don't know how to change a #{activityStreamObject.object.objectType}")

  applyLogRemove: (activityStreamObject) ->
    console.log "applying remove: "
    console.log activityStreamObject
    switch activityStreamObject.object.objectType
      when "concept"
        @removeConcept(activityStreamObject.object.id)
      when "relation"
        @removeRelation(activityStreamObject.object.id)
      else
        console.warn("don't know how to remove a #{activityStreamObject.object.objectType}")