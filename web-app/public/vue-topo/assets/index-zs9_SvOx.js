(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();/**
* @vue/shared v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Tl(e){const n=Object.create(null);for(const t of e.split(","))n[t]=1;return t=>t in n}const en={},Mr=[],st=()=>{},yd=()=>!1,Ei=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),wi=e=>e.startsWith("onUpdate:"),gn=Object.assign,Vl=(e,n)=>{const t=e.indexOf(n);t>-1&&e.splice(t,1)},F0=Object.prototype.hasOwnProperty,je=(e,n)=>F0.call(e,n),Ne=Array.isArray,kr=e=>Qo(e)==="[object Map]",jr=e=>Qo(e)==="[object Set]",Su=e=>Qo(e)==="[object Date]",Re=e=>typeof e=="function",an=e=>typeof e=="string",Nn=e=>typeof e=="symbol",Ze=e=>e!==null&&typeof e=="object",Cd=e=>(Ze(e)||Re(e))&&Re(e.then)&&Re(e.catch),Sd=Object.prototype.toString,Qo=e=>Sd.call(e),O0=e=>Qo(e).slice(8,-1),bd=e=>Qo(e)==="[object Object]",Ii=e=>an(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Eo=Tl(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Pi=e=>{const n=Object.create(null);return t=>n[t]||(n[t]=e(t))},R0=/-\w/g,xn=Pi(e=>e.replace(R0,n=>n.slice(1).toUpperCase())),B0=/\B([A-Z])/g,Jt=Pi(e=>e.replace(B0,"-$1").toLowerCase()),$i=Pi(e=>e.charAt(0).toUpperCase()+e.slice(1)),da=Pi(e=>e?`on${$i(e)}`:""),Ln=(e,n)=>!Object.is(e,n),Ms=(e,...n)=>{for(let t=0;t<e.length;t++)e[t](...n)},Ed=(e,n,t,r=!1)=>{Object.defineProperty(e,n,{configurable:!0,enumerable:!1,writable:r,value:t})},xi=e=>{const n=parseFloat(e);return isNaN(n)?e:n};let bu;const Di=()=>bu||(bu=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Fe(e){if(Ne(e)){const n={};for(let t=0;t<e.length;t++){const r=e[t],o=an(r)?z0(r):Fe(r);if(o)for(const s in o)n[s]=o[s]}return n}else if(an(e)||Ze(e))return e}const L0=/;(?![^(]*\))/g,U0=/:([^]+)/,H0=/\/\*[^]*?\*\//g;function z0(e){const n={};return e.replace(H0,"").split(L0).forEach(t=>{if(t){const r=t.split(U0);r.length>1&&(n[r[0].trim()]=r[1].trim())}}),n}function ve(e){let n="";if(an(e))n=e;else if(Ne(e))for(let t=0;t<e.length;t++){const r=ve(e[t]);r&&(n+=r+" ")}else if(Ze(e))for(const t in e)e[t]&&(n+=t+" ");return n.trim()}function K0(e){if(!e)return null;let{class:n,style:t}=e;return n&&!an(n)&&(e.class=ve(n)),t&&(e.style=Fe(t)),e}const W0="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",G0=Tl(W0);function wd(e){return!!e||e===""}function X0(e,n){if(e.length!==n.length)return!1;let t=!0;for(let r=0;t&&r<e.length;r++)t=qr(e[r],n[r]);return t}function qr(e,n){if(e===n)return!0;let t=Su(e),r=Su(n);if(t||r)return t&&r?e.getTime()===n.getTime():!1;if(t=Nn(e),r=Nn(n),t||r)return e===n;if(t=Ne(e),r=Ne(n),t||r)return t&&r?X0(e,n):!1;if(t=Ze(e),r=Ze(n),t||r){if(!t||!r)return!1;const o=Object.keys(e).length,s=Object.keys(n).length;if(o!==s)return!1;for(const i in e){const a=e.hasOwnProperty(i),l=n.hasOwnProperty(i);if(a&&!l||!a&&l||!qr(e[i],n[i]))return!1}}return String(e)===String(n)}function Nl(e,n){return e.findIndex(t=>qr(t,n))}const Id=e=>!!(e&&e.__v_isRef===!0),H=e=>an(e)?e:e==null?"":Ne(e)||Ze(e)&&(e.toString===Sd||!Re(e.toString))?Id(e)?H(e.value):JSON.stringify(e,Pd,2):String(e),Pd=(e,n)=>Id(n)?Pd(e,n.value):kr(n)?{[`Map(${n.size})`]:[...n.entries()].reduce((t,[r,o],s)=>(t[fa(r,s)+" =>"]=o,t),{})}:jr(n)?{[`Set(${n.size})`]:[...n.values()].map(t=>fa(t))}:Nn(n)?fa(n):Ze(n)&&!Ne(n)&&!bd(n)?String(n):n,fa=(e,n="")=>{var t;return Nn(e)?`Symbol(${(t=e.description)!=null?t:n})`:e};/**
* @vue/reactivity v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let yn;class $d{constructor(n=!1){this.detached=n,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=yn,!n&&yn&&(this.index=(yn.scopes||(yn.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let n,t;if(this.scopes)for(n=0,t=this.scopes.length;n<t;n++)this.scopes[n].pause();for(n=0,t=this.effects.length;n<t;n++)this.effects[n].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let n,t;if(this.scopes)for(n=0,t=this.scopes.length;n<t;n++)this.scopes[n].resume();for(n=0,t=this.effects.length;n<t;n++)this.effects[n].resume()}}run(n){if(this._active){const t=yn;try{return yn=this,n()}finally{yn=t}}}on(){++this._on===1&&(this.prevScope=yn,yn=this)}off(){this._on>0&&--this._on===0&&(yn=this.prevScope,this.prevScope=void 0)}stop(n){if(this._active){this._active=!1;let t,r;for(t=0,r=this.effects.length;t<r;t++)this.effects[t].stop();for(this.effects.length=0,t=0,r=this.cleanups.length;t<r;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!n){const o=this.parent.scopes.pop();o&&o!==this&&(this.parent.scopes[this.index]=o,o.index=this.index)}this.parent=void 0}}}function xd(e){return new $d(e)}function Al(){return yn}function ks(e,n=!1){yn&&yn.cleanups.push(e)}let tn;const pa=new WeakSet;class Dd{constructor(n){this.fn=n,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,yn&&yn.active&&yn.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,pa.has(this)&&(pa.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||kd(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Eu(this),Td(this);const n=tn,t=Wn;tn=this,Wn=!0;try{return this.fn()}finally{Vd(this),tn=n,Wn=t,this.flags&=-3}}stop(){if(this.flags&1){for(let n=this.deps;n;n=n.nextDep)Rl(n);this.deps=this.depsTail=void 0,Eu(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?pa.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Wa(this)&&this.run()}get dirty(){return Wa(this)}}let Md=0,wo,Io;function kd(e,n=!1){if(e.flags|=8,n){e.next=Io,Io=e;return}e.next=wo,wo=e}function Fl(){Md++}function Ol(){if(--Md>0)return;if(Io){let n=Io;for(Io=void 0;n;){const t=n.next;n.next=void 0,n.flags&=-9,n=t}}let e;for(;wo;){let n=wo;for(wo=void 0;n;){const t=n.next;if(n.next=void 0,n.flags&=-9,n.flags&1)try{n.trigger()}catch(r){e||(e=r)}n=t}}if(e)throw e}function Td(e){for(let n=e.deps;n;n=n.nextDep)n.version=-1,n.prevActiveLink=n.dep.activeLink,n.dep.activeLink=n}function Vd(e){let n,t=e.depsTail,r=t;for(;r;){const o=r.prevDep;r.version===-1?(r===t&&(t=o),Rl(r),Y0(r)):n=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=o}e.deps=n,e.depsTail=t}function Wa(e){for(let n=e.deps;n;n=n.nextDep)if(n.dep.version!==n.version||n.dep.computed&&(Nd(n.dep.computed)||n.dep.version!==n.version))return!0;return!!e._dirty}function Nd(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===To)||(e.globalVersion=To,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Wa(e))))return;e.flags|=2;const n=e.dep,t=tn,r=Wn;tn=e,Wn=!0;try{Td(e);const o=e.fn(e._value);(n.version===0||Ln(o,e._value))&&(e.flags|=128,e._value=o,n.version++)}catch(o){throw n.version++,o}finally{tn=t,Wn=r,Vd(e),e.flags&=-3}}function Rl(e,n=!1){const{dep:t,prevSub:r,nextSub:o}=e;if(r&&(r.nextSub=o,e.prevSub=void 0),o&&(o.prevSub=r,e.nextSub=void 0),t.subs===e&&(t.subs=r,!r&&t.computed)){t.computed.flags&=-5;for(let s=t.computed.deps;s;s=s.nextDep)Rl(s,!0)}!n&&!--t.sc&&t.map&&t.map.delete(t.key)}function Y0(e){const{prevDep:n,nextDep:t}=e;n&&(n.nextDep=t,e.prevDep=void 0),t&&(t.prevDep=n,e.nextDep=void 0)}let Wn=!0;const Ad=[];function $t(){Ad.push(Wn),Wn=!1}function xt(){const e=Ad.pop();Wn=e===void 0?!0:e}function Eu(e){const{cleanup:n}=e;if(e.cleanup=void 0,n){const t=tn;tn=void 0;try{n()}finally{tn=t}}}let To=0;class j0{constructor(n,t){this.sub=n,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Mi{constructor(n){this.computed=n,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(n){if(!tn||!Wn||tn===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==tn)t=this.activeLink=new j0(tn,this),tn.deps?(t.prevDep=tn.depsTail,tn.depsTail.nextDep=t,tn.depsTail=t):tn.deps=tn.depsTail=t,Fd(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const r=t.nextDep;r.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=r),t.prevDep=tn.depsTail,t.nextDep=void 0,tn.depsTail.nextDep=t,tn.depsTail=t,tn.deps===t&&(tn.deps=r)}return t}trigger(n){this.version++,To++,this.notify(n)}notify(n){Fl();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{Ol()}}}function Fd(e){if(e.dep.sc++,e.sub.flags&4){const n=e.dep.computed;if(n&&!e.dep.subs){n.flags|=20;for(let r=n.deps;r;r=r.nextDep)Fd(r)}const t=e.dep.subs;t!==e&&(e.prevSub=t,t&&(t.nextSub=e)),e.dep.subs=e}}const Ys=new WeakMap,hr=Symbol(""),Ga=Symbol(""),Vo=Symbol("");function Cn(e,n,t){if(Wn&&tn){let r=Ys.get(e);r||Ys.set(e,r=new Map);let o=r.get(t);o||(r.set(t,o=new Mi),o.map=r,o.key=t),o.track()}}function Ct(e,n,t,r,o,s){const i=Ys.get(e);if(!i){To++;return}const a=l=>{l&&l.trigger()};if(Fl(),n==="clear")i.forEach(a);else{const l=Ne(e),c=l&&Ii(t);if(l&&t==="length"){const d=Number(r);i.forEach((f,h)=>{(h==="length"||h===Vo||!Nn(h)&&h>=d)&&a(f)})}else switch((t!==void 0||i.has(void 0))&&a(i.get(t)),c&&a(i.get(Vo)),n){case"add":l?c&&a(i.get("length")):(a(i.get(hr)),kr(e)&&a(i.get(Ga)));break;case"delete":l||(a(i.get(hr)),kr(e)&&a(i.get(Ga)));break;case"set":kr(e)&&a(i.get(hr));break}}Ol()}function q0(e,n){const t=Ys.get(e);return t&&t.get(n)}function Ir(e){const n=Xe(e);return n===e?n:(Cn(n,"iterate",Vo),Tn(e)?n:n.map(Xn))}function ki(e){return Cn(e=Xe(e),"iterate",Vo),e}function et(e,n){return Dt(e)?Br(vr(e)?Xn(n):n):Xn(n)}const Z0={__proto__:null,[Symbol.iterator](){return ha(this,Symbol.iterator,e=>et(this,e))},concat(...e){return Ir(this).concat(...e.map(n=>Ne(n)?Ir(n):n))},entries(){return ha(this,"entries",e=>(e[1]=et(this,e[1]),e))},every(e,n){return vt(this,"every",e,n,void 0,arguments)},filter(e,n){return vt(this,"filter",e,n,t=>t.map(r=>et(this,r)),arguments)},find(e,n){return vt(this,"find",e,n,t=>et(this,t),arguments)},findIndex(e,n){return vt(this,"findIndex",e,n,void 0,arguments)},findLast(e,n){return vt(this,"findLast",e,n,t=>et(this,t),arguments)},findLastIndex(e,n){return vt(this,"findLastIndex",e,n,void 0,arguments)},forEach(e,n){return vt(this,"forEach",e,n,void 0,arguments)},includes(...e){return va(this,"includes",e)},indexOf(...e){return va(this,"indexOf",e)},join(e){return Ir(this).join(e)},lastIndexOf(...e){return va(this,"lastIndexOf",e)},map(e,n){return vt(this,"map",e,n,void 0,arguments)},pop(){return to(this,"pop")},push(...e){return to(this,"push",e)},reduce(e,...n){return wu(this,"reduce",e,n)},reduceRight(e,...n){return wu(this,"reduceRight",e,n)},shift(){return to(this,"shift")},some(e,n){return vt(this,"some",e,n,void 0,arguments)},splice(...e){return to(this,"splice",e)},toReversed(){return Ir(this).toReversed()},toSorted(e){return Ir(this).toSorted(e)},toSpliced(...e){return Ir(this).toSpliced(...e)},unshift(...e){return to(this,"unshift",e)},values(){return ha(this,"values",e=>et(this,e))}};function ha(e,n,t){const r=ki(e),o=r[n]();return r!==e&&!Tn(e)&&(o._next=o.next,o.next=()=>{const s=o._next();return s.done||(s.value=t(s.value)),s}),o}const J0=Array.prototype;function vt(e,n,t,r,o,s){const i=ki(e),a=i!==e&&!Tn(e),l=i[n];if(l!==J0[n]){const f=l.apply(e,s);return a?Xn(f):f}let c=t;i!==e&&(a?c=function(f,h){return t.call(this,et(e,f),h,e)}:t.length>2&&(c=function(f,h){return t.call(this,f,h,e)}));const d=l.call(i,c,r);return a&&o?o(d):d}function wu(e,n,t,r){const o=ki(e),s=o!==e&&!Tn(e);let i=t,a=!1;o!==e&&(s?(a=r.length===0,i=function(c,d,f){return a&&(a=!1,c=et(e,c)),t.call(this,c,et(e,d),f,e)}):t.length>3&&(i=function(c,d,f){return t.call(this,c,d,f,e)}));const l=o[n](i,...r);return a?et(e,l):l}function va(e,n,t){const r=Xe(e);Cn(r,"iterate",Vo);const o=r[n](...t);return(o===-1||o===!1)&&Ti(t[0])?(t[0]=Xe(t[0]),r[n](...t)):o}function to(e,n,t=[]){$t(),Fl();const r=Xe(e)[n].apply(e,t);return Ol(),xt(),r}const Q0=Tl("__proto__,__v_isRef,__isVue"),Od=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Nn));function eh(e){Nn(e)||(e=String(e));const n=Xe(this);return Cn(n,"has",e),n.hasOwnProperty(e)}class Rd{constructor(n=!1,t=!1){this._isReadonly=n,this._isShallow=t}get(n,t,r){if(t==="__v_skip")return n.__v_skip;const o=this._isReadonly,s=this._isShallow;if(t==="__v_isReactive")return!o;if(t==="__v_isReadonly")return o;if(t==="__v_isShallow")return s;if(t==="__v_raw")return r===(o?s?ch:Hd:s?Ud:Ld).get(n)||Object.getPrototypeOf(n)===Object.getPrototypeOf(r)?n:void 0;const i=Ne(n);if(!o){let l;if(i&&(l=Z0[t]))return l;if(t==="hasOwnProperty")return eh}const a=Reflect.get(n,t,cn(n)?n:r);if((Nn(t)?Od.has(t):Q0(t))||(o||Cn(n,"get",t),s))return a;if(cn(a)){const l=i&&Ii(t)?a:a.value;return o&&Ze(l)?No(l):l}return Ze(a)?o?No(a):Gn(a):a}}class Bd extends Rd{constructor(n=!1){super(!1,n)}set(n,t,r,o){let s=n[t];const i=Ne(n)&&Ii(t);if(!this._isShallow){const c=Dt(s);if(!Tn(r)&&!Dt(r)&&(s=Xe(s),r=Xe(r)),!i&&cn(s)&&!cn(r))return c||(s.value=r),!0}const a=i?Number(t)<n.length:je(n,t),l=Reflect.set(n,t,r,cn(n)?n:o);return n===Xe(o)&&(a?Ln(r,s)&&Ct(n,"set",t,r):Ct(n,"add",t,r)),l}deleteProperty(n,t){const r=je(n,t);n[t];const o=Reflect.deleteProperty(n,t);return o&&r&&Ct(n,"delete",t,void 0),o}has(n,t){const r=Reflect.has(n,t);return(!Nn(t)||!Od.has(t))&&Cn(n,"has",t),r}ownKeys(n){return Cn(n,"iterate",Ne(n)?"length":hr),Reflect.ownKeys(n)}}class nh extends Rd{constructor(n=!1){super(!0,n)}set(n,t){return!0}deleteProperty(n,t){return!0}}const th=new Bd,rh=new nh,oh=new Bd(!0);const Xa=e=>e,ds=e=>Reflect.getPrototypeOf(e);function sh(e,n,t){return function(...r){const o=this.__v_raw,s=Xe(o),i=kr(s),a=e==="entries"||e===Symbol.iterator&&i,l=e==="keys"&&i,c=o[e](...r),d=t?Xa:n?Br:Xn;return!n&&Cn(s,"iterate",l?Ga:hr),gn(Object.create(c),{next(){const{value:f,done:h}=c.next();return h?{value:f,done:h}:{value:a?[d(f[0]),d(f[1])]:d(f),done:h}}})}}function fs(e){return function(...n){return e==="delete"?!1:e==="clear"?void 0:this}}function ih(e,n){const t={get(o){const s=this.__v_raw,i=Xe(s),a=Xe(o);e||(Ln(o,a)&&Cn(i,"get",o),Cn(i,"get",a));const{has:l}=ds(i),c=n?Xa:e?Br:Xn;if(l.call(i,o))return c(s.get(o));if(l.call(i,a))return c(s.get(a));s!==i&&s.get(o)},get size(){const o=this.__v_raw;return!e&&Cn(Xe(o),"iterate",hr),o.size},has(o){const s=this.__v_raw,i=Xe(s),a=Xe(o);return e||(Ln(o,a)&&Cn(i,"has",o),Cn(i,"has",a)),o===a?s.has(o):s.has(o)||s.has(a)},forEach(o,s){const i=this,a=i.__v_raw,l=Xe(a),c=n?Xa:e?Br:Xn;return!e&&Cn(l,"iterate",hr),a.forEach((d,f)=>o.call(s,c(d),c(f),i))}};return gn(t,e?{add:fs("add"),set:fs("set"),delete:fs("delete"),clear:fs("clear")}:{add(o){const s=Xe(this),i=ds(s),a=Xe(o),l=!n&&!Tn(o)&&!Dt(o)?a:o;return i.has.call(s,l)||Ln(o,l)&&i.has.call(s,o)||Ln(a,l)&&i.has.call(s,a)||(s.add(l),Ct(s,"add",l,l)),this},set(o,s){!n&&!Tn(s)&&!Dt(s)&&(s=Xe(s));const i=Xe(this),{has:a,get:l}=ds(i);let c=a.call(i,o);c||(o=Xe(o),c=a.call(i,o));const d=l.call(i,o);return i.set(o,s),c?Ln(s,d)&&Ct(i,"set",o,s):Ct(i,"add",o,s),this},delete(o){const s=Xe(this),{has:i,get:a}=ds(s);let l=i.call(s,o);l||(o=Xe(o),l=i.call(s,o)),a&&a.call(s,o);const c=s.delete(o);return l&&Ct(s,"delete",o,void 0),c},clear(){const o=Xe(this),s=o.size!==0,i=o.clear();return s&&Ct(o,"clear",void 0,void 0),i}}),["keys","values","entries",Symbol.iterator].forEach(o=>{t[o]=sh(o,e,n)}),t}function Bl(e,n){const t=ih(e,n);return(r,o,s)=>o==="__v_isReactive"?!e:o==="__v_isReadonly"?e:o==="__v_raw"?r:Reflect.get(je(t,o)&&o in r?t:r,o,s)}const ah={get:Bl(!1,!1)},lh={get:Bl(!1,!0)},uh={get:Bl(!0,!1)};const Ld=new WeakMap,Ud=new WeakMap,Hd=new WeakMap,ch=new WeakMap;function dh(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function fh(e){return e.__v_skip||!Object.isExtensible(e)?0:dh(O0(e))}function Gn(e){return Dt(e)?e:Ll(e,!1,th,ah,Ld)}function ph(e){return Ll(e,!1,oh,lh,Ud)}function No(e){return Ll(e,!0,rh,uh,Hd)}function Ll(e,n,t,r,o){if(!Ze(e)||e.__v_raw&&!(n&&e.__v_isReactive))return e;const s=fh(e);if(s===0)return e;const i=o.get(e);if(i)return i;const a=new Proxy(e,s===2?r:t);return o.set(e,a),a}function vr(e){return Dt(e)?vr(e.__v_raw):!!(e&&e.__v_isReactive)}function Dt(e){return!!(e&&e.__v_isReadonly)}function Tn(e){return!!(e&&e.__v_isShallow)}function Ti(e){return e?!!e.__v_raw:!1}function Xe(e){const n=e&&e.__v_raw;return n?Xe(n):e}function It(e){return!je(e,"__v_skip")&&Object.isExtensible(e)&&Ed(e,"__v_skip",!0),e}const Xn=e=>Ze(e)?Gn(e):e,Br=e=>Ze(e)?No(e):e;function cn(e){return e?e.__v_isRef===!0:!1}function Ee(e){return zd(e,!1)}function Wt(e){return zd(e,!0)}function zd(e,n){return cn(e)?e:new hh(e,n)}class hh{constructor(n,t){this.dep=new Mi,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?n:Xe(n),this._value=t?n:Xn(n),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(n){const t=this._rawValue,r=this.__v_isShallow||Tn(n)||Dt(n);n=r?n:Xe(n),Ln(n,t)&&(this._rawValue=n,this._value=r?n:Xn(n),this.dep.trigger())}}function de(e){return cn(e)?e.value:e}function Ge(e){return Re(e)?e():de(e)}const vh={get:(e,n,t)=>n==="__v_raw"?e:de(Reflect.get(e,n,t)),set:(e,n,t,r)=>{const o=e[n];return cn(o)&&!cn(t)?(o.value=t,!0):Reflect.set(e,n,t,r)}};function Kd(e){return vr(e)?e:new Proxy(e,vh)}class mh{constructor(n){this.__v_isRef=!0,this._value=void 0;const t=this.dep=new Mi,{get:r,set:o}=n(t.track.bind(t),t.trigger.bind(t));this._get=r,this._set=o}get value(){return this._value=this._get()}set value(n){this._set(n)}}function _h(e){return new mh(e)}function gh(e){const n=Ne(e)?new Array(e.length):{};for(const t in e)n[t]=Wd(e,t);return n}class yh{constructor(n,t,r){this._object=n,this._defaultValue=r,this.__v_isRef=!0,this._value=void 0,this._key=Nn(t)?t:String(t),this._raw=Xe(n);let o=!0,s=n;if(!Ne(n)||Nn(this._key)||!Ii(this._key))do o=!Ti(s)||Tn(s);while(o&&(s=s.__v_raw));this._shallow=o}get value(){let n=this._object[this._key];return this._shallow&&(n=de(n)),this._value=n===void 0?this._defaultValue:n}set value(n){if(this._shallow&&cn(this._raw[this._key])){const t=this._object[this._key];if(cn(t)){t.value=n;return}}this._object[this._key]=n}get dep(){return q0(this._raw,this._key)}}class Ch{constructor(n){this._getter=n,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function Ye(e,n,t){return cn(e)?e:Re(e)?new Ch(e):Ze(e)&&arguments.length>1?Wd(e,n,t):Ee(e)}function Wd(e,n,t){return new yh(e,n,t)}class Sh{constructor(n,t,r){this.fn=n,this.setter=t,this._value=void 0,this.dep=new Mi(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=To-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&tn!==this)return kd(this,!0),!0}get value(){const n=this.dep.track();return Nd(this),n&&(n.version=this.dep.version),this._value}set value(n){this.setter&&this.setter(n)}}function bh(e,n,t=!1){let r,o;return Re(e)?r=e:(r=e.get,o=e.set),new Sh(r,o,t)}const ps={},js=new WeakMap;let ir;function Eh(e,n=!1,t=ir){if(t){let r=js.get(t);r||js.set(t,r=[]),r.push(e)}}function wh(e,n,t=en){const{immediate:r,deep:o,once:s,scheduler:i,augmentJob:a,call:l}=t,c=N=>o?N:Tn(N)||o===!1||o===0?St(N,1):St(N);let d,f,h,p,E=!1,b=!1;if(cn(e)?(f=()=>e.value,E=Tn(e)):vr(e)?(f=()=>c(e),E=!0):Ne(e)?(b=!0,E=e.some(N=>vr(N)||Tn(N)),f=()=>e.map(N=>{if(cn(N))return N.value;if(vr(N))return c(N);if(Re(N))return l?l(N,2):N()})):Re(e)?n?f=l?()=>l(e,2):e:f=()=>{if(h){$t();try{h()}finally{xt()}}const N=ir;ir=d;try{return l?l(e,3,[p]):e(p)}finally{ir=N}}:f=st,n&&o){const N=f,re=o===!0?1/0:o;f=()=>St(N(),re)}const T=Al(),V=()=>{d.stop(),T&&T.active&&Vl(T.effects,d)};if(s&&n){const N=n;n=(...re)=>{N(...re),V()}}let z=b?new Array(e.length).fill(ps):ps;const x=N=>{if(!(!(d.flags&1)||!d.dirty&&!N))if(n){const re=d.run();if(o||E||(b?re.some((ie,ae)=>Ln(ie,z[ae])):Ln(re,z))){h&&h();const ie=ir;ir=d;try{const ae=[re,z===ps?void 0:b&&z[0]===ps?[]:z,p];z=re,l?l(n,3,ae):n(...ae)}finally{ir=ie}}}else d.run()};return a&&a(x),d=new Dd(f),d.scheduler=i?()=>i(x,!1):x,p=N=>Eh(N,!1,d),h=d.onStop=()=>{const N=js.get(d);if(N){if(l)l(N,4);else for(const re of N)re();js.delete(d)}},n?r?x(!0):z=d.run():i?i(x.bind(null,!0),!0):d.run(),V.pause=d.pause.bind(d),V.resume=d.resume.bind(d),V.stop=V,V}function St(e,n=1/0,t){if(n<=0||!Ze(e)||e.__v_skip||(t=t||new Map,(t.get(e)||0)>=n))return e;if(t.set(e,n),n--,cn(e))St(e.value,n,t);else if(Ne(e))for(let r=0;r<e.length;r++)St(e[r],n,t);else if(jr(e)||kr(e))e.forEach(r=>{St(r,n,t)});else if(bd(e)){for(const r in e)St(e[r],n,t);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&St(e[r],n,t)}return e}/**
* @vue/runtime-core v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function es(e,n,t,r){try{return r?e(...r):e()}catch(o){Vi(o,n,t)}}function lt(e,n,t,r){if(Re(e)){const o=es(e,n,t,r);return o&&Cd(o)&&o.catch(s=>{Vi(s,n,t)}),o}if(Ne(e)){const o=[];for(let s=0;s<e.length;s++)o.push(lt(e[s],n,t,r));return o}}function Vi(e,n,t,r=!0){const o=n?n.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:i}=n&&n.appContext.config||en;if(n){let a=n.parent;const l=n.proxy,c=`https://vuejs.org/error-reference/#runtime-${t}`;for(;a;){const d=a.ec;if(d){for(let f=0;f<d.length;f++)if(d[f](e,l,c)===!1)return}a=a.parent}if(s){$t(),es(s,null,10,[e,l,c]),xt();return}}Ih(e,t,o,r,i)}function Ih(e,n,t,r=!0,o=!1){if(o)throw e;console.error(e)}const In=[];let Jn=-1;const Tr=[];let Lt=null,Dr=0;const Gd=Promise.resolve();let qs=null;function fn(e){const n=qs||Gd;return e?n.then(this?e.bind(this):e):n}function Ph(e){let n=Jn+1,t=In.length;for(;n<t;){const r=n+t>>>1,o=In[r],s=Ao(o);s<e||s===e&&o.flags&2?n=r+1:t=r}return n}function Ul(e){if(!(e.flags&1)){const n=Ao(e),t=In[In.length-1];!t||!(e.flags&2)&&n>=Ao(t)?In.push(e):In.splice(Ph(n),0,e),e.flags|=1,Xd()}}function Xd(){qs||(qs=Gd.then(jd))}function $h(e){Ne(e)?Tr.push(...e):Lt&&e.id===-1?Lt.splice(Dr+1,0,e):e.flags&1||(Tr.push(e),e.flags|=1),Xd()}function Iu(e,n,t=Jn+1){for(;t<In.length;t++){const r=In[t];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;In.splice(t,1),t--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Yd(e){if(Tr.length){const n=[...new Set(Tr)].sort((t,r)=>Ao(t)-Ao(r));if(Tr.length=0,Lt){Lt.push(...n);return}for(Lt=n,Dr=0;Dr<Lt.length;Dr++){const t=Lt[Dr];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}Lt=null,Dr=0}}const Ao=e=>e.id==null?e.flags&2?-1:1/0:e.id;function jd(e){try{for(Jn=0;Jn<In.length;Jn++){const n=In[Jn];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),es(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;Jn<In.length;Jn++){const n=In[Jn];n&&(n.flags&=-2)}Jn=-1,In.length=0,Yd(),qs=null,(In.length||Tr.length)&&jd()}}let _n=null,qd=null;function Zs(e){const n=_n;return _n=e,qd=e&&e.type.__scopeId||null,n}function Un(e,n=_n,t){if(!n||e._n)return e;const r=(...o)=>{r._d&&ei(-1);const s=Zs(n);let i;try{i=e(...o)}finally{Zs(s),r._d&&ei(1)}return i};return r._n=!0,r._c=!0,r._d=!0,r}function Te(e,n){if(_n===null)return e;const t=Ri(_n),r=e.dirs||(e.dirs=[]);for(let o=0;o<n.length;o++){let[s,i,a,l=en]=n[o];s&&(Re(s)&&(s={mounted:s,updated:s}),s.deep&&St(i),r.push({dir:s,instance:t,value:i,oldValue:void 0,arg:a,modifiers:l}))}return e}function tr(e,n,t,r){const o=e.dirs,s=n&&n.dirs;for(let i=0;i<o.length;i++){const a=o[i];s&&(a.oldValue=s[i].value);let l=a.dir[r];l&&($t(),lt(l,t,8,[e.el,a,e,n]),xt())}}function ut(e,n){if(Sn){let t=Sn.provides;const r=Sn.parent&&Sn.parent.provides;r===t&&(t=Sn.provides=Object.create(r)),t[e]=n}}function Vn(e,n,t=!1){const r=Qt();if(r||Nr){let o=Nr?Nr._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(o&&e in o)return o[e];if(arguments.length>1)return t&&Re(n)?n.call(r&&r.proxy):n}}const xh=Symbol.for("v-scx"),Dh=()=>Vn(xh);function Mh(e,n){return Hl(e,null,n)}function Be(e,n,t){return Hl(e,n,t)}function Hl(e,n,t=en){const{immediate:r,deep:o,flush:s,once:i}=t,a=gn({},t),l=n&&r||!n&&s!=="post";let c;if(Ro){if(s==="sync"){const p=Dh();c=p.__watcherHandles||(p.__watcherHandles=[])}else if(!l){const p=()=>{};return p.stop=st,p.resume=st,p.pause=st,p}}const d=Sn;a.call=(p,E,b)=>lt(p,d,E,b);let f=!1;s==="post"?a.scheduler=p=>{wn(p,d&&d.suspense)}:s!=="sync"&&(f=!0,a.scheduler=(p,E)=>{E?p():Ul(p)}),a.augmentJob=p=>{n&&(p.flags|=4),f&&(p.flags|=2,d&&(p.id=d.uid,p.i=d))};const h=wh(e,n,a);return Ro&&(c?c.push(h):l&&h()),h}function kh(e,n,t){const r=this.proxy,o=an(e)?e.includes(".")?Zd(r,e):()=>r[e]:e.bind(r,r);let s;Re(n)?s=n:(s=n.handler,t=n);const i=ns(this),a=Hl(o,s.bind(r),t);return i(),a}function Zd(e,n){const t=n.split(".");return()=>{let r=e;for(let o=0;o<t.length&&r;o++)r=r[t[o]];return r}}const rr=new WeakMap,Jd=Symbol("_vte"),Th=e=>e.__isTeleport,ar=e=>e&&(e.disabled||e.disabled===""),Vh=e=>e&&(e.defer||e.defer===""),Pu=e=>typeof SVGElement<"u"&&e instanceof SVGElement,$u=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,Ya=(e,n)=>{const t=e&&e.to;return an(t)?n?n(t):null:t},Nh={name:"Teleport",__isTeleport:!0,process(e,n,t,r,o,s,i,a,l,c){const{mc:d,pc:f,pbc:h,o:{insert:p,querySelector:E,createText:b,createComment:T}}=c,V=ar(n.props);let{dynamicChildren:z}=n;const x=(ie,ae,fe)=>{ie.shapeFlag&16&&d(ie.children,ae,fe,o,s,i,a,l)},N=(ie=n)=>{const ae=ar(ie.props),fe=ie.target=Ya(ie.props,E),le=ja(fe,ie,b,p);fe&&(i!=="svg"&&Pu(fe)?i="svg":i!=="mathml"&&$u(fe)&&(i="mathml"),o&&o.isCE&&(o.ce._teleportTargets||(o.ce._teleportTargets=new Set)).add(fe),ae||(x(ie,fe,le),po(ie,!1)))},re=ie=>{const ae=()=>{rr.get(ie)===ae&&(rr.delete(ie),ar(ie.props)&&(x(ie,t,ie.anchor),po(ie,!0)),N(ie))};rr.set(ie,ae),wn(ae,s)};if(e==null){const ie=n.el=b(""),ae=n.anchor=b("");if(p(ie,t,r),p(ae,t,r),Vh(n.props)||s&&s.pendingBranch){re(n);return}V&&(x(n,t,ae),po(n,!0)),N()}else{n.el=e.el;const ie=n.anchor=e.anchor,ae=rr.get(e);if(ae){ae.flags|=8,rr.delete(e),re(n);return}n.targetStart=e.targetStart;const fe=n.target=e.target,le=n.targetAnchor=e.targetAnchor,Z=ar(e.props),ne=Z?t:fe,M=Z?ie:le;if(i==="svg"||Pu(fe)?i="svg":(i==="mathml"||$u(fe))&&(i="mathml"),z?(h(e.dynamicChildren,z,ne,o,s,i,a),Xl(e,n,!0)):l||f(e,n,ne,M,o,s,i,a,!1),V)Z?n.props&&e.props&&n.props.to!==e.props.to&&(n.props.to=e.props.to):hs(n,t,ie,c,1);else if((n.props&&n.props.to)!==(e.props&&e.props.to)){const q=n.target=Ya(n.props,E);q&&hs(n,q,null,c,0)}else Z&&hs(n,fe,le,c,1);po(n,V)}},remove(e,n,t,{um:r,o:{remove:o}},s){const{shapeFlag:i,children:a,anchor:l,targetStart:c,targetAnchor:d,target:f,props:h}=e;let p=s||!ar(h);const E=rr.get(e);if(E&&(E.flags|=8,rr.delete(e),p=!1),f&&(o(c),o(d)),s&&o(l),i&16)for(let b=0;b<a.length;b++){const T=a[b];r(T,n,t,p,!!T.dynamicChildren)}},move:hs,hydrate:Ah};function hs(e,n,t,{o:{insert:r},m:o},s=2){s===0&&r(e.targetAnchor,n,t);const{el:i,anchor:a,shapeFlag:l,children:c,props:d}=e,f=s===2;if(f&&r(i,n,t),(!f||ar(d))&&l&16)for(let h=0;h<c.length;h++)o(c[h],n,t,2);f&&r(a,n,t)}function Ah(e,n,t,r,o,s,{o:{nextSibling:i,parentNode:a,querySelector:l,insert:c,createText:d}},f){function h(T,V){let z=V;for(;z;){if(z&&z.nodeType===8){if(z.data==="teleport start anchor")n.targetStart=z;else if(z.data==="teleport anchor"){n.targetAnchor=z,T._lpa=n.targetAnchor&&i(n.targetAnchor);break}}z=i(z)}}function p(T,V){V.anchor=f(i(T),V,a(T),t,r,o,s)}const E=n.target=Ya(n.props,l),b=ar(n.props);if(E){const T=E._lpa||E.firstChild;n.shapeFlag&16&&(b?(p(e,n),h(E,T),n.targetAnchor||ja(E,n,d,c,a(e)===E?e:null)):(n.anchor=i(e),h(E,T),n.targetAnchor||ja(E,n,d,c),f(T&&i(T),n,E,t,r,o,s))),po(n,b)}else b&&n.shapeFlag&16&&(p(e,n),n.targetStart=e,n.targetAnchor=i(e));return n.anchor&&i(n.anchor)}const Fh=Nh;function po(e,n){const t=e.ctx;if(t&&t.ut){let r,o;for(n?(r=e.el,o=e.anchor):(r=e.targetStart,o=e.targetAnchor);r&&r!==o;)r.nodeType===1&&r.setAttribute("data-v-owner",t.uid),r=r.nextSibling;t.ut()}}function ja(e,n,t,r,o=null){const s=n.targetStart=t(""),i=n.targetAnchor=t("");return s[Jd]=i,e&&(r(s,e,o),r(i,e,o)),i}const Oh=Symbol("_leaveCb");function zl(e,n){e.shapeFlag&6&&e.component?(e.transition=n,zl(e.component.subTree,n)):e.shapeFlag&128?(e.ssContent.transition=n.clone(e.ssContent),e.ssFallback.transition=n.clone(e.ssFallback)):e.transition=n}function We(e,n){return Re(e)?gn({name:e.name},n,{setup:e}):e}function Qd(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function xu(e,n){let t;return!!((t=Object.getOwnPropertyDescriptor(e,n))&&!t.configurable)}const Js=new WeakMap;function Po(e,n,t,r,o=!1){if(Ne(e)){e.forEach((b,T)=>Po(b,n&&(Ne(n)?n[T]:n),t,r,o));return}if(Vr(r)&&!o){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Po(e,n,t,r.component.subTree);return}const s=r.shapeFlag&4?Ri(r.component):r.el,i=o?null:s,{i:a,r:l}=e,c=n&&n.r,d=a.refs===en?a.refs={}:a.refs,f=a.setupState,h=Xe(f),p=f===en?yd:b=>xu(d,b)?!1:je(h,b),E=(b,T)=>!(T&&xu(d,T));if(c!=null&&c!==l){if(Du(n),an(c))d[c]=null,p(c)&&(f[c]=null);else if(cn(c)){const b=n;E(c,b.k)&&(c.value=null),b.k&&(d[b.k]=null)}}if(Re(l))es(l,a,12,[i,d]);else{const b=an(l),T=cn(l);if(b||T){const V=()=>{if(e.f){const z=b?p(l)?f[l]:d[l]:E()||!e.k?l.value:d[e.k];if(o)Ne(z)&&Vl(z,s);else if(Ne(z))z.includes(s)||z.push(s);else if(b)d[l]=[s],p(l)&&(f[l]=d[l]);else{const x=[s];E(l,e.k)&&(l.value=x),e.k&&(d[e.k]=x)}}else b?(d[l]=i,p(l)&&(f[l]=i)):T&&(E(l,e.k)&&(l.value=i),e.k&&(d[e.k]=i))};if(i){const z=()=>{V(),Js.delete(e)};z.id=-1,Js.set(e,z),wn(z,t)}else Du(e),V()}}}function Du(e){const n=Js.get(e);n&&(n.flags|=8,Js.delete(e))}Di().requestIdleCallback;Di().cancelIdleCallback;const Vr=e=>!!e.type.__asyncLoader,ef=e=>e.type.__isKeepAlive;function Rh(e,n){nf(e,"a",n)}function Bh(e,n){nf(e,"da",n)}function nf(e,n,t=Sn){const r=e.__wdc||(e.__wdc=()=>{let o=t;for(;o;){if(o.isDeactivated)return;o=o.parent}return e()});if(Ni(n,r,t),t){let o=t.parent;for(;o&&o.parent;)ef(o.parent.vnode)&&Lh(r,n,t,o),o=o.parent}}function Lh(e,n,t,r){const o=Ni(n,e,r,!0);Ai(()=>{Vl(r[n],o)},t)}function Ni(e,n,t=Sn,r=!1){if(t){const o=t[e]||(t[e]=[]),s=n.__weh||(n.__weh=(...i)=>{$t();const a=ns(t),l=lt(n,t,e,i);return a(),xt(),l});return r?o.unshift(s):o.push(s),s}}const Vt=e=>(n,t=Sn)=>{(!Ro||e==="sp")&&Ni(e,(...r)=>n(...r),t)},tf=Vt("bm"),bn=Vt("m"),Uh=Vt("bu"),Hh=Vt("u"),Cr=Vt("bum"),Ai=Vt("um"),zh=Vt("sp"),Kh=Vt("rtg"),Wh=Vt("rtc");function Gh(e,n=Sn){Ni("ec",e,n)}const rf="components";function of(e,n){return af(rf,e,!0,n)||e}const sf=Symbol.for("v-ndc");function lr(e){return an(e)?af(rf,e,!1)||e:e||sf}function af(e,n,t=!0,r=!1){const o=_n||Sn;if(o){const s=o.type;{const a=D1(s,!1);if(a&&(a===n||a===xn(n)||a===$i(xn(n))))return s}const i=Mu(o[e]||s[e],n)||Mu(o.appContext[e],n);return!i&&r?s:i}}function Mu(e,n){return e&&(e[n]||e[xn(n)]||e[$i(xn(n))])}function xe(e,n,t,r){let o;const s=t&&t[r],i=Ne(e);if(i||an(e)){const a=i&&vr(e);let l=!1,c=!1;a&&(l=!Tn(e),c=Dt(e),e=ki(e)),o=new Array(e.length);for(let d=0,f=e.length;d<f;d++)o[d]=n(l?c?Br(Xn(e[d])):Xn(e[d]):e[d],d,void 0,s&&s[d])}else if(typeof e=="number"){o=new Array(e);for(let a=0;a<e;a++)o[a]=n(a+1,a,void 0,s&&s[a])}else if(Ze(e))if(e[Symbol.iterator])o=Array.from(e,(a,l)=>n(a,l,void 0,s&&s[l]));else{const a=Object.keys(e);o=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const d=a[l];o[l]=n(e[d],d,l,s&&s[l])}}else o=[];return t&&(t[r]=o),o}function sn(e,n,t={},r,o){if(_n.ce||_n.parent&&Vr(_n.parent)&&_n.parent.ce){const c=Object.keys(t).length>0;return n!=="default"&&(t.name=n),C(),Je(he,null,[Ke("slot",t,r&&r())],c?-2:64)}let s=e[n];s&&s._c&&(s._d=!1),C();const i=s&&lf(s(t)),a=t.key||i&&i.key,l=Je(he,{key:(a&&!Nn(a)?a:`_${n}`)+(!i&&r?"_fb":"")},i||(r?r():[]),i&&e._===1?64:-2);return l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),s&&s._c&&(s._d=!0),l}function lf(e){return e.some(n=>Fo(n)?!(n.type===Mt||n.type===he&&!lf(n.children)):!0)?e:null}const qa=e=>e?Df(e)?Ri(e):qa(e.parent):null,$o=gn(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>qa(e.parent),$root:e=>qa(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>ff(e),$forceUpdate:e=>e.f||(e.f=()=>{Ul(e.update)}),$nextTick:e=>e.n||(e.n=fn.bind(e.proxy)),$watch:e=>kh.bind(e)}),ma=(e,n)=>e!==en&&!e.__isScriptSetup&&je(e,n),Xh={get({_:e},n){if(n==="__v_skip")return!0;const{ctx:t,setupState:r,data:o,props:s,accessCache:i,type:a,appContext:l}=e;if(n[0]!=="$"){const h=i[n];if(h!==void 0)switch(h){case 1:return r[n];case 2:return o[n];case 4:return t[n];case 3:return s[n]}else{if(ma(r,n))return i[n]=1,r[n];if(o!==en&&je(o,n))return i[n]=2,o[n];if(je(s,n))return i[n]=3,s[n];if(t!==en&&je(t,n))return i[n]=4,t[n];Za&&(i[n]=0)}}const c=$o[n];let d,f;if(c)return n==="$attrs"&&Cn(e.attrs,"get",""),c(e);if((d=a.__cssModules)&&(d=d[n]))return d;if(t!==en&&je(t,n))return i[n]=4,t[n];if(f=l.config.globalProperties,je(f,n))return f[n]},set({_:e},n,t){const{data:r,setupState:o,ctx:s}=e;return ma(o,n)?(o[n]=t,!0):r!==en&&je(r,n)?(r[n]=t,!0):je(e.props,n)||n[0]==="$"&&n.slice(1)in e?!1:(s[n]=t,!0)},has({_:{data:e,setupState:n,accessCache:t,ctx:r,appContext:o,props:s,type:i}},a){let l;return!!(t[a]||e!==en&&a[0]!=="$"&&je(e,a)||ma(n,a)||je(s,a)||je(r,a)||je($o,a)||je(o.config.globalProperties,a)||(l=i.__cssModules)&&l[a])},defineProperty(e,n,t){return t.get!=null?e._.accessCache[n]=0:je(t,"value")&&this.set(e,n,t.value,null),Reflect.defineProperty(e,n,t)}};function uf(){return cf().slots}function Kl(){return cf().attrs}function cf(e){const n=Qt();return n.setupContext||(n.setupContext=kf(n))}function ku(e){return Ne(e)?e.reduce((n,t)=>(n[t]=null,n),{}):e}function Yh(e,n){const t={};for(const r in e)n.includes(r)||Object.defineProperty(t,r,{enumerable:!0,get:()=>e[r]});return t}let Za=!0;function jh(e){const n=ff(e),t=e.proxy,r=e.ctx;Za=!1,n.beforeCreate&&Tu(n.beforeCreate,e,"bc");const{data:o,computed:s,methods:i,watch:a,provide:l,inject:c,created:d,beforeMount:f,mounted:h,beforeUpdate:p,updated:E,activated:b,deactivated:T,beforeDestroy:V,beforeUnmount:z,destroyed:x,unmounted:N,render:re,renderTracked:ie,renderTriggered:ae,errorCaptured:fe,serverPrefetch:le,expose:Z,inheritAttrs:ne,components:M,directives:q,filters:v}=n;if(c&&qh(c,r,null),i)for(const Y in i){const K=i[Y];Re(K)&&(r[Y]=K.bind(t))}if(o){const Y=o.call(t,t);Ze(Y)&&(e.data=Gn(Y))}if(Za=!0,s)for(const Y in s){const K=s[Y],j=Re(K)?K.bind(t,t):Re(K.get)?K.get.bind(t,t):st,J=!Re(K)&&Re(K.set)?K.set.bind(t):st,te=ue({get:j,set:J});Object.defineProperty(r,Y,{enumerable:!0,configurable:!0,get:()=>te.value,set:pe=>te.value=pe})}if(a)for(const Y in a)df(a[Y],r,t,Y);if(l){const Y=Re(l)?l.call(t):l;Reflect.ownKeys(Y).forEach(K=>{ut(K,Y[K])})}d&&Tu(d,e,"c");function w(Y,K){Ne(K)?K.forEach(j=>Y(j.bind(t))):K&&Y(K.bind(t))}if(w(tf,f),w(bn,h),w(Uh,p),w(Hh,E),w(Rh,b),w(Bh,T),w(Gh,fe),w(Wh,ie),w(Kh,ae),w(Cr,z),w(Ai,N),w(zh,le),Ne(Z))if(Z.length){const Y=e.exposed||(e.exposed={});Z.forEach(K=>{Object.defineProperty(Y,K,{get:()=>t[K],set:j=>t[K]=j,enumerable:!0})})}else e.exposed||(e.exposed={});re&&e.render===st&&(e.render=re),ne!=null&&(e.inheritAttrs=ne),M&&(e.components=M),q&&(e.directives=q),le&&Qd(e)}function qh(e,n,t=st){Ne(e)&&(e=Ja(e));for(const r in e){const o=e[r];let s;Ze(o)?"default"in o?s=Vn(o.from||r,o.default,!0):s=Vn(o.from||r):s=Vn(o),cn(s)?Object.defineProperty(n,r,{enumerable:!0,configurable:!0,get:()=>s.value,set:i=>s.value=i}):n[r]=s}}function Tu(e,n,t){lt(Ne(e)?e.map(r=>r.bind(n.proxy)):e.bind(n.proxy),n,t)}function df(e,n,t,r){let o=r.includes(".")?Zd(t,r):()=>t[r];if(an(e)){const s=n[e];Re(s)&&Be(o,s)}else if(Re(e))Be(o,e.bind(t));else if(Ze(e))if(Ne(e))e.forEach(s=>df(s,n,t,r));else{const s=Re(e.handler)?e.handler.bind(t):n[e.handler];Re(s)&&Be(o,s,e)}}function ff(e){const n=e.type,{mixins:t,extends:r}=n,{mixins:o,optionsCache:s,config:{optionMergeStrategies:i}}=e.appContext,a=s.get(n);let l;return a?l=a:!o.length&&!t&&!r?l=n:(l={},o.length&&o.forEach(c=>Qs(l,c,i,!0)),Qs(l,n,i)),Ze(n)&&s.set(n,l),l}function Qs(e,n,t,r=!1){const{mixins:o,extends:s}=n;s&&Qs(e,s,t,!0),o&&o.forEach(i=>Qs(e,i,t,!0));for(const i in n)if(!(r&&i==="expose")){const a=Zh[i]||t&&t[i];e[i]=a?a(e[i],n[i]):n[i]}return e}const Zh={data:Vu,props:Nu,emits:Nu,methods:ho,computed:ho,beforeCreate:En,created:En,beforeMount:En,mounted:En,beforeUpdate:En,updated:En,beforeDestroy:En,beforeUnmount:En,destroyed:En,unmounted:En,activated:En,deactivated:En,errorCaptured:En,serverPrefetch:En,components:ho,directives:ho,watch:Qh,provide:Vu,inject:Jh};function Vu(e,n){return n?e?function(){return gn(Re(e)?e.call(this,this):e,Re(n)?n.call(this,this):n)}:n:e}function Jh(e,n){return ho(Ja(e),Ja(n))}function Ja(e){if(Ne(e)){const n={};for(let t=0;t<e.length;t++)n[e[t]]=e[t];return n}return e}function En(e,n){return e?[...new Set([].concat(e,n))]:n}function ho(e,n){return e?gn(Object.create(null),e,n):n}function Nu(e,n){return e?Ne(e)&&Ne(n)?[...new Set([...e,...n])]:gn(Object.create(null),ku(e),ku(n??{})):n}function Qh(e,n){if(!e)return n;if(!n)return e;const t=gn(Object.create(null),e);for(const r in n)t[r]=En(e[r],n[r]);return t}function pf(){return{app:null,config:{isNativeTag:yd,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let e1=0;function n1(e,n){return function(r,o=null){Re(r)||(r=gn({},r)),o!=null&&!Ze(o)&&(o=null);const s=pf(),i=new WeakSet,a=[];let l=!1;const c=s.app={_uid:e1++,_component:r,_props:o,_container:null,_context:s,_instance:null,version:T1,get config(){return s.config},set config(d){},use(d,...f){return i.has(d)||(d&&Re(d.install)?(i.add(d),d.install(c,...f)):Re(d)&&(i.add(d),d(c,...f))),c},mixin(d){return s.mixins.includes(d)||s.mixins.push(d),c},component(d,f){return f?(s.components[d]=f,c):s.components[d]},directive(d,f){return f?(s.directives[d]=f,c):s.directives[d]},mount(d,f,h){if(!l){const p=c._ceVNode||Ke(r,o);return p.appContext=s,h===!0?h="svg":h===!1&&(h=void 0),e(p,d,h),l=!0,c._container=d,d.__vue_app__=c,Ri(p.component)}},onUnmount(d){a.push(d)},unmount(){l&&(lt(a,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(d,f){return s.provides[d]=f,c},runWithContext(d){const f=Nr;Nr=c;try{return d()}finally{Nr=f}}};return c}}let Nr=null;const t1=(e,n)=>n==="modelValue"||n==="model-value"?e.modelModifiers:e[`${n}Modifiers`]||e[`${xn(n)}Modifiers`]||e[`${Jt(n)}Modifiers`];function r1(e,n,...t){if(e.isUnmounted)return;const r=e.vnode.props||en;let o=t;const s=n.startsWith("update:"),i=s&&t1(r,n.slice(7));i&&(i.trim&&(o=t.map(d=>an(d)?d.trim():d)),i.number&&(o=t.map(xi)));let a,l=r[a=da(n)]||r[a=da(xn(n))];!l&&s&&(l=r[a=da(Jt(n))]),l&&lt(l,e,6,o);const c=r[a+"Once"];if(c){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,lt(c,e,6,o)}}const o1=new WeakMap;function hf(e,n,t=!1){const r=t?o1:n.emitsCache,o=r.get(e);if(o!==void 0)return o;const s=e.emits;let i={},a=!1;if(!Re(e)){const l=c=>{const d=hf(c,n,!0);d&&(a=!0,gn(i,d))};!t&&n.mixins.length&&n.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!s&&!a?(Ze(e)&&r.set(e,null),null):(Ne(s)?s.forEach(l=>i[l]=null):gn(i,s),Ze(e)&&r.set(e,i),i)}function Fi(e,n){return!e||!Ei(n)?!1:(n=n.slice(2).replace(/Once$/,""),je(e,n[0].toLowerCase()+n.slice(1))||je(e,Jt(n))||je(e,n))}function Au(e){const{type:n,vnode:t,proxy:r,withProxy:o,propsOptions:[s],slots:i,attrs:a,emit:l,render:c,renderCache:d,props:f,data:h,setupState:p,ctx:E,inheritAttrs:b}=e,T=Zs(e);let V,z;try{if(t.shapeFlag&4){const N=o||r,re=N;V=nt(c.call(re,N,d,f,p,h,E)),z=a}else{const N=n;V=nt(N.length>1?N(f,{attrs:a,slots:i,emit:l}):N(f,null)),z=n.props?a:s1(a)}}catch(N){xo.length=0,Vi(N,e,1),V=Ke(Mt)}let x=V;if(z&&b!==!1){const N=Object.keys(z),{shapeFlag:re}=x;N.length&&re&7&&(s&&N.some(wi)&&(z=i1(z,s)),x=Ur(x,z,!1,!0))}return t.dirs&&(x=Ur(x,null,!1,!0),x.dirs=x.dirs?x.dirs.concat(t.dirs):t.dirs),t.transition&&zl(x,t.transition),V=x,Zs(T),V}const s1=e=>{let n;for(const t in e)(t==="class"||t==="style"||Ei(t))&&((n||(n={}))[t]=e[t]);return n},i1=(e,n)=>{const t={};for(const r in e)(!wi(r)||!(r.slice(9)in n))&&(t[r]=e[r]);return t};function a1(e,n,t){const{props:r,children:o,component:s}=e,{props:i,children:a,patchFlag:l}=n,c=s.emitsOptions;if(n.dirs||n.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return r?Fu(r,i,c):!!i;if(l&8){const d=n.dynamicProps;for(let f=0;f<d.length;f++){const h=d[f];if(vf(i,r,h)&&!Fi(c,h))return!0}}}else return(o||a)&&(!a||!a.$stable)?!0:r===i?!1:r?i?Fu(r,i,c):!0:!!i;return!1}function Fu(e,n,t){const r=Object.keys(n);if(r.length!==Object.keys(e).length)return!0;for(let o=0;o<r.length;o++){const s=r[o];if(vf(n,e,s)&&!Fi(t,s))return!0}return!1}function vf(e,n,t){const r=e[t],o=n[t];return t==="style"&&Ze(r)&&Ze(o)?!qr(r,o):r!==o}function l1({vnode:e,parent:n,suspense:t},r){for(;n;){const o=n.subTree;if(o.suspense&&o.suspense.activeBranch===e&&(o.suspense.vnode.el=o.el=r,e=o),o===e)(e=n.vnode).el=r,n=n.parent;else break}t&&t.activeBranch===e&&(t.vnode.el=r)}const mf={},_f=()=>Object.create(mf),gf=e=>Object.getPrototypeOf(e)===mf;function u1(e,n,t,r=!1){const o={},s=_f();e.propsDefaults=Object.create(null),yf(e,n,o,s);for(const i in e.propsOptions[0])i in o||(o[i]=void 0);t?e.props=r?o:ph(o):e.type.props?e.props=o:e.props=s,e.attrs=s}function c1(e,n,t,r){const{props:o,attrs:s,vnode:{patchFlag:i}}=e,a=Xe(o),[l]=e.propsOptions;let c=!1;if((r||i>0)&&!(i&16)){if(i&8){const d=e.vnode.dynamicProps;for(let f=0;f<d.length;f++){let h=d[f];if(Fi(e.emitsOptions,h))continue;const p=n[h];if(l)if(je(s,h))p!==s[h]&&(s[h]=p,c=!0);else{const E=xn(h);o[E]=Qa(l,a,E,p,e,!1)}else p!==s[h]&&(s[h]=p,c=!0)}}}else{yf(e,n,o,s)&&(c=!0);let d;for(const f in a)(!n||!je(n,f)&&((d=Jt(f))===f||!je(n,d)))&&(l?t&&(t[f]!==void 0||t[d]!==void 0)&&(o[f]=Qa(l,a,f,void 0,e,!0)):delete o[f]);if(s!==a)for(const f in s)(!n||!je(n,f))&&(delete s[f],c=!0)}c&&Ct(e.attrs,"set","")}function yf(e,n,t,r){const[o,s]=e.propsOptions;let i=!1,a;if(n)for(let l in n){if(Eo(l))continue;const c=n[l];let d;o&&je(o,d=xn(l))?!s||!s.includes(d)?t[d]=c:(a||(a={}))[d]=c:Fi(e.emitsOptions,l)||(!(l in r)||c!==r[l])&&(r[l]=c,i=!0)}if(s){const l=Xe(t),c=a||en;for(let d=0;d<s.length;d++){const f=s[d];t[f]=Qa(o,l,f,c[f],e,!je(c,f))}}return i}function Qa(e,n,t,r,o,s){const i=e[t];if(i!=null){const a=je(i,"default");if(a&&r===void 0){const l=i.default;if(i.type!==Function&&!i.skipFactory&&Re(l)){const{propsDefaults:c}=o;if(t in c)r=c[t];else{const d=ns(o);r=c[t]=l.call(null,n),d()}}else r=l;o.ce&&o.ce._setProp(t,r)}i[0]&&(s&&!a?r=!1:i[1]&&(r===""||r===Jt(t))&&(r=!0))}return r}const d1=new WeakMap;function Cf(e,n,t=!1){const r=t?d1:n.propsCache,o=r.get(e);if(o)return o;const s=e.props,i={},a=[];let l=!1;if(!Re(e)){const d=f=>{l=!0;const[h,p]=Cf(f,n,!0);gn(i,h),p&&a.push(...p)};!t&&n.mixins.length&&n.mixins.forEach(d),e.extends&&d(e.extends),e.mixins&&e.mixins.forEach(d)}if(!s&&!l)return Ze(e)&&r.set(e,Mr),Mr;if(Ne(s))for(let d=0;d<s.length;d++){const f=xn(s[d]);Ou(f)&&(i[f]=en)}else if(s)for(const d in s){const f=xn(d);if(Ou(f)){const h=s[d],p=i[f]=Ne(h)||Re(h)?{type:h}:gn({},h),E=p.type;let b=!1,T=!0;if(Ne(E))for(let V=0;V<E.length;++V){const z=E[V],x=Re(z)&&z.name;if(x==="Boolean"){b=!0;break}else x==="String"&&(T=!1)}else b=Re(E)&&E.name==="Boolean";p[0]=b,p[1]=T,(b||je(p,"default"))&&a.push(f)}}const c=[i,a];return Ze(e)&&r.set(e,c),c}function Ou(e){return e[0]!=="$"&&!Eo(e)}const Wl=e=>e==="_"||e==="_ctx"||e==="$stable",Gl=e=>Ne(e)?e.map(nt):[nt(e)],f1=(e,n,t)=>{if(n._n)return n;const r=Un((...o)=>Gl(n(...o)),t);return r._c=!1,r},Sf=(e,n,t)=>{const r=e._ctx;for(const o in e){if(Wl(o))continue;const s=e[o];if(Re(s))n[o]=f1(o,s,r);else if(s!=null){const i=Gl(s);n[o]=()=>i}}},bf=(e,n)=>{const t=Gl(n);e.slots.default=()=>t},Ef=(e,n,t)=>{for(const r in n)(t||!Wl(r))&&(e[r]=n[r])},p1=(e,n,t)=>{const r=e.slots=_f();if(e.vnode.shapeFlag&32){const o=n._;o?(Ef(r,n,t),t&&Ed(r,"_",o,!0)):Sf(n,r)}else n&&bf(e,n)},h1=(e,n,t)=>{const{vnode:r,slots:o}=e;let s=!0,i=en;if(r.shapeFlag&32){const a=n._;a?t&&a===1?s=!1:Ef(o,n,t):(s=!n.$stable,Sf(n,o)),i=n}else n&&(bf(e,n),i={default:1});if(s)for(const a in o)!Wl(a)&&i[a]==null&&delete o[a]},wn=y1;function v1(e){return m1(e)}function m1(e,n){const t=Di();t.__VUE__=!0;const{insert:r,remove:o,patchProp:s,createElement:i,createText:a,createComment:l,setText:c,setElementText:d,parentNode:f,nextSibling:h,setScopeId:p=st,insertStaticContent:E}=e,b=(m,F,g,S=null,P=null,A=null,L=void 0,se=null,O=!!F.dynamicChildren)=>{if(m===F)return;m&&!ro(m,F)&&(S=be(m),pe(m,P,A,!0),m=null),F.patchFlag===-2&&(O=!1,F.dynamicChildren=null);const{type:_,ref:B,shapeFlag:ee}=F;switch(_){case Oi:T(m,F,g,S);break;case Mt:V(m,F,g,S);break;case Ts:m==null&&z(F,g,S,L);break;case he:M(m,F,g,S,P,A,L,se,O);break;default:ee&1?re(m,F,g,S,P,A,L,se,O):ee&6?q(m,F,g,S,P,A,L,se,O):(ee&64||ee&128)&&_.process(m,F,g,S,P,A,L,se,O,ke)}B!=null&&P?Po(B,m&&m.ref,A,F||m,!F):B==null&&m&&m.ref!=null&&Po(m.ref,null,A,m,!0)},T=(m,F,g,S)=>{if(m==null)r(F.el=a(F.children),g,S);else{const P=F.el=m.el;F.children!==m.children&&c(P,F.children)}},V=(m,F,g,S)=>{m==null?r(F.el=l(F.children||""),g,S):F.el=m.el},z=(m,F,g,S)=>{[m.el,m.anchor]=E(m.children,F,g,S,m.el,m.anchor)},x=({el:m,anchor:F},g,S)=>{let P;for(;m&&m!==F;)P=h(m),r(m,g,S),m=P;r(F,g,S)},N=({el:m,anchor:F})=>{let g;for(;m&&m!==F;)g=h(m),o(m),m=g;o(F)},re=(m,F,g,S,P,A,L,se,O)=>{if(F.type==="svg"?L="svg":F.type==="math"&&(L="mathml"),m==null)ie(F,g,S,P,A,L,se,O);else{const _=m.el&&m.el._isVueCE?m.el:null;try{_&&_._beginPatch(),le(m,F,P,A,L,se,O)}finally{_&&_._endPatch()}}},ie=(m,F,g,S,P,A,L,se)=>{let O,_;const{props:B,shapeFlag:ee,transition:U,dirs:D}=m;if(O=m.el=i(m.type,A,B&&B.is,B),ee&8?d(O,m.children):ee&16&&fe(m.children,O,null,S,P,_a(m,A),L,se),D&&tr(m,null,S,"created"),ae(O,m,m.scopeId,L,S),B){for(const R in B)R!=="value"&&!Eo(R)&&s(O,R,null,B[R],A,S);"value"in B&&s(O,"value",null,B.value,A),(_=B.onVnodeBeforeMount)&&qn(_,S,m)}D&&tr(m,null,S,"beforeMount");const W=_1(P,U);W&&U.beforeEnter(O),r(O,F,g),((_=B&&B.onVnodeMounted)||W||D)&&wn(()=>{try{_&&qn(_,S,m),W&&U.enter(O),D&&tr(m,null,S,"mounted")}finally{}},P)},ae=(m,F,g,S,P)=>{if(g&&p(m,g),S)for(let A=0;A<S.length;A++)p(m,S[A]);if(P){let A=P.subTree;if(F===A||Pf(A.type)&&(A.ssContent===F||A.ssFallback===F)){const L=P.vnode;ae(m,L,L.scopeId,L.slotScopeIds,P.parent)}}},fe=(m,F,g,S,P,A,L,se,O=0)=>{for(let _=O;_<m.length;_++){const B=m[_]=se?yt(m[_]):nt(m[_]);b(null,B,F,g,S,P,A,L,se)}},le=(m,F,g,S,P,A,L)=>{const se=F.el=m.el;let{patchFlag:O,dynamicChildren:_,dirs:B}=F;O|=m.patchFlag&16;const ee=m.props||en,U=F.props||en;let D;if(g&&or(g,!1),(D=U.onVnodeBeforeUpdate)&&qn(D,g,F,m),B&&tr(F,m,g,"beforeUpdate"),g&&or(g,!0),(ee.innerHTML&&U.innerHTML==null||ee.textContent&&U.textContent==null)&&d(se,""),_?Z(m.dynamicChildren,_,se,g,S,_a(F,P),A):L||K(m,F,se,null,g,S,_a(F,P),A,!1),O>0){if(O&16)ne(se,ee,U,g,P);else if(O&2&&ee.class!==U.class&&s(se,"class",null,U.class,P),O&4&&s(se,"style",ee.style,U.style,P),O&8){const W=F.dynamicProps;for(let R=0;R<W.length;R++){const k=W[R],oe=ee[k],ce=U[k];(ce!==oe||k==="value")&&s(se,k,oe,ce,P,g)}}O&1&&m.children!==F.children&&d(se,F.children)}else!L&&_==null&&ne(se,ee,U,g,P);((D=U.onVnodeUpdated)||B)&&wn(()=>{D&&qn(D,g,F,m),B&&tr(F,m,g,"updated")},S)},Z=(m,F,g,S,P,A,L)=>{for(let se=0;se<F.length;se++){const O=m[se],_=F[se],B=O.el&&(O.type===he||!ro(O,_)||O.shapeFlag&198)?f(O.el):g;b(O,_,B,null,S,P,A,L,!0)}},ne=(m,F,g,S,P)=>{if(F!==g){if(F!==en)for(const A in F)!Eo(A)&&!(A in g)&&s(m,A,F[A],null,P,S);for(const A in g){if(Eo(A))continue;const L=g[A],se=F[A];L!==se&&A!=="value"&&s(m,A,se,L,P,S)}"value"in g&&s(m,"value",F.value,g.value,P)}},M=(m,F,g,S,P,A,L,se,O)=>{const _=F.el=m?m.el:a(""),B=F.anchor=m?m.anchor:a("");let{patchFlag:ee,dynamicChildren:U,slotScopeIds:D}=F;D&&(se=se?se.concat(D):D),m==null?(r(_,g,S),r(B,g,S),fe(F.children||[],g,B,P,A,L,se,O)):ee>0&&ee&64&&U&&m.dynamicChildren&&m.dynamicChildren.length===U.length?(Z(m.dynamicChildren,U,g,P,A,L,se),(F.key!=null||P&&F===P.subTree)&&Xl(m,F,!0)):K(m,F,g,B,P,A,L,se,O)},q=(m,F,g,S,P,A,L,se,O)=>{F.slotScopeIds=se,m==null?F.shapeFlag&512?P.ctx.activate(F,g,S,L,O):v(F,g,S,P,A,L,O):X(m,F,O)},v=(m,F,g,S,P,A,L)=>{const se=m.component=I1(m,S,P);if(ef(m)&&(se.ctx.renderer=ke),P1(se,!1,L),se.asyncDep){if(P&&P.registerDep(se,w,L),!m.el){const O=se.subTree=Ke(Mt);V(null,O,F,g),m.placeholder=O.el}}else w(se,m,F,g,P,A,L)},X=(m,F,g)=>{const S=F.component=m.component;if(a1(m,F,g))if(S.asyncDep&&!S.asyncResolved){Y(S,F,g);return}else S.next=F,S.update();else F.el=m.el,S.vnode=F},w=(m,F,g,S,P,A,L)=>{const se=()=>{if(m.isMounted){let{next:ee,bu:U,u:D,parent:W,vnode:R}=m;{const Ae=wf(m);if(Ae){ee&&(ee.el=R.el,Y(m,ee,L)),Ae.asyncDep.then(()=>{wn(()=>{m.isUnmounted||_()},P)});return}}let k=ee,oe;or(m,!1),ee?(ee.el=R.el,Y(m,ee,L)):ee=R,U&&Ms(U),(oe=ee.props&&ee.props.onVnodeBeforeUpdate)&&qn(oe,W,ee,R),or(m,!0);const ce=Au(m),Ie=m.subTree;m.subTree=ce,b(Ie,ce,f(Ie.el),be(Ie),m,P,A),ee.el=ce.el,k===null&&l1(m,ce.el),D&&wn(D,P),(oe=ee.props&&ee.props.onVnodeUpdated)&&wn(()=>qn(oe,W,ee,R),P)}else{let ee;const{el:U,props:D}=F,{bm:W,m:R,parent:k,root:oe,type:ce}=m,Ie=Vr(F);or(m,!1),W&&Ms(W),!Ie&&(ee=D&&D.onVnodeBeforeMount)&&qn(ee,k,F),or(m,!0);{oe.ce&&oe.ce._hasShadowRoot()&&oe.ce._injectChildStyle(ce,m.parent?m.parent.type:void 0);const Ae=m.subTree=Au(m);b(null,Ae,g,S,m,P,A),F.el=Ae.el}if(R&&wn(R,P),!Ie&&(ee=D&&D.onVnodeMounted)){const Ae=F;wn(()=>qn(ee,k,Ae),P)}(F.shapeFlag&256||k&&Vr(k.vnode)&&k.vnode.shapeFlag&256)&&m.a&&wn(m.a,P),m.isMounted=!0,F=g=S=null}};m.scope.on();const O=m.effect=new Dd(se);m.scope.off();const _=m.update=O.run.bind(O),B=m.job=O.runIfDirty.bind(O);B.i=m,B.id=m.uid,O.scheduler=()=>Ul(B),or(m,!0),_()},Y=(m,F,g)=>{F.component=m;const S=m.vnode.props;m.vnode=F,m.next=null,c1(m,F.props,S,g),h1(m,F.children,g),$t(),Iu(m),xt()},K=(m,F,g,S,P,A,L,se,O=!1)=>{const _=m&&m.children,B=m?m.shapeFlag:0,ee=F.children,{patchFlag:U,shapeFlag:D}=F;if(U>0){if(U&128){J(_,ee,g,S,P,A,L,se,O);return}else if(U&256){j(_,ee,g,S,P,A,L,se,O);return}}D&8?(B&16&&Se(_,P,A),ee!==_&&d(g,ee)):B&16?D&16?J(_,ee,g,S,P,A,L,se,O):Se(_,P,A,!0):(B&8&&d(g,""),D&16&&fe(ee,g,S,P,A,L,se,O))},j=(m,F,g,S,P,A,L,se,O)=>{m=m||Mr,F=F||Mr;const _=m.length,B=F.length,ee=Math.min(_,B);let U;for(U=0;U<ee;U++){const D=F[U]=O?yt(F[U]):nt(F[U]);b(m[U],D,g,null,P,A,L,se,O)}_>B?Se(m,P,A,!0,!1,ee):fe(F,g,S,P,A,L,se,O,ee)},J=(m,F,g,S,P,A,L,se,O)=>{let _=0;const B=F.length;let ee=m.length-1,U=B-1;for(;_<=ee&&_<=U;){const D=m[_],W=F[_]=O?yt(F[_]):nt(F[_]);if(ro(D,W))b(D,W,g,null,P,A,L,se,O);else break;_++}for(;_<=ee&&_<=U;){const D=m[ee],W=F[U]=O?yt(F[U]):nt(F[U]);if(ro(D,W))b(D,W,g,null,P,A,L,se,O);else break;ee--,U--}if(_>ee){if(_<=U){const D=U+1,W=D<B?F[D].el:S;for(;_<=U;)b(null,F[_]=O?yt(F[_]):nt(F[_]),g,W,P,A,L,se,O),_++}}else if(_>U)for(;_<=ee;)pe(m[_],P,A,!0),_++;else{const D=_,W=_,R=new Map;for(_=W;_<=U;_++){const rn=F[_]=O?yt(F[_]):nt(F[_]);rn.key!=null&&R.set(rn.key,_)}let k,oe=0;const ce=U-W+1;let Ie=!1,Ae=0;const $e=new Array(ce);for(_=0;_<ce;_++)$e[_]=0;for(_=D;_<=ee;_++){const rn=m[_];if(oe>=ce){pe(rn,P,A,!0);continue}let on;if(rn.key!=null)on=R.get(rn.key);else for(k=W;k<=U;k++)if($e[k-W]===0&&ro(rn,F[k])){on=k;break}on===void 0?pe(rn,P,A,!0):($e[on-W]=_+1,on>=Ae?Ae=on:Ie=!0,b(rn,F[on],g,null,P,A,L,se,O),oe++)}const ze=Ie?g1($e):Mr;for(k=ze.length-1,_=ce-1;_>=0;_--){const rn=W+_,on=F[rn],Jr=F[rn+1],Nt=rn+1<B?Jr.el||If(Jr):S;$e[_]===0?b(null,on,g,Nt,P,A,L,se,O):Ie&&(k<0||_!==ze[k]?te(on,g,Nt,2):k--)}}},te=(m,F,g,S,P=null)=>{const{el:A,type:L,transition:se,children:O,shapeFlag:_}=m;if(_&6){te(m.component.subTree,F,g,S);return}if(_&128){m.suspense.move(F,g,S);return}if(_&64){L.move(m,F,g,ke);return}if(L===he){r(A,F,g);for(let ee=0;ee<O.length;ee++)te(O[ee],F,g,S);r(m.anchor,F,g);return}if(L===Ts){x(m,F,g);return}if(S!==2&&_&1&&se)if(S===0)se.beforeEnter(A),r(A,F,g),wn(()=>se.enter(A),P);else{const{leave:ee,delayLeave:U,afterLeave:D}=se,W=()=>{m.ctx.isUnmounted?o(A):r(A,F,g)},R=()=>{A._isLeaving&&A[Oh](!0),ee(A,()=>{W(),D&&D()})};U?U(A,W,R):R()}else r(A,F,g)},pe=(m,F,g,S=!1,P=!1)=>{const{type:A,props:L,ref:se,children:O,dynamicChildren:_,shapeFlag:B,patchFlag:ee,dirs:U,cacheIndex:D,memo:W}=m;if(ee===-2&&(P=!1),se!=null&&($t(),Po(se,null,g,m,!0),xt()),D!=null&&(F.renderCache[D]=void 0),B&256){F.ctx.deactivate(m);return}const R=B&1&&U,k=!Vr(m);let oe;if(k&&(oe=L&&L.onVnodeBeforeUnmount)&&qn(oe,F,m),B&6)_e(m.component,g,S);else{if(B&128){m.suspense.unmount(g,S);return}R&&tr(m,null,F,"beforeUnmount"),B&64?m.type.remove(m,F,g,ke,S):_&&!_.hasOnce&&(A!==he||ee>0&&ee&64)?Se(_,F,g,!1,!0):(A===he&&ee&384||!P&&B&16)&&Se(O,F,g),S&&ye(m)}const ce=W!=null&&D==null;(k&&(oe=L&&L.onVnodeUnmounted)||R||ce)&&wn(()=>{oe&&qn(oe,F,m),R&&tr(m,null,F,"unmounted"),ce&&(m.el=null)},g)},ye=m=>{const{type:F,el:g,anchor:S,transition:P}=m;if(F===he){ge(g,S);return}if(F===Ts){N(m);return}const A=()=>{o(g),P&&!P.persisted&&P.afterLeave&&P.afterLeave()};if(m.shapeFlag&1&&P&&!P.persisted){const{leave:L,delayLeave:se}=P,O=()=>L(g,A);se?se(m.el,A,O):O()}else A()},ge=(m,F)=>{let g;for(;m!==F;)g=h(m),o(m),m=g;o(F)},_e=(m,F,g)=>{const{bum:S,scope:P,job:A,subTree:L,um:se,m:O,a:_}=m;Ru(O),Ru(_),S&&Ms(S),P.stop(),A&&(A.flags|=8,pe(L,m,F,g)),se&&wn(se,F),wn(()=>{m.isUnmounted=!0},F)},Se=(m,F,g,S=!1,P=!1,A=0)=>{for(let L=A;L<m.length;L++)pe(m[L],F,g,S,P)},be=m=>{if(m.shapeFlag&6)return be(m.component.subTree);if(m.shapeFlag&128)return m.suspense.next();const F=h(m.anchor||m.el),g=F&&F[Jd];return g?h(g):F};let Me=!1;const Oe=(m,F,g)=>{let S;m==null?F._vnode&&(pe(F._vnode,null,null,!0),S=F._vnode.component):b(F._vnode||null,m,F,null,null,null,g),F._vnode=m,Me||(Me=!0,Iu(S),Yd(),Me=!1)},ke={p:b,um:pe,m:te,r:ye,mt:v,mc:fe,pc:K,pbc:Z,n:be,o:e};return{render:Oe,hydrate:void 0,createApp:n1(Oe)}}function _a({type:e,props:n},t){return t==="svg"&&e==="foreignObject"||t==="mathml"&&e==="annotation-xml"&&n&&n.encoding&&n.encoding.includes("html")?void 0:t}function or({effect:e,job:n},t){t?(e.flags|=32,n.flags|=4):(e.flags&=-33,n.flags&=-5)}function _1(e,n){return(!e||e&&!e.pendingBranch)&&n&&!n.persisted}function Xl(e,n,t=!1){const r=e.children,o=n.children;if(Ne(r)&&Ne(o))for(let s=0;s<r.length;s++){const i=r[s];let a=o[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=o[s]=yt(o[s]),a.el=i.el),!t&&a.patchFlag!==-2&&Xl(i,a)),a.type===Oi&&(a.patchFlag===-1&&(a=o[s]=yt(a)),a.el=i.el),a.type===Mt&&!a.el&&(a.el=i.el)}}function g1(e){const n=e.slice(),t=[0];let r,o,s,i,a;const l=e.length;for(r=0;r<l;r++){const c=e[r];if(c!==0){if(o=t[t.length-1],e[o]<c){n[r]=o,t.push(r);continue}for(s=0,i=t.length-1;s<i;)a=s+i>>1,e[t[a]]<c?s=a+1:i=a;c<e[t[s]]&&(s>0&&(n[r]=t[s-1]),t[s]=r)}}for(s=t.length,i=t[s-1];s-- >0;)t[s]=i,i=n[i];return t}function wf(e){const n=e.subTree.component;if(n)return n.asyncDep&&!n.asyncResolved?n:wf(n)}function Ru(e){if(e)for(let n=0;n<e.length;n++)e[n].flags|=8}function If(e){if(e.placeholder)return e.placeholder;const n=e.component;return n?If(n.subTree):null}const Pf=e=>e.__isSuspense;function y1(e,n){n&&n.pendingBranch?Ne(e)?n.effects.push(...e):n.effects.push(e):$h(e)}const he=Symbol.for("v-fgt"),Oi=Symbol.for("v-txt"),Mt=Symbol.for("v-cmt"),Ts=Symbol.for("v-stc"),xo=[];let $n=null;function C(e=!1){xo.push($n=e?null:[])}function C1(){xo.pop(),$n=xo[xo.length-1]||null}let Lr=1;function ei(e,n=!1){Lr+=e,e<0&&$n&&n&&($n.hasOnce=!0)}function $f(e){return e.dynamicChildren=Lr>0?$n||Mr:null,C1(),Lr>0&&$n&&$n.push(e),e}function I(e,n,t,r,o,s){return $f(u(e,n,t,r,o,s,!0))}function Je(e,n,t,r,o){return $f(Ke(e,n,t,r,o,!0))}function Fo(e){return e?e.__v_isVNode===!0:!1}function ro(e,n){return e.type===n.type&&e.key===n.key}const xf=({key:e})=>e??null,Vs=({ref:e,ref_key:n,ref_for:t})=>(typeof e=="number"&&(e=""+e),e!=null?an(e)||cn(e)||Re(e)?{i:_n,r:e,k:n,f:!!t}:e:null);function u(e,n=null,t=null,r=0,o=null,s=e===he?0:1,i=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:n,key:n&&xf(n),ref:n&&Vs(n),scopeId:qd,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:r,dynamicProps:o,dynamicChildren:null,appContext:null,ctx:_n};return a?(jl(l,t),s&128&&e.normalize(l)):t&&(l.shapeFlag|=an(t)?8:16),Lr>0&&!i&&$n&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&$n.push(l),l}const Ke=S1;function S1(e,n=null,t=null,r=0,o=null,s=!1){if((!e||e===sf)&&(e=Mt),Fo(e)){const a=Ur(e,n,!0);return t&&jl(a,t),Lr>0&&!s&&$n&&(a.shapeFlag&6?$n[$n.indexOf(e)]=a:$n.push(a)),a.patchFlag=-2,a}if(M1(e)&&(e=e.__vccOpts),n){n=b1(n);let{class:a,style:l}=n;a&&!an(a)&&(n.class=ve(a)),Ze(l)&&(Ti(l)&&!Ne(l)&&(l=gn({},l)),n.style=Fe(l))}const i=an(e)?1:Pf(e)?128:Th(e)?64:Ze(e)?4:Re(e)?2:0;return u(e,n,t,r,o,i,s,!0)}function b1(e){return e?Ti(e)||gf(e)?gn({},e):e:null}function Ur(e,n,t=!1,r=!1){const{props:o,ref:s,patchFlag:i,children:a,transition:l}=e,c=n?Oo(o||{},n):o,d={__v_isVNode:!0,__v_skip:!0,type:e.type,props:c,key:c&&xf(c),ref:n&&n.ref?t&&s?Ne(s)?s.concat(Vs(n)):[s,Vs(n)]:Vs(n):s,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:n&&e.type!==he?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Ur(e.ssContent),ssFallback:e.ssFallback&&Ur(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&r&&zl(d,l.clone(d)),d}function we(e=" ",n=0){return Ke(Oi,null,e,n)}function Yl(e,n){const t=Ke(Ts,null,e);return t.staticCount=n,t}function me(e="",n=!1){return n?(C(),Je(Mt,null,e)):Ke(Mt,null,e)}function nt(e){return e==null||typeof e=="boolean"?Ke(Mt):Ne(e)?Ke(he,null,e.slice()):Fo(e)?yt(e):Ke(Oi,null,String(e))}function yt(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Ur(e)}function jl(e,n){let t=0;const{shapeFlag:r}=e;if(n==null)n=null;else if(Ne(n))t=16;else if(typeof n=="object")if(r&65){const o=n.default;o&&(o._c&&(o._d=!1),jl(e,o()),o._c&&(o._d=!0));return}else{t=32;const o=n._;!o&&!gf(n)?n._ctx=_n:o===3&&_n&&(_n.slots._===1?n._=1:(n._=2,e.patchFlag|=1024))}else Re(n)?(n={default:n,_ctx:_n},t=32):(n=String(n),r&64?(t=16,n=[we(n)]):t=8);e.children=n,e.shapeFlag|=t}function Oo(...e){const n={};for(let t=0;t<e.length;t++){const r=e[t];for(const o in r)if(o==="class")n.class!==r.class&&(n.class=ve([n.class,r.class]));else if(o==="style")n.style=Fe([n.style,r.style]);else if(Ei(o)){const s=n[o],i=r[o];i&&s!==i&&!(Ne(s)&&s.includes(i))?n[o]=s?[].concat(s,i):i:i==null&&s==null&&!wi(o)&&(n[o]=i)}else o!==""&&(n[o]=r[o])}return n}function qn(e,n,t,r=null){lt(e,n,7,[t,r])}const E1=pf();let w1=0;function I1(e,n,t){const r=e.type,o=(n?n.appContext:e.appContext)||E1,s={uid:w1++,vnode:e,type:r,parent:n,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new $d(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(o.provides),ids:n?n.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Cf(r,o),emitsOptions:hf(r,o),emit:null,emitted:null,propsDefaults:en,inheritAttrs:r.inheritAttrs,ctx:en,data:en,props:en,attrs:en,slots:en,refs:en,setupState:en,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=n?n.root:s,s.emit=r1.bind(null,s),e.ce&&e.ce(s),s}let Sn=null;const Qt=()=>Sn||_n;let ni,el;{const e=Di(),n=(t,r)=>{let o;return(o=e[t])||(o=e[t]=[]),o.push(r),s=>{o.length>1?o.forEach(i=>i(s)):o[0](s)}};ni=n("__VUE_INSTANCE_SETTERS__",t=>Sn=t),el=n("__VUE_SSR_SETTERS__",t=>Ro=t)}const ns=e=>{const n=Sn;return ni(e),e.scope.on(),()=>{e.scope.off(),ni(n)}},Bu=()=>{Sn&&Sn.scope.off(),ni(null)};function Df(e){return e.vnode.shapeFlag&4}let Ro=!1;function P1(e,n=!1,t=!1){n&&el(n);const{props:r,children:o}=e.vnode,s=Df(e);u1(e,r,s,n),p1(e,o,t||n);const i=s?$1(e,n):void 0;return n&&el(!1),i}function $1(e,n){const t=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Xh);const{setup:r}=t;if(r){$t();const o=e.setupContext=r.length>1?kf(e):null,s=ns(e),i=es(r,e,0,[e.props,o]),a=Cd(i);if(xt(),s(),(a||e.sp)&&!Vr(e)&&Qd(e),a){if(i.then(Bu,Bu),n)return i.then(l=>{Lu(e,l)}).catch(l=>{Vi(l,e,0)});e.asyncDep=i}else Lu(e,i)}else Mf(e)}function Lu(e,n,t){Re(n)?e.type.__ssrInlineRender?e.ssrRender=n:e.render=n:Ze(n)&&(e.setupState=Kd(n)),Mf(e)}function Mf(e,n,t){const r=e.type;e.render||(e.render=r.render||st);{const o=ns(e);$t();try{jh(e)}finally{xt(),o()}}}const x1={get(e,n){return Cn(e,"get",""),e[n]}};function kf(e){const n=t=>{e.exposed=t||{}};return{attrs:new Proxy(e.attrs,x1),slots:e.slots,emit:e.emit,expose:n}}function Ri(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Kd(It(e.exposed)),{get(n,t){if(t in n)return n[t];if(t in $o)return $o[t](e)},has(n,t){return t in n||t in $o}})):e.proxy}function D1(e,n=!0){return Re(e)?e.displayName||e.name:e.name||n&&e.__name}function M1(e){return Re(e)&&"__vccOpts"in e}const ue=(e,n)=>bh(e,n,Ro);function qe(e,n,t){try{ei(-1);const r=arguments.length;return r===2?Ze(n)&&!Ne(n)?Fo(n)?Ke(e,null,[n]):Ke(e,n):Ke(e,null,n):(r>3?t=Array.prototype.slice.call(arguments,2):r===3&&Fo(t)&&(t=[t]),Ke(e,n,t))}finally{ei(1)}}function k1(e,n){const t=e.memo;if(t.length!=n.length)return!1;for(let r=0;r<t.length;r++)if(Ln(t[r],n[r]))return!1;return Lr>0&&$n&&$n.push(e),!0}const T1="3.5.32";/**
* @vue/runtime-dom v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let nl;const Uu=typeof window<"u"&&window.trustedTypes;if(Uu)try{nl=Uu.createPolicy("vue",{createHTML:e=>e})}catch{}const Tf=nl?e=>nl.createHTML(e):e=>e,V1="http://www.w3.org/2000/svg",N1="http://www.w3.org/1998/Math/MathML",gt=typeof document<"u"?document:null,Hu=gt&&gt.createElement("template"),A1={insert:(e,n,t)=>{n.insertBefore(e,t||null)},remove:e=>{const n=e.parentNode;n&&n.removeChild(e)},createElement:(e,n,t,r)=>{const o=n==="svg"?gt.createElementNS(V1,e):n==="mathml"?gt.createElementNS(N1,e):t?gt.createElement(e,{is:t}):gt.createElement(e);return e==="select"&&r&&r.multiple!=null&&o.setAttribute("multiple",r.multiple),o},createText:e=>gt.createTextNode(e),createComment:e=>gt.createComment(e),setText:(e,n)=>{e.nodeValue=n},setElementText:(e,n)=>{e.textContent=n},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>gt.querySelector(e),setScopeId(e,n){e.setAttribute(n,"")},insertStaticContent(e,n,t,r,o,s){const i=t?t.previousSibling:n.lastChild;if(o&&(o===s||o.nextSibling))for(;n.insertBefore(o.cloneNode(!0),t),!(o===s||!(o=o.nextSibling)););else{Hu.innerHTML=Tf(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const a=Hu.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}n.insertBefore(a,t)}return[i?i.nextSibling:n.firstChild,t?t.previousSibling:n.lastChild]}},F1=Symbol("_vtc");function O1(e,n,t){const r=e[F1];r&&(n=(n?[n,...r]:[...r]).join(" ")),n==null?e.removeAttribute("class"):t?e.setAttribute("class",n):e.className=n}const ti=Symbol("_vod"),Vf=Symbol("_vsh"),Nf={name:"show",beforeMount(e,{value:n},{transition:t}){e[ti]=e.style.display==="none"?"":e.style.display,t&&n?t.beforeEnter(e):oo(e,n)},mounted(e,{value:n},{transition:t}){t&&n&&t.enter(e)},updated(e,{value:n,oldValue:t},{transition:r}){!n!=!t&&(r?n?(r.beforeEnter(e),oo(e,!0),r.enter(e)):r.leave(e,()=>{oo(e,!1)}):oo(e,n))},beforeUnmount(e,{value:n}){oo(e,n)}};function oo(e,n){e.style.display=n?e[ti]:"none",e[Vf]=!n}const R1=Symbol(""),B1=/(?:^|;)\s*display\s*:/;function L1(e,n,t){const r=e.style,o=an(t);let s=!1;if(t&&!o){if(n)if(an(n))for(const i of n.split(";")){const a=i.slice(0,i.indexOf(":")).trim();t[a]==null&&Ns(r,a,"")}else for(const i in n)t[i]==null&&Ns(r,i,"");for(const i in t)i==="display"&&(s=!0),Ns(r,i,t[i])}else if(o){if(n!==t){const i=r[R1];i&&(t+=";"+i),r.cssText=t,s=B1.test(t)}}else n&&e.removeAttribute("style");ti in e&&(e[ti]=s?r.display:"",e[Vf]&&(r.display="none"))}const zu=/\s*!important$/;function Ns(e,n,t){if(Ne(t))t.forEach(r=>Ns(e,n,r));else if(t==null&&(t=""),n.startsWith("--"))e.setProperty(n,t);else{const r=U1(e,n);zu.test(t)?e.setProperty(Jt(r),t.replace(zu,""),"important"):e[r]=t}}const Ku=["Webkit","Moz","ms"],ga={};function U1(e,n){const t=ga[n];if(t)return t;let r=xn(n);if(r!=="filter"&&r in e)return ga[n]=r;r=$i(r);for(let o=0;o<Ku.length;o++){const s=Ku[o]+r;if(s in e)return ga[n]=s}return n}const Wu="http://www.w3.org/1999/xlink";function Gu(e,n,t,r,o,s=G0(n)){r&&n.startsWith("xlink:")?t==null?e.removeAttributeNS(Wu,n.slice(6,n.length)):e.setAttributeNS(Wu,n,t):t==null||s&&!wd(t)?e.removeAttribute(n):e.setAttribute(n,s?"":Nn(t)?String(t):t)}function Xu(e,n,t,r,o){if(n==="innerHTML"||n==="textContent"){t!=null&&(e[n]=n==="innerHTML"?Tf(t):t);return}const s=e.tagName;if(n==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?e.getAttribute("value")||"":e.value,l=t==null?e.type==="checkbox"?"on":"":String(t);(a!==l||!("_value"in e))&&(e.value=l),t==null&&e.removeAttribute(n),e._value=t;return}let i=!1;if(t===""||t==null){const a=typeof e[n];a==="boolean"?t=wd(t):t==null&&a==="string"?(t="",i=!0):a==="number"&&(t=0,i=!0)}try{e[n]=t}catch{}i&&e.removeAttribute(o||n)}function zt(e,n,t,r){e.addEventListener(n,t,r)}function H1(e,n,t,r){e.removeEventListener(n,t,r)}const Yu=Symbol("_vei");function z1(e,n,t,r,o=null){const s=e[Yu]||(e[Yu]={}),i=s[n];if(r&&i)i.value=r;else{const[a,l]=K1(n);if(r){const c=s[n]=X1(r,o);zt(e,a,c,l)}else i&&(H1(e,a,i,l),s[n]=void 0)}}const ju=/(?:Once|Passive|Capture)$/;function K1(e){let n;if(ju.test(e)){n={};let r;for(;r=e.match(ju);)e=e.slice(0,e.length-r[0].length),n[r[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Jt(e.slice(2)),n]}let ya=0;const W1=Promise.resolve(),G1=()=>ya||(W1.then(()=>ya=0),ya=Date.now());function X1(e,n){const t=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=t.attached)return;lt(Y1(r,t.value),n,5,[r])};return t.value=e,t.attached=G1(),t}function Y1(e,n){if(Ne(n)){const t=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{t.call(e),e._stopped=!0},n.map(r=>o=>!o._stopped&&r&&r(o))}else return n}const qu=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,j1=(e,n,t,r,o,s)=>{const i=o==="svg";n==="class"?O1(e,r,i):n==="style"?L1(e,t,r):Ei(n)?wi(n)||z1(e,n,t,r,s):(n[0]==="."?(n=n.slice(1),!0):n[0]==="^"?(n=n.slice(1),!1):q1(e,n,r,i))?(Xu(e,n,r),!e.tagName.includes("-")&&(n==="value"||n==="checked"||n==="selected")&&Gu(e,n,r,i,s,n!=="value")):e._isVueCE&&(Z1(e,n)||e._def.__asyncLoader&&(/[A-Z]/.test(n)||!an(r)))?Xu(e,xn(n),r,s,n):(n==="true-value"?e._trueValue=r:n==="false-value"&&(e._falseValue=r),Gu(e,n,r,i))};function q1(e,n,t,r){if(r)return!!(n==="innerHTML"||n==="textContent"||n in e&&qu(n)&&Re(t));if(n==="spellcheck"||n==="draggable"||n==="translate"||n==="autocorrect"||n==="sandbox"&&e.tagName==="IFRAME"||n==="form"||n==="list"&&e.tagName==="INPUT"||n==="type"&&e.tagName==="TEXTAREA")return!1;if(n==="width"||n==="height"){const o=e.tagName;if(o==="IMG"||o==="VIDEO"||o==="CANVAS"||o==="SOURCE")return!1}return qu(n)&&an(t)?!1:n in e}function Z1(e,n){const t=e._def.props;if(!t)return!1;const r=xn(n);return Array.isArray(t)?t.some(o=>xn(o)===r):Object.keys(t).some(o=>xn(o)===r)}const Hr=e=>{const n=e.props["onUpdate:modelValue"]||!1;return Ne(n)?t=>Ms(n,t):n};function J1(e){e.target.composing=!0}function Zu(e){const n=e.target;n.composing&&(n.composing=!1,n.dispatchEvent(new Event("input")))}const Pt=Symbol("_assign");function Ju(e,n,t){return n&&(e=e.trim()),t&&(e=xi(e)),e}const Ue={created(e,{modifiers:{lazy:n,trim:t,number:r}},o){e[Pt]=Hr(o);const s=r||o.props&&o.props.type==="number";zt(e,n?"change":"input",i=>{i.target.composing||e[Pt](Ju(e.value,t,s))}),(t||s)&&zt(e,"change",()=>{e.value=Ju(e.value,t,s)}),n||(zt(e,"compositionstart",J1),zt(e,"compositionend",Zu),zt(e,"change",Zu))},mounted(e,{value:n}){e.value=n??""},beforeUpdate(e,{value:n,oldValue:t,modifiers:{lazy:r,trim:o,number:s}},i){if(e[Pt]=Hr(i),e.composing)return;const a=(s||e.type==="number")&&!/^0\d/.test(e.value)?xi(e.value):e.value,l=n??"";if(a===l)return;const c=e.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===e&&e.type!=="range"&&(r&&n===t||o&&e.value.trim()===l)||(e.value=l)}},Ca={deep:!0,created(e,n,t){e[Pt]=Hr(t),zt(e,"change",()=>{const r=e._modelValue,o=Bo(e),s=e.checked,i=e[Pt];if(Ne(r)){const a=Nl(r,o),l=a!==-1;if(s&&!l)i(r.concat(o));else if(!s&&l){const c=[...r];c.splice(a,1),i(c)}}else if(jr(r)){const a=new Set(r);s?a.add(o):a.delete(o),i(a)}else i(Af(e,s))})},mounted:Qu,beforeUpdate(e,n,t){e[Pt]=Hr(t),Qu(e,n,t)}};function Qu(e,{value:n,oldValue:t},r){e._modelValue=n;let o;if(Ne(n))o=Nl(n,r.props.value)>-1;else if(jr(n))o=n.has(r.props.value);else{if(n===t)return;o=qr(n,Af(e,!0))}e.checked!==o&&(e.checked=o)}const Zn={deep:!0,created(e,{value:n,modifiers:{number:t}},r){const o=jr(n);zt(e,"change",()=>{const s=Array.prototype.filter.call(e.options,i=>i.selected).map(i=>t?xi(Bo(i)):Bo(i));e[Pt](e.multiple?o?new Set(s):s:s[0]),e._assigning=!0,fn(()=>{e._assigning=!1})}),e[Pt]=Hr(r)},mounted(e,{value:n}){ec(e,n)},beforeUpdate(e,n,t){e[Pt]=Hr(t)},updated(e,{value:n}){e._assigning||ec(e,n)}};function ec(e,n){const t=e.multiple,r=Ne(n);if(!(t&&!r&&!jr(n))){for(let o=0,s=e.options.length;o<s;o++){const i=e.options[o],a=Bo(i);if(t)if(r){const l=typeof a;l==="string"||l==="number"?i.selected=n.some(c=>String(c)===String(a)):i.selected=Nl(n,a)>-1}else i.selected=n.has(a);else if(qr(Bo(i),n)){e.selectedIndex!==o&&(e.selectedIndex=o);return}}!t&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Bo(e){return"_value"in e?e._value:e.value}function Af(e,n){const t=n?"_trueValue":"_falseValue";return t in e?e[t]:n}const Q1=["ctrl","shift","alt","meta"],ev={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,n)=>Q1.some(t=>e[`${t}Key`]&&!n.includes(t))},Qe=(e,n)=>{if(!e)return e;const t=e._withMods||(e._withMods={}),r=n.join(".");return t[r]||(t[r]=(o,...s)=>{for(let i=0;i<n.length;i++){const a=ev[n[i]];if(a&&a(o,n))return}return e(o,...s)})},nv={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},tv=(e,n)=>{const t=e._withKeys||(e._withKeys={}),r=n.join(".");return t[r]||(t[r]=o=>{if(!("key"in o))return;const s=Jt(o.key);if(n.some(i=>i===s||nv[i]===s))return e(o)})},rv=gn({patchProp:j1},A1);let nc;function ov(){return nc||(nc=v1(rv))}const sv=(...e)=>{const n=ov().createApp(...e),{mount:t}=n;return n.mount=r=>{const o=av(r);if(!o)return;const s=n._component;!Re(s)&&!s.render&&!s.template&&(s.template=o.innerHTML),o.nodeType===1&&(o.textContent="");const i=t(o,!1,iv(o));return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),i},n};function iv(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function av(e){return an(e)?document.querySelector(e):e}function Lo(e){return Al()?(ks(e),!0):!1}function bt(e){return typeof e=="function"?e():de(e)}const lv=typeof window<"u"&&typeof document<"u",uv=e=>typeof e<"u",cv=Object.prototype.toString,dv=e=>cv.call(e)==="[object Object]",fv=()=>{};function pv(e,n){function t(...r){return new Promise((o,s)=>{Promise.resolve(e(()=>n.apply(this,r),{fn:n,thisArg:this,args:r})).then(o).catch(s)})}return t}const Ff=e=>e();function hv(e=Ff){const n=Ee(!0);function t(){n.value=!1}function r(){n.value=!0}return{isActive:No(n),pause:t,resume:r,eventFilter:(...s)=>{n.value&&e(...s)}}}function tc(e,n=!1,t="Timeout"){return new Promise((r,o)=>{setTimeout(n?()=>o(t):r,e)})}function vv(e,n,t={}){const{eventFilter:r=Ff,...o}=t;return Be(e,pv(r,n),o)}function Pr(e,n,t={}){const{eventFilter:r,...o}=t,{eventFilter:s,pause:i,resume:a,isActive:l}=hv(r);return{stop:vv(e,n,{...o,eventFilter:s}),pause:i,resume:a,isActive:l}}function mv(e,n={}){if(!cn(e))return gh(e);const t=Array.isArray(e.value)?Array.from({length:e.value.length}):{};for(const r in e.value)t[r]=_h(()=>({get(){return e.value[r]},set(o){var s;if((s=bt(n.replaceRef))!=null?s:!0)if(Array.isArray(e.value)){const a=[...e.value];a[r]=o,e.value=a}else{const a={...e.value,[r]:o};Object.setPrototypeOf(a,Object.getPrototypeOf(e.value)),e.value=a}else e.value[r]=o}}));return t}function tl(e,n=!1){function t(f,{flush:h="sync",deep:p=!1,timeout:E,throwOnTimeout:b}={}){let T=null;const z=[new Promise(x=>{T=Be(e,N=>{f(N)!==n&&(T==null||T(),x(N))},{flush:h,deep:p,immediate:!0})})];return E!=null&&z.push(tc(E,b).then(()=>bt(e)).finally(()=>T==null?void 0:T())),Promise.race(z)}function r(f,h){if(!cn(f))return t(N=>N===f,h);const{flush:p="sync",deep:E=!1,timeout:b,throwOnTimeout:T}=h??{};let V=null;const x=[new Promise(N=>{V=Be([e,f],([re,ie])=>{n!==(re===ie)&&(V==null||V(),N(re))},{flush:p,deep:E,immediate:!0})})];return b!=null&&x.push(tc(b,T).then(()=>bt(e)).finally(()=>(V==null||V(),bt(e)))),Promise.race(x)}function o(f){return t(h=>!!h,f)}function s(f){return r(null,f)}function i(f){return r(void 0,f)}function a(f){return t(Number.isNaN,f)}function l(f,h){return t(p=>{const E=Array.from(p);return E.includes(f)||E.includes(bt(f))},h)}function c(f){return d(1,f)}function d(f=1,h){let p=-1;return t(()=>(p+=1,p>=f),h)}return Array.isArray(bt(e))?{toMatch:t,toContains:l,changed:c,changedTimes:d,get not(){return tl(e,!n)}}:{toMatch:t,toBe:r,toBeTruthy:o,toBeNull:s,toBeNaN:a,toBeUndefined:i,changed:c,changedTimes:d,get not(){return tl(e,!n)}}}function rl(e){return tl(e)}function _v(e){var n;const t=bt(e);return(n=t==null?void 0:t.$el)!=null?n:t}const Of=lv?window:void 0;function Rf(...e){let n,t,r,o;if(typeof e[0]=="string"||Array.isArray(e[0])?([t,r,o]=e,n=Of):[n,t,r,o]=e,!n)return fv;Array.isArray(t)||(t=[t]),Array.isArray(r)||(r=[r]);const s=[],i=()=>{s.forEach(d=>d()),s.length=0},a=(d,f,h,p)=>(d.addEventListener(f,h,p),()=>d.removeEventListener(f,h,p)),l=Be(()=>[_v(n),bt(o)],([d,f])=>{if(i(),!d)return;const h=dv(f)?{...f}:f;s.push(...t.flatMap(p=>r.map(E=>a(d,p,E,h))))},{immediate:!0,flush:"post"}),c=()=>{l(),i()};return Lo(c),c}function gv(e){return typeof e=="function"?e:typeof e=="string"?n=>n.key===e:Array.isArray(e)?n=>e.includes(n.key):()=>!0}function rc(...e){let n,t,r={};e.length===3?(n=e[0],t=e[1],r=e[2]):e.length===2?typeof e[1]=="object"?(n=!0,t=e[0],r=e[1]):(n=e[0],t=e[1]):(n=!0,t=e[0]);const{target:o=Of,eventName:s="keydown",passive:i=!1,dedupe:a=!1}=r,l=gv(n);return Rf(o,s,d=>{d.repeat&&bt(a)||l(d)&&t(d)},i)}function yv(e){return JSON.parse(JSON.stringify(e))}function Sa(e,n,t,r={}){var o,s,i;const{clone:a=!1,passive:l=!1,eventName:c,deep:d=!1,defaultValue:f,shouldEmit:h}=r,p=Qt(),E=t||(p==null?void 0:p.emit)||((o=p==null?void 0:p.$emit)==null?void 0:o.bind(p))||((i=(s=p==null?void 0:p.proxy)==null?void 0:s.$emit)==null?void 0:i.bind(p==null?void 0:p.proxy));let b=c;n||(n="modelValue"),b=b||`update:${n.toString()}`;const T=x=>a?typeof a=="function"?a(x):yv(x):x,V=()=>uv(e[n])?T(e[n]):f,z=x=>{h?h(x)&&E(b,x):E(b,x)};if(l){const x=V(),N=Ee(x);let re=!1;return Be(()=>e[n],ie=>{re||(re=!0,N.value=T(ie),fn(()=>re=!1))}),Be(N,ie=>{!re&&(ie!==e[n]||d)&&z(ie)},{deep:d}),N}else return ue({get(){return V()},set(x){z(x)}})}var Cv={value:()=>{}};function Bi(){for(var e=0,n=arguments.length,t={},r;e<n;++e){if(!(r=arguments[e]+"")||r in t||/[\s.]/.test(r))throw new Error("illegal type: "+r);t[r]=[]}return new As(t)}function As(e){this._=e}function Sv(e,n){return e.trim().split(/^|\s+/).map(function(t){var r="",o=t.indexOf(".");if(o>=0&&(r=t.slice(o+1),t=t.slice(0,o)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:r}})}As.prototype=Bi.prototype={constructor:As,on:function(e,n){var t=this._,r=Sv(e+"",t),o,s=-1,i=r.length;if(arguments.length<2){for(;++s<i;)if((o=(e=r[s]).type)&&(o=bv(t[o],e.name)))return o;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++s<i;)if(o=(e=r[s]).type)t[o]=oc(t[o],e.name,n);else if(n==null)for(o in t)t[o]=oc(t[o],e.name,null);return this},copy:function(){var e={},n=this._;for(var t in n)e[t]=n[t].slice();return new As(e)},call:function(e,n){if((o=arguments.length-2)>0)for(var t=new Array(o),r=0,o,s;r<o;++r)t[r]=arguments[r+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],r=0,o=s.length;r<o;++r)s[r].value.apply(n,t)},apply:function(e,n,t){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],o=0,s=r.length;o<s;++o)r[o].value.apply(n,t)}};function bv(e,n){for(var t=0,r=e.length,o;t<r;++t)if((o=e[t]).name===n)return o.value}function oc(e,n,t){for(var r=0,o=e.length;r<o;++r)if(e[r].name===n){e[r]=Cv,e=e.slice(0,r).concat(e.slice(r+1));break}return t!=null&&e.push({name:n,value:t}),e}var ol="http://www.w3.org/1999/xhtml";const sc={svg:"http://www.w3.org/2000/svg",xhtml:ol,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function Li(e){var n=e+="",t=n.indexOf(":");return t>=0&&(n=e.slice(0,t))!=="xmlns"&&(e=e.slice(t+1)),sc.hasOwnProperty(n)?{space:sc[n],local:e}:e}function Ev(e){return function(){var n=this.ownerDocument,t=this.namespaceURI;return t===ol&&n.documentElement.namespaceURI===ol?n.createElement(e):n.createElementNS(t,e)}}function wv(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function Bf(e){var n=Li(e);return(n.local?wv:Ev)(n)}function Iv(){}function ql(e){return e==null?Iv:function(){return this.querySelector(e)}}function Pv(e){typeof e!="function"&&(e=ql(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=new Array(i),l,c,d=0;d<i;++d)(l=s[d])&&(c=e.call(l,l.__data__,d,s))&&("__data__"in l&&(c.__data__=l.__data__),a[d]=c);return new An(r,this._parents)}function $v(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function xv(){return[]}function Lf(e){return e==null?xv:function(){return this.querySelectorAll(e)}}function Dv(e){return function(){return $v(e.apply(this,arguments))}}function Mv(e){typeof e=="function"?e=Dv(e):e=Lf(e);for(var n=this._groups,t=n.length,r=[],o=[],s=0;s<t;++s)for(var i=n[s],a=i.length,l,c=0;c<a;++c)(l=i[c])&&(r.push(e.call(l,l.__data__,c,i)),o.push(l));return new An(r,o)}function Uf(e){return function(){return this.matches(e)}}function Hf(e){return function(n){return n.matches(e)}}var kv=Array.prototype.find;function Tv(e){return function(){return kv.call(this.children,e)}}function Vv(){return this.firstElementChild}function Nv(e){return this.select(e==null?Vv:Tv(typeof e=="function"?e:Hf(e)))}var Av=Array.prototype.filter;function Fv(){return Array.from(this.children)}function Ov(e){return function(){return Av.call(this.children,e)}}function Rv(e){return this.selectAll(e==null?Fv:Ov(typeof e=="function"?e:Hf(e)))}function Bv(e){typeof e!="function"&&(e=Uf(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,c=0;c<i;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&a.push(l);return new An(r,this._parents)}function zf(e){return new Array(e.length)}function Lv(){return new An(this._enter||this._groups.map(zf),this._parents)}function ri(e,n){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=n}ri.prototype={constructor:ri,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,n){return this._parent.insertBefore(e,n)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function Uv(e){return function(){return e}}function Hv(e,n,t,r,o,s){for(var i=0,a,l=n.length,c=s.length;i<c;++i)(a=n[i])?(a.__data__=s[i],r[i]=a):t[i]=new ri(e,s[i]);for(;i<l;++i)(a=n[i])&&(o[i]=a)}function zv(e,n,t,r,o,s,i){var a,l,c=new Map,d=n.length,f=s.length,h=new Array(d),p;for(a=0;a<d;++a)(l=n[a])&&(h[a]=p=i.call(l,l.__data__,a,n)+"",c.has(p)?o[a]=l:c.set(p,l));for(a=0;a<f;++a)p=i.call(e,s[a],a,s)+"",(l=c.get(p))?(r[a]=l,l.__data__=s[a],c.delete(p)):t[a]=new ri(e,s[a]);for(a=0;a<d;++a)(l=n[a])&&c.get(h[a])===l&&(o[a]=l)}function Kv(e){return e.__data__}function Wv(e,n){if(!arguments.length)return Array.from(this,Kv);var t=n?zv:Hv,r=this._parents,o=this._groups;typeof e!="function"&&(e=Uv(e));for(var s=o.length,i=new Array(s),a=new Array(s),l=new Array(s),c=0;c<s;++c){var d=r[c],f=o[c],h=f.length,p=Gv(e.call(d,d&&d.__data__,c,r)),E=p.length,b=a[c]=new Array(E),T=i[c]=new Array(E),V=l[c]=new Array(h);t(d,f,b,T,V,p,n);for(var z=0,x=0,N,re;z<E;++z)if(N=b[z]){for(z>=x&&(x=z+1);!(re=T[x])&&++x<E;);N._next=re||null}}return i=new An(i,r),i._enter=a,i._exit=l,i}function Gv(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function Xv(){return new An(this._exit||this._groups.map(zf),this._parents)}function Yv(e,n,t){var r=this.enter(),o=this,s=this.exit();return typeof e=="function"?(r=e(r),r&&(r=r.selection())):r=r.append(e+""),n!=null&&(o=n(o),o&&(o=o.selection())),t==null?s.remove():t(s),r&&o?r.merge(o).order():o}function jv(e){for(var n=e.selection?e.selection():e,t=this._groups,r=n._groups,o=t.length,s=r.length,i=Math.min(o,s),a=new Array(o),l=0;l<i;++l)for(var c=t[l],d=r[l],f=c.length,h=a[l]=new Array(f),p,E=0;E<f;++E)(p=c[E]||d[E])&&(h[E]=p);for(;l<o;++l)a[l]=t[l];return new An(a,this._parents)}function qv(){for(var e=this._groups,n=-1,t=e.length;++n<t;)for(var r=e[n],o=r.length-1,s=r[o],i;--o>=0;)(i=r[o])&&(s&&i.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(i,s),s=i);return this}function Zv(e){e||(e=Jv);function n(f,h){return f&&h?e(f.__data__,h.__data__):!f-!h}for(var t=this._groups,r=t.length,o=new Array(r),s=0;s<r;++s){for(var i=t[s],a=i.length,l=o[s]=new Array(a),c,d=0;d<a;++d)(c=i[d])&&(l[d]=c);l.sort(n)}return new An(o,this._parents).order()}function Jv(e,n){return e<n?-1:e>n?1:e>=n?0:NaN}function Qv(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function em(){return Array.from(this)}function nm(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length;o<s;++o){var i=r[o];if(i)return i}return null}function tm(){let e=0;for(const n of this)++e;return e}function rm(){return!this.node()}function om(e){for(var n=this._groups,t=0,r=n.length;t<r;++t)for(var o=n[t],s=0,i=o.length,a;s<i;++s)(a=o[s])&&e.call(a,a.__data__,s,o);return this}function sm(e){return function(){this.removeAttribute(e)}}function im(e){return function(){this.removeAttributeNS(e.space,e.local)}}function am(e,n){return function(){this.setAttribute(e,n)}}function lm(e,n){return function(){this.setAttributeNS(e.space,e.local,n)}}function um(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttribute(e):this.setAttribute(e,t)}}function cm(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,t)}}function dm(e,n){var t=Li(e);if(arguments.length<2){var r=this.node();return t.local?r.getAttributeNS(t.space,t.local):r.getAttribute(t)}return this.each((n==null?t.local?im:sm:typeof n=="function"?t.local?cm:um:t.local?lm:am)(t,n))}function Kf(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function fm(e){return function(){this.style.removeProperty(e)}}function pm(e,n,t){return function(){this.style.setProperty(e,n,t)}}function hm(e,n,t){return function(){var r=n.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,t)}}function vm(e,n,t){return arguments.length>1?this.each((n==null?fm:typeof n=="function"?hm:pm)(e,n,t??"")):zr(this.node(),e)}function zr(e,n){return e.style.getPropertyValue(n)||Kf(e).getComputedStyle(e,null).getPropertyValue(n)}function mm(e){return function(){delete this[e]}}function _m(e,n){return function(){this[e]=n}}function gm(e,n){return function(){var t=n.apply(this,arguments);t==null?delete this[e]:this[e]=t}}function ym(e,n){return arguments.length>1?this.each((n==null?mm:typeof n=="function"?gm:_m)(e,n)):this.node()[e]}function Wf(e){return e.trim().split(/^|\s+/)}function Zl(e){return e.classList||new Gf(e)}function Gf(e){this._node=e,this._names=Wf(e.getAttribute("class")||"")}Gf.prototype={add:function(e){var n=this._names.indexOf(e);n<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var n=this._names.indexOf(e);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function Xf(e,n){for(var t=Zl(e),r=-1,o=n.length;++r<o;)t.add(n[r])}function Yf(e,n){for(var t=Zl(e),r=-1,o=n.length;++r<o;)t.remove(n[r])}function Cm(e){return function(){Xf(this,e)}}function Sm(e){return function(){Yf(this,e)}}function bm(e,n){return function(){(n.apply(this,arguments)?Xf:Yf)(this,e)}}function Em(e,n){var t=Wf(e+"");if(arguments.length<2){for(var r=Zl(this.node()),o=-1,s=t.length;++o<s;)if(!r.contains(t[o]))return!1;return!0}return this.each((typeof n=="function"?bm:n?Cm:Sm)(t,n))}function wm(){this.textContent=""}function Im(e){return function(){this.textContent=e}}function Pm(e){return function(){var n=e.apply(this,arguments);this.textContent=n??""}}function $m(e){return arguments.length?this.each(e==null?wm:(typeof e=="function"?Pm:Im)(e)):this.node().textContent}function xm(){this.innerHTML=""}function Dm(e){return function(){this.innerHTML=e}}function Mm(e){return function(){var n=e.apply(this,arguments);this.innerHTML=n??""}}function km(e){return arguments.length?this.each(e==null?xm:(typeof e=="function"?Mm:Dm)(e)):this.node().innerHTML}function Tm(){this.nextSibling&&this.parentNode.appendChild(this)}function Vm(){return this.each(Tm)}function Nm(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function Am(){return this.each(Nm)}function Fm(e){var n=typeof e=="function"?e:Bf(e);return this.select(function(){return this.appendChild(n.apply(this,arguments))})}function Om(){return null}function Rm(e,n){var t=typeof e=="function"?e:Bf(e),r=n==null?Om:typeof n=="function"?n:ql(n);return this.select(function(){return this.insertBefore(t.apply(this,arguments),r.apply(this,arguments)||null)})}function Bm(){var e=this.parentNode;e&&e.removeChild(this)}function Lm(){return this.each(Bm)}function Um(){var e=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function Hm(){var e=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function zm(e){return this.select(e?Hm:Um)}function Km(e){return arguments.length?this.property("__data__",e):this.node().__data__}function Wm(e){return function(n){e.call(this,n,this.__data__)}}function Gm(e){return e.trim().split(/^|\s+/).map(function(n){var t="",r=n.indexOf(".");return r>=0&&(t=n.slice(r+1),n=n.slice(0,r)),{type:n,name:t}})}function Xm(e){return function(){var n=this.__on;if(n){for(var t=0,r=-1,o=n.length,s;t<o;++t)s=n[t],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):n[++r]=s;++r?n.length=r:delete this.__on}}}function Ym(e,n,t){return function(){var r=this.__on,o,s=Wm(n);if(r){for(var i=0,a=r.length;i<a;++i)if((o=r[i]).type===e.type&&o.name===e.name){this.removeEventListener(o.type,o.listener,o.options),this.addEventListener(o.type,o.listener=s,o.options=t),o.value=n;return}}this.addEventListener(e.type,s,t),o={type:e.type,name:e.name,value:n,listener:s,options:t},r?r.push(o):this.__on=[o]}}function jm(e,n,t){var r=Gm(e+""),o,s=r.length,i;if(arguments.length<2){var a=this.node().__on;if(a){for(var l=0,c=a.length,d;l<c;++l)for(o=0,d=a[l];o<s;++o)if((i=r[o]).type===d.type&&i.name===d.name)return d.value}return}for(a=n?Ym:Xm,o=0;o<s;++o)this.each(a(r[o],n,t));return this}function jf(e,n,t){var r=Kf(e),o=r.CustomEvent;typeof o=="function"?o=new o(n,t):(o=r.document.createEvent("Event"),t?(o.initEvent(n,t.bubbles,t.cancelable),o.detail=t.detail):o.initEvent(n,!1,!1)),e.dispatchEvent(o)}function qm(e,n){return function(){return jf(this,e,n)}}function Zm(e,n){return function(){return jf(this,e,n.apply(this,arguments))}}function Jm(e,n){return this.each((typeof n=="function"?Zm:qm)(e,n))}function*Qm(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length,i;o<s;++o)(i=r[o])&&(yield i)}var qf=[null];function An(e,n){this._groups=e,this._parents=n}function ts(){return new An([[document.documentElement]],qf)}function e_(){return this}An.prototype=ts.prototype={constructor:An,select:Pv,selectAll:Mv,selectChild:Nv,selectChildren:Rv,filter:Bv,data:Wv,enter:Lv,exit:Xv,join:Yv,merge:jv,selection:e_,order:qv,sort:Zv,call:Qv,nodes:em,node:nm,size:tm,empty:rm,each:om,attr:dm,style:vm,property:ym,classed:Em,text:$m,html:km,raise:Vm,lower:Am,append:Fm,insert:Rm,remove:Lm,clone:zm,datum:Km,on:jm,dispatch:Jm,[Symbol.iterator]:Qm};function Hn(e){return typeof e=="string"?new An([[document.querySelector(e)]],[document.documentElement]):new An([[e]],qf)}function n_(e){let n;for(;n=e.sourceEvent;)e=n;return e}function Qn(e,n){if(e=n_(e),n===void 0&&(n=e.currentTarget),n){var t=n.ownerSVGElement||n;if(t.createSVGPoint){var r=t.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}if(n.getBoundingClientRect){var o=n.getBoundingClientRect();return[e.clientX-o.left-n.clientLeft,e.clientY-o.top-n.clientTop]}}return[e.pageX,e.pageY]}const t_={passive:!1},Uo={capture:!0,passive:!1};function ba(e){e.stopImmediatePropagation()}function Ar(e){e.preventDefault(),e.stopImmediatePropagation()}function Zf(e){var n=e.document.documentElement,t=Hn(e).on("dragstart.drag",Ar,Uo);"onselectstart"in n?t.on("selectstart.drag",Ar,Uo):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}function Jf(e,n){var t=e.document.documentElement,r=Hn(e).on("dragstart.drag",null);n&&(r.on("click.drag",Ar,Uo),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in t?r.on("selectstart.drag",null):(t.style.MozUserSelect=t.__noselect,delete t.__noselect)}const vs=e=>()=>e;function sl(e,{sourceEvent:n,subject:t,target:r,identifier:o,active:s,x:i,y:a,dx:l,dy:c,dispatch:d}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},subject:{value:t,enumerable:!0,configurable:!0},target:{value:r,enumerable:!0,configurable:!0},identifier:{value:o,enumerable:!0,configurable:!0},active:{value:s,enumerable:!0,configurable:!0},x:{value:i,enumerable:!0,configurable:!0},y:{value:a,enumerable:!0,configurable:!0},dx:{value:l,enumerable:!0,configurable:!0},dy:{value:c,enumerable:!0,configurable:!0},_:{value:d}})}sl.prototype.on=function(){var e=this._.on.apply(this._,arguments);return e===this._?this:e};function r_(e){return!e.ctrlKey&&!e.button}function o_(){return this.parentNode}function s_(e,n){return n??{x:e.x,y:e.y}}function i_(){return navigator.maxTouchPoints||"ontouchstart"in this}function a_(){var e=r_,n=o_,t=s_,r=i_,o={},s=Bi("start","drag","end"),i=0,a,l,c,d,f=0;function h(N){N.on("mousedown.drag",p).filter(r).on("touchstart.drag",T).on("touchmove.drag",V,t_).on("touchend.drag touchcancel.drag",z).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function p(N,re){if(!(d||!e.call(this,N,re))){var ie=x(this,n.call(this,N,re),N,re,"mouse");ie&&(Hn(N.view).on("mousemove.drag",E,Uo).on("mouseup.drag",b,Uo),Zf(N.view),ba(N),c=!1,a=N.clientX,l=N.clientY,ie("start",N))}}function E(N){if(Ar(N),!c){var re=N.clientX-a,ie=N.clientY-l;c=re*re+ie*ie>f}o.mouse("drag",N)}function b(N){Hn(N.view).on("mousemove.drag mouseup.drag",null),Jf(N.view,c),Ar(N),o.mouse("end",N)}function T(N,re){if(e.call(this,N,re)){var ie=N.changedTouches,ae=n.call(this,N,re),fe=ie.length,le,Z;for(le=0;le<fe;++le)(Z=x(this,ae,N,re,ie[le].identifier,ie[le]))&&(ba(N),Z("start",N,ie[le]))}}function V(N){var re=N.changedTouches,ie=re.length,ae,fe;for(ae=0;ae<ie;++ae)(fe=o[re[ae].identifier])&&(Ar(N),fe("drag",N,re[ae]))}function z(N){var re=N.changedTouches,ie=re.length,ae,fe;for(d&&clearTimeout(d),d=setTimeout(function(){d=null},500),ae=0;ae<ie;++ae)(fe=o[re[ae].identifier])&&(ba(N),fe("end",N,re[ae]))}function x(N,re,ie,ae,fe,le){var Z=s.copy(),ne=Qn(le||ie,re),M,q,v;if((v=t.call(N,new sl("beforestart",{sourceEvent:ie,target:h,identifier:fe,active:i,x:ne[0],y:ne[1],dx:0,dy:0,dispatch:Z}),ae))!=null)return M=v.x-ne[0]||0,q=v.y-ne[1]||0,function X(w,Y,K){var j=ne,J;switch(w){case"start":o[fe]=X,J=i++;break;case"end":delete o[fe],--i;case"drag":ne=Qn(K||Y,re),J=i;break}Z.call(w,N,new sl(w,{sourceEvent:Y,subject:v,target:h,identifier:fe,active:J,x:ne[0]+M,y:ne[1]+q,dx:ne[0]-j[0],dy:ne[1]-j[1],dispatch:Z}),ae)}}return h.filter=function(N){return arguments.length?(e=typeof N=="function"?N:vs(!!N),h):e},h.container=function(N){return arguments.length?(n=typeof N=="function"?N:vs(N),h):n},h.subject=function(N){return arguments.length?(t=typeof N=="function"?N:vs(N),h):t},h.touchable=function(N){return arguments.length?(r=typeof N=="function"?N:vs(!!N),h):r},h.on=function(){var N=s.on.apply(s,arguments);return N===s?h:N},h.clickDistance=function(N){return arguments.length?(f=(N=+N)*N,h):Math.sqrt(f)},h}function Jl(e,n,t){e.prototype=n.prototype=t,t.constructor=e}function Qf(e,n){var t=Object.create(e.prototype);for(var r in n)t[r]=n[r];return t}function rs(){}var Ho=.7,oi=1/Ho,Fr="\\s*([+-]?\\d+)\\s*",zo="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",it="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",l_=/^#([0-9a-f]{3,8})$/,u_=new RegExp(`^rgb\\(${Fr},${Fr},${Fr}\\)$`),c_=new RegExp(`^rgb\\(${it},${it},${it}\\)$`),d_=new RegExp(`^rgba\\(${Fr},${Fr},${Fr},${zo}\\)$`),f_=new RegExp(`^rgba\\(${it},${it},${it},${zo}\\)$`),p_=new RegExp(`^hsl\\(${zo},${it},${it}\\)$`),h_=new RegExp(`^hsla\\(${zo},${it},${it},${zo}\\)$`),ic={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Jl(rs,Sr,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:ac,formatHex:ac,formatHex8:v_,formatHsl:m_,formatRgb:lc,toString:lc});function ac(){return this.rgb().formatHex()}function v_(){return this.rgb().formatHex8()}function m_(){return ep(this).formatHsl()}function lc(){return this.rgb().formatRgb()}function Sr(e){var n,t;return e=(e+"").trim().toLowerCase(),(n=l_.exec(e))?(t=n[1].length,n=parseInt(n[1],16),t===6?uc(n):t===3?new Mn(n>>8&15|n>>4&240,n>>4&15|n&240,(n&15)<<4|n&15,1):t===8?ms(n>>24&255,n>>16&255,n>>8&255,(n&255)/255):t===4?ms(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|n&240,((n&15)<<4|n&15)/255):null):(n=u_.exec(e))?new Mn(n[1],n[2],n[3],1):(n=c_.exec(e))?new Mn(n[1]*255/100,n[2]*255/100,n[3]*255/100,1):(n=d_.exec(e))?ms(n[1],n[2],n[3],n[4]):(n=f_.exec(e))?ms(n[1]*255/100,n[2]*255/100,n[3]*255/100,n[4]):(n=p_.exec(e))?fc(n[1],n[2]/100,n[3]/100,1):(n=h_.exec(e))?fc(n[1],n[2]/100,n[3]/100,n[4]):ic.hasOwnProperty(e)?uc(ic[e]):e==="transparent"?new Mn(NaN,NaN,NaN,0):null}function uc(e){return new Mn(e>>16&255,e>>8&255,e&255,1)}function ms(e,n,t,r){return r<=0&&(e=n=t=NaN),new Mn(e,n,t,r)}function __(e){return e instanceof rs||(e=Sr(e)),e?(e=e.rgb(),new Mn(e.r,e.g,e.b,e.opacity)):new Mn}function il(e,n,t,r){return arguments.length===1?__(e):new Mn(e,n,t,r??1)}function Mn(e,n,t,r){this.r=+e,this.g=+n,this.b=+t,this.opacity=+r}Jl(Mn,il,Qf(rs,{brighter(e){return e=e==null?oi:Math.pow(oi,e),new Mn(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?Ho:Math.pow(Ho,e),new Mn(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new Mn(mr(this.r),mr(this.g),mr(this.b),si(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:cc,formatHex:cc,formatHex8:g_,formatRgb:dc,toString:dc}));function cc(){return`#${fr(this.r)}${fr(this.g)}${fr(this.b)}`}function g_(){return`#${fr(this.r)}${fr(this.g)}${fr(this.b)}${fr((isNaN(this.opacity)?1:this.opacity)*255)}`}function dc(){const e=si(this.opacity);return`${e===1?"rgb(":"rgba("}${mr(this.r)}, ${mr(this.g)}, ${mr(this.b)}${e===1?")":`, ${e})`}`}function si(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function mr(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function fr(e){return e=mr(e),(e<16?"0":"")+e.toString(16)}function fc(e,n,t,r){return r<=0?e=n=t=NaN:t<=0||t>=1?e=n=NaN:n<=0&&(e=NaN),new zn(e,n,t,r)}function ep(e){if(e instanceof zn)return new zn(e.h,e.s,e.l,e.opacity);if(e instanceof rs||(e=Sr(e)),!e)return new zn;if(e instanceof zn)return e;e=e.rgb();var n=e.r/255,t=e.g/255,r=e.b/255,o=Math.min(n,t,r),s=Math.max(n,t,r),i=NaN,a=s-o,l=(s+o)/2;return a?(n===s?i=(t-r)/a+(t<r)*6:t===s?i=(r-n)/a+2:i=(n-t)/a+4,a/=l<.5?s+o:2-s-o,i*=60):a=l>0&&l<1?0:i,new zn(i,a,l,e.opacity)}function y_(e,n,t,r){return arguments.length===1?ep(e):new zn(e,n,t,r??1)}function zn(e,n,t,r){this.h=+e,this.s=+n,this.l=+t,this.opacity=+r}Jl(zn,y_,Qf(rs,{brighter(e){return e=e==null?oi:Math.pow(oi,e),new zn(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?Ho:Math.pow(Ho,e),new zn(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,n=isNaN(e)||isNaN(this.s)?0:this.s,t=this.l,r=t+(t<.5?t:1-t)*n,o=2*t-r;return new Mn(Ea(e>=240?e-240:e+120,o,r),Ea(e,o,r),Ea(e<120?e+240:e-120,o,r),this.opacity)},clamp(){return new zn(pc(this.h),_s(this.s),_s(this.l),si(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=si(this.opacity);return`${e===1?"hsl(":"hsla("}${pc(this.h)}, ${_s(this.s)*100}%, ${_s(this.l)*100}%${e===1?")":`, ${e})`}`}}));function pc(e){return e=(e||0)%360,e<0?e+360:e}function _s(e){return Math.max(0,Math.min(1,e||0))}function Ea(e,n,t){return(e<60?n+(t-n)*e/60:e<180?t:e<240?n+(t-n)*(240-e)/60:n)*255}const Ql=e=>()=>e;function C_(e,n){return function(t){return e+t*n}}function S_(e,n,t){return e=Math.pow(e,t),n=Math.pow(n,t)-e,t=1/t,function(r){return Math.pow(e+r*n,t)}}function b_(e){return(e=+e)==1?np:function(n,t){return t-n?S_(n,t,e):Ql(isNaN(n)?t:n)}}function np(e,n){var t=n-e;return t?C_(e,t):Ql(isNaN(e)?n:e)}const ii=function e(n){var t=b_(n);function r(o,s){var i=t((o=il(o)).r,(s=il(s)).r),a=t(o.g,s.g),l=t(o.b,s.b),c=np(o.opacity,s.opacity);return function(d){return o.r=i(d),o.g=a(d),o.b=l(d),o.opacity=c(d),o+""}}return r.gamma=e,r}(1);function E_(e,n){n||(n=[]);var t=e?Math.min(n.length,e.length):0,r=n.slice(),o;return function(s){for(o=0;o<t;++o)r[o]=e[o]*(1-s)+n[o]*s;return r}}function w_(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function I_(e,n){var t=n?n.length:0,r=e?Math.min(t,e.length):0,o=new Array(r),s=new Array(t),i;for(i=0;i<r;++i)o[i]=Do(e[i],n[i]);for(;i<t;++i)s[i]=n[i];return function(a){for(i=0;i<r;++i)s[i]=o[i](a);return s}}function P_(e,n){var t=new Date;return e=+e,n=+n,function(r){return t.setTime(e*(1-r)+n*r),t}}function tt(e,n){return e=+e,n=+n,function(t){return e*(1-t)+n*t}}function $_(e,n){var t={},r={},o;(e===null||typeof e!="object")&&(e={}),(n===null||typeof n!="object")&&(n={});for(o in n)o in e?t[o]=Do(e[o],n[o]):r[o]=n[o];return function(s){for(o in t)r[o]=t[o](s);return r}}var al=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,wa=new RegExp(al.source,"g");function x_(e){return function(){return e}}function D_(e){return function(n){return e(n)+""}}function tp(e,n){var t=al.lastIndex=wa.lastIndex=0,r,o,s,i=-1,a=[],l=[];for(e=e+"",n=n+"";(r=al.exec(e))&&(o=wa.exec(n));)(s=o.index)>t&&(s=n.slice(t,s),a[i]?a[i]+=s:a[++i]=s),(r=r[0])===(o=o[0])?a[i]?a[i]+=o:a[++i]=o:(a[++i]=null,l.push({i,x:tt(r,o)})),t=wa.lastIndex;return t<n.length&&(s=n.slice(t),a[i]?a[i]+=s:a[++i]=s),a.length<2?l[0]?D_(l[0].x):x_(n):(n=l.length,function(c){for(var d=0,f;d<n;++d)a[(f=l[d]).i]=f.x(c);return a.join("")})}function Do(e,n){var t=typeof n,r;return n==null||t==="boolean"?Ql(n):(t==="number"?tt:t==="string"?(r=Sr(n))?(n=r,ii):tp:n instanceof Sr?ii:n instanceof Date?P_:w_(n)?E_:Array.isArray(n)?I_:typeof n.valueOf!="function"&&typeof n.toString!="function"||isNaN(n)?$_:tt)(e,n)}var hc=180/Math.PI,ll={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function rp(e,n,t,r,o,s){var i,a,l;return(i=Math.sqrt(e*e+n*n))&&(e/=i,n/=i),(l=e*t+n*r)&&(t-=e*l,r-=n*l),(a=Math.sqrt(t*t+r*r))&&(t/=a,r/=a,l/=a),e*r<n*t&&(e=-e,n=-n,l=-l,i=-i),{translateX:o,translateY:s,rotate:Math.atan2(n,e)*hc,skewX:Math.atan(l)*hc,scaleX:i,scaleY:a}}var gs;function M_(e){const n=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return n.isIdentity?ll:rp(n.a,n.b,n.c,n.d,n.e,n.f)}function k_(e){return e==null||(gs||(gs=document.createElementNS("http://www.w3.org/2000/svg","g")),gs.setAttribute("transform",e),!(e=gs.transform.baseVal.consolidate()))?ll:(e=e.matrix,rp(e.a,e.b,e.c,e.d,e.e,e.f))}function op(e,n,t,r){function o(c){return c.length?c.pop()+" ":""}function s(c,d,f,h,p,E){if(c!==f||d!==h){var b=p.push("translate(",null,n,null,t);E.push({i:b-4,x:tt(c,f)},{i:b-2,x:tt(d,h)})}else(f||h)&&p.push("translate("+f+n+h+t)}function i(c,d,f,h){c!==d?(c-d>180?d+=360:d-c>180&&(c+=360),h.push({i:f.push(o(f)+"rotate(",null,r)-2,x:tt(c,d)})):d&&f.push(o(f)+"rotate("+d+r)}function a(c,d,f,h){c!==d?h.push({i:f.push(o(f)+"skewX(",null,r)-2,x:tt(c,d)}):d&&f.push(o(f)+"skewX("+d+r)}function l(c,d,f,h,p,E){if(c!==f||d!==h){var b=p.push(o(p)+"scale(",null,",",null,")");E.push({i:b-4,x:tt(c,f)},{i:b-2,x:tt(d,h)})}else(f!==1||h!==1)&&p.push(o(p)+"scale("+f+","+h+")")}return function(c,d){var f=[],h=[];return c=e(c),d=e(d),s(c.translateX,c.translateY,d.translateX,d.translateY,f,h),i(c.rotate,d.rotate,f,h),a(c.skewX,d.skewX,f,h),l(c.scaleX,c.scaleY,d.scaleX,d.scaleY,f,h),c=d=null,function(p){for(var E=-1,b=h.length,T;++E<b;)f[(T=h[E]).i]=T.x(p);return f.join("")}}}var T_=op(M_,"px, ","px)","deg)"),V_=op(k_,", ",")",")"),N_=1e-12;function vc(e){return((e=Math.exp(e))+1/e)/2}function A_(e){return((e=Math.exp(e))-1/e)/2}function F_(e){return((e=Math.exp(2*e))-1)/(e+1)}const Fs=function e(n,t,r){function o(s,i){var a=s[0],l=s[1],c=s[2],d=i[0],f=i[1],h=i[2],p=d-a,E=f-l,b=p*p+E*E,T,V;if(b<N_)V=Math.log(h/c)/n,T=function(ae){return[a+ae*p,l+ae*E,c*Math.exp(n*ae*V)]};else{var z=Math.sqrt(b),x=(h*h-c*c+r*b)/(2*c*t*z),N=(h*h-c*c-r*b)/(2*h*t*z),re=Math.log(Math.sqrt(x*x+1)-x),ie=Math.log(Math.sqrt(N*N+1)-N);V=(ie-re)/n,T=function(ae){var fe=ae*V,le=vc(re),Z=c/(t*z)*(le*F_(n*fe+re)-A_(re));return[a+Z*p,l+Z*E,c*le/vc(n*fe+re)]}}return T.duration=V*1e3*n/Math.SQRT2,T}return o.rho=function(s){var i=Math.max(.001,+s),a=i*i,l=a*a;return e(i,a,l)},o}(Math.SQRT2,2,4);var Kr=0,vo=0,so=0,sp=1e3,ai,mo,li=0,br=0,Ui=0,Ko=typeof performance=="object"&&performance.now?performance:Date,ip=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function eu(){return br||(ip(O_),br=Ko.now()+Ui)}function O_(){br=0}function ui(){this._call=this._time=this._next=null}ui.prototype=ap.prototype={constructor:ui,restart:function(e,n,t){if(typeof e!="function")throw new TypeError("callback is not a function");t=(t==null?eu():+t)+(n==null?0:+n),!this._next&&mo!==this&&(mo?mo._next=this:ai=this,mo=this),this._call=e,this._time=t,ul()},stop:function(){this._call&&(this._call=null,this._time=1/0,ul())}};function ap(e,n,t){var r=new ui;return r.restart(e,n,t),r}function R_(){eu(),++Kr;for(var e=ai,n;e;)(n=br-e._time)>=0&&e._call.call(void 0,n),e=e._next;--Kr}function mc(){br=(li=Ko.now())+Ui,Kr=vo=0;try{R_()}finally{Kr=0,L_(),br=0}}function B_(){var e=Ko.now(),n=e-li;n>sp&&(Ui-=n,li=e)}function L_(){for(var e,n=ai,t,r=1/0;n;)n._call?(r>n._time&&(r=n._time),e=n,n=n._next):(t=n._next,n._next=null,n=e?e._next=t:ai=t);mo=e,ul(r)}function ul(e){if(!Kr){vo&&(vo=clearTimeout(vo));var n=e-br;n>24?(e<1/0&&(vo=setTimeout(mc,e-Ko.now()-Ui)),so&&(so=clearInterval(so))):(so||(li=Ko.now(),so=setInterval(B_,sp)),Kr=1,ip(mc))}}function _c(e,n,t){var r=new ui;return n=n==null?0:+n,r.restart(o=>{r.stop(),e(o+n)},n,t),r}var U_=Bi("start","end","cancel","interrupt"),H_=[],lp=0,gc=1,cl=2,Os=3,yc=4,dl=5,Rs=6;function Hi(e,n,t,r,o,s){var i=e.__transition;if(!i)e.__transition={};else if(t in i)return;z_(e,t,{name:n,index:r,group:o,on:U_,tween:H_,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:lp})}function nu(e,n){var t=Yn(e,n);if(t.state>lp)throw new Error("too late; already scheduled");return t}function ct(e,n){var t=Yn(e,n);if(t.state>Os)throw new Error("too late; already running");return t}function Yn(e,n){var t=e.__transition;if(!t||!(t=t[n]))throw new Error("transition not found");return t}function z_(e,n,t){var r=e.__transition,o;r[n]=t,t.timer=ap(s,0,t.time);function s(c){t.state=gc,t.timer.restart(i,t.delay,t.time),t.delay<=c&&i(c-t.delay)}function i(c){var d,f,h,p;if(t.state!==gc)return l();for(d in r)if(p=r[d],p.name===t.name){if(p.state===Os)return _c(i);p.state===yc?(p.state=Rs,p.timer.stop(),p.on.call("interrupt",e,e.__data__,p.index,p.group),delete r[d]):+d<n&&(p.state=Rs,p.timer.stop(),p.on.call("cancel",e,e.__data__,p.index,p.group),delete r[d])}if(_c(function(){t.state===Os&&(t.state=yc,t.timer.restart(a,t.delay,t.time),a(c))}),t.state=cl,t.on.call("start",e,e.__data__,t.index,t.group),t.state===cl){for(t.state=Os,o=new Array(h=t.tween.length),d=0,f=-1;d<h;++d)(p=t.tween[d].value.call(e,e.__data__,t.index,t.group))&&(o[++f]=p);o.length=f+1}}function a(c){for(var d=c<t.duration?t.ease.call(null,c/t.duration):(t.timer.restart(l),t.state=dl,1),f=-1,h=o.length;++f<h;)o[f].call(e,d);t.state===dl&&(t.on.call("end",e,e.__data__,t.index,t.group),l())}function l(){t.state=Rs,t.timer.stop(),delete r[n];for(var c in r)return;delete e.__transition}}function Bs(e,n){var t=e.__transition,r,o,s=!0,i;if(t){n=n==null?null:n+"";for(i in t){if((r=t[i]).name!==n){s=!1;continue}o=r.state>cl&&r.state<dl,r.state=Rs,r.timer.stop(),r.on.call(o?"interrupt":"cancel",e,e.__data__,r.index,r.group),delete t[i]}s&&delete e.__transition}}function K_(e){return this.each(function(){Bs(this,e)})}function W_(e,n){var t,r;return function(){var o=ct(this,e),s=o.tween;if(s!==t){r=t=s;for(var i=0,a=r.length;i<a;++i)if(r[i].name===n){r=r.slice(),r.splice(i,1);break}}o.tween=r}}function G_(e,n,t){var r,o;if(typeof t!="function")throw new Error;return function(){var s=ct(this,e),i=s.tween;if(i!==r){o=(r=i).slice();for(var a={name:n,value:t},l=0,c=o.length;l<c;++l)if(o[l].name===n){o[l]=a;break}l===c&&o.push(a)}s.tween=o}}function X_(e,n){var t=this._id;if(e+="",arguments.length<2){for(var r=Yn(this.node(),t).tween,o=0,s=r.length,i;o<s;++o)if((i=r[o]).name===e)return i.value;return null}return this.each((n==null?W_:G_)(t,e,n))}function tu(e,n,t){var r=e._id;return e.each(function(){var o=ct(this,r);(o.value||(o.value={}))[n]=t.apply(this,arguments)}),function(o){return Yn(o,r).value[n]}}function up(e,n){var t;return(typeof n=="number"?tt:n instanceof Sr?ii:(t=Sr(n))?(n=t,ii):tp)(e,n)}function Y_(e){return function(){this.removeAttribute(e)}}function j_(e){return function(){this.removeAttributeNS(e.space,e.local)}}function q_(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttribute(e);return i===o?null:i===r?s:s=n(r=i,t)}}function Z_(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttributeNS(e.space,e.local);return i===o?null:i===r?s:s=n(r=i,t)}}function J_(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttribute(e):(i=this.getAttribute(e),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function Q_(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttributeNS(e.space,e.local):(i=this.getAttributeNS(e.space,e.local),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function eg(e,n){var t=Li(e),r=t==="transform"?V_:up;return this.attrTween(e,typeof n=="function"?(t.local?Q_:J_)(t,r,tu(this,"attr."+e,n)):n==null?(t.local?j_:Y_)(t):(t.local?Z_:q_)(t,r,n))}function ng(e,n){return function(t){this.setAttribute(e,n.call(this,t))}}function tg(e,n){return function(t){this.setAttributeNS(e.space,e.local,n.call(this,t))}}function rg(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&tg(e,s)),t}return o._value=n,o}function og(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&ng(e,s)),t}return o._value=n,o}function sg(e,n){var t="attr."+e;if(arguments.length<2)return(t=this.tween(t))&&t._value;if(n==null)return this.tween(t,null);if(typeof n!="function")throw new Error;var r=Li(e);return this.tween(t,(r.local?rg:og)(r,n))}function ig(e,n){return function(){nu(this,e).delay=+n.apply(this,arguments)}}function ag(e,n){return n=+n,function(){nu(this,e).delay=n}}function lg(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?ig:ag)(n,e)):Yn(this.node(),n).delay}function ug(e,n){return function(){ct(this,e).duration=+n.apply(this,arguments)}}function cg(e,n){return n=+n,function(){ct(this,e).duration=n}}function dg(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?ug:cg)(n,e)):Yn(this.node(),n).duration}function fg(e,n){if(typeof n!="function")throw new Error;return function(){ct(this,e).ease=n}}function pg(e){var n=this._id;return arguments.length?this.each(fg(n,e)):Yn(this.node(),n).ease}function hg(e,n){return function(){var t=n.apply(this,arguments);if(typeof t!="function")throw new Error;ct(this,e).ease=t}}function vg(e){if(typeof e!="function")throw new Error;return this.each(hg(this._id,e))}function mg(e){typeof e!="function"&&(e=Uf(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,c=0;c<i;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&a.push(l);return new kt(r,this._parents,this._name,this._id)}function _g(e){if(e._id!==this._id)throw new Error;for(var n=this._groups,t=e._groups,r=n.length,o=t.length,s=Math.min(r,o),i=new Array(r),a=0;a<s;++a)for(var l=n[a],c=t[a],d=l.length,f=i[a]=new Array(d),h,p=0;p<d;++p)(h=l[p]||c[p])&&(f[p]=h);for(;a<r;++a)i[a]=n[a];return new kt(i,this._parents,this._name,this._id)}function gg(e){return(e+"").trim().split(/^|\s+/).every(function(n){var t=n.indexOf(".");return t>=0&&(n=n.slice(0,t)),!n||n==="start"})}function yg(e,n,t){var r,o,s=gg(n)?nu:ct;return function(){var i=s(this,e),a=i.on;a!==r&&(o=(r=a).copy()).on(n,t),i.on=o}}function Cg(e,n){var t=this._id;return arguments.length<2?Yn(this.node(),t).on.on(e):this.each(yg(t,e,n))}function Sg(e){return function(){var n=this.parentNode;for(var t in this.__transition)if(+t!==e)return;n&&n.removeChild(this)}}function bg(){return this.on("end.remove",Sg(this._id))}function Eg(e){var n=this._name,t=this._id;typeof e!="function"&&(e=ql(e));for(var r=this._groups,o=r.length,s=new Array(o),i=0;i<o;++i)for(var a=r[i],l=a.length,c=s[i]=new Array(l),d,f,h=0;h<l;++h)(d=a[h])&&(f=e.call(d,d.__data__,h,a))&&("__data__"in d&&(f.__data__=d.__data__),c[h]=f,Hi(c[h],n,t,h,c,Yn(d,t)));return new kt(s,this._parents,n,t)}function wg(e){var n=this._name,t=this._id;typeof e!="function"&&(e=Lf(e));for(var r=this._groups,o=r.length,s=[],i=[],a=0;a<o;++a)for(var l=r[a],c=l.length,d,f=0;f<c;++f)if(d=l[f]){for(var h=e.call(d,d.__data__,f,l),p,E=Yn(d,t),b=0,T=h.length;b<T;++b)(p=h[b])&&Hi(p,n,t,b,h,E);s.push(h),i.push(d)}return new kt(s,i,n,t)}var Ig=ts.prototype.constructor;function Pg(){return new Ig(this._groups,this._parents)}function $g(e,n){var t,r,o;return function(){var s=zr(this,e),i=(this.style.removeProperty(e),zr(this,e));return s===i?null:s===t&&i===r?o:o=n(t=s,r=i)}}function cp(e){return function(){this.style.removeProperty(e)}}function xg(e,n,t){var r,o=t+"",s;return function(){var i=zr(this,e);return i===o?null:i===r?s:s=n(r=i,t)}}function Dg(e,n,t){var r,o,s;return function(){var i=zr(this,e),a=t(this),l=a+"";return a==null&&(l=a=(this.style.removeProperty(e),zr(this,e))),i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a))}}function Mg(e,n){var t,r,o,s="style."+n,i="end."+s,a;return function(){var l=ct(this,e),c=l.on,d=l.value[s]==null?a||(a=cp(n)):void 0;(c!==t||o!==d)&&(r=(t=c).copy()).on(i,o=d),l.on=r}}function kg(e,n,t){var r=(e+="")=="transform"?T_:up;return n==null?this.styleTween(e,$g(e,r)).on("end.style."+e,cp(e)):typeof n=="function"?this.styleTween(e,Dg(e,r,tu(this,"style."+e,n))).each(Mg(this._id,e)):this.styleTween(e,xg(e,r,n),t).on("end.style."+e,null)}function Tg(e,n,t){return function(r){this.style.setProperty(e,n.call(this,r),t)}}function Vg(e,n,t){var r,o;function s(){var i=n.apply(this,arguments);return i!==o&&(r=(o=i)&&Tg(e,i,t)),r}return s._value=n,s}function Ng(e,n,t){var r="style."+(e+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(n==null)return this.tween(r,null);if(typeof n!="function")throw new Error;return this.tween(r,Vg(e,n,t??""))}function Ag(e){return function(){this.textContent=e}}function Fg(e){return function(){var n=e(this);this.textContent=n??""}}function Og(e){return this.tween("text",typeof e=="function"?Fg(tu(this,"text",e)):Ag(e==null?"":e+""))}function Rg(e){return function(n){this.textContent=e.call(this,n)}}function Bg(e){var n,t;function r(){var o=e.apply(this,arguments);return o!==t&&(n=(t=o)&&Rg(o)),n}return r._value=e,r}function Lg(e){var n="text";if(arguments.length<1)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;return this.tween(n,Bg(e))}function Ug(){for(var e=this._name,n=this._id,t=dp(),r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,c=0;c<a;++c)if(l=i[c]){var d=Yn(l,n);Hi(l,e,t,c,i,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new kt(r,this._parents,e,t)}function Hg(){var e,n,t=this,r=t._id,o=t.size();return new Promise(function(s,i){var a={value:i},l={value:function(){--o===0&&s()}};t.each(function(){var c=ct(this,r),d=c.on;d!==e&&(n=(e=d).copy(),n._.cancel.push(a),n._.interrupt.push(a),n._.end.push(l)),c.on=n}),o===0&&s()})}var zg=0;function kt(e,n,t,r){this._groups=e,this._parents=n,this._name=t,this._id=r}function dp(){return++zg}var mt=ts.prototype;kt.prototype={constructor:kt,select:Eg,selectAll:wg,selectChild:mt.selectChild,selectChildren:mt.selectChildren,filter:mg,merge:_g,selection:Pg,transition:Ug,call:mt.call,nodes:mt.nodes,node:mt.node,size:mt.size,empty:mt.empty,each:mt.each,on:Cg,attr:eg,attrTween:sg,style:kg,styleTween:Ng,text:Og,textTween:Lg,remove:bg,tween:X_,delay:lg,duration:dg,ease:pg,easeVarying:vg,end:Hg,[Symbol.iterator]:mt[Symbol.iterator]};function Kg(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var Wg={time:null,delay:0,duration:250,ease:Kg};function Gg(e,n){for(var t;!(t=e.__transition)||!(t=t[n]);)if(!(e=e.parentNode))throw new Error(`transition ${n} not found`);return t}function Xg(e){var n,t;e instanceof kt?(n=e._id,e=e._name):(n=dp(),(t=Wg).time=eu(),e=e==null?null:e+"");for(var r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,c=0;c<a;++c)(l=i[c])&&Hi(l,e,n,c,i,t||Gg(l,n));return new kt(r,this._parents,e,n)}ts.prototype.interrupt=K_;ts.prototype.transition=Xg;const ys=e=>()=>e;function Yg(e,{sourceEvent:n,target:t,transform:r,dispatch:o}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},target:{value:t,enumerable:!0,configurable:!0},transform:{value:r,enumerable:!0,configurable:!0},_:{value:o}})}function Et(e,n,t){this.k=e,this.x=n,this.y=t}Et.prototype={constructor:Et,scale:function(e){return e===1?this:new Et(this.k*e,this.x,this.y)},translate:function(e,n){return e===0&n===0?this:new Et(this.k,this.x+this.k*e,this.y+this.k*n)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var Wr=new Et(1,0,0);Et.prototype;function Ia(e){e.stopImmediatePropagation()}function io(e){e.preventDefault(),e.stopImmediatePropagation()}function jg(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function qg(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function Cc(){return this.__zoom||Wr}function Zg(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function Jg(){return navigator.maxTouchPoints||"ontouchstart"in this}function Qg(e,n,t){var r=e.invertX(n[0][0])-t[0][0],o=e.invertX(n[1][0])-t[1][0],s=e.invertY(n[0][1])-t[0][1],i=e.invertY(n[1][1])-t[1][1];return e.translate(o>r?(r+o)/2:Math.min(0,r)||Math.max(0,o),i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i))}function ey(){var e=jg,n=qg,t=Qg,r=Zg,o=Jg,s=[0,1/0],i=[[-1/0,-1/0],[1/0,1/0]],a=250,l=Fs,c=Bi("start","zoom","end"),d,f,h,p=500,E=150,b=0,T=10;function V(v){v.property("__zoom",Cc).on("wheel.zoom",fe,{passive:!1}).on("mousedown.zoom",le).on("dblclick.zoom",Z).filter(o).on("touchstart.zoom",ne).on("touchmove.zoom",M).on("touchend.zoom touchcancel.zoom",q).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}V.transform=function(v,X,w,Y){var K=v.selection?v.selection():v;K.property("__zoom",Cc),v!==K?re(v,X,w,Y):K.interrupt().each(function(){ie(this,arguments).event(Y).start().zoom(null,typeof X=="function"?X.apply(this,arguments):X).end()})},V.scaleBy=function(v,X,w,Y){V.scaleTo(v,function(){var K=this.__zoom.k,j=typeof X=="function"?X.apply(this,arguments):X;return K*j},w,Y)},V.scaleTo=function(v,X,w,Y){V.transform(v,function(){var K=n.apply(this,arguments),j=this.__zoom,J=w==null?N(K):typeof w=="function"?w.apply(this,arguments):w,te=j.invert(J),pe=typeof X=="function"?X.apply(this,arguments):X;return t(x(z(j,pe),J,te),K,i)},w,Y)},V.translateBy=function(v,X,w,Y){V.transform(v,function(){return t(this.__zoom.translate(typeof X=="function"?X.apply(this,arguments):X,typeof w=="function"?w.apply(this,arguments):w),n.apply(this,arguments),i)},null,Y)},V.translateTo=function(v,X,w,Y,K){V.transform(v,function(){var j=n.apply(this,arguments),J=this.__zoom,te=Y==null?N(j):typeof Y=="function"?Y.apply(this,arguments):Y;return t(Wr.translate(te[0],te[1]).scale(J.k).translate(typeof X=="function"?-X.apply(this,arguments):-X,typeof w=="function"?-w.apply(this,arguments):-w),j,i)},Y,K)};function z(v,X){return X=Math.max(s[0],Math.min(s[1],X)),X===v.k?v:new Et(X,v.x,v.y)}function x(v,X,w){var Y=X[0]-w[0]*v.k,K=X[1]-w[1]*v.k;return Y===v.x&&K===v.y?v:new Et(v.k,Y,K)}function N(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function re(v,X,w,Y){v.on("start.zoom",function(){ie(this,arguments).event(Y).start()}).on("interrupt.zoom end.zoom",function(){ie(this,arguments).event(Y).end()}).tween("zoom",function(){var K=this,j=arguments,J=ie(K,j).event(Y),te=n.apply(K,j),pe=w==null?N(te):typeof w=="function"?w.apply(K,j):w,ye=Math.max(te[1][0]-te[0][0],te[1][1]-te[0][1]),ge=K.__zoom,_e=typeof X=="function"?X.apply(K,j):X,Se=l(ge.invert(pe).concat(ye/ge.k),_e.invert(pe).concat(ye/_e.k));return function(be){if(be===1)be=_e;else{var Me=Se(be),Oe=ye/Me[2];be=new Et(Oe,pe[0]-Me[0]*Oe,pe[1]-Me[1]*Oe)}J.zoom(null,be)}})}function ie(v,X,w){return!w&&v.__zooming||new ae(v,X)}function ae(v,X){this.that=v,this.args=X,this.active=0,this.sourceEvent=null,this.extent=n.apply(v,X),this.taps=0}ae.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,X){return this.mouse&&v!=="mouse"&&(this.mouse[1]=X.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=X.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=X.invert(this.touch1[0])),this.that.__zoom=X,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var X=Hn(this.that).datum();c.call(v,this.that,new Yg(v,{sourceEvent:this.sourceEvent,target:V,transform:this.that.__zoom,dispatch:c}),X)}};function fe(v,...X){if(!e.apply(this,arguments))return;var w=ie(this,X).event(v),Y=this.__zoom,K=Math.max(s[0],Math.min(s[1],Y.k*Math.pow(2,r.apply(this,arguments)))),j=Qn(v);if(w.wheel)(w.mouse[0][0]!==j[0]||w.mouse[0][1]!==j[1])&&(w.mouse[1]=Y.invert(w.mouse[0]=j)),clearTimeout(w.wheel);else{if(Y.k===K)return;w.mouse=[j,Y.invert(j)],Bs(this),w.start()}io(v),w.wheel=setTimeout(J,E),w.zoom("mouse",t(x(z(Y,K),w.mouse[0],w.mouse[1]),w.extent,i));function J(){w.wheel=null,w.end()}}function le(v,...X){if(h||!e.apply(this,arguments))return;var w=v.currentTarget,Y=ie(this,X,!0).event(v),K=Hn(v.view).on("mousemove.zoom",pe,!0).on("mouseup.zoom",ye,!0),j=Qn(v,w),J=v.clientX,te=v.clientY;Zf(v.view),Ia(v),Y.mouse=[j,this.__zoom.invert(j)],Bs(this),Y.start();function pe(ge){if(io(ge),!Y.moved){var _e=ge.clientX-J,Se=ge.clientY-te;Y.moved=_e*_e+Se*Se>b}Y.event(ge).zoom("mouse",t(x(Y.that.__zoom,Y.mouse[0]=Qn(ge,w),Y.mouse[1]),Y.extent,i))}function ye(ge){K.on("mousemove.zoom mouseup.zoom",null),Jf(ge.view,Y.moved),io(ge),Y.event(ge).end()}}function Z(v,...X){if(e.apply(this,arguments)){var w=this.__zoom,Y=Qn(v.changedTouches?v.changedTouches[0]:v,this),K=w.invert(Y),j=w.k*(v.shiftKey?.5:2),J=t(x(z(w,j),Y,K),n.apply(this,X),i);io(v),a>0?Hn(this).transition().duration(a).call(re,J,Y,v):Hn(this).call(V.transform,J,Y,v)}}function ne(v,...X){if(e.apply(this,arguments)){var w=v.touches,Y=w.length,K=ie(this,X,v.changedTouches.length===Y).event(v),j,J,te,pe;for(Ia(v),J=0;J<Y;++J)te=w[J],pe=Qn(te,this),pe=[pe,this.__zoom.invert(pe),te.identifier],K.touch0?!K.touch1&&K.touch0[2]!==pe[2]&&(K.touch1=pe,K.taps=0):(K.touch0=pe,j=!0,K.taps=1+!!d);d&&(d=clearTimeout(d)),j&&(K.taps<2&&(f=pe[0],d=setTimeout(function(){d=null},p)),Bs(this),K.start())}}function M(v,...X){if(this.__zooming){var w=ie(this,X).event(v),Y=v.changedTouches,K=Y.length,j,J,te,pe;for(io(v),j=0;j<K;++j)J=Y[j],te=Qn(J,this),w.touch0&&w.touch0[2]===J.identifier?w.touch0[0]=te:w.touch1&&w.touch1[2]===J.identifier&&(w.touch1[0]=te);if(J=w.that.__zoom,w.touch1){var ye=w.touch0[0],ge=w.touch0[1],_e=w.touch1[0],Se=w.touch1[1],be=(be=_e[0]-ye[0])*be+(be=_e[1]-ye[1])*be,Me=(Me=Se[0]-ge[0])*Me+(Me=Se[1]-ge[1])*Me;J=z(J,Math.sqrt(be/Me)),te=[(ye[0]+_e[0])/2,(ye[1]+_e[1])/2],pe=[(ge[0]+Se[0])/2,(ge[1]+Se[1])/2]}else if(w.touch0)te=w.touch0[0],pe=w.touch0[1];else return;w.zoom("touch",t(x(J,te,pe),w.extent,i))}}function q(v,...X){if(this.__zooming){var w=ie(this,X).event(v),Y=v.changedTouches,K=Y.length,j,J;for(Ia(v),h&&clearTimeout(h),h=setTimeout(function(){h=null},p),j=0;j<K;++j)J=Y[j],w.touch0&&w.touch0[2]===J.identifier?delete w.touch0:w.touch1&&w.touch1[2]===J.identifier&&delete w.touch1;if(w.touch1&&!w.touch0&&(w.touch0=w.touch1,delete w.touch1),w.touch0)w.touch0[1]=this.__zoom.invert(w.touch0[0]);else if(w.end(),w.taps===2&&(J=Qn(J,this),Math.hypot(f[0]-J[0],f[1]-J[1])<T)){var te=Hn(this).on("dblclick.zoom");te&&te.apply(this,arguments)}}}return V.wheelDelta=function(v){return arguments.length?(r=typeof v=="function"?v:ys(+v),V):r},V.filter=function(v){return arguments.length?(e=typeof v=="function"?v:ys(!!v),V):e},V.touchable=function(v){return arguments.length?(o=typeof v=="function"?v:ys(!!v),V):o},V.extent=function(v){return arguments.length?(n=typeof v=="function"?v:ys([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),V):n},V.scaleExtent=function(v){return arguments.length?(s[0]=+v[0],s[1]=+v[1],V):[s[0],s[1]]},V.translateExtent=function(v){return arguments.length?(i[0][0]=+v[0][0],i[1][0]=+v[1][0],i[0][1]=+v[0][1],i[1][1]=+v[1][1],V):[[i[0][0],i[0][1]],[i[1][0],i[1][1]]]},V.constrain=function(v){return arguments.length?(t=v,V):t},V.duration=function(v){return arguments.length?(a=+v,V):a},V.interpolate=function(v){return arguments.length?(l=v,V):l},V.on=function(){var v=c.on.apply(c,arguments);return v===c?V:v},V.clickDistance=function(v){return arguments.length?(b=(v=+v)*v,V):Math.sqrt(b)},V.tapDistance=function(v){return arguments.length?(T=+v,V):T},V}var De=(e=>(e.Left="left",e.Top="top",e.Right="right",e.Bottom="bottom",e))(De||{}),ru=(e=>(e.Partial="partial",e.Full="full",e))(ru||{}),ur=(e=>(e.Bezier="default",e.SimpleBezier="simple-bezier",e.Straight="straight",e.Step="step",e.SmoothStep="smoothstep",e))(ur||{}),Yt=(e=>(e.Strict="strict",e.Loose="loose",e))(Yt||{}),fl=(e=>(e.Arrow="arrow",e.ArrowClosed="arrowclosed",e))(fl||{}),Mo=(e=>(e.Free="free",e.Vertical="vertical",e.Horizontal="horizontal",e))(Mo||{}),fp=(e=>(e.TopLeft="top-left",e.TopCenter="top-center",e.TopRight="top-right",e.BottomLeft="bottom-left",e.BottomCenter="bottom-center",e.BottomRight="bottom-right",e))(fp||{});const ny=["INPUT","SELECT","TEXTAREA"],ty=typeof document<"u"?document:null;function pl(e){var n,t;const r=((t=(n=e.composedPath)==null?void 0:n.call(e))==null?void 0:t[0])||e.target,o=typeof(r==null?void 0:r.hasAttribute)=="function"?r.hasAttribute("contenteditable"):!1,s=typeof(r==null?void 0:r.closest)=="function"?r.closest(".nokey"):null;return ny.includes(r==null?void 0:r.nodeName)||o||!!s}function ry(e){return e.ctrlKey||e.metaKey||e.shiftKey||e.altKey}function Sc(e,n,t,r){const o=n.replace("+",`
`).replace(`

`,`
+`).split(`
`).map(i=>i.trim().toLowerCase());if(o.length===1)return e.toLowerCase()===n.toLowerCase();r||t.add(e.toLowerCase());const s=o.every((i,a)=>t.has(i)&&Array.from(t.values())[a]===o[a]);return r&&t.delete(e.toLowerCase()),s}function oy(e,n){return t=>{if(!t.code&&!t.key)return!1;const r=sy(t.code,e);return Array.isArray(e)?e.some(o=>Sc(t[r],o,n,t.type==="keyup")):Sc(t[r],e,n,t.type==="keyup")}}function sy(e,n){return n.includes(e)?"code":"key"}function ko(e,n){const t=ue(()=>Ge(n==null?void 0:n.target)??ty),r=Wt(Ge(e)===!0);let o=!1;const s=new Set;let i=l(Ge(e));Be(()=>Ge(e),(c,d)=>{typeof d=="boolean"&&typeof c!="boolean"&&a(),i=l(c)},{immediate:!0}),Rf(["blur","contextmenu"],a),rc((...c)=>i(...c),c=>{var d,f;const h=Ge(n==null?void 0:n.actInsideInputWithModifier)??!0,p=Ge(n==null?void 0:n.preventDefault)??!1;if(o=ry(c),(!o||o&&!h)&&pl(c))return;const b=((f=(d=c.composedPath)==null?void 0:d.call(c))==null?void 0:f[0])||c.target,T=(b==null?void 0:b.nodeName)==="BUTTON"||(b==null?void 0:b.nodeName)==="A";!p&&(o||!T)&&c.preventDefault(),r.value=!0},{eventName:"keydown",target:t}),rc((...c)=>i(...c),c=>{const d=Ge(n==null?void 0:n.actInsideInputWithModifier)??!0;if(r.value){if((!o||o&&!d)&&pl(c))return;o=!1,r.value=!1}},{eventName:"keyup",target:t});function a(){o=!1,s.clear(),r.value=Ge(e)===!0}function l(c){return c===null?(a(),()=>!1):typeof c=="boolean"?(a(),r.value=c,()=>!1):Array.isArray(c)||typeof c=="string"?oy(c,s):c}return r}const pp="vue-flow__node-desc",hp="vue-flow__edge-desc",iy="vue-flow__aria-live",vp=["Enter"," ","Escape"],Or={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};function ci(e){return{...e.computedPosition||{x:0,y:0},width:e.dimensions.width||0,height:e.dimensions.height||0}}function di(e,n){const t=Math.max(0,Math.min(e.x+e.width,n.x+n.width)-Math.max(e.x,n.x)),r=Math.max(0,Math.min(e.y+e.height,n.y+n.height)-Math.max(e.y,n.y));return Math.ceil(t*r)}function zi(e){return{width:e.offsetWidth,height:e.offsetHeight}}function Er(e,n=0,t=1){return Math.min(Math.max(e,n),t)}function mp(e,n){return{x:Er(e.x,n[0][0],n[1][0]),y:Er(e.y,n[0][1],n[1][1])}}function bc(e){const n=e.getRootNode();return"elementFromPoint"in n?n:window.document}function jt(e){return e&&typeof e=="object"&&"id"in e&&"source"in e&&"target"in e}function _r(e){return e&&typeof e=="object"&&"id"in e&&"position"in e&&!jt(e)}function _o(e){return _r(e)&&"computedPosition"in e}function Cs(e){return!Number.isNaN(e)&&Number.isFinite(e)}function ay(e){return Cs(e.width)&&Cs(e.height)&&Cs(e.x)&&Cs(e.y)}function ly(e,n,t){const r={id:e.id.toString(),type:e.type??"default",dimensions:It({width:0,height:0}),computedPosition:It({z:0,...e.position}),handleBounds:{source:[],target:[]},draggable:void 0,selectable:void 0,connectable:void 0,focusable:void 0,selected:!1,dragging:!1,resizing:!1,initialized:!1,isParent:!1,position:{x:0,y:0},data:dn(e.data)?e.data:{},events:It(dn(e.events)?e.events:{})};return Object.assign(n??r,e,{id:e.id.toString(),parentNode:t})}function _p(e,n,t){var r,o;const s={id:e.id.toString(),type:e.type??(n==null?void 0:n.type)??"default",source:e.source.toString(),target:e.target.toString(),sourceHandle:(r=e.sourceHandle)==null?void 0:r.toString(),targetHandle:(o=e.targetHandle)==null?void 0:o.toString(),updatable:e.updatable??(t==null?void 0:t.updatable),selectable:e.selectable??(t==null?void 0:t.selectable),focusable:e.focusable??(t==null?void 0:t.focusable),data:dn(e.data)?e.data:{},events:It(dn(e.events)?e.events:{}),label:e.label??"",interactionWidth:e.interactionWidth??(t==null?void 0:t.interactionWidth),...t??{}};return Object.assign(n??s,e,{id:e.id.toString()})}function gp(e,n,t,r){const o=typeof e=="string"?e:e.id,s=new Set,i=r==="source"?"target":"source";for(const a of t)a[i]===o&&s.add(a[r]);return n.filter(a=>s.has(a.id))}function uy(...e){if(e.length===3){const[s,i,a]=e;return gp(s,i,a,"target")}const[n,t]=e,r=typeof n=="string"?n:n.id;return t.filter(s=>jt(s)&&s.source===r).map(s=>t.find(i=>_r(i)&&i.id===s.target))}function cy(...e){if(e.length===3){const[s,i,a]=e;return gp(s,i,a,"source")}const[n,t]=e,r=typeof n=="string"?n:n.id;return t.filter(s=>jt(s)&&s.target===r).map(s=>t.find(i=>_r(i)&&i.id===s.source))}function yp({source:e,sourceHandle:n,target:t,targetHandle:r}){return`vueflow__edge-${e}${n??""}-${t}${r??""}`}function dy(e,n){return n.some(t=>jt(t)&&t.source===e.source&&t.target===e.target&&(t.sourceHandle===e.sourceHandle||!t.sourceHandle&&!e.sourceHandle)&&(t.targetHandle===e.targetHandle||!t.targetHandle&&!e.targetHandle))}function Wo({x:e,y:n},{x:t,y:r,zoom:o}){return{x:e*o+t,y:n*o+r}}function Go({x:e,y:n},{x:t,y:r,zoom:o},s=!1,i=[1,1]){const a={x:(e-t)/o,y:(n-r)/o};return s?Ki(a,i):a}function Cp(e,n){return{x:Math.min(e.x,n.x),y:Math.min(e.y,n.y),x2:Math.max(e.x2,n.x2),y2:Math.max(e.y2,n.y2)}}function fi({x:e,y:n,width:t,height:r}){return{x:e,y:n,x2:e+t,y2:n+r}}function Sp({x:e,y:n,x2:t,y2:r}){return{x:e,y:n,width:t-e,height:r-n}}function fy(e,n){return Sp(Cp(fi(e),fi(n)))}function ou(e){let n={x:Number.POSITIVE_INFINITY,y:Number.POSITIVE_INFINITY,x2:Number.NEGATIVE_INFINITY,y2:Number.NEGATIVE_INFINITY};for(let t=0;t<e.length;t++){const r=e[t];n=Cp(n,fi({...r.computedPosition,...r.dimensions}))}return Sp(n)}function bp(e,n,t={x:0,y:0,zoom:1},r=!1,o=!1){const s={...Go(n,t),width:n.width/t.zoom,height:n.height/t.zoom},i=[];for(const a of e){const{dimensions:l,selectable:c=!0,hidden:d=!1}=a,f=l.width??a.width??null,h=l.height??a.height??null;if(o&&!c||d)continue;const p=di(s,ci(a)),E=f===null||h===null,b=r&&p>0,T=(f??0)*(h??0);(E||b||p>=T||a.dragging)&&i.push(a)}return i}function cr(e,n){const t=new Set;if(typeof e=="string")t.add(e);else if(e.length>=1)for(const r of e)t.add(r.id);return n.filter(r=>t.has(r.source)||t.has(r.target))}function $r(e,n){if(typeof e=="number")return Math.floor((n-n/(1+e))*.5);if(typeof e=="string"&&e.endsWith("px")){const t=Number.parseFloat(e);if(!Number.isNaN(t))return Math.floor(t)}if(typeof e=="string"&&e.endsWith("%")){const t=Number.parseFloat(e);if(!Number.isNaN(t))return Math.floor(n*t*.01)}return os(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`),0}function py(e,n,t){if(typeof e=="string"||typeof e=="number"){const r=$r(e,t),o=$r(e,n);return{top:r,right:o,bottom:r,left:o,x:o*2,y:r*2}}if(typeof e=="object"){const r=$r(e.top??e.y??0,t),o=$r(e.bottom??e.y??0,t),s=$r(e.left??e.x??0,n),i=$r(e.right??e.x??0,n);return{top:r,right:i,bottom:o,left:s,x:s+i,y:r+o}}return{top:0,right:0,bottom:0,left:0,x:0,y:0}}function hy(e,n,t,r,o,s){const{x:i,y:a}=Wo(e,{x:n,y:t,zoom:r}),{x:l,y:c}=Wo({x:e.x+e.width,y:e.y+e.height},{x:n,y:t,zoom:r}),d=o-l,f=s-c;return{left:Math.floor(i),top:Math.floor(a),right:Math.floor(d),bottom:Math.floor(f)}}function Ec(e,n,t,r,o,s=.1){const i=py(s,n,t),a=(n-i.x)/e.width,l=(t-i.y)/e.height,c=Math.min(a,l),d=Er(c,r,o),f=e.x+e.width/2,h=e.y+e.height/2,p=n/2-f*d,E=t/2-h*d,b=hy(e,p,E,d,n,t),T={left:Math.min(b.left-i.left,0),top:Math.min(b.top-i.top,0),right:Math.min(b.right-i.right,0),bottom:Math.min(b.bottom-i.bottom,0)};return{x:p-T.left+T.right,y:E-T.top+T.bottom,zoom:d}}function vy(e,n){return{x:n.x+e.x,y:n.y+e.y,z:(e.z>n.z?e.z:n.z)+1}}function Ep(e,n){if(!e.parentNode)return!1;const t=n.get(e.parentNode);return t?t.selected?!0:Ep(t,n):!1}function Xo(e,n){return typeof e>"u"?"":typeof e=="string"?e:`${n?`${n}__`:""}${Object.keys(e).sort().map(r=>`${r}=${e[r]}`).join("&")}`}function hl(e){const n=e.ctrlKey&&Yo()?10:1;return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*n}function wc(e,n,t){return e<n?Er(Math.abs(e-n),1,n)/n:e>t?-Er(Math.abs(e-t),1,n)/n:0}function wp(e,n,t=15,r=40){const o=wc(e.x,r,n.width-r)*t,s=wc(e.y,r,n.height-r)*t;return[o,s]}function Pa(e,n){if(n){const t=e.position.x+e.dimensions.width-n.dimensions.width,r=e.position.y+e.dimensions.height-n.dimensions.height;if(t>0||r>0||e.position.x<0||e.position.y<0){let o={};if(typeof n.style=="function"?o={...n.style(n)}:n.style&&(o={...n.style}),o.width=o.width??`${n.dimensions.width}px`,o.height=o.height??`${n.dimensions.height}px`,t>0)if(typeof o.width=="string"){const s=Number(o.width.replace("px",""));o.width=`${s+t}px`}else o.width+=t;if(r>0)if(typeof o.height=="string"){const s=Number(o.height.replace("px",""));o.height=`${s+r}px`}else o.height+=r;if(e.position.x<0){const s=Math.abs(e.position.x);if(n.position.x=n.position.x-s,typeof o.width=="string"){const i=Number(o.width.replace("px",""));o.width=`${i+s}px`}else o.width+=s;e.position.x=0}if(e.position.y<0){const s=Math.abs(e.position.y);if(n.position.y=n.position.y-s,typeof o.height=="string"){const i=Number(o.height.replace("px",""));o.height=`${i+s}px`}else o.height+=s;e.position.y=0}n.dimensions.width=Number(o.width.toString().replace("px","")),n.dimensions.height=Number(o.height.toString().replace("px","")),typeof n.style=="function"?n.style=s=>{const i=n.style;return{...i(s),...o}}:n.style={...n.style,...o}}}}function Ic(e,n){var t,r;const o=e.filter(i=>i.type==="add"||i.type==="remove");for(const i of o)if(i.type==="add")n.findIndex(l=>l.id===i.item.id)===-1&&n.push(i.item);else if(i.type==="remove"){const a=n.findIndex(l=>l.id===i.id);a!==-1&&n.splice(a,1)}const s=n.map(i=>i.id);for(const i of n)for(const a of e)if(a.id===i.id)switch(a.type){case"select":i.selected=a.selected;break;case"position":if(_o(i)&&(typeof a.position<"u"&&(i.position=a.position),typeof a.dragging<"u"&&(i.dragging=a.dragging),i.expandParent&&i.parentNode)){const l=n[s.indexOf(i.parentNode)];l&&_o(l)&&Pa(i,l)}break;case"dimensions":if(_o(i)&&(typeof a.dimensions<"u"&&(i.dimensions=a.dimensions),typeof a.updateStyle<"u"&&a.updateStyle&&(i.style={...i.style||{},width:`${(t=a.dimensions)==null?void 0:t.width}px`,height:`${(r=a.dimensions)==null?void 0:r.height}px`}),typeof a.resizing<"u"&&(i.resizing=a.resizing),i.expandParent&&i.parentNode)){const l=n[s.indexOf(i.parentNode)];l&&_o(l)&&(!!l.dimensions.width&&!!l.dimensions.height?Pa(i,l):fn(()=>{Pa(i,l)}))}break}return n}function Rt(e,n){return{id:e,type:"select",selected:n}}function Pc(e){return{item:e,type:"add"}}function $c(e){return{id:e,type:"remove"}}function xc(e,n,t,r,o){return{id:e,source:n,target:t,sourceHandle:r||null,targetHandle:o||null,type:"remove"}}function Ut(e,n=new Set,t=!1){const r=[];for(const[o,s]of e){const i=n.has(o);!(s.selected===void 0&&!i)&&s.selected!==i&&(t&&(s.selected=i),r.push(Rt(s.id,i)))}return r}const Dc=()=>{};function Pe(e){const n=new Set;let t=Dc,r=()=>!1;const o=()=>n.size>0||r(),s=h=>{t=h},i=()=>{t=Dc},a=h=>{r=h},l=()=>{r=()=>!1},c=h=>{n.delete(h)};return{on:h=>{n.add(h);const p=()=>c(h);return Lo(p),{off:p}},off:c,trigger:h=>{const p=[t];return o()?p.push(...n):e&&p.push(e),Promise.allSettled(p.map(E=>E(h)))},hasListeners:o,listeners:n,setEmitter:s,removeEmitter:i,setHasEmitListeners:a,removeHasEmitListeners:l}}function Mc(e,n,t){let r=e;do{if(r&&r.matches(n))return!0;if(r===t)return!1;r=r.parentElement}while(r);return!1}function my(e,n,t,r){var o,s;const i=new Map;for(const[a,l]of e)(l.selected||l.id===r)&&(!l.parentNode||!Ep(l,e))&&(l.draggable||n&&typeof l.draggable>"u")&&e.get(a)&&i.set(a,{id:l.id,position:l.position||{x:0,y:0},distance:{x:t.x-((o=l.computedPosition)==null?void 0:o.x)||0,y:t.y-((s=l.computedPosition)==null?void 0:s.y)||0},from:{x:l.computedPosition.x,y:l.computedPosition.y},extent:l.extent,parentNode:l.parentNode,dimensions:{...l.dimensions},expandParent:l.expandParent});return Array.from(i.values())}function $a({id:e,dragItems:n,findNode:t}){const r=[];for(const o of n){const s=t(o.id);s&&r.push(s)}return[e?r.find(o=>o.id===e):r[0],r]}function Ip(e){if(Array.isArray(e))switch(e.length){case 1:return[e[0],e[0],e[0],e[0]];case 2:return[e[0],e[1],e[0],e[1]];case 3:return[e[0],e[1],e[2],e[1]];case 4:return e;default:return[0,0,0,0]}return[e,e,e,e]}function _y(e,n,t){const[r,o,s,i]=typeof e!="string"?Ip(e.padding):[0,0,0,0];return t&&typeof t.computedPosition.x<"u"&&typeof t.computedPosition.y<"u"&&typeof t.dimensions.width<"u"&&typeof t.dimensions.height<"u"?[[t.computedPosition.x+i,t.computedPosition.y+r],[t.computedPosition.x+t.dimensions.width-o,t.computedPosition.y+t.dimensions.height-s]]:!1}function gy(e,n,t,r){let o=e.extent||t;if((o==="parent"||!Array.isArray(o)&&(o==null?void 0:o.range)==="parent")&&!e.expandParent)if(e.parentNode&&r&&e.dimensions.width&&e.dimensions.height){const s=_y(o,e,r);s&&(o=s)}else n(new hn(pn.NODE_EXTENT_INVALID,e.id)),o=t;else if(Array.isArray(o)){const s=(r==null?void 0:r.computedPosition.x)||0,i=(r==null?void 0:r.computedPosition.y)||0;o=[[o[0][0]+s,o[0][1]+i],[o[1][0]+s,o[1][1]+i]]}else if(o!=="parent"&&(o!=null&&o.range)&&Array.isArray(o.range)){const[s,i,a,l]=Ip(o.padding),c=(r==null?void 0:r.computedPosition.x)||0,d=(r==null?void 0:r.computedPosition.y)||0;o=[[o.range[0][0]+c+l,o.range[0][1]+d+s],[o.range[1][0]+c-i,o.range[1][1]+d-a]]}return o==="parent"?[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]]:o}function yy({width:e,height:n},t){return[t[0],[t[1][0]-(e||0),t[1][1]-(n||0)]]}function su(e,n,t,r,o){const s=yy(e.dimensions,gy(e,t,r,o)),i=mp(n,s);return{position:{x:i.x-((o==null?void 0:o.computedPosition.x)||0),y:i.y-((o==null?void 0:o.computedPosition.y)||0)},computedPosition:i}}function Gr(e,n,t=De.Left,r=!1){const o=((n==null?void 0:n.x)??0)+e.computedPosition.x,s=((n==null?void 0:n.y)??0)+e.computedPosition.y,{width:i,height:a}=n??Ey(e);if(r)return{x:o+i/2,y:s+a/2};switch((n==null?void 0:n.position)??t){case De.Top:return{x:o+i/2,y:s};case De.Right:return{x:o+i,y:s+a/2};case De.Bottom:return{x:o+i/2,y:s+a};case De.Left:return{x:o,y:s+a/2}}}function kc(e,n){return e&&(n?e.find(t=>t.id===n):e[0])||null}function Cy({sourcePos:e,targetPos:n,sourceWidth:t,sourceHeight:r,targetWidth:o,targetHeight:s,width:i,height:a,viewport:l}){const c={x:Math.min(e.x,n.x),y:Math.min(e.y,n.y),x2:Math.max(e.x+t,n.x+o),y2:Math.max(e.y+r,n.y+s)};c.x===c.x2&&(c.x2+=1),c.y===c.y2&&(c.y2+=1);const d=fi({x:(0-l.x)/l.zoom,y:(0-l.y)/l.zoom,width:i/l.zoom,height:a/l.zoom}),f=Math.max(0,Math.min(d.x2,c.x2)-Math.max(d.x,c.x)),h=Math.max(0,Math.min(d.y2,c.y2)-Math.max(d.y,c.y));return Math.ceil(f*h)>0}function Sy(e,n,t=!1){const r=typeof e.zIndex=="number";let o=r?e.zIndex:0;const s=n(e.source),i=n(e.target);return!s||!i?0:(t&&(o=r?e.zIndex:Math.max(s.computedPosition.z||0,i.computedPosition.z||0)),o)}var pn=(e=>(e.MISSING_STYLES="MISSING_STYLES",e.MISSING_VIEWPORT_DIMENSIONS="MISSING_VIEWPORT_DIMENSIONS",e.NODE_INVALID="NODE_INVALID",e.NODE_NOT_FOUND="NODE_NOT_FOUND",e.NODE_MISSING_PARENT="NODE_MISSING_PARENT",e.NODE_TYPE_MISSING="NODE_TYPE_MISSING",e.NODE_EXTENT_INVALID="NODE_EXTENT_INVALID",e.EDGE_INVALID="EDGE_INVALID",e.EDGE_NOT_FOUND="EDGE_NOT_FOUND",e.EDGE_SOURCE_MISSING="EDGE_SOURCE_MISSING",e.EDGE_TARGET_MISSING="EDGE_TARGET_MISSING",e.EDGE_TYPE_MISSING="EDGE_TYPE_MISSING",e.EDGE_SOURCE_TARGET_SAME="EDGE_SOURCE_TARGET_SAME",e.EDGE_SOURCE_TARGET_MISSING="EDGE_SOURCE_TARGET_MISSING",e.EDGE_ORPHANED="EDGE_ORPHANED",e.USEVUEFLOW_OPTIONS="USEVUEFLOW_OPTIONS",e))(pn||{});const Tc={MISSING_STYLES:()=>"It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly",MISSING_VIEWPORT_DIMENSIONS:()=>"The Vue Flow parent container needs a width and a height to render the graph",NODE_INVALID:e=>`Node is invalid
Node: ${e}`,NODE_NOT_FOUND:e=>`Node not found
Node: ${e}`,NODE_MISSING_PARENT:(e,n)=>`Node is missing a parent
Node: ${e}
Parent: ${n}`,NODE_TYPE_MISSING:e=>`Node type is missing
Type: ${e}`,NODE_EXTENT_INVALID:e=>`Only child nodes can use a parent extent
Node: ${e}`,EDGE_INVALID:e=>`An edge needs a source and a target
Edge: ${e}`,EDGE_SOURCE_MISSING:(e,n)=>`Edge source is missing
Edge: ${e} 
Source: ${n}`,EDGE_TARGET_MISSING:(e,n)=>`Edge target is missing
Edge: ${e} 
Target: ${n}`,EDGE_TYPE_MISSING:e=>`Edge type is missing
Type: ${e}`,EDGE_SOURCE_TARGET_SAME:(e,n,t)=>`Edge source and target are the same
Edge: ${e} 
Source: ${n} 
Target: ${t}`,EDGE_SOURCE_TARGET_MISSING:(e,n,t)=>`Edge source or target is missing
Edge: ${e} 
Source: ${n} 
Target: ${t}`,EDGE_ORPHANED:e=>`Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e}`,EDGE_NOT_FOUND:e=>`Edge not found
Edge: ${e}`,USEVUEFLOW_OPTIONS:()=>"The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"};class hn extends Error{constructor(n,...t){var r;super((r=Tc[n])==null?void 0:r.call(Tc,...t)),this.name="VueFlowError",this.code=n,this.args=t}}function iu(e){return"clientX"in e}function by(e){return"sourceEvent"in e}function rt(e,n){const t=iu(e);let r,o;return t?(r=e.clientX,o=e.clientY):"touches"in e&&e.touches.length>0?(r=e.touches[0].clientX,o=e.touches[0].clientY):"changedTouches"in e&&e.changedTouches.length>0?(r=e.changedTouches[0].clientX,o=e.changedTouches[0].clientY):(r=0,o=0),{x:r-((n==null?void 0:n.left)??0),y:o-((n==null?void 0:n.top)??0)}}const Yo=()=>{var e;return typeof navigator<"u"&&((e=navigator==null?void 0:navigator.userAgent)==null?void 0:e.indexOf("Mac"))>=0};function Ey(e){var n,t;return{width:((n=e.dimensions)==null?void 0:n.width)??e.width??0,height:((t=e.dimensions)==null?void 0:t.height)??e.height??0}}function Ki(e,n=[1,1]){return{x:n[0]*Math.round(e.x/n[0]),y:n[1]*Math.round(e.y/n[1])}}const wy=()=>!0;function xa(e){e==null||e.classList.remove("valid","connecting","vue-flow__handle-valid","vue-flow__handle-connecting")}function Iy(e,n,t){const r=[],o={x:e.x-t,y:e.y-t,width:t*2,height:t*2};for(const s of n.values())di(o,ci(s))>0&&r.push(s);return r}const Py=250;function $y(e,n,t,r){var o,s;let i=[],a=Number.POSITIVE_INFINITY;const l=Iy(e,t,n+Py);for(const c of l){const d=[...((o=c.handleBounds)==null?void 0:o.source)??[],...((s=c.handleBounds)==null?void 0:s.target)??[]];for(const f of d){if(r.nodeId===f.nodeId&&r.type===f.type&&r.id===f.id)continue;const{x:h,y:p}=Gr(c,f,f.position,!0),E=Math.sqrt((h-e.x)**2+(p-e.y)**2);E>n||(E<a?(i=[{...f,x:h,y:p}],a=E):E===a&&i.push({...f,x:h,y:p}))}}if(!i.length)return null;if(i.length>1){const c=r.type==="source"?"target":"source";return i.find(d=>d.type===c)??i[0]}return i[0]}function Vc(e,{handle:n,connectionMode:t,fromNodeId:r,fromHandleId:o,fromType:s,doc:i,lib:a,flowId:l,isValidConnection:c=wy},d,f,h,p){const E=s==="target",b=n?i.querySelector(`.${a}-flow__handle[data-id="${l}-${n==null?void 0:n.nodeId}-${n==null?void 0:n.id}-${n==null?void 0:n.type}"]`):null,{x:T,y:V}=rt(e),z=i.elementFromPoint(T,V),x=z!=null&&z.classList.contains(`${a}-flow__handle`)?z:b,N={handleDomNode:x,isValid:!1,connection:null,toHandle:null};if(x){const re=Pp(void 0,x),ie=x.getAttribute("data-nodeid"),ae=x.getAttribute("data-handleid"),fe=x.classList.contains("connectable"),le=x.classList.contains("connectableend");if(!ie||!re)return N;const Z={source:E?ie:r,sourceHandle:E?ae:o,target:E?r:ie,targetHandle:E?o:ae};N.connection=Z;const M=fe&&le&&(t===Yt.Strict?E&&re==="source"||!E&&re==="target":ie!==r||ae!==o);N.isValid=M&&c(Z,{nodes:f,edges:d,sourceNode:h(Z.source),targetNode:h(Z.target)}),N.toHandle=$p(ie,re,ae,p,t,!0)}return N}function Pp(e,n){return e||(n!=null&&n.classList.contains("target")?"target":n!=null&&n.classList.contains("source")?"source":null)}function xy(e,n){let t=null;return n?t="valid":e&&!n&&(t="invalid"),t}function Dy(e,n){let t=null;return n?t=!0:e&&!n&&(t=!1),t}function $p(e,n,t,r,o,s=!1){var i,a,l;const c=r.get(e);if(!c)return null;const d=o===Yt.Strict?(i=c.handleBounds)==null?void 0:i[n]:[...((a=c.handleBounds)==null?void 0:a.source)??[],...((l=c.handleBounds)==null?void 0:l.target)??[]],f=(t?d==null?void 0:d.find(h=>h.id===t):d==null?void 0:d[0])??null;return f&&s?{...f,...Gr(c,f,f.position,!0)}:f}const vl={[De.Left]:De.Right,[De.Right]:De.Left,[De.Top]:De.Bottom,[De.Bottom]:De.Top},My=["production","prod"];function os(e,...n){xp()&&console.warn(`[Vue Flow]: ${e}`,...n)}function xp(){return!My.includes("production")}function Nc(e,n,t,r,o){const s=n.querySelectorAll(`.vue-flow__handle.${e}`);return s!=null&&s.length?Array.from(s).map(i=>{const a=i.getBoundingClientRect();return{id:i.getAttribute("data-handleid"),type:e,nodeId:o,position:i.getAttribute("data-handlepos"),x:(a.left-t.left)/r,y:(a.top-t.top)/r,...zi(i)}}):null}function ml(e,n,t,r,o,s=!1,i){o.value=!1,e.selected?(s||e.selected&&n)&&(r([e]),fn(()=>{i.blur()})):t([e])}function dn(e){return typeof de(e)<"u"}function ky(e,n,t,r){if(!e||!e.source||!e.target)return t(new hn(pn.EDGE_INVALID,(e==null?void 0:e.id)??"[ID UNKNOWN]")),!1;let o;return jt(e)?o=e:o={...e,id:yp(e)},o=_p(o,void 0,r),dy(o,n)?!1:o}function Ty(e,n,t,r,o){if(!n.source||!n.target)return o(new hn(pn.EDGE_INVALID,e.id)),!1;if(!t)return o(new hn(pn.EDGE_NOT_FOUND,e.id)),!1;const{id:s,...i}=e;return{...i,id:r?yp(n):s,source:n.source,target:n.target,sourceHandle:n.sourceHandle,targetHandle:n.targetHandle}}function Ac(e,n,t){const r={},o=[];for(let s=0;s<e.length;++s){const i=e[s];if(!_r(i)){t(new hn(pn.NODE_INVALID,i==null?void 0:i.id)||`[ID UNKNOWN|INDEX ${s}]`);continue}const a=ly(i,n(i.id),i.parentNode);i.parentNode&&(r[i.parentNode]=!0),o[s]=a}for(const s of o){const i=n(s.parentNode)||o.find(a=>a.id===s.parentNode);s.parentNode&&!i&&t(new hn(pn.NODE_MISSING_PARENT,s.id,s.parentNode)),(s.parentNode||r[s.id])&&(r[s.id]&&(s.isParent=!0),i&&(i.isParent=!0))}return o}function Fc(e,n,t,r,o,s){let i=o;const a=r.get(i)||new Map;r.set(i,a.set(t,n)),i=`${o}-${e}`;const l=r.get(i)||new Map;if(r.set(i,l.set(t,n)),s){i=`${o}-${e}-${s}`;const c=r.get(i)||new Map;r.set(i,c.set(t,n))}}function Da(e,n,t){e.clear();for(const r of t){const{source:o,target:s,sourceHandle:i=null,targetHandle:a=null}=r,l={edgeId:r.id,source:o,target:s,sourceHandle:i,targetHandle:a},c=`${o}-${i}--${s}-${a}`,d=`${s}-${a}--${o}-${i}`;Fc("source",l,d,e,o,i),Fc("target",l,c,e,s,a)}}function Oc(e,n){if(e.size!==n.size)return!1;for(const t of e)if(!n.has(t))return!1;return!0}function Ma(e,n,t,r,o,s,i,a){const l=[];for(const c of e){const d=jt(c)?c:ky(c,a,o,s);if(!d)continue;const f=t(d.source),h=t(d.target);if(!f||!h){o(new hn(pn.EDGE_SOURCE_TARGET_MISSING,d.id,d.source,d.target));continue}if(!f){o(new hn(pn.EDGE_SOURCE_MISSING,d.id,d.source));continue}if(!h){o(new hn(pn.EDGE_TARGET_MISSING,d.id,d.target));continue}if(n&&!n(d,{edges:a,nodes:i,sourceNode:f,targetNode:h})){o(new hn(pn.EDGE_INVALID,d.id));continue}const p=r(d.id);l.push({..._p(d,p,s),sourceNode:f,targetNode:h})}return l}const Rc=Symbol("vueFlow"),Dp=Symbol("nodeId"),Mp=Symbol("nodeRef"),Vy=Symbol("edgeId"),Ny=Symbol("edgeRef"),Wi=Symbol("slots");function kp(e){const{vueFlowRef:n,snapToGrid:t,snapGrid:r,noDragClassName:o,nodeLookup:s,nodeExtent:i,nodeDragThreshold:a,viewport:l,autoPanOnNodeDrag:c,autoPanSpeed:d,nodesDraggable:f,panBy:h,findNode:p,multiSelectionActive:E,nodesSelectionActive:b,selectNodesOnDrag:T,removeSelectedElements:V,addSelectedNodes:z,updateNodePositions:x,emits:N}=nn(),{onStart:re,onDrag:ie,onStop:ae,onClick:fe,el:le,disabled:Z,id:ne,selectable:M,dragHandle:q}=e,v=Wt(!1);let X=[],w,Y=null,K={x:void 0,y:void 0},j={x:0,y:0},J=null,te=!1,pe=!1,ye=0,ge=!1;const _e=Oy(),Se=({x:m,y:F})=>{K={x:m,y:F};let g=!1;if(X=X.map(S=>{const P={x:m-S.distance.x,y:F-S.distance.y},{computedPosition:A}=su(S,t.value?Ki(P,r.value):P,N.error,i.value,S.parentNode?p(S.parentNode):void 0);return g=g||S.position.x!==A.x||S.position.y!==A.y,S.position=A,S}),pe=pe||g,!!g&&(x(X,!0,!0),v.value=!0,J)){const[S,P]=$a({id:ne,dragItems:X,findNode:p});ie({event:J,node:S,nodes:P})}},be=()=>{if(!Y)return;const[m,F]=wp(j,Y,d.value);if(m!==0||F!==0){const g={x:(K.x??0)-m/l.value.zoom,y:(K.y??0)-F/l.value.zoom};h({x:m,y:F})&&Se(g)}ye=requestAnimationFrame(be)},Me=(m,F)=>{te=!0;const g=p(ne);!T.value&&!E.value&&g&&(g.selected||V()),g&&Ge(M)&&T.value&&ml(g,E.value,z,V,b,!1,F);const S=_e(m.sourceEvent);if(K=S,X=my(s.value,f.value,S,ne),X.length){const[P,A]=$a({id:ne,dragItems:X,findNode:p});re({event:m.sourceEvent,node:P,nodes:A})}},Oe=(m,F)=>{var g;m.sourceEvent.type==="touchmove"&&m.sourceEvent.touches.length>1||(pe=!1,a.value===0&&Me(m,F),K=_e(m.sourceEvent),Y=((g=n.value)==null?void 0:g.getBoundingClientRect())||null,j=rt(m.sourceEvent,Y))},ke=(m,F)=>{const g=_e(m.sourceEvent);if(!ge&&te&&c.value&&(ge=!0,be()),!te){const S=g.xSnapped-(K.x??0),P=g.ySnapped-(K.y??0);Math.sqrt(S*S+P*P)>a.value&&Me(m,F)}(K.x!==g.xSnapped||K.y!==g.ySnapped)&&X.length&&te&&(J=m.sourceEvent,j=rt(m.sourceEvent,Y),Se(g))},Ve=m=>{let F=!1;if(!te&&!v.value&&!E.value){const g=m.sourceEvent,S=_e(g),P=S.xSnapped-(K.x??0),A=S.ySnapped-(K.y??0),L=Math.sqrt(P*P+A*A);L!==0&&L<=a.value&&(fe==null||fe(g),F=!0)}if(X.length&&!F){pe&&(x(X,!1,!1),pe=!1);const[g,S]=$a({id:ne,dragItems:X,findNode:p});ae({event:m.sourceEvent,node:g,nodes:S})}X=[],v.value=!1,ge=!1,te=!1,K={x:void 0,y:void 0},cancelAnimationFrame(ye)};return Be([()=>Ge(Z),le],([m,F],g,S)=>{if(F){const P=Hn(F);m||(w=a_().on("start",A=>Oe(A,F)).on("drag",A=>ke(A,F)).on("end",A=>Ve(A)).filter(A=>{const L=A.target,se=Ge(q);return!A.button&&(!o.value||!Mc(L,`.${o.value}`,F)&&(!se||Mc(L,se,F)))}),P.call(w)),S(()=>{P.on(".drag",null),w&&(w.on("start",null),w.on("drag",null),w.on("end",null))})}}),v}function Ay(){return{doubleClick:Pe(),click:Pe(),mouseEnter:Pe(),mouseMove:Pe(),mouseLeave:Pe(),contextMenu:Pe(),updateStart:Pe(),update:Pe(),updateEnd:Pe()}}function Fy(e,n){const t=Ay();return t.doubleClick.on(r=>{var o,s;n.edgeDoubleClick(r),(s=(o=e.events)==null?void 0:o.doubleClick)==null||s.call(o,r)}),t.click.on(r=>{var o,s;n.edgeClick(r),(s=(o=e.events)==null?void 0:o.click)==null||s.call(o,r)}),t.mouseEnter.on(r=>{var o,s;n.edgeMouseEnter(r),(s=(o=e.events)==null?void 0:o.mouseEnter)==null||s.call(o,r)}),t.mouseMove.on(r=>{var o,s;n.edgeMouseMove(r),(s=(o=e.events)==null?void 0:o.mouseMove)==null||s.call(o,r)}),t.mouseLeave.on(r=>{var o,s;n.edgeMouseLeave(r),(s=(o=e.events)==null?void 0:o.mouseLeave)==null||s.call(o,r)}),t.contextMenu.on(r=>{var o,s;n.edgeContextMenu(r),(s=(o=e.events)==null?void 0:o.contextMenu)==null||s.call(o,r)}),t.updateStart.on(r=>{var o,s;n.edgeUpdateStart(r),(s=(o=e.events)==null?void 0:o.updateStart)==null||s.call(o,r)}),t.update.on(r=>{var o,s;n.edgeUpdate(r),(s=(o=e.events)==null?void 0:o.update)==null||s.call(o,r)}),t.updateEnd.on(r=>{var o,s;n.edgeUpdateEnd(r),(s=(o=e.events)==null?void 0:o.updateEnd)==null||s.call(o,r)}),Object.entries(t).reduce((r,[o,s])=>(r.emit[o]=s.trigger,r.on[o]=s.on,r),{emit:{},on:{}})}function Oy(){const{viewport:e,snapGrid:n,snapToGrid:t,vueFlowRef:r}=nn();return o=>{var s;const i=((s=r.value)==null?void 0:s.getBoundingClientRect())??{left:0,top:0},a=by(o)?o.sourceEvent:o,{x:l,y:c}=rt(a,i),d=Go({x:l,y:c},e.value),{x:f,y:h}=t.value?Ki(d,n.value):d;return{xSnapped:f,ySnapped:h,...d}}}function Ss(){return!0}function Tp({handleId:e,nodeId:n,type:t,isValidConnection:r,edgeUpdaterType:o,onEdgeUpdate:s,onEdgeUpdateEnd:i}){const{id:a,vueFlowRef:l,connectionMode:c,connectionRadius:d,connectOnClick:f,connectionClickStartHandle:h,nodesConnectable:p,autoPanOnConnect:E,autoPanSpeed:b,findNode:T,panBy:V,startConnection:z,updateConnection:x,endConnection:N,emits:re,viewport:ie,edges:ae,nodes:fe,isValidConnection:le,nodeLookup:Z}=nn();let ne=null,M=!1,q=null;function v(w){var Y;const K=Ge(t)==="target",j=iu(w),J=bc(w.target),te=w.currentTarget;if(te&&(j&&w.button===0||!j)){let pe=function(B){g=rt(B,Ve),Se=$y(Go(g,ie.value,!1,[1,1]),d.value,Z.value,A),S||(P(),S=!0);const ee=Vc(B,{handle:Se,connectionMode:c.value,fromNodeId:Ge(n),fromHandleId:Ge(e),fromType:K?"target":"source",isValidConnection:_e,doc:J,lib:"vue",flowId:a,nodeLookup:Z.value},ae.value,fe.value,T,Z.value);q=ee.handleDomNode,ne=ee.connection,M=Dy(!!Se,ee.isValid);const U={..._,isValid:M,to:ee.toHandle&&M?Wo({x:ee.toHandle.x,y:ee.toHandle.y},ie.value):g,toHandle:ee.toHandle,toPosition:M&&ee.toHandle?ee.toHandle.position:vl[A.position],toNode:ee.toHandle?Z.value.get(ee.toHandle.nodeId):null};if(M&&Se&&(_!=null&&_.toHandle)&&U.toHandle&&_.toHandle.type===U.toHandle.type&&_.toHandle.nodeId===U.toHandle.nodeId&&_.toHandle.id===U.toHandle.id&&_.to.x===U.to.x&&_.to.y===U.to.y)return;const D=Se??ee.toHandle;if(x(D&&M?Wo({x:D.x,y:D.y},ie.value):g,D,xy(!!D,M)),_=U,!Se&&!M&&!q)return xa(F);ne&&ne.source!==ne.target&&q&&(xa(F),F=q,q.classList.add("connecting","vue-flow__handle-connecting"),q.classList.toggle("valid",!!M),q.classList.toggle("vue-flow__handle-valid",!!M))},ye=function(B){"touches"in B&&B.touches.length>0||((Se||q)&&ne&&M&&(s?s(B,ne):re.connect(ne)),re.connectEnd(B),o&&(i==null||i(B)),xa(F),cancelAnimationFrame(be),N(B),S=!1,M=!1,ne=null,q=null,J.removeEventListener("mousemove",pe),J.removeEventListener("mouseup",ye),J.removeEventListener("touchmove",pe),J.removeEventListener("touchend",ye))};const ge=T(Ge(n));let _e=Ge(r)||le.value||Ss;!_e&&ge&&(_e=(K?ge.isValidSourcePos:ge.isValidTargetPos)||Ss);let Se,be=0;const{x:Me,y:Oe}=rt(w),ke=Pp(Ge(o),te),Ve=(Y=l.value)==null?void 0:Y.getBoundingClientRect();if(!Ve||!ke)return;const m=$p(Ge(n),ke,Ge(e),Z.value,c.value);if(!m)return;let F,g=rt(w,Ve),S=!1;const P=()=>{if(!E.value)return;const[B,ee]=wp(g,Ve,b.value);V({x:B,y:ee}),be=requestAnimationFrame(P)},A={...m,nodeId:Ge(n),type:ke,position:m.position},L=Z.value.get(Ge(n)),O={inProgress:!0,isValid:null,from:Gr(L,A,De.Left,!0),fromHandle:A,fromPosition:A.position,fromNode:L,to:g,toHandle:null,toPosition:vl[A.position],toNode:null};z({nodeId:Ge(n),id:Ge(e),type:ke,position:(te==null?void 0:te.getAttribute("data-handlepos"))||De.Top,...g},{x:Me-Ve.left,y:Oe-Ve.top}),re.connectStart({event:w,nodeId:Ge(n),handleId:Ge(e),handleType:ke});let _=O;J.addEventListener("mousemove",pe),J.addEventListener("mouseup",ye),J.addEventListener("touchmove",pe),J.addEventListener("touchend",ye)}}function X(w){var Y,K;if(!f.value)return;const j=Ge(t)==="target";if(!h.value){re.clickConnectStart({event:w,nodeId:Ge(n),handleId:Ge(e)}),z({nodeId:Ge(n),type:Ge(t),id:Ge(e),position:De.Top,...rt(w)},void 0,!0);return}let J=Ge(r)||le.value||Ss;const te=T(Ge(n));if(!J&&te&&(J=(j?te.isValidSourcePos:te.isValidTargetPos)||Ss),te&&(typeof te.connectable>"u"?p.value:te.connectable)===!1)return;const pe=bc(w.target),ye=Vc(w,{handle:{nodeId:Ge(n),id:Ge(e),type:Ge(t),position:De.Top,...rt(w)},connectionMode:c.value,fromNodeId:h.value.nodeId,fromHandleId:h.value.id??null,fromType:h.value.type,isValidConnection:J,doc:pe,lib:"vue",flowId:a,nodeLookup:Z.value},ae.value,fe.value,T,Z.value),ge=((Y=ye.connection)==null?void 0:Y.source)===((K=ye.connection)==null?void 0:K.target);ye.isValid&&ye.connection&&!ge&&re.connect(ye.connection),re.clickConnectEnd(w),N(w,!0)}return{handlePointerDown:v,handleClick:X}}function Ry(){return Vn(Dp,"")}function Vp(e){const n=e??Ry()??"",t=Vn(Mp,Ee(null)),{findNode:r,edges:o,emits:s}=nn(),i=r(n);return i||s.error(new hn(pn.NODE_NOT_FOUND,n)),{id:n,nodeEl:t,node:i,parentNode:ue(()=>r(i.parentNode)),connectedEdges:ue(()=>cr([i],o.value))}}function By(){return{doubleClick:Pe(),click:Pe(),mouseEnter:Pe(),mouseMove:Pe(),mouseLeave:Pe(),contextMenu:Pe(),dragStart:Pe(),drag:Pe(),dragStop:Pe()}}function Ly(e,n){const t=By();return t.doubleClick.on(r=>{var o,s;n.nodeDoubleClick(r),(s=(o=e.events)==null?void 0:o.doubleClick)==null||s.call(o,r)}),t.click.on(r=>{var o,s;n.nodeClick(r),(s=(o=e.events)==null?void 0:o.click)==null||s.call(o,r)}),t.mouseEnter.on(r=>{var o,s;n.nodeMouseEnter(r),(s=(o=e.events)==null?void 0:o.mouseEnter)==null||s.call(o,r)}),t.mouseMove.on(r=>{var o,s;n.nodeMouseMove(r),(s=(o=e.events)==null?void 0:o.mouseMove)==null||s.call(o,r)}),t.mouseLeave.on(r=>{var o,s;n.nodeMouseLeave(r),(s=(o=e.events)==null?void 0:o.mouseLeave)==null||s.call(o,r)}),t.contextMenu.on(r=>{var o,s;n.nodeContextMenu(r),(s=(o=e.events)==null?void 0:o.contextMenu)==null||s.call(o,r)}),t.dragStart.on(r=>{var o,s;n.nodeDragStart(r),(s=(o=e.events)==null?void 0:o.dragStart)==null||s.call(o,r)}),t.drag.on(r=>{var o,s;n.nodeDrag(r),(s=(o=e.events)==null?void 0:o.drag)==null||s.call(o,r)}),t.dragStop.on(r=>{var o,s;n.nodeDragStop(r),(s=(o=e.events)==null?void 0:o.dragStop)==null||s.call(o,r)}),Object.entries(t).reduce((r,[o,s])=>(r.emit[o]=s.trigger,r.on[o]=s.on,r),{emit:{},on:{}})}function Np(){const{getSelectedNodes:e,nodeExtent:n,updateNodePositions:t,findNode:r,snapGrid:o,snapToGrid:s,nodesDraggable:i,emits:a}=nn();return(l,c=!1)=>{const d=s.value?o.value[0]:5,f=s.value?o.value[1]:5,h=c?4:1,p=l.x*d*h,E=l.y*f*h,b=[];for(const T of e.value)if(T.draggable||i&&typeof T.draggable>"u"){const V={x:T.computedPosition.x+p,y:T.computedPosition.y+E},{position:z}=su(T,V,a.error,n.value,T.parentNode?r(T.parentNode):void 0);b.push({id:T.id,position:z,from:T.position,distance:{x:l.x,y:l.y},dimensions:T.dimensions})}t(b,!0,!1)}}const bs=.1,Uy=e=>((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2;function Ot(){return os("Viewport not initialized yet."),Promise.resolve(!1)}const Hy={zoomIn:Ot,zoomOut:Ot,zoomTo:Ot,fitView:Ot,setCenter:Ot,fitBounds:Ot,project:e=>e,screenToFlowCoordinate:e=>e,flowToScreenCoordinate:e=>e,setViewport:Ot,setTransform:Ot,getViewport:()=>({x:0,y:0,zoom:1}),getTransform:()=>({x:0,y:0,zoom:1}),viewportInitialized:!1};function zy(e){function n(r,o){return new Promise(s=>{e.d3Selection&&e.d3Zoom?e.d3Zoom.interpolate((o==null?void 0:o.interpolate)==="linear"?Do:Fs).scaleBy(ka(e.d3Selection,o==null?void 0:o.duration,o==null?void 0:o.ease,()=>{s(!0)}),r):s(!1)})}function t(r,o,s,i){return new Promise(a=>{var l;const{x:c,y:d}=mp({x:-r,y:-o},e.translateExtent),f=Wr.translate(-c,-d).scale(s);e.d3Selection&&e.d3Zoom?(l=e.d3Zoom)==null||l.interpolate((i==null?void 0:i.interpolate)==="linear"?Do:Fs).transform(ka(e.d3Selection,i==null?void 0:i.duration,i==null?void 0:i.ease,()=>{a(!0)}),f):a(!1)})}return ue(()=>e.d3Zoom&&e.d3Selection&&e.dimensions.width&&e.dimensions.height?{viewportInitialized:!0,zoomIn:o=>n(1.2,o),zoomOut:o=>n(1/1.2,o),zoomTo:(o,s)=>new Promise(i=>{e.d3Selection&&e.d3Zoom?e.d3Zoom.interpolate((s==null?void 0:s.interpolate)==="linear"?Do:Fs).scaleTo(ka(e.d3Selection,s==null?void 0:s.duration,s==null?void 0:s.ease,()=>{i(!0)}),o):i(!1)}),setViewport:(o,s)=>t(o.x,o.y,o.zoom,s),setTransform:(o,s)=>t(o.x,o.y,o.zoom,s),getViewport:()=>({x:e.viewport.x,y:e.viewport.y,zoom:e.viewport.zoom}),getTransform:()=>({x:e.viewport.x,y:e.viewport.y,zoom:e.viewport.zoom}),fitView:(o={padding:bs,includeHiddenNodes:!1,duration:0})=>{var s,i;const a=[];for(const h of e.nodes)h.dimensions.width&&h.dimensions.height&&((o==null?void 0:o.includeHiddenNodes)||!h.hidden)&&(!((s=o.nodes)!=null&&s.length)||(i=o.nodes)!=null&&i.length&&o.nodes.includes(h.id))&&a.push(h);if(!a.length)return Promise.resolve(!1);const l=ou(a),{x:c,y:d,zoom:f}=Ec(l,e.dimensions.width,e.dimensions.height,o.minZoom??e.minZoom,o.maxZoom??e.maxZoom,o.padding??bs);return t(c,d,f,o)},setCenter:(o,s,i)=>{const a=typeof(i==null?void 0:i.zoom)<"u"?i.zoom:e.maxZoom,l=e.dimensions.width/2-o*a,c=e.dimensions.height/2-s*a;return t(l,c,a,i)},fitBounds:(o,s={padding:bs})=>{const{x:i,y:a,zoom:l}=Ec(o,e.dimensions.width,e.dimensions.height,e.minZoom,e.maxZoom,s.padding??bs);return t(i,a,l,s)},project:o=>Go(o,e.viewport,e.snapToGrid,e.snapGrid),screenToFlowCoordinate:o=>{if(e.vueFlowRef){const{x:s,y:i}=e.vueFlowRef.getBoundingClientRect(),a={x:o.x-s,y:o.y-i};return Go(a,e.viewport,e.snapToGrid,e.snapGrid)}return{x:0,y:0}},flowToScreenCoordinate:o=>{if(e.vueFlowRef){const{x:s,y:i}=e.vueFlowRef.getBoundingClientRect(),a={x:o.x+s,y:o.y+i};return Wo(a,e.viewport)}return{x:0,y:0}}}:Hy)}function ka(e,n=0,t=Uy,r=()=>{}){const o=typeof n=="number"&&n>0;return o||r(),o?e.transition().duration(n).ease(t).on("end",r):e}function Ky(e,n,t){const r=xd(!0);return r.run(()=>{const o=()=>{r.run(()=>{let b,T,V=!!(t.nodes.value.length||t.edges.value.length);b=Pr([e.modelValue,()=>{var z,x;return(x=(z=e.modelValue)==null?void 0:z.value)==null?void 0:x.length}],([z])=>{z&&Array.isArray(z)&&(T==null||T.pause(),t.setElements(z),!T&&!V&&z.length?V=!0:T==null||T.resume())}),T=Pr([t.nodes,t.edges,()=>t.edges.value.length,()=>t.nodes.value.length],([z,x])=>{var N;(N=e.modelValue)!=null&&N.value&&Array.isArray(e.modelValue.value)&&(b==null||b.pause(),e.modelValue.value=[...z,...x],fn(()=>{b==null||b.resume()}))},{immediate:V}),ks(()=>{b==null||b.stop(),T==null||T.stop()})})},s=()=>{r.run(()=>{let b,T,V=!!t.nodes.value.length;b=Pr([e.nodes,()=>{var z,x;return(x=(z=e.nodes)==null?void 0:z.value)==null?void 0:x.length}],([z])=>{z&&Array.isArray(z)&&(T==null||T.pause(),t.setNodes(z),!T&&!V&&z.length?V=!0:T==null||T.resume())}),T=Pr([t.nodes,()=>t.nodes.value.length],([z])=>{var x;(x=e.nodes)!=null&&x.value&&Array.isArray(e.nodes.value)&&(b==null||b.pause(),e.nodes.value=[...z],fn(()=>{b==null||b.resume()}))},{immediate:V}),ks(()=>{b==null||b.stop(),T==null||T.stop()})})},i=()=>{r.run(()=>{let b,T,V=!!t.edges.value.length;b=Pr([e.edges,()=>{var z,x;return(x=(z=e.edges)==null?void 0:z.value)==null?void 0:x.length}],([z])=>{z&&Array.isArray(z)&&(T==null||T.pause(),t.setEdges(z),!T&&!V&&z.length?V=!0:T==null||T.resume())}),T=Pr([t.edges,()=>t.edges.value.length],([z])=>{var x;(x=e.edges)!=null&&x.value&&Array.isArray(e.edges.value)&&(b==null||b.pause(),e.edges.value=[...z],fn(()=>{b==null||b.resume()}))},{immediate:V}),ks(()=>{b==null||b.stop(),T==null||T.stop()})})},a=()=>{r.run(()=>{Be(()=>n.maxZoom,()=>{n.maxZoom&&dn(n.maxZoom)&&t.setMaxZoom(n.maxZoom)},{immediate:!0})})},l=()=>{r.run(()=>{Be(()=>n.minZoom,()=>{n.minZoom&&dn(n.minZoom)&&t.setMinZoom(n.minZoom)},{immediate:!0})})},c=()=>{r.run(()=>{Be(()=>n.translateExtent,()=>{n.translateExtent&&dn(n.translateExtent)&&t.setTranslateExtent(n.translateExtent)},{immediate:!0})})},d=()=>{r.run(()=>{Be(()=>n.nodeExtent,()=>{n.nodeExtent&&dn(n.nodeExtent)&&t.setNodeExtent(n.nodeExtent)},{immediate:!0})})},f=()=>{r.run(()=>{Be(()=>n.applyDefault,()=>{dn(n.applyDefault)&&(t.applyDefault.value=n.applyDefault)},{immediate:!0})})},h=()=>{r.run(()=>{const b=async T=>{let V=T;typeof n.autoConnect=="function"&&(V=await n.autoConnect(T)),V!==!1&&t.addEdges([V])};Be(()=>n.autoConnect,()=>{dn(n.autoConnect)&&(t.autoConnect.value=n.autoConnect)},{immediate:!0}),Be(t.autoConnect,(T,V,z)=>{T?t.onConnect(b):t.hooks.value.connect.off(b),z(()=>{t.hooks.value.connect.off(b)})},{immediate:!0})})},p=()=>{const b=["id","modelValue","translateExtent","nodeExtent","edges","nodes","maxZoom","minZoom","applyDefault","autoConnect"];for(const T of Object.keys(n)){const V=T;if(!b.includes(V)){const z=Ye(()=>n[V]),x=t[V];cn(x)&&r.run(()=>{Be(z,N=>{dn(N)&&(x.value=N)},{immediate:!0})})}}};(()=>{o(),s(),i(),l(),a(),c(),d(),f(),h(),p()})()}),()=>r.stop()}function Wy(){return{edgesChange:Pe(),nodesChange:Pe(),nodeDoubleClick:Pe(),nodeClick:Pe(),nodeMouseEnter:Pe(),nodeMouseMove:Pe(),nodeMouseLeave:Pe(),nodeContextMenu:Pe(),nodeDragStart:Pe(),nodeDrag:Pe(),nodeDragStop:Pe(),nodesInitialized:Pe(),miniMapNodeClick:Pe(),miniMapNodeDoubleClick:Pe(),miniMapNodeMouseEnter:Pe(),miniMapNodeMouseMove:Pe(),miniMapNodeMouseLeave:Pe(),connect:Pe(),connectStart:Pe(),connectEnd:Pe(),clickConnectStart:Pe(),clickConnectEnd:Pe(),paneReady:Pe(),init:Pe(),move:Pe(),moveStart:Pe(),moveEnd:Pe(),selectionDragStart:Pe(),selectionDrag:Pe(),selectionDragStop:Pe(),selectionContextMenu:Pe(),selectionStart:Pe(),selectionEnd:Pe(),viewportChangeStart:Pe(),viewportChange:Pe(),viewportChangeEnd:Pe(),paneScroll:Pe(),paneClick:Pe(),paneContextMenu:Pe(),paneMouseEnter:Pe(),paneMouseMove:Pe(),paneMouseLeave:Pe(),edgeContextMenu:Pe(),edgeMouseEnter:Pe(),edgeMouseMove:Pe(),edgeMouseLeave:Pe(),edgeDoubleClick:Pe(),edgeClick:Pe(),edgeUpdateStart:Pe(),edgeUpdate:Pe(),edgeUpdateEnd:Pe(),updateNodeInternals:Pe(),error:Pe(e=>os(e.message))}}function Gy(e,n){const t=Qt();tf(()=>{for(const[o,s]of Object.entries(n.value)){const i=a=>{e(o,a)};s.setEmitter(i),Lo(s.removeEmitter),s.setHasEmitListeners(()=>r(o)),Lo(s.removeHasEmitListeners)}});function r(o){var s;const i=Xy(o);return!!((s=t==null?void 0:t.vnode.props)==null?void 0:s[i])}}function Xy(e){const[n,...t]=e.split(":");return`on${n.replace(/(?:^|-)(\w)/g,(o,s)=>s.toUpperCase())}${t.length?`:${t.join(":")}`:""}`}function Ap(){return{vueFlowRef:null,viewportRef:null,nodes:[],edges:[],connectionLookup:new Map,nodeTypes:{},edgeTypes:{},initialized:!1,dimensions:{width:0,height:0},viewport:{x:0,y:0,zoom:1},d3Zoom:null,d3Selection:null,d3ZoomHandler:null,minZoom:.5,maxZoom:2,translateExtent:[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]],nodeExtent:[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]],selectionMode:ru.Full,paneDragging:!1,preventScrolling:!0,zoomOnScroll:!0,zoomOnPinch:!0,zoomOnDoubleClick:!0,panOnScroll:!1,panOnScrollSpeed:.5,panOnScrollMode:Mo.Free,paneClickDistance:0,panOnDrag:!0,edgeUpdaterRadius:10,onlyRenderVisibleElements:!1,defaultViewport:{x:0,y:0,zoom:1},nodesSelectionActive:!1,userSelectionActive:!1,userSelectionRect:null,defaultMarkerColor:"#b1b1b7",connectionLineStyle:{},connectionLineType:null,connectionLineOptions:{type:ur.Bezier,style:{}},connectionMode:Yt.Loose,connectionStartHandle:null,connectionEndHandle:null,connectionClickStartHandle:null,connectionPosition:{x:Number.NaN,y:Number.NaN},connectionRadius:20,connectOnClick:!0,connectionStatus:null,isValidConnection:null,snapGrid:[15,15],snapToGrid:!1,edgesUpdatable:!1,edgesFocusable:!0,nodesFocusable:!0,nodesConnectable:!0,nodesDraggable:!0,nodeDragThreshold:1,elementsSelectable:!0,selectNodesOnDrag:!0,multiSelectionActive:!1,selectionKeyCode:"Shift",multiSelectionKeyCode:Yo()?"Meta":"Control",zoomActivationKeyCode:Yo()?"Meta":"Control",deleteKeyCode:"Backspace",panActivationKeyCode:"Space",hooks:Wy(),applyDefault:!0,autoConnect:!1,fitViewOnInit:!1,fitViewOnInitDone:!1,noDragClassName:"nodrag",noWheelClassName:"nowheel",noPanClassName:"nopan",defaultEdgeOptions:void 0,elevateEdgesOnSelect:!1,elevateNodesOnSelect:!0,autoPanOnNodeDrag:!0,autoPanOnConnect:!0,autoPanSpeed:15,disableKeyboardA11y:!1,ariaLiveMessage:""}}const Yy=["id","vueFlowRef","viewportRef","initialized","modelValue","nodes","edges","maxZoom","minZoom","translateExtent","hooks","defaultEdgeOptions"];function jy(e,n,t){const r=zy(e),o=g=>{const S=g??[];e.hooks.updateNodeInternals.trigger(S)},s=g=>cy(g,e.nodes,e.edges),i=g=>uy(g,e.nodes,e.edges),a=g=>cr(g,e.edges),l=({id:g,type:S,nodeId:P})=>{var A;const L=g?`-${S}-${g}`:`-${S}`;return Array.from(((A=e.connectionLookup.get(`${P}${L}`))==null?void 0:A.values())??[])},c=g=>{if(g)return n.value.get(g)},d=g=>{if(g)return t.value.get(g)},f=(g,S,P)=>{var A,L;const se=[];for(const O of g){const _={id:O.id,type:"position",dragging:P,from:O.from};if(S&&(_.position=O.position,O.parentNode)){const B=c(O.parentNode);_.position={x:_.position.x-(((A=B==null?void 0:B.computedPosition)==null?void 0:A.x)??0),y:_.position.y-(((L=B==null?void 0:B.computedPosition)==null?void 0:L.y)??0)}}se.push(_)}se!=null&&se.length&&e.hooks.nodesChange.trigger(se)},h=g=>{if(!e.vueFlowRef)return;const S=e.vueFlowRef.querySelector(".vue-flow__transformationpane");if(!S)return;const P=window.getComputedStyle(S),{m22:A}=new window.DOMMatrixReadOnly(P.transform),L=[];for(const se of g){const O=se,_=c(O.id);if(_){const B=zi(O.nodeElement);if(!!(B.width&&B.height&&(_.dimensions.width!==B.width||_.dimensions.height!==B.height||O.forceUpdate))){const U=O.nodeElement.getBoundingClientRect();_.dimensions=B,_.handleBounds.source=Nc("source",O.nodeElement,U,A,_.id),_.handleBounds.target=Nc("target",O.nodeElement,U,A,_.id),L.push({id:_.id,type:"dimensions",dimensions:B})}}}!e.fitViewOnInitDone&&e.fitViewOnInit&&r.value.fitView().then(()=>{e.fitViewOnInitDone=!0}),L.length&&e.hooks.nodesChange.trigger(L)},p=(g,S)=>{const P=new Set,A=new Set;for(const O of g)_r(O)?P.add(O.id):jt(O)&&A.add(O.id);const L=Ut(n.value,P,!0),se=Ut(t.value,A);if(e.multiSelectionActive){for(const O of P)L.push(Rt(O,S));for(const O of A)se.push(Rt(O,S))}L.length&&e.hooks.nodesChange.trigger(L),se.length&&e.hooks.edgesChange.trigger(se)},E=g=>{if(e.multiSelectionActive){const S=g.map(P=>Rt(P.id,!0));e.hooks.nodesChange.trigger(S);return}e.hooks.nodesChange.trigger(Ut(n.value,new Set(g.map(S=>S.id)),!0)),e.hooks.edgesChange.trigger(Ut(t.value))},b=g=>{if(e.multiSelectionActive){const S=g.map(P=>Rt(P.id,!0));e.hooks.edgesChange.trigger(S);return}e.hooks.edgesChange.trigger(Ut(t.value,new Set(g.map(S=>S.id)))),e.hooks.nodesChange.trigger(Ut(n.value,new Set,!0))},T=g=>{p(g,!0)},V=g=>{const P=(g||e.nodes).map(A=>(A.selected=!1,Rt(A.id,!1)));e.hooks.nodesChange.trigger(P)},z=g=>{const P=(g||e.edges).map(A=>(A.selected=!1,Rt(A.id,!1)));e.hooks.edgesChange.trigger(P)},x=g=>{if(!g||!g.length)return p([],!1);const S=g.reduce((P,A)=>{const L=Rt(A.id,!1);return _r(A)?P.nodes.push(L):P.edges.push(L),P},{nodes:[],edges:[]});S.nodes.length&&e.hooks.nodesChange.trigger(S.nodes),S.edges.length&&e.hooks.edgesChange.trigger(S.edges)},N=g=>{var S;(S=e.d3Zoom)==null||S.scaleExtent([g,e.maxZoom]),e.minZoom=g},re=g=>{var S;(S=e.d3Zoom)==null||S.scaleExtent([e.minZoom,g]),e.maxZoom=g},ie=g=>{var S;(S=e.d3Zoom)==null||S.translateExtent(g),e.translateExtent=g},ae=g=>{e.nodeExtent=g,o()},fe=g=>{var S;(S=e.d3Zoom)==null||S.clickDistance(g)},le=g=>{e.nodesDraggable=g,e.nodesConnectable=g,e.elementsSelectable=g},Z=g=>{const S=g instanceof Function?g(e.nodes):g;!e.initialized&&!S.length||(e.nodes=Ac(S,c,e.hooks.error.trigger))},ne=g=>{const S=g instanceof Function?g(e.edges):g;if(!e.initialized&&!S.length)return;const P=Ma(S,e.isValidConnection,c,d,e.hooks.error.trigger,e.defaultEdgeOptions,e.nodes,e.edges);Da(e.connectionLookup,t.value,P),e.edges=P},M=g=>{const S=g instanceof Function?g([...e.nodes,...e.edges]):g;!e.initialized&&!S.length||(Z(S.filter(_r)),ne(S.filter(jt)))},q=g=>{let S=g instanceof Function?g(e.nodes):g;S=Array.isArray(S)?S:[S];const P=Ac(S,c,e.hooks.error.trigger),A=[];for(const L of P)A.push(Pc(L));A.length&&e.hooks.nodesChange.trigger(A)},v=g=>{let S=g instanceof Function?g(e.edges):g;S=Array.isArray(S)?S:[S];const P=Ma(S,e.isValidConnection,c,d,e.hooks.error.trigger,e.defaultEdgeOptions,e.nodes,e.edges),A=[];for(const L of P)A.push(Pc(L));A.length&&e.hooks.edgesChange.trigger(A)},X=(g,S=!0,P=!1)=>{const A=g instanceof Function?g(e.nodes):g,L=Array.isArray(A)?A:[A],se=[],O=[];function _(ee){const U=a(ee);for(const D of U)(!dn(D.deletable)||D.deletable)&&O.push(xc(D.id,D.source,D.target,D.sourceHandle,D.targetHandle))}function B(ee){const U=[];for(const D of e.nodes)D.parentNode===ee&&U.push(D);if(U.length){for(const D of U)se.push($c(D.id));S&&_(U);for(const D of U)B(D.id)}}for(const ee of L){const U=typeof ee=="string"?c(ee):ee;U&&(dn(U.deletable)&&!U.deletable||(se.push($c(U.id)),S&&_([U]),P&&B(U.id)))}O.length&&e.hooks.edgesChange.trigger(O),se.length&&e.hooks.nodesChange.trigger(se)},w=g=>{const S=g instanceof Function?g(e.edges):g,P=Array.isArray(S)?S:[S],A=[];for(const L of P){const se=typeof L=="string"?d(L):L;se&&(dn(se.deletable)&&!se.deletable||A.push(xc(typeof L=="string"?L:L.id,se.source,se.target,se.sourceHandle,se.targetHandle)))}e.hooks.edgesChange.trigger(A)},Y=(g,S,P=!0)=>{const A=d(g.id);if(!A)return!1;const L=e.edges.indexOf(A),se=Ty(g,S,A,P,e.hooks.error.trigger);if(se){const[O]=Ma([se],e.isValidConnection,c,d,e.hooks.error.trigger,e.defaultEdgeOptions,e.nodes,e.edges);return e.edges=e.edges.map((_,B)=>B===L?O:_),Da(e.connectionLookup,t.value,[O]),O}return!1},K=(g,S,P={replace:!1})=>{const A=d(g);if(!A)return;const L=typeof S=="function"?S(A):S;A.data=P.replace?L:{...A.data,...L}},j=g=>Ic(g,e.nodes),J=g=>{const S=Ic(g,e.edges);return Da(e.connectionLookup,t.value,S),S},te=(g,S,P={replace:!1})=>{const A=c(g);if(!A)return;const L=typeof S=="function"?S(A):S;P.replace?e.nodes.splice(e.nodes.indexOf(A),1,L):Object.assign(A,L)},pe=(g,S,P={replace:!1})=>{const A=c(g);if(!A)return;const L=typeof S=="function"?S(A):S;A.data=P.replace?L:{...A.data,...L}},ye=(g,S,P=!1)=>{P?e.connectionClickStartHandle=g:e.connectionStartHandle=g,e.connectionEndHandle=null,e.connectionStatus=null,S&&(e.connectionPosition=S)},ge=(g,S=null,P=null)=>{e.connectionStartHandle&&(e.connectionPosition=g,e.connectionEndHandle=S,e.connectionStatus=P)},_e=(g,S)=>{e.connectionPosition={x:Number.NaN,y:Number.NaN},e.connectionEndHandle=null,e.connectionStatus=null,S?e.connectionClickStartHandle=null:e.connectionStartHandle=null},Se=g=>{const S=ay(g),P=S?null:_o(g)?g:c(g.id);return!S&&!P?[null,null,S]:[S?g:ci(P),P,S]},be=(g,S=!0,P=e.nodes)=>{const[A,L,se]=Se(g);if(!A)return[];const O=[];for(const _ of P||e.nodes){if(!se&&(_.id===L.id||!_.computedPosition))continue;const B=ci(_),ee=di(B,A);(S&&ee>0||ee>=B.width*B.height||ee>=Number(A.width)*Number(A.height))&&O.push(_)}return O},Me=(g,S,P=!0)=>{const[A]=Se(g);if(!A)return!1;const L=di(A,S);return P&&L>0||L>=Number(A.width)*Number(A.height)},Oe=g=>{const{viewport:S,dimensions:P,d3Zoom:A,d3Selection:L,translateExtent:se}=e;if(!A||!L||!g.x&&!g.y)return!1;const O=Wr.translate(S.x+g.x,S.y+g.y).scale(S.zoom),_=[[0,0],[P.width,P.height]],B=A.constrain()(O,_,se),ee=e.viewport.x!==B.x||e.viewport.y!==B.y||e.viewport.zoom!==B.k;return A.transform(L,B),ee},ke=g=>{const S=g instanceof Function?g(e):g,P=["d3Zoom","d3Selection","d3ZoomHandler","viewportRef","vueFlowRef","dimensions","hooks"];dn(S.defaultEdgeOptions)&&(e.defaultEdgeOptions=S.defaultEdgeOptions);const A=S.modelValue||S.nodes||S.edges?[]:void 0;A&&(S.modelValue&&A.push(...S.modelValue),S.nodes&&A.push(...S.nodes),S.edges&&A.push(...S.edges),M(A));const L=()=>{dn(S.maxZoom)&&re(S.maxZoom),dn(S.minZoom)&&N(S.minZoom),dn(S.translateExtent)&&ie(S.translateExtent)};for(const se of Object.keys(S)){const O=se,_=S[O];![...Yy,...P].includes(O)&&dn(_)&&(e[O]=_)}rl(()=>e.d3Zoom).not.toBeNull().then(L),e.initialized||(e.initialized=!0)};return{updateNodePositions:f,updateNodeDimensions:h,setElements:M,setNodes:Z,setEdges:ne,addNodes:q,addEdges:v,removeNodes:X,removeEdges:w,findNode:c,findEdge:d,updateEdge:Y,updateEdgeData:K,updateNode:te,updateNodeData:pe,applyEdgeChanges:J,applyNodeChanges:j,addSelectedElements:T,addSelectedNodes:E,addSelectedEdges:b,setMinZoom:N,setMaxZoom:re,setTranslateExtent:ie,setNodeExtent:ae,setPaneClickDistance:fe,removeSelectedElements:x,removeSelectedNodes:V,removeSelectedEdges:z,startConnection:ye,updateConnection:ge,endConnection:_e,setInteractive:le,setState:ke,getIntersectingNodes:be,getIncomers:s,getOutgoers:i,getConnectedEdges:a,getHandleConnections:l,isNodeIntersecting:Me,panBy:Oe,fitView:g=>r.value.fitView(g),zoomIn:g=>r.value.zoomIn(g),zoomOut:g=>r.value.zoomOut(g),zoomTo:(g,S)=>r.value.zoomTo(g,S),setViewport:(g,S)=>r.value.setViewport(g,S),setTransform:(g,S)=>r.value.setTransform(g,S),getViewport:()=>r.value.getViewport(),getTransform:()=>r.value.getTransform(),setCenter:(g,S,P)=>r.value.setCenter(g,S,P),fitBounds:(g,S)=>r.value.fitBounds(g,S),project:g=>r.value.project(g),screenToFlowCoordinate:g=>r.value.screenToFlowCoordinate(g),flowToScreenCoordinate:g=>r.value.flowToScreenCoordinate(g),toObject:()=>{const g=[],S=[];for(const P of e.nodes){const{computedPosition:A,handleBounds:L,selected:se,dimensions:O,isParent:_,resizing:B,dragging:ee,events:U,...D}=P;g.push(D)}for(const P of e.edges){const{selected:A,sourceNode:L,targetNode:se,events:O,..._}=P;S.push(_)}return JSON.parse(JSON.stringify({nodes:g,edges:S,position:[e.viewport.x,e.viewport.y],zoom:e.viewport.zoom,viewport:e.viewport}))},fromObject:g=>new Promise(S=>{const{nodes:P,edges:A,position:L,zoom:se,viewport:O}=g;P&&Z(P),A&&ne(A);const[_,B]=O!=null&&O.x&&(O!=null&&O.y)?[O.x,O.y]:L??[null,null];if(_&&B){const ee=(O==null?void 0:O.zoom)||se||e.viewport.zoom;return rl(()=>r.value.viewportInitialized).toBe(!0).then(()=>{r.value.setViewport({x:_,y:B,zoom:ee}).then(()=>{S(!0)})})}else S(!0)}),updateNodeInternals:o,viewportHelper:r,$reset:()=>{const g=Ap();if(e.edges=[],e.nodes=[],e.d3Zoom&&e.d3Selection){const S=Wr.translate(g.defaultViewport.x??0,g.defaultViewport.y??0).scale(Er(g.defaultViewport.zoom??1,g.minZoom,g.maxZoom)),P=e.viewportRef.getBoundingClientRect(),A=[[0,0],[P.width,P.height]],L=e.d3Zoom.constrain()(S,A,g.translateExtent);e.d3Zoom.transform(e.d3Selection,L)}ke(g)},$destroy:()=>{}}}const qy=["data-id","data-handleid","data-nodeid","data-handlepos"],Zy={name:"Handle",compatConfig:{MODE:3}},Gt=We({...Zy,props:{id:{default:null},type:{},position:{default:()=>De.Top},isValidConnection:{type:Function},connectable:{type:[Boolean,Number,String,Function],default:void 0},connectableStart:{type:Boolean,default:!0},connectableEnd:{type:Boolean,default:!0}},setup(e,{expose:n}){const t=Yh(e,["position","connectable","connectableStart","connectableEnd","id"]),r=Ye(()=>t.type??"source"),o=Ye(()=>t.isValidConnection??null),{id:s,connectionStartHandle:i,connectionClickStartHandle:a,connectionEndHandle:l,vueFlowRef:c,nodesConnectable:d,noDragClassName:f,noPanClassName:h}=nn(),{id:p,node:E,nodeEl:b,connectedEdges:T}=Vp(),V=Ee(),z=Ye(()=>typeof e.connectableStart<"u"?e.connectableStart:!0),x=Ye(()=>typeof e.connectableEnd<"u"?e.connectableEnd:!0),N=Ye(()=>{var ne,M,q,v,X,w;return((ne=i.value)==null?void 0:ne.nodeId)===p&&((M=i.value)==null?void 0:M.id)===e.id&&((q=i.value)==null?void 0:q.type)===r.value||((v=l.value)==null?void 0:v.nodeId)===p&&((X=l.value)==null?void 0:X.id)===e.id&&((w=l.value)==null?void 0:w.type)===r.value}),re=Ye(()=>{var ne,M,q;return((ne=a.value)==null?void 0:ne.nodeId)===p&&((M=a.value)==null?void 0:M.id)===e.id&&((q=a.value)==null?void 0:q.type)===r.value}),{handlePointerDown:ie,handleClick:ae}=Tp({nodeId:p,handleId:e.id,isValidConnection:o,type:r}),fe=ue(()=>typeof e.connectable=="string"&&e.connectable==="single"?!T.value.some(ne=>{const M=ne[`${r.value}Handle`];return ne[r.value]!==p?!1:M?M===e.id:!0}):typeof e.connectable=="number"?T.value.filter(ne=>{const M=ne[`${r.value}Handle`];return ne[r.value]!==p?!1:M?M===e.id:!0}).length<e.connectable:typeof e.connectable=="function"?e.connectable(E,T.value):dn(e.connectable)?e.connectable:d.value);bn(()=>{var ne;if(!E.dimensions.width||!E.dimensions.height)return;const M=(ne=E.handleBounds[r.value])==null?void 0:ne.find(j=>j.id===e.id);if(!c.value||M)return;const q=c.value.querySelector(".vue-flow__transformationpane");if(!b.value||!V.value||!q||!e.id)return;const v=b.value.getBoundingClientRect(),X=V.value.getBoundingClientRect(),w=window.getComputedStyle(q),{m22:Y}=new window.DOMMatrixReadOnly(w.transform),K={id:e.id,position:e.position,x:(X.left-v.left)/Y,y:(X.top-v.top)/Y,type:r.value,nodeId:p,...zi(V.value)};E.handleBounds[r.value]=[...E.handleBounds[r.value]??[],K]});function le(ne){const M=iu(ne);fe.value&&z.value&&(M&&ne.button===0||!M)&&ie(ne)}function Z(ne){!p||!a.value&&!z.value||fe.value&&ae(ne)}return n({handleClick:ae,handlePointerDown:ie,onClick:Z,onPointerDown:le}),(ne,M)=>(C(),I("div",{ref_key:"handle",ref:V,"data-id":`${de(s)}-${de(p)}-${e.id}-${r.value}`,"data-handleid":e.id,"data-nodeid":de(p),"data-handlepos":ne.position,class:ve(["vue-flow__handle",[`vue-flow__handle-${ne.position}`,`vue-flow__handle-${e.id}`,de(f),de(h),r.value,{connectable:fe.value,connecting:re.value,connectablestart:z.value,connectableend:x.value,connectionindicator:fe.value&&(z.value&&!N.value||x.value&&N.value)}]]),onMousedown:le,onTouchstartPassive:le,onClick:Z},[sn(ne.$slots,"default",{id:ne.id})],42,qy))}}),Gi=function({sourcePosition:e=De.Bottom,targetPosition:n=De.Top,label:t,connectable:r=!0,isValidTargetPos:o,isValidSourcePos:s,data:i}){const a=i.label??t;return[qe(Gt,{type:"target",position:n,connectable:r,isValidConnection:o}),typeof a!="string"&&a?qe(a):qe(he,[a]),qe(Gt,{type:"source",position:e,connectable:r,isValidConnection:s})]};Gi.props=["sourcePosition","targetPosition","label","isValidTargetPos","isValidSourcePos","connectable","data"];Gi.inheritAttrs=!1;Gi.compatConfig={MODE:3};const Jy=Gi,Xi=function({targetPosition:e=De.Top,label:n,connectable:t=!0,isValidTargetPos:r,data:o}){const s=o.label??n;return[qe(Gt,{type:"target",position:e,connectable:t,isValidConnection:r}),typeof s!="string"&&s?qe(s):qe(he,[s])]};Xi.props=["targetPosition","label","isValidTargetPos","connectable","data"];Xi.inheritAttrs=!1;Xi.compatConfig={MODE:3};const Qy=Xi,Yi=function({sourcePosition:e=De.Bottom,label:n,connectable:t=!0,isValidSourcePos:r,data:o}){const s=o.label??n;return[typeof s!="string"&&s?qe(s):qe(he,[s]),qe(Gt,{type:"source",position:e,connectable:t,isValidConnection:r})]};Yi.props=["sourcePosition","label","isValidSourcePos","connectable","data"];Yi.inheritAttrs=!1;Yi.compatConfig={MODE:3};const e2=Yi,n2=["transform"],t2=["width","height","x","y","rx","ry"],r2=["y"],o2={name:"EdgeText",compatConfig:{MODE:3}},s2=We({...o2,props:{x:{},y:{},label:{},labelStyle:{default:()=>({})},labelShowBg:{type:Boolean,default:!0},labelBgStyle:{default:()=>({})},labelBgPadding:{default:()=>[2,4]},labelBgBorderRadius:{default:2}},setup(e){const n=Ee({x:0,y:0,width:0,height:0}),t=Ee(null),r=ue(()=>`translate(${e.x-n.value.width/2} ${e.y-n.value.height/2})`);bn(o),Be([()=>e.x,()=>e.y,t,()=>e.label],o);function o(){if(!t.value)return;const s=t.value.getBBox();(s.width!==n.value.width||s.height!==n.value.height)&&(n.value=s)}return(s,i)=>(C(),I("g",{transform:r.value,class:"vue-flow__edge-textwrapper"},[s.labelShowBg?(C(),I("rect",{key:0,class:"vue-flow__edge-textbg",width:`${n.value.width+2*s.labelBgPadding[0]}px`,height:`${n.value.height+2*s.labelBgPadding[1]}px`,x:-s.labelBgPadding[0],y:-s.labelBgPadding[1],style:Fe(s.labelBgStyle),rx:s.labelBgBorderRadius,ry:s.labelBgBorderRadius},null,12,t2)):me("",!0),u("text",Oo(s.$attrs,{ref_key:"el",ref:t,class:"vue-flow__edge-text",y:n.value.height/2,dy:"0.3em",style:s.labelStyle}),[sn(s.$slots,"default",{},()=>[typeof s.label!="string"?(C(),Je(lr(s.label),{key:0})):(C(),I(he,{key:1},[we(H(s.label),1)],64))])],16,r2)],8,n2))}}),i2=["id","d","marker-end","marker-start"],a2=["d","stroke-width"],l2={name:"BaseEdge",inheritAttrs:!1,compatConfig:{MODE:3}},ji=We({...l2,props:{id:{},labelX:{},labelY:{},path:{},label:{},markerStart:{},markerEnd:{},interactionWidth:{default:20},labelStyle:{},labelShowBg:{type:Boolean},labelBgStyle:{},labelBgPadding:{},labelBgBorderRadius:{}},setup(e,{expose:n}){const t=Ee(null),r=Ee(null),o=Ee(null),s=Kl();return n({pathEl:t,interactionEl:r,labelEl:o}),(i,a)=>(C(),I(he,null,[u("path",Oo(de(s),{id:i.id,ref_key:"pathEl",ref:t,d:i.path,class:"vue-flow__edge-path","marker-end":i.markerEnd,"marker-start":i.markerStart}),null,16,i2),i.interactionWidth?(C(),I("path",{key:0,ref_key:"interactionEl",ref:r,fill:"none",d:i.path,"stroke-width":i.interactionWidth,"stroke-opacity":0,class:"vue-flow__edge-interaction"},null,8,a2)):me("",!0),i.label&&i.labelX&&i.labelY?(C(),Je(s2,{key:1,ref_key:"labelEl",ref:o,x:i.labelX,y:i.labelY,label:i.label,"label-show-bg":i.labelShowBg,"label-bg-style":i.labelBgStyle,"label-bg-padding":i.labelBgPadding,"label-bg-border-radius":i.labelBgBorderRadius,"label-style":i.labelStyle},null,8,["x","y","label","label-show-bg","label-bg-style","label-bg-padding","label-bg-border-radius","label-style"])):me("",!0)],64))}});function Fp({sourceX:e,sourceY:n,targetX:t,targetY:r}){const o=Math.abs(t-e)/2,s=t<e?t+o:t-o,i=Math.abs(r-n)/2,a=r<n?r+i:r-i;return[s,a,o,i]}function Op({sourceX:e,sourceY:n,targetX:t,targetY:r,sourceControlX:o,sourceControlY:s,targetControlX:i,targetControlY:a}){const l=e*.125+o*.375+i*.375+t*.125,c=n*.125+s*.375+a*.375+r*.125,d=Math.abs(l-e),f=Math.abs(c-n);return[l,c,d,f]}function Es(e,n){return e>=0?.5*e:n*25*Math.sqrt(-e)}function Bc({pos:e,x1:n,y1:t,x2:r,y2:o,c:s}){let i,a;switch(e){case De.Left:i=n-Es(n-r,s),a=t;break;case De.Right:i=n+Es(r-n,s),a=t;break;case De.Top:i=n,a=t-Es(t-o,s);break;case De.Bottom:i=n,a=t+Es(o-t,s);break}return[i,a]}function Rp(e){const{sourceX:n,sourceY:t,sourcePosition:r=De.Bottom,targetX:o,targetY:s,targetPosition:i=De.Top,curvature:a=.25}=e,[l,c]=Bc({pos:r,x1:n,y1:t,x2:o,y2:s,c:a}),[d,f]=Bc({pos:i,x1:o,y1:s,x2:n,y2:t,c:a}),[h,p,E,b]=Op({sourceX:n,sourceY:t,targetX:o,targetY:s,sourceControlX:l,sourceControlY:c,targetControlX:d,targetControlY:f});return[`M${n},${t} C${l},${c} ${d},${f} ${o},${s}`,h,p,E,b]}function Lc({pos:e,x1:n,y1:t,x2:r,y2:o}){let s,i;switch(e){case De.Left:case De.Right:s=.5*(n+r),i=t;break;case De.Top:case De.Bottom:s=n,i=.5*(t+o);break}return[s,i]}function Bp(e){const{sourceX:n,sourceY:t,sourcePosition:r=De.Bottom,targetX:o,targetY:s,targetPosition:i=De.Top}=e,[a,l]=Lc({pos:r,x1:n,y1:t,x2:o,y2:s}),[c,d]=Lc({pos:i,x1:o,y1:s,x2:n,y2:t}),[f,h,p,E]=Op({sourceX:n,sourceY:t,targetX:o,targetY:s,sourceControlX:a,sourceControlY:l,targetControlX:c,targetControlY:d});return[`M${n},${t} C${a},${l} ${c},${d} ${o},${s}`,f,h,p,E]}const Uc={[De.Left]:{x:-1,y:0},[De.Right]:{x:1,y:0},[De.Top]:{x:0,y:-1},[De.Bottom]:{x:0,y:1}};function u2({source:e,sourcePosition:n=De.Bottom,target:t}){return n===De.Left||n===De.Right?e.x<t.x?{x:1,y:0}:{x:-1,y:0}:e.y<t.y?{x:0,y:1}:{x:0,y:-1}}function Hc(e,n){return Math.sqrt((n.x-e.x)**2+(n.y-e.y)**2)}function c2({source:e,sourcePosition:n=De.Bottom,target:t,targetPosition:r=De.Top,center:o,offset:s}){const i=Uc[n],a=Uc[r],l={x:e.x+i.x*s,y:e.y+i.y*s},c={x:t.x+a.x*s,y:t.y+a.y*s},d=u2({source:l,sourcePosition:n,target:c}),f=d.x!==0?"x":"y",h=d[f];let p,E,b;const T={x:0,y:0},V={x:0,y:0},[z,x,N,re]=Fp({sourceX:e.x,sourceY:e.y,targetX:t.x,targetY:t.y});if(i[f]*a[f]===-1){E=o.x??z,b=o.y??x;const ae=[{x:E,y:l.y},{x:E,y:c.y}],fe=[{x:l.x,y:b},{x:c.x,y:b}];i[f]===h?p=f==="x"?ae:fe:p=f==="x"?fe:ae}else{const ae=[{x:l.x,y:c.y}],fe=[{x:c.x,y:l.y}];if(f==="x"?p=i.x===h?fe:ae:p=i.y===h?ae:fe,n===r){const q=Math.abs(e[f]-t[f]);if(q<=s){const v=Math.min(s-1,s-q);i[f]===h?T[f]=(l[f]>e[f]?-1:1)*v:V[f]=(c[f]>t[f]?-1:1)*v}}if(n!==r){const q=f==="x"?"y":"x",v=i[f]===a[q],X=l[q]>c[q],w=l[q]<c[q];(i[f]===1&&(!v&&X||v&&w)||i[f]!==1&&(!v&&w||v&&X))&&(p=f==="x"?ae:fe)}const le={x:l.x+T.x,y:l.y+T.y},Z={x:c.x+V.x,y:c.y+V.y},ne=Math.max(Math.abs(le.x-p[0].x),Math.abs(Z.x-p[0].x)),M=Math.max(Math.abs(le.y-p[0].y),Math.abs(Z.y-p[0].y));ne>=M?(E=(le.x+Z.x)/2,b=p[0].y):(E=p[0].x,b=(le.y+Z.y)/2)}return[[e,{x:l.x+T.x,y:l.y+T.y},...p,{x:c.x+V.x,y:c.y+V.y},t],E,b,N,re]}function d2(e,n,t,r){const o=Math.min(Hc(e,n)/2,Hc(n,t)/2,r),{x:s,y:i}=n;if(e.x===s&&s===t.x||e.y===i&&i===t.y)return`L${s} ${i}`;if(e.y===i){const c=e.x<t.x?-1:1,d=e.y<t.y?1:-1;return`L ${s+o*c},${i}Q ${s},${i} ${s},${i+o*d}`}const a=e.x<t.x?1:-1,l=e.y<t.y?-1:1;return`L ${s},${i+o*l}Q ${s},${i} ${s+o*a},${i}`}function _l(e){const{sourceX:n,sourceY:t,sourcePosition:r=De.Bottom,targetX:o,targetY:s,targetPosition:i=De.Top,borderRadius:a=5,centerX:l,centerY:c,offset:d=20}=e,[f,h,p,E,b]=c2({source:{x:n,y:t},sourcePosition:r,target:{x:o,y:s},targetPosition:i,center:{x:l,y:c},offset:d});return[f.reduce((V,z,x)=>{let N;return x>0&&x<f.length-1?N=d2(f[x-1],z,f[x+1],a):N=`${x===0?"M":"L"}${z.x} ${z.y}`,V+=N,V},""),h,p,E,b]}function f2(e){const{sourceX:n,sourceY:t,targetX:r,targetY:o}=e,[s,i,a,l]=Fp({sourceX:n,sourceY:t,targetX:r,targetY:o});return[`M ${n},${t}L ${r},${o}`,s,i,a,l]}const p2=We({name:"StraightEdge",props:["label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","markerEnd","markerStart","interactionWidth"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=f2(e);return qe(ji,{path:t,labelX:r,labelY:o,...n,...e})}}}),h2=p2,v2=We({name:"SmoothStepEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","borderRadius","markerEnd","markerStart","interactionWidth","offset"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=_l({...e,sourcePosition:e.sourcePosition??De.Bottom,targetPosition:e.targetPosition??De.Top});return qe(ji,{path:t,labelX:r,labelY:o,...n,...e})}}}),Lp=v2,m2=We({name:"StepEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","markerEnd","markerStart","interactionWidth"],setup(e,{attrs:n}){return()=>qe(Lp,{...e,...n,borderRadius:0})}}),_2=m2,g2=We({name:"BezierEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","curvature","markerEnd","markerStart","interactionWidth"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=Rp({...e,sourcePosition:e.sourcePosition??De.Bottom,targetPosition:e.targetPosition??De.Top});return qe(ji,{path:t,labelX:r,labelY:o,...n,...e})}}}),y2=g2,C2=We({name:"SimpleBezierEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","markerEnd","markerStart","interactionWidth"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=Bp({...e,sourcePosition:e.sourcePosition??De.Bottom,targetPosition:e.targetPosition??De.Top});return qe(ji,{path:t,labelX:r,labelY:o,...n,...e})}}}),S2=C2,b2={input:e2,default:Jy,output:Qy},E2={default:y2,straight:h2,step:_2,smoothstep:Lp,simplebezier:S2};function w2(e,n,t){const r=ue(()=>b=>n.value.get(b)),o=ue(()=>b=>t.value.get(b)),s=ue(()=>{const b={...E2,...e.edgeTypes},T=Object.keys(b);for(const V of e.edges)V.type&&!T.includes(V.type)&&(b[V.type]=V.type);return b}),i=ue(()=>{const b={...b2,...e.nodeTypes},T=Object.keys(b);for(const V of e.nodes)V.type&&!T.includes(V.type)&&(b[V.type]=V.type);return b}),a=ue(()=>e.onlyRenderVisibleElements?bp(e.nodes,{x:0,y:0,width:e.dimensions.width,height:e.dimensions.height},e.viewport,!0):e.nodes),l=ue(()=>{if(e.onlyRenderVisibleElements){const b=[];for(const T of e.edges){const V=n.value.get(T.source),z=n.value.get(T.target);Cy({sourcePos:V.computedPosition||{x:0,y:0},targetPos:z.computedPosition||{x:0,y:0},sourceWidth:V.dimensions.width,sourceHeight:V.dimensions.height,targetWidth:z.dimensions.width,targetHeight:z.dimensions.height,width:e.dimensions.width,height:e.dimensions.height,viewport:e.viewport})&&b.push(T)}return b}return e.edges}),c=ue(()=>[...a.value,...l.value]),d=ue(()=>{const b=[];for(const T of e.nodes)T.selected&&b.push(T);return b}),f=ue(()=>{const b=[];for(const T of e.edges)T.selected&&b.push(T);return b}),h=ue(()=>[...d.value,...f.value]),p=ue(()=>{const b=[];for(const T of e.nodes)T.dimensions.width&&T.dimensions.height&&T.handleBounds!==void 0&&b.push(T);return b}),E=ue(()=>a.value.length>0&&p.value.length===a.value.length);return{getNode:r,getEdge:o,getElements:c,getEdgeTypes:s,getNodeTypes:i,getEdges:l,getNodes:a,getSelectedElements:h,getSelectedNodes:d,getSelectedEdges:f,getNodesInitialized:p,areNodesInitialized:E}}class dr{constructor(){this.currentId=0,this.flows=new Map}static getInstance(){var n;const t=(n=Qt())==null?void 0:n.appContext.app,r=(t==null?void 0:t.config.globalProperties.$vueFlowStorage)??dr.instance;return dr.instance=r??new dr,t&&(t.config.globalProperties.$vueFlowStorage=dr.instance),dr.instance}set(n,t){return this.flows.set(n,t)}get(n){return this.flows.get(n)}remove(n){return this.flows.delete(n)}create(n,t){const r=Ap(),o=Gn(r),s={};for(const[h,p]of Object.entries(o.hooks)){const E=`on${h.charAt(0).toUpperCase()+h.slice(1)}`;s[E]=p.on}const i={};for(const[h,p]of Object.entries(o.hooks))i[h]=p.trigger;const a=ue(()=>{const h=new Map;for(const p of o.nodes)h.set(p.id,p);return h}),l=ue(()=>{const h=new Map;for(const p of o.edges)h.set(p.id,p);return h}),c=w2(o,a,l),d=jy(o,a,l);d.setState({...o,...t});const f={...s,...c,...d,...mv(o),nodeLookup:a,edgeLookup:l,emits:i,id:n,vueFlowVersion:"1.48.2",$destroy:()=>{this.remove(n)}};return this.set(n,f),f}getId(){return`vue-flow-${this.currentId++}`}}function nn(e){const n=dr.getInstance(),t=Al(),r=typeof e=="object",o=r?e:{id:e},s=o.id,i=s??(t==null?void 0:t.vueFlowId);let a;if(t){const l=Vn(Rc,null);typeof l<"u"&&l!==null&&(!i||l.id===i)&&(a=l)}if(a||i&&(a=n.get(i)),!a||i&&a.id!==i){const l=s??n.getId(),c=n.create(l,o);a=c,(t??xd(!0)).run(()=>{Be(c.applyDefault,(f,h,p)=>{const E=T=>{c.applyNodeChanges(T)},b=T=>{c.applyEdgeChanges(T)};f?(c.onNodesChange(E),c.onEdgesChange(b)):(c.hooks.value.nodesChange.off(E),c.hooks.value.edgesChange.off(b)),p(()=>{c.hooks.value.nodesChange.off(E),c.hooks.value.edgesChange.off(b)})},{immediate:!0}),Lo(()=>{if(a){const f=n.get(a.id);f?f.$destroy():os(`No store instance found for id ${a.id} in storage.`)}})})}else r&&a.setState(o);if(t&&(ut(Rc,a),t.vueFlowId=a.id),r){const l=Qt();(l==null?void 0:l.type.name)!=="VueFlow"&&a.emits.error(new hn(pn.USEVUEFLOW_OPTIONS))}return a}function I2(e){const{emits:n,dimensions:t}=nn();let r;bn(()=>{const o=()=>{var s,i;if(!e.value||!(((i=(s=e.value).checkVisibility)==null?void 0:i.call(s))??!0))return;const a=zi(e.value);(a.width===0||a.height===0)&&n.error(new hn(pn.MISSING_VIEWPORT_DIMENSIONS)),t.value={width:a.width||500,height:a.height||500}};o(),window.addEventListener("resize",o),e.value&&(r=new ResizeObserver(()=>o()),r.observe(e.value)),Cr(()=>{window.removeEventListener("resize",o),r&&e.value&&r.unobserve(e.value)})})}const P2={name:"UserSelection",compatConfig:{MODE:3}},$2=We({...P2,props:{userSelectionRect:{}},setup(e){return(n,t)=>(C(),I("div",{class:"vue-flow__selection vue-flow__container",style:Fe({width:`${n.userSelectionRect.width}px`,height:`${n.userSelectionRect.height}px`,transform:`translate(${n.userSelectionRect.x}px, ${n.userSelectionRect.y}px)`})},null,4))}}),x2=["tabIndex"],D2={name:"NodesSelection",compatConfig:{MODE:3}},M2=We({...D2,setup(e){const{emits:n,viewport:t,getSelectedNodes:r,noPanClassName:o,disableKeyboardA11y:s,userSelectionActive:i}=nn(),a=Np(),l=Ee(null),c=kp({el:l,onStart(E){n.selectionDragStart(E),n.nodeDragStart(E)},onDrag(E){n.selectionDrag(E),n.nodeDrag(E)},onStop(E){n.selectionDragStop(E),n.nodeDragStop(E)}});bn(()=>{var E;s.value||(E=l.value)==null||E.focus({preventScroll:!0})});const d=ue(()=>ou(r.value)),f=ue(()=>({width:`${d.value.width}px`,height:`${d.value.height}px`,top:`${d.value.y}px`,left:`${d.value.x}px`}));function h(E){n.selectionContextMenu({event:E,nodes:r.value})}function p(E){s.value||Or[E.key]&&(E.preventDefault(),a({x:Or[E.key].x,y:Or[E.key].y},E.shiftKey))}return(E,b)=>!de(i)&&d.value.width&&d.value.height?(C(),I("div",{key:0,class:ve(["vue-flow__nodesselection vue-flow__container",de(o)]),style:Fe({transform:`translate(${de(t).x}px,${de(t).y}px) scale(${de(t).zoom})`})},[u("div",{ref_key:"el",ref:l,class:ve([{dragging:de(c)},"vue-flow__nodesselection-rect"]),style:Fe(f.value),tabIndex:de(s)?void 0:-1,onContextmenu:h,onKeydown:p},null,46,x2)],6)):me("",!0)}});function k2(e,n){return{x:e.clientX-n.left,y:e.clientY-n.top}}const T2={name:"Pane",compatConfig:{MODE:3}},V2=We({...T2,props:{isSelecting:{type:Boolean},selectionKeyPressed:{type:Boolean}},setup(e){const{vueFlowRef:n,nodes:t,viewport:r,emits:o,userSelectionActive:s,removeSelectedElements:i,userSelectionRect:a,elementsSelectable:l,nodesSelectionActive:c,getSelectedEdges:d,getSelectedNodes:f,removeNodes:h,removeEdges:p,selectionMode:E,deleteKeyCode:b,multiSelectionKeyCode:T,multiSelectionActive:V,edgeLookup:z,nodeLookup:x,connectionLookup:N,defaultEdgeOptions:re,connectionStartHandle:ie,panOnDrag:ae}=nn(),fe=Wt(null),le=Wt(new Set),Z=Wt(new Set),ne=Wt(null),M=Ye(()=>l.value&&(e.isSelecting||s.value)),q=Ye(()=>ie.value!==null);let v=!1,X=!1;const w=ko(b,{actInsideInputWithModifier:!1}),Y=ko(T);Be(w,_e=>{_e&&(h(f.value),p(d.value),c.value=!1)}),Be(Y,_e=>{V.value=_e});function K(_e,Se){return be=>{be.target===Se&&(_e==null||_e(be))}}function j(_e){if(v||q.value){v=!1;return}o.paneClick(_e),i(),c.value=!1}function J(_e){var Se;if(Array.isArray(ae.value)&&((Se=ae.value)!=null&&Se.includes(2))){_e.preventDefault();return}o.paneContextMenu(_e)}function te(_e){o.paneScroll(_e)}function pe(_e){var Se,be,Me;if(ne.value=((Se=n.value)==null?void 0:Se.getBoundingClientRect())??null,!l.value||!e.isSelecting||_e.button!==0||_e.target!==fe.value||!ne.value)return;(Me=(be=_e.target)==null?void 0:be.setPointerCapture)==null||Me.call(be,_e.pointerId);const{x:Oe,y:ke}=k2(_e,ne.value);X=!0,v=!1,i(),a.value={width:0,height:0,startX:Oe,startY:ke,x:Oe,y:ke},o.selectionStart(_e)}function ye(_e){var Se;if(!ne.value||!a.value)return;v=!0;const{x:be,y:Me}=rt(_e,ne.value),{startX:Oe=0,startY:ke=0}=a.value,Ve={startX:Oe,startY:ke,x:be<Oe?be:Oe,y:Me<ke?Me:ke,width:Math.abs(be-Oe),height:Math.abs(Me-ke)},m=le.value,F=Z.value;le.value=new Set(bp(t.value,Ve,r.value,E.value===ru.Partial,!0).map(S=>S.id)),Z.value=new Set;const g=((Se=re.value)==null?void 0:Se.selectable)??!0;for(const S of le.value){const P=N.value.get(S);if(P)for(const{edgeId:A}of P.values()){const L=z.value.get(A);L&&(L.selectable??g)&&Z.value.add(A)}}if(!Oc(m,le.value)){const S=Ut(x.value,le.value,!0);o.nodesChange(S)}if(!Oc(F,Z.value)){const S=Ut(z.value,Z.value);o.edgesChange(S)}a.value=Ve,s.value=!0,c.value=!1}function ge(_e){var Se;_e.button!==0||!X||((Se=_e.target)==null||Se.releasePointerCapture(_e.pointerId),!s.value&&a.value&&_e.target===fe.value&&j(_e),s.value=!1,a.value=null,c.value=le.value.size>0,o.selectionEnd(_e),e.selectionKeyPressed&&(v=!1),X=!1)}return(_e,Se)=>(C(),I("div",{ref_key:"container",ref:fe,class:ve(["vue-flow__pane vue-flow__container",{selection:_e.isSelecting}]),onClick:Se[0]||(Se[0]=be=>M.value?void 0:K(j,fe.value)(be)),onContextmenu:Se[1]||(Se[1]=be=>K(J,fe.value)(be)),onWheelPassive:Se[2]||(Se[2]=be=>K(te,fe.value)(be)),onPointerenter:Se[3]||(Se[3]=be=>M.value?void 0:de(o).paneMouseEnter(be)),onPointerdown:Se[4]||(Se[4]=be=>M.value?pe(be):de(o).paneMouseMove(be)),onPointermove:Se[5]||(Se[5]=be=>M.value?ye(be):de(o).paneMouseMove(be)),onPointerup:Se[6]||(Se[6]=be=>M.value?ge(be):void 0),onPointerleave:Se[7]||(Se[7]=be=>de(o).paneMouseLeave(be))},[sn(_e.$slots,"default"),de(s)&&de(a)?(C(),Je($2,{key:0,"user-selection-rect":de(a)},null,8,["user-selection-rect"])):me("",!0),de(c)&&de(f).length?(C(),Je(M2,{key:1})):me("",!0)],34))}}),N2={name:"Transform",compatConfig:{MODE:3}},A2=We({...N2,setup(e){const{viewport:n,fitViewOnInit:t,fitViewOnInitDone:r}=nn(),o=ue(()=>t.value?!r.value:!1),s=ue(()=>`translate(${n.value.x}px,${n.value.y}px) scale(${n.value.zoom})`);return(i,a)=>(C(),I("div",{class:"vue-flow__transformationpane vue-flow__container",style:Fe({transform:s.value,opacity:o.value?0:void 0})},[sn(i.$slots,"default")],4))}}),F2={name:"Viewport",compatConfig:{MODE:3}},O2=We({...F2,setup(e){const{minZoom:n,maxZoom:t,defaultViewport:r,translateExtent:o,zoomActivationKeyCode:s,selectionKeyCode:i,panActivationKeyCode:a,panOnScroll:l,panOnScrollMode:c,panOnScrollSpeed:d,panOnDrag:f,zoomOnDoubleClick:h,zoomOnPinch:p,zoomOnScroll:E,preventScrolling:b,noWheelClassName:T,noPanClassName:V,emits:z,connectionStartHandle:x,userSelectionActive:N,paneDragging:re,d3Zoom:ie,d3Selection:ae,d3ZoomHandler:fe,viewport:le,viewportRef:Z,paneClickDistance:ne}=nn();I2(Z);const M=Wt(!1),q=Wt(!1);let v=null,X=!1,w=0,Y={x:0,y:0,zoom:0};const K=ko(a),j=ko(i),J=ko(s),te=Ye(()=>(!j.value||j.value&&i.value===!0)&&(K.value||f.value)),pe=Ye(()=>K.value||l.value),ye=Ye(()=>i.value===!0&&te.value!==!0),ge=Ye(()=>j.value&&i.value!==!0||N.value||ye.value),_e=Ye(()=>x.value!==null);bn(()=>{if(!Z.value){os("Viewport element is missing");return}const ke=Z.value,Ve=ke.getBoundingClientRect(),m=ey().clickDistance(ne.value).scaleExtent([n.value,t.value]).translateExtent(o.value),F=Hn(ke).call(m),g=F.on("wheel.zoom"),S=Wr.translate(r.value.x??0,r.value.y??0).scale(Er(r.value.zoom??1,n.value,t.value)),P=[[0,0],[Ve.width,Ve.height]],A=m.constrain()(S,P,o.value);m.transform(F,A),m.wheelDelta(hl),ie.value=m,ae.value=F,fe.value=g,le.value={x:A.x,y:A.y,zoom:A.k},m.on("start",L=>{var se;if(!L.sourceEvent)return null;w=L.sourceEvent.button,M.value=!0;const O=Me(L.transform);((se=L.sourceEvent)==null?void 0:se.type)==="mousedown"&&(re.value=!0),Y=O,z.viewportChangeStart(O),z.moveStart({event:L,flowTransform:O})}),m.on("end",L=>{if(!L.sourceEvent)return null;if(M.value=!1,re.value=!1,Se(te.value,w??0)&&!X&&z.paneContextMenu(L.sourceEvent),X=!1,be(Y,L.transform)){const se=Me(L.transform);Y=se,z.viewportChangeEnd(se),z.moveEnd({event:L,flowTransform:se})}}),m.filter(L=>{var se;const O=J.value||E.value,_=p.value&&L.ctrlKey,B=L.button,ee=L.type==="wheel";if(B===1&&L.type==="mousedown"&&(Oe(L,"vue-flow__node")||Oe(L,"vue-flow__edge")))return!0;if(!te.value&&!O&&!pe.value&&!h.value&&!p.value||N.value||_e.value&&!ee||!h.value&&L.type==="dblclick"||Oe(L,T.value)&&ee||Oe(L,V.value)&&(!ee||pe.value&&ee&&!J.value)||!p.value&&L.ctrlKey&&ee||!O&&!pe.value&&!_&&ee)return!1;if(!p&&L.type==="touchstart"&&((se=L.touches)==null?void 0:se.length)>1)return L.preventDefault(),!1;if(!te.value&&(L.type==="mousedown"||L.type==="touchstart")||ye.value&&Array.isArray(f.value)&&f.value.includes(0)&&B===0||Array.isArray(f.value)&&!f.value.includes(B)&&(L.type==="mousedown"||L.type==="touchstart"))return!1;const U=Array.isArray(f.value)&&f.value.includes(B)||i.value===!0&&Array.isArray(f.value)&&!f.value.includes(0)||!B||B<=1;return(!L.ctrlKey||K.value||ee)&&U}),Be([N,te],()=>{N.value&&!M.value?m.on("zoom",null):N.value||m.on("zoom",L=>{le.value={x:L.transform.x,y:L.transform.y,zoom:L.transform.k};const se=Me(L.transform);X=Se(te.value,w??0),z.viewportChange(se),z.move({event:L,flowTransform:se})})},{immediate:!0}),Be([N,pe,c,J,p,b,T],()=>{pe.value&&!J.value&&!N.value?F.on("wheel.zoom",L=>{if(Oe(L,T.value))return!1;const se=J.value||E.value,O=p.value&&L.ctrlKey;if(!(!b.value||pe.value||se||O))return!1;L.preventDefault(),L.stopImmediatePropagation();const B=F.property("__zoom").k||1,ee=Yo();if(!K.value&&L.ctrlKey&&p.value&&ee){const k=Qn(L),oe=hl(L),ce=B*2**oe;m.scaleTo(F,ce,k,L);return}const U=L.deltaMode===1?20:1;let D=c.value===Mo.Vertical?0:L.deltaX*U,W=c.value===Mo.Horizontal?0:L.deltaY*U;!ee&&L.shiftKey&&c.value!==Mo.Vertical&&!D&&W&&(D=W,W=0),m.translateBy(F,-(D/B)*d.value,-(W/B)*d.value);const R=Me(F.property("__zoom"));v&&clearTimeout(v),q.value?(z.move({event:L,flowTransform:R}),z.viewportChange(R),v=setTimeout(()=>{z.moveEnd({event:L,flowTransform:R}),z.viewportChangeEnd(R),q.value=!1},150)):(q.value=!0,z.moveStart({event:L,flowTransform:R}),z.viewportChangeStart(R))},{passive:!1}):typeof g<"u"&&F.on("wheel.zoom",function(L,se){const O=!b.value&&L.type==="wheel"&&!L.ctrlKey,_=J.value||E.value,B=p.value&&L.ctrlKey;if(!_&&!l.value&&!B&&L.type==="wheel"||O||Oe(L,T.value))return null;L.preventDefault(),g.call(this,L,se)},{passive:!1})},{immediate:!0})});function Se(ke,Ve){return Ve===2&&Array.isArray(ke)&&ke.includes(2)}function be(ke,Ve){return ke.x!==Ve.x&&!Number.isNaN(Ve.x)||ke.y!==Ve.y&&!Number.isNaN(Ve.y)||ke.zoom!==Ve.k&&!Number.isNaN(Ve.k)}function Me(ke){return{x:ke.x,y:ke.y,zoom:ke.k}}function Oe(ke,Ve){return ke.target.closest(`.${Ve}`)}return(ke,Ve)=>(C(),I("div",{ref_key:"viewportRef",ref:Z,class:"vue-flow__viewport vue-flow__container"},[Ke(V2,{"is-selecting":ge.value,"selection-key-pressed":de(j),class:ve({connecting:_e.value,dragging:de(re),draggable:de(f)===!0||Array.isArray(de(f))&&de(f).includes(0)})},{default:Un(()=>[Ke(A2,null,{default:Un(()=>[sn(ke.$slots,"default")]),_:3})]),_:3},8,["is-selecting","selection-key-pressed","class"])],512))}}),R2=["id"],B2=["id"],L2=["id"],U2={name:"A11yDescriptions",compatConfig:{MODE:3}},H2=We({...U2,setup(e){const{id:n,disableKeyboardA11y:t,ariaLiveMessage:r}=nn();return(o,s)=>(C(),I(he,null,[u("div",{id:`${de(pp)}-${de(n)}`,style:{display:"none"}}," Press enter or space to select a node. "+H(de(t)?"":"You can then use the arrow keys to move the node around.")+" You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ",9,R2),u("div",{id:`${de(hp)}-${de(n)}`,style:{display:"none"}}," Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ",8,B2),de(t)?me("",!0):(C(),I("div",{key:0,id:`${de(iy)}-${de(n)}`,"aria-live":"assertive","aria-atomic":"true",style:{position:"absolute",width:"1px",height:"1px",margin:"-1px",border:"0",padding:"0",overflow:"hidden",clip:"rect(0px, 0px, 0px, 0px)","clip-path":"inset(100%)"}},H(de(r)),9,L2))],64))}});function z2(){const e=nn();Be(()=>e.viewportHelper.value.viewportInitialized,n=>{n&&setTimeout(()=>{e.emits.init(e),e.emits.paneReady(e)},1)})}function K2(e,n,t){return t===De.Left?e-n:t===De.Right?e+n:e}function W2(e,n,t){return t===De.Top?e-n:t===De.Bottom?e+n:e}const au=function({radius:e=10,centerX:n=0,centerY:t=0,position:r=De.Top,type:o}){return qe("circle",{class:`vue-flow__edgeupdater vue-flow__edgeupdater-${o}`,cx:K2(n,e,r),cy:W2(t,e,r),r:e,stroke:"transparent",fill:"transparent"})};au.props=["radius","centerX","centerY","position","type"];au.compatConfig={MODE:3};const zc=au,G2=We({name:"Edge",compatConfig:{MODE:3},props:["id"],setup(e){const{id:n,addSelectedEdges:t,connectionMode:r,edgeUpdaterRadius:o,emits:s,nodesSelectionActive:i,noPanClassName:a,getEdgeTypes:l,removeSelectedEdges:c,findEdge:d,findNode:f,isValidConnection:h,multiSelectionActive:p,disableKeyboardA11y:E,elementsSelectable:b,edgesUpdatable:T,edgesFocusable:V,hooks:z}=nn(),x=ue(()=>d(e.id)),{emit:N,on:re}=Fy(x.value,s),ie=Vn(Wi),ae=Qt(),fe=Ee(!1),le=Ee(!1),Z=Ee(""),ne=Ee(null),M=Ee("source"),q=Ee(null),v=Ye(()=>typeof x.value.selectable>"u"?b.value:x.value.selectable),X=Ye(()=>typeof x.value.updatable>"u"?T.value:x.value.updatable),w=Ye(()=>typeof x.value.focusable>"u"?V.value:x.value.focusable);ut(Vy,e.id),ut(Ny,q);const Y=ue(()=>x.value.class instanceof Function?x.value.class(x.value):x.value.class),K=ue(()=>x.value.style instanceof Function?x.value.style(x.value):x.value.style),j=ue(()=>{const S=x.value.type||"default",P=ie==null?void 0:ie[`edge-${S}`];if(P)return P;let A=x.value.template??l.value[S];if(typeof A=="string"&&ae){const L=Object.keys(ae.appContext.components);L&&L.includes(S)&&(A=of(S,!1))}return A&&typeof A!="string"?A:(s.error(new hn(pn.EDGE_TYPE_MISSING,A)),!1)}),{handlePointerDown:J}=Tp({nodeId:Z,handleId:ne,type:M,isValidConnection:h,edgeUpdaterType:M,onEdgeUpdate:ye,onEdgeUpdateEnd:ge});return()=>{const S=f(x.value.source),P=f(x.value.target),A="pathOptions"in x.value?x.value.pathOptions:{};if(!S&&!P)return s.error(new hn(pn.EDGE_SOURCE_TARGET_MISSING,x.value.id,x.value.source,x.value.target)),null;if(!S)return s.error(new hn(pn.EDGE_SOURCE_MISSING,x.value.id,x.value.source)),null;if(!P)return s.error(new hn(pn.EDGE_TARGET_MISSING,x.value.id,x.value.target)),null;if(!x.value||x.value.hidden||S.hidden||P.hidden)return null;let L;r.value===Yt.Strict?L=S.handleBounds.source:L=[...S.handleBounds.source||[],...S.handleBounds.target||[]];const se=kc(L,x.value.sourceHandle);let O;r.value===Yt.Strict?O=P.handleBounds.target:O=[...P.handleBounds.target||[],...P.handleBounds.source||[]];const _=kc(O,x.value.targetHandle),B=(se==null?void 0:se.position)||De.Bottom,ee=(_==null?void 0:_.position)||De.Top,{x:U,y:D}=Gr(S,se,B),{x:W,y:R}=Gr(P,_,ee);return x.value.sourceX=U,x.value.sourceY=D,x.value.targetX=W,x.value.targetY=R,qe("g",{ref:q,key:e.id,"data-id":e.id,class:["vue-flow__edge",`vue-flow__edge-${j.value===!1?"default":x.value.type||"default"}`,a.value,Y.value,{updating:fe.value,selected:x.value.selected,animated:x.value.animated,inactive:!v.value&&!z.value.edgeClick.hasListeners()}],tabIndex:w.value?0:void 0,"aria-label":x.value.ariaLabel===null?void 0:x.value.ariaLabel??`Edge from ${x.value.source} to ${x.value.target}`,"aria-describedby":w.value?`${hp}-${n}`:void 0,"aria-roledescription":"edge",role:w.value?"group":"img",...x.value.domAttributes,onClick:Se,onContextmenu:be,onDblclick:Me,onMouseenter:Oe,onMousemove:ke,onMouseleave:Ve,onKeyDown:w.value?g:void 0},[le.value?null:qe(j.value===!1?l.value.default:j.value,{id:e.id,sourceNode:S,targetNode:P,source:x.value.source,target:x.value.target,type:x.value.type,updatable:X.value,selected:x.value.selected,animated:x.value.animated,label:x.value.label,labelStyle:x.value.labelStyle,labelShowBg:x.value.labelShowBg,labelBgStyle:x.value.labelBgStyle,labelBgPadding:x.value.labelBgPadding,labelBgBorderRadius:x.value.labelBgBorderRadius,data:x.value.data,events:{...x.value.events,...re},style:K.value,markerStart:`url('#${Xo(x.value.markerStart,n)}')`,markerEnd:`url('#${Xo(x.value.markerEnd,n)}')`,sourcePosition:B,targetPosition:ee,sourceX:U,sourceY:D,targetX:W,targetY:R,sourceHandleId:x.value.sourceHandle,targetHandleId:x.value.targetHandle,interactionWidth:x.value.interactionWidth,...A}),[X.value==="source"||X.value===!0?[qe("g",{onMousedown:m,onMouseenter:te,onMouseout:pe},qe(zc,{position:B,centerX:U,centerY:D,radius:o.value,type:"source","data-type":"source"}))]:null,X.value==="target"||X.value===!0?[qe("g",{onMousedown:F,onMouseenter:te,onMouseout:pe},qe(zc,{position:ee,centerX:W,centerY:R,radius:o.value,type:"target","data-type":"target"}))]:null]])};function te(){fe.value=!0}function pe(){fe.value=!1}function ye(S,P){N.update({event:S,edge:x.value,connection:P})}function ge(S){N.updateEnd({event:S,edge:x.value}),le.value=!1}function _e(S,P){S.button===0&&(le.value=!0,Z.value=P?x.value.target:x.value.source,ne.value=(P?x.value.targetHandle:x.value.sourceHandle)??null,M.value=P?"target":"source",N.updateStart({event:S,edge:x.value}),J(S))}function Se(S){var P;const A={event:S,edge:x.value};v.value&&(i.value=!1,x.value.selected&&p.value?(c([x.value]),(P=q.value)==null||P.blur()):t([x.value])),N.click(A)}function be(S){N.contextMenu({event:S,edge:x.value})}function Me(S){N.doubleClick({event:S,edge:x.value})}function Oe(S){N.mouseEnter({event:S,edge:x.value})}function ke(S){N.mouseMove({event:S,edge:x.value})}function Ve(S){N.mouseLeave({event:S,edge:x.value})}function m(S){_e(S,!0)}function F(S){_e(S,!1)}function g(S){var P;!E.value&&vp.includes(S.key)&&v.value&&(S.key==="Escape"?((P=q.value)==null||P.blur(),c([d(e.id)])):t([d(e.id)]))}}}),X2=G2,Y2=We({name:"ConnectionLine",compatConfig:{MODE:3},setup(){var e;const{id:n,connectionMode:t,connectionStartHandle:r,connectionEndHandle:o,connectionPosition:s,connectionLineType:i,connectionLineStyle:a,connectionLineOptions:l,connectionStatus:c,viewport:d,findNode:f}=nn(),h=(e=Vn(Wi))==null?void 0:e["connection-line"],p=ue(()=>{var z;return f((z=r.value)==null?void 0:z.nodeId)}),E=ue(()=>{var z;return f((z=o.value)==null?void 0:z.nodeId)??null}),b=ue(()=>({x:(s.value.x-d.value.x)/d.value.zoom,y:(s.value.y-d.value.y)/d.value.zoom})),T=ue(()=>l.value.markerStart?`url(#${Xo(l.value.markerStart,n)})`:""),V=ue(()=>l.value.markerEnd?`url(#${Xo(l.value.markerEnd,n)})`:"");return()=>{var z,x,N;if(!p.value||!r.value)return null;const re=r.value.id,ie=r.value.type,ae=p.value.handleBounds;let fe=(ae==null?void 0:ae[ie])??[];if(t.value===Yt.Loose){const K=(ae==null?void 0:ae[ie==="source"?"target":"source"])??[];fe=[...fe,...K]}if(!fe)return null;const le=(re?fe.find(K=>K.id===re):fe[0])??null,Z=(le==null?void 0:le.position)??De.Top,{x:ne,y:M}=Gr(p.value,le,Z);let q=null;E.value&&(t.value===Yt.Strict?q=((z=E.value.handleBounds[ie==="source"?"target":"source"])==null?void 0:z.find(K=>{var j;return K.id===((j=o.value)==null?void 0:j.id)}))||null:q=((x=[...E.value.handleBounds.source??[],...E.value.handleBounds.target??[]])==null?void 0:x.find(K=>{var j;return K.id===((j=o.value)==null?void 0:j.id)}))||null);const v=((N=o.value)==null?void 0:N.position)??(Z?vl[Z]:null);if(!Z||!v)return null;const X=i.value??l.value.type??ur.Bezier;let w="";const Y={sourceX:ne,sourceY:M,sourcePosition:Z,targetX:b.value.x,targetY:b.value.y,targetPosition:v};return X===ur.Bezier?[w]=Rp(Y):X===ur.Step?[w]=_l({...Y,borderRadius:0}):X===ur.SmoothStep?[w]=_l(Y):X===ur.SimpleBezier?[w]=Bp(Y):w=`M${ne},${M} ${b.value.x},${b.value.y}`,qe("svg",{class:"vue-flow__edges vue-flow__connectionline vue-flow__container"},qe("g",{class:"vue-flow__connection"},h?qe(h,{sourceX:ne,sourceY:M,sourcePosition:Z,targetX:b.value.x,targetY:b.value.y,targetPosition:v,sourceNode:p.value,sourceHandle:le,targetNode:E.value,targetHandle:q,markerEnd:V.value,markerStart:T.value,connectionStatus:c.value}):qe("path",{d:w,class:[l.value.class,c.value,"vue-flow__connection-path"],style:{...a.value,...l.value.style},"marker-end":V.value,"marker-start":T.value})))}}}),j2=Y2,q2=["id","markerWidth","markerHeight","markerUnits","orient"],Z2={name:"MarkerType",compatConfig:{MODE:3}},J2=We({...Z2,props:{id:{},type:{},color:{default:"none"},width:{default:12.5},height:{default:12.5},markerUnits:{default:"strokeWidth"},orient:{default:"auto-start-reverse"},strokeWidth:{default:1}},setup(e){return(n,t)=>(C(),I("marker",{id:n.id,class:"vue-flow__arrowhead",viewBox:"-10 -10 20 20",refX:"0",refY:"0",markerWidth:`${n.width}`,markerHeight:`${n.height}`,markerUnits:n.markerUnits,orient:n.orient},[n.type===de(fl).ArrowClosed?(C(),I("polyline",{key:0,style:Fe({stroke:n.color,fill:n.color,strokeWidth:n.strokeWidth}),"stroke-linecap":"round","stroke-linejoin":"round",points:"-5,-4 0,0 -5,4 -5,-4"},null,4)):me("",!0),n.type===de(fl).Arrow?(C(),I("polyline",{key:1,style:Fe({stroke:n.color,strokeWidth:n.strokeWidth}),"stroke-linecap":"round","stroke-linejoin":"round",fill:"none",points:"-5,-4 0,0 -5,4"},null,4)):me("",!0)],8,q2))}}),Q2={class:"vue-flow__marker vue-flow__container","aria-hidden":"true"},eC={name:"MarkerDefinitions",compatConfig:{MODE:3}},nC=We({...eC,setup(e){const{id:n,edges:t,connectionLineOptions:r,defaultMarkerColor:o}=nn(),s=ue(()=>{const i=new Set,a=[],l=c=>{if(c){const d=Xo(c,n);i.has(d)||(typeof c=="object"?a.push({...c,id:d,color:c.color||o.value}):a.push({id:d,color:o.value,type:c}),i.add(d))}};for(const c of[r.value.markerEnd,r.value.markerStart])l(c);for(const c of t.value)for(const d of[c.markerStart,c.markerEnd])l(d);return a.sort((c,d)=>c.id.localeCompare(d.id))});return(i,a)=>(C(),I("svg",Q2,[u("defs",null,[(C(!0),I(he,null,xe(s.value,l=>(C(),Je(J2,{id:l.id,key:l.id,type:l.type,color:l.color,width:l.width,height:l.height,markerUnits:l.markerUnits,"stroke-width":l.strokeWidth,orient:l.orient},null,8,["id","type","color","width","height","markerUnits","stroke-width","orient"]))),128))])]))}}),tC={name:"Edges",compatConfig:{MODE:3}},rC=We({...tC,setup(e){const{findNode:n,getEdges:t,elevateEdgesOnSelect:r}=nn();return(o,s)=>(C(),I(he,null,[Ke(nC),(C(!0),I(he,null,xe(de(t),i=>(C(),I("svg",{key:i.id,class:"vue-flow__edges vue-flow__container",style:Fe({zIndex:de(Sy)(i,de(n),de(r))})},[Ke(de(X2),{id:i.id},null,8,["id"])],4))),128)),Ke(de(j2))],64))}}),oC=We({name:"Node",compatConfig:{MODE:3},props:["id","resizeObserver"],setup(e){const{id:n,noPanClassName:t,selectNodesOnDrag:r,nodesSelectionActive:o,multiSelectionActive:s,emits:i,removeSelectedNodes:a,addSelectedNodes:l,updateNodeDimensions:c,onUpdateNodeInternals:d,getNodeTypes:f,nodeExtent:h,elevateNodesOnSelect:p,disableKeyboardA11y:E,ariaLiveMessage:b,snapToGrid:T,snapGrid:V,nodeDragThreshold:z,nodesDraggable:x,elementsSelectable:N,nodesConnectable:re,nodesFocusable:ie,hooks:ae}=nn(),fe=Ee(null);ut(Mp,fe),ut(Dp,e.id);const le=Vn(Wi),Z=Qt(),ne=Np(),{node:M,parentNode:q}=Vp(e.id),{emit:v,on:X}=Ly(M,i),w=Ye(()=>typeof M.draggable>"u"?x.value:M.draggable),Y=Ye(()=>typeof M.selectable>"u"?N.value:M.selectable),K=Ye(()=>typeof M.connectable>"u"?re.value:M.connectable),j=Ye(()=>typeof M.focusable>"u"?ie.value:M.focusable),J=ue(()=>Y.value||w.value||ae.value.nodeClick.hasListeners()||ae.value.nodeDoubleClick.hasListeners()||ae.value.nodeMouseEnter.hasListeners()||ae.value.nodeMouseMove.hasListeners()||ae.value.nodeMouseLeave.hasListeners()),te=Ye(()=>!!M.dimensions.width&&!!M.dimensions.height),pe=ue(()=>{const P=M.type||"default",A=le==null?void 0:le[`node-${P}`];if(A)return A;let L=M.template||f.value[P];if(typeof L=="string"&&Z){const se=Object.keys(Z.appContext.components);se&&se.includes(P)&&(L=of(P,!1))}return L&&typeof L!="string"?L:(i.error(new hn(pn.NODE_TYPE_MISSING,L)),!1)}),ye=kp({id:e.id,el:fe,disabled:()=>!w.value,selectable:Y,dragHandle:()=>M.dragHandle,onStart(P){v.dragStart(P)},onDrag(P){v.drag(P)},onStop(P){v.dragStop(P)},onClick(P){g(P)}}),ge=ue(()=>M.class instanceof Function?M.class(M):M.class),_e=ue(()=>{const P=(M.style instanceof Function?M.style(M):M.style)||{},A=M.width instanceof Function?M.width(M):M.width,L=M.height instanceof Function?M.height(M):M.height;return!P.width&&A&&(P.width=typeof A=="string"?A:`${A}px`),!P.height&&L&&(P.height=typeof L=="string"?L:`${L}px`),P}),Se=Ye(()=>Number(M.zIndex??_e.value.zIndex??0));return d(P=>{(P.includes(e.id)||!P.length)&&Me()}),bn(()=>{Be(()=>M.hidden,(P=!1,A,L)=>{!P&&fe.value&&(e.resizeObserver.observe(fe.value),L(()=>{fe.value&&e.resizeObserver.unobserve(fe.value)}))},{immediate:!0,flush:"post"})}),Be([()=>M.type,()=>M.sourcePosition,()=>M.targetPosition],()=>{fn(()=>{c([{id:e.id,nodeElement:fe.value,forceUpdate:!0}])})}),Be([()=>M.position.x,()=>M.position.y,()=>{var P;return(P=q.value)==null?void 0:P.computedPosition.x},()=>{var P;return(P=q.value)==null?void 0:P.computedPosition.y},()=>{var P;return(P=q.value)==null?void 0:P.computedPosition.z},Se,()=>M.selected,()=>M.dimensions.height,()=>M.dimensions.width,()=>{var P;return(P=q.value)==null?void 0:P.dimensions.height},()=>{var P;return(P=q.value)==null?void 0:P.dimensions.width}],([P,A,L,se,O,_])=>{const B={x:P,y:A,z:_+(p.value&&M.selected?1e3:0)};typeof L<"u"&&typeof se<"u"?M.computedPosition=vy({x:L,y:se,z:O},B):M.computedPosition=B},{flush:"post",immediate:!0}),Be([()=>M.extent,h],([P,A],[L,se])=>{(P!==L||A!==se)&&be()}),M.extent==="parent"||typeof M.extent=="object"&&"range"in M.extent&&M.extent.range==="parent"?rl(()=>te).toBe(!0).then(be):be(),()=>M.hidden?null:qe("div",{ref:fe,"data-id":M.id,class:["vue-flow__node",`vue-flow__node-${pe.value===!1?"default":M.type||"default"}`,{[t.value]:w.value,dragging:ye==null?void 0:ye.value,draggable:w.value,selected:M.selected,selectable:Y.value,parent:M.isParent},ge.value],style:{visibility:te.value?"visible":"hidden",zIndex:M.computedPosition.z??Se.value,transform:`translate(${M.computedPosition.x}px,${M.computedPosition.y}px)`,pointerEvents:J.value?"all":"none",..._e.value},tabIndex:j.value?0:void 0,role:j.value?"group":void 0,"aria-describedby":E.value?void 0:`${pp}-${n}`,"aria-label":M.ariaLabel,"aria-roledescription":"node",...M.domAttributes,onMouseenter:Oe,onMousemove:ke,onMouseleave:Ve,onContextmenu:m,onClick:g,onDblclick:F,onKeydown:S},[qe(pe.value===!1?f.value.default:pe.value,{id:M.id,type:M.type,data:M.data,events:{...M.events,...X},selected:M.selected,resizing:M.resizing,dragging:ye.value,connectable:K.value,position:M.computedPosition,dimensions:M.dimensions,isValidTargetPos:M.isValidTargetPos,isValidSourcePos:M.isValidSourcePos,parent:M.parentNode,parentNodeId:M.parentNode,zIndex:M.computedPosition.z??Se.value,targetPosition:M.targetPosition,sourcePosition:M.sourcePosition,label:M.label,dragHandle:M.dragHandle,onUpdateNodeInternals:Me})]);function be(){const P=M.computedPosition,{computedPosition:A,position:L}=su(M,T.value?Ki(P,V.value):P,i.error,h.value,q.value);(M.computedPosition.x!==A.x||M.computedPosition.y!==A.y)&&(M.computedPosition={...M.computedPosition,...A}),(M.position.x!==L.x||M.position.y!==L.y)&&(M.position=L)}function Me(){fe.value&&c([{id:e.id,nodeElement:fe.value,forceUpdate:!0}])}function Oe(P){ye!=null&&ye.value||v.mouseEnter({event:P,node:M})}function ke(P){ye!=null&&ye.value||v.mouseMove({event:P,node:M})}function Ve(P){ye!=null&&ye.value||v.mouseLeave({event:P,node:M})}function m(P){return v.contextMenu({event:P,node:M})}function F(P){return v.doubleClick({event:P,node:M})}function g(P){Y.value&&(!r.value||!w.value||z.value>0)&&ml(M,s.value,l,a,o,!1,fe.value),v.click({event:P,node:M})}function S(P){if(!(pl(P)||E.value))if(vp.includes(P.key)&&Y.value){const A=P.key==="Escape";ml(M,s.value,l,a,o,A,fe.value)}else w.value&&M.selected&&Or[P.key]&&(P.preventDefault(),b.value=`Moved selected node ${P.key.replace("Arrow","").toLowerCase()}. New position, x: ${~~M.position.x}, y: ${~~M.position.y}`,ne({x:Or[P.key].x,y:Or[P.key].y},P.shiftKey))}}}),sC=oC;function iC(e={includeHiddenNodes:!1}){const{nodes:n}=nn();return ue(()=>{if(n.value.length===0)return!1;for(const t of n.value)if((e.includeHiddenNodes||!t.hidden)&&((t==null?void 0:t.handleBounds)===void 0||t.dimensions.width===0||t.dimensions.height===0))return!1;return!0})}const aC={class:"vue-flow__nodes vue-flow__container"},lC={name:"Nodes",compatConfig:{MODE:3}},uC=We({...lC,setup(e){const{getNodes:n,updateNodeDimensions:t,emits:r}=nn(),o=iC(),s=Ee();return Be(o,i=>{i&&fn(()=>{r.nodesInitialized(n.value)})},{immediate:!0}),bn(()=>{s.value=new ResizeObserver(i=>{const a=i.map(l=>({id:l.target.getAttribute("data-id"),nodeElement:l.target,forceUpdate:!0}));fn(()=>t(a))})}),Cr(()=>{var i;return(i=s.value)==null?void 0:i.disconnect()}),(i,a)=>(C(),I("div",aC,[s.value?(C(!0),I(he,{key:0},xe(de(n),(l,c,d,f)=>{const h=[l.id];if(f&&f.key===l.id&&k1(f,h))return f;const p=(C(),Je(de(sC),{id:l.id,key:l.id,"resize-observer":s.value},null,8,["id","resize-observer"]));return p.memo=h,p},a,0),128)):me("",!0)]))}});function cC(){const{emits:e}=nn();bn(()=>{if(xp()){const n=document.querySelector(".vue-flow__pane");n&&window.getComputedStyle(n).zIndex!=="1"&&e.error(new hn(pn.MISSING_STYLES))}})}const dC=u("div",{class:"vue-flow__edge-labels"},null,-1),fC={name:"VueFlow",compatConfig:{MODE:3}},pC=We({...fC,props:{id:{},modelValue:{},nodes:{},edges:{},edgeTypes:{},nodeTypes:{},connectionMode:{},connectionLineType:{},connectionLineStyle:{default:void 0},connectionLineOptions:{default:void 0},connectionRadius:{},isValidConnection:{type:[Function,null],default:void 0},deleteKeyCode:{default:void 0},selectionKeyCode:{type:[Boolean,null],default:void 0},multiSelectionKeyCode:{default:void 0},zoomActivationKeyCode:{default:void 0},panActivationKeyCode:{default:void 0},snapToGrid:{type:Boolean,default:void 0},snapGrid:{},onlyRenderVisibleElements:{type:Boolean,default:void 0},edgesUpdatable:{type:[Boolean,String],default:void 0},nodesDraggable:{type:Boolean,default:void 0},nodesConnectable:{type:Boolean,default:void 0},nodeDragThreshold:{},elementsSelectable:{type:Boolean,default:void 0},selectNodesOnDrag:{type:Boolean,default:void 0},panOnDrag:{type:[Boolean,Array],default:void 0},minZoom:{},maxZoom:{},defaultViewport:{},translateExtent:{},nodeExtent:{},defaultMarkerColor:{},zoomOnScroll:{type:Boolean,default:void 0},zoomOnPinch:{type:Boolean,default:void 0},panOnScroll:{type:Boolean,default:void 0},panOnScrollSpeed:{},panOnScrollMode:{},paneClickDistance:{},zoomOnDoubleClick:{type:Boolean,default:void 0},preventScrolling:{type:Boolean,default:void 0},selectionMode:{},edgeUpdaterRadius:{},fitViewOnInit:{type:Boolean,default:void 0},connectOnClick:{type:Boolean,default:void 0},applyDefault:{type:Boolean,default:void 0},autoConnect:{type:[Boolean,Function],default:void 0},noDragClassName:{},noWheelClassName:{},noPanClassName:{},defaultEdgeOptions:{},elevateEdgesOnSelect:{type:Boolean,default:void 0},elevateNodesOnSelect:{type:Boolean,default:void 0},disableKeyboardA11y:{type:Boolean,default:void 0},edgesFocusable:{type:Boolean,default:void 0},nodesFocusable:{type:Boolean,default:void 0},autoPanOnConnect:{type:Boolean,default:void 0},autoPanOnNodeDrag:{type:Boolean,default:void 0},autoPanSpeed:{}},emits:["nodesChange","edgesChange","nodesInitialized","paneReady","init","updateNodeInternals","error","connect","connectStart","connectEnd","clickConnectStart","clickConnectEnd","moveStart","move","moveEnd","selectionDragStart","selectionDrag","selectionDragStop","selectionContextMenu","selectionStart","selectionEnd","viewportChangeStart","viewportChange","viewportChangeEnd","paneScroll","paneClick","paneContextMenu","paneMouseEnter","paneMouseMove","paneMouseLeave","edgeUpdate","edgeContextMenu","edgeMouseEnter","edgeMouseMove","edgeMouseLeave","edgeDoubleClick","edgeClick","edgeUpdateStart","edgeUpdateEnd","nodeContextMenu","nodeMouseEnter","nodeMouseMove","nodeMouseLeave","nodeDoubleClick","nodeClick","nodeDragStart","nodeDrag","nodeDragStop","miniMapNodeClick","miniMapNodeDoubleClick","miniMapNodeMouseEnter","miniMapNodeMouseMove","miniMapNodeMouseLeave","update:modelValue","update:nodes","update:edges"],setup(e,{expose:n,emit:t}){const r=e,o=uf(),s=Sa(r,"modelValue",t),i=Sa(r,"nodes",t),a=Sa(r,"edges",t),l=nn(r),c=Ky({modelValue:s,nodes:i,edges:a},r,l);return Gy(t,l.hooks),z2(),cC(),ut(Wi,o),Ai(c),n(l),(d,f)=>(C(),I("div",{ref:de(l).vueFlowRef,class:"vue-flow"},[Ke(O2,null,{default:Un(()=>[Ke(rC),dC,Ke(uC),sn(d.$slots,"zoom-pane")]),_:3}),sn(d.$slots,"default"),Ke(H2)],512))}}),hC={name:"Panel",compatConfig:{MODE:3}},Up=We({...hC,props:{position:{}},setup(e){const n=e,{userSelectionActive:t}=nn(),r=ue(()=>`${n.position}`.split("-"));return(o,s)=>(C(),I("div",{class:ve(["vue-flow__panel",r.value]),style:Fe({pointerEvents:de(t)?"none":"all"})},[sn(o.$slots,"default")],6))}});var ot=(e=>(e.Lines="lines",e.Dots="dots",e))(ot||{});const Hp=function({dimensions:e,size:n,color:t}){return qe("path",{stroke:t,"stroke-width":n,d:`M${e[0]/2} 0 V${e[1]} M0 ${e[1]/2} H${e[0]}`})},zp=function({radius:e,color:n}){return qe("circle",{cx:e,cy:e,r:e,fill:n})};ot.Lines+"",ot.Dots+"";const vC={[ot.Dots]:"#81818a",[ot.Lines]:"#eee"},mC=["id","x","y","width","height","patternTransform"],_C={key:2,height:"100",width:"100"},gC=["fill"],yC=["x","y","fill"],CC={name:"Background",compatConfig:{MODE:3}},SC=We({...CC,props:{id:{},variant:{default:()=>ot.Dots},gap:{default:20},size:{default:1},lineWidth:{default:1},patternColor:{},color:{},bgColor:{},height:{default:100},width:{default:100},x:{default:0},y:{default:0},offset:{default:0}},setup(e){const{id:n,viewport:t}=nn(),r=ue(()=>{const i=t.value.zoom,[a,l]=Array.isArray(e.gap)?e.gap:[e.gap,e.gap],c=[a*i||1,l*i||1],d=e.size*i,[f,h]=Array.isArray(e.offset)?e.offset:[e.offset,e.offset],p=[f*i||1+c[0]/2,h*i||1+c[1]/2];return{scaledGap:c,offset:p,size:d}}),o=Ye(()=>`pattern-${n}${e.id?`-${e.id}`:""}`),s=Ye(()=>e.color||e.patternColor||vC[e.variant||ot.Dots]);return(i,a)=>(C(),I("svg",{class:"vue-flow__background vue-flow__container",style:Fe({height:`${i.height>100?100:i.height}%`,width:`${i.width>100?100:i.width}%`})},[sn(i.$slots,"pattern-container",{id:o.value},()=>[u("pattern",{id:o.value,x:de(t).x%r.value.scaledGap[0],y:de(t).y%r.value.scaledGap[1],width:r.value.scaledGap[0],height:r.value.scaledGap[1],patternTransform:`translate(-${r.value.offset[0]},-${r.value.offset[1]})`,patternUnits:"userSpaceOnUse"},[sn(i.$slots,"pattern",{},()=>[i.variant===de(ot).Lines?(C(),Je(de(Hp),{key:0,size:i.lineWidth,color:s.value,dimensions:r.value.scaledGap},null,8,["size","color","dimensions"])):i.variant===de(ot).Dots?(C(),Je(de(zp),{key:1,color:s.value,radius:r.value.size/2},null,8,["color","radius"])):me("",!0),i.bgColor?(C(),I("svg",_C,[u("rect",{width:"100%",height:"100%",fill:i.bgColor},null,8,gC)])):me("",!0)])],8,mC)]),u("rect",{x:i.x,y:i.y,width:"100%",height:"100%",fill:`url(#${o.value})`},null,8,yC),sn(i.$slots,"default",{id:o.value})],4))}}),bC={name:"ControlButton",compatConfig:{MODE:3}},EC=(e,n)=>{const t=e.__vccOpts||e;for(const[r,o]of n)t[r]=o;return t},wC={type:"button",class:"vue-flow__controls-button"};function IC(e,n,t,r,o,s){return C(),I("button",wC,[sn(e.$slots,"default")])}const ws=EC(bC,[["render",IC]]),PC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32"},$C=u("path",{d:"M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"},null,-1),xC=[$C];function DC(e,n){return C(),I("svg",PC,xC)}const MC={render:DC},kC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 5"},TC=u("path",{d:"M0 0h32v4.2H0z"},null,-1),VC=[TC];function NC(e,n){return C(),I("svg",kC,VC)}const AC={render:NC},FC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 30"},OC=u("path",{d:"M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"},null,-1),RC=[OC];function BC(e,n){return C(),I("svg",FC,RC)}const LC={render:BC},UC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 32"},HC=u("path",{d:"M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"},null,-1),zC=[HC];function KC(e,n){return C(),I("svg",UC,zC)}const WC={render:KC},GC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 32"},XC=u("path",{d:"M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z"},null,-1),YC=[XC];function jC(e,n){return C(),I("svg",GC,YC)}const qC={render:jC},ZC={name:"Controls",compatConfig:{MODE:3}},JC=We({...ZC,props:{showZoom:{type:Boolean,default:!0},showFitView:{type:Boolean,default:!0},showInteractive:{type:Boolean,default:!0},fitViewParams:{},position:{default:()=>fp.BottomLeft}},emits:["zoomIn","zoomOut","fitView","interactionChange"],setup(e,{emit:n}){const{nodesDraggable:t,nodesConnectable:r,elementsSelectable:o,setInteractive:s,zoomIn:i,zoomOut:a,fitView:l,viewport:c,minZoom:d,maxZoom:f}=nn(),h=Ye(()=>t.value||r.value||o.value),p=Ye(()=>c.value.zoom<=d.value),E=Ye(()=>c.value.zoom>=f.value);function b(){i(),n("zoomIn")}function T(){a(),n("zoomOut")}function V(){l(e.fitViewParams),n("fitView")}function z(){s(!h.value),n("interactionChange",!h.value)}return(x,N)=>(C(),Je(de(Up),{class:"vue-flow__controls",position:x.position},{default:Un(()=>[sn(x.$slots,"top"),x.showZoom?(C(),I(he,{key:0},[sn(x.$slots,"control-zoom-in",{},()=>[Ke(ws,{class:"vue-flow__controls-zoomin",disabled:E.value,onClick:b},{default:Un(()=>[sn(x.$slots,"icon-zoom-in",{},()=>[(C(),Je(lr(de(MC))))])]),_:3},8,["disabled"])]),sn(x.$slots,"control-zoom-out",{},()=>[Ke(ws,{class:"vue-flow__controls-zoomout",disabled:p.value,onClick:T},{default:Un(()=>[sn(x.$slots,"icon-zoom-out",{},()=>[(C(),Je(lr(de(AC))))])]),_:3},8,["disabled"])])],64)):me("",!0),x.showFitView?sn(x.$slots,"control-fit-view",{key:1},()=>[Ke(ws,{class:"vue-flow__controls-fitview",onClick:V},{default:Un(()=>[sn(x.$slots,"icon-fit-view",{},()=>[(C(),Je(lr(de(LC))))])]),_:3})]):me("",!0),x.showInteractive?sn(x.$slots,"control-interactive",{key:2},()=>[x.showInteractive?(C(),Je(ws,{key:0,class:"vue-flow__controls-interactive",onClick:z},{default:Un(()=>[h.value?sn(x.$slots,"icon-unlock",{key:0},()=>[(C(),Je(lr(de(qC))))]):me("",!0),h.value?me("",!0):sn(x.$slots,"icon-lock",{key:1},()=>[(C(),Je(lr(de(WC))))])]),_:3})):me("",!0)]):me("",!0),sn(x.$slots,"default")]),_:3},8,["position"]))}});var QC={value:()=>{}};function lu(){for(var e=0,n=arguments.length,t={},r;e<n;++e){if(!(r=arguments[e]+"")||r in t||/[\s.]/.test(r))throw new Error("illegal type: "+r);t[r]=[]}return new Ls(t)}function Ls(e){this._=e}function eS(e,n){return e.trim().split(/^|\s+/).map(function(t){var r="",o=t.indexOf(".");if(o>=0&&(r=t.slice(o+1),t=t.slice(0,o)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:r}})}Ls.prototype=lu.prototype={constructor:Ls,on:function(e,n){var t=this._,r=eS(e+"",t),o,s=-1,i=r.length;if(arguments.length<2){for(;++s<i;)if((o=(e=r[s]).type)&&(o=nS(t[o],e.name)))return o;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++s<i;)if(o=(e=r[s]).type)t[o]=Kc(t[o],e.name,n);else if(n==null)for(o in t)t[o]=Kc(t[o],e.name,null);return this},copy:function(){var e={},n=this._;for(var t in n)e[t]=n[t].slice();return new Ls(e)},call:function(e,n){if((o=arguments.length-2)>0)for(var t=new Array(o),r=0,o,s;r<o;++r)t[r]=arguments[r+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],r=0,o=s.length;r<o;++r)s[r].value.apply(n,t)},apply:function(e,n,t){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],o=0,s=r.length;o<s;++o)r[o].value.apply(n,t)}};function nS(e,n){for(var t=0,r=e.length,o;t<r;++t)if((o=e[t]).name===n)return o.value}function Kc(e,n,t){for(var r=0,o=e.length;r<o;++r)if(e[r].name===n){e[r]=QC,e=e.slice(0,r).concat(e.slice(r+1));break}return t!=null&&e.push({name:n,value:t}),e}var gl="http://www.w3.org/1999/xhtml";const Wc={svg:"http://www.w3.org/2000/svg",xhtml:gl,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function qi(e){var n=e+="",t=n.indexOf(":");return t>=0&&(n=e.slice(0,t))!=="xmlns"&&(e=e.slice(t+1)),Wc.hasOwnProperty(n)?{space:Wc[n],local:e}:e}function tS(e){return function(){var n=this.ownerDocument,t=this.namespaceURI;return t===gl&&n.documentElement.namespaceURI===gl?n.createElement(e):n.createElementNS(t,e)}}function rS(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function Kp(e){var n=qi(e);return(n.local?rS:tS)(n)}function oS(){}function uu(e){return e==null?oS:function(){return this.querySelector(e)}}function sS(e){typeof e!="function"&&(e=uu(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=new Array(i),l,c,d=0;d<i;++d)(l=s[d])&&(c=e.call(l,l.__data__,d,s))&&("__data__"in l&&(c.__data__=l.__data__),a[d]=c);return new Fn(r,this._parents)}function iS(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function aS(){return[]}function Wp(e){return e==null?aS:function(){return this.querySelectorAll(e)}}function lS(e){return function(){return iS(e.apply(this,arguments))}}function uS(e){typeof e=="function"?e=lS(e):e=Wp(e);for(var n=this._groups,t=n.length,r=[],o=[],s=0;s<t;++s)for(var i=n[s],a=i.length,l,c=0;c<a;++c)(l=i[c])&&(r.push(e.call(l,l.__data__,c,i)),o.push(l));return new Fn(r,o)}function Gp(e){return function(){return this.matches(e)}}function Xp(e){return function(n){return n.matches(e)}}var cS=Array.prototype.find;function dS(e){return function(){return cS.call(this.children,e)}}function fS(){return this.firstElementChild}function pS(e){return this.select(e==null?fS:dS(typeof e=="function"?e:Xp(e)))}var hS=Array.prototype.filter;function vS(){return Array.from(this.children)}function mS(e){return function(){return hS.call(this.children,e)}}function _S(e){return this.selectAll(e==null?vS:mS(typeof e=="function"?e:Xp(e)))}function gS(e){typeof e!="function"&&(e=Gp(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,c=0;c<i;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&a.push(l);return new Fn(r,this._parents)}function Yp(e){return new Array(e.length)}function yS(){return new Fn(this._enter||this._groups.map(Yp),this._parents)}function pi(e,n){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=n}pi.prototype={constructor:pi,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,n){return this._parent.insertBefore(e,n)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function CS(e){return function(){return e}}function SS(e,n,t,r,o,s){for(var i=0,a,l=n.length,c=s.length;i<c;++i)(a=n[i])?(a.__data__=s[i],r[i]=a):t[i]=new pi(e,s[i]);for(;i<l;++i)(a=n[i])&&(o[i]=a)}function bS(e,n,t,r,o,s,i){var a,l,c=new Map,d=n.length,f=s.length,h=new Array(d),p;for(a=0;a<d;++a)(l=n[a])&&(h[a]=p=i.call(l,l.__data__,a,n)+"",c.has(p)?o[a]=l:c.set(p,l));for(a=0;a<f;++a)p=i.call(e,s[a],a,s)+"",(l=c.get(p))?(r[a]=l,l.__data__=s[a],c.delete(p)):t[a]=new pi(e,s[a]);for(a=0;a<d;++a)(l=n[a])&&c.get(h[a])===l&&(o[a]=l)}function ES(e){return e.__data__}function wS(e,n){if(!arguments.length)return Array.from(this,ES);var t=n?bS:SS,r=this._parents,o=this._groups;typeof e!="function"&&(e=CS(e));for(var s=o.length,i=new Array(s),a=new Array(s),l=new Array(s),c=0;c<s;++c){var d=r[c],f=o[c],h=f.length,p=IS(e.call(d,d&&d.__data__,c,r)),E=p.length,b=a[c]=new Array(E),T=i[c]=new Array(E),V=l[c]=new Array(h);t(d,f,b,T,V,p,n);for(var z=0,x=0,N,re;z<E;++z)if(N=b[z]){for(z>=x&&(x=z+1);!(re=T[x])&&++x<E;);N._next=re||null}}return i=new Fn(i,r),i._enter=a,i._exit=l,i}function IS(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function PS(){return new Fn(this._exit||this._groups.map(Yp),this._parents)}function $S(e,n,t){var r=this.enter(),o=this,s=this.exit();return typeof e=="function"?(r=e(r),r&&(r=r.selection())):r=r.append(e+""),n!=null&&(o=n(o),o&&(o=o.selection())),t==null?s.remove():t(s),r&&o?r.merge(o).order():o}function xS(e){for(var n=e.selection?e.selection():e,t=this._groups,r=n._groups,o=t.length,s=r.length,i=Math.min(o,s),a=new Array(o),l=0;l<i;++l)for(var c=t[l],d=r[l],f=c.length,h=a[l]=new Array(f),p,E=0;E<f;++E)(p=c[E]||d[E])&&(h[E]=p);for(;l<o;++l)a[l]=t[l];return new Fn(a,this._parents)}function DS(){for(var e=this._groups,n=-1,t=e.length;++n<t;)for(var r=e[n],o=r.length-1,s=r[o],i;--o>=0;)(i=r[o])&&(s&&i.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(i,s),s=i);return this}function MS(e){e||(e=kS);function n(f,h){return f&&h?e(f.__data__,h.__data__):!f-!h}for(var t=this._groups,r=t.length,o=new Array(r),s=0;s<r;++s){for(var i=t[s],a=i.length,l=o[s]=new Array(a),c,d=0;d<a;++d)(c=i[d])&&(l[d]=c);l.sort(n)}return new Fn(o,this._parents).order()}function kS(e,n){return e<n?-1:e>n?1:e>=n?0:NaN}function TS(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function VS(){return Array.from(this)}function NS(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length;o<s;++o){var i=r[o];if(i)return i}return null}function AS(){let e=0;for(const n of this)++e;return e}function FS(){return!this.node()}function OS(e){for(var n=this._groups,t=0,r=n.length;t<r;++t)for(var o=n[t],s=0,i=o.length,a;s<i;++s)(a=o[s])&&e.call(a,a.__data__,s,o);return this}function RS(e){return function(){this.removeAttribute(e)}}function BS(e){return function(){this.removeAttributeNS(e.space,e.local)}}function LS(e,n){return function(){this.setAttribute(e,n)}}function US(e,n){return function(){this.setAttributeNS(e.space,e.local,n)}}function HS(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttribute(e):this.setAttribute(e,t)}}function zS(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,t)}}function KS(e,n){var t=qi(e);if(arguments.length<2){var r=this.node();return t.local?r.getAttributeNS(t.space,t.local):r.getAttribute(t)}return this.each((n==null?t.local?BS:RS:typeof n=="function"?t.local?zS:HS:t.local?US:LS)(t,n))}function jp(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function WS(e){return function(){this.style.removeProperty(e)}}function GS(e,n,t){return function(){this.style.setProperty(e,n,t)}}function XS(e,n,t){return function(){var r=n.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,t)}}function YS(e,n,t){return arguments.length>1?this.each((n==null?WS:typeof n=="function"?XS:GS)(e,n,t??"")):Xr(this.node(),e)}function Xr(e,n){return e.style.getPropertyValue(n)||jp(e).getComputedStyle(e,null).getPropertyValue(n)}function jS(e){return function(){delete this[e]}}function qS(e,n){return function(){this[e]=n}}function ZS(e,n){return function(){var t=n.apply(this,arguments);t==null?delete this[e]:this[e]=t}}function JS(e,n){return arguments.length>1?this.each((n==null?jS:typeof n=="function"?ZS:qS)(e,n)):this.node()[e]}function qp(e){return e.trim().split(/^|\s+/)}function cu(e){return e.classList||new Zp(e)}function Zp(e){this._node=e,this._names=qp(e.getAttribute("class")||"")}Zp.prototype={add:function(e){var n=this._names.indexOf(e);n<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var n=this._names.indexOf(e);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function Jp(e,n){for(var t=cu(e),r=-1,o=n.length;++r<o;)t.add(n[r])}function Qp(e,n){for(var t=cu(e),r=-1,o=n.length;++r<o;)t.remove(n[r])}function QS(e){return function(){Jp(this,e)}}function eb(e){return function(){Qp(this,e)}}function nb(e,n){return function(){(n.apply(this,arguments)?Jp:Qp)(this,e)}}function tb(e,n){var t=qp(e+"");if(arguments.length<2){for(var r=cu(this.node()),o=-1,s=t.length;++o<s;)if(!r.contains(t[o]))return!1;return!0}return this.each((typeof n=="function"?nb:n?QS:eb)(t,n))}function rb(){this.textContent=""}function ob(e){return function(){this.textContent=e}}function sb(e){return function(){var n=e.apply(this,arguments);this.textContent=n??""}}function ib(e){return arguments.length?this.each(e==null?rb:(typeof e=="function"?sb:ob)(e)):this.node().textContent}function ab(){this.innerHTML=""}function lb(e){return function(){this.innerHTML=e}}function ub(e){return function(){var n=e.apply(this,arguments);this.innerHTML=n??""}}function cb(e){return arguments.length?this.each(e==null?ab:(typeof e=="function"?ub:lb)(e)):this.node().innerHTML}function db(){this.nextSibling&&this.parentNode.appendChild(this)}function fb(){return this.each(db)}function pb(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function hb(){return this.each(pb)}function vb(e){var n=typeof e=="function"?e:Kp(e);return this.select(function(){return this.appendChild(n.apply(this,arguments))})}function mb(){return null}function _b(e,n){var t=typeof e=="function"?e:Kp(e),r=n==null?mb:typeof n=="function"?n:uu(n);return this.select(function(){return this.insertBefore(t.apply(this,arguments),r.apply(this,arguments)||null)})}function gb(){var e=this.parentNode;e&&e.removeChild(this)}function yb(){return this.each(gb)}function Cb(){var e=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function Sb(){var e=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function bb(e){return this.select(e?Sb:Cb)}function Eb(e){return arguments.length?this.property("__data__",e):this.node().__data__}function wb(e){return function(n){e.call(this,n,this.__data__)}}function Ib(e){return e.trim().split(/^|\s+/).map(function(n){var t="",r=n.indexOf(".");return r>=0&&(t=n.slice(r+1),n=n.slice(0,r)),{type:n,name:t}})}function Pb(e){return function(){var n=this.__on;if(n){for(var t=0,r=-1,o=n.length,s;t<o;++t)s=n[t],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):n[++r]=s;++r?n.length=r:delete this.__on}}}function $b(e,n,t){return function(){var r=this.__on,o,s=wb(n);if(r){for(var i=0,a=r.length;i<a;++i)if((o=r[i]).type===e.type&&o.name===e.name){this.removeEventListener(o.type,o.listener,o.options),this.addEventListener(o.type,o.listener=s,o.options=t),o.value=n;return}}this.addEventListener(e.type,s,t),o={type:e.type,name:e.name,value:n,listener:s,options:t},r?r.push(o):this.__on=[o]}}function xb(e,n,t){var r=Ib(e+""),o,s=r.length,i;if(arguments.length<2){var a=this.node().__on;if(a){for(var l=0,c=a.length,d;l<c;++l)for(o=0,d=a[l];o<s;++o)if((i=r[o]).type===d.type&&i.name===d.name)return d.value}return}for(a=n?$b:Pb,o=0;o<s;++o)this.each(a(r[o],n,t));return this}function e0(e,n,t){var r=jp(e),o=r.CustomEvent;typeof o=="function"?o=new o(n,t):(o=r.document.createEvent("Event"),t?(o.initEvent(n,t.bubbles,t.cancelable),o.detail=t.detail):o.initEvent(n,!1,!1)),e.dispatchEvent(o)}function Db(e,n){return function(){return e0(this,e,n)}}function Mb(e,n){return function(){return e0(this,e,n.apply(this,arguments))}}function kb(e,n){return this.each((typeof n=="function"?Mb:Db)(e,n))}function*Tb(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length,i;o<s;++o)(i=r[o])&&(yield i)}var n0=[null];function Fn(e,n){this._groups=e,this._parents=n}function ss(){return new Fn([[document.documentElement]],n0)}function Vb(){return this}Fn.prototype=ss.prototype={constructor:Fn,select:sS,selectAll:uS,selectChild:pS,selectChildren:_S,filter:gS,data:wS,enter:yS,exit:PS,join:$S,merge:xS,selection:Vb,order:DS,sort:MS,call:TS,nodes:VS,node:NS,size:AS,empty:FS,each:OS,attr:KS,style:YS,property:JS,classed:tb,text:ib,html:cb,raise:fb,lower:hb,append:vb,insert:_b,remove:yb,clone:bb,datum:Eb,on:xb,dispatch:kb,[Symbol.iterator]:Tb};function Kt(e){return typeof e=="string"?new Fn([[document.querySelector(e)]],[document.documentElement]):new Fn([[e]],n0)}function Nb(e){let n;for(;n=e.sourceEvent;)e=n;return e}function Bt(e,n){if(e=Nb(e),n===void 0&&(n=e.currentTarget),n){var t=n.ownerSVGElement||n;if(t.createSVGPoint){var r=t.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}if(n.getBoundingClientRect){var o=n.getBoundingClientRect();return[e.clientX-o.left-n.clientLeft,e.clientY-o.top-n.clientTop]}}return[e.pageX,e.pageY]}const yl={capture:!0,passive:!1};function Cl(e){e.preventDefault(),e.stopImmediatePropagation()}function Ab(e){var n=e.document.documentElement,t=Kt(e).on("dragstart.drag",Cl,yl);"onselectstart"in n?t.on("selectstart.drag",Cl,yl):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}function Fb(e,n){var t=e.document.documentElement,r=Kt(e).on("dragstart.drag",null);n&&(r.on("click.drag",Cl,yl),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in t?r.on("selectstart.drag",null):(t.style.MozUserSelect=t.__noselect,delete t.__noselect)}function du(e,n,t){e.prototype=n.prototype=t,t.constructor=e}function t0(e,n){var t=Object.create(e.prototype);for(var r in n)t[r]=n[r];return t}function is(){}var jo=.7,hi=1/jo,Rr="\\s*([+-]?\\d+)\\s*",qo="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",at="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Ob=/^#([0-9a-f]{3,8})$/,Rb=new RegExp(`^rgb\\(${Rr},${Rr},${Rr}\\)$`),Bb=new RegExp(`^rgb\\(${at},${at},${at}\\)$`),Lb=new RegExp(`^rgba\\(${Rr},${Rr},${Rr},${qo}\\)$`),Ub=new RegExp(`^rgba\\(${at},${at},${at},${qo}\\)$`),Hb=new RegExp(`^hsl\\(${qo},${at},${at}\\)$`),zb=new RegExp(`^hsla\\(${qo},${at},${at},${qo}\\)$`),Gc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};du(is,Zo,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Xc,formatHex:Xc,formatHex8:Kb,formatHsl:Wb,formatRgb:Yc,toString:Yc});function Xc(){return this.rgb().formatHex()}function Kb(){return this.rgb().formatHex8()}function Wb(){return r0(this).formatHsl()}function Yc(){return this.rgb().formatRgb()}function Zo(e){var n,t;return e=(e+"").trim().toLowerCase(),(n=Ob.exec(e))?(t=n[1].length,n=parseInt(n[1],16),t===6?jc(n):t===3?new kn(n>>8&15|n>>4&240,n>>4&15|n&240,(n&15)<<4|n&15,1):t===8?Is(n>>24&255,n>>16&255,n>>8&255,(n&255)/255):t===4?Is(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|n&240,((n&15)<<4|n&15)/255):null):(n=Rb.exec(e))?new kn(n[1],n[2],n[3],1):(n=Bb.exec(e))?new kn(n[1]*255/100,n[2]*255/100,n[3]*255/100,1):(n=Lb.exec(e))?Is(n[1],n[2],n[3],n[4]):(n=Ub.exec(e))?Is(n[1]*255/100,n[2]*255/100,n[3]*255/100,n[4]):(n=Hb.exec(e))?Jc(n[1],n[2]/100,n[3]/100,1):(n=zb.exec(e))?Jc(n[1],n[2]/100,n[3]/100,n[4]):Gc.hasOwnProperty(e)?jc(Gc[e]):e==="transparent"?new kn(NaN,NaN,NaN,0):null}function jc(e){return new kn(e>>16&255,e>>8&255,e&255,1)}function Is(e,n,t,r){return r<=0&&(e=n=t=NaN),new kn(e,n,t,r)}function Gb(e){return e instanceof is||(e=Zo(e)),e?(e=e.rgb(),new kn(e.r,e.g,e.b,e.opacity)):new kn}function Sl(e,n,t,r){return arguments.length===1?Gb(e):new kn(e,n,t,r??1)}function kn(e,n,t,r){this.r=+e,this.g=+n,this.b=+t,this.opacity=+r}du(kn,Sl,t0(is,{brighter(e){return e=e==null?hi:Math.pow(hi,e),new kn(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?jo:Math.pow(jo,e),new kn(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new kn(gr(this.r),gr(this.g),gr(this.b),vi(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:qc,formatHex:qc,formatHex8:Xb,formatRgb:Zc,toString:Zc}));function qc(){return`#${pr(this.r)}${pr(this.g)}${pr(this.b)}`}function Xb(){return`#${pr(this.r)}${pr(this.g)}${pr(this.b)}${pr((isNaN(this.opacity)?1:this.opacity)*255)}`}function Zc(){const e=vi(this.opacity);return`${e===1?"rgb(":"rgba("}${gr(this.r)}, ${gr(this.g)}, ${gr(this.b)}${e===1?")":`, ${e})`}`}function vi(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function gr(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function pr(e){return e=gr(e),(e<16?"0":"")+e.toString(16)}function Jc(e,n,t,r){return r<=0?e=n=t=NaN:t<=0||t>=1?e=n=NaN:n<=0&&(e=NaN),new Kn(e,n,t,r)}function r0(e){if(e instanceof Kn)return new Kn(e.h,e.s,e.l,e.opacity);if(e instanceof is||(e=Zo(e)),!e)return new Kn;if(e instanceof Kn)return e;e=e.rgb();var n=e.r/255,t=e.g/255,r=e.b/255,o=Math.min(n,t,r),s=Math.max(n,t,r),i=NaN,a=s-o,l=(s+o)/2;return a?(n===s?i=(t-r)/a+(t<r)*6:t===s?i=(r-n)/a+2:i=(n-t)/a+4,a/=l<.5?s+o:2-s-o,i*=60):a=l>0&&l<1?0:i,new Kn(i,a,l,e.opacity)}function Yb(e,n,t,r){return arguments.length===1?r0(e):new Kn(e,n,t,r??1)}function Kn(e,n,t,r){this.h=+e,this.s=+n,this.l=+t,this.opacity=+r}du(Kn,Yb,t0(is,{brighter(e){return e=e==null?hi:Math.pow(hi,e),new Kn(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?jo:Math.pow(jo,e),new Kn(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,n=isNaN(e)||isNaN(this.s)?0:this.s,t=this.l,r=t+(t<.5?t:1-t)*n,o=2*t-r;return new kn(Ta(e>=240?e-240:e+120,o,r),Ta(e,o,r),Ta(e<120?e+240:e-120,o,r),this.opacity)},clamp(){return new Kn(Qc(this.h),Ps(this.s),Ps(this.l),vi(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=vi(this.opacity);return`${e===1?"hsl(":"hsla("}${Qc(this.h)}, ${Ps(this.s)*100}%, ${Ps(this.l)*100}%${e===1?")":`, ${e})`}`}}));function Qc(e){return e=(e||0)%360,e<0?e+360:e}function Ps(e){return Math.max(0,Math.min(1,e||0))}function Ta(e,n,t){return(e<60?n+(t-n)*e/60:e<180?t:e<240?n+(t-n)*(240-e)/60:n)*255}const o0=e=>()=>e;function jb(e,n){return function(t){return e+t*n}}function qb(e,n,t){return e=Math.pow(e,t),n=Math.pow(n,t)-e,t=1/t,function(r){return Math.pow(e+r*n,t)}}function Zb(e){return(e=+e)==1?s0:function(n,t){return t-n?qb(n,t,e):o0(isNaN(n)?t:n)}}function s0(e,n){var t=n-e;return t?jb(e,t):o0(isNaN(e)?n:e)}const ed=function e(n){var t=Zb(n);function r(o,s){var i=t((o=Sl(o)).r,(s=Sl(s)).r),a=t(o.g,s.g),l=t(o.b,s.b),c=s0(o.opacity,s.opacity);return function(d){return o.r=i(d),o.g=a(d),o.b=l(d),o.opacity=c(d),o+""}}return r.gamma=e,r}(1);function Ht(e,n){return e=+e,n=+n,function(t){return e*(1-t)+n*t}}var bl=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Va=new RegExp(bl.source,"g");function Jb(e){return function(){return e}}function Qb(e){return function(n){return e(n)+""}}function e5(e,n){var t=bl.lastIndex=Va.lastIndex=0,r,o,s,i=-1,a=[],l=[];for(e=e+"",n=n+"";(r=bl.exec(e))&&(o=Va.exec(n));)(s=o.index)>t&&(s=n.slice(t,s),a[i]?a[i]+=s:a[++i]=s),(r=r[0])===(o=o[0])?a[i]?a[i]+=o:a[++i]=o:(a[++i]=null,l.push({i,x:Ht(r,o)})),t=Va.lastIndex;return t<n.length&&(s=n.slice(t),a[i]?a[i]+=s:a[++i]=s),a.length<2?l[0]?Qb(l[0].x):Jb(n):(n=l.length,function(c){for(var d=0,f;d<n;++d)a[(f=l[d]).i]=f.x(c);return a.join("")})}var nd=180/Math.PI,El={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function i0(e,n,t,r,o,s){var i,a,l;return(i=Math.sqrt(e*e+n*n))&&(e/=i,n/=i),(l=e*t+n*r)&&(t-=e*l,r-=n*l),(a=Math.sqrt(t*t+r*r))&&(t/=a,r/=a,l/=a),e*r<n*t&&(e=-e,n=-n,l=-l,i=-i),{translateX:o,translateY:s,rotate:Math.atan2(n,e)*nd,skewX:Math.atan(l)*nd,scaleX:i,scaleY:a}}var $s;function n5(e){const n=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return n.isIdentity?El:i0(n.a,n.b,n.c,n.d,n.e,n.f)}function t5(e){return e==null||($s||($s=document.createElementNS("http://www.w3.org/2000/svg","g")),$s.setAttribute("transform",e),!(e=$s.transform.baseVal.consolidate()))?El:(e=e.matrix,i0(e.a,e.b,e.c,e.d,e.e,e.f))}function a0(e,n,t,r){function o(c){return c.length?c.pop()+" ":""}function s(c,d,f,h,p,E){if(c!==f||d!==h){var b=p.push("translate(",null,n,null,t);E.push({i:b-4,x:Ht(c,f)},{i:b-2,x:Ht(d,h)})}else(f||h)&&p.push("translate("+f+n+h+t)}function i(c,d,f,h){c!==d?(c-d>180?d+=360:d-c>180&&(c+=360),h.push({i:f.push(o(f)+"rotate(",null,r)-2,x:Ht(c,d)})):d&&f.push(o(f)+"rotate("+d+r)}function a(c,d,f,h){c!==d?h.push({i:f.push(o(f)+"skewX(",null,r)-2,x:Ht(c,d)}):d&&f.push(o(f)+"skewX("+d+r)}function l(c,d,f,h,p,E){if(c!==f||d!==h){var b=p.push(o(p)+"scale(",null,",",null,")");E.push({i:b-4,x:Ht(c,f)},{i:b-2,x:Ht(d,h)})}else(f!==1||h!==1)&&p.push(o(p)+"scale("+f+","+h+")")}return function(c,d){var f=[],h=[];return c=e(c),d=e(d),s(c.translateX,c.translateY,d.translateX,d.translateY,f,h),i(c.rotate,d.rotate,f,h),a(c.skewX,d.skewX,f,h),l(c.scaleX,c.scaleY,d.scaleX,d.scaleY,f,h),c=d=null,function(p){for(var E=-1,b=h.length,T;++E<b;)f[(T=h[E]).i]=T.x(p);return f.join("")}}}var r5=a0(n5,"px, ","px)","deg)"),o5=a0(t5,", ",")",")"),s5=1e-12;function td(e){return((e=Math.exp(e))+1/e)/2}function i5(e){return((e=Math.exp(e))-1/e)/2}function a5(e){return((e=Math.exp(2*e))-1)/(e+1)}const l5=function e(n,t,r){function o(s,i){var a=s[0],l=s[1],c=s[2],d=i[0],f=i[1],h=i[2],p=d-a,E=f-l,b=p*p+E*E,T,V;if(b<s5)V=Math.log(h/c)/n,T=function(ae){return[a+ae*p,l+ae*E,c*Math.exp(n*ae*V)]};else{var z=Math.sqrt(b),x=(h*h-c*c+r*b)/(2*c*t*z),N=(h*h-c*c-r*b)/(2*h*t*z),re=Math.log(Math.sqrt(x*x+1)-x),ie=Math.log(Math.sqrt(N*N+1)-N);V=(ie-re)/n,T=function(ae){var fe=ae*V,le=td(re),Z=c/(t*z)*(le*a5(n*fe+re)-i5(re));return[a+Z*p,l+Z*E,c*le/td(n*fe+re)]}}return T.duration=V*1e3*n/Math.SQRT2,T}return o.rho=function(s){var i=Math.max(.001,+s),a=i*i,l=a*a;return e(i,a,l)},o}(Math.SQRT2,2,4);var Yr=0,go=0,ao=0,l0=1e3,mi,yo,_i=0,wr=0,Zi=0,Jo=typeof performance=="object"&&performance.now?performance:Date,u0=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function fu(){return wr||(u0(u5),wr=Jo.now()+Zi)}function u5(){wr=0}function gi(){this._call=this._time=this._next=null}gi.prototype=c0.prototype={constructor:gi,restart:function(e,n,t){if(typeof e!="function")throw new TypeError("callback is not a function");t=(t==null?fu():+t)+(n==null?0:+n),!this._next&&yo!==this&&(yo?yo._next=this:mi=this,yo=this),this._call=e,this._time=t,wl()},stop:function(){this._call&&(this._call=null,this._time=1/0,wl())}};function c0(e,n,t){var r=new gi;return r.restart(e,n,t),r}function c5(){fu(),++Yr;for(var e=mi,n;e;)(n=wr-e._time)>=0&&e._call.call(void 0,n),e=e._next;--Yr}function rd(){wr=(_i=Jo.now())+Zi,Yr=go=0;try{c5()}finally{Yr=0,f5(),wr=0}}function d5(){var e=Jo.now(),n=e-_i;n>l0&&(Zi-=n,_i=e)}function f5(){for(var e,n=mi,t,r=1/0;n;)n._call?(r>n._time&&(r=n._time),e=n,n=n._next):(t=n._next,n._next=null,n=e?e._next=t:mi=t);yo=e,wl(r)}function wl(e){if(!Yr){go&&(go=clearTimeout(go));var n=e-wr;n>24?(e<1/0&&(go=setTimeout(rd,e-Jo.now()-Zi)),ao&&(ao=clearInterval(ao))):(ao||(_i=Jo.now(),ao=setInterval(d5,l0)),Yr=1,u0(rd))}}function od(e,n,t){var r=new gi;return n=n==null?0:+n,r.restart(o=>{r.stop(),e(o+n)},n,t),r}var p5=lu("start","end","cancel","interrupt"),h5=[],d0=0,sd=1,Il=2,Us=3,id=4,Pl=5,Hs=6;function Ji(e,n,t,r,o,s){var i=e.__transition;if(!i)e.__transition={};else if(t in i)return;v5(e,t,{name:n,index:r,group:o,on:p5,tween:h5,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:d0})}function pu(e,n){var t=jn(e,n);if(t.state>d0)throw new Error("too late; already scheduled");return t}function dt(e,n){var t=jn(e,n);if(t.state>Us)throw new Error("too late; already running");return t}function jn(e,n){var t=e.__transition;if(!t||!(t=t[n]))throw new Error("transition not found");return t}function v5(e,n,t){var r=e.__transition,o;r[n]=t,t.timer=c0(s,0,t.time);function s(c){t.state=sd,t.timer.restart(i,t.delay,t.time),t.delay<=c&&i(c-t.delay)}function i(c){var d,f,h,p;if(t.state!==sd)return l();for(d in r)if(p=r[d],p.name===t.name){if(p.state===Us)return od(i);p.state===id?(p.state=Hs,p.timer.stop(),p.on.call("interrupt",e,e.__data__,p.index,p.group),delete r[d]):+d<n&&(p.state=Hs,p.timer.stop(),p.on.call("cancel",e,e.__data__,p.index,p.group),delete r[d])}if(od(function(){t.state===Us&&(t.state=id,t.timer.restart(a,t.delay,t.time),a(c))}),t.state=Il,t.on.call("start",e,e.__data__,t.index,t.group),t.state===Il){for(t.state=Us,o=new Array(h=t.tween.length),d=0,f=-1;d<h;++d)(p=t.tween[d].value.call(e,e.__data__,t.index,t.group))&&(o[++f]=p);o.length=f+1}}function a(c){for(var d=c<t.duration?t.ease.call(null,c/t.duration):(t.timer.restart(l),t.state=Pl,1),f=-1,h=o.length;++f<h;)o[f].call(e,d);t.state===Pl&&(t.on.call("end",e,e.__data__,t.index,t.group),l())}function l(){t.state=Hs,t.timer.stop(),delete r[n];for(var c in r)return;delete e.__transition}}function zs(e,n){var t=e.__transition,r,o,s=!0,i;if(t){n=n==null?null:n+"";for(i in t){if((r=t[i]).name!==n){s=!1;continue}o=r.state>Il&&r.state<Pl,r.state=Hs,r.timer.stop(),r.on.call(o?"interrupt":"cancel",e,e.__data__,r.index,r.group),delete t[i]}s&&delete e.__transition}}function m5(e){return this.each(function(){zs(this,e)})}function _5(e,n){var t,r;return function(){var o=dt(this,e),s=o.tween;if(s!==t){r=t=s;for(var i=0,a=r.length;i<a;++i)if(r[i].name===n){r=r.slice(),r.splice(i,1);break}}o.tween=r}}function g5(e,n,t){var r,o;if(typeof t!="function")throw new Error;return function(){var s=dt(this,e),i=s.tween;if(i!==r){o=(r=i).slice();for(var a={name:n,value:t},l=0,c=o.length;l<c;++l)if(o[l].name===n){o[l]=a;break}l===c&&o.push(a)}s.tween=o}}function y5(e,n){var t=this._id;if(e+="",arguments.length<2){for(var r=jn(this.node(),t).tween,o=0,s=r.length,i;o<s;++o)if((i=r[o]).name===e)return i.value;return null}return this.each((n==null?_5:g5)(t,e,n))}function hu(e,n,t){var r=e._id;return e.each(function(){var o=dt(this,r);(o.value||(o.value={}))[n]=t.apply(this,arguments)}),function(o){return jn(o,r).value[n]}}function f0(e,n){var t;return(typeof n=="number"?Ht:n instanceof Zo?ed:(t=Zo(n))?(n=t,ed):e5)(e,n)}function C5(e){return function(){this.removeAttribute(e)}}function S5(e){return function(){this.removeAttributeNS(e.space,e.local)}}function b5(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttribute(e);return i===o?null:i===r?s:s=n(r=i,t)}}function E5(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttributeNS(e.space,e.local);return i===o?null:i===r?s:s=n(r=i,t)}}function w5(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttribute(e):(i=this.getAttribute(e),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function I5(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttributeNS(e.space,e.local):(i=this.getAttributeNS(e.space,e.local),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function P5(e,n){var t=qi(e),r=t==="transform"?o5:f0;return this.attrTween(e,typeof n=="function"?(t.local?I5:w5)(t,r,hu(this,"attr."+e,n)):n==null?(t.local?S5:C5)(t):(t.local?E5:b5)(t,r,n))}function $5(e,n){return function(t){this.setAttribute(e,n.call(this,t))}}function x5(e,n){return function(t){this.setAttributeNS(e.space,e.local,n.call(this,t))}}function D5(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&x5(e,s)),t}return o._value=n,o}function M5(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&$5(e,s)),t}return o._value=n,o}function k5(e,n){var t="attr."+e;if(arguments.length<2)return(t=this.tween(t))&&t._value;if(n==null)return this.tween(t,null);if(typeof n!="function")throw new Error;var r=qi(e);return this.tween(t,(r.local?D5:M5)(r,n))}function T5(e,n){return function(){pu(this,e).delay=+n.apply(this,arguments)}}function V5(e,n){return n=+n,function(){pu(this,e).delay=n}}function N5(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?T5:V5)(n,e)):jn(this.node(),n).delay}function A5(e,n){return function(){dt(this,e).duration=+n.apply(this,arguments)}}function F5(e,n){return n=+n,function(){dt(this,e).duration=n}}function O5(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?A5:F5)(n,e)):jn(this.node(),n).duration}function R5(e,n){if(typeof n!="function")throw new Error;return function(){dt(this,e).ease=n}}function B5(e){var n=this._id;return arguments.length?this.each(R5(n,e)):jn(this.node(),n).ease}function L5(e,n){return function(){var t=n.apply(this,arguments);if(typeof t!="function")throw new Error;dt(this,e).ease=t}}function U5(e){if(typeof e!="function")throw new Error;return this.each(L5(this._id,e))}function H5(e){typeof e!="function"&&(e=Gp(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,c=0;c<i;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&a.push(l);return new Tt(r,this._parents,this._name,this._id)}function z5(e){if(e._id!==this._id)throw new Error;for(var n=this._groups,t=e._groups,r=n.length,o=t.length,s=Math.min(r,o),i=new Array(r),a=0;a<s;++a)for(var l=n[a],c=t[a],d=l.length,f=i[a]=new Array(d),h,p=0;p<d;++p)(h=l[p]||c[p])&&(f[p]=h);for(;a<r;++a)i[a]=n[a];return new Tt(i,this._parents,this._name,this._id)}function K5(e){return(e+"").trim().split(/^|\s+/).every(function(n){var t=n.indexOf(".");return t>=0&&(n=n.slice(0,t)),!n||n==="start"})}function W5(e,n,t){var r,o,s=K5(n)?pu:dt;return function(){var i=s(this,e),a=i.on;a!==r&&(o=(r=a).copy()).on(n,t),i.on=o}}function G5(e,n){var t=this._id;return arguments.length<2?jn(this.node(),t).on.on(e):this.each(W5(t,e,n))}function X5(e){return function(){var n=this.parentNode;for(var t in this.__transition)if(+t!==e)return;n&&n.removeChild(this)}}function Y5(){return this.on("end.remove",X5(this._id))}function j5(e){var n=this._name,t=this._id;typeof e!="function"&&(e=uu(e));for(var r=this._groups,o=r.length,s=new Array(o),i=0;i<o;++i)for(var a=r[i],l=a.length,c=s[i]=new Array(l),d,f,h=0;h<l;++h)(d=a[h])&&(f=e.call(d,d.__data__,h,a))&&("__data__"in d&&(f.__data__=d.__data__),c[h]=f,Ji(c[h],n,t,h,c,jn(d,t)));return new Tt(s,this._parents,n,t)}function q5(e){var n=this._name,t=this._id;typeof e!="function"&&(e=Wp(e));for(var r=this._groups,o=r.length,s=[],i=[],a=0;a<o;++a)for(var l=r[a],c=l.length,d,f=0;f<c;++f)if(d=l[f]){for(var h=e.call(d,d.__data__,f,l),p,E=jn(d,t),b=0,T=h.length;b<T;++b)(p=h[b])&&Ji(p,n,t,b,h,E);s.push(h),i.push(d)}return new Tt(s,i,n,t)}var Z5=ss.prototype.constructor;function J5(){return new Z5(this._groups,this._parents)}function Q5(e,n){var t,r,o;return function(){var s=Xr(this,e),i=(this.style.removeProperty(e),Xr(this,e));return s===i?null:s===t&&i===r?o:o=n(t=s,r=i)}}function p0(e){return function(){this.style.removeProperty(e)}}function eE(e,n,t){var r,o=t+"",s;return function(){var i=Xr(this,e);return i===o?null:i===r?s:s=n(r=i,t)}}function nE(e,n,t){var r,o,s;return function(){var i=Xr(this,e),a=t(this),l=a+"";return a==null&&(l=a=(this.style.removeProperty(e),Xr(this,e))),i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a))}}function tE(e,n){var t,r,o,s="style."+n,i="end."+s,a;return function(){var l=dt(this,e),c=l.on,d=l.value[s]==null?a||(a=p0(n)):void 0;(c!==t||o!==d)&&(r=(t=c).copy()).on(i,o=d),l.on=r}}function rE(e,n,t){var r=(e+="")=="transform"?r5:f0;return n==null?this.styleTween(e,Q5(e,r)).on("end.style."+e,p0(e)):typeof n=="function"?this.styleTween(e,nE(e,r,hu(this,"style."+e,n))).each(tE(this._id,e)):this.styleTween(e,eE(e,r,n),t).on("end.style."+e,null)}function oE(e,n,t){return function(r){this.style.setProperty(e,n.call(this,r),t)}}function sE(e,n,t){var r,o;function s(){var i=n.apply(this,arguments);return i!==o&&(r=(o=i)&&oE(e,i,t)),r}return s._value=n,s}function iE(e,n,t){var r="style."+(e+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(n==null)return this.tween(r,null);if(typeof n!="function")throw new Error;return this.tween(r,sE(e,n,t??""))}function aE(e){return function(){this.textContent=e}}function lE(e){return function(){var n=e(this);this.textContent=n??""}}function uE(e){return this.tween("text",typeof e=="function"?lE(hu(this,"text",e)):aE(e==null?"":e+""))}function cE(e){return function(n){this.textContent=e.call(this,n)}}function dE(e){var n,t;function r(){var o=e.apply(this,arguments);return o!==t&&(n=(t=o)&&cE(o)),n}return r._value=e,r}function fE(e){var n="text";if(arguments.length<1)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;return this.tween(n,dE(e))}function pE(){for(var e=this._name,n=this._id,t=h0(),r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,c=0;c<a;++c)if(l=i[c]){var d=jn(l,n);Ji(l,e,t,c,i,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new Tt(r,this._parents,e,t)}function hE(){var e,n,t=this,r=t._id,o=t.size();return new Promise(function(s,i){var a={value:i},l={value:function(){--o===0&&s()}};t.each(function(){var c=dt(this,r),d=c.on;d!==e&&(n=(e=d).copy(),n._.cancel.push(a),n._.interrupt.push(a),n._.end.push(l)),c.on=n}),o===0&&s()})}var vE=0;function Tt(e,n,t,r){this._groups=e,this._parents=n,this._name=t,this._id=r}function h0(){return++vE}var _t=ss.prototype;Tt.prototype={constructor:Tt,select:j5,selectAll:q5,selectChild:_t.selectChild,selectChildren:_t.selectChildren,filter:H5,merge:z5,selection:J5,transition:pE,call:_t.call,nodes:_t.nodes,node:_t.node,size:_t.size,empty:_t.empty,each:_t.each,on:G5,attr:P5,attrTween:k5,style:rE,styleTween:iE,text:uE,textTween:fE,remove:Y5,tween:y5,delay:N5,duration:O5,ease:B5,easeVarying:U5,end:hE,[Symbol.iterator]:_t[Symbol.iterator]};function mE(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var _E={time:null,delay:0,duration:250,ease:mE};function gE(e,n){for(var t;!(t=e.__transition)||!(t=t[n]);)if(!(e=e.parentNode))throw new Error(`transition ${n} not found`);return t}function yE(e){var n,t;e instanceof Tt?(n=e._id,e=e._name):(n=h0(),(t=_E).time=fu(),e=e==null?null:e+"");for(var r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,c=0;c<a;++c)(l=i[c])&&Ji(l,e,n,c,i,t||gE(l,n));return new Tt(r,this._parents,e,n)}ss.prototype.interrupt=m5;ss.prototype.transition=yE;const xs=e=>()=>e;function CE(e,{sourceEvent:n,target:t,transform:r,dispatch:o}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},target:{value:t,enumerable:!0,configurable:!0},transform:{value:r,enumerable:!0,configurable:!0},_:{value:o}})}function wt(e,n,t){this.k=e,this.x=n,this.y=t}wt.prototype={constructor:wt,scale:function(e){return e===1?this:new wt(this.k*e,this.x,this.y)},translate:function(e,n){return e===0&n===0?this:new wt(this.k,this.x+this.k*e,this.y+this.k*n)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var vu=new wt(1,0,0);wt.prototype;function Na(e){e.stopImmediatePropagation()}function lo(e){e.preventDefault(),e.stopImmediatePropagation()}function SE(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function bE(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function ad(){return this.__zoom||vu}function EE(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function wE(){return navigator.maxTouchPoints||"ontouchstart"in this}function IE(e,n,t){var r=e.invertX(n[0][0])-t[0][0],o=e.invertX(n[1][0])-t[1][0],s=e.invertY(n[0][1])-t[0][1],i=e.invertY(n[1][1])-t[1][1];return e.translate(o>r?(r+o)/2:Math.min(0,r)||Math.max(0,o),i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i))}function PE(){var e=SE,n=bE,t=IE,r=EE,o=wE,s=[0,1/0],i=[[-1/0,-1/0],[1/0,1/0]],a=250,l=l5,c=lu("start","zoom","end"),d,f,h,p=500,E=150,b=0,T=10;function V(v){v.property("__zoom",ad).on("wheel.zoom",fe,{passive:!1}).on("mousedown.zoom",le).on("dblclick.zoom",Z).filter(o).on("touchstart.zoom",ne).on("touchmove.zoom",M).on("touchend.zoom touchcancel.zoom",q).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}V.transform=function(v,X,w,Y){var K=v.selection?v.selection():v;K.property("__zoom",ad),v!==K?re(v,X,w,Y):K.interrupt().each(function(){ie(this,arguments).event(Y).start().zoom(null,typeof X=="function"?X.apply(this,arguments):X).end()})},V.scaleBy=function(v,X,w,Y){V.scaleTo(v,function(){var K=this.__zoom.k,j=typeof X=="function"?X.apply(this,arguments):X;return K*j},w,Y)},V.scaleTo=function(v,X,w,Y){V.transform(v,function(){var K=n.apply(this,arguments),j=this.__zoom,J=w==null?N(K):typeof w=="function"?w.apply(this,arguments):w,te=j.invert(J),pe=typeof X=="function"?X.apply(this,arguments):X;return t(x(z(j,pe),J,te),K,i)},w,Y)},V.translateBy=function(v,X,w,Y){V.transform(v,function(){return t(this.__zoom.translate(typeof X=="function"?X.apply(this,arguments):X,typeof w=="function"?w.apply(this,arguments):w),n.apply(this,arguments),i)},null,Y)},V.translateTo=function(v,X,w,Y,K){V.transform(v,function(){var j=n.apply(this,arguments),J=this.__zoom,te=Y==null?N(j):typeof Y=="function"?Y.apply(this,arguments):Y;return t(vu.translate(te[0],te[1]).scale(J.k).translate(typeof X=="function"?-X.apply(this,arguments):-X,typeof w=="function"?-w.apply(this,arguments):-w),j,i)},Y,K)};function z(v,X){return X=Math.max(s[0],Math.min(s[1],X)),X===v.k?v:new wt(X,v.x,v.y)}function x(v,X,w){var Y=X[0]-w[0]*v.k,K=X[1]-w[1]*v.k;return Y===v.x&&K===v.y?v:new wt(v.k,Y,K)}function N(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function re(v,X,w,Y){v.on("start.zoom",function(){ie(this,arguments).event(Y).start()}).on("interrupt.zoom end.zoom",function(){ie(this,arguments).event(Y).end()}).tween("zoom",function(){var K=this,j=arguments,J=ie(K,j).event(Y),te=n.apply(K,j),pe=w==null?N(te):typeof w=="function"?w.apply(K,j):w,ye=Math.max(te[1][0]-te[0][0],te[1][1]-te[0][1]),ge=K.__zoom,_e=typeof X=="function"?X.apply(K,j):X,Se=l(ge.invert(pe).concat(ye/ge.k),_e.invert(pe).concat(ye/_e.k));return function(be){if(be===1)be=_e;else{var Me=Se(be),Oe=ye/Me[2];be=new wt(Oe,pe[0]-Me[0]*Oe,pe[1]-Me[1]*Oe)}J.zoom(null,be)}})}function ie(v,X,w){return!w&&v.__zooming||new ae(v,X)}function ae(v,X){this.that=v,this.args=X,this.active=0,this.sourceEvent=null,this.extent=n.apply(v,X),this.taps=0}ae.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,X){return this.mouse&&v!=="mouse"&&(this.mouse[1]=X.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=X.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=X.invert(this.touch1[0])),this.that.__zoom=X,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var X=Kt(this.that).datum();c.call(v,this.that,new CE(v,{sourceEvent:this.sourceEvent,target:V,transform:this.that.__zoom,dispatch:c}),X)}};function fe(v,...X){if(!e.apply(this,arguments))return;var w=ie(this,X).event(v),Y=this.__zoom,K=Math.max(s[0],Math.min(s[1],Y.k*Math.pow(2,r.apply(this,arguments)))),j=Bt(v);if(w.wheel)(w.mouse[0][0]!==j[0]||w.mouse[0][1]!==j[1])&&(w.mouse[1]=Y.invert(w.mouse[0]=j)),clearTimeout(w.wheel);else{if(Y.k===K)return;w.mouse=[j,Y.invert(j)],zs(this),w.start()}lo(v),w.wheel=setTimeout(J,E),w.zoom("mouse",t(x(z(Y,K),w.mouse[0],w.mouse[1]),w.extent,i));function J(){w.wheel=null,w.end()}}function le(v,...X){if(h||!e.apply(this,arguments))return;var w=v.currentTarget,Y=ie(this,X,!0).event(v),K=Kt(v.view).on("mousemove.zoom",pe,!0).on("mouseup.zoom",ye,!0),j=Bt(v,w),J=v.clientX,te=v.clientY;Ab(v.view),Na(v),Y.mouse=[j,this.__zoom.invert(j)],zs(this),Y.start();function pe(ge){if(lo(ge),!Y.moved){var _e=ge.clientX-J,Se=ge.clientY-te;Y.moved=_e*_e+Se*Se>b}Y.event(ge).zoom("mouse",t(x(Y.that.__zoom,Y.mouse[0]=Bt(ge,w),Y.mouse[1]),Y.extent,i))}function ye(ge){K.on("mousemove.zoom mouseup.zoom",null),Fb(ge.view,Y.moved),lo(ge),Y.event(ge).end()}}function Z(v,...X){if(e.apply(this,arguments)){var w=this.__zoom,Y=Bt(v.changedTouches?v.changedTouches[0]:v,this),K=w.invert(Y),j=w.k*(v.shiftKey?.5:2),J=t(x(z(w,j),Y,K),n.apply(this,X),i);lo(v),a>0?Kt(this).transition().duration(a).call(re,J,Y,v):Kt(this).call(V.transform,J,Y,v)}}function ne(v,...X){if(e.apply(this,arguments)){var w=v.touches,Y=w.length,K=ie(this,X,v.changedTouches.length===Y).event(v),j,J,te,pe;for(Na(v),J=0;J<Y;++J)te=w[J],pe=Bt(te,this),pe=[pe,this.__zoom.invert(pe),te.identifier],K.touch0?!K.touch1&&K.touch0[2]!==pe[2]&&(K.touch1=pe,K.taps=0):(K.touch0=pe,j=!0,K.taps=1+!!d);d&&(d=clearTimeout(d)),j&&(K.taps<2&&(f=pe[0],d=setTimeout(function(){d=null},p)),zs(this),K.start())}}function M(v,...X){if(this.__zooming){var w=ie(this,X).event(v),Y=v.changedTouches,K=Y.length,j,J,te,pe;for(lo(v),j=0;j<K;++j)J=Y[j],te=Bt(J,this),w.touch0&&w.touch0[2]===J.identifier?w.touch0[0]=te:w.touch1&&w.touch1[2]===J.identifier&&(w.touch1[0]=te);if(J=w.that.__zoom,w.touch1){var ye=w.touch0[0],ge=w.touch0[1],_e=w.touch1[0],Se=w.touch1[1],be=(be=_e[0]-ye[0])*be+(be=_e[1]-ye[1])*be,Me=(Me=Se[0]-ge[0])*Me+(Me=Se[1]-ge[1])*Me;J=z(J,Math.sqrt(be/Me)),te=[(ye[0]+_e[0])/2,(ye[1]+_e[1])/2],pe=[(ge[0]+Se[0])/2,(ge[1]+Se[1])/2]}else if(w.touch0)te=w.touch0[0],pe=w.touch0[1];else return;w.zoom("touch",t(x(J,te,pe),w.extent,i))}}function q(v,...X){if(this.__zooming){var w=ie(this,X).event(v),Y=v.changedTouches,K=Y.length,j,J;for(Na(v),h&&clearTimeout(h),h=setTimeout(function(){h=null},p),j=0;j<K;++j)J=Y[j],w.touch0&&w.touch0[2]===J.identifier?delete w.touch0:w.touch1&&w.touch1[2]===J.identifier&&delete w.touch1;if(w.touch1&&!w.touch0&&(w.touch0=w.touch1,delete w.touch1),w.touch0)w.touch0[1]=this.__zoom.invert(w.touch0[0]);else if(w.end(),w.taps===2&&(J=Bt(J,this),Math.hypot(f[0]-J[0],f[1]-J[1])<T)){var te=Kt(this).on("dblclick.zoom");te&&te.apply(this,arguments)}}}return V.wheelDelta=function(v){return arguments.length?(r=typeof v=="function"?v:xs(+v),V):r},V.filter=function(v){return arguments.length?(e=typeof v=="function"?v:xs(!!v),V):e},V.touchable=function(v){return arguments.length?(o=typeof v=="function"?v:xs(!!v),V):o},V.extent=function(v){return arguments.length?(n=typeof v=="function"?v:xs([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),V):n},V.scaleExtent=function(v){return arguments.length?(s[0]=+v[0],s[1]=+v[1],V):[s[0],s[1]]},V.translateExtent=function(v){return arguments.length?(i[0][0]=+v[0][0],i[1][0]=+v[1][0],i[0][1]=+v[0][1],i[1][1]=+v[1][1],V):[[i[0][0],i[0][1]],[i[1][0],i[1][1]]]},V.constrain=function(v){return arguments.length?(t=v,V):t},V.duration=function(v){return arguments.length?(a=+v,V):a},V.interpolate=function(v){return arguments.length?(l=v,V):l},V.on=function(){var v=c.on.apply(c,arguments);return v===c?V:v},V.clickDistance=function(v){return arguments.length?(b=(v=+v)*v,V):Math.sqrt(b)},V.tapDistance=function(v){return arguments.length?(T=+v,V):T},V}const v0=Symbol("MiniMapSlots"),$E=["id","x","y","rx","ry","width","height","fill","stroke","stroke-width","shape-rendering"],xE={name:"MiniMapNode",compatConfig:{MODE:3},inheritAttrs:!1},DE=We({...xE,props:{id:{},type:{},selected:{type:Boolean},dragging:{type:Boolean},position:{},dimensions:{},borderRadius:{},color:{},shapeRendering:{},strokeColor:{},strokeWidth:{},hidden:{type:Boolean}},emits:["click","dblclick","mouseenter","mousemove","mouseleave"],setup(e,{emit:n}){const t=e,r=Vn(v0),o=Kl(),s=Ye(()=>o.style??{});function i(f){n("click",f)}function a(f){n("dblclick",f)}function l(f){n("mouseenter",f)}function c(f){n("mousemove",f)}function d(f){n("mouseleave",f)}return(f,h)=>!f.hidden&&f.dimensions.width!==0&&f.dimensions.height!==0?(C(),I(he,{key:0},[de(r)[`node-${t.type}`]?(C(),Je(lr(de(r)[`node-${t.type}`]),K0(Oo({key:0},{...t,...f.$attrs})),null,16)):(C(),I("rect",Oo({key:1,id:f.id},f.$attrs,{class:["vue-flow__minimap-node",{selected:f.selected,dragging:f.dragging}],x:f.position.x,y:f.position.y,rx:f.borderRadius,ry:f.borderRadius,width:f.dimensions.width,height:f.dimensions.height,fill:f.color||s.value.background||s.value.backgroundColor,stroke:f.strokeColor,"stroke-width":f.strokeWidth,"shape-rendering":f.shapeRendering,onClick:i,onDblclick:a,onMouseenter:l,onMousemove:c,onMouseleave:d}),null,16,$E))],64)):me("",!0)}}),ME=["width","height","viewBox","aria-labelledby"],kE=["id"],TE=["d","fill","stroke","stroke-width"],VE={name:"MiniMap",compatConfig:{MODE:3}},NE=We({...VE,props:{nodeColor:{type:[String,Function],default:"#e2e2e2"},nodeStrokeColor:{type:[String,Function],default:"transparent"},nodeClassName:{type:[String,Function]},nodeBorderRadius:{default:5},nodeStrokeWidth:{default:2},maskColor:{default:"rgb(240, 240, 240, 0.6)"},maskStrokeColor:{default:"none"},maskStrokeWidth:{default:1},position:{default:"bottom-right"},pannable:{type:Boolean,default:!1},zoomable:{type:Boolean,default:!1},width:{},height:{},ariaLabel:{default:"Vue Flow mini map"},inversePan:{type:Boolean,default:!1},zoomStep:{default:1},offsetScale:{default:5},maskBorderRadius:{default:0}},emits:["click","nodeClick","nodeDblclick","nodeMouseenter","nodeMousemove","nodeMouseleave"],setup(e,{emit:n}){const t=uf(),r=Kl(),o=200,s=150,{id:i,edges:a,viewport:l,translateExtent:c,dimensions:d,emits:f,d3Selection:h,d3Zoom:p,getNodesInitialized:E}=nn(),b=Ee();ut(v0,t);const T=Ye(()=>{var K;return e.width??((K=r.style)==null?void 0:K.width)??o}),V=Ye(()=>{var K;return e.height??((K=r.style)==null?void 0:K.height)??s}),z=typeof window>"u"||window.chrome?"crispEdges":"geometricPrecision",x=ue(()=>typeof e.nodeColor=="string"?()=>e.nodeColor:e.nodeColor),N=ue(()=>typeof e.nodeStrokeColor=="string"?()=>e.nodeStrokeColor:e.nodeStrokeColor),re=ue(()=>typeof e.nodeClassName=="string"?()=>e.nodeClassName:typeof e.nodeClassName=="function"?e.nodeClassName:()=>""),ie=ue(()=>ou(E.value.filter(K=>!K.hidden))),ae=ue(()=>({x:-l.value.x/l.value.zoom,y:-l.value.y/l.value.zoom,width:d.value.width/l.value.zoom,height:d.value.height/l.value.zoom})),fe=ue(()=>E.value&&E.value.length?fy(ie.value,ae.value):ae.value),le=ue(()=>{const K=fe.value.width/T.value,j=fe.value.height/V.value;return Math.max(K,j)}),Z=ue(()=>{const K=le.value*T.value,j=le.value*V.value,J=e.offsetScale*le.value;return{offset:J,x:fe.value.x-(K-fe.value.width)/2-J,y:fe.value.y-(j-fe.value.height)/2-J,width:K+J*2,height:j+J*2}}),ne=ue(()=>!Z.value.x||!Z.value.y?"":`
    M${Z.value.x-Z.value.offset},${Z.value.y-Z.value.offset}
    h${Z.value.width+Z.value.offset*2}
    v${Z.value.height+Z.value.offset*2}
    h${-Z.value.width-Z.value.offset*2}z
    M${ae.value.x+e.maskBorderRadius},${ae.value.y}
    h${ae.value.width-2*e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},${e.maskBorderRadius}
    v${ae.value.height-2*e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},${e.maskBorderRadius}
    h${-(ae.value.width-2*e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},-${e.maskBorderRadius}
    v${-(ae.value.height-2*e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},-${e.maskBorderRadius}z`);Mh(K=>{if(b.value){const j=Kt(b.value),J=ye=>{if(ye.sourceEvent.type!=="wheel"||!h.value||!p.value)return;const ge=ye.sourceEvent.ctrlKey&&Yo()?10:1,_e=-ye.sourceEvent.deltaY*(ye.sourceEvent.deltaMode===1?.05:ye.sourceEvent.deltaMode?1:.002)*e.zoomStep,Se=l.value.zoom*2**(_e*ge);p.value.scaleTo(h.value,Se)},te=ye=>{if(ye.sourceEvent.type!=="mousemove"||!h.value||!p.value)return;const ge=le.value*Math.max(1,l.value.zoom)*(e.inversePan?-1:1),_e={x:l.value.x-ye.sourceEvent.movementX*ge,y:l.value.y-ye.sourceEvent.movementY*ge},Se=[[0,0],[d.value.width,d.value.height]],be=vu.translate(_e.x,_e.y).scale(l.value.zoom),Me=p.value.constrain()(be,Se,c.value);p.value.transform(h.value,Me)},pe=PE().wheelDelta(ye=>hl(ye)*(e.zoomStep/10)).on("zoom",e.pannable?te:()=>{}).on("zoom.wheel",e.zoomable?J:()=>{});j.call(pe),K(()=>{j.on("zoom",null)})}},{flush:"post"});function M(K){const[j,J]=Bt(K);n("click",{event:K,position:{x:j,y:J}})}function q(K,j){const J={event:K,node:j,connectedEdges:cr([j],a.value)};f.miniMapNodeClick(J),n("nodeClick",J)}function v(K,j){const J={event:K,node:j,connectedEdges:cr([j],a.value)};f.miniMapNodeDoubleClick(J),n("nodeDblclick",J)}function X(K,j){const J={event:K,node:j,connectedEdges:cr([j],a.value)};f.miniMapNodeMouseEnter(J),n("nodeMouseenter",J)}function w(K,j){const J={event:K,node:j,connectedEdges:cr([j],a.value)};f.miniMapNodeMouseMove(J),n("nodeMousemove",J)}function Y(K,j){const J={event:K,node:j,connectedEdges:cr([j],a.value)};f.miniMapNodeMouseLeave(J),n("nodeMouseleave",J)}return(K,j)=>(C(),Je(de(Up),{position:K.position,class:ve(["vue-flow__minimap",{pannable:K.pannable,zoomable:K.zoomable}])},{default:Un(()=>[(C(),I("svg",{ref_key:"el",ref:b,width:T.value,height:V.value,viewBox:[Z.value.x,Z.value.y,Z.value.width,Z.value.height].join(" "),role:"img","aria-labelledby":`vue-flow__minimap-${de(i)}`,onClick:M},[K.ariaLabel?(C(),I("title",{key:0,id:`vue-flow__minimap-${de(i)}`},H(K.ariaLabel),9,kE)):me("",!0),(C(!0),I(he,null,xe(de(E),J=>(C(),Je(DE,{id:J.id,key:J.id,f:"",position:J.computedPosition,dimensions:J.dimensions,selected:J.selected,dragging:J.dragging,style:Fe(J.style),class:ve(re.value(J)),color:x.value(J),"border-radius":K.nodeBorderRadius,"stroke-color":N.value(J),"stroke-width":K.nodeStrokeWidth,"shape-rendering":de(z),type:J.type,hidden:J.hidden,onClick:te=>q(te,J),onDblclick:te=>v(te,J),onMouseenter:te=>X(te,J),onMousemove:te=>w(te,J),onMouseleave:te=>Y(te,J)},null,8,["id","position","dimensions","selected","dragging","style","class","color","border-radius","stroke-color","stroke-width","shape-rendering","type","hidden","onClick","onDblclick","onMouseenter","onMousemove","onMouseleave"]))),128)),u("path",{class:"vue-flow__minimap-mask",d:ne.value,fill:K.maskColor,stroke:K.maskStrokeColor,"stroke-width":K.maskStrokeWidth,"fill-rule":"evenodd"},null,8,TE)],8,ME))]),_:1},8,["position","class"]))}}),Pn={pink:"#e879f9",green:"#4ade80",amber:"#fbbf24",cyan:"#22d3ee",orange:"#f97316",blue:"#818cf8"},uo={i2c:Pn.pink,smbus:Pn.green,jtag:Pn.amber,hisport:Pn.cyan,power:Pn.orange,default:Pn.blue},AE=[{type:"i2c",label:"I2C",color:Pn.pink},{type:"smbus",label:"SMBus",color:Pn.green},{type:"jtag",label:"JTAG",color:Pn.amber},{type:"hisport",label:"HiSport",color:Pn.cyan},{type:"trunk",label:"内部总线",color:Pn.blue}],He=(e,n)=>({chipType:e,label:n??e}),Co=(e,n,t="PCA9545")=>({label:t,channels:e,chips:n});function mn(e,n,t={}){return{id:e,label:e,busType:"i2c",color:Pn.pink,chips:n,...t}}function FE(e,n,t={}){return{id:e,label:e,busType:"smbus",color:Pn.green,chips:n,...t}}function ld(e,n,t={}){return{id:e,label:e,busType:"jtag",color:Pn.amber,chips:n,...t}}function qt(e,n={}){return{id:e,label:e,busType:"hisport",color:Pn.cyan,chips:[],...n}}const m0={boardLabel:"BMC",buses:[mn("i2cbus_1",[He("Smc","SMC")]),qt("Hisport_0"),qt("Hisport_1")]},OE={boardLabel:"EXU · ExpBoard",buses:[mn("I2c_1",[He("Eeprom"),He("Smc","SMC"),He("Cpld","CPLD")],{mux:Co(4,[He("Lm75","LM75")])}),mn("I2c_2",[],{mux:Co(4,[He("Cpld","CPLD"),He("Cpld","CPLD"),He("Cpld","CPLD"),He("Cpld","CPLD")])}),mn("I2c_3",[],{mux:Co(4,[])}),ld("JTAG_1",[He("Cpld","CPLD")]),qt("JtagOverLocalBus",{label:"JtagOverLocalBus"}),mn("I2c_5",[]),mn("I2c_6",[He("Eeprom"),He("Smc","SMC"),He("Lm75","LM75")],{mux:Co(4,[])}),mn("I2c_8-16",[],{dashed:!0}),ld("JTAG_2-8",[],{dashed:!0}),qt("Hisport × 22",{label:"Hisport × 22"})]},RE={boardLabel:"BCU · CpuBoard",buses:[mn("I2c_1",[He("Eeprom")],{mux:Co(6,[He("CPU"),He("CPU"),He("CPU"),He("CPU"),He("Eeprom"),He("Eeprom")])}),FE("I2c_2",[He("Smc","SMC"),He("Smc","SMC")]),mn("I2c_3",[],{dashed:!0}),qt("HiSport_1"),qt("HiSport_2")]},BE={boardLabel:"CLU · FanBoard",buses:[mn("I2c_1",[He("CPU"),He("Eeprom")])]},LE={boardLabel:"IEU · RiserCard",buses:[mn("I2c_1",[He("Eeprom"),He("Eeprom")]),mn("I2c_3",[He("Eeprom"),He("Eeprom")]),mn("I2c_r",[He("CPU"),He("Eeprom")]),qt("HiSport")]},UE={boardLabel:"SEU · HddBackplane",buses:[mn("I2c_1",[He("CPU"),He("CPU"),He("CPU")]),mn("I2c_2",[He("Smc","SMC"),He("Smc","SMC")])]},HE={boardLabel:"SEU · M2TransferCard",buses:[mn("I2c_1",[He("Eeprom"),He("CPU")])]},zE={boardLabel:"NICCard · BoardNICCard",buses:[mn("I2c_1",[He("CPU"),He("CPU"),He("CPU")]),qt("HiSport")]},KE={boardLabel:"未分类板卡",buses:[]};function Zr(e,n){return e==="BMC"?m0:e==="EXU"?OE:e==="BCU"?RE:e==="CLU"?BE:e==="IEU"?LE:e==="SEU"&&n.startsWith("M2")?HE:e==="SEU"?UE:e==="NICCard"?zE:KE}const WE=["width","height"],GE=["d","stroke"],XE=["onPointerdown"],YE={width:"13",height:"13",viewBox:"0 0 13 13",style:{"flex-shrink":"0"}},jE={class:"bus-abbr"},qE={class:"bus-name"},ZE=["onPointerdown","onClick"],JE={class:"chip-lbl"},QE=["onPointerdown","onClick"],ew={class:"mux-lbl"},nw={class:"mux-handles"},tw={key:0,class:"mux-handle mux-more"},rw=["onPointerdown","onClick"],ow={class:"chip-lbl"},Aa=118,ud=22,xr=60,Fa=34,Oa=72,co=46,Ra=8,sr=14,cd=10,sw=16,iw=We({__name:"MiniTopology",props:{buses:{}},emits:["chipClick"],setup(e,{emit:n}){const t=e,r=n,o={i2c:"I2C",smbus:"SMB",hisport:"HSP",jtag:"JTAG"},s=le=>o[le.busType]??le.busType,i=Aa+8,a=ud/2,l=le=>`bus:${le}`,c=(le,Z)=>`chip:${le}:${Z}`,d=le=>`mux:${le}`,f=(le,Z)=>`fchip:${le}:${Z}`;function h(le){const Z={};let ne=0;for(const M of le){Z[l(M.id)]={x:0,y:ne};const q=ne+a;let v=Fa;if(M.chips.forEach((X,w)=>{Z[c(M.id,w)]={x:i+w*(xr+Ra),y:q+sr}}),M.mux){const X=i+M.chips.length*(xr+Ra);if(Z[d(M.id)]={x:X,y:q+sr},M.mux.chips.length>0){const w=q+sr+co+cd;M.mux.chips.forEach((Y,K)=>{Z[f(M.id,K)]={x:X+K*(xr+Ra),y:w+sr}}),v=co+cd+sr+Fa}else v=co}else M.chips.length===0&&(v=0);ne+=a+sr+v+sw}return Z}const p=Ee({});Be(()=>t.buses,le=>{p.value=h(le)},{immediate:!0});const E=ue(()=>{let le=100;for(const[Z,ne]of Object.entries(p.value)){const M=Z.startsWith("bus:")?ud:Z.startsWith("mux:")?co:Fa;le=Math.max(le,ne.y+M)}return le+20}),b=ue(()=>{let le=200;for(const[Z,ne]of Object.entries(p.value)){const M=Z.startsWith("mux:")?Oa:Z.startsWith("bus:")?Aa:xr;le=Math.max(le,ne.x+M)}return le+20}),T=ue(()=>{const le=[];for(const Z of t.buses){const ne=p.value[l(Z.id)];if(!ne)continue;const M=ne.y+a,q=ne.x+Aa,v=[...Z.chips.map((X,w)=>({key:c(Z.id,w),w:xr})),...Z.mux?[{key:d(Z.id),w:Oa}]:[]];if(v.length>0){const X=v.map(K=>p.value[K.key]),w=X.map((K,j)=>K?K.x+v[j].w/2:q),Y=Math.max(q,...w);le.push({d:`M ${q} ${M} L ${Y} ${M}`,color:Z.color}),v.forEach((K,j)=>{const J=X[j];if(!J)return;const te=J.x+K.w/2;le.push({d:`M ${te} ${M} L ${te} ${J.y}`,color:Z.color})})}if(Z.mux&&Z.mux.chips.length>0){const X=p.value[d(Z.id)];if(!X)continue;const w=X.x+Oa/2,Y=X.y+co,K=Z.mux.chips.map((pe,ye)=>({key:f(Z.id,ye),w:xr})),j=K.map(pe=>p.value[pe.key]),J=j.map((pe,ye)=>pe?pe.x+K[ye].w/2:w),te=Math.min(...j.filter(Boolean).map(pe=>pe.y))-sr;if(j.some(Boolean)){const pe=Math.min(...J),ye=Math.max(...J);le.push({d:`M ${w} ${Y} L ${w} ${te}`,color:"#a855f7"}),le.push({d:`M ${pe} ${te} L ${ye} ${te}`,color:"#a855f7"}),K.forEach((ge,_e)=>{const Se=j[_e];if(!Se)return;const be=Se.x+ge.w/2;le.push({d:`M ${be} ${te} L ${be} ${Se.y}`,color:"#a855f7"})})}}}return le}),V=Ee(null),z=Ee(null),x=Ee(!1);function N(le,Z){Z.stopPropagation(),Z.preventDefault();const ne=p.value[le];ne&&(x.value=!1,V.value={key:le,startX:Z.clientX,startY:Z.clientY,origX:ne.x,origY:ne.y},z.value=le)}function re(le){const Z=V.value;Z&&(Math.abs(le.clientX-Z.startX)+Math.abs(le.clientY-Z.startY)>4&&(x.value=!0),p.value={...p.value,[Z.key]:{x:Z.origX+le.clientX-Z.startX,y:Z.origY+le.clientY-Z.startY}})}function ie(le){x.value||r("chipClick",le)}function ae(){V.value=null,z.value=null}bn(()=>{document.addEventListener("pointermove",re),document.addEventListener("pointerup",ae)}),Cr(()=>{document.removeEventListener("pointermove",re),document.removeEventListener("pointerup",ae)});function fe(){p.value=h(t.buses)}return(le,Z)=>(C(),I("div",{class:ve(["mt-root",{"is-dragging":!!V.value}]),style:Fe({height:E.value+"px",width:b.value+"px"})},[(C(),I("svg",{class:"wire-svg",width:b.value,height:E.value},[(C(!0),I(he,null,xe(T.value,(ne,M)=>(C(),I("path",{key:M,d:ne.d,stroke:ne.color+"cc","stroke-width":"1.5",fill:"none","stroke-linecap":"round"},null,8,GE))),128))],8,WE)),(C(!0),I(he,null,xe(e.buses,ne=>{var M,q,v,X;return C(),I(he,{key:ne.id},[u("div",{class:ve(["bus-pill draggable-item",{"item-hot":z.value===l(ne.id),"bus-dashed":ne.dashed}]),style:Fe({left:(((M=p.value[l(ne.id)])==null?void 0:M.x)??0)+"px",top:(((q=p.value[l(ne.id)])==null?void 0:q.y)??0)+"px",borderColor:ne.color,background:ne.color,color:"#fff"}),onPointerdown:w=>N(l(ne.id),w)},[(C(),I("svg",YE,[...Z[1]||(Z[1]=[u("circle",{cx:"6.5",cy:"6.5",r:"5.5",stroke:"rgba(255,255,255,0.9)","stroke-width":"1.5",fill:"none"},null,-1),u("circle",{cx:"6.5",cy:"6.5",r:"2.5",fill:"rgba(255,255,255,0.9)"},null,-1)])])),u("span",jE,H(s(ne)),1),u("span",qE,H(ne.label),1)],46,XE),(C(!0),I(he,null,xe(ne.chips,(w,Y)=>{var K,j;return C(),I("div",{key:c(ne.id,Y),class:ve(["chip-card draggable-item",{"item-hot":z.value===c(ne.id,Y),"bus-dashed":ne.dashed}]),style:Fe({left:(((K=p.value[c(ne.id,Y)])==null?void 0:K.x)??0)+"px",top:(((j=p.value[c(ne.id,Y)])==null?void 0:j.y)??0)+"px"}),onPointerdown:J=>N(c(ne.id,Y),J),onClick:Qe(J=>ie({label:w.label,chipType:w.chipType}),["stop"])},[u("div",JE,H(w.label),1)],46,ZE)}),128)),ne.mux?(C(),I(he,{key:0},[u("div",{class:ve(["mux-card draggable-item",{"item-hot":z.value===d(ne.id)}]),style:Fe({left:(((v=p.value[d(ne.id)])==null?void 0:v.x)??0)+"px",top:(((X=p.value[d(ne.id)])==null?void 0:X.y)??0)+"px"}),onPointerdown:w=>N(d(ne.id),w),onClick:Qe(w=>ie({label:ne.mux.label,chipType:"Pca9545"}),["stop"])},[u("div",ew,H(ne.mux.label),1),u("div",nw,[(C(!0),I(he,null,xe(Math.min(ne.mux.channels,6),w=>(C(),I("span",{key:w,class:"mux-handle"},H(w-1),1))),128)),ne.mux.channels>6?(C(),I("span",tw,"…")):me("",!0)])],46,QE),(C(!0),I(he,null,xe(ne.mux.chips,(w,Y)=>{var K,j;return C(),I("div",{key:f(ne.id,Y),class:ve(["chip-card draggable-item",{"item-hot":z.value===f(ne.id,Y)}]),style:Fe({left:(((K=p.value[f(ne.id,Y)])==null?void 0:K.x)??0)+"px",top:(((j=p.value[f(ne.id,Y)])==null?void 0:j.y)??0)+"px"}),onPointerdown:J=>N(f(ne.id,Y),J),onClick:Qe(J=>ie({label:w.label,chipType:w.chipType}),["stop"])},[u("div",ow,H(w.label),1)],46,rw)}),128))],64)):me("",!0)],64)}),128)),u("button",{class:"reset-btn",title:"重置元素位置",onPointerdown:Z[0]||(Z[0]=Qe(()=>{},["stop"])),onClick:fe},"↺ 重置",32)],6))}}),ft=(e,n)=>{const t=e.__vccOpts||e;for(const[r,o]of n)t[r]=o;return t},_0=ft(iw,[["__scopeId","data-v-62713b25"]]),aw={class:"board-tag"},lw={class:"bmc-sub"},uw={class:"bmc-topo-section"},cw=We({__name:"BmcNode",props:{id:{},type:{},selected:{type:Boolean},connectable:{type:[Boolean,Number,String,Function]},position:{},dimensions:{},label:{},isValidTargetPos:{type:Function},isValidSourcePos:{type:Function},parent:{},parentNodeId:{},dragging:{type:Boolean},resizing:{type:Boolean},zIndex:{},targetPosition:{},sourcePosition:{},dragHandle:{},data:{},events:{}},setup(e){const n=e,t=m0;return(r,o)=>(C(),I("div",{class:ve(["bmc-node",{"is-selected":n.selected}])},[u("div",aw,H(n.data.label??"BMC"),1),u("div",lw,H(n.data.subtitle??"根节点 · openUBMC"),1),u("div",uw,[o[0]||(o[0]=u("div",{class:"bmc-topo-label"},"I2C 拓扑",-1)),Ke(_0,{buses:de(t).buses},null,8,["buses"])]),Ke(de(Gt),{type:"source",position:de(De).Right,id:"r",style:{width:"8px",height:"8px",background:"#4f6ef7",border:"2px solid #0b0d12",right:"-5px"}},null,8,["position"])],2))}}),dw=ft(cw,[["__scopeId","data-v-da62d6f6"]]),mu=[{id:"14060876_00000001020302031825",partNumber:"14060876",sn:"00000001020302031825",type:"BCU",name:"CpuBoard_1",files:["14060876_00000001020302031825.sr","14060876_00000001020302031825_soft.sr"],connectors:[{name:"Connector_A1a",type:""},{name:"Connector_A1c",type:"PCIeRiserCard"},{name:"Connector_A2a",type:"PCIeRiserCard"},{name:"Connector_A2c",type:"PCIeRiserCard"},{name:"Connector_A3a",type:""},{name:"Connector_A4a",type:""},{name:"Connector_B1a",type:""},{name:"Connector_B2a",type:""},{name:"Connector_B3a",type:"PCIeRiserCard"},{name:"Connector_B3c",type:""},{name:"Connector_B4a",type:"PCIeRiserCard"},{name:"Connector_B4c",type:""},{name:"Connector_C4a",type:"PCIeRiserCard"},{name:"Connector_C5a",type:"PCIeRiserCard"},{name:"Connector_C6a",type:""},{name:"Connector_C7b",type:""},{name:"Connector_D4b",type:""},{name:"Connector_D5a",type:"PCIeRiserCard"},{name:"Connector_D6a",type:""},{name:"Connector_D7a",type:"PCIeRiserCard"},{name:"Connector_TrustedModule",type:"SecurityModule"}],topoKey:"Connector_A1a|Connector_A1c|Connector_A2a|Connector_A2c|Connector_A3a|Connector_A4a|Connector_B1a|Connector_B2a|Connector_B3a|Connector_B3c|Connector_B4a|Connector_B4c|Connector_C4a|Connector_C5a|Connector_C6a|Connector_C7b|Connector_D4b|Connector_D5a|Connector_D6a|Connector_D7a|Connector_TrustedModule",topoLabel:"A1a + 9×PCIeRiserCard + A3a + A4a + B1a + B2a + B3c + B4c + C6a + C7b + D4b + D6a + SecurityModule"},{id:"14100363_00000001050302023924",partNumber:"14100363",sn:"00000001050302023924",type:"CLU",name:"FanBoard_1",files:["14100363_00000001050302023924.sr","14100363_00000001050302023924_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100513_00000001010302044491",partNumber:"14100513",sn:"00000001010302044491",type:"EXU",name:"ExpBoard_1",files:["14100513_00000001010302044491.sr","14100513_00000001010302044491_soft.sr"],connectors:[{name:"Connector_PSR_EEP",type:""},{name:"Connector_BCU_1",type:"CPUBoard"},{name:"Connector_SEU_1",type:"DiskBackplane"},{name:"Connector_SEU_2",type:"DiskBackplane"},{name:"Connector_CLU_1",type:"FanBackplane"},{name:"Connector_LOM_1",type:""},{name:"Connector_LOM_2",type:""},{name:"Connector_OCP_1",type:""},{name:"Connector_OCP_2",type:""},{name:"Connector_PowerSupply_1",type:"Psu"},{name:"Connector_PowerSupply_2",type:"Psu"}],topoKey:"Connector_BCU_1|Connector_CLU_1|Connector_LOM_1|Connector_LOM_2|Connector_OCP_1|Connector_OCP_2|Connector_PSR_EEP|Connector_PowerSupply_1|Connector_PowerSupply_2|Connector_SEU_1|Connector_SEU_2",topoLabel:"PSR_EEP + CPUBoard + 2×DiskBackplane + FanBackplane + 4×NIC + 2×Psu"},{id:"14100513_00000001010302044492",partNumber:"14100513",sn:"00000001010302044492",type:"EXU",name:"ExpBoard_1",files:["14100513_00000001010302044492.sr","14100513_00000001010302044492_soft.sr"],connectors:[{name:"Connector_PSR_EEP",type:""},{name:"Connector_BCU_1",type:"CPUBoard"},{name:"Connector_SEU_1",type:"DiskBackplane"},{name:"Connector_SEU_2",type:"DiskBackplane"},{name:"Connector_SEU_3",type:"DiskBackplane"},{name:"Connector_CLU_1",type:"FanBackplane"},{name:"Connector_LOM_1",type:""},{name:"Connector_LOM_2",type:""},{name:"Connector_OCP_1",type:""},{name:"Connector_OCP_2",type:""},{name:"Connector_PowerSupply_1",type:"Psu"},{name:"Connector_PowerSupply_2",type:"Psu"}],topoKey:"Connector_BCU_1|Connector_CLU_1|Connector_LOM_1|Connector_LOM_2|Connector_OCP_1|Connector_OCP_2|Connector_PSR_EEP|Connector_PowerSupply_1|Connector_PowerSupply_2|Connector_SEU_1|Connector_SEU_2|Connector_SEU_3",topoLabel:"PSR_EEP + CPUBoard + 3×DiskBackplane + FanBackplane + 4×NIC + 2×Psu"},{id:"14100513_000000010402580311",partNumber:"14100513",sn:"000000010402580311",type:"IEU",name:"RiserCard_1",files:["14100513_000000010402580311.sr","14100513_000000010402580311_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT2",type:"PCIe"},{name:"Connector_PCIE_SLOT3",type:"PCIe"}],topoKey:"Connector_PCIE_SLOT2|Connector_PCIE_SLOT3",topoLabel:"2×PCIe"},{id:"14100513_000000010402580324",partNumber:"14100513",sn:"000000010402580324",type:"IEU",name:"RiserCard_1",files:["14100513_000000010402580324.sr","14100513_000000010402580324_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT1",type:"PCIe"},{name:"Connector_PCIE_SLOT2",type:"PCIe"}],topoKey:"Connector_PCIE_SLOT1|Connector_PCIE_SLOT2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302023945",partNumber:"14100513",sn:"00000001040302023945",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302023945.sr","14100513_00000001040302023945_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302023947",partNumber:"14100513",sn:"00000001040302023947",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302023947.sr","14100513_00000001040302023947_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302023953",partNumber:"14100513",sn:"00000001040302023953",type:"Unknown",name:"Unknown",files:["14100513_00000001040302023953.sr","14100513_00000001040302023953_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100513_00000001040302025554",partNumber:"14100513",sn:"00000001040302025554",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302025554.sr","14100513_00000001040302025554_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302044498",partNumber:"14100513",sn:"00000001040302044498",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044498.sr","14100513_00000001040302044498_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT1",type:"PCIe"},{name:"Connector_PCIE_SLOT2",type:"PCIe"},{name:"Connector_PCIE_SLOT3",type:"PCIe"}],topoKey:"Connector_PCIE_SLOT1|Connector_PCIE_SLOT2|Connector_PCIE_SLOT3",topoLabel:"3×PCIe"},{id:"14100513_00000001040302044499",partNumber:"14100513",sn:"00000001040302044499",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044499.sr","14100513_00000001040302044499_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT1",type:"PCIe"},{name:"Connector_PCIE_SLOT2",type:"PCIe"},{name:"Connector_PCIE_SLOT2TianChi",type:"PCIeTianchi"},{name:"Connector_PCIE_SLOT3",type:"PCIe"},{name:"Connector_PCIE_SLOT3TianChi",type:"PCIeTianchi"}],topoKey:"Connector_PCIE_SLOT1|Connector_PCIE_SLOT2|Connector_PCIE_SLOT2TianChi|Connector_PCIE_SLOT3|Connector_PCIE_SLOT3TianChi",topoLabel:"3×PCIe + 2×PCIeTianchi"},{id:"14100513_00000001040302044501",partNumber:"14100513",sn:"00000001040302044501",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044501.sr","14100513_00000001040302044501_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302044502",partNumber:"14100513",sn:"00000001040302044502",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044502.sr","14100513_00000001040302044502_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302044504",partNumber:"14100513",sn:"00000001040302044504",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044504.sr","14100513_00000001040302044504_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302046567",partNumber:"14100513",sn:"00000001040302046567",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302046567.sr","14100513_00000001040302046567_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302046572",partNumber:"14100513",sn:"00000001040302046572",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302046572.sr","14100513_00000001040302046572_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302046574",partNumber:"14100513",sn:"00000001040302046574",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302046574.sr","14100513_00000001040302046574_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302052957",partNumber:"14100513",sn:"00000001040302052957",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302052957.sr","14100513_00000001040302052957_soft.sr"],connectors:[{name:"Connector_PCIE_2",type:"PCIe"},{name:"Connector_PCIE_SLOT2TianChi",type:"PCIeTianchi"}],topoKey:"Connector_PCIE_2|Connector_PCIE_SLOT2TianChi",topoLabel:"PCIe + PCIeTianchi"},{id:"14100513_00000001040302066464",partNumber:"14100513",sn:"00000001040302066464",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302066464.sr","14100513_00000001040302066464_soft.sr"],connectors:[{name:"Connector_PCIE_2",type:"PCIe"},{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_SLOT1TianChi",type:"PCIeTianchi"},{name:"Connector_PCIE_SLOT2TianChi",type:"PCIeTianchi"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2|Connector_PCIE_SLOT1TianChi|Connector_PCIE_SLOT2TianChi",topoLabel:"2×PCIe + 2×PCIeTianchi"},{id:"14100665_00000001030302023925",partNumber:"14100665",sn:"00000001030302023925",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023925.sr","14100665_00000001030302023925_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100665_00000001030302023933",partNumber:"14100665",sn:"00000001030302023933",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023933.sr","14100665_00000001030302023933_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"},{name:"Connector_ComVPDConnect_5",type:"NVMe"},{name:"Connector_ComVPDConnect_6",type:"NVMe"},{name:"Connector_ComVPDConnect_7",type:"NVMe"},{name:"Connector_ComVPDConnect_8",type:"NVMe"},{name:"Connector_ComVPDConnect_9",type:"NVMe"},{name:"Connector_ComVPDConnect_10",type:"NVMe"},{name:"Connector_ComVPDConnect_11",type:"NVMe"},{name:"Connector_ComVPDConnect_12",type:"NVMe"},{name:"Connector_ComVPDConnect_13",type:"NVMe"},{name:"Connector_ComVPDConnect_14",type:"NVMe"},{name:"Connector_ComVPDConnect_15",type:"NVMe"},{name:"Connector_ComVPDConnect_16",type:"NVMe"},{name:"Connector_ComVPDConnect_17",type:"NVMe"},{name:"Connector_ComVPDConnect_18",type:"NVMe"},{name:"Connector_ComVPDConnect_19",type:"NVMe"},{name:"Connector_ComVPDConnect_20",type:"NVMe"},{name:"Connector_ComVPDConnect_21",type:"NVMe"},{name:"Connector_ComVPDConnect_22",type:"NVMe"},{name:"Connector_ComVPDConnect_23",type:"NVMe"},{name:"Connector_ComVPDConnect_24",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_10|Connector_ComVPDConnect_11|Connector_ComVPDConnect_12|Connector_ComVPDConnect_13|Connector_ComVPDConnect_14|Connector_ComVPDConnect_15|Connector_ComVPDConnect_16|Connector_ComVPDConnect_17|Connector_ComVPDConnect_18|Connector_ComVPDConnect_19|Connector_ComVPDConnect_2|Connector_ComVPDConnect_20|Connector_ComVPDConnect_21|Connector_ComVPDConnect_22|Connector_ComVPDConnect_23|Connector_ComVPDConnect_24|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4|Connector_ComVPDConnect_5|Connector_ComVPDConnect_6|Connector_ComVPDConnect_7|Connector_ComVPDConnect_8|Connector_ComVPDConnect_9",topoLabel:"24×NVMe"},{id:"14100665_00000001030302023934",partNumber:"14100665",sn:"00000001030302023934",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023934.sr","14100665_00000001030302023934_soft.sr"],connectors:[{name:"Connector_SEU_Inner_1",type:"DiskBackplane"},{name:"Connector_SEU_Inner_2",type:"DiskBackplane"}],topoKey:"Connector_SEU_Inner_1|Connector_SEU_Inner_2",topoLabel:"2×DiskBackplane"},{id:"14100665_00000001030302023936",partNumber:"14100665",sn:"00000001030302023936",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023936.sr","14100665_00000001030302023936_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"},{name:"Connector_SEU_Inner_1",type:"DiskBackplane"},{name:"Connector_SEU_Inner_2",type:"DiskBackplane"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4|Connector_SEU_Inner_1|Connector_SEU_Inner_2",topoLabel:"4×NVMe + 2×DiskBackplane"},{id:"14100665_00000001030302023938",partNumber:"14100665",sn:"00000001030302023938",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023938.sr","14100665_00000001030302023938_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"},{name:"Connector_ComVPDConnect_5",type:"NVMe"},{name:"Connector_ComVPDConnect_6",type:"NVMe"},{name:"Connector_ComVPDConnect_7",type:"NVMe"},{name:"Connector_ComVPDConnect_8",type:"NVMe"},{name:"Connector_ComVPDConnect_9",type:"NVMe"},{name:"Connector_ComVPDConnect_10",type:"NVMe"},{name:"Connector_ComVPDConnect_11",type:"NVMe"},{name:"Connector_ComVPDConnect_12",type:"NVMe"},{name:"Connector_ComVPDConnect_13",type:"NVMe"},{name:"Connector_ComVPDConnect_14",type:"NVMe"},{name:"Connector_ComVPDConnect_15",type:"NVMe"},{name:"Connector_ComVPDConnect_16",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_10|Connector_ComVPDConnect_11|Connector_ComVPDConnect_12|Connector_ComVPDConnect_13|Connector_ComVPDConnect_14|Connector_ComVPDConnect_15|Connector_ComVPDConnect_16|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4|Connector_ComVPDConnect_5|Connector_ComVPDConnect_6|Connector_ComVPDConnect_7|Connector_ComVPDConnect_8|Connector_ComVPDConnect_9",topoLabel:"16×NVMe"},{id:"14100665_00000001030302023954",partNumber:"14100665",sn:"00000001030302023954",type:"SEU",name:"M2TransferCard_1",files:["14100665_00000001030302023954.sr","14100665_00000001030302023954_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100665_00000001030302024340",partNumber:"14100665",sn:"00000001030302024340",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302024340.sr","14100665_00000001030302024340_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4",topoLabel:"4×NVMe"},{id:"14100665_00000001030302044496",partNumber:"14100665",sn:"00000001030302044496",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302044496.sr","14100665_00000001030302044496_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4",topoLabel:"4×NVMe"},{id:"14100665_00000001030302046566",partNumber:"14100665",sn:"00000001030302046566",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302046566.sr","14100665_00000001030302046566_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4",topoLabel:"4×NVMe"},{id:"14100665_00000001030302046571",partNumber:"14100665",sn:"00000001030302046571",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302046571.sr","14100665_00000001030302046571_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2",topoLabel:"2×NVMe"},{id:"14220246_00000001100302023955",partNumber:"14220246",sn:"00000001100302023955",type:"NICCard",name:"BoardNICCard_1",files:["14220246_00000001100302023955.sr","14220246_00000001100302023955_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14220246_00000001100302023956",partNumber:"14220246",sn:"00000001100302023956",type:"NICCard",name:"BoardNICCard_1",files:["14220246_00000001100302023956.sr","14220246_00000001100302023956_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14220246_00000001100302025549",partNumber:"14220246",sn:"00000001100302025549",type:"NICCard",name:"BoardNICCard_1",files:["14220246_00000001100302025549.sr","14220246_00000001100302025549_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"}],yi={BCU:"CPU 板 (BCU)",CLU:"风扇板 (CLU)",EXU:"拓展板 (EXU)",IEU:"Riser 卡 (IEU)",SEU:"存储/转接板 (SEU)",NICCard:"网卡 (NICCard)",Unknown:"未分类板卡"};function $l(e){const n=new Map;for(const o of e){const s=o.topoKey??"";n.has(s)||n.set(s,[]),n.get(s).push(o)}const t=[...n.entries()].sort((o,s)=>s[1].length-o[1].length),r="ABCDEFGHIJKLMNOPQRSTUVWXYZ";return t.map(([o,s],i)=>{var a;return{key:o,letter:r[i]??String(i+1),label:((a=s[0])==null?void 0:a.topoLabel)??(o||"标准结构"),boards:s}})}function fw(e=mu){const n=s=>`${s.type}__${s.name}`,t=new Map;for(const s of e){const i=n(s);t.has(i)||t.set(i,[]),t.get(i).push(s)}const r=[];for(const[s,i]of t){const a=i[0].type,l=i[0].name,c=a==="EXU",d=a==="Unknown",f=a==="Unknown"?"未分类":a,h=yi[a]??a,p=c?h:d?yi.Unknown:`${h} · ${l}`;r.push({id:`grp-${a}-${l}`.replace(/[^A-Za-z0-9_-]/g,"_"),type:a,name:l,label:p,shortLabel:f,boards:i,topoVariants:$l(i),category:c?"exu":d?"unknown":"child",state:d?"unclassified":"resolved"})}const o=["BCU","CLU","IEU","SEU","NICCard","Unknown"];return r.sort((s,i)=>{const a=o.indexOf(s.type),l=o.indexOf(i.type);return a!==l?(a===-1?999:a)-(l===-1?999:l):s.name.localeCompare(i.name)}),r}const fo="grp-EXU-ExpBoard_1";function pw(e){var l,c;const n=e.map(d=>{var f,h,p,E,b,T;return d.type==="EXU"?{...d,connectorRef:{parentGroupId:"bmc-root",connectorName:"I2c_3",bom:(f=d.boards[0])==null?void 0:f.partNumber,id:"01",auxId:"01",identifyMode:2,expectedFile:`${(h=d.boards[0])==null?void 0:h.partNumber}_${(p=d.boards[0])==null?void 0:p.sn}.sr`}}:d.category==="child"&&d.state==="resolved"?{...d,connectorRef:{parentGroupId:fo,connectorName:`I2c_${(d.type[0]||"x").toLowerCase()}`,bom:(E=d.boards[0])==null?void 0:E.partNumber,id:"01",auxId:"00",identifyMode:2,expectedFile:`${(b=d.boards[0])==null?void 0:b.partNumber}_${(T=d.boards[0])==null?void 0:T.sn}.sr`}}:d}),t=((l=e.find(d=>d.type==="IEU"))==null?void 0:l.boards)??[],r=((c=e.find(d=>d.type==="SEU"))==null?void 0:c.boards)??[],o={id:"grp-demo-multimatch",type:"IEU",name:"RiserCard_Demo",label:"Riser 卡 (IEU) · RiserCard_Demo",shortLabel:"IEU",boards:t.length>=2?[t[0]]:[],topoVariants:$l(t.length>=2?[t[0]]:[]),category:"child",state:"multi-match",connectorRef:{parentGroupId:fo,connectorName:"I2c_4",bom:"14100513",id:"02",auxId:"03",identifyMode:2,expectedFile:"14100513_00000001040302_*.sr"},fileMatches:t.slice(0,3).map((d,f)=>({file:d.files[0],relPath:`./vendor/openUBMC/${["taishan","tianchi","altas"][f]??"misc"}/`}))},s={id:"grp-demo-typeplaceholder",type:"SEU",name:"待选具体型号",label:"存储/转接板 (SEU) · 未指定具体型号",shortLabel:"SEU",boards:[],topoVariants:$l(r),category:"child",state:"type-placeholder",connectorRef:{parentGroupId:fo,connectorName:"I2c_5",id:"03",auxId:"01",identifyMode:1,type:"SEU"},typeCandidates:r},i={id:"grp-demo-missing",type:"NICCard",name:"NICCard_Missing",label:"网卡 (NICCard) · 文件缺失",shortLabel:"NICCard",boards:[],topoVariants:[],category:"child",state:"missing",connectorRef:{parentGroupId:fo,connectorName:"HSP_6",bom:"14220247",id:"05",auxId:"02",identifyMode:2,expectedFile:"14220247_00000001100302099999.sr"},missingFile:"14220247_00000001100302099999.sr"},a={id:"grp-demo-unclassified",type:"Unknown",name:"MysteryConnector_I2c_7",label:"未分类 · I2c_7 下游",shortLabel:"未分类",boards:[],topoVariants:[],category:"unknown",state:"unclassified",connectorRef:{parentGroupId:fo,connectorName:"I2c_7",identifyMode:1}};return[...n,o,s,i,a]}function dd(e){return e.state!=="unclassified"}const So={resolved:"已解析","multi-match":"多匹配","type-placeholder":"待选型号",unclassified:"未分类",missing:"文件缺失"},Ks={resolved:"#22c55e","multi-match":"#f59e0b","type-placeholder":"#eab308",unclassified:"#6b7280",missing:"#ef4444"},hw={class:"board-tag"},vw={class:"group-header"},mw={class:"group-badge"},_w=["title"],gw={class:"state-icon"},yw={key:0,class:"group-count"},Cw={key:1,class:"variant-combo-wrap nodrag nopan"},Sw={class:"vc-letter"},bw={class:"vc-label"},Ew={class:"vc-count"},ww={class:"combo-section-label"},Iw={class:"combo-list"},Pw=["onClick"],$w={class:"variant-item-letter"},xw={class:"variant-item-label"},Dw={class:"variant-item-count"},Mw={class:"combo-wrap nodrag nopan"},kw={class:"combo-sn"},Tw={class:"combo-pn"},Vw={key:1,class:"combo-sn combo-empty-prompt"},Nw={class:"combo-section-label"},Aw={class:"combo-list"},Fw={class:"item-sn"},Ow={class:"item-path"},Rw=["placeholder"],Bw={class:"combo-list"},Lw=["onClick"],Uw={class:"item-sn"},Hw={class:"item-pn"},zw={key:0,class:"combo-empty"},Kw={key:2,class:"combo-actions"},Ww={key:2,class:"topo-section nodrag nopan"},Gw={class:"topo-toggle"},Xw={class:"ph-caption"},Yw=We({__name:"BoardGroupNode",props:{id:{},type:{},selected:{type:Boolean},connectable:{type:[Boolean,Number,String,Function]},position:{},dimensions:{},label:{},isValidTargetPos:{type:Function},isValidSourcePos:{type:Function},parent:{},parentNodeId:{},dragging:{type:Boolean},resizing:{type:Boolean},zIndex:{},targetPosition:{},sourcePosition:{},dragHandle:{},data:{},events:{}},setup(e){const n=e,t=ue(()=>n.data.group),r=ue(()=>t.value.state??"resolved"),o=Vn("onChipPick",null),s=ue(()=>Zr(t.value.type,t.value.name)),i=ue(()=>{if(p.value)return p.value.boards;switch(r.value){case"type-placeholder":return t.value.typeCandidates??[];case"missing":return t.value.typeCandidates??[];case"multi-match":case"resolved":default:return t.value.boards}}),a=ue(()=>{const M=n.data.selectedId;return i.value.length?i.value.find(q=>q.id===M)??i.value[0]??null:null}),l=ue(()=>({label:So[r.value],color:Ks[r.value],icon:{resolved:"✓","multi-match":"⚠","type-placeholder":"◇",missing:"⛔",unclassified:"?"}[r.value]})),c=ue(()=>{var q,v,X;const M=t.value;switch(r.value){case"multi-match":return`匹配到 ${((q=M.fileMatches)==null?void 0:q.length)??0} 个 sr 文件 · 请选择其一`;case"type-placeholder":return`类型 ${M.type} · 共 ${((v=M.typeCandidates)==null?void 0:v.length)??0} 张可选`;case"missing":return`⛔ ${M.missingFile??((X=M.connectorRef)==null?void 0:X.expectedFile)??"文件未找到"}`;default:return""}}),d=ue(()=>r.value==="multi-match"||r.value==="type-placeholder"||r.value==="missing");function f(){var M,q;return r.value!=="resolved"?null:((q=(M=t.value.topoVariants)==null?void 0:M[0])==null?void 0:q.key)??null}const h=Ee(f());Be(()=>t.value.id,()=>{h.value=f()});const p=ue(()=>{var M;return h.value==null?null:((M=t.value.topoVariants)==null?void 0:M.find(q=>q.key===h.value))??null}),E=ue(()=>{var M;return r.value==="resolved"&&(((M=t.value.topoVariants)==null?void 0:M.length)??0)>1}),b=Ee(!1),T=Ee(!1),V=Ee(!1),z=Ee(""),x=Ee(null),N=ue(()=>{const M=z.value.trim().toLowerCase();return M?i.value.filter(q=>q.id.toLowerCase().includes(M)||q.sn.toLowerCase().includes(M)||q.partNumber.toLowerCase().includes(M)):i.value});function re(M){M.stopPropagation(),T.value=!T.value,T.value&&(z.value="",V.value=!1)}function ie(M,q){var v,X;q.stopPropagation(),T.value=!1,(X=(v=n.data).onSelect)==null||X.call(v,t.value.id,M.id)}function ae(M){M.stopPropagation(),V.value=!V.value,V.value&&(T.value=!1)}function fe(M,q){var X,w,Y,K;if(q.stopPropagation(),V.value=!1,M===h.value)return;h.value=M;const v=(w=(X=t.value.topoVariants)==null?void 0:X.find(j=>j.key===M))==null?void 0:w.boards[0];v&&((K=(Y=n.data).onSelect)==null||K.call(Y,t.value.id,v.id))}function le(M){x.value&&(x.value.contains(M.target)||(T.value=!1,V.value=!1))}Be([T,V],([M,q])=>{M||q?document.addEventListener("mousedown",le):document.removeEventListener("mousedown",le)}),Cr(()=>document.removeEventListener("mousedown",le));const Z={BCU:"#22c55e",CLU:"#f59e0b",EXU:"#a855f7",IEU:"#06b6d4",SEU:"#ec4899",NICCard:"#3b82f6",Unknown:"#6b7280"},ne=ue(()=>Z[t.value.type]??"#6b7280");return(M,q)=>{var v,X,w,Y,K;return C(),I("div",{ref_key:"rootEl",ref:x,class:ve(["group-node",{"is-selected":n.selected,"is-unknown":t.value.category==="unknown","state-resolved":r.value==="resolved","state-multimatch":r.value==="multi-match","state-typeplaceholder":r.value==="type-placeholder","state-missing":r.value==="missing"}])},[u("div",hw,H(t.value.label),1),Ke(de(Gt),{type:"target",position:de(De).Left,id:"l",style:Fe({width:"8px",height:"8px",background:ne.value,border:"2px solid #0b0d12",left:"-5px"})},null,8,["position","style"]),u("div",vw,[u("span",mw,H(t.value.shortLabel),1),u("span",{class:"state-pill",title:l.value.label,style:Fe({background:l.value.color+"26",color:l.value.color})},[u("span",gw,H(l.value.icon),1),u("span",null,H(l.value.label),1)],12,_w),i.value.length?(C(),I("span",yw,"× "+H(i.value.length),1)):me("",!0)]),c.value?(C(),I("div",{key:0,class:"state-hint",style:Fe({color:l.value.color})},H(c.value),5)):me("",!0),E.value?(C(),I("div",Cw,[u("button",{class:"variant-combo-btn",onPointerdown:q[0]||(q[0]=Qe(()=>{},["stop"])),onClick:ae},[u("span",Sw,"变体 "+H((v=p.value)==null?void 0:v.letter),1),u("span",bw,H(((X=p.value)==null?void 0:X.label)||"标准结构"),1),u("span",Ew,H((w=p.value)==null?void 0:w.boards.length)+" 个",1),u("span",{class:ve(["combo-caret",{open:V.value}])},"▾",2)],32),V.value?(C(),I("div",{key:0,class:"combo-dropdown",onPointerdown:q[1]||(q[1]=Qe(()=>{},["stop"]))},[u("div",ww,"拓扑结构变体 · "+H(t.value.topoVariants.length)+" 种",1),u("div",Iw,[(C(!0),I(he,null,xe(t.value.topoVariants,j=>(C(),I("div",{key:j.key,class:ve(["combo-item variant-item",{"is-active":j.key===h.value}]),onClick:J=>fe(j.key,J)},[u("span",$w,H(j.letter),1),u("span",xw,H(j.label||"标准结构"),1),u("span",Dw,H(j.boards.length)+" 个实例",1)],10,Pw))),128))])],32)):me("",!0)])):me("",!0),u("div",Mw,[u("button",{class:ve(["group-combo-btn",{"needs-action":d.value}]),onPointerdown:q[2]||(q[2]=Qe(()=>{},["stop"])),onClick:re},[a.value?(C(),I(he,{key:0},[u("span",kw,H(a.value.sn),1),u("span",Tw,"PN "+H(a.value.partNumber),1)],64)):(C(),I("span",Vw,H(r.value==="multi-match"?"选择具体 sr 文件 …":r.value==="type-placeholder"?`选择 ${t.value.type} 板卡 …`:r.value==="missing"?"重新指向板卡 …":"选择板卡 …"),1)),u("span",{class:ve(["combo-caret",{open:T.value}])},"▾",2)],34),T.value?(C(),I("div",{key:0,class:"combo-dropdown",onPointerdown:q[8]||(q[8]=Qe(()=>{},["stop"]))},[r.value==="multi-match"&&((Y=t.value.fileMatches)!=null&&Y.length)?(C(),I(he,{key:0},[u("div",Nw,"候选 sr 文件 · "+H(t.value.fileMatches.length)+" 个",1),u("div",Aw,[(C(!0),I(he,null,xe(t.value.fileMatches,j=>(C(),I("div",{key:j.file,class:"combo-item file-item",onClick:q[3]||(q[3]=Qe(J=>T.value=!1,["stop"]))},[u("span",Fw,H(j.file),1),u("span",Ow,H(j.relPath),1)]))),128))])],64)):(C(),I(he,{key:1},[Te(u("input",{"onUpdate:modelValue":q[4]||(q[4]=j=>z.value=j),class:"combo-search",type:"text",placeholder:r.value==="type-placeholder"?`筛选 ${t.value.type} 板卡 SN / PN…`:r.value==="missing"?"搜索要重新指向的板卡…":"搜索 SN / PN…",autocomplete:"off",onKeydown:q[5]||(q[5]=Qe(()=>{},["stop"]))},null,40,Rw),[[Ue,z.value]]),u("div",Bw,[(C(!0),I(he,null,xe(N.value,j=>{var J;return C(),I("div",{key:j.id,class:ve(["combo-item",{"is-active":j.id===((J=a.value)==null?void 0:J.id)}]),onClick:te=>ie(j,te)},[u("span",Uw,H(j.sn),1),u("span",Hw,"PN "+H(j.partNumber),1)],10,Lw)}),128)),N.value.length===0?(C(),I("div",zw,"无匹配")):me("",!0)])],64)),r.value==="missing"?(C(),I("div",Kw,[u("button",{class:"combo-action",onClick:q[6]||(q[6]=Qe(j=>T.value=!1,["stop"]))},"📁 重新指向文件"),u("button",{class:"combo-action",onClick:q[7]||(q[7]=Qe(j=>T.value=!1,["stop"]))},"🔍 查看 Connector 引用")])):me("",!0)],32)):me("",!0)]),r.value==="resolved"||r.value==="multi-match"?(C(),I("div",Ww,[u("div",{class:"topo-header",onClick:q[9]||(q[9]=Qe(j=>b.value=!b.value,["stop"]))},[q[11]||(q[11]=u("span",{class:"topo-header-label"},"I2C 拓扑",-1)),u("span",Gw,H(b.value?"▶":"▼"),1)]),b.value?me("",!0):(C(),Je(_0,{key:0,buses:s.value.buses,onChipClick:q[10]||(q[10]=j=>{var J;return(J=de(o))==null?void 0:J(t.value,j)})},null,8,["buses"]))])):(C(),I("div",{key:3,class:ve(["placeholder-illustration",`ph-${r.value}`])},[q[12]||(q[12]=u("div",{class:"ph-frame"},[u("div",{class:"ph-chip"}),u("div",{class:"ph-chip"}),u("div",{class:"ph-chip"})],-1)),u("div",Xw,H(r.value==="missing"?"默认板卡占位图":"待选板卡占位图"),1)],2)),(K=n.data.sourceHandles)!=null&&K.length?(C(!0),I(he,{key:4},xe(n.data.sourceHandles,(j,J)=>(C(),I(he,{key:j.id},[u("span",{class:"port-num",style:Fe({top:j.pct*100+"%",color:j.color})},H(String(J+1).padStart(2,"0")),5),Ke(de(Gt),{type:"source",position:de(De).Right,id:j.id,style:Fe({position:"absolute",width:"7px",height:"7px",background:j.color,border:"2px solid #09090e",right:"-5px",top:j.pct*100+"%",transform:"translateY(-50%)"})},null,8,["position","id","style"])],64))),128)):(C(),Je(de(Gt),{key:5,type:"source",position:de(De).Right,id:"r",style:Fe({width:"8px",height:"8px",background:ne.value,border:"2px solid #0b0d12",right:"-5px"})},null,8,["position","style"]))],2)}}}),jw=ft(Yw,[["__scopeId","data-v-d80d9fd3"]]),qw=["d","stroke-width"],Zw=["d","stroke-dasharray"],Jw="#151528",Qw=We({__name:"ManhattanEdge",props:{id:{},sourceNode:{},targetNode:{},source:{},target:{},type:{},label:{type:[String,Object,Function]},style:{},selected:{type:Boolean},sourcePosition:{},targetPosition:{},sourceHandleId:{},targetHandleId:{},animated:{type:Boolean},updatable:{type:Boolean},markerStart:{},markerEnd:{},curvature:{},interactionWidth:{},data:{},events:{},labelStyle:{},labelShowBg:{type:Boolean},labelBgStyle:{},labelBgPadding:{},labelBgBorderRadius:{},sourceX:{},sourceY:{},targetX:{},targetY:{}},setup(e){const n=e;function t(E,b,T,V,z,x=12){const N=b<z?1:-1,re=Math.abs(z-b);if(re<2)return`M ${E} ${b} L ${V} ${z}`;const ie=Math.min(x,re/2),ae=Math.min(x,Math.abs(T-E)/2),fe=Math.min(x,Math.abs(V-T)/2);return`M ${E} ${b} L ${T-ae} ${b} Q ${T} ${b}, ${T} ${b+N*ie} L ${T} ${z-N*ie} Q ${T} ${z}, ${T+fe} ${z} L ${V} ${z}`}const r=Vn("activeEdgeId",Ee(null)),o=ue(()=>!r.value||n.id===r.value),s=ue(()=>{var E;return((E=n.style)==null?void 0:E.strokeWidth)??1.5}),i=ue(()=>{var E;return((E=n.style)==null?void 0:E.opacity)??.88}),a=ue(()=>{var E;return(E=n.style)==null?void 0:E.strokeDasharray}),l=ue(()=>{var E;return((E=n.style)==null?void 0:E.stroke)??"#818cf8"}),c=ue(()=>o.value?i.value:.1),d=ue(()=>{var E;return((E=n.data)==null?void 0:E.yOffAtTarget)??0}),f=ue(()=>{var E;return n.sourceX+(((E=n.data)==null?void 0:E.laneOffset)??80)+d.value}),h=ue(()=>n.targetY+d.value),p=ue(()=>t(n.sourceX,n.sourceY,f.value,n.targetX,h.value));return(E,b)=>(C(),I(he,null,[u("path",{d:p.value,stroke:Jw,"stroke-width":s.value+3.5,fill:"none","stroke-linecap":"round","stroke-linejoin":"round",style:Fe([{"pointer-events":"none",transition:"opacity 0.18s"},{opacity:c.value}])},null,12,qw),u("path",{d:p.value,fill:"none","stroke-linecap":"round","stroke-linejoin":"round","stroke-dasharray":a.value,class:"vue-flow__edge-path",style:Fe([{transition:"opacity 0.18s,stroke-width 0.18s"},{stroke:l.value,strokeWidth:(o.value?s.value+.5:s.value)+"px",opacity:c.value}])},null,12,Zw)],64))}}),Rn=Gn({anchor:"topology",dockTool:null,selectedBoardId:null,inbound:{smc:null,expr:null,cooling:null,alarm:null},lastWriteback:null,codeDoc:null});function Qi(){function e(c){Rn.anchor=c}function n(c){Rn.selectedBoardId=c}function t(c,d){Rn.inbound[c]={...d,ts:Date.now()},Rn.dockTool=c}function r(c){Rn.dockTool=Rn.dockTool===c?null:c}function o(){Rn.dockTool=null}function s(c){Rn.inbound[c]=null}function i(c,d,f){Rn.lastWriteback={tool:c,label:d,code:f,ts:Date.now()}}function a(c,d){Rn.codeDoc={file:c,content:d}}function l(){Rn.codeDoc=null}return{state:Rn,setAnchor:e,selectEntity:n,invoke:t,toggleDock:r,closeDock:o,clearInbound:s,writeBack:i,openCodeDoc:a,closeCodeDoc:l}}const bo=[{id:4,label:"高于门限",symbol:"≥",desc:"读数 ≥ 门限值即告警。适用过温、过压、带宽过载等「越大越危险」的量。",recommendFor:["threshold"]},{id:1,label:"低于门限",symbol:"≤",desc:"读数 ≤ 门限值即告警。适用欠压、转速偏低、余量偏低等「越小越危险」的量。",recommendFor:["threshold"]},{id:5,label:"状态命中",symbol:"=",desc:"读数 = 触发值（离散量一般为 1）即告警。适用 CATERR、在位、链路状态等。",recommendFor:["discrete"]},{id:3,label:"严格大于",symbol:">",desc:"读数 > 门限值即告警（不含等于），少数场景使用。",recommendFor:[]},{id:2,label:"严格小于",symbol:"<",desc:"读数 < 门限值即告警（不含等于），少数场景使用。",recommendFor:[]},{id:6,label:"状态跳变",symbol:"⇌",desc:"读数状态发生跳变（边沿）即告警。用于 GetFail 监控、按钮长按等由 0/1 边沿驱动的事件。",recommendFor:[]},{id:7,label:"在位 / 插入",symbol:"＋",desc:"器件由缺失变为在位（插入）时告警。用于电源 / 风扇 / 硬盘等热插拔部件的安装事件。",recommendFor:[]},{id:8,label:"离位 / 移除",symbol:"－",desc:"器件由在位变为缺失（移除）时告警。用于电源 / 风扇 / 硬盘等热插拔部件的移除事件。",recommendFor:[]}];function eI(e){return bo.find(n=>n.id===e)}const Ws=[{label:"BCU/EXU PowerGood 告警",periodMs:100,desc:"电源就绪类，最高优先级。",recommendFor:["powergood"]},{label:"影响业务的离散电压/时钟/CPU 故障",periodMs:400,desc:"影响业务的关键离散信号。",recommendFor:["caterr","prochot","clockfail"]},{label:"业务关键状态（复位/上电超时/异常掉电/ThermTrip）",periodMs:400,desc:"系统级关键状态。",recommendFor:["thermaltrip"]},{label:"故障诊断的故障检测",periodMs:1e3,desc:"一般故障诊断检测。"},{label:"门限类温度扫描",periodMs:1e3,desc:"门限温度传感器。",recommendFor:["temperature"]},{label:"门限类电压扫描",periodMs:3e3,desc:"门限电压传感器。",recommendFor:["voltage"]},{label:"风扇转速扫描",periodMs:1e3,desc:"风扇转速。",recommendFor:["fanspeed"]},{label:"热插拔部件在位",periodMs:2e3,desc:"热插拔在位状态。",recommendFor:["presence_hotplug"]},{label:"非热插拔部件在位",periodMs:8e3,desc:"非热插拔在位扫描。",recommendFor:["presence"]},{label:"不影响业务的硬件状态",periodMs:5e3,desc:"普通硬件状态。"},{label:"硬盘类状态扫描",periodMs:5e3,desc:"硬盘状态。",recommendFor:["disk_presence"]},{label:"光模块温度",periodMs:1e4,desc:"连续 12 次失败认为异常。",recommendFor:["om_temperature"]}];function fd(e){return Ws.find(n=>{var t;return(t=n.recommendFor)==null?void 0:t.includes(e)})??Ws.find(n=>n.periodMs===1e3)??Ws[3]}const pd={deviceField:"器件读数：直接订阅器件模型已暴露的语义量（如 CPU_1.TemperatureCelsius），缩放/单位已在上游做好，最省心，优先用。",scanner:"周期读(Scanner)：BMC 按 Period 周期性读一段芯片寄存器（Chip+Offset+Size+Mask），把原始值放进 .Value，供传感器/事件订阅。",accessor:"按需读(Accessor)：与 Scanner 字段完全相同，但没有 Period —— 只在被引用时读一次。告警用周期读(Scanner)，一次性读配置/在位用 Accessor。"},un={temperature:{key:"temperature",label:"温度",kind:"threshold",unitLabel:"°C",readingField:"TemperatureCelsius",sensor:{SensorType:1,ReadingType:1,BaseUnit:1,Unit:128,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:2,periodKey:"temperature",thresholds:{UpperNoncritical:95,UpperCritical:100,UpperNonrecoverable:105},events:[{suffix:"OverMinor",label:"过温·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"CPU.CPUOverTempMinor"},{suffix:"OverMajor",label:"过温·严重",levelField:"UpperCritical",operatorId:4,severity:"Major",eventKeyId:"CPU.CPUOverTempCritical"},{suffix:"OverFatal",label:"过温·不可恢复",levelField:"UpperNonrecoverable",operatorId:4,severity:"Critical",eventKeyId:"CPU.CPUOverTempFatal"}],eventKeyIds:["PCIeCard.PCIeCardOverTemp","CPU.CPUOverTempCritical","Chassis.ChassisInletOverTempMinor"]},explain:"器件温度（°C）。越高越危险，一个温度传感器按「预警/严重/不可恢复」三档各产出一条过温告警。"},voltage:{key:"voltage",label:"电压",kind:"threshold",unitLabel:"V",readingField:"Voltage",sensor:{SensorType:2,ReadingType:1,BaseUnit:4,Unit:128,M:1,RBExp:-3,Analog:1},recommend:{operatorId:1,hysteresis:0,periodKey:"voltage",thresholds:{UpperCritical:1.1,UpperNoncritical:1.05,LowerNoncritical:.95,LowerCritical:.9},events:[{suffix:"OverMajor",label:"过压·严重",levelField:"UpperCritical",operatorId:4,severity:"Major",eventKeyId:"CpuBoard.OverVoltageMajor"},{suffix:"OverMinor",label:"过压·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"CpuBoard.OverVoltageMinor"},{suffix:"LowerMinor",label:"欠压·预警",levelField:"LowerNoncritical",operatorId:1,severity:"Minor",eventKeyId:"CpuBoard.LowerVoltageMinor"},{suffix:"LowerMajor",label:"欠压·严重",levelField:"LowerCritical",operatorId:1,severity:"Major",eventKeyId:"CpuBoard.LowerVoltageMajor"}],eventKeyIds:["CpuBoard.OverVoltage","CpuBoard.LowerVoltage","Mainboard.MainboardOverVoltageMajor","Mainboard.MainboardLowerVoltageMajor"]},explain:"供电电压（V）。过压欠压都要防：一条电压轨(rail)按「过压严重/过压预警/欠压预警/欠压严重」四档各产出一条告警。一个电压域通常有多条轨。"},fanspeed:{key:"fanspeed",label:"风扇转速",kind:"threshold",unitLabel:"RPM",readingField:"SpeedRPM",sensor:{SensorType:4,ReadingType:1,BaseUnit:18,Unit:0,M:1,RBExp:0,Analog:1},recommend:{operatorId:1,hysteresis:100,periodKey:"fanspeed",thresholds:{LowerNoncritical:1500,LowerCritical:800},events:[{suffix:"LowMinor",label:"转速偏低·预警",levelField:"LowerNoncritical",operatorId:1,severity:"Minor",eventKeyId:"Fan.FanLowSpeedMinor"},{suffix:"LowMajor",label:"转速过低·严重",levelField:"LowerCritical",operatorId:1,severity:"Major",eventKeyId:"Fan.FanLowSpeedMajor"}],eventKeyIds:["Fan.FanLowSpeed","Cooling.FanSpeedLow"]},explain:"风扇转速（RPM）。转速过低影响散热，按「偏低预警/过低严重」两档告警。"},bandwidth:{key:"bandwidth",label:"带宽占用率",kind:"threshold",unitLabel:"%",readingField:"BandwidthUsagePercent",sensor:{SensorType:1,ReadingType:1,BaseUnit:6,Unit:0,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:0,periodKey:"bandwidth",thresholds:{UpperNoncritical:90,UpperCritical:100},events:[{suffix:"HighMinor",label:"带宽过载·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"NICCard.SystemNetworkBandwidthUsageHigh"}],eventKeyIds:["NICCard.SystemNetworkBandwidthUsageHigh"]},explain:"端口带宽占用百分比。用于业务网络过载预警。"},caterr:{key:"caterr",label:"CATERR（CPU 灾难性错误）",kind:"discrete",readingField:"CATERR",sensor:{SensorType:7,ReadingType:111,AssertMask:2,DeassertMask:2,DiscreteMask:2},recommend:{operatorId:5,condition:1,periodKey:"caterr",eventKeyIds:["CPU.CPUCATERR","Processor.ProcessorCATERR"]},explain:"CPU 灾难性错误信号，置位即故障。离散量，「状态命中」即告警。"},prochot:{key:"prochot",label:"ProcessorHot（CPU 过热降频）",kind:"discrete",readingField:"ProcessorHot",sensor:{SensorType:7,ReadingType:111,AssertMask:2,DeassertMask:2,DiscreteMask:2},recommend:{operatorId:5,condition:1,periodKey:"prochot",eventKeyIds:["CPU.CPUProcHot","Processor.ProcessorHot"]},explain:"CPU 过热触发降频。离散量，置位即告警。"},thermaltrip:{key:"thermaltrip",label:"ThermalTrip（过热掉电）",kind:"discrete",readingField:"ThermalTrip",sensor:{SensorType:7,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:1,periodKey:"thermaltrip",eventKeyIds:["CPU.CPUThermalTrip"]},explain:"CPU 过热保护掉电，最高危离散状态。"},presence:{key:"presence",label:"在位状态",kind:"discrete",readingField:"Presence",sensor:{SensorType:8,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:0,periodKey:"presence",eventKeyIds:["Component.ComponentRemoved"]},explain:"部件是否在位。离散量；不在位（=0）时可告警。"},disk_presence:{key:"disk_presence",label:"硬盘在位",kind:"discrete",readingField:"Presence",sensor:{SensorType:8,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:0,periodKey:"disk_presence",eventKeyIds:["Disk.DiskRemoved","Storage.DiskAbsent"]},explain:"硬盘是否在位。SEU/背板类扫描周期 5s。"},linkstatus:{key:"linkstatus",label:"链路状态",kind:"discrete",readingField:"LinkStatus",sensor:{SensorType:8,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:0,periodKey:"presence",eventKeyIds:["Port.PortDisconnected"]},explain:"端口链路 Up/Down。Down（=0）时告警。"},om_temperature:{key:"om_temperature",label:"光模块温度",kind:"threshold",unitLabel:"°C",readingField:"TemperatureCelsius",sensor:{SensorType:1,ReadingType:1,BaseUnit:1,Unit:128,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:2,periodKey:"om_temperature",thresholds:{UpperNoncritical:75},events:[{suffix:"OverMinor",label:"光模块过温·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"Port.PortOpticalModuleOverTemp"}],eventKeyIds:["Port.PortOpticalModuleOverTemp","PcieCard.PCIeCardOMOverTemp"]},explain:"光模块温度，扫描周期较长（10s，连续 12 次失败判异常）。"},current:{key:"current",label:"电流",kind:"threshold",unitLabel:"A",readingField:"Current",sensor:{SensorType:3,ReadingType:1,BaseUnit:5,Unit:128,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:0,periodKey:"voltage",thresholds:{UpperNoncritical:0,UpperCritical:0},events:[{suffix:"OverMinor",label:"过流·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"PSU.PSUOutputOverCurrentMinor"},{suffix:"OverMajor",label:"过流·严重",levelField:"UpperCritical",operatorId:4,severity:"Major",eventKeyId:"PSU.PSUOutputOverCurrent"}],eventKeyIds:["PSU.PSUOutputOverCurrent"]},explain:"器件电流（A）。多用于电源输出过流监控，越大越危险。"},power:{key:"power",label:"功率",kind:"threshold",unitLabel:"W",readingField:"Power",sensor:{SensorType:11,ReadingType:1,BaseUnit:6,Unit:128,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:0,periodKey:"voltage",thresholds:{UpperNoncritical:0,UpperCritical:0},events:[{suffix:"OverMinor",label:"过功率·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"PSU.PSUOutputOverPowerMinor"},{suffix:"OverMajor",label:"过功率·严重",levelField:"UpperCritical",operatorId:4,severity:"Major",eventKeyId:"PSU.PSUOutputOverPower"}],eventKeyIds:["PSU.PSUOutputOverPower"]},explain:"器件功率（W）。多用于电源输入/输出功率监控，越大越危险。"},sr_state:{key:"sr_state",label:"离散状态",kind:"discrete",readingField:"Reading",sensor:{SensorType:15,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:1,periodKey:"presence",eventKeyIds:[]},explain:"来自 .sr 的离散状态传感器；读数命中触发值即告警。"}},hd={BCU:[{key:"VCC_12V0_1",label:"VCC_12V0_1",nominal:12},{key:"VCC_12V0_2",label:"VCC_12V0_2",nominal:12},{key:"VCC_12V0_3",label:"VCC_12V0_3",nominal:12},{key:"P3V3",label:"3V3",nominal:3.3},{key:"STBY_3V3",label:"STBY_3V3",nominal:3.3},{key:"VCORE",label:"VCORE",nominal:.85},{key:"VDDQ",label:"1V1_VDDQ",nominal:1.1}],EXU:[{key:"VCC_12V0_1",label:"VCC_12V0_1",nominal:12},{key:"VCC_12V0_2",label:"VCC_12V0_2",nominal:12},{key:"STBY_3V3",label:"STBY_3V3",nominal:3.3},{key:"STBY_5V0",label:"STBY_5V0",nominal:5}],DEFAULT:[{key:"P12V",label:"12V",nominal:12},{key:"P5V",label:"5V",nominal:5},{key:"P3V3",label:"3V3",nominal:3.3}]};function nI(e){return hd[e||"DEFAULT"]||hd.DEFAULT}function tI(e){const n=t=>Math.round(t*1e3)/1e3;return{UpperCritical:n(e*1.1),UpperNoncritical:n(e*1.05),LowerNoncritical:n(e*.95),LowerCritical:n(e*.9)}}const rI=[{match:/^CPU_/,typeLabel:"CPU",entity:{name:"CPU",entityId:3},quantities:["temperature","caterr","prochot","thermaltrip"],componentPrefix:"Component_ComCpu"},{match:/^NetworkAdapter_/,typeLabel:"网卡",entity:{name:"PCIeCard",entityId:11},quantities:["temperature","bandwidth","linkstatus"],componentPrefix:"Component_PCIeCard"},{match:/^OpticalModule_/,typeLabel:"光模块",entity:{name:"PCIeCard",entityId:11},quantities:["om_temperature"],componentPrefix:"Component_PCIeCard"},{match:/^Fan_/,typeLabel:"风扇",entity:{name:"Fan",entityId:29},quantities:["fanspeed"],componentPrefix:"Component_Fan"},{match:/^Voltage_/,typeLabel:"电压域",entity:{name:"PowerUnit",entityId:10},quantities:["voltage"],componentPrefix:"Component_Power"},{match:/^Disk_/,typeLabel:"硬盘",entity:{name:"Drive",entityId:4},quantities:["disk_presence","temperature"],componentPrefix:"Component_Disk"},{match:/^Memory_/,typeLabel:"内存",entity:{name:"Memory",entityId:32},quantities:["temperature","presence"],componentPrefix:"Component_Memory"}];function oI(e){return rI.find(n=>n.match.test(e))}function sI(e){return/^Voltage_/.test(e)}const vd={BCU:[{key:"CPU_1",typeLabel:"CPU",quantities:["temperature","caterr","prochot","thermaltrip"]},{key:"CPU_2",typeLabel:"CPU",quantities:["temperature","caterr","prochot","thermaltrip"]},{key:"Voltage_Domain",typeLabel:"电压域",quantities:["voltage"]}],CLU:[{key:"Fan_1",typeLabel:"风扇",quantities:["fanspeed"]},{key:"Fan_2",typeLabel:"风扇",quantities:["fanspeed"]},{key:"Temp_Inlet",typeLabel:"进风温度",quantities:["temperature"]}],EXU:[{key:"Voltage_Domain",typeLabel:"电压域",quantities:["voltage"]},{key:"Temp_Board",typeLabel:"单板温度",quantities:["temperature"]}],IEU:[{key:"Temp_Riser",typeLabel:"Riser 温度",quantities:["temperature"]}],SEU:[{key:"Disk_1",typeLabel:"硬盘",quantities:["disk_presence","temperature"]},{key:"Temp_Backplane",typeLabel:"背板温度",quantities:["temperature"]}],NICCard:[{key:"NetworkAdapter_1",typeLabel:"网卡",quantities:["temperature","bandwidth","linkstatus"]},{key:"OpticalModule_0",typeLabel:"光模块",quantities:["om_temperature"]}],Unknown:[{key:"Temp_Board",typeLabel:"单板温度",quantities:["temperature"]},{key:"Voltage_Domain",typeLabel:"电压域",quantities:["voltage"]}]};function iI(e){return vd[e||"Unknown"]||vd.Unknown}const aI={UpperNoncritical:"预警(上)",UpperCritical:"严重(上)",UpperNonrecoverable:"不可恢复(上)",LowerNoncritical:"预警(下)",LowerCritical:"严重(下)"},Ba=(e,n)=>`#/${e}.${n}`,Bn=(e,n)=>`<=/${e}.${n}`;function Gs(e){return e.replace(/[^A-Za-z0-9]+/g," ").split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join("")}function lI(e,n,t){const r=t?Gs(t):"";return`${Gs(e)}${r}${Gs(n.label||n.key)}`}function g0(e,n,t){return`${e}|${n}|${t||""}`}function uI(e,n){var fe,le;const t=e.Objects||{},r=un[n.quantityKey],o=oI(n.deviceKey),s=[],i=[],a=[],l={};if(!r)return{objects:{},sensor:null,createdKeys:[],reusedKeys:[],warnings:[`未知监控量：${n.quantityKey}`]};const c=lI(n.deviceKey,r,n.railKey),d=n.railLabel||n.railKey;let f,h;if(n.readingOverride)f=n.readingOverride,h={kind:"device-field",label:n.readingOverride};else if(n.dataSource.mode==="scanner"){const Z=n.dataSource.scanner;if(!Z||!Z.chip)a.push(`「${d||r.label}」数据源未接：请选择硬件信号（Chip/Offset）或改用器件读数字段。`),f=Bn(n.deviceKey,n.dataSource.field||r.readingField),h={kind:"device-field",label:"（未接，暂用器件字段兜底）"};else{const ne=`Scanner_${c}`;l[ne]={Chip:Z.chip.startsWith("#/")?Z.chip:`#/${Z.chip}`,Offset:Z.offset,Size:Z.size,Mask:Z.mask,Type:0,Period:Z.periodMs,Debounce:"None",Value:0},s.push(ne),f=Bn(ne,"Value"),h={kind:"scanner",label:`周期读 ${Z.chip} @${Z.periodMs}ms`,scannerKey:ne}}}else{const Z=n.dataSource.field||r.readingField;f=Bn(n.deviceKey,Z),h={kind:"device-field",label:`${n.deviceKey}.${Z}`}}const p=Gs(n.deviceKey),E=o?o.entity.name:p,b=o?o.entity.entityId:0,T=`Entity_${p}`;t[T]?i.push(T):(l[T]={Id:b,Name:E,Instance:1,PowerState:1,Presence:1},s.push(T));const V=`Component_${p}`;t[V]?i.push(V):(l[V]={FruId:255,Instance:Bn(n.deviceKey,"SlotID"),Name:Bn(n.deviceKey,"DeviceName"),Location:Bn(n.deviceKey,"Position"),Health:0,Presence:1,PowerState:1},s.push(V));const z=r.kind==="threshold"?`ThresholdSensor_${c}`:`DiscreteSensor_${c}`,x=`${n.boardName} ${d||(o==null?void 0:o.typeLabel)||""} ${r.label}`.replace(/\s+/g," ").trim();r.kind==="threshold"?l[z]={...r.sensor,SensorName:x,Reading:f,ReadingStatus:Bn(n.deviceKey,`${r.readingField}Status`),EntityId:Bn(T,"Id"),EntityInstance:Bn(T,"Instance"),...n.thresholds||{},...n.hysteresis!=null?{PositiveHysteresis:n.hysteresis,NegativeHysteresis:n.hysteresis}:{}}:l[z]={...r.sensor,SensorName:x,Reading:f,EntityId:Bn(T,"Id"),EntityInstance:Bn(T,"Instance")},s.push(z);const N=n.eventList&&n.eventList.length?n.eventList:r.kind==="threshold"?(n.events&&n.events.length?n.events:r.recommend.events||[]).map(Z=>({suffix:Z.suffix,eventKeyId:Z.eventKeyId,operatorId:Z.operatorId,label:Z.label,severity:Z.severity,levelField:Z.levelField})):[{suffix:"",eventKeyId:n.eventKeyId||r.recommend.eventKeyIds[0]||"",operatorId:n.operatorId,label:"状态命中",condition:n.condition??1}],re=[],ie=new Set;for(const Z of N){let ne,M;if(Z.levelField){const X=(fe=n.thresholds)==null?void 0:fe[Z.levelField];if(X==null)continue;ne=Bn(z,Z.levelField),M=`${aI[Z.levelField]} = ${X}`}else ne=Z.condition??1,M=`命中值 = ${Z.condition??1}`;let q=Z.suffix||"";for(;ie.has(q);)q=`${q}_x`;ie.add(q);const v=`Event_${c}${q}`;l[v]={EventKeyId:Z.eventKeyId,Reading:f,Condition:ne,OperatorId:Z.operatorId,Component:`#/${V}`,Enabled:n.enabled,...Z.levelField&&n.hysteresis!=null?{Hysteresis:n.hysteresis}:{},DescArg2:Ba(V,"Name"),DescArg3:d||(o==null?void 0:o.typeLabel)||n.deviceKey,DescArg4:Ba(v,"Reading"),DescArg5:Ba(v,"Condition")},s.push(v),re.push({key:v,eventKeyId:Z.eventKeyId,label:Z.label,operator:((le=eI(Z.operatorId))==null?void 0:le.symbol)||"",severity:Z.severity,conditionLabel:M})}re.length||a.push(r.kind==="threshold"?"未设置任何门限档位，未产出告警事件——请至少填一档门限。":"未配置任何事件——请至少添加一条事件。");const ae={configId:g0(n.deviceKey,n.quantityKey,n.railKey),sensorKey:z,sensorName:x,kind:r.kind,entityKey:T,entityName:E,entityId:b,componentKey:V,dataSource:h,events:re};return{objects:l,sensor:ae,createdKeys:s,reusedKeys:i,warnings:a}}const La=Gn({});function yr(e){return La[e]||(La[e]={cfgs:[],looseEvents:[],uidN:0,evSeq:0,loaded:!1}),La[e]}function cI(e){return`e${++yr(e).uidN}`}function Ua(e){return++yr(e).evSeq}function dI(e){let n="",t=!1,r=!1;for(let o=0;o<e.length;o++){const s=e[o];if(t){n+=s,r?r=!1:s==="\\"?r=!0:s==='"'&&(t=!1);continue}if(s==='"'){t=!0,n+=s;continue}if(s==="/"&&e[o+1]==="/"){for(;o<e.length&&e[o]!==`
`;)o++;n+=`
`;continue}if(s==="/"&&e[o+1]==="*"){for(o+=2;o<e.length&&!(e[o]==="*"&&e[o+1]==="/");)o++;o++;continue}n+=s}return n}function md(e){const n=JSON.parse(dI(e)),t=n.Unit??{},r=n.ManagementTopology??{},o=r.Anchor??{},s={};for(const[i,a]of Object.entries(r)){if(i==="Anchor"||typeof a!="object"||a===null)continue;const l=a;s[i]={chips:Array.isArray(l.Chips)?l.Chips:[],connectors:Array.isArray(l.Connectors)?l.Connectors:[]}}return{formatVersion:String(n.FormatVersion??""),unit:{type:String(t.Type??""),name:String(t.Name??"")},topology:{anchorBuses:Array.isArray(o.Buses)?o.Buses:[],buses:s},objects:n.Objects??{}}}function Zt(e){const n=e.indexOf("_");return n<0?e:e.slice(0,n)}function fI(e,n){const t={};for(const[r,o]of Object.entries(e))t[r]={...o};for(const[r,o]of Object.entries(n))t[r]={...t[r]||{},...o};return t}const pI={Smc:"SMC 管理芯片",Lm75:"LM75 温度芯片",Eeprom:"EEPROM 信息器件",Pca9545:"PCA9545 I2C 扩展",Cpld:"CPLD 逻辑器件",Chip:"板载器件"};function Ci(e){return pI[e]||`${e} 器件`}function hI(e){const n=[],t=new Set;for(const[r,o]of Object.entries(e.topology.buses))for(const s of o.chips){if(t.has(s))continue;t.add(s);const i=Zt(s);n.push({name:s,type:i,typeLabel:Ci(i),bus:r})}return n}function vI(e){const n={};for(const[t,r]of Object.entries(e)){const o=Zt(t);if(o!=="ThresholdSensor"&&o!=="DiscreteSensor")continue;const s=r.Reading;if(typeof s!="string")continue;const i=s.match(/<=\/(Scanner_[A-Za-z0-9_]+)\.Value/);if(!i)continue;const a=e[i[1]],l=a?Xt(a.Chip):null;l&&(n[t]=l.target)}return n}function Xt(e){if(typeof e!="string")return null;const n=e.match(/^(?:<=|#|>=|=)?\/([A-Za-z0-9_]+)(?:\.([A-Za-z0-9_]+))?$/);return n?{target:n[1],field:n[2]}:null}const mI=["UpperNonrecoverable","UpperCritical","UpperNoncritical","LowerNoncritical","LowerCritical","LowerNonrecoverable"];function ea(e){const n=new Map;for(const[t,r]of Object.entries(e)){const o=Zt(t);if(o!=="ThresholdSensor"&&o!=="DiscreteSensor")continue;const s={};if(o==="ThresholdSensor")for(const a of mI){const l=r[a];typeof l=="number"&&(s[a]=l)}const i=Xt(r.SensorName);n.set(t,{name:t,kind:o==="ThresholdSensor"?"threshold":"discrete",sensorName:typeof r.SensorName=="string"&&!i?r.SensorName:void 0,thresholds:s,events:[]})}for(const[t,r]of Object.entries(e)){if(Zt(t)!=="Event")continue;const o=r.Condition,s=Xt(o),i=typeof r.EventKeyId=="string"?r.EventKeyId:"";if(s&&n.has(s.target))n.get(s.target).events.push({name:t,eventKeyId:i,level:s.field});else if(s&&!n.has(s.target))n.has(s.target)||n.set(s.target,{name:s.target,kind:"discrete",thresholds:{},events:[]}),n.get(s.target).events.push({name:t,eventKeyId:i,level:s.field});else if(typeof o=="number"){const a=[...n.keys()].find(l=>t.includes(l.replace(/^[A-Za-z]+_/,"")));a&&n.get(a).events.push({name:t,eventKeyId:i,condition:o})}}return[...n.values()]}const _I=`{
  "FormatVersion": "3.00",
  "DataVersion": "3.00",
  "Unit": {
    "Type": "EXU",
    "Name": "ExpBoard_1" // 123
  },
  "ManagementTopology": {
    "Anchor": {
      "Buses": [
        "I2c_1",
        "I2c_2",
        "I2c_3",
        "I2c_4",
        "I2c_5",
        "I2c_6",
        "I2c_7",
        "I2c_8",
        "I2c_9",
        "I2c_11",
        "Jtag_1",
        "JtagOverLocalBus_1",
        "Hisport_0",
        "Hisport_1",
        "Hisport_2",
        "Hisport_3",
        "Hisport_4",
        "Hisport_5",
        "Hisport_6",
        "Hisport_7",
        "Hisport_8",
        "Hisport_9",
        "Hisport_10",
        "Hisport_11",
        "Hisport_12",
        "Hisport_13",
        "Hisport_14",
        "Hisport_15",
        "Hisport_16",
        "Hisport_17",
        "Hisport_18",
        "Hisport_19",
        "Hisport_20",
        "Hisport_21"
      ]
    },
    "I2c_1": {
      "Chips": [
        "Smc_CpuBrdSMC"
      ],
      "Connectors": [
        "Connector_BCU_1"
      ]
    },
    "I2c_5": {
      "Connectors": [
        "Connector_SEU_1",
        "Connector_SEU_2"
      ]
    },
    "I2c_4": {
      "Chips": [
        "Smc_FanBoardSMC"
      ],
      "Connectors": [
        "Connector_CLU_1"
      ]
    },
    "I2c_8": {
      "Chips": [
        "Lm75_InletTemp",
        "Chip_UsbCc_On",
        "Chip_UsbCc_Sgm"
      ],
      "Connectors": [
        "Connector_PSR_1"
      ]
    },
    "I2c_7": {
      "Chips": [
        "Pca9545_i2c7_chip"
      ]
    },
    "I2c_2": {
      "Chips": [
        "Smc_ExpBoardSMC",
        "Eeprom_EXU"
      ],
      "Connectors": [
        "Connector_PowerSupply_1",
        "Connector_PowerSupply_2"
      ]
    },
    "I2c_9": {
      "Chips": [
        "Eeprom_Psu1",
        "Eeprom_Psu2",
        "Chip_Psu1",
        "Chip_Psu2"
      ]
    },
    "I2c_3": {},
    "Jtag_1": {
      "Chips": [
        "Cpld_1"
      ]
    },
    "I2c_11": {
      "Chips": [
        "Lm75_OutletTemp"
      ]
    },
    "Pca9545_i2c7_chip": {
      "Buses": [
        "I2cMux_Pca9545_i2c7_chip_1",
        "I2cMux_Pca9545_i2c7_chip_2"
      ]
    },
    "I2cMux_Pca9545_i2c7_chip_1": {
      "Connectors": [
        "Connector_LOM_1",
        "Connector_OCP_1"
      ]
    },
    "I2cMux_Pca9545_i2c7_chip_2": {
      "Connectors": [
        "Connector_LOM_2",
        "Connector_OCP_2"
      ]
    }
  },
  "Objects": {
    "ExpBoard_1": {
      "Slot": 1,
      "UID": "00000001010302023922",
      "Name": "BC83SMMB",
      "Manufacturer": "<=/FruData_Expander.BoardManufacturer",
      "Type": "EXU",
      "Description": "Expander Board",
      "PartNumber": "0302023922",
      "LogicVersion": "",
      "LogicUnit": 5,
      "PcbID": "#/Accessor_PcbID.Value",
      "PcbVersion": "",
      "LogicVersionID": "#/Accessor_LogicVersionID.Value",
      "SRVersion": "\${DataVersion}",
      "MCUVersion": "",
      "BoardID": 65535,
      "BoardType": "ExpBoard",
      "Number": 1,
      "DeviceName": "ExpBoard\${Slot}",
      "Position": "EXU\${Slot}",
      "NodeId": "EXU\${Slot}ExpBoard\${Slot}",
      "RunningStatus": 0,
      "RefSMCChip": "#/Smc_ExpBoardSMC",
      "FruID": "<=/Fru_Expander.FruId",
      "CpldTestReg": "#/Accessor_CpldTest.Value",
      "CpldStatus": 0
    },
    "Smc_CpuBrdSMC": {
      "Address": 96,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0
    },
    "Accessor_PcbID": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 1792,
      "Size": 2,
      "Mask": 15,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LogicVersionID": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 2816,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Time_Bmc": {
      "Id": 1,
      "CpuBrdRtc": "#/Smc_ExpBoardSMC",
      "RtcSupported": true,
      "Offset": 201327872,
      "Size": 8,
      "YearOffset": 0,
      "EffOffset": 0
    },
    "Connector_BCU_1": {
      "Bom": "14100513",
      "Slot": 1,
      "Position": 1,
      "Presence": 1,
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_1",
        "I2c_2",
        "I2c_8",
        "JtagOverLocalBus_1",
        "Hisport_0",
        "Hisport_5",
        "Hisport_6",
        "Hisport_7"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "BCU",
      "IdentifyMode": 3,
      "Type": "CPUBoard"
    },
    "Connector_SEU_1": {
      "Bom": "14100665",
      "Slot": 1,
      "Position": 2,
      "Presence": "<=/Scanner_FanCableMntr.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2c_6"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "SEU",
      "IdentifyMode": 3,
      "Container": "Component_ComExpander",
      "Type": "DiskBackplane"
    },
    "Connector_SEU_2": {
      "Bom": "14100665",
      "Slot": 5,
      "Position": 10,
      "Presence": 0,
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2c_5",
        "JtagOverLocalBus_1"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "SEU",
      "IdentifyMode": 3,
      "Container": "Component_ComExpander",
      "Type": "DiskBackplane"
    },
    "Connector_CLU_1": {
      "Bom": "14100363",
      "Slot": 1,
      "Position": 3,
      "Presence": "<=/Scanner_HddBPPresent.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2c_4",
        "JtagOverLocalBus_1"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "CLU",
      "IdentifyMode": 3,
      "Type": "FanBoard"
    },
    "Connector_PSR_1": {
      "Bom": "14100513",
      "Slot": 4,
      "Position": 4,
      "Presence": 0,
      "Id": "",
      "AuxId": "920",
      "Buses": [
        "I2c_8",
        "I2c_2"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "PSR",
      "IdentifyMode": 3
    },
    "Pca9545_i2c7_chip": {
      "OffsetWidth": 0,
      "AddrWidth": 1,
      "Address": 224,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Scanner_SerdesLom1Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134234368,
      "Size": 2,
      "Mask": 1,
      "Type": 0,
      "Period": 8000,
      "Value": 0
    },
    "Connector_LOM_1": {
      "Bom": "14220246",
      "Slot": 1,
      "Position": 9,
      "Presence": "<=/Scanner_SerdesLom1Pres.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2cMux_Pca9545_i2c7_chip_1"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "J6008",
      "IdentifyMode": 3
    },
    "Scanner_SerdesLom2Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134234368,
      "Size": 2,
      "Mask": 256,
      "Type": 0,
      "Period": 8000,
      "Value": 0
    },
    "Connector_LOM_2": {
      "Bom": "14220246",
      "Slot": 2,
      "Position": 6,
      "Presence": "<=/Scanner_SerdesLom2Pres.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2cMux_Pca9545_i2c7_chip_2"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "J6014",
      "IdentifyMode": 3
    },
    "Connector_OCP_1": {
      "Bom": "14220247",
      "Slot": 7,
      "Position": 7,
      "Presence": "<=/Scanner_SerdesLom2Pres.Value",
      "Id": "15b31015",
      "AuxId": "19e5d13b",
      "Buses": [
        "I2cMux_Pca9545_i2c7_chip_1"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "J6008",
      "IdentifyMode": 2
    },
    "Connector_OCP_2": {
      "Bom": "14220247",
      "Slot": 8,
      "Position": 8,
      "Presence": 1,
      "Id": "15b31015",
      "AuxId": "19e5d13b",
      "Buses": [
        "I2cMux_Pca9545_i2c7_chip_2"
      ],
      "SystemId": "\${SystemId}",
      "ManagerId": "\${ManagerId}",
      "ChassisId": "\${ChassisId}",
      "SilkText": "J6014",
      "IdentifyMode": 2
    },
    "Connector_PowerSupply_1": {
      "Bom": "14191046",
      "Slot": 1,
      "Position": 58,
      "Presence": "<=/Scanner_PS1Pres.Value",
      "Id": "PSU",
      "AuxId": "00000001010302023922",
      "Buses": [
        "I2c_2",
        "I2c_3"
      ],
      "SystemId": 1,
      "SilkText": "psu1",
      "IdentifyMode": 2,
      "Type": "Psu"
    },
    "Connector_PowerSupply_2": {
      "Bom": "14191046",
      "Slot": 2,
      "Position": 59,
      "Presence": "<=/Scanner_PS2Pres.Value",
      "Id": "PSU",
      "AuxId": "00000001010302023922",
      "Buses": [
        "I2c_2"
      ],
      "SystemId": 1,
      "SilkText": "psu2",
      "IdentifyMode": 2,
      "Type": "Psu"
    },
    "PsuSlot_1": {
      "SlotNumber": 1,
      "Presence": "<=/Scanner_PS1Pres.Value",
      "SlotI2cAddr": 176,
      "PsuChip": "#/Chip_Psu1"
    },
    "PsuSlot_2": {
      "SlotNumber": 2,
      "Presence": "<=/Scanner_PS2Pres.Value",
      "SlotI2cAddr": 180,
      "PsuChip": "#/Chip_Psu2"
    },
    "Eeprom_Psu1": {
      "Address": 160,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30,
      "RwBlockSize": 1024
    },
    "Eeprom_Psu2": {
      "Address": 164,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30,
      "RwBlockSize": 1024
    },
    "Chip_Psu1": {
      "Address": 176,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30
    },
    "Chip_Psu2": {
      "Address": 180,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30
    },


    "Scanner_PS1Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 603985152,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0,
      "Period": 2000
    },
    "Scanner_PS2Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 603985152,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Value": 0,
      "Period": 2000
    },
    "Smc_ExpBoardSMC": {
      "Address": 96,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0
    },
    "Accessor_UIDLedAccessor": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134227456,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Led_UIDLed": {
      "Id": 4,
      "SystemId": 1,
      "Name": "UIDLed",
      "CtrlValue": "#/Accessor_UIDLedAccessor.Value",
      "Capability": 1,
      "Mode": 0,
      "ColorCapabilities": 2,
      "DefaultOSColor": 1,
      "DefaultLCSColor": 1,
      "LCSColor": 1,
      "LCSState": 0,
      "OSColor": 1,
      "OSState": 0,
      "LampTestColor": 1,
      "LampTestDuration": 0
    },
    "Accessor_SysHealthLedAccessor": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134226432,
      "Size": 2,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LedColorAccessor": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134226432,
      "Size": 2,
      "Mask": 65280,
      "Type": 0,
      "Value": 0
    },
    "Led_SysHealth": {
      "SystemId": 1,
      "Name": "SysHealLed",
      "CtrlValue": "#/Accessor_SysHealthLedAccessor.Value",
      "Capability": "#/Accessor_LedColorAccessor.Value",
      "Id": 2,
      "Mode": 0,
      "ColorCapabilities": 12,
      "DefaultOSColor": 3,
      "DefaultLCSColor": 3,
      "LCSColor": 3,
      "LCSState": 255,
      "OSColor": 3,
      "OSState": 0,
      "LampTestColor": 3,
      "LampTestDuration": 0
    },
    "Accessor_AC": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 603983360,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_JtagSwitch": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469776896,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LogicVerId": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 2816,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Cpld_1": {
      "HealthStatus": 0
    },
    "LogicFirmware_EXU_1": {
      "UId": "00000001010302023922",
      "Name": "EXU_CPLD",
      "Manufacturer": "Huawei",
      "Version": "#/Accessor_LogicVerId.Value",
      "Location": 5,
      "UpgradeChip": "#/Cpld_1",
      "ChipInfo": "#/Cpld_1",
      "Routes": "#/Accessor_JtagSwitch.Value",
      "DefaultRoute": 0,
      "FirmwareRoute": 0,
      "ValidMode": 1,
      "ValidAction": "#/Accessor_AC.Value",
      "SoftwareId": "CPLD-BC83SMMB"
    },
    "Eeprom_EXU": {
      "OffsetWidth": 2,
      "AddrWidth": 1,
      "Address": 174,
      "WriteTmout": 100,
      "ReadTmout": 100,
      "RwBlockSize": 32,
      "WriteInterval": 20,
      "HealthStatus": 0
    },
    "Accessor_EXUWP": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 11776,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "SRUpgrade_1": {
      "UID": "00000001010302023922",
      "Type": "EXU",
      "Version": "\${DataVersion}",
      "StorageChip": "#/Eeprom_EXU",
      "SoftwareId": "HWSR-BC83SMMB",
      "WriteProtect": "#/Accessor_EXUWP.Value"
    },
    "Fru_Expander": {
      "PcbId": 1,
      "FruId": 1,
      "FruName": "ExpBoard\${Slot}",
      "ConnectorGroupId": "\${GroupId}",
      "BoardId": 65535,
      "UniqueId": "00000001010302023922"
    },
    "Lm75_InletTemp": {
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "Address": 144,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Lm75_OutletTemp": {
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "Address": 144,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "DftLm75_2": {
      "Id": 1,
      "Type": 1,
      "DeviceNum": 1,
      "ItemName": "LM75 For Inlet Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "RefChip": "#/Lm75_OutletTemp"
    },
    "Scanner_Lm75_Inlet": {
      "Chip": "#/Lm75_InletTemp",
      "Type": 0,
      "Size": 1,
      "Offset": 0,
      "Mask": 255,
      "Period": 1000,
      "Debounce": "#/MidAvg_Inlet",
      "Value": 0
    },
    "ThresholdSensor_InletTemp": {
      "AssertMask": 29312,
      "DeassertMask": 29312,
      "ReadingMask": 6168,
      "Linearization": 0,
      "M": 100,
      "RBExp": 224,
      "UpperCritical": 48,
      "UpperNoncritical": 46,
      "PositiveHysteresis": 2,
      "NegativeHysteresis": 2
    },
    "CoolingRequirement_1_6": {
      "RequirementId": 6,
      "TemperatureType": 11,
      "MonitoringStatus": "<=/Scanner_Lm75_Inlet.Status",
      "MonitoringValue": "<=/Scanner_Lm75_Inlet.Value",
      "FailedValue": 80,
      "BackupRequirementIdx": 8,
      "SensorName": "#/ThresholdSensor_InletTemp.SensorName"
    },
    "Event_InletTempUpperMinor": {
      "EventKeyId": "Chassis.ChassisInletOverTempMinor",
      "Condition": "<=/ThresholdSensor_InletTemp.UpperNoncritical",
      "Hysteresis": 2,
      "LedFaultCode": "A00"
    },
    "Event_InletTempUpperMajor": {
      "EventKeyId": "Chassis.ChassisInletOverTempMajor",
      "Condition": "<=/ThresholdSensor_InletTemp.UpperCritical",
      "Hysteresis": 2,
      "LedFaultCode": "A00"
    },
    "Event_InletTempFail": {
      "EventKeyId": "Chassis.ChassisAccessInletTempFailure",
      "Condition": 1,
      "LedFaultCode": "A00"
    },
    "Event_OutletTempUpperMinor": {
      "EventKeyId": "Chassis.ChassisOutletOverTempMinor",
      "Condition": "<=/ThresholdSensor_OutletTemp.UpperNoncritical",
      "Hysteresis": 2
    },
    "DiscreteSensor_SysFwProgress": {
      "OwnerId": 64,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 99,
      "Capabilities": 192,
      "SensorType": 15,
      "ReadingType": 111,
      "SensorName": "SysFwProgress",
      "AssertMask": 7,
      "DeassertMask": 7,
      "DiscreteMask": 7,
      "Unit": 192,
      "BaseUnit": 0,
      "ModifierUnit": 0,
      "DiscreteType": 0,
      "RecordSharing": 1,
      "Reading": 0
    },
    "Scanner_PowerGood": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469765888,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Period": 100,
      "Debounce": "None",
      "Status": 0,
      "Value": 0
    },
    "Scanner_RightEar": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134219520,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Period": 8000,
      "Debounce": "None",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "@Default": {
        "ScanEnabled": 0
      },
      "Status": 0,
      "Value": 0
    },
    "Scanner_LeftEar": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134219520,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Period": 8000,
      "Debounce": "None",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "@Default": {
        "ScanEnabled": 0
      },
      "Status": 0,
      "Value": 0
    },
    "Event_RightEarMntr": {
      "EventKeyId": "Chassis.ChassisRightMountingEarNotPresent",
      "Condition": 0
    },
    "Event_LeftEarMntr": {
      "EventKeyId": "Chassis.ChassisLeftMountingEarNotPresent",
      "Condition": 0
    },
    "Accessor_USBGreenLed": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 134230528,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_USBRedLed": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 134230528,
      "Mask": 65280,
      "Type": 0,
      "Value": 0
    },
    "Scanner_HddBPPresent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134237440,
      "Size": 2,
      "Mask": 1,
      "Type": 0,
      "Period": 8000,
      "Debounce": "#/ContBin_HddBPPresent",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "@Default": {
        "ScanEnabled": 0
      },
      "Status": 0,
      "Value": 0
    },
    "Event_HDDBpPresenceMntr": {
      "EventKeyId": "Chassis.ChassisFrontDiskBackplaneNotPresent",
      "Condition": 0
    },
    "Accessor_PowerGd": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 469765888,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Dft5V0Vlot_1": {
      "Type": 1,
      "Id": 19,
      "DeviceNum": 1,
      "ItemName": "VCC 5V Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "VoltValue": "#/Accessor_Adc5VccVlot.Value",
      "PowOnStandValue": 2731,
      "PowOffStandValue": 0,
      "HystValue": 109,
      "DevPowerStatus": "#/Accessor_PowerGd.Value"
    },
    "Accessor_Adc5VccVlot": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 4873,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "Dft5V0Vlot_2": {
      "Type": 1,
      "Id": 19,
      "DeviceNum": 2,
      "ItemName": "VCC 5V Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "VoltValue": "#/Accessor_Adc6VccVlot.Value",
      "PowOnStandValue": 2731,
      "PowOffStandValue": 0,
      "HystValue": 109,
      "DevPowerStatus": "#/Accessor_PowerGd.Value"
    },
    "Accessor_Adc6VccVlot": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 4874,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "Accessor_NCSI": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 469774592,
      "Mask": 16,
      "Type": 0,
      "Value": 0
    },
    "NCSICapabilities_1": {
      "PCIeNCSIEnabled": "#/Accessor_NCSI.Value",
      "PCIeNCSISupported": false
    },
    "Dft3V3Vlot_1": {
      "Type": 1,
      "Id": 20,
      "DeviceNum": 1,
      "ItemName": "VCC 3.3V Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "VoltValue": "#/Accessor_Adc4VccVlot.Value",
      "PowOnStandValue": 2700,
      "PowOffStandValue": 0,
      "HystValue": 108,
      "DevPowerStatus": "#/Accessor_PowerGd.Value"
    },
    "Accessor_Adc4VccVlot": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 4872,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "Event_ExpanderAccessFRULableFailure": {
      "EventKeyId": "ExpandBoard.ExpBoardAccessFRULableFailure",
      "Condition": 1
    },
    "Accessor_LeftLedTube": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134220288,
      "Size": 4,
      "Mask": 16711680,
      "Type": 0,
      "Value": 0
    },
    "Accessor_MidLedTube": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134220288,
      "Size": 4,
      "Mask": 65280,
      "Type": 0,
      "Value": 0
    },
    "Accessor_RightLedTube": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134220288,
      "Size": 4,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "LedDispControl_1": {
      "LedTubeSupport": true,
      "LeftLedTube": "#/Accessor_LeftLedTube.Value",
      "MidLedTube": "#/Accessor_MidLedTube.Value",
      "RightLedTube": "#/Accessor_RightLedTube.Value"
    },
    "Accessor_DftEnable": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 3584,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "DftPysicalLed_1": {
      "Id": 129,
      "Type": 4,
      "Slot": "\${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Physical Led Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the leds",
      "ProcessPeriod": 65535,
      "DftEnable": "#/Accessor_DftEnable.Value"
    },
    "DftLedIntelligence_1": {
      "Id": 132,
      "Type": 4,
      "Slot": "\${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Physical Led Intelligence Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the leds",
      "ProcessPeriod": 65535,
      "DftEnable": "#/Accessor_DftEnable.Value"
    },
    "Chip_UsbCc_On": {
      "Address": 66,
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Scanner_CcChipOnAttachStatus": {
      "Chip": "#/Chip_UsbCc_On",
      "Offset": 18,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "Chip_UsbCc_Sgm": {
      "Address": 142,
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Scanner_CcChipSgmAttachStatus": {
      "Chip": "#/Chip_UsbCc_Sgm",
      "Offset": 9,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "DftIOTest_1": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 2,
      "ItemName": "ExpBoard LM75 SMC Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_EXPBLm75ACC.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_EXPBLm75ACC": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4865,
      "Size": 2,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "DftIOTest_2": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 3,
      "ItemName": "SMC For NIC1 LM75 Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_Nic1Lm75.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_Nic1Lm75": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4356,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "DftIOTest_3": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 4,
      "ItemName": "SMC For NIC2 LM75 Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_Nic2Lm75.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_Nic2Lm75": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4358,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "DftIOTest_4": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 5,
      "ItemName": "SMC For PSU LM75 Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_PSULm75.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_PSULm75": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4354,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Scanner_ExpMosTempHigh": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469778688,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Period": 1000,
      "Debounce": "#/ContBin_H3L1",
      "Value": 0
    },
    "Event_ExpMosTempHigh": {
      "EventKeyId": "ExpBoard.ExpBoardStartUpOverTemp",
      "Condition": 1
    },
    "Event_Ps1Install": {
      "EventKeyId": "PSU.PSUInstalled",
      "Condition": 1
    },
    "Event_Ps1Removed": {
      "EventKeyId": "PSU.PSURemoved",
      "Condition": 0
    },
    "Event_Ps2Install": {
      "EventKeyId": "PSU.PSUInstalled",
      "Condition": 1
    },
    "Event_Ps2Removed": {
      "EventKeyId": "PSU.PSURemoved",
      "Condition": 0
    },
    "Scanner_ChassisCoverStatus": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Offset": 201345280,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Period": 5000,
      "Debounce": "None",
      "Value": 0
    },
    "Scanner_ChassisIntrusionACOn": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Offset": 201345280,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Period": 5000,
      "Debounce": "None",
      "Value": 0
    },
    "Scanner_ChassisIntrusionACOff": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Offset": 201345280,
      "Size": 1,
      "Mask": 8,
      "Type": 0,
      "Period": 5000,
      "Debounce": "None",
      "Value": 0
    },
    "Accessor_ChassisIntrusionACOffClear": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Size": 1,
      "Offset": 201345536,
      "Mask": 8,
      "Type": 1,
      "Value": 0
    },
    "Accessor_ChassisIntrusionACOnClear": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Size": 1,
      "Offset": 201345536,
      "Mask": 4,
      "Type": 1,
      "Value": 0
    },
    "Accessor_UIDButtonEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Value": 0
    },
    "Scanner_UIDButtonEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "Accessor_UIDButtonLongEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Value": 0
    },
    "Scanner_UIDButtonLongEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "Chassis_1": {
      "Name": "1",
      "IntrusionACOn": "<=/Scanner_ChassisIntrusionACOn.Value",
      "IntrusionACOff": "<=/Scanner_ChassisIntrusionACOff.Value",
      "CoverStatus": "<=/Scanner_ChassisCoverStatus.Value",
      "IntrusionACOnClear": "#/Accessor_ChassisIntrusionACOnClear.Value",
      "IntrusionACOffClear": "#/Accessor_ChassisIntrusionACOffClear.Value",
      "IntrusionFlag": 0,
      "UidButtonAccessor": "#/Accessor_UIDButtonEvent.Value",
      "UidButtonScanner": "<=/Scanner_UIDButtonEvent.Value",
      "UidButtonPressed": 0,
      "UidButtonLongAccessor": "#/Accessor_UIDButtonLongEvent.Value",
      "UidButtonLongScanner": "<=/Scanner_UIDButtonLongEvent.Value",
      "UidButtonLongPressed": 0
    },
    "Event_14": {
      "EventKeyId": "Chassis.ChassisCoverOpened",
      "Condition": 1
    },
    "Event_OutletTempFail": {
      "EventKeyId": "Chassis.ChassisOutletTempFail",
      "Condition": 1
    },
    "Event_ECU12V1GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU12V2GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU12V3GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU3V1GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU5V1GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU5V2GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Scanner_ECUSys12V1Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4869,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ExpBoardOverVoltage",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys12V1HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 13.2,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys12V2Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4870,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ExpBoardOverVoltage",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys12V2HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 13.2,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys12V3Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4871,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ExpBoardOverVoltage",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys12V3HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 13.2,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys3V1Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4872,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ECUSys3V1HighMntr",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys3V1HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 3.6,
      "Hysteresis": 0.13,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys5V1Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4873,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ECUSys5V1HighMntr",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys5V1HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 5.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys5V2Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4874,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ECUSys5V2HighMntr",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys5V2HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 5.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys12V1LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 10.8,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys12V2LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 10.8,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys12V3LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 10.8,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys3V1LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 3,
      "Hysteresis": 0.13,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys5V1LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 4.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys5V2LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 4.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Scanner_CpuBrdPresenceMntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134237440,
      "Size": 2,
      "Type": 0,
      "Mask": 32,
      "Period": 8000,
      "Debounce": "#/ContBin_CableCPLDIncorrectConnection",
      "Value": 0
    },
    "Event_CpuBrdPresenceMntr": {
      "EventKeyId": "ComCable.CableCPLDIncorrectConnection",
      "Condition": 0
    },
    "Scanner_FanCableMntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134237440,
      "Size": 2,
      "Type": 0,
      "Mask": 8,
      "Period": 8000,
      "Debounce": "#/ContBin_CableCPLDIncorrectConnection",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "Status": 0,
      "Value": 0,
      "@Default": {
        "ScanEnabled": 0
      }
    },
    "Event_FanCableMntr": {
      "EventKeyId": "ComCable.CableFanBackplaneDisconnection",
      "Condition": 0
    },
    "Scanner_Lm75_Outlet": {
      "Chip": "#/Lm75_OutletTemp",
      "Type": 0,
      "Size": 1,
      "Offset": 0,
      "Mask": 255,
      "Period": 1000,
      "Debounce": "#/MidAvg_Outlet",
      "Value": 0
    },
    "CoolingRequirement_1_7": {
      "RequirementId": 7,
      "TemperatureType": 2,
      "MonitoringStatus": "<=/Scanner_Lm75_Outlet.Status",
      "MonitoringValue": "<=/Scanner_Lm75_Outlet.Value",
      "FailedValue": 80,
      "TargetTemperatureCelsius": 45,
      "MaxAllowedTemperatureCelsius": 60,
      "TargetTemperatureRangeCelsius": [
        45,
        60
      ],
      "SmartCoolingTargetTemperature": [
        45,
        42,
        48
      ],
      "CustomSupported": true,
      "CustomTargetTemperatureCelsius": 52,
      "SensorName": "#/ThresholdSensor_OutletTemp.SensorName"
    },
    "Smc_FanBoardSMC": {
      "Address": 96,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0
    },
    "Scanner_FanBoard_Temp": {
      "Chip": "#/Smc_FanBoardSMC",
      "Type": 0,
      "Size": 1,
      "Offset": 4354,
      "Mask": 255,
      "Period": 1000,
      "Debounce": "#/MidAvg_FanBoard_Temp",
      "Value": 0
    },
    "ThresholdSensor_OutletTemp": {
      "AssertMask": 128,
      "DeassertMask": 28800,
      "ReadingMask": 2056,
      "Linearization": 0,
      "M": 100,
      "RBExp": 224,
      "UpperNoncritical": 75,
      "PositiveHysteresis": 2,
      "NegativeHysteresis": 2
    },
    "Accessor_VGADftSwitch": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469775872,
      "Size": 1,
      "Mask": 3,
      "Type": 0,
      "Value": 0
    },
    "DeviceChip_VGADftSwitch": {
      "Slot": 0,
      "DeviceType": 1,
      "Chip": "#/Accessor_VGADftSwitch.Value"
    },
    "Accessor_ShortPushButton": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134224384,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LongPushButton": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134224384,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Value": 0
    },
    "Accessor_PowerBtnLock": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134222336,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Scanner_PowerBtnEvt": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Period": 200,
      "Debounce": "None",
      "Value": 0
    },
    "Accessor_PowerBtnEvt": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0
    },
    "Accessor_PowerBtnShield": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134223361,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0
    },
    "Accessor_PowerOnLock": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469766657,
      "Size": 1,
      "Mask": 8,
      "Type": 0,
      "Value": 0
    },
    "Event_ButtonPowerButtonPressed": {
      "EventKeyId": "Button.ButtonPowerButtonPressed",
      "Condition": 1
    },
    "Event_SystemACPIWorkingState": {
      "EventKeyId": "System.SystemACPIWorkingState",
      "Condition": 1
    },
    "Event_SystemACPISoftOffState": {
      "EventKeyId": "System.SystemACPISoftOffState",
      "Condition": 0
    },
    "DiscreteSensor_AcpiState": {
      "AssertMask": 65,
      "DeassertMask": 0,
      "DiscreteMask": 65
    },
    "DiscreteSensor_PowerButton": {
      "AssertMask": 1,
      "DeassertMask": 0,
      "DiscreteMask": 1
    },
    "Scanner_PwrOkSigDrop": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469766656,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Period": 400,
      "Debounce": "None",
      "Value": 0
    },
    "Scanner_PowerOnTimeout": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469766656,
      "Size": 1,
      "Mask": 8,
      "Type": 0,
      "Period": 400,
      "Debounce": "None",
      "Value": 0
    },
    "DiscreteSensor_PwrOkSigDrop": {
      "AssertMask": 2,
      "DeassertMask": 2,
      "DiscreteMask": 2
    },
    "DiscreteSensor_PwrOnTimeOut": {
      "AssertMask": 2,
      "DeassertMask": 2,
      "DiscreteMask": 2
    },
    "Event_ExpBoardReplaceMntr": {
      "EventKeyId": "ExpBoard.ExpBoardReplace",
      "Condition": 1
    },
    "MidAvg_Inlet": {
      "WindowSize": 4,
      "DefaultValue": 20,
      "IsSigned": true
    },
    "Temperature_1_11": {
      "TemperatureType": 11
    },
    "ContBin_HddBPPresent": {
      "NumH": 4,
      "NumL": 4,
      "DefaultValue": 1
    },
    "DftPowerSupply_1": {
      "Id": 8,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "Power Supply Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftPmu_1": {
      "Id": 9,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "ME Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftCpld_1": {
      "Type": 1,
      "Id": 15,
      "DeviceNum": 1,
      "ItemName": "CpuBrd CPLD Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftFlash_1": {
      "Type": 1,
      "Id": 11,
      "DeviceNum": 0,
      "ItemName": "Flash Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftNCSI_1": {
      "Id": 73,
      "Type": 2,
      "DeviceNum": 0,
      "ItemName": "NCSI Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftChassisCover_1": {
      "Id": 195,
      "Type": 5,
      "Slot": "\${GroupId}",
      "DeviceNum": 1,
      "ItemName": "Chassis Cover Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftJTAG_1": {
      "Type": 2,
      "Id": 69,
      "DeviceNum": 0,
      "ItemName": "JTAG Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftSPI_1": {
      "Id": 70,
      "Type": 2,
      "DeviceNum": 0,
      "ItemName": "SPI Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftLedTube_1": {
      "Id": 130,
      "Type": 4,
      "Slot": "\${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Led Tube Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the Led Tube",
      "ProcessPeriod": 65535
    },
    "DftLedTubeIntelligence_1": {
      "Id": 133,
      "Type": 4,
      "Slot": "\${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Led Tube Intelligence Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the Led Tube",
      "ProcessPeriod": 65535
    },
    "ContBin_H3L1": {
      "NumH": 3,
      "NumL": 1,
      "DefaultValue": 0
    },
    "MidAvg_ExpBoardOverVoltage": {
      "WindowSize": 36,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys3V1HighMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V1HighMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V2HighMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ExpBoardLowerVoltage": {
      "WindowSize": 36,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys3V1LowMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V1LowMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V2LowMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "ContBin_CableCPLDIncorrectConnection": {
      "NumH": 4,
      "NumL": 4,
      "DefaultValue": 1
    },
    "MidAvg_Outlet": {
      "WindowSize": 4,
      "DefaultValue": 20,
      "IsSigned": true
    },
    "MidAvg_FanBoard_Temp": {
      "WindowSize": 4,
      "DefaultValue": 20,
      "IsSigned": true
    },
    "I2cMux_Pca9545_i2c7_chip_1": {
      "ChannelId": 0
    },
    "I2cMux_Pca9545_i2c7_chip_2": {
      "ChannelId": 1
    },
    "Event_UIDButtonMntr": {
      "EventKeyId": "Button.ButtonUIDButtonpressed",
      "Condition": 0
    },
    "Event_UIDButtonLongMntr": {
      "EventKeyId": "Button.ButtonUIDButtonLongPressed",
      "Reading": "<=/Chassis_1.UidButtonLongPressed",
      "Condition": 0,
      "OperatorId": 6,
      "Enabled": true,
      "Component": "#/Component_Button"
    },
    "Accessor_CpldTest": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 8704,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Event_CpldSelfcheck": {
      "EventKeyId": "ExpBoard.ExpBoardCPLDSelfTestFailure",
      "Condition": 1
    }
  }
}`,gI=`{\r
    "FormatVersion": "3.00",\r
    "DataVersion": "3.00",\r
    "Unit": {\r
        "Type": "EXU",\r
        "Name": "ExpBoard_1"\r
    },\r
    "Objects": {\r
        "PGSignal_1": {\r
            "PowerGDState": "<=/Scanner_PowerGood.Value",\r
            "@Default": {\r
                "PowerGDState": 255\r
            }\r
        },\r
        "PowerButton_1": {\r
            "ShortPushButton": "#/Accessor_ShortPushButton.Value",\r
            "LongPushButton": "#/Accessor_LongPushButton.Value"\r
        },\r
        "ACCycle_1": {\r
            "AC": "#/Accessor_AC.Value"\r
        },\r
        "ButtonEvt_1": {\r
            "PowerBtnLock": "#/Accessor_PowerBtnLock.Value",\r
            "GetPowerBtnEvt": "<=/Scanner_PowerBtnEvt.Value",\r
            "SetPowerBtnEvt": "#/Accessor_PowerBtnEvt.Value",\r
            "PowerBtnShield": "#/Accessor_PowerBtnShield.Value"\r
        },\r
        "PowerAction_1": {\r
            "PowerOnTimeoutFlag": "#/Accessor_PowerOnLock.Value"\r
        },\r
        "UsbLocalOMService_1": {\r
            "Supported": true,\r
            "Presence": "<=/Scanner_RightEar.Value",\r
            "Enabled": true,\r
            "RefCcChipOn": "#/Chip_UsbCc_On",\r
            "RefCcChipSgm": "#/Chip_UsbCc_Sgm",\r
            "CcChipOnAttachStatus": "<=/Scanner_CcChipOnAttachStatus.Value",\r
            "CcChipSgmAttachStatus": "<=/Scanner_CcChipSgmAttachStatus.Value",\r
            "GLedStatus": "#/Accessor_USBGreenLed.Value",\r
            "RLedStatus": "#/Accessor_USBRedLed.Value",\r
            "RndisHostIpAddr": "169.254.1.5",\r
            "PortNum": 3\r
        },\r
        "DftUsb_1": {\r
            "Id": 94,\r
            "Type": 2,\r
            "Slot": 0,\r
            "DeviceNum": 0,\r
            "ItemName": "Type C USB Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535\r
        },\r
        "DftEeprom_1": {\r
            "Id": 12,\r
            "Type": 1,\r
            "Slot": "\${GroupId}",\r
            "DeviceNum": 0,\r
            "ItemName": "EXU Eeprom Self Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535,\r
            "FruData": "#/FruData_Expander"\r
        },\r
        "DftEepromWp_1": {\r
            "Id": 47,\r
            "Type": 1,\r
            "Slot": "\${GroupId}",\r
            "DeviceNum": 0,\r
            "ItemName": "EXU Eeprom Write Protect Self Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535,\r
            "FruData": "#/FruData_Expander"\r
        },\r
        "DftPowerButton_1": {\r
            "Id": 163,\r
            "Type": 5,\r
            "Slot": "\${GroupId}",\r
            "DeviceNum": 0,\r
            "ItemName": "Power Button Press Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "Please press Power button",\r
            "ProcessPeriod": 65535\r
        },\r
        "DftLpc_1": {\r
            "Id": 34,\r
            "Type": 1,\r
            "Slot": 0,\r
            "DeviceNum": 0,\r
            "ItemName": "LPC Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535\r
        },\r
        "DftIpmb_1": {\r
            "Id": 35,\r
            "Type": 1,\r
            "DeviceNum": 0,\r
            "ItemName": "Ipmb Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535\r
        },\r
        "DftEth_1": {\r
            "Id": 74,\r
            "Type": 2,\r
            "DeviceNum": 0,\r
            "ItemName": "MGMT Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535,\r
            "RefEth": "eth2"\r
        },\r
        "DftBmcCard_1": {\r
            "Id": 26,\r
            "Type": 1,\r
            "DeviceNum": 0,\r
            "ItemName": "hi1711 Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535\r
        },\r
        "DftDdr3_1": {\r
            "Type": 1,\r
            "Id": 13,\r
            "DeviceNum": 0,\r
            "ItemName": "DDR3 Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535\r
        },\r
        "DftNandFlash_1": {\r
            "Id": 28,\r
            "Type": 1,\r
            "DeviceNum": 0,\r
            "ItemName": "NAND Flash Test",\r
            "PrompteReady": "",\r
            "PrompteFinish": "",\r
            "ProcessPeriod": 65535\r
        },\r
        "FruData_Expander": {\r
            "FruId": 1,\r
            "FruDev": "#/Eeprom_EXU",\r
            "EepromWp": "#/Accessor_EXUWP.Value",\r
            "BoardSerialNumber": "",\r
            "StorageType": "TianChi"\r
        },\r
        "Component_ComSystem": {\r
            "FruId": 255,\r
            "Instance": 0,\r
            "Type": 44,\r
            "Name": "System",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1\r
        },\r
        "Component_Button": {\r
            "FruId": 255,\r
            "Instance": 1,\r
            "Type": 49,\r
            "Name": "button",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1\r
        },\r
        "Component_ComEXU": {\r
            "FruId": 255,\r
            "Instance": 1,\r
            "Type": 193,\r
            "Location": "chassis",\r
            "Name": "EXU\${Slot}",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1,\r
            "Manufacturer": "",\r
            "UniqueId": "N/A",\r
            "BoardId": "<=/ExpBoard_1.BoardID"\r
        },\r
        "Component_ComExpander": {\r
            "FruId": "<=/Fru_Expander.FruId",\r
            "Instance": "\${Slot}",\r
            "Type": 93,\r
            "Location": "<=/ExpBoard_1.Position",\r
            "Name": "<=/ExpBoard_1.DeviceName",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1,\r
            "Manufacturer": "<=/ExpBoard_1.Manufacturer",\r
            "UniqueId": "<=/ExpBoard_1.UID",\r
            "BoardID": "<=/ExpBoard_1.BoardID",\r
            "ReplaceFlag": 0,\r
            "PreviousSN": "",\r
            "SerialNumber": "<=/FruData_Expander.BoardSerialNumber",\r
            "NodeId": "<=/ExpBoard_1.Position;<=/ExpBoard_1.DeviceName |> string.format('%s%s',$1,$2)"\r
        },\r
        "Component_Chassis": {\r
            "FruId": 255,\r
            "Instance": 1,\r
            "Type": 18,\r
            "Name": "Chassis",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1,\r
            "UniqueId": "N/A",\r
            "BoardID": "<=/ExpBoard_1.BoardID",\r
            "NodeId": ""\r
        },\r
        "Component_Cable": {\r
            "FruId": 255,\r
            "Instance": 1,\r
            "Type": 40,\r
            "Name": "cable",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1\r
        },\r
        "Component_PowerSupply1": {\r
            "FruId": 255,\r
            "Instance": 255,\r
            "Type": 3,\r
            "Location": "chassis",\r
            "Name": "PowerSupply1",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1,\r
            "Manufacturer": "",\r
            "UniqueId": "N/A",\r
            "BoardID": "<=/ExpBoard_1.BoardID",\r
            "NodeId": "0"\r
        },\r
        "Component_PowerSupply2": {\r
            "FruId": 255,\r
            "Instance": 255,\r
            "Type": 3,\r
            "Location": "chassis",\r
            "Name": "PowerSupply2",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1,\r
            "Manufacturer": "",\r
            "UniqueId": "N/A",\r
            "BoardID": "<=/ExpBoard_1.BoardID",\r
            "NodeId": "1"\r
        },\r
        "DftVersion_ExuBoardCpldVersion": {\r
            "FruId": "<=/Fru_Expander.FruId",\r
            "VersionType": 2,\r
            "Version": "<=/ExpBoard_1.LogicVersion",\r
            "UnitNum": "<=/ExpBoard_1.LogicUnit",\r
            "NeedUintNum": 1\r
        },\r
        "DftVersion_ExpanderPcbVersion": {\r
            "FruId": "<=/Fru_Expander.FruId",\r
            "VersionType": 0,\r
            "Version": "<=/ExpBoard_1.PcbVersion"\r
        },\r
        "DftVersion_ExpanderCsrVersion": {\r
            "FruId": "<=/Fru_Expander.FruId",\r
            "VersionType": 25,\r
            "Version": "<=/ExpBoard_1.SRVersion"\r
        },\r
        "DftVersion_ExpanderMcuVersion": {\r
            "FruId": "<=/Fru_Expander.FruId",\r
            "VersionType": 27,\r
            "Version": "<=/ExpBoard_1.MCUVersion"\r
        },\r
        "Fru_Expander": {\r
            "PcbVersion": ".A",\r
            "PowerState": 1,\r
            "Health": 0,\r
            "EepStatus": "<=/Eeprom_EXU.HealthStatus",\r
            "Type": 50,\r
            "FruDataId": "#/FruData_Expander"\r
        },\r
        "ThresholdSensor_InletTemp": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_AirInlet.Id",\r
            "EntityInstance": "<=/Entity_AirInlet.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 1,\r
            "ReadingType": 1,\r
            "SensorName": "Inlet Temp",\r
            "SensorIdentifier": "Inlet Temp", \r
            "Unit": 128,\r
            "BaseUnit": 1,\r
            "ModifierUnit": 0,\r
            "Analog": 1,\r
            "NominalReading": 25,\r
            "NormalMaximum": 0,\r
            "NormalMinimum": 0,\r
            "MaximumReading": 127,\r
            "MinimumReading": 128,\r
            "Reading": "<=/Scanner_Lm75_Inlet.Value",\r
            "ReadingStatus": "<=/Scanner_Lm75_Inlet.Status"\r
        },\r
        "ThresholdSensor_OutletTemp": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_MainBoard.Id",\r
            "EntityInstance": "<=/Entity_MainBoard.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 1,\r
            "ReadingType": 1,\r
            "SensorName": "Outlet Temp",\r
            "SensorIdentifier": "Outlet Temp",\r
            "Unit": 128,\r
            "BaseUnit": 1,\r
            "ModifierUnit": 0,\r
            "Analog": 1,\r
            "NominalReading": 25,\r
            "NormalMaximum": 0,\r
            "NormalMinimum": 0,\r
            "MaximumReading": 127,\r
            "MinimumReading": 128,\r
            "Reading": "<=/Scanner_Lm75_Outlet.Value;<=/Scanner_Lm75_Inlet.Value;<=/Scanner_FanBoard_Temp.Value |> expr(((($2 & 32768) == 0 ? $2 : $3) + 5) > ($1 - 13) ? ((($2 & 32768) == 0 ? $2 : $3) + 5) : ($1 - 13))"\r
        },\r
        "DiscreteSensor_AcpiState": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_MainBoard.Id",\r
            "EntityInstance": "<=/Entity_MainBoard.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 64,\r
            "SensorType": 34,\r
            "ReadingType": 111,\r
            "SensorName": "ACPI State",\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "DiscreteType": 1,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteSensor_PowerButton": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_MainBoard.Id",\r
            "EntityInstance": "<=/Entity_MainBoard.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 64,\r
            "SensorType": 20,\r
            "ReadingType": 111,\r
            "SensorName": "Power Button",\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "DiscreteType": 1,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteSensor_PwrOkSigDrop": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_MainBoard.Id",\r
            "EntityInstance": "<=/Entity_MainBoard.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 64,\r
            "SensorType": 8,\r
            "ReadingType": 111,\r
            "SensorName": "PwrOk Sig. Drop",\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "DiscreteType": 0,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteSensor_PwrOnTimeOut": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_MainBoard.Id",\r
            "EntityInstance": "<=/Entity_MainBoard.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 64,\r
            "SensorType": 8,\r
            "ReadingType": 111,\r
            "SensorName": "PwrOn TimeOut",\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "DiscreteType": 0,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteEvent_AcpiState": {\r
            "Property": "<=/Scanner_PowerGood.Value |> expr((((((1 << 8) | 255) << 8) | 255) << 8) | ($1 == 1 ? 0 : 6))",\r
            "ListenType": 0,\r
            "EventData1": 255,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": 0,\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_AcpiState"\r
        },\r
        "DiscreteEvent_PowerButton": {\r
            "Property": "<=/Scanner_PowerBtnEvt.Value |> expr(((((($1 << 8) | 255) << 8) | 255) << 8) |  0)",\r
            "ListenType": 0,\r
            "EventData1": 255,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": 255,\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PowerButton"\r
        },\r
        "DiscreteEvent_PwrOkSigDrop": {\r
            "Property": "<=/Scanner_PwrOkSigDrop.Value |> expr(((((($1 << 8) | 255) << 8) | 255) << 8) |  1)",\r
            "ListenType": 0,\r
            "EventData1": 255,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": 255,\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PwrOkSigDrop"\r
        },\r
        "DiscreteEvent_PwrOnTimeOut": {\r
            "Property": "<=/Scanner_PowerOnTimeout.Value",\r
            "ListenType": 1,\r
            "EventData1": 1,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Scanner_PowerOnTimeout.Value",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PwrOnTimeOut"\r
        },\r
        "Entity_MainBoard": {\r
            "Id": 7,\r
            "Name": "MainBoard",\r
            "PowerState": 1,\r
            "Presence": 1,\r
            "Instance": 96\r
        },\r
        "Entity_AirInlet": {\r
            "Id": 55,\r
            "Name": "AirInlet",\r
            "PowerState": 1,\r
            "Presence": 1,\r
            "Instance": 96\r
        },\r
        "Event_InletTempUpperMinor": {\r
            "Reading": "<=/Scanner_Lm75_Inlet.Value |> expr($1 > 255 ? 20 : ($1 >= 128 ? (-(255 - $1 + 1)) : $1))",\r
            "@Default": {\r
                "Condition": 46\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "DescArg1": "#/Event_InletTempUpperMinor.Reading |> string.format('%.3f', $1)",\r
            "DescArg2": "#/Event_InletTempUpperMinor.Condition |> string.format('%.3f', $1)",\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_InletTempUpperMajor": {\r
            "Reading": "<=/Scanner_Lm75_Inlet.Value |> expr($1 > 255 ? 20 : ($1 >= 128 ? (-(255 - $1 + 1)) : $1))",\r
            "@Default": {\r
                "Condition": 48\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "DescArg1": "#/Event_InletTempUpperMajor.Reading |> string.format('%.3f', $1)",\r
            "DescArg2": "#/Event_InletTempUpperMajor.Condition |> string.format('%.3f', $1)",\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_InletTempFail": {\r
            "Reading": "<=/Scanner_Lm75_Inlet.Status",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_OutletTempUpperMinor": {\r
            "Reading": "<=/Scanner_Lm75_Outlet.Value;<=/Scanner_Lm75_Inlet.Value |> expr(((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) > 255 ? 35 : ((((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) & 255) >= 128 ? (-(255 - (((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) & 255) + 1)) : (((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) & 255)))",\r
            "@Default": {\r
                "Condition": 75\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "DescArg2": "#/Event_OutletTempUpperMinor.Reading |> string.format('%.3f', $1)",\r
            "DescArg3": "#/Event_OutletTempUpperMinor.Condition |> string.format('%.3f', $1)",\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_RightEarMntr": {\r
            "Reading": "<=/Scanner_RightEar.Value",\r
            "@Default": {\r
                "Reading": 1\r
            },\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_LeftEarMntr": {\r
            "Reading": "<=/Scanner_LeftEar.Value",\r
            "@Default": {\r
                "Reading": 1\r
            },\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_HDDBpPresenceMntr": {\r
            "Reading": "<=/Scanner_HddBPPresent.Value",\r
            "@Default": {\r
                "Reading": 1\r
            },\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_ExpanderAccessFRULableFailure": {\r
            "Reading": 0,\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ExpMosTempHigh": {\r
            "Reading": "<=/Scanner_ExpMosTempHigh.Value",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "(V_VCC_12V0)",\r
            "Component": "#/Component_ComEXU"\r
        },\r
        "Event_Ps1Install": {\r
            "Reading": "<=/Scanner_PS1Pres.Status;<=/Scanner_PS1Pres.Value |> expr($1 == 4 ? 255 : $2)",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 7,\r
            "Enabled": true,\r
            "DescArg1": "1",\r
            "Component": "#/Component_PowerSupply1"\r
        },\r
        "Event_Ps1Removed": {\r
            "Reading": "<=/Scanner_PS1Pres.Status;<=/Scanner_PS1Pres.Value |> expr($1 == 4 ? 255 : $2)",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "DescArg1": "1",\r
            "Component": "#/Component_PowerSupply1"\r
        },\r
        "Event_Ps2Install": {\r
            "Reading": "<=/Scanner_PS2Pres.Status;<=/Scanner_PS2Pres.Value |> expr($1 == 4 ? 255 : $2)",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 7,\r
            "Enabled": true,\r
            "DescArg1": "2",\r
            "Component": "#/Component_PowerSupply2"\r
        },\r
        "Event_Ps2Removed": {\r
            "Reading": "<=/Scanner_PS2Pres.Status;<=/Scanner_PS2Pres.Value |> expr($1 == 4 ? 255 : $2)",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "DescArg1": "2",\r
            "Component": "#/Component_PowerSupply2"\r
        },\r
        "Event_14": {\r
            "Reading": "<=/Chassis_1.IntrusionFlag",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_OutletTempFail": {\r
            "Reading": "<=/Scanner_Lm75_Outlet.Value |> expr(($1 & 32768) == 0 ? 0 : 1)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Chassis"\r
        },\r
        "Event_ECU12V1GetFailMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V1Mntr.Status;<=/Scanner_ECUSys12V1Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "AdditionalInfo": "2",\r
            "DescArg1": "12V",\r
            "DescArg2": "EXU_V_VCC1_12V0",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECU12V2GetFailMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V2Mntr.Status;<=/Scanner_ECUSys12V2Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "AdditionalInfo": "2",\r
            "DescArg1": "12V",\r
            "DescArg2": "EXU_V_VCC2_12V0",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECU12V3GetFailMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V3Mntr.Status;<=/Scanner_ECUSys12V3Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "AdditionalInfo": "2",\r
            "DescArg1": "12V",\r
            "DescArg2": "EXU_V_VCC3_12V0",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECU3V1GetFailMntr": {\r
            "Reading": "<=/Scanner_ECUSys3V1Mntr.Status;<=/Scanner_ECUSys3V1Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "AdditionalInfo": "2",\r
            "DescArg1": "3.3V",\r
            "DescArg2": "EXU_V_STBY_3V3",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECU5V1GetFailMntr": {\r
            "Reading": "<=/Scanner_ECUSys5V1Mntr.Status;<=/Scanner_ECUSys5V1Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "AdditionalInfo": "2",\r
            "DescArg1": "5V",\r
            "DescArg2": "EXU_V_VCC_5V0",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECU5V2GetFailMntr": {\r
            "Reading": "<=/Scanner_ECUSys5V2Mntr.Status;<=/Scanner_ECUSys5V2Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "AdditionalInfo": "2",\r
            "DescArg1": "5V",\r
            "DescArg2": "EXU_V_STBY_5V0",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys12V1HighMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",\r
            "@Default": {\r
                "Reading": 12\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "12V",\r
            "DescArg3": "EXU_V_VCC1_12V0",\r
            "DescArg4": "13.2",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys12V2HighMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",\r
            "@Default": {\r
                "Reading": 12\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "12V",\r
            "DescArg3": "EXU_V_VCC2_12V0",\r
            "DescArg4": "13.2",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys12V3HighMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",\r
            "@Default": {\r
                "Reading": 12\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "12V",\r
            "DescArg3": "EXU_V_VCC3_12V0",\r
            "DescArg4": "13.2",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys3V1HighMntr": {\r
            "Reading": "<=/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096)",\r
            "@Default": {\r
                "Reading": 3.3\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "3.3V",\r
            "DescArg3": "EXU_V_STBY_3V3",\r
            "DescArg4": "3.6",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys5V1HighMntr": {\r
            "Reading": "<=/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",\r
            "@Default": {\r
                "Reading": 5\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "5V",\r
            "DescArg3": "EXU_V_VCC_5V0",\r
            "DescArg4": "5.5",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys5V2HighMntr": {\r
            "Reading": "<=/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",\r
            "@Default": {\r
                "Reading": 5\r
            },\r
            "OperatorId": 4,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "5V",\r
            "DescArg3": "EXU_V_STBY_5V0",\r
            "DescArg4": "5.5",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys12V1LowMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",\r
            "@Default": {\r
                "Reading": 12\r
            },\r
            "OperatorId": 2,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "12V",\r
            "DescArg3": "EXU_V_VCC1_12V0",\r
            "DescArg4": "10.8",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys12V2LowMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",\r
            "@Default": {\r
                "Reading": 12\r
            },\r
            "OperatorId": 2,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "12V",\r
            "DescArg3": "EXU_V_VCC2_12V0",\r
            "DescArg4": "10.8",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys12V3LowMntr": {\r
            "Reading": "<=/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",\r
            "@Default": {\r
                "Reading": 12\r
            },\r
            "OperatorId": 2,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "12V",\r
            "DescArg3": "EXU_V_VCC3_12V0",\r
            "DescArg4": "10.8",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys3V1LowMntr": {\r
            "Reading": "<=/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096)",\r
            "@Default": {\r
                "Reading": 3.3\r
            },\r
            "OperatorId": 2,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "3.3V",\r
            "DescArg3": "EXU_V_STBY_3V3",\r
            "DescArg4": "3.0",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys5V1LowMntr": {\r
            "Reading": "<=/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",\r
            "@Default": {\r
                "Reading": 5\r
            },\r
            "OperatorId": 2,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "5V",\r
            "DescArg3": "EXU_V_VCC_5V0",\r
            "DescArg4": "4.5",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_ECUSys5V2LowMntr": {\r
            "Reading": "<=/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",\r
            "@Default": {\r
                "Reading": 5\r
            },\r
            "OperatorId": 2,\r
            "Enabled": true,\r
            "AdditionalInfo": "3",\r
            "DescArg1": "#/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",\r
            "DescArg2": "5V",\r
            "DescArg3": "EXU_V_STBY_5V0",\r
            "DescArg4": "4.5",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_CpuBrdPresenceMntr": {\r
            "Reading": "<=/Scanner_CpuBrdPresenceMntr.Value",\r
            "@Default": {\r
                "Reading": 1\r
            },\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "BCU",\r
            "Component": "#/Component_Cable"\r
        },\r
        "Event_FanCableMntr": {\r
            "Reading": "<=/Scanner_FanCableMntr.Value",\r
            "@Default": {\r
                "Reading": 1\r
            },\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Cable"\r
        },\r
        "Event_ButtonPowerButtonPressed": {\r
            "Reading": "<=/Scanner_PowerBtnEvt.Value",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_Button"\r
        },\r
        "Event_SystemACPIWorkingState": {\r
            "Reading": "<=/Scanner_PowerGood.Status;<=/Scanner_PowerGood.Value |> expr($1 == 4 ? 255 : $2)",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "Component": "#/Component_ComSystem"\r
        },\r
        "Event_SystemACPISoftOffState": {\r
            "Reading": "<=/Scanner_PowerGood.Status;<=/Scanner_PowerGood.Value |> expr($1 == 4 ? 255 : $2)",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "Component": "#/Component_ComSystem"\r
        },\r
        "Event_ExpBoardReplaceMntr": {\r
            "Reading": "<=/Component_ComExpander.ReplaceFlag",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg1": "#/Component_ComExpander.Instance",\r
            "DescArg2": "#/Component_ComExpander.PreviousSN",\r
            "DescArg3": "#/Component_ComExpander.SerialNumber",\r
            "Component": "#/Component_ComExpander"\r
        },\r
        "Event_UIDButtonMntr": {\r
            "Reading": "<=/Chassis_1.UidButtonPressed",\r
            "OperatorId": 6,\r
            "Enabled": true,\r
            "Component": "#/Component_Button"\r
        },\r
        "Event_CpldSelfcheck": {\r
            "Reading": "<=/ExpBoard_1.CpldStatus",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg1": "1",\r
            "Component": "#/Component_ComExpander",\r
            "@Default":{\r
              "Reading": 255\r
            },\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 255\r
        }\r
    }\r
}`,yI=`{\r
  "FormatVersion": "2.54",\r
  "DataVersion": "2.54",\r
  "Unit": {\r
    "Type": "CLU",\r
    "Name": "FanBoard_1"\r
  },\r
  "ManagementTopology": {\r
    "Anchor": {\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4",\r
        "JtagOverLocalBus_1"\r
      ]\r
    },\r
    "I2c_4": {\r
      "Chips": [\r
        "Smc_FanBoardSMC",\r
        "Eeprom_CLU",\r
        "Chip_Fan_PWM"\r
      ]\r
    },\r
    "I2c_2": {\r
      "Chips": [\r
        "Smc_ExpBoardSMC"\r
      ],\r
      "Connectors": [\r
        "Connector_Fan1DualSensor",\r
        "Connector_Fan1SingleSensor",\r
        "Connector_Fan2DualSensor",\r
        "Connector_Fan2SingleSensor",\r
        "Connector_Fan3DualSensor",\r
        "Connector_Fan3SingleSensor",\r
        "Connector_Fan4DualSensor",\r
        "Connector_Fan4SingleSensor"\r
      ]\r
    },\r
    "JtagOverLocalBus_1": {\r
      "Chips": [\r
        "Cpld_1"\r
      ]\r
    }\r
  },\r
  "Objects": {\r
    "Smc_FanBoardSMC": {\r
      "Address": 96,\r
      "AddrWidth": 1,\r
      "OffsetWidth": 1,\r
      "WriteTmout": 0,\r
      "ReadTmout": 0\r
    },\r
    "Smc_ExpBoardSMC": {\r
      "Address": 96,\r
      "AddrWidth": 1,\r
      "OffsetWidth": 1,\r
      "WriteTmout": 0,\r
      "ReadTmout": 0\r
    },\r
    "Eeprom_CLU": {\r
      "OffsetWidth": 2,\r
      "AddrWidth": 1,\r
      "Address": 174,\r
      "WriteTmout": 100,\r
      "ReadTmout": 100,\r
      "RwBlockSize": 32,\r
      "WriteInterval": 20,\r
      "HealthStatus": 0\r
    },\r
    "Chip_Fan_PWM": {\r
      "OffsetWidth": 4,\r
      "AddrWidth": 4,\r
      "Address": 96\r
    },\r
    "Fans_0": {\r
      "PWMChip": "#/Chip_Fan_PWM",\r
      "SetPWMCmd": 402657793\r
    },\r
    "FanBoard_1": {\r
      "Slot": 1,\r
      "UID": "00000001050302023924",\r
      "Name": "BC83FDCA",\r
      "Manufacturer": "Huawei",\r
      "Type": "CLU",\r
      "Description": "FanBoard",\r
      "PartNumber": "0302023924",\r
      "LogicVersion": "",\r
      "LogicUnit": 1,\r
      "PcbID": "#/Accessor_PcbID.Value",\r
      "PcbVersion": "",\r
      "LogicVersionID": "#/Accessor_LogicVersionID.Value",\r
      "SRVersion": "\${DataVersion}",\r
      "BoardID": 65535,\r
      "BoardType": "FanBoard",\r
      "Number": 1,\r
      "DeviceName": "FanBoard\${Slot}",\r
      "Position": "CLU\${Slot}",\r
      "NodeId": "CLU\${Slot}FanBoard\${Slot}",\r
      "RefSMCChip": "#/Smc_FanBoardSMC",\r
      "FruID": "<=/Fru_FanBoard.FruId",\r
      "PowerWattsExp": "#/Accessor_Fan1_Pwr.Value",\r
      "CpldTestReg": "#/Accessor_CpldTest.Value",\r
      "CpldStatus": 0\r
    },\r
    "Scanner_PowerGood": {\r
      "Chip": "#/Smc_ExpBoardSMC",\r
      "Offset": 469765888,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Period": 100,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Accessor_Fan1_Pwr": {\r
      "Chip": "#/Smc_ExpBoardSMC",\r
      "Offset": 4868,\r
      "Size": 2,\r
      "Mask": 65535,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Accessor_PcbID": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 1792,\r
      "Size": 2,\r
      "Mask": 15,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Accessor_LogicVersionID": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 2816,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Scanner_Fan1_Presence": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402656001,\r
      "Size": 1,\r
      "Mask": 1,\r
      "Type": 0,\r
      "Period": 2000,\r
      "Debounce": "None",\r
      "ScanEnabled": "<=/Scanner_PowerGood.Value",\r
      "NominalValue": 1,\r
      "@Default" :{\r
        "ScanEnabled" : 0\r
      },\r
      "Value": 0\r
    },\r
    "Scanner_Fan1_FSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657025,\r
      "Size": 4,\r
      "Mask": 4294901760,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Scanner_Fan1_RSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657025,\r
      "Size": 4,\r
      "Mask": 65535,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Accessor_Fan1_PWM": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657281,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Fan_1": {\r
      "FanId": 1,\r
      "Slot": 1,\r
      "Coefficient": 1,\r
      "FrontPresence": "<=/Scanner_Fan1_Presence.Value",\r
      "RearPresence": "<=/Scanner_Fan1_Presence.Value",\r
      "FrontSpeed": "<=/Scanner_Fan1_FSpeed.Value",\r
      "RearSpeed": "<=/Scanner_Fan1_RSpeed.Value",\r
      "HardwarePWM": "#/Accessor_Fan1_PWM.Value",\r
      "SystemId": 1,\r
      "FrontStatus": 0,\r
      "RearStatus": 0,\r
      "MaxSupportedPWM": 255,\r
      "IdentifySpeedLevel": 35,\r
      "Position": "CLU",\r
      "PowerGood": "<=/Scanner_PowerGood.Value"\r
    },\r
    "CoolingFan_1_1": {\r
      "FanId": 1,\r
      "Slot": 1,\r
      "FrontPresence": "<=/Fan_1.FrontPresence",\r
      "RearPresence": "<=/Fan_1.RearPresence",\r
      "FrontStatus": "<=/Fan_1.FrontStatus",\r
      "RearStatus": "<=/Fan_1.RearStatus",\r
      "HardwarePWM": "#/Accessor_Fan1_PWM.Value",\r
      "MaxSupportedPWM": 255\r
    },\r
    "Scanner_Fan2_Presence": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402656002,\r
      "Size": 1,\r
      "Mask": 1,\r
      "Type": 0,\r
      "Period": 2000,\r
      "Debounce": "None",\r
      "ScanEnabled": "<=/Scanner_PowerGood.Value",\r
      "NominalValue": 1,\r
      "@Default" :{\r
        "ScanEnabled" : 0\r
      },\r
      "Value": 0\r
    },\r
    "Scanner_Fan2_FSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657026,\r
      "Size": 4,\r
      "Mask": 4294901760,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Scanner_Fan2_RSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657026,\r
      "Size": 4,\r
      "Mask": 65535,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Accessor_Fan2_PWM": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657282,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Connector_test": {\r
      "Bom": "Dual",\r
      "Slot": 1,\r
      "Position": 0,\r
      "Presence": "<=/Fan_1.IsTwins |> expr($1 ? 1 : 0)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 3\r
    },\r
    "Connector_Fan1DualSensor": {\r
      "Bom": "Dual",\r
      "Slot": 1,\r
      "Position": 0,\r
      "Presence": "<=/Fan_1.IsTwins |> expr($1 ? 1 : 0)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
       \r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan1SingleSensor": {\r
      "Bom": "Single",\r
      "Slot": 1,\r
      "Position": 1,\r
      "Presence": "<=/Fan_1.IsTwins |> expr($1 ? 0 : 1)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan2DualSensor": {\r
      "Bom": "Dual",\r
      "Slot": 2,\r
      "Position": 2,\r
      "Presence": "<=/Fan_2.IsTwins |> expr($1 ? 1 : 0)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan2SingleSensor": {\r
      "Bom": "Single",\r
      "Slot": 2,\r
      "Position": 3,\r
      "Presence": "<=/Fan_2.IsTwins |> expr($1 ? 0 : 1)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan3DualSensor": {\r
      "Bom": "Dual",\r
      "Slot": 3,\r
      "Position": 4,\r
      "Presence": "<=/Fan_3.IsTwins |> expr($1 ? 1 : 0)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan3SingleSensor": {\r
      "Bom": "Single",\r
      "Slot": 3,\r
      "Position": 5,\r
      "Presence": "<=/Fan_3.IsTwins |> expr($1 ? 0 : 1)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan4DualSensor": {\r
      "Bom": "Dual",\r
      "Slot": 4,\r
      "Position": 6,\r
      "Presence": "<=/Fan_4.IsTwins |> expr($1 ? 1 : 0)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Connector_Fan4SingleSensor": {\r
      "Bom": "Single",\r
      "Slot": 4,\r
      "Position": 7,\r
      "Presence": "<=/Fan_4.IsTwins |> expr($1 ? 0 : 1)",\r
      "@Default": {\r
        "Presence": 0\r
      },\r
      "Id": "Rotator",\r
      "AuxId": "",\r
      "Buses": [\r
        "I2c_2",\r
        "I2c_4"\r
      ],\r
      "SystemId": 1,\r
      "IdentifyMode": 2\r
    },\r
    "Fan_2": {\r
      "FanId": 2,\r
      "Slot": 2,\r
      "Coefficient": 1,\r
      "FrontPresence": "<=/Scanner_Fan2_Presence.Value",\r
      "RearPresence": "<=/Scanner_Fan2_Presence.Value",\r
      "FrontSpeed": "<=/Scanner_Fan2_FSpeed.Value",\r
      "RearSpeed": "<=/Scanner_Fan2_RSpeed.Value",\r
      "HardwarePWM": "#/Accessor_Fan2_PWM.Value",\r
      "SystemId": 1,\r
      "FrontStatus": 0,\r
      "RearStatus": 0,\r
      "MaxSupportedPWM": 255,\r
      "IdentifySpeedLevel": 35,\r
      "Position": "CLU",\r
      "PowerGood": "<=/Scanner_PowerGood.Value"\r
    },\r
    "CoolingFan_1_2": {\r
      "FanId": 2,\r
      "Slot": 2,\r
      "FrontPresence": "<=/Fan_2.FrontPresence",\r
      "RearPresence": "<=/Fan_2.RearPresence",\r
      "FrontStatus": "<=/Fan_2.FrontStatus",\r
      "RearStatus": "<=/Fan_2.RearStatus",\r
      "HardwarePWM": "#/Accessor_Fan2_PWM.Value",\r
      "MaxSupportedPWM": 255\r
    },\r
    "Scanner_Fan3_Presence": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402656003,\r
      "Size": 1,\r
      "Mask": 1,\r
      "Type": 0,\r
      "Period": 2000,\r
      "Debounce": "None",\r
      "ScanEnabled": "<=/Scanner_PowerGood.Value",\r
      "NominalValue": 1,\r
      "@Default" :{\r
        "ScanEnabled" : 0\r
      },\r
      "Value": 0\r
    },\r
    "Scanner_Fan3_FSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657027,\r
      "Size": 4,\r
      "Mask": 4294901760,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Scanner_Fan3_RSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657027,\r
      "Size": 4,\r
      "Mask": 65535,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Accessor_Fan3_PWM": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657283,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Fan_3": {\r
      "FanId": 3,\r
      "Slot": 3,\r
      "Coefficient": 1,\r
      "FrontPresence": "<=/Scanner_Fan3_Presence.Value",\r
      "RearPresence": "<=/Scanner_Fan3_Presence.Value",\r
      "FrontSpeed": "<=/Scanner_Fan3_FSpeed.Value",\r
      "RearSpeed": "<=/Scanner_Fan3_RSpeed.Value",\r
      "HardwarePWM": "#/Accessor_Fan3_PWM.Value",\r
      "SystemId": 1,\r
      "FrontStatus": 0,\r
      "RearStatus": 0,\r
      "MaxSupportedPWM": 255,\r
      "IdentifySpeedLevel": 35,\r
      "Position": "CLU",\r
      "PowerGood": "<=/Scanner_PowerGood.Value"\r
    },\r
    "Scanner_Fan4_Presence": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402656004,\r
      "Size": 1,\r
      "Mask": 1,\r
      "Type": 0,\r
      "Period": 2000,\r
      "Debounce": "None",\r
      "ScanEnabled": "<=/Scanner_PowerGood.Value",\r
      "NominalValue": 1,\r
      "@Default" :{\r
          "ScanEnabled" : 0\r
      },\r
      "Value": 0\r
    },\r
    "Scanner_Fan4_FSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657028,\r
      "Size": 4,\r
      "Mask": 4294901760,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Scanner_Fan4_RSpeed": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657028,\r
      "Size": 4,\r
      "Mask": 65535,\r
      "Type": 0,\r
      "Period": 1000,\r
      "Debounce": "None",\r
      "Value": 0\r
    },\r
    "Accessor_Fan4_PWM": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 402657284,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Fan_4": {\r
      "FanId": 4,\r
      "Slot": 4,\r
      "Coefficient": 1,\r
      "FrontPresence": "<=/Scanner_Fan4_Presence.Value",\r
      "RearPresence": "<=/Scanner_Fan4_Presence.Value",\r
      "FrontSpeed": "<=/Scanner_Fan4_FSpeed.Value",\r
      "RearSpeed": "<=/Scanner_Fan4_RSpeed.Value",\r
      "HardwarePWM": "#/Accessor_Fan4_PWM.Value",\r
      "SystemId": 1,\r
      "FrontStatus": 0,\r
      "RearStatus": 0,\r
      "MaxSupportedPWM": 255,\r
      "IdentifySpeedLevel": 35,\r
      "Position": "CLU",\r
      "PowerGood": "<=/Scanner_PowerGood.Value"\r
    },\r
    "AbnormalFan_1": {\r
        "Id": 1,\r
        "FanIdx": 1,\r
        "Status": "AbnormalRotation",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_2": {\r
        "Id": 2,\r
        "FanIdx": 1,\r
        "Status": "NotInPosition",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_3": {\r
        "Id": 3,\r
        "FanIdx": 2,\r
        "Status": "NotInPosition",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_4": {\r
        "Id": 4,\r
        "FanIdx": 3,\r
        "Status": "NotInPosition",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_5": {\r
        "Id": 5,\r
        "FanIdx": 4,\r
        "Status": "NotInPosition",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_6": {\r
        "Id": 6,\r
        "FanIdx": 2,\r
        "Status": "AbnormalRotation",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_7": {\r
        "Id": 7,\r
        "FanIdx": 3,\r
        "Status": "AbnormalRotation",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "AbnormalFan_8": {\r
        "Id": 8,\r
        "FanIdx": 4,\r
        "Status": "AbnormalRotation",\r
        "FanGroup": [1, 2, 3, 4]\r
    },\r
    "Accessor_JtagSwitch": {\r
      "Chip": "#/Smc_ExpBoardSMC",\r
      "Offset": 469776896,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Accessor_LogicVerId": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 2816,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Cpld_1": {\r
      "HealthStatus": 0\r
    },\r
    "LogicFirmware_CLU_1": {\r
      "UId": "00000001050302023924",\r
      "Name": "CLU_CPLD",\r
      "Manufacturer": "Huawei",\r
      "Version": "#/Accessor_LogicVerId.Value",\r
      "Location": 1,\r
      "UpgradeChip": "#/Cpld_1",\r
      "ChipInfo": "#/Cpld_1",\r
      "Routes": "#/Accessor_JtagSwitch.Value",\r
      "DefaultRoute": 0,\r
      "FirmwareRoute": 5,\r
      "ValidMode": 0,\r
      "SoftwareId": "CPLD-BC83FDCA",\r
      "ValidAction": 0\r
    },\r
    "DftVersion_FanBoardCpldVersion": {\r
      "FruId": "<=/Fru_FanBoard.FruId",\r
      "VersionType": 2,\r
      "Version": "<=/FanBoard_1.LogicVersion",\r
      "UnitNum": "<=/FanBoard_1.LogicUnit",\r
      "NeedUintNum": 1\r
    },\r
    "DftVersion_FanBoardPcbVersion": {\r
      "FruId": "<=/Fru_FanBoard.FruId",\r
      "VersionType": 0,\r
      "Version": "<=/FanBoard_1.PcbVersion"\r
    },\r
    "DftVersion_FanBoardCsrVersion": {\r
      "FruId": "<=/Fru_FanBoard.FruId",\r
      "VersionType": 25,\r
      "Version": "<=/FanBoard_1.SRVersion"\r
    },\r
    "Accessor_CLUWP": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Size": 1,\r
      "Offset": 11776,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "SRUpgrade_1": {\r
      "UID": "00000001050302023924",\r
      "Type": "CLU",\r
      "Version": "\${DataVersion}",\r
      "StorageChip": "#/Eeprom_CLU",\r
      "SoftwareId": "HWSR-BC83FDCA",\r
      "WriteProtect": "#/Accessor_CLUWP.Value"\r
    },\r
    "Fru_FanBoard": {\r
      "PcbId": 1,\r
      "PcbVersion": ".A",\r
      "FruId": 1,\r
      "FruName": "FanBoard\${Slot}",\r
      "PowerState": 1,\r
      "Health": 0,\r
      "EepStatus": 1,\r
      "Type": 24,\r
      "FruDataId": "#/FruData_FanBoard"\r
    },\r
    "Component_FanBoard": {\r
      "FruId": "<=/Fru_FanBoard.FruId",\r
      "Instance": "\${Slot}",\r
      "Type": 24,\r
      "Location": "<=/FanBoard_1.Position",\r
      "Name": "<=/FanBoard_1.DeviceName",\r
      "Presence": 1,\r
      "Health": 0,\r
      "PowerState": 1,\r
      "GroupId": 1,\r
      "UniqueId": "00000001050302023924",\r
      "ReplaceFlag": 0,\r
      "PreviousSN": "",\r
      "SerialNumber": "<=/FruData_FanBoard.BoardSerialNumber"\r
    },\r
    "FruData_FanBoard": {\r
      "FruId": 1,\r
      "FruDev": "#/Eeprom_CLU",\r
      "EepromWp": "#/Accessor_CLUWP.Value",\r
      "BoardSerialNumber": "",\r
      "StorageType": "TianChi"\r
    },\r
    "Entity_Fan1": {\r
      "Id": 30,\r
      "Instance": 96,\r
      "Name": "Fan1",\r
      "Presence": "<=/Scanner_Fan1_Presence.Value",\r
      "PowerState": "<=/Scanner_PowerGood.Value"\r
    },\r
    "Entity_Fan2": {\r
      "Id": 30,\r
      "Instance": 97,\r
      "Name": "Fan2",\r
      "Presence": "<=/Scanner_Fan2_Presence.Value",\r
      "PowerState": "<=/Scanner_PowerGood.Value"\r
    },\r
    "Entity_Fan3": {\r
      "Id": 30,\r
      "Instance": 98,\r
      "Name": "Fan3",\r
      "Presence": "<=/Scanner_Fan3_Presence.Value",\r
      "PowerState": "<=/Scanner_PowerGood.Value"\r
    },\r
    "Entity_Fan4": {\r
      "Id": 30,\r
      "Instance": 99,\r
      "Name": "Fan4",\r
      "Presence": "<=/Scanner_Fan4_Presence.Value",\r
      "PowerState": "<=/Scanner_PowerGood.Value"\r
    },\r
    "DiscreteEvent_FAN1FPresence": {\r
      "Property": "<=/Scanner_Fan1_Presence.Value",\r
      "ListenType": 1,\r
      "EventData1": 0,\r
      "EventData2": 255,\r
      "EventData3": 255,\r
      "EventDir": "<=/Scanner_Fan1_Presence.Value",\r
      "Conversion": 1,\r
      "SensorObject": "#/DiscreteSensor_FAN1FPresence"\r
    },\r
    "DiscreteSensor_FAN1FPresence": {\r
      "OwnerId": 32,\r
      "OwnerLun": 0,\r
      "EntityId": "<=/Entity_Fan1.Id",\r
      "EntityInstance": "<=/Entity_Fan1.Instance",\r
      "Initialization": 99,\r
      "Capabilities": 64,\r
      "SensorType": 10,\r
      "ReadingType": 8,\r
      "SensorName": "FAN1 Presence",\r
      "AssertMask": 1,\r
      "DeassertMask": 1,\r
      "DiscreteMask": 1,\r
      "DiscreteType": 0,\r
      "Unit": 192,\r
      "BaseUnit": 0,\r
      "ModifierUnit": 0,\r
      "RecordSharing": 1,\r
      "Reading": 0\r
    },\r
    "DiscreteEvent_FAN2FPresence": {\r
      "Property": "<=/Scanner_Fan2_Presence.Value",\r
      "ListenType": 1,\r
      "EventData1": 0,\r
      "EventData2": 255,\r
      "EventData3": 255,\r
      "EventDir": "<=/Scanner_Fan2_Presence.Value",\r
      "Conversion": 1,\r
      "SensorObject": "#/DiscreteSensor_FAN2FPresence"\r
    },\r
    "DiscreteSensor_FAN2FPresence": {\r
      "OwnerId": 32,\r
      "OwnerLun": 0,\r
      "EntityId": "<=/Entity_Fan2.Id",\r
      "EntityInstance": "<=/Entity_Fan2.Instance",\r
      "Initialization": 99,\r
      "Capabilities": 64,\r
      "SensorType": 10,\r
      "ReadingType": 8,\r
      "SensorName": "FAN2 Presence",\r
      "AssertMask": 1,\r
      "DeassertMask": 1,\r
      "DiscreteMask": 1,\r
      "DiscreteType": 0,\r
      "Unit": 192,\r
      "BaseUnit": 0,\r
      "ModifierUnit": 0,\r
      "RecordSharing": 1,\r
      "Reading": 0\r
    },\r
    "DiscreteEvent_FAN3FPresence": {\r
      "Property": "<=/Scanner_Fan3_Presence.Value",\r
      "ListenType": 1,\r
      "EventData1": 0,\r
      "EventData2": 255,\r
      "EventData3": 255,\r
      "EventDir": "<=/Scanner_Fan3_Presence.Value",\r
      "Conversion": 1,\r
      "SensorObject": "#/DiscreteSensor_FAN3FPresence"\r
    },\r
    "DiscreteSensor_FAN3FPresence": {\r
      "OwnerId": 32,\r
      "OwnerLun": 0,\r
      "EntityId": "<=/Entity_Fan3.Id",\r
      "EntityInstance": "<=/Entity_Fan3.Instance",\r
      "Initialization": 99,\r
      "Capabilities": 64,\r
      "SensorType": 10,\r
      "ReadingType": 8,\r
      "SensorName": "FAN3 Presence",\r
      "AssertMask": 1,\r
      "DeassertMask": 1,\r
      "DiscreteMask": 1,\r
      "DiscreteType": 0,\r
      "Unit": 192,\r
      "BaseUnit": 0,\r
      "ModifierUnit": 0,\r
      "RecordSharing": 1,\r
      "Reading": 0\r
    },\r
    "DiscreteEvent_FAN4FPresence": {\r
      "Property": "<=/Scanner_Fan4_Presence.Value",\r
      "ListenType": 1,\r
      "EventData1": 0,\r
      "EventData2": 255,\r
      "EventData3": 255,\r
      "EventDir": "<=/Scanner_Fan4_Presence.Value",\r
      "Conversion": 1,\r
      "SensorObject": "#/DiscreteSensor_FAN4FPresence"\r
    },\r
    "DiscreteSensor_FAN4FPresence": {\r
      "OwnerId": 32,\r
      "OwnerLun": 0,\r
      "EntityId": "<=/Entity_Fan4.Id",\r
      "EntityInstance": "<=/Entity_Fan4.Instance",\r
      "Initialization": 99,\r
      "Capabilities": 64,\r
      "SensorType": 10,\r
      "ReadingType": 8,\r
      "SensorName": "FAN4 Presence",\r
      "AssertMask": 1,\r
      "DeassertMask": 1,\r
      "DiscreteMask": 1,\r
      "DiscreteType": 0,\r
      "Unit": 192,\r
      "BaseUnit": 0,\r
      "ModifierUnit": 0,\r
      "RecordSharing": 1,\r
      "Reading": 0\r
    },\r
    "MCUFirmware_1": {\r
      "UID": "00000001050302023924",\r
      "RefChip": "#/Smc_FanBoardSMC",\r
      "Address": 96,\r
      "Protocol": "SMC",\r
      "SoftwareId": "MCU-BC83FDCA",\r
      "BoardType": "CLU"\r
    },\r
    "CoolingFan_1_3": {\r
      "FanId": 3,\r
      "Slot": 3,\r
      "FrontPresence": "<=/Fan_3.FrontPresence",\r
      "RearPresence": "<=/Fan_3.RearPresence",\r
      "FrontStatus": "<=/Fan_3.FrontStatus",\r
      "RearStatus": "<=/Fan_3.RearStatus",\r
      "HardwarePWM": "#/Accessor_Fan3_PWM.Value",\r
      "MaxSupportedPWM": 255\r
    },\r
    "CoolingFan_1_4": {\r
      "FanId": 4,\r
      "Slot": 4,\r
      "FrontPresence": "<=/Fan_4.FrontPresence",\r
      "RearPresence": "<=/Fan_4.RearPresence",\r
      "FrontStatus": "<=/Fan_4.FrontStatus",\r
      "RearStatus": "<=/Fan_4.RearStatus",\r
      "HardwarePWM": "#/Accessor_Fan4_PWM.Value",\r
      "MaxSupportedPWM": 255\r
    },\r
    "FanType_8038P": {\r
      "Name": "02314BLG 8038+",\r
      "Index": 1,\r
      "IsDefaultType": true,\r
      "IsTwins": false,\r
      "FrontMaxSpeed": 15000,\r
      "RearMaxSpeed": 15000,\r
      "IdentifyRangeLow": 3230,\r
      "IdentifyRangeHigh": 4750,\r
      "PartNumber": "02314BLG",\r
      "BOM": "BOM32030275",\r
      "SystemId": 1\r
    },\r
    "FanType_8080P": {\r
      "Name": "02314EWC 8080+",\r
      "Index": 2,\r
      "IsDefaultType": true,\r
      "IsTwins": true,\r
      "FrontMaxSpeed": 16500,\r
      "RearMaxSpeed": 16500,\r
      "IdentifyRangeLow": 4907,\r
      "IdentifyRangeHigh": 7219,\r
      "PartNumber": "02314EWC",\r
      "BOM": "BOM32030389-001",\r
      "SystemId": 1\r
    },\r
    "DftEeprom_1": {\r
      "Id": 12,\r
      "Type": 1,\r
      "Slot": "\${GroupId}",\r
      "DeviceNum": 0,\r
      "ItemName": "Eeprom Self Test",\r
      "PrompteReady": "",\r
      "PrompteFinish": "",\r
      "ProcessPeriod": 65535,\r
      "FruData": "#/FruData_FanBoard"\r
    },\r
    "DftEepromWp_1": {\r
      "Id": 47,\r
      "Type": 1,\r
      "Slot": "\${GroupId}",\r
      "DeviceNum": 0,\r
      "ItemName": "Eeprom Write Protect Self Test",\r
      "PrompteReady": "",\r
      "PrompteFinish": "",\r
      "ProcessPeriod": 65535,\r
      "FruData": "#/FruData_FanBoard"\r
    },\r
    "DftIOTest_1": {\r
      "Type": 2,\r
      "Id": 89,\r
      "DeviceNum": 6,\r
      "ItemName": "SMC For FanBoard LM75 Temp",\r
      "PrompteReady": "",\r
      "PrompteFinish": "",\r
      "ProcessPeriod": 65535,\r
      "Destination": "#/Accessor_FanBLm75.Value",\r
      "Data": 0,\r
      "ActionType": 2\r
    },\r
    "Accessor_FanBLm75": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 4354,\r
      "Size": 1,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "MidAvg_FanBrd": {\r
      "WindowSize": 4,\r
      "DefaultValue": 20,\r
      "IsSigned": true\r
    },\r
    "Scanner_FanBrdTemp": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Type": 0,\r
      "Size": 1,\r
      "Offset": 4354,\r
      "Mask": 255,\r
      "Period": 1000,\r
      "Debounce": "#/MidAvg_FanBrd",\r
      "Value": 0,\r
      "Status": 0\r
    },\r
    "Entity_FanBoard": {\r
      "Id": 11,\r
      "Instance": 117,\r
      "Name": "FanBoard\${Slot}",\r
      "PowerState": 1,\r
      "Presence": 1\r
    },\r
    "CoolingRequirement_1_8": {\r
        "RequirementId": 8,\r
        "MonitoringStatus": "<=/Scanner_FanBrdTemp.Status",\r
        "MonitoringValue": "<=/Scanner_FanBrdTemp.Value",\r
        "IsBackupRequirement": true,\r
        "SensorName": "#/ThresholdSensor_FanBoardTemp.SensorName"\r
    },\r
    "CoolingArea_1_8": {\r
        "AreaId": 8,\r
        "RequirementIdx": 8,\r
        "PolicyIdxGroup": [],\r
        "FanIdxGroup":[]\r
    },\r
    "ThresholdSensor_FanBoardTemp": {\r
      "OwnerId": 32,\r
      "OwnerLun": 0,\r
      "EntityId": "<=/Entity_FanBoard.Id",\r
      "EntityInstance": "<=/Entity_FanBoard.Instance",\r
      "Initialization": 127,\r
      "Capabilities": 104,\r
      "SensorType": 1,\r
      "ReadingType": 1,\r
      "SensorName": "CLU\${Slot} Temp",\r
      "AssertMask": 0,\r
      "DeassertMask": 0,\r
      "ReadingMask": 0,\r
      "Unit": 128,\r
      "BaseUnit": 1,\r
      "ModifierUnit": 0,\r
      "Linearization": 0,\r
      "M": 100,\r
      "RBExp": 224,\r
      "Analog": 1,\r
      "NominalReading": 0,\r
      "NormalMaximum": 0,\r
      "NormalMinimum": 0,\r
      "MaximumReading": 127,\r
      "MinimumReading": 128,\r
      "Reading": "<=/Scanner_FanBrdTemp.Value",\r
      "ReadingStatus": "<=/Scanner_FanBrdTemp.Status"\r
    },\r
    "Component_CLU": {\r
      "FruId": 255,\r
      "Instance": 255,\r
      "Type": 196,\r
      "Name": "CLU\${Slot}",\r
      "Presence": 1,\r
      "Health": 0,\r
      "PowerState": 1,\r
      "BoardId": 65535,\r
      "UniqueId": "N/A",\r
      "Manufacturer": "",\r
      "GroupId": 1,\r
      "Location": "chassis"\r
    },\r
    "Component_Fan": {\r
      "FruId": 255,\r
      "Instance": 255,\r
      "Type": 4,\r
      "Name": "Fan",\r
      "Presence": 1,\r
      "Health": 0,\r
      "PowerState": 1,\r
      "UniqueId": "N/A",\r
      "Manufacturer": "",\r
      "GroupId": 1,\r
      "Location": "<=/Component_CLU.Name",\r
      "NodeId": "253"\r
    },\r
    "Component_Fan1": {\r
      "FruId": 255,\r
      "Instance": "<=/Fan_1.FanId",\r
      "Type": 4,\r
      "Name": "Fan1",\r
      "Presence": "<=/Fan_1.FrontPresence",\r
      "Health": 0,\r
      "PowerState": 1,\r
      "UniqueId": "N/A",\r
      "Manufacturer": "",\r
      "GroupId": 1,\r
      "Location": "<=/Component_CLU.Name",\r
      "NodeId": "0"\r
    },\r
    "Component_Fan2": {\r
      "FruId": 255,\r
      "Instance": "<=/Fan_2.FanId",\r
      "Type": 4,\r
      "Name": "Fan2",\r
      "Presence": "<=/Fan_2.FrontPresence",\r
      "Health": 0,\r
      "PowerState": 1,\r
      "UniqueId": "N/A",\r
      "Manufacturer": "",\r
      "GroupId": 1,\r
      "Location": "<=/Component_CLU.Name",\r
      "NodeId": "1"\r
    },\r
    "Component_Fan3": {\r
      "FruId": 255,\r
      "Instance": "<=/Fan_3.FanId",\r
      "Type": 4,\r
      "Name": "Fan3",\r
      "Presence": "<=/Fan_3.FrontPresence",\r
      "Health": 0,\r
      "PowerState": 1,\r
      "UniqueId": "N/A",\r
      "Manufacturer": "",\r
      "GroupId": 1,\r
      "Location": "<=/Component_CLU.Name",\r
      "NodeId": "2"\r
    },\r
    "Component_Fan4": {\r
      "FruId": 255,\r
      "Instance": "<=/Fan_4.FanId",\r
      "Type": 4,\r
      "Name": "Fan4",\r
      "Presence": "<=/Fan_4.FrontPresence",\r
      "Health": 0,\r
      "PowerState": 1,\r
      "UniqueId": "N/A",\r
      "Manufacturer": "",\r
      "GroupId": 1,\r
      "Location": "<=/Component_CLU.Name",\r
      "NodeId": "3"\r
    },\r
    "Event_FanRedundancyMntr": {\r
      "EventKeyId": "Fan.FanRedundancy",\r
      "Reading": "<=/Scanner_Fan1_Presence.Value;<=/Scanner_Fan2_Presence.Value;<=/Scanner_Fan3_Presence.Value;<=/Scanner_Fan4_Presence.Value |> expr($1 + $2 + $3 +$4)",\r
      "@Default" : {\r
        "Reading": 5\r
      },\r
      "Condition": 4,\r
      "OperatorId": 1,\r
      "Enabled": true,\r
      "Component": "#/Component_Fan",\r
      "LedFaultCode": "F01"\r
    },\r
    "Event_FanBoardReplaceMntr": {\r
      "EventKeyId": "Fan.FanBoardReplace",\r
      "Reading": "<=/Component_FanBoard.ReplaceFlag",\r
      "Condition": 1,\r
      "OperatorId": 5,\r
      "Enabled": true,\r
      "DescArg1": "#/Component_FanBoard.Instance",\r
      "DescArg2": "#/Component_FanBoard.PreviousSN",\r
      "DescArg3": "#/Component_FanBoard.SerialNumber",\r
      "Component": "#/Component_FanBoard"\r
    },\r
	"Event_Fan1FStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_1.FrontStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "1",\r
      "DescArg2": "front",\r
      "Component": "#/Component_Fan1",\r
      "LedFaultCode": "F01",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan2FStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_2.FrontStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "2",\r
      "DescArg2": "front",\r
      "Component": "#/Component_Fan2",\r
      "LedFaultCode": "F02",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan3FStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_3.FrontStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "3",\r
      "DescArg2": "front",\r
      "Component": "#/Component_Fan3",\r
      "LedFaultCode": "F03",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan4FStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_4.FrontStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "4",\r
      "DescArg2": "front",\r
      "Component": "#/Component_Fan4",\r
      "LedFaultCode": "F04",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan1RStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_1.RearStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "1",\r
      "DescArg2": "rear",\r
      "Component": "#/Component_Fan1",\r
      "LedFaultCode": "F01",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan2RStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_2.RearStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "2",\r
      "DescArg2": "rear",\r
      "Component": "#/Component_Fan2",\r
      "LedFaultCode": "F02",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan3RStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_3.RearStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "3",\r
      "DescArg2": "rear",\r
      "Component": "#/Component_Fan3",\r
      "LedFaultCode": "F03",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan4RStatus": {\r
      "EventKeyId": "Fan.FanSpeedDeviation",\r
      "Reading": "<=/Fan_4.RearStatus",\r
      "Condition": 0,\r
      "OperatorId": 6,\r
      "Enabled": true,\r
      "DescArg1": "4",\r
      "DescArg2": "rear",\r
      "Component": "#/Component_Fan4",\r
      "LedFaultCode": "F04",\r
      "AdditionalInfo" : "1,2"\r
    },\r
    "Event_Fan1FInstall": {\r
      "EventKeyId": "Fan.FanInstalled",\r
      "Reading": "<=/Scanner_Fan1_Presence.Status;<=/Scanner_Fan1_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 1,\r
      "OperatorId": 7,\r
      "Enabled": true,\r
      "DescArg1": "1",\r
      "Component": "#/Component_Fan1",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan2FInstall": {\r
      "EventKeyId": "Fan.FanInstalled",\r
      "Reading": "<=/Scanner_Fan2_Presence.Status;<=/Scanner_Fan2_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 1,\r
      "OperatorId": 7,\r
      "Enabled": true,\r
      "DescArg1": "2",\r
      "Component": "#/Component_Fan2",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan3FInstall": {\r
      "EventKeyId": "Fan.FanInstalled",\r
      "Reading": "<=/Scanner_Fan3_Presence.Status;<=/Scanner_Fan3_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 1,\r
      "OperatorId": 7,\r
      "Enabled": true,\r
      "DescArg1": "3",\r
      "Component": "#/Component_Fan3",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan4FInstall": {\r
      "EventKeyId": "Fan.FanInstalled",\r
      "Reading": "<=/Scanner_Fan4_Presence.Status;<=/Scanner_Fan4_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 1,\r
      "OperatorId": 7,\r
      "Enabled": true,\r
      "DescArg1": "4",\r
      "Component": "#/Component_Fan4",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan1FRemoved": {\r
      "EventKeyId": "Fan.FanRemoved",\r
      "Reading": "<=/Scanner_Fan1_Presence.Status;<=/Scanner_Fan1_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 0,\r
      "OperatorId": 8,\r
      "Enabled": true,\r
      "DescArg1": "1",\r
      "Component": "#/Component_Fan1",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan2FRemoved": {\r
      "EventKeyId": "Fan.FanRemoved",\r
      "Reading": "<=/Scanner_Fan2_Presence.Status;<=/Scanner_Fan2_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 0,\r
      "OperatorId": 8,\r
      "Enabled": true,\r
      "DescArg1": "2",\r
      "Component": "#/Component_Fan2",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan3FRemoved": {\r
      "EventKeyId": "Fan.FanRemoved",\r
      "Reading": "<=/Scanner_Fan3_Presence.Status;<=/Scanner_Fan3_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 0,\r
      "OperatorId": 8,\r
      "Enabled": true,\r
      "DescArg1": "3",\r
      "Component": "#/Component_Fan3",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Event_Fan4FRemoved": {\r
      "EventKeyId": "Fan.FanRemoved",\r
      "Reading": "<=/Scanner_Fan4_Presence.Status;<=/Scanner_Fan4_Presence.Value |> expr($1 == 4 ? 255 : $2)",\r
      "@Default": {\r
        "Reading": 255\r
      },\r
      "Condition": 0,\r
      "OperatorId": 8,\r
      "Enabled": true,\r
      "DescArg1": "4",\r
      "Component": "#/Component_Fan4",\r
      "AdditionalInfo" : "1"\r
    },\r
    "Accessor_CpldTest": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Size": 1,\r
      "Offset": 8704,\r
      "Mask": 255,\r
      "Type": 0,\r
      "Value": 0\r
    },\r
    "Event_CpldSelfcheck": {\r
      "EventKeyId": "FanBoard.FanBoardCPLDSelfTestFailure",\r
      "Reading": "<=/FanBoard_1.CpldStatus",\r
      "Condition": 1,\r
      "OperatorId": 5,\r
      "Enabled": true,\r
      "DescArg1": "1",\r
      "@Default":{\r
        "Reading": 255\r
      },\r
      "InvalidReadingIgnore": 1,\r
      "InvalidReading": 255,\r
      "Component": "#/Component_FanBoard"\r
    },\r
    "SmcDfxInfo_CLU": {\r
      "Chip": "#/Smc_FanBoardSMC",\r
      "Offset": 7424,\r
      "Size": 33,\r
      "Period": 1000,\r
      "SmcVersion": 108,\r
      "Config": {\r
        "1": {"cpld_ver": 255},\r
        "2": {"board_temp_l": 255},\r
        "3": {"board_temp_h": 255},\r
        "12": {"code_power_fail": 255},\r
        "13": {"code_power_time_out": 255},\r
        "14": {"fan1_prsnt_n": 1},\r
        "15": {"fan2_prsnt_n": 1},\r
        "16": {"fan3_prsnt_n": 1},\r
        "17": {"fan4_prsnt_n": 1},\r
        "18": {"fan1_tach_a_data_l": 255},\r
        "19": {"fan1_tach_a_data_h": 255},\r
        "20": {"fan1_tach_b_data_l": 255},\r
        "21": {"fan1_tach_b_data_h": 255},\r
        "22": {"fan2_tach_a_data_l": 255},\r
        "23": {"fan2_tach_a_data_h": 255},\r
        "24": {"fan2_tach_b_data_l": 255},\r
        "25": {"fan2_tach_b_data_h": 255},\r
        "26": {"fan3_tach_a_data_l": 255},\r
        "27": {"fan3_tach_a_data_h": 255},\r
        "28": {"fan3_tach_b_data_l": 255},\r
        "29": {"fan3_tach_b_data_h": 255},\r
        "30": {"fan4_tach_a_data_l": 255},\r
        "31": {"fan4_tach_a_data_h": 255},\r
        "32": {"fan4_tach_b_data_l": 255},\r
        "33": {"fan4_tach_b_data_h": 255}\r
      },\r
      "Mapping": {\r
        "Scanner_Fan1_Presence": {"Value": "expr($fan1_prsnt_n)"},\r
        "Scanner_Fan1_FSpeed": {"Value": "expr((($fan1_tach_b_data_l >> 7) << 7) + ($fan1_tach_b_data_h << 8))"},\r
        "Scanner_Fan1_RSpeed": {"Value": "expr((($fan1_tach_a_data_l >> 7) << 7) + ($fan1_tach_a_data_h << 8))"},\r
        "Scanner_Fan2_Presence": {"Value": "expr($fan2_prsnt_n)"},\r
        "Scanner_Fan2_FSpeed": {"Value": "expr((($fan2_tach_b_data_l >> 7) << 7) + ($fan2_tach_b_data_h << 8))"},\r
        "Scanner_Fan2_RSpeed": {"Value": "expr((($fan2_tach_a_data_l >> 7) << 7) + ($fan2_tach_a_data_h << 8))"},\r
        "Scanner_Fan3_Presence": {"Value": "expr($fan3_prsnt_n)"},\r
        "Scanner_Fan3_FSpeed": {"Value": "expr((($fan3_tach_b_data_l >> 7) << 7) + ($fan3_tach_b_data_h << 8))"},\r
        "Scanner_Fan3_RSpeed": {"Value": "expr((($fan3_tach_a_data_l >> 7) << 7) + ($fan3_tach_a_data_h << 8))"},\r
        "Scanner_Fan4_Presence": {"Value": "expr($fan4_prsnt_n)"},\r
        "Scanner_Fan4_FSpeed": {"Value": "expr((($fan4_tach_b_data_l >> 7) << 7) + ($fan4_tach_b_data_h << 8))"},\r
        "Scanner_Fan4_RSpeed": {"Value": "expr((($fan4_tach_a_data_l >> 7) << 7) + ($fan4_tach_a_data_h << 8))"},\r
        "Scanner_FanBrdTemp": {"Value": "expr($board_temp_l)"}\r
      }\r
    }\r
  }\r
}`,CI=`{\r
    "FormatVersion": "3.00",\r
    "DataVersion": "3.00",\r
    "Unit": {\r
        "Type": "SEU",\r
        "Name": "HddBackplane_1"\r
    },\r
    "ManagementTopology": {\r
        "Anchor": {\r
            "Buses": [\r
                "I2c_5"\r
            ]\r
        },\r
        "I2c_5": {\r
            "Chips": [\r
                "Smc_EnclSMC"\r
            ]\r
        }\r
    },\r
    "Objects": {\r
        "Smc_EnclSMC": {\r
            "Address": 96,\r
            "AddrWidth": 1,\r
            "OffsetWidth": 1,\r
            "WriteTmout": 0,\r
            "ReadTmout": 0\r
        },\r
        "Scanner_Drive0PresentAccessor_25": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545625,\r
            "Size": 2,\r
            "Mask": 1,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 255,\r
            "NominalValue": 255\r
        },\r
        "Scanner_Drive0PresentAccessor_27": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545627,\r
            "Size": 2,\r
            "Mask": 1,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 255,\r
            "NominalValue": 255\r
        },\r
        "Scanner_Drive0LocateAccessor_25": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545625,\r
            "Size": 2,\r
            "Mask": 3072,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive0LocateAccessor_27": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545627,\r
            "Size": 2,\r
            "Mask": 3072,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive0FalutAccessor_25": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545625,\r
            "Size": 2,\r
            "Mask": 768,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive0FalutAccessor_27": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545627,\r
            "Size": 2,\r
            "Mask": 768,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive0ActivationAccessor_25": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545625,\r
            "Size": 2,\r
            "Mask": 12288,\r
            "Type": 0,\r
            "Period": 5000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive0ActivationAccessor_27": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545627,\r
            "Size": 2,\r
            "Mask": 12288,\r
            "Type": 0,\r
            "Period": 5000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Accessor_Drive0LocateAccessor": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Size": 2,\r
            "Offset": "\${Slot} |> expr($1 == 3 ? 335545881 : 335545883)",\r
            "Mask": 3072,\r
            "Type": 0,\r
            "Value": 0\r
        },\r
        "Accessor_Drive0FaultAccessor": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Size": 2,\r
            "Offset": "\${Slot} |> expr($1 == 3 ? 335545881 : 335545883)",\r
            "Mask": 768,\r
            "Type": 0,\r
            "Value": 0\r
        },\r
        "Drive_1": {\r
            "Id": "\${Slot} |> expr($1 == 3 ? 40 : 42)",\r
            "Name": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('Disk%s',$1)",\r
            "PhysicalLocation": "HDD Plane",\r
            "NodeId": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('HDDPlaneDisk%s',$1)",\r
            "Presence": "<=/HddBackplane_1.Slot; <=/Scanner_Drive0PresentAccessor_25.Value; <=/Scanner_Drive0PresentAccessor_27.Value |> expr($1 == 3 ? $2 : $3)",\r
            "@Default": {\r
                "Presence": 255\r
            },\r
            "LocateLed": "<=/HddBackplane_1.Slot; <=/Scanner_Drive0LocateAccessor_25.Value; <=/Scanner_Drive0LocateAccessor_27.Value |> expr($1 == 3 ? $2 : $3)",\r
            "FaultLed": "<=/HddBackplane_1.Slot; <=/Scanner_Drive0FalutAccessor_25.Value; <=/Scanner_Drive0FalutAccessor_27.Value |> expr($1 == 3 ? $2 : $3)",\r
            "SetLocateLed": "#/Accessor_Drive0LocateAccessor.Value",\r
            "SetFaultLed": "#/Accessor_Drive0FaultAccessor.Value",\r
            "ActivationLed": "<=/HddBackplane_1.Slot; <=/Scanner_Drive0ActivationAccessor_25.Value; <=/Scanner_Drive0ActivationAccessor_27.Value |> expr($1 == 3 ? $2 : $3)",\r
            "TemperatureCelsius": 255,\r
            "Missing": 0,\r
            "Health": "<=/Component_Drive0.Health",\r
            "RebuildState": 0,\r
            "FirmwareStatus": 255,\r
            "PredictiveFailure": 0,\r
            "InAFailedArray": 0,\r
            "FirmwareStatusError": false,\r
            "SerialNumber": "",\r
            "RelativeSlot": 0,\r
            "HddBackplaneStartSlot": "<=/HddBackplane_1.StartSlot",\r
            "IODeteriorationHealthCode": 0\r
        },\r
        "DiscreteSensor_Disk0": {\r
            "AssertMask": 199,\r
            "DeassertMask": 199,\r
            "DiscreteMask": 199\r
        },\r
        "Scanner_Drive1PresentAccessor_26": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545626,\r
            "Size": 2,\r
            "Mask": 1,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 255,\r
            "NominalValue": 255\r
        },\r
        "Scanner_Drive1PresentAccessor_28": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545628,\r
            "Size": 2,\r
            "Mask": 1,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 255,\r
            "NominalValue": 255\r
        },\r
        "Scanner_Drive1LocateAccessor_26": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545626,\r
            "Size": 2,\r
            "Mask": 3072,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive1LocateAccessor_28": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545628,\r
            "Size": 2,\r
            "Mask": 3072,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive1FalutAccessor_26": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545626,\r
            "Size": 2,\r
            "Mask": 768,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive1FalutAccessor_28": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545628,\r
            "Size": 2,\r
            "Mask": 768,\r
            "Type": 0,\r
            "Period": 2000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive1ActivationAccessor_26": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545626,\r
            "Size": 2,\r
            "Mask": 12288,\r
            "Type": 0,\r
            "Period": 5000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Scanner_Drive1ActivationAccessor_28": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 335545628,\r
            "Size": 2,\r
            "Mask": 12288,\r
            "Type": 0,\r
            "Period": 5000,\r
            "Debounce": "None",\r
            "Value": 0,\r
            "NominalValue": 0\r
        },\r
        "Accessor_Drive1LocateAccessor": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Size": 2,\r
            "Offset": "\${Slot} |> expr($1 == 3 ? 335545882 : 335545884)",\r
            "Mask": 3072,\r
            "Type": 0,\r
            "Value": 0\r
        },\r
        "Accessor_Drive1FaultAccessor": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Size": 2,\r
            "Offset": "\${Slot} |> expr($1 == 3 ? 335545882 : 335545884)",\r
            "Mask": 768,\r
            "Type": 0,\r
            "Value": 0\r
        },\r
        "Drive_2": {\r
            "Id": "\${Slot} |> expr($1 == 3 ? 41 : 43)",\r
            "Name": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('Disk%s',$1)",\r
            "PhysicalLocation": "HDD Plane",\r
            "NodeId": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('HDDPlaneDisk%s',$1)",\r
            "Presence": "<=/HddBackplane_1.Slot; <=/Scanner_Drive1PresentAccessor_26.Value; <=/Scanner_Drive1PresentAccessor_28.Value |> expr($1 == 3 ? $2 : $3)",\r
            "@Default": {\r
                "Presence": 255\r
            },\r
            "LocateLed": "<=/HddBackplane_1.Slot; <=/Scanner_Drive1LocateAccessor_26.Value; <=/Scanner_Drive1LocateAccessor_28.Value |> expr($1 == 3 ? $2 : $3)",\r
            "FaultLed": "<=/HddBackplane_1.Slot; <=/Scanner_Drive1FalutAccessor_26.Value; <=/Scanner_Drive1FalutAccessor_28.Value |> expr($1 == 3 ? $2 : $3)",\r
            "SetLocateLed": "#/Accessor_Drive1LocateAccessor.Value",\r
            "SetFaultLed": "#/Accessor_Drive1FaultAccessor.Value",\r
            "ActivationLed": "<=/HddBackplane_1.Slot; <=/Scanner_Drive1ActivationAccessor_26.Value; <=/Scanner_Drive1ActivationAccessor_28.Value |> expr($1 == 3 ? $2 : $3)",\r
            "TemperatureCelsius": 255,\r
            "Missing": 0,\r
            "Health": "<=/Component_Drive1.Health",\r
            "RebuildState": 0,\r
            "FirmwareStatus": 255,\r
            "PredictiveFailure": 0,\r
            "InAFailedArray": 0,\r
            "FirmwareStatusError": false,\r
            "SerialNumber": "",\r
            "RelativeSlot": 1,\r
            "HddBackplaneStartSlot": "<=/HddBackplane_1.StartSlot",\r
            "IODeteriorationHealthCode": 0\r
        },\r
        "DiscreteSensor_Disk1": {\r
            "AssertMask": 199,\r
            "DeassertMask": 199,\r
            "DiscreteMask": 199\r
        },\r
        "PcieAddrInfo_SAS_1": {\r
            "Location": "HddBackplane\${Slot}",\r
            "ComponentType": 71,\r
            "ControllerIndex": 0,\r
            "ControllerType": 2,\r
            "ContainerSlot": "\${Slot}",\r
            "GroupPosition": "PcieAddrInfo_SAS_1_\${GroupPosition}",\r
            "ContainerUID": "00000001030302023930",\r
            "ContainerUnitType": "SEU SAS",\r
            "SocketID": 1,\r
            "SlotID": "\${Slot} |> expr($1 == 3 ? 40 : 42)",\r
            "PortID": "\${Slot} |> expr($1 == 3 ? 14 : 12)",\r
            "Bus": 50,\r
            "Device": 4,\r
            "Function": 0\r
        },\r
        "PcieAddrInfo_SAS_2": {\r
            "Location": "HddBackplane\${Slot}",\r
            "ComponentType": 71,\r
            "ControllerIndex": 0,\r
            "ControllerType": 2,\r
            "ContainerSlot": "\${Slot}",\r
            "GroupPosition": "PcieAddrInfo_SAS_2_\${GroupPosition}",\r
            "ContainerUID": "00000001030302023930",\r
            "ContainerUnitType": "SEU SAS",\r
            "SocketID": 1,\r
            "SlotID": "\${Slot} |> expr($1 == 3 ? 41 : 43)",\r
            "PortID": "\${Slot} |> expr($1 == 3 ? 15 : 13)",\r
            "Bus": 50,\r
            "Device": 4,\r
            "Function": 0\r
        },\r
        "BusinessConnector_SAS_1": {\r
            "Name": "Down_1",\r
            "Direction": "Downstream",\r
            "Slot": 1,\r
            "LinkWidth": "X1",\r
            "MaxLinkRate": "PCIe4.0",\r
            "ConnectorType": "SAS",\r
            "UpstreamResources": [\r
              {\r
                "Name": "Up_SAS_1",\r
                "ID": 255,\r
                "Offset": 0,\r
                "Width": 1\r
              }\r
            ],\r
            "RefPCIeAddrInfo": "#/PcieAddrInfo_SAS_1"\r
        },\r
        "BusinessConnector_SAS_2": {\r
            "Name": "Down_2",\r
            "Direction": "Downstream",\r
            "Slot": 2,\r
            "LinkWidth": "X1",\r
            "MaxLinkRate": "PCIe4.0",\r
            "ConnectorType": "SAS",\r
            "UpstreamResources": [\r
              {\r
                "Name": "Up_SAS_1",\r
                "ID": 255,\r
                "Offset": 1,\r
                "Width": 1\r
              }\r
            ],\r
            "RefPCIeAddrInfo": "#/PcieAddrInfo_SAS_2"\r
        },\r
        "BusinessConnector_SAS_9": {\r
            "Name": "Up_SAS_1",\r
            "Direction": "Upstream",\r
            "Slot": 1,\r
            "LinkWidth": "X8",\r
            "MaxLinkRate": "PCIe4.0",\r
            "ConnectorType": "UBC",\r
            "Ports": [\r
              {\r
                "Name": "Port1",\r
                "ID": 113,\r
                "Offset": 0,\r
                "Width": 1\r
              },\r
              {\r
                "Name": "Port2",\r
                "ID": 113,\r
                "Offset": 1,\r
                "Width": 1\r
              }\r
            ]\r
        },\r
        "Event_Disk0Missing": {\r
            "EventKeyId": "Disk.DiskMissing",\r
            "Condition": 2\r
        },\r
        "Event_Disk1Missing": {\r
            "EventKeyId": "Disk.DiskMissing",\r
            "Condition": 2\r
        },\r
        "Event_Hdd1Insert": {\r
            "EventKeyId": "Hdd.DiskInstalled",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Hdd2Insert": {\r
            "EventKeyId": "Hdd.DiskInstalled",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Hdd1Removed": {\r
            "EventKeyId": "Hdd.DiskRemoved",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 0\r
        },\r
        "Event_Hdd2Removed": {\r
            "EventKeyId": "Hdd.DiskRemoved",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 0\r
        },\r
        "Event_Disk1LocatErr": {\r
            "EventKeyId": "Disk.DiskLocateError",\r
            "Condition": 1\r
        },\r
        "Event_Disk2LocatErr": {\r
            "EventKeyId": "Disk.DiskLocateError",\r
            "Condition": 1\r
        },\r
        "Event_Hdd1FailedArray": {\r
            "EventKeyId": "Disk.DiskRAIDArrayInvalid",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Hdd2FailedArray": {\r
            "EventKeyId": "Disk.DiskRAIDArrayInvalid",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Hdd1PredicFail": {\r
            "EventKeyId": "Disk.DiskPredictiveFailure",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Hdd2PredicFail": {\r
            "EventKeyId": "Disk.DiskPredictiveFailure",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Disk1Foreign": {\r
            "EventKeyId": "Disk.DiskStateForeign",\r
            "Condition": 12\r
        },\r
        "Event_Disk2Foreign": {\r
            "EventKeyId": "Disk.DiskStateForeign",\r
            "Condition": 12\r
        },\r
        "Event_Hdd1MdWroutLow": {\r
            "EventKeyId": "Disk.DiskRemMediaWearoutLow",\r
            "Condition": "<=/::StorageSetting_0.SSDMediaLifeLeftPercentThreshold",\r
            "@Default": {\r
                "Reading": 255,\r
                "Condition": 5\r
            }\r
        },\r
        "Event_Hdd2MdWroutLow": {\r
            "EventKeyId": "Disk.DiskRemMediaWearoutLow",\r
            "Condition": "<=/::StorageSetting_0.SSDMediaLifeLeftPercentThreshold",\r
            "@Default": {\r
                "Reading": 255,\r
                "Condition": 5\r
            }\r
        },\r
        "Event_Drive1RebuildStart": {\r
            "EventKeyId": "Disk.DiskRAIDRebuildStart",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Drive1RebuildEnd": {\r
            "EventKeyId": "Disk.DiskRAIDRebuildStop",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 0\r
        },\r
        "Event_Drive2RebuildStart": {\r
            "EventKeyId": "Disk.DiskRAIDRebuildStart",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Drive2RebuildEnd": {\r
            "EventKeyId": "Disk.DiskRAIDRebuildStop",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 0\r
        },\r
        "Event_Disk1StatErr": {\r
            "EventKeyId": "Disk.DiskStateAbnormal",\r
            "Condition": 1\r
        },\r
        "Event_Disk2StatErr": {\r
            "EventKeyId": "Disk.DiskStateAbnormal",\r
            "Condition": 1\r
        },\r
        "Event_Disk1Fail": {\r
            "EventKeyId": "Disk.DiskFault",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Disk2Fail": {\r
            "EventKeyId": "Disk.DiskFault",\r
            "LedFaultCode": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('H%s',$1)",\r
            "Condition": 1\r
        },\r
        "Event_Disk1ReplaceMntr": {\r
            "EventKeyId": "Disk.DiskReplaced",\r
            "Condition": 1\r
        },\r
        "Event_Disk2ReplaceMntr": {\r
            "EventKeyId": "Disk.DiskReplaced",\r
            "Condition": 1\r
        },\r
        "MidAvg_HddBpTemp": {\r
            "WindowSize": 4,\r
            "DefaultValue": 20,\r
            "IsSigned": true\r
        },\r
        "Scanner_HddBPTemp_1": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 4356,\r
            "Size": 1,\r
            "Type": 0,\r
            "Mask": 255,\r
            "Period": 1000,\r
            "Debounce": "#/MidAvg_HddBpTemp",\r
            "Value": 0\r
        },\r
        "Scanner_HddBPTemp_2": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 4358,\r
            "Size": 1,\r
            "Type": 0,\r
            "Mask": 255,\r
            "Period": 1000,\r
            "Debounce": "#/MidAvg_HddBpTemp",\r
            "Value": 0\r
        },\r
        "ThresholdSensor_HddBpTemp": {\r
            "M": 100,\r
            "RBExp": 224\r
        },\r
        "CoolingRequirement_1_62": {\r
            "RequirementId": "\${Slot} |> expr((62 << 8) | $1)",\r
            "MonitoringStatus": "<=/ThresholdSensor_HddBpTemp.Reading |> expr($1 >= 255 ? 1 : 0)",\r
            "MonitoringValue": "<=/ThresholdSensor_HddBpTemp.Reading",\r
            "FailedValue": 80,\r
            "TargetTemperatureCelsius": 41,\r
            "MaxAllowedTemperatureCelsius": 58,\r
            "TargetTemperatureRangeCelsius": [],\r
            "ThresholdValue": [],\r
            "AlarmSpeed": [],\r
            "Enabled": "<=/Drive_1.TemperatureCelsius;<=/Drive_2.TemperatureCelsius |> expr($1 + $2 >= 510 ? 1 : 0)",\r
            "SensorName": "#/ThresholdSensor_HddBpTemp.SensorName"\r
        },\r
        "Event_HddBkpReplaceMntr": {\r
            "EventKeyId": "Hdd.HddBackplaneReplace",\r
            "Condition": 1\r
        },\r
        "Event_HardDisk1IOPerformanceDeterioration": {\r
            "EventKeyId": "Disk.HardDiskIOPerformanceDeterioration",\r
            "Condition": 1\r
        },\r
        "Event_HardDisk2IOPerformanceDeterioration": {\r
            "EventKeyId": "Disk.HardDiskIOPerformanceDeterioration",\r
            "Condition": 1\r
        },\r
        "HddBackplane_1": {\r
            "Slot": "\${Slot}",\r
            "UID": "00000001030302023930",\r
            "Name": "BC83HBBE",\r
            "Manufacturer": "Huawei",\r
            "Type": "SEU",\r
            "Description": "2*2.5 SAS/SATA, Rear",\r
            "PartNumber": "0302023930",\r
            "LogicVersion": "N/A",\r
            "LogicUnit": 0,\r
            "PcbVersion": "",\r
            "BoardID": 65535,\r
            "BoardType": "HddBackplane",\r
            "Number": 1,\r
            "DeviceName": "DiskBP\${Slot}",\r
            "Position": "SEU\${Slot}Rear",\r
            "NodeId": "SEU\${Slot}DiskBP\${Slot}",\r
            "RefSMCChip": "#/Smc_EnclSMC",\r
            "FruID": 0,\r
            "Container": "\${Container}",\r
            "SerialNumber": "",\r
            "RefComponent": "#/Component_HddBackplane",\r
            "StartSlot": "\${Slot} |> expr($1 == 3 ? 40 : 42)"\r
        },\r
        "SmcDfxInfo_SEU": {\r
            "Chip": "#/Smc_EnclSMC",\r
            "Offset": 7424,\r
            "Size": 127,\r
            "Period": 2000,\r
            "SmcVersion": 113,\r
            "Config": {\r
                "7": {"inbp0_lm75_data_high": 255},\r
                "9": {"inbp1_lm75_data_high": 255},\r
                "59": {"disk_rst_24": 32, "bmc_set_disk_rst_24": 16, "pg_hdd_pwr_24": 8, "disk_type_24": 2, "disk_prsnt_24": 1},\r
                "60": {"disk_active_24": 48, "disk_locate_24": 12, "disk_fault_24": 3},\r
                "61": {"disk_rst_25": 32, "bmc_set_disk_rst_25": 16, "pg_hdd_pwr_25": 8, "disk_type_25": 2, "disk_prsnt_25": 1},\r
                "62": {"disk_active_25": 48, "disk_locate_25": 12, "disk_fault_25": 3},\r
                "63": {"disk_rst_26": 32, "bmc_set_disk_rst_26": 16, "pg_hdd_pwr_26": 8, "disk_type_26": 2, "disk_prsnt_26": 1},\r
                "64": {"disk_active_26": 48, "disk_locate_26": 12, "disk_fault_26": 3},\r
                "65": {"disk_rst_27": 32, "bmc_set_disk_rst_27": 16, "pg_hdd_pwr_27": 8, "disk_type_27": 2, "disk_prsnt_27": 1},\r
                "66": {"disk_active_27": 48, "disk_locate_27": 12, "disk_fault_27": 3}\r
            },\r
            "Mapping": {\r
                "Scanner_Drive0PresentAccessor_25": {"Value": "expr($disk_prsnt_24)"},\r
                "Scanner_Drive0PresentAccessor_27": {"Value": "expr($disk_prsnt_26)"},\r
                "Scanner_Drive0LocateAccessor_25": {"Value": "expr($disk_locate_24)"},\r
                "Scanner_Drive0LocateAccessor_27": {"Value": "expr($disk_locate_26)"},\r
                "Scanner_Drive0FalutAccessor_25": {"Value": "expr($disk_fault_24)"},\r
                "Scanner_Drive0FalutAccessor_27": {"Value": "expr($disk_fault_26)"},\r
                "Scanner_Drive0ActivationAccessor_25": {"Value": "expr($disk_active_24)"},\r
                "Scanner_Drive0ActivationAccessor_27": {"Value": "expr($disk_active_26)"},\r
                "Scanner_Drive1PresentAccessor_26": {"Value": "expr($disk_prsnt_25)"},\r
                "Scanner_Drive1PresentAccessor_28": {"Value": "expr($disk_prsnt_27)"},\r
                "Scanner_Drive1LocateAccessor_26": {"Value": "expr($disk_locate_25)"},\r
                "Scanner_Drive1LocateAccessor_28": {"Value": "expr($disk_locate_27)"},\r
                "Scanner_Drive1FalutAccessor_26": {"Value": "expr($disk_fault_25)"},\r
                "Scanner_Drive1FalutAccessor_28": {"Value": "expr($disk_fault_27)"},\r
                "Scanner_Drive1ActivationAccessor_26": {"Value": "expr($disk_active_25)"},\r
                "Scanner_Drive1ActivationAccessor_28": {"Value": "expr($disk_active_27)"},\r
                "Scanner_HddBPTemp_1": {"Value": "expr($inbp0_lm75_data_high)"},\r
                "Scanner_HddBPTemp_2": {"Value": "expr($inbp1_lm75_data_high)"}\r
            }\r
        }\r
    }\r
}`,SI=`{\r
    "FormatVersion": "3.00",\r
    "DataVersion": "3.00",\r
    "Unit": {\r
        "Type": "SEU",\r
        "Name": "HddBackplane_1"\r
    },\r
    "Objects": {\r
        "Component_Drive0": {\r
            "FruId": 255,\r
            "Instance": 255,\r
            "Type": 2,\r
            "Name": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('Disk%s',$1)",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "NodeId": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('Disk%s',$1)",\r
            "ReplaceFlag": 0,\r
            "PreviousSN": "",\r
            "SerialNumber": "<=/Drive_1.SerialNumber",\r
            "Manufacturer": "<=/Drive_1.Manufacturer"\r
        },\r
        "Component_Drive1": {\r
            "FruId": 255,\r
            "Instance": 255,\r
            "Type": 2,\r
            "Name": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('Disk%s',$1)",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "NodeId": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('Disk%s',$1)",\r
            "ReplaceFlag": 0,\r
            "PreviousSN": "",\r
            "SerialNumber": "<=/Drive_2.SerialNumber",\r
            "Manufacturer": "<=/Drive_2.Manufacturer"\r
        },\r
        "Component_HddBackplane": {\r
            "FruId": 255,\r
            "Instance": "\${Slot}",\r
            "Type": 5,\r
            "Location": "<=/HddBackplane_1.Position",\r
            "Name": "<=/HddBackplane_1.DeviceName",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "GroupId": 1,\r
            "UniqueId": "00000001030302023930",\r
            "ReplaceFlag": 0,\r
            "PreviousSN": "",\r
            "SerialNumber": "<=/HddBackplane_1.SerialNumber",\r
            "NodeId": "<=/HddBackplane_1.Position;<=/HddBackplane_1.DeviceName |> string.format('%s%s',$1,$2)"\r
        },\r
        "ThresholdSensor_HddBpTemp": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_InnerHddCard.Id",\r
            "EntityInstance": "<=/Entity_InnerHddCard.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 1,\r
            "ReadingType": 1,\r
            "SensorName": "Disk BP\${Slot} Temp",\r
            "Unit": 128,\r
            "BaseUnit": 1,\r
            "Analog": 1,\r
            "NominalReading": 25,\r
            "MaximumReading": 127,\r
            "MinimumReading": 128,\r
            "Reading": "<=/HddBackplane_1.Slot;<=/Scanner_HddBPTemp_1.Value;<=/Scanner_HddBPTemp_2.Value |> expr($1 == 3 ? $2 : $3)",\r
            "ReadingStatus": "<=/HddBackplane_1.Slot;<=/Scanner_HddBPTemp_1.Status;<=/Scanner_HddBPTemp_2.Status |> expr($1 == 3 ? $2 : $3)"\r
        },\r
        "DiscreteSensor_Disk0": {\r
            "EntityId": "<=/Entity_Disk0.Id",\r
            "EntityInstance": "<=/Entity_Disk0.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 192,\r
            "SensorType": 13,\r
            "ReadingType": 111,\r
            "SensorName": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('DISK%s',$1)",\r
            "DiscreteType": 0,\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteSensor_Disk1": {\r
            "EntityId": "<=/Entity_Disk1.Id",\r
            "EntityInstance": "<=/Entity_Disk1.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 192,\r
            "SensorType": 13,\r
            "ReadingType": 111,\r
            "SensorName": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('DISK%s',$1)",\r
            "DiscreteType": 0,\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteEvent_Disk0Presence": {\r
            "Property": "<=/Drive_1.Presence",\r
            "ListenType": 1,\r
            "EventData1": 0,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Drive_1.Presence",\r
            "Conversion": 0,\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 255,\r
            "SensorObject": "#/DiscreteSensor_Disk0"\r
        },\r
        "DiscreteEvent_Disk0Fault": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 1,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Drive_1.CapacityError;<=/Drive_1.Failure |> expr((($1 ? 1 : 0) + ($2 ? 1 : 0)) != 0 ? 1 : 0)",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_Disk0"\r
        },\r
        "DiscreteEvent_Disk0FaildedArray": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 6,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Drive_1.InAFailedArray",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_Disk0"\r
        },\r
        "DiscreteEvent_Disk1Presence": {\r
            "Property": "<=/Drive_2.Presence",\r
            "ListenType": 1,\r
            "EventData1": 0,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Drive_2.Presence",\r
            "Conversion": 0,\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 255,\r
            "SensorObject": "#/DiscreteSensor_Disk1"\r
        },\r
        "DiscreteEvent_Disk1Fault": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 1,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Drive_2.CapacityError;<=/Drive_2.Failure |> expr((($1 ? 1 : 0) + ($2 ? 1 : 0)) != 0 ? 1 : 0)",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_Disk1"\r
        },\r
        "DiscreteEvent_Disk1FaildedArray": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 6,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/Drive_2.InAFailedArray",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_Disk1"\r
        },\r
        "Entity_Disk0": {\r
            "Id": 4,\r
            "Instance": 96,\r
            "Name": "\${Slot} |> expr($1 == 3 ? 40 : 42) |> string.format('Disk%s',$1)",\r
            "PowerState": 1,\r
            "Presence": 1\r
        },\r
        "Entity_Disk1": {\r
            "Id": 4,\r
            "Instance": 97,\r
            "Name": "\${Slot} |> expr($1 == 3 ? 41 : 43) |> string.format('Disk%s',$1)",\r
            "PowerState": 1,\r
            "Presence": 1\r
        },\r
        "Entity_InnerHddCard": {\r
            "Id": 11,\r
            "Name": "InnerHddCard\${Slot}",\r
            "PowerState": 1,\r
            "Presence": 1,\r
            "Instance": 112\r
        },\r
        "Event_Disk0Missing": {\r
            "Reading": "<=/Drive_1.Missing",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Disk1Missing": {\r
            "Reading": "<=/Drive_2.Missing",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Hdd1Insert": {\r
            "Reading": "<=/Drive_1.Presence",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 7,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Hdd2Insert": {\r
            "Reading": "<=/Drive_2.Presence",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 7,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Hdd1Removed": {\r
            "Reading": "<=/Drive_1.Presence",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Hdd2Removed": {\r
            "Reading": "<=/Drive_2.Presence",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Disk1LocatErr": {\r
            "Reading": "<=/Drive_1.Missing",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Disk2LocatErr": {\r
            "Reading": "<=/Drive_2.Missing",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Hdd1FailedArray": {\r
            "Reading": "<=/Drive_1.InAFailedArray",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Hdd2FailedArray": {\r
            "Reading": "<=/Drive_2.InAFailedArray",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Hdd1PredicFail": {\r
            "Reading": "<=/Drive_1.PredictiveFailure",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Hdd2PredicFail": {\r
            "Reading": "<=/Drive_2.PredictiveFailure",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Disk1Foreign": {\r
            "Reading": "<=/Drive_1.FirmwareStatus",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Disk2Foreign": {\r
            "Reading": "<=/Drive_2.FirmwareStatus",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Hdd1MdWroutLow": {\r
            "Reading": "<=/Drive_1.PredictedMediaLifeLeftPercent",\r
            "OperatorId": 1,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "DescArg3": "#/Event_Hdd1MdWroutLow.Reading",\r
            "DescArg4": "#/Event_Hdd1MdWroutLow.Condition",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Hdd2MdWroutLow": {\r
            "Reading": "<=/Drive_2.PredictedMediaLifeLeftPercent",\r
            "OperatorId": 1,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "DescArg3": "#/Event_Hdd2MdWroutLow.Reading",\r
            "DescArg4": "#/Event_Hdd2MdWroutLow.Condition",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Drive1RebuildStart": {\r
            "Reading": "<=/Drive_1.RebuildState",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 7,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Drive1RebuildEnd": {\r
            "Reading": "<=/Drive_1.RebuildState",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Drive2RebuildStart": {\r
            "Reading": "<=/Drive_2.RebuildState",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 7,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Drive2RebuildEnd": {\r
            "Reading": "<=/Drive_2.RebuildState",\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "OperatorId": 8,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Disk1StatErr": {\r
            "Reading": "<=/Drive_1.FirmwareStatus;<=/Drive_1.FirmwareStatusError |> expr($2 ? 1 : (($1 == 1 || $1 == 3 || $1 == 4 || $1 == 22) ? 1 : 0))",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Disk2StatErr": {\r
            "Reading": "<=/Drive_2.FirmwareStatus;<=/Drive_2.FirmwareStatusError |> expr($2 ? 1 : (($1 == 1 || $1 == 3 || $1 == 4 || $1 == 22) ? 1 : 0))",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Disk1Fail": {\r
            "Reading": "<=/Drive_1.CapacityError;<=/Drive_1.Failure |> expr((($1 ? 1 : 0) + ($2 ? 1 : 0)) != 0 ? 1 : 0)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Disk2Fail": {\r
            "Reading": "<=/Drive_2.CapacityError;<=/Drive_2.Failure |> expr((($1 ? 1 : 0) + ($2 ? 1 : 0)) != 0 ? 1 : 0)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_Disk1ReplaceMntr": {\r
            "Reading": "<=/Component_Drive0.ReplaceFlag",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "DescArg3": "#/Component_Drive0.PreviousSN",\r
            "DescArg4": "#/Component_Drive0.SerialNumber",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_Disk2ReplaceMntr": {\r
            "Reading": "<=/Component_Drive1.ReplaceFlag",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "DescArg3": "#/Component_Drive1.PreviousSN",\r
            "DescArg4": "#/Component_Drive1.SerialNumber",\r
            "Component": "#/Component_Drive1"\r
        },\r
        "Event_HddBkpReplaceMntr": {\r
            "Reading": "<=/Component_HddBackplane.ReplaceFlag",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg1": "#/Component_HddBackplane.Instance",\r
            "DescArg2": "#/Component_HddBackplane.PreviousSN",\r
            "DescArg3": "#/Component_HddBackplane.SerialNumber",\r
            "Component": "#/Component_HddBackplane"\r
        },\r
        "Event_HardDisk1IOPerformanceDeterioration": {\r
            "Reading": "<=/Drive_1.Presence;<=/Drive_1.IODeteriorationHealthCode |> expr((($1 == 1) && ($2 == 1)) ? 1 : 0)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive0.Name",\r
            "Component": "#/Component_Drive0"\r
        },\r
        "Event_HardDisk2IOPerformanceDeterioration": {\r
            "Reading": "<=/Drive_2.Presence;<=/Drive_2.IODeteriorationHealthCode |> expr((($1 == 1) && ($2 == 1)) ? 1 : 0)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "DescArg2": "#/Component_Drive1.Name",\r
            "Component": "#/Component_Drive1"\r
        }\r
    }\r
}`,bI=`{\r
    "FormatVersion": "3.00",\r
    "DataVersion": "3.00",\r
    "Unit": {\r
        "Type": "PSU",\r
        "Name": "OnePower_0"\r
    },\r
    "ManagementTopology": {\r
        "Anchor": {\r
            "Buses": [\r
                "I2c_2"\r
            ]\r
        },\r
        "I2c_2": {\r
            "Chips": [\r
                "Smc_ExpBoardSMC"\r
            ]\r
        }\r
    },\r
    "Objects": {\r
        "OnePower_0": {\r
            "SlotNumber": "\${Slot}",\r
            "Presence": 1,\r
            "Protocol": "pmbus",\r
            "PhysicalInterface": "pmbus",\r
            "DeviceLocator": "PSU\${Slot}",\r
            "Position": "EXU",\r
            "EnvTemperatureCelsius": 0,\r
            "SerialNumber": "",\r
            "OutputState": "<=/Scanner_PsuOPOKStatus.Value",\r
            "InputState": "<=/Scanner_PsuIPOKStatus.Value",\r
            "DeepSleepEnabled": 0,\r
            "OutputPowerWatts": 0,\r
            "InputVoltageFault": 32768,\r
            "OutputVoltageFault": 0,\r
            "OutputCurrentFault": 0,\r
            "FanFault": 0,\r
            "Fan1Fault": 0,\r
            "Fan2Fault": 0,\r
            "Failure": 0,\r
            "OverTemperature": 0,\r
            "LossOfInput": 255,\r
            "RefFrudata": "#/FruData_Ps",\r
            "PartNumber": "",\r
            "InputCurrentAmps": 0,\r
            "OutputCurrentAmps": 0,\r
            "InputVoltageStatus": 0,\r
            "SourceType": 1\r
        },\r
        "Scanner_PsuOPOKStatus": {\r
            "Chip": "#/Smc_ExpBoardSMC",\r
            "Offset": 603981056,\r
            "Size": 2,\r
            "Mask": "\${Slot} |> expr($1 == 1 ? 4 : 1024)",\r
            "Type": 0,\r
            "Value": 0,\r
            "Period": 2000,\r
            "Debounce": "#/ContBin_OPOK"\r
        },\r
        "ContBin_OPOK": {\r
            "NumH": 1,\r
	        "NumL": 15,\r
            "DefaultValue": 1\r
        },\r
        "Scanner_PsuIPOKStatus": {\r
            "Chip": "#/Smc_ExpBoardSMC",\r
            "Offset": 603981056,\r
            "Size": "\${Slot}",\r
            "Mask": "\${Slot} |> expr(8 << (8*($1 - 1)))", \r
            "Type": 0,\r
            "Value": 0,\r
            "Period": 1000,\r
            "Debounce": "#/ContBin_IPOK"\r
        },\r
        "ContBin_IPOK": {\r
            "NumH": 5,\r
	        "NumL": 1,\r
            "DefaultValue": 0\r
        },\r
        "Scanner_PowerGood": {\r
            "Chip": "#/Smc_ExpBoardSMC",\r
            "Offset": 469765888,\r
            "Size": 1,\r
            "Mask": 255,\r
            "Type": 0,\r
            "Period": 100,\r
            "Debounce": "None",\r
            "Value": 0\r
        },\r
        "Smc_ExpBoardSMC": {\r
            "Address": 96,\r
            "AddrWidth": 1,\r
            "OffsetWidth": 1,\r
            "WriteTmout": 0,\r
            "ReadTmout": 0\r
        },\r
        "CoolingRequirement_1_125": {\r
            "RequirementId": "\${Slot} |> expr((125 << 8) | $1)",\r
            "MonitoringStatus": "<=/OnePower_0.EnvTemperatureCelsius |> expr($1 >= 255 ? 1 : 0)",\r
            "MonitoringValue": "<=/OnePower_0.EnvTemperatureCelsius",\r
            "FailedValue": 0,\r
            "TargetTemperatureCelsius": 52,\r
            "MaxAllowedTemperatureCelsius": 57,\r
            "TargetTemperatureRangeCelsius": [],\r
            "ThresholdValue": [],\r
            "AlarmSpeed": [],\r
            "SmartCoolingTargetTemperature": [],\r
            "CustomSupported": false,\r
            "CustomTargetTemperatureCelsius": 255,\r
            "Enabled": "<=/OnePower_0.Rate |> expr($1 >= 3000 ? true : false)",\r
            "SensorName": "#/ThresholdSensor_PsuInletTemp.SensorName"\r
        },\r
        "CoolingRequirement_1": {\r
            "RequirementId": "\${Slot} |> expr((25 << 8) | $1)",\r
            "MonitoringStatus": "<=/OnePower_0.EnvTemperatureCelsius |> expr($1 >= 255 ? 1 : 0)",\r
            "MonitoringValue": "<=/OnePower_0.EnvTemperatureCelsius",\r
            "FailedValue": 0,\r
            "TargetTemperatureCelsius": 55,\r
            "MaxAllowedTemperatureCelsius": 60,\r
            "TargetTemperatureRangeCelsius": [],\r
            "ThresholdValue": [],\r
            "AlarmSpeed": [],\r
            "SmartCoolingTargetTemperature": [],\r
            "CustomSupported": false,\r
            "CustomTargetTemperatureCelsius": 255,\r
            "Enabled": "<=/OnePower_0.Rate |> expr($1 < 3000 ? true : false)",\r
            "SensorName": "#/ThresholdSensor_PsuInletTemp.SensorName"\r
        },\r
        "Fru_Ps": {\r
            "PcbId": 254,\r
            "FruId": 1,\r
            "FruName": "PSU\${Slot}",\r
            "ConnectorGroupId": "\${GroupId}",\r
            "BoardId": 65535\r
        },\r
        "Event_PSUPoorContactMinor": {\r
            "EventKeyId": "PSU.PoorContactMinor",\r
            "Condition": 1,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_PSFailure": {\r
            "EventKeyId": "PSU.PSUFault",\r
            "Condition": 1,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_InnerCommFault": {\r
            "EventKeyId": "PSU.PSUHealthStatusMajorAlarm",\r
            "Condition": 2,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_RegisterFault": {\r
            "EventKeyId": "PSU.PSUHealthStatusMajorAlarm",\r
            "Condition": 16,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_PhaseLossFault": {\r
            "EventKeyId": "PSU.PSUHealthStatusMajorAlarm",\r
            "Condition": 8,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_VinUvFault": {\r
            "EventKeyId": "PSU.PSUInputLost",\r
            "Condition": 16,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_PSFanFault": {\r
            "EventKeyId": "PSU.PSUFanFault",\r
            "Condition": 1,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_VoutOvFault": {\r
            "EventKeyId": "PSU.PSUOutputOverVoltage",\r
            "Condition": 128,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_VoutUvFault": {\r
            "EventKeyId": "PSU.PSUOutputLowerVoltage",\r
            "Condition": 16,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_IoutOcFault": {\r
            "EventKeyId": "PSU.PSUOutputOverCurrent",\r
            "Condition": 128,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_VinOvFault": {\r
            "EventKeyId": "PSU.PSUInputOverVoltage",\r
            "Condition": 128,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_VinUvWarning": {\r
            "EventKeyId": "PSU.PSUVinUvWarning",\r
            "Condition": 32\r
        },\r
        "Event_VoutOvWarning": {\r
            "EventKeyId": "PSU.PSUVoutOvWarning",\r
            "Condition": 64\r
        },\r
        "Event_VoutUvWarning": {\r
            "EventKeyId": "PSU.PSUVoutUvWarning",\r
            "Condition": 32\r
        },\r
        "Event_IoutOcWarning": {\r
            "EventKeyId": "PSU.PSUIoutOcWarning",\r
            "Condition": 32\r
        },\r
        "Event_VinOvWarning": {\r
            "EventKeyId": "PSU.PSUVinOvWarning",\r
            "Condition": 64\r
        },\r
        "Event_Fan1Warning": {\r
            "EventKeyId": "PSU.PSUFan1Warning",\r
            "Condition": 32\r
        },\r
        "Event_PSOverTemp": {\r
            "EventKeyId": "PSU.PSUOverTemp",\r
            "Condition": 128,\r
            "LedFaultCode": "P$$"\r
        },\r
        "Event_OtWarning": {\r
            "EventKeyId": "PSU.PSUOtWarning",\r
            "Condition": 64\r
        },\r
        "Event_PowerSupplyGetFail": {\r
            "EventKeyId": "PSU.PSUCommunicationFailure",\r
            "Condition": 1,\r
            "LedFaultCode": "P$$"\r
        },\r
        "DiscreteSensor_PsStatus": {\r
            "AssertMask": 79,\r
            "DeassertMask": 79,\r
            "DiscreteMask": 79\r
        },\r
        "DiscreteSensor_PsTempStatus": {\r
            "AssertMask": 1,\r
            "DeassertMask": 1,\r
            "DiscreteMask": 1\r
        },\r
        "Event_PSUReplaceMntr": {\r
            "EventKeyId": "PSU.PSUReplace",\r
            "Condition": 1\r
        },\r
        "ThresholdSensor_PsuInputPower": {\r
            "M": 0\r
        },\r
        "ThresholdSensor_PsuOutputPower": {\r
            "M": 0\r
        },\r
        "ThresholdSensor_PsuInletTemp": {\r
            "M": 1\r
        },\r
        "ThresholdSensor_PsuCoreTemp": {\r
            "M": 1\r
        },\r
        "ThresholdSensor_PsuVin": {\r
            "M": 2\r
        },\r
        "ThresholdSensor_PsuIin": {\r
            "M": 1\r
        },\r
        "ThresholdSensor_PsuIout": {\r
            "M": 1\r
        },\r
        "PowerOutputEfficiencyCurve_1": {\r
            "Position": "",\r
            "PartNumber": "02314FNU",\r
            "InputVoltage": 220,\r
            "LoadPercentRange": [\r
                5, \r
                10,\r
                15,\r
                20,\r
                25,\r
                30,\r
                40,\r
                45,\r
                50,\r
                60,\r
                70,\r
                80,\r
                90,\r
                100\r
            ],\r
            "EfficiencyCurve": [\r
                0.89407,\r
                0.92802,\r
                0.93930,\r
                0.94252,\r
                0.94390,\r
                0.94377,\r
                0.94598,\r
                0.94570,\r
                0.94603,\r
                0.94238,\r
                0.93872,\r
                0.93370,\r
                0.93044,\r
                0.92673\r
            ]\r
        },\r
        "PowerOutputEfficiencyCurve_2": {\r
            "Position": "",\r
            "PartNumber": "02314FNU",\r
            "InputVoltage": 240,\r
            "LoadPercentRange": [\r
                5, \r
                10,\r
                15,\r
                20,\r
                25,\r
                30,\r
                40,\r
                45,\r
                50,\r
                60,\r
                70,\r
                80,\r
                90,\r
                100\r
            ],\r
            "EfficiencyCurve": [\r
                0.89395,\r
                0.92456,\r
                0.93463,\r
                0.94220,\r
                0.94247,\r
                0.94273,\r
                0.94615,\r
                0.94683,\r
                0.94630,\r
                0.94395,\r
                0.94082,\r
                0.93665,\r
                0.93329,\r
                0.93058\r
            ]\r
        },\r
        "PowerOutputEfficiencyCurve_3": {\r
            "Position": "",\r
            "PartNumber": "02314GWA",\r
            "InputVoltage": 220,\r
            "LoadPercentRange": [\r
                5, \r
                10,\r
                15,\r
                20,\r
                25,\r
                30,\r
                40,\r
                45,\r
                50,\r
                60,\r
                70,\r
                80,\r
                90,\r
                100\r
            ],\r
            "EfficiencyCurve": [\r
                0.83988,\r
                0.90963,\r
                0.93307,\r
                0.94494,\r
                0.94956,\r
                0.95244,\r
                0.95708,\r
                0.95769,\r
                0.96005,\r
                0.95511,\r
                0.95145,\r
                0.94899,\r
                0.94628,\r
                0.94276\r
            ]\r
        },\r
        "PowerOutputEfficiencyCurve_4": {\r
            "Position": "",\r
            "PartNumber": "02314GWA",\r
            "InputVoltage": 230,\r
            "LoadPercentRange": [\r
                5, \r
                10,\r
                15,\r
                20,\r
                25,\r
                30,\r
                40,\r
                45,\r
                50,\r
                60,\r
                70,\r
                80,\r
                90,\r
                100\r
            ],\r
            "EfficiencyCurve": [\r
                0.83988,\r
                0.90963,\r
                0.93307,\r
                0.94494,\r
                0.94956,\r
                0.95244,\r
                0.95708,\r
                0.95769,\r
                0.96005,\r
                0.95511,\r
                0.95145,\r
                0.94899,\r
                0.94628,\r
                0.94276\r
            ]\r
        },\r
        "PowerOutputEfficiencyCurve_5": {\r
            "Position": "",\r
            "PartNumber": "02314GWA",\r
            "InputVoltage": 240,\r
            "LoadPercentRange": [\r
                5, \r
                10,\r
                15,\r
                20,\r
                25,\r
                30,\r
                40,\r
                45,\r
                50,\r
                60,\r
                70,\r
                80,\r
                90,\r
                100\r
            ],\r
            "EfficiencyCurve": [\r
                0.81481,\r
                0.89454,\r
                0.92341,\r
                0.94016,\r
                0.94821,\r
                0.95293,\r
                0.95726,\r
                0.95762,\r
                0.95741,\r
                0.95487,\r
                0.95411,\r
                0.95117,\r
                0.94794,\r
                0.94417\r
            ]\r
        },\r
        "PowerOutputEfficiencyCurve_6": {\r
            "Position": "",\r
            "PartNumber": "02313FNC",\r
            "PowerLevel": "80PLUS Platinum"\r
        },\r
        "PowerOutputEfficiencyCurve_7": {\r
            "Position": "",\r
            "PartNumber": "02312YKR",\r
            "PowerLevel": "80PLUS Platinum"\r
        },\r
        "PowerOutputEfficiencyCurve_8": {\r
            "Position": "",\r
            "PartNumber": "02314KMU",\r
            "PowerLevel": "80PLUS Platinum"\r
        },\r
        "PowerOutputEfficiencyCurve_9": {\r
            "Position": "",\r
            "PartNumber": "02314VNQ",\r
            "PowerLevel": "80PLUS Titanium"\r
        },\r
        "PowerOutputEfficiencyCurve_10": {\r
            "Position": "",\r
            "PartNumber": "02314FNU",\r
            "PowerLevel": "80PLUS Platinum"\r
        },\r
        "PowerOutputEfficiencyCurve_11": {\r
            "Position": "",\r
            "PartNumber": "02314XDX",\r
            "PowerLevel": "80PLUS Titanium",\r
            "InputVoltage": 220,\r
            "LoadPercentRange": [\r
                5, \r
                10,\r
                15,\r
                20,\r
                25,\r
                30,\r
                40,\r
                45,\r
                50,\r
                60,\r
                70,\r
                80,\r
                90,\r
                100\r
            ],\r
            "EfficiencyCurve": [\r
                0.86543,\r
                0.92026,\r
                0.94192,\r
                0.95294,\r
                0.95803,\r
                0.96058,\r
                0.96020,\r
                0.96256,\r
                0.96244,\r
                0.95433,\r
                0.95507,\r
                0.95268,\r
                0.94901,\r
                0.94621\r
            ]\r
        }\r
    }\r
}`,EI=`{\r
    "FormatVersion": "3.00",\r
    "DataVersion": "3.00",\r
    "Unit": {\r
        "Type": "PSU",\r
        "Name": "OnePower_0"\r
    },\r
    "Objects": {\r
        "FruData_Ps": {\r
            "FruId": 1,\r
            "StorageType": "Power"\r
        },\r
        "Component_PowerSupply": {\r
            "FruId": 255,\r
            "Instance": "\${Slot}",\r
            "Type": 3,\r
            "Location": "chassis",\r
            "Name": "PS",\r
            "Presence": 1,\r
            "Health": 0,\r
            "PowerState": 1,\r
            "ReplaceFlag": 0,\r
            "PreviousSN": "",\r
            "SerialNumber": "<=/OnePower_0.SerialNumber",\r
            "PartNumber": "<=/OnePower_0.PartNumber",\r
            "BoardId": "<=/Fru_Ps.BoardId",\r
            "GroupId": 1\r
        },\r
        "Fru_Ps": {\r
            "PowerState": 1,\r
            "Health": 0,\r
            "EepStatus": 1,\r
            "Type": 3,\r
            "FruDataId": "#/FruData_Ps"\r
        },\r
        "ThresholdSensor_PsuInputPower": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 11,\r
            "ReadingType": 1,\r
            "SensorName": "Power\${Slot}",\r
            "SensorIdentifier": "Power\${Slot}",\r
            "Unit": 0,\r
            "BaseUnit": 6,\r
            "Linearization" : 112,\r
            "Analog": 1,\r
            "MaximumReading": 255,\r
            "Reading": 170,\r
            "OriginalReading": "<=/OnePower_0.InputPowerWatts",\r
            "ReadingStatus": "<=/OnePower_0.DeepSleepEnabled;<=/Scanner_PowerGood.Value |> expr(($1 == 1 && $2 == 0) ? 2 : 0)"\r
        },\r
        "ThresholdSensor_PsuOutputPower": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 11,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} POut",\r
            "SensorIdentifier": "PS\${Slot} POut",\r
            "Unit": 0,\r
            "BaseUnit": 6,\r
            "Linearization" : 112,\r
            "Analog": 1,\r
            "MaximumReading": 255,\r
            "Reading": 170,\r
            "OriginalReading": "<=/OnePower_0.OutputPowerWatts"\r
        },\r
        "ThresholdSensor_PsuInletTemp": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 1,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} Inlet Temp",\r
            "SensorIdentifier": "PS\${Slot} Inlet Temp",\r
            "Unit": 128,\r
            "BaseUnit": 1,\r
            "Analog": 1,\r
            "Reading": "<=/OnePower_0.EnvTemperatureCelsius"\r
        },\r
        "ThresholdSensor_PsuCoreTemp": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 1,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} Temp",\r
            "Unit": 128,\r
            "BaseUnit": 1,\r
            "Analog": 1,\r
            "Reading": "<=/OnePower_0.PrimaryChipTemperatureCelsius"\r
        },\r
        "ThresholdSensor_PsuVin": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 2,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} VIN",\r
            "SensorIdentifier": "PS\${Slot} VIN",\r
            "BaseUnit": 4,\r
            "Analog": 1,\r
            "Reading": "<=/OnePower_0.InputVoltage |> expr( $1 / 2 )"\r
        },\r
        "ThresholdSensor_PsuIin": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 3,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} IIn",\r
            "SensorIdentifier": "PS\${Slot} IIn",\r
            "BaseUnit": 5,\r
            "Analog": 1,\r
            "Reading": "<=/OnePower_0.InputCurrentAmps |> expr((($1 > 0) && ($1 < 1)) ? 1 : $1)"\r
        },\r
        "ThresholdSensor_PsuVout": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 2,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} VOUT",\r
            "BaseUnit": 4,\r
            "Analog": 1,\r
            "M": 1,\r
            "Reading": "<=/OnePower_0.OutputVoltage"\r
        },\r
        "ThresholdSensor_PsuIout": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 127,\r
            "Capabilities": 104,\r
            "SensorType": 3,\r
            "ReadingType": 1,\r
            "SensorName": "PS\${Slot} IOUT",\r
            "BaseUnit": 5,\r
            "Analog": 1,\r
            "M": 1,\r
            "Reading": "<=/OnePower_0.OutputCurrentAmps |> expr((($1 > 0) && ($1 < 1)) ? 1 : $1)"\r
        },\r
        "DiscreteSensor_PsStatus": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 192,\r
            "SensorType": 8,\r
            "ReadingType": 111,\r
            "SensorName": "PS\${Slot} Status",\r
            "DiscreteType": 0,\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteSensor_PsTempStatus": {\r
            "OwnerId": 32,\r
            "OwnerLun": 0,\r
            "EntityId": "<=/Entity_PowerSupply.Id",\r
            "EntityInstance": "<=/Entity_PowerSupply.Instance",\r
            "Initialization": 99,\r
            "Capabilities": 192,\r
            "SensorType": 33,\r
            "ReadingType": 111,\r
            "SensorName": "PS\${Slot} Temp Status",\r
            "DiscreteType": 0,\r
            "Unit": 192,\r
            "BaseUnit": 0,\r
            "ModifierUnit": 0,\r
            "RecordSharing": 1,\r
            "Reading": 0\r
        },\r
        "DiscreteEvent_PsListen0": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 0,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": 1,\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PsStatus"\r
        },\r
        "DiscreteEvent_PsListen1": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 1,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/OnePower_0.Failure",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PsStatus"\r
        },\r
        "DiscreteEvent_PsListen2": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 3,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/OnePower_0.LossOfInput",\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 255,\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PsStatus"\r
        },\r
        "DiscreteEvent_PsListen3": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 0,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/OnePower_0.OverTemperature",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PsTempStatus"\r
        },\r
        "DiscreteEvent_PsListen4": {\r
            "Property": 0,\r
            "ListenType": 1,\r
            "EventData1": 6,\r
            "EventData2": 255,\r
            "EventData3": 255,\r
            "EventDir": "<=/OnePower_0.OutputVoltageFault |> expr($1 & 240)",\r
            "Conversion": 0,\r
            "SensorObject": "#/DiscreteSensor_PsStatus"\r
        },\r
        "Entity_PowerSupply": {\r
            "Id": 10,\r
            "Instance": 96,\r
            "Name": "PowerSupply\${Slot}",\r
            "Presence": 1,\r
            "PowerState": 1\r
        },\r
        "Event_PSUPoorContactMinor": {\r
            "Reading": "<=/OnePower_0.DeepSleepEnabled;<=/OnePower_0.IsUpgrading;<=/OnePower_0.MfrSpecificStatus;<=/Scanner_PowerGood.Value;<=/Scanner_PsuOPOKStatus.Value |> expr(($1 == 1 || $2) ? 255 : ($3 == 255 ? 255 : ((($3 & 16) == 16 && $5 == 0) || (($3 & 192) != 192 && $4 == 1)) ? 1 : 0))",\r
            "OperatorId": 5,\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "InvalidReading": 255,\r
            "InvalidReadingIgnore": 1,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_PSFailure": {\r
            "Reading": "<=/OnePower_0.Failure",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_InnerCommFault": {\r
            "Reading": "<=/Scanner_PsuIPOKStatus.Value;<=/OnePower_0.CMLStatus |> expr($2 == 255 ? 255 : ($1 == 1 ? ($2 & 2) : 0))",\r
            "OperatorId": 5,\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "InvalidReading": 255,\r
            "InvalidReadingIgnore": 1,\r
            "Enabled": true,\r
            "AdditionalInfo": "1,2",\r
            "DescArg1": "\${Slot}",\r
            "DescArg2": "Inner Communication Error",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_RegisterFault": {\r
            "Reading": "<=/Scanner_PsuIPOKStatus.Value;<=/OnePower_0.CMLStatus |> expr($2 == 255 ? 255 : ($1 == 1 ? ($2 & 16) : 0))",\r
            "OperatorId": 5,\r
            "@Default": {\r
                "Reading": 255\r
            },\r
            "InvalidReading": 255,\r
            "InvalidReadingIgnore": 1,\r
            "Enabled": true,\r
            "AdditionalInfo": "1,2",\r
            "DescArg1": "\${Slot}",\r
            "DescArg2": "Relay Error",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_PhaseLossFault": {\r
            "Reading": "<=/Scanner_PsuIPOKStatus.Value;<=/OnePower_0.OutputCurrentFault |> expr($1 == 1 ? ($2 & 8) : 0)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1,2",\r
            "DescArg1": "\${Slot}",\r
            "DescArg2": "Parse Missing Error",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VinUvFault": {\r
            "Reading": "<=/OnePower_0.InputVoltageFault |> expr($1 == 32768 ? 32768 : $1 & 16)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "@Default": {\r
                "Reading": 32768\r
            },\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 32768,\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_PSFanFault": {\r
            "Reading": "<=/OnePower_0.Fan1Fault;<=/OnePower_0.Fan2Fault |> expr(($1 + $2) == 0 ? 0 : 1)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VoutOvFault": {\r
            "Reading": "<=/OnePower_0.OutputVoltageFault |> expr($1 & 128)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VoutUvFault": {\r
            "Reading": "<=/OnePower_0.OutputVoltageFault |> expr($1 & 16)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_IoutOcFault": {\r
            "Reading": "<=/OnePower_0.OutputCurrentFault |> expr($1 & 128)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VinOvFault": {\r
            "Reading": "<=/OnePower_0.InputVoltageFault |> expr($1 == 32768 ? 32768 : $1 & 128)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "@Default": {\r
                "Reading": 32768\r
            },\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 32768,\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VinUvWarning": {\r
            "Reading": "<=/OnePower_0.InputVoltageFault |> expr($1 == 32768 ? 32768 : $1 & 32)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "@Default": {\r
                "Reading": 32768\r
            },\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 32768,\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VoutOvWarning": {\r
            "Reading": "<=/OnePower_0.OutputVoltageFault |> expr($1 & 64)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VoutUvWarning": {\r
            "Reading": "<=/OnePower_0.OutputVoltageFault |> expr($1 & 32)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_IoutOcWarning": {\r
            "Reading": "<=/OnePower_0.OutputCurrentFault |> expr($1 & 32)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_VinOvWarning": {\r
            "Reading": "<=/OnePower_0.InputVoltageFault |> expr($1 == 32768 ? 32768 : $1 & 64)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "@Default": {\r
                "Reading": 32768\r
            },\r
            "InvalidReadingIgnore": 1,\r
            "InvalidReading": 32768,\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_Fan1Warning": {\r
            "Reading": "<=/OnePower_0.FanFault |> expr($1 & 32)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_PSOverTemp": {\r
            "Reading": "<=/OnePower_0.OverTemperature |> expr($1 & 128)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_OtWarning": {\r
            "Reading": "<=/OnePower_0.OverTemperature |> expr($1 & 64)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_PowerSupplyGetFail": {\r
            "Reading": "<=/OnePower_0.CommunicationStatus;<=/OnePower_0.DeepSleepEnabled;<=/Scanner_PowerGood.Value |> expr($2 == 1 && $3 == 0 ? 0 : $1)",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "Component": "#/Component_PowerSupply"\r
        },\r
        "Event_PSUReplaceMntr": {\r
            "Reading": "<=/Component_PowerSupply.ReplaceFlag",\r
            "OperatorId": 5,\r
            "Enabled": true,\r
            "AdditionalInfo": "1",\r
            "DescArg1": "\${Slot}",\r
            "DescArg2": "#/Component_PowerSupply.PreviousSN",\r
            "DescArg3": "#/Component_PowerSupply.SerialNumber",\r
            "Component": "#/Component_PowerSupply"\r
        }\r
    }\r
}`,y0=[{hw:_I,soft:gI},{hw:yI},{hw:CI,soft:SI},{hw:bI,soft:EI}],wI=["UpperNonrecoverable","UpperCritical","UpperNoncritical","LowerNoncritical","LowerCritical"],II={UpperNoncritical:"预警(上)",UpperCritical:"严重(上)",UpperNonrecoverable:"不可恢复(上)",LowerNoncritical:"预警(下)",LowerCritical:"严重(下)"};function xl(e){return/Nonrecoverable|Fatal|Fail/i.test(e)?"Critical":/Major|Critical/i.test(e)?"Major":"Minor"}const Ha=new Map;function C0(e){try{const n=md(e.hw),t=e.soft?fI(n.objects,md(e.soft).objects):n.objects;return{unitName:n.unit.name,unitType:n.unit.type,objects:t,chips:hI(n),chipMap:vI(t)}}catch{return null}}function S0(e){if(Ha.has(e))return Ha.get(e);let n=null;for(const t of y0){const r=C0(t);if(r&&r.unitName===e){n=r;break}}return Ha.set(e,n),n}let za=null;function na(){if(za)return za;const e=[];for(const n of y0){const t=C0(n);t&&e.push(t)}return za=e,e}function PI(e){const n=S0(e);if(!n)return[];const t={};for(const o of Object.values(n.chipMap))t[o]=(t[o]||0)+1;const r={};for(const o of E0(n))o.dsChip&&(r[o.dsChip]=(r[o.dsChip]||0)+1);return n.chips.map(o=>({...o,sensorCount:t[o.name]||0,eventCount:r[o.name]||0}))}function $I(e,n){const t=n.Reading;if(typeof t!="string")return"";const r=t.match(/<=\/(Scanner_[A-Za-z0-9_]+)\.Value/);if(!r)return"";const o=e[r[1]],s=o?Xt(o.Chip):null;return s?s.target:""}function xI(e,n){var d,f;const t=e[n],r=t==null?void 0:t.Reading;if(typeof r!="string")return null;const o=r.match(/<=\/(Scanner_[A-Za-z0-9_]+)\.Value/);if(!o)return null;const s=e[o[1]];if(!s)return null;const i=(h,p)=>typeof h=="number"?h:p,a=Xt(s.Chip),l=s.Debounce,c=typeof l=="string"?((d=Xt(l))==null?void 0:d.target)||l:void 0;return{chip:a?a.target:"",offset:i(s.Offset,0),size:i(s.Size,1),mask:i(s.Mask,255),period:typeof s.Period=="number"?s.Period:void 0,debounce:c,scanEnabled:(f=Xt(s.ScanEnabled))==null?void 0:f.target}}function DI(e){switch(typeof(e==null?void 0:e.SensorType)=="number"?e.SensorType:1){case 2:return{qk:"voltage",deviceKey:"Volt_Board",deviceLabel:"单板电压"};case 3:return{qk:"current",deviceKey:"Curr_Board",deviceLabel:"单板电流"};case 4:return{qk:"fanspeed",deviceKey:"Fan_Board",deviceLabel:"风扇转速"};case 11:return{qk:"power",deviceKey:"Power_Board",deviceLabel:"功率"};default:return{qk:"temperature",deviceKey:"Temp_Board",deviceLabel:"单板温度"}}}function MI(e){return/^Chassis\./.test(e)?"chassis":"board"}const Si=e=>{var n;return(n=Xt(e))==null?void 0:n.target},bi=e=>typeof e=="number"?e:void 0,b0=e=>typeof e=="string"&&e?e:void 0;function kI(e){const n=[];for(let t=1;t<=4;t++){const r=e[`DescArg${t}`];typeof r=="string"&&r&&!/\|>|^#\/|^<=\//.test(r)&&n.push(r)}return n.length?n:void 0}function TI(e,n){const t=[];for(const[r,o]of Object.entries(e)){if(Zt(r)!=="DiscreteEvent"||Si(o.SensorObject)!==n)continue;const s=typeof o.ListenType=="number"?o.ListenType:0,i=[o.EventData1,o.EventData2,o.EventData3].filter(a=>typeof a=="number"&&a!==255).join("/");t.push({name:r.replace(/^DiscreteEvent_/,""),summary:`${s===1?"读值型":"位型"}${i?" · 数据 "+i:""}`})}return t}function E0(e){const n=new Set;for(const o of ea(e.objects))/^(ThresholdSensor|DiscreteSensor)_/.test(o.name)&&o.events.forEach(s=>n.add(s.name));const t=[];let r=0;for(const[o,s]of Object.entries(e.objects)){if(Zt(o)!=="Event"||n.has(o))continue;const i=typeof s.EventKeyId=="string"?s.EventKeyId:"";if(!i)continue;const a=o.replace(/^Event_/,"")||i.split(".").pop()||o;t.push({id:`le${++r}`,eventKeyId:i,label:a,condition:typeof s.Condition=="number"?s.Condition:0,operatorId:typeof s.OperatorId=="number"?s.OperatorId:5,severity:xl(i),dsChip:$I(e.objects,s),scope:MI(i),enabled:s.Enabled!==!1,component:Si(s.Component),evHysteresis:bi(s.Hysteresis),ledFaultCode:b0(s.LedFaultCode),invalidReading:bi(s.InvalidReading),descArgs:kI(s)})}return t}function VI(e){var i;const n=S0(e);if(!n)return{cfgs:[],looseEvents:[],skipped:0};const t=ea(n.objects),r=[];let o=0,s=0;for(const a of t){if(!/^(ThresholdSensor|DiscreteSensor)_/.test(a.name)){o++;continue}const l=a.name.replace(/^(ThresholdSensor|DiscreteSensor)_/,""),c=xI(n.objects,a.name),d=(c==null?void 0:c.chip)||n.chipMap[a.name]||"",f=Si((i=n.objects[a.name])==null?void 0:i.EntityId),h=p=>{const E=n.objects[p]||{};return{component:Si(E.Component),evHysteresis:bi(E.Hysteresis),ledFaultCode:b0(E.LedFaultCode),invalidReading:bi(E.InvalidReading)}};if(a.kind==="threshold"){const p=a.events.map(b=>{const T=b.level&&wI.includes(b.level)?b.level:void 0;return{id:`e${++s}`,suffix:"",label:T?II[T]:b.eventKeyId.split(".").pop()||"事件",severity:xl(b.eventKeyId),operatorId:T?T.startsWith("Upper")?4:1:4,levelField:T,condition:b.condition??1,eventKeyId:b.eventKeyId,enabled:!0,...h(b.name)}}),E=DI(n.objects[a.name]);r.push({id:`sr:${l}`,deviceKey:E.deviceKey,deviceLabel:E.deviceLabel,quantityKey:E.qk,railKey:l,railLabel:l,dsMode:d?"scanner":"device-field",dsChip:d,dsOffset:(c==null?void 0:c.offset)??0,dsMask:(c==null?void 0:c.mask)??255,dsSize:(c==null?void 0:c.size)??1,periodMs:(c==null?void 0:c.period)??1e3,thresholds:{...a.thresholds},hysteresis:2,events:p,enabled:!0,entityRef:f,debounce:c==null?void 0:c.debounce,scanEnabled:c==null?void 0:c.scanEnabled})}else if(a.kind==="discrete"){const p=a.events.map(E=>({id:`e${++s}`,suffix:"",label:E.eventKeyId.split(".").pop()||"状态命中",severity:xl(E.eventKeyId),operatorId:5,levelField:void 0,condition:E.condition??1,eventKeyId:E.eventKeyId,enabled:!0,...h(E.name)}));r.push({id:`sr:${l}`,deviceKey:"System",deviceLabel:"系统状态",quantityKey:"sr_state",railKey:l,railLabel:l,dsMode:d?"scanner":"device-field",dsChip:d,dsOffset:(c==null?void 0:c.offset)??0,dsMask:(c==null?void 0:c.mask)??255,dsSize:(c==null?void 0:c.size)??1,periodMs:(c==null?void 0:c.period)??8e3,thresholds:{},hysteresis:0,events:p,enabled:!0,entityRef:f,debounce:c==null?void 0:c.debounce,scanEnabled:c==null?void 0:c.scanEnabled,selEvents:TI(n.objects,a.name)})}else o++}return{cfgs:r,looseEvents:E0(n),skipped:o}}function Xs(e){const n=yr(e);if(n.loaded)return;n.loaded=!0;const t=VI(e);t.cfgs.length&&n.cfgs.push(...t.cfgs),t.looseEvents.length&&n.looseEvents.push(...t.looseEvents)}const NI={class:"alarm-view"},AI={class:"alarm-toolbar"},FI={class:"tb-tag"},OI={class:"tb-src"},RI={class:"dev-row"},BI=["onClick"],LI={class:"dev-type"},UI={class:"dev-key"},HI={key:1,class:"add-panel"},zI={class:"add-title"},KI={class:"tpl-hint"},WI={class:"tpl-list"},GI=["disabled","onClick"],XI={class:"tpl-name"},YI={class:"tpl-tag"},jI={class:"tpl-desc"},qI={class:"rail-custom"},ZI={key:1,class:"tpl-list"},JI=["disabled","onClick"],QI={class:"tpl-name"},e3={class:"tpl-tag"},n3={class:"tpl-desc"},t3={class:"tpl-list"},r3=["onClick"],o3={class:"tpl-name"},s3={class:"tpl-desc"},i3={class:"flow-list"},a3={key:0,class:"lh-chip"},l3={class:"lh-se"},u3={key:0,class:"lh-sensor"},c3={key:0,class:"empty"},d3={class:"conn-layer",preserveAspectRatio:"none","aria-hidden":"true"},f3=["d"],p3=["onMouseenter"],h3={class:"cn-name"},v3={class:"cn-type"},m3={class:"cn-cnt"},_3={class:"se-cols"},g3=["onMouseenter"],y3={class:"se-sensor"},C3=["data-sensor-card","onMouseenter","onClick"],S3={class:"sc-name"},b3={class:"sc-kind"},E3=["title"],w3=["onClick"],I3={class:"se-events"},P3={key:0,class:"event-node none"},$3=["data-event-of","onMouseenter","onClick"],x3={class:"en-label"},D3={key:0,class:"se-sensor se-empty"},M3={class:"se-events loose-events"},k3=["data-cat-head","onMouseenter"],T3={class:"cat-name"},V3={class:"cat-n"},N3={class:"cat-chips"},A3=["onMouseenter","onClick"],F3={class:"en-label"},O3={class:"en-op"},R3={key:0,class:"cfg-actions-float"},B3=["title"],L3={class:"cfg-head"},U3={class:"cfg-tt"},H3={class:"cfg-title"},z3={class:"cfg-badge"},K3={class:"cfg-sub"},W3={class:"cfg-body"},G3={key:0,class:"cfg-todo"},X3={class:"todo-t"},Y3=["onClick"],j3={class:"mf"},q3=["title"],Z3={class:"scan-grid"},J3=["placeholder"],Q3={class:"mf-desc"},eP={class:"scan-grid"},nP={class:"mf"},tP=["value"],rP={key:0,class:"mf-desc"},oP={class:"cs-t"},sP={key:3,class:"fn-thr"},iP=["title"],aP={class:"thr-l"},lP=["onUpdate:modelValue","placeholder"],uP={key:0,class:"thr-reco"},cP={class:"thr-unit"},dP={key:4,class:"disc-note"},fP={key:5,class:"mf"},pP=["title"],hP={key:0,class:"sc-focus-hint"},vP={class:"ev-head"},mP={class:"ef ev-nm ev-nm-top"},_P=["onUpdate:modelValue"],gP=["onClick"],yP={class:"ev-fields"},CP={class:"ef ef-lv"},SP={class:"ef-k"},bP=["title"],EP=["onUpdate:modelValue","onChange"],wP=["value"],IP={class:"ef"},PP={class:"ef-k"},$P=["title"],xP={class:"ef-dir"},DP={class:"ef"},MP={class:"ef-k"},kP=["title"],TP=["onUpdate:modelValue"],VP=["value"],NP={key:0,class:"ef"},AP=["onUpdate:modelValue"],FP={key:1,class:"ef"},OP=["onUpdate:modelValue"],RP={key:2,class:"ef"},BP=["onUpdate:modelValue"],LP={key:3,class:"ef"},UP=["onUpdate:modelValue"],HP={class:"ef ef-grow"},zP=["onUpdate:modelValue"],KP=["value"],WP=["onClick"],GP={class:"ev-foot"},XP={class:"ev-en",title:"是否产出该事件"},YP=["onUpdate:modelValue"],jP={class:"ev-head"},qP={class:"ef ev-nm ev-nm-top"},ZP=["onUpdate:modelValue"],JP=["onClick"],QP={class:"ev-fields"},e$={class:"ef"},n$={class:"in-reco"},t$=["onUpdate:modelValue"],r$={class:"reco-in"},o$={class:"ef"},s$={class:"ef-k"},i$=["title"],a$=["onUpdate:modelValue"],l$=["value"],u$={class:"ef"},c$={class:"ef-k"},d$=["title"],f$=["onUpdate:modelValue"],p$=["value"],h$={key:0,class:"ef"},v$=["onUpdate:modelValue"],m$={key:1,class:"ef"},_$=["onUpdate:modelValue"],g$={key:2,class:"ef"},y$=["onUpdate:modelValue"],C$={key:3,class:"ef"},S$=["onUpdate:modelValue"],b$={class:"ef ef-grow"},E$=["onUpdate:modelValue"],w$=["value"],I$={class:"ev-foot"},P$={class:"ev-en",title:"是否产出该事件"},$$=["onUpdate:modelValue"],x$={class:"sel-list"},D$={class:"sel-sum"},M$={key:1,class:"cfg-card cfg-card-sm"},k$={class:"cfg-head"},T$={class:"cfg-tt"},V$={class:"cfg-title"},N$={class:"cfg-sub"},A$={class:"cfg-body"},F$={class:"ev-edit"},O$={class:"ev-head"},R$={class:"ef ev-nm ev-nm-top"},B$={class:"ev-fields"},L$={class:"ef"},U$={class:"ef"},H$={class:"ef-k"},z$=["title"],K$=["value"],W$={class:"ef"},G$={class:"ef-k"},X$=["title"],Y$=["value"],j$={key:0,class:"ef"},q$={key:1,class:"ef"},Z$={key:2,class:"ef"},J$={key:3,class:"ef"},Q$={class:"ef-k"},e4=["onUpdate:modelValue"],n4={class:"ef ef-grow"},t4={class:"ev-foot"},r4={class:"ev-en",title:"是否产出该事件"},o4={class:"ht-head"},s4={key:0,class:"ht-sub"},i4={class:"ht-k"},a4={class:"ht-v"},l4=We({__name:"AlarmConfigView",props:{scopeDeviceKey:{},scopeChipKey:{}},setup(e){const{state:n,openCodeDoc:t}=Qi(),r=e,o=ue(()=>n.inbound.alarm),s=ue(()=>{var G;return((G=o.value)==null?void 0:G.boardType)||"Unknown"}),i=ue(()=>{var G;return((G=o.value)==null?void 0:G.boardName)||"当前板卡"}),a=ue(()=>{var G;return((G=o.value)==null?void 0:G.source)||""}),l=ue(()=>iI(s.value)),c=ue(()=>i.value),d=()=>cI(c.value),f=ue(()=>yr(c.value).cfgs),h=ue(()=>r.scopeChipKey?r.scopeChipKey==="__firmware"?f.value.filter(G=>!G.dsChip):f.value.filter(G=>G.dsChip===r.scopeChipKey):r.scopeDeviceKey?f.value.filter(G=>G.deviceKey===r.scopeDeviceKey):f.value),p=Ee(null);Be(c,G=>{p.value=null,Xs(G)},{immediate:!0});const E=Ee(""),b=ue(()=>l.value.find(G=>G.key===E.value)||l.value[0]||null);Be(l,G=>{G.length&&!G.some(y=>y.key===E.value)&&(E.value=G[0].key)},{immediate:!0}),Be(()=>r.scopeDeviceKey,G=>{G&&(E.value=G)},{immediate:!0});const T=ue(()=>b.value?sI(b.value.key):!1),V=ue(()=>nI(s.value));function z(G){return f.value.some(y=>{var $;return y.deviceKey===(($=b.value)==null?void 0:$.key)&&y.railKey===G})}function x(G){return f.value.some(y=>{var $;return y.deviceKey===(($=b.value)==null?void 0:$.key)&&y.quantityKey===G&&!y.railKey})}const N=Ee(""),re=["UpperNonrecoverable","UpperCritical","UpperNoncritical","LowerNoncritical","LowerCritical"],ie={UpperNoncritical:"预警(上)",UpperCritical:"严重(上)",UpperNonrecoverable:"不可恢复(上)",LowerNoncritical:"预警(下)",LowerCritical:"严重(下)"},ae=[{v:"Minor",label:"预警 Minor",desc:"需要关注，业务未中断。"},{v:"Major",label:"严重 Major",desc:"影响业务，需尽快处理。"},{v:"Critical",label:"致命 Critical",desc:"业务中断或硬件损坏风险。"}];function fe(G){const y=un[G];return y.kind==="threshold"?(y.recommend.events||[]).map($=>({id:d(),suffix:$.suffix,label:$.label,severity:$.severity,operatorId:$.operatorId,levelField:$.levelField,condition:1,eventKeyId:$.eventKeyId,enabled:!0})):[{id:d(),suffix:"",label:"状态命中",severity:"Major",operatorId:y.recommend.operatorId,condition:y.recommend.condition??1,eventKeyId:y.recommend.eventKeyIds[0]||"",enabled:!0}]}function le(G,y,$,Q,Ce,Le){const vn=un[$],On=vn.kind==="threshold"?Le!=null?tI(Le):{...vn.recommend.thresholds||{}}:{};return{id:g0(G,$,Q),deviceKey:G,deviceLabel:y,quantityKey:$,railKey:Q,railLabel:Ce,dsMode:"device-field",dsChip:"",dsOffset:0,dsMask:255,dsSize:1,periodMs:fd(vn.recommend.periodKey).periodMs,thresholds:On,hysteresis:vn.recommend.hysteresis??0,events:fe($),enabled:!0}}function Z(G){return r.scopeChipKey&&r.scopeChipKey!=="__firmware"&&(G.dsChip=r.scopeChipKey,G.dsMode="scanner"),G}function ne(G){!b.value||z(G.key)||f.value.push(Z(le(b.value.key,b.value.typeLabel,"voltage",G.key,G.label,G.nominal)))}function M(){for(const G of V.value)z(G.key)||ne(G)}function q(){const G=N.value.trim();!G||!b.value||(f.value.push(Z(le(b.value.key,b.value.typeLabel,"voltage",G,G,12))),N.value="")}function v(G){if(!b.value||x(G))return;const y=Z(le(b.value.key,b.value.typeLabel,G));f.value.push(y),p.value=y.id}function X(G){const y=un[G];if(y.kind==="threshold"){const $=y.recommend.events||[];return $.length?`门限模板 · ${$.length} 档：${$.map(Q=>Q.label).join(" / ")}`:"门限模板 · 越限告警"}return"状态模板 · 读数命中触发值即告警"}function w(){return"电压模板 · 每条轨按过压/欠压四档各产一条告警"}function Y(G){const y=f.value.findIndex($=>$.id===G);y>=0&&f.value.splice(y,1),p.value===G&&(p.value=null)}function K(G){const y=un[G.quantityKey];if(y.kind==="threshold"){const $=new Set(G.events.map(Ce=>Ce.levelField)),Q=re.find(Ce=>G.thresholds[Ce]!=null&&!$.has(Ce))||re.find(Ce=>!$.has(Ce))||"UpperCritical";G.events.push({id:d(),suffix:`X${Ua(c.value)}`,label:ie[Q],severity:"Major",operatorId:Q.startsWith("Upper")?4:1,levelField:Q,condition:1,eventKeyId:te(G)[0]||"",enabled:!0})}else G.events.push({id:d(),suffix:`X${Ua(c.value)}`,label:"状态命中",severity:"Major",operatorId:y.recommend.operatorId,condition:y.recommend.condition??1,eventKeyId:te(G)[0]||"",enabled:!0})}function j(G,y){const $=G.events.findIndex(Q=>Q.id===y);$>=0&&G.events.splice($,1)}function J(G){G.levelField&&(G.operatorId=G.levelField.startsWith("Upper")?4:1,G.label=ie[G.levelField])}function te(G){const y=un[G.quantityKey],$=new Set(y.recommend.eventKeyIds);return(y.recommend.events||[]).forEach(Q=>$.add(Q.eventKeyId)),G.events.forEach(Q=>{Q.eventKeyId&&$.add(Q.eventKeyId)}),[...$]}function pe(G,y){var Q;const $=(Q=un[G.quantityKey].recommend.thresholds)==null?void 0:Q[y];G.thresholds[y]=$??0}function ye(G){const y=un[G.quantityKey],$=y.kind==="threshold"?{...G.thresholds}:void 0,Q=G.events.filter(Ce=>Ce.enabled).map(Ce=>({suffix:Ce.suffix,eventKeyId:Ce.eventKeyId,operatorId:Ce.operatorId,label:Ce.label,severity:Ce.severity,levelField:Ce.levelField,condition:Ce.levelField?void 0:Ce.condition}));return{boardName:i.value,deviceKey:G.deviceKey,deviceLabel:G.deviceLabel,quantityKey:G.quantityKey,railKey:G.railKey,railLabel:G.railLabel,enabled:G.enabled,operatorId:y.recommend.operatorId,thresholds:$,eventList:Q,hysteresis:y.kind==="threshold"?G.hysteresis:void 0,dataSource:G.dsMode==="scanner"?{mode:"scanner",scanner:{chip:G.dsChip,offset:G.dsOffset,size:G.dsSize,mask:G.dsMask,periodMs:G.periodMs}}:{mode:"device-field",field:G.readingField&&G.readingField.trim()||y.readingField}}}const ge=ue(()=>{const G={},y=[];for(const $ of h.value){const Q=uI({Objects:G},ye($));Object.assign(G,Q.objects),Q.sensor&&y.push({cfg:$,sensor:Q.sensor,warnings:Q.warnings})}return{objects:G,cards:y}}),_e={voltage:"电压",temp:"温度",presence:"在位",chassis:"机箱",power:"电源 / 时序",system:"系统状态",other:"其他"};function Se(G){const y=G.eventKeyId+" "+G.label;return/Chassis/i.test(G.eventKeyId)?"chassis":/Temp/i.test(y)?"temp":/_V_|Voltage|OverVolt|UnderVolt|(^|[^A-Za-z0-9])\d+(\.\d+)?V([^A-Za-z]|$)/i.test(y)?"voltage":/Install|Removed|Present|Insert|Missing|Disconnect/i.test(y)?"presence":/ACPI|System/i.test(y)?"system":/Power|Reset|OnTime|Boot|StartUp|PSU|Ok|Drop/i.test(y)?"power":"other"}function be(G){return G==="__fw"?"非物理芯片 · 固件推送":Ci(G.split("_")[0])}const Me=ue(()=>ge.value.objects),Oe=ue(()=>JSON.stringify(Me.value,null,2)),ke=ue(()=>ge.value.cards.length),Ve=ue(()=>ge.value.cards.find(G=>G.sensor.configId===p.value)||null),m=ue(()=>{var G;return((G=Ve.value)==null?void 0:G.cfg)||null}),F=Ee(null),g=Ee(null);function S(){const G=g.value;if(!G)return;const y=G.querySelector(".ev-edit.focused");y&&y.scrollIntoView({block:"nearest"})}const P=ue(()=>!!m.value&&ls(m.value)),A=ue(()=>{const G=m.value;return!G||!er(G)?!0:re.some(y=>G.thresholds[y]!=null)}),L=ue(()=>{const G=m.value;return G?G.events.length>0&&G.events.every(y=>!!y.eventKeyId):!1}),se=ue(()=>{const G=[];return P.value||G.push({key:"ds",label:"数据源未接"}),A.value||G.push({key:"thr",label:"未设门限"}),L.value||G.push({key:"ev",label:m.value&&m.value.events.length?"事件字典条目未选":"未加事件"}),G});function O(G){fn(()=>{var $;const y=($=g.value)==null?void 0:$.querySelector(`[data-step="${G}"]`);y==null||y.scrollIntoView({block:"start",behavior:"smooth"})})}const _=ue(()=>yr(c.value).looseEvents),B=ue(()=>r.scopeChipKey?r.scopeChipKey==="__firmware"?_.value.filter(G=>!G.dsChip):_.value.filter(G=>G.dsChip===r.scopeChipKey):r.scopeDeviceKey?[]:_.value),ee=ue(()=>B.value.length),U=Ee(null),D=ue(()=>B.value.find(G=>G.id===U.value)||null);function W(G){const y=U.value!==G;U.value=y?G:null,y&&(p.value=null,F.value=null)}const R=[{key:"overvolt",name:"过压告警",desc:"电压高于限值即告警",eventKeyId:"Mainboard.MainboardOverVoltageMajor",label:"OverVoltage",condition:1,operatorId:4,severity:"Major"},{key:"undervolt",name:"欠压告警",desc:"电压低于限值即告警",eventKeyId:"Mainboard.MainboardLowerVoltageMajor",label:"LowerVoltage",condition:1,operatorId:1,severity:"Major"},{key:"installed",name:"部件插入",desc:"器件由缺失变为在位（热插拔）",eventKeyId:"Component.ComponentInstalled",label:"Installed",condition:1,operatorId:7,severity:"Minor"},{key:"removed",name:"部件移除",desc:"器件由在位变为缺失（热插拔）",eventKeyId:"Component.ComponentRemoved",label:"Removed",condition:0,operatorId:8,severity:"Major"},{key:"absent",name:"不在位告警",desc:"部件缺失即告警",eventKeyId:"Component.ComponentAbsent",label:"Absent",condition:0,operatorId:5,severity:"Major"},{key:"overtemp",name:"过温告警",desc:"温度越限即告警",eventKeyId:"Chassis.ChassisOverTempMajor",label:"OverTemp",condition:1,operatorId:4,severity:"Major"},{key:"fault",name:"状态位故障",desc:"PMBus/寄存器状态位置位即告警",eventKeyId:"Board.StatusFault",label:"StatusFault",condition:1,operatorId:6,severity:"Critical"},{key:"blank",name:"空白事件",desc:"从零手动配置",eventKeyId:"",label:"新事件",condition:1,operatorId:5,severity:"Major"}];function k(G){const y=G||R[R.length-1],$=yr(c.value),Q=`le-m${Ua(c.value)}`,Ce=r.scopeChipKey&&r.scopeChipKey!=="__firmware"?r.scopeChipKey:"";$.looseEvents.push({id:Q,eventKeyId:y.eventKeyId,label:y.label,condition:y.condition,operatorId:y.operatorId,severity:y.severity,dsChip:Ce,scope:"board",enabled:!0}),p.value=null,U.value=Q,At.value=!1,oe.value=!1}const oe=Ee(!1),ce=Ee(null),Ie=Ee({});function Ae(){oe.value=!oe.value,oe.value&&fn(()=>{var y;const G=(y=ce.value)==null?void 0:y.getBoundingClientRect();G&&(Ie.value={top:`${G.bottom+6}px`,right:`${Math.max(8,window.innerWidth-G.right)}px`})})}function $e(G){G.events.length===0&&(G.events=fe(G.quantityKey))}function ze(G){const y=p.value!==G;p.value=y?G:null,F.value=null,y&&(U.value=null,m.value&&$e(m.value))}function rn(G,y){var Q;p.value=G,U.value=null;const $=m.value;$?($e($),F.value=$.events.some(Ce=>Ce.eventKeyId===y)?y:((Q=$.events[0])==null?void 0:Q.eventKeyId)??y):F.value=y,fn(S)}function on(){p.value=null,U.value=null,F.value=null}function Jr(G){G.key==="Escape"&&on()}bn(()=>window.addEventListener("keydown",Jr)),Cr(()=>window.removeEventListener("keydown",Jr));const Nt=ue(()=>{const G=Ce=>Ce||"__fw",y=new Map,$=Ce=>{let Le=y.get(Ce);return Le||(Le={sensors:[],loose:[]},y.set(Ce,Le)),Le};for(const Ce of ge.value.cards)$(G(Ce.cfg.dsChip)).sensors.push(Ce);for(const Ce of B.value)$(G(Ce.dsChip)).loose.push(Ce);const Q=[];for(const[Ce,Le]of y){const vn=new Map;for(const Dn of Le.loose){const ht=Se(Dn);let Ft=vn.get(ht);Ft||(Ft=[],vn.set(ht,Ft)),Ft.push(Dn)}const On=Object.keys(_e),nr=[...vn.entries()].sort((Dn,ht)=>On.indexOf(Dn[0])-On.indexOf(ht[0])).map(([Dn,ht])=>({cat:Dn,label:_e[Dn]||Dn,events:ht}));Q.push({chipKey:Ce,chipLabel:Ce==="__fw"?"固件 / BIOS 推送":Ce,subLabel:be(Ce),sensors:Le.sensors,cats:nr,sensorCount:Le.sensors.length,eventCount:Le.loose.length})}return Q.sort((Ce,Le)=>Le.sensorCount*1e3+Le.eventCount-(Ce.sensorCount*1e3+Ce.eventCount))}),as=ue(()=>!r.scopeChipKey),P0=ue(()=>Nt.value.some(G=>G.sensors.length>0));function er(G){return un[G.quantityKey].kind==="threshold"}function $0(G){return un[G.quantityKey].unitLabel||""}function ta(G,y){var $;return($=un[G.quantityKey].recommend.thresholds)==null?void 0:$[y]}function ra(G){var y;return((y=bo.find($=>$.id===G))==null?void 0:y.symbol)||""}function oa(G){var y;return((y=bo.find($=>$.id===G))==null?void 0:y.desc)||""}function ls(G){return G.dsMode==="device-field"||!!G.dsChip.trim()}function Qr(G){return G.cfg.railLabel||un[G.cfg.quantityKey].label}function us(G,y){return y?G.thresholds[y]:void 0}function x0(G){var y;return((y=ae.find($=>$.v===G))==null?void 0:y.label)||G}function sa(G){var y;return((y=ae.find($=>$.v===G))==null?void 0:y.desc)||""}const ln=Gn({show:!1,x:0,y:0,head:"",sub:"",rows:[]});function ia(G){const y=G.currentTarget.getBoundingClientRect();ln.x=Math.max(8,Math.min(y.left,window.innerWidth-320)),ln.y=y.bottom+6}function D0(G,y){ia(G),ln.head=y.chipKey==="__fw"?"固件 / BIOS 推送":y.chipLabel,ln.sub=y.chipKey==="__fw"?"Reading=0 或无 Scanner，由固件直接上报":`数据源器件${y.subLabel?" · "+y.subLabel:""}`;const $=[{k:"取数",v:y.chipKey==="__fw"?"固件直报，不经物理芯片":`Reading ⟵ Scanner.Value ⟵ ${y.chipLabel}`},{k:"规模",v:`${y.sensorCount} 传感器 · ${y.eventCount} 事件`}];y.sensors.length&&$.push({k:"传感器",v:y.sensors.map(Q=>Qr(Q)).join("、")}),ln.rows=$,ln.show=!0}function M0(G,y){ia(G);const $=un[y.cfg.quantityKey];ln.head=Qr(y),ln.sub=`${y.sensor.kind==="threshold"?"门限传感器":"状态传感器"} · ${$.label}${$.unitLabel?" "+$.unitLabel:""}`;const Q=y.cfg.dsMode==="device-field"?`器件读数 ${y.cfg.deviceKey}.${$.readingField}`:`寄存器周期读 ${y.cfg.dsChip||"(未选芯片)"} @${y.cfg.periodMs}ms`,Ce=[{k:"键名",v:y.sensor.sensorKey},{k:"数据源",v:`${Q}（${ls(y.cfg)?"已接":"未接"}）`}];if(y.cfg.entityRef&&Ce.push({k:"物理实体",v:y.cfg.entityRef}),y.sensor.kind==="threshold"){const Le=re.filter(vn=>y.cfg.thresholds[vn]!=null).map(vn=>`${ie[vn]}=${y.cfg.thresholds[vn]}`);Ce.push({k:"门限",v:Le.length?Le.join(" · ")+($.unitLabel?" "+$.unitLabel:""):"未设"})}Ce.push({k:"事件",v:`${y.sensor.events.length} 条${y.sensor.events.length?"（"+y.sensor.events.map(Le=>Le.label).join("、")+"）":""}`}),ln.rows=Ce,ln.show=!0}function gu(G,y,$,Q,Ce,Le){ia(G),ln.head=y,ln.sub=`事件 / 告警 · ${Le}`,ln.rows=[{k:"触发",v:Q},{k:"分级",v:x0(Ce)},{k:"字典条目",v:$||"(未选)"}],ln.show=!0}function cs(){ln.show=!1}const aa=Ee(!1);function k0(){var G;(G=navigator.clipboard)==null||G.writeText(Oe.value).then(()=>{aa.value=!0,window.setTimeout(()=>{aa.value=!1},1500)})}function T0(){var Q,Ce;const G=`${i.value}.sr`,y=Oe.value;let $=!1;try{$=window.self!==window.top}catch{$=!0}if($){const Le={type:"open-code",source:"hardware-alarm",file:G,language:"jsonc",readOnly:!0,content:y};try{window.parent.postMessage(Le,"*")}catch{}try{(Ce=(Q=window.vscode)==null?void 0:Q.postMessage)==null||Ce.call(Q,Le)}catch{}}else t(G,y)}const At=Ee(!1),yu=Ee(null),Cu=Ee({});function V0(){At.value=!At.value,At.value&&fn(()=>{var y;const G=(y=yu.value)==null?void 0:y.getBoundingClientRect();G&&(Cu.value={top:`${G.bottom+6}px`,right:`${Math.max(8,window.innerWidth-G.right)}px`})})}const la=new Map;function N0(G,y){y?la.set(G,y):la.delete(G)}const ua=Gn({}),pt=Ee(null);function ca(G,y,$){const Q=G.right-$.left,Ce=G.top-$.top+G.height/2,Le=y.left-$.left,vn=y.top-$.top+y.height/2,On=Math.max(18,(Le-Q)*.45);return`M${Q.toFixed(1)},${Ce.toFixed(1)} C${(Q+On).toFixed(1)},${Ce.toFixed(1)} ${(Le-On).toFixed(1)},${vn.toFixed(1)} ${Le.toFixed(1)},${vn.toFixed(1)}`}function eo(){for(const G of Nt.value){const y=la.get(G.chipKey);if(!y){ua[G.chipKey]=[];continue}const $=y.getBoundingClientRect(),Q=[],Ce=y.querySelector('[data-role="obj"]'),Le=Ce==null?void 0:Ce.getBoundingClientRect(),vn=Array.from(y.querySelectorAll("[data-event-of]"));y.querySelectorAll("[data-sensor-card]").forEach(On=>{const nr=On,Dn=nr.getAttribute("data-sensor-card")||"",ht=nr.getBoundingClientRect();Le&&Q.push({id:`os-${Dn}`,sensorId:Dn,d:ca(Le,ht,$)}),vn.filter(Ft=>Ft.getAttribute("data-event-of")===Dn).forEach((Ft,A0)=>{Q.push({id:`se-${Dn}-${A0}`,sensorId:Dn,d:ca(ht,Ft.getBoundingClientRect(),$)})})}),Le&&y.querySelectorAll("[data-cat-head]").forEach(On=>{const nr=On.getAttribute("data-cat-head")||"";Q.push({id:`oc-${nr}`,sensorId:nr,d:ca(Le,On.getBoundingClientRect(),$),dashed:!0})}),ua[G.chipKey]=Q}}let no=null;return bn(()=>{fn(eo),no=new ResizeObserver(()=>eo());const G=document.querySelector(".flow-list");G&&no.observe(G),window.addEventListener("resize",eo)}),Cr(()=>{no==null||no.disconnect(),window.removeEventListener("resize",eo)}),Be([Nt,p,U],()=>fn(eo)),(G,y)=>(C(),I("div",NI,[u("div",AI,[u("span",FI,H(e.scopeChipKey?"数据源器件":"来自拓扑"),1),u("span",OI,H(a.value||i.value),1),u("button",{ref_key:"addEvtBtnRef",ref:ce,class:ve(["btn add-open2",{on:oe.value}]),title:"从模板新增一条不经传感器的独立事件（直连器件数据源）",onClick:Ae},"＋ 新增事件",2),u("button",{ref_key:"addBtnRef",ref:yu,class:ve(["btn-solid add-open",{on:At.value}]),onClick:V0},"＋ 新增传感器",2)]),(C(),Je(Fh,{to:"body"},[At.value?(C(),I("div",{key:0,class:"add-backdrop",onClick:y[0]||(y[0]=$=>At.value=!1)})):me("",!0),At.value?(C(),I("div",{key:1,class:"add-pop",style:Fe(Cu.value),onClick:y[2]||(y[2]=Qe(()=>{},["stop"]))},[e.scopeDeviceKey?me("",!0):(C(),I(he,{key:0},[y[27]||(y[27]=u("div",{class:"ap-title"},"选监控对象",-1)),u("div",RI,[(C(!0),I(he,null,xe(l.value,$=>{var Q;return C(),I("button",{key:$.key,class:ve(["dev-chip",{active:((Q=b.value)==null?void 0:Q.key)===$.key}]),onClick:Ce=>E.value=$.key},[u("span",LI,H($.typeLabel),1),u("span",UI,H($.key),1)],10,BI)}),128))])],64)),b.value?(C(),I("div",HI,[u("div",zI,[y[28]||(y[28]=we(" 为 ",-1)),u("b",null,H(b.value.key),1),y[29]||(y[29]=we(" 选告警模板 ",-1)),y[30]||(y[30]=u("span",{class:"i",title:"模板 = 一键落成一条完整告警链（传感器 + 推荐门限/触发值 + 分档事件），可再逐项微调。"},"i",-1))]),T.value?(C(),I(he,{key:0},[u("div",KI,H(w()),1),u("div",WI,[(C(!0),I(he,null,xe(V.value,$=>(C(),I("button",{key:$.key,class:ve(["tpl-card",{used:z($.key)}]),disabled:z($.key),onClick:Q=>ne($)},[u("span",XI,[we(H($.label)+" ",1),u("span",YI,H($.nominal)+"V",1)]),u("span",jI,"四档过压/欠压"+H(z($.key)?" · 已添加":""),1)],10,GI))),128)),u("button",{class:"tpl-card all",onClick:M},[...y[31]||(y[31]=[u("span",{class:"tpl-name"},"＋ 全部电压轨",-1),u("span",{class:"tpl-desc"},"一次加齐本板所有轨",-1)])])]),u("div",qI,[Te(u("input",{"onUpdate:modelValue":y[1]||(y[1]=$=>N.value=$),class:"num wide",placeholder:"自定义轨名，如 PVDDQ_ABCD",onKeyup:tv(q,["enter"])},null,544),[[Ue,N.value]]),u("button",{class:"btn",onClick:q},"添加")])],64)):(C(),I("div",ZI,[(C(!0),I(he,null,xe(b.value.quantities,$=>(C(),I("button",{key:$,class:ve(["tpl-card",{used:x($)}]),disabled:x($),onClick:Q=>v($)},[u("span",QI,[we(H(de(un)[$].label),1),u("span",e3,H(de(un)[$].kind==="threshold"?"门限":"状态"),1),we(H(x($)?" · 已添加":""),1)]),u("span",n3,H(X($)),1)],10,JI))),128))]))])):me("",!0)],4)):me("",!0),oe.value?(C(),I("div",{key:2,class:"add-backdrop",onClick:y[3]||(y[3]=$=>oe.value=!1)})):me("",!0),oe.value?(C(),I("div",{key:3,class:"add-pop",style:Fe(Ie.value),onClick:y[4]||(y[4]=Qe(()=>{},["stop"]))},[y[32]||(y[32]=u("div",{class:"add-title"},[we("选事件模板"),u("span",{class:"i",title:"模板 = 预置字典条目/触发值/方向/分级 的独立事件（不经传感器，直连数据源），加完可再逐项微调。"},"i")],-1)),u("div",t3,[(C(),I(he,null,xe(R,$=>u("button",{key:$.key,class:"tpl-card",onClick:Q=>k($)},[u("span",o3,H($.name),1),u("span",s3,H($.desc)+H($.eventKeyId?" · "+$.eventKeyId:""),1)],8,r3)),64))])],4)):me("",!0)])),u("div",i3,[u("div",{class:ve(["lane-head",{"no-chip":!as.value}])},[as.value?(C(),I("div",a3,"器件 · 数据源")):me("",!0),u("div",l3,[P0.value?(C(),I("div",u3,"传感器")):me("",!0),y[33]||(y[33]=u("div",{class:"lh-event"},"事件 / 告警（按类）",-1))])],2),Nt.value.length?me("",!0):(C(),I("div",c3,H(e.scopeChipKey==="__firmware"?"该固件通道暂无离散状态传感器或事件。":e.scopeChipKey?"该器件仅参与拓扑/在位识别，未承载遥测传感器，也无独立事件。":"还没有告警链路。上方选监控对象、点电压轨 / 监控量即可添加一条。"),1)),(C(!0),I(he,null,xe(Nt.value,$=>(C(),I("div",{key:$.chipKey,class:ve(["obj-block",{"no-chip":!as.value}]),ref_for:!0,ref:Q=>N0($.chipKey,Q)},[(C(),I("svg",d3,[(C(!0),I(he,null,xe(ua[$.chipKey]||[],Q=>(C(),I("path",{key:Q.id,d:Q.d,class:ve(["conn",{active:pt.value===Q.sensorId,dim:pt.value&&pt.value!==Q.sensorId,dashed:Q.dashed}])},null,10,f3))),128))])),as.value?(C(),I("div",{key:0,class:"chip-node","data-role":"obj",onMouseenter:Q=>D0(Q,$),onMouseleave:cs},[u("span",{class:ve(["cn-ic",{fw:$.chipKey==="__fw"}])},[...y[34]||(y[34]=[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M9 3h6v2h3a1 1 0 0 1 1 1v3h2v2h-2v2h2v2h-2v3a1 1 0 0 1-1 1h-3v2H9v-2H6a1 1 0 0 1-1-1v-3H3v-2h2v-2H3V9h2V6a1 1 0 0 1 1-1h3V3zm0 5v8h6V8H9z"})],-1)])],2),u("span",h3,H($.chipLabel),1),u("span",v3,H($.subLabel),1),u("span",m3,H($.sensorCount?$.sensorCount+" 传感器 · ":"")+H($.eventCount)+" 事件",1)],40,p3)):me("",!0),u("div",_3,[(C(!0),I(he,null,xe($.sensors,Q=>(C(),I("div",{key:Q.sensor.configId,class:ve(["se-row",[Q.sensor.kind,{open:p.value===Q.sensor.configId,hot:pt.value===Q.sensor.configId}]]),onMouseenter:Ce=>pt.value=Q.sensor.configId,onMouseleave:y[5]||(y[5]=Ce=>pt.value=null)},[u("div",y3,[u("button",{class:"sensor-card","data-sensor-card":Q.sensor.configId,onMouseenter:Ce=>M0(Ce,Q),onMouseleave:cs,onClick:Ce=>ze(Q.sensor.configId)},[y[36]||(y[36]=u("span",{class:"sc-ic"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"})])],-1)),u("span",S3,H(Qr(Q)),1),u("span",b3,H(Q.sensor.kind==="threshold"?"门限":"状态"),1),u("i",{class:ve(["dot sc-dsdot",ls(Q.cfg)?"ok":"warn"]),title:ls(Q.cfg)?"数据源已接":"数据源未接"},null,10,E3),u("span",{class:ve(["sc-chev",{open:p.value===Q.sensor.configId}])},[...y[35]||(y[35]=[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M8.5 5l7 7-7 7z"})],-1)])],2)],40,C3),u("button",{class:"branch-del",title:"删除该链路及其告警",onClick:Qe(Ce=>Y(Q.cfg.id),["stop"])},"✕",8,w3)]),u("div",I3,[Q.sensor.events.length?me("",!0):(C(),I("div",P3,"未设门限 · 暂无告警")),(C(!0),I(he,null,xe(Q.sensor.events,Ce=>(C(),I("button",{key:Ce.key,class:ve(["event-node click",Ce.severity]),"data-event-of":Q.sensor.configId,onMouseenter:Le=>gu(Le,Ce.label,Ce.eventKeyId,Ce.operator+" "+Ce.conditionLabel,Ce.severity||"Major","属于 "+Qr(Q)),onMouseleave:cs,onClick:Qe(Le=>rn(Q.sensor.configId,Ce.eventKeyId),["stop"])},[y[37]||(y[37]=u("span",{class:"en-ic"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"})])],-1)),u("span",x3,H(Ce.label),1)],42,$3))),128))])],42,g3))),128)),$.cats.length?(C(),I("div",{key:0,class:ve(["se-row loose-row",{"no-sensor":!$.sensors.length}])},[$.sensors.length?(C(),I("div",D3)):me("",!0),u("div",M3,[(C(!0),I(he,null,xe($.cats,Q=>(C(),I("div",{key:$.chipKey+":"+Q.cat,class:ve(["cat-grp",Q.cat])},[u("div",{class:ve(["cat-head",[Q.cat,{hot:pt.value===$.chipKey+":"+Q.cat}]]),"data-cat-head":$.chipKey+":"+Q.cat,onMouseenter:Ce=>pt.value=$.chipKey+":"+Q.cat,onMouseleave:y[6]||(y[6]=Ce=>pt.value=null)},[y[38]||(y[38]=u("span",{class:"cat-dot"},null,-1)),u("span",T3,H(Q.label),1),u("span",V3,H(Q.events.length),1)],42,k3),u("div",N3,[(C(!0),I(he,null,xe(Q.events,Ce=>(C(),I("button",{key:Ce.id,class:ve(["event-node click",[Ce.severity,{open:U.value===Ce.id,off:!Ce.enabled}]]),onMouseenter:Le=>gu(Le,Ce.label,Ce.eventKeyId,ra(Ce.operatorId)+" "+Ce.condition,Ce.severity,"独立事件 · 直连器件"),onMouseleave:cs,onClick:Qe(Le=>W(Ce.id),["stop"])},[y[39]||(y[39]=u("span",{class:"en-ic"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"})])],-1)),u("span",F3,H(Ce.label),1),u("span",O3,H(ra(Ce.operatorId))+" "+H(Ce.condition),1)],42,A3))),128))])],2))),128))])],2)):me("",!0)])],2))),128))]),ke.value||ee.value?(C(),I("div",R3,[u("div",{class:"fa-group",title:"将写入 "+i.value+".sr"},[u("button",{class:"btn",onClick:T0,title:"在右侧分屏打开对应代码文件"},[...y[40]||(y[40]=[u("svg",{class:"btn-ic",viewBox:"0 0 24 24","aria-hidden":"true"},[u("path",{d:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"})],-1),we("代码 ",-1)])]),u("button",{class:"btn-solid",onClick:k0,title:"复制本板生成的全部 CSR 对象(JSON)到剪贴板，可粘贴进 .sr"},H(aa.value?"已复制 CSR":"复制 CSR"),1)],8,B3)])):me("",!0),p.value&&m.value&&Ve.value||U.value&&D.value?(C(),I("div",{key:1,class:"cfg-backdrop",onClick:Qe(on,["self"])},[p.value&&m.value&&Ve.value?(C(),I("div",{key:0,ref_key:"cfgCardEl",ref:g,class:"cfg-card"},[u("div",L3,[y[41]||(y[41]=u("span",{class:"cfg-ic sensor"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"})])],-1)),u("div",U3,[u("span",H3,[we(H(Qr(Ve.value)),1),u("span",z3,H(er(m.value)?"门限传感器":"状态传感器"),1)]),u("span",K3,H(de(un)[m.value.quantityKey].explain),1)]),u("button",{class:"cfg-x",title:"关闭 (Esc)",onClick:on},"✕")]),u("div",W3,[se.value.length?(C(),I("div",G3,[y[42]||(y[42]=u("span",{class:"todo-ic"},"!",-1)),u("span",X3,"还有 "+H(se.value.length)+" 处待配置",1),(C(!0),I(he,null,xe(se.value,$=>(C(),I("button",{key:$.key,class:"todo-chip",onClick:Q=>O($.key)},H($.label),9,Y3))),128))])):me("",!0),u("div",{class:ve(["chain-step",{todo:!P.value}]),"data-step":"ds"},[...y[43]||(y[43]=[u("span",{class:"cs-n"},"1",-1),u("span",{class:"cs-t"},"数据源",-1)])],2),u("div",j3,[u("label",null,[y[44]||(y[44]=we("取数方式",-1)),u("i",{class:"i",title:m.value.dsMode==="scanner"?de(pd).scanner:de(pd).deviceField},"i",8,q3)]),Te(u("select",{"onUpdate:modelValue":y[7]||(y[7]=$=>m.value.dsMode=$),class:"disc-sel wide"},[...y[45]||(y[45]=[u("option",{value:"device-field"},"器件读数 · 订阅器件语义量（推荐）",-1),u("option",{value:"scanner"},"从寄存器周期读（高级 · 需选硬件信号）",-1)])],512),[[Zn,m.value.dsMode]])]),m.value.dsMode==="device-field"?(C(),I(he,{key:1},[u("div",Z3,[u("label",null,[y[46]||(y[46]=we("器件(Component)",-1)),Te(u("input",{"onUpdate:modelValue":y[8]||(y[8]=$=>m.value.deviceKey=$),class:"thr-in w",placeholder:"System"},null,512),[[Ue,m.value.deviceKey]])]),u("label",null,[y[47]||(y[47]=we("读数字段(Field)",-1)),Te(u("input",{"onUpdate:modelValue":y[9]||(y[9]=$=>m.value.readingField=$),class:"thr-in w",placeholder:de(un)[m.value.quantityKey].readingField+"（默认）"},null,8,J3),[[Ue,m.value.readingField]])])]),u("div",Q3,[y[48]||(y[48]=we("→ 订阅 ",-1)),u("code",null,H(m.value.deviceKey||"?")+"."+H(m.value.readingField&&m.value.readingField.trim()||de(un)[m.value.quantityKey].readingField),1)])],64)):me("",!0),m.value.dsMode==="scanner"?(C(),I(he,{key:2},[u("div",eP,[u("label",null,[y[49]||(y[49]=we("硬件信号(Chip)",-1)),Te(u("input",{"onUpdate:modelValue":y[10]||(y[10]=$=>m.value.dsChip=$),class:"thr-in w",placeholder:"Smc_..."},null,512),[[Ue,m.value.dsChip]])]),u("label",null,[y[50]||(y[50]=we("偏移(Offset)",-1)),Te(u("input",{"onUpdate:modelValue":y[11]||(y[11]=$=>m.value.dsOffset=$),type:"number",class:"thr-in w"},null,512),[[Ue,m.value.dsOffset,void 0,{number:!0}]])]),u("label",null,[y[51]||(y[51]=we("字节(Size)",-1)),Te(u("input",{"onUpdate:modelValue":y[12]||(y[12]=$=>m.value.dsSize=$),type:"number",class:"thr-in w"},null,512),[[Ue,m.value.dsSize,void 0,{number:!0}]])]),u("label",null,[y[52]||(y[52]=we("掩码(Mask)",-1)),Te(u("input",{"onUpdate:modelValue":y[13]||(y[13]=$=>m.value.dsMask=$),type:"number",class:"thr-in w"},null,512),[[Ue,m.value.dsMask,void 0,{number:!0}]])])]),u("div",nP,[y[53]||(y[53]=u("label",null,"采集周期",-1)),Te(u("select",{"onUpdate:modelValue":y[14]||(y[14]=$=>m.value.periodMs=$),class:"disc-sel wide",title:"来自 README §6 扫描周期分类"},[(C(!0),I(he,null,xe(de(Ws),$=>(C(),I("option",{key:$.periodMs+$.label,value:$.periodMs},H($.label)+" · "+H($.periodMs)+"ms"+H(de(fd)(de(un)[m.value.quantityKey].recommend.periodKey).periodMs===$.periodMs?"（推荐）":""),9,tP))),128))],512),[[Zn,m.value.periodMs,void 0,{number:!0}]])]),m.value.debounce&&m.value.debounce!=="None"||m.value.scanEnabled?(C(),I("div",rP,[m.value.debounce&&m.value.debounce!=="None"?(C(),I(he,{key:0},[we("去抖滤波 "+H(m.value.debounce)+"（"+H(/^MidAvg/.test(m.value.debounce)?"滑动均值":/^ContBin/.test(m.value.debounce)?"N 连续判定":"滤波")+"）",1)],64)):me("",!0),m.value.scanEnabled?(C(),I(he,{key:1},[we(" · 上电门控 "+H(m.value.scanEnabled)+"（就绪才扫描）",1)],64)):me("",!0)])):me("",!0)],64)):me("",!0),u("div",{class:ve(["chain-step",{todo:!A.value}]),"data-step":"thr"},[y[54]||(y[54]=u("span",{class:"cs-n"},"2",-1)),u("span",oP,H(er(m.value)?"门限":"触发条件"),1)],2),er(m.value)?(C(),I("div",sP,[(C(),I(he,null,xe(re,$=>u("div",{key:$,class:ve(["thr-pill",{off:m.value.thresholds[$]==null}]),title:ie[$]+" 门限"},[u("span",aP,H(ie[$]),1),Te(u("input",{"onUpdate:modelValue":Q=>m.value.thresholds[$]=Q,type:"number",class:"thr-in",placeholder:ta(m.value,$)!=null?"关":"—"},null,8,lP),[[Ue,m.value.thresholds[$],void 0,{number:!0}]]),ta(m.value,$)!=null?(C(),I("span",uP,"荐"+H(ta(m.value,$)),1)):me("",!0)],10,iP)),64)),u("span",cP,H($0(m.value)),1)])):(C(),I("div",dP,"离散状态量：无门限档，命中在下方每条事件的「触发值」判定。")),er(m.value)?(C(),I("div",fP,[u("label",null,[y[55]||(y[55]=we("迟滞",-1)),u("i",{class:"i",title:"回差防抖：读数在门限附近抖动时避免反复告警。推荐 "+(de(un)[m.value.quantityKey].recommend.hysteresis??2)},"i",8,pP)]),Te(u("input",{"onUpdate:modelValue":y[15]||(y[15]=$=>m.value.hysteresis=$),type:"number",class:"thr-in w"},null,512),[[Ue,m.value.hysteresis,void 0,{number:!0}]])])):me("",!0),u("div",{class:ve(["chain-step",{todo:!L.value}]),"data-step":"ev"},[y[56]||(y[56]=u("span",{class:"cs-n"},"3",-1)),y[57]||(y[57]=u("span",{class:"cs-t"},"事件 / 告警",-1)),F.value?(C(),I("span",hP,"← 你点的事件属于本传感器")):me("",!0),u("button",{class:"ev-add",onClick:y[16]||(y[16]=$=>K(m.value))},"＋ 添加事件")],2),er(m.value)?(C(!0),I(he,{key:6},xe(m.value.events,$=>(C(),I("div",{key:$.id,class:ve(["ev-edit",{inactive:us(m.value,$.levelField)==null||!$.enabled,focused:F.value===$.eventKeyId}])},[u("div",vP,[u("label",mP,[y[58]||(y[58]=u("span",{class:"ef-k"},"名称",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.label=Q,type:"text",class:"thr-in wnm",placeholder:"事件名"},null,8,_P),[[Ue,$.label]])]),u("button",{class:"ev-del",title:"删除该事件",onClick:Q=>j(m.value,$.id)},"✕",8,gP)]),u("div",yP,[u("label",CP,[u("span",SP,[y[59]||(y[59]=we("档位",-1)),u("i",{class:"i",title:$.levelField?"监视该档门限，触发值自动引用 "+Ve.value.sensor.sensorKey+"."+$.levelField+(us(m.value,$.levelField)!=null?" = "+us(m.value,$.levelField):"（该档未设，可点“设推荐”）"):"选择监视哪一档门限"},"i",8,bP)]),Te(u("select",{"onUpdate:modelValue":Q=>$.levelField=Q,class:"disc-sel",onChange:Q=>J($)},[(C(),I(he,null,xe(re,Q=>u("option",{key:Q,value:Q},H(ie[Q])+H(m.value.thresholds[Q]!=null?" = "+m.value.thresholds[Q]:"（未设）"),9,wP)),64))],40,EP),[[Zn,$.levelField]])]),u("span",IP,[u("span",PP,[y[60]||(y[60]=we("方向",-1)),u("i",{class:"i",title:oa($.operatorId)},"i",8,$P)]),u("span",xP,H(ra($.operatorId))+" 门限",1)]),u("label",DP,[u("span",MP,[y[61]||(y[61]=we("分级",-1)),u("i",{class:"i",title:sa($.severity)},"i",8,kP)]),Te(u("select",{"onUpdate:modelValue":Q=>$.severity=Q,class:"disc-sel"},[(C(),I(he,null,xe(ae,Q=>u("option",{key:Q.v,value:Q.v},H(Q.label),9,VP)),64))],8,TP),[[Zn,$.severity]])]),$.component!=null?(C(),I("label",NP,[y[62]||(y[62]=u("span",{class:"ef-k"},"归属 FRU",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.component=Q,class:"ea-in",placeholder:"Component_*"},null,8,AP),[[Ue,$.component]])])):me("",!0),$.evHysteresis!=null?(C(),I("label",FP,[y[63]||(y[63]=u("span",{class:"ef-k"},"迟滞",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.evHysteresis=Q,type:"number",class:"ea-in num"},null,8,OP),[[Ue,$.evHysteresis,void 0,{number:!0}]])])):me("",!0),$.ledFaultCode!=null?(C(),I("label",RP,[y[64]||(y[64]=u("span",{class:"ef-k"},"面板故障码",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.ledFaultCode=Q,class:"ea-in num",placeholder:"A00"},null,8,BP),[[Ue,$.ledFaultCode]])])):me("",!0),$.invalidReading!=null?(C(),I("label",LP,[y[65]||(y[65]=u("span",{class:"ef-k"},"无效读数",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.invalidReading=Q,type:"number",class:"ea-in num"},null,8,UP),[[Ue,$.invalidReading,void 0,{number:!0}]])])):me("",!0),u("label",HP,[y[67]||(y[67]=u("span",{class:"ef-k"},[we("告警字典条目"),u("i",{class:"i",title:"EventKeyId：决定告警在字典中的文案与等级映射，首项为推荐。"},"i")],-1)),Te(u("select",{"onUpdate:modelValue":Q=>$.eventKeyId=Q,class:ve(["disc-sel wide",{"todo-field":!$.eventKeyId}])},[y[66]||(y[66]=u("option",{value:"",disabled:""},"待选…",-1)),(C(!0),I(he,null,xe(te(m.value),(Q,Ce)=>(C(),I("option",{key:Q,value:Q},H(Q)+H(Ce===0?"（推荐）":""),9,KP))),128))],10,zP),[[Zn,$.eventKeyId]])]),$.levelField&&us(m.value,$.levelField)==null?(C(),I("button",{key:4,class:"ev-fix",onClick:Q=>pe(m.value,$.levelField)},"该档未设 · 设推荐",8,WP)):me("",!0)]),u("div",GP,[u("label",XP,[Te(u("input",{type:"checkbox",class:"sw","onUpdate:modelValue":Q=>$.enabled=Q},null,8,YP),[[Ca,$.enabled]]),y[68]||(y[68]=u("span",{class:"ev-en-l"},"启用",-1))])])],2))),128)):(C(!0),I(he,{key:7},xe(m.value.events,$=>(C(),I("div",{key:$.id,class:ve(["ev-edit",{inactive:!$.enabled,focused:F.value===$.eventKeyId}])},[u("div",jP,[u("label",qP,[y[69]||(y[69]=u("span",{class:"ef-k"},"名称",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.label=Q,type:"text",class:"thr-in wnm",placeholder:"事件名"},null,8,ZP),[[Ue,$.label]])]),u("button",{class:"ev-del",title:"删除该事件",onClick:Q=>j(m.value,$.id)},"✕",8,JP)]),u("div",QP,[u("label",e$,[y[70]||(y[70]=u("span",{class:"ef-k"},[we("触发值"),u("i",{class:"i",title:"读数命中该值即告警；离散量一般 1=置位/故障，0=不在位。"},"i")],-1)),u("span",n$,[Te(u("input",{"onUpdate:modelValue":Q=>$.condition=Q,type:"number",class:"thr-in w rin"},null,8,t$),[[Ue,$.condition,void 0,{number:!0}]]),u("i",r$,"荐"+H(de(un)[m.value.quantityKey].recommend.condition??1),1)])]),u("label",o$,[u("span",s$,[y[71]||(y[71]=we("方向",-1)),u("i",{class:"i",title:oa($.operatorId)},"i",8,i$)]),Te(u("select",{"onUpdate:modelValue":Q=>$.operatorId=Q,class:"disc-sel"},[(C(!0),I(he,null,xe(de(bo),Q=>(C(),I("option",{key:Q.id,value:Q.id},H(Q.symbol)+" "+H(Q.label)+H(Q.id===de(un)[m.value.quantityKey].recommend.operatorId?"（推荐）":""),9,l$))),128))],8,a$),[[Zn,$.operatorId,void 0,{number:!0}]])]),u("label",u$,[u("span",c$,[y[72]||(y[72]=we("分级",-1)),u("i",{class:"i",title:sa($.severity)},"i",8,d$)]),Te(u("select",{"onUpdate:modelValue":Q=>$.severity=Q,class:"disc-sel"},[(C(),I(he,null,xe(ae,Q=>u("option",{key:Q.v,value:Q.v},H(Q.label),9,p$)),64))],8,f$),[[Zn,$.severity]])]),$.component!=null?(C(),I("label",h$,[y[73]||(y[73]=u("span",{class:"ef-k"},"归属 FRU",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.component=Q,class:"ea-in",placeholder:"Component_*"},null,8,v$),[[Ue,$.component]])])):me("",!0),$.evHysteresis!=null?(C(),I("label",m$,[y[74]||(y[74]=u("span",{class:"ef-k"},"迟滞",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.evHysteresis=Q,type:"number",class:"ea-in num"},null,8,_$),[[Ue,$.evHysteresis,void 0,{number:!0}]])])):me("",!0),$.ledFaultCode!=null?(C(),I("label",g$,[y[75]||(y[75]=u("span",{class:"ef-k"},"面板故障码",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.ledFaultCode=Q,class:"ea-in num",placeholder:"A00"},null,8,y$),[[Ue,$.ledFaultCode]])])):me("",!0),$.invalidReading!=null?(C(),I("label",C$,[y[76]||(y[76]=u("span",{class:"ef-k"},"无效读数",-1)),Te(u("input",{"onUpdate:modelValue":Q=>$.invalidReading=Q,type:"number",class:"ea-in num"},null,8,S$),[[Ue,$.invalidReading,void 0,{number:!0}]])])):me("",!0),u("label",b$,[y[78]||(y[78]=u("span",{class:"ef-k"},[we("告警字典条目"),u("i",{class:"i",title:"EventKeyId：决定告警在字典中的文案与等级映射，首项为推荐。"},"i")],-1)),Te(u("select",{"onUpdate:modelValue":Q=>$.eventKeyId=Q,class:ve(["disc-sel wide",{"todo-field":!$.eventKeyId}])},[y[77]||(y[77]=u("option",{value:"",disabled:""},"待选…",-1)),(C(!0),I(he,null,xe(te(m.value),(Q,Ce)=>(C(),I("option",{key:Q,value:Q},H(Q)+H(Ce===0?"（推荐）":""),9,w$))),128))],10,E$),[[Zn,$.eventKeyId]])])]),u("div",I$,[u("label",P$,[Te(u("input",{type:"checkbox",class:"sw","onUpdate:modelValue":Q=>$.enabled=Q},null,8,$$),[[Ca,$.enabled]]),y[79]||(y[79]=u("span",{class:"ev-en-l"},"启用",-1))])])],2))),128)),!er(m.value)&&m.value.selEvents&&m.value.selEvents.length?(C(),I(he,{key:8},[y[80]||(y[80]=u("div",{class:"sc-sec-cap"},[we("SEL 事件"),u("span",{class:"sc-explain"},"IPMI 系统事件日志生成（DiscreteEvent，来自 .sr，只读）")],-1)),u("div",x$,[(C(!0),I(he,null,xe(m.value.selEvents,$=>(C(),I("div",{key:$.name,class:"sel-row"},[u("code",null,H($.name),1),u("span",D$,H($.summary),1)]))),128))])],64)):me("",!0),(C(!0),I(he,null,xe(Ve.value.warnings,$=>(C(),I("div",{key:$,class:"fn-warn"},H($),1))),128))])],512)):U.value&&D.value?(C(),I("div",M$,[u("div",k$,[y[82]||(y[82]=u("span",{class:"cfg-ic event"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"})])],-1)),u("div",T$,[u("span",V$,[we(H(D.value.label),1),y[81]||(y[81]=u("span",{class:"cfg-badge"},"独立事件",-1))]),u("span",N$,H(D.value.eventKeyId)+" · 不经传感器，直连器件数据源",1)]),u("button",{class:"cfg-x",title:"关闭 (Esc)",onClick:on},"✕")]),u("div",A$,[u("div",F$,[u("div",O$,[u("label",R$,[y[83]||(y[83]=u("span",{class:"ef-k"},"名称",-1)),Te(u("input",{"onUpdate:modelValue":y[17]||(y[17]=$=>D.value.label=$),type:"text",class:"thr-in wnm",placeholder:"事件名"},null,512),[[Ue,D.value.label]])])]),u("div",B$,[u("label",L$,[y[84]||(y[84]=u("span",{class:"ef-k"},[we("触发值"),u("i",{class:"i",title:"读数命中该值即告警（电压限值 / PMBus 状态位 / 在位标志）。"},"i")],-1)),Te(u("input",{"onUpdate:modelValue":y[18]||(y[18]=$=>D.value.condition=$),type:"number",class:"thr-in w"},null,512),[[Ue,D.value.condition,void 0,{number:!0}]])]),u("label",U$,[u("span",H$,[y[85]||(y[85]=we("方向",-1)),u("i",{class:"i",title:oa(D.value.operatorId)},"i",8,z$)]),Te(u("select",{"onUpdate:modelValue":y[19]||(y[19]=$=>D.value.operatorId=$),class:"disc-sel"},[(C(!0),I(he,null,xe(de(bo),$=>(C(),I("option",{key:$.id,value:$.id},H($.symbol)+" "+H($.label),9,K$))),128))],512),[[Zn,D.value.operatorId,void 0,{number:!0}]])]),u("label",W$,[u("span",G$,[y[86]||(y[86]=we("分级",-1)),u("i",{class:"i",title:sa(D.value.severity)},"i",8,X$)]),Te(u("select",{"onUpdate:modelValue":y[20]||(y[20]=$=>D.value.severity=$),class:"disc-sel"},[(C(),I(he,null,xe(ae,$=>u("option",{key:$.v,value:$.v},H($.label),9,Y$)),64))],512),[[Zn,D.value.severity]])]),D.value.component!=null?(C(),I("label",j$,[y[87]||(y[87]=u("span",{class:"ef-k"},"归属 FRU",-1)),Te(u("input",{"onUpdate:modelValue":y[21]||(y[21]=$=>D.value.component=$),class:"ea-in",placeholder:"Component_*"},null,512),[[Ue,D.value.component]])])):me("",!0),D.value.evHysteresis!=null?(C(),I("label",q$,[y[88]||(y[88]=u("span",{class:"ef-k"},"迟滞",-1)),Te(u("input",{"onUpdate:modelValue":y[22]||(y[22]=$=>D.value.evHysteresis=$),type:"number",class:"ea-in num"},null,512),[[Ue,D.value.evHysteresis,void 0,{number:!0}]])])):me("",!0),D.value.ledFaultCode!=null?(C(),I("label",Z$,[y[89]||(y[89]=u("span",{class:"ef-k"},"面板故障码",-1)),Te(u("input",{"onUpdate:modelValue":y[23]||(y[23]=$=>D.value.ledFaultCode=$),class:"ea-in num",placeholder:"A00"},null,512),[[Ue,D.value.ledFaultCode]])])):me("",!0),D.value.invalidReading!=null?(C(),I("label",J$,[y[90]||(y[90]=u("span",{class:"ef-k"},"无效读数",-1)),Te(u("input",{"onUpdate:modelValue":y[24]||(y[24]=$=>D.value.invalidReading=$),type:"number",class:"ea-in num"},null,512),[[Ue,D.value.invalidReading,void 0,{number:!0}]])])):me("",!0),(C(!0),I(he,null,xe(D.value.descArgs,($,Q)=>(C(),I("label",{key:Q,class:"ef"},[u("span",Q$,"参数"+H(Q+1),1),Te(u("input",{"onUpdate:modelValue":Ce=>D.value.descArgs[Q]=Ce,class:"ea-in"},null,8,e4),[[Ue,D.value.descArgs[Q]]])]))),128)),u("label",n4,[y[91]||(y[91]=u("span",{class:"ef-k"},[we("告警字典条目"),u("i",{class:"i",title:"EventKeyId：决定告警在字典中的文案与等级映射，首项为推荐。"},"i")],-1)),Te(u("input",{"onUpdate:modelValue":y[25]||(y[25]=$=>D.value.eventKeyId=$),type:"text",class:"thr-in wkey",placeholder:"Namespace.EventName"},null,512),[[Ue,D.value.eventKeyId]])])]),u("div",t4,[u("label",r4,[Te(u("input",{type:"checkbox",class:"sw","onUpdate:modelValue":y[26]||(y[26]=$=>D.value.enabled=$)},null,512),[[Ca,D.value.enabled]]),y[92]||(y[92]=u("span",{class:"ev-en-l"},"启用",-1))])])])])])):me("",!0)])):me("",!0),ln.show?(C(),I("div",{key:2,class:"hover-tip",style:Fe({left:ln.x+"px",top:ln.y+"px"})},[u("div",o4,H(ln.head),1),ln.sub?(C(),I("div",s4,H(ln.sub),1)):me("",!0),(C(!0),I(he,null,xe(ln.rows,$=>(C(),I("div",{key:$.k,class:"ht-row"},[u("span",i4,H($.k),1),u("span",a4,H($.v),1)]))),128))],4)):me("",!0)]))}}),Dl=ft(l4,[["__scopeId","data-v-f20e2e06"]]),u4={EXU:"SMC 扫描 + LM75",CLU:"SMC 扫描",SEU:"RAID / 存储固件",PSU:"PMBus 器件",BCU:"SMC 扫描",PSR:"PMBus 器件"};function w0(e){return/Fail|Nonrecoverable|Fatal/i.test(e)?"crit":/Major|Critical/i.test(e)?"maj":"min"}function c4(e){let n=0,t=0,r=0,o=0;for(const[s,i]of Object.entries(e.objects)){const a=Zt(s);if(a==="ThresholdSensor")n++;else if(a==="DiscreteSensor")t++;else if(a==="Event"){r++;const l=typeof i.EventKeyId=="string"?i.EventKeyId:"";/^Chassis\./.test(l)&&o++}}return{name:e.unitName,type:e.unitType,chips:e.chips.length,thresholdSensors:n,discreteSensors:t,events:r,chassisEvents:o,sourceModel:u4[e.unitType]||"—"}}function d4(){return na().map(c4)}function f4(e){const n=na().find(t=>t.unitName===e);return n?ea(n.objects).map(t=>({name:t.name.replace(/^ThresholdSensor_|^DiscreteSensor_/,""),kind:t.kind,events:t.events.map(r=>({name:r.name.replace(/^Event_/,""),keyId:r.eventKeyId,level:r.level,severity:w0(r.eventKeyId)}))})):[]}function p4(){const e=[];for(const n of na())for(const[t,r]of Object.entries(n.objects)){if(Zt(t)!=="Event")continue;const o=typeof r.EventKeyId=="string"?r.EventKeyId:"";/^Chassis\./.test(o)&&e.push({board:n.unitName,keyId:o,name:o.replace(/^Chassis\./,""),severity:w0(o)})}return e}function h4(){const e=[];for(const n of na())for(const t of ea(n.objects))t.events.some(r=>/^Chassis\./.test(r.eventKeyId))&&e.push({board:n.unitName,name:t.name.replace(/^ThresholdSensor_|^DiscreteSensor_/,""),kind:t.kind,thresholds:t.thresholds,events:t.events.map(r=>({eventKeyId:r.eventKeyId,level:r.level}))});return e}function v4(){const e=new Map;for(const t of h4())(e.get(t.name)??e.set(t.name,[]).get(t.name)).push(t);const n=[];for(const[t,r]of e){if(r.length<2)continue;const o=new Set;r.forEach(s=>Object.keys(s.thresholds).forEach(i=>o.add(i)));for(const s of o){const i=r.map(a=>({board:a.board,value:a.thresholds[s]})).filter(a=>a.value!=null);i.length>1&&new Set(i.map(a=>a.value)).size>1&&n.push({name:t,field:s,values:i})}}return n}const Ka=[40,510,1450],m4={EXU:1020,BCU:520,CLU:200,IEU:450,NICCard:250,Unknown:120},_4=310,g4=250,Ds=64,y4=500;function C4(e){return e.name.startsWith("M2")?200:300}function _d(e,n={}){var M;const t=pw(fw(mu)),r=t.filter(dd),o=t.filter(q=>!dd(q)),s=r.filter(q=>q.category==="exu"),i=r.filter(q=>q.category!=="exu"),a=[],l=[];function c(q){return q.type==="SEU"?C4(q):m4[q.type]??g4}const d=i.reduce((q,v)=>q+c(v),0)+Math.max(0,i.length-1)*Ds,f=y4,h="bmc-root";a.push({id:h,type:"bmc",position:{x:Ka[0],y:f-_4/2},data:It({label:"BMC",subtitle:"根节点 · openUBMC"}),draggable:!0,selectable:!0});const p=5,E=i.map(q=>{const X=Zr(q.type,q.name).buses.filter(w=>!w.dashed).map(({id:w,label:Y,busType:K,color:j})=>({id:w,label:Y,busType:K,color:j}));return X.length>0?X:[{id:"fallback",label:"",busType:"default",color:uo.default}]}),b=[],T=Math.max(0,...E.map(q=>q.length));for(let q=0;q<T;q++)for(let v=0;v<i.length;v++)q<E[v].length&&b.push({groupIdx:v,busIdxInGroup:q,bus:E[v][q]});const V=b.length,z=b.map((q,v)=>({id:`r-${i[q.groupIdx].id}-${q.bus.id}`,pct:(v+.5)/V,color:uo[q.bus.busType]??q.bus.color??uo.default})),x=s.reduce((q,v)=>q+c(v),0)+Math.max(0,s.length-1)*Ds;let N=f-x/2;const re=[];for(const q of s){const v=q.id;re.push(v),a.push({id:v,type:"boardgroup",position:{x:Ka[1],y:N},data:{group:q,selectedId:n[q.id]??q.boards[0].id,onSelect:e,sourceHandles:z},draggable:!0,selectable:!0}),l.push({id:`e-${h}-${v}`,source:h,sourceHandle:"r",target:v,targetHandle:"l",type:"smoothstep",class:"edge-trunk",style:{stroke:"#818cf8",strokeWidth:2,opacity:.9}}),N+=c(q)+Ds}let ie=f-d/2;const ae=re[0],fe=i.length,le=40,ne=fe>1?(270-le)/(fe-1):0;for(let q=0;q<i.length;q++){const v=i[q],X=v.id,w=(fe-1-q)*ne+le,Y=E[q],K=Y.length;if(a.push({id:X,type:"boardgroup",position:{x:Ka[2],y:ie},data:{group:v,selectedId:n[v.id]??((M=v.boards[0])==null?void 0:M.id)??"",onSelect:e},draggable:!0,selectable:!0}),ae){let j,J=.88,te;switch(v.state){case"multi-match":te="#f59e0b",j="5 3";break;case"type-placeholder":te="#eab308",j="5 3";break;case"missing":te="#ef4444",j="3 3",J=.75;break}for(let pe=0;pe<K;pe++){const ye=Y[pe],ge=(pe-(K-1)/2)*p,_e=te??uo[ye.busType]??ye.color??uo.default;l.push({id:`e-${ae}-${X}-${ye.id}`,source:ae,sourceHandle:`r-${X}-${ye.id}`,target:X,targetHandle:"l",type:"manhattan",data:{laneOffset:w,yOffAtTarget:ge,groupId:X},style:{stroke:_e,strokeWidth:1.5,strokeDasharray:j,opacity:J}})}}ie+=c(v)+Ds}return{nodes:a,edges:l,groups:t,unclassifiedGroups:o}}function _u(e,n){const t=Zr(e,n),r=[];for(const o of t.buses){for(const s of o.chips)r.push(s.chipType);if(o.mux)for(const s of o.mux.chips)r.push(s.chipType)}return r}function I0(e,n){var r;const t=Zr(e,n);for(const o of t.buses){const s=o.chips.find(a=>a.chipType==="Smc");if(s)return`${o.label} / ${s.label}`;const i=(r=o.mux)==null?void 0:r.chips.find(a=>a.chipType==="Smc");if(i)return`${o.label} · ${o.mux.label} / ${i.label}`}}function Ml(e,n){const t=_u(e,n);return e==="CLU"?{func:"0x03",label:"Fan 风扇控制"}:t.includes("Lm75")?{func:"0x0C",label:"Thermal 温度管理"}:t.includes("VRD")?{func:"0x02",label:"Power 电源管理"}:e==="SEU"?{func:"0x10",label:"Storage 存储"}:e==="NICCard"?{func:"0x20",label:"Network 网络"}:{func:"0x01",label:"System 系统管理"}}function kl(e,n){const t=_u(e,n);return t.includes("Lm75")?"$1 | mul 0.125 | round 1":t.includes("VRD")?"$1 | mul 4 | div 1000 | round 3":"$1 | mul 100 | div 256 | toHex 4"}function gd(e){const n=_u(e.type,e.name),t=e.connectors??[],r=t.filter(s=>/fan|clu/i.test(s.name+s.type)).map(s=>s.name),o=[];return n.includes("Lm75")&&o.push(`${e.name} 板温(Lm75)`),t.filter(s=>/disk|seu/i.test(s.name+s.type)).forEach(s=>o.push(`${s.name} 盘温`)),(e.type==="BCU"||n.includes("CPU"))&&o.push("CpuInlet 进风口"),{fans:r.length?r:e.type==="CLU"?[`${e.name} 风扇组`]:[],tempZones:o}}const S4={class:"topo-root"},b4={key:1,class:"topo-palette open"},E4={class:"panel-hd"},w4={class:"ph-actions"},I4={class:"ov-stats"},P4={class:"ov-stat"},$4={class:"ov-n"},x4={class:"ov-stat"},D4={class:"ov-n"},M4={class:"ov-stat"},k4={class:"ov-n"},T4={class:"ov-stat"},V4={class:"ov-n"},N4={class:"ov-stat"},A4={class:"ov-n"},F4={class:"hw-search-row"},O4={class:"mgr-scroll"},R4={class:"sec-hd"},B4={viewBox:"0 0 24 24",width:"10",height:"10",style:{color:"var(--foreground-muted)",transform:"rotate(90deg)","flex-shrink":"0"},fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round"},L4={class:"hw-tree"},U4=["onClick"],H4={class:"hw-cat-label"},z4={class:"hw-count"},K4={key:0,class:"hw-cat-body"},W4=["title","onClick"],G4={key:1,class:"hw-caret hw-caret-empty"},X4=["title"],Y4={class:"hw-grp-name"},j4=["disabled","onClick"],q4={key:0,class:"hw-detail"},Z4={class:"hw-files"},J4=["title","onClick"],Q4={class:"hw-file-name"},ex={class:"ov-soft"},nx={class:"ov-soft-sensor"},tx={class:"ov-soft-name"},rx={class:"ov-soft-cnt"},ox={key:0,class:"ov-soft-events"},sx=["title"],ix={key:1,class:"unc-popover"},ax={key:0,class:"unc-empty"},lx=["onClick"],ux={class:"unc-slot-type"},cx={class:"unc-slot-name"},dx={class:"ov-body"},fx={class:"ov-chs-list"},px={key:0,class:"ov-empty"},hx=["title"],vx={class:"ov-chs-nm"},mx={class:"ov-chs-bd"},_x={key:0,class:"ov-card ov-warn"},gx={class:"ov-cap"},yx={class:"ov-incon-name"},Cx={class:"ov-incon-vals"},Sx={class:"topo-canvas-wrap"},bx={class:"bus-legend"},Ex={class:"pp-header"},wx={class:"pp-tabs",role:"tablist"},Ix={class:"pp-tab-n"},Px={class:"pp-tab-n"},$x={key:0,class:"pp-body"},xx={class:"pp-card"},Dx={class:"pp-field"},Mx={class:"pp-field-value"},kx={class:"pp-field"},Tx={key:0,class:"pp-field"},Vx={class:"pp-field-value mono"},Nx={key:1,class:"pp-field"},Ax={class:"pp-field-value mono"},Fx={key:2,class:"pp-field"},Ox={class:"pp-field-value mono",style:{color:"var(--danger)"}},Rx={class:"pp-card"},Bx={class:"pp-field"},Lx={class:"pp-field-value"},Ux={class:"pp-field"},Hx={class:"pp-field-value mono"},zx={class:"pp-field"},Kx={class:"pp-field-value mono"},Wx={class:"pp-field"},Gx={class:"pp-field-value mono pp-files"},Xx={key:1,class:"pp-field"},Yx={class:"pp-field-value",style:{"font-size":"11px","line-height":"1.5"}},jx={key:1,class:"pp-alarm"},qx={key:0,class:"pp-body"},Zx={class:"pp-card"},Jx={class:"pp-field"},Qx={class:"pp-field-value mono"},eD={class:"pp-field"},nD={class:"pp-field-value"},tD={key:0,class:"pp-field"},rD={class:"pp-field-value mono"},oD={class:"pp-field"},sD={class:"pp-field-value"},iD={class:"pp-field"},aD={class:"pp-field-value"},lD={key:0,style:{color:"var(--foreground-muted)"}},uD={class:"pp-field"},cD={class:"pp-field-value mono"},dD={key:0,class:"pp-card"},fD={key:1,class:"pp-alarm"},pD=We({__name:"TopologyView",setup(e){const{state:n,invoke:t}=Qi(),r={bmc:It(dw),boardgroup:It(jw)},o={manhattan:It(Qw)},{fitView:s}=nn(),i=Ee({}),a=Ee(null),l=Ee(null);ut("activeEdgeId",No(l));const c=Ee([]),d=Ee(null);function f(R,k){i.value={...i.value,[R]:k},p.value=p.value.map(oe=>oe.id===R?{...oe,data:{...oe.data,selectedId:k}}:oe)}const h=_d(f,i.value),p=Ee(h.nodes),E=Ee(h.edges);c.value=h.unclassifiedGroups,bn(()=>setTimeout(()=>s({padding:.1}),80));const b=ue(()=>h.groups.filter(R=>R.state!=="unclassified")),T=["BCU","CLU","EXU","IEU","SEU","NICCard","Unknown"],V=Ee(Object.fromEntries(T.map(R=>[R,!0]))),z=Ee({}),x=Ee(""),N=Ee(!1),re=ue(()=>{const R=[...b.value,...c.value],k=new Map;for(const oe of R){const ce=oe.type&&yi[oe.type]?oe.type:"Unknown";k.has(ce)||k.set(ce,[]),k.get(ce).push(oe)}return T.filter(oe=>k.has(oe)).map(oe=>({type:oe,label:yi[oe]??oe,groups:k.get(oe),boardCount:k.get(oe).reduce((ce,Ie)=>ce+Ie.boards.length,0)}))}),ie=ue(()=>{const R=x.value.trim().toLowerCase();return R?re.value.map(k=>({...k,groups:k.groups.filter(oe=>oe.name.toLowerCase().includes(R))})).filter(k=>k.groups.length>0):re.value});function ae(R){V.value={...V.value,[R]:!V.value[R]}}function fe(R){z.value={...z.value,[R]:!z.value[R]}}function le(R){R.state!=="unclassified"&&M(R.id),R.boards.length&&fe(R.id)}function Z(R,k){f(R.id,k.id),M(R.id)}function ne(R){return`${R.partNumber}_…${R.sn.slice(-4)}.sr`}function M(R){a.value=p.value.find(oe=>oe.id===R)??null;const k=p.value.find(oe=>oe.id===R);k&&setTimeout(()=>s({padding:.1,nodes:[k.id]}),30)}const q=ue(()=>b.value.filter(R=>R.state==="type-placeholder"||R.state==="missing"));function v(R){d.value=d.value===R?null:R}function X(R,k){c.value=c.value.filter(oe=>oe.id!==R),d.value=null,M(k)}function w(R){a.value=R.node,l.value=null}function Y(R){const k=R.edge.id;l.value=l.value===k?null:k}function K(){a.value=null,l.value=null}function j(){const R=_d(f,i.value);p.value=R.nodes,E.value=R.edges,setTimeout(()=>s({padding:.1}),80)}function J(){const R={};for(const k of h.groups)k.boards[0]&&(R[k.id]=k.boards[0].id);i.value=R,p.value=p.value.map(k=>k.type==="boardgroup"&&R[k.id]?{...k,data:{...k.data,selectedId:R[k.id]}}:k)}const te=ue(()=>{const R=a.value;return!R||R.type!=="boardgroup"?null:R.data.group}),pe=ue(()=>{const R=te.value;if(!R||!R.boards.length)return null;const k=i.value[R.id]??R.boards[0].id;return R.boards.find(oe=>oe.id===k)??R.boards[0]});Be(pe,R=>{n.selectedBoardId=(R==null?void 0:R.id)??null});const ye=Ee("detail");Be([te,ye],()=>{if(ye.value==="alarm"&&te.value){const R=te.value;n.inbound.alarm={source:`${R.name} · ${R.type}`,boardType:R.type,boardName:R.name,ts:Date.now()}}},{immediate:!0});const ge=Ee(null);function _e(R){var ce;const k=PI(R.name);let oe;if(k.length){oe=k.map(ze=>({key:ze.name,label:ze.name,typeLabel:ze.typeLabel,chipType:ze.type,bus:ze.bus,sensorCount:ze.sensorCount,eventCount:ze.eventCount,kind:"chip"}));const Ie=yr(R.name),Ae=Ie.cfgs.filter(ze=>!ze.dsChip).length,$e=Ie.looseEvents.filter(ze=>!ze.dsChip).length;(Ae||$e)&&oe.push({key:"__firmware",label:"固件 / BIOS 推送",typeLabel:"固件通道（非物理芯片）",chipType:"firmware",sensorCount:Ae,eventCount:$e,kind:"firmware"})}else{const Ie=new Set;oe=[];for(const Ae of Zr(R.type,R.name).buses){for(const $e of[...Ae.chips,...((ce=Ae.mux)==null?void 0:ce.chips)??[]])Ie.has($e.chipType)||(Ie.add($e.chipType),oe.push({key:$e.chipType,label:$e.label,typeLabel:Ci($e.chipType),chipType:$e.chipType,bus:Ae.label,sensorCount:0,eventCount:0,kind:"chip"}));Ae.mux&&!Ie.has("Pca9545")&&(Ie.add("Pca9545"),oe.push({key:"Pca9545",label:Ae.mux.label,typeLabel:Ci("Pca9545"),chipType:"Pca9545",bus:Ae.label,sensorCount:0,eventCount:0,kind:"chip"}))}}return oe.sort((Ie,Ae)=>Ae.sensorCount+Ae.eventCount-(Ie.sensorCount+Ie.eventCount))}const Se=ue(()=>te.value?_e(te.value):[]),be=ue(()=>ge.value?{s:ge.value.sensorCount,e:ge.value.eventCount}:Se.value.reduce((R,k)=>({s:R.s+k.sensorCount,e:R.e+k.eventCount}),{s:0,e:0})),Me={smc:"Smc",lm75:"Lm75",eeprom:"Eeprom",cpld:"Cpld",pca9545:"Pca9545",mux:"Pca9545"};function Oe(R,k){const oe=p.value.find($e=>$e.type==="boardgroup"&&$e.id===R.id);oe&&(a.value=oe),Xs(R.name);const ce=_e(R),Ie=Me[k.chipType.toLowerCase()]||k.chipType,Ae=ce.find($e=>$e.chipType===Ie)||ce.find($e=>$e.label.toLowerCase()===k.label.toLowerCase())||null;fn(()=>{ge.value=Ae,ye.value=Ae&&(Ae.sensorCount||Ae.eventCount)?"alarm":"detail"})}ut("onChipPick",Oe),Be(te,(R,k)=>{ge.value=null,R&&(Xs(R.name),k||(N.value=!0))},{immediate:!0});const ke=ue(()=>p.value.filter(R=>R.type==="boardgroup").map(R=>{const k=R.data.group;return{name:k.name,type:k.type}}));bn(()=>{for(const R of ke.value)Xs(R.name)});const Ve=ue(()=>d4()),m=ue(()=>p4()),F=ue(()=>v4()),g=Ee(!0),S=ue(()=>Ve.value.reduce((R,k)=>R+k.chips,0)),P=ue(()=>Ve.value.reduce((R,k)=>R+k.thresholdSensors+k.discreteSensors,0)),A=ue(()=>Ve.value.reduce((R,k)=>R+k.events,0)),L=ue(()=>{const R=new Map;for(const k of Ve.value)R.set(k.name,k);return R});function se(R){return L.value.get(R)}function O(R){return f4(R)}function _(R){const k=R.connectorRef?`来源 Connector：${R.connectorRef.parentGroupId} / ${R.connectorRef.connectorName}`:R.label,oe=se(R.name);if(!oe)return k;const ce=`器件 ${oe.chips} · 门限 ${oe.thresholdSensors} · 状态 ${oe.discreteSensors} · 事件 ${oe.events}`+(oe.chassisEvents?` · 机箱 ${oe.chassisEvents}`:"");return`${k}
${ce}`}function B(){const R=te.value,k=pe.value;return{source:`${(R==null?void 0:R.name)??"未知"} · ${(R==null?void 0:R.type)??""}`.trim(),detail:k?`SN ${k.sn}`:void 0}}function ee(){const R=te.value;if(!R)return;const k=Ml(R.type,R.name),oe=I0(R.type,R.name),ce=[B().detail,oe?`Smc: ${oe}`:null,k.label].filter(Boolean).join(" · ");t("smc",{source:B().source,detail:ce,func:k.func})}function U(){const R=te.value;R&&t("expr",{...B(),expression:kl(R.type,R.name)})}const D={BCU:"#22c55e",CLU:"#f59e0b",EXU:"#a855f7",IEU:"#06b6d4",SEU:"#ec4899",NICCard:"#3b82f6",Unknown:"#6b7280"};function W(R){var oe;if(R.type==="bmc")return"#0077FF";const k=(oe=R.data)==null?void 0:oe.group;return D[(k==null?void 0:k.type)??"Unknown"]??"#6b7280"}return(R,k)=>{var oe;return C(),I("div",S4,[N.value?(C(),I("aside",{key:0,class:"topo-palette closed",title:"展开硬件管理器",onClick:k[0]||(k[0]=ce=>N.value=!1)},[...k[12]||(k[12]=[u("svg",{class:"rail-ic",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true"},[u("path",{d:"M6.4 3.5 5.3 4.6 8.7 8l-3.4 3.4 1.1 1.1L10.9 8 6.4 3.5z"})],-1)])])):(C(),I("aside",b4,[u("div",E4,[k[15]||(k[15]=we(" 硬件管理器 ",-1)),u("div",w4,[u("button",{class:"ib",title:"重置布局",onClick:j},[...k[13]||(k[13]=[Yl('<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-128c8d4f><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" data-v-128c8d4f></path><path d="M21 3v5h-5" data-v-128c8d4f></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" data-v-128c8d4f></path><path d="M8 16H3v5" data-v-128c8d4f></path></svg>',1)])]),u("button",{class:"ib",title:"折叠面板",onClick:k[1]||(k[1]=ce=>N.value=!0)},[...k[14]||(k[14]=[u("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[u("path",{d:"M9.5 3.5 6 8l3.5 4.5"})],-1)])])])]),u("div",I4,[u("div",P4,[u("span",$4,H(Ve.value.length),1),k[16]||(k[16]=u("span",{class:"ov-l"},"样例板卡",-1))]),u("div",x4,[u("span",D4,H(S.value),1),k[17]||(k[17]=u("span",{class:"ov-l"},"物理器件",-1))]),u("div",M4,[u("span",k4,H(P.value),1),k[18]||(k[18]=u("span",{class:"ov-l"},"传感器",-1))]),u("div",T4,[u("span",V4,H(A.value),1),k[19]||(k[19]=u("span",{class:"ov-l"},"事件/告警",-1))]),u("div",N4,[u("span",A4,H(m.value.length),1),k[20]||(k[20]=u("span",{class:"ov-l"},"机箱级",-1))])]),u("div",F4,[k[21]||(k[21]=u("svg",{class:"hw-search-ic",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[u("circle",{cx:"11",cy:"11",r:"8"}),u("path",{d:"m21 21-4.35-4.35"})],-1)),Te(u("input",{class:"hw-search-input","onUpdate:modelValue":k[2]||(k[2]=ce=>x.value=ce),placeholder:"搜索板卡名称…"},null,512),[[Ue,x.value]])]),u("div",O4,[u("div",R4,[(C(),I("svg",B4,[...k[22]||(k[22]=[u("path",{d:"m9 18 6-6-6-6"},null,-1)])])),k[24]||(k[24]=we(" 板卡分类 ",-1)),u("div",{class:"sec-acts"},[u("button",{class:"ib",title:"全部重置为首张",onClick:J},[...k[23]||(k[23]=[u("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[u("path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}),u("path",{d:"M21 3v5h-5"})],-1)])])])]),u("div",L4,[(C(!0),I(he,null,xe(ie.value,ce=>(C(),I(he,{key:ce.type},[u("button",{class:"hw-cat-row",onClick:Ie=>ae(ce.type)},[u("span",{class:ve(["hw-caret",{open:V.value[ce.type]}])},[...k[25]||(k[25]=[u("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round","stroke-linejoin":"round"},[u("path",{d:"m9 18 6-6-6-6"})],-1)])],2),k[26]||(k[26]=u("svg",{class:"hw-cat-ic",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[u("path",{d:"M2 5.5A1.5 1.5 0 0 1 3.5 4h4.4c.4 0 .78.16 1.06.44L10.4 6H16.5A1.5 1.5 0 0 1 18 7.5v8A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10z"})],-1)),u("span",H4,H(ce.label),1),u("span",z4,H(ce.boardCount||ce.groups.length),1)],8,U4),V.value[ce.type]?(C(),I("div",K4,[(C(!0),I(he,null,xe(ce.groups,Ie=>{var Ae;return C(),I(he,{key:Ie.id},[u("div",{class:ve(["hw-grp-row",{"is-active":((Ae=a.value)==null?void 0:Ae.id)===Ie.id}]),title:_(Ie),onClick:$e=>le(Ie)},[Ie.boards.length?(C(),I("span",{key:0,class:ve(["hw-caret",{open:z.value[Ie.id]}])},[...k[27]||(k[27]=[u("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round","stroke-linejoin":"round"},[u("path",{d:"m9 18 6-6-6-6"})],-1)])],2)):(C(),I("span",G4)),u("span",{class:"hw-state-dot",style:Fe({background:de(Ks)[Ie.state]}),title:de(So)[Ie.state]},null,12,X4),u("span",Y4,H(Ie.name),1),Ie.state==="unclassified"?(C(),I("button",{key:2,class:"unc-assign-btn",disabled:q.value.length===0,onClick:Qe($e=>v(Ie.id),["stop"])},"指派",8,j4)):me("",!0)],10,W4),z.value[Ie.id]?(C(),I("div",q4,[Ie.boards.length?(C(),I(he,{key:0},[k[29]||(k[29]=u("div",{class:"hw-sub"},"硬件 · 源文件",-1)),u("div",Z4,[(C(!0),I(he,null,xe(Ie.boards,$e=>{var ze;return C(),I("button",{key:$e.id,class:ve(["hw-file-row",{"is-current":(i.value[Ie.id]??((ze=Ie.boards[0])==null?void 0:ze.id))===$e.id}]),title:"SN "+$e.sn+`
`+$e.files.join(`
`),onClick:Qe(rn=>Z(Ie,$e),["stop"])},[k[28]||(k[28]=u("svg",{class:"hw-file-ic",viewBox:"0 0 24 24"},[u("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),u("path",{d:"M14 2v6h6"})],-1)),u("span",Q4,H(ne($e)),1)],10,J4)}),128))])],64)):me("",!0),O(Ie.name).length?(C(),I(he,{key:1},[k[30]||(k[30]=u("div",{class:"hw-sub"},"软件 · 传感器 / 告警",-1)),u("div",ex,[(C(!0),I(he,null,xe(O(Ie.name),$e=>(C(),I("div",{key:$e.name,class:"ov-soft-row"},[u("div",nx,[u("span",{class:ve(["ov-soft-kind",$e.kind])},H($e.kind==="threshold"?"门限":"状态"),3),u("span",tx,H($e.name),1),u("span",rx,H($e.events.length)+" 告警",1)]),$e.events.length?(C(),I("div",ox,[(C(!0),I(he,null,xe($e.events,ze=>(C(),I("span",{key:ze.name,class:"ov-soft-ev",title:ze.keyId+(ze.level?" · "+ze.level:"")},[u("i",{class:ve(["ov-dot",ze.severity])},null,2),we(H(ze.name),1)],8,sx))),128))])):me("",!0)]))),128))])],64)):me("",!0)])):me("",!0),d.value===Ie.id?(C(),I("div",ix,[q.value.length===0?(C(),I("div",ax,"暂无空槽位可指派")):me("",!0),(C(!0),I(he,null,xe(q.value,$e=>(C(),I("button",{key:$e.id,class:"unc-slot",onClick:Qe(ze=>X(Ie.id,$e.id),["stop"])},[u("span",ux,H($e.type),1),u("span",cx,H($e.name),1),u("span",{class:"unc-slot-state",style:Fe({color:de(Ks)[$e.state]})},H(de(So)[$e.state]),5)],8,lx))),128))])):me("",!0)],64)}),128))])):me("",!0)],64))),128))]),u("div",{class:"sec-hd sec-hd-toggle",onClick:k[4]||(k[4]=ce=>g.value=!g.value)},[(C(),I("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:Fe({color:"var(--foreground-muted)",transform:g.value?"rotate(90deg)":"rotate(0deg)",flexShrink:0,transition:"transform .15s"}),fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round"},[...k[31]||(k[31]=[u("path",{d:"m9 18 6-6-6-6"},null,-1)])],4)),k[32]||(k[32]=we(" 整机事件 ",-1)),u("span",{class:"ov-help",title:"Chassis.* 命名空间事件：跨板、天然归属机箱（非某一块板），由机箱主板承载",onClick:k[3]||(k[3]=Qe(()=>{},["stop"]))},"?")]),Te(u("div",dx,[u("div",fx,[m.value.length?me("",!0):(C(),I("div",px,"暂无机箱级事件")),(C(!0),I(he,null,xe(m.value,(ce,Ie)=>(C(),I("div",{key:Ie,class:"ov-chs-row",title:ce.board+" · "+ce.keyId},[u("i",{class:ve(["ov-dot",ce.severity])},null,2),u("span",vx,H(ce.name),1),u("span",mx,H(ce.board),1)],8,hx))),128))]),F.value.length?(C(),I("div",_x,[u("div",gx,"跨板一致性 · "+H(F.value.length)+" 项待核对",1),(C(!0),I(he,null,xe(F.value,(ce,Ie)=>(C(),I("div",{key:Ie,class:"ov-incon"},[u("span",yx,H(ce.name)+"."+H(ce.field),1),u("span",Cx,[(C(!0),I(he,null,xe(ce.values,Ae=>(C(),I("span",{key:Ae.board,class:"ov-incon-v"},H(Ae.board)+"="+H(Ae.value),1))),128))])]))),128))])):me("",!0)],512),[[Nf,g.value]])])])),u("div",Sx,[Ke(de(pC),{nodes:p.value,"onUpdate:nodes":k[5]||(k[5]=ce=>p.value=ce),edges:E.value,"onUpdate:edges":k[6]||(k[6]=ce=>E.value=ce),"node-types":r,"edge-types":o,"fit-view-on-init":!0,"default-viewport":{x:0,y:0,zoom:1},"min-zoom":.1,"max-zoom":2.5,"nodes-draggable":!0,"nodes-connectable":!1,"elements-selectable":!0,"pan-on-drag":!0,onNodeClick:w,onEdgeClick:Y,onPaneClick:K},{default:Un(()=>[Ke(de(SC),{variant:de(ot).Lines,"pattern-color":"rgba(255,255,255,0.045)",gap:42,size:1},null,8,["variant"]),Ke(de(JC),{"show-interactive":!1}),Ke(de(NE),{"node-color":W,"mask-color":"rgba(8,8,18,0.65)",style:{background:"#141420",border:"1px solid #2e2e4e",borderRadius:"8px"}})]),_:1},8,["nodes","edges"]),u("div",bx,[k[33]||(k[33]=u("span",{class:"bus-legend-title"},"连线类型",-1)),(C(!0),I(he,null,xe(de(AE),ce=>(C(),I("span",{key:ce.type,class:"bus-legend-item"},[u("span",{class:"bus-legend-swatch",style:Fe({background:ce.color})},null,4),we(" "+H(ce.label),1)]))),128))])]),te.value?(C(),I("div",{key:2,class:ve(["topo-property-panel",{wide:ye.value==="alarm"&&!ge.value,"wide-dev":ye.value==="alarm"&&!!ge.value}]),onClick:k[11]||(k[11]=Qe(()=>{},["stop"]))},[u("div",Ex,[ge.value?(C(),I("button",{key:0,class:"pp-back",title:"返回板卡",onClick:k[7]||(k[7]=ce=>ge.value=null)},"‹")):me("",!0),u("span",null,H(ge.value?ge.value.label:"板卡配置"),1),u("button",{class:"pp-close",onClick:k[8]||(k[8]=ce=>a.value=null)},"✕")]),u("div",wx,[u("button",{class:ve(["pp-tab",{active:ye.value==="detail"}]),onClick:k[9]||(k[9]=ce=>ye.value="detail")},"详情",2),u("button",{class:ve(["pp-tab",{active:ye.value==="alarm"}]),onClick:k[10]||(k[10]=ce=>ye.value="alarm")},[k[34]||(k[34]=we("告警",-1)),u("span",Ix,H(be.value.e),1),k[35]||(k[35]=we(" / 传感器",-1)),u("span",Px,H(be.value.s),1)],2)]),ge.value?(C(),I(he,{key:1},[ye.value==="detail"?(C(),I("div",qx,[u("div",Zx,[u("div",Jx,[k[46]||(k[46]=u("div",{class:"pp-field-label"},"器件",-1)),u("div",Qx,H(ge.value.label),1)]),u("div",eD,[k[47]||(k[47]=u("div",{class:"pp-field-label"},"类型",-1)),u("div",nD,H(ge.value.typeLabel),1)]),ge.value.bus?(C(),I("div",tD,[k[48]||(k[48]=u("div",{class:"pp-field-label"},"所在总线",-1)),u("div",rD,H(ge.value.bus),1)])):me("",!0),u("div",oD,[k[49]||(k[49]=u("div",{class:"pp-field-label"},"承载传感器",-1)),u("div",sD,H(ge.value.sensorCount)+" 个",1)]),u("div",iD,[k[50]||(k[50]=u("div",{class:"pp-field-label"},"独立事件",-1)),u("div",aD,[we(H(ge.value.eventCount)+" 条",1),ge.value.eventCount?(C(),I("span",lD," · 不经传感器，直连本器件数据源")):me("",!0)])]),u("div",uD,[k[51]||(k[51]=u("div",{class:"pp-field-label"},"所属板卡",-1)),u("div",cD,H(te.value.name)+" · "+H(te.value.type),1)])]),ge.value.kind==="chip"&&!ge.value.sensorCount&&!ge.value.eventCount?(C(),I("div",dD,[...k[52]||(k[52]=[u("div",{class:"pp-field-value",style:{"font-size":"11px","line-height":"1.5",background:"transparent",padding:"0"}}," 该器件仅参与 I2C 拓扑与在位识别（EEPROM 信息 / CPLD 逻辑 / PCA9545 扩展等），未承载遥测传感器或独立事件（无 Scanner 数据源），因此没有告警链路。 ",-1)])])):me("",!0),u("div",{class:"pp-wake"},[k[55]||(k[55]=u("div",{class:"pp-wake-title"},"配置项辅助",-1)),u("button",{class:"wake-btn",onClick:ee},[...k[53]||(k[53]=[u("span",{class:"wake-ic-wrap","aria-hidden":"true"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"})])],-1),we(" 在 SMC 偏移量计算器中解析 ",-1)])]),u("button",{class:"wake-btn",onClick:U},[...k[54]||(k[54]=[u("span",{class:"wake-ic-wrap","aria-hidden":"true"},[u("svg",{viewBox:"0 0 24 24"},[u("path",{d:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"})])],-1),we(" 在表达式计算器中调试 sensor ",-1)])])])])):(C(),I("div",fD,[Ke(Dl,{"scope-chip-key":ge.value.key},null,8,["scope-chip-key"])]))],64)):(C(),I(he,{key:0},[ye.value==="detail"?(C(),I("div",$x,[u("div",xx,[u("div",Dx,[k[36]||(k[36]=u("div",{class:"pp-field-label"},"类型",-1)),u("div",Mx,H(te.value.label),1)]),u("div",kx,[k[37]||(k[37]=u("div",{class:"pp-field-label"},"解析状态",-1)),u("div",{class:"pp-field-value",style:Fe({color:de(Ks)[te.value.state]})},H(de(So)[te.value.state]),5)]),te.value.connectorRef?(C(),I("div",Tx,[k[38]||(k[38]=u("div",{class:"pp-field-label"},"来源 Connector",-1)),u("div",Vx,H(te.value.connectorRef.parentGroupId)+" / "+H(te.value.connectorRef.connectorName),1)])):me("",!0),((oe=te.value.connectorRef)==null?void 0:oe.identifyMode)!==void 0?(C(),I("div",Nx,[k[39]||(k[39]=u("div",{class:"pp-field-label"},"IdentifyMode",-1)),u("div",Ax,H(te.value.connectorRef.identifyMode),1)])):me("",!0),te.value.missingFile?(C(),I("div",Fx,[k[40]||(k[40]=u("div",{class:"pp-field-label"},"缺失文件",-1)),u("div",Ox,H(te.value.missingFile),1)])):me("",!0)]),u("div",Rx,[pe.value?(C(),I(he,{key:0},[u("div",Bx,[k[41]||(k[41]=u("div",{class:"pp-field-label"},"同类板数量",-1)),u("div",Lx,H(te.value.boards.length),1)]),u("div",Ux,[k[42]||(k[42]=u("div",{class:"pp-field-label"},"当前 SN",-1)),u("div",Hx,H(pe.value.sn),1)]),u("div",zx,[k[43]||(k[43]=u("div",{class:"pp-field-label"},"Part Number",-1)),u("div",Kx,H(pe.value.partNumber),1)]),u("div",Wx,[k[44]||(k[44]=u("div",{class:"pp-field-label"},"源文件",-1)),u("div",Gx,[(C(!0),I(he,null,xe(pe.value.files,ce=>(C(),I("div",{key:ce},H(ce),1))),128))])])],64)):(C(),I("div",Xx,[k[45]||(k[45]=u("div",{class:"pp-field-label"},"状态说明",-1)),u("div",Yx," 该板卡处于「"+H(de(So)[te.value.state])+"」态，尚未选择具体板卡实例。 请在卡片头部下拉中完成选择。 ",1)]))])])):(C(),I("div",jx,[Ke(Dl)]))],64))],2)):me("",!0)])}}}),hD=ft(pD,[["__scopeId","data-v-128c8d4f"]]),vD={class:"code-root"},mD={class:"code-head"},_D={class:"code-file"},gD={key:0,class:"code-empty"},yD={key:1,class:"code-body"},CD={class:"ln-c"},SD={class:"k"},bD={class:"s"},ED={class:"s"},wD={class:"s"},ID={class:"s"},PD={class:"v"},$D={class:"tag tag-smc"},xD={class:"v"},DD={class:"n"},MD={class:"n"},kD=We({__name:"CodeView",setup(e){const{state:n,setAnchor:t,invoke:r}=Qi(),o=ue(()=>mu.find(h=>h.id===n.selectedBoardId)??null),s=ue(()=>o.value?Zr(o.value.type,o.value.name).buses.map(h=>h.id):[]),i=ue(()=>o.value?gd(o.value):{fans:[],tempZones:[]}),a=ue(()=>o.value?Ml(o.value.type,o.value.name):null);function l(h){var p;return((p=n.lastWriteback)==null?void 0:p.tool)===h?n.lastWriteback.code:null}function c(){const h=o.value;if(!h)return;const p=Ml(h.type,h.name),E=I0(h.type,h.name);r("smc",{source:`${h.name} · ${h.type}`,detail:[`SN ${h.sn}`,E?`Smc: ${E}`:null,p.label].filter(Boolean).join(" · "),func:p.func})}function d(){const h=o.value;h&&r("expr",{source:`${h.name} · ${h.type}`,detail:`SN ${h.sn}`,expression:kl(h.type,h.name)})}function f(){const h=o.value;if(!h)return;const p=gd(h);r("cooling",{source:`${h.name} · ${h.type}`,detail:`SN ${h.sn}`,fans:p.fans,tempZones:p.tempZones})}return(h,p)=>{var E;return C(),I("div",vD,[u("div",mD,[u("span",_D,H(o.value?o.value.partNumber+"_"+o.value.sn+".sr":"root.sr"),1),p[1]||(p[1]=u("span",{class:"code-sub"},"CSR · ManagementTopology / Objects",-1)),u("button",{class:"code-topo-btn",onClick:p[0]||(p[0]=b=>de(t)("topology"))},"在拓扑中查看 →")]),o.value?(C(),I("pre",yD,[u("span",CD,"// CSR Objects · "+H(o.value.name)+" ("+H(o.value.type)+")",1),p[14]||(p[14]=we(`
`,-1)),u("span",SD,"Connector_"+H(o.value.name),1),p[15]||(p[15]=we(`: {
  `,-1)),p[16]||(p[16]=u("span",{class:"k"},"Bom",-1)),p[17]||(p[17]=we(":          ",-1)),u("span",bD,'"'+H(o.value.partNumber)+'"',1),p[18]||(p[18]=we(`,
  `,-1)),p[19]||(p[19]=u("span",{class:"k"},"Id",-1)),p[20]||(p[20]=we(":           ",-1)),u("span",ED,'"'+H(o.value.sn)+'"',1),p[21]||(p[21]=we(`,
  `,-1)),p[22]||(p[22]=u("span",{class:"k"},"Type",-1)),p[23]||(p[23]=we(":         ",-1)),u("span",wD,'"'+H(o.value.type)+'"',1),p[24]||(p[24]=we(`,
  `,-1)),p[25]||(p[25]=u("span",{class:"k"},"Buses",-1)),p[26]||(p[26]=we(":        [",-1)),u("span",ID,H(s.value.join(", ")),1),p[27]||(p[27]=we(`],
  `,-1)),p[28]||(p[28]=u("span",{class:"k"},"IdentifyMode",-1)),p[29]||(p[29]=we(": ",-1)),p[30]||(p[30]=u("span",{class:"n"},"2",-1)),p[31]||(p[31]=we(`,
`,-1)),p[32]||(p[32]=u("span",{class:"ln-c"},"  // ── 可联动字段(点击在右侧打开对应工具)──",-1)),p[33]||(p[33]=we(`
`,-1)),u("span",{class:ve(["field",{active:de(n).dockTool==="smc"}]),onClick:c},[p[2]||(p[2]=u("span",{class:"k"},"  Smc.Offset",-1)),p[3]||(p[3]=we(":   ",-1)),u("span",PD,H(l("smc")||"0x________"),1),p[4]||(p[4]=we()),u("span",$D,"SMC · func "+H((E=a.value)==null?void 0:E.func)+" ↗",1)],2),p[34]||(p[34]=we(`
`,-1)),u("span",{class:ve(["field",{active:de(n).dockTool==="expr"}]),onClick:d},[p[5]||(p[5]=u("span",{class:"k"},"  Sensor.Expression",-1)),p[6]||(p[6]=we(": ",-1)),u("span",xD,'"'+H(l("expr")||de(kl)(o.value.type,o.value.name))+'"',1),p[7]||(p[7]=we()),p[8]||(p[8]=u("span",{class:"tag tag-expr"},"表达式 ↗",-1))],2),p[35]||(p[35]=we(`
`,-1)),i.value.fans.length||i.value.tempZones.length?(C(),I("span",{key:0,class:ve(["field",{active:de(n).dockTool==="cooling"}]),onClick:f},[p[9]||(p[9]=u("span",{class:"k"},"  cooling_config",-1)),p[10]||(p[10]=we(": { fans: ",-1)),u("span",DD,H(i.value.fans.length),1),p[11]||(p[11]=we(", temp_zones: ",-1)),u("span",MD,H(i.value.tempZones.length),1),p[12]||(p[12]=we(" } ",-1)),p[13]||(p[13]=u("span",{class:"tag tag-cool"},"调速 ↗",-1))],2)):me("",!0),p[36]||(p[36]=we(`
}`,-1))])):(C(),I("div",gD," 在拓扑里选择一块板卡,这里显示它的 .sr / CSR 代码,字段可点击联动工具。 "))])}}}),TD=ft(kD,[["__scopeId","data-v-4e877f36"]]),VD={class:"root"},ND={class:"offset-bar"},AD={class:"off-row"},FD={class:"hex-input-row"},OD=["value"],RD={class:"offset-actions"},BD=["disabled"],LD=["disabled"],UD={class:"fp"},HD={class:"fp"},zD={class:"fp"},KD={class:"fp"},WD={class:"offset-err"},GD={class:"bitmap-card"},XD={class:"bit-grid-scroll"},YD={class:"bit-grid"},jD=["title"],qD=["title"],ZD=["title"],JD=["title"],QD=["title"],eM=["title"],nM={class:"fields-card"},tM={class:"fields-row r1"},rM={class:"field-head"},oM={class:"field-label"},sM={class:"field-input-wrap",title:"功能码：标识子系统（电源 / 风扇 / 温度…），可下拉选择已知代号或自由输入"},iM={class:"func-picker"},aM=["onClick"],lM={class:"fo-hex"},uM={class:"fo-label"},cM=["disabled"],dM={class:"field-foot"},fM={class:"pair"},pM={class:"v"},hM={class:"v"},vM={class:"field-head"},mM={class:"field-label"},_M={class:"field-input-wrap",title:"命令码：在功能码下的具体操作编号"},gM=["disabled"],yM={class:"field-foot"},CM={class:"pair"},SM={class:"v"},bM={class:"v"},EM={class:"fields-row r2"},wM={class:"field-head"},IM={class:"field-label"},PM={class:"code-anno"},$M={class:"field-meta"},xM=["title"],DM={key:0,class:"smc-pillset"},MM=["onClick"],kM=["onClick"],TM=["onUpdate:modelValue","onInput","onBlur"],VM=["disabled","onClick"],NM={class:"field-foot"},AM={class:"pair"},FM={class:"v"},OM={class:"v"},RM={class:"history-card"},BM={class:"history-list"},LM={key:0,class:"history-empty",style:{"grid-column":"1/-1"}},UM=["onClick"],HM={class:"idx"},zM={class:"hval"},KM={class:"hts"},WM={name:"SmcOffsetView"},GM=We({...WM,setup(e){const n={func:{hi:31,lo:26,width:6,hexDigits:2,shortLabel:"Function"},cmd:{hi:25,lo:10,width:16,hexDigits:4,shortLabel:"Command"},ms:{hi:9,lo:9,width:1,hexDigits:1,shortLabel:"MS"},rw:{hi:8,lo:8,width:1,hexDigits:1,shortLabel:"RW"},param:{hi:7,lo:0,width:8,hexDigits:2,shortLabel:"Param"}},t=["func","cmd","ms","rw","param"],r={1:"系统管理 System",2:"电源管理 Power",3:"风扇控制 Fan",12:"温度管理 Thermal",16:"存储 Storage",32:"网络 Network"},o={0:"多读 Multi-read",1:"单读 Single-read"},s={0:"写 Write",1:"读 Read"},i=Object.entries(r).map(([O,_])=>({hex:"0x"+Number(O).toString(16).toUpperCase().padStart(2,"0"),label:_})),a={func:"功能码 Function · [31:26] · 6 bit",cmd:"命令码 Command · [25:10] · 16 bit",ms:"读取方式 MS · [9] · 1 bit",rw:"读写方向 RW · [8] · 1 bit",param:"参数 Param · [7:0] · 8 bit"},l={func:"#f59e6b",cmd:"#4f6ef7",ms:"#a78bfa",rw:"#34d399",param:"#f5b454"},c=Gn({func:null,cmd:null,ms:null,rw:null,param:null}),d=Gn({func:"",cmd:"",ms:"",rw:"",param:""}),f=Gn({func:"",cmd:"",ms:"",rw:"",param:""}),h=Ee(""),p=Ee(""),E=Ee(""),b=Ee(""),T=Ee("hex"),V=Ee(!1),z=Ee(!1),x=Ee(null),N=Ee(!1),re=Ee("");let ie;const ae=Ee([]),fe="ubmc.smc.history.v2";function le(O,_){return O.length>=_?O:"0".repeat(_-O.length)+O}function Z(){let O=0;for(const _ of t){const B=c[_];B!==null&&(O=(O|B<<n[_].lo>>>0)>>>0)}return O>>>0}function ne(O){const _={};for(const B of t){const ee=(1<<n[B].width)-1;_[B]=O>>>n[B].lo&ee}return _}function M(){return t.some(O=>c[O]!==null)}function q(O){return"0x"+le(O.toString(16).toUpperCase(),8)}function v(O,_,B=!1){const ee=O.trim();if(!ee)return{ok:!0,value:null};let U;if(B){const W=ee.replace(/^0x/i,"");if(!/^[0-9a-f]+$/i.test(W))return{ok:!1,value:null,err:"请输入十六进制数字"};U=parseInt(W,16)}else if(/^0x/i.test(ee)){if(!/^0x[0-9a-f]+$/i.test(ee))return{ok:!1,value:null,err:"不是合法的十六进制"};U=parseInt(ee.slice(2),16)}else if(/^[0-9a-f]+$/i.test(ee)&&/[a-f]/i.test(ee))U=parseInt(ee,16);else if(/^-?[0-9]+$/.test(ee))U=parseInt(ee,10);else return{ok:!1,value:null,err:"只接受 dec 或 0x hex"};if(!Number.isFinite(U)||U<0)return{ok:!1,value:null,err:"非法数字"};const D=_===32?4294967295:(1<<_)-1;return U>D?{ok:!1,value:null,err:`超出 ${_}-bit 范围`}:{ok:!0,value:U>>>0}}function X(O,_){_!=="hex"&&(h.value=q(O)),_!=="dec"&&(p.value=String(O)),E.value="",b.value="";const B=ne(O);t.forEach(ee=>{c[ee]=B[ee],d[ee]=le(B[ee].toString(16).toUpperCase(),n[ee].hexDigits),f[ee]=""})}function w(O){const _=O==="hex"?h.value:p.value;if(E.value="",b.value="",!_.trim()){t.forEach(ee=>{c[ee]=null,d[ee]="",f[ee]=""}),O==="hex"?p.value="":h.value="";return}const B=v(_,32);if(!B.ok){O==="hex"?E.value=B.err||"":b.value=B.err||"";return}X(B.value,O)}function Y(O){f[O]="";const _=v(d[O],n[O].width,!0);if(!_.ok){f[O]=_.err||"";return}if(c[O]=_.value,M()){const B=Z();h.value=q(B),p.value=String(B),E.value="",b.value=""}}function K(O){const _=c[O];_!==null&&(d[O]=le(_.toString(16).toUpperCase(),n[O].hexDigits))}function j(O,_){d[O]=_,Y(O)}const J=ue(()=>{const O=Z(),_=M();return Array.from({length:32},(B,ee)=>{const U=31-ee;let D;return U>=26?D="func":U>=10?D="cmd":U===9?D="ms":U===8?D="rw":D="param",{bitIdx:U,hue:D,on:_&&(O>>>U&1)===1,set:_,isBoundary:[5,21,22,23].includes(ee),isPosBound:[31,26,25,10,9,8,7,0].includes(U)}})});function te(O){const _=c[O];return _===null?"—":String(_)}function pe(O){const _=c[O];return _===null?"—":"0x"+le(_.toString(16).toUpperCase(),n[O].hexDigits)}function ye(O){const _=c[O];return _===null?"":O==="func"?r[_]?"· "+r[_]:"":O==="ms"?"· "+(o[_]||""):O==="rw"?"· "+(s[_]||""):""}function ge(O){const _=Z(),B=q(_),ee=String(_);switch(O){case"dec":return ee;case"both":return`${B} (${ee})`;case"c":return B+"u";case"json":{const U=ne(_);return JSON.stringify({offset:B,func:"0x"+le(U.func.toString(16).toUpperCase(),2),cmd:"0x"+le(U.cmd.toString(16).toUpperCase(),4),ms:U.ms,rw:U.rw,param:"0x"+le(U.param.toString(16).toUpperCase(),2)})}default:return B}}function _e(O){if(!M())return O==="hex"?"0x00000000":"—";const _=ge(O);return _.length>28?_.slice(0,26)+"…":_}function Se(){var _;if(!M())return;const O=ge(T.value);(_=navigator.clipboard)==null||_.writeText(O),P("已复制 "+(O.length>36?O.slice(0,34)+"…":O)),Ve(),N.value=!0,setTimeout(()=>N.value=!1,1200)}function be(O){T.value=O,V.value=!1,Se()}function Me(O){var ee;const _=c[O];if(_===null)return;const B="0x"+le(_.toString(16).toUpperCase(),n[O].hexDigits);(ee=navigator.clipboard)==null||ee.writeText(B),P(`已复制 ${n[O].shortLabel}: ${B}`),x.value=O,setTimeout(()=>x.value=null,1200)}function Oe(){t.forEach(O=>{c[O]=null,d[O]="",f[O]=""}),h.value="",p.value="",E.value="",b.value=""}function ke(){h.value="0x30004500",w("hex")}function Ve(){var _;if(!M())return;const O={word:Z(),parts:Object.fromEntries(t.map(B=>[B,c[B]??0])),ts:Date.now()};if(((_=ae.value[0])==null?void 0:_.word)!==O.word){ae.value.unshift(O),ae.value.length>10&&(ae.value.length=10);try{localStorage.setItem(fe,JSON.stringify(ae.value))}catch{}}}function m(){try{const O=localStorage.getItem(fe);O&&(ae.value=JSON.parse(O)||[])}catch{}}function F(O){const _=ae.value[O];_&&(t.forEach(B=>{c[B]=_.parts[B]??0,d[B]=le((_.parts[B]??0).toString(16).toUpperCase(),n[B].hexDigits),f[B]=""}),h.value=q(_.word),p.value=String(_.word),E.value="",b.value="",P("已回填 "+q(_.word)))}function g(){ae.value=[];try{localStorage.removeItem(fe)}catch{}}function S(O){const _=new Date(O);return String(_.getHours()).padStart(2,"0")+":"+String(_.getMinutes()).padStart(2,"0")}function P(O){re.value=O,clearTimeout(ie),ie=setTimeout(()=>re.value="",1600)}function A(O){(O.ctrlKey||O.metaKey)&&O.key.toLowerCase()==="s"&&(O.preventDefault(),Ve(),P("已保存当前结果"))}function L(O){var B,ee;const _=O.target;(B=_.closest)!=null&&B.call(_,".split-btn")||(V.value=!1),(ee=_.closest)!=null&&ee.call(_,".func-picker")||(z.value=!1)}function se(O){d.func=O.replace(/^0x/i,"").toUpperCase().padStart(n.func.hexDigits,"0"),Y("func"),z.value=!1}return bn(()=>{m(),window.addEventListener("keydown",A),document.addEventListener("click",L)}),Ai(()=>{window.removeEventListener("keydown",A),document.removeEventListener("click",L),clearTimeout(ie)}),(O,_)=>(C(),I("div",VD,[u("div",{class:"page-head"},[_[19]||(_[19]=Yl('<div class="page-head-info" data-v-b8b7763d><div class="page-head-line" data-v-b8b7763d><h1 class="page-title" data-v-b8b7763d>SMC 偏移量计算器</h1><span class="page-badge" data-v-b8b7763d>32-bit · 双向</span></div><div class="page-sub" data-v-b8b7763d>一句话:把 SMC 寄存器访问的 32 位偏移量,在「整字 ⇄ 功能码 / 命令码 / MS / RW / 参数」之间双向实时编解码,十进制与十六进制随时互转。</div></div>',1)),u("div",{class:"head-actions"},[u("button",{class:"btn btn-ghost",onClick:Oe},"重置"),u("button",{class:"btn btn-secondary",onClick:ke},"示例")])]),u("div",ND,[_[28]||(_[28]=u("div",{class:"section-h"},[u("span",{class:"sec-title"},"偏移量 · 32-bit Offset"),u("span",{class:"sec-hint"},"输入十六进制或十进制，两边自动联动；下方字段同时刷新")],-1)),u("div",AD,[u("div",{class:ve(["offset-input-wrap",{invalid:E.value,synced:M()&&!E.value}])},[_[21]||(_[21]=u("div",{class:"oiw-tag"},[u("span",null,"HEX"),u("span",{class:"sync"},"●")],-1)),u("div",FD,[_[20]||(_[20]=u("span",{class:"oiw-pfx"},"0x",-1)),u("input",{value:h.value.replace(/^0x/i,""),onInput:_[0]||(_[0]=B=>{h.value="0x"+B.target.value,w("hex")}),placeholder:"00000000",autocomplete:"off",spellcheck:"false"},null,40,OD)])],2),u("div",{class:ve(["offset-input-wrap",{invalid:b.value,synced:M()&&!b.value}])},[_[22]||(_[22]=u("div",{class:"oiw-tag"},[u("span",null,"DEC · 0 – 4 294 967 295"),u("span",{class:"sync"},"●")],-1)),Te(u("input",{"onUpdate:modelValue":_[1]||(_[1]=B=>p.value=B),onInput:_[2]||(_[2]=B=>w("dec")),placeholder:"0",autocomplete:"off",spellcheck:"false",inputmode:"numeric"},null,544),[[Ue,p.value]])],2),u("div",RD,[u("div",{class:"split-btn",onClick:_[9]||(_[9]=Qe(()=>{},["stop"]))},[u("button",{class:"btn btn-primary btn-copy",disabled:!M(),onClick:Se},H(N.value?"已复制 ✓":"复制偏移量"),9,BD),u("button",{class:"btn btn-primary btn-fmt-arr",disabled:!M(),onClick:_[3]||(_[3]=B=>V.value=!V.value)},"▾",8,LD),u("div",{class:ve(["fmt-menu",{open:V.value}])},[u("div",{class:ve(["fmt-item",{active:T.value==="hex"}]),onClick:_[4]||(_[4]=B=>be("hex"))},[_[23]||(_[23]=u("span",null,"仅 HEX",-1)),u("span",UD,H(_e("hex")),1)],2),u("div",{class:ve(["fmt-item",{active:T.value==="dec"}]),onClick:_[5]||(_[5]=B=>be("dec"))},[_[24]||(_[24]=u("span",null,"仅 DEC",-1)),u("span",HD,H(_e("dec")),1)],2),u("div",{class:ve(["fmt-item",{active:T.value==="both"}]),onClick:_[6]||(_[6]=B=>be("both"))},[_[25]||(_[25]=u("span",null,"HEX + DEC",-1)),u("span",zD,H(_e("both")),1)],2),u("div",{class:ve(["fmt-item",{active:T.value==="c"}]),onClick:_[7]||(_[7]=B=>be("c"))},[_[26]||(_[26]=u("span",null,"C 字面量",-1)),u("span",KD,H(_e("c")),1)],2),u("div",{class:ve(["fmt-item",{active:T.value==="json"}]),onClick:_[8]||(_[8]=B=>be("json"))},[..._[27]||(_[27]=[u("span",null,"JSON 字段",-1),u("span",{class:"fp fp-sm"},'{ "func": …}',-1)])],2)],2)])])]),u("div",WD,H(E.value||b.value),1)]),u("div",GD,[_[32]||(_[32]=u("div",{class:"section-h"},[u("span",{class:"sec-title"},"32-bit 位图"),u("span",{class:"sec-hint"},"MSB → LSB · 每格 1 bit · 悬停色块或某一位查看字段含义")],-1)),u("div",XD,[u("div",YD,[u("div",{class:"field-band hue-func",style:{"grid-column":"1/7"},title:a.func},[..._[29]||(_[29]=[we("Function",-1),u("span",{class:"seg-info"},"[31:26]",-1)])],8,jD),u("div",{class:"field-band hue-cmd",style:{"grid-column":"7/23"},title:a.cmd},[..._[30]||(_[30]=[we("Command",-1),u("span",{class:"seg-info"},"[25:10]",-1)])],8,qD),u("div",{class:"field-band hue-ms",style:{"grid-column":"23/24"},title:a.ms},"MS",8,ZD),u("div",{class:"field-band hue-rw",style:{"grid-column":"24/25"},title:a.rw},"RW",8,JD),u("div",{class:"field-band hue-param",style:{"grid-column":"25/33"},title:a.param},[..._[31]||(_[31]=[we("Param",-1),u("span",{class:"seg-info"},"[7:0]",-1)])],8,QD),(C(!0),I(he,null,xe(J.value,B=>(C(),I("div",{key:B.bitIdx,class:ve(["bit-cell",[`hue-${B.hue}`,{on:B.on,boundary:B.isBoundary}]]),title:`${a[B.hue]} · 第 ${B.bitIdx} 位`},H(B.set&&B.on?"1":"0"),11,eM))),128)),(C(!0),I(he,null,xe(J.value,B=>(C(),I("div",{key:"p"+B.bitIdx,class:ve(["bit-pos",{boundary:B.isPosBound}])},H(B.isPosBound?B.bitIdx:""),3))),128))])])]),u("div",nM,[_[52]||(_[52]=u("div",{class:"section-h"},[u("span",{class:"sec-title"},"字段拆解 · 双向编辑"),u("span",{class:"sec-hint"},"输入 0x 开头即十六进制，否则按十进制解析")],-1)),u("div",tM,[u("div",{class:"field-card",style:Fe({borderTopColor:l.func})},[u("div",rM,[u("span",oM,[u("span",{class:"swatch",style:Fe({background:l.func})},null,4),_[33]||(_[33]=we("功能码 · ",-1)),_[34]||(_[34]=u("i",{class:"code-anno"},"Function",-1))]),_[35]||(_[35]=u("span",{class:"field-meta"},"[31:26] · 6b",-1))]),u("div",sM,[u("div",iM,[u("div",{class:ve(["hex-pfx-wrap",{invalid:f.func}])},[_[36]||(_[36]=u("span",{class:"hex-pfx"},"0x",-1)),Te(u("input",{class:"field-input","onUpdate:modelValue":_[10]||(_[10]=B=>d.func=B),onInput:_[11]||(_[11]=B=>Y("func")),onBlur:_[12]||(_[12]=B=>K("func")),placeholder:"00",autocomplete:"off",spellcheck:"false"},null,544),[[Ue,d.func]]),u("button",{type:"button",class:ve(["func-caret",{open:z.value}]),title:"已知功能码",onClick:_[13]||(_[13]=Qe(B=>z.value=!z.value,["stop"]))},"▾",2)],2),u("div",{class:ve(["func-menu",{open:z.value}])},[_[37]||(_[37]=u("div",{class:"func-menu-h"},"已知功能码",-1)),(C(!0),I(he,null,xe(de(i),B=>(C(),I("div",{class:ve(["func-opt",{active:d.func.toUpperCase()===B.hex.replace(/^0x/i,"").toUpperCase()}]),key:B.hex,onClick:ee=>se(B.hex)},[u("span",lM,H(B.hex),1),u("span",uM,H(B.label),1)],10,aM))),128)),_[38]||(_[38]=u("div",{class:"func-menu-note"},"其他值直接在左侧输入(00 – 3F)",-1))],2)]),u("button",{class:ve(["field-copy",{copied:x.value==="func"}]),disabled:c.func===null,onClick:_[14]||(_[14]=B=>Me("func"))},"⧉",10,cM)]),u("div",dM,[u("span",fM,[u("span",{class:ve({muted:c.func===null})},[_[39]||(_[39]=u("span",{class:"k"},"DEC ",-1)),u("span",pM,H(te("func")),1)],2),u("span",{class:ve({muted:c.func===null})},[_[40]||(_[40]=u("span",{class:"k"},"HEX ",-1)),u("span",hM,H(pe("func")),1)],2)]),u("span",{class:ve(["semantic",{ferr:f.func}])},H(f.func||ye("func")),3)])],4),u("div",{class:"field-card",style:Fe({borderTopColor:l.cmd})},[u("div",vM,[u("span",mM,[u("span",{class:"swatch",style:Fe({background:l.cmd})},null,4),_[41]||(_[41]=we("命令码 · ",-1)),_[42]||(_[42]=u("i",{class:"code-anno"},"Command",-1))]),_[43]||(_[43]=u("span",{class:"field-meta"},"[25:10] · 16b · 0–0xFFFF",-1))]),u("div",_M,[u("div",{class:ve(["hex-pfx-wrap",{invalid:f.cmd}])},[_[44]||(_[44]=u("span",{class:"hex-pfx"},"0x",-1)),Te(u("input",{class:"field-input","onUpdate:modelValue":_[15]||(_[15]=B=>d.cmd=B),onInput:_[16]||(_[16]=B=>Y("cmd")),onBlur:_[17]||(_[17]=B=>K("cmd")),placeholder:"0000",autocomplete:"off",spellcheck:"false"},null,544),[[Ue,d.cmd]])],2),u("button",{class:ve(["field-copy",{copied:x.value==="cmd"}]),disabled:c.cmd===null,onClick:_[18]||(_[18]=B=>Me("cmd"))},"⧉",10,gM)]),u("div",yM,[u("span",CM,[u("span",{class:ve({muted:c.cmd===null})},[_[45]||(_[45]=u("span",{class:"k"},"DEC ",-1)),u("span",SM,H(te("cmd")),1)],2),u("span",{class:ve({muted:c.cmd===null})},[_[46]||(_[46]=u("span",{class:"k"},"HEX ",-1)),u("span",bM,H(pe("cmd")),1)],2)]),u("span",{class:ve(["semantic",{ferr:f.cmd}])},H(f.cmd),3)])],4)]),u("div",EM,[(C(),I(he,null,xe(["ms","rw","param"],B=>u("div",{key:B,class:"field-card",style:Fe({borderTopColor:l[B]})},[u("div",wM,[u("span",IM,[u("span",{class:"swatch",style:Fe({background:l[B]})},null,4),we(" "+H(B==="ms"?"读取方式 · ":B==="rw"?"读写方向 · ":"参数 · "),1),u("i",PM,H(B==="ms"?"MS":B==="rw"?"RW":"Param"),1)]),u("span",$M,H(B==="ms"?"[9] · 1b":B==="rw"?"[8] · 1b":"[7:0] · 8b · 0–0xFF"),1)]),u("div",{class:"field-input-wrap",title:B==="ms"?"读取方式：多读=连续读取多个值，单读=单次读取":B==="rw"?"读写方向：0=写入，1=读取":"参数：命令附带的 8 位参数"},[B==="ms"||B==="rw"?(C(),I("div",DM,[u("button",{type:"button",class:ve(["smc-pill p-write",{on:c[B]===0}]),onClick:ee=>j(B,"0")},[_[47]||(_[47]=u("b",null,"0",-1)),we(" "+H(B==="ms"?"多读":"写"),1)],10,MM),u("button",{type:"button",class:ve(["smc-pill p-read",{on:c[B]===1}]),onClick:ee=>j(B,"1")},[_[48]||(_[48]=u("b",null,"1",-1)),we(" "+H(B==="ms"?"单读":"读"),1)],10,kM)])):(C(),I("div",{key:1,class:ve(["hex-pfx-wrap",{invalid:f[B]}])},[_[49]||(_[49]=u("span",{class:"hex-pfx"},"0x",-1)),Te(u("input",{class:"field-input","onUpdate:modelValue":ee=>d[B]=ee,onInput:ee=>Y(B),onBlur:ee=>K(B),placeholder:"00",autocomplete:"off",spellcheck:"false"},null,40,TM),[[Ue,d[B]]])],2)),u("button",{class:ve(["field-copy",{copied:x.value===B}]),disabled:c[B]===null,onClick:ee=>Me(B)},"⧉",10,VM)],8,xM),u("div",NM,[u("span",AM,[u("span",{class:ve({muted:c[B]===null})},[_[50]||(_[50]=u("span",{class:"k"},"DEC ",-1)),u("span",FM,H(te(B)),1)],2),B==="param"?(C(),I("span",{key:0,class:ve({muted:c[B]===null})},[_[51]||(_[51]=u("span",{class:"k"},"HEX ",-1)),u("span",OM,H(pe(B)),1)],2)):me("",!0)]),u("span",{class:ve(["semantic",{ferr:f[B]}])},H(f[B]||ye(B)),3)])],4)),64))])]),u("div",RM,[u("div",{class:"section-h",style:{margin:"0"}},[_[54]||(_[54]=u("span",{class:"sec-title"},"最近 10 次计算",-1)),u("span",{class:"hist-actions"},[_[53]||(_[53]=u("span",{class:"sec-hint"},"Ctrl+S 收集 · 点击回填",-1)),u("button",{class:"btn btn-ghost btn-xs",onClick:g},"清空")])]),u("ul",BM,[ae.value.length?me("",!0):(C(),I("li",LM,"尚无历史记录 · 复制即自动收藏")),(C(!0),I(he,null,xe(ae.value,(B,ee)=>(C(),I("li",{key:ee,class:"history-item",onClick:U=>F(ee)},[u("span",HM,H(String(ee+1).padStart(2," ")),1),u("span",zM,H(q(B.word)),1),u("span",KM,H(S(B.ts)),1)],8,UM))),128))])]),u("div",{class:ve(["toast",{show:re.value}])},H(re.value),3)]))}}),XM=ft(GM,[["__scopeId","data-v-b8b7763d"]]),YM={class:"phase"},jM={class:"phase-head"},qM={key:0,class:"phase-status"},ZM={key:0,class:"hist-drop"},JM={key:0,class:"hist-empty"},QM=["onClick"],ek={class:"hist-expr"},nk={class:"hist-time"},tk={class:"expr-row"},rk={key:0,class:"qs-wrap"},ok={class:"qs-grid"},sk={class:"ops-panel"},ik={class:"op-cat-row","data-cat":"vars"},ak={class:"op-chips"},lk=["onClick"],uk={class:"chip-pop"},ck={class:"cp-sig"},dk={class:"cp-desc"},fk={class:"cp-ex"},pk=["data-cat"],hk={class:"op-chips"},vk=["data-cat","onClick"],mk={key:0,class:"op-arg"},_k={class:"chip-pop"},gk={class:"cp-sig"},yk={class:"cp-desc"},Ck={class:"cp-ex"},Sk={class:"phase-head"},bk={key:0,class:"no-vars-hint"},Ek={key:1,class:"no-vars-hint"},wk={key:2,class:"inputs-list"},Ik={class:"input-with-msg"},Pk=["onUpdate:modelValue"],$k={key:0,class:"err-msg"},xk=["onUpdate:modelValue"],Dk={class:"phase-head"},Mk={key:0,class:"pipe-empty"},kk={key:1,class:"pipe-empty"},Tk={class:"pipe-reason"},Vk={class:"pipeline"},Nk={class:"stage-body"},Ak={class:"op-text"},Fk={key:0,class:"var-ref"},Ok={key:0,class:"arg-lit"},Rk={class:"stage-desc"},Bk={key:0,class:"val-type"},Lk={key:0,class:"stage-connector"},Uk={key:0,class:"final-result"},Hk={class:"final-lab"},zk={class:"final-val"},Kk={class:"phase"},Wk={class:"phase-head"},Gk={class:"tc-context"},Xk={class:"tc-toolbar"},Yk={class:"seg"},jk={key:0,class:"tc-stats"},qk={class:"pct-bar"},Zk={class:"pct-label"},Jk={class:"csv-foot"},Qk={key:0,class:"tc-empty"},eT={key:1,class:"tc-table-wrap"},nT={class:"tc-table"},tT={class:"num-cell"},rT=["onUpdate:modelValue"],oT=["onUpdate:modelValue"],sT={key:0,class:"diff-good"},iT={key:1,class:"diff-text"},aT={key:2,style:{color:"var(--text-dim)"}},lT={class:"status-cell"},uT={key:0,class:"pill"},cT={key:1,class:"pill pill-ok"},dT={key:2,class:"pill pill-err"},fT={class:"action-cell"},pT=["onClick"],hT={name:"ExprCalcView"},vT=We({...hT,setup(e){const n={add:{cat:"arith",sig:"add N",desc:"加法 · a + b",example:"10 | add 5  →  15"},sub:{cat:"arith",sig:"sub N",desc:"减法 · a − b",example:"10 | sub 3  →  7"},mul:{cat:"arith",sig:"mul N",desc:"乘法 · a × b",example:"5 | mul 3   →  15"},div:{cat:"arith",sig:"div N",desc:"除法 · a ÷ b",example:"10 | div 4  →  2.5"},mod:{cat:"arith",sig:"mod N",desc:"取余 · a % b",example:"10 | mod 3  →  1"},and:{cat:"arith",sig:"and N",desc:"按位与 · a & b",example:"0xFF | and 0x0F  →  15"},or:{cat:"arith",sig:"or N",desc:"按位或 · a | b",example:"0xF0 | or 0x0F   →  255"},xor:{cat:"arith",sig:"xor N",desc:"按位异或 · a ^ b",example:"0xFF | xor 0x0F  →  240"},shl:{cat:"arith",sig:"shl N",desc:"左移 · a << b",example:"1 | shl 4   →  16"},shr:{cat:"arith",sig:"shr N",desc:"右移 · a >>> b",example:"256 | shr 4 →  16"},not:{cat:"arith",sig:"not",desc:"按位取反（32-bit）· ~a",example:"0 | not  →  4294967295"},toHex:{cat:"cast",sig:"toHex [W]",desc:"转十六进制（可补 W 位零）",example:'255 | toHex 4   →  "0x00ff"'},toBin:{cat:"cast",sig:"toBin [W]",desc:"转二进制字符串",example:'5 | toBin 8     →  "0b00000101"'},toOct:{cat:"cast",sig:"toOct",desc:"转八进制字符串",example:'8 | toOct       →  "0o10"'},toInt:{cat:"cast",sig:"toInt [R]",desc:"转整数（可指定基 R）",example:'"0xFF" | toInt  →  255'},"string.format":{cat:"string",sig:'string.format "F"',desc:"printf 风格格式化（%d %.Nf %s %x %X）",example:'41.875 | string.format "%.1f°C"  →  "41.9°C"'},"string.upper":{cat:"string",sig:"string.upper",desc:"转大写",example:'"hi" | string.upper  →  "HI"'},"string.lower":{cat:"string",sig:"string.lower",desc:"转小写",example:'"HI" | string.lower  →  "hi"'},"string.sub":{cat:"string",sig:"string.sub S [L]",desc:"子串（起 S 长 L，1-based）",example:'"abcdef" | string.sub 2 3  →  "bcd"'},"string.gsub":{cat:"string",sig:'string.gsub "F" "T"',desc:"全局替换 F → T",example:'"a-b-c" | string.gsub "-" "_"  →  "a_b_c"'},"string.cmp":{cat:"string",sig:'string.cmp "S"',desc:"字典序比较，返回 -1 / 0 / 1",example:'"abc" | string.cmp "abd"  →  -1'},expr:{cat:"custom",sig:"expr( <JS> )",desc:"内联 JS 表达式；x = 上一步结果，可引用 $N",example:"10 | expr(x*x + $1)  →  110 (if $1=10)"}},t=["arith","cast","string","custom"],r={arith:"算术",cast:"转换",string:"字符串",custom:"自定义"},o={arith:"#4f6ef7",cast:"#f5b454",string:"#34d399",custom:"#a78bfa",vars:"#4f6ef7"},s=Ee(""),i=Ee([]),a=Ee([]),l=Ee([]),c=Ee(null),d=Ee(!1),f=Ee("");let h;const p=Ee(null),E=Ee([]),b="expr-calc-history",T=Ee([]),V=Ee("table"),z=Ee(""),x=Ee(!1),N=ue(()=>{const U=(s.value.match(/\$([1-9]\d*)/g)||[]).map(D=>parseInt(D.slice(1)));return U.length?Math.max(...U):0});Be(N,U=>{for(;i.value.length<U;)i.value.push("");for(;a.value.length<U;)a.value.push("")},{immediate:!0});const re=ue(()=>s.value.trim()?Array.from({length:N.value},(U,D)=>D).filter(U=>!(i.value[U]||"").trim()):[]),ie=ue(()=>re.value.length>0),ae=ue(()=>{const U=new Set,D=/\$(\d+)/g;let W;for(;(W=D.exec(s.value))!==null;)U.add("$"+W[1]);return[...U].sort((R,k)=>parseInt(R.slice(1))-parseInt(k.slice(1)))});function fe(U,D){var oe;const W=p.value,R=s.value;let k;if(D==="vars")k=R.trim().length===0?U:` | ${U}`;else if(U==="expr")k=R.trim().length===0?"$1 | expr( )":" | expr( )";else{const ce=(oe=n[U])==null?void 0:oe.sig.includes(" ");k=R.trim().length===0?`$1 | ${U}${ce?" ":""}`:` | ${U}${ce?" ":""}`}if(W){const ce=W.selectionStart??R.length;s.value=R.slice(0,ce)+k+R.slice(ce),fn(()=>{const Ie=ce+k.length;W.setSelectionRange(Ie,Ie),W.focus()})}else s.value=R+k;J()}function le(U){const D=[];let W="",R=!1,k="";for(let oe=0;oe<U.length;oe++){const ce=U[oe];R?(W+=ce,ce===k&&U[oe-1]!=="\\"&&(R=!1)):ce==='"'||ce==="'"?(R=!0,k=ce,W+=ce):ce==="|"&&U[oe-1]===" "&&U[oe+1]===" "?(D.push(W.trimEnd()),W="",oe++):W+=ce}return W.trim()&&D.push(W.trim()),D}function Z(U){const D=[];let W="",R=!1,k="";for(const oe of U)R?(W+=oe,oe===k&&(R=!1,D.push(W),W="")):oe==='"'||oe==="'"?(R=!0,k=oe,W+=oe):oe===" "||oe==="	"?W&&(D.push(W),W=""):W+=oe;return W&&D.push(W),D}function ne(U){return U.startsWith('"')&&U.endsWith('"')||U.startsWith("'")&&U.endsWith("'")?U.slice(1,-1):U}function M(U){if(typeof U=="number")return U;if(typeof U=="boolean")return U?1:0;if(U===null)return 0;const D=String(U).trim();if(/^0[xX]/.test(D))return parseInt(D,16);if(/^0[bB]/.test(D))return parseInt(D.slice(2),2);if(/^0[oO]/.test(D))return parseInt(D.slice(2),8);const W=Number(D);return isNaN(W)?0:W}function q(U){const D=U.replace(/\band\b/g,"&&").replace(/\bor\b/g,"||").replace(/~=/g,"!==");try{return new Function(`"use strict"; return (${D});`)()}catch{throw new Error(`无法求值: ${U}`)}}function v(U,D,W){let R=U.replace(/\$0\b/g,JSON.stringify(W));for(let k=D.length;k>=1;k--){const oe=D[k-1],ce=Number(oe);R=R.replace(new RegExp(`\\$${k}\\b`,"g"),isNaN(ce)?JSON.stringify(oe):oe)}return R}function X(U,D){let W=0;return U.replace(/%([0-9]*)([sdxXfob])/g,(R,k,oe)=>{const ce=D[W++],Ie=M(ce),Ae=k?parseInt(k):0;let $e="";switch(oe){case"s":$e=String(ce??"");break;case"d":$e=Math.trunc(Ie).toString();break;case"f":$e=Ie.toFixed(6);break;case"x":$e=(Ie>>>0).toString(16);break;case"X":$e=(Ie>>>0).toString(16).toUpperCase();break;case"o":$e=(Ie>>>0).toString(8);break;case"b":$e=(Ie>>>0).toString(2);break}return Ae?$e.padStart(Ae):$e})}function w(U,D,W){const R=Z(U.trim());if(!R.length)return W;const k=R[0],oe=R.slice(1);switch(k){case"expr":{const ce=oe.join(" ");return q(v(ce||String(W),D,W))}case"string.format":{const ce=ne(oe[0]??""),Ie=oe.slice(1).map(Ae=>q(v(Ae,D,W)));return X(ce,[W,...Ie])}case"string.upper":return String(W).toUpperCase();case"string.lower":return String(W).toLowerCase();case"string.sub":{const ce=String(W),Ie=Number(oe[0]??1),Ae=oe[1]!=null?Number(oe[1]):ce.length;return ce.slice(Ie-1,Ae)}case"string.gsub":{const ce=String(W),Ie=ne(oe[0]??""),Ae=ne(oe[1]??"");return ce.split(Ie).join(Ae)}case"string.cmp":{const ce=v(ne(oe[0]??""),D,W);return String(W)===ce?0:String(W)<ce?-1:1}case"toHex":{const ce=M(W),Ie=oe[0]?Number(oe[0]):0;return"0x"+(ce>>>0).toString(16).padStart(Ie,"0")}case"toBin":{const ce=M(W),Ie=oe[0]?Number(oe[0]):0;return"0b"+(ce>>>0).toString(2).padStart(Ie,"0")}case"toOct":return"0o"+(M(W)>>>0).toString(8);case"toInt":return M(W)|0;case"add":return M(W)+M(q(v(oe.join(" "),D,W)));case"sub":return M(W)-M(q(v(oe.join(" "),D,W)));case"mul":return M(W)*M(q(v(oe.join(" "),D,W)));case"div":return M(W)/M(q(v(oe.join(" "),D,W)));case"mod":return M(W)%M(q(v(oe.join(" "),D,W)));case"and":return(M(W)&M(q(v(oe.join(" "),D,W))))>>>0;case"or":return(M(W)|M(q(v(oe.join(" "),D,W))))>>>0;case"xor":return(M(W)^M(q(v(oe.join(" "),D,W))))>>>0;case"shl":return M(W)<<M(oe[0]??"0")>>>0;case"shr":return M(W)>>>M(oe[0]??"0");case"not":return~M(W)>>>0;default:return q(v(U.trim(),D,W))}}function Y(U,D){const W=le(U);if(!W.length)return{stages:[],final:null,error:"表达式为空"};const R=[];let k=null,oe="";try{k=q(v(W[0],D,null)),R.push({expr:W[0],output:k})}catch(ce){return oe=String(ce),R.push({expr:W[0],output:null,error:oe}),{stages:R,final:null,error:oe}}for(let ce=1;ce<W.length;ce++)try{k=w(W[ce],D,k),R.push({expr:W[ce],output:k})}catch(Ie){oe=String(Ie),R.push({expr:W[ce],output:null,error:oe});break}return{stages:R,final:k,error:oe}}function K(U){return U==null?"—":typeof U=="number"?Number.isInteger(U)?"int":"num":typeof U=="string"?/^0x/i.test(U)?"hex":"str":typeof U}function j(U){return U==null?"—":typeof U=="string"?U.length>60?U.slice(0,57)+"…":U:typeof U=="number"?Number.isInteger(U)?String(U):String(Math.round(U*1e6)/1e6):String(U)}function J(){if(l.value=[],c.value=null,!s.value.trim()||ie.value)return;const U=i.value.slice(0,N.value),D=Y(s.value.trim(),U);l.value=D.stages,c.value=D.error?null:D.final,D.error||pe(s.value.trim())}function te(){try{E.value=JSON.parse(localStorage.getItem(b)??"[]")}catch{E.value=[]}}function pe(U){te();const D=E.value.filter(W=>W.expr!==U);D.unshift({expr:U,timestamp:Date.now()}),E.value=D.slice(0,20),localStorage.setItem(b,JSON.stringify(E.value))}function ye(U){s.value=U.expr,J()}function ge(U){const D=new Date(U);return`${String(D.getMonth()+1).padStart(2,"0")}-${String(D.getDate()).padStart(2,"0")} ${String(D.getHours()).padStart(2,"0")}:${String(D.getMinutes()).padStart(2,"0")}`}te();function _e(U){s.value=U,J()}function Se(){s.value="",i.value=[],a.value=[],l.value=[],c.value=null,T.value=[],z.value="",x.value=!1}function be(){Se(),s.value="$1 | add $2 | mul 2 | toHex 4",i.value=["100","28"],a.value=["温度基值","偏移量"],T.value=[{vals:["100","28"],expected:"0x00a0"},{vals:["200","56"],expected:"0x0200"},{vals:["0","0"],expected:"0x0000"}],J()}const Me=ue(()=>{const U=le(s.value);return U.length?`${U.length} 阶段 · ${ae.value.length} 变量`:"空"}),Oe=ue(()=>{if(!s.value.trim()||!N.value)return"—";const U=re.value.length;return U===0?`${N.value} 个变量 · 全部就绪`:`${N.value} 个变量 · ${U} 个未填`}),ke=ue(()=>s.value.trim()?ie.value?`等待 ${re.value.map(D=>"$"+(D+1)).join(" / ")}`:l.value.some(D=>D.error)?"✗ 失败":l.value.length?`✓ ${l.value.length} 阶段`:"—":"空"),Ve=ue(()=>!!c.value),m=ue(()=>l.value.some(U=>U.error)),F=ue(()=>T.value.filter(U=>U._pass===!0).length),g=ue(()=>T.value.length),S=ue(()=>g.value?Math.round(F.value/g.value*100):0);function P(){const U=ae.value;T.value.forEach(D=>{if(!s.value.trim()||U.length===0){D._actual="—",D._pass=null;return}const W=U.map((k,oe)=>D.vals[oe]??"");if(W.some(k=>!k)){D._actual="缺少输入",D._pass=null;return}const R=Y(s.value.trim(),W);D._actual=R.error?"⚠ "+R.error:String(R.final),D._pass=!R.error&&D._actual===D.expected}),x.value=!0}function A(){const U=ae.value;T.value.push({vals:U.map((D,W)=>i.value[W]||""),expected:"",_pass:null})}function L(U){T.value.splice(U,1)}function se(){const U=z.value.split(`
`).map(W=>W.trim()).filter(W=>W&&!W.startsWith("#"));if(!U.length)return;const D=ae.value;if(!D.length){B("请先填写表达式");return}U.forEach(W=>{const R=W.split(/[\s,]+/).filter(Boolean),k=R.pop()??"";T.value.push({vals:D.map((oe,ce)=>R[ce]??""),expected:k,_pass:null})}),V.value="table",B(`已导入 ${U.length} 个用例`)}function O(U,D){const W=U.split(""),R=D.split(""),k=W.length,oe=R.length,ce=Array.from({length:k+1},()=>new Array(oe+1).fill(0));for(let rn=1;rn<=k;rn++)for(let on=1;on<=oe;on++)ce[rn][on]=W[rn-1]===R[on-1]?ce[rn-1][on-1]+1:Math.max(ce[rn-1][on],ce[rn][on-1]);const Ie=[],Ae=[];let $e=k,ze=oe;for(;$e>0||ze>0;)$e>0&&ze>0&&W[$e-1]===R[ze-1]?(Ie.unshift({char:W[$e-1],type:"match"}),Ae.unshift({char:R[ze-1],type:"match"}),$e--,ze--):ze>0&&($e===0||ce[$e][ze-1]>=ce[$e-1][ze])?(Ie.unshift({char:R[ze-1],type:"extra"}),ze--):(Ae.unshift({char:W[$e-1],type:"missing"}),$e--);return{a:Ie,e:Ae}}function _(){var U;c.value!==null&&((U=navigator.clipboard)==null||U.writeText(String(c.value)),d.value=!0,setTimeout(()=>d.value=!1,1500),B("已复制 "+String(c.value)))}function B(U){f.value=U,clearTimeout(h),h=setTimeout(()=>f.value="",1600)}const ee=Ee(!1);return(U,D)=>(C(),I("div",{class:"root",onClick:D[13]||(D[13]=W=>ee.value=!1)},[u("div",{class:"page-head"},[D[14]||(D[14]=Yl('<div class="page-head-info" data-v-1ef7c890><div class="page-head-line" data-v-1ef7c890><h1 class="page-title" data-v-1ef7c890>批量表达式计算器</h1><span class="page-badge" data-v-1ef7c890>管道 · 调试 · 验证</span></div><div class="page-sub" data-v-1ef7c890>管道表达式实时调试，$N 参数绑定，第 4 阶段支持批量用例 CSV 导入对比</div></div>',1)),u("div",{class:"head-actions"},[u("button",{class:"btn btn-ghost",onClick:Se},"重置"),u("button",{class:"btn btn-secondary",onClick:be},"载入示例")])]),u("div",YM,[u("div",jM,[D[16]||(D[16]=u("span",{class:"phase-num"},"1",-1)),D[17]||(D[17]=u("div",{class:"phase-head-body"},[u("div",{class:"phase-title"},"管道表达式"),u("div",{class:"phase-sub"},"由输入变量 $N 和 | 分隔的操作符组成。在下方面板点击任意操作符追加到当前光标位置。")],-1)),Me.value&&Me.value!=="空"?(C(),I("span",qM,H(Me.value),1)):me("",!0),u("div",{class:"hist-wrap",onClick:D[1]||(D[1]=Qe(()=>{},["stop"]))},[u("button",{class:"btn btn-ghost btn-hist",onClick:D[0]||(D[0]=W=>{ee.value=!ee.value,te()})}," 历史 "),ee.value?(C(),I("div",ZM,[D[15]||(D[15]=u("div",{class:"hist-hdr"},"最近表达式",-1)),E.value.length?me("",!0):(C(),I("div",JM,"暂无历史")),(C(!0),I(he,null,xe(E.value,(W,R)=>(C(),I("button",{key:R,class:"hist-item",onClick:k=>ye(W)},[u("span",ek,H(W.expr.slice(0,60))+H(W.expr.length>60?"…":""),1),u("span",nk,H(ge(W.timestamp)),1)],8,QM))),128))])):me("",!0)])]),u("div",tk,[Te(u("textarea",{ref_key:"textareaEl",ref:p,class:"expr-input","onUpdate:modelValue":D[2]||(D[2]=W=>s.value=W),placeholder:"$1 | add $2 | toHex 8",spellcheck:"false",onInput:J},null,544),[[Ue,s.value]]),u("button",{class:"btn-ghost-sm",onClick:D[3]||(D[3]=W=>{s.value="",J()})},"清空")]),s.value.trim()?me("",!0):(C(),I("div",rk,[D[22]||(D[22]=u("div",{class:"qs-title"},"快速开始",-1)),u("div",ok,[u("button",{class:"qs-card",onClick:D[4]||(D[4]=W=>_e("$1 | toHex 8"))},[...D[18]||(D[18]=[u("code",null,"$1 | toHex 8",-1),u("span",null,"数字 → 8位十六进制",-1)])]),u("button",{class:"qs-card",onClick:D[5]||(D[5]=W=>_e("$1 | shr 8 | and 0xFF"))},[...D[19]||(D[19]=[u("code",null,"$1 | shr 8 | and 0xFF",-1),u("span",null,"提取第 2 字节",-1)])]),u("button",{class:"qs-card",onClick:D[6]||(D[6]=W=>_e("$1 | add $2 | toHex 8"))},[...D[20]||(D[20]=[u("code",null,"$1 | add $2 | toHex 8",-1),u("span",null,"两数相加转十六进制",-1)])]),u("button",{class:"qs-card",onClick:D[7]||(D[7]=W=>_e("$1 | string.format '%.1f°C'"))},[...D[21]||(D[21]=[u("code",null,"string.format '%.1f°C'",-1),u("span",null,"格式化温度字符串",-1)])])])])),u("div",sk,[D[23]||(D[23]=u("div",{class:"ops-head"},"操作符面板 · 悬停看签名说明 · 点击插入到光标处",-1)),u("div",ik,[u("span",{class:"op-cat-name",style:Fe({"--cat-color":o.vars})},"输入",4),u("div",ak,[(C(!0),I(he,null,xe(ae.value.length?ae.value:["$1"],W=>(C(),I("button",{key:W,class:"op-chip","data-cat":"vars",onClick:R=>fe(W,"vars")},[we(H(W)+" ",1),u("span",uk,[u("div",ck,H(W),1),u("div",dk,"引用第 "+H(W.slice(1))+" 个输入参数，从「② 输入参数」获取对应值",1),u("div",fk,H(W)+" | add 5 → (在 "+H(W)+" 的值上加 5)",1)])],8,lk))),128))])]),(C(),I(he,null,xe(t,W=>u("div",{key:W,class:"op-cat-row","data-cat":W},[u("span",{class:"op-cat-name",style:Fe({"--cat-color":o[W]})},H(r[W]),5),u("div",hk,[(C(!0),I(he,null,xe(Object.entries(n).filter(([,R])=>R.cat===W),([R,k])=>(C(),I("button",{key:R,class:"op-chip","data-cat":W,onClick:oe=>fe(R,W)},[we(H(R),1),k.sig.includes(" ")?(C(),I("span",mk,H(k.sig.slice(R.length).trim()),1)):me("",!0),u("span",_k,[u("div",gk,H(k.sig),1),u("div",yk,H(k.desc),1),u("div",Ck,H(k.example),1)])],8,vk))),128))])],8,pk)),64))])]),u("div",{class:ve(["phase",{dim:!s.value.trim()}])},[u("div",Sk,[D[24]||(D[24]=u("span",{class:"phase-num"},"2",-1)),D[25]||(D[25]=u("div",null,[u("div",{class:"phase-title"},"输入参数"),u("div",{class:"phase-sub"},'表达式中引用的 $N 会自动出现在这里。每个变量可填写值和备注（如 "CPU 温度"）。')],-1)),Oe.value&&Oe.value!=="—"?(C(),I("span",{key:0,class:"phase-status",style:Fe({color:re.value.length?"var(--warn)":"var(--ok)"})},H(Oe.value),5)):me("",!0)]),s.value.trim()?N.value===0?(C(),I("div",Ek,"当前表达式无参数，不需要输入值")):(C(),I("div",wk,[(C(!0),I(he,null,xe(N.value,W=>(C(),I("div",{key:W,class:ve(["input-row",{"has-error":re.value.includes(W-1)}])},[u("span",{class:ve(["var-tag",{error:re.value.includes(W-1)}])},"$"+H(W),3),u("div",Ik,[Te(u("input",{class:ve({invalid:re.value.includes(W-1)}),"onUpdate:modelValue":R=>i.value[W-1]=R,onInput:J,placeholder:"值（数字、字符串、0x... 均可）",autocomplete:"off"},null,42,Pk),[[Ue,i.value[W-1]]]),re.value.includes(W-1)?(C(),I("span",$k,"⚠ 未输入 $"+H(W)+" 值，无法进行管道处理",1)):me("",!0)]),Te(u("input",{class:"lbl-input","onUpdate:modelValue":R=>a.value[W-1]=R,placeholder:"备注（可选）"},null,8,xk),[[Ue,a.value[W-1]]])],2))),128))])):(C(),I("div",bk,"① 中尚未引用任何 $N，下方将随表达式自动填充输入框"))],2),u("div",{class:ve(["phase",{done:Ve.value,"phase-error":m.value}])},[u("div",Dk,[u("span",{class:ve(["phase-num",{done:Ve.value,"num-error":m.value}])},"3",2),D[26]||(D[26]=u("div",null,[u("div",{class:"phase-title"},"管道处理"),u("div",{class:"phase-sub"},"实时展开每个阶段的输入、操作和输出，标注数据类型。最后一行给出最终结果。")],-1)),ke.value&&ke.value!=="空"?(C(),I("span",{key:0,class:"phase-status",style:Fe({color:m.value?"var(--err)":Ve.value?"var(--ok)":""})},H(ke.value),5)):me("",!0)]),s.value.trim()?ie.value?(C(),I("div",kk,[D[28]||(D[28]=u("div",{class:"pipe-ico"},"… ⏳ …",-1)),D[29]||(D[29]=u("div",null,"等待输入参数",-1)),u("div",Tk,"还需填写 "+H(re.value.map(W=>"$"+(W+1)).join(", "))+" 才能开始计算",1)])):(C(),I(he,{key:2},[u("div",Vk,[(C(!0),I(he,null,xe(l.value,(W,R)=>{var k,oe;return C(),I(he,{key:R},[u("div",{class:ve(["stage",{"input-stage":R===0,"stage-error":W.error}])},[u("div",{class:ve(["stage-num",{"sn-input":R===0}])},H(R===0?"$":R),3),u("div",Nk,[u("div",Ak,[R===0?(C(),I("span",Fk,H(W.expr),1)):(C(),I(he,{key:1},[u("span",{class:ve(["op-name","cat-"+(((k=n[W.expr.split(" ")[0]])==null?void 0:k.cat)||"arith")])},H(W.expr.split(" ")[0]),3),W.expr.includes(" ")?(C(),I("span",Ok,H(W.expr.split(" ").slice(1).join(" ")),1)):me("",!0)],64))]),u("div",Rk,H(((oe=n[W.expr.split(" ")[0]])==null?void 0:oe.desc)||(R===0?"输入值":"")),1)]),u("div",{class:ve(["stage-val",{"val-err":W.error}])},[W.error?me("",!0):(C(),I("span",Bk,H(K(W.output)),1)),we(" "+H(W.error?"⚠ "+W.error:j(W.output)),1)],2)],2),R<l.value.length-1?(C(),I("div",Lk)):me("",!0)],64)}),128))]),c.value!==null&&!m.value?(C(),I("div",Uk,[u("div",null,[u("div",Hk,"最终结果 · "+H(K(c.value)),1),u("div",zk,H(String(c.value)),1)]),u("button",{class:"btn-copy-final",onClick:_},H(d.value?"✓ 已复制":"复制"),1)])):me("",!0)],64)):(C(),I("div",Mk,[...D[27]||(D[27]=[u("div",{class:"pipe-ico"},"$ · |",-1),u("div",null,"等待表达式 …",-1),u("div",{class:"pipe-reason"},[we("在 "),u("b",null,"①"),we(" 填入表达式后，每个阶段会在这里展开")],-1)])]))],2),u("div",Kk,[u("div",Wk,[D[30]||(D[30]=u("span",{class:"phase-num"},"4",-1)),D[31]||(D[31]=u("div",null,[u("div",{class:"phase-title"},[we("批量用例 "),u("span",{class:"ph4-sub"},"· 复用 ① 的表达式")]),u("div",{class:"phase-sub"},"用一组真实「输入 → 预期值」数据，验证 ① 的表达式是否对每一组都得到正确结果。")],-1)),g.value>0?(C(),I("span",{key:0,class:"phase-status",style:Fe({color:F.value===g.value?"var(--ok)":F.value===0?"var(--err)":"var(--warn)"})},H(`${F.value} / ${g.value} 通过`),5)):me("",!0)]),u("div",Gk,[D[32]||(D[32]=u("span",{class:"tc-ctx-lbl"},"当前表达式",-1)),u("span",{class:ve(["tc-ctx-expr",{empty:!s.value.trim()}])},H(s.value.trim()||"（未填写表达式 · 请先在 ① 输入）"),3)]),u("div",Xk,[u("button",{class:"btn btn-primary",onClick:P},"▶ 运行全部"),u("button",{class:"btn btn-secondary",onClick:A},"+ 新增用例"),u("div",Yk,[u("button",{class:ve({active:V.value==="table"}),onClick:D[8]||(D[8]=W=>V.value="table")},"表格",2),u("button",{class:ve({active:V.value==="csv"}),onClick:D[9]||(D[9]=W=>V.value="csv")},"CSV 粘贴",2)]),u("button",{class:"btn btn-ghost",onClick:D[10]||(D[10]=W=>T.value=[])},"清空"),D[33]||(D[33]=u("div",{style:{flex:"1"}},null,-1)),g.value&&x.value?(C(),I("div",jk,[u("span",{class:ve(["pill",F.value===g.value?"pill-ok":F.value===0?"pill-err":"pill-warn"])},H(F.value)+" / "+H(g.value)+" 通过",3),u("div",qk,[u("div",{class:"pct-fill",style:Fe({width:S.value+"%",background:F.value===g.value?"var(--ok)":F.value===0?"var(--err)":"var(--warn)"})},null,4)]),u("span",Zk,H(S.value)+"%",1)])):me("",!0)]),u("div",{class:ve(["csv-area",{open:V.value==="csv"}])},[D[34]||(D[34]=u("div",{class:"csv-hint"},"每行一个用例 · 列分隔可用逗号或空格 · 最后一列为预期值",-1)),Te(u("textarea",{"onUpdate:modelValue":D[11]||(D[11]=W=>z.value=W),spellcheck:"false",placeholder:`100, 50, 0x00000096
200, 30, 0x000000e6
0, 0, 0x00000000`},null,512),[[Ue,z.value]]),u("div",Jk,[u("button",{class:"btn btn-secondary",onClick:se},"导入到表格"),u("button",{class:"btn btn-ghost",onClick:D[12]||(D[12]=W=>{V.value="table",z.value=""})},"取消")])],2),T.value.length?(C(),I("div",eT,[u("table",nT,[u("thead",null,[u("tr",null,[D[36]||(D[36]=u("th",{class:"num-cell"},"#",-1)),(C(!0),I(he,null,xe(ae.value,W=>(C(),I("th",{key:W},H(W),1))),128)),D[37]||(D[37]=u("th",null,"预期",-1)),D[38]||(D[38]=u("th",null,"实际",-1)),D[39]||(D[39]=u("th",{class:"status-cell"},"状态",-1)),D[40]||(D[40]=u("th",{class:"action-cell"},null,-1))])]),u("tbody",null,[(C(!0),I(he,null,xe(T.value,(W,R)=>(C(),I("tr",{key:R,class:ve(W._pass===!0?"row-pass":W._pass===!1?"row-fail":"")},[u("td",tT,H(R+1),1),(C(!0),I(he,null,xe(ae.value,(k,oe)=>(C(),I("td",{key:k},[Te(u("input",{class:"tc-input","onUpdate:modelValue":ce=>W.vals[oe]=ce,placeholder:"—"},null,8,rT),[[Ue,W.vals[oe]]])]))),128)),u("td",null,[Te(u("input",{class:"tc-input","onUpdate:modelValue":k=>W.expected=k,placeholder:"—"},null,8,oT),[[Ue,W.expected]])]),u("td",null,[W._pass===!0?(C(),I("span",sT,H(W._actual),1)):W._actual?(C(),I("span",iT,[(C(!0),I(he,null,xe(O(W._actual||"",W.expected||"").a,(k,oe)=>(C(),I("span",{key:oe,class:ve(k.type==="match"?"dm":k.type==="extra"?"da":"de")},H(k.char),3))),128))])):(C(),I("span",aT,"—"))]),u("td",lT,[W._pass===null||W._pass===void 0?(C(),I("span",uT,"—")):W._pass?(C(),I("span",cT,"✓ PASS")):(C(),I("span",dT,"✗ FAIL"))]),u("td",fT,[u("button",{class:"del-btn",onClick:k=>L(R)},"✕",8,pT)])],2))),128))])])])):(C(),I("div",Qk,[...D[35]||(D[35]=[u("div",{class:"tc-empty-ico"},"— · — · — · —",-1),u("div",null,[we("尚无用例 · 点击 "),u("b",null,"+ 新增用例"),we(" 添加，或切到 CSV 粘贴模式批量导入")],-1)])]))]),u("div",{class:ve(["toast",{show:f.value}])},H(f.value),3)]))}}),mT=ft(vT,[["__scopeId","data-v-1ef7c890"]]),_T={class:"cooling-root"},gT=["src"],yT=We({__name:"CoolingConfigView",setup(e){const n="/BMC/vue-topo/",t=ue(()=>n.endsWith("/")?n+"cooling-config/index.html":n+"/cooling-config/index.html");return(r,o)=>(C(),I("div",_T,[u("iframe",{src:t.value,class:"cooling-frame",title:"能效调速配置编辑器",sandbox:"allow-scripts allow-same-origin allow-downloads allow-modals allow-popups"},null,8,gT)]))}}),CT=ft(yT,[["__scopeId","data-v-e8b99b6a"]]),ST={class:"app-root"},bT={key:0,class:"pane pane-main"},ET={key:0,class:"dock-head"},wT={class:"dock-title"},IT={class:"dock-title-ic",viewBox:"0 0 24 24","aria-hidden":"true"},PT=["d"],$T={class:"dock-hint"},xT={class:"dock-body"},DT={class:"code-head"},MT={class:"code-file"},kT={class:"code-body"},TT={class:"ln"},VT={class:"lc"},NT=We({__name:"App",setup(e){const{state:n,closeDock:t,closeCodeDoc:r}=Qi();bn(()=>{let x=!1;try{x=window.self!==window.top}catch{x=!0}x&&document.documentElement.style.setProperty("--embed-top-inset","52px")});const o=Ee(42),s=ue(()=>{var x;return(((x=n.codeDoc)==null?void 0:x.content)||"").split(`
`)});let i=!1;function a(x){i=!0,x.preventDefault(),window.addEventListener("mousemove",l),window.addEventListener("mouseup",c)}function l(x){if(!i)return;const N=(window.innerWidth-x.clientX)/window.innerWidth*100;o.value=Math.min(70,Math.max(24,N))}function c(){i=!1,window.removeEventListener("mousemove",l),window.removeEventListener("mouseup",c)}const d={smc:{label:"SMC 偏移量计算器",icon:"M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"},expr:{label:"批量表达式计算器",icon:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"},cooling:{label:"能效调速配置模板",icon:"M12 3a3 3 0 0 0-3 3v7.1a5 5 0 1 0 6 0V6a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v8.02l.5.36a3 3 0 1 1-3 0l.5-.36V6a1 1 0 0 1 1-1z"},alarm:{label:"板卡告警配置",icon:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"}};(function(){const N=location.hash.replace("#",""),re=new URLSearchParams(location.search).get("tab"),ie=N||re||"";(ie==="smc"||ie==="expr"||ie==="cooling")&&(n.dockTool=ie)})();const f=new URLSearchParams(location.search).get("solo")==="true",h=ue(()=>n.dockTool==="alarm"),p=Ee(46),E=Ee(50);let b=!1;function T(x){b=!0,x.preventDefault(),window.addEventListener("mousemove",V),window.addEventListener("mouseup",z)}function V(x){if(b)if(h.value){const N=(window.innerHeight-x.clientY)/window.innerHeight*100;E.value=Math.min(78,Math.max(22,N))}else{const N=(window.innerWidth-x.clientX)/window.innerWidth*100;p.value=Math.min(70,Math.max(26,N))}}function z(){b=!1,window.removeEventListener("mousemove",V),window.removeEventListener("mouseup",z)}return Be(()=>[n.dockTool,p.value,E.value,n.codeDoc,o.value],()=>{fn(()=>window.dispatchEvent(new Event("resize")))}),(x,N)=>(C(),I("div",ST,[u("div",{class:ve(["view-area",{split:de(n).dockTool&&!f,bottom:h.value&&!f}])},[f?me("",!0):(C(),I("div",bT,[Te(Ke(hD,null,null,512),[[Nf,de(n).anchor==="topology"]]),de(n).anchor==="code"?(C(),Je(TD,{key:0})):me("",!0)])),de(n).dockTool?(C(),I(he,{key:1},[f?me("",!0):(C(),I("div",{key:0,class:"splitter",onMousedown:T,title:"拖动调整分屏宽度"},null,32)),u("div",{class:ve(["pane pane-dock",{"pane-solo":f}]),style:Fe(f?{}:h.value?{height:E.value+"%"}:{width:p.value+"%"})},[f?me("",!0):(C(),I("div",ET,[u("span",wT,[(C(),I("svg",IT,[u("path",{d:d[de(n).dockTool].icon},null,8,PT)])),we(H(d[de(n).dockTool].label),1)]),u("span",$T,H(h.value?"底部停靠 · 与拓扑实时同步":"分屏联动 · 与拓扑实时同步"),1),u("button",{class:"dock-close","aria-label":"关闭分屏",onClick:N[0]||(N[0]=(...re)=>de(t)&&de(t)(...re))},"✕")])),u("div",xT,[de(n).dockTool==="smc"?(C(),Je(XM,{key:0})):de(n).dockTool==="expr"?(C(),Je(mT,{key:1})):de(n).dockTool==="cooling"?(C(),Je(CT,{key:2})):de(n).dockTool==="alarm"?(C(),Je(Dl,{key:3})):me("",!0)])],6)],64)):me("",!0),de(n).codeDoc&&!f?(C(),I(he,{key:2},[u("div",{class:"splitter",onMousedown:a,title:"拖动调整代码分屏宽度"},null,32),u("div",{class:"pane pane-code",style:Fe({width:o.value+"%"})},[u("div",DT,[u("span",MT,[N[2]||(N[2]=u("svg",{class:"code-file-ic",viewBox:"0 0 24 24","aria-hidden":"true"},[u("path",{d:"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5z"})],-1)),we(H(de(n).codeDoc.file),1)]),N[3]||(N[3]=u("span",{class:"code-hint"},"告警配置 → CSR 对象（只读预览）",-1)),u("button",{class:"dock-close","aria-label":"关闭代码",onClick:N[1]||(N[1]=(...re)=>de(r)&&de(r)(...re))},"✕")]),u("div",kT,[(C(!0),I(he,null,xe(s.value,(re,ie)=>(C(),I("div",{key:ie,class:"code-line"},[u("span",TT,H(ie+1),1),u("span",VT,H(re),1)]))),128))])],4)],64)):me("",!0)],2)]))}}),AT=ft(NT,[["__scopeId","data-v-926bac0f"]]);sv(AT).mount("#app");
