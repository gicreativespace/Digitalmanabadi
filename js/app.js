import { APP_CONFIG } from "./config.js";

const state = {
  role: null, view: "welcome", theme: localStorage.getItem("gim_theme") || "light",
  lang: localStorage.getItem("gim_lang") || "te", selectedDate: 17,
  greatPerson: { title: "చింతలపాటి మూర్తిరాజు", summary: "విద్య, సమాజ సేవ, గ్రామీణ అభివృద్ధి కోసం కృషి చేసిన వ్యక్తి.", url: "" },
  greatQuote: { quote: "ప్రయత్నం ఆపనంత వరకు అపజయం అంతిమం కాదు.", author: "మూలం ధృవీకరించాల్సిన మాట" }
};

const modules = {
  hm: [
    ["👩‍🎓","విద్యార్థుల నిర్వహణ","విద్యార్థుల వివరాలు, తరగతులు"],
    ["👩‍🏫","టీచర్ నిర్వహణ","టీచర్ ప్రొఫైల్స్, కేటాయింపులు"],
    ["📋","హాజరు","ఉదయం, మధ్యాహ్నం హాజరు"],
    ["📖","డైలీ డైరీ","విషయాల వారీగా డైరీ"],
    ["✏️","హోంవర్క్","హోంవర్క్ నిర్వహణ"],
    ["📢","నోటీసు బోర్డు","నోటీసులు, ఆమోదాలు"],
    ["📅","ఈవెంట్స్ & క్యాలెండర్","కార్యక్రమాలు, సెలవులు"],
    ["🍲","మధ్యాహ్న భోజనం","ప్లాన్ చేసిన / వడ్డించిన భోజనం"],
    ["📝","లీవ్ అభ్యర్థనలు","సెలవుల ఆమోదం"],
    ["🕒","టైమ్‌టేబుల్","పాఠశాల, పరీక్షల టైమ్‌టేబుల్"],
    ["📊","రిపోర్ట్స్","రోజువారీ, నెలవారీ నివేదికలు"],
    ["⚙️","సెట్టింగ్స్","పాఠశాల వివరాలు, సెట్టింగ్స్"]
  ],
  teacher: [
    ["📋","ఉదయం హాజరు","కేటాయించిన తరగతి"],
    ["📋","మధ్యాహ్న హాజరు","కేటాయించిన తరగతి"],
    ["📖","డైలీ డైరీ","విషయాల వారీగా నమోదు"],
    ["✏️","హోంవర్క్","హోంవర్క్ నమోదు"],
    ["📢","నోటీసులు","నోటీసులు చూడండి"],
    ["🗓️","నా టైమ్‌టేబుల్","ఈరోజు పీరియడ్లు"],
    ["📅","క్యాలెండర్","స్కూల్ కార్యక్రమాలు"],
    ["☑️","నా పనుల స్థితి","సమర్పణల స్థితి"]
  ],
  student: [
    ["📅","నా రోజు","ఈరోజు ముఖ్య సమాచారం"],
    ["📖","డైలీ డైరీ","ఆమోదించిన డైరీ"],
    ["✏️","హోంవర్క్","నా హోంవర్క్"],
    ["🕒","టైమ్‌టేబుల్","పాఠశాల టైమ్‌టేబుల్"],
    ["📢","నోటీసులు","పాఠశాల నోటీసులు"],
    ["🎉","ఈవెంట్స్","ప్రత్యేక కార్యక్రమాలు"]
  ],
  parent: [
    ["👧","నా పిల్లలు","లింక్ చేసిన విద్యార్థులు"],
    ["📊","హాజరు","రోజువారీ, నెలవారీ హాజరు"],
    ["📖","డైలీ డైరీ","ఆమోదించిన డైరీ"],
    ["✏️","హోంవర్క్","పిల్లల హోంవర్క్"],
    ["📝","లీవ్ అప్లై","సెలవు అభ్యర్థన"],
    ["🍲","మధ్యాహ్న భోజనం","రోజువారీ భోజన వివరాలు"],
    ["📅","క్యాలెండర్","ఈవెంట్స్, సెలవులు"]
  ]
};

const t = (te,en) => state.lang === "te" ? te : en;
const main = document.querySelector("#mainView");
document.documentElement.dataset.theme = state.theme;

function closeHeaderMenus(){document.querySelectorAll('.header-menu').forEach(x=>x.remove())}
function showHeaderMenu(kind){
  closeHeaderMenus();
  const anchor=document.querySelector(kind==='language'?'#languageToggle':'#themeToggle');
  const menu=document.createElement('div');menu.className='header-menu';
  const options=kind==='language'?[['te','తెలుగు'],['en','English']]:[['light',t('లైట్','Light')],['dark',t('డార్క్','Dark')]];
  menu.innerHTML=options.map(o=>'<button type="button" class="menu-option '+(((kind==='language'?state.lang:state.theme)===o[0])?'active':'')+'" data-value="'+o[0]+'">'+o[1]+'</button>').join('');
  anchor.parentElement.append(menu);
  menu.querySelectorAll('[data-value]').forEach(b=>b.addEventListener('click',()=>{if(kind==='language'){state.lang=b.dataset.value;localStorage.setItem('gim_lang',state.lang);render()}else{state.theme=b.dataset.value;localStorage.setItem('gim_theme',state.theme);document.documentElement.dataset.theme=state.theme;updateHeaderIcons()}closeHeaderMenus()}));
}
function updateHeaderIcons(){document.querySelector('#themeToggle').textContent=state.theme==='light'?'☾':'☀';document.querySelector('#languageToggle').textContent='文'}
document.querySelector('#themeToggle').addEventListener('click',()=>showHeaderMenu('theme'));
document.querySelector('#languageToggle').addEventListener('click',()=>showHeaderMenu('language'));
document.addEventListener('click',e=>{if(!e.target.closest('.top-actions'))closeHeaderMenus()});
document.querySelector("#brandHome").addEventListener("click", () => {
  state.view = state.role ? "dashboard" : "welcome"; render();
});
document.querySelector("#themeToggle").textContent = state.theme === "light" ? "☾" : "☀";
document.querySelector("#languageToggle").textContent = "文";

function renderWelcome() {
  main.innerHTML = `
    <section class="welcome-panel">
      <div class="welcome-kicker">${t("GI స్కూల్ మేనేజ్‌మెంట్ ప్లాట్‌ఫామ్","GI SCHOOL MANAGEMENT PLATFORM")}</div>
      <h1>${t("స్వాగతం","Welcome")}</h1>
      <p>${t("మీ పాత్రను ఎంచుకోండి","Please select your role")}</p>
    </section>
    <section class="role-stack" aria-label="${t("పాత్ర ఎంపిక","Choose your role")}">
      ${roleCard("♙","ప్రిన్సిపాల్","Principal","hm","green")}
      ${roleCard("✎","టీచర్","Teacher","teacher","gold")}
      ${roleCard("♧","పేరెంట్","Parent","parent","blue")}
    </section>`;
  main.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>{state.role=b.dataset.role;state.view='login';render()}));
}
function roleCard(icon,te,en,role,tone){
  const desc={hm:['పాఠశాల నిర్వహణ','School administration'],teacher:['బోధన & తరగతి నిర్వహణ','Teaching & class management'],parent:['మీ పిల్లల పాఠశాల సమాచారం',"Your child's school updates"]}[role];
  return `<button type="button" class="role-card role-${tone}" data-role="${role}"><span class="role-icon" aria-hidden="true">${icon}</span><span class="role-copy"><strong>${t(te,en)}</strong><small>${t(desc[0],desc[1])}</small></span><span class="role-arrow" aria-hidden="true">›</span></button>`;
}
function renderLogin() {
  const labels = {hm:["ప్రిన్సిపాల్ / HM","Principal / HM"],teacher:["టీచర్","Teacher"],student:["విద్యార్థి","Student"],parent:["పేరెంట్","Parent"]};
  const name = labels[state.role] || labels.hm;
  main.innerHTML = `<div class="backline"><button class="btn secondary" id="back">← ${t("వెనక్కి","Back")}</button><span class="pill">${t(name[0],name[1])}</span></div>
    <section class="form-card"><h2>${t("లాగిన్","Login")}</h2><p>${t("ఇది ప్రోటోటైప్ మాత్రమే. డెమో బటన్‌తో డాష్‌బోర్డ్ చూడండి.","Prototype only. Use the demo button to preview the dashboard.")}</p>
    <div class="field"><label>${t("పేరు / యూజర్ ID","Name / User ID")}</label><input placeholder="${t("మీ పేరు నమోదు చేయండి","Enter your name")}"></div>
    <div class="field"><label>${t("PIN / Password","PIN / Password")}</label><input type="password" placeholder="••••"></div>
    <button class="btn" id="demoLogin" style="width:100%">${t("డెమో డాష్‌బోర్డ్ తెరవండి","Open demo dashboard")}</button>
    <p style="margin-top:14px;font-size:11px">${t("నిజమైన Authentication ఇంకా అనుసంధానం కాలేదు.","Real authentication is not connected yet.")}</p></section>`;
  document.querySelector("#back").onclick=()=>{state.view="welcome";render()};
  document.querySelector("#demoLogin").onclick=()=>{state.view="dashboard";render()};
}
function renderDashboard() {
  const roleName = {hm:["ప్రిన్సిపాల్ డాష్‌బోర్డ్","Principal Dashboard"],teacher:["టీచర్ డాష్‌బోర్డ్","Teacher Dashboard"],student:["విద్యార్థి డాష్‌బోర్డ్","Student Dashboard"],parent:["పేరెంట్ డాష్‌బోర్డ్","Parent Dashboard"]}[state.role];
  const list = modules[state.role] || modules.student;
  main.innerHTML = `<div class="dashboard-head"><div><span class="pill">${t("నమస్కారం!","Welcome!")}</span><h1>${t(roleName[0],roleName[1])}</h1><p>${APP_CONFIG.schoolName} · ${t("ఈరోజు మీ పాఠశాల సమాచారం","Your school at a glance")}</p></div><button class="btn secondary" id="logout">${t("లాగౌట్","Logout")}</button></div>
    ${renderDailyCards()}
    <div class="section-head"><div><h2>${t("మీ విభాగాలు","Your modules")}</h2><p>${t("మీ పాత్రకు సంబంధించిన సేవలు","Services for your role")}</p></div></div>
    <section class="module-grid">${list.map(m=>`<article class="module-card" data-module="${m[1]}"><div class="card-icon">${m[0]}</div><h3>${m[1]}</h3><p>${m[2]}</p></article>`).join("")}</section>
    <div class="section-head"><div><h2>${t("ఈరోజు క్యాలెండర్","Today's calendar")}</h2><p>${t("తేదీని ఎంచుకుని ఆ రోజు వివరాలు చూడండి.","Select a date to preview its details.")}</p></div></div>
    ${calendarCard()}`;
  document.querySelector("#logout").onclick=()=>{state.role=null;state.view="welcome";render()};
  main.querySelectorAll("[data-module]").forEach(el=>el.addEventListener("click",()=>showToast(`${el.dataset.module} — ${t("ఈ మాడ్యూల్ తదుపరి దశలో నిర్మిస్తాం.","This module is planned for the next build stage.")}`)));
  main.querySelectorAll("[data-action='edit-person']").forEach(b=>b.onclick=()=>editContent("person"));
  main.querySelectorAll("[data-action='edit-quote']").forEach(b=>b.onclick=()=>editContent("quote"));
  main.querySelectorAll(".day[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
}
function renderDailyCards() {
  const isHM = state.role === "hm";
  const knowledgeCards = state.role !== "parent" ? `<section class="card-row">
    <article class="feature-card green"><div class="card-icon">📚</div><h3>గొప్ప వ్యక్తులు</h3><p><strong>${escapeHtml(state.greatPerson.title)}</strong><br>${escapeHtml(state.greatPerson.summary)}</p><a href="${state.greatPerson.url || "#"}" ${state.greatPerson.url?'target="_blank" rel="noopener"':''}>${t("పూర్తి వివరాలు","Read more")} ↗</a>${isHM?'<button class="btn secondary" data-action="edit-person" style="margin-top:12px">Edit</button>':''}</article>
    <article class="feature-card gold"><div class="card-icon">💡</div><h3>గొప్ప మాటలు</h3><p><strong>“${escapeHtml(state.greatQuote.quote)}”</strong><br>${escapeHtml(state.greatQuote.author)}</p>${isHM?'<button class="btn secondary" data-action="edit-quote" style="margin-top:12px">Edit</button>':''}</article>
    </section>` : "";
  return `${knowledgeCards}
    <section class="today-grid">
      <article class="card"><h3>🎂 ${t("ఈరోజు విశేషం","Today Special")}</h3><div class="birthday-item"><div class="avatar">🎉</div><div class="item-copy"><strong>${t("డెమో విద్యార్థి పుట్టినరోజు","Demo student birthday")}</strong><small>${t("తరగతి 3 · DOB ఆధారిత డెమో","Class 3 · DOB-based demo")}</small></div></div><div class="birthday-item"><div class="avatar">📅</div><div class="item-copy"><strong>${t("ఈరోజు ప్రత్యేకత","Today's observance")}</strong><small>${t("క్యాలెండర్ డెమో సమాచారం","Calendar demo information")}</small></div></div></article>
      <article class="feature-card blue"><div class="card-icon">🌐</div><h3>మన విజ్ఞాన ప్రపంచం</h3><p>చరిత్ర, విజ్ఞానం, సాంకేతికం, వినోదం — మరెన్నో అంశాలు ఒకే చోట.</p><a href="${APP_CONFIG.knowledgeBlogUrl}" target="_blank" rel="noopener">బ్లాగ్ తెరవండి ↗</a></article>
    </section>`;
}
function calendarCard(){
  const names=["ఆది","సోమ","మంగళ","బుధ","గురు","శుక్ర","శని"];
  const days=Array.from({length:30},(_,i)=>i+1);
  return `<article class="card" style="margin-top:14px"><div class="dashboard-head"><div><h3>${t("నవంబర్ 2026","November 2026")}</h3><p class="muted">${t("డెమో క్యాలెండర్","Demo calendar")}</p></div><span class="pill">${t("ఎంచుకున్న తేదీ","Selected")}: ${state.selectedDate}</span></div><div class="calendar">${names.map(n=>`<div class="day-name">${n}</div>`).join("")}${days.map(d=>`<button class="day ${[5,14,17,25].includes(d)?"has-event":""} ${state.selectedDate===d?"selected":""}" data-day="${d}">${d}</button>`).join("")}</div><div class="empty" style="margin-top:14px">${state.selectedDate===17?t("ఈ తేదీకి డెమో ప్రత్యేక సమాచారం ఉంది.","Demo special information for this date.") : t("ఈ తేదీకి ప్రస్తుతం డెమో కార్యక్రమాలు లేవు.","No demo events for this date.")}</div></article>`;
}
function editContent(type){
  const person=type==="person";
  const current=person?state.greatPerson:state.greatQuote;
  const fields=person?`<div class="field"><label>వ్యక్తి పేరు</label><input id="f1" value="${escapeAttr(current.title)}"></div><div class="field"><label>చిన్న పరిచయం</label><textarea id="f2">${escapeHtml(current.summary)}</textarea></div><div class="field"><label>వ్యాసం లింక్</label><input id="f3" value="${escapeAttr(current.url)}" placeholder="https://..."></div>`:`<div class="field"><label>మంచి మాట</label><textarea id="f1">${escapeHtml(current.quote)}</textarea></div><div class="field"><label>చెప్పిన వ్యక్తి / మూలం</label><input id="f2" value="${escapeAttr(current.author)}"></div>`;
  main.innerHTML=`<div class="backline"><button class="btn secondary" id="cancel">← వెనక్కి</button></div><section class="form-card"><h2>${person?"గొప్ప వ్యక్తులు Edit":"గొప్ప మాటలు Edit"}</h2>${fields}<button class="btn" id="save" style="width:100%">Save & Publish</button><p style="margin-top:12px">Demo only: ఈ మార్పు ప్రస్తుతం ఈ browser sessionలో మాత్రమే ఉంటుంది. Firebase ఇంకా అనుసంధానం కాలేదు.</p></section>`;
  document.querySelector("#cancel").onclick=()=>{state.view="dashboard";render()};
  document.querySelector("#save").onclick=()=>{
    if(person){state.greatPerson={title:document.querySelector("#f1").value,summary:document.querySelector("#f2").value,url:document.querySelector("#f3").value}}
    else{state.greatQuote={quote:document.querySelector("#f1").value,author:document.querySelector("#f2").value}}
    state.view="dashboard";render();showToast("Demo content updated");
  };
}
function renderToday(){main.innerHTML=`<div class="backline"><button class="btn secondary" id="back">← వెనక్కి</button></div><section class="card"><h2>🎂 ఈరోజు విశేషం – Today Special</h2><p>పుట్టినరోజులు, జాతీయ / అంతర్జాతీయ దినోత్సవాలు, పాఠశాల ఈవెంట్స్ ఇక్కడ ఒకేచోట కనిపిస్తాయి.</p><div class="empty">ఇది ప్రస్తుతం డెమో స్క్రీన్. నిజమైన DOB మరియు క్యాలెండర్ డేటా Firebase అనుసంధానం తర్వాత వస్తాయి.</div></section>`;document.querySelector("#back").onclick=()=>{state.view="welcome";render()}}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function escapeAttr(s=""){return escapeHtml(s)}
function showToast(msg){const el=document.createElement("div");el.className="toast";el.textContent=msg;document.body.append(el);setTimeout(()=>el.remove(),2400)}
function openFooterContact(){
  const old=document.querySelector('#footerContact');if(old)old.remove();
  const modal=document.createElement('div');modal.id='footerContact';modal.className='modal-backdrop';
  modal.innerHTML='<section class="contact-popover" role="dialog" aria-modal="true"><button type="button" class="modal-close" aria-label="Close">×</button><h2>For Your Digital Needs</h2><p>Contact</p><a class="whatsapp-link" href="https://wa.me/918985361991" target="_blank" rel="noopener" aria-label="WhatsApp">◉</a></section>';
  document.body.append(modal);modal.querySelector('.modal-close').onclick=()=>modal.remove();
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
}
function renderSuperAdminLogin(){
  state.view='superadmin';
  main.innerHTML='<div class="backline"><button class="btn secondary" id="superBack">← '+t('వెనక్కి','Back')+'</button></div><section class="form-card"><h2>GI Super Admin</h2><p>'+t('సురక్షిత నిర్వాహక ప్రవేశం','Secure administrator access')+'</p><div class="field"><label>Admin ID</label><input autocomplete="username" placeholder="Admin ID"></div><div class="field"><label>Password</label><input type="password" autocomplete="current-password" placeholder="••••••••"></div><button class="btn" style="width:100%" id="superAdminContinue">'+t('కొనసాగండి','Continue')+'</button><p class="secure-note">'+t('Authentication ఇంకా అనుసంధానం కాలేదు.','Authentication is not connected yet.')+'</p></section>';
  document.querySelector('#superBack').onclick=()=>{state.view='welcome';render()};
  document.querySelector('#superAdminContinue').onclick=()=>showToast(t('Authentication ఇంకా సిద్ధంగా లేదు.','Authentication is not configured yet.'));
}
function setupFooterActions(){
  const signature=document.querySelector('#footerSignature'),inspired=document.querySelector('#footerInspired');
  [signature,inspired].forEach(el=>el.addEventListener('click',openFooterContact));
  let timer=null,longPressed=false;
  signature.addEventListener('pointerdown',()=>{longPressed=false;timer=setTimeout(()=>{longPressed=true;renderSuperAdminLogin()},850)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>signature.addEventListener(ev,()=>{if(timer)clearTimeout(timer)}));
  signature.addEventListener('click',e=>{if(longPressed){e.preventDefault();e.stopImmediatePropagation();longPressed=false}});
}
function render(){document.querySelector("#appName").textContent=state.lang==="te"?APP_CONFIG.appNameTe:APP_CONFIG.appNameEn;document.querySelector("#tagline").textContent=state.lang==="te"?APP_CONFIG.taglineTe:APP_CONFIG.taglineEn;if(state.view==="welcome")renderWelcome();else if(state.view==="login")renderLogin();else if(state.view==="dashboard")renderDashboard();else if(state.view==="today")renderToday();else if(state.view==="superadmin")renderSuperAdminLogin()}
render();
setupFooterActions();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
