/* Search landing: the public About result opens live progress; the site menu retains About. */
(function () {
  if (!/^(www\.)?drking\.com\.tw$/i.test(location.hostname)) return;
  var url = new URL(location.href), internal = false;
  try {
    var ref = new URL(document.referrer);
    internal = /^(www\.)?drking\.com\.tw$/i.test(ref.hostname);
  } catch (_) {}
  if (url.pathname === '/about.html' && url.searchParams.get('original') !== '1' && !internal) {
    location.replace('/trackall.html' + url.search);
    return;
  }
  function preserveAboutMenu() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      try {
        var target = new URL(link.getAttribute('href'), location.href);
        if (/^(www\.)?drking\.com\.tw$/i.test(target.hostname) && target.pathname === '/about.html') {
          target.searchParams.set('original', '1');
          link.setAttribute('href', target.pathname + target.search + target.hash);
        }
      } catch (_) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preserveAboutMenu, {once:true});
  else preserveAboutMenu();
})();

var st=document.createElement(`style`);st.id=`qTheme`;st.textContent=`~AA^!important|~AB^body.nav-open #left-panel|~AC^font-size:|~AD^background:|~AE^height:|~AF^display:|~AG^border-radius:|~AH^}@media (max-wid|~AI^padding:|~AJ^px~AA|~AK^;letter-spacing:|~AL^grid-template-columns:|~AM^box-sizing:border-box|~AN^width:|~AO^ -apple-system,BlinkMacSystemFont,"PingFang TC",|~AP^.top .logoie #ec-search-btn|~AQ^;color:#|~AR^border:1px solid|~AS^align-items:center|~AT^~AB #M_E_N_U|~AU^white-space:nowrap|~AV^.qr #geo_bar|~AW^font-weight:|~AX^margin:0|~AY^:focus-visible{outline:2px solid|~AZ^#ec_qn|~BA^ox-shadow:none~AA|~BB^position:|~BC^body.qD |~BD^justify-content:center|~BE^border-bottom:1px solid |~BF^text-align:|~BG^~AFblock|~BH^overflow:visible|~BI^line-~AE|~BJ^transform:|~BK^~AA}.qr .|~BL^#showtrack .elite_number|~BM^-apple-system,BlinkMacSystemFont,"PingFang TC","Microsoft JhengH|~BN^}#ec-team .ec-doc:not(:has(.ec-sch img,.ec-txt section>:not(h3,.|~BO^cursor:pointer|~BP^overflow:hidden|~BQ^min-~AE|~BR^.info_area .info_box_t|~BS^~AHth:480px|~BT^#ql .ec_qn_it|~BU^.dp-card|~BV^grid-column:|~BW^{~AFnone~AA}|~BX^~AA;~AN100%~AA;|~BY^#left-panel .smenu|~BZ^:before{content:|~CA^padding-|~CB^max-~ANnone~AA|~CC^sans-serif|~CD^~BBabsolute|~CE^#close-panel-bt|~CF^~AD#fffefa|~CG^;outline-offset:|~CH^border:0|~CI^font-variant-numeric:tabular-nums|~CJ^~AZ_box|~CK^text-decoration:none|~CL^.qdr .qdlx|~CM^~AT .smenu|~CN^right|~CO^;border-|~CP^}#ql .qd|~CQ^px minmax(0,1fr)|~CR^~AFflex|~CS^bottom:|~CT^color:|~CU^.dp-menu|~CV^none|~CW^~BBrelative|~CX^-webkit-line-clamp:|~CY^.dp-expanded|~CZ^font-family:|~DA^.~CN_icon a.qcL|~DB^~AZ .ec_sched|~DC^;~AW400|~DD^box-shadow:|~DE^#showtrack|~DF^min-~AN|~DG^--portrait|~DH^var(--qpaper)~AA;|~DI^.qc .icon_link|~DJ^~AB a.qmenurow|~DK^px solid|~DL^:not(.qD|~DM^~AN100|~DN^span:first-child|~DO^~AJ}.qr|~DP^{~BG~AA|~DQ^word-spacing:0~AA~CP|~DR^.top.qhc|~DS^flex:~CV|~DT^.qteamlist|~DU^~AZ .qreg|~DV^~AHth:830px|~DW^~AFgrid;place-items:center;|~DX^;~AE|~DY^~BJtranslate|~DZ^~BC.qsc .elite_number_doc|~EA^max-~AE~CV|~EB^float:~CV|~EC^background|~ED^~AA}body |~EE^~AD0 0~AA|~EF^;~BJrotate(45deg)|~EG^content:|~EH^#ql .qw|~EI^.dp-bio|~EJ^margin-top:|~EK^z-index:|~EL^--qline|~EM^#168b90|~EN^justify-self:|~EO^ .ec_qn_|~EP^ minmax(|~EQ^{border-|~ER^}#ql .qn|~ES^;~AG1|~ET^~AC14~AJ|~EU^~AT .qteamparent|~EV^safe-area-inset-bottom|~EW^~AF~CV|~EX^~BFcenter|~EY^flex-direction:column|~EZ^stroke|~FA^.dn-group|~FB^~AB .qmenufirst|~FC^~AI0|~FD^~BU header|~FE^~CU button|~FF^info_box|~FG^,.qr .qd|~FH^calc(100|~FI^over{~AD|~FJ^;~BFleft|~FK^align-items:baseline|~FL^~BC.elite_updated_at|~FM^left:|~FN^after|~FO^auto|~FP^transition:|~FQ^16px|~FR^~AO"Microsoft Jheng|~FS^12px|~FT^nth-child|~FU^small|~FV^pointer-events:~CV|~FW^.dp-chart|~FX^white-space:normal|~FY^body.nav-open|~FZ^before|~GA^}.top .q|~GB^ .qlive |~GC^.qc .mod|~GD^;~AD#fff|~GE^~AC12~AJ|~GF^{~CR~AA;|~GG^~BJ~CV~AA|~GH^~CL.qln{~AC22.5px}|~GI^~AA;~CB;~AX~AA;~FC|~GJ^~AFgrid|~GK^.qr .qS|~GL^.qunloc|~GM^~CJ ~AZ_hd|~GN^;~AW500|~GO^;~BI1.5|~GP^~AJ;~BQ|~GQ^~AA}~BY>li|~GR^.qD #geo_bar|~GS^;~AN44px~DX44px;|~GT^.qr .qcd|~GU^opacity:|~GV^~ADvar(-|~GW^px;~AD#f|~GX^~DR .logo|~GY^.qr .top .smenu|~GZ^~AI8px|~HA^.qc .icon_boths|~HB^~DJ #navchevron|~HC^~AFinline|~HD^margin:|~HE^~AJ;gap|~HF^}~AV .q|~HG^~AHth:360px|~HH^~BL>ul>li.q|~HI^~AJ;~AX~AA;|~HJ^webkit-box-orient:vertical|~HK^~DDinset 0 0 0 1px #cfc7b6|~HL^.qdr|~HM^{~CT#|~HN^grid-row:1|~HO^margin-~FM|~HP^opy~CN|~HQ^}~CM>li>ul|~HR^.qr #qp|~HS^gap:8px|~HT^gap:6px|~HU^~AZ_ov.on .qT|~HV^currentColor;|~HW^font:|~HX^~CAtop:|~HY^~CN:|~HZ^#ec-team|~IA^}@media |~IB^st-child|~IC^~AA;~AM|~ID^#ql .qdns|~IE^~BBstatic|~IF^~BC#ci|~IG^body|~IH^20px|~II^inset:|~IJ^.dp-excerpt{|~IK^~AA}.qr~DL) |~IL^px/1.5~AO~CC|~IM^flex|~IN^overscroll-behavior:|~IO^~AC22px|~IP^~AC14px|~IQ^.qr ~AP|~IR^gap:4px|~IS^border:2~DK #b9cfbf|~IT^span|~IU^svh - 150px|~IV^~HL:not|~IW^~AI14px|~IX^#left-panel|~IY^~AB .menu-container|~IZ^.qr #ci|~JA^max-~AN|~JB^10px|~JC^column-gap:|~JD^inherit|~JE^grid-template-rows:|~JF^align-self:|~JG^--clinic-row-height|~JH^ ~EM~CG|~JI^~CH;~AD0 0;|~JJ^~AHth:600px|~JK^~CD~AA;top:`.split(`|`).map(function(p){return p.split(`^`)}).reduceRight(function(s,p){return s.split(p[0]).join(p[1])},`@keyframes qnews-scroll{0%{~DYX(0)}to{~DYX(-50%)}}@keyframes dkOpen{0%{~GU0;~DYY(~FS) scale(.97)}to{~GU1;~BJ~CV}}~DA img,.top .qCb{~EW}.qcL svg{~BG;~AN18px~DX18px;fill:~CV;~EZ:~HV~EZ-~AN1.7;~EZ-linecap:round;~EZ-linejoin:round}~DA~AY #16866c~CG3px}.~CN_icon a.showiconcontent.qcL{~DW~AN52px~DX52px;~HD8px ~FO;~FC;~AR #e7ece9~ES7px~GD~AQ16795f;~DD0 3px ~FS rgba(24,51,41,.1);~BO;~FPtransform .14s ease,~EC .14s ease}~DA svg{~AN23px~DX23px}~DA:h~FI#f2f8f4}~DA:active{~BJscale(.95)~IA(prefers-reduced-motion:reduce){~DA{~FP~CV}}~GXie{~FC~AA;~AX~AA}.qD ~BL>ul>li,~GX>a>img.logosite,~AV,.qr ~DE,.qr .bannerinpage,.qr .subtitle1~BW~DR .qCb{vertical-align:middle~AQ079fac;~HW600 24px/1.2~FRHei",~CC~AK3px~GACi{~BG;~BP;~AG50%~GAbg img,.top .qCi img~DP;~CB;~EA~AA~GACi img{~AN~FO~AA~DX36~AJ~IA(~DF831px){~DR .smenu{~EJ0~AA}~DV){~DR{~AE56~GP56~AJ}~GX{~AE56~AJ;~AM;~GZ 48~AJ}~DR .qCb{~IO~AK2px;gap:9px;~AU}~DR ~IX-link{top:50%~AA}}~GX{~AI~JB 0~AA;~EX~AA}~DR .qCb{~HC-~IM;~AS;~BD;gap:~FS~DX36px;~BQ0~GACi{~AN36px~DX36px;~IM:0 0 36px~GAtw{~CR;~AS;gap:7px~DX27px~GAbg{~BG;~CW;~BP;~AN24px~DX26.4px~GAbg img{~CD;~AN240~AJ~DX74.64~AJ;top:-10.8px~DV){~GX{~AI~JB 48~AJ}}.qD ~HHsc~DP;~CR~AA;~EY;~DM%~AA;~CB;~AX 0 16~AJ;~FC 20~AJ;~AD~DH~AG14~AJ;b~BA;~AM}#qp h1{~AX;~AI18px ~IH 4px~AQ007f7c;~AC23px;~BI1.4}#qp .qpage-note{~AX;~FC ~IH 14px;~AC~FS~AQ93671f;~BI1.6}#ql~GB.qnum::~FZ,~BC#qp{~EW}~DU svg,~DB svg,~GR,~HR .qpage-note,~HR .qqueue-head,~HR h1,.qr #marqueeCarousel,.qr .marquee-icon~BW~DU{~AD#43a3a4~AQfff~JJ){~DB{~AG~FS 0 0 12~AJ}~DU{~AG0 ~FS ~FS 0~AA}}#qp a,#qp b,#qp h1,#qp p,#qp ~IT{~CZ~BMei",~CC~AA}~AV~GF~AS;justify-~EGspace-between~FJ~BX~CB;~AM~AA}~AV:has(#geo_btn)>div{~EW}~DU,~DB{gap:0~AA;~BD}#indcon2{~HX114~AJ~DV){#indcon2{~HX56~AJ}}.qr .bannercon{~DM%~GI~BKcommondetail{~DM%~AA;~CB;~FC 8px 92~AJ;~AM~AA}~AP{~HY8~HI~CR~AA;~JK6~AJ;~FM~FO~AA;~CS~FO~AA;~AN44~AJ~DX44~AJ;~AS~AA;~BD~AA~GD~AA;~DD0 2px 8px rgba(30,70,60,.06)~AA;~BO;~EK10}.top .logoie{~CW~AA}~AP svg{~BG;~DS;~AN20~AJ~DX20~AJ;~EZ-~AN1.7~AA}~AP:h~FI#edf7f3~AA}.qr{--qink:#233f43;--qgreen:#008994;--qmuted:#74888b;~EL:#deeaec;--qpaper:#ffffff;--qbg:#f4f8f8;--qbg:#f8f6f1;~EL:#e9e6de;--qink:#354743;--qmuted:#828a80;~AD#f8f6f1~AA}.qr #indcon2,.qr .bannercon,.qr .commondetail{~GV-qbg)~BKtop{b~BA}~IF h2,~GY,~AB .smenu>li>a{~EE}~AV,~GY a{~CZ~BMei",~CC}~GY a{~CTvar(--qink)~AA~AK2px;~IP~AQ526057~AA}~IQ{~AR var(~EL)~AA;~CTvar(--qgreen)~AA;~CF~AA}~AV{~AD~DH~AR var(~EL)~AA}.qr #geo_btn:h~FI#edf8f9~AA}~AV::~FN{~AC11~AJ~AK1px~AQ938674~AA~BS){~AV{~AI9px 10~GP60~AJ}}.qr .commondetail{~CA~CS24~DO .footer{~AD#f4f8f8~AA;~CZ~BMei",~CC~BKbotconmar{~DM%~GI 8px 88~AJ;~AM~BKbotconmarn,.qr .~FF_b p{~FC~AA;~AX~BK~FF_b p{~BFleft~AA;~BI1.9~AA;~AC13~DO .~FF_b~DP;~EB~BX~CH~AA~COtop:1~DK #deeaec~AA;~HD22px 0 0~AA;~AI18px 0 0~AA;~AD0 0~BK~FF_b p:fir~IB{~AC15~AJ~AK1px~AQ526357~AA~GN~BKc~HP,.qr .c~HP p{~AC11~AJ;~BI1.9~AA~FJ~BKc~HP{~DM%~AA;~AI~IH 24px 12~HI~EE;~CH~BKc~HP p{~AX 0 8~DO .c~HP a{~GE~AQ6d8b7c~AA~JJ){.qr .c~HP{~AI18px 14px 12~AJ}}.qr .~FF_b{~AG0~AA;b~BA}~AV{~CF~AA~AQ6d7a70~BKtop{~CF~AA~CO~CT#e9e6de~BKfooter{~AD#f8f6f1~BK~FF_b~EQtop-~CT#e9e6de~AA}~AP{~CT~EM~AA;~AI12~AJ}~AP,~IQ{~EE;~CH~AA;b~BA;~AG50%~AA}~AP:hover,~IQ:h~FIrgba(22,139,144,.07)~AA}~AP:focus-visible,~IQ~AY #68abad~AA~CG-5~AJ;~ADrgba(22,139,144,.07)~AA}.qml{~AX~AA;~FC ~IH 12~AJ~AQ718078;~AC~FS;~BI1.6;~EX}#iconmyModal1 .iconcontent>.qml{~FC 0 12~AJ}#qp .qnearest-main::~FN,~CJ a.qnearest::~FN,#iconmyModal1 a.qnearest::~FN,.ec_qn_it.near~EOnm b::~FN,~AV::~FN{~EG~CV~AA;~EW~AA}#qp~GB.qds,#qp~GB.qw,.~CN_icon,~AV::~FZ~BW~DE .qrc{~BG;~EJ7px~AQ168b90;~HW500 13px/1.6~AO~CC;~CI~AK.3px}~AV{~AC0~AA;~IM-wrap:nowrap~AA;gap:7~AJ;~AI~JB 12~GP64~HI~EE;~CH~AA;~AG0~AA;b~BA}~AV>#geo_btn,~AV>b,~AV>div:not(.qsr){~EW~BKqS{~JI~AX~AQ277e78;~HW500 14~IL;~AU;~BO}~GT{~CI~AHth:380px){~GT{~AC11px}~GK{~AC13px}}~GK{~DF28px;~BQ30px;~BD;~AI3~DO .qS:~BZ"";~BG;~AN20~AJ~DX24~AJ;~CH~AA;~AG0~AA;~GG;~AD~HVmask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z' fill='~CV' ~EZ='black' ~EZ-width='1.7'/%3E%3Ccircle cx='12' cy='10' r='3' fill='~CV' ~EZ='black' ~EZ-width='1.7'/%3E%3C/svg%3E")center/~IH 24px no-repeat}~GT{~AC16~DO .qS{~AC16~AJ~GN~AA;~HC-~IM;~AS;~IR~BS){~GK,~GT{~ET}~HG){~GK,~GT{~AC13~AJ}}~GT{~HC-~IM~AA;~FK;~IR;~IM-shrink:0~AA;~AU}.qr .qdigit{~HC-block~AA;~AN2ch~AA;~DF2ch~AA;~BF~CN;~CI;font-feature-settings:"tnum"}~HR~GB.qnum{~BV2/5;~AC17~AJ~DC~AA~AQ8a9187~AA~AK1~DO .qS~GL{~CF~AQ367f77;~AR #b9cfbf;~AC13~HE:4px}~GK~GL::~FZ{~AN16~AJ~DX20~AJ;mask-size:~FQ ~IH~BS){~GK~GL{~GE;~AI5~AJ}}~GK{~IM-shrink:0}~GK:not(~GL)~BW~FL{~AC0~AA}~FL>.updated_at~BW~FL>.qrc{~AC13~AJ}~BC~DE .qsc{outline:0~AA;~CH~AA;~DD0 0 ~JB #ccc~AA}~DZ,~DZ div,~DZ ~IT{outline:0~AA;b~BA}.qr .qrc~HMa5aaa6~AA~DC~AA}.qr{--qbg:#f4f9f9;--qpaper:#fffefa;~EL:#e6ebe3;--qink:#29332e;--qmuted:#829084;--qgreen:~EM;~GV-qbg)~AA;~CTvar(--qink)}.qr .top{~AD~DH~BEvar(~EL)~BKmarquee-area{~AI~FS 8px 0~AA}~BT,~AV .qsr{~GJ~AA;~AS~IC~HFsr{~IM:1;~DF0;~DM%;~AC13px~GO;~AU~AQ6c7a70;~AL~FO~EP0,1fr) ~FO~AA;~FC~AA;gap:12~DO .qdate{~AC16~AJ~AQ859086~AA~DC~BKqcd~HMa4ada5~AA~DC~BKqS~GL{~AI9px 11~GP38px;~AR var(~EL)~AA~ES2~AJ;~AD~DH~CTvar(--qgreen)~AA~GN~AA}~HR{~DM%~AA;~CB;~AX ~FO 20~AJ;~FC~AA;~AD~DH~CH~AA~ES4~AJ;b~BA;~BP~AA}#ql~DP;~FC 24~AJ}~BT{~AL1fr 1fr 1.1fr 1.3fr 12~HE:16~AJ;~EX~DX104~GP104~AJ;~IW 0~AA;~AX~AA;~CH~AA;~BEvar(~EL)~AA;~AG0~AA;~EE;b~BA;~BO;~CK;~FP~EC .18s}~BT:la~IB~EQ~CS0~AA}~BT:h~FI#f6f8f2~AA}~BT~AY #91bbad~CG-2px}~BT::~FN{~EG"";~BG;~BV5;~AN6px~DX6px~COtop:1.5~DK #bdc7bc~CO~HY1.5~DK #bdc7bc~EF;~ENcenter~CPs,#ql .qnm,#ql .qnum,~EH{~DF0;~AU~ERm{~AC27~AJ~GN~AA~AK1~AJ~FJ~ERum,~EH b{~CZArial,~CC~AA~DC~AA;~CI~ERum{~AC31~AJ;~BI1.2~AA~AK-1~AJ~CPs,~EH{~GJ~AA;~BD~AA~FJ~AA~DC~AA}~EH{~AL2em 2.5ch~AA;~JC12~AJ;~FK~AA;~ET}~EH b{~AC24~AJ;~BF~CN~CPs{~AL28px~EP0,1~JB)~AA;~AS~AA;gap:12~AJ;~AC20~AJ~AQ55645a~AA~AK0~AA;word-spacing:5~AJ~CPl{~DS;~ET~DC~AA~AK1~AJ;~DQns{~GJ~AA;~ALminmax(0,1fr)~AA;gap:0~AA;~AU~DC~AA;~BI24~AJ~CP-name~DP;~AU~AA;~DQs::~FZ,#ql .qnum::~FZ{~EW~AA;~EG~CV~AA}#ql~GB.qnum{~BV2/5;~AC17~AJ~AK1~AJ~AQ8a958a~AA}#ql~GB.qds,#ql~GB.qw,~GR .qS,.qr ~AZ svg,.qr .scrollup img{~EW~BKfooter{~GV-qbg)~AA~AQ829084~BK~FF_b p~HM829084~BK~FF_b~EQtop-~CTvar(~EL)~BKc~HP,.qr .c~HP p~HM929b91~AA~BS){~AV{~GZ 4~GP62~AJ~HFsr{gap:5~DO .qcd~FGate{~AC13~DO .qS~GL{~GE;~GZ 7~AJ}#ql{~FC 14~AJ}~BT{~AL42px 52px~EP62px,1fr)~EP108px,1.3fr) 6~HE:5~AJ~DX86~GP86~AJ;~GZ 0~AA~ERm{~AC22~AJ~AK.5~AJ~ERum{~AC26~AJ}~EH{~GE;~JC7~AJ}~EH b{~AC21~AJ~CPs{~AL24~CQ~AA;gap:7~AJ;~AC16~AJ;~DQl{~GE~CP-name,~ID{~BI22~AJ}~HG){#ql{~FC 12~AJ}~BT{~AL38px 44px~EP52px,1fr)~EP94px,1.4fr) 6~HE:4~AJ~ERm{~AC20~AJ~ERum{~AC24~AJ}~EH{~AC11~AJ;~JC5~AJ}~EH b{~AC19~AJ~CPs{~AL22~CQ~AA;~AC15~HE:5~AJ;~DQl{~AC11~DO .qcd~FGate{~AC12~DO .qS~GL{~AC11~AJ;~AI7px 5~AJ}~HFnt,~AV .qS{~BV1;~HN;~ENstart~HFnt{~EW~AA;~AX~AA;~FC~AA~AQ526357;~AC~FQ~GN~GO~AK1px;~AU~HFS:not(~GL)+.qnt~DP~HFdate{~BV2;~HN;~ENcenter~HFcd{~BV3;~HN;~ENend;~BF~CN~BS){~AV .qnt{~AC15px}}~IG ~AP,~IQ{~AI8~AJ~AQ29332e~ED~AP svg{~AN28~AJ~DX28~AJ}~IG ~AZ,.qr ~AZ{~BBfixed~AA;~FM8~AJ;~HY8~AJ;~CS8~AJ;~AN~FO~GI~AA;~GG;~GV-qbg)~AA}.qr ~AZ~GFgap:8~DO ~DU,.qr ~DB~GF~IM:1 1 0~AA;~AN0~AA;~DF0~AA~DX54~AJ;~BD~AA;~AS~IC~AA~ES3~AJ;~HW500 17px~FRHei",~CC~AA~AK3~AJ;b~BA}.qr ~DB{~CF~AA;~IS~AA~AQ367f77~AA}.qr ~DU{~AD~EM~AA;~AR ~EM~AA~AQfffefa~BKscrollup{~HY12~AJ;~CScalc(74px + env(~EV,0))~AA;~AN46~AJ~DX46~AJ;~AM;~AR #cfdad1~AA~ES4~AJ;~CF~AA;~GU1~AA;~BO}.qr .scrollup:~BZ"";~CD;~AN~FS~DX~FS;~FM~FQ;top:18px~COtop:2~DK #42685a~CO~FM2~DK #42685a~EF}~GR,~IG ~AZ{~CR~AA}~GR .qnt~DP}.qD ~DE,.qD ~BL,.qD ~BL>ul{~BG~BX~AX~AA;~FC~AA}~DE .qsc .elite_name,~DE .qsc .elite_number_doc,~DE .qsc .geo_dist,.qD #qnb,.qr .~CN_icon~BW.qA{order:3;~CR;~AS;gap:~FS~COtop:1~DK var(~EL)}.qA a{~DW~AN44px~DX44px;~AR #dce5dc~ES2~GW1f5ef~AQ557367~AA;~CK}.qA a:h~FI#e6eee4}.qA svg{~AN23px~DX23px;fill:~CV;~EZ:~HV~EZ-~AN1.7;~EZ-linecap:round;~EZ-linejoin:round}.qkm{~HO~FO;~IP~AQ7b867c~AK.4px}~DE li.qsc{~AE~FHsvh - var(--qcard-top) - 78px);~BQ3~JB}.qdd{~IM:1;~BQ0;~CR;~EY}~HL{~IM:1;~GJ;~AL72px 1fr 5em 64px;gap:~FQ;~AS;~BEvar(~EL);~AC~IH~AQ55645a}~HL>~DN~HM829084;~AC~FQ~AK1px}~HL b{~HW400 34px Arial~AQc65f58}.qdw{~IM:.75~CO~CS0}.qdw b{~AC26px}.qA{~DS;~AI~FS 0~BS){~HL{~AL40px 1fr 4em 52px;~HS;~AC17px}~HL>~DN{~IP}~HL b{~AC30px}.qdw b{~AC24px}}~HL>~IT:~FT(3),.qdw>~IT{~BV3;~BF~CN;~ET~AQ829084~AK0~AA}~HL b{~BV4;~BF~CN}.qdw>~DN{~BV3}~HL>:~FT(2){~CR;~AS;~HT;~AC34px~AQ344c40~BS){~HL>:~FT(2){~AC30px}}~HL>:~FT(2) ~FU,~HL>~DN,~HL>~IT:~FT(3){~ET~DC~GO~AK0~AA~AQ829084}~HL>:~FT(2) ~FU{~DS;~AX}~CJ,~GM{~AM;~FC~AA;~AD#f4f3f0~AA;~CH~AA}~CJ{~BJ~CV~BX~CB~DX~FO~AA;~EA~AA;~AX~AA~ES6px ~FQ 0 0~AA;~DD0 ~FS 48px #41433f30;animation:dkOpen .22s ease-out~AQ41433f;~CW~AA;~II~FO~AA;~BQ~FHdvh - 8px);~BH~AA}~GM{~BBsticky;top:0;~EK2;~CR~AA;~AS~DX54px;~BQ54px}~GM>div~DP;~EX}~CJ h3{~AC22~AJ~DC~AA~AK4px~AQ62645f~AA;~AX~AA}~CJ ~AZ_x{~CD;~HY0;top:5px~GS~CH;~AG6px;~AD0 0~AQ62645f;~AC26px}~GM p,~CJ ~AZ_tools,~CJ .qml,~CJ~EOgo,~CJ~EOkm,~CJ~EOtag,~CJ ~FU,.qQt[hidden]~BW~CJ ~AZ_ls{~GJ~AA;~ALrepeat(3,minmax(0,1fr));~HS;~FC~AA;~EA~AA;~BH~AA}~CJ~EOit~GF~BD;~AS~DX40px;~BQ40px;~AM;~AI6px 4~HI~AR #deded8~AA;~AG6~GWdfcf9~AA;~CK}~CJ~EOnm{~DF0;~DS~AA}~CJ~EOnm b{~AC18~AJ~DC~AA~AQ555751~AA~AK3px}~CJ~EOit.qactive{~AD#62645f~AA~CO~CT#62645f~AA}~CJ .qactive~EOnm b~HMfdfcf9~AA}.qsv{~EJ8px}.qsv img{~BG;~DM%~DX~FO;~AX 0 ~FQ~ES0px}.qhalf{aspect-ratio:1.414;~BP}.qhalf img{~DM%~DX~FO;~AX;~AG0}.qW img{~DYY(-50%)}.qH{~BQ~FHsvh - 3~FS)}.qW{~HD~FQ 0}~GM,~CJ ~AZ_ls{~HO~FS;margin-~HY~FS}.qsv .qW:la~IB{margin-~CS0}~IG:has(~HU),html:has(~HU){~BH~AA}~IG:has(~HU)>:not(~AZ_ov)~BW~AZ_ov.on:has(.qT){~CW~AA;~II~FO~AA;~HX8px;~BQ100dvh~DX~FO~AA}.qhalf{~CW}.qhalf:~FN{~EG"";~CD;~FM3%;top:2%;~AN23%~DX11%;~GV-mask,#eef4f0);~FV}.qQt{~BBfixed;~HY~FS;~CScalc(74px + env(~EV,0));~EK4;~AN46px~DX46px;~AM;~AR #cfdad1~ES4px;~CF;~GU1;~BO}.qQt~BZ"";~CD;~AN~FS~DX~FS;~FM~FQ;top:18px~COtop:2~DK #42685a~CO~FM2~DK #42685a~EF}.qc{~FC~AA;~BP~AA;~IN~CV}~GCal-dialog{~CD;~FM50%;top:50%;~AN~FH% - 24px);~JA5~IH;~AX;~DY(-50%,-50%)~AA}~GCal-content{~BQ0;~AR #e1e0da~ES6~GW4f3f0;~DD0 ~FQ 48px #0002;~FC ~FQ ~FQ;~BP}~DI a,~GCal-header{~CR;~AS;~BD}~GCal-header{~CW~DX54px;~FC;~CH}~GCal-title{~IO~DC~AK4px~AQ62645f;~AX~GO}.qc .close{~CD;~HY0;top:5px~GS~GU1;~AC26px~DC~AQ62645f;text-shadow:~CV}~HA{~GJ;~ALrepeat(3,minmax(0,1fr));~HS;~DM%;~FC;~AX;~EB}.qc .qcs,.qc .qml,~HA:~FN,~HA:~FZ,.qc .icon_imgs,~GCal-footer,~IG ~AZ svg~BW~DI,.qc .icon_wlink{~DM%;~FC;~AX;~EB}~DI a{~AEclamp(32px,7dvh,48px);~AR #deded8;~AG6~GWdfcf9~AQ555751;~AC18px~DC~AK3px;~CK;~AI6px 4px;~AM}~DI a:hover,~DI a[data-current]{~AD#62645f~AQfdfcf9}.qsv{scroll-~EJ54px}~BC~DU:not(.qdc)~BW.qdc{~CK~AA}.qdlx{~JI~FC~FJ;~BO;~CZ~JD}.qdw>~FU{~BV1/3;~AC~FS~AQ829084}.qdw>~IT{~BV3~AA}#dp{clear:both;~AI100px 0 80px}~IG~DL) #dp{~EW}~BU{~AM;~CF~ES4px;scroll-~EJ72px;~CR;~EY}~FD{~GJ;align-items:start}~FD img{aspect-ratio:1;object-fit:cover~ES2px;~ANvar(~DG)~DXvar(~DG);~JA~CV;~HN/3}~BU h2{~BV2;~AC24px~AQ344c40;~AX;~ACclamp(~IH,5vw,26px);~BI32px;~AU}~FW{~CW;~DM%;~BP;clip-path:inset(0 0 8%)}~FW img{~DM%;~BG}~FW:~FN{~EG"";~CD;top:3%;~HY3%;~AN9%~DX12%;~AD#f5f8f7}~EI{~BV2;~AF-webkit-box;-~HJ;white-space:pre-line;~FC;~CH;~AD0 0~FJ;~HW400 14px/1.6~AO~CC~AQ738177;~BO}~EI~CY{~BG;~CXunset;~BH}~EI~AY~JH4px~IA(~DF700px){~FD{~AL200~CQ}~EI{~AC~FQ;~CX6}}~BU{~DG:clamp(130px,28svh,2~IH)~DX~FH~IU);~BQ0;~HD~FQ 0 1~JB;~AI~FS 0 0;~HT;~BP}~FD{~AEvar(~DG);~DS;~ALvar(~DG)~EP0,1fr);~JE32~CQ;~HS 14px;~FC 14px}~EI{max-~AEcalc(var(~DG) - 40px);~IP~GO5;~JFstart}~FW{~ANmin(100%,calc((100~IU - var(~DG) - 24px)*1.497));~DS;~JFcenter;~AX}~BU:has(~CY){~AE~FO;~BQ~FH~IU);~BH}~BU:has(~CY) header{~AE~FO;~JE32px ~FO}~EI~CY{~EA}~BU:has(~CY) ~FW{~DM%~BS){~BU{~DG:clamp(124px,35vw,170px)}~FD{~HT ~FS}~EI{~CX4;~AC13px}~BU h2{~IO}}~EI,~CY ~IJ~CXunset;~BH}~EI~DP;~EA~AA}~IJ~AF-webkit-box;-~HJ;~CX3;~BP;max-~AE4.65em}.dp-more{~BG;~EJ4px;~AC13px;~BI~IH~AQ367f77~GN}~CY ~IJ~BG;~EA}#ql .qln{~AC.75em~AA}~CL.qln{~AC25.5px~BS){~GH}~CL{~AC34px;~ENstart;max-~DM%;~AI7px 9px;~AR #dce6dc~ES0~GW0f5ef;~BO;~FP~EC .15s,border-color .15s}~CL:active,~CL:h~FI#e3eee3~CO~CT#9cbaa6}.qdlx~AY~JH3px~BS){~CL{~AI6px;~IR}}~CL{~AU;~IM-wrap:nowrap;~DF0~BS){~IV(.qdw){~AL28~CQ 28px 42px;~HT}~CL{~AI6px 5px;~AC30px;~IR;~BI1.25}~GH~IV(.qdw)>~IT{~AU;~GE}~AHth:350px){~CL{~AC27px}~CL.qln{~AC20.25px}}~HL>~FA{~DF0;~HT;~AU}~FA ~FU{~DS;~ET}~FA .qdlx~HM344c40;~BI1.25~BS){~FA ~FU{~GE}}~IV(.qdw)>~DN~HM455b4d~GN}~BC.qoh,~IG~DL) #ci~BW#ci{~AR #dfe5dc~ES2px;~BP;~CF}#ci h2{~IO~AQ526357;~AD#f4f9f9;~EX;~IW;~AX 0 8px;~BE#dfe5dc}#ci>a,#ci>p{~CR;~FK;gap:14px;~AC18px;~BI1.6~AQ455b4d}#ci>p{~AX;~IW ~IH;~HX8px;~CA~CS~FQ}#ci ~FU{~DS;~AN5em;~AU~AK0;~IP~AQ829084}#ci>a,#ci>a ~IT,#ci>p{~CK}#ci>a:active,#ci>a:h~FI#f3f6ef~CO~CT#dce4d7}#ci>p ~IT~HMc65f58~BS){#ci>a,#ci>p{~CA~FM~FQ;~CA~HY~FQ;gap:~JB}}#ci>a{~HD~FS ~FQ;~IW ~FQ;~AR #dce4d7~ES0~GW3f6ef;~BO;~FP~EC .15s,border-color .15s}#ci>a~AY~JH2px}#ci>a ~IT{~DF0}#ci>a:~FN{~EG"";~AN7px~DX7px~COtop:1.5~DK #809384~CO~HY1.5~DK #809384~EF;~DS;~HO~FO;~JFcenter}~CU{~CR;~IM-wrap:wrap;~HS;~AI18px ~FQ ~IH;~CF;~AR #dfe5dc~ES4px;~AX 0 24px}~FE{appearance:~CV;~AR #dce4dc;~AG24px;~CF~AQ455b4d;~CZ~JD;~AC17px~GO;~GZ 14px;~BO;~AU;~BQ44px;max-~DM%}~FE:hover,~FE[aria-pressed=true]{~AD#e7eee4~CO~CT#9cbaa6}~FE~AY~JH2px}~CU h2{~IM-basis:100%;~IO~GN~AQ526357~GO;~AX 0 8px;~FC 0 ~FS;~BE#dfe5dc~AK1px}~BC~AZ{isolation:isolate;~BH~AA}~BC~AZ~BZ"";~CD;top:-8px;~FM-~FQ;~HY-~FQ;~CS-100vh;~GV-qbg,#f4f9f9);~EK-1;~FV}#ci>p ~IT{~DF0}#ci>a ~IT,#ci>p ~IT{overflow-wrap:anywhere}~BU h2{~DF0~AK0~HG){~BU{~DG:1~FQ}#ci h2,~BU h2{~AC~IH}~FD{~HT 8px}~CU{~CA~FM~FS;~CA~HY~FS}~FE{~AC~FQ;~GZ ~JB}#ci>a,#ci>p{~HS;~AC~FQ}#ci>a{~HO~JB;margin-~HY~JB;~CA~FM~JB;~CA~HY~JB}#ci ~FU{~AN4em;~AC~FS}~IA(orientation:landscape) and (max-~AE500px){~BU,~BU:has(~CY){~AE~FO;~BQ0;~BH;~CA~CS~FQ}~FW{~ANmin(100%,760px)}~GCal-content{max-~AE~FHdvh - 24px);overflow-y:~FO}~DI a{~AE36px}~DE li.qsc{~AE~FO;~BQ3~JB}~HL{~BQ64px}~IA(~DF481px) and (~JA700px){#ql{~FC 16~AJ}~BT{~AL54px 62px~EP70px,1fr)~EP126px,1.3fr) 8~HE:8~AJ~CPs{~AC18~HE:8~AJ~ERm{~AC24~AJ}~IV(.qdw){~AL36~CQ 32px 52px;gap:~JB}~CL{~AC30px}~GH~DV){~IX{~ANmin(90vw,380px)~AA;max-~DMvw~DX100dvh~IC;~AI64px ~FQ 32~AJ~GD~AA;~DD~CV;overflow-y:~FO~AA;~INcontain~AQ29332e~AA}~CE{~JK10~AJ;~HY10~AJ~GS~DW~AC24px~AQ455b4d;~BO}~BY{~FC~AA;~AX~AA;~DM%~GQ{~EB~BX~AX~AA;~BE#e6ebe3~GQ>a,~BY>li>ul a{~BI1.5~AA;~FX~GQ>a~GF~AS;~BQ60px;~IW 12~AJ;~AC22~AJ~AK1~AJ~FJ~AQ29332e~GQ>ul{~IE~BX~GZ 0~AA~GD~GQ>ul>li~DP;~EB~BX~AI4~AJ;vertical-align:top;~AM}~BY>li>ul a~DP;~AI~FS 4~GP48px;~AC18~AJ~AK0~AA;~EX~GD~AA;~AR #dce4dc~ES0px~AQ455b4d~AA}~IX a~AY~JH-3px}}#navveil{~EW}~FY{~BP~AA}~FY #navveil{~BG;~BBfixed;~II0;~DM%~DX100%;~JI~EK100001}~AB~DP;~BBfixed~AA;~II0 ~FO 0 0~AA;~GG;~EK100002~AA;~ANmin(86vw,400px)~AA~DX100dvh~AA;~AG0~AA;~AX~AA}~AB~BZ~CV}~AB .smenu>li~EQ~CS0~AA}~IY~EQtop:0;~HX0~DV){~AB{~GZ ~FQ 32~AJ}~AT,~AT a,~AT li,~AT ul,~IY{~AD#fff~AA}~AT a,~AT li{~CH~AA;b~BA}~CM>li.showhide~BW~CM>li.F_L~DP;~BE#777~AA;margin-~CS12~AJ}~CM>li.F_L>a{~CA~HY56~AJ}~CM>li:la~IB{~BE#777~AA;~CA~CS12~AJ}~AT a{~AW400~AA}~FY ~CE{~HY16~AJ;~EK2~AQ777~AA;~CZArial,~CC~AA~DC~AA;top:18~AJ}~FY ~CE~BZ"×"~AA;~AC34px;~CZArial,~CC~AA}~CM>li:not(.showhide){~BE#d7ddd7~AA;~FC~AA;~AX~AA}~CM>li>a{~BQ64px;~AI~FQ 12~AJ~DC~AA;~BI1.45~AA~HQ{~FC 0 14~AJ~HQ a{~AR #e0e5e0~AA}~AB ~CE:~FN,~AB ~CE:~FZ,~DJ:~FN,~DJ:~FZ,~AB li:~FN,~AB li:~FZ{~EW~AA;~EG~CV~AA}~FB{~CW~AA;~BG~AA}~DJ{~CW~AA;~EB~AA;~CR~AA;~AS~IC~BX~BQ64~AJ}~FB ~CE,~HB{~CD~AA;~AN44~AJ~DX44~AJ;~GJ~AA;place-items:center~AA}~FB ~CE{~II~JB 0 ~FO ~FO~AA;~GG}~HB{~II50%0 ~FO ~FO~AA;~DYY(-50%)~AA}~AB ~CE svg,~AB #navchevron svg{~AN24~AJ~DX24~AJ~AQ777~AA}~EU:~FN,~EU:~FZ,~EU>a:~FN,~EU>a~BZ~CV~AA;~EW~AA;~CH~AA;~EE}}.qD ~HHsc,~IZ,~HR,.qr ~BU,.qr ~CU{~CF~AA}~IF,~BC~HHsc,~BC~BU,~BC~CU,.qr~DL) #qp,.qr~DL) ~AZ{~EC-~CT#fffefa~AA;~EC-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.25' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23756d5d' opacity='.19' filter='url(%23p)' d='M0 0h160v160H0z'/%3E%3C/svg%3E"),linear-gradient(115deg,#fff,#fdfcf8)~AA;~EC-size:160px 160px,100% 100%~IK~AZ{gap:6~AJ~ES3~DO~DL) #qp ~BT~EQ~CS1px dashed #bdb7a6~IK#qp ~BT:la~IB~EQ~CS0~IK#qp{~HK,0 3px ~FS #7166541c~AA}~IF,~BC~HHsc,~BC~BU,~BC~CU{~HK,0 3px ~FS #7166541c~AA}~IF,~BC~CU~EQ~CT#cfc7b6~AA}~IF h2,~BC~CU h2~EQ~CS1px dashed #bdb7a6~AA~DV){~AB{~AN50vw~AA;~JA50vw~AA;~GZ 8px 32~AJ;~AM~AA}~CM>li>a{~ACclamp(~FQ,4.7vw,~IH)~AA;~CA~FM6~AJ;~CA~HY6~AJ;~AU~AA}~CM>li.qmenufirst>a,~CM>li.qteamparent>a{~CA~HY36~AJ}~FB ~CE,~HB{~AN36~AJ~HQ{~AL1fr~AA~HQ a{~AC17~AJ;~AU~AA}~CPl,#ql .qd-name,#ql .qnm,~EH,~IZ h2,~IZ ~FU,~IZ>a~FGlx~FGr~FGr ~FU~FGr>~IT~FGw>~FU,.qr ~EI,.qr ~BU h2,.qr ~FE,.qr ~CU h2~HM304639~AA~ERum,~EH b,~IZ>p ~IT~FGr b~HMad4d47~BKqkm,.qr .dp-more~HM52685b~ED.marquee-area{~AI~FS 8px 0~ED~DU,~IG ~DB~GF~IM:1 1 0~AA;~AN0~AA;~DF0~AA~DX54~AJ;~BD~AA;~AS~IC~AA~ES3~AJ;~HW500 17px~FRHei",~CC~AA~AK3~AJ;b~BA}~IG ~DB{~CF~AA;~IS~AA~AQ367f77~ED~DU{~AD~EM~AA;~AR ~EM~AA~AQfffefa~ED~AZ{gap:6~AJ;~CF~AA~ES3~AJ;~EK9999;isolation:isolate~AA;~BH~AA}~IG{~CA~CS78px~DV){~AT ~DT,~AT ~DT>a{~IE~AA;~EB~BX~AE~FO~IC~AA~GD~AA;~GG}~AT ~DT{~EA~AA;~BH~AA;~AI4px 4px 14~AJ;~AX~AA}~AT ~DT>a~GF~AS~AA;~BD~AA;~BQ48~AJ;~AX 0 6~AJ;~AI~JB 4~AJ;~AR #e0e5e0~AA~ES0~AJ~AQ455b4d~AA;~HW400 17~IL~AA;~AU~AA;~GU1~AA;visibility:visible~AA}~DT:~FN,~DT:~FZ,~DT>a:~FN,~DT>a~BZ~CV~AA;~EW~AA}}~IG ~BR p .qtime,~IG ~BR>.qfootlabel{~IE~AA;~GG;~AN~FO~AA;~EE;~CH~AA;~AG0~ED~BR p .qtime{~II~FO~AA;~EB~AA;~HC~AA;~CB~DX~FO~AA;~BQ0~AA;~AX~AA;~FC~AA;b~BA~AQad4d47~AA;~HW~JD~AA;~BI~JD~AA~AK~JD~AA;~FX~ED~BR p{~IE~AA~DX~FO~AA;~BQ0~AA;~BI1.8~AA;~BH~AA;~FX~ED~AZ~BZ""~AA;~JK-8px;~FM-~FQ;~HY-~FQ;~CScalc(-8px - env(~EV,0));~AD#f4f9f9~AA;~EK-1~AA;~FV~AA}html ~IG ~AZ{gap:6~AJ}~IG ~BR>.qfootlabel~DP;~AX 0 16~AJ;~FC 0 14~AJ~CO~CS1px dashed #bdb7a6~AA~AQ304639~AA;~HW500 22~IL~AA;~EX~AA~AK2~AJ}~IG~DL) .info_area{~AN~FH% - 32px)~AA;~JA668~AJ;~HD~IH ~FO~AA;~FC~AA;~EE;~CH~AA;b~BA;~AG0~AA;~BH~AA}~IG~DL) ~BR{~BG~BX~AM~AA;~HD~IH 0~AA;~AI35px 60px 20~AJ~GD~AA;~AR #00b0a6~AA;~AG20~AJ;b~BA~AQ000~AA;~HW18px/30px"Noto Sans TC",~CC~AA~JJ){~IG~DL) ~BR{~AI24px ~FQ 20~DO~DL) ~BT{~AEvar(~JG,100px)~AA;~BQvar(~JG,100px)~AA}}~IF ~FU,~BC.qkm,~BC~HL>~IT,~BC~FA ~FU{~AC16~AJ}~BC.qdw>~FU{~ET~GO}~BC~EI,~BC.dp-more{~AC15~AJ~BS){~BC~IV(.qdw)>~IT,~BC~FA ~FU{~ET}~BC~HL>~FA{~IR}~IF ~FU{~ET}~CPns{~AC22~AJ~CP-name{~BI25~AJ~AHth:700px){~ID{~AC20~AJ}~BS){~ID{~AC18~AJ~CP-name{~BI24~AJ}~HG){~ID{~AC17~AJ}}~IG.qAboutBrand #indcon2{~HXvar(--expanded-header,248px)~AA}~HZ .ec-sch:has(>.ec-empty),~HZ .ec-txt:not(:has(section>:not(h3,.ec-empty))),~HZ section:has(>.ec-empty)~BW~HZ .ec-doc:not(:has(.ec-sch img)){~AL168~CQ~BNec-empty))){~BG~BNec-empty))) .ec-id{~IM-direction:row;~AS;justify-~EG~IM-start~FJ;gap:~IH~BNec-empty))) .ec-avatar{~AN1~IH;~DS~AHth:640px){~HZ .ec-doc{~AL1fr~AA}}`);document.head.appendChild(st);
!function(){var s=`a[href*="trackall.html"],a[href*="lineprogress.html"]`;function f(r){if(!r.querySelectorAll)return;var a=Array.from(r.querySelectorAll(s));r.matches&&r.matches(s)&&a.push(r);a.forEach(function(a){var u;try{u=new URL(a.href)}catch(e){return}if(u.origin===location.origin&&[`/trackall.html`,`/lineprogress.html`].includes(u.pathname)&&u.searchParams.get(`v`)!==`20261026-card2`){u.searchParams.set(`v`,`20261026-card2`);a.href=u.pathname+u.search+u.hash}})}f(document);new MutationObserver(function(rs){rs.forEach(function(r){r.addedNodes.forEach(f)})}).observe(document.body,{childList:true,subtree:true})}();

// Official website only. LINE standalone pages retain their own controls.
(function(){
  if(/^\/line[^/]*\.html$/i.test(location.pathname)||location.pathname.startsWith('/sys_manage/')||document.documentElement.classList.contains('qLineStandalone')||document.documentElement.classList.contains('qLineFirstPaint'))return;
  document.documentElement.classList.add('qOfficialFloat');
  const style=document.createElement('style');
  style.id='qOfficialLineFloat20261028';
  style.textContent=`
html.qOfficialFloat body .right_icon{display:block!important;position:fixed!important;inset:auto 12px calc(128px + env(safe-area-inset-bottom,0px)) auto!important;width:46px!important;height:46px!important;margin:0!important;padding:0!important;z-index:9998!important;background:transparent!important}
html.qOfficialFloat body .right_icon>:not(a.LINE){display:none!important}
html.qOfficialFloat body .right_icon a.LINE,html.qOfficialFloat body .scrollup,html.qOfficialFloat body .qQt{box-sizing:border-box!important;width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;padding:0!important;margin:0!important;border:1px solid #cfdad1!important;border-radius:50%!important;background:#fffefa!important;color:#42685a!important;box-shadow:0 2px 8px #30463914!important;opacity:1!important;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
html.qOfficialFloat body .right_icon a.LINE{display:flex!important;align-items:center!important;justify-content:center!important;text-decoration:none!important;float:none!important}
html.qOfficialFloat body .right_icon a.LINE img{display:block!important;width:30px!important;height:30px!important;max-width:none!important;border:0!important;border-radius:50%!important;margin:0!important;padding:0!important;object-fit:contain}
html.qOfficialFloat body .scrollup,html.qOfficialFloat body .qQt{position:fixed!important;right:12px!important;bottom:calc(74px + env(safe-area-inset-bottom,0px))!important;z-index:9998!important}
html.qOfficialFloat body .scrollup img{display:none!important}
html.qOfficialFloat body .scrollup::before,html.qOfficialFloat body .qQt::before{content:''!important;display:block!important;position:absolute!important;width:14px!important;height:14px!important;left:15px!important;top:18px!important;border:0!important;border-top:2px solid #42685a!important;border-left:2px solid #42685a!important;transform:rotate(45deg)!important;background:none!important}
html.qOfficialFloat body .right_icon a.LINE:focus-visible,html.qOfficialFloat body .scrollup:focus-visible,html.qOfficialFloat body .qQt:focus-visible{outline:2px solid #42685a!important;outline-offset:3px!important}
html.qOfficialFloat body .right_icon a.LINE:active,html.qOfficialFloat body .scrollup:active,html.qOfficialFloat body .qQt:active{background:#e7eee7!important}
html.qOfficialFloat body.nav-open .right_icon,html.qOfficialFloat body.nav-open .scrollup,html.qOfficialFloat body.modal-open .right_icon{display:none!important}
html.qOfficialFloat body .qQt[hidden]{display:none!important}
`;
  document.head.append(style);
  function ready(){
    const link=document.querySelector('.right_icon a.LINE');
    if(link){link.setAttribute('aria-label','加入金鶯診所 LINE');link.title='金鶯診所 LINE';link.rel='noopener noreferrer';const img=link.querySelector('img');if(img)img.alt='';}
    document.querySelectorAll('.scrollup').forEach(top=>{
      top.setAttribute('role','button');top.setAttribute('tabindex','0');top.setAttribute('aria-label','回到最上方');
      top.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();top.click();}});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();


/* Team page cleanup 20261031 */
(function(){
var p=location.pathname, team=p.indexOf('/products-')===0, detail=p.indexOf('/product-')===0;
if(!team&&!detail&&p!='/about.html'&&p.indexOf('/content')!==0)return;
var css=document.createElement('style');css.id='dk-team-cleanup-20261031';css.textContent='.subtitle1::before,.subtitle2::before,.subtitle3::before,.contitle1::before{content:none!important;display:none!important}.subtitle1>ul,.subtitle2>ul,.subtitle3>ul{display:none!important}.news_listsy:has(a[href="content-23.html"]),.news_lists:has(a[href="content-22.html"]){display:none!important}#ec-team .ec-name .dk-role-below{display:block!important;margin:10px 0 0!important}.dk-branch-hours{margin-top:24px!important}.dk-branch-hours .info_box_t{padding:20px!important}.dk-branch-hours p{margin:8px 0!important}';document.head.appendChild(css);
var branches={2:'鶯歌',3:'三樹',4:'樹林',5:'桃園',6:'土城',7:'八德',8:'龍潭',9:'大溪',10:'大竹',11:'大湳',12:'平鎮',13:'埔心',14:'觀音',15:'龍岡'};
function apply(){document.querySelectorAll('#ec-team .ec-name span').forEach(function(s){if(/^(督導|特助|倉管)$/.test(s.textContent.trim()))s.classList.add('dk-role-below')});
if(team){var m=p.match(/products-([0-9]+)/),name=branches[m&&m[1]],h=document.querySelector('.info_area');if(m&&m[1]==='1'&&h){h.style.display='none';}else if(name&&h&&!h.dataset.dkBranchHours){h.dataset.dkBranchHours='1';h.classList.add('dk-branch-hours');var split=['大竹','平鎮','埔心','觀音','龍岡'].indexOf(name)>=0;h.innerHTML='<div class="info_box_t"><h2 class="qfootlabel">全年無休</h2><p style="text-align:center" class="dk-hl">營業時間</p><p style="text-align:center" class="dk-ht">'+(split?'<span class="qtime dk-hrs"><time>7:30</time>～<time>12:00</time><time>14:00</time>～<time>18:00</time><time>18:30</time>～<time>21:30</time></span>':'<span class="qtime dk-nw">7:30～21:30 中午不休息</span>')+'</p></div>';}}}
function start(){apply();var queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;apply()})}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
/* Doctor four-week schedule embeds 20261031: team pages (/products-N) and doctor pages (/product-*) */
(function(){
var p=location.pathname,team=/^\/products-\d+\.html$/.test(p),detail=/^\/product-[\w-]+\.html$/.test(p);
if(!team&&!detail)return;
var ROLES='總院長|副院長|執行長|院長|減重名醫|名醫|主任醫師|主任|醫師|總藥師|藥師|營養師|護理師|顧問|秘書長|副總經理|總經理|策略長|督導|特助|倉管|經理|組長|專員';
var PRE=new RegExp('^('+ROLES+')\\s*'),SUF=new RegExp('\\s*('+ROLES+')$');
function roles(s){s=String(s||'').replace(/\s+/g,' ').trim();var pre=[],post=[],m;while((m=s.match(SUF))&&s.length>m[0].length){post.unshift(m[1]);s=s.slice(0,-m[0].length);}while((m=s.match(PRE))&&s.length>m[0].length){pre.push(m[1]);s=s.slice(m[0].length);}return pre.concat(post).join(' ');}
function bare(s){s=String(s||'').replace(/\s+/g,' ').trim();var m;while((m=s.match(SUF))&&s.length>m[0].length)s=s.slice(0,-m[0].length);while((m=s.match(PRE))&&s.length>m[0].length)s=s.slice(m[0].length);return s.trim();}
var css=document.createElement('style');css.id='dk-doctor-week-20261031';
css.textContent='.dk-dr-week{position:relative;width:100%;max-width:560px;margin:4px auto 0;background:transparent;cursor:zoom-in;-webkit-tap-highlight-color:transparent}'
+'.dk-dr-week iframe{display:block;width:100%;height:260px;border:0;background:transparent;pointer-events:none;visibility:hidden}'
+'.dk-dr-week.dk-ready iframe{visibility:visible}'
+'.dk-dr-week:not(.dk-ready)::before{content:"班表載入中…";position:absolute;left:0;right:0;top:110px;text-align:center;color:#61736e;font-size:14px;letter-spacing:.1em}'
+'.dk-dr-week:focus-visible{outline:2px solid #2a9189;outline-offset:2px;border-radius:8px}'
+'#ec-team .ec-name{word-break:keep-all}'
+'#dkDocLb{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:64px 12px 16px;background:rgba(10,20,18,.82);box-sizing:border-box}'
+'#dkDocLb[hidden]{display:none}'
+'#dkDocLb>.dkLbClose{position:absolute;top:12px;right:12px;width:40px;height:40px;padding:0;border:0;border-radius:50%;background:#fff;color:#1e2b28;font-size:24px;line-height:1;cursor:pointer}'
+'#dkDocLb>.dkLbCard{position:relative;display:flex;flex-direction:column;width:100%;max-width:560px;height:100%;max-height:900px;overflow:hidden;border-radius:10px;background:#fff}'
+'#dkDocLb .dkLbHead{flex:none;padding:16px 20px 10px;border-bottom:0;font-size:18px;font-weight:700;line-height:1.3;color:#1f3b33;letter-spacing:.04em}'
+'#dkDocLb .dkLbHead small{margin-left:8px;font-size:14px;font-weight:500;color:#1f6f69}'
+'#dkDocLb iframe{display:block;flex:1;width:calc(100% - 28px);margin:0 14px 14px;border-radius:12px;min-height:0;border:0;visibility:hidden}'
+'#dkDocLb.dk-ready iframe{visibility:visible}'
+'#dkDocLb .dkLbLoad{position:absolute;left:0;right:0;top:45%;text-align:center;color:#61736e;font-size:15px;letter-spacing:.1em}'
+'#dkDocLb.dk-ready .dkLbLoad{display:none}';
document.head.appendChild(css);
var HIDE='.brand,.portal-picker,.doctor-header{display:none!important}.portal-content{padding:0!important}.portal-team.doctor-focus{--doctor-menu-height:0px!important}.portal-team,.doctor-cards{height:100%!important}.doctor-card{margin:0!important;border:0!important;box-shadow:none!important;background:transparent!important;height:100%!important;max-height:none!important}.viewport{background:transparent!important}';
var BIG='.dlw-board .sw-columns,.dlw-board .sw-day{grid-template-columns:56px repeat(3,minmax(0,1fr))!important;column-gap:10px!important}.sw-board .sw-day-label time{font-size:18px!important;line-height:1.15!important;white-space:nowrap!important}.sw-board .sw-day-label b{font-size:13px!important;line-height:1.35!important;padding:0 4px!important;white-space:nowrap!important}';
function src(name){return '/linedoctorschedule.html?embed=official#doctor-'+encodeURIComponent(name);}
function parts(f){try{var d=f.contentDocument,app=d&&d.getElementById('line-clinic-app'),sr=app&&app.shadowRoot;return sr?{d:d,sr:sr,h:sr.querySelector('.doctor-header h2'),sch:sr.querySelector('.doctor-live-schedule .sw-board'),vp:sr.querySelector('.viewport')}:null;}catch(e){return null;}}
function addCss(x,id,text){if(!x.sr.getElementById(id)){var s=x.d.createElement('style');s.id=id;s.textContent=text;x.sr.appendChild(s);var bg=x.d.createElement('style');bg.textContent='html,body{background:transparent!important}';x.d.head.appendChild(bg);}}
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);load(e.target);}});},{rootMargin:'1200px 0px'}):null;
function mount(img,name,full,hide,fig){
  if(!img||!name||img.getAttribute('data-dk-week'))return;img.setAttribute('data-dk-week','1');
  var box=document.createElement('div');box.className='dk-dr-week';box.dkName=name;box.dkFull=full||name;box.dkHide=hide;box.dkFig=fig;
  box.setAttribute('role','button');box.setAttribute('tabindex','0');box.setAttribute('aria-label',(full||name)+' 個人班表，點擊放大');
  var f=document.createElement('iframe');f.title=name+' 四週醫師班表';f.setAttribute('scrolling','no');f.setAttribute('tabindex','-1');f.setAttribute('aria-hidden','true');box.appendChild(f);
  hide.parentNode.insertBefore(box,hide);hide.style.display='none';if(fig)fig.classList.add('dk-week-on');
  box.addEventListener('click',function(){openLb(box);});
  box.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openLb(box);}});
  if(io)io.observe(box);else load(box);
}
function revert(box){if(box.dkMO)box.dkMO.disconnect();box.dkHide.style.display='';if(box.dkFig)box.dkFig.classList.remove('dk-week-on');box.remove();}
function load(box){var f=box.firstChild;f.addEventListener('load',function(){prep(box,0);});f.src=src(box.dkName);}
function setH(box,f,h){
  var cur=f.offsetHeight;if(Math.abs(h-cur)<3)return;
  var top=box.getBoundingClientRect().top;f.style.height=h+'px';
  if(top<0)window.scrollBy(0,h-cur);
}
function prep(box,n){
  if(!box.isConnected)return;var f=box.firstChild,x=parts(f);
  if(x&&x.h&&x.sch&&x.vp){
    if(x.h.textContent.replace(/\s+/g,'').indexOf(box.dkName)!==0){revert(box);return;}
    addCss(x,'dk-week-only',HIDE);
    requestAnimationFrame(function(){requestAnimationFrame(function(){box.classList.add('dk-ready');});});
    /* the board fills the frame; only grow (never shrink) while its rows overflow, so the size cannot oscillate */
    var steps=0,queued=false,grow=function(){queued=false;if(steps>=6)return;var b=x.sr.querySelector('.doctor-live-schedule .sw-board'),wk=b&&b.querySelector('.sw-week');if(!b||!wk)return;
      var over=wk.scrollHeight-wk.clientHeight;if(over<2&&!b.classList.contains('dlw-overflow'))return;
      var cur=f.offsetHeight,h=Math.min(640,cur+Math.max(over+4,20));if(h<=cur)return;steps++;setH(box,f,h);};
    var later=function(){if(!queued){queued=true;setTimeout(grow,120);}};
    box.dkMO=new f.contentWindow.MutationObserver(later);box.dkMO.observe(x.sr,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    later();return;
  }
  if(n<100)setTimeout(function(){prep(box,n+1);},150);else revert(box);
}
var lb,lbFrame,lbHead,lbState=null,KEY='dkDocLb';
function makeLb(){
  if(lb)return;
  lb=document.createElement('div');lb.id='dkDocLb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','個人班表');
  lb.innerHTML='<button type="button" class="dkLbClose" aria-label="關閉">&times;</button><div class="dkLbCard"><div class="dkLbHead"></div><div class="dkLbLoad">班表載入中…</div></div>';
  document.body.appendChild(lb);lbHead=lb.querySelector('.dkLbHead');
  lb.querySelector('.dkLbClose').addEventListener('click',hideLb);
  lb.addEventListener('click',function(e){if(e.target===lb)hideLb();});
  document.addEventListener('keydown',function(e){if(!lb.hidden&&e.key==='Escape'){e.preventDefault();hideLb();}});
  window.addEventListener('popstate',function(e){if(!lb.hidden&&!(e.state&&e.state[KEY]))closeLb();});
}
function styleLb(n,fr){
  if(!lb||lb.hidden||!fr||fr!==lbFrame)return;var x=parts(fr);
  if(x&&x.h&&x.sch&&x.h.textContent.replace(/\s+/g,'').indexOf(fr.dkName)===0){addCss(x,'dk-week-pop',HIDE+BIG);
    if(!x.d.documentElement.hasAttribute('data-dk-esc')){x.d.documentElement.setAttribute('data-dk-esc','');x.d.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();hideLb();}});}
    requestAnimationFrame(function(){requestAnimationFrame(function(){if(fr===lbFrame)lb.classList.add('dk-ready');});});
    return;}
  if(n<80)setTimeout(function(){styleLb(n+1,fr);},125);else lb.classList.add('dk-ready');
}
function openLb(box){
  makeLb();
  var name=box.dkName,rest=roles(box.dkFull);
  lbHead.textContent=name;if(rest){var s=document.createElement('small');s.textContent=rest;lbHead.appendChild(s);}
  lbState={x:window.scrollX,y:window.scrollY,body:document.body.style.cssText,root:document.documentElement.style.overflow,opener:box};
  document.body.style.position='fixed';document.body.style.top=(-lbState.y)+'px';document.body.style.left=(-lbState.x)+'px';document.body.style.width='100%';document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';
  var st=Object.assign({},history.state||{});st[KEY]=1;history.pushState(st,'',location.href);
  lb.hidden=false;
  /* a fresh frame on every open: iOS Safari can leave a re-shown iframe blank */
  lb.classList.remove('dk-ready');if(lbFrame)lbFrame.remove();
  var fr=document.createElement('iframe');fr.title=name+' 個人班表';fr.dkName=name;lbFrame=fr;
  fr.addEventListener('load',function(){styleLb(0,fr);});
  fr.src=location.origin+src(name);lbHead.parentNode.insertBefore(fr,lbHead.nextSibling);
  styleLb(0,fr);lb.querySelector('.dkLbClose').focus({preventScroll:true});
}
function hideLb(){if(!lb||lb.hidden)return;var own=!!(history.state&&history.state[KEY]);closeLb();if(own)history.back();}
function closeLb(){if(!lb||lb.hidden)return;lb.hidden=true;lb.classList.remove('dk-ready');if(lbFrame){lbFrame.remove();lbFrame=null;}var s=lbState;if(!s)return;document.body.style.cssText=s.body;document.documentElement.style.overflow=s.root;window.scrollTo(s.x,s.y);if(s.opener&&s.opener.isConnected)s.opener.focus({preventScroll:true});lbState=null;}
function apply(){
  if(team)document.querySelectorAll('#ec-team article.ec-doc').forEach(function(a){
    var fig=a.querySelector('figure.ec-sch'),img=fig&&fig.querySelector('img'),h=a.querySelector('.ec-name');if(!img||!h)return;
    var name='';h.childNodes.forEach(function(c){if(c.nodeType===3)name+=c.textContent;});
    mount(img,bare(name),h.textContent.replace(/\s+/g,' ').trim(),img,fig);
  });
  if(detail){var img=document.querySelector('#myTabContent img'),t=document.querySelector('.producttitle');if(img&&t){var wrap=img.parentElement&&img.parentElement.children.length===1&&img.parentElement.closest('#myTabContent')?img.parentElement:img;mount(img,bare(t.textContent),t.textContent.replace(/\s+/g,' ').trim(),wrap,null);}}
}
function start(){apply();var queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;apply();});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
/* Team page builder 20261031: build #ec-team from site-theme-entry instead of waiting for GTM, so the raw portrait grid never shows */
(function(){
if(!/^\/products-\d+\.html$/.test(location.pathname)||document.getElementById('ec-team'))return;
var form=document.querySelector('form#cartform.product_boths');if(!form)return;
var items=Array.prototype.map.call(form.querySelectorAll('.proh'),function(el){
  var a=el.querySelector('a[href*="product-"]'),im=el.querySelector('.proimg img'),nm=el.querySelector('.pronameone');if(!a)return null;
  var href=a.getAttribute('href');return {href:href,id:(href.match(/product-([\w-]+)\.html/)||[,href])[1],thumb:im?im.getAttribute('src'):'',name:nm?nm.textContent.trim():''};
}).filter(Boolean);
if(!items.length)return;
var EC_CSS="\n#ec-team{max-width:1140px;margin:0 auto 24px;padding:0 15px;font-size:16px;line-height:1.55;color:#1e2b28;box-sizing:border-box}\n#ec-team *{box-sizing:border-box}\n#ec-team .ec-jump{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px;font-size:15px;float:none;clear:both;width:100%}\n#ec-team .ec-jump a{float:none;width:auto;display:inline-block;padding:3px 10px;border:1px solid #dbe6e2;border-radius:999px;background:#fff;color:#1e2b28;text-decoration:none}\n#ec-team .ec-jump a:hover{border-color:#2a9189;color:#1f6f69}\n#ec-team .ec-list{background:#fff;border:1px solid #dbe6e2;border-radius:14px;overflow:hidden;float:none;clear:both;width:100%}\n#ec-team .ec-doc{float:none;clear:both;width:100%;display:grid;grid-template-columns:168px minmax(0,1fr) 380px;gap:0 18px;align-items:center;padding:12px 16px;margin:0;border-top:1px solid #dbe6e2;scroll-margin-top:90px}\n#ec-team .ec-doc:first-child{border-top:0}\n#ec-team .ec-id{display:flex;flex-direction:column;align-items:stretch;text-align:center;gap:6px;align-self:stretch;justify-content:center}\n#ec-team .ec-avatar{display:block;width:100%;aspect-ratio:3/4;height:auto;border-radius:12px;object-fit:cover;object-position:center top;border:1px solid #dbe6e2;background:#fff}\n#ec-team .ec-name{margin:4px 0 0;font-size:24px;font-weight:700;line-height:1.25;text-wrap:balance}\n#ec-team .ec-name span{display:inline-block;font-size:14px;font-weight:500;color:#1f6f69;margin-left:6px;white-space:nowrap}\n#ec-team .ec-name span.ec-pre{display:block;margin:0 0 2px}\n#ec-team .ec-txt{display:flex;flex-direction:column;gap:10px;min-width:0}\n#ec-team h3{margin:0 0 6px;font-size:15px;font-weight:700;letter-spacing:.08em;color:#3f6b5e;border-left:3px solid #2a9189;padding-left:6px;line-height:1.3;display:flex;gap:8px;align-items:baseline}\n#ec-team h3 small{font-weight:400;letter-spacing:0;color:#61736e;font-size:13px}\n#ec-team .ec-txt ul{margin:0;padding-left:1.1em;font-size:16px;line-height:1.6;list-style:disc}\n#ec-team .ec-txt li{margin:0}\n#ec-team .ec-txt p{margin:0;font-size:16px}\n#ec-team .ec-empty{color:#61736e;font-size:14px;font-style:italic}\n#ec-team .ec-sch{margin:0;min-width:0}\n#ec-team .ec-sch img{display:block;width:100%;height:auto;border-radius:8px;border:1px solid #dbe6e2;cursor:zoom-in}\n#ec-lb{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,20,18,.82);display:flex;align-items:center;justify-content:center;padding:16px;z-index:99999;cursor:zoom-out}\n#ec-lb[hidden]{display:none}\n#ec-lb img{width:100%;max-width:1100px;max-height:100%;object-fit:contain;border-radius:10px;background:#fff}\n#ec-lb button{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#1e2b28;font-size:24px;line-height:1;cursor:pointer;padding:0}\n@media (max-width:960px){\n#ec-team .ec-doc{grid-template-columns:150px minmax(0,1fr)}\n#ec-team .ec-sch{grid-column:1/-1;max-width:420px;margin-top:8px}\n}\n@media (max-width:640px){\n#ec-team .ec-doc{grid-template-columns:1fr;gap:12px}\n#ec-team .ec-id{order:1}\n#ec-team .ec-sch{order:2;grid-column:auto;max-width:none;margin-top:0}\n#ec-team .ec-txt{order:3}\n#ec-team .ec-id{flex-direction:row;text-align:left;gap:14px;align-items:center}\n#ec-team .ec-avatar{width:120px;flex:none}\n#ec-team .ec-name{text-align:left}\n#ec-team .ec-sch{max-width:none}\n}\n";
var css=document.createElement('style');css.id='dk-ec-team-css-20261031';
css.textContent=EC_CSS+'#ec-team.dk-team-loading{min-height:70vh;padding-top:40px;text-align:center}#ec-team.dk-team-loading::before{content:"醫師資料載入中…";color:#61736e;font-size:15px;letter-spacing:.1em}';
document.head.appendChild(css);
var box=document.createElement('div');box.id='ec-team';box.className='dk-team-loading';
form.parentNode.insertBefore(box,form);form.style.display='none';
var ROLES='總院長|副院長|執行長|院長|減重名醫|名醫|主任醫師|主任|醫師|總藥師|藥師|營養師|護理師|顧問|秘書長|副總經理|總經理|策略長|督導|特助|倉管|經理|組長|專員';
var PRE=new RegExp('^('+ROLES+')\\s*'),SUF=new RegExp('\\s*('+ROLES+')$');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function sections(root){var out=[],cur=null;if(!root)return out;
  Array.prototype.forEach.call(root.querySelectorAll(':scope > div > *, :scope > *'),function(el){
    if(el.tagName==='DIV')return;
    if(el.tagName==='STRONG'||el.tagName==='B'||/^H[1-6]$/.test(el.tagName)){cur={title:el.textContent.trim(),html:''};out.push(cur);}
    else if(cur&&el.tagName!=='BR')cur.html+=el.outerHTML;
  });return out;}
function find(list,keys){for(var i=0;i<list.length;i++)for(var j=0;j<keys.length;j++)if(list[i].title.indexOf(keys[j])>-1)return list[i];return null;}
function fetchDoc(it){
  return fetch(it.href,{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(html){
    var d=new DOMParser().parseFromString(html,'text/html'),t=d.querySelector('.producttitle'),full=(t?t.textContent:it.name).trim();
    var rest=full.replace(/\s+/g,' ').trim(),pre=[],post=[],m;
    while((m=rest.match(SUF))&&rest.length>m[0].length){post.unshift(m[1]);rest=rest.slice(0,-m[0].length);}
    while((m=rest.match(PRE))&&rest.length>m[0].length){pre.push(m[1]);rest=rest.slice(m[0].length);}
    var p,n,ti;if(rest.length<2){p='';n=full;ti='';}else{p=pre.join(' ');n=rest;ti=post.join(' ');}
    var secs=sections(d.querySelector('.baseprod')),edu=find(secs,['學經歷','學歷','經歷']),spec=find(secs,['治療專科','專科','證書','專長']);
    var sch=d.querySelector('.proddetail img, #myTabContent img'),av=d.querySelector('.sp-slide img, .sp-thumbnail img');
    return {id:it.id,pre:p,name:n,title:ti,full:full,avatar:it.thumb||(av?av.getAttribute('src'):''),edu:edu?edu.html:'',spec:spec?spec.html:'',sched:sch?sch.getAttribute('src'):''};
  })['catch'](function(){return null;});
}
function render(docs){
  var empty='<p class="ec-empty">尚未填寫</p>';
  box.innerHTML='<div class="ec-jump">'+docs.map(function(c){return '<a href="#ec-'+c.id+'">'+esc(c.full)+'</a>';}).join('')+'</div><div class="ec-list">'+docs.map(function(c){
    return '<article class="ec-doc" id="ec-'+c.id+'"><div class="ec-id"><img class="ec-avatar" src="'+esc(c.avatar)+'" alt=""><h2 class="ec-name">'+(c.pre?'<span class="ec-pre">'+esc(c.pre)+'</span>':'')+esc(c.name)+(c.title?'<span>'+esc(c.title)+'</span>':'')+'</h2></div>'
      +'<div class="ec-txt"><section><h3>學經歷</h3>'+(c.edu||empty)+'</section><section><h3>治療專科／證書</h3>'+(c.spec||empty)+'</section></div>'
      +'<figure class="ec-sch"><h3>個人班表 <small>點圖可放大</small></h3>'+(c.sched?'<img src="'+esc(c.sched)+'" alt="'+esc(c.full)+' 班表" loading="lazy" data-ec-zoom>':'<p class="ec-empty">尚未上傳班表</p>')+'</figure></article>';
  }).join('')+'</div>';
  box.className='';
  var lb=document.getElementById('ec-lb');
  if(!lb){lb=document.createElement('div');lb.id='ec-lb';lb.hidden=true;lb.innerHTML='<button type="button" aria-label="關閉">&times;</button><img alt="">';document.body.appendChild(lb);
    lb.addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}
  var big=lb.querySelector('img');
  function close(){lb.hidden=true;document.body.style.overflow='';}
  Array.prototype.forEach.call(box.querySelectorAll('img[data-ec-zoom]'),function(im){im.addEventListener('click',function(){big.src=im.src;big.alt=im.alt;lb.hidden=false;document.body.style.overflow='hidden';});});
  if(location.hash&&/^#ec-/.test(location.hash)){var tg=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(tg)tg.scrollIntoView();}
}
var done=false;
function giveUp(){if(done)return;done=true;box.remove();form.style.display='';}
setTimeout(giveUp,20000);
Promise.all(items.map(fetchDoc)).then(function(r){if(done)return;r=r.filter(Boolean);if(!r.length){giveUp();return;}done=true;render(r);},giveUp);
})();
/* Doctor specialty label 20261031: insert 專長 before the specialty line of 學經歷, matching the LINE doctor pages (doctorSpecialtyStarts in CMS 39/40/41) */
(function(){
var p=location.pathname,team=/^\/products-\d+\.html$/.test(p),detail=/^\/product-[\w-]+\.html$/.test(p);
if(!team&&!detail)return;
var STARTS={"林永昌": "成人及小兒耳鼻喉、皮膚、感冒過敏、腸胃炎、慢性病", "陳珠": "兒童疾病、小兒胃腸、成人感冒、久咳不癒、過敏氣喘、皮膚疾病", "蕭捷存": "成人及小兒耳鼻喉、呼吸道感染", "陳富玫": "專治久咳氣喘鼻過敏皮膚過敏", "闕壯理": "常 見 急 性 症 狀", "黃允玫": "耳痛、中耳炎、耳鳴、耳悶塞、眩量", "何中誠": "呼吸道感染、過敏性鼻炎", "陳永仁": "各式心臟疾病", "蕭宇伯": "高血壓、高血脂、糖尿病", "李豪權": "兒童發展評估及疫苗注射", "曾㨗聖": "呼吸道疾病（感染、氣喘、鼻過敏）", "陳佳舜": "小兒及成人感冒、耳鼻喉疾病，呼吸道疾病", "高國峯": "成人與小兒感冒、發燒、咳嗽", "陳昭銘": "感冒、急性腸胃炎、久咳不癒、", "張簡千郁": "一般內科疾病(慢性病、三高)、", "黃濰": "兒童及成人感冒", "何金蔚": "上呼吸道感染、過敏、氣喘", "廖崑竹": "失眠、焦慮、憂鬱、躁鬱", "李彥輝": "咽喉疾病：感冒、喉嚨痛、", "王志冉": "韓文門診", "曾韋綸": "急診醫學", "何冠達": "小兒及成人感染症", "何中庸": "慢性疾病:糖尿病、高血壓、高血脂(瞻固醇/三酸甘油脂)、甲狀腺疾病、痛風(高尿酸血症)、胃食道逆流、氣喘、慢性肺病。", "華志倫": "小兒發燒及不明熱、中耳炎及鼻竇炎、", "林鼎盛": "一般兒科、成人慢性疾病", "林昆澤": "小兒及成人呼吸道、腸胃道疾病", "巫清隆": "耳科：眩暈、耳鳴、中耳積水、聽力障礙等", "呂瑩純": "一般兒科疾病", "謝騰緯": "兒童一般內科", "李逸瑋": "一般兒科、兒童感染症", "沈士強": "呼吸道過敏感染、減重", "洪岱熙": "呼吸道感染(感冒)、尿道感染", "甘家銘": "慢性病（高血壓、高血脂、糖尿病）", "梁培毅": "兒科", "徐翊庭": "成人內外科疑難雜症", "侯進坤": "呼吸道疾病、腸胃道疾病、過敏", "林君瀚": "兒科、耳鼻喉科", "楊大緯": "急診醫學", "黃錦崧": "小兒科、耳鼻喉、皮膚病、減重"};
var ROLES='總院長|副院長|執行長|院長|減重名醫|名醫|主任醫師|主任|醫師|總藥師|藥師|營養師|護理師|顧問|秘書長|副總經理|總經理|策略長|督導|特助|倉管|經理|組長|專員';
var PRE=new RegExp('^('+ROLES+')\\s*'),SUF=new RegExp('\\s*('+ROLES+')$');
function bare(s){s=String(s||'').replace(/\s+/g,' ').trim();var m;while((m=s.match(SUF))&&s.length>m[0].length)s=s.slice(0,-m[0].length);while((m=s.match(PRE))&&s.length>m[0].length)s=s.slice(m[0].length);return s.trim();}
function norm(s){return String(s||'').replace(/\s+/g,'');}
var css=document.createElement('style');css.id='dk-specialty-20261031';
css.textContent='#ec-team ul>li.dk-specialty{list-style:none!important;margin:12px 0 6px -1.1em!important;padding:0 0 0 6px!important;border-left:3px solid #2a9189;font-size:15px!important;font-weight:700!important;color:#3f6b5e!important;letter-spacing:.08em;line-height:1.3!important}'
+'.baseprod li.dk-specialty{list-style:none!important;margin-top:18px!important;margin-bottom:12px!important;padding:0!important}.baseprod li.dk-specialty strong{display:inline-block}';
document.head.appendChild(css);
function mark(box,name,pill){
  if(!box||box.querySelector('li.dk-specialty'))return;var start=STARTS[name];if(!start)return;
  var key=norm(start),lis=box.querySelectorAll('li'),hit=null;
  for(var i=0;i<lis.length&&!hit;i++)if(norm(lis[i].textContent)===key)hit=lis[i];
  for(var j=0;j<lis.length&&!hit;j++)if(norm(lis[j].textContent).indexOf(key)===0)hit=lis[j];
  if(!hit)return;
  var ul=hit.parentNode;if(name==='楊大緯')ul.appendChild(hit);
  var lab=document.createElement('li');lab.className='dk-specialty';
  if(pill){var s=document.createElement('strong');s.textContent='專長';lab.appendChild(s);}else lab.textContent='專長';
  ul.insertBefore(lab,hit);
  /* doctor pages: line the 專長 pill up with the 學經歷 pill */
  var ref=pill&&box.querySelector('strong');if(ref&&lab.firstChild){var dx=lab.firstChild.getBoundingClientRect().left-ref.getBoundingClientRect().left;if(Math.abs(dx)>1)lab.style.marginLeft=(-dx)+'px';}
}
function apply(){
  if(team)document.querySelectorAll('#ec-team article.ec-doc').forEach(function(a){
    var h=a.querySelector('.ec-name'),sec=a.querySelector('.ec-txt section');if(!h||!sec)return;
    var name='';h.childNodes.forEach(function(c){if(c.nodeType===3)name+=c.textContent;});
    mark(sec,bare(name));
  });
  if(detail){var t=document.querySelector('.producttitle'),b=document.querySelector('.baseprod');if(t&&b)mark(b,bare(t.textContent),true);}
}
function start(){apply();var queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;apply();});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
/* Hours card layout 20261031: one range per line, ranges lined up on the ～, single ranges never wrap */
(function(){
var css=document.createElement('style');css.id='dk-hours-css-20261031';
css.textContent='html body .info_area .info_box_t p .qtime.dk-hrs{display:inline-grid!important;grid-template-columns:auto auto auto;column-gap:1px;text-align:left;vertical-align:top;font-variant-numeric:tabular-nums;white-space:nowrap}'
+'html body .info_area .info_box_t .qtime.dk-hrs time{text-align:right}'
+'html body .info_area .info_box_t .qtime.dk-hrs time:nth-of-type(even){text-align:left}'
+'html body .info_area .info_box_t p .qtime.dk-nw{white-space:nowrap!important}'
+'html body .info_area .info_box_t p.dk-hl.dk-hl{margin-bottom:0!important}'
+'html body .info_area .info_box_t p.dk-ht.dk-ht{margin-top:0!important}'
+'.info_area dk-n{white-space:nowrap}';
document.head.appendChild(css);
var RE=/^(\d{1,2}:\d{2})\s*[～~〜–-]\s*(\d{1,2}:\d{2})$/;
function fmt(){
  /* keep each branch name whole; only break after the dot */
  Array.prototype.forEach.call(document.querySelectorAll('.info_area .info_box_t div>b:not([data-dk-names])'),function(b){
    var parts=b.textContent.split(/\s*[·・•]\s*/).filter(Boolean);b.setAttribute('data-dk-names','1');if(parts.length<2)return;
    b.innerHTML=parts.map(function(n){return '<dk-n>'+n.replace(/[&<>]/g,'')+'</dk-n>';}).join('·<wbr>');
  });
  Array.prototype.forEach.call(document.querySelectorAll('.info_area .info_box_t p>.qtime:not(.dk-hrs):not(.dk-nw)'),function(q){
    var p=q.parentNode,txt=q.innerHTML.replace(/<br\s*\/?>/gi,'、').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
    var segs=txt.split(/\s*[、，,]\s*/).filter(Boolean);
    if(segs.length>1&&segs.every(function(s){return RE.test(s);})){
      q.innerHTML=segs.map(function(s){var m=s.match(RE);return '<time>'+m[1]+'</time>～<time>'+m[2]+'</time>';}).join('');q.classList.add('dk-hrs');
    }else q.classList.add('dk-nw');
    var lab='';Array.prototype.slice.call(p.childNodes).forEach(function(n){if(n!==q&&n.nodeType===3){lab+=n.textContent;p.removeChild(n);}});
    lab=lab.replace(/[：:\s]+$/,'').trim();
    if(lab){var l=document.createElement('p');l.className='dk-hl';l.setAttribute('style',p.getAttribute('style')||'text-align:center');l.textContent=lab;p.parentNode.insertBefore(l,p);p.classList.add('dk-ht');}
  });
}
/* run after the page's own DOMContentLoaded handlers (trackall wraps the card only while it still has 4 children) */
function start(){setTimeout(function(){fmt();var queued=false,mo=new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;fmt();});});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},15000);},0);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.addEventListener('load',fmt);
})();
/* Info page region tabs 20261031: drop the theme's ▼ marker over the active tab and the space it needed */
(function(){
var s=document.createElement('style');s.id='dk-ellink-css-20261031';
s.textContent='.el_link ul li b::before{content:none!important;display:none!important}.el_link ul li b{padding-top:5px!important}@media (max-width:767px){.el_link ul{margin:0 0 16px!important}}';
document.head.appendChild(s);
})();
