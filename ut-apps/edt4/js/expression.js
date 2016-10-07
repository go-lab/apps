/* decimal.js v4.0.3 https://github.com/MikeMcl/decimal.js/LICENCE */
!function(e){"use strict";function n(e){for(var n,r,t=1,i=e.length,o=e[0]+"";i>t;t++){for(n=e[t]+"",r=y-n.length;r--;)n="0"+n;o+=n}for(i=o.length;48===o.charCodeAt(--i););return o.slice(0,i+1||1)}function r(e,n,r,t){var i,o,s,c,u;for(o=1,s=e[0];s>=10;s/=10,o++);return s=n-o,0>s?(s+=y,i=0):(i=Math.ceil((s+1)/y),s%=y),o=E(10,y-s),u=e[i]%o|0,null==t?3>s?(0==s?u=u/100|0:1==s&&(u=u/10|0),c=4>r&&99999==u||r>3&&49999==u||5e4==u||0==u):c=(4>r&&u+1==o||r>3&&u+1==o/2)&&(e[i+1]/o/100|0)==E(10,s-2)-1||(u==o/2||0==u)&&0==(e[i+1]/o/100|0):4>s?(0==s?u=u/1e3|0:1==s?u=u/100|0:2==s&&(u=u/10|0),c=(t||4>r)&&9999==u||!t&&r>3&&4999==u):c=((t||4>r)&&u+1==o||!t&&r>3&&u+1==o/2)&&(e[i+1]/o/1e3|0)==E(10,s-3)-1,c}function t(e,n,r){var t=e.constructor;return null==n||((m=0>n||n>8)||0!==n&&(t.errors?parseInt:parseFloat)(n)!=n)&&!u(t,"rounding mode",n,r,0)?t.rounding:0|n}function i(e,n,r,t){var i=e.constructor;return!(m=(t||0)>n||n>=A+1)&&(0===n||(i.errors?parseInt:parseFloat)(n)==n)||u(i,"argument",n,r,0)}function o(e,t){var i,o,s,c,u,l,f,h=0,g=0,p=0,m=e.constructor,d=m.ONE,N=m.rounding,v=m.precision;if(!e.c||!e.c[0]||e.e>17)return new m(e.c?e.c[0]?e.s<0?0:1/0:d:e.s?e.s<0?0:e:NaN);for(null==t?(w=!1,u=v):u=t,f=new m(.03125);e.e>-2;)e=e.times(f),p+=5;for(o=Math.log(E(2,p))/Math.LN10*2+5|0,u+=o,i=c=l=new m(d),m.precision=u;;){if(c=a(c.times(e),u,1),i=i.times(++g),f=l.plus(P(c,i,u,1)),n(f.c).slice(0,u)===n(l.c).slice(0,u)){for(s=p;s--;)l=a(l.times(l),u,1);if(null!=t)return m.precision=v,l;if(!(3>h&&r(l.c,u-o,N,h)))return a(l,m.precision=v,N,w=!0);m.precision=u+=10,i=c=f=new m(d),g=0,h++}l=f}}function s(e,r,t,i){var o,s,c=e.constructor,u=(e=new c(e)).e;if(null==r?t=0:(a(e,++r,t),t=i?r:r+e.e-u),u=e.e,o=n(e.c),1==i||2==i&&(u>=r||u<=c.toExpNeg)){for(;o.length<t;o+="0");o.length>1&&(o=o.charAt(0)+"."+o.slice(1)),o+=(0>u?"e":"e+")+u}else{if(i=o.length,0>u){for(s=t-i;++u;o="0"+o);o="0."+o}else if(++u>i){for(s=t-u,u-=i;u--;o+="0");s>0&&(o+=".")}else s=t-i,i>u?o=o.slice(0,u)+"."+o.slice(u):s>0&&(o+=".");if(s>0)for(;s--;o+="0");}return e.s<0&&e.c[0]?"-"+o:o}function c(e){var n=e.length-1,r=n*y+1;if(n=e[n]){for(;n%10==0;n/=10,r--);for(n=e[0];n>=10;n/=10,r++);}return r}function u(e,n,r,t,i){if(e.errors){var o=new Error((t||["new Decimal","cmp","div","eq","gt","gte","lt","lte","minus","mod","plus","times","toFraction","pow","random","log","sqrt","toNearest","divToInt"][N?0>N?-N:N:0>1/N?1:0])+"() "+(["number type has more than 15 significant digits","LN10 out of digits"][n]||n+([m?" out of range":" not an integer"," not a boolean or binary digit"][i]||""))+": "+r);throw o.name="Decimal Error",m=N=0,o}}function l(e,n,r){var t=new e(e.ONE);for(w=!1;1&r&&(t=t.times(n)),r>>=1,r;)n=n.times(n);return w=!0,t}function f(e,t){var i,o,s,c,l,h,g,p,m,d,N,v=1,E=10,x=e,b=x.c,y=x.constructor,O=y.ONE,S=y.rounding,D=y.precision;if(x.s<0||!b||!b[0]||!x.e&&1==b[0]&&1==b.length)return new y(b&&!b[0]?-1/0:1!=x.s?NaN:b?0:x);if(null==t?(w=!1,g=D):g=t,y.precision=g+=E,i=n(b),o=i.charAt(0),!(Math.abs(c=x.e)<15e14))return x=new y(o+"."+i.slice(1)),g+2>M.length&&u(y,1,g+2,"ln"),x=f(x,g-E).plus(new y(M.slice(0,g+2)).times(c+"")),y.precision=D,null==t?a(x,D,S,w=!0):x;for(;7>o&&1!=o||1==o&&i.charAt(1)>3;)x=x.times(e),i=n(x.c),o=i.charAt(0),v++;for(c=x.e,o>1?(x=new y("0."+i),c++):x=new y(o+"."+i.slice(1)),d=x,p=l=x=P(x.minus(O),x.plus(O),g,1),N=a(x.times(x),g,1),s=3;;){if(l=a(l.times(N),g,1),m=p.plus(P(l,new y(s),g,1)),n(m.c).slice(0,g)===n(p.c).slice(0,g)){if(p=p.times(2),0!==c&&(g+2>M.length&&u(y,1,g+2,"ln"),p=p.plus(new y(M.slice(0,g+2)).times(c+""))),p=P(p,new y(v),g,1),null!=t)return y.precision=D,p;if(!r(p.c,g-E,S,h))return a(p,y.precision=D,S,w=!0);y.precision=g+=E,m=l=x=P(d.minus(O),d.plus(O),g,1),N=a(x.times(x),g,1),s=h=1}p=m,s+=2}}function a(e,n,r,t){var i,o,s,c,u,l,f,a,h=e.constructor;e:if(null!=n){if(!(f=e.c))return e;for(i=1,c=f[0];c>=10;c/=10,i++);if(o=n-i,0>o)o+=y,s=n,u=f[a=0],l=u/E(10,i-s-1)%10|0;else if(a=Math.ceil((o+1)/y),a>=f.length){if(!t)break e;for(;f.length<=a;f.push(0));u=l=0,i=1,o%=y,s=o-y+1}else{for(u=c=f[a],i=1;c>=10;c/=10,i++);o%=y,s=o-y+i,l=0>s?0:v(u/E(10,i-s-1)%10)}if(t=t||0>n||null!=f[a+1]||(0>s?u:u%E(10,i-s-1)),t=4>r?(l||t)&&(0==r||r==(e.s<0?3:2)):l>5||5==l&&(4==r||t||6==r&&(o>0?s>0?u/E(10,i-s):0:f[a-1])%10&1||r==(e.s<0?8:7)),1>n||!f[0])return f.length=0,t?(n-=e.e+1,f[0]=E(10,(y-n%y)%y),e.e=-n||0):f[0]=e.e=0,e;if(0==o?(f.length=a,c=1,a--):(f.length=a+1,c=E(10,y-o),f[a]=s>0?(u/E(10,i-s)%E(10,s)|0)*c:0),t)for(;;){if(0==a){for(o=1,s=f[0];s>=10;s/=10,o++);for(s=f[0]+=c,c=1;s>=10;s/=10,c++);o!=c&&(e.e++,f[0]==b&&(f[0]=1));break}if(f[a]+=c,f[a]!=b)break;f[a--]=0,c=1}for(o=f.length;0===f[--o];f.pop());}return w&&(e.e>h.maxE?e.c=e.e=null:e.e<h.minE&&(e.c=[e.e=0])),e}var h,g,p,m,d=e.crypto,w=!0,N=0,v=Math.floor,E=Math.pow,x=Object.prototype.toString,b=1e7,y=7,O="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_",S={},D=9e15,A=1e9,F=3e3,M="2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";S.absoluteValue=S.abs=function(){var e=new this.constructor(this);return e.s<0&&(e.s=1),a(e)},S.ceil=function(){return a(new this.constructor(this),this.e+1,2)},S.comparedTo=S.cmp=function(e,n){var r,t=this,i=t.c,o=(N=-N,e=new t.constructor(e,n),e.c),s=t.s,c=e.s,u=t.e,l=e.e;if(!s||!c)return null;if(r=i&&!i[0],n=o&&!o[0],r||n)return r?n?0:-c:s;if(s!=c)return s;if(r=0>s,!i||!o)return u==l?0:!i^r?1:-1;if(u!=l)return u>l^r?1:-1;for(s=-1,c=(u=i.length)<(l=o.length)?u:l;++s<c;)if(i[s]!=o[s])return i[s]>o[s]^r?1:-1;return u==l?0:u>l^r?1:-1},S.decimalPlaces=S.dp=function(){var e,n,r=null;if(e=this.c){if(r=((n=e.length-1)-v(this.e/y))*y,n=e[n])for(;n%10==0;n/=10,r--);0>r&&(r=0)}return r},S.dividedBy=S.div=function(e,n){return N=2,P(this,new this.constructor(e,n))},S.dividedToIntegerBy=S.divToInt=function(e,n){var r=this,t=r.constructor;return N=18,a(P(r,new t(e,n),0,1,1),t.precision,t.rounding)},S.equals=S.eq=function(e,n){return N=3,0===this.cmp(e,n)},S.exponential=S.exp=function(){return o(this)},S.floor=function(){return a(new this.constructor(this),this.e+1,3)},S.greaterThan=S.gt=function(e,n){return N=4,this.cmp(e,n)>0},S.greaterThanOrEqualTo=S.gte=function(e,n){return N=5,n=this.cmp(e,n),1==n||0===n},S.isFinite=function(){return!!this.c},S.isInteger=S.isInt=function(){return!!this.c&&v(this.e/y)>this.c.length-2},S.isNaN=function(){return!this.s},S.isNegative=S.isNeg=function(){return this.s<0},S.isZero=function(){return!!this.c&&0==this.c[0]},S.lessThan=S.lt=function(e,n){return N=6,this.cmp(e,n)<0},S.lessThanOrEqualTo=S.lte=function(e,n){return N=7,n=this.cmp(e,n),-1==n||0===n},S.logarithm=S.log=function(e,t){var i,o,s,c,l,h,g,p,m,d=this,v=d.constructor,E=v.precision,x=v.rounding,b=5;if(null==e)e=new v(10),i=!0;else{if(N=15,e=new v(e,t),o=e.c,e.s<0||!o||!o[0]||!e.e&&1==o[0]&&1==o.length)return new v(NaN);i=e.eq(10)}if(o=d.c,d.s<0||!o||!o[0]||!d.e&&1==o[0]&&1==o.length)return new v(o&&!o[0]?-1/0:1!=d.s?NaN:o?0:1/0);if(l=i&&(c=o[0],o.length>1||1!=c&&10!=c&&100!=c&&1e3!=c&&1e4!=c&&1e5!=c&&1e6!=c),w=!1,g=E+b,p=g+10,h=f(d,g),i?(p>M.length&&u(v,1,p,"log"),s=new v(M.slice(0,p))):s=f(e,g),m=P(h,s,g,1),r(m.c,c=E,x))do if(g+=10,h=f(d,g),i?(p=g+10,p>M.length&&u(v,1,p,"log"),s=new v(M.slice(0,p))):s=f(e,g),m=P(h,s,g,1),!l){+n(m.c).slice(c+1,c+15)+1==1e14&&(m=a(m,E+1,0));break}while(r(m.c,c+=10,x));return w=!0,a(m,E,x)},S.minus=function(e,n){var r,t,i,o,s=this,c=s.constructor,u=s.s;if(N=8,e=new c(e,n),n=e.s,!u||!n)return new c(NaN);if(u!=n)return e.s=-n,s.plus(e);var l=s.c,f=e.c,h=v(e.e/y),g=v(s.e/y),p=c.precision,m=c.rounding;if(!g||!h){if(!l||!f)return l?(e.s=-n,e):new c(f?s:NaN);if(!l[0]||!f[0])return s=f[0]?(e.s=-n,e):new c(l[0]?s:3==m?-0:0),w?a(s,p,m):s}if(l=l.slice(),t=l.length,u=g-h){for((o=0>u)?(u=-u,r=l,t=f.length):(h=g,r=f),(g=Math.ceil(p/y))>t&&(t=g),u>(t+=2)&&(u=t,r.length=1),r.reverse(),n=u;n--;r.push(0));r.reverse()}else for((o=t<(i=f.length))&&(i=t),u=n=0;i>n;n++)if(l[n]!=f[n]){o=l[n]<f[n];break}if(o&&(r=l,l=f,f=r,e.s=-e.s),(n=-((i=l.length)-f.length))>0)for(;n--;l[i++]=0);for(g=b-1,n=f.length;n>u;){if(l[--n]<f[n]){for(t=n;t&&!l[--t];l[t]=g);--l[t],l[n]+=b}l[n]-=f[n]}for(;0==l[--i];l.pop());for(;0==l[0];l.shift(),--h);for(l[0]||(l=[h=0],e.s=3==m?-1:1),e.c=l,u=1,n=l[0];n>=10;n/=10,u++);return e.e=u+h*y-1,w?a(e,p,m):e},S.modulo=S.mod=function(e,n){var r,t,i=this,o=i.constructor,s=o.modulo;return N=9,e=new o(e,n),n=e.s,r=!i.c||!n||e.c&&!e.c[0],r||!e.c||i.c&&!i.c[0]?r?new o(NaN):a(new o(i),o.precision,o.rounding):(w=!1,9==s?(e.s=1,t=P(i,e,0,3,1),e.s=n,t.s*=n):t=P(i,e,0,s,1),t=t.times(e),w=!0,i.minus(t))},S.naturalLogarithm=S.ln=function(){return f(this)},S.negated=S.neg=function(){var e=new this.constructor(this);return e.s=-e.s||null,a(e)},S.plus=function(e,n){var r,t=this,i=t.constructor,o=t.s;if(N=10,e=new i(e,n),n=e.s,!o||!n)return new i(NaN);if(o!=n)return e.s=-n,t.minus(e);var s=t.c,c=e.c,u=v(e.e/y),l=v(t.e/y),f=i.precision,h=i.rounding;if(!l||!u){if(!s||!c)return new i(o/0);if(!s[0]||!c[0])return t=c[0]?e:new i(s[0]?t:0*o),w?a(t,f,h):t}if(s=s.slice(),o=l-u){for(0>o?(o=-o,r=s,n=c.length):(u=l,r=c,n=s.length),(l=Math.ceil(f/y))>n&&(n=l),o>++n&&(o=n,r.length=1),r.reverse();o--;r.push(0));r.reverse()}for(s.length-c.length<0&&(r=c,c=s,s=r),o=c.length,n=0,l=b;o;s[o]%=l)n=(s[--o]=s[o]+c[o]+n)/l|0;for(n&&(s.unshift(n),++u),o=s.length;0==s[--o];s.pop());for(e.c=s,o=1,n=s[0];n>=10;n/=10,o++);return e.e=o+u*y-1,w?a(e,f,h):e},S.precision=S.sd=function(e){var n=null,r=this;return e!=n&&e!==!!e&&1!==e&&0!==e&&u(r.constructor,"argument",e,"precision",1),r.c&&(n=c(r.c),e&&r.e+1>n&&(n=r.e+1)),n},S.round=function(){var e=this,n=e.constructor;return a(new n(e),e.e+1,n.rounding)},S.squareRoot=S.sqrt=function(){var e,r,t,i,o,s,c=this,u=c.c,l=c.s,f=c.e,h=c.constructor,g=new h(.5);if(1!==l||!u||!u[0])return new h(!l||0>l&&(!u||u[0])?NaN:u?c:1/0);for(w=!1,l=Math.sqrt(+c),0==l||l==1/0?(r=n(u),(r.length+f)%2==0&&(r+="0"),l=Math.sqrt(r),f=v((f+1)/2)-(0>f||f%2),l==1/0?r="1e"+f:(r=l.toExponential(),r=r.slice(0,r.indexOf("e")+1)+f),i=new h(r)):i=new h(l.toString()),t=(f=h.precision)+3;;)if(s=i,i=g.times(s.plus(P(c,s,t+2,1))),n(s.c).slice(0,t)===(r=n(i.c)).slice(0,t)){if(r=r.slice(t-3,t+1),"9999"!=r&&(o||"4999"!=r)){(!+r||!+r.slice(1)&&"5"==r.charAt(0))&&(a(i,f+1,1),e=!i.times(i).eq(c));break}if(!o&&(a(s,f+1,0),s.times(s).eq(c))){i=s;break}t+=4,o=1}return w=!0,a(i,f,h.rounding,e)},S.times=function(e,n){var r,t,i=this,o=i.constructor,s=i.c,c=(N=11,e=new o(e,n),e.c),u=v(i.e/y),l=v(e.e/y),f=i.s;if(n=e.s,e.s=f==n?1:-1,!((u||s&&s[0])&&(l||c&&c[0])))return new o(!f||!n||s&&!s[0]&&!c||c&&!c[0]&&!s?NaN:s&&c?0*e.s:e.s/0);for(t=u+l,f=s.length,n=c.length,n>f&&(r=s,s=c,c=r,l=f,f=n,n=l),l=f+n,r=[];l--;r.push(0));for(u=n-1;u>-1;u--){for(n=0,l=f+u;l>u;)n=r[l]+c[u]*s[l-u-1]+n,r[l--]=n%b|0,n=n/b|0;r[l]=(r[l]+n)%b|0}for(n?++t:r[0]||r.shift(),l=r.length;!r[--l];r.pop());for(e.c=r,f=1,n=r[0];n>=10;n/=10,f++);return e.e=f+t*y-1,w?a(e,o.precision,o.rounding):e},S.toDecimalPlaces=S.toDP=function(e,n){var r=this;return r=new r.constructor(r),null!=e&&i(r,e,"toDP")?a(r,(0|e)+r.e+1,t(r,n,"toDP")):r},S.toExponential=function(e,n){var r=this;return r.c?s(r,null!=e&&i(r,e,"toExponential")?0|e:null,null!=e&&t(r,n,"toExponential"),1):r.toString()},S.toFixed=function(e,n){var r,o=this,c=o.constructor,u=c.toExpNeg,l=c.toExpPos;return null!=e&&(e=i(o,e,r="toFixed")?o.e+(0|e):null,n=t(o,n,r)),c.toExpNeg=-(c.toExpPos=1/0),null!=e&&o.c?(r=s(o,e,n),o.s<0&&o.c&&(o.c[0]?r.indexOf("-")<0&&(r="-"+r):r=r.replace("-",""))):r=o.toString(),c.toExpNeg=u,c.toExpPos=l,r},S.toFormat=function(e,n){var r=this;if(!r.c)return r.toString();var t,i=r.s<0,o=r.constructor.format,s=o.groupSeparator,c=+o.groupSize,u=+o.secondaryGroupSize,l=r.toFixed(e,n).split("."),f=l[0],a=l[1],h=i?f.slice(1):f,g=h.length;if(u&&(t=c,c=u,g-=u=t),c>0&&g>0){for(t=g%c||c,f=h.substr(0,t);g>t;t+=c)f+=s+h.substr(t,c);u>0&&(f+=s+h.slice(t)),i&&(f="-"+f)}return a?f+o.decimalSeparator+((u=+o.fractionGroupSize)?a.replace(new RegExp("\\d{"+u+"}\\B","g"),"$&"+o.fractionGroupSeparator):a):f},S.toFraction=function(e){var r,t,i,o,s,l,f,a,h=this,g=h.constructor,p=r=new g(g.ONE),d=l=new g(0),x=h.c,b=new g(d);if(!x)return h.toString();for(i=b.e=c(x)-h.e-1,b.c[0]=E(10,(f=i%y)<0?y+f:f),(null==e||(!(N=12,s=new g(e)).s||(m=s.cmp(p)<0||!s.c)||g.errors&&v(s.e/y)<s.c.length-1)&&!u(g,"max denominator",e,"toFraction",0)||(e=s).cmp(b)>0)&&(e=i>0?b:p),w=!1,s=new g(n(x)),f=g.precision,g.precision=i=x.length*y*2;a=P(s,b,0,1,1),t=r.plus(a.times(d)),1!=t.cmp(e);)r=d,d=t,p=l.plus(a.times(t=p)),l=t,b=s.minus(a.times(t=b)),s=t;return t=P(e.minus(r),d,0,1,1),l=l.plus(t.times(p)),r=r.plus(t.times(d)),l.s=p.s=h.s,o=P(p,d,i,1).minus(h).abs().cmp(P(l,r,i,1).minus(h).abs())<1?[p+"",d+""]:[l+"",r+""],w=!0,g.precision=f,o},S.toNearest=function(e,n){var r=this,i=r.constructor;return r=new i(r),null==e?(e=new i(i.ONE),n=i.rounding):(N=17,e=new i(e),n=t(r,n,"toNearest")),e.c?r.c&&(e.c[0]?(w=!1,r=P(r,e,0,4>n?[4,5,7,8][n]:n,1).times(e),w=!0,a(r)):r.c=[r.e=0]):r.s&&(e.s&&(e.s=r.s),r=e),r},S.toNumber=function(){var e=this;return+e||(e.s?0*e.s:NaN)},S.toPower=S.pow=function(e,t){var i,s,c,u,h=this,g=h.constructor,p=h.s,m=(N=13,+(e=new g(e,t))),d=0>m?-m:m,x=g.precision,b=g.rounding;if(!h.c||!e.c||(c=!h.c[0])||!e.c[0])return new g(E(c?0*p:+h,m));if(h=new g(h),i=h.c.length,!h.e&&h.c[0]==h.s&&1==i)return h;if(t=e.c.length-1,e.e||e.c[0]!=e.s||t)if(s=v(e.e/y),c=s>=t,!c&&0>p)u=new g(NaN);else{if(c&&F>i*y*d){if(u=l(g,h,d),e.s<0)return g.ONE.div(u)}else{if(p=0>p&&1&e.c[Math.max(s,t)]?-1:1,t=E(+h,m),s=0!=t&&isFinite(t)?new g(t+"").e:v(m*(Math.log("0."+n(h.c))/Math.LN10+h.e+1)),s>g.maxE+1||s<g.minE-1)return new g(s>0?p/0:0);w=!1,g.rounding=h.s=1,d=Math.min(12,(s+"").length),u=o(e.times(f(h,x+d)),x),u=a(u,x+5,1),r(u.c,x,b)&&(s=x+10,u=a(o(e.times(f(h,s+d)),s),s+5,1),+n(u.c).slice(x+1,x+15)+1==1e14&&(u=a(u,x+1,0))),u.s=p,w=!0,g.rounding=b}u=a(u,x,b)}else u=a(h,x,b);return u},S.toPrecision=function(e,n){var r=this;return null!=e&&i(r,e,"toPrecision",1)&&r.c?s(r,0|--e,t(r,n,"toPrecision"),2):r.toString()},S.toSignificantDigits=S.toSD=function(e,n){var r=this,o=r.constructor;return r=new o(r),null!=e&&i(r,e,"toSD",1)?a(r,0|e,t(r,n,"toSD")):a(r,o.precision,o.rounding)},S.toString=function(e){var r,t,i,o=this,c=o.constructor,l=o.e;if(null===l)t=o.s?"Infinity":"NaN";else{if(e===r&&(l<=c.toExpNeg||l>=c.toExpPos))return s(o,null,c.rounding,1);if(t=n(o.c),0>l){for(;++l;t="0"+t);t="0."+t}else if(i=t.length,l>0)if(++l>i)for(l-=i;l--;t+="0");else i>l&&(t=t.slice(0,l)+"."+t.slice(l));else if(r=t.charAt(0),i>1)t=r+"."+t.slice(1);else if("0"==r)return r;if(null!=e)if((m=!(e>=2&&65>e))||e!=(0|e)&&c.errors)u(c,"base",e,"toString",0);else if(t=h(c,t,0|e,10,o.s),"0"==t)return t}return o.s<0?"-"+t:t},S.truncated=S.trunc=function(){return a(new this.constructor(this),this.e+1,1)},S.valueOf=S.toJSON=function(){return this.toString()},h=function(){function e(e,n,r){for(var t,i,o=[0],s=0,c=e.length;c>s;){for(i=o.length;i--;o[i]*=n);for(o[t=0]+=O.indexOf(e.charAt(s++));t<o.length;t++)o[t]>r-1&&(null==o[t+1]&&(o[t+1]=0),o[t+1]+=o[t]/r|0,o[t]%=r)}return o.reverse()}return function(n,r,t,i,o){var s,c,u,f,a,h,g=r.indexOf("."),p=n.precision,m=n.rounding;for(37>i&&(r=r.toLowerCase()),g>=0&&(r=r.replace(".",""),h=new n(i),f=l(n,h,r.length-g),h.c=e(f.toFixed(),10,t),h.e=h.c.length),a=e(r,i,t),s=c=a.length;0==a[--c];a.pop());if(!a[0])return"0";if(0>g?s--:(f.c=a,f.e=s,f.s=o,f=P(f,h,p,m,0,t),a=f.c,u=f.r,s=f.e),g=a[p],c=t/2,u=u||null!=a[p+1],4>m?(null!=g||u)&&(0==m||m==(0>o?3:2)):g>c||g==c&&(4==m||u||6==m&&1&a[p-1]||m==(0>o?8:7)))for(a.length=p,--t;++a[--p]>t;)a[p]=0,p||(++s,a.unshift(1));else a.length=p;for(c=a.length;!a[--c];);for(g=0,r="";c>=g;r+=O.charAt(a[g++]));if(0>s){for(;++s;r="0"+r);r="0."+r}else if(g=r.length,++s>g)for(s-=g;s--;r+="0");else g>s&&(r=r.slice(0,s)+"."+r.slice(s));return r}}();var P=function(){function e(e,n,r){var t,i=0,o=e.length;for(e=e.slice();o--;)t=e[o]*n+i,e[o]=t%r|0,i=t/r|0;return i&&e.unshift(i),e}function n(e,n,r,t){var i,o;if(r!=t)o=r>t?1:-1;else for(i=o=0;r>i;i++)if(e[i]!=n[i]){o=e[i]>n[i]?1:-1;break}return o}function r(e,n,r,t){for(var i=0;r--;)e[r]-=i,i=e[r]<n[r]?1:0,e[r]=i*t+e[r]-n[r];for(;!e[0]&&e.length>1;e.shift());}return function(t,i,o,s,c,u){var l,f,h,g,p,m,d,w,N,E,x,O,S,D,A,F,M,P,R,q=t.constructor,L=t.s==i.s?1:-1,I=t.c,U=i.c;if(!(I&&I[0]&&U&&U[0]))return new q(t.s&&i.s&&(I?!U||I[0]!=U[0]:U)?I&&0==I[0]||!U?0*L:L/0:NaN);for(u?(g=1,f=t.e-i.e):(u=b,g=y,f=v(t.e/g)-v(i.e/g)),P=U.length,F=I.length,N=new q(L),E=N.c=[],h=0;U[h]==(I[h]||0);h++);if(U[h]>(I[h]||0)&&f--,null==o?(L=o=q.precision,s=q.rounding):L=c?o+(t.e-i.e)+1:o,0>L)E.push(1),p=!0;else{if(L=L/g+2|0,h=0,1==P){for(m=0,U=U[0],L++;(F>h||m)&&L--;h++)D=m*u+(I[h]||0),E[h]=D/U|0,m=D%U|0;p=m||F>h}else{for(m=u/(U[0]+1)|0,m>1&&(U=e(U,m,u),I=e(I,m,u),P=U.length,F=I.length),A=P,x=I.slice(0,P),O=x.length;P>O;x[O++]=0);R=U.slice(),R.unshift(0),M=U[0],U[1]>=u/2&&M++;do m=0,l=n(U,x,P,O),0>l?(S=x[0],P!=O&&(S=S*u+(x[1]||0)),m=S/M|0,m>1?(m>=u&&(m=u-1),d=e(U,m,u),w=d.length,O=x.length,l=n(d,x,w,O),1==l&&(m--,r(d,w>P?R:U,w,u))):(0==m&&(l=m=1),d=U.slice()),w=d.length,O>w&&d.unshift(0),r(x,d,O,u),-1==l&&(O=x.length,l=n(U,x,P,O),1>l&&(m++,r(x,O>P?R:U,O,u))),O=x.length):0===l&&(m++,x=[0]),E[h++]=m,l&&x[0]?x[O++]=I[A]||0:(x=[I[A]],O=1);while((A++<F||null!=x[0])&&L--);p=null!=x[0]}E[0]||E.shift()}if(1==g)N.e=f,N.r=+p;else{for(h=1,L=E[0];L>=10;L/=10,h++);N.e=h+f*g-1,a(N,c?o+N.e+1:o,s,p)}return N}}();if(g=function(){function e(e){var n,r,t,i=this,o="config",s=i.errors?parseInt:parseFloat;return e==r||"object"!=typeof e&&!u(i,"object expected",e,o)?i:((t=e[n="precision"])!=r&&((m=1>t||t>A)||s(t)!=t?u(i,n,t,o,0):i[n]=0|t),(t=e[n="rounding"])!=r&&((m=0>t||t>8)||s(t)!=t?u(i,n,t,o,0):i[n]=0|t),(t=e[n="toExpNeg"])!=r&&((m=-D>t||t>0)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="toExpPos"])!=r&&((m=0>t||t>D)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="minE"])!=r&&((m=-D>t||t>0)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="maxE"])!=r&&((m=0>t||t>D)||s(t)!=t?u(i,n,t,o,0):i[n]=v(t)),(t=e[n="errors"])!=r&&(t===!!t||1===t||0===t?(m=N=0,i[n]=!!t):u(i,n,t,o,1)),(t=e[n="crypto"])!=r&&(t===!!t||1===t||0===t?i[n]=!(!t||!d||"object"!=typeof d):u(i,n,t,o,1)),(t=e[n="modulo"])!=r&&((m=0>t||t>9)||s(t)!=t?u(i,n,t,o,0):i[n]=0|t),(e=e[n="format"])!=r&&("object"==typeof e?i[n]=e:u(i,"format object expected",e,o)),i)}function n(e){return new this(e).exp()}function r(e){return new this(e).ln()}function t(e,n){return new this(e).log(n)}function o(e,n,r){var t,i,o=0;for("[object Array]"==x.call(n[0])&&(n=n[0]),t=new e(n[0]);++o<n.length;){if(i=new e(n[o]),!i.s){t=i;break}t[r](i)&&(t=i)}return t}function s(){return o(this,arguments,"lt")}function c(){return o(this,arguments,"gt")}function l(e,n){return new this(e).pow(n)}function f(e){var n,r,t,o=0,s=[],c=this,l=new c(c.ONE);if(null!=e&&i(l,e,"random")?e|=0:e=c.precision,r=Math.ceil(e/y),c.crypto)if(d&&d.getRandomValues)for(n=d.getRandomValues(new Uint32Array(r));r>o;)t=n[o],t>=429e7?n[o]=d.getRandomValues(new Uint32Array(1))[0]:s[o++]=t%1e7;else if(d&&d.randomBytes){for(n=d.randomBytes(r*=4);r>o;)t=n[o]+(n[o+1]<<8)+(n[o+2]<<16)+((127&n[o+3])<<24),t>=214e7?d.randomBytes(4).copy(n,o):(s.push(t%1e7),o+=4);o=r/4}else u(c,"crypto unavailable",d,"random");if(!o)for(;r>o;)s[o++]=1e7*Math.random()|0;for(r=s[--o],e%=y,r&&e&&(t=E(10,y-e),s[o]=(r/t|0)*t);0===s[o];o--)s.pop();if(0>o)s=[r=0];else{for(r=-1;0===s[0];)s.shift(),r-=y;for(o=1,t=s[0];t>=10;)t/=10,o++;y>o&&(r-=y-o)}return l.e=r,l.c=s,l}function g(e){return new this(e).sqrt()}function p(i){function o(e,n){var r=this;if(!(r instanceof o))return u(o,"Decimal called without new",e),new o(e,n);if(r.constructor=o,e instanceof o){if(null==n)return N=0,r.s=e.s,r.e=e.e,r.c=(e=e.c)?e.slice():e,r;if(10==n)return a(new o(e),o.precision,o.rounding);e+=""}return b(o,r,e,n)}return o.precision=20,o.rounding=4,o.modulo=1,o.toExpNeg=-7,o.toExpPos=21,o.minE=-D,o.maxE=D,o.errors=!0,o.crypto=!1,o.format={decimalSeparator:".",groupSeparator:",",groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:" ",fractionGroupSize:0},o.prototype=S,o.ONE=new o(1),o.ROUND_UP=0,o.ROUND_DOWN=1,o.ROUND_CEIL=2,o.ROUND_FLOOR=3,o.ROUND_HALF_UP=4,o.ROUND_HALF_DOWN=5,o.ROUND_HALF_EVEN=6,o.ROUND_HALF_CEIL=7,o.ROUND_HALF_FLOOR=8,o.EUCLID=9,o.config=e,o.constructor=p,o.exp=n,o.ln=r,o.log=t,o.max=s,o.min=c,o.pow=l,o.sqrt=g,o.random=f,null!=i&&o.config(i),o}var b=function(){var e=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,n=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")};return function(r,t,i,o){var s,c,l,f,g,p;if("string"!=typeof i&&(i=(f="number"==typeof i||"[object Number]"==x.call(i))&&0===i&&0>1/i?"-0":i+""),g=i,null==o&&e.test(i))t.s=45===i.charCodeAt(0)?(i=i.slice(1),-1):1;else{if(10==o)return a(new r(i),r.precision,r.rounding);if(i=n.call(i).replace(/^\+(?!-)/,""),t.s=45===i.charCodeAt(0)?(i=i.replace(/^-(?!-)/,""),-1):1,null!=o?o!=(0|o)&&r.errors||(m=!(o>=2&&65>o))?(u(r,"base",o,0,0),p=e.test(i)):(s="["+O.slice(0,o=0|o)+"]+",i=i.replace(/\.$/,"").replace(/^\./,"0."),(p=new RegExp("^"+s+"(?:\\."+s+")?$",37>o?"i":"").test(i))?(f&&(i.replace(/^0\.0*|\./,"").length>15&&u(r,0,g),f=!f),i=h(r,i,10,o,t.s)):"Infinity"!=i&&"NaN"!=i&&(u(r,"not a base "+o+" number",g),i="NaN")):p=e.test(i),!p)return t.c=t.e=null,"Infinity"!=i&&("NaN"!=i&&u(r,"not a number",g),t.s=null),N=0,t}for((c=i.indexOf("."))>-1&&(i=i.replace(".","")),(l=i.search(/e/i))>0?(0>c&&(c=l),c+=+i.slice(l+1),i=i.substring(0,l)):0>c&&(c=i.length),l=0;48===i.charCodeAt(l);l++);for(o=i.length;48===i.charCodeAt(--o););if(i=i.slice(l,o+1)){if(o=i.length,f&&o>15&&u(r,0,g),t.e=c=c-l-1,t.c=[],l=(c+1)%y,0>c&&(l+=y),o>l){for(l&&t.c.push(+i.slice(0,l)),o-=y;o>l;)t.c.push(+i.slice(l,l+=y));i=i.slice(l),l=y-i.length}else l-=o;for(;l--;i+="0");t.c.push(+i),w&&(t.e>r.maxE?t.c=t.e=null:t.e<r.minE&&(t.c=[t.e=0]))}else t.c=[t.e=0];return N=0,t}}();return p()}(),"function"==typeof define&&define.amd)define(function(){return g});else if("undefined"!=typeof module&&module.exports){if(module.exports=g,!d)try{d=require("crypto")}catch(R){}}else p=e.Decimal,g.noConflict=function(){return e.Decimal=p,g},e.Decimal=g}(this);
//# sourceMappingURL=doc/decimal.js.map
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	calculate.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Calculus
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	16/10/15  (Created)
 *		20/11/15  (Last modified)
 */
(function() {
    "use strict";
    console.log('========== loading tools/expression/js/calculate.js');
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var Decimal = is.in_nodejs() ? require('../libs/decimal.min') : this.Decimal;
    var timo;
    var Calculate;
    if (is.in_nodejs()) {
        timo = require('./expression');
        Calculate = require('./calculate');
    } else {
        timo = libs.timo = libs.timo || {};
        Calculate = timo.calculate = {};
    }

    var pi;
    var pi2;
    var pi_half;
    var pi_32;

    var USE_BIG = false;

    /**
     *  @module Calculate
     *
     *  All calculations (with real numbers) are found in this package.  The
     *  main reason is that there is a single location that needs to be
     *  changed when switching the number package (currently Decimal.js).
     *
     *  This package does not perform type-checking.  All type checking should
     *  be done by the caller (mostly expression.js).
     *
     *  @author Anjo Anjewierden, a.a.anjewierden@utwente.nl
     */

    var num = Calculate.Number = function(value) {
        if (USE_BIG)
            return new Decimal(value);
        if (is.string(value))
            return parseFloat(value);
        return value;
    };

    Calculate.BigNumber = function(value) {
        return new Decimal(value);
    };

    var ZERO = num(0);
    var ONE = num(1);

    is.BigNumber = function(obj) {
        return obj instanceof Decimal;
    };

    Calculate.isInteger = function(num) {
        if (USE_BIG)
            return num.isInt();
        return Math.floor(num) === num;
    };

    Calculate.add = function(a, b) {
        if (USE_BIG)
            return a.plus(b);
        return a + b;
    };

    Calculate.subtract = function(a, b) {
        if (USE_BIG)
            return a.minus(b);
        return a - b;
    };

    Calculate.divide = function(a, b) {
        if (USE_BIG)
            return a.div(b);
        return a / b;
    };

    Calculate.multiply = function(a, b) {
        if (USE_BIG)
            return a.times(b);
        return a * b;
    };

    Calculate.power = function(a, b) {
        if (USE_BIG)
            return a.pow(b);
        return Math.pow(a, b);
    };

    Calculate.minus = function(a) {
        if (USE_BIG)
            return a.neg();
        return -a;
    };

    Calculate.equal = function(a, b) {
        if (USE_BIG)
            return a.eq(b);
        return a === b;
    };

    Calculate.sqrt = function(a, degree) {
        if (USE_BIG) {
            if (degree === 2)
                return a.sqrt();
            return a.power(1/degree);
        }
        if (degree === 2)
            return Math.sqrt(a);
        return Math.pow(a, 1/degree);
    };

    Calculate.gcd = function(a, b) {
        if (USE_BIG) {
            while (!b.isZero()) {
                var t = b;
                b = a.mod(b);
                a = t;
            }
            return a;
        }
        while (b > 0) {
            var t2 = b;
            b = a % b;
            a = t2;
        }
        return a;
    };

    Calculate.PI = function() {
        if (USE_BIG)
            return num('3.14159265358979323846264338327950288419716939937510');
        return Math.PI;
    };

    Calculate.E = function() {
        if (USE_BIG)
            return num('2.71828182845904523536028747135266249775724709369995');
        return Math.E;
    };

    Calculate.degree = function() {
        if (USE_BIG)
            return Calculate.PI().div(180);
        return Calculate.PI() / 180;
    };

    Calculate.factorial = function(a) {
        var value = ONE;
        var n = num(a);

        while (n.gt(1)) {
            value = value.times(n);
            n = n.minus(1);
        }
        return value;
    };

    Calculate.arctangent = function(bn) {
        var value = num(bn);
        var s = -1;

        for (var p=3; p<10000; p+=2) {
            var term = bn.pow(p).div(p);
            value = (s > 0 ? value.plus(term) : value.minus(term));
            s = -s;
        }

        console.log('arctan ' + bn);
        console.log('  ' + value);
        console.log('Math.atan ' + Math.atan(bn.valueOf()));

        return value;
    };

    Calculate.in_range = function(bn, min, max, diff) {
        var factor;

        if (bn.lt(min)) {
//            factor = floor((min - bn) / diff);
            factor = num(min).minus(bn).div(diff).floor();

            if (factor.isZero())
                factor = num(1);

            return Calculate.in_range(bn.plus(factor.times(diff)), min, max, diff);
        }
        if (bn.gt(max)) {
            //factor = floor(bn - max) / diff;
            factor = bn.minus(max).div(diff).floor();

            if (factor.isZero())
                factor = num(1);

            return Calculate.in_range(bn.minus(factor.times(diff)), min, max, diff);
        }

        return bn;
    };

    Calculate.minimum = function(a, b) {
        return Decimal.min(a, b);
    };

    Calculate.maximum = function(a, b) {
        return Decimal.max(a, b);
    };

    /**
     *
     */
    Calculate.sine = function(bn, fast) {
        if (!USE_BIG)
            return Math.sin(bn);
        if (fast)
            return Math.sin(bn.toValue());
        var angle = Calculate.in_range(bn, 0, pi2, pi2);
        var neg = false;

        if (angle.gt(pi)) {
            neg = true;
            angle = angle.minus(pi);
        }

        if (angle.lt(pi_half)) {
            if (neg)
                return sine(angle).neg();
            else
                return sine(angle);
        }

        if (neg)
            return sine(pi.minus(angle)).neg();
        return sine(pi.minus(angle));

        function sine(angle, iterations) {
            iterations = (iterations === undefined ? 20 : iterations);
            var value = angle;
            var s = -1;
            var numerator = angle.pow(3);
            var denominator = Calculate.factorial(num(3));

            for (var p=3; p<iterations; p+=2) {
                var term = numerator.div(denominator);
                value = (s > 0 ? value.plus(term) : value.minus(term));
                s = -s;
                numerator = numerator.times(angle).times(angle);
                denominator = denominator.times(p+1).times(p+2);
            }
            return value;
        }
    };

    Calculate.cosine = function(bn) {
        if (!USE_BIG)
            return Math.cos(bn);

        var value = num(1);
        var s = -1;

        for (var p=2; p<10; p+=2) {
            var term = bn.pow(p).div(Calculate.factorial(num(p)));
            value = (s > 0 ? value.plus(term) : value.minus(term));
            s = -s;
        }

        console.log('cosine ' + bn);
        console.log('  ' + value);
        console.log('math.cos ' + Math.cos(bn.valueOf()));

        return value;
    };

    Calculate.logarithm = function(bn, base) {
        // TBD - Calculate.logarithm base not used
        if (!USE_BIG) {
            return Math.log(bn);
        }
        var value = num(0);
        var x1 = Calculate.minus(bn, 1).div(bn);
        var one = num(1);

        for (var p=1; p<100; p+=1) {
            var term = x1.pow(p).times(one.div(p));
            value = value.plus(term);
        }

        return value;
    };

    Calculate.tangent = function(bn) {
        if (!USE_BIG)
            return Math.tan(bn);

        var sin = Calculate.sine(bn);
        var cos = Calculate.cosine(bn);

        if (cos.isZero())
            return NaN;

        var value = sin.div(cos);

        return value;
    };

    function init_constants() {
        pi = Calculate.PI();
        pi2 = Calculate.multiply(pi, 2);
        pi_half = Calculate.divide(pi, 2);
        pi_32 = Calculate.add(pi, pi_half);
    }

    init_constants();

    if (is.in_nodejs())
        module.exports = Calculate;
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	expression.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Expression definition
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		21/11/15  (Last modified)
 */
(function() {
    "use strict";
    console.log('========== loading tools/expression/js/expression.js');
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = libs.timo = libs.timo || {};
    if (is.in_nodejs())
        module.exports = timo;
    var Calculate;
    var Functor;
    /**
     *  Expression.  A package for representing mathematics as JavaScript
     *  objects.
     *
     *  @author Anjo Anjewierden, a.a.anjewierden@utwente.nl
     */
    var System;
    var Dimension;
    var Variable; // When in an expression it is called Handle
    var Base;
    var Literal;
    var Numerical; // Number is reserved according to .jshint
    var Constant;
    var Real;
    var Degree;
    var Irrational;
    var Rational;
    var Integer;
    var Natural;
    var Handle; // Necessary because a single variable / property 
                // can be in several places in an expression 
    var Quantity;
    var Expression;
    var Equals;
    var Add;
    var Subtract;
    var Multiply;
    var Divide;
    var Fraction;
    var Minus; // Negate - logical?
    var Plus;
    var Power;
    var Logarithm;
    var Sine;
    var Cosine;
    var Tangent;
    var Sqrt;
    var Funct; // Better name?
    var Any; // Logical variable
    var AnyNumerical;
    var AnyReal;
    var AnyInteger;
    /**
     *  The evaluate method returns values.  Except for a numerical value is
     *  can return either NaN if the value is not defined, or 'null' if the
     *  value cannot be computed.  For example:
     *
     *  log(-1) will return NaN because the log of -1 is not defined.
     *  log(x) will return null if x has not been assigned a value, i.e. the
     *  value cannot be computed.
     *
     *  is.Value(obj) checks whether the value is a number.
     */
    is.Value = function(obj) {
        return !isNaN(obj) && obj !== null;
    };
    /*------------------------------------------------------------
     *  Base: abstract class for everything (except variables)
     *------------------------------------------------------------*/
    Base = timo.Base = function() {
        this.parent = null;
        this.depth = 0; // Otherwise finding a common root takes very long
        this.id = id(); // TBD - required?
    };
    is.Base = function(obj) {
        return obj instanceof Base;
    };
    Base.prototype.class_name = function() {
        return 'Base';
    };
    Base.prototype.print_nested = function() {
        return this.toString();
    };
    /** @abstract */
    Base.prototype.evaluate = function() {
        throw 'Base.evaluate: not defined for ' + this;
    };
    Base.prototype.root = function() {
        return (this.parent ? this.parent.root() : this);
    };
    Base.prototype.print_structure = function(indent) {
        indent = (indent === undefined ? 0 : indent);
        console.log(spaces(indent) + this);
        console.log(spaces(indent+4) + 'type   ' + this.class_name());
        console.log(spaces(indent+4) + 'value  ' + this.value);
        console.log(spaces(indent+4) + 'parent ' + this.parent);
        console.log(spaces(indent+4) + 'depth  ' + this.depth);
        if (is.Integer(this))
            console.log(spaces(indent+4) + 'INTEGER');
        if (is.Numerical(this))
            console.log(spaces(indent+4) + 'NUMERICAL');
        if (is.Real(this))
            console.log(spaces(indent+4) + 'REAL');
    };
    Base.prototype.set_depth = function(depth) {
        this.depth = depth;
    };
    Base.prototype.rewrite_rule = function(rule) {
        if (this.unify(rule.pattern)) {
            var rval = copy_substition(rule.substitute);
            rule.pattern.deunify();
//            rval.check();
            return rval;
        }
        return this;
    };
    Base.prototype.precedence = function() {
        return -1;
    };
    Base.prototype.commutative = function() {
        return false;
    };
    Base.prototype.unify = function(exp) {
        return false;
    };
    Base.prototype.unify_deep = function(exp) {
        var rval = [];
        console.log('Base.unify_deep ' + this + ' ' + exp);
        if (this.unify(exp)) {
            rval.push(this);
            exp.deunify();
        }
        return rval;
    };
    Base.prototype.deunify = function() {
        return this;
    };
    Base.prototype.equal = function(exp2) {
        return false;
    };
    Base.prototype.check = function() {
        this.check_parent();
        this.check_depth();
    };
    Base.prototype.check_parent = function() {
//        printf('ommitting check_parent for Base');
        return true;
    };
    Base.prototype.check_depth = function() {
//        printf('ommitting check_parent for Base');
        if (this.parent)
            return this.depth === this.parent.depth + 1;
        return this.depth === 0;
    };
    Base.prototype.reparent = function() {
        return this;
    };
    Base.prototype._reparent2 = function() {
        return this;
    };
    Base.prototype.contains = function(exp) {
        if (this.unify(exp))
            return true;
        return false;
    };
    Base.prototype.contains_property = function(property, func) {
        return false;
    };
    Base.prototype.compute = function(settings) {
        var vars = this.variables();
        for (var v in settings) {
            var variable = vars[v];
            if (variable)
                variable.assign(settings[v]);
        }
        return this.evaluate();
    };
    Base.prototype.variables = function() {
        return this._variables({});
    };
    Base.prototype._variables = function(vars) {
        return vars;
    };
    /*------------------------------------------------------------
     *  Expression: abstract class for all expressions (functor, arity, args)
     *------------------------------------------------------------*/
    Expression = timo.Expression = function() {
        var exp = this;
        var len = arguments.length;
        var i;
        if (len === 0)
            throw 'Expression: at least one argument required (functor)';
        Base.call(exp);
        exp.functor = check_functor(arguments[0]);
        exp.args = [];
        if (len === 2 && is.array(arguments[1])) {
            exp.arity = arguments[1].length;
            var args = arguments[1];
            for (i=0; i<args.length; i++) {
                exp.args.push(check_expression(args[i]));
            }
        } else {
            exp.arity = len - 1;
            for (i=1; i<len; i++) {
                exp.args.push(check_expression(arguments[i]));
            }
        }
        for (i=0; i<exp.arity; i++) {
            exp.args[i].parent = exp;
            exp.args[i].set_depth(exp.depth + 1);
        }
        return exp;
        function check_functor(func) {
            if (is.object(func))
                return func;
            if (is.string(func)) {
                console.log('CREATING FUNCTOR FOR ' + func);
                var rfunc = new Functor.Base({
                    name: func,
                    latex: func,
                    unicode: func,
                    arity: null
                });
                rfunc.create = function(args) {
                    return new timo.Funct(rfunc, args);
                };
                return rfunc;
            }
            trace('timo.Expression: ' + func + ' is not a functor');
        }
        function check_expression(exp) {
            if (is.Expression(exp))
                return exp;
            if (is.Variable(exp))
                return new Handle(exp);
            if (is.string(exp)) {
                if (exp[0].match(/(\d+\.?\d*)([Ee][\-+]?\d+)?/)) {
                    var snum = Calculate.Number(exp);
                    if (Calculate.isInteger(snum)) {
                        return new Integer(snum);
                    }
                    return new Real(snum);
                }
                return new Handle(new Variable(exp));
            }
            if (is.number(exp) || is.BigNumber(exp)) {
                var num = Calculate.Number(exp);
                if (Calculate.isInteger(num)) {
                    return new Integer(num);
                }
                return new Real(num);
            }
            if (is.Literal(exp))
                return exp;
            if (is.Any(exp))
                return exp;
            console.log(exp);
            trace('Expression: ' + exp + ' is not a valid argument in ' + exp.functor);
        }
    };
    is.Expression = function(obj) {
        return obj instanceof Expression;
    };
    { var F = function() {}; F.prototype = Base.prototype; Expression.prototype = new F(); Expression.prototype.constructor = Expression; Expression.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Expression.prototype.class_name = function() {
        return 'Expression';
    };
    /**
     *  Succeeds if this expression contains an element with the given
     *  property.  If second argument is true, the property must be a
     *  function.
     */
    Expression.prototype.contains_property = function(property, func) {
        var seen = false;
        if (this[property]) {
            if (!func) {
                console.log('Expression.contains_property ' + property + ' true');
                return true;
            }
            if (typeof(this[property]) === 'function') {
                console.log('Expression.contains_property ' + property + ' true');
                return true;
            }
        }
        for (var i=0; i<this.arity; i++) {
            if (this.arg(i).contains_property(property, func))
                return true;
        }
        return false;
    };
    Expression.prototype.print_structure = function(indent) {
        indent = (indent === undefined ? 0 : indent);
        console.log(spaces(indent) + this);
        indent += 2;
        console.log(spaces(indent) + 'parent ' + this.parent);
        console.log(spaces(indent) + 'depth  ' + this.depth);
        console.log(spaces(indent) + 'arity  ' + this.arity);
        for (var i=0; i<this.arity; i++) {
            console.log(spaces(indent) + 'arg ' + i + ' ' + this.arg(i));
            this.arg(i).print_structure(indent+2);
        }
    };
    Expression.prototype.print_nested = function(indent) {
        indent = (indent === undefined ? 0 : indent);
        var str = spaces(indent);
        str += this.functor.symbol;
        str += '(';
        for (var i=0; i<this.arity; i++) {
            str += this.arg(i).print_nested();
            if (i+1 < this.arity)
                str += ', ';
        }
        str += ')';
        return str;
    };
    Expression.prototype.toString = function(options) {
        options = options || {};
        var functor = this.functor;
        var str = '';
        if (options.brackets)
            str += '(';
        //  Unary operators
        if (functor.prefix && this.arity === 1) {
            var arg = this.args[0];
            var prec = arg.precedence();
            str += functor.symbol + ' ';
            if (functor.brackets)
                str += '(';
            if (prec === -1)
                str += arg.toString();
            else {
                if (prec > this.precedence())
                    str += '(';
                str += arg.toString();
                if (prec > this.precedence())
                    str += ')';
            }
            if (functor.brackets)
                str += ')';
        } else {
            //  Binary operators
            if (functor.infix && this.arity === 2) {
                if (this.left().precedence() > this.precedence())
                    str += '(';
                str += this.left().toString(options);
                if (this.left().precedence() > this.precedence())
                    str += ')';
                str += ' ' + functor.symbol + ' ';
                if (this.right().precedence() > this.precedence())
                    str += '(';
                str += this.right().toString(options);
                if (this.right().precedence() > this.precedence())
                    str += ')';
            } else {
                //  Functions
                str += this.functor.symbol;
                if (functor.brackets)
                    str += '(';
                else
                    str += ' ';
                str += this.args.join(', ');
                if (functor.brackets)
                    str += ')';
            }
            if (options.brackets)
                str += ')';
        }
        return str;
    };
    Expression.prototype.toLatex = function() {
        var functor = this.functor;
        var str = '';
        var arg;
        //  Unary operators
        if (functor.prefix && this.arity === 1) {
            arg = this.args[0];
            var prec = arg.precedence();
            str += functor.latex + ' ';
            if (functor.brackets && functor.curly) {
                str += '{' + arg.toLatex() + '}';
            } else {
                if (prec === -1)
                    str += arg.toLatex();
                else {
                    if (prec > this.precedence())
                        str += '(';
                    str += arg.toString();
                    if (prec > this.precedence())
                        str += ')';
                }
            }
            return str;
        }
        if (this.arity === 2) {
            str += this.args[0].toLatex();
            str += ' ';
            str += this.functor.latex;
            str += ' ';
            str += this.args[1].toLatex();
            return str;
        }
        str += this.functor;
        str += '(';
        for (var i=0; i<this.arity; i++) {
            arg = this.args[i];
            if (arg.toLatex)
                str += this.args[i].toLatex();
            else
                throw 'this.Expression.toLatex: no latex for ' + arg;
            if (i+1 < this.arity)
                str += ', ';
        }
        str += ')';
        return str;
    };
    /**
     *  Succeeds if the expression's functor is associative (when evaluating
     *  the order does not matter).  For example, + is associative: a + (b +
     *  c) = (a + b) + c.
     */
    Expression.prototype.associative = function() {
        return (this.functor.associative === undefined ? false : this.functor.associative);
    };
    Expression.prototype.reparent = function() {
        this.parent = null;
        for (var i=0; i<this.arity; i++) {
            this.arg(i).parent = this;
            this.arg(i).depth = 1;
            this.arg(i)._reparent2();
        }
        return this;
    };
    Expression.prototype._reparent2 = function() {
        for (var i=0; i<this.arity; i++) {
            this.arg(i).parent = this;
            this.arg(i).depth = this.depth + 1;
            this.arg(i)._reparent2();
        }
    };
    Expression.prototype.check_parent = function() {
        for (var i=0; i<this.arity; i++) {
            if (this.arg(i).parent !== this) {
                console.log('Check_parent');
                console.log('  root ' + this.root());
                console.log('  this ' + this);
                console.log('  arg  ' + i + ' ' + this.arg(i));
                trace('check_parent');
                return false;
            }
            if (is.Expression(this.arg(i)))
                this.arg(i).check_parent();
        }
        return true;
    };
    Expression.prototype.check_depth = function(depth) {
        if (depth === undefined) {
            var root = this.root();
            if (root.depth !== 0) {
                console.log('Check_depth');
                console.log('  root ' + this.root());
                console.log('  non zero depth ' + root.depth);
                trace('check depth');
                return false;
            }
            return root.check_depth(0);
        }
        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);
            if (arg.depth !== depth+1) {
                console.log('Check_depth');
                console.log('  root  ' + this.root());
                console.log('  this  ' + this);
                console.log('  arg   ' + arg);
                console.log('  arg d ' + arg.depth);
                console.log('  depth ' + depth);
                trace('check depth');
                return false;
            }
            if (!arg.check_depth(depth+1))
                return false;
        }
        return true;
    };
    /**
     *  Succeeds if the expression's functor is commutative (the order does
     *  not matter.  For example, + is commutative: a + b = b + a.
     */
    Expression.prototype.commutative = function() {
        return (this.functor.commutative === undefined ? false : this.functor.commutative);
    };
    Expression.prototype.arg = function(i) {
        return this.args[i];
    };
    Expression.prototype.set_arg = function(i, exp2) {
        this.args[i] = exp2;
        exp2.parent = this;
        exp2.set_depth(this.depth+1);
        return this;
    };
    Expression.prototype.set_depth = function(depth) {
        this.depth = depth;
        for (var i=0; i<this.arity; i++) {
            this.arg(i).set_depth(depth + 1);
        }
        return this;
    };
    Expression.prototype.precedence = function() {
        if (this.functor && this.functor.precedence !== undefined)
            return this.functor.precedence;
    };
    Expression.prototype.equal = function(exp2) {
        if (this.functor === exp2.functor && this.arity === exp2.arity) {
            for (var i=0; i<this.arity; i++)
                if (!(this.args[i].equal(exp2.args[i])))
                    return false;
            return true;
        }
        return false;
    };
    /**
     *  Succeed when the expression is ground, i.e., does not contain wildcards
     *  (instances of Any).
     *
     *  @returns {Boolean} - true when expression is ground
     */
    Expression.prototype.ground = function() {
        for (var i=0; i<this.arity; i++) {
            if (is.Any(this.args[i])) {
                if (this.args[i].binding)
                    continue;
                return false;
            }
            if (is.Literal(this.args[i]))
                continue;
            if (!this.args[i].ground())
                return false;
        }
        return true;
    };
    /**
     *  Succeed when the expression is unbound, i.e., does not contain wildcards
     *  which have a binding.
     *
     *  @returns {Boolean} - true when expression is unbound
     */
    Expression.prototype.unbound = function() {
        for (var i=0; i<this.arity; i++) {
            if (is.Any(this.args[i])) {
                if (this.args[i].binding)
                    return false;
            }
            if (is.Expression(this.args[i]))
                if (!this.args[i].unbound())
                    return false;
        }
        return true;
    };
    /**
     *  Replace this expression by the argument.
     */
    Base.prototype.replace = function(exp2) {
        var parent = this.parent;
        if (!parent)
            return null;
        if (!is.Expression(parent))
            return null;
        for (var i=0; i<parent.arity; i++) {
            if (parent.args[i] === this) {
                parent.args[i] = exp2;
                exp2.parent = parent;
                exp2.set_depth(parent.depth + 1);
//                this.root().check();
                return this;
            }
        }
        return null;
    };
    Base.prototype.in_different_branches = function(exp2) {
        if (this === exp2)
            return false;
        if (this.depth < exp2.depth)
            return this.in_different_branches(exp2.parent);
        if (this.depth > exp2.depth)
            return this.parent.in_different_branches(exp2);
        return true;
    };
    Base.prototype.common_functor = function(exp2, functor) {
/*
        printf('COMMON FUNCTOR ' + functor.symbol);
        printf('  l = ' + this);
        printf('  r = ' + exp2);
        printf(' in = ' + this.root());
*/
        if (this.depth === exp2.depth) {
            var exp1 = this;
            while (exp1.parent) {
                exp1 = exp1.parent;
                exp2 = exp2.parent;
                if (exp1 === exp2)
                    return exp1.functor === functor;
                if (exp1.functor !== functor || exp2.functor !== functor)
                    return false;
            }
            return false;
        }
        if (this.depth < exp2.depth)
            return exp2.parent.functor === functor && this.common_functor(exp2.parent, functor);
        return this.parent.functor === functor && this.parent.common_functor(exp2, functor);
    };
    Expression.prototype.rewrite_rule = function(rule) {
//        printf('Expression.rewrite_rule ' + this);
//        printf('Expression.rewrite_rule ' + rule.pattern);
        var rval;
        if (rule.associative) {
            rval = this.rewrite_associative(rule);
            if (!rule.pattern.unbound()) {
                console.log('================= pattern not unbound ' + rule.pattern);
                rule.pattern.deunify();
            }
            if (rule.status.rewritten)
                rval.root().set_depth(0); // TBD - fixes wrong .depth
//            rval.check();
            return rval;
        }
        var exp2 = rule.pattern;
        var sub = rule.substitute;
        rule.status = { rewritten: false };
        var result = this.rewrite(exp2, sub, rule.status);
        if (rule.status.rewritten) {
            if (!rule.pattern.unbound()) {
                console.log('================= pattern not unbound ' + rule.pattern);
                rule.pattern.deunify();
            }
            return result;
        }
        if (rule.commutative) {
            exp2.swap_left_right();
            result = this.rewrite(exp2, sub, rule.status);
            exp2.swap_left_right();
        }
        if (!rule.pattern.unbound()) {
            console.log('================= pattern not unbound ' + rule.pattern);
            rule.pattern.deunify();
        }
        return result;
    };
    Expression.prototype.swap_left_right = function() {
        var r = this.args[1];
        this.args[1] = this.args[0];
        this.args[0] = r;
        return this;
    };
    Expression.prototype.rewrite = function(exp2, sub, status) {
//        printf('Expression.rewrite ' + this);
//        printf('  exp2 ' + exp2);
//        printf('  sub  ' + sub);
        var exp1 = this.rewrite2(exp2, sub, status);
//        printf(' ====> ' + exp1);
        exp1.check();
        for (var i=0; i<exp1.arity; i++) {
            if (is.Expression(exp1.args[i]))
                //  TBD - check status before set_arg (performance)
                exp1.set_arg(i, exp1.args[i].rewrite2(exp2, sub, status));
        }
        return exp1;
    };
    Expression.prototype.rewrite2 = function(exp2, sub, status) {
//        printf('  Expression.rewrite2 ' + this);
//        printf('    exp2 ' + exp2);
//        printf('    sub  ' + sub);
        var rval;
        if (this.arity === exp2.arity && this.functor === exp2.functor) {
            rval = this.rewrite3(exp2, sub, status);
            if (status.rewritten)
                return rval;
        }
        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);
            if (is.Expression(arg)) {
                rval = arg.rewrite2(exp2, sub, status);
                if (status.rewritten) {
                    this.set_arg(i, rval);
                    return this;
                }
            }
        }
        return this;
    };
    Expression.prototype.rewrite3 = function(exp2, sub, status) {
//        printf('    Expression.rewrite3 ' + this);
//        printf('      exp2 ' + exp2);
//        printf('      sub  ' + sub);
        for (var i=0; i<this.arity; i++) {
            if (exp2.arg(i).unify(this.arg(i))) {
                continue;
            }
            exp2.deunify();
            return this;
        }
        var rval = this;
        if (exp2.ground()) {
            rval = copy_substition(sub);
            status.rewritten = true;
        }
        exp2.deunify();
        rval.check();
        return rval;
    };
    Expression.prototype.rewrite_associative = function(rule) {
        var exp2 = rule.pattern;
        var sub = rule.substitute;
        var left = exp2.left();
        var right = exp2.right();
        var sub1 = [];
        var sub2 = [];
        rule.status = { rewritten: false };
        this.unifying_subs(left, sub1, right, sub2); // TBD - expensive
        for (var i=0; i<sub1.length; i++) {
            var l = sub1[i];
            l.unify(left);
            for (var j=0; j<sub2.length; j++) {
                var r = sub2[j];
                if (!l.in_different_branches(r))
                    continue;
                if (r.unify(right)) {
                    if (l.common_functor(r, rule.functor)) {
                        var extra = copy_substition(sub);
/*
                        printf('    l ' + l);
                        printf('    r ' + r);
                        printf('    left  ' + left);
                        printf('    right ' + right);
*/
                        l.replace(extra);
                        r.replace(rule.functor.identity.copy());
                        left.deunify();
                        right.deunify();
                        rule.status.rewritten = true;
                        //  Return a new expression because we are at
                        //  the root.  For example: a + 0.
                        if (r.depth === 1)
                            return r.parent._clean_up2();
                        //  Clean up the identity we just introduced.
                        r.parent._clean_up();
                        return this;
                    }
                    right.deunify();
                }
            }
            left.deunify();
        }
        return this;
    };
    Expression.prototype._clean_up = function() {
        if (this.left().equal(this.functor.identity)) {
            return this.replace(this.right());
        }
        if (this.right().equal(this.functor.identity)) {
            return this.replace(this.left());
        }
        throw '_clean_up';
    };
    Expression.prototype._clean_up2 = function() {
        if (this.left().equal(this.functor.identity)) {
            return this.right().reparent();
        }
        if (this.right().equal(this.functor.identity)) {
            return this.left().reparent();
        }
        throw '_clean_up2';
    };
    Expression.prototype.unifying_subs = function(left, sub1, right, sub2) {
        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);
            if (arg.unify(left)) {
                sub1.push(arg);
                left.deunify();
            }
            if (arg.unify(right)) {
                sub2.push(arg);
                right.deunify();
            }
            if (is.Expression(arg))
                arg.unifying_subs(left, sub1, right, sub2);
        }
    };
    Expression.prototype.copy = function(unify) {
        var args = [];
        for (var i=0; i<this.arity; i++) {
            args.push(this.args[i].copy(unify));
        }
        return new Expression(this.functor, args);
    };
    Expression.prototype.contains = function(exp2) {
        if (this.equal(exp2))
            return true;
        for (var i=0; i<this.arity; i++) {
            if (this.args[i].contains(exp2))
                return true;
        }
        return false;
    };
    Expression.prototype.compute = function(settings) {
        var vars = this.variables();
        var v;
        for (v in settings) {
            var variable = vars[v];
            if (variable) {
                var value = settings[v];
                variable.assign(value);
            }
        }
        return this.evaluate();
    };
    Expression.prototype._variables = function(vars) {
        for (var i=0; i<this.arity; i++) {
            this.args[i]._variables(vars);
        }
        return vars;
    };
    /**
     *  Succeed when the value can be computed.
     */
    Expression.prototype.can_compute_value = function() {
        for (var i=0; i<this.arity; i++) {
            if (!this.args[i].can_compute_value())
                return false;
        }
        return true;
    };
    Expression.prototype.left = function() {
        if (this.arity != 2)
            trace('Error: no left when arity unequal to 2');
        return this.args[0];
    };
    Expression.prototype.right = function() {
        if (this.arity != 2)
            throw 'Error: no right when arity unequal to 2';
        return this.args[1];
    };
    Expression.prototype.traverse = function(func) {
        for (var i=0; i<this.arity; i++) {
            var arg = this.args[i];
            func.call(arg);
            if (arg instanceof Expression)
                arg.traverse(func);
        }
    };
    Expression.prototype.unify = function(exp) {
//        printf('        Expression.unify ' + this + ' =/= ' + exp);
        var rval = false;
        if (is.Any(exp))
            return exp.unify(this);
        if (is.Expression(exp) && this.arity === exp.arity && this.functor === exp.functor) {
            rval = true;
            for (var i=0; i<this.arity; i++) {
                var arg1 = this.args[i];
                var arg2 = exp.args[i];
                if (arg1.unify(arg2))
                    continue;
                rval = false;
                break;
            }
            return rval;
        }
        if (is.Literal(exp))
            return this.equal(exp);
        return false;
    };
    Expression.prototype.unify_deep = function(exp) {
        var rval = [];
        this.unify_deep2(exp, rval);
        return rval;
    };
    Expression.prototype.unify_deep2 = function(exp, sofar) {
//        printf('unify_deep2 ' + this);
//        printf('unify_deep2 ' + exp);
        if (this.unify(exp)) {
            sofar.push(this);
            exp.deunify();
        }
        for (var i=0; i<this.arity; i++) {
            var arg = this.arg(i);
            if (is.Expression(arg))
                arg.unify_deep2(exp, sofar);
            else {
                if (arg.unify(exp)) {
                    exp.deunify();
                    sofar.push(arg);
                }
            }
        }
    };
    Expression.prototype.deunify = function() {
        for (var i=0; i<this.arity; i++) {
            this.args[i].deunify();
        }
        return this;
    };
    /*------------------------------------------------------------
     *  Minus
     *------------------------------------------------------------*/
    Minus = timo.Minus = function(exp) {
        Expression.call(this, Functor.Minus, exp);
        return this;
    };
    is.Minus = function(obj) {
        return obj instanceof Minus;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Minus.prototype = new F(); Minus.prototype.constructor = Minus; Minus.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Minus.prototype.class_name = function() {
        return 'Minus';
    };
    Minus.prototype.copy = function(unify) {
        return new Minus(this.args[0].copy(unify));
    };
    Minus.prototype.evaluate = function() {
        var value = this.arg(0).evaluate();
        if (is.Value(value))
            return Calculate.minus(value);
        return null;
    };
    /*------------------------------------------------------------
     *  Plus
     *------------------------------------------------------------*/
    Plus = timo.Plus = function(exp) {
        Expression.call(this, Functor.Plus, exp);
        return this;
    };
    is.Plus = function(obj) {
        return obj instanceof Plus;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Plus.prototype = new F(); Plus.prototype.constructor = Plus; Plus.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Plus.prototype.class_name = function() {
        return 'Plus';
    };
    Plus.prototype.copy = function(unify) {
        return new Plus(this.args[0].copy(unify));
    };
    Plus.prototype.evaluate = function() {
        return this.arg(0).evaluate();
    };
    /*------------------------------------------------------------
     *  Equals
     *------------------------------------------------------------*/
    Equals = timo.Equals = function(left, right) {
        Expression.call(this, Functor.Equals, left, right);
        return this;
    };
    is.Equals = function(obj) {
        return obj instanceof Equals;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Equals.prototype = new F(); Equals.prototype.constructor = Equals; Equals.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Equals.prototype.class_name = function() {
        return 'Equals';
    };
    Equals.prototype.copy = function(unify) {
        return new Equals(this.left().copy(unify), this.right().copy(unify));
    };
    Equals.prototype.assign = function() {
        var left = this.left();
        var right = this.right().evaluate();
        if (is.Value(right)) {
            if (is.func(left.assign))
                return left.assign(right);
            return null;
        }
        return right;
    };
    Equals.prototype.evaluate = function() {
        var left = this.left().evaluate();
        var right = this.right().evaluate();
        if (is.Value(left) || is.Value(right))
            return Calculate.equal(left, right);
        return null;
    };
    /*------------------------------------------------------------
     *  Add
     *------------------------------------------------------------*/
    Add = timo.Add = function() {
        var len = arguments.length;
        if (len === 1 && is.array(arguments[0]))
            Expression.call(this, Functor.Add, arguments[0]);
        else
            Expression.call(this, Functor.Add, Array.prototype.slice.call(arguments));
    };
    is.Add = function(obj) {
        return obj instanceof Add;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Add.prototype = new F(); Add.prototype.constructor = Add; Add.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Add.prototype.class_name = function() {
        return 'Add';
    };
    Add.prototype.copy = function(unify) {
        var args = [];
        for (var i=0; i<this.arity; i++)
            args[i] = this.arg(i).copy(unify);
        return new Add(args);
    };
    Add.prototype.evaluate = function() {
        var sum = Calculate.Number(0);
        for (var i=0; i<this.arity; i++) {
            var value = this.arg(i).evaluate();
            if (!is.Value(value))
                return null;
            sum = Calculate.add(sum, value);
        }
        return sum;
    };
    /*------------------------------------------------------------
     *  Funct
     *------------------------------------------------------------*/
    Funct = timo.Funct = function() {
        var len = arguments.length;
        if (len === 2 && is.array(arguments[1]))
            Expression.call(this, arguments[0], arguments[1]);
        else {
            var name = arguments[0][0];
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);
            Expression.call(this, name, args);
        }
    };
    is.Funct = function(obj) {
        return obj instanceof Funct;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Funct.prototype = new F(); Funct.prototype.constructor = Funct; Funct.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Funct.prototype.class_name = function() {
        return 'Funct';
    };
    Funct.prototype.copy = function(unify) {
        var args = [];
        for (var i=0; i<this.arity; i++)
            args[i] = this.arg(i).copy(unify);
        return new Funct(this.functor, args);
    };
    /*------------------------------------------------------------
     *  Sine
     *------------------------------------------------------------*/
    Sine = timo.Sine = function(arg) {
        Expression.call(this, Functor.Sine, arg);
    };
    is.Sine = function(obj) {
        return obj instanceof Sine;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Sine.prototype = new F(); Sine.prototype.constructor = Sine; Sine.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Sine.prototype.class_name = function() {
        return 'Sine';
    };
    Sine.prototype.trigonometry = function() {
        return true;
    };
    Sine.prototype.copy = function(unify) {
        return new Sine(this.arg(0).copy(unify));
    };
    Sine.prototype.evaluate = function() {
        var arg = this.arg(0).evaluate();
        if (is.Value(arg))
            return Calculate.sine(arg);
        throw 'Sine.evaluate: argument invalid ' + this.arg(0);
        //  0 -> 0
        //  1/12 pi -> (sqrt(6) - sqrt(2)) / 4
        //  2/12 pi -> 0.5
        //  3/12 pi -> sqrt(2) / 2
        //  4/12 pi -> sqrt(3) / 2
        //  5/12 pi -> (sqrt(6) + sqrt(2)) / 4
        //  6/12 pi -> 1
    };
    Sine.prototype.minimum = function() {
        return Calculate.Number(-1);
    };
    Sine.prototype.maximum = function() {
        return Calculate.Number(1);
    };
    /*------------------------------------------------------------
     *  Cosine
     *------------------------------------------------------------*/
    Cosine = timo.Cosine = function(arg) {
        Expression.call(this, Functor.Cosine, arg);
        return this;
    };
    is.Cosine = function(obj) {
        return obj instanceof Cosine;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Cosine.prototype = new F(); Cosine.prototype.constructor = Cosine; Cosine.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Cosine.prototype.class_name = function() {
        return 'Cosine';
    };
    Cosine.prototype.trigonometry = function() {
        return true;
    };
    Cosine.prototype.copy = function(unify) {
        return new Cosine(this.arg(0).copy(unify));
    };
    Cosine.prototype.evaluate = function() {
        var arg = this.arg(0).evaluate();
        if (is.Value(arg))
            return Calculate.cosine(arg);
        throw 'timo.Cosine.evaluate: argument invalid: ' + this.arg(0);
    };
    Cosine.prototype.value = function() {
        throw 'timo.Cosine.value: not defined, use .evaluate()';
    };
    /*------------------------------------------------------------
     *  Tangent
     *------------------------------------------------------------*/
    Tangent = timo.Tangent = function(arg) {
        Expression.call(this, Functor.Tangent, arg);
        return this;
    };
    is.Tangent = function(obj) {
        return obj instanceof Tangent;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Tangent.prototype = new F(); Tangent.prototype.constructor = Tangent; Tangent.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Tangent.prototype.class_name = function() {
        return 'Tangent';
    };
    Tangent.prototype.trigonometry = function() {
        return true;
    };
    Tangent.prototype.copy = function(unify) {
        return new Tangent(this.arg(0).copy(unify));
    };
    Tangent.prototype.evaluate = function() {
        var arg = this.arg(0).evaluate();
        if (is.Value(arg))
            return Calculate.tangent(arg);
        throw 'timo.Tangent.evaluate: argument invalid: ' + this.arg(0);
    };
    /*------------------------------------------------------------
     *  Subtract
     *------------------------------------------------------------*/
    Subtract = timo.Subtract = function(left, right) {
        Expression.call(this, Functor.Subtract, left, right);
        return this;
    };
    is.Subtract = function(obj) {
        return obj instanceof Subtract;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Subtract.prototype = new F(); Subtract.prototype.constructor = Subtract; Subtract.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Subtract.prototype.class_name = function() {
        return 'Subtract';
    };
    Subtract.prototype.copy = function(unify) {
        return new Subtract(this.left().copy(unify), this.right().copy(unify));
    };
    Subtract.prototype.evaluate = function() {
        var left = this.left().evaluate();
        var right = this.right().evaluate();
        if (is.Value(left) && is.Value(right))
            return Calculate.subtract(left, right);
        return null;
    };
    /*------------------------------------------------------------
     *  Multiply
     *------------------------------------------------------------*/
    Multiply = timo.Multiply = function() {
        var len = arguments.length;
        if (len === 1 && is.array(arguments[0]))
            Expression.call(this, Functor.Multiply, arguments[0]);
        else
            Expression.call(this, Functor.Multiply, Array.prototype.slice.call(arguments));
    };
    is.Multiply = function(obj) {
        return obj instanceof Multiply;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Multiply.prototype = new F(); Multiply.prototype.constructor = Multiply; Multiply.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Multiply.prototype.class_name = function() {
        return 'Multiply';
    };
    Multiply.prototype.copy = function(unify) {
        var args = [];
        for (var i=0; i<this.arity; i++)
            args.push(this.arg(i).copy(unify));
        return new Multiply(args);
    };
    Multiply.prototype.evaluate = function() {
        var product = Calculate.Number(1);
        for (var i=0; i<this.arity; i++) {
            var value = this.arg(i).evaluate();
            if (!is.Value(value))
                return null;
            product = Calculate.multiply(product, value);
        }
        return product;
    };
    /*------------------------------------------------------------
     *  Power
     *------------------------------------------------------------*/
    Power = timo.Power = function(left, right) {
        Expression.call(this, Functor.Power, left, right);
    };
    is.Power = function(obj) {
        return obj instanceof Power;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Power.prototype = new F(); Power.prototype.constructor = Power; Power.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Power.prototype.class_name = function() {
        return 'Power';
    };
/* Should be a general case.*/
    Power.prototype.toLatex = function() {
        return this.left().toLatex() + this.functor.latex + '{' + this.right().toLatex() + '}';
    };
/**/
    Power.prototype.copy = function(unify) {
        return new Power(this.left().copy(unify), this.right().copy(unify));
    };
    Power.prototype.evaluate = function() {
        var left = this.left().evaluate();
        var right = this.right().evaluate();
        if (is.Value(right) && !Calculate.isInteger(right))
            throw 'Power.evaluate: exponent not an integer: ' + right;
        if (is.Value(left) && is.Value(right))
            return Calculate.power(left, right);
        return null;
    };
    /*------------------------------------------------------------
     *  Logarithm
     *------------------------------------------------------------*/
    Logarithm = timo.Logarithm = function(arg, base) {
        this.base = (base === undefined ? timo.e : base);
        Expression.call(this, Functor.Logarithm, arg);
    };
    is.Logarithm = function(obj) {
        return obj instanceof Logarithm;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Logarithm.prototype = new F(); Logarithm.prototype.constructor = Logarithm; Logarithm.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;
    Logarithm.prototype.class_name = function() {
        return 'Logarithm';
    };
    Logarithm.prototype.toLatex = function() {
        if (this.base === timo.e)
            return this.functor.latex + '(' + this.arg(0).toLatex() + ')';
        return this.functor.latex + '_' + this.base + '(' + this.arg(0).toLatex() + ')';
    };
    Logarithm.prototype.copy = function(unify) {
        return new Logarithm(this.base, this.arg(0).copy(unify));
    };
    Logarithm.prototype.evaluate = function() {
        var val = this.arg(0).evaluate();
        if (is.Value(val)) {
            if (val < 0)
                return NaN;
            return Calculate.logarithm(val, this.base);
        }
        return null;
    };
    /*------------------------------------------------------------
     *  Square root
     *------------------------------------------------------------*/
    Sqrt = timo.Sqrt = function(arg, degree) {
        this.degree = (degree === undefined ? 2 : degree); // TBD - degree should be an expression
        Expression.call(this, Functor.Sqrt, arg);
    };
    is.Sqrt = function(obj) {
        return obj instanceof Sqrt;
    };
    { var F = function() {}; F.prototype = Expression.prototype; Sqrt.prototype = new F(); Sqrt.prototype.constructor = Sqrt; Sqrt.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;

    Sqrt.prototype.class_name = function() {
        return 'Sqrt';
    };

    Sqrt.prototype.toLatex = function() {
        if (this.degree === 2)
            return this.functor.latex + '{' + this.arg(0).toLatex() + '}';
        return this.functor.latex + '[' + this.degree + ']' + '{' + this.arg(0).toLatex() + '}';
    };

    Sqrt.prototype.copy = function(unify) {
        return new Sqrt(this.arg(0).copy(unify), this.degree);
    };

    Sqrt.prototype.evaluate = function() {
        var arg = this.arg(0);

        var value = arg.evaluate();

        if (is.Value(value)) {
            if (value < 0) // TBD - roots of negative numbers
                return NaN;
            return Calculate.sqrt(value, this.degree);
        }
        return null;
    };


    /*------------------------------------------------------------
     *  Divide
     *------------------------------------------------------------*/

    Divide = timo.Divide = function(left, right) {
        Expression.call(this, Functor.Divide, left, right);
        return this;
    };

    is.Divide = function(obj) {
        return obj instanceof Divide;
    };

    { var F = function() {}; F.prototype = Expression.prototype; Divide.prototype = new F(); Divide.prototype.constructor = Divide; Divide.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;

    Divide.prototype.class_name = function() {
        return 'Divide';
    };

    Divide.prototype.copy = function(unify) {
        return new Divide(this.left().copy(unify), this.right().copy(unify));
    };

    Divide.prototype.evaluate = function() {
        var den = this.args[0].evaluate();
        var num = this.args[1].evaluate();

        if (is.Value(den) && is.Value(num)) {
            if (num === 0)
                return NaN;
            return den / num;
        }
        return null;
    };

    /*------------------------------------------------------------
     *  Fraction
     *------------------------------------------------------------*/

    Fraction = timo.Fraction = function(left, right) {
        Expression.call(this, Functor.Fraction, left, right);
        return this;
    };

    is.Fraction = function(obj) {
        return obj instanceof Fraction;
    };

    { var F = function() {}; F.prototype = Expression.prototype; Fraction.prototype = new F(); Fraction.prototype.constructor = Fraction; Fraction.superclass = Expression.prototype; if (Expression.prototype.constructor == Object.prototype.constructor) Expression.prototype.constructor = Expression; };;

    Fraction.prototype.class_name = function() {
        return 'Fraction';
    };

    Fraction.prototype.toLatex = function() {
        return '\\frac{' + this.left().toLatex() + '}{' + this.right().toLatex() + '}';
    };

    Fraction.prototype.copy = function(unify) {
        return new Fraction(this.left().copy(unify), this.right().copy(unify));
    };

    Fraction.prototype.evaluate = function() {
        var den = this.args[0].evaluate();
        var num = this.args[1].evaluate();

        if (is.Value(den) && is.Value(num)) {
            if (num === 0)
                return NaN;
            return den / num;
        }
        return null;
    };

    /*------------------------------------------------------------
     *  Literal: abstract class for all literals (variables, numbers, ...)
     *------------------------------------------------------------*/

    Literal = timo.Literal = function() {
        Base.call(this);

        return this;
    };

    is.Literal = function(obj) {
        return obj instanceof Literal;
    };

    { var F = function() {}; F.prototype = Base.prototype; Literal.prototype = new F(); Literal.prototype.constructor = Literal; Literal.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Literal.prototype.class_name = function() {
        return 'Literal';
    };

/*
    Literal.prototype.compute = function() {
        return this.value;
    };
*/

    Literal.prototype.evaluate = function() {
        return this.value;
    };

    Literal.prototype.unify = function(l2) {
        if (is.Any(l2))
            return l2.unify(this);
        return this.equal(l2);
    };

    Literal.prototype.rewrite = function() {
        return this;
    };

    /**
     *  Creates a Numerical (the overall class for numbers).
     *
     *  @class Numerical
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Numerical = timo.Numerical = function(val) {
        Literal.call(this);

        var value = null;

        if (is.string(val)) value = timo.make_numerical(val);
        if (is.Numerical(val)) value = val.value;
        if (is.BigNumber(val)) value = val;
        if (is.number(val)) value = Calculate.Number(val);

        if (is.Value(value)) {
            Object.defineProperty(this, 'value', {
                enumerable: true,
                writable: false,
                value: value
            });

            return;
        }

        trace('Numerical: argument not a number ' + val);
    };

    is.Numerical = function(obj) {
        return obj instanceof Numerical;
    };

    { var F = function() {}; F.prototype = Literal.prototype; Numerical.prototype = new F(); Numerical.prototype.constructor = Numerical; Numerical.superclass = Literal.prototype; if (Literal.prototype.constructor == Object.prototype.constructor) Literal.prototype.constructor = Literal; };;

    Numerical.prototype.class_name = function() {
        return 'Numerical';
    };

    Numerical.prototype.toString = function() {
        if (this.string) {
            return this.string;
        }
        return this.value.toString();
    };

    Numerical.prototype.toLatex = function() {
        return this.value.toString();
    };

    Numerical.prototype.copy = function() {
        return new Numerical(this.value);
    };

    Numerical.prototype.equal = function(n2) {
        if (is.Numerical(n2))
            return this.value.equals(n2.value); // BigNumber
        throw 'Numerical.equal: argument not a numerical';
    };


    /**
     *  Creates a Quantity
     *
     *  @class Quantity
     *  @param {number|BigNumber|Quantity} value - Quantity value.
     *  @throws Error when argument is not a number.
     */
    Quantity = timo.Quantity = function(val, unit) {
        Literal.call(this);

        this.unit = unit;

        var value = null;

        if (is.Quantity(val)) value = val.value;
        if (is.BigNumber(val)) value = val;
        if (is.number(val)) value = Calculate.Number(val);

        if (is.Value(value)) {
            Object.defineProperty(this, 'value', {
                enumerable: true,
                writable: false,
                value: value
            });

            return;
        }

        throw 'Quantity: argument not a number ' + val;
    };

    is.Quantity = function(obj) {
        return obj instanceof Quantity;
    };

    { var F = function() {}; F.prototype = Literal.prototype; Quantity.prototype = new F(); Quantity.prototype.constructor = Quantity; Quantity.superclass = Literal.prototype; if (Literal.prototype.constructor == Object.prototype.constructor) Literal.prototype.constructor = Literal; };;

    Quantity.prototype.class_name = function() {
        return 'Quantity';
    };

    Quantity.prototype.toString = function() {
        return this.value.toString() + ' ' + this.unit;
    };

    Quantity.prototype.toLatex = function() {
        return this.value.toString() + ' ' + this.unit;
    };

    Quantity.prototype.copy = function() {
        return new Quantity(this.value, this.unit);
    };

    Quantity.prototype.evaluate = function() {
        return this.value;
    };

    Quantity.prototype.equal = function(q2) {
        if (is.Quantity(q2))
            return this.value.equals(q2.value) && this.unit === q2.unit;
        throw 'Quantity.equal: argument not a quantity';
    };


    /**
     *  Creates a Real number.
     *
     *  @class Real
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Real = timo.Real = function(val) {
        Numerical.call(this, Calculate.Number(val));
    };

    is.Real = function(obj) {
        return obj instanceof Real;
    };

    { var F = function() {}; F.prototype = Numerical.prototype; Real.prototype = new F(); Real.prototype.constructor = Real; Real.superclass = Numerical.prototype; if (Numerical.prototype.constructor == Object.prototype.constructor) Numerical.prototype.constructor = Numerical; };;

    Real.prototype.class_name = function() {
        return 'Real';
    };

    Real.prototype.copy = function() {
        return new Real(this.value);
    };

    Real.prototype.evaluate = function() {
        return this.value;
    };


    /**
     *  Creates a Irrational number.
     *
     *  @class Irrational
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Irrational = timo.Irrational = function(val) {
        Real.call(this, val);

        return this;
    };

    is.Irrational = function(obj) {
        return obj instanceof Irrational;
    };

    { var F = function() {}; F.prototype = Numerical.prototype; Irrational.prototype = new F(); Irrational.prototype.constructor = Irrational; Irrational.superclass = Numerical.prototype; if (Numerical.prototype.constructor == Object.prototype.constructor) Numerical.prototype.constructor = Numerical; };;

    Irrational.prototype.class_name = function() {
        return 'Irrational';
    };

    Irrational.prototype.copy = function() {
        return new Irrational(this.value);
    };


    /**
     *  Creates a Rational number.
     *
     *  @class Irrational
     *  @param {number|BigNumber|Numerical} value - Numerical value.
     *  @throws Error when argument is not a number.
     */
    Rational = timo.Rational = function(val) {
        Real.call(this, val);

        return this;
    };

    is.Rational = function(obj) {
        return obj instanceof Rational;
    };

    { var F = function() {}; F.prototype = Numerical.prototype; Rational.prototype = new F(); Rational.prototype.constructor = Rational; Rational.superclass = Numerical.prototype; if (Numerical.prototype.constructor == Object.prototype.constructor) Numerical.prototype.constructor = Numerical; };;

    Rational.prototype.class_name = function() {
        return 'Rational';
    };

    Rational.prototype.copy = function() {
        return new Rational(this.value);
    };


    /**
     *  Creates an Integer.
     *
     *  @class Integer
     *  @param {number|BigNumber|Integer} value - The numerical value.
     *  @throws Error when argument is not a number.
     */
    Integer = timo.Integer = function(val) {
        var value = Calculate.Number(val);

        if (!Calculate.isInteger(value))
            throw 'Integer: value not an integer ' + val;
        Real.call(this, value);
    };

    is.Integer = function(obj) {
        return obj instanceof Integer;
    };

    { var F = function() {}; F.prototype = Real.prototype; Integer.prototype = new F(); Integer.prototype.constructor = Integer; Integer.superclass = Real.prototype; if (Real.prototype.constructor == Object.prototype.constructor) Real.prototype.constructor = Real; };;

    Integer.prototype.class_name = function() {
        return 'Integer';
    };

    Integer.prototype.copy = function() {
        return new Integer(this.value);
    };

    Integer.prototype.evaluate = function() {
        return this.value;
    };

    /**
     *  Creates an Natural number.
     *
     *  @class Natural
     *  @param {number|BigNumber|Natural} value - The numerical value.
     *  @throws Error when argument is not a number.
     */
    Natural = timo.Natural = function(val) {
        var value = Calculate.Number(val);

        if (!Calculate.isInteger(value))
            throw 'Natural: value not a natural ' + val;
        if (value.isNegative())
            throw 'Natural: value is negative (use Integer) ' + val;
        Integer.call(this, value);
    };

    { var F = function() {}; F.prototype = Integer.prototype; Natural.prototype = new F(); Natural.prototype.constructor = Natural; Natural.superclass = Integer.prototype; if (Integer.prototype.constructor == Object.prototype.constructor) Integer.prototype.constructor = Integer; };;

    Natural.prototype.class_name = function() {
        return 'Natural';
    };

    Natural.prototype.copy = function() {
        return new Natural(this.value);
    };

    Constant = timo.Constant = function(spec) {
        this.description = spec.description || '';
        this.symbol = spec.symbol;
        this.latex = spec.latex || this.symbol;

        Object.defineProperty(this, 'value', {
            enumerable: true,
            writable: false,
            value: spec.value
        });
    };

    { var F = function() {}; F.prototype = Literal.prototype; Constant.prototype = new F(); Constant.prototype.constructor = Constant; Constant.superclass = Literal.prototype; if (Literal.prototype.constructor == Object.prototype.constructor) Literal.prototype.constructor = Literal; };;

    Constant.prototype.class_name = function() {
        return 'Constant';
    };

    Constant.prototype.toLatex = function() {
        if (this.latex)
            return this.latex;
        throw '[Constant]: No latex for ' + this.symbol;
    };


    Degree = timo.Degree = function(val) {
        var value = Calculate.Number(val);

        Real.call(this, value);
    };

    is.Degree = function(obj) {
        return obj instanceof Degree;
    };

    { var F = function() {}; F.prototype = Real.prototype; Degree.prototype = new F(); Degree.prototype.constructor = Degree; Degree.superclass = Real.prototype; if (Real.prototype.constructor == Object.prototype.constructor) Real.prototype.constructor = Real; };;

    Degree.prototype.class_name = function() {
        return 'Degree';
    };

    Degree.prototype.copy = function() {
        return new Degree(this.value);
    };

    Degree.prototype.radians = function() {
        return Calculate.multiply(this.value, Calculate.degree());
    };


    /*------------------------------------------------------------
     *  Any: logical variables
     *------------------------------------------------------------*/

    Any = timo.Any = function(name, bind) {
        Base.call(this);

        this.name = (name === undefined ? '_' : name);
        this.binding = (bind === undefined ? null : bind);

        return this;
    };

    is.Any = function(obj) {
        return obj instanceof Any;
    };

    { var F = function() {}; F.prototype = Base.prototype; Any.prototype = new F(); Any.prototype.constructor = Any; Any.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;

    Any.prototype.class_name = function() {
        return 'Any';
    };

    Any.prototype.toString = function() {
        if (this.binding)
            return 'any(' + this.name + '=' + this.binding + ')';
        return 'any(' + this.name + ')';
    };

    Any.prototype.unbound = function() {
        return this.binding === null;
    };

    Any.prototype.copy = function(unify) {
        if (unify) {
            if (this.binding)
                return this.binding.copy();
            throw 'Error: trying to unify ' + this + ' with no binding';
        }
        return new Any(undefined, this.binding);
    };

    Any.prototype.unify = function(exp) {
        if (this.binding === null) {
            this.binding = exp;
            return true;
        }
        return this.binding.equal(exp);
    };

    Any.prototype.deunify = function() {
        this.binding = null;
    };


    /*------------------------------------------------------------
     *  AnyReal: logical variable matching any number
     *------------------------------------------------------------*/

    AnyReal = timo.AnyReal = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    };

    is.AnyReal = function(obj) {
        return obj instanceof AnyReal;
    };

    { var F = function() {}; F.prototype = Any.prototype; AnyReal.prototype = new F(); AnyReal.prototype.constructor = AnyReal; AnyReal.superclass = Any.prototype; if (Any.prototype.constructor == Object.prototype.constructor) Any.prototype.constructor = Any; };;

    AnyReal.prototype.class_name = function() {
        return 'AnyReal';
    };

    AnyReal.prototype.toString = function() {
        if (this.binding)
            return 'any_real(' + this.name + '=' + this.binding + ')';
        return 'any_real(' + this.name + ')';
    };

    AnyReal.prototype.unify = function(exp) {
        if (is.Real(exp)) {
            this.binding = exp;
            return true;
        }
        return false;
    };


    /*------------------------------------------------------------
     *  AnyInteger: logical variable matching any integer
     *------------------------------------------------------------*/

    AnyInteger = timo.AnyInteger = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    };

    is.AnyInteger = function(obj) {
        return obj instanceof AnyInteger;
    };

    { var F = function() {}; F.prototype = Any.prototype; AnyInteger.prototype = new F(); AnyInteger.prototype.constructor = AnyInteger; AnyInteger.superclass = Any.prototype; if (Any.prototype.constructor == Object.prototype.constructor) Any.prototype.constructor = Any; };;

    AnyInteger.prototype.class_name = function() {
        return 'AnyInteger';
    };

    AnyInteger.prototype.toString = function() {
        if (this.binding)
            return 'any_integer(' + this.name + '=' + this.binding + ')';
        return 'any_integer(' + this.name + ')';
    };

    AnyInteger.prototype.unify = function(exp) {
//        printf('        AnyInteger.unify ' + this);
//        printf('          ' + exp + ' ' + is.Integer(exp));
        if (is.Integer(exp)) {
            this.binding = exp;
            return true;
        }
        return false;
    };


    /*------------------------------------------------------------
     *  AnyNumerical: logical variable matching any numerical
     *------------------------------------------------------------*/

    AnyNumerical = timo.AnyNumerical = function(name, bind) {
        Any.call(this, name, bind);

        return this;
    };

    is.AnyNumerical = function(obj) {
        return obj instanceof AnyNumerical;
    };

    { var F = function() {}; F.prototype = Any.prototype; AnyNumerical.prototype = new F(); AnyNumerical.prototype.constructor = AnyNumerical; AnyNumerical.superclass = Any.prototype; if (Any.prototype.constructor == Object.prototype.constructor) Any.prototype.constructor = Any; };;

    AnyNumerical.prototype.class_name = function() {
        return 'AnyNumerical';
    };

    AnyNumerical.prototype.toString = function() {
        if (this.binding)
            return 'any_numerical(' + this.name + '=' + this.binding + ')';
        return 'any_numerical(' + this.name + ')';
    };

    AnyNumerical.prototype.unify = function(exp) {
//        printf('        AnyNumerical.unify ' + this);
//        printf('          ' + exp + ' ' + is.Numerical(exp));
        if (is.Numerical(exp)) {
            this.binding = exp;
            return true;
        }
        return false;
    };


    /*------------------------------------------------------------
     *  Variable: class for variables
     *------------------------------------------------------------*/

    Variable = timo.Variable = function(str, spec) {
        spec = spec || {};

        var sys = (spec.system === undefined ? DefaultSystem : spec.system);

        if (sys.lookup_variable(str))
            return sys.lookup_variable(str);

        for (var p in spec) { // Required?
            if (this[p] === undefined)
                this[p] = spec[p];
        }

        this.id = id();
        this.symbol = str;
        this.greek = (spec.greek === undefined ? false : spec.greek);
        this.latex = (spec.latex === undefined ? null : spec.latex);
        this.unicode = (spec.unicode === undefined ? null : spec.unicode);
        this.subscript = (spec.subscript === undefined ? null : spec.subscript);
        this.assign((spec.value === undefined ? null : spec.value));

        sys.add_variable(this);

        return this;
    };

    is.Variable = function(obj) {
        return obj instanceof Variable;
    };

    Variable.prototype.class_name = function() {
        return 'Variable';
    };

    Variable.prototype.toString = function() {
        var symbol = (this.unicode || this.symbol);
        var sub = (this.subscript ? (this.subscript.unicode || this.subscript.symbol) : undefined);
        if (sub)
            return symbol + ';' + sub;
        return symbol;
    };

    Variable.prototype.toLatex = function() {
        var str;

        console.log('Variable.toLatex ' + this.symbol);
        console.log('  - .unicode ' + this.unicode);
        console.log('  - .latex   ' + this.latex);
        console.log('  - .greek   ' + this.greek);

        if (this.subscript) {
            console.log('  * .symbol  ' + this.subscript.unicode);
            console.log('  * .unicode ' + this.subscript.unicode);
            console.log('  * .latex   ' + this.subscript.latex);
            console.log('  * .greek   ' + this.subscript.greek);
        }

        str = this.latex || this.unicode || this.symbol;

        if (this.subscript) {
            str += '_{';
            if (this.subscript.greek)
                str += '\\' + this.subscript.symbol;
            else
                str += this.subscript.symbol || this.subscript.unicode;
            str += '}';
        }
        return str;
    };

    Variable.prototype.copy = function() {
        return new Handle(this);
    };

    Variable.prototype.evaluate = function() {
        if (is.Value(this.value))
            return this.value.evaluate();
        return this.value;
    };

    Variable.prototype.assign = function(value) {
        if (value === null) {
            this.value = null;
            return this;
        }
        if (is.string(value)) {
            this.value = timo.make_numerical(value);
            return;
        }
        if (is.Numerical(value)) {
            this.value = value;
            return this;
        }
        if (is.number(value) || is.BigNumber(value)) {// TBD - Numerical
            var num = Calculate.Number(value);

            if (Calculate.isInteger(num)) {
                this.value = new Integer(num);
            } else
                this.value = new Real(num);
            this.modified = true;
            return this;
        }
        trace('Variable.assign: value not a number ' + value);
    };


    /*------------------------------------------------------------
     *  Handle: class for a pointer to a variable
     *------------------------------------------------------------*/

    Handle = timo.Handle = function(v) {
        Literal.call(this);

        if (is.Variable(v)) {
            Object.defineProperty(this, 'variable', {
                enumerable: true,
                writable: false,
                value: v
            });
            return this;
        }

        throw 'Handle: argument not a Variable ' + v;
    };

    is.Handle = function(obj) {
        return obj instanceof Handle;
    };

    { var F = function() {}; F.prototype = Literal.prototype; Handle.prototype = new F(); Handle.prototype.constructor = Handle; Handle.superclass = Literal.prototype; if (Literal.prototype.constructor == Object.prototype.constructor) Literal.prototype.constructor = Literal; };;

    Handle.prototype.class_name = function() {
        return 'Handle';
    };

    Handle.prototype.toString = function() {
        return this.variable.toString();
    };

    Handle.prototype.toLatex = function() {
        return this.variable.toLatex();
    };

    Handle.prototype.equal = function(h2) {
        if (is.Handle(h2))
            return this.variable.symbol === h2.variable.symbol;
        if (is.Variable(h2))
            return this.variable.symbol === h2.symbol;
        return false;
    };

    Handle.prototype.copy = function() {
        return new Handle(this.variable);
    };

    Handle.prototype._variables = function(vars) {
        vars[this.variable.symbol] = this.variable;
        return vars;
    };

    Handle.prototype.evaluate = function() {
        return this.variable.evaluate();
    };

    Handle.prototype.symbol = function() {
        return this.variable.symbol();
    };

    Handle.prototype.assign = function(val) {
        return this.variable.assign(val);
    };

    /** Return a new array in which all duplicate elements of the argument array
     *  are removed.
     *
     *  @param {Array} a	Input array.
     *  @returns {Array}	New array without any duplicate elements.
     */
    timo.remove_duplicates = function(array) {
        var rval = [];

        for (var i=0; i<array.length; i++) {
            var e = array[i];

            if (array.indexOf(e, i+1) === -1)
                rval.push(e);
        }

        return rval;
    };

    /*------------------------------------------------------------
     *  System: a (named) system of equalities
     *------------------------------------------------------------*/

    System = timo.System = function(name) {
        var sys = this;

        sys.id = id();
        sys.name = name;

        sys.variables = {}; // Indexed by symbol
        sys.dependencies = {}; // Dependencies of the variables,
     // array of EqualsVariables
        sys.equalities = [];
        sys.expressions = [];
        sys.modified = false; // Equalss have been added

        return sys;
    };

    is.System = function(obj) {
        return obj instanceof System;
    };

    System.prototype.add_variable = function(v) {
        if (!this.lookup_variable(v))
            this.variables[v.symbol] = v;

        return this;
    };

    System.prototype.lookup_variable = function(v) {
        var str = (is.string(v) ? v : v.symbol);

        return (this.variables[str] || null);
    };

    /**
     *  Returns an array of dependencies for variable v.  The array contains
     *  object literals of the form { equation: eq, variables: vars} where eq
     *  is an equation and vars the variables that are dependent on v.
     *
     *  @param {Variable} v	Variable for which to find dependencies
     *  @returns {Array}	Array of dependencies as object literals
     */
    System.prototype.dependencies = function(v) {
        var sys = this;
        var vs = sys.variables;
        var eqs = sys.equalities;
        var rval = [];

        for (var i=0; i<eqs.length; i++) {
            var eq = eqs[i];

            if (eq.contains(v)) {
                var deps = [];

                for (var p in vs) {
                    var w = vs[p];

                    if (v === w)
                        continue;
                    if (eq.contains(w))
                        deps.push(w);
                }
                if (deps.length > 0)
                    rval.push({
                        equation: eq,
                        variables: deps
                    });
            }
        }

        return rval;
    };

    System.prototype.pp_status = function() {
        var sys = this;
        var vs = sys.variables;

        console.log('System status ');
        for (var p in vs) {
            var v = vs[p];
            console.log(v.symbol() + '  value=' + v.value() + ' m=' + v.modified() + ' l=' + v.locked() + ' c=' + v.constant() + ' u=' + v.updated());

        }
    };

    System.prototype.pretty_print = function() {
        var vars = this.variables;
        var v;

        console.log('---- pretty print ---');
        console.log('System ' + this.name);
        console.log('  Variables ');
        console.log(JSON.stringify(vars,null,4));
        for (v in vars) {
            var rv = vars[v];
            console.log('    ' + rv.id + ' ' + rv.symbol + ' = ' + rv.value);
        }
        console.log('  --*--*--*--');
        console.log('  Equalities');
        for (v=0; v<this.equalities.length; v++) {
            console.log('    ' + this.equalities[v]);
        }
        console.log('<<<<<<<<<<<<<<<< done');
    };

    /**
     * Add an equation to the system.  Any variables in the equation that are
     * already in the system are made to point to the same variable. 
     */
    System.prototype.add_equation = function(eq) {
        var sys = this;

        if (!eq instanceof Equals)
            throw 'timo.System.add_equation(): not an equation ' + eq;

        eq.traverse(function() {
            if (is.Handle(this)) {
                if (!sys.lookup_variable(this.variable))
                    sys.add_variable(this.variable);
            }
        });
        sys.equalities.push(eq);
        sys.modified = true;

        return sys;
    };

    System.prototype.add_expression = function(exp) {
        var sys = this;

        if (!is.Expression(exp))
            throw 'timo.System.add_expression(): not an equation ' + exp;

        sys.expressions.push(exp);

        return sys;
    };

    System.prototype.printf_status = function() {
        var vs = this.variables;
        var p;

        for (p in vs) {
            var v = vs[p];
            console.log(v + ' ' + v.value() + ' u=' + v.updated() + ' m=' + v.modified() + ' ' + v.role());

        }
    };


    System.prototype.solve_modified = function(v) {
        if (v.updated()) {
            v.modified(false);
            return;
        }

        var sys = this;
        var deps = sys.dependencies(v);
        var i, j;

        v.modified(false);
        v.updated(true); // Prevent cycles

        for (i=0; i<deps.length; i++) {
            var eq = deps[i].equation;
            var vs = deps[i].variables;

            if (vs.length < 1)
                continue;

            //  Only one dependent variable in this equation.
            //  Compute new value of the variable, and set modified flag.
            if (vs.length === 1) {
                sys.solve_single(eq, vs[0]);
                continue;
            }

            //  Multiple dependent variables.  Find one that needs to be computed.
            for (j=0; j<vs.length; j++) {
                var w = vs[j];
                if (w.role() === 'input' || w.role() === 'constant' || w.role() === 'i/o')
                    continue;
                sys.solve_single(eq, w);
                break;
            }
        }
    };

    System.prototype.solve_single = function(eq, v) {
        var right = eq.isolate_left(v);

        if (right) {
            var value = right.evaluate();

            if (value !== null) {
                v.value(value);
                v.modified(true);
//              v.updated(true);
            }
        } else {
            console.log('*** Could not isolate ' + v + ' in ' + eq);
            v.updated(true);
        }
    };

    System.prototype.evaluate_equation = function(base_eq, v) {
        var sys = this;
        var deps = sys.dependencies;
        var evs = deps[v.id];

        for (var i=0; i<evs.length; i++) {
            var ev = evs[i];

            if (ev.equation() === base_eq) {
                var val = ev.expression().evaluate();
                v.value(val);
            }
        }

        return sys;
    };

    System.prototype.solve_unknowns = function(prev) {
        var sys = this;
        var unknowns = [];
        var vs = sys.variables;
        var deps = sys.dependencies;
        var v;

        for (var p in vs) {
            v = vs[p];

            if (v.unknown())
                unknowns.push(v);
        }

        if (unknowns.length === 0)
            return sys;

        if (prev) {
            var identical = true;

            for (var x=0; x<prev.length; x++) {
                if (prev[x] === unknowns[x])
                    continue;
                identical = false;
            }
            if (identical) {
                sys.pp_status();
                throw 'Error: loop in System.solve_unknowns';
            }
        }

        for (var i=0; i<unknowns.length; i++) {
            v = unknowns[i];

            if (!v.unknown())
                continue;

            var evs = deps[v.id];

            for (var j=0; j<evs.length; j++) {
                var ev = evs[j];
                var vs2 = ev.variables();
                var can_compute = true;

                for (var k=0; k<vs2.length; k++) {
                    if (vs2[k].unknown()) {
                        can_compute = false;
                        break;
                    }
                }
                if (can_compute) {
                    v.value(ev.expression().evaluate());
                    break;
                }
            }
        }

        return sys.solve_unknowns(unknowns);
    };

    System.prototype.initialise = function() {
        var sys = this;

        if (sys.modified) {
            sys.isolate_all();
            sys.modified = false;
        }

        return sys;
    };

    System.prototype.variable = function(v) {
        var sys = this;
        var vs = this.variables;

        if (typeof(v) === 'string') {
            for (var p in vs) {
                if (vs[p].name() === v || vs[p].symbol() === v)
                    return vs[p];
            }
            return null;
        }

        if (v instanceof Variable)
            return vs[v.id] ? v : null;

        return null;
    };

    System.prototype.solve = function() {
        var sys = this;

        //  Initialise
        if (sys.modified) {
            sys.isolate_all();
            sys.modified = false;
        }

        sys.solve_unknowns();

        var vs = sys._variables;
        var mods = [];

        for (var p in vs) {
            if (vs[p].modified() === true) {
                if (vs[p].locked())
                    throw 'timo.System.solve: variable ' + vs[p].symbol() + ' is both modified and locked';
                mods.push(vs[p]);
            }
        }

        solve_using_dependencies(mods);
        sys.clear_modifications();

        return sys;

        function solve_using_dependencies(mods) {
            var new_mods = [];
            var deps = sys.dependencies;
            var v2;

            for (var k=0; k<mods.length; k++) {
                var v = mods[k];
                var evs = deps[v.id];

                if (v.locked())
                    throw 'timo.solve_using_dependencies(): trying to update locked variable ' + v.symbol();

                for (var i=0; i<evs.length; i++) {
                    var ev = evs[i];
                    var updatable = [];

                    for (var j=0; j<ev.variables().length; j++) {
                        v2 = ev.variables()[j];

                        if (v2.is_modifiable() === false)
                            continue;
                        updatable.push(v2);
                    }

                    switch (updatable.length) {
                    case 0:
                        break;
                    case 1:
                        v2 = updatable[0];
                        sys.evaluate_equation(ev.equation(), v2);
                        v2.modified(true);
                        new_mods.push(v2);
                        break;
                    default:
                        console.log('---------------------------------');
                        console.log('DETAILED ERROR REPORT');
                        console.log('    variable ' + v.symbol());
                        console.log('    dependencies ' + updatable);
                        sys.pp_status();
                        throw 'timo.System.solve: too many dependencies';
                    }
                }
                v.modified(false);
                v.updated(true);
            }

            if (new_mods.length > 0)
                return solve_using_dependencies(new_mods);
        }
    };

    var DefaultSystem = timo.DefaultSystem = new System('default');

    /*------------------------------------------------------------
     *  Utility functions
     *------------------------------------------------------------*/

    var current_id = 0;

    function spaces(n) {
        var str = '';
        while (n-- > 0)
            str += ' ';
        return str;
    }

    //  Used in rewriting
    function copy_substition(sub) {
        if (is.func(sub))
            return sub.call().copy(true);
        return sub.copy(true);
    }

    function id() {
        return ++current_id;
    }

    function trace(msg) {
        if (is.in_nodejs()) {
            console.trace(msg);
            throw msg;
        }
        throw msg;
    }

    timo.make_numerical = function(exp) {
        var rval, num;

        if (is.Numerical(exp))
            return exp;
        if (is.string(exp)) {
            if (exp.match(/[\-+]?[0-9]/)) {
                num = Calculate.Number(exp);
                rval = (Calculate.isInteger(num) ? new Integer(num) : new Real(num));
                rval.string = exp;
                return rval;
            }
            throw 'make_numerical failed on ' + exp;
        }
        if (is.number(exp) || is.BigNumber(exp)) {
            num = Calculate.Number(exp);

            if (Calculate.isInteger(num)) {
                return new Integer(num);
            }
            return new Real(num);
        }
        throw 'make_numerical failed on ' + exp;
    };

    if (is.in_nodejs()) {
        Calculate = require('./calculate');
        Functor = require('./functor');
    } else {
        Calculate = timo.calculate = timo.calculate || {};
        Functor = timo.functor = timo.functor || {};
    }

    var PI = timo.PI = new Constant({
        description: 'To be written.',
        symbol: 'pi',
        latex: '\\pi',
        value: Calculate.PI()
    });

    var E = timo.E = new Constant({
        description: "Euler's constant",
        symbol: 'e',
        latex: '\\mathrm{e}',
        value: Calculate.E()
    });

    timo.constants = {
        PI: PI,
        E: E
    };
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	functor.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Functors (like add, sine, log, ...)
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		21/11/15  (Last modified)
 */
(function() {
    "use strict";
    console.log('========== loading tools/expression/js/functor.js');
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = (is.in_nodejs()) ? require('./expression') : libs.timo;
    //  Namespace
    var Functor = timo.functor = timo.functor || {};
    //  Indexes
    var Functors = Functor.Functors = {}; // Indexed by name (e.g., 'add')
    var Operators = Functor.Operators = {}; // Arrays, indexed by symbol (e.g., '+')
    var ZERO = new timo.Integer(0);
    var Base = Functor.Base = function(spec) {
        for (var p in spec)
            if (!this.hasOwnProperty(p))
                this[p] = spec[p];
        if (this.name)
            Functors[this.name] = this;
        if (this.symbol) {
            if (!Operators[this.symbol])
                Operators[this.symbol] = [];
            Operators[this.symbol].push = this;
        } else {
            this.symbol = this.name;
            console.log('this.symbol = this.name ' + this.symbol);
        }
    };
    var Add = function() {
        Base.call(this, {
            name: 'add',
            symbol: '+',
            latex: '+',
            unicode: '+',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 4,
            arity: {
                minimum: 2,
                maximum: Infinity
            },
            identity: ZERO,
            create: function(args) { return new timo.Add(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Add.prototype = new F(); Add.prototype.constructor = Add; Add.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Plus = function() {
        Base.call(this, {
            symbol: 'plus',
            latex: '+',
            unicode: '+',
            prefix: true,
            associativity: 'right',
            precedence: 2,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Plus(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Plus.prototype = new F(); Plus.prototype.constructor = Plus; Plus.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Subtract = function() {
        Base.call(this, {
            name: 'subtract',
            symbol: '-',
            latex: '-',
            unicode: '\u2212',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 4,
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Subtract(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Subtract.prototype = new F(); Subtract.prototype.constructor = Subtract; Subtract.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Minus = function() {
        Base.call(this, {
            name: 'minus',
            symbol: '-',
            latex: '-',
            unicode: '\u2212',
            prefix: true,
            associativity: 'right',
            precedence: 2,
            brackets: true,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Minus(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Minus.prototype = new F(); Minus.prototype.constructor = Minus; Minus.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Multiply = function() {
        Base.call(this, {
            name: 'miltiply',
            symbol: '*',
            latex: '\\cdot',
            unicode: '\u00D7',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 3,
            identity: timo.Integer(1),
            arity: {
                minimum: 2,
                maximum: Infinity
            },
            create: function(args) { return new timo.Multiply(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Multiply.prototype = new F(); Multiply.prototype.constructor = Multiply; Multiply.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Divide = function() {
        Base.call(this, {
            name: 'divide',
            symbol: '/',
            latex: '/',
            unicode: '/',
            infix: true,
            commutative: true,
            associative: true,
            associativity: 'left',
            precedence: 3,
            arity: {
                minimum: 2,
                maximum: Infinity
            },
            create: function(args) { return new timo.Divide(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Divide.prototype = new F(); Divide.prototype.constructor = Divide; Divide.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Equals = function() {
        Base.call(this, {
            name: 'equals',
            symbol: '=',
            latex: '=',
            unicode: '=',
            infix: true,
            precedence: 14,
            associativity: 'right',
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Equals(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Equals.prototype = new F(); Equals.prototype.constructor = Equals; Equals.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Fraction = function() {
        Base.call(this, {
            name: 'fraction',
            symbol: '/',
            latex: '\\frac',
            unicode: '\u00F7',
            infix: true,
            associativity: 'left',
            precedence: 3,
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Fraction(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Fraction.prototype = new F(); Fraction.prototype.constructor = Fraction; Fraction.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Power = function() {
        Base.call(this, {
            name: 'power',
            symbol: '^',
            latex: '^',
            unicode: '^',
            infix: true,
            associativity: 'right',
            precedence: 1,
            curly: true,
            right_to_left: true,
            arity: {
                minimum: 2,
                maximum: 2
            },
            create: function(args) { return new timo.Power(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Power.prototype = new F(); Power.prototype.constructor = Power; Power.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Logarithm = function() {
        Base.call(this, {
            name: 'log',
            symbol: 'log',
            latex: '\\log',
            unicode: 'log',
            brackets: true,
            prefix: true,
            func: true,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 2
            },
            range: {
                minimum: 0,
                maximum: Infinity
            },
            create: function(args) { return new timo.Logarithm(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Logarithm.prototype = new F(); Logarithm.prototype.constructor = Logarithm; Logarithm.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Sqrt = function() {
        Base.call(this, {
            name: 'sqrt',
            symbol: 'sqrt',
            latex: '\\sqrt',
            unicode: '\u221A',
            brackets: true,
            curly: true,
            prefix: true,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Sqrt(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Sqrt.prototype = new F(); Sqrt.prototype.constructor = Sqrt; Sqrt.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Sine = function() {
        Base.call(this, {
            name: 'sin',
            symbol: 'sin',
            latex: '\\sin',
            unicode: 'sin',
            prefix: true,
            brackets: false,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Sine(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Sine.prototype = new F(); Sine.prototype.constructor = Sine; Sine.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Cosine = function() {
        Base.call(this, {
            name: 'cos',
            symbol: 'cos',
            latex: '\\cos',
            unicode: 'cos',
            prefix: true,
            brackets: false,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Cosine(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Cosine.prototype = new F(); Cosine.prototype.constructor = Cosine; Cosine.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    var Tangent = function() {
        Base.call(this, {
            name: 'tan',
            symbol: 'tan',
            latex: '\\tan',
            unicode: 'tan',
            prefix: true,
            brackets: false,
            precedence: 0,
            arity: {
                minimum: 1,
                maximum: 1
            },
            create: function(args) { return new timo.Tangent(args); }
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Tangent.prototype = new F(); Tangent.prototype.constructor = Tangent; Tangent.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    /*------------------------------------------------------------
     *  Create the instances
     *------------------------------------------------------------*/
    Functor.Add = new Add();
    Functor.Plus = new Plus();
    Functor.Subtract = new Subtract();
    Functor.Minus = new Minus();
    Functor.Multiply = new Multiply();
    Functor.Divide = new Divide();
    Functor.Equals = new Equals();
    Functor.Fraction = new Fraction();
    Functor.Power = new Power();
    Functor.Logarithm = new Logarithm();
    Functor.Sqrt = new Sqrt();
    Functor.Sine = new Sine();
    Functor.Cosine = new Cosine();
    Functor.Tangent = new Tangent();
    if (is.in_nodejs())
        module.exports = Functor;
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	type.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Number types (like rational)
 *  Works with	ECMAScript 5.1, node.js
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	18/09/15  (Created)
 *		05/11/15  (Last modified)
 */
(function() {
    "use strict";
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = (libs.timo || require('./expression.js'));
    var type = timo.type = timo.type || {};
    console.log('========== loading tools/expression/js/type.js');
    var Base;
    var Natural;
    var Integer;
    var Rational;
    var Real;
    var Complex;
    var Irrational;
    var Whole;
    var Prime;
    Base = type.Base = function(spec) {
        for (var p in spec)
            this[p] = spec[p];
    };
    Natural = type.Natural = function() {
        Base.call({
            description: 'All counting numbers: 0, 1, ...',
            symbol: 'N',
            html: '<b>N</b>',
            latex: '\\mathbb{N}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Natural.prototype = new F(); Natural.prototype.constructor = Natural; Natural.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Integer = type.Integer = function() {
        Base.call({
            description: 'All positive and negative numbers including 0.',
            symbol: 'Z',
            html: '<b>Z</b>',
            latex: '\\mathbb{Z}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Integer.prototype = new F(); Integer.prototype.constructor = Integer; Integer.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Rational = type.Rational = function() {
        Base.call({
            description: 'A number that can be represented as a fraction of integers.',
            symbol: 'Q',
            html: '<b>Q</b>',
            latex: '\\mathbb{Q}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Rational.prototype = new F(); Rational.prototype.constructor = Rational; Rational.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Real = type.Real = function() {
        Base.call({
            description: 'All measurable numbers.',
            symbol: 'R',
            html: '<b>R</b>',
            latex: '\\mathbb{R}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Real.prototype = new F(); Real.prototype.constructor = Real; Real.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Complex = type.Complex = function() {
        Base.call({
            description: 'Complex numbers.',
            symbol: 'C',
            html: '<b>C</b>',
            latex: '\\mathbb{C}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Complex.prototype = new F(); Complex.prototype.constructor = Complex; Complex.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Irrational = type.Irrational = function() {
        Base.call({
            description: 'Irrational numbers.',
            symbol: 'I',
            html: '<b>I</b>',
            latex: '\\mathbb{I}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Irrational.prototype = new F(); Irrational.prototype.constructor = Irrational; Irrational.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Whole = type.Whole = function() {
        Base.call({
            description: 'Whole numbers.',
            symbol: 'W',
            html: '<b>W</b>',
            latex: '\\mathbb{W}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Whole.prototype = new F(); Whole.prototype.constructor = Whole; Whole.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    Prime = type.Prime = function() {
        Base.call({
            description: 'Whole numbers.',
            symbol: 'P',
            html: '<b>P</b>',
            latex: '\\mathbb{P}'
        });
    };
    { var F = function() {}; F.prototype = Base.prototype; Prime.prototype = new F(); Prime.prototype.constructor = Prime; Prime.superclass = Base.prototype; if (Base.prototype.constructor == Object.prototype.constructor) Base.prototype.constructor = Base; };;
    if (is.in_nodejs())
        module.exports = timo.type;
}).call(this);
/*  $Id$        -*- mode: javascript -*-
 *  
 *  File        symbols.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose     Symbols (LaTeX, unicode)
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2015  University of Twente
 *  
 *  History     22/11/15  (Created)
 *		22/11/15  (Last modified)
 */
(function() {
    "use strict";
    console.log('========== loading tools/expression/js/symbols.js');
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = (libs.timo || require('./expression'));
    var Symbols = timo.symbols = timo.symbols || {};
    if (is.in_nodejs())
        module.exports = Symbols;
    Symbols.greek = {
        alpha: {
            latex: '\\alpha',
            unicode: '\u03B1'
        },
        beta: {
            latex: '\\beta',
            unicode: '\u03B2'
        },
        gamma: {
            latex: '\\gamma',
            unicode: '\u03B3'
        },
        delta: {
            latex: '\\delta',
            unicode: '\u03B4'
        },
        epsilon: {
            latex: '\\epsilon',
            unicode: '\u03B5'
        },
        zeta: {
            latex: '\\zeta',
            unicode: '\u03B6'
        },
        eta: {
            latex: '\\eta',
            unicode: '\u03B7'
        },
        theta: {
            latex: '\\theta',
            unicode: '\u03B8'
        },
        iota: {
            latex: '\\iota',
            unicode: '\u03B9'
        },
        kappa: {
            latex: '\\kappa',
            unicode: '\u03BA'
        },
        lambda: {
            latex: '\\lambda',
            unicode: '\u03BB'
        },
        mu: {
            latex: '\\mu',
            unicode: '\u03BC'
        },
        nu: {
            latex: '\\nu',
            unicode: '\u03BD'
        },
        xi: {
            latex: '\\xi',
            unicode: '\u03BE'
        },
        pi: {
            latex: '\\pi',
            unicode: '\u03C0'
        },
        rho: {
            latex: '\\rho',
            unicode: '\u03C1'
        },
        sigma: {
            latex: '\\sigma',
            unicode: '\u03C3'
        },
        tau: {
            latex: '\\tau',
            unicode: '\u03C4'
        },
        upsilon: {
            latex: '\\upsilon',
            unicode: '\u03C5'
        },
        phi: {
            latex: '\\phi',
            unicode: '\u03C6'
        },
        chi: {
            latex: '\\chi',
            unicode: '\u03C7'
        },
        psi: {
            latex: '\\psi',
            unicode: '\u03C8'
        },
        omega: {
            latex: '\\omega',
            unicode: '\u03C9'
        },
        Alpha: {
            latex: 'A',
            unicode: '\u0391'
        },
        Beta: {
            latex: 'B',
            unicode: '\u0392'
        },
        Gamma: {
            latex: '\\Gamma',
            unicode: '\u0393'
        },
        Delta: {
            latex: '\\Delta',
            unicode: '\u0394'
        },
        Epsilon: {
            latex: 'E',
            unicode: '\u0395'
        },
        Zeta: {
            latex: 'Z',
            unicode: '\u0396'
        },
        Eta: {
            latex: 'H',
            unicode: '\u0397'
        },
        Theta: {
            latex: '\\Theta',
            unicode: '\u0398'
        },
        Iota: {
            latex: 'I',
            unicode: '\u0399'
        },
        Kappa: {
            latex: 'K',
            unicode: '\u039A'
        },
        Lambda: {
            latex: '\\Lambda',
            unicode: '\u039B'
        },
        Mu: {
            latex: 'M',
            unicode: '\u039C'
        },
        Nu: {
            latex: 'N',
            unicode: '\u039D'
        },
        Xi: {
            latex: '\\Xi',
            unicode: '\u039E'
        },
        Pi: {
            latex: '\\Pi',
            unicode: '\u03A0'
        },
        Rho: {
            latex: 'P',
            unicode: '\u03A1'
        },
        Sigma: {
            latex: '\\Sigma',
            unicode: '\u03A3'
        },
        Tau: {
            latex: 'T',
            unicode: '\u03A4'
        },
        Upsilon: {
            latex: '\\Upsilon',
            unicode: '\u03A5'
        },
        Phi: {
            latex: '\\Phi',
            unicode: '\u03A6'
        },
        Chi: {
            latex: 'X',
            unicode: '\u03A7'
        },
        Psi: {
            latex: '\\Psi',
            unicode: '\u03A8'
        },
        Omega: {
            latex: '\\Omega',
            unicode: '\u03A9'
        }
    };
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	parser.js
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Expression parser
 *  Works with	ECMAScript 5.1, node.js, jison 0.4.15
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	20/09/15  (Created)
 *		21/11/15  (Last modified)
 */
(function() {
    console.log('========== loading tools/expression/js/parser.js');
    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};
    var is = (utils.is || require('./is'));
    var timo = (is.in_nodejs() ? require('./expression') : libs.timo);
    var Functor = (is.in_nodejs() ? require('./functor') : timo.functor);
    var Symbols = (is.in_nodejs() ? require('./symbols') : timo.symbols);
    var Parser = timo.parser = timo.parser || {};
    /**
     *  Parse an expression.
     *
     *  @param {String} string - An input expression as ASCII string.
     *  @returns {Expression|null} expr - Expression object or null.
     */
    Parser.parse = function(str) {
        return Parser.grammar.parse(str);
    };
    /**
     *  Either cut-and-paste this or use #include with cpp.
     */
    //  Base algebra
    function add() {
        var args = [];
        for (var i=0; i<arguments.length; i++) args[i] = arguments[i];
        return new timo.Add(args);
    }
    function multiply() {
        var args = [];
        for (var i=0; i<arguments.length; i++) args[i] = arguments[i];
        return new timo.Multiply(args);
    }
    function subtract(lhs, rhs) { return new timo.Subtract(lhs, rhs); }
    function divide(lhs, rhs) { return new timo.Divide(lhs, rhs); }
    //  Unary algebra
    function minus(val) { return new timo.Minus(val); }
    function plus(val) { return new timo.Plus(val); }
    //  Extended algebra
    function fraction(lhs, rhs) { return new timo.Fraction(lhs, rhs); }
    function power(base, exp) { return new timo.Power(base,exp); }
    function sqrt(arg,deg) { return new timo.Sqrt(arg,deg); }
    function log(arg,base) { return new timo.Logarithm(arg,base); }
    //  Equals
    function equals(lhs, rhs) { return new timo.Equals(lhs, rhs); }
    function variable(s,spec) { return new timo.Variable(s,spec); }
    function handle(v) { return new timo.Handle(v); }
    //  Numbers
    function make_numerical(val) { return timo.make_numerical(val); }
    function numerical(val) { return new timo.Numerical(val); }
    function real(val) { return new timo.Real(val); }
    function irrational(val) { return new timo.Irrational(val); }
    function rational(val) { return new timo.Rational(val); }
    function integer(val) { return new timo.Integer(val); }
    //  Trigonometry
    function sin(arg) { return new timo.Sine(arg); }
    function cos(arg) { return new timo.Cosine(arg); }
    function tan(arg) { return new timo.Tangent(arg); }
    function constant(name) {
      if (is.object(name))
        return new timo.Constant(name);
      return timo.constants[name];
    }
    //  Logical variables
    function any(name) { return new timo.Any(name); }
    function any_numerical(name) { return new timo.AnyNumerical(name); }
    function any_real(name) { return new timo.AnyReal(name); }
    function any_integer(name) { return new timo.AnyInteger(name); }
    /**
     *  Grammar is specified in ../grammar.jison.
     */
    Parser.grammar = (function(){
/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,3],$V2=[1,5],$V3=[1,6],$V4=[1,7],$V5=[1,8],$V6=[1,9],$V7=[1,10],$V8=[1,11],$V9=[1,12],$Va=[1,14],$Vb=[1,15],$Vc=[1,16],$Vd=[1,17],$Ve=[1,19],$Vf=[1,20],$Vg=[1,21],$Vh=[1,22],$Vi=[1,23],$Vj=[1,24],$Vk=[1,25],$Vl=[1,26],$Vm=[1,27],$Vn=[5,6,7,8,9,10,11,12,13,14,16,18,22,35],$Vo=[5,6,7,8,9,10,11,12,13,14,15,16,18,22,29,35],$Vp=[5,6,7,8,16,18,22,35],$Vq=[5,6,7,8,9,10,11,16,18,22,35],$Vr=[16,35];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"expression":4,"EOF":5,"=":6,"+":7,"-":8,"*":9,"/":10,"//":11,"_":12,"^":13,"!":14,"(":15,")":16,"{":17,"}":18,"NUMBER":19,"SQRT":20,"[":21,"]":22,"LOG":23,"SIN":24,"COS":25,"TAN":26,"variable":27,"arguments":28,":":29,"E":30,"PI":31,"VARIABLE":32,"QUOTED_VARIABLE":33,"arguments2":34,",":35,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"=",7:"+",8:"-",9:"*",10:"/",11:"//",12:"_",13:"^",14:"!",15:"(",16:")",17:"{",18:"}",19:"NUMBER",20:"SQRT",21:"[",22:"]",23:"LOG",24:"SIN",25:"COS",26:"TAN",29:":",30:"E",31:"PI",32:"VARIABLE",33:"QUOTED_VARIABLE",35:","},
productions_: [0,[3,2],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,2],[4,2],[4,3],[4,3],[4,1],[4,4],[4,7],[4,4],[4,7],[4,4],[4,4],[4,4],[4,4],[4,3],[4,1],[4,1],[4,1],[27,1],[27,1],[28,0],[28,1],[34,1],[34,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */
var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1];
break;
case 2:
 this.$ = equals($$[$0-2], $$[$0]);
break;
case 3:
 this.$ = add($$[$0-2], $$[$0]);
break;
case 4:
 this.$ = subtract($$[$0-2], $$[$0]);
break;
case 5:
 this.$ = multiply($$[$0-2], $$[$0]);
break;
case 6:
 this.$ = divide($$[$0-2], $$[$0]);
break;
case 7:
 this.$ = fraction($$[$0-2], $$[$0]);
break;
case 8:
 this.$ = { functor: 'subscript', args: [$$[$0-2], $$[$0]] };
break;
case 9:
 this.$ = power($$[$0-2], $$[$0]);
break;
case 10:
 this.$ = { functor: 'factorial', args: [$$[$0-1]] };
break;
case 11: case 12:
 this.$ = minus($$[$0]);
break;
case 13:
 this.$ = $$[$0-1];
break;
case 14:
 this.$ = { type: 'braces', arg: [$$[$0-2]] };
break;
case 15:
 this.$ = make_numerical($$[$0]);
break;
case 16:
 this.$ = sqrt($$[$0-1]);
break;
case 17:
 this.$ = sqrt($$[$0-1], $$[$0-4]);
break;
case 18:
 this.$ = log($$[$0-1]);
break;
case 19:
 this.$ = log($$[$0-1], $$[$0-4]);
break;
case 20:
 this.$ = sin($$[$0-1]);
break;
case 21:
 this.$ = cos($$[$0-1]);
break;
case 22:
 this.$ = tan($$[$0-1]);
break;
case 23:
 this.$ = { functor: 'function', name: $$[$0-3], args: $$[$0-1] };
break;
case 24:
 var name1 = $$[$0-2];
             var symb1 = Symbols.greek[name1];
             var name2= $$[$0];
             var symb2 = Symbols.greek[name2];
             var name = name1 + ':' + name2;
             var subscript = {
                 symbol: name2,
                 unicode: name2,
                 latex: name2
             };
             if (symb2) {
                 subscript.greek = true;
                 subscript.latex = symb2.latex;
                 subscript.unicode = symb2.unicode;
             }
             if (symb1) {
               this.$ = handle(variable(name, {
                 greek: true,
                 latex: symb1.latex,
                 unicode: symb1.unicode,
                 subscript: subscript
               }));
             } else
                 this.$ = handle(variable(name, {
                     latex: name1,
                     unicode: name1,
                     subscript: subscript
                 }));
break;
case 25:
 var name = $$[$0];
             var symb = Symbols.greek[name];
             if (symb)
               this.$ = handle(variable(name, {
                 greek: true,
                 latex: symb.latex,
                 unicode: symb.unicode
               }));
             else
               this.$ = handle(variable(name));
break;
case 26:
 this.$ = constant('E');
break;
case 27:
 this.$ = constant('PI');
break;
case 28: case 31:
 this.$ = $$[$0];
break;
case 29:
 this.$ = $$[$0].slice(1, $$[$0].length-1);
break;
case 30: case 32:
 this.$ = [$$[$0]];
break;
case 33:
 this.$ = $$[$0-2].concat([$$[$0]]);
break;
}
},
table: [{3:1,4:2,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{1:[3]},{5:[1,18],6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm},{4:28,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:29,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:30,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:31,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},o($Vn,[2,15]),{15:[1,32],21:[1,33]},{15:[1,34],21:[1,35]},{15:[1,36]},{15:[1,37]},{15:[1,38]},o($Vn,[2,25],{15:[1,39],29:[1,40]}),o($Vn,[2,26]),o($Vn,[2,27]),o($Vo,[2,28]),o($Vo,[2,29]),{1:[2,1]},{4:41,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:42,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:43,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:44,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:45,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:46,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:47,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:48,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},o($Vn,[2,10]),o($Vn,[2,11]),o($Vn,[2,12]),{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,49]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,18:[1,50]},{4:51,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:52,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:53,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:54,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:55,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:56,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:57,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:60,7:$V0,8:$V1,15:$V2,16:[2,30],17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,28:58,30:$Va,31:$Vb,32:$Vc,33:$Vd,34:59},{27:61,32:$Vc,33:$Vd},o([5,16,18,22,35],[2,2],{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm}),o($Vp,[2,3],{9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm}),o($Vp,[2,4],{9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm}),o($Vq,[2,5],{12:$Vk,13:$Vl,14:$Vm}),o($Vq,[2,6],{12:$Vk,13:$Vl,14:$Vm}),o($Vq,[2,7],{12:$Vk,13:$Vl,14:$Vm}),o($Vq,[2,8],{12:$Vk,13:$Vl,14:$Vm}),o($Vq,[2,9],{12:$Vk,13:$Vl,14:$Vm}),o($Vn,[2,13]),o($Vn,[2,14]),{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,62]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,22:[1,63]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,64]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,22:[1,65]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,66]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,67]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,68]},{16:[1,69]},{16:[2,31],35:[1,70]},o($Vr,[2,32],{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm}),o($Vn,[2,24]),o($Vn,[2,16]),{15:[1,71]},o($Vn,[2,18]),{15:[1,72]},o($Vn,[2,20]),o($Vn,[2,21]),o($Vn,[2,22]),o($Vn,[2,23]),{4:73,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:74,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},{4:75,7:$V0,8:$V1,15:$V2,17:$V3,19:$V4,20:$V5,23:$V6,24:$V7,25:$V8,26:$V9,27:13,30:$Va,31:$Vb,32:$Vc,33:$Vd},o($Vr,[2,33],{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm}),{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,76]},{6:$Ve,7:$Vf,8:$Vg,9:$Vh,10:$Vi,11:$Vj,12:$Vk,13:$Vl,14:$Vm,16:[1,77]},o($Vn,[2,17]),o($Vn,[2,19])],
defaultActions: {18:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({
EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },
// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
    },
// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };
        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },
// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },
// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
        return this;
    },
// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },
// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },
// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },
// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;
        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },
// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }
        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },
// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },
// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },
// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },
// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },
// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },
// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 19
break;
case 2:return 31
break;
case 3:return 30
break;
case 4:return 'I'
break;
case 5:return 23
break;
case 6:return 20
break;
case 7:return 24
break;
case 8:return 25
break;
case 9:return 26
break;
case 10:return 32;
break;
case 11:return 33;
break;
case 12:return 6
break;
case 13:return 9
break;
case 14:return 11
break;
case 15:return 10
break;
case 16:return 29
break;
case 17:return 8
break;
case 18:return 7
break;
case 19:return 13
break;
case 20:return 14
break;
case 21:return 21
break;
case 22:return 22
break;
case 23:return 15
break;
case 24:return 16
break;
case 25:return 17
break;
case 26:return 18
break;
case 27:return 35
break;
case 28:return 12
break;
case 29:return 5
break;
case 30:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:([\-+]?\d+\.?\d*)([Ee][\-+]?\d+)?)/,/^(?:pi\b)/,/^(?:e\b)/,/^(?:I\b)/,/^(?:log\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:[A-Za-z]+)/,/^(?:'[A-Za-z ]+')/,/^(?:=)/,/^(?:\*)/,/^(?:\/\/)/,/^(?:\/)/,/^(?::)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:!)/,/^(?:\u005B)/,/^(?:\u005D)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?:\u005F)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
        return parser;
    })();
    if (is.in_nodejs())
        module.exports = Parser;
}).call(this);
