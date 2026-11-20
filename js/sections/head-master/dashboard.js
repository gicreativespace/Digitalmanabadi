// Head Master-only dashboard presentation.
// Keep live statistics empty until the corresponding Firebase data services exist.
export function renderHeadMasterDashboardIntro({state,T,APP_CONFIG,escapeHtml}) {
 if(state.role!=="hm") return "";
 const t=(te,en)=>T?T(te,en):te;
 const school=state.headMasterProfile?.school?.schoolName || APP_CONFIG?.schoolName || "MPMPS School, Dagguluru";
 const hour=new Date().getHours();
 const greeting=hour>=5&&hour<12?["శుభోదయం!","Good Morning!"]:hour>=12&&hour<17?["శుభ మధ్యాహ్నం!","Good Afternoon!"]:["శుభ సాయంత్రం!","Good Evening!"];
 const roleQuotes=[
  ["ఒక మంచి పాఠశాల, దారిచూపే నాయకత్వంతో మరియు శ్రద్ధగల ప్రతి హృదయంతో ఎదుగుతుంది.","A good school grows through thoughtful leadership and every caring heart."],
  ["ప్రతి విద్యార్థిలోని సామర్థ్యాన్ని గుర్తించడం గొప్ప నాయకత్వం.","Great leadership begins by recognising the potential in every student."],
  ["ఈరోజు ఇచ్చే ప్రోత్సాహం, రేపటి విజయానికి పునాది.","The encouragement we give today becomes the foundation for tomorrow's success."],
  ["పాఠశాల అభివృద్ధి ఒకరి పని కాదు; అందరి సమిష్టి ప్రయాణం.","A school's progress is not one person's work; it is a journey we build together."],
  ["క్రమశిక్షణతో కూడిన ప్రేమ, విద్యార్థుల భవిష్యత్తును వెలిగిస్తుంది.","Guidance with care helps illuminate a student's future."],
  ["ప్రతి మంచి మార్పు, ఒక చిన్న మంచి నిర్ణయంతో మొదలవుతుంది.","Every meaningful change begins with one thoughtful decision."],
  ["ఉపాధ్యాయులకు తోడుగా నిలిచి, విద్యార్థులకు దారి చూపడమే నాయకత్వం.","Leadership means supporting teachers and creating pathways for students."]
 ];
 const dayOfYear=Math.floor((new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())-new Date(new Date().getFullYear(),0,0))/86400000);
 const dailyQuote=roleQuotes[dayOfYear%roleQuotes.length];
 const modules=[
  ["users","Class & Teacher Management","తరగతులు, విద్యార్థులు మరియు ఉపాధ్యాయులు","Class & Teacher Management"],
  ["book-open","Diary","విషయాల వారీగా Class Work & Home Work","Diary"],
  ["megaphone","Notice Board","ఆమోదించిన పాఠశాల నోటీసులు","Notice Board"],
  ["calendar-days","Events & Calendar","సెలవులు, పుట్టినరోజులు, కార్యక్రమాలు","Events & Calendar"],
  ["lightbulb","Great People & Quotes","ప్రేరణ మరియు విజ్ఞానం","Great People & Quotes"],
  ["hand-heart","Alumni & Donor Management","సహాయం, దాతలు, వాలంటీర్లు","Alumni & Donor Management"],
 ];
 const icons={users:"♧","book-open":"▤",megaphone:"◖","calendar-days":"▦",lightbulb:"✦","hand-heart":"♡",globe:"◎",utensils:"♨",calendar:"▣",clipboard:"☷"};
 return `
 <style>
 .hm-dashboard{--hm-green:#34764a;--hm-deep:#244b32;--hm-muted:#718174;--hm-gold:#b18c3d;color:var(--text);display:grid;gap:18px}
 .hm-welcome,.hm-panel,.hm-stat,.hm-module{background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:0 8px 24px rgba(31,73,48,.055)}
 .hm-welcome{padding:22px;background:linear-gradient(125deg,#edf6ed 0%,#fff 70%);border-color:#dceadd}
 [data-theme=dark] .hm-welcome{background:linear-gradient(125deg,#1b3022,#202923);border-color:var(--border)}
 .hm-eyebrow{font-size:11px;letter-spacing:.12em;color:#68816b;font-weight:800}
 .hm-welcome h1{margin:8px 0 4px;color:#244b32;font-size:clamp(24px,4vw,32px);line-height:1.2}
 [data-theme=dark] .hm-welcome h1{color:#d7ead9}
 .hm-welcome p{margin:0;color:var(--hm-muted);font-size:13px}
 .hm-motivation{margin-top:15px;padding:13px 15px;border-left:3px solid var(--hm-gold);border-radius:0 13px 13px 0;background:rgba(255,255,255,.72)}
 [data-theme=dark] .hm-motivation{background:rgba(255,255,255,.05)}
 .hm-motivation-label{font-size:10px;letter-spacing:.1em;font-weight:800;color:var(--hm-gold);margin-bottom:5px}
 .hm-motivation blockquote{margin:0;color:var(--hm-deep);font-size:14px;font-weight:650;line-height:1.55}
 [data-theme=dark] .hm-motivation blockquote{color:#e1eee2}
 .hm-section-title{display:flex;justify-content:space-between;align-items:end;gap:10px;margin:0 0 10px}
 .hm-section-title h2{font-size:17px;margin:0;color:var(--text)}
 .hm-section-title p{font-size:12px;color:var(--hm-muted);margin:3px 0 0}
 .hm-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .hm-stat{padding:15px;min-width:0}
 .hm-stat-top{display:flex;justify-content:space-between;align-items:center;color:var(--hm-green);font-size:20px}
 .hm-stat strong{display:block;font-size:28px;color:var(--hm-deep);margin:7px 0 2px}
 [data-theme=dark] .hm-stat strong{color:#d7ead9}
 .hm-stat span{font-size:12px;color:var(--hm-muted)}
 .hm-panel{padding:16px}
 .hm-action-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
 .hm-action{min-width:0;border:1px solid var(--border);background:var(--surface2);border-radius:15px;padding:12px 9px;text-align:left;color:var(--text);display:flex;flex-direction:column;gap:8px;cursor:pointer}
 .hm-action-icon{font-size:21px;color:var(--hm-green)}
 .hm-action strong{font-size:13px;line-height:1.35}
 .hm-action small{font-size:11px;color:var(--hm-muted);line-height:1.4}
 .hm-review-mark{display:none;align-self:flex-start;border-radius:99px;background:#fff1d6;color:#8c641a;padding:3px 7px;font-size:10px;font-weight:800}
 .hm-review-mark[data-count]:not([data-count="0"]){display:inline-flex}
 .hm-meal{display:flex;align-items:center;justify-content:space-between;gap:12px}
 .hm-meal h3{font-size:15px;margin:0 0 4px}
 .hm-meal p{font-size:12px;color:var(--hm-muted);margin:0}
 .hm-meal button,.hm-link-button{border:0;background:#edf5ed;color:#34764a;border-radius:12px;padding:9px 12px;font-weight:700;cursor:pointer;white-space:nowrap}
 .hm-module-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .hm-module{position:relative;padding:15px;text-align:left;color:var(--text);display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-height:120px;cursor:pointer;transition:transform .18s,border-color .18s}
 .hm-module:hover{transform:translateY(-2px);border-color:#9dbda2}
 .hm-module-icon{width:36px;height:36px;border-radius:12px;background:#edf5ed;color:#34764a;display:grid;place-items:center;font-size:21px}
 .hm-module strong{font-size:13px;line-height:1.35}
 .hm-module small{font-size:11px;color:var(--hm-muted);line-height:1.4}
 .hm-module-arrow{position:absolute;right:13px;bottom:12px;color:var(--hm-gold)}
 .hm-knowledge{background:linear-gradient(120deg,#eff6ef,#fff);border:1px solid #dceadd;border-radius:18px;padding:16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
 .hm-knowledge strong{color:#244b32}
 .hm-knowledge p{font-size:12px;color:var(--hm-muted);margin:4px 0 0}
 .hm-knowledge a{color:#34764a;font-weight:800;font-size:12px;text-decoration:none;white-space:nowrap}
 @media(min-width:760px){.hm-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.hm-module-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.hm-module{min-height:140px;padding:18px}}
 @media(max-width:380px){.hm-action-list{gap:6px}.hm-action{padding:10px 7px}.hm-action strong{font-size:12px}.hm-knowledge{align-items:flex-start;flex-direction:column}}
 </style>
 <div class="hm-dashboard">
  <section class="hm-welcome">
   <div class="hm-eyebrow">HEAD MASTER DASHBOARD</div>
   <h1>${t("శుభోదయం!","Good Morning!")}</h1>
   <p>${escapeHtml?escapeHtml(school):school} · ${t("ఈరోజు పాఠశాల స్థితిగతులు","Your school at a glance")}</p>
  </section>
  <section>
   <div class="hm-section-title"><div><h2>${t("ఈరోజు హాజరు","Today's Attendance")}</h2><p>${t("మొత్తం పాఠశాల మరియు తరగతి వారీగా","Whole school and class-wise")}</p></div></div>
   <div class="hm-stats">
    <article class="hm-stat"><div class="hm-stat-top"><span>♧</span><small>${t("పాఠశాల మొత్తం","SCHOOL TOTAL")}</small></div><strong>—</strong><span>${t("మొత్తం విద్యార్థులు","Total Students")}</span></article>
    <article class="hm-stat"><div class="hm-stat-top"><span>◔</span><small>${t("ఈరోజు","TODAY")}</small></div><strong>—%</strong><span>${t("హాజరు శాతం","Attendance Percentage")}</span></article>
   </div>
   <div class="hm-panel" style="margin-top:10px">
    <div class="hm-meal"><div><h3>${t("తరగతి వారీ హాజరు & సెలవులు","Class-wise Attendance & Leaves")}</h3><p>${t("తరగతి ఎంచుకుని వివరాలు చూడండి","Choose a class to view its attendance")}</p></div><button type="button" data-module="Attendance">${t("వివరాలు","View")} →</button></div>
   </div>
  </section>
  <section>
   <div class="hm-section-title"><div><h2>${t("ఈరోజు ఆమోదాలు","Today's Approvals")}</h2><p>${t("పరిశీలించి ఆమోదించాల్సిన అంశాలు","Items awaiting review")}</p></div></div>
   <div class="hm-panel"><div class="hm-action-list">
    <button class="hm-action" type="button" data-module="Daily Diary"><span class="hm-action-icon">▤</span><strong>${t("డైరీ","Diary")}</strong><small>${t("విషయాల వారీ సమర్పణలు","Subject-wise submissions")}</small><span class="hm-review-mark" data-count="0">! ${t("పెండింగ్","Pending")}</span></button>
    <button class="hm-action" type="button" data-module="Notice Board"><span class="hm-action-icon">◖</span><strong>${t("నోటీసులు","Notices")}</strong><small>${t("ఆమోదం కోసం వచ్చిన నోటీసులు","Notices for approval")}</small><span class="hm-review-mark" data-count="0">! ${t("పెండింగ్","Pending")}</span></button>
    <button class="hm-action" type="button" data-module="Student Leaves"><span class="hm-action-icon">▣</span><strong>${t("విద్యార్థుల సెలవులు","Student Leaves")}</strong><small>${t("సెలవు అభ్యర్థనలు","Leave requests")}</small><span class="hm-review-mark" data-count="0">! ${t("పెండింగ్","Pending")}</span></button>
   </div></div>
  </section>
  <section class="hm-panel">
   <div class="hm-meal"><div><h3>♨ ${t("ఈరోజు మధ్యాహ్న భోజనం","Today's Mid-Day Meal")}</h3><p>${t("రోజువారీ మెనూ వివరాలు","Daily meal menu")}</p></div><button type="button" data-module="Mid-Day Meal">${t("మెనూ చూడండి","View Menu")} →</button></div>
  </section>
  <section>
   <div class="hm-section-title"><div><h2>${t("పాఠశాల విభాగాలు","School Sections")}</h2><p>${t("అవసరమైన పనిని విభాగం ద్వారా తెరవండి","Open each area when needed")}</p></div></div>
   <div class="hm-module-grid">
    ${modules.map(([icon,title,desc,key])=>`<button class="hm-module" type="button" data-module="${key}"><span class="hm-module-icon">${icons[icon]||"•"}</span><strong>${t(title,title)}</strong><small>${t(desc,desc)}</small><span class="hm-module-arrow">↗</span></button>`).join("")}
   </div>
  </section>
  <section class="hm-knowledge">
   <div><strong>◎ GI Knowledge World</strong><p>${t("ఒకే కేంద్ర GI Blog లింక్","One centrally managed GI Blog link")}</p></div>
   <a href="${escapeHtml?escapeHtml(APP_CONFIG?.knowledgeBlogUrl||"#"):APP_CONFIG?.knowledgeBlogUrl||"#"}" target="_blank" rel="noopener">${t("బ్లాగ్ తెరవండి","Open Blog")} ↗</a>
  </section>
 </div>`;
}
