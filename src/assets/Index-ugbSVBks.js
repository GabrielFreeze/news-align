import"./index-BYvoOQkn.js";import{a as b}from"./Button-Bmjem-ox.js";import"./svelte/svelte.js";import"./Index-DkaKPSWq.js";const{SvelteComponent:k,create_component:w,destroy_component:z,detach:B,flush:u,init:q,insert:C,mount_component:I,safe_not_equal:S,set_data:j,text:A,transition_in:D,transition_out:E}=window.__gradio__svelte__internal;function F(l){let e=(l[3]?l[11].i18n(l[3]):"")+"",n;return{c(){n=A(e)},m(i,s){C(i,n,s)},p(i,s){s&2056&&e!==(e=(i[3]?i[11].i18n(i[3]):"")+"")&&j(n,e)},d(i){i&&B(n)}}}function G(l){let e,n;return e=new b({props:{value:l[3],variant:l[4],elem_id:l[0],elem_classes:l[1],size:l[6],scale:l[7],link:l[9],icon:l[8],min_width:l[10],visible:l[2],disabled:!l[5],$$slots:{default:[F]},$$scope:{ctx:l}}}),e.$on("click",l[12]),{c(){w(e.$$.fragment)},m(i,s){I(e,i,s),n=!0},p(i,[s]){const a={};s&8&&(a.value=i[3]),s&16&&(a.variant=i[4]),s&1&&(a.elem_id=i[0]),s&2&&(a.elem_classes=i[1]),s&64&&(a.size=i[6]),s&128&&(a.scale=i[7]),s&512&&(a.link=i[9]),s&256&&(a.icon=i[8]),s&1024&&(a.min_width=i[10]),s&4&&(a.visible=i[2]),s&32&&(a.disabled=!i[5]),s&10248&&(a.$$scope={dirty:s,ctx:i}),e.$set(a)},i(i){n||(D(e.$$.fragment,i),n=!0)},o(i){E(e.$$.fragment,i),n=!1},d(i){z(e,i)}}}function H(l,e,n){let{elem_id:i=""}=e,{elem_classes:s=[]}=e,{visible:a=!0}=e,{value:_}=e,{variant:f="secondary"}=e,{interactive:m}=e,{size:h="lg"}=e,{scale:r=null}=e,{icon:g=null}=e,{link:o=null}=e,{min_width:v=void 0}=e,{gradio:c}=e;const d=()=>c.dispatch("click");return l.$$set=t=>{"elem_id"in t&&n(0,i=t.elem_id),"elem_classes"in t&&n(1,s=t.elem_classes),"visible"in t&&n(2,a=t.visible),"value"in t&&n(3,_=t.value),"variant"in t&&n(4,f=t.variant),"interactive"in t&&n(5,m=t.interactive),"size"in t&&n(6,h=t.size),"scale"in t&&n(7,r=t.scale),"icon"in t&&n(8,g=t.icon),"link"in t&&n(9,o=t.link),"min_width"in t&&n(10,v=t.min_width),"gradio"in t&&n(11,c=t.gradio)},[i,s,a,_,f,m,h,r,g,o,v,c,d]}class N extends k{constructor(e){super(),q(this,e,H,G,S,{elem_id:0,elem_classes:1,visible:2,value:3,variant:4,interactive:5,size:6,scale:7,icon:8,link:9,min_width:10,gradio:11})}get elem_id(){return this.$$.ctx[0]}set elem_id(e){this.$$set({elem_id:e}),u()}get elem_classes(){return this.$$.ctx[1]}set elem_classes(e){this.$$set({elem_classes:e}),u()}get visible(){return this.$$.ctx[2]}set visible(e){this.$$set({visible:e}),u()}get value(){return this.$$.ctx[3]}set value(e){this.$$set({value:e}),u()}get variant(){return this.$$.ctx[4]}set variant(e){this.$$set({variant:e}),u()}get interactive(){return this.$$.ctx[5]}set interactive(e){this.$$set({interactive:e}),u()}get size(){return this.$$.ctx[6]}set size(e){this.$$set({size:e}),u()}get scale(){return this.$$.ctx[7]}set scale(e){this.$$set({scale:e}),u()}get icon(){return this.$$.ctx[8]}set icon(e){this.$$set({icon:e}),u()}get link(){return this.$$.ctx[9]}set link(e){this.$$set({link:e}),u()}get min_width(){return this.$$.ctx[10]}set min_width(e){this.$$set({min_width:e}),u()}get gradio(){return this.$$.ctx[11]}set gradio(e){this.$$set({gradio:e}),u()}}export{b as BaseButton,N as default};
//# sourceMappingURL=Index-ugbSVBks.js.map