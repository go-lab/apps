(function(){"use strict";var t,e,o,n=function(t,e){function o(){this.constructor=t}for(var n in e)i.call(e,n)&&(t[n]=e[n]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},i={}.hasOwnProperty;window.ut=window.ut||{},window.ut.commons=ut.commons||{},window.ut=window.ut||{},window.ut.tools=window.ut.tools||{},window.ut.tools.hypothesis=window.ut.tools.hypothesis||{},e={conditionals:["IF","THEN","increases","decreases","is larger than","is smaller than","is equal to","remains"],variables:["length","mass","time","electric current","thermodynamic temperature","amount of substance","luminous intensity"],checkboxes:!1,confidence:!0,freeInput:!0},t='<ul>\n    <li><b>Create a hypothesis</b> by dragging conditionals (e.g., if, then) and variables in the hypothesis box</li>\n    <li><b>Create your own elements</b> by writing them in the “type your own” box (and drag them to the hypothesis box)</li>\n    <li><b>Rearrange terms</b> by dragging them around</li>\n    <li><b>Delete terms</b> by dragging them to the trashcan</li>\n    <li><b>Add a hypothesis</b> by clicking the plus sign</li>\n    <li><b>Delete a hypothesis</b> by clicking the trashcan</li>\n    <li><b>Adjust your level of confidence</b> in a hypothesis by adjusting the "horseshoe" next to the hypothesis</li>\n</ul>',o={metadata:{actor:{objectType:"person",id:"unknown user@http://130.89.152.19:8080",displayName:"unknown user"},target:{objectType:"configuration",forApplication:"hypothesis scratchpad",id:"70ad09b4-7dc0-4a82-d71a-62bbf30d10bfssf",displayName:"initial configuration"},generator:{objectType:"application",url:"http://130.89.152.19:8080/golab/tools/hypothesis/src/main/webapp/hypothesis.html",id:"ce6fc3d0-c48e-4929-f282-a77bb97dcc57tgdv",displayName:"hypothesis scratchpad"},provider:{objectType:"ils",url:"http://130.89.152.19:8080/golab/tools/hypothesis/src/main/webapp/hypothesis.html",id:"http://130.89.152.19:8080",inquiryPhase:"unknown",displayName:"unknown"},published:"2014-09-30T08:15:08.148Z",id:"a0fee60f-7fc8-45c5-fccb-52616418d9cffsgsgrer"},content:e},window.ut.tools.hypothesis.HypothesisConfigurationModel=function(e){function i(e){i.__super__.constructor.call(this,e,t,"hypothesis"),this.conditionals=new window.ut.commons.NamedEventArray(this,"conditionals"),this.variables=new window.ut.commons.NamedEventArray(this,"variables")}return n(i,e),i.prototype.loadDefaultConfiguration=function(){},i.prototype.myLoadDefaultConfiguration=function(){return this.loadFromResource(o)},i.prototype.getResourceContent=function(){var t;return t=i.__super__.getResourceContent.call(this),t.conditionals=this.conditionals.getValues(),t.variables=this.variables.getValues(),t.checkboxes=this.checkboxes,t.confidence=this.confidence,t.freeInput=this.freeInput,t},i.prototype.loadFromResourceContent=function(t){return i.__super__.loadFromResourceContent.call(this,t),this.conditionals.setValues(t.conditionals),this.variables.setValues(t.variables),this.checkboxes=t.checkboxes,this.confidence=t.confidence,null!=t.freeInput?this.freeInput=t.freeInput:this.freeInput=!0},i.prototype.clearContent=function(){return this.conditionals.clear(),this.variables.clear(),i.__super__.clearContent.call(this)},i}(window.ut.commons.ConfigurationModel)}).call(this);
//# sourceMappingURL=hypothesisConfigurationModel.js.map