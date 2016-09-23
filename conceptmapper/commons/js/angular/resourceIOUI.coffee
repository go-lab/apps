"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

angular = window.angular

dummy = {
  objectType: null
  loadResource: null
  storageHandler: null
}

sortDirectionDirective = ->
  {
    restrict: "E"
    template: """
<span ng-show="showSorted">
   <i class="fa fa-sort-asc fa-fw fontAweSomeButtonSmall" ng-show="!sort.descending"></i>
   <i class="fa fa-sort-desc fa-fw fontAweSomeButtonSmall" ng-show="sort.descending"></i>
</span>
"""
    replace: true
    scope: true
    link: (scope, element, attrs)->
      columnTitle = attrs["column"]
      scope.$watch("sort.column", (newColumn)->
        scope.showSorted = columnTitle==newColumn
      )
  }

ut.commons.golabUtils.directive("sortedDirection".toLowerCase(), [sortDirectionDirective])


resourcesListDirective = ($timeout)->
  {
  restrict: "E"
  template: """
<table class="resourceTable">
  <tbody>
    <tr class="resourceTableHeader">
      <th ng-click="changeSorting('title')">
        {{ titleLabel | i_g4i18n}} <sortedDirection column="title"></sortedDirection>
      </th>
      <th ng-click="changeSorting('type')" ng-if="showType">
        {{ typeLabel | i_g4i18n}} <sortedDirection column="type"></sortedDirection>
      </th>
      <th ng-click="changeSorting('tool')">
        {{ toolLabel | i_g4i18n}} <sortedDirection column="tool"></sortedDirection>
      </th>
      <th ng-click="changeSorting('author')" ng-if="showAuthor">
        {{ authorLabel | i_g4i18n}} <sortedDirection column="author"></sortedDirection>
      </th>
      <th ng-click="changeSorting('modified')">
        {{ dateLabel | i_g4i18n}} <sortedDirection column="modified"></sortedDirection>
      </th>
    </tr>
    <tr ng-repeat="resourceDescription in resourceDescriptions | orderBy:sort.column:sort.descending"
        class="resourceTableRow" ng-class="{resourceTableRowSelected:isSelected(resourceDescription.id)}"
        ng-click="resourceSelected(resourceDescription.id, resourceDescription.title)"
        ng-dblclick="loadResourceDirect(resourceDescription.id, resourceDescription.title)">
      <td>{{resourceDescription.title}}</td>
      <td class="noWrap" ng-if="showType">{{"resources.type.name." + resourceDescription.type | g4i18n}}</td>
      <td class="noWrap">{{"tools.name." + resourceDescription.tool | g4i18n}}</td>
      <td class="noWrap" ng-if="showAuthor">{{resourceDescription.author}}</td>
      <td class="noWrap">{{resourceDescription.modified | date:"dd MMM yy, H:mm:ss "}}</td>
    </tr>
  </tbody>
</table>
"""
  replace: true
  scope: true
  link: (scope, element, attrs)->
    scope.hideContent = attrs["hidecontent"]=="true"
    $timeout(->
      if (!scope.sort)
        scope.sort = {
        column: "title"
        descending: false
        }
    , 0)
    scope.changeSorting = (newColumn)->
      if (scope.sort.column==newColumn)
        scope.sort.descending = !scope.sort.descending
      else
        scope.sort.column = newColumn
        scope.sort.descending = false
  }

ut.commons.golabUtils.directive("resourcesList".toLowerCase(), ["$timeout", resourcesListDirective])


resourceSelectionDirective = (languageHandler)->
  {
  restrict: "E"
  template: """
<div style="relative">
  <div class="resourceTableContent">
    <resourcesList></resourcesList>
  </div>
  <div class="resourceTableHeader">
    <resourcesList hideContent="true"></resourcesList>
  </div>
  <div class="pleaseWaitIcon" style="display: block" ng-show="retrievingResourceList"></div>
  <div class="dialogButtonRow">
    <ul class="toolbar">
      <li>
         <i class="fa fa-refresh fa-fw activeButton fontAweSomeButton dialogButton" ng-click='reload()'
          title="{{reloadTitle}}"></i>
      </li>
      <li>
         <i class="fa fa-play fa-fw activeButton fontAweSomeButton dialogButton"
          ng-class="{disabledButton: selectedResourceId==''}" ng-click='load()' title="{{loadTitle}}"></i>
      </li>
      <li>
         <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton" ng-click='cancel()'
           title="{{cancelTitle}}"></i>
      </li>
    </ul>
  </div>
</div>
"""
  replace: true
  link: (scope, element, attrs)->
    i18nBaseKey = ""
    if (attrs["g4i18nbasekey"])
      i18nBaseKey = attrs["g4i18nbasekey"]
    if (i18nBaseKey)
      scope.titleLabel = "i_#{i18nBaseKey}.title"
      scope.typeLabel = "i_#{i18nBaseKey}.type"
      scope.toolLabel = "i_#{i18nBaseKey}.tool"
      scope.authorLabel = "i_#{i18nBaseKey}.author"
      scope.dateLabel = "i_#{i18nBaseKey}.date"
    else
      scope.titleLabel = "title"
      scope.typeLabel = "type"
      scope.toolLabel = "tool"
      scope.authorLabel = "author"
      scope.dateLabel = "date"
    getResourceType = ->
      resourceType = ""
      if (attrs["resourcetype"])
        resourceType = attrs["resourcetype"]
      resourceType

    scope.reloadTitle = languageHandler.getMessage("loadSave.loadDialog.update")
    scope.loadTitle = languageHandler.getMessage("loadSave.loadDialog.loadSelected", "")
    scope.cancelTitle = languageHandler.getMessage("loadSave.loadDialog.cancel")
    scope.elem = element
    scope.retrievingResourceList = false
    scope.resourceDescriptions = []
    scope.selectedResourceId = ""
    scope.sort = {
      column: "title"
      descending: false
    }
    updateResourceList = (metadatas)->
      resourceType = getResourceType()
      scope.resourceDescriptions = for id,onlyMetadata of metadatas
        scope.storageHandler.getResourceDescription(onlyMetadata)
      scope.retrievingResourceList = false
#      console.log("found #{scope.resourceDescriptions.length} #{resourceType}")
      scope.$apply()

    updateResources = ->
      scope.retrievingResourceList = true
      scope.storageHandler.listResourceMetaDatas((error, onlyMetadatas)->
        if (error)
          alert("Problems with getting the list of resources:\n#{error}")
          scope.retrievingResourceList = false
        else
          updateResourceList(onlyMetadatas)
#          setTimeout(->
#            updateResourceList(onlyMetadatas)
#          , 2000)
      )

    scope.$watch("dialogBoxChangeCounter", () ->
      if (element.is(':visible'))
        updateResources()
    )

    scope.reload = ->
      updateResources()
    scope.load = ->
      if (scope.selectedResourceId && scope.loadResource)
#        console.log("should now load #{scope.selectedResourceId}")
        scope.storageHandler.readResource(scope.selectedResourceId, (error, resource)->
          if (error)
            alert("Problems with reading the resource, with id #{scope.selectedResourceId}:\n#{error}")
          else
            if (resource)
              scope.loadResource(resource)
        )
    scope.isSelected = (id) ->
      scope.selectedResourceId == id
    scope.resourceSelected = (id) ->
#      console.log("resourceSelected(#{id})")
      scope.selectedResourceId = id
    scope.loadResourceDirect = (id) ->
#      console.log("loadResourceDirect(#{id})")
      scope.selectedResourceId = id
      scope.load()
  }

ut.commons.golabUtils.directive("resourceSelection".toLowerCase(), ["languageHandler", resourceSelectionDirective])


resourceNameIdCounter = 0

resourceNameDirective = (languageHandler)->
  {
  restrict: "E"
  template: """
<div style="relative">
  <div class="resourceTableContent">
    <resourcesList></resourcesList>
  </div>
  <div class="resourceTableHeader">
    <resourcesList hideContent="true"></resourcesList>
  </div>
  <div class="pleaseWaitIcon" style="display: block" ng-show="retrievingResourceList"></div>
  <input ng-model="resource.name" ng-enter="save()"class="questionInput"/>
  <div class="dialogButtonRow">
    <ul class="toolbar">
      <li>
         <i class="fa fa-refresh fa-fw activeButton fontAweSomeButton dialogButton" ng-click='reload()'
          title="{{reloadTitle}}"></i>
      </li>
      <li>
         <i class="fa fa-play fa-fw activeButton fontAweSomeButton dialogButton"
          ng-class="{disabledButton: resource.name==''}" ng-click='save()' title="{{saveTitle}}"></i>
      </li>
      <li>
         <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton" ng-click='cancel()'
           title="{{cancelTitle}}"></i>
      </li>
    </ul>
  </div>
  <dialogBox id="{{replaceDialogId}}" title="{{replaceDialogTitle}}" icon='warning' resizable="false" width="400">
    <askQuestion ok="i_loadSave.replaceResourceDialog.replace" cancel="i_loadSave.replaceResourceDialog.cancel"></askQuestion>
  </dialogBox>
</div>
"""
  replace: true
  link: (scope, element, attrs)->
    id = resourceNameIdCounter++
    replaceDialogId = "replaceDialogBox#{id}"
    scope.replaceDialogId = replaceDialogId
    i18nBaseKey = ""
    if (attrs["g4i18nbasekey"])
      i18nBaseKey = attrs["g4i18nbasekey"]
    if (i18nBaseKey)
      scope.titleLabel = "i_#{i18nBaseKey}.title"
      scope.typeLabel = "i_#{i18nBaseKey}.type"
      scope.toolLabel = "i_#{i18nBaseKey}.tool"
      scope.authorLabel = "i_#{i18nBaseKey}.author"
      scope.dateLabel = "i_#{i18nBaseKey}.date"
    else
      scope.titleLabel = "title"
      scope.typeLabel = "type"
      scope.toolLabel = "tool"
      scope.authorLabel = "author"
      scope.dateLabel = "date"
    getResourceType = ->
      resourceType = ""
      if (attrs["resourcetype"])
        resourceType = attrs["resourcetype"]
      resourceType

    scope.reloadTitle = languageHandler.getMessage("loadSave.loadDialog.update")
    scope.saveTitle = languageHandler.getMessage("loadSave.saveDialog.saveResource", "")
    scope.cancelTitle = languageHandler.getMessage("loadSave.loadDialog.cancel")
    scope.replaceDialogTitle = languageHandler.getMessage("loadSave.replaceResourceDialog.dialogTitle")
    scope.elem = element
    scope.retrievingResourceList = false
    scope.resourceDescriptions = []
    scope.selectedResourceId = ""
    scope.sort = {
      column: "title"
      descending: false
    }
    updateResourceList = (metadatas)->
      resourceType = getResourceType()
      scope.resourceDescriptions = for id,onlyMetadata of metadatas
        scope.storageHandler.getResourceDescription(onlyMetadata)
      scope.retrievingResourceList = false
#      console.log("found #{scope.resourceDescriptions.length} #{resourceType}")
      scope.loadTitle = languageHandler.getMessage("loadSave.loadDialog.loadSelected", resourceType)
      scope.$apply()

    updateResources = (callback)->
      scope.retrievingResourceList = true
#      console.log("retrieving resources of type #{scope.storageHandler.metadataHandler.getTarget().objectType}")
      scope.storageHandler.listResourceMetaDatas((error, onlyMetadatas)->
        if (error)
          alert("Problems with getting the list of resources:\n#{error}")
          scope.retrievingResourceList = false
        else
          updateResourceList(onlyMetadatas)
          if (callback)
            callback(onlyMetadatas)
#          setTimeout(->
#            updateResourceList(onlyMetadatas)
#          , 2000)
      )

    scope.$watch("dialogBoxChangeCounter", () ->
      if (element.is(':visible'))
        updateResources()
    )

    scope.reload = ->
      updateResources()
    scope.save = ->
      resourceName = if (scope.resource.name)
        resourceName = scope.resource.name.trim()
      else
        ""
      if (scope.saveAs && resourceName)
        updateResources((metadatas)->
          metadataWithSameName = null
          resourceNameLc = resourceName.toLowerCase()
          for id,metadata of metadatas when metadata.metadata.target.displayName.toLowerCase()==resourceNameLc
            metadataWithSameName = metadata.metadata
          if (metadataWithSameName)
            scope.askQuestion.questionParams = {
              question: languageHandler.getMessage("loadSave.replaceResourceDialog.question",
                metadataWithSameName.target.displayName)
              answer: null
              dialogBoxId: replaceDialogId
              questionOkAnswer: ()->
                scope.saveAs(resourceName, metadataWithSameName)
            }
            scope.dialogBoxes[replaceDialogId].show()
          else
            scope.saveAs(resourceName, null)
        )
    scope.resourceSelected = (id, name) ->
#      console.log("resourceSelected(#{id})")
      scope.selectedResourceId = id
      scope.resource.name = name
    scope.loadResourceDirect = (id, name) ->
##      console.log("loadResourceDirect(#{id})")
#      scope.selectedResourceId = id
#      scope.load()
  }

ut.commons.golabUtils.directive("resourceName".toLowerCase(), ["languageHandler", resourceNameDirective])
