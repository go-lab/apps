(function(){"use strict";var t,o,e;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.observationtool=ut.tools.observationtool||{},ut.commons=ut.commons||{},ut.commons.utils=ut.commons.utils||{},o=1,t={gadgetResize:{}},e=function(t,o,e){var s;return s=o.getObservationActionlogger(),t.observationsState={selectedObservationId:null},t.addObservation=function(){var n;return n=o.addNewObservation(),t.observationsState.selectedObservationId=n.id,e(ut.commons.utils.gadgetResize),s.logObservationAdded(n)},t.deleteObservation=function(){var n;if(t.observationsState.selectedObservationId)return n=o.getObservation(t.observationsState.selectedObservationId),o.deleteObservation(t.observationsState.selectedObservationId),t.observationsState.selectedObservationId=null,e(ut.commons.utils.gadgetResize),s.logObservationRemoved(n)}},ut.tools.observationtool.observationTool.controller("observationToolCtrl",["$scope","observationsModel","$timeout",e])}).call(this);
//# sourceMappingURL=observationToolCtrl.js.map
