"use strict";

window.ut = window.ut or {}
window.ut.commons = ut.commons || {}
window.ut = window.ut || {}
window.ut.tools = window.ut.tools or {}
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper or {}

initialConfiguration = {
  concepts: ["length", "mass", "time", "electric current", "thermodynamic temperature", "amount of substance", "luminous intensity"]
  relations: ["is a", "is part of", "has", "leads to", "influences", "increases", "decreases"]
}

defaultHelp = """
<ul>
    <li><b>Create a concept</b> by dragging a concept from the upper bar into the area.</li>
    <li><b>Name a concept</b> by clicking the concept (left mouse button) and select one of the predefined concepts or type a name from your own choice.</li>
    <li><b>Change the color</b> of a concept by clicking the left mouse button, click the "wheel" and select the color.</li>
    <li><b>Delete a concept</b> by dragging it back to the upper bar (or by clicking "delete" in the "wheel" menu").</li>
    <li><b>Create a relation</b> between concepts by selecting the arrow icon from the upper bar and then drag a line between two concepts.<br>
    Alternatively, after selecting the arrow icon, you can click two concepts to create a relation between them.
    </li>
    <li><b>Name a relation</b> by clicking it, select one of the predefined concepts or type your own.</li>
    <li><b>Delete a relation</b> by creating the same relation again, or by dragging the relation label to the upper bar.</li>
    <li>If "save as" is enabled, you can save different concept maps under different names, start a new concept map or open a previous one (icons on the top left).</li>
</ul>
"""

initialConfigurationResource = {
  "metadata": {
    "actor": {
      "objectType": "person",
      "id": "unknown user@http://130.89.152.19:8080",
      "displayName": "unknown user"
    },
    "target": {
      "objectType": "configuration",
      "forApplication": "conceptmapper",
      "id": "70ad09b4-7dc0-4a82-d71a-62bbf30d10bfssf",
      "displayName": "initial configuration"
    },
    "generator": {
      "objectType": "application",
      "url": "http://130.89.152.19:8080/golab/tools/hypothesis/src/main/webapp/hypothesis.html",
      "id": "ce6fc3d0-c48e-4929-f282-a77bb97dcc57tgdv",
      "displayName": "conceptmapper"
    },
    "provider": {
      "objectType": "ils",
      "url": "http://130.89.152.19:8080/golab/tools/conceptmap/src/main/webapp/conceptmapper.html",
      "id": "http://130.89.152.19:8080",
      "inquiryPhase": "unknown",
      "displayName": "unknown"
    },
    "published": "2014-09-30T08:15:08.148Z",
    "id": "a0fee60f-7fc8-45c5-fccb-52616418d9cffsgsgrer"
  },
  "content": initialConfiguration
}


class window.ut.tools.conceptmapper.ConceptMapConfigurationModel extends window.ut.commons["ConfigurationModel"]
  constructor: (storageHandler, forApplication)->
    super(storageHandler, defaultHelp, forApplication)
#    @_debug = true
    @concepts = new window.ut.commons.NamedEventArray(@,"concepts")
    @relations = new window.ut.commons.NamedEventArray(@,"relations")

  loadDefaultConfiguration: ->
    # do nothing, handle it differently
    #@loadFromResource(initialConfigurationResource)

  myLoadDefaultConfiguration: ->
    @loadFromResource(initialConfigurationResource)

  ###
  # override and don't call super()
  ###
  getResourceContent: ->
    resourceContent = super()
    resourceContent.concepts = @concepts.getValues()
    resourceContent.relations = @relations.getValues()
    resourceContent

  ###
  # override and don't call super()
  ###
  loadFromResourceContent: (content)->
    super(content)
    @concepts.setValues(content.concepts)
    @relations.setValues(content.relations)

  ###
  # override and call super()
  ###
  clearContent: ->
    @concepts.clear()
    @relations.clear()
    super()
