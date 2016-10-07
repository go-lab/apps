(function(){"use strict";var t,n,o,e=function(t,n){function o(){this.constructor=t}for(var e in n)i.call(n,e)&&(t[e]=n[e]);return o.prototype=n.prototype,t.prototype=new o,t.__super__=n.prototype,t},i={}.hasOwnProperty;window.ut=window.ut||{},window.ut.commons=ut.commons||{},window.ut=window.ut||{},window.ut.tools=window.ut.tools||{},window.ut.tools.questioning=window.ut.tools.questioning||{},n={conditionals:["How","Why","When","If","then","larger than","smaller than","remains equal","increases","decreases"],variables:["length","mass","time","electric current","thermodynamic temperature","amount of substance","luminous intensity"]},t="<ul>\n    <li><b>Create a question</b> by dragging elements to the question box<br>\n    Complete the question by typing your own text in the question box</li>\n    <li><b>Add a question</b> by clicking the plus sign</li>\n    <li><b>Delete a question</b> by clicking the trashcan</li>\n</ul>",o={metadata:{actor:{objectType:"person",id:"unknown user@http://130.89.152.19:8080",displayName:"unknown user"},target:{objectType:"configuration",forApplication:"questioning scratchpad",id:"70ad09b4-7dc0-4a82-d71a-62bbf30d10bfssf",displayName:"initial configuration"},generator:{objectType:"application",url:"http://130.89.152.19:8080/golab/tools/questioning/src/main/webapp/questioning.html",id:"ce6fc3d0-c48e-4929-f282-a77bb97dcc57tgdv",displayName:"questioning scratchpad"},provider:{objectType:"ils",url:"http://130.89.152.19:8080/golab/tools/questioning/src/main/webapp/questioning.html",id:"http://130.89.152.19:8080",inquiryPhase:"unknown",displayName:"unknown"},published:"2014-09-30T08:15:08.148Z",id:"a0fee60f-7fc8-45c5-fccb-52616418d9cffsgsgrer"},content:n},window.ut.tools.questioning.QuestionsConfigurationModel=function(n){function i(n){i.__super__.constructor.call(this,n,t,"questioning"),this.conditionals=new window.ut.commons.NamedEventArray(this,"conditionals"),this.variables=new window.ut.commons.NamedEventArray(this,"variables")}return e(i,n),i.prototype.loadDefaultConfiguration=function(){},i.prototype.myLoadDefaultConfiguration=function(){return this.loadFromResource(o)},i.prototype.getResourceContent=function(){var t;return t=i.__super__.getResourceContent.call(this),t.conditionals=this.conditionals.getValues(),t.variables=this.variables.getValues(),t},i.prototype.loadFromResourceContent=function(t){return i.__super__.loadFromResourceContent.call(this,t),this.conditionals.setValues(t.conditionals),this.variables.setValues(t.variables)},i.prototype.clearContent=function(){return this.conditionals.clear(),this.variables.clear(),i.__super__.clearContent.call(this)},i}(window.ut.commons.ConfigurationModel)}).call(this);
//# sourceMappingURL=QuestionsConfigurationModel.js.map