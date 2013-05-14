/*
Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
All rights reserved. 

Redistribution and use in source and binary forms, with or without modification, are 
permitted provided that the following conditions are met: 

   1. Redistributions of source code must retain the above copyright notice, this list of 
      conditions and the following disclaimer. 

   2. Redistributions in binary form must reproduce the above copyright notice, this list 
      of conditions and the following disclaimer in the documentation and/or other materials
	  provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF 
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR 
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
K={};
K.Utils={setOptions:function(b,c){b.options=K.Utils.extend({},b.options,c)},extend:function(b){var c=Array.prototype.slice.call(arguments,1),e=c.length,g,d,f;for(d=0;d<e;d++)for(g in f=c[d]||{},f)f.hasOwnProperty(g)&&(b[g]=f[g]);return b},isEmpty:function(b){for(var c in b)if(b.hasOwnProperty(c))return!1;return!0},isStyleUseful:function(b){var c,e={width:"","casing-width":"","fill-color":"","fill-image":"","icon-image":"",text:"",extrude:"","background-image":"","background-color":"","pattern-image":"","shield-text":"",
"symbol-shape":""};for(c in b)if(b.hasOwnProperty(c)&&e.hasOwnProperty(c))return!1;return!0}};K.Class=function(){};
K.Class.extend=function(b){var c=function(){this.initialize&&this.initialize.apply(this,arguments)},e=function(){};e.prototype=this.prototype;e=new e;e.constructor=c;c.prototype=e;c.superclass=this.prototype;for(var g in this)this.hasOwnProperty(g)&&g!="prototype"&&g!="superclass"&&(c[g]=this[g]);b.statics&&(K.Utils.extend(c,b.statics),delete b.statics);b.includes&&(K.Utils.extend.apply(null,[e].concat(b.includes)),delete b.includes);if(b.options&&e.options)b.options=K.Utils.extend({},e.options,b.options);
K.Utils.extend(e,b);c.extend=arguments.callee;c.include=function(b){K.Utils.extend(this.prototype,b)};return c};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic=K.Class.extend({options:{buffered:!1,useCanvasProxy:!1,styles:[],locales:[]},initialize:function(b){K.Utils.setOptions(this,b);MapCSS.locales=this.options.locales},render:function(b,c,e,g){var d=new Kothic.Canvas(b,{buffererd:this.options.buffered,useCanvasProxy:this.options.useCanvasProxy}),f=d.width,h=d.height,i=c.granularity,l=f/i,j=h/i,m=d.ctx,n=this.options.styles,r=new Kothic.CollisionBuffer(h,f),o=new Kothic.Debug,q=Kothic.style.populateLayers(c.features,e,n),k=Kothic.utils.getOrderedKeys(q);
o.addEvent("style ("+MapCSS.debug.hit+"/"+MapCSS.debug.miss+")");MapCSS.debug.miss=0;MapCSS.debug.hit=0;Kothic.style.setStyles(m,Kothic.style.defaultCanvasStyles);var t=this,s=function(){var b=t._renderTextAndIcons(k,q,m,l,j,r);o.addEvent("labels");o.setStats(b);d.completeRendering();g(o)};setTimeout(function(){t._renderBackground(m,f,h,e,n);var b=t._renderGeometryFeatures(k,q,m,l,j,i);o.addEvent("geometry");o.setStats(b);setTimeout(s,0)},0)},_renderBackground:function(b,c,e,g,d){var g=MapCSS.restyle(d,
{},{},g,"canvas","canvas"),d=Kothic.utils.getOrderedKeys(g),f,h=function(){b.fillRect(-1,-1,c+1,e+1)};for(f=0;f<d.length;f++)Kothic.polygon.fill(b,g[d[f]],h)},_renderGeometryFeatures:function(b,c,e,g,d,f){var h=0,i=0,l=0,j,m;for(m=0;m<b.length;m++){var n=c[b[m]],r=n.length;for(j=0;j<r;j++){var o=n[j].style;if(o["fill-position"]=="background"&&(o.hasOwnProperty("fill-color")||o.hasOwnProperty("fill-image")))Kothic.polygon.render(e,n[j],n[j+1],g,d,f),h+=1}}for(m=0;m<b.length;m++){n=c[b[m]];r=n.length;
for(j=0;j<r;j++)if(o=n[j].style,o["fill-position"]!="background"&&(o.hasOwnProperty("fill-color")||o.hasOwnProperty("fill-image")))Kothic.polygon.render(e,n[j],n[j+1],g,d,f),h+=1;e.lineCap="butt";for(j=0;j<r;j++)n[j].style.hasOwnProperty("casing-width")&&(Kothic.line.renderCasing(e,n[j],n[j+1],g,d,f),l+=1);e.lineCap="round";for(j=0;j<r;j++)n[j].style.width&&(Kothic.line.render(e,n[j],n[j+1],g,d,f),i+=1)}return{"polygons ":h,"lines ":i,"casings ":l}},_renderTextAndIcons:function(b,c,e,g,d,f){var h=
e.strokeText&&e.fillText&&e.measureText,i=0,l=0,j=0,m,n,r;for(r=0;r<b.length;r++){var o=c[b[r]],q=o.length;for(m=q-1;m>=0;m--)n=o[m].style,n.hasOwnProperty("icon-image")&&!n.text&&(Kothic.texticons.render(e,o[m],f,g,d,!1,!0),i+=1);for(m=q-1;h&&m>=0;m--)n=o[m].style,!n.hasOwnProperty("icon-image")&&n.text&&(Kothic.texticons.render(e,o[m],f,g,d,!0,!1),l+=1);for(m=q-1;m>=0;m--)n=o[m].style,n.hasOwnProperty("icon-image")&&n.text&&(Kothic.texticons.render(e,o[m],f,g,d,h,!0),i+=1,l+=1);for(m=q-1;h&&m>=
0;m--)n=o[m].style,n["shield-text"]&&(Kothic.shields.render(e,o[m],f,g,d),j+=1)}return{"icons ":i,"labels ":l,"shields ":j}}});/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.Canvas=K.Class.extend({options:{buffered:!1,useCanvasProxy:!1},initialize:function(b,c){K.Utils.setOptions(this,c);this.canvas=typeof b==="string"?document.getElementById(b):b;var e=window.devicePixelRatio||1;this.width=this.canvas.width;this.height=this.canvas.height;if(e!=1)b.style.width=this.canvas.width+"px",b.style.height=this.canvas.height+"px",b.width=this.canvas.width*e,b.height=this.canvas.height*e;this.options.buffered?(this.buffer=Kothic.Canvas.buffers.length>0?Kothic.Canvas.buffers.pop():
document.createElement("canvas"),this.buffer.width=this.canvas.width,this.buffer.height=this.canvas.height,this.ctx=this.buffer.getContext("2d")):this.ctx=this.canvas.getContext("2d");this.ctx.scale(e,e);if(c.useCanvasProxy)this.ctx=new CanvasProxy(this.ctx)},completeRendering:function(){this.options.buffered&&(this.canvas.getContext("2d").drawImage(this.buffer,0,0),Kothic.Canvas.buffers.push(this.buffer))}});Kothic.Canvas.buffers=[];/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
CanvasProxy=function(b){var c={strokeStyle:"rgba(0,0,0,0.5)",fillStyle:"rgba(0,0,0,0.5)",lineWidth:1,globalAlpha:1,lineCap:"round",lineJoin:"round",textAlign:"center",textBaseline:"middle"};_textMeasureCache={};for(var e in this._curProps)c.hasOwnProperty(e)&&(this[e]=c[e],b[e]=c[e]);this.antialiasing="default";this._checkStroke=function(){var e=["globalAlpha","strokeStyle","lineWidth","lineCap","lineJoin"],d;for(d in e)d=e[d],this[d]!=c[d]&&this[d]&&(b[d]=this[d],c[d]=this[d])};this._checkFill=function(){var e=
["globalAlpha","fillStyle"],d;for(d in e)d=e[d],this[d]!=c[d]&&this[d]&&(b[d]=this[d],c[d]=this[d])};this._checkText=function(){var e=["font","textAlign","textBaseline"],d;for(d in e)d=e[d],this[d]!=c[d]&&this[d]&&(b[d]=this[d],c[d]=this[d])};this._resetAfterRestore=function(){var c=["fillStyle","strokeStyle","lineCap","textAlign","textBaseline","globalAlpha"],d;for(d in c)d=c[d],this[d]&&(b[d]=this[d])};this.fillRect=function(c,d,f,e){this._checkFill();b.fillRect(c,d,f,e)};this.drawImage=function(c,
d,f){b.drawImage(c,d,f)};this.lineTo=function(c,d){b.lineTo(c,d)};this.moveTo=function(c,d){b.moveTo(c,d)};this.translate=function(c,d){b.translate(c,d)};this.createPattern=function(c,d){b.createPattern(c,d)};this.rotate=function(c){b.rotate(c)};this.save=function(){b.save()};this.restore=function(){b.restore();this._resetAfterRestore()};this.beginPath=function(){b.beginPath()};this.stroke=function(){this._checkStroke();b.stroke()};this.fill=function(){this._checkFill();b.fill()};this.fillText=function(c,
d,f){this._checkFill();this._checkText();b.fillText(c,d,f)};this.strokeText=function(c,d,f){this._checkStroke();this._checkText();b.strokeText(c,d,f)};this.measureText=function(c){this._checkText();var d=this.font;_textMeasureCache[d]||(_textMeasureCache[d]={});_textMeasureCache[d][c]||(_textMeasureCache[d][c]=b.measureText(c));return _textMeasureCache[d][c]}};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.path=function(){function b(b,c){g={pattern:c,seg:0,phs:0,x:b[0],y:b[1]}}function c(b,c){var e=g,i=c[0]-e.x,l=c[1]-e.y,j=Math.sqrt(i*i+l*l),m;b.save();b.translate(e.x,e.y);b.rotate(Math.atan2(l,i));b.moveTo(0,0);i=0;do{m=e.pattern[e.seg];i+=m-e.phs;l=i<j;if(!l)e.phs=m-(i-j),i=j;b[e.seg%2?"moveTo":"lineTo"](i,0);if(l)e.phs=0,e.seg=++e.seg%e.pattern.length}while(l);e.x=c[0];e.y=c[1];b.restore()}function e(b,c){return b[0]===0||b[0]===c||b[1]===0||b[1]===c}var g;return function(d,f,h,g,l,j,m){var n=
f.type,f=f.coordinates;n==="Polygon"&&(f=[f],n="MultiPolygon");n==="LineString"&&(f=[f],n="MultiLineString");var r,o,q,k,t=f.length,s,p,u,v,w;if(n==="MultiPolygon")for(r=0;r<t;r++){q=0;for(s=f[r].length;q<s;q++){k=f[r][q];p=k.length;u=k[0];for(o=0;o<=p;o++)v=k[o]||k[0],w=Kothic.utils.transformPoint(v,l,j),o===0||!g&&e(v,m)&&e(u,m)?(u=h,d.moveTo(w[0],w[1]),u&&b(w,u)):g||!h?d.lineTo(w[0],w[1]):c(d,w),u=v}}if(n==="MultiLineString")for(r=0;r<t;r++){k=f[r];p=k.length;for(o=0;o<p;o++){v=k[o];w=Kothic.utils.transformPoint(v,
l,j);if((o===0||o===p-1)&&e(v,m))u=k[o?p-2:1],g=v[0]-u[0],n=v[1]-u[1],v=Math.sqrt(g*g+n*n),w=[w[0]+50*g/v,w[1]+50*n/v];o===0?(g=w,n=h,d.moveTo(g[0],g[1]),n&&b(g,n)):h?c(d,w):d.lineTo(w[0],w[1])}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.line=function(){return{pathOpened:!1,renderCasing:function(b,c,e,g,d,f){var h=c.style,i=e&&e.style,l=h["casing-dashes"]||h.dashes||!1;if(!this.pathOpened)this.pathOpened=!0,b.beginPath();Kothic.path(b,c,l,!1,g,d,f);if(!e||!(i.width===h.width&&i["casing-width"]===h["casing-width"]&&i["casing-color"]===h["casing-color"]&&(i["casing-dashes"]||i.dashes||!1)===(h["casing-dashes"]||h.dashes||!1)&&(i["casing-linecap"]||i.linecap||"butt")===(h["casing-linecap"]||h.linecap||"butt")&&(i["casing-linejoin"]||
i.linejoin||"round")===(h["casing-linejoin"]||h.linejoin||"round")&&(i["casing-opacity"]||i.opacity)===(h.opacity||h["casing-opacity"])))Kothic.style.setStyles(b,{lineWidth:2*h["casing-width"]+(h.hasOwnProperty("width")?h.width:0),strokeStyle:h["casing-color"]||"#000000",lineCap:h["casing-linecap"]||h.linecap||"butt",lineJoin:h["casing-linejoin"]||h.linejoin||"round",globalAlpha:h["casing-opacity"]||1}),this.pathOpened=!1,b.stroke()},render:function(b,c,e,g,d,f){var h=c.style,i=e&&e.style,l=h.dashes;
if(!this.pathOpened)this.pathOpened=!0,b.beginPath();Kothic.path(b,c,l,!1,g,d,f);if(!e||!((i.width||1)===(h.width||1)&&(i.color||"#000000")===(h.color||"#000000")&&i.linecap===h.linecap&&i.linejoin===h.linejoin&&i.image===h.image&&i.opacity===h.opacity)){if(h.hasOwnProperty("color")||!h.hasOwnProperty("image"))c=h.width||1,g=e="round",c<=2&&(e="miter",g="butt"),Kothic.style.setStyles(b,{lineWidth:c,strokeStyle:h.color||"#000000",lineCap:h.linecap||g,lineJoin:h.linejoin||e,globalAlpha:h.opacity||1,
miterLimit:4}),b.stroke();if(h.hasOwnProperty("image")&&(c=MapCSS.getImage(h.image)))Kothic.style.setStyles(b,{strokeStyle:b.createPattern(c,"repeat")||"#000000",lineWidth:h.width||1,lineCap:h.linecap||"round",lineJoin:h.linejoin||"round",globalAlpha:h.opacity||1}),b.stroke();this.pathOpened=!1}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.polygon=function(){return{pathOpened:!1,render:function(b,c,e,g,d,f){var h=c.style,i=e&&e.style;if(!this.pathOpened)this.pathOpened=!0,b.beginPath();Kothic.path(b,c,!1,!0,g,d,f);if(!e||!(i["fill-color"]===h["fill-color"]&&i["fill-image"]===h["fill-image"]&&i["fill-opacity"]===h["fill-opacity"]))this.fill(b,h,function(){b.fill()}),this.pathOpened=!1},fill:function(b,c,e){var g=c["fill-opacity"]||c.opacity;c.hasOwnProperty("fill-color")&&(Kothic.style.setStyles(b,{fillStyle:c["fill-color"]||
"#000000",globalAlpha:g||1}),e());if(c.hasOwnProperty("fill-image")&&(c=MapCSS.getImage(c["fill-image"])))Kothic.style.setStyles(b,{fillStyle:b.createPattern(c,"repeat"),globalAlpha:g||1}),e()}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.shields=function(){return{render:function(b,c,e,g,d){var f=c.style,h=Kothic.utils.getReprPoint(c),i,l,j=0,m=!1,n,r;if(h){i=Kothic.utils.transformPoint(h,g,d);if(f["shield-image"]&&(l=MapCSS.getImage(f["icon-image"]),!l))return;Kothic.style.setStyles(b,{font:Kothic.style.getFontString(f["shield-font-family"]||f["font-family"],f["shield-font-size"]||f["font-size"]),fillStyle:f["shield-text-color"]||"#000000",globalAlpha:f["shield-text-opacity"]||f.opacity||1,textAlign:"center",textBaseline:"middle"});
var o=String(f["shield-text"]),h=b.measureText(o).width,q=h+2,k=h/o.length*1.8;if(c.type==="LineString"){j=Kothic.geomops.getPolyLength(c.coordinates);if(Math.max(k/d,q/g)>j)return;n=0;for(r=1;n<j/2;n+=Math.max(j/30,k/g),r*=-1){h=Kothic.geomops.getAngleAndCoordsAtLength(c.coordinates,j/2+r*n,0);if(!h)break;h=[h[1],h[2]];i=Kothic.utils.transformPoint(h,g,d);if((!l||!(f["allow-overlap"]!=="true"&&e.checkPointWH(i,l.width,l.height,c.kothicId)))&&!(f["allow-overlap"]!=="true"&&e.checkPointWH(i,q,k,c.kothicId))){m=
!0;break}}}m&&(f["shield-casing-width"]&&(Kothic.style.setStyles(b,{fillStyle:f["shield-casing-color"]||"#000000",globalAlpha:f["shield-casing-opacity"]||f.opacity||1}),b.fillRect(i[0]-q/2-(f["shield-casing-width"]||0)-(f["shield-frame-width"]||0),i[1]-k/2-(f["shield-casing-width"]||0)-(f["shield-frame-width"]||0),q+2*(f["shield-casing-width"]||0)+2*(f["shield-frame-width"]||0),k+2*(f["shield-casing-width"]||0)+2*(f["shield-frame-width"]||0))),f["shield-frame-width"]&&(Kothic.style.setStyles(b,{fillStyle:f["shield-frame-color"]||
"#000000",globalAlpha:f["shield-frame-opacity"]||f.opacity||1}),b.fillRect(i[0]-q/2-(f["shield-frame-width"]||0),i[1]-k/2-(f["shield-frame-width"]||0),q+2*(f["shield-frame-width"]||0),k+2*(f["shield-frame-width"]||0))),f["shield-color"]&&(Kothic.style.setStyles(b,{fillStyle:f["shield-color"]||"#000000",globalAlpha:f["shield-opacity"]||f.opacity||1}),b.fillRect(i[0]-q/2,i[1]-k/2,q,k)),l&&b.drawImage(l,Math.floor(i[0]-l.width/2),Math.floor(i[1]-l.height/2)),Kothic.style.setStyles(b,{fillStyle:f["shield-text-color"]||
"#000000",globalAlpha:f["shield-text-opacity"]||f.opacity||1}),b.fillText(o,i[0],Math.ceil(i[1])),l&&e.addPointWH(i,l.width,l.height,0,c.kothicId),e.addPointWH(i,k,q,(parseFloat(f["shield-casing-width"])||0)+(parseFloat(f["shield-frame-width"])||0)+(parseFloat(f["-x-mapnik-min-distance"])||30),c.kothicId))}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.textOnPath=function(){function b(b,c){return b.measureText(c).width}function c(b,c){return[b[1]+0.5*Math.cos(b[0])*c,b[2]+0.5*Math.sin(b[0])*c]}function e(e,d,g,l){var l=l||0,j=b(e,d),d=b(e,d.charAt(0))*1.5,m=g[0],e=Math.abs(Math.cos(m)*j)+Math.abs(Math.sin(m)*d),d=Math.abs(Math.sin(m)*j)+Math.abs(Math.cos(m)*d);return[c(g,j+2*l),e,d,0]}function g(c,d,g,l){var j,m=0;for(j=0;j<=g.length;j++){if(c.checkPointWH.apply(c,e(d,g.charAt(j),l,m)))return!0;m+=b(d,g.charAt(j))}return!1}function d(e,d,
g){var l=d[4],j=c(d,b(e,l));e.translate(j[0],j[1]);e.rotate(d[0]);e[g?"strokeText":"fillText"](l,0,0);e.rotate(-d[0]);e.translate(-j[0],-j[1])}return function(c,h,i,l,j){var m=c.measureText(i).width,n=i.length,r=Kothic.geomops.getPolyLength(h);if(!(r<m)){for(var o,q,k,t,s=0,p,u=!1,v,w,x,y=Math.PI/6;s<2;){q=s?b(c,i.charAt(0)):(r-m)/2;p=0;k=null;t=[];for(x=0;x<n;x++){o=i.charAt(x);w=b(c,o);v=Kothic.geomops.getAngleAndCoordsAtLength(h,q,w);if(q>=r||!v){s++;t=[];u&&(h.reverse(),u=!1);break}k||(k=v[0]);
if(g(j,c,o,v)||Math.abs(k-v[0])>y)q+=w,x=-1,t=[],p=0;else{for(;w<v[3]&&x<n;){x++;o+=i.charAt(x);w=b(c,o);if(g(j,c,o,v)){x=0;q+=w;t=[];p=0;o=i.charAt(x);w=b(c,o);v=Kothic.geomops.getAngleAndCoordsAtLength(h,q,w);break}if(w>=v[3]){x--;o=o.slice(0,-1);w=b(c,o);break}}if(v){if(v[0]>Math.PI/2||v[0]<-Math.PI/2)p+=o.length;k=v[0];v.push(o);t.push(v);q+=w}}}p>n/2&&(h.reverse(),t=[],u?(s++,h.reverse(),u=!1):u=!0);if(s>=2)return;if(t.length>0)break}h=t.length;for(x=0;l&&x<h;x++)d(c,t[x],!0);for(x=0;x<h;x++){v=
t[x];d(c,v);l=j;i=c;m=v[4];n=void 0;for(n=r=0;n<=m.length;n++)l.addPointWH.apply(l,e(i,m.charAt(n),v,r)),r+=b(i,m.charAt(n))}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.texticons=function(){return{render:function(b,c,e,g,d,f,h){var i=c.style,l,j;if(h||f&&c.type!=="LineString"){j=Kothic.utils.getReprPoint(c);if(!j)return;j=Kothic.utils.transformPoint(j,g,d)}if(h){l=MapCSS.getImage(i["icon-image"]);if(!l)return;if(i["allow-overlap"]!=="true"&&e.checkPointWH(j,l.width,l.height,c.kothicId))return}if(f){Kothic.style.setStyles(b,{lineWidth:i["text-halo-radius"]*2,font:Kothic.style.getFontString(i["font-family"],i["font-size"])});var f=String(i.text),m=b.measureText(f).width,
n=m/f.length*2.5,r=i["text-offset"]||0,o=i.hasOwnProperty("text-halo-radius");Kothic.style.setStyles(b,{fillStyle:i["text-color"]||"#000000",strokeStyle:i["text-halo-color"]||"#ffffff",globalAlpha:i["text-opacity"]||i.opacity||1,textAlign:"center",textBaseline:"middle"});if(c.type==="Polygon"||c.type==="Point"){if(i["text-allow-overlap"]!=="true"&&e.checkPointWH([j[0],j[1]+r],m,n,c.kothicId))return;o&&b.strokeText(f,j[0],j[1]+r);b.fillText(f,j[0],j[1]+r);e.addPointWH([j[0],j[1]+r],m,n,i["-x-mapnik-min-distance"]||
20,c.kothicId)}else c.type==="LineString"&&(g=Kothic.utils.transformPoints(c.coordinates,g,d),Kothic.textOnPath(b,g,f,o,e))}h&&(b.drawImage(l,Math.floor(j[0]-l.width/2),Math.floor(j[1]-l.height/2)),b=parseFloat(i["-x-mapnik-min-distance"])||0,e.addPointWH(j,l.width,l.height,b,c.kothicId))}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
var MapCSS={styles:{},availableStyles:[],images:{},locales:[],presence_tags:[],value_tags:[],cache:{},debug:{hit:0,miss:0},onError:function(){},onImagesLoad:function(){},invalidateCache:function(){this.cache={}},e_min:function(){return Math.min.apply(null,arguments)},e_max:function(){return Math.max.apply(null,arguments)},e_any:function(){var b;for(b=0;b<arguments.length;b++)if(typeof arguments[b]!=="undefined"&&arguments[b]!=="")return arguments[b];return""},e_num:function(b){return isNaN(parseFloat(b))?
"":parseFloat(b)},e_str:function(b){return b},e_int:function(b){return parseInt(b,10)},e_tag:function(b,c){return b.hasOwnProperty(c)&&b[c]!==null?a[c]:""},e_prop:function(b,c){return b.hasOwnProperty(c)&&b[c]!==null?b[c]:""},e_sqrt:function(b){return Math.sqrt(b)},e_boolean:function(b,c,e){typeof c==="undefined"&&(c="true");typeof e==="undefined"&&(e="false");return b==="0"||b==="false"||b===""?e:c},e_metric:function(b){return/\d\s*mm$/.test(b)?1E3*parseInt(b,10):/\d\s*cm$/.test(b)?100*parseInt(b,
10):/\d\s*dm$/.test(b)?10*parseInt(b,10):/\d\s*km$/.test(b)?0.001*parseInt(b,10):/\d\s*in$/.test(b)?0.0254*parseInt(b,10):/\d\s*ft$/.test(b)?0.3048*parseInt(b,10):parseInt(b,10)},e_zmetric:function(b){return MapCSS.e_metric(b)},e_localize:function(b,c){var e=MapCSS.locales,g,d;for(g=0;g<e.length;g++)if(d=c+":"+e[g],b[d])return b[d];return b[c]},loadStyle:function(b,c,e,g,d,f){var h,e=e||[],g=g||[];if(d)for(h=0;h<d.length;h++)this.presence_tags.indexOf(d[h])<0&&this.presence_tags.push(d[h]);if(f)for(h=
0;h<f.length;h++)this.value_tags.indexOf(f[h])<0&&this.value_tags.push(f[h]);MapCSS.styles[b]={restyle:c,images:e,external_images:g,textures:{},sprite_loaded:!e,external_images_loaded:!g.length};MapCSS.availableStyles.push(b)},_onImagesLoad:function(b){if(MapCSS.styles[b].external_images_loaded&&MapCSS.styles[b].sprite_loaded)MapCSS.onImagesLoad()},preloadSpriteImage:function(b,c){var e=MapCSS.styles[b].images,g=new Image;delete MapCSS.styles[b].images;g.onload=function(){for(var c in e)if(e.hasOwnProperty(c))e[c].sprite=
g,MapCSS.images[c]=e[c];MapCSS.styles[b].sprite_loaded=!0;MapCSS._onImagesLoad(b)};g.onerror=function(b){MapCSS.onError(b)};g.src=c},preloadExternalImages:function(b,c){function e(c){var e=new Image;e.onload=function(){f++;MapCSS.images[c]={sprite:e,height:e.height,width:e.width,offset:0};if(f===d)MapCSS.styles[b].external_images_loaded=!0,MapCSS._onImagesLoad(b)};e.onerror=function(){f++;if(f===d)MapCSS.styles[b].external_images_loaded=!0,MapCSS._onImagesLoad(b)};e.src=c}var g=MapCSS.styles[b].external_images;
delete MapCSS.styles[b].external_images;var c=c||"",d=g.length,f=0,h;for(h=0;h<d;h++)e(c+g[h])},getImage:function(b){var c=MapCSS.images[b];if(c&&c.sprite){var e=document.createElement("canvas");e.width=c.width;e.height=c.height;e.getContext("2d").drawImage(c.sprite,0,c.offset,c.width,c.height,0,0,c.width,c.height);c=MapCSS.images[b]=e}return c},getTagKeys:function(b,c,e,g){var d=[],f;for(f=0;f<this.presence_tags.length;f++)b.hasOwnProperty(this.presence_tags[f])&&d.push(this.presence_tags[f]);for(f=
0;f<this.value_tags.length;f++)b.hasOwnProperty(this.value_tags[f])&&d.push(this.value_tags[f]+":"+b[this.value_tags[f]]);return[c,e,g,d.join(":")].join(":")},restyle:function(b,c,e,g,d){var f,h=this.getTagKeys(c,e,g,d),i=this.cache[h]||{};if(this.cache.hasOwnProperty(h))this.debug.hit+=1;else{this.debug.miss+=1;for(f=0;f<b.length;f++)i=MapCSS.styles[b[f]].restyle(i,c,e,g,d);this.cache[h]=i}return i}};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.style=function(){return{defaultCanvasStyles:{strokeStyle:"rgba(0,0,0,0.5)",fillStyle:"rgba(0,0,0,0.5)",lineWidth:1,lineCap:"round",lineJoin:"round",textAlign:"center",textBaseline:"middle"},populateLayers:function(b,c,e){for(var g={},e=Kothic.style.styleFeatures(b,c,e),b=0,c=e.length;b<c;b++){var d=e[b],f=parseFloat(d.properties.layer)||0,h=d.style["-x-mapnik-layer"];h==="top"&&(f=1E4);h==="bottom"&&(f=-1E4);g.hasOwnProperty(f)||(g[f]=[]);g[f].push(d)}return g},getStyle:function(b,c,e){var g,
d;if(b.type==="Polygon"||b.type==="MultiPolygon")g="way",d="area";else if(b.type==="LineString"||b.type==="MultiLineString")g="way",d="line";else if(b.type==="Point"||b.type==="MultiPoint")d=g="node";return MapCSS.restyle(e,b.properties,c,g,d)},styleFeatures:function(b,c,e){var g=[],d,f,h,i,l,j;d=0;for(h=b.length;d<h;d++)for(f in i=b[d],l=this.getStyle(i,c,e),l)if(l.hasOwnProperty(f))j=Kothic.utils.extend({},i),j.kothicId=d+1,j.style=l[f],g.push(j);g.sort(function(b,c){return parseFloat(b.style["z-index"])-
parseFloat(c.style["z-index"]||0)});return g},getFontString:function(b,c){var b=b||"",c=c||9,e=b?b+", ":"",b=b.toLowerCase(),g=[];(b.indexOf("italic")!==-1||b.indexOf("oblique")!==-1)&&g.push("italic");b.indexOf("bold")!==-1&&(g.push("bold"),e+=b.replace("bold","")+", ");g.push(c+"px");e+=b.indexOf("serif")!==-1?"Georgia, serif":'"Helvetica Neue", Arial, Helvetica, sans-serif';g.push(e);return g.join(" ")},setStyles:function(b,c){for(var e in c)c.hasOwnProperty(e)&&(b[e]=c[e])}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
(function(b){b.CollisionBuffer=function(b,e){this.buffer=new RTree;this.height=b;this.width=e};b.CollisionBuffer.prototype={addBox:function(b){this.buffer.insert(new RTree.Rectangle(b[0],b[1],b[2],b[3]),b[4])},addPointWH:function(b,e,g,d,f){this.buffer.insert(this.getBoxFromPoint(b,e,g,d),f)},checkBox:function(b,e){if(this.height&&!(b.x1>=0&&b.y1>=0&&b.y2<=this.height&&b.x2<=this.width))return!0;var g=[];this.buffer.search(b,!0,g);var d,f,h;d=0;for(f=g.length;d<f;d++)if(h=g[d],e!==h.leaf)return!0;
return!1},checkPointWH:function(b,e,g,d){return this.checkBox(this.getBoxFromPoint(b,e,g,0),d)},getBoxFromPoint:function(b,e,g,d){return new RTree.Rectangle(b[0]-e/2-d,b[1]-g/2-d,e+2*d,g+2*d)}}})(Kothic);/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.geomops=function(){return{getPolyLength:function(b){var c=b.length,e,g,d,f,h=0;for(d=1;d<c;d++)e=b[d],g=b[d-1],f=g[0]-e[0],e=g[1]-e[1],h+=Math.sqrt(f*f+e*e);return h},getAngleAndCoordsAtLength:function(b,c,e){var g=b.length,d,f,h,i,l,j,m,n=0;j=0;var r,o=!0;r=!1;e=e||0;for(l=1;l<g;l++){r&&(o=!1);j=b[l];m=b[l-1];d=j[0]-m[0];f=j[1]-m[1];j=Math.sqrt(d*d+f*f);!r&&n+j>=c&&(r=c-n,h=m[0]+d*r/j,i=m[1]+f*r/j,r=!0);if(r&&n+j>=c+e)return r=c+e-n,d=m[0]+d*r/j,f=m[1]+f*r/j,b=Math.atan2(f-i,d-h),o?[b,h,i,
j-r]:[b,h,i,0];n+=j}}}}();/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.utils={transformPoint:function(b,c,e){return[c*b[0],e*b[1]]},transformPoints:function(b,c,e){var g=[],d;d=0;for(len=b.length;d<len;d++)g.push(this.transformPoint(b[d],c,e));return g},getReprPoint:function(b){var c;switch(b.type){case "Point":c=b.coordinates;break;case "Polygon":c=b.reprpoint;break;case "LineString":c=Kothic.geomops.getPolyLength(b.coordinates);c=Kothic.geomops.getAngleAndCoordsAtLength(b.coordinates,c/2,0);c=[c[1],c[2]];break;case "GeometryCollection":return;case "MultiPoint":return;
case "MultiPolygon":c=b.reprpoint;break;case "MultiLineString":return}return c},getOrderedKeys:function(b){var c=[],e;for(e in b)b.hasOwnProperty(e)&&c.push(e);c.sort();return c},extend:function(b,c){for(var e in c)c.hasOwnProperty(e)&&(b[e]=c[e]);return b},remove_from_array:function(b,c){var e=b.indexOf(c);e>=0&&b.splice(e,1)}};/*
 Copyright (c) 2009 Jon-Carlos Rivera

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Jon-Carlos Rivera - imbcmdth@hotmail.com
*/
var RTree=function(b){var c=3,e=6;isNaN(b)||(c=Math.floor(b/2),e=b);var g={x:0,y:0,w:0,h:0,id:"root",nodes:[]},d=function(){var b={};return function(c){var e=0;c in b?e=b[c]++:b[c]=0;return c+"_"+e}}();RTree.Rectangle.squarified_ratio=function(b,c,e){var d=(b+c)/2;b*=c;return b*e/(b/(d*d))};var f=function(b,e,d){var f=[],g=[],o=[],q=1;if(!b||!RTree.Rectangle.overlap_rectangle(b,d))return o;b={x:b.x,y:b.y,w:b.w,h:b.h,target:e};g.push(d.nodes.length);f.push(d);do{d=f.pop();e=g.pop()-1;if("target"in
b)for(;e>=0;){var k=d.nodes[e];if(RTree.Rectangle.overlap_rectangle(b,k))if(b.target&&"leaf"in k&&k.leaf===b.target||!b.target&&("leaf"in k||RTree.Rectangle.contains_rectangle(k,b))){"nodes"in k?(o=h(k,!0,[],k),d.nodes.splice(e,1)):o=d.nodes.splice(e,1);RTree.Rectangle.make_MBR(d.nodes,d);delete b.target;if(d.nodes.length<c)b.nodes=h(d,!0,[],d);break}else if("nodes"in k)q+=1,g.push(e),f.push(d),d=k,e=k.nodes.length;e-=1}else if("nodes"in b){d.nodes.splice(e+1,1);d.nodes.length>0&&RTree.Rectangle.make_MBR(d.nodes,
d);for(e=0;e<b.nodes.length;e++)i(b.nodes[e],d);b.nodes.length=0;f.length==0&&d.nodes.length<=1?(b.nodes=h(d,!0,b.nodes,d),d.nodes.length=0,f.push(d),g.push(1)):f.length>0&&d.nodes.length<c?(b.nodes=h(d,!0,b.nodes,d),d.nodes.length=0):delete b.nodes}else RTree.Rectangle.make_MBR(d.nodes,d);q-=1}while(f.length>0);return o},h=function(b,c,e,d){var f=[];if(!RTree.Rectangle.overlap_rectangle(b,d))return e;f.push(d.nodes);do for(var d=f.pop(),g=d.length-1;g>=0;g--){var h=d[g];RTree.Rectangle.overlap_rectangle(b,
h)&&("nodes"in h?f.push(h.nodes):"leaf"in h&&(c?e.push(h):e.push(h.leaf)))}while(f.length>0);return e},i=function(b,d){var f;if(d.nodes.length==0)d.x=b.x,d.y=b.y,d.w=b.w,d.h=b.h,d.nodes.push(b);else{var g=-1,h=[],i;h.push(d);var q=d.nodes;do{if(g!=-1)h.push(q[g]),q=q[g].nodes,g=-1;for(var k=q.length-1;k>=0;k--){var t=q[k];if("leaf"in t){g=-1;break}var s=RTree.Rectangle.squarified_ratio(t.w,t.h,t.nodes.length+1),t=RTree.Rectangle.squarified_ratio(Math.max(t.x+t.w,b.x+b.w)-Math.min(t.x,b.x),Math.max(t.y+
t.h,b.y+b.h)-Math.min(t.y,b.y),t.nodes.length+2);if(g<0||Math.abs(t-s)<i)i=Math.abs(t-s),g=k}}while(g!=-1);g=b;do{if(f&&"nodes"in f&&f.nodes.length==0){i=f;f=h.pop();for(q=0;q<f.nodes.length;q++)if(f.nodes[q]===i||f.nodes[q].nodes.length==0){f.nodes.splice(q,1);break}}else f=h.pop();if("leaf"in g||"nodes"in g||Object.prototype.toString.call(g)==="[object Array]"){if(Object.prototype.toString.call(g)==="[object Array]"){for(i=0;i<g.length;i++)RTree.Rectangle.expand_rectangle(f,g[i]);f.nodes=f.nodes.concat(g)}else RTree.Rectangle.expand_rectangle(f,
g),f.nodes.push(g);if(f.nodes.length<=e)g={x:f.x,y:f.y,w:f.w,h:f.h};else{i=g=f.nodes;for(var q=i.length-1,k=0,s=i.length-1,t=0,p=void 0,u=void 0,p=i.length-2;p>=0;p--)u=i[p],u.x>i[k].x?k=p:u.x+u.w<i[q].x+i[q].w&&(q=p),u.y>i[t].y?t=p:u.y+u.h<i[s].y+i[s].h&&(s=p);Math.abs(i[q].x+i[q].w-i[k].x)>Math.abs(i[s].y+i[s].h-i[t].y)?q>k?(p=i.splice(q,1)[0],u=i.splice(k,1)[0]):(u=i.splice(k,1)[0],p=i.splice(q,1)[0]):s>t?(p=i.splice(s,1)[0],u=i.splice(t,1)[0]):(u=i.splice(t,1)[0],p=i.splice(s,1)[0]);for(i=[{x:p.x,
y:p.y,w:p.w,h:p.h,nodes:[p]},{x:u.x,y:u.y,w:u.w,h:u.h,nodes:[u]}];g.length>0;){for(var q=g,k=i[0],s=i[1],p=RTree.Rectangle.squarified_ratio(k.w,k.h,k.nodes.length+1),u=RTree.Rectangle.squarified_ratio(s.w,s.h,s.nodes.length+1),v=void 0,w=void 0,t=void 0,x=q.length-1;x>=0;x--){var y=q[x],z={};z.x=Math.min(k.x,y.x);z.y=Math.min(k.y,y.y);z.w=Math.max(k.x+k.w,y.x+y.w)-z.x;z.h=Math.max(k.y+k.h,y.y+y.h)-z.y;var z=Math.abs(RTree.Rectangle.squarified_ratio(z.w,z.h,k.nodes.length+2)-p),A={};A.x=Math.min(s.x,
y.x);A.y=Math.min(s.y,y.y);A.w=Math.max(s.x+s.w,y.x+y.w)-A.x;A.h=Math.max(s.y+s.h,y.y+y.h)-A.y;y=Math.abs(RTree.Rectangle.squarified_ratio(A.w,A.h,s.nodes.length+2)-u);if(!w||!v||Math.abs(y-z)<v)w=x,v=Math.abs(y-z),t=y<z?s:k}p=q.splice(w,1)[0];k.nodes.length+q.length+1<=c?(k.nodes.push(p),RTree.Rectangle.expand_rectangle(k,p)):s.nodes.length+q.length+1<=c?(s.nodes.push(p),RTree.Rectangle.expand_rectangle(s,p)):(t.nodes.push(p),RTree.Rectangle.expand_rectangle(t,p))}g=i;h.length<1&&(f.nodes.push(i[0]),
h.push(f),g=i[1])}}else RTree.Rectangle.expand_rectangle(f,g),g={x:f.x,y:f.y,w:f.w,h:f.h}}while(h.length>0)}};this.get_tree=function(){return g};this.set_tree=function(b,c){c||(c=g);var d=c;d.nodes=b.nodes;d.x=b.x;d.y=b.y;d.w=b.w;d.h=b.h;return d};this.search=function(){if(arguments.length<1)throw"Wrong number of arguments. RT.Search requires at least a bounding rectangle.";switch(arguments.length){case 1:arguments[1]=!1;case 2:arguments[2]=[];case 3:arguments[3]=g;default:arguments.length=4}return h.apply(this,
arguments)};this.toJSON=function(b,c){var e=[],f=[],h={},i=3,q=1,k="";if(b&&!RTree.Rectangle.overlap_rectangle(b,g))return"";c?(i+=4,f.push(c.nodes.length),e.push(c.nodes),k+="var main_tree = {x:"+c.x.toFixed()+",y:"+c.y.toFixed()+",w:"+c.w.toFixed()+",h:"+c.h.toFixed()+",nodes:["):(f.push(g.nodes.length),e.push(g.nodes),k+="var main_tree = {x:"+g.x.toFixed()+",y:"+g.y.toFixed()+",w:"+g.w.toFixed()+",h:"+g.h.toFixed()+",nodes:[");do{var t=e.pop(),s=f.pop()-1;for(s>=0&&s<t.length-1&&(k+=",");s>=0;){var p=
t[s];if(!b||RTree.Rectangle.overlap_rectangle(b,p))if(p.nodes)if(q>=i){var u=d("saved_subtree");k+="{x:"+p.x.toFixed()+",y:"+p.y.toFixed()+",w:"+p.w.toFixed()+",h:"+p.h.toFixed()+",load:'"+u+".js'}";h[u]=this.toJSON(b,p);s>0&&(k+=",")}else k+="{x:"+p.x.toFixed()+",y:"+p.y.toFixed()+",w:"+p.w.toFixed()+",h:"+p.h.toFixed()+",nodes:[",q+=1,f.push(s),e.push(t),t=p.nodes,s=p.nodes.length;else p.leaf?(u=p.leaf.toJSON?p.leaf.toJSON():JSON.stringify(p.leaf),k+="{x:"+p.x.toFixed()+",y:"+p.y.toFixed()+",w:"+
p.w.toFixed()+",h:"+p.h.toFixed()+",leaf:"+u+"}",s>0&&(k+=",")):p.load&&(k+="{x:"+p.x.toFixed()+",y:"+p.y.toFixed()+",w:"+p.w.toFixed()+",h:"+p.h.toFixed()+",load:'"+p.load+"'}",s>0&&(k+=","));s-=1}s<0&&(k+="]}",q-=1)}while(e.length>0);k+=";";for(var v in h)k+="\nvar "+v+" = function(){"+h[v]+" return(main_tree);};";return k};this.remove=function(){if(arguments.length<1)throw"Wrong number of arguments. RT.remove requires at least a bounding rectangle.";switch(arguments.length){case 1:arguments[1]=
!1;case 2:arguments[2]=g;default:arguments.length=3}if(arguments[1]===!1){var b=0,c=[];do b=c.length,c=c.concat(f.apply(this,arguments));while(b!=c.length);return c}else return f.apply(this,arguments)};this.insert=function(b,c){return i({x:b.x,y:b.y,w:b.w,h:b.h,leaf:c},g)}};
RTree.Rectangle=function(b,c,e,g){var d,f,h,i;b.x?(d=b.x,f=b.y,b.w!==0&&!b.w&&b.x2?(h=b.x2-b.x,i=b.y2-b.y):(h=b.w,i=b.h)):(d=b,f=c,h=e,i=g);this.x1=this.x=d;this.y1=this.y=f;this.x2=d+h;this.y2=f+i;this.w=h;this.h=i;this.toJSON=function(){return'{"x":'+d.toString()+', "y":'+f.toString()+', "w":'+h.toString()+', "h":'+i.toString()+"}"};this.overlap=function(b){return this.x()<b.x2()&&this.x2()>b.x()&&this.y()<b.y2()&&this.y2()>b.y()};this.expand=function(b){var c=Math.min(this.x(),b.x()),e=Math.min(this.y(),
b.y());h=Math.max(this.x2(),b.x2())-c;i=Math.max(this.y2(),b.y2())-e;d=c;f=e;return this};this.setRect=function(){}};RTree.Rectangle.overlap_rectangle=function(b,c){return b.x<c.x+c.w&&b.x+b.w>c.x&&b.y<c.y+c.h&&b.y+b.h>c.y};RTree.Rectangle.contains_rectangle=function(b,c){return b.x+b.w<=c.x+c.w&&b.x>=c.x&&b.y+b.h<=c.y+c.h&&b.y>=c.y};
RTree.Rectangle.expand_rectangle=function(b,c){var e=Math.min(b.x,c.x),g=Math.min(b.y,c.y);b.w=Math.max(b.x+b.w,c.x+c.w)-e;b.h=Math.max(b.y+b.h,c.y+c.h)-g;b.x=e;b.y=g;return b};RTree.Rectangle.make_MBR=function(b,c){if(b.length<1)return{x:0,y:0,w:0,h:0};c?c.x=b[0].x:c={x:b[0].x,y:b[0].y,w:b[0].w,h:b[0].h};c.y=b[0].y;c.w=b[0].w;c.h=b[0].h;for(var e=b.length-1;e>0;e--)RTree.Rectangle.expand_rectangle(c,b[e]);return c};/*
 Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 See http://github.com/kothic/kothic-js for more information.
*/
Kothic.Debug=K.Class.extend({initialize:function(){this.stats={};this.events=[{message:"initialized",timestamp:+new Date}]},setStats:function(b){for(var c in b)b.hasOwnProperty(c)&&(this.stats[c]=b[c])},addEvent:function(b){this.events.push({message:b,timestamp:+new Date})}});
