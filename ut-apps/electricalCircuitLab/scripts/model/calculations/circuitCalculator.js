(function(){"use strict";var t;window.ut=window.ut||{},ut.simulations=ut.simulations||{},ut.simulations.electricity=ut.simulations.electricity||{},t={branchGraphs:null},ut.simulations.electricity.CircuitCalculator=function(){function t(t){this.circuitResult=t,this.connectionPointStates={},this.totalCurrent=0,this.invertCurrent=!1}return t.prototype.calculateGraphProperties=function(t){var e,n,r,i,o,a,c,s,u,l,h,g,p,f,C,d,P,v,w,y,S,V,m,D,G;for(h=0,V=0,g=0,S=t.graphLinks,f=0,P=S.length;f<P;f++)if(p=S[f],p instanceof ut.simulations.electricity.BranchedGraphLink){if(m=!1,y=0,D=0,o=function(){var t,e,n,o;for(n=p.branchGraphs,o=[],t=0,e=n.length;t<e;t++){if(r=n[t],i=this.calculateGraphProperties(r),0!==i.voltage){if(0!==i.resistance)throw new Error("powerSupplyInBranch");++y}else 0===i.resistance&&(m=!0);D+=i.directionalDeltaVoltage,o.push(i)}return o}.call(this),a=0,e=0,y>0){if(y!==o.length)throw new Error("powerSupplyInBranch");for(C=0,v=o.length;C<v;C++)if(i=o[C],0===e)e=i.voltage;else if(e!==i.voltage)throw new Error("lateShortCircuit")}else if(!m){for(G=0,d=0,w=o.length;d<w;d++)i=o[d],G+=1/i.resistance;a=1/G}n=D/o.length,p.circuitProperties={voltage:e,resistance:a,directionalDeltaVoltage:n},h+=e,V+=a,g+=n}else s=p.connectionLink.getComponent(),u=p.fromNode.getConnectionPoint().getDirection(s),l=s.getVoltage(u),h+=l,s.isPowerSupply()&&(s.isPowerSupplyMinus(u)?g+=Math.abs(l):g-=Math.abs(l)),V+=s.getResistance();return c={voltage:h,resistance:V,directionalDeltaVoltage:g},t.circuitProperties=c,c},t.prototype.calculateTotalCurrent=function(t){var e,n,r,i,o;if(i=Date.now(),n=this.calculateGraphProperties(t),e=0,r=!1,0!==n.voltage){if(0===n.resistance)throw new Error("lateShortCircuit");e=n.voltage/n.resistance,r=n.directionalDeltaVoltage<0}return o=Date.now()-i,{current:e,invertCurrent:r}},t.prototype.calculateVoltages=function(t,e){var n;return(n=function(t){return function(e,r,i){var o,a,c,s,u,l,h,g,p,f,C,d,P,v,w,y,S,V,m,D,G,k,N;for(S=r,V=i.graphLinks,G=[],p=0,P=V.length;p<P;p++)if(g=V[p],g instanceof ut.simulations.electricity.BranchedGraphLink){if(N=g.circuitProperties.resistance,h=-g.circuitProperties.voltage,N>0)for(h=e*N,m=g.branchGraphs,f=0,v=m.length;f<v;f++)o=m[f],n(h/o.circuitProperties.resistance,S,o);else for(k=function(){var t,e,n,r;for(n=g.branchGraphs,r=[],t=0,e=n.length;t<e;t++)o=n[t],0===o.circuitProperties.resistance&&r.push(o);return r}(),C=0,w=k.length;C<w;C++)o=k[C],n(e/k.length,S,o);G.push(S-=h)}else{for(s=g.fromNode.getConnectionPoint(),t.setConnectionPointVoltage(s,S),t.addConnectionPointCurrent(s,e),D=g.fromNode.getDeadGraphNodes(),d=0,y=D.length;d<y;d++)l=D[d],u=l.getConnectionPoint(),t.setConnectionPointVoltage(u,S),t.addConnectionPointCurrent(u,0);a=g.getConnectionLink().getComponent(),c=s.getDirection(a),S+=a.getVoltage(c),G.push(S-=e*a.getResistance())}return G}}(this))(t,0,e)},t.prototype.calculateDeadEndVoltages=function(t){var e,n,r,i,o,a,c,s,u,l;for(s=0,e=function(t){return function(e){var n,r,i,o,a;for(t.setConnectionPointVoltage(e.getConnectionPoint(),s),o=e.getDeadGraphNodes(),a=[],r=0,i=o.length;r<i;r++)n=o[r],a.push(t.setConnectionPointVoltage(n.getConnectionPoint(),s));return a}}(this),e(t.beginNode),u=t.graphLinks,l=[],a=0,c=u.length;a<c;a++)o=u[a],i=o.fromNode.getConnectionPoint(),n=o.getConnectionLink().getComponent(),r=i.getDirection(n),s+=n.getVoltage(r),l.push(e(o.toNode));return l},t.prototype.getConnectionPointState=function(t){return this.connectionPointStates[t.getId()]||(this.connectionPointStates[t.getId()]={voltage:0,current:0}),this.connectionPointStates[t.getId()]},t.prototype.setConnectionPointVoltage=function(t,e){return this.getConnectionPointState(t).voltage=e},t.prototype.addConnectionPointCurrent=function(t,e){return this.getConnectionPointState(t).current+=this.invertCurrent?-e:e},t.prototype.clearStates=function(){return this.connectionPointStates={}},t.prototype.calculate=function(){var t;switch(this.clearStates(),this.circuitResult.state){case"noPowerSupply":case"shortCircuit":case"lateShortCircuit":case"toManyPowerSupplies":return this.totalCurrent=0;case"foundGraph":switch(this.circuitResult.graph.resultType){case"endNode":return t=this.calculateTotalCurrent(this.circuitResult.graph),this.totalCurrent=t.current,this.invertCurrent=t.invertCurrent,this.calculateVoltages(this.totalCurrent,this.circuitResult.graph);case"deadEnd":return this.totalCurrent=0,this.calculateDeadEndVoltages(this.circuitResult.graph)}break;default:return console.log("Can't calculate for state: "+this.circuitResult.state)}},t}()}).call(this);
//# sourceMappingURL=circuitCalculator.js.map