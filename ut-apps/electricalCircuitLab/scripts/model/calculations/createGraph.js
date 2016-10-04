(function(){"use strict";var t;window.ut=window.ut||{},ut.simulations=ut.simulations||{},ut.simulations.electricity=ut.simulations.electricity||{},t={},ut.simulations.electricity.CreateGraph=function(){function t(t,n,o){var i,e,r,s;this.connectionPoints=t,this.connectionLinks=n,this.components=o,this.debug=ut.simulations.electricity.debugModelCalculations,r=this.countPowerSupplies(),i=0,e=0,r&&(i=this.countBatteries(),e=this.countOhmMeterSources()),this.circuitResult={state:"not started",error:!0,graph:null,nrOfPowerSupplies:r},0===r?(this.circuitResult.state="noPowerSupply",this.circuitResult.error=!1):r>1&&r!==i?this.circuitResult.state=e>1?"toManyOhmMeterSources":e>0?"ohmMeterPowerSupplyCombination":"toManyPowerSupplies":(s=this.findStartLink(),s&&(this.circuitResult=this.createGraph(s)))}return t.prototype.countPowerSupplies=function(){var t,n,o,i;o=0,i=this.components;for(n in i)t=i[n],t.isPowerSupply()&&++o;return o},t.prototype.countBatteries=function(){var t,n,o,i;o=0,i=this.components;for(n in i)t=i[n],t.isBattery()&&++o;return o},t.prototype.countOhmMeterSources=function(){var t,n,o,i;o=0,i=this.components;for(n in i)t=i[n],t.isOmhMeterSource()&&++o;return o},t.prototype.findStartLink=function(){var t,n,o,i,e,r,s,c,u,l,a,p,h,f,g,m,d;if(e=function(t){var n,o;return o=new ut.simulations.electricity.GraphNode(t.fromNode),n=new ut.simulations.electricity.GraphNode(t.toNode),new ut.simulations.electricity.GraphLink(o,n,t)},1===this.circuitResult.nrOfPowerSupplies){for(f=this.connectionLinks.asArray(),r=0,l=f.length;r<l;r++)if(n=f[r],n.component.isPowerSupply()&&(t=n.fromNode.getDirection(n.component),n.component.isPowerSupplyMinus(t)))return this.debug&&console.log("found start connectionLink (with power supply): "+n),e(n)}else for(g=this.connectionLinks.asArray(),s=0,a=g.length;s<a;s++)if(n=g[s],n.component.isNonPowerSupplyComponent())return this.debug&&console.log("found start connectionLink (non power supply): "+n),e(n);for(m=this.connectionPoints,c=0,p=m.length;c<p;c++)if(i=m[c],i.isArtificial()&&(o=this.connectionLinks.getFromLinks(i),o.length>0))return this.debug&&console.log("found start connectionLink (from split or cross): "+i),e(o[0]);for(d=this.connectionPoints,u=0,h=d.length;u<h;u++)if(i=d[u],o=this.connectionLinks.getFromLinks(i),1===o.length)return this.debug&&console.log("found start connectionLink (at circuit begin): "+i),e(o[0]);return this.connectionLinks.asArray().length>0?(this.debug&&console.log("found start connectionLink (just the first): "+i),e(this.connectionLinks.asArray()[0])):(this.debug&&console.log("failed to find a start connectionLink"),null)},t.prototype.createGraph=function(t){var n,o;return o={state:"not started",graph:null},null!==t&&(n=new ut.simulations.electricity.CreateDirectedGraph(this.components,this.connectionPoints,this.connectionLinks,t),o=n.result),o},t.prototype.getConnectionPoint=function(t,n){var o,i,e,r,s,c,u,l;for(c=this.connectionPoints,i=0,e=c.length;i<e;i++)if(o=c[i],r=null!=(u=o.getComponent1())?u.getPositionId():void 0,s=null!=(l=o.getComponent2())?l.getPositionId():void 0,r===t&&s===n||r===n&&s===t)return o;return null},t}()}).call(this);
//# sourceMappingURL=createGraph.js.map
