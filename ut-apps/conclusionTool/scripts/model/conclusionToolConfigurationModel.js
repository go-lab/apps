(function(){"use strict";var t,e,s,o,n=function(t,e){function s(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return s.prototype=e.prototype,t.prototype=new s,t.__super__=e.prototype,t},i={}.hasOwnProperty;window.ut=window.ut||{},ut.commons=ut.commons||{},ut.tools=ut.tools||{},ut.tools.conclusions=ut.tools.conclusions||{},s={},e="<ul>\n    <li>\n        <b>Select a hypothesis or question</b> by clicking it and do the following:\n        <ul>\n          <li>\n              <b>Add one or more data graphs and/or observations</b> by clicking the plus icon\n          </li>\n          <li>\n              <b>Double click on the added data or observation</b> for more information\n          </li>\n          <li>\n              <b>Adjust the confidence level</b> of the hypothesis, if available\n          </li>\n          <li>\n              <b>Explain your change</b> or <b>describe what you have learned</b> by typing in text in the text box\n          </li>\n        </ul>\n    </li>\n    <li>\n        <b>Select the next hypothesis or question</b> and repeat the steps above\n    </li>\n</ul>",o={metadata:{actor:{objectType:"person",id:"unknown user@http://130.89.152.19:8080",displayName:"unknown user"},target:{objectType:"configuration",forApplication:"conclusionTool",id:"70ad09b4-7dc0-4a82-d71a-62bbf30d10bfssf",displayName:"initial configuration"},generator:{objectType:"application",url:"http://130.89.152.19:8080/golab/tools/hypothesis/src/main/webapp/hypothesis.html",id:"ce6fc3d0-c48e-4929-f282-a77bb97dcc57tgdv",displayName:"conclusionTool"},provider:{objectType:"ils",url:"http://130.89.152.19:8080/golab/tools/hypothesis/src/main/webapp/hypothesis.html",id:"http://130.89.152.19:8080",inquiryPhase:"unknown",displayName:"unknown"},published:"2014-09-30T08:15:08.148Z",id:"a0fee60f-7fc8-45c5-fccb-52616418d9cffsgsgrer"},content:s},t={useDataGraphs:!0,useObservations:!0,showHypothesisConfidenceMeter:!0},ut.tools.conclusions.ConclusionToolConfigurationModel=function(e){function s(e,o){s.__super__.constructor.call(this,e),this._useDataSets=t.useDataGraphs,this._useObservations=t.useObservations,this._showHypothesisConfidenceMeter=t.showHypothesisConfidenceMeter,Object.defineProperties(this,{useDataGraphs:{get:this.getUseDataSets,set:this.setUseDataSets},useExamples:{get:this.getShowLoadExamples,set:this.setShowLoadExamples},useObservations:{get:this.getUseObservations,set:this.setUseObservations},noDataOptions:{get:this.getNoDataOptions},showHypothesisConfidenceMeter:{get:this.getShowHypothesisConfidenceMeter,set:this.setShowHypothesisConfidenceMeter}})}return n(s,e),s.prototype.getUseDataSets=function(){return this._useDataSets},s.prototype.setUseDataSets=function(t){if(this._useDataSets!==t)return this._useDataSets=t,this.emitModelChanged()},s.prototype.getUseObservations=function(){return this._useObservations},s.prototype.setUseObservations=function(t){if(this._useObservations!==t)return this._useObservations=t,this.emitModelChanged()},s.prototype.getNoDataOptions=function(){return!(this.useDataGraphs||this.useExamples||this.useObservations)},s.prototype.getShowHypothesisConfidenceMeter=function(){return this._showHypothesisConfidenceMeter},s.prototype.setShowHypothesisConfidenceMeter=function(t){if(this._showHypothesisConfidenceMeter!==t)return this._showHypothesisConfidenceMeter=t,this.emitModelChanged()},s.prototype.loadDefaultConfiguration=function(){return this.loadFromResource(o)},s.prototype.loadFromResourceContent=function(e){return s.__super__.loadFromResourceContent.call(this,e),this._useDataSets=this.getJsonProperty(e,"useDataGraphs",t),this._useObservations=this.getJsonProperty(e,"useObservations",t),this._showHypothesisConfidenceMeter=this.getJsonProperty(e,"showHypothesisConfidenceMeter",t)},s.prototype.getResourceContent=function(){var t;return t=s.__super__.getResourceContent.call(this),t.useDataGraphs=this.getUseDataSets(),t.useObservations=this.getUseObservations(),t.showHypothesisConfidenceMeter=this.getShowHypothesisConfidenceMeter(),t},s}(window.ut.commons.ConfigurationModel)}).call(this);
//# sourceMappingURL=conclusionToolConfigurationModel.js.map
