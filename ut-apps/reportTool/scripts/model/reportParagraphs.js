"use strict";var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},ut;!function(e){var t;!function(t){var r;!function(t){var r=function(){function r(t,r,o){this._reportSection=t,this._paragraphType=r,this._id=e.commons.utils.generateUUID(),o&&(this._id=o)}return Object.defineProperty(r.prototype,"id",{get:function(){return this._id},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"reportSectionId",{get:function(){return this._reportSection.id},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"reportSection",{get:function(){return this._reportSection},set:function(e){this._reportSection=e},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"paragraphType",{get:function(){return this._paragraphType},enumerable:!0,configurable:!0}),r.prototype.canBeUpdated=function(){return!1},r.prototype.updateFromLatestResourceMap=function(e){},r.prototype.tryUpdateLoadedResource=function(){},r.prototype.getJson=function(){return{id:this._id,paragraphType:t.ParagraphType[this.paragraphType]}},r.prototype.loadFromJson=function(r){this._id=r.id,this._paragraphType=e.commons.tsutils.nameToEnum(t.ParagraphType,r.paragraphType)},r}();t.ReportParagraph=r;var o=function(e){function r(r,o){e.call(this,r,t.ParagraphType.Text,o),this._text=""}return __extends(r,e),r.createTextReportParagraph=function(e,t){return new r(e,t)},Object.defineProperty(r.prototype,"text",{get:function(){return this._text},enumerable:!0,configurable:!0}),r.prototype.setText=function(e,t){void 0===t&&(t=!0),(t||this._text!==e)&&(this._text=e,this.reportSection.reportModel.emitEvent("textChanged",[this.id,e]),this.reportSection.reportModel.emitModelChanged(t))},r.prototype.getJson=function(){var t=e.prototype.getJson.call(this);return t.text=this._text,t},r.prototype.loadFromJson=function(t){e.prototype.loadFromJson.call(this,t),t.text?this._text=t.text:this._text=""},r}(r);t.TextReportParagraph=o,t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.Text,{creator:o.createTextReportParagraph,toolInformation:{name:"",directoryNames:[],fileNames:[]}});var a=function(e){function r(t,r,o,a){e.call(this,t,r,o),this._resource=a,this._resourceLoaded=!1}return __extends(r,e),r.createDataGraphResourceReportParagraph=function(e,o){return new r(e,t.ParagraphType.DataGraph,o,e.reportModel.dataGraphModel.createNewModel())},r.createConceptMapperResourceReportParagraph=function(e,o){return new r(e,t.ParagraphType.ConceptMap,o,e.reportModel.conceptMapModel.createNewModel())},r.createTableToolResourceReportParagraph=function(e,o){return new r(e,t.ParagraphType.Table,o,e.reportModel.tableModel.createNewModel())},Object.defineProperty(r.prototype,"resource",{get:function(){return this._resource},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"resourceType",{get:function(){return this._resource.getResourceType()},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"resourceLoaded",{get:function(){return this._resourceLoaded},enumerable:!0,configurable:!0}),r.prototype.canBeUpdated=function(){return this.resourceLoaded},r.prototype.isNewerResource=function(e){var t=new Date(this._resource.getMetadata().published).getTime(),r=new Date(e.published).getTime();return r>t},r.prototype.updateFromLatestResourceMap=function(e){var t=this;if(this.canBeUpdated()){var r=e.get(this._resource.getId());if(r){var o=new Date(this._resource.getMetadata().published).getTime(),a=new Date(r.metadata.published).getTime();a>o&&this._resource.getStorageHandler().readResource(this._resource.getId(),function(e,r){if(e)throw e;t.updateContentFromLatestResource(r)})}}},r.prototype.tryUpdateLoadedResource=function(){var e=this;this.canBeUpdated()&&this.resource.getStorageHandler().readResource(this.resource.getId(),function(t,r){if(t)throw t;e.isNewerResource(r.metadata)&&e.updateContentFromLatestResource(r)})},r.prototype.updateContentFromLatestResource=function(e){this._resource.loadFromResource(e),this.resourceChanged()},r.prototype.resourceChanged=function(){this.reportSection.reportModel.reportActionLogger.logResourceUpdated(this),this.reportSection.reportModel.emitModelChanged()},r.prototype.loadResource=function(e){this._resource.loadFromResource(e),this._resourceLoaded=!0,this.reportSection.reportModel.emitModelChanged()},r.prototype.getJson=function(){var t=e.prototype.getJson.call(this);return t.resource=this._resource.getResource(),t.resourceLoaded=this.resourceLoaded,t},r.prototype.loadFromJson=function(t){e.prototype.loadFromJson.call(this,t),t.resource?this._resource.loadFromResource(t.resource):this._resource.clear(),"boolean"==typeof t.resourceLoaded?this._resourceLoaded=t.resourceLoaded:this._resourceLoaded=!1},r}(r);t.ResourceReportParagraph=a,t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.DataGraph,{creator:a.createDataGraphResourceReportParagraph,toolInformation:{name:"dataViewer",directoryNames:[],fileNames:["dataViewerTool"]}}),t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.ConceptMap,{creator:a.createConceptMapperResourceReportParagraph,toolInformation:{name:"conceptmapper",directoryNames:["conceptmap"],fileNames:[]}}),t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.Table,{creator:a.createTableToolResourceReportParagraph,toolInformation:{name:"tableTool",directoryNames:["tableTool"],fileNames:[]}});var n=function(e){function t(t,r,o,a){e.call(this,t,r,o,a),this._thing=null}return __extends(t,e),Object.defineProperty(t.prototype,"thingId",{get:function(){return this._thing?this._thing.id:""},set:function(e){this.setThingById(e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"things",{get:function(){throw"the sub class should override this method!"},enumerable:!0,configurable:!0}),t.prototype.setThingById=function(e){if(this._thing=null,e)for(var t=this.things,r=0,o=t;r<o.length;r++){var a=o[r];if(a.id===e){this._thing=a;break}}this.reportSection.emitModelChanged(!0)},Object.defineProperty(t.prototype,"thing",{get:function(){return this._thing},enumerable:!0,configurable:!0}),t.prototype.canBeUpdated=function(){return null!==this._thing},t.prototype.resourceChanged=function(){this.setThingById(this.thingId),this.reportSection.reportModel.reportActionLogger.logThingUpdated(this)},t.prototype.getJson=function(){var t=e.prototype.getJson.call(this);return t.thingId=this.thingId,t},t.prototype.loadFromJson=function(t){this._thing=null,e.prototype.loadFromJson.call(this,t),this.thingId=t.thingId},t}(a);t.ThingParagraph=n;var i=function(e){function r(r,o,a){e.call(this,r,t.ParagraphType.Question,o,a)}return __extends(r,e),r.createQuestionParagraph=function(e,t){var o=e.reportModel.questionsModel.createNewModel();return o.deleteQuestion(0),new r(e,t,o)},Object.defineProperty(r.prototype,"things",{get:function(){var e=this.resource.getQuestions();return e},enumerable:!0,configurable:!0}),r}(n);t.QuestionParagraph=i,t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.Question,{creator:i.createQuestionParagraph,toolInformation:{name:"questioning scratchpad",directoryNames:["questioning"],fileNames:[]}});var p=function(e){function r(r,o,a){e.call(this,r,t.ParagraphType.Hypothesis,o,a)}return __extends(r,e),r.createHypothesisParagraph=function(e,t){return new r(e,t,e.reportModel.hypothesesModel.createNewModel())},Object.defineProperty(r.prototype,"things",{get:function(){var e=this.resource.getHypotheses();return e},enumerable:!0,configurable:!0}),r}(n);t.HypothesisParagraph=p,t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.Hypothesis,{creator:p.createHypothesisParagraph,toolInformation:{name:"hypothesis scratchpad",directoryNames:["hypothesis"],fileNames:[]}});var s=function(e){function r(r,o,a){e.call(this,r,t.ParagraphType.Observation,o,a)}return __extends(r,e),r.createObservationReportParagraph=function(e,t){return new r(e,t,e.reportModel.observationsModel.createNewModel())},Object.defineProperty(r.prototype,"things",{get:function(){var e=this.resource.observations;return e},enumerable:!0,configurable:!0}),r}(n);t.ObservationReportParagraph=s,t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.Observation,{creator:s.createObservationReportParagraph,toolInformation:{name:"observationTool",directoryNames:["observationTool"],fileNames:[]}});var c=function(){function t(t,r,o,a,n){this._name=t,this._type=r,this._size=o,this._lastModified=a,this._content=n,this._id=e.commons.utils.generateUUID()}return t.createFromJson=function(e){var r=new t(e.name,e.type,e.size,e.lastModified,e.content);return r._id=e.id,r},Object.defineProperty(t.prototype,"id",{get:function(){return this._id},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"name",{get:function(){return this._name},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"size",{get:function(){return this._size},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"lastModified",{get:function(){return this._lastModified},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"content",{get:function(){return this._content},enumerable:!0,configurable:!0}),t.prototype.getJson=function(){return{id:this._id,name:this._name,type:this._type,size:this._size,lastModified:this._lastModified,content:this._content}},t.prototype.loadFromJson=function(e){this._id=e.id,this._name=e.name,this._type=e.type,this._size=e.size,this._lastModified=e.lastModified,this._content=e.content},t}();t.UploadedFile=c;var u=function(e){function r(r,o){e.call(this,r,t.ParagraphType.Image,o),this._images=[]}return __extends(r,e),r.createImageReportParagraph=function(e,t){return new r(e,t)},Object.defineProperty(r.prototype,"images",{get:function(){return this._images},enumerable:!0,configurable:!0}),r.prototype.addImage=function(e){this._images.push(e),this.reportSection.emitModelChanged(!0)},r.prototype.removeImageById=function(e){var t=this.findImageIndexById(e);t>=0&&(this._images.splice(t,1),this.reportSection.emitModelChanged(!0))},r.prototype.moveImageByIndex=function(e,t){if(e!==t){var r=this._images[e];this._images.splice(e,1),this._images.splice(t,0,r),this.reportSection.emitModelChanged(!0)}},r.prototype.findImageIndexById=function(e){for(var t=0;t<this._images.length;t++)if(this._images[t].id===e)return t;return-1},r.prototype.getJson=function(){var t=e.prototype.getJson.call(this);return t.images=this._images.map(function(e){return e.getJson()}),t},r.prototype.loadFromJson=function(t){var r=this;e.prototype.loadFromJson.call(this,t),this._images.length=0,t.images.forEach(function(e){var t=c.createFromJson(e);r._images.push(t)})},r}(r);t.ImageReportParagraph=u,t.reportParagraphFactory.addReportParagraphInformation(t.ParagraphType.Image,{creator:u.createImageReportParagraph,toolInformation:{name:"",directoryNames:[],fileNames:[]}})}(r=t.reportingtool||(t.reportingtool={}))}(t=e.tools||(e.tools={}))}(ut||(ut={}));
//# sourceMappingURL=reportParagraphs.js.map