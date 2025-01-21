import{r as S}from"./file-url-5ekbgBR0.js";const M=new Error("failed to get response body reader"),V=new Error("failed to complete download"),P="Content-Length",W=async(t,i)=>{const a=await fetch(t);let e;try{const p=parseInt(a.headers.get(P)||"-1"),c=a.body?.getReader();if(!c)throw M;const f=[];let d=0;for(;;){const{done:s,value:x}=await c.read(),u=x?x.length:0;if(s){if(p!=-1&&p!==d)throw V;i&&i({url:t,total:p,received:d,delta:u,done:s});break}f.push(x),d+=u,i&&i({url:t,total:p,received:d,delta:u,done:s})}const v=new Uint8Array(d);let g=0;for(const s of f)v.set(s,g),g+=s.length;e=v.buffer}catch(p){console.log("failed to send download progress event: ",p),e=await a.arrayBuffer()}return e},k=async(t,i,a=!1,e)=>{const p=a?await W(t,e):await(await fetch(t)).arrayBuffer(),c=new Blob([p],{type:i});return URL.createObjectURL(c)};var n;(function(t){t.LOAD="LOAD",t.EXEC="EXEC",t.WRITE_FILE="WRITE_FILE",t.READ_FILE="READ_FILE",t.DELETE_FILE="DELETE_FILE",t.RENAME="RENAME",t.CREATE_DIR="CREATE_DIR",t.LIST_DIR="LIST_DIR",t.DELETE_DIR="DELETE_DIR",t.ERROR="ERROR",t.DOWNLOAD="DOWNLOAD",t.PROGRESS="PROGRESS",t.LOG="LOG",t.MOUNT="MOUNT",t.UNMOUNT="UNMOUNT"})(n||(n={}));const G=(()=>{let t=0;return()=>t++})(),X=new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"),H=new Error("called FFmpeg.terminate()");class F{#t=null;#e={};#a={};#o=[];#l=[];loaded=!1;#p=()=>{this.#t&&(this.#t.onmessage=({data:{id:i,type:a,data:e}})=>{switch(a){case n.LOAD:this.loaded=!0,this.#e[i](e);break;case n.MOUNT:case n.UNMOUNT:case n.EXEC:case n.WRITE_FILE:case n.READ_FILE:case n.DELETE_FILE:case n.RENAME:case n.CREATE_DIR:case n.LIST_DIR:case n.DELETE_DIR:this.#e[i](e);break;case n.LOG:this.#o.forEach(p=>p(e));break;case n.PROGRESS:this.#l.forEach(p=>p(e));break;case n.ERROR:this.#a[i](e);break}delete this.#e[i],delete this.#a[i]})};#i=({type:i,data:a},e=[],p)=>this.#t?new Promise((c,f)=>{const d=G();this.#t&&this.#t.postMessage({id:d,type:i,data:a},e),this.#e[d]=c,this.#a[d]=f,p?.addEventListener("abort",()=>{f(new DOMException(`Message # ${d} was aborted`,"AbortError"))},{once:!0})}):Promise.reject(X);on(i,a){i==="log"?this.#o.push(a):i==="progress"&&this.#l.push(a)}off(i,a){i==="log"?this.#o=this.#o.filter(e=>e!==a):i==="progress"&&(this.#l=this.#l.filter(e=>e!==a))}load=(i={},{signal:a}={})=>(this.#t||(this.#t=new Worker(new URL(""+new URL("worker-DJ3jufjD.js",import.meta.url).href,import.meta.url),{type:"module"}),this.#p()),this.#i({type:n.LOAD,data:i},void 0,a));exec=(i,a=-1,{signal:e}={})=>this.#i({type:n.EXEC,data:{args:i,timeout:a}},void 0,e);terminate=()=>{const i=Object.keys(this.#a);for(const a of i)this.#a[a](H),delete this.#a[a],delete this.#e[a];this.#t&&(this.#t.terminate(),this.#t=null,this.loaded=!1)};writeFile=(i,a,{signal:e}={})=>{const p=[];return a instanceof Uint8Array&&p.push(a.buffer),this.#i({type:n.WRITE_FILE,data:{path:i,data:a}},p,e)};mount=(i,a,e)=>{const p=[];return this.#i({type:n.MOUNT,data:{fsType:i,options:a,mountPoint:e}},p)};unmount=i=>{const a=[];return this.#i({type:n.UNMOUNT,data:{mountPoint:i}},a)};readFile=(i,a="binary",{signal:e}={})=>this.#i({type:n.READ_FILE,data:{path:i,encoding:a}},void 0,e);deleteFile=(i,{signal:a}={})=>this.#i({type:n.DELETE_FILE,data:{path:i}},void 0,a);rename=(i,a,{signal:e}={})=>this.#i({type:n.RENAME,data:{oldPath:i,newPath:a}},void 0,e);createDir=(i,{signal:a}={})=>this.#i({type:n.CREATE_DIR,data:{path:i}},void 0,a);listDir=(i,{signal:a}={})=>this.#i({type:n.LIST_DIR,data:{path:i}},void 0,a);deleteDir=(i,{signal:a}={})=>this.#i({type:n.DELETE_DIR,data:{path:i}},void 0,a)}const J={"3g2":"video/3gpp2","3gp":"video/3gpp","3gpp":"video/3gpp","3mf":"model/3mf",aac:"audio/aac",ac:"application/pkix-attr-cert",adp:"audio/adpcm",adts:"audio/aac",ai:"application/postscript",aml:"application/automationml-aml+xml",amlx:"application/automationml-amlx+zip",amr:"audio/amr",apng:"image/apng",appcache:"text/cache-manifest",appinstaller:"application/appinstaller",appx:"application/appx",appxbundle:"application/appxbundle",asc:"application/pgp-keys",atom:"application/atom+xml",atomcat:"application/atomcat+xml",atomdeleted:"application/atomdeleted+xml",atomsvc:"application/atomsvc+xml",au:"audio/basic",avci:"image/avci",avcs:"image/avcs",avif:"image/avif",aw:"application/applixware",bdoc:"application/bdoc",bin:"application/octet-stream",bmp:"image/bmp",bpk:"application/octet-stream",btf:"image/prs.btif",btif:"image/prs.btif",buffer:"application/octet-stream",ccxml:"application/ccxml+xml",cdfx:"application/cdfx+xml",cdmia:"application/cdmi-capability",cdmic:"application/cdmi-container",cdmid:"application/cdmi-domain",cdmio:"application/cdmi-object",cdmiq:"application/cdmi-queue",cer:"application/pkix-cert",cgm:"image/cgm",cjs:"application/node",class:"application/java-vm",coffee:"text/coffeescript",conf:"text/plain",cpl:"application/cpl+xml",cpt:"application/mac-compactpro",crl:"application/pkix-crl",css:"text/css",csv:"text/csv",cu:"application/cu-seeme",cwl:"application/cwl",cww:"application/prs.cww",davmount:"application/davmount+xml",dbk:"application/docbook+xml",deb:"application/octet-stream",def:"text/plain",deploy:"application/octet-stream",dib:"image/bmp","disposition-notification":"message/disposition-notification",dist:"application/octet-stream",distz:"application/octet-stream",dll:"application/octet-stream",dmg:"application/octet-stream",dms:"application/octet-stream",doc:"application/msword",dot:"application/msword",dpx:"image/dpx",drle:"image/dicom-rle",dsc:"text/prs.lines.tag",dssc:"application/dssc+der",dtd:"application/xml-dtd",dump:"application/octet-stream",dwd:"application/atsc-dwd+xml",ear:"application/java-archive",ecma:"application/ecmascript",elc:"application/octet-stream",emf:"image/emf",eml:"message/rfc822",emma:"application/emma+xml",emotionml:"application/emotionml+xml",eps:"application/postscript",epub:"application/epub+zip",exe:"application/octet-stream",exi:"application/exi",exp:"application/express",exr:"image/aces",ez:"application/andrew-inset",fdf:"application/fdf",fdt:"application/fdt+xml",fits:"image/fits",g3:"image/g3fax",gbr:"application/rpki-ghostbusters",geojson:"application/geo+json",gif:"image/gif",glb:"model/gltf-binary",gltf:"model/gltf+json",gml:"application/gml+xml",gpx:"application/gpx+xml",gram:"application/srgs",grxml:"application/srgs+xml",gxf:"application/gxf",gz:"application/gzip",h261:"video/h261",h263:"video/h263",h264:"video/h264",heic:"image/heic",heics:"image/heic-sequence",heif:"image/heif",heifs:"image/heif-sequence",hej2:"image/hej2k",held:"application/atsc-held+xml",hjson:"application/hjson",hlp:"application/winhlp",hqx:"application/mac-binhex40",hsj2:"image/hsj2",htm:"text/html",html:"text/html",ics:"text/calendar",ief:"image/ief",ifb:"text/calendar",iges:"model/iges",igs:"model/iges",img:"application/octet-stream",in:"text/plain",ini:"text/plain",ink:"application/inkml+xml",inkml:"application/inkml+xml",ipfix:"application/ipfix",iso:"application/octet-stream",its:"application/its+xml",jade:"text/jade",jar:"application/java-archive",jhc:"image/jphc",jls:"image/jls",jp2:"image/jp2",jpe:"image/jpeg",jpeg:"image/jpeg",jpf:"image/jpx",jpg:"image/jpeg",jpg2:"image/jp2",jpgm:"image/jpm",jpgv:"video/jpeg",jph:"image/jph",jpm:"image/jpm",jpx:"image/jpx",js:"text/javascript",json:"application/json",json5:"application/json5",jsonld:"application/ld+json",jsonml:"application/jsonml+json",jsx:"text/jsx",jt:"model/jt",jxr:"image/jxr",jxra:"image/jxra",jxrs:"image/jxrs",jxs:"image/jxs",jxsc:"image/jxsc",jxsi:"image/jxsi",jxss:"image/jxss",kar:"audio/midi",ktx:"image/ktx",ktx2:"image/ktx2",less:"text/less",lgr:"application/lgr+xml",list:"text/plain",litcoffee:"text/coffeescript",log:"text/plain",lostxml:"application/lost+xml",lrf:"application/octet-stream",m1v:"video/mpeg",m21:"application/mp21",m2a:"audio/mpeg",m2v:"video/mpeg",m3a:"audio/mpeg",m4a:"audio/mp4",m4p:"application/mp4",m4s:"video/iso.segment",ma:"application/mathematica",mads:"application/mads+xml",maei:"application/mmt-aei+xml",man:"text/troff",manifest:"text/cache-manifest",map:"application/json",mar:"application/octet-stream",markdown:"text/markdown",mathml:"application/mathml+xml",mb:"application/mathematica",mbox:"application/mbox",md:"text/markdown",mdx:"text/mdx",me:"text/troff",mesh:"model/mesh",meta4:"application/metalink4+xml",metalink:"application/metalink+xml",mets:"application/mets+xml",mft:"application/rpki-manifest",mid:"audio/midi",midi:"audio/midi",mime:"message/rfc822",mj2:"video/mj2",mjp2:"video/mj2",mjs:"text/javascript",mml:"text/mathml",mods:"application/mods+xml",mov:"video/quicktime",mp2:"audio/mpeg",mp21:"application/mp21",mp2a:"audio/mpeg",mp3:"audio/mpeg",mp4:"video/mp4",mp4a:"audio/mp4",mp4s:"application/mp4",mp4v:"video/mp4",mpd:"application/dash+xml",mpe:"video/mpeg",mpeg:"video/mpeg",mpf:"application/media-policy-dataset+xml",mpg:"video/mpeg",mpg4:"video/mp4",mpga:"audio/mpeg",mpp:"application/dash-patch+xml",mrc:"application/marc",mrcx:"application/marcxml+xml",ms:"text/troff",mscml:"application/mediaservercontrol+xml",msh:"model/mesh",msi:"application/octet-stream",msix:"application/msix",msixbundle:"application/msixbundle",msm:"application/octet-stream",msp:"application/octet-stream",mtl:"model/mtl",musd:"application/mmt-usd+xml",mxf:"application/mxf",mxmf:"audio/mobile-xmf",mxml:"application/xv+xml",n3:"text/n3",nb:"application/mathematica",nq:"application/n-quads",nt:"application/n-triples",obj:"model/obj",oda:"application/oda",oga:"audio/ogg",ogg:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",omdoc:"application/omdoc+xml",onepkg:"application/onenote",onetmp:"application/onenote",onetoc:"application/onenote",onetoc2:"application/onenote",opf:"application/oebps-package+xml",opus:"audio/ogg",otf:"font/otf",owl:"application/rdf+xml",oxps:"application/oxps",p10:"application/pkcs10",p7c:"application/pkcs7-mime",p7m:"application/pkcs7-mime",p7s:"application/pkcs7-signature",p8:"application/pkcs8",pdf:"application/pdf",pfr:"application/font-tdpfr",pgp:"application/pgp-encrypted",pkg:"application/octet-stream",pki:"application/pkixcmp",pkipath:"application/pkix-pkipath",pls:"application/pls+xml",png:"image/png",prc:"model/prc",prf:"application/pics-rules",provx:"application/provenance+xml",ps:"application/postscript",pskcxml:"application/pskc+xml",pti:"image/prs.pti",qt:"video/quicktime",raml:"application/raml+yaml",rapd:"application/route-apd+xml",rdf:"application/rdf+xml",relo:"application/p2p-overlay+xml",rif:"application/reginfo+xml",rl:"application/resource-lists+xml",rld:"application/resource-lists-diff+xml",rmi:"audio/midi",rnc:"application/relax-ng-compact-syntax",rng:"application/xml",roa:"application/rpki-roa",roff:"text/troff",rq:"application/sparql-query",rs:"application/rls-services+xml",rsat:"application/atsc-rsat+xml",rsd:"application/rsd+xml",rsheet:"application/urc-ressheet+xml",rss:"application/rss+xml",rtf:"text/rtf",rtx:"text/richtext",rusd:"application/route-usd+xml",s3m:"audio/s3m",sbml:"application/sbml+xml",scq:"application/scvp-cv-request",scs:"application/scvp-cv-response",sdp:"application/sdp",senmlx:"application/senml+xml",sensmlx:"application/sensml+xml",ser:"application/java-serialized-object",setpay:"application/set-payment-initiation",setreg:"application/set-registration-initiation",sgi:"image/sgi",sgm:"text/sgml",sgml:"text/sgml",shex:"text/shex",shf:"application/shf+xml",shtml:"text/html",sieve:"application/sieve",sig:"application/pgp-signature",sil:"audio/silk",silo:"model/mesh",siv:"application/sieve",slim:"text/slim",slm:"text/slim",sls:"application/route-s-tsid+xml",smi:"application/smil+xml",smil:"application/smil+xml",snd:"audio/basic",so:"application/octet-stream",spdx:"text/spdx",spp:"application/scvp-vp-response",spq:"application/scvp-vp-request",spx:"audio/ogg",sql:"application/sql",sru:"application/sru+xml",srx:"application/sparql-results+xml",ssdl:"application/ssdl+xml",ssml:"application/ssml+xml",stk:"application/hyperstudio",stl:"model/stl",stpx:"model/step+xml",stpxz:"model/step-xml+zip",stpz:"model/step+zip",styl:"text/stylus",stylus:"text/stylus",svg:"image/svg+xml",svgz:"image/svg+xml",swidtag:"application/swid+xml",t:"text/troff",t38:"image/t38",td:"application/urc-targetdesc+xml",tei:"application/tei+xml",teicorpus:"application/tei+xml",text:"text/plain",tfi:"application/thraud+xml",tfx:"image/tiff-fx",tif:"image/tiff",tiff:"image/tiff",toml:"application/toml",tr:"text/troff",trig:"application/trig",ts:"video/mp2t",tsd:"application/timestamped-data",tsv:"text/tab-separated-values",ttc:"font/collection",ttf:"font/ttf",ttl:"text/turtle",ttml:"application/ttml+xml",txt:"text/plain",u3d:"model/u3d",u8dsn:"message/global-delivery-status",u8hdr:"message/global-headers",u8mdn:"message/global-disposition-notification",u8msg:"message/global",ubj:"application/ubjson",uri:"text/uri-list",uris:"text/uri-list",urls:"text/uri-list",vcard:"text/vcard",vrml:"model/vrml",vtt:"text/vtt",vxml:"application/voicexml+xml",war:"application/java-archive",wasm:"application/wasm",wav:"audio/wav",weba:"audio/webm",webm:"video/webm",webmanifest:"application/manifest+json",webp:"image/webp",wgsl:"text/wgsl",wgt:"application/widget",wif:"application/watcherinfo+xml",wmf:"image/wmf",woff:"font/woff",woff2:"font/woff2",wrl:"model/vrml",wsdl:"application/wsdl+xml",wspolicy:"application/wspolicy+xml",x3d:"model/x3d+xml",x3db:"model/x3d+fastinfoset",x3dbz:"model/x3d+binary",x3dv:"model/x3d-vrml",x3dvz:"model/x3d+vrml",x3dz:"model/x3d+xml",xaml:"application/xaml+xml",xav:"application/xcap-att+xml",xca:"application/xcap-caps+xml",xcs:"application/calendar+xml",xdf:"application/xcap-diff+xml",xdssc:"application/dssc+xml",xel:"application/xcap-el+xml",xenc:"application/xenc+xml",xer:"application/patch-ops-error+xml",xfdf:"application/xfdf",xht:"application/xhtml+xml",xhtml:"application/xhtml+xml",xhvml:"application/xv+xml",xlf:"application/xliff+xml",xm:"audio/xm",xml:"text/xml",xns:"application/xcap-ns+xml",xop:"application/xop+xml",xpl:"application/xproc+xml",xsd:"application/xml",xsf:"application/prs.xsf+xml",xsl:"application/xml",xslt:"application/xml",xspf:"application/xspf+xml",xvm:"application/xv+xml",xvml:"application/xv+xml",yaml:"text/yaml",yang:"application/yang",yin:"application/yin+xml",yml:"text/yaml",zip:"application/zip"};function K(t){let i=(""+t).trim().toLowerCase(),a=i.lastIndexOf(".");return J[~a?i.substring(++a):i]}const bi=t=>{let i=["B","KB","MB","GB","PB"],a=0;for(;t>1024;)t/=1024,a++;let e=i[a];return t.toFixed(1)+" "+e},Ei=()=>!0;function Y(t,{autoplay:i}){async function a(){i&&await t.play()}return t.addEventListener("loadeddata",a),{destroy(){t.removeEventListener("loadeddata",a)}}}async function ji(){const t=new F,i="https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm";return await t.load({coreURL:await k(`${i}/ffmpeg-core.js`,"text/javascript"),wasmURL:await k(`${i}/ffmpeg-core.wasm`,"application/wasm")}),t}async function wi(t,i,a,e){const p=e.src,c=K(e.src)||"video/mp4",f=await k(p,c),v=await(await fetch(f)).blob(),g=Q(c)||"mp4",s=`input.${g}`,x=`output.${g}`;try{if(i===0&&a===0)return v;await t.writeFile(s,new Uint8Array(await v.arrayBuffer()));let u=["-i",s,...i!==0?["-ss",i.toString()]:[],...a!==0?["-to",a.toString()]:[],"-c:a","copy",x];await t.exec(u);const E=await t.readFile(x);return new Blob([E],{type:`video/${g}`})}catch(u){return console.error("Error initializing FFmpeg:",u),v}}const Q=t=>({"video/mp4":"mp4","video/webm":"webm","video/ogg":"ogv","video/quicktime":"mov","video/x-msvideo":"avi","video/x-matroska":"mkv","video/mpeg":"mpeg","video/3gpp":"3gp","video/3gpp2":"3g2","video/h261":"h261","video/h263":"h263","video/h264":"h264","video/jpeg":"jpgv","video/jpm":"jpm","video/mj2":"mj2","video/mpv":"mpv","video/vnd.ms-playready.media.pyv":"pyv","video/vnd.uvvu.mp4":"uvu","video/vnd.vivo":"viv","video/x-f4v":"f4v","video/x-fli":"fli","video/x-flv":"flv","video/x-m4v":"m4v","video/x-ms-asf":"asf","video/x-ms-wm":"wm","video/x-ms-wmv":"wmv","video/x-ms-wmx":"wmx","video/x-ms-wvx":"wvx","video/x-sgi-movie":"movie","video/x-smv":"smv"})[t]||null,{SvelteComponent:Z,action_destroyer:$,add_render_callback:ii,assign:L,attr:j,binding_callbacks:ti,bubble:ai,create_slot:ei,detach:_,element:D,exclude_internal_props:I,flush:b,get_all_dirty_from_scope:oi,get_slot_changes:li,init:pi,insert:R,is_function:si,listen:h,raf:ni,run_all:mi,safe_not_equal:ci,space:di,src_url_equal:O,toggle_class:T,transition_in:ri,transition_out:xi,update_slot_base:ui}=window.__gradio__svelte__internal,{createEventDispatcher:fi}=window.__gradio__svelte__internal;function gi(t){let i,a,e,p,c,f=!1,d,v=!0,g,s,x,u;const E=t[17].default,r=ei(E,t,t[16],null);function w(){cancelAnimationFrame(d),e.paused||(d=ni(w),f=!0),t[19].call(e)}return{c(){i=D("div"),i.innerHTML='<span class="load-wrap svelte-1y0s5gv"><span class="loader svelte-1y0s5gv"></span></span>',a=di(),e=D("video"),r&&r.c(),j(i,"class","overlay svelte-1y0s5gv"),T(i,"hidden",!t[10]),O(e.src,p=t[11])||j(e,"src",p),e.muted=t[4],e.playsInline=t[5],j(e,"preload",t[6]),e.autoplay=t[7],e.controls=t[8],e.loop=t[9],j(e,"data-testid",c=t[13]["data-testid"]),j(e,"crossorigin","anonymous"),t[1]===void 0&&ii(()=>t[20].call(e))},m(l,m){R(l,i,m),R(l,a,m),R(l,e,m),r&&r.m(e,null),t[22](e),s=!0,x||(u=[h(e,"loadeddata",t[12].bind(null,"loadeddata")),h(e,"click",t[12].bind(null,"click")),h(e,"play",t[12].bind(null,"play")),h(e,"pause",t[12].bind(null,"pause")),h(e,"ended",t[12].bind(null,"ended")),h(e,"mouseover",t[12].bind(null,"mouseover")),h(e,"mouseout",t[12].bind(null,"mouseout")),h(e,"focus",t[12].bind(null,"focus")),h(e,"blur",t[12].bind(null,"blur")),h(e,"load",t[18]),h(e,"timeupdate",w),h(e,"durationchange",t[20]),h(e,"play",t[21]),h(e,"pause",t[21]),$(g=Y.call(null,e,{autoplay:t[7]??!1}))],x=!0)},p(l,[m]){(!s||m&1024)&&T(i,"hidden",!l[10]),r&&r.p&&(!s||m&65536)&&ui(r,E,l,l[16],s?li(E,l[16],m,null):oi(l[16]),null),(!s||m&2048&&!O(e.src,p=l[11]))&&j(e,"src",p),(!s||m&16)&&(e.muted=l[4]),(!s||m&32)&&(e.playsInline=l[5]),(!s||m&64)&&j(e,"preload",l[6]),(!s||m&128)&&(e.autoplay=l[7]),(!s||m&256)&&(e.controls=l[8]),(!s||m&512)&&(e.loop=l[9]),(!s||m&8192&&c!==(c=l[13]["data-testid"]))&&j(e,"data-testid",c),!f&&m&1&&!isNaN(l[0])&&(e.currentTime=l[0]),f=!1,m&4&&v!==(v=l[2])&&e[v?"pause":"play"](),g&&si(g.update)&&m&128&&g.update.call(null,{autoplay:l[7]??!1})},i(l){s||(ri(r,l),s=!0)},o(l){xi(r,l),s=!1},d(l){l&&(_(i),_(a),_(e)),r&&r.d(l),t[22](null),x=!1,mi(u)}}}function hi(t,i,a){let{$$slots:e={},$$scope:p}=i,{src:c=void 0}=i,{muted:f=void 0}=i,{playsinline:d=void 0}=i,{preload:v=void 0}=i,{autoplay:g=void 0}=i,{controls:s=void 0}=i,{currentTime:x=void 0}=i,{duration:u=void 0}=i,{paused:E=void 0}=i,{node:r=void 0}=i,{loop:w}=i,{processingVideo:l=!1}=i,m,y;const A=fi();function N(o){ai.call(this,t,o)}function U(){x=this.currentTime,a(0,x)}function q(){u=this.duration,a(1,u)}function z(){E=this.paused,a(2,E)}function B(o){ti[o?"unshift":"push"](()=>{r=o,a(3,r)})}return t.$$set=o=>{a(13,i=L(L({},i),I(o))),"src"in o&&a(14,c=o.src),"muted"in o&&a(4,f=o.muted),"playsinline"in o&&a(5,d=o.playsinline),"preload"in o&&a(6,v=o.preload),"autoplay"in o&&a(7,g=o.autoplay),"controls"in o&&a(8,s=o.controls),"currentTime"in o&&a(0,x=o.currentTime),"duration"in o&&a(1,u=o.duration),"paused"in o&&a(2,E=o.paused),"node"in o&&a(3,r=o.node),"loop"in o&&a(9,w=o.loop),"processingVideo"in o&&a(10,l=o.processingVideo),"$$scope"in o&&a(16,p=o.$$scope)},t.$$.update=()=>{if(t.$$.dirty&49152){a(11,m=c),a(15,y=c);const o=c;S(o).then(C=>{y===o&&a(11,m=C)})}},i=I(i),[x,u,E,r,f,d,v,g,s,w,l,m,A,i,c,y,p,e,N,U,q,z,B]}class yi extends Z{constructor(i){super(),pi(this,i,hi,gi,ci,{src:14,muted:4,playsinline:5,preload:6,autoplay:7,controls:8,currentTime:0,duration:1,paused:2,node:3,loop:9,processingVideo:10})}get src(){return this.$$.ctx[14]}set src(i){this.$$set({src:i}),b()}get muted(){return this.$$.ctx[4]}set muted(i){this.$$set({muted:i}),b()}get playsinline(){return this.$$.ctx[5]}set playsinline(i){this.$$set({playsinline:i}),b()}get preload(){return this.$$.ctx[6]}set preload(i){this.$$set({preload:i}),b()}get autoplay(){return this.$$.ctx[7]}set autoplay(i){this.$$set({autoplay:i}),b()}get controls(){return this.$$.ctx[8]}set controls(i){this.$$set({controls:i}),b()}get currentTime(){return this.$$.ctx[0]}set currentTime(i){this.$$set({currentTime:i}),b()}get duration(){return this.$$.ctx[1]}set duration(i){this.$$set({duration:i}),b()}get paused(){return this.$$.ctx[2]}set paused(i){this.$$set({paused:i}),b()}get node(){return this.$$.ctx[3]}set node(i){this.$$set({node:i}),b()}get loop(){return this.$$.ctx[9]}set loop(i){this.$$set({loop:i}),b()}get processingVideo(){return this.$$.ctx[10]}set processingVideo(i){this.$$set({processingVideo:i}),b()}}export{yi as V,Ei as a,ji as b,Y as l,bi as p,wi as t};
//# sourceMappingURL=Video-BdbQAxlX.js.map