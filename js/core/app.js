import { APP_CONFIG } from "../../config/school-config.js";
import { translationPairs } from "../shared/translations.js";
import { roleNames, roleMeta, modules } from "../shared/role-config.js";
import { authenticateHeadMaster, renderSuperAdminLogin, renderSuperAdminDashboard, signOutPortal } from "../sections/super-admin/admin-portal.js";
import { createAlumniSponsorSection } from "../sections/alumni-sponsor/alumni-sponsor-section.js";
import { createParentSection } from "../sections/parent/parent-section.js";
import { createSharedScreens } from "../shared/module-screens.js";
import { createLoginScreen } from "../shared/login-screen.js";
import { getHeadMasterLoginView } from "../sections/head-master/login.js";
import { getTeacherLoginView } from "../sections/teacher/login.js";
import { getParentLoginView } from "../sections/parent/login.js";
import { getAlumniSponsorLoginView } from "../sections/alumni-sponsor/login.js";
import { renderHeadMasterDashboardIntro } from "../sections/head-master/dashboard.js";
import { renderTeacherDashboardIntro } from "../sections/teacher/dashboard.js";
import { renderParentDashboardIntro } from "../sections/parent/dashboard.js";
import { renderAlumniSponsorDashboardIntro } from "../sections/alumni-sponsor/dashboard.js";

const roleDashboardIntro = {
 hm: renderHeadMasterDashboardIntro,
 teacher: renderTeacherDashboardIntro,
 parent: renderParentDashboardIntro,
 community: renderAlumniSponsorDashboardIntro
};

const savedRole = localStorage.getItem("gim_role") || null;
const savedAuth = localStorage.getItem("gim_authenticated") === "true";
const state = {
  role: savedRole === "superadmin" ? null : savedRole, authenticated: Boolean(savedRole && savedAuth && !["hm","superadmin"].includes(savedRole)),
  view: savedRole && savedAuth && !["hm","superadmin"].includes(savedRole) ? "dashboard" : savedRole && savedRole !== "superadmin" ? "login" : "welcome", module: null,
  superAdminProfile: null, headMasterProfile: null,
  theme: localStorage.getItem("gim_theme") || "light",
  lang: localStorage.getItem("gim_lang") || "te",
  selectedDate: 17, selectedMonth: 10, selectedYear: 2026, linkedStudent: null, parentLinked: false, communityType: null
};
const T=(te,en)=>state.lang==="te"?te:en;

function translateValue(value){
 const direction=state.lang==="te"?0:1;
 const sorted=[...translationPairs].sort((a,b)=>b[1-direction].length-a[1-direction].length);
 let out=String(value??"");
 for(const pair of sorted){const from=pair[1-direction],to=pair[direction];if(from)out=out.split(from).join(to)}
 return out;
}
function applyTranslations(){
 const walk=node=>{for(const child of [...node.childNodes]){if(child.nodeType===3)child.nodeValue=translateValue(child.nodeValue);else if(child.nodeType===1){for(const attr of ["placeholder","title","aria-label"])if(child.hasAttribute(attr))child.setAttribute(attr,translateValue(child.getAttribute(attr)));walk(child)}}};
 const appRoot=document.querySelector("#app");
 const footer=appRoot?.querySelector("#appFooter");
 if(footer) footer.querySelectorAll(".footer-link").forEach(el=>{el.dataset.keepEnglish=el.textContent});
 walk(appRoot);
 if(footer) footer.querySelectorAll(".footer-link").forEach(el=>{if(el.dataset.keepEnglish)el.textContent=el.dataset.keepEnglish});
 document.documentElement.lang=state.lang;
}

const main=document.querySelector("#mainView");
function selectWelcomeRole(role){
 if(!roleNames[role])return;
 state.role=role;state.authenticated=false;
 localStorage.setItem("gim_role",role);localStorage.removeItem("gim_authenticated");
 state.view="login";render();
}
main.addEventListener("pointerup",event=>{
 const card=event.target.closest?.("[data-role]");
 if(!card)return;
 event.preventDefault();
 selectWelcomeRole(card.dataset.role);
},true);
main.addEventListener("click",event=>{
 const card=event.target.closest?.("[data-role]");
 if(!card)return;
 event.preventDefault();
 selectWelcomeRole(card.dataset.role);
},true);
document.documentElement.dataset.theme=state.theme;
const iconSvg=(name)=>({school:"▦",presentation:"▤",users:"♧", "calendar-check":"▣","notebook-pen":"✎","book-open":"▤",megaphone:"◖", "calendar-days":"▦",utensils:"♨",sun:"☼","book-heart":"♡",quote:"❝",globe:"◎",palette:"▧","chart-no-axes-column":"▥",settings:"⚙","graduation-cap":"⌂",bell:"♢",user:"○",shield:"⬡","heart-handshake":"♡","message-circle":"✉","clipboard-list":"▤","hand-heart":"♡","hand-coins":"◈",history:"↺",trophy:"♜"}[name]||"•");
function toggleLanguage(){
 state.lang=state.lang==="te"?"en":"te";
 localStorage.setItem("gim_lang",state.lang);
 render();
 const popup=document.querySelector("#gcsWelcomePopup");if(popup)renderCreativeWelcome(popup);
}
function toggleTheme(){
 state.theme=state.theme==="light"?"dark":"light";
 localStorage.setItem("gim_theme",state.theme);
 document.documentElement.dataset.theme=state.theme;
 render();
}
document.querySelector("#languageToggle").onclick=toggleLanguage;
document.querySelector("#themeToggle").onclick=toggleTheme;
document.querySelector("#brandHome").onclick=()=>{state.view=state.authenticated?"dashboard":state.role?"login":"welcome";render()};
function welcome(){
 main.innerHTML=`<section class="welcome-panel" aria-label="Digital Mana Badi welcome">
  <h2 class="welcome-intro">${T("స్వాగతం","Welcome to")}</h2>
  <div class="welcome-honourees" aria-label="B. V. Raju, C. V. P. Murthy Raju and D. N. Raju">
   <h2>${T("శ్రీ బి.వి. రాజు","Sri B. V. Raju")}</h2>
   <h2>${T("శ్రీ సి.వి.పి. మూర్తి రాజు","Sri C. V. P. Murthy Raju")}</h2>
   <h2>${T("శ్రీ దంతులూరి నారాయణ రాజు","Sri D. N. Raju")}</h2>
  </div>
  <div class="welcome-divider" aria-hidden="true"></div>
  <h1>${T("డిజిటల్ మన బడి","DIGITAL MANA BADI")}</h1>
  <div class="welcome-school">
   <strong>${escapeHtml(APP_CONFIG.schoolName)}</strong>
   <span>${escapeHtml(APP_CONFIG.schoolLocation)}</span>
  </div>
  <p class="role-prompt">${T("మీ పాత్రను ఎంచుకోండి","SELECT YOUR ROLE")}</p>
 </section>
 <section class="role-stack" aria-label="Select your role">
  ${roleCard("school","ప్రధానోపాధ్యాయులు","Head Master","hm","green")}
  ${roleCard("presentation","ఉపాధ్యాయుడు","Teacher","teacher","gold")}
  ${roleCard("users","తల్లిదండ్రులు","Parent","parent","blue")}
  ${roleCard("heart-handshake","పూర్వ విద్యార్థి / స్పాన్సర్","Alumni / Sponsor","community","green")}
 </section>`;
 /* Role selection is delegated at the main view so touch and keyboard activation remain reliable after re-renders. */
 main.querySelectorAll("[data-role]").forEach(b=>{b.onclick=null});
}
function roleCard(ic,te,en,role,tone){
 return `<button type="button" class="role-card role-${tone}" data-role="${role}"><span class="role-icon">${iconSvg(ic)}</span><span class="role-copy"><strong>${T(te,en)}</strong></span><span class="role-arrow" aria-hidden="true">›</span></button>`;
}
function login(){loginScreen.render();}
function communityRegister(){alumniSponsorSection.renderRegistration();}
function linking(){parentSection.renderLinking();}
function dashboard(){
 if(state.role==="superadmin"){
  renderSuperAdminDashboard(main,state.superAdminProfile,{
   onLogout:async()=>{await signOutPortal();state.role=null;state.authenticated=false;state.superAdminProfile=null;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render();},
   onRefresh:()=>render()
  });
  return;
 }
 const meta=roleMeta[state.role],list=modules[state.role]||[];
 main.innerHTML=`<div class="dashboard-head"><div><span class="pill">${T("నమస్కారం!","Welcome!")}</span><h1>${T(meta.title,meta.title)}</h1><p>${state.role==="hm"&&state.headMasterProfile?.school?.schoolName?escapeHtml(state.headMasterProfile.school.schoolName):T(meta.sub,meta.sub)}</p></div><div class="dashboard-actions"><button class="btn secondary" id="switchRoleHome">${T("Role మార్చు","Switch Role")}</button><button class="btn secondary" id="profileBtn">◉ ${T("ప్రొఫైల్","Profile")}</button></div></div>
 ${roleDashboardIntro[state.role]?.({state,escapeHtml})||""}
 <div class="section-head"><div><h2>మీ విభాగాలు</h2><p>మీ Roleకు అనుమతించిన సేవలు</p></div></div><section class="module-grid">${list.map(m=>`<button class="module-card" data-module="${m[2]}"><span class="card-icon">${iconSvg(m[0])}</span><strong>${m[1]}</strong><small>${m[3]}</small><span class="module-arrow">›</span></button>`).join("")}</section>
 ${commonHighlights()}`;
 main.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{state.module=b.dataset.module;state.view="module";render()});
 document.querySelector("#switchRoleHome").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#profileBtn").onclick=()=>{state.view="profile";render()};
}
function commonHighlights(){return `<section class="knowledge-card"><div class="knowledge-icon">◎</div><div><h2>${T("మన విజ్ఞాన ప్రపంచం","GI Knowledge World")}</h2><p>${T("జి.ఐ. నిర్వహించే ఒకే విజ్ఞాన బ్లాగ్ లింక్.","One centrally managed GI blog link.")}</p></div><a href="${APP_CONFIG.knowledgeBlogUrl}" target="_blank" rel="noopener">${T("బ్లాగ్ తెరవండి","Open Blog")} ↗</a></section>`}
function profilePage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="profileBack">← Dashboard</button></div><section class="form-card"><div class="login-symbol">◉</div><h2>Profile</h2><p>${roleNames[state.role][0]} • ${APP_CONFIG.schoolName}</p><div class="detail-list"><div class="detail-row"><div><strong>Personal Information</strong><small>పేరు మరియు ప్రాథమిక వివరాలు</small></div>›</div><div class="detail-row"><div><strong>Role & Access</strong><small>మీకు అనుమతించిన విభాగాలు</small></div>›</div><div class="detail-row"><div><strong>School Information</strong><small>పాఠశాల వివరాలు</small></div>›</div></div></section>`;
 document.querySelector("#profileBack").onclick=()=>{state.view="dashboard";render()};
}
function settingsPage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="settingsBack">← Dashboard</button></div><section class="card module-detail"><h2>Settings</h2><div class="detail-list"><div class="detail-row"><div><strong>Language</strong><small>తెలుగు / English</small></div><button class="btn secondary" id="settingsLang">Change</button></div><div class="detail-row"><div><strong>Theme</strong><small>Light / Dark</small></div><button class="btn secondary" id="settingsTheme">Change</button></div><div class="detail-row"><div><strong>Switch Role</strong><small>Welcome Screen‌కు తిరిగి వెళ్లండి</small></div><button class="btn secondary" id="switchRole">Switch</button></div><div class="detail-row"><div><strong>Logout</strong><small>ప్రస్తుత Session ముగించండి</small></div><button class="btn danger" id="logout">Logout</button></div></div></section>`;
 document.querySelector("#settingsBack").onclick=()=>{state.view="dashboard";render()};
 document.querySelector("#settingsLang").onclick=toggleLanguage;
 document.querySelector("#settingsTheme").onclick=toggleTheme;
 document.querySelector("#switchRole").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#logout").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
}
function superAdmin(){
 renderSuperAdminLogin(main,{
  onSuccess:user=>{state.role="superadmin";state.authenticated=true;state.superAdminProfile=user;localStorage.setItem("gim_role","superadmin");localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();},
  onBack:()=>{state.view="welcome";render();}
 });
}
function renderCreativeWelcome(modal){
 const te=state.lang==="te";
 const copy=te?{welcome:"స్వాగతం",godavari:"గోదావరి",creative:"క్రియేటివ్ స్పేస్",tag:"మీ ఆలోచనలు. మా సృజనాత్మకత.",intro:"ఊహ నుంచి ఆవిష్కరణ వరకు, అర్థవంతమైనదాన్ని మనమిద్దరం కలిసి సృష్టిద్దాం.",needs:"మీ డిజిటల్ అవసరాల కోసం",services:"క్రియేటివ్ వెబ్‌సైట్లు • డిజిటల్ వీడియోలు • బ్రాండింగ్ • సోషల్ మీడియా • డిజిటల్ అప్లికేషన్లు",grow:"సృష్టిద్దాం. ఎదుగుదాం.",chat:"మాతో చాట్ చేయండి",sign:"గోదావరి స్ఫూర్తితో. సృజనాత్మకతే మా బలంతో.",close:"మూసివేయి"}:{welcome:"Welcome to",godavari:"Godavari",creative:"Creative Space",tag:"Your Ideas. Our Creativity.",intro:"From imagination to innovation, let’s create something meaningful together.",needs:"For Your Digital Needs",services:"Creative Websites • Digital Videos • Branding • Social Media • Digital Applications",grow:"Let’s Create. Let’s Grow.",chat:"Chat with Us",sign:"Inspired by Godavari. Driven by Creativity.",close:"Close"};
 modal.innerHTML='<section class="gcs-welcome-card" role="dialog" aria-modal="true" aria-labelledby="gcsTitle"><button type="button" class="gcs-close" aria-label="'+copy.close+'">×</button><div class="gcs-brand"><span class="gcs-logo">GI</span><span class="gcs-brand-name">GODAVARI CREATIVE SPACE</span></div><div class="gcs-welcome-copy"><p class="gcs-overline">'+copy.welcome+'</p><h2 id="gcsTitle">'+copy.godavari+'<span>'+copy.creative+'</span></h2><h3>'+copy.tag+'</h3><p>'+copy.intro+'</p></div><div class="gcs-services"><h3>'+copy.needs+'</h3><p>'+copy.services+'</p><h3>'+copy.grow+'</h3><a class="gcs-chat" href="https://wa.me/918985361991" target="_blank" rel="noopener"><span aria-hidden="true">◉</span> '+copy.chat+'</a></div><p class="gcs-signoff">'+copy.sign+'</p></section>';
 modal.querySelector(".gcs-close").onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};
}
function contactPopup(){let modal=document.querySelector("#gcsWelcomePopup");if(!modal){modal=document.createElement("div");modal.id="gcsWelcomePopup";modal.className="gcs-welcome-overlay";document.body.append(modal)}renderCreativeWelcome(modal)}
function setupFooter(){
 const sig=document.querySelector("#footerSignature"),inspired=document.querySelector("#footerInspired");let timer=null,long=false;
 inspired.onclick=contactPopup;sig.onclick=e=>{if(long){e.preventDefault();long=false;return}contactPopup()};
 sig.onpointerdown=()=>{long=false;timer=setTimeout(()=>{long=true;state.view="superadmin";render()},850)};
 ["pointerup","pointerleave","pointercancel"].forEach(ev=>sig.addEventListener(ev,()=>clearTimeout(timer)));
}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=translateValue(msg);document.body.append(el);setTimeout(()=>el.remove(),2400)}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 document.querySelector("#appName").textContent="BVR · CVPMR · DNR";
 document.querySelector("#tagline").textContent="DIGITAL MANA BADI";
 const theme=document.querySelector("#themeToggle");theme.textContent=state.theme==="light"?"☾":"☀";
 document.querySelector("#languageToggle").textContent=state.lang==="te"?"అ":"A";
 document.querySelector("#languageToggle").setAttribute("aria-label",state.lang==="te"?"Switch to English":"తెలుగులోకి మార్చండి");
 theme.setAttribute("aria-label",state.theme==="light"?"Switch to dark theme":"Switch to light theme");
 if(state.view==="welcome")welcome();else if(state.view==="login")login();else if(state.view==="communityRegister")communityRegister();else if(state.view==="link")linking();else if(state.view==="dashboard")dashboard();else if(state.view==="module")modulePage();else if(state.view==="profile")profilePage();else if(state.view==="settings")settingsPage();else if(state.view==="superadmin")superAdmin();
 applyTranslations();
 updateBottomNavigation();
}
function setupBottomNavigation(){
 const nav=document.querySelector("#bottomNav");
 nav.querySelector("#navHome").onclick=()=>{state.module=null;state.view="dashboard";render()};
 nav.querySelector("#navCalendar").onclick=()=>{state.module="Events & Calendar";state.view="module";render()};
 nav.querySelector("#navProfile").onclick=()=>{state.view="profile";render()};
 nav.querySelector("#navSettings").onclick=()=>{state.view="settings";render()};
}
function updateBottomNavigation(){
 const nav=document.querySelector("#bottomNav");
 const visible=Boolean(state.role && state.authenticated && state.role!=="superadmin");
 nav.hidden=!visible;
 document.body.classList.toggle("has-authenticated-role",visible);
 const active=state.view==="dashboard"?"navHome":state.view==="profile"?"navProfile":state.view==="settings"?"navSettings":state.view==="module" && state.module==="Events & Calendar"?"navCalendar":"";
 nav.querySelectorAll("button").forEach(button=>{
  const selected=button.id===active;
  button.classList.toggle("active",selected);
  if(selected)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");
 });
}
const alumniSponsorSection = createAlumniSponsorSection({main,state,T,render,toast,escapeHtml});
const parentSection = createParentSection({main,state,render,toast,escapeHtml});
const { modulePage } = createSharedScreens({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection});
const loginScreen = createLoginScreen({
 main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,
 roleLoginViews:{hm:getHeadMasterLoginView,teacher:getTeacherLoginView,parent:getParentLoginView,community:getAlumniSponsorLoginView}
});

render();setupFooter();setupBottomNavigation();updateBottomNavigation();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
