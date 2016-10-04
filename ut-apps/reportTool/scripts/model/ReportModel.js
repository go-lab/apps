"use strict";var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)},ut;!function(e){var t;!function(t){var o;!function(t){var o=e.commons.ResourceEventEmitterModel,r=e.commons.tsutils.Map,n=function(e){function o(o,r,n,i,a,p,c,d){var s=this;e.call(this,o,"report"),this.configurationModel=r,this._dataGraphModel=n,this._hypothesesModel=i,this._questionsModel=a,this._observationsModel=p,this._conceptMapModel=c,this._tableModel=d,this._reportSections=[],this._editMode=!0,this.actionLogger=new t.ReportActionLogger(this.actionLogger),this.clearReportSections(),r&&r.addListeners(["modelCleared","modelLoaded","contentCleared","reportSectionConfigurationsValuesSwapped","reportSectionConfigurationsValuesChanged","reportSectionConfigurationsPushed","reportSectionConfigurationsRemoved","reportSectionConfigurationsValueNameChanged"],function(){s.createReportSections(null)})}return __extends(o,e),o.prototype.createNewModel=function(){return new o(this.environmentHandlers,this.configurationModel,this.dataGraphModel,this.hypothesesModel,this.questionsModel,this.observationsModel,this.conceptMapModel,this._tableModel)},Object.defineProperty(o.prototype,"reportActionLogger",{get:function(){return this.actionLogger},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"dataGraphModel",{get:function(){return this._dataGraphModel},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"hypothesesModel",{get:function(){return this._hypothesesModel},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"questionsModel",{get:function(){return this._questionsModel},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"observationsModel",{get:function(){return this._observationsModel},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"conceptMapModel",{get:function(){return this._conceptMapModel},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"tableModel",{get:function(){return this._tableModel},enumerable:!0,configurable:!0}),o.prototype.isChangeTrackingFullyImplemented=function(){return!0},o.prototype.isEmpty=function(){return!this._reportSections.some(function(e){return!e.isEmpty()})},Object.defineProperty(o.prototype,"editMode",{get:function(){return this._editMode},set:function(e){this._editMode!==e&&(this._editMode=e)},enumerable:!0,configurable:!0}),o.prototype.applyLogAdd=function(t,o){var r=!1;switch(t.object.objectType){case"paragraph":this.addParagraph(t.object);break;case"image":this.addImage(t.object);break;default:e.prototype.applyLogAdd.call(this,t,o),r=!0}r||o(null)},o.prototype.addParagraph=function(e){var o=this.findReportSectionById(e.content.sectionId);if(!o)throw Error("cannot find section with id: "+e.content.sectionId);var r=o.createNewReportParagraph(t.ParagraphType[e.content.paragraphType],e.id);o.addReportParagraph(r,!0)},o.prototype.addImage=function(e){var o=this.findReportParagraphById(e.id);if(!o)throw Error("cannot find paragraph with id: "+e.id);var r=t.UploadedFile.createFromJson(e.content.data);o.addImage(r)},o.prototype.applyLogRemove=function(t,o){var r=!1;switch(t.object.objectType){case"paragraph":this.removeParagraph(t.object);break;case"image":this.removeImage(t.object);break;default:e.prototype.applyLogRemove.call(this,t,o),r=!0}r||o(null)},o.prototype.removeParagraph=function(e){var t=this.findReportParagraphById(e.id);if(!t)throw Error("cannot find paragraph with id: "+e.id);t.reportSection.removeReportParagraph(t,!0)},o.prototype.removeImage=function(e){var t=this.findReportParagraphById(e.id);if(!t)throw Error("cannot find paragraph with id: "+e.id);t.removeImageById(e.content.imageId)},o.prototype.applyLogChange=function(t,o){var r=!1;switch(t.object.objectType){case"section":this.moveParagraph(t.object);break;case"thing":this.loadThing(t.object);break;case"resource":this.loadResource(t.object);break;case"image":this.moveImage(t.object);break;case"text":this.changeText(t.object);break;case"editMode":this.changeEditMode(t.object);break;default:e.prototype.applyLogChange.call(this,t,o),r=!0}r||o(null)},o.prototype.moveParagraph=function(e){var t=this.findReportParagraphById(e.content.paragraphId);if(!t)throw Error("cannot find paragraph with id: "+e.content.paragraphId);var o=this.findReportSectionById(e.id);if(!o)throw Error("cannot find newSection with id: "+e.id);this.moveReportParagraphToReportSection(t.id,o,e.content.newIndex)},o.prototype.loadThing=function(e){var t=this.findReportParagraphById(e.id);if(!t)throw Error("cannot find paragraph with id: "+e.id);t.resource.loadFromResource(e.content.data),t.thingId=e.content.thingId},o.prototype.loadResource=function(e){var t=this.findReportParagraphById(e.id);if(!t)throw Error("cannot find paragraph with id: "+e.id);t.loadResource(e.content.data)},o.prototype.moveImage=function(e){var t=this.findReportParagraphById(e.id);if(!t)throw Error("cannot find paragraph with id: "+e.id);var o=t.findImageIndexById(e.content.imageId);if(o<0)throw Error("cannot find image with id: "+e.content.imageId);t.moveImageByIndex(o,e.content.newIndex)},o.prototype.changeText=function(e){var t=this.findReportParagraphById(e.id);if(!t)throw Error("cannot find paragraph with id: "+e.id);t.setText(e.content.data,!0)},o.prototype.changeEditMode=function(e){this.editMode=e.content.editMode},Object.defineProperty(o.prototype,"reportSections",{get:function(){return this._reportSections},enumerable:!0,configurable:!0}),o.prototype.findReportSectionById=function(e){for(var t=0,o=this._reportSections;t<o.length;t++){var r=o[t];if(r.id===e)return r}return null},o.prototype.findReportParagraphById=function(e){for(var t=0,o=this._reportSections;t<o.length;t++){var r=o[t],n=r.findReportParagraphById(e);if(n)return n}return null},o.prototype.removeReportParagraph=function(e){e.reportSection.removeReportParagraph(e,!0)},o.prototype.removeReportParagraphById=function(e){var t=this.findReportParagraphById(e);t?t.reportSection.removeReportParagraph(t,!0):console.warn("could not find report paragraph with id: "+e)},o.prototype.moveReportParagraphToReportSection=function(e,t,o){void 0===o&&(o=-1);var r=this.findReportParagraphById(e);return r?(r.reportSection!==t&&(r.reportSection.removeReportParagraph(r,!1),t.addReportParagraph(r,!1)),o>=0&&t.moveReportParagraphToIndex(r,o,!1),this.emitModelChanged(!0)):console.warn("could not find report paragraph with id: "+e),r},o.prototype.loadReportSections=function(e){var t=this;this.createReportSections(e),this.clearReportSections(),e&&e.map(function(e){var o=t.findReportSectionById(e.id);o&&o.loadFromJson(e)}),this.emitModelChanged()},Object.defineProperty(o.prototype,"updateableReportParagraphs",{get:function(){var e=[];return this._reportSections.forEach(function(t){t.reportParagraphs.filter(function(e){return e.canBeUpdated()}).forEach(function(t){e.push(t)})}),e},enumerable:!0,configurable:!0}),o.prototype.updateReportParagraphs=function(){var e=this.updateableReportParagraphs;if(e.length>0){var t=this.getStorageHandler(),o=t.getForResourceTypeFilter(),n=t.getForProviderFilter(),i=t.getForAppIdFilter();t.setForResourceTypeFilter(!1),t.setForProviderFilter(!1),t.setForAppIdFilter(!1),t.listResourceMetaDatas(function(a,p){if(t.setForResourceTypeFilter(o),t.setForProviderFilter(n),t.setForAppIdFilter(i),a)throw a;var c=new r;p.forEach(function(e){c.put(e.metadata.id,e)}),e.forEach(function(e){e.updateFromLatestResourceMap(c)})})}},o.prototype.getResourceContent=function(){return{editMode:this._editMode,reportSections:this.reportSections.map(function(e){return e.getJson()})}},o.prototype.loadFromResourceContent=function(e){this._editMode=e.editMode,this.loadReportSections(e.reportSections)},o.prototype.clearContent=function(){this.clearReportSections(),e.prototype.clearContent.call(this)},o.prototype.clearReportSections=function(){this._reportSections.map(function(e){e.clear()})},o.prototype.createReportSections=function(e){var o=this,r={};if(this._reportSections.map(function(e){r[e.id]=e}),this._reportSections.length=0,this.configurationModel)this.configurationModel.reportSectionConfigurations.getValues().forEach(function(e){var n=null;r[e.id]?(n=r[e.id],n.newReportSectionConfiguration(e)):n=new t.ReportSection(o,e),o._reportSections.push(n)});else{if(!e)throw new Error("there must be a configuration or a reportSectionsJson parameter");e.forEach(function(e){var n=null;n=r[e.id]?r[e.id]:t.ReportSection.createNewReportSectionFromJson(o,e),o._reportSections.push(n)})}},o}(o);t.ReportModel=n}(o=t.reportingtool||(t.reportingtool={}))}(t=e.tools||(e.tools={}))}(ut||(ut={}));
//# sourceMappingURL=ReportModel.js.map