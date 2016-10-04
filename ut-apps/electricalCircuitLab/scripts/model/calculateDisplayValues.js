var ut;!function(t){var r;!function(r){var a;!function(r){"use strict";r.valueToColors=function(t){var r=0,a=0,e=0,n=0,o=t.toString(),i=function(t){return parseInt(o.charAt(t))};switch(o.length){case 0:r=0;break;case 1:e=i(0);break;case 2:a=i(0),e=i(1);break;default:r=i(0),a=i(1),e=i(2),n=o.length-3}return{digit1:r,digit2:a,digit3:e,multiplier:n}},r.colorsToValue=function(t){var r=function(t){var r=t.toString();return parseInt(r.replace("k","000").replace("M","000000").replace("G","000000000"))},a=100*t.digit1+10*t.digit2+t.digit3;return a*r(t.multiplier)},r.valueToShortcut=function(t){var r=function(t){if(t<10)return"";var r=t<100?"0":"";for(r+=Math.floor(t/10);r.length>0&&"0"===r.charAt(r.length-1);)r=r.substr(0,r.length-1);return r},a=function(t,a,e){var n=Math.floor(t),o=r(Math.floor(a));return n+e+o};return t>=1e9?a(t/1e9,t%1e9/1e6,"G"):t>=1e6?a(t/1e6,t%1e6/1e3,"M"):t>=1e3?a(t/1e3,t%1e3,"k"):t.toString()};var a="mµnpfazy",e="kMGT";r.calculateImpedanceDisplayString=function(t){var r=Math.abs(t),n=0,o=0;if(r>0)if(r<1)for(;r<1;)n++,r*=1e3;else if(r>=1e3)for(;r>=1e3;)o++,r/=1e3;var i=Math.round(r),u=r-i,c="";u>=.1&&(c="."+Math.round(10*u));var f="";return n>0?f=a[n-1]:o>0&&(f=e[o-1]),""+i+c+" "+f},r.factorOptions=[{factor:1e12,display:"T"},{factor:1e9,display:"G"},{factor:1e6,display:"M"},{factor:1e3,display:"k"},{factor:1,display:""},{factor:.001,display:"m"},{factor:1e-6,display:"µ"},{factor:1e-9,display:"n"},{factor:1e-12,display:"p"}],r.smallFactorOptions=r.factorOptions.filter(function(t){return t.factor<=1}),r.bigFactorOptions=r.factorOptions.filter(function(t){return t.factor<=1});var n=new t.commons.tsutils.IdMap;r.factorOptions.forEach(function(t){return n.put(t.display,t.factor)}),r.valueAndFactorToNumber=function(t,r){return n.getOrElse(r,1)*t},r.numberToValueAndFactor=function(t){for(var a=function(r){return[t/r.factor,r.display]},e=Math.abs(t),n=0,o=r.factorOptions;n<o.length;n++){var i=o[n];if(e>=i.factor)return a(i)}return a(r.factorOptions[r.factorOptions.length-1])};var o="INF",i=3,u=4;r.formatValue=function(t,r,n,c){if(r>n)throw new Error("minFactor ("+r+") must be smaller or equal then maxFactor ("+n+")");var f=t<0?"-":"",l=Math.abs(t),s=9999*Math.pow(10,3*n);if(l===1/0||l>s)return{value:t<0?-(1/0):1/0,display:""+f+o+" "+c,displayNumber:""+f+o,displayUnit:c,factorValue:1/0,minimumStep:0};var p=function(){var t=Math.pow(10,3*r),a=Math.pow(10,3*n);if(l<=t)return[r,l/t];if(l>=a)return[n,l/a];for(var e=r,o=l,i=1e3*t;o>i;)e++,o/=1e3;return[e,o/t]},d=p(),v=d[0],h=d[1],m=h<1?h.toFixed(i):h.toPrecision(u),y="";v<0?y=a[-v-1]:v>0&&(y=e[v-1]);var g=""+f+m,M=y+c,b=Math.pow(10,3*v),O=3*v-3;l>=1e3*b?O+=3:l>=100*b?O+=2:l>=10*b&&(O+=1);var w=Math.pow(10,O),F={value:parseFloat(g)*b,display:g+" "+y+c,displayNumber:g,displayUnit:M,factorValue:b,minimumStep:w};return F}}(a=r.electricity||(r.electricity={}))}(r=t.simulations||(t.simulations={}))}(ut||(ut={}));
//# sourceMappingURL=calculateDisplayValues.js.map