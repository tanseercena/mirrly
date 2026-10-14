var Ea,gt,zf,K1,sr,Ff,Vf,Hf,Pl,va,xo,Gf,Ul,Ll,Dl,Z1,Ma={},ba=[],J1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,wa=Array.isArray;function Ii(t,e){for(var n in e)t[n]=e[n];return t}function Nl(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function j1(t,e,n){var i,r,s,o={};for(s in e)s=="key"?i=e[s]:s=="ref"?r=e[s]:o[s]=e[s];if(arguments.length>2&&(o.children=arguments.length>3?Ea.call(arguments,2):n),typeof t=="function"&&t.defaultProps!=null)for(s in t.defaultProps)o[s]===void 0&&(o[s]=t.defaultProps[s]);return ya(t,o,i,r,null)}function ya(t,e,n,i,r){var s={type:t,props:e,key:n,ref:i,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:r??++zf,__i:-1,__u:0};return r==null&&gt.vnode!=null&&gt.vnode(s),s}function jn(t){return t.children}function xa(t,e){this.props=t,this.context=e}function Ir(t,e){if(e==null)return t.__?Ir(t.__,t.__i+1):null;for(var n;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null)return n.__e;return typeof t.type=="function"?Ir(t):null}function Q1(t){if(t.__P&&t.__d){var e=t.__v,n=e.__e,i=[],r=[],s=Ii({},e);s.__v=e.__v+1,gt.vnode&&gt.vnode(s),Fl(t.__P,s,e,t.__n,t.__P.namespaceURI,32&e.__u?[n]:null,i,n??Ir(e),!!(32&e.__u),r),s.__v=e.__v,s.__.__k[s.__i]=s,Yf(i,s,r),e.__e=e.__=null,s.__e!=n&&Wf(s)}}function Wf(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),Wf(t)}function Of(t){(!t.__d&&(t.__d=!0)&&sr.push(t)&&!Sa.__r++||Ff!=gt.debounceRendering)&&((Ff=gt.debounceRendering)||Vf)(Sa)}function Sa(){try{for(var t,e=1;sr.length;)sr.length>e&&sr.sort(Hf),t=sr.shift(),e=sr.length,Q1(t)}finally{sr.length=Sa.__r=0}}function Xf(t,e,n,i,r,s,o,a,c,l,h){var d,u,p,g,v,m,f=i&&i.__k||ba,S=e.length;for(c=ev(n,e,f,c,S),d=0;d<S;d++)(p=n.__k[d])!=null&&(u=p.__i!=-1&&f[p.__i]||Ma,p.__i=d,m=Fl(t,p,u,r,s,o,a,c,l,h),g=p.__e,p.ref&&u.ref!=p.ref&&(u.ref&&Ol(u.ref,null,p),h.push(p.ref,p.__c||g,p)),v==null&&g!=null&&(v=g),4&p.__u?(c=$f(p,c,t),u.__e&&(u.__e=null)):typeof p.type=="function"&&m!==void 0?c=m:g&&(c=g.nextSibling),p.__u&=-7);return n.__e=v,c}function ev(t,e,n,i,r){var s,o,a,c,l,h=n.length,d=h,u=0;for(t.__k=new Array(r),s=0;s<r;s++)(o=e[s])!=null&&typeof o!="boolean"&&typeof o!="function"?(typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?o=t.__k[s]=ya(null,o,null,null,null):wa(o)?o=t.__k[s]=ya(jn,{children:o},null,null,null):o.constructor===void 0&&o.__b>0?o=t.__k[s]=ya(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):t.__k[s]=o,c=s+u,o.__=t,o.__b=t.__b+1,a=null,(l=o.__i=tv(o,n,c,d))!=-1&&(d--,(a=n[l])&&(a.__u|=2)),a==null||a.__v==null?(l==-1&&(r>h?u--:r<h&&u++),typeof o.type!="function"&&(o.__u|=4)):l!=c&&(l==c-1?u--:l==c+1?u++:(l>c?u--:u++,o.__u|=4))):t.__k[s]=null;if(d)for(s=0;s<h;s++)(a=n[s])!=null&&!(2&a.__u)&&(a.__e==i&&(i=Ir(a)),Zf(a,a));return i}function $f(t,e,n){var i,r;if(typeof t.type=="function"){for(i=t.__k,r=0;i&&r<i.length;r++)i[r]&&(i[r].__=t,e=$f(i[r],e,n));return e}t.__e!=e&&(e&&t.type&&!e.parentNode&&(e=Ir(t)),e=n.insertBefore(t.__e,e||null));do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function tv(t,e,n,i){var r,s,o,a=t.key,c=t.type,l=e[n],h=l!=null&&(2&l.__u)==0;if(l===null&&a==null||h&&a==l.key&&c==l.type)return n;if(i>(h?1:0)){for(r=n-1,s=n+1;r>=0||s<e.length;)if((l=e[o=r>=0?r--:s++])!=null&&!(2&l.__u)&&a==l.key&&c==l.type)return o}return-1}function kf(t,e,n){e[0]=="-"?t.setProperty(e,n??""):t[e]=n==null?"":typeof n!="number"||J1.test(e)?n:n+"px"}function _a(t,e,n,i,r){var s,o;e:if(e=="style")if(typeof n=="string")t.style.cssText=n;else{if(typeof i=="string"&&(t.style.cssText=i=""),i)for(e in i)n&&e in n||kf(t.style,e,"");if(n)for(e in n)i&&n[e]==i[e]||kf(t.style,e,n[e])}else if(e[0]=="o"&&e[1]=="n")s=e!=(e=e.replace(Gf,"$1")),o=e.toLowerCase(),e=o in t||e=="onFocusOut"||e=="onFocusIn"?o.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+s]=n,n?i?n[xo]=i[xo]:(n[xo]=Ul,t.addEventListener(e,s?Dl:Ll,s)):t.removeEventListener(e,s?Dl:Ll,s);else{if(r=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&n==1?"":n))}}function Bf(t){return function(e){if(this.l){var n=this.l[e.type+t];if(e[va]==null)e[va]=Ul++;else if(e[va]<n[xo])return;return n(gt.event?gt.event(e):e)}}}function Fl(t,e,n,i,r,s,o,a,c,l){var h,d,u,p,g,v,m,f,S,w,M,N,T,R,L,b,y=e.type;if(e.constructor!==void 0)return null;128&n.__u&&(c=!!(32&n.__u),s=[a=e.__e=n.__e]),(h=gt.__b)&&h(e);e:if(typeof y=="function"){d=o.length;try{if(S=e.props,w=y.prototype&&y.prototype.render,M=(h=y.contextType)&&i[h.__c],N=h?M?M.props.value:h.__:i,n.__c?f=(u=e.__c=n.__c).__=u.__E:(w?e.__c=u=new y(S,N):(e.__c=u=new xa(S,N),u.constructor=y,u.render=iv),M&&M.sub(u),u.state||(u.state={}),u.__n=i,p=u.__d=!0,u.__h=[],u._sb=[]),w&&u.__s==null&&(u.__s=u.state),w&&y.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=Ii({},u.__s)),Ii(u.__s,y.getDerivedStateFromProps(S,u.__s))),g=u.props,v=u.state,u.__v=e,p)w&&y.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),w&&u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(w&&y.getDerivedStateFromProps==null&&S!==g&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(S,N),e.__v==n.__v||!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(S,u.__s,N)===!1){e.__v!=n.__v&&(u.props=S,u.state=u.__s,u.__d=!1),e.__e=n.__e,e.__k=n.__k,e.__k.some(function(A){A&&(A.__=e)}),ba.push.apply(u.__h,u._sb),u._sb=[],u.__h.length&&o.push(u),a=Ir(n);break e}u.componentWillUpdate!=null&&u.componentWillUpdate(S,u.__s,N),w&&u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(g,v,m)})}if(u.context=N,u.props=S,u.__P=t,u.__e=!1,T=gt.__r,R=0,w)u.state=u.__s,u.__d=!1,T&&T(e),h=u.render(u.props,u.state,u.context),ba.push.apply(u.__h,u._sb),u._sb=[];else do u.__d=!1,T&&T(e),h=u.render(u.props,u.state,u.context),u.state=u.__s;while(u.__d&&++R<25);u.state=u.__s,u.getChildContext!=null&&(i=Ii(Ii({},i),u.getChildContext())),w&&!p&&u.getSnapshotBeforeUpdate!=null&&(m=u.getSnapshotBeforeUpdate(g,v)),L=h!=null&&h.type===jn&&h.key==null?Kf(h.props.children):h,a=Xf(t,wa(L)?L:[L],e,n,i,r,s,o,a,c,l),u.base=e.__e,e.__u&=-161,u.__h.length&&o.push(u),f&&(u.__E=u.__=null)}catch(A){if(o.length=d,e.__v=null,c||s!=null){if(A.then){for(e.__u|=c?160:128;a&&a.nodeType==8&&a.nextSibling;)a=a.nextSibling;s!=null&&(s[s.indexOf(a)]=null),e.__e=a}else if(s!=null)for(b=s.length;b--;)Nl(s[b])}else e.__e=n.__e;e.__k==null&&(e.__k=n.__k||[]),A.then||qf(e),gt.__e(A,e,n)}}else s==null&&e.__v==n.__v?(e.__k=n.__k,e.__e=n.__e):a=e.__e=nv(n.__e,e,n,i,r,s,o,c,l);return(h=gt.diffed)&&h(e),128&e.__u?void 0:a}function qf(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(qf))}function Yf(t,e,n){for(var i=0;i<n.length;i++)Ol(n[i],n[++i],n[++i]);gt.__c&&gt.__c(e,t),t.some(function(r){try{t=r.__h,r.__h=[],t.some(function(s){s.call(r)})}catch(s){gt.__e(s,r.__v)}})}function Kf(t){return typeof t!="object"||t==null||t.__b>0?t:wa(t)?t.map(Kf):t.constructor!==void 0?null:Ii({},t)}function nv(t,e,n,i,r,s,o,a,c){var l,h,d,u,p,g,v,m=n.props||Ma,f=e.props,S=e.type;if(S=="svg"?r="http://www.w3.org/2000/svg":S=="math"?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),s!=null){for(l=0;l<s.length;l++)if((p=s[l])&&"setAttribute"in p==!!S&&(S?p.localName==S:p.nodeType==3)){t=p,s[l]=null;break}}if(t==null){if(S==null)return document.createTextNode(f);t=document.createElementNS(r,S,f.is&&f),a&&(gt.__m&&gt.__m(e,s),a=!1),s=null}if(S==null)m===f||a&&t.data==f||(t.data=f);else{if(s=S=="textarea"&&f.defaultValue!=null?null:s&&Ea.call(t.childNodes),!a&&s!=null)for(m={},l=0;l<t.attributes.length;l++)m[(p=t.attributes[l]).name]=p.value;for(l in m)p=m[l],l=="dangerouslySetInnerHTML"?d=p:l=="children"||l in f||l=="value"&&"defaultValue"in f||l=="checked"&&"defaultChecked"in f||_a(t,l,null,p,r);for(l in f)p=f[l],l=="children"?u=p:l=="dangerouslySetInnerHTML"?h=p:l=="value"?g=p:l=="checked"?v=p:a&&typeof p!="function"||m[l]===p||_a(t,l,p,m[l],r);if(h)a||d&&(h.__html==d.__html||h.__html==t.innerHTML)||(t.innerHTML=h.__html),e.__k=[];else if(d&&(t.innerHTML=""),Xf(e.type=="template"?t.content:t,wa(u)?u:[u],e,n,i,S=="foreignObject"?"http://www.w3.org/1999/xhtml":r,s,o,s?s[0]:n.__k&&Ir(n,0),a,c),s!=null)for(l=s.length;l--;)Nl(s[l]);a&&S!="textarea"||(l="value",S=="progress"&&g==null?t.removeAttribute("value"):g!=null&&(g!==t[l]||S=="progress"&&!g||S=="option"&&g!=m[l])&&_a(t,l,g,m[l],r),l="checked",v!=null&&v!=t[l]&&_a(t,l,v,m[l],r))}return t}function Ol(t,e,n){try{if(typeof t=="function"){var i=typeof t.__u=="function";i&&t.__u(),i&&e==null||(t.__u=t(e))}else t.current=e}catch(r){gt.__e(r,n)}}function Zf(t,e,n){var i,r;if(gt.unmount&&gt.unmount(t),(i=t.ref)&&(i.current&&i.current!=t.__e||Ol(i,null,e)),(i=t.__c)!=null){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(s){gt.__e(s,e)}i.base=i.__P=i.__n=null}if(i=t.__k)for(r=0;r<i.length;r++)i[r]&&Zf(i[r],e,n||typeof t.type!="function");n||Nl(t.__e),t.__c=t.__=t.__e=void 0}function iv(t,e,n){return this.constructor(t,n)}function kl(t,e,n){var i,r,s,o;e==document&&(e=document.documentElement),gt.__&&gt.__(t,e),r=(i=typeof n=="function")?null:n&&n.__k||e.__k,s=[],o=[],Fl(e,t=(!i&&n||e).__k=j1(jn,null,[t]),r||Ma,Ma,e.namespaceURI,!i&&n?[n]:r?null:e.firstChild?Ea.call(e.childNodes):null,s,!i&&n?n:r?r.__e:e.firstChild,i,o),Yf(s,t,o),t.props.children=null}Ea=ba.slice,gt={__e:function(t,e,n,i){for(var r,s,o;e=e.__;)if((r=e.__c)&&!r.__)try{if((s=r.constructor)&&s.getDerivedStateFromError!=null&&(r.setState(s.getDerivedStateFromError(t)),o=r.__d),r.componentDidCatch!=null&&(r.componentDidCatch(t,i||{}),o=r.__d),o)return r.__E=r}catch(a){t=a}throw t}},zf=0,K1=function(t){return t!=null&&t.constructor===void 0},xa.prototype.setState=function(t,e){var n;n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=Ii({},this.state),typeof t=="function"&&(t=t(Ii({},n),this.props)),t&&Ii(n,t),t!=null&&this.__v&&(e&&this._sb.push(e),Of(this))},xa.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),Of(this))},xa.prototype.render=jn,sr=[],Vf=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Hf=function(t,e){return t.__v.__b-e.__v.__b},Sa.__r=0,Pl=Math.random().toString(8),va="__d"+Pl,xo="__a"+Pl,Gf=/(PointerCapture)$|Capture$/i,Ul=0,Ll=Bf(!1),Dl=Bf(!0),Z1=0;var Mo,zt,Bl,Jf,Aa=0,sp=[],$t=gt,jf=$t.__b,Qf=$t.__r,ep=$t.diffed,tp=$t.__c,np=$t.unmount,ip=$t.__;function Vl(t,e){$t.__h&&$t.__h(zt,t,Aa||e),Aa=0;var n=zt.__H||(zt.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({}),n.__[t]}function Vn(t){return Aa=1,rv(ap,t)}function rv(t,e,n){var i=Vl(Mo++,2);if(i.t=t,!i.__c&&(i.__=[n?n(e):ap(void 0,e),function(a){var c=i.__N?i.__N[0]:i.__[0],l=i.t(c,a);c!==l&&(i.__N=[l,i.__[1]],i.__c.setState({}))}],i.__c=zt,!zt.__f)){var r=function(a,c,l){if(!i.__c.__H)return!0;var h=!1,d=i.__c.props!==a;if(i.__c.__H.__.some(function(p){if(p.__N){h=!0;var g=p.__[0];p.__=p.__N,p.__N=void 0,g!==p.__[0]&&(d=!0)}}),s){var u=s.call(this,a,c,l);return h?u||d:u}return!h||d};zt.__f=!0;var s=zt.shouldComponentUpdate,o=zt.componentWillUpdate;zt.componentWillUpdate=function(a,c,l){if(this.__e){var h=s;s=void 0,r(a,c,l),s=h}o&&o.call(this,a,c,l)},zt.shouldComponentUpdate=r}return i.__N||i.__}function Hl(t,e){var n=Vl(Mo++,3);!$t.__s&&op(n.__H,e)&&(n.__=t,n.u=e,zt.__H.__h.push(n))}function Et(t){return Aa=5,sv(function(){return{current:t}},[])}function sv(t,e){var n=Vl(Mo++,7);return op(n.__H,e)&&(n.__=t(),n.__H=e,n.__h=t),n.__}function ov(){for(var t;t=sp.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(Ta),e.__h.some(zl),e.__h=[]}catch(n){e.__h=[],$t.__e(n,t.__v)}}}$t.__b=function(t){zt=null,jf&&jf(t)},$t.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),ip&&ip(t,e)},$t.__r=function(t){Qf&&Qf(t),Mo=0;var e=(zt=t.__c).__H;e&&(Bl===zt?(e.__h=[],zt.__h=[],e.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(e.__h.some(Ta),e.__h.some(zl),e.__h=[],Mo=0)),Bl=zt},$t.diffed=function(t){ep&&ep(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(sp.push(e)!==1&&Jf===$t.requestAnimationFrame||((Jf=$t.requestAnimationFrame)||av)(ov)),e.__H.__.some(function(n){n.u&&(n.__H=n.u,n.u=void 0)})),Bl=zt=null},$t.__c=function(t,e){e.some(function(n){try{n.__h.some(Ta),n.__h=n.__h.filter(function(i){return!i.__||zl(i)})}catch(i){e.some(function(r){r.__h&&(r.__h=[])}),e=[],$t.__e(i,n.__v)}}),tp&&tp(t,e)},$t.unmount=function(t){np&&np(t);var e,n=t.__c;n&&n.__H&&(n.__H.__.some(function(i){try{Ta(i)}catch(r){e=r}}),n.__H=void 0,e&&$t.__e(e,n.__v))};var rp=typeof requestAnimationFrame=="function";function av(t){var e,n=function(){clearTimeout(i),rp&&cancelAnimationFrame(e),setTimeout(t)},i=setTimeout(n,35);rp&&(e=requestAnimationFrame(n))}function Ta(t){var e=zt,n=t.__c;typeof n=="function"&&(t.__c=void 0,n()),zt=e}function zl(t){var e=zt;t.__c=t.__(),zt=e}function op(t,e){return!t||t.length!==e.length||e.some(function(n,i){return n!==t[i]})}function ap(t,e){return typeof e=="function"?e(t):e}var cv="https://mirrly.test/api",lv="tryon:api-context",Ra={shop:"",token:""};function hv(){if(Ra.token)return Ra;try{let t=sessionStorage.getItem(lv);if(t){let e=JSON.parse(t);e&&typeof e.shop=="string"&&typeof e.token=="string"&&Object.assign(Ra,e)}}catch{}return Ra}function bo(t,e={}){let{shop:n,token:i}=hv(),r=new URLSearchParams({shop:n,"api-token":i,...e});return`${cv}/${n}${t}?${r}`}function cp(){let t="tryon:anon-id",e=`anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;try{let n=localStorage.getItem(t);return n||(n=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():e,localStorage.setItem(t,n),n)}catch{return e}}function Gl(t){return t?{customer_id:t,anonymous_id:cp()}:{anonymous_id:cp()}}async function lp(t,e,n,i,r){let s=await fetch(bo("/session"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({config_token:t,product_id:e,variant_id:n,device_type:uv(),...Gl(i),...r?{session_token:r}:{}})});if(!s.ok){let o;try{o=(await s.json())?.error_code}catch{}let a=new Error(`session start failed: ${s.status}`);throw a.errorCode=o,a}return s.json()}function hp(t,e,n,i){let r=new FormData;r.append("session_token",e);for(let[s,o]of Object.entries(Gl(t)))r.append(s,o);return n&&r.append("video",n,"tryon.webm"),i&&r.append("image",i,"snapshot.jpg"),fetch(bo("/recording"),{method:"POST",body:r}).then(s=>{if(!s.ok)throw new Error(`recording upload failed: ${s.status}`)})}function up(t,e,n){return fetch(bo("/recording/email"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_token:e,email:n,...Gl(t)})}).then(async i=>{if(!i.ok){let r=`recording email failed: ${i.status}`;try{r=(await i.json())?.error??r}catch{}throw new Error(r)}})}function Ca(t,e,n={}){let i=JSON.stringify({session_token:t,event:e,...n});if(navigator.sendBeacon){let r=new Blob([i],{type:"application/json"});navigator.sendBeacon(bo("/event"),r)}else fetch(bo("/event"),{method:"POST",headers:{"Content-Type":"application/json"},body:i,keepalive:!0}).catch(()=>{})}function uv(){let t=navigator.userAgent;return/iPad|Tablet/i.test(t)?"tablet":/Mobi|Android/i.test(t)?"mobile":/Macintosh|Windows|Linux/i.test(t)?"desktop":"unknown"}var Uu="170";var dv=0,dp=1,fv=2;var fm=1,pv=2,Fi=3,mr=0,yn=1,ni=2,fr=0,Cs=1,fp=2,pp=3,mp=4,mv=5,kr=100,gv=101,_v=102,vv=103,yv=104,xv=200,Mv=201,bv=202,Sv=203,xh=204,Mh=205,Ev=206,wv=207,Tv=208,Av=209,Rv=210,Cv=211,Iv=212,Pv=213,Lv=214,bh=0,Sh=1,Eh=2,Ds=3,wh=4,Th=5,Ah=6,Rh=7,pm=0,Dv=1,Uv=2,pr=0,Nv=1,Fv=2,Ov=3,kv=4,Bv=5,zv=6,Vv=7;var mm=300,Us=301,Ns=302,Ch=303,Ih=304,yc=306,Ph=1e3,Vr=1001,Lh=1002,ri=1003,Hv=1004;var Ia=1005;var pi=1006,Wl=1007;var Hr=1008;var Hi=1009,gm=1010,_m=1011,Po=1012,Nu=1013,Gr=1014,ki=1015,Oo=1016,Fu=1017,Ou=1018,Fs=1020,vm=35902,ym=1021,xm=1022,ii=1023,Mm=1024,bm=1025,Is=1026,Os=1027,Sm=1028,ku=1029,Em=1030,Bu=1031;var zu=1033,ja=33776,Qa=33777,ec=33778,tc=33779,Dh=35840,Uh=35841,Nh=35842,Fh=35843,Oh=36196,kh=37492,Bh=37496,zh=37808,Vh=37809,Hh=37810,Gh=37811,Wh=37812,Xh=37813,$h=37814,qh=37815,Yh=37816,Kh=37817,Zh=37818,Jh=37819,jh=37820,Qh=37821,nc=36492,eu=36494,tu=36495,wm=36283,nu=36284,iu=36285,ru=36286;var ic=2300,su=2301,Xl=2302,gp=2400,_p=2401,vp=2402;var Gv=3200,Wv=3201;var Xv=0,$v=1,dr="",_n="srgb",Gs="srgb-linear",xc="linear",xt="srgb";var fs=7680;var yp=519,qv=512,Yv=513,Kv=514,Tm=515,Zv=516,Jv=517,jv=518,Qv=519,xp=35044;var Mp="300 es",Bi=2e3,rc=2001,gr=class{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;let r=this._listeners[e];if(r!==void 0){let s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var $l=Math.PI/180,ou=180/Math.PI;function ko(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(hn[t&255]+hn[t>>8&255]+hn[t>>16&255]+hn[t>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[n&63|128]+hn[n>>8&255]+"-"+hn[n>>16&255]+hn[n>>24&255]+hn[i&255]+hn[i>>8&255]+hn[i>>16&255]+hn[i>>24&255]).toLowerCase()}function vn(t,e,n){return Math.max(e,Math.min(n,t))}function ey(t,e){return(t%e+e)%e}function ql(t,e,n){return(1-n)*t+n*e}function So(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function gn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}var Mt=class t{constructor(e=0,n=0){t.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(vn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){let i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ge=class t{constructor(e,n,i,r,s,o,a,c,l){t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,c,l)}set(e,n,i,r,s,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=n,h[4]=s,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],d=i[7],u=i[2],p=i[5],g=i[8],v=r[0],m=r[3],f=r[6],S=r[1],w=r[4],M=r[7],N=r[2],T=r[5],R=r[8];return s[0]=o*v+a*S+c*N,s[3]=o*m+a*w+c*T,s[6]=o*f+a*M+c*R,s[1]=l*v+h*S+d*N,s[4]=l*m+h*w+d*T,s[7]=l*f+h*M+d*R,s[2]=u*v+p*S+g*N,s[5]=u*m+p*w+g*T,s[8]=u*f+p*M+g*R,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return n*o*h-n*a*l-i*s*h+i*a*c+r*s*l-r*o*c}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,u=a*c-h*s,p=l*s-o*c,g=n*d+i*u+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return e[0]=d*v,e[1]=(r*l-h*i)*v,e[2]=(a*i-r*o)*v,e[3]=u*v,e[4]=(h*n-r*c)*v,e[5]=(r*s-a*n)*v,e[6]=p*v,e[7]=(i*c-l*n)*v,e[8]=(o*n-i*s)*v,this}transpose(){let e,n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Yl.makeScale(e,n)),this}rotate(e){return this.premultiply(Yl.makeRotation(-e)),this}translate(e,n){return this.premultiply(Yl.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Yl=new Ge;function Am(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Lo(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function ty(){let t=Lo("canvas");return t.style.display="block",t}var bp={};function Ro(t){t in bp||(bp[t]=!0,console.warn(t))}function ny(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function iy(t){let e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ry(t){let e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var rt={enabled:!0,workingColorSpace:Gs,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===xt&&(t.r=zi(t.r),t.g=zi(t.g),t.b=zi(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===xt&&(t.r=Ps(t.r),t.g=Ps(t.g),t.b=Ps(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===dr?xc:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function zi(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ps(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}var Sp=[.64,.33,.3,.6,.15,.06],Ep=[.2126,.7152,.0722],wp=[.3127,.329],Tp=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ap=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);rt.define({[Gs]:{primaries:Sp,whitePoint:wp,transfer:xc,toXYZ:Tp,fromXYZ:Ap,luminanceCoefficients:Ep,workingColorSpaceConfig:{unpackColorSpace:_n},outputColorSpaceConfig:{drawingBufferColorSpace:_n}},[_n]:{primaries:Sp,whitePoint:wp,transfer:xt,toXYZ:Tp,fromXYZ:Ap,luminanceCoefficients:Ep,outputColorSpaceConfig:{drawingBufferColorSpace:_n}}});var ps,au=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ps===void 0&&(ps=Lo("canvas")),ps.width=e.width,ps.height=e.height;let i=ps.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ps}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let n=Lo("canvas");n.width=e.width,n.height=e.height;let i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=zi(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){let n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(zi(n[i]/255)*255):n[i]=zi(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},sy=0,sc=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:sy++}),this.uuid=ko(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Kl(r[o].image)):s.push(Kl(r[o]))}else s=Kl(r);i.url=s}return n||(e.images[this.uuid]=i),i}};function Kl(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?au.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var oy=0,Dn=class t extends gr{constructor(e=t.DEFAULT_IMAGE,n=t.DEFAULT_MAPPING,i=Vr,r=Vr,s=pi,o=Hr,a=ii,c=Hi,l=t.DEFAULT_ANISOTROPY,h=dr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:oy++}),this.uuid=ko(),this.name="",this.source=new sc(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Mt(0,0),this.repeat=new Mt(1,1),this.center=new Mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ph:e.x=e.x-Math.floor(e.x);break;case Vr:e.x=e.x<0?0:1;break;case Lh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ph:e.y=e.y-Math.floor(e.y);break;case Vr:e.y=e.y<0?0:1;break;case Lh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=mm;Dn.DEFAULT_ANISOTROPY=1;var Vt=class t{constructor(e=0,n=0,i=0,r=1){t.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s,c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],p=c[5],g=c[9],v=c[2],m=c[6],f=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let w=(l+1)/2,M=(p+1)/2,N=(f+1)/2,T=(h+u)/4,R=(d+v)/4,L=(g+m)/4;return w>M&&w>N?w<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(w),r=T/i,s=R/i):M>N?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=T/r,s=L/r):N<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(N),i=R/s,r=L/s),this.set(i,r,s,n),this}let S=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-v)/S,this.z=(u-h)/S,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},cu=class extends gr{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Vt(0,0,e,n),this.scissorTest=!1,this.viewport=new Vt(0,0,e,n);let r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let s=new Dn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let n=Object.assign({},e.texture.image);return this.texture.source=new sc(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gi=class extends cu{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}},oc=class extends Dn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=ri,this.minFilter=ri,this.wrapR=Vr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var lu=class extends Dn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=ri,this.minFilter=ri,this.wrapR=Vr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _r=class{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let c=i[r+0],l=i[r+1],h=i[r+2],d=i[r+3],u=s[o+0],p=s[o+1],g=s[o+2],v=s[o+3];if(a===0){e[n+0]=c,e[n+1]=l,e[n+2]=h,e[n+3]=d;return}if(a===1){e[n+0]=u,e[n+1]=p,e[n+2]=g,e[n+3]=v;return}if(d!==v||c!==u||l!==p||h!==g){let m=1-a,f=c*u+l*p+h*g+d*v,S=f>=0?1:-1,w=1-f*f;if(w>Number.EPSILON){let N=Math.sqrt(w),T=Math.atan2(N,f*S);m=Math.sin(m*T)/N,a=Math.sin(a*T)/N}let M=a*S;if(c=c*m+u*M,l=l*m+p*M,h=h*m+g*M,d=d*m+v*M,m===1-a){let N=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=N,l*=N,h*=N,d*=N}}e[n]=c,e[n+1]=l,e[n+2]=h,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,r,s,o){let a=i[r],c=i[r+1],l=i[r+2],h=i[r+3],d=s[o],u=s[o+1],p=s[o+2],g=s[o+3];return e[n]=a*g+h*d+c*p-l*u,e[n+1]=c*g+h*u+l*d-a*p,e[n+2]=l*g+h*p+a*u-c*d,e[n+3]=h*g-a*d-c*u-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(r/2),d=a(s/2),u=c(i/2),p=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=u*h*d+l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d+u*p*g;break;case"YZX":this._x=u*h*d+l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d-u*p*g;break;case"XZY":this._x=u*h*d-l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){let i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],c=n[9],l=n[2],h=n[6],d=n[10],u=i+a+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-c)*p,this._y=(s-l)*p,this._z=(o-r)*p}else if(i>a&&i>d){let p=2*Math.sqrt(1+i-a-d);this._w=(h-c)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+l)/p}else if(a>d){let p=2*Math.sqrt(1+a-i-d);this._w=(s-l)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+d-i-a);this._w=(o-r)/p,this._x=(s+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vn(this.dot(e),-1,1)))}rotateTowards(e,n){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,c=n._y,l=n._z,h=n._w;return this._x=i*h+o*a+r*l-s*c,this._y=r*h+o*c+s*a-i*l,this._z=s*h+o*l+i*c-r*a,this._w=o*h-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);let i=this._x,r=this._y,s=this._z,o=this._w,a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-n)*h)/l,u=Math.sin(n*h)/l;return this._w=o*d+this._w*u,this._x=i*d+this._x*u,this._y=r*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){let e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class t{constructor(e=0,n=0,i=0){t.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Rp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Rp.setFromAxisAngle(e,n))}applyMatrix3(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*i),h=2*(a*n-s*r),d=2*(s*i-o*n);return this.x=n+c*l+o*d-a*h,this.y=i+c*h+a*l-s*d,this.z=r+c*d+s*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){let i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,c=n.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){let n=e.lengthSq();if(n===0)return this.set(0,0,0);let i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Zl.copy(this).projectOnVector(e),this.sub(Zl)}reflect(e){return this.sub(Zl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(vn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){let r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){let n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Zl=new O,Rp=new _r,Wr=class{constructor(e=new O(1/0,1/0,1/0),n=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Qn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Qn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){let i=Qn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Qn):Qn.fromBufferAttribute(s,o),Qn.applyMatrix4(e.matrixWorld),this.expandByPoint(Qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Pa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Pa.copy(i.boundingBox)),Pa.applyMatrix4(e.matrixWorld),this.union(Pa)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qn),Qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Eo),La.subVectors(this.max,Eo),ms.subVectors(e.a,Eo),gs.subVectors(e.b,Eo),_s.subVectors(e.c,Eo),or.subVectors(gs,ms),ar.subVectors(_s,gs),Pr.subVectors(ms,_s);let n=[0,-or.z,or.y,0,-ar.z,ar.y,0,-Pr.z,Pr.y,or.z,0,-or.x,ar.z,0,-ar.x,Pr.z,0,-Pr.x,-or.y,or.x,0,-ar.y,ar.x,0,-Pr.y,Pr.x,0];return!Jl(n,ms,gs,_s,La)||(n=[1,0,0,0,1,0,0,0,1],!Jl(n,ms,gs,_s,La))?!1:(Da.crossVectors(or,ar),n=[Da.x,Da.y,Da.z],Jl(n,ms,gs,_s,La))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Pi=[new O,new O,new O,new O,new O,new O,new O,new O],Qn=new O,Pa=new Wr,ms=new O,gs=new O,_s=new O,or=new O,ar=new O,Pr=new O,Eo=new O,La=new O,Da=new O,Lr=new O;function Jl(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Lr.fromArray(t,s);let a=r.x*Math.abs(Lr.x)+r.y*Math.abs(Lr.y)+r.z*Math.abs(Lr.z),c=e.dot(Lr),l=n.dot(Lr),h=i.dot(Lr);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var ay=new Wr,wo=new O,jl=new O,Do=class{constructor(e=new O,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){let i=this.center;n!==void 0?i.copy(n):ay.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){let i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wo.subVectors(e,this.center);let n=wo.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(wo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(jl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wo.copy(e.center).add(jl)),this.expandByPoint(wo.copy(e.center).sub(jl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Li=new O,Ql=new O,Ua=new O,cr=new O,eh=new O,Na=new O,th=new O,hu=class{constructor(e=new O,n=new O(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Li)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let n=Li.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Li.copy(this.origin).addScaledVector(this.direction,n),Li.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Ql.copy(e).add(n).multiplyScalar(.5),Ua.copy(n).sub(e).normalize(),cr.copy(this.origin).sub(Ql);let s=e.distanceTo(n)*.5,o=-this.direction.dot(Ua),a=cr.dot(this.direction),c=-cr.dot(Ua),l=cr.lengthSq(),h=Math.abs(1-o*o),d,u,p,g;if(h>0)if(d=o*c-a,u=o*a-c,g=s*h,d>=0)if(u>=-g)if(u<=g){let v=1/h;d*=v,u*=v,p=d*(d+o*u+2*a)+u*(o*d+u+2*c)+l}else u=s,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-o*s+a)),u=d>0?-s:Math.min(Math.max(-s,-c),s),p=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-s,-c),s),p=u*(u+2*c)+l):(d=Math.max(0,-(o*s+a)),u=d>0?s:Math.min(Math.max(-s,-c),s),p=-d*d+u*(u+2*c)+l);else u=o>0?-s:s,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Ql).addScaledVector(Ua,u),p}intersectSphere(e,n){Li.subVectors(e.center,this.origin);let i=Li.dot(this.direction),r=Li.dot(Li)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){let i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){let n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,r=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,r=(e.min.x-u.x)*l),h>=0?(s=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Li)!==null}intersectTriangle(e,n,i,r,s){eh.subVectors(n,e),Na.subVectors(i,e),th.crossVectors(eh,Na);let o=this.direction.dot(th),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;cr.subVectors(this.origin,e);let c=a*this.direction.dot(Na.crossVectors(cr,Na));if(c<0)return null;let l=a*this.direction.dot(eh.cross(cr));if(l<0||c+l>o)return null;let h=-a*cr.dot(th);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},jt=class t{constructor(e,n,i,r,s,o,a,c,l,h,d,u,p,g,v,m){t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,c,l,h,d,u,p,g,v,m)}set(e,n,i,r,s,o,a,c,l,h,d,u,p,g,v,m){let f=this.elements;return f[0]=e,f[4]=n,f[8]=i,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new t().fromArray(this.elements)}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){let n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){let n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){let n=this.elements,i=e.elements,r=1/vs.setFromMatrixColumn(e,0).length(),s=1/vs.setFromMatrixColumn(e,1).length(),o=1/vs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){let n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let u=o*h,p=o*d,g=a*h,v=a*d;n[0]=c*h,n[4]=-c*d,n[8]=l,n[1]=p+g*l,n[5]=u-v*l,n[9]=-a*c,n[2]=v-u*l,n[6]=g+p*l,n[10]=o*c}else if(e.order==="YXZ"){let u=c*h,p=c*d,g=l*h,v=l*d;n[0]=u+v*a,n[4]=g*a-p,n[8]=o*l,n[1]=o*d,n[5]=o*h,n[9]=-a,n[2]=p*a-g,n[6]=v+u*a,n[10]=o*c}else if(e.order==="ZXY"){let u=c*h,p=c*d,g=l*h,v=l*d;n[0]=u-v*a,n[4]=-o*d,n[8]=g+p*a,n[1]=p+g*a,n[5]=o*h,n[9]=v-u*a,n[2]=-o*l,n[6]=a,n[10]=o*c}else if(e.order==="ZYX"){let u=o*h,p=o*d,g=a*h,v=a*d;n[0]=c*h,n[4]=g*l-p,n[8]=u*l+v,n[1]=c*d,n[5]=v*l+u,n[9]=p*l-g,n[2]=-l,n[6]=a*c,n[10]=o*c}else if(e.order==="YZX"){let u=o*c,p=o*l,g=a*c,v=a*l;n[0]=c*h,n[4]=v-u*d,n[8]=g*d+p,n[1]=d,n[5]=o*h,n[9]=-a*h,n[2]=-l*h,n[6]=p*d+g,n[10]=u-v*d}else if(e.order==="XZY"){let u=o*c,p=o*l,g=a*c,v=a*l;n[0]=c*h,n[4]=-d,n[8]=l*h,n[1]=u*d+v,n[5]=o*h,n[9]=p*d-g,n[2]=g*d-p,n[6]=a*h,n[10]=v*d+u}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cy,e,ly)}lookAt(e,n,i){let r=this.elements;return Cn.subVectors(e,n),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),lr.crossVectors(i,Cn),lr.lengthSq()===0&&(Math.abs(i.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),lr.crossVectors(i,Cn)),lr.normalize(),Fa.crossVectors(Cn,lr),r[0]=lr.x,r[4]=Fa.x,r[8]=Cn.x,r[1]=lr.y,r[5]=Fa.y,r[9]=Cn.y,r[2]=lr.z,r[6]=Fa.z,r[10]=Cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],d=i[5],u=i[9],p=i[13],g=i[2],v=i[6],m=i[10],f=i[14],S=i[3],w=i[7],M=i[11],N=i[15],T=r[0],R=r[4],L=r[8],b=r[12],y=r[1],A=r[5],G=r[9],F=r[13],z=r[2],Y=r[6],H=r[10],ee=r[14],X=r[3],se=r[7],ge=r[11],Ce=r[15];return s[0]=o*T+a*y+c*z+l*X,s[4]=o*R+a*A+c*Y+l*se,s[8]=o*L+a*G+c*H+l*ge,s[12]=o*b+a*F+c*ee+l*Ce,s[1]=h*T+d*y+u*z+p*X,s[5]=h*R+d*A+u*Y+p*se,s[9]=h*L+d*G+u*H+p*ge,s[13]=h*b+d*F+u*ee+p*Ce,s[2]=g*T+v*y+m*z+f*X,s[6]=g*R+v*A+m*Y+f*se,s[10]=g*L+v*G+m*H+f*ge,s[14]=g*b+v*F+m*ee+f*Ce,s[3]=S*T+w*y+M*z+N*X,s[7]=S*R+w*A+M*Y+N*se,s[11]=S*L+w*G+M*H+N*ge,s[15]=S*b+w*F+M*ee+N*Ce,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+s*c*d-r*l*d-s*a*u+i*l*u+r*a*p-i*c*p)+v*(+n*c*p-n*l*u+s*o*u-r*o*p+r*l*h-s*c*h)+m*(+n*l*d-n*a*p-s*o*d+i*o*p+s*a*h-i*l*h)+f*(-r*a*h-n*c*d+n*a*u+r*o*d-i*o*u+i*c*h)}transpose(){let e=this.elements,n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],S=d*m*l-v*u*l+v*c*p-a*m*p-d*c*f+a*u*f,w=g*u*l-h*m*l-g*c*p+o*m*p+h*c*f-o*u*f,M=h*v*l-g*d*l+g*a*p-o*v*p-h*a*f+o*d*f,N=g*d*c-h*v*c-g*a*u+o*v*u+h*a*m-o*d*m,T=n*S+i*w+r*M+s*N;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/T;return e[0]=S*R,e[1]=(v*u*s-d*m*s-v*r*p+i*m*p+d*r*f-i*u*f)*R,e[2]=(a*m*s-v*c*s+v*r*l-i*m*l-a*r*f+i*c*f)*R,e[3]=(d*c*s-a*u*s-d*r*l+i*u*l+a*r*p-i*c*p)*R,e[4]=w*R,e[5]=(h*m*s-g*u*s+g*r*p-n*m*p-h*r*f+n*u*f)*R,e[6]=(g*c*s-o*m*s-g*r*l+n*m*l+o*r*f-n*c*f)*R,e[7]=(o*u*s-h*c*s+h*r*l-n*u*l-o*r*p+n*c*p)*R,e[8]=M*R,e[9]=(g*d*s-h*v*s-g*i*p+n*v*p+h*i*f-n*d*f)*R,e[10]=(o*v*s-g*a*s+g*i*l-n*v*l-o*i*f+n*a*f)*R,e[11]=(h*a*s-o*d*s-h*i*l+n*d*l+o*i*p-n*a*p)*R,e[12]=N*R,e[13]=(h*v*r-g*d*r+g*i*u-n*v*u-h*i*m+n*d*m)*R,e[14]=(g*a*r-o*v*r-g*i*c+n*v*c+o*i*m-n*a*m)*R,e[15]=(o*d*r-h*a*r+h*i*c-n*d*c-o*i*u+n*a*u)*R,this}scale(e){let n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){let n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){let i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,h=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,h*a+i,h*c-r*o,0,l*c-r*a,h*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){let r=this.elements,s=n._x,o=n._y,a=n._z,c=n._w,l=s+s,h=o+o,d=a+a,u=s*l,p=s*h,g=s*d,v=o*h,m=o*d,f=a*d,S=c*l,w=c*h,M=c*d,N=i.x,T=i.y,R=i.z;return r[0]=(1-(v+f))*N,r[1]=(p+M)*N,r[2]=(g-w)*N,r[3]=0,r[4]=(p-M)*T,r[5]=(1-(u+f))*T,r[6]=(m+S)*T,r[7]=0,r[8]=(g+w)*R,r[9]=(m-S)*R,r[10]=(1-(u+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){let r=this.elements,s=vs.set(r[0],r[1],r[2]).length(),o=vs.set(r[4],r[5],r[6]).length(),a=vs.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ei.copy(this);let l=1/s,h=1/o,d=1/a;return ei.elements[0]*=l,ei.elements[1]*=l,ei.elements[2]*=l,ei.elements[4]*=h,ei.elements[5]*=h,ei.elements[6]*=h,ei.elements[8]*=d,ei.elements[9]*=d,ei.elements[10]*=d,n.setFromRotationMatrix(ei),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=Bi){let c=this.elements,l=2*s/(n-e),h=2*s/(i-r),d=(n+e)/(n-e),u=(i+r)/(i-r),p,g;if(a===Bi)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===rc)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Bi){let c=this.elements,l=1/(n-e),h=1/(i-r),d=1/(o-s),u=(n+e)*l,p=(i+r)*h,g,v;if(a===Bi)g=(o+s)*d,v=-2*d;else if(a===rc)g=s*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}},vs=new O,ei=new jt,cy=new O(0,0,0),ly=new O(1,1,1),lr=new O,Fa=new O,Cn=new O,Cp=new jt,Ip=new _r,Wi=class t{constructor(e=0,n=0,i=0,r=t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],h=r[9],d=r[2],u=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(vn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-vn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(vn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-vn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(vn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-vn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Cp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Cp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Ip.setFromEuler(this),this.setFromQuaternion(Ip,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Wi.DEFAULT_ORDER="XYZ";var ac=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},hy=0,Pp=new O,ys=new _r,Di=new jt,Oa=new O,To=new O,uy=new O,dy=new _r,Lp=new O(1,0,0),Dp=new O(0,1,0),Up=new O(0,0,1),Np={type:"added"},fy={type:"removed"},xs={type:"childadded",child:null},nh={type:"childremoved",child:null},si=class t extends gr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hy++}),this.uuid=ko(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=t.DEFAULT_UP.clone();let e=new O,n=new Wi,i=new _r,r=new O(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new jt},normalMatrix:{value:new Ge}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ac,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ys.setFromAxisAngle(e,n),this.quaternion.multiply(ys),this}rotateOnWorldAxis(e,n){return ys.setFromAxisAngle(e,n),this.quaternion.premultiply(ys),this}rotateX(e){return this.rotateOnAxis(Lp,e)}rotateY(e){return this.rotateOnAxis(Dp,e)}rotateZ(e){return this.rotateOnAxis(Up,e)}translateOnAxis(e,n){return Pp.copy(e).applyQuaternion(this.quaternion),this.position.add(Pp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Lp,e)}translateY(e){return this.translateOnAxis(Dp,e)}translateZ(e){return this.translateOnAxis(Up,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Oa.copy(e):Oa.set(e,n,i);let r=this.parent;this.updateWorldMatrix(!0,!1),To.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(To,Oa,this.up):Di.lookAt(Oa,To,this.up),this.quaternion.setFromRotationMatrix(Di),r&&(Di.extractRotation(r.matrixWorld),ys.setFromRotationMatrix(Di),this.quaternion.premultiply(ys.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Np),xs.child=e,this.dispatchEvent(xs),xs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(fy),nh.child=e,this.dispatchEvent(nh),nh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Di.multiply(e.parent.matrixWorld)),e.applyMatrix4(Di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Np),xs.child=e,this.dispatchEvent(xs),xs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,e,uy),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,dy,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){let n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];r.animations.push(s(e.animations,c))}}if(n){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}};si.DEFAULT_UP=new O(0,1,0);si.DEFAULT_MATRIX_AUTO_UPDATE=!0;si.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ti=new O,Ui=new O,ih=new O,Ni=new O,Ms=new O,bs=new O,Fp=new O,rh=new O,sh=new O,oh=new O,ah=new Vt,ch=new Vt,lh=new Vt,Br=class t{constructor(e=new O,n=new O,i=new O){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),ti.subVectors(e,n),r.cross(ti);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){ti.subVectors(r,n),Ui.subVectors(i,n),ih.subVectors(e,n);let o=ti.dot(ti),a=ti.dot(Ui),c=ti.dot(ih),l=Ui.dot(Ui),h=Ui.dot(ih),d=o*l-a*a;if(d===0)return s.set(0,0,0),null;let u=1/d,p=(l*c-a*h)*u,g=(o*h-a*c)*u;return s.set(1-p-g,g,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Ni)===null?!1:Ni.x>=0&&Ni.y>=0&&Ni.x+Ni.y<=1}static getInterpolation(e,n,i,r,s,o,a,c){return this.getBarycoord(e,n,i,r,Ni)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ni.x),c.addScaledVector(o,Ni.y),c.addScaledVector(a,Ni.z),c)}static getInterpolatedAttribute(e,n,i,r,s,o){return ah.setScalar(0),ch.setScalar(0),lh.setScalar(0),ah.fromBufferAttribute(e,n),ch.fromBufferAttribute(e,i),lh.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(ah,s.x),o.addScaledVector(ch,s.y),o.addScaledVector(lh,s.z),o}static isFrontFacing(e,n,i,r){return ti.subVectors(i,n),Ui.subVectors(e,n),ti.cross(Ui).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ti.subVectors(this.c,this.b),Ui.subVectors(this.a,this.b),ti.cross(Ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return t.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return t.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){let i=this.a,r=this.b,s=this.c,o,a;Ms.subVectors(r,i),bs.subVectors(s,i),rh.subVectors(e,i);let c=Ms.dot(rh),l=bs.dot(rh);if(c<=0&&l<=0)return n.copy(i);sh.subVectors(e,r);let h=Ms.dot(sh),d=bs.dot(sh);if(h>=0&&d<=h)return n.copy(r);let u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),n.copy(i).addScaledVector(Ms,o);oh.subVectors(e,s);let p=Ms.dot(oh),g=bs.dot(oh);if(g>=0&&p<=g)return n.copy(s);let v=p*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),n.copy(i).addScaledVector(bs,a);let m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return Fp.subVectors(s,r),a=(d-h)/(d-h+(p-g)),n.copy(r).addScaledVector(Fp,a);let f=1/(m+v+u);return o=v*f,a=u*f,n.copy(i).addScaledVector(Ms,o).addScaledVector(bs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Rm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hr={h:0,s:0,l:0},ka={h:0,s:0,l:0};function hh(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}var mt=class{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=_n){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=rt.workingColorSpace){return this.r=e,this.g=n,this.b=i,rt.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=rt.workingColorSpace){if(e=ey(e,1),n=vn(n,0,1),i=vn(i,0,1),n===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=hh(o,s,e+1/3),this.g=hh(o,s,e),this.b=hh(o,s,e-1/3)}return rt.toWorkingColorSpace(this,r),this}setStyle(e,n=_n){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=_n){let i=Rm[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Ps(e.r),this.g=Ps(e.g),this.b=Ps(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=_n){return rt.fromWorkingColorSpace(un.copy(this),e),Math.round(vn(un.r*255,0,255))*65536+Math.round(vn(un.g*255,0,255))*256+Math.round(vn(un.b*255,0,255))}getHexString(e=_n){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=rt.workingColorSpace){rt.fromWorkingColorSpace(un.copy(this),n);let i=un.r,r=un.g,s=un.b,o=Math.max(i,r,s),a=Math.min(i,r,s),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case i:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-i)/d+2;break;case s:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,n=rt.workingColorSpace){return rt.fromWorkingColorSpace(un.copy(this),n),e.r=un.r,e.g=un.g,e.b=un.b,e}getStyle(e=_n){rt.fromWorkingColorSpace(un.copy(this),e);let n=un.r,i=un.g,r=un.b;return e!==_n?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(hr),this.setHSL(hr.h+e,hr.s+n,hr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(hr),e.getHSL(ka);let i=ql(hr.h,ka.h,n),r=ql(hr.s,ka.s,n),s=ql(hr.l,ka.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},un=new mt;mt.NAMES=Rm;var py=0,ks=class extends gr{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:py++}),this.uuid=ko(),this.name="",this.blending=Cs,this.side=mr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xh,this.blendDst=Mh,this.blendEquation=kr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new mt(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let n in e){let i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Cs&&(i.blending=this.blending),this.side!==mr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==xh&&(i.blendSrc=this.blendSrc),this.blendDst!==Mh&&(i.blendDst=this.blendDst),this.blendEquation!==kr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(n){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let n=e.clippingPlanes,i=null;if(n!==null){let r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Bs=class extends ks{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wi,this.combine=pm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var qt=new O,Ba=new Mt,Gn=class{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=xp,this.updateRanges=[],this.gpuType=ki,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ba.fromBufferAttribute(this,n),Ba.applyMatrix3(e),this.setXY(n,Ba.x,Ba.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.applyMatrix3(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.applyMatrix4(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.applyNormalMatrix(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)qt.fromBufferAttribute(this,n),qt.transformDirection(e),this.setXYZ(n,qt.x,qt.y,qt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=So(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=gn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=So(n,this.array)),n}setX(e,n){return this.normalized&&(n=gn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=So(n,this.array)),n}setY(e,n){return this.normalized&&(n=gn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=So(n,this.array)),n}setZ(e,n){return this.normalized&&(n=gn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=So(n,this.array)),n}setW(e,n){return this.normalized&&(n=gn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=gn(n,this.array),i=gn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=gn(n,this.array),i=gn(i,this.array),r=gn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=gn(n,this.array),i=gn(i,this.array),r=gn(r,this.array),s=gn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xp&&(e.usage=this.usage),e}};var cc=class extends Gn{constructor(e,n,i){super(new Uint16Array(e),n,i)}};var lc=class extends Gn{constructor(e,n,i){super(new Uint32Array(e),n,i)}};var Vi=class extends Gn{constructor(e,n,i){super(new Float32Array(e),n,i)}},my=0,Hn=new jt,uh=new si,Ss=new O,In=new Wr,Ao=new Wr,sn=new O,Xr=class t extends gr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:my++}),this.uuid=ko(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Am(e)?lc:cc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Ge().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Hn.makeRotationFromQuaternion(e),this.applyMatrix4(Hn),this}rotateX(e){return Hn.makeRotationX(e),this.applyMatrix4(Hn),this}rotateY(e){return Hn.makeRotationY(e),this.applyMatrix4(Hn),this}rotateZ(e){return Hn.makeRotationZ(e),this.applyMatrix4(Hn),this}translate(e,n,i){return Hn.makeTranslation(e,n,i),this.applyMatrix4(Hn),this}scale(e,n,i){return Hn.makeScale(e,n,i),this.applyMatrix4(Hn),this}lookAt(e){return uh.lookAt(e),uh.updateMatrix(),this.applyMatrix4(uh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ss).negate(),this.translate(Ss.x,Ss.y,Ss.z),this}setFromPoints(e){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Vi(i,3))}else{for(let i=0,r=n.count;i<r;i++){let s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wr);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){let s=n[i];In.setFromBufferAttribute(s),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Do);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let i=this.boundingSphere.center;if(In.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){let a=n[s];Ao.setFromBufferAttribute(a),this.morphTargetsRelative?(sn.addVectors(In.min,Ao.min),In.expandByPoint(sn),sn.addVectors(In.max,Ao.max),In.expandByPoint(sn)):(In.expandByPoint(Ao.min),In.expandByPoint(Ao.max))}In.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)sn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(sn));if(n)for(let s=0,o=n.length;s<o;s++){let a=n[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)sn.fromBufferAttribute(a,l),c&&(Ss.fromBufferAttribute(e,l),sn.add(Ss)),r=Math.max(r,i.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Gn(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let L=0;L<i.count;L++)a[L]=new O,c[L]=new O;let l=new O,h=new O,d=new O,u=new Mt,p=new Mt,g=new Mt,v=new O,m=new O;function f(L,b,y){l.fromBufferAttribute(i,L),h.fromBufferAttribute(i,b),d.fromBufferAttribute(i,y),u.fromBufferAttribute(s,L),p.fromBufferAttribute(s,b),g.fromBufferAttribute(s,y),h.sub(l),d.sub(l),p.sub(u),g.sub(u);let A=1/(p.x*g.y-g.x*p.y);isFinite(A)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(A),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(A),a[L].add(v),a[b].add(v),a[y].add(v),c[L].add(m),c[b].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let L=0,b=S.length;L<b;++L){let y=S[L],A=y.start,G=y.count;for(let F=A,z=A+G;F<z;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let w=new O,M=new O,N=new O,T=new O;function R(L){N.fromBufferAttribute(r,L),T.copy(N);let b=a[L];w.copy(b),w.sub(N.multiplyScalar(N.dot(b))).normalize(),M.crossVectors(T,b);let A=M.dot(c[L])<0?-1:1;o.setXYZW(L,w.x,w.y,w.z,A)}for(let L=0,b=S.length;L<b;++L){let y=S[L],A=y.start,G=y.count;for(let F=A,z=A+G;F<z;F+=3)R(e.getX(F+0)),R(e.getX(F+1)),R(e.getX(F+2))}}computeVertexNormals(){let e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Gn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);let r=new O,s=new O,o=new O,a=new O,c=new O,l=new O,h=new O,d=new O;if(e)for(let u=0,p=e.count;u<p;u+=3){let g=e.getX(u+0),v=e.getX(u+1),m=e.getX(u+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,v),o.fromBufferAttribute(n,m),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),a.add(h),c.add(h),l.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,p=n.count;u<p;u+=3)r.fromBufferAttribute(n,u+0),s.fromBufferAttribute(n,u+1),o.fromBufferAttribute(n,u+2),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)sn.fromBufferAttribute(e,n),sn.normalize(),e.setXYZ(n,sn.x,sn.y,sn.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,d=a.normalized,u=new l.constructor(c.length*h),p=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?p=c[v]*a.data.stride+a.offset:p=c[v]*h;for(let f=0;f<h;f++)u[g++]=l[p++]}return new Gn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new t,i=this.index.array,r=this.attributes;for(let a in r){let c=r[a],l=e(c,i);n.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let h=0,d=l.length;h<d;h++){let u=l[h],p=e(u,i);c.push(p)}n.morphAttributes[a]=c}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let r={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){let p=l[d];h.push(p.toJSON(e.data))}h.length>0&&(r[c]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(n));let r=e.attributes;for(let l in r){let h=r[l];this.setAttribute(l,h.clone(n))}let s=e.morphAttributes;for(let l in s){let h=[],d=s[l];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(n));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Op=new jt,Dr=new hu,za=new Do,kp=new O,Va=new O,Ha=new O,Ga=new O,dh=new O,Wa=new O,Bp=new O,Xa=new O,Ln=class extends si{constructor(e=new Xr,n=new Bs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Wa.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let h=a[c],d=s[c];h!==0&&(dh.fromBufferAttribute(d,e),o?Wa.addScaledVector(dh,h):Wa.addScaledVector(dh.sub(n),h))}n.add(Wa)}return n}raycast(e,n){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),za.copy(i.boundingSphere),za.applyMatrix4(s),Dr.copy(e.ray).recast(e.near),!(za.containsPoint(Dr.origin)===!1&&(Dr.intersectSphere(za,kp)===null||Dr.origin.distanceToSquared(kp)>(e.far-e.near)**2))&&(Op.copy(s).invert(),Dr.copy(e.ray).applyMatrix4(Op),!(i.boundingBox!==null&&Dr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Dr)))}_computeIntersections(e,n,i){let r,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){let m=u[g],f=o[m.materialIndex],S=Math.max(m.start,p.start),w=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,N=w;M<N;M+=3){let T=a.getX(M),R=a.getX(M+1),L=a.getX(M+2);r=$a(this,f,e,i,l,h,d,T,R,L),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{let g=Math.max(0,p.start),v=Math.min(a.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){let S=a.getX(m),w=a.getX(m+1),M=a.getX(m+2);r=$a(this,o,e,i,l,h,d,S,w,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){let m=u[g],f=o[m.materialIndex],S=Math.max(m.start,p.start),w=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,N=w;M<N;M+=3){let T=M,R=M+1,L=M+2;r=$a(this,f,e,i,l,h,d,T,R,L),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{let g=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){let S=m,w=m+1,M=m+2;r=$a(this,o,e,i,l,h,d,S,w,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}};function gy(t,e,n,i,r,s,o,a){let c;if(e.side===yn?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side===mr,a),c===null)return null;Xa.copy(a),Xa.applyMatrix4(t.matrixWorld);let l=n.ray.origin.distanceTo(Xa);return l<n.near||l>n.far?null:{distance:l,point:Xa.clone(),object:t}}function $a(t,e,n,i,r,s,o,a,c,l){t.getVertexPosition(a,Va),t.getVertexPosition(c,Ha),t.getVertexPosition(l,Ga);let h=gy(t,e,n,i,Va,Ha,Ga,Bp);if(h){let d=new O;Br.getBarycoord(Bp,Va,Ha,Ga,d),r&&(h.uv=Br.getInterpolatedAttribute(r,a,c,l,d,new Mt)),s&&(h.uv1=Br.getInterpolatedAttribute(s,a,c,l,d,new Mt)),o&&(h.normal=Br.getInterpolatedAttribute(o,a,c,l,d,new O),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:c,c:l,normal:new O,materialIndex:0};Br.getNormal(Va,Ha,Ga,u.normal),h.face=u,h.barycoord=d}return h}var Uo=class t extends Xr{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],h=[],d=[],u=0,p=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Vi(l,3)),this.setAttribute("normal",new Vi(h,3)),this.setAttribute("uv",new Vi(d,2));function g(v,m,f,S,w,M,N,T,R,L,b){let y=M/R,A=N/L,G=M/2,F=N/2,z=T/2,Y=R+1,H=L+1,ee=0,X=0,se=new O;for(let ge=0;ge<H;ge++){let Ce=ge*A-F;for(let $e=0;$e<Y;$e++){let et=$e*y-G;se[v]=et*S,se[m]=Ce*w,se[f]=z,l.push(se.x,se.y,se.z),se[v]=0,se[m]=0,se[f]=T>0?1:-1,h.push(se.x,se.y,se.z),d.push($e/R),d.push(1-ge/L),ee+=1}}for(let ge=0;ge<L;ge++)for(let Ce=0;Ce<R;Ce++){let $e=u+Ce+Y*ge,et=u+Ce+Y*(ge+1),q=u+(Ce+1)+Y*(ge+1),j=u+(Ce+1)+Y*ge;c.push($e,et,j),c.push(et,q,j),X+=6}a.addGroup(p,X,b),p+=X,u+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function zs(t){let e={};for(let n in t){e[n]={};for(let i in t[n]){let r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function dn(t){let e={};for(let n=0;n<t.length;n++){let i=zs(t[n]);for(let r in i)e[r]=i[r]}return e}function _y(t){let e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Cm(t){let e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var vy={clone:zs,merge:dn},yy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,mi=class extends ks{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yy,this.fragmentShader=xy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zs(e.uniforms),this.uniformsGroups=_y(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}},hc=class extends si{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=Bi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ur=new O,zp=new Mt,Vp=new Mt,Pn=class extends hc{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let n=.5*this.getFilmHeight()/e;this.fov=ou*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan($l*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ou*2*Math.atan(Math.tan($l*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){ur.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ur.x,ur.y).multiplyScalar(-e/ur.z),ur.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ur.x,ur.y).multiplyScalar(-e/ur.z)}getViewSize(e,n){return this.getViewBounds(e,zp,Vp),n.subVectors(Vp,zp)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,n=e*Math.tan($l*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,n-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}},Es=-90,ws=1,uu=class extends si{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Pn(Es,ws,e,n);r.layers=this.layers,this.add(r);let s=new Pn(Es,ws,e,n);s.layers=this.layers,this.add(s);let o=new Pn(Es,ws,e,n);o.layers=this.layers,this.add(o);let a=new Pn(Es,ws,e,n);a.layers=this.layers,this.add(a);let c=new Pn(Es,ws,e,n);c.layers=this.layers,this.add(c);let l=new Pn(Es,ws,e,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,c]=n;for(let l of n)this.remove(l);if(e===Bi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===rc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of n)this.add(l),l.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,c),e.setRenderTarget(i,4,r),e.render(n,l),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(n,h),e.setRenderTarget(d,u,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},uc=class extends Dn{constructor(e,n,i,r,s,o,a,c,l,h){e=e!==void 0?e:[],n=n!==void 0?n:Us,super(e,n,i,r,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},du=class extends Gi{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new uc(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:pi}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Uo(5,5,5),s=new mi({name:"CubemapFromEquirect",uniforms:zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:yn,blending:fr});s.uniforms.tEquirect.value=n;let o=new Ln(r,s),a=n.minFilter;return n.minFilter===Hr&&(n.minFilter=pi),new uu(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}},fh=new O,My=new O,by=new Ge,Oi=class{constructor(e=new O(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){let r=fh.subVectors(i,n).cross(My.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){let i=e.delta(fh),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){let i=n||by.getNormalMatrix(e),r=this.coplanarPoint(fh).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ur=new Do,qa=new O,dc=class{constructor(e=new Oi,n=new Oi,i=new Oi,r=new Oi,s=new Oi,o=new Oi){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Bi){let i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],c=r[3],l=r[4],h=r[5],d=r[6],u=r[7],p=r[8],g=r[9],v=r[10],m=r[11],f=r[12],S=r[13],w=r[14],M=r[15];if(i[0].setComponents(c-s,u-l,m-p,M-f).normalize(),i[1].setComponents(c+s,u+l,m+p,M+f).normalize(),i[2].setComponents(c+o,u+h,m+g,M+S).normalize(),i[3].setComponents(c-o,u-h,m-g,M-S).normalize(),i[4].setComponents(c-a,u-d,m-v,M-w).normalize(),n===Bi)i[5].setComponents(c+a,u+d,m+v,M+w).normalize();else if(n===rc)i[5].setComponents(a,d,v,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ur.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ur)}intersectsSprite(e){return Ur.center.set(0,0,0),Ur.radius=.7071067811865476,Ur.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ur)}intersectsSphere(e){let n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let n=this.planes;for(let i=0;i<6;i++){let r=n[i];if(qa.x=r.normal.x>0?e.max.x:e.min.x,qa.y=r.normal.y>0?e.max.y:e.min.y,qa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(qa)<0)return!1}return!0}containsPoint(e){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Im(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function Sy(t){let e=new WeakMap;function n(a,c){let l=a.array,h=a.usage,d=l.byteLength,u=t.createBuffer();t.bindBuffer(c,u),t.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=t.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=t.SHORT;else if(l instanceof Uint32Array)p=t.UNSIGNED_INT;else if(l instanceof Int32Array)p=t.INT;else if(l instanceof Int8Array)p=t.BYTE;else if(l instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,c,l){let h=c.array,d=c.updateRanges;if(t.bindBuffer(l,a),d.length===0)t.bufferSubData(l,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){let g=d[u],v=d[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,d[u]=v)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){let v=d[p];t.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(t.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,n(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var Vs=class t extends Xr{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};let s=e/2,o=n/2,a=Math.floor(i),c=Math.floor(r),l=a+1,h=c+1,d=e/a,u=n/c,p=[],g=[],v=[],m=[];for(let f=0;f<h;f++){let S=f*u-o;for(let w=0;w<l;w++){let M=w*d-s;g.push(M,-S,0),v.push(0,0,1),m.push(w/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<a;S++){let w=S+l*f,M=S+l*(f+1),N=S+1+l*(f+1),T=S+1+l*f;p.push(w,M,T),p.push(M,N,T)}this.setIndex(p),this.setAttribute("position",new Vi(g,3)),this.setAttribute("normal",new Vi(v,3)),this.setAttribute("uv",new Vi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.widthSegments,e.heightSegments)}},Ey=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wy=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ty=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ay=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ry=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Iy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Py=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ly=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Dy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Uy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ny=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Oy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ky=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,By=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$y=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,qy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Yy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ky=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Zy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ex="gl_FragColor = linearToOutputTexel( gl_FragColor );",tx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,nx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ix=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,rx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,sx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ox=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ax=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ux=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,dx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,px=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,gx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_x=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,yx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bx=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Sx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ex=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,wx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tx=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ax=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ix=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Px=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Dx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ux=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ox=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,zx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Hx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Gx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$x=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,qx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Yx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Zx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Qx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,e2=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,t2=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,n2=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,i2=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,r2=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s2=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,o2=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,a2=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,c2=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,l2=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,h2=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,u2=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,d2=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,f2=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,p2=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,m2=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,g2=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_2=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,v2=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,y2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,x2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,M2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,b2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,S2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,E2=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T2=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,R2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,I2=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,P2=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,L2=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,D2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,U2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,F2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,O2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,k2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,z2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,H2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,G2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,W2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,X2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,q2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Y2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Z2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,j2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Q2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:Ey,alphahash_pars_fragment:wy,alphamap_fragment:Ty,alphamap_pars_fragment:Ay,alphatest_fragment:Ry,alphatest_pars_fragment:Cy,aomap_fragment:Iy,aomap_pars_fragment:Py,batching_pars_vertex:Ly,batching_vertex:Dy,begin_vertex:Uy,beginnormal_vertex:Ny,bsdfs:Fy,iridescence_fragment:Oy,bumpmap_pars_fragment:ky,clipping_planes_fragment:By,clipping_planes_pars_fragment:zy,clipping_planes_pars_vertex:Vy,clipping_planes_vertex:Hy,color_fragment:Gy,color_pars_fragment:Wy,color_pars_vertex:Xy,color_vertex:$y,common:qy,cube_uv_reflection_fragment:Yy,defaultnormal_vertex:Ky,displacementmap_pars_vertex:Zy,displacementmap_vertex:Jy,emissivemap_fragment:jy,emissivemap_pars_fragment:Qy,colorspace_fragment:ex,colorspace_pars_fragment:tx,envmap_fragment:nx,envmap_common_pars_fragment:ix,envmap_pars_fragment:rx,envmap_pars_vertex:sx,envmap_physical_pars_fragment:gx,envmap_vertex:ox,fog_vertex:ax,fog_pars_vertex:cx,fog_fragment:lx,fog_pars_fragment:hx,gradientmap_pars_fragment:ux,lightmap_pars_fragment:dx,lights_lambert_fragment:fx,lights_lambert_pars_fragment:px,lights_pars_begin:mx,lights_toon_fragment:_x,lights_toon_pars_fragment:vx,lights_phong_fragment:yx,lights_phong_pars_fragment:xx,lights_physical_fragment:Mx,lights_physical_pars_fragment:bx,lights_fragment_begin:Sx,lights_fragment_maps:Ex,lights_fragment_end:wx,logdepthbuf_fragment:Tx,logdepthbuf_pars_fragment:Ax,logdepthbuf_pars_vertex:Rx,logdepthbuf_vertex:Cx,map_fragment:Ix,map_pars_fragment:Px,map_particle_fragment:Lx,map_particle_pars_fragment:Dx,metalnessmap_fragment:Ux,metalnessmap_pars_fragment:Nx,morphinstance_vertex:Fx,morphcolor_vertex:Ox,morphnormal_vertex:kx,morphtarget_pars_vertex:Bx,morphtarget_vertex:zx,normal_fragment_begin:Vx,normal_fragment_maps:Hx,normal_pars_fragment:Gx,normal_pars_vertex:Wx,normal_vertex:Xx,normalmap_pars_fragment:$x,clearcoat_normal_fragment_begin:qx,clearcoat_normal_fragment_maps:Yx,clearcoat_pars_fragment:Kx,iridescence_pars_fragment:Zx,opaque_fragment:Jx,packing:jx,premultiplied_alpha_fragment:Qx,project_vertex:e2,dithering_fragment:t2,dithering_pars_fragment:n2,roughnessmap_fragment:i2,roughnessmap_pars_fragment:r2,shadowmap_pars_fragment:s2,shadowmap_pars_vertex:o2,shadowmap_vertex:a2,shadowmask_pars_fragment:c2,skinbase_vertex:l2,skinning_pars_vertex:h2,skinning_vertex:u2,skinnormal_vertex:d2,specularmap_fragment:f2,specularmap_pars_fragment:p2,tonemapping_fragment:m2,tonemapping_pars_fragment:g2,transmission_fragment:_2,transmission_pars_fragment:v2,uv_pars_fragment:y2,uv_pars_vertex:x2,uv_vertex:M2,worldpos_vertex:b2,background_vert:S2,background_frag:E2,backgroundCube_vert:w2,backgroundCube_frag:T2,cube_vert:A2,cube_frag:R2,depth_vert:C2,depth_frag:I2,distanceRGBA_vert:P2,distanceRGBA_frag:L2,equirect_vert:D2,equirect_frag:U2,linedashed_vert:N2,linedashed_frag:F2,meshbasic_vert:O2,meshbasic_frag:k2,meshlambert_vert:B2,meshlambert_frag:z2,meshmatcap_vert:V2,meshmatcap_frag:H2,meshnormal_vert:G2,meshnormal_frag:W2,meshphong_vert:X2,meshphong_frag:$2,meshphysical_vert:q2,meshphysical_frag:Y2,meshtoon_vert:K2,meshtoon_frag:Z2,points_vert:J2,points_frag:j2,shadow_vert:Q2,shadow_frag:eM,sprite_vert:tM,sprite_frag:nM},ae={common:{diffuse:{value:new mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new mt(16777215)},opacity:{value:1},center:{value:new Mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},fi={basic:{uniforms:dn([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:dn([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new mt(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:dn([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new mt(0)},specular:{value:new mt(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:dn([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:dn([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new mt(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:dn([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:dn([ae.points,ae.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:dn([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:dn([ae.common,ae.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:dn([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:dn([ae.sprite,ae.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:dn([ae.common,ae.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:dn([ae.lights,ae.fog,{color:{value:new mt(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};fi.physical={uniforms:dn([fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new mt(0)},specularColor:{value:new mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var Ya={r:0,b:0,g:0},Nr=new Wi,iM=new jt;function rM(t,e,n,i,r,s,o){let a=new mt(0),c=s===!0?0:1,l,h,d=null,u=0,p=null;function g(S){let w=S.isScene===!0?S.background:null;return w&&w.isTexture&&(w=(S.backgroundBlurriness>0?n:e).get(w)),w}function v(S){let w=!1,M=g(S);M===null?f(a,c):M&&M.isColor&&(f(M,1),w=!0);let N=t.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,o):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||w)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(S,w){let M=g(w);M&&(M.isCubeTexture||M.mapping===yc)?(h===void 0&&(h=new Ln(new Uo(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:zs(fi.backgroundCube.uniforms),vertexShader:fi.backgroundCube.vertexShader,fragmentShader:fi.backgroundCube.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Nr.copy(w.backgroundRotation),Nr.x*=-1,Nr.y*=-1,Nr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Nr.y*=-1,Nr.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(iM.makeRotationFromEuler(Nr)),h.material.toneMapped=rt.getTransfer(M.colorSpace)!==xt,(d!==M||u!==M.version||p!==t.toneMapping)&&(h.material.needsUpdate=!0,d=M,u=M.version,p=t.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Ln(new Vs(2,2),new mi({name:"BackgroundMaterial",uniforms:zs(fi.background.uniforms),vertexShader:fi.background.vertexShader,fragmentShader:fi.background.fragmentShader,side:mr,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=rt.getTransfer(M.colorSpace)!==xt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||u!==M.version||p!==t.toneMapping)&&(l.material.needsUpdate=!0,d=M,u=M.version,p=t.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function f(S,w){S.getRGB(Ya,Cm(t)),i.buffers.color.setClear(Ya.r,Ya.g,Ya.b,w,o)}return{getClearColor:function(){return a},setClearColor:function(S,w=1){a.set(S),c=w,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,f(a,c)},render:v,addToRenderList:m}}function sM(t,e){let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=u(null),s=r,o=!1;function a(y,A,G,F,z){let Y=!1,H=d(F,G,A);s!==H&&(s=H,l(s.object)),Y=p(y,F,G,z),Y&&g(y,F,G,z),z!==null&&e.update(z,t.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,M(y,A,G,F),z!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function c(){return t.createVertexArray()}function l(y){return t.bindVertexArray(y)}function h(y){return t.deleteVertexArray(y)}function d(y,A,G){let F=G.wireframe===!0,z=i[y.id];z===void 0&&(z={},i[y.id]=z);let Y=z[A.id];Y===void 0&&(Y={},z[A.id]=Y);let H=Y[F];return H===void 0&&(H=u(c()),Y[F]=H),H}function u(y){let A=[],G=[],F=[];for(let z=0;z<n;z++)A[z]=0,G[z]=0,F[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:G,attributeDivisors:F,object:y,attributes:{},index:null}}function p(y,A,G,F){let z=s.attributes,Y=A.attributes,H=0,ee=G.getAttributes();for(let X in ee)if(ee[X].location>=0){let ge=z[X],Ce=Y[X];if(Ce===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(Ce=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(Ce=y.instanceColor)),ge===void 0||ge.attribute!==Ce||Ce&&ge.data!==Ce.data)return!0;H++}return s.attributesNum!==H||s.index!==F}function g(y,A,G,F){let z={},Y=A.attributes,H=0,ee=G.getAttributes();for(let X in ee)if(ee[X].location>=0){let ge=Y[X];ge===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(ge=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(ge=y.instanceColor));let Ce={};Ce.attribute=ge,ge&&ge.data&&(Ce.data=ge.data),z[X]=Ce,H++}s.attributes=z,s.attributesNum=H,s.index=F}function v(){let y=s.newAttributes;for(let A=0,G=y.length;A<G;A++)y[A]=0}function m(y){f(y,0)}function f(y,A){let G=s.newAttributes,F=s.enabledAttributes,z=s.attributeDivisors;G[y]=1,F[y]===0&&(t.enableVertexAttribArray(y),F[y]=1),z[y]!==A&&(t.vertexAttribDivisor(y,A),z[y]=A)}function S(){let y=s.newAttributes,A=s.enabledAttributes;for(let G=0,F=A.length;G<F;G++)A[G]!==y[G]&&(t.disableVertexAttribArray(G),A[G]=0)}function w(y,A,G,F,z,Y,H){H===!0?t.vertexAttribIPointer(y,A,G,z,Y):t.vertexAttribPointer(y,A,G,F,z,Y)}function M(y,A,G,F){v();let z=F.attributes,Y=G.getAttributes(),H=A.defaultAttributeValues;for(let ee in Y){let X=Y[ee];if(X.location>=0){let se=z[ee];if(se===void 0&&(ee==="instanceMatrix"&&y.instanceMatrix&&(se=y.instanceMatrix),ee==="instanceColor"&&y.instanceColor&&(se=y.instanceColor)),se!==void 0){let ge=se.normalized,Ce=se.itemSize,$e=e.get(se);if($e===void 0)continue;let et=$e.buffer,q=$e.type,j=$e.bytesPerElement,le=q===t.INT||q===t.UNSIGNED_INT||se.gpuType===Nu;if(se.isInterleavedBufferAttribute){let re=se.data,Me=re.stride,Fe=se.offset;if(re.isInstancedInterleavedBuffer){for(let Ve=0;Ve<X.locationSize;Ve++)f(X.location+Ve,re.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ve=0;Ve<X.locationSize;Ve++)m(X.location+Ve);t.bindBuffer(t.ARRAY_BUFFER,et);for(let Ve=0;Ve<X.locationSize;Ve++)w(X.location+Ve,Ce/X.locationSize,q,ge,Me*j,(Fe+Ce/X.locationSize*Ve)*j,le)}else{if(se.isInstancedBufferAttribute){for(let re=0;re<X.locationSize;re++)f(X.location+re,se.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let re=0;re<X.locationSize;re++)m(X.location+re);t.bindBuffer(t.ARRAY_BUFFER,et);for(let re=0;re<X.locationSize;re++)w(X.location+re,Ce/X.locationSize,q,ge,Ce*j,Ce/X.locationSize*re*j,le)}}else if(H!==void 0){let ge=H[ee];if(ge!==void 0)switch(ge.length){case 2:t.vertexAttrib2fv(X.location,ge);break;case 3:t.vertexAttrib3fv(X.location,ge);break;case 4:t.vertexAttrib4fv(X.location,ge);break;default:t.vertexAttrib1fv(X.location,ge)}}}}S()}function N(){L();for(let y in i){let A=i[y];for(let G in A){let F=A[G];for(let z in F)h(F[z].object),delete F[z];delete A[G]}delete i[y]}}function T(y){if(i[y.id]===void 0)return;let A=i[y.id];for(let G in A){let F=A[G];for(let z in F)h(F[z].object),delete F[z];delete A[G]}delete i[y.id]}function R(y){for(let A in i){let G=i[A];if(G[y.id]===void 0)continue;let F=G[y.id];for(let z in F)h(F[z].object),delete F[z];delete G[y.id]}}function L(){b(),o=!0,s!==r&&(s=r,l(s.object))}function b(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:L,resetDefaultState:b,dispose:N,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function oM(t,e,n){let i;function r(l){i=l}function s(l,h){t.drawArrays(i,l,h),n.update(h,i,1)}function o(l,h,d){d!==0&&(t.drawArraysInstanced(i,l,h,d),n.update(h,i,d))}function a(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];n.update(p,i,1)}function c(l,h,d,u){if(d===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=h[v]*u[v];n.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function aM(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==ii&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let L=R===Oo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Hi&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ki&&!L)}function c(R){if(R==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let d=n.logarithmicDepthBuffer===!0,u=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),f=t.getParameter(t.MAX_VERTEX_ATTRIBS),S=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),w=t.getParameter(t.MAX_VARYING_VECTORS),M=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),N=g>0,T=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:M,vertexTextures:N,maxSamples:T}}function cM(t){let e=this,n=null,i=0,r=!1,s=!1,o=new Oi,a=new Ge,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||i!==0||r;return r=u,i=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){n=h(d,u,0)},this.setState=function(d,u,p){let g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,f=t.get(d);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{let S=s?0:i,w=S*4,M=f.clippingState||null;c.value=M,M=h(g,u,w,p);for(let N=0;N!==w;++N)M[N]=n[N];f.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,p,g){let v=d!==null?d.length:0,m=null;if(v!==0){if(m=c.value,g!==!0||m===null){let f=p+v*4,S=u.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let w=0,M=p;w!==v;++w,M+=4)o.copy(d[w]).applyMatrix4(S,a),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function lM(t){let e=new WeakMap;function n(o,a){return a===Ch?o.mapping=Us:a===Ih&&(o.mapping=Ns),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ch||a===Ih)if(e.has(o)){let c=e.get(o).texture;return n(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new du(c.height);return l.fromEquirectangularTexture(t,o),e.set(o,l),o.addEventListener("dispose",r),n(l.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}var No=class extends hc{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+n,c=r-n;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}},As=4,Hp=[.125,.215,.35,.446,.526,.582],zr=20,ph=new No,Gp=new mt,mh=null,gh=0,_h=0,vh=!1,Or=(1+Math.sqrt(5))/2,Ts=1/Or,Wp=[new O(-Or,Ts,0),new O(Or,Ts,0),new O(-Ts,0,Or),new O(Ts,0,Or),new O(0,Or,-Ts),new O(0,Or,Ts),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],fc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){mh=this._renderer.getRenderTarget(),gh=this._renderer.getActiveCubeFace(),_h=this._renderer.getActiveMipmapLevel(),vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$p(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(mh,gh,_h),this._renderer.xr.enabled=vh,e.scissorTest=!1,Ka(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Us||e.mapping===Ns?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mh=this._renderer.getRenderTarget(),gh=this._renderer.getActiveCubeFace(),_h=this._renderer.getActiveMipmapLevel(),vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:pi,minFilter:pi,generateMipmaps:!1,type:Oo,format:ii,colorSpace:Gs,depthBuffer:!1},r=Xp(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xp(e,n,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=hM(s)),this._blurMaterial=uM(s,e,n)}return r}_compileMaterial(e){let n=new Ln(this._lodPlanes[0],e);this._renderer.compile(n,ph)}_sceneToCubeUV(e,n,i,r){let a=new Pn(90,1,n,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(Gp),h.toneMapping=pr,h.autoClear=!1;let p=new Bs({name:"PMREM.Background",side:yn,depthWrite:!1,depthTest:!1}),g=new Ln(new Uo,p),v=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(Gp),v=!0);for(let f=0;f<6;f++){let S=f%3;S===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):S===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));let w=this._cubeSize;Ka(r,S*w,f>2?w:0,w,w),h.setRenderTarget(r),v&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=m}_textureToCubeUV(e,n){let i=this._renderer,r=e.mapping===Us||e.mapping===Ns;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=qp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$p());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new Ln(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;let c=this._cubeSize;Ka(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(o,ph)}_applyPMREM(e){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Wp[(r-s-1)%Wp.length];this._blur(e,s-1,s,o,a)}n.autoClear=i}_blur(e,n,i,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Ln(this._lodPlanes[r],l),u=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*zr-1),v=s/g,m=isFinite(s)?1+Math.floor(h*v):zr;m>zr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${zr}`);let f=[],S=0;for(let R=0;R<zr;++R){let L=R/v,b=Math.exp(-L*L/2);f.push(b),R===0?S+=b:R<m&&(S+=2*b)}for(let R=0;R<f.length;R++)f[R]=f[R]/S;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:w}=this;u.dTheta.value=g,u.mipInt.value=w-i;let M=this._sizeLods[r],N=3*M*(r>w-As?r-w+As:0),T=4*(this._cubeSize-M);Ka(n,N,T,3*M,2*M),c.setRenderTarget(n),c.render(d,ph)}};function hM(t){let e=[],n=[],i=[],r=t,s=t-As+1+Hp.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);n.push(a);let c=1/a;o>t-As?c=Hp[o-t+As-1]:o===0&&(c=0),i.push(c);let l=1/(a-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,v=3,m=2,f=1,S=new Float32Array(v*g*p),w=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let T=0;T<p;T++){let R=T%3*2/3-1,L=T>2?0:-1,b=[R,L,0,R+2/3,L,0,R+2/3,L+1,0,R,L,0,R+2/3,L+1,0,R,L+1,0];S.set(b,v*g*T),w.set(u,m*g*T);let y=[T,T,T,T,T,T];M.set(y,f*g*T)}let N=new Xr;N.setAttribute("position",new Gn(S,v)),N.setAttribute("uv",new Gn(w,m)),N.setAttribute("faceIndex",new Gn(M,f)),e.push(N),r>As&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Xp(t,e,n){let i=new Gi(t,e,n);return i.texture.mapping=yc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ka(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function uM(t,e,n){let i=new Float32Array(zr),r=new O(0,1,0);return new mi({name:"SphericalGaussianBlur",defines:{n:zr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function $p(){return new mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function qp(){return new mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function Vu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function dM(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){let c=a.mapping,l=c===Ch||c===Ih,h=c===Us||c===Ns;if(l||h){let d=e.get(a),u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return n===null&&(n=new fc(t)),d=l?n.fromEquirectangular(a,d):n.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let p=a.image;return l&&p&&p.height>0||h&&p&&r(p)?(n===null&&(n=new fc(t)),d=l?n.fromEquirectangular(a):n.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function r(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function fM(t){let e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let r=n(i);return r===null&&Ro("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function pM(t,e,n,i){let r={},s=new WeakMap;function o(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);for(let g in u.morphAttributes){let v=u.morphAttributes[g];for(let m=0,f=v.length;m<f;m++)e.remove(v[m])}u.removeEventListener("dispose",o),delete r[u.id];let p=s.get(u);p&&(e.remove(p),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,n.memory.geometries--}function a(d,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,n.memory.geometries++),u}function c(d){let u=d.attributes;for(let g in u)e.update(u[g],t.ARRAY_BUFFER);let p=d.morphAttributes;for(let g in p){let v=p[g];for(let m=0,f=v.length;m<f;m++)e.update(v[m],t.ARRAY_BUFFER)}}function l(d){let u=[],p=d.index,g=d.attributes.position,v=0;if(p!==null){let S=p.array;v=p.version;for(let w=0,M=S.length;w<M;w+=3){let N=S[w+0],T=S[w+1],R=S[w+2];u.push(N,T,T,R,R,N)}}else if(g!==void 0){let S=g.array;v=g.version;for(let w=0,M=S.length/3-1;w<M;w+=3){let N=w+0,T=w+1,R=w+2;u.push(N,T,T,R,R,N)}}else return;let m=new(Am(u)?lc:cc)(u,1);m.version=v;let f=s.get(d);f&&e.remove(f),s.set(d,m)}function h(d){let u=s.get(d);if(u){let p=d.index;p!==null&&u.version<p.version&&l(d)}else l(d);return s.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function mM(t,e,n){let i;function r(u){i=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function c(u,p){t.drawElements(i,p,s,u*o),n.update(p,i,1)}function l(u,p,g){g!==0&&(t.drawElementsInstanced(i,p,s,u*o,g),n.update(p,i,g))}function h(u,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];n.update(m,i,1)}function d(u,p,g,v){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)l(u[f]/o,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,u,0,v,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S]*v[S];n.update(f,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function gM(t){let e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function _M(t,e,n){let i=new WeakMap,r=new Vt;function s(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=i.get(a);if(u===void 0||u.count!==d){let b=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],w=0;p===!0&&(w=1),g===!0&&(w=2),v===!0&&(w=3);let M=a.attributes.position.count*w,N=1;M>e.maxTextureSize&&(N=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let T=new Float32Array(M*N*4*d),R=new oc(T,M,N,d);R.type=ki,R.needsUpdate=!0;let L=w*4;for(let y=0;y<d;y++){let A=m[y],G=f[y],F=S[y],z=M*N*4*y;for(let Y=0;Y<A.count;Y++){let H=Y*L;p===!0&&(r.fromBufferAttribute(A,Y),T[z+H+0]=r.x,T[z+H+1]=r.y,T[z+H+2]=r.z,T[z+H+3]=0),g===!0&&(r.fromBufferAttribute(G,Y),T[z+H+4]=r.x,T[z+H+5]=r.y,T[z+H+6]=r.z,T[z+H+7]=0),v===!0&&(r.fromBufferAttribute(F,Y),T[z+H+8]=r.x,T[z+H+9]=r.y,T[z+H+10]=r.z,T[z+H+11]=F.itemSize===4?r.w:1)}}u={count:d,texture:R,size:new Mt(M,N)},i.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let p=0;for(let v=0;v<l.length;v++)p+=l[v];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(t,"morphTargetBaseInfluence",g),c.getUniforms().setValue(t,"morphTargetInfluences",l)}c.getUniforms().setValue(t,"morphTargetsTexture",u.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",u.size)}return{update:s}}function vM(t,e,n,i){let r=new WeakMap;function s(c){let l=i.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){let u=c.skeleton;r.get(u)!==l&&(u.update(),r.set(u,l))}return d}function o(){r=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),n.remove(l.instanceMatrix),l.instanceColor!==null&&n.remove(l.instanceColor)}return{update:s,dispose:o}}var pc=class extends Dn{constructor(e,n,i,r,s,o,a,c,l,h=Is){if(h!==Is&&h!==Os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Is&&(i=Gr),i===void 0&&h===Os&&(i=Fs),super(null,r,s,o,a,c,h,i,l),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:ri,this.minFilter=c!==void 0?c:ri,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}},Pm=new Dn,Yp=new pc(1,1),Lm=new oc,Dm=new lu,Um=new uc,Kp=[],Zp=[],Jp=new Float32Array(16),jp=new Float32Array(9),Qp=new Float32Array(4);function Ws(t,e,n){let i=t[0];if(i<=0||i>0)return t;let r=e*n,s=Kp[r];if(s===void 0&&(s=new Float32Array(r),Kp[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Qt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function en(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Mc(t,e){let n=Zp[e];n===void 0&&(n=new Int32Array(e),Zp[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function yM(t,e){let n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function xM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Qt(n,e))return;t.uniform2fv(this.addr,e),en(n,e)}}function MM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Qt(n,e))return;t.uniform3fv(this.addr,e),en(n,e)}}function bM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Qt(n,e))return;t.uniform4fv(this.addr,e),en(n,e)}}function SM(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Qt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),en(n,e)}else{if(Qt(n,i))return;Qp.set(i),t.uniformMatrix2fv(this.addr,!1,Qp),en(n,i)}}function EM(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Qt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),en(n,e)}else{if(Qt(n,i))return;jp.set(i),t.uniformMatrix3fv(this.addr,!1,jp),en(n,i)}}function wM(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Qt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),en(n,e)}else{if(Qt(n,i))return;Jp.set(i),t.uniformMatrix4fv(this.addr,!1,Jp),en(n,i)}}function TM(t,e){let n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function AM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Qt(n,e))return;t.uniform2iv(this.addr,e),en(n,e)}}function RM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Qt(n,e))return;t.uniform3iv(this.addr,e),en(n,e)}}function CM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Qt(n,e))return;t.uniform4iv(this.addr,e),en(n,e)}}function IM(t,e){let n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function PM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Qt(n,e))return;t.uniform2uiv(this.addr,e),en(n,e)}}function LM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Qt(n,e))return;t.uniform3uiv(this.addr,e),en(n,e)}}function DM(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Qt(n,e))return;t.uniform4uiv(this.addr,e),en(n,e)}}function UM(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Yp.compareFunction=Tm,s=Yp):s=Pm,n.setTexture2D(e||s,r)}function NM(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Dm,r)}function FM(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Um,r)}function OM(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Lm,r)}function kM(t){switch(t){case 5126:return yM;case 35664:return xM;case 35665:return MM;case 35666:return bM;case 35674:return SM;case 35675:return EM;case 35676:return wM;case 5124:case 35670:return TM;case 35667:case 35671:return AM;case 35668:case 35672:return RM;case 35669:case 35673:return CM;case 5125:return IM;case 36294:return PM;case 36295:return LM;case 36296:return DM;case 35678:case 36198:case 36298:case 36306:case 35682:return UM;case 35679:case 36299:case 36307:return NM;case 35680:case 36300:case 36308:case 36293:return FM;case 36289:case 36303:case 36311:case 36292:return OM}}function BM(t,e){t.uniform1fv(this.addr,e)}function zM(t,e){let n=Ws(e,this.size,2);t.uniform2fv(this.addr,n)}function VM(t,e){let n=Ws(e,this.size,3);t.uniform3fv(this.addr,n)}function HM(t,e){let n=Ws(e,this.size,4);t.uniform4fv(this.addr,n)}function GM(t,e){let n=Ws(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function WM(t,e){let n=Ws(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function XM(t,e){let n=Ws(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function $M(t,e){t.uniform1iv(this.addr,e)}function qM(t,e){t.uniform2iv(this.addr,e)}function YM(t,e){t.uniform3iv(this.addr,e)}function KM(t,e){t.uniform4iv(this.addr,e)}function ZM(t,e){t.uniform1uiv(this.addr,e)}function JM(t,e){t.uniform2uiv(this.addr,e)}function jM(t,e){t.uniform3uiv(this.addr,e)}function QM(t,e){t.uniform4uiv(this.addr,e)}function eb(t,e,n){let i=this.cache,r=e.length,s=Mc(n,r);Qt(i,s)||(t.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||Pm,s[o])}function tb(t,e,n){let i=this.cache,r=e.length,s=Mc(n,r);Qt(i,s)||(t.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||Dm,s[o])}function nb(t,e,n){let i=this.cache,r=e.length,s=Mc(n,r);Qt(i,s)||(t.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Um,s[o])}function ib(t,e,n){let i=this.cache,r=e.length,s=Mc(n,r);Qt(i,s)||(t.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Lm,s[o])}function rb(t){switch(t){case 5126:return BM;case 35664:return zM;case 35665:return VM;case 35666:return HM;case 35674:return GM;case 35675:return WM;case 35676:return XM;case 5124:case 35670:return $M;case 35667:case 35671:return qM;case 35668:case 35672:return YM;case 35669:case 35673:return KM;case 5125:return ZM;case 36294:return JM;case 36295:return jM;case 36296:return QM;case 35678:case 36198:case 36298:case 36306:case 35682:return eb;case 35679:case 36299:case 36307:return tb;case 35680:case 36300:case 36308:case 36293:return nb;case 36289:case 36303:case 36311:case 36292:return ib}}var fu=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=kM(n.type)}},pu=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=rb(n.type)}},mu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,n[a.id],i)}}},yh=/(\w+)(\])?(\[|\.)?/g;function em(t,e){t.seq.push(e),t.map[e.id]=e}function sb(t,e,n){let i=t.name,r=i.length;for(yh.lastIndex=0;;){let s=yh.exec(i),o=yh.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){em(n,l===void 0?new fu(a,t,e):new pu(a,t,e));break}else{let d=n.map[a];d===void 0&&(d=new mu(a),em(n,d)),n=d}}}var Ls=class{constructor(e,n){this.seq=[],this.map={};let i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);sb(s,o,this)}}setValue(e,n,i,r){let s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){let r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){let a=n[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,n){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in n&&i.push(o)}return i}};function tm(t,e,n){let i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}var ob=37297,ab=0;function cb(t,e){let n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}var nm=new Ge;function lb(t){rt._getMatrix(nm,rt.workingColorSpace,t);let e=`mat3( ${nm.elements.map(n=>n.toFixed(4))} )`;switch(rt.getTransfer(t)){case xc:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function im(t,e,n){let i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";let s=/ERROR: 0:(\d+)/.exec(r);if(s){let o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+cb(t.getShaderSource(e),o)}else return r}function hb(t,e){let n=lb(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function ub(t,e){let n;switch(e){case Nv:n="Linear";break;case Fv:n="Reinhard";break;case Ov:n="Cineon";break;case kv:n="ACESFilmic";break;case zv:n="AgX";break;case Vv:n="Neutral";break;case Bv:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Za=new O;function db(){rt.getLuminanceCoefficients(Za);let t=Za.x.toFixed(4),e=Za.y.toFixed(4),n=Za.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fb(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Co).join(`
`)}function pb(t){let e=[];for(let n in t){let i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function mb(t,e){let n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=t.getActiveAttrib(e,r),o=s.name,a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Co(t){return t!==""}function rm(t,e){let n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function sm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var gb=/^[ \t]*#include +<([\w\d./]+)>/gm;function gu(t){return t.replace(gb,vb)}var _b=new Map;function vb(t,e){let n=Xe[e];if(n===void 0){let i=_b.get(e);if(i!==void 0)n=Xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return gu(n)}var yb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function om(t){return t.replace(yb,xb)}function xb(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function am(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Mb(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===fm?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===pv?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===Fi&&(e="SHADOWMAP_TYPE_VSM"),e}function bb(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Us:case Ns:e="ENVMAP_TYPE_CUBE";break;case yc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Sb(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Ns:e="ENVMAP_MODE_REFRACTION";break}return e}function Eb(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case pm:e="ENVMAP_BLENDING_MULTIPLY";break;case Dv:e="ENVMAP_BLENDING_MIX";break;case Uv:e="ENVMAP_BLENDING_ADD";break}return e}function wb(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function Tb(t,e,n,i){let r=t.getContext(),s=n.defines,o=n.vertexShader,a=n.fragmentShader,c=Mb(n),l=bb(n),h=Sb(n),d=Eb(n),u=wb(n),p=fb(n),g=pb(s),v=r.createProgram(),m,f,S=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Co).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Co).join(`
`),f.length>0&&(f+=`
`)):(m=[am(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Co).join(`
`),f=[am(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==pr?"#define TONE_MAPPING":"",n.toneMapping!==pr?Xe.tonemapping_pars_fragment:"",n.toneMapping!==pr?ub("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,hb("linearToOutputTexel",n.outputColorSpace),db(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Co).join(`
`)),o=gu(o),o=rm(o,n),o=sm(o,n),a=gu(a),a=rm(a,n),a=sm(a,n),o=om(o),a=om(a),n.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",n.glslVersion===Mp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Mp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let w=S+m+o,M=S+f+a,N=tm(r,r.VERTEX_SHADER,w),T=tm(r,r.FRAGMENT_SHADER,M);r.attachShader(v,N),r.attachShader(v,T),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(A){if(t.debug.checkShaderErrors){let G=r.getProgramInfoLog(v).trim(),F=r.getShaderInfoLog(N).trim(),z=r.getShaderInfoLog(T).trim(),Y=!0,H=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(Y=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,N,T);else{let ee=im(r,N,"vertex"),X=im(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+G+`
`+ee+`
`+X)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(F===""||z==="")&&(H=!1);H&&(A.diagnostics={runnable:Y,programLog:G,vertexShader:{log:F,prefix:m},fragmentShader:{log:z,prefix:f}})}r.deleteShader(N),r.deleteShader(T),L=new Ls(r,v),b=mb(r,v)}let L;this.getUniforms=function(){return L===void 0&&R(this),L};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let y=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(v,ob)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ab++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=N,this.fragmentShader=T,this}var Ab=0,_u=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let n=this.materialCache.get(e);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let n=this.materialCache,i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){let n=this.shaderCache,i=n.get(e);return i===void 0&&(i=new vu(e),n.set(e,i)),i}},vu=class{constructor(e){this.id=Ab++,this.code=e,this.usedTimes=0}};function Rb(t,e,n,i,r,s,o){let a=new ac,c=new _u,l=new Set,h=[],d=r.logarithmicDepthBuffer,u=r.vertexTextures,p=r.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,A,G,F){let z=G.fog,Y=F.geometry,H=b.isMeshStandardMaterial?G.environment:null,ee=(b.isMeshStandardMaterial?n:e).get(b.envMap||H),X=ee&&ee.mapping===yc?ee.image.height:null,se=g[b.type];b.precision!==null&&(p=r.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let ge=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ce=ge!==void 0?ge.length:0,$e=0;Y.morphAttributes.position!==void 0&&($e=1),Y.morphAttributes.normal!==void 0&&($e=2),Y.morphAttributes.color!==void 0&&($e=3);let et,q,j,le;if(se){let dt=fi[se];et=dt.vertexShader,q=dt.fragmentShader}else et=b.vertexShader,q=b.fragmentShader,c.update(b),j=c.getVertexShaderID(b),le=c.getFragmentShaderID(b);let re=t.getRenderTarget(),Me=t.state.buffers.depth.getReversed(),Fe=F.isInstancedMesh===!0,Ve=F.isBatchedMesh===!0,vt=!!b.map,qe=!!b.matcap,bt=!!ee,I=!!b.aoMap,Ft=!!b.lightMap,Ye=!!b.bumpMap,Ke=!!b.normalMap,Pe=!!b.displacementMap,ut=!!b.emissiveMap,Ae=!!b.metalnessMap,E=!!b.roughnessMap,_=b.anisotropy>0,k=b.clearcoat>0,K=b.dispersion>0,J=b.iridescence>0,$=b.sheen>0,Se=b.transmission>0,he=_&&!!b.anisotropyMap,me=k&&!!b.clearcoatMap,Je=k&&!!b.clearcoatNormalMap,te=k&&!!b.clearcoatRoughnessMap,fe=J&&!!b.iridescenceMap,Ue=J&&!!b.iridescenceThicknessMap,Ne=$&&!!b.sheenColorMap,_e=$&&!!b.sheenRoughnessMap,Ze=!!b.specularMap,ke=!!b.specularColorMap,yt=!!b.specularIntensityMap,C=Se&&!!b.transmissionMap,ce=Se&&!!b.thicknessMap,W=!!b.gradientMap,Z=!!b.alphaMap,ue=b.alphaTest>0,oe=!!b.alphaHash,Be=!!b.extensions,Pt=pr;b.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(Pt=t.toneMapping);let Jt={shaderID:se,shaderType:b.type,shaderName:b.name,vertexShader:et,fragmentShader:q,defines:b.defines,customVertexShaderID:j,customFragmentShaderID:le,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Ve,batchingColor:Ve&&F._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&F.instanceColor!==null,instancingMorph:Fe&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:re===null?t.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Gs,alphaToCoverage:!!b.alphaToCoverage,map:vt,matcap:qe,envMap:bt,envMapMode:bt&&ee.mapping,envMapCubeUVHeight:X,aoMap:I,lightMap:Ft,bumpMap:Ye,normalMap:Ke,displacementMap:u&&Pe,emissiveMap:ut,normalMapObjectSpace:Ke&&b.normalMapType===$v,normalMapTangentSpace:Ke&&b.normalMapType===Xv,metalnessMap:Ae,roughnessMap:E,anisotropy:_,anisotropyMap:he,clearcoat:k,clearcoatMap:me,clearcoatNormalMap:Je,clearcoatRoughnessMap:te,dispersion:K,iridescence:J,iridescenceMap:fe,iridescenceThicknessMap:Ue,sheen:$,sheenColorMap:Ne,sheenRoughnessMap:_e,specularMap:Ze,specularColorMap:ke,specularIntensityMap:yt,transmission:Se,transmissionMap:C,thicknessMap:ce,gradientMap:W,opaque:b.transparent===!1&&b.blending===Cs&&b.alphaToCoverage===!1,alphaMap:Z,alphaTest:ue,alphaHash:oe,combine:b.combine,mapUv:vt&&v(b.map.channel),aoMapUv:I&&v(b.aoMap.channel),lightMapUv:Ft&&v(b.lightMap.channel),bumpMapUv:Ye&&v(b.bumpMap.channel),normalMapUv:Ke&&v(b.normalMap.channel),displacementMapUv:Pe&&v(b.displacementMap.channel),emissiveMapUv:ut&&v(b.emissiveMap.channel),metalnessMapUv:Ae&&v(b.metalnessMap.channel),roughnessMapUv:E&&v(b.roughnessMap.channel),anisotropyMapUv:he&&v(b.anisotropyMap.channel),clearcoatMapUv:me&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Je&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ue&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:_e&&v(b.sheenRoughnessMap.channel),specularMapUv:Ze&&v(b.specularMap.channel),specularColorMapUv:ke&&v(b.specularColorMap.channel),specularIntensityMapUv:yt&&v(b.specularIntensityMap.channel),transmissionMapUv:C&&v(b.transmissionMap.channel),thicknessMapUv:ce&&v(b.thicknessMap.channel),alphaMapUv:Z&&v(b.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(Ke||_),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!Y.attributes.uv&&(vt||Z),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Me,skinning:F.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:Ce,morphTextureStride:$e,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:t.shadowMap.enabled&&A.length>0,shadowMapType:t.shadowMap.type,toneMapping:Pt,decodeVideoTexture:vt&&b.map.isVideoTexture===!0&&rt.getTransfer(b.map.colorSpace)===xt,decodeVideoTextureEmissive:ut&&b.emissiveMap.isVideoTexture===!0&&rt.getTransfer(b.emissiveMap.colorSpace)===xt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ni,flipSided:b.side===yn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Be&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&b.extensions.multiDraw===!0||Ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Jt.vertexUv1s=l.has(1),Jt.vertexUv2s=l.has(2),Jt.vertexUv3s=l.has(3),l.clear(),Jt}function f(b){let y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(let A in b.defines)y.push(A),y.push(b.defines[A]);return b.isRawShaderMaterial===!1&&(S(y,b),w(y,b),y.push(t.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function S(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function w(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function M(b){let y=g[b.type],A;if(y){let G=fi[y];A=vy.clone(G.uniforms)}else A=b.uniforms;return A}function N(b,y){let A;for(let G=0,F=h.length;G<F;G++){let z=h[G];if(z.cacheKey===y){A=z,++A.usedTimes;break}}return A===void 0&&(A=new Tb(t,y,b,s),h.push(A)),A}function T(b){if(--b.usedTimes===0){let y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function R(b){c.remove(b)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:N,releaseProgram:T,releaseShaderCache:R,programs:h,dispose:L}}function Cb(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,c){t.get(o)[a]=c}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function Ib(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function cm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function lm(){let t=[],e=0,n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(d,u,p,g,v,m){let f=t[e];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:v,group:m},t[e]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=v,f.group=m),e++,f}function a(d,u,p,g,v,m){let f=o(d,u,p,g,v,m);p.transmission>0?i.push(f):p.transparent===!0?r.push(f):n.push(f)}function c(d,u,p,g,v,m){let f=o(d,u,p,g,v,m);p.transmission>0?i.unshift(f):p.transparent===!0?r.unshift(f):n.unshift(f)}function l(d,u){n.length>1&&n.sort(d||Ib),i.length>1&&i.sort(u||cm),r.length>1&&r.sort(u||cm)}function h(){for(let d=e,u=t.length;d<u;d++){let p=t[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:h,sort:l}}function Pb(){let t=new WeakMap;function e(i,r){let s=t.get(i),o;return s===void 0?(o=new lm,t.set(i,[o])):r>=s.length?(o=new lm,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function Lb(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new O,color:new mt};break;case"SpotLight":n={position:new O,direction:new O,color:new mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new O,color:new mt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new O,skyColor:new mt,groundColor:new mt};break;case"RectAreaLight":n={color:new mt,position:new O,halfWidth:new O,halfHeight:new O};break}return t[e.id]=n,n}}}function Db(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}var Ub=0;function Nb(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function Fb(t){let e=new Lb,n=Db(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new O);let r=new O,s=new jt,o=new jt;function a(l){let h=0,d=0,u=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,S=0,w=0,M=0,N=0,T=0,R=0;l.sort(Nb);for(let b=0,y=l.length;b<y;b++){let A=l[b],G=A.color,F=A.intensity,z=A.distance,Y=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=G.r*F,d+=G.g*F,u+=G.b*F;else if(A.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(A.sh.coefficients[H],F);R++}else if(A.isDirectionalLight){let H=e.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let ee=A.shadow,X=n.get(A);X.shadowIntensity=ee.intensity,X.shadowBias=ee.bias,X.shadowNormalBias=ee.normalBias,X.shadowRadius=ee.radius,X.shadowMapSize=ee.mapSize,i.directionalShadow[p]=X,i.directionalShadowMap[p]=Y,i.directionalShadowMatrix[p]=A.shadow.matrix,S++}i.directional[p]=H,p++}else if(A.isSpotLight){let H=e.get(A);H.position.setFromMatrixPosition(A.matrixWorld),H.color.copy(G).multiplyScalar(F),H.distance=z,H.coneCos=Math.cos(A.angle),H.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),H.decay=A.decay,i.spot[v]=H;let ee=A.shadow;if(A.map&&(i.spotLightMap[N]=A.map,N++,ee.updateMatrices(A),A.castShadow&&T++),i.spotLightMatrix[v]=ee.matrix,A.castShadow){let X=n.get(A);X.shadowIntensity=ee.intensity,X.shadowBias=ee.bias,X.shadowNormalBias=ee.normalBias,X.shadowRadius=ee.radius,X.shadowMapSize=ee.mapSize,i.spotShadow[v]=X,i.spotShadowMap[v]=Y,M++}v++}else if(A.isRectAreaLight){let H=e.get(A);H.color.copy(G).multiplyScalar(F),H.halfWidth.set(A.width*.5,0,0),H.halfHeight.set(0,A.height*.5,0),i.rectArea[m]=H,m++}else if(A.isPointLight){let H=e.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),H.distance=A.distance,H.decay=A.decay,A.castShadow){let ee=A.shadow,X=n.get(A);X.shadowIntensity=ee.intensity,X.shadowBias=ee.bias,X.shadowNormalBias=ee.normalBias,X.shadowRadius=ee.radius,X.shadowMapSize=ee.mapSize,X.shadowCameraNear=ee.camera.near,X.shadowCameraFar=ee.camera.far,i.pointShadow[g]=X,i.pointShadowMap[g]=Y,i.pointShadowMatrix[g]=A.shadow.matrix,w++}i.point[g]=H,g++}else if(A.isHemisphereLight){let H=e.get(A);H.skyColor.copy(A.color).multiplyScalar(F),H.groundColor.copy(A.groundColor).multiplyScalar(F),i.hemi[f]=H,f++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;let L=i.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==v||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==S||L.numPointShadows!==w||L.numSpotShadows!==M||L.numSpotMaps!==N||L.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=M+N-T,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,L.directionalLength=p,L.pointLength=g,L.spotLength=v,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=S,L.numPointShadows=w,L.numSpotShadows=M,L.numSpotMaps=N,L.numLightProbes=R,i.version=Ub++)}function c(l,h){let d=0,u=0,p=0,g=0,v=0,m=h.matrixWorldInverse;for(let f=0,S=l.length;f<S;f++){let w=l[f];if(w.isDirectionalLight){let M=i.directional[d];M.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),d++}else if(w.isSpotLight){let M=i.spot[p];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),p++}else if(w.isRectAreaLight){let M=i.rectArea[g];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),o.identity(),s.copy(w.matrixWorld),s.premultiply(m),o.extractRotation(s),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(w.isPointLight){let M=i.point[u];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),u++}else if(w.isHemisphereLight){let M=i.hemi[v];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:i}}function hm(t){let e=new Fb(t),n=[],i=[];function r(h){l.camera=h,n.length=0,i.length=0}function s(h){n.push(h)}function o(h){i.push(h)}function a(){e.setup(n)}function c(h){e.setupView(n,h)}let l={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function Ob(t){let e=new WeakMap;function n(r,s=0){let o=e.get(r),a;return o===void 0?(a=new hm(t),e.set(r,[a])):s>=o.length?(a=new hm(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}var yu=class extends ks{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Gv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},xu=class extends ks{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},kb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Bb=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function zb(t,e,n){let i=new dc,r=new Mt,s=new Mt,o=new Vt,a=new yu({depthPacking:Wv}),c=new xu,l={},h=n.maxTextureSize,d={[mr]:yn,[yn]:mr,[ni]:ni},u=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Mt},radius:{value:4}},vertexShader:kb,fragmentShader:Bb}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let g=new Xr;g.setAttribute("position",new Gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Ln(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fm;let f=this.type;this.render=function(T,R,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let b=t.getRenderTarget(),y=t.getActiveCubeFace(),A=t.getActiveMipmapLevel(),G=t.state;G.setBlending(fr),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let F=f!==Fi&&this.type===Fi,z=f===Fi&&this.type!==Fi;for(let Y=0,H=T.length;Y<H;Y++){let ee=T[Y],X=ee.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);let se=X.getFrameExtents();if(r.multiply(se),s.copy(X.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/se.x),r.x=s.x*se.x,X.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/se.y),r.y=s.y*se.y,X.mapSize.y=s.y)),X.map===null||F===!0||z===!0){let Ce=this.type!==Fi?{minFilter:ri,magFilter:ri}:{};X.map!==null&&X.map.dispose(),X.map=new Gi(r.x,r.y,Ce),X.map.texture.name=ee.name+".shadowMap",X.camera.updateProjectionMatrix()}t.setRenderTarget(X.map),t.clear();let ge=X.getViewportCount();for(let Ce=0;Ce<ge;Ce++){let $e=X.getViewport(Ce);o.set(s.x*$e.x,s.y*$e.y,s.x*$e.z,s.y*$e.w),G.viewport(o),X.updateMatrices(ee,Ce),i=X.getFrustum(),M(R,L,X.camera,ee,this.type)}X.isPointLightShadow!==!0&&this.type===Fi&&S(X,L),X.needsUpdate=!1}f=this.type,m.needsUpdate=!1,t.setRenderTarget(b,y,A)};function S(T,R){let L=e.update(v);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Gi(r.x,r.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(R,null,L,u,v,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(R,null,L,p,v,null)}function w(T,R,L,b){let y=null,A=L.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(A!==void 0)y=A;else if(y=L.isPointLight===!0?c:a,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let G=y.uuid,F=R.uuid,z=l[G];z===void 0&&(z={},l[G]=z);let Y=z[F];Y===void 0&&(Y=y.clone(),z[F]=Y,R.addEventListener("dispose",N)),y=Y}if(y.visible=R.visible,y.wireframe=R.wireframe,b===Fi?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:d[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let G=t.properties.get(y);G.light=L}return y}function M(T,R,L,b,y){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Fi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,T.matrixWorld);let F=e.update(T),z=T.material;if(Array.isArray(z)){let Y=F.groups;for(let H=0,ee=Y.length;H<ee;H++){let X=Y[H],se=z[X.materialIndex];if(se&&se.visible){let ge=w(T,se,b,y);T.onBeforeShadow(t,T,R,L,F,ge,X),t.renderBufferDirect(L,null,F,ge,T,X),T.onAfterShadow(t,T,R,L,F,ge,X)}}}else if(z.visible){let Y=w(T,z,b,y);T.onBeforeShadow(t,T,R,L,F,Y,null),t.renderBufferDirect(L,null,F,Y,T,null),T.onAfterShadow(t,T,R,L,F,Y,null)}}let G=T.children;for(let F=0,z=G.length;F<z;F++)M(G[F],R,L,b,y)}function N(T){T.target.removeEventListener("dispose",N);for(let L in l){let b=l[L],y=T.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}var Vb={[bh]:Sh,[Eh]:Ah,[wh]:Rh,[Ds]:Th,[Sh]:bh,[Ah]:Eh,[Rh]:wh,[Th]:Ds};function Hb(t,e){function n(){let C=!1,ce=new Vt,W=null,Z=new Vt(0,0,0,0);return{setMask:function(ue){W!==ue&&!C&&(t.colorMask(ue,ue,ue,ue),W=ue)},setLocked:function(ue){C=ue},setClear:function(ue,oe,Be,Pt,Jt){Jt===!0&&(ue*=Pt,oe*=Pt,Be*=Pt),ce.set(ue,oe,Be,Pt),Z.equals(ce)===!1&&(t.clearColor(ue,oe,Be,Pt),Z.copy(ce))},reset:function(){C=!1,W=null,Z.set(-1,0,0,0)}}}function i(){let C=!1,ce=!1,W=null,Z=null,ue=null;return{setReversed:function(oe){if(ce!==oe){let Be=e.get("EXT_clip_control");ce?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT);let Pt=ue;ue=null,this.setClear(Pt)}ce=oe},getReversed:function(){return ce},setTest:function(oe){oe?re(t.DEPTH_TEST):Me(t.DEPTH_TEST)},setMask:function(oe){W!==oe&&!C&&(t.depthMask(oe),W=oe)},setFunc:function(oe){if(ce&&(oe=Vb[oe]),Z!==oe){switch(oe){case bh:t.depthFunc(t.NEVER);break;case Sh:t.depthFunc(t.ALWAYS);break;case Eh:t.depthFunc(t.LESS);break;case Ds:t.depthFunc(t.LEQUAL);break;case wh:t.depthFunc(t.EQUAL);break;case Th:t.depthFunc(t.GEQUAL);break;case Ah:t.depthFunc(t.GREATER);break;case Rh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Z=oe}},setLocked:function(oe){C=oe},setClear:function(oe){ue!==oe&&(ce&&(oe=1-oe),t.clearDepth(oe),ue=oe)},reset:function(){C=!1,W=null,Z=null,ue=null,ce=!1}}}function r(){let C=!1,ce=null,W=null,Z=null,ue=null,oe=null,Be=null,Pt=null,Jt=null;return{setTest:function(dt){C||(dt?re(t.STENCIL_TEST):Me(t.STENCIL_TEST))},setMask:function(dt){ce!==dt&&!C&&(t.stencilMask(dt),ce=dt)},setFunc:function(dt,Q,ye){(W!==dt||Z!==Q||ue!==ye)&&(t.stencilFunc(dt,Q,ye),W=dt,Z=Q,ue=ye)},setOp:function(dt,Q,ye){(oe!==dt||Be!==Q||Pt!==ye)&&(t.stencilOp(dt,Q,ye),oe=dt,Be=Q,Pt=ye)},setLocked:function(dt){C=dt},setClear:function(dt){Jt!==dt&&(t.clearStencil(dt),Jt=dt)},reset:function(){C=!1,ce=null,W=null,Z=null,ue=null,oe=null,Be=null,Pt=null,Jt=null}}}let s=new n,o=new i,a=new r,c=new WeakMap,l=new WeakMap,h={},d={},u=new WeakMap,p=[],g=null,v=!1,m=null,f=null,S=null,w=null,M=null,N=null,T=null,R=new mt(0,0,0),L=0,b=!1,y=null,A=null,G=null,F=null,z=null,Y=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,ee=0,X=t.getParameter(t.VERSION);X.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(X)[1]),H=ee>=1):X.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),H=ee>=2);let se=null,ge={},Ce=t.getParameter(t.SCISSOR_BOX),$e=t.getParameter(t.VIEWPORT),et=new Vt().fromArray(Ce),q=new Vt().fromArray($e);function j(C,ce,W,Z){let ue=new Uint8Array(4),oe=t.createTexture();t.bindTexture(C,oe),t.texParameteri(C,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(C,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Be=0;Be<W;Be++)C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY?t.texImage3D(ce,0,t.RGBA,1,1,Z,0,t.RGBA,t.UNSIGNED_BYTE,ue):t.texImage2D(ce+Be,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ue);return oe}let le={};le[t.TEXTURE_2D]=j(t.TEXTURE_2D,t.TEXTURE_2D,1),le[t.TEXTURE_CUBE_MAP]=j(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[t.TEXTURE_2D_ARRAY]=j(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),le[t.TEXTURE_3D]=j(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(t.DEPTH_TEST),o.setFunc(Ds),Ye(!1),Ke(dp),re(t.CULL_FACE),I(fr);function re(C){h[C]!==!0&&(t.enable(C),h[C]=!0)}function Me(C){h[C]!==!1&&(t.disable(C),h[C]=!1)}function Fe(C,ce){return d[C]!==ce?(t.bindFramebuffer(C,ce),d[C]=ce,C===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=ce),C===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=ce),!0):!1}function Ve(C,ce){let W=p,Z=!1;if(C){W=u.get(ce),W===void 0&&(W=[],u.set(ce,W));let ue=C.textures;if(W.length!==ue.length||W[0]!==t.COLOR_ATTACHMENT0){for(let oe=0,Be=ue.length;oe<Be;oe++)W[oe]=t.COLOR_ATTACHMENT0+oe;W.length=ue.length,Z=!0}}else W[0]!==t.BACK&&(W[0]=t.BACK,Z=!0);Z&&t.drawBuffers(W)}function vt(C){return g!==C?(t.useProgram(C),g=C,!0):!1}let qe={[kr]:t.FUNC_ADD,[gv]:t.FUNC_SUBTRACT,[_v]:t.FUNC_REVERSE_SUBTRACT};qe[vv]=t.MIN,qe[yv]=t.MAX;let bt={[xv]:t.ZERO,[Mv]:t.ONE,[bv]:t.SRC_COLOR,[xh]:t.SRC_ALPHA,[Rv]:t.SRC_ALPHA_SATURATE,[Tv]:t.DST_COLOR,[Ev]:t.DST_ALPHA,[Sv]:t.ONE_MINUS_SRC_COLOR,[Mh]:t.ONE_MINUS_SRC_ALPHA,[Av]:t.ONE_MINUS_DST_COLOR,[wv]:t.ONE_MINUS_DST_ALPHA,[Cv]:t.CONSTANT_COLOR,[Iv]:t.ONE_MINUS_CONSTANT_COLOR,[Pv]:t.CONSTANT_ALPHA,[Lv]:t.ONE_MINUS_CONSTANT_ALPHA};function I(C,ce,W,Z,ue,oe,Be,Pt,Jt,dt){if(C===fr){v===!0&&(Me(t.BLEND),v=!1);return}if(v===!1&&(re(t.BLEND),v=!0),C!==mv){if(C!==m||dt!==b){if((f!==kr||M!==kr)&&(t.blendEquation(t.FUNC_ADD),f=kr,M=kr),dt)switch(C){case Cs:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case fp:t.blendFunc(t.ONE,t.ONE);break;case pp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case mp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case Cs:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case fp:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case pp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case mp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}S=null,w=null,N=null,T=null,R.set(0,0,0),L=0,m=C,b=dt}return}ue=ue||ce,oe=oe||W,Be=Be||Z,(ce!==f||ue!==M)&&(t.blendEquationSeparate(qe[ce],qe[ue]),f=ce,M=ue),(W!==S||Z!==w||oe!==N||Be!==T)&&(t.blendFuncSeparate(bt[W],bt[Z],bt[oe],bt[Be]),S=W,w=Z,N=oe,T=Be),(Pt.equals(R)===!1||Jt!==L)&&(t.blendColor(Pt.r,Pt.g,Pt.b,Jt),R.copy(Pt),L=Jt),m=C,b=!1}function Ft(C,ce){C.side===ni?Me(t.CULL_FACE):re(t.CULL_FACE);let W=C.side===yn;ce&&(W=!W),Ye(W),C.blending===Cs&&C.transparent===!1?I(fr):I(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),o.setFunc(C.depthFunc),o.setTest(C.depthTest),o.setMask(C.depthWrite),s.setMask(C.colorWrite);let Z=C.stencilWrite;a.setTest(Z),Z&&(a.setMask(C.stencilWriteMask),a.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),a.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),ut(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?re(t.SAMPLE_ALPHA_TO_COVERAGE):Me(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(C){y!==C&&(C?t.frontFace(t.CW):t.frontFace(t.CCW),y=C)}function Ke(C){C!==dv?(re(t.CULL_FACE),C!==A&&(C===dp?t.cullFace(t.BACK):C===fv?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Me(t.CULL_FACE),A=C}function Pe(C){C!==G&&(H&&t.lineWidth(C),G=C)}function ut(C,ce,W){C?(re(t.POLYGON_OFFSET_FILL),(F!==ce||z!==W)&&(t.polygonOffset(ce,W),F=ce,z=W)):Me(t.POLYGON_OFFSET_FILL)}function Ae(C){C?re(t.SCISSOR_TEST):Me(t.SCISSOR_TEST)}function E(C){C===void 0&&(C=t.TEXTURE0+Y-1),se!==C&&(t.activeTexture(C),se=C)}function _(C,ce,W){W===void 0&&(se===null?W=t.TEXTURE0+Y-1:W=se);let Z=ge[W];Z===void 0&&(Z={type:void 0,texture:void 0},ge[W]=Z),(Z.type!==C||Z.texture!==ce)&&(se!==W&&(t.activeTexture(W),se=W),t.bindTexture(C,ce||le[C]),Z.type=C,Z.texture=ce)}function k(){let C=ge[se];C!==void 0&&C.type!==void 0&&(t.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function K(){try{t.compressedTexImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function J(){try{t.compressedTexImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function $(){try{t.texSubImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Se(){try{t.texSubImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function he(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function me(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Je(){try{t.texStorage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function te(){try{t.texStorage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function fe(){try{t.texImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ue(){try{t.texImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ne(C){et.equals(C)===!1&&(t.scissor(C.x,C.y,C.z,C.w),et.copy(C))}function _e(C){q.equals(C)===!1&&(t.viewport(C.x,C.y,C.z,C.w),q.copy(C))}function Ze(C,ce){let W=l.get(ce);W===void 0&&(W=new WeakMap,l.set(ce,W));let Z=W.get(C);Z===void 0&&(Z=t.getUniformBlockIndex(ce,C.name),W.set(C,Z))}function ke(C,ce){let Z=l.get(ce).get(C);c.get(ce)!==Z&&(t.uniformBlockBinding(ce,Z,C.__bindingPointIndex),c.set(ce,Z))}function yt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},se=null,ge={},d={},u=new WeakMap,p=[],g=null,v=!1,m=null,f=null,S=null,w=null,M=null,N=null,T=null,R=new mt(0,0,0),L=0,b=!1,y=null,A=null,G=null,F=null,z=null,et.set(0,0,t.canvas.width,t.canvas.height),q.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:re,disable:Me,bindFramebuffer:Fe,drawBuffers:Ve,useProgram:vt,setBlending:I,setMaterial:Ft,setFlipSided:Ye,setCullFace:Ke,setLineWidth:Pe,setPolygonOffset:ut,setScissorTest:Ae,activeTexture:E,bindTexture:_,unbindTexture:k,compressedTexImage2D:K,compressedTexImage3D:J,texImage2D:fe,texImage3D:Ue,updateUBOMapping:Ze,uniformBlockBinding:ke,texStorage2D:Je,texStorage3D:te,texSubImage2D:$,texSubImage3D:Se,compressedTexSubImage2D:he,compressedTexSubImage3D:me,scissor:Ne,viewport:_e,reset:yt}}function um(t,e,n,i){let r=Gb(i);switch(n){case ym:return t*e;case Mm:return t*e;case bm:return t*e*2;case Sm:return t*e/r.components*r.byteLength;case ku:return t*e/r.components*r.byteLength;case Em:return t*e*2/r.components*r.byteLength;case Bu:return t*e*2/r.components*r.byteLength;case xm:return t*e*3/r.components*r.byteLength;case ii:return t*e*4/r.components*r.byteLength;case zu:return t*e*4/r.components*r.byteLength;case ja:case Qa:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case ec:case tc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Uh:case Fh:return Math.max(t,16)*Math.max(e,8)/4;case Dh:case Nh:return Math.max(t,8)*Math.max(e,8)/2;case Oh:case kh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Bh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case zh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Vh:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Hh:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Gh:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Wh:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Xh:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case $h:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case qh:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Yh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Kh:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Zh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Jh:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case jh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Qh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case nc:case eu:case tu:return Math.ceil(t/4)*Math.ceil(e/4)*16;case wm:case nu:return Math.ceil(t/4)*Math.ceil(e/4)*8;case iu:case ru:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function Gb(t){switch(t){case Hi:case gm:return{byteLength:1,components:1};case Po:case _m:case Oo:return{byteLength:2,components:1};case Fu:case Ou:return{byteLength:2,components:4};case Gr:case Nu:case ki:return{byteLength:4,components:1};case vm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function Wb(t,e,n,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Mt,h=new WeakMap,d,u=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,_){return p?new OffscreenCanvas(E,_):Lo("canvas")}function v(E,_,k){let K=1,J=Ae(E);if((J.width>k||J.height>k)&&(K=k/Math.max(J.width,J.height)),K<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let $=Math.floor(K*J.width),Se=Math.floor(K*J.height);d===void 0&&(d=g($,Se));let he=_?g($,Se):d;return he.width=$,he.height=Se,he.getContext("2d").drawImage(E,0,0,$,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+$+"x"+Se+")."),he}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),E;return E}function m(E){return E.generateMipmaps}function f(E){t.generateMipmap(E)}function S(E){return E.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?t.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function w(E,_,k,K,J=!1){if(E!==null){if(t[E]!==void 0)return t[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let $=_;if(_===t.RED&&(k===t.FLOAT&&($=t.R32F),k===t.HALF_FLOAT&&($=t.R16F),k===t.UNSIGNED_BYTE&&($=t.R8)),_===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.R8UI),k===t.UNSIGNED_SHORT&&($=t.R16UI),k===t.UNSIGNED_INT&&($=t.R32UI),k===t.BYTE&&($=t.R8I),k===t.SHORT&&($=t.R16I),k===t.INT&&($=t.R32I)),_===t.RG&&(k===t.FLOAT&&($=t.RG32F),k===t.HALF_FLOAT&&($=t.RG16F),k===t.UNSIGNED_BYTE&&($=t.RG8)),_===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.RG8UI),k===t.UNSIGNED_SHORT&&($=t.RG16UI),k===t.UNSIGNED_INT&&($=t.RG32UI),k===t.BYTE&&($=t.RG8I),k===t.SHORT&&($=t.RG16I),k===t.INT&&($=t.RG32I)),_===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.RGB8UI),k===t.UNSIGNED_SHORT&&($=t.RGB16UI),k===t.UNSIGNED_INT&&($=t.RGB32UI),k===t.BYTE&&($=t.RGB8I),k===t.SHORT&&($=t.RGB16I),k===t.INT&&($=t.RGB32I)),_===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&($=t.RGBA8UI),k===t.UNSIGNED_SHORT&&($=t.RGBA16UI),k===t.UNSIGNED_INT&&($=t.RGBA32UI),k===t.BYTE&&($=t.RGBA8I),k===t.SHORT&&($=t.RGBA16I),k===t.INT&&($=t.RGBA32I)),_===t.RGB&&k===t.UNSIGNED_INT_5_9_9_9_REV&&($=t.RGB9_E5),_===t.RGBA){let Se=J?xc:rt.getTransfer(K);k===t.FLOAT&&($=t.RGBA32F),k===t.HALF_FLOAT&&($=t.RGBA16F),k===t.UNSIGNED_BYTE&&($=Se===xt?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT_4_4_4_4&&($=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&($=t.RGB5_A1)}return($===t.R16F||$===t.R32F||$===t.RG16F||$===t.RG32F||$===t.RGBA16F||$===t.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function M(E,_){let k;return E?_===null||_===Gr||_===Fs?k=t.DEPTH24_STENCIL8:_===ki?k=t.DEPTH32F_STENCIL8:_===Po&&(k=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Gr||_===Fs?k=t.DEPTH_COMPONENT24:_===ki?k=t.DEPTH_COMPONENT32F:_===Po&&(k=t.DEPTH_COMPONENT16),k}function N(E,_){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==ri&&E.minFilter!==pi?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function T(E){let _=E.target;_.removeEventListener("dispose",T),L(_),_.isVideoTexture&&h.delete(_)}function R(E){let _=E.target;_.removeEventListener("dispose",R),y(_)}function L(E){let _=i.get(E);if(_.__webglInit===void 0)return;let k=E.source,K=u.get(k);if(K){let J=K[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(E),Object.keys(K).length===0&&u.delete(k)}i.remove(E)}function b(E){let _=i.get(E);t.deleteTexture(_.__webglTexture);let k=E.source,K=u.get(k);delete K[_.__cacheKey],o.memory.textures--}function y(E){let _=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(_.__webglFramebuffer[K]))for(let J=0;J<_.__webglFramebuffer[K].length;J++)t.deleteFramebuffer(_.__webglFramebuffer[K][J]);else t.deleteFramebuffer(_.__webglFramebuffer[K]);_.__webglDepthbuffer&&t.deleteRenderbuffer(_.__webglDepthbuffer[K])}else{if(Array.isArray(_.__webglFramebuffer))for(let K=0;K<_.__webglFramebuffer.length;K++)t.deleteFramebuffer(_.__webglFramebuffer[K]);else t.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&t.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&t.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let K=0;K<_.__webglColorRenderbuffer.length;K++)_.__webglColorRenderbuffer[K]&&t.deleteRenderbuffer(_.__webglColorRenderbuffer[K]);_.__webglDepthRenderbuffer&&t.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let k=E.textures;for(let K=0,J=k.length;K<J;K++){let $=i.get(k[K]);$.__webglTexture&&(t.deleteTexture($.__webglTexture),o.memory.textures--),i.remove(k[K])}i.remove(E)}let A=0;function G(){A=0}function F(){let E=A;return E>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),A+=1,E}function z(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function Y(E,_){let k=i.get(E);if(E.isVideoTexture&&Pe(E),E.isRenderTargetTexture===!1&&E.version>0&&k.__version!==E.version){let K=E.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(k,E,_);return}}n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+_)}function H(E,_){let k=i.get(E);if(E.version>0&&k.__version!==E.version){q(k,E,_);return}n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+_)}function ee(E,_){let k=i.get(E);if(E.version>0&&k.__version!==E.version){q(k,E,_);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+_)}function X(E,_){let k=i.get(E);if(E.version>0&&k.__version!==E.version){j(k,E,_);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+_)}let se={[Ph]:t.REPEAT,[Vr]:t.CLAMP_TO_EDGE,[Lh]:t.MIRRORED_REPEAT},ge={[ri]:t.NEAREST,[Hv]:t.NEAREST_MIPMAP_NEAREST,[Ia]:t.NEAREST_MIPMAP_LINEAR,[pi]:t.LINEAR,[Wl]:t.LINEAR_MIPMAP_NEAREST,[Hr]:t.LINEAR_MIPMAP_LINEAR},Ce={[qv]:t.NEVER,[Qv]:t.ALWAYS,[Yv]:t.LESS,[Tm]:t.LEQUAL,[Kv]:t.EQUAL,[jv]:t.GEQUAL,[Zv]:t.GREATER,[Jv]:t.NOTEQUAL};function $e(E,_){if(_.type===ki&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===pi||_.magFilter===Wl||_.magFilter===Ia||_.magFilter===Hr||_.minFilter===pi||_.minFilter===Wl||_.minFilter===Ia||_.minFilter===Hr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(E,t.TEXTURE_WRAP_S,se[_.wrapS]),t.texParameteri(E,t.TEXTURE_WRAP_T,se[_.wrapT]),(E===t.TEXTURE_3D||E===t.TEXTURE_2D_ARRAY)&&t.texParameteri(E,t.TEXTURE_WRAP_R,se[_.wrapR]),t.texParameteri(E,t.TEXTURE_MAG_FILTER,ge[_.magFilter]),t.texParameteri(E,t.TEXTURE_MIN_FILTER,ge[_.minFilter]),_.compareFunction&&(t.texParameteri(E,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(E,t.TEXTURE_COMPARE_FUNC,Ce[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===ri||_.minFilter!==Ia&&_.minFilter!==Hr||_.type===ki&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(E,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function et(E,_){let k=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",T));let K=_.source,J=u.get(K);J===void 0&&(J={},u.set(K,J));let $=z(_);if($!==E.__cacheKey){J[$]===void 0&&(J[$]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,k=!0),J[$].usedTimes++;let Se=J[E.__cacheKey];Se!==void 0&&(J[E.__cacheKey].usedTimes--,Se.usedTimes===0&&b(_)),E.__cacheKey=$,E.__webglTexture=J[$].texture}return k}function q(E,_,k){let K=t.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(K=t.TEXTURE_2D_ARRAY),_.isData3DTexture&&(K=t.TEXTURE_3D);let J=et(E,_),$=_.source;n.bindTexture(K,E.__webglTexture,t.TEXTURE0+k);let Se=i.get($);if($.version!==Se.__version||J===!0){n.activeTexture(t.TEXTURE0+k);let he=rt.getPrimaries(rt.workingColorSpace),me=_.colorSpace===dr?null:rt.getPrimaries(_.colorSpace),Je=_.colorSpace===dr||he===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let te=v(_.image,!1,r.maxTextureSize);te=ut(_,te);let fe=s.convert(_.format,_.colorSpace),Ue=s.convert(_.type),Ne=w(_.internalFormat,fe,Ue,_.colorSpace,_.isVideoTexture);$e(K,_);let _e,Ze=_.mipmaps,ke=_.isVideoTexture!==!0,yt=Se.__version===void 0||J===!0,C=$.dataReady,ce=N(_,te);if(_.isDepthTexture)Ne=M(_.format===Os,_.type),yt&&(ke?n.texStorage2D(t.TEXTURE_2D,1,Ne,te.width,te.height):n.texImage2D(t.TEXTURE_2D,0,Ne,te.width,te.height,0,fe,Ue,null));else if(_.isDataTexture)if(Ze.length>0){ke&&yt&&n.texStorage2D(t.TEXTURE_2D,ce,Ne,Ze[0].width,Ze[0].height);for(let W=0,Z=Ze.length;W<Z;W++)_e=Ze[W],ke?C&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,_e.width,_e.height,fe,Ue,_e.data):n.texImage2D(t.TEXTURE_2D,W,Ne,_e.width,_e.height,0,fe,Ue,_e.data);_.generateMipmaps=!1}else ke?(yt&&n.texStorage2D(t.TEXTURE_2D,ce,Ne,te.width,te.height),C&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,te.width,te.height,fe,Ue,te.data)):n.texImage2D(t.TEXTURE_2D,0,Ne,te.width,te.height,0,fe,Ue,te.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ke&&yt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ce,Ne,Ze[0].width,Ze[0].height,te.depth);for(let W=0,Z=Ze.length;W<Z;W++)if(_e=Ze[W],_.format!==ii)if(fe!==null)if(ke){if(C)if(_.layerUpdates.size>0){let ue=um(_e.width,_e.height,_.format,_.type);for(let oe of _.layerUpdates){let Be=_e.data.subarray(oe*ue/_e.data.BYTES_PER_ELEMENT,(oe+1)*ue/_e.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,oe,_e.width,_e.height,1,fe,Be)}_.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,_e.width,_e.height,te.depth,fe,_e.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,W,Ne,_e.width,_e.height,te.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?C&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,_e.width,_e.height,te.depth,fe,Ue,_e.data):n.texImage3D(t.TEXTURE_2D_ARRAY,W,Ne,_e.width,_e.height,te.depth,0,fe,Ue,_e.data)}else{ke&&yt&&n.texStorage2D(t.TEXTURE_2D,ce,Ne,Ze[0].width,Ze[0].height);for(let W=0,Z=Ze.length;W<Z;W++)_e=Ze[W],_.format!==ii?fe!==null?ke?C&&n.compressedTexSubImage2D(t.TEXTURE_2D,W,0,0,_e.width,_e.height,fe,_e.data):n.compressedTexImage2D(t.TEXTURE_2D,W,Ne,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?C&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,_e.width,_e.height,fe,Ue,_e.data):n.texImage2D(t.TEXTURE_2D,W,Ne,_e.width,_e.height,0,fe,Ue,_e.data)}else if(_.isDataArrayTexture)if(ke){if(yt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ce,Ne,te.width,te.height,te.depth),C)if(_.layerUpdates.size>0){let W=um(te.width,te.height,_.format,_.type);for(let Z of _.layerUpdates){let ue=te.data.subarray(Z*W/te.data.BYTES_PER_ELEMENT,(Z+1)*W/te.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Z,te.width,te.height,1,fe,Ue,ue)}_.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,fe,Ue,te.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ne,te.width,te.height,te.depth,0,fe,Ue,te.data);else if(_.isData3DTexture)ke?(yt&&n.texStorage3D(t.TEXTURE_3D,ce,Ne,te.width,te.height,te.depth),C&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,fe,Ue,te.data)):n.texImage3D(t.TEXTURE_3D,0,Ne,te.width,te.height,te.depth,0,fe,Ue,te.data);else if(_.isFramebufferTexture){if(yt)if(ke)n.texStorage2D(t.TEXTURE_2D,ce,Ne,te.width,te.height);else{let W=te.width,Z=te.height;for(let ue=0;ue<ce;ue++)n.texImage2D(t.TEXTURE_2D,ue,Ne,W,Z,0,fe,Ue,null),W>>=1,Z>>=1}}else if(Ze.length>0){if(ke&&yt){let W=Ae(Ze[0]);n.texStorage2D(t.TEXTURE_2D,ce,Ne,W.width,W.height)}for(let W=0,Z=Ze.length;W<Z;W++)_e=Ze[W],ke?C&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,fe,Ue,_e):n.texImage2D(t.TEXTURE_2D,W,Ne,fe,Ue,_e);_.generateMipmaps=!1}else if(ke){if(yt){let W=Ae(te);n.texStorage2D(t.TEXTURE_2D,ce,Ne,W.width,W.height)}C&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,fe,Ue,te)}else n.texImage2D(t.TEXTURE_2D,0,Ne,fe,Ue,te);m(_)&&f(K),Se.__version=$.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function j(E,_,k){if(_.image.length!==6)return;let K=et(E,_),J=_.source;n.bindTexture(t.TEXTURE_CUBE_MAP,E.__webglTexture,t.TEXTURE0+k);let $=i.get(J);if(J.version!==$.__version||K===!0){n.activeTexture(t.TEXTURE0+k);let Se=rt.getPrimaries(rt.workingColorSpace),he=_.colorSpace===dr?null:rt.getPrimaries(_.colorSpace),me=_.colorSpace===dr||Se===he?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let Je=_.isCompressedTexture||_.image[0].isCompressedTexture,te=_.image[0]&&_.image[0].isDataTexture,fe=[];for(let Z=0;Z<6;Z++)!Je&&!te?fe[Z]=v(_.image[Z],!0,r.maxCubemapSize):fe[Z]=te?_.image[Z].image:_.image[Z],fe[Z]=ut(_,fe[Z]);let Ue=fe[0],Ne=s.convert(_.format,_.colorSpace),_e=s.convert(_.type),Ze=w(_.internalFormat,Ne,_e,_.colorSpace),ke=_.isVideoTexture!==!0,yt=$.__version===void 0||K===!0,C=J.dataReady,ce=N(_,Ue);$e(t.TEXTURE_CUBE_MAP,_);let W;if(Je){ke&&yt&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,Ze,Ue.width,Ue.height);for(let Z=0;Z<6;Z++){W=fe[Z].mipmaps;for(let ue=0;ue<W.length;ue++){let oe=W[ue];_.format!==ii?Ne!==null?ke?C&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,0,0,oe.width,oe.height,Ne,oe.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,Ze,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,0,0,oe.width,oe.height,Ne,_e,oe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,Ze,oe.width,oe.height,0,Ne,_e,oe.data)}}}else{if(W=_.mipmaps,ke&&yt){W.length>0&&ce++;let Z=Ae(fe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,Ze,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(te){ke?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,fe[Z].width,fe[Z].height,Ne,_e,fe[Z].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ze,fe[Z].width,fe[Z].height,0,Ne,_e,fe[Z].data);for(let ue=0;ue<W.length;ue++){let Be=W[ue].image[Z].image;ke?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,0,0,Be.width,Be.height,Ne,_e,Be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,Ze,Be.width,Be.height,0,Ne,_e,Be.data)}}else{ke?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ne,_e,fe[Z]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ze,Ne,_e,fe[Z]);for(let ue=0;ue<W.length;ue++){let oe=W[ue];ke?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,0,0,Ne,_e,oe.image[Z]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,Ze,Ne,_e,oe.image[Z])}}}m(_)&&f(t.TEXTURE_CUBE_MAP),$.__version=J.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function le(E,_,k,K,J,$){let Se=s.convert(k.format,k.colorSpace),he=s.convert(k.type),me=w(k.internalFormat,Se,he,k.colorSpace),Je=i.get(_),te=i.get(k);if(te.__renderTarget=_,!Je.__hasExternalTextures){let fe=Math.max(1,_.width>>$),Ue=Math.max(1,_.height>>$);J===t.TEXTURE_3D||J===t.TEXTURE_2D_ARRAY?n.texImage3D(J,$,me,fe,Ue,_.depth,0,Se,he,null):n.texImage2D(J,$,me,fe,Ue,0,Se,he,null)}n.bindFramebuffer(t.FRAMEBUFFER,E),Ke(_)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,K,J,te.__webglTexture,0,Ye(_)):(J===t.TEXTURE_2D||J>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,K,J,te.__webglTexture,$),n.bindFramebuffer(t.FRAMEBUFFER,null)}function re(E,_,k){if(t.bindRenderbuffer(t.RENDERBUFFER,E),_.depthBuffer){let K=_.depthTexture,J=K&&K.isDepthTexture?K.type:null,$=M(_.stencilBuffer,J),Se=_.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,he=Ye(_);Ke(_)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,he,$,_.width,_.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,he,$,_.width,_.height):t.renderbufferStorage(t.RENDERBUFFER,$,_.width,_.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Se,t.RENDERBUFFER,E)}else{let K=_.textures;for(let J=0;J<K.length;J++){let $=K[J],Se=s.convert($.format,$.colorSpace),he=s.convert($.type),me=w($.internalFormat,Se,he,$.colorSpace),Je=Ye(_);k&&Ke(_)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Je,me,_.width,_.height):Ke(_)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Je,me,_.width,_.height):t.renderbufferStorage(t.RENDERBUFFER,me,_.width,_.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Me(E,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=i.get(_.depthTexture);K.__renderTarget=_,(!K.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),Y(_.depthTexture,0);let J=K.__webglTexture,$=Ye(_);if(_.depthTexture.format===Is)Ke(_)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,J,0,$):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,J,0);else if(_.depthTexture.format===Os)Ke(_)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,J,0,$):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Fe(E){let _=i.get(E),k=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){let K=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),K){let J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,K.removeEventListener("dispose",J)};K.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=K}if(E.depthTexture&&!_.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Me(_.__webglFramebuffer,E)}else if(k){_.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(n.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer[K]),_.__webglDepthbuffer[K]===void 0)_.__webglDepthbuffer[K]=t.createRenderbuffer(),re(_.__webglDepthbuffer[K],E,!1);else{let J=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,$=_.__webglDepthbuffer[K];t.bindRenderbuffer(t.RENDERBUFFER,$),t.framebufferRenderbuffer(t.FRAMEBUFFER,J,t.RENDERBUFFER,$)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=t.createRenderbuffer(),re(_.__webglDepthbuffer,E,!1);else{let K=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,J=_.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,J),t.framebufferRenderbuffer(t.FRAMEBUFFER,K,t.RENDERBUFFER,J)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ve(E,_,k){let K=i.get(E);_!==void 0&&le(K.__webglFramebuffer,E,E.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&Fe(E)}function vt(E){let _=E.texture,k=i.get(E),K=i.get(_);E.addEventListener("dispose",R);let J=E.textures,$=E.isWebGLCubeRenderTarget===!0,Se=J.length>1;if(Se||(K.__webglTexture===void 0&&(K.__webglTexture=t.createTexture()),K.__version=_.version,o.memory.textures++),$){k.__webglFramebuffer=[];for(let he=0;he<6;he++)if(_.mipmaps&&_.mipmaps.length>0){k.__webglFramebuffer[he]=[];for(let me=0;me<_.mipmaps.length;me++)k.__webglFramebuffer[he][me]=t.createFramebuffer()}else k.__webglFramebuffer[he]=t.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){k.__webglFramebuffer=[];for(let he=0;he<_.mipmaps.length;he++)k.__webglFramebuffer[he]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(Se)for(let he=0,me=J.length;he<me;he++){let Je=i.get(J[he]);Je.__webglTexture===void 0&&(Je.__webglTexture=t.createTexture(),o.memory.textures++)}if(E.samples>0&&Ke(E)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let he=0;he<J.length;he++){let me=J[he];k.__webglColorRenderbuffer[he]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[he]);let Je=s.convert(me.format,me.colorSpace),te=s.convert(me.type),fe=w(me.internalFormat,Je,te,me.colorSpace,E.isXRRenderTarget===!0),Ue=Ye(E);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ue,fe,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+he,t.RENDERBUFFER,k.__webglColorRenderbuffer[he])}t.bindRenderbuffer(t.RENDERBUFFER,null),E.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),re(k.__webglDepthRenderbuffer,E,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if($){n.bindTexture(t.TEXTURE_CUBE_MAP,K.__webglTexture),$e(t.TEXTURE_CUBE_MAP,_);for(let he=0;he<6;he++)if(_.mipmaps&&_.mipmaps.length>0)for(let me=0;me<_.mipmaps.length;me++)le(k.__webglFramebuffer[he][me],E,_,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+he,me);else le(k.__webglFramebuffer[he],E,_,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(_)&&f(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Se){for(let he=0,me=J.length;he<me;he++){let Je=J[he],te=i.get(Je);n.bindTexture(t.TEXTURE_2D,te.__webglTexture),$e(t.TEXTURE_2D,Je),le(k.__webglFramebuffer,E,Je,t.COLOR_ATTACHMENT0+he,t.TEXTURE_2D,0),m(Je)&&f(t.TEXTURE_2D)}n.unbindTexture()}else{let he=t.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(he=E.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(he,K.__webglTexture),$e(he,_),_.mipmaps&&_.mipmaps.length>0)for(let me=0;me<_.mipmaps.length;me++)le(k.__webglFramebuffer[me],E,_,t.COLOR_ATTACHMENT0,he,me);else le(k.__webglFramebuffer,E,_,t.COLOR_ATTACHMENT0,he,0);m(_)&&f(he),n.unbindTexture()}E.depthBuffer&&Fe(E)}function qe(E){let _=E.textures;for(let k=0,K=_.length;k<K;k++){let J=_[k];if(m(J)){let $=S(E),Se=i.get(J).__webglTexture;n.bindTexture($,Se),f($),n.unbindTexture()}}}let bt=[],I=[];function Ft(E){if(E.samples>0){if(Ke(E)===!1){let _=E.textures,k=E.width,K=E.height,J=t.COLOR_BUFFER_BIT,$=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Se=i.get(E),he=_.length>1;if(he)for(let me=0;me<_.length;me++)n.bindFramebuffer(t.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Se.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let me=0;me<_.length;me++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(J|=t.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(J|=t.STENCIL_BUFFER_BIT)),he){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Se.__webglColorRenderbuffer[me]);let Je=i.get(_[me]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Je,0)}t.blitFramebuffer(0,0,k,K,0,0,k,K,J,t.NEAREST),c===!0&&(bt.length=0,I.length=0,bt.push(t.COLOR_ATTACHMENT0+me),E.depthBuffer&&E.resolveDepthBuffer===!1&&(bt.push($),I.push($),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,I)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,bt))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),he)for(let me=0;me<_.length;me++){n.bindFramebuffer(t.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,Se.__webglColorRenderbuffer[me]);let Je=i.get(_[me]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Se.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,Je,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&c){let _=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[_])}}}function Ye(E){return Math.min(r.maxSamples,E.samples)}function Ke(E){let _=i.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Pe(E){let _=o.render.frame;h.get(E)!==_&&(h.set(E,_),E.update())}function ut(E,_){let k=E.colorSpace,K=E.format,J=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||k!==Gs&&k!==dr&&(rt.getTransfer(k)===xt?(K!==ii||J!==Hi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),_}function Ae(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=G,this.setTexture2D=Y,this.setTexture2DArray=H,this.setTexture3D=ee,this.setTextureCube=X,this.rebindTextures=Ve,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=le,this.useMultisampledRTT=Ke}function Xb(t,e){function n(i,r=dr){let s,o=rt.getTransfer(r);if(i===Hi)return t.UNSIGNED_BYTE;if(i===Fu)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Ou)return t.UNSIGNED_SHORT_5_5_5_1;if(i===vm)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===gm)return t.BYTE;if(i===_m)return t.SHORT;if(i===Po)return t.UNSIGNED_SHORT;if(i===Nu)return t.INT;if(i===Gr)return t.UNSIGNED_INT;if(i===ki)return t.FLOAT;if(i===Oo)return t.HALF_FLOAT;if(i===ym)return t.ALPHA;if(i===xm)return t.RGB;if(i===ii)return t.RGBA;if(i===Mm)return t.LUMINANCE;if(i===bm)return t.LUMINANCE_ALPHA;if(i===Is)return t.DEPTH_COMPONENT;if(i===Os)return t.DEPTH_STENCIL;if(i===Sm)return t.RED;if(i===ku)return t.RED_INTEGER;if(i===Em)return t.RG;if(i===Bu)return t.RG_INTEGER;if(i===zu)return t.RGBA_INTEGER;if(i===ja||i===Qa||i===ec||i===tc)if(o===xt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ja)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Qa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ec)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===tc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ja)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Qa)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ec)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===tc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Dh||i===Uh||i===Nh||i===Fh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Dh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Uh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Nh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Fh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Oh||i===kh||i===Bh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Oh||i===kh)return o===xt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Bh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===zh||i===Vh||i===Hh||i===Gh||i===Wh||i===Xh||i===$h||i===qh||i===Yh||i===Kh||i===Zh||i===Jh||i===jh||i===Qh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===zh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Vh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Hh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Gh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Wh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Xh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===$h)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===qh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Yh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Kh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Zh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Jh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===jh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Qh)return o===xt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===nc||i===eu||i===tu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===nc)return o===xt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===eu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===tu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wm||i===nu||i===iu||i===ru)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===nc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===nu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===iu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ru)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}var Mu=class extends Pn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Rs=class extends si{constructor(){super(),this.isGroup=!0,this.type="Group"}},$b={type:"move"},Io=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let n=this._hand;if(n)for(let i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let v of e.hand.values()){let m=n.getJointPose(v,i),f=this._getHandJoint(l,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;l.inputState.pinching&&u>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent($b)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){let i=new Rs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}},qb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,bu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){let r=new Dn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){let n=e.cameras[0].viewport,i=new mi({vertexShader:qb,fragmentShader:Yb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Ln(new Vs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Su=class extends gr{constructor(e,n){super();let i=this,r=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,u=null,p=null,g=null,v=new bu,m=n.getContextAttributes(),f=null,S=null,w=[],M=[],N=new Mt,T=null,R=new Pn;R.viewport=new Vt;let L=new Pn;L.viewport=new Vt;let b=[R,L],y=new Mu,A=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let j=w[q];return j===void 0&&(j=new Io,w[q]=j),j.getTargetRaySpace()},this.getControllerGrip=function(q){let j=w[q];return j===void 0&&(j=new Io,w[q]=j),j.getGripSpace()},this.getHand=function(q){let j=w[q];return j===void 0&&(j=new Io,w[q]=j),j.getHandSpace()};function F(q){let j=M.indexOf(q.inputSource);if(j===-1)return;let le=w[j];le!==void 0&&(le.update(q.inputSource,q.frame,l||o),le.dispatchEvent({type:q.type,data:q.inputSource}))}function z(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",Y);for(let q=0;q<w.length;q++){let j=M[q];j!==null&&(M[q]=null,w[q].disconnect(j))}A=null,G=null,v.reset(),e.setRenderTarget(f),p=null,u=null,d=null,r=null,S=null,et.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",z),r.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await n.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(N),r.renderState.layers===void 0){let j={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,j),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Gi(p.framebufferWidth,p.framebufferHeight,{format:ii,type:Hi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let j=null,le=null,re=null;m.depth&&(re=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,j=m.stencil?Os:Is,le=m.stencil?Fs:Gr);let Me={colorFormat:n.RGBA8,depthFormat:re,scaleFactor:s};d=new XRWebGLBinding(r,n),u=d.createProjectionLayer(Me),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new Gi(u.textureWidth,u.textureHeight,{format:ii,type:Hi,depthTexture:new pc(u.textureWidth,u.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),et.setContext(r),et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function Y(q){for(let j=0;j<q.removed.length;j++){let le=q.removed[j],re=M.indexOf(le);re>=0&&(M[re]=null,w[re].disconnect(le))}for(let j=0;j<q.added.length;j++){let le=q.added[j],re=M.indexOf(le);if(re===-1){for(let Fe=0;Fe<w.length;Fe++)if(Fe>=M.length){M.push(le),re=Fe;break}else if(M[Fe]===null){M[Fe]=le,re=Fe;break}if(re===-1)break}let Me=w[re];Me&&Me.connect(le)}}let H=new O,ee=new O;function X(q,j,le){H.setFromMatrixPosition(j.matrixWorld),ee.setFromMatrixPosition(le.matrixWorld);let re=H.distanceTo(ee),Me=j.projectionMatrix.elements,Fe=le.projectionMatrix.elements,Ve=Me[14]/(Me[10]-1),vt=Me[14]/(Me[10]+1),qe=(Me[9]+1)/Me[5],bt=(Me[9]-1)/Me[5],I=(Me[8]-1)/Me[0],Ft=(Fe[8]+1)/Fe[0],Ye=Ve*I,Ke=Ve*Ft,Pe=re/(-I+Ft),ut=Pe*-I;if(j.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ut),q.translateZ(Pe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Me[10]===-1)q.projectionMatrix.copy(j.projectionMatrix),q.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let Ae=Ve+Pe,E=vt+Pe,_=Ye-ut,k=Ke+(re-ut),K=qe*vt/E*Ae,J=bt*vt/E*Ae;q.projectionMatrix.makePerspective(_,k,K,J,Ae,E),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function se(q,j){j===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(j.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let j=q.near,le=q.far;v.texture!==null&&(v.depthNear>0&&(j=v.depthNear),v.depthFar>0&&(le=v.depthFar)),y.near=L.near=R.near=j,y.far=L.far=R.far=le,(A!==y.near||G!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),A=y.near,G=y.far),R.layers.mask=q.layers.mask|2,L.layers.mask=q.layers.mask|4,y.layers.mask=R.layers.mask|L.layers.mask;let re=q.parent,Me=y.cameras;se(y,re);for(let Fe=0;Fe<Me.length;Fe++)se(Me[Fe],re);Me.length===2?X(y,R,L):y.projectionMatrix.copy(R.projectionMatrix),ge(q,y,re)};function ge(q,j,le){le===null?q.matrix.copy(j.matrixWorld):(q.matrix.copy(le.matrixWorld),q.matrix.invert(),q.matrix.multiply(j.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(j.projectionMatrix),q.projectionMatrixInverse.copy(j.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ou*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&p===null))return c},this.setFoveation=function(q){c=q,u!==null&&(u.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let Ce=null;function $e(q,j){if(h=j.getViewerPose(l||o),g=j,h!==null){let le=h.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let re=!1;le.length!==y.cameras.length&&(y.cameras.length=0,re=!0);for(let Fe=0;Fe<le.length;Fe++){let Ve=le[Fe],vt=null;if(p!==null)vt=p.getViewport(Ve);else{let bt=d.getViewSubImage(u,Ve);vt=bt.viewport,Fe===0&&(e.setRenderTargetTextures(S,bt.colorTexture,u.ignoreDepthValues?void 0:bt.depthStencilTexture),e.setRenderTarget(S))}let qe=b[Fe];qe===void 0&&(qe=new Pn,qe.layers.enable(Fe),qe.viewport=new Vt,b[Fe]=qe),qe.matrix.fromArray(Ve.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(Ve.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(vt.x,vt.y,vt.width,vt.height),Fe===0&&(y.matrix.copy(qe.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),re===!0&&y.cameras.push(qe)}let Me=r.enabledFeatures;if(Me&&Me.includes("depth-sensing")){let Fe=d.getDepthInformation(le[0]);Fe&&Fe.isValid&&Fe.texture&&v.init(e,Fe,r.renderState)}}for(let le=0;le<w.length;le++){let re=M[le],Me=w[le];re!==null&&Me!==void 0&&Me.update(re,j,l||o)}Ce&&Ce(q,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),g=null}let et=new Im;et.setAnimationLoop($e),this.setAnimationLoop=function(q){Ce=q},this.dispose=function(){}}},Fr=new Wi,Kb=new jt;function Zb(t,e){function n(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Cm(t)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,S,w,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),v(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,S,w):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,n(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,n(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===yn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,n(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===yn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,n(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,n(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let S=e.get(f),w=S.envMap,M=S.envMapRotation;w&&(m.envMap.value=w,Fr.copy(M),Fr.x*=-1,Fr.y*=-1,Fr.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Fr.y*=-1,Fr.z*=-1),m.envMapRotation.value.setFromMatrix4(Kb.makeRotationFromEuler(Fr)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,n(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,S,w){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=w*.5,f.map&&(m.map.value=f.map,n(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,n(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===yn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){let S=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Jb(t,e,n,i){let r={},s={},o=[],a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,w){let M=w.program;i.uniformBlockBinding(S,M)}function l(S,w){let M=r[S.id];M===void 0&&(g(S),M=h(S),r[S.id]=M,S.addEventListener("dispose",m));let N=w.program;i.updateUBOMapping(S,N);let T=e.render.frame;s[S.id]!==T&&(u(S),s[S.id]=T)}function h(S){let w=d();S.__bindingPointIndex=w;let M=t.createBuffer(),N=S.__size,T=S.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,N,T),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,w,M),M}function d(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){let w=r[S.id],M=S.uniforms,N=S.__cache;t.bindBuffer(t.UNIFORM_BUFFER,w);for(let T=0,R=M.length;T<R;T++){let L=Array.isArray(M[T])?M[T]:[M[T]];for(let b=0,y=L.length;b<y;b++){let A=L[b];if(p(A,T,b,N)===!0){let G=A.__offset,F=Array.isArray(A.value)?A.value:[A.value],z=0;for(let Y=0;Y<F.length;Y++){let H=F[Y],ee=v(H);typeof H=="number"||typeof H=="boolean"?(A.__data[0]=H,t.bufferSubData(t.UNIFORM_BUFFER,G+z,A.__data)):H.isMatrix3?(A.__data[0]=H.elements[0],A.__data[1]=H.elements[1],A.__data[2]=H.elements[2],A.__data[3]=0,A.__data[4]=H.elements[3],A.__data[5]=H.elements[4],A.__data[6]=H.elements[5],A.__data[7]=0,A.__data[8]=H.elements[6],A.__data[9]=H.elements[7],A.__data[10]=H.elements[8],A.__data[11]=0):(H.toArray(A.__data,z),z+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,G,A.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(S,w,M,N){let T=S.value,R=w+"_"+M;if(N[R]===void 0)return typeof T=="number"||typeof T=="boolean"?N[R]=T:N[R]=T.clone(),!0;{let L=N[R];if(typeof T=="number"||typeof T=="boolean"){if(L!==T)return N[R]=T,!0}else if(L.equals(T)===!1)return L.copy(T),!0}return!1}function g(S){let w=S.uniforms,M=0,N=16;for(let R=0,L=w.length;R<L;R++){let b=Array.isArray(w[R])?w[R]:[w[R]];for(let y=0,A=b.length;y<A;y++){let G=b[y],F=Array.isArray(G.value)?G.value:[G.value];for(let z=0,Y=F.length;z<Y;z++){let H=F[z],ee=v(H),X=M%N,se=X%ee.boundary,ge=X+se;M+=se,ge!==0&&N-ge<ee.storage&&(M+=N-ge),G.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=ee.storage}}}let T=M%N;return T>0&&(M+=N-T),S.__size=M,S.__cache={},this}function v(S){let w={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(w.boundary=4,w.storage=4):S.isVector2?(w.boundary=8,w.storage=8):S.isVector3||S.isColor?(w.boundary=16,w.storage=12):S.isVector4?(w.boundary=16,w.storage=16):S.isMatrix3?(w.boundary=48,w.storage=48):S.isMatrix4?(w.boundary=64,w.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),w}function m(S){let w=S.target;w.removeEventListener("dispose",m);let M=o.indexOf(w.__bindingPointIndex);o.splice(M,1),t.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function f(){for(let S in r)t.deleteBuffer(r[S]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}var mc=class{constructor(e={}){let{canvas:n=ty(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),v=new Int32Array(4),m=null,f=null,S=[],w=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=_n,this.toneMapping=pr,this.toneMappingExposure=1;let M=this,N=!1,T=0,R=0,L=null,b=-1,y=null,A=new Vt,G=new Vt,F=null,z=new mt(0),Y=0,H=n.width,ee=n.height,X=1,se=null,ge=null,Ce=new Vt(0,0,H,ee),$e=new Vt(0,0,H,ee),et=!1,q=new dc,j=!1,le=!1,re=new jt,Me=new jt,Fe=new O,Ve=new Vt,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qe=!1;function bt(){return L===null?X:1}let I=i;function Ft(x,D){return n.getContext(x,D)}try{let x={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Uu}`),n.addEventListener("webglcontextlost",Z,!1),n.addEventListener("webglcontextrestored",ue,!1),n.addEventListener("webglcontextcreationerror",oe,!1),I===null){let D="webgl2";if(I=Ft(D,x),I===null)throw Ft(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Ye,Ke,Pe,ut,Ae,E,_,k,K,J,$,Se,he,me,Je,te,fe,Ue,Ne,_e,Ze,ke,yt,C;function ce(){Ye=new fM(I),Ye.init(),ke=new Xb(I,Ye),Ke=new aM(I,Ye,e,ke),Pe=new Hb(I,Ye),Ke.reverseDepthBuffer&&u&&Pe.buffers.depth.setReversed(!0),ut=new gM(I),Ae=new Cb,E=new Wb(I,Ye,Pe,Ae,Ke,ke,ut),_=new lM(M),k=new dM(M),K=new Sy(I),yt=new sM(I,K),J=new pM(I,K,ut,yt),$=new vM(I,J,K,ut),Ne=new _M(I,Ke,E),te=new cM(Ae),Se=new Rb(M,_,k,Ye,Ke,yt,te),he=new Zb(M,Ae),me=new Pb,Je=new Ob(Ye),Ue=new rM(M,_,k,Pe,$,p,c),fe=new zb(M,$,Ke),C=new Jb(I,ut,Ke,Pe),_e=new oM(I,Ye,ut),Ze=new mM(I,Ye,ut),ut.programs=Se.programs,M.capabilities=Ke,M.extensions=Ye,M.properties=Ae,M.renderLists=me,M.shadowMap=fe,M.state=Pe,M.info=ut}ce();let W=new Su(M,I);this.xr=W,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let x=Ye.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=Ye.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(x){x!==void 0&&(X=x,this.setSize(H,ee,!1))},this.getSize=function(x){return x.set(H,ee)},this.setSize=function(x,D,B=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=x,ee=D,n.width=Math.floor(x*X),n.height=Math.floor(D*X),B===!0&&(n.style.width=x+"px",n.style.height=D+"px"),this.setViewport(0,0,x,D)},this.getDrawingBufferSize=function(x){return x.set(H*X,ee*X).floor()},this.setDrawingBufferSize=function(x,D,B){H=x,ee=D,X=B,n.width=Math.floor(x*B),n.height=Math.floor(D*B),this.setViewport(0,0,x,D)},this.getCurrentViewport=function(x){return x.copy(A)},this.getViewport=function(x){return x.copy(Ce)},this.setViewport=function(x,D,B,V){x.isVector4?Ce.set(x.x,x.y,x.z,x.w):Ce.set(x,D,B,V),Pe.viewport(A.copy(Ce).multiplyScalar(X).round())},this.getScissor=function(x){return x.copy($e)},this.setScissor=function(x,D,B,V){x.isVector4?$e.set(x.x,x.y,x.z,x.w):$e.set(x,D,B,V),Pe.scissor(G.copy($e).multiplyScalar(X).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(x){Pe.setScissorTest(et=x)},this.setOpaqueSort=function(x){se=x},this.setTransparentSort=function(x){ge=x},this.getClearColor=function(x){return x.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor.apply(Ue,arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha.apply(Ue,arguments)},this.clear=function(x=!0,D=!0,B=!0){let V=0;if(x){let U=!1;if(L!==null){let ne=L.texture.format;U=ne===zu||ne===Bu||ne===ku}if(U){let ne=L.texture.type,pe=ne===Hi||ne===Gr||ne===Po||ne===Fs||ne===Fu||ne===Ou,Ee=Ue.getClearColor(),we=Ue.getClearAlpha(),Oe=Ee.r,He=Ee.g,Te=Ee.b;pe?(g[0]=Oe,g[1]=He,g[2]=Te,g[3]=we,I.clearBufferuiv(I.COLOR,0,g)):(v[0]=Oe,v[1]=He,v[2]=Te,v[3]=we,I.clearBufferiv(I.COLOR,0,v))}else V|=I.COLOR_BUFFER_BIT}D&&(V|=I.DEPTH_BUFFER_BIT),B&&(V|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Z,!1),n.removeEventListener("webglcontextrestored",ue,!1),n.removeEventListener("webglcontextcreationerror",oe,!1),me.dispose(),Je.dispose(),Ae.dispose(),_.dispose(),k.dispose(),$.dispose(),yt.dispose(),C.dispose(),Se.dispose(),W.dispose(),W.removeEventListener("sessionstart",je),W.removeEventListener("sessionend",Tt),Ot.stop()};function Z(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;let x=ut.autoReset,D=fe.enabled,B=fe.autoUpdate,V=fe.needsUpdate,U=fe.type;ce(),ut.autoReset=x,fe.enabled=D,fe.autoUpdate=B,fe.needsUpdate=V,fe.type=U}function oe(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function Be(x){let D=x.target;D.removeEventListener("dispose",Be),Pt(D)}function Pt(x){Jt(x),Ae.remove(x)}function Jt(x){let D=Ae.get(x).programs;D!==void 0&&(D.forEach(function(B){Se.releaseProgram(B)}),x.isShaderMaterial&&Se.releaseShaderCache(x))}this.renderBufferDirect=function(x,D,B,V,U,ne){D===null&&(D=vt);let pe=U.isMesh&&U.matrixWorld.determinant()<0,Ee=$1(x,D,B,V,U);Pe.setMaterial(V,pe);let we=B.index,Oe=1;if(V.wireframe===!0){if(we=J.getWireframeAttribute(B),we===void 0)return;Oe=2}let He=B.drawRange,Te=B.attributes.position,at=He.start*Oe,St=(He.start+He.count)*Oe;ne!==null&&(at=Math.max(at,ne.start*Oe),St=Math.min(St,(ne.start+ne.count)*Oe)),we!==null?(at=Math.max(at,0),St=Math.min(St,we.count)):Te!=null&&(at=Math.max(at,0),St=Math.min(St,Te.count));let At=St-at;if(At<0||At===1/0)return;yt.setup(U,V,Ee,B,we);let mn,ft=_e;if(we!==null&&(mn=K.get(we),ft=Ze,ft.setIndex(mn)),U.isMesh)V.wireframe===!0?(Pe.setLineWidth(V.wireframeLinewidth*bt()),ft.setMode(I.LINES)):ft.setMode(I.TRIANGLES);else if(U.isLine){let Ie=V.linewidth;Ie===void 0&&(Ie=1),Pe.setLineWidth(Ie*bt()),U.isLineSegments?ft.setMode(I.LINES):U.isLineLoop?ft.setMode(I.LINE_LOOP):ft.setMode(I.LINE_STRIP)}else U.isPoints?ft.setMode(I.POINTS):U.isSprite&&ft.setMode(I.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)ft.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ye.get("WEBGL_multi_draw"))ft.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Ie=U._multiDrawStarts,Ci=U._multiDrawCounts,pt=U._multiDrawCount,Jn=we?K.get(we).bytesPerElement:1,ds=Ae.get(V).currentProgram.getUniforms();for(let Rn=0;Rn<pt;Rn++)ds.setValue(I,"_gl_DrawID",Rn),ft.render(Ie[Rn]/Jn,Ci[Rn])}else if(U.isInstancedMesh)ft.renderInstances(at,At,U.count);else if(B.isInstancedBufferGeometry){let Ie=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Ci=Math.min(B.instanceCount,Ie);ft.renderInstances(at,At,Ci)}else ft.render(at,At)};function dt(x,D,B){x.transparent===!0&&x.side===ni&&x.forceSinglePass===!1?(x.side=yn,x.needsUpdate=!0,ga(x,D,B),x.side=mr,x.needsUpdate=!0,ga(x,D,B),x.side=ni):ga(x,D,B)}this.compile=function(x,D,B=null){B===null&&(B=x),f=Je.get(B),f.init(D),w.push(f),B.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(f.pushLight(U),U.castShadow&&f.pushShadow(U))}),x!==B&&x.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(f.pushLight(U),U.castShadow&&f.pushShadow(U))}),f.setupLights();let V=new Set;return x.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let ne=U.material;if(ne)if(Array.isArray(ne))for(let pe=0;pe<ne.length;pe++){let Ee=ne[pe];dt(Ee,B,U),V.add(Ee)}else dt(ne,B,U),V.add(ne)}),w.pop(),f=null,V},this.compileAsync=function(x,D,B=null){let V=this.compile(x,D,B);return new Promise(U=>{function ne(){if(V.forEach(function(pe){Ae.get(pe).currentProgram.isReady()&&V.delete(pe)}),V.size===0){U(x);return}setTimeout(ne,10)}Ye.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let Q=null;function ye(x){Q&&Q(x)}function je(){Ot.stop()}function Tt(){Ot.start()}let Ot=new Im;Ot.setAnimationLoop(ye),typeof self<"u"&&Ot.setContext(self),this.setAnimationLoop=function(x){Q=x,W.setAnimationLoop(x),x===null?Ot.stop():Ot.start()},W.addEventListener("sessionstart",je),W.addEventListener("sessionend",Tt),this.render=function(x,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(D),D=W.getCamera()),x.isScene===!0&&x.onBeforeRender(M,x,D,L),f=Je.get(x,w.length),f.init(D),w.push(f),Me.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),q.setFromProjectionMatrix(Me),le=this.localClippingEnabled,j=te.init(this.clippingPlanes,le),m=me.get(x,S.length),m.init(),S.push(m),W.enabled===!0&&W.isPresenting===!0){let ne=M.xr.getDepthSensingMesh();ne!==null&&An(ne,D,-1/0,M.sortObjects)}An(x,D,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(se,ge),qe=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,qe&&Ue.addToRenderList(m,x),this.info.render.frame++,j===!0&&te.beginShadows();let B=f.state.shadowsArray;fe.render(B,x,D),j===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();let V=m.opaque,U=m.transmissive;if(f.setupLights(),D.isArrayCamera){let ne=D.cameras;if(U.length>0)for(let pe=0,Ee=ne.length;pe<Ee;pe++){let we=ne[pe];rn(V,U,x,we)}qe&&Ue.render(x);for(let pe=0,Ee=ne.length;pe<Ee;pe++){let we=ne[pe];Ri(m,x,we,we.viewport)}}else U.length>0&&rn(V,U,x,D),qe&&Ue.render(x),Ri(m,x,D);L!==null&&(E.updateMultisampleRenderTarget(L),E.updateRenderTargetMipmap(L)),x.isScene===!0&&x.onAfterRender(M,x,D),yt.resetDefaultState(),b=-1,y=null,w.pop(),w.length>0?(f=w[w.length-1],j===!0&&te.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function An(x,D,B,V){if(x.visible===!1)return;if(x.layers.test(D.layers)){if(x.isGroup)B=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(D);else if(x.isLight)f.pushLight(x),x.castShadow&&f.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||q.intersectsSprite(x)){V&&Ve.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Me);let pe=$.update(x),Ee=x.material;Ee.visible&&m.push(x,pe,Ee,B,Ve.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||q.intersectsObject(x))){let pe=$.update(x),Ee=x.material;if(V&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Ve.copy(x.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ve.copy(pe.boundingSphere.center)),Ve.applyMatrix4(x.matrixWorld).applyMatrix4(Me)),Array.isArray(Ee)){let we=pe.groups;for(let Oe=0,He=we.length;Oe<He;Oe++){let Te=we[Oe],at=Ee[Te.materialIndex];at&&at.visible&&m.push(x,pe,at,B,Ve.z,Te)}}else Ee.visible&&m.push(x,pe,Ee,B,Ve.z,null)}}let ne=x.children;for(let pe=0,Ee=ne.length;pe<Ee;pe++)An(ne[pe],D,B,V)}function Ri(x,D,B,V){let U=x.opaque,ne=x.transmissive,pe=x.transparent;f.setupLightsView(B),j===!0&&te.setGlobalState(M.clippingPlanes,B),V&&Pe.viewport(A.copy(V)),U.length>0&&ma(U,D,B),ne.length>0&&ma(ne,D,B),pe.length>0&&ma(pe,D,B),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function rn(x,D,B,V){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[V.id]===void 0&&(f.state.transmissionRenderTarget[V.id]=new Gi(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?Oo:Hi,minFilter:Hr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:rt.workingColorSpace}));let ne=f.state.transmissionRenderTarget[V.id],pe=V.viewport||A;ne.setSize(pe.z,pe.w);let Ee=M.getRenderTarget();M.setRenderTarget(ne),M.getClearColor(z),Y=M.getClearAlpha(),Y<1&&M.setClearColor(16777215,.5),M.clear(),qe&&Ue.render(B);let we=M.toneMapping;M.toneMapping=pr;let Oe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),f.setupLightsView(V),j===!0&&te.setGlobalState(M.clippingPlanes,V),ma(x,B,V),E.updateMultisampleRenderTarget(ne),E.updateRenderTargetMipmap(ne),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Te=0,at=D.length;Te<at;Te++){let St=D[Te],At=St.object,mn=St.geometry,ft=St.material,Ie=St.group;if(ft.side===ni&&At.layers.test(V.layers)){let Ci=ft.side;ft.side=yn,ft.needsUpdate=!0,Lf(At,B,V,mn,ft,Ie),ft.side=Ci,ft.needsUpdate=!0,He=!0}}He===!0&&(E.updateMultisampleRenderTarget(ne),E.updateRenderTargetMipmap(ne))}M.setRenderTarget(Ee),M.setClearColor(z,Y),Oe!==void 0&&(V.viewport=Oe),M.toneMapping=we}function ma(x,D,B){let V=D.isScene===!0?D.overrideMaterial:null;for(let U=0,ne=x.length;U<ne;U++){let pe=x[U],Ee=pe.object,we=pe.geometry,Oe=V===null?pe.material:V,He=pe.group;Ee.layers.test(B.layers)&&Lf(Ee,D,B,we,Oe,He)}}function Lf(x,D,B,V,U,ne){x.onBeforeRender(M,D,B,V,U,ne),x.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),U.onBeforeRender(M,D,B,V,x,ne),U.transparent===!0&&U.side===ni&&U.forceSinglePass===!1?(U.side=yn,U.needsUpdate=!0,M.renderBufferDirect(B,D,V,U,x,ne),U.side=mr,U.needsUpdate=!0,M.renderBufferDirect(B,D,V,U,x,ne),U.side=ni):M.renderBufferDirect(B,D,V,U,x,ne),x.onAfterRender(M,D,B,V,U,ne)}function ga(x,D,B){D.isScene!==!0&&(D=vt);let V=Ae.get(x),U=f.state.lights,ne=f.state.shadowsArray,pe=U.state.version,Ee=Se.getParameters(x,U.state,ne,D,B),we=Se.getProgramCacheKey(Ee),Oe=V.programs;V.environment=x.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(x.isMeshStandardMaterial?k:_).get(x.envMap||V.environment),V.envMapRotation=V.environment!==null&&x.envMap===null?D.environmentRotation:x.envMapRotation,Oe===void 0&&(x.addEventListener("dispose",Be),Oe=new Map,V.programs=Oe);let He=Oe.get(we);if(He!==void 0){if(V.currentProgram===He&&V.lightsStateVersion===pe)return Uf(x,Ee),He}else Ee.uniforms=Se.getUniforms(x),x.onBeforeCompile(Ee,M),He=Se.acquireProgram(Ee,we),Oe.set(we,He),V.uniforms=Ee.uniforms;let Te=V.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Te.clippingPlanes=te.uniform),Uf(x,Ee),V.needsLights=Y1(x),V.lightsStateVersion=pe,V.needsLights&&(Te.ambientLightColor.value=U.state.ambient,Te.lightProbe.value=U.state.probe,Te.directionalLights.value=U.state.directional,Te.directionalLightShadows.value=U.state.directionalShadow,Te.spotLights.value=U.state.spot,Te.spotLightShadows.value=U.state.spotShadow,Te.rectAreaLights.value=U.state.rectArea,Te.ltc_1.value=U.state.rectAreaLTC1,Te.ltc_2.value=U.state.rectAreaLTC2,Te.pointLights.value=U.state.point,Te.pointLightShadows.value=U.state.pointShadow,Te.hemisphereLights.value=U.state.hemi,Te.directionalShadowMap.value=U.state.directionalShadowMap,Te.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Te.spotShadowMap.value=U.state.spotShadowMap,Te.spotLightMatrix.value=U.state.spotLightMatrix,Te.spotLightMap.value=U.state.spotLightMap,Te.pointShadowMap.value=U.state.pointShadowMap,Te.pointShadowMatrix.value=U.state.pointShadowMatrix),V.currentProgram=He,V.uniformsList=null,He}function Df(x){if(x.uniformsList===null){let D=x.currentProgram.getUniforms();x.uniformsList=Ls.seqWithValue(D.seq,x.uniforms)}return x.uniformsList}function Uf(x,D){let B=Ae.get(x);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.batchingColor=D.batchingColor,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.instancingMorph=D.instancingMorph,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function $1(x,D,B,V,U){D.isScene!==!0&&(D=vt),E.resetTextureUnits();let ne=D.fog,pe=V.isMeshStandardMaterial?D.environment:null,Ee=L===null?M.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Gs,we=(V.isMeshStandardMaterial?k:_).get(V.envMap||pe),Oe=V.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,He=!!B.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Te=!!B.morphAttributes.position,at=!!B.morphAttributes.normal,St=!!B.morphAttributes.color,At=pr;V.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(At=M.toneMapping);let mn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ft=mn!==void 0?mn.length:0,Ie=Ae.get(V),Ci=f.state.lights;if(j===!0&&(le===!0||x!==y)){let zn=x===y&&V.id===b;te.setState(V,x,zn)}let pt=!1;V.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==Ci.state.version||Ie.outputColorSpace!==Ee||U.isBatchedMesh&&Ie.batching===!1||!U.isBatchedMesh&&Ie.batching===!0||U.isBatchedMesh&&Ie.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ie.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ie.instancing===!1||!U.isInstancedMesh&&Ie.instancing===!0||U.isSkinnedMesh&&Ie.skinning===!1||!U.isSkinnedMesh&&Ie.skinning===!0||U.isInstancedMesh&&Ie.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ie.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ie.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ie.instancingMorph===!1&&U.morphTexture!==null||Ie.envMap!==we||V.fog===!0&&Ie.fog!==ne||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==te.numPlanes||Ie.numIntersection!==te.numIntersection)||Ie.vertexAlphas!==Oe||Ie.vertexTangents!==He||Ie.morphTargets!==Te||Ie.morphNormals!==at||Ie.morphColors!==St||Ie.toneMapping!==At||Ie.morphTargetsCount!==ft)&&(pt=!0):(pt=!0,Ie.__version=V.version);let Jn=Ie.currentProgram;pt===!0&&(Jn=ga(V,D,U));let ds=!1,Rn=!1,vo=!1,Rt=Jn.getUniforms(),di=Ie.uniforms;if(Pe.useProgram(Jn.program)&&(ds=!0,Rn=!0,vo=!0),V.id!==b&&(b=V.id,Rn=!0),ds||y!==x){Pe.buffers.depth.getReversed()?(re.copy(x.projectionMatrix),iy(re),ry(re),Rt.setValue(I,"projectionMatrix",re)):Rt.setValue(I,"projectionMatrix",x.projectionMatrix),Rt.setValue(I,"viewMatrix",x.matrixWorldInverse);let ir=Rt.map.cameraPosition;ir!==void 0&&ir.setValue(I,Fe.setFromMatrixPosition(x.matrixWorld)),Ke.logarithmicDepthBuffer&&Rt.setValue(I,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Rt.setValue(I,"isOrthographic",x.isOrthographicCamera===!0),y!==x&&(y=x,Rn=!0,vo=!0)}if(U.isSkinnedMesh){Rt.setOptional(I,U,"bindMatrix"),Rt.setOptional(I,U,"bindMatrixInverse");let zn=U.skeleton;zn&&(zn.boneTexture===null&&zn.computeBoneTexture(),Rt.setValue(I,"boneTexture",zn.boneTexture,E))}U.isBatchedMesh&&(Rt.setOptional(I,U,"batchingTexture"),Rt.setValue(I,"batchingTexture",U._matricesTexture,E),Rt.setOptional(I,U,"batchingIdTexture"),Rt.setValue(I,"batchingIdTexture",U._indirectTexture,E),Rt.setOptional(I,U,"batchingColorTexture"),U._colorsTexture!==null&&Rt.setValue(I,"batchingColorTexture",U._colorsTexture,E));let yo=B.morphAttributes;if((yo.position!==void 0||yo.normal!==void 0||yo.color!==void 0)&&Ne.update(U,B,Jn),(Rn||Ie.receiveShadow!==U.receiveShadow)&&(Ie.receiveShadow=U.receiveShadow,Rt.setValue(I,"receiveShadow",U.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(di.envMap.value=we,di.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(di.envMapIntensity.value=D.environmentIntensity),Rn&&(Rt.setValue(I,"toneMappingExposure",M.toneMappingExposure),Ie.needsLights&&q1(di,vo),ne&&V.fog===!0&&he.refreshFogUniforms(di,ne),he.refreshMaterialUniforms(di,V,X,ee,f.state.transmissionRenderTarget[x.id]),Ls.upload(I,Df(Ie),di,E)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Ls.upload(I,Df(Ie),di,E),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Rt.setValue(I,"center",U.center),Rt.setValue(I,"modelViewMatrix",U.modelViewMatrix),Rt.setValue(I,"normalMatrix",U.normalMatrix),Rt.setValue(I,"modelMatrix",U.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){let zn=V.uniformsGroups;for(let ir=0,rr=zn.length;ir<rr;ir++){let Nf=zn[ir];C.update(Nf,Jn),C.bind(Nf,Jn)}}return Jn}function q1(x,D){x.ambientLightColor.needsUpdate=D,x.lightProbe.needsUpdate=D,x.directionalLights.needsUpdate=D,x.directionalLightShadows.needsUpdate=D,x.pointLights.needsUpdate=D,x.pointLightShadows.needsUpdate=D,x.spotLights.needsUpdate=D,x.spotLightShadows.needsUpdate=D,x.rectAreaLights.needsUpdate=D,x.hemisphereLights.needsUpdate=D}function Y1(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(x,D,B){Ae.get(x.texture).__webglTexture=D,Ae.get(x.depthTexture).__webglTexture=B;let V=Ae.get(x);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=B===void 0,V.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,D){let B=Ae.get(x);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(x,D=0,B=0){L=x,T=D,R=B;let V=!0,U=null,ne=!1,pe=!1;if(x){let we=Ae.get(x);if(we.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(I.FRAMEBUFFER,null),V=!1;else if(we.__webglFramebuffer===void 0)E.setupRenderTarget(x);else if(we.__hasExternalTextures)E.rebindTextures(x,Ae.get(x.texture).__webglTexture,Ae.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let Te=x.depthTexture;if(we.__boundDepthTexture!==Te){if(Te!==null&&Ae.has(Te)&&(x.width!==Te.image.width||x.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(x)}}let Oe=x.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(pe=!0);let He=Ae.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(He[D])?U=He[D][B]:U=He[D],ne=!0):x.samples>0&&E.useMultisampledRTT(x)===!1?U=Ae.get(x).__webglMultisampledFramebuffer:Array.isArray(He)?U=He[B]:U=He,A.copy(x.viewport),G.copy(x.scissor),F=x.scissorTest}else A.copy(Ce).multiplyScalar(X).floor(),G.copy($e).multiplyScalar(X).floor(),F=et;if(Pe.bindFramebuffer(I.FRAMEBUFFER,U)&&V&&Pe.drawBuffers(x,U),Pe.viewport(A),Pe.scissor(G),Pe.setScissorTest(F),ne){let we=Ae.get(x.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+D,we.__webglTexture,B)}else if(pe){let we=Ae.get(x.texture),Oe=D||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,we.__webglTexture,B||0,Oe)}b=-1},this.readRenderTargetPixels=function(x,D,B,V,U,ne,pe){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Ae.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&pe!==void 0&&(Ee=Ee[pe]),Ee){Pe.bindFramebuffer(I.FRAMEBUFFER,Ee);try{let we=x.texture,Oe=we.format,He=we.type;if(!Ke.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ke.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=x.width-V&&B>=0&&B<=x.height-U&&I.readPixels(D,B,V,U,ke.convert(Oe),ke.convert(He),ne)}finally{let we=L!==null?Ae.get(L).__webglFramebuffer:null;Pe.bindFramebuffer(I.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(x,D,B,V,U,ne,pe){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Ae.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&pe!==void 0&&(Ee=Ee[pe]),Ee){let we=x.texture,Oe=we.format,He=we.type;if(!Ke.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ke.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=x.width-V&&B>=0&&B<=x.height-U){Pe.bindFramebuffer(I.FRAMEBUFFER,Ee);let Te=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Te),I.bufferData(I.PIXEL_PACK_BUFFER,ne.byteLength,I.STREAM_READ),I.readPixels(D,B,V,U,ke.convert(Oe),ke.convert(He),0);let at=L!==null?Ae.get(L).__webglFramebuffer:null;Pe.bindFramebuffer(I.FRAMEBUFFER,at);let St=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await ny(I,St,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Te),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ne),I.deleteBuffer(Te),I.deleteSync(St),ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,D=null,B=0){x.isTexture!==!0&&(Ro("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,x=arguments[1]);let V=Math.pow(2,-B),U=Math.floor(x.image.width*V),ne=Math.floor(x.image.height*V),pe=D!==null?D.x:0,Ee=D!==null?D.y:0;E.setTexture2D(x,0),I.copyTexSubImage2D(I.TEXTURE_2D,B,0,0,pe,Ee,U,ne),Pe.unbindTexture()},this.copyTextureToTexture=function(x,D,B=null,V=null,U=0){x.isTexture!==!0&&(Ro("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,x=arguments[1],D=arguments[2],U=arguments[3]||0,B=null);let ne,pe,Ee,we,Oe,He,Te,at,St,At=x.isCompressedTexture?x.mipmaps[U]:x.image;B!==null?(ne=B.max.x-B.min.x,pe=B.max.y-B.min.y,Ee=B.isBox3?B.max.z-B.min.z:1,we=B.min.x,Oe=B.min.y,He=B.isBox3?B.min.z:0):(ne=At.width,pe=At.height,Ee=At.depth||1,we=0,Oe=0,He=0),V!==null?(Te=V.x,at=V.y,St=V.z):(Te=0,at=0,St=0);let mn=ke.convert(D.format),ft=ke.convert(D.type),Ie;D.isData3DTexture?(E.setTexture3D(D,0),Ie=I.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(E.setTexture2DArray(D,0),Ie=I.TEXTURE_2D_ARRAY):(E.setTexture2D(D,0),Ie=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,D.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,D.unpackAlignment);let Ci=I.getParameter(I.UNPACK_ROW_LENGTH),pt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Jn=I.getParameter(I.UNPACK_SKIP_PIXELS),ds=I.getParameter(I.UNPACK_SKIP_ROWS),Rn=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,At.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,At.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,we),I.pixelStorei(I.UNPACK_SKIP_ROWS,Oe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,He);let vo=x.isDataArrayTexture||x.isData3DTexture,Rt=D.isDataArrayTexture||D.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){let di=Ae.get(x),yo=Ae.get(D),zn=Ae.get(di.__renderTarget),ir=Ae.get(yo.__renderTarget);Pe.bindFramebuffer(I.READ_FRAMEBUFFER,zn.__webglFramebuffer),Pe.bindFramebuffer(I.DRAW_FRAMEBUFFER,ir.__webglFramebuffer);for(let rr=0;rr<Ee;rr++)vo&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ae.get(x).__webglTexture,U,He+rr),x.isDepthTexture?(Rt&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ae.get(D).__webglTexture,U,St+rr),I.blitFramebuffer(we,Oe,ne,pe,Te,at,ne,pe,I.DEPTH_BUFFER_BIT,I.NEAREST)):Rt?I.copyTexSubImage3D(Ie,U,Te,at,St+rr,we,Oe,ne,pe):I.copyTexSubImage2D(Ie,U,Te,at,St+rr,we,Oe,ne,pe);Pe.bindFramebuffer(I.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Rt?x.isDataTexture||x.isData3DTexture?I.texSubImage3D(Ie,U,Te,at,St,ne,pe,Ee,mn,ft,At.data):D.isCompressedArrayTexture?I.compressedTexSubImage3D(Ie,U,Te,at,St,ne,pe,Ee,mn,At.data):I.texSubImage3D(Ie,U,Te,at,St,ne,pe,Ee,mn,ft,At):x.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,U,Te,at,ne,pe,mn,ft,At.data):x.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,U,Te,at,At.width,At.height,mn,At.data):I.texSubImage2D(I.TEXTURE_2D,U,Te,at,ne,pe,mn,ft,At);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ci),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,pt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Jn),I.pixelStorei(I.UNPACK_SKIP_ROWS,ds),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Rn),U===0&&D.generateMipmaps&&I.generateMipmap(Ie),Pe.unbindTexture()},this.copyTextureToTexture3D=function(x,D,B=null,V=null,U=0){return x.isTexture!==!0&&(Ro("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,V=arguments[1]||null,x=arguments[2],D=arguments[3],U=arguments[4]||0),Ro('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,D,B,V,U)},this.initRenderTarget=function(x){Ae.get(x).__webglFramebuffer===void 0&&E.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?E.setTextureCube(x,0):x.isData3DTexture?E.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?E.setTexture2DArray(x,0):E.setTexture2D(x,0),Pe.unbindTexture()},this.resetState=function(){T=0,R=0,L=null,Pe.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let n=this.getContext();n.drawingBufferColorspace=rt._getDrawingBufferColorSpace(e),n.unpackColorSpace=rt._getUnpackColorSpace()}};var gc=class extends si{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wi,this.environmentIntensity=1,this.environmentRotation=new Wi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}};function Ja(t,e,n){return!t||!n&&t.constructor===e?t:typeof e.BYTES_PER_ELEMENT=="number"?new e(t):Array.prototype.slice.call(t)}function jb(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}var Hs=class{constructor(e,n,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let n=this.parameterPositions,i=this._cachedIndex,r=n[i],s=n[i-1];e:{t:{let o;n:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=n[++i],e<r)break t}o=n.length;break n}if(!(e>=s)){let a=n[1];e<a&&(i=2,s=a);for(let c=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(r=s,s=n[--i-1],e>=s)break t}o=i,i=0;break n}break e}for(;i<o;){let a=i+o>>>1;e<n[a]?o=a:i=a+1}if(r=n[i],s=n[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let n=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)n[o]=i[s+o];return n}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Eu=class extends Hs{constructor(e,n,i,r){super(e,n,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gp,endingEnd:gp}}intervalChanged_(e,n,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case _p:s=e,a=2*n-i;break;case vp:s=r.length-2,a=n+r[s]-r[s+1];break;default:s=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case _p:o=e,c=2*i-n;break;case vp:o=1,c=i+r[1]-r[0];break;default:o=e-1,c=n}let l=(i-n)*.5,h=this.valueSize;this._weightPrev=l/(n-a),this._weightNext=l/(c-i),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(i-n)/(r-n),v=g*g,m=v*g,f=-u*m+2*u*v-u*g,S=(1+u)*m+(-1.5-2*u)*v+(-.5+u)*g+1,w=(-1-p)*m+(1.5+p)*v+.5*g,M=p*m-p*v;for(let N=0;N!==a;++N)s[N]=f*o[h+N]+S*o[l+N]+w*o[c+N]+M*o[d+N];return s}},wu=class extends Hs{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(i-n)/(r-n),d=1-h;for(let u=0;u!==a;++u)s[u]=o[l+u]*d+o[c+u]*h;return s}},Tu=class extends Hs{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},oi=class{constructor(e,n,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ja(n,this.TimeBufferType),this.values=Ja(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let n=e.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(e);else{i={name:e.name,times:Ja(e.times,Array),values:Ja(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Tu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Eu(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let n;switch(e){case ic:n=this.InterpolantFactoryMethodDiscrete;break;case su:n=this.InterpolantFactoryMethodLinear;break;case Xl:n=this.InterpolantFactoryMethodSmooth;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ic;case this.InterpolantFactoryMethodLinear:return su;case this.InterpolantFactoryMethodSmooth:return Xl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]+=e}return this}scale(e){if(e!==1){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]*=e}return this}trim(e,n){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>n;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(r!==void 0&&jb(r))for(let a=0,c=r.length;a!==c;++a){let l=r[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===Xl,s=e.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(r)c=!0;else{let d=a*i,u=d-i,p=d+i;for(let g=0;g!==i;++g){let v=n[d+g];if(v!==n[u+g]||v!==n[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*i,u=o*i;for(let p=0;p!==i;++p)n[u+p]=n[d+p]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,c=o*i,l=0;l!==i;++l)n[c+l]=n[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=n.slice(0,o*i)):(this.times=e,this.values=n),this}clone(){let e=this.times.slice(),n=this.values.slice(),i=this.constructor,r=new i(this.name,e,n);return r.createInterpolant=this.createInterpolant,r}};oi.prototype.TimeBufferType=Float32Array;oi.prototype.ValueBufferType=Float32Array;oi.prototype.DefaultInterpolation=su;var $r=class extends oi{constructor(e,n,i){super(e,n,i)}};$r.prototype.ValueTypeName="bool";$r.prototype.ValueBufferType=Array;$r.prototype.DefaultInterpolation=ic;$r.prototype.InterpolantFactoryMethodLinear=void 0;$r.prototype.InterpolantFactoryMethodSmooth=void 0;var Au=class extends oi{};Au.prototype.ValueTypeName="color";var Ru=class extends oi{};Ru.prototype.ValueTypeName="number";var Cu=class extends Hs{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-n)/(r-n),l=e*a;for(let h=l+a;l!==h;l+=4)_r.slerpFlat(s,0,o,l-a,o,l,c);return s}},_c=class extends oi{InterpolantFactoryMethodLinear(e){return new Cu(this.times,this.values,this.getValueSize(),e)}};_c.prototype.ValueTypeName="quaternion";_c.prototype.InterpolantFactoryMethodSmooth=void 0;var qr=class extends oi{constructor(e,n,i){super(e,n,i)}};qr.prototype.ValueTypeName="string";qr.prototype.ValueBufferType=Array;qr.prototype.DefaultInterpolation=ic;qr.prototype.InterpolantFactoryMethodLinear=void 0;qr.prototype.InterpolantFactoryMethodSmooth=void 0;var Iu=class extends oi{};Iu.prototype.ValueTypeName="vector";var dm={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}},Pu=class{constructor(e,n,i){let r=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){let p=l[d],g=l[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},Qb=new Pu,Fo=class{constructor(e){this.manager=e!==void 0?e:Qb,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){let i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Fo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Lu=class extends Fo{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=dm.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(o),s.manager.itemEnd(e)},0),o;let a=Lo("img");function c(){h(),dm.add(e,this),n&&n(this),s.manager.itemEnd(e)}function l(d){h(),r&&r(d),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}};var vc=class extends Fo{constructor(e){super(e)}load(e,n,i,r){let s=new Dn,o=new Lu(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}};var Hu="\\[\\]\\.:\\/",eS=new RegExp("["+Hu+"]","g"),Gu="[^"+Hu+"]",tS="[^"+Hu.replace("\\.","")+"]",nS=/((?:WC+[\/:])*)/.source.replace("WC",Gu),iS=/(WCOD+)?/.source.replace("WCOD",tS),rS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gu),sS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gu),oS=new RegExp("^"+nS+iS+rS+sS+"$"),aS=["material","materials","bones","map"],Du=class{constructor(e,n,i){let r=i||Lt.parseTrackName(n);this._targetGroup=e,this._bindings=e.subscribe_(n,r)}getValue(e,n){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,n)}setValue(e,n){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,n)}bind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].bind()}unbind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].unbind()}},Lt=class t{constructor(e,n,i){this.path=n,this.parsedPath=i||t.parseTrackName(n),this.node=t.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,n,i){return e&&e.isAnimationObjectGroup?new t.Composite(e,n,i):new t(e,n,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(eS,"")}static parseTrackName(e){let n=oS.exec(e);if(n===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);aS.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,n){if(n===void 0||n===""||n==="."||n===-1||n===e.name||n===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(n);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===n||a.uuid===n)return a;let c=i(a.children);if(c)return c}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,n){e[n]=this.targetObject[this.propertyName]}_getValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[n++]=i[r]}_getValue_arrayElement(e,n){e[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,n){this.resolvedProperty.toArray(e,n)}_setValue_direct(e,n){this.targetObject[this.propertyName]=e[n]}_setValue_direct_setNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++]}_setValue_array_setNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,n){this.resolvedProperty[this.propertyIndex]=e[n]}_setValue_arrayElement_setNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,n){this.resolvedProperty.fromArray(e,n)}_setValue_fromArray_setNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,n){this.bind(),this.getValue(e,n)}_setValue_unbound(e,n){this.bind(),this.setValue(e,n)}bind(){let e=this.node,n=this.parsedPath,i=n.objectName,r=n.propertyName,s=n.propertyIndex;if(e||(e=t.findNode(this.rootNode,n.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=n.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[r];if(o===void 0){let l=n.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Lt.Composite=Du;Lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Lt.prototype.GetterByBindingType=[Lt.prototype._getValue_direct,Lt.prototype._getValue_array,Lt.prototype._getValue_arrayElement,Lt.prototype._getValue_toArray];Lt.prototype.SetterByBindingTypeAndVersioning=[[Lt.prototype._setValue_direct,Lt.prototype._setValue_direct_setNeedsUpdate,Lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_array,Lt.prototype._setValue_array_setNeedsUpdate,Lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_arrayElement,Lt.prototype._setValue_arrayElement_setNeedsUpdate,Lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_fromArray,Lt.prototype._setValue_fromArray_setNeedsUpdate,Lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var YE=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uu);var is=typeof self<"u"?self:{};function i0(t,e){e:{for(var n=["CLOSURE_FLAGS"],i=is,r=0;r<n.length;r++)if((i=i[n[r]])==null){n=null;break e}n=i}return(t=n&&n[t])!=null?t:e}function It(t,e){t=t.split(".");for(var n,i=is;t.length&&(n=t.shift());)t.length||e===void 0?i=i[n]&&i[n]!==Object.prototype[n]?i[n]:i[n]={}:i[n]=e}function Yr(){throw Error("Invalid UTF8")}function Fm(t,e){return e=String.fromCharCode.apply(null,e),t==null?e:t+e}var Wu,cS,bc=void 0,lS=typeof TextDecoder<"u",hS=typeof TextEncoder<"u";function r0(t){if(hS)t=(cS||(cS=new TextEncoder)).encode(t);else{let n=0,i=new Uint8Array(3*t.length);for(let r=0;r<t.length;r++){var e=t.charCodeAt(r);if(e<128)i[n++]=e;else{if(e<2048)i[n++]=e>>6|192;else{if(e>=55296&&e<=57343){if(e<=56319&&r<t.length){let s=t.charCodeAt(++r);if(s>=56320&&s<=57343){e=1024*(e-55296)+s-56320+65536,i[n++]=e>>18|240,i[n++]=e>>12&63|128,i[n++]=e>>6&63|128,i[n++]=63&e|128;continue}r--}e=65533}i[n++]=e>>12|224,i[n++]=e>>6&63|128}i[n++]=63&e|128}}t=n===i.length?i:i.subarray(0,n)}return t}function s0(t){is.setTimeout(()=>{throw t},0)}var uS=i0(610401301,!1),Om=i0(748402147,!0);function km(){var t=is.navigator;return t&&(t=t.userAgent)?t:""}var ed,Bm=is.navigator;function el(t){return el[" "](t),t}ed=Bm&&Bm.userAgentData||null,el[" "]=function(){};var o0={},Go=null;function dS(t){var e=t.length,n=3*e/4;n%3?n=Math.floor(n):"=.".indexOf(t[e-1])!=-1&&(n="=.".indexOf(t[e-2])!=-1?n-2:n-1);var i=new Uint8Array(n),r=0;return function(s,o){function a(l){for(;c<s.length;){let h=s.charAt(c++),d=Go[h];if(d!=null)return d;if(!/^[\s\xa0]*$/.test(h))throw Error("Unknown base64 encoding at char: "+h)}return l}a0();for(var c=0;;){let l=a(-1),h=a(0),d=a(64),u=a(64);if(u===64&&l===-1)break;o(l<<2|h>>4),d!=64&&(o(h<<4&240|d>>2),u!=64&&o(d<<6&192|u))}}(t,function(s){i[r++]=s}),r!==n?i.subarray(0,r):i}function a0(){if(!Go){Go={};var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),e=["+/=","+/","-_=","-_.","-_"];for(let n=0;n<5;n++){let i=t.concat(e[n].split(""));o0[n]=i;for(let r=0;r<i.length;r++){let s=i[r];Go[s]===void 0&&(Go[s]=r)}}}}var fS=typeof Uint8Array<"u",c0=!(!(uS&&ed&&ed.brands.length>0)&&(km().indexOf("Trident")!=-1||km().indexOf("MSIE")!=-1))&&typeof btoa=="function",zm=/[-_.]/g,pS={"-":"+",_:"/",".":"="};function mS(t){return pS[t]||""}function l0(t){if(!c0)return dS(t);t=zm.test(t)?t.replace(zm,mS):t,t=atob(t);var e=new Uint8Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}function Td(t){return fS&&t!=null&&t instanceof Uint8Array}var Zs={};function rs(){return gS||(gS=new yi(null,Zs))}function Ad(t){h0(Zs);var e=t.g;return(e=e==null||Td(e)?e:typeof e=="string"?l0(e):null)==null?e:t.g=e}var gS,yi=class{h(){return new Uint8Array(Ad(this)||0)}constructor(t,e){if(h0(e),this.g=t,t!=null&&t.length===0)throw Error("ByteString should be constructed with non-empty values")}};function h0(t){if(t!==Zs)throw Error("illegal external caller")}function u0(t,e){t.__closure__error__context__984382||(t.__closure__error__context__984382={}),t.__closure__error__context__984382.severity=e}var _S=void 0;function Yo(t){return u0(t=Error(t),"warning"),t}function Js(t,e){if(t!=null){var n=_S??(_S={}),i=n[t]||0;i>=e||(n[t]=i+1,u0(t=Error(),"incident"),s0(t))}}function os(){return typeof BigInt=="function"}var ao=typeof Symbol=="function"&&typeof Symbol()=="symbol";function Ei(t,e,n=!1){return typeof Symbol=="function"&&typeof Symbol()=="symbol"?n&&Symbol.for&&t?Symbol.for(t):t!=null?Symbol(t):Symbol():e}var wr,vS=Ei("jas",void 0,!0),Vm=Ei(void 0,"0di"),Bo=Ei(void 0,"1oa"),Nn=Ei(void 0,Symbol()),yS=Ei(void 0,"0ub"),xS=Ei(void 0,"0ubs"),td=Ei(void 0,"0ubsb"),MS=Ei(void 0,"0actk"),js=Ei("m_m","kb",!0),Hm=Ei(),d0={Va:{value:0,configurable:!0,writable:!0,enumerable:!1}},f0=Object.defineProperties,xe=ao?vS:"Va",Gm=[];function ea(t,e){ao||xe in t||f0(t,d0),t[xe]|=e}function Zt(t,e){ao||xe in t||f0(t,d0),t[xe]=e}function ta(t){return ea(t,34),t}function Ko(t){return ea(t,8192),t}Zt(Gm,7),wr=Object.freeze(Gm);var Qs={};function wn(t,e){return e===void 0?t.h!==ss&&!!(2&t.A[xe]):!!(2&e)&&t.h!==ss}var ss={};function tl(t,e){if(t!=null){if(typeof t=="string")t=t?new yi(t,Zs):rs();else if(t.constructor!==yi)if(Td(t))t=t.length?new yi(new Uint8Array(t),Zs):rs();else{if(!e)throw Error();t=void 0}}return t}var Fc=class{constructor(e,n,i){this.g=e,this.h=n,this.j=i}next(){var e=this.g.next();return e.done||(e.value=this.h.call(this.j,e.value)),e}[Symbol.iterator](){return this}},bS=Object.freeze({});function p0(t,e,n){var i,r=128&e?0:-1,s=t.length;(i=!!s)&&(i=(i=t[s-1])!=null&&typeof i=="object"&&i.constructor===Object);var o=s+(i?-1:0);for(e=128&e?1:0;e<o;e++)n(e-r,t[e]);if(i){t=t[s-1];for(let a in t)!isNaN(a)&&n(+a,t[a])}}var m0={};function co(t){return 128&t?m0:void 0}function nl(t){return t.ib=!0,t}var SS=nl(t=>typeof t=="number"),Wm=nl(t=>typeof t=="string"),ES=nl(t=>typeof t=="boolean"),il=typeof is.BigInt=="function"&&typeof is.BigInt(0)=="bigint";function Kt(t){var e=t;if(Wm(e)){if(!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(e))throw Error(String(e))}else if(SS(e)&&!Number.isSafeInteger(e))throw Error(String(e));return il?BigInt(t):t=ES(t)?t?"1":"0":Wm(t)?t.trim()||"0":String(t)}var nd=nl(t=>il?t>=TS&&t<=RS:t[0]==="-"?Xm(t,wS):Xm(t,AS)),wS=Number.MIN_SAFE_INTEGER.toString(),TS=il?BigInt(Number.MIN_SAFE_INTEGER):void 0,AS=Number.MAX_SAFE_INTEGER.toString(),RS=il?BigInt(Number.MAX_SAFE_INTEGER):void 0;function Xm(t,e){if(t.length>e.length)return!1;if(t.length<e.length||t===e)return!0;for(let n=0;n<t.length;n++){let i=t[n],r=e[n];if(i>r)return!1;if(i<r)return!0}}var g0,CS=typeof Uint8Array.prototype.slice=="function",st=0,_t=0;function id(t){var e=t>>>0;st=e,_t=(t-e)/4294967296>>>0}function as(t){if(t<0){id(-t);let[e,n]=Id(st,_t);st=e>>>0,_t=n>>>0}else id(t)}function Rd(t){var e=g0||(g0=new DataView(new ArrayBuffer(8)));e.setFloat32(0,+t,!0),_t=0,st=e.getUint32(0,!0)}function _0(t,e){var n=4294967296*e+(t>>>0);return Number.isSafeInteger(n)?n:eo(t,e)}function IS(t,e){return Kt(os()?BigInt.asUintN(64,(BigInt(e>>>0)<<BigInt(32))+BigInt(t>>>0)):eo(t,e))}function v0(t,e){return os()?Kt(BigInt.asIntN(64,(BigInt.asUintN(32,BigInt(e))<<BigInt(32))+BigInt.asUintN(32,BigInt(t)))):Kt(Cd(t,e))}function eo(t,e){if(t>>>=0,(e>>>=0)<=2097151)var n=""+(4294967296*e+t);else os()?n=""+(BigInt(e)<<BigInt(32)|BigInt(t)):(t=(16777215&t)+6777216*(n=16777215&(t>>>24|e<<8))+6710656*(e=e>>16&65535),n+=8147497*e,e*=2,t>=1e7&&(n+=t/1e7>>>0,t%=1e7),n>=1e7&&(e+=n/1e7>>>0,n%=1e7),n=e+$m(n)+$m(t));return n}function $m(t){return t=String(t),"0000000".slice(t.length)+t}function Cd(t,e){if(2147483648&e)if(os())t=""+(BigInt(0|e)<<BigInt(32)|BigInt(t>>>0));else{let[n,i]=Id(t,e);t="-"+eo(n,i)}else t=eo(t,e);return t}function na(t){if(t.length<16)as(Number(t));else if(os())t=BigInt(t),st=Number(t&BigInt(4294967295))>>>0,_t=Number(t>>BigInt(32)&BigInt(4294967295));else{let e=+(t[0]==="-");_t=st=0;let n=t.length;for(let i=e,r=(n-e)%6+e;r<=n;i=r,r+=6){let s=Number(t.slice(i,r));_t*=1e6,(st=1e6*st+s)>=4294967296&&(_t+=Math.trunc(st/4294967296),_t>>>=0,st>>>=0)}if(e){let[i,r]=Id(st,_t);st=i,_t=r}}}function Id(t,e){return e=~e,t?t=1+~t:e+=1,[t,e]}function Yn(t){return Array.prototype.slice.call(t)}var Qr=typeof BigInt=="function"?BigInt.asIntN:void 0,rd=typeof BigInt=="function"?BigInt.asUintN:void 0,xi=Number.isSafeInteger,ia=Number.isFinite,Sr=Math.trunc,PS=Kt(0);function y0(t){if(typeof t!="number")throw Error(`Value of float/double field must be a number, found ${typeof t}: ${t}`);return t}function ai(t){return t==null||typeof t=="number"?t:t==="NaN"||t==="Infinity"||t==="-Infinity"?Number(t):void 0}function Oc(t){if(typeof t!="boolean"){var e=typeof t;throw Error(`Expected boolean but got ${e!="object"?e:t?Array.isArray(t)?"array":e:"null"}: ${t}`)}return t}var LS=/^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;function lo(t){switch(typeof t){case"bigint":return!0;case"number":return ia(t);case"string":return LS.test(t);default:return!1}}function Ki(t){if(t!=null){if(!ia(t))throw Yo("enum");t|=0}return t}function cs(t){if(t==null)return t;if(typeof t=="string"&&t)t=+t;else if(typeof t!="number")return;return ia(t)?0|t:void 0}function x0(t){if(t==null)return t;if(typeof t=="string"&&t)t=+t;else if(typeof t!="number")return;return ia(t)?t>>>0:void 0}function M0(t,e){if(e??(e=1024),!lo(t))throw Yo("int64");var n=typeof t;switch(e){case 512:switch(n){case"string":return kc(t);case"bigint":return String(Qr(64,t));default:return w0(t)}case 1024:switch(n){case"string":return T0(t);case"bigint":return Kt(Qr(64,t));default:return A0(t)}case 0:switch(n){case"string":return kc(t);case"bigint":return Kt(Qr(64,t));default:return rl(t)}default:return function(i,r=`unexpected value ${i}!`){throw Error(r)}(e,"Unknown format requested type for int64")}}function b0(t){var e=t.length;return(t[0]==="-"?e<20||e===20&&t<="-9223372036854775808":e<19||e===19&&t<="9223372036854775807")?t:(na(t),Cd(st,_t))}function S0(t){if(t[0]==="-")var e=!1;else e=(e=t.length)<20||e===20&&t<="18446744073709551615";return e?t:(na(t),eo(st,_t))}function rl(t){if(t=Sr(t),!xi(t)){as(t);var e=st,n=_t;(t=2147483648&n)&&(n=~n>>>0,(e=1+~e>>>0)==0&&(n=n+1>>>0)),t=typeof(e=_0(e,n))=="number"?t?-e:e:t?"-"+e:e}return t}function E0(t){return(t=Sr(t))>=0&&xi(t)||(as(t),t=_0(st,_t)),t}function w0(t){return t=Sr(t),xi(t)?t=String(t):(as(t),t=Cd(st,_t)),t}function kc(t){var e=Sr(Number(t));return xi(e)?String(e):((e=t.indexOf("."))!==-1&&(t=t.substring(0,e)),b0(t))}function T0(t){var e=Sr(Number(t));return xi(e)?Kt(e):((e=t.indexOf("."))!==-1&&(t=t.substring(0,e)),os()?Kt(Qr(64,BigInt(t))):Kt(b0(t)))}function A0(t){return xi(t)?Kt(rl(t)):Kt(w0(t))}function Bc(t){var e=typeof t;return t==null?t:e==="bigint"?Kt(Qr(64,t)):lo(t)?e==="string"?T0(t):A0(t):void 0}function Pd(t){if(t==null)return t;var e=typeof t;if(e==="bigint")return String(Qr(64,t));if(lo(t)){if(e==="string")return kc(t);if(e==="number")return rl(t)}}function R0(t){if(t==null||typeof t=="string"||t instanceof yi)return t}function C0(t){if(typeof t!="string")throw Error();return t}function Yi(t){if(t!=null&&typeof t!="string")throw Error();return t}function ln(t){return t==null||typeof t=="string"?t:void 0}function Ld(t,e,n,i){return t!=null&&t[js]===Qs?t:Array.isArray(t)?((i=(n=0|t[xe])|32&i|2&i)!==n&&Zt(t,i),new e(t)):(n?2&i?((t=e[Vm])||(ta((t=new e).A),t=e[Vm]=t),e=t):e=new e:e=void 0,e)}function DS(t,e,n){return(t=e?M0(t,1024):Bc(t))==null?n?PS:void 0:t}function US(t){return t}var NS={},FS=function(){try{return el(new class extends Map{constructor(){super()}}),!1}catch{return!0}}(),Xo=class{constructor(){this.g=new Map}get(e){return this.g.get(e)}set(e,n){return this.g.set(e,n),this.size=this.g.size,this}delete(e){return e=this.g.delete(e),this.size=this.g.size,e}clear(){this.g.clear(),this.size=this.g.size}has(e){return this.g.has(e)}entries(){return this.g.entries()}keys(){return this.g.keys()}values(){return this.g.values()}forEach(e,n){return this.g.forEach(e,n)}[Symbol.iterator](){return this.entries()}},OS=FS?(Object.setPrototypeOf(Xo.prototype,Map.prototype),Object.defineProperties(Xo.prototype,{size:{value:0,configurable:!0,enumerable:!0,writable:!0}}),Xo):class extends Map{constructor(){super()}};function qm(t){return t}function Xu(t){if(2&t.M)throw Error("Cannot mutate an immutable Map")}var kS,Ji=class extends OS{constructor(t,e,n=qm,i=qm){super(),this.M=0|t[xe],this.N=e,this.ba=n,this.na=this.N?BS:i;for(let r=0;r<t.length;r++){let s=t[r],o=n(s[0],!1,!0),a=s[1];e?a===void 0&&(a=null):a=i(s[1],!1,!0,void 0,void 0,this.M),super.set(o,a)}}ea(t){return Ko(Array.from(super.entries(),t))}clear(){Xu(this),super.clear()}delete(t){return Xu(this),super.delete(this.ba(t,!0,!1))}entries(){if(this.N){var t=super.keys();t=new Fc(t,zS,this)}else t=super.entries();return t}values(){if(this.N){var t=super.keys();t=new Fc(t,Ji.prototype.get,this)}else t=super.values();return t}forEach(t,e){this.N?super.forEach((n,i,r)=>{t.call(e,r.get(i),i,r)}):super.forEach(t,e)}set(t,e){return Xu(this),(t=this.ba(t,!0,!1))==null?this:e==null?(super.delete(t),this):super.set(t,this.na(e,!0,!0,this.N,!1,this.M))}gb(t){var e=this.ba(t[0],!1,!0);t=t[1],t=this.N?t===void 0?null:t:this.na(t,!1,!0,void 0,!1,this.M),super.set(e,t)}has(t){return super.has(this.ba(t,!1,!1))}get(t){t=this.ba(t,!1,!1);var e=super.get(t);if(e!==void 0){var n=this.N;return n?((n=this.na(e,!1,!0,n,this.Fa,this.M))!==e&&super.set(t,n),n):e}}[Symbol.iterator](){return this.entries()}};function BS(t,e,n,i,r,s){return t=Ld(t,i,n,s),r&&(t=Ud(t)),t}function zS(t){return[t,this.get(t)]}function Ym(){return kS||(kS=new Ji(ta([]),void 0,void 0,void 0,NS))}function sl(t){return Nn?t[Nn]:void 0}function zc(t,e){for(let n in t)!isNaN(n)&&e(t,+n,t[n])}Ji.prototype.toJSON=void 0;var VS,HS,GS,sd=class{},WS={cb:!0};function XS(t,e){e<100||Js(xS,1)}function ol(t,e,n,i){var r=i!==void 0;i=!!i;var s,o=Nn;!r&&ao&&o&&(s=t[o])&&zc(s,XS),o=[];var a=t.length;s=4294967295;var c=!1,l=!!(64&e),h=l?128&e?0:-1:void 0;if(!(1&e)){var d=a&&t[a-1];d!=null&&typeof d=="object"&&d.constructor===Object?s=--a:d=void 0,!l||128&e||r||(c=!0,s=(VS??US)(s-h,h,t,d,void 0)+h)}e=void 0;for(var u=0;u<a;u++){let p=t[u];if(p!=null&&(p=n(p,i))!=null)if(l&&u>=s){let g=u-h;(e??(e={}))[g]=p}else o[u]=p}if(d)for(let p in d){if((a=d[p])==null||(a=n(a,i))==null)continue;let g;u=+p,l&&!Number.isNaN(u)&&(g=u+h)<s?o[g]=a:(e??(e={}))[p]=a}return e&&(c?o.push(e):o[s]=e),r&&Nn&&(t=sl(t))&&t instanceof sd&&(o[Nn]=function(p){var g=new sd;return zc(p,(v,m,f)=>{g[m]=Yn(f)}),g.ka=p.ka,g}(t)),o}function $S(t){return t[0]=Zo(t[0]),t[1]=Zo(t[1]),t}function Zo(t){switch(typeof t){case"number":return Number.isFinite(t)?t:""+t;case"bigint":return nd(t)?Number(t):""+t;case"boolean":return t?1:0;case"object":if(Array.isArray(t)){var e=0|t[xe];return t.length===0&&1&e?void 0:ol(t,e,Zo)}if(t!=null&&t[js]===Qs)return I0(t);if(t instanceof yi){if((e=t.g)==null)t="";else if(typeof e=="string")t=e;else{if(c0){for(var n="",i=0,r=e.length-10240;i<r;)n+=String.fromCharCode.apply(null,e.subarray(i,i+=10240));n+=String.fromCharCode.apply(null,i?e.subarray(i):e),e=btoa(n)}else{n===void 0&&(n=0),a0(),n=o0[n],i=Array(Math.floor(e.length/3)),r=n[64]||"";let l=0,h=0;for(;l<e.length-2;l+=3){var s=e[l],o=e[l+1],a=e[l+2],c=n[s>>2];s=n[(3&s)<<4|o>>4],o=n[(15&o)<<2|a>>6],a=n[63&a],i[h++]=c+s+o+a}switch(c=0,a=r,e.length-l){case 2:a=n[(15&(c=e[l+1]))<<2]||r;case 1:e=e[l],i[h]=n[e>>2]+n[(3&e)<<4|c>>4]+a+r}e=i.join("")}t=t.g=e}return t}return t instanceof Ji?t=t.size!==0?t.ea($S):void 0:void 0}return t}function I0(t){return ol(t=t.A,0|t[xe],Zo)}function es(t,e){return P0(t,e[0],e[1])}function P0(t,e,n,i=0){if(t==null){var r=32;n?(t=[n],r|=128):t=[],e&&(r=-16760833&r|(1023&e)<<14)}else{if(!Array.isArray(t))throw Error("narr");if(r=0|t[xe],Om&&1&r)throw Error("rfarr");if(2048&r&&!(2&r)&&function(){if(Om)throw Error("carr");Js(MS,5)}(),256&r)throw Error("farr");if(64&r)return(r|i)!==r&&Zt(t,r|i),t;if(n&&(r|=128,n!==t[0]))throw Error("mid");e:{r|=64;var s=(n=t).length;if(s){var o=s-1;let c=n[o];if(c!=null&&typeof c=="object"&&c.constructor===Object){if((o-=e=128&r?0:-1)>=1024)throw Error("pvtlmt");for(var a in c)(s=+a)<o&&(n[s+e]=c[a],delete c[a]);r=-16760833&r|(1023&o)<<14;break e}}if(e){if((a=Math.max(e,s-(128&r?0:-1)))>1024)throw Error("spvt");r=-16760833&r|(1023&a)<<14}}}return Zt(t,64|r|i),t}function qS(t,e){if(typeof t!="object")return t;if(Array.isArray(t)){var n=0|t[xe];return t.length===0&&1&n?void 0:Km(t,n,e)}if(t!=null&&t[js]===Qs)return Zm(t);if(t instanceof Ji){if(2&(e=t.M))return t;if(!t.size)return;if(n=ta(t.ea()),t.N)for(t=0;t<n.length;t++){let i=n[t],r=i[1];r=r==null||typeof r!="object"?void 0:r!=null&&r[js]===Qs?Zm(r):Array.isArray(r)?Km(r,0|r[xe],!!(32&e)):void 0,i[1]=r}return n}return t instanceof yi?t:void 0}function Km(t,e,n){return 2&e||(!n||4096&e||16&e?t=ho(t,e,!1,n&&!(16&e)):(ea(t,34),4&e&&Object.freeze(t))),t}function Dd(t,e,n){return t=new t.constructor(e),n&&(t.h=ss),t.m=ss,t}function Zm(t){var e=t.A,n=0|e[xe];return wn(t,n)?t:Nd(t,e,n)?Dd(t,e):ho(e,n)}function ho(t,e,n,i){return i??(i=!!(34&e)),t=ol(t,e,qS,i),i=32,n&&(i|=2),Zt(t,e=16769217&e|i),t}function Ud(t){var e=t.A,n=0|e[xe];return wn(t,n)?Nd(t,e,n)?Dd(t,e,!0):new t.constructor(ho(e,n,!1)):t}function uo(t){if(t.h!==ss)return!1;var e=t.A;return ea(e=ho(e,0|e[xe]),2048),t.A=e,t.h=void 0,t.m=void 0,!0}function ls(t){if(!uo(t)&&wn(t,0|t.A[xe]))throw Error()}function Tr(t,e){e===void 0&&(e=0|t[xe]),32&e&&!(4096&e)&&Zt(t,4096|e)}function Nd(t,e,n){return!!(2&n)||!(!(32&n)||4096&n)&&(Zt(e,2|n),t.h=ss,!0)}var L0=Kt(0),vr={};function kt(t,e,n,i){if((e=ji(t.A,e,void 0,i))!==null||n&&t.m!==ss)return e}function ji(t,e,n,i){if(e===-1)return null;var r=e+(n?0:-1),s=t.length-1;if(!(s<1+(n?0:-1))){if(r>=s){var o=t[s];if(o!=null&&typeof o=="object"&&o.constructor===Object){n=o[e];var a=!0}else{if(r!==s)return;n=o}}else n=t[r];if(i&&n!=null){if((i=i(n))==null)return i;if(!Object.is(i,n))return a?o[e]=i:t[r]=i,i}return n}}function ze(t,e,n,i){ls(t);var r=t.A;return Gt(r,0|r[xe],e,n,i),t}function Gt(t,e,n,i,r){var s=n+(r?0:-1),o=t.length-1;if(o>=1+(r?0:-1)&&s>=o){let a=t[o];if(a!=null&&typeof a=="object"&&a.constructor===Object)return a[n]=i,e}return s<=o?(t[s]=i,e):(i!==void 0&&(n>=(o=(e??(e=0|t[xe]))>>14&1023||536870912)?i!=null&&(t[o+(r?0:-1)]={[n]:i}):t[s]=i),e)}function D0(t,e,n,i){var r=t.A;return B0(r,0|r[xe],e,t=O0(t,i)===n?n:-1)!==void 0}function Zr(){return bS===void 0?2:4}function Jr(t,e,n,i,r){var s=t.A,o=0|s[xe];i=wn(t,o)?1:i,r=!!r||i===3,i===2&&uo(t)&&(o=0|(s=t.A)[xe]);var a=(t=Fd(s,e))===wr?7:0|t[xe],c=Od(a,o),l=!(4&c);if(l){4&c&&(t=Yn(t),a=0,c=Mr(c,o),o=Gt(s,o,e,t));let h=0,d=0;for(;h<t.length;h++){let u=n(t[h]);u!=null&&(t[d++]=u)}d<h&&(t.length=d),n=-513&c|4,c=n&=-1025,c&=-4097}return c!==a&&(Zt(t,c),2&c&&Object.freeze(t)),U0(t,c,s,o,e,i,l,r)}function U0(t,e,n,i,r,s,o,a){var c=e;return s===1||s===4&&(2&e||!(16&e)&&32&i)?xr(e)||((e|=!t.length||o&&!(4096&e)||32&i&&!(4096&e||16&e)?2:256)!==c&&Zt(t,e),Object.freeze(t)):(s===2&&xr(e)&&(t=Yn(t),c=0,e=Mr(e,i),i=Gt(n,i,r,t)),xr(e)||(a||(e|=16),e!==c&&Zt(t,e))),2&e||!(4096&e||16&e)||Tr(n,i),t}function Fd(t,e,n){return t=ji(t,e,n),Array.isArray(t)?t:wr}function Od(t,e){return 2&e&&(t|=2),1|t}function xr(t){return!!(2&t)&&!!(4&t)||!!(256&t)}function N0(t){return tl(t,!0)}function F0(t){t=Yn(t);for(let e=0;e<t.length;e++){let n=t[e]=Yn(t[e]);Array.isArray(n[1])&&(n[1]=ta(n[1]))}return Ko(t)}function ra(t,e,n,i){ls(t),Gt(t=t.A,0|t[xe],e,(i==="0"?Number(n)===0:n===i)?void 0:n)}function Ar(t,e,n){if(2&e)throw Error();var i=co(e),r=Fd(t,n,i),s=r===wr?7:0|r[xe],o=Od(s,e);return(2&o||xr(o)||16&o)&&(o===s||xr(o)||Zt(r,o),r=Yn(r),s=0,o=Mr(o,e),Gt(t,e,n,r,i)),(o&=-13)!==s&&Zt(r,o),r}function O0(t,e){return Bd(kd(t=t.A),t,void 0,e)}function kd(t){if(ao)return t[Bo]??(t[Bo]=new Map);if(Bo in t)return t[Bo];var e=new Map;return Object.defineProperty(t,Bo,{value:e}),e}function k0(t,e,n,i,r){var s=kd(t),o=Bd(s,t,e,n,r);return o!==i&&(o&&(e=Gt(t,e,o,void 0,r)),s.set(n,i)),e}function Bd(t,e,n,i,r){var s=t.get(i);if(s!=null)return s;s=0;for(let o=0;o<i.length;o++){let a=i[o];ji(e,a,r)!=null&&(s!==0&&(n=Gt(e,n,s,void 0,r)),s=a)}return t.set(i,s),s}function zd(t,e,n){var i=0|t[xe],r=co(i),s=ji(t,n,r);if(s!=null&&s[js]===Qs){if(!wn(s))return uo(s),s.A;var o=s.A}else Array.isArray(s)&&(o=s);if(o){let a=0|o[xe];2&a&&(o=ho(o,a))}return(o=es(o,e))!==s&&Gt(t,i,n,o,r),o}function B0(t,e,n,i,r){var s=!1;if((i=ji(t,i,r,o=>{var a=Ld(o,n,!1,e);return s=a!==o&&a!=null,a}))!=null)return s&&!wn(i)&&Tr(t,e),i}function lt(t,e,n,i){var r=t.A,s=0|r[xe];if((e=B0(r,s,e,n,i))==null)return e;if(!wn(t,s=0|r[xe])){let o=Ud(e);o!==e&&(uo(t)&&(s=0|(r=t.A)[xe]),Tr(r,s=Gt(r,s,n,e=o,i)))}return e}function z0(t,e,n,i,r,s,o,a){var c=wn(t,n);s=c?1:s,o=!!o||s===3,c=a&&!c,(s===2||c)&&uo(t)&&(n=0|(e=t.A)[xe]);var l=(t=Fd(e,r))===wr?7:0|t[xe],h=Od(l,n);if(a=!(4&h)){var d=t,u=n;let p=!!(2&h);p&&(u|=2);let g=!p,v=!0,m=0,f=0;for(;m<d.length;m++){let S=Ld(d[m],i,!1,u);if(S instanceof i){if(!p){let w=wn(S);g&&(g=!w),v&&(v=w)}d[f++]=S}}f<m&&(d.length=f),h|=4,h=v?-4097&h:4096|h,h=g?8|h:-9&h}if(h!==l&&(Zt(t,h),2&h&&Object.freeze(t)),c&&!(8&h||!t.length&&(s===1||s===4&&(2&h||!(16&h)&&32&n)))){for(xr(h)&&(t=Yn(t),h=Mr(h,n),n=Gt(e,n,r,t)),i=t,c=h,l=0;l<i.length;l++)(d=i[l])!==(h=Ud(d))&&(i[l]=h);c|=8,Zt(t,h=c=i.length?4096|c:-4097&c)}return U0(t,h,e,n,r,s,a,o)}function Qi(t,e,n){var i=t.A;return z0(t,i,0|i[xe],e,n,Zr(),!1,!0)}function V0(t){return t==null&&(t=void 0),t}function De(t,e,n,i,r){return ze(t,n,i=V0(i),r),i&&!wn(i)&&Tr(t.A),t}function Mi(t,e,n,i){e:{var r=i=V0(i);ls(t);let s=t.A,o=0|s[xe];if(r==null){let a=kd(s);if(Bd(a,s,o,n)!==e)break e;a.set(n,0)}else o=k0(s,o,n,e);Gt(s,o,e,r)}return i&&!wn(i)&&Tr(t.A),t}function od(t,e,n){ls(t);var i=t.A,r=0|i[xe];if(n==null)return Gt(i,r,e),t;var s=n===wr?7:0|n[xe],o=s,a=xr(s),c=a||Object.isFrozen(n),l=!0,h=!0;for(let u=0;u<n.length;u++){var d=n[u];a||(d=wn(d),l&&(l=!d),h&&(h=d))}return a||(s=l?13:5,s=h?-4097&s:4096|s),c&&s===o||(n=Yn(n),o=0,s=Mr(s,r)),s!==o&&Zt(n,s),r=Gt(i,r,e,n),2&s||!(4096&s||16&s)||Tr(i,r),t}function Mr(t,e){return-273&(2&e?2|t:-3&t)}function Jo(t,e,n,i){var r=i;ls(t),t=z0(t,i=t.A,0|i[xe],n,e,2,!0),r=r??new n,t.push(r),e=n=t===wr?7:0|t[xe],(r=wn(r))?(n&=-9,t.length===1&&(n&=-4097)):n|=4096,n!==e&&Zt(t,n),r||Tr(i)}function qn(t,e,n){return cs(kt(t,e,n))}function Ht(t,e){return kt(t,e,void 0,ai)??0}function Jm(t,e,n){return lt(t,e,n=O0(t,of)===n?n:-1,void 0)}function ad(t,e){ra(t,3,e==null?e:Oc(e),!1)}function bi(t,e,n){if(n!=null){if(typeof n!="number"||!ia(n))throw Yo("int32");n|=0}ze(t,e,n)}function $u(t,e,n){return ze(t,e,n==null?n:M0(n))}function Cc(t,e,n){return ze(t,e,n==null?n:function(i){if(!lo(i))throw Yo("uint64");switch(typeof i){case"string":var r=Sr(Number(i));return xi(r)&&r>=0?i=Kt(r):((r=i.indexOf("."))!==-1&&(i=i.substring(0,r)),i=os()?Kt(rd(64,BigInt(i))):Kt(S0(i))),i;case"bigint":return Kt(rd(64,i));default:return xi(i)?i=Kt(E0(i)):((i=Sr(i))>=0&&xi(i)?i=String(i):(as(i),i=eo(st,_t)),i=Kt(i)),i}}(n))}function Le(t,e,n){ze(t,e,n==null?n:y0(n))}function qs(t,e,n){ra(t,e,n==null?n:y0(n),0)}function Fn(t,e,n){ra(t,e,Yi(n),"")}function Vc(t,e,n){{ls(t);let o=t.A,a=0|o[xe];if(n==null)Gt(o,a,e);else{var i=t=n===wr?7:0|n[xe],r=xr(t),s=r||Object.isFrozen(n);for(r||(t=0),s||(n=Yn(n),i=0,t=Mr(t,a),s=!1),t|=5,t|=(4&t?512&t?512:1024&t?1024:0:void 0)??1024,r=0;r<n.length;r++){let c=n[r],l=C0(c);Object.is(c,l)||(s&&(n=Yn(n),i=0,t=Mr(t,a),s=!1),n[r]=l)}t!==i&&(s&&(n=Yn(n),t=Mr(t,a)),Zt(n,t)),Gt(o,a,e,n)}}}function al(t,e,n){ls(t),Jr(t,e,ln,2,!0).push(C0(n))}var Xs=class{constructor(t,e,n){if(this.buffer=t,n&&!e)throw Error();this.g=e}};function cl(t,e){if(typeof t=="string")return new Xs(l0(t),e);if(Array.isArray(t))return new Xs(new Uint8Array(t),e);if(t.constructor===Uint8Array)return new Xs(t,!1);if(t.constructor===ArrayBuffer)return t=new Uint8Array(t),new Xs(t,!1);if(t.constructor===yi)return e=Ad(t)||new Uint8Array(0),new Xs(e,!0,t);if(t instanceof Uint8Array)return t=t.constructor===Uint8Array?t:new Uint8Array(t.buffer,t.byteOffset,t.byteLength),new Xs(t,!1);throw Error()}function Vd(t,e){var n=0,i=0,r=0,s=t.h,o=t.g;do{var a=s[o++];n|=(127&a)<<r,r+=7}while(r<32&&128&a);if(r>32)for(i|=(127&a)>>4,r=3;r<32&&128&a;r+=7)i|=(127&(a=s[o++]))<<r;if(ts(t,o),!(128&a))return e(n>>>0,i>>>0);throw Error()}function Hd(t){for(var e=0,n=t.g,i=n+10,r=t.h;n<i;){let s=r[n++];if(e|=s,!(128&s))return ts(t,n),!!(127&e)}throw Error()}function er(t){var e=t.h,n=t.g,i=e[n++],r=127&i;if(128&i&&(r|=(127&(i=e[n++]))<<7,128&i&&(r|=(127&(i=e[n++]))<<14,128&i&&(r|=(127&(i=e[n++]))<<21,128&i&&(r|=(i=e[n++])<<28,128&i&&128&e[n++]&&128&e[n++]&&128&e[n++]&&128&e[n++]&&128&e[n++])))))throw Error();return ts(t,n),r}function Si(t){return er(t)>>>0}function Hc(t){return Vd(t,v0)}function cd(t){var e=t.h,n=t.g,i=e[n],r=e[n+1],s=e[n+2];return e=e[n+3],ts(t,t.g+4),(i|r<<8|s<<16|e<<24)>>>0}function Gc(t){var e=cd(t);t=2*(e>>31)+1;var n=e>>>23&255;return e&=8388607,n==255?e?NaN:t*(1/0):n==0?1401298464324817e-60*t*e:t*Math.pow(2,n-150)*(e+8388608)}function YS(t){return er(t)}function ts(t,e){if(t.g=e,e>t.j)throw Error()}function H0(t,e){if(e<0)throw Error();var n=t.g;if((e=n+e)>t.j)throw Error();return t.g=e,n}function G0(t,e){if(e==0)return rs();var n=H0(t,e);return t.fa&&t.o?n=t.h.subarray(n,n+e):(t=t.h,n=n===(e=n+e)?new Uint8Array(0):CS?t.slice(n,e):new Uint8Array(t.subarray(n,e))),n.length==0?rs():new yi(n,Zs)}var KS=class{constructor(t,e,n,i){this.h=null,this.o=!1,this.g=this.j=this.m=0,this.init(t,e,n,i)}init(t,e,n,{fa:i=!1,ma:r=!1}={}){this.fa=i,this.ma=r,t&&(t=cl(t,this.ma),this.h=t.buffer,this.o=t.g,this.m=e||0,this.j=n!==void 0?this.m+n:this.h.length,this.g=this.m)}clear(){this.h=null,this.o=!1,this.g=this.j=this.m=0,this.fa=!1}},jm=[],to=0;function W0(t,e,n,i){if(Wc.length){let r=Wc.pop();return r.v(i),r.g.init(t,e,n,i),r}return new ZS(t,e,n,i)}function X0(t){t.g.clear(),t.j=-1,t.h=-1,Wc.length<100&&Wc.push(t)}function $0(t){var e=t.g;if(e.g==e.j)return!1;t.m=t.g.g;var n=Si(t.g);if(e=n>>>3,!((n&=7)>=0&&n<=5)||e<1)throw Error();return t.j=e,t.h=n,!0}function Ic(t){try{switch(t.h){case 0:t.h!=0?Ic(t):Hd(t.g);break;case 1:var e=t.g;ts(e,e.g+8);break;case 2:if(t.h!=2)Ic(t);else{var n=Si(t.g),i=t.g;ts(i,i.g+n)}break;case 5:var r=t.g;ts(r,r.g+4);break;case 3:q0();let s=t.j;try{for(;;){if(!$0(t))throw Error();if(t.h==4){if(t.j!=s)throw Error();break}Ic(t)}}catch(o){throw o instanceof RangeError?new SyntaxError:o}finally{to>0&&to--}break;default:throw Error()}}catch(s){throw s instanceof RangeError?new SyntaxError:s}}function q0(){if(to>=100)throw new SyntaxError;to++}function sa(t,e,n){var i=t.g.j,r=Si(t.g),s=(r=t.g.g+r)-i;if(s<=0&&(t.g.j=r,n(e,t,void 0,void 0,void 0),s=r-t.g.g),s)throw Error();return t.g.g=r,t.g.j=i,e}function Gd(t){var e=Si(t.g),n=H0(t=t.g,e);if(t=t.h,lS){var i,r=t;(i=Wu)||(i=Wu=new TextDecoder("utf-8",{fatal:!0})),e=n+e,r=n===0&&e===r.length?r:r.subarray(n,e);try{var s=i.decode(r)}catch(a){if(bc===void 0){try{i.decode(new Uint8Array([128]))}catch{}try{i.decode(new Uint8Array([97])),bc=!0}catch{bc=!1}}throw!bc&&(Wu=void 0),a}}else{e=(s=n)+e,n=[];let a,c=null;for(;s<e;){var o=t[s++];o<128?n.push(o):o<224?s>=e?Yr():(a=t[s++],o<194||(192&a)!=128?(s--,Yr()):n.push((31&o)<<6|63&a)):o<240?s>=e-1?Yr():(a=t[s++],(192&a)!=128||o===224&&a<160||o===237&&a>=160||(192&(i=t[s++]))!=128?(s--,Yr()):n.push((15&o)<<12|(63&a)<<6|63&i)):o<=244?s>=e-2?Yr():(a=t[s++],(192&a)!=128||a-144+(o<<28)>>30||(192&(i=t[s++]))!=128||(192&(r=t[s++]))!=128?(s--,Yr()):(o=(7&o)<<18|(63&a)<<12|(63&i)<<6|63&r,o-=65536,n.push(55296+(o>>10&1023),56320+(1023&o)))):Yr(),n.length>=8192&&(c=Fm(c,n),n.length=0)}s=Fm(c,n)}return s}function Wd(t){var e=Si(t.g);return G0(t.g,e)}function oa(t,e,n){var i=Si(t.g);for(i=t.g.g+i;t.g.g<i;)n.push(e(t.g))}var ZS=class{constructor(t,e,n,i){if(jm.length){let r=jm.pop();r.init(t,e,n,i),t=r}else t=new KS(t,e,n,i);this.g=t,this.m=this.g.g,this.h=this.j=-1,this.v(i)}v({ra:t=!1}={}){this.ra=t}},Wc=[];function JS(t){return new Xc(4294967295&t,Math.floor(t/4294967296))}function Qm(t){return t?/^\d+$/.test(t)?(na(t),new Xc(st,_t)):null:jS||(jS=new Xc(0,0))}var jS,Xc=class{constructor(t,e){this.h=t>>>0,this.g=e>>>0}};function QS(t){return new $c(4294967295&t,Math.floor(t/4294967296))}function Y0(t){return t?/^-?\d+$/.test(t)?(na(t),new $c(st,_t)):null:e3||(e3=new $c(0,0))}var e3,eg,tg,ng,qu,ig,zo,Sc,$c=class{constructor(t,e){this.h=t>>>0,this.g=e>>>0}};function K0(t,e,n){return typeof BigInt64Array<"u"?(zo||(zo=new BigInt64Array(1),Sc=new Uint32Array(zo.buffer),zo[0]=BigInt(1),ig=Sc[0]===1),zo[0]=t,new e(Sc[t=ig?0:1],Sc[1-t])):(qu||(eg=BigInt(Number.MIN_SAFE_INTEGER),tg=BigInt(Number.MAX_SAFE_INTEGER),ng=BigInt(4294967295),qu=BigInt(32)),t>=eg&&t<=tg?n(Number(t)):(t=BigInt.asUintN(64,t),new e(Number(t&ng),Number(t>>qu))))}function Zi(t,e,n){for(;n>0||e>127;)t.g.push(127&e|128),e=(e>>>7|n<<25)>>>0,n>>>=7;t.g.push(e)}function fo(t,e){for(;e>127;)t.g.push(127&e|128),e>>>=7;t.g.push(e)}function aa(t,e){if(e>=0)fo(t,e);else{for(let n=0;n<9;n++)t.g.push(127&e|128),e>>=7;t.g.push(1)}}function t3(t,e){na(e),function(n){var i=_t>>31;n(st<<1^i,(_t<<1|st>>>31)^i)}((n,i)=>{Zi(t,n>>>0,i>>>0)})}function jo(t,e){t.g.push(e>>>0&255),t.g.push(e>>>8&255),t.g.push(e>>>16&255),t.g.push(e>>>24&255)}var n3=class{constructor(){this.g=[]}length(){return this.g.length}end(){var t=this.g;return this.g=[],t}};function no(t,e){e.length!==0&&(t.j.push(e),t.h+=e.length)}function pn(t,e,n){fo(t.g,8*e+n)}function Xd(t,e){return pn(t,e,2),e=t.g.end(),no(t,e),e.push(t.h),e}function $d(t,e){var n=e.pop();for(n=t.h+t.g.length()-n;n>127;)e.push(127&n|128),n>>>=7,t.h++;e.push(n),t.h++}function Z0(t,e,n){if(n!=null)switch(pn(t,e,0),typeof n){case"number":t=t.g,as(n),Zi(t,st,_t);break;case"bigint":n=K0(n,$c,QS),Zi(t.g,n.h,n.g);break;default:n=Y0(n),Zi(t.g,n.h,n.g)}}function ca(t,e,n){pn(t,e,2),fo(t.g,n.length),no(t,t.g.end()),no(t,n)}function qc(t,e,n,i){n!=null&&(e=Xd(t,e),i(n,t),$d(t,e))}var i3=class{constructor(){this.j=[],this.h=0,this.g=new n3}};function J0(t){typeof t=="string"&&Y0(t)}function Kn(){var t=class{constructor(){throw Error()}};return Object.setPrototypeOf(t,t.prototype),t}var qd=Kn(),j0=Kn(),Yd=Kn(),ll=Kn(),Kd=Kn(),hl=Kn(),r3=Kn(),s3=Kn(),ul=Kn(),o3=Kn(),dl=Kn(),Zd=Kn();function wi(t,e,n){var i=t.A;Nn&&Nn in i&&(i=i[Nn])&&delete i[e.g],e.h?e.o(t,e.h,e.g,n,e.j):e.o(t,e.g,n,e.j)}var de=class{constructor(t,e){this.A=P0(t,e,void 0,2048)}toJSON(){return I0(this)}o(){var t=X3,e=this.A,n=t.g,i=Nn;if(ao&&i&&e[i]?.[n]!=null&&Js(yS,3),e=t.g,Hm&&Nn&&Hm===void 0&&(i=(n=this.A)[Nn])&&(i=i.ka))try{i(n,e,WS)}catch(r){s0(r)}return t.h?t.m(this,t.h,t.g,t.j):t.m(this,t.g,t.defaultValue,t.j)}clone(){var t=this.A,e=0|t[xe];return Nd(this,t,e)?Dd(this,t,!0):new this.constructor(ho(t,e,!1))}};de.prototype[js]=Qs,de.prototype.toString=function(){return this.A.toString()};var po=class{constructor(t,e,n){this.g=t,this.h=e,t=qd,this.j=!!t&&n===t||!1}};function fl(t,e){return new po(t,e,qd)}function Q0(t,e,n,i,r){qc(t,n,i_(e,i),r)}var e_,t_,a3=fl(function(t,e,n,i,r){return t.h===2&&(sa(t,zd(e,i,n),r),!0)},Q0),c3=fl(function(t,e,n,i,r){return t.h===2&&(sa(t,zd(e,i,n),r),!0)},Q0),pl=Symbol(),ml=Symbol(),ld=Symbol(),rg=Symbol(),sg=Symbol();function hs(t,e,n,i){var r=i[t];if(r)return r;(r={}).Ea=i,r.ca=function(d){switch(typeof d){case"boolean":return HS||(HS=[0,void 0,!0]);case"number":return d>0?void 0:d===0?GS||(GS=[0,void 0]):[-d,void 0];case"string":return[0,d];case"object":return d}}(i[0]);var s=i[1],o=1;s&&s.constructor===Object&&(r.ia=s,typeof(s=i[++o])=="function"&&(r.wa=!0,e_??(e_=s),t_??(t_=i[o+1]),s=i[o+=2]));for(var a={};s&&Array.isArray(s)&&s.length&&typeof s[0]=="number"&&s[0]>0;){for(var c=0;c<s.length;c++)a[s[c]]=s;s=i[++o]}for(c=1;s!==void 0;){let d;typeof s=="number"&&(c+=s,s=i[++o]);var l=void 0;if(s instanceof po?d=s:(d=a3,o--),d?.j){s=i[++o],l=i;var h=o;typeof s=="function"&&(s=s(),l[h]=s),l=s}for(h=c+1,typeof(s=i[++o])=="number"&&s<0&&(h-=s,s=i[++o]);c<h;c++){let u=a[c];l?n(r,c,d,l,u):e(r,c,d,u)}}return i[t]=r}function n_(t){return Array.isArray(t)?t[0]instanceof po?t:[c3,t]:[t,void 0]}function i_(t,e){return t instanceof de?t.A:Array.isArray(t)?es(t,e):void 0}function Jd(t,e,n,i){var r=n.g;t[e]=i?(s,o,a)=>r(s,o,a,i):r}function jd(t,e,n,i,r){var s,o,a=n.g;t[e]=(c,l,h)=>a(c,l,h,o||(o=hs(ml,Jd,jd,i).ca),s||(s=Qd(i)),r)}function Qd(t){var e=t[ld];if(e!=null)return e;var n=hs(ml,Jd,jd,t);return e=n.wa?(i,r)=>e_(i,r,n):(i,r)=>{e:{q0();try{for(;$0(r)&&r.h!=4;){let u=r.j,p=n[u];if(p==null){let g=n.ia;if(g){let v=g[u];if(v){let m=h3(v);m!=null&&(p=n[u]=m)}}}if(p==null||!p(r,i,u)){var s=r;let g=s.m;if(Ic(s),s.ra)var o=void 0;else{let v=s.g.g-g;s.g.g=g,o=G0(s.g,v)}s=void 0;var a=i,c=u,l=o;l&&((s=a[Nn]??(a[Nn]=new sd))[c]??(s[c]=[])).push(l)}}let d=sl(i);d&&(d.ka=n.Ea[sg]);var h=!0;break e}catch(d){throw d instanceof RangeError?new SyntaxError:d}finally{to>0&&to--}h=void 0}return h},t[ld]=e,t[sg]=l3.bind(t),e}function l3(t,e,n,i){var r=this[ml],s=this[ld],o=es(void 0,r.ca),a=sl(t);if(a){var c=!1,l=r.ia;if(l){if(r=(h,d,u)=>{if(u.length!==0)if(l[d])for(let p of u){h=W0(p);try{c=!0,s(o,h)}finally{X0(h)}}else i?.(t,d,u)},e==null)zc(a,r);else if(a!=null){let h=a[e];h&&r(a,e,h)}if(c){let h=0|t[xe];if(2&h&&2048&h&&!n?.cb)throw Error();let d=co(h),u=(p,g)=>{if(ji(t,p,d)!=null){if(n?.lb===1)return;throw Error()}g!=null&&(h=Gt(t,h,p,g,d)),delete a[p]};e==null?p0(o,0|o[xe],(p,g)=>{u(p,g)}):u(e,ji(o,e,d))}}}}function h3(t){var e=(t=n_(t))[0].g;if(t=t[1]){let n=Qd(t),i=hs(ml,Jd,jd,t).ca;return(r,s,o)=>e(r,s,o,i,n)}return e}function gl(t,e,n){t[e]=n.h}function _l(t,e,n,i){var r,s,o=n.h;t[e]=(a,c,l)=>o(a,c,l,s||(s=hs(pl,gl,_l,i).ca),r||(r=r_(i)))}function r_(t){var e=t[rg];if(!e){let n=hs(pl,gl,_l,t);e=(i,r)=>s_(i,r,n),t[rg]=e}return e}function s_(t,e,n){p0(t,0|t[xe],(i,r)=>{if(r!=null){var s=function(o,a){var c=o[a];if(c)return c;if((c=o.ia)&&(c=c[a])){var l=(c=n_(c))[0].h;if(c=c[1]){let h=r_(c),d=hs(pl,gl,_l,c).ca;c=o.wa?t_(d,h):(u,p,g)=>l(u,p,g,d,h)}else c=l;return o[a]=c}}(n,i);s?s(e,r,i):i<500||Js(td,3)}}),(t=sl(t))&&zc(t,(i,r,s)=>{for(no(e,e.g.end()),i=0;i<s.length;i++)no(e,Ad(s[i])||new Uint8Array(0))})}var u3=Kt(0);function tr(t,e,n){if(Array.isArray(e)){var i=0|e[xe];if(4&i)return e;for(var r=0,s=0;r<e.length;r++){let o=t(e[r]);o!=null&&(e[s++]=o)}return s<r&&(e.length=s),t=1|i,n&&(t=-1537&t|4),t!==i&&Zt(e,t),n&&2&t&&Object.freeze(e),e}}var o_=(t,e)=>{var n=new i3;s_(t.A,n,hs(pl,gl,_l,e)),no(n,n.g.end()),t=new Uint8Array(n.h);var i=(e=n.j).length,r=0;for(let s=0;s<i;s++){let o=e[s];t.set(o,r),r+=o.length}return n.j=[t],t};function Xt(t,e,n){return new po(t,e,n)}function nr(t,e,n){return new po(t,e,n)}function nn(t,e,n){Gt(t,0|t[xe],e,n,co(0|t[xe]))}var d3=fl(function(t,e,n,i,r){if(t.h!==2)return!1;if(t=Yn(t=sa(t,es([void 0,void 0],i),r)),r=co(i=0|e[xe]),2&i)throw Error();var s=ji(e,n,r);if(s instanceof Ji)2&s.M?((s=s.ea()).push(t),Gt(e,i,n,s,r)):s.gb(t);else if(Array.isArray(s)){var o=0|s[xe];8192&o||Zt(s,o|=8192),2&o&&Gt(e,i,n,s=F0(s),r),s.push(t)}else Gt(e,i,n,Ko([t]),r);return!0},function(t,e,n,i,r){if(e instanceof Ji)e.forEach((s,o)=>{qc(t,n,es([o,s],i),r)});else if(Array.isArray(e)){for(let s=0;s<e.length;s++){let o=e[s];Array.isArray(o)&&qc(t,n,es(o,i),r)}Ko(e)}});function a_(t,e,n){(e=ai(e))!=null&&(pn(t,n,5),t=t.g,Rd(e),jo(t,st))}function ef(t,e,n){(e=Pd(e))!=null&&(J0(e),Z0(t,n,e))}function c_(t,e,n){(e=cs(e))!=null&&e!=null&&(pn(t,n,0),aa(t.g,e))}function l_(t,e,n){(e=e==null||typeof e=="boolean"?e:typeof e=="number"?!!e:void 0)!=null&&(pn(t,n,0),t.g.g.push(e?1:0))}function h_(t,e,n){(e=ln(e))!=null&&ca(t,n,r0(e))}function u_(t,e,n,i,r){qc(t,n,i_(e,i),r)}function tf(t,e,n){(e=R0(e))!=null&&ca(t,n,cl(e,!0).buffer)}function d_(t,e,n){(e=x0(e))!=null&&e!=null&&(pn(t,n,0),fo(t.g,e))}function f_(t,e,n){(e=cs(e))!=null&&(e=parseInt(e,10),pn(t,n,0),aa(t.g,e))}function p_(t,e,n){return(t.h===5||t.h===2)&&(e=Ar(e,0|e[xe],n),t.h==2?oa(t,Gc,e):e.push(Gc(t.g)),!0)}function m_(t,e,n){return t.h===0&&(nn(e,n,Hc(t.g)),!0)}function g_(t,e,n){return(t.h===0||t.h===2)&&(e=Ar(e,0|e[xe],n),t.h==2?oa(t,er,e):e.push(er(t.g)),!0)}function __(t,e,n){return t.h===2&&(nn(e,n,(t=Wd(t))===rs()?void 0:t),!0)}var og=Xt(function(t,e,n){if(t.h!==1)return!1;var i=t.g;t=cd(i);var r=cd(i);i=2*(r>>31)+1;var s=r>>>20&2047;return t=4294967296*(1048575&r)+t,nn(e,n,s==2047?t?NaN:i*(1/0):s==0?5e-324*i*t:i*Math.pow(2,s-1075)*(t+4503599627370496)),!0},function(t,e,n){(e=ai(e))!=null&&(pn(t,n,1),t=t.g,(n=g0||(g0=new DataView(new ArrayBuffer(8)))).setFloat64(0,+e,!0),st=n.getUint32(0,!0),_t=n.getUint32(4,!0),jo(t,st),jo(t,_t))},o3),Bt=Xt(function(t,e,n){return t.h===5&&(nn(e,n,Gc(t.g)),!0)},a_,ul),f3=nr(p_,function(t,e,n){if((e=tr(ai,e,!0))!=null)for(let o=0;o<e.length;o++){var i=t,r=n,s=e[o];s!=null&&(pn(i,r,5),i=i.g,Rd(s),jo(i,st))}},ul),nf=nr(p_,function(t,e,n){if((e=tr(ai,e,!0))!=null&&e.length){pn(t,n,2),fo(t.g,4*e.length);for(let i=0;i<e.length;i++)n=t.g,Rd(e[i]),jo(n,st)}},ul),v_=Xt(function(t,e,n){return t.h===5&&(nn(e,n,(t=Gc(t.g))===0?void 0:t),!0)},a_,ul),Vo=Xt(function(t,e,n){return m_(t,e,n)},ef,hl),Ct=Xt(function(t,e,n){return m_(t,e,n)},ef,hl),p3=nr(function(t,e,n){return t.h!==0&&t.h!==2?t=!1:(e=Ar(e,0|e[xe],n),t.h==2?oa(t,Hc,e):e.push(Hc(t.g)),t=!0),t},function(t,e,n){if((e=tr(Pd,e,!1))!=null)for(let i=0;i<e.length;i++)Z0(t,n,e[i])},hl),Pc=Xt(function(t,e,n){return t.h!==0?e=!1:(nn(e,n,(t=Hc(t.g))===u3?void 0:t),e=!0),e},ef,hl),Yc=Xt(function(t,e,n){return t.h!==0?t=!1:(nn(e,n,Vd(t.g,IS)),t=!0),t},function(t,e,n){if(e=function(i){if(i==null)return i;var r=typeof i;if(r==="bigint")return String(rd(64,i));if(lo(i)){if(r==="string")return r=Sr(Number(i)),xi(r)&&r>=0?i=String(r):((r=i.indexOf("."))!==-1&&(i=i.substring(0,r)),i=S0(i)),i;if(r==="number")return E0(i)}}(e),e!=null&&(typeof e=="string"&&Qm(e),e!=null))switch(pn(t,n,0),typeof e){case"number":t=t.g,as(e),Zi(t,st,_t);break;case"bigint":n=K0(e,Xc,JS),Zi(t.g,n.h,n.g);break;default:n=Qm(e),Zi(t.g,n.h,n.g)}},r3),nt=Xt(function(t,e,n){return t.h===0&&(nn(e,n,er(t.g)),!0)},c_,ll),ag=nr(g_,function(t,e,n){if((e=tr(cs,e,!0))!=null)for(let o=0;o<e.length;o++){var i=t,r=n,s=e[o];s!=null&&(pn(i,r,0),aa(i.g,s))}},ll),mo=nr(g_,function(t,e,n){if((e=tr(cs,e,!0))!=null&&e.length){n=Xd(t,n);for(let i=0;i<e.length;i++)aa(t.g,e[i]);$d(t,n)}},ll),jr=Xt(function(t,e,n){return t.h===0&&(nn(e,n,(t=er(t.g))===0?void 0:t),!0)},c_,ll),We=Xt(function(t,e,n){return t.h===0&&(nn(e,n,Hd(t.g)),!0)},l_,j0),br=Xt(function(t,e,n){return t.h===0&&(nn(e,n,(t=Hd(t.g))===!1?void 0:t),!0)},l_,j0),cn=nr(function(t,e,n){return t.h===2&&(t=Gd(t),Ar(e,0|e[xe],n).push(t),!0)},function(t,e,n){if((e=tr(ln,e,!0))!=null)for(let o=0;o<e.length;o++){var i=t,r=n,s=e[o];s!=null&&ca(i,r,r0(s))}},Yd),$i=Xt(function(t,e,n){return t.h===2&&(nn(e,n,(t=Gd(t))===""?void 0:t),!0)},h_,Yd),ie=Xt(function(t,e,n){return t.h===2&&(nn(e,n,Gd(t)),!0)},h_,Yd),wt=function(t,e,n=qd){return new po(t,e,n)}(function(t,e,n,i,r){return t.h===2&&(i=es(void 0,i),Ar(e,0|e[xe],n).push(i),sa(t,i,r),!0)},function(t,e,n,i,r){if(Array.isArray(e)){for(let s=0;s<e.length;s++)u_(t,e[s],n,i,r);1&(t=0|e[xe])||Zt(e,1|t)}}),tt=fl(function(t,e,n,i,r,s){if(t.h!==2)return!1;var o=0|e[xe];return k0(e,o,s,n,co(o)),sa(t,e=zd(e,i,n),r),!0},u_),Ys=Xt(function(t,e,n){return t.h===2&&(nn(e,n,Wd(t)),!0)},tf,dl),y_=nr(function(t,e,n){return t.h===2&&(t=Wd(t),Ar(e,0|e[xe],n).push(t),!0)},function(t,e,n){if((e=tr(R0,e,!1))!=null)for(let o=0;o<e.length;o++){var i=t,r=n,s=e[o];s!=null&&ca(i,r,cl(s,!0).buffer)}},dl),x_=Xt(function(t,e,n){return t.h===0&&(nn(e,n,Si(t.g)),!0)},d_,Kd),m3=nr(function(t,e,n){return(t.h===0||t.h===2)&&(e=Ar(e,0|e[xe],n),t.h==2?oa(t,Si,e):e.push(Si(t.g)),!0)},function(t,e,n){if((e=tr(x0,e,!0))!=null)for(let o=0;o<e.length;o++){var i=t,r=n,s=e[o];s!=null&&(pn(i,r,0),fo(i.g,s))}},Kd),g3=Xt(function(t,e,n){return t.h===0&&(nn(e,n,(t=Si(t.g))===0?void 0:t),!0)},d_,Kd),be=Xt(function(t,e,n){return t.h===0&&(nn(e,n,er(t.g)),!0)},f_,Zd),Lc=Xt(function(t,e,n){return t.h===0&&(nn(e,n,(t=er(t.g))===0?void 0:t),!0)},f_,Zd),_3=Xt(function(t,e,n){return t.h!==0?t=!1:(nn(e,n,function(i){return Vd(i,(r,s)=>{var o=-(1&r);return v0(r=(r>>>1|s<<31)^o,s>>>1^o)})}(t.g)),t=!0),t},function(t,e,n){if((e=Pd(e))!=null&&(J0(e),e!=null))switch(pn(t,n,0),typeof e){case"number":t=t.g,e=(n=e)<0,id(n=2*Math.abs(n)),n=st;let i=_t;e&&(n==0?i==0?i=n=4294967295:(i--,n=4294967295):n--),Zi(t,st=n,_t=i);break;case"bigint":t=t.g,e=e<<BigInt(1)^e>>BigInt(63),st=Number(BigInt.asUintN(32,e)),_t=Number(BigInt.asUintN(32,e>>BigInt(32))),Zi(t,st,_t);break;default:t3(t.g,e)}},s3),hd=class{constructor(e,n){var i=kn;this.g=e,this.h=n,this.m=lt,this.o=De,this.defaultValue=void 0,this.j=i.jb!=null?m0:void 0}register(){el(this)}};function Ti(t,e){return new hd(t,e)}function Rr(t,e){return(n,i)=>{e:{let s={ma:!0};i&&Object.assign(s,i),n=W0(n,void 0,void 0,s);try{let o=new t,a=o.A;Qd(e)(a,n);var r=o;break e}catch(o){throw o instanceof RangeError?new SyntaxError:o}finally{X0(n)}r=void 0}return r}}function rf(t){return e=>o_(e,t)}function la(t){return function(){return o_(this,t)}}var v3=[0,Ys,y_,We,ie],y3=[0,$i,[0,Lc,[0,Pc,jr],Lc,-1,[0,be],Lc,-1],Xt(__,tf,dl)],Yu,cg=class extends de{constructor(t){super(t)}},lg=[0,$i,Xt(__,function(t,e,n){if(e!=null){if(e instanceof de){let i=e.mb;return void(i?(e=i(e),e!=null&&ca(t,n,cl(e,!0).buffer)):Js(td,3))}if(Array.isArray(e))return void Js(td,3)}tf(t,e,n)},dl)],x3=[0,1,[0,12,nt,10,We],[0,7,[0,nt,-1]]],hg=globalThis.trustedTypes,M3=class{constructor(t){this.g=t}toString(){return this.g+""}};function ug(t){var e;return Yu===void 0&&(Yu=function(){var n=null;if(!hg)return n;try{let i=r=>r;n=hg.createPolicy("goog#html",{createHTML:i,createScript:i,createScriptURL:i})}catch{}return n}()),t=(e=Yu)?e.createScriptURL(t):t,new M3(t)}function Ec(t,...e){if(e.length===0)return ug(t[0]);var n=t[0];for(let i=0;i<e.length;i++)n+=encodeURIComponent(e[i])+t[i+1];return ug(n)}var M_=[0,nt,be,We,-1,mo,be,-1,We,-1],b_=[0,be,-1,We],sf=class extends de{constructor(t){super(t)}},S_=[0,We,ie,We,be,-1,nr(function(t,e,n){return(t.h===0||t.h===2)&&(e=Ar(e,0|e[xe],n),t.h==2?oa(t,YS,e):e.push(er(t.g)),!0)},function(t,e,n){if((e=tr(cs,e,!0))!=null&&e.length){n=Xd(t,n);for(let i=0;i<e.length;i++)aa(t.g,e[i]);$d(t,n)}},Zd),ie,-1,[0,We,-1],be,We,-1,b_],E_=[0,3,We,-1,2,[0,[2],nt,tt,[0,x_]],[0,be,We,be,We,be,4,[0,We,ie,-1,We]],[0,[3,4],ie,-1,tt,[0,nt],tt,[0,be,-1]],[0]],w_=[0,ie,-2],dg=class extends de{constructor(t){super(t)}},T_=[0],b3=class extends de{constructor(t){super(t)}},A_=[0,nt,We,1,We,-4],kn=class extends de{constructor(t){super(t,2)}},tn={};tn[336783863]=[0,ie,We,-1,nt,[0,[1,2,3,4,5,6,7,8,9],tt,T_,tt,S_,tt,w_,tt,A_,tt,M_,tt,[0,ie,-2],tt,[0,ie,be],tt,E_,tt,b_],[0,ie],We,[0,[1,3],[2,4],tt,[0,mo],-1,tt,[0,cn],-1,wt,[0,ie,-1]],ie];var fg=[0,Pc,-1,br,-3,Pc,mo,$i,jr,Pc,-1,br,jr,br,-2,$i];function Dt(t,e){al(t,3,e)}function it(t,e){al(t,4,e)}var Tn=class extends de{constructor(t){super(t,500)}v(t){return De(this,0,7,t)}},$o=[-1,{}],pg=[0,ie,1,$o],mg=[0,ie,cn,$o];function Zn(t,e){Jo(t,1,Tn,e)}function Ut(t,e){al(t,10,e)}function ht(t,e){al(t,15,e)}var Bn=class extends de{constructor(t){super(t,500)}v(t){return De(this,0,1001,t)}},R_=[-500,wt,[-500,$i,-1,cn,-3,[-2,tn,We],wt,lg,jr,-1,pg,mg,wt,[0,$i,br],$i,fg,jr,cn,987,cn],4,wt,[-500,ie,-1,[-1,{}],998,ie],wt,[-500,ie,cn,-1,[-2,{},We],997,cn,-1],jr,wt,[-500,ie,cn,$o,998,cn],cn,jr,pg,mg,wt,[0,$i,-1,$o],cn,-2,fg,$i,-1,br,[0,br,g3],978,$o,wt,lg];Bn.prototype.g=la(R_);var S3=Rr(Bn,R_),E3=class extends de{constructor(t){super(t)}},C_=class extends de{constructor(t){super(t)}g(){return Qi(this,E3,1)}},I_=[0,wt,[0,nt,Bt,ie,-1]],vl=Rr(C_,I_),w3=class extends de{constructor(t){super(t)}},T3=class extends de{constructor(t){super(t)}},Ku=class extends de{constructor(t){super(t)}j(){return lt(this,w3,2)}g(){return Qi(this,T3,5)}},P_=Rr(class extends de{constructor(t){super(t)}},[0,cn,mo,nf,[0,be,[0,nt,-3],[0,Bt,-3],[0,nt,-1,[0,wt,[0,nt,-2]]],wt,[0,Bt,-1,ie,Bt]],ie,-1,Ct,wt,[0,nt,Bt],cn,Ct]),L_=class extends de{constructor(t){super(t)}},Ks=Rr(class extends de{constructor(t){super(t)}},[0,wt,[0,Bt,-4]]),D_=class extends de{constructor(t){super(t)}},ha=Rr(class extends de{constructor(t){super(t)}},[0,wt,[0,Bt,-4]]),A3=class extends de{constructor(t){super(t)}},R3=[0,nt,-1,nf,be],U_=class extends de{constructor(t){super(t)}};U_.prototype.g=la([0,Bt,-4,Ct]);var C3=class extends de{constructor(t){super(t)}},I3=Rr(class extends de{constructor(t){super(t)}},[0,wt,[0,1,nt,ie,I_],Ct]),gg=class extends de{constructor(t){super(t)}},P3=class extends de{constructor(t){super(t)}g(){var t=kt(this,1,void 0,N0);return t??rs()}},L3=class extends de{constructor(t){super(t)}},of=[1,2],D3=Rr(class extends de{constructor(t){super(t)}},[0,wt,[0,of,tt,[0,nf],tt,[0,Ys],nt,ie],Ct]),af=class extends de{constructor(t){super(t)}},N_=[0,ie,nt,Bt,cn,-1],_g=class extends de{constructor(t){super(t)}},U3=[0,We,-1],Kc=class extends de{constructor(t){super(t)}g(){return D0(this,sf,2,ns)}},ns=[1,2,3,4,5,6],Zc=class extends de{constructor(t){super(t)}g(){return kt(this,1,void 0,N0)!=null}j(){return ln(kt(this,2))!=null}},Nt=class extends de{constructor(t){super(t)}},F_=[0,Ys,ie,[0,nt,Ct,-1],[0,Yc,Ct]],Wt=[0,F_,We,[0,ns,tt,A_,tt,S_,tt,M_,tt,T_,tt,w_,tt,E_],be],N3=rf(Wt),yl=class extends de{constructor(t){super(t)}},cf=[0,Wt,Bt,-1,nt],F3=Ti(502141897,yl);tn[502141897]=cf;var O3=Rr(class extends de{constructor(t){super(t)}},[0,[0,be,-1,f3,m3],R3]),O_=class extends de{constructor(t){super(t)}},k_=class extends de{constructor(t){super(t)}},ud=[0,Wt,Bt,[0,Wt],We],k3=Ti(508968150,k_);tn[508968150]=[0,Wt,cf,ud,Bt,[0,[0,F_]]],tn[508968149]=ud;var $s=class extends de{constructor(t){super(t)}j(){return lt(this,af,2)}g(){ze(this,2)}},B_=[0,Wt,N_];tn[478825465]=B_;var B3=class extends de{constructor(t){super(t)}},z_=class extends de{constructor(t){super(t)}},lf=class extends de{constructor(t){super(t)}},hf=class extends de{constructor(t){super(t)}},V_=class extends de{constructor(t){super(t)}},vg=[0,Wt,[0,Wt],B_,-1],H_=[0,Wt,Bt,nt],uf=[0,Wt,Bt],G_=[0,Wt,H_,uf,Bt],z3=Ti(479097054,V_);tn[479097054]=[0,Wt,G_,vg],tn[463370452]=vg,tn[464864288]=H_;var V3=Ti(462713202,hf);tn[462713202]=G_,tn[474472470]=uf;var H3=class extends de{constructor(t){super(t)}},W_=class extends de{constructor(t){super(t)}},X_=class extends de{constructor(t){super(t)}},$_=class extends de{constructor(t){super(t)}},df=[0,Wt,Bt,-1,nt],dd=[0,Wt,Bt,We];$_.prototype.g=la([0,Wt,uf,[0,Wt],cf,ud,df,dd]);var q_=class extends de{constructor(t){super(t)}},G3=Ti(456383383,q_);tn[456383383]=[0,Wt,N_];var Y_=class extends de{constructor(t){super(t)}},W3=Ti(476348187,Y_);tn[476348187]=[0,Wt,U3];var K_=class extends de{constructor(t){super(t)}},yg=class extends de{constructor(t){super(t)}},Z_=[0,be,-1],X3=Ti(458105876,class extends de{constructor(t){super(t)}g(){var t=this.A,e=0|t[xe],n=wn(this,e);return t=function(i,r,s,o){var a=yg;!o&&uo(i)&&(s=0|(r=i.A)[xe]);var c=ji(r,2);if(i=!1,c==null){if(o)return Ym();c=[]}else if(c.constructor===Ji){if(!(2&c.M)||o)return c;c=c.ea()}else Array.isArray(c)?i=!!(2&c[xe]):c=[];if(o){if(!c.length)return Ym();i||(i=!0,ta(c))}else i&&(i=!1,Ko(c),c=F0(c));return!i&&32&s&&ea(c,32),s=Gt(r,s,2,o=new Ji(c,a,DS,void 0)),i||Tr(r,s),o}(this,t,e,n),!n&&yg&&(t.Fa=!0),t}});tn[458105876]=[0,Z_,d3,[!0,Ct,[0,ie,-1,cn]],[0,mo,We,be],We];var ff=class extends de{constructor(t){super(t)}},J_=Ti(458105758,ff);tn[458105758]=[0,Wt,ie,Z_];var $3=class extends de{constructor(t){super(t)}},q3=class extends de{constructor(t){super(t)}},Y3=class extends de{constructor(t){super(t)}},K3=rf([0,wt,[0,Lc,wt,[0,v_,-1],br]]),Zu=class extends de{constructor(t){super(t)}},xg=[0,v_,-1,br],Z3=class extends de{constructor(t){super(t)}},j_=class extends de{constructor(t){super(t)}},fd=[1,2];j_.prototype.g=la([0,fd,tt,xg,tt,[0,wt,xg]]);var Q_=class extends de{constructor(t){super(t)}},J3=Ti(443442058,Q_);tn[443442058]=[0,Wt,ie,nt,Bt,cn,-1,We,Bt],tn[514774813]=df;var e1=class extends de{constructor(t){super(t)}},j3=Ti(516587230,e1);function pd(t,e){return e=e?e.clone():new af,t.displayNamesLocale!==void 0?ze(e,1,Yi(t.displayNamesLocale)):t.displayNamesLocale===void 0&&ze(e,1),t.maxResults!==void 0?bi(e,2,t.maxResults):"maxResults"in t&&ze(e,2),t.scoreThreshold!==void 0?Le(e,3,t.scoreThreshold):"scoreThreshold"in t&&ze(e,3),t.categoryAllowlist!==void 0?Vc(e,4,t.categoryAllowlist):"categoryAllowlist"in t&&ze(e,4),t.categoryDenylist!==void 0?Vc(e,5,t.categoryDenylist):"categoryDenylist"in t&&ze(e,5),e}function t1(t){var e=Number(t);return Number.isSafeInteger(e)?e:String(t)}function pf(t,e=-1,n=""){return{categories:t.map(i=>({index:qn(i,1)??0??-1,score:Ht(i,2)??0,categoryName:ln(kt(i,3))??""??"",displayName:ln(kt(i,4))??""??""})),headIndex:e,headName:n}}function Q3(t){var e={classifications:Qi(t,C3,1).map(n=>pf(lt(n,C_,4)?.g()??[],qn(n,2)??0,ln(kt(n,3))??""))};return function(n){return n==null?n:typeof n=="bigint"?(nd(n)?n=Number(n):(n=Qr(64,n),n=nd(n)?Number(n):String(n)),n):lo(n)?typeof n=="number"?rl(n):kc(n):void 0}(kt(t,2,void 0,Bc))!=null&&(e.timestampMs=t1(kt(t,2,void 0,Bc)??L0)),e}function n1(t){var e=Jr(t,3,ai,Zr()),n=Jr(t,2,cs,Zr()),i=Jr(t,1,ln,Zr()),r=Jr(t,9,ln,Zr()),s={categories:[],keypoints:[]};for(let o=0;o<e.length;o++)s.categories.push({score:e[o],index:n[o]??-1,categoryName:i[o]??"",displayName:r[o]??""});if((e=lt(t,Ku,4)?.j())&&(s.boundingBox={originX:qn(e,1,vr)??0,originY:qn(e,2,vr)??0,width:qn(e,3,vr)??0,height:qn(e,4,vr)??0,angle:0}),lt(t,Ku,4)?.g().length)for(let o of lt(t,Ku,4).g())s.keypoints.push({x:kt(o,1,vr,ai)??0,y:kt(o,2,vr,ai)??0,score:kt(o,4,vr,ai)??0,label:ln(kt(o,3,vr))??""});return s}function xl(t){var e=[];for(let n of Qi(t,D_,1))e.push({x:Ht(n,1)??0,y:Ht(n,2)??0,z:Ht(n,3)??0,visibility:Ht(n,4)??0});return e}function qo(t){var e=[];for(let n of Qi(t,L_,1))e.push({x:Ht(n,1)??0,y:Ht(n,2)??0,z:Ht(n,3)??0,visibility:Ht(n,4)??0});return e}function Mg(t){return Array.from(t,e=>e>127?e-256:e)}function bg(t,e){if(t.length!==e.length)throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${t.length} vs. ${e.length}).`);var n=0,i=0,r=0;for(let s=0;s<t.length;s++)n+=t[s]*e[s],i+=t[s]*t[s],r+=e[s]*e[s];if(i<=0||r<=0)throw Error("Cannot compute cosine similarity on embedding with 0 norm.");return n/Math.sqrt(i*r)}tn[516587230]=[0,Wt,df,dd,Bt],tn[518928384]=dd;var wc,eE=new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);async function i1(t){if(t)return!0;if(wc===void 0)try{await WebAssembly.instantiate(eE),wc=!0}catch{wc=!1}return wc}async function Tc(t,e,n){return{wasmLoaderPath:`${e}/${t}_${n=`wasm${n?"_module":""}${await i1(n)?"":"_nosimd"}_internal`}.js`,wasmBinaryPath:`${e}/${t}_${n}.wasm`}}var Kr=class{};function Sg(t){return ze(new md,1,Ki(t))}Kr.forVisionTasks=function(t,e=!1){return Tc("vision",t??Ec``,e)},Kr.forTextTasks=function(t,e=!1){return Tc("text",t??Ec``,e)},Kr.forGenAiTasks=function(t,e=!1){return Tc("genai",t??Ec``,e)},Kr.forAudioTasks=function(t,e=!1){return Tc("audio",t??Ec``,e)},Kr.isSimdSupported=function(t=!1){return i1(t)};var md=class extends de{constructor(t){super(t)}},tE=class extends de{constructor(t){super(t)}},Eg=[0,be,2,Yc,-2,Ct,wt,[0,be,Ct]],nE=class extends de{constructor(t){super(t)}},iE=class extends de{constructor(t){super(t)}};function gd(t,e){return ze(t,1,Ki(e))}function _d(t,e){return ze(t,2,Ki(e))}var vd=class extends de{constructor(t){super(t)}},Jc=[3,4,5,6,7],rE=class extends de{constructor(t){super(t)}},r1=class extends de{constructor(t){super(t)}};r1.prototype.g=la([0,[0,be,ie,-3,be],[0,Jc,be,-1,tt,[0,be,ie,Yc],tt,Eg,tt,[0,1,Eg],tt,[0,be],tt,[0,be,ie,Yc]]]);var sE=class{constructor(){this.g=typeof AbortController<"u"}async send(t,e,n){var i=this.g?new AbortController:void 0,r=i&&t.la>0?setTimeout(()=>{i.abort()},t.la):void 0;try{let s=await fetch(t.url,{method:t.bb,headers:{...t.ab},...t.body&&{body:t.body},...t.withCredentials&&{credentials:"include"},signal:t.la&&i?i.signal:null});s.status===200?e?.(await s.text()):n?.(s.status)}catch(s){s?.name==="AbortError"?n?.(408):n?.(400)}finally{clearTimeout(r)}}},oE=class extends de{constructor(t){super(t,37)}},wg=[-4,{},x3,be,y3],Tg=[0,ie,be,1,ie,-1,be,1,be,1,Ct],Ag=[0,be,ie,-2],Rg=[0,ie,be],Cg=[0,ie,be],Ig=[0,We,-3],Pg=[0,be,ie,-1,Ct,nt,-1,ie,-5,wt,[0,ie,-4],-1,We,[0,We,-3],be],aE=class extends de{constructor(t){super(t,19)}},cE=rf([-19,{},[0,be,1,[0,ie,-6,Ct,nt,ie,-1,Ct],1,[0,ie,1,ie,-5],ie,-1,[0,be,ie,-8],[0,ie,-3],[0,ie,be,ie,-2],[0,ie,-1,be,ie,-1,be,ie,-1,[0,wt,[0,ie,-1],We,ie,-5],[0,be,We,nt,-2]],Ct,[0,ie,-3,Ct,nt,ie,-1],[0,be,ie,-1],[0,ie,-9],[0,ie,-6,be,ie,1,ie,We,be,-1,We,ie,-2,be,ie,be,ie,nt,-1],1,[0,be],1,[0,ie,-4],1,Tg,[0,[1,2,3,4,5,6],tt,Tg,tt,Rg,tt,Cg,tt,[0,be],tt,Pg,tt,Ag],Rg,Cg,Pg,[0,[0,be,ie,-1,Ct,nt,-1,ie,-4,wt,[0,ie,-4],-1,1,Ig],[0,be,ie,-1,Ct,nt,-1,ie,-4,Ig]],Ag,[0,ie,[0,nt,-3,be],be,-2,[0,nt,-1],We],4,[0,ie,be,ie,-1,Ct,be,ie,-1,be,nt,-1]],be,wt,[-37,{},Vo,ie,wt,[0,ie,-1],Ys,1,Ys,[0,cn,-1,ag,p3,-1],ie,[0,nt,ie,-1],We,nt,Ct,ie,-1,_3,v3,Vo,Ys,be,ag,Ct,-1,[0,be,-1],ie,We,ie,mo,ie,-1,og,1,og,wg,We,[0,be,[0,Bt,nt,-2],[0,Bt]],[0,be,Ct]],Vo,y_,ie,-1,Vo,be,-1,[0,We,-1,be,We],[0,Ct,-1,ie],[0,Vo,We,Ct],Ct,1,x_,1,wg]),lE=class{constructor(t){this.h=[],this.m=new sE,this.j=t??"",this.g=setInterval(()=>{this.flush()},6e4)}close(){this.g!==void 0&&(clearInterval(this.g),this.g=void 0),this.flush()}flush(t,e){if(this.error)e?.("net-send-failed");else if(this.h.length===0)t?.();else{var n=this.h;this.h=[],n=function(i){var r=new aE;return od(r=ze(r,2,Ki(1786)),3,i)}(n),n=cE(n),this.m.send({url:"https://odml.pa.googleapis.com/v1/log",bb:"POST",la:1e4,body:n,hb:2,ab:{"Content-Type":"application/x-protobuf","x-goog-api-key":this.j},withCredentials:!1},()=>{t?.()},i=>{this.error=Error(`Logging failed with HTTP error: ${i}`),this.h=[],this.g!==void 0&&(clearInterval(this.g),this.g=void 0),e?.("net-send-failed",i)})}}},jc=class{constructor(){this.aa=this.U=this.X=this.R=this.V=this.T=this.P=0}};function yd(t,e){var n=new r1;n=De(n,0,1,t.B),n=De(n,0,2,e),e=ze(e=new oE,6,tl(n=n.g(),!1)),(t=t.l).error||t.h.push(e)}function Lg(t,e){var n={P:e.P-t.j.P,T:e.T-t.j.T,V:e.V-t.j.V,R:e.R-t.j.R,X:e.X-t.j.X,U:e.U,aa:e.aa},i=_d(gd(new vd,t.C),1);n=s1(t,n),yd(t,i=Mi(i,4,Jc,n)),t.j=e}function s1(t,e){var n=new tE;return t=Cc(t=$u(t=ze(n,1,Ki(t.D)),7,e.R),5,e.U),t=Cc(t,6,e.aa),e.V>0&&Cc(t,4,e.X/e.V),e.P!==0&&(n=$u(n=Sg(3),2,e.P),Jo(t,8,md,n)),e.T!==0&&(e=$u(n=Sg(4),2,e.T),Jo(t,8,md,e)),t}var hE=class{constructor(t,e,n){this.u=performance.now(),this.m=performance.now(),this.h=new Map,this.o=0,this.g=new jc,this.j=new jc,this.l=new lE(n),this.C=function(i){switch(i){case"AudioClassifier":return 4;case"AudioEmbedder":return 5;case"TextClassifier":return 6;case"TextEmbedder":return 7;case"GestureRecognizer":return 8;case"HandDetector":return 9;case"HandLandmarker":return 10;case"ImageClassifier":return 11;case"ImageEmbedder":return 12;case"ImageSegmenter":return 13;case"ObjectDetector":return 14;case"FaceDetector":return 15;case"FaceLandmarker":return 16;case"InteractiveSegmenter":case"InteractiveSegmenterLegacy":return 18;case"HolisticLandmarker":return 20;case"LlmInference":return 21;case"LanguageDetector":return 22;case"PoseLandmarker":return 23;default:return 0}}(t),this.D=function(i){switch(i){case"IMAGE":return 11;case"VIDEO":return 12;case"LIVE_STREAM":return 13;case"AUDIO_CLIPS":return 14;case"AUDIO_STREAM":return 15;default:return 10}}(e),t=new rE,typeof window>"u"?e=0:(e=navigator.userAgent,e=/Android/i.test(e)?1:/iPhone|iPad|iPod/i.test(e)?2:/Windows/i.test(e)?5:/Macintosh/i.test(e)?4:/Linux/i.test(e)?3:0),t=ze(t,1,Ki(e)),t=ze(t,2,Yi("")),t=ze(t,3,Yi("")),t=ze(t,4,Yi("1.0.1")),t=ze(t,5,Yi("")),this.B=ze(t,6,Ki(4))}ya(){var t=new iE;t=Cc(t=ze(t,1,Ki(this.D)),3,performance.now()-this.u),yd(this,t=Mi(_d(gd(new vd,this.C),0),3,Jc,t)),this.m=performance.now()}za(t){var e=this.h.get(t);if(e!==void 0&&(this.h.delete(t),t=performance.now()-e,++this.g.V,this.g.X+=t,this.g.U=Math.max(this.g.U,t),this.o=Math.max(this.o,t),performance.now()>this.m+3e4)){for(let[n,i]of this.h.entries())t=n,i<e&&(this.g.R++,this.h.delete(t));e={...this.g,aa:performance.now()-this.m},this.g.U=0,this.m=performance.now(),Lg(this,e)}}xa(){var t={...this.g,R:this.g.R+this.h.size,U:this.o,aa:performance.now()-this.u};Lg(this,t);var e=new nE;e=De(e,0,2,t=s1(this,t)),yd(this,e=Mi(t=_d(gd(new vd,this.C),2),5,Jc,e))}close(){var t=this.l;typeof t.close=="function"?t.close():t.flush()}};function mf(){var t=navigator;return typeof OffscreenCanvas<"u"&&(!function(e=navigator){return(e=e.userAgent).includes("Safari")&&!e.includes("Chrome")}(t)||!!((t=t.userAgent.match(/Version\/([\d]+).*Safari/))&&t.length>=1&&Number(t[1])>=17))}async function Dg(t){if(typeof importScripts!="function"){let e=document.createElement("script");return e.src=t.toString(),e.crossOrigin="anonymous",new Promise((n,i)=>{e.addEventListener("load",()=>{n()},!1),e.addEventListener("error",r=>{i(r)},!1),document.body.appendChild(e)})}try{importScripts(t.toString())}catch(e){if(!(e instanceof TypeError))throw e;{let n=self.import;n?await n(t.toString()):await import(t.toString())}}}function gf(t){return t.videoWidth!==void 0?[t.videoWidth,t.videoHeight]:t.naturalWidth!==void 0?[t.naturalWidth,t.naturalHeight]:t.displayWidth!==void 0?[t.displayWidth,t.displayHeight]:[t.width,t.height]}function Re(t,e,n){t.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"),n(e=t.i.stringToNewUTF8(e)),t.i._free(e)}function o1(t,e,n){if(!t.i.canvas)throw Error("No OpenGL canvas configured.");if(n?t.i._bindTextureToStream(n):t.i._bindTextureToCanvas(),!(n=t.i.canvas.getContext("webgl2")||t.i.canvas.getContext("webgl")))throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");t.i.gpuOriginForWebTexturesIsBottomLeft&&n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,e),t.i.gpuOriginForWebTexturesIsBottomLeft&&n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1);var[i,r]=gf(e);return!t.j||i===t.i.canvas.width&&r===t.i.canvas.height||(t.i.canvas.width=i,t.i.canvas.height=r),[i,r]}function Ug(t,e,n){t.m||console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");var i=new Uint32Array(e.length);for(let r=0;r<e.length;r++)i[r]=t.i.stringToNewUTF8(e[r]);e=t.i._malloc(4*i.length),t.i.HEAPU32.set(i,e>>2),n(e);for(let r of i)t.i._free(r);t.i._free(e)}function _i(t,e,n){t.i.simpleListeners=t.i.simpleListeners||{},t.i.simpleListeners[e]=n}function yr(t,e,n){var i=[];t.i.simpleListeners=t.i.simpleListeners||{},t.i.simpleListeners[e]=(r,s,o)=>{s?(n(i,o),i=[]):i.push(r)}}var a1=class{constructor(t,e){this.j=!0,this.i=t,this.g=null,this.h=0,this.m=typeof this.i._addIntToInputStream=="function",e!==void 0?this.i.canvas=e:mf()?this.i.canvas=new OffscreenCanvas(1,1):(console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."),this.i.canvas=document.createElement("canvas"))}async initializeGraph(t){var e=await(await fetch(t)).arrayBuffer();t=!(t.endsWith(".pbtxt")||t.endsWith(".textproto")),this.setGraph(new Uint8Array(e),t)}setGraphFromString(t){this.setGraph(new TextEncoder().encode(t),!1)}setGraph(t,e){var n=t.length,i=this.i._malloc(n);this.i.HEAPU8.set(t,i),e?this.i._changeBinaryGraph(n,i):this.i._changeTextGraph(n,i),this.i._free(i)}configureAudio(t,e,n,i,r){this.i._configureAudio||console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'),Re(this,i||"input_audio",s=>{Re(this,r=r||"audio_header",o=>{this.i._configureAudio(s,o,t,e??0,n)})})}setAutoResizeCanvas(t){this.j=t}setAutoRenderToScreen(t){this.i._setAutoRenderToScreen(t)}setGpuBufferVerticalFlip(t){this.i.gpuOriginForWebTexturesIsBottomLeft=t}ja(t){_i(this,"__graph_config__",e=>{t(e)}),Re(this,"__graph_config__",e=>{this.i._getGraphConfig(e,void 0)}),delete this.i.simpleListeners.__graph_config__}attachErrorListener(t){this.i.errorListener=t}attachEmptyPacketListener(t,e){this.i.emptyPacketListeners=this.i.emptyPacketListeners||{},this.i.emptyPacketListeners[t]=e}addAudioToStream(t,e,n){this.addAudioToStreamWithShape(t,0,0,e,n)}addAudioToStreamWithShape(t,e,n,i,r){var s=4*t.length;this.h!==s&&(this.g&&this.i._free(this.g),this.g=this.i._malloc(s),this.h=s),this.i.HEAPF32.set(t,this.g/4),Re(this,i,o=>{this.i._addAudioToInputStream(this.g,e,n,o,r)})}addGpuBufferToStream(t,e,n){Re(this,e,i=>{var[r,s]=o1(this,t,i);this.i._addBoundTextureToStream(i,r,s,n)})}addBoolToStream(t,e,n){Re(this,e,i=>{this.i._addBoolToInputStream(t,i,n)})}addDoubleToStream(t,e,n){Re(this,e,i=>{this.i._addDoubleToInputStream(t,i,n)})}addFloatToStream(t,e,n){Re(this,e,i=>{this.i._addFloatToInputStream(t,i,n)})}addIntToStream(t,e,n){Re(this,e,i=>{this.i._addIntToInputStream(t,i,n)})}addUintToStream(t,e,n){Re(this,e,i=>{this.i._addUintToInputStream(t,i,n)})}addStringToStream(t,e,n){Re(this,e,i=>{Re(this,t,r=>{this.i._addStringToInputStream(r,i,n)})})}addStringRecordToStream(t,e,n){Re(this,e,i=>{Ug(this,Object.keys(t),r=>{Ug(this,Object.values(t),s=>{this.i._addFlatHashMapToInputStream(r,s,Object.keys(t).length,i,n)})})})}addProtoToStream(t,e,n,i){Re(this,n,r=>{Re(this,e,s=>{var o=this.i._malloc(t.length);this.i.HEAPU8.set(t,o),this.i._addProtoToInputStream(o,t.length,s,r,i),this.i._free(o)})})}addEmptyPacketToStream(t,e){Re(this,t,n=>{this.i._addEmptyPacketToInputStream(n,e)})}addBoolVectorToStream(t,e,n){Re(this,e,i=>{var r=this.i._allocateBoolVector(t.length);if(!r)throw Error("Unable to allocate new bool vector on heap.");for(let s of t)this.i._addBoolVectorEntry(r,s);this.i._addBoolVectorToInputStream(r,i,n)})}addDoubleVectorToStream(t,e,n){Re(this,e,i=>{var r=this.i._allocateDoubleVector(t.length);if(!r)throw Error("Unable to allocate new double vector on heap.");for(let s of t)this.i._addDoubleVectorEntry(r,s);this.i._addDoubleVectorToInputStream(r,i,n)})}addFloatVectorToStream(t,e,n){Re(this,e,i=>{var r=this.i._allocateFloatVector(t.length);if(!r)throw Error("Unable to allocate new float vector on heap.");for(let s of t)this.i._addFloatVectorEntry(r,s);this.i._addFloatVectorToInputStream(r,i,n)})}addIntVectorToStream(t,e,n){Re(this,e,i=>{var r=this.i._allocateIntVector(t.length);if(!r)throw Error("Unable to allocate new int vector on heap.");for(let s of t)this.i._addIntVectorEntry(r,s);this.i._addIntVectorToInputStream(r,i,n)})}addUintVectorToStream(t,e,n){Re(this,e,i=>{var r=this.i._allocateUintVector(t.length);if(!r)throw Error("Unable to allocate new unsigned int vector on heap.");for(let s of t)this.i._addUintVectorEntry(r,s);this.i._addUintVectorToInputStream(r,i,n)})}addStringVectorToStream(t,e,n){Re(this,e,i=>{var r=this.i._allocateStringVector(t.length);if(!r)throw Error("Unable to allocate new string vector on heap.");for(let s of t)Re(this,s,o=>{this.i._addStringVectorEntry(r,o)});this.i._addStringVectorToInputStream(r,i,n)})}addBoolToInputSidePacket(t,e){Re(this,e,n=>{this.i._addBoolToInputSidePacket(t,n)})}addDoubleToInputSidePacket(t,e){Re(this,e,n=>{this.i._addDoubleToInputSidePacket(t,n)})}addFloatToInputSidePacket(t,e){Re(this,e,n=>{this.i._addFloatToInputSidePacket(t,n)})}addIntToInputSidePacket(t,e){Re(this,e,n=>{this.i._addIntToInputSidePacket(t,n)})}addUintToInputSidePacket(t,e){Re(this,e,n=>{this.i._addUintToInputSidePacket(t,n)})}addStringToInputSidePacket(t,e){Re(this,e,n=>{Re(this,t,i=>{this.i._addStringToInputSidePacket(i,n)})})}addProtoToInputSidePacket(t,e,n){Re(this,n,i=>{Re(this,e,r=>{var s=this.i._malloc(t.length);this.i.HEAPU8.set(t,s),this.i._addProtoToInputSidePacket(s,t.length,r,i),this.i._free(s)})})}addBoolVectorToInputSidePacket(t,e){Re(this,e,n=>{var i=this.i._allocateBoolVector(t.length);if(!i)throw Error("Unable to allocate new bool vector on heap.");for(let r of t)this.i._addBoolVectorEntry(i,r);this.i._addBoolVectorToInputSidePacket(i,n)})}addDoubleVectorToInputSidePacket(t,e){Re(this,e,n=>{var i=this.i._allocateDoubleVector(t.length);if(!i)throw Error("Unable to allocate new double vector on heap.");for(let r of t)this.i._addDoubleVectorEntry(i,r);this.i._addDoubleVectorToInputSidePacket(i,n)})}addFloatVectorToInputSidePacket(t,e){Re(this,e,n=>{var i=this.i._allocateFloatVector(t.length);if(!i)throw Error("Unable to allocate new float vector on heap.");for(let r of t)this.i._addFloatVectorEntry(i,r);this.i._addFloatVectorToInputSidePacket(i,n)})}addIntVectorToInputSidePacket(t,e){Re(this,e,n=>{var i=this.i._allocateIntVector(t.length);if(!i)throw Error("Unable to allocate new int vector on heap.");for(let r of t)this.i._addIntVectorEntry(i,r);this.i._addIntVectorToInputSidePacket(i,n)})}addUintVectorToInputSidePacket(t,e){Re(this,e,n=>{var i=this.i._allocateUintVector(t.length);if(!i)throw Error("Unable to allocate new unsigned int vector on heap.");for(let r of t)this.i._addUintVectorEntry(i,r);this.i._addUintVectorToInputSidePacket(i,n)})}addStringVectorToInputSidePacket(t,e){Re(this,e,n=>{var i=this.i._allocateStringVector(t.length);if(!i)throw Error("Unable to allocate new string vector on heap.");for(let r of t)Re(this,r,s=>{this.i._addStringVectorEntry(i,s)});this.i._addStringVectorToInputSidePacket(i,n)})}attachBoolListener(t,e){_i(this,t,e),Re(this,t,n=>{this.i._attachBoolListener(n)})}attachBoolVectorListener(t,e){yr(this,t,e),Re(this,t,n=>{this.i._attachBoolVectorListener(n)})}attachIntListener(t,e){_i(this,t,e),Re(this,t,n=>{this.i._attachIntListener(n)})}attachIntVectorListener(t,e){yr(this,t,e),Re(this,t,n=>{this.i._attachIntVectorListener(n)})}attachUintListener(t,e){_i(this,t,e),Re(this,t,n=>{this.i._attachUintListener(n)})}attachUintVectorListener(t,e){yr(this,t,e),Re(this,t,n=>{this.i._attachUintVectorListener(n)})}attachDoubleListener(t,e){_i(this,t,e),Re(this,t,n=>{this.i._attachDoubleListener(n)})}attachDoubleVectorListener(t,e){yr(this,t,e),Re(this,t,n=>{this.i._attachDoubleVectorListener(n)})}attachFloatListener(t,e){_i(this,t,e),Re(this,t,n=>{this.i._attachFloatListener(n)})}attachFloatVectorListener(t,e){yr(this,t,e),Re(this,t,n=>{this.i._attachFloatVectorListener(n)})}attachStringListener(t,e){_i(this,t,e),Re(this,t,n=>{this.i._attachStringListener(n)})}attachStringVectorListener(t,e){yr(this,t,e),Re(this,t,n=>{this.i._attachStringVectorListener(n)})}attachProtoListener(t,e,n){_i(this,t,e),Re(this,t,i=>{this.i._attachProtoListener(i,n||!1)})}attachProtoVectorListener(t,e,n){yr(this,t,e),Re(this,t,i=>{this.i._attachProtoVectorListener(i,n||!1)})}attachAudioListener(t,e,n){this.i._attachAudioListener||console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'),_i(this,t,(i,r)=>{i=new Float32Array(i.buffer,i.byteOffset,i.length/4),e(i,r)}),Re(this,t,i=>{this.i._attachAudioListener(i,n||!1)})}finishProcessing(){this.i._waitUntilIdle()}closeGraph(){this.i._closeGraph(),this.i.simpleListeners=void 0,this.i.emptyPacketListeners=void 0}};function c1(t){return class extends t{get pa(){return this.i}Sa(){if(typeof this.pa._mediapipeLoggerGetEncodedApiKey=="function"){let e=this.pa._mediapipeLoggerGetEncodedApiKey();return this.pa._decodeBase64(e)}}}}function l1(t){return class extends t{Za(){this.i._registerModelResourcesGraphService()}}}var uE=c1(l1(a1)),dE=class extends uE{};async function fE(t,e,n,i){return t=await(async(r,s,o,a,c)=>{if(s&&await Dg(s),!self.ModuleFactory||o&&(await Dg(o),!self.ModuleFactory))throw Error("ModuleFactory not set.");return self.Module&&c&&((s=self.Module).locateFile=c.locateFile,c.mainScriptUrlOrBlob&&(s.mainScriptUrlOrBlob=c.mainScriptUrlOrBlob)),c=await self.ModuleFactory(self.Module||c),self.ModuleFactory=self.Module=void 0,new r(c,a)})(t,n.wasmLoaderPath,n.assetLoaderPath,e,{locateFile:r=>r.endsWith(".wasm")?n.wasmBinaryPath.toString():n.assetBinaryPath&&r.endsWith(".data")?n.assetBinaryPath.toString():r}),function(r,s){s=s.runningMode??"";var o=r.g.Sa();r.m=new hE(r.C(),s,o)}(t,i),await t.v(i),t}async function Dc(t,e,n,i){return fE(t,e,n,i)}function Ju(t,e){var n=lt(t.baseOptions,Zc,1)||new Zc;typeof e=="string"?(ze(n,2,Yi(e)),ze(n,1)):e instanceof Uint8Array&&(ze(n,1,tl(e,!1)),ze(n,2)),De(t.baseOptions,0,1,n)}function Ng(t){try{let e=t.K.length;if(e===1)throw Error(t.K[0].message);if(e>1)throw Error("Encountered multiple errors: "+t.K.map(n=>n.message).join(", "))}finally{t.K=[]}}function ve(t,e){t.I=Math.max(t.I,e)}function Ml(t,e){t.D=new Tn,Fn(t.D,2,"PassThroughCalculator"),Dt(t.D,"free_memory"),it(t.D,"free_memory_unused_out"),Ut(e,"free_memory"),Zn(e,t.D)}function io(t,e){Dt(t.D,e),it(t.D,e+"_unused_out")}function bl(t){t.g.addBoolToStream(!0,"free_memory",t.I)}var Qc=class{constructor(t){this.g=t,this.K=[],this.I=0,this.g.setAutoRenderToScreen(!1)}j(t,e=!0){if(e){let n=t.baseOptions||{};if(t.baseOptions?.modelAssetBuffer&&t.baseOptions?.modelAssetPath)throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");if(!(lt(this.baseOptions,Zc,1)?.g()||lt(this.baseOptions,Zc,1)?.j()||t.baseOptions?.modelAssetBuffer||t.baseOptions?.modelAssetPath))throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");if(function(i,r){var s=lt(i.baseOptions,Kc,3);if(!s){var o=s=new Kc,a=new dg;Mi(o,4,ns,a)}"delegate"in r&&(r.delegate==="GPU"?(r=s,o=new sf,Mi(r,2,ns,o)):(r=s,o=new dg,Mi(r,4,ns,o))),De(i.baseOptions,0,3,s)}(this,n),n.modelAssetPath)return fetch(n.modelAssetPath.toString()).then(i=>{if(i.ok)return i.arrayBuffer();throw Error(`Failed to fetch model: ${n.modelAssetPath} (${i.status})`)}).then(i=>{try{this.g.i.FS_unlink("/model.dat")}catch{}this.g.i.FS_createDataFile("/","model.dat",new Uint8Array(i),!0,!1,!1),Ju(this,"/model.dat"),this.o(),this.L()});if(n.modelAssetBuffer instanceof Uint8Array)Ju(this,n.modelAssetBuffer);else if(n.modelAssetBuffer)return async function(i){for(var r=[],s=0;;){let{done:o,value:a}=await i.read();if(o)break;r.push(a),s+=a.length}if(r.length===0)return new Uint8Array(0);if(r.length===1)return r[0];i=new Uint8Array(s),s=0;for(let o of r)i.set(o,s),s+=o.length;return i}(n.modelAssetBuffer).then(i=>{Ju(this,i),this.o(),this.L()})}return this.o(),this.L(),Promise.resolve()}L(){}ja(){var t;if(this.g.ja(e=>{t=S3(e)}),!t)throw Error("Failed to retrieve CalculatorGraphConfig");return t}setGraph(t,e){this.g.attachErrorListener((n,i)=>{this.K.push(Error(i))}),this.g.Za(),this.g.setGraph(t,e),this.m?.ya(),this.D=void 0,Ng(this)}finishProcessing(t){this.g.finishProcessing(),Ng(this),this.m&&t!==void 0&&this.m.za(t)}close(){this.D=void 0,this.m?.xa(),this.m?.close(),this.g.closeGraph()}};function fn(t,e){if(!t)throw Error(`Unable to obtain required WebGL resource: ${e}`);return t}Qc.prototype.close=Qc.prototype.close;var xd=class{constructor(e,n,i,r){this.g=e,this.h=n,this.m=i,this.j=r}bind(){this.g.bindVertexArray(this.h)}close(){this.g.deleteVertexArray(this.h),this.g.deleteBuffer(this.m),this.g.deleteBuffer(this.j)}};function Fg(t,e,n){var i=t.g;if(n=fn(i.createShader(n),"Failed to create WebGL shader"),i.shaderSource(n,e),i.compileShader(n),!i.getShaderParameter(n,i.COMPILE_STATUS))throw Error(`Could not compile WebGL shader: ${i.getShaderInfoLog(n)}`);return i.attachShader(t.h,n),n}function Og(t,e){var n=t.g,i=fn(n.createVertexArray(),"Failed to create vertex array");n.bindVertexArray(i);var r=fn(n.createBuffer(),"Failed to create buffer");n.bindBuffer(n.ARRAY_BUFFER,r),n.enableVertexAttribArray(t.F),n.vertexAttribPointer(t.F,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW);var s=fn(n.createBuffer(),"Failed to create buffer");return n.bindBuffer(n.ARRAY_BUFFER,s),n.enableVertexAttribArray(t.K),n.vertexAttribPointer(t.K,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array(e?[0,1,0,0,1,0,1,1]:[0,0,0,1,1,1,1,0]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),n.bindVertexArray(null),new xd(n,i,r,s)}function _f(t,e){if(t.g){if(e!==t.g)throw Error("Cannot change GL context once initialized")}else t.g=e}function ua(t,e,n,i){return _f(t,e),t.h||(t.m(),t.I()),n?(t.l||(t.l=Og(t,!0)),n=t.l):(t.D||(t.D=Og(t,!1)),n=t.D),e.useProgram(t.h),n.bind(),t.j(),t=i(),n.g.bindVertexArray(null),t}function Er(t,e,n){return _f(t,e),t=fn(e.createTexture(),"Failed to create texture"),e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,n??e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,n??e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),t}function Sl(t,e,n){_f(t,e),t.C||(t.C=fn(e.createFramebuffer(),"Failed to create framebuffe.")),e.bindFramebuffer(e.FRAMEBUFFER,t.C),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0)}function vf(t){t.g?.bindFramebuffer(t.g.FRAMEBUFFER,null)}var us=class{B(){return`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `}m(){var t=this.g;if(this.h=fn(t.createProgram(),"Failed to create WebGL program"),this.da=Fg(this,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,t.VERTEX_SHADER),this.Z=Fg(this,this.B(),t.FRAGMENT_SHADER),t.linkProgram(this.h),!t.getProgramParameter(this.h,t.LINK_STATUS))throw Error(`Error during program linking: ${t.getProgramInfoLog(this.h)}`);this.F=t.getAttribLocation(this.h,"aVertex"),this.K=t.getAttribLocation(this.h,"aTex")}I(){}j(){}close(){if(this.h){let t=this.g;t.deleteProgram(this.h),t.deleteShader(this.da),t.deleteShader(this.Z)}this.C&&this.g.deleteFramebuffer(this.C),this.D&&this.D.close(),this.l&&this.l.close()}},pE=class extends us{B(){return`
  precision mediump float;
  uniform sampler2D backgroundTexture;
  uniform sampler2D maskTexture;
  uniform sampler2D colorMappingTexture;
  varying vec2 vTex;
  void main() {
    vec4 backgroundColor = texture2D(backgroundTexture, vTex);
    float category = texture2D(maskTexture, vTex).r;
    vec4 categoryColor = texture2D(colorMappingTexture, vec2(category, 0.0));
    gl_FragColor = mix(backgroundColor, categoryColor, categoryColor.a);
  }
 `}I(){var t=this.g;t.activeTexture(t.TEXTURE1),this.u=Er(this,t,t.LINEAR),t.activeTexture(t.TEXTURE2),this.o=Er(this,t,t.NEAREST)}m(){super.m();var t=this.g;this.O=fn(t.getUniformLocation(this.h,"backgroundTexture"),"Uniform location"),this.Y=fn(t.getUniformLocation(this.h,"colorMappingTexture"),"Uniform location"),this.L=fn(t.getUniformLocation(this.h,"maskTexture"),"Uniform location")}j(){super.j();var t=this.g;t.uniform1i(this.L,0),t.uniform1i(this.O,1),t.uniform1i(this.Y,2)}close(){this.u&&this.g.deleteTexture(this.u),this.o&&this.g.deleteTexture(this.o),super.close()}},mE=class extends us{B(){return`
  precision mediump float;
  uniform sampler2D maskTexture;
  uniform sampler2D defaultTexture;
  uniform sampler2D overlayTexture;
  varying vec2 vTex;
  void main() {
    float confidence = texture2D(maskTexture, vTex).r;
    vec4 defaultColor = texture2D(defaultTexture, vTex);
    vec4 overlayColor = texture2D(overlayTexture, vTex);
    // Apply the alpha from the overlay and merge in the default color
    overlayColor = mix(defaultColor, overlayColor, overlayColor.a);
    gl_FragColor = mix(defaultColor, overlayColor, confidence);
  }
 `}I(){var t=this.g;t.activeTexture(t.TEXTURE1),this.o=Er(this,t),t.activeTexture(t.TEXTURE2),this.u=Er(this,t)}m(){super.m();var t=this.g;this.L=fn(t.getUniformLocation(this.h,"defaultTexture"),"Uniform location"),this.O=fn(t.getUniformLocation(this.h,"overlayTexture"),"Uniform location"),this.J=fn(t.getUniformLocation(this.h,"maskTexture"),"Uniform location")}j(){super.j();var t=this.g;t.uniform1i(this.J,0),t.uniform1i(this.L,1),t.uniform1i(this.O,2)}close(){this.o&&this.g.deleteTexture(this.o),this.u&&this.g.deleteTexture(this.u),super.close()}};function qi(t,e){switch(e){case 0:return t.g.find(n=>n instanceof Uint8Array);case 1:return t.g.find(n=>n instanceof Float32Array);case 2:return t.g.find(n=>typeof WebGLTexture<"u"&&n instanceof WebGLTexture);default:throw Error(`Type is not supported: ${e}`)}}function Md(t){var e=qi(t,1);if(!e){if(e=qi(t,0))e=new Float32Array(e).map(i=>i/255);else{e=new Float32Array(t.width*t.height);let i=ro(t);var n=yf(t);if(Sl(n,i,h1(t)),"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"document"in self&&"ontouchend"in self.document){n=new Float32Array(t.width*t.height*4),i.readPixels(0,0,t.width,t.height,i.RGBA,i.FLOAT,n);for(let r=0,s=0;r<e.length;++r,s+=4)e[r]=n[s]}else i.readPixels(0,0,t.width,t.height,i.RED,i.FLOAT,e)}t.g.push(e)}return e}function h1(t){var e=qi(t,2);if(!e){let n=ro(t);e=d1(t);let i=Md(t),r=u1(t);n.texImage2D(n.TEXTURE_2D,0,r,t.width,t.height,0,n.RED,n.FLOAT,i),bd(t)}return e}function ro(t){if(!t.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return t.h||(t.h=fn(t.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),t.h}function u1(t){if(t=ro(t),!Ac)if(t.getExtension("EXT_color_buffer_float")&&t.getExtension("OES_texture_float_linear")&&t.getExtension("EXT_float_blend"))Ac=t.R32F;else{if(!t.getExtension("EXT_color_buffer_half_float"))throw Error("GPU does not fully support 4-channel float32 or float16 formats");Ac=t.R16F}return Ac}function yf(t){return t.j||(t.j=new us),t.j}function d1(t){var e=ro(t);e.viewport(0,0,t.width,t.height),e.activeTexture(e.TEXTURE0);var n=qi(t,2);return n||(n=Er(yf(t),e,t.m?e.LINEAR:e.NEAREST),t.g.push(n),t.o=!0),e.bindTexture(e.TEXTURE_2D,n),n}function bd(t){t.h.bindTexture(t.h.TEXTURE_2D,null)}var Ac,Yt=class{constructor(t,e,n,i,r,s,o){this.g=t,this.m=e,this.o=n,this.canvas=i,this.j=r,this.width=s,this.height=o,this.o&&--kg===0&&console.error("You seem to be creating MPMask instances without invoking .close(). This leaks resources.")}Ua(){return!!qi(this,0)}ua(){return!!qi(this,1)}W(){return!!qi(this,2)}ta(){return(e=qi(t=this,0))||(e=Md(t),e=new Uint8Array(e.map(n=>Math.round(255*n))),t.g.push(e)),e;var t,e}sa(){return Md(this)}S(){return h1(this)}clone(){var t=[];for(let e of this.g){let n;if(e instanceof Uint8Array)n=new Uint8Array(e);else if(e instanceof Float32Array)n=new Float32Array(e);else{if(!(e instanceof WebGLTexture))throw Error(`Type is not supported: ${e}`);{let i=ro(this),r=yf(this);i.activeTexture(i.TEXTURE1),n=Er(r,i,this.m?i.LINEAR:i.NEAREST),i.bindTexture(i.TEXTURE_2D,n);let s=u1(this);i.texImage2D(i.TEXTURE_2D,0,s,this.width,this.height,0,i.RED,i.FLOAT,null),i.bindTexture(i.TEXTURE_2D,null),Sl(r,i,n),ua(r,i,!1,()=>{d1(this),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),bd(this)}),vf(r),bd(this)}}t.push(n)}return new Yt(t,this.m,this.W(),this.canvas,this.j,this.width,this.height)}close(){this.o&&ro(this).deleteTexture(qi(this,2)),kg=-1}};Yt.prototype.close=Yt.prototype.close,Yt.prototype.clone=Yt.prototype.clone,Yt.prototype.getAsWebGLTexture=Yt.prototype.S,Yt.prototype.getAsFloat32Array=Yt.prototype.sa,Yt.prototype.getAsUint8Array=Yt.prototype.ta,Yt.prototype.hasWebGLTexture=Yt.prototype.W,Yt.prototype.hasFloat32Array=Yt.prototype.ua,Yt.prototype.hasUint8Array=Yt.prototype.Ua;var kg=250,gE={color:"white",lineWidth:4,radius:6};function ju(t){return{...gE,fillColor:(t=t||{}).color,...t}}function Xi(t,e){return t instanceof Function?t(e):t}function Bg(t,e,n){return Math.max(Math.min(e,n),Math.min(Math.max(e,n),t))}function Ho(t){if(!t.j)throw Error("CPU rendering requested but CanvasRenderingContext2D not provided.");return t.j}function Qo(t){if(!t.o)throw Error("GPU rendering requested but WebGL2RenderingContext not provided.");return t.o}function zg(t,e,n){if(e.W())n(e.S());else{let i=e.ua()?e.sa():e.ta();t.m=t.m??new us;let r=Qo(t);n((t=new Yt([i],e.m,!1,r.canvas,t.m,e.width,e.height)).S()),t.close()}}function Vg(t,e,n,i){var r=function(a){return a.g||(a.g=new pE),a.g}(t),s=Qo(t),o=Array.isArray(n)?new ImageData(new Uint8ClampedArray(n),1,1):n;ua(r,s,!0,()=>{(function(c,l,h,d){var u=c.g;if(u.activeTexture(u.TEXTURE0),u.bindTexture(u.TEXTURE_2D,l),u.activeTexture(u.TEXTURE1),u.bindTexture(u.TEXTURE_2D,c.u),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,u.RGBA,u.UNSIGNED_BYTE,h),c.J&&function(p,g){if(p!==g)return!1;p=p.entries(),g=g.entries();for(let[v,m]of p){p=v;let f=m,S=g.next();if(S.done)return!1;let[w,M]=S.value;if(p!==w||f[0]!==M[0]||f[1]!==M[1]||f[2]!==M[2]||f[3]!==M[3])return!1}return!!g.next().done}(c.J,d))u.activeTexture(u.TEXTURE2),u.bindTexture(u.TEXTURE_2D,c.o);else{c.J=d;let p=Array(1024).fill(0);d.forEach((g,v)=>{if(g.length!==4)throw Error(`Color at index ${v} is not a four-channel value.`);p[4*v]=g[0],p[4*v+1]=g[1],p[4*v+2]=g[2],p[4*v+3]=g[3]}),u.activeTexture(u.TEXTURE2),u.bindTexture(u.TEXTURE_2D,c.o),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,256,1,0,u.RGBA,u.UNSIGNED_BYTE,new Uint8Array(p))}})(r,e,o,i),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),s.drawArrays(s.TRIANGLE_FAN,0,4);var a=r.g;a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,null),a.activeTexture(a.TEXTURE1),a.bindTexture(a.TEXTURE_2D,null),a.activeTexture(a.TEXTURE2),a.bindTexture(a.TEXTURE_2D,null)})}function Hg(t,e,n,i){var r=Qo(t),s=function(c){return c.h||(c.h=new mE),c.h}(t),o=Array.isArray(n)?new ImageData(new Uint8ClampedArray(n),1,1):n,a=Array.isArray(i)?new ImageData(new Uint8ClampedArray(i),1,1):i;ua(s,r,!0,()=>{var c=s.g;c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,e),c.activeTexture(c.TEXTURE1),c.bindTexture(c.TEXTURE_2D,s.o),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,o),c.activeTexture(c.TEXTURE2),c.bindTexture(c.TEXTURE_2D,s.u),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLE_FAN,0,4),r.bindTexture(r.TEXTURE_2D,null),(c=s.g).activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,null),c.activeTexture(c.TEXTURE1),c.bindTexture(c.TEXTURE_2D,null),c.activeTexture(c.TEXTURE2),c.bindTexture(c.TEXTURE_2D,null)})}var xn=class{constructor(t,e){typeof CanvasRenderingContext2D<"u"&&t instanceof CanvasRenderingContext2D||t instanceof OffscreenCanvasRenderingContext2D?(this.j=t,this.o=e):this.o=t}Ma(t,e){if(t){var n=Ho(this);e=ju(e),n.save();var i=n.canvas,r=0;for(let s of t)n.fillStyle=Xi(e.fillColor,{index:r,from:s}),n.strokeStyle=Xi(e.color,{index:r,from:s}),n.lineWidth=Xi(e.lineWidth,{index:r,from:s}),(t=new Path2D).arc(s.x*i.width,s.y*i.height,Xi(e.radius,{index:r,from:s}),0,2*Math.PI),n.fill(t),n.stroke(t),++r;n.restore()}}La(t,e,n){if(t&&e){var i=Ho(this);n=ju(n),i.save();var r=i.canvas,s=0;for(let o of e){i.beginPath(),e=t[o.start];let a=t[o.end];e&&a&&(i.strokeStyle=Xi(n.color,{index:s,from:e,to:a}),i.lineWidth=Xi(n.lineWidth,{index:s,from:e,to:a}),i.moveTo(e.x*r.width,e.y*r.height),i.lineTo(a.x*r.width,a.y*r.height)),++s,i.stroke()}i.restore()}}Ia(t,e){var n=Ho(this);e=ju(e),n.save(),n.beginPath(),n.lineWidth=Xi(e.lineWidth,{}),n.strokeStyle=Xi(e.color,{}),n.fillStyle=Xi(e.fillColor,{}),n.moveTo(t.originX,t.originY),n.lineTo(t.originX+t.width,t.originY),n.lineTo(t.originX+t.width,t.originY+t.height),n.lineTo(t.originX,t.originY+t.height),n.lineTo(t.originX,t.originY),n.stroke(),n.fill(),n.restore()}Ja(t,e,n=[0,0,0,255]){this.j?function(i,r,s,o){var a=Qo(i);zg(i,r,c=>{Vg(i,c,s,o),(c=Ho(i)).drawImage(a.canvas,0,0,c.canvas.width,c.canvas.height)})}(this,t,n,e):Vg(this,t.S(),n,e)}Ka(t,e,n){this.j?function(i,r,s,o){var a=Qo(i);zg(i,r,c=>{Hg(i,c,s,o),(c=Ho(i)).drawImage(a.canvas,0,0,c.canvas.width,c.canvas.height)})}(this,t,e,n):Hg(this,t.S(),e,n)}close(){this.g?.close(),this.g=void 0,this.h?.close(),this.h=void 0,this.m?.close(),this.m=void 0}};function vi(t,e){switch(e){case 0:return t.g.find(n=>n instanceof ImageData);case 1:return t.g.find(n=>typeof ImageBitmap<"u"&&n instanceof ImageBitmap);case 2:return t.g.find(n=>typeof WebGLTexture<"u"&&n instanceof WebGLTexture);default:throw Error(`Type is not supported: ${e}`)}}function f1(t){var e=vi(t,0);if(!e){e=so(t);let n=El(t),i=new Uint8Array(t.width*t.height*4);Sl(n,e,Uc(t)),e.readPixels(0,0,t.width,t.height,e.RGBA,e.UNSIGNED_BYTE,i),vf(n),e=new ImageData(new Uint8ClampedArray(i.buffer),t.width,t.height),t.g.push(e)}return e}function Uc(t){var e=vi(t,2);if(!e){let n=so(t);e=Nc(t);let i=vi(t,1)||f1(t);n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,i),Wo(t)}return e}function so(t){if(!t.canvas)throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");return t.h||(t.h=fn(t.canvas.getContext("webgl2"),"You cannot use a canvas that is already bound to a different type of rendering context.")),t.h}function El(t){return t.j||(t.j=new us),t.j}function Nc(t){var e=so(t);e.viewport(0,0,t.width,t.height),e.activeTexture(e.TEXTURE0);var n=vi(t,2);return n||(n=Er(El(t),e),t.g.push(n),t.m=!0),e.bindTexture(e.TEXTURE_2D,n),n}function Wo(t){t.h.bindTexture(t.h.TEXTURE_2D,null)}function Gg(t){var e=so(t);return ua(El(t),e,!0,()=>function(n,i){var r=n.canvas;if(r.width===n.width&&r.height===n.height)return i();var s=r.width,o=r.height;return r.width=n.width,r.height=n.height,n=i(),r.width=s,r.height=o,n}(t,()=>{if(e.bindFramebuffer(e.FRAMEBUFFER,null),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLE_FAN,0,4),!(t.canvas instanceof OffscreenCanvas))throw Error("Conversion to ImageBitmap requires that the MediaPipe Tasks is initialized with an OffscreenCanvas");return t.canvas.transferToImageBitmap()}))}xn.prototype.close=xn.prototype.close,xn.prototype.drawConfidenceMask=xn.prototype.Ka,xn.prototype.drawCategoryMask=xn.prototype.Ja,xn.prototype.drawBoundingBox=xn.prototype.Ia,xn.prototype.drawConnectors=xn.prototype.La,xn.prototype.drawLandmarks=xn.prototype.Ma,xn.lerp=function(t,e,n,i,r){return Bg(i*(1-(t-e)/(n-e))+r*(1-(n-t)/(n-e)),i,r)},xn.clamp=Bg;var on=class{constructor(t,e,n,i,r,s,o){this.g=t,this.o=e,this.m=n,this.canvas=i,this.j=r,this.width=s,this.height=o,(this.o||this.m)&&--Wg===0&&console.error("You seem to be creating MPImage instances without invoking .close(). This leaks resources.")}Ta(){return!!vi(this,0)}va(){return!!vi(this,1)}W(){return!!vi(this,2)}Qa(){return f1(this)}Pa(){var t=vi(this,1);return t||(Uc(this),Nc(this),t=Gg(this),Wo(this),this.g.push(t),this.o=!0),t}S(){return Uc(this)}clone(){var t=[];for(let e of this.g){let n;if(e instanceof ImageData)n=new ImageData(e.data,this.width,this.height);else if(e instanceof WebGLTexture){let i=so(this),r=El(this);i.activeTexture(i.TEXTURE1),n=Er(r,i),i.bindTexture(i.TEXTURE_2D,n),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.width,this.height,0,i.RGBA,i.UNSIGNED_BYTE,null),i.bindTexture(i.TEXTURE_2D,null),Sl(r,i,n),ua(r,i,!1,()=>{Nc(this),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),Wo(this)}),vf(r),Wo(this)}else{if(!(e instanceof ImageBitmap))throw Error(`Type is not supported: ${e}`);Uc(this),Nc(this),n=Gg(this),Wo(this)}t.push(n)}return new on(t,this.va(),this.W(),this.canvas,this.j,this.width,this.height)}close(){this.o&&vi(this,1).close(),this.m&&so(this).deleteTexture(vi(this,2)),Wg=-1}};on.prototype.close=on.prototype.close,on.prototype.clone=on.prototype.clone,on.prototype.getAsWebGLTexture=on.prototype.S,on.prototype.getAsImageBitmap=on.prototype.Pa,on.prototype.getAsImageData=on.prototype.Qa,on.prototype.hasWebGLTexture=on.prototype.W,on.prototype.hasImageBitmap=on.prototype.va,on.prototype.hasImageData=on.prototype.Ta;var Wg=250;function ci(...t){return t.map(([e,n])=>({start:e,end:n}))}var Xg,_E=l1((Xg=c1(a1),class extends Xg{get oa(){return this.i}Da(t,e,n){Re(this,e,i=>{var[r,s]=o1(this,t,i);this.oa._addBoundTextureAsImageToStream(i,r,s,n)})}ga(t,e){_i(this,t,e),Re(this,t,n=>{this.oa._attachImageListener(n)})}ha(t,e){yr(this,t,e),Re(this,t,n=>{this.oa._attachImageVectorListener(n)})}})),li=class extends _E{};async function ot(t,e,n){return Dc(t,n.canvas??(mf()?void 0:document.createElement("canvas")),e,n)}function p1(t,e,n,i){if(t.m&&i!==void 0)if(lt(t.baseOptions,Kc,3)?.g()){var r=t.m;++r.g.T,r.h.set(i,performance.now())}else++(r=t.m).g.P,r.h.set(i,performance.now());if(t.qa){if(r=new U_,n?.regionOfInterest){if(!t.Ca)throw Error("This task doesn't support region-of-interest.");var s=n.regionOfInterest;if(s.left>=s.right||s.top>=s.bottom)throw Error("Expected RectF with left < right and top < bottom.");if(s.left<0||s.top<0||s.right>1||s.bottom>1)throw Error("Expected RectF values to be in [0,1].");Le(r,1,(s.left+s.right)/2),Le(r,2,(s.top+s.bottom)/2),Le(r,4,s.right-s.left),Le(r,3,s.bottom-s.top)}else Le(r,1,.5),Le(r,2,.5),Le(r,4,1),Le(r,3,1);if(n?.rotationDegrees){if(n?.rotationDegrees%90!=0)throw Error("Expected rotation to be a multiple of 90\xB0.");if(Le(r,5,-Math.PI*n.rotationDegrees/180),n?.rotationDegrees%180!=0){let[o,a]=gf(e);n=Ht(r,3)*a/o,s=Ht(r,4)*o/a,Le(r,4,n),Le(r,3,s)}}t.g.addProtoToStream(r.g(),"mediapipe.NormalizedRect",t.qa,i)}t.g.Da(e,t.Ba,i??performance.now()),t.finishProcessing(i)}function hi(t,e,n){if(t.J)throw Error("Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.");p1(t,e,n,t.I+1)}function Ai(t,e,n,i){if(!t.J)throw Error("Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.");p1(t,e,n,i)}function oo(t,e,n,i){var r=e.data,s=e.width,o=s*(e=e.height);if((r instanceof Uint8Array||r instanceof Float32Array)&&r.length!==o)throw Error("Unsupported channel count: "+r.length/o);return t=new Yt([r],n,!1,t.g.i.canvas,t.da,s,e),i?t.clone():t}var On=class extends Qc{constructor(t,e,n,i){super(t),this.g=t,this.Ba=e,this.qa=n,this.Ca=i,this.da=new us,this.J=!1}j(t,e=!0){if("runningMode"in t){var n=this.J=!!t.runningMode&&t.runningMode!=="IMAGE";ze(this.baseOptions,2,n==null?n:Oc(n))}if(t.canvas!==void 0&&this.g.i.canvas!==t.canvas)throw Error("You must create a new task to reset the canvas.");return super.j(t,e)}close(){this.da.close(),super.close()}};On.prototype.close=On.prototype.close;var Wn=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect_in",!1),this.l={detections:[]},De(t=this.h=new yl,0,1,e=new Nt),Le(this.h,2,.5),Le(this.h,3,.3)}C(){return"FaceDetector"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return"minDetectionConfidence"in t&&Le(this.h,2,t.minDetectionConfidence??.5),"minSuppressionThreshold"in t&&Le(this.h,3,t.minSuppressionThreshold??.3),this.j(t)}G(t,e){return this.l={detections:[]},hi(this,t,e),this.l}H(t,e,n){return this.l={detections:[]},Ai(this,t,n,e),this.l}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect_in"),ht(t,"detections");var e=new kn;wi(e,F3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.face_detector.FaceDetectorGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect_in"),it(n,"DETECTIONS:detections"),n.v(e),Zn(t,n),this.g.attachProtoVectorListener("detections",(i,r)=>{for(let s of i)i=P_(s),this.l.detections.push(n1(i));ve(this,r)}),this.g.attachEmptyPacketListener("detections",i=>{ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Wn.prototype.detectForVideo=Wn.prototype.H,Wn.prototype.detect=Wn.prototype.G,Wn.prototype.setOptions=Wn.prototype.v,Wn.createFromModelPath=async function(t,e){return ot(Wn,t,{baseOptions:{modelAssetPath:e}})},Wn.createFromModelBuffer=function(t,e){return ot(Wn,t,{baseOptions:{modelAssetBuffer:e}})},Wn.createFromOptions=function(t,e){return ot(Wn,t,e)};var xf=ci([61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]),Mf=ci([263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]),bf=ci([276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]),m1=ci([474,475],[475,476],[476,477],[477,474]),Sf=ci([33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]),Ef=ci([46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]),g1=ci([469,470],[470,471],[471,472],[472,469]),wf=ci([10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]),_1=[...xf,...Mf,...bf,...Sf,...Ef,...wf],v1=ci([127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]);function $g(t){t.l={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]}}var ct=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect",!1),this.l={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]},this.outputFacialTransformationMatrixes=this.outputFaceBlendshapes=!1,De(t=this.h=new k_,0,1,e=new Nt),this.B=new O_,De(this.h,0,3,this.B),this.u=new yl,De(this.h,0,2,this.u),bi(this.u,4,1),Le(this.u,2,.5),Le(this.B,2,.5),Le(this.h,4,.5)}C(){return"FaceLandmarker"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return"numFaces"in t&&bi(this.u,4,t.numFaces??1),"minFaceDetectionConfidence"in t&&Le(this.u,2,t.minFaceDetectionConfidence??.5),"minTrackingConfidence"in t&&Le(this.h,4,t.minTrackingConfidence??.5),"minFacePresenceConfidence"in t&&Le(this.B,2,t.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in t&&(this.outputFaceBlendshapes=!!t.outputFaceBlendshapes),"outputFacialTransformationMatrixes"in t&&(this.outputFacialTransformationMatrixes=!!t.outputFacialTransformationMatrixes),this.j(t)}G(t,e){return $g(this),hi(this,t,e),this.l}H(t,e,n){return $g(this),Ai(this,t,n,e),this.l}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect"),ht(t,"face_landmarks");var e=new kn;wi(e,k3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect"),it(n,"NORM_LANDMARKS:face_landmarks"),n.v(e),Zn(t,n),this.g.attachProtoVectorListener("face_landmarks",(i,r)=>{for(let s of i)i=ha(s),this.l.faceLandmarks.push(xl(i));ve(this,r)}),this.g.attachEmptyPacketListener("face_landmarks",i=>{ve(this,i)}),this.outputFaceBlendshapes&&(ht(t,"blendshapes"),it(n,"BLENDSHAPES:blendshapes"),this.g.attachProtoVectorListener("blendshapes",(i,r)=>{if(this.outputFaceBlendshapes)for(let s of i)i=vl(s),this.l.faceBlendshapes.push(pf(i.g()??[]));ve(this,r)}),this.g.attachEmptyPacketListener("blendshapes",i=>{ve(this,i)})),this.outputFacialTransformationMatrixes&&(ht(t,"face_geometry"),it(n,"FACE_GEOMETRY:face_geometry"),this.g.attachProtoVectorListener("face_geometry",(i,r)=>{if(this.outputFacialTransformationMatrixes)for(let s of i)(i=lt(i=O3(s),A3,2))&&this.l.facialTransformationMatrixes.push({rows:qn(i,1)??0??0,columns:qn(i,2)??0??0,data:Jr(i,3,ai,Zr()).slice()??[]});ve(this,r)}),this.g.attachEmptyPacketListener("face_geometry",i=>{ve(this,i)})),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};ct.prototype.detectForVideo=ct.prototype.H,ct.prototype.detect=ct.prototype.G,ct.prototype.setOptions=ct.prototype.v,ct.createFromModelPath=function(t,e){return ot(ct,t,{baseOptions:{modelAssetPath:e}})},ct.createFromModelBuffer=function(t,e){return ot(ct,t,{baseOptions:{modelAssetBuffer:e}})},ct.createFromOptions=function(t,e){return ot(ct,t,e)},ct.FACE_LANDMARKS_LIPS=xf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LIPS",ct.FACE_LANDMARKS_LIPS),ct.FACE_LANDMARKS_LEFT_EYE=Mf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LEFT_EYE",ct.FACE_LANDMARKS_LEFT_EYE),ct.FACE_LANDMARKS_LEFT_EYEBROW=bf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW",ct.FACE_LANDMARKS_LEFT_EYEBROW),ct.FACE_LANDMARKS_LEFT_IRIS=m1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS",ct.FACE_LANDMARKS_LEFT_IRIS),ct.FACE_LANDMARKS_RIGHT_EYE=Sf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE",ct.FACE_LANDMARKS_RIGHT_EYE),ct.FACE_LANDMARKS_RIGHT_EYEBROW=Ef,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW",ct.FACE_LANDMARKS_RIGHT_EYEBROW),ct.FACE_LANDMARKS_RIGHT_IRIS=g1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS",ct.FACE_LANDMARKS_RIGHT_IRIS),ct.FACE_LANDMARKS_FACE_OVAL=wf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_FACE_OVAL",ct.FACE_LANDMARKS_FACE_OVAL),ct.FACE_LANDMARKS_CONTOURS=_1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_CONTOURS",ct.FACE_LANDMARKS_CONTOURS),ct.FACE_LANDMARKS_TESSELATION=v1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_TESSELATION",ct.FACE_LANDMARKS_TESSELATION);var Tf=ci([0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]);function qg(t){t.gestures=[],t.landmarks=[],t.worldLandmarks=[],t.handedness=[]}function Yg(t){return t.gestures.length===0?{gestures:[],landmarks:[],worldLandmarks:[],handedness:[],handednesses:[]}:{gestures:t.gestures,landmarks:t.landmarks,worldLandmarks:t.worldLandmarks,handedness:t.handedness,handednesses:t.handedness}}function Kg(t,e=!0){var n=[];for(let r of t){var i=vl(r);t=[];for(let s of i.g())i=e&&qn(s,1)!=null?qn(s,1)??0:-1,t.push({score:Ht(s,2)??0,index:i,categoryName:ln(kt(s,3))??""??"",displayName:ln(kt(s,4))??""??""});n.push(t)}return n}var Mn=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect",!1),this.gestures=[],this.landmarks=[],this.worldLandmarks=[],this.handedness=[],De(t=this.l=new V_,0,1,e=new Nt),this.u=new hf,De(this.l,0,2,this.u),this.F=new lf,De(this.u,0,3,this.F),this.B=new z_,De(this.u,0,2,this.B),this.h=new B3,De(this.l,0,3,this.h),Le(this.B,2,.5),Le(this.u,4,.5),Le(this.F,2,.5)}C(){return"GestureRecognizer"}get baseOptions(){return lt(this.l,Nt,1)}set baseOptions(t){De(this.l,0,1,t)}v(t){if(bi(this.B,3,t.numHands??1),"minHandDetectionConfidence"in t&&Le(this.B,2,t.minHandDetectionConfidence??.5),"minTrackingConfidence"in t&&Le(this.u,4,t.minTrackingConfidence??.5),"minHandPresenceConfidence"in t&&Le(this.F,2,t.minHandPresenceConfidence??.5),t.cannedGesturesClassifierOptions){var e=new $s,n=e,i=pd(t.cannedGesturesClassifierOptions,lt(this.h,$s,3)?.j());De(n,0,2,i),De(this.h,0,3,e)}else t.cannedGesturesClassifierOptions===void 0&&lt(this.h,$s,3)?.g();return t.customGesturesClassifierOptions?(De(n=e=new $s,0,2,i=pd(t.customGesturesClassifierOptions,lt(this.h,$s,4)?.j())),De(this.h,0,4,e)):t.customGesturesClassifierOptions===void 0&&lt(this.h,$s,4)?.g(),this.j(t)}Xa(t,e){return qg(this),hi(this,t,e),Yg(this)}Ya(t,e,n){return qg(this),Ai(this,t,n,e),Yg(this)}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect"),ht(t,"hand_gestures"),ht(t,"hand_landmarks"),ht(t,"world_hand_landmarks"),ht(t,"handedness");var e=new kn;wi(e,z3,this.l);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect"),it(n,"HAND_GESTURES:hand_gestures"),it(n,"LANDMARKS:hand_landmarks"),it(n,"WORLD_LANDMARKS:world_hand_landmarks"),it(n,"HANDEDNESS:handedness"),n.v(e),Zn(t,n),this.g.attachProtoVectorListener("hand_landmarks",(i,r)=>{for(let s of i){i=ha(s);let o=[];for(let a of Qi(i,D_,1))o.push({x:Ht(a,1)??0,y:Ht(a,2)??0,z:Ht(a,3)??0,visibility:Ht(a,4)??0});this.landmarks.push(o)}ve(this,r)}),this.g.attachEmptyPacketListener("hand_landmarks",i=>{ve(this,i)}),this.g.attachProtoVectorListener("world_hand_landmarks",(i,r)=>{for(let s of i){i=Ks(s);let o=[];for(let a of Qi(i,L_,1))o.push({x:Ht(a,1)??0,y:Ht(a,2)??0,z:Ht(a,3)??0,visibility:Ht(a,4)??0});this.worldLandmarks.push(o)}ve(this,r)}),this.g.attachEmptyPacketListener("world_hand_landmarks",i=>{ve(this,i)}),this.g.attachProtoVectorListener("hand_gestures",(i,r)=>{this.gestures.push(...Kg(i,!1)),ve(this,r)}),this.g.attachEmptyPacketListener("hand_gestures",i=>{ve(this,i)}),this.g.attachProtoVectorListener("handedness",(i,r)=>{this.handedness.push(...Kg(i)),ve(this,r)}),this.g.attachEmptyPacketListener("handedness",i=>{ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};function Zg(t){return{landmarks:t.landmarks,worldLandmarks:t.worldLandmarks,handednesses:t.handedness,handedness:t.handedness}}Mn.prototype.recognizeForVideo=Mn.prototype.Ya,Mn.prototype.recognize=Mn.prototype.Xa,Mn.prototype.setOptions=Mn.prototype.v,Mn.createFromModelPath=function(t,e){return ot(Mn,t,{baseOptions:{modelAssetPath:e}})},Mn.createFromModelBuffer=function(t,e){return ot(Mn,t,{baseOptions:{modelAssetBuffer:e}})},Mn.createFromOptions=function(t,e){return ot(Mn,t,e)},Mn.HAND_CONNECTIONS=Tf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$gesture_recognizer$gesture_recognizer.GestureRecognizer.HAND_CONNECTIONS",Mn.HAND_CONNECTIONS);var bn=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.handedness=[],De(t=this.h=new hf,0,1,e=new Nt),this.u=new lf,De(this.h,0,3,this.u),this.l=new z_,De(this.h,0,2,this.l),bi(this.l,3,1),Le(this.l,2,.5),Le(this.u,2,.5),Le(this.h,4,.5)}C(){return"HandLandmarker"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return"numHands"in t&&bi(this.l,3,t.numHands??1),"minHandDetectionConfidence"in t&&Le(this.l,2,t.minHandDetectionConfidence??.5),"minTrackingConfidence"in t&&Le(this.h,4,t.minTrackingConfidence??.5),"minHandPresenceConfidence"in t&&Le(this.u,2,t.minHandPresenceConfidence??.5),this.j(t)}G(t,e){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],hi(this,t,e),Zg(this)}H(t,e,n){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],Ai(this,t,n,e),Zg(this)}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect"),ht(t,"hand_landmarks"),ht(t,"world_hand_landmarks"),ht(t,"handedness");var e=new kn;wi(e,V3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect"),it(n,"LANDMARKS:hand_landmarks"),it(n,"WORLD_LANDMARKS:world_hand_landmarks"),it(n,"HANDEDNESS:handedness"),n.v(e),Zn(t,n),this.g.attachProtoVectorListener("hand_landmarks",(i,r)=>{for(let s of i)i=ha(s),this.landmarks.push(xl(i));ve(this,r)}),this.g.attachEmptyPacketListener("hand_landmarks",i=>{ve(this,i)}),this.g.attachProtoVectorListener("world_hand_landmarks",(i,r)=>{for(let s of i)i=Ks(s),this.worldLandmarks.push(qo(i));ve(this,r)}),this.g.attachEmptyPacketListener("world_hand_landmarks",i=>{ve(this,i)}),this.g.attachProtoVectorListener("handedness",(i,r)=>{var s=this.handedness,o=s.push,a=[];for(let c of i){i=vl(c);let l=[];for(let h of i.g())l.push({score:Ht(h,2)??0,index:qn(h,1)??0??-1,categoryName:ln(kt(h,3))??""??"",displayName:ln(kt(h,4))??""??""});a.push(l)}o.call(s,...a),ve(this,r)}),this.g.attachEmptyPacketListener("handedness",i=>{ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};bn.prototype.detectForVideo=bn.prototype.H,bn.prototype.detect=bn.prototype.G,bn.prototype.setOptions=bn.prototype.v,bn.createFromModelPath=function(t,e){return ot(bn,t,{baseOptions:{modelAssetPath:e}})},bn.createFromModelBuffer=function(t,e){return ot(bn,t,{baseOptions:{modelAssetBuffer:e}})},bn.createFromOptions=function(t,e){return ot(bn,t,e)},bn.HAND_CONNECTIONS=Tf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$hand_landmarker$hand_landmarker.HandLandmarker.HAND_CONNECTIONS",bn.HAND_CONNECTIONS);var y1=ci([0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]);function Jg(t){t.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]}}function jg(t){try{if(!t.F)return t.h;t.F(t.h)}finally{bl(t)}}function Rc(t,e){t=ha(t),e.push(xl(t))}var Qe=class extends On{constructor(t,e){super(new li(t,e),"input_frames_image",null,!1),this.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]},this.outputPoseSegmentationMasks=this.outputFaceBlendshapes=!1,De(t=this.l=new $_,0,1,e=new Nt),this.Y=new lf,De(this.l,0,2,this.Y),this.Aa=new H3,De(this.l,0,3,this.Aa),this.u=new yl,De(this.l,0,4,this.u),this.O=new O_,De(this.l,0,5,this.O),this.B=new W_,De(this.l,0,6,this.B),this.Z=new X_,De(this.l,0,7,this.Z),Le(this.u,2,.5),Le(this.u,3,.3),Le(this.O,2,.5),Le(this.B,2,.5),Le(this.B,3,.3),Le(this.Z,2,.5),Le(this.Y,2,.5)}C(){return"HolisticLandmarker"}get baseOptions(){return lt(this.l,Nt,1)}set baseOptions(t){De(this.l,0,1,t)}v(t){return"minFaceDetectionConfidence"in t&&Le(this.u,2,t.minFaceDetectionConfidence??.5),"minFaceSuppressionThreshold"in t&&Le(this.u,3,t.minFaceSuppressionThreshold??.3),"minFacePresenceConfidence"in t&&Le(this.O,2,t.minFacePresenceConfidence??.5),"outputFaceBlendshapes"in t&&(this.outputFaceBlendshapes=!!t.outputFaceBlendshapes),"minPoseDetectionConfidence"in t&&Le(this.B,2,t.minPoseDetectionConfidence??.5),"minPoseSuppressionThreshold"in t&&Le(this.B,3,t.minPoseSuppressionThreshold??.3),"minPosePresenceConfidence"in t&&Le(this.Z,2,t.minPosePresenceConfidence??.5),"outputPoseSegmentationMasks"in t&&(this.outputPoseSegmentationMasks=!!t.outputPoseSegmentationMasks),"minHandLandmarksConfidence"in t&&Le(this.Y,2,t.minHandLandmarksConfidence??.5),this.j(t)}G(t,e,n){var i=typeof e!="function"?e:{};return this.F=typeof e=="function"?e:n,Jg(this),hi(this,t,i),jg(this)}H(t,e,n,i){var r=typeof n!="function"?n:{};return this.F=typeof n=="function"?n:i,Jg(this),Ai(this,t,r,e),jg(this)}o(){var t=new Bn;Ut(t,"input_frames_image"),ht(t,"pose_landmarks"),ht(t,"pose_world_landmarks"),ht(t,"face_landmarks"),ht(t,"left_hand_landmarks"),ht(t,"left_hand_world_landmarks"),ht(t,"right_hand_landmarks"),ht(t,"right_hand_world_landmarks");var e=new kn,n=new cg;Fn(n,1,"type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions"),function(r,s){if(s!=null)if(Array.isArray(s))ze(r,2,ol(s,0,Zo));else{if(!(typeof s=="string"||s instanceof yi||Td(s)))throw Error("invalid value in Any.value field: "+s+" expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array");ra(r,2,tl(s,!1),rs())}}(n,this.l.g());var i=new Tn;Fn(i,2,"mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph"),Jo(i,8,cg,n),Dt(i,"IMAGE:input_frames_image"),it(i,"POSE_LANDMARKS:pose_landmarks"),it(i,"POSE_WORLD_LANDMARKS:pose_world_landmarks"),it(i,"FACE_LANDMARKS:face_landmarks"),it(i,"LEFT_HAND_LANDMARKS:left_hand_landmarks"),it(i,"LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"),it(i,"RIGHT_HAND_LANDMARKS:right_hand_landmarks"),it(i,"RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"),i.v(e),Zn(t,i),Ml(this,t),this.g.attachProtoListener("pose_landmarks",(r,s)=>{Rc(r,this.h.poseLandmarks),ve(this,s)}),this.g.attachEmptyPacketListener("pose_landmarks",r=>{ve(this,r)}),this.g.attachProtoListener("pose_world_landmarks",(r,s)=>{var o=this.h.poseWorldLandmarks;r=Ks(r),o.push(qo(r)),ve(this,s)}),this.g.attachEmptyPacketListener("pose_world_landmarks",r=>{ve(this,r)}),this.outputPoseSegmentationMasks&&(it(i,"POSE_SEGMENTATION_MASK:pose_segmentation_mask"),io(this,"pose_segmentation_mask"),this.g.ga("pose_segmentation_mask",(r,s)=>{this.h.poseSegmentationMasks=[oo(this,r,!0,!this.F)],ve(this,s)}),this.g.attachEmptyPacketListener("pose_segmentation_mask",r=>{this.h.poseSegmentationMasks=[],ve(this,r)})),this.g.attachProtoListener("face_landmarks",(r,s)=>{Rc(r,this.h.faceLandmarks),ve(this,s)}),this.g.attachEmptyPacketListener("face_landmarks",r=>{ve(this,r)}),this.outputFaceBlendshapes&&(ht(t,"extra_blendshapes"),it(i,"FACE_BLENDSHAPES:extra_blendshapes"),this.g.attachProtoListener("extra_blendshapes",(r,s)=>{var o=this.h.faceBlendshapes;this.outputFaceBlendshapes&&(r=vl(r),o.push(pf(r.g()??[]))),ve(this,s)}),this.g.attachEmptyPacketListener("extra_blendshapes",r=>{ve(this,r)})),this.g.attachProtoListener("left_hand_landmarks",(r,s)=>{Rc(r,this.h.leftHandLandmarks),ve(this,s)}),this.g.attachEmptyPacketListener("left_hand_landmarks",r=>{ve(this,r)}),this.g.attachProtoListener("left_hand_world_landmarks",(r,s)=>{var o=this.h.leftHandWorldLandmarks;r=Ks(r),o.push(qo(r)),ve(this,s)}),this.g.attachEmptyPacketListener("left_hand_world_landmarks",r=>{ve(this,r)}),this.g.attachProtoListener("right_hand_landmarks",(r,s)=>{Rc(r,this.h.rightHandLandmarks),ve(this,s)}),this.g.attachEmptyPacketListener("right_hand_landmarks",r=>{ve(this,r)}),this.g.attachProtoListener("right_hand_world_landmarks",(r,s)=>{var o=this.h.rightHandWorldLandmarks;r=Ks(r),o.push(qo(r)),ve(this,s)}),this.g.attachEmptyPacketListener("right_hand_world_landmarks",r=>{ve(this,r)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Qe.prototype.detectForVideo=Qe.prototype.H,Qe.prototype.detect=Qe.prototype.G,Qe.prototype.setOptions=Qe.prototype.v,Qe.createFromModelPath=function(t,e){return ot(Qe,t,{baseOptions:{modelAssetPath:e}})},Qe.createFromModelBuffer=function(t,e){return ot(Qe,t,{baseOptions:{modelAssetBuffer:e}})},Qe.createFromOptions=function(t,e){return ot(Qe,t,e)},Qe.HAND_CONNECTIONS=Tf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.HAND_CONNECTIONS",Qe.HAND_CONNECTIONS),Qe.POSE_CONNECTIONS=y1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.POSE_CONNECTIONS",Qe.POSE_CONNECTIONS),Qe.FACE_LANDMARKS_LIPS=xf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LIPS",Qe.FACE_LANDMARKS_LIPS),Qe.FACE_LANDMARKS_LEFT_EYE=Mf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LEFT_EYE",Qe.FACE_LANDMARKS_LEFT_EYE),Qe.FACE_LANDMARKS_LEFT_EYEBROW=bf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LEFT_EYEBROW",Qe.FACE_LANDMARKS_LEFT_EYEBROW),Qe.FACE_LANDMARKS_LEFT_IRIS=m1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LEFT_IRIS",Qe.FACE_LANDMARKS_LEFT_IRIS),Qe.FACE_LANDMARKS_RIGHT_EYE=Sf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYE",Qe.FACE_LANDMARKS_RIGHT_EYE),Qe.FACE_LANDMARKS_RIGHT_EYEBROW=Ef,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW",Qe.FACE_LANDMARKS_RIGHT_EYEBROW),Qe.FACE_LANDMARKS_RIGHT_IRIS=g1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_RIGHT_IRIS",Qe.FACE_LANDMARKS_RIGHT_IRIS),Qe.FACE_LANDMARKS_FACE_OVAL=wf,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_FACE_OVAL",Qe.FACE_LANDMARKS_FACE_OVAL),Qe.FACE_LANDMARKS_CONTOURS=_1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_CONTOURS",Qe.FACE_LANDMARKS_CONTOURS),Qe.FACE_LANDMARKS_TESSELATION=v1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_TESSELATION",Qe.FACE_LANDMARKS_TESSELATION);var Xn=class extends On{constructor(t,e){super(new li(t,e),"input_image","norm_rect",!0),this.l={classifications:[]},De(t=this.h=new q_,0,1,e=new Nt)}C(){return"ImageClassifier"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return De(this.h,0,2,pd(t,lt(this.h,af,2))),this.j(t)}Ga(t,e){return this.l={classifications:[]},hi(this,t,e),this.l}Ha(t,e,n){return this.l={classifications:[]},Ai(this,t,n,e),this.l}o(){var t=new Bn;Ut(t,"input_image"),Ut(t,"norm_rect"),ht(t,"classifications");var e=new kn;wi(e,G3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"),Dt(n,"IMAGE:input_image"),Dt(n,"NORM_RECT:norm_rect"),it(n,"CLASSIFICATIONS:classifications"),n.v(e),Zn(t,n),this.g.attachProtoListener("classifications",(i,r)=>{this.l=Q3(I3(i)),ve(this,r)}),this.g.attachEmptyPacketListener("classifications",i=>{ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Xn.prototype.classifyForVideo=Xn.prototype.Ha,Xn.prototype.classify=Xn.prototype.Ga,Xn.prototype.setOptions=Xn.prototype.v,Xn.createFromModelPath=function(t,e){return ot(Xn,t,{baseOptions:{modelAssetPath:e}})},Xn.createFromModelBuffer=function(t,e){return ot(Xn,t,{baseOptions:{modelAssetBuffer:e}})},Xn.createFromOptions=function(t,e){return ot(Xn,t,e)};var Un=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect",!0),this.h=new Y_,this.embeddings={embeddings:[]},De(t=this.h,0,1,e=new Nt)}C(){return"ImageEmbedder"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){var e=this.h,n=lt(this.h,_g,2);if(n=n?n.clone():new _g,t.l2Normalize!==void 0){var i=t.l2Normalize;ze(n,1,i==null?i:Oc(i))}else"l2Normalize"in t&&ze(n,1);return t.quantize!==void 0?ze(n,2,(i=t.quantize)==null?i:Oc(i)):"quantize"in t&&ze(n,2),De(e,0,2,n),this.j(t)}Na(t,e){return hi(this,t,e),this.embeddings}Oa(t,e,n){return Ai(this,t,n,e),this.embeddings}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect"),ht(t,"embeddings_out");var e=new kn;wi(e,W3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect"),it(n,"EMBEDDINGS:embeddings_out"),n.v(e),Zn(t,n),this.g.attachProtoListener("embeddings_out",(i,r)=>{i=D3(i),this.embeddings=function(s){return{embeddings:Qi(s,L3,1).map(o=>{var a={headIndex:qn(o,3)??0??-1,headName:ln(kt(o,4))??""??""};if(D0(o,gg,1,of))o=Jr(o=Jm(o,gg,1),1,ai,Zr()),a.floatEmbedding=o.slice();else{let c=new Uint8Array(0);a.quantizedEmbedding=Jm(o,P3,2)?.g()?.h()??c}return a}),timestampMs:t1(kt(s,2,void 0,Bc)??L0)}}(i),ve(this,r)}),this.g.attachEmptyPacketListener("embeddings_out",i=>{ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Un.cosineSimilarity=function(t,e){if(t.floatEmbedding&&e.floatEmbedding)t=bg(t.floatEmbedding,e.floatEmbedding);else{if(!t.quantizedEmbedding||!e.quantizedEmbedding)throw Error("Cannot compute cosine similarity between quantized and float embeddings.");t=bg(Mg(t.quantizedEmbedding),Mg(e.quantizedEmbedding))}return t},Un.prototype.embedForVideo=Un.prototype.Oa,Un.prototype.embed=Un.prototype.Na,Un.prototype.setOptions=Un.prototype.v,Un.createFromModelPath=function(t,e){return ot(Un,t,{baseOptions:{modelAssetPath:e}})},Un.createFromModelBuffer=function(t,e){return ot(Un,t,{baseOptions:{modelAssetBuffer:e}})},Un.createFromOptions=function(t,e){return ot(Un,t,e)};var Sd=class{constructor(t,e,n){this.confidenceMasks=t,this.categoryMask=e,this.qualityScores=n}close(){this.confidenceMasks?.forEach(t=>{t.close()}),this.categoryMask?.close()}};function vE(t){var e=function(n){return Qi(n,Tn,1)}(t.ja()).filter(n=>(ln(kt(n,1))??"").includes("mediapipe.tasks.TensorsToSegmentationCalculator"));if(t.u=[],e.length>1)throw Error("The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.");e.length===1&&(lt(e[0],kn,7)?.o()?.g()??new Map).forEach((n,i)=>{t.u[Number(i)]=ln(kt(n,1))??""})}function Qg(t){t.categoryMask=void 0,t.confidenceMasks=void 0,t.qualityScores=void 0}function e0(t){try{let e=new Sd(t.confidenceMasks,t.categoryMask,t.qualityScores);if(!t.l)return e;t.l(e)}finally{bl(t)}}Sd.prototype.close=Sd.prototype.close;var Sn=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect",!1),this.u=[],this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new ff,this.B=new K_,De(this.h,0,3,this.B),De(t=this.h,0,1,e=new Nt)}C(){return"ImageSegmenter"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return t.displayNamesLocale!==void 0?ze(this.h,2,Yi(t.displayNamesLocale)):"displayNamesLocale"in t&&ze(this.h,2),"outputCategoryMask"in t&&(this.outputCategoryMask=t.outputCategoryMask??!1),"outputConfidenceMasks"in t&&(this.outputConfidenceMasks=t.outputConfidenceMasks??!0),super.j(t)}L(){vE(this)}segment(t,e,n){var i=typeof e!="function"?e:{};return this.l=typeof e=="function"?e:n,Qg(this),hi(this,t,i),e0(this)}eb(t,e,n,i){var r=typeof n!="function"?n:{};return this.l=typeof n=="function"?n:i,Qg(this),Ai(this,t,r,e),e0(this)}Ra(){return this.u}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect");var e=new kn;wi(e,J_,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect"),n.v(e),Zn(t,n),Ml(this,t),this.outputConfidenceMasks&&(ht(t,"confidence_masks"),it(n,"CONFIDENCE_MASKS:confidence_masks"),io(this,"confidence_masks"),this.g.ha("confidence_masks",(i,r)=>{this.confidenceMasks=i.map(s=>oo(this,s,!0,!this.l)),ve(this,r)}),this.g.attachEmptyPacketListener("confidence_masks",i=>{this.confidenceMasks=[],ve(this,i)})),this.outputCategoryMask&&(ht(t,"category_mask"),it(n,"CATEGORY_MASK:category_mask"),io(this,"category_mask"),this.g.ga("category_mask",(i,r)=>{this.categoryMask=oo(this,i,!1,!this.l),ve(this,r)}),this.g.attachEmptyPacketListener("category_mask",i=>{this.categoryMask=void 0,ve(this,i)})),ht(t,"quality_scores"),it(n,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",(i,r)=>{this.qualityScores=i,ve(this,r)}),this.g.attachEmptyPacketListener("quality_scores",i=>{this.categoryMask=void 0,ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};Sn.prototype.getLabels=Sn.prototype.Ra,Sn.prototype.segmentForVideo=Sn.prototype.eb,Sn.prototype.segment=Sn.prototype.segment,Sn.prototype.setOptions=Sn.prototype.v,Sn.createFromModelPath=function(t,e){return ot(Sn,t,{baseOptions:{modelAssetPath:e}})},Sn.createFromModelBuffer=function(t,e){return ot(Sn,t,{baseOptions:{modelAssetBuffer:e}})},Sn.createFromOptions=function(t,e){return ot(Sn,t,e)};var yE={0:0,1:1,2:2,3:3};function Qu(){return mf()?void 0:document.createElement("canvas")}var En=class extends Qc{constructor(t,e){super(new dE(t,e)),this.u=new us,this.delegate="CPU",this.h=0,this.baseOptions=new Nt,this.B=this.l=0}C(){return"InteractiveSegmenter"}get i(){return this.g.i}v(t){return this.delegate=t.baseOptions?.delegate??"CPU",super.j(t)}fb(t){if(this.h===0)throw Error("Segmenter is not initialized.");var e;if(this.l!==0&&(this.i._free(this.l),this.l=0),!(e=typeof ImageData<"u"&&t instanceof ImageData))if(typeof t!="object"||t===null)e=!1;else{e=t.data;var n=t.width,i=t.height;e=Number.isInteger(n)&&n>0&&Number.isInteger(i)&&i>0&&(e instanceof Uint8ClampedArray||e instanceof Uint8Array)}if(e)e=t.width,n=t.height,t=t.data;else{if([e,n]=gf(t),typeof OffscreenCanvas<"u")i=new OffscreenCanvas(e,n);else{if(typeof document>"u")throw Error("Canvas is not supported in this environment.");i=document.createElement("canvas")}if(i.width=e,i.height=n,!(i=i.getContext("2d")))throw Error("Canvas 2D context is not supported in this environment.");i.drawImage(t,0,0),t=i.getImageData(0,0,e,n).data}if(!t)throw Error("Unsupported image source or failed to extract image pixels.");i=function({Wa:s,width:o,height:a}){if(o<=0||a<=0)throw Error(`Invalid image dimensions: ${o}x${a}. Dimensions must be positive.`);if(s%(o*a)!==0)throw Error(`Invalid image dimensions or pixel data length. Pixel data length ${s} is not a multiple of the number of pixels (${o*a}).`);if((s/=o*a)!==4&&s!==3&&s!==1)throw Error(`Invalid image dimensions or pixel data length. Calculated channels: ${s}. Expected 1, 3, or 4.`);return s}({Wa:t.length,width:e,height:n});var r=this.i._malloc(t.length);if(this.i.HEAPU8.set(t,r),this.l=r,!this.i._interactive_segmenter_set_image(this.h,r,e,n,i))throw Error("Failed to set image on native engine.")}segment(t){if(this.h===0)throw Error("Segmenter is not initialized.");var e=function(h){h=h.map(({isCompleted:u,brushMode:p,point:g})=>{p=yE[p]??0,g=g.map(({x:m,y:f})=>{var S=new $3;return qs(S,1,m),qs(S,2,f),S});var v=new q3;return ad(v,u),ra(v,1,Ki(p),0),od(v,2,g),v});var d=new Y3;return od(d,1,h),K3(d)}(t);t=this.i._malloc(e.length),this.i.HEAPU8.set(e,t);var n=this.i._malloc(12),i=n+4,r=n+8,s=0,o=this.B++;try{if(this.m)if(this.delegate==="GPU"){var a=this.m;++a.g.T,a.h.set(o,performance.now())}else{var c=this.m;++c.g.P,c.h.set(o,performance.now())}if((s=this.i._interactive_segmenter_segment(this.h,t,e.length,n,i,r))===0)throw Error("Segmentation failed.");this.m?.za(o);let h=this.i.HEAPU32[n/4],d=this.i.HEAPU32[i/4],u=new Float32Array(this.i.HEAPU8.buffer,s,this.i.HEAPU32[r/4]/4);var l=new Float32Array(u);if(a=h*d,(l instanceof Uint8Array||l instanceof Float32Array)&&l.length!==a)throw Error("Unsupported channel count: "+l.length/a);return new Yt([l],!0,!1,this.g.i.canvas??void 0,this.u,h,d)}finally{t!==0&&this.i._free(t),n!==0&&this.i._free(n),s!==0&&this.i._free(s)}}o(){this.h!==0&&(this.m?.xa(),this.i._interactive_segmenter_close(this.h),this.h=0),this.l!==0&&(this.i._free(this.l),this.l=0);var t=new Kc;if(this.delegate==="GPU"){var e=new sf;Mi(t,2,ns,e)}else bi(e=new b3,1,4),Mi(t,1,ns,e);if(De(this.baseOptions,0,3,t),t=N3(this.baseOptions),e=this.i._malloc(t.length),this.i.HEAPU8.set(t,e),this.h=this.i._interactive_segmenter_create(e,t.length),this.i._free(e),this.h===0)throw Error("Failed to create native InteractiveSegmenter engine.");this.m?.ya()}close(){this.h!==0&&(this.i._interactive_segmenter_close(this.h),this.h=0),this.l!==0&&(this.i._free(this.l),this.l=0),this.u.close(),super.close()}};En.prototype.close=En.prototype.close,En.prototype.segment=En.prototype.segment,En.prototype.setImage=En.prototype.fb,En.prototype.setOptions=En.prototype.v,En.createFromModelPath=function(t,e){return Dc(En,Qu(),t,{baseOptions:{modelAssetPath:e}})},En.createFromModelBuffer=function(t,e){return Dc(En,Qu(),t,{baseOptions:{modelAssetBuffer:e}})},En.createFromOptions=function(t,e){var n=e.canvas??Qu();return Dc(En,n,t,e)};var Ed=class{constructor(t,e,n){this.confidenceMasks=t,this.categoryMask=e,this.qualityScores=n}close(){this.confidenceMasks?.forEach(t=>{t.close()}),this.categoryMask?.close()}};Ed.prototype.close=Ed.prototype.close;var gi=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect_in",!1),this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new ff,this.u=new K_,De(this.h,0,3,this.u),De(t=this.h,0,1,e=new Nt)}C(){return"InteractiveSegmenterLegacy"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return"outputCategoryMask"in t&&(this.outputCategoryMask=t.outputCategoryMask??!1),"outputConfidenceMasks"in t&&(this.outputConfidenceMasks=t.outputConfidenceMasks??!0),super.j(t)}segment(t,e,n,i){var r=typeof n!="function"?n:{};if(this.l=typeof n=="function"?n:i,this.qualityScores=this.categoryMask=this.confidenceMasks=void 0,n=this.I+1,i=new j_,e.keypoint&&e.scribble)throw Error("Cannot provide both keypoint and scribble.");if(e.keypoint){var s=new Zu;ad(s,!0),qs(s,1,e.keypoint.x),qs(s,2,e.keypoint.y),Mi(i,1,fd,s)}else{if(!e.scribble)throw Error("Must provide either a keypoint or a scribble.");{let a=new Z3;for(s of e.scribble)ad(e=new Zu,!0),qs(e,1,s.x),qs(e,2,s.y),Jo(a,1,Zu,e);Mi(i,2,fd,a)}}this.g.addProtoToStream(i.g(),"mediapipe.tasks.vision.interactive_segmenter_legacy.proto.RegionOfInterest","roi_in",n),hi(this,t,r);e:{try{let a=new Ed(this.confidenceMasks,this.categoryMask,this.qualityScores);if(!this.l){var o=a;break e}this.l(a)}finally{bl(this)}o=void 0}return o}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"roi_in"),Ut(t,"norm_rect_in");var e=new kn;wi(e,J_,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.interactive_segmenter_legacy.InteractiveSegmenterGraphV2"),Dt(n,"IMAGE:image_in"),Dt(n,"ROI:roi_in"),Dt(n,"NORM_RECT:norm_rect_in"),n.v(e),Zn(t,n),Ml(this,t),this.outputConfidenceMasks&&(ht(t,"confidence_masks"),it(n,"CONFIDENCE_MASKS:confidence_masks"),io(this,"confidence_masks"),this.g.ha("confidence_masks",(i,r)=>{this.confidenceMasks=i.map(s=>oo(this,s,!0,!this.l)),ve(this,r)}),this.g.attachEmptyPacketListener("confidence_masks",i=>{this.confidenceMasks=[],ve(this,i)})),this.outputCategoryMask&&(ht(t,"category_mask"),it(n,"CATEGORY_MASK:category_mask"),io(this,"category_mask"),this.g.ga("category_mask",(i,r)=>{this.categoryMask=oo(this,i,!1,!this.l),ve(this,r)}),this.g.attachEmptyPacketListener("category_mask",i=>{this.categoryMask=void 0,ve(this,i)})),ht(t,"quality_scores"),it(n,"QUALITY_SCORES:quality_scores"),this.g.attachFloatVectorListener("quality_scores",(i,r)=>{this.qualityScores=i,ve(this,r)}),this.g.attachEmptyPacketListener("quality_scores",i=>{this.categoryMask=void 0,ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};gi.prototype.segment=gi.prototype.segment,gi.prototype.setOptions=gi.prototype.v,gi.createFromModelPath=function(t,e){return ot(gi,t,{baseOptions:{modelAssetPath:e}})},gi.createFromModelBuffer=function(t,e){return ot(gi,t,{baseOptions:{modelAssetBuffer:e}})},gi.createFromOptions=function(t,e){return ot(gi,t,e)};var $n=class extends On{constructor(t,e){super(new li(t,e),"input_frame_gpu","norm_rect",!1),this.l={detections:[]},De(t=this.h=new Q_,0,1,e=new Nt)}C(){return"ObjectDetector"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return t.displayNamesLocale!==void 0?ze(this.h,2,Yi(t.displayNamesLocale)):"displayNamesLocale"in t&&ze(this.h,2),t.maxResults!==void 0?bi(this.h,3,t.maxResults):"maxResults"in t&&ze(this.h,3),t.scoreThreshold!==void 0?Le(this.h,4,t.scoreThreshold):"scoreThreshold"in t&&ze(this.h,4),t.categoryAllowlist!==void 0?Vc(this.h,5,t.categoryAllowlist):"categoryAllowlist"in t&&ze(this.h,5),t.categoryDenylist!==void 0?Vc(this.h,6,t.categoryDenylist):"categoryDenylist"in t&&ze(this.h,6),this.j(t)}G(t,e){return this.l={detections:[]},hi(this,t,e),this.l}H(t,e,n){return this.l={detections:[]},Ai(this,t,n,e),this.l}o(){var t=new Bn;Ut(t,"input_frame_gpu"),Ut(t,"norm_rect"),ht(t,"detections");var e=new kn;wi(e,J3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.ObjectDetectorGraph"),Dt(n,"IMAGE:input_frame_gpu"),Dt(n,"NORM_RECT:norm_rect"),it(n,"DETECTIONS:detections"),n.v(e),Zn(t,n),this.g.attachProtoVectorListener("detections",(i,r)=>{for(let s of i)i=P_(s),this.l.detections.push(n1(i));ve(this,r)}),this.g.attachEmptyPacketListener("detections",i=>{ve(this,i)}),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};$n.prototype.detectForVideo=$n.prototype.H,$n.prototype.detect=$n.prototype.G,$n.prototype.setOptions=$n.prototype.v,$n.createFromModelPath=async function(t,e){return ot($n,t,{baseOptions:{modelAssetPath:e}})},$n.createFromModelBuffer=function(t,e){return ot($n,t,{baseOptions:{modelAssetBuffer:e}})},$n.createFromOptions=function(t,e){return ot($n,t,e)};var wd=class{constructor(t,e,n){this.landmarks=t,this.worldLandmarks=e,this.segmentationMasks=n}close(){this.segmentationMasks?.forEach(t=>{t.close()})}};function t0(t){t.landmarks=[],t.worldLandmarks=[],t.segmentationMasks=void 0}function n0(t){try{let e=new wd(t.landmarks,t.worldLandmarks,t.segmentationMasks);if(!t.u)return e;t.u(e)}finally{bl(t)}}wd.prototype.close=wd.prototype.close;var an=class extends On{constructor(t,e){super(new li(t,e),"image_in","norm_rect",!1),this.landmarks=[],this.worldLandmarks=[],this.outputSegmentationMasks=!1,De(t=this.h=new e1,0,1,e=new Nt),this.B=new X_,De(this.h,0,3,this.B),this.l=new W_,De(this.h,0,2,this.l),bi(this.l,4,1),Le(this.l,2,.5),Le(this.B,2,.5),Le(this.h,4,.5)}C(){return"PoseLandmarker"}get baseOptions(){return lt(this.h,Nt,1)}set baseOptions(t){De(this.h,0,1,t)}v(t){return"numPoses"in t&&bi(this.l,4,t.numPoses??1),"minPoseDetectionConfidence"in t&&Le(this.l,2,t.minPoseDetectionConfidence??.5),"minTrackingConfidence"in t&&Le(this.h,4,t.minTrackingConfidence??.5),"minPosePresenceConfidence"in t&&Le(this.B,2,t.minPosePresenceConfidence??.5),"outputSegmentationMasks"in t&&(this.outputSegmentationMasks=t.outputSegmentationMasks??!1),this.j(t)}G(t,e,n){var i=typeof e!="function"?e:{};return this.u=typeof e=="function"?e:n,t0(this),hi(this,t,i),n0(this)}H(t,e,n,i){var r=typeof n!="function"?n:{};return this.u=typeof n=="function"?n:i,t0(this),Ai(this,t,r,e),n0(this)}o(){var t=new Bn;Ut(t,"image_in"),Ut(t,"norm_rect"),ht(t,"normalized_landmarks"),ht(t,"world_landmarks"),ht(t,"segmentation_masks");var e=new kn;wi(e,j3,this.h);var n=new Tn;Fn(n,2,"mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"),Dt(n,"IMAGE:image_in"),Dt(n,"NORM_RECT:norm_rect"),it(n,"NORM_LANDMARKS:normalized_landmarks"),it(n,"WORLD_LANDMARKS:world_landmarks"),n.v(e),Zn(t,n),Ml(this,t),this.g.attachProtoVectorListener("normalized_landmarks",(i,r)=>{this.landmarks=[];for(let s of i)i=ha(s),this.landmarks.push(xl(i));ve(this,r)}),this.g.attachEmptyPacketListener("normalized_landmarks",i=>{this.landmarks=[],ve(this,i)}),this.g.attachProtoVectorListener("world_landmarks",(i,r)=>{this.worldLandmarks=[];for(let s of i)i=Ks(s),this.worldLandmarks.push(qo(i));ve(this,r)}),this.g.attachEmptyPacketListener("world_landmarks",i=>{this.worldLandmarks=[],ve(this,i)}),this.outputSegmentationMasks&&(it(n,"SEGMENTATION_MASK:segmentation_masks"),io(this,"segmentation_masks"),this.g.ha("segmentation_masks",(i,r)=>{this.segmentationMasks=i.map(s=>oo(this,s,!0,!this.u)),ve(this,r)}),this.g.attachEmptyPacketListener("segmentation_masks",i=>{this.segmentationMasks=[],ve(this,i)})),t=t.g(),this.setGraph(new Uint8Array(t),!0)}};an.prototype.detectForVideo=an.prototype.H,an.prototype.detect=an.prototype.G,an.prototype.setOptions=an.prototype.v,an.createFromModelPath=function(t,e){return ot(an,t,{baseOptions:{modelAssetPath:e}})},an.createFromModelBuffer=function(t,e){return ot(an,t,{baseOptions:{modelAssetBuffer:e}})},an.createFromOptions=function(t,e){return ot(an,t,e)},an.POSE_CONNECTIONS=y1,It("module$exports$google3$third_party$mediapipe$tasks$web$vision$pose_landmarker$pose_landmarker.PoseLandmarker.POSE_CONNECTIONS",an.POSE_CONNECTIONS);var xE="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm",x1="https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";async function ME(){let t=await Kr.forVisionTasks(xE);try{return await an.createFromOptions(t,{baseOptions:{modelAssetPath:x1,delegate:"GPU"},runningMode:"VIDEO",numPoses:1})}catch{return await an.createFromOptions(t,{baseOptions:{modelAssetPath:x1,delegate:"CPU"},runningMode:"VIDEO",numPoses:1})}}var go=null,Tl=0,wl=null;async function Al(){return Tl+=1,go||(wl||(wl=ME().then(t=>(go=t,wl=null,t))),wl)}function Rl(){Tl=Math.max(0,Tl-1),Tl===0&&go&&(go.close(),go=null)}var bE={pants:0,shorts:0,skirt:0,shoes:0,dress:1,top:2,jacket:3,bag:4,necklace:4,cap:5,glasses:6};var SE={glasses:{lens_left:5,lens_right:2,bridge:0,temple_left:8,temple_right:7},cap:{side_left:8,side_right:7,brim_front:0},shoes:{toe_left:32,heel_left:30,toe_right:31,heel_right:29},necklace:{clasp_left:12,clasp_right:11},bag:{side_left:12,side_right:11}},EE={cap:{anchor:"brim_front",lm:[2,5],offsetY:-.3},glasses:{anchor:"bridge",lm:[2,5],offsetY:-.1},necklace:{anchor:"pendant",lm:[11,12],offsetY:.45},bag:{anchor:"handle_top",lm:[11,12],offsetY:.15}},wE=["shoulder_left","shoulder_right","hem_left","hem_right"],da=(t,e,n,i,r)=>({kind:"rigid",position:t,angle:e,width:n,offset:i,widthFactor:r}),_o=(t,e,n,i)=>({kind:"quad",quad:[t,e,n,i],position:[t,e],angle:[t,e],width:[t,e],offset:{x:0,y:0},widthFactor:1}),TE={top:_o(12,11,24,23),jacket:_o(12,11,24,23),dress:_o(12,11,26,25),pants:_o(24,23,26,25),shorts:_o(24,23,26,25),skirt:_o(24,23,26,25),cap:da([0],[7,8],[7,8],{x:0,y:-.1},1.6),glasses:da([0],[2,5],[2,5],{x:0,y:-.02},1.5),necklace:da([11,12],[11,12],[11,12],{x:0,y:.07},.7),bag:da([11,12],[11,12],[11,12],{x:0,y:.15},.6),shoes:da([27,28],[27,28],[27,28],{x:0,y:.05},1.4)};async function AE(t){try{let e=await new vc().loadAsync(t);return e.colorSpace=_n,e}catch(e){return console.error("[tryon] garment texture failed to load:",t,e),null}}function Cl(t,e,n){return new O(t.x*e,t.y*n,0)}function Af(t,e){return t.distanceTo(e)}function RE(t,e){let n=0,i=0;for(let r of e){let s=t[r];s&&(i+=1,n+=s.visibility??1)}return i>0?n/i:0}function CE(t){return Math.max(0,Math.min(1,t))}function S1(t,e,n,i){let r=new O,s=0;for(let o of e){let a=t[o];a&&(r.add(Cl(a,n,i)),s+=1)}return s>0?r.multiplyScalar(1/s):null}function IE(t,e,n){return new O(t.x*e,t.y*n,0)}function PE(t,e){let n=(t[0].y+t[1].y)/2,i=Af(t[0],t[1]),r=(e[0].y+e[1].y)/2,s=Af(e[0],e[1]);if(r>n+i*.5&&s>i*.35)return e;let a=new O(0,i*1.35,0);return[t[0].clone().add(a),t[1].clone().add(a)]}function LE(t,e,n,i,r,s){let o=n,a=[];for(let T of e){let R=t[T.lm];R&&a.push({g:new O(T.g.x*o,T.g.y*o,0),b:Cl(R,n,i)})}if(a.length<2)return null;let c=a[0],l=a[0],h=-1;for(let T=0;T<a.length;T++)for(let R=T+1;R<a.length;R++){let L=a[T].g.distanceTo(a[R].g);L>h&&(h=L,c=a[T],l=a[R])}let d=c.b.distanceTo(l.b)/Math.max(c.g.distanceTo(l.g),1e-6),u=Math.atan2(l.b.y-c.b.y,l.b.x-c.b.x)-Math.atan2(l.g.y-c.g.y,l.g.x-c.g.x),p=Math.cos(u),g=Math.sin(u),v=new O,m=new O;for(let T of a)v.add(T.g),m.add(T.b);v.multiplyScalar(1/a.length),m.multiplyScalar(1/a.length);let f=c.b.distanceTo(l.b),S=m,w=v;if(s){let T=S1(t,s.lm,n,i);T&&(T.y+=s.offsetY*f,S=T,w=new O(s.g.x*o,s.g.y*o,0))}let M=o*r;return[new O(0,0,0),new O(o,0,0),new O(0,M,0),new O(o,M,0)].map(T=>{let R=(T.x-w.x)*d,L=(T.y-w.y)*d;return new O(S.x+(R*p-L*g),S.y+(R*g+L*p),0)})}var DE=.35,M1=.2,UE=.15,b1=6;function NE(t){let e=TE[t.slot],n=t.rig?.anchor_points;if(!n||n.version!==2)return e;let i=n.anchors??{};if(e.kind==="quad"){let o=c=>{let l=i[c];return l?{u:l.x,v:1-l.y}:null},a=wE.map(c=>o(c));return a.every(Boolean)?{...e,uvCorners:a}:e}let r=SE[t.slot];if(!r)return e;let s=Object.entries(r).filter(([o])=>!!i[o]).map(([o,a])=>({g:i[o],lm:a}));if(s.length>=2){let o=EE[t.slot],a=o?i[o.anchor]:void 0;return{...e,pairs:s,pin:o&&a?{g:a,lm:o.lm,offsetY:o.offsetY}:void 0}}return e}async function E1(t,e,n,i){let r=await AE(t.textureUrl);if(!r)return null;let s=r.image,o=s?s.height/s.width:1,a=new Bs({map:r,transparent:!0,side:ni,depthTest:!1}),c=new Vs(1,1,b1,b1),l=new Ln(c,a);l.renderOrder=bE[t.slot]??3.5,e.add(l);let h=NE(t),d=c.getAttribute("position"),u=c.getAttribute("uv"),p=d.count,g=new Float32Array(p),v=new Float32Array(p);for(let N=0;N<p;N++)g[N]=u.getX(N),v[N]=u.getY(N);if(h.uvCorners){let[N,T,R,L]=h.uvCorners;for(let b=0;b<p;b++){let y=u.getX(b),A=1-u.getY(b),G=N.u+(T.u-N.u)*y,F=N.v+(T.v-N.v)*y,z=R.u+(L.u-R.u)*y,Y=R.v+(L.v-R.v)*y;u.setXY(b,G+(z-G)*A,F+(Y-F)*A)}u.needsUpdate=!0}let m=1;function f(N){if(!N){l.visible=!1;return}let T=n,R=i,L=null;if(h.kind==="rigid"&&h.pairs)L=LE(N,h.pairs,T,R,o,h.pin);else if(h.kind==="quad"){let[y,A,G,F]=h.quad,z=ee=>N[ee]?Cl(N[ee],T,R):null,Y=[z(y),z(A)],H=[z(G),z(F)];Y.every(Boolean)&&H.every(Boolean)&&(L=[Y[0],Y[1],...PE(Y,H)])}else{let y=S1(N,h.position,T,R),A=h.width.map(G=>Cl(N[G],T,R));if(y&&A.every(Boolean)){let G=Af(A[0],A[1])/2,F=A[1].clone().sub(A[0]).normalize(),z=y.clone().add(IE(h.offset,T,R)),Y=new O(0,G*2*o,0);L=[z.clone().sub(F.clone().multiplyScalar(G)),z.clone().add(F.clone().multiplyScalar(G)),z.clone().sub(F.clone().multiplyScalar(G)).add(Y),z.clone().add(F.clone().multiplyScalar(G)).add(Y)]}}let b=CE((RE(N,w())-M1)/(DE-M1));m+=(b-m)*UE,a.opacity=m,l.visible=L!==null&&m>.02,L&&S(L)}function S(N){let[T,R,L,b]=N;for(let y=0;y<p;y++){let A=g[y],F=1-v[y],z=T.clone().lerp(R,A),Y=L.clone().lerp(b,A),H=z.lerp(Y,F);d.setXYZ(y,H.x,H.y,0)}d.needsUpdate=!0,c.computeBoundingSphere()}function w(){return h.kind==="quad"?h.quad:[...h.position,...h.width]}function M(){e.remove(l),c.dispose(),a.map?.dispose(),a.dispose()}return{slot:t.slot,update:f,dispose:M}}var FE=45,OE=2e3;async function w1(t){let{video:e,canvas:n}=t;if(!e.videoWidth)throw new Error("Engine needs live video dimensions");let i=e.videoWidth,r=e.videoHeight,s=new mc({canvas:n,alpha:!0,antialias:!0,preserveDrawingBuffer:!0});s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.setSize(i,r,!1);let o=new gc,a=new No(0,i,0,r,-1e3,1e3),c=await Al(),l=new Map,h=new Map,d=0;async function u(A){let G=++d,F=new Map(A.map(z=>[z.slot,z]));for(let[z,Y]of l){let H=F.get(z);(!H||H.textureUrl!==h.get(z))&&(Y.dispose(),l.delete(z),h.delete(z))}for(let[z,Y]of F){if(l.has(z))continue;let H=await E1(Y,o,i,r);if(G!==d){H?.dispose();return}H&&(l.set(z,H),h.set(z,Y.textureUrl))}}u(t.layers);let p=0,g=!0,v=!1,m=0,f=-1,S=null,w=0,M=1,N=16,T=performance.now();function R(){if(e.readyState<2)return S;let A=performance.now();if(A<=f)return S;f=A;try{S=c.detectForVideo(e,A).landmarks?.[0]??null}catch{}return S}function L(){p=requestAnimationFrame(L);let A=performance.now();w+=1;let G=S;w%M===0&&(G=R());for(let F of l.values())F.update(G);s.render(o,a),!v&&(G||++m>90)&&(v=!0,t.onReady?.()),N=N*.9+(performance.now()-A)*.1,performance.now()-T>OE&&N>FE&&(T=performance.now(),s.getPixelRatio()>.75?s.setPixelRatio(.75):M=2)}function b(){p||g||(p=requestAnimationFrame(L))}function y(){p&&(cancelAnimationFrame(p),p=0)}return{async setLayers(A){await u(A)},setPaused(A){g=A,g?y():b()},destroy(){g=!0,y();for(let A of l.values())A.dispose();l.clear(),h.clear(),Rl(),s.dispose()}}}var kE=1e3,BE=3;async function T1(t,e){let n=await Al(),i=!1,r=0,s=-1,o=!1,a=()=>{if(!(o||!n||t.readyState<2))try{let l=performance.now();if(l<=s)return;s=l,n.detectForVideo(t,l).landmarks.length>0?(r=0,i||(i=!0,e.onPresent())):i&&(r+=1,r>=BE&&(i=!1,e.onAbsent()))}catch{}},c=window.setInterval(a,kE);return{stop:()=>{o=!0,window.clearInterval(c),Rl()}}}async function A1(t,e,n){let i=await fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:[{id:Number(t),quantity:e,...n?{properties:{_mirrly_tryon_session:n}}:{}}]})});if(!i.ok)throw new Error(`cart add failed: ${i.status}`);window.dispatchEvent(new CustomEvent("mirrly:cart-added",{detail:{variantId:t}}))}var zE=0,pA=Array.isArray;function P(t,e,n,i,r,s){e||(e={});var o,a,c=e;if("ref"in c)for(a in c={},e)a=="ref"?o=e[a]:c[a]=e[a];var l={type:t,props:c,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--zE,__i:-1,__u:0,__source:r,__self:s};if(typeof t=="function"&&(o=t.defaultProps))for(a in o)c[a]===void 0&&(c[a]=o[a]);return gt.vnode&&gt.vnode(l),l}function ui(t){return{width:t.size??20,height:t.size??20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":1.8,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":!0,class:t.class}}var Il=t=>P("svg",{...ui(t),children:[P("path",{d:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"}),P("circle",{cx:"12",cy:"13",r:"4"})]}),R1=t=>P("svg",{...ui(t),children:P("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})}),C1=t=>P("svg",{...ui(t),children:P("path",{d:"M13 2 3 14h9l-1 8 10-12h-9l1-8z"})});var I1=t=>P("svg",{...ui(t),children:[P("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),P("circle",{cx:"12",cy:"7",r:"4"})]});var Cr=t=>P("svg",{...ui(t),children:P("path",{d:"M20 6 9 17l-5-5"})}),P1=t=>P("svg",{...ui(t),children:P("path",{d:"M18 6 6 18M6 6l12 12"})}),L1=t=>P("svg",{...ui(t),children:P("path",{d:"M19 12H5m7-7-7 7 7 7"})}),fa=t=>P("svg",{...ui(t),children:[P("path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"}),P("path",{d:"M3 6h18"}),P("path",{d:"M16 10a4 4 0 0 1-8 0"})]});var Rf=t=>P("svg",{...ui(t),children:[P("circle",{cx:"12",cy:"12",r:"10"}),P("path",{d:"M12 8h.01M12 12v4"})]}),D1=t=>P("svg",{...ui(t),children:[P("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),P("polyline",{points:"7 10 12 15 17 10"}),P("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),U1=t=>P("svg",{...ui(t),children:[P("rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}),P("polyline",{points:"22,6 12,13 2,6"})]}),N1=t=>P("svg",{viewBox:"0 0 200 320",fill:"none",stroke:"rgba(255,255,255,0.85)","stroke-width":"2.5","stroke-dasharray":"7 8","stroke-linecap":"round","aria-hidden":"true",class:t.class,children:[P("circle",{cx:"100",cy:"62",r:"38"}),P("path",{d:"M100 100c-40 0-64 26-70 62l-8 58c-.8 6 3 10 8 10h14l6 78c.5 6 4 10 9 10h82c5 0 8.5-4 9-10l6-78h14c5 0 8.8-4 8-10l-8-58c-6-36-30-62-70-62z"})]});function VE(t,e){if(t===null)return null;let n=Number(t);if(Number.isNaN(n))return t;let i=n.toFixed(2);return e&&e.includes("{{}}")?e.replace("{{}}",i):e&&e.includes("{{amount}}")?e.replace(/\{\{amount\}\}/g,i):i}function O1(t,e){return e?VE(t,e.money_format):null}function If(t){return P("button",{type:"button",class:`tryon-iconbtn ${t.class??""}`,"aria-label":t.label,title:t.label,onClick:t.onClick,children:t.children})}function k1(t){return P(If,{label:"Close try-on",onClick:t.onClick,class:"tryon-close",children:P(P1,{size:18})})}function pa(t){let{product:e,compact:n}=t;if(!e)return null;let i=O1(e.price,e);return P("div",{class:`tryon-product ${n?"tryon-product--compact":""}`,children:[e.image&&P("img",{class:"tryon-product__img",src:e.image,alt:"",loading:"lazy"}),P("div",{class:"tryon-product__meta",children:[P("span",{class:"tryon-product__title",children:e.title}),e.variant_title&&P("span",{class:"tryon-product__variant",children:e.variant_title}),i&&P("span",{class:"tryon-product__price",children:i})]})]})}function B1(t){return P("div",{class:`tryon-pill tryon-pill--${t.tone}`,role:"status",children:[t.tone==="success"&&P(Cr,{size:15}),t.tone==="neutral"&&P(I1,{size:15}),t.tone==="loading"&&P("span",{class:"tryon-pill__spinner","aria-hidden":"true"}),P("span",{children:t.text})]})}var Cf=26,F1=2*Math.PI*Cf;function Pf(t){let e=t.size??64,n=t.total>0?t.remaining/t.total:0;return P("div",{class:"tryon-ring",style:{width:`${e}px`,height:`${e}px`},role:"timer","aria-label":`Preparing your look, ${t.remaining} seconds remaining`,children:[P("svg",{width:e,height:e,viewBox:"0 0 64 64","aria-hidden":"true",children:[P("circle",{class:"tryon-ring__track",cx:"32",cy:"32",r:Cf}),P("circle",{class:"tryon-ring__progress",cx:"32",cy:"32",r:Cf,"stroke-dasharray":F1,"stroke-dashoffset":F1*(1-n)})]}),P("span",{class:"tryon-ring__num",children:t.remaining})]})}function z1(t){let{product:e}=t,n=O1(e?.price??null,e);return P("div",{class:"tryon-glassbar",children:[e?.image&&P("img",{class:"tryon-glassbar__img",src:e.image,alt:"",loading:"lazy"}),P("div",{class:"tryon-glassbar__meta",children:[P("span",{class:"tryon-glassbar__title",children:e?.title}),n&&P("span",{class:"tryon-glassbar__price",children:n})]}),P("button",{type:"button",class:"tryon-btn tryon-btn--accent tryon-glassbar__cta",onClick:t.onAddToCart,disabled:t.adding,children:[P(fa,{size:17}),P("span",{children:t.adding?"Adding\u2026":"Add to cart"})]})]})}function V1(t){return P("button",{type:"button",class:"tryon-btn tryon-btn--accent",onClick:t.onClick,children:[P(Il,{size:18}),P("span",{children:"Start try-on"})]})}var H1=[{icon:Il,title:"Quick and easy",copy:"Just allow camera access"},{icon:R1,title:"Your privacy matters",copy:"Nothing is saved or shared"},{icon:C1,title:"Takes seconds",copy:"See realistic results instantly"}];function G1(t){let{product:e}=t,n=t.showRecordOption?H1.map(i=>i.title==="Your privacy matters"?{...i,copy:"Saved only if you choose to record"}:i):H1;return P("div",{class:"tryon-intro",children:[P("div",{class:"tryon-intro__content",children:[P("span",{class:"tryon-brand",children:["Powered by ",P("b",{children:"Mirrly"})]}),P(pa,{product:e}),P("h2",{class:"tryon-headline",id:"tryon-title",children:"See it on you, live"}),P("p",{class:"tryon-body",children:"Use your camera to try this on in real time with AI. No downloads, no hassle."}),P("ul",{class:"tryon-benefits",children:n.map(({icon:i,title:r,copy:s})=>P("li",{class:"tryon-benefit",children:[P("span",{class:"tryon-benefit__icon",children:P(i,{size:17})}),P("span",{class:"tryon-benefit__text",children:[P("strong",{children:r}),P("span",{children:s})]})]}))}),t.showRecordOption&&P("label",{class:"tryon-record",children:[P("input",{type:"checkbox",class:"tryon-record__input",checked:t.recordOptIn??!1,onChange:i=>t.onRecordChange?.(i.target.checked)}),P("span",{class:"tryon-record__box","aria-hidden":"true",children:P(Cr,{size:12})}),P("span",{class:"tryon-record__text",children:"Record my try-on session"})]}),P("div",{class:"tryon-intro__actions",children:[P(V1,{onClick:t.onStart}),P("button",{type:"button",class:"tryon-btn-text",onClick:t.onCancel,children:"Cancel"})]})]}),e?.image&&P("div",{class:"tryon-intro__visual",children:P("img",{src:e.image,alt:e.title,loading:"lazy"})})]})}var HE={camera_denied:{title:"Camera access is blocked",copy:"Allow camera access in your browser settings, then try again."},camera_unsupported:{title:"Live camera isn't supported here",copy:"Open this product in Safari or Chrome to use live try-on."},session_failed:{title:"We couldn't complete this try-on",copy:"Something went wrong on our side. Please try again in a moment."},login_required:{title:"Log in to try it on",copy:"This store offers live try-on to signed-in customers only. Log in and come back to start your try-on."},try_limit_reached:{title:"You've reached the try-on limit",copy:"You've used all your try-ons for this product. Pick another product and try it on there."},billing_failed:{title:"Try-on is unavailable right now",copy:"We couldn't start your session. Please try again in a few minutes."}};function W1(t){let e=HE[t.kind],n=t.kind==="camera_unsupported",i=t.kind==="camera_unsupported"||t.kind==="login_required"||t.kind==="try_limit_reached";return P("div",{class:"tryon-error-screen",children:[P("h2",{class:"tryon-headline",id:"tryon-title",children:e.title}),P("p",{class:"tryon-body",children:e.copy}),P("div",{class:"tryon-result__actions",children:[!i&&P("button",{type:"button",class:"tryon-btn tryon-btn--accent",onClick:t.onRetry,children:"Try again"}),P("button",{type:"button",class:"tryon-btn tryon-btn--outline",onClick:t.onClose,children:n||i?"Close":"Cancel"})]})]})}var GE=8;function X1({configToken:t,productId:e,variantId:n,customerId:i,product:r,blocked:s,recording:o=!1,adminTest:a=!1,countdownSeconds:c=GE,onClose:l}){let[h,d]=Vn("idle"),[u,p]=Vn(s??null),[g,v]=Vn(0),[m,f]=Vn(null),[S,w]=Vn(!1),[M,N]=Vn(!1),[T,R]=Vn(!1),L=Et(!1),b=Et(null),[y,A]=Vn(null),G=Et(null),F=Et(null),[z,Y]=Vn(""),[H,ee]=Vn("idle"),[X,se]=Vn(""),ge=Q=>{L.current=Q,R(Q)},Ce=Et(null),$e=Et(document.activeElement),et=Et(null),q=Et(null),j=Et(null),le=Et(null),re=Et(null),Me=Et(null),Fe=Et(n),Ve=Et(!1),vt=Et(null),qe=Et([]),bt=Et(null),I=Et(!0),Ft=Et(!1),Ye=Et(!1),Ke=Et(0),Pe=Et(null),ut=Et(!1),Ae=Et(null),E=Et(30);Hl(()=>{let Q=Ce.current,ye=$e.current,je=document.body.style.overflow;document.body.style.overflow="hidden";let Tt=Ot=>{if(Ot.key==="Escape"){Ot.stopPropagation(),Ze();return}if(Ot.key!=="Tab"||!Q)return;let An=Q.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(An.length===0)return;let Ri=An[0],rn=An[An.length-1];Ot.shiftKey&&document.activeElement===Ri?(Ot.preventDefault(),rn.focus()):!Ot.shiftKey&&document.activeElement===rn&&(Ot.preventDefault(),Ri.focus())};return document.addEventListener("keydown",Tt,!0),()=>{I.current=!1,document.removeEventListener("keydown",Tt,!0),document.body.style.overflow=je,ye?.focus?.(),Z()}},[]),Hl(()=>{if(h!=="streaming"){v(0);return}v(c);let Q=window.setInterval(()=>{v(ye=>ye<=1?(window.clearInterval(Q),0):ye-1)},1e3);return()=>window.clearInterval(Q)},[h]);async function _(){if(I.current){p(null),b.current=null,A(null),G.current=null,Y(""),ee("idle"),se(""),F.current&&(URL.revokeObjectURL(F.current),F.current=null),le.current?.destroy(),le.current=null,re.current?.stop(),re.current=null,j.current?.getTracks().forEach(Q=>Q.stop()),j.current=null,Ft.current=!1,d("requesting_camera");try{if(!navigator.mediaDevices?.getUserMedia){d("idle"),p("camera_unsupported");return}let Q=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:!1});if(!I.current){Q.getTracks().forEach(ye=>ye.stop());return}j.current=Q,et.current&&(et.current.srcObject=Q),d("detecting");try{re.current=await T1(et.current,{onPresent:K,onAbsent:J})}catch{Ft.current=!0,$()}}catch(Q){d("idle"),p(ue(Q))}}}function k(){re.current?.stop(),re.current=null,j.current?.getTracks().forEach(Q=>Q.stop()),j.current=null,Ft.current=!1,d("idle")}function K(){Ft.current=!0;let Q=le.current;Q?(Q.setPaused(!1),Se()):(console.log("[tryon] person present \u2014 starting engine"),$())}function J(){console.log("[tryon] person absent \u2014 pausing engine"),Ft.current=!1;let Q=le.current;Q&&(Q.setPaused(!0),me(),fe(),d("waiting_person"))}async function $(){if(!(!I.current||Ye.current||le.current)){Ye.current=!0,d("connecting");try{let Q=await lp(t,e,Fe.current,i,Me.current??void 0);if(!I.current)return;Me.current=Q.session_token,E.current=Q.max_duration_seconds,Ve.current=L.current&&!!Q.recording;let ye=[],je=Q.rig?.asset_url??Q.reference_image_url;je&&ye.push({slot:Q.rig?.template_type??"top",textureUrl:je,rig:Q.rig??null});let Tt=await w1({video:et.current,canvas:q.current,layers:ye,onReady:Se,onError:Ot=>W(Ot.message)});if(!I.current){Tt.destroy();return}le.current=Tt,Tt.setPaused(!Ft.current),Ft.current||J()}catch(Q){W(Q?.message,Q?.errorCode)}finally{Ye.current=!1}}}function Se(){if(!(!I.current||Pe.current!==null)){if(!Ft.current){J();return}Pe.current=Date.now(),d("streaming"),Me.current&&Ca(Me.current,"tryon_started"),te(q.current),he(E.current)}}function he(Q){Ae.current=window.setTimeout(()=>{I.current&&_e()},Q*1e3)}function me(){Ae.current&&(window.clearTimeout(Ae.current),Ae.current=null),Pe.current!==null&&(Ke.current+=Date.now()-Pe.current,Pe.current=null)}function Je(){try{let Q=et.current,ye=q.current;if(!Q||!Q.videoWidth)return null;let je=document.createElement("canvas");je.width=Q.videoWidth,je.height=Q.videoHeight;let Tt=je.getContext("2d");return Tt?(Tt.translate(je.width,0),Tt.scale(-1,1),Tt.drawImage(Q,0,0,je.width,je.height),ye&&Tt.drawImage(ye,0,0,je.width,je.height),je.toDataURL("image/jpeg",.85)):null}catch{return null}}function te(Q){if(!(!Ve.current||vt.current)&&!(typeof MediaRecorder>"u"))try{b.current=null,A(null);let ye=document.createElement("canvas");ye.width=640,ye.height=480;let je=ye.getContext("2d");if(!je)return;let Tt=()=>{let rn=et.current;!rn||!rn.videoWidth||((ye.width!==rn.videoWidth||ye.height!==rn.videoHeight)&&(ye.width=rn.videoWidth,ye.height=rn.videoHeight),je.save(),je.translate(ye.width,0),je.scale(-1,1),je.drawImage(rn,0,0,ye.width,ye.height),Q&&je.drawImage(Q,0,0,ye.width,ye.height),je.restore())};Tt();let Ot=window.setInterval(Tt,40),An=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm","video/mp4"].find(rn=>MediaRecorder.isTypeSupported(rn)),Ri=new MediaRecorder(ye.captureStream(30),An?{mimeType:An}:void 0);qe.current=[],Ri.ondataavailable=rn=>{rn.data.size>0&&qe.current.push(rn.data)},Ri.start(1e3),vt.current=Ri,bt.current=Ot}catch(ye){console.warn("[tryon] recording could not start",ye)}}function fe(Q){bt.current!==null&&(window.clearInterval(bt.current),bt.current=null);let ye=vt.current;if(vt.current=null,!ye)return;let je=Me.current;ye.onstop=()=>{let Tt=new Blob(qe.current,{type:ye.mimeType||"video/webm"});qe.current=[],b.current=Tt,A(Tt);let Ot=je&&Tt.size>0?hp(i,je,Tt,Q??null):null;G.current=Ot,Ot?.catch(An=>console.warn("[tryon] recording upload failed",An))};try{ye.state!=="inactive"&&ye.stop()}catch(Tt){console.warn("[tryon] recording stop failed",Tt)}}function Ue(){let Q=b.current;if(!Q)return;F.current&&URL.revokeObjectURL(F.current);let ye=URL.createObjectURL(Q);F.current=ye;let je=document.createElement("a");je.href=ye,je.download=`mirrly-try-on.${Q.type.includes("mp4")?"mp4":"webm"}`,document.body.appendChild(je),je.click(),je.remove()}async function Ne(){let Q=z.trim();if(!(!Q||!Me.current||H==="sending")){ee("sending"),se("");try{await G.current}catch{}try{await up(i,Me.current,Q),ee("sent")}catch(ye){ee("error"),se(ye?.message||"Could not send the email")}}}function _e(){if(ut.current)return;ut.current=!0,me();let Q=Je();f(ye=>ye??Q),le.current&&(le.current.destroy(),le.current=null),Me.current&&Ke.current>0&&Ca(Me.current,"tryon_completed",{duration_seconds:Math.round(Ke.current/1e3)}),Ve.current&&Q&&Me.current?fetch(Q).then(ye=>ye.blob()).then(ye=>fe(ye)).catch(()=>fe()):fe(),d("ended")}function Ze(){_e(),l()}async function ke(){w(!0);try{await A1(Fe.current,1,Me.current);let Q;try{Q=(await fetch("/cart.js").then(je=>je.json())).token}catch{}Me.current&&Ca(Me.current,"added_to_cart",{...Q?{cart_token:Q}:{}}),ut.current=!0,me(),fe(),f(ye=>ye??Je()),le.current&&(le.current.destroy(),le.current=null),N(!0),d("ended")}catch{p("session_failed")}finally{w(!1)}}function yt(){return!!j.current?.getVideoTracks().some(Q=>Q.readyState==="live")}function C(){if(N(!1),f(null),ut.current=!1,p(null),h==="ended"||!yt()){_();return}if(!re.current){$();return}d("detecting"),Ft.current&&$()}function ce(){if(u==="session_failed"){p(null),j.current?C():_();return}_()}function W(Q,ye){le.current=null,me(),d("idle"),p(ye==="login_required"||ye==="try_limit_reached"||ye==="billing_failed"?ye:"session_failed")}function Z(){I.current=!1,re.current?.stop(),re.current=null,Ae.current&&window.clearTimeout(Ae.current),fe(),le.current?.destroy(),le.current=null,j.current?.getTracks().forEach(Q=>Q.stop()),F.current&&(URL.revokeObjectURL(F.current),F.current=null)}function ue(Q){return Q?.name==="NotAllowedError"||Q?.name==="SecurityError"||Q?.name==="NotFoundError"?"camera_denied":"camera_unsupported"}let oe=h==="requesting_camera"||h==="detecting"||h==="connecting"||h==="waiting_person",Be=oe||h==="streaming",Pt=h==="streaming",Jt=h==="requesting_camera"?{tone:"loading",text:"Requesting camera access\u2026"}:h==="connecting"?{tone:"success",text:"You're ready"}:{tone:"neutral",text:"Position yourself in frame"};return P("div",{ref:Ce,class:"tryon-overlay",role:"dialog","aria-modal":"true","aria-labelledby":"tryon-title","data-step":h==="idle"?"intro":h==="streaming"?"streaming":h==="ended"?"result":"camera",children:P("div",{class:"tryon-panel",children:[P("div",{class:"tryon-topbar",children:[oe&&h!=="requesting_camera"&&P(If,{label:"Back",onClick:k,class:"tryon-topbar__back",children:P(L1,{size:18})}),P(k1,{onClick:Ze})]}),u?P(W1,{kind:u,onRetry:ce,onClose:l}):h==="idle"?P(G1,{product:r,showRecordOption:o,recordOptIn:T,onRecordChange:ge,onStart:_,onCancel:l}):P("div",{class:"tryon-split",children:[P("aside",{class:"tryon-side",children:[P("span",{class:"tryon-brand",children:["Powered by ",P("b",{children:"Mirrly"})]}),oe&&P(jn,{children:[P(pa,{product:r,compact:!0}),P("h2",{class:"tryon-headline tryon-camera-headline",id:"tryon-title",children:"Position yourself in frame"}),P("p",{class:"tryon-body",children:"Make sure your whole upper body is visible for the best results."}),P("ul",{class:"tryon-tips",children:[P("li",{children:[P("span",{class:"tryon-tips__icon",children:P(Rf,{size:16})}),"Good lighting"]}),P("li",{children:[P("span",{class:"tryon-tips__icon",children:P(Cr,{size:16})}),"Stand facing the camera"]}),P("li",{children:[P("span",{class:"tryon-tips__icon",children:P(Cr,{size:16})}),"Keep your upper body visible"]})]})]}),h==="streaming"&&P(jn,{children:[P(pa,{product:r,compact:!0}),P("h2",{class:"tryon-headline",id:"tryon-title",children:"Try-on in progress\u2026"}),P("p",{class:"tryon-body",children:"Try-on is running live in your browser. Keep moving \u2014 the garment follows you."}),g>0&&P("div",{class:"tryon-preparing",children:[P(Pf,{remaining:g,total:c,size:88}),P("span",{class:"tryon-preparing__label",children:"Preparing your look\u2026"})]})]})]}),P("div",{class:"tryon-media",children:[P("video",{class:"tryon-video tryon-video--local",style:{display:Be?"":"none"},autoPlay:!0,playsInline:!0,muted:!0,ref:Q=>{et.current=Q,Q&&j.current&&(Q.srcObject=j.current)}}),P("canvas",{class:"tryon-canvas",style:{display:Pt?"":"none"},ref:Q=>{q.current=Q}}),h==="ended"&&m&&P("img",{class:"tryon-snapshot",src:m,alt:"Your try-on result"}),oe&&P(jn,{children:[P(N1,{class:"tryon-silhouette"}),P("div",{class:"tryon-pill-anchor",children:P(B1,{tone:Jt.tone,text:Jt.text})}),(h==="detecting"||h==="waiting_person")&&P("div",{class:"tryon-guidance",children:[P(Rf,{size:16}),P("span",{children:"Make sure your whole upper body is visible"})]})]}),h==="streaming"&&P(jn,{children:[P("span",{class:"tryon-live","aria-hidden":"true",children:"LIVE"}),g>0&&P("div",{class:"tryon-preparing tryon-preparing--overlay",children:P(Pf,{remaining:g,total:c,size:52})}),a?null:P(z1,{product:r,onAddToCart:ke,adding:S})]}),h==="ended"&&P("div",{class:"tryon-result",children:[P("span",{class:"tryon-result__check",children:P(Cr,{size:26})}),P("h2",{class:"tryon-headline",id:"tryon-title",children:M?"Added to your cart.":"How did that look?"}),P("p",{class:"tryon-body",children:a?"This is an admin test \u2014 try it as many times as you need.":M?"Ready for checkout whenever you are.":"Add it to your cart or try again with a different look."}),P("div",{class:"tryon-result__actions",children:[M?P("button",{type:"button",class:"tryon-btn tryon-btn--accent",onClick:Ze,children:[P(fa,{size:17}),P("span",{children:"Done"})]}):a?P("button",{type:"button",class:"tryon-btn tryon-btn--accent",onClick:C,children:P("span",{children:"Try again"})}):P("button",{type:"button",class:"tryon-btn tryon-btn--accent",onClick:ke,disabled:S,children:[P(fa,{size:17}),P("span",{children:S?"Adding\u2026":"Add to cart"})]}),a?null:P("button",{type:"button",class:"tryon-btn tryon-btn--outline",onClick:C,children:"Try again"})]}),y&&P("div",{class:"tryon-share",children:[P("button",{type:"button",class:"tryon-btn tryon-btn--outline tryon-share__download",onClick:Ue,children:[P(D1,{size:16}),P("span",{children:"Download video"})]}),P("div",{class:"tryon-share__email",children:[P(U1,{size:16}),P("input",{type:"email",class:"tryon-share__input",placeholder:"Email me this video",value:z,disabled:H==="sent",onInput:Q=>Y(Q.target.value),onKeyDown:Q=>{Q.key==="Enter"&&Ne()}}),P("button",{type:"button",class:"tryon-share__send",onClick:()=>void Ne(),disabled:H==="sending"||H==="sent"||!z.trim(),children:P("span",{children:H==="sending"?"Sending\u2026":H==="sent"?"Sent":"Send"})})]}),H==="sent"&&P("p",{class:"tryon-share__note",children:"Sent \u2014 check your inbox."}),H==="error"&&P("p",{class:"tryon-share__note tryon-share__note--error",children:X})]})]})]})]})]})})}console.log("[tryon] widget bundle 2026-10-10-r5 (fix inverted engine resume on connect)");function VA(t,e){let n=document.createElement("div");n.id="tryon-modal-host",document.body.appendChild(n);let i=()=>{kl(null,n),n.remove()};kl(P(X1,{configToken:e.configToken,productId:e.productId,variantId:e.variantId,customerId:e.customerId,product:e.product,blocked:e.blocked,recording:e.recording??!1,adminTest:e.adminTest??!1,onClose:i}),n)}export{VA as mountWidget};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
