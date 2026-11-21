import { APP_CONFIG } from "../../config/school-config.js";
import { auth } from "../firebase-client.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getTeacherProfile } from "../sections/teacher/teacher-service.js";
import { getLocalTeacherPinRecord } from "../sections/teacher/pin-auth.js";
import { getCurrentHeadMasterProfile, getLocalHeadMasterPinRecord } from "../sections/head-master/pin-auth.js";
import { showTributeSplash } from "../shared/tribute-splash.js";
import { createTranslator, createDictionaryTranslator } from "../shared/translations.js";
import { roleNames, roleMeta, modules } from "../shared/role-config.js";
import { authenticateHeadMaster, renderSuperAdminLogin, renderSuperAdminDashboard, signOutPortal, sendPortalPasswordReset } from "../sections/super-admin/admin-portal.js";
import { createAlumniSponsorSection } from "../sections/alumni-sponsor/alumni-sponsor-section.js";
import { createParentSection } from "../sections/parent/parent-section.js";
import { createModulePage } from "../modules/module-page.js";
import { createLoginScreen } from "../shared/login-screen.js";
import { createDashboardScreen } from "../shared/dashboard-screen.js";
import { createAccountScreens } from "../shared/account-screens.js";
import { createFooterController } from "../shared/footer.js";
import { createNavigationController } from "../shared/navigation.js";
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
// Browser-local preview flags are not authentication. Teacher sessions are restored only through Firebase Auth; legacy Parent and Community previews are discarded.
const stalePreviewSession = savedAuth && ["parent","community"].includes(savedRole);
if (stalePreviewSession) {
  localStorage.removeItem("gim_role");
  localStorage.removeItem("gim_authenticated");
}
const restoredRole = stalePreviewSession ? null : savedRole;
const state = {
  role: restoredRole === "superadmin" ? null : restoredRole, authenticated: Boolean(restoredRole && savedAuth && !["hm","superadmin","teacher"].includes(restoredRole)),
  view: restoredRole === "teacher" ? "login" : restoredRole && savedAuth && !["hm","superadmin"].includes(restoredRole) ? "dashboard" : restoredRole && restoredRole !== "superadmin" ? "login" : "welcome", module: null,
  superAdminProfile: null, headMasterProfile: null, teacherProfile: null,
  teacherPinMode: null, teacherLoginStep: "id", teacherLoginRecord: null, teacherEnrollmentInProgress: false, teacherLoginNotice: null,
  theme: localStorage.getItem("gim_theme") || "light",
  lang: localStorage.getItem("gim_lang") || "te",
  selectedDate: 17, selectedMonth: 10, selectedYear: 2026, linkedStudent: null, parentLinked: false, communityType: null
};
const T=createTranslator(()=>state.lang);
const translateValue=createDictionaryTranslator(()=>state.lang);
function applyTranslations(){
 const walk=node=>{for(const child of [...node.childNodes]){if(child.nodeType===3)child.nodeValue=translateValue(child.nodeValue);else if(child.nodeType===1){if(child.matches?.(".role-copy,[data-translation-managed=\"true\"]"))continue;for(const attr of ["placeholder","title","aria-label"])if(child.hasAttribute(attr))child.setAttribute(attr,translateValue(child.getAttribute(attr)));walk(child)}}};
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
 if(role==="teacher"&&auth.currentUser?.email?.toLowerCase().endsWith("@dagguluruschool.in")){
  state.teacherPinMode=getLocalTeacherPinRecord(auth.currentUser.uid)?"unlock":"setup";
  state.teacherLoginStep=state.teacherPinMode==="setup"?"pin":"id";
  state.view="login";
  localStorage.setItem("gim_role","teacher");localStorage.removeItem("gim_authenticated");
  render();return;
 }
 localStorage.setItem("gim_role",role);localStorage.removeItem("gim_authenticated");
 state.view="login";render();
}
main.addEventListener("click",event=>{
 const card=event.target.closest?.(".role-card[data-role]");
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
  <p class="welcome-motto">${T("మన బడి · మన బాధ్యత… మన భవిష్యత్తు!","Our School · Our Responsibility… Our Future!")}</p>
  <p class="role-prompt">${T("మీ పాత్రను ఎంచుకోండి","SELECT YOUR ROLE")}</p>
 </section>
 <section class="role-stack" aria-label="Select your role">
  ${roleCard("school","ప్రధానోపాధ్యాయులు","Head Master","hm","green")}
  ${roleCard("presentation","ఉపాధ్యాయులు","Teachers","teacher","gold")}
  ${roleCard("users","తల్లిదండ్రులు","Parent","parent","blue")}
  ${roleCard("heart-handshake","పూర్వ విద్యార్థులు & ప్రోత్సాహకులు","Alumni & Sponsors","community","green")}
  <div class="role-theme-strip" aria-label="Leadership, Education, Inspiration and Community"><span>LEADERSHIP</span><span>EDUCATION</span><span>INSPIRATION</span><span>COMMUNITY</span></div>
 </section>`;
 /* Role selection is delegated at the main view so touch and keyboard activation remain reliable after re-renders. */
 main.querySelectorAll("[data-role]").forEach(b=>{b.onclick=null});
}
function roleCard(ic,te,en,role,tone){
 const cards={
  hm:{image:"assets/branding/roles/sarvepalli-radhakrishnan.webp",alt:"Dr. Sarvepalli Radhakrishnan",number:"01",theme:"LEADERSHIP",tagline:"Wisdom · Guidance"},
  teacher:{image:"assets/branding/roles/savitribai-phule.webp",alt:"Savitribai Phule",number:"02",theme:"EDUCATION",tagline:"Courage · Dedication"},
  parent:{image:"assets/branding/roles/apj-abdul-kalam-family.webp",alt:"A. P. J. Abdul Kalam family values",number:"03",theme:"INSPIRATION",tagline:"Love · Values"},
  community:{image:"assets/branding/roles/indian-philanthropists.webp",alt:"Indian philanthropists supporting education",number:"04",theme:"COMMUNITY",tagline:"Service · Giving"}
 };
 const card=cards[role];
 return `<button type="button" class="role-card role-tile role-${tone}" data-role="${role}" aria-label="${escapeHtml(T(te,en))}">
  <img class="role-photo" src="./${card.image}" alt="${escapeHtml(card.alt)}" loading="eager" decoding="async">
  <span class="role-shade" aria-hidden="true"></span>
  <span class="role-copy"><strong class="role-title">${escapeHtml(T(te,en))}</strong></span>
  <span class="role-arrow" aria-hidden="true">↗</span>
 </button>`;
}
function login(){loginScreen.render();}
function communityRegister(){alumniSponsorSection.renderRegistration();}
function linking(){parentSection.renderLinking();}\nfunction parentAddChild(){parentSection.renderAddChild();}
function dashboard(){dashboardScreen.render();if(state.role==="parent"){const add=main.querySelector("#parentAddChild");if(add)add.onclick=()=>{state.view="parentAddChild";render();};}}
function profilePage(){accountScreens.profilePage();}
function settingsPage(){accountScreens.settingsPage();}
function superAdmin(){
 renderSuperAdminLogin(main,{
  T,APP_CONFIG,
  onSuccess:user=>{state.role="superadmin";state.authenticated=true;state.superAdminProfile=user;localStorage.setItem("gim_role","superadmin");localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();},
  onBack:()=>{state.view="welcome";render();},
  onPasswordReset:sendPortalPasswordReset
 });
}
function renderCreativeWelcome(modal){footerController.renderCreativeWelcome(modal);}
function setupFooter(){footerController.setup();}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent=translateValue(msg);document.body.append(el);setTimeout(()=>el.remove(),2400)}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 document.querySelector("#appName").textContent="BVR · CVPMR · DNR";
 document.querySelector("#tagline").textContent="DIGITAL MANA BADI";
 const theme=document.querySelector("#themeToggle");theme.textContent=state.theme==="light"?"☾":"☀";
 document.querySelector("#languageToggle").textContent=state.lang==="te"?"అ":"A";
 document.querySelector("#languageToggle").setAttribute("aria-label",state.lang==="te"?"Switch to English":"తెలుగులోకి మార్చండి");
 theme.setAttribute("aria-label",state.theme==="light"?"Switch to dark theme":"Switch to light theme");
 if(state.view==="welcome")welcome();else if(state.view==="login")login();else if(state.view==="communityRegister")communityRegister();else if(state.view==="link")linking();else if(state.view==="parentAddChild")parentAddChild();else if(state.view==="dashboard")dashboard();else if(state.view==="module")modulePage();else if(state.view==="profile")profilePage();else if(state.view==="settings")settingsPage();else if(state.view==="superadmin")superAdmin();
 applyTranslations();
 updateBottomNavigation();
}
function setupBottomNavigation(){navigationController.setup();}
function updateBottomNavigation(){navigationController.update();}
const alumniSponsorSection = createAlumniSponsorSection({main,state,T,render,toast,escapeHtml});
const parentSection = createParentSection({main,state,T,render,toast,escapeHtml});
const { modulePage } = createModulePage({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection});
const loginScreen = createLoginScreen({
 main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,sendPortalPasswordReset,signOutPortal,
 roleLoginViews:{hm:getHeadMasterLoginView,teacher:getTeacherLoginView,parent:getParentLoginView,community:getAlumniSponsorLoginView}
});
const dashboardScreen = createDashboardScreen({main,state,T,roleMeta,modules,iconSvg,render,roleDashboardIntro,APP_CONFIG,escapeHtml,renderSuperAdminDashboard,signOutPortal});
const accountScreens = createAccountScreens({main,state,roleNames,APP_CONFIG,render,toggleLanguage,toggleTheme,signOutPortal,T});
const footerController = createFooterController({state,T,render});
const navigationController = createNavigationController({state,render});

setupFooter();setupBottomNavigation();updateBottomNavigation();

// Restore only a valid Firebase Head Master session, then require the device PIN.
let initialAuthRestoreHandled=false;
onAuthStateChanged(auth,async user=>{
 if(state.role==="teacher"){
  initialAuthRestoreHandled=true;
  if(state.teacherEnrollmentInProgress)return;
  if(user&&!user.email?.toLowerCase().endsWith("@dagguluruschool.in")){
   state.teacherProfile=null;state.teacherPinMode=null;state.authenticated=false;
   state.teacherLoginNotice=T("Teacher ID మరియు Passwordతో ప్రవేశించండి.","Please sign in with your Teacher ID and Password.");
   localStorage.removeItem("gim_authenticated");
   state.view="login";render();return;
  }
  if(!user){
   const wasInDashboard=state.authenticated||state.view==="dashboard";
   state.authenticated=false;state.teacherProfile=null;state.teacherPinMode=null;state.teacherLoginStep="id";
   localStorage.removeItem("gim_authenticated");
   state.view="login";
   if(wasInDashboard){state.teacherLoginNotice=T("మీ Login Session ముగిసింది. Teacher IDతో మళ్లీ ధృవీకరించండి.","Your login session has expired. Please verify again with your Teacher ID.");render();}
   return;
  }
  try{
   const profile=await getTeacherProfile();
   if(!profile||!profile.linked)throw new Error("Teacher profile is not active.");
   state.teacherProfile=profile;
   if(getLocalTeacherPinRecord(user.uid)){
    state.teacherPinMode="unlock";state.teacherLoginStep="id";
   }else{
    state.teacherPinMode="setup";state.teacherLoginStep="pin";
   }
   state.authenticated=false;state.view="login";render();
  }catch(error){
   try{await signOut(auth);}catch{}
   state.teacherProfile=null;state.teacherPinMode=null;state.authenticated=false;
   state.teacherLoginNotice=T("ఈ Teacher ఖాతా క్రియాశీలంగా లేదు లేదా వివరాలు ధృవీకరించబడలేదు. Head Master‌ను సంప్రదించండి.","This teacher account is inactive or could not be verified. Please contact the Head Master.");
   localStorage.removeItem("gim_authenticated");
   state.view="login";render();
  }
  return;
 }
 if(initialAuthRestoreHandled)return;
 initialAuthRestoreHandled=true;
 if(state.role!=="hm"||state.view!=="login")return;
 if(!user){
  state.authenticated=false;
  localStorage.removeItem("gim_authenticated");
  return;
 }
 try{
  const profile=await getCurrentHeadMasterProfile();
  if(!profile){
   state.authenticated=false;
   localStorage.removeItem("gim_authenticated");
   return;
  }
  state.headMasterProfile=profile;
  state.authenticated=false;
  localStorage.removeItem("gim_authenticated");
  if(getLocalHeadMasterPinRecord(profile.uid))state.hmPinMode="unlock";
  else state.hmPinMode=null;
  state.view="login";
  render();
 }catch(error){
  state.authenticated=false;
  localStorage.removeItem("gim_authenticated");
 }
});
showTributeSplash(render, 2000);


// Parent's four-digit PIN is a device-local screen lock only.
let parentWasBackgrounded=false;
document.addEventListener("visibilitychange",()=>{
 if(document.hidden && state.role==="parent" && state.authenticated){
  parentWasBackgrounded=true;state.authenticated=false;state.view="login";
  localStorage.removeItem("gim_authenticated");
 }else if(!document.hidden && parentWasBackgrounded){
  parentWasBackgrounded=false;render();
 }
});
