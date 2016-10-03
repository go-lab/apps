"use strict";function unquote(r){var t;return(t=r.match(/(['"]?)(.*)\1/))&&t[2]||r}function comments(r){return!/#@/.test(r[0])}function simpleParser(r){return function(t){if(0===t.length)return[];var e=t.split(/[\n\r]/).filter(comments),a=e.filter(function(r){return r.indexOf("\t")>=0||r.trim().length>0}).map(function(t){var e=t.split(r);return e});return a}}function countSeparators(r,t){return r.split(t).length-1}function detectContentFormat(r){var t=r.trim().split(/[\n\r]/).filter(comments);if(0===t.length)return"empty";var e=t[0],a=countSeparators(e,","),o=countSeparators(e,"\t");return Math.max(a,o)>0&&o>=a?"tsv":"csv"}var ut=ut||{};ut.commons=ut.commons||{},ut.commons.utils=ut.commons.utils||{};var csvParser=function(){function r(r,t){function e(){if(u=0,l="",t.start&&t.state.rowNum<t.start)return i=[],t.state.rowNum++,void(t.state.colNum=1);if(void 0===t.onParseEntry)s.push(i);else{var r=t.onParseEntry(i,t.state);r!==!1&&s.push(r)}i=[],t.end&&t.state.rowNum>=t.end&&(c=!0),t.state.rowNum++,t.state.colNum=1}function a(){if(void 0===t.onParseValue)i.push(l);else{var r=t.onParseValue(l,t.state);r!==!1&&i.push(r)}l="",u=0,t.state.colNum++}var o=t.separator,n=t.delimiter;t.state.rowNum||(t.state.rowNum=1),t.state.colNum||(t.state.colNum=1);var s=[],i=[],u=0,l="",c=!1,m=RegExp.escape(o),f=RegExp.escape(n),p=/(D|S|\n|\r|[^DS\r\n]+)/,w=p.source;return w=w.replace(/S/g,m),w=w.replace(/D/g,f),p=RegExp(w,"gm"),r.replace(p,function(r){if(!c)switch(u){case 0:if(r===o){l+="",a();break}if(r===n){u=1;break}if("\n"===r){a(),e();break}if(/^\r$/.test(r))break;l+=r,u=3;break;case 1:if(r===n){u=2;break}l+=r,u=1;break;case 2:if(r===n){l+=r,u=1;break}if(r===o){a();break}if("\n"===r){a(),e();break}if(/^\r$/.test(r))break;throw new Error("CSVDataError: Illegal State [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]");case 3:if(r===o){a();break}if("\n"===r){a(),e();break}if(/^\r$/.test(r))break;if(r===n)throw new Error("CSVDataError: Illegal Quote [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]");throw new Error("CSVDataError: Illegal Data [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]");default:throw new Error("CSVDataError: Unknown State [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]")}}),a(),e(),s}function t(r,t){function e(){if(void 0===t.onParseValue)n.push(i);else{var r=t.onParseValue(i,t.state);r!==!1&&n.push(r)}i="",s=0,t.state.colNum++}var a=t.separator,o=t.delimiter;t.state.rowNum||(t.state.rowNum=1),t.state.colNum||(t.state.colNum=1);var n=[],s=0,i="";if(!t.match){var u=RegExp.escape(a),l=RegExp.escape(o),c=/(D|S|\n|\r|[^DS\r\n]+)/,m=c.source;m=m.replace(/S/g,u),m=m.replace(/D/g,l),t.match=RegExp(m,"gm")}return r.replace(t.match,function(r){switch(s){case 0:if(r===a){i+="",e();break}if(r===o){s=1;break}if("\n"===r||"\r"===r)break;i+=r,s=3;break;case 1:if(r===o){s=2;break}i+=r,s=1;break;case 2:if(r===o){i+=r,s=1;break}if(r===a){e();break}if("\n"===r||"\r"===r)break;throw new Error("CSVDataError: Illegal State [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]");case 3:if(r===a){e();break}if("\n"===r||"\r"===r)break;if(r===o)throw new Error("CSVDataError: Illegal Quote [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]");throw new Error("CSVDataError: Illegal Data [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]");default:throw new Error("CSVDataError: Unknown State [Row:"+t.state.rowNum+"][Col:"+t.state.colNum+"]")}}),e(),n}function e(r,e,a){var e=void 0!==e?e:{},o={};o.callback=void 0!==a&&"function"==typeof a&&a,o.separator="separator"in e?e.separator:n.separator,o.delimiter="delimiter"in e?e.delimiter:n.delimiter;var s=void 0!==e.state?e.state:{},e={delimiter:o.delimiter,separator:o.separator,onParseEntry:e.onParseEntry,onParseValue:e.onParseValue,state:s},i=t(r,e);return o.callback?void o.callback("",i):i}function a(t,e,a){var e=void 0!==e?e:{},o={};o.callback=void 0!==a&&"function"==typeof a&&a,o.separator="separator"in e?e.separator:n.separator,o.delimiter="delimiter"in e?e.delimiter:n.delimiter;var s=[],e={delimiter:o.delimiter,separator:o.separator,onParseEntry:e.onParseEntry,onParseValue:e.onParseValue,start:e.start,end:e.end,state:{rowNum:1,colNum:1}};return s=r(t.trim(),e),o.callback?void o.callback("",s):s}function o(r){return r.length>1?r:!(1!==r.length||!r[0].length)&&r}var n={separator:",",delimiter:'"',headers:!0};return RegExp.escape=function(r){return r.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")},{toArray:function(r,t){return e(r,t)},toArrays:function(r,t){return 0===r.trim().length?[]:(t=t||{},t.onParseEntry=o,a(r,t))}}},theCsvParser=csvParser();ut.commons.utils.svParsers={csvToArrays:theCsvParser.toArrays,tsvToArrays:simpleParser("\t"),detectContentFormat:detectContentFormat};