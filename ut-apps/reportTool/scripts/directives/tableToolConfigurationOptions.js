(function(){"use strict";var o;window.ut=window.ut||{},ut.tools=ut.tools||{},ut.tools.tabletool=ut.tools.tabletool||{},ut.commons=ut.commons||{},ut.commons.utils=ut.commons.utils||{},o=function(o,t){return{restrict:"E",template:'<configurationSection label="i_tableTool.configuration.tableTool">\n  <div class="row">\n    <div class="col-md-6">\n      <nameListEditor nameList="configurationModel.rowLabels" label="tableTool.configuration.rowNames"></nameListEditor>\n    </div>\n    <div class="col-md-6">\n      <nameListEditor nameList="configurationModel.columnLabels" label="tableTool.configuration.columnNames"></nameListEditor>\n    </div>\n  </div>\n</configurationSection\n',replace:!1,link:function(n,i,l){return n.configurationModel=t,n.tableModel=o}}},window.ut.tools.tabletool.tableTool.directive("tableToolConfigurationOptions".toLowerCase(),["tableModel","configurationModel",o])}).call(this);
//# sourceMappingURL=tableToolConfigurationOptions.js.map
