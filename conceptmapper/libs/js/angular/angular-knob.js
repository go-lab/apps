/*
* copied from https://github.com/yunlzheng/angular-knob
*
* Adapted by Jakob on 2014-1030
* - placed content of link function in a timeout, so that angular can be use to set the knob options.
*/

angular.module('ui.knob', []).directive('knob', ['$timeout', function ($timeout) {
   'use strict';

   return {
      restrict: 'EA',
      replace: true,
      template: '<input value="{{ knobData }}"/>',
      scope: {
         knobData: '=',
         knobOptions: '&'
      },
      link: function ($scope, $element) {
         $timeout(function () {

            var knobInit = $scope.knobOptions() || {};

            knobInit.release = function (newValue) {
               $timeout(function () {
                  $scope.knobData = newValue;
                  $scope.$apply();
               });
            };

            $scope.$watch('knobData', function (newValue, oldValue) {
               if (newValue != oldValue) {
                  $($element).val(newValue).change();
               }
            });

            $($element).val($scope.knobData).knob(knobInit);
         })
      }
   };
}]);