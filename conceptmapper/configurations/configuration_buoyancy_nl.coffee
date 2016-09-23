"use strict"

window.golab = window.golab or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools = window.golab.tools or {}
window.golab.tools.configuration = window.golab.tools.configuration or {}

window.golab.tools.configuration["conceptmapper"] = {
  auto_load: {
    type: "boolean"
    value: "false"
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
    value: ["Materiaal", "Massa", "Volume", "Dichtheid voorwerp", "Dichtheid vloeistof", "Vorm", "Kleur", "Drijven", "Zinken", "Zweven", "Volume vloeistofverplaatsing", "Massa vloeistofverplaatsing", "Gewicht", "Zwaartekracht", "Buisjes", "Dichtheid", "Voorwerp", "Vloeistof", "Kracht", "Opwaartse kracht"]
  }
  relations: {
    type: "array"
    value: ["Is een", "Is deel van", "Heeft", "Leidt tot", "Beïnvloedt", "Neemt toe", "Neemt af"]
  }
}