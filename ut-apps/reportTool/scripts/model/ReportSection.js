"use strict";var ut;!function(t){var r;!function(r){var e;!function(r){var e=function(){function e(t,r){this._reportModel=t,this._reportSectionConfiguration=null,this._id="",this._title="",this._explanation="",this._reportParagraphs=[],this.newReportSectionConfiguration(r),this.addInitialContent()}return e.createNewReportSectionFromJson=function(t,r){var o=new e(t,null);return o._id=r.id,o.loadFromJson(r),o},e.prototype.createNewReportParagraph=function(t,e){return void 0===e&&(e=""),r.reportParagraphFactory.createReportParagraph(t,this,e)},e.prototype.newReportSectionConfiguration=function(t){var r=this;this._reportSectionConfiguration&&(this._reportSectionConfiguration.reportingToolConfigurationModel.removeListener("reportElementTitleChanged"),this._reportSectionConfiguration.reportingToolConfigurationModel.removeListener("reportElementExplanationChanged")),this._reportSectionConfiguration=t,this._reportSectionConfiguration&&(this._id=this._reportSectionConfiguration.id,this._title=this._reportSectionConfiguration.title,this._explanation=this._reportSectionConfiguration.explanation,this._reportSectionConfiguration.reportingToolConfigurationModel.addListener("reportElementTitleChanged",function(t,e){r.id===t&&(r._title=r._reportSectionConfiguration.title)}),this._reportSectionConfiguration.reportingToolConfigurationModel.addListener("reportElementExplanationChanged",function(t,e){r.id===t&&(r._explanation=r._reportSectionConfiguration.explanation)}))},Object.defineProperty(e.prototype,"reportModel",{get:function(){return this._reportModel},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"id",{get:function(){return this._id},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"title",{get:function(){return this._title},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"explanation",{get:function(){return this._explanation},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"reportParagraphs",{get:function(){return this._reportParagraphs.every(function(t){return void 0!==t})||(this._reportParagraphs=this._reportParagraphs.filter(function(t){return void 0!==t})),this._reportParagraphs},enumerable:!0,configurable:!0}),e.prototype.addReportParagraph=function(t,r){return this._reportParagraphs.push(t),t.reportSection=this,r&&this.emitModelChanged(!0),!0},e.prototype.removeReportParagraph=function(t,r){var e=this.findReportParagraphIndex(t);return e>=0&&(this._reportParagraphs.splice(e,1),t.reportSection=null,r&&this.emitModelChanged(!0),!0)},e.prototype.moveReportParagraphToIndex=function(t,r,e){var o=this.findReportParagraphIndex(t);return o>=0&&o!==r&&(this._reportParagraphs.splice(o,1),this._reportParagraphs.splice(r,0,t),e&&this.emitModelChanged(!0),!0)},e.prototype.findReportParagraphById=function(t){for(var r=0,e=this.reportParagraphs;r<e.length;r++){var o=e[r];if(o.id===t)return o}return null},e.prototype.findReportParagraphIndex=function(t){return this._reportParagraphs.indexOf(t)},e.prototype.emitModelChanged=function(t){void 0===t&&(t=!0),this._reportModel.emitModelChanged(t)},Object.defineProperty(e.prototype,"initialTextReportParagraphId",{get:function(){return this.id+"-text"},enumerable:!0,configurable:!0}),e.prototype.addInitialContent=function(){var t=this.createNewReportParagraph(r.ParagraphType.Text,this.initialTextReportParagraphId);this.addReportParagraph(t,!1)},e.prototype.clear=function(){this._reportParagraphs.length=0,this.addInitialContent()},e.prototype.isEmpty=function(){if(this._reportParagraphs.length>1)return!1;if(0===this._reportParagraphs.length)return!0;if(this._reportParagraphs[0].id===this.initialTextReportParagraphId){var t=this._reportParagraphs[0];return 0===t.text.length}return!1},e.prototype.getJson=function(){return{id:this.id,title:this._title,explanation:this._explanation,paragraphs:this.reportParagraphs.map(function(t){return t.getJson()})}},e.prototype.loadReportParagraphsFromJson=function(e){var o=this;this._reportParagraphs.length=0,e.forEach(function(e){var i=t.commons.tsutils.nameToEnum(r.ParagraphType,e.paragraphType),n=o.createNewReportParagraph(i);n.loadFromJson(e),o.addReportParagraph(n,!1)})},e.prototype.loadFromJson=function(t){this.id===t.id?(this._title=t.title,this._explanation=t.explanation,this.loadReportParagraphsFromJson(t.paragraphs)):console.warn("trying loadFromJson("+JSON.stringify(t)+", but the id is not "+this.id+")")},e}();r.ReportSection=e}(e=r.reportingtool||(r.reportingtool={}))}(r=t.tools||(t.tools={}))}(ut||(ut={}));
//# sourceMappingURL=ReportSection.js.map