import"./Index-DkaKPSWq.js";import{B as He}from"./BlockTitle-C7NSNddH.js";import{C as Ee}from"./Check-CZUQOzJl.js";import{C as ze}from"./Copy-B6RcHnoK.js";import{f as De}from"./Button-Bmjem-ox.js";/* empty css                                              */const{SvelteComponent:Ne,action_destroyer:Be,add_render_callback:Ke,append:Le,attr:a,binding_callbacks:S,bubble:H,check_outros:I,create_component:J,create_in_transition:Se,destroy_component:M,detach:k,element:z,empty:$,flush:m,group_outros:O,init:Ue,insert:w,is_function:qe,listen:d,mount_component:P,noop:U,run_all:q,safe_not_equal:Ye,set_data:je,set_input_value:E,space:ee,text:Ae,toggle_class:X,transition_in:v,transition_out:T}=window.__gradio__svelte__internal,{beforeUpdate:Fe,afterUpdate:Ge,createEventDispatcher:Ie,tick:Z}=window.__gradio__svelte__internal;function Je(l){let e;return{c(){e=Ae(l[3])},m(t,o){w(t,e,o)},p(t,o){o[0]&8&&je(e,t[3])},d(t){t&&k(e)}}}function Me(l){let e,t,o,n,s,u,h,_,f=l[6]&&l[10]&&x(l);return{c(){f&&f.c(),e=ee(),t=z("textarea"),a(t,"data-testid","textbox"),a(t,"class","scroll-hide svelte-1f354aw"),a(t,"dir",o=l[11]?"rtl":"ltr"),a(t,"placeholder",l[2]),a(t,"rows",l[1]),t.disabled=l[5],t.autofocus=l[12],a(t,"style",n=l[13]?"text-align: "+l[13]:"")},m(r,c){f&&f.m(r,c),w(r,e,c),w(r,t,c),E(t,l[0]),l[38](t),u=!0,l[12]&&t.focus(),h||(_=[Be(s=l[20].call(null,t,l[0])),d(t,"input",l[37]),d(t,"keypress",l[18]),d(t,"blur",l[29]),d(t,"select",l[17]),d(t,"focus",l[30]),d(t,"scroll",l[19])],h=!0)},p(r,c){r[6]&&r[10]?f?(f.p(r,c),c[0]&1088&&v(f,1)):(f=x(r),f.c(),v(f,1),f.m(e.parentNode,e)):f&&(O(),T(f,1,1,()=>{f=null}),I()),(!u||c[0]&2048&&o!==(o=r[11]?"rtl":"ltr"))&&a(t,"dir",o),(!u||c[0]&4)&&a(t,"placeholder",r[2]),(!u||c[0]&2)&&a(t,"rows",r[1]),(!u||c[0]&32)&&(t.disabled=r[5]),(!u||c[0]&4096)&&(t.autofocus=r[12]),(!u||c[0]&8192&&n!==(n=r[13]?"text-align: "+r[13]:""))&&a(t,"style",n),s&&qe(s.update)&&c[0]&1&&s.update.call(null,r[0]),c[0]&1&&E(t,r[0])},i(r){u||(v(f),u=!0)},o(r){T(f),u=!1},d(r){r&&(k(e),k(t)),f&&f.d(r),l[38](null),h=!1,q(_)}}}function Oe(l){let e;function t(s,u){if(s[9]==="text")return We;if(s[9]==="password")return Ve;if(s[9]==="email")return Re}let o=t(l),n=o&&o(l);return{c(){n&&n.c(),e=$()},m(s,u){n&&n.m(s,u),w(s,e,u)},p(s,u){o===(o=t(s))&&n?n.p(s,u):(n&&n.d(1),n=o&&o(s),n&&(n.c(),n.m(e.parentNode,e)))},i:U,o:U,d(s){s&&k(e),n&&n.d(s)}}}function x(l){let e,t,o,n;const s=[Qe,Pe],u=[];function h(_,f){return _[15]?0:1}return e=h(l),t=u[e]=s[e](l),{c(){t.c(),o=$()},m(_,f){u[e].m(_,f),w(_,o,f),n=!0},p(_,f){let r=e;e=h(_),e===r?u[e].p(_,f):(O(),T(u[r],1,1,()=>{u[r]=null}),I(),t=u[e],t?t.p(_,f):(t=u[e]=s[e](_),t.c()),v(t,1),t.m(o.parentNode,o))},i(_){n||(v(t),n=!0)},o(_){T(t),n=!1},d(_){_&&k(o),u[e].d(_)}}}function Pe(l){let e,t,o,n,s;return t=new ze({}),{c(){e=z("button"),J(t.$$.fragment),a(e,"aria-label","Copy"),a(e,"aria-roledescription","Copy text"),a(e,"class","svelte-1f354aw")},m(u,h){w(u,e,h),P(t,e,null),o=!0,n||(s=d(e,"click",l[16]),n=!0)},p:U,i(u){o||(v(t.$$.fragment,u),o=!0)},o(u){T(t.$$.fragment,u),o=!1},d(u){u&&k(e),M(t),n=!1,s()}}}function Qe(l){let e,t,o,n;return t=new Ee({}),{c(){e=z("button"),J(t.$$.fragment),a(e,"aria-label","Copied"),a(e,"aria-roledescription","Text copied"),a(e,"class","svelte-1f354aw")},m(s,u){w(s,e,u),P(t,e,null),n=!0},p:U,i(s){n||(v(t.$$.fragment,s),s&&(o||Ke(()=>{o=Se(e,De,{duration:300}),o.start()})),n=!0)},o(s){T(t.$$.fragment,s),n=!1},d(s){s&&k(e),M(t)}}}function Re(l){let e,t,o;return{c(){e=z("input"),a(e,"data-testid","textbox"),a(e,"type","email"),a(e,"class","scroll-hide svelte-1f354aw"),a(e,"placeholder",l[2]),e.disabled=l[5],e.autofocus=l[12],a(e,"autocomplete","email")},m(n,s){w(n,e,s),E(e,l[0]),l[36](e),l[12]&&e.focus(),t||(o=[d(e,"input",l[35]),d(e,"keypress",l[18]),d(e,"blur",l[27]),d(e,"select",l[17]),d(e,"focus",l[28])],t=!0)},p(n,s){s[0]&4&&a(e,"placeholder",n[2]),s[0]&32&&(e.disabled=n[5]),s[0]&4096&&(e.autofocus=n[12]),s[0]&1&&e.value!==n[0]&&E(e,n[0])},d(n){n&&k(e),l[36](null),t=!1,q(o)}}}function Ve(l){let e,t,o;return{c(){e=z("input"),a(e,"data-testid","password"),a(e,"type","password"),a(e,"class","scroll-hide svelte-1f354aw"),a(e,"placeholder",l[2]),e.disabled=l[5],e.autofocus=l[12],a(e,"autocomplete","")},m(n,s){w(n,e,s),E(e,l[0]),l[34](e),l[12]&&e.focus(),t||(o=[d(e,"input",l[33]),d(e,"keypress",l[18]),d(e,"blur",l[25]),d(e,"select",l[17]),d(e,"focus",l[26])],t=!0)},p(n,s){s[0]&4&&a(e,"placeholder",n[2]),s[0]&32&&(e.disabled=n[5]),s[0]&4096&&(e.autofocus=n[12]),s[0]&1&&e.value!==n[0]&&E(e,n[0])},d(n){n&&k(e),l[34](null),t=!1,q(o)}}}function We(l){let e,t,o,n,s;return{c(){e=z("input"),a(e,"data-testid","textbox"),a(e,"type","text"),a(e,"class","scroll-hide svelte-1f354aw"),a(e,"dir",t=l[11]?"rtl":"ltr"),a(e,"placeholder",l[2]),e.disabled=l[5],e.autofocus=l[12],a(e,"style",o=l[13]?"text-align: "+l[13]:"")},m(u,h){w(u,e,h),E(e,l[0]),l[32](e),l[12]&&e.focus(),n||(s=[d(e,"input",l[31]),d(e,"keypress",l[18]),d(e,"blur",l[23]),d(e,"select",l[17]),d(e,"focus",l[24])],n=!0)},p(u,h){h[0]&2048&&t!==(t=u[11]?"rtl":"ltr")&&a(e,"dir",t),h[0]&4&&a(e,"placeholder",u[2]),h[0]&32&&(e.disabled=u[5]),h[0]&4096&&(e.autofocus=u[12]),h[0]&8192&&o!==(o=u[13]?"text-align: "+u[13]:"")&&a(e,"style",o),h[0]&1&&e.value!==u[0]&&E(e,u[0])},d(u){u&&k(e),l[32](null),n=!1,q(s)}}}function Xe(l){let e,t,o,n,s,u;t=new He({props:{show_label:l[6],info:l[4],$$slots:{default:[Je]},$$scope:{ctx:l}}});const h=[Oe,Me],_=[];function f(r,c){return r[1]===1&&r[8]===1?0:1}return n=f(l),s=_[n]=h[n](l),{c(){e=z("label"),J(t.$$.fragment),o=ee(),s.c(),a(e,"class","svelte-1f354aw"),X(e,"container",l[7])},m(r,c){w(r,e,c),P(t,e,null),Le(e,o),_[n].m(e,null),u=!0},p(r,c){const p={};c[0]&64&&(p.show_label=r[6]),c[0]&16&&(p.info=r[4]),c[0]&8|c[1]&131072&&(p.$$scope={dirty:c,ctx:r}),t.$set(p);let D=n;n=f(r),n===D?_[n].p(r,c):(O(),T(_[D],1,1,()=>{_[D]=null}),I(),s=_[n],s?s.p(r,c):(s=_[n]=h[n](r),s.c()),v(s,1),s.m(e,null)),(!u||c[0]&128)&&X(e,"container",r[7])},i(r){u||(v(t.$$.fragment,r),v(s),u=!0)},o(r){T(t.$$.fragment,r),T(s),u=!1},d(r){r&&k(e),M(t),_[n].d()}}}function Ze(l,e,t){let{value:o=""}=e,{value_is_output:n=!1}=e,{lines:s=1}=e,{placeholder:u="Type here..."}=e,{label:h}=e,{info:_=void 0}=e,{disabled:f=!1}=e,{show_label:r=!0}=e,{container:c=!0}=e,{max_lines:p}=e,{type:D="text"}=e,{show_copy_button:Q=!1}=e,{rtl:R=!1}=e,{autofocus:Y=!1}=e,{text_align:V=void 0}=e,{autoscroll:K=!0}=e,b,j=!1,A,F,W=0,G=!1;const N=Ie();Fe(()=>{F=b&&b.offsetHeight+b.scrollTop>b.scrollHeight-100});const te=()=>{F&&K&&!G&&b.scrollTo(0,b.scrollHeight)};function le(){N("change",o),n||N("input")}Ge(()=>{Y&&b.focus(),F&&K&&te(),t(21,n=!1)});async function ie(){"clipboard"in navigator&&(await navigator.clipboard.writeText(o),ne())}function ne(){t(15,j=!0),A&&clearTimeout(A),A=setTimeout(()=>{t(15,j=!1)},1e3)}function se(i){const g=i.target,C=g.value,y=[g.selectionStart,g.selectionEnd];N("select",{value:C.substring(...y),index:y})}async function oe(i){await Z(),(i.key==="Enter"&&i.shiftKey&&s>1||i.key==="Enter"&&!i.shiftKey&&s===1&&p>=1)&&(i.preventDefault(),N("submit"))}function ue(i){const g=i.target,C=g.scrollTop;C<W&&(G=!0),W=C;const y=g.scrollHeight-g.clientHeight;C>=y&&(G=!1)}async function L(i){if(await Z(),s===p)return;let g=p===void 0?!1:p===void 0?21*11:21*(p+1),C=21*(s+1);const y=i.target;y.style.height="1px";let B;g&&y.scrollHeight>g?B=g:y.scrollHeight<C?B=C:B=y.scrollHeight,y.style.height=`${B}px`}function re(i,g){if(s!==p&&(i.style.overflowY="scroll",i.addEventListener("input",L),!!g.trim()))return L({target:i}),{destroy:()=>i.removeEventListener("input",L)}}function ae(i){H.call(this,l,i)}function fe(i){H.call(this,l,i)}function _e(i){H.call(this,l,i)}function ce(i){H.call(this,l,i)}function he(i){H.call(this,l,i)}function de(i){H.call(this,l,i)}function be(i){H.call(this,l,i)}function me(i){H.call(this,l,i)}function pe(){o=this.value,t(0,o)}function ge(i){S[i?"unshift":"push"](()=>{b=i,t(14,b)})}function ke(){o=this.value,t(0,o)}function we(i){S[i?"unshift":"push"](()=>{b=i,t(14,b)})}function ye(){o=this.value,t(0,o)}function ve(i){S[i?"unshift":"push"](()=>{b=i,t(14,b)})}function Te(){o=this.value,t(0,o)}function Ce(i){S[i?"unshift":"push"](()=>{b=i,t(14,b)})}return l.$$set=i=>{"value"in i&&t(0,o=i.value),"value_is_output"in i&&t(21,n=i.value_is_output),"lines"in i&&t(1,s=i.lines),"placeholder"in i&&t(2,u=i.placeholder),"label"in i&&t(3,h=i.label),"info"in i&&t(4,_=i.info),"disabled"in i&&t(5,f=i.disabled),"show_label"in i&&t(6,r=i.show_label),"container"in i&&t(7,c=i.container),"max_lines"in i&&t(8,p=i.max_lines),"type"in i&&t(9,D=i.type),"show_copy_button"in i&&t(10,Q=i.show_copy_button),"rtl"in i&&t(11,R=i.rtl),"autofocus"in i&&t(12,Y=i.autofocus),"text_align"in i&&t(13,V=i.text_align),"autoscroll"in i&&t(22,K=i.autoscroll)},l.$$.update=()=>{l.$$.dirty[0]&1&&o===null&&t(0,o=""),l.$$.dirty[0]&16643&&b&&s!==p&&L({target:b}),l.$$.dirty[0]&1&&le()},[o,s,u,h,_,f,r,c,p,D,Q,R,Y,V,b,j,ie,se,oe,ue,re,n,K,ae,fe,_e,ce,he,de,be,me,pe,ge,ke,we,ye,ve,Te,Ce]}class nt extends Ne{constructor(e){super(),Ue(this,e,Ze,Xe,Ye,{value:0,value_is_output:21,lines:1,placeholder:2,label:3,info:4,disabled:5,show_label:6,container:7,max_lines:8,type:9,show_copy_button:10,rtl:11,autofocus:12,text_align:13,autoscroll:22},null,[-1,-1])}get value(){return this.$$.ctx[0]}set value(e){this.$$set({value:e}),m()}get value_is_output(){return this.$$.ctx[21]}set value_is_output(e){this.$$set({value_is_output:e}),m()}get lines(){return this.$$.ctx[1]}set lines(e){this.$$set({lines:e}),m()}get placeholder(){return this.$$.ctx[2]}set placeholder(e){this.$$set({placeholder:e}),m()}get label(){return this.$$.ctx[3]}set label(e){this.$$set({label:e}),m()}get info(){return this.$$.ctx[4]}set info(e){this.$$set({info:e}),m()}get disabled(){return this.$$.ctx[5]}set disabled(e){this.$$set({disabled:e}),m()}get show_label(){return this.$$.ctx[6]}set show_label(e){this.$$set({show_label:e}),m()}get container(){return this.$$.ctx[7]}set container(e){this.$$set({container:e}),m()}get max_lines(){return this.$$.ctx[8]}set max_lines(e){this.$$set({max_lines:e}),m()}get type(){return this.$$.ctx[9]}set type(e){this.$$set({type:e}),m()}get show_copy_button(){return this.$$.ctx[10]}set show_copy_button(e){this.$$set({show_copy_button:e}),m()}get rtl(){return this.$$.ctx[11]}set rtl(e){this.$$set({rtl:e}),m()}get autofocus(){return this.$$.ctx[12]}set autofocus(e){this.$$set({autofocus:e}),m()}get text_align(){return this.$$.ctx[13]}set text_align(e){this.$$set({text_align:e}),m()}get autoscroll(){return this.$$.ctx[22]}set autoscroll(e){this.$$set({autoscroll:e}),m()}}export{nt as T};
//# sourceMappingURL=Textbox-C9GJSzzK.js.map
