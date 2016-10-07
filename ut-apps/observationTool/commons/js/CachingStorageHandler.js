(function(){"use strict";var e,t,r,o,n,a,i,c,s,u,l,d=function(e,t){return function(){return e.apply(t,arguments)}};window.golab=window.golab||{},window.golab.ils=window.golab.ils||{},window.golab.ils.storage=window.golab.ils.storage||{},window.golab.ils.storage.memory=window.golab.ils.storage.memory||{},t=!1,r=!1,a="_goLabCache_",n="_goLabCacheInfo_",o=function(){var e,t;if(e=window.location.pathname,t=window.location.pathname.split("/"),t.length>1)switch(t[1].toLocaleLowerCase()){case"production":e=t[1];break;case"experiments":e=t[1],t.length>2&&(e+="/"+t[2]);break;default:e=""}return(window.location.protocol+"//"+window.location.host+"/"+e).toLowerCase()},i=o(),c=36e5,s=31536e6,l=1e4,u=100,window.golab.ils.storage.createCachingStorageHandler=function(r,o,n,a){var i;return null==a&&(a=null),"function"==typeof r.listAllResourcesForCaching?(i=new e(r,a),i._initCache(o,function(e){return e?n(e,null):(t&&console.log("CachingStorageHandler: created for "+r.getDebugLabel()),n(null,i))})):(t&&console.log("CachingStorageHandler: cannot use, because it is not supported by "+r.getDebugLabel()),n(null,r))},window.golab.ils.storage.clearCachingStorageHandlerCache=function(){if(delete window.sessionStorage[n],t)return console.log("CachingStorageHandler: cleared the cache")},e=function(){function e(e,r){this.storageHandler=e,null==r&&(r=null),this.getResourceBundle=d(this.getResourceBundle,this),this.createResource=d(this.createResource,this),this._debug=t,r?this.debugLabel="CachingStorageHandler("+r+" - "+this.storageHandler.getDebugLabel()+")":this.debugLabel="CachingStorageHandler("+this.storageHandler.getDebugLabel()+")",this.cacheStorage=window.sessionStorage,this.cacheInfo=null,this.ready=!1,this._debug&&console.log(this.debugLabel+": object created")}return e.prototype.storeImage=function(e,t){return this.storageHandler.storeImage(e,t)},e.prototype.readImage=function(e,t){return this.storageHandler.readImage(e,t)},e.prototype.getDebugLabel=function(){return this.debugLabel},e.prototype._getCacheInfo=function(){var e,t,r;if(t=this.cacheStorage.getItem(n),t&&t.length>20){e=null;try{e=JSON.parse(t)}catch(e){r=e,this._debug&&console.warn(this.debugLabel+": error parsing cache info "+t+", error: "+r)}return e}return null},e.prototype._isCacheKey=function(e){return 0===e.indexOf(a)},e.prototype._updateCacheInfo=function(){return this.cacheInfo.lastModified=Date.now(),this.cacheStorage.setItem(n,JSON.stringify(this.cacheInfo))},e.prototype._initCache=function(e,t){var o,n,d,g,h,f,p,b;return h=function(e){return function(t){var r;return r=null!=e.storageHandler.getMetadataHandler().getMetadata().contextualActor?e.storageHandler.getMetadataHandler().getMetadata().contextualActor.id:e.storageHandler.getMetadataHandler().getActor().id,t.url===i&&t.actorId===r&&Date.now()-t.lastModified<c}}(this),b=function(e){return function(r){return r.initialized?(e.cacheInfo=r,e.ready=!0,e._debug&&console.log(e.debugLabel+": cache ready for use, nr items in sessionStorage: "+e.cacheStorage.length),t(null)):Date.now()>f?(console.warn(e.debugLabel+": waited long enough for cache initializing by someone else, now doing it myself"),g()):(Date.now()>p&&(console.warn(e.debugLabel+": still waiting for cache initializing by someone else."),p+=l),e._debug&&console.log(e.debugLabel+": waiting for cache initializing by someone else."),setTimeout(function(){return b(e._getCacheInfo())},u))}}(this),d=function(e){return function(t){return e.storageHandler.listAllResourcesForCaching(function(o,n){var i,c,s;if(o)return e.ready=!1,t(o);for(i=0,c=n.length;i<c;i++)s=n[i],e._isValidResource(s)?e.cacheStorage[a+s.metadata.id]=JSON.stringify(s):(o="invalid resource for cache",console.warn(o+", resource:"),console.warn(s));return e._debug&&console.log(e.debugLabel+": cacheInfo: "+JSON.stringify(e._getCacheInfo())),e.cacheInfo.initialized=!0,e._updateCacheInfo(),e.ready=!0,e._debug&&(console.warn("cache created, contents:"),console.warn(e.cacheStorage)),(e._debug||r)&&console.log(e.debugLabel+": created cache and filled it with "+n.length+" resources."),t(null)})}}(this),n=function(e){return function(){var t,r,o,n,a,i,c,s;for(s=[],t=r=0,i=e.cacheStorage.length;0<=i?r<i:r>i;t=0<=i?++r:--r)n=e.cacheStorage.key(t),e._isCacheKey(n)&&s.push(t);for(o=0,a=s.length;o<a;o++)c=s[o],e.cacheStorage.removeItem(c);return e._debug&&console.log(e.debugLabel+": cache cleared by deleting "+s.length+" resources"),e._updateCacheInfo()}}(this),g=function(e){return function(){var r;return e._debug&&console.log(e.debugLabel+": initializing...."),r=null!=e.storageHandler.getMetadataHandler().getMetadata().contextualActor?e.storageHandler.getMetadataHandler().getMetadata().contextualActor.id:e.storageHandler.getMetadataHandler().getActor().id,e.cacheInfo={url:i,actorId:r,created:Date.now(),initialized:!1},e._updateCacheInfo(),n(),e._debug&&console.log(e.debugLabel+": initialized cache."),d(t)}}(this),o=this._getCacheInfo(),e&&o&&h(o)?((this._debug||r)&&console.log(this.debugLabel+": found valid cache."),p=Date.now()+l,f=Date.now()+s,b(o)):g()},e.prototype._isValidResource=function(e){return"object"==typeof e&&"object"==typeof e.metadata&&"string"==typeof e.metadata.id},e.prototype._updateResourceInCache=function(e){return!!this._isValidResource(e)&&(this.cacheStorage.setItem(a+e.metadata.id,JSON.stringify(e)),this._updateCacheInfo(),!0)},e.prototype._checkForReady=function(){if(!this.ready)throw new Error(this.debugLabel+": not ready!")},e.prototype.readLatestResource=function(e,t){return this._checkForReady(),this.listResourceMetaDatas(function(r){return function(o,n){var a;return null!=o?setTimeout(function(){return t(o,void 0)},0):(a=r.storageHandler._findLatestResourceId(e,n),a?(r._debug&&console.log(r.debugLabel+".readLatestResource("+e+"): "+a),r.readResource(a,t)):(r._debug&&console.log(r.debugLabel+".readLatestResource("+e+"): nothing found"),setTimeout(function(){return t(null,null)},0)))}}(this))},e.prototype.readResource=function(e,t){var r,o,n;return this._checkForReady(),r=null,o=this.cacheStorage.getItem(a+e),o&&(n=JSON.parse(o),n.content&&(r=n)),r?(this._debug&&console.log(this.debugLabel+".readResource("+e+") fetched from cache"),setTimeout(function(){return t(null,r)})):(this._debug&&console.log(this.debugLabel+".readResource("+e+") not in cache"),this.storageHandler.readResource(e,function(e){return function(r,o){return!r&&o&&(e._updateResourceInCache(o)||(r="read returned invalid resource",console.warn(r+", resource:"),console.warn(o))),t(r,o)}}(this)))},e.prototype.resourceExists=function(e,t){var r;return this._checkForReady(),r=this.cacheStorage.getItem(a+e),r?(this._debug&&console.log(this.debugLabel+".resourceExists("+e+") fetched from cache"),setTimeout(function(){return t(null,!0)})):(this._debug&&console.log(this.debugLabel+".resourceExists("+e+") not in cache"),this.storageHandler.resourceExists(e,function(e,r){return t(e,r)}))},e.prototype.createResource=function(e,t){return this._checkForReady(),this.storageHandler.createResource(e,function(e){return function(r,o){return!r&&o&&(e._updateResourceInCache(o),e._updateResourceInCache(o)||(r="create returned invalid resource",console.warn(r+", resource:"),console.warn(o))),t(r,o)}}(this))},e.prototype.updateResource=function(e,t,r){var o,n;return this._checkForReady(),n=this.getResourceBundle(t,e),this._updateResourceInCache(n)?this.storageHandler.updateResource(e,t,function(e){return function(t,o){return!t&&o&&(e._updateResourceInCache(o),e._updateResourceInCache(o)||(t="update returned invalid resource",console.warn(t+", resource:"),console.warn(o))),r(t,o)}}(this)):(o="failed to create valid resource bundle",console.warn(o+", resource:"),console.warn(n),setTimeout(function(){return r(o,null)}))},e.prototype.deleteResource=function(e,t){return this._checkForReady(),this.storageHandler.deleteResource(e,function(r){return function(o){return o||(r.cacheStorage.removeItem(a+e),r._updateCacheInfo()),t(o)}}(this))},e.prototype.listResourceIds=function(e){var t,r,o,n,a,i,c;for(this._checkForReady(),i=[],t=r=0,n=this.cacheStorage.length;0<=n?r<n:r>n;t=0<=n?++r:--r)o=this.cacheStorage.key(t),this._isCacheKey(o)&&(c=this.cacheStorage.getItem(o),a=JSON.parse(c),a.id=a.metadata.id,i.push(a.metadata.id));return this._debug&&console.log(this.debugLabel+".listResourceIds() fetched from cache"),setTimeout(function(){return e(null,i)},0)},e.prototype.listResourceMetaDatas=function(e){var t,r,o,n,a,i,c,s,u;for(this._checkForReady(),s=0,t=[],r=o=0,i=this.cacheStorage.length;0<=i?o<i:o>i;r=0<=i?++o:--o)n=this.cacheStorage.key(r),this._isCacheKey(n)&&(++s,u=this.cacheStorage.getItem(n),c=JSON.parse(u),delete c.content,c.id=c.metadata.id,t.push(c));return a=this.storageHandler.applyFilters(t),this._debug&&console.log(this.debugLabel+".listResourceMetaDatas() fetched from cache: "+a.length),setTimeout(function(){return e(null,a)},0)},e.prototype.generateUUID=function(){return this.storageHandler.generateUUID()},e.prototype.configureFilters=function(){var e;return(e=this.storageHandler).configureFilters.apply(e,arguments)},e.prototype.setForResourceTypeFilter=function(e){return this.storageHandler.setForResourceTypeFilter(e)},e.prototype.getForResourceTypeFilter=function(){return this.storageHandler.getForResourceTypeFilter()},e.prototype.setForUserFilter=function(e){return this.storageHandler.setForUserFilter(e)},e.prototype.getForUserFilter=function(){return this.storageHandler.getForUserFilter()},e.prototype.setForProviderFilter=function(e){return this.storageHandler.setForProviderFilter(e)},e.prototype.getForProviderFilter=function(){return this.storageHandler.getForProviderFilter()},e.prototype.setForAppIdFilter=function(e){return this.storageHandler.setForAppIdFilter(e)},e.prototype.getForAppIdFilter=function(){return this.storageHandler.getForAppIdFilter()},e.prototype.setCustomFilter=function(e){return this.storageHandler.setCustomFilter(e)},e.prototype.getCustomFilter=function(){return this.storageHandler.getCustomFilter()},e.prototype.getMetadataHandler=function(){return this.storageHandler.getMetadataHandler()},e.prototype.getResourceDescription=function(e){return this.storageHandler.getResourceDescription(e)},e.prototype.getResourceBundle=function(){var e;return(e=this.storageHandler).getResourceBundle.apply(e,arguments)},e}()}).call(this);
//# sourceMappingURL=CachingStorageHandler.js.map