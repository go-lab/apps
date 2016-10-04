(function(){"use strict";var e,n,o,t,i,a,s,l,r,u,c,d,g,m,f,w,h,p,b,v,k,C,S,B,x,L,M,H,A;window.ut=window.ut||{},ut.commons=ut.commons||{},e=window.angular,A="1474379388392",k=function(){return A.length>0&&"_"!==A.charAt(0)},m=function(){return parseInt(A)},ut.commons.golabUtils=e.module("golabUtils",["ui-notification"]),ut.commons.golabUtils.run(["$rootScope","$templateCache","dateTimeFormat",function(e,n,o){return e.dateTimeFormat=o,n.put("angular-ui-notification.html",'<div class="ui-notification">\n    <h3 ng-show="title" ng-bind-html="title"></h3>\n    <div class="message" ng-bind-html="message"></div>\n</div>')}]),ut.commons.golabUtils.value("dateTimeFormat","dd MMM yy, H:mm:ss"),ut.commons.golabUtils.factory("configurationModel",["environmentHandlers",function(e){return window.ut.commons.ConfigurationModel?new window.ut.commons.ConfigurationModel(e):{}}]),ut.commons.golabUtils.factory("browser",function(){var e,n,o;return o=function(e){return e in document.documentElement.style},n=Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")>0,e={isOpera:!(!window.opera||!window.opera.version),isFirefox:o("MozBoxSizing"),isSafari:n,isChrome:!n&&o("WebkitTransform"),isIE:o("msTransform"),isWebKit:o("WebkitTransform")}}),g=function(e,n){var o;return o=e.css(n),parseInt(o)},ut.commons.golabUtils.factory("resourceLoader",[function(){return golab.common.resourceLoader?golab.common.resourceLoader:null}]),r=function(e,n,o){var t,i,a,s;return t=function(o,t){var i,a;return a=window.gadgets?window.gadgets.util.getUrlParameters().url:window.location.href,i={objectType:"error",id:a,content:{errorType:o,message:t,device:n.getDeviceInfo()}},e&&(i.content.commonsInfo=e.getCommonsInfo(),i.content.libsInfo=e.getLibsInfo(),i.content.toolInfo=e.getToolInfo()),i},s=function(){return window.onerror=function(e,o,i){var a,s,l;return s=!1,s=head.mobile,s&&alert("Error: "+e+"\nurl: "+o+"\nline #: "+i),n&&(a=t("uncatched exception",e),a.content.url=o,a.content.line=i,n.logSend(a)),l=!1}},a=function(){var e,o;switch(o=["go-lab.gw.utwente.nl"],e=function(e){var n,t,i,a;for(t=e.toLowerCase(),n=0,i=o.length;n<i;n++)if(a=o[n],t.indexOf(a)>=0)return!0;return!1},n.metadataHandler.getContext()){case window.golab.ils.context.graasp:case window.golab.ils.context.ils:case window.golab.ils.context.preview:case window.golab.ils.context.standalone:return e(n.metadataHandler.getGenerator().url);default:return!1}},i=function(e,i,s){var l;if(i||(i=e),console.warn(i.trim()),s&&console.warn(s),o.error({message:e,delay:2e4}),n&&a())return l=t("reported error",i),l.content.display=e,s&&(l.content.error=s),n.logSend(l)},s(),{start:function(){},reportError:i}},ut.commons.golabUtils.factory("errorHandler",["resourceLoader","actionLogger","Notification",r]),ut.commons.golabUtils.factory("leavePageDetector",[function(){var e,n,o,t,i,a;return o=[],t=!1,n=!1,e=function(e){return o.push(e)},i=function(e){var i,a,s,l;if(null==e&&(e=!0),n&&console.log("lpd: leavingPage, leavePageHandled: "+t),!t)for(n&&console.log("lpd: calling "+o.length+" handlers"),s=0,l=o.length;s<l;s++){a=o[s];try{a()}catch(e){i=e,console.error(i),alert(i)}}t=e},window.onbeforeunload=function(){if(n&&console.log("lpd: window.onbeforeunload start"),i(),n)return console.log("lpd: window.onbeforeunload end")},window.onunload=function(){if(n&&console.log("lpd: window.onunload start"),i(),n)return console.log("lpd: window.onunload end")},head.mobile&&(window.onblur=function(){return n&&console.log("lpd: window.onblur start"),setTimeout(function(){if(i(!1),n)return console.log("lpd: window.onblur end")},500)}),a=function(){},n&&console.log("lpd: setup finished"),{addHandler:e,simulateLeave:a}}]),s={$parent:{}},w=function(e,n){return{restrict:"E",scope:{containertitle:"@"},template:'<div class="golabContainer">\n  <div class="golabContainerHeader">\n    <span ng-show="showMinimize">\n      <i class="fa fa-plus-square-o fa-fw activeButton fontAweSomeButton fontAweSomeGolabContainerButton"\n        ng-click="unMinimize()" ng-show="minimized"></i>\n      <i class="fa fa-minus-square-o fa-fw activeButton fontAweSomeButton fontAweSomeGolabContainerButton"\n        ng-click="minimize()" ng-hide="minimized"></i>\n    </span>\n    <span class="golabContainerTitle">{{title}}</span>\n  </div>\n  <div class="golabContainerContent">\n    <div ng-transclude></div>\n  </div>\n</div>',replace:!0,transclude:!0,link:function(o,t,i){var a,s,l,r,u,c,d,m,f,w,h,p,b,v,k,C,S,B,x;switch(o.configurationModel=o.$root.configurationModel,B=n.getI_Message(o.containertitle),o.title=B,x=function(){return b&&o.configurationModel.showResourceName?o.title=n.getI_Message(o.containertitle+"WithResourceName",b.getDisplayName()):o.title=B},v=ut.commons.utils.getAttributeValue(i,"modelName",""),v&&(b=o.$parent[v],b&&(b.addListeners(["modelChanged","modelLoaded","modelCleared","displayNameChanged"],function(){return x(),!1}),x())),o.$watch("configurationModel.showResourceName",function(e,n){return x()}),S=ut.commons.utils.getAttributeValue(i,"sizeComponent",""),S&&(C=t.find(S),C&&C.length&&("TEXTAREA"===C.prop("tagName")&&C.css("resize","none"),o.element=t,k=t.height(),a=function(e){return C.height(C.height()+e-k),k=e},e(function(){var e;if(e=t.height(),k!==e)return a(e)},200))),o.showMinimize=!1,o.minimizeImage="",o.minimized=!1,h=ut.commons.utils.getAttributeValue(i,"minimize","").toLowerCase(),w="",p=!1,h){case"":w="";break;case"vertical":w="Vertical",p=!0;break;case"horizontal":w="Horizontal";break;default:console.log("unknown minimize value: "+h)}if(w)return o.showMinimize=!0,u=t,d=u.find(".golabContainerHeader"),c=u.find(".golabContainerContent"),m=u.find(".golabContainerTitle"),o.minimized=!1,f=d.height(),l=c.height(),s=u.height(),r=function(){return ut.commons.utils.gadgetResize()},o.minimize=function(){var e;if(!o.minimized)return s=u.height(),t.addClass("golabContainerMinimized"+w),c.addClass("golabContainerContentMinimized"),p?(l=c.height(),m.addClass("golabContainerTitleVertical"),e=f+m.width()-1+g(m,"padding-left")+g(m,"padding-right"),u.height(e)):r(),o.minimized=!0},o.unMinimize=function(){if(o.minimized)return t.removeClass("golabContainerMinimized"+w),c.removeClass("golabContainerContentMinimized"),p?(m.removeClass("golabContainerTitleVertical"),u.height(s)):r(),o.minimized=!1}}}},ut.commons.golabUtils.directive("golabContainer".toLowerCase(),["$timeout","languageHandler","configurationModel",w]),s={dialogBoxes:[],$root:null},S=10,a=function(e,n,o){return o.dialogBoxes=o.dialogBoxes||[],{restrict:"E",scope:{title:"@",id:"@"},template:'<div ng-transclude class="dialogBoxContent"></div>',replace:!0,transclude:!0,link:function(t,i,a){var s,l,r,u,c,d,g,m,f,w,h,p,b;if(!o.dialogBoxes)throw new Error("there must be a dialogBoxes property on the scope in order to use the dialogBox tag");return r={},p=0,f=null,s=function(){if(p++,f=a.id,f||(f=t.id),!f&&p<S)return void e(s,0);if(!f)throw new Error("id attribute must be specified for dialogBox tag");if(o.dialogBoxes[f])throw new Error("duplicate id attribute ("+f+") of dialogBox tag");return o.dialogBoxes[f]=r},s(),u=!1,c={beforeClose:function(n,o){return"function"==typeof t.beforeCloseDialogBox&&t.beforeCloseDialogBox(f),e(function(){return i.dialog("close"),u=!1},0)},minHeight:50},l=function(e,n){var o;return o=e.toLowerCase(),a[o]?c[e]=a[o]:n?c[e]=n:void 0},l("modal",!0),l("resizable"),l("width"),l("height"),l("minWidth"),l("maxWidth"),l("minHeight"),l("maxHeight"),m=ut.commons.utils.getAttributeValue(a,"icon",null),g=ut.commons.utils.getAttributeValue(a,"iconHtml",null),m=null,g=null,d=m?$("<i class='fa fa-"+m+" fa-fw dialogBoxIcon'></i>"):g?(h=$("<span class='dialogBoxIcon'></span>"),h.add($(g))):null,b=function(){var e,n;if(d&&(e=i.parent().children(".ui-dialog-titlebar"),n=e.children(".ui-dialog-title"),0===n.children(".dialogBoxIcon").length))return n.prepend(d)},t.$watch("title",function(e){var o;return o=n.getI_Message(e),c?c.title=o:i.dialog("option","title",o),b()}),i.hide(),"undefined"==typeof t.$root.dialogBoxChangeCounter&&(t.$root.dialogBoxChangeCounter=0),w=function(){return t.$root.dialogBoxChangeCounter++},r.show=function(){if(!u)return i.dialog(c),c&&c.maxWidth&&i.parent().css({"max-width":c.maxWidth}),b(),c=null,w(),u=!0,ut.commons.utils.gadgetResize()},r.close=function(){return u&&i.dialog("isOpen")&&(i.dialog("close"),w(),ut.commons.utils.gadgetResize()),u=!1}}}},ut.commons.golabUtils.directive("dialogBox".toLowerCase(),["$timeout","languageHandler","$rootScope",a]),s={questionParams:{},dialogBoxId:"",answer:"",okLabel:"",questionOkAnswer:null,questionCancelAnswer:null},n=function(e,n,o){return o.askQuestion={},{restrict:"E",template:'<div>\n  <div ng-show=\'askQuestion.questionParams.question\' class="questionQuestion">{{askQuestion.questionParams.question}}</div>\n  <input ng-model="askQuestion.questionParams.answer" ng-enter="ok()" ng-show="showInput" class="questionInput"/>\n  <div class="dialogButtonRow">\n    <ul class="toolbar">\n      <li ng-show="okLabel">\n        <span class="activeButton textButton" ng-class="{disabledButton: okDisabled}" ng-click=\'ok()\'>{{okLabel}}</span>\n      </li>\n      <li ng-show="ok2Label">\n        <span class="activeButton textButton" ng-class="{disabledButton: okDisabled}" ng-click=\'ok2()\'>{{ok2Label}}</span>\n      </li>\n      <li ng-show="cancelLabel">\n        <span class="activeButton textButton" ng-click=\'cancel()\'>{{cancelLabel}}</span>\n      </li>\n    </ul>\n  </div>\n</div>',replace:!0,transclude:!1,link:function(e,t,i){var a,s,l,r,u,c;return s={},a=function(e,n){var o;return o=e.toLowerCase(),i[o]?s[e]=i[o]:n?s[e]=n:void 0},a("ok"),a("ok2"),a("cancel"),s.ok&&(s.ok=n.getI_Message(s.ok)),s.ok2&&(s.ok2=n.getI_Message(s.ok2)),s.cancel&&(s.cancel=n.getI_Message(s.cancel)),e.okLabel=s.ok,e.ok2Label=s.ok2,e.cancelLabel=s.cancel,e.showInput=!0,e.okDisabled=!1,u=function(){var n;if(e.okDisabled=!1,e.showInput&&e.askQuestion&&e.askQuestion.questionParams&&"string"==typeof e.askQuestion.questionParams.answer)return n=e.askQuestion.questionParams.answer.trim(),e.okDisabled=0===n.length},e.$watch("askQuestion.questionParams.answer",u),r="",c=function(){if(e.askQuestion.questionParams&&("string"!=typeof e.askQuestion.questionParams.answer&&(e.showInput=!1),e.askQuestion.questionParams.okLabel&&(e.okLabel=e.askQuestion.questionParams.okLabel),e.askQuestion.questionParams.ok2Label&&(e.ok2Label=e.askQuestion.questionParams.ok2Label),e.askQuestion.questionParams.cancelLabel&&(e.cancelLabel=e.askQuestion.questionParams.cancelLabel),e.askQuestion.questionParams.dialogBoxId&&(r=e.askQuestion.questionParams.dialogBoxId),u()),!e.okLabel&&!e.ok2Label&&!e.cancelLabel)return console.error("askQuestion directive: at least one of the labels must be defined!")},e.elem=t,e.$watch("dialogBoxChangeCounter",function(){if(t.is(":visible"))return c()}),l=function(){if(r)return o.dialogBoxes[r].close()},e.ok=function(){if(!e.okDisabled)return e.askQuestion.questionParams.questionOkAnswer&&e.askQuestion.questionParams.questionOkAnswer(e.askQuestion.questionParams.answer),l()},e.ok2=function(){if(!e.okDisabled)return e.askQuestion.questionParams.questionOk2Answer&&e.askQuestion.questionParams.questionOk2Answer(e.askQuestion.questionParams.answer),l()},e.cancel=function(){return e.askQuestion.questionParams.questionCancelAnswer&&e.askQuestion.questionParams.questionCancelAnswer(),l()}}}},ut.commons.golabUtils.directive("askQuestion".toLowerCase(),["$timeout","languageHandler","$rootScope",n]),H=function(){return{restrict:"E",template:'<ul class="toolbar" ng-class="{verticalToolbar:verticalToolbar}">\n  <li class="toolBarBeginSpace"></li>\n  <span ng-transclude></span>\n</ul>',scope:!0,replace:!0,transclude:!0,link:function(e,n,o){if(e.verticalToolbar=!1,o.vertical)return e.verticalToolbar="true"===o.vertical.toLowerCase()}}},ut.commons.golabUtils.directive("toolbar",[H]),c=function(e){return function(n){return e.getMessage.apply(e,arguments)}},ut.commons.golabUtils.filter("g4i18n",["languageHandler",c]),v=function(e){return function(n){return e.getI_Message.apply(e,arguments)}},ut.commons.golabUtils.filter("i_g4i18n",["languageHandler",v]),u=function(e){return{restrict:"A",link:function(n,o,t){var i;return i=t.g4i18n,o.text(e.getMessage(i))}}},ut.commons.golabUtils.directive("g4i18n",["languageHandler",u]),l=function(){return function(e){var n,o,t,i,a;return t=function(e){return e<10?"0"+e:""+e},i=Math.floor(e/1e3),n=Math.floor(i/3600),a=i-3600*n,o=Math.floor(a/60),a-=60*o,0===n?o+":"+t(a):n+":"+t(o)+":"+t(a)}},ut.commons.golabUtils.filter("duration",[l]),C={esc:27,space:32,enter:13,tab:9,backspace:8,shift:16,ctrl:17,alt:18,capslock:20,numlock:144,leftArrow:37,upArrow:38,rightArrow:39,downArrow:40},i=function(e,n,o){return e.directive(n,[function(){return{restrict:"A",link:function(e,t,i){return t.bind("keypress",function(t){if(t.which===o)return e.$apply(function(){return e.$eval(i[n],{event:t})})})}}}])},t=function(e,n,o){return e.directive(n,[function(){return{restrict:"A",link:function(e,t,i){return t.bind("keydown",function(t){if(t.which===o)return t.preventDefault(),e.$apply(function(){return e.$eval(i[n],{event:t})})})}}}])},i(ut.commons.golabUtils,"ngEnter",C.enter),i(ut.commons.golabUtils,"ngSpace",C.space),t(ut.commons.golabUtils,"ngUpArrow",C.upArrow),t(ut.commons.golabUtils,"ngDownArrow",C.downArrow),b=0,p=function(e,n,o,t,i){return{restrict:"E",template:'<span ng-show="helpHtml">\n  <li>\n    <i class="fa fa-question fa-fw activeButton fontAweSomeButton" ng-click=\'showHelp($event)\'\n      title="{{\'help.openButton.tooltip\' | g4i18n}}"></i>\n  </li>\n  <dialogBox id="{{helpDialogId}}" title="{{helpDialogTitle}}" icon="question" resizable="false" width="500">\n    <div ng-bind-html="helpHtml"></div>\n    <div class="transpiledDate" ng-show=\'showTranspiledDate\'>{{transpiledDate | date}}</div>\n    <div class="dialogButtonRow">\n      <ul class="toolbar">\n        <li>\n           <i class="fa fa-times fa-fw activeButton fontAweSomeButton dialogButton"\n             ng-click=\'closeHelp($event)\' title="{{\'loadSave.showModelJsonDialog.close\' | g4i18n}}"></i>\n        </li>\n      </ul>\n    </div>\n  </div>\n  </dialogBox>\n</span>',replace:!0,link:function(a,s,l){var r,u,c,d,g;return u=b++,r="helpDialogBox"+u,a.helpDialogId=r,a.helpDialogTitle=n.getMessage("help.helpDialog.dialogTitle"),a.showTranspiledDate=!1,k()&&(a.showTranspiledDate=!0,d=o("date")(m(),t),a.transpiledDate=n.getMessage("help.helpDialog.buildDate",d)),a.helpHtml="",g=function(){var n;return n=e.useConfigurationHelp?e.getHelpHtml():e.getStandardHelpHtml(),a.helpHtml=n},g(),e.addListener("modelChanged",function(){return g()}),c=!1,a.showHelp=function(){return a.dialogBoxes[r].show(),c=(event.ctrlKey||event.altKey)&&event.shiftKey},a.closeHelp=function(){return a.dialogBoxes[r].close(),null!=i&&i.simulateLeave(),c&&(event.ctrlKey||event.altKey)&&!event.shiftKey&&e.setForceShowLoadConfiguration(!e.getForceShowLoadConfiguration()),c=!1}}}},ut.commons.golabUtils.directive("help",["configurationModel","languageHandler","$filter","dateTimeFormat","leavePageDetector",p]),M=0,L=function(){return{restrict:"E",template:'<span>\n  <li>\n    <i class="fa fa-bell-o fa-fw activeButton fontAweSomeButton" ng-click=\'showMessage()\'></i>\n  </li>\n  <dialogBox id="{{testMessageDialogId}}" title="test message" resizable="false" width="350">\n      <askQuestion cancel="read it"></askQuestion>\n  </dialogBox>\n</span>',replace:!0,link:function(e,n,o){var t,i;return t=M++,i="testMessageDialogBox"+t,e.testMessageDialogId=i,e.showMessage=function(){return e.askQuestion.questionParams={question:"The very important message.....",answer:null,dialogBoxId:i},e.dialogBoxes[i].show()}}}},ut.commons.golabUtils.directive("testMessage".toLowerCase(),[L]),d=function(e){return{restrict:"A",link:function(n,o,t){var i;return i=function(){return o.is(":visible")?ut.commons.utils.gadgetResize():e(i,250)},e(i,10)}}},ut.commons.golabUtils.directive("resizeAtInit".toLowerCase(),["$timeout",d]),B=function(){return function(e){return e.slice().reverse()}},ut.commons.golabUtils.filter("reverse",[B]),x=!1,f=function(e,n){return e.golab||(e.golab={startupFinished:!1}),{restrict:"A",link:function(e,n,o){var t,i;if(n.addClass("golabCloak"),!i)return i=!0,t=e.$watch("golab.startupFinished",function(e){var i,a,s,l;if(e&&(n.removeClass("golabCloak"),o.$set("golabCloak".toLowerCase(),void 0),t(),window.startupMillis&&!x))return s=Date.now()-window.startupMillis,l={name:"unknown",version:"unknown",buildMillis:"1474379388392"},window.golab.common.resourceLoader&&(l=window.golab.common.resourceLoader.getToolInfo()),i=parseInt(l.buildMillis),a=isNaN(i)?"unknown":new Date(i),console.log("Startup of '"+l.name+"' (version "+l.version+", build on "+a+") took "+s+" ms."),x=!0})}}},ut.commons.golabUtils.directive("golabCloak".toLowerCase(),["$rootScope","$timeout",f]),h=function(e,n){return{restrict:"E",template:'<div class="test" title=\'\'>\n  <div class="golabSectionTitle" ng-class="{firstGolabSectionTitle: firstSection}">\n    <span title=\'{{showHideTooltip}}\'>\n      <i class="fa fa-chevron-right fa-fw activeButton fontAweSomeButtonSmall" ng-class=\'{disabledButton: !allowShowHide}\'\n       ng-hide="sectionShown" ng-click="showSection()" Xtitle="{{\'editConfiguration.showSection.tooltip\' | g4i18n}}"></i>\n      <i class="fa fa-chevron-down fa-fw activeButton fontAweSomeButtonSmall" ng-class=\'{disabledButton: !allowShowHide}\'\n       ng-show="sectionShown" ng-click="hideSection()" Xtitle="{{\'editConfiguration.hideSection.tooltip\' | g4i18n}}"></i>\n      <span class="secondaryTextButton" ng-class=\'{notActiveTextButton: !allowShowHide}\' ng-click=\'showHideSection()\'>{{title}}</span>\n    </span>\n  </div>\n  <div ng-transclude ng-show=\'sectionShown\' class="golabSectionContent"></div>\n</div>\n',replace:!1,transclude:!0,scope:!0,link:function(o,t,i){var a,s,l,r,u,c,d,g,m,f,w,h,p,b;if(o.firstSection=ut.commons.utils.getBooleanAttributeValue(i,"firstSection",!1),a=ut.commons.utils.getAttributeValue(i,"key","???"),h=ut.commons.utils.getAttributeValue(i,"title",""),w=e.getMessage("editConfiguration.showSection.tooltip"),d=e.getMessage("editConfiguration.hideSection.tooltip"),c=e.getMessage("editConfiguration.hideSectionNotAllowed.tooltip"),o.title=e.getI_Message(h),o.sectionShown=!1,o.allowShowHide=!0,p=function(){return o.showHideTooltip=o.sectionShown?o.allowShowHide?d:c:w},p(),a=a.replace(/\./g,"_"),s=null,l=i.modelname){if(s=o[l],!s)return void console.error("expected to find a model class object on the scope, named "+l);if(!s instanceof window.ut.commons.ResourceEventEmitterModel)return void console.error("expected to find a model class object on the scope, named "+l+", which must be an instance of window.ut.commons.ResourceEventEmitterModel")}if(r=function(){if(s&&!s.configUISettings.showHideSections)return s.configUISettings.showHideSections={}},g=function(){if(r(),s&&"boolean"==typeof s.configUISettings.showHideSections[a])return o.sectionShown=s.configUISettings.showHideSections[a]},null!=s&&s.addListeners(["modelLoaded"],function(){return g()}),g(),b=function(){return r(),null!=s?s.configUISettings.showHideSections[a]=o.sectionShown:void 0},f=function(){return o.sectionShown=!0,b(),p(),n(function(){var e;return e=t.find(".test"),ut.commons.utils.scrollVerticalToVisible(e)}),ut.commons.utils.gadgetResize()},u=function(){return o.sectionShown=!1,b(),p(),ut.commons.utils.gadgetResize()},m=function(){return null!=s?s.getActionLogger().logChange({objectType:"golabSection",id:a,content:o.sectionShown}):void 0},o.showSection=function(){if(o.allowShowHide)return f(),m()},o.hideSection=function(){if(o.allowShowHide)return u(),m()},o.showHideSection=function(){return o.sectionShown?o.hideSection():o.showSection()},o.mustSectionBeShown)return o.$watch("mustSectionBeShown('"+a+"')",function(e,n){return e?(o.allowShowHide=!1,f()):o.allowShowHide=!0,p()})}}},ut.commons.golabUtils.directive("golabSection".toLowerCase(),["languageHandler","$timeout",h]),o=function(){return{restrict:"E",template:'<div class="busyWithResources" ng-show="busy"></div>',replace:!1,scope:{busy:"="},link:function(e,n,o){}}},ut.commons.golabUtils.directive("busy".toLowerCase(),[o]),ut.commons.golabUtils.updateSpecialLanguageTerms=function(e,n){var o;return o=$("[g4i18n]"),$.each(o,function(e){var t,i,a;if(a=$(o[e]),t=a.attr("g4i18n"))return i=n.getMessage(t),a.text(i)})}}).call(this);
//# sourceMappingURL=golabUtils.js.map
