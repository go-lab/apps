var ut;!function(n){var t;!function(t){var o;!function(t){"use strict";function o(n){n.components.filter(function(n){return!(n.isWire()||"switch2Off"===n.getComponentType()||"lightBroken"===n.getComponentType())}).forEach(function(t){var o=new i(n.connectionLinks,t);n.componentSideConnectionPointsMap.put(t,o)})}var e=n.commons.tsutils.IdSet;t.createComponentSideConnectionPointsMap=o;var i=function(){function n(n,t){this._connectionLinks=n,this._component=t,this._side1=null,this._side2=null,this._shortCircuit=!1;var o=this.findConnectionLinksForComponent(t);if(o.length!==t.getDefinedNrOfConnections())throw console.error(t),console.error(o),new Error("expected to find "+t.getDefinedNrOfConnections()+" connection links for a component, but found "+o.length);if(2!==o.length)throw console.error(t),console.error(o),new Error("FindComponentSideConnectionPoints is only implemented for 2 connection links for a component, but found "+o.length);this._side1=this.findOneComponentSideConnectionPoints(o[0]),this._side2=this.findOneComponentSideConnectionPoints(o[1]),this._shortCircuit=this.findShortCircuit(this._side1)}return Object.defineProperty(n.prototype,"side1",{get:function(){return this._side1},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"side2",{get:function(){return this._side2},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"shortCircuit",{get:function(){return this._shortCircuit},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"component",{get:function(){return this._component},enumerable:!0,configurable:!0}),n.prototype.getSideByConnectionLink=function(n){if(this._side1.connectionLink.getId()===n.getId())return this.side1;if(this._side2.connectionLink.getId()===n.getId())return this.side2;throw new Error("cannot find find side for connection link: "+n.getId())},n.prototype.getSideByComponent=function(n){if(this.side1.connectedComponents.indexOf(n)>=0)return this._side1;if(this.side2.connectedComponents.indexOf(n)>=0)return this._side2;throw new Error("cannot find find side with connected commponent: "+n.getId())},n.prototype.getOtherSideByComponent=function(n){if(this.side1.connectedComponents.indexOf(n)>=0)return this._side2;if(this.side2.connectedComponents.indexOf(n)>=0)return this._side1;throw new Error("cannot find find side with connected commponent: "+n.getId())},n.prototype.getOtherSideByConnectionPoint=function(n){if(this.side1.connectedConnectionPoints.indexOf(n)>=0)return this._side2;if(this.side2.connectedConnectionPoints.indexOf(n)>=0)return this._side1;throw new Error("cannot find find side with connected connection point: "+n.getId())},n.prototype.getSideWithConnectionPoint=function(n){if(this.side1.connectedConnectionPoints.indexOf(n)>=0)return this._side1;if(this.side2.connectedConnectionPoints.indexOf(n)>=0)return this._side2;throw new Error("cannot find connection point in connected connection points: "+n.getId())},n.prototype.getSideWithoutConnectionPoint=function(n){if(this.side1.connectedConnectionPoints.indexOf(n)<0)return this._side1;if(this.side2.connectedConnectionPoints.indexOf(n)<0)return this._side2;throw new Error("connection point is connected at both sides: "+n.getId())},n.prototype.getOtherSideBySide=function(n){if(this.side1===n)return this.side2;if(this.side2===n)return this.side1;throw new Error("cannot find side")},n.prototype.findConnectionLinksForComponent=function(n){return this._connectionLinks.asArray().filter(function(t){return t.component===n})},n.prototype.findOneComponentSideConnectionPoints=function(n){var t=new c(this._connectionLinks,n);return{connectionPoint:n.toNode,connectionLink:n,connectedConnectionPoints:t.connectionPoints,connectedComponents:t.components}},n.prototype.findShortCircuit=function(n){var t=this;return n.connectedComponents.some(function(n){return n===t._component})},n.prototype.toNiceString=function(n){void 0===n&&(n="");var o="FindComponentSideConnectionPoints\n";o+=n+" component: "+this._component.getId()+"\n";var e=function(e,i){o+=n+" "+e+": connectionLink: "+i.connectionLink.getId()+", "+("connectionPoint: "+i.connectionPoint.getId()+"\n"),o+=n+"  connectedConnectionPoints: "+t.Node.nodesToIdsString(i.connectedConnectionPoints)+"\n",o+=n+"  connectedComponents: "+t.Node.nodesToIdsString(i.connectedComponents)+"\n"};return e("side1",this._side1),e("side2",this._side2),o+=n+" shortCircuit: "+this._shortCircuit+"\n"},n}();t.FindComponentSideConnectionPoints=i;var c=function(){function n(n,o){this._connectionLinks=n,this._visitedLinks=new t.NodeTracker,this._connectionPointSet=new e,this._componentSet=new e,this._connectionPoints=[],this._components=[],this.walkConnectionLinks(this.getForwardConnectionLinks(o)),this._connectionPoints=this._connectionPointSet.toArray(),this._components=this._componentSet.toArray()}return n.prototype.getForwardConnectionLinks=function(n){var t=this._connectionLinks.getFromLinks(n.toNode),o=t.filter(function(t){return t.toNode!==n.fromNode});return o},n.prototype.walkConnectionLinks=function(n){var t=this;n.forEach(function(n){if(!t._visitedLinks.isNodeVisited(n))if(t._visitedLinks.nodeVisited(n),t._connectionPointSet.add(n.fromNode),n.component.isWire()){if(!t._connectionPointSet.contains(n.toNode)){var o=t.getForwardConnectionLinks(n);o.length>0?t.walkConnectionLinks(o):t._connectionPointSet.add(n.toNode)}}else t._componentSet.add(n.component)})},Object.defineProperty(n.prototype,"connectionPoints",{get:function(){return this._connectionPoints},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"components",{get:function(){return this._components},enumerable:!0,configurable:!0}),n}()}(o=t.electricity||(t.electricity={}))}(t=n.simulations||(n.simulations={}))}(ut||(ut={}));
//# sourceMappingURL=findComponentConnectionPoints.js.map