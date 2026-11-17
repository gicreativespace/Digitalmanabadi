import { APP_CONFIG } from "../../config/school-config.js";
import { translationPairs } from "../shared/translations.js";
import { roleNames, roleMeta, modules } from "../shared/role-config.js";
import { authenticateHeadMaster, renderSuperAdminLogin, renderSuperAdminDashboard, signOutPortal } from "../sections/super-admin/admin-portal.js";
import { createAlumniSponsorSection } from "../sections/alumni-sponsor/alumni-sponsor-section.js";
import { createParentSection } from "../sections/parent/parent-section.js";
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
function login(){
 const role=roleNames[state.role], parent=state.role==="parent", community=state.role==="community";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="backWelcome">← ${T("వెనక్కి","Back")}</button><span class="pill">${T(role[0],role[1])}</span></div>
 <section class="form-card"><div class="login-symbol">${iconSvg(roleMeta[state.role].icon)}</div><h2>${community?T("Alumni / Donor ప్రవేశం","Alumni / Donor Access"):T(role[0]+" లాగిన్",role[1]+" Login")}</h2>
 <p>${community?T("మీ పాఠశాలతో అనుబంధం కొనసాగించండి, అవసరాలకు స్పందించండి.","Stay connected with your school and respond to its needs."):parent?T("మీ Student ID మరియు Parent PINతో ప్రవేశించండి.","Sign in with your Student ID and Parent PIN."):T("మీ పాఠశాల ఖాతా వివరాలతో ప్రవేశించండి.","Sign in with your school account credentials.")}</p>
 ${parent?'<div class="field"><label>Student ID</label><input id="loginId" placeholder="Student ID"></div><div class="field"><label>Parent PIN</label><input id="loginPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><button class="btn full" id="loginGo">Login</button><div class="link-row"><button class="text-link" id="startLink">మొదటిసారి? పిల్లలను లింక్ చేయండి</button></div>':
 community?'<div class="community-access-actions"><button class="btn full" id="communityRegister">Register as Alumni / Donor</button><button class="btn secondary full" id="communityPreview">Open Portal Preview</button></div><div class="demo-note">Preview only: registration approvals, secure sign-in and cross-device messages become live after Firebase integration.</div>':
 '<div class="field"><label>'+(state.role==="hm"?"Official School Email":T("Login ID","Login ID"))+'</label><input id="loginId" type="'+(state.role==="hm"?"email":"text")+'" autocomplete="username" placeholder="'+(state.role==="hm"?"Enter official school email":T("మీ Login ID","Enter your Login ID"))+'"></div><div class="field"><label>'+T("Password / PIN","Password / PIN")+'</label><input id="loginPin" type="password" placeholder="••••••••"></div><button class="btn full" id="loginGo">'+T("Login","Login")+'</button><div class="demo-note">'+(state.role==="hm"?"Firebase Authenticationతో Head Master Email ధృవీకరణ.":"Preview Mode — Firebase Authentication ఇంకా అనుసంధానం కాలేదు.")+'</div>'}
 </section>`;
 document.querySelector("#backWelcome").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 if(parent)document.querySelector("#startLink").onclick=()=>{state.view="link";render()};
 if(community){
  document.querySelector("#communityRegister").onclick=()=>{state.view="communityRegister";render()};
  document.querySelector("#communityPreview").onclick=()=>{state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()};
  return;
 }
 document.querySelector("#loginGo").onclick=async()=>{
  const id=document.querySelector("#loginId").value.trim(),pin=document.querySelector("#loginPin").value;
  if(!id||!pin){toast(T("రెండు వివరాలు నమోదు చేయండి.","Please enter both fields."));return}
  if(state.role==="hm"){
   const button=document.querySelector("#loginGo");button.disabled=true;button.textContent="Verifying…";
   try{const result=await authenticateHeadMaster(id,pin);state.headMasterProfile=result.profile;state.authenticated=true;localStorage.setItem("gim_role","hm");localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();}
   catch(error){toast(error.message||"లాగిన్ ధృవీకరణ విఫలమైంది.");button.disabled=false;button.textContent=T("లాగిన్","Login");}
   return;
  }
  if(APP_CONFIG.demoMode && !id && !pin){state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();return}
  if(parent&&!state.parentLinked){toast("ముందుగా మీ పిల్లలను లింక్ చేయండి.");return}
  if(parent&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){toast("Student ID లేదా PIN సరిపోలలేదు.");return}
  state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
 };
}
function communityRegister(){alumniSponsorSection.renderRegistration();}
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
function modulePage(){
 const title=state.module||"Module";
 const cfg={
 "Attendance":["హాజరు నిర్వహణ","ఉదయం / సాయంత్రం Attendance","HM సవరణల ఆమోదం మరియు Audit History","తరగతి వారీగా హాజరు నివేదికలు"],
 "Teachers":["ఉపాధ్యాయుల జాబితా","కొత్త ఉపాధ్యాయుడిని చేర్చండి","ప్రొఫైల్ మరియు కేటాయించిన తరగతులు"],
 "Students":["విద్యార్థుల జాబితా","విద్యార్థిని చేర్చండి","Class / Roll Number నిర్వహణ"],
 "Daily Diary":["విషయాల వారీగా డైరీ","Teacher Submission","HM Review → Approve / Reject","Parentకు Approved Diary మాత్రమే"],
 "Homework":["హోంవర్క్ జాబితా","విషయం, తరగతి, Due Date","Parent View"],
 "Notice Board":["నోటీసు బోర్డు","Create Notice","HM Approval → Publish"],
 "Events & Calendar":["నెలవారీ క్యాలెండర్","Event Date Highlight","ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు"],
 "Mid-Day Meal":["ఎంచుకున్న తేదీకి భోజన వివరాలు","అదనపు ఆహారం / Sponsor వివరాలు","రోజువారీ రికార్డ్"],
 "Today Special":["పుట్టినరోజులు","జాతీయ / అంతర్జాతీయ ప్రత్యేక దినాలు","పాఠశాల ప్రత్యేకతలు"],
 "Great People":["గొప్ప వ్యక్తుల జాబితా","HM నిర్వహణ","Teacher / Parent View Only"],
 "Great Quotes":["గొప్ప సూక్తులు","HM నిర్వహణ","Teacher / Parent View Only"],
 "GI Knowledge World":["మన విజ్ఞాన ప్రపంచం","ఒకే GI Blog Link","వ్యాసాలు యాప్‌లో నిల్వ చేయబడవు"],
 "Poster Studio":["Poster Templates","Text / Color / Layout Edit","Local Preview → Share"],
 "Reports":["రోజువారీ నివేదికలు","నెలవారీ నివేదికలు","Attendance Summary"],
 "School Settings":["పాఠశాల ప్రాథమిక వివరాలు","అనుమతులు మరియు సెట్టింగ్స్"],
 "Alumni / Donor Management":["Registration approvals","Approved alumni and donors","School community records"],
 "Contact Inbox":["Messages from alumni and donors","Review and respond","Private school communication"],
 "School Requirements":["Post school needs","Review support offers","Track fulfilment"],
 "Student Adoption":["Full educational support","Specific student needs","Privacy-protected student support"],
 "School Sponsorship":["Financial sponsorship","Material sponsorship","School development support"],
 "Volunteer Management":["Mentorship requests","Volunteer offers","School approval"],
 "Volunteer & Mentorship":["Career guidance","Digital skills","Share your time and experience"],
 "Contact Head Master":["Direct school contact","Send a message","Request a meeting"],
 "Support a Requirement":["Open school needs","Express interest","Coordinate with Head Master"],
 "My Contributions":["My support history","Responses and status"],
 "Merit & Excellence Awards":["Last year class-wise best students","Academic and all-round excellence","Donor-sponsored recognition"],
 "My School":["School profile","School updates","Community information"]
 }[title]||["విభాగ వివరాలు","డెమో సమాచారం","ఈ స్క్రీన్ UI Preview దశలో ఉంది"];
 const calendar=title==="Events & Calendar";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?calendarMarkup():""}
 ${alumniSponsorSection.communityModuleMarkup(title)}
 <div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>
 ${title==="Mid-Day Meal"?mealMarkup():""}
 ${title==="Poster Studio"?posterMarkup():""}
 <div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
  
 setupPosterEditor();
 alumniSponsorSection.bindCommunityModuleActions();
}
function mealMarkup(){return `<section class="meal-day"><label for="mealDate">${T("తేదీ ఎంచుకోండి","Select date")}</label><input id="mealDate" type="date" value="2026-11-17"><div class="meal-result"><h3>${T("ఈ తేదీ భోజన వివరాలు","Meal details for selected date")}</h3><p>${T("ఆ తేదీకి ప్రత్యేకంగా వడ్డించిన వివరాలు నమోదు చేసి ఉంటే అవే ఇక్కడ కనిపిస్తాయి. లేకపోతే సాధారణ మెనూ వివరాలు కనిపిస్తాయి.","If actual or changed meal details are recorded for this date, those will appear here. Otherwise, the default menu will be shown.")}</p><div class="empty">${T("ప్రస్తుతం ఈ తేదీకి భోజన వివరాలు నమోదు కాలేదు.","No meal details have been entered for this date yet.")}</div></div><p class="meal-sponsor">${T("అదనపు ఆహారం ఉంటే దాని వివరాలు మరియు Sponsor సమాచారం ఇక్కడ చూపబడతాయి.","Additional food and sponsor details will appear here when recorded.")}</p></section>`}
function posterMarkup(){return `<section class="poster-editor"><div class="field"><label>${T("పోస్టర్ నమూనా","Poster template")}</label><select id="posterTemplate"><option value="festival">${T("పండుగ శుభాకాంక్షలు","Festival greetings")}</option><option value="birthday">${T("పుట్టినరోజు","Birthday")}</option><option value="achievement">${T("విద్యార్థి విజయం","Student achievement")}</option><option value="education">${T("విద్యా పోస్టర్","Educational poster")}</option><option value="quote">${T("ప్రేరణాత్మక సూక్తి","Inspirational quote")}</option></select></div><div class="field"><label>${T("శీర్షిక","Title")}</label><input id="posterTitle" value="${T("శుభాకాంక్షలు","Best Wishes")}"></div><div class="field"><label>${T("వివరాలు / పేరు","Details / Name")}</label><input id="posterText" value="${T("మన పాఠశాల","Our School")}"></div><div class="field"><label>${T("పాఠశాల పేరు","School name")}</label><input id="posterSchool" value="${escapeHtml(APP_CONFIG.schoolName)}"></div><div class="field"><label>${T("తేదీ","Date")}</label><input id="posterDate" type="date" value="2026-11-17"></div><div class="poster-canvas-wrap"><canvas id="posterCanvas" width="1080" height="1350"></canvas></div><div class="poster-actions"><button class="btn" id="posterPreview">${T("పోస్టర్ తయారు చేయండి","Create Poster")}</button><button class="btn secondary" id="posterDownload">${T("డౌన్‌లోడ్","Download")}</button></div><p class="demo-note">${T("పోస్టర్ మీ బ్రౌజర్‌లోనే రూపొందుతుంది; బాహ్య API లేదా Cloud Storage అవసరం లేదు.","The poster is rendered in your browser; no external API or cloud storage is used.")}</p></section>`}
function setupPosterEditor(){const canvas=document.querySelector("#posterCanvas");if(!canvas)return;const draw=()=>{const c=canvas.getContext("2d"),title=document.querySelector("#posterTitle").value||"Best Wishes",body=document.querySelector("#posterText").value||"",school=document.querySelector("#posterSchool").value||"",date=document.querySelector("#posterDate").value||"";c.clearRect(0,0,1080,1350);const g=c.createLinearGradient(0,0,1080,1350);g.addColorStop(0,"#e8f4ec");g.addColorStop(1,"#fbf3df");c.fillStyle=g;c.fillRect(0,0,1080,1350);c.strokeStyle="#34784e";c.lineWidth=18;c.strokeRect(55,55,970,1240);c.textAlign="center";c.fillStyle="#245b3d";c.font="bold 76px sans-serif";c.fillText(title.slice(0,28),540,430);c.fillStyle="#4775a4";c.font="52px sans-serif";c.fillText(body.slice(0,36),540,590);c.fillStyle="#245b3d";c.font="bold 42px sans-serif";c.fillText(school.slice(0,34),540,1050);c.font="32px sans-serif";c.fillText(date,540,1120);c.font="bold 30px sans-serif";c.fillText("A GI Creative Space work",540,1210)};draw();document.querySelector("#posterPreview").onclick=draw;["posterTitle","posterText","posterSchool","posterDate","posterTemplate"].forEach(id=>document.querySelector("#"+id).addEventListener("input",draw));document.querySelector("#posterDownload").onclick=()=>{const a=document.createElement("a");a.download="digital-mana-badi-poster.png";a.href=canvas.toDataURL("image/png");a.click()}}
function calendarMarkup(){
 const locale=state.lang==="te"?"te-IN":"en-IN";
 const first=new Date(state.selectedYear,state.selectedMonth,1),count=new Date(state.selectedYear,state.selectedMonth+1,0).getDate(),offset=first.getDay();
 const month=new Intl.DateTimeFormat(locale,{month:"long",year:"numeric"}).format(first);
 const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(locale,{weekday:"short"}).format(new Date(2026,0,4+i)));
 const eventDays=state.selectedMonth===10&&state.selectedYear===2026?[14,17,25]:[];
 const cells=Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>{const n=i-offset+1;if(n<1||n>count)return '<span class="calendar-empty" aria-hidden="true"></span>';const d=new Date(state.selectedYear,state.selectedMonth,n);return '<button type="button" class="day '+(eventDays.includes(n)?"has-event ":"")+(state.selectedDate===n?"selected":"")+'" data-day="'+n+'" aria-label="'+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(d)+'">'+new Intl.NumberFormat(locale).format(n)+'</button>'}).join("");
 const selected=new Date(state.selectedYear,state.selectedMonth,state.selectedDate);
 const message=eventDays.includes(state.selectedDate)?T("ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు క్రింద కనిపిస్తాయి.","All events for this date appear below."):T("ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date.");
 return '<div class="calendar-title"><div class="calendar-month-nav"><button type="button" class="btn secondary" id="calendarPrev" aria-label="'+T("గత నెల","Previous month")+'">‹</button><strong>'+month+'</strong><button type="button" class="btn secondary" id="calendarNext" aria-label="'+T("తదుపరి నెల","Next month")+'">›</button></div><span>'+T("కార్యక్రమ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి","Event dates are highlighted")+'</span></div><div class="calendar-grid">'+weekdays.map(d=>"<b>"+d+"</b>").join("")+cells+'</div><div class="selected-event"><strong>'+T("ఎంచుకున్న తేదీ","Selected date")+": "+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(selected)+'</strong><p>'+message+'</p></div>';
}
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

render();setupFooter();setupBottomNavigation();updateBottomNavigation();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));function linking(){parentSection.renderLinking();}
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
 ${state.role==="hm"?'<section class="stats-grid"><article class="stat-card"><strong>—</strong><span>విద్యార్థులు</span></article><article class="stat-card"><strong>—</strong><span>ఉపాధ్యాయులు</span></article><article class="stat-card"><strong>—</strong><span>ఈరోజు హాజరు</span></article><article class="stat-card"><strong>—</strong><span>పెండింగ్ ఆమోదాలు</span></article></section>':""}
 ${state.role==="teacher"?'<section class="card assigned"><h3>నా తరగతులు</h3><p>మీకు కేటాయించిన తరగతులు మాత్రమే కనిపిస్తాయి.</p><div class="chips"><span>Class 3</span><span>Class 5</span></div></section>':""}
 ${state.role==="parent"?'<section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>లింక్ చేసిన విద్యార్థి</h3><p>'+(state.linkedStudent?escapeHtml(state.linkedStudent.className+" • Roll "+state.linkedStudent.roll):"విద్యార్థి వివరాలు")+'</p></div></section>':""}
 <div class="section-head"><div><h2>మీ విభాగాలు</h2><p>మీ Roleకు అనుమతించిన సేవలు</p></div></div><section class="module-grid">${list.map(m=>`<button class="module-card" data-module="${m[2]}"><span class="card-icon">${iconSvg(m[0])}</span><strong>${m[1]}</strong><small>${m[3]}</small><span class="module-arrow">›</span></button>`).join("")}</section>
 ${commonHighlights()}`;
 main.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{state.module=b.dataset.module;state.view="module";render()});
 document.querySelector("#switchRoleHome").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#profileBtn").onclick=()=>{state.view="profile";render()};
}
function commonHighlights(){return `<section class="knowledge-card"><div class="knowledge-icon">◎</div><div><h2>${T("మన విజ్ఞాన ప్రపంచం","GI Knowledge World")}</h2><p>${T("జి.ఐ. నిర్వహించే ఒకే విజ్ఞాన బ్లాగ్ లింక్.","One centrally managed GI blog link.")}</p></div><a href="${APP_CONFIG.knowledgeBlogUrl}" target="_blank" rel="noopener">${T("బ్లాగ్ తెరవండి","Open Blog")} ↗</a></section>`}
function modulePage(){
 const title=state.module||"Module";
 const cfg={
 "Attendance":["హాజరు నిర్వహణ","ఉదయం / సాయంత్రం Attendance","HM సవరణల ఆమోదం మరియు Audit History","తరగతి వారీగా హాజరు నివేదికలు"],
 "Teachers":["ఉపాధ్యాయుల జాబితా","కొత్త ఉపాధ్యాయుడిని చేర్చండి","ప్రొఫైల్ మరియు కేటాయించిన తరగతులు"],
 "Students":["విద్యార్థుల జాబితా","విద్యార్థిని చేర్చండి","Class / Roll Number నిర్వహణ"],
 "Daily Diary":["విషయాల వారీగా డైరీ","Teacher Submission","HM Review → Approve / Reject","Parentకు Approved Diary మాత్రమే"],
 "Homework":["హోంవర్క్ జాబితా","విషయం, తరగతి, Due Date","Parent View"],
 "Notice Board":["నోటీసు బోర్డు","Create Notice","HM Approval → Publish"],
 "Events & Calendar":["నెలవారీ క్యాలెండర్","Event Date Highlight","ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు"],
 "Mid-Day Meal":["ఎంచుకున్న తేదీకి భోజన వివరాలు","అదనపు ఆహారం / Sponsor వివరాలు","రోజువారీ రికార్డ్"],
 "Today Special":["పుట్టినరోజులు","జాతీయ / అంతర్జాతీయ ప్రత్యేక దినాలు","పాఠశాల ప్రత్యేకతలు"],
 "Great People":["గొప్ప వ్యక్తుల జాబితా","HM నిర్వహణ","Teacher / Parent View Only"],
 "Great Quotes":["గొప్ప సూక్తులు","HM నిర్వహణ","Teacher / Parent View Only"],
 "GI Knowledge World":["మన విజ్ఞాన ప్రపంచం","ఒకే GI Blog Link","వ్యాసాలు యాప్‌లో నిల్వ చేయబడవు"],
 "Poster Studio":["Poster Templates","Text / Color / Layout Edit","Local Preview → Share"],
 "Reports":["రోజువారీ నివేదికలు","నెలవారీ నివేదికలు","Attendance Summary"],
 "School Settings":["పాఠశాల ప్రాథమిక వివరాలు","అనుమతులు మరియు సెట్టింగ్స్"],
 "Alumni / Donor Management":["Registration approvals","Approved alumni and donors","School community records"],
 "Contact Inbox":["Messages from alumni and donors","Review and respond","Private school communication"],
 "School Requirements":["Post school needs","Review support offers","Track fulfilment"],
 "Student Adoption":["Full educational support","Specific student needs","Privacy-protected student support"],
 "School Sponsorship":["Financial sponsorship","Material sponsorship","School development support"],
 "Volunteer Management":["Mentorship requests","Volunteer offers","School approval"],
 "Volunteer & Mentorship":["Career guidance","Digital skills","Share your time and experience"],
 "Contact Head Master":["Direct school contact","Send a message","Request a meeting"],
 "Support a Requirement":["Open school needs","Express interest","Coordinate with Head Master"],
 "My Contributions":["My support history","Responses and status"],
 "Merit & Excellence Awards":["Last year class-wise best students","Academic and all-round excellence","Donor-sponsored recognition"],
 "My School":["School profile","School updates","Community information"]
 }[title]||["విభాగ వివరాలు","డెమో సమాచారం","ఈ స్క్రీన్ UI Preview దశలో ఉంది"];
 const calendar=title==="Events & Calendar";
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?calendarMarkup():""}
 ${communityModuleMarkup(title)}
 <div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>
 ${title==="Mid-Day Meal"?mealMarkup():""}
 ${title==="Poster Studio"?posterMarkup():""}
 <div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div></section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
  
 setupPosterEditor();
 bindCommunityModuleActions();
}
function mealMarkup(){return `<section class="meal-day"><label for="mealDate">${T("తేదీ ఎంచుకోండి","Select date")}</label><input id="mealDate" type="date" value="2026-11-17"><div class="meal-result"><h3>${T("ఈ తేదీ భోజన వివరాలు","Meal details for selected date")}</h3><p>${T("ఆ తేదీకి ప్రత్యేకంగా వడ్డించిన వివరాలు నమోదు చేసి ఉంటే అవే ఇక్కడ కనిపిస్తాయి. లేకపోతే సాధారణ మెనూ వివరాలు కనిపిస్తాయి.","If actual or changed meal details are recorded for this date, those will appear here. Otherwise, the default menu will be shown.")}</p><div class="empty">${T("ప్రస్తుతం ఈ తేదీకి భోజన వివరాలు నమోదు కాలేదు.","No meal details have been entered for this date yet.")}</div></div><p class="meal-sponsor">${T("అదనపు ఆహారం ఉంటే దాని వివరాలు మరియు Sponsor సమాచారం ఇక్కడ చూపబడతాయి.","Additional food and sponsor details will appear here when recorded.")}</p></section>`}
function posterMarkup(){return `<section class="poster-editor"><div class="field"><label>${T("పోస్టర్ నమూనా","Poster template")}</label><select id="posterTemplate"><option value="festival">${T("పండుగ శుభాకాంక్షలు","Festival greetings")}</option><option value="birthday">${T("పుట్టినరోజు","Birthday")}</option><option value="achievement">${T("విద్యార్థి విజయం","Student achievement")}</option><option value="education">${T("విద్యా పోస్టర్","Educational poster")}</option><option value="quote">${T("ప్రేరణాత్మక సూక్తి","Inspirational quote")}</option></select></div><div class="field"><label>${T("శీర్షిక","Title")}</label><input id="posterTitle" value="${T("శుభాకాంక్షలు","Best Wishes")}"></div><div class="field"><label>${T("వివరాలు / పేరు","Details / Name")}</label><input id="posterText" value="${T("మన పాఠశాల","Our School")}"></div><div class="field"><label>${T("పాఠశాల పేరు","School name")}</label><input id="posterSchool" value="${escapeHtml(APP_CONFIG.schoolName)}"></div><div class="field"><label>${T("తేదీ","Date")}</label><input id="posterDate" type="date" value="2026-11-17"></div><div class="poster-canvas-wrap"><canvas id="posterCanvas" width="1080" height="1350"></canvas></div><div class="poster-actions"><button class="btn" id="posterPreview">${T("పోస్టర్ తయారు చేయండి","Create Poster")}</button><button class="btn secondary" id="posterDownload">${T("డౌన్‌లోడ్","Download")}</button></div><p class="demo-note">${T("పోస్టర్ మీ బ్రౌజర్‌లోనే రూపొందుతుంది; బాహ్య API లేదా Cloud Storage అవసరం లేదు.","The poster is rendered in your browser; no external API or cloud storage is used.")}</p></section>`}
function setupPosterEditor(){const canvas=document.querySelector("#posterCanvas");if(!canvas)return;const draw=()=>{const c=canvas.getContext("2d"),title=document.querySelector("#posterTitle").value||"Best Wishes",body=document.querySelector("#posterText").value||"",school=document.querySelector("#posterSchool").value||"",date=document.querySelector("#posterDate").value||"";c.clearRect(0,0,1080,1350);const g=c.createLinearGradient(0,0,1080,1350);g.addColorStop(0,"#e8f4ec");g.addColorStop(1,"#fbf3df");c.fillStyle=g;c.fillRect(0,0,1080,1350);c.strokeStyle="#34784e";c.lineWidth=18;c.strokeRect(55,55,970,1240);c.textAlign="center";c.fillStyle="#245b3d";c.font="bold 76px sans-serif";c.fillText(title.slice(0,28),540,430);c.fillStyle="#4775a4";c.font="52px sans-serif";c.fillText(body.slice(0,36),540,590);c.fillStyle="#245b3d";c.font="bold 42px sans-serif";c.fillText(school.slice(0,34),540,1050);c.font="32px sans-serif";c.fillText(date,540,1120);c.font="bold 30px sans-serif";c.fillText("A GI Creative Space work",540,1210)};draw();document.querySelector("#posterPreview").onclick=draw;["posterTitle","posterText","posterSchool","posterDate","posterTemplate"].forEach(id=>document.querySelector("#"+id).addEventListener("input",draw));document.querySelector("#posterDownload").onclick=()=>{const a=document.createElement("a");a.download="digital-mana-badi-poster.png";a.href=canvas.toDataURL("image/png");a.click()}}
function calendarMarkup(){
 const locale=state.lang==="te"?"te-IN":"en-IN";
 const first=new Date(state.selectedYear,state.selectedMonth,1),count=new Date(state.selectedYear,state.selectedMonth+1,0).getDate(),offset=first.getDay();
 const month=new Intl.DateTimeFormat(locale,{month:"long",year:"numeric"}).format(first);
 const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(locale,{weekday:"short"}).format(new Date(2026,0,4+i)));
 const eventDays=state.selectedMonth===10&&state.selectedYear===2026?[14,17,25]:[];
 const cells=Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>{const n=i-offset+1;if(n<1||n>count)return '<span class="calendar-empty" aria-hidden="true"></span>';const d=new Date(state.selectedYear,state.selectedMonth,n);return '<button type="button" class="day '+(eventDays.includes(n)?"has-event ":"")+(state.selectedDate===n?"selected":"")+'" data-day="'+n+'" aria-label="'+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(d)+'">'+new Intl.NumberFormat(locale).format(n)+'</button>'}).join("");
 const selected=new Date(state.selectedYear,state.selectedMonth,state.selectedDate);
 const message=eventDays.includes(state.selectedDate)?T("ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు క్రింద కనిపిస్తాయి.","All events for this date appear below."):T("ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date.");
 return '<div class="calendar-title"><div class="calendar-month-nav"><button type="button" class="btn secondary" id="calendarPrev" aria-label="'+T("గత నెల","Previous month")+'">‹</button><strong>'+month+'</strong><button type="button" class="btn secondary" id="calendarNext" aria-label="'+T("తదుపరి నెల","Next month")+'">›</button></div><span>'+T("కార్యక్రమ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి","Event dates are highlighted")+'</span></div><div class="calendar-grid">'+weekdays.map(d=>"<b>"+d+"</b>").join("")+cells+'</div><div class="selected-event"><strong>'+T("ఎంచుకున్న తేదీ","Selected date")+": "+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(selected)+'</strong><p>'+message+'</p></div>';
}
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
render();setupFooter();setupBottomNavigation();updateBottomNavigation();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
