(function(){"use strict";var t;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.observationtool=ut.tools.observationtool||{},ut.commons=ut.commons||{},ut.commons.utils=ut.commons.utils||{},t=function(){return{restrict:"E",template:'<div>\n  <li>\n    <i class="fa fa-plus fa-fw activeButton fontAweSomeButton" ng-class="{disabledButton: observation.addDisabled}"\n      ng-click=\'addObservation()\' title="{{\'observationTool.addObservation\' | g4i18n}}"></i>\n  </li>\n  <li>\n    <i class="fa fa-minus fa-fw activeButton fontAweSomeButton"\n      ng-class="{disabledButton: observationsState.selectedObservationId===null}"\n      ng-click=\'deleteObservation()\' title="{{\'observationTool.deleteObservation\' | g4i18n}}"></i>\n  </li>\n</div>\n',replace:!0,link:function(t,o,n){}}},window.ut.tools.observationtool.observationTool.directive("observationControls".toLowerCase(),[t])}).call(this);
//# sourceMappingURL=observationControls.js.map
