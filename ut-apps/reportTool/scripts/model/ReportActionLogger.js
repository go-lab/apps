"use strict";var __extends=this&&this.__extends||function(t,o){function e(){this.constructor=t}for(var n in o)o.hasOwnProperty(n)&&(t[n]=o[n]);t.prototype=null===o?Object.create(o):(e.prototype=o.prototype,new e)},ut;!function(t){var o;!function(o){var e;!function(o){var e=t.commons.actionlogging.ActionLoggerWrapper,n=function(t){function e(o){t.call(this,o)}return __extends(e,t),e.prototype.logParagraphAdded=function(t){var e={objectType:"paragraph",id:t.id,content:{sectionId:t.reportSectionId,paragraphType:o.ParagraphType[t.paragraphType]}};this.logAdd(e)},e.prototype.logParagraphRemoved=function(t){var o={objectType:"paragraph",id:t};this.logRemove(o)},e.prototype.logParagraphMoved=function(t){var o={objectType:"section",id:t.reportSection.id,content:{paragraphId:t.id,newIndex:t.reportSection.findReportParagraphIndex(t)}};this.logChange(o)},e.prototype.logThingLoaded=function(t,o){void 0===o&&(o=!1);var e={objectType:"thing",id:t.id,content:{data:t.resource.getResource(),thingId:t.thingId}};o?e.content.action="updated":e.content.action="loaded",this.logChange(e)},e.prototype.logThingUpdated=function(t){this.logThingLoaded(t,!0)},e.prototype.logResourceLoaded=function(t,o){void 0===o&&(o=!1);var e={objectType:"resource",id:t.id,content:{data:t.resource.getResource()}};o?e.content.action="updated":e.content.action="loaded",this.logChange(e)},e.prototype.logResourceUpdated=function(t){this.logResourceLoaded(t,!0)},e.prototype.logImageAdded=function(t,o){var e={objectType:"image",id:t.id,content:{data:o.getJson()}};this.logAdd(e)},e.prototype.logImageRemoved=function(t,o){var e={objectType:"image",id:t.id,content:{imageId:o}};this.logRemove(e)},e.prototype.logImageMoved=function(t,o,e){var n={objectType:"image",id:t.id,content:{imageId:o,newIndex:e}};this.logChange(n)},e.prototype.logTextChanged=function(t){var o={objectType:"text",id:t.id,content:{data:t.text}};this.logChange(o)},e.prototype.logEditModeChanged=function(t){var o={objectType:"editMode",content:{editMode:t}};this.logChange(o)},e}(e);o.ReportActionLogger=n}(e=o.reportingtool||(o.reportingtool={}))}(o=t.tools||(t.tools={}))}(ut||(ut={}));
//# sourceMappingURL=ReportActionLogger.js.map