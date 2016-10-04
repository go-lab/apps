(function(){"use strict";var t,e=function(t,e){function a(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return a.prototype=e.prototype,t.prototype=new a,t.__super__=e.prototype,t},o={}.hasOwnProperty;window.ut=window.ut||{},ut.commons=ut.commons||{},ut.commons.ResourceEventEmitterModel=ut.commons.ResourceEventEmitterModel||{},ut.tools=ut.tools||{},ut.tools.dataviewer=ut.tools.dataviewer||{},window.google=window.google||{},window.google.visualization=window.google.visualization||{},t={imageUrl:"",unit:"",DataSourceColumn:null},ut.tools.dataviewer.StoredDataSourceColumn=function(t){function o(t,e){this.description=t instanceof ut.commons.DataSourceColumn?{imageInformation:t.getImageInformation(),type:t.getType(),id:t.getId(),label:t.getLabel(),unit:t.getUnit()}:{imageInformation:t.imageInformation,type:e.type,id:e.id,label:e.label,unit:t.unit}}return e(o,t),o.prototype.getImageInformation=function(){return this.description.imageInformation},o.prototype.getId=function(){return this.description.id},o.prototype.getType=function(){return this.description.type},o.prototype.getLabel=function(){return this.description.label},o.prototype.getUnit=function(){return this.description.unit},o.prototype.getValue=function(){return null},o.prototype.getJson=function(){return this.description,{imageInformation:this.description.imageInformation,unit:this.description.unit}},o}(ut.commons.DataSourceColumn),ut.tools.dataviewer.DataSet=function(t){function o(t){o.__super__.constructor.call(this,t,"dataSet"),this.actionLogger=new ut.tools.dataviewer.DataSetActionLogger(this.actionLogger),this.dataTable=new google.visualization.DataTable,this.dataSourceColumns=[]}return e(o,t),o.prototype.createNewModel=function(){return new window.ut.tools.dataviewer.DataSet(this.environmentHandlers)},o.prototype.getDataSetActionLogger=function(){return this.actionLogger},o.prototype.isEmpty=function(){return 0===this.dataSourceColumns.length},o.prototype.equals=function(t){var e,o,a;return e=function(t){var e,o;return e=t.getResource(),o=JSON.stringify(e),o.replace(/,"p":\{\}/g,"")},o=e(this),a=e(t),o===a},o.prototype.applyLogClear=function(t,e,a){switch(t.object.objectType){case"dataSet":return this.clearContent(),a(null);case"data":return this.clearData(),a(null);default:return o.__super__.applyLogClear.call(this,t,e,a)}},o.prototype.applyLogAdd=function(t,e){var o,a,n,r,i,u,s;switch(o=!1,t.object.objectType){case"dataSource":for(n=t.object.content,u=0,s=n.length;u<s;u++)i=n[u],r=new ut.tools.dataviewer.StoredDataSourceColumn({imageInformation:i.imageInformation,unit:i.unit},{type:i.type,id:i.id,label:i.label}),this.addDataSourceColumn(r);break;case"data":a=t.object.content,this.addDataRow(a);break;default:console.warn("Unknown object type: "+t.object.objectType)}if(!o)return e(null)},o.prototype.applyLogRemove=function(t,e){var o,a;switch(o=!1,t.object.objectType){case"dataSource":t.object.id.forEach(function(t){return function(e){return t.removeDataSourceColumnById(e)}}(this));break;case"data":a=t.object.id.sort().reverse(),a.forEach(function(t){return function(e){return t.removeDataRow(e)}}(this));break;default:console.warn("Unknown object type: "+t.object.objectType)}if(!o)return e(null)},o.prototype.applyLogChange=function(t,e){var o,a,n,r,i,u,s,l,c,d;switch(o=!1,t.object.objectType){case"data":switch(t.object.content.action){case"moveUp":d=t.object.id.sort(),d.forEach(function(t){return function(e){return t.moveDataRowUp(e)}}(this));break;case"moveDown":d=t.object.id.sort().reverse(),d.forEach(function(t){return function(e){return t.moveDataRowDown(e)}}(this));break;case"sort":r=t.object.id,i=t.object.content.descending,this.sortData(r[0],i);break;case"cell":n=0,c=0,l=t.object.id,c=l[0],n=l[1],u=t.object.content.value,s=t.object.content.formattedValue,this.setDataCellValue(c,n,u,s)}break;case"dataSource":a=t.object.id,t.object.content.label&&this.setDataSourceColumnLabel(a,t.object.content.label),t.object.content.type&&this.setDataSourceColumnType(a,t.object.content.type);break;default:console.warn("Unknown object type: "+t.object.objectType)}if(!o)return e(null)},o.prototype.addDataSourceColumn=function(t){return this.dataSourceColumns.push(t),this.dataTable.addColumn(t.getType(),t.getLabel(),t.getId()),this.emitEvent("addedDataSourceColumn",[t]),this.emitModelChanged()},o.prototype.removeDataSourceColumnById=function(t){var e;return e=this.getDataSourceColumn(t),this.removeDataSourceColumn(e)},o.prototype.removeDataSourceColumn=function(t){var e;return e=this.dataSourceColumns.indexOf(t),this.removeDataSourceColumnByIndex(e)},o.prototype.removeDataSourceColumnByIndex=function(t){var e;if(t>=0&&t<this.dataSourceColumns.length)return e=this.dataSourceColumns[t],this.dataSourceColumns.splice(t,1),this.dataTable.removeColumn(t),0===this.getNrOfDataSourceColumns()&&this.clearData(),this.emitEvent("removedDataSourceColumn",[e]),this.emitModelChanged()},o.prototype.updateDataSourceColumn=function(t){var e;return e=this.getDataSourceColumnIndex(t.getId()),e>=0?this.dataSourceColumns[e]=t:console.warn("updatedDataSourceColumn: cannot find dataSourceColumn, with id "+t.getId())},o.prototype.getDataSourceColumn=function(t){var e,o,a,n;for(n=this.dataSourceColumns,o=0,a=n.length;o<a;o++)if(e=n[o],e.getId()===t)return e;return null},o.prototype.getDataSourceColumnIndex=function(t){var e,o,a,n,r;for(o=0,r=this.dataSourceColumns,a=0,n=r.length;a<n;a++){if(e=r[a],e.getId()===t)return o;++o}return-1},o.prototype.getDataSourceColumns=function(){return this.dataSourceColumns},o.prototype.getNrOfDataSourceColumns=function(){return this.dataSourceColumns.length},o.prototype.getNrOfDataRows=function(){return this.dataTable.getNumberOfRows()},o.prototype.addDataRow=function(t){return this.dataTable.addRow(t),this.emitEvent("addedDataRow"),this.emitModelChanged()},o.prototype.addDataRows=function(t){return this.dataTable.addRows(t),this.emitEvent("addedDataRows"),this.emitModelChanged()},o.prototype.insertDataRow=function(t,e){return this.dataTable.insertRows(t,[e]),this.emitEvent("addedDataRow"),this.emitModelChanged()},o.prototype.removeDataRow=function(t){if(t>=0&&t<this.getNrOfDataRows())return this.dataTable.removeRow(t),this.emitEvent("removedDataRow"),this.emitModelChanged()},o.prototype.getDataRow=function(t){var e,o,a,n,r,i,u;for(i=[],e=a=0,r=this.getNrOfDataSourceColumns();0<=r?a<r:a>r;e=0<=r?++a:--a)u=this.dataTable.getValue(t,e),o=this.dataTable.getFormattedValue(t,e),n=this.dataTable.getProperties(t,e),i.push({v:u,f:o,p:n});return i},o.prototype.moveDataRowUp=function(t){var e;return t>0?(e=this.getDataRow(t),this.removeDataRow(t),this.insertDataRow(t-1,e)):console.warn("cannot move row up, rowIndex must be > 0")},o.prototype.moveDataRowDown=function(t){var e,o;return o=this.getNrOfDataRows(),t<o-1?(e=this.getDataRow(t),this.removeDataRow(t),this.insertDataRow(t+1,e)):console.warn("cannot move row down, rowIndex must be < "+(o-1))},o.prototype.sortData=function(t,e){var o;return o={column:t,desc:e},this.dataTable.sort(o),this.emitEvent("dataSorted",[o]),this.emitModelChanged()},o.prototype.setDataSourceColumnLabel=function(t,e){var o,a,n,r;if(a=this.getDataSourceColumnIndex(t),a>=0&&(o=this.dataSourceColumns[a],r=o.getLabel(),r!==e))return n=new ut.tools.dataviewer.StoredDataSourceColumn(o),n.description.label=e,this.dataSourceColumns.splice(a,1,n),this.dataTable.setColumnLabel(a,e),this.emitEvent("changedDataSourceColumnLabel"),this.emitModelChanged()},o.prototype.setDataSourceColumnType=function(t,e,o){var a,n,r,i,u,s,l,c,d,m,p,h;if(null==o&&(o=!0),n=function(t,e,o){switch(o){case"string":return new String(t).toString();case"number":return new Number(t).valueOf();case"boolean":return new Boolean(t).valueOf();case"date":case"datetime":case"timeofday":return new Date(t)}},u=this.getDataSourceColumnIndex(t),!(u>=0))return console.warn("cannot find dataSourceColumn with id "+t);if(i=this.dataSourceColumns[u],m=i.getType(),m!==e){for(c=new ut.tools.dataviewer.StoredDataSourceColumn(i),c.description.type=e,this.dataSourceColumns.splice(u,1,c),this.dataTable.insertColumn(u,e,c.getLabel(),c.getId()),d=u+1,h=l=0,p=this.getNrOfDataRows()-1;0<=p?l<=p:l>=p;h=0<=p?++l:--l)a=this.dataTable.getValue(h,d),s=this.dataTable.getFormattedValue(h,d),(a===s||o)&&(s=null),r=n(a,m,e),this.dataTable.setCell(h,u,r,s);return this.dataTable.removeColumn(d),this.emitEvent("changedDataSourceColumnType"),this.emitModelChanged()}},o.prototype.setDataCellValue=function(t,e,o,a){return null==a&&(a=null),this.dataTable.setCell(t,e,o,a),this.emitEvent("changedDataCellValue"),this.emitModelChanged()},o.prototype.getDataCellValue=function(t,e){return this.dataTable.getValue(t,e)},o.prototype.clearData=function(){return this.dataTable.removeRows(0,this.dataTable.getNumberOfRows()),this.emitEvent("clearData"),this.emitModelChanged()},o.prototype.getDataTable=function(){return this.dataTable},o.prototype.clearContent=function(){return this.dataSourceColumns=[],this.dataTable=new google.visualization.DataTable,o.__super__.clearContent.call(this)},o.prototype.getResourceContent=function(){var t,e,o;return e=function(t){var e;return e=new ut.tools.dataviewer.StoredDataSourceColumn(t),e.getJson()},o=function(){var o,a,n,r;for(n=this.dataSourceColumns,r=[],o=0,a=n.length;o<a;o++)t=n[o],r.push(e(t));return r}.call(this),{dataSourceColumns:o,dataTable:JSON.parse(this.dataTable.toJSON())}},o.prototype.loadFromResourceContent=function(t){var e,o,a;return a=function(t,e){return new ut.tools.dataviewer.StoredDataSourceColumn(t,e)},this.dataSourceColumns=[],t.dataTable.cols.length>0&&(this.dataSourceColumns=function(){var e,n,r;for(r=[],o=e=0,n=t.dataTable.cols.length-1;0<=n?e<=n:e>=n;o=0<=n?++e:--e)r.push(a(t.dataSourceColumns[o],t.dataTable.cols[o]));return r}()),e=t.dataTable,this.dataTable=new google.visualization.DataTable(e)},o.prototype.emitModelLoaded=function(){return o.__super__.emitModelLoaded.call(this)},o.prototype.importFromFile=function(t,e){var o;console.log("importFromFile("+JSON.stringify(t)+"):"),console.log("file: name: "+t.name+", type: "+t.type+", size: "+t.size);try{return o=JSON.parse(e),this.importFromResource(o)}catch(t){return this.importFromString(e)}},o.prototype.importFromString=function(t){var e,o,a,n;return console.log(t),a=ut.commons.utils.svParsers.csvToArrays(t),console.log(a),this.clearContent(),n=ut.tools.dataviewer.extractData(a),e=n[0],o=n[1],e.forEach(function(t){return function(e){var o,a,n;return n={imageInformation:{type:"commonImage",value:""},unit:e.unit},a={type:ut.tools.dataviewer.DataType[e.type],id:e.id,label:e.label},o=new ut.tools.dataviewer.StoredDataSourceColumn(n,a),t.addDataSourceColumn(o)}}(this)),this.addDataRows(o)},o}(window.ut.commons.ResourceEventEmitterModel)}).call(this);
//# sourceMappingURL=dataSetModel.js.map