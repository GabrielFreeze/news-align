import{C as he,E as X,L as be}from"./index-Rh_KqTRc.js";import{s as Pe,t as g,p as xe,L as Te,i as Ve,f as we,u as ye,e as ve,v as Xe,h as H,E as Z}from"./Index-_i8s1y64.js";import{cssLanguage as K,css as ke}from"./index-CU9gjalZ.js";import{typescriptLanguage as $e,jsxLanguage as _e,tsxLanguage as qe,javascriptLanguage as J,javascript as Ce}from"./index-CzPZhrVH.js";import"./index-BYvoOQkn.js";import"./svelte/svelte.js";import"./Index-DkaKPSWq.js";import"./Check-CZUQOzJl.js";import"./Copy-B6RcHnoK.js";import"./Button-Bmjem-ox.js";import"./Download-DVtk-Jv3.js";import"./DownloadLink-DXpP5rj8.js";import"./file-url-5ekbgBR0.js";import"./BlockLabel-D-wF3X_C.js";import"./Empty-B7gLxX4w.js";import"./Example-Wp-_4AVX.js";const Ae=54,Qe=1,Ye=55,Me=2,Re=56,Ee=3,B=4,Ze=5,y=6,ee=7,te=8,ae=9,le=10,Be=11,We=12,ze=13,$=57,De=14,W=58,re=20,Ne=22,ne=23,Ge=24,Q=26,se=27,Ie=28,je=31,Ue=34,Le=36,Fe=37,He=0,Ke=1,Je={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0,menuitem:!0},et={dd:!0,li:!0,optgroup:!0,option:!0,p:!0,rp:!0,rt:!0,tbody:!0,td:!0,tfoot:!0,th:!0,tr:!0},z={dd:{dd:!0,dt:!0},dt:{dd:!0,dt:!0},li:{li:!0},option:{option:!0,optgroup:!0},optgroup:{optgroup:!0},p:{address:!0,article:!0,aside:!0,blockquote:!0,dir:!0,div:!0,dl:!0,fieldset:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,menu:!0,nav:!0,ol:!0,p:!0,pre:!0,section:!0,table:!0,ul:!0},rp:{rp:!0,rt:!0},rt:{rp:!0,rt:!0},tbody:{tbody:!0,tfoot:!0},td:{td:!0,th:!0},tfoot:{tbody:!0},th:{td:!0,th:!0},thead:{tbody:!0,tfoot:!0},tr:{tr:!0}};function tt(e){return e==45||e==46||e==58||e>=65&&e<=90||e==95||e>=97&&e<=122||e>=161}function oe(e){return e==9||e==10||e==13||e==32}let D=null,N=null,G=0;function Y(e,t){let l=e.pos+t;if(G==l&&N==e)return D;let a=e.peek(t);for(;oe(a);)a=e.peek(++t);let r="";for(;tt(a);)r+=String.fromCharCode(a),a=e.peek(++t);return N=e,G=l,D=r?r.toLowerCase():a==at||a==lt?void 0:null}const ue=60,v=62,M=47,at=63,lt=33,rt=45;function I(e,t){this.name=e,this.parent=t,this.hash=t?t.hash:0;for(let l=0;l<e.length;l++)this.hash+=(this.hash<<4)+e.charCodeAt(l)+(e.charCodeAt(l)<<8)}const nt=[y,le,ee,te,ae],st=new he({start:null,shift(e,t,l,a){return nt.indexOf(t)>-1?new I(Y(a,1)||"",e):e},reduce(e,t){return t==re&&e?e.parent:e},reuse(e,t,l,a){let r=t.type.id;return r==y||r==Le?new I(Y(a,1)||"",e):e},hash(e){return e?e.hash:0},strict:!1}),ot=new X((e,t)=>{if(e.next!=ue){e.next<0&&t.context&&e.acceptToken($);return}e.advance();let l=e.next==M;l&&e.advance();let a=Y(e,0);if(a===void 0)return;if(!a)return e.acceptToken(l?De:y);let r=t.context?t.context.name:null;if(l){if(a==r)return e.acceptToken(Be);if(r&&et[r])return e.acceptToken($,-2);if(t.dialectEnabled(He))return e.acceptToken(We);for(let n=t.context;n;n=n.parent)if(n.name==a)return;e.acceptToken(ze)}else{if(a=="script")return e.acceptToken(ee);if(a=="style")return e.acceptToken(te);if(a=="textarea")return e.acceptToken(ae);if(Je.hasOwnProperty(a))return e.acceptToken(le);r&&z[r]&&z[r][a]?e.acceptToken($,-1):e.acceptToken(y)}},{contextual:!0}),ut=new X(e=>{for(let t=0,l=0;;l++){if(e.next<0){l&&e.acceptToken(W);break}if(e.next==rt)t++;else if(e.next==v&&t>=2){l>3&&e.acceptToken(W,-2);break}else t=0;e.advance()}});function it(e){for(;e;e=e.parent)if(e.name=="svg"||e.name=="math")return!0;return!1}const Ot=new X((e,t)=>{if(e.next==M&&e.peek(1)==v){let l=t.dialectEnabled(Ke)||it(t.context);e.acceptToken(l?Ze:B,2)}else e.next==v&&e.acceptToken(B,1)});function R(e,t,l){let a=2+e.length;return new X(r=>{for(let n=0,o=0,u=0;;u++){if(r.next<0){u&&r.acceptToken(t);break}if(n==0&&r.next==ue||n==1&&r.next==M||n>=2&&n<a&&r.next==e.charCodeAt(n-2))n++,o++;else if((n==2||n==a)&&oe(r.next))o++;else if(n==a&&r.next==v){u>o?r.acceptToken(t,-o):r.acceptToken(l,-(o-2));break}else if((r.next==10||r.next==13)&&u){r.acceptToken(t,1);break}else n=o=0;r.advance()}})}const ct=R("script",Ae,Qe),dt=R("style",Ye,Me),pt=R("textarea",Re,Ee),mt=Pe({"Text RawText":g.content,"StartTag StartCloseTag SelfClosingEndTag EndTag":g.angleBracket,TagName:g.tagName,"MismatchedCloseTag/TagName":[g.tagName,g.invalid],AttributeName:g.attributeName,"AttributeValue UnquotedAttributeValue":g.attributeValue,Is:g.definitionOperator,"EntityReference CharacterReference":g.character,Comment:g.blockComment,ProcessingInst:g.processingInstruction,DoctypeDecl:g.documentMeta}),ft=be.deserialize({version:14,states:",xOVO!rOOO!WQ#tO'#CqO!]Q#tO'#CzO!bQ#tO'#C}O!gQ#tO'#DQO!lQ#tO'#DSO!qOaO'#CpO!|ObO'#CpO#XOdO'#CpO$eO!rO'#CpOOO`'#Cp'#CpO$lO$fO'#DTO$tQ#tO'#DVO$yQ#tO'#DWOOO`'#Dk'#DkOOO`'#DY'#DYQVO!rOOO%OQ&rO,59]O%WQ&rO,59fO%`Q&rO,59iO%hQ&rO,59lO%sQ&rO,59nOOOa'#D^'#D^O%{OaO'#CxO&WOaO,59[OOOb'#D_'#D_O&`ObO'#C{O&kObO,59[OOOd'#D`'#D`O&sOdO'#DOO'OOdO,59[OOO`'#Da'#DaO'WO!rO,59[O'_Q#tO'#DROOO`,59[,59[OOOp'#Db'#DbO'dO$fO,59oOOO`,59o,59oO'lQ#|O,59qO'qQ#|O,59rOOO`-E7W-E7WO'vQ&rO'#CsOOQW'#DZ'#DZO(UQ&rO1G.wOOOa1G.w1G.wO(^Q&rO1G/QOOOb1G/Q1G/QO(fQ&rO1G/TOOOd1G/T1G/TO(nQ&rO1G/WOOO`1G/W1G/WOOO`1G/Y1G/YO(yQ&rO1G/YOOOa-E7[-E7[O)RQ#tO'#CyOOO`1G.v1G.vOOOb-E7]-E7]O)WQ#tO'#C|OOOd-E7^-E7^O)]Q#tO'#DPOOO`-E7_-E7_O)bQ#|O,59mOOOp-E7`-E7`OOO`1G/Z1G/ZOOO`1G/]1G/]OOO`1G/^1G/^O)gQ,UO,59_OOQW-E7X-E7XOOOa7+$c7+$cOOOb7+$l7+$lOOOd7+$o7+$oOOO`7+$r7+$rOOO`7+$t7+$tO)rQ#|O,59eO)wQ#|O,59hO)|Q#|O,59kOOO`1G/X1G/XO*RO7[O'#CvO*dOMhO'#CvOOQW1G.y1G.yOOO`1G/P1G/POOO`1G/S1G/SOOO`1G/V1G/VOOOO'#D['#D[O*uO7[O,59bOOQW,59b,59bOOOO'#D]'#D]O+WOMhO,59bOOOO-E7Y-E7YOOQW1G.|1G.|OOOO-E7Z-E7Z",stateData:"+s~O!^OS~OUSOVPOWQOXROYTO[]O][O^^O`^Oa^Ob^Oc^Ox^O{_O!dZO~OfaO~OfbO~OfcO~OfdO~OfeO~O!WfOPlP!ZlP~O!XiOQoP!ZoP~O!YlORrP!ZrP~OUSOVPOWQOXROYTOZqO[]O][O^^O`^Oa^Ob^Oc^Ox^O!dZO~O!ZrO~P#dO![sO!euO~OfvO~OfwO~OS|OhyO~OS!OOhyO~OS!QOhyO~OS!SOT!TOhyO~OS!TOhyO~O!WfOPlX!ZlX~OP!WO!Z!XO~O!XiOQoX!ZoX~OQ!ZO!Z!XO~O!YlORrX!ZrX~OR!]O!Z!XO~O!Z!XO~P#dOf!_O~O![sO!e!aO~OS!bO~OS!cO~Oi!dOSgXhgXTgX~OS!fOhyO~OS!gOhyO~OS!hOhyO~OS!iOT!jOhyO~OS!jOhyO~Of!kO~Of!lO~Of!mO~OS!nO~Ok!qO!`!oO!b!pO~OS!rO~OS!sO~OS!tO~Oa!uOb!uOc!uO!`!wO!a!uO~Oa!xOb!xOc!xO!b!wO!c!xO~Oa!uOb!uOc!uO!`!{O!a!uO~Oa!xOb!xOc!xO!b!{O!c!xO~OT~bac!dx{!d~",goto:"%p!`PPPPPPPPPPPPPPPPPPPP!a!gP!mPP!yP!|#P#S#Y#]#`#f#i#l#r#x!aP!a!aP$O$U$l$r$x%O%U%[%bPPPPPPPP%hX^OX`pXUOX`pezabcde{}!P!R!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ}bQ!PcQ!RdQ!UeZ!e{}!P!R!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",nodeNames:"⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",maxTerm:67,context:st,nodeProps:[["closedBy",-10,1,2,3,7,8,9,10,11,12,13,"EndTag",6,"EndTag SelfClosingEndTag",-4,21,30,33,36,"CloseTag"],["openedBy",4,"StartTag StartCloseTag",5,"StartTag",-4,29,32,35,37,"OpenTag"],["group",-9,14,17,18,19,20,39,40,41,42,"Entity",16,"Entity TextContent",-3,28,31,34,"TextContent Entity"]],propSources:[mt],skippedNodes:[0],repeatNodeCount:9,tokenData:"!<p!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs3_sv-_vw3}wxHYx}-_}!OH{!O!P-_!P!Q$q!Q![-_![!]Mz!]!^-_!^!_!$S!_!`!;x!`!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4U-_4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!Z$|c`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bX`P!a`!cpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UV`P!cpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pT`POv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!cpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({W`P!a`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!a`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!a`!cpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYkWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]``P!a`!cp!^^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/ebhSkWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0rXhSqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0mS1bP;=`<%l0m[1hP;=`<%l/^!V1vchS`P!a`!cpOq&Xqr1krs&}sv1kvw0mwx(tx!P1k!P!Q&X!Q!^1k!^!_*V!_!a&X!a#s1k#s$f&X$f;'S1k;'S;=`3R<%l?Ah1k?Ah?BY&X?BY?Mn1k?MnO&X!V3UP;=`<%l1k!_3[P;=`<%l-_!Z3hV!`h`P!cpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_4WihSkWc!ROX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst>]tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^/^!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!Z5zbkWOX5uXZ7SZ[5u[^7S^p5uqr5urs7Sst+Ptw5uwx7Sx!]5u!]!^7w!^!a7S!a#S5u#S#T7S#T;'S5u;'S;=`8n<%lO5u!R7VVOp7Sqs7St!]7S!]!^7l!^;'S7S;'S;=`7q<%lO7S!R7qOa!R!R7tP;=`<%l7S!Z8OYkWa!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z8qP;=`<%l5u!_8{ihSkWOX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst/^tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^:j!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!_:sbhSkWa!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V<QchSOp7Sqr;{rs7Sst0mtw;{wx7Sx!P;{!P!Q7S!Q!];{!]!^=]!^!a7S!a#s;{#s$f7S$f;'S;{;'S;=`>P<%l?Ah;{?Ah?BY7S?BY?Mn;{?MnO7S!V=dXhSa!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!V>SP;=`<%l;{!_>YP;=`<%l8t!_>dhhSkWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^/^!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!Z@TakWOX@OXZAYZ[@O[^AY^p@Oqr@OrsAYsw@OwxAYx!]@O!]!^Az!^!aAY!a#S@O#S#TAY#T;'S@O;'S;=`Bq<%lO@O!RA]UOpAYq!]AY!]!^Ao!^;'SAY;'S;=`At<%lOAY!RAtOb!R!RAwP;=`<%lAY!ZBRYkWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZBtP;=`<%l@O!_COhhSkWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^Dj!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!_DsbhSkWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VFQbhSOpAYqrE{rsAYswE{wxAYx!PE{!P!QAY!Q!]E{!]!^GY!^!aAY!a#sE{#s$fAY$f;'SE{;'S;=`G|<%l?AhE{?Ah?BYAY?BY?MnE{?MnOAY!VGaXhSb!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!VHPP;=`<%lE{!_HVP;=`<%lBw!ZHcW!bx`P!a`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aIYlhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OKQ!O!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aK_khS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!`&X!`!aMS!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!TM_X`P!a`!cp!eQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!aNZ!ZhSfQ`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMz!O!PMz!P!Q$q!Q![Mz![!]Mz!]!^-_!^!_*V!_!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f$}-_$}%OMz%O%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4UMz4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Je-_$Je$JgMz$Jg$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!a!$PP;=`<%lMz!R!$ZY!a`!cpOq*Vqr!$yrs(Vsv*Vwx)ex!a*V!a!b!4t!b;'S*V;'S;=`*s<%lO*V!R!%Q]!a`!cpOr*Vrs(Vsv*Vwx)ex}*V}!O!%y!O!f*V!f!g!']!g#W*V#W#X!0`#X;'S*V;'S;=`*s<%lO*V!R!&QX!a`!cpOr*Vrs(Vsv*Vwx)ex}*V}!O!&m!O;'S*V;'S;=`*s<%lO*V!R!&vV!a`!cp!dPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!'dX!a`!cpOr*Vrs(Vsv*Vwx)ex!q*V!q!r!(P!r;'S*V;'S;=`*s<%lO*V!R!(WX!a`!cpOr*Vrs(Vsv*Vwx)ex!e*V!e!f!(s!f;'S*V;'S;=`*s<%lO*V!R!(zX!a`!cpOr*Vrs(Vsv*Vwx)ex!v*V!v!w!)g!w;'S*V;'S;=`*s<%lO*V!R!)nX!a`!cpOr*Vrs(Vsv*Vwx)ex!{*V!{!|!*Z!|;'S*V;'S;=`*s<%lO*V!R!*bX!a`!cpOr*Vrs(Vsv*Vwx)ex!r*V!r!s!*}!s;'S*V;'S;=`*s<%lO*V!R!+UX!a`!cpOr*Vrs(Vsv*Vwx)ex!g*V!g!h!+q!h;'S*V;'S;=`*s<%lO*V!R!+xY!a`!cpOr!+qrs!,hsv!+qvw!-Swx!.[x!`!+q!`!a!/j!a;'S!+q;'S;=`!0Y<%lO!+qq!,mV!cpOv!,hvx!-Sx!`!,h!`!a!-q!a;'S!,h;'S;=`!.U<%lO!,hP!-VTO!`!-S!`!a!-f!a;'S!-S;'S;=`!-k<%lO!-SP!-kO{PP!-nP;=`<%l!-Sq!-xS!cp{POv(Vx;'S(V;'S;=`(h<%lO(Vq!.XP;=`<%l!,ha!.aX!a`Or!.[rs!-Ssv!.[vw!-Sw!`!.[!`!a!.|!a;'S!.[;'S;=`!/d<%lO!.[a!/TT!a`{POr)esv)ew;'S)e;'S;=`)y<%lO)ea!/gP;=`<%l!.[!R!/sV!a`!cp{POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!0]P;=`<%l!+q!R!0gX!a`!cpOr*Vrs(Vsv*Vwx)ex#c*V#c#d!1S#d;'S*V;'S;=`*s<%lO*V!R!1ZX!a`!cpOr*Vrs(Vsv*Vwx)ex#V*V#V#W!1v#W;'S*V;'S;=`*s<%lO*V!R!1}X!a`!cpOr*Vrs(Vsv*Vwx)ex#h*V#h#i!2j#i;'S*V;'S;=`*s<%lO*V!R!2qX!a`!cpOr*Vrs(Vsv*Vwx)ex#m*V#m#n!3^#n;'S*V;'S;=`*s<%lO*V!R!3eX!a`!cpOr*Vrs(Vsv*Vwx)ex#d*V#d#e!4Q#e;'S*V;'S;=`*s<%lO*V!R!4XX!a`!cpOr*Vrs(Vsv*Vwx)ex#X*V#X#Y!+q#Y;'S*V;'S;=`*s<%lO*V!R!4{Y!a`!cpOr!4trs!5ksv!4tvw!6Vwx!8]x!a!4t!a!b!:]!b;'S!4t;'S;=`!;r<%lO!4tq!5pV!cpOv!5kvx!6Vx!a!5k!a!b!7W!b;'S!5k;'S;=`!8V<%lO!5kP!6YTO!a!6V!a!b!6i!b;'S!6V;'S;=`!7Q<%lO!6VP!6lTO!`!6V!`!a!6{!a;'S!6V;'S;=`!7Q<%lO!6VP!7QOxPP!7TP;=`<%l!6Vq!7]V!cpOv!5kvx!6Vx!`!5k!`!a!7r!a;'S!5k;'S;=`!8V<%lO!5kq!7yS!cpxPOv(Vx;'S(V;'S;=`(h<%lO(Vq!8YP;=`<%l!5ka!8bX!a`Or!8]rs!6Vsv!8]vw!6Vw!a!8]!a!b!8}!b;'S!8];'S;=`!:V<%lO!8]a!9SX!a`Or!8]rs!6Vsv!8]vw!6Vw!`!8]!`!a!9o!a;'S!8];'S;=`!:V<%lO!8]a!9vT!a`xPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!:YP;=`<%l!8]!R!:dY!a`!cpOr!4trs!5ksv!4tvw!6Vwx!8]x!`!4t!`!a!;S!a;'S!4t;'S;=`!;r<%lO!4t!R!;]V!a`!cpxPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;uP;=`<%l!4t!V!<TXiS`P!a`!cpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",tokenizers:[ct,dt,pt,Ot,ot,ut,0,1,2,3,4,5],topRules:{Document:[0,15]},dialects:{noMatch:0,selfClosing:485},tokenPrec:487});function ie(e,t){let l=Object.create(null);for(let a of e.getChildren(ne)){let r=a.getChild(Ge),n=a.getChild(Q)||a.getChild(se);r&&(l[t.read(r.from,r.to)]=n?n.type.id==Q?t.read(n.from+1,n.to-1):t.read(n.from,n.to):"")}return l}function j(e,t){let l=e.getChild(Ne);return l?t.read(l.from,l.to):" "}function _(e,t,l){let a;for(let r of l)if(!r.attrs||r.attrs(a||(a=ie(e.node.parent.firstChild,t))))return{parser:r.parser};return null}function Oe(e=[],t=[]){let l=[],a=[],r=[],n=[];for(let u of e)(u.tag=="script"?l:u.tag=="style"?a:u.tag=="textarea"?r:n).push(u);let o=t.length?Object.create(null):null;for(let u of t)(o[u.name]||(o[u.name]=[])).push(u);return xe((u,c)=>{let f=u.type.id;if(f==Ie)return _(u,c,l);if(f==je)return _(u,c,a);if(f==Ue)return _(u,c,r);if(f==re&&n.length){let O=u.node,i=O.firstChild,d=i&&j(i,c),m;if(d){for(let p of n)if(p.tag==d&&(!p.attrs||p.attrs(m||(m=ie(O,c))))){let h=O.lastChild;return{parser:p.parser,overlay:[{from:i.to,to:h.type.id==Fe?h.from:O.to}]}}}}if(o&&f==ne){let O=u.node,i;if(i=O.firstChild){let d=o[c.read(i.from,i.to)];if(d)for(let m of d){if(m.tagName&&m.tagName!=j(O.parent,c))continue;let p=O.lastChild;if(p.type.id==Q){let h=p.from+1,P=p.lastChild,V=p.to-(P&&P.isError?0:1);if(V>h)return{parser:m.parser,overlay:[{from:h,to:V}]}}else if(p.type.id==se)return{parser:m.parser,overlay:[{from:p.from,to:p.to}]}}}}return null})}const x=["_blank","_self","_top","_parent"],q=["ascii","utf-8","utf-16","latin1","latin1"],C=["get","post","put","delete"],A=["application/x-www-form-urlencoded","multipart/form-data","text/plain"],S=["true","false"],s={},St={a:{attrs:{href:null,ping:null,type:null,media:null,target:x,hreflang:null}},abbr:s,address:s,area:{attrs:{alt:null,coords:null,href:null,target:null,ping:null,media:null,hreflang:null,type:null,shape:["default","rect","circle","poly"]}},article:s,aside:s,audio:{attrs:{src:null,mediagroup:null,crossorigin:["anonymous","use-credentials"],preload:["none","metadata","auto"],autoplay:["autoplay"],loop:["loop"],controls:["controls"]}},b:s,base:{attrs:{href:null,target:x}},bdi:s,bdo:s,blockquote:{attrs:{cite:null}},body:s,br:s,button:{attrs:{form:null,formaction:null,name:null,value:null,autofocus:["autofocus"],disabled:["autofocus"],formenctype:A,formmethod:C,formnovalidate:["novalidate"],formtarget:x,type:["submit","reset","button"]}},canvas:{attrs:{width:null,height:null}},caption:s,center:s,cite:s,code:s,col:{attrs:{span:null}},colgroup:{attrs:{span:null}},command:{attrs:{type:["command","checkbox","radio"],label:null,icon:null,radiogroup:null,command:null,title:null,disabled:["disabled"],checked:["checked"]}},data:{attrs:{value:null}},datagrid:{attrs:{disabled:["disabled"],multiple:["multiple"]}},datalist:{attrs:{data:null}},dd:s,del:{attrs:{cite:null,datetime:null}},details:{attrs:{open:["open"]}},dfn:s,div:s,dl:s,dt:s,em:s,embed:{attrs:{src:null,type:null,width:null,height:null}},eventsource:{attrs:{src:null}},fieldset:{attrs:{disabled:["disabled"],form:null,name:null}},figcaption:s,figure:s,footer:s,form:{attrs:{action:null,name:null,"accept-charset":q,autocomplete:["on","off"],enctype:A,method:C,novalidate:["novalidate"],target:x}},h1:s,h2:s,h3:s,h4:s,h5:s,h6:s,head:{children:["title","base","link","style","meta","script","noscript","command"]},header:s,hgroup:s,hr:s,html:{attrs:{manifest:null}},i:s,iframe:{attrs:{src:null,srcdoc:null,name:null,width:null,height:null,sandbox:["allow-top-navigation","allow-same-origin","allow-forms","allow-scripts"],seamless:["seamless"]}},img:{attrs:{alt:null,src:null,ismap:null,usemap:null,width:null,height:null,crossorigin:["anonymous","use-credentials"]}},input:{attrs:{alt:null,dirname:null,form:null,formaction:null,height:null,list:null,max:null,maxlength:null,min:null,name:null,pattern:null,placeholder:null,size:null,src:null,step:null,value:null,width:null,accept:["audio/*","video/*","image/*"],autocomplete:["on","off"],autofocus:["autofocus"],checked:["checked"],disabled:["disabled"],formenctype:A,formmethod:C,formnovalidate:["novalidate"],formtarget:x,multiple:["multiple"],readonly:["readonly"],required:["required"],type:["hidden","text","search","tel","url","email","password","datetime","date","month","week","time","datetime-local","number","range","color","checkbox","radio","file","submit","image","reset","button"]}},ins:{attrs:{cite:null,datetime:null}},kbd:s,keygen:{attrs:{challenge:null,form:null,name:null,autofocus:["autofocus"],disabled:["disabled"],keytype:["RSA"]}},label:{attrs:{for:null,form:null}},legend:s,li:{attrs:{value:null}},link:{attrs:{href:null,type:null,hreflang:null,media:null,sizes:["all","16x16","16x16 32x32","16x16 32x32 64x64"]}},map:{attrs:{name:null}},mark:s,menu:{attrs:{label:null,type:["list","context","toolbar"]}},meta:{attrs:{content:null,charset:q,name:["viewport","application-name","author","description","generator","keywords"],"http-equiv":["content-language","content-type","default-style","refresh"]}},meter:{attrs:{value:null,min:null,low:null,high:null,max:null,optimum:null}},nav:s,noscript:s,object:{attrs:{data:null,type:null,name:null,usemap:null,form:null,width:null,height:null,typemustmatch:["typemustmatch"]}},ol:{attrs:{reversed:["reversed"],start:null,type:["1","a","A","i","I"]},children:["li","script","template","ul","ol"]},optgroup:{attrs:{disabled:["disabled"],label:null}},option:{attrs:{disabled:["disabled"],label:null,selected:["selected"],value:null}},output:{attrs:{for:null,form:null,name:null}},p:s,param:{attrs:{name:null,value:null}},pre:s,progress:{attrs:{value:null,max:null}},q:{attrs:{cite:null}},rp:s,rt:s,ruby:s,samp:s,script:{attrs:{type:["text/javascript"],src:null,async:["async"],defer:["defer"],charset:q}},section:s,select:{attrs:{form:null,name:null,size:null,autofocus:["autofocus"],disabled:["disabled"],multiple:["multiple"]}},slot:{attrs:{name:null}},small:s,source:{attrs:{src:null,type:null,media:null}},span:s,strong:s,style:{attrs:{type:["text/css"],media:null,scoped:null}},sub:s,summary:s,sup:s,table:s,tbody:s,td:{attrs:{colspan:null,rowspan:null,headers:null}},template:s,textarea:{attrs:{dirname:null,form:null,maxlength:null,name:null,placeholder:null,rows:null,cols:null,autofocus:["autofocus"],disabled:["disabled"],readonly:["readonly"],required:["required"],wrap:["soft","hard"]}},tfoot:s,th:{attrs:{colspan:null,rowspan:null,headers:null,scope:["row","col","rowgroup","colgroup"]}},thead:s,time:{attrs:{datetime:null}},title:s,tr:s,track:{attrs:{src:null,label:null,default:null,kind:["subtitles","captions","descriptions","chapters","metadata"],srclang:null}},ul:{children:["li","script","template","ul","ol"]},var:s,video:{attrs:{src:null,poster:null,width:null,height:null,crossorigin:["anonymous","use-credentials"],preload:["auto","metadata","none"],autoplay:["autoplay"],mediagroup:["movie"],muted:["muted"],controls:["controls"]}},wbr:s},ce={accesskey:null,class:null,contenteditable:S,contextmenu:null,dir:["ltr","rtl","auto"],draggable:["true","false","auto"],dropzone:["copy","move","link","string:","file:"],hidden:["hidden"],id:null,inert:["inert"],itemid:null,itemprop:null,itemref:null,itemscope:["itemscope"],itemtype:null,lang:["ar","bn","de","en-GB","en-US","es","fr","hi","id","ja","pa","pt","ru","tr","zh"],spellcheck:S,autocorrect:S,autocapitalize:S,style:null,tabindex:null,title:null,translate:["yes","no"],rel:["stylesheet","alternate","author","bookmark","help","license","next","nofollow","noreferrer","prefetch","prev","search","tag"],role:"alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),"aria-activedescendant":null,"aria-atomic":S,"aria-autocomplete":["inline","list","both","none"],"aria-busy":S,"aria-checked":["true","false","mixed","undefined"],"aria-controls":null,"aria-describedby":null,"aria-disabled":S,"aria-dropeffect":null,"aria-expanded":["true","false","undefined"],"aria-flowto":null,"aria-grabbed":["true","false","undefined"],"aria-haspopup":S,"aria-hidden":S,"aria-invalid":["true","false","grammar","spelling"],"aria-label":null,"aria-labelledby":null,"aria-level":null,"aria-live":["off","polite","assertive"],"aria-multiline":S,"aria-multiselectable":S,"aria-owns":null,"aria-posinset":null,"aria-pressed":["true","false","mixed","undefined"],"aria-readonly":S,"aria-relevant":null,"aria-required":S,"aria-selected":["true","false","undefined"],"aria-setsize":null,"aria-sort":["ascending","descending","none","other"],"aria-valuemax":null,"aria-valuemin":null,"aria-valuenow":null,"aria-valuetext":null},de="beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map(e=>"on"+e);for(let e of de)ce[e]=null;class T{constructor(t,l){this.tags=Object.assign(Object.assign({},St),t),this.globalAttrs=Object.assign(Object.assign({},ce),l),this.allTags=Object.keys(this.tags),this.globalAttrNames=Object.keys(this.globalAttrs)}}T.default=new T;function b(e,t,l=e.length){if(!t)return"";let a=t.firstChild,r=a&&a.getChild("TagName");return r?e.sliceString(r.from,Math.min(r.to,l)):""}function k(e,t=!1){for(let l=e.parent;l;l=l.parent)if(l.name=="Element")if(t)t=!1;else return l;return null}function pe(e,t,l){let a=l.tags[b(e,k(t,!0))];return a?.children||l.allTags}function E(e,t){let l=[];for(let a=t;a=k(a);){let r=b(e,a);if(r&&a.lastChild.name=="CloseTag")break;r&&l.indexOf(r)<0&&(t.name=="EndTag"||t.from>=a.firstChild.to)&&l.push(r)}return l}const me=/^[:\-\.\w\u00b7-\uffff]*$/;function U(e,t,l,a,r){let n=/\s*>/.test(e.sliceDoc(r,r+5))?"":">";return{from:a,to:r,options:pe(e.doc,l,t).map(o=>({label:o,type:"type"})).concat(E(e.doc,l).map((o,u)=>({label:"/"+o,apply:"/"+o+n,type:"type",boost:99-u}))),validFor:/^\/?[:\-\.\w\u00b7-\uffff]*$/}}function L(e,t,l,a){let r=/\s*>/.test(e.sliceDoc(a,a+5))?"":">";return{from:l,to:a,options:E(e.doc,t).map((n,o)=>({label:n,apply:n+r,type:"type",boost:99-o})),validFor:me}}function gt(e,t,l,a){let r=[],n=0;for(let o of pe(e.doc,l,t))r.push({label:"<"+o,type:"type"});for(let o of E(e.doc,l))r.push({label:"</"+o+">",type:"type",boost:99-n++});return{from:a,to:a,options:r,validFor:/^<\/?[:\-\.\w\u00b7-\uffff]*$/}}function ht(e,t,l,a,r){let n=k(l),o=n?t.tags[b(e.doc,n)]:null,u=o&&o.attrs?Object.keys(o.attrs):[],c=o&&o.globalAttrs===!1?u:u.length?u.concat(t.globalAttrNames):t.globalAttrNames;return{from:a,to:r,options:c.map(f=>({label:f,type:"property"})),validFor:me}}function bt(e,t,l,a,r){var n;let o=(n=l.parent)===null||n===void 0?void 0:n.getChild("AttributeName"),u=[],c;if(o){let f=e.sliceDoc(o.from,o.to),O=t.globalAttrs[f];if(!O){let i=k(l),d=i?t.tags[b(e.doc,i)]:null;O=d?.attrs&&d.attrs[f]}if(O){let i=e.sliceDoc(a,r).toLowerCase(),d='"',m='"';/^['"]/.test(i)?(c=i[0]=='"'?/^[^"]*$/:/^[^']*$/,d="",m=e.sliceDoc(r,r+1)==i[0]?"":i[0],i=i.slice(1),a++):c=/^[^\s<>='"]*$/;for(let p of O)u.push({label:p,apply:d+p+m,type:"constant"})}}return{from:a,to:r,options:u,validFor:c}}function fe(e,t){let{state:l,pos:a}=t,r=H(l).resolveInner(a),n=r.resolve(a,-1);for(let o=a,u;r==n&&(u=n.childBefore(o));){let c=u.lastChild;if(!c||!c.type.isError||c.from<c.to)break;r=n=u,o=c.from}return n.name=="TagName"?n.parent&&/CloseTag$/.test(n.parent.name)?L(l,n,n.from,a):U(l,e,n,n.from,a):n.name=="StartTag"?U(l,e,n,a,a):n.name=="StartCloseTag"||n.name=="IncompleteCloseTag"?L(l,n,a,a):t.explicit&&(n.name=="OpenTag"||n.name=="SelfClosingTag")||n.name=="AttributeName"?ht(l,e,n,n.name=="AttributeName"?n.from:a,a):n.name=="Is"||n.name=="AttributeValue"||n.name=="UnquotedAttributeValue"?bt(l,e,n,n.name=="Is"?a:n.from,a):t.explicit&&(r.name=="Element"||r.name=="Text"||r.name=="Document")?gt(l,e,n,a):null}function Et(e){return fe(T.default,e)}function Pt(e){let{extraTags:t,extraGlobalAttributes:l}=e,a=l||t?new T(t,l):T.default;return r=>fe(a,r)}const Se=[{tag:"script",attrs:e=>e.type=="text/typescript"||e.lang=="ts",parser:$e.parser},{tag:"script",attrs:e=>e.type=="text/babel"||e.type=="text/jsx",parser:_e.parser},{tag:"script",attrs:e=>e.type=="text/typescript-jsx",parser:qe.parser},{tag:"script",attrs(e){return!e.type||/^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(e.type)},parser:J.parser},{tag:"style",attrs(e){return(!e.lang||e.lang=="css")&&(!e.type||/^(text\/)?(x-)?(stylesheet|css)$/i.test(e.type))},parser:K.parser}],ge=[{name:"style",parser:K.parser.configure({top:"Styles"})}].concat(de.map(e=>({name:e,parser:J.parser}))),w=Te.define({name:"html",parser:ft.configure({props:[Ve.add({Element(e){let t=/^(\s*)(<\/)?/.exec(e.textAfter);return e.node.to<=e.pos+t[0].length?e.continue():e.lineIndent(e.node.from)+(t[2]?0:e.unit)},"OpenTag CloseTag SelfClosingTag"(e){return e.column(e.node.from)+e.unit},Document(e){if(e.pos+/\s*/.exec(e.textAfter)[0].length<e.node.to)return e.continue();let t=null,l;for(let a=e.node;;){let r=a.lastChild;if(!r||r.name!="Element"||r.to!=a.to)break;t=a=r}return t&&!((l=t.lastChild)&&(l.name=="CloseTag"||l.name=="SelfClosingTag"))?e.lineIndent(t.from)+e.unit:null}}),we.add({Element(e){let t=e.firstChild,l=e.lastChild;return!t||t.name!="OpenTag"?null:{from:t.to,to:l.name=="CloseTag"?l.from:e.to}}}),ye.add({"OpenTag CloseTag":e=>e.getChild("TagName")})],wrap:Oe(Se,ge)}),languageData:{commentTokens:{block:{open:"<!--",close:"-->"}},indentOnInput:/^\s*<\/\w+\W$/,wordChars:"-._"}});function Zt(e={}){let t="",l;e.matchClosingTags===!1&&(t="noMatch"),e.selfClosingTags===!0&&(t=(t?t+" ":"")+"selfClosing"),(e.nestedLanguages&&e.nestedLanguages.length||e.nestedAttributes&&e.nestedAttributes.length)&&(l=Oe((e.nestedLanguages||[]).concat(Se),(e.nestedAttributes||[]).concat(ge)));let a=l||t?w.configure({dialect:t,wrap:l}):w;return new ve(a,[w.data.of({autocomplete:Pt(e)}),e.autoCloseTags!==!1?xt:[],Ce().support,ke().support])}const F=new Set("area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" ")),xt=Xe.inputHandler.of((e,t,l,a)=>{if(e.composing||e.state.readOnly||t!=l||a!=">"&&a!="/"||!w.isActiveAt(e.state,t,-1))return!1;let{state:r}=e,n=r.changeByRange(o=>{var u,c,f;let{head:O}=o,i=H(r).resolveInner(O,-1),d;if((i.name=="TagName"||i.name=="StartTag")&&(i=i.parent),a==">"&&i.name=="OpenTag"){if(((c=(u=i.parent)===null||u===void 0?void 0:u.lastChild)===null||c===void 0?void 0:c.name)!="CloseTag"&&(d=b(r.doc,i.parent,O))&&!F.has(d)){let m=e.state.doc.sliceString(O,O+1)===">",p=`${m?"":">"}</${d}>`;return{range:Z.cursor(O+1),changes:{from:O+(m?1:0),insert:p}}}}else if(a=="/"&&i.name=="OpenTag"){let m=i.parent,p=m?.parent;if(m.from==O-1&&((f=p.lastChild)===null||f===void 0?void 0:f.name)!="CloseTag"&&(d=b(r.doc,p,O))&&!F.has(d)){let h=e.state.doc.sliceString(O,O+1)===">",P=`/${d}${h?"":">"}`,V=O+P.length+(h?1:0);return{range:Z.cursor(V),changes:{from:O,insert:P}}}}return{range:o}});return n.changes.empty?!1:(e.dispatch(n,{userEvent:"input.type",scrollIntoView:!0}),!0)});export{xt as autoCloseTags,Zt as html,Et as htmlCompletionSource,Pt as htmlCompletionSourceWith,w as htmlLanguage};
//# sourceMappingURL=index-CUyaHblS.js.map
