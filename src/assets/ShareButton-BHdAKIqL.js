import{I as g}from"./Index-DkaKPSWq.js";import{S as d}from"./Blocks-B7cNA3Pj.js";const{SvelteComponent:v,append:p,attr:s,detach:w,init:S,insert:x,noop:l,safe_not_equal:A,svg_element:f}=window.__gradio__svelte__internal;function C(a){let t,n;return{c(){t=f("svg"),n=f("path"),s(n,"d","M23,20a5,5,0,0,0-3.89,1.89L11.8,17.32a4.46,4.46,0,0,0,0-2.64l7.31-4.57A5,5,0,1,0,18,7a4.79,4.79,0,0,0,.2,1.32l-7.31,4.57a5,5,0,1,0,0,6.22l7.31,4.57A4.79,4.79,0,0,0,18,25a5,5,0,1,0,5-5ZM23,4a3,3,0,1,1-3,3A3,3,0,0,1,23,4ZM7,19a3,3,0,1,1,3-3A3,3,0,0,1,7,19Zm16,9a3,3,0,1,1,3-3A3,3,0,0,1,23,28Z"),s(n,"fill","currentColor"),s(t,"id","icon"),s(t,"xmlns","http://www.w3.org/2000/svg"),s(t,"viewBox","0 0 32 32")},m(e,o){x(e,t,o),p(t,n)},p:l,i:l,o:l,d(e){e&&w(t)}}}class b extends v{constructor(t){super(),S(this,t,null,C,A,{})}}const{SvelteComponent:y,create_component:Z,destroy_component:$,flush:u,init:q,mount_component:B,safe_not_equal:I,transition_in:M,transition_out:k}=window.__gradio__svelte__internal,{createEventDispatcher:E}=window.__gradio__svelte__internal;function D(a){let t,n;return t=new g({props:{Icon:b,label:a[2]("common.share"),pending:a[3]}}),t.$on("click",a[5]),{c(){Z(t.$$.fragment)},m(e,o){B(t,e,o),n=!0},p(e,[o]){const i={};o&4&&(i.label=e[2]("common.share")),o&8&&(i.pending=e[3]),t.$set(i)},i(e){n||(M(t.$$.fragment,e),n=!0)},o(e){k(t.$$.fragment,e),n=!1},d(e){$(t,e)}}}function L(a,t,n){const e=E();let{formatter:o}=t,{value:i}=t,{i18n:m}=t,c=!1;const _=async()=>{try{n(3,c=!0);const r=await o(i);e("share",{description:r})}catch(r){console.error(r);let h=r instanceof d?r.message:"Share failed.";e("error",h)}finally{n(3,c=!1)}};return a.$$set=r=>{"formatter"in r&&n(0,o=r.formatter),"value"in r&&n(1,i=r.value),"i18n"in r&&n(2,m=r.i18n)},[o,i,m,c,e,_]}class F extends y{constructor(t){super(),q(this,t,L,D,I,{formatter:0,value:1,i18n:2})}get formatter(){return this.$$.ctx[0]}set formatter(t){this.$$set({formatter:t}),u()}get value(){return this.$$.ctx[1]}set value(t){this.$$set({value:t}),u()}get i18n(){return this.$$.ctx[2]}set i18n(t){this.$$set({i18n:t}),u()}}export{F as S};
//# sourceMappingURL=ShareButton-BHdAKIqL.js.map
