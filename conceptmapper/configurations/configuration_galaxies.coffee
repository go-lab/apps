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
    value: ["galaxy", "spiral", "mass", "elliptical", "lenticular", "Hubble", "gravity", "interaction", "mass", "star", "galactic centre", "centre of mass", "tuning fork", "formation", "binary system", "rotation", "inverse square law", "velocity", "acceleration", "friction"]
  }
  relations: {
    type: "array"
    value: ["is a", "is part of", "has", "leads to", "influences", "increases", "decreases"]
  }
}