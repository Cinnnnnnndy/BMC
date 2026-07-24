(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();/**
* @vue/shared v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function cl(e){const n=Object.create(null);for(const t of e.split(","))n[t]=1;return t=>t in n}const Ze={},Er=[],rt=()=>{},Jc=()=>!1,pi=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),hi=e=>e.startsWith("onUpdate:"),vn=Object.assign,dl=(e,n)=>{const t=e.indexOf(n);t>-1&&e.splice(t,1)},s0=Object.prototype.hasOwnProperty,Ge=(e,n)=>s0.call(e,n),Te=Array.isArray,wr=e=>Go(e)==="[object Map]",zr=e=>Go(e)==="[object Set]",Ql=e=>Go(e)==="[object Date]",Ae=e=>typeof e=="function",rn=e=>typeof e=="string",Vn=e=>typeof e=="symbol",qe=e=>e!==null&&typeof e=="object",Qc=e=>(qe(e)||Ae(e))&&Ae(e.then)&&Ae(e.catch),ed=Object.prototype.toString,Go=e=>ed.call(e),i0=e=>Go(e).slice(8,-1),nd=e=>Go(e)==="[object Object]",mi=e=>rn(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,vo=cl(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),vi=e=>{const n=Object.create(null);return t=>n[t]||(n[t]=e(t))},a0=/-\w/g,Pn=vi(e=>e.replace(a0,n=>n.slice(1).toUpperCase())),l0=/\B([A-Z])/g,Gt=vi(e=>e.replace(l0,"-$1").toLowerCase()),_i=vi(e=>e.charAt(0).toUpperCase()+e.slice(1)),Ki=vi(e=>e?`on${_i(e)}`:""),Bn=(e,n)=>!Object.is(e,n),Ss=(e,...n)=>{for(let t=0;t<e.length;t++)e[t](...n)},td=(e,n,t,r=!1)=>{Object.defineProperty(e,n,{configurable:!0,enumerable:!1,writable:r,value:t})},gi=e=>{const n=parseFloat(e);return isNaN(n)?e:n};let eu;const yi=()=>eu||(eu=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Ve(e){if(Te(e)){const n={};for(let t=0;t<e.length;t++){const r=e[t],o=rn(r)?f0(r):Ve(r);if(o)for(const s in o)n[s]=o[s]}return n}else if(rn(e)||qe(e))return e}const u0=/;(?![^(]*\))/g,c0=/:([^]+)/,d0=/\/\*[^]*?\*\//g;function f0(e){const n={};return e.replace(d0,"").split(u0).forEach(t=>{if(t){const r=t.split(c0);r.length>1&&(n[r[0].trim()]=r[1].trim())}}),n}function fe(e){let n="";if(rn(e))n=e;else if(Te(e))for(let t=0;t<e.length;t++){const r=fe(e[t]);r&&(n+=r+" ")}else if(qe(e))for(const t in e)e[t]&&(n+=t+" ");return n.trim()}function p0(e){if(!e)return null;let{class:n,style:t}=e;return n&&!rn(n)&&(e.class=fe(n)),t&&(e.style=Ve(t)),e}const h0="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",m0=cl(h0);function rd(e){return!!e||e===""}function v0(e,n){if(e.length!==n.length)return!1;let t=!0;for(let r=0;t&&r<e.length;r++)t=Kr(e[r],n[r]);return t}function Kr(e,n){if(e===n)return!0;let t=Ql(e),r=Ql(n);if(t||r)return t&&r?e.getTime()===n.getTime():!1;if(t=Vn(e),r=Vn(n),t||r)return e===n;if(t=Te(e),r=Te(n),t||r)return t&&r?v0(e,n):!1;if(t=qe(e),r=qe(n),t||r){if(!t||!r)return!1;const o=Object.keys(e).length,s=Object.keys(n).length;if(o!==s)return!1;for(const i in e){const a=e.hasOwnProperty(i),l=n.hasOwnProperty(i);if(a&&!l||!a&&l||!Kr(e[i],n[i]))return!1}}return String(e)===String(n)}function fl(e,n){return e.findIndex(t=>Kr(t,n))}const od=e=>!!(e&&e.__v_isRef===!0),R=e=>rn(e)?e:e==null?"":Te(e)||qe(e)&&(e.toString===ed||!Ae(e.toString))?od(e)?R(e.value):JSON.stringify(e,sd,2):String(e),sd=(e,n)=>od(n)?sd(e,n.value):wr(n)?{[`Map(${n.size})`]:[...n.entries()].reduce((t,[r,o],s)=>(t[Wi(r,s)+" =>"]=o,t),{})}:zr(n)?{[`Set(${n.size})`]:[...n.values()].map(t=>Wi(t))}:Vn(n)?Wi(n):qe(n)&&!Te(n)&&!nd(n)?String(n):n,Wi=(e,n="")=>{var t;return Vn(e)?`Symbol(${(t=e.description)!=null?t:n})`:e};/**
* @vue/reactivity v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let gn;class id{constructor(n=!1){this.detached=n,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=gn,!n&&gn&&(this.index=(gn.scopes||(gn.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let n,t;if(this.scopes)for(n=0,t=this.scopes.length;n<t;n++)this.scopes[n].pause();for(n=0,t=this.effects.length;n<t;n++)this.effects[n].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let n,t;if(this.scopes)for(n=0,t=this.scopes.length;n<t;n++)this.scopes[n].resume();for(n=0,t=this.effects.length;n<t;n++)this.effects[n].resume()}}run(n){if(this._active){const t=gn;try{return gn=this,n()}finally{gn=t}}}on(){++this._on===1&&(this.prevScope=gn,gn=this)}off(){this._on>0&&--this._on===0&&(gn=this.prevScope,this.prevScope=void 0)}stop(n){if(this._active){this._active=!1;let t,r;for(t=0,r=this.effects.length;t<r;t++)this.effects[t].stop();for(this.effects.length=0,t=0,r=this.cleanups.length;t<r;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!n){const o=this.parent.scopes.pop();o&&o!==this&&(this.parent.scopes[this.index]=o,o.index=this.index)}this.parent=void 0}}}function ad(e){return new id(e)}function pl(){return gn}function bs(e,n=!1){gn&&gn.cleanups.push(e)}let Qe;const Gi=new WeakSet;class ld{constructor(n){this.fn=n,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,gn&&gn.active&&gn.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Gi.has(this)&&(Gi.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||cd(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,nu(this),dd(this);const n=Qe,t=zn;Qe=this,zn=!0;try{return this.fn()}finally{fd(this),Qe=n,zn=t,this.flags&=-3}}stop(){if(this.flags&1){for(let n=this.deps;n;n=n.nextDep)vl(n);this.deps=this.depsTail=void 0,nu(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Gi.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Ea(this)&&this.run()}get dirty(){return Ea(this)}}let ud=0,_o,go;function cd(e,n=!1){if(e.flags|=8,n){e.next=go,go=e;return}e.next=_o,_o=e}function hl(){ud++}function ml(){if(--ud>0)return;if(go){let n=go;for(go=void 0;n;){const t=n.next;n.next=void 0,n.flags&=-9,n=t}}let e;for(;_o;){let n=_o;for(_o=void 0;n;){const t=n.next;if(n.next=void 0,n.flags&=-9,n.flags&1)try{n.trigger()}catch(r){e||(e=r)}n=t}}if(e)throw e}function dd(e){for(let n=e.deps;n;n=n.nextDep)n.version=-1,n.prevActiveLink=n.dep.activeLink,n.dep.activeLink=n}function fd(e){let n,t=e.depsTail,r=t;for(;r;){const o=r.prevDep;r.version===-1?(r===t&&(t=o),vl(r),_0(r)):n=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=o}e.deps=n,e.depsTail=t}function Ea(e){for(let n=e.deps;n;n=n.nextDep)if(n.dep.version!==n.version||n.dep.computed&&(pd(n.dep.computed)||n.dep.version!==n.version))return!0;return!!e._dirty}function pd(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Io)||(e.globalVersion=Io,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Ea(e))))return;e.flags|=2;const n=e.dep,t=Qe,r=zn;Qe=e,zn=!0;try{dd(e);const o=e.fn(e._value);(n.version===0||Bn(o,e._value))&&(e.flags|=128,e._value=o,n.version++)}catch(o){throw n.version++,o}finally{Qe=t,zn=r,fd(e),e.flags&=-3}}function vl(e,n=!1){const{dep:t,prevSub:r,nextSub:o}=e;if(r&&(r.nextSub=o,e.prevSub=void 0),o&&(o.prevSub=r,e.nextSub=void 0),t.subs===e&&(t.subs=r,!r&&t.computed)){t.computed.flags&=-5;for(let s=t.computed.deps;s;s=s.nextDep)vl(s,!0)}!n&&!--t.sc&&t.map&&t.map.delete(t.key)}function _0(e){const{prevDep:n,nextDep:t}=e;n&&(n.nextDep=t,e.prevDep=void 0),t&&(t.prevDep=n,e.nextDep=void 0)}let zn=!0;const hd=[];function It(){hd.push(zn),zn=!1}function Pt(){const e=hd.pop();zn=e===void 0?!0:e}function nu(e){const{cleanup:n}=e;if(e.cleanup=void 0,n){const t=Qe;Qe=void 0;try{n()}finally{Qe=t}}}let Io=0;class g0{constructor(n,t){this.sub=n,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Ci{constructor(n){this.computed=n,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(n){if(!Qe||!zn||Qe===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==Qe)t=this.activeLink=new g0(Qe,this),Qe.deps?(t.prevDep=Qe.depsTail,Qe.depsTail.nextDep=t,Qe.depsTail=t):Qe.deps=Qe.depsTail=t,md(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const r=t.nextDep;r.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=r),t.prevDep=Qe.depsTail,t.nextDep=void 0,Qe.depsTail.nextDep=t,Qe.depsTail=t,Qe.deps===t&&(Qe.deps=r)}return t}trigger(n){this.version++,Io++,this.notify(n)}notify(n){hl();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{ml()}}}function md(e){if(e.dep.sc++,e.sub.flags&4){const n=e.dep.computed;if(n&&!e.dep.subs){n.flags|=20;for(let r=n.deps;r;r=r.nextDep)md(r)}const t=e.dep.subs;t!==e&&(e.prevSub=t,t&&(t.nextSub=e)),e.dep.subs=e}}const Bs=new WeakMap,ir=Symbol(""),wa=Symbol(""),Po=Symbol("");function yn(e,n,t){if(zn&&Qe){let r=Bs.get(e);r||Bs.set(e,r=new Map);let o=r.get(t);o||(r.set(t,o=new Ci),o.map=r,o.key=t),o.track()}}function gt(e,n,t,r,o,s){const i=Bs.get(e);if(!i){Io++;return}const a=l=>{l&&l.trigger()};if(hl(),n==="clear")i.forEach(a);else{const l=Te(e),u=l&&mi(t);if(l&&t==="length"){const d=Number(r);i.forEach((f,h)=>{(h==="length"||h===Po||!Vn(h)&&h>=d)&&a(f)})}else switch((t!==void 0||i.has(void 0))&&a(i.get(t)),u&&a(i.get(Po)),n){case"add":l?u&&a(i.get("length")):(a(i.get(ir)),wr(e)&&a(i.get(wa)));break;case"delete":l||(a(i.get(ir)),wr(e)&&a(i.get(wa)));break;case"set":wr(e)&&a(i.get(ir));break}}ml()}function y0(e,n){const t=Bs.get(e);return t&&t.get(n)}function gr(e){const n=Ke(e);return n===e?n:(yn(n,"iterate",Po),kn(e)?n:n.map(Kn))}function Si(e){return yn(e=Ke(e),"iterate",Po),e}function Jn(e,n){return $t(e)?Tr(ar(e)?Kn(n):n):Kn(n)}const C0={__proto__:null,[Symbol.iterator](){return Xi(this,Symbol.iterator,e=>Jn(this,e))},concat(...e){return gr(this).concat(...e.map(n=>Te(n)?gr(n):n))},entries(){return Xi(this,"entries",e=>(e[1]=Jn(this,e[1]),e))},every(e,n){return pt(this,"every",e,n,void 0,arguments)},filter(e,n){return pt(this,"filter",e,n,t=>t.map(r=>Jn(this,r)),arguments)},find(e,n){return pt(this,"find",e,n,t=>Jn(this,t),arguments)},findIndex(e,n){return pt(this,"findIndex",e,n,void 0,arguments)},findLast(e,n){return pt(this,"findLast",e,n,t=>Jn(this,t),arguments)},findLastIndex(e,n){return pt(this,"findLastIndex",e,n,void 0,arguments)},forEach(e,n){return pt(this,"forEach",e,n,void 0,arguments)},includes(...e){return Yi(this,"includes",e)},indexOf(...e){return Yi(this,"indexOf",e)},join(e){return gr(this).join(e)},lastIndexOf(...e){return Yi(this,"lastIndexOf",e)},map(e,n){return pt(this,"map",e,n,void 0,arguments)},pop(){return qr(this,"pop")},push(...e){return qr(this,"push",e)},reduce(e,...n){return tu(this,"reduce",e,n)},reduceRight(e,...n){return tu(this,"reduceRight",e,n)},shift(){return qr(this,"shift")},some(e,n){return pt(this,"some",e,n,void 0,arguments)},splice(...e){return qr(this,"splice",e)},toReversed(){return gr(this).toReversed()},toSorted(e){return gr(this).toSorted(e)},toSpliced(...e){return gr(this).toSpliced(...e)},unshift(...e){return qr(this,"unshift",e)},values(){return Xi(this,"values",e=>Jn(this,e))}};function Xi(e,n,t){const r=Si(e),o=r[n]();return r!==e&&!kn(e)&&(o._next=o.next,o.next=()=>{const s=o._next();return s.done||(s.value=t(s.value)),s}),o}const S0=Array.prototype;function pt(e,n,t,r,o,s){const i=Si(e),a=i!==e&&!kn(e),l=i[n];if(l!==S0[n]){const f=l.apply(e,s);return a?Kn(f):f}let u=t;i!==e&&(a?u=function(f,h){return t.call(this,Jn(e,f),h,e)}:t.length>2&&(u=function(f,h){return t.call(this,f,h,e)}));const d=l.call(i,u,r);return a&&o?o(d):d}function tu(e,n,t,r){const o=Si(e),s=o!==e&&!kn(e);let i=t,a=!1;o!==e&&(s?(a=r.length===0,i=function(u,d,f){return a&&(a=!1,u=Jn(e,u)),t.call(this,u,Jn(e,d),f,e)}):t.length>3&&(i=function(u,d,f){return t.call(this,u,d,f,e)}));const l=o[n](i,...r);return a?Jn(e,l):l}function Yi(e,n,t){const r=Ke(e);yn(r,"iterate",Po);const o=r[n](...t);return(o===-1||o===!1)&&bi(t[0])?(t[0]=Ke(t[0]),r[n](...t)):o}function qr(e,n,t=[]){It(),hl();const r=Ke(e)[n].apply(e,t);return ml(),Pt(),r}const b0=cl("__proto__,__v_isRef,__isVue"),vd=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Vn));function E0(e){Vn(e)||(e=String(e));const n=Ke(this);return yn(n,"has",e),n.hasOwnProperty(e)}class _d{constructor(n=!1,t=!1){this._isReadonly=n,this._isShallow=t}get(n,t,r){if(t==="__v_skip")return n.__v_skip;const o=this._isReadonly,s=this._isShallow;if(t==="__v_isReactive")return!o;if(t==="__v_isReadonly")return o;if(t==="__v_isShallow")return s;if(t==="__v_raw")return r===(o?s?V0:Sd:s?Cd:yd).get(n)||Object.getPrototypeOf(n)===Object.getPrototypeOf(r)?n:void 0;const i=Te(n);if(!o){let l;if(i&&(l=C0[t]))return l;if(t==="hasOwnProperty")return E0}const a=Reflect.get(n,t,sn(n)?n:r);if((Vn(t)?vd.has(t):b0(t))||(o||yn(n,"get",t),s))return a;if(sn(a)){const l=i&&mi(t)?a:a.value;return o&&qe(l)?$o(l):l}return qe(a)?o?$o(a):ot(a):a}}class gd extends _d{constructor(n=!1){super(!1,n)}set(n,t,r,o){let s=n[t];const i=Te(n)&&mi(t);if(!this._isShallow){const u=$t(s);if(!kn(r)&&!$t(r)&&(s=Ke(s),r=Ke(r)),!i&&sn(s)&&!sn(r))return u||(s.value=r),!0}const a=i?Number(t)<n.length:Ge(n,t),l=Reflect.set(n,t,r,sn(n)?n:o);return n===Ke(o)&&(a?Bn(r,s)&&gt(n,"set",t,r):gt(n,"add",t,r)),l}deleteProperty(n,t){const r=Ge(n,t);n[t];const o=Reflect.deleteProperty(n,t);return o&&r&&gt(n,"delete",t,void 0),o}has(n,t){const r=Reflect.has(n,t);return(!Vn(t)||!vd.has(t))&&yn(n,"has",t),r}ownKeys(n){return yn(n,"iterate",Te(n)?"length":ir),Reflect.ownKeys(n)}}class w0 extends _d{constructor(n=!1){super(!0,n)}set(n,t){return!0}deleteProperty(n,t){return!0}}const I0=new gd,P0=new w0,$0=new gd(!0);const Ia=e=>e,ts=e=>Reflect.getPrototypeOf(e);function x0(e,n,t){return function(...r){const o=this.__v_raw,s=Ke(o),i=wr(s),a=e==="entries"||e===Symbol.iterator&&i,l=e==="keys"&&i,u=o[e](...r),d=t?Ia:n?Tr:Kn;return!n&&yn(s,"iterate",l?wa:ir),vn(Object.create(u),{next(){const{value:f,done:h}=u.next();return h?{value:f,done:h}:{value:a?[d(f[0]),d(f[1])]:d(f),done:h}}})}}function rs(e){return function(...n){return e==="delete"?!1:e==="clear"?void 0:this}}function D0(e,n){const t={get(o){const s=this.__v_raw,i=Ke(s),a=Ke(o);e||(Bn(o,a)&&yn(i,"get",o),yn(i,"get",a));const{has:l}=ts(i),u=n?Ia:e?Tr:Kn;if(l.call(i,o))return u(s.get(o));if(l.call(i,a))return u(s.get(a));s!==i&&s.get(o)},get size(){const o=this.__v_raw;return!e&&yn(Ke(o),"iterate",ir),o.size},has(o){const s=this.__v_raw,i=Ke(s),a=Ke(o);return e||(Bn(o,a)&&yn(i,"has",o),yn(i,"has",a)),o===a?s.has(o):s.has(o)||s.has(a)},forEach(o,s){const i=this,a=i.__v_raw,l=Ke(a),u=n?Ia:e?Tr:Kn;return!e&&yn(l,"iterate",ir),a.forEach((d,f)=>o.call(s,u(d),u(f),i))}};return vn(t,e?{add:rs("add"),set:rs("set"),delete:rs("delete"),clear:rs("clear")}:{add(o){const s=Ke(this),i=ts(s),a=Ke(o),l=!n&&!kn(o)&&!$t(o)?a:o;return i.has.call(s,l)||Bn(o,l)&&i.has.call(s,o)||Bn(a,l)&&i.has.call(s,a)||(s.add(l),gt(s,"add",l,l)),this},set(o,s){!n&&!kn(s)&&!$t(s)&&(s=Ke(s));const i=Ke(this),{has:a,get:l}=ts(i);let u=a.call(i,o);u||(o=Ke(o),u=a.call(i,o));const d=l.call(i,o);return i.set(o,s),u?Bn(s,d)&&gt(i,"set",o,s):gt(i,"add",o,s),this},delete(o){const s=Ke(this),{has:i,get:a}=ts(s);let l=i.call(s,o);l||(o=Ke(o),l=i.call(s,o)),a&&a.call(s,o);const u=s.delete(o);return l&&gt(s,"delete",o,void 0),u},clear(){const o=Ke(this),s=o.size!==0,i=o.clear();return s&&gt(o,"clear",void 0,void 0),i}}),["keys","values","entries",Symbol.iterator].forEach(o=>{t[o]=x0(o,e,n)}),t}function _l(e,n){const t=D0(e,n);return(r,o,s)=>o==="__v_isReactive"?!e:o==="__v_isReadonly"?e:o==="__v_raw"?r:Reflect.get(Ge(t,o)&&o in r?t:r,o,s)}const M0={get:_l(!1,!1)},k0={get:_l(!1,!0)},T0={get:_l(!0,!1)};const yd=new WeakMap,Cd=new WeakMap,Sd=new WeakMap,V0=new WeakMap;function N0(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function A0(e){return e.__v_skip||!Object.isExtensible(e)?0:N0(i0(e))}function ot(e){return $t(e)?e:gl(e,!1,I0,M0,yd)}function F0(e){return gl(e,!1,$0,k0,Cd)}function $o(e){return gl(e,!0,P0,T0,Sd)}function gl(e,n,t,r,o){if(!qe(e)||e.__v_raw&&!(n&&e.__v_isReactive))return e;const s=A0(e);if(s===0)return e;const i=o.get(e);if(i)return i;const a=new Proxy(e,s===2?r:t);return o.set(e,a),a}function ar(e){return $t(e)?ar(e.__v_raw):!!(e&&e.__v_isReactive)}function $t(e){return!!(e&&e.__v_isReadonly)}function kn(e){return!!(e&&e.__v_isShallow)}function bi(e){return e?!!e.__v_raw:!1}function Ke(e){const n=e&&e.__v_raw;return n?Ke(n):e}function Et(e){return!Ge(e,"__v_skip")&&Object.isExtensible(e)&&td(e,"__v_skip",!0),e}const Kn=e=>qe(e)?ot(e):e,Tr=e=>qe(e)?$o(e):e;function sn(e){return e?e.__v_isRef===!0:!1}function Ee(e){return bd(e,!1)}function Ut(e){return bd(e,!0)}function bd(e,n){return sn(e)?e:new O0(e,n)}class O0{constructor(n,t){this.dep=new Ci,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?n:Ke(n),this._value=t?n:Kn(n),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(n){const t=this._rawValue,r=this.__v_isShallow||kn(n)||$t(n);n=r?n:Ke(n),Bn(n,t)&&(this._rawValue=n,this._value=r?n:Kn(n),this.dep.trigger())}}function le(e){return sn(e)?e.value:e}function Ue(e){return Ae(e)?e():le(e)}const B0={get:(e,n,t)=>n==="__v_raw"?e:le(Reflect.get(e,n,t)),set:(e,n,t,r)=>{const o=e[n];return sn(o)&&!sn(t)?(o.value=t,!0):Reflect.set(e,n,t,r)}};function Ed(e){return ar(e)?e:new Proxy(e,B0)}class R0{constructor(n){this.__v_isRef=!0,this._value=void 0;const t=this.dep=new Ci,{get:r,set:o}=n(t.track.bind(t),t.trigger.bind(t));this._get=r,this._set=o}get value(){return this._value=this._get()}set value(n){this._set(n)}}function L0(e){return new R0(e)}function U0(e){const n=Te(e)?new Array(e.length):{};for(const t in e)n[t]=wd(e,t);return n}class H0{constructor(n,t,r){this._object=n,this._defaultValue=r,this.__v_isRef=!0,this._value=void 0,this._key=Vn(t)?t:String(t),this._raw=Ke(n);let o=!0,s=n;if(!Te(n)||Vn(this._key)||!mi(this._key))do o=!bi(s)||kn(s);while(o&&(s=s.__v_raw));this._shallow=o}get value(){let n=this._object[this._key];return this._shallow&&(n=le(n)),this._value=n===void 0?this._defaultValue:n}set value(n){if(this._shallow&&sn(this._raw[this._key])){const t=this._object[this._key];if(sn(t)){t.value=n;return}}this._object[this._key]=n}get dep(){return y0(this._raw,this._key)}}class z0{constructor(n){this._getter=n,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function We(e,n,t){return sn(e)?e:Ae(e)?new z0(e):qe(e)&&arguments.length>1?wd(e,n,t):Ee(e)}function wd(e,n,t){return new H0(e,n,t)}class K0{constructor(n,t,r){this.fn=n,this.setter=t,this._value=void 0,this.dep=new Ci(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Io-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&Qe!==this)return cd(this,!0),!0}get value(){const n=this.dep.track();return pd(this),n&&(n.version=this.dep.version),this._value}set value(n){this.setter&&this.setter(n)}}function W0(e,n,t=!1){let r,o;return Ae(e)?r=e:(r=e.get,o=e.set),new K0(r,o,t)}const os={},Rs=new WeakMap;let Jt;function G0(e,n=!1,t=Jt){if(t){let r=Rs.get(t);r||Rs.set(t,r=[]),r.push(e)}}function X0(e,n,t=Ze){const{immediate:r,deep:o,once:s,scheduler:i,augmentJob:a,call:l}=t,u=O=>o?O:kn(O)||o===!1||o===0?yt(O,1):yt(O);let d,f,h,p,I=!1,P=!1;if(sn(e)?(f=()=>e.value,I=kn(e)):ar(e)?(f=()=>u(e),I=!0):Te(e)?(P=!0,I=e.some(O=>ar(O)||kn(O)),f=()=>e.map(O=>{if(sn(O))return O.value;if(ar(O))return u(O);if(Ae(O))return l?l(O,2):O()})):Ae(e)?n?f=l?()=>l(e,2):e:f=()=>{if(h){It();try{h()}finally{Pt()}}const O=Jt;Jt=d;try{return l?l(e,3,[p]):e(p)}finally{Jt=O}}:f=rt,n&&o){const O=f,Q=o===!0?1/0:o;f=()=>yt(O(),Q)}const x=pl(),N=()=>{d.stop(),x&&x.active&&dl(x.effects,d)};if(s&&n){const O=n;n=(...Q)=>{O(...Q),N()}}let U=P?new Array(e.length).fill(os):os;const D=O=>{if(!(!(d.flags&1)||!d.dirty&&!O))if(n){const Q=d.run();if(o||I||(P?Q.some((ee,ne)=>Bn(ee,U[ne])):Bn(Q,U))){h&&h();const ee=Jt;Jt=d;try{const ne=[Q,U===os?void 0:P&&U[0]===os?[]:U,p];U=Q,l?l(n,3,ne):n(...ne)}finally{Jt=ee}}}else d.run()};return a&&a(D),d=new ld(f),d.scheduler=i?()=>i(D,!1):D,p=O=>G0(O,!1,d),h=d.onStop=()=>{const O=Rs.get(d);if(O){if(l)l(O,4);else for(const Q of O)Q();Rs.delete(d)}},n?r?D(!0):U=d.run():i?i(D.bind(null,!0),!0):d.run(),N.pause=d.pause.bind(d),N.resume=d.resume.bind(d),N.stop=N,N}function yt(e,n=1/0,t){if(n<=0||!qe(e)||e.__v_skip||(t=t||new Map,(t.get(e)||0)>=n))return e;if(t.set(e,n),n--,sn(e))yt(e.value,n,t);else if(Te(e))for(let r=0;r<e.length;r++)yt(e[r],n,t);else if(zr(e)||wr(e))e.forEach(r=>{yt(r,n,t)});else if(nd(e)){for(const r in e)yt(e[r],n,t);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&yt(e[r],n,t)}return e}/**
* @vue/runtime-core v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Xo(e,n,t,r){try{return r?e(...r):e()}catch(o){Ei(o,n,t)}}function at(e,n,t,r){if(Ae(e)){const o=Xo(e,n,t,r);return o&&Qc(o)&&o.catch(s=>{Ei(s,n,t)}),o}if(Te(e)){const o=[];for(let s=0;s<e.length;s++)o.push(at(e[s],n,t,r));return o}}function Ei(e,n,t,r=!0){const o=n?n.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:i}=n&&n.appContext.config||Ze;if(n){let a=n.parent;const l=n.proxy,u=`https://vuejs.org/error-reference/#runtime-${t}`;for(;a;){const d=a.ec;if(d){for(let f=0;f<d.length;f++)if(d[f](e,l,u)===!1)return}a=a.parent}if(s){It(),Xo(s,null,10,[e,l,u]),Pt();return}}Y0(e,t,o,r,i)}function Y0(e,n,t,r=!0,o=!1){if(o)throw e;console.error(e)}const En=[];let jn=-1;const Ir=[];let Ft=null,br=0;const Id=Promise.resolve();let Ls=null;function mn(e){const n=Ls||Id;return e?n.then(this?e.bind(this):e):n}function q0(e){let n=jn+1,t=En.length;for(;n<t;){const r=n+t>>>1,o=En[r],s=xo(o);s<e||s===e&&o.flags&2?n=r+1:t=r}return n}function yl(e){if(!(e.flags&1)){const n=xo(e),t=En[En.length-1];!t||!(e.flags&2)&&n>=xo(t)?En.push(e):En.splice(q0(n),0,e),e.flags|=1,Pd()}}function Pd(){Ls||(Ls=Id.then(xd))}function j0(e){Te(e)?Ir.push(...e):Ft&&e.id===-1?Ft.splice(br+1,0,e):e.flags&1||(Ir.push(e),e.flags|=1),Pd()}function ru(e,n,t=jn+1){for(;t<En.length;t++){const r=En[t];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;En.splice(t,1),t--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function $d(e){if(Ir.length){const n=[...new Set(Ir)].sort((t,r)=>xo(t)-xo(r));if(Ir.length=0,Ft){Ft.push(...n);return}for(Ft=n,br=0;br<Ft.length;br++){const t=Ft[br];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}Ft=null,br=0}}const xo=e=>e.id==null?e.flags&2?-1:1/0:e.id;function xd(e){try{for(jn=0;jn<En.length;jn++){const n=En[jn];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),Xo(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;jn<En.length;jn++){const n=En[jn];n&&(n.flags&=-2)}jn=-1,En.length=0,$d(),Ls=null,(En.length||Ir.length)&&xd()}}let hn=null,Dd=null;function Us(e){const n=hn;return hn=e,Dd=e&&e.type.__scopeId||null,n}function Rn(e,n=hn,t){if(!n||e._n)return e;const r=(...o)=>{r._d&&Ks(-1);const s=Us(n);let i;try{i=e(...o)}finally{Us(s),r._d&&Ks(1)}return i};return r._n=!0,r._c=!0,r._d=!0,r}function He(e,n){if(hn===null)return e;const t=xi(hn),r=e.dirs||(e.dirs=[]);for(let o=0;o<n.length;o++){let[s,i,a,l=Ze]=n[o];s&&(Ae(s)&&(s={mounted:s,updated:s}),s.deep&&yt(i),r.push({dir:s,instance:t,value:i,oldValue:void 0,arg:a,modifiers:l}))}return e}function Yt(e,n,t,r){const o=e.dirs,s=n&&n.dirs;for(let i=0;i<o.length;i++){const a=o[i];s&&(a.oldValue=s[i].value);let l=a.dir[r];l&&(It(),at(l,t,8,[e.el,a,e,n]),Pt())}}function lt(e,n){if(Cn){let t=Cn.provides;const r=Cn.parent&&Cn.parent.provides;r===t&&(t=Cn.provides=Object.create(r)),t[e]=n}}function Tn(e,n,t=!1){const r=Xt();if(r||$r){let o=$r?$r._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(o&&e in o)return o[e];if(arguments.length>1)return t&&Ae(n)?n.call(r&&r.proxy):n}}const Z0=Symbol.for("v-scx"),J0=()=>Tn(Z0);function Q0(e,n){return Cl(e,null,n)}function Fe(e,n,t){return Cl(e,n,t)}function Cl(e,n,t=Ze){const{immediate:r,deep:o,flush:s,once:i}=t,a=vn({},t),l=n&&r||!n&&s!=="post";let u;if(ko){if(s==="sync"){const p=J0();u=p.__watcherHandles||(p.__watcherHandles=[])}else if(!l){const p=()=>{};return p.stop=rt,p.resume=rt,p.pause=rt,p}}const d=Cn;a.call=(p,I,P)=>at(p,d,I,P);let f=!1;s==="post"?a.scheduler=p=>{bn(p,d&&d.suspense)}:s!=="sync"&&(f=!0,a.scheduler=(p,I)=>{I?p():yl(p)}),a.augmentJob=p=>{n&&(p.flags|=4),f&&(p.flags|=2,d&&(p.id=d.uid,p.i=d))};const h=X0(e,n,a);return ko&&(u?u.push(h):l&&h()),h}function eh(e,n,t){const r=this.proxy,o=rn(e)?e.includes(".")?Md(r,e):()=>r[e]:e.bind(r,r);let s;Ae(n)?s=n:(s=n.handler,t=n);const i=Yo(this),a=Cl(o,s.bind(r),t);return i(),a}function Md(e,n){const t=n.split(".");return()=>{let r=e;for(let o=0;o<t.length&&r;o++)r=r[t[o]];return r}}const qt=new WeakMap,kd=Symbol("_vte"),nh=e=>e.__isTeleport,Qt=e=>e&&(e.disabled||e.disabled===""),th=e=>e&&(e.defer||e.defer===""),ou=e=>typeof SVGElement<"u"&&e instanceof SVGElement,su=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,Pa=(e,n)=>{const t=e&&e.to;return rn(t)?n?n(t):null:t},rh={name:"Teleport",__isTeleport:!0,process(e,n,t,r,o,s,i,a,l,u){const{mc:d,pc:f,pbc:h,o:{insert:p,querySelector:I,createText:P,createComment:x}}=u,N=Qt(n.props);let{dynamicChildren:U}=n;const D=(ee,ne,ae)=>{ee.shapeFlag&16&&d(ee.children,ne,ae,o,s,i,a,l)},O=(ee=n)=>{const ne=Qt(ee.props),ae=ee.target=Pa(ee.props,I),re=$a(ae,ee,P,p);ae&&(i!=="svg"&&ou(ae)?i="svg":i!=="mathml"&&su(ae)&&(i="mathml"),o&&o.isCE&&(o.ce._teleportTargets||(o.ce._teleportTargets=new Set)).add(ae),ne||(D(ee,ae,re),so(ee,!1)))},Q=ee=>{const ne=()=>{qt.get(ee)===ne&&(qt.delete(ee),Qt(ee.props)&&(D(ee,t,ee.anchor),so(ee,!0)),O(ee))};qt.set(ee,ne),bn(ne,s)};if(e==null){const ee=n.el=P(""),ne=n.anchor=P("");if(p(ee,t,r),p(ne,t,r),th(n.props)||s&&s.pendingBranch){Q(n);return}N&&(D(n,t,ne),so(n,!0)),O()}else{n.el=e.el;const ee=n.anchor=e.anchor,ne=qt.get(e);if(ne){ne.flags|=8,qt.delete(e),Q(n);return}n.targetStart=e.targetStart;const ae=n.target=e.target,re=n.targetAnchor=e.targetAnchor,X=Qt(e.props),Z=X?t:ae,k=X?ee:re;if(i==="svg"||ou(ae)?i="svg":(i==="mathml"||su(ae))&&(i="mathml"),U?(h(e.dynamicChildren,U,Z,o,s,i,a),Il(e,n,!0)):l||f(e,n,Z,k,o,s,i,a,!1),N)X?n.props&&e.props&&n.props.to!==e.props.to&&(n.props.to=e.props.to):ss(n,t,ee,u,1);else if((n.props&&n.props.to)!==(e.props&&e.props.to)){const G=n.target=Pa(n.props,I);G&&ss(n,G,null,u,0)}else X&&ss(n,ae,re,u,1);so(n,N)}},remove(e,n,t,{um:r,o:{remove:o}},s){const{shapeFlag:i,children:a,anchor:l,targetStart:u,targetAnchor:d,target:f,props:h}=e;let p=s||!Qt(h);const I=qt.get(e);if(I&&(I.flags|=8,qt.delete(e),p=!1),f&&(o(u),o(d)),s&&o(l),i&16)for(let P=0;P<a.length;P++){const x=a[P];r(x,n,t,p,!!x.dynamicChildren)}},move:ss,hydrate:oh};function ss(e,n,t,{o:{insert:r},m:o},s=2){s===0&&r(e.targetAnchor,n,t);const{el:i,anchor:a,shapeFlag:l,children:u,props:d}=e,f=s===2;if(f&&r(i,n,t),(!f||Qt(d))&&l&16)for(let h=0;h<u.length;h++)o(u[h],n,t,2);f&&r(a,n,t)}function oh(e,n,t,r,o,s,{o:{nextSibling:i,parentNode:a,querySelector:l,insert:u,createText:d}},f){function h(x,N){let U=N;for(;U;){if(U&&U.nodeType===8){if(U.data==="teleport start anchor")n.targetStart=U;else if(U.data==="teleport anchor"){n.targetAnchor=U,x._lpa=n.targetAnchor&&i(n.targetAnchor);break}}U=i(U)}}function p(x,N){N.anchor=f(i(x),N,a(x),t,r,o,s)}const I=n.target=Pa(n.props,l),P=Qt(n.props);if(I){const x=I._lpa||I.firstChild;n.shapeFlag&16&&(P?(p(e,n),h(I,x),n.targetAnchor||$a(I,n,d,u,a(e)===I?e:null)):(n.anchor=i(e),h(I,x),n.targetAnchor||$a(I,n,d,u),f(x&&i(x),n,I,t,r,o,s))),so(n,P)}else P&&n.shapeFlag&16&&(p(e,n),n.targetStart=e,n.targetAnchor=i(e));return n.anchor&&i(n.anchor)}const sh=rh;function so(e,n){const t=e.ctx;if(t&&t.ut){let r,o;for(n?(r=e.el,o=e.anchor):(r=e.targetStart,o=e.targetAnchor);r&&r!==o;)r.nodeType===1&&r.setAttribute("data-v-owner",t.uid),r=r.nextSibling;t.ut()}}function $a(e,n,t,r,o=null){const s=n.targetStart=t(""),i=n.targetAnchor=t("");return s[kd]=i,e&&(r(s,e,o),r(i,e,o)),i}const ih=Symbol("_leaveCb");function Sl(e,n){e.shapeFlag&6&&e.component?(e.transition=n,Sl(e.component.subTree,n)):e.shapeFlag&128?(e.ssContent.transition=n.clone(e.ssContent),e.ssFallback.transition=n.clone(e.ssFallback)):e.transition=n}function Be(e,n){return Ae(e)?vn({name:e.name},n,{setup:e}):e}function Td(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function iu(e,n){let t;return!!((t=Object.getOwnPropertyDescriptor(e,n))&&!t.configurable)}const Hs=new WeakMap;function yo(e,n,t,r,o=!1){if(Te(e)){e.forEach((P,x)=>yo(P,n&&(Te(n)?n[x]:n),t,r,o));return}if(Pr(r)&&!o){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&yo(e,n,t,r.component.subTree);return}const s=r.shapeFlag&4?xi(r.component):r.el,i=o?null:s,{i:a,r:l}=e,u=n&&n.r,d=a.refs===Ze?a.refs={}:a.refs,f=a.setupState,h=Ke(f),p=f===Ze?Jc:P=>iu(d,P)?!1:Ge(h,P),I=(P,x)=>!(x&&iu(d,x));if(u!=null&&u!==l){if(au(n),rn(u))d[u]=null,p(u)&&(f[u]=null);else if(sn(u)){const P=n;I(u,P.k)&&(u.value=null),P.k&&(d[P.k]=null)}}if(Ae(l))Xo(l,a,12,[i,d]);else{const P=rn(l),x=sn(l);if(P||x){const N=()=>{if(e.f){const U=P?p(l)?f[l]:d[l]:I()||!e.k?l.value:d[e.k];if(o)Te(U)&&dl(U,s);else if(Te(U))U.includes(s)||U.push(s);else if(P)d[l]=[s],p(l)&&(f[l]=d[l]);else{const D=[s];I(l,e.k)&&(l.value=D),e.k&&(d[e.k]=D)}}else P?(d[l]=i,p(l)&&(f[l]=i)):x&&(I(l,e.k)&&(l.value=i),e.k&&(d[e.k]=i))};if(i){const U=()=>{N(),Hs.delete(e)};U.id=-1,Hs.set(e,U),bn(U,t)}else au(e),N()}}}function au(e){const n=Hs.get(e);n&&(n.flags|=8,Hs.delete(e))}yi().requestIdleCallback;yi().cancelIdleCallback;const Pr=e=>!!e.type.__asyncLoader,Vd=e=>e.type.__isKeepAlive;function ah(e,n){Nd(e,"a",n)}function lh(e,n){Nd(e,"da",n)}function Nd(e,n,t=Cn){const r=e.__wdc||(e.__wdc=()=>{let o=t;for(;o;){if(o.isDeactivated)return;o=o.parent}return e()});if(wi(n,r,t),t){let o=t.parent;for(;o&&o.parent;)Vd(o.parent.vnode)&&uh(r,n,t,o),o=o.parent}}function uh(e,n,t,r){const o=wi(n,e,r,!0);Ii(()=>{dl(r[n],o)},t)}function wi(e,n,t=Cn,r=!1){if(t){const o=t[e]||(t[e]=[]),s=n.__weh||(n.__weh=(...i)=>{It();const a=Yo(t),l=at(n,t,e,i);return a(),Pt(),l});return r?o.unshift(s):o.push(s),s}}const kt=e=>(n,t=Cn)=>{(!ko||e==="sp")&&wi(e,(...r)=>n(...r),t)},Ad=kt("bm"),Mn=kt("m"),ch=kt("bu"),dh=kt("u"),Wr=kt("bum"),Ii=kt("um"),fh=kt("sp"),ph=kt("rtg"),hh=kt("rtc");function mh(e,n=Cn){wi("ec",e,n)}const Fd="components";function Od(e,n){return Rd(Fd,e,!0,n)||e}const Bd=Symbol.for("v-ndc");function er(e){return rn(e)?Rd(Fd,e,!1)||e:e||Bd}function Rd(e,n,t=!0,r=!1){const o=hn||Cn;if(o){const s=o.type;{const a=Jh(s,!1);if(a&&(a===n||a===Pn(n)||a===_i(Pn(n))))return s}const i=lu(o[e]||s[e],n)||lu(o.appContext[e],n);return!i&&r?s:i}}function lu(e,n){return e&&(e[n]||e[Pn(n)]||e[_i(Pn(n))])}function Me(e,n,t,r){let o;const s=t&&t[r],i=Te(e);if(i||rn(e)){const a=i&&ar(e);let l=!1,u=!1;a&&(l=!kn(e),u=$t(e),e=Si(e)),o=new Array(e.length);for(let d=0,f=e.length;d<f;d++)o[d]=n(l?u?Tr(Kn(e[d])):Kn(e[d]):e[d],d,void 0,s&&s[d])}else if(typeof e=="number"){o=new Array(e);for(let a=0;a<e;a++)o[a]=n(a+1,a,void 0,s&&s[a])}else if(qe(e))if(e[Symbol.iterator])o=Array.from(e,(a,l)=>n(a,l,void 0,s&&s[l]));else{const a=Object.keys(e);o=new Array(a.length);for(let l=0,u=a.length;l<u;l++){const d=a[l];o[l]=n(e[d],d,l,s&&s[l])}}else o=[];return t&&(t[r]=o),o}function tn(e,n,t={},r,o){if(hn.ce||hn.parent&&Pr(hn.parent)&&hn.parent.ce){const u=Object.keys(t).length>0;return n!=="default"&&(t.name=n),b(),Xe(de,null,[Le("slot",t,r&&r())],u?-2:64)}let s=e[n];s&&s._c&&(s._d=!1),b();const i=s&&Ld(s(t)),a=t.key||i&&i.key,l=Xe(de,{key:(a&&!Vn(a)?a:`_${n}`)+(!i&&r?"_fb":"")},i||(r?r():[]),i&&e._===1?64:-2);return l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),s&&s._c&&(s._d=!0),l}function Ld(e){return e.some(n=>Do(n)?!(n.type===xt||n.type===de&&!Ld(n.children)):!0)?e:null}const xa=e=>e?lf(e)?xi(e):xa(e.parent):null,Co=vn(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>xa(e.parent),$root:e=>xa(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Kd(e),$forceUpdate:e=>e.f||(e.f=()=>{yl(e.update)}),$nextTick:e=>e.n||(e.n=mn.bind(e.proxy)),$watch:e=>eh.bind(e)}),qi=(e,n)=>e!==Ze&&!e.__isScriptSetup&&Ge(e,n),vh={get({_:e},n){if(n==="__v_skip")return!0;const{ctx:t,setupState:r,data:o,props:s,accessCache:i,type:a,appContext:l}=e;if(n[0]!=="$"){const h=i[n];if(h!==void 0)switch(h){case 1:return r[n];case 2:return o[n];case 4:return t[n];case 3:return s[n]}else{if(qi(r,n))return i[n]=1,r[n];if(o!==Ze&&Ge(o,n))return i[n]=2,o[n];if(Ge(s,n))return i[n]=3,s[n];if(t!==Ze&&Ge(t,n))return i[n]=4,t[n];Da&&(i[n]=0)}}const u=Co[n];let d,f;if(u)return n==="$attrs"&&yn(e.attrs,"get",""),u(e);if((d=a.__cssModules)&&(d=d[n]))return d;if(t!==Ze&&Ge(t,n))return i[n]=4,t[n];if(f=l.config.globalProperties,Ge(f,n))return f[n]},set({_:e},n,t){const{data:r,setupState:o,ctx:s}=e;return qi(o,n)?(o[n]=t,!0):r!==Ze&&Ge(r,n)?(r[n]=t,!0):Ge(e.props,n)||n[0]==="$"&&n.slice(1)in e?!1:(s[n]=t,!0)},has({_:{data:e,setupState:n,accessCache:t,ctx:r,appContext:o,props:s,type:i}},a){let l;return!!(t[a]||e!==Ze&&a[0]!=="$"&&Ge(e,a)||qi(n,a)||Ge(s,a)||Ge(r,a)||Ge(Co,a)||Ge(o.config.globalProperties,a)||(l=i.__cssModules)&&l[a])},defineProperty(e,n,t){return t.get!=null?e._.accessCache[n]=0:Ge(t,"value")&&this.set(e,n,t.value,null),Reflect.defineProperty(e,n,t)}};function Ud(){return Hd().slots}function bl(){return Hd().attrs}function Hd(e){const n=Xt();return n.setupContext||(n.setupContext=cf(n))}function uu(e){return Te(e)?e.reduce((n,t)=>(n[t]=null,n),{}):e}function _h(e,n){const t={};for(const r in e)n.includes(r)||Object.defineProperty(t,r,{enumerable:!0,get:()=>e[r]});return t}let Da=!0;function gh(e){const n=Kd(e),t=e.proxy,r=e.ctx;Da=!1,n.beforeCreate&&cu(n.beforeCreate,e,"bc");const{data:o,computed:s,methods:i,watch:a,provide:l,inject:u,created:d,beforeMount:f,mounted:h,beforeUpdate:p,updated:I,activated:P,deactivated:x,beforeDestroy:N,beforeUnmount:U,destroyed:D,unmounted:O,render:Q,renderTracked:ee,renderTriggered:ne,errorCaptured:ae,serverPrefetch:re,expose:X,inheritAttrs:Z,components:k,directives:G,filters:v}=n;if(u&&yh(u,r,null),i)for(const z in i){const L=i[z];Ae(L)&&(r[z]=L.bind(t))}if(o){const z=o.call(t,t);qe(z)&&(e.data=ot(z))}if(Da=!0,s)for(const z in s){const L=s[z],W=Ae(L)?L.bind(t,t):Ae(L.get)?L.get.bind(t,t):rt,Y=!Ae(L)&&Ae(L.set)?L.set.bind(t):rt,se=ie({get:W,set:Y});Object.defineProperty(r,z,{enumerable:!0,configurable:!0,get:()=>se.value,set:oe=>se.value=oe})}if(a)for(const z in a)zd(a[z],r,t,z);if(l){const z=Ae(l)?l.call(t):l;Reflect.ownKeys(z).forEach(L=>{lt(L,z[L])})}d&&cu(d,e,"c");function S(z,L){Te(L)?L.forEach(W=>z(W.bind(t))):L&&z(L.bind(t))}if(S(Ad,f),S(Mn,h),S(ch,p),S(dh,I),S(ah,P),S(lh,x),S(mh,ae),S(hh,ee),S(ph,ne),S(Wr,U),S(Ii,O),S(fh,re),Te(X))if(X.length){const z=e.exposed||(e.exposed={});X.forEach(L=>{Object.defineProperty(z,L,{get:()=>t[L],set:W=>t[L]=W,enumerable:!0})})}else e.exposed||(e.exposed={});Q&&e.render===rt&&(e.render=Q),Z!=null&&(e.inheritAttrs=Z),k&&(e.components=k),G&&(e.directives=G),re&&Td(e)}function yh(e,n,t=rt){Te(e)&&(e=Ma(e));for(const r in e){const o=e[r];let s;qe(o)?"default"in o?s=Tn(o.from||r,o.default,!0):s=Tn(o.from||r):s=Tn(o),sn(s)?Object.defineProperty(n,r,{enumerable:!0,configurable:!0,get:()=>s.value,set:i=>s.value=i}):n[r]=s}}function cu(e,n,t){at(Te(e)?e.map(r=>r.bind(n.proxy)):e.bind(n.proxy),n,t)}function zd(e,n,t,r){let o=r.includes(".")?Md(t,r):()=>t[r];if(rn(e)){const s=n[e];Ae(s)&&Fe(o,s)}else if(Ae(e))Fe(o,e.bind(t));else if(qe(e))if(Te(e))e.forEach(s=>zd(s,n,t,r));else{const s=Ae(e.handler)?e.handler.bind(t):n[e.handler];Ae(s)&&Fe(o,s,e)}}function Kd(e){const n=e.type,{mixins:t,extends:r}=n,{mixins:o,optionsCache:s,config:{optionMergeStrategies:i}}=e.appContext,a=s.get(n);let l;return a?l=a:!o.length&&!t&&!r?l=n:(l={},o.length&&o.forEach(u=>zs(l,u,i,!0)),zs(l,n,i)),qe(n)&&s.set(n,l),l}function zs(e,n,t,r=!1){const{mixins:o,extends:s}=n;s&&zs(e,s,t,!0),o&&o.forEach(i=>zs(e,i,t,!0));for(const i in n)if(!(r&&i==="expose")){const a=Ch[i]||t&&t[i];e[i]=a?a(e[i],n[i]):n[i]}return e}const Ch={data:du,props:fu,emits:fu,methods:io,computed:io,beforeCreate:Sn,created:Sn,beforeMount:Sn,mounted:Sn,beforeUpdate:Sn,updated:Sn,beforeDestroy:Sn,beforeUnmount:Sn,destroyed:Sn,unmounted:Sn,activated:Sn,deactivated:Sn,errorCaptured:Sn,serverPrefetch:Sn,components:io,directives:io,watch:bh,provide:du,inject:Sh};function du(e,n){return n?e?function(){return vn(Ae(e)?e.call(this,this):e,Ae(n)?n.call(this,this):n)}:n:e}function Sh(e,n){return io(Ma(e),Ma(n))}function Ma(e){if(Te(e)){const n={};for(let t=0;t<e.length;t++)n[e[t]]=e[t];return n}return e}function Sn(e,n){return e?[...new Set([].concat(e,n))]:n}function io(e,n){return e?vn(Object.create(null),e,n):n}function fu(e,n){return e?Te(e)&&Te(n)?[...new Set([...e,...n])]:vn(Object.create(null),uu(e),uu(n??{})):n}function bh(e,n){if(!e)return n;if(!n)return e;const t=vn(Object.create(null),e);for(const r in n)t[r]=Sn(e[r],n[r]);return t}function Wd(){return{app:null,config:{isNativeTag:Jc,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Eh=0;function wh(e,n){return function(r,o=null){Ae(r)||(r=vn({},r)),o!=null&&!qe(o)&&(o=null);const s=Wd(),i=new WeakSet,a=[];let l=!1;const u=s.app={_uid:Eh++,_component:r,_props:o,_container:null,_context:s,_instance:null,version:n1,get config(){return s.config},set config(d){},use(d,...f){return i.has(d)||(d&&Ae(d.install)?(i.add(d),d.install(u,...f)):Ae(d)&&(i.add(d),d(u,...f))),u},mixin(d){return s.mixins.includes(d)||s.mixins.push(d),u},component(d,f){return f?(s.components[d]=f,u):s.components[d]},directive(d,f){return f?(s.directives[d]=f,u):s.directives[d]},mount(d,f,h){if(!l){const p=u._ceVNode||Le(r,o);return p.appContext=s,h===!0?h="svg":h===!1&&(h=void 0),e(p,d,h),l=!0,u._container=d,d.__vue_app__=u,xi(p.component)}},onUnmount(d){a.push(d)},unmount(){l&&(at(a,u._instance,16),e(null,u._container),delete u._container.__vue_app__)},provide(d,f){return s.provides[d]=f,u},runWithContext(d){const f=$r;$r=u;try{return d()}finally{$r=f}}};return u}}let $r=null;const Ih=(e,n)=>n==="modelValue"||n==="model-value"?e.modelModifiers:e[`${n}Modifiers`]||e[`${Pn(n)}Modifiers`]||e[`${Gt(n)}Modifiers`];function Ph(e,n,...t){if(e.isUnmounted)return;const r=e.vnode.props||Ze;let o=t;const s=n.startsWith("update:"),i=s&&Ih(r,n.slice(7));i&&(i.trim&&(o=t.map(d=>rn(d)?d.trim():d)),i.number&&(o=t.map(gi)));let a,l=r[a=Ki(n)]||r[a=Ki(Pn(n))];!l&&s&&(l=r[a=Ki(Gt(n))]),l&&at(l,e,6,o);const u=r[a+"Once"];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,at(u,e,6,o)}}const $h=new WeakMap;function Gd(e,n,t=!1){const r=t?$h:n.emitsCache,o=r.get(e);if(o!==void 0)return o;const s=e.emits;let i={},a=!1;if(!Ae(e)){const l=u=>{const d=Gd(u,n,!0);d&&(a=!0,vn(i,d))};!t&&n.mixins.length&&n.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!s&&!a?(qe(e)&&r.set(e,null),null):(Te(s)?s.forEach(l=>i[l]=null):vn(i,s),qe(e)&&r.set(e,i),i)}function Pi(e,n){return!e||!pi(n)?!1:(n=n.slice(2).replace(/Once$/,""),Ge(e,n[0].toLowerCase()+n.slice(1))||Ge(e,Gt(n))||Ge(e,n))}function pu(e){const{type:n,vnode:t,proxy:r,withProxy:o,propsOptions:[s],slots:i,attrs:a,emit:l,render:u,renderCache:d,props:f,data:h,setupState:p,ctx:I,inheritAttrs:P}=e,x=Us(e);let N,U;try{if(t.shapeFlag&4){const O=o||r,Q=O;N=Qn(u.call(Q,O,d,f,p,h,I)),U=a}else{const O=n;N=Qn(O.length>1?O(f,{attrs:a,slots:i,emit:l}):O(f,null)),U=n.props?a:xh(a)}}catch(O){So.length=0,Ei(O,e,1),N=Le(xt)}let D=N;if(U&&P!==!1){const O=Object.keys(U),{shapeFlag:Q}=D;O.length&&Q&7&&(s&&O.some(hi)&&(U=Dh(U,s)),D=Nr(D,U,!1,!0))}return t.dirs&&(D=Nr(D,null,!1,!0),D.dirs=D.dirs?D.dirs.concat(t.dirs):t.dirs),t.transition&&Sl(D,t.transition),N=D,Us(x),N}const xh=e=>{let n;for(const t in e)(t==="class"||t==="style"||pi(t))&&((n||(n={}))[t]=e[t]);return n},Dh=(e,n)=>{const t={};for(const r in e)(!hi(r)||!(r.slice(9)in n))&&(t[r]=e[r]);return t};function Mh(e,n,t){const{props:r,children:o,component:s}=e,{props:i,children:a,patchFlag:l}=n,u=s.emitsOptions;if(n.dirs||n.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return r?hu(r,i,u):!!i;if(l&8){const d=n.dynamicProps;for(let f=0;f<d.length;f++){const h=d[f];if(Xd(i,r,h)&&!Pi(u,h))return!0}}}else return(o||a)&&(!a||!a.$stable)?!0:r===i?!1:r?i?hu(r,i,u):!0:!!i;return!1}function hu(e,n,t){const r=Object.keys(n);if(r.length!==Object.keys(e).length)return!0;for(let o=0;o<r.length;o++){const s=r[o];if(Xd(n,e,s)&&!Pi(t,s))return!0}return!1}function Xd(e,n,t){const r=e[t],o=n[t];return t==="style"&&qe(r)&&qe(o)?!Kr(r,o):r!==o}function kh({vnode:e,parent:n,suspense:t},r){for(;n;){const o=n.subTree;if(o.suspense&&o.suspense.activeBranch===e&&(o.suspense.vnode.el=o.el=r,e=o),o===e)(e=n.vnode).el=r,n=n.parent;else break}t&&t.activeBranch===e&&(t.vnode.el=r)}const Yd={},qd=()=>Object.create(Yd),jd=e=>Object.getPrototypeOf(e)===Yd;function Th(e,n,t,r=!1){const o={},s=qd();e.propsDefaults=Object.create(null),Zd(e,n,o,s);for(const i in e.propsOptions[0])i in o||(o[i]=void 0);t?e.props=r?o:F0(o):e.type.props?e.props=o:e.props=s,e.attrs=s}function Vh(e,n,t,r){const{props:o,attrs:s,vnode:{patchFlag:i}}=e,a=Ke(o),[l]=e.propsOptions;let u=!1;if((r||i>0)&&!(i&16)){if(i&8){const d=e.vnode.dynamicProps;for(let f=0;f<d.length;f++){let h=d[f];if(Pi(e.emitsOptions,h))continue;const p=n[h];if(l)if(Ge(s,h))p!==s[h]&&(s[h]=p,u=!0);else{const I=Pn(h);o[I]=ka(l,a,I,p,e,!1)}else p!==s[h]&&(s[h]=p,u=!0)}}}else{Zd(e,n,o,s)&&(u=!0);let d;for(const f in a)(!n||!Ge(n,f)&&((d=Gt(f))===f||!Ge(n,d)))&&(l?t&&(t[f]!==void 0||t[d]!==void 0)&&(o[f]=ka(l,a,f,void 0,e,!0)):delete o[f]);if(s!==a)for(const f in s)(!n||!Ge(n,f))&&(delete s[f],u=!0)}u&&gt(e.attrs,"set","")}function Zd(e,n,t,r){const[o,s]=e.propsOptions;let i=!1,a;if(n)for(let l in n){if(vo(l))continue;const u=n[l];let d;o&&Ge(o,d=Pn(l))?!s||!s.includes(d)?t[d]=u:(a||(a={}))[d]=u:Pi(e.emitsOptions,l)||(!(l in r)||u!==r[l])&&(r[l]=u,i=!0)}if(s){const l=Ke(t),u=a||Ze;for(let d=0;d<s.length;d++){const f=s[d];t[f]=ka(o,l,f,u[f],e,!Ge(u,f))}}return i}function ka(e,n,t,r,o,s){const i=e[t];if(i!=null){const a=Ge(i,"default");if(a&&r===void 0){const l=i.default;if(i.type!==Function&&!i.skipFactory&&Ae(l)){const{propsDefaults:u}=o;if(t in u)r=u[t];else{const d=Yo(o);r=u[t]=l.call(null,n),d()}}else r=l;o.ce&&o.ce._setProp(t,r)}i[0]&&(s&&!a?r=!1:i[1]&&(r===""||r===Gt(t))&&(r=!0))}return r}const Nh=new WeakMap;function Jd(e,n,t=!1){const r=t?Nh:n.propsCache,o=r.get(e);if(o)return o;const s=e.props,i={},a=[];let l=!1;if(!Ae(e)){const d=f=>{l=!0;const[h,p]=Jd(f,n,!0);vn(i,h),p&&a.push(...p)};!t&&n.mixins.length&&n.mixins.forEach(d),e.extends&&d(e.extends),e.mixins&&e.mixins.forEach(d)}if(!s&&!l)return qe(e)&&r.set(e,Er),Er;if(Te(s))for(let d=0;d<s.length;d++){const f=Pn(s[d]);mu(f)&&(i[f]=Ze)}else if(s)for(const d in s){const f=Pn(d);if(mu(f)){const h=s[d],p=i[f]=Te(h)||Ae(h)?{type:h}:vn({},h),I=p.type;let P=!1,x=!0;if(Te(I))for(let N=0;N<I.length;++N){const U=I[N],D=Ae(U)&&U.name;if(D==="Boolean"){P=!0;break}else D==="String"&&(x=!1)}else P=Ae(I)&&I.name==="Boolean";p[0]=P,p[1]=x,(P||Ge(p,"default"))&&a.push(f)}}const u=[i,a];return qe(e)&&r.set(e,u),u}function mu(e){return e[0]!=="$"&&!vo(e)}const El=e=>e==="_"||e==="_ctx"||e==="$stable",wl=e=>Te(e)?e.map(Qn):[Qn(e)],Ah=(e,n,t)=>{if(n._n)return n;const r=Rn((...o)=>wl(n(...o)),t);return r._c=!1,r},Qd=(e,n,t)=>{const r=e._ctx;for(const o in e){if(El(o))continue;const s=e[o];if(Ae(s))n[o]=Ah(o,s,r);else if(s!=null){const i=wl(s);n[o]=()=>i}}},ef=(e,n)=>{const t=wl(n);e.slots.default=()=>t},nf=(e,n,t)=>{for(const r in n)(t||!El(r))&&(e[r]=n[r])},Fh=(e,n,t)=>{const r=e.slots=qd();if(e.vnode.shapeFlag&32){const o=n._;o?(nf(r,n,t),t&&td(r,"_",o,!0)):Qd(n,r)}else n&&ef(e,n)},Oh=(e,n,t)=>{const{vnode:r,slots:o}=e;let s=!0,i=Ze;if(r.shapeFlag&32){const a=n._;a?t&&a===1?s=!1:nf(o,n,t):(s=!n.$stable,Qd(n,o)),i=n}else n&&(ef(e,n),i={default:1});if(s)for(const a in o)!El(a)&&i[a]==null&&delete o[a]},bn=Hh;function Bh(e){return Rh(e)}function Rh(e,n){const t=yi();t.__VUE__=!0;const{insert:r,remove:o,patchProp:s,createElement:i,createText:a,createComment:l,setText:u,setElementText:d,parentNode:f,nextSibling:h,setScopeId:p=rt,insertStaticContent:I}=e,P=($,B,g,y=null,w=null,F=null,_=void 0,C=null,E=!!B.dynamicChildren)=>{if($===B)return;$&&!jr($,B)&&(y=_e($),oe($,w,F,!0),$=null),B.patchFlag===-2&&(E=!1,B.dynamicChildren=null);const{type:m,ref:M,shapeFlag:q}=B;switch(m){case $i:x($,B,g,y);break;case xt:N($,B,g,y);break;case Es:$==null&&U(B,g,y,_);break;case de:k($,B,g,y,w,F,_,C,E);break;default:q&1?Q($,B,g,y,w,F,_,C,E):q&6?G($,B,g,y,w,F,_,C,E):(q&64||q&128)&&m.process($,B,g,y,w,F,_,C,E,De)}M!=null&&w?yo(M,$&&$.ref,F,B||$,!B):M==null&&$&&$.ref!=null&&yo($.ref,null,F,$,!0)},x=($,B,g,y)=>{if($==null)r(B.el=a(B.children),g,y);else{const w=B.el=$.el;B.children!==$.children&&u(w,B.children)}},N=($,B,g,y)=>{$==null?r(B.el=l(B.children||""),g,y):B.el=$.el},U=($,B,g,y)=>{[$.el,$.anchor]=I($.children,B,g,y,$.el,$.anchor)},D=({el:$,anchor:B},g,y)=>{let w;for(;$&&$!==B;)w=h($),r($,g,y),$=w;r(B,g,y)},O=({el:$,anchor:B})=>{let g;for(;$&&$!==B;)g=h($),o($),$=g;o(B)},Q=($,B,g,y,w,F,_,C,E)=>{if(B.type==="svg"?_="svg":B.type==="math"&&(_="mathml"),$==null)ee(B,g,y,w,F,_,C,E);else{const m=$.el&&$.el._isVueCE?$.el:null;try{m&&m._beginPatch(),re($,B,w,F,_,C,E)}finally{m&&m._endPatch()}}},ee=($,B,g,y,w,F,_,C)=>{let E,m;const{props:M,shapeFlag:q,transition:A,dirs:V}=$;if(E=$.el=i($.type,F,M&&M.is,M),q&8?d(E,$.children):q&16&&ae($.children,E,null,y,w,ji($,F),_,C),V&&Yt($,null,y,"created"),ne(E,$,$.scopeId,_,y),M){for(const ce in M)ce!=="value"&&!vo(ce)&&s(E,ce,null,M[ce],F,y);"value"in M&&s(E,"value",null,M.value,F),(m=M.onVnodeBeforeMount)&&Yn(m,y,$)}V&&Yt($,null,y,"beforeMount");const H=Lh(w,A);H&&A.beforeEnter(E),r(E,B,g),((m=M&&M.onVnodeMounted)||H||V)&&bn(()=>{try{m&&Yn(m,y,$),H&&A.enter(E),V&&Yt($,null,y,"mounted")}finally{}},w)},ne=($,B,g,y,w)=>{if(g&&p($,g),y)for(let F=0;F<y.length;F++)p($,y[F]);if(w){let F=w.subTree;if(B===F||of(F.type)&&(F.ssContent===B||F.ssFallback===B)){const _=w.vnode;ne($,_,_.scopeId,_.slotScopeIds,w.parent)}}},ae=($,B,g,y,w,F,_,C,E=0)=>{for(let m=E;m<$.length;m++){const M=$[m]=C?_t($[m]):Qn($[m]);P(null,M,B,g,y,w,F,_,C)}},re=($,B,g,y,w,F,_)=>{const C=B.el=$.el;let{patchFlag:E,dynamicChildren:m,dirs:M}=B;E|=$.patchFlag&16;const q=$.props||Ze,A=B.props||Ze;let V;if(g&&jt(g,!1),(V=A.onVnodeBeforeUpdate)&&Yn(V,g,B,$),M&&Yt(B,$,g,"beforeUpdate"),g&&jt(g,!0),(q.innerHTML&&A.innerHTML==null||q.textContent&&A.textContent==null)&&d(C,""),m?X($.dynamicChildren,m,C,g,y,ji(B,w),F):_||L($,B,C,null,g,y,ji(B,w),F,!1),E>0){if(E&16)Z(C,q,A,g,w);else if(E&2&&q.class!==A.class&&s(C,"class",null,A.class,w),E&4&&s(C,"style",q.style,A.style,w),E&8){const H=B.dynamicProps;for(let ce=0;ce<H.length;ce++){const ye=H[ce],he=q[ye],we=A[ye];(we!==he||ye==="value")&&s(C,ye,he,we,w,g)}}E&1&&$.children!==B.children&&d(C,B.children)}else!_&&m==null&&Z(C,q,A,g,w);((V=A.onVnodeUpdated)||M)&&bn(()=>{V&&Yn(V,g,B,$),M&&Yt(B,$,g,"updated")},y)},X=($,B,g,y,w,F,_)=>{for(let C=0;C<B.length;C++){const E=$[C],m=B[C],M=E.el&&(E.type===de||!jr(E,m)||E.shapeFlag&198)?f(E.el):g;P(E,m,M,null,y,w,F,_,!0)}},Z=($,B,g,y,w)=>{if(B!==g){if(B!==Ze)for(const F in B)!vo(F)&&!(F in g)&&s($,F,B[F],null,w,y);for(const F in g){if(vo(F))continue;const _=g[F],C=B[F];_!==C&&F!=="value"&&s($,F,C,_,w,y)}"value"in g&&s($,"value",B.value,g.value,w)}},k=($,B,g,y,w,F,_,C,E)=>{const m=B.el=$?$.el:a(""),M=B.anchor=$?$.anchor:a("");let{patchFlag:q,dynamicChildren:A,slotScopeIds:V}=B;V&&(C=C?C.concat(V):V),$==null?(r(m,g,y),r(M,g,y),ae(B.children||[],g,M,w,F,_,C,E)):q>0&&q&64&&A&&$.dynamicChildren&&$.dynamicChildren.length===A.length?(X($.dynamicChildren,A,g,w,F,_,C),(B.key!=null||w&&B===w.subTree)&&Il($,B,!0)):L($,B,g,M,w,F,_,C,E)},G=($,B,g,y,w,F,_,C,E)=>{B.slotScopeIds=C,$==null?B.shapeFlag&512?w.ctx.activate(B,g,y,_,E):v(B,g,y,w,F,_,E):K($,B,E)},v=($,B,g,y,w,F,_)=>{const C=$.component=Yh($,y,w);if(Vd($)&&(C.ctx.renderer=De),qh(C,!1,_),C.asyncDep){if(w&&w.registerDep(C,S,_),!$.el){const E=C.subTree=Le(xt);N(null,E,B,g),$.placeholder=E.el}}else S(C,$,B,g,w,F,_)},K=($,B,g)=>{const y=B.component=$.component;if(Mh($,B,g))if(y.asyncDep&&!y.asyncResolved){z(y,B,g);return}else y.next=B,y.update();else B.el=$.el,y.vnode=B},S=($,B,g,y,w,F,_)=>{const C=()=>{if($.isMounted){let{next:q,bu:A,u:V,parent:H,vnode:ce}=$;{const ze=tf($);if(ze){q&&(q.el=ce.el,z($,q,_)),ze.asyncDep.then(()=>{bn(()=>{$.isUnmounted||m()},w)});return}}let ye=q,he;jt($,!1),q?(q.el=ce.el,z($,q,_)):q=ce,A&&Ss(A),(he=q.props&&q.props.onVnodeBeforeUpdate)&&Yn(he,H,q,ce),jt($,!0);const we=pu($),Re=$.subTree;$.subTree=we,P(Re,we,f(Re.el),_e(Re),$,w,F),q.el=we.el,ye===null&&kh($,we.el),V&&bn(V,w),(he=q.props&&q.props.onVnodeUpdated)&&bn(()=>Yn(he,H,q,ce),w)}else{let q;const{el:A,props:V}=B,{bm:H,m:ce,parent:ye,root:he,type:we}=$,Re=Pr(B);jt($,!1),H&&Ss(H),!Re&&(q=V&&V.onVnodeBeforeMount)&&Yn(q,ye,B),jt($,!0);{he.ce&&he.ce._hasShadowRoot()&&he.ce._injectChildStyle(we,$.parent?$.parent.type:void 0);const ze=$.subTree=pu($);P(null,ze,g,y,$,w,F),B.el=ze.el}if(ce&&bn(ce,w),!Re&&(q=V&&V.onVnodeMounted)){const ze=B;bn(()=>Yn(q,ye,ze),w)}(B.shapeFlag&256||ye&&Pr(ye.vnode)&&ye.vnode.shapeFlag&256)&&$.a&&bn($.a,w),$.isMounted=!0,B=g=y=null}};$.scope.on();const E=$.effect=new ld(C);$.scope.off();const m=$.update=E.run.bind(E),M=$.job=E.runIfDirty.bind(E);M.i=$,M.id=$.uid,E.scheduler=()=>yl(M),jt($,!0),m()},z=($,B,g)=>{B.component=$;const y=$.vnode.props;$.vnode=B,$.next=null,Vh($,B.props,y,g),Oh($,B.children,g),It(),ru($),Pt()},L=($,B,g,y,w,F,_,C,E=!1)=>{const m=$&&$.children,M=$?$.shapeFlag:0,q=B.children,{patchFlag:A,shapeFlag:V}=B;if(A>0){if(A&128){Y(m,q,g,y,w,F,_,C,E);return}else if(A&256){W(m,q,g,y,w,F,_,C,E);return}}V&8?(M&16&&pe(m,w,F),q!==m&&d(g,q)):M&16?V&16?Y(m,q,g,y,w,F,_,C,E):pe(m,w,F,!0):(M&8&&d(g,""),V&16&&ae(q,g,y,w,F,_,C,E))},W=($,B,g,y,w,F,_,C,E)=>{$=$||Er,B=B||Er;const m=$.length,M=B.length,q=Math.min(m,M);let A;for(A=0;A<q;A++){const V=B[A]=E?_t(B[A]):Qn(B[A]);P($[A],V,g,null,w,F,_,C,E)}m>M?pe($,w,F,!0,!1,q):ae(B,g,y,w,F,_,C,E,q)},Y=($,B,g,y,w,F,_,C,E)=>{let m=0;const M=B.length;let q=$.length-1,A=M-1;for(;m<=q&&m<=A;){const V=$[m],H=B[m]=E?_t(B[m]):Qn(B[m]);if(jr(V,H))P(V,H,g,null,w,F,_,C,E);else break;m++}for(;m<=q&&m<=A;){const V=$[q],H=B[A]=E?_t(B[A]):Qn(B[A]);if(jr(V,H))P(V,H,g,null,w,F,_,C,E);else break;q--,A--}if(m>q){if(m<=A){const V=A+1,H=V<M?B[V].el:y;for(;m<=A;)P(null,B[m]=E?_t(B[m]):Qn(B[m]),g,H,w,F,_,C,E),m++}}else if(m>A)for(;m<=q;)oe($[m],w,F,!0),m++;else{const V=m,H=m,ce=new Map;for(m=H;m<=A;m++){const nn=B[m]=E?_t(B[m]):Qn(B[m]);nn.key!=null&&ce.set(nn.key,m)}let ye,he=0;const we=A-H+1;let Re=!1,ze=0;const je=new Array(we);for(m=0;m<we;m++)je[m]=0;for(m=V;m<=q;m++){const nn=$[m];if(he>=we){oe(nn,w,F,!0);continue}let on;if(nn.key!=null)on=ce.get(nn.key);else for(ye=H;ye<=A;ye++)if(je[ye-H]===0&&jr(nn,B[ye])){on=ye;break}on===void 0?oe(nn,w,F,!0):(je[on-H]=m+1,on>=ze?ze=on:Re=!0,P(nn,B[on],g,null,w,F,_,C,E),he++)}const _n=Re?Uh(je):Er;for(ye=_n.length-1,m=we-1;m>=0;m--){const nn=H+m,on=B[nn],es=B[nn+1],vr=nn+1<M?es.el||rf(es):y;je[m]===0?P(null,on,g,vr,w,F,_,C,E):Re&&(ye<0||m!==_n[ye]?se(on,g,vr,2):ye--)}}},se=($,B,g,y,w=null)=>{const{el:F,type:_,transition:C,children:E,shapeFlag:m}=$;if(m&6){se($.component.subTree,B,g,y);return}if(m&128){$.suspense.move(B,g,y);return}if(m&64){_.move($,B,g,De);return}if(_===de){r(F,B,g);for(let q=0;q<E.length;q++)se(E[q],B,g,y);r($.anchor,B,g);return}if(_===Es){D($,B,g);return}if(y!==2&&m&1&&C)if(y===0)C.beforeEnter(F),r(F,B,g),bn(()=>C.enter(F),w);else{const{leave:q,delayLeave:A,afterLeave:V}=C,H=()=>{$.ctx.isUnmounted?o(F):r(F,B,g)},ce=()=>{F._isLeaving&&F[ih](!0),q(F,()=>{H(),V&&V()})};A?A(F,H,ce):ce()}else r(F,B,g)},oe=($,B,g,y=!1,w=!1)=>{const{type:F,props:_,ref:C,children:E,dynamicChildren:m,shapeFlag:M,patchFlag:q,dirs:A,cacheIndex:V,memo:H}=$;if(q===-2&&(w=!1),C!=null&&(It(),yo(C,null,g,$,!0),Pt()),V!=null&&(B.renderCache[V]=void 0),M&256){B.ctx.deactivate($);return}const ce=M&1&&A,ye=!Pr($);let he;if(ye&&(he=_&&_.onVnodeBeforeUnmount)&&Yn(he,B,$),M&6)ue($.component,g,y);else{if(M&128){$.suspense.unmount(g,y);return}ce&&Yt($,null,B,"beforeUnmount"),M&64?$.type.remove($,B,g,De,y):m&&!m.hasOnce&&(F!==de||q>0&&q&64)?pe(m,B,g,!1,!0):(F===de&&q&384||!w&&M&16)&&pe(E,B,g),y&&me($)}const we=H!=null&&V==null;(ye&&(he=_&&_.onVnodeUnmounted)||ce||we)&&bn(()=>{he&&Yn(he,B,$),ce&&Yt($,null,B,"unmounted"),we&&($.el=null)},g)},me=$=>{const{type:B,el:g,anchor:y,transition:w}=$;if(B===de){be(g,y);return}if(B===Es){O($);return}const F=()=>{o(g),w&&!w.persisted&&w.afterLeave&&w.afterLeave()};if($.shapeFlag&1&&w&&!w.persisted){const{leave:_,delayLeave:C}=w,E=()=>_(g,F);C?C($.el,F,E):E()}else F()},be=($,B)=>{let g;for(;$!==B;)g=h($),o($),$=g;o(B)},ue=($,B,g)=>{const{bum:y,scope:w,job:F,subTree:_,um:C,m:E,a:m}=$;vu(E),vu(m),y&&Ss(y),w.stop(),F&&(F.flags|=8,oe(_,$,B,g)),C&&bn(C,B),bn(()=>{$.isUnmounted=!0},B)},pe=($,B,g,y=!1,w=!1,F=0)=>{for(let _=F;_<$.length;_++)oe($[_],B,g,y,w)},_e=$=>{if($.shapeFlag&6)return _e($.component.subTree);if($.shapeFlag&128)return $.suspense.next();const B=h($.anchor||$.el),g=B&&B[kd];return g?h(g):B};let ke=!1;const Ne=($,B,g)=>{let y;$==null?B._vnode&&(oe(B._vnode,null,null,!0),y=B._vnode.component):P(B._vnode||null,$,B,null,null,null,g),B._vnode=$,ke||(ke=!0,ru(y),$d(),ke=!1)},De={p:P,um:oe,m:se,r:me,mt:v,mc:ae,pc:L,pbc:X,n:_e,o:e};return{render:Ne,hydrate:void 0,createApp:wh(Ne)}}function ji({type:e,props:n},t){return t==="svg"&&e==="foreignObject"||t==="mathml"&&e==="annotation-xml"&&n&&n.encoding&&n.encoding.includes("html")?void 0:t}function jt({effect:e,job:n},t){t?(e.flags|=32,n.flags|=4):(e.flags&=-33,n.flags&=-5)}function Lh(e,n){return(!e||e&&!e.pendingBranch)&&n&&!n.persisted}function Il(e,n,t=!1){const r=e.children,o=n.children;if(Te(r)&&Te(o))for(let s=0;s<r.length;s++){const i=r[s];let a=o[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=o[s]=_t(o[s]),a.el=i.el),!t&&a.patchFlag!==-2&&Il(i,a)),a.type===$i&&(a.patchFlag===-1&&(a=o[s]=_t(a)),a.el=i.el),a.type===xt&&!a.el&&(a.el=i.el)}}function Uh(e){const n=e.slice(),t=[0];let r,o,s,i,a;const l=e.length;for(r=0;r<l;r++){const u=e[r];if(u!==0){if(o=t[t.length-1],e[o]<u){n[r]=o,t.push(r);continue}for(s=0,i=t.length-1;s<i;)a=s+i>>1,e[t[a]]<u?s=a+1:i=a;u<e[t[s]]&&(s>0&&(n[r]=t[s-1]),t[s]=r)}}for(s=t.length,i=t[s-1];s-- >0;)t[s]=i,i=n[i];return t}function tf(e){const n=e.subTree.component;if(n)return n.asyncDep&&!n.asyncResolved?n:tf(n)}function vu(e){if(e)for(let n=0;n<e.length;n++)e[n].flags|=8}function rf(e){if(e.placeholder)return e.placeholder;const n=e.component;return n?rf(n.subTree):null}const of=e=>e.__isSuspense;function Hh(e,n){n&&n.pendingBranch?Te(e)?n.effects.push(...e):n.effects.push(e):j0(e)}const de=Symbol.for("v-fgt"),$i=Symbol.for("v-txt"),xt=Symbol.for("v-cmt"),Es=Symbol.for("v-stc"),So=[];let In=null;function b(e=!1){So.push(In=e?null:[])}function zh(){So.pop(),In=So[So.length-1]||null}let Vr=1;function Ks(e,n=!1){Vr+=e,e<0&&In&&n&&(In.hasOnce=!0)}function sf(e){return e.dynamicChildren=Vr>0?In||Er:null,zh(),Vr>0&&In&&In.push(e),e}function T(e,n,t,r,o,s){return sf(c(e,n,t,r,o,s,!0))}function Xe(e,n,t,r,o){return sf(Le(e,n,t,r,o,!0))}function Do(e){return e?e.__v_isVNode===!0:!1}function jr(e,n){return e.type===n.type&&e.key===n.key}const af=({key:e})=>e??null,ws=({ref:e,ref_key:n,ref_for:t})=>(typeof e=="number"&&(e=""+e),e!=null?rn(e)||sn(e)||Ae(e)?{i:hn,r:e,k:n,f:!!t}:e:null);function c(e,n=null,t=null,r=0,o=null,s=e===de?0:1,i=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:n,key:n&&af(n),ref:n&&ws(n),scopeId:Dd,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:r,dynamicProps:o,dynamicChildren:null,appContext:null,ctx:hn};return a?($l(l,t),s&128&&e.normalize(l)):t&&(l.shapeFlag|=rn(t)?8:16),Vr>0&&!i&&In&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&In.push(l),l}const Le=Kh;function Kh(e,n=null,t=null,r=0,o=null,s=!1){if((!e||e===Bd)&&(e=xt),Do(e)){const a=Nr(e,n,!0);return t&&$l(a,t),Vr>0&&!s&&In&&(a.shapeFlag&6?In[In.indexOf(e)]=a:In.push(a)),a.patchFlag=-2,a}if(Qh(e)&&(e=e.__vccOpts),n){n=Wh(n);let{class:a,style:l}=n;a&&!rn(a)&&(n.class=fe(a)),qe(l)&&(bi(l)&&!Te(l)&&(l=vn({},l)),n.style=Ve(l))}const i=rn(e)?1:of(e)?128:nh(e)?64:qe(e)?4:Ae(e)?2:0;return c(e,n,t,r,o,i,s,!0)}function Wh(e){return e?bi(e)||jd(e)?vn({},e):e:null}function Nr(e,n,t=!1,r=!1){const{props:o,ref:s,patchFlag:i,children:a,transition:l}=e,u=n?Mo(o||{},n):o,d={__v_isVNode:!0,__v_skip:!0,type:e.type,props:u,key:u&&af(u),ref:n&&n.ref?t&&s?Te(s)?s.concat(ws(n)):[s,ws(n)]:ws(n):s,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:n&&e.type!==de?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Nr(e.ssContent),ssFallback:e.ssFallback&&Nr(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&r&&Sl(d,l.clone(d)),d}function Pe(e=" ",n=0){return Le($i,null,e,n)}function Pl(e,n){const t=Le(Es,null,e);return t.staticCount=n,t}function Ce(e="",n=!1){return n?(b(),Xe(xt,null,e)):Le(xt,null,e)}function Qn(e){return e==null||typeof e=="boolean"?Le(xt):Te(e)?Le(de,null,e.slice()):Do(e)?_t(e):Le($i,null,String(e))}function _t(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Nr(e)}function $l(e,n){let t=0;const{shapeFlag:r}=e;if(n==null)n=null;else if(Te(n))t=16;else if(typeof n=="object")if(r&65){const o=n.default;o&&(o._c&&(o._d=!1),$l(e,o()),o._c&&(o._d=!0));return}else{t=32;const o=n._;!o&&!jd(n)?n._ctx=hn:o===3&&hn&&(hn.slots._===1?n._=1:(n._=2,e.patchFlag|=1024))}else Ae(n)?(n={default:n,_ctx:hn},t=32):(n=String(n),r&64?(t=16,n=[Pe(n)]):t=8);e.children=n,e.shapeFlag|=t}function Mo(...e){const n={};for(let t=0;t<e.length;t++){const r=e[t];for(const o in r)if(o==="class")n.class!==r.class&&(n.class=fe([n.class,r.class]));else if(o==="style")n.style=Ve([n.style,r.style]);else if(pi(o)){const s=n[o],i=r[o];i&&s!==i&&!(Te(s)&&s.includes(i))?n[o]=s?[].concat(s,i):i:i==null&&s==null&&!hi(o)&&(n[o]=i)}else o!==""&&(n[o]=r[o])}return n}function Yn(e,n,t,r=null){at(e,n,7,[t,r])}const Gh=Wd();let Xh=0;function Yh(e,n,t){const r=e.type,o=(n?n.appContext:e.appContext)||Gh,s={uid:Xh++,vnode:e,type:r,parent:n,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new id(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(o.provides),ids:n?n.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Jd(r,o),emitsOptions:Gd(r,o),emit:null,emitted:null,propsDefaults:Ze,inheritAttrs:r.inheritAttrs,ctx:Ze,data:Ze,props:Ze,attrs:Ze,slots:Ze,refs:Ze,setupState:Ze,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=n?n.root:s,s.emit=Ph.bind(null,s),e.ce&&e.ce(s),s}let Cn=null;const Xt=()=>Cn||hn;let Ws,Ta;{const e=yi(),n=(t,r)=>{let o;return(o=e[t])||(o=e[t]=[]),o.push(r),s=>{o.length>1?o.forEach(i=>i(s)):o[0](s)}};Ws=n("__VUE_INSTANCE_SETTERS__",t=>Cn=t),Ta=n("__VUE_SSR_SETTERS__",t=>ko=t)}const Yo=e=>{const n=Cn;return Ws(e),e.scope.on(),()=>{e.scope.off(),Ws(n)}},_u=()=>{Cn&&Cn.scope.off(),Ws(null)};function lf(e){return e.vnode.shapeFlag&4}let ko=!1;function qh(e,n=!1,t=!1){n&&Ta(n);const{props:r,children:o}=e.vnode,s=lf(e);Th(e,r,s,n),Fh(e,o,t||n);const i=s?jh(e,n):void 0;return n&&Ta(!1),i}function jh(e,n){const t=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,vh);const{setup:r}=t;if(r){It();const o=e.setupContext=r.length>1?cf(e):null,s=Yo(e),i=Xo(r,e,0,[e.props,o]),a=Qc(i);if(Pt(),s(),(a||e.sp)&&!Pr(e)&&Td(e),a){if(i.then(_u,_u),n)return i.then(l=>{gu(e,l)}).catch(l=>{Ei(l,e,0)});e.asyncDep=i}else gu(e,i)}else uf(e)}function gu(e,n,t){Ae(n)?e.type.__ssrInlineRender?e.ssrRender=n:e.render=n:qe(n)&&(e.setupState=Ed(n)),uf(e)}function uf(e,n,t){const r=e.type;e.render||(e.render=r.render||rt);{const o=Yo(e);It();try{gh(e)}finally{Pt(),o()}}}const Zh={get(e,n){return yn(e,"get",""),e[n]}};function cf(e){const n=t=>{e.exposed=t||{}};return{attrs:new Proxy(e.attrs,Zh),slots:e.slots,emit:e.emit,expose:n}}function xi(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Ed(Et(e.exposed)),{get(n,t){if(t in n)return n[t];if(t in Co)return Co[t](e)},has(n,t){return t in n||t in Co}})):e.proxy}function Jh(e,n=!0){return Ae(e)?e.displayName||e.name:e.name||n&&e.__name}function Qh(e){return Ae(e)&&"__vccOpts"in e}const ie=(e,n)=>W0(e,n,ko);function Ye(e,n,t){try{Ks(-1);const r=arguments.length;return r===2?qe(n)&&!Te(n)?Do(n)?Le(e,null,[n]):Le(e,n):Le(e,null,n):(r>3?t=Array.prototype.slice.call(arguments,2):r===3&&Do(t)&&(t=[t]),Le(e,n,t))}finally{Ks(1)}}function e1(e,n){const t=e.memo;if(t.length!=n.length)return!1;for(let r=0;r<t.length;r++)if(Bn(t[r],n[r]))return!1;return Vr>0&&In&&In.push(e),!0}const n1="3.5.32";/**
* @vue/runtime-dom v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Va;const yu=typeof window<"u"&&window.trustedTypes;if(yu)try{Va=yu.createPolicy("vue",{createHTML:e=>e})}catch{}const df=Va?e=>Va.createHTML(e):e=>e,t1="http://www.w3.org/2000/svg",r1="http://www.w3.org/1998/Math/MathML",vt=typeof document<"u"?document:null,Cu=vt&&vt.createElement("template"),o1={insert:(e,n,t)=>{n.insertBefore(e,t||null)},remove:e=>{const n=e.parentNode;n&&n.removeChild(e)},createElement:(e,n,t,r)=>{const o=n==="svg"?vt.createElementNS(t1,e):n==="mathml"?vt.createElementNS(r1,e):t?vt.createElement(e,{is:t}):vt.createElement(e);return e==="select"&&r&&r.multiple!=null&&o.setAttribute("multiple",r.multiple),o},createText:e=>vt.createTextNode(e),createComment:e=>vt.createComment(e),setText:(e,n)=>{e.nodeValue=n},setElementText:(e,n)=>{e.textContent=n},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>vt.querySelector(e),setScopeId(e,n){e.setAttribute(n,"")},insertStaticContent(e,n,t,r,o,s){const i=t?t.previousSibling:n.lastChild;if(o&&(o===s||o.nextSibling))for(;n.insertBefore(o.cloneNode(!0),t),!(o===s||!(o=o.nextSibling)););else{Cu.innerHTML=df(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const a=Cu.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}n.insertBefore(a,t)}return[i?i.nextSibling:n.firstChild,t?t.previousSibling:n.lastChild]}},s1=Symbol("_vtc");function i1(e,n,t){const r=e[s1];r&&(n=(n?[n,...r]:[...r]).join(" ")),n==null?e.removeAttribute("class"):t?e.setAttribute("class",n):e.className=n}const Gs=Symbol("_vod"),ff=Symbol("_vsh"),a1={name:"show",beforeMount(e,{value:n},{transition:t}){e[Gs]=e.style.display==="none"?"":e.style.display,t&&n?t.beforeEnter(e):Zr(e,n)},mounted(e,{value:n},{transition:t}){t&&n&&t.enter(e)},updated(e,{value:n,oldValue:t},{transition:r}){!n!=!t&&(r?n?(r.beforeEnter(e),Zr(e,!0),r.enter(e)):r.leave(e,()=>{Zr(e,!1)}):Zr(e,n))},beforeUnmount(e,{value:n}){Zr(e,n)}};function Zr(e,n){e.style.display=n?e[Gs]:"none",e[ff]=!n}const l1=Symbol(""),u1=/(?:^|;)\s*display\s*:/;function c1(e,n,t){const r=e.style,o=rn(t);let s=!1;if(t&&!o){if(n)if(rn(n))for(const i of n.split(";")){const a=i.slice(0,i.indexOf(":")).trim();t[a]==null&&Is(r,a,"")}else for(const i in n)t[i]==null&&Is(r,i,"");for(const i in t)i==="display"&&(s=!0),Is(r,i,t[i])}else if(o){if(n!==t){const i=r[l1];i&&(t+=";"+i),r.cssText=t,s=u1.test(t)}}else n&&e.removeAttribute("style");Gs in e&&(e[Gs]=s?r.display:"",e[ff]&&(r.display="none"))}const Su=/\s*!important$/;function Is(e,n,t){if(Te(t))t.forEach(r=>Is(e,n,r));else if(t==null&&(t=""),n.startsWith("--"))e.setProperty(n,t);else{const r=d1(e,n);Su.test(t)?e.setProperty(Gt(r),t.replace(Su,""),"important"):e[r]=t}}const bu=["Webkit","Moz","ms"],Zi={};function d1(e,n){const t=Zi[n];if(t)return t;let r=Pn(n);if(r!=="filter"&&r in e)return Zi[n]=r;r=_i(r);for(let o=0;o<bu.length;o++){const s=bu[o]+r;if(s in e)return Zi[n]=s}return n}const Eu="http://www.w3.org/1999/xlink";function wu(e,n,t,r,o,s=m0(n)){r&&n.startsWith("xlink:")?t==null?e.removeAttributeNS(Eu,n.slice(6,n.length)):e.setAttributeNS(Eu,n,t):t==null||s&&!rd(t)?e.removeAttribute(n):e.setAttribute(n,s?"":Vn(t)?String(t):t)}function Iu(e,n,t,r,o){if(n==="innerHTML"||n==="textContent"){t!=null&&(e[n]=n==="innerHTML"?df(t):t);return}const s=e.tagName;if(n==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?e.getAttribute("value")||"":e.value,l=t==null?e.type==="checkbox"?"on":"":String(t);(a!==l||!("_value"in e))&&(e.value=l),t==null&&e.removeAttribute(n),e._value=t;return}let i=!1;if(t===""||t==null){const a=typeof e[n];a==="boolean"?t=rd(t):t==null&&a==="string"?(t="",i=!0):a==="number"&&(t=0,i=!0)}try{e[n]=t}catch{}i&&e.removeAttribute(o||n)}function Rt(e,n,t,r){e.addEventListener(n,t,r)}function f1(e,n,t,r){e.removeEventListener(n,t,r)}const Pu=Symbol("_vei");function p1(e,n,t,r,o=null){const s=e[Pu]||(e[Pu]={}),i=s[n];if(r&&i)i.value=r;else{const[a,l]=h1(n);if(r){const u=s[n]=_1(r,o);Rt(e,a,u,l)}else i&&(f1(e,a,i,l),s[n]=void 0)}}const $u=/(?:Once|Passive|Capture)$/;function h1(e){let n;if($u.test(e)){n={};let r;for(;r=e.match($u);)e=e.slice(0,e.length-r[0].length),n[r[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Gt(e.slice(2)),n]}let Ji=0;const m1=Promise.resolve(),v1=()=>Ji||(m1.then(()=>Ji=0),Ji=Date.now());function _1(e,n){const t=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=t.attached)return;at(g1(r,t.value),n,5,[r])};return t.value=e,t.attached=v1(),t}function g1(e,n){if(Te(n)){const t=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{t.call(e),e._stopped=!0},n.map(r=>o=>!o._stopped&&r&&r(o))}else return n}const xu=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,y1=(e,n,t,r,o,s)=>{const i=o==="svg";n==="class"?i1(e,r,i):n==="style"?c1(e,t,r):pi(n)?hi(n)||p1(e,n,t,r,s):(n[0]==="."?(n=n.slice(1),!0):n[0]==="^"?(n=n.slice(1),!1):C1(e,n,r,i))?(Iu(e,n,r),!e.tagName.includes("-")&&(n==="value"||n==="checked"||n==="selected")&&wu(e,n,r,i,s,n!=="value")):e._isVueCE&&(S1(e,n)||e._def.__asyncLoader&&(/[A-Z]/.test(n)||!rn(r)))?Iu(e,Pn(n),r,s,n):(n==="true-value"?e._trueValue=r:n==="false-value"&&(e._falseValue=r),wu(e,n,r,i))};function C1(e,n,t,r){if(r)return!!(n==="innerHTML"||n==="textContent"||n in e&&xu(n)&&Ae(t));if(n==="spellcheck"||n==="draggable"||n==="translate"||n==="autocorrect"||n==="sandbox"&&e.tagName==="IFRAME"||n==="form"||n==="list"&&e.tagName==="INPUT"||n==="type"&&e.tagName==="TEXTAREA")return!1;if(n==="width"||n==="height"){const o=e.tagName;if(o==="IMG"||o==="VIDEO"||o==="CANVAS"||o==="SOURCE")return!1}return xu(n)&&rn(t)?!1:n in e}function S1(e,n){const t=e._def.props;if(!t)return!1;const r=Pn(n);return Array.isArray(t)?t.some(o=>Pn(o)===r):Object.keys(t).some(o=>Pn(o)===r)}const Ar=e=>{const n=e.props["onUpdate:modelValue"]||!1;return Te(n)?t=>Ss(n,t):n};function b1(e){e.target.composing=!0}function Du(e){const n=e.target;n.composing&&(n.composing=!1,n.dispatchEvent(new Event("input")))}const wt=Symbol("_assign");function Mu(e,n,t){return n&&(e=e.trim()),t&&(e=gi(e)),e}const an={created(e,{modifiers:{lazy:n,trim:t,number:r}},o){e[wt]=Ar(o);const s=r||o.props&&o.props.type==="number";Rt(e,n?"change":"input",i=>{i.target.composing||e[wt](Mu(e.value,t,s))}),(t||s)&&Rt(e,"change",()=>{e.value=Mu(e.value,t,s)}),n||(Rt(e,"compositionstart",b1),Rt(e,"compositionend",Du),Rt(e,"change",Du))},mounted(e,{value:n}){e.value=n??""},beforeUpdate(e,{value:n,oldValue:t,modifiers:{lazy:r,trim:o,number:s}},i){if(e[wt]=Ar(i),e.composing)return;const a=(s||e.type==="number")&&!/^0\d/.test(e.value)?gi(e.value):e.value,l=n??"";if(a===l)return;const u=e.getRootNode();(u instanceof Document||u instanceof ShadowRoot)&&u.activeElement===e&&e.type!=="range"&&(r&&n===t||o&&e.value.trim()===l)||(e.value=l)}},Qi={deep:!0,created(e,n,t){e[wt]=Ar(t),Rt(e,"change",()=>{const r=e._modelValue,o=To(e),s=e.checked,i=e[wt];if(Te(r)){const a=fl(r,o),l=a!==-1;if(s&&!l)i(r.concat(o));else if(!s&&l){const u=[...r];u.splice(a,1),i(u)}}else if(zr(r)){const a=new Set(r);s?a.add(o):a.delete(o),i(a)}else i(pf(e,s))})},mounted:ku,beforeUpdate(e,n,t){e[wt]=Ar(t),ku(e,n,t)}};function ku(e,{value:n,oldValue:t},r){e._modelValue=n;let o;if(Te(n))o=fl(n,r.props.value)>-1;else if(zr(n))o=n.has(r.props.value);else{if(n===t)return;o=Kr(n,pf(e,!0))}e.checked!==o&&(e.checked=o)}const qn={deep:!0,created(e,{value:n,modifiers:{number:t}},r){const o=zr(n);Rt(e,"change",()=>{const s=Array.prototype.filter.call(e.options,i=>i.selected).map(i=>t?gi(To(i)):To(i));e[wt](e.multiple?o?new Set(s):s:s[0]),e._assigning=!0,mn(()=>{e._assigning=!1})}),e[wt]=Ar(r)},mounted(e,{value:n}){Tu(e,n)},beforeUpdate(e,n,t){e[wt]=Ar(t)},updated(e,{value:n}){e._assigning||Tu(e,n)}};function Tu(e,n){const t=e.multiple,r=Te(n);if(!(t&&!r&&!zr(n))){for(let o=0,s=e.options.length;o<s;o++){const i=e.options[o],a=To(i);if(t)if(r){const l=typeof a;l==="string"||l==="number"?i.selected=n.some(u=>String(u)===String(a)):i.selected=fl(n,a)>-1}else i.selected=n.has(a);else if(Kr(To(i),n)){e.selectedIndex!==o&&(e.selectedIndex=o);return}}!t&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function To(e){return"_value"in e?e._value:e.value}function pf(e,n){const t=n?"_trueValue":"_falseValue";return t in e?e[t]:n}const E1=["ctrl","shift","alt","meta"],w1={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,n)=>E1.some(t=>e[`${t}Key`]&&!n.includes(t))},en=(e,n)=>{if(!e)return e;const t=e._withMods||(e._withMods={}),r=n.join(".");return t[r]||(t[r]=(o,...s)=>{for(let i=0;i<n.length;i++){const a=w1[n[i]];if(a&&a(o,n))return}return e(o,...s)})},I1={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},P1=(e,n)=>{const t=e._withKeys||(e._withKeys={}),r=n.join(".");return t[r]||(t[r]=o=>{if(!("key"in o))return;const s=Gt(o.key);if(n.some(i=>i===s||I1[i]===s))return e(o)})},$1=vn({patchProp:y1},o1);let Vu;function x1(){return Vu||(Vu=Bh($1))}const D1=(...e)=>{const n=x1().createApp(...e),{mount:t}=n;return n.mount=r=>{const o=k1(r);if(!o)return;const s=n._component;!Ae(s)&&!s.render&&!s.template&&(s.template=o.innerHTML),o.nodeType===1&&(o.textContent="");const i=t(o,!1,M1(o));return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),i},n};function M1(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function k1(e){return rn(e)?document.querySelector(e):e}function Vo(e){return pl()?(bs(e),!0):!1}function Ct(e){return typeof e=="function"?e():le(e)}const T1=typeof window<"u"&&typeof document<"u",V1=e=>typeof e<"u",N1=Object.prototype.toString,A1=e=>N1.call(e)==="[object Object]",F1=()=>{};function O1(e,n){function t(...r){return new Promise((o,s)=>{Promise.resolve(e(()=>n.apply(this,r),{fn:n,thisArg:this,args:r})).then(o).catch(s)})}return t}const hf=e=>e();function B1(e=hf){const n=Ee(!0);function t(){n.value=!1}function r(){n.value=!0}return{isActive:$o(n),pause:t,resume:r,eventFilter:(...s)=>{n.value&&e(...s)}}}function Nu(e,n=!1,t="Timeout"){return new Promise((r,o)=>{setTimeout(n?()=>o(t):r,e)})}function R1(e,n,t={}){const{eventFilter:r=hf,...o}=t;return Fe(e,O1(r,n),o)}function yr(e,n,t={}){const{eventFilter:r,...o}=t,{eventFilter:s,pause:i,resume:a,isActive:l}=B1(r);return{stop:R1(e,n,{...o,eventFilter:s}),pause:i,resume:a,isActive:l}}function L1(e,n={}){if(!sn(e))return U0(e);const t=Array.isArray(e.value)?Array.from({length:e.value.length}):{};for(const r in e.value)t[r]=L0(()=>({get(){return e.value[r]},set(o){var s;if((s=Ct(n.replaceRef))!=null?s:!0)if(Array.isArray(e.value)){const a=[...e.value];a[r]=o,e.value=a}else{const a={...e.value,[r]:o};Object.setPrototypeOf(a,Object.getPrototypeOf(e.value)),e.value=a}else e.value[r]=o}}));return t}function Na(e,n=!1){function t(f,{flush:h="sync",deep:p=!1,timeout:I,throwOnTimeout:P}={}){let x=null;const U=[new Promise(D=>{x=Fe(e,O=>{f(O)!==n&&(x==null||x(),D(O))},{flush:h,deep:p,immediate:!0})})];return I!=null&&U.push(Nu(I,P).then(()=>Ct(e)).finally(()=>x==null?void 0:x())),Promise.race(U)}function r(f,h){if(!sn(f))return t(O=>O===f,h);const{flush:p="sync",deep:I=!1,timeout:P,throwOnTimeout:x}=h??{};let N=null;const D=[new Promise(O=>{N=Fe([e,f],([Q,ee])=>{n!==(Q===ee)&&(N==null||N(),O(Q))},{flush:p,deep:I,immediate:!0})})];return P!=null&&D.push(Nu(P,x).then(()=>Ct(e)).finally(()=>(N==null||N(),Ct(e)))),Promise.race(D)}function o(f){return t(h=>!!h,f)}function s(f){return r(null,f)}function i(f){return r(void 0,f)}function a(f){return t(Number.isNaN,f)}function l(f,h){return t(p=>{const I=Array.from(p);return I.includes(f)||I.includes(Ct(f))},h)}function u(f){return d(1,f)}function d(f=1,h){let p=-1;return t(()=>(p+=1,p>=f),h)}return Array.isArray(Ct(e))?{toMatch:t,toContains:l,changed:u,changedTimes:d,get not(){return Na(e,!n)}}:{toMatch:t,toBe:r,toBeTruthy:o,toBeNull:s,toBeNaN:a,toBeUndefined:i,changed:u,changedTimes:d,get not(){return Na(e,!n)}}}function Aa(e){return Na(e)}function U1(e){var n;const t=Ct(e);return(n=t==null?void 0:t.$el)!=null?n:t}const mf=T1?window:void 0;function vf(...e){let n,t,r,o;if(typeof e[0]=="string"||Array.isArray(e[0])?([t,r,o]=e,n=mf):[n,t,r,o]=e,!n)return F1;Array.isArray(t)||(t=[t]),Array.isArray(r)||(r=[r]);const s=[],i=()=>{s.forEach(d=>d()),s.length=0},a=(d,f,h,p)=>(d.addEventListener(f,h,p),()=>d.removeEventListener(f,h,p)),l=Fe(()=>[U1(n),Ct(o)],([d,f])=>{if(i(),!d)return;const h=A1(f)?{...f}:f;s.push(...t.flatMap(p=>r.map(I=>a(d,p,I,h))))},{immediate:!0,flush:"post"}),u=()=>{l(),i()};return Vo(u),u}function H1(e){return typeof e=="function"?e:typeof e=="string"?n=>n.key===e:Array.isArray(e)?n=>e.includes(n.key):()=>!0}function Au(...e){let n,t,r={};e.length===3?(n=e[0],t=e[1],r=e[2]):e.length===2?typeof e[1]=="object"?(n=!0,t=e[0],r=e[1]):(n=e[0],t=e[1]):(n=!0,t=e[0]);const{target:o=mf,eventName:s="keydown",passive:i=!1,dedupe:a=!1}=r,l=H1(n);return vf(o,s,d=>{d.repeat&&Ct(a)||l(d)&&t(d)},i)}function z1(e){return JSON.parse(JSON.stringify(e))}function ea(e,n,t,r={}){var o,s,i;const{clone:a=!1,passive:l=!1,eventName:u,deep:d=!1,defaultValue:f,shouldEmit:h}=r,p=Xt(),I=t||(p==null?void 0:p.emit)||((o=p==null?void 0:p.$emit)==null?void 0:o.bind(p))||((i=(s=p==null?void 0:p.proxy)==null?void 0:s.$emit)==null?void 0:i.bind(p==null?void 0:p.proxy));let P=u;n||(n="modelValue"),P=P||`update:${n.toString()}`;const x=D=>a?typeof a=="function"?a(D):z1(D):D,N=()=>V1(e[n])?x(e[n]):f,U=D=>{h?h(D)&&I(P,D):I(P,D)};if(l){const D=N(),O=Ee(D);let Q=!1;return Fe(()=>e[n],ee=>{Q||(Q=!0,O.value=x(ee),mn(()=>Q=!1))}),Fe(O,ee=>{!Q&&(ee!==e[n]||d)&&U(ee)},{deep:d}),O}else return ie({get(){return N()},set(D){U(D)}})}var K1={value:()=>{}};function Di(){for(var e=0,n=arguments.length,t={},r;e<n;++e){if(!(r=arguments[e]+"")||r in t||/[\s.]/.test(r))throw new Error("illegal type: "+r);t[r]=[]}return new Ps(t)}function Ps(e){this._=e}function W1(e,n){return e.trim().split(/^|\s+/).map(function(t){var r="",o=t.indexOf(".");if(o>=0&&(r=t.slice(o+1),t=t.slice(0,o)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:r}})}Ps.prototype=Di.prototype={constructor:Ps,on:function(e,n){var t=this._,r=W1(e+"",t),o,s=-1,i=r.length;if(arguments.length<2){for(;++s<i;)if((o=(e=r[s]).type)&&(o=G1(t[o],e.name)))return o;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++s<i;)if(o=(e=r[s]).type)t[o]=Fu(t[o],e.name,n);else if(n==null)for(o in t)t[o]=Fu(t[o],e.name,null);return this},copy:function(){var e={},n=this._;for(var t in n)e[t]=n[t].slice();return new Ps(e)},call:function(e,n){if((o=arguments.length-2)>0)for(var t=new Array(o),r=0,o,s;r<o;++r)t[r]=arguments[r+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],r=0,o=s.length;r<o;++r)s[r].value.apply(n,t)},apply:function(e,n,t){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],o=0,s=r.length;o<s;++o)r[o].value.apply(n,t)}};function G1(e,n){for(var t=0,r=e.length,o;t<r;++t)if((o=e[t]).name===n)return o.value}function Fu(e,n,t){for(var r=0,o=e.length;r<o;++r)if(e[r].name===n){e[r]=K1,e=e.slice(0,r).concat(e.slice(r+1));break}return t!=null&&e.push({name:n,value:t}),e}var Fa="http://www.w3.org/1999/xhtml";const Ou={svg:"http://www.w3.org/2000/svg",xhtml:Fa,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function Mi(e){var n=e+="",t=n.indexOf(":");return t>=0&&(n=e.slice(0,t))!=="xmlns"&&(e=e.slice(t+1)),Ou.hasOwnProperty(n)?{space:Ou[n],local:e}:e}function X1(e){return function(){var n=this.ownerDocument,t=this.namespaceURI;return t===Fa&&n.documentElement.namespaceURI===Fa?n.createElement(e):n.createElementNS(t,e)}}function Y1(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function _f(e){var n=Mi(e);return(n.local?Y1:X1)(n)}function q1(){}function xl(e){return e==null?q1:function(){return this.querySelector(e)}}function j1(e){typeof e!="function"&&(e=xl(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=new Array(i),l,u,d=0;d<i;++d)(l=s[d])&&(u=e.call(l,l.__data__,d,s))&&("__data__"in l&&(u.__data__=l.__data__),a[d]=u);return new Nn(r,this._parents)}function Z1(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function J1(){return[]}function gf(e){return e==null?J1:function(){return this.querySelectorAll(e)}}function Q1(e){return function(){return Z1(e.apply(this,arguments))}}function em(e){typeof e=="function"?e=Q1(e):e=gf(e);for(var n=this._groups,t=n.length,r=[],o=[],s=0;s<t;++s)for(var i=n[s],a=i.length,l,u=0;u<a;++u)(l=i[u])&&(r.push(e.call(l,l.__data__,u,i)),o.push(l));return new Nn(r,o)}function yf(e){return function(){return this.matches(e)}}function Cf(e){return function(n){return n.matches(e)}}var nm=Array.prototype.find;function tm(e){return function(){return nm.call(this.children,e)}}function rm(){return this.firstElementChild}function om(e){return this.select(e==null?rm:tm(typeof e=="function"?e:Cf(e)))}var sm=Array.prototype.filter;function im(){return Array.from(this.children)}function am(e){return function(){return sm.call(this.children,e)}}function lm(e){return this.selectAll(e==null?im:am(typeof e=="function"?e:Cf(e)))}function um(e){typeof e!="function"&&(e=yf(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,u=0;u<i;++u)(l=s[u])&&e.call(l,l.__data__,u,s)&&a.push(l);return new Nn(r,this._parents)}function Sf(e){return new Array(e.length)}function cm(){return new Nn(this._enter||this._groups.map(Sf),this._parents)}function Xs(e,n){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=n}Xs.prototype={constructor:Xs,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,n){return this._parent.insertBefore(e,n)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function dm(e){return function(){return e}}function fm(e,n,t,r,o,s){for(var i=0,a,l=n.length,u=s.length;i<u;++i)(a=n[i])?(a.__data__=s[i],r[i]=a):t[i]=new Xs(e,s[i]);for(;i<l;++i)(a=n[i])&&(o[i]=a)}function pm(e,n,t,r,o,s,i){var a,l,u=new Map,d=n.length,f=s.length,h=new Array(d),p;for(a=0;a<d;++a)(l=n[a])&&(h[a]=p=i.call(l,l.__data__,a,n)+"",u.has(p)?o[a]=l:u.set(p,l));for(a=0;a<f;++a)p=i.call(e,s[a],a,s)+"",(l=u.get(p))?(r[a]=l,l.__data__=s[a],u.delete(p)):t[a]=new Xs(e,s[a]);for(a=0;a<d;++a)(l=n[a])&&u.get(h[a])===l&&(o[a]=l)}function hm(e){return e.__data__}function mm(e,n){if(!arguments.length)return Array.from(this,hm);var t=n?pm:fm,r=this._parents,o=this._groups;typeof e!="function"&&(e=dm(e));for(var s=o.length,i=new Array(s),a=new Array(s),l=new Array(s),u=0;u<s;++u){var d=r[u],f=o[u],h=f.length,p=vm(e.call(d,d&&d.__data__,u,r)),I=p.length,P=a[u]=new Array(I),x=i[u]=new Array(I),N=l[u]=new Array(h);t(d,f,P,x,N,p,n);for(var U=0,D=0,O,Q;U<I;++U)if(O=P[U]){for(U>=D&&(D=U+1);!(Q=x[D])&&++D<I;);O._next=Q||null}}return i=new Nn(i,r),i._enter=a,i._exit=l,i}function vm(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function _m(){return new Nn(this._exit||this._groups.map(Sf),this._parents)}function gm(e,n,t){var r=this.enter(),o=this,s=this.exit();return typeof e=="function"?(r=e(r),r&&(r=r.selection())):r=r.append(e+""),n!=null&&(o=n(o),o&&(o=o.selection())),t==null?s.remove():t(s),r&&o?r.merge(o).order():o}function ym(e){for(var n=e.selection?e.selection():e,t=this._groups,r=n._groups,o=t.length,s=r.length,i=Math.min(o,s),a=new Array(o),l=0;l<i;++l)for(var u=t[l],d=r[l],f=u.length,h=a[l]=new Array(f),p,I=0;I<f;++I)(p=u[I]||d[I])&&(h[I]=p);for(;l<o;++l)a[l]=t[l];return new Nn(a,this._parents)}function Cm(){for(var e=this._groups,n=-1,t=e.length;++n<t;)for(var r=e[n],o=r.length-1,s=r[o],i;--o>=0;)(i=r[o])&&(s&&i.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(i,s),s=i);return this}function Sm(e){e||(e=bm);function n(f,h){return f&&h?e(f.__data__,h.__data__):!f-!h}for(var t=this._groups,r=t.length,o=new Array(r),s=0;s<r;++s){for(var i=t[s],a=i.length,l=o[s]=new Array(a),u,d=0;d<a;++d)(u=i[d])&&(l[d]=u);l.sort(n)}return new Nn(o,this._parents).order()}function bm(e,n){return e<n?-1:e>n?1:e>=n?0:NaN}function Em(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function wm(){return Array.from(this)}function Im(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length;o<s;++o){var i=r[o];if(i)return i}return null}function Pm(){let e=0;for(const n of this)++e;return e}function $m(){return!this.node()}function xm(e){for(var n=this._groups,t=0,r=n.length;t<r;++t)for(var o=n[t],s=0,i=o.length,a;s<i;++s)(a=o[s])&&e.call(a,a.__data__,s,o);return this}function Dm(e){return function(){this.removeAttribute(e)}}function Mm(e){return function(){this.removeAttributeNS(e.space,e.local)}}function km(e,n){return function(){this.setAttribute(e,n)}}function Tm(e,n){return function(){this.setAttributeNS(e.space,e.local,n)}}function Vm(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttribute(e):this.setAttribute(e,t)}}function Nm(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,t)}}function Am(e,n){var t=Mi(e);if(arguments.length<2){var r=this.node();return t.local?r.getAttributeNS(t.space,t.local):r.getAttribute(t)}return this.each((n==null?t.local?Mm:Dm:typeof n=="function"?t.local?Nm:Vm:t.local?Tm:km)(t,n))}function bf(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function Fm(e){return function(){this.style.removeProperty(e)}}function Om(e,n,t){return function(){this.style.setProperty(e,n,t)}}function Bm(e,n,t){return function(){var r=n.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,t)}}function Rm(e,n,t){return arguments.length>1?this.each((n==null?Fm:typeof n=="function"?Bm:Om)(e,n,t??"")):Fr(this.node(),e)}function Fr(e,n){return e.style.getPropertyValue(n)||bf(e).getComputedStyle(e,null).getPropertyValue(n)}function Lm(e){return function(){delete this[e]}}function Um(e,n){return function(){this[e]=n}}function Hm(e,n){return function(){var t=n.apply(this,arguments);t==null?delete this[e]:this[e]=t}}function zm(e,n){return arguments.length>1?this.each((n==null?Lm:typeof n=="function"?Hm:Um)(e,n)):this.node()[e]}function Ef(e){return e.trim().split(/^|\s+/)}function Dl(e){return e.classList||new wf(e)}function wf(e){this._node=e,this._names=Ef(e.getAttribute("class")||"")}wf.prototype={add:function(e){var n=this._names.indexOf(e);n<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var n=this._names.indexOf(e);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function If(e,n){for(var t=Dl(e),r=-1,o=n.length;++r<o;)t.add(n[r])}function Pf(e,n){for(var t=Dl(e),r=-1,o=n.length;++r<o;)t.remove(n[r])}function Km(e){return function(){If(this,e)}}function Wm(e){return function(){Pf(this,e)}}function Gm(e,n){return function(){(n.apply(this,arguments)?If:Pf)(this,e)}}function Xm(e,n){var t=Ef(e+"");if(arguments.length<2){for(var r=Dl(this.node()),o=-1,s=t.length;++o<s;)if(!r.contains(t[o]))return!1;return!0}return this.each((typeof n=="function"?Gm:n?Km:Wm)(t,n))}function Ym(){this.textContent=""}function qm(e){return function(){this.textContent=e}}function jm(e){return function(){var n=e.apply(this,arguments);this.textContent=n??""}}function Zm(e){return arguments.length?this.each(e==null?Ym:(typeof e=="function"?jm:qm)(e)):this.node().textContent}function Jm(){this.innerHTML=""}function Qm(e){return function(){this.innerHTML=e}}function ev(e){return function(){var n=e.apply(this,arguments);this.innerHTML=n??""}}function nv(e){return arguments.length?this.each(e==null?Jm:(typeof e=="function"?ev:Qm)(e)):this.node().innerHTML}function tv(){this.nextSibling&&this.parentNode.appendChild(this)}function rv(){return this.each(tv)}function ov(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function sv(){return this.each(ov)}function iv(e){var n=typeof e=="function"?e:_f(e);return this.select(function(){return this.appendChild(n.apply(this,arguments))})}function av(){return null}function lv(e,n){var t=typeof e=="function"?e:_f(e),r=n==null?av:typeof n=="function"?n:xl(n);return this.select(function(){return this.insertBefore(t.apply(this,arguments),r.apply(this,arguments)||null)})}function uv(){var e=this.parentNode;e&&e.removeChild(this)}function cv(){return this.each(uv)}function dv(){var e=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function fv(){var e=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function pv(e){return this.select(e?fv:dv)}function hv(e){return arguments.length?this.property("__data__",e):this.node().__data__}function mv(e){return function(n){e.call(this,n,this.__data__)}}function vv(e){return e.trim().split(/^|\s+/).map(function(n){var t="",r=n.indexOf(".");return r>=0&&(t=n.slice(r+1),n=n.slice(0,r)),{type:n,name:t}})}function _v(e){return function(){var n=this.__on;if(n){for(var t=0,r=-1,o=n.length,s;t<o;++t)s=n[t],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):n[++r]=s;++r?n.length=r:delete this.__on}}}function gv(e,n,t){return function(){var r=this.__on,o,s=mv(n);if(r){for(var i=0,a=r.length;i<a;++i)if((o=r[i]).type===e.type&&o.name===e.name){this.removeEventListener(o.type,o.listener,o.options),this.addEventListener(o.type,o.listener=s,o.options=t),o.value=n;return}}this.addEventListener(e.type,s,t),o={type:e.type,name:e.name,value:n,listener:s,options:t},r?r.push(o):this.__on=[o]}}function yv(e,n,t){var r=vv(e+""),o,s=r.length,i;if(arguments.length<2){var a=this.node().__on;if(a){for(var l=0,u=a.length,d;l<u;++l)for(o=0,d=a[l];o<s;++o)if((i=r[o]).type===d.type&&i.name===d.name)return d.value}return}for(a=n?gv:_v,o=0;o<s;++o)this.each(a(r[o],n,t));return this}function $f(e,n,t){var r=bf(e),o=r.CustomEvent;typeof o=="function"?o=new o(n,t):(o=r.document.createEvent("Event"),t?(o.initEvent(n,t.bubbles,t.cancelable),o.detail=t.detail):o.initEvent(n,!1,!1)),e.dispatchEvent(o)}function Cv(e,n){return function(){return $f(this,e,n)}}function Sv(e,n){return function(){return $f(this,e,n.apply(this,arguments))}}function bv(e,n){return this.each((typeof n=="function"?Sv:Cv)(e,n))}function*Ev(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length,i;o<s;++o)(i=r[o])&&(yield i)}var xf=[null];function Nn(e,n){this._groups=e,this._parents=n}function qo(){return new Nn([[document.documentElement]],xf)}function wv(){return this}Nn.prototype=qo.prototype={constructor:Nn,select:j1,selectAll:em,selectChild:om,selectChildren:lm,filter:um,data:mm,enter:cm,exit:_m,join:gm,merge:ym,selection:wv,order:Cm,sort:Sm,call:Em,nodes:wm,node:Im,size:Pm,empty:$m,each:xm,attr:Am,style:Rm,property:zm,classed:Xm,text:Zm,html:nv,raise:rv,lower:sv,append:iv,insert:lv,remove:cv,clone:pv,datum:hv,on:yv,dispatch:bv,[Symbol.iterator]:Ev};function Ln(e){return typeof e=="string"?new Nn([[document.querySelector(e)]],[document.documentElement]):new Nn([[e]],xf)}function Iv(e){let n;for(;n=e.sourceEvent;)e=n;return e}function Zn(e,n){if(e=Iv(e),n===void 0&&(n=e.currentTarget),n){var t=n.ownerSVGElement||n;if(t.createSVGPoint){var r=t.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}if(n.getBoundingClientRect){var o=n.getBoundingClientRect();return[e.clientX-o.left-n.clientLeft,e.clientY-o.top-n.clientTop]}}return[e.pageX,e.pageY]}const Pv={passive:!1},No={capture:!0,passive:!1};function na(e){e.stopImmediatePropagation()}function xr(e){e.preventDefault(),e.stopImmediatePropagation()}function Df(e){var n=e.document.documentElement,t=Ln(e).on("dragstart.drag",xr,No);"onselectstart"in n?t.on("selectstart.drag",xr,No):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}function Mf(e,n){var t=e.document.documentElement,r=Ln(e).on("dragstart.drag",null);n&&(r.on("click.drag",xr,No),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in t?r.on("selectstart.drag",null):(t.style.MozUserSelect=t.__noselect,delete t.__noselect)}const is=e=>()=>e;function Oa(e,{sourceEvent:n,subject:t,target:r,identifier:o,active:s,x:i,y:a,dx:l,dy:u,dispatch:d}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},subject:{value:t,enumerable:!0,configurable:!0},target:{value:r,enumerable:!0,configurable:!0},identifier:{value:o,enumerable:!0,configurable:!0},active:{value:s,enumerable:!0,configurable:!0},x:{value:i,enumerable:!0,configurable:!0},y:{value:a,enumerable:!0,configurable:!0},dx:{value:l,enumerable:!0,configurable:!0},dy:{value:u,enumerable:!0,configurable:!0},_:{value:d}})}Oa.prototype.on=function(){var e=this._.on.apply(this._,arguments);return e===this._?this:e};function $v(e){return!e.ctrlKey&&!e.button}function xv(){return this.parentNode}function Dv(e,n){return n??{x:e.x,y:e.y}}function Mv(){return navigator.maxTouchPoints||"ontouchstart"in this}function kv(){var e=$v,n=xv,t=Dv,r=Mv,o={},s=Di("start","drag","end"),i=0,a,l,u,d,f=0;function h(O){O.on("mousedown.drag",p).filter(r).on("touchstart.drag",x).on("touchmove.drag",N,Pv).on("touchend.drag touchcancel.drag",U).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function p(O,Q){if(!(d||!e.call(this,O,Q))){var ee=D(this,n.call(this,O,Q),O,Q,"mouse");ee&&(Ln(O.view).on("mousemove.drag",I,No).on("mouseup.drag",P,No),Df(O.view),na(O),u=!1,a=O.clientX,l=O.clientY,ee("start",O))}}function I(O){if(xr(O),!u){var Q=O.clientX-a,ee=O.clientY-l;u=Q*Q+ee*ee>f}o.mouse("drag",O)}function P(O){Ln(O.view).on("mousemove.drag mouseup.drag",null),Mf(O.view,u),xr(O),o.mouse("end",O)}function x(O,Q){if(e.call(this,O,Q)){var ee=O.changedTouches,ne=n.call(this,O,Q),ae=ee.length,re,X;for(re=0;re<ae;++re)(X=D(this,ne,O,Q,ee[re].identifier,ee[re]))&&(na(O),X("start",O,ee[re]))}}function N(O){var Q=O.changedTouches,ee=Q.length,ne,ae;for(ne=0;ne<ee;++ne)(ae=o[Q[ne].identifier])&&(xr(O),ae("drag",O,Q[ne]))}function U(O){var Q=O.changedTouches,ee=Q.length,ne,ae;for(d&&clearTimeout(d),d=setTimeout(function(){d=null},500),ne=0;ne<ee;++ne)(ae=o[Q[ne].identifier])&&(na(O),ae("end",O,Q[ne]))}function D(O,Q,ee,ne,ae,re){var X=s.copy(),Z=Zn(re||ee,Q),k,G,v;if((v=t.call(O,new Oa("beforestart",{sourceEvent:ee,target:h,identifier:ae,active:i,x:Z[0],y:Z[1],dx:0,dy:0,dispatch:X}),ne))!=null)return k=v.x-Z[0]||0,G=v.y-Z[1]||0,function K(S,z,L){var W=Z,Y;switch(S){case"start":o[ae]=K,Y=i++;break;case"end":delete o[ae],--i;case"drag":Z=Zn(L||z,Q),Y=i;break}X.call(S,O,new Oa(S,{sourceEvent:z,subject:v,target:h,identifier:ae,active:Y,x:Z[0]+k,y:Z[1]+G,dx:Z[0]-W[0],dy:Z[1]-W[1],dispatch:X}),ne)}}return h.filter=function(O){return arguments.length?(e=typeof O=="function"?O:is(!!O),h):e},h.container=function(O){return arguments.length?(n=typeof O=="function"?O:is(O),h):n},h.subject=function(O){return arguments.length?(t=typeof O=="function"?O:is(O),h):t},h.touchable=function(O){return arguments.length?(r=typeof O=="function"?O:is(!!O),h):r},h.on=function(){var O=s.on.apply(s,arguments);return O===s?h:O},h.clickDistance=function(O){return arguments.length?(f=(O=+O)*O,h):Math.sqrt(f)},h}function Ml(e,n,t){e.prototype=n.prototype=t,t.constructor=e}function kf(e,n){var t=Object.create(e.prototype);for(var r in n)t[r]=n[r];return t}function jo(){}var Ao=.7,Ys=1/Ao,Dr="\\s*([+-]?\\d+)\\s*",Fo="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",st="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Tv=/^#([0-9a-f]{3,8})$/,Vv=new RegExp(`^rgb\\(${Dr},${Dr},${Dr}\\)$`),Nv=new RegExp(`^rgb\\(${st},${st},${st}\\)$`),Av=new RegExp(`^rgba\\(${Dr},${Dr},${Dr},${Fo}\\)$`),Fv=new RegExp(`^rgba\\(${st},${st},${st},${Fo}\\)$`),Ov=new RegExp(`^hsl\\(${Fo},${st},${st}\\)$`),Bv=new RegExp(`^hsla\\(${Fo},${st},${st},${Fo}\\)$`),Bu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Ml(jo,dr,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Ru,formatHex:Ru,formatHex8:Rv,formatHsl:Lv,formatRgb:Lu,toString:Lu});function Ru(){return this.rgb().formatHex()}function Rv(){return this.rgb().formatHex8()}function Lv(){return Tf(this).formatHsl()}function Lu(){return this.rgb().formatRgb()}function dr(e){var n,t;return e=(e+"").trim().toLowerCase(),(n=Tv.exec(e))?(t=n[1].length,n=parseInt(n[1],16),t===6?Uu(n):t===3?new xn(n>>8&15|n>>4&240,n>>4&15|n&240,(n&15)<<4|n&15,1):t===8?as(n>>24&255,n>>16&255,n>>8&255,(n&255)/255):t===4?as(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|n&240,((n&15)<<4|n&15)/255):null):(n=Vv.exec(e))?new xn(n[1],n[2],n[3],1):(n=Nv.exec(e))?new xn(n[1]*255/100,n[2]*255/100,n[3]*255/100,1):(n=Av.exec(e))?as(n[1],n[2],n[3],n[4]):(n=Fv.exec(e))?as(n[1]*255/100,n[2]*255/100,n[3]*255/100,n[4]):(n=Ov.exec(e))?Ku(n[1],n[2]/100,n[3]/100,1):(n=Bv.exec(e))?Ku(n[1],n[2]/100,n[3]/100,n[4]):Bu.hasOwnProperty(e)?Uu(Bu[e]):e==="transparent"?new xn(NaN,NaN,NaN,0):null}function Uu(e){return new xn(e>>16&255,e>>8&255,e&255,1)}function as(e,n,t,r){return r<=0&&(e=n=t=NaN),new xn(e,n,t,r)}function Uv(e){return e instanceof jo||(e=dr(e)),e?(e=e.rgb(),new xn(e.r,e.g,e.b,e.opacity)):new xn}function Ba(e,n,t,r){return arguments.length===1?Uv(e):new xn(e,n,t,r??1)}function xn(e,n,t,r){this.r=+e,this.g=+n,this.b=+t,this.opacity=+r}Ml(xn,Ba,kf(jo,{brighter(e){return e=e==null?Ys:Math.pow(Ys,e),new xn(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?Ao:Math.pow(Ao,e),new xn(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new xn(lr(this.r),lr(this.g),lr(this.b),qs(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Hu,formatHex:Hu,formatHex8:Hv,formatRgb:zu,toString:zu}));function Hu(){return`#${or(this.r)}${or(this.g)}${or(this.b)}`}function Hv(){return`#${or(this.r)}${or(this.g)}${or(this.b)}${or((isNaN(this.opacity)?1:this.opacity)*255)}`}function zu(){const e=qs(this.opacity);return`${e===1?"rgb(":"rgba("}${lr(this.r)}, ${lr(this.g)}, ${lr(this.b)}${e===1?")":`, ${e})`}`}function qs(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function lr(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function or(e){return e=lr(e),(e<16?"0":"")+e.toString(16)}function Ku(e,n,t,r){return r<=0?e=n=t=NaN:t<=0||t>=1?e=n=NaN:n<=0&&(e=NaN),new Un(e,n,t,r)}function Tf(e){if(e instanceof Un)return new Un(e.h,e.s,e.l,e.opacity);if(e instanceof jo||(e=dr(e)),!e)return new Un;if(e instanceof Un)return e;e=e.rgb();var n=e.r/255,t=e.g/255,r=e.b/255,o=Math.min(n,t,r),s=Math.max(n,t,r),i=NaN,a=s-o,l=(s+o)/2;return a?(n===s?i=(t-r)/a+(t<r)*6:t===s?i=(r-n)/a+2:i=(n-t)/a+4,a/=l<.5?s+o:2-s-o,i*=60):a=l>0&&l<1?0:i,new Un(i,a,l,e.opacity)}function zv(e,n,t,r){return arguments.length===1?Tf(e):new Un(e,n,t,r??1)}function Un(e,n,t,r){this.h=+e,this.s=+n,this.l=+t,this.opacity=+r}Ml(Un,zv,kf(jo,{brighter(e){return e=e==null?Ys:Math.pow(Ys,e),new Un(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?Ao:Math.pow(Ao,e),new Un(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,n=isNaN(e)||isNaN(this.s)?0:this.s,t=this.l,r=t+(t<.5?t:1-t)*n,o=2*t-r;return new xn(ta(e>=240?e-240:e+120,o,r),ta(e,o,r),ta(e<120?e+240:e-120,o,r),this.opacity)},clamp(){return new Un(Wu(this.h),ls(this.s),ls(this.l),qs(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=qs(this.opacity);return`${e===1?"hsl(":"hsla("}${Wu(this.h)}, ${ls(this.s)*100}%, ${ls(this.l)*100}%${e===1?")":`, ${e})`}`}}));function Wu(e){return e=(e||0)%360,e<0?e+360:e}function ls(e){return Math.max(0,Math.min(1,e||0))}function ta(e,n,t){return(e<60?n+(t-n)*e/60:e<180?t:e<240?n+(t-n)*(240-e)/60:n)*255}const kl=e=>()=>e;function Kv(e,n){return function(t){return e+t*n}}function Wv(e,n,t){return e=Math.pow(e,t),n=Math.pow(n,t)-e,t=1/t,function(r){return Math.pow(e+r*n,t)}}function Gv(e){return(e=+e)==1?Vf:function(n,t){return t-n?Wv(n,t,e):kl(isNaN(n)?t:n)}}function Vf(e,n){var t=n-e;return t?Kv(e,t):kl(isNaN(e)?n:e)}const js=function e(n){var t=Gv(n);function r(o,s){var i=t((o=Ba(o)).r,(s=Ba(s)).r),a=t(o.g,s.g),l=t(o.b,s.b),u=Vf(o.opacity,s.opacity);return function(d){return o.r=i(d),o.g=a(d),o.b=l(d),o.opacity=u(d),o+""}}return r.gamma=e,r}(1);function Xv(e,n){n||(n=[]);var t=e?Math.min(n.length,e.length):0,r=n.slice(),o;return function(s){for(o=0;o<t;++o)r[o]=e[o]*(1-s)+n[o]*s;return r}}function Yv(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function qv(e,n){var t=n?n.length:0,r=e?Math.min(t,e.length):0,o=new Array(r),s=new Array(t),i;for(i=0;i<r;++i)o[i]=bo(e[i],n[i]);for(;i<t;++i)s[i]=n[i];return function(a){for(i=0;i<r;++i)s[i]=o[i](a);return s}}function jv(e,n){var t=new Date;return e=+e,n=+n,function(r){return t.setTime(e*(1-r)+n*r),t}}function et(e,n){return e=+e,n=+n,function(t){return e*(1-t)+n*t}}function Zv(e,n){var t={},r={},o;(e===null||typeof e!="object")&&(e={}),(n===null||typeof n!="object")&&(n={});for(o in n)o in e?t[o]=bo(e[o],n[o]):r[o]=n[o];return function(s){for(o in t)r[o]=t[o](s);return r}}var Ra=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,ra=new RegExp(Ra.source,"g");function Jv(e){return function(){return e}}function Qv(e){return function(n){return e(n)+""}}function Nf(e,n){var t=Ra.lastIndex=ra.lastIndex=0,r,o,s,i=-1,a=[],l=[];for(e=e+"",n=n+"";(r=Ra.exec(e))&&(o=ra.exec(n));)(s=o.index)>t&&(s=n.slice(t,s),a[i]?a[i]+=s:a[++i]=s),(r=r[0])===(o=o[0])?a[i]?a[i]+=o:a[++i]=o:(a[++i]=null,l.push({i,x:et(r,o)})),t=ra.lastIndex;return t<n.length&&(s=n.slice(t),a[i]?a[i]+=s:a[++i]=s),a.length<2?l[0]?Qv(l[0].x):Jv(n):(n=l.length,function(u){for(var d=0,f;d<n;++d)a[(f=l[d]).i]=f.x(u);return a.join("")})}function bo(e,n){var t=typeof n,r;return n==null||t==="boolean"?kl(n):(t==="number"?et:t==="string"?(r=dr(n))?(n=r,js):Nf:n instanceof dr?js:n instanceof Date?jv:Yv(n)?Xv:Array.isArray(n)?qv:typeof n.valueOf!="function"&&typeof n.toString!="function"||isNaN(n)?Zv:et)(e,n)}var Gu=180/Math.PI,La={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function Af(e,n,t,r,o,s){var i,a,l;return(i=Math.sqrt(e*e+n*n))&&(e/=i,n/=i),(l=e*t+n*r)&&(t-=e*l,r-=n*l),(a=Math.sqrt(t*t+r*r))&&(t/=a,r/=a,l/=a),e*r<n*t&&(e=-e,n=-n,l=-l,i=-i),{translateX:o,translateY:s,rotate:Math.atan2(n,e)*Gu,skewX:Math.atan(l)*Gu,scaleX:i,scaleY:a}}var us;function e_(e){const n=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return n.isIdentity?La:Af(n.a,n.b,n.c,n.d,n.e,n.f)}function n_(e){return e==null||(us||(us=document.createElementNS("http://www.w3.org/2000/svg","g")),us.setAttribute("transform",e),!(e=us.transform.baseVal.consolidate()))?La:(e=e.matrix,Af(e.a,e.b,e.c,e.d,e.e,e.f))}function Ff(e,n,t,r){function o(u){return u.length?u.pop()+" ":""}function s(u,d,f,h,p,I){if(u!==f||d!==h){var P=p.push("translate(",null,n,null,t);I.push({i:P-4,x:et(u,f)},{i:P-2,x:et(d,h)})}else(f||h)&&p.push("translate("+f+n+h+t)}function i(u,d,f,h){u!==d?(u-d>180?d+=360:d-u>180&&(u+=360),h.push({i:f.push(o(f)+"rotate(",null,r)-2,x:et(u,d)})):d&&f.push(o(f)+"rotate("+d+r)}function a(u,d,f,h){u!==d?h.push({i:f.push(o(f)+"skewX(",null,r)-2,x:et(u,d)}):d&&f.push(o(f)+"skewX("+d+r)}function l(u,d,f,h,p,I){if(u!==f||d!==h){var P=p.push(o(p)+"scale(",null,",",null,")");I.push({i:P-4,x:et(u,f)},{i:P-2,x:et(d,h)})}else(f!==1||h!==1)&&p.push(o(p)+"scale("+f+","+h+")")}return function(u,d){var f=[],h=[];return u=e(u),d=e(d),s(u.translateX,u.translateY,d.translateX,d.translateY,f,h),i(u.rotate,d.rotate,f,h),a(u.skewX,d.skewX,f,h),l(u.scaleX,u.scaleY,d.scaleX,d.scaleY,f,h),u=d=null,function(p){for(var I=-1,P=h.length,x;++I<P;)f[(x=h[I]).i]=x.x(p);return f.join("")}}}var t_=Ff(e_,"px, ","px)","deg)"),r_=Ff(n_,", ",")",")"),o_=1e-12;function Xu(e){return((e=Math.exp(e))+1/e)/2}function s_(e){return((e=Math.exp(e))-1/e)/2}function i_(e){return((e=Math.exp(2*e))-1)/(e+1)}const $s=function e(n,t,r){function o(s,i){var a=s[0],l=s[1],u=s[2],d=i[0],f=i[1],h=i[2],p=d-a,I=f-l,P=p*p+I*I,x,N;if(P<o_)N=Math.log(h/u)/n,x=function(ne){return[a+ne*p,l+ne*I,u*Math.exp(n*ne*N)]};else{var U=Math.sqrt(P),D=(h*h-u*u+r*P)/(2*u*t*U),O=(h*h-u*u-r*P)/(2*h*t*U),Q=Math.log(Math.sqrt(D*D+1)-D),ee=Math.log(Math.sqrt(O*O+1)-O);N=(ee-Q)/n,x=function(ne){var ae=ne*N,re=Xu(Q),X=u/(t*U)*(re*i_(n*ae+Q)-s_(Q));return[a+X*p,l+X*I,u*re/Xu(n*ae+Q)]}}return x.duration=N*1e3*n/Math.SQRT2,x}return o.rho=function(s){var i=Math.max(.001,+s),a=i*i,l=a*a;return e(i,a,l)},o}(Math.SQRT2,2,4);var Or=0,ao=0,Jr=0,Of=1e3,Zs,lo,Js=0,fr=0,ki=0,Oo=typeof performance=="object"&&performance.now?performance:Date,Bf=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function Tl(){return fr||(Bf(a_),fr=Oo.now()+ki)}function a_(){fr=0}function Qs(){this._call=this._time=this._next=null}Qs.prototype=Rf.prototype={constructor:Qs,restart:function(e,n,t){if(typeof e!="function")throw new TypeError("callback is not a function");t=(t==null?Tl():+t)+(n==null?0:+n),!this._next&&lo!==this&&(lo?lo._next=this:Zs=this,lo=this),this._call=e,this._time=t,Ua()},stop:function(){this._call&&(this._call=null,this._time=1/0,Ua())}};function Rf(e,n,t){var r=new Qs;return r.restart(e,n,t),r}function l_(){Tl(),++Or;for(var e=Zs,n;e;)(n=fr-e._time)>=0&&e._call.call(void 0,n),e=e._next;--Or}function Yu(){fr=(Js=Oo.now())+ki,Or=ao=0;try{l_()}finally{Or=0,c_(),fr=0}}function u_(){var e=Oo.now(),n=e-Js;n>Of&&(ki-=n,Js=e)}function c_(){for(var e,n=Zs,t,r=1/0;n;)n._call?(r>n._time&&(r=n._time),e=n,n=n._next):(t=n._next,n._next=null,n=e?e._next=t:Zs=t);lo=e,Ua(r)}function Ua(e){if(!Or){ao&&(ao=clearTimeout(ao));var n=e-fr;n>24?(e<1/0&&(ao=setTimeout(Yu,e-Oo.now()-ki)),Jr&&(Jr=clearInterval(Jr))):(Jr||(Js=Oo.now(),Jr=setInterval(u_,Of)),Or=1,Bf(Yu))}}function qu(e,n,t){var r=new Qs;return n=n==null?0:+n,r.restart(o=>{r.stop(),e(o+n)},n,t),r}var d_=Di("start","end","cancel","interrupt"),f_=[],Lf=0,ju=1,Ha=2,xs=3,Zu=4,za=5,Ds=6;function Ti(e,n,t,r,o,s){var i=e.__transition;if(!i)e.__transition={};else if(t in i)return;p_(e,t,{name:n,index:r,group:o,on:d_,tween:f_,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:Lf})}function Vl(e,n){var t=Wn(e,n);if(t.state>Lf)throw new Error("too late; already scheduled");return t}function ut(e,n){var t=Wn(e,n);if(t.state>xs)throw new Error("too late; already running");return t}function Wn(e,n){var t=e.__transition;if(!t||!(t=t[n]))throw new Error("transition not found");return t}function p_(e,n,t){var r=e.__transition,o;r[n]=t,t.timer=Rf(s,0,t.time);function s(u){t.state=ju,t.timer.restart(i,t.delay,t.time),t.delay<=u&&i(u-t.delay)}function i(u){var d,f,h,p;if(t.state!==ju)return l();for(d in r)if(p=r[d],p.name===t.name){if(p.state===xs)return qu(i);p.state===Zu?(p.state=Ds,p.timer.stop(),p.on.call("interrupt",e,e.__data__,p.index,p.group),delete r[d]):+d<n&&(p.state=Ds,p.timer.stop(),p.on.call("cancel",e,e.__data__,p.index,p.group),delete r[d])}if(qu(function(){t.state===xs&&(t.state=Zu,t.timer.restart(a,t.delay,t.time),a(u))}),t.state=Ha,t.on.call("start",e,e.__data__,t.index,t.group),t.state===Ha){for(t.state=xs,o=new Array(h=t.tween.length),d=0,f=-1;d<h;++d)(p=t.tween[d].value.call(e,e.__data__,t.index,t.group))&&(o[++f]=p);o.length=f+1}}function a(u){for(var d=u<t.duration?t.ease.call(null,u/t.duration):(t.timer.restart(l),t.state=za,1),f=-1,h=o.length;++f<h;)o[f].call(e,d);t.state===za&&(t.on.call("end",e,e.__data__,t.index,t.group),l())}function l(){t.state=Ds,t.timer.stop(),delete r[n];for(var u in r)return;delete e.__transition}}function Ms(e,n){var t=e.__transition,r,o,s=!0,i;if(t){n=n==null?null:n+"";for(i in t){if((r=t[i]).name!==n){s=!1;continue}o=r.state>Ha&&r.state<za,r.state=Ds,r.timer.stop(),r.on.call(o?"interrupt":"cancel",e,e.__data__,r.index,r.group),delete t[i]}s&&delete e.__transition}}function h_(e){return this.each(function(){Ms(this,e)})}function m_(e,n){var t,r;return function(){var o=ut(this,e),s=o.tween;if(s!==t){r=t=s;for(var i=0,a=r.length;i<a;++i)if(r[i].name===n){r=r.slice(),r.splice(i,1);break}}o.tween=r}}function v_(e,n,t){var r,o;if(typeof t!="function")throw new Error;return function(){var s=ut(this,e),i=s.tween;if(i!==r){o=(r=i).slice();for(var a={name:n,value:t},l=0,u=o.length;l<u;++l)if(o[l].name===n){o[l]=a;break}l===u&&o.push(a)}s.tween=o}}function __(e,n){var t=this._id;if(e+="",arguments.length<2){for(var r=Wn(this.node(),t).tween,o=0,s=r.length,i;o<s;++o)if((i=r[o]).name===e)return i.value;return null}return this.each((n==null?m_:v_)(t,e,n))}function Nl(e,n,t){var r=e._id;return e.each(function(){var o=ut(this,r);(o.value||(o.value={}))[n]=t.apply(this,arguments)}),function(o){return Wn(o,r).value[n]}}function Uf(e,n){var t;return(typeof n=="number"?et:n instanceof dr?js:(t=dr(n))?(n=t,js):Nf)(e,n)}function g_(e){return function(){this.removeAttribute(e)}}function y_(e){return function(){this.removeAttributeNS(e.space,e.local)}}function C_(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttribute(e);return i===o?null:i===r?s:s=n(r=i,t)}}function S_(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttributeNS(e.space,e.local);return i===o?null:i===r?s:s=n(r=i,t)}}function b_(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttribute(e):(i=this.getAttribute(e),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function E_(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttributeNS(e.space,e.local):(i=this.getAttributeNS(e.space,e.local),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function w_(e,n){var t=Mi(e),r=t==="transform"?r_:Uf;return this.attrTween(e,typeof n=="function"?(t.local?E_:b_)(t,r,Nl(this,"attr."+e,n)):n==null?(t.local?y_:g_)(t):(t.local?S_:C_)(t,r,n))}function I_(e,n){return function(t){this.setAttribute(e,n.call(this,t))}}function P_(e,n){return function(t){this.setAttributeNS(e.space,e.local,n.call(this,t))}}function $_(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&P_(e,s)),t}return o._value=n,o}function x_(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&I_(e,s)),t}return o._value=n,o}function D_(e,n){var t="attr."+e;if(arguments.length<2)return(t=this.tween(t))&&t._value;if(n==null)return this.tween(t,null);if(typeof n!="function")throw new Error;var r=Mi(e);return this.tween(t,(r.local?$_:x_)(r,n))}function M_(e,n){return function(){Vl(this,e).delay=+n.apply(this,arguments)}}function k_(e,n){return n=+n,function(){Vl(this,e).delay=n}}function T_(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?M_:k_)(n,e)):Wn(this.node(),n).delay}function V_(e,n){return function(){ut(this,e).duration=+n.apply(this,arguments)}}function N_(e,n){return n=+n,function(){ut(this,e).duration=n}}function A_(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?V_:N_)(n,e)):Wn(this.node(),n).duration}function F_(e,n){if(typeof n!="function")throw new Error;return function(){ut(this,e).ease=n}}function O_(e){var n=this._id;return arguments.length?this.each(F_(n,e)):Wn(this.node(),n).ease}function B_(e,n){return function(){var t=n.apply(this,arguments);if(typeof t!="function")throw new Error;ut(this,e).ease=t}}function R_(e){if(typeof e!="function")throw new Error;return this.each(B_(this._id,e))}function L_(e){typeof e!="function"&&(e=yf(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,u=0;u<i;++u)(l=s[u])&&e.call(l,l.__data__,u,s)&&a.push(l);return new Dt(r,this._parents,this._name,this._id)}function U_(e){if(e._id!==this._id)throw new Error;for(var n=this._groups,t=e._groups,r=n.length,o=t.length,s=Math.min(r,o),i=new Array(r),a=0;a<s;++a)for(var l=n[a],u=t[a],d=l.length,f=i[a]=new Array(d),h,p=0;p<d;++p)(h=l[p]||u[p])&&(f[p]=h);for(;a<r;++a)i[a]=n[a];return new Dt(i,this._parents,this._name,this._id)}function H_(e){return(e+"").trim().split(/^|\s+/).every(function(n){var t=n.indexOf(".");return t>=0&&(n=n.slice(0,t)),!n||n==="start"})}function z_(e,n,t){var r,o,s=H_(n)?Vl:ut;return function(){var i=s(this,e),a=i.on;a!==r&&(o=(r=a).copy()).on(n,t),i.on=o}}function K_(e,n){var t=this._id;return arguments.length<2?Wn(this.node(),t).on.on(e):this.each(z_(t,e,n))}function W_(e){return function(){var n=this.parentNode;for(var t in this.__transition)if(+t!==e)return;n&&n.removeChild(this)}}function G_(){return this.on("end.remove",W_(this._id))}function X_(e){var n=this._name,t=this._id;typeof e!="function"&&(e=xl(e));for(var r=this._groups,o=r.length,s=new Array(o),i=0;i<o;++i)for(var a=r[i],l=a.length,u=s[i]=new Array(l),d,f,h=0;h<l;++h)(d=a[h])&&(f=e.call(d,d.__data__,h,a))&&("__data__"in d&&(f.__data__=d.__data__),u[h]=f,Ti(u[h],n,t,h,u,Wn(d,t)));return new Dt(s,this._parents,n,t)}function Y_(e){var n=this._name,t=this._id;typeof e!="function"&&(e=gf(e));for(var r=this._groups,o=r.length,s=[],i=[],a=0;a<o;++a)for(var l=r[a],u=l.length,d,f=0;f<u;++f)if(d=l[f]){for(var h=e.call(d,d.__data__,f,l),p,I=Wn(d,t),P=0,x=h.length;P<x;++P)(p=h[P])&&Ti(p,n,t,P,h,I);s.push(h),i.push(d)}return new Dt(s,i,n,t)}var q_=qo.prototype.constructor;function j_(){return new q_(this._groups,this._parents)}function Z_(e,n){var t,r,o;return function(){var s=Fr(this,e),i=(this.style.removeProperty(e),Fr(this,e));return s===i?null:s===t&&i===r?o:o=n(t=s,r=i)}}function Hf(e){return function(){this.style.removeProperty(e)}}function J_(e,n,t){var r,o=t+"",s;return function(){var i=Fr(this,e);return i===o?null:i===r?s:s=n(r=i,t)}}function Q_(e,n,t){var r,o,s;return function(){var i=Fr(this,e),a=t(this),l=a+"";return a==null&&(l=a=(this.style.removeProperty(e),Fr(this,e))),i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a))}}function eg(e,n){var t,r,o,s="style."+n,i="end."+s,a;return function(){var l=ut(this,e),u=l.on,d=l.value[s]==null?a||(a=Hf(n)):void 0;(u!==t||o!==d)&&(r=(t=u).copy()).on(i,o=d),l.on=r}}function ng(e,n,t){var r=(e+="")=="transform"?t_:Uf;return n==null?this.styleTween(e,Z_(e,r)).on("end.style."+e,Hf(e)):typeof n=="function"?this.styleTween(e,Q_(e,r,Nl(this,"style."+e,n))).each(eg(this._id,e)):this.styleTween(e,J_(e,r,n),t).on("end.style."+e,null)}function tg(e,n,t){return function(r){this.style.setProperty(e,n.call(this,r),t)}}function rg(e,n,t){var r,o;function s(){var i=n.apply(this,arguments);return i!==o&&(r=(o=i)&&tg(e,i,t)),r}return s._value=n,s}function og(e,n,t){var r="style."+(e+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(n==null)return this.tween(r,null);if(typeof n!="function")throw new Error;return this.tween(r,rg(e,n,t??""))}function sg(e){return function(){this.textContent=e}}function ig(e){return function(){var n=e(this);this.textContent=n??""}}function ag(e){return this.tween("text",typeof e=="function"?ig(Nl(this,"text",e)):sg(e==null?"":e+""))}function lg(e){return function(n){this.textContent=e.call(this,n)}}function ug(e){var n,t;function r(){var o=e.apply(this,arguments);return o!==t&&(n=(t=o)&&lg(o)),n}return r._value=e,r}function cg(e){var n="text";if(arguments.length<1)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;return this.tween(n,ug(e))}function dg(){for(var e=this._name,n=this._id,t=zf(),r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,u=0;u<a;++u)if(l=i[u]){var d=Wn(l,n);Ti(l,e,t,u,i,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new Dt(r,this._parents,e,t)}function fg(){var e,n,t=this,r=t._id,o=t.size();return new Promise(function(s,i){var a={value:i},l={value:function(){--o===0&&s()}};t.each(function(){var u=ut(this,r),d=u.on;d!==e&&(n=(e=d).copy(),n._.cancel.push(a),n._.interrupt.push(a),n._.end.push(l)),u.on=n}),o===0&&s()})}var pg=0;function Dt(e,n,t,r){this._groups=e,this._parents=n,this._name=t,this._id=r}function zf(){return++pg}var ht=qo.prototype;Dt.prototype={constructor:Dt,select:X_,selectAll:Y_,selectChild:ht.selectChild,selectChildren:ht.selectChildren,filter:L_,merge:U_,selection:j_,transition:dg,call:ht.call,nodes:ht.nodes,node:ht.node,size:ht.size,empty:ht.empty,each:ht.each,on:K_,attr:w_,attrTween:D_,style:ng,styleTween:og,text:ag,textTween:cg,remove:G_,tween:__,delay:T_,duration:A_,ease:O_,easeVarying:R_,end:fg,[Symbol.iterator]:ht[Symbol.iterator]};function hg(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var mg={time:null,delay:0,duration:250,ease:hg};function vg(e,n){for(var t;!(t=e.__transition)||!(t=t[n]);)if(!(e=e.parentNode))throw new Error(`transition ${n} not found`);return t}function _g(e){var n,t;e instanceof Dt?(n=e._id,e=e._name):(n=zf(),(t=mg).time=Tl(),e=e==null?null:e+"");for(var r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,u=0;u<a;++u)(l=i[u])&&Ti(l,e,n,u,i,t||vg(l,n));return new Dt(r,this._parents,e,n)}qo.prototype.interrupt=h_;qo.prototype.transition=_g;const cs=e=>()=>e;function gg(e,{sourceEvent:n,target:t,transform:r,dispatch:o}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},target:{value:t,enumerable:!0,configurable:!0},transform:{value:r,enumerable:!0,configurable:!0},_:{value:o}})}function St(e,n,t){this.k=e,this.x=n,this.y=t}St.prototype={constructor:St,scale:function(e){return e===1?this:new St(this.k*e,this.x,this.y)},translate:function(e,n){return e===0&n===0?this:new St(this.k,this.x+this.k*e,this.y+this.k*n)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var Br=new St(1,0,0);St.prototype;function oa(e){e.stopImmediatePropagation()}function Qr(e){e.preventDefault(),e.stopImmediatePropagation()}function yg(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function Cg(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function Ju(){return this.__zoom||Br}function Sg(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function bg(){return navigator.maxTouchPoints||"ontouchstart"in this}function Eg(e,n,t){var r=e.invertX(n[0][0])-t[0][0],o=e.invertX(n[1][0])-t[1][0],s=e.invertY(n[0][1])-t[0][1],i=e.invertY(n[1][1])-t[1][1];return e.translate(o>r?(r+o)/2:Math.min(0,r)||Math.max(0,o),i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i))}function wg(){var e=yg,n=Cg,t=Eg,r=Sg,o=bg,s=[0,1/0],i=[[-1/0,-1/0],[1/0,1/0]],a=250,l=$s,u=Di("start","zoom","end"),d,f,h,p=500,I=150,P=0,x=10;function N(v){v.property("__zoom",Ju).on("wheel.zoom",ae,{passive:!1}).on("mousedown.zoom",re).on("dblclick.zoom",X).filter(o).on("touchstart.zoom",Z).on("touchmove.zoom",k).on("touchend.zoom touchcancel.zoom",G).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}N.transform=function(v,K,S,z){var L=v.selection?v.selection():v;L.property("__zoom",Ju),v!==L?Q(v,K,S,z):L.interrupt().each(function(){ee(this,arguments).event(z).start().zoom(null,typeof K=="function"?K.apply(this,arguments):K).end()})},N.scaleBy=function(v,K,S,z){N.scaleTo(v,function(){var L=this.__zoom.k,W=typeof K=="function"?K.apply(this,arguments):K;return L*W},S,z)},N.scaleTo=function(v,K,S,z){N.transform(v,function(){var L=n.apply(this,arguments),W=this.__zoom,Y=S==null?O(L):typeof S=="function"?S.apply(this,arguments):S,se=W.invert(Y),oe=typeof K=="function"?K.apply(this,arguments):K;return t(D(U(W,oe),Y,se),L,i)},S,z)},N.translateBy=function(v,K,S,z){N.transform(v,function(){return t(this.__zoom.translate(typeof K=="function"?K.apply(this,arguments):K,typeof S=="function"?S.apply(this,arguments):S),n.apply(this,arguments),i)},null,z)},N.translateTo=function(v,K,S,z,L){N.transform(v,function(){var W=n.apply(this,arguments),Y=this.__zoom,se=z==null?O(W):typeof z=="function"?z.apply(this,arguments):z;return t(Br.translate(se[0],se[1]).scale(Y.k).translate(typeof K=="function"?-K.apply(this,arguments):-K,typeof S=="function"?-S.apply(this,arguments):-S),W,i)},z,L)};function U(v,K){return K=Math.max(s[0],Math.min(s[1],K)),K===v.k?v:new St(K,v.x,v.y)}function D(v,K,S){var z=K[0]-S[0]*v.k,L=K[1]-S[1]*v.k;return z===v.x&&L===v.y?v:new St(v.k,z,L)}function O(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function Q(v,K,S,z){v.on("start.zoom",function(){ee(this,arguments).event(z).start()}).on("interrupt.zoom end.zoom",function(){ee(this,arguments).event(z).end()}).tween("zoom",function(){var L=this,W=arguments,Y=ee(L,W).event(z),se=n.apply(L,W),oe=S==null?O(se):typeof S=="function"?S.apply(L,W):S,me=Math.max(se[1][0]-se[0][0],se[1][1]-se[0][1]),be=L.__zoom,ue=typeof K=="function"?K.apply(L,W):K,pe=l(be.invert(oe).concat(me/be.k),ue.invert(oe).concat(me/ue.k));return function(_e){if(_e===1)_e=ue;else{var ke=pe(_e),Ne=me/ke[2];_e=new St(Ne,oe[0]-ke[0]*Ne,oe[1]-ke[1]*Ne)}Y.zoom(null,_e)}})}function ee(v,K,S){return!S&&v.__zooming||new ne(v,K)}function ne(v,K){this.that=v,this.args=K,this.active=0,this.sourceEvent=null,this.extent=n.apply(v,K),this.taps=0}ne.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,K){return this.mouse&&v!=="mouse"&&(this.mouse[1]=K.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=K.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=K.invert(this.touch1[0])),this.that.__zoom=K,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var K=Ln(this.that).datum();u.call(v,this.that,new gg(v,{sourceEvent:this.sourceEvent,target:N,transform:this.that.__zoom,dispatch:u}),K)}};function ae(v,...K){if(!e.apply(this,arguments))return;var S=ee(this,K).event(v),z=this.__zoom,L=Math.max(s[0],Math.min(s[1],z.k*Math.pow(2,r.apply(this,arguments)))),W=Zn(v);if(S.wheel)(S.mouse[0][0]!==W[0]||S.mouse[0][1]!==W[1])&&(S.mouse[1]=z.invert(S.mouse[0]=W)),clearTimeout(S.wheel);else{if(z.k===L)return;S.mouse=[W,z.invert(W)],Ms(this),S.start()}Qr(v),S.wheel=setTimeout(Y,I),S.zoom("mouse",t(D(U(z,L),S.mouse[0],S.mouse[1]),S.extent,i));function Y(){S.wheel=null,S.end()}}function re(v,...K){if(h||!e.apply(this,arguments))return;var S=v.currentTarget,z=ee(this,K,!0).event(v),L=Ln(v.view).on("mousemove.zoom",oe,!0).on("mouseup.zoom",me,!0),W=Zn(v,S),Y=v.clientX,se=v.clientY;Df(v.view),oa(v),z.mouse=[W,this.__zoom.invert(W)],Ms(this),z.start();function oe(be){if(Qr(be),!z.moved){var ue=be.clientX-Y,pe=be.clientY-se;z.moved=ue*ue+pe*pe>P}z.event(be).zoom("mouse",t(D(z.that.__zoom,z.mouse[0]=Zn(be,S),z.mouse[1]),z.extent,i))}function me(be){L.on("mousemove.zoom mouseup.zoom",null),Mf(be.view,z.moved),Qr(be),z.event(be).end()}}function X(v,...K){if(e.apply(this,arguments)){var S=this.__zoom,z=Zn(v.changedTouches?v.changedTouches[0]:v,this),L=S.invert(z),W=S.k*(v.shiftKey?.5:2),Y=t(D(U(S,W),z,L),n.apply(this,K),i);Qr(v),a>0?Ln(this).transition().duration(a).call(Q,Y,z,v):Ln(this).call(N.transform,Y,z,v)}}function Z(v,...K){if(e.apply(this,arguments)){var S=v.touches,z=S.length,L=ee(this,K,v.changedTouches.length===z).event(v),W,Y,se,oe;for(oa(v),Y=0;Y<z;++Y)se=S[Y],oe=Zn(se,this),oe=[oe,this.__zoom.invert(oe),se.identifier],L.touch0?!L.touch1&&L.touch0[2]!==oe[2]&&(L.touch1=oe,L.taps=0):(L.touch0=oe,W=!0,L.taps=1+!!d);d&&(d=clearTimeout(d)),W&&(L.taps<2&&(f=oe[0],d=setTimeout(function(){d=null},p)),Ms(this),L.start())}}function k(v,...K){if(this.__zooming){var S=ee(this,K).event(v),z=v.changedTouches,L=z.length,W,Y,se,oe;for(Qr(v),W=0;W<L;++W)Y=z[W],se=Zn(Y,this),S.touch0&&S.touch0[2]===Y.identifier?S.touch0[0]=se:S.touch1&&S.touch1[2]===Y.identifier&&(S.touch1[0]=se);if(Y=S.that.__zoom,S.touch1){var me=S.touch0[0],be=S.touch0[1],ue=S.touch1[0],pe=S.touch1[1],_e=(_e=ue[0]-me[0])*_e+(_e=ue[1]-me[1])*_e,ke=(ke=pe[0]-be[0])*ke+(ke=pe[1]-be[1])*ke;Y=U(Y,Math.sqrt(_e/ke)),se=[(me[0]+ue[0])/2,(me[1]+ue[1])/2],oe=[(be[0]+pe[0])/2,(be[1]+pe[1])/2]}else if(S.touch0)se=S.touch0[0],oe=S.touch0[1];else return;S.zoom("touch",t(D(Y,se,oe),S.extent,i))}}function G(v,...K){if(this.__zooming){var S=ee(this,K).event(v),z=v.changedTouches,L=z.length,W,Y;for(oa(v),h&&clearTimeout(h),h=setTimeout(function(){h=null},p),W=0;W<L;++W)Y=z[W],S.touch0&&S.touch0[2]===Y.identifier?delete S.touch0:S.touch1&&S.touch1[2]===Y.identifier&&delete S.touch1;if(S.touch1&&!S.touch0&&(S.touch0=S.touch1,delete S.touch1),S.touch0)S.touch0[1]=this.__zoom.invert(S.touch0[0]);else if(S.end(),S.taps===2&&(Y=Zn(Y,this),Math.hypot(f[0]-Y[0],f[1]-Y[1])<x)){var se=Ln(this).on("dblclick.zoom");se&&se.apply(this,arguments)}}}return N.wheelDelta=function(v){return arguments.length?(r=typeof v=="function"?v:cs(+v),N):r},N.filter=function(v){return arguments.length?(e=typeof v=="function"?v:cs(!!v),N):e},N.touchable=function(v){return arguments.length?(o=typeof v=="function"?v:cs(!!v),N):o},N.extent=function(v){return arguments.length?(n=typeof v=="function"?v:cs([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),N):n},N.scaleExtent=function(v){return arguments.length?(s[0]=+v[0],s[1]=+v[1],N):[s[0],s[1]]},N.translateExtent=function(v){return arguments.length?(i[0][0]=+v[0][0],i[1][0]=+v[1][0],i[0][1]=+v[0][1],i[1][1]=+v[1][1],N):[[i[0][0],i[0][1]],[i[1][0],i[1][1]]]},N.constrain=function(v){return arguments.length?(t=v,N):t},N.duration=function(v){return arguments.length?(a=+v,N):a},N.interpolate=function(v){return arguments.length?(l=v,N):l},N.on=function(){var v=u.on.apply(u,arguments);return v===u?N:v},N.clickDistance=function(v){return arguments.length?(P=(v=+v)*v,N):Math.sqrt(P)},N.tapDistance=function(v){return arguments.length?(x=+v,N):x},N}var xe=(e=>(e.Left="left",e.Top="top",e.Right="right",e.Bottom="bottom",e))(xe||{}),Al=(e=>(e.Partial="partial",e.Full="full",e))(Al||{}),nr=(e=>(e.Bezier="default",e.SimpleBezier="simple-bezier",e.Straight="straight",e.Step="step",e.SmoothStep="smoothstep",e))(nr||{}),zt=(e=>(e.Strict="strict",e.Loose="loose",e))(zt||{}),Ka=(e=>(e.Arrow="arrow",e.ArrowClosed="arrowclosed",e))(Ka||{}),Eo=(e=>(e.Free="free",e.Vertical="vertical",e.Horizontal="horizontal",e))(Eo||{}),Kf=(e=>(e.TopLeft="top-left",e.TopCenter="top-center",e.TopRight="top-right",e.BottomLeft="bottom-left",e.BottomCenter="bottom-center",e.BottomRight="bottom-right",e))(Kf||{});const Ig=["INPUT","SELECT","TEXTAREA"],Pg=typeof document<"u"?document:null;function Wa(e){var n,t;const r=((t=(n=e.composedPath)==null?void 0:n.call(e))==null?void 0:t[0])||e.target,o=typeof(r==null?void 0:r.hasAttribute)=="function"?r.hasAttribute("contenteditable"):!1,s=typeof(r==null?void 0:r.closest)=="function"?r.closest(".nokey"):null;return Ig.includes(r==null?void 0:r.nodeName)||o||!!s}function $g(e){return e.ctrlKey||e.metaKey||e.shiftKey||e.altKey}function Qu(e,n,t,r){const o=n.replace("+",`
`).replace(`

`,`
+`).split(`
`).map(i=>i.trim().toLowerCase());if(o.length===1)return e.toLowerCase()===n.toLowerCase();r||t.add(e.toLowerCase());const s=o.every((i,a)=>t.has(i)&&Array.from(t.values())[a]===o[a]);return r&&t.delete(e.toLowerCase()),s}function xg(e,n){return t=>{if(!t.code&&!t.key)return!1;const r=Dg(t.code,e);return Array.isArray(e)?e.some(o=>Qu(t[r],o,n,t.type==="keyup")):Qu(t[r],e,n,t.type==="keyup")}}function Dg(e,n){return n.includes(e)?"code":"key"}function wo(e,n){const t=ie(()=>Ue(n==null?void 0:n.target)??Pg),r=Ut(Ue(e)===!0);let o=!1;const s=new Set;let i=l(Ue(e));Fe(()=>Ue(e),(u,d)=>{typeof d=="boolean"&&typeof u!="boolean"&&a(),i=l(u)},{immediate:!0}),vf(["blur","contextmenu"],a),Au((...u)=>i(...u),u=>{var d,f;const h=Ue(n==null?void 0:n.actInsideInputWithModifier)??!0,p=Ue(n==null?void 0:n.preventDefault)??!1;if(o=$g(u),(!o||o&&!h)&&Wa(u))return;const P=((f=(d=u.composedPath)==null?void 0:d.call(u))==null?void 0:f[0])||u.target,x=(P==null?void 0:P.nodeName)==="BUTTON"||(P==null?void 0:P.nodeName)==="A";!p&&(o||!x)&&u.preventDefault(),r.value=!0},{eventName:"keydown",target:t}),Au((...u)=>i(...u),u=>{const d=Ue(n==null?void 0:n.actInsideInputWithModifier)??!0;if(r.value){if((!o||o&&!d)&&Wa(u))return;o=!1,r.value=!1}},{eventName:"keyup",target:t});function a(){o=!1,s.clear(),r.value=Ue(e)===!0}function l(u){return u===null?(a(),()=>!1):typeof u=="boolean"?(a(),r.value=u,()=>!1):Array.isArray(u)||typeof u=="string"?xg(u,s):u}return r}const Wf="vue-flow__node-desc",Gf="vue-flow__edge-desc",Mg="vue-flow__aria-live",Xf=["Enter"," ","Escape"],Mr={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};function ei(e){return{...e.computedPosition||{x:0,y:0},width:e.dimensions.width||0,height:e.dimensions.height||0}}function ni(e,n){const t=Math.max(0,Math.min(e.x+e.width,n.x+n.width)-Math.max(e.x,n.x)),r=Math.max(0,Math.min(e.y+e.height,n.y+n.height)-Math.max(e.y,n.y));return Math.ceil(t*r)}function Vi(e){return{width:e.offsetWidth,height:e.offsetHeight}}function pr(e,n=0,t=1){return Math.min(Math.max(e,n),t)}function Yf(e,n){return{x:pr(e.x,n[0][0],n[1][0]),y:pr(e.y,n[0][1],n[1][1])}}function ec(e){const n=e.getRootNode();return"elementFromPoint"in n?n:window.document}function Kt(e){return e&&typeof e=="object"&&"id"in e&&"source"in e&&"target"in e}function ur(e){return e&&typeof e=="object"&&"id"in e&&"position"in e&&!Kt(e)}function uo(e){return ur(e)&&"computedPosition"in e}function ds(e){return!Number.isNaN(e)&&Number.isFinite(e)}function kg(e){return ds(e.width)&&ds(e.height)&&ds(e.x)&&ds(e.y)}function Tg(e,n,t){const r={id:e.id.toString(),type:e.type??"default",dimensions:Et({width:0,height:0}),computedPosition:Et({z:0,...e.position}),handleBounds:{source:[],target:[]},draggable:void 0,selectable:void 0,connectable:void 0,focusable:void 0,selected:!1,dragging:!1,resizing:!1,initialized:!1,isParent:!1,position:{x:0,y:0},data:ln(e.data)?e.data:{},events:Et(ln(e.events)?e.events:{})};return Object.assign(n??r,e,{id:e.id.toString(),parentNode:t})}function qf(e,n,t){var r,o;const s={id:e.id.toString(),type:e.type??(n==null?void 0:n.type)??"default",source:e.source.toString(),target:e.target.toString(),sourceHandle:(r=e.sourceHandle)==null?void 0:r.toString(),targetHandle:(o=e.targetHandle)==null?void 0:o.toString(),updatable:e.updatable??(t==null?void 0:t.updatable),selectable:e.selectable??(t==null?void 0:t.selectable),focusable:e.focusable??(t==null?void 0:t.focusable),data:ln(e.data)?e.data:{},events:Et(ln(e.events)?e.events:{}),label:e.label??"",interactionWidth:e.interactionWidth??(t==null?void 0:t.interactionWidth),...t??{}};return Object.assign(n??s,e,{id:e.id.toString()})}function jf(e,n,t,r){const o=typeof e=="string"?e:e.id,s=new Set,i=r==="source"?"target":"source";for(const a of t)a[i]===o&&s.add(a[r]);return n.filter(a=>s.has(a.id))}function Vg(...e){if(e.length===3){const[s,i,a]=e;return jf(s,i,a,"target")}const[n,t]=e,r=typeof n=="string"?n:n.id;return t.filter(s=>Kt(s)&&s.source===r).map(s=>t.find(i=>ur(i)&&i.id===s.target))}function Ng(...e){if(e.length===3){const[s,i,a]=e;return jf(s,i,a,"source")}const[n,t]=e,r=typeof n=="string"?n:n.id;return t.filter(s=>Kt(s)&&s.target===r).map(s=>t.find(i=>ur(i)&&i.id===s.source))}function Zf({source:e,sourceHandle:n,target:t,targetHandle:r}){return`vueflow__edge-${e}${n??""}-${t}${r??""}`}function Ag(e,n){return n.some(t=>Kt(t)&&t.source===e.source&&t.target===e.target&&(t.sourceHandle===e.sourceHandle||!t.sourceHandle&&!e.sourceHandle)&&(t.targetHandle===e.targetHandle||!t.targetHandle&&!e.targetHandle))}function Bo({x:e,y:n},{x:t,y:r,zoom:o}){return{x:e*o+t,y:n*o+r}}function Ro({x:e,y:n},{x:t,y:r,zoom:o},s=!1,i=[1,1]){const a={x:(e-t)/o,y:(n-r)/o};return s?Ni(a,i):a}function Jf(e,n){return{x:Math.min(e.x,n.x),y:Math.min(e.y,n.y),x2:Math.max(e.x2,n.x2),y2:Math.max(e.y2,n.y2)}}function ti({x:e,y:n,width:t,height:r}){return{x:e,y:n,x2:e+t,y2:n+r}}function Qf({x:e,y:n,x2:t,y2:r}){return{x:e,y:n,width:t-e,height:r-n}}function Fg(e,n){return Qf(Jf(ti(e),ti(n)))}function Fl(e){let n={x:Number.POSITIVE_INFINITY,y:Number.POSITIVE_INFINITY,x2:Number.NEGATIVE_INFINITY,y2:Number.NEGATIVE_INFINITY};for(let t=0;t<e.length;t++){const r=e[t];n=Jf(n,ti({...r.computedPosition,...r.dimensions}))}return Qf(n)}function ep(e,n,t={x:0,y:0,zoom:1},r=!1,o=!1){const s={...Ro(n,t),width:n.width/t.zoom,height:n.height/t.zoom},i=[];for(const a of e){const{dimensions:l,selectable:u=!0,hidden:d=!1}=a,f=l.width??a.width??null,h=l.height??a.height??null;if(o&&!u||d)continue;const p=ni(s,ei(a)),I=f===null||h===null,P=r&&p>0,x=(f??0)*(h??0);(I||P||p>=x||a.dragging)&&i.push(a)}return i}function tr(e,n){const t=new Set;if(typeof e=="string")t.add(e);else if(e.length>=1)for(const r of e)t.add(r.id);return n.filter(r=>t.has(r.source)||t.has(r.target))}function Cr(e,n){if(typeof e=="number")return Math.floor((n-n/(1+e))*.5);if(typeof e=="string"&&e.endsWith("px")){const t=Number.parseFloat(e);if(!Number.isNaN(t))return Math.floor(t)}if(typeof e=="string"&&e.endsWith("%")){const t=Number.parseFloat(e);if(!Number.isNaN(t))return Math.floor(n*t*.01)}return Zo(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`),0}function Og(e,n,t){if(typeof e=="string"||typeof e=="number"){const r=Cr(e,t),o=Cr(e,n);return{top:r,right:o,bottom:r,left:o,x:o*2,y:r*2}}if(typeof e=="object"){const r=Cr(e.top??e.y??0,t),o=Cr(e.bottom??e.y??0,t),s=Cr(e.left??e.x??0,n),i=Cr(e.right??e.x??0,n);return{top:r,right:i,bottom:o,left:s,x:s+i,y:r+o}}return{top:0,right:0,bottom:0,left:0,x:0,y:0}}function Bg(e,n,t,r,o,s){const{x:i,y:a}=Bo(e,{x:n,y:t,zoom:r}),{x:l,y:u}=Bo({x:e.x+e.width,y:e.y+e.height},{x:n,y:t,zoom:r}),d=o-l,f=s-u;return{left:Math.floor(i),top:Math.floor(a),right:Math.floor(d),bottom:Math.floor(f)}}function nc(e,n,t,r,o,s=.1){const i=Og(s,n,t),a=(n-i.x)/e.width,l=(t-i.y)/e.height,u=Math.min(a,l),d=pr(u,r,o),f=e.x+e.width/2,h=e.y+e.height/2,p=n/2-f*d,I=t/2-h*d,P=Bg(e,p,I,d,n,t),x={left:Math.min(P.left-i.left,0),top:Math.min(P.top-i.top,0),right:Math.min(P.right-i.right,0),bottom:Math.min(P.bottom-i.bottom,0)};return{x:p-x.left+x.right,y:I-x.top+x.bottom,zoom:d}}function Rg(e,n){return{x:n.x+e.x,y:n.y+e.y,z:(e.z>n.z?e.z:n.z)+1}}function np(e,n){if(!e.parentNode)return!1;const t=n.get(e.parentNode);return t?t.selected?!0:np(t,n):!1}function Lo(e,n){return typeof e>"u"?"":typeof e=="string"?e:`${n?`${n}__`:""}${Object.keys(e).sort().map(r=>`${r}=${e[r]}`).join("&")}`}function Ga(e){const n=e.ctrlKey&&Uo()?10:1;return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*n}function tc(e,n,t){return e<n?pr(Math.abs(e-n),1,n)/n:e>t?-pr(Math.abs(e-t),1,n)/n:0}function tp(e,n,t=15,r=40){const o=tc(e.x,r,n.width-r)*t,s=tc(e.y,r,n.height-r)*t;return[o,s]}function sa(e,n){if(n){const t=e.position.x+e.dimensions.width-n.dimensions.width,r=e.position.y+e.dimensions.height-n.dimensions.height;if(t>0||r>0||e.position.x<0||e.position.y<0){let o={};if(typeof n.style=="function"?o={...n.style(n)}:n.style&&(o={...n.style}),o.width=o.width??`${n.dimensions.width}px`,o.height=o.height??`${n.dimensions.height}px`,t>0)if(typeof o.width=="string"){const s=Number(o.width.replace("px",""));o.width=`${s+t}px`}else o.width+=t;if(r>0)if(typeof o.height=="string"){const s=Number(o.height.replace("px",""));o.height=`${s+r}px`}else o.height+=r;if(e.position.x<0){const s=Math.abs(e.position.x);if(n.position.x=n.position.x-s,typeof o.width=="string"){const i=Number(o.width.replace("px",""));o.width=`${i+s}px`}else o.width+=s;e.position.x=0}if(e.position.y<0){const s=Math.abs(e.position.y);if(n.position.y=n.position.y-s,typeof o.height=="string"){const i=Number(o.height.replace("px",""));o.height=`${i+s}px`}else o.height+=s;e.position.y=0}n.dimensions.width=Number(o.width.toString().replace("px","")),n.dimensions.height=Number(o.height.toString().replace("px","")),typeof n.style=="function"?n.style=s=>{const i=n.style;return{...i(s),...o}}:n.style={...n.style,...o}}}}function rc(e,n){var t,r;const o=e.filter(i=>i.type==="add"||i.type==="remove");for(const i of o)if(i.type==="add")n.findIndex(l=>l.id===i.item.id)===-1&&n.push(i.item);else if(i.type==="remove"){const a=n.findIndex(l=>l.id===i.id);a!==-1&&n.splice(a,1)}const s=n.map(i=>i.id);for(const i of n)for(const a of e)if(a.id===i.id)switch(a.type){case"select":i.selected=a.selected;break;case"position":if(uo(i)&&(typeof a.position<"u"&&(i.position=a.position),typeof a.dragging<"u"&&(i.dragging=a.dragging),i.expandParent&&i.parentNode)){const l=n[s.indexOf(i.parentNode)];l&&uo(l)&&sa(i,l)}break;case"dimensions":if(uo(i)&&(typeof a.dimensions<"u"&&(i.dimensions=a.dimensions),typeof a.updateStyle<"u"&&a.updateStyle&&(i.style={...i.style||{},width:`${(t=a.dimensions)==null?void 0:t.width}px`,height:`${(r=a.dimensions)==null?void 0:r.height}px`}),typeof a.resizing<"u"&&(i.resizing=a.resizing),i.expandParent&&i.parentNode)){const l=n[s.indexOf(i.parentNode)];l&&uo(l)&&(!!l.dimensions.width&&!!l.dimensions.height?sa(i,l):mn(()=>{sa(i,l)}))}break}return n}function Nt(e,n){return{id:e,type:"select",selected:n}}function oc(e){return{item:e,type:"add"}}function sc(e){return{id:e,type:"remove"}}function ic(e,n,t,r,o){return{id:e,source:n,target:t,sourceHandle:r||null,targetHandle:o||null,type:"remove"}}function Ot(e,n=new Set,t=!1){const r=[];for(const[o,s]of e){const i=n.has(o);!(s.selected===void 0&&!i)&&s.selected!==i&&(t&&(s.selected=i),r.push(Nt(s.id,i)))}return r}const ac=()=>{};function $e(e){const n=new Set;let t=ac,r=()=>!1;const o=()=>n.size>0||r(),s=h=>{t=h},i=()=>{t=ac},a=h=>{r=h},l=()=>{r=()=>!1},u=h=>{n.delete(h)};return{on:h=>{n.add(h);const p=()=>u(h);return Vo(p),{off:p}},off:u,trigger:h=>{const p=[t];return o()?p.push(...n):e&&p.push(e),Promise.allSettled(p.map(I=>I(h)))},hasListeners:o,listeners:n,setEmitter:s,removeEmitter:i,setHasEmitListeners:a,removeHasEmitListeners:l}}function lc(e,n,t){let r=e;do{if(r&&r.matches(n))return!0;if(r===t)return!1;r=r.parentElement}while(r);return!1}function Lg(e,n,t,r){var o,s;const i=new Map;for(const[a,l]of e)(l.selected||l.id===r)&&(!l.parentNode||!np(l,e))&&(l.draggable||n&&typeof l.draggable>"u")&&e.get(a)&&i.set(a,{id:l.id,position:l.position||{x:0,y:0},distance:{x:t.x-((o=l.computedPosition)==null?void 0:o.x)||0,y:t.y-((s=l.computedPosition)==null?void 0:s.y)||0},from:{x:l.computedPosition.x,y:l.computedPosition.y},extent:l.extent,parentNode:l.parentNode,dimensions:{...l.dimensions},expandParent:l.expandParent});return Array.from(i.values())}function ia({id:e,dragItems:n,findNode:t}){const r=[];for(const o of n){const s=t(o.id);s&&r.push(s)}return[e?r.find(o=>o.id===e):r[0],r]}function rp(e){if(Array.isArray(e))switch(e.length){case 1:return[e[0],e[0],e[0],e[0]];case 2:return[e[0],e[1],e[0],e[1]];case 3:return[e[0],e[1],e[2],e[1]];case 4:return e;default:return[0,0,0,0]}return[e,e,e,e]}function Ug(e,n,t){const[r,o,s,i]=typeof e!="string"?rp(e.padding):[0,0,0,0];return t&&typeof t.computedPosition.x<"u"&&typeof t.computedPosition.y<"u"&&typeof t.dimensions.width<"u"&&typeof t.dimensions.height<"u"?[[t.computedPosition.x+i,t.computedPosition.y+r],[t.computedPosition.x+t.dimensions.width-o,t.computedPosition.y+t.dimensions.height-s]]:!1}function Hg(e,n,t,r){let o=e.extent||t;if((o==="parent"||!Array.isArray(o)&&(o==null?void 0:o.range)==="parent")&&!e.expandParent)if(e.parentNode&&r&&e.dimensions.width&&e.dimensions.height){const s=Ug(o,e,r);s&&(o=s)}else n(new dn(un.NODE_EXTENT_INVALID,e.id)),o=t;else if(Array.isArray(o)){const s=(r==null?void 0:r.computedPosition.x)||0,i=(r==null?void 0:r.computedPosition.y)||0;o=[[o[0][0]+s,o[0][1]+i],[o[1][0]+s,o[1][1]+i]]}else if(o!=="parent"&&(o!=null&&o.range)&&Array.isArray(o.range)){const[s,i,a,l]=rp(o.padding),u=(r==null?void 0:r.computedPosition.x)||0,d=(r==null?void 0:r.computedPosition.y)||0;o=[[o.range[0][0]+u+l,o.range[0][1]+d+s],[o.range[1][0]+u-i,o.range[1][1]+d-a]]}return o==="parent"?[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]]:o}function zg({width:e,height:n},t){return[t[0],[t[1][0]-(e||0),t[1][1]-(n||0)]]}function Ol(e,n,t,r,o){const s=zg(e.dimensions,Hg(e,t,r,o)),i=Yf(n,s);return{position:{x:i.x-((o==null?void 0:o.computedPosition.x)||0),y:i.y-((o==null?void 0:o.computedPosition.y)||0)},computedPosition:i}}function Rr(e,n,t=xe.Left,r=!1){const o=((n==null?void 0:n.x)??0)+e.computedPosition.x,s=((n==null?void 0:n.y)??0)+e.computedPosition.y,{width:i,height:a}=n??Xg(e);if(r)return{x:o+i/2,y:s+a/2};switch((n==null?void 0:n.position)??t){case xe.Top:return{x:o+i/2,y:s};case xe.Right:return{x:o+i,y:s+a/2};case xe.Bottom:return{x:o+i/2,y:s+a};case xe.Left:return{x:o,y:s+a/2}}}function uc(e,n){return e&&(n?e.find(t=>t.id===n):e[0])||null}function Kg({sourcePos:e,targetPos:n,sourceWidth:t,sourceHeight:r,targetWidth:o,targetHeight:s,width:i,height:a,viewport:l}){const u={x:Math.min(e.x,n.x),y:Math.min(e.y,n.y),x2:Math.max(e.x+t,n.x+o),y2:Math.max(e.y+r,n.y+s)};u.x===u.x2&&(u.x2+=1),u.y===u.y2&&(u.y2+=1);const d=ti({x:(0-l.x)/l.zoom,y:(0-l.y)/l.zoom,width:i/l.zoom,height:a/l.zoom}),f=Math.max(0,Math.min(d.x2,u.x2)-Math.max(d.x,u.x)),h=Math.max(0,Math.min(d.y2,u.y2)-Math.max(d.y,u.y));return Math.ceil(f*h)>0}function Wg(e,n,t=!1){const r=typeof e.zIndex=="number";let o=r?e.zIndex:0;const s=n(e.source),i=n(e.target);return!s||!i?0:(t&&(o=r?e.zIndex:Math.max(s.computedPosition.z||0,i.computedPosition.z||0)),o)}var un=(e=>(e.MISSING_STYLES="MISSING_STYLES",e.MISSING_VIEWPORT_DIMENSIONS="MISSING_VIEWPORT_DIMENSIONS",e.NODE_INVALID="NODE_INVALID",e.NODE_NOT_FOUND="NODE_NOT_FOUND",e.NODE_MISSING_PARENT="NODE_MISSING_PARENT",e.NODE_TYPE_MISSING="NODE_TYPE_MISSING",e.NODE_EXTENT_INVALID="NODE_EXTENT_INVALID",e.EDGE_INVALID="EDGE_INVALID",e.EDGE_NOT_FOUND="EDGE_NOT_FOUND",e.EDGE_SOURCE_MISSING="EDGE_SOURCE_MISSING",e.EDGE_TARGET_MISSING="EDGE_TARGET_MISSING",e.EDGE_TYPE_MISSING="EDGE_TYPE_MISSING",e.EDGE_SOURCE_TARGET_SAME="EDGE_SOURCE_TARGET_SAME",e.EDGE_SOURCE_TARGET_MISSING="EDGE_SOURCE_TARGET_MISSING",e.EDGE_ORPHANED="EDGE_ORPHANED",e.USEVUEFLOW_OPTIONS="USEVUEFLOW_OPTIONS",e))(un||{});const cc={MISSING_STYLES:()=>"It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly",MISSING_VIEWPORT_DIMENSIONS:()=>"The Vue Flow parent container needs a width and a height to render the graph",NODE_INVALID:e=>`Node is invalid
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
Edge: ${e}`,USEVUEFLOW_OPTIONS:()=>"The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"};class dn extends Error{constructor(n,...t){var r;super((r=cc[n])==null?void 0:r.call(cc,...t)),this.name="VueFlowError",this.code=n,this.args=t}}function Bl(e){return"clientX"in e}function Gg(e){return"sourceEvent"in e}function nt(e,n){const t=Bl(e);let r,o;return t?(r=e.clientX,o=e.clientY):"touches"in e&&e.touches.length>0?(r=e.touches[0].clientX,o=e.touches[0].clientY):"changedTouches"in e&&e.changedTouches.length>0?(r=e.changedTouches[0].clientX,o=e.changedTouches[0].clientY):(r=0,o=0),{x:r-((n==null?void 0:n.left)??0),y:o-((n==null?void 0:n.top)??0)}}const Uo=()=>{var e;return typeof navigator<"u"&&((e=navigator==null?void 0:navigator.userAgent)==null?void 0:e.indexOf("Mac"))>=0};function Xg(e){var n,t;return{width:((n=e.dimensions)==null?void 0:n.width)??e.width??0,height:((t=e.dimensions)==null?void 0:t.height)??e.height??0}}function Ni(e,n=[1,1]){return{x:n[0]*Math.round(e.x/n[0]),y:n[1]*Math.round(e.y/n[1])}}const Yg=()=>!0;function aa(e){e==null||e.classList.remove("valid","connecting","vue-flow__handle-valid","vue-flow__handle-connecting")}function qg(e,n,t){const r=[],o={x:e.x-t,y:e.y-t,width:t*2,height:t*2};for(const s of n.values())ni(o,ei(s))>0&&r.push(s);return r}const jg=250;function Zg(e,n,t,r){var o,s;let i=[],a=Number.POSITIVE_INFINITY;const l=qg(e,t,n+jg);for(const u of l){const d=[...((o=u.handleBounds)==null?void 0:o.source)??[],...((s=u.handleBounds)==null?void 0:s.target)??[]];for(const f of d){if(r.nodeId===f.nodeId&&r.type===f.type&&r.id===f.id)continue;const{x:h,y:p}=Rr(u,f,f.position,!0),I=Math.sqrt((h-e.x)**2+(p-e.y)**2);I>n||(I<a?(i=[{...f,x:h,y:p}],a=I):I===a&&i.push({...f,x:h,y:p}))}}if(!i.length)return null;if(i.length>1){const u=r.type==="source"?"target":"source";return i.find(d=>d.type===u)??i[0]}return i[0]}function dc(e,{handle:n,connectionMode:t,fromNodeId:r,fromHandleId:o,fromType:s,doc:i,lib:a,flowId:l,isValidConnection:u=Yg},d,f,h,p){const I=s==="target",P=n?i.querySelector(`.${a}-flow__handle[data-id="${l}-${n==null?void 0:n.nodeId}-${n==null?void 0:n.id}-${n==null?void 0:n.type}"]`):null,{x,y:N}=nt(e),U=i.elementFromPoint(x,N),D=U!=null&&U.classList.contains(`${a}-flow__handle`)?U:P,O={handleDomNode:D,isValid:!1,connection:null,toHandle:null};if(D){const Q=op(void 0,D),ee=D.getAttribute("data-nodeid"),ne=D.getAttribute("data-handleid"),ae=D.classList.contains("connectable"),re=D.classList.contains("connectableend");if(!ee||!Q)return O;const X={source:I?ee:r,sourceHandle:I?ne:o,target:I?r:ee,targetHandle:I?o:ne};O.connection=X;const k=ae&&re&&(t===zt.Strict?I&&Q==="source"||!I&&Q==="target":ee!==r||ne!==o);O.isValid=k&&u(X,{nodes:f,edges:d,sourceNode:h(X.source),targetNode:h(X.target)}),O.toHandle=sp(ee,Q,ne,p,t,!0)}return O}function op(e,n){return e||(n!=null&&n.classList.contains("target")?"target":n!=null&&n.classList.contains("source")?"source":null)}function Jg(e,n){let t=null;return n?t="valid":e&&!n&&(t="invalid"),t}function Qg(e,n){let t=null;return n?t=!0:e&&!n&&(t=!1),t}function sp(e,n,t,r,o,s=!1){var i,a,l;const u=r.get(e);if(!u)return null;const d=o===zt.Strict?(i=u.handleBounds)==null?void 0:i[n]:[...((a=u.handleBounds)==null?void 0:a.source)??[],...((l=u.handleBounds)==null?void 0:l.target)??[]],f=(t?d==null?void 0:d.find(h=>h.id===t):d==null?void 0:d[0])??null;return f&&s?{...f,...Rr(u,f,f.position,!0)}:f}const Xa={[xe.Left]:xe.Right,[xe.Right]:xe.Left,[xe.Top]:xe.Bottom,[xe.Bottom]:xe.Top},ey=["production","prod"];function Zo(e,...n){ip()&&console.warn(`[Vue Flow]: ${e}`,...n)}function ip(){return!ey.includes("production")}function fc(e,n,t,r,o){const s=n.querySelectorAll(`.vue-flow__handle.${e}`);return s!=null&&s.length?Array.from(s).map(i=>{const a=i.getBoundingClientRect();return{id:i.getAttribute("data-handleid"),type:e,nodeId:o,position:i.getAttribute("data-handlepos"),x:(a.left-t.left)/r,y:(a.top-t.top)/r,...Vi(i)}}):null}function Ya(e,n,t,r,o,s=!1,i){o.value=!1,e.selected?(s||e.selected&&n)&&(r([e]),mn(()=>{i.blur()})):t([e])}function ln(e){return typeof le(e)<"u"}function ny(e,n,t,r){if(!e||!e.source||!e.target)return t(new dn(un.EDGE_INVALID,(e==null?void 0:e.id)??"[ID UNKNOWN]")),!1;let o;return Kt(e)?o=e:o={...e,id:Zf(e)},o=qf(o,void 0,r),Ag(o,n)?!1:o}function ty(e,n,t,r,o){if(!n.source||!n.target)return o(new dn(un.EDGE_INVALID,e.id)),!1;if(!t)return o(new dn(un.EDGE_NOT_FOUND,e.id)),!1;const{id:s,...i}=e;return{...i,id:r?Zf(n):s,source:n.source,target:n.target,sourceHandle:n.sourceHandle,targetHandle:n.targetHandle}}function pc(e,n,t){const r={},o=[];for(let s=0;s<e.length;++s){const i=e[s];if(!ur(i)){t(new dn(un.NODE_INVALID,i==null?void 0:i.id)||`[ID UNKNOWN|INDEX ${s}]`);continue}const a=Tg(i,n(i.id),i.parentNode);i.parentNode&&(r[i.parentNode]=!0),o[s]=a}for(const s of o){const i=n(s.parentNode)||o.find(a=>a.id===s.parentNode);s.parentNode&&!i&&t(new dn(un.NODE_MISSING_PARENT,s.id,s.parentNode)),(s.parentNode||r[s.id])&&(r[s.id]&&(s.isParent=!0),i&&(i.isParent=!0))}return o}function hc(e,n,t,r,o,s){let i=o;const a=r.get(i)||new Map;r.set(i,a.set(t,n)),i=`${o}-${e}`;const l=r.get(i)||new Map;if(r.set(i,l.set(t,n)),s){i=`${o}-${e}-${s}`;const u=r.get(i)||new Map;r.set(i,u.set(t,n))}}function la(e,n,t){e.clear();for(const r of t){const{source:o,target:s,sourceHandle:i=null,targetHandle:a=null}=r,l={edgeId:r.id,source:o,target:s,sourceHandle:i,targetHandle:a},u=`${o}-${i}--${s}-${a}`,d=`${s}-${a}--${o}-${i}`;hc("source",l,d,e,o,i),hc("target",l,u,e,s,a)}}function mc(e,n){if(e.size!==n.size)return!1;for(const t of e)if(!n.has(t))return!1;return!0}function ua(e,n,t,r,o,s,i,a){const l=[];for(const u of e){const d=Kt(u)?u:ny(u,a,o,s);if(!d)continue;const f=t(d.source),h=t(d.target);if(!f||!h){o(new dn(un.EDGE_SOURCE_TARGET_MISSING,d.id,d.source,d.target));continue}if(!f){o(new dn(un.EDGE_SOURCE_MISSING,d.id,d.source));continue}if(!h){o(new dn(un.EDGE_TARGET_MISSING,d.id,d.target));continue}if(n&&!n(d,{edges:a,nodes:i,sourceNode:f,targetNode:h})){o(new dn(un.EDGE_INVALID,d.id));continue}const p=r(d.id);l.push({...qf(d,p,s),sourceNode:f,targetNode:h})}return l}const vc=Symbol("vueFlow"),ap=Symbol("nodeId"),lp=Symbol("nodeRef"),ry=Symbol("edgeId"),oy=Symbol("edgeRef"),Ai=Symbol("slots");function up(e){const{vueFlowRef:n,snapToGrid:t,snapGrid:r,noDragClassName:o,nodeLookup:s,nodeExtent:i,nodeDragThreshold:a,viewport:l,autoPanOnNodeDrag:u,autoPanSpeed:d,nodesDraggable:f,panBy:h,findNode:p,multiSelectionActive:I,nodesSelectionActive:P,selectNodesOnDrag:x,removeSelectedElements:N,addSelectedNodes:U,updateNodePositions:D,emits:O}=Je(),{onStart:Q,onDrag:ee,onStop:ne,onClick:ae,el:re,disabled:X,id:Z,selectable:k,dragHandle:G}=e,v=Ut(!1);let K=[],S,z=null,L={x:void 0,y:void 0},W={x:0,y:0},Y=null,se=!1,oe=!1,me=0,be=!1;const ue=ay(),pe=({x:$,y:B})=>{L={x:$,y:B};let g=!1;if(K=K.map(y=>{const w={x:$-y.distance.x,y:B-y.distance.y},{computedPosition:F}=Ol(y,t.value?Ni(w,r.value):w,O.error,i.value,y.parentNode?p(y.parentNode):void 0);return g=g||y.position.x!==F.x||y.position.y!==F.y,y.position=F,y}),oe=oe||g,!!g&&(D(K,!0,!0),v.value=!0,Y)){const[y,w]=ia({id:Z,dragItems:K,findNode:p});ee({event:Y,node:y,nodes:w})}},_e=()=>{if(!z)return;const[$,B]=tp(W,z,d.value);if($!==0||B!==0){const g={x:(L.x??0)-$/l.value.zoom,y:(L.y??0)-B/l.value.zoom};h({x:$,y:B})&&pe(g)}me=requestAnimationFrame(_e)},ke=($,B)=>{se=!0;const g=p(Z);!x.value&&!I.value&&g&&(g.selected||N()),g&&Ue(k)&&x.value&&Ya(g,I.value,U,N,P,!1,B);const y=ue($.sourceEvent);if(L=y,K=Lg(s.value,f.value,y,Z),K.length){const[w,F]=ia({id:Z,dragItems:K,findNode:p});Q({event:$.sourceEvent,node:w,nodes:F})}},Ne=($,B)=>{var g;$.sourceEvent.type==="touchmove"&&$.sourceEvent.touches.length>1||(oe=!1,a.value===0&&ke($,B),L=ue($.sourceEvent),z=((g=n.value)==null?void 0:g.getBoundingClientRect())||null,W=nt($.sourceEvent,z))},De=($,B)=>{const g=ue($.sourceEvent);if(!be&&se&&u.value&&(be=!0,_e()),!se){const y=g.xSnapped-(L.x??0),w=g.ySnapped-(L.y??0);Math.sqrt(y*y+w*w)>a.value&&ke($,B)}(L.x!==g.xSnapped||L.y!==g.ySnapped)&&K.length&&se&&(Y=$.sourceEvent,W=nt($.sourceEvent,z),pe(g))},Se=$=>{let B=!1;if(!se&&!v.value&&!I.value){const g=$.sourceEvent,y=ue(g),w=y.xSnapped-(L.x??0),F=y.ySnapped-(L.y??0),_=Math.sqrt(w*w+F*F);_!==0&&_<=a.value&&(ae==null||ae(g),B=!0)}if(K.length&&!B){oe&&(D(K,!1,!1),oe=!1);const[g,y]=ia({id:Z,dragItems:K,findNode:p});ne({event:$.sourceEvent,node:g,nodes:y})}K=[],v.value=!1,be=!1,se=!1,L={x:void 0,y:void 0},cancelAnimationFrame(me)};return Fe([()=>Ue(X),re],([$,B],g,y)=>{if(B){const w=Ln(B);$||(S=kv().on("start",F=>Ne(F,B)).on("drag",F=>De(F,B)).on("end",F=>Se(F)).filter(F=>{const _=F.target,C=Ue(G);return!F.button&&(!o.value||!lc(_,`.${o.value}`,B)&&(!C||lc(_,C,B)))}),w.call(S)),y(()=>{w.on(".drag",null),S&&(S.on("start",null),S.on("drag",null),S.on("end",null))})}}),v}function sy(){return{doubleClick:$e(),click:$e(),mouseEnter:$e(),mouseMove:$e(),mouseLeave:$e(),contextMenu:$e(),updateStart:$e(),update:$e(),updateEnd:$e()}}function iy(e,n){const t=sy();return t.doubleClick.on(r=>{var o,s;n.edgeDoubleClick(r),(s=(o=e.events)==null?void 0:o.doubleClick)==null||s.call(o,r)}),t.click.on(r=>{var o,s;n.edgeClick(r),(s=(o=e.events)==null?void 0:o.click)==null||s.call(o,r)}),t.mouseEnter.on(r=>{var o,s;n.edgeMouseEnter(r),(s=(o=e.events)==null?void 0:o.mouseEnter)==null||s.call(o,r)}),t.mouseMove.on(r=>{var o,s;n.edgeMouseMove(r),(s=(o=e.events)==null?void 0:o.mouseMove)==null||s.call(o,r)}),t.mouseLeave.on(r=>{var o,s;n.edgeMouseLeave(r),(s=(o=e.events)==null?void 0:o.mouseLeave)==null||s.call(o,r)}),t.contextMenu.on(r=>{var o,s;n.edgeContextMenu(r),(s=(o=e.events)==null?void 0:o.contextMenu)==null||s.call(o,r)}),t.updateStart.on(r=>{var o,s;n.edgeUpdateStart(r),(s=(o=e.events)==null?void 0:o.updateStart)==null||s.call(o,r)}),t.update.on(r=>{var o,s;n.edgeUpdate(r),(s=(o=e.events)==null?void 0:o.update)==null||s.call(o,r)}),t.updateEnd.on(r=>{var o,s;n.edgeUpdateEnd(r),(s=(o=e.events)==null?void 0:o.updateEnd)==null||s.call(o,r)}),Object.entries(t).reduce((r,[o,s])=>(r.emit[o]=s.trigger,r.on[o]=s.on,r),{emit:{},on:{}})}function ay(){const{viewport:e,snapGrid:n,snapToGrid:t,vueFlowRef:r}=Je();return o=>{var s;const i=((s=r.value)==null?void 0:s.getBoundingClientRect())??{left:0,top:0},a=Gg(o)?o.sourceEvent:o,{x:l,y:u}=nt(a,i),d=Ro({x:l,y:u},e.value),{x:f,y:h}=t.value?Ni(d,n.value):d;return{xSnapped:f,ySnapped:h,...d}}}function fs(){return!0}function cp({handleId:e,nodeId:n,type:t,isValidConnection:r,edgeUpdaterType:o,onEdgeUpdate:s,onEdgeUpdateEnd:i}){const{id:a,vueFlowRef:l,connectionMode:u,connectionRadius:d,connectOnClick:f,connectionClickStartHandle:h,nodesConnectable:p,autoPanOnConnect:I,autoPanSpeed:P,findNode:x,panBy:N,startConnection:U,updateConnection:D,endConnection:O,emits:Q,viewport:ee,edges:ne,nodes:ae,isValidConnection:re,nodeLookup:X}=Je();let Z=null,k=!1,G=null;function v(S){var z;const L=Ue(t)==="target",W=Bl(S),Y=ec(S.target),se=S.currentTarget;if(se&&(W&&S.button===0||!W)){let oe=function(M){g=nt(M,Se),pe=Zg(Ro(g,ee.value,!1,[1,1]),d.value,X.value,F),y||(w(),y=!0);const q=dc(M,{handle:pe,connectionMode:u.value,fromNodeId:Ue(n),fromHandleId:Ue(e),fromType:L?"target":"source",isValidConnection:ue,doc:Y,lib:"vue",flowId:a,nodeLookup:X.value},ne.value,ae.value,x,X.value);G=q.handleDomNode,Z=q.connection,k=Qg(!!pe,q.isValid);const A={...m,isValid:k,to:q.toHandle&&k?Bo({x:q.toHandle.x,y:q.toHandle.y},ee.value):g,toHandle:q.toHandle,toPosition:k&&q.toHandle?q.toHandle.position:Xa[F.position],toNode:q.toHandle?X.value.get(q.toHandle.nodeId):null};if(k&&pe&&(m!=null&&m.toHandle)&&A.toHandle&&m.toHandle.type===A.toHandle.type&&m.toHandle.nodeId===A.toHandle.nodeId&&m.toHandle.id===A.toHandle.id&&m.to.x===A.to.x&&m.to.y===A.to.y)return;const V=pe??q.toHandle;if(D(V&&k?Bo({x:V.x,y:V.y},ee.value):g,V,Jg(!!V,k)),m=A,!pe&&!k&&!G)return aa(B);Z&&Z.source!==Z.target&&G&&(aa(B),B=G,G.classList.add("connecting","vue-flow__handle-connecting"),G.classList.toggle("valid",!!k),G.classList.toggle("vue-flow__handle-valid",!!k))},me=function(M){"touches"in M&&M.touches.length>0||((pe||G)&&Z&&k&&(s?s(M,Z):Q.connect(Z)),Q.connectEnd(M),o&&(i==null||i(M)),aa(B),cancelAnimationFrame(_e),O(M),y=!1,k=!1,Z=null,G=null,Y.removeEventListener("mousemove",oe),Y.removeEventListener("mouseup",me),Y.removeEventListener("touchmove",oe),Y.removeEventListener("touchend",me))};const be=x(Ue(n));let ue=Ue(r)||re.value||fs;!ue&&be&&(ue=(L?be.isValidSourcePos:be.isValidTargetPos)||fs);let pe,_e=0;const{x:ke,y:Ne}=nt(S),De=op(Ue(o),se),Se=(z=l.value)==null?void 0:z.getBoundingClientRect();if(!Se||!De)return;const $=sp(Ue(n),De,Ue(e),X.value,u.value);if(!$)return;let B,g=nt(S,Se),y=!1;const w=()=>{if(!I.value)return;const[M,q]=tp(g,Se,P.value);N({x:M,y:q}),_e=requestAnimationFrame(w)},F={...$,nodeId:Ue(n),type:De,position:$.position},_=X.value.get(Ue(n)),E={inProgress:!0,isValid:null,from:Rr(_,F,xe.Left,!0),fromHandle:F,fromPosition:F.position,fromNode:_,to:g,toHandle:null,toPosition:Xa[F.position],toNode:null};U({nodeId:Ue(n),id:Ue(e),type:De,position:(se==null?void 0:se.getAttribute("data-handlepos"))||xe.Top,...g},{x:ke-Se.left,y:Ne-Se.top}),Q.connectStart({event:S,nodeId:Ue(n),handleId:Ue(e),handleType:De});let m=E;Y.addEventListener("mousemove",oe),Y.addEventListener("mouseup",me),Y.addEventListener("touchmove",oe),Y.addEventListener("touchend",me)}}function K(S){var z,L;if(!f.value)return;const W=Ue(t)==="target";if(!h.value){Q.clickConnectStart({event:S,nodeId:Ue(n),handleId:Ue(e)}),U({nodeId:Ue(n),type:Ue(t),id:Ue(e),position:xe.Top,...nt(S)},void 0,!0);return}let Y=Ue(r)||re.value||fs;const se=x(Ue(n));if(!Y&&se&&(Y=(W?se.isValidSourcePos:se.isValidTargetPos)||fs),se&&(typeof se.connectable>"u"?p.value:se.connectable)===!1)return;const oe=ec(S.target),me=dc(S,{handle:{nodeId:Ue(n),id:Ue(e),type:Ue(t),position:xe.Top,...nt(S)},connectionMode:u.value,fromNodeId:h.value.nodeId,fromHandleId:h.value.id??null,fromType:h.value.type,isValidConnection:Y,doc:oe,lib:"vue",flowId:a,nodeLookup:X.value},ne.value,ae.value,x,X.value),be=((z=me.connection)==null?void 0:z.source)===((L=me.connection)==null?void 0:L.target);me.isValid&&me.connection&&!be&&Q.connect(me.connection),Q.clickConnectEnd(S),O(S,!0)}return{handlePointerDown:v,handleClick:K}}function ly(){return Tn(ap,"")}function dp(e){const n=e??ly()??"",t=Tn(lp,Ee(null)),{findNode:r,edges:o,emits:s}=Je(),i=r(n);return i||s.error(new dn(un.NODE_NOT_FOUND,n)),{id:n,nodeEl:t,node:i,parentNode:ie(()=>r(i.parentNode)),connectedEdges:ie(()=>tr([i],o.value))}}function uy(){return{doubleClick:$e(),click:$e(),mouseEnter:$e(),mouseMove:$e(),mouseLeave:$e(),contextMenu:$e(),dragStart:$e(),drag:$e(),dragStop:$e()}}function cy(e,n){const t=uy();return t.doubleClick.on(r=>{var o,s;n.nodeDoubleClick(r),(s=(o=e.events)==null?void 0:o.doubleClick)==null||s.call(o,r)}),t.click.on(r=>{var o,s;n.nodeClick(r),(s=(o=e.events)==null?void 0:o.click)==null||s.call(o,r)}),t.mouseEnter.on(r=>{var o,s;n.nodeMouseEnter(r),(s=(o=e.events)==null?void 0:o.mouseEnter)==null||s.call(o,r)}),t.mouseMove.on(r=>{var o,s;n.nodeMouseMove(r),(s=(o=e.events)==null?void 0:o.mouseMove)==null||s.call(o,r)}),t.mouseLeave.on(r=>{var o,s;n.nodeMouseLeave(r),(s=(o=e.events)==null?void 0:o.mouseLeave)==null||s.call(o,r)}),t.contextMenu.on(r=>{var o,s;n.nodeContextMenu(r),(s=(o=e.events)==null?void 0:o.contextMenu)==null||s.call(o,r)}),t.dragStart.on(r=>{var o,s;n.nodeDragStart(r),(s=(o=e.events)==null?void 0:o.dragStart)==null||s.call(o,r)}),t.drag.on(r=>{var o,s;n.nodeDrag(r),(s=(o=e.events)==null?void 0:o.drag)==null||s.call(o,r)}),t.dragStop.on(r=>{var o,s;n.nodeDragStop(r),(s=(o=e.events)==null?void 0:o.dragStop)==null||s.call(o,r)}),Object.entries(t).reduce((r,[o,s])=>(r.emit[o]=s.trigger,r.on[o]=s.on,r),{emit:{},on:{}})}function fp(){const{getSelectedNodes:e,nodeExtent:n,updateNodePositions:t,findNode:r,snapGrid:o,snapToGrid:s,nodesDraggable:i,emits:a}=Je();return(l,u=!1)=>{const d=s.value?o.value[0]:5,f=s.value?o.value[1]:5,h=u?4:1,p=l.x*d*h,I=l.y*f*h,P=[];for(const x of e.value)if(x.draggable||i&&typeof x.draggable>"u"){const N={x:x.computedPosition.x+p,y:x.computedPosition.y+I},{position:U}=Ol(x,N,a.error,n.value,x.parentNode?r(x.parentNode):void 0);P.push({id:x.id,position:U,from:x.position,distance:{x:l.x,y:l.y},dimensions:x.dimensions})}t(P,!0,!1)}}const ps=.1,dy=e=>((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2;function Vt(){return Zo("Viewport not initialized yet."),Promise.resolve(!1)}const fy={zoomIn:Vt,zoomOut:Vt,zoomTo:Vt,fitView:Vt,setCenter:Vt,fitBounds:Vt,project:e=>e,screenToFlowCoordinate:e=>e,flowToScreenCoordinate:e=>e,setViewport:Vt,setTransform:Vt,getViewport:()=>({x:0,y:0,zoom:1}),getTransform:()=>({x:0,y:0,zoom:1}),viewportInitialized:!1};function py(e){function n(r,o){return new Promise(s=>{e.d3Selection&&e.d3Zoom?e.d3Zoom.interpolate((o==null?void 0:o.interpolate)==="linear"?bo:$s).scaleBy(ca(e.d3Selection,o==null?void 0:o.duration,o==null?void 0:o.ease,()=>{s(!0)}),r):s(!1)})}function t(r,o,s,i){return new Promise(a=>{var l;const{x:u,y:d}=Yf({x:-r,y:-o},e.translateExtent),f=Br.translate(-u,-d).scale(s);e.d3Selection&&e.d3Zoom?(l=e.d3Zoom)==null||l.interpolate((i==null?void 0:i.interpolate)==="linear"?bo:$s).transform(ca(e.d3Selection,i==null?void 0:i.duration,i==null?void 0:i.ease,()=>{a(!0)}),f):a(!1)})}return ie(()=>e.d3Zoom&&e.d3Selection&&e.dimensions.width&&e.dimensions.height?{viewportInitialized:!0,zoomIn:o=>n(1.2,o),zoomOut:o=>n(1/1.2,o),zoomTo:(o,s)=>new Promise(i=>{e.d3Selection&&e.d3Zoom?e.d3Zoom.interpolate((s==null?void 0:s.interpolate)==="linear"?bo:$s).scaleTo(ca(e.d3Selection,s==null?void 0:s.duration,s==null?void 0:s.ease,()=>{i(!0)}),o):i(!1)}),setViewport:(o,s)=>t(o.x,o.y,o.zoom,s),setTransform:(o,s)=>t(o.x,o.y,o.zoom,s),getViewport:()=>({x:e.viewport.x,y:e.viewport.y,zoom:e.viewport.zoom}),getTransform:()=>({x:e.viewport.x,y:e.viewport.y,zoom:e.viewport.zoom}),fitView:(o={padding:ps,includeHiddenNodes:!1,duration:0})=>{var s,i;const a=[];for(const h of e.nodes)h.dimensions.width&&h.dimensions.height&&((o==null?void 0:o.includeHiddenNodes)||!h.hidden)&&(!((s=o.nodes)!=null&&s.length)||(i=o.nodes)!=null&&i.length&&o.nodes.includes(h.id))&&a.push(h);if(!a.length)return Promise.resolve(!1);const l=Fl(a),{x:u,y:d,zoom:f}=nc(l,e.dimensions.width,e.dimensions.height,o.minZoom??e.minZoom,o.maxZoom??e.maxZoom,o.padding??ps);return t(u,d,f,o)},setCenter:(o,s,i)=>{const a=typeof(i==null?void 0:i.zoom)<"u"?i.zoom:e.maxZoom,l=e.dimensions.width/2-o*a,u=e.dimensions.height/2-s*a;return t(l,u,a,i)},fitBounds:(o,s={padding:ps})=>{const{x:i,y:a,zoom:l}=nc(o,e.dimensions.width,e.dimensions.height,e.minZoom,e.maxZoom,s.padding??ps);return t(i,a,l,s)},project:o=>Ro(o,e.viewport,e.snapToGrid,e.snapGrid),screenToFlowCoordinate:o=>{if(e.vueFlowRef){const{x:s,y:i}=e.vueFlowRef.getBoundingClientRect(),a={x:o.x-s,y:o.y-i};return Ro(a,e.viewport,e.snapToGrid,e.snapGrid)}return{x:0,y:0}},flowToScreenCoordinate:o=>{if(e.vueFlowRef){const{x:s,y:i}=e.vueFlowRef.getBoundingClientRect(),a={x:o.x+s,y:o.y+i};return Bo(a,e.viewport)}return{x:0,y:0}}}:fy)}function ca(e,n=0,t=dy,r=()=>{}){const o=typeof n=="number"&&n>0;return o||r(),o?e.transition().duration(n).ease(t).on("end",r):e}function hy(e,n,t){const r=ad(!0);return r.run(()=>{const o=()=>{r.run(()=>{let P,x,N=!!(t.nodes.value.length||t.edges.value.length);P=yr([e.modelValue,()=>{var U,D;return(D=(U=e.modelValue)==null?void 0:U.value)==null?void 0:D.length}],([U])=>{U&&Array.isArray(U)&&(x==null||x.pause(),t.setElements(U),!x&&!N&&U.length?N=!0:x==null||x.resume())}),x=yr([t.nodes,t.edges,()=>t.edges.value.length,()=>t.nodes.value.length],([U,D])=>{var O;(O=e.modelValue)!=null&&O.value&&Array.isArray(e.modelValue.value)&&(P==null||P.pause(),e.modelValue.value=[...U,...D],mn(()=>{P==null||P.resume()}))},{immediate:N}),bs(()=>{P==null||P.stop(),x==null||x.stop()})})},s=()=>{r.run(()=>{let P,x,N=!!t.nodes.value.length;P=yr([e.nodes,()=>{var U,D;return(D=(U=e.nodes)==null?void 0:U.value)==null?void 0:D.length}],([U])=>{U&&Array.isArray(U)&&(x==null||x.pause(),t.setNodes(U),!x&&!N&&U.length?N=!0:x==null||x.resume())}),x=yr([t.nodes,()=>t.nodes.value.length],([U])=>{var D;(D=e.nodes)!=null&&D.value&&Array.isArray(e.nodes.value)&&(P==null||P.pause(),e.nodes.value=[...U],mn(()=>{P==null||P.resume()}))},{immediate:N}),bs(()=>{P==null||P.stop(),x==null||x.stop()})})},i=()=>{r.run(()=>{let P,x,N=!!t.edges.value.length;P=yr([e.edges,()=>{var U,D;return(D=(U=e.edges)==null?void 0:U.value)==null?void 0:D.length}],([U])=>{U&&Array.isArray(U)&&(x==null||x.pause(),t.setEdges(U),!x&&!N&&U.length?N=!0:x==null||x.resume())}),x=yr([t.edges,()=>t.edges.value.length],([U])=>{var D;(D=e.edges)!=null&&D.value&&Array.isArray(e.edges.value)&&(P==null||P.pause(),e.edges.value=[...U],mn(()=>{P==null||P.resume()}))},{immediate:N}),bs(()=>{P==null||P.stop(),x==null||x.stop()})})},a=()=>{r.run(()=>{Fe(()=>n.maxZoom,()=>{n.maxZoom&&ln(n.maxZoom)&&t.setMaxZoom(n.maxZoom)},{immediate:!0})})},l=()=>{r.run(()=>{Fe(()=>n.minZoom,()=>{n.minZoom&&ln(n.minZoom)&&t.setMinZoom(n.minZoom)},{immediate:!0})})},u=()=>{r.run(()=>{Fe(()=>n.translateExtent,()=>{n.translateExtent&&ln(n.translateExtent)&&t.setTranslateExtent(n.translateExtent)},{immediate:!0})})},d=()=>{r.run(()=>{Fe(()=>n.nodeExtent,()=>{n.nodeExtent&&ln(n.nodeExtent)&&t.setNodeExtent(n.nodeExtent)},{immediate:!0})})},f=()=>{r.run(()=>{Fe(()=>n.applyDefault,()=>{ln(n.applyDefault)&&(t.applyDefault.value=n.applyDefault)},{immediate:!0})})},h=()=>{r.run(()=>{const P=async x=>{let N=x;typeof n.autoConnect=="function"&&(N=await n.autoConnect(x)),N!==!1&&t.addEdges([N])};Fe(()=>n.autoConnect,()=>{ln(n.autoConnect)&&(t.autoConnect.value=n.autoConnect)},{immediate:!0}),Fe(t.autoConnect,(x,N,U)=>{x?t.onConnect(P):t.hooks.value.connect.off(P),U(()=>{t.hooks.value.connect.off(P)})},{immediate:!0})})},p=()=>{const P=["id","modelValue","translateExtent","nodeExtent","edges","nodes","maxZoom","minZoom","applyDefault","autoConnect"];for(const x of Object.keys(n)){const N=x;if(!P.includes(N)){const U=We(()=>n[N]),D=t[N];sn(D)&&r.run(()=>{Fe(U,O=>{ln(O)&&(D.value=O)},{immediate:!0})})}}};(()=>{o(),s(),i(),l(),a(),u(),d(),f(),h(),p()})()}),()=>r.stop()}function my(){return{edgesChange:$e(),nodesChange:$e(),nodeDoubleClick:$e(),nodeClick:$e(),nodeMouseEnter:$e(),nodeMouseMove:$e(),nodeMouseLeave:$e(),nodeContextMenu:$e(),nodeDragStart:$e(),nodeDrag:$e(),nodeDragStop:$e(),nodesInitialized:$e(),miniMapNodeClick:$e(),miniMapNodeDoubleClick:$e(),miniMapNodeMouseEnter:$e(),miniMapNodeMouseMove:$e(),miniMapNodeMouseLeave:$e(),connect:$e(),connectStart:$e(),connectEnd:$e(),clickConnectStart:$e(),clickConnectEnd:$e(),paneReady:$e(),init:$e(),move:$e(),moveStart:$e(),moveEnd:$e(),selectionDragStart:$e(),selectionDrag:$e(),selectionDragStop:$e(),selectionContextMenu:$e(),selectionStart:$e(),selectionEnd:$e(),viewportChangeStart:$e(),viewportChange:$e(),viewportChangeEnd:$e(),paneScroll:$e(),paneClick:$e(),paneContextMenu:$e(),paneMouseEnter:$e(),paneMouseMove:$e(),paneMouseLeave:$e(),edgeContextMenu:$e(),edgeMouseEnter:$e(),edgeMouseMove:$e(),edgeMouseLeave:$e(),edgeDoubleClick:$e(),edgeClick:$e(),edgeUpdateStart:$e(),edgeUpdate:$e(),edgeUpdateEnd:$e(),updateNodeInternals:$e(),error:$e(e=>Zo(e.message))}}function vy(e,n){const t=Xt();Ad(()=>{for(const[o,s]of Object.entries(n.value)){const i=a=>{e(o,a)};s.setEmitter(i),Vo(s.removeEmitter),s.setHasEmitListeners(()=>r(o)),Vo(s.removeHasEmitListeners)}});function r(o){var s;const i=_y(o);return!!((s=t==null?void 0:t.vnode.props)==null?void 0:s[i])}}function _y(e){const[n,...t]=e.split(":");return`on${n.replace(/(?:^|-)(\w)/g,(o,s)=>s.toUpperCase())}${t.length?`:${t.join(":")}`:""}`}function pp(){return{vueFlowRef:null,viewportRef:null,nodes:[],edges:[],connectionLookup:new Map,nodeTypes:{},edgeTypes:{},initialized:!1,dimensions:{width:0,height:0},viewport:{x:0,y:0,zoom:1},d3Zoom:null,d3Selection:null,d3ZoomHandler:null,minZoom:.5,maxZoom:2,translateExtent:[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]],nodeExtent:[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]],selectionMode:Al.Full,paneDragging:!1,preventScrolling:!0,zoomOnScroll:!0,zoomOnPinch:!0,zoomOnDoubleClick:!0,panOnScroll:!1,panOnScrollSpeed:.5,panOnScrollMode:Eo.Free,paneClickDistance:0,panOnDrag:!0,edgeUpdaterRadius:10,onlyRenderVisibleElements:!1,defaultViewport:{x:0,y:0,zoom:1},nodesSelectionActive:!1,userSelectionActive:!1,userSelectionRect:null,defaultMarkerColor:"#b1b1b7",connectionLineStyle:{},connectionLineType:null,connectionLineOptions:{type:nr.Bezier,style:{}},connectionMode:zt.Loose,connectionStartHandle:null,connectionEndHandle:null,connectionClickStartHandle:null,connectionPosition:{x:Number.NaN,y:Number.NaN},connectionRadius:20,connectOnClick:!0,connectionStatus:null,isValidConnection:null,snapGrid:[15,15],snapToGrid:!1,edgesUpdatable:!1,edgesFocusable:!0,nodesFocusable:!0,nodesConnectable:!0,nodesDraggable:!0,nodeDragThreshold:1,elementsSelectable:!0,selectNodesOnDrag:!0,multiSelectionActive:!1,selectionKeyCode:"Shift",multiSelectionKeyCode:Uo()?"Meta":"Control",zoomActivationKeyCode:Uo()?"Meta":"Control",deleteKeyCode:"Backspace",panActivationKeyCode:"Space",hooks:my(),applyDefault:!0,autoConnect:!1,fitViewOnInit:!1,fitViewOnInitDone:!1,noDragClassName:"nodrag",noWheelClassName:"nowheel",noPanClassName:"nopan",defaultEdgeOptions:void 0,elevateEdgesOnSelect:!1,elevateNodesOnSelect:!0,autoPanOnNodeDrag:!0,autoPanOnConnect:!0,autoPanSpeed:15,disableKeyboardA11y:!1,ariaLiveMessage:""}}const gy=["id","vueFlowRef","viewportRef","initialized","modelValue","nodes","edges","maxZoom","minZoom","translateExtent","hooks","defaultEdgeOptions"];function yy(e,n,t){const r=py(e),o=g=>{const y=g??[];e.hooks.updateNodeInternals.trigger(y)},s=g=>Ng(g,e.nodes,e.edges),i=g=>Vg(g,e.nodes,e.edges),a=g=>tr(g,e.edges),l=({id:g,type:y,nodeId:w})=>{var F;const _=g?`-${y}-${g}`:`-${y}`;return Array.from(((F=e.connectionLookup.get(`${w}${_}`))==null?void 0:F.values())??[])},u=g=>{if(g)return n.value.get(g)},d=g=>{if(g)return t.value.get(g)},f=(g,y,w)=>{var F,_;const C=[];for(const E of g){const m={id:E.id,type:"position",dragging:w,from:E.from};if(y&&(m.position=E.position,E.parentNode)){const M=u(E.parentNode);m.position={x:m.position.x-(((F=M==null?void 0:M.computedPosition)==null?void 0:F.x)??0),y:m.position.y-(((_=M==null?void 0:M.computedPosition)==null?void 0:_.y)??0)}}C.push(m)}C!=null&&C.length&&e.hooks.nodesChange.trigger(C)},h=g=>{if(!e.vueFlowRef)return;const y=e.vueFlowRef.querySelector(".vue-flow__transformationpane");if(!y)return;const w=window.getComputedStyle(y),{m22:F}=new window.DOMMatrixReadOnly(w.transform),_=[];for(const C of g){const E=C,m=u(E.id);if(m){const M=Vi(E.nodeElement);if(!!(M.width&&M.height&&(m.dimensions.width!==M.width||m.dimensions.height!==M.height||E.forceUpdate))){const A=E.nodeElement.getBoundingClientRect();m.dimensions=M,m.handleBounds.source=fc("source",E.nodeElement,A,F,m.id),m.handleBounds.target=fc("target",E.nodeElement,A,F,m.id),_.push({id:m.id,type:"dimensions",dimensions:M})}}}!e.fitViewOnInitDone&&e.fitViewOnInit&&r.value.fitView().then(()=>{e.fitViewOnInitDone=!0}),_.length&&e.hooks.nodesChange.trigger(_)},p=(g,y)=>{const w=new Set,F=new Set;for(const E of g)ur(E)?w.add(E.id):Kt(E)&&F.add(E.id);const _=Ot(n.value,w,!0),C=Ot(t.value,F);if(e.multiSelectionActive){for(const E of w)_.push(Nt(E,y));for(const E of F)C.push(Nt(E,y))}_.length&&e.hooks.nodesChange.trigger(_),C.length&&e.hooks.edgesChange.trigger(C)},I=g=>{if(e.multiSelectionActive){const y=g.map(w=>Nt(w.id,!0));e.hooks.nodesChange.trigger(y);return}e.hooks.nodesChange.trigger(Ot(n.value,new Set(g.map(y=>y.id)),!0)),e.hooks.edgesChange.trigger(Ot(t.value))},P=g=>{if(e.multiSelectionActive){const y=g.map(w=>Nt(w.id,!0));e.hooks.edgesChange.trigger(y);return}e.hooks.edgesChange.trigger(Ot(t.value,new Set(g.map(y=>y.id)))),e.hooks.nodesChange.trigger(Ot(n.value,new Set,!0))},x=g=>{p(g,!0)},N=g=>{const w=(g||e.nodes).map(F=>(F.selected=!1,Nt(F.id,!1)));e.hooks.nodesChange.trigger(w)},U=g=>{const w=(g||e.edges).map(F=>(F.selected=!1,Nt(F.id,!1)));e.hooks.edgesChange.trigger(w)},D=g=>{if(!g||!g.length)return p([],!1);const y=g.reduce((w,F)=>{const _=Nt(F.id,!1);return ur(F)?w.nodes.push(_):w.edges.push(_),w},{nodes:[],edges:[]});y.nodes.length&&e.hooks.nodesChange.trigger(y.nodes),y.edges.length&&e.hooks.edgesChange.trigger(y.edges)},O=g=>{var y;(y=e.d3Zoom)==null||y.scaleExtent([g,e.maxZoom]),e.minZoom=g},Q=g=>{var y;(y=e.d3Zoom)==null||y.scaleExtent([e.minZoom,g]),e.maxZoom=g},ee=g=>{var y;(y=e.d3Zoom)==null||y.translateExtent(g),e.translateExtent=g},ne=g=>{e.nodeExtent=g,o()},ae=g=>{var y;(y=e.d3Zoom)==null||y.clickDistance(g)},re=g=>{e.nodesDraggable=g,e.nodesConnectable=g,e.elementsSelectable=g},X=g=>{const y=g instanceof Function?g(e.nodes):g;!e.initialized&&!y.length||(e.nodes=pc(y,u,e.hooks.error.trigger))},Z=g=>{const y=g instanceof Function?g(e.edges):g;if(!e.initialized&&!y.length)return;const w=ua(y,e.isValidConnection,u,d,e.hooks.error.trigger,e.defaultEdgeOptions,e.nodes,e.edges);la(e.connectionLookup,t.value,w),e.edges=w},k=g=>{const y=g instanceof Function?g([...e.nodes,...e.edges]):g;!e.initialized&&!y.length||(X(y.filter(ur)),Z(y.filter(Kt)))},G=g=>{let y=g instanceof Function?g(e.nodes):g;y=Array.isArray(y)?y:[y];const w=pc(y,u,e.hooks.error.trigger),F=[];for(const _ of w)F.push(oc(_));F.length&&e.hooks.nodesChange.trigger(F)},v=g=>{let y=g instanceof Function?g(e.edges):g;y=Array.isArray(y)?y:[y];const w=ua(y,e.isValidConnection,u,d,e.hooks.error.trigger,e.defaultEdgeOptions,e.nodes,e.edges),F=[];for(const _ of w)F.push(oc(_));F.length&&e.hooks.edgesChange.trigger(F)},K=(g,y=!0,w=!1)=>{const F=g instanceof Function?g(e.nodes):g,_=Array.isArray(F)?F:[F],C=[],E=[];function m(q){const A=a(q);for(const V of A)(!ln(V.deletable)||V.deletable)&&E.push(ic(V.id,V.source,V.target,V.sourceHandle,V.targetHandle))}function M(q){const A=[];for(const V of e.nodes)V.parentNode===q&&A.push(V);if(A.length){for(const V of A)C.push(sc(V.id));y&&m(A);for(const V of A)M(V.id)}}for(const q of _){const A=typeof q=="string"?u(q):q;A&&(ln(A.deletable)&&!A.deletable||(C.push(sc(A.id)),y&&m([A]),w&&M(A.id)))}E.length&&e.hooks.edgesChange.trigger(E),C.length&&e.hooks.nodesChange.trigger(C)},S=g=>{const y=g instanceof Function?g(e.edges):g,w=Array.isArray(y)?y:[y],F=[];for(const _ of w){const C=typeof _=="string"?d(_):_;C&&(ln(C.deletable)&&!C.deletable||F.push(ic(typeof _=="string"?_:_.id,C.source,C.target,C.sourceHandle,C.targetHandle)))}e.hooks.edgesChange.trigger(F)},z=(g,y,w=!0)=>{const F=d(g.id);if(!F)return!1;const _=e.edges.indexOf(F),C=ty(g,y,F,w,e.hooks.error.trigger);if(C){const[E]=ua([C],e.isValidConnection,u,d,e.hooks.error.trigger,e.defaultEdgeOptions,e.nodes,e.edges);return e.edges=e.edges.map((m,M)=>M===_?E:m),la(e.connectionLookup,t.value,[E]),E}return!1},L=(g,y,w={replace:!1})=>{const F=d(g);if(!F)return;const _=typeof y=="function"?y(F):y;F.data=w.replace?_:{...F.data,..._}},W=g=>rc(g,e.nodes),Y=g=>{const y=rc(g,e.edges);return la(e.connectionLookup,t.value,y),y},se=(g,y,w={replace:!1})=>{const F=u(g);if(!F)return;const _=typeof y=="function"?y(F):y;w.replace?e.nodes.splice(e.nodes.indexOf(F),1,_):Object.assign(F,_)},oe=(g,y,w={replace:!1})=>{const F=u(g);if(!F)return;const _=typeof y=="function"?y(F):y;F.data=w.replace?_:{...F.data,..._}},me=(g,y,w=!1)=>{w?e.connectionClickStartHandle=g:e.connectionStartHandle=g,e.connectionEndHandle=null,e.connectionStatus=null,y&&(e.connectionPosition=y)},be=(g,y=null,w=null)=>{e.connectionStartHandle&&(e.connectionPosition=g,e.connectionEndHandle=y,e.connectionStatus=w)},ue=(g,y)=>{e.connectionPosition={x:Number.NaN,y:Number.NaN},e.connectionEndHandle=null,e.connectionStatus=null,y?e.connectionClickStartHandle=null:e.connectionStartHandle=null},pe=g=>{const y=kg(g),w=y?null:uo(g)?g:u(g.id);return!y&&!w?[null,null,y]:[y?g:ei(w),w,y]},_e=(g,y=!0,w=e.nodes)=>{const[F,_,C]=pe(g);if(!F)return[];const E=[];for(const m of w||e.nodes){if(!C&&(m.id===_.id||!m.computedPosition))continue;const M=ei(m),q=ni(M,F);(y&&q>0||q>=M.width*M.height||q>=Number(F.width)*Number(F.height))&&E.push(m)}return E},ke=(g,y,w=!0)=>{const[F]=pe(g);if(!F)return!1;const _=ni(F,y);return w&&_>0||_>=Number(F.width)*Number(F.height)},Ne=g=>{const{viewport:y,dimensions:w,d3Zoom:F,d3Selection:_,translateExtent:C}=e;if(!F||!_||!g.x&&!g.y)return!1;const E=Br.translate(y.x+g.x,y.y+g.y).scale(y.zoom),m=[[0,0],[w.width,w.height]],M=F.constrain()(E,m,C),q=e.viewport.x!==M.x||e.viewport.y!==M.y||e.viewport.zoom!==M.k;return F.transform(_,M),q},De=g=>{const y=g instanceof Function?g(e):g,w=["d3Zoom","d3Selection","d3ZoomHandler","viewportRef","vueFlowRef","dimensions","hooks"];ln(y.defaultEdgeOptions)&&(e.defaultEdgeOptions=y.defaultEdgeOptions);const F=y.modelValue||y.nodes||y.edges?[]:void 0;F&&(y.modelValue&&F.push(...y.modelValue),y.nodes&&F.push(...y.nodes),y.edges&&F.push(...y.edges),k(F));const _=()=>{ln(y.maxZoom)&&Q(y.maxZoom),ln(y.minZoom)&&O(y.minZoom),ln(y.translateExtent)&&ee(y.translateExtent)};for(const C of Object.keys(y)){const E=C,m=y[E];![...gy,...w].includes(E)&&ln(m)&&(e[E]=m)}Aa(()=>e.d3Zoom).not.toBeNull().then(_),e.initialized||(e.initialized=!0)};return{updateNodePositions:f,updateNodeDimensions:h,setElements:k,setNodes:X,setEdges:Z,addNodes:G,addEdges:v,removeNodes:K,removeEdges:S,findNode:u,findEdge:d,updateEdge:z,updateEdgeData:L,updateNode:se,updateNodeData:oe,applyEdgeChanges:Y,applyNodeChanges:W,addSelectedElements:x,addSelectedNodes:I,addSelectedEdges:P,setMinZoom:O,setMaxZoom:Q,setTranslateExtent:ee,setNodeExtent:ne,setPaneClickDistance:ae,removeSelectedElements:D,removeSelectedNodes:N,removeSelectedEdges:U,startConnection:me,updateConnection:be,endConnection:ue,setInteractive:re,setState:De,getIntersectingNodes:_e,getIncomers:s,getOutgoers:i,getConnectedEdges:a,getHandleConnections:l,isNodeIntersecting:ke,panBy:Ne,fitView:g=>r.value.fitView(g),zoomIn:g=>r.value.zoomIn(g),zoomOut:g=>r.value.zoomOut(g),zoomTo:(g,y)=>r.value.zoomTo(g,y),setViewport:(g,y)=>r.value.setViewport(g,y),setTransform:(g,y)=>r.value.setTransform(g,y),getViewport:()=>r.value.getViewport(),getTransform:()=>r.value.getTransform(),setCenter:(g,y,w)=>r.value.setCenter(g,y,w),fitBounds:(g,y)=>r.value.fitBounds(g,y),project:g=>r.value.project(g),screenToFlowCoordinate:g=>r.value.screenToFlowCoordinate(g),flowToScreenCoordinate:g=>r.value.flowToScreenCoordinate(g),toObject:()=>{const g=[],y=[];for(const w of e.nodes){const{computedPosition:F,handleBounds:_,selected:C,dimensions:E,isParent:m,resizing:M,dragging:q,events:A,...V}=w;g.push(V)}for(const w of e.edges){const{selected:F,sourceNode:_,targetNode:C,events:E,...m}=w;y.push(m)}return JSON.parse(JSON.stringify({nodes:g,edges:y,position:[e.viewport.x,e.viewport.y],zoom:e.viewport.zoom,viewport:e.viewport}))},fromObject:g=>new Promise(y=>{const{nodes:w,edges:F,position:_,zoom:C,viewport:E}=g;w&&X(w),F&&Z(F);const[m,M]=E!=null&&E.x&&(E!=null&&E.y)?[E.x,E.y]:_??[null,null];if(m&&M){const q=(E==null?void 0:E.zoom)||C||e.viewport.zoom;return Aa(()=>r.value.viewportInitialized).toBe(!0).then(()=>{r.value.setViewport({x:m,y:M,zoom:q}).then(()=>{y(!0)})})}else y(!0)}),updateNodeInternals:o,viewportHelper:r,$reset:()=>{const g=pp();if(e.edges=[],e.nodes=[],e.d3Zoom&&e.d3Selection){const y=Br.translate(g.defaultViewport.x??0,g.defaultViewport.y??0).scale(pr(g.defaultViewport.zoom??1,g.minZoom,g.maxZoom)),w=e.viewportRef.getBoundingClientRect(),F=[[0,0],[w.width,w.height]],_=e.d3Zoom.constrain()(y,F,g.translateExtent);e.d3Zoom.transform(e.d3Selection,_)}De(g)},$destroy:()=>{}}}const Cy=["data-id","data-handleid","data-nodeid","data-handlepos"],Sy={name:"Handle",compatConfig:{MODE:3}},Ht=Be({...Sy,props:{id:{default:null},type:{},position:{default:()=>xe.Top},isValidConnection:{type:Function},connectable:{type:[Boolean,Number,String,Function],default:void 0},connectableStart:{type:Boolean,default:!0},connectableEnd:{type:Boolean,default:!0}},setup(e,{expose:n}){const t=_h(e,["position","connectable","connectableStart","connectableEnd","id"]),r=We(()=>t.type??"source"),o=We(()=>t.isValidConnection??null),{id:s,connectionStartHandle:i,connectionClickStartHandle:a,connectionEndHandle:l,vueFlowRef:u,nodesConnectable:d,noDragClassName:f,noPanClassName:h}=Je(),{id:p,node:I,nodeEl:P,connectedEdges:x}=dp(),N=Ee(),U=We(()=>typeof e.connectableStart<"u"?e.connectableStart:!0),D=We(()=>typeof e.connectableEnd<"u"?e.connectableEnd:!0),O=We(()=>{var Z,k,G,v,K,S;return((Z=i.value)==null?void 0:Z.nodeId)===p&&((k=i.value)==null?void 0:k.id)===e.id&&((G=i.value)==null?void 0:G.type)===r.value||((v=l.value)==null?void 0:v.nodeId)===p&&((K=l.value)==null?void 0:K.id)===e.id&&((S=l.value)==null?void 0:S.type)===r.value}),Q=We(()=>{var Z,k,G;return((Z=a.value)==null?void 0:Z.nodeId)===p&&((k=a.value)==null?void 0:k.id)===e.id&&((G=a.value)==null?void 0:G.type)===r.value}),{handlePointerDown:ee,handleClick:ne}=cp({nodeId:p,handleId:e.id,isValidConnection:o,type:r}),ae=ie(()=>typeof e.connectable=="string"&&e.connectable==="single"?!x.value.some(Z=>{const k=Z[`${r.value}Handle`];return Z[r.value]!==p?!1:k?k===e.id:!0}):typeof e.connectable=="number"?x.value.filter(Z=>{const k=Z[`${r.value}Handle`];return Z[r.value]!==p?!1:k?k===e.id:!0}).length<e.connectable:typeof e.connectable=="function"?e.connectable(I,x.value):ln(e.connectable)?e.connectable:d.value);Mn(()=>{var Z;if(!I.dimensions.width||!I.dimensions.height)return;const k=(Z=I.handleBounds[r.value])==null?void 0:Z.find(W=>W.id===e.id);if(!u.value||k)return;const G=u.value.querySelector(".vue-flow__transformationpane");if(!P.value||!N.value||!G||!e.id)return;const v=P.value.getBoundingClientRect(),K=N.value.getBoundingClientRect(),S=window.getComputedStyle(G),{m22:z}=new window.DOMMatrixReadOnly(S.transform),L={id:e.id,position:e.position,x:(K.left-v.left)/z,y:(K.top-v.top)/z,type:r.value,nodeId:p,...Vi(N.value)};I.handleBounds[r.value]=[...I.handleBounds[r.value]??[],L]});function re(Z){const k=Bl(Z);ae.value&&U.value&&(k&&Z.button===0||!k)&&ee(Z)}function X(Z){!p||!a.value&&!U.value||ae.value&&ne(Z)}return n({handleClick:ne,handlePointerDown:ee,onClick:X,onPointerDown:re}),(Z,k)=>(b(),T("div",{ref_key:"handle",ref:N,"data-id":`${le(s)}-${le(p)}-${e.id}-${r.value}`,"data-handleid":e.id,"data-nodeid":le(p),"data-handlepos":Z.position,class:fe(["vue-flow__handle",[`vue-flow__handle-${Z.position}`,`vue-flow__handle-${e.id}`,le(f),le(h),r.value,{connectable:ae.value,connecting:Q.value,connectablestart:U.value,connectableend:D.value,connectionindicator:ae.value&&(U.value&&!O.value||D.value&&O.value)}]]),onMousedown:re,onTouchstartPassive:re,onClick:X},[tn(Z.$slots,"default",{id:Z.id})],42,Cy))}}),Fi=function({sourcePosition:e=xe.Bottom,targetPosition:n=xe.Top,label:t,connectable:r=!0,isValidTargetPos:o,isValidSourcePos:s,data:i}){const a=i.label??t;return[Ye(Ht,{type:"target",position:n,connectable:r,isValidConnection:o}),typeof a!="string"&&a?Ye(a):Ye(de,[a]),Ye(Ht,{type:"source",position:e,connectable:r,isValidConnection:s})]};Fi.props=["sourcePosition","targetPosition","label","isValidTargetPos","isValidSourcePos","connectable","data"];Fi.inheritAttrs=!1;Fi.compatConfig={MODE:3};const by=Fi,Oi=function({targetPosition:e=xe.Top,label:n,connectable:t=!0,isValidTargetPos:r,data:o}){const s=o.label??n;return[Ye(Ht,{type:"target",position:e,connectable:t,isValidConnection:r}),typeof s!="string"&&s?Ye(s):Ye(de,[s])]};Oi.props=["targetPosition","label","isValidTargetPos","connectable","data"];Oi.inheritAttrs=!1;Oi.compatConfig={MODE:3};const Ey=Oi,Bi=function({sourcePosition:e=xe.Bottom,label:n,connectable:t=!0,isValidSourcePos:r,data:o}){const s=o.label??n;return[typeof s!="string"&&s?Ye(s):Ye(de,[s]),Ye(Ht,{type:"source",position:e,connectable:t,isValidConnection:r})]};Bi.props=["sourcePosition","label","isValidSourcePos","connectable","data"];Bi.inheritAttrs=!1;Bi.compatConfig={MODE:3};const wy=Bi,Iy=["transform"],Py=["width","height","x","y","rx","ry"],$y=["y"],xy={name:"EdgeText",compatConfig:{MODE:3}},Dy=Be({...xy,props:{x:{},y:{},label:{},labelStyle:{default:()=>({})},labelShowBg:{type:Boolean,default:!0},labelBgStyle:{default:()=>({})},labelBgPadding:{default:()=>[2,4]},labelBgBorderRadius:{default:2}},setup(e){const n=Ee({x:0,y:0,width:0,height:0}),t=Ee(null),r=ie(()=>`translate(${e.x-n.value.width/2} ${e.y-n.value.height/2})`);Mn(o),Fe([()=>e.x,()=>e.y,t,()=>e.label],o);function o(){if(!t.value)return;const s=t.value.getBBox();(s.width!==n.value.width||s.height!==n.value.height)&&(n.value=s)}return(s,i)=>(b(),T("g",{transform:r.value,class:"vue-flow__edge-textwrapper"},[s.labelShowBg?(b(),T("rect",{key:0,class:"vue-flow__edge-textbg",width:`${n.value.width+2*s.labelBgPadding[0]}px`,height:`${n.value.height+2*s.labelBgPadding[1]}px`,x:-s.labelBgPadding[0],y:-s.labelBgPadding[1],style:Ve(s.labelBgStyle),rx:s.labelBgBorderRadius,ry:s.labelBgBorderRadius},null,12,Py)):Ce("",!0),c("text",Mo(s.$attrs,{ref_key:"el",ref:t,class:"vue-flow__edge-text",y:n.value.height/2,dy:"0.3em",style:s.labelStyle}),[tn(s.$slots,"default",{},()=>[typeof s.label!="string"?(b(),Xe(er(s.label),{key:0})):(b(),T(de,{key:1},[Pe(R(s.label),1)],64))])],16,$y)],8,Iy))}}),My=["id","d","marker-end","marker-start"],ky=["d","stroke-width"],Ty={name:"BaseEdge",inheritAttrs:!1,compatConfig:{MODE:3}},Ri=Be({...Ty,props:{id:{},labelX:{},labelY:{},path:{},label:{},markerStart:{},markerEnd:{},interactionWidth:{default:20},labelStyle:{},labelShowBg:{type:Boolean},labelBgStyle:{},labelBgPadding:{},labelBgBorderRadius:{}},setup(e,{expose:n}){const t=Ee(null),r=Ee(null),o=Ee(null),s=bl();return n({pathEl:t,interactionEl:r,labelEl:o}),(i,a)=>(b(),T(de,null,[c("path",Mo(le(s),{id:i.id,ref_key:"pathEl",ref:t,d:i.path,class:"vue-flow__edge-path","marker-end":i.markerEnd,"marker-start":i.markerStart}),null,16,My),i.interactionWidth?(b(),T("path",{key:0,ref_key:"interactionEl",ref:r,fill:"none",d:i.path,"stroke-width":i.interactionWidth,"stroke-opacity":0,class:"vue-flow__edge-interaction"},null,8,ky)):Ce("",!0),i.label&&i.labelX&&i.labelY?(b(),Xe(Dy,{key:1,ref_key:"labelEl",ref:o,x:i.labelX,y:i.labelY,label:i.label,"label-show-bg":i.labelShowBg,"label-bg-style":i.labelBgStyle,"label-bg-padding":i.labelBgPadding,"label-bg-border-radius":i.labelBgBorderRadius,"label-style":i.labelStyle},null,8,["x","y","label","label-show-bg","label-bg-style","label-bg-padding","label-bg-border-radius","label-style"])):Ce("",!0)],64))}});function hp({sourceX:e,sourceY:n,targetX:t,targetY:r}){const o=Math.abs(t-e)/2,s=t<e?t+o:t-o,i=Math.abs(r-n)/2,a=r<n?r+i:r-i;return[s,a,o,i]}function mp({sourceX:e,sourceY:n,targetX:t,targetY:r,sourceControlX:o,sourceControlY:s,targetControlX:i,targetControlY:a}){const l=e*.125+o*.375+i*.375+t*.125,u=n*.125+s*.375+a*.375+r*.125,d=Math.abs(l-e),f=Math.abs(u-n);return[l,u,d,f]}function hs(e,n){return e>=0?.5*e:n*25*Math.sqrt(-e)}function _c({pos:e,x1:n,y1:t,x2:r,y2:o,c:s}){let i,a;switch(e){case xe.Left:i=n-hs(n-r,s),a=t;break;case xe.Right:i=n+hs(r-n,s),a=t;break;case xe.Top:i=n,a=t-hs(t-o,s);break;case xe.Bottom:i=n,a=t+hs(o-t,s);break}return[i,a]}function vp(e){const{sourceX:n,sourceY:t,sourcePosition:r=xe.Bottom,targetX:o,targetY:s,targetPosition:i=xe.Top,curvature:a=.25}=e,[l,u]=_c({pos:r,x1:n,y1:t,x2:o,y2:s,c:a}),[d,f]=_c({pos:i,x1:o,y1:s,x2:n,y2:t,c:a}),[h,p,I,P]=mp({sourceX:n,sourceY:t,targetX:o,targetY:s,sourceControlX:l,sourceControlY:u,targetControlX:d,targetControlY:f});return[`M${n},${t} C${l},${u} ${d},${f} ${o},${s}`,h,p,I,P]}function gc({pos:e,x1:n,y1:t,x2:r,y2:o}){let s,i;switch(e){case xe.Left:case xe.Right:s=.5*(n+r),i=t;break;case xe.Top:case xe.Bottom:s=n,i=.5*(t+o);break}return[s,i]}function _p(e){const{sourceX:n,sourceY:t,sourcePosition:r=xe.Bottom,targetX:o,targetY:s,targetPosition:i=xe.Top}=e,[a,l]=gc({pos:r,x1:n,y1:t,x2:o,y2:s}),[u,d]=gc({pos:i,x1:o,y1:s,x2:n,y2:t}),[f,h,p,I]=mp({sourceX:n,sourceY:t,targetX:o,targetY:s,sourceControlX:a,sourceControlY:l,targetControlX:u,targetControlY:d});return[`M${n},${t} C${a},${l} ${u},${d} ${o},${s}`,f,h,p,I]}const yc={[xe.Left]:{x:-1,y:0},[xe.Right]:{x:1,y:0},[xe.Top]:{x:0,y:-1},[xe.Bottom]:{x:0,y:1}};function Vy({source:e,sourcePosition:n=xe.Bottom,target:t}){return n===xe.Left||n===xe.Right?e.x<t.x?{x:1,y:0}:{x:-1,y:0}:e.y<t.y?{x:0,y:1}:{x:0,y:-1}}function Cc(e,n){return Math.sqrt((n.x-e.x)**2+(n.y-e.y)**2)}function Ny({source:e,sourcePosition:n=xe.Bottom,target:t,targetPosition:r=xe.Top,center:o,offset:s}){const i=yc[n],a=yc[r],l={x:e.x+i.x*s,y:e.y+i.y*s},u={x:t.x+a.x*s,y:t.y+a.y*s},d=Vy({source:l,sourcePosition:n,target:u}),f=d.x!==0?"x":"y",h=d[f];let p,I,P;const x={x:0,y:0},N={x:0,y:0},[U,D,O,Q]=hp({sourceX:e.x,sourceY:e.y,targetX:t.x,targetY:t.y});if(i[f]*a[f]===-1){I=o.x??U,P=o.y??D;const ne=[{x:I,y:l.y},{x:I,y:u.y}],ae=[{x:l.x,y:P},{x:u.x,y:P}];i[f]===h?p=f==="x"?ne:ae:p=f==="x"?ae:ne}else{const ne=[{x:l.x,y:u.y}],ae=[{x:u.x,y:l.y}];if(f==="x"?p=i.x===h?ae:ne:p=i.y===h?ne:ae,n===r){const G=Math.abs(e[f]-t[f]);if(G<=s){const v=Math.min(s-1,s-G);i[f]===h?x[f]=(l[f]>e[f]?-1:1)*v:N[f]=(u[f]>t[f]?-1:1)*v}}if(n!==r){const G=f==="x"?"y":"x",v=i[f]===a[G],K=l[G]>u[G],S=l[G]<u[G];(i[f]===1&&(!v&&K||v&&S)||i[f]!==1&&(!v&&S||v&&K))&&(p=f==="x"?ne:ae)}const re={x:l.x+x.x,y:l.y+x.y},X={x:u.x+N.x,y:u.y+N.y},Z=Math.max(Math.abs(re.x-p[0].x),Math.abs(X.x-p[0].x)),k=Math.max(Math.abs(re.y-p[0].y),Math.abs(X.y-p[0].y));Z>=k?(I=(re.x+X.x)/2,P=p[0].y):(I=p[0].x,P=(re.y+X.y)/2)}return[[e,{x:l.x+x.x,y:l.y+x.y},...p,{x:u.x+N.x,y:u.y+N.y},t],I,P,O,Q]}function Ay(e,n,t,r){const o=Math.min(Cc(e,n)/2,Cc(n,t)/2,r),{x:s,y:i}=n;if(e.x===s&&s===t.x||e.y===i&&i===t.y)return`L${s} ${i}`;if(e.y===i){const u=e.x<t.x?-1:1,d=e.y<t.y?1:-1;return`L ${s+o*u},${i}Q ${s},${i} ${s},${i+o*d}`}const a=e.x<t.x?1:-1,l=e.y<t.y?-1:1;return`L ${s},${i+o*l}Q ${s},${i} ${s+o*a},${i}`}function qa(e){const{sourceX:n,sourceY:t,sourcePosition:r=xe.Bottom,targetX:o,targetY:s,targetPosition:i=xe.Top,borderRadius:a=5,centerX:l,centerY:u,offset:d=20}=e,[f,h,p,I,P]=Ny({source:{x:n,y:t},sourcePosition:r,target:{x:o,y:s},targetPosition:i,center:{x:l,y:u},offset:d});return[f.reduce((N,U,D)=>{let O;return D>0&&D<f.length-1?O=Ay(f[D-1],U,f[D+1],a):O=`${D===0?"M":"L"}${U.x} ${U.y}`,N+=O,N},""),h,p,I,P]}function Fy(e){const{sourceX:n,sourceY:t,targetX:r,targetY:o}=e,[s,i,a,l]=hp({sourceX:n,sourceY:t,targetX:r,targetY:o});return[`M ${n},${t}L ${r},${o}`,s,i,a,l]}const Oy=Be({name:"StraightEdge",props:["label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","markerEnd","markerStart","interactionWidth"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=Fy(e);return Ye(Ri,{path:t,labelX:r,labelY:o,...n,...e})}}}),By=Oy,Ry=Be({name:"SmoothStepEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","borderRadius","markerEnd","markerStart","interactionWidth","offset"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=qa({...e,sourcePosition:e.sourcePosition??xe.Bottom,targetPosition:e.targetPosition??xe.Top});return Ye(Ri,{path:t,labelX:r,labelY:o,...n,...e})}}}),gp=Ry,Ly=Be({name:"StepEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","markerEnd","markerStart","interactionWidth"],setup(e,{attrs:n}){return()=>Ye(gp,{...e,...n,borderRadius:0})}}),Uy=Ly,Hy=Be({name:"BezierEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","curvature","markerEnd","markerStart","interactionWidth"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=vp({...e,sourcePosition:e.sourcePosition??xe.Bottom,targetPosition:e.targetPosition??xe.Top});return Ye(Ri,{path:t,labelX:r,labelY:o,...n,...e})}}}),zy=Hy,Ky=Be({name:"SimpleBezierEdge",props:["sourcePosition","targetPosition","label","labelStyle","labelShowBg","labelBgStyle","labelBgPadding","labelBgBorderRadius","sourceY","sourceX","targetX","targetY","markerEnd","markerStart","interactionWidth"],compatConfig:{MODE:3},setup(e,{attrs:n}){return()=>{const[t,r,o]=_p({...e,sourcePosition:e.sourcePosition??xe.Bottom,targetPosition:e.targetPosition??xe.Top});return Ye(Ri,{path:t,labelX:r,labelY:o,...n,...e})}}}),Wy=Ky,Gy={input:wy,default:by,output:Ey},Xy={default:zy,straight:By,step:Uy,smoothstep:gp,simplebezier:Wy};function Yy(e,n,t){const r=ie(()=>P=>n.value.get(P)),o=ie(()=>P=>t.value.get(P)),s=ie(()=>{const P={...Xy,...e.edgeTypes},x=Object.keys(P);for(const N of e.edges)N.type&&!x.includes(N.type)&&(P[N.type]=N.type);return P}),i=ie(()=>{const P={...Gy,...e.nodeTypes},x=Object.keys(P);for(const N of e.nodes)N.type&&!x.includes(N.type)&&(P[N.type]=N.type);return P}),a=ie(()=>e.onlyRenderVisibleElements?ep(e.nodes,{x:0,y:0,width:e.dimensions.width,height:e.dimensions.height},e.viewport,!0):e.nodes),l=ie(()=>{if(e.onlyRenderVisibleElements){const P=[];for(const x of e.edges){const N=n.value.get(x.source),U=n.value.get(x.target);Kg({sourcePos:N.computedPosition||{x:0,y:0},targetPos:U.computedPosition||{x:0,y:0},sourceWidth:N.dimensions.width,sourceHeight:N.dimensions.height,targetWidth:U.dimensions.width,targetHeight:U.dimensions.height,width:e.dimensions.width,height:e.dimensions.height,viewport:e.viewport})&&P.push(x)}return P}return e.edges}),u=ie(()=>[...a.value,...l.value]),d=ie(()=>{const P=[];for(const x of e.nodes)x.selected&&P.push(x);return P}),f=ie(()=>{const P=[];for(const x of e.edges)x.selected&&P.push(x);return P}),h=ie(()=>[...d.value,...f.value]),p=ie(()=>{const P=[];for(const x of e.nodes)x.dimensions.width&&x.dimensions.height&&x.handleBounds!==void 0&&P.push(x);return P}),I=ie(()=>a.value.length>0&&p.value.length===a.value.length);return{getNode:r,getEdge:o,getElements:u,getEdgeTypes:s,getNodeTypes:i,getEdges:l,getNodes:a,getSelectedElements:h,getSelectedNodes:d,getSelectedEdges:f,getNodesInitialized:p,areNodesInitialized:I}}class rr{constructor(){this.currentId=0,this.flows=new Map}static getInstance(){var n;const t=(n=Xt())==null?void 0:n.appContext.app,r=(t==null?void 0:t.config.globalProperties.$vueFlowStorage)??rr.instance;return rr.instance=r??new rr,t&&(t.config.globalProperties.$vueFlowStorage=rr.instance),rr.instance}set(n,t){return this.flows.set(n,t)}get(n){return this.flows.get(n)}remove(n){return this.flows.delete(n)}create(n,t){const r=pp(),o=ot(r),s={};for(const[h,p]of Object.entries(o.hooks)){const I=`on${h.charAt(0).toUpperCase()+h.slice(1)}`;s[I]=p.on}const i={};for(const[h,p]of Object.entries(o.hooks))i[h]=p.trigger;const a=ie(()=>{const h=new Map;for(const p of o.nodes)h.set(p.id,p);return h}),l=ie(()=>{const h=new Map;for(const p of o.edges)h.set(p.id,p);return h}),u=Yy(o,a,l),d=yy(o,a,l);d.setState({...o,...t});const f={...s,...u,...d,...L1(o),nodeLookup:a,edgeLookup:l,emits:i,id:n,vueFlowVersion:"1.48.2",$destroy:()=>{this.remove(n)}};return this.set(n,f),f}getId(){return`vue-flow-${this.currentId++}`}}function Je(e){const n=rr.getInstance(),t=pl(),r=typeof e=="object",o=r?e:{id:e},s=o.id,i=s??(t==null?void 0:t.vueFlowId);let a;if(t){const l=Tn(vc,null);typeof l<"u"&&l!==null&&(!i||l.id===i)&&(a=l)}if(a||i&&(a=n.get(i)),!a||i&&a.id!==i){const l=s??n.getId(),u=n.create(l,o);a=u,(t??ad(!0)).run(()=>{Fe(u.applyDefault,(f,h,p)=>{const I=x=>{u.applyNodeChanges(x)},P=x=>{u.applyEdgeChanges(x)};f?(u.onNodesChange(I),u.onEdgesChange(P)):(u.hooks.value.nodesChange.off(I),u.hooks.value.edgesChange.off(P)),p(()=>{u.hooks.value.nodesChange.off(I),u.hooks.value.edgesChange.off(P)})},{immediate:!0}),Vo(()=>{if(a){const f=n.get(a.id);f?f.$destroy():Zo(`No store instance found for id ${a.id} in storage.`)}})})}else r&&a.setState(o);if(t&&(lt(vc,a),t.vueFlowId=a.id),r){const l=Xt();(l==null?void 0:l.type.name)!=="VueFlow"&&a.emits.error(new dn(un.USEVUEFLOW_OPTIONS))}return a}function qy(e){const{emits:n,dimensions:t}=Je();let r;Mn(()=>{const o=()=>{var s,i;if(!e.value||!(((i=(s=e.value).checkVisibility)==null?void 0:i.call(s))??!0))return;const a=Vi(e.value);(a.width===0||a.height===0)&&n.error(new dn(un.MISSING_VIEWPORT_DIMENSIONS)),t.value={width:a.width||500,height:a.height||500}};o(),window.addEventListener("resize",o),e.value&&(r=new ResizeObserver(()=>o()),r.observe(e.value)),Wr(()=>{window.removeEventListener("resize",o),r&&e.value&&r.unobserve(e.value)})})}const jy={name:"UserSelection",compatConfig:{MODE:3}},Zy=Be({...jy,props:{userSelectionRect:{}},setup(e){return(n,t)=>(b(),T("div",{class:"vue-flow__selection vue-flow__container",style:Ve({width:`${n.userSelectionRect.width}px`,height:`${n.userSelectionRect.height}px`,transform:`translate(${n.userSelectionRect.x}px, ${n.userSelectionRect.y}px)`})},null,4))}}),Jy=["tabIndex"],Qy={name:"NodesSelection",compatConfig:{MODE:3}},e2=Be({...Qy,setup(e){const{emits:n,viewport:t,getSelectedNodes:r,noPanClassName:o,disableKeyboardA11y:s,userSelectionActive:i}=Je(),a=fp(),l=Ee(null),u=up({el:l,onStart(I){n.selectionDragStart(I),n.nodeDragStart(I)},onDrag(I){n.selectionDrag(I),n.nodeDrag(I)},onStop(I){n.selectionDragStop(I),n.nodeDragStop(I)}});Mn(()=>{var I;s.value||(I=l.value)==null||I.focus({preventScroll:!0})});const d=ie(()=>Fl(r.value)),f=ie(()=>({width:`${d.value.width}px`,height:`${d.value.height}px`,top:`${d.value.y}px`,left:`${d.value.x}px`}));function h(I){n.selectionContextMenu({event:I,nodes:r.value})}function p(I){s.value||Mr[I.key]&&(I.preventDefault(),a({x:Mr[I.key].x,y:Mr[I.key].y},I.shiftKey))}return(I,P)=>!le(i)&&d.value.width&&d.value.height?(b(),T("div",{key:0,class:fe(["vue-flow__nodesselection vue-flow__container",le(o)]),style:Ve({transform:`translate(${le(t).x}px,${le(t).y}px) scale(${le(t).zoom})`})},[c("div",{ref_key:"el",ref:l,class:fe([{dragging:le(u)},"vue-flow__nodesselection-rect"]),style:Ve(f.value),tabIndex:le(s)?void 0:-1,onContextmenu:h,onKeydown:p},null,46,Jy)],6)):Ce("",!0)}});function n2(e,n){return{x:e.clientX-n.left,y:e.clientY-n.top}}const t2={name:"Pane",compatConfig:{MODE:3}},r2=Be({...t2,props:{isSelecting:{type:Boolean},selectionKeyPressed:{type:Boolean}},setup(e){const{vueFlowRef:n,nodes:t,viewport:r,emits:o,userSelectionActive:s,removeSelectedElements:i,userSelectionRect:a,elementsSelectable:l,nodesSelectionActive:u,getSelectedEdges:d,getSelectedNodes:f,removeNodes:h,removeEdges:p,selectionMode:I,deleteKeyCode:P,multiSelectionKeyCode:x,multiSelectionActive:N,edgeLookup:U,nodeLookup:D,connectionLookup:O,defaultEdgeOptions:Q,connectionStartHandle:ee,panOnDrag:ne}=Je(),ae=Ut(null),re=Ut(new Set),X=Ut(new Set),Z=Ut(null),k=We(()=>l.value&&(e.isSelecting||s.value)),G=We(()=>ee.value!==null);let v=!1,K=!1;const S=wo(P,{actInsideInputWithModifier:!1}),z=wo(x);Fe(S,ue=>{ue&&(h(f.value),p(d.value),u.value=!1)}),Fe(z,ue=>{N.value=ue});function L(ue,pe){return _e=>{_e.target===pe&&(ue==null||ue(_e))}}function W(ue){if(v||G.value){v=!1;return}o.paneClick(ue),i(),u.value=!1}function Y(ue){var pe;if(Array.isArray(ne.value)&&((pe=ne.value)!=null&&pe.includes(2))){ue.preventDefault();return}o.paneContextMenu(ue)}function se(ue){o.paneScroll(ue)}function oe(ue){var pe,_e,ke;if(Z.value=((pe=n.value)==null?void 0:pe.getBoundingClientRect())??null,!l.value||!e.isSelecting||ue.button!==0||ue.target!==ae.value||!Z.value)return;(ke=(_e=ue.target)==null?void 0:_e.setPointerCapture)==null||ke.call(_e,ue.pointerId);const{x:Ne,y:De}=n2(ue,Z.value);K=!0,v=!1,i(),a.value={width:0,height:0,startX:Ne,startY:De,x:Ne,y:De},o.selectionStart(ue)}function me(ue){var pe;if(!Z.value||!a.value)return;v=!0;const{x:_e,y:ke}=nt(ue,Z.value),{startX:Ne=0,startY:De=0}=a.value,Se={startX:Ne,startY:De,x:_e<Ne?_e:Ne,y:ke<De?ke:De,width:Math.abs(_e-Ne),height:Math.abs(ke-De)},$=re.value,B=X.value;re.value=new Set(ep(t.value,Se,r.value,I.value===Al.Partial,!0).map(y=>y.id)),X.value=new Set;const g=((pe=Q.value)==null?void 0:pe.selectable)??!0;for(const y of re.value){const w=O.value.get(y);if(w)for(const{edgeId:F}of w.values()){const _=U.value.get(F);_&&(_.selectable??g)&&X.value.add(F)}}if(!mc($,re.value)){const y=Ot(D.value,re.value,!0);o.nodesChange(y)}if(!mc(B,X.value)){const y=Ot(U.value,X.value);o.edgesChange(y)}a.value=Se,s.value=!0,u.value=!1}function be(ue){var pe;ue.button!==0||!K||((pe=ue.target)==null||pe.releasePointerCapture(ue.pointerId),!s.value&&a.value&&ue.target===ae.value&&W(ue),s.value=!1,a.value=null,u.value=re.value.size>0,o.selectionEnd(ue),e.selectionKeyPressed&&(v=!1),K=!1)}return(ue,pe)=>(b(),T("div",{ref_key:"container",ref:ae,class:fe(["vue-flow__pane vue-flow__container",{selection:ue.isSelecting}]),onClick:pe[0]||(pe[0]=_e=>k.value?void 0:L(W,ae.value)(_e)),onContextmenu:pe[1]||(pe[1]=_e=>L(Y,ae.value)(_e)),onWheelPassive:pe[2]||(pe[2]=_e=>L(se,ae.value)(_e)),onPointerenter:pe[3]||(pe[3]=_e=>k.value?void 0:le(o).paneMouseEnter(_e)),onPointerdown:pe[4]||(pe[4]=_e=>k.value?oe(_e):le(o).paneMouseMove(_e)),onPointermove:pe[5]||(pe[5]=_e=>k.value?me(_e):le(o).paneMouseMove(_e)),onPointerup:pe[6]||(pe[6]=_e=>k.value?be(_e):void 0),onPointerleave:pe[7]||(pe[7]=_e=>le(o).paneMouseLeave(_e))},[tn(ue.$slots,"default"),le(s)&&le(a)?(b(),Xe(Zy,{key:0,"user-selection-rect":le(a)},null,8,["user-selection-rect"])):Ce("",!0),le(u)&&le(f).length?(b(),Xe(e2,{key:1})):Ce("",!0)],34))}}),o2={name:"Transform",compatConfig:{MODE:3}},s2=Be({...o2,setup(e){const{viewport:n,fitViewOnInit:t,fitViewOnInitDone:r}=Je(),o=ie(()=>t.value?!r.value:!1),s=ie(()=>`translate(${n.value.x}px,${n.value.y}px) scale(${n.value.zoom})`);return(i,a)=>(b(),T("div",{class:"vue-flow__transformationpane vue-flow__container",style:Ve({transform:s.value,opacity:o.value?0:void 0})},[tn(i.$slots,"default")],4))}}),i2={name:"Viewport",compatConfig:{MODE:3}},a2=Be({...i2,setup(e){const{minZoom:n,maxZoom:t,defaultViewport:r,translateExtent:o,zoomActivationKeyCode:s,selectionKeyCode:i,panActivationKeyCode:a,panOnScroll:l,panOnScrollMode:u,panOnScrollSpeed:d,panOnDrag:f,zoomOnDoubleClick:h,zoomOnPinch:p,zoomOnScroll:I,preventScrolling:P,noWheelClassName:x,noPanClassName:N,emits:U,connectionStartHandle:D,userSelectionActive:O,paneDragging:Q,d3Zoom:ee,d3Selection:ne,d3ZoomHandler:ae,viewport:re,viewportRef:X,paneClickDistance:Z}=Je();qy(X);const k=Ut(!1),G=Ut(!1);let v=null,K=!1,S=0,z={x:0,y:0,zoom:0};const L=wo(a),W=wo(i),Y=wo(s),se=We(()=>(!W.value||W.value&&i.value===!0)&&(L.value||f.value)),oe=We(()=>L.value||l.value),me=We(()=>i.value===!0&&se.value!==!0),be=We(()=>W.value&&i.value!==!0||O.value||me.value),ue=We(()=>D.value!==null);Mn(()=>{if(!X.value){Zo("Viewport element is missing");return}const De=X.value,Se=De.getBoundingClientRect(),$=wg().clickDistance(Z.value).scaleExtent([n.value,t.value]).translateExtent(o.value),B=Ln(De).call($),g=B.on("wheel.zoom"),y=Br.translate(r.value.x??0,r.value.y??0).scale(pr(r.value.zoom??1,n.value,t.value)),w=[[0,0],[Se.width,Se.height]],F=$.constrain()(y,w,o.value);$.transform(B,F),$.wheelDelta(Ga),ee.value=$,ne.value=B,ae.value=g,re.value={x:F.x,y:F.y,zoom:F.k},$.on("start",_=>{var C;if(!_.sourceEvent)return null;S=_.sourceEvent.button,k.value=!0;const E=ke(_.transform);((C=_.sourceEvent)==null?void 0:C.type)==="mousedown"&&(Q.value=!0),z=E,U.viewportChangeStart(E),U.moveStart({event:_,flowTransform:E})}),$.on("end",_=>{if(!_.sourceEvent)return null;if(k.value=!1,Q.value=!1,pe(se.value,S??0)&&!K&&U.paneContextMenu(_.sourceEvent),K=!1,_e(z,_.transform)){const C=ke(_.transform);z=C,U.viewportChangeEnd(C),U.moveEnd({event:_,flowTransform:C})}}),$.filter(_=>{var C;const E=Y.value||I.value,m=p.value&&_.ctrlKey,M=_.button,q=_.type==="wheel";if(M===1&&_.type==="mousedown"&&(Ne(_,"vue-flow__node")||Ne(_,"vue-flow__edge")))return!0;if(!se.value&&!E&&!oe.value&&!h.value&&!p.value||O.value||ue.value&&!q||!h.value&&_.type==="dblclick"||Ne(_,x.value)&&q||Ne(_,N.value)&&(!q||oe.value&&q&&!Y.value)||!p.value&&_.ctrlKey&&q||!E&&!oe.value&&!m&&q)return!1;if(!p&&_.type==="touchstart"&&((C=_.touches)==null?void 0:C.length)>1)return _.preventDefault(),!1;if(!se.value&&(_.type==="mousedown"||_.type==="touchstart")||me.value&&Array.isArray(f.value)&&f.value.includes(0)&&M===0||Array.isArray(f.value)&&!f.value.includes(M)&&(_.type==="mousedown"||_.type==="touchstart"))return!1;const A=Array.isArray(f.value)&&f.value.includes(M)||i.value===!0&&Array.isArray(f.value)&&!f.value.includes(0)||!M||M<=1;return(!_.ctrlKey||L.value||q)&&A}),Fe([O,se],()=>{O.value&&!k.value?$.on("zoom",null):O.value||$.on("zoom",_=>{re.value={x:_.transform.x,y:_.transform.y,zoom:_.transform.k};const C=ke(_.transform);K=pe(se.value,S??0),U.viewportChange(C),U.move({event:_,flowTransform:C})})},{immediate:!0}),Fe([O,oe,u,Y,p,P,x],()=>{oe.value&&!Y.value&&!O.value?B.on("wheel.zoom",_=>{if(Ne(_,x.value))return!1;const C=Y.value||I.value,E=p.value&&_.ctrlKey;if(!(!P.value||oe.value||C||E))return!1;_.preventDefault(),_.stopImmediatePropagation();const M=B.property("__zoom").k||1,q=Uo();if(!L.value&&_.ctrlKey&&p.value&&q){const ye=Zn(_),he=Ga(_),we=M*2**he;$.scaleTo(B,we,ye,_);return}const A=_.deltaMode===1?20:1;let V=u.value===Eo.Vertical?0:_.deltaX*A,H=u.value===Eo.Horizontal?0:_.deltaY*A;!q&&_.shiftKey&&u.value!==Eo.Vertical&&!V&&H&&(V=H,H=0),$.translateBy(B,-(V/M)*d.value,-(H/M)*d.value);const ce=ke(B.property("__zoom"));v&&clearTimeout(v),G.value?(U.move({event:_,flowTransform:ce}),U.viewportChange(ce),v=setTimeout(()=>{U.moveEnd({event:_,flowTransform:ce}),U.viewportChangeEnd(ce),G.value=!1},150)):(G.value=!0,U.moveStart({event:_,flowTransform:ce}),U.viewportChangeStart(ce))},{passive:!1}):typeof g<"u"&&B.on("wheel.zoom",function(_,C){const E=!P.value&&_.type==="wheel"&&!_.ctrlKey,m=Y.value||I.value,M=p.value&&_.ctrlKey;if(!m&&!l.value&&!M&&_.type==="wheel"||E||Ne(_,x.value))return null;_.preventDefault(),g.call(this,_,C)},{passive:!1})},{immediate:!0})});function pe(De,Se){return Se===2&&Array.isArray(De)&&De.includes(2)}function _e(De,Se){return De.x!==Se.x&&!Number.isNaN(Se.x)||De.y!==Se.y&&!Number.isNaN(Se.y)||De.zoom!==Se.k&&!Number.isNaN(Se.k)}function ke(De){return{x:De.x,y:De.y,zoom:De.k}}function Ne(De,Se){return De.target.closest(`.${Se}`)}return(De,Se)=>(b(),T("div",{ref_key:"viewportRef",ref:X,class:"vue-flow__viewport vue-flow__container"},[Le(r2,{"is-selecting":be.value,"selection-key-pressed":le(W),class:fe({connecting:ue.value,dragging:le(Q),draggable:le(f)===!0||Array.isArray(le(f))&&le(f).includes(0)})},{default:Rn(()=>[Le(s2,null,{default:Rn(()=>[tn(De.$slots,"default")]),_:3})]),_:3},8,["is-selecting","selection-key-pressed","class"])],512))}}),l2=["id"],u2=["id"],c2=["id"],d2={name:"A11yDescriptions",compatConfig:{MODE:3}},f2=Be({...d2,setup(e){const{id:n,disableKeyboardA11y:t,ariaLiveMessage:r}=Je();return(o,s)=>(b(),T(de,null,[c("div",{id:`${le(Wf)}-${le(n)}`,style:{display:"none"}}," Press enter or space to select a node. "+R(le(t)?"":"You can then use the arrow keys to move the node around.")+" You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ",9,l2),c("div",{id:`${le(Gf)}-${le(n)}`,style:{display:"none"}}," Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ",8,u2),le(t)?Ce("",!0):(b(),T("div",{key:0,id:`${le(Mg)}-${le(n)}`,"aria-live":"assertive","aria-atomic":"true",style:{position:"absolute",width:"1px",height:"1px",margin:"-1px",border:"0",padding:"0",overflow:"hidden",clip:"rect(0px, 0px, 0px, 0px)","clip-path":"inset(100%)"}},R(le(r)),9,c2))],64))}});function p2(){const e=Je();Fe(()=>e.viewportHelper.value.viewportInitialized,n=>{n&&setTimeout(()=>{e.emits.init(e),e.emits.paneReady(e)},1)})}function h2(e,n,t){return t===xe.Left?e-n:t===xe.Right?e+n:e}function m2(e,n,t){return t===xe.Top?e-n:t===xe.Bottom?e+n:e}const Rl=function({radius:e=10,centerX:n=0,centerY:t=0,position:r=xe.Top,type:o}){return Ye("circle",{class:`vue-flow__edgeupdater vue-flow__edgeupdater-${o}`,cx:h2(n,e,r),cy:m2(t,e,r),r:e,stroke:"transparent",fill:"transparent"})};Rl.props=["radius","centerX","centerY","position","type"];Rl.compatConfig={MODE:3};const Sc=Rl,v2=Be({name:"Edge",compatConfig:{MODE:3},props:["id"],setup(e){const{id:n,addSelectedEdges:t,connectionMode:r,edgeUpdaterRadius:o,emits:s,nodesSelectionActive:i,noPanClassName:a,getEdgeTypes:l,removeSelectedEdges:u,findEdge:d,findNode:f,isValidConnection:h,multiSelectionActive:p,disableKeyboardA11y:I,elementsSelectable:P,edgesUpdatable:x,edgesFocusable:N,hooks:U}=Je(),D=ie(()=>d(e.id)),{emit:O,on:Q}=iy(D.value,s),ee=Tn(Ai),ne=Xt(),ae=Ee(!1),re=Ee(!1),X=Ee(""),Z=Ee(null),k=Ee("source"),G=Ee(null),v=We(()=>typeof D.value.selectable>"u"?P.value:D.value.selectable),K=We(()=>typeof D.value.updatable>"u"?x.value:D.value.updatable),S=We(()=>typeof D.value.focusable>"u"?N.value:D.value.focusable);lt(ry,e.id),lt(oy,G);const z=ie(()=>D.value.class instanceof Function?D.value.class(D.value):D.value.class),L=ie(()=>D.value.style instanceof Function?D.value.style(D.value):D.value.style),W=ie(()=>{const y=D.value.type||"default",w=ee==null?void 0:ee[`edge-${y}`];if(w)return w;let F=D.value.template??l.value[y];if(typeof F=="string"&&ne){const _=Object.keys(ne.appContext.components);_&&_.includes(y)&&(F=Od(y,!1))}return F&&typeof F!="string"?F:(s.error(new dn(un.EDGE_TYPE_MISSING,F)),!1)}),{handlePointerDown:Y}=cp({nodeId:X,handleId:Z,type:k,isValidConnection:h,edgeUpdaterType:k,onEdgeUpdate:me,onEdgeUpdateEnd:be});return()=>{const y=f(D.value.source),w=f(D.value.target),F="pathOptions"in D.value?D.value.pathOptions:{};if(!y&&!w)return s.error(new dn(un.EDGE_SOURCE_TARGET_MISSING,D.value.id,D.value.source,D.value.target)),null;if(!y)return s.error(new dn(un.EDGE_SOURCE_MISSING,D.value.id,D.value.source)),null;if(!w)return s.error(new dn(un.EDGE_TARGET_MISSING,D.value.id,D.value.target)),null;if(!D.value||D.value.hidden||y.hidden||w.hidden)return null;let _;r.value===zt.Strict?_=y.handleBounds.source:_=[...y.handleBounds.source||[],...y.handleBounds.target||[]];const C=uc(_,D.value.sourceHandle);let E;r.value===zt.Strict?E=w.handleBounds.target:E=[...w.handleBounds.target||[],...w.handleBounds.source||[]];const m=uc(E,D.value.targetHandle),M=(C==null?void 0:C.position)||xe.Bottom,q=(m==null?void 0:m.position)||xe.Top,{x:A,y:V}=Rr(y,C,M),{x:H,y:ce}=Rr(w,m,q);return D.value.sourceX=A,D.value.sourceY=V,D.value.targetX=H,D.value.targetY=ce,Ye("g",{ref:G,key:e.id,"data-id":e.id,class:["vue-flow__edge",`vue-flow__edge-${W.value===!1?"default":D.value.type||"default"}`,a.value,z.value,{updating:ae.value,selected:D.value.selected,animated:D.value.animated,inactive:!v.value&&!U.value.edgeClick.hasListeners()}],tabIndex:S.value?0:void 0,"aria-label":D.value.ariaLabel===null?void 0:D.value.ariaLabel??`Edge from ${D.value.source} to ${D.value.target}`,"aria-describedby":S.value?`${Gf}-${n}`:void 0,"aria-roledescription":"edge",role:S.value?"group":"img",...D.value.domAttributes,onClick:pe,onContextmenu:_e,onDblclick:ke,onMouseenter:Ne,onMousemove:De,onMouseleave:Se,onKeyDown:S.value?g:void 0},[re.value?null:Ye(W.value===!1?l.value.default:W.value,{id:e.id,sourceNode:y,targetNode:w,source:D.value.source,target:D.value.target,type:D.value.type,updatable:K.value,selected:D.value.selected,animated:D.value.animated,label:D.value.label,labelStyle:D.value.labelStyle,labelShowBg:D.value.labelShowBg,labelBgStyle:D.value.labelBgStyle,labelBgPadding:D.value.labelBgPadding,labelBgBorderRadius:D.value.labelBgBorderRadius,data:D.value.data,events:{...D.value.events,...Q},style:L.value,markerStart:`url('#${Lo(D.value.markerStart,n)}')`,markerEnd:`url('#${Lo(D.value.markerEnd,n)}')`,sourcePosition:M,targetPosition:q,sourceX:A,sourceY:V,targetX:H,targetY:ce,sourceHandleId:D.value.sourceHandle,targetHandleId:D.value.targetHandle,interactionWidth:D.value.interactionWidth,...F}),[K.value==="source"||K.value===!0?[Ye("g",{onMousedown:$,onMouseenter:se,onMouseout:oe},Ye(Sc,{position:M,centerX:A,centerY:V,radius:o.value,type:"source","data-type":"source"}))]:null,K.value==="target"||K.value===!0?[Ye("g",{onMousedown:B,onMouseenter:se,onMouseout:oe},Ye(Sc,{position:q,centerX:H,centerY:ce,radius:o.value,type:"target","data-type":"target"}))]:null]])};function se(){ae.value=!0}function oe(){ae.value=!1}function me(y,w){O.update({event:y,edge:D.value,connection:w})}function be(y){O.updateEnd({event:y,edge:D.value}),re.value=!1}function ue(y,w){y.button===0&&(re.value=!0,X.value=w?D.value.target:D.value.source,Z.value=(w?D.value.targetHandle:D.value.sourceHandle)??null,k.value=w?"target":"source",O.updateStart({event:y,edge:D.value}),Y(y))}function pe(y){var w;const F={event:y,edge:D.value};v.value&&(i.value=!1,D.value.selected&&p.value?(u([D.value]),(w=G.value)==null||w.blur()):t([D.value])),O.click(F)}function _e(y){O.contextMenu({event:y,edge:D.value})}function ke(y){O.doubleClick({event:y,edge:D.value})}function Ne(y){O.mouseEnter({event:y,edge:D.value})}function De(y){O.mouseMove({event:y,edge:D.value})}function Se(y){O.mouseLeave({event:y,edge:D.value})}function $(y){ue(y,!0)}function B(y){ue(y,!1)}function g(y){var w;!I.value&&Xf.includes(y.key)&&v.value&&(y.key==="Escape"?((w=G.value)==null||w.blur(),u([d(e.id)])):t([d(e.id)]))}}}),_2=v2,g2=Be({name:"ConnectionLine",compatConfig:{MODE:3},setup(){var e;const{id:n,connectionMode:t,connectionStartHandle:r,connectionEndHandle:o,connectionPosition:s,connectionLineType:i,connectionLineStyle:a,connectionLineOptions:l,connectionStatus:u,viewport:d,findNode:f}=Je(),h=(e=Tn(Ai))==null?void 0:e["connection-line"],p=ie(()=>{var U;return f((U=r.value)==null?void 0:U.nodeId)}),I=ie(()=>{var U;return f((U=o.value)==null?void 0:U.nodeId)??null}),P=ie(()=>({x:(s.value.x-d.value.x)/d.value.zoom,y:(s.value.y-d.value.y)/d.value.zoom})),x=ie(()=>l.value.markerStart?`url(#${Lo(l.value.markerStart,n)})`:""),N=ie(()=>l.value.markerEnd?`url(#${Lo(l.value.markerEnd,n)})`:"");return()=>{var U,D,O;if(!p.value||!r.value)return null;const Q=r.value.id,ee=r.value.type,ne=p.value.handleBounds;let ae=(ne==null?void 0:ne[ee])??[];if(t.value===zt.Loose){const L=(ne==null?void 0:ne[ee==="source"?"target":"source"])??[];ae=[...ae,...L]}if(!ae)return null;const re=(Q?ae.find(L=>L.id===Q):ae[0])??null,X=(re==null?void 0:re.position)??xe.Top,{x:Z,y:k}=Rr(p.value,re,X);let G=null;I.value&&(t.value===zt.Strict?G=((U=I.value.handleBounds[ee==="source"?"target":"source"])==null?void 0:U.find(L=>{var W;return L.id===((W=o.value)==null?void 0:W.id)}))||null:G=((D=[...I.value.handleBounds.source??[],...I.value.handleBounds.target??[]])==null?void 0:D.find(L=>{var W;return L.id===((W=o.value)==null?void 0:W.id)}))||null);const v=((O=o.value)==null?void 0:O.position)??(X?Xa[X]:null);if(!X||!v)return null;const K=i.value??l.value.type??nr.Bezier;let S="";const z={sourceX:Z,sourceY:k,sourcePosition:X,targetX:P.value.x,targetY:P.value.y,targetPosition:v};return K===nr.Bezier?[S]=vp(z):K===nr.Step?[S]=qa({...z,borderRadius:0}):K===nr.SmoothStep?[S]=qa(z):K===nr.SimpleBezier?[S]=_p(z):S=`M${Z},${k} ${P.value.x},${P.value.y}`,Ye("svg",{class:"vue-flow__edges vue-flow__connectionline vue-flow__container"},Ye("g",{class:"vue-flow__connection"},h?Ye(h,{sourceX:Z,sourceY:k,sourcePosition:X,targetX:P.value.x,targetY:P.value.y,targetPosition:v,sourceNode:p.value,sourceHandle:re,targetNode:I.value,targetHandle:G,markerEnd:N.value,markerStart:x.value,connectionStatus:u.value}):Ye("path",{d:S,class:[l.value.class,u.value,"vue-flow__connection-path"],style:{...a.value,...l.value.style},"marker-end":N.value,"marker-start":x.value})))}}}),y2=g2,C2=["id","markerWidth","markerHeight","markerUnits","orient"],S2={name:"MarkerType",compatConfig:{MODE:3}},b2=Be({...S2,props:{id:{},type:{},color:{default:"none"},width:{default:12.5},height:{default:12.5},markerUnits:{default:"strokeWidth"},orient:{default:"auto-start-reverse"},strokeWidth:{default:1}},setup(e){return(n,t)=>(b(),T("marker",{id:n.id,class:"vue-flow__arrowhead",viewBox:"-10 -10 20 20",refX:"0",refY:"0",markerWidth:`${n.width}`,markerHeight:`${n.height}`,markerUnits:n.markerUnits,orient:n.orient},[n.type===le(Ka).ArrowClosed?(b(),T("polyline",{key:0,style:Ve({stroke:n.color,fill:n.color,strokeWidth:n.strokeWidth}),"stroke-linecap":"round","stroke-linejoin":"round",points:"-5,-4 0,0 -5,4 -5,-4"},null,4)):Ce("",!0),n.type===le(Ka).Arrow?(b(),T("polyline",{key:1,style:Ve({stroke:n.color,strokeWidth:n.strokeWidth}),"stroke-linecap":"round","stroke-linejoin":"round",fill:"none",points:"-5,-4 0,0 -5,4"},null,4)):Ce("",!0)],8,C2))}}),E2={class:"vue-flow__marker vue-flow__container","aria-hidden":"true"},w2={name:"MarkerDefinitions",compatConfig:{MODE:3}},I2=Be({...w2,setup(e){const{id:n,edges:t,connectionLineOptions:r,defaultMarkerColor:o}=Je(),s=ie(()=>{const i=new Set,a=[],l=u=>{if(u){const d=Lo(u,n);i.has(d)||(typeof u=="object"?a.push({...u,id:d,color:u.color||o.value}):a.push({id:d,color:o.value,type:u}),i.add(d))}};for(const u of[r.value.markerEnd,r.value.markerStart])l(u);for(const u of t.value)for(const d of[u.markerStart,u.markerEnd])l(d);return a.sort((u,d)=>u.id.localeCompare(d.id))});return(i,a)=>(b(),T("svg",E2,[c("defs",null,[(b(!0),T(de,null,Me(s.value,l=>(b(),Xe(b2,{id:l.id,key:l.id,type:l.type,color:l.color,width:l.width,height:l.height,markerUnits:l.markerUnits,"stroke-width":l.strokeWidth,orient:l.orient},null,8,["id","type","color","width","height","markerUnits","stroke-width","orient"]))),128))])]))}}),P2={name:"Edges",compatConfig:{MODE:3}},$2=Be({...P2,setup(e){const{findNode:n,getEdges:t,elevateEdgesOnSelect:r}=Je();return(o,s)=>(b(),T(de,null,[Le(I2),(b(!0),T(de,null,Me(le(t),i=>(b(),T("svg",{key:i.id,class:"vue-flow__edges vue-flow__container",style:Ve({zIndex:le(Wg)(i,le(n),le(r))})},[Le(le(_2),{id:i.id},null,8,["id"])],4))),128)),Le(le(y2))],64))}}),x2=Be({name:"Node",compatConfig:{MODE:3},props:["id","resizeObserver"],setup(e){const{id:n,noPanClassName:t,selectNodesOnDrag:r,nodesSelectionActive:o,multiSelectionActive:s,emits:i,removeSelectedNodes:a,addSelectedNodes:l,updateNodeDimensions:u,onUpdateNodeInternals:d,getNodeTypes:f,nodeExtent:h,elevateNodesOnSelect:p,disableKeyboardA11y:I,ariaLiveMessage:P,snapToGrid:x,snapGrid:N,nodeDragThreshold:U,nodesDraggable:D,elementsSelectable:O,nodesConnectable:Q,nodesFocusable:ee,hooks:ne}=Je(),ae=Ee(null);lt(lp,ae),lt(ap,e.id);const re=Tn(Ai),X=Xt(),Z=fp(),{node:k,parentNode:G}=dp(e.id),{emit:v,on:K}=cy(k,i),S=We(()=>typeof k.draggable>"u"?D.value:k.draggable),z=We(()=>typeof k.selectable>"u"?O.value:k.selectable),L=We(()=>typeof k.connectable>"u"?Q.value:k.connectable),W=We(()=>typeof k.focusable>"u"?ee.value:k.focusable),Y=ie(()=>z.value||S.value||ne.value.nodeClick.hasListeners()||ne.value.nodeDoubleClick.hasListeners()||ne.value.nodeMouseEnter.hasListeners()||ne.value.nodeMouseMove.hasListeners()||ne.value.nodeMouseLeave.hasListeners()),se=We(()=>!!k.dimensions.width&&!!k.dimensions.height),oe=ie(()=>{const w=k.type||"default",F=re==null?void 0:re[`node-${w}`];if(F)return F;let _=k.template||f.value[w];if(typeof _=="string"&&X){const C=Object.keys(X.appContext.components);C&&C.includes(w)&&(_=Od(w,!1))}return _&&typeof _!="string"?_:(i.error(new dn(un.NODE_TYPE_MISSING,_)),!1)}),me=up({id:e.id,el:ae,disabled:()=>!S.value,selectable:z,dragHandle:()=>k.dragHandle,onStart(w){v.dragStart(w)},onDrag(w){v.drag(w)},onStop(w){v.dragStop(w)},onClick(w){g(w)}}),be=ie(()=>k.class instanceof Function?k.class(k):k.class),ue=ie(()=>{const w=(k.style instanceof Function?k.style(k):k.style)||{},F=k.width instanceof Function?k.width(k):k.width,_=k.height instanceof Function?k.height(k):k.height;return!w.width&&F&&(w.width=typeof F=="string"?F:`${F}px`),!w.height&&_&&(w.height=typeof _=="string"?_:`${_}px`),w}),pe=We(()=>Number(k.zIndex??ue.value.zIndex??0));return d(w=>{(w.includes(e.id)||!w.length)&&ke()}),Mn(()=>{Fe(()=>k.hidden,(w=!1,F,_)=>{!w&&ae.value&&(e.resizeObserver.observe(ae.value),_(()=>{ae.value&&e.resizeObserver.unobserve(ae.value)}))},{immediate:!0,flush:"post"})}),Fe([()=>k.type,()=>k.sourcePosition,()=>k.targetPosition],()=>{mn(()=>{u([{id:e.id,nodeElement:ae.value,forceUpdate:!0}])})}),Fe([()=>k.position.x,()=>k.position.y,()=>{var w;return(w=G.value)==null?void 0:w.computedPosition.x},()=>{var w;return(w=G.value)==null?void 0:w.computedPosition.y},()=>{var w;return(w=G.value)==null?void 0:w.computedPosition.z},pe,()=>k.selected,()=>k.dimensions.height,()=>k.dimensions.width,()=>{var w;return(w=G.value)==null?void 0:w.dimensions.height},()=>{var w;return(w=G.value)==null?void 0:w.dimensions.width}],([w,F,_,C,E,m])=>{const M={x:w,y:F,z:m+(p.value&&k.selected?1e3:0)};typeof _<"u"&&typeof C<"u"?k.computedPosition=Rg({x:_,y:C,z:E},M):k.computedPosition=M},{flush:"post",immediate:!0}),Fe([()=>k.extent,h],([w,F],[_,C])=>{(w!==_||F!==C)&&_e()}),k.extent==="parent"||typeof k.extent=="object"&&"range"in k.extent&&k.extent.range==="parent"?Aa(()=>se).toBe(!0).then(_e):_e(),()=>k.hidden?null:Ye("div",{ref:ae,"data-id":k.id,class:["vue-flow__node",`vue-flow__node-${oe.value===!1?"default":k.type||"default"}`,{[t.value]:S.value,dragging:me==null?void 0:me.value,draggable:S.value,selected:k.selected,selectable:z.value,parent:k.isParent},be.value],style:{visibility:se.value?"visible":"hidden",zIndex:k.computedPosition.z??pe.value,transform:`translate(${k.computedPosition.x}px,${k.computedPosition.y}px)`,pointerEvents:Y.value?"all":"none",...ue.value},tabIndex:W.value?0:void 0,role:W.value?"group":void 0,"aria-describedby":I.value?void 0:`${Wf}-${n}`,"aria-label":k.ariaLabel,"aria-roledescription":"node",...k.domAttributes,onMouseenter:Ne,onMousemove:De,onMouseleave:Se,onContextmenu:$,onClick:g,onDblclick:B,onKeydown:y},[Ye(oe.value===!1?f.value.default:oe.value,{id:k.id,type:k.type,data:k.data,events:{...k.events,...K},selected:k.selected,resizing:k.resizing,dragging:me.value,connectable:L.value,position:k.computedPosition,dimensions:k.dimensions,isValidTargetPos:k.isValidTargetPos,isValidSourcePos:k.isValidSourcePos,parent:k.parentNode,parentNodeId:k.parentNode,zIndex:k.computedPosition.z??pe.value,targetPosition:k.targetPosition,sourcePosition:k.sourcePosition,label:k.label,dragHandle:k.dragHandle,onUpdateNodeInternals:ke})]);function _e(){const w=k.computedPosition,{computedPosition:F,position:_}=Ol(k,x.value?Ni(w,N.value):w,i.error,h.value,G.value);(k.computedPosition.x!==F.x||k.computedPosition.y!==F.y)&&(k.computedPosition={...k.computedPosition,...F}),(k.position.x!==_.x||k.position.y!==_.y)&&(k.position=_)}function ke(){ae.value&&u([{id:e.id,nodeElement:ae.value,forceUpdate:!0}])}function Ne(w){me!=null&&me.value||v.mouseEnter({event:w,node:k})}function De(w){me!=null&&me.value||v.mouseMove({event:w,node:k})}function Se(w){me!=null&&me.value||v.mouseLeave({event:w,node:k})}function $(w){return v.contextMenu({event:w,node:k})}function B(w){return v.doubleClick({event:w,node:k})}function g(w){z.value&&(!r.value||!S.value||U.value>0)&&Ya(k,s.value,l,a,o,!1,ae.value),v.click({event:w,node:k})}function y(w){if(!(Wa(w)||I.value))if(Xf.includes(w.key)&&z.value){const F=w.key==="Escape";Ya(k,s.value,l,a,o,F,ae.value)}else S.value&&k.selected&&Mr[w.key]&&(w.preventDefault(),P.value=`Moved selected node ${w.key.replace("Arrow","").toLowerCase()}. New position, x: ${~~k.position.x}, y: ${~~k.position.y}`,Z({x:Mr[w.key].x,y:Mr[w.key].y},w.shiftKey))}}}),D2=x2;function M2(e={includeHiddenNodes:!1}){const{nodes:n}=Je();return ie(()=>{if(n.value.length===0)return!1;for(const t of n.value)if((e.includeHiddenNodes||!t.hidden)&&((t==null?void 0:t.handleBounds)===void 0||t.dimensions.width===0||t.dimensions.height===0))return!1;return!0})}const k2={class:"vue-flow__nodes vue-flow__container"},T2={name:"Nodes",compatConfig:{MODE:3}},V2=Be({...T2,setup(e){const{getNodes:n,updateNodeDimensions:t,emits:r}=Je(),o=M2(),s=Ee();return Fe(o,i=>{i&&mn(()=>{r.nodesInitialized(n.value)})},{immediate:!0}),Mn(()=>{s.value=new ResizeObserver(i=>{const a=i.map(l=>({id:l.target.getAttribute("data-id"),nodeElement:l.target,forceUpdate:!0}));mn(()=>t(a))})}),Wr(()=>{var i;return(i=s.value)==null?void 0:i.disconnect()}),(i,a)=>(b(),T("div",k2,[s.value?(b(!0),T(de,{key:0},Me(le(n),(l,u,d,f)=>{const h=[l.id];if(f&&f.key===l.id&&e1(f,h))return f;const p=(b(),Xe(le(D2),{id:l.id,key:l.id,"resize-observer":s.value},null,8,["id","resize-observer"]));return p.memo=h,p},a,0),128)):Ce("",!0)]))}});function N2(){const{emits:e}=Je();Mn(()=>{if(ip()){const n=document.querySelector(".vue-flow__pane");n&&window.getComputedStyle(n).zIndex!=="1"&&e.error(new dn(un.MISSING_STYLES))}})}const A2=c("div",{class:"vue-flow__edge-labels"},null,-1),F2={name:"VueFlow",compatConfig:{MODE:3}},O2=Be({...F2,props:{id:{},modelValue:{},nodes:{},edges:{},edgeTypes:{},nodeTypes:{},connectionMode:{},connectionLineType:{},connectionLineStyle:{default:void 0},connectionLineOptions:{default:void 0},connectionRadius:{},isValidConnection:{type:[Function,null],default:void 0},deleteKeyCode:{default:void 0},selectionKeyCode:{type:[Boolean,null],default:void 0},multiSelectionKeyCode:{default:void 0},zoomActivationKeyCode:{default:void 0},panActivationKeyCode:{default:void 0},snapToGrid:{type:Boolean,default:void 0},snapGrid:{},onlyRenderVisibleElements:{type:Boolean,default:void 0},edgesUpdatable:{type:[Boolean,String],default:void 0},nodesDraggable:{type:Boolean,default:void 0},nodesConnectable:{type:Boolean,default:void 0},nodeDragThreshold:{},elementsSelectable:{type:Boolean,default:void 0},selectNodesOnDrag:{type:Boolean,default:void 0},panOnDrag:{type:[Boolean,Array],default:void 0},minZoom:{},maxZoom:{},defaultViewport:{},translateExtent:{},nodeExtent:{},defaultMarkerColor:{},zoomOnScroll:{type:Boolean,default:void 0},zoomOnPinch:{type:Boolean,default:void 0},panOnScroll:{type:Boolean,default:void 0},panOnScrollSpeed:{},panOnScrollMode:{},paneClickDistance:{},zoomOnDoubleClick:{type:Boolean,default:void 0},preventScrolling:{type:Boolean,default:void 0},selectionMode:{},edgeUpdaterRadius:{},fitViewOnInit:{type:Boolean,default:void 0},connectOnClick:{type:Boolean,default:void 0},applyDefault:{type:Boolean,default:void 0},autoConnect:{type:[Boolean,Function],default:void 0},noDragClassName:{},noWheelClassName:{},noPanClassName:{},defaultEdgeOptions:{},elevateEdgesOnSelect:{type:Boolean,default:void 0},elevateNodesOnSelect:{type:Boolean,default:void 0},disableKeyboardA11y:{type:Boolean,default:void 0},edgesFocusable:{type:Boolean,default:void 0},nodesFocusable:{type:Boolean,default:void 0},autoPanOnConnect:{type:Boolean,default:void 0},autoPanOnNodeDrag:{type:Boolean,default:void 0},autoPanSpeed:{}},emits:["nodesChange","edgesChange","nodesInitialized","paneReady","init","updateNodeInternals","error","connect","connectStart","connectEnd","clickConnectStart","clickConnectEnd","moveStart","move","moveEnd","selectionDragStart","selectionDrag","selectionDragStop","selectionContextMenu","selectionStart","selectionEnd","viewportChangeStart","viewportChange","viewportChangeEnd","paneScroll","paneClick","paneContextMenu","paneMouseEnter","paneMouseMove","paneMouseLeave","edgeUpdate","edgeContextMenu","edgeMouseEnter","edgeMouseMove","edgeMouseLeave","edgeDoubleClick","edgeClick","edgeUpdateStart","edgeUpdateEnd","nodeContextMenu","nodeMouseEnter","nodeMouseMove","nodeMouseLeave","nodeDoubleClick","nodeClick","nodeDragStart","nodeDrag","nodeDragStop","miniMapNodeClick","miniMapNodeDoubleClick","miniMapNodeMouseEnter","miniMapNodeMouseMove","miniMapNodeMouseLeave","update:modelValue","update:nodes","update:edges"],setup(e,{expose:n,emit:t}){const r=e,o=Ud(),s=ea(r,"modelValue",t),i=ea(r,"nodes",t),a=ea(r,"edges",t),l=Je(r),u=hy({modelValue:s,nodes:i,edges:a},r,l);return vy(t,l.hooks),p2(),N2(),lt(Ai,o),Ii(u),n(l),(d,f)=>(b(),T("div",{ref:le(l).vueFlowRef,class:"vue-flow"},[Le(a2,null,{default:Rn(()=>[Le($2),A2,Le(V2),tn(d.$slots,"zoom-pane")]),_:3}),tn(d.$slots,"default"),Le(f2)],512))}}),B2={name:"Panel",compatConfig:{MODE:3}},yp=Be({...B2,props:{position:{}},setup(e){const n=e,{userSelectionActive:t}=Je(),r=ie(()=>`${n.position}`.split("-"));return(o,s)=>(b(),T("div",{class:fe(["vue-flow__panel",r.value]),style:Ve({pointerEvents:le(t)?"none":"all"})},[tn(o.$slots,"default")],6))}});var tt=(e=>(e.Lines="lines",e.Dots="dots",e))(tt||{});const Cp=function({dimensions:e,size:n,color:t}){return Ye("path",{stroke:t,"stroke-width":n,d:`M${e[0]/2} 0 V${e[1]} M0 ${e[1]/2} H${e[0]}`})},Sp=function({radius:e,color:n}){return Ye("circle",{cx:e,cy:e,r:e,fill:n})};tt.Lines+"",tt.Dots+"";const R2={[tt.Dots]:"#81818a",[tt.Lines]:"#eee"},L2=["id","x","y","width","height","patternTransform"],U2={key:2,height:"100",width:"100"},H2=["fill"],z2=["x","y","fill"],K2={name:"Background",compatConfig:{MODE:3}},W2=Be({...K2,props:{id:{},variant:{default:()=>tt.Dots},gap:{default:20},size:{default:1},lineWidth:{default:1},patternColor:{},color:{},bgColor:{},height:{default:100},width:{default:100},x:{default:0},y:{default:0},offset:{default:0}},setup(e){const{id:n,viewport:t}=Je(),r=ie(()=>{const i=t.value.zoom,[a,l]=Array.isArray(e.gap)?e.gap:[e.gap,e.gap],u=[a*i||1,l*i||1],d=e.size*i,[f,h]=Array.isArray(e.offset)?e.offset:[e.offset,e.offset],p=[f*i||1+u[0]/2,h*i||1+u[1]/2];return{scaledGap:u,offset:p,size:d}}),o=We(()=>`pattern-${n}${e.id?`-${e.id}`:""}`),s=We(()=>e.color||e.patternColor||R2[e.variant||tt.Dots]);return(i,a)=>(b(),T("svg",{class:"vue-flow__background vue-flow__container",style:Ve({height:`${i.height>100?100:i.height}%`,width:`${i.width>100?100:i.width}%`})},[tn(i.$slots,"pattern-container",{id:o.value},()=>[c("pattern",{id:o.value,x:le(t).x%r.value.scaledGap[0],y:le(t).y%r.value.scaledGap[1],width:r.value.scaledGap[0],height:r.value.scaledGap[1],patternTransform:`translate(-${r.value.offset[0]},-${r.value.offset[1]})`,patternUnits:"userSpaceOnUse"},[tn(i.$slots,"pattern",{},()=>[i.variant===le(tt).Lines?(b(),Xe(le(Cp),{key:0,size:i.lineWidth,color:s.value,dimensions:r.value.scaledGap},null,8,["size","color","dimensions"])):i.variant===le(tt).Dots?(b(),Xe(le(Sp),{key:1,color:s.value,radius:r.value.size/2},null,8,["color","radius"])):Ce("",!0),i.bgColor?(b(),T("svg",U2,[c("rect",{width:"100%",height:"100%",fill:i.bgColor},null,8,H2)])):Ce("",!0)])],8,L2)]),c("rect",{x:i.x,y:i.y,width:"100%",height:"100%",fill:`url(#${o.value})`},null,8,z2),tn(i.$slots,"default",{id:o.value})],4))}}),G2={name:"ControlButton",compatConfig:{MODE:3}},X2=(e,n)=>{const t=e.__vccOpts||e;for(const[r,o]of n)t[r]=o;return t},Y2={type:"button",class:"vue-flow__controls-button"};function q2(e,n,t,r,o,s){return b(),T("button",Y2,[tn(e.$slots,"default")])}const ms=X2(G2,[["render",q2]]),j2={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32"},Z2=c("path",{d:"M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"},null,-1),J2=[Z2];function Q2(e,n){return b(),T("svg",j2,J2)}const eC={render:Q2},nC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 5"},tC=c("path",{d:"M0 0h32v4.2H0z"},null,-1),rC=[tC];function oC(e,n){return b(),T("svg",nC,rC)}const sC={render:oC},iC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 30"},aC=c("path",{d:"M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"},null,-1),lC=[aC];function uC(e,n){return b(),T("svg",iC,lC)}const cC={render:uC},dC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 32"},fC=c("path",{d:"M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"},null,-1),pC=[fC];function hC(e,n){return b(),T("svg",dC,pC)}const mC={render:hC},vC={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 32"},_C=c("path",{d:"M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z"},null,-1),gC=[_C];function yC(e,n){return b(),T("svg",vC,gC)}const CC={render:yC},SC={name:"Controls",compatConfig:{MODE:3}},bC=Be({...SC,props:{showZoom:{type:Boolean,default:!0},showFitView:{type:Boolean,default:!0},showInteractive:{type:Boolean,default:!0},fitViewParams:{},position:{default:()=>Kf.BottomLeft}},emits:["zoomIn","zoomOut","fitView","interactionChange"],setup(e,{emit:n}){const{nodesDraggable:t,nodesConnectable:r,elementsSelectable:o,setInteractive:s,zoomIn:i,zoomOut:a,fitView:l,viewport:u,minZoom:d,maxZoom:f}=Je(),h=We(()=>t.value||r.value||o.value),p=We(()=>u.value.zoom<=d.value),I=We(()=>u.value.zoom>=f.value);function P(){i(),n("zoomIn")}function x(){a(),n("zoomOut")}function N(){l(e.fitViewParams),n("fitView")}function U(){s(!h.value),n("interactionChange",!h.value)}return(D,O)=>(b(),Xe(le(yp),{class:"vue-flow__controls",position:D.position},{default:Rn(()=>[tn(D.$slots,"top"),D.showZoom?(b(),T(de,{key:0},[tn(D.$slots,"control-zoom-in",{},()=>[Le(ms,{class:"vue-flow__controls-zoomin",disabled:I.value,onClick:P},{default:Rn(()=>[tn(D.$slots,"icon-zoom-in",{},()=>[(b(),Xe(er(le(eC))))])]),_:3},8,["disabled"])]),tn(D.$slots,"control-zoom-out",{},()=>[Le(ms,{class:"vue-flow__controls-zoomout",disabled:p.value,onClick:x},{default:Rn(()=>[tn(D.$slots,"icon-zoom-out",{},()=>[(b(),Xe(er(le(sC))))])]),_:3},8,["disabled"])])],64)):Ce("",!0),D.showFitView?tn(D.$slots,"control-fit-view",{key:1},()=>[Le(ms,{class:"vue-flow__controls-fitview",onClick:N},{default:Rn(()=>[tn(D.$slots,"icon-fit-view",{},()=>[(b(),Xe(er(le(cC))))])]),_:3})]):Ce("",!0),D.showInteractive?tn(D.$slots,"control-interactive",{key:2},()=>[D.showInteractive?(b(),Xe(ms,{key:0,class:"vue-flow__controls-interactive",onClick:U},{default:Rn(()=>[h.value?tn(D.$slots,"icon-unlock",{key:0},()=>[(b(),Xe(er(le(CC))))]):Ce("",!0),h.value?Ce("",!0):tn(D.$slots,"icon-lock",{key:1},()=>[(b(),Xe(er(le(mC))))])]),_:3})):Ce("",!0)]):Ce("",!0),tn(D.$slots,"default")]),_:3},8,["position"]))}});var EC={value:()=>{}};function Ll(){for(var e=0,n=arguments.length,t={},r;e<n;++e){if(!(r=arguments[e]+"")||r in t||/[\s.]/.test(r))throw new Error("illegal type: "+r);t[r]=[]}return new ks(t)}function ks(e){this._=e}function wC(e,n){return e.trim().split(/^|\s+/).map(function(t){var r="",o=t.indexOf(".");if(o>=0&&(r=t.slice(o+1),t=t.slice(0,o)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:r}})}ks.prototype=Ll.prototype={constructor:ks,on:function(e,n){var t=this._,r=wC(e+"",t),o,s=-1,i=r.length;if(arguments.length<2){for(;++s<i;)if((o=(e=r[s]).type)&&(o=IC(t[o],e.name)))return o;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++s<i;)if(o=(e=r[s]).type)t[o]=bc(t[o],e.name,n);else if(n==null)for(o in t)t[o]=bc(t[o],e.name,null);return this},copy:function(){var e={},n=this._;for(var t in n)e[t]=n[t].slice();return new ks(e)},call:function(e,n){if((o=arguments.length-2)>0)for(var t=new Array(o),r=0,o,s;r<o;++r)t[r]=arguments[r+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],r=0,o=s.length;r<o;++r)s[r].value.apply(n,t)},apply:function(e,n,t){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],o=0,s=r.length;o<s;++o)r[o].value.apply(n,t)}};function IC(e,n){for(var t=0,r=e.length,o;t<r;++t)if((o=e[t]).name===n)return o.value}function bc(e,n,t){for(var r=0,o=e.length;r<o;++r)if(e[r].name===n){e[r]=EC,e=e.slice(0,r).concat(e.slice(r+1));break}return t!=null&&e.push({name:n,value:t}),e}var ja="http://www.w3.org/1999/xhtml";const Ec={svg:"http://www.w3.org/2000/svg",xhtml:ja,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function Li(e){var n=e+="",t=n.indexOf(":");return t>=0&&(n=e.slice(0,t))!=="xmlns"&&(e=e.slice(t+1)),Ec.hasOwnProperty(n)?{space:Ec[n],local:e}:e}function PC(e){return function(){var n=this.ownerDocument,t=this.namespaceURI;return t===ja&&n.documentElement.namespaceURI===ja?n.createElement(e):n.createElementNS(t,e)}}function $C(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function bp(e){var n=Li(e);return(n.local?$C:PC)(n)}function xC(){}function Ul(e){return e==null?xC:function(){return this.querySelector(e)}}function DC(e){typeof e!="function"&&(e=Ul(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=new Array(i),l,u,d=0;d<i;++d)(l=s[d])&&(u=e.call(l,l.__data__,d,s))&&("__data__"in l&&(u.__data__=l.__data__),a[d]=u);return new An(r,this._parents)}function MC(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function kC(){return[]}function Ep(e){return e==null?kC:function(){return this.querySelectorAll(e)}}function TC(e){return function(){return MC(e.apply(this,arguments))}}function VC(e){typeof e=="function"?e=TC(e):e=Ep(e);for(var n=this._groups,t=n.length,r=[],o=[],s=0;s<t;++s)for(var i=n[s],a=i.length,l,u=0;u<a;++u)(l=i[u])&&(r.push(e.call(l,l.__data__,u,i)),o.push(l));return new An(r,o)}function wp(e){return function(){return this.matches(e)}}function Ip(e){return function(n){return n.matches(e)}}var NC=Array.prototype.find;function AC(e){return function(){return NC.call(this.children,e)}}function FC(){return this.firstElementChild}function OC(e){return this.select(e==null?FC:AC(typeof e=="function"?e:Ip(e)))}var BC=Array.prototype.filter;function RC(){return Array.from(this.children)}function LC(e){return function(){return BC.call(this.children,e)}}function UC(e){return this.selectAll(e==null?RC:LC(typeof e=="function"?e:Ip(e)))}function HC(e){typeof e!="function"&&(e=wp(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,u=0;u<i;++u)(l=s[u])&&e.call(l,l.__data__,u,s)&&a.push(l);return new An(r,this._parents)}function Pp(e){return new Array(e.length)}function zC(){return new An(this._enter||this._groups.map(Pp),this._parents)}function ri(e,n){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=n}ri.prototype={constructor:ri,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,n){return this._parent.insertBefore(e,n)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function KC(e){return function(){return e}}function WC(e,n,t,r,o,s){for(var i=0,a,l=n.length,u=s.length;i<u;++i)(a=n[i])?(a.__data__=s[i],r[i]=a):t[i]=new ri(e,s[i]);for(;i<l;++i)(a=n[i])&&(o[i]=a)}function GC(e,n,t,r,o,s,i){var a,l,u=new Map,d=n.length,f=s.length,h=new Array(d),p;for(a=0;a<d;++a)(l=n[a])&&(h[a]=p=i.call(l,l.__data__,a,n)+"",u.has(p)?o[a]=l:u.set(p,l));for(a=0;a<f;++a)p=i.call(e,s[a],a,s)+"",(l=u.get(p))?(r[a]=l,l.__data__=s[a],u.delete(p)):t[a]=new ri(e,s[a]);for(a=0;a<d;++a)(l=n[a])&&u.get(h[a])===l&&(o[a]=l)}function XC(e){return e.__data__}function YC(e,n){if(!arguments.length)return Array.from(this,XC);var t=n?GC:WC,r=this._parents,o=this._groups;typeof e!="function"&&(e=KC(e));for(var s=o.length,i=new Array(s),a=new Array(s),l=new Array(s),u=0;u<s;++u){var d=r[u],f=o[u],h=f.length,p=qC(e.call(d,d&&d.__data__,u,r)),I=p.length,P=a[u]=new Array(I),x=i[u]=new Array(I),N=l[u]=new Array(h);t(d,f,P,x,N,p,n);for(var U=0,D=0,O,Q;U<I;++U)if(O=P[U]){for(U>=D&&(D=U+1);!(Q=x[D])&&++D<I;);O._next=Q||null}}return i=new An(i,r),i._enter=a,i._exit=l,i}function qC(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function jC(){return new An(this._exit||this._groups.map(Pp),this._parents)}function ZC(e,n,t){var r=this.enter(),o=this,s=this.exit();return typeof e=="function"?(r=e(r),r&&(r=r.selection())):r=r.append(e+""),n!=null&&(o=n(o),o&&(o=o.selection())),t==null?s.remove():t(s),r&&o?r.merge(o).order():o}function JC(e){for(var n=e.selection?e.selection():e,t=this._groups,r=n._groups,o=t.length,s=r.length,i=Math.min(o,s),a=new Array(o),l=0;l<i;++l)for(var u=t[l],d=r[l],f=u.length,h=a[l]=new Array(f),p,I=0;I<f;++I)(p=u[I]||d[I])&&(h[I]=p);for(;l<o;++l)a[l]=t[l];return new An(a,this._parents)}function QC(){for(var e=this._groups,n=-1,t=e.length;++n<t;)for(var r=e[n],o=r.length-1,s=r[o],i;--o>=0;)(i=r[o])&&(s&&i.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(i,s),s=i);return this}function eS(e){e||(e=nS);function n(f,h){return f&&h?e(f.__data__,h.__data__):!f-!h}for(var t=this._groups,r=t.length,o=new Array(r),s=0;s<r;++s){for(var i=t[s],a=i.length,l=o[s]=new Array(a),u,d=0;d<a;++d)(u=i[d])&&(l[d]=u);l.sort(n)}return new An(o,this._parents).order()}function nS(e,n){return e<n?-1:e>n?1:e>=n?0:NaN}function tS(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function rS(){return Array.from(this)}function oS(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length;o<s;++o){var i=r[o];if(i)return i}return null}function sS(){let e=0;for(const n of this)++e;return e}function iS(){return!this.node()}function aS(e){for(var n=this._groups,t=0,r=n.length;t<r;++t)for(var o=n[t],s=0,i=o.length,a;s<i;++s)(a=o[s])&&e.call(a,a.__data__,s,o);return this}function lS(e){return function(){this.removeAttribute(e)}}function uS(e){return function(){this.removeAttributeNS(e.space,e.local)}}function cS(e,n){return function(){this.setAttribute(e,n)}}function dS(e,n){return function(){this.setAttributeNS(e.space,e.local,n)}}function fS(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttribute(e):this.setAttribute(e,t)}}function pS(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,t)}}function hS(e,n){var t=Li(e);if(arguments.length<2){var r=this.node();return t.local?r.getAttributeNS(t.space,t.local):r.getAttribute(t)}return this.each((n==null?t.local?uS:lS:typeof n=="function"?t.local?pS:fS:t.local?dS:cS)(t,n))}function $p(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function mS(e){return function(){this.style.removeProperty(e)}}function vS(e,n,t){return function(){this.style.setProperty(e,n,t)}}function _S(e,n,t){return function(){var r=n.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,t)}}function gS(e,n,t){return arguments.length>1?this.each((n==null?mS:typeof n=="function"?_S:vS)(e,n,t??"")):Lr(this.node(),e)}function Lr(e,n){return e.style.getPropertyValue(n)||$p(e).getComputedStyle(e,null).getPropertyValue(n)}function yS(e){return function(){delete this[e]}}function CS(e,n){return function(){this[e]=n}}function SS(e,n){return function(){var t=n.apply(this,arguments);t==null?delete this[e]:this[e]=t}}function bS(e,n){return arguments.length>1?this.each((n==null?yS:typeof n=="function"?SS:CS)(e,n)):this.node()[e]}function xp(e){return e.trim().split(/^|\s+/)}function Hl(e){return e.classList||new Dp(e)}function Dp(e){this._node=e,this._names=xp(e.getAttribute("class")||"")}Dp.prototype={add:function(e){var n=this._names.indexOf(e);n<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var n=this._names.indexOf(e);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function Mp(e,n){for(var t=Hl(e),r=-1,o=n.length;++r<o;)t.add(n[r])}function kp(e,n){for(var t=Hl(e),r=-1,o=n.length;++r<o;)t.remove(n[r])}function ES(e){return function(){Mp(this,e)}}function wS(e){return function(){kp(this,e)}}function IS(e,n){return function(){(n.apply(this,arguments)?Mp:kp)(this,e)}}function PS(e,n){var t=xp(e+"");if(arguments.length<2){for(var r=Hl(this.node()),o=-1,s=t.length;++o<s;)if(!r.contains(t[o]))return!1;return!0}return this.each((typeof n=="function"?IS:n?ES:wS)(t,n))}function $S(){this.textContent=""}function xS(e){return function(){this.textContent=e}}function DS(e){return function(){var n=e.apply(this,arguments);this.textContent=n??""}}function MS(e){return arguments.length?this.each(e==null?$S:(typeof e=="function"?DS:xS)(e)):this.node().textContent}function kS(){this.innerHTML=""}function TS(e){return function(){this.innerHTML=e}}function VS(e){return function(){var n=e.apply(this,arguments);this.innerHTML=n??""}}function NS(e){return arguments.length?this.each(e==null?kS:(typeof e=="function"?VS:TS)(e)):this.node().innerHTML}function AS(){this.nextSibling&&this.parentNode.appendChild(this)}function FS(){return this.each(AS)}function OS(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function BS(){return this.each(OS)}function RS(e){var n=typeof e=="function"?e:bp(e);return this.select(function(){return this.appendChild(n.apply(this,arguments))})}function LS(){return null}function US(e,n){var t=typeof e=="function"?e:bp(e),r=n==null?LS:typeof n=="function"?n:Ul(n);return this.select(function(){return this.insertBefore(t.apply(this,arguments),r.apply(this,arguments)||null)})}function HS(){var e=this.parentNode;e&&e.removeChild(this)}function zS(){return this.each(HS)}function KS(){var e=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function WS(){var e=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function GS(e){return this.select(e?WS:KS)}function XS(e){return arguments.length?this.property("__data__",e):this.node().__data__}function YS(e){return function(n){e.call(this,n,this.__data__)}}function qS(e){return e.trim().split(/^|\s+/).map(function(n){var t="",r=n.indexOf(".");return r>=0&&(t=n.slice(r+1),n=n.slice(0,r)),{type:n,name:t}})}function jS(e){return function(){var n=this.__on;if(n){for(var t=0,r=-1,o=n.length,s;t<o;++t)s=n[t],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):n[++r]=s;++r?n.length=r:delete this.__on}}}function ZS(e,n,t){return function(){var r=this.__on,o,s=YS(n);if(r){for(var i=0,a=r.length;i<a;++i)if((o=r[i]).type===e.type&&o.name===e.name){this.removeEventListener(o.type,o.listener,o.options),this.addEventListener(o.type,o.listener=s,o.options=t),o.value=n;return}}this.addEventListener(e.type,s,t),o={type:e.type,name:e.name,value:n,listener:s,options:t},r?r.push(o):this.__on=[o]}}function JS(e,n,t){var r=qS(e+""),o,s=r.length,i;if(arguments.length<2){var a=this.node().__on;if(a){for(var l=0,u=a.length,d;l<u;++l)for(o=0,d=a[l];o<s;++o)if((i=r[o]).type===d.type&&i.name===d.name)return d.value}return}for(a=n?ZS:jS,o=0;o<s;++o)this.each(a(r[o],n,t));return this}function Tp(e,n,t){var r=$p(e),o=r.CustomEvent;typeof o=="function"?o=new o(n,t):(o=r.document.createEvent("Event"),t?(o.initEvent(n,t.bubbles,t.cancelable),o.detail=t.detail):o.initEvent(n,!1,!1)),e.dispatchEvent(o)}function QS(e,n){return function(){return Tp(this,e,n)}}function eb(e,n){return function(){return Tp(this,e,n.apply(this,arguments))}}function nb(e,n){return this.each((typeof n=="function"?eb:QS)(e,n))}function*tb(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],o=0,s=r.length,i;o<s;++o)(i=r[o])&&(yield i)}var Vp=[null];function An(e,n){this._groups=e,this._parents=n}function Jo(){return new An([[document.documentElement]],Vp)}function rb(){return this}An.prototype=Jo.prototype={constructor:An,select:DC,selectAll:VC,selectChild:OC,selectChildren:UC,filter:HC,data:YC,enter:zC,exit:jC,join:ZC,merge:JC,selection:rb,order:QC,sort:eS,call:tS,nodes:rS,node:oS,size:sS,empty:iS,each:aS,attr:hS,style:gS,property:bS,classed:PS,text:MS,html:NS,raise:FS,lower:BS,append:RS,insert:US,remove:zS,clone:GS,datum:XS,on:JS,dispatch:nb,[Symbol.iterator]:tb};function Lt(e){return typeof e=="string"?new An([[document.querySelector(e)]],[document.documentElement]):new An([[e]],Vp)}function ob(e){let n;for(;n=e.sourceEvent;)e=n;return e}function At(e,n){if(e=ob(e),n===void 0&&(n=e.currentTarget),n){var t=n.ownerSVGElement||n;if(t.createSVGPoint){var r=t.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}if(n.getBoundingClientRect){var o=n.getBoundingClientRect();return[e.clientX-o.left-n.clientLeft,e.clientY-o.top-n.clientTop]}}return[e.pageX,e.pageY]}const Za={capture:!0,passive:!1};function Ja(e){e.preventDefault(),e.stopImmediatePropagation()}function sb(e){var n=e.document.documentElement,t=Lt(e).on("dragstart.drag",Ja,Za);"onselectstart"in n?t.on("selectstart.drag",Ja,Za):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}function ib(e,n){var t=e.document.documentElement,r=Lt(e).on("dragstart.drag",null);n&&(r.on("click.drag",Ja,Za),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in t?r.on("selectstart.drag",null):(t.style.MozUserSelect=t.__noselect,delete t.__noselect)}function zl(e,n,t){e.prototype=n.prototype=t,t.constructor=e}function Np(e,n){var t=Object.create(e.prototype);for(var r in n)t[r]=n[r];return t}function Qo(){}var Ho=.7,oi=1/Ho,kr="\\s*([+-]?\\d+)\\s*",zo="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",it="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",ab=/^#([0-9a-f]{3,8})$/,lb=new RegExp(`^rgb\\(${kr},${kr},${kr}\\)$`),ub=new RegExp(`^rgb\\(${it},${it},${it}\\)$`),cb=new RegExp(`^rgba\\(${kr},${kr},${kr},${zo}\\)$`),db=new RegExp(`^rgba\\(${it},${it},${it},${zo}\\)$`),fb=new RegExp(`^hsl\\(${zo},${it},${it}\\)$`),pb=new RegExp(`^hsla\\(${zo},${it},${it},${zo}\\)$`),wc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};zl(Qo,Ko,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Ic,formatHex:Ic,formatHex8:hb,formatHsl:mb,formatRgb:Pc,toString:Pc});function Ic(){return this.rgb().formatHex()}function hb(){return this.rgb().formatHex8()}function mb(){return Ap(this).formatHsl()}function Pc(){return this.rgb().formatRgb()}function Ko(e){var n,t;return e=(e+"").trim().toLowerCase(),(n=ab.exec(e))?(t=n[1].length,n=parseInt(n[1],16),t===6?$c(n):t===3?new Dn(n>>8&15|n>>4&240,n>>4&15|n&240,(n&15)<<4|n&15,1):t===8?vs(n>>24&255,n>>16&255,n>>8&255,(n&255)/255):t===4?vs(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|n&240,((n&15)<<4|n&15)/255):null):(n=lb.exec(e))?new Dn(n[1],n[2],n[3],1):(n=ub.exec(e))?new Dn(n[1]*255/100,n[2]*255/100,n[3]*255/100,1):(n=cb.exec(e))?vs(n[1],n[2],n[3],n[4]):(n=db.exec(e))?vs(n[1]*255/100,n[2]*255/100,n[3]*255/100,n[4]):(n=fb.exec(e))?Mc(n[1],n[2]/100,n[3]/100,1):(n=pb.exec(e))?Mc(n[1],n[2]/100,n[3]/100,n[4]):wc.hasOwnProperty(e)?$c(wc[e]):e==="transparent"?new Dn(NaN,NaN,NaN,0):null}function $c(e){return new Dn(e>>16&255,e>>8&255,e&255,1)}function vs(e,n,t,r){return r<=0&&(e=n=t=NaN),new Dn(e,n,t,r)}function vb(e){return e instanceof Qo||(e=Ko(e)),e?(e=e.rgb(),new Dn(e.r,e.g,e.b,e.opacity)):new Dn}function Qa(e,n,t,r){return arguments.length===1?vb(e):new Dn(e,n,t,r??1)}function Dn(e,n,t,r){this.r=+e,this.g=+n,this.b=+t,this.opacity=+r}zl(Dn,Qa,Np(Qo,{brighter(e){return e=e==null?oi:Math.pow(oi,e),new Dn(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?Ho:Math.pow(Ho,e),new Dn(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new Dn(cr(this.r),cr(this.g),cr(this.b),si(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:xc,formatHex:xc,formatHex8:_b,formatRgb:Dc,toString:Dc}));function xc(){return`#${sr(this.r)}${sr(this.g)}${sr(this.b)}`}function _b(){return`#${sr(this.r)}${sr(this.g)}${sr(this.b)}${sr((isNaN(this.opacity)?1:this.opacity)*255)}`}function Dc(){const e=si(this.opacity);return`${e===1?"rgb(":"rgba("}${cr(this.r)}, ${cr(this.g)}, ${cr(this.b)}${e===1?")":`, ${e})`}`}function si(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function cr(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function sr(e){return e=cr(e),(e<16?"0":"")+e.toString(16)}function Mc(e,n,t,r){return r<=0?e=n=t=NaN:t<=0||t>=1?e=n=NaN:n<=0&&(e=NaN),new Hn(e,n,t,r)}function Ap(e){if(e instanceof Hn)return new Hn(e.h,e.s,e.l,e.opacity);if(e instanceof Qo||(e=Ko(e)),!e)return new Hn;if(e instanceof Hn)return e;e=e.rgb();var n=e.r/255,t=e.g/255,r=e.b/255,o=Math.min(n,t,r),s=Math.max(n,t,r),i=NaN,a=s-o,l=(s+o)/2;return a?(n===s?i=(t-r)/a+(t<r)*6:t===s?i=(r-n)/a+2:i=(n-t)/a+4,a/=l<.5?s+o:2-s-o,i*=60):a=l>0&&l<1?0:i,new Hn(i,a,l,e.opacity)}function gb(e,n,t,r){return arguments.length===1?Ap(e):new Hn(e,n,t,r??1)}function Hn(e,n,t,r){this.h=+e,this.s=+n,this.l=+t,this.opacity=+r}zl(Hn,gb,Np(Qo,{brighter(e){return e=e==null?oi:Math.pow(oi,e),new Hn(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?Ho:Math.pow(Ho,e),new Hn(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,n=isNaN(e)||isNaN(this.s)?0:this.s,t=this.l,r=t+(t<.5?t:1-t)*n,o=2*t-r;return new Dn(da(e>=240?e-240:e+120,o,r),da(e,o,r),da(e<120?e+240:e-120,o,r),this.opacity)},clamp(){return new Hn(kc(this.h),_s(this.s),_s(this.l),si(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=si(this.opacity);return`${e===1?"hsl(":"hsla("}${kc(this.h)}, ${_s(this.s)*100}%, ${_s(this.l)*100}%${e===1?")":`, ${e})`}`}}));function kc(e){return e=(e||0)%360,e<0?e+360:e}function _s(e){return Math.max(0,Math.min(1,e||0))}function da(e,n,t){return(e<60?n+(t-n)*e/60:e<180?t:e<240?n+(t-n)*(240-e)/60:n)*255}const Fp=e=>()=>e;function yb(e,n){return function(t){return e+t*n}}function Cb(e,n,t){return e=Math.pow(e,t),n=Math.pow(n,t)-e,t=1/t,function(r){return Math.pow(e+r*n,t)}}function Sb(e){return(e=+e)==1?Op:function(n,t){return t-n?Cb(n,t,e):Fp(isNaN(n)?t:n)}}function Op(e,n){var t=n-e;return t?yb(e,t):Fp(isNaN(e)?n:e)}const Tc=function e(n){var t=Sb(n);function r(o,s){var i=t((o=Qa(o)).r,(s=Qa(s)).r),a=t(o.g,s.g),l=t(o.b,s.b),u=Op(o.opacity,s.opacity);return function(d){return o.r=i(d),o.g=a(d),o.b=l(d),o.opacity=u(d),o+""}}return r.gamma=e,r}(1);function Bt(e,n){return e=+e,n=+n,function(t){return e*(1-t)+n*t}}var el=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,fa=new RegExp(el.source,"g");function bb(e){return function(){return e}}function Eb(e){return function(n){return e(n)+""}}function wb(e,n){var t=el.lastIndex=fa.lastIndex=0,r,o,s,i=-1,a=[],l=[];for(e=e+"",n=n+"";(r=el.exec(e))&&(o=fa.exec(n));)(s=o.index)>t&&(s=n.slice(t,s),a[i]?a[i]+=s:a[++i]=s),(r=r[0])===(o=o[0])?a[i]?a[i]+=o:a[++i]=o:(a[++i]=null,l.push({i,x:Bt(r,o)})),t=fa.lastIndex;return t<n.length&&(s=n.slice(t),a[i]?a[i]+=s:a[++i]=s),a.length<2?l[0]?Eb(l[0].x):bb(n):(n=l.length,function(u){for(var d=0,f;d<n;++d)a[(f=l[d]).i]=f.x(u);return a.join("")})}var Vc=180/Math.PI,nl={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function Bp(e,n,t,r,o,s){var i,a,l;return(i=Math.sqrt(e*e+n*n))&&(e/=i,n/=i),(l=e*t+n*r)&&(t-=e*l,r-=n*l),(a=Math.sqrt(t*t+r*r))&&(t/=a,r/=a,l/=a),e*r<n*t&&(e=-e,n=-n,l=-l,i=-i),{translateX:o,translateY:s,rotate:Math.atan2(n,e)*Vc,skewX:Math.atan(l)*Vc,scaleX:i,scaleY:a}}var gs;function Ib(e){const n=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return n.isIdentity?nl:Bp(n.a,n.b,n.c,n.d,n.e,n.f)}function Pb(e){return e==null||(gs||(gs=document.createElementNS("http://www.w3.org/2000/svg","g")),gs.setAttribute("transform",e),!(e=gs.transform.baseVal.consolidate()))?nl:(e=e.matrix,Bp(e.a,e.b,e.c,e.d,e.e,e.f))}function Rp(e,n,t,r){function o(u){return u.length?u.pop()+" ":""}function s(u,d,f,h,p,I){if(u!==f||d!==h){var P=p.push("translate(",null,n,null,t);I.push({i:P-4,x:Bt(u,f)},{i:P-2,x:Bt(d,h)})}else(f||h)&&p.push("translate("+f+n+h+t)}function i(u,d,f,h){u!==d?(u-d>180?d+=360:d-u>180&&(u+=360),h.push({i:f.push(o(f)+"rotate(",null,r)-2,x:Bt(u,d)})):d&&f.push(o(f)+"rotate("+d+r)}function a(u,d,f,h){u!==d?h.push({i:f.push(o(f)+"skewX(",null,r)-2,x:Bt(u,d)}):d&&f.push(o(f)+"skewX("+d+r)}function l(u,d,f,h,p,I){if(u!==f||d!==h){var P=p.push(o(p)+"scale(",null,",",null,")");I.push({i:P-4,x:Bt(u,f)},{i:P-2,x:Bt(d,h)})}else(f!==1||h!==1)&&p.push(o(p)+"scale("+f+","+h+")")}return function(u,d){var f=[],h=[];return u=e(u),d=e(d),s(u.translateX,u.translateY,d.translateX,d.translateY,f,h),i(u.rotate,d.rotate,f,h),a(u.skewX,d.skewX,f,h),l(u.scaleX,u.scaleY,d.scaleX,d.scaleY,f,h),u=d=null,function(p){for(var I=-1,P=h.length,x;++I<P;)f[(x=h[I]).i]=x.x(p);return f.join("")}}}var $b=Rp(Ib,"px, ","px)","deg)"),xb=Rp(Pb,", ",")",")"),Db=1e-12;function Nc(e){return((e=Math.exp(e))+1/e)/2}function Mb(e){return((e=Math.exp(e))-1/e)/2}function kb(e){return((e=Math.exp(2*e))-1)/(e+1)}const Tb=function e(n,t,r){function o(s,i){var a=s[0],l=s[1],u=s[2],d=i[0],f=i[1],h=i[2],p=d-a,I=f-l,P=p*p+I*I,x,N;if(P<Db)N=Math.log(h/u)/n,x=function(ne){return[a+ne*p,l+ne*I,u*Math.exp(n*ne*N)]};else{var U=Math.sqrt(P),D=(h*h-u*u+r*P)/(2*u*t*U),O=(h*h-u*u-r*P)/(2*h*t*U),Q=Math.log(Math.sqrt(D*D+1)-D),ee=Math.log(Math.sqrt(O*O+1)-O);N=(ee-Q)/n,x=function(ne){var ae=ne*N,re=Nc(Q),X=u/(t*U)*(re*kb(n*ae+Q)-Mb(Q));return[a+X*p,l+X*I,u*re/Nc(n*ae+Q)]}}return x.duration=N*1e3*n/Math.SQRT2,x}return o.rho=function(s){var i=Math.max(.001,+s),a=i*i,l=a*a;return e(i,a,l)},o}(Math.SQRT2,2,4);var Ur=0,co=0,eo=0,Lp=1e3,ii,fo,ai=0,hr=0,Ui=0,Wo=typeof performance=="object"&&performance.now?performance:Date,Up=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function Kl(){return hr||(Up(Vb),hr=Wo.now()+Ui)}function Vb(){hr=0}function li(){this._call=this._time=this._next=null}li.prototype=Hp.prototype={constructor:li,restart:function(e,n,t){if(typeof e!="function")throw new TypeError("callback is not a function");t=(t==null?Kl():+t)+(n==null?0:+n),!this._next&&fo!==this&&(fo?fo._next=this:ii=this,fo=this),this._call=e,this._time=t,tl()},stop:function(){this._call&&(this._call=null,this._time=1/0,tl())}};function Hp(e,n,t){var r=new li;return r.restart(e,n,t),r}function Nb(){Kl(),++Ur;for(var e=ii,n;e;)(n=hr-e._time)>=0&&e._call.call(void 0,n),e=e._next;--Ur}function Ac(){hr=(ai=Wo.now())+Ui,Ur=co=0;try{Nb()}finally{Ur=0,Fb(),hr=0}}function Ab(){var e=Wo.now(),n=e-ai;n>Lp&&(Ui-=n,ai=e)}function Fb(){for(var e,n=ii,t,r=1/0;n;)n._call?(r>n._time&&(r=n._time),e=n,n=n._next):(t=n._next,n._next=null,n=e?e._next=t:ii=t);fo=e,tl(r)}function tl(e){if(!Ur){co&&(co=clearTimeout(co));var n=e-hr;n>24?(e<1/0&&(co=setTimeout(Ac,e-Wo.now()-Ui)),eo&&(eo=clearInterval(eo))):(eo||(ai=Wo.now(),eo=setInterval(Ab,Lp)),Ur=1,Up(Ac))}}function Fc(e,n,t){var r=new li;return n=n==null?0:+n,r.restart(o=>{r.stop(),e(o+n)},n,t),r}var Ob=Ll("start","end","cancel","interrupt"),Bb=[],zp=0,Oc=1,rl=2,Ts=3,Bc=4,ol=5,Vs=6;function Hi(e,n,t,r,o,s){var i=e.__transition;if(!i)e.__transition={};else if(t in i)return;Rb(e,t,{name:n,index:r,group:o,on:Ob,tween:Bb,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:zp})}function Wl(e,n){var t=Gn(e,n);if(t.state>zp)throw new Error("too late; already scheduled");return t}function ct(e,n){var t=Gn(e,n);if(t.state>Ts)throw new Error("too late; already running");return t}function Gn(e,n){var t=e.__transition;if(!t||!(t=t[n]))throw new Error("transition not found");return t}function Rb(e,n,t){var r=e.__transition,o;r[n]=t,t.timer=Hp(s,0,t.time);function s(u){t.state=Oc,t.timer.restart(i,t.delay,t.time),t.delay<=u&&i(u-t.delay)}function i(u){var d,f,h,p;if(t.state!==Oc)return l();for(d in r)if(p=r[d],p.name===t.name){if(p.state===Ts)return Fc(i);p.state===Bc?(p.state=Vs,p.timer.stop(),p.on.call("interrupt",e,e.__data__,p.index,p.group),delete r[d]):+d<n&&(p.state=Vs,p.timer.stop(),p.on.call("cancel",e,e.__data__,p.index,p.group),delete r[d])}if(Fc(function(){t.state===Ts&&(t.state=Bc,t.timer.restart(a,t.delay,t.time),a(u))}),t.state=rl,t.on.call("start",e,e.__data__,t.index,t.group),t.state===rl){for(t.state=Ts,o=new Array(h=t.tween.length),d=0,f=-1;d<h;++d)(p=t.tween[d].value.call(e,e.__data__,t.index,t.group))&&(o[++f]=p);o.length=f+1}}function a(u){for(var d=u<t.duration?t.ease.call(null,u/t.duration):(t.timer.restart(l),t.state=ol,1),f=-1,h=o.length;++f<h;)o[f].call(e,d);t.state===ol&&(t.on.call("end",e,e.__data__,t.index,t.group),l())}function l(){t.state=Vs,t.timer.stop(),delete r[n];for(var u in r)return;delete e.__transition}}function Ns(e,n){var t=e.__transition,r,o,s=!0,i;if(t){n=n==null?null:n+"";for(i in t){if((r=t[i]).name!==n){s=!1;continue}o=r.state>rl&&r.state<ol,r.state=Vs,r.timer.stop(),r.on.call(o?"interrupt":"cancel",e,e.__data__,r.index,r.group),delete t[i]}s&&delete e.__transition}}function Lb(e){return this.each(function(){Ns(this,e)})}function Ub(e,n){var t,r;return function(){var o=ct(this,e),s=o.tween;if(s!==t){r=t=s;for(var i=0,a=r.length;i<a;++i)if(r[i].name===n){r=r.slice(),r.splice(i,1);break}}o.tween=r}}function Hb(e,n,t){var r,o;if(typeof t!="function")throw new Error;return function(){var s=ct(this,e),i=s.tween;if(i!==r){o=(r=i).slice();for(var a={name:n,value:t},l=0,u=o.length;l<u;++l)if(o[l].name===n){o[l]=a;break}l===u&&o.push(a)}s.tween=o}}function zb(e,n){var t=this._id;if(e+="",arguments.length<2){for(var r=Gn(this.node(),t).tween,o=0,s=r.length,i;o<s;++o)if((i=r[o]).name===e)return i.value;return null}return this.each((n==null?Ub:Hb)(t,e,n))}function Gl(e,n,t){var r=e._id;return e.each(function(){var o=ct(this,r);(o.value||(o.value={}))[n]=t.apply(this,arguments)}),function(o){return Gn(o,r).value[n]}}function Kp(e,n){var t;return(typeof n=="number"?Bt:n instanceof Ko?Tc:(t=Ko(n))?(n=t,Tc):wb)(e,n)}function Kb(e){return function(){this.removeAttribute(e)}}function Wb(e){return function(){this.removeAttributeNS(e.space,e.local)}}function Gb(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttribute(e);return i===o?null:i===r?s:s=n(r=i,t)}}function Xb(e,n,t){var r,o=t+"",s;return function(){var i=this.getAttributeNS(e.space,e.local);return i===o?null:i===r?s:s=n(r=i,t)}}function Yb(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttribute(e):(i=this.getAttribute(e),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function qb(e,n,t){var r,o,s;return function(){var i,a=t(this),l;return a==null?void this.removeAttributeNS(e.space,e.local):(i=this.getAttributeNS(e.space,e.local),l=a+"",i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a)))}}function jb(e,n){var t=Li(e),r=t==="transform"?xb:Kp;return this.attrTween(e,typeof n=="function"?(t.local?qb:Yb)(t,r,Gl(this,"attr."+e,n)):n==null?(t.local?Wb:Kb)(t):(t.local?Xb:Gb)(t,r,n))}function Zb(e,n){return function(t){this.setAttribute(e,n.call(this,t))}}function Jb(e,n){return function(t){this.setAttributeNS(e.space,e.local,n.call(this,t))}}function Qb(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&Jb(e,s)),t}return o._value=n,o}function e5(e,n){var t,r;function o(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&Zb(e,s)),t}return o._value=n,o}function n5(e,n){var t="attr."+e;if(arguments.length<2)return(t=this.tween(t))&&t._value;if(n==null)return this.tween(t,null);if(typeof n!="function")throw new Error;var r=Li(e);return this.tween(t,(r.local?Qb:e5)(r,n))}function t5(e,n){return function(){Wl(this,e).delay=+n.apply(this,arguments)}}function r5(e,n){return n=+n,function(){Wl(this,e).delay=n}}function o5(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?t5:r5)(n,e)):Gn(this.node(),n).delay}function s5(e,n){return function(){ct(this,e).duration=+n.apply(this,arguments)}}function i5(e,n){return n=+n,function(){ct(this,e).duration=n}}function a5(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?s5:i5)(n,e)):Gn(this.node(),n).duration}function l5(e,n){if(typeof n!="function")throw new Error;return function(){ct(this,e).ease=n}}function u5(e){var n=this._id;return arguments.length?this.each(l5(n,e)):Gn(this.node(),n).ease}function c5(e,n){return function(){var t=n.apply(this,arguments);if(typeof t!="function")throw new Error;ct(this,e).ease=t}}function d5(e){if(typeof e!="function")throw new Error;return this.each(c5(this._id,e))}function f5(e){typeof e!="function"&&(e=wp(e));for(var n=this._groups,t=n.length,r=new Array(t),o=0;o<t;++o)for(var s=n[o],i=s.length,a=r[o]=[],l,u=0;u<i;++u)(l=s[u])&&e.call(l,l.__data__,u,s)&&a.push(l);return new Mt(r,this._parents,this._name,this._id)}function p5(e){if(e._id!==this._id)throw new Error;for(var n=this._groups,t=e._groups,r=n.length,o=t.length,s=Math.min(r,o),i=new Array(r),a=0;a<s;++a)for(var l=n[a],u=t[a],d=l.length,f=i[a]=new Array(d),h,p=0;p<d;++p)(h=l[p]||u[p])&&(f[p]=h);for(;a<r;++a)i[a]=n[a];return new Mt(i,this._parents,this._name,this._id)}function h5(e){return(e+"").trim().split(/^|\s+/).every(function(n){var t=n.indexOf(".");return t>=0&&(n=n.slice(0,t)),!n||n==="start"})}function m5(e,n,t){var r,o,s=h5(n)?Wl:ct;return function(){var i=s(this,e),a=i.on;a!==r&&(o=(r=a).copy()).on(n,t),i.on=o}}function v5(e,n){var t=this._id;return arguments.length<2?Gn(this.node(),t).on.on(e):this.each(m5(t,e,n))}function _5(e){return function(){var n=this.parentNode;for(var t in this.__transition)if(+t!==e)return;n&&n.removeChild(this)}}function g5(){return this.on("end.remove",_5(this._id))}function y5(e){var n=this._name,t=this._id;typeof e!="function"&&(e=Ul(e));for(var r=this._groups,o=r.length,s=new Array(o),i=0;i<o;++i)for(var a=r[i],l=a.length,u=s[i]=new Array(l),d,f,h=0;h<l;++h)(d=a[h])&&(f=e.call(d,d.__data__,h,a))&&("__data__"in d&&(f.__data__=d.__data__),u[h]=f,Hi(u[h],n,t,h,u,Gn(d,t)));return new Mt(s,this._parents,n,t)}function C5(e){var n=this._name,t=this._id;typeof e!="function"&&(e=Ep(e));for(var r=this._groups,o=r.length,s=[],i=[],a=0;a<o;++a)for(var l=r[a],u=l.length,d,f=0;f<u;++f)if(d=l[f]){for(var h=e.call(d,d.__data__,f,l),p,I=Gn(d,t),P=0,x=h.length;P<x;++P)(p=h[P])&&Hi(p,n,t,P,h,I);s.push(h),i.push(d)}return new Mt(s,i,n,t)}var S5=Jo.prototype.constructor;function b5(){return new S5(this._groups,this._parents)}function E5(e,n){var t,r,o;return function(){var s=Lr(this,e),i=(this.style.removeProperty(e),Lr(this,e));return s===i?null:s===t&&i===r?o:o=n(t=s,r=i)}}function Wp(e){return function(){this.style.removeProperty(e)}}function w5(e,n,t){var r,o=t+"",s;return function(){var i=Lr(this,e);return i===o?null:i===r?s:s=n(r=i,t)}}function I5(e,n,t){var r,o,s;return function(){var i=Lr(this,e),a=t(this),l=a+"";return a==null&&(l=a=(this.style.removeProperty(e),Lr(this,e))),i===l?null:i===r&&l===o?s:(o=l,s=n(r=i,a))}}function P5(e,n){var t,r,o,s="style."+n,i="end."+s,a;return function(){var l=ct(this,e),u=l.on,d=l.value[s]==null?a||(a=Wp(n)):void 0;(u!==t||o!==d)&&(r=(t=u).copy()).on(i,o=d),l.on=r}}function $5(e,n,t){var r=(e+="")=="transform"?$b:Kp;return n==null?this.styleTween(e,E5(e,r)).on("end.style."+e,Wp(e)):typeof n=="function"?this.styleTween(e,I5(e,r,Gl(this,"style."+e,n))).each(P5(this._id,e)):this.styleTween(e,w5(e,r,n),t).on("end.style."+e,null)}function x5(e,n,t){return function(r){this.style.setProperty(e,n.call(this,r),t)}}function D5(e,n,t){var r,o;function s(){var i=n.apply(this,arguments);return i!==o&&(r=(o=i)&&x5(e,i,t)),r}return s._value=n,s}function M5(e,n,t){var r="style."+(e+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(n==null)return this.tween(r,null);if(typeof n!="function")throw new Error;return this.tween(r,D5(e,n,t??""))}function k5(e){return function(){this.textContent=e}}function T5(e){return function(){var n=e(this);this.textContent=n??""}}function V5(e){return this.tween("text",typeof e=="function"?T5(Gl(this,"text",e)):k5(e==null?"":e+""))}function N5(e){return function(n){this.textContent=e.call(this,n)}}function A5(e){var n,t;function r(){var o=e.apply(this,arguments);return o!==t&&(n=(t=o)&&N5(o)),n}return r._value=e,r}function F5(e){var n="text";if(arguments.length<1)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;return this.tween(n,A5(e))}function O5(){for(var e=this._name,n=this._id,t=Gp(),r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,u=0;u<a;++u)if(l=i[u]){var d=Gn(l,n);Hi(l,e,t,u,i,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new Mt(r,this._parents,e,t)}function B5(){var e,n,t=this,r=t._id,o=t.size();return new Promise(function(s,i){var a={value:i},l={value:function(){--o===0&&s()}};t.each(function(){var u=ct(this,r),d=u.on;d!==e&&(n=(e=d).copy(),n._.cancel.push(a),n._.interrupt.push(a),n._.end.push(l)),u.on=n}),o===0&&s()})}var R5=0;function Mt(e,n,t,r){this._groups=e,this._parents=n,this._name=t,this._id=r}function Gp(){return++R5}var mt=Jo.prototype;Mt.prototype={constructor:Mt,select:y5,selectAll:C5,selectChild:mt.selectChild,selectChildren:mt.selectChildren,filter:f5,merge:p5,selection:b5,transition:O5,call:mt.call,nodes:mt.nodes,node:mt.node,size:mt.size,empty:mt.empty,each:mt.each,on:v5,attr:jb,attrTween:n5,style:$5,styleTween:M5,text:V5,textTween:F5,remove:g5,tween:zb,delay:o5,duration:a5,ease:u5,easeVarying:d5,end:B5,[Symbol.iterator]:mt[Symbol.iterator]};function L5(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var U5={time:null,delay:0,duration:250,ease:L5};function H5(e,n){for(var t;!(t=e.__transition)||!(t=t[n]);)if(!(e=e.parentNode))throw new Error(`transition ${n} not found`);return t}function z5(e){var n,t;e instanceof Mt?(n=e._id,e=e._name):(n=Gp(),(t=U5).time=Kl(),e=e==null?null:e+"");for(var r=this._groups,o=r.length,s=0;s<o;++s)for(var i=r[s],a=i.length,l,u=0;u<a;++u)(l=i[u])&&Hi(l,e,n,u,i,t||H5(l,n));return new Mt(r,this._parents,e,n)}Jo.prototype.interrupt=Lb;Jo.prototype.transition=z5;const ys=e=>()=>e;function K5(e,{sourceEvent:n,target:t,transform:r,dispatch:o}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},target:{value:t,enumerable:!0,configurable:!0},transform:{value:r,enumerable:!0,configurable:!0},_:{value:o}})}function bt(e,n,t){this.k=e,this.x=n,this.y=t}bt.prototype={constructor:bt,scale:function(e){return e===1?this:new bt(this.k*e,this.x,this.y)},translate:function(e,n){return e===0&n===0?this:new bt(this.k,this.x+this.k*e,this.y+this.k*n)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var Xl=new bt(1,0,0);bt.prototype;function pa(e){e.stopImmediatePropagation()}function no(e){e.preventDefault(),e.stopImmediatePropagation()}function W5(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function G5(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function Rc(){return this.__zoom||Xl}function X5(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function Y5(){return navigator.maxTouchPoints||"ontouchstart"in this}function q5(e,n,t){var r=e.invertX(n[0][0])-t[0][0],o=e.invertX(n[1][0])-t[1][0],s=e.invertY(n[0][1])-t[0][1],i=e.invertY(n[1][1])-t[1][1];return e.translate(o>r?(r+o)/2:Math.min(0,r)||Math.max(0,o),i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i))}function j5(){var e=W5,n=G5,t=q5,r=X5,o=Y5,s=[0,1/0],i=[[-1/0,-1/0],[1/0,1/0]],a=250,l=Tb,u=Ll("start","zoom","end"),d,f,h,p=500,I=150,P=0,x=10;function N(v){v.property("__zoom",Rc).on("wheel.zoom",ae,{passive:!1}).on("mousedown.zoom",re).on("dblclick.zoom",X).filter(o).on("touchstart.zoom",Z).on("touchmove.zoom",k).on("touchend.zoom touchcancel.zoom",G).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}N.transform=function(v,K,S,z){var L=v.selection?v.selection():v;L.property("__zoom",Rc),v!==L?Q(v,K,S,z):L.interrupt().each(function(){ee(this,arguments).event(z).start().zoom(null,typeof K=="function"?K.apply(this,arguments):K).end()})},N.scaleBy=function(v,K,S,z){N.scaleTo(v,function(){var L=this.__zoom.k,W=typeof K=="function"?K.apply(this,arguments):K;return L*W},S,z)},N.scaleTo=function(v,K,S,z){N.transform(v,function(){var L=n.apply(this,arguments),W=this.__zoom,Y=S==null?O(L):typeof S=="function"?S.apply(this,arguments):S,se=W.invert(Y),oe=typeof K=="function"?K.apply(this,arguments):K;return t(D(U(W,oe),Y,se),L,i)},S,z)},N.translateBy=function(v,K,S,z){N.transform(v,function(){return t(this.__zoom.translate(typeof K=="function"?K.apply(this,arguments):K,typeof S=="function"?S.apply(this,arguments):S),n.apply(this,arguments),i)},null,z)},N.translateTo=function(v,K,S,z,L){N.transform(v,function(){var W=n.apply(this,arguments),Y=this.__zoom,se=z==null?O(W):typeof z=="function"?z.apply(this,arguments):z;return t(Xl.translate(se[0],se[1]).scale(Y.k).translate(typeof K=="function"?-K.apply(this,arguments):-K,typeof S=="function"?-S.apply(this,arguments):-S),W,i)},z,L)};function U(v,K){return K=Math.max(s[0],Math.min(s[1],K)),K===v.k?v:new bt(K,v.x,v.y)}function D(v,K,S){var z=K[0]-S[0]*v.k,L=K[1]-S[1]*v.k;return z===v.x&&L===v.y?v:new bt(v.k,z,L)}function O(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function Q(v,K,S,z){v.on("start.zoom",function(){ee(this,arguments).event(z).start()}).on("interrupt.zoom end.zoom",function(){ee(this,arguments).event(z).end()}).tween("zoom",function(){var L=this,W=arguments,Y=ee(L,W).event(z),se=n.apply(L,W),oe=S==null?O(se):typeof S=="function"?S.apply(L,W):S,me=Math.max(se[1][0]-se[0][0],se[1][1]-se[0][1]),be=L.__zoom,ue=typeof K=="function"?K.apply(L,W):K,pe=l(be.invert(oe).concat(me/be.k),ue.invert(oe).concat(me/ue.k));return function(_e){if(_e===1)_e=ue;else{var ke=pe(_e),Ne=me/ke[2];_e=new bt(Ne,oe[0]-ke[0]*Ne,oe[1]-ke[1]*Ne)}Y.zoom(null,_e)}})}function ee(v,K,S){return!S&&v.__zooming||new ne(v,K)}function ne(v,K){this.that=v,this.args=K,this.active=0,this.sourceEvent=null,this.extent=n.apply(v,K),this.taps=0}ne.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,K){return this.mouse&&v!=="mouse"&&(this.mouse[1]=K.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=K.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=K.invert(this.touch1[0])),this.that.__zoom=K,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var K=Lt(this.that).datum();u.call(v,this.that,new K5(v,{sourceEvent:this.sourceEvent,target:N,transform:this.that.__zoom,dispatch:u}),K)}};function ae(v,...K){if(!e.apply(this,arguments))return;var S=ee(this,K).event(v),z=this.__zoom,L=Math.max(s[0],Math.min(s[1],z.k*Math.pow(2,r.apply(this,arguments)))),W=At(v);if(S.wheel)(S.mouse[0][0]!==W[0]||S.mouse[0][1]!==W[1])&&(S.mouse[1]=z.invert(S.mouse[0]=W)),clearTimeout(S.wheel);else{if(z.k===L)return;S.mouse=[W,z.invert(W)],Ns(this),S.start()}no(v),S.wheel=setTimeout(Y,I),S.zoom("mouse",t(D(U(z,L),S.mouse[0],S.mouse[1]),S.extent,i));function Y(){S.wheel=null,S.end()}}function re(v,...K){if(h||!e.apply(this,arguments))return;var S=v.currentTarget,z=ee(this,K,!0).event(v),L=Lt(v.view).on("mousemove.zoom",oe,!0).on("mouseup.zoom",me,!0),W=At(v,S),Y=v.clientX,se=v.clientY;sb(v.view),pa(v),z.mouse=[W,this.__zoom.invert(W)],Ns(this),z.start();function oe(be){if(no(be),!z.moved){var ue=be.clientX-Y,pe=be.clientY-se;z.moved=ue*ue+pe*pe>P}z.event(be).zoom("mouse",t(D(z.that.__zoom,z.mouse[0]=At(be,S),z.mouse[1]),z.extent,i))}function me(be){L.on("mousemove.zoom mouseup.zoom",null),ib(be.view,z.moved),no(be),z.event(be).end()}}function X(v,...K){if(e.apply(this,arguments)){var S=this.__zoom,z=At(v.changedTouches?v.changedTouches[0]:v,this),L=S.invert(z),W=S.k*(v.shiftKey?.5:2),Y=t(D(U(S,W),z,L),n.apply(this,K),i);no(v),a>0?Lt(this).transition().duration(a).call(Q,Y,z,v):Lt(this).call(N.transform,Y,z,v)}}function Z(v,...K){if(e.apply(this,arguments)){var S=v.touches,z=S.length,L=ee(this,K,v.changedTouches.length===z).event(v),W,Y,se,oe;for(pa(v),Y=0;Y<z;++Y)se=S[Y],oe=At(se,this),oe=[oe,this.__zoom.invert(oe),se.identifier],L.touch0?!L.touch1&&L.touch0[2]!==oe[2]&&(L.touch1=oe,L.taps=0):(L.touch0=oe,W=!0,L.taps=1+!!d);d&&(d=clearTimeout(d)),W&&(L.taps<2&&(f=oe[0],d=setTimeout(function(){d=null},p)),Ns(this),L.start())}}function k(v,...K){if(this.__zooming){var S=ee(this,K).event(v),z=v.changedTouches,L=z.length,W,Y,se,oe;for(no(v),W=0;W<L;++W)Y=z[W],se=At(Y,this),S.touch0&&S.touch0[2]===Y.identifier?S.touch0[0]=se:S.touch1&&S.touch1[2]===Y.identifier&&(S.touch1[0]=se);if(Y=S.that.__zoom,S.touch1){var me=S.touch0[0],be=S.touch0[1],ue=S.touch1[0],pe=S.touch1[1],_e=(_e=ue[0]-me[0])*_e+(_e=ue[1]-me[1])*_e,ke=(ke=pe[0]-be[0])*ke+(ke=pe[1]-be[1])*ke;Y=U(Y,Math.sqrt(_e/ke)),se=[(me[0]+ue[0])/2,(me[1]+ue[1])/2],oe=[(be[0]+pe[0])/2,(be[1]+pe[1])/2]}else if(S.touch0)se=S.touch0[0],oe=S.touch0[1];else return;S.zoom("touch",t(D(Y,se,oe),S.extent,i))}}function G(v,...K){if(this.__zooming){var S=ee(this,K).event(v),z=v.changedTouches,L=z.length,W,Y;for(pa(v),h&&clearTimeout(h),h=setTimeout(function(){h=null},p),W=0;W<L;++W)Y=z[W],S.touch0&&S.touch0[2]===Y.identifier?delete S.touch0:S.touch1&&S.touch1[2]===Y.identifier&&delete S.touch1;if(S.touch1&&!S.touch0&&(S.touch0=S.touch1,delete S.touch1),S.touch0)S.touch0[1]=this.__zoom.invert(S.touch0[0]);else if(S.end(),S.taps===2&&(Y=At(Y,this),Math.hypot(f[0]-Y[0],f[1]-Y[1])<x)){var se=Lt(this).on("dblclick.zoom");se&&se.apply(this,arguments)}}}return N.wheelDelta=function(v){return arguments.length?(r=typeof v=="function"?v:ys(+v),N):r},N.filter=function(v){return arguments.length?(e=typeof v=="function"?v:ys(!!v),N):e},N.touchable=function(v){return arguments.length?(o=typeof v=="function"?v:ys(!!v),N):o},N.extent=function(v){return arguments.length?(n=typeof v=="function"?v:ys([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),N):n},N.scaleExtent=function(v){return arguments.length?(s[0]=+v[0],s[1]=+v[1],N):[s[0],s[1]]},N.translateExtent=function(v){return arguments.length?(i[0][0]=+v[0][0],i[1][0]=+v[1][0],i[0][1]=+v[0][1],i[1][1]=+v[1][1],N):[[i[0][0],i[0][1]],[i[1][0],i[1][1]]]},N.constrain=function(v){return arguments.length?(t=v,N):t},N.duration=function(v){return arguments.length?(a=+v,N):a},N.interpolate=function(v){return arguments.length?(l=v,N):l},N.on=function(){var v=u.on.apply(u,arguments);return v===u?N:v},N.clickDistance=function(v){return arguments.length?(P=(v=+v)*v,N):Math.sqrt(P)},N.tapDistance=function(v){return arguments.length?(x=+v,N):x},N}const Xp=Symbol("MiniMapSlots"),Z5=["id","x","y","rx","ry","width","height","fill","stroke","stroke-width","shape-rendering"],J5={name:"MiniMapNode",compatConfig:{MODE:3},inheritAttrs:!1},Q5=Be({...J5,props:{id:{},type:{},selected:{type:Boolean},dragging:{type:Boolean},position:{},dimensions:{},borderRadius:{},color:{},shapeRendering:{},strokeColor:{},strokeWidth:{},hidden:{type:Boolean}},emits:["click","dblclick","mouseenter","mousemove","mouseleave"],setup(e,{emit:n}){const t=e,r=Tn(Xp),o=bl(),s=We(()=>o.style??{});function i(f){n("click",f)}function a(f){n("dblclick",f)}function l(f){n("mouseenter",f)}function u(f){n("mousemove",f)}function d(f){n("mouseleave",f)}return(f,h)=>!f.hidden&&f.dimensions.width!==0&&f.dimensions.height!==0?(b(),T(de,{key:0},[le(r)[`node-${t.type}`]?(b(),Xe(er(le(r)[`node-${t.type}`]),p0(Mo({key:0},{...t,...f.$attrs})),null,16)):(b(),T("rect",Mo({key:1,id:f.id},f.$attrs,{class:["vue-flow__minimap-node",{selected:f.selected,dragging:f.dragging}],x:f.position.x,y:f.position.y,rx:f.borderRadius,ry:f.borderRadius,width:f.dimensions.width,height:f.dimensions.height,fill:f.color||s.value.background||s.value.backgroundColor,stroke:f.strokeColor,"stroke-width":f.strokeWidth,"shape-rendering":f.shapeRendering,onClick:i,onDblclick:a,onMouseenter:l,onMousemove:u,onMouseleave:d}),null,16,Z5))],64)):Ce("",!0)}}),eE=["width","height","viewBox","aria-labelledby"],nE=["id"],tE=["d","fill","stroke","stroke-width"],rE={name:"MiniMap",compatConfig:{MODE:3}},oE=Be({...rE,props:{nodeColor:{type:[String,Function],default:"#e2e2e2"},nodeStrokeColor:{type:[String,Function],default:"transparent"},nodeClassName:{type:[String,Function]},nodeBorderRadius:{default:5},nodeStrokeWidth:{default:2},maskColor:{default:"rgb(240, 240, 240, 0.6)"},maskStrokeColor:{default:"none"},maskStrokeWidth:{default:1},position:{default:"bottom-right"},pannable:{type:Boolean,default:!1},zoomable:{type:Boolean,default:!1},width:{},height:{},ariaLabel:{default:"Vue Flow mini map"},inversePan:{type:Boolean,default:!1},zoomStep:{default:1},offsetScale:{default:5},maskBorderRadius:{default:0}},emits:["click","nodeClick","nodeDblclick","nodeMouseenter","nodeMousemove","nodeMouseleave"],setup(e,{emit:n}){const t=Ud(),r=bl(),o=200,s=150,{id:i,edges:a,viewport:l,translateExtent:u,dimensions:d,emits:f,d3Selection:h,d3Zoom:p,getNodesInitialized:I}=Je(),P=Ee();lt(Xp,t);const x=We(()=>{var L;return e.width??((L=r.style)==null?void 0:L.width)??o}),N=We(()=>{var L;return e.height??((L=r.style)==null?void 0:L.height)??s}),U=typeof window>"u"||window.chrome?"crispEdges":"geometricPrecision",D=ie(()=>typeof e.nodeColor=="string"?()=>e.nodeColor:e.nodeColor),O=ie(()=>typeof e.nodeStrokeColor=="string"?()=>e.nodeStrokeColor:e.nodeStrokeColor),Q=ie(()=>typeof e.nodeClassName=="string"?()=>e.nodeClassName:typeof e.nodeClassName=="function"?e.nodeClassName:()=>""),ee=ie(()=>Fl(I.value.filter(L=>!L.hidden))),ne=ie(()=>({x:-l.value.x/l.value.zoom,y:-l.value.y/l.value.zoom,width:d.value.width/l.value.zoom,height:d.value.height/l.value.zoom})),ae=ie(()=>I.value&&I.value.length?Fg(ee.value,ne.value):ne.value),re=ie(()=>{const L=ae.value.width/x.value,W=ae.value.height/N.value;return Math.max(L,W)}),X=ie(()=>{const L=re.value*x.value,W=re.value*N.value,Y=e.offsetScale*re.value;return{offset:Y,x:ae.value.x-(L-ae.value.width)/2-Y,y:ae.value.y-(W-ae.value.height)/2-Y,width:L+Y*2,height:W+Y*2}}),Z=ie(()=>!X.value.x||!X.value.y?"":`
    M${X.value.x-X.value.offset},${X.value.y-X.value.offset}
    h${X.value.width+X.value.offset*2}
    v${X.value.height+X.value.offset*2}
    h${-X.value.width-X.value.offset*2}z
    M${ne.value.x+e.maskBorderRadius},${ne.value.y}
    h${ne.value.width-2*e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},${e.maskBorderRadius}
    v${ne.value.height-2*e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},${e.maskBorderRadius}
    h${-(ne.value.width-2*e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},-${e.maskBorderRadius}
    v${-(ne.value.height-2*e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},-${e.maskBorderRadius}z`);Q0(L=>{if(P.value){const W=Lt(P.value),Y=me=>{if(me.sourceEvent.type!=="wheel"||!h.value||!p.value)return;const be=me.sourceEvent.ctrlKey&&Uo()?10:1,ue=-me.sourceEvent.deltaY*(me.sourceEvent.deltaMode===1?.05:me.sourceEvent.deltaMode?1:.002)*e.zoomStep,pe=l.value.zoom*2**(ue*be);p.value.scaleTo(h.value,pe)},se=me=>{if(me.sourceEvent.type!=="mousemove"||!h.value||!p.value)return;const be=re.value*Math.max(1,l.value.zoom)*(e.inversePan?-1:1),ue={x:l.value.x-me.sourceEvent.movementX*be,y:l.value.y-me.sourceEvent.movementY*be},pe=[[0,0],[d.value.width,d.value.height]],_e=Xl.translate(ue.x,ue.y).scale(l.value.zoom),ke=p.value.constrain()(_e,pe,u.value);p.value.transform(h.value,ke)},oe=j5().wheelDelta(me=>Ga(me)*(e.zoomStep/10)).on("zoom",e.pannable?se:()=>{}).on("zoom.wheel",e.zoomable?Y:()=>{});W.call(oe),L(()=>{W.on("zoom",null)})}},{flush:"post"});function k(L){const[W,Y]=At(L);n("click",{event:L,position:{x:W,y:Y}})}function G(L,W){const Y={event:L,node:W,connectedEdges:tr([W],a.value)};f.miniMapNodeClick(Y),n("nodeClick",Y)}function v(L,W){const Y={event:L,node:W,connectedEdges:tr([W],a.value)};f.miniMapNodeDoubleClick(Y),n("nodeDblclick",Y)}function K(L,W){const Y={event:L,node:W,connectedEdges:tr([W],a.value)};f.miniMapNodeMouseEnter(Y),n("nodeMouseenter",Y)}function S(L,W){const Y={event:L,node:W,connectedEdges:tr([W],a.value)};f.miniMapNodeMouseMove(Y),n("nodeMousemove",Y)}function z(L,W){const Y={event:L,node:W,connectedEdges:tr([W],a.value)};f.miniMapNodeMouseLeave(Y),n("nodeMouseleave",Y)}return(L,W)=>(b(),Xe(le(yp),{position:L.position,class:fe(["vue-flow__minimap",{pannable:L.pannable,zoomable:L.zoomable}])},{default:Rn(()=>[(b(),T("svg",{ref_key:"el",ref:P,width:x.value,height:N.value,viewBox:[X.value.x,X.value.y,X.value.width,X.value.height].join(" "),role:"img","aria-labelledby":`vue-flow__minimap-${le(i)}`,onClick:k},[L.ariaLabel?(b(),T("title",{key:0,id:`vue-flow__minimap-${le(i)}`},R(L.ariaLabel),9,nE)):Ce("",!0),(b(!0),T(de,null,Me(le(I),Y=>(b(),Xe(Q5,{id:Y.id,key:Y.id,f:"",position:Y.computedPosition,dimensions:Y.dimensions,selected:Y.selected,dragging:Y.dragging,style:Ve(Y.style),class:fe(Q.value(Y)),color:D.value(Y),"border-radius":L.nodeBorderRadius,"stroke-color":O.value(Y),"stroke-width":L.nodeStrokeWidth,"shape-rendering":le(U),type:Y.type,hidden:Y.hidden,onClick:se=>G(se,Y),onDblclick:se=>v(se,Y),onMouseenter:se=>K(se,Y),onMousemove:se=>S(se,Y),onMouseleave:se=>z(se,Y)},null,8,["id","position","dimensions","selected","dragging","style","class","color","border-radius","stroke-color","stroke-width","shape-rendering","type","hidden","onClick","onDblclick","onMouseenter","onMousemove","onMouseleave"]))),128)),c("path",{class:"vue-flow__minimap-mask",d:Z.value,fill:L.maskColor,stroke:L.maskStrokeColor,"stroke-width":L.maskStrokeWidth,"fill-rule":"evenodd"},null,8,tE)],8,eE))]),_:1},8,["position","class"]))}}),wn={pink:"#e879f9",green:"#4ade80",amber:"#fbbf24",cyan:"#22d3ee",orange:"#f97316",blue:"#818cf8"},to={i2c:wn.pink,smbus:wn.green,jtag:wn.amber,hisport:wn.cyan,power:wn.orange,default:wn.blue},sE=[{type:"i2c",label:"I2C",color:wn.pink},{type:"smbus",label:"SMBus",color:wn.green},{type:"jtag",label:"JTAG",color:wn.amber},{type:"hisport",label:"HiSport",color:wn.cyan},{type:"trunk",label:"内部总线",color:wn.blue}],Oe=(e,n)=>({chipType:e,label:n??e}),po=(e,n,t="PCA9545")=>({label:t,channels:e,chips:n});function pn(e,n,t={}){return{id:e,label:e,busType:"i2c",color:wn.pink,chips:n,...t}}function iE(e,n,t={}){return{id:e,label:e,busType:"smbus",color:wn.green,chips:n,...t}}function Lc(e,n,t={}){return{id:e,label:e,busType:"jtag",color:wn.amber,chips:n,...t}}function Wt(e,n={}){return{id:e,label:e,busType:"hisport",color:wn.cyan,chips:[],...n}}const Yp={boardLabel:"BMC",buses:[pn("i2cbus_1",[Oe("Smc","SMC")]),Wt("Hisport_0"),Wt("Hisport_1")]},aE={boardLabel:"EXU · ExpBoard",buses:[pn("I2c_1",[Oe("Eeprom"),Oe("Smc","SMC"),Oe("Cpld","CPLD")],{mux:po(4,[Oe("Lm75","LM75")])}),pn("I2c_2",[],{mux:po(4,[Oe("Cpld","CPLD"),Oe("Cpld","CPLD"),Oe("Cpld","CPLD"),Oe("Cpld","CPLD")])}),pn("I2c_3",[],{mux:po(4,[])}),Lc("JTAG_1",[Oe("Cpld","CPLD")]),Wt("JtagOverLocalBus",{label:"JtagOverLocalBus"}),pn("I2c_5",[]),pn("I2c_6",[Oe("Eeprom"),Oe("Smc","SMC"),Oe("Lm75","LM75")],{mux:po(4,[])}),pn("I2c_8-16",[],{dashed:!0}),Lc("JTAG_2-8",[],{dashed:!0}),Wt("Hisport × 22",{label:"Hisport × 22"})]},lE={boardLabel:"BCU · CpuBoard",buses:[pn("I2c_1",[Oe("Eeprom")],{mux:po(6,[Oe("CPU"),Oe("CPU"),Oe("CPU"),Oe("CPU"),Oe("Eeprom"),Oe("Eeprom")])}),iE("I2c_2",[Oe("Smc","SMC"),Oe("Smc","SMC")]),pn("I2c_3",[],{dashed:!0}),Wt("HiSport_1"),Wt("HiSport_2")]},uE={boardLabel:"CLU · FanBoard",buses:[pn("I2c_1",[Oe("CPU"),Oe("Eeprom")])]},cE={boardLabel:"IEU · RiserCard",buses:[pn("I2c_1",[Oe("Eeprom"),Oe("Eeprom")]),pn("I2c_3",[Oe("Eeprom"),Oe("Eeprom")]),pn("I2c_r",[Oe("CPU"),Oe("Eeprom")]),Wt("HiSport")]},dE={boardLabel:"SEU · HddBackplane",buses:[pn("I2c_1",[Oe("CPU"),Oe("CPU"),Oe("CPU")]),pn("I2c_2",[Oe("Smc","SMC"),Oe("Smc","SMC")])]},fE={boardLabel:"SEU · M2TransferCard",buses:[pn("I2c_1",[Oe("Eeprom"),Oe("CPU")])]},pE={boardLabel:"NICCard · BoardNICCard",buses:[pn("I2c_1",[Oe("CPU"),Oe("CPU"),Oe("CPU")]),Wt("HiSport")]},hE={boardLabel:"未分类板卡",buses:[]};function Gr(e,n){return e==="BMC"?Yp:e==="EXU"?aE:e==="BCU"?lE:e==="CLU"?uE:e==="IEU"?cE:e==="SEU"&&n.startsWith("M2")?fE:e==="SEU"?dE:e==="NICCard"?pE:hE}const mE=["width","height"],vE=["d","stroke"],_E=["onPointerdown"],gE={width:"13",height:"13",viewBox:"0 0 13 13",style:{"flex-shrink":"0"}},yE={class:"bus-abbr"},CE={class:"bus-name"},SE=["onPointerdown","onClick"],bE={class:"chip-lbl"},EE=["onPointerdown","onClick"],wE={class:"mux-lbl"},IE={class:"mux-handles"},PE={key:0,class:"mux-handle mux-more"},$E=["onPointerdown","onClick"],xE={class:"chip-lbl"},ha=118,Uc=22,Sr=60,ma=34,va=72,ro=46,_a=8,Zt=14,Hc=10,DE=16,ME=Be({__name:"MiniTopology",props:{buses:{}},emits:["chipClick"],setup(e,{emit:n}){const t=e,r=n,o={i2c:"I2C",smbus:"SMB",hisport:"HSP",jtag:"JTAG"},s=re=>o[re.busType]??re.busType,i=ha+8,a=Uc/2,l=re=>`bus:${re}`,u=(re,X)=>`chip:${re}:${X}`,d=re=>`mux:${re}`,f=(re,X)=>`fchip:${re}:${X}`;function h(re){const X={};let Z=0;for(const k of re){X[l(k.id)]={x:0,y:Z};const G=Z+a;let v=ma;if(k.chips.forEach((K,S)=>{X[u(k.id,S)]={x:i+S*(Sr+_a),y:G+Zt}}),k.mux){const K=i+k.chips.length*(Sr+_a);if(X[d(k.id)]={x:K,y:G+Zt},k.mux.chips.length>0){const S=G+Zt+ro+Hc;k.mux.chips.forEach((z,L)=>{X[f(k.id,L)]={x:K+L*(Sr+_a),y:S+Zt}}),v=ro+Hc+Zt+ma}else v=ro}else k.chips.length===0&&(v=0);Z+=a+Zt+v+DE}return X}const p=Ee({});Fe(()=>t.buses,re=>{p.value=h(re)},{immediate:!0});const I=ie(()=>{let re=100;for(const[X,Z]of Object.entries(p.value)){const k=X.startsWith("bus:")?Uc:X.startsWith("mux:")?ro:ma;re=Math.max(re,Z.y+k)}return re+20}),P=ie(()=>{let re=200;for(const[X,Z]of Object.entries(p.value)){const k=X.startsWith("mux:")?va:X.startsWith("bus:")?ha:Sr;re=Math.max(re,Z.x+k)}return re+20}),x=ie(()=>{const re=[];for(const X of t.buses){const Z=p.value[l(X.id)];if(!Z)continue;const k=Z.y+a,G=Z.x+ha,v=[...X.chips.map((K,S)=>({key:u(X.id,S),w:Sr})),...X.mux?[{key:d(X.id),w:va}]:[]];if(v.length>0){const K=v.map(L=>p.value[L.key]),S=K.map((L,W)=>L?L.x+v[W].w/2:G),z=Math.max(G,...S);re.push({d:`M ${G} ${k} L ${z} ${k}`,color:X.color}),v.forEach((L,W)=>{const Y=K[W];if(!Y)return;const se=Y.x+L.w/2;re.push({d:`M ${se} ${k} L ${se} ${Y.y}`,color:X.color})})}if(X.mux&&X.mux.chips.length>0){const K=p.value[d(X.id)];if(!K)continue;const S=K.x+va/2,z=K.y+ro,L=X.mux.chips.map((oe,me)=>({key:f(X.id,me),w:Sr})),W=L.map(oe=>p.value[oe.key]),Y=W.map((oe,me)=>oe?oe.x+L[me].w/2:S),se=Math.min(...W.filter(Boolean).map(oe=>oe.y))-Zt;if(W.some(Boolean)){const oe=Math.min(...Y),me=Math.max(...Y);re.push({d:`M ${S} ${z} L ${S} ${se}`,color:"#a855f7"}),re.push({d:`M ${oe} ${se} L ${me} ${se}`,color:"#a855f7"}),L.forEach((be,ue)=>{const pe=W[ue];if(!pe)return;const _e=pe.x+be.w/2;re.push({d:`M ${_e} ${se} L ${_e} ${pe.y}`,color:"#a855f7"})})}}}return re}),N=Ee(null),U=Ee(null),D=Ee(!1);function O(re,X){X.stopPropagation(),X.preventDefault();const Z=p.value[re];Z&&(D.value=!1,N.value={key:re,startX:X.clientX,startY:X.clientY,origX:Z.x,origY:Z.y},U.value=re)}function Q(re){const X=N.value;X&&(Math.abs(re.clientX-X.startX)+Math.abs(re.clientY-X.startY)>4&&(D.value=!0),p.value={...p.value,[X.key]:{x:X.origX+re.clientX-X.startX,y:X.origY+re.clientY-X.startY}})}function ee(re){D.value||r("chipClick",re)}function ne(){N.value=null,U.value=null}Mn(()=>{document.addEventListener("pointermove",Q),document.addEventListener("pointerup",ne)}),Wr(()=>{document.removeEventListener("pointermove",Q),document.removeEventListener("pointerup",ne)});function ae(){p.value=h(t.buses)}return(re,X)=>(b(),T("div",{class:fe(["mt-root",{"is-dragging":!!N.value}]),style:Ve({height:I.value+"px",width:P.value+"px"})},[(b(),T("svg",{class:"wire-svg",width:P.value,height:I.value},[(b(!0),T(de,null,Me(x.value,(Z,k)=>(b(),T("path",{key:k,d:Z.d,stroke:Z.color+"cc","stroke-width":"1.5",fill:"none","stroke-linecap":"round"},null,8,vE))),128))],8,mE)),(b(!0),T(de,null,Me(e.buses,Z=>{var k,G,v,K;return b(),T(de,{key:Z.id},[c("div",{class:fe(["bus-pill draggable-item",{"item-hot":U.value===l(Z.id),"bus-dashed":Z.dashed}]),style:Ve({left:(((k=p.value[l(Z.id)])==null?void 0:k.x)??0)+"px",top:(((G=p.value[l(Z.id)])==null?void 0:G.y)??0)+"px",borderColor:Z.color,background:Z.color,color:"#fff"}),onPointerdown:S=>O(l(Z.id),S)},[(b(),T("svg",gE,[...X[1]||(X[1]=[c("circle",{cx:"6.5",cy:"6.5",r:"5.5",stroke:"rgba(255,255,255,0.9)","stroke-width":"1.5",fill:"none"},null,-1),c("circle",{cx:"6.5",cy:"6.5",r:"2.5",fill:"rgba(255,255,255,0.9)"},null,-1)])])),c("span",yE,R(s(Z)),1),c("span",CE,R(Z.label),1)],46,_E),(b(!0),T(de,null,Me(Z.chips,(S,z)=>{var L,W;return b(),T("div",{key:u(Z.id,z),class:fe(["chip-card draggable-item",{"item-hot":U.value===u(Z.id,z),"bus-dashed":Z.dashed}]),style:Ve({left:(((L=p.value[u(Z.id,z)])==null?void 0:L.x)??0)+"px",top:(((W=p.value[u(Z.id,z)])==null?void 0:W.y)??0)+"px"}),onPointerdown:Y=>O(u(Z.id,z),Y),onClick:en(Y=>ee({label:S.label,chipType:S.chipType}),["stop"])},[c("div",bE,R(S.label),1)],46,SE)}),128)),Z.mux?(b(),T(de,{key:0},[c("div",{class:fe(["mux-card draggable-item",{"item-hot":U.value===d(Z.id)}]),style:Ve({left:(((v=p.value[d(Z.id)])==null?void 0:v.x)??0)+"px",top:(((K=p.value[d(Z.id)])==null?void 0:K.y)??0)+"px"}),onPointerdown:S=>O(d(Z.id),S),onClick:en(S=>ee({label:Z.mux.label,chipType:"Pca9545"}),["stop"])},[c("div",wE,R(Z.mux.label),1),c("div",IE,[(b(!0),T(de,null,Me(Math.min(Z.mux.channels,6),S=>(b(),T("span",{key:S,class:"mux-handle"},R(S-1),1))),128)),Z.mux.channels>6?(b(),T("span",PE,"…")):Ce("",!0)])],46,EE),(b(!0),T(de,null,Me(Z.mux.chips,(S,z)=>{var L,W;return b(),T("div",{key:f(Z.id,z),class:fe(["chip-card draggable-item",{"item-hot":U.value===f(Z.id,z)}]),style:Ve({left:(((L=p.value[f(Z.id,z)])==null?void 0:L.x)??0)+"px",top:(((W=p.value[f(Z.id,z)])==null?void 0:W.y)??0)+"px"}),onPointerdown:Y=>O(f(Z.id,z),Y),onClick:en(Y=>ee({label:S.label,chipType:S.chipType}),["stop"])},[c("div",xE,R(S.label),1)],46,$E)}),128))],64)):Ce("",!0)],64)}),128)),c("button",{class:"reset-btn",title:"重置元素位置",onPointerdown:X[0]||(X[0]=en(()=>{},["stop"])),onClick:ae},"↺ 重置",32)],6))}}),Xn=(e,n)=>{const t=e.__vccOpts||e;for(const[r,o]of n)t[r]=o;return t},qp=Xn(ME,[["__scopeId","data-v-62713b25"]]),kE={class:"board-tag"},TE={class:"bmc-sub"},VE={class:"bmc-topo-section"},NE=Be({__name:"BmcNode",props:{id:{},type:{},selected:{type:Boolean},connectable:{type:[Boolean,Number,String,Function]},position:{},dimensions:{},label:{},isValidTargetPos:{type:Function},isValidSourcePos:{type:Function},parent:{},parentNodeId:{},dragging:{type:Boolean},resizing:{type:Boolean},zIndex:{},targetPosition:{},sourcePosition:{},dragHandle:{},data:{},events:{}},setup(e){const n=e,t=Yp;return(r,o)=>(b(),T("div",{class:fe(["bmc-node",{"is-selected":n.selected}])},[c("div",kE,R(n.data.label??"BMC"),1),c("div",TE,R(n.data.subtitle??"根节点 · openUBMC"),1),c("div",VE,[o[0]||(o[0]=c("div",{class:"bmc-topo-label"},"I2C 拓扑",-1)),Le(qp,{buses:le(t).buses},null,8,["buses"])]),Le(le(Ht),{type:"source",position:le(xe).Right,id:"r",style:{width:"8px",height:"8px",background:"#4f6ef7",border:"2px solid #0b0d12",right:"-5px"}},null,8,["position"])],2))}}),AE=Xn(NE,[["__scopeId","data-v-2bc052d0"]]),Yl=[{id:"14060876_00000001020302031825",partNumber:"14060876",sn:"00000001020302031825",type:"BCU",name:"CpuBoard_1",files:["14060876_00000001020302031825.sr","14060876_00000001020302031825_soft.sr"],connectors:[{name:"Connector_A1a",type:""},{name:"Connector_A1c",type:"PCIeRiserCard"},{name:"Connector_A2a",type:"PCIeRiserCard"},{name:"Connector_A2c",type:"PCIeRiserCard"},{name:"Connector_A3a",type:""},{name:"Connector_A4a",type:""},{name:"Connector_B1a",type:""},{name:"Connector_B2a",type:""},{name:"Connector_B3a",type:"PCIeRiserCard"},{name:"Connector_B3c",type:""},{name:"Connector_B4a",type:"PCIeRiserCard"},{name:"Connector_B4c",type:""},{name:"Connector_C4a",type:"PCIeRiserCard"},{name:"Connector_C5a",type:"PCIeRiserCard"},{name:"Connector_C6a",type:""},{name:"Connector_C7b",type:""},{name:"Connector_D4b",type:""},{name:"Connector_D5a",type:"PCIeRiserCard"},{name:"Connector_D6a",type:""},{name:"Connector_D7a",type:"PCIeRiserCard"},{name:"Connector_TrustedModule",type:"SecurityModule"}],topoKey:"Connector_A1a|Connector_A1c|Connector_A2a|Connector_A2c|Connector_A3a|Connector_A4a|Connector_B1a|Connector_B2a|Connector_B3a|Connector_B3c|Connector_B4a|Connector_B4c|Connector_C4a|Connector_C5a|Connector_C6a|Connector_C7b|Connector_D4b|Connector_D5a|Connector_D6a|Connector_D7a|Connector_TrustedModule",topoLabel:"A1a + 9×PCIeRiserCard + A3a + A4a + B1a + B2a + B3c + B4c + C6a + C7b + D4b + D6a + SecurityModule"},{id:"14100363_00000001050302023924",partNumber:"14100363",sn:"00000001050302023924",type:"CLU",name:"FanBoard_1",files:["14100363_00000001050302023924.sr","14100363_00000001050302023924_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100513_00000001010302044491",partNumber:"14100513",sn:"00000001010302044491",type:"EXU",name:"ExpBoard_1",files:["14100513_00000001010302044491.sr","14100513_00000001010302044491_soft.sr"],connectors:[{name:"Connector_PSR_EEP",type:""},{name:"Connector_BCU_1",type:"CPUBoard"},{name:"Connector_SEU_1",type:"DiskBackplane"},{name:"Connector_SEU_2",type:"DiskBackplane"},{name:"Connector_CLU_1",type:"FanBackplane"},{name:"Connector_LOM_1",type:""},{name:"Connector_LOM_2",type:""},{name:"Connector_OCP_1",type:""},{name:"Connector_OCP_2",type:""},{name:"Connector_PowerSupply_1",type:"Psu"},{name:"Connector_PowerSupply_2",type:"Psu"}],topoKey:"Connector_BCU_1|Connector_CLU_1|Connector_LOM_1|Connector_LOM_2|Connector_OCP_1|Connector_OCP_2|Connector_PSR_EEP|Connector_PowerSupply_1|Connector_PowerSupply_2|Connector_SEU_1|Connector_SEU_2",topoLabel:"PSR_EEP + CPUBoard + 2×DiskBackplane + FanBackplane + 4×NIC + 2×Psu"},{id:"14100513_00000001010302044492",partNumber:"14100513",sn:"00000001010302044492",type:"EXU",name:"ExpBoard_1",files:["14100513_00000001010302044492.sr","14100513_00000001010302044492_soft.sr"],connectors:[{name:"Connector_PSR_EEP",type:""},{name:"Connector_BCU_1",type:"CPUBoard"},{name:"Connector_SEU_1",type:"DiskBackplane"},{name:"Connector_SEU_2",type:"DiskBackplane"},{name:"Connector_SEU_3",type:"DiskBackplane"},{name:"Connector_CLU_1",type:"FanBackplane"},{name:"Connector_LOM_1",type:""},{name:"Connector_LOM_2",type:""},{name:"Connector_OCP_1",type:""},{name:"Connector_OCP_2",type:""},{name:"Connector_PowerSupply_1",type:"Psu"},{name:"Connector_PowerSupply_2",type:"Psu"}],topoKey:"Connector_BCU_1|Connector_CLU_1|Connector_LOM_1|Connector_LOM_2|Connector_OCP_1|Connector_OCP_2|Connector_PSR_EEP|Connector_PowerSupply_1|Connector_PowerSupply_2|Connector_SEU_1|Connector_SEU_2|Connector_SEU_3",topoLabel:"PSR_EEP + CPUBoard + 3×DiskBackplane + FanBackplane + 4×NIC + 2×Psu"},{id:"14100513_000000010402580311",partNumber:"14100513",sn:"000000010402580311",type:"IEU",name:"RiserCard_1",files:["14100513_000000010402580311.sr","14100513_000000010402580311_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT2",type:"PCIe"},{name:"Connector_PCIE_SLOT3",type:"PCIe"}],topoKey:"Connector_PCIE_SLOT2|Connector_PCIE_SLOT3",topoLabel:"2×PCIe"},{id:"14100513_000000010402580324",partNumber:"14100513",sn:"000000010402580324",type:"IEU",name:"RiserCard_1",files:["14100513_000000010402580324.sr","14100513_000000010402580324_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT1",type:"PCIe"},{name:"Connector_PCIE_SLOT2",type:"PCIe"}],topoKey:"Connector_PCIE_SLOT1|Connector_PCIE_SLOT2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302023945",partNumber:"14100513",sn:"00000001040302023945",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302023945.sr","14100513_00000001040302023945_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302023947",partNumber:"14100513",sn:"00000001040302023947",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302023947.sr","14100513_00000001040302023947_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302023953",partNumber:"14100513",sn:"00000001040302023953",type:"Unknown",name:"Unknown",files:["14100513_00000001040302023953.sr","14100513_00000001040302023953_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100513_00000001040302025554",partNumber:"14100513",sn:"00000001040302025554",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302025554.sr","14100513_00000001040302025554_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302044498",partNumber:"14100513",sn:"00000001040302044498",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044498.sr","14100513_00000001040302044498_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT1",type:"PCIe"},{name:"Connector_PCIE_SLOT2",type:"PCIe"},{name:"Connector_PCIE_SLOT3",type:"PCIe"}],topoKey:"Connector_PCIE_SLOT1|Connector_PCIE_SLOT2|Connector_PCIE_SLOT3",topoLabel:"3×PCIe"},{id:"14100513_00000001040302044499",partNumber:"14100513",sn:"00000001040302044499",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044499.sr","14100513_00000001040302044499_soft.sr"],connectors:[{name:"Connector_PCIE_SLOT1",type:"PCIe"},{name:"Connector_PCIE_SLOT2",type:"PCIe"},{name:"Connector_PCIE_SLOT2TianChi",type:"PCIeTianchi"},{name:"Connector_PCIE_SLOT3",type:"PCIe"},{name:"Connector_PCIE_SLOT3TianChi",type:"PCIeTianchi"}],topoKey:"Connector_PCIE_SLOT1|Connector_PCIE_SLOT2|Connector_PCIE_SLOT2TianChi|Connector_PCIE_SLOT3|Connector_PCIE_SLOT3TianChi",topoLabel:"3×PCIe + 2×PCIeTianchi"},{id:"14100513_00000001040302044501",partNumber:"14100513",sn:"00000001040302044501",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044501.sr","14100513_00000001040302044501_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302044502",partNumber:"14100513",sn:"00000001040302044502",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044502.sr","14100513_00000001040302044502_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302044504",partNumber:"14100513",sn:"00000001040302044504",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302044504.sr","14100513_00000001040302044504_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302046567",partNumber:"14100513",sn:"00000001040302046567",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302046567.sr","14100513_00000001040302046567_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302046572",partNumber:"14100513",sn:"00000001040302046572",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302046572.sr","14100513_00000001040302046572_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_2",type:"PCIe"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2",topoLabel:"2×PCIe"},{id:"14100513_00000001040302046574",partNumber:"14100513",sn:"00000001040302046574",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302046574.sr","14100513_00000001040302046574_soft.sr"],connectors:[{name:"Connector_PCIE_1",type:"PCIe"}],topoKey:"Connector_PCIE_1",topoLabel:"PCIe"},{id:"14100513_00000001040302052957",partNumber:"14100513",sn:"00000001040302052957",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302052957.sr","14100513_00000001040302052957_soft.sr"],connectors:[{name:"Connector_PCIE_2",type:"PCIe"},{name:"Connector_PCIE_SLOT2TianChi",type:"PCIeTianchi"}],topoKey:"Connector_PCIE_2|Connector_PCIE_SLOT2TianChi",topoLabel:"PCIe + PCIeTianchi"},{id:"14100513_00000001040302066464",partNumber:"14100513",sn:"00000001040302066464",type:"IEU",name:"RiserCard_1",files:["14100513_00000001040302066464.sr","14100513_00000001040302066464_soft.sr"],connectors:[{name:"Connector_PCIE_2",type:"PCIe"},{name:"Connector_PCIE_1",type:"PCIe"},{name:"Connector_PCIE_SLOT1TianChi",type:"PCIeTianchi"},{name:"Connector_PCIE_SLOT2TianChi",type:"PCIeTianchi"}],topoKey:"Connector_PCIE_1|Connector_PCIE_2|Connector_PCIE_SLOT1TianChi|Connector_PCIE_SLOT2TianChi",topoLabel:"2×PCIe + 2×PCIeTianchi"},{id:"14100665_00000001030302023925",partNumber:"14100665",sn:"00000001030302023925",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023925.sr","14100665_00000001030302023925_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100665_00000001030302023933",partNumber:"14100665",sn:"00000001030302023933",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023933.sr","14100665_00000001030302023933_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"},{name:"Connector_ComVPDConnect_5",type:"NVMe"},{name:"Connector_ComVPDConnect_6",type:"NVMe"},{name:"Connector_ComVPDConnect_7",type:"NVMe"},{name:"Connector_ComVPDConnect_8",type:"NVMe"},{name:"Connector_ComVPDConnect_9",type:"NVMe"},{name:"Connector_ComVPDConnect_10",type:"NVMe"},{name:"Connector_ComVPDConnect_11",type:"NVMe"},{name:"Connector_ComVPDConnect_12",type:"NVMe"},{name:"Connector_ComVPDConnect_13",type:"NVMe"},{name:"Connector_ComVPDConnect_14",type:"NVMe"},{name:"Connector_ComVPDConnect_15",type:"NVMe"},{name:"Connector_ComVPDConnect_16",type:"NVMe"},{name:"Connector_ComVPDConnect_17",type:"NVMe"},{name:"Connector_ComVPDConnect_18",type:"NVMe"},{name:"Connector_ComVPDConnect_19",type:"NVMe"},{name:"Connector_ComVPDConnect_20",type:"NVMe"},{name:"Connector_ComVPDConnect_21",type:"NVMe"},{name:"Connector_ComVPDConnect_22",type:"NVMe"},{name:"Connector_ComVPDConnect_23",type:"NVMe"},{name:"Connector_ComVPDConnect_24",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_10|Connector_ComVPDConnect_11|Connector_ComVPDConnect_12|Connector_ComVPDConnect_13|Connector_ComVPDConnect_14|Connector_ComVPDConnect_15|Connector_ComVPDConnect_16|Connector_ComVPDConnect_17|Connector_ComVPDConnect_18|Connector_ComVPDConnect_19|Connector_ComVPDConnect_2|Connector_ComVPDConnect_20|Connector_ComVPDConnect_21|Connector_ComVPDConnect_22|Connector_ComVPDConnect_23|Connector_ComVPDConnect_24|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4|Connector_ComVPDConnect_5|Connector_ComVPDConnect_6|Connector_ComVPDConnect_7|Connector_ComVPDConnect_8|Connector_ComVPDConnect_9",topoLabel:"24×NVMe"},{id:"14100665_00000001030302023934",partNumber:"14100665",sn:"00000001030302023934",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023934.sr","14100665_00000001030302023934_soft.sr"],connectors:[{name:"Connector_SEU_Inner_1",type:"DiskBackplane"},{name:"Connector_SEU_Inner_2",type:"DiskBackplane"}],topoKey:"Connector_SEU_Inner_1|Connector_SEU_Inner_2",topoLabel:"2×DiskBackplane"},{id:"14100665_00000001030302023936",partNumber:"14100665",sn:"00000001030302023936",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023936.sr","14100665_00000001030302023936_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"},{name:"Connector_SEU_Inner_1",type:"DiskBackplane"},{name:"Connector_SEU_Inner_2",type:"DiskBackplane"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4|Connector_SEU_Inner_1|Connector_SEU_Inner_2",topoLabel:"4×NVMe + 2×DiskBackplane"},{id:"14100665_00000001030302023938",partNumber:"14100665",sn:"00000001030302023938",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302023938.sr","14100665_00000001030302023938_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"},{name:"Connector_ComVPDConnect_5",type:"NVMe"},{name:"Connector_ComVPDConnect_6",type:"NVMe"},{name:"Connector_ComVPDConnect_7",type:"NVMe"},{name:"Connector_ComVPDConnect_8",type:"NVMe"},{name:"Connector_ComVPDConnect_9",type:"NVMe"},{name:"Connector_ComVPDConnect_10",type:"NVMe"},{name:"Connector_ComVPDConnect_11",type:"NVMe"},{name:"Connector_ComVPDConnect_12",type:"NVMe"},{name:"Connector_ComVPDConnect_13",type:"NVMe"},{name:"Connector_ComVPDConnect_14",type:"NVMe"},{name:"Connector_ComVPDConnect_15",type:"NVMe"},{name:"Connector_ComVPDConnect_16",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_10|Connector_ComVPDConnect_11|Connector_ComVPDConnect_12|Connector_ComVPDConnect_13|Connector_ComVPDConnect_14|Connector_ComVPDConnect_15|Connector_ComVPDConnect_16|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4|Connector_ComVPDConnect_5|Connector_ComVPDConnect_6|Connector_ComVPDConnect_7|Connector_ComVPDConnect_8|Connector_ComVPDConnect_9",topoLabel:"16×NVMe"},{id:"14100665_00000001030302023954",partNumber:"14100665",sn:"00000001030302023954",type:"SEU",name:"M2TransferCard_1",files:["14100665_00000001030302023954.sr","14100665_00000001030302023954_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14100665_00000001030302024340",partNumber:"14100665",sn:"00000001030302024340",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302024340.sr","14100665_00000001030302024340_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4",topoLabel:"4×NVMe"},{id:"14100665_00000001030302044496",partNumber:"14100665",sn:"00000001030302044496",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302044496.sr","14100665_00000001030302044496_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4",topoLabel:"4×NVMe"},{id:"14100665_00000001030302046566",partNumber:"14100665",sn:"00000001030302046566",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302046566.sr","14100665_00000001030302046566_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"},{name:"Connector_ComVPDConnect_3",type:"NVMe"},{name:"Connector_ComVPDConnect_4",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2|Connector_ComVPDConnect_3|Connector_ComVPDConnect_4",topoLabel:"4×NVMe"},{id:"14100665_00000001030302046571",partNumber:"14100665",sn:"00000001030302046571",type:"SEU",name:"HddBackplane_1",files:["14100665_00000001030302046571.sr","14100665_00000001030302046571_soft.sr"],connectors:[{name:"Connector_ComVPDConnect_1",type:"NVMe"},{name:"Connector_ComVPDConnect_2",type:"NVMe"}],topoKey:"Connector_ComVPDConnect_1|Connector_ComVPDConnect_2",topoLabel:"2×NVMe"},{id:"14220246_00000001100302023955",partNumber:"14220246",sn:"00000001100302023955",type:"NICCard",name:"BoardNICCard_1",files:["14220246_00000001100302023955.sr","14220246_00000001100302023955_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14220246_00000001100302023956",partNumber:"14220246",sn:"00000001100302023956",type:"NICCard",name:"BoardNICCard_1",files:["14220246_00000001100302023956.sr","14220246_00000001100302023956_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"},{id:"14220246_00000001100302025549",partNumber:"14220246",sn:"00000001100302025549",type:"NICCard",name:"BoardNICCard_1",files:["14220246_00000001100302025549.sr","14220246_00000001100302025549_soft.sr"],connectors:[],topoKey:"",topoLabel:"无下游连接器"}],ui={BCU:"CPU 板 (BCU)",CLU:"风扇板 (CLU)",EXU:"拓展板 (EXU)",IEU:"Riser 卡 (IEU)",SEU:"存储/转接板 (SEU)",NICCard:"网卡 (NICCard)",Unknown:"未分类板卡"};function sl(e){const n=new Map;for(const o of e){const s=o.topoKey??"";n.has(s)||n.set(s,[]),n.get(s).push(o)}const t=[...n.entries()].sort((o,s)=>s[1].length-o[1].length),r="ABCDEFGHIJKLMNOPQRSTUVWXYZ";return t.map(([o,s],i)=>{var a;return{key:o,letter:r[i]??String(i+1),label:((a=s[0])==null?void 0:a.topoLabel)??(o||"标准结构"),boards:s}})}function FE(e=Yl){const n=s=>`${s.type}__${s.name}`,t=new Map;for(const s of e){const i=n(s);t.has(i)||t.set(i,[]),t.get(i).push(s)}const r=[];for(const[s,i]of t){const a=i[0].type,l=i[0].name,u=a==="EXU",d=a==="Unknown",f=a==="Unknown"?"未分类":a,h=ui[a]??a,p=u?h:d?ui.Unknown:`${h} · ${l}`;r.push({id:`grp-${a}-${l}`.replace(/[^A-Za-z0-9_-]/g,"_"),type:a,name:l,label:p,shortLabel:f,boards:i,topoVariants:sl(i),category:u?"exu":d?"unknown":"child",state:d?"unclassified":"resolved"})}const o=["BCU","CLU","IEU","SEU","NICCard","Unknown"];return r.sort((s,i)=>{const a=o.indexOf(s.type),l=o.indexOf(i.type);return a!==l?(a===-1?999:a)-(l===-1?999:l):s.name.localeCompare(i.name)}),r}const oo="grp-EXU-ExpBoard_1";function OE(e){var l,u;const n=e.map(d=>{var f,h,p,I,P,x;return d.type==="EXU"?{...d,connectorRef:{parentGroupId:"bmc-root",connectorName:"I2c_3",bom:(f=d.boards[0])==null?void 0:f.partNumber,id:"01",auxId:"01",identifyMode:2,expectedFile:`${(h=d.boards[0])==null?void 0:h.partNumber}_${(p=d.boards[0])==null?void 0:p.sn}.sr`}}:d.category==="child"&&d.state==="resolved"?{...d,connectorRef:{parentGroupId:oo,connectorName:`I2c_${(d.type[0]||"x").toLowerCase()}`,bom:(I=d.boards[0])==null?void 0:I.partNumber,id:"01",auxId:"00",identifyMode:2,expectedFile:`${(P=d.boards[0])==null?void 0:P.partNumber}_${(x=d.boards[0])==null?void 0:x.sn}.sr`}}:d}),t=((l=e.find(d=>d.type==="IEU"))==null?void 0:l.boards)??[],r=((u=e.find(d=>d.type==="SEU"))==null?void 0:u.boards)??[],o={id:"grp-demo-multimatch",type:"IEU",name:"RiserCard_Demo",label:"Riser 卡 (IEU) · RiserCard_Demo",shortLabel:"IEU",boards:t.length>=2?[t[0]]:[],topoVariants:sl(t.length>=2?[t[0]]:[]),category:"child",state:"multi-match",connectorRef:{parentGroupId:oo,connectorName:"I2c_4",bom:"14100513",id:"02",auxId:"03",identifyMode:2,expectedFile:"14100513_00000001040302_*.sr"},fileMatches:t.slice(0,3).map((d,f)=>({file:d.files[0],relPath:`./vendor/openUBMC/${["taishan","tianchi","altas"][f]??"misc"}/`}))},s={id:"grp-demo-typeplaceholder",type:"SEU",name:"待选具体型号",label:"存储/转接板 (SEU) · 未指定具体型号",shortLabel:"SEU",boards:[],topoVariants:sl(r),category:"child",state:"type-placeholder",connectorRef:{parentGroupId:oo,connectorName:"I2c_5",id:"03",auxId:"01",identifyMode:1,type:"SEU"},typeCandidates:r},i={id:"grp-demo-missing",type:"NICCard",name:"NICCard_Missing",label:"网卡 (NICCard) · 文件缺失",shortLabel:"NICCard",boards:[],topoVariants:[],category:"child",state:"missing",connectorRef:{parentGroupId:oo,connectorName:"HSP_6",bom:"14220247",id:"05",auxId:"02",identifyMode:2,expectedFile:"14220247_00000001100302099999.sr"},missingFile:"14220247_00000001100302099999.sr"},a={id:"grp-demo-unclassified",type:"Unknown",name:"MysteryConnector_I2c_7",label:"未分类 · I2c_7 下游",shortLabel:"未分类",boards:[],topoVariants:[],category:"unknown",state:"unclassified",connectorRef:{parentGroupId:oo,connectorName:"I2c_7",identifyMode:1}};return[...n,o,s,i,a]}function zc(e){return e.state!=="unclassified"}const ho={resolved:"已解析","multi-match":"多匹配","type-placeholder":"待选型号",unclassified:"未分类",missing:"文件缺失"},As={resolved:"#22c55e","multi-match":"#f59e0b","type-placeholder":"#eab308",unclassified:"#6b7280",missing:"#ef4444"},BE={class:"board-tag"},RE={class:"group-header"},LE={class:"group-badge"},UE=["title"],HE={class:"state-icon"},zE={key:0,class:"group-count"},KE={key:1,class:"variant-combo-wrap nodrag nopan"},WE={class:"vc-letter"},GE={class:"vc-label"},XE={class:"vc-count"},YE={class:"combo-section-label"},qE={class:"combo-list"},jE=["onClick"],ZE={class:"variant-item-letter"},JE={class:"variant-item-label"},QE={class:"variant-item-count"},ew={class:"combo-wrap nodrag nopan"},nw={class:"combo-sn"},tw={class:"combo-pn"},rw={key:1,class:"combo-sn combo-empty-prompt"},ow={class:"combo-section-label"},sw={class:"combo-list"},iw={class:"item-sn"},aw={class:"item-path"},lw=["placeholder"],uw={class:"combo-list"},cw=["onClick"],dw={class:"item-sn"},fw={class:"item-pn"},pw={key:0,class:"combo-empty"},hw={key:2,class:"combo-actions"},mw={key:2,class:"topo-section nodrag nopan"},vw={class:"topo-toggle"},_w={class:"ph-caption"},gw=Be({__name:"BoardGroupNode",props:{id:{},type:{},selected:{type:Boolean},connectable:{type:[Boolean,Number,String,Function]},position:{},dimensions:{},label:{},isValidTargetPos:{type:Function},isValidSourcePos:{type:Function},parent:{},parentNodeId:{},dragging:{type:Boolean},resizing:{type:Boolean},zIndex:{},targetPosition:{},sourcePosition:{},dragHandle:{},data:{},events:{}},setup(e){const n=e,t=ie(()=>n.data.group),r=ie(()=>t.value.state??"resolved"),o=Tn("onChipPick",null),s=ie(()=>Gr(t.value.type,t.value.name)),i=ie(()=>{if(p.value)return p.value.boards;switch(r.value){case"type-placeholder":return t.value.typeCandidates??[];case"missing":return t.value.typeCandidates??[];case"multi-match":case"resolved":default:return t.value.boards}}),a=ie(()=>{const k=n.data.selectedId;return i.value.length?i.value.find(G=>G.id===k)??i.value[0]??null:null}),l=ie(()=>({label:ho[r.value],color:As[r.value],icon:{resolved:"✓","multi-match":"⚠","type-placeholder":"◇",missing:"⛔",unclassified:"?"}[r.value]})),u=ie(()=>{var G,v,K;const k=t.value;switch(r.value){case"multi-match":return`匹配到 ${((G=k.fileMatches)==null?void 0:G.length)??0} 个 sr 文件 · 请选择其一`;case"type-placeholder":return`类型 ${k.type} · 共 ${((v=k.typeCandidates)==null?void 0:v.length)??0} 张可选`;case"missing":return`⛔ ${k.missingFile??((K=k.connectorRef)==null?void 0:K.expectedFile)??"文件未找到"}`;default:return""}}),d=ie(()=>r.value==="multi-match"||r.value==="type-placeholder"||r.value==="missing");function f(){var k,G;return r.value!=="resolved"?null:((G=(k=t.value.topoVariants)==null?void 0:k[0])==null?void 0:G.key)??null}const h=Ee(f());Fe(()=>t.value.id,()=>{h.value=f()});const p=ie(()=>{var k;return h.value==null?null:((k=t.value.topoVariants)==null?void 0:k.find(G=>G.key===h.value))??null}),I=ie(()=>{var k;return r.value==="resolved"&&(((k=t.value.topoVariants)==null?void 0:k.length)??0)>1}),P=Ee(!1),x=Ee(!1),N=Ee(!1),U=Ee(""),D=Ee(null),O=ie(()=>{const k=U.value.trim().toLowerCase();return k?i.value.filter(G=>G.id.toLowerCase().includes(k)||G.sn.toLowerCase().includes(k)||G.partNumber.toLowerCase().includes(k)):i.value});function Q(k){k.stopPropagation(),x.value=!x.value,x.value&&(U.value="",N.value=!1)}function ee(k,G){var v,K;G.stopPropagation(),x.value=!1,(K=(v=n.data).onSelect)==null||K.call(v,t.value.id,k.id)}function ne(k){k.stopPropagation(),N.value=!N.value,N.value&&(x.value=!1)}function ae(k,G){var K,S,z,L;if(G.stopPropagation(),N.value=!1,k===h.value)return;h.value=k;const v=(S=(K=t.value.topoVariants)==null?void 0:K.find(W=>W.key===k))==null?void 0:S.boards[0];v&&((L=(z=n.data).onSelect)==null||L.call(z,t.value.id,v.id))}function re(k){D.value&&(D.value.contains(k.target)||(x.value=!1,N.value=!1))}Fe([x,N],([k,G])=>{k||G?document.addEventListener("mousedown",re):document.removeEventListener("mousedown",re)}),Wr(()=>document.removeEventListener("mousedown",re));const X={BCU:"#22c55e",CLU:"#f59e0b",EXU:"#a855f7",IEU:"#06b6d4",SEU:"#ec4899",NICCard:"#3b82f6",Unknown:"#6b7280"},Z=ie(()=>X[t.value.type]??"#6b7280");return(k,G)=>{var v,K,S,z,L;return b(),T("div",{ref_key:"rootEl",ref:D,class:fe(["group-node",{"is-selected":n.selected,"is-unknown":t.value.category==="unknown","state-resolved":r.value==="resolved","state-multimatch":r.value==="multi-match","state-typeplaceholder":r.value==="type-placeholder","state-missing":r.value==="missing"}])},[c("div",BE,R(t.value.label),1),Le(le(Ht),{type:"target",position:le(xe).Left,id:"l",style:Ve({width:"8px",height:"8px",background:Z.value,border:"2px solid #0b0d12",left:"-5px"})},null,8,["position","style"]),c("div",RE,[c("span",LE,R(t.value.shortLabel),1),c("span",{class:"state-pill",title:l.value.label,style:Ve({background:l.value.color+"26",color:l.value.color})},[c("span",HE,R(l.value.icon),1),c("span",null,R(l.value.label),1)],12,UE),i.value.length?(b(),T("span",zE,"× "+R(i.value.length),1)):Ce("",!0)]),u.value?(b(),T("div",{key:0,class:"state-hint",style:Ve({color:l.value.color})},R(u.value),5)):Ce("",!0),I.value?(b(),T("div",KE,[c("button",{class:"variant-combo-btn",onPointerdown:G[0]||(G[0]=en(()=>{},["stop"])),onClick:ne},[c("span",WE,"变体 "+R((v=p.value)==null?void 0:v.letter),1),c("span",GE,R(((K=p.value)==null?void 0:K.label)||"标准结构"),1),c("span",XE,R((S=p.value)==null?void 0:S.boards.length)+" 个",1),c("span",{class:fe(["combo-caret",{open:N.value}])},"▾",2)],32),N.value?(b(),T("div",{key:0,class:"combo-dropdown",onPointerdown:G[1]||(G[1]=en(()=>{},["stop"]))},[c("div",YE,"拓扑结构变体 · "+R(t.value.topoVariants.length)+" 种",1),c("div",qE,[(b(!0),T(de,null,Me(t.value.topoVariants,W=>(b(),T("div",{key:W.key,class:fe(["combo-item variant-item",{"is-active":W.key===h.value}]),onClick:Y=>ae(W.key,Y)},[c("span",ZE,R(W.letter),1),c("span",JE,R(W.label||"标准结构"),1),c("span",QE,R(W.boards.length)+" 个实例",1)],10,jE))),128))])],32)):Ce("",!0)])):Ce("",!0),c("div",ew,[c("button",{class:fe(["group-combo-btn",{"needs-action":d.value}]),onPointerdown:G[2]||(G[2]=en(()=>{},["stop"])),onClick:Q},[a.value?(b(),T(de,{key:0},[c("span",nw,R(a.value.sn),1),c("span",tw,"PN "+R(a.value.partNumber),1)],64)):(b(),T("span",rw,R(r.value==="multi-match"?"选择具体 sr 文件 …":r.value==="type-placeholder"?`选择 ${t.value.type} 板卡 …`:r.value==="missing"?"重新指向板卡 …":"选择板卡 …"),1)),c("span",{class:fe(["combo-caret",{open:x.value}])},"▾",2)],34),x.value?(b(),T("div",{key:0,class:"combo-dropdown",onPointerdown:G[8]||(G[8]=en(()=>{},["stop"]))},[r.value==="multi-match"&&((z=t.value.fileMatches)!=null&&z.length)?(b(),T(de,{key:0},[c("div",ow,"候选 sr 文件 · "+R(t.value.fileMatches.length)+" 个",1),c("div",sw,[(b(!0),T(de,null,Me(t.value.fileMatches,W=>(b(),T("div",{key:W.file,class:"combo-item file-item",onClick:G[3]||(G[3]=en(Y=>x.value=!1,["stop"]))},[c("span",iw,R(W.file),1),c("span",aw,R(W.relPath),1)]))),128))])],64)):(b(),T(de,{key:1},[He(c("input",{"onUpdate:modelValue":G[4]||(G[4]=W=>U.value=W),class:"combo-search",type:"text",placeholder:r.value==="type-placeholder"?`筛选 ${t.value.type} 板卡 SN / PN…`:r.value==="missing"?"搜索要重新指向的板卡…":"搜索 SN / PN…",autocomplete:"off",onKeydown:G[5]||(G[5]=en(()=>{},["stop"]))},null,40,lw),[[an,U.value]]),c("div",uw,[(b(!0),T(de,null,Me(O.value,W=>{var Y;return b(),T("div",{key:W.id,class:fe(["combo-item",{"is-active":W.id===((Y=a.value)==null?void 0:Y.id)}]),onClick:se=>ee(W,se)},[c("span",dw,R(W.sn),1),c("span",fw,"PN "+R(W.partNumber),1)],10,cw)}),128)),O.value.length===0?(b(),T("div",pw,"无匹配")):Ce("",!0)])],64)),r.value==="missing"?(b(),T("div",hw,[c("button",{class:"combo-action",onClick:G[6]||(G[6]=en(W=>x.value=!1,["stop"]))},"📁 重新指向文件"),c("button",{class:"combo-action",onClick:G[7]||(G[7]=en(W=>x.value=!1,["stop"]))},"🔍 查看 Connector 引用")])):Ce("",!0)],32)):Ce("",!0)]),r.value==="resolved"||r.value==="multi-match"?(b(),T("div",mw,[c("div",{class:"topo-header",onClick:G[9]||(G[9]=en(W=>P.value=!P.value,["stop"]))},[G[11]||(G[11]=c("span",{class:"topo-header-label"},"I2C 拓扑",-1)),c("span",vw,R(P.value?"▶":"▼"),1)]),P.value?Ce("",!0):(b(),Xe(qp,{key:0,buses:s.value.buses,onChipClick:G[10]||(G[10]=W=>{var Y;return(Y=le(o))==null?void 0:Y(t.value,W)})},null,8,["buses"]))])):(b(),T("div",{key:3,class:fe(["placeholder-illustration",`ph-${r.value}`])},[G[12]||(G[12]=c("div",{class:"ph-frame"},[c("div",{class:"ph-chip"}),c("div",{class:"ph-chip"}),c("div",{class:"ph-chip"})],-1)),c("div",_w,R(r.value==="missing"?"默认板卡占位图":"待选板卡占位图"),1)],2)),(L=n.data.sourceHandles)!=null&&L.length?(b(!0),T(de,{key:4},Me(n.data.sourceHandles,(W,Y)=>(b(),T(de,{key:W.id},[c("span",{class:"port-num",style:Ve({top:W.pct*100+"%",color:W.color})},R(String(Y+1).padStart(2,"0")),5),Le(le(Ht),{type:"source",position:le(xe).Right,id:W.id,style:Ve({position:"absolute",width:"7px",height:"7px",background:W.color,border:"2px solid #09090e",right:"-5px",top:W.pct*100+"%",transform:"translateY(-50%)"})},null,8,["position","id","style"])],64))),128)):(b(),Xe(le(Ht),{key:5,type:"source",position:le(xe).Right,id:"r",style:Ve({width:"8px",height:"8px",background:Z.value,border:"2px solid #0b0d12",right:"-5px"})},null,8,["position","style"]))],2)}}}),yw=Xn(gw,[["__scopeId","data-v-23da9890"]]),Cw=["d","stroke-width"],Sw=["d","stroke-dasharray"],bw="#151528",Ew=Be({__name:"ManhattanEdge",props:{id:{},sourceNode:{},targetNode:{},source:{},target:{},type:{},label:{type:[String,Object,Function]},style:{},selected:{type:Boolean},sourcePosition:{},targetPosition:{},sourceHandleId:{},targetHandleId:{},animated:{type:Boolean},updatable:{type:Boolean},markerStart:{},markerEnd:{},curvature:{},interactionWidth:{},data:{},events:{},labelStyle:{},labelShowBg:{type:Boolean},labelBgStyle:{},labelBgPadding:{},labelBgBorderRadius:{},sourceX:{},sourceY:{},targetX:{},targetY:{}},setup(e){const n=e;function t(I,P,x,N,U,D=12){const O=P<U?1:-1,Q=Math.abs(U-P);if(Q<2)return`M ${I} ${P} L ${N} ${U}`;const ee=Math.min(D,Q/2),ne=Math.min(D,Math.abs(x-I)/2),ae=Math.min(D,Math.abs(N-x)/2);return`M ${I} ${P} L ${x-ne} ${P} Q ${x} ${P}, ${x} ${P+O*ee} L ${x} ${U-O*ee} Q ${x} ${U}, ${x+ae} ${U} L ${N} ${U}`}const r=Tn("activeEdgeId",Ee(null)),o=ie(()=>!r.value||n.id===r.value),s=ie(()=>{var I;return((I=n.style)==null?void 0:I.strokeWidth)??1.5}),i=ie(()=>{var I;return((I=n.style)==null?void 0:I.opacity)??.88}),a=ie(()=>{var I;return(I=n.style)==null?void 0:I.strokeDasharray}),l=ie(()=>{var I;return((I=n.style)==null?void 0:I.stroke)??"#818cf8"}),u=ie(()=>o.value?i.value:.1),d=ie(()=>{var I;return((I=n.data)==null?void 0:I.yOffAtTarget)??0}),f=ie(()=>{var I;return n.sourceX+(((I=n.data)==null?void 0:I.laneOffset)??80)+d.value}),h=ie(()=>n.targetY+d.value),p=ie(()=>t(n.sourceX,n.sourceY,f.value,n.targetX,h.value));return(I,P)=>(b(),T(de,null,[c("path",{d:p.value,stroke:bw,"stroke-width":s.value+3.5,fill:"none","stroke-linecap":"round","stroke-linejoin":"round",style:Ve([{"pointer-events":"none",transition:"opacity 0.18s"},{opacity:u.value}])},null,12,Cw),c("path",{d:p.value,fill:"none","stroke-linecap":"round","stroke-linejoin":"round","stroke-dasharray":a.value,class:"vue-flow__edge-path",style:Ve([{transition:"opacity 0.18s,stroke-width 0.18s"},{stroke:l.value,strokeWidth:(o.value?s.value+.5:s.value)+"px",opacity:u.value}])},null,12,Sw)],64))}}),Fn=ot({anchor:"topology",dockTool:null,selectedBoardId:null,inbound:{smc:null,expr:null,cooling:null,alarm:null},lastWriteback:null,codeDoc:null});function zi(){function e(u){Fn.anchor=u}function n(u){Fn.selectedBoardId=u}function t(u,d){Fn.inbound[u]={...d,ts:Date.now()},Fn.dockTool=u}function r(u){Fn.dockTool=Fn.dockTool===u?null:u}function o(){Fn.dockTool=null}function s(u){Fn.inbound[u]=null}function i(u,d,f){Fn.lastWriteback={tool:u,label:d,code:f,ts:Date.now()}}function a(u,d){Fn.codeDoc={file:u,content:d}}function l(){Fn.codeDoc=null}return{state:Fn,setAnchor:e,selectEntity:n,invoke:t,toggleDock:r,closeDock:o,clearInbound:s,writeBack:i,openCodeDoc:a,closeCodeDoc:l}}const mo=[{id:4,label:"高于门限",symbol:"≥",desc:"读数 ≥ 门限值即告警。适用过温、过压、带宽过载等「越大越危险」的量。",recommendFor:["threshold"]},{id:1,label:"低于门限",symbol:"≤",desc:"读数 ≤ 门限值即告警。适用欠压、转速偏低、余量偏低等「越小越危险」的量。",recommendFor:["threshold"]},{id:5,label:"状态命中",symbol:"=",desc:"读数 = 触发值（离散量一般为 1）即告警。适用 CATERR、在位、链路状态等。",recommendFor:["discrete"]},{id:3,label:"严格大于",symbol:">",desc:"读数 > 门限值即告警（不含等于），少数场景使用。",recommendFor:[]},{id:2,label:"严格小于",symbol:"<",desc:"读数 < 门限值即告警（不含等于），少数场景使用。",recommendFor:[]}];function ww(e){return mo.find(n=>n.id===e)}const Fs=[{label:"BCU/EXU PowerGood 告警",periodMs:100,desc:"电源就绪类，最高优先级。",recommendFor:["powergood"]},{label:"影响业务的离散电压/时钟/CPU 故障",periodMs:400,desc:"影响业务的关键离散信号。",recommendFor:["caterr","prochot","clockfail"]},{label:"业务关键状态（复位/上电超时/异常掉电/ThermTrip）",periodMs:400,desc:"系统级关键状态。",recommendFor:["thermaltrip"]},{label:"故障诊断的故障检测",periodMs:1e3,desc:"一般故障诊断检测。"},{label:"门限类温度扫描",periodMs:1e3,desc:"门限温度传感器。",recommendFor:["temperature"]},{label:"门限类电压扫描",periodMs:3e3,desc:"门限电压传感器。",recommendFor:["voltage"]},{label:"风扇转速扫描",periodMs:1e3,desc:"风扇转速。",recommendFor:["fanspeed"]},{label:"热插拔部件在位",periodMs:2e3,desc:"热插拔在位状态。",recommendFor:["presence_hotplug"]},{label:"非热插拔部件在位",periodMs:8e3,desc:"非热插拔在位扫描。",recommendFor:["presence"]},{label:"不影响业务的硬件状态",periodMs:5e3,desc:"普通硬件状态。"},{label:"硬盘类状态扫描",periodMs:5e3,desc:"硬盘状态。",recommendFor:["disk_presence"]},{label:"光模块温度",periodMs:1e4,desc:"连续 12 次失败认为异常。",recommendFor:["om_temperature"]}];function Kc(e){return Fs.find(n=>{var t;return(t=n.recommendFor)==null?void 0:t.includes(e)})??Fs.find(n=>n.periodMs===1e3)??Fs[3]}const Wc={deviceField:"器件读数：直接订阅器件模型已暴露的语义量（如 CPU_1.TemperatureCelsius），缩放/单位已在上游做好，最省心，优先用。",scanner:"周期读(Scanner)：BMC 按 Period 周期性读一段芯片寄存器（Chip+Offset+Size+Mask），把原始值放进 .Value，供传感器/事件订阅。",accessor:"按需读(Accessor)：与 Scanner 字段完全相同，但没有 Period —— 只在被引用时读一次。告警用周期读(Scanner)，一次性读配置/在位用 Accessor。"},cn={temperature:{key:"temperature",label:"温度",kind:"threshold",unitLabel:"°C",readingField:"TemperatureCelsius",sensor:{SensorType:1,ReadingType:1,BaseUnit:1,Unit:128,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:2,periodKey:"temperature",thresholds:{UpperNoncritical:95,UpperCritical:100,UpperNonrecoverable:105},events:[{suffix:"OverMinor",label:"过温·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"CPU.CPUOverTempMinor"},{suffix:"OverMajor",label:"过温·严重",levelField:"UpperCritical",operatorId:4,severity:"Major",eventKeyId:"CPU.CPUOverTempCritical"},{suffix:"OverFatal",label:"过温·不可恢复",levelField:"UpperNonrecoverable",operatorId:4,severity:"Critical",eventKeyId:"CPU.CPUOverTempFatal"}],eventKeyIds:["PCIeCard.PCIeCardOverTemp","CPU.CPUOverTempCritical","Chassis.ChassisInletOverTempMinor"]},explain:"器件温度（°C）。越高越危险，一个温度传感器按「预警/严重/不可恢复」三档各产出一条过温告警。"},voltage:{key:"voltage",label:"电压",kind:"threshold",unitLabel:"V",readingField:"Voltage",sensor:{SensorType:2,ReadingType:1,BaseUnit:4,Unit:128,M:1,RBExp:-3,Analog:1},recommend:{operatorId:1,hysteresis:0,periodKey:"voltage",thresholds:{UpperCritical:1.1,UpperNoncritical:1.05,LowerNoncritical:.95,LowerCritical:.9},events:[{suffix:"OverMajor",label:"过压·严重",levelField:"UpperCritical",operatorId:4,severity:"Major",eventKeyId:"CpuBoard.OverVoltageMajor"},{suffix:"OverMinor",label:"过压·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"CpuBoard.OverVoltageMinor"},{suffix:"LowerMinor",label:"欠压·预警",levelField:"LowerNoncritical",operatorId:1,severity:"Minor",eventKeyId:"CpuBoard.LowerVoltageMinor"},{suffix:"LowerMajor",label:"欠压·严重",levelField:"LowerCritical",operatorId:1,severity:"Major",eventKeyId:"CpuBoard.LowerVoltageMajor"}],eventKeyIds:["CpuBoard.OverVoltage","CpuBoard.LowerVoltage","Mainboard.MainboardOverVoltageMajor","Mainboard.MainboardLowerVoltageMajor"]},explain:"供电电压（V）。过压欠压都要防：一条电压轨(rail)按「过压严重/过压预警/欠压预警/欠压严重」四档各产出一条告警。一个电压域通常有多条轨。"},fanspeed:{key:"fanspeed",label:"风扇转速",kind:"threshold",unitLabel:"RPM",readingField:"SpeedRPM",sensor:{SensorType:4,ReadingType:1,BaseUnit:18,Unit:0,M:1,RBExp:0,Analog:1},recommend:{operatorId:1,hysteresis:100,periodKey:"fanspeed",thresholds:{LowerNoncritical:1500,LowerCritical:800},events:[{suffix:"LowMinor",label:"转速偏低·预警",levelField:"LowerNoncritical",operatorId:1,severity:"Minor",eventKeyId:"Fan.FanLowSpeedMinor"},{suffix:"LowMajor",label:"转速过低·严重",levelField:"LowerCritical",operatorId:1,severity:"Major",eventKeyId:"Fan.FanLowSpeedMajor"}],eventKeyIds:["Fan.FanLowSpeed","Cooling.FanSpeedLow"]},explain:"风扇转速（RPM）。转速过低影响散热，按「偏低预警/过低严重」两档告警。"},bandwidth:{key:"bandwidth",label:"带宽占用率",kind:"threshold",unitLabel:"%",readingField:"BandwidthUsagePercent",sensor:{SensorType:1,ReadingType:1,BaseUnit:6,Unit:0,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:0,periodKey:"bandwidth",thresholds:{UpperNoncritical:90,UpperCritical:100},events:[{suffix:"HighMinor",label:"带宽过载·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"NICCard.SystemNetworkBandwidthUsageHigh"}],eventKeyIds:["NICCard.SystemNetworkBandwidthUsageHigh"]},explain:"端口带宽占用百分比。用于业务网络过载预警。"},caterr:{key:"caterr",label:"CATERR（CPU 灾难性错误）",kind:"discrete",readingField:"CATERR",sensor:{SensorType:7,ReadingType:111,AssertMask:2,DeassertMask:2,DiscreteMask:2},recommend:{operatorId:5,condition:1,periodKey:"caterr",eventKeyIds:["CPU.CPUCATERR","Processor.ProcessorCATERR"]},explain:"CPU 灾难性错误信号，置位即故障。离散量，「状态命中」即告警。"},prochot:{key:"prochot",label:"ProcessorHot（CPU 过热降频）",kind:"discrete",readingField:"ProcessorHot",sensor:{SensorType:7,ReadingType:111,AssertMask:2,DeassertMask:2,DiscreteMask:2},recommend:{operatorId:5,condition:1,periodKey:"prochot",eventKeyIds:["CPU.CPUProcHot","Processor.ProcessorHot"]},explain:"CPU 过热触发降频。离散量，置位即告警。"},thermaltrip:{key:"thermaltrip",label:"ThermalTrip（过热掉电）",kind:"discrete",readingField:"ThermalTrip",sensor:{SensorType:7,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:1,periodKey:"thermaltrip",eventKeyIds:["CPU.CPUThermalTrip"]},explain:"CPU 过热保护掉电，最高危离散状态。"},presence:{key:"presence",label:"在位状态",kind:"discrete",readingField:"Presence",sensor:{SensorType:8,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:0,periodKey:"presence",eventKeyIds:["Component.ComponentRemoved"]},explain:"部件是否在位。离散量；不在位（=0）时可告警。"},disk_presence:{key:"disk_presence",label:"硬盘在位",kind:"discrete",readingField:"Presence",sensor:{SensorType:8,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:0,periodKey:"disk_presence",eventKeyIds:["Disk.DiskRemoved","Storage.DiskAbsent"]},explain:"硬盘是否在位。SEU/背板类扫描周期 5s。"},linkstatus:{key:"linkstatus",label:"链路状态",kind:"discrete",readingField:"LinkStatus",sensor:{SensorType:8,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:0,periodKey:"presence",eventKeyIds:["Port.PortDisconnected"]},explain:"端口链路 Up/Down。Down（=0）时告警。"},om_temperature:{key:"om_temperature",label:"光模块温度",kind:"threshold",unitLabel:"°C",readingField:"TemperatureCelsius",sensor:{SensorType:1,ReadingType:1,BaseUnit:1,Unit:128,M:1,RBExp:0,Analog:1},recommend:{operatorId:4,hysteresis:2,periodKey:"om_temperature",thresholds:{UpperNoncritical:75},events:[{suffix:"OverMinor",label:"光模块过温·预警",levelField:"UpperNoncritical",operatorId:4,severity:"Minor",eventKeyId:"Port.PortOpticalModuleOverTemp"}],eventKeyIds:["Port.PortOpticalModuleOverTemp","PcieCard.PCIeCardOMOverTemp"]},explain:"光模块温度，扫描周期较长（10s，连续 12 次失败判异常）。"},sr_state:{key:"sr_state",label:"离散状态",kind:"discrete",readingField:"Reading",sensor:{SensorType:15,ReadingType:111,AssertMask:1,DeassertMask:1,DiscreteMask:1},recommend:{operatorId:5,condition:1,periodKey:"presence",eventKeyIds:[]},explain:"来自 .sr 的离散状态传感器；读数命中触发值即告警。"}},Gc={BCU:[{key:"VCC_12V0_1",label:"VCC_12V0_1",nominal:12},{key:"VCC_12V0_2",label:"VCC_12V0_2",nominal:12},{key:"VCC_12V0_3",label:"VCC_12V0_3",nominal:12},{key:"P3V3",label:"3V3",nominal:3.3},{key:"STBY_3V3",label:"STBY_3V3",nominal:3.3},{key:"VCORE",label:"VCORE",nominal:.85},{key:"VDDQ",label:"1V1_VDDQ",nominal:1.1}],EXU:[{key:"VCC_12V0_1",label:"VCC_12V0_1",nominal:12},{key:"VCC_12V0_2",label:"VCC_12V0_2",nominal:12},{key:"STBY_3V3",label:"STBY_3V3",nominal:3.3},{key:"STBY_5V0",label:"STBY_5V0",nominal:5}],DEFAULT:[{key:"P12V",label:"12V",nominal:12},{key:"P5V",label:"5V",nominal:5},{key:"P3V3",label:"3V3",nominal:3.3}]};function Iw(e){return Gc[e||"DEFAULT"]||Gc.DEFAULT}function Pw(e){const n=t=>Math.round(t*1e3)/1e3;return{UpperCritical:n(e*1.1),UpperNoncritical:n(e*1.05),LowerNoncritical:n(e*.95),LowerCritical:n(e*.9)}}const $w=[{match:/^CPU_/,typeLabel:"CPU",entity:{name:"CPU",entityId:3},quantities:["temperature","caterr","prochot","thermaltrip"],componentPrefix:"Component_ComCpu"},{match:/^NetworkAdapter_/,typeLabel:"网卡",entity:{name:"PCIeCard",entityId:11},quantities:["temperature","bandwidth","linkstatus"],componentPrefix:"Component_PCIeCard"},{match:/^OpticalModule_/,typeLabel:"光模块",entity:{name:"PCIeCard",entityId:11},quantities:["om_temperature"],componentPrefix:"Component_PCIeCard"},{match:/^Fan_/,typeLabel:"风扇",entity:{name:"Fan",entityId:29},quantities:["fanspeed"],componentPrefix:"Component_Fan"},{match:/^Voltage_/,typeLabel:"电压域",entity:{name:"PowerUnit",entityId:10},quantities:["voltage"],componentPrefix:"Component_Power"},{match:/^Disk_/,typeLabel:"硬盘",entity:{name:"Drive",entityId:4},quantities:["disk_presence","temperature"],componentPrefix:"Component_Disk"},{match:/^Memory_/,typeLabel:"内存",entity:{name:"Memory",entityId:32},quantities:["temperature","presence"],componentPrefix:"Component_Memory"}];function xw(e){return $w.find(n=>n.match.test(e))}function Dw(e){return/^Voltage_/.test(e)}const Xc={BCU:[{key:"CPU_1",typeLabel:"CPU",quantities:["temperature","caterr","prochot","thermaltrip"]},{key:"CPU_2",typeLabel:"CPU",quantities:["temperature","caterr","prochot","thermaltrip"]},{key:"Voltage_Domain",typeLabel:"电压域",quantities:["voltage"]}],CLU:[{key:"Fan_1",typeLabel:"风扇",quantities:["fanspeed"]},{key:"Fan_2",typeLabel:"风扇",quantities:["fanspeed"]},{key:"Temp_Inlet",typeLabel:"进风温度",quantities:["temperature"]}],EXU:[{key:"Voltage_Domain",typeLabel:"电压域",quantities:["voltage"]},{key:"Temp_Board",typeLabel:"单板温度",quantities:["temperature"]}],IEU:[{key:"Temp_Riser",typeLabel:"Riser 温度",quantities:["temperature"]}],SEU:[{key:"Disk_1",typeLabel:"硬盘",quantities:["disk_presence","temperature"]},{key:"Temp_Backplane",typeLabel:"背板温度",quantities:["temperature"]}],NICCard:[{key:"NetworkAdapter_1",typeLabel:"网卡",quantities:["temperature","bandwidth","linkstatus"]},{key:"OpticalModule_0",typeLabel:"光模块",quantities:["om_temperature"]}],Unknown:[{key:"Temp_Board",typeLabel:"单板温度",quantities:["temperature"]},{key:"Voltage_Domain",typeLabel:"电压域",quantities:["voltage"]}]};function Mw(e){return Xc[e||"Unknown"]||Xc.Unknown}const kw={UpperNoncritical:"预警(上)",UpperCritical:"严重(上)",UpperNonrecoverable:"不可恢复(上)",LowerNoncritical:"预警(下)",LowerCritical:"严重(下)"},ga=(e,n)=>`#/${e}.${n}`,On=(e,n)=>`<=/${e}.${n}`;function Os(e){return e.replace(/[^A-Za-z0-9]+/g," ").split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join("")}function Tw(e,n,t){const r=t?Os(t):"";return`${Os(e)}${r}${Os(n.label||n.key)}`}function jp(e,n,t){return`${e}|${n}|${t||""}`}function Vw(e,n){var ae,re;const t=e.Objects||{},r=cn[n.quantityKey],o=xw(n.deviceKey),s=[],i=[],a=[],l={};if(!r)return{objects:{},sensor:null,createdKeys:[],reusedKeys:[],warnings:[`未知监控量：${n.quantityKey}`]};const u=Tw(n.deviceKey,r,n.railKey),d=n.railLabel||n.railKey;let f,h;if(n.readingOverride)f=n.readingOverride,h={kind:"device-field",label:n.readingOverride};else if(n.dataSource.mode==="scanner"){const X=n.dataSource.scanner;if(!X||!X.chip)a.push(`「${d||r.label}」数据源未接：请选择硬件信号（Chip/Offset）或改用器件读数字段。`),f=On(n.deviceKey,n.dataSource.field||r.readingField),h={kind:"device-field",label:"（未接，暂用器件字段兜底）"};else{const Z=`Scanner_${u}`;l[Z]={Chip:X.chip.startsWith("#/")?X.chip:`#/${X.chip}`,Offset:X.offset,Size:X.size,Mask:X.mask,Type:0,Period:X.periodMs,Debounce:"None",Value:0},s.push(Z),f=On(Z,"Value"),h={kind:"scanner",label:`周期读 ${X.chip} @${X.periodMs}ms`,scannerKey:Z}}}else{const X=n.dataSource.field||r.readingField;f=On(n.deviceKey,X),h={kind:"device-field",label:`${n.deviceKey}.${X}`}}const p=Os(n.deviceKey),I=o?o.entity.name:p,P=o?o.entity.entityId:0,x=`Entity_${p}`;t[x]?i.push(x):(l[x]={Id:P,Name:I,Instance:1,PowerState:1,Presence:1},s.push(x));const N=`Component_${p}`;t[N]?i.push(N):(l[N]={FruId:255,Instance:On(n.deviceKey,"SlotID"),Name:On(n.deviceKey,"DeviceName"),Location:On(n.deviceKey,"Position"),Health:0,Presence:1,PowerState:1},s.push(N));const U=r.kind==="threshold"?`ThresholdSensor_${u}`:`DiscreteSensor_${u}`,D=`${n.boardName} ${d||(o==null?void 0:o.typeLabel)||""} ${r.label}`.replace(/\s+/g," ").trim();r.kind==="threshold"?l[U]={...r.sensor,SensorName:D,Reading:f,ReadingStatus:On(n.deviceKey,`${r.readingField}Status`),EntityId:On(x,"Id"),EntityInstance:On(x,"Instance"),...n.thresholds||{},...n.hysteresis!=null?{PositiveHysteresis:n.hysteresis,NegativeHysteresis:n.hysteresis}:{}}:l[U]={...r.sensor,SensorName:D,Reading:f,EntityId:On(x,"Id"),EntityInstance:On(x,"Instance")},s.push(U);const O=n.eventList&&n.eventList.length?n.eventList:r.kind==="threshold"?(n.events&&n.events.length?n.events:r.recommend.events||[]).map(X=>({suffix:X.suffix,eventKeyId:X.eventKeyId,operatorId:X.operatorId,label:X.label,severity:X.severity,levelField:X.levelField})):[{suffix:"",eventKeyId:n.eventKeyId||r.recommend.eventKeyIds[0]||"",operatorId:n.operatorId,label:"状态命中",condition:n.condition??1}],Q=[],ee=new Set;for(const X of O){let Z,k;if(X.levelField){const K=(ae=n.thresholds)==null?void 0:ae[X.levelField];if(K==null)continue;Z=On(U,X.levelField),k=`${kw[X.levelField]} = ${K}`}else Z=X.condition??1,k=`命中值 = ${X.condition??1}`;let G=X.suffix||"";for(;ee.has(G);)G=`${G}_x`;ee.add(G);const v=`Event_${u}${G}`;l[v]={EventKeyId:X.eventKeyId,Reading:f,Condition:Z,OperatorId:X.operatorId,Component:`#/${N}`,Enabled:n.enabled,...X.levelField&&n.hysteresis!=null?{Hysteresis:n.hysteresis}:{},DescArg2:ga(N,"Name"),DescArg3:d||(o==null?void 0:o.typeLabel)||n.deviceKey,DescArg4:ga(v,"Reading"),DescArg5:ga(v,"Condition")},s.push(v),Q.push({key:v,eventKeyId:X.eventKeyId,label:X.label,operator:((re=ww(X.operatorId))==null?void 0:re.symbol)||"",severity:X.severity,conditionLabel:k})}Q.length||a.push(r.kind==="threshold"?"未设置任何门限档位，未产出告警事件——请至少填一档门限。":"未配置任何事件——请至少添加一条事件。");const ne={configId:jp(n.deviceKey,n.quantityKey,n.railKey),sensorKey:U,sensorName:D,kind:r.kind,entityKey:x,entityName:I,entityId:P,componentKey:N,dataSource:h,events:Q};return{objects:l,sensor:ne,createdKeys:s,reusedKeys:i,warnings:a}}const ya=ot({});function Hr(e){return ya[e]||(ya[e]={cfgs:[],looseEvents:[],uidN:0,evSeq:0,loaded:!1}),ya[e]}function Nw(e){return`e${++Hr(e).uidN}`}function Yc(e){return++Hr(e).evSeq}function Aw(e){let n="",t=!1,r=!1;for(let o=0;o<e.length;o++){const s=e[o];if(t){n+=s,r?r=!1:s==="\\"?r=!0:s==='"'&&(t=!1);continue}if(s==='"'){t=!0,n+=s;continue}if(s==="/"&&e[o+1]==="/"){for(;o<e.length&&e[o]!==`
`;)o++;n+=`
`;continue}if(s==="/"&&e[o+1]==="*"){for(o+=2;o<e.length&&!(e[o]==="*"&&e[o+1]==="/");)o++;o++;continue}n+=s}return n}function qc(e){const n=JSON.parse(Aw(e)),t=n.Unit??{},r=n.ManagementTopology??{},o=r.Anchor??{},s={};for(const[i,a]of Object.entries(r)){if(i==="Anchor"||typeof a!="object"||a===null)continue;const l=a;s[i]={chips:Array.isArray(l.Chips)?l.Chips:[],connectors:Array.isArray(l.Connectors)?l.Connectors:[]}}return{formatVersion:String(n.FormatVersion??""),unit:{type:String(t.Type??""),name:String(t.Name??"")},topology:{anchorBuses:Array.isArray(o.Buses)?o.Buses:[],buses:s},objects:n.Objects??{}}}function mr(e){const n=e.indexOf("_");return n<0?e:e.slice(0,n)}function Fw(e,n){const t={};for(const[r,o]of Object.entries(e))t[r]={...o};for(const[r,o]of Object.entries(n))t[r]={...t[r]||{},...o};return t}const Ow={Smc:"SMC 管理芯片",Lm75:"LM75 温度芯片",Eeprom:"EEPROM 信息器件",Pca9545:"PCA9545 I2C 扩展",Cpld:"CPLD 逻辑器件",Chip:"板载器件"};function ci(e){return Ow[e]||`${e} 器件`}function Bw(e){const n=[],t=new Set;for(const[r,o]of Object.entries(e.topology.buses))for(const s of o.chips){if(t.has(s))continue;t.add(s);const i=mr(s);n.push({name:s,type:i,typeLabel:ci(i),bus:r})}return n}function Rw(e){const n={};for(const[t,r]of Object.entries(e)){const o=mr(t);if(o!=="ThresholdSensor"&&o!=="DiscreteSensor")continue;const s=r.Reading;if(typeof s!="string")continue;const i=s.match(/<=\/(Scanner_[A-Za-z0-9_]+)\.Value/);if(!i)continue;const a=e[i[1]],l=a?di(a.Chip):null;l&&(n[t]=l.target)}return n}function di(e){if(typeof e!="string")return null;const n=e.match(/^(?:<=|#|>=|=)?\/([A-Za-z0-9_]+)(?:\.([A-Za-z0-9_]+))?$/);return n?{target:n[1],field:n[2]}:null}const Lw=["UpperNonrecoverable","UpperCritical","UpperNoncritical","LowerNoncritical","LowerCritical","LowerNonrecoverable"];function ql(e){const n=new Map;for(const[t,r]of Object.entries(e)){const o=mr(t);if(o!=="ThresholdSensor"&&o!=="DiscreteSensor")continue;const s={};if(o==="ThresholdSensor")for(const a of Lw){const l=r[a];typeof l=="number"&&(s[a]=l)}const i=di(r.SensorName);n.set(t,{name:t,kind:o==="ThresholdSensor"?"threshold":"discrete",sensorName:typeof r.SensorName=="string"&&!i?r.SensorName:void 0,thresholds:s,events:[]})}for(const[t,r]of Object.entries(e)){if(mr(t)!=="Event")continue;const o=r.Condition,s=di(o),i=typeof r.EventKeyId=="string"?r.EventKeyId:"";if(s&&n.has(s.target))n.get(s.target).events.push({name:t,eventKeyId:i,level:s.field});else if(s&&!n.has(s.target))n.has(s.target)||n.set(s.target,{name:s.target,kind:"discrete",thresholds:{},events:[]}),n.get(s.target).events.push({name:t,eventKeyId:i,level:s.field});else if(typeof o=="number"){const a=[...n.keys()].find(l=>t.includes(l.replace(/^[A-Za-z]+_/,"")));a&&n.get(a).events.push({name:t,eventKeyId:i,condition:o})}}return[...n.values()]}const Uw=`{
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
}`,Hw=`{\r
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
}`,zw=`{\r
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
}`,Kw=`{\r
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
}`,Ww=`{\r
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
}`,Gw=`{\r
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
}`,Xw=`{\r
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
}`,Zp=[{hw:Uw,soft:Hw},{hw:zw},{hw:Kw,soft:Ww},{hw:Gw,soft:Xw}],Yw=["UpperNonrecoverable","UpperCritical","UpperNoncritical","LowerNoncritical","LowerCritical"],qw={UpperNoncritical:"预警(上)",UpperCritical:"严重(上)",UpperNonrecoverable:"不可恢复(上)",LowerNoncritical:"预警(下)",LowerCritical:"严重(下)"};function il(e){return/Nonrecoverable|Fatal|Fail/i.test(e)?"Critical":/Major|Critical/i.test(e)?"Major":"Minor"}const Ca=new Map;function Jp(e){try{const n=qc(e.hw),t=e.soft?Fw(n.objects,qc(e.soft).objects):n.objects;return{unitName:n.unit.name,unitType:n.unit.type,objects:t,chips:Bw(n),chipMap:Rw(t)}}catch{return null}}function Qp(e){if(Ca.has(e))return Ca.get(e);let n=null;for(const t of Zp){const r=Jp(t);if(r&&r.unitName===e){n=r;break}}return Ca.set(e,n),n}let Sa=null;function jl(){if(Sa)return Sa;const e=[];for(const n of Zp){const t=Jp(n);t&&e.push(t)}return Sa=e,e}function jw(e){const n=Qp(e);if(!n)return[];const t={};for(const o of Object.values(n.chipMap))t[o]=(t[o]||0)+1;const r={};for(const o of e0(n))o.dsChip&&(r[o.dsChip]=(r[o.dsChip]||0)+1);return n.chips.map(o=>({...o,sensorCount:t[o.name]||0,eventCount:r[o.name]||0}))}function Zw(e,n){const t=n.Reading;if(typeof t!="string")return"";const r=t.match(/<=\/(Scanner_[A-Za-z0-9_]+)\.Value/);if(!r)return"";const o=e[r[1]],s=o?di(o.Chip):null;return s?s.target:""}function Jw(e){return/^Chassis\./.test(e)?"chassis":"board"}function e0(e){const n=new Set;for(const o of ql(e.objects))/^(ThresholdSensor|DiscreteSensor)_/.test(o.name)&&o.events.forEach(s=>n.add(s.name));const t=[];let r=0;for(const[o,s]of Object.entries(e.objects)){if(mr(o)!=="Event"||n.has(o))continue;const i=typeof s.EventKeyId=="string"?s.EventKeyId:"";if(!i)continue;const a=typeof s.DescArg2=="string"?s.DescArg2:"",l=a&&!/^(#|<=|>=|=)?\//.test(a)?a:i.split(".").pop()||o.replace(/^Event_/,"");t.push({id:`le${++r}`,eventKeyId:i,label:l,condition:typeof s.Condition=="number"?s.Condition:0,operatorId:typeof s.OperatorId=="number"?s.OperatorId:5,severity:il(i),dsChip:Zw(e.objects,s),scope:Jw(i),enabled:s.Enabled!==!1})}return t}function Qw(e){const n=Qp(e);if(!n)return{cfgs:[],looseEvents:[],skipped:0};const t=ql(n.objects),r=[];let o=0,s=0;for(const i of t){if(!/^(ThresholdSensor|DiscreteSensor)_/.test(i.name)){o++;continue}const a=i.name.replace(/^(ThresholdSensor|DiscreteSensor)_/,""),l=n.chipMap[i.name]||"";if(i.kind==="threshold"){const u=i.events.map(d=>{const f=d.level&&Yw.includes(d.level)?d.level:void 0;return{id:`e${++s}`,suffix:"",label:f?qw[f]:d.eventKeyId.split(".").pop()||"事件",severity:il(d.eventKeyId),operatorId:f?f.startsWith("Upper")?4:1:4,levelField:f,condition:d.condition??1,eventKeyId:d.eventKeyId,enabled:!0}});r.push({id:`sr:${a}`,deviceKey:"Temp_Board",deviceLabel:"单板温度",quantityKey:"temperature",railKey:a,railLabel:a,dsMode:l?"scanner":"device-field",dsChip:l,dsOffset:0,dsMask:255,dsSize:1,periodMs:1e3,thresholds:{...i.thresholds},hysteresis:2,events:u,enabled:!0})}else if(i.kind==="discrete"){const u=i.events.map(d=>({id:`e${++s}`,suffix:"",label:d.eventKeyId.split(".").pop()||"状态命中",severity:il(d.eventKeyId),operatorId:5,levelField:void 0,condition:d.condition??1,eventKeyId:d.eventKeyId,enabled:!0}));r.push({id:`sr:${a}`,deviceKey:"System",deviceLabel:"系统状态",quantityKey:"sr_state",railKey:a,railLabel:a,dsMode:l?"scanner":"device-field",dsChip:l,dsOffset:0,dsMask:255,dsSize:1,periodMs:8e3,thresholds:{},hysteresis:0,events:u,enabled:!0})}else o++}return{cfgs:r,looseEvents:e0(n),skipped:o}}function fi(e){const n=Hr(e);if(n.loaded)return;n.loaded=!0;const t=Qw(e);t.cfgs.length&&n.cfgs.push(...t.cfgs),t.looseEvents.length&&n.looseEvents.push(...t.looseEvents)}const e3={class:"alarm-view"},n3={class:"alarm-toolbar"},t3={class:"tb-tag"},r3={class:"tb-src"},o3={class:"dev-row"},s3=["onClick"],i3={class:"dev-type"},a3={class:"dev-key"},l3={key:1,class:"add-panel"},u3={class:"add-title"},c3=["title"],d3={class:"rail-palette"},f3=["disabled","onClick"],p3={class:"rail-nom"},h3={class:"rail-custom"},m3={key:1,class:"rail-palette"},v3=["disabled","onClick"],_3={class:"rail-nom"},g3={class:"flow-list"},y3={key:0,class:"empty"},C3={class:"conn-layer",preserveAspectRatio:"none","aria-hidden":"true"},S3=["d"],b3=["title"],E3={class:"cn-name"},w3={class:"cn-type"},I3={class:"cn-cnt"},P3={class:"se-cols"},$3=["onMouseenter"],x3={class:"se-sensor"},D3=["data-sensor-card","onClick"],M3=["title"],k3={class:"sc-kind"},T3=["title"],V3=["onClick"],N3={class:"se-events"},A3={key:0,class:"event-node none"},F3=["data-event-of","title","onClick"],O3={class:"en-label"},B3={key:0,class:"sensor-config"},R3={class:"sc-sec-cap"},L3={class:"sc-explain"},U3={key:0,class:"fn-thr"},H3=["title"],z3={class:"thr-l"},K3=["onUpdate:modelValue","placeholder"],W3={key:0,class:"thr-reco"},G3={class:"thr-unit"},X3={key:1,class:"disc-note"},Y3={class:"mf"},q3={value:"device-field"},j3={class:"mf-desc"},Z3={class:"scan-grid"},J3={class:"mf"},Q3=["value"],eI={key:3,class:"mf"},nI={class:"mf-desc"},tI={class:"sc-sec-cap"},rI={class:"ev-en",title:"是否产出该事件"},oI=["onUpdate:modelValue"],sI={class:"ef"},iI=["onUpdate:modelValue","onChange"],aI=["value"],lI={class:"ef ef-ro"},uI=["title"],cI={class:"ef"},dI=["onUpdate:modelValue"],fI=["value"],pI={class:"ef ef-grow"},hI=["onUpdate:modelValue"],mI=["value"],vI={key:0,class:"ef-ref"},_I=["onClick"],gI=["onClick"],yI={class:"ev-en"},CI=["onUpdate:modelValue"],SI={class:"ef"},bI=["onUpdate:modelValue"],EI={class:"thr-reco"},wI={class:"ef"},II=["onUpdate:modelValue"],PI=["value"],$I={class:"ef"},xI=["onUpdate:modelValue"],DI=["value"],MI={class:"ef ef-grow"},kI=["onUpdate:modelValue"],TI=["value"],VI=["onClick"],NI={key:0,class:"loose-block"},AI={class:"cat-name"},FI={class:"cat-n"},OI={class:"cat-chips"},BI=["title","onClick"],RI={class:"en-label"},LI={class:"en-op"},UI={key:0,class:"ev-inline"},HI={class:"sc-sec-cap"},zI={class:"sc-explain"},KI={class:"ev-edit"},WI={class:"ev-en",title:"是否产出该事件"},GI=["onUpdate:modelValue"],XI={class:"ef"},YI=["onUpdate:modelValue"],qI={class:"ef"},jI=["onUpdate:modelValue"],ZI=["value"],JI={class:"ef"},QI=["onUpdate:modelValue"],eP=["value"],nP={class:"ef ef-grow"},tP={class:"levt-key"},rP={key:0,class:"board-summary"},oP={class:"bs-head"},sP={class:"bs-actions"},iP={key:0,class:"bs-json"},aP=Be({__name:"AlarmConfigView",props:{scopeDeviceKey:{},scopeChipKey:{}},setup(e){const{state:n,openCodeDoc:t}=zi(),r=e,o=ie(()=>n.inbound.alarm),s=ie(()=>{var J;return((J=o.value)==null?void 0:J.boardType)||"Unknown"}),i=ie(()=>{var J;return((J=o.value)==null?void 0:J.boardName)||"当前板卡"}),a=ie(()=>{var J;return((J=o.value)==null?void 0:J.source)||""}),l=ie(()=>Mw(s.value)),u=ie(()=>i.value),d=()=>Nw(u.value),f=ie(()=>Hr(u.value).cfgs),h=ie(()=>r.scopeChipKey?r.scopeChipKey==="__firmware"?f.value.filter(J=>!J.dsChip):f.value.filter(J=>J.dsChip===r.scopeChipKey):r.scopeDeviceKey?f.value.filter(J=>J.deviceKey===r.scopeDeviceKey):f.value),p=Ee(null);function I(J){p.value=p.value===J?null:J}Fe(u,J=>{p.value=null,fi(J)},{immediate:!0});const P=Ee(""),x=ie(()=>l.value.find(J=>J.key===P.value)||l.value[0]||null);Fe(l,J=>{J.length&&!J.some(j=>j.key===P.value)&&(P.value=J[0].key)},{immediate:!0}),Fe(()=>r.scopeDeviceKey,J=>{J&&(P.value=J)},{immediate:!0});const N=ie(()=>x.value?Dw(x.value.key):!1),U=ie(()=>Iw(s.value));function D(J){return f.value.some(j=>{var ve;return j.deviceKey===((ve=x.value)==null?void 0:ve.key)&&j.railKey===J})}function O(J){return f.value.some(j=>{var ve;return j.deviceKey===((ve=x.value)==null?void 0:ve.key)&&j.quantityKey===J&&!j.railKey})}const Q=Ee(""),ee=["UpperNonrecoverable","UpperCritical","UpperNoncritical","LowerNoncritical","LowerCritical"],ne={UpperNoncritical:"预警(上)",UpperCritical:"严重(上)",UpperNonrecoverable:"不可恢复(上)",LowerNoncritical:"预警(下)",LowerCritical:"严重(下)"},ae=[{v:"Minor",label:"预警 Minor",desc:"需要关注，业务未中断。"},{v:"Major",label:"严重 Major",desc:"影响业务，需尽快处理。"},{v:"Critical",label:"致命 Critical",desc:"业务中断或硬件损坏风险。"}];function re(J){const j=cn[J];return j.kind==="threshold"?(j.recommend.events||[]).map(ve=>({id:d(),suffix:ve.suffix,label:ve.label,severity:ve.severity,operatorId:ve.operatorId,levelField:ve.levelField,condition:1,eventKeyId:ve.eventKeyId,enabled:!0})):[{id:d(),suffix:"",label:"状态命中",severity:"Major",operatorId:j.recommend.operatorId,condition:j.recommend.condition??1,eventKeyId:j.recommend.eventKeyIds[0]||"",enabled:!0}]}function X(J,j,ve,Ie,te,ge){const fn=cn[ve],dt=fn.kind==="threshold"?ge!=null?Pw(ge):{...fn.recommend.thresholds||{}}:{};return{id:jp(J,ve,Ie),deviceKey:J,deviceLabel:j,quantityKey:ve,railKey:Ie,railLabel:te,dsMode:"device-field",dsChip:"",dsOffset:0,dsMask:255,dsSize:1,periodMs:Kc(fn.recommend.periodKey).periodMs,thresholds:dt,hysteresis:fn.recommend.hysteresis??0,events:re(ve),enabled:!0}}function Z(J){!x.value||D(J.key)||f.value.push(X(x.value.key,x.value.typeLabel,"voltage",J.key,J.label,J.nominal))}function k(){for(const J of U.value)D(J.key)||Z(J)}function G(){const J=Q.value.trim();!J||!x.value||(f.value.push(X(x.value.key,x.value.typeLabel,"voltage",J,J,12)),Q.value="")}function v(J){if(!x.value||O(J))return;const j=X(x.value.key,x.value.typeLabel,J);f.value.push(j),p.value=j.id}function K(J){const j=f.value.findIndex(ve=>ve.id===J);j>=0&&f.value.splice(j,1),p.value===J&&(p.value=null)}function S(J){const j=cn[J.quantityKey];if(j.kind==="threshold"){const ve=new Set(J.events.map(te=>te.levelField)),Ie=ee.find(te=>J.thresholds[te]!=null&&!ve.has(te))||ee.find(te=>!ve.has(te))||"UpperCritical";J.events.push({id:d(),suffix:`X${Yc(u.value)}`,label:ne[Ie],severity:"Major",operatorId:Ie.startsWith("Upper")?4:1,levelField:Ie,condition:1,eventKeyId:W(J)[0]||"",enabled:!0})}else J.events.push({id:d(),suffix:`X${Yc(u.value)}`,label:"状态命中",severity:"Major",operatorId:j.recommend.operatorId,condition:j.recommend.condition??1,eventKeyId:W(J)[0]||"",enabled:!0})}function z(J,j){const ve=J.events.findIndex(Ie=>Ie.id===j);ve>=0&&J.events.splice(ve,1)}function L(J){J.levelField&&(J.operatorId=J.levelField.startsWith("Upper")?4:1,J.label=ne[J.levelField])}function W(J){const j=cn[J.quantityKey],ve=new Set(j.recommend.eventKeyIds);return(j.recommend.events||[]).forEach(Ie=>ve.add(Ie.eventKeyId)),J.events.forEach(Ie=>{Ie.eventKeyId&&ve.add(Ie.eventKeyId)}),[...ve]}function Y(J,j){var Ie;const ve=(Ie=cn[J.quantityKey].recommend.thresholds)==null?void 0:Ie[j];J.thresholds[j]=ve??0}function se(J){const j=cn[J.quantityKey],ve=j.kind==="threshold"?{...J.thresholds}:void 0,Ie=J.events.filter(te=>te.enabled).map(te=>({suffix:te.suffix,eventKeyId:te.eventKeyId,operatorId:te.operatorId,label:te.label,severity:te.severity,levelField:te.levelField,condition:te.levelField?void 0:te.condition}));return{boardName:i.value,deviceKey:J.deviceKey,deviceLabel:J.deviceLabel,quantityKey:J.quantityKey,railKey:J.railKey,railLabel:J.railLabel,enabled:J.enabled,operatorId:j.recommend.operatorId,thresholds:ve,eventList:Ie,hysteresis:j.kind==="threshold"?J.hysteresis:void 0,dataSource:J.dsMode==="scanner"?{mode:"scanner",scanner:{chip:J.dsChip,offset:J.dsOffset,size:J.dsSize,mask:J.dsMask,periodMs:J.periodMs}}:{mode:"device-field",field:j.readingField}}}const oe=ie(()=>{const J={},j=[];for(const ve of h.value){const Ie=Vw({Objects:J},se(ve));Object.assign(J,Ie.objects),Ie.sensor&&j.push({cfg:ve,sensor:Ie.sensor,warnings:Ie.warnings})}return{objects:J,cards:j}}),me={voltage:"电压",temp:"温度",presence:"在位",chassis:"机箱",power:"电源 / 时序",system:"系统状态",other:"其他"};function be(J){const j=J.eventKeyId+" "+J.label;return/Chassis/i.test(J.eventKeyId)?"chassis":/Temp/i.test(j)?"temp":/_V_|Voltage|OverVolt|UnderVolt|(^|[^A-Za-z0-9])\d+(\.\d+)?V([^A-Za-z]|$)/i.test(j)?"voltage":/Install|Removed|Present|Insert|Missing|Disconnect/i.test(j)?"presence":/ACPI|System/i.test(j)?"system":/Power|Reset|OnTime|Boot|StartUp|PSU|Ok|Drop/i.test(j)?"power":"other"}function ue(J){return J==="__fw"?"非物理芯片 · 固件推送":ci(J.split("_")[0])}const pe=ie(()=>oe.value.objects),_e=ie(()=>JSON.stringify(pe.value,null,2)),ke=ie(()=>Object.keys(pe.value).filter(J=>J.startsWith("Event_")).length),Ne=ie(()=>oe.value.cards.length),De=ie(()=>oe.value.cards.find(J=>J.sensor.configId===p.value)||null),Se=ie(()=>{var J;return((J=De.value)==null?void 0:J.cfg)||null}),$=ie(()=>Hr(u.value).looseEvents),B=ie(()=>r.scopeChipKey?r.scopeChipKey==="__firmware"?$.value.filter(J=>!J.dsChip):$.value.filter(J=>J.dsChip===r.scopeChipKey):r.scopeDeviceKey?[]:$.value),g=ie(()=>B.value.length),y=Ee(null);function w(J){y.value=y.value===J?null:J}const F=ie(()=>{const J=te=>te||"__fw",j=new Map,ve=te=>{let ge=j.get(te);return ge||(ge={sensors:[],loose:[]},j.set(te,ge)),ge};for(const te of oe.value.cards)ve(J(te.cfg.dsChip)).sensors.push(te);for(const te of B.value)ve(J(te.dsChip)).loose.push(te);const Ie=[];for(const[te,ge]of j){const fn=new Map;for(const $n of ge.loose){const ft=be($n);let Tt=fn.get(ft);Tt||(Tt=[],fn.set(ft,Tt)),Tt.push($n)}const dt=Object.keys(me),ns=[...fn.entries()].sort(($n,ft)=>dt.indexOf($n[0])-dt.indexOf(ft[0])).map(([$n,ft])=>({cat:$n,label:me[$n]||$n,events:ft}));Ie.push({chipKey:te,chipLabel:te==="__fw"?"固件 / BIOS 推送":te,subLabel:ue(te),sensors:ge.sensors,cats:ns,sensorCount:ge.sensors.length,eventCount:ge.loose.length})}return Ie.sort((te,ge)=>ge.sensorCount*1e3+ge.eventCount-(te.sensorCount*1e3+te.eventCount))}),_=ie(()=>F.value.length);function C(J){return cn[J.quantityKey].kind==="threshold"}function E(J){return cn[J.quantityKey].unitLabel||""}function m(J,j){var ve;return(ve=cn[J.quantityKey].recommend.thresholds)==null?void 0:ve[j]}function M(J){var j;return((j=mo.find(ve=>ve.id===J))==null?void 0:j.symbol)||""}function q(J){var j;return((j=mo.find(ve=>ve.id===J))==null?void 0:j.desc)||""}function A(J){return J.dsMode==="device-field"||!!J.dsChip.trim()}function V(J){return J.cfg.railLabel||cn[J.cfg.quantityKey].label}function H(J,j){return j?J.thresholds[j]:void 0}function ce(J){return J.chipKey==="__fw"?"固件 / BIOS 推送：Reading=0 或无 Scanner，数据不经物理芯片，由固件直接上报。":`数据源器件 ${J.chipLabel}：其上的传感器与事件都从该芯片经 Scanner 取数（Reading ⟵ Scanner.Value ⟵ ${J.chipLabel}）。`}const ye=Ee(!1);function he(){var J;(J=navigator.clipboard)==null||J.writeText(_e.value).then(()=>{ye.value=!0,window.setTimeout(()=>{ye.value=!1},1500)})}const we=Ee(!1);function Re(){t(`${i.value}.sr`,_e.value)}const ze=Ee(!1),je=Ee(null),_n=Ee({});function nn(){ze.value=!ze.value,ze.value&&mn(()=>{var j;const J=(j=je.value)==null?void 0:j.getBoundingClientRect();J&&(_n.value={top:`${J.bottom+6}px`,right:`${Math.max(8,window.innerWidth-J.right)}px`})})}const on=new Map;function es(J,j){j?on.set(J,j):on.delete(J)}const vr=ot({}),_r=Ee(null);function Jl(J,j,ve){const Ie=J.right-ve.left,te=J.top-ve.top+J.height/2,ge=j.left-ve.left,fn=j.top-ve.top+j.height/2,dt=Math.max(18,(ge-Ie)*.45);return`M${Ie.toFixed(1)},${te.toFixed(1)} C${(Ie+dt).toFixed(1)},${te.toFixed(1)} ${(ge-dt).toFixed(1)},${fn.toFixed(1)} ${ge.toFixed(1)},${fn.toFixed(1)}`}function Xr(){for(const J of F.value){const j=on.get(J.chipKey);if(!j){vr[J.chipKey]=[];continue}const ve=j.getBoundingClientRect(),Ie=[],te=j.querySelector('[data-role="obj"]'),ge=te==null?void 0:te.getBoundingClientRect(),fn=Array.from(j.querySelectorAll("[data-event-of]"));j.querySelectorAll("[data-sensor-card]").forEach(dt=>{const ns=dt,$n=ns.getAttribute("data-sensor-card")||"",ft=ns.getBoundingClientRect();ge&&Ie.push({id:`os-${$n}`,sensorId:$n,d:Jl(ge,ft,ve)}),fn.filter(Tt=>Tt.getAttribute("data-event-of")===$n).forEach((Tt,o0)=>{Ie.push({id:`se-${$n}-${o0}`,sensorId:$n,d:Jl(ft,Tt.getBoundingClientRect(),ve)})})}),vr[J.chipKey]=Ie}}let Yr=null;return Mn(()=>{mn(Xr),Yr=new ResizeObserver(()=>Xr());const J=document.querySelector(".flow-list");J&&Yr.observe(J),window.addEventListener("resize",Xr)}),Wr(()=>{Yr==null||Yr.disconnect(),window.removeEventListener("resize",Xr)}),Fe([F,p,y],()=>mn(Xr)),(J,j)=>(b(),T("div",e3,[c("div",n3,[c("span",t3,R(e.scopeChipKey?"数据源器件":"来自拓扑"),1),c("span",r3,R(a.value||i.value),1),e.scopeChipKey?Ce("",!0):(b(),T("button",{key:0,ref_key:"addBtnRef",ref:je,class:fe(["btn-solid add-open",{on:ze.value}]),onClick:nn},"＋ 新增传感器",2))]),(b(),Xe(sh,{to:"body"},[ze.value?(b(),T("div",{key:0,class:"add-backdrop",onClick:j[0]||(j[0]=ve=>ze.value=!1)})):Ce("",!0),ze.value?(b(),T("div",{key:1,class:"add-pop",style:Ve(_n.value),onClick:j[2]||(j[2]=en(()=>{},["stop"]))},[e.scopeDeviceKey?Ce("",!0):(b(),T(de,{key:0},[j[14]||(j[14]=c("div",{class:"ap-title"},"选监控对象",-1)),c("div",o3,[(b(!0),T(de,null,Me(l.value,ve=>{var Ie;return b(),T("button",{key:ve.key,class:fe(["dev-chip",{active:((Ie=x.value)==null?void 0:Ie.key)===ve.key}]),onClick:te=>P.value=ve.key},[c("span",i3,R(ve.typeLabel),1),c("span",a3,R(ve.key),1)],10,s3)}),128))])],64)),x.value?(b(),T("div",l3,[c("div",u3,[j[15]||(j[15]=Pe(" 为 ",-1)),c("b",null,R(x.value.key),1),j[16]||(j[16]=Pe(" 添加传感器 ",-1)),c("span",{class:"i",title:N.value?"一个电压域含多条电压轨，每条轨=一个电压传感器，各自产出过压/欠压多条告警。":"一个监控量=一个传感器；门限量按档位产出多条告警。"},"i",8,c3)]),N.value?(b(),T(de,{key:0},[c("div",d3,[(b(!0),T(de,null,Me(U.value,ve=>(b(),T("button",{key:ve.key,class:fe(["add-chip",{used:D(ve.key)}]),disabled:D(ve.key),onClick:Ie=>Z(ve)},[c("span",null,R(ve.label),1),c("span",p3,R(ve.nominal)+"V",1)],10,f3))),128)),c("button",{class:"add-chip all",onClick:k},"＋ 全部添加")]),c("div",h3,[He(c("input",{"onUpdate:modelValue":j[1]||(j[1]=ve=>Q.value=ve),class:"num wide",placeholder:"自定义轨名，如 PVDDQ_ABCD",onKeyup:P1(G,["enter"])},null,544),[[an,Q.value]]),c("button",{class:"btn",onClick:G},"添加")])],64)):(b(),T("div",m3,[(b(!0),T(de,null,Me(x.value.quantities,ve=>(b(),T("button",{key:ve,class:fe(["add-chip",{used:O(ve)}]),disabled:O(ve),onClick:Ie=>v(ve)},[c("span",null,R(le(cn)[ve].label),1),c("span",_3,R(le(cn)[ve].kind==="threshold"?"门限量":"状态量"),1)],10,v3))),128))]))])):Ce("",!0)],4)):Ce("",!0)])),c("div",g3,[F.value.length?Ce("",!0):(b(),T("div",y3,R(e.scopeChipKey==="__firmware"?"该固件通道暂无离散状态传感器或事件。":e.scopeChipKey?"该器件仅参与拓扑/在位识别，未承载遥测传感器，也无独立事件。":"还没有告警链路。上方选监控对象、点电压轨 / 监控量即可添加一条。"),1)),(b(!0),T(de,null,Me(F.value,ve=>(b(),T("div",{key:ve.chipKey,class:"obj-block",ref_for:!0,ref:Ie=>es(ve.chipKey,Ie)},[(b(),T("svg",C3,[(b(!0),T(de,null,Me(vr[ve.chipKey]||[],Ie=>(b(),T("path",{key:Ie.id,d:Ie.d,class:fe(["conn",{active:_r.value===Ie.sensorId,dim:_r.value&&_r.value!==Ie.sensorId}])},null,10,S3))),128))])),c("div",{class:"chip-node","data-role":"obj",title:ce(ve)},[c("span",{class:fe(["cn-ic",{fw:ve.chipKey==="__fw"}])},[...j[17]||(j[17]=[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M9 3h6v2h3a1 1 0 0 1 1 1v3h2v2h-2v2h2v2h-2v3a1 1 0 0 1-1 1h-3v2H9v-2H6a1 1 0 0 1-1-1v-3H3v-2h2v-2H3V9h2V6a1 1 0 0 1 1-1h3V3zm0 5v8h6V8H9z"})],-1)])],2),c("span",E3,R(ve.chipLabel),1),c("span",w3,R(ve.subLabel),1),c("span",I3,R(ve.sensorCount?ve.sensorCount+" 传感器 · ":"")+R(ve.eventCount)+" 事件",1)],8,b3),c("div",P3,[j[44]||(j[44]=c("div",{class:"se-colhead"},[c("span",{class:"sch sch-s"},"传感器"),c("span",{class:"sch sch-e"},"事件 / 告警（按类）")],-1)),(b(!0),T(de,null,Me(ve.sensors,Ie=>(b(),T(de,{key:Ie.sensor.configId},[c("div",{class:fe(["se-row",[Ie.sensor.kind,{open:p.value===Ie.sensor.configId,hot:_r.value===Ie.sensor.configId}]]),onMouseenter:te=>_r.value=Ie.sensor.configId,onMouseleave:j[3]||(j[3]=te=>_r.value=null)},[c("div",x3,[c("button",{class:"sensor-card","data-sensor-card":Ie.sensor.configId,onClick:te=>I(Ie.sensor.configId)},[j[19]||(j[19]=c("span",{class:"sc-ic"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"})])],-1)),c("span",{class:"sc-name",title:V(Ie)},R(V(Ie)),9,M3),c("span",k3,R(Ie.sensor.kind==="threshold"?"门限":"状态"),1),c("i",{class:fe(["dot sc-dsdot",A(Ie.cfg)?"ok":"warn"]),title:A(Ie.cfg)?"数据源已接":"数据源未接"},null,10,T3),c("span",{class:fe(["sc-chev",{open:p.value===Ie.sensor.configId}])},[...j[18]||(j[18]=[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M8.5 5l7 7-7 7z"})],-1)])],2)],8,D3),c("button",{class:"branch-del",title:"删除该链路及其告警",onClick:en(te=>K(Ie.cfg.id),["stop"])},"✕",8,V3)]),c("div",N3,[Ie.sensor.events.length?Ce("",!0):(b(),T("div",A3,"未设门限 · 暂无告警")),(b(!0),T(de,null,Me(Ie.sensor.events,te=>(b(),T("button",{key:te.key,class:fe(["event-node click",te.severity]),"data-event-of":Ie.sensor.configId,title:"点击展开配置 · "+te.eventKeyId+" · "+te.operator+" "+te.conditionLabel,onClick:en(ge=>I(Ie.sensor.configId),["stop"])},[j[20]||(j[20]=c("span",{class:"en-ic"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"})])],-1)),c("span",O3,R(te.label),1)],10,F3))),128))])],42,$3),p.value===Ie.sensor.configId&&Se.value&&De.value?(b(),T("div",B3,[c("div",R3,[Pe("传感器 · "+R(V(Ie)),1),c("span",L3,R(le(cn)[Se.value.quantityKey].explain),1)]),C(Se.value)?(b(),T("div",U3,[(b(),T(de,null,Me(ee,te=>c("div",{key:te,class:fe(["thr-pill",{off:Se.value.thresholds[te]==null}]),title:ne[te]+" 门限"},[c("span",z3,R(ne[te]),1),He(c("input",{"onUpdate:modelValue":ge=>Se.value.thresholds[te]=ge,type:"number",class:"thr-in",placeholder:m(Se.value,te)!=null?"关":"—"},null,8,K3),[[an,Se.value.thresholds[te],void 0,{number:!0}]]),m(Se.value,te)!=null?(b(),T("span",W3,"荐"+R(m(Se.value,te)),1)):Ce("",!0)],10,H3)),64)),c("span",G3,R(E(Se.value)),1)])):(b(),T("div",X3,"离散状态量：无门限，触发值与告警在下方「事件」配置。")),c("div",Y3,[j[22]||(j[22]=c("label",null,"数据源",-1)),He(c("select",{"onUpdate:modelValue":j[4]||(j[4]=te=>Se.value.dsMode=te),class:"disc-sel wide"},[c("option",q3,"器件读数 · "+R(Se.value.deviceKey)+"."+R(le(cn)[Se.value.quantityKey].readingField)+"（推荐 · 已接）",1),j[21]||(j[21]=c("option",{value:"scanner"},"从寄存器周期读（高级 · 需选硬件信号）",-1))],512),[[qn,Se.value.dsMode]])]),c("div",j3,R(Se.value.dsMode==="scanner"?le(Wc).scanner:le(Wc).deviceField),1),Se.value.dsMode==="scanner"?(b(),T(de,{key:2},[c("div",Z3,[c("label",null,[j[23]||(j[23]=Pe("硬件信号(Chip)",-1)),He(c("input",{"onUpdate:modelValue":j[5]||(j[5]=te=>Se.value.dsChip=te),class:"thr-in w",placeholder:"Smc_..."},null,512),[[an,Se.value.dsChip]])]),c("label",null,[j[24]||(j[24]=Pe("偏移(Offset)",-1)),He(c("input",{"onUpdate:modelValue":j[6]||(j[6]=te=>Se.value.dsOffset=te),type:"number",class:"thr-in w"},null,512),[[an,Se.value.dsOffset,void 0,{number:!0}]])]),c("label",null,[j[25]||(j[25]=Pe("字节(Size)",-1)),He(c("input",{"onUpdate:modelValue":j[7]||(j[7]=te=>Se.value.dsSize=te),type:"number",class:"thr-in w"},null,512),[[an,Se.value.dsSize,void 0,{number:!0}]])]),c("label",null,[j[26]||(j[26]=Pe("掩码(Mask)",-1)),He(c("input",{"onUpdate:modelValue":j[8]||(j[8]=te=>Se.value.dsMask=te),type:"number",class:"thr-in w"},null,512),[[an,Se.value.dsMask,void 0,{number:!0}]])])]),c("div",J3,[j[27]||(j[27]=c("label",null,"采集周期",-1)),He(c("select",{"onUpdate:modelValue":j[9]||(j[9]=te=>Se.value.periodMs=te),class:"disc-sel wide",title:"来自 README §6 扫描周期分类"},[(b(!0),T(de,null,Me(le(Fs),te=>(b(),T("option",{key:te.periodMs+te.label,value:te.periodMs},R(te.label)+" · "+R(te.periodMs)+"ms"+R(le(Kc)(le(cn)[Se.value.quantityKey].recommend.periodKey).periodMs===te.periodMs?"（推荐）":""),9,Q3))),128))],512),[[qn,Se.value.periodMs,void 0,{number:!0}]])])],64)):Ce("",!0),C(Se.value)?(b(),T("div",eI,[j[28]||(j[28]=c("label",null,"迟滞",-1)),He(c("input",{"onUpdate:modelValue":j[10]||(j[10]=te=>Se.value.hysteresis=te),type:"number",class:"thr-in w"},null,512),[[an,Se.value.hysteresis,void 0,{number:!0}]]),c("span",nI,"推荐 "+R(le(cn)[Se.value.quantityKey].recommend.hysteresis??2)+" · 回差防抖",1)])):Ce("",!0),c("div",tI,[Pe("事件 · 已配置 "+R(Se.value.events.length)+" · 生效 "+R(De.value.sensor.events.length)+" ",1),c("button",{class:"ev-add",onClick:j[11]||(j[11]=te=>S(Se.value))},"＋ 添加事件")]),C(Se.value)?(b(!0),T(de,{key:4},Me(Se.value.events,te=>(b(),T("div",{key:te.id,class:fe(["ev-edit",{inactive:H(Se.value,te.levelField)==null||!te.enabled}])},[c("label",rI,[He(c("input",{type:"checkbox","onUpdate:modelValue":ge=>te.enabled=ge},null,8,oI),[[Qi,te.enabled]])]),c("label",sI,[j[29]||(j[29]=c("span",{class:"ef-k"},[Pe("档位"),c("i",{class:"i",title:"事件监视哪一档门限；触发值自动引用该档，改门限只改一处。"},"i")],-1)),He(c("select",{"onUpdate:modelValue":ge=>te.levelField=ge,class:"disc-sel",onChange:ge=>L(te)},[(b(),T(de,null,Me(ee,ge=>c("option",{key:ge,value:ge},R(ne[ge])+R(Se.value.thresholds[ge]!=null?" = "+Se.value.thresholds[ge]:"（未设）"),9,aI)),64))],40,iI),[[qn,te.levelField]])]),c("span",lI,[j[30]||(j[30]=c("span",{class:"ef-k"},"方向",-1)),c("span",{class:"ef-dir",title:q(te.operatorId)},R(M(te.operatorId))+" 门限",9,uI)]),c("label",cI,[j[31]||(j[31]=c("span",{class:"ef-k"},"分级",-1)),He(c("select",{"onUpdate:modelValue":ge=>te.severity=ge,class:"disc-sel"},[(b(),T(de,null,Me(ae,ge=>c("option",{key:ge.v,value:ge.v},R(ge.label),9,fI)),64))],8,dI),[[qn,te.severity]])]),c("label",pI,[j[32]||(j[32]=c("span",{class:"ef-k"},[Pe("告警字典条目"),c("i",{class:"i",title:"EventKeyId：决定告警在字典中的文案与等级映射。首项为推荐。"},"i")],-1)),He(c("select",{"onUpdate:modelValue":ge=>te.eventKeyId=ge,class:"disc-sel wide"},[(b(!0),T(de,null,Me(W(Se.value),(ge,fn)=>(b(),T("option",{key:ge,value:ge},R(ge)+R(fn===0?"（推荐）":""),9,mI))),128))],8,hI),[[qn,te.eventKeyId]])]),te.levelField?(b(),T("span",vI,[H(Se.value,te.levelField)!=null?(b(),T(de,{key:0},[c("code",null,R(De.value.sensor.sensorKey)+"."+R(te.levelField),1),Pe(" = "+R(H(Se.value,te.levelField)),1)],64)):(b(),T("button",{key:1,class:"ev-fix",onClick:ge=>Y(Se.value,te.levelField)},"该档未设 · 设推荐",8,_I))])):Ce("",!0),c("button",{class:"ev-del",title:"删除该事件",onClick:ge=>z(Se.value,te.id)},"✕",8,gI)],2))),128)):(b(!0),T(de,{key:5},Me(Se.value.events,te=>(b(),T("div",{key:te.id,class:fe(["ev-edit",{inactive:!te.enabled}])},[c("label",yI,[He(c("input",{type:"checkbox","onUpdate:modelValue":ge=>te.enabled=ge},null,8,CI),[[Qi,te.enabled]])]),c("label",SI,[j[33]||(j[33]=c("span",{class:"ef-k"},[Pe("触发值"),c("i",{class:"i",title:"读数=触发值即命中；离散量一般 1=置位/故障，0=不在位。"},"i")],-1)),He(c("input",{"onUpdate:modelValue":ge=>te.condition=ge,type:"number",class:"thr-in w"},null,8,bI),[[an,te.condition,void 0,{number:!0}]]),c("i",EI,"荐"+R(le(cn)[Se.value.quantityKey].recommend.condition??1),1)]),c("label",wI,[j[34]||(j[34]=c("span",{class:"ef-k"},"方向",-1)),He(c("select",{"onUpdate:modelValue":ge=>te.operatorId=ge,class:"disc-sel"},[(b(!0),T(de,null,Me(le(mo),ge=>(b(),T("option",{key:ge.id,value:ge.id},R(ge.symbol)+" "+R(ge.label)+R(ge.id===le(cn)[Se.value.quantityKey].recommend.operatorId?"（推荐）":""),9,PI))),128))],8,II),[[qn,te.operatorId,void 0,{number:!0}]])]),c("label",$I,[j[35]||(j[35]=c("span",{class:"ef-k"},"分级",-1)),He(c("select",{"onUpdate:modelValue":ge=>te.severity=ge,class:"disc-sel"},[(b(),T(de,null,Me(ae,ge=>c("option",{key:ge.v,value:ge.v},R(ge.label),9,DI)),64))],8,xI),[[qn,te.severity]])]),c("label",MI,[j[36]||(j[36]=c("span",{class:"ef-k"},[Pe("告警字典条目"),c("i",{class:"i",title:"EventKeyId：决定告警在字典中的文案与等级映射。首项为推荐。"},"i")],-1)),He(c("select",{"onUpdate:modelValue":ge=>te.eventKeyId=ge,class:"disc-sel wide"},[(b(!0),T(de,null,Me(W(Se.value),(ge,fn)=>(b(),T("option",{key:ge,value:ge},R(ge)+R(fn===0?"（推荐）":""),9,TI))),128))],8,kI),[[qn,te.eventKeyId]])]),c("button",{class:"ev-del",title:"删除该事件",onClick:ge=>z(Se.value,te.id)},"✕",8,VI)],2))),128)),(b(!0),T(de,null,Me(De.value.warnings,te=>(b(),T("div",{key:te,class:"fn-warn"},R(te),1))),128))])):Ce("",!0)],64))),128)),ve.cats.length?(b(),T("div",NI,[(b(!0),T(de,null,Me(ve.cats,Ie=>(b(),T("div",{key:ve.chipKey+":"+Ie.cat,class:"cat-grp"},[c("div",{class:fe(["cat-head",Ie.cat])},[j[37]||(j[37]=c("span",{class:"cat-dot"},null,-1)),c("span",AI,R(Ie.label),1),c("span",FI,R(Ie.events.length),1),j[38]||(j[38]=c("span",{class:"cat-nos"},"无传感器 · 直连器件数据源",-1))],2),c("div",OI,[(b(!0),T(de,null,Me(Ie.events,te=>(b(),T(de,{key:te.id},[c("button",{class:fe(["event-node click",[te.severity,{open:y.value===te.id,off:!te.enabled}]]),title:"点击展开配置 · "+te.eventKeyId,onClick:en(ge=>w(te.id),["stop"])},[j[39]||(j[39]=c("span",{class:"en-ic"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"})])],-1)),c("span",RI,R(te.label),1),c("span",LI,R(M(te.operatorId))+" "+R(te.condition),1)],10,BI),y.value===te.id?(b(),T("div",UI,[c("div",HI,[Pe("独立事件 · "+R(te.label),1),c("span",zI,R(te.eventKeyId)+" · 不经传感器，直连器件数据源",1)]),c("div",KI,[c("label",WI,[He(c("input",{type:"checkbox","onUpdate:modelValue":ge=>te.enabled=ge},null,8,GI),[[Qi,te.enabled]])]),c("label",XI,[j[40]||(j[40]=c("span",{class:"ef-k"},[Pe("触发值"),c("i",{class:"i",title:"Condition：读数达到该字面值即命中（电压限值 / PMBus 状态位 / 在位标志）。"},"i")],-1)),He(c("input",{"onUpdate:modelValue":ge=>te.condition=ge,type:"number",class:"thr-in w"},null,8,YI),[[an,te.condition,void 0,{number:!0}]])]),c("label",qI,[j[41]||(j[41]=c("span",{class:"ef-k"},"方向",-1)),He(c("select",{"onUpdate:modelValue":ge=>te.operatorId=ge,class:"disc-sel"},[(b(!0),T(de,null,Me(le(mo),ge=>(b(),T("option",{key:ge.id,value:ge.id},R(ge.symbol)+" "+R(ge.label),9,ZI))),128))],8,jI),[[qn,te.operatorId,void 0,{number:!0}]])]),c("label",JI,[j[42]||(j[42]=c("span",{class:"ef-k"},"分级",-1)),He(c("select",{"onUpdate:modelValue":ge=>te.severity=ge,class:"disc-sel"},[(b(),T(de,null,Me(ae,ge=>c("option",{key:ge.v,value:ge.v},R(ge.label),9,eP)),64))],8,QI),[[qn,te.severity]])]),c("label",nP,[j[43]||(j[43]=c("span",{class:"ef-k"},"告警字典条目",-1)),c("code",tP,R(te.eventKeyId),1)])])])):Ce("",!0)],64))),128))])]))),128))])):Ce("",!0)])]))),128))]),Ne.value||g.value?(b(),T("div",rP,[c("div",oP,[c("span",null,[Pe(R(_.value)+" 个数据源器件 · "+R(Ne.value)+" 个传感器 · "+R(ke.value)+" 条告警",1),g.value?(b(),T(de,{key:0},[Pe(" · "+R(g.value)+" 条独立事件",1)],64)):Ce("",!0),j[45]||(j[45]=Pe(" → 将写入 ",-1)),c("b",null,R(i.value)+".sr",1)]),c("div",sP,[c("button",{class:"btn",onClick:Re,title:"在右侧分屏打开对应代码文件"},[...j[46]||(j[46]=[c("svg",{class:"btn-ic",viewBox:"0 0 24 24","aria-hidden":"true"},[c("path",{d:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"})],-1),Pe("代码 ",-1)])]),p.value?(b(),T("button",{key:0,class:"btn",onClick:j[12]||(j[12]=ve=>p.value=null)},"收起全部")):Ce("",!0),c("button",{class:"btn",onClick:j[13]||(j[13]=ve=>we.value=!we.value)},R(we.value?"隐藏":"查看")+" CSR 对象",1),c("button",{class:"btn-solid",onClick:he},R(ye.value?"已复制":"复制全部"),1)])]),we.value?(b(),T("pre",iP,R(_e.value),1)):Ce("",!0)])):Ce("",!0)]))}}),al=Xn(aP,[["__scopeId","data-v-815f81e9"]]),lP={EXU:"SMC 扫描 + LM75",CLU:"SMC 扫描",SEU:"RAID / 存储固件",PSU:"PMBus 器件",BCU:"SMC 扫描",PSR:"PMBus 器件"};function uP(e){return/Fail|Nonrecoverable|Fatal/i.test(e)?"crit":/Major|Critical/i.test(e)?"maj":"min"}function cP(e){let n=0,t=0,r=0,o=0;for(const[s,i]of Object.entries(e.objects)){const a=mr(s);if(a==="ThresholdSensor")n++;else if(a==="DiscreteSensor")t++;else if(a==="Event"){r++;const l=typeof i.EventKeyId=="string"?i.EventKeyId:"";/^Chassis\./.test(l)&&o++}}return{name:e.unitName,type:e.unitType,chips:e.chips.length,thresholdSensors:n,discreteSensors:t,events:r,chassisEvents:o,sourceModel:lP[e.unitType]||"—"}}function n0(){return jl().map(cP)}function t0(){const e=[];for(const n of jl())for(const[t,r]of Object.entries(n.objects)){if(mr(t)!=="Event")continue;const o=typeof r.EventKeyId=="string"?r.EventKeyId:"";/^Chassis\./.test(o)&&e.push({board:n.unitName,keyId:o,name:o.replace(/^Chassis\./,""),severity:uP(o)})}return e}function dP(){const e=[];for(const n of jl())for(const t of ql(n.objects))t.events.some(r=>/^Chassis\./.test(r.eventKeyId))&&e.push({board:n.unitName,name:t.name.replace(/^ThresholdSensor_|^DiscreteSensor_/,""),kind:t.kind,thresholds:t.thresholds,events:t.events.map(r=>({eventKeyId:r.eventKeyId,level:r.level}))});return e}function fP(){const e=new Map;for(const t of dP())(e.get(t.name)??e.set(t.name,[]).get(t.name)).push(t);const n=[];for(const[t,r]of e){if(r.length<2)continue;const o=new Set;r.forEach(s=>Object.keys(s.thresholds).forEach(i=>o.add(i)));for(const s of o){const i=r.map(a=>({board:a.board,value:a.thresholds[s]})).filter(a=>a.value!=null);i.length>1&&new Set(i.map(a=>a.value)).size>1&&n.push({name:t,field:s,values:i})}}return n}const pP={class:"cp-header"},hP={class:"cp-body"},mP={class:"cp-stats"},vP={class:"stat"},_P={class:"stat-n"},gP={class:"stat"},yP={class:"stat-n"},CP={class:"stat"},SP={class:"stat-n"},bP={class:"stat"},EP={class:"stat-n"},wP={class:"stat"},IP={class:"stat-n"},PP={class:"cp-card"},$P={class:"rt-name"},xP={class:"rt-nm"},DP={class:"rt-src"},MP={class:"rt-n"},kP={class:"rt-n"},TP={class:"rt-n"},VP={class:"rt-n"},NP={key:0,class:"cp-card cp-warn"},AP={class:"cp-cap"},FP={class:"incon-name"},OP={class:"incon-vals"},BP={class:"cp-card"},RP={key:0,class:"cp-empty"},LP={class:"chs-grid"},UP=["title"],HP=Be({__name:"ChassisOverview",props:{boards:{}},emits:["close"],setup(e){const n=e;Mn(()=>{for(const l of n.boards)fi(l.name)});const t=ie(()=>n0()),r=ie(()=>t0()),o=ie(()=>fP()),s=ie(()=>t.value.reduce((l,u)=>l+u.thresholdSensors+u.discreteSensors,0)),i=ie(()=>t.value.reduce((l,u)=>l+u.chips,0)),a=ie(()=>t.value.reduce((l,u)=>l+u.events,0));return(l,u)=>(b(),T("div",{class:"chassis-panel",onClick:u[1]||(u[1]=en(()=>{},["stop"]))},[c("div",pP,[u[2]||(u[2]=c("span",null,"整机 · 告警总览",-1)),u[3]||(u[3]=c("span",{class:"cp-sub"},"多板演示集（真实 .sr）· EXU 机箱主板 + CLU / SEU / PSU",-1)),c("button",{class:"cp-close","aria-label":"关闭",onClick:u[0]||(u[0]=d=>l.$emit("close"))},"✕")]),c("div",hP,[c("div",mP,[c("div",vP,[c("span",_P,R(t.value.length),1),u[4]||(u[4]=c("span",{class:"stat-l"},"样例板卡",-1))]),c("div",gP,[c("span",yP,R(i.value),1),u[5]||(u[5]=c("span",{class:"stat-l"},"物理器件",-1))]),c("div",CP,[c("span",SP,R(s.value),1),u[6]||(u[6]=c("span",{class:"stat-l"},"传感器",-1))]),c("div",bP,[c("span",EP,R(a.value),1),u[7]||(u[7]=c("span",{class:"stat-l"},"事件/告警",-1))]),c("div",wP,[c("span",IP,R(r.value.length),1),u[8]||(u[8]=c("span",{class:"stat-l"},"机箱级",-1))])]),c("div",PP,[u[9]||(u[9]=c("div",{class:"cp-cap"},"各板明细 · 来自真实 .sr（硬件 + 软件合并）",-1)),u[10]||(u[10]=c("div",{class:"rt-head"},[c("span",null,"板卡"),c("span",null,"器件"),c("span",null,"门限"),c("span",null,"状态"),c("span",null,"事件"),c("span",null,"机箱")],-1)),(b(!0),T(de,null,Me(t.value,d=>(b(),T("div",{key:d.name,class:"rt-row"},[c("span",$P,[c("span",xP,R(d.name),1),c("span",DP,R(d.type)+" · "+R(d.sourceModel),1)]),c("span",MP,R(d.chips),1),c("span",kP,R(d.thresholdSensors),1),c("span",TP,R(d.discreteSensors),1),c("span",VP,R(d.events),1),c("span",{class:fe(["rt-n",{hot:d.chassisEvents}])},R(d.chassisEvents||"—"),3)]))),128))]),o.value.length?(b(),T("div",NP,[c("div",AP,"跨板一致性 · "+R(o.value.length)+" 项待核对",1),(b(!0),T(de,null,Me(o.value,(d,f)=>(b(),T("div",{key:f,class:"incon-row"},[c("span",FP,R(d.name)+"."+R(d.field),1),c("span",OP,[(b(!0),T(de,null,Me(d.values,h=>(b(),T("span",{key:h.board,class:"incon-v"},R(h.board)+"="+R(h.value),1))),128))])]))),128))])):Ce("",!0),c("div",BP,[u[11]||(u[11]=c("div",{class:"cp-cap"},"机箱级事件（Chassis.* · 跨板归属机箱）",-1)),r.value.length?Ce("",!0):(b(),T("div",RP,"暂无机箱级事件")),c("div",LP,[(b(!0),T(de,null,Me(r.value,(d,f)=>(b(),T("span",{key:f,class:"chs-ev",title:d.board+" · "+d.keyId},[c("i",{class:fe(["chs-dot",d.severity])},null,2),Pe(R(d.name),1)],8,UP))),128))])]),u[12]||(u[12]=c("div",{class:"cp-note"},"整机层只做总览 + 机箱级 + 一致性；逐条编辑请到板卡 / 器件配置面板。",-1))])]))}}),zP=Xn(HP,[["__scopeId","data-v-0f53d991"]]),ba=[40,510,1450],KP={EXU:1020,BCU:520,CLU:200,IEU:450,NICCard:250,Unknown:120},WP=310,GP=250,Cs=64,XP=500;function YP(e){return e.name.startsWith("M2")?200:300}function jc(e,n={}){var k;const t=OE(FE(Yl)),r=t.filter(zc),o=t.filter(G=>!zc(G)),s=r.filter(G=>G.category==="exu"),i=r.filter(G=>G.category!=="exu"),a=[],l=[];function u(G){return G.type==="SEU"?YP(G):KP[G.type]??GP}const d=i.reduce((G,v)=>G+u(v),0)+Math.max(0,i.length-1)*Cs,f=XP,h="bmc-root";a.push({id:h,type:"bmc",position:{x:ba[0],y:f-WP/2},data:Et({label:"BMC",subtitle:"根节点 · openUBMC"}),draggable:!0,selectable:!0});const p=5,I=i.map(G=>{const K=Gr(G.type,G.name).buses.filter(S=>!S.dashed).map(({id:S,label:z,busType:L,color:W})=>({id:S,label:z,busType:L,color:W}));return K.length>0?K:[{id:"fallback",label:"",busType:"default",color:to.default}]}),P=[],x=Math.max(0,...I.map(G=>G.length));for(let G=0;G<x;G++)for(let v=0;v<i.length;v++)G<I[v].length&&P.push({groupIdx:v,busIdxInGroup:G,bus:I[v][G]});const N=P.length,U=P.map((G,v)=>({id:`r-${i[G.groupIdx].id}-${G.bus.id}`,pct:(v+.5)/N,color:to[G.bus.busType]??G.bus.color??to.default})),D=s.reduce((G,v)=>G+u(v),0)+Math.max(0,s.length-1)*Cs;let O=f-D/2;const Q=[];for(const G of s){const v=G.id;Q.push(v),a.push({id:v,type:"boardgroup",position:{x:ba[1],y:O},data:{group:G,selectedId:n[G.id]??G.boards[0].id,onSelect:e,sourceHandles:U},draggable:!0,selectable:!0}),l.push({id:`e-${h}-${v}`,source:h,sourceHandle:"r",target:v,targetHandle:"l",type:"smoothstep",class:"edge-trunk",style:{stroke:"#818cf8",strokeWidth:2,opacity:.9}}),O+=u(G)+Cs}let ee=f-d/2;const ne=Q[0],ae=i.length,re=40,Z=ae>1?(270-re)/(ae-1):0;for(let G=0;G<i.length;G++){const v=i[G],K=v.id,S=(ae-1-G)*Z+re,z=I[G],L=z.length;if(a.push({id:K,type:"boardgroup",position:{x:ba[2],y:ee},data:{group:v,selectedId:n[v.id]??((k=v.boards[0])==null?void 0:k.id)??"",onSelect:e},draggable:!0,selectable:!0}),ne){let W,Y=.88,se;switch(v.state){case"multi-match":se="#f59e0b",W="5 3";break;case"type-placeholder":se="#eab308",W="5 3";break;case"missing":se="#ef4444",W="3 3",Y=.75;break}for(let oe=0;oe<L;oe++){const me=z[oe],be=(oe-(L-1)/2)*p,ue=se??to[me.busType]??me.color??to.default;l.push({id:`e-${ne}-${K}-${me.id}`,source:ne,sourceHandle:`r-${K}-${me.id}`,target:K,targetHandle:"l",type:"manhattan",data:{laneOffset:S,yOffAtTarget:be,groupId:K},style:{stroke:ue,strokeWidth:1.5,strokeDasharray:W,opacity:Y}})}}ee+=u(v)+Cs}return{nodes:a,edges:l,groups:t,unclassifiedGroups:o}}function Zl(e,n){const t=Gr(e,n),r=[];for(const o of t.buses){for(const s of o.chips)r.push(s.chipType);if(o.mux)for(const s of o.mux.chips)r.push(s.chipType)}return r}function r0(e,n){var r;const t=Gr(e,n);for(const o of t.buses){const s=o.chips.find(a=>a.chipType==="Smc");if(s)return`${o.label} / ${s.label}`;const i=(r=o.mux)==null?void 0:r.chips.find(a=>a.chipType==="Smc");if(i)return`${o.label} · ${o.mux.label} / ${i.label}`}}function ll(e,n){const t=Zl(e,n);return e==="CLU"?{func:"0x03",label:"Fan 风扇控制"}:t.includes("Lm75")?{func:"0x0C",label:"Thermal 温度管理"}:t.includes("VRD")?{func:"0x02",label:"Power 电源管理"}:e==="SEU"?{func:"0x10",label:"Storage 存储"}:e==="NICCard"?{func:"0x20",label:"Network 网络"}:{func:"0x01",label:"System 系统管理"}}function ul(e,n){const t=Zl(e,n);return t.includes("Lm75")?"$1 | mul 0.125 | round 1":t.includes("VRD")?"$1 | mul 4 | div 1000 | round 3":"$1 | mul 100 | div 256 | toHex 4"}function Zc(e){const n=Zl(e.type,e.name),t=e.connectors??[],r=t.filter(s=>/fan|clu/i.test(s.name+s.type)).map(s=>s.name),o=[];return n.includes("Lm75")&&o.push(`${e.name} 板温(Lm75)`),t.filter(s=>/disk|seu/i.test(s.name+s.type)).forEach(s=>o.push(`${s.name} 盘温`)),(e.type==="BCU"||n.includes("CPU"))&&o.push("CpuInlet 进风口"),{fans:r.length?r:e.type==="CLU"?[`${e.name} 风扇组`]:[],tempZones:o}}const qP={class:"topo-root"},jP={key:1,class:"topo-palette open"},ZP={class:"panel-hd"},JP={class:"ph-actions"},QP={class:"chk-chip chk-ok"},e$={class:"chk-chip chk-ok"},n$={key:0,class:"chk-chip chk-err"},t$={class:"hw-search-row"},r$={class:"sec-hd"},o$={viewBox:"0 0 24 24",width:"10",height:"10",style:{color:"var(--foreground-muted)",transform:"rotate(90deg)","flex-shrink":"0"},fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round"},s$={class:"hw-tree"},i$=["onClick"],a$={class:"hw-cat-label"},l$={class:"hw-count"},u$={key:0,class:"hw-cat-body"},c$=["title","onClick"],d$={key:1,class:"hw-caret hw-caret-empty"},f$=["title"],p$={class:"hw-grp-name"},h$=["disabled","onClick"],m$={key:0,class:"hw-files"},v$=["title","onClick"],_$={class:"hw-file-name"},g$={key:1,class:"unc-popover"},y$={key:0,class:"unc-empty"},C$=["onClick"],S$={class:"unc-slot-type"},b$={class:"unc-slot-name"},E$={class:"topo-canvas-wrap"},w$={class:"bus-legend"},I$={class:"pp-header"},P$={class:"pp-tabs",role:"tablist"},$$={class:"pp-body"},x$={class:"pp-card pp-devlist"},D$=["onClick"],M$={class:"di-main"},k$={class:"di-type"},T$={class:"di-key"},V$={key:0,class:"di-cnt"},N$={key:1,class:"di-cnt ev"},A$={key:0,class:"di-empty"},F$={class:"pp-card"},O$={class:"pp-field"},B$={class:"pp-field-value"},R$={class:"pp-field"},L$={key:0,class:"pp-field"},U$={class:"pp-field-value mono"},H$={key:1,class:"pp-field"},z$={class:"pp-field-value mono"},K$={key:2,class:"pp-field"},W$={class:"pp-field-value mono",style:{color:"var(--danger)"}},G$={class:"pp-card"},X$={class:"pp-field"},Y$={class:"pp-field-value"},q$={class:"pp-field"},j$={class:"pp-field-value mono"},Z$={class:"pp-field"},J$={class:"pp-field-value mono"},Q$={class:"pp-field"},e4={class:"pp-field-value mono pp-files"},n4={key:1,class:"pp-field"},t4={class:"pp-field-value",style:{"font-size":"11px","line-height":"1.5"}},r4={key:1,class:"pp-alarm"},o4={key:0,class:"pp-body"},s4={class:"pp-card"},i4={class:"pp-field"},a4={class:"pp-field-value mono"},l4={class:"pp-field"},u4={class:"pp-field-value"},c4={key:0,class:"pp-field"},d4={class:"pp-field-value mono"},f4={class:"pp-field"},p4={class:"pp-field-value"},h4={class:"pp-field"},m4={class:"pp-field-value"},v4={key:0,style:{color:"var(--foreground-muted)"}},_4={class:"pp-field"},g4={class:"pp-field-value mono"},y4={key:0,class:"pp-card"},C4={key:1,class:"pp-alarm"},S4=Be({__name:"TopologyView",setup(e){const{state:n,invoke:t}=zi(),r={bmc:Et(AE),boardgroup:Et(yw)},o={manhattan:Et(Ew)},{fitView:s}=Je(),i=Ee({}),a=Ee(null),l=Ee(null);lt("activeEdgeId",$o(l));const u=Ee([]),d=Ee(null);function f(_,C){i.value={...i.value,[_]:C},p.value=p.value.map(E=>E.id===_?{...E,data:{...E.data,selectedId:C}}:E)}const h=jc(f,i.value),p=Ee(h.nodes),I=Ee(h.edges);u.value=h.unclassifiedGroups,Mn(()=>setTimeout(()=>s({padding:.1}),80));const P=ie(()=>h.groups.filter(_=>_.state!=="unclassified")),x=["BCU","CLU","EXU","IEU","SEU","NICCard","Unknown"],N=Ee(Object.fromEntries(x.map(_=>[_,!0]))),U=Ee({}),D=Ee(""),O=Ee(!1),Q=ie(()=>{const _=n0();return{boards:_.length,sensors:_.reduce((C,E)=>C+E.thresholdSensors+E.discreteSensors,0),events:_.reduce((C,E)=>C+E.events,0),chassis:t0().length}}),ee=ie(()=>{const _=[...P.value,...u.value],C=new Map;for(const E of _){const m=E.type&&ui[E.type]?E.type:"Unknown";C.has(m)||C.set(m,[]),C.get(m).push(E)}return x.filter(E=>C.has(E)).map(E=>({type:E,label:ui[E]??E,groups:C.get(E),boardCount:C.get(E).reduce((m,M)=>m+M.boards.length,0)}))}),ne=ie(()=>{const _=D.value.trim().toLowerCase();return _?ee.value.map(C=>({...C,groups:C.groups.filter(E=>E.name.toLowerCase().includes(_))})).filter(C=>C.groups.length>0):ee.value});function ae(_){N.value={...N.value,[_]:!N.value[_]}}function re(_){U.value={...U.value,[_]:!U.value[_]}}function X(_){_.state!=="unclassified"&&G(_.id),_.boards.length&&re(_.id)}function Z(_,C){f(_.id,C.id),G(_.id)}function k(_){return`${_.partNumber}_…${_.sn.slice(-4)}.sr`}function G(_){a.value=p.value.find(E=>E.id===_)??null;const C=p.value.find(E=>E.id===_);C&&setTimeout(()=>s({padding:.1,nodes:[C.id]}),30)}const v=ie(()=>P.value.filter(_=>_.state==="type-placeholder"||_.state==="missing"));function K(_){d.value=d.value===_?null:_}function S(_,C){u.value=u.value.filter(E=>E.id!==_),d.value=null,G(C)}function z(_){a.value=_.node,l.value=null}function L(_){const C=_.edge.id;l.value=l.value===C?null:C}function W(){a.value=null,l.value=null}function Y(){const _=jc(f,i.value);p.value=_.nodes,I.value=_.edges,setTimeout(()=>s({padding:.1}),80)}function se(){const _={};for(const C of h.groups)C.boards[0]&&(_[C.id]=C.boards[0].id);i.value=_,p.value=p.value.map(C=>C.type==="boardgroup"&&_[C.id]?{...C,data:{...C.data,selectedId:_[C.id]}}:C)}const oe=ie(()=>{const _=a.value;return!_||_.type!=="boardgroup"?null:_.data.group}),me=ie(()=>{const _=oe.value;if(!_||!_.boards.length)return null;const C=i.value[_.id]??_.boards[0].id;return _.boards.find(E=>E.id===C)??_.boards[0]});Fe(me,_=>{n.selectedBoardId=(_==null?void 0:_.id)??null});const be=Ee("detail");Fe([oe,be],()=>{if(be.value==="alarm"&&oe.value){const _=oe.value;n.inbound.alarm={source:`${_.name} · ${_.type}`,boardType:_.type,boardName:_.name,ts:Date.now()}}},{immediate:!0});const ue=Ee(null);function pe(_){var m;const C=jw(_.name);let E;if(C.length){E=C.map(V=>({key:V.name,label:V.name,typeLabel:V.typeLabel,chipType:V.type,bus:V.bus,sensorCount:V.sensorCount,eventCount:V.eventCount,kind:"chip"}));const M=Hr(_.name),q=M.cfgs.filter(V=>!V.dsChip).length,A=M.looseEvents.filter(V=>!V.dsChip).length;(q||A)&&E.push({key:"__firmware",label:"固件 / BIOS 推送",typeLabel:"固件通道（非物理芯片）",chipType:"firmware",sensorCount:q,eventCount:A,kind:"firmware"})}else{const M=new Set;E=[];for(const q of Gr(_.type,_.name).buses){for(const A of[...q.chips,...((m=q.mux)==null?void 0:m.chips)??[]])M.has(A.chipType)||(M.add(A.chipType),E.push({key:A.chipType,label:A.label,typeLabel:ci(A.chipType),chipType:A.chipType,bus:q.label,sensorCount:0,eventCount:0,kind:"chip"}));q.mux&&!M.has("Pca9545")&&(M.add("Pca9545"),E.push({key:"Pca9545",label:q.mux.label,typeLabel:ci("Pca9545"),chipType:"Pca9545",bus:q.label,sensorCount:0,eventCount:0,kind:"chip"}))}}return E.sort((M,q)=>q.sensorCount+q.eventCount-(M.sensorCount+M.eventCount))}const _e=ie(()=>oe.value?pe(oe.value):[]),ke={smc:"Smc",lm75:"Lm75",eeprom:"Eeprom",cpld:"Cpld",pca9545:"Pca9545",mux:"Pca9545"};function Ne(_,C){const E=p.value.find(A=>A.type==="boardgroup"&&A.id===_.id);E&&(a.value=E),fi(_.name);const m=pe(_),M=ke[C.chipType.toLowerCase()]||C.chipType,q=m.find(A=>A.chipType===M)||m.find(A=>A.label.toLowerCase()===C.label.toLowerCase())||null;mn(()=>{ue.value=q,be.value=q&&(q.sensorCount||q.eventCount)?"alarm":"detail"})}lt("onChipPick",Ne),Fe(oe,_=>{ue.value=null,_&&fi(_.name)},{immediate:!0});const De=Ee(!1),Se=ie(()=>p.value.filter(_=>_.type==="boardgroup").map(_=>{const C=_.data.group;return{name:C.name,type:C.type}}));function $(){De.value=!0,a.value=null}function B(){const _=oe.value,C=me.value;return{source:`${(_==null?void 0:_.name)??"未知"} · ${(_==null?void 0:_.type)??""}`.trim(),detail:C?`SN ${C.sn}`:void 0}}function g(){const _=oe.value;if(!_)return;const C=ll(_.type,_.name),E=r0(_.type,_.name),m=[B().detail,E?`Smc: ${E}`:null,C.label].filter(Boolean).join(" · ");t("smc",{source:B().source,detail:m,func:C.func})}function y(){const _=oe.value;_&&t("expr",{...B(),expression:ul(_.type,_.name)})}const w={BCU:"#22c55e",CLU:"#f59e0b",EXU:"#a855f7",IEU:"#06b6d4",SEU:"#ec4899",NICCard:"#3b82f6",Unknown:"#6b7280"};function F(_){var E;if(_.type==="bmc")return"#4f6ef7";const C=(E=_.data)==null?void 0:E.group;return w[(C==null?void 0:C.type)??"Unknown"]??"#6b7280"}return(_,C)=>{var E;return b(),T("div",qP,[O.value?(b(),T("aside",{key:0,class:"topo-palette closed",title:"展开硬件管理器",onClick:C[0]||(C[0]=m=>O.value=!1)},[...C[11]||(C[11]=[c("svg",{class:"rail-ic",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true"},[c("path",{d:"M6.4 3.5 5.3 4.6 8.7 8l-3.4 3.4 1.1 1.1L10.9 8 6.4 3.5z"})],-1)])])):(b(),T("aside",jP,[c("div",ZP,[C[14]||(C[14]=Pe(" 硬件管理器 ",-1)),c("div",JP,[c("button",{class:"ib",title:"重置布局",onClick:Y},[...C[12]||(C[12]=[Pl('<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-7058561a><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" data-v-7058561a></path><path d="M21 3v5h-5" data-v-7058561a></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" data-v-7058561a></path><path d="M8 16H3v5" data-v-7058561a></path></svg>',1)])]),c("button",{class:"ib",title:"折叠面板",onClick:C[1]||(C[1]=m=>O.value=!0)},[...C[13]||(C[13]=[c("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[c("path",{d:"M9.5 3.5 6 8l3.5 4.5"})],-1)])])])]),c("button",{class:"hw-sum-strip",title:"打开整机告警总览（跨板 + 机箱级）",onClick:$},[C[15]||(C[15]=c("span",{class:"hw-sum-label"},"整机总览",-1)),c("span",QP,R(Q.value.boards)+" 板",1),c("span",e$,R(Q.value.sensors)+" 传感器",1),c("span",{class:fe(["chk-chip",Q.value.events?"chk-warn":"chk-ok"])},R(Q.value.events)+" 事件",3),Q.value.chassis?(b(),T("span",n$,R(Q.value.chassis)+" 机箱级",1)):Ce("",!0)]),c("div",t$,[C[16]||(C[16]=c("svg",{class:"hw-search-ic",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[c("circle",{cx:"11",cy:"11",r:"8"}),c("path",{d:"m21 21-4.35-4.35"})],-1)),He(c("input",{class:"hw-search-input","onUpdate:modelValue":C[2]||(C[2]=m=>D.value=m),placeholder:"搜索板卡名称…"},null,512),[[an,D.value]])]),c("div",r$,[(b(),T("svg",o$,[...C[17]||(C[17]=[c("path",{d:"m9 18 6-6-6-6"},null,-1)])])),C[19]||(C[19]=Pe(" 板卡分类 ",-1)),c("div",{class:"sec-acts"},[c("button",{class:"ib",title:"全部重置为首张",onClick:se},[...C[18]||(C[18]=[c("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[c("path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}),c("path",{d:"M21 3v5h-5"})],-1)])])])]),c("div",s$,[(b(!0),T(de,null,Me(ne.value,m=>(b(),T(de,{key:m.type},[c("button",{class:"hw-cat-row",onClick:M=>ae(m.type)},[c("span",{class:fe(["hw-caret",{open:N.value[m.type]}])},[...C[20]||(C[20]=[c("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round","stroke-linejoin":"round"},[c("path",{d:"m9 18 6-6-6-6"})],-1)])],2),C[21]||(C[21]=c("svg",{class:"hw-cat-ic",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[c("path",{d:"M2 5.5A1.5 1.5 0 0 1 3.5 4h4.4c.4 0 .78.16 1.06.44L10.4 6H16.5A1.5 1.5 0 0 1 18 7.5v8A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10z"})],-1)),c("span",a$,R(m.label),1),c("span",l$,R(m.boardCount||m.groups.length),1)],8,i$),N.value[m.type]?(b(),T("div",u$,[(b(!0),T(de,null,Me(m.groups,M=>{var q;return b(),T(de,{key:M.id},[c("div",{class:fe(["hw-grp-row",{"is-active":((q=a.value)==null?void 0:q.id)===M.id}]),title:M.connectorRef?"来源 Connector："+M.connectorRef.parentGroupId+" / "+M.connectorRef.connectorName:M.label,onClick:A=>X(M)},[M.boards.length?(b(),T("span",{key:0,class:fe(["hw-caret",{open:U.value[M.id]}])},[...C[22]||(C[22]=[c("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round","stroke-linejoin":"round"},[c("path",{d:"m9 18 6-6-6-6"})],-1)])],2)):(b(),T("span",d$)),c("span",{class:"hw-state-dot",style:Ve({background:le(As)[M.state]}),title:le(ho)[M.state]},null,12,f$),c("span",p$,R(M.name),1),M.state==="unclassified"?(b(),T("button",{key:2,class:"unc-assign-btn",disabled:v.value.length===0,onClick:en(A=>K(M.id),["stop"])},"指派",8,h$)):Ce("",!0)],10,c$),U.value[M.id]&&M.boards.length?(b(),T("div",m$,[(b(!0),T(de,null,Me(M.boards,A=>{var V;return b(),T("button",{key:A.id,class:fe(["hw-file-row",{"is-current":(i.value[M.id]??((V=M.boards[0])==null?void 0:V.id))===A.id}]),title:"SN "+A.sn+`
`+A.files.join(`
`),onClick:en(H=>Z(M,A),["stop"])},[C[23]||(C[23]=c("svg",{class:"hw-file-ic",viewBox:"0 0 24 24"},[c("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),c("path",{d:"M14 2v6h6"})],-1)),c("span",_$,R(k(A)),1)],10,v$)}),128))])):Ce("",!0),d.value===M.id?(b(),T("div",g$,[v.value.length===0?(b(),T("div",y$,"暂无空槽位可指派")):Ce("",!0),(b(!0),T(de,null,Me(v.value,A=>(b(),T("button",{key:A.id,class:"unc-slot",onClick:en(V=>S(M.id,A.id),["stop"])},[c("span",S$,R(A.type),1),c("span",b$,R(A.name),1),c("span",{class:"unc-slot-state",style:Ve({color:le(As)[A.state]})},R(le(ho)[A.state]),5)],8,C$))),128))])):Ce("",!0)],64)}),128))])):Ce("",!0)],64))),128))])])),c("div",E$,[c("button",{class:"chassis-entry",onClick:en($,["stop"]),title:"整机告警总览（跨板 + 机箱级）"},[...C[24]||(C[24]=[c("svg",{viewBox:"0 0 24 24","aria-hidden":"true"},[c("path",{d:"M4 4h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm2 3v2h2V7H6zm0 6h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zm2 3v2h2v-2H6z"})],-1),Pe(" 整机总览 ",-1)])]),Le(le(O2),{nodes:p.value,"onUpdate:nodes":C[3]||(C[3]=m=>p.value=m),edges:I.value,"onUpdate:edges":C[4]||(C[4]=m=>I.value=m),"node-types":r,"edge-types":o,"fit-view-on-init":!0,"default-viewport":{x:0,y:0,zoom:1},"min-zoom":.1,"max-zoom":2.5,"nodes-draggable":!0,"nodes-connectable":!1,"elements-selectable":!0,"pan-on-drag":!0,onNodeClick:z,onEdgeClick:L,onPaneClick:W},{default:Rn(()=>[Le(le(W2),{variant:le(tt).Lines,"pattern-color":"rgba(255,255,255,0.045)",gap:42,size:1},null,8,["variant"]),Le(le(bC),{"show-interactive":!1}),Le(le(oE),{"node-color":F,"mask-color":"rgba(8,8,18,0.65)",style:{background:"#141420",border:"1px solid #2e2e4e",borderRadius:"8px"}})]),_:1},8,["nodes","edges"]),c("div",w$,[C[25]||(C[25]=c("span",{class:"bus-legend-title"},"连线类型",-1)),(b(!0),T(de,null,Me(le(sE),m=>(b(),T("span",{key:m.type,class:"bus-legend-item"},[c("span",{class:"bus-legend-swatch",style:Ve({background:m.color})},null,4),Pe(" "+R(m.label),1)]))),128))])]),oe.value?(b(),T("div",{key:2,class:fe(["topo-property-panel",{wide:be.value==="alarm"}]),onClick:C[9]||(C[9]=en(()=>{},["stop"]))},[c("div",I$,[ue.value?(b(),T("button",{key:0,class:"pp-back",title:"返回板卡",onClick:C[5]||(C[5]=m=>ue.value=null)},"‹")):Ce("",!0),c("span",null,R(ue.value?ue.value.label:"板卡配置"),1),c("button",{class:"pp-close",onClick:C[6]||(C[6]=m=>a.value=null)},"✕")]),c("div",P$,[c("button",{class:fe(["pp-tab",{active:be.value==="detail"}]),onClick:C[7]||(C[7]=m=>be.value="detail")},"详情",2),c("button",{class:fe(["pp-tab",{active:be.value==="alarm"}]),onClick:C[8]||(C[8]=m=>be.value="alarm")},"告警 / 传感器",2)]),ue.value?(b(),T(de,{key:1},[be.value==="detail"?(b(),T("div",o4,[c("div",s4,[c("div",i4,[C[41]||(C[41]=c("div",{class:"pp-field-label"},"器件",-1)),c("div",a4,R(ue.value.label),1)]),c("div",l4,[C[42]||(C[42]=c("div",{class:"pp-field-label"},"类型",-1)),c("div",u4,R(ue.value.typeLabel),1)]),ue.value.bus?(b(),T("div",c4,[C[43]||(C[43]=c("div",{class:"pp-field-label"},"所在总线",-1)),c("div",d4,R(ue.value.bus),1)])):Ce("",!0),c("div",f4,[C[44]||(C[44]=c("div",{class:"pp-field-label"},"承载传感器",-1)),c("div",p4,R(ue.value.sensorCount)+" 个",1)]),c("div",h4,[C[45]||(C[45]=c("div",{class:"pp-field-label"},"独立事件",-1)),c("div",m4,[Pe(R(ue.value.eventCount)+" 条",1),ue.value.eventCount?(b(),T("span",v4," · 不经传感器，直连本器件数据源")):Ce("",!0)])]),c("div",_4,[C[46]||(C[46]=c("div",{class:"pp-field-label"},"所属板卡",-1)),c("div",g4,R(oe.value.name)+" · "+R(oe.value.type),1)])]),ue.value.kind==="chip"&&!ue.value.sensorCount&&!ue.value.eventCount?(b(),T("div",y4,[...C[47]||(C[47]=[c("div",{class:"pp-field-value",style:{"font-size":"11px","line-height":"1.5",background:"transparent",padding:"0"}}," 该器件仅参与 I2C 拓扑与在位识别（EEPROM 信息 / CPLD 逻辑 / PCA9545 扩展等），未承载遥测传感器或独立事件（无 Scanner 数据源），因此没有告警链路。 ",-1)])])):Ce("",!0),c("div",{class:"pp-wake"},[C[50]||(C[50]=c("div",{class:"pp-wake-title"},"配置项辅助",-1)),c("button",{class:"wake-btn",onClick:g},[...C[48]||(C[48]=[c("span",{class:"wake-ic-wrap","aria-hidden":"true"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"})])],-1),Pe(" 在 SMC 偏移量计算器中解析 ",-1)])]),c("button",{class:"wake-btn",onClick:y},[...C[49]||(C[49]=[c("span",{class:"wake-ic-wrap","aria-hidden":"true"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"})])],-1),Pe(" 在表达式计算器中调试 sensor ",-1)])])])])):(b(),T("div",C4,[Le(al,{"scope-chip-key":ue.value.key},null,8,["scope-chip-key"])]))],64)):(b(),T(de,{key:0},[be.value==="detail"?(b(),T(de,{key:0},[c("div",{class:"pp-wake"},[C[28]||(C[28]=c("div",{class:"pp-wake-title"},"配置项辅助",-1)),c("button",{class:"wake-btn",onClick:g},[...C[26]||(C[26]=[c("span",{class:"wake-ic-wrap","aria-hidden":"true"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"})])],-1),Pe(" 在 SMC 偏移量计算器中解析 ",-1)])]),c("button",{class:"wake-btn",onClick:y},[...C[27]||(C[27]=[c("span",{class:"wake-ic-wrap","aria-hidden":"true"},[c("svg",{viewBox:"0 0 24 24"},[c("path",{d:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"})])],-1),Pe(" 在表达式计算器中调试 sensor ",-1)])])]),c("div",$$,[c("div",x$,[C[30]||(C[30]=c("div",{class:"pp-card-cap"},"本板器件 · 点芯片进入其配置",-1)),(b(!0),T(de,null,Me(_e.value,m=>(b(),T("button",{key:m.key,class:"dev-item",onClick:M=>ue.value=m},[c("span",M$,[c("span",k$,R(m.typeLabel),1),c("span",T$,R(m.label),1)]),m.sensorCount?(b(),T("span",V$,R(m.sensorCount)+" 传感器",1)):Ce("",!0),m.eventCount?(b(),T("span",N$,R(m.eventCount)+" 事件",1)):Ce("",!0),C[29]||(C[29]=c("span",{class:"di-arrow"},"›",-1))],8,D$))),128)),_e.value.length?Ce("",!0):(b(),T("div",A$,"该板 .sr 明细未载入，暂无器件"))]),c("div",F$,[c("div",O$,[C[31]||(C[31]=c("div",{class:"pp-field-label"},"类型",-1)),c("div",B$,R(oe.value.label),1)]),c("div",R$,[C[32]||(C[32]=c("div",{class:"pp-field-label"},"解析状态",-1)),c("div",{class:"pp-field-value",style:Ve({color:le(As)[oe.value.state]})},R(le(ho)[oe.value.state]),5)]),oe.value.connectorRef?(b(),T("div",L$,[C[33]||(C[33]=c("div",{class:"pp-field-label"},"来源 Connector",-1)),c("div",U$,R(oe.value.connectorRef.parentGroupId)+" / "+R(oe.value.connectorRef.connectorName),1)])):Ce("",!0),((E=oe.value.connectorRef)==null?void 0:E.identifyMode)!==void 0?(b(),T("div",H$,[C[34]||(C[34]=c("div",{class:"pp-field-label"},"IdentifyMode",-1)),c("div",z$,R(oe.value.connectorRef.identifyMode),1)])):Ce("",!0),oe.value.missingFile?(b(),T("div",K$,[C[35]||(C[35]=c("div",{class:"pp-field-label"},"缺失文件",-1)),c("div",W$,R(oe.value.missingFile),1)])):Ce("",!0)]),c("div",G$,[me.value?(b(),T(de,{key:0},[c("div",X$,[C[36]||(C[36]=c("div",{class:"pp-field-label"},"同类板数量",-1)),c("div",Y$,R(oe.value.boards.length),1)]),c("div",q$,[C[37]||(C[37]=c("div",{class:"pp-field-label"},"当前 SN",-1)),c("div",j$,R(me.value.sn),1)]),c("div",Z$,[C[38]||(C[38]=c("div",{class:"pp-field-label"},"Part Number",-1)),c("div",J$,R(me.value.partNumber),1)]),c("div",Q$,[C[39]||(C[39]=c("div",{class:"pp-field-label"},"源文件",-1)),c("div",e4,[(b(!0),T(de,null,Me(me.value.files,m=>(b(),T("div",{key:m},R(m),1))),128))])])],64)):(b(),T("div",n4,[C[40]||(C[40]=c("div",{class:"pp-field-label"},"状态说明",-1)),c("div",t4," 该板卡处于「"+R(le(ho)[oe.value.state])+"」态，尚未选择具体板卡实例。 请在卡片头部下拉中完成选择。 ",1)]))])])],64)):(b(),T("div",r4,[Le(al)]))],64))],2)):Ce("",!0),De.value?(b(),Xe(zP,{key:3,boards:Se.value,onClose:C[10]||(C[10]=m=>De.value=!1)},null,8,["boards"])):Ce("",!0)])}}}),b4=Xn(S4,[["__scopeId","data-v-7058561a"]]),E4={class:"code-root"},w4={class:"code-head"},I4={class:"code-file"},P4={key:0,class:"code-empty"},$4={key:1,class:"code-body"},x4={class:"ln-c"},D4={class:"k"},M4={class:"s"},k4={class:"s"},T4={class:"s"},V4={class:"s"},N4={class:"v"},A4={class:"tag tag-smc"},F4={class:"v"},O4={class:"n"},B4={class:"n"},R4=Be({__name:"CodeView",setup(e){const{state:n,setAnchor:t,invoke:r}=zi(),o=ie(()=>Yl.find(h=>h.id===n.selectedBoardId)??null),s=ie(()=>o.value?Gr(o.value.type,o.value.name).buses.map(h=>h.id):[]),i=ie(()=>o.value?Zc(o.value):{fans:[],tempZones:[]}),a=ie(()=>o.value?ll(o.value.type,o.value.name):null);function l(h){var p;return((p=n.lastWriteback)==null?void 0:p.tool)===h?n.lastWriteback.code:null}function u(){const h=o.value;if(!h)return;const p=ll(h.type,h.name),I=r0(h.type,h.name);r("smc",{source:`${h.name} · ${h.type}`,detail:[`SN ${h.sn}`,I?`Smc: ${I}`:null,p.label].filter(Boolean).join(" · "),func:p.func})}function d(){const h=o.value;h&&r("expr",{source:`${h.name} · ${h.type}`,detail:`SN ${h.sn}`,expression:ul(h.type,h.name)})}function f(){const h=o.value;if(!h)return;const p=Zc(h);r("cooling",{source:`${h.name} · ${h.type}`,detail:`SN ${h.sn}`,fans:p.fans,tempZones:p.tempZones})}return(h,p)=>{var I;return b(),T("div",E4,[c("div",w4,[c("span",I4,R(o.value?o.value.partNumber+"_"+o.value.sn+".sr":"root.sr"),1),p[1]||(p[1]=c("span",{class:"code-sub"},"CSR · ManagementTopology / Objects",-1)),c("button",{class:"code-topo-btn",onClick:p[0]||(p[0]=P=>le(t)("topology"))},"在拓扑中查看 →")]),o.value?(b(),T("pre",$4,[c("span",x4,"// CSR Objects · "+R(o.value.name)+" ("+R(o.value.type)+")",1),p[14]||(p[14]=Pe(`
`,-1)),c("span",D4,"Connector_"+R(o.value.name),1),p[15]||(p[15]=Pe(`: {
  `,-1)),p[16]||(p[16]=c("span",{class:"k"},"Bom",-1)),p[17]||(p[17]=Pe(":          ",-1)),c("span",M4,'"'+R(o.value.partNumber)+'"',1),p[18]||(p[18]=Pe(`,
  `,-1)),p[19]||(p[19]=c("span",{class:"k"},"Id",-1)),p[20]||(p[20]=Pe(":           ",-1)),c("span",k4,'"'+R(o.value.sn)+'"',1),p[21]||(p[21]=Pe(`,
  `,-1)),p[22]||(p[22]=c("span",{class:"k"},"Type",-1)),p[23]||(p[23]=Pe(":         ",-1)),c("span",T4,'"'+R(o.value.type)+'"',1),p[24]||(p[24]=Pe(`,
  `,-1)),p[25]||(p[25]=c("span",{class:"k"},"Buses",-1)),p[26]||(p[26]=Pe(":        [",-1)),c("span",V4,R(s.value.join(", ")),1),p[27]||(p[27]=Pe(`],
  `,-1)),p[28]||(p[28]=c("span",{class:"k"},"IdentifyMode",-1)),p[29]||(p[29]=Pe(": ",-1)),p[30]||(p[30]=c("span",{class:"n"},"2",-1)),p[31]||(p[31]=Pe(`,
`,-1)),p[32]||(p[32]=c("span",{class:"ln-c"},"  // ── 可联动字段(点击在右侧打开对应工具)──",-1)),p[33]||(p[33]=Pe(`
`,-1)),c("span",{class:fe(["field",{active:le(n).dockTool==="smc"}]),onClick:u},[p[2]||(p[2]=c("span",{class:"k"},"  Smc.Offset",-1)),p[3]||(p[3]=Pe(":   ",-1)),c("span",N4,R(l("smc")||"0x________"),1),p[4]||(p[4]=Pe()),c("span",A4,"SMC · func "+R((I=a.value)==null?void 0:I.func)+" ↗",1)],2),p[34]||(p[34]=Pe(`
`,-1)),c("span",{class:fe(["field",{active:le(n).dockTool==="expr"}]),onClick:d},[p[5]||(p[5]=c("span",{class:"k"},"  Sensor.Expression",-1)),p[6]||(p[6]=Pe(": ",-1)),c("span",F4,'"'+R(l("expr")||le(ul)(o.value.type,o.value.name))+'"',1),p[7]||(p[7]=Pe()),p[8]||(p[8]=c("span",{class:"tag tag-expr"},"表达式 ↗",-1))],2),p[35]||(p[35]=Pe(`
`,-1)),i.value.fans.length||i.value.tempZones.length?(b(),T("span",{key:0,class:fe(["field",{active:le(n).dockTool==="cooling"}]),onClick:f},[p[9]||(p[9]=c("span",{class:"k"},"  cooling_config",-1)),p[10]||(p[10]=Pe(": { fans: ",-1)),c("span",O4,R(i.value.fans.length),1),p[11]||(p[11]=Pe(", temp_zones: ",-1)),c("span",B4,R(i.value.tempZones.length),1),p[12]||(p[12]=Pe(" } ",-1)),p[13]||(p[13]=c("span",{class:"tag tag-cool"},"调速 ↗",-1))],2)):Ce("",!0),p[36]||(p[36]=Pe(`
}`,-1))])):(b(),T("div",P4," 在拓扑里选择一块板卡,这里显示它的 .sr / CSR 代码,字段可点击联动工具。 "))])}}}),L4=Xn(R4,[["__scopeId","data-v-5b404d30"]]),U4={class:"root"},H4={class:"offset-bar"},z4={class:"off-row"},K4={class:"hex-input-row"},W4=["value"],G4={class:"offset-actions"},X4=["disabled"],Y4=["disabled"],q4={class:"fp"},j4={class:"fp"},Z4={class:"fp"},J4={class:"fp"},Q4={class:"offset-err"},ex={class:"bitmap-card"},nx={class:"bit-grid-scroll"},tx={class:"bit-grid"},rx=["title"],ox=["title"],sx=["title"],ix=["title"],ax=["title"],lx=["title"],ux={class:"fields-card"},cx={class:"fields-row r1"},dx={class:"field-head"},fx={class:"field-label"},px={class:"field-input-wrap",title:"功能码：标识子系统（电源 / 风扇 / 温度…），可下拉选择已知代号或自由输入"},hx={class:"func-picker"},mx=["onClick"],vx={class:"fo-hex"},_x={class:"fo-label"},gx=["disabled"],yx={class:"field-foot"},Cx={class:"pair"},Sx={class:"v"},bx={class:"v"},Ex={class:"field-head"},wx={class:"field-label"},Ix={class:"field-input-wrap",title:"命令码：在功能码下的具体操作编号"},Px=["disabled"],$x={class:"field-foot"},xx={class:"pair"},Dx={class:"v"},Mx={class:"v"},kx={class:"fields-row r2"},Tx={class:"field-head"},Vx={class:"field-label"},Nx={class:"code-anno"},Ax={class:"field-meta"},Fx=["title"],Ox={key:0,class:"smc-pillset"},Bx=["onClick"],Rx=["onClick"],Lx=["onUpdate:modelValue","onInput","onBlur"],Ux=["disabled","onClick"],Hx={class:"field-foot"},zx={class:"pair"},Kx={class:"v"},Wx={class:"v"},Gx={class:"history-card"},Xx={class:"history-list"},Yx={key:0,class:"history-empty",style:{"grid-column":"1/-1"}},qx=["onClick"],jx={class:"idx"},Zx={class:"hval"},Jx={class:"hts"},Qx={name:"SmcOffsetView"},eD=Be({...Qx,setup(e){const n={func:{hi:31,lo:26,width:6,hexDigits:2,shortLabel:"Function"},cmd:{hi:25,lo:10,width:16,hexDigits:4,shortLabel:"Command"},ms:{hi:9,lo:9,width:1,hexDigits:1,shortLabel:"MS"},rw:{hi:8,lo:8,width:1,hexDigits:1,shortLabel:"RW"},param:{hi:7,lo:0,width:8,hexDigits:2,shortLabel:"Param"}},t=["func","cmd","ms","rw","param"],r={1:"系统管理 System",2:"电源管理 Power",3:"风扇控制 Fan",12:"温度管理 Thermal",16:"存储 Storage",32:"网络 Network"},o={0:"多读 Multi-read",1:"单读 Single-read"},s={0:"写 Write",1:"读 Read"},i=Object.entries(r).map(([E,m])=>({hex:"0x"+Number(E).toString(16).toUpperCase().padStart(2,"0"),label:m})),a={func:"功能码 Function · [31:26] · 6 bit",cmd:"命令码 Command · [25:10] · 16 bit",ms:"读取方式 MS · [9] · 1 bit",rw:"读写方向 RW · [8] · 1 bit",param:"参数 Param · [7:0] · 8 bit"},l={func:"#f59e6b",cmd:"#4f6ef7",ms:"#a78bfa",rw:"#34d399",param:"#f5b454"},u=ot({func:null,cmd:null,ms:null,rw:null,param:null}),d=ot({func:"",cmd:"",ms:"",rw:"",param:""}),f=ot({func:"",cmd:"",ms:"",rw:"",param:""}),h=Ee(""),p=Ee(""),I=Ee(""),P=Ee(""),x=Ee("hex"),N=Ee(!1),U=Ee(!1),D=Ee(null),O=Ee(!1),Q=Ee("");let ee;const ne=Ee([]),ae="ubmc.smc.history.v2";function re(E,m){return E.length>=m?E:"0".repeat(m-E.length)+E}function X(){let E=0;for(const m of t){const M=u[m];M!==null&&(E=(E|M<<n[m].lo>>>0)>>>0)}return E>>>0}function Z(E){const m={};for(const M of t){const q=(1<<n[M].width)-1;m[M]=E>>>n[M].lo&q}return m}function k(){return t.some(E=>u[E]!==null)}function G(E){return"0x"+re(E.toString(16).toUpperCase(),8)}function v(E,m,M=!1){const q=E.trim();if(!q)return{ok:!0,value:null};let A;if(M){const H=q.replace(/^0x/i,"");if(!/^[0-9a-f]+$/i.test(H))return{ok:!1,value:null,err:"请输入十六进制数字"};A=parseInt(H,16)}else if(/^0x/i.test(q)){if(!/^0x[0-9a-f]+$/i.test(q))return{ok:!1,value:null,err:"不是合法的十六进制"};A=parseInt(q.slice(2),16)}else if(/^[0-9a-f]+$/i.test(q)&&/[a-f]/i.test(q))A=parseInt(q,16);else if(/^-?[0-9]+$/.test(q))A=parseInt(q,10);else return{ok:!1,value:null,err:"只接受 dec 或 0x hex"};if(!Number.isFinite(A)||A<0)return{ok:!1,value:null,err:"非法数字"};const V=m===32?4294967295:(1<<m)-1;return A>V?{ok:!1,value:null,err:`超出 ${m}-bit 范围`}:{ok:!0,value:A>>>0}}function K(E,m){m!=="hex"&&(h.value=G(E)),m!=="dec"&&(p.value=String(E)),I.value="",P.value="";const M=Z(E);t.forEach(q=>{u[q]=M[q],d[q]=re(M[q].toString(16).toUpperCase(),n[q].hexDigits),f[q]=""})}function S(E){const m=E==="hex"?h.value:p.value;if(I.value="",P.value="",!m.trim()){t.forEach(q=>{u[q]=null,d[q]="",f[q]=""}),E==="hex"?p.value="":h.value="";return}const M=v(m,32);if(!M.ok){E==="hex"?I.value=M.err||"":P.value=M.err||"";return}K(M.value,E)}function z(E){f[E]="";const m=v(d[E],n[E].width,!0);if(!m.ok){f[E]=m.err||"";return}if(u[E]=m.value,k()){const M=X();h.value=G(M),p.value=String(M),I.value="",P.value=""}}function L(E){const m=u[E];m!==null&&(d[E]=re(m.toString(16).toUpperCase(),n[E].hexDigits))}function W(E,m){d[E]=m,z(E)}const Y=ie(()=>{const E=X(),m=k();return Array.from({length:32},(M,q)=>{const A=31-q;let V;return A>=26?V="func":A>=10?V="cmd":A===9?V="ms":A===8?V="rw":V="param",{bitIdx:A,hue:V,on:m&&(E>>>A&1)===1,set:m,isBoundary:[5,21,22,23].includes(q),isPosBound:[31,26,25,10,9,8,7,0].includes(A)}})});function se(E){const m=u[E];return m===null?"—":String(m)}function oe(E){const m=u[E];return m===null?"—":"0x"+re(m.toString(16).toUpperCase(),n[E].hexDigits)}function me(E){const m=u[E];return m===null?"":E==="func"?r[m]?"· "+r[m]:"":E==="ms"?"· "+(o[m]||""):E==="rw"?"· "+(s[m]||""):""}function be(E){const m=X(),M=G(m),q=String(m);switch(E){case"dec":return q;case"both":return`${M} (${q})`;case"c":return M+"u";case"json":{const A=Z(m);return JSON.stringify({offset:M,func:"0x"+re(A.func.toString(16).toUpperCase(),2),cmd:"0x"+re(A.cmd.toString(16).toUpperCase(),4),ms:A.ms,rw:A.rw,param:"0x"+re(A.param.toString(16).toUpperCase(),2)})}default:return M}}function ue(E){if(!k())return E==="hex"?"0x00000000":"—";const m=be(E);return m.length>28?m.slice(0,26)+"…":m}function pe(){var m;if(!k())return;const E=be(x.value);(m=navigator.clipboard)==null||m.writeText(E),w("已复制 "+(E.length>36?E.slice(0,34)+"…":E)),Se(),O.value=!0,setTimeout(()=>O.value=!1,1200)}function _e(E){x.value=E,N.value=!1,pe()}function ke(E){var q;const m=u[E];if(m===null)return;const M="0x"+re(m.toString(16).toUpperCase(),n[E].hexDigits);(q=navigator.clipboard)==null||q.writeText(M),w(`已复制 ${n[E].shortLabel}: ${M}`),D.value=E,setTimeout(()=>D.value=null,1200)}function Ne(){t.forEach(E=>{u[E]=null,d[E]="",f[E]=""}),h.value="",p.value="",I.value="",P.value=""}function De(){h.value="0x30004500",S("hex")}function Se(){var m;if(!k())return;const E={word:X(),parts:Object.fromEntries(t.map(M=>[M,u[M]??0])),ts:Date.now()};if(((m=ne.value[0])==null?void 0:m.word)!==E.word){ne.value.unshift(E),ne.value.length>10&&(ne.value.length=10);try{localStorage.setItem(ae,JSON.stringify(ne.value))}catch{}}}function $(){try{const E=localStorage.getItem(ae);E&&(ne.value=JSON.parse(E)||[])}catch{}}function B(E){const m=ne.value[E];m&&(t.forEach(M=>{u[M]=m.parts[M]??0,d[M]=re((m.parts[M]??0).toString(16).toUpperCase(),n[M].hexDigits),f[M]=""}),h.value=G(m.word),p.value=String(m.word),I.value="",P.value="",w("已回填 "+G(m.word)))}function g(){ne.value=[];try{localStorage.removeItem(ae)}catch{}}function y(E){const m=new Date(E);return String(m.getHours()).padStart(2,"0")+":"+String(m.getMinutes()).padStart(2,"0")}function w(E){Q.value=E,clearTimeout(ee),ee=setTimeout(()=>Q.value="",1600)}function F(E){(E.ctrlKey||E.metaKey)&&E.key.toLowerCase()==="s"&&(E.preventDefault(),Se(),w("已保存当前结果"))}function _(E){var M,q;const m=E.target;(M=m.closest)!=null&&M.call(m,".split-btn")||(N.value=!1),(q=m.closest)!=null&&q.call(m,".func-picker")||(U.value=!1)}function C(E){d.func=E.replace(/^0x/i,"").toUpperCase().padStart(n.func.hexDigits,"0"),z("func"),U.value=!1}return Mn(()=>{$(),window.addEventListener("keydown",F),document.addEventListener("click",_)}),Ii(()=>{window.removeEventListener("keydown",F),document.removeEventListener("click",_),clearTimeout(ee)}),(E,m)=>(b(),T("div",U4,[c("div",{class:"page-head"},[m[19]||(m[19]=Pl('<div class="page-head-info" data-v-25909301><div class="page-head-line" data-v-25909301><h1 class="page-title" data-v-25909301>SMC 偏移量计算器</h1><span class="page-badge" data-v-25909301>32-bit · 双向</span></div><div class="page-sub" data-v-25909301>一句话:把 SMC 寄存器访问的 32 位偏移量,在「整字 ⇄ 功能码 / 命令码 / MS / RW / 参数」之间双向实时编解码,十进制与十六进制随时互转。</div></div>',1)),c("div",{class:"head-actions"},[c("button",{class:"btn btn-ghost",onClick:Ne},"重置"),c("button",{class:"btn btn-secondary",onClick:De},"示例")])]),c("div",H4,[m[28]||(m[28]=c("div",{class:"section-h"},[c("span",{class:"sec-title"},"偏移量 · 32-bit Offset"),c("span",{class:"sec-hint"},"输入十六进制或十进制，两边自动联动；下方字段同时刷新")],-1)),c("div",z4,[c("div",{class:fe(["offset-input-wrap",{invalid:I.value,synced:k()&&!I.value}])},[m[21]||(m[21]=c("div",{class:"oiw-tag"},[c("span",null,"HEX"),c("span",{class:"sync"},"●")],-1)),c("div",K4,[m[20]||(m[20]=c("span",{class:"oiw-pfx"},"0x",-1)),c("input",{value:h.value.replace(/^0x/i,""),onInput:m[0]||(m[0]=M=>{h.value="0x"+M.target.value,S("hex")}),placeholder:"00000000",autocomplete:"off",spellcheck:"false"},null,40,W4)])],2),c("div",{class:fe(["offset-input-wrap",{invalid:P.value,synced:k()&&!P.value}])},[m[22]||(m[22]=c("div",{class:"oiw-tag"},[c("span",null,"DEC · 0 – 4 294 967 295"),c("span",{class:"sync"},"●")],-1)),He(c("input",{"onUpdate:modelValue":m[1]||(m[1]=M=>p.value=M),onInput:m[2]||(m[2]=M=>S("dec")),placeholder:"0",autocomplete:"off",spellcheck:"false",inputmode:"numeric"},null,544),[[an,p.value]])],2),c("div",G4,[c("div",{class:"split-btn",onClick:m[9]||(m[9]=en(()=>{},["stop"]))},[c("button",{class:"btn btn-primary btn-copy",disabled:!k(),onClick:pe},R(O.value?"已复制 ✓":"复制偏移量"),9,X4),c("button",{class:"btn btn-primary btn-fmt-arr",disabled:!k(),onClick:m[3]||(m[3]=M=>N.value=!N.value)},"▾",8,Y4),c("div",{class:fe(["fmt-menu",{open:N.value}])},[c("div",{class:fe(["fmt-item",{active:x.value==="hex"}]),onClick:m[4]||(m[4]=M=>_e("hex"))},[m[23]||(m[23]=c("span",null,"仅 HEX",-1)),c("span",q4,R(ue("hex")),1)],2),c("div",{class:fe(["fmt-item",{active:x.value==="dec"}]),onClick:m[5]||(m[5]=M=>_e("dec"))},[m[24]||(m[24]=c("span",null,"仅 DEC",-1)),c("span",j4,R(ue("dec")),1)],2),c("div",{class:fe(["fmt-item",{active:x.value==="both"}]),onClick:m[6]||(m[6]=M=>_e("both"))},[m[25]||(m[25]=c("span",null,"HEX + DEC",-1)),c("span",Z4,R(ue("both")),1)],2),c("div",{class:fe(["fmt-item",{active:x.value==="c"}]),onClick:m[7]||(m[7]=M=>_e("c"))},[m[26]||(m[26]=c("span",null,"C 字面量",-1)),c("span",J4,R(ue("c")),1)],2),c("div",{class:fe(["fmt-item",{active:x.value==="json"}]),onClick:m[8]||(m[8]=M=>_e("json"))},[...m[27]||(m[27]=[c("span",null,"JSON 字段",-1),c("span",{class:"fp fp-sm"},'{ "func": …}',-1)])],2)],2)])])]),c("div",Q4,R(I.value||P.value),1)]),c("div",ex,[m[32]||(m[32]=c("div",{class:"section-h"},[c("span",{class:"sec-title"},"32-bit 位图"),c("span",{class:"sec-hint"},"MSB → LSB · 每格 1 bit · 悬停色块或某一位查看字段含义")],-1)),c("div",nx,[c("div",tx,[c("div",{class:"field-band hue-func",style:{"grid-column":"1/7"},title:a.func},[...m[29]||(m[29]=[Pe("Function",-1),c("span",{class:"seg-info"},"[31:26]",-1)])],8,rx),c("div",{class:"field-band hue-cmd",style:{"grid-column":"7/23"},title:a.cmd},[...m[30]||(m[30]=[Pe("Command",-1),c("span",{class:"seg-info"},"[25:10]",-1)])],8,ox),c("div",{class:"field-band hue-ms",style:{"grid-column":"23/24"},title:a.ms},"MS",8,sx),c("div",{class:"field-band hue-rw",style:{"grid-column":"24/25"},title:a.rw},"RW",8,ix),c("div",{class:"field-band hue-param",style:{"grid-column":"25/33"},title:a.param},[...m[31]||(m[31]=[Pe("Param",-1),c("span",{class:"seg-info"},"[7:0]",-1)])],8,ax),(b(!0),T(de,null,Me(Y.value,M=>(b(),T("div",{key:M.bitIdx,class:fe(["bit-cell",[`hue-${M.hue}`,{on:M.on,boundary:M.isBoundary}]]),title:`${a[M.hue]} · 第 ${M.bitIdx} 位`},R(M.set&&M.on?"1":"0"),11,lx))),128)),(b(!0),T(de,null,Me(Y.value,M=>(b(),T("div",{key:"p"+M.bitIdx,class:fe(["bit-pos",{boundary:M.isPosBound}])},R(M.isPosBound?M.bitIdx:""),3))),128))])])]),c("div",ux,[m[52]||(m[52]=c("div",{class:"section-h"},[c("span",{class:"sec-title"},"字段拆解 · 双向编辑"),c("span",{class:"sec-hint"},"输入 0x 开头即十六进制，否则按十进制解析")],-1)),c("div",cx,[c("div",{class:"field-card",style:Ve({borderTopColor:l.func})},[c("div",dx,[c("span",fx,[c("span",{class:"swatch",style:Ve({background:l.func})},null,4),m[33]||(m[33]=Pe("功能码 · ",-1)),m[34]||(m[34]=c("i",{class:"code-anno"},"Function",-1))]),m[35]||(m[35]=c("span",{class:"field-meta"},"[31:26] · 6b",-1))]),c("div",px,[c("div",hx,[c("div",{class:fe(["hex-pfx-wrap",{invalid:f.func}])},[m[36]||(m[36]=c("span",{class:"hex-pfx"},"0x",-1)),He(c("input",{class:"field-input","onUpdate:modelValue":m[10]||(m[10]=M=>d.func=M),onInput:m[11]||(m[11]=M=>z("func")),onBlur:m[12]||(m[12]=M=>L("func")),placeholder:"00",autocomplete:"off",spellcheck:"false"},null,544),[[an,d.func]]),c("button",{type:"button",class:fe(["func-caret",{open:U.value}]),title:"已知功能码",onClick:m[13]||(m[13]=en(M=>U.value=!U.value,["stop"]))},"▾",2)],2),c("div",{class:fe(["func-menu",{open:U.value}])},[m[37]||(m[37]=c("div",{class:"func-menu-h"},"已知功能码",-1)),(b(!0),T(de,null,Me(le(i),M=>(b(),T("div",{class:fe(["func-opt",{active:d.func.toUpperCase()===M.hex.replace(/^0x/i,"").toUpperCase()}]),key:M.hex,onClick:q=>C(M.hex)},[c("span",vx,R(M.hex),1),c("span",_x,R(M.label),1)],10,mx))),128)),m[38]||(m[38]=c("div",{class:"func-menu-note"},"其他值直接在左侧输入(00 – 3F)",-1))],2)]),c("button",{class:fe(["field-copy",{copied:D.value==="func"}]),disabled:u.func===null,onClick:m[14]||(m[14]=M=>ke("func"))},"⧉",10,gx)]),c("div",yx,[c("span",Cx,[c("span",{class:fe({muted:u.func===null})},[m[39]||(m[39]=c("span",{class:"k"},"DEC ",-1)),c("span",Sx,R(se("func")),1)],2),c("span",{class:fe({muted:u.func===null})},[m[40]||(m[40]=c("span",{class:"k"},"HEX ",-1)),c("span",bx,R(oe("func")),1)],2)]),c("span",{class:fe(["semantic",{ferr:f.func}])},R(f.func||me("func")),3)])],4),c("div",{class:"field-card",style:Ve({borderTopColor:l.cmd})},[c("div",Ex,[c("span",wx,[c("span",{class:"swatch",style:Ve({background:l.cmd})},null,4),m[41]||(m[41]=Pe("命令码 · ",-1)),m[42]||(m[42]=c("i",{class:"code-anno"},"Command",-1))]),m[43]||(m[43]=c("span",{class:"field-meta"},"[25:10] · 16b · 0–0xFFFF",-1))]),c("div",Ix,[c("div",{class:fe(["hex-pfx-wrap",{invalid:f.cmd}])},[m[44]||(m[44]=c("span",{class:"hex-pfx"},"0x",-1)),He(c("input",{class:"field-input","onUpdate:modelValue":m[15]||(m[15]=M=>d.cmd=M),onInput:m[16]||(m[16]=M=>z("cmd")),onBlur:m[17]||(m[17]=M=>L("cmd")),placeholder:"0000",autocomplete:"off",spellcheck:"false"},null,544),[[an,d.cmd]])],2),c("button",{class:fe(["field-copy",{copied:D.value==="cmd"}]),disabled:u.cmd===null,onClick:m[18]||(m[18]=M=>ke("cmd"))},"⧉",10,Px)]),c("div",$x,[c("span",xx,[c("span",{class:fe({muted:u.cmd===null})},[m[45]||(m[45]=c("span",{class:"k"},"DEC ",-1)),c("span",Dx,R(se("cmd")),1)],2),c("span",{class:fe({muted:u.cmd===null})},[m[46]||(m[46]=c("span",{class:"k"},"HEX ",-1)),c("span",Mx,R(oe("cmd")),1)],2)]),c("span",{class:fe(["semantic",{ferr:f.cmd}])},R(f.cmd),3)])],4)]),c("div",kx,[(b(),T(de,null,Me(["ms","rw","param"],M=>c("div",{key:M,class:"field-card",style:Ve({borderTopColor:l[M]})},[c("div",Tx,[c("span",Vx,[c("span",{class:"swatch",style:Ve({background:l[M]})},null,4),Pe(" "+R(M==="ms"?"读取方式 · ":M==="rw"?"读写方向 · ":"参数 · "),1),c("i",Nx,R(M==="ms"?"MS":M==="rw"?"RW":"Param"),1)]),c("span",Ax,R(M==="ms"?"[9] · 1b":M==="rw"?"[8] · 1b":"[7:0] · 8b · 0–0xFF"),1)]),c("div",{class:"field-input-wrap",title:M==="ms"?"读取方式：多读=连续读取多个值，单读=单次读取":M==="rw"?"读写方向：0=写入，1=读取":"参数：命令附带的 8 位参数"},[M==="ms"||M==="rw"?(b(),T("div",Ox,[c("button",{type:"button",class:fe(["smc-pill p-write",{on:u[M]===0}]),onClick:q=>W(M,"0")},[m[47]||(m[47]=c("b",null,"0",-1)),Pe(" "+R(M==="ms"?"多读":"写"),1)],10,Bx),c("button",{type:"button",class:fe(["smc-pill p-read",{on:u[M]===1}]),onClick:q=>W(M,"1")},[m[48]||(m[48]=c("b",null,"1",-1)),Pe(" "+R(M==="ms"?"单读":"读"),1)],10,Rx)])):(b(),T("div",{key:1,class:fe(["hex-pfx-wrap",{invalid:f[M]}])},[m[49]||(m[49]=c("span",{class:"hex-pfx"},"0x",-1)),He(c("input",{class:"field-input","onUpdate:modelValue":q=>d[M]=q,onInput:q=>z(M),onBlur:q=>L(M),placeholder:"00",autocomplete:"off",spellcheck:"false"},null,40,Lx),[[an,d[M]]])],2)),c("button",{class:fe(["field-copy",{copied:D.value===M}]),disabled:u[M]===null,onClick:q=>ke(M)},"⧉",10,Ux)],8,Fx),c("div",Hx,[c("span",zx,[c("span",{class:fe({muted:u[M]===null})},[m[50]||(m[50]=c("span",{class:"k"},"DEC ",-1)),c("span",Kx,R(se(M)),1)],2),M==="param"?(b(),T("span",{key:0,class:fe({muted:u[M]===null})},[m[51]||(m[51]=c("span",{class:"k"},"HEX ",-1)),c("span",Wx,R(oe(M)),1)],2)):Ce("",!0)]),c("span",{class:fe(["semantic",{ferr:f[M]}])},R(f[M]||me(M)),3)])],4)),64))])]),c("div",Gx,[c("div",{class:"section-h",style:{margin:"0"}},[m[54]||(m[54]=c("span",{class:"sec-title"},"最近 10 次计算",-1)),c("span",{class:"hist-actions"},[m[53]||(m[53]=c("span",{class:"sec-hint"},"Ctrl+S 收集 · 点击回填",-1)),c("button",{class:"btn btn-ghost btn-xs",onClick:g},"清空")])]),c("ul",Xx,[ne.value.length?Ce("",!0):(b(),T("li",Yx,"尚无历史记录 · 复制即自动收藏")),(b(!0),T(de,null,Me(ne.value,(M,q)=>(b(),T("li",{key:q,class:"history-item",onClick:A=>B(q)},[c("span",jx,R(String(q+1).padStart(2," ")),1),c("span",Zx,R(G(M.word)),1),c("span",Jx,R(y(M.ts)),1)],8,qx))),128))])]),c("div",{class:fe(["toast",{show:Q.value}])},R(Q.value),3)]))}}),nD=Xn(eD,[["__scopeId","data-v-25909301"]]),tD={class:"phase"},rD={class:"phase-head"},oD={key:0,class:"phase-status"},sD={key:0,class:"hist-drop"},iD={key:0,class:"hist-empty"},aD=["onClick"],lD={class:"hist-expr"},uD={class:"hist-time"},cD={class:"expr-row"},dD={key:0,class:"qs-wrap"},fD={class:"qs-grid"},pD={class:"ops-panel"},hD={class:"op-cat-row","data-cat":"vars"},mD={class:"op-chips"},vD=["onClick"],_D={class:"chip-pop"},gD={class:"cp-sig"},yD={class:"cp-desc"},CD={class:"cp-ex"},SD=["data-cat"],bD={class:"op-chips"},ED=["data-cat","onClick"],wD={key:0,class:"op-arg"},ID={class:"chip-pop"},PD={class:"cp-sig"},$D={class:"cp-desc"},xD={class:"cp-ex"},DD={class:"phase-head"},MD={key:0,class:"no-vars-hint"},kD={key:1,class:"no-vars-hint"},TD={key:2,class:"inputs-list"},VD={class:"input-with-msg"},ND=["onUpdate:modelValue"],AD={key:0,class:"err-msg"},FD=["onUpdate:modelValue"],OD={class:"phase-head"},BD={key:0,class:"pipe-empty"},RD={key:1,class:"pipe-empty"},LD={class:"pipe-reason"},UD={class:"pipeline"},HD={class:"stage-body"},zD={class:"op-text"},KD={key:0,class:"var-ref"},WD={key:0,class:"arg-lit"},GD={class:"stage-desc"},XD={key:0,class:"val-type"},YD={key:0,class:"stage-connector"},qD={key:0,class:"final-result"},jD={class:"final-lab"},ZD={class:"final-val"},JD={class:"phase"},QD={class:"phase-head"},eM={class:"tc-context"},nM={class:"tc-toolbar"},tM={class:"seg"},rM={key:0,class:"tc-stats"},oM={class:"pct-bar"},sM={class:"pct-label"},iM={class:"csv-foot"},aM={key:0,class:"tc-empty"},lM={key:1,class:"tc-table-wrap"},uM={class:"tc-table"},cM={class:"num-cell"},dM=["onUpdate:modelValue"],fM=["onUpdate:modelValue"],pM={key:0,class:"diff-good"},hM={key:1,class:"diff-text"},mM={key:2,style:{color:"var(--text-dim)"}},vM={class:"status-cell"},_M={key:0,class:"pill"},gM={key:1,class:"pill pill-ok"},yM={key:2,class:"pill pill-err"},CM={class:"action-cell"},SM=["onClick"],bM={name:"ExprCalcView"},EM=Be({...bM,setup(e){const n={add:{cat:"arith",sig:"add N",desc:"加法 · a + b",example:"10 | add 5  →  15"},sub:{cat:"arith",sig:"sub N",desc:"减法 · a − b",example:"10 | sub 3  →  7"},mul:{cat:"arith",sig:"mul N",desc:"乘法 · a × b",example:"5 | mul 3   →  15"},div:{cat:"arith",sig:"div N",desc:"除法 · a ÷ b",example:"10 | div 4  →  2.5"},mod:{cat:"arith",sig:"mod N",desc:"取余 · a % b",example:"10 | mod 3  →  1"},and:{cat:"arith",sig:"and N",desc:"按位与 · a & b",example:"0xFF | and 0x0F  →  15"},or:{cat:"arith",sig:"or N",desc:"按位或 · a | b",example:"0xF0 | or 0x0F   →  255"},xor:{cat:"arith",sig:"xor N",desc:"按位异或 · a ^ b",example:"0xFF | xor 0x0F  →  240"},shl:{cat:"arith",sig:"shl N",desc:"左移 · a << b",example:"1 | shl 4   →  16"},shr:{cat:"arith",sig:"shr N",desc:"右移 · a >>> b",example:"256 | shr 4 →  16"},not:{cat:"arith",sig:"not",desc:"按位取反（32-bit）· ~a",example:"0 | not  →  4294967295"},toHex:{cat:"cast",sig:"toHex [W]",desc:"转十六进制（可补 W 位零）",example:'255 | toHex 4   →  "0x00ff"'},toBin:{cat:"cast",sig:"toBin [W]",desc:"转二进制字符串",example:'5 | toBin 8     →  "0b00000101"'},toOct:{cat:"cast",sig:"toOct",desc:"转八进制字符串",example:'8 | toOct       →  "0o10"'},toInt:{cat:"cast",sig:"toInt [R]",desc:"转整数（可指定基 R）",example:'"0xFF" | toInt  →  255'},"string.format":{cat:"string",sig:'string.format "F"',desc:"printf 风格格式化（%d %.Nf %s %x %X）",example:'41.875 | string.format "%.1f°C"  →  "41.9°C"'},"string.upper":{cat:"string",sig:"string.upper",desc:"转大写",example:'"hi" | string.upper  →  "HI"'},"string.lower":{cat:"string",sig:"string.lower",desc:"转小写",example:'"HI" | string.lower  →  "hi"'},"string.sub":{cat:"string",sig:"string.sub S [L]",desc:"子串（起 S 长 L，1-based）",example:'"abcdef" | string.sub 2 3  →  "bcd"'},"string.gsub":{cat:"string",sig:'string.gsub "F" "T"',desc:"全局替换 F → T",example:'"a-b-c" | string.gsub "-" "_"  →  "a_b_c"'},"string.cmp":{cat:"string",sig:'string.cmp "S"',desc:"字典序比较，返回 -1 / 0 / 1",example:'"abc" | string.cmp "abd"  →  -1'},expr:{cat:"custom",sig:"expr( <JS> )",desc:"内联 JS 表达式；x = 上一步结果，可引用 $N",example:"10 | expr(x*x + $1)  →  110 (if $1=10)"}},t=["arith","cast","string","custom"],r={arith:"算术",cast:"转换",string:"字符串",custom:"自定义"},o={arith:"#4f6ef7",cast:"#f5b454",string:"#34d399",custom:"#a78bfa",vars:"#4f6ef7"},s=Ee(""),i=Ee([]),a=Ee([]),l=Ee([]),u=Ee(null),d=Ee(!1),f=Ee("");let h;const p=Ee(null),I=Ee([]),P="expr-calc-history",x=Ee([]),N=Ee("table"),U=Ee(""),D=Ee(!1),O=ie(()=>{const A=(s.value.match(/\$([1-9]\d*)/g)||[]).map(V=>parseInt(V.slice(1)));return A.length?Math.max(...A):0});Fe(O,A=>{for(;i.value.length<A;)i.value.push("");for(;a.value.length<A;)a.value.push("")},{immediate:!0});const Q=ie(()=>s.value.trim()?Array.from({length:O.value},(A,V)=>V).filter(A=>!(i.value[A]||"").trim()):[]),ee=ie(()=>Q.value.length>0),ne=ie(()=>{const A=new Set,V=/\$(\d+)/g;let H;for(;(H=V.exec(s.value))!==null;)A.add("$"+H[1]);return[...A].sort((ce,ye)=>parseInt(ce.slice(1))-parseInt(ye.slice(1)))});function ae(A,V){var he;const H=p.value,ce=s.value;let ye;if(V==="vars")ye=ce.trim().length===0?A:` | ${A}`;else if(A==="expr")ye=ce.trim().length===0?"$1 | expr( )":" | expr( )";else{const we=(he=n[A])==null?void 0:he.sig.includes(" ");ye=ce.trim().length===0?`$1 | ${A}${we?" ":""}`:` | ${A}${we?" ":""}`}if(H){const we=H.selectionStart??ce.length;s.value=ce.slice(0,we)+ye+ce.slice(we),mn(()=>{const Re=we+ye.length;H.setSelectionRange(Re,Re),H.focus()})}else s.value=ce+ye;Y()}function re(A){const V=[];let H="",ce=!1,ye="";for(let he=0;he<A.length;he++){const we=A[he];ce?(H+=we,we===ye&&A[he-1]!=="\\"&&(ce=!1)):we==='"'||we==="'"?(ce=!0,ye=we,H+=we):we==="|"&&A[he-1]===" "&&A[he+1]===" "?(V.push(H.trimEnd()),H="",he++):H+=we}return H.trim()&&V.push(H.trim()),V}function X(A){const V=[];let H="",ce=!1,ye="";for(const he of A)ce?(H+=he,he===ye&&(ce=!1,V.push(H),H="")):he==='"'||he==="'"?(ce=!0,ye=he,H+=he):he===" "||he==="	"?H&&(V.push(H),H=""):H+=he;return H&&V.push(H),V}function Z(A){return A.startsWith('"')&&A.endsWith('"')||A.startsWith("'")&&A.endsWith("'")?A.slice(1,-1):A}function k(A){if(typeof A=="number")return A;if(typeof A=="boolean")return A?1:0;if(A===null)return 0;const V=String(A).trim();if(/^0[xX]/.test(V))return parseInt(V,16);if(/^0[bB]/.test(V))return parseInt(V.slice(2),2);if(/^0[oO]/.test(V))return parseInt(V.slice(2),8);const H=Number(V);return isNaN(H)?0:H}function G(A){const V=A.replace(/\band\b/g,"&&").replace(/\bor\b/g,"||").replace(/~=/g,"!==");try{return new Function(`"use strict"; return (${V});`)()}catch{throw new Error(`无法求值: ${A}`)}}function v(A,V,H){let ce=A.replace(/\$0\b/g,JSON.stringify(H));for(let ye=V.length;ye>=1;ye--){const he=V[ye-1],we=Number(he);ce=ce.replace(new RegExp(`\\$${ye}\\b`,"g"),isNaN(we)?JSON.stringify(he):he)}return ce}function K(A,V){let H=0;return A.replace(/%([0-9]*)([sdxXfob])/g,(ce,ye,he)=>{const we=V[H++],Re=k(we),ze=ye?parseInt(ye):0;let je="";switch(he){case"s":je=String(we??"");break;case"d":je=Math.trunc(Re).toString();break;case"f":je=Re.toFixed(6);break;case"x":je=(Re>>>0).toString(16);break;case"X":je=(Re>>>0).toString(16).toUpperCase();break;case"o":je=(Re>>>0).toString(8);break;case"b":je=(Re>>>0).toString(2);break}return ze?je.padStart(ze):je})}function S(A,V,H){const ce=X(A.trim());if(!ce.length)return H;const ye=ce[0],he=ce.slice(1);switch(ye){case"expr":{const we=he.join(" ");return G(v(we||String(H),V,H))}case"string.format":{const we=Z(he[0]??""),Re=he.slice(1).map(ze=>G(v(ze,V,H)));return K(we,[H,...Re])}case"string.upper":return String(H).toUpperCase();case"string.lower":return String(H).toLowerCase();case"string.sub":{const we=String(H),Re=Number(he[0]??1),ze=he[1]!=null?Number(he[1]):we.length;return we.slice(Re-1,ze)}case"string.gsub":{const we=String(H),Re=Z(he[0]??""),ze=Z(he[1]??"");return we.split(Re).join(ze)}case"string.cmp":{const we=v(Z(he[0]??""),V,H);return String(H)===we?0:String(H)<we?-1:1}case"toHex":{const we=k(H),Re=he[0]?Number(he[0]):0;return"0x"+(we>>>0).toString(16).padStart(Re,"0")}case"toBin":{const we=k(H),Re=he[0]?Number(he[0]):0;return"0b"+(we>>>0).toString(2).padStart(Re,"0")}case"toOct":return"0o"+(k(H)>>>0).toString(8);case"toInt":return k(H)|0;case"add":return k(H)+k(G(v(he.join(" "),V,H)));case"sub":return k(H)-k(G(v(he.join(" "),V,H)));case"mul":return k(H)*k(G(v(he.join(" "),V,H)));case"div":return k(H)/k(G(v(he.join(" "),V,H)));case"mod":return k(H)%k(G(v(he.join(" "),V,H)));case"and":return(k(H)&k(G(v(he.join(" "),V,H))))>>>0;case"or":return(k(H)|k(G(v(he.join(" "),V,H))))>>>0;case"xor":return(k(H)^k(G(v(he.join(" "),V,H))))>>>0;case"shl":return k(H)<<k(he[0]??"0")>>>0;case"shr":return k(H)>>>k(he[0]??"0");case"not":return~k(H)>>>0;default:return G(v(A.trim(),V,H))}}function z(A,V){const H=re(A);if(!H.length)return{stages:[],final:null,error:"表达式为空"};const ce=[];let ye=null,he="";try{ye=G(v(H[0],V,null)),ce.push({expr:H[0],output:ye})}catch(we){return he=String(we),ce.push({expr:H[0],output:null,error:he}),{stages:ce,final:null,error:he}}for(let we=1;we<H.length;we++)try{ye=S(H[we],V,ye),ce.push({expr:H[we],output:ye})}catch(Re){he=String(Re),ce.push({expr:H[we],output:null,error:he});break}return{stages:ce,final:ye,error:he}}function L(A){return A==null?"—":typeof A=="number"?Number.isInteger(A)?"int":"num":typeof A=="string"?/^0x/i.test(A)?"hex":"str":typeof A}function W(A){return A==null?"—":typeof A=="string"?A.length>60?A.slice(0,57)+"…":A:typeof A=="number"?Number.isInteger(A)?String(A):String(Math.round(A*1e6)/1e6):String(A)}function Y(){if(l.value=[],u.value=null,!s.value.trim()||ee.value)return;const A=i.value.slice(0,O.value),V=z(s.value.trim(),A);l.value=V.stages,u.value=V.error?null:V.final,V.error||oe(s.value.trim())}function se(){try{I.value=JSON.parse(localStorage.getItem(P)??"[]")}catch{I.value=[]}}function oe(A){se();const V=I.value.filter(H=>H.expr!==A);V.unshift({expr:A,timestamp:Date.now()}),I.value=V.slice(0,20),localStorage.setItem(P,JSON.stringify(I.value))}function me(A){s.value=A.expr,Y()}function be(A){const V=new Date(A);return`${String(V.getMonth()+1).padStart(2,"0")}-${String(V.getDate()).padStart(2,"0")} ${String(V.getHours()).padStart(2,"0")}:${String(V.getMinutes()).padStart(2,"0")}`}se();function ue(A){s.value=A,Y()}function pe(){s.value="",i.value=[],a.value=[],l.value=[],u.value=null,x.value=[],U.value="",D.value=!1}function _e(){pe(),s.value="$1 | add $2 | mul 2 | toHex 4",i.value=["100","28"],a.value=["温度基值","偏移量"],x.value=[{vals:["100","28"],expected:"0x00a0"},{vals:["200","56"],expected:"0x0200"},{vals:["0","0"],expected:"0x0000"}],Y()}const ke=ie(()=>{const A=re(s.value);return A.length?`${A.length} 阶段 · ${ne.value.length} 变量`:"空"}),Ne=ie(()=>{if(!s.value.trim()||!O.value)return"—";const A=Q.value.length;return A===0?`${O.value} 个变量 · 全部就绪`:`${O.value} 个变量 · ${A} 个未填`}),De=ie(()=>s.value.trim()?ee.value?`等待 ${Q.value.map(V=>"$"+(V+1)).join(" / ")}`:l.value.some(V=>V.error)?"✗ 失败":l.value.length?`✓ ${l.value.length} 阶段`:"—":"空"),Se=ie(()=>!!u.value),$=ie(()=>l.value.some(A=>A.error)),B=ie(()=>x.value.filter(A=>A._pass===!0).length),g=ie(()=>x.value.length),y=ie(()=>g.value?Math.round(B.value/g.value*100):0);function w(){const A=ne.value;x.value.forEach(V=>{if(!s.value.trim()||A.length===0){V._actual="—",V._pass=null;return}const H=A.map((ye,he)=>V.vals[he]??"");if(H.some(ye=>!ye)){V._actual="缺少输入",V._pass=null;return}const ce=z(s.value.trim(),H);V._actual=ce.error?"⚠ "+ce.error:String(ce.final),V._pass=!ce.error&&V._actual===V.expected}),D.value=!0}function F(){const A=ne.value;x.value.push({vals:A.map((V,H)=>i.value[H]||""),expected:"",_pass:null})}function _(A){x.value.splice(A,1)}function C(){const A=U.value.split(`
`).map(H=>H.trim()).filter(H=>H&&!H.startsWith("#"));if(!A.length)return;const V=ne.value;if(!V.length){M("请先填写表达式");return}A.forEach(H=>{const ce=H.split(/[\s,]+/).filter(Boolean),ye=ce.pop()??"";x.value.push({vals:V.map((he,we)=>ce[we]??""),expected:ye,_pass:null})}),N.value="table",M(`已导入 ${A.length} 个用例`)}function E(A,V){const H=A.split(""),ce=V.split(""),ye=H.length,he=ce.length,we=Array.from({length:ye+1},()=>new Array(he+1).fill(0));for(let nn=1;nn<=ye;nn++)for(let on=1;on<=he;on++)we[nn][on]=H[nn-1]===ce[on-1]?we[nn-1][on-1]+1:Math.max(we[nn-1][on],we[nn][on-1]);const Re=[],ze=[];let je=ye,_n=he;for(;je>0||_n>0;)je>0&&_n>0&&H[je-1]===ce[_n-1]?(Re.unshift({char:H[je-1],type:"match"}),ze.unshift({char:ce[_n-1],type:"match"}),je--,_n--):_n>0&&(je===0||we[je][_n-1]>=we[je-1][_n])?(Re.unshift({char:ce[_n-1],type:"extra"}),_n--):(ze.unshift({char:H[je-1],type:"missing"}),je--);return{a:Re,e:ze}}function m(){var A;u.value!==null&&((A=navigator.clipboard)==null||A.writeText(String(u.value)),d.value=!0,setTimeout(()=>d.value=!1,1500),M("已复制 "+String(u.value)))}function M(A){f.value=A,clearTimeout(h),h=setTimeout(()=>f.value="",1600)}const q=Ee(!1);return(A,V)=>(b(),T("div",{class:"root",onClick:V[13]||(V[13]=H=>q.value=!1)},[c("div",{class:"page-head"},[V[14]||(V[14]=Pl('<div class="page-head-info" data-v-65be6795><div class="page-head-line" data-v-65be6795><h1 class="page-title" data-v-65be6795>批量表达式计算器</h1><span class="page-badge" data-v-65be6795>管道 · 调试 · 验证</span></div><div class="page-sub" data-v-65be6795>管道表达式实时调试，$N 参数绑定，第 4 阶段支持批量用例 CSV 导入对比</div></div>',1)),c("div",{class:"head-actions"},[c("button",{class:"btn btn-ghost",onClick:pe},"重置"),c("button",{class:"btn btn-secondary",onClick:_e},"载入示例")])]),c("div",tD,[c("div",rD,[V[16]||(V[16]=c("span",{class:"phase-num"},"1",-1)),V[17]||(V[17]=c("div",{class:"phase-head-body"},[c("div",{class:"phase-title"},"管道表达式"),c("div",{class:"phase-sub"},"由输入变量 $N 和 | 分隔的操作符组成。在下方面板点击任意操作符追加到当前光标位置。")],-1)),ke.value&&ke.value!=="空"?(b(),T("span",oD,R(ke.value),1)):Ce("",!0),c("div",{class:"hist-wrap",onClick:V[1]||(V[1]=en(()=>{},["stop"]))},[c("button",{class:"btn btn-ghost btn-hist",onClick:V[0]||(V[0]=H=>{q.value=!q.value,se()})}," 历史 "),q.value?(b(),T("div",sD,[V[15]||(V[15]=c("div",{class:"hist-hdr"},"最近表达式",-1)),I.value.length?Ce("",!0):(b(),T("div",iD,"暂无历史")),(b(!0),T(de,null,Me(I.value,(H,ce)=>(b(),T("button",{key:ce,class:"hist-item",onClick:ye=>me(H)},[c("span",lD,R(H.expr.slice(0,60))+R(H.expr.length>60?"…":""),1),c("span",uD,R(be(H.timestamp)),1)],8,aD))),128))])):Ce("",!0)])]),c("div",cD,[He(c("textarea",{ref_key:"textareaEl",ref:p,class:"expr-input","onUpdate:modelValue":V[2]||(V[2]=H=>s.value=H),placeholder:"$1 | add $2 | toHex 8",spellcheck:"false",onInput:Y},null,544),[[an,s.value]]),c("button",{class:"btn-ghost-sm",onClick:V[3]||(V[3]=H=>{s.value="",Y()})},"清空")]),s.value.trim()?Ce("",!0):(b(),T("div",dD,[V[22]||(V[22]=c("div",{class:"qs-title"},"快速开始",-1)),c("div",fD,[c("button",{class:"qs-card",onClick:V[4]||(V[4]=H=>ue("$1 | toHex 8"))},[...V[18]||(V[18]=[c("code",null,"$1 | toHex 8",-1),c("span",null,"数字 → 8位十六进制",-1)])]),c("button",{class:"qs-card",onClick:V[5]||(V[5]=H=>ue("$1 | shr 8 | and 0xFF"))},[...V[19]||(V[19]=[c("code",null,"$1 | shr 8 | and 0xFF",-1),c("span",null,"提取第 2 字节",-1)])]),c("button",{class:"qs-card",onClick:V[6]||(V[6]=H=>ue("$1 | add $2 | toHex 8"))},[...V[20]||(V[20]=[c("code",null,"$1 | add $2 | toHex 8",-1),c("span",null,"两数相加转十六进制",-1)])]),c("button",{class:"qs-card",onClick:V[7]||(V[7]=H=>ue("$1 | string.format '%.1f°C'"))},[...V[21]||(V[21]=[c("code",null,"string.format '%.1f°C'",-1),c("span",null,"格式化温度字符串",-1)])])])])),c("div",pD,[V[23]||(V[23]=c("div",{class:"ops-head"},"操作符面板 · 悬停看签名说明 · 点击插入到光标处",-1)),c("div",hD,[c("span",{class:"op-cat-name",style:Ve({"--cat-color":o.vars})},"输入",4),c("div",mD,[(b(!0),T(de,null,Me(ne.value.length?ne.value:["$1"],H=>(b(),T("button",{key:H,class:"op-chip","data-cat":"vars",onClick:ce=>ae(H,"vars")},[Pe(R(H)+" ",1),c("span",_D,[c("div",gD,R(H),1),c("div",yD,"引用第 "+R(H.slice(1))+" 个输入参数，从「② 输入参数」获取对应值",1),c("div",CD,R(H)+" | add 5 → (在 "+R(H)+" 的值上加 5)",1)])],8,vD))),128))])]),(b(),T(de,null,Me(t,H=>c("div",{key:H,class:"op-cat-row","data-cat":H},[c("span",{class:"op-cat-name",style:Ve({"--cat-color":o[H]})},R(r[H]),5),c("div",bD,[(b(!0),T(de,null,Me(Object.entries(n).filter(([,ce])=>ce.cat===H),([ce,ye])=>(b(),T("button",{key:ce,class:"op-chip","data-cat":H,onClick:he=>ae(ce,H)},[Pe(R(ce),1),ye.sig.includes(" ")?(b(),T("span",wD,R(ye.sig.slice(ce.length).trim()),1)):Ce("",!0),c("span",ID,[c("div",PD,R(ye.sig),1),c("div",$D,R(ye.desc),1),c("div",xD,R(ye.example),1)])],8,ED))),128))])],8,SD)),64))])]),c("div",{class:fe(["phase",{dim:!s.value.trim()}])},[c("div",DD,[V[24]||(V[24]=c("span",{class:"phase-num"},"2",-1)),V[25]||(V[25]=c("div",null,[c("div",{class:"phase-title"},"输入参数"),c("div",{class:"phase-sub"},'表达式中引用的 $N 会自动出现在这里。每个变量可填写值和备注（如 "CPU 温度"）。')],-1)),Ne.value&&Ne.value!=="—"?(b(),T("span",{key:0,class:"phase-status",style:Ve({color:Q.value.length?"var(--warn)":"var(--ok)"})},R(Ne.value),5)):Ce("",!0)]),s.value.trim()?O.value===0?(b(),T("div",kD,"当前表达式无参数，不需要输入值")):(b(),T("div",TD,[(b(!0),T(de,null,Me(O.value,H=>(b(),T("div",{key:H,class:fe(["input-row",{"has-error":Q.value.includes(H-1)}])},[c("span",{class:fe(["var-tag",{error:Q.value.includes(H-1)}])},"$"+R(H),3),c("div",VD,[He(c("input",{class:fe({invalid:Q.value.includes(H-1)}),"onUpdate:modelValue":ce=>i.value[H-1]=ce,onInput:Y,placeholder:"值（数字、字符串、0x... 均可）",autocomplete:"off"},null,42,ND),[[an,i.value[H-1]]]),Q.value.includes(H-1)?(b(),T("span",AD,"⚠ 未输入 $"+R(H)+" 值，无法进行管道处理",1)):Ce("",!0)]),He(c("input",{class:"lbl-input","onUpdate:modelValue":ce=>a.value[H-1]=ce,placeholder:"备注（可选）"},null,8,FD),[[an,a.value[H-1]]])],2))),128))])):(b(),T("div",MD,"① 中尚未引用任何 $N，下方将随表达式自动填充输入框"))],2),c("div",{class:fe(["phase",{done:Se.value,"phase-error":$.value}])},[c("div",OD,[c("span",{class:fe(["phase-num",{done:Se.value,"num-error":$.value}])},"3",2),V[26]||(V[26]=c("div",null,[c("div",{class:"phase-title"},"管道处理"),c("div",{class:"phase-sub"},"实时展开每个阶段的输入、操作和输出，标注数据类型。最后一行给出最终结果。")],-1)),De.value&&De.value!=="空"?(b(),T("span",{key:0,class:"phase-status",style:Ve({color:$.value?"var(--err)":Se.value?"var(--ok)":""})},R(De.value),5)):Ce("",!0)]),s.value.trim()?ee.value?(b(),T("div",RD,[V[28]||(V[28]=c("div",{class:"pipe-ico"},"… ⏳ …",-1)),V[29]||(V[29]=c("div",null,"等待输入参数",-1)),c("div",LD,"还需填写 "+R(Q.value.map(H=>"$"+(H+1)).join(", "))+" 才能开始计算",1)])):(b(),T(de,{key:2},[c("div",UD,[(b(!0),T(de,null,Me(l.value,(H,ce)=>{var ye,he;return b(),T(de,{key:ce},[c("div",{class:fe(["stage",{"input-stage":ce===0,"stage-error":H.error}])},[c("div",{class:fe(["stage-num",{"sn-input":ce===0}])},R(ce===0?"$":ce),3),c("div",HD,[c("div",zD,[ce===0?(b(),T("span",KD,R(H.expr),1)):(b(),T(de,{key:1},[c("span",{class:fe(["op-name","cat-"+(((ye=n[H.expr.split(" ")[0]])==null?void 0:ye.cat)||"arith")])},R(H.expr.split(" ")[0]),3),H.expr.includes(" ")?(b(),T("span",WD,R(H.expr.split(" ").slice(1).join(" ")),1)):Ce("",!0)],64))]),c("div",GD,R(((he=n[H.expr.split(" ")[0]])==null?void 0:he.desc)||(ce===0?"输入值":"")),1)]),c("div",{class:fe(["stage-val",{"val-err":H.error}])},[H.error?Ce("",!0):(b(),T("span",XD,R(L(H.output)),1)),Pe(" "+R(H.error?"⚠ "+H.error:W(H.output)),1)],2)],2),ce<l.value.length-1?(b(),T("div",YD)):Ce("",!0)],64)}),128))]),u.value!==null&&!$.value?(b(),T("div",qD,[c("div",null,[c("div",jD,"最终结果 · "+R(L(u.value)),1),c("div",ZD,R(String(u.value)),1)]),c("button",{class:"btn-copy-final",onClick:m},R(d.value?"✓ 已复制":"复制"),1)])):Ce("",!0)],64)):(b(),T("div",BD,[...V[27]||(V[27]=[c("div",{class:"pipe-ico"},"$ · |",-1),c("div",null,"等待表达式 …",-1),c("div",{class:"pipe-reason"},[Pe("在 "),c("b",null,"①"),Pe(" 填入表达式后，每个阶段会在这里展开")],-1)])]))],2),c("div",JD,[c("div",QD,[V[30]||(V[30]=c("span",{class:"phase-num"},"4",-1)),V[31]||(V[31]=c("div",null,[c("div",{class:"phase-title"},[Pe("批量用例 "),c("span",{class:"ph4-sub"},"· 复用 ① 的表达式")]),c("div",{class:"phase-sub"},"用一组真实「输入 → 预期值」数据，验证 ① 的表达式是否对每一组都得到正确结果。")],-1)),g.value>0?(b(),T("span",{key:0,class:"phase-status",style:Ve({color:B.value===g.value?"var(--ok)":B.value===0?"var(--err)":"var(--warn)"})},R(`${B.value} / ${g.value} 通过`),5)):Ce("",!0)]),c("div",eM,[V[32]||(V[32]=c("span",{class:"tc-ctx-lbl"},"当前表达式",-1)),c("span",{class:fe(["tc-ctx-expr",{empty:!s.value.trim()}])},R(s.value.trim()||"（未填写表达式 · 请先在 ① 输入）"),3)]),c("div",nM,[c("button",{class:"btn btn-primary",onClick:w},"▶ 运行全部"),c("button",{class:"btn btn-secondary",onClick:F},"+ 新增用例"),c("div",tM,[c("button",{class:fe({active:N.value==="table"}),onClick:V[8]||(V[8]=H=>N.value="table")},"表格",2),c("button",{class:fe({active:N.value==="csv"}),onClick:V[9]||(V[9]=H=>N.value="csv")},"CSV 粘贴",2)]),c("button",{class:"btn btn-ghost",onClick:V[10]||(V[10]=H=>x.value=[])},"清空"),V[33]||(V[33]=c("div",{style:{flex:"1"}},null,-1)),g.value&&D.value?(b(),T("div",rM,[c("span",{class:fe(["pill",B.value===g.value?"pill-ok":B.value===0?"pill-err":"pill-warn"])},R(B.value)+" / "+R(g.value)+" 通过",3),c("div",oM,[c("div",{class:"pct-fill",style:Ve({width:y.value+"%",background:B.value===g.value?"var(--ok)":B.value===0?"var(--err)":"var(--warn)"})},null,4)]),c("span",sM,R(y.value)+"%",1)])):Ce("",!0)]),c("div",{class:fe(["csv-area",{open:N.value==="csv"}])},[V[34]||(V[34]=c("div",{class:"csv-hint"},"每行一个用例 · 列分隔可用逗号或空格 · 最后一列为预期值",-1)),He(c("textarea",{"onUpdate:modelValue":V[11]||(V[11]=H=>U.value=H),spellcheck:"false",placeholder:`100, 50, 0x00000096
200, 30, 0x000000e6
0, 0, 0x00000000`},null,512),[[an,U.value]]),c("div",iM,[c("button",{class:"btn btn-secondary",onClick:C},"导入到表格"),c("button",{class:"btn btn-ghost",onClick:V[12]||(V[12]=H=>{N.value="table",U.value=""})},"取消")])],2),x.value.length?(b(),T("div",lM,[c("table",uM,[c("thead",null,[c("tr",null,[V[36]||(V[36]=c("th",{class:"num-cell"},"#",-1)),(b(!0),T(de,null,Me(ne.value,H=>(b(),T("th",{key:H},R(H),1))),128)),V[37]||(V[37]=c("th",null,"预期",-1)),V[38]||(V[38]=c("th",null,"实际",-1)),V[39]||(V[39]=c("th",{class:"status-cell"},"状态",-1)),V[40]||(V[40]=c("th",{class:"action-cell"},null,-1))])]),c("tbody",null,[(b(!0),T(de,null,Me(x.value,(H,ce)=>(b(),T("tr",{key:ce,class:fe(H._pass===!0?"row-pass":H._pass===!1?"row-fail":"")},[c("td",cM,R(ce+1),1),(b(!0),T(de,null,Me(ne.value,(ye,he)=>(b(),T("td",{key:ye},[He(c("input",{class:"tc-input","onUpdate:modelValue":we=>H.vals[he]=we,placeholder:"—"},null,8,dM),[[an,H.vals[he]]])]))),128)),c("td",null,[He(c("input",{class:"tc-input","onUpdate:modelValue":ye=>H.expected=ye,placeholder:"—"},null,8,fM),[[an,H.expected]])]),c("td",null,[H._pass===!0?(b(),T("span",pM,R(H._actual),1)):H._actual?(b(),T("span",hM,[(b(!0),T(de,null,Me(E(H._actual||"",H.expected||"").a,(ye,he)=>(b(),T("span",{key:he,class:fe(ye.type==="match"?"dm":ye.type==="extra"?"da":"de")},R(ye.char),3))),128))])):(b(),T("span",mM,"—"))]),c("td",vM,[H._pass===null||H._pass===void 0?(b(),T("span",_M,"—")):H._pass?(b(),T("span",gM,"✓ PASS")):(b(),T("span",yM,"✗ FAIL"))]),c("td",CM,[c("button",{class:"del-btn",onClick:ye=>_(ce)},"✕",8,SM)])],2))),128))])])])):(b(),T("div",aM,[...V[35]||(V[35]=[c("div",{class:"tc-empty-ico"},"— · — · — · —",-1),c("div",null,[Pe("尚无用例 · 点击 "),c("b",null,"+ 新增用例"),Pe(" 添加，或切到 CSV 粘贴模式批量导入")],-1)])]))]),c("div",{class:fe(["toast",{show:f.value}])},R(f.value),3)]))}}),wM=Xn(EM,[["__scopeId","data-v-65be6795"]]),IM={class:"cooling-root"},PM=["src"],$M=Be({__name:"CoolingConfigView",setup(e){const n="/BMC/vue-topo/",t=ie(()=>n.endsWith("/")?n+"cooling-config/index.html":n+"/cooling-config/index.html");return(r,o)=>(b(),T("div",IM,[c("iframe",{src:t.value,class:"cooling-frame",title:"能效调速配置编辑器",sandbox:"allow-scripts allow-same-origin allow-downloads allow-modals allow-popups"},null,8,PM)]))}}),xM=Xn($M,[["__scopeId","data-v-e8b99b6a"]]),DM={class:"app-root"},MM={key:0,class:"pane pane-main"},kM={key:0,class:"dock-head"},TM={class:"dock-title"},VM={class:"dock-title-ic",viewBox:"0 0 24 24","aria-hidden":"true"},NM=["d"],AM={class:"dock-hint"},FM={class:"dock-body"},OM={class:"code-head"},BM={class:"code-file"},RM={class:"code-body"},LM={class:"ln"},UM={class:"lc"},HM=Be({__name:"App",setup(e){const{state:n,closeDock:t,closeCodeDoc:r}=zi(),o=Ee(42),s=ie(()=>{var D;return(((D=n.codeDoc)==null?void 0:D.content)||"").split(`
`)});let i=!1;function a(D){i=!0,D.preventDefault(),window.addEventListener("mousemove",l),window.addEventListener("mouseup",u)}function l(D){if(!i)return;const O=(window.innerWidth-D.clientX)/window.innerWidth*100;o.value=Math.min(70,Math.max(24,O))}function u(){i=!1,window.removeEventListener("mousemove",l),window.removeEventListener("mouseup",u)}const d={smc:{label:"SMC 偏移量计算器",icon:"M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4v3h10V6H7zm1 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"},expr:{label:"批量表达式计算器",icon:"M8.7 15.9 4.8 12l3.9-3.9L7.3 6.7 2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L21 12l-5.3 5.3-1.4-1.4z"},cooling:{label:"能效调速配置模板",icon:"M12 3a3 3 0 0 0-3 3v7.1a5 5 0 1 0 6 0V6a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v8.02l.5.36a3 3 0 1 1-3 0l.5-.36V6a1 1 0 0 1 1-1z"},alarm:{label:"板卡告警配置",icon:"M12 2a6 6 0 0 0-6 6c0 3.5-1 4.9-2 6v1h16v-1c-1-1.1-2-2.5-2-6a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"}};(function(){const O=location.hash.replace("#",""),Q=new URLSearchParams(location.search).get("tab"),ee=O||Q||"";(ee==="smc"||ee==="expr"||ee==="cooling")&&(n.dockTool=ee)})();const f=new URLSearchParams(location.search).get("solo")==="true",h=ie(()=>n.dockTool==="alarm"),p=Ee(46),I=Ee(50);let P=!1;function x(D){P=!0,D.preventDefault(),window.addEventListener("mousemove",N),window.addEventListener("mouseup",U)}function N(D){if(P)if(h.value){const O=(window.innerHeight-D.clientY)/window.innerHeight*100;I.value=Math.min(78,Math.max(22,O))}else{const O=(window.innerWidth-D.clientX)/window.innerWidth*100;p.value=Math.min(70,Math.max(26,O))}}function U(){P=!1,window.removeEventListener("mousemove",N),window.removeEventListener("mouseup",U)}return Fe(()=>[n.dockTool,p.value,I.value,n.codeDoc,o.value],()=>{mn(()=>window.dispatchEvent(new Event("resize")))}),(D,O)=>(b(),T("div",DM,[c("div",{class:fe(["view-area",{split:le(n).dockTool&&!f,bottom:h.value&&!f}])},[f?Ce("",!0):(b(),T("div",MM,[He(Le(b4,null,null,512),[[a1,le(n).anchor==="topology"]]),le(n).anchor==="code"?(b(),Xe(L4,{key:0})):Ce("",!0)])),le(n).dockTool?(b(),T(de,{key:1},[f?Ce("",!0):(b(),T("div",{key:0,class:"splitter",onMousedown:x,title:"拖动调整分屏宽度"},null,32)),c("div",{class:fe(["pane pane-dock",{"pane-solo":f}]),style:Ve(f?{}:h.value?{height:I.value+"%"}:{width:p.value+"%"})},[f?Ce("",!0):(b(),T("div",kM,[c("span",TM,[(b(),T("svg",VM,[c("path",{d:d[le(n).dockTool].icon},null,8,NM)])),Pe(R(d[le(n).dockTool].label),1)]),c("span",AM,R(h.value?"底部停靠 · 与拓扑实时同步":"分屏联动 · 与拓扑实时同步"),1),c("button",{class:"dock-close","aria-label":"关闭分屏",onClick:O[0]||(O[0]=(...Q)=>le(t)&&le(t)(...Q))},"✕")])),c("div",FM,[le(n).dockTool==="smc"?(b(),Xe(nD,{key:0})):le(n).dockTool==="expr"?(b(),Xe(wM,{key:1})):le(n).dockTool==="cooling"?(b(),Xe(xM,{key:2})):le(n).dockTool==="alarm"?(b(),Xe(al,{key:3})):Ce("",!0)])],6)],64)):Ce("",!0),le(n).codeDoc&&!f?(b(),T(de,{key:2},[c("div",{class:"splitter",onMousedown:a,title:"拖动调整代码分屏宽度"},null,32),c("div",{class:"pane pane-code",style:Ve({width:o.value+"%"})},[c("div",OM,[c("span",BM,[O[2]||(O[2]=c("svg",{class:"code-file-ic",viewBox:"0 0 24 24","aria-hidden":"true"},[c("path",{d:"M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5z"})],-1)),Pe(R(le(n).codeDoc.file),1)]),O[3]||(O[3]=c("span",{class:"code-hint"},"告警配置 → CSR 对象（只读预览）",-1)),c("button",{class:"dock-close","aria-label":"关闭代码",onClick:O[1]||(O[1]=(...Q)=>le(r)&&le(r)(...Q))},"✕")]),c("div",RM,[(b(!0),T(de,null,Me(s.value,(Q,ee)=>(b(),T("div",{key:ee,class:"code-line"},[c("span",LM,R(ee+1),1),c("span",UM,R(Q),1)]))),128))])],4)],64)):Ce("",!0)],2)]))}}),zM=Xn(HM,[["__scopeId","data-v-efae3fb1"]]);D1(zM).mount("#app");
