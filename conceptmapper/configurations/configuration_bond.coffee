"use strict"

window.golab = window.golab or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools.configuration = window.golab.tools.configuration or {}

window.golab.tools.configuration["conceptmapper"] = {
  auto_load: {
    type: "boolean"
    value: "true"
  }
  show_prompts: {
    type: "boolean"
    value: "true"
  }
  textarea_concepts: {
    type: "boolean"
    value: "false"
  }
  combobox_concepts: {
    type: "boolean"
    value: "true"
  }
  drop_external: {
    type: "boolean"
    value: "true"
  }
  concepts: {
    type: "array"
    value: ["neerslag", "kleur", "oplosbaarheid", "oplossing", "reactie", "hydratatie", "ion", "zout"]
  }
  relations: {
    type: "array"
    value: ["is een", "is onderdeel van", "heeft", "leidt tot", "heeft invloed op", "neemt toe", "neemt af"]
  }
}