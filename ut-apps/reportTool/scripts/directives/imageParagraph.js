"use strict";var ut;!function(e){var o;!function(e){var o;!function(e){function o(e,o,a){return{restrict:"E",template:'\n<div class=\'imageParagraph centered\' ng-class="{editMode: reportModel.editMode}">\n    <div ui-sortable="sortableOptions" ng-model="reportParagraph.images" class="uploadedImages" \n        ng-show="reportParagraph.images.length">\n      <div ng-repeat="image in reportParagraph.images" objectType="uploadedImage" objectId="{{image.id}}" \n         class="uploadedImage dontShowDropNotAllowed">\n         <imageDisplay image="image" image-id-to-delete="{{imageIdToDelete}}"></imageDisplay>\n      </div>\n    </div>\n    <uploadImage images="reportParagraph.images" report-paragraph="reportParagraph" ng-show="reportModel.editMode"></uploadImage>\n</div>\n',replace:!1,link:function(o,t,n){var r=o;r.imageIdToDelete="";var i=t.find(".uploadedImages"),g=r.reportParagraph,d=null,s=null,c=function(e){var a=i.offset(),t=a.left,n=a.top,l=i.width(),g=i.height(),d=e.pageX,c=e.pageY,p=d>=t&&d<=t+l&&c>=n&&c<=n+g,u="";p||(u=s),r.imageIdToDelete!==u&&o.$apply(function(){r.imageIdToDelete=u})},p=-1,u=function(){var o=g.findImageIndexById(s);o>=0&&p!==o&&(e.emitModelChanged(!0),e.reportActionLogger.logImageMoved(g,s,o))};r.sortableOptions={axis:"false",handle:".imageDisplay",revert:!1,revertDuration:50,distance:5,tolerance:"pointer",activate:function(e,o){l&&(console.log("activate()"),console.log(e),console.log(o))},start:function(e,o){l&&(console.log("start()"),console.log(e),console.log(o)),a.on("mousemove",c),d=angular.element(o.item),s=o.item.attr("objectId"),p=g.findImageIndexById(s)},beforeStop:function(o,a){l&&(console.log("beforeStop()"),console.log(o),console.log(a)),!r.reporting.objectDropHandled&&r.imageIdToDelete&&(g.removeImageById(s),e.reportActionLogger.logImageRemoved(g,s))},out:function(e,o){l&&(console.log("out()"),console.log(e),console.log(o))},over:function(e,o){l&&(console.log("over()"),console.log(e),console.log(o))},receive:function(e,o){l&&(console.log("receive()"),console.log(e),console.log(o))},remove:function(e,o){l&&(console.log("remove()"),console.log(e),console.log(o))},sort:function(e,o){l&&(console.log("sort()"),console.log(e),console.log(o))},stop:function(e,o){l&&(console.log("stop()"),console.log(e),console.log(o)),a.off("mousemove",c),u()},update:function(e,o){l&&(console.log("update()"),console.log(e),console.log(o))}},o.$watch("reportModel.editMode",function(e,o){i.sortable("option","disabled",!e)})}}}function a(){return{restrict:"E",template:'\n<span class="imageDisplay" ng-class="{ dropObjectOutSideDropArea: imageIdToDelete===image.id}">\n   <span class="removeIndicator" ng-show="imageIdToDelete===image.id"></span>\n   <img ng-src="{{image.content}}">\n</span>\n',replace:!1,scope:{image:"=",imageIdToDelete:"@"},link:function(e,o,a){var t=o.find("img"),n=t[0];e.$watch("image.content",function(e,o){if(n.naturalHeight&&n.naturalWidth){var a=parseInt(n.naturalWidth),l=parseInt(n.naturalHeight),g=1;a>r&&(g=r/a),l>i&&(g=Math.min(g,i/l)),t.attr("width",g*a),t.attr("height",g*l)}else t.removeAttr("width"),t.removeAttr("height")})}}}function t(o,a,t){return{restrict:"E",template:'\n<div class=\'uploadImage\' ng-class="{uploadImageDropAbove: uploadImage.dropAbove}">\n    <busy busy="uploadImage.loadingImage"></busy>\n     <table width="100%" Xborder="1">\n        <tr>\n            <td>\n                <div class="inputFileUpload">\n                   <i class="fa fa-folder-open-o fa-fw activeButton fontAweSomeButton faEditButton" ng-click=\'askForFile()\'\n                      title="{{\'reportingTool.uploadImage.selectImage.tooltip\' | g4i18n}}"></i>\n                   <input type="file" accept="image/*" filesSelected="uploadImage.selectedFiles">\n                </div>\n            </td>\n            <td width="95%" align="center">\n                <span class="dropImagesMessage" g4i18n="reportingTool.uploadImage.dropImagesHere"></span>\n            </td>\n            <td>\n                \n            </td>\n        </tr>\n        <tr>\n            <td>\n                <span class="imageUrlLabel" g4i18n="reportingTool.uploadImage.urlLabel"></span>\n            </td>\n            <td>\n                <input type="text" ng-model="uploadImage.url" ng-enter="urlEntered()"\n                   title="{{\'reportingTool.uploadImage.enterUrl.tooltip\' | g4i18n}}">\n            </td>\n            <td>\n                <i class="fa fa-play fa-fw activeButton fontAweSomeButton faEditButton" \n                   ng-class="{disabledButton: !uploadImage.validUrl}" ng-click=\'urlEntered()\'\n                   title="{{\'reportingTool.uploadImage.loadEnteredUrl.tooltip\' | g4i18n}}"></i>\n            </td>\n        </tr>\n    </table>\n</div>\n',replace:!1,scope:{images:"&",reportParagraph:"&"},link:function(o,n,l){var r=o;r.uploadImage={dropAbove:!1,selectedFiles:[],url:"",validUrl:!1,loadingImage:!1};var i=function(e){return 0===e.indexOf("image/")},g=function(e){var o=r.reportParagraph();o.addImage(e),o.reportSection.reportModel.reportActionLogger.logImageAdded(o,e)},d=function(a,t){if(i(a.type)){var n=new FileReader;n.onload=function(n){var l=n.target.result,r=new e.UploadedFile(a.name,a.type,a.size,a.lastModifiedDate.toISOString(),l);g(r),o.$apply(),t()},n.readAsDataURL(a)}},s=function(e){for(var o=[],a=0;a<e.length;a++)i(e[a].type)&&o.push(e[a]);if(o.length>0){r.uploadImage.loadingImage=!0;var t=-1,n=function(){++t,t>=o.length?r.uploadImage.loadingImage=!1:d(o[t],n)};n()}},c=function(e){r.uploadImage.dropAbove!==e&&o.$apply(function(){r.uploadImage.dropAbove=e})};n.on("dragover",function(e){return!1});var p=0;n.on("dragenter",function(e){return++p,c(!0),!1}),n.on("dragleave",function(e){return--p,0===p&&c(!1),!1}),n.on("drop",function(e){e.preventDefault();var o=e.originalEvent.dataTransfer;o.files.length&&s(o.files),c(!1)});var u=angular.element(n.find("input[type='file']"));r.askForFile=function(){u.click()},o.$watch("uploadImage.selectedFiles",function(e,o){r.uploadImage.selectedFiles.length&&s(r.uploadImage.selectedFiles)});var m=/^(?:(?:https?|http):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,f=function(){r.uploadImage.validUrl=m.test(r.uploadImage.url)};o.$watch("uploadImage.url",function(){f()});var v=function(e){var o=e,a=o.indexOf("?");a>=0&&(o=o.substring(0,a));var t=o.indexOf("#");t>=0&&(o=o.substring(0,t));var n="",l="",r=o.lastIndexOf("/"),i=o.lastIndexOf(".");i>=r&&(n=o.substring(i+1)),r>=0&&(l=i>r?o.substring(r+1,i):o.substring(r+1));var g="image/"+n.toLowerCase();return[l,g]},I=function(l){r.uploadImage.loadingImage=!0;var i=$("<img class='urlCheckerImage'>");i.on("load",function(a){console.log("image loaded");var t=v(l),n=t[0],d=t[1],s=new e.UploadedFile(n,d,(-1),"",l);g(s),r.uploadImage.loadingImage=!1,o.$apply(),i.remove()}),i.on("error",function(e){console.log("image error"),i.remove(),r.uploadImage.loadingImage=!1,a.error(t.getMessage("reportingTool.failure.loading.imageFromUrl"))}),i.attr("src",l),n.append(i)};r.urlEntered=function(){r.uploadImage.validUrl&&I(r.uploadImage.url)}}}}function n(){return{restrict:"A",scope:{filesSelected:"=filesselected"},link:function(e,o,a){var t=e;o.bind("change",function(o){e.$apply(function(){t.filesSelected=o.target.files})})}}}var l=!1;e.reportingTool.directive("imageParagraph".toLowerCase(),["reportModel","configurationModel","$document",o]);var r=900,i=600;e.reportingTool.directive("imageDisplay".toLowerCase(),[a]),e.reportingTool.directive("uploadImage".toLowerCase(),["$timeout","Notification","languageHandler",t]),e.reportingTool.directive("filesSelected".toLowerCase(),[n])}(o=e.reportingtool||(e.reportingtool={}))}(o=e.tools||(e.tools={}))}(ut||(ut={}));
//# sourceMappingURL=imageParagraph.js.map
