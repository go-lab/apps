"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

#    prevent EventEmitter not defined warning in Intellij
EventEmitter = window.EventEmitter

class ut.commons.DataStore extends EventEmitter
  constructor: ()->
    @datas = {}
    @ids = {}

  addData: (category, data) ->
    @datas[category] ?= []
    if (typeof data.title == "undefined" && data.metadata.target.displayName)
      data.title = data.metadata.target.displayName
    if (typeof data.metadata == "undefined")
      data.metadata = {}
    if (typeof data.metadata.id == "undefined" && data.id)
      data.metadata.id = data.id
      delete data.id
    if (typeof data.metadata.flags == "undefined")
      data.metadata.flags = {}
    data.metadata.flags.readOnly = true
    @datas[category].push data
    if (@getDataById(data.metadata.id))
      console.warn("duplicate id: #{data.metadata.id}")
      console.warn(data)
    @ids[data.metadata.id.toLowerCase()] = data

  getDatas: (category) ->
    if (@datas[category])
      @datas[category]
    else
      []

  getData: (category, title) ->
    for data in @getDatas(category)
      if data.title == title
        return data
    null

  getCategories: ()->
    for id,array of @datas
      id

  getDataById: (id)->
    @ids[id.toLowerCase()]

  resourceExists: (resourceId) ->
    if (@ids[resourceId])
      true
    else
      false

  sendLoadEvent: (data)->
    @emitEvent("loadData",[data])

  getFilteredDataStore: (resourceType)->
    filteredDataStore = new ut.commons.DataStore()
    for category in @getCategories()
      for data in @getDatas(category)
        if (data.metadata && data.metadata.target && data.metadata.target.objectType && data.metadata.target.objectType==resourceType)
          filteredDataStore.addData(category, data)
    filteredDataStore

