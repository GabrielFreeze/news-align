import{M as I}from"./Index.svelte_svelte_type_style_lang-D7AIMumr.js";import{S as A}from"./Index-DkaKPSWq.js";import{B as D}from"./Button-Bmjem-ox.js";import{default as se}from"./Example-BwgyyytB.js";import{M as le}from"./Example.svelte_svelte_type_style_lang-CvePMmmU.js";import"./Blocks-B7cNA3Pj.js";import"./index-BYvoOQkn.js";import"./svelte/svelte.js";import"./Check-CZUQOzJl.js";import"./Copy-B6RcHnoK.js";import"./prism-python-CmtIkcGD.js";const{SvelteComponent:F,assign:G,attr:H,create_component:c,destroy_component:d,detach:S,element:J,flush:u,get_spread_object:K,get_spread_update:L,init:N,insert:C,mount_component:b,safe_not_equal:O,space:P,toggle_class:j,transition_in:k,transition_out:w}=window.__gradio__svelte__internal;function Q(s){let e,l,n,_,h;const o=[{autoscroll:s[8].autoscroll},{i18n:s[8].i18n},s[4],{variant:"center"}];let m={};for(let t=0;t<o.length;t+=1)m=G(m,o[t]);return e=new A({props:m}),e.$on("clear_status",s[14]),_=new I({props:{min_height:s[4]&&s[4].status!=="complete",value:s[3],elem_classes:s[1],visible:s[2],rtl:s[5],latex_delimiters:s[9],sanitize_html:s[6],line_breaks:s[7],header_links:s[10],height:s[11],show_copy_button:s[12]}}),_.$on("change",s[15]),{c(){c(e.$$.fragment),l=P(),n=J("div"),c(_.$$.fragment),H(n,"class","svelte-1ed2p3z"),j(n,"pending",s[4]?.status==="pending")},m(t,a){b(e,t,a),C(t,l,a),C(t,n,a),b(_,n,null),h=!0},p(t,a){const g=a&272?L(o,[a&256&&{autoscroll:t[8].autoscroll},a&256&&{i18n:t[8].i18n},a&16&&K(t[4]),o[3]]):{};e.$set(g);const r={};a&16&&(r.min_height=t[4]&&t[4].status!=="complete"),a&8&&(r.value=t[3]),a&2&&(r.elem_classes=t[1]),a&4&&(r.visible=t[2]),a&32&&(r.rtl=t[5]),a&512&&(r.latex_delimiters=t[9]),a&64&&(r.sanitize_html=t[6]),a&128&&(r.line_breaks=t[7]),a&1024&&(r.header_links=t[10]),a&2048&&(r.height=t[11]),a&4096&&(r.show_copy_button=t[12]),_.$set(r),(!h||a&16)&&j(n,"pending",t[4]?.status==="pending")},i(t){h||(k(e.$$.fragment,t),k(_.$$.fragment,t),h=!0)},o(t){w(e.$$.fragment,t),w(_.$$.fragment,t),h=!1},d(t){t&&(S(l),S(n)),d(e,t),d(_)}}}function R(s){let e,l;return e=new D({props:{visible:s[2],elem_id:s[0],elem_classes:s[1],container:!1,allow_overflow:!0,$$slots:{default:[Q]},$$scope:{ctx:s}}}),{c(){c(e.$$.fragment)},m(n,_){b(e,n,_),l=!0},p(n,[_]){const h={};_&4&&(h.visible=n[2]),_&1&&(h.elem_id=n[0]),_&2&&(h.elem_classes=n[1]),_&73726&&(h.$$scope={dirty:_,ctx:n}),e.$set(h)},i(n){l||(k(e.$$.fragment,n),l=!0)},o(n){w(e.$$.fragment,n),l=!1},d(n){d(e,n)}}}function T(s,e,l){let{label:n}=e,{elem_id:_=""}=e,{elem_classes:h=[]}=e,{visible:o=!0}=e,{value:m=""}=e,{loading_status:t}=e,{rtl:a=!1}=e,{sanitize_html:g=!0}=e,{line_breaks:r=!1}=e,{gradio:f}=e,{latex_delimiters:v}=e,{header_links:z=!1}=e,{height:M=void 0}=e,{show_copy_button:B=!1}=e;const q=()=>f.dispatch("clear_status",t),E=()=>f.dispatch("change");return s.$$set=i=>{"label"in i&&l(13,n=i.label),"elem_id"in i&&l(0,_=i.elem_id),"elem_classes"in i&&l(1,h=i.elem_classes),"visible"in i&&l(2,o=i.visible),"value"in i&&l(3,m=i.value),"loading_status"in i&&l(4,t=i.loading_status),"rtl"in i&&l(5,a=i.rtl),"sanitize_html"in i&&l(6,g=i.sanitize_html),"line_breaks"in i&&l(7,r=i.line_breaks),"gradio"in i&&l(8,f=i.gradio),"latex_delimiters"in i&&l(9,v=i.latex_delimiters),"header_links"in i&&l(10,z=i.header_links),"height"in i&&l(11,M=i.height),"show_copy_button"in i&&l(12,B=i.show_copy_button)},s.$$.update=()=>{s.$$.dirty&8448&&f.dispatch("change")},[_,h,o,m,t,a,g,r,f,v,z,M,B,n,q,E]}class p extends F{constructor(e){super(),N(this,e,T,R,O,{label:13,elem_id:0,elem_classes:1,visible:2,value:3,loading_status:4,rtl:5,sanitize_html:6,line_breaks:7,gradio:8,latex_delimiters:9,header_links:10,height:11,show_copy_button:12})}get label(){return this.$$.ctx[13]}set label(e){this.$$set({label:e}),u()}get elem_id(){return this.$$.ctx[0]}set elem_id(e){this.$$set({elem_id:e}),u()}get elem_classes(){return this.$$.ctx[1]}set elem_classes(e){this.$$set({elem_classes:e}),u()}get visible(){return this.$$.ctx[2]}set visible(e){this.$$set({visible:e}),u()}get value(){return this.$$.ctx[3]}set value(e){this.$$set({value:e}),u()}get loading_status(){return this.$$.ctx[4]}set loading_status(e){this.$$set({loading_status:e}),u()}get rtl(){return this.$$.ctx[5]}set rtl(e){this.$$set({rtl:e}),u()}get sanitize_html(){return this.$$.ctx[6]}set sanitize_html(e){this.$$set({sanitize_html:e}),u()}get line_breaks(){return this.$$.ctx[7]}set line_breaks(e){this.$$set({line_breaks:e}),u()}get gradio(){return this.$$.ctx[8]}set gradio(e){this.$$set({gradio:e}),u()}get latex_delimiters(){return this.$$.ctx[9]}set latex_delimiters(e){this.$$set({latex_delimiters:e}),u()}get header_links(){return this.$$.ctx[10]}set header_links(e){this.$$set({header_links:e}),u()}get height(){return this.$$.ctx[11]}set height(e){this.$$set({height:e}),u()}get show_copy_button(){return this.$$.ctx[12]}set show_copy_button(e){this.$$set({show_copy_button:e}),u()}}export{se as BaseExample,I as BaseMarkdown,le as MarkdownCode,p as default};
//# sourceMappingURL=Index-C2KEZmvO.js.map
