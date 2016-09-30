/**
 * Created by sikkenj on 9-5-2016.
 */

/// <reference path="../../typescriptTypeDefs/golab/commons/golabUtils.d.ts" />

"use strict";

namespace ut.commons.golabutils {
   "use strict";

   const leftRightPadding = 5
   const textY = 20

   function conceptView($timeout: angular.ITimeoutService) {
      return {
         restrict: "E",
         template: `
<svg xmlns="http://www.w3.org/2000/svg" class="svgConcept">
   <rect class="background" height="100%" width="100%"/>
   <text class="elementLabel" x="${leftRightPadding}" y="${textY}">{{label}}</text>
</svg>
`,
         replace: true,
         scope: {
            label: "="
         },
         link: ($scope: angular.IScope, element: angular.IAugmentedJQuery, attrs) => {
            const scope = <any>$scope
            scope.width = 100
            const text = element.find("text")
            const textElement: any = text[0]
            const updateWidth = () => {
               // console.log(`new label value: ${scope.label}`)
               const textBox = textElement.getBBox()
               // console.log(textBox)
               const newWidth = 2 * leftRightPadding + textBox.width
               element.attr("width", newWidth)
               // scope.width = newWidth
               // console.log(`set width of svg concept '${scope.label}' to ${newWidth}`)
            }
            $scope.$watch("label", (newValue, oldValue): void => {
               updateWidth()
               // $timeout seems to be needed to get it working in the report tool
               $timeout(updateWidth)
            });
         }
      }
   }

   golabUtils.directive("conceptView".toLowerCase(),
      ["$timeout", conceptView])

}
