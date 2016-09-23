"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

dummy = {
  loadDataFromJson: null
}

datastoreSelectionDirective = (localStorageService) ->
  {
    restrict: "E"
    template: """
            <table width="100%" border="0">
                <tr>
                    <td width="1%">
                        {{categoryLabel | i_g4i18n}}
                    </td>
                    <td>
                        <select ng-model="selectedCategory"
                                ng-options="category for category in dataStore.getCategories()">
                        </select>
                    </td>
                    <td rowspan='2' width="1%" valign="middle" align="right">
                      <i class="fa fa-play fa-fw activeButton fontAweSomeButton"
                              ng-class='{disabledButton:disableLoadButton}'
                                   ng-click='loadSeletedResource()'></i>
                    </td>
                </tr>
                <tr>
                    <td>
                        {{dataLabel | i_g4i18n}}
                    </td>
                    <td>
                        <select ng-model="selectedData" ng-options="data.title for data in getDatas()">
                        </select>
                    </td>
                </tr>
            </table>
            """
    replace: true
    link: (scope, element, attrs)->
      dataStoreName = ut.commons.utils.getAttributeValue(attrs, "dataStoreName")
      if (dataStoreName == null)
        throw new Error("attribute dataStoreName is not defined")
      scope.categoryLabel = "Category"
      if (attrs["categorylabel"])
        scope.categoryLabel = attrs["categorylabel"]
      scope.dataLabel = "Data"
      if (attrs["datalabel"])
        scope.dataLabel = attrs["datalabel"]
      scope.disableLoadButton = true
      uploadLoadButtonStatus = ->
        scope.disableLoadButton = !scope.selectedCategory or !scope.selectedData
      selectedCategoryStoreName = "#{dataStoreName}_selectedCategory"
      selectedDataTitleStoreName = "#{dataStoreName}_selectedDataTitle"
      if (!scope[dataStoreName])
        throw new Error("cannot find data store, named '#{dataStoreName}' on the scope")
      scope.exampleStore = scope[dataStoreName]
      scope.selectedCategory = localStorageService.get(selectedCategoryStoreName)
      scope.selectedData = ""
      categories = scope.exampleStore.getCategories()
      if (scope.selectedCategory)
        if (categories.indexOf(scope.selectedCategory) < 0)
          scope.selectedCategory = ""
      if (!scope.selectedCategory && categories.length == 1)
        scope.selectedCategory = categories[0]
      if (scope.selectedCategory)
        selectedDataTitle = localStorageService.get(selectedDataTitleStoreName)
        if (selectedDataTitle)
          selectedData = scope.exampleStore.getData(scope.selectedCategory, selectedDataTitle)
        if (!selectedData)
          datas = scope.exampleStore.getDatas(scope.selectedCategory)
          if (datas.length == 1)
            selectedData = datas[0]
        if (selectedData)
          scope.selectedData = selectedData
      else
        scope.selectedCategory = ""

      scope.getDatas = ->
        scope.exampleStore.getDatas(scope.selectedCategory)

      uploadLoadButtonStatus()
      initialized = false
      scope.$watch("selectedCategory", ->
        localStorageService.set(selectedCategoryStoreName, scope.selectedCategory)
        if (initialized)
          scope.selectedData = ""
        else
          initialized = true
        uploadLoadButtonStatus()
      )
      scope.loadSeletedResource = ->
        if (scope.selectedCategory && scope.selectedData)
          console.log("load data: category '#{scope.selectedCategory}', data '#{scope.selectedData.title}'")
          scope.exampleStore.sendLoadEvent(scope.selectedData)
      scope.$watch("selectedData", ->
        localStorageService.set(selectedDataTitleStoreName, scope.selectedData.title)
        uploadLoadButtonStatus()
      )
  }

ut.commons.golabUtils.directive("datastoreselection", ["localStorageService", datastoreSelectionDirective])


loadExampleDirective = (localStorageService, $timeout) ->
  {
    restrict: "E"
    template: """
<div>
  <table width="100%" border="0" class="selectExampleTable">
      <tr>
          <td width="1%">
              {{categoryLabel | i_g4i18n}}
          </td>
          <td>
              <select ng-model="examples.selectedCategory"
                      ng-options="category for category in exampleStore.getCategories()">
              </select>
          </td>
      </tr>
      <tr>
          <td>
              {{dataLabel | i_g4i18n}}
          </td>
          <td>
              <select ng-model="examples.selectedData" ng-options="data.title for data in getDatas()">
              </select>
          </td>
      </tr>
  </table>
  <div class="dialogButtonRow">
    <ul class="toolbar">
      <li>
         <i class="fa fa-play fa-fw activeButton fontAweSomeButton dialogButton"
          ng-class="{disabledButton: examples.selectedData==''}" ng-click='loadSelectedExample()' title="{{loadTitle}}"></i>
      </li>
      <li>
         <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton"
           ng-click='closeLoadExample()' title="{{'loadSave.showModelJsonDialog.close' | g4i18n}}"></i>
      </li>
    </ul>
  </div>
</div>
"""
    replace: true
    link: (scope, element, attrs)->
      linkFunction = ->
        exampleStoreName = ut.commons.utils.getAttributeValue(attrs, "exampleStoreName")
        if (exampleStoreName == null)
          throw new Error("attribute exampleStoreName is not defined")
        if (typeof scope[exampleStoreName] == "undefined")
          throw new Error("cannot find example store, named #{exampleStoreName}, on the scope")
        scope.exampleStore = scope[exampleStoreName]
        if (!scope.exampleStore instanceof ut.commons.DataStore)
          throw new Error("example store, named #{exampleStoreName}, is not an instance of ut.commons.DataStore")
        scope.categoryLabel = ut.commons.utils.getAttributeValue(attrs, "categoryLabel", "Category")
        scope.dataLabel = ut.commons.utils.getAttributeValue(attrs, "categoryLabel", "Data")
        scope.loadTitle = ut.commons.utils.getAttributeValue(attrs, "loadTitle", "")
        scope.disableLoadButton = true
        updateLoadButtonStatus = ->
          scope.disableLoadButton = !scope.selectedCategory or !scope.selectedData
        selectedCategoryStoreName = "#{exampleStoreName}_selectedCategory"
        selectedDataTitleStoreName = "#{exampleStoreName}_selectedDataTitle"
        scope.examples = {
          selectedCategory: localStorageService.get(selectedCategoryStoreName)
          selectedData: ""
        }
        if (!scope.exampleStore)
          # no exampleStore, so can't do anything
          return
        categories = []
        categories = scope.exampleStore.getCategories()
        if (scope.examples.selectedCategory)
          if (categories.indexOf(scope.examples.selectedCategory) < 0)
            scope.examples.selectedCategory = ""
        if (!scope.examples.selectedCategory && categories.length > 0)
          scope.examples.selectedCategory = categories[0]

        newCategorySelected = () ->
          if (scope.examples.selectedCategory)
            selectedDataTitle = localStorageService.get(selectedDataTitleStoreName)
            if (selectedDataTitle)
              selectedData = scope.exampleStore.getData(scope.examples.selectedCategory, selectedDataTitle)
            if (!selectedData)
              datas = scope.exampleStore.getDatas(scope.examples.selectedCategory)
              if (datas.length > 0)
                selectedData = datas[0]
            if (selectedData)
              scope.examples.selectedData = selectedData
          else
            scope.examples.selectedCategory = ""

        newCategorySelected()

        scope.getDatas = ->
          scope.exampleStore?.getDatas(scope.examples.selectedCategory)

        updateLoadButtonStatus()
        initialized = false
        scope.$watch("examples.selectedCategory", ->
          localStorageService.set(selectedCategoryStoreName, scope.examples.selectedCategory)
          if (initialized)
            scope.examples.selectedData = ""
          else
            initialized = true
          newCategorySelected()
          updateLoadButtonStatus()
        )
        scope.loadSelectedExample = ->
          if (scope.examples.selectedCategory && scope.examples.selectedData)
#        console.log("load data: category '#{scope.examples.selectedCategory}', data '#{scope.examples.selectedData.title}'")
            if (scope.loadExampleResource)
              scope.closeLoadExample()
              scope.loadExampleResource(scope.examples.selectedData)
        #        scope.exampleStore.sendLoadEvent(scope.selectedData)
        scope.$watch("examples.selectedData", ->
          localStorageService.set(selectedDataTitleStoreName, scope.examples.selectedData.title)
          updateLoadButtonStatus()
        )

        scope.closeLoadExample = ->
          dialogBoxId = ut.commons.utils.getAttributeValue(attrs, "dialogId", "")
          if (dialogBoxId)
            scope.dialogBoxes[dialogBoxId].close()
          else
            console.warn("cannot find attribute dialogId")
      $timeout(->
        $timeout(linkFunction)
      )
  }

ut.commons.golabUtils.directive("loadExample".toLowerCase(), ["localStorageService", "$timeout"
  loadExampleDirective])
