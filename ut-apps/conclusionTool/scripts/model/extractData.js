"use strict";var ut;!function(n){var t;!function(n){var t;!function(n){function t(n){var t=n.match(/(['"]?)(.*)\1/);return t&&t[2]||n}function r(n){for(var t=[],r=!1,e=n;!r;){var u=Math.floor(e/26),a=e-26*u;t.push(String.fromCharCode(65+a)),0===u?r=!0:e=u-1}return t.reverse().join("")}function e(n){var t=0;n.forEach(function(n){n.length>t&&(t=n.length)}),n.forEach(function(n){if(n.length<t)for(var r=n.length;r<t;r++)n.push("")})}function u(n){if(n.length){var t=n.shift(),e=-1,u=t.map(function(n){return++e,n?n:r(e)});return[u,n]}return[[],[]]}function a(n){return n.map(function(n){if(n.length){if("'"===n[0]||'"'===n[0])return h.string;if(!isNaN(n))return h.number;var t=n.toLowerCase();return"true"===t||"false"===t?h.boolean:h.string}return h.empty})}function o(n){return n.map(function(n){return a(n)})}function i(n,t){var r=h.string;return n.length&&(r=n[0][t],n.forEach(function(n){r===h.empty&&(r=n[t]),n[t]!==h.empty&&n[t]!==r&&(r=h.string)})),r===h.empty&&(r=h.string),r}function f(n,t){for(var r=o(t),e=[],u=0;u<n;u++)e.push(i(r,u));return e}function c(n,r){var e=n.map(function(n){return t(n)}),u=-1;return e.map(function(n){return++u,{type:r[u],unit:"",label:n,id:"column"+u}})}function l(n,r){function e(n){switch(typeof n){case"string":return n.length>0&&("'"===n[0]||'"'===n[0])?t(n):n;default:return""+n}}function u(n){switch(typeof n){case"number":return n;default:return parseFloat(n)}}function a(n){switch(typeof n){case"boolean":return n;default:var t=n.toLowerCase();return"true"===t}}n.forEach(function(n){for(var t=0;t<n.length;t++)if(n[t].length)switch(r[t]){case h.string:n[t]=e(n[t]);break;case h.number:n[t]=u(n[t]);break;case h.boolean:n[t]=a(n[t])}else n[t]=null})}function s(n){if(n.length){e(n);var t=u(n),r=t[0],a=t[1],o=f(r.length,a);l(a,o);var i=c(r,o);return[i,a]}return[[],[]]}!function(n){n[n.empty=0]="empty",n[n.string=1]="string",n[n.number=2]="number",n[n.boolean=3]="boolean"}(n.DataType||(n.DataType={}));var h=n.DataType;n.getDefaultColumnName=r,n.fillUpMatrix=e,n.divideLabelsAndData=u,n.makeTypeArray=o,n.getColumnType=i,n.findColumnTypes=f,n.findColumnInfos=c,n.fixDataTypes=l,n.extractData=s}(t=n.dataviewer||(n.dataviewer={}))}(t=n.tools||(n.tools={}))}(ut||(ut={}));
//# sourceMappingURL=extractData.js.map