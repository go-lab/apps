(function(){"use strict";var o,n;window.ut=window.ut||{},ut.commons=ut.commons||{},ut.tools=ut.tools||{},ut.tools.conclusions=ut.tools.conclusions||{},o=function(o,n,t){var e,s,l,i,c,r,u,a;for(c=document.styleSheets,e=0,l=c.length;e<l;e++)if(a=c[e],u=a.cssRules?a.cssRules:a.rules){if(a.href&&t&&a.href.lastIndexOf(t)<0)continue;for(s=0,i=u.length;s<i;s++)if(r=u[s],r.selectorText&&r.selectorText===o)return r.style[n]}return null},n=function(o){return{restrict:"E",template:'<knob knob-data="confidence" knob-options="options" Xclass="hypothesisConfidence"></knob>',scope:{confidence:"="},link:function(o,n,t){var e,s,l,i,c,r;if(c=!1,t.readonly&&(c="true"===t.readonly.toLowerCase()),i="#5050D2",l="#a8a8a8",s="#abaeff",e="#c8c8c8",r=60,o.options={width:r,height:r,thickness:.65,angleOffset:-125,angleArc:250,min:0,max:100,step:10,fgColor:i,bgColor:l,displayInput:!1},c)return o.options.fgColor=s,o.options.bgColor=e,o.options.readOnly=!0}}},ut.tools.conclusions.conclusionTool.directive("hypothesisConfidence".toLowerCase(),["languageHandler",n])}).call(this);
//# sourceMappingURL=hypothesisConfidence.js.map