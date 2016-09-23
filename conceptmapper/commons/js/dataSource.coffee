"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

class ut.commons.DataSource
  constructor: ->

  getRowValues: (dataSourceColumnArray)->
    ###
     return an array of arrays
     at top level, each element is new row
    ###


class ut.commons.DataSourceColumn
  constructor: ->

  getImageInformation: ->
    throw new Error("ut.commons.DataSourceColumn.getImageInformation() is not overriden")
    ###
      type         value
      commonImage  name of image
      image        absolute path of image
    ###
    {
    type: "" # commonImage, image
    value: ""
    }

  getType: ->
    throw new Error("ut.commons.DataSourceColumn.getType() is not overriden")
    ###
      returns "string", "number" or "boolean"
    ###

  getId: ->
    throw new Error("ut.commons.DataSourceColumn.getId() is not overriden")

  getLabel: ->
    throw new Error("ut.commons.DataSourceColumn.getLabel() is not overriden")

  getUnit: ->
    throw new Error("ut.commons.DataSourceColumn.getUnit() is not overriden")


class ut.commons.DataSourceColumnDrop
  constructor: ->

  getDataSource: ->
    throw new Error("ut.commons.DataSourceColumnDrop.getDataSource() is not overriden")

  getDataSourceColumns: ->
    [@getDataSourceColumn()]

  getDataSourceColumn: ->
    throw new Error("ut.commons.DataSourceColumnDrop.getDataSourceColumn() is not overriden")


class ut.commons.DataSourceColumnFactory
  constructor: ->

  getDataSource: (id)->
    throw new Error("ut.commons.DataSourceColumnFactory.getDataSource() is not overriden")

  getDataSourceColumn: (id)->
    throw new Error("ut.commons.DataSourceColumnFactory.getDataSourceColumn() is not overriden")

