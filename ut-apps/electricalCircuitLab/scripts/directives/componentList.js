(function(){"use strict";var t;window.ut=window.ut||{},ut.simulations=ut.simulations||{},ut.simulations.electricity=ut.simulations.electricity||{},t=function(){return{restrict:"E",template:'<div class="availableComponents" ng-controller="componentBoxCtrl">\n    <div ng-repeat="component in getAvailableComponents()" class="newComponent">\n        <component hideLabel draggable helper="clone" objectType="newComponent"\n                   objectId="{{component.getId()}}"></component>\n    </div>\n</div>',replace:!0,link:function(t,n,e){}}},window.ut.simulations.electricity.circuitsimulator.directive("componentlist",[t])}).call(this);
//# sourceMappingURL=componentList.js.map
