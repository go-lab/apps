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
    value: ["Material", "Mass", "Volume", "Density object", "Density fluid", "Shape", "Colour", "Floating", "Sinking", "Drifting", "Volume fluid displacement", "Mass fluid displacement", "Weight", "Gravity", "Tubes", "Density", "Object", "Fluid", "Force", "Buoyant force"]
  }
  relations: {
    type: "array"
    value: ["is a", "is part of", "has", "leads to", "influences", "increases", "decreases"]
  }
}