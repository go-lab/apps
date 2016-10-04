(function(){"use strict";var t,a,e,n,o,r,i,l,s;window.ut=window.ut||{},ut.commons=ut.commons||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},window.google=window.google||{},window.google.visualization=window.google.visualization||{},t=window.JSONR||{},r=function(t,a){var e,n,o,r,i;for(r=[],n=0,i=a.length;n<i;n++)e=a[n],o=t.getDataSourceColumns().indexOf(e),r.push(o);return r},l=function(t,a){var e;return e=t.indexOf(a),e>=0&&(t.splice(e,1),!0)},e={},i=function(t){return t-0==t&&(""+t).replace(/^\s+|\s+$/g,"").length>0},o=function(t,a){var e,n,o,r,i;for(o=t.split(a),i=[],e=0,r=o.length;e<r;e++)n=o[e],i.push({id:n,label:n,type:"string",unit:"?",image:"unknown.png"});return i},n=function(t,a){var e,n,o,r,l,s,u;for(r=t.split(a),e=-1,s=[],n=0,l=r.length;n<l;n++)o=r[n],++e,u=i(o)?"number":"string",s.push({id:"id"+e,label:"label"+e,type:u,unit:"?",image:"unknown.png"});return s},s=function(t,a,e,n){var o,r,i,l,s,u,d,p,c,g,m,w,f,b,h,v;for(n.clear(),l=0,g=t.length;l<g;l++)o=t[l],h={imageInformation:{type:"commonImage",value:o.image}},i=new ut.tools.dataviewer.StoredDataSourceColumn(h,o),n.addDataSourceColumn(i);for(b=[],p=0,m=a.length;p<m;p++)if(f=a[p],f.length){for(d=f.split(e),r=[],s=0,c=0,w=d.length;c<w;c++)u=d[c],v=function(){switch(t[s].type){case"number":return{v:parseFloat(u)};default:return{v:u}}}(),r.push(v),s++;b.push(n.addDataRow(r))}return b},a=function(t,a,e){var r,i;return t.dataSourcesMarker={counter:0},t.dataSet=a,t.smartTableConfig={isPaginationEnabled:!1,isGlobalSearchActivated:!1,itemsByPage:200,syncColumns:!1,isSortable:!1},t.separators=[{chars:" ",display:"space"},{chars:",",display:"comma"},{chars:"\t",display:"tab"}],t.display={dataSetJson:"",resourceJson:""},r=function(a){var e,n,o,r;for(o=t.separators,e=0,n=o.length;e<n;e++)if(r=o[e],r.display===a)return r.chars;return console.log("unknow separator display: "+a),","},t.input={rawData:"",firstLineHeader:!1,separator:t.separators[0].display,lockColumns:!1},t.columnsColumns=[{label:"id",map:"id",isEditable:"true"},{label:"label",map:"label",isEditable:"true"},{label:"type",map:"type",isEditable:"true"},{label:"unit",map:"unit",isEditable:"true"},{label:"image",map:"image",isEditable:"true"}],t.columnRows=[],t.findColumns=function(){var a,e;return console.log("input raw data"),t.input.lockColumns===!1&&(a=t.input.rawData.split("\n"),e=r(t.input.separator),t.columnRows=t.input.firstLineHeader?o(a[0],e):n(a[0],e),console.log(t.columnRows)),i()},t.$on("updateDataRow",function(t,a){return console.log("updateDataRow event"),i()}),i=function(){var n,o,i,l;return o=t.input.rawData.split("\n"),t.input.firstLineHeader&&o.shift(),l=r(t.input.separator),s(t.columnRows,o,l,a),n=a.getResourceContent(),t.display.dataSetJson=JSON.stringify(n),i=e.getResourceBundle(n),t.display.resourceJson=JSON.stringify(i)}},ut.tools.dataviewer.dataViewerTool.controller("dataSetImporterCtrl",["$scope","dataSetModel","dataSetStorageHandler",a])}).call(this);
//# sourceMappingURL=dataSetImporterCtrl.js.map
