import{B as je}from"./Button-Bmjem-ox.js";import"./Index-DkaKPSWq.js";/* empty css                                              */import Ae from"./Example-C7XUkkid.js";import"./index-BYvoOQkn.js";import"./svelte/svelte.js";/* empty css                                              */const{SvelteComponent:Ie,append:H,assign:Q,attr:d,check_outros:E,construct_svelte_component:T,create_component:Y,destroy_component:D,destroy_each:J,detach:z,element:N,empty:K,ensure_array_like:C,flush:q,get_spread_object:U,get_spread_update:V,group_outros:P,init:Re,insert:B,listen:R,mount_component:F,noop:Se,null_to_empty:te,run_all:ke,safe_not_equal:Ye,set_data:x,set_style:ne,space:A,svg_element:se,text:W,toggle_class:ie,transition_in:b,transition_out:w}=window.__gradio__svelte__internal;function oe(s,e,t){const n=s.slice();return n[36]=e[t],n}function re(s,e,t){const n=s.slice();return n[39]=e[t],n[41]=t,n}function fe(s,e,t){const n=s.slice();n[0]=e[t].value,n[43]=e[t].component,n[46]=t;const l=n[1][n[46]];return n[44]=l,n}function ce(s,e,t){const n=s.slice();return n[47]=e[t],n}function _e(s,e,t){const n=s.slice();return n[39]=e[t],n[41]=t,n}function De(s){let e,t,n,l,o,f,i,r=C(s[5]),c=[];for(let _=0;_<r.length;_+=1)c[_]=ae(ce(s,r,_));let h=C(s[19]),u=[];for(let _=0;_<h.length;_+=1)u[_]=he(re(s,h,_));const k=_=>w(u[_],1,1,()=>{u[_]=null});return{c(){e=N("div"),t=N("table"),n=N("thead"),l=N("tr");for(let _=0;_<c.length;_+=1)c[_].c();o=A(),f=N("tbody");for(let _=0;_<u.length;_+=1)u[_].c();d(l,"class","tr-head svelte-p5q82i"),d(t,"tabindex","0"),d(t,"role","grid"),d(t,"class","svelte-p5q82i"),d(e,"class","table-wrap svelte-p5q82i")},m(_,p){B(_,e,p),H(e,t),H(t,n),H(n,l);for(let a=0;a<c.length;a+=1)c[a]&&c[a].m(l,null);H(t,o),H(t,f);for(let a=0;a<u.length;a+=1)u[a]&&u[a].m(f,null);i=!0},p(_,p){if(p[0]&32){r=C(_[5]);let a;for(a=0;a<r.length;a+=1){const g=ce(_,r,a);c[a]?c[a].p(g,p):(c[a]=ae(g),c[a].c(),c[a].m(l,null))}for(;a<c.length;a+=1)c[a].d(1);c.length=r.length}if(p[0]&15492111){h=C(_[19]);let a;for(a=0;a<h.length;a+=1){const g=re(_,h,a);u[a]?(u[a].p(g,p),b(u[a],1)):(u[a]=he(g),u[a].c(),b(u[a],1),u[a].m(f,null))}for(P(),a=h.length;a<u.length;a+=1)k(a);E()}},i(_){if(!i){for(let p=0;p<h.length;p+=1)b(u[p]);i=!0}},o(_){u=u.filter(Boolean);for(let p=0;p<u.length;p+=1)w(u[p]);i=!1},d(_){_&&z(e),J(c,_),J(u,_)}}}function Fe(s){let e,t,n=C(s[16]),l=[];for(let f=0;f<n.length;f+=1)l[f]=ge(_e(s,n,f));const o=f=>w(l[f],1,1,()=>{l[f]=null});return{c(){e=N("div");for(let f=0;f<l.length;f+=1)l[f].c();d(e,"class","gallery svelte-p5q82i")},m(f,i){B(f,e,i);for(let r=0;r<l.length;r+=1)l[r]&&l[r].m(e,null);t=!0},p(f,i){if(i[0]&15557711){n=C(f[16]);let r;for(r=0;r<n.length;r+=1){const c=_e(f,n,r);l[r]?(l[r].p(c,i),b(l[r],1)):(l[r]=ge(c),l[r].c(),b(l[r],1),l[r].m(e,null))}for(P(),r=n.length;r<l.length;r+=1)o(r);E()}},i(f){if(!t){for(let i=0;i<n.length;i+=1)b(l[i]);t=!0}},o(f){l=l.filter(Boolean);for(let i=0;i<l.length;i+=1)w(l[i]);t=!1},d(f){f&&z(e),J(l,f)}}}function ae(s){let e,t=s[47]+"",n,l;return{c(){e=N("th"),n=W(t),l=A(),d(e,"class","svelte-p5q82i")},m(o,f){B(o,e,f),H(e,n),H(e,l)},p(o,f){f[0]&32&&t!==(t=o[47]+"")&&x(n,t)},d(o){o&&z(e)}}}function ue(s){let e,t,n,l;const o=[s[2][s[46]],{value:s[0]},{samples_dir:s[21]},{type:"table"},{selected:s[18]===s[41]},{index:s[41]}];var f=s[43];function i(r,c){let h={};for(let u=0;u<o.length;u+=1)h=Q(h,o[u]);return c!==void 0&&c[0]&2883588&&(h=Q(h,V(o,[c[0]&4&&U(r[2][r[46]]),c[0]&524288&&{value:r[0]},c[0]&2097152&&{samples_dir:r[21]},o[3],c[0]&262144&&{selected:r[18]===r[41]},o[5]]))),{props:h}}return f&&(t=T(f,i(s))),{c(){e=N("td"),t&&Y(t.$$.fragment),ne(e,"max-width",s[44]==="textbox"?"35ch":"auto"),d(e,"class",n=te(s[44])+" svelte-p5q82i")},m(r,c){B(r,e,c),t&&F(t,e,null),l=!0},p(r,c){if(c[0]&524288&&f!==(f=r[43])){if(t){P();const h=t;w(h.$$.fragment,1,0,()=>{D(h,1)}),E()}f?(t=T(f,i(r,c)),Y(t.$$.fragment),b(t.$$.fragment,1),F(t,e,null)):t=null}else if(f){const h=c[0]&2883588?V(o,[c[0]&4&&U(r[2][r[46]]),c[0]&524288&&{value:r[0]},c[0]&2097152&&{samples_dir:r[21]},o[3],c[0]&262144&&{selected:r[18]===r[41]},o[5]]):{};t.$set(h)}(!l||c[0]&2)&&ne(e,"max-width",r[44]==="textbox"?"35ch":"auto"),(!l||c[0]&2&&n!==(n=te(r[44])+" svelte-p5q82i"))&&d(e,"class",n)},i(r){l||(t&&b(t.$$.fragment,r),l=!0)},o(r){t&&w(t.$$.fragment,r),l=!1},d(r){r&&z(e),t&&D(t)}}}function me(s){let e=s[44]!==void 0&&s[3].get(s[44])!==void 0,t,n,l=e&&ue(s);return{c(){l&&l.c(),t=K()},m(o,f){l&&l.m(o,f),B(o,t,f),n=!0},p(o,f){f[0]&10&&(e=o[44]!==void 0&&o[3].get(o[44])!==void 0),e?l?(l.p(o,f),f[0]&10&&b(l,1)):(l=ue(o),l.c(),b(l,1),l.m(t.parentNode,t)):l&&(P(),w(l,1,1,()=>{l=null}),E())},i(o){n||(b(l),n=!0)},o(o){w(l),n=!1},d(o){o&&z(t),l&&l.d(o)}}}function he(s){let e,t,n,l,o,f=C(s[39]),i=[];for(let u=0;u<f.length;u+=1)i[u]=me(fe(s,f,u));const r=u=>w(i[u],1,1,()=>{i[u]=null});function c(){return s[31](s[41])}function h(){return s[32](s[41])}return{c(){e=N("tr");for(let u=0;u<i.length;u+=1)i[u].c();t=A(),d(e,"class","tr-body svelte-p5q82i")},m(u,k){B(u,e,k);for(let _=0;_<i.length;_+=1)i[_]&&i[_].m(e,null);H(e,t),n=!0,l||(o=[R(e,"click",c),R(e,"mouseenter",h),R(e,"mouseleave",s[33])],l=!0)},p(u,k){if(s=u,k[0]&2883598){f=C(s[39]);let _;for(_=0;_<f.length;_+=1){const p=fe(s,f,_);i[_]?(i[_].p(p,k),b(i[_],1)):(i[_]=me(p),i[_].c(),b(i[_],1),i[_].m(e,t))}for(P(),_=f.length;_<i.length;_+=1)r(_);E()}},i(u){if(!n){for(let k=0;k<f.length;k+=1)b(i[k]);n=!0}},o(u){i=i.filter(Boolean);for(let k=0;k<i.length;k+=1)w(i[k]);n=!1},d(u){u&&z(e),J(i,u),l=!1,ke(o)}}}function pe(s){let e,t,n,l,o,f,i,r;const c=[Je,Ge],h=[];function u(p,a){return a[0]&524298&&(t=null),p[6]?0:(t==null&&(t=!!(p[19].length&&p[3].get(p[1][0]))),t?1:-1)}~(n=u(s,[-1,-1]))&&(l=h[n]=c[n](s));function k(){return s[28](s[41],s[39])}function _(){return s[29](s[41])}return{c(){e=N("button"),l&&l.c(),o=A(),d(e,"class","gallery-item svelte-p5q82i")},m(p,a){B(p,e,a),~n&&h[n].m(e,null),H(e,o),f=!0,i||(r=[R(e,"click",k),R(e,"mouseenter",_),R(e,"mouseleave",s[30])],i=!0)},p(p,a){s=p;let g=n;n=u(s,a),n===g?~n&&h[n].p(s,a):(l&&(P(),w(h[g],1,1,()=>{h[g]=null}),E()),~n?(l=h[n],l?l.p(s,a):(l=h[n]=c[n](s),l.c()),b(l,1),l.m(e,o)):l=null)},i(p){f||(b(l),f=!0)},o(p){w(l),f=!1},d(p){p&&z(e),~n&&h[n].d(),i=!1,ke(r)}}}function Ge(s){let e,t,n;const l=[s[2][0],{value:s[39][0]},{samples_dir:s[21]},{type:"gallery"},{selected:s[18]===s[41]},{index:s[41]}];var o=s[19][0][0].component;function f(i,r){let c={};for(let h=0;h<l.length;h+=1)c=Q(c,l[h]);return r!==void 0&&r[0]&2424836&&(c=Q(c,V(l,[r[0]&4&&U(i[2][0]),r[0]&65536&&{value:i[39][0]},r[0]&2097152&&{samples_dir:i[21]},l[3],r[0]&262144&&{selected:i[18]===i[41]},l[5]]))),{props:c}}return o&&(e=T(o,f(s))),{c(){e&&Y(e.$$.fragment),t=K()},m(i,r){e&&F(e,i,r),B(i,t,r),n=!0},p(i,r){if(r[0]&524288&&o!==(o=i[19][0][0].component)){if(e){P();const c=e;w(c.$$.fragment,1,0,()=>{D(c,1)}),E()}o?(e=T(o,f(i,r)),Y(e.$$.fragment),b(e.$$.fragment,1),F(e,t.parentNode,t)):e=null}else if(o){const c=r[0]&2424836?V(l,[r[0]&4&&U(i[2][0]),r[0]&65536&&{value:i[39][0]},r[0]&2097152&&{samples_dir:i[21]},l[3],r[0]&262144&&{selected:i[18]===i[41]},l[5]]):{};e.$set(c)}},i(i){n||(e&&b(e.$$.fragment,i),n=!0)},o(i){e&&w(e.$$.fragment,i),n=!1},d(i){i&&z(t),e&&D(e,i)}}}function Je(s){let e,t;return e=new Ae({props:{value:s[39][0],selected:s[18]===s[41],type:"gallery"}}),{c(){Y(e.$$.fragment)},m(n,l){F(e,n,l),t=!0},p(n,l){const o={};l[0]&65536&&(o.value=n[39][0]),l[0]&262144&&(o.selected=n[18]===n[41]),e.$set(o)},i(n){t||(b(e.$$.fragment,n),t=!0)},o(n){w(e.$$.fragment,n),t=!1},d(n){D(e,n)}}}function ge(s){let e,t,n=s[39][0]&&pe(s);return{c(){n&&n.c(),e=K()},m(l,o){n&&n.m(l,o),B(l,e,o),t=!0},p(l,o){l[39][0]?n?(n.p(l,o),o[0]&65536&&b(n,1)):(n=pe(l),n.c(),b(n,1),n.m(e.parentNode,e)):n&&(P(),w(n,1,1,()=>{n=null}),E())},i(l){t||(b(n),t=!0)},o(l){w(n),t=!1},d(l){l&&z(e),n&&n.d(l)}}}function de(s){let e,t,n=C(s[17]),l=[];for(let o=0;o<n.length;o+=1)l[o]=be(oe(s,n,o));return{c(){e=N("div"),t=W(`Pages:
			`);for(let o=0;o<l.length;o+=1)l[o].c();d(e,"class","paginate svelte-p5q82i")},m(o,f){B(o,e,f),H(e,t);for(let i=0;i<l.length;i+=1)l[i]&&l[i].m(e,null)},p(o,f){if(f[0]&147456){n=C(o[17]);let i;for(i=0;i<n.length;i+=1){const r=oe(o,n,i);l[i]?l[i].p(r,f):(l[i]=be(r),l[i].c(),l[i].m(e,null))}for(;i<l.length;i+=1)l[i].d(1);l.length=n.length}},d(o){o&&z(e),J(l,o)}}}function Ke(s){let e,t=s[36]+1+"",n,l,o,f;function i(){return s[34](s[36])}return{c(){e=N("button"),n=W(t),l=A(),d(e,"class","svelte-p5q82i"),ie(e,"current-page",s[14]===s[36])},m(r,c){B(r,e,c),H(e,n),H(e,l),o||(f=R(e,"click",i),o=!0)},p(r,c){s=r,c[0]&131072&&t!==(t=s[36]+1+"")&&x(n,t),c[0]&147456&&ie(e,"current-page",s[14]===s[36])},d(r){r&&z(e),o=!1,f()}}}function Le(s){let e;return{c(){e=N("div"),e.textContent="..."},m(t,n){B(t,e,n)},p:Se,d(t){t&&z(e)}}}function be(s){let e;function t(o,f){return o[36]===-1?Le:Ke}let n=t(s),l=n(s);return{c(){l.c(),e=K()},m(o,f){l.m(o,f),B(o,e,f)},p(o,f){n===(n=t(o))&&l?l.p(o,f):(l.d(1),l=n(o),l&&(l.c(),l.m(e.parentNode,e)))},d(o){o&&z(e),l.d(o)}}}function Oe(s){let e,t,n,l,o,f,i,r,c,h,u;const k=[Fe,De],_=[];function p(g,v){return g[20]?0:1}i=p(s),r=_[i]=k[i](s);let a=s[15]&&de(s);return{c(){e=N("div"),t=se("svg"),n=se("path"),l=A(),o=W(s[4]),f=A(),r.c(),c=A(),a&&a.c(),h=K(),d(n,"fill","currentColor"),d(n,"d","M10 6h18v2H10zm0 18h18v2H10zm0-9h18v2H10zm-6 0h2v2H4zm0-9h2v2H4zm0 18h2v2H4z"),d(t,"xmlns","http://www.w3.org/2000/svg"),d(t,"xmlns:xlink","http://www.w3.org/1999/xlink"),d(t,"aria-hidden","true"),d(t,"role","img"),d(t,"width","1em"),d(t,"height","1em"),d(t,"preserveAspectRatio","xMidYMid meet"),d(t,"viewBox","0 0 32 32"),d(t,"class","svelte-p5q82i"),d(e,"class","label svelte-p5q82i")},m(g,v){B(g,e,v),H(e,t),H(t,n),H(e,l),H(e,o),B(g,f,v),_[i].m(g,v),B(g,c,v),a&&a.m(g,v),B(g,h,v),u=!0},p(g,v){(!u||v[0]&16)&&x(o,g[4]);let S=i;i=p(g),i===S?_[i].p(g,v):(P(),w(_[S],1,1,()=>{_[S]=null}),E(),r=_[i],r?r.p(g,v):(r=_[i]=k[i](g),r.c()),b(r,1),r.m(c.parentNode,c)),g[15]?a?a.p(g,v):(a=de(g),a.c(),a.m(h.parentNode,h)):a&&(a.d(1),a=null)},i(g){u||(b(r),u=!0)},o(g){w(r),u=!1},d(g){g&&(z(e),z(f),z(c),z(h)),_[i].d(g),a&&a.d(g)}}}function Qe(s){let e,t;return e=new je({props:{visible:s[9],padding:!1,elem_id:s[7],elem_classes:s[8],scale:s[11],min_width:s[12],allow_overflow:!1,container:!1,$$slots:{default:[Oe]},$$scope:{ctx:s}}}),{c(){Y(e.$$.fragment)},m(n,l){F(e,n,l),t=!0},p(n,l){const o={};l[0]&512&&(o.visible=n[9]),l[0]&128&&(o.elem_id=n[7]),l[0]&256&&(o.elem_classes=n[8]),l[0]&2048&&(o.scale=n[11]),l[0]&4096&&(o.min_width=n[12]),l[0]&2090111|l[1]&524288&&(o.$$scope={dirty:l,ctx:n}),e.$set(o)},i(n){t||(b(e.$$.fragment,n),t=!0)},o(n){w(e.$$.fragment,n),t=!1},d(n){D(e,n)}}}function Te(s,e,t){let n,{components:l}=e,{component_props:o}=e,{component_map:f}=e,{label:i="Examples"}=e,{headers:r}=e,{samples:c=null}=e,{sample_labels:h=null}=e,{elem_id:u=""}=e,{elem_classes:k=[]}=e,{visible:_=!0}=e,{value:p=null}=e,{root:a}=e,{proxy_url:g}=e,{samples_per_page:v=10}=e,{scale:S=null}=e,{min_width:ee=void 0}=e,{gradio:G}=e,ve=g?`/proxy=${g}file=`:`${a}/file=`,I=0,X=c?c.length>v:!1,L,O,j=[],Z=-1;function y(m){t(18,Z=m)}function $(){t(18,Z=-1)}let le=[];async function we(m){t(19,le=await Promise.all(m&&m.map(async M=>await Promise.all(M.map(async(Ee,Pe)=>({value:Ee,component:(await f.get(l[Pe]))?.default}))))))}const qe=(m,M)=>{t(0,p=m+I*v),G.dispatch("click",p),G.dispatch("select",{index:p,value:M})},ze=m=>y(m),Be=()=>$(),He=m=>{t(0,p=m+I*v),G.dispatch("click",p)},Ne=m=>y(m),Me=()=>$(),Ce=m=>t(14,I=m);return s.$$set=m=>{"components"in m&&t(1,l=m.components),"component_props"in m&&t(2,o=m.component_props),"component_map"in m&&t(3,f=m.component_map),"label"in m&&t(4,i=m.label),"headers"in m&&t(5,r=m.headers),"samples"in m&&t(24,c=m.samples),"sample_labels"in m&&t(6,h=m.sample_labels),"elem_id"in m&&t(7,u=m.elem_id),"elem_classes"in m&&t(8,k=m.elem_classes),"visible"in m&&t(9,_=m.visible),"value"in m&&t(0,p=m.value),"root"in m&&t(25,a=m.root),"proxy_url"in m&&t(26,g=m.proxy_url),"samples_per_page"in m&&t(10,v=m.samples_per_page),"scale"in m&&t(11,S=m.scale),"min_width"in m&&t(12,ee=m.min_width),"gradio"in m&&t(13,G=m.gradio)},s.$$.update=()=>{s.$$.dirty[0]&66&&t(20,n=l.length<2||h!==null),s.$$.dirty[0]&151176256&&(t(24,c=h?h.map(m=>[m]):c||[]),t(15,X=c.length>v),X?(t(17,j=[]),t(16,L=c.slice(I*v,(I+1)*v)),t(27,O=Math.ceil(c.length/v)),[0,I,O-1].forEach(m=>{for(let M=m-2;M<=m+2;M++)M>=0&&M<O&&!j.includes(M)&&(j.length>0&&M-j[j.length-1]>1&&j.push(-1),j.push(M))})):t(16,L=c.slice())),s.$$.dirty[0]&65544&&we(L)},[p,l,o,f,i,r,h,u,k,_,v,S,ee,G,I,X,L,j,Z,le,n,ve,y,$,c,a,g,O,qe,ze,Be,He,Ne,Me,Ce]}class xe extends Ie{constructor(e){super(),Re(this,e,Te,Qe,Ye,{components:1,component_props:2,component_map:3,label:4,headers:5,samples:24,sample_labels:6,elem_id:7,elem_classes:8,visible:9,value:0,root:25,proxy_url:26,samples_per_page:10,scale:11,min_width:12,gradio:13},null,[-1,-1])}get components(){return this.$$.ctx[1]}set components(e){this.$$set({components:e}),q()}get component_props(){return this.$$.ctx[2]}set component_props(e){this.$$set({component_props:e}),q()}get component_map(){return this.$$.ctx[3]}set component_map(e){this.$$set({component_map:e}),q()}get label(){return this.$$.ctx[4]}set label(e){this.$$set({label:e}),q()}get headers(){return this.$$.ctx[5]}set headers(e){this.$$set({headers:e}),q()}get samples(){return this.$$.ctx[24]}set samples(e){this.$$set({samples:e}),q()}get sample_labels(){return this.$$.ctx[6]}set sample_labels(e){this.$$set({sample_labels:e}),q()}get elem_id(){return this.$$.ctx[7]}set elem_id(e){this.$$set({elem_id:e}),q()}get elem_classes(){return this.$$.ctx[8]}set elem_classes(e){this.$$set({elem_classes:e}),q()}get visible(){return this.$$.ctx[9]}set visible(e){this.$$set({visible:e}),q()}get value(){return this.$$.ctx[0]}set value(e){this.$$set({value:e}),q()}get root(){return this.$$.ctx[25]}set root(e){this.$$set({root:e}),q()}get proxy_url(){return this.$$.ctx[26]}set proxy_url(e){this.$$set({proxy_url:e}),q()}get samples_per_page(){return this.$$.ctx[10]}set samples_per_page(e){this.$$set({samples_per_page:e}),q()}get scale(){return this.$$.ctx[11]}set scale(e){this.$$set({scale:e}),q()}get min_width(){return this.$$.ctx[12]}set min_width(e){this.$$set({min_width:e}),q()}get gradio(){return this.$$.ctx[13]}set gradio(e){this.$$set({gradio:e}),q()}}export{xe as default};
//# sourceMappingURL=Index-vTAAZ07N.js.map