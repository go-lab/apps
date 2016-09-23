"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

debug = false
#debug = true

maximumNumberOfStates = 25

class ModelState
  constructor: (model)->
    @_json = model.getResourceContent()
    @_jsonString = JSON.stringify(@_json)
    if (!model.isContentCopy())
      @_json = JSON.parse(@_jsonString)

  equals: (modelState)->
    @_jsonString == modelState._jsonString

  apply: (model)->
#    debugger
    console.log("applying model state #{@}") if (debug)
    model.loadContentFromResource(@_json)
#    model.emitEvent("contentChanged")

  toString: ()->
    @_jsonString


class window.ut.commons.UndoRedoManager extends window.EventEmitter
  constructor: (@model)->
#    @_stateArray = []
#    @_currentStateIndex = -1
    @_resetStateArray()
    if (!@model instanceof window.ut.commons.ResourceEventEmitterModel)
      throw new Error("the model must be an instance of window.ut.commons.ResourceEventEmitterModel")
    @_listeningToEvents = true
    @model.addListener("modelChanged", (options)=>
      if (@_listeningToEvents)
        @_modelChanged(options)
    )
    @model.addListeners(["modelLoaded", "modelCleared"], =>
      if (@_listeningToEvents)
        @_resetStateArray()
    )
    Object.defineProperties(@, {
      canUndo: {
        get: @getCanUndo
      }
      canRedo: {
        get: @getCanRedo
      }
    })

  _getModelState: ->
    new ModelState(@model)

  _applyModelState: (modelState)->
    @_listeningToEvents = false
    modelState.apply(@model)
    @_listeningToEvents = true

  _resetStateArray: =>
    console.log("reset states") if (debug)
    @_stateArray = []
    @_currentStateIndex = -1
    @_addState(@_getModelState())

  _addState: (modelState)->
    if (@_stateArray.length >= maximumNumberOfStates)
      @_stateArray.splice(0, 1)
    @_currentStateIndex = @_stateArray.length
    @_stateArray[@_currentStateIndex] = modelState
    console.log("added state: #{modelState._jsonString}") if (debug)
    @printState() if (debug)

  _modelChanged: (options)=>
    if (options && options.bigChange == false)
      return
    modelState = @_getModelState()
    console.log("_modelChanged(modelState)") if (debug)
    if (!@_stateArray[@_currentStateIndex].equals(modelState))
      newStateIndex = @_currentStateIndex + 1
      if (@_stateArray.length > newStateIndex)
        # there are redo states
        @_addState(@_stateArray[@_currentStateIndex])
      @_addState(modelState)
      @printState() if (debug)

  printState: =>
    console.log("@_currentStateIndex: #{@_currentStateIndex}, nrOfStates: #{@_stateArray.length}")
    i = 0
    for state in @_stateArray
      currentState = if (i == @_currentStateIndex) then "*" else " "
      console.log("#{currentState}#{i}: #{state}")
      i++
    console.log()

  getCanUndo: ->
    @_currentStateIndex > 0

  getCanRedo: ->
    (@_currentStateIndex + 1) < @_stateArray.length

  undo: ->
    if (@canUndo)
      @_currentStateIndex--
      undoState = @_stateArray[@_currentStateIndex]
      @_applyModelState(undoState)
      @printState() if (debug)

  redo: ->
    if (@canRedo)
      @_currentStateIndex++
      redoState = @_stateArray[@_currentStateIndex]
      @_applyModelState(redoState)
      @printState() if (debug)

