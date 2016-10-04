(function(){"use strict";var t=function(t,n){function o(){this.constructor=t}for(var i in n)e.call(n,i)&&(t[i]=n[i]);return o.prototype=n.prototype,t.prototype=new o,t.__super__=n.prototype,t},e={}.hasOwnProperty;window.ut=window.ut||{},window.ut.tools=window.ut.tools||{},window.ut.tools.questioning=window.ut.tools.questioning||{},window.ut.tools.questioning.QuestionsModel=function(e){function n(t){n.__super__.constructor.call(this,t,"questions"),this.clearContent()}return t(n,e),n.prototype.createNewModel=function(){return new window.ut.tools.questioning.QuestionsModel(this.environmentHandlers)},n.prototype.getResourceContent=function(){var t,e,n,o;for(t=JSON.parse(JSON.stringify(this._content)),e=0,n=t.length;e<n;e++)o=t[e],delete o.$$hashKey,delete o.lastDrop.$$hashKey;return t},n.prototype.getResourceContentWithHashkeys=function(){return this._content},n.prototype.loadFromResourceContent=function(t){return this._content=t},n.prototype.clearContent=function(){return this._content=[],this.addQuestion()},n.prototype.addQuestion=function(){var t;return t={id:ut.commons.utils.generateUUID(),text:"",lastDrop:{}},this._content.push(t),this.emitModelChanged(),t},n.prototype.setQuestion=function(t,e){return this._content[e].text=t,this.emitModelChanged(),this._content[e]},n.prototype.deleteQuestion=function(t){var e;return e=this._content[t].id,this._content.splice(t,1),this.emitModelChanged(),e},n.prototype.getQuestions=function(){return this._content},n.prototype.addTerm=function(t,e){return this._content[t].text=this._content[t].text+e,this.emitModelChanged(),this._content[t]},n}(window.ut.commons.ResourceEventEmitterModel)}).call(this);
//# sourceMappingURL=QuestionsModel.js.map