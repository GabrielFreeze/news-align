import{U as Le}from"./Upload-BLquPg9-.js";import{M as Te}from"./ModifyUpload-0Q8mJkMJ.js";import{S as de}from"./Index-DkaKPSWq.js";import{B as Ae}from"./BlockLabel-D-wF3X_C.js";import{V as Fe}from"./Video-fsmLZWjA.js";import{S as Ge}from"./SelectSource-BDC9LdxC.js";import"./Image-a9rDBaRB.js";import"./index-BYvoOQkn.js";/* empty css                                                   */import{W as He}from"./ImageUploader-BMHQcWtb.js";/* empty css                                              */import{p as _e,a as Ke}from"./Video-BdbQAxlX.js";import{l as sl}from"./Video-BdbQAxlX.js";import{P as Qe,V as Re}from"./VideoPreview-CrvvpATe.js";import{default as al}from"./Example-D3m_txiM.js";import{B as me}from"./Button-Bmjem-ox.js";import{U as Xe}from"./UploadText-BH9NfnF7.js";/* empty css                                                   */import"./Download-DVtk-Jv3.js";import"./Undo-CpmTQw3B.js";import"./DownloadLink-DXpP5rj8.js";import"./file-url-5ekbgBR0.js";import"./Upload-Cp8Go_XF.js";import"./svelte/svelte.js";import"./Image-Bsh8Umrh.js";import"./utils-Gtzs_Zla.js";import"./DropdownArrow-DIM8V0sw.js";import"./Empty-B7gLxX4w.js";import"./ShareButton-BHdAKIqL.js";import"./Blocks-B7cNA3Pj.js";import"./Trim-UKwaW4UI.js";const{SvelteComponent:Ye,add_flush_callback:be,append:ie,attr:H,bind:ge,binding_callbacks:we,bubble:J,check_outros:y,create_component:D,create_slot:Ze,destroy_component:L,detach:N,element:Y,empty:pe,flush:p,get_all_dirty_from_scope:ye,get_slot_changes:$e,group_outros:$,init:xe,insert:U,mount_component:T,noop:ae,safe_not_equal:ke,set_data:fe,space:Z,text:ce,transition_in:k,transition_out:v,update_slot_base:et}=window.__gradio__svelte__internal,{createEventDispatcher:tt}=window.__gradio__svelte__internal;function lt(l){let e,n,t,o,s,r,i;e=new Te({props:{i18n:l[11],download:l[5]?l[0].url:null}}),e.$on("clear",l[20]);const a=[st,ot],c=[];function f(h,m){return t==null&&(t=!!Ke()),t?0:h[0].size?1:-1}return~(o=f(l))&&(s=c[o]=a[o](l)),{c(){D(e.$$.fragment),n=Z(),s&&s.c(),r=pe()},m(h,m){T(e,h,m),U(h,n,m),~o&&c[o].m(h,m),U(h,r,m),i=!0},p(h,m){const V={};m[0]&2048&&(V.i18n=h[11]),m[0]&33&&(V.download=h[5]?h[0].url:null),e.$set(V);let z=o;o=f(h),o===z?~o&&c[o].p(h,m):(s&&($(),v(c[z],1,1,()=>{c[z]=null}),y()),~o?(s=c[o],s?s.p(h,m):(s=c[o]=a[o](h),s.c()),k(s,1),s.m(r.parentNode,r)):s=null)},i(h){i||(k(e.$$.fragment,h),k(s),i=!0)},o(h){v(e.$$.fragment,h),v(s),i=!1},d(h){h&&(N(n),N(r)),L(e,h),~o&&c[o].d(h)}}}function nt(l){let e,n,t,o;const s=[at,it],r=[];function i(a,c){return a[1]==="upload"?0:a[1]==="webcam"?1:-1}return~(n=i(l))&&(t=r[n]=s[n](l)),{c(){e=Y("div"),t&&t.c(),H(e,"class","upload-container svelte-14jis2k")},m(a,c){U(a,e,c),~n&&r[n].m(e,null),o=!0},p(a,c){let f=n;n=i(a),n===f?~n&&r[n].p(a,c):(t&&($(),v(r[f],1,1,()=>{r[f]=null}),y()),~n?(t=r[n],t?t.p(a,c):(t=r[n]=s[n](a),t.c()),k(t,1),t.m(e,null)):t=null)},i(a){o||(k(t),o=!0)},o(a){v(t),o=!1},d(a){a&&N(e),~n&&r[n].d()}}}function ot(l){let e,n=(l[0].orig_name||l[0].url)+"",t,o,s,r=_e(l[0].size)+"",i;return{c(){e=Y("div"),t=ce(n),o=Z(),s=Y("div"),i=ce(r),H(e,"class","file-name svelte-14jis2k"),H(s,"class","file-size svelte-14jis2k")},m(a,c){U(a,e,c),ie(e,t),U(a,o,c),U(a,s,c),ie(s,i)},p(a,c){c[0]&1&&n!==(n=(a[0].orig_name||a[0].url)+"")&&fe(t,n),c[0]&1&&r!==(r=_e(a[0].size)+"")&&fe(i,r)},i:ae,o:ae,d(a){a&&(N(e),N(o),N(s))}}}function st(l){let e=l[0]?.url,n,t,o=he(l);return{c(){o.c(),n=pe()},m(s,r){o.m(s,r),U(s,n,r),t=!0},p(s,r){r[0]&1&&ke(e,e=s[0]?.url)?($(),v(o,1,1,ae),y(),o=he(s),o.c(),k(o,1),o.m(n.parentNode,n)):o.p(s,r)},i(s){t||(k(o),t=!0)},o(s){v(o),t=!1},d(s){s&&N(n),o.d(s)}}}function he(l){let e,n;return e=new Qe({props:{upload:l[14],root:l[10],interactive:!0,autoplay:l[9],src:l[0].url,subtitle:l[2]?.url,mirror:l[7]&&l[1]==="webcam",label:l[4],handle_change:l[21],handle_reset_value:l[12],loop:l[16]}}),e.$on("play",l[29]),e.$on("pause",l[30]),e.$on("stop",l[31]),e.$on("end",l[32]),{c(){D(e.$$.fragment)},m(t,o){T(e,t,o),n=!0},p(t,o){const s={};o[0]&16384&&(s.upload=t[14]),o[0]&1024&&(s.root=t[10]),o[0]&512&&(s.autoplay=t[9]),o[0]&1&&(s.src=t[0].url),o[0]&4&&(s.subtitle=t[2]?.url),o[0]&130&&(s.mirror=t[7]&&t[1]==="webcam"),o[0]&16&&(s.label=t[4]),o[0]&4096&&(s.handle_reset_value=t[12]),o[0]&65536&&(s.loop=t[16]),e.$set(s)},i(t){n||(k(e.$$.fragment,t),n=!0)},o(t){v(e.$$.fragment,t),n=!1},d(t){L(e,t)}}}function it(l){let e,n;return e=new He({props:{root:l[10],mirror_webcam:l[7],include_audio:l[8],mode:"video",i18n:l[11],upload:l[14]}}),e.$on("error",l[26]),e.$on("capture",l[22]),e.$on("start_recording",l[27]),e.$on("stop_recording",l[28]),{c(){D(e.$$.fragment)},m(t,o){T(e,t,o),n=!0},p(t,o){const s={};o[0]&1024&&(s.root=t[10]),o[0]&128&&(s.mirror_webcam=t[7]),o[0]&256&&(s.include_audio=t[8]),o[0]&2048&&(s.i18n=t[11]),o[0]&16384&&(s.upload=t[14]),e.$set(s)},i(t){n||(k(e.$$.fragment,t),n=!0)},o(t){v(e.$$.fragment,t),n=!1},d(t){L(e,t)}}}function at(l){let e,n,t;function o(r){l[24](r)}let s={filetype:"video/x-m4v,video/*",max_file_size:l[13],root:l[10],upload:l[14],stream_handler:l[15],$$slots:{default:[rt]},$$scope:{ctx:l}};return l[17]!==void 0&&(s.dragging=l[17]),e=new Le({props:s}),we.push(()=>ge(e,"dragging",o)),e.$on("load",l[19]),e.$on("error",l[25]),{c(){D(e.$$.fragment)},m(r,i){T(e,r,i),t=!0},p(r,i){const a={};i[0]&8192&&(a.max_file_size=r[13]),i[0]&1024&&(a.root=r[10]),i[0]&16384&&(a.upload=r[14]),i[0]&32768&&(a.stream_handler=r[15]),i[1]&8&&(a.$$scope={dirty:i,ctx:r}),!n&&i[0]&131072&&(n=!0,a.dragging=r[17],be(()=>n=!1)),e.$set(a)},i(r){t||(k(e.$$.fragment,r),t=!0)},o(r){v(e.$$.fragment,r),t=!1},d(r){L(e,r)}}}function rt(l){let e;const n=l[23].default,t=Ze(n,l,l[34],null);return{c(){t&&t.c()},m(o,s){t&&t.m(o,s),e=!0},p(o,s){t&&t.p&&(!e||s[1]&8)&&et(t,n,o,o[34],e?$e(n,o[34],s,null):ye(o[34]),null)},i(o){e||(k(t,o),e=!0)},o(o){v(t,o),e=!1},d(o){t&&t.d(o)}}}function ut(l){let e,n,t,o,s,r,i,a,c;e=new Ae({props:{show_label:l[6],Icon:Fe,label:l[4]||"Video"}});const f=[nt,lt],h=[];function m(d,w){return d[0]===null||d[0].url===void 0?0:1}o=m(l),s=h[o]=f[o](l);function V(d){l[33](d)}let z={sources:l[3],handle_clear:l[20]};return l[1]!==void 0&&(z.active_source=l[1]),i=new Ge({props:z}),we.push(()=>ge(i,"active_source",V)),{c(){D(e.$$.fragment),n=Z(),t=Y("div"),s.c(),r=Z(),D(i.$$.fragment),H(t,"data-testid","video"),H(t,"class","video-container svelte-14jis2k")},m(d,w){T(e,d,w),U(d,n,w),U(d,t,w),h[o].m(t,null),ie(t,r),T(i,t,null),c=!0},p(d,w){const B={};w[0]&64&&(B.show_label=d[6]),w[0]&16&&(B.label=d[4]||"Video"),e.$set(B);let I=o;o=m(d),o===I?h[o].p(d,w):($(),v(h[I],1,1,()=>{h[I]=null}),y(),s=h[o],s?s.p(d,w):(s=h[o]=f[o](d),s.c()),k(s,1),s.m(t,r));const j={};w[0]&8&&(j.sources=d[3]),!a&&w[0]&2&&(a=!0,j.active_source=d[1],be(()=>a=!1)),i.$set(j)},i(d){c||(k(e.$$.fragment,d),k(s),k(i.$$.fragment,d),c=!0)},o(d){v(e.$$.fragment,d),v(s),v(i.$$.fragment,d),c=!1},d(d){d&&(N(n),N(t)),L(e,d),h[o].d(),L(i)}}}function _t(l,e,n){let{$$slots:t={},$$scope:o}=e,{value:s=null}=e,{subtitle:r=null}=e,{sources:i=["webcam","upload"]}=e,{label:a=void 0}=e,{show_download_button:c=!1}=e,{show_label:f=!0}=e,{mirror_webcam:h=!1}=e,{include_audio:m}=e,{autoplay:V}=e,{root:z}=e,{i18n:d}=e,{active_source:w="webcam"}=e,{handle_reset_value:B=()=>{}}=e,{max_file_size:I=null}=e,{upload:j}=e,{stream_handler:A}=e,{loop:b}=e;const S=tt();function K({detail:u}){n(0,s=u),S("change",u),S("upload",u)}function Q(){n(0,s=null),S("change",null),S("clear")}function R(u){S("change",u)}function F({detail:u}){S("change",u)}let C=!1;function G(u){C=u,n(17,C)}const E=({detail:u})=>S("error",u);function x(u){J.call(this,l,u)}function X(u){J.call(this,l,u)}function ee(u){J.call(this,l,u)}function te(u){J.call(this,l,u)}function le(u){J.call(this,l,u)}function ne(u){J.call(this,l,u)}function oe(u){J.call(this,l,u)}function se(u){w=u,n(1,w)}return l.$$set=u=>{"value"in u&&n(0,s=u.value),"subtitle"in u&&n(2,r=u.subtitle),"sources"in u&&n(3,i=u.sources),"label"in u&&n(4,a=u.label),"show_download_button"in u&&n(5,c=u.show_download_button),"show_label"in u&&n(6,f=u.show_label),"mirror_webcam"in u&&n(7,h=u.mirror_webcam),"include_audio"in u&&n(8,m=u.include_audio),"autoplay"in u&&n(9,V=u.autoplay),"root"in u&&n(10,z=u.root),"i18n"in u&&n(11,d=u.i18n),"active_source"in u&&n(1,w=u.active_source),"handle_reset_value"in u&&n(12,B=u.handle_reset_value),"max_file_size"in u&&n(13,I=u.max_file_size),"upload"in u&&n(14,j=u.upload),"stream_handler"in u&&n(15,A=u.stream_handler),"loop"in u&&n(16,b=u.loop),"$$scope"in u&&n(34,o=u.$$scope)},l.$$.update=()=>{l.$$.dirty[0]&131072&&S("drag",C)},[s,w,r,i,a,c,f,h,m,V,z,d,B,I,j,A,b,C,S,K,Q,R,F,t,G,E,x,X,ee,te,le,ne,oe,se,o]}class ft extends Ye{constructor(e){super(),xe(this,e,_t,ut,ke,{value:0,subtitle:2,sources:3,label:4,show_download_button:5,show_label:6,mirror_webcam:7,include_audio:8,autoplay:9,root:10,i18n:11,active_source:1,handle_reset_value:12,max_file_size:13,upload:14,stream_handler:15,loop:16},null,[-1,-1])}get value(){return this.$$.ctx[0]}set value(e){this.$$set({value:e}),p()}get subtitle(){return this.$$.ctx[2]}set subtitle(e){this.$$set({subtitle:e}),p()}get sources(){return this.$$.ctx[3]}set sources(e){this.$$set({sources:e}),p()}get label(){return this.$$.ctx[4]}set label(e){this.$$set({label:e}),p()}get show_download_button(){return this.$$.ctx[5]}set show_download_button(e){this.$$set({show_download_button:e}),p()}get show_label(){return this.$$.ctx[6]}set show_label(e){this.$$set({show_label:e}),p()}get mirror_webcam(){return this.$$.ctx[7]}set mirror_webcam(e){this.$$set({mirror_webcam:e}),p()}get include_audio(){return this.$$.ctx[8]}set include_audio(e){this.$$set({include_audio:e}),p()}get autoplay(){return this.$$.ctx[9]}set autoplay(e){this.$$set({autoplay:e}),p()}get root(){return this.$$.ctx[10]}set root(e){this.$$set({root:e}),p()}get i18n(){return this.$$.ctx[11]}set i18n(e){this.$$set({i18n:e}),p()}get active_source(){return this.$$.ctx[1]}set active_source(e){this.$$set({active_source:e}),p()}get handle_reset_value(){return this.$$.ctx[12]}set handle_reset_value(e){this.$$set({handle_reset_value:e}),p()}get max_file_size(){return this.$$.ctx[13]}set max_file_size(e){this.$$set({max_file_size:e}),p()}get upload(){return this.$$.ctx[14]}set upload(e){this.$$set({upload:e}),p()}get stream_handler(){return this.$$.ctx[15]}set stream_handler(e){this.$$set({stream_handler:e}),p()}get loop(){return this.$$.ctx[16]}set loop(e){this.$$set({loop:e}),p()}}const ct=ft,{SvelteComponent:ht,assign:ve,check_outros:dt,create_component:M,destroy_component:O,detach:re,empty:mt,flush:g,get_spread_object:ze,get_spread_update:Se,group_outros:bt,init:gt,insert:ue,mount_component:W,safe_not_equal:wt,space:Ve,transition_in:P,transition_out:q}=window.__gradio__svelte__internal;function pt(l){let e,n;return e=new me({props:{visible:l[4],variant:l[0]===null&&l[22]==="upload"?"dashed":"solid",border_mode:l[25]?"focus":"base",padding:!1,elem_id:l[2],elem_classes:l[3],height:l[9],width:l[10],container:l[11],scale:l[12],min_width:l[13],allow_overflow:!1,$$slots:{default:[zt]},$$scope:{ctx:l}}}),{c(){M(e.$$.fragment)},m(t,o){W(e,t,o),n=!0},p(t,o){const s={};o[0]&16&&(s.visible=t[4]),o[0]&4194305&&(s.variant=t[0]===null&&t[22]==="upload"?"dashed":"solid"),o[0]&33554432&&(s.border_mode=t[25]?"focus":"base"),o[0]&4&&(s.elem_id=t[2]),o[0]&8&&(s.elem_classes=t[3]),o[0]&512&&(s.height=t[9]),o[0]&1024&&(s.width=t[10]),o[0]&2048&&(s.container=t[11]),o[0]&4096&&(s.scale=t[12]),o[0]&8192&&(s.min_width=t[13]),o[0]&66798050|o[1]&131072&&(s.$$scope={dirty:o,ctx:t}),e.$set(s)},i(t){n||(P(e.$$.fragment,t),n=!0)},o(t){q(e.$$.fragment,t),n=!1},d(t){O(e,t)}}}function kt(l){let e,n;return e=new me({props:{visible:l[4],variant:l[0]===null&&l[22]==="upload"?"dashed":"solid",border_mode:l[25]?"focus":"base",padding:!1,elem_id:l[2],elem_classes:l[3],height:l[9],width:l[10],container:l[11],scale:l[12],min_width:l[13],allow_overflow:!1,$$slots:{default:[St]},$$scope:{ctx:l}}}),{c(){M(e.$$.fragment)},m(t,o){W(e,t,o),n=!0},p(t,o){const s={};o[0]&16&&(s.visible=t[4]),o[0]&4194305&&(s.variant=t[0]===null&&t[22]==="upload"?"dashed":"solid"),o[0]&33554432&&(s.border_mode=t[25]?"focus":"base"),o[0]&4&&(s.elem_id=t[2]),o[0]&8&&(s.elem_classes=t[3]),o[0]&512&&(s.height=t[9]),o[0]&1024&&(s.width=t[10]),o[0]&2048&&(s.container=t[11]),o[0]&4096&&(s.scale=t[12]),o[0]&8192&&(s.min_width=t[13]),o[0]&27509026|o[1]&131072&&(s.$$scope={dirty:o,ctx:t}),e.$set(s)},i(t){n||(P(e.$$.fragment,t),n=!0)},o(t){q(e.$$.fragment,t),n=!1},d(t){O(e,t)}}}function vt(l){let e,n;return e=new Xe({props:{i18n:l[17].i18n,type:"video"}}),{c(){M(e.$$.fragment)},m(t,o){W(e,t,o),n=!0},p(t,o){const s={};o[0]&131072&&(s.i18n=t[17].i18n),e.$set(s)},i(t){n||(P(e.$$.fragment,t),n=!0)},o(t){q(e.$$.fragment,t),n=!1},d(t){O(e,t)}}}function zt(l){let e,n,t,o;const s=[{autoscroll:l[17].autoscroll},{i18n:l[17].i18n},l[1]];let r={};for(let i=0;i<s.length;i+=1)r=ve(r,s[i]);return e=new de({props:r}),e.$on("clear_status",l[38]),t=new ct({props:{value:l[23],subtitle:l[24],label:l[5],show_label:l[8],show_download_button:l[16],sources:l[6],active_source:l[22],mirror_webcam:l[19],include_audio:l[20],autoplay:l[14],root:l[7],loop:l[21],handle_reset_value:l[26],i18n:l[17].i18n,max_file_size:l[17].max_file_size,upload:l[17].client.upload,stream_handler:l[17].client.stream,$$slots:{default:[vt]},$$scope:{ctx:l}}}),t.$on("change",l[27]),t.$on("drag",l[39]),t.$on("error",l[28]),t.$on("clear",l[40]),t.$on("play",l[41]),t.$on("pause",l[42]),t.$on("upload",l[43]),t.$on("stop",l[44]),t.$on("end",l[45]),t.$on("start_recording",l[46]),t.$on("stop_recording",l[47]),{c(){M(e.$$.fragment),n=Ve(),M(t.$$.fragment)},m(i,a){W(e,i,a),ue(i,n,a),W(t,i,a),o=!0},p(i,a){const c=a[0]&131074?Se(s,[a[0]&131072&&{autoscroll:i[17].autoscroll},a[0]&131072&&{i18n:i[17].i18n},a[0]&2&&ze(i[1])]):{};e.$set(c);const f={};a[0]&8388608&&(f.value=i[23]),a[0]&16777216&&(f.subtitle=i[24]),a[0]&32&&(f.label=i[5]),a[0]&256&&(f.show_label=i[8]),a[0]&65536&&(f.show_download_button=i[16]),a[0]&64&&(f.sources=i[6]),a[0]&4194304&&(f.active_source=i[22]),a[0]&524288&&(f.mirror_webcam=i[19]),a[0]&1048576&&(f.include_audio=i[20]),a[0]&16384&&(f.autoplay=i[14]),a[0]&128&&(f.root=i[7]),a[0]&2097152&&(f.loop=i[21]),a[0]&131072&&(f.i18n=i[17].i18n),a[0]&131072&&(f.max_file_size=i[17].max_file_size),a[0]&131072&&(f.upload=i[17].client.upload),a[0]&131072&&(f.stream_handler=i[17].client.stream),a[0]&131072|a[1]&131072&&(f.$$scope={dirty:a,ctx:i}),t.$set(f)},i(i){o||(P(e.$$.fragment,i),P(t.$$.fragment,i),o=!0)},o(i){q(e.$$.fragment,i),q(t.$$.fragment,i),o=!1},d(i){i&&re(n),O(e,i),O(t,i)}}}function St(l){let e,n,t,o;const s=[{autoscroll:l[17].autoscroll},{i18n:l[17].i18n},l[1]];let r={};for(let i=0;i<s.length;i+=1)r=ve(r,s[i]);return e=new de({props:r}),e.$on("clear_status",l[31]),t=new Re({props:{value:l[23],subtitle:l[24],label:l[5],show_label:l[8],autoplay:l[14],loop:l[21],show_share_button:l[15],show_download_button:l[16],i18n:l[17].i18n,upload:l[17].client.upload}}),t.$on("play",l[32]),t.$on("pause",l[33]),t.$on("stop",l[34]),t.$on("end",l[35]),t.$on("share",l[36]),t.$on("error",l[37]),{c(){M(e.$$.fragment),n=Ve(),M(t.$$.fragment)},m(i,a){W(e,i,a),ue(i,n,a),W(t,i,a),o=!0},p(i,a){const c=a[0]&131074?Se(s,[a[0]&131072&&{autoscroll:i[17].autoscroll},a[0]&131072&&{i18n:i[17].i18n},a[0]&2&&ze(i[1])]):{};e.$set(c);const f={};a[0]&8388608&&(f.value=i[23]),a[0]&16777216&&(f.subtitle=i[24]),a[0]&32&&(f.label=i[5]),a[0]&256&&(f.show_label=i[8]),a[0]&16384&&(f.autoplay=i[14]),a[0]&2097152&&(f.loop=i[21]),a[0]&32768&&(f.show_share_button=i[15]),a[0]&65536&&(f.show_download_button=i[16]),a[0]&131072&&(f.i18n=i[17].i18n),a[0]&131072&&(f.upload=i[17].client.upload),t.$set(f)},i(i){o||(P(e.$$.fragment,i),P(t.$$.fragment,i),o=!0)},o(i){q(e.$$.fragment,i),q(t.$$.fragment,i),o=!1},d(i){i&&re(n),O(e,i),O(t,i)}}}function Vt(l){let e,n,t,o;const s=[kt,pt],r=[];function i(a,c){return a[18]?1:0}return e=i(l),n=r[e]=s[e](l),{c(){n.c(),t=mt()},m(a,c){r[e].m(a,c),ue(a,t,c),o=!0},p(a,c){let f=e;e=i(a),e===f?r[e].p(a,c):(bt(),q(r[f],1,1,()=>{r[f]=null}),dt(),n=r[e],n?n.p(a,c):(n=r[e]=s[e](a),n.c()),P(n,1),n.m(t.parentNode,t))},i(a){o||(P(n),o=!0)},o(a){q(n),o=!1},d(a){a&&re(t),r[e].d(a)}}}function Bt(l,e,n){let{elem_id:t=""}=e,{elem_classes:o=[]}=e,{visible:s=!0}=e,{value:r=null}=e,i=null,{label:a}=e,{sources:c}=e,{root:f}=e,{show_label:h}=e,{loading_status:m}=e,{height:V}=e,{width:z}=e,{container:d=!1}=e,{scale:w=null}=e,{min_width:B=void 0}=e,{autoplay:I=!1}=e,{show_share_button:j=!0}=e,{show_download_button:A}=e,{gradio:b}=e,{interactive:S}=e,{mirror_webcam:K}=e,{include_audio:Q}=e,{loop:R=!1}=e,F=null,C=null,G,E=r;const x=()=>{E===null||r===E||n(0,r=E)};let X=!1;function ee({detail:_}){_!=null?n(0,r={video:_,subtitles:null}):n(0,r=null)}function te({detail:_}){const[We,De]=_.includes("Invalid file type")?["warning","complete"]:["error","error"];n(1,m=m||{}),n(1,m.status=De,m),n(1,m.message=_,m),b.dispatch(We,_)}const le=()=>b.dispatch("clear_status",m),ne=()=>b.dispatch("play"),oe=()=>b.dispatch("pause"),se=()=>b.dispatch("stop"),u=()=>b.dispatch("end"),Be=({detail:_})=>b.dispatch("share",_),Ie=({detail:_})=>b.dispatch("error",_),je=()=>b.dispatch("clear_status",m),Ne=({detail:_})=>n(25,X=_),Ue=()=>b.dispatch("clear"),Pe=()=>b.dispatch("play"),qe=()=>b.dispatch("pause"),Ce=()=>b.dispatch("upload"),Ee=()=>b.dispatch("stop"),Je=()=>b.dispatch("end"),Me=()=>b.dispatch("start_recording"),Oe=()=>b.dispatch("stop_recording");return l.$$set=_=>{"elem_id"in _&&n(2,t=_.elem_id),"elem_classes"in _&&n(3,o=_.elem_classes),"visible"in _&&n(4,s=_.visible),"value"in _&&n(0,r=_.value),"label"in _&&n(5,a=_.label),"sources"in _&&n(6,c=_.sources),"root"in _&&n(7,f=_.root),"show_label"in _&&n(8,h=_.show_label),"loading_status"in _&&n(1,m=_.loading_status),"height"in _&&n(9,V=_.height),"width"in _&&n(10,z=_.width),"container"in _&&n(11,d=_.container),"scale"in _&&n(12,w=_.scale),"min_width"in _&&n(13,B=_.min_width),"autoplay"in _&&n(14,I=_.autoplay),"show_share_button"in _&&n(15,j=_.show_share_button),"show_download_button"in _&&n(16,A=_.show_download_button),"gradio"in _&&n(17,b=_.gradio),"interactive"in _&&n(18,S=_.interactive),"mirror_webcam"in _&&n(19,K=_.mirror_webcam),"include_audio"in _&&n(20,Q=_.include_audio),"loop"in _&&n(21,R=_.loop)},l.$$.update=()=>{l.$$.dirty[0]&1073741825&&r&&E===null&&n(30,E=r),l.$$.dirty[0]&4194368&&c&&!G&&n(22,G=c[0]),l.$$.dirty[0]&1&&(r!=null?(n(23,F=r.video),n(24,C=r.subtitles)):(n(23,F=null),n(24,C=null))),l.$$.dirty[0]&537001985&&JSON.stringify(r)!==JSON.stringify(i)&&(n(29,i=r),b.dispatch("change"))},[r,m,t,o,s,a,c,f,h,V,z,d,w,B,I,j,A,b,S,K,Q,R,G,F,C,X,x,ee,te,i,E,le,ne,oe,se,u,Be,Ie,je,Ne,Ue,Pe,qe,Ce,Ee,Je,Me,Oe]}class It extends ht{constructor(e){super(),gt(this,e,Bt,Vt,wt,{elem_id:2,elem_classes:3,visible:4,value:0,label:5,sources:6,root:7,show_label:8,loading_status:1,height:9,width:10,container:11,scale:12,min_width:13,autoplay:14,show_share_button:15,show_download_button:16,gradio:17,interactive:18,mirror_webcam:19,include_audio:20,loop:21},null,[-1,-1])}get elem_id(){return this.$$.ctx[2]}set elem_id(e){this.$$set({elem_id:e}),g()}get elem_classes(){return this.$$.ctx[3]}set elem_classes(e){this.$$set({elem_classes:e}),g()}get visible(){return this.$$.ctx[4]}set visible(e){this.$$set({visible:e}),g()}get value(){return this.$$.ctx[0]}set value(e){this.$$set({value:e}),g()}get label(){return this.$$.ctx[5]}set label(e){this.$$set({label:e}),g()}get sources(){return this.$$.ctx[6]}set sources(e){this.$$set({sources:e}),g()}get root(){return this.$$.ctx[7]}set root(e){this.$$set({root:e}),g()}get show_label(){return this.$$.ctx[8]}set show_label(e){this.$$set({show_label:e}),g()}get loading_status(){return this.$$.ctx[1]}set loading_status(e){this.$$set({loading_status:e}),g()}get height(){return this.$$.ctx[9]}set height(e){this.$$set({height:e}),g()}get width(){return this.$$.ctx[10]}set width(e){this.$$set({width:e}),g()}get container(){return this.$$.ctx[11]}set container(e){this.$$set({container:e}),g()}get scale(){return this.$$.ctx[12]}set scale(e){this.$$set({scale:e}),g()}get min_width(){return this.$$.ctx[13]}set min_width(e){this.$$set({min_width:e}),g()}get autoplay(){return this.$$.ctx[14]}set autoplay(e){this.$$set({autoplay:e}),g()}get show_share_button(){return this.$$.ctx[15]}set show_share_button(e){this.$$set({show_share_button:e}),g()}get show_download_button(){return this.$$.ctx[16]}set show_download_button(e){this.$$set({show_download_button:e}),g()}get gradio(){return this.$$.ctx[17]}set gradio(e){this.$$set({gradio:e}),g()}get interactive(){return this.$$.ctx[18]}set interactive(e){this.$$set({interactive:e}),g()}get mirror_webcam(){return this.$$.ctx[19]}set mirror_webcam(e){this.$$set({mirror_webcam:e}),g()}get include_audio(){return this.$$.ctx[20]}set include_audio(e){this.$$set({include_audio:e}),g()}get loop(){return this.$$.ctx[21]}set loop(e){this.$$set({loop:e}),g()}}const ll=It;export{al as BaseExample,ct as BaseInteractiveVideo,Qe as BasePlayer,Re as BaseStaticVideo,ll as default,sl as loaded,Ke as playable,_e as prettyBytes};
//# sourceMappingURL=index-C-I3GFMj.js.map