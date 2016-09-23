"use strict";

window.ut = window.ut || {}
ut.commons = ut.commons || {}

editConfigurationIdCounter = 0

editConfigurationDirective = (languageHandler) ->
  {
    restrict: "E"
    template: """
<span>
  <li ng-show="showEditConfiguration">
    <i class="fa fa-gear fa-fw activeButton fontAweSomeButton" ng-click='editConfiguration($event)'
      title="{{'editConfiguration.openButton.tooltip' | g4i18n}}"></i>
  </li>
  <dialogBox id="{{editConfigurationDialogId}}" title="{{editConfigurationDialogTitle}}" icon="gear"
    resizable="false" width="100%" maxWidth="700px">
    <div class="golabConfigurationEditor">
      <div ng-transclude></div>
      <configurationSection label="i_editConfiguration.helpHtml">
        <div class="row">
          <div class="col-md-12">
            <div class="col-md-6" style="padding-left: 0px;">
              <span class="configurationFaRadioButton" ng-click='configurationModel.useConfigurationHelp = false'
                title="{{'editConfiguration.useStandardToolHelp.tooltip' | g4i18n}}">
                <i class="fa fa-dot-circle-o fa-fw" ng-hide="configurationModel.useConfigurationHelp"></i>
                <i class="fa fa-circle-o fa-fw" ng-show="configurationModel.useConfigurationHelp"></i>
              </span>
              <span g4i18n="editConfiguration.useStandardToolHelp"
                title="{{'editConfiguration.useStandardToolHelp.tooltip' | g4i18n}}"></span>
            </div>
            <div class="col-md-6">
              <span class="configurationFaRadioButton" ng-click='configurationModel.useConfigurationHelp = true'
                title="{{'editConfiguration.useMyOwnToolHelp.tooltip' | g4i18n}}">
                <i class="fa fa-dot-circle-o fa-fw" ng-show="configurationModel.useConfigurationHelp" ></i>
                <i class="fa fa-circle-o fa-fw" ng-hide="configurationModel.useConfigurationHelp"></i>
              </span>
              <span g4i18n="editConfiguration.useMyOwnToolHelp"
                title="{{'editConfiguration.useMyOwnToolHelp.tooltip' | g4i18n}}"></span>
            </div>
          </div>
          <div class="col-md-12" style="height: 0.4em;"></div>
          <div class="col-md-12" ng-hide="configurationModel.useConfigurationHelp">
            <div class="helpPreview" ng-bind-html="configurationModel.standardHelpHtml"></div>
          </div>
          <div class="col-md-12" ng-show="configurationModel.useConfigurationHelp">
            <text-angular class="helpHtmlEditor" ng-model="configurationModel.helpHtml"></text-angular>
          </div>
        </div>
      </configurationSection>
      <configurationSection label="i_editConfiguration.specialLanguageTerms" ng-show="advancedConfigurationOptions">
        <languageTermsEditor></languageTermsEditor>
      </configurationSection>
      <configurationSection label="i_editConfiguration.debugOptions" ng-show="advancedConfigurationOptions">
        <div class="row evenColumnBackground">
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.autoLoadLatestResource"/>
            <span g4i18n="editConfiguration.autoLoadLatestResource"
              title="{{'editConfiguration.autoLoadLatestResource.tooltip' | g4i18n}}"></span>
          </div>
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.autoSave"/>
            <span g4i18n="editConfiguration.autoSave"
              title="{{'editConfiguration.autoSave.tooltip' | g4i18n}}"></span>
          </div>
        </div>
        <div class="row oddColumnBackground">
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.multiDocumentMode"/>
            <span g4i18n="editConfiguration.multiDocumentMode"
              title="{{'editConfiguration.multiDocumentMode.tooltip' | g4i18n}}"></span>
          </div>
        </div>
        <div class="row evenColumnBackground configurationHighInputRow">
          <div class="col-md-6" g4i18n="editConfiguration.defaultResourceName"
            title="{{'editConfiguration.defaultResourceName.tooltip' | g4i18n}}"></div>
          <div class="col-md-5"><input type="text" ng-model="configurationModel.defaultResourceName"
            class="configurationTextInput"/></div>
        </div>
        <div class="row oddColumnBackground">
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.loadInitialResource"/>
            <span g4i18n="editConfiguration.loadInitialResource"
              title="{{'editConfiguration.loadInitialResource.tooltip' | g4i18n}}"></span>
          </div>
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.authoringMode"
              ng-disabled='!configurationModel.applicationModel' />
            <span g4i18n="editConfiguration.authoringMode"
              title="{{'editConfiguration.authoringMode.tooltip' | g4i18n}}"></span>
          </div>
        </div>
        <div class="row evenColumnBackground">
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.showLoadExamples">
            <span g4i18n="editConfiguration.showLoadExamples"
              title="{{'editConfiguration.showLoadExamples.tooltip' | g4i18n}}"></span>
          </div>
        </div>
        <div class="row oddColumnBackground">
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.showLoadConfiguration">
            <span g4i18n="editConfiguration.showLoadConfiguration"
              title="{{'editConfiguration.showLoadConfiguration.tooltip' | g4i18n}}"></span>
          </div>
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.showResourceName"/>
            <span g4i18n="editConfiguration.showResourceName"
              title="{{'editConfiguration.showResourceName.tooltip' | g4i18n}}"></span>
          </div>
        </div>
        <div class="row evenColumnBackground">
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.showImportExport"/>
            <span g4i18n="editConfiguration.showImportExport"
              title="{{'editConfiguration.showImportExport.tooltip' | g4i18n}}"></span>
          </div>
          <div class="col-md-6">
            <input type="checkbox" class="configurationCheckbox" ng-model="configurationModel.showModelJson"/>
            <span g4i18n="editConfiguration.showModelJson"
              title="{{'editConfiguration.showModelJson.tooltip' | g4i18n}}"></span>
          </div>
        </div>
        <div class="row oddColumnBackground configurationHighInputRow">
          <div class="col-md-6" g4i18n="editConfiguration.collaborationStartupOption"
            title="{{'editConfiguration.collaborationStartupOption.tooltip' | g4i18n}}"></div>
          <div class="col-md-6">
             <select ng-model="configuration.collaborationStartup"
               ng-options="collaborationStartupOption.label for collaborationStartupOption in configuration.collaborationStartupOptions"
             />
          </div>
        </div>
      </configurationSection>
    </div>
    <div class="dialogButtonRow">
      <toolbar>
        <loadSave modelName="configurationModel" dataStoreName="{{configurationExampleStoreName}}" examples="true" XautoSave="false" single="true" clear="false" reset="false"></loadSave>
        <li class="toolBarSpace"></li>
        <li>
           <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton" ng-click='cancel()'
             title="{{'editConfiguration.close' | g4i18n}}"></i>
        </li>
      </toolbar>
    </div>
  </dialogBox>
</span>
"""
    replace: true
    transclude: true
    link: (scope, element, attrs)->
      id = editConfigurationIdCounter++
      editConfigurationDialogId = "editConfigurationDialogBox#{id}"
      scope.editConfigurationDialogId = editConfigurationDialogId
      scope.advancedConfigurationOptions = false

      if (!scope["configurationModel"])
        console.error("the configuration model must be defined on the scope with name configurationModel")
        return
      configurationModel = scope["configurationModel"]
      if (!configurationModel instanceof window.ut.commons.ConfigurationModel)
        console.error("expected to find a configuration model class object on the scope, which must be an instance of window.ut.commons.ConfigurationModel")
        return

      scope.toggleUseConfigurationHelp = ()->
        configurationModel.useConfigurationHelp = !configurationModel.useConfigurationHelp

      scope.configurationExampleStoreName = ""
      configurationExampleStoreName = ut.commons.utils.getAttributeValue(attrs, "dataStoreName", "")
      if (configurationExampleStoreName)
        if (scope[configurationExampleStoreName])
          scope.configurationExampleStoreName = configurationExampleStoreName

      collaborationStartupOptions = for collaborationStartupOption in configurationModel.collaborationStartupOptions
        {
          value: collaborationStartupOption
          label: languageHandler.getMessage("editConfiguration.collaborationStartupOptions.#{collaborationStartupOption}")
        }
      scope.configuration = {
        collaborationStartupOptions: collaborationStartupOptions
      }
      updateCollaborationStartupFromModel = ->
        for collaborationStartupOption in collaborationStartupOptions when collaborationStartupOption.value == configurationModel.collaborationStartup
          scope.configuration.collaborationStartup = collaborationStartupOption

      scope.$watch("configuration.collaborationStartup", (newValue, oldValue)->
        configurationModel.collaborationStartup = newValue.value
      )

      updateState = ->
#      console.log("cfg: updateState, displayName: #{configurationModel.getDisplayName()}")
        scope.showEditConfiguration = configurationModel.getShowLoadConfiguration() || configurationModel.getForceShowLoadConfiguration()
        scope.editConfigurationDialogTitle = languageHandler.getMessage("editConfiguration.dialogTitle", configurationModel.getDisplayName())
        updateCollaborationStartupFromModel()

      updateState()
      setTimeout(->
        configurationModel.addListeners(["modelChanged", "modelLoaded", "modelCleared", "displayNameChanged"], ->
          updateState()
          false
        )
        updateState()
      )
      scope.storageHandler = configurationModel.getStorageHandler()

      scope.loadResource = (resource) ->
        scope.cancel()
        configurationModel.loadFromResource(resource)

      scope.cancel = () ->
        scope.dialogBoxes[editConfigurationDialogId].close()

      scope.editConfiguration = (event)->
        scope.advancedConfigurationOptions = (event.ctrlKey || event.altKey) && event.shiftKey
        scope.dialogBoxes[editConfigurationDialogId].show()

  }

ut.commons.golabUtils.directive("editConfiguration".toLowerCase(), ["languageHandler",
  editConfigurationDirective])


configurationSection = (configurationModel, languageHandler, $timeout)->
  {
    restrict: "E"
    template: """
<div class="test">
  <div class="row">
    <div class="col-md-12 configurationSectionTitle" ng-class="{firstConfigurationSectionTitle: firstSection}">
      <i class="fa fa-chevron-right fa-fw activeButton fontAweSomeButtonSmall" ng-hide="sectionShown"
       ng-click="showSection()" title="{{'editConfiguration.showSection.tooltip' | g4i18n}}"></i>
      <i class="fa fa-chevron-down fa-fw activeButton fontAweSomeButtonSmall" ng-show="sectionShown"
       ng-click="hideSection()" title="{{'editConfiguration.hideSection.tooltip' | g4i18n}}"></i>
      <span class="secondaryTextButton" ng-click='showHideSection()'>{{title}}</span>
    </div>
  </div>
  <div ng-transclude ng-show='sectionShown' class="configurationSectionContent"></div>
</div>

"""
    replace: false
    transclude: true
    scope: true
#  scope: {
#    title: "&"
#  }
    link: (scope, element, attrs)->
      scope.firstSection = ut.commons.utils.getBooleanAttributeValue(attrs, "firstSection", false)
      titleKey = ut.commons.utils.getAttributeValue(attrs, "label", "???")
      scope.title = languageHandler.getI_Message(titleKey)
      scope.sectionShown = false
      configKey = titleKey.replace(/\./g, "_")
      configurationModel = scope["configurationModel"]
      createShowHideSections = ->
        if (!configurationModel.configUISettings.showHideSections)
          configurationModel.configUISettings.showHideSections = {}
      loadInitialShowHide = ->
        createShowHideSections()
        if (typeof configurationModel.configUISettings.showHideSections[configKey] == "boolean")
          scope.sectionShown = configurationModel.configUISettings.showHideSections[configKey]
      configurationModel.addListeners(["modelLoaded"], ->
        loadInitialShowHide()
      )
      updateStoredShowHide = ->
        createShowHideSections()
        configurationModel.configUISettings.showHideSections[configKey] = scope.sectionShown
      scope.showSection = ->
        scope.sectionShown = true
        updateStoredShowHide()
        $timeout(->
          configurationSectionContent = element.find(".configurationSectionContent")
          configurationSectionContent = element.find(".test")
          ut.commons.utils.scrollVerticalToVisible(configurationSectionContent)
        )
        ut.commons.utils.gadgetResize()
      scope.hideSection = ->
        scope.sectionShown = false
        updateStoredShowHide()
        ut.commons.utils.gadgetResize()
      scope.showHideSection = ->
        if (scope.sectionShown)
          scope.hideSection()
        else
          scope.showSection()
  }

ut.commons.golabUtils.directive("configurationSection".toLowerCase(),
  ["configurationModel", "languageHandler", "$timeout", configurationSection])

dummy = {
  originalEvent: {}
  selectedIndexChanged: {}
}

nameListEditor = (configurationModel, languageHandler, $timeout)->
  {
    restrict: "E"
    template: """
<div>
  <div class="row configurationOptionTitle nameListTitle">
    <span class="col-md-6 nameListEditorTitle">{{title}}</span>
    <span class="col-md-6 nameListControls">
      <i class="fa fa-plus fa-fw activeButton fontAweSomeButtonSmall"
       ng-click="addName()" title="{{'editConfiguration.nameListEditor.addName.tooltip' | g4i18n}}"></i>
      <i class="fa fa-minus fa-fw activeButton fontAweSomeButtonSmall" ng-class='{disabledButton: selection.index<0}'
       ng-click="removeName($event)" title="{{'editConfiguration.nameListEditor.removeName.tooltip' | g4i18n}}"></i>
      <i class="fa fa-arrow-up fa-fw activeButton fontAweSomeButtonSmall" ng-class='{disabledButton: !selection.canMoveUp}'
       ng-click="moveSelectionUp()" title="{{'editConfiguration.nameListEditor.moveSelectionUp.tooltip' | g4i18n}}"></i>
      <i class="fa fa-arrow-down fa-fw activeButton fontAweSomeButtonSmall" ng-class='{disabledButton: !selection.canMoveDown}'
       ng-click="moveSelectionDown()" title="{{'editConfiguration.nameListEditor.moveSelectionDown.tooltip' | g4i18n}}"></i>
    </span>
  </div>
  <div ng-repeat='name in nameList.getNameValues(false) track by $index' class="row">
    <nameEditor index="{{$index}}" class="col-md-12 nameEditor{{$index}}" ng-class="{selectedNameEditor: $index==selection.index}"></nameEditor>
  </div>
</div>

"""
    replace: true
    scope: {
      nameList: "=nameList".toLowerCase()
    }
    link: (scope, element, attrs)->
      if (!(scope.nameList instanceof window.ut.commons.NamedEventArray))
        throw new Error("the attribute nameList does not return an instance of window.ut.commons.NamedEventArray ")
      scope.title = languageHandler.getMessage(ut.commons.utils.getAttributeValue(attrs, "label", ""))
      scope.selection = {
        index: -1
        canMoveUp: false
        canMoveDown: false
      }
      scope.$watch("selection.index", (newIndex)->
        if (scope.$parent.selectedIndexChanged)
          scope.$parent.selectedIndexChanged(newIndex)
      )
      lastClickMillis = Date.now()
      isFirstClickOfMultiClick = (event)->
# most browsers support event.originalEvent.detail, 1: click, 2: double-click, 3: triple click, etc
# but IE does not support it, it is luckily decent enough to always return 0
        if (event.originalEvent.detail > 0)
          event.originalEvent.detail == 1
        else
          millisSinceLastClick = event.timeStamp - lastClickMillis
          lastClickMillis = event.timeStamp
          millisSinceLastClick > 300

      scope.addName = ->
        scope.nameList.addNewName()
        $timeout(->
          newNameEditor = element.find(".nameEditor:last")
          #        console.log(newNameEditor)
          #        ut.commons.utils.scrollVerticalToVisible(newNameEditor)
          newNameEditor.find("input:first").focus()
        )
      scope.removeName = (event)->
#      console.log("removeName: #{scope.selection.index}, eventPhase: #{event.originalEvent.detail}")
#      console.log(event)
        if (scope.selection.index >= 0 && isFirstClickOfMultiClick(event))
          scope.nameList.remove(scope.selection.index)
          scope.changeSelection(scope.selection.index)

      scope.changeSelection = (index) ->
        if (index >= scope.nameList.length - 1)
          index = scope.nameList.length - 1
        if (scope.selection.index != index)
          scope.selection.index = index
          if (index >= 0)
            scope.selection.canMoveUp = index > 0
            scope.selection.canMoveDown = index < scope.nameList.length - 1
          else
            scope.selection.canMoveUp = false
            scope.selection.canMoveDown = false
          focusSelection()
      #      console.log("new selected: #{scope.selection.index}, canMoveUp: #{scope.selection.canMoveUp}, canMoveDown: #{scope.selection.canMoveDown}")

      focusSelection = ()->
        if (scope.selection.index >= 0)
          $timeout(->
            nameEditor = element.find(".nameEditor#{scope.selection.index}")
            nameEditor.find("input:first").focus()
          , 0)

      scope.moveSelectionUp = ->
        index = scope.selection.index
        if (index > 0)
          scope.nameList.swapValues(index - 1, index)
          scope.changeSelection(index - 1)

      scope.moveSelectionDown = ->
        index = scope.selection.index
        if (index < scope.nameList.length - 1)
          scope.nameList.swapValues(index, index + 1)
          scope.changeSelection(index + 1)

      scope.enterAction = (nameEditorIndex)->
#      console.log("typed enter in name editor #{nameEditorIndex}")
        nextNameEditorIndex = nameEditorIndex + 1
        if (nextNameEditorIndex >= scope.nameList.length)
          if (scope.nameList.getNameValue(nameEditorIndex).length > 0)
            scope.addName()
        scope.changeSelection(nextNameEditorIndex)

  }

ut.commons.golabUtils.directive("nameListEditor".toLowerCase(),
  ["configurationModel", "languageHandler", "$timeout", nameListEditor])

nameEditor = (configurationModel)->
  {
    restrict: "E"
    template: """
<div>
  <div class="nameEditor">
    <input ng-model="name" ng-focus='focused()' ng-blur='blurred()' ng-enter="typedEnter()"
      ng-up-arrow='typedUpArrow()' ng-down-arrow='typedDownArrow()'>
  </div>
</div>

"""
    replace: true
    link: (scope, element, attrs)->
      index = ut.commons.utils.getIntegerAttributeValue(attrs, "index", 0)
      scope.index = index
      scope.name = scope.nameList.getNameValue(index)
      scope.focused = ->
        scope.changeSelection(index)

      preBlurredValue = scope.name
      scope.blurred = ->
        if (preBlurredValue != scope.name)
# index might have been changed, due to delete actions, so get it again
          index = ut.commons.utils.getIntegerAttributeValue(attrs, "index", 0)
          if (scope.nameList.getNameValue(index) != scope.name)
            scope.nameList.setNameValue(index, scope.name)
          #          console.log("change name value for index #{index} from #{preBlurredValue} to #{scope.name}")
          preBlurredValue = scope.name

      scope.typedEnter = ->
        scope.blurred()
        scope.enterAction(index)
      #      console.log("typed enter in name editor #{index}")

      scope.typedUpArrow = ->
        scope.blurred()
        scope.moveSelectionUp()

      scope.typedDownArrow = ->
        scope.blurred()
        scope.moveSelectionDown()
  }

ut.commons.golabUtils.directive("nameEditor".toLowerCase(), ["configurationModel", nameEditor])


languageTermsEditor = (configurationModel, languageHandler, $timeout)->
  {
    restrict: "E"
    template: """
<div>
  <div ng-repeat='updateableLanguageTerm in updateableLanguageTerms'>
    <languageTermEditor></languageTermEditor>
  </div>
</div>

"""
    replace: true
    scope: {
      nameList: "=nameList".toLowerCase()
    }
    link: (scope, element, attrs)->
      scope.updateableLanguageTerms = []
      findUpdateableLanguageTerms = ->
        updateableLanguageKeyMap = {}
        updateableElements = $("[g4i18n]")
        $.each(updateableElements, (index) ->
          updateableElement = $(updateableElements[index])
          languageKey = updateableElement.attr('g4i18n')
          if (languageKey)
            updateableLanguageKeyMap[languageKey] = true
        )
        updateableLanguageTerms = for key, value of updateableLanguageKeyMap
          {
            key: key
            value: languageHandler.getMsg(key)
            newValue: configurationModel.getSpecialLanguageTermValue(key)
          }
#        console.log("found terms")
#        console.log(JSON.stringify(scope.updateableLanguageTerms))
        updateableLanguageTerms.sort((languageTerm1, languageTerm2) ->
          if (languageTerm1.key < languageTerm2.key)
            -1
          else if (languageTerm1.key > languageTerm2.key)
            1
          else
            0
        )
        if (scope.updateableLanguageTerms.length > 0)
          # try to reused existing updateableLanguageTerms, to prevent unnecessary refreshes
          updateableLanguageTermsMap = {}
          for updateableLanguageTerm in scope.updateableLanguageTerms
            updateableLanguageTermsMap[updateableLanguageTerm.key] = updateableLanguageTerm
          for i in [0...updateableLanguageTerms.length]
            updateableLanguageTerm = updateableLanguageTerms[i]
            if (updateableLanguageTermsMap[updateableLanguageTerm.key])
              updateableLanguageTermsMap[updateableLanguageTerm.key].newValue = updateableLanguageTerms[i].newValue
              updateableLanguageTerms[i] = updateableLanguageTermsMap[updateableLanguageTerm.key]
        scope.updateableLanguageTerms = updateableLanguageTerms
#        console.log("processed terms")
#        console.log(JSON.stringify(scope.updateableLanguageTerms))
        if (scope.updateableLanguageTerms.length>0)
          ut.commons.golabUtils.updateSpecialLanguageTerms(configurationModel, languageHandler)
      $timeout(findUpdateableLanguageTerms)

      configurationModel.addListeners(["specialLanguageTermsChanged", "modelLoaded"], ->
        findUpdateableLanguageTerms()
        ut.commons.golabUtils.updateSpecialLanguageTerms(configurationModel, languageHandler)
      )
  }

ut.commons.golabUtils.directive("languageTermsEditor".toLowerCase(),
  ["configurationModel", "languageHandler", "$timeout", languageTermsEditor])


languageTermEditor = (configurationModel, languageHandler)->
  {
    restrict: "E"
    template: """
<div class="nameEditor">
  <div class="row">{{updateableLanguageTerm.key}} <i class="fa fa-arrow-right fa-fw"></i> {{updateableLanguageTerm.value}}</div>
  <div class='row'>
    <div class="col-md-1">
    </div>
    <div class="col-md-11">
      <input ng-model="updateableLanguageTerm.newValue" ng-blur='newValueBlurred()'>
    </div>
  </div>
</div>

"""
    replace: true
    link: (scope, element, attrs)->
      preBlurredNewValueValue = scope.updateableLanguageTerm.newValue
      scope.newValueBlurred = ()->
        if (preBlurredNewValueValue != scope.updateableLanguageTerm.newValue)
          configurationModel.setSpecialLanguageTermValue(scope.updateableLanguageTerm.key, scope.updateableLanguageTerm.newValue)
          preBlurredNewValueValue = scope.updateableLanguageTerm.newValue
  }

ut.commons.golabUtils.directive("languageTermEditor".toLowerCase(), ["configurationModel", "languageHandler", languageTermEditor])

