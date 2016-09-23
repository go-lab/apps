"use strict";

window.ut = window.ut or {}
ut.commons = ut.commons || {}

# reads only the first value and it does not seem to work for my own defined properties
getStyleRuleValue = (styleName, propertyName, fileName) ->
  for styleSheet in document.styleSheets
    rules = if styleSheet.cssRules
      styleSheet.cssRules
    else
      styleSheet.rules
    if (rules)
      if (styleSheet.href && fileName && styleSheet.href.lastIndexOf(fileName)<0)
        continue
      for rule in rules
#        console.log(rule)
        if (rule.selectorText)
          if (rule.selectorText == styleName)
            return rule.style[propertyName]
  null

hypothesisConfidenceDirective = (languageHandler) ->
  {
  restrict: "E"
  template: """
<knob knob-data="confidence" knob-options="options" Xclass="hypothesisConfidence"></knob>
"""
#  replace: true
  scope: {
    confidence: "="
    readonly: "="
  }
  link: (scope, element, attrs)->
#    console.log("width: #{getStyleRuleValue('.hypothesisConfidence','width','conclusionTool.css')}")
#    enabledFgColor = getStyleRuleValue('.hypothesisConfidence','enabledFgColor','conclusionTool.css')
#    enabledBgColor = getStyleRuleValue('.hypothesisConfidence','enabledBgColor','conclusionTool.css')
#    disabledFgColor = getStyleRuleValue('.hypothesisConfidence','disabledFgColor','conclusionTool.css')
#    disabledBgColor = getStyleRuleValue('.hypothesisConfidence','disabledBgColor','conclusionTool.css')
    enabledFgColor = "#4444ad"
    enabledBgColor = "#939597"
    disabledFgColor = "#8A8EE6"
    disabledBgColor = "#c8c8c8"
    size = 60
    scope.options = {
      width: size
      height: size
      thickness: 0.65
      angleOffset: -125
      angleArc: 250
      min: 0
      max: 100
      step: 10
      fgColor: enabledFgColor
      bgColor: enabledBgColor
      displayInput: false
    }
    scope.$watch("readonly", (newValue, oldValue)->
      if (newValue == true)
        scope.options.fgColor = disabledFgColor
        scope.options.bgColor = disabledBgColor
        scope.options.readOnly = true
      else
        scope.options.fgColor = enabledFgColor
        scope.options.bgColor = enabledBgColor
        scope.options.readOnly = false
    )
  }

ut.commons.golabUtils.directive("hypothesisConfidence".toLowerCase(),
  ["languageHandler", hypothesisConfidenceDirective])

