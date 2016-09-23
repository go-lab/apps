"use strict";

goLabNicknameName = "goLabNickName"

loginApp = angular.module("loginApp", [])

keyCodes = {
  esc: 27,
  space: 32,
  enter: 13,
  tab: 9,
  backspace: 8,
  shift: 16,
  ctrl: 17,
  alt: 18,
  capslock: 20,
  numlock: 144
}

defineKeyDirective = (app, label,  keyCode)->
  app.directive(label, ->
    {
    restrict: "A"
    link: (scope, element, attrs)->
      element.bind("keypress", (event)->
        if (event.which==keyCode)
          scope.$apply(->
            scope.$eval(attrs[label], {"event": event})
          )
      )
    }
  )

defineKeyDirective(loginApp, "ngEnter", keyCodes.enter)

loginApp.controller("loginCtrl", ["$scope", "$timeout", ($scope, $timeout)->
  $scope.errorMessage = ""
  $scope.newNickname = ""
  $scope.nickName = localStorage.getItem(goLabNicknameName)
  if ($scope.nickName)
    $scope.newNickname = $scope.nickName
  $scope.$watch("newNickname", ->
    $scope.trimmedName = $scope.newNickname.trim()
    $scope.allowLogin = $scope.newNickname.length >= 2
  )
  $scope.login = ->
    localStorage.setItem(goLabNicknameName, $scope.trimmedName)
    $scope.nickName = localStorage.getItem(goLabNicknameName)
    $scope.newNickname = ""
    $timeout(->
      $scope.newNickname = $scope.nickName
    )

  $scope.logout = ->
    localStorage.removeItem(goLabNicknameName)
    $scope.nickName = ""
])

loginApp.directive("login", ->
  {
  restrict: "E"
  template: """
<div>
  <div>
    <h2>Please enter your nickname</h2>
  </div>
  <table>
      <tr>
          <td><input ng-model="newNickname" ng-enter="login()" placeholder='nickname' ng-disabled='nickName'></td>
      </tr>
      <tr>
          <td>&nbsp;</td>
      </tr>
      <tr>
          <td align="right">
            <button ng-click="logout()" ng ng-disabled="!nickName">Logout</button>
            <button ng-click="login()" ng ng-disabled="!allowLogin || nickName">Login</button>
          </td>
      </tr>
  </table>
</div>
"""
  replace: true
  link: (scope, element, attr)->

  }
)

loginApp.directive("loggedIn".toLowerCase(), ->
  {
  restrict: "E"
  template: """
<div ng-show="nickName">
    <div ng-transclude></div>
</div>
"""
  replace: true
  transclude: true
  link: (scope, element, attr)->

  }
)