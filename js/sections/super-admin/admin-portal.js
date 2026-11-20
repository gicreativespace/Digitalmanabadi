import {auth,db} from "../../firebase-client.js";
import {signInWithEmailAndPassword,sendPasswordResetEmail,signOut} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {collection,addDoc,getDoc,getDocs,doc,setDoc,updateDoc,serverTimestamp,query,orderBy,limit} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const errMsg=e=>{const c=e?.code||"";if(c.includes("invalid-credential")||c.includes("user-not-found")||c.includes("wrong-password"))return "Email లేదా Password సరిపోలలేదు.";if(c.includes("too-many-requests"))return "చాలా ప్రయత్నాలు జరిగాయి. భద్రత కోసం కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.";if(c.includes("network-request-failed")||c.includes("unavailable"))return "ఇంటర్నెట్ కనెక్షన్‌ను పరిశీలించి మళ్లీ ప్రయత్నించండి.";if(c.includes("user-disabled"))return "ఈ ఖాతా నిలిపివేయబడింది. GI Support‌ను సంప్రదించండి.";return "ప్రస్తుతం Login సాధ్యం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.";};
export async function signOutPortal(){if(auth.currentUser)await signOut(auth);}
export async function sendPortalPasswordReset(email){if(!email)throw new Error("Email is required.");return sendPasswordResetEmail(auth,email.trim());}
export async function authenticateHeadMaster(email,password){
 const cred=await signInWithEmailAndPassword(auth,email,password);if(!cred.user.emailVerified){await signOut(auth);throw Error("దయచేసి మీ అధికారిక Emailను ముందుగా Verify చేయండి.");}const uid=cred.user.uid,s=await getDoc(doc(db,"headMasters",uid));
 if(!s.exists()||s.data().email?.toLowerCase()!==cred.user.email?.toLowerCase()||s.data().status!=="active"){await signOut(auth);throw Error("ఈ Head Master ఖాతా ఇంకా సక్రియం కాలేదు. GI Super Adminను సంప్రదించండి.");}
 const profile=s.data(),school=await getDoc(doc(db,"schools",profile.schoolId));
 if(!school.exists()||school.data().status!=="active"){await signOut(auth);throw Error("ఈ పాఠశాల ఖాతా ప్రస్తుతం సక్రియంగా లేదు.");}
 return {profile:{...profile,uid,school:school.data()}};
}
export function renderSuperAdminLogin(main,{onSuccess,onBack,onPasswordReset,T=(te,en)=>en,APP_CONFIG={}}){
 const quote=T("సాంకేతికతతో అనుసంధానం… బాధ్యతతో నిర్వహణ… నాణ్యతతో అభివృద్ధి.","Connected by technology. Guided by responsibility. Driven by excellence.");
 main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="superBack">← '+T("వెనక్కి","Back to Home")+'</button><span class="pill">GI SUPER ADMIN</span></div><section class="role-login-layout login-unified" data-role="superadmin" aria-label="GI Super Admin login"><section class="role-login-panel"><div class="role-login-panel-heading"><div class="login-hero-image-frame"><img class="login-hero-image login-hero-image--logo" src="assets/branding/gi-creative-space-logo.jpg" width="2032" height="528" alt="GI Creative Space" loading="eager" decoding="async" fetchpriority="high"></div><span class="role-login-panel-kicker">GI CREATIVE SPACE</span><h2>'+T("స్వాగతం","Welcome")+'</h2><p class="login-role-quote">“'+quote+'”</p><h3 class="login-role-heading">'+T("సూపర్ అడ్మిన్ ప్రవేశం","Super Admin Access")+'</h3><p>'+T("మీ నమోదిత ఖాతాతో కొనసాగండి.","Continue with your registered account.")+'</p></div><div class="role-login-alert" id="superError" role="alert" aria-live="assertive" hidden></div><div class="field"><label for="superEmail">'+T("నమోదిత ఇమెయిల్","Registered Email")+'</label><input id="superEmail" type="email" autocomplete="username" placeholder="'+T("మీ ఇమెయిల్ నమోదు చేయండి","Enter your email")+'"></div><div class="field"><label for="superPassword">'+T("పాస్‌వర్డ్","Password")+'</label><input id="superPassword" type="password" autocomplete="current-password" placeholder="••••••••"></div><button class="btn full role-login-submit" id="superContinue">'+T("ప్రవేశించండి","Sign In")+'</button><div class="link-row"><button type="button" class="text-link" id="superForgotPassword">'+T("పాస్‌వర్డ్ మర్చిపోయారా?","Forgot Password?")+'</button></div></section></section>';
 main.querySelector("#superBack").onclick=onBack;const box=main.querySelector("#superError"),button=main.querySelector("#superContinue");let failed=0;const show=(m,t)=>{box.hidden=false;box.dataset.type=t||"error";box.textContent=m},clear=()=>{box.hidden=true;box.textContent="";box.dataset.type=""};
 button.onclick=async()=>{const email=main.querySelector("#superEmail").value.trim(),password=main.querySelector("#superPassword").value;clear();if(!email||!password){show(T("దయచేసి ఇమెయిల్, పాస్‌వర్డ్ నమోదు చేయండి.","Please enter your email and password."),"warning");return}button.disabled=true;button.textContent=T("దయచేసి వేచి ఉండండి…","Please wait…");try{const c=await signInWithEmailAndPassword(auth,email,password);if(!c.user.emailVerified){await signOut(auth);throw Error("verification")}const s=await getDoc(doc(db,"platformAdmins",c.user.uid));if(!s.exists()||s.data().role!=="GI_SUPER_ADMIN"||s.data().status!=="active"){await signOut(auth);throw Error("unavailable")}failed=0;onSuccess({uid:c.user.uid,email:c.user.email,role:"GI_SUPER_ADMIN"})}catch(e){const c=e&&e.code||"";if(c.includes("invalid-credential")||c.includes("wrong-password")||c.includes("user-not-found")){failed++;show(T("Login విఫలమైంది. వివరాలు పరిశీలించి మళ్లీ నమోదు చేయండి.","Login failed. Please check your details and re-enter."))}else if(c.includes("network-request-failed")||c.includes("unavailable"))show(T("కనెక్షన్ సమస్య. మళ్లీ ప్రయత్నించండి.","Connection issue. Please check and try again."));else show(T("ప్రవేశం సాధ్యం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.","Unable to sign in. Please try again or contact support."));button.disabled=false;button.textContent=T("ప్రవేశించండి","Sign In")}};
 main.querySelector("#superForgotPassword").onclick=async()=>{clear();const email=main.querySelector("#superEmail").value.trim();if(!email){show(T("ముందుగా మీ నమోదిత ఇమెయిల్ నమోదు చేయండి.","Enter your registered email first."),"warning");main.querySelector("#superEmail").focus();return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){show(T("సరైన ఇమెయిల్ నమోదు చేయండి.","Please enter a valid email address."),"warning");return}const b=main.querySelector("#superForgotPassword");b.disabled=true;b.textContent=T("పంపిస్తోంది…","Sending…");try{await onPasswordReset(email);show(T("ఖాతా నమోదై ఉంటే, Password Reset సూచనలు పంపబడతాయి.","If an account exists, password recovery instructions have been sent."),"success")}catch(e){show(T("అభ్యర్థన పూర్తి కాలేదు. మళ్లీ ప్రయత్నించండి.","Unable to complete the request. Please try again."))}finally{b.disabled=false;b.textContent=T("పాస్‌వర్డ్ మర్చిపోయారా?","Forgot Password?")}};
}

let superAdminIdleTimer = null;
let superAdminActivityHandler = null;
let superAdminVisibilityHandler = null;
let superAdminLastActivity = 0;
let superAdminLogoutStarted = false;

function stopSuperAdminIdleMonitor(){
 if(superAdminIdleTimer)clearTimeout(superAdminIdleTimer);
 superAdminIdleTimer=null;
 if(superAdminActivityHandler){
  ["pointerdown","keydown","touchstart","scroll","mousemove"].forEach(type=>document.removeEventListener(type,superAdminActivityHandler,{passive:true}));
  document.removeEventListener("visibilitychange",superAdminVisibilityHandler);
  superAdminVisibilityHandler=null;
 }
 superAdminActivityHandler=null;
}

export async function renderSuperAdminDashboard(main,admin,{onLogout}){
 stopSuperAdminIdleMonitor();
 superAdminLogoutStarted=false;
 const currentLang=()=>localStorage.getItem("gim_lang")==="te"?"te":"en";
 const T=(te,en)=>currentLang()==="te"?te:en;
 const idleMinutes=15;
 const stamp=()=>Date.now();
 const beginLogout=async()=>{
  if(superAdminLogoutStarted)return;
  superAdminLogoutStarted=true;
  stopSuperAdminIdleMonitor();
  await onLogout();
 };
 const armIdleTimer=()=>{
  if(superAdminIdleTimer)clearTimeout(superAdminIdleTimer);
  const remaining=Math.max(0,idleMinutes*60*1000-(stamp()-superAdminLastActivity));
  superAdminIdleTimer=setTimeout(()=>{if(stamp()-superAdminLastActivity>=idleMinutes*60*1000)beginLogout();else armIdleTimer();},remaining);
 };
 superAdminLastActivity=stamp();
 superAdminActivityHandler=()=>{
  if(superAdminLogoutStarted)return;
  superAdminLastActivity=stamp();
  armIdleTimer();
 };
 const handleVisibilityChange=()=>{
  if(superAdminLogoutStarted||document.visibilityState!=="visible")return;
  if(stamp()-superAdminLastActivity>=idleMinutes*60*1000){beginLogout();return;}
  superAdminLastActivity=stamp();
  armIdleTimer();
 };
 ["pointerdown","keydown","touchstart","scroll","mousemove"].forEach(type=>document.addEventListener(type,superAdminActivityHandler,{passive:true}));
 superAdminVisibilityHandler=handleVisibilityChange;
 document.addEventListener("visibilitychange",superAdminVisibilityHandler);
 armIdleTimer();

 main.innerHTML=
 '<style>'+
 '.gi-admin{--ga-forest:#356f50;--ga-gold:#b99b57;--ga-line:#dce9df;--ga-card:#ffffff;color:#263b30;display:grid;gap:16px}'+
 '.gi-admin *{box-sizing:border-box}'+
 '.gi-admin-hero{background:linear-gradient(125deg,#edf7ee 0%,#e1f0e3 58%,#f5f8eb 100%);color:#284a35;border:1px solid #d7e8d9;border-radius:24px;padding:22px;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 12px 30px rgba(58,103,69,.08)}'+
 '.gi-admin-brand{display:flex;align-items:center;gap:12px;min-width:0}'+
 '.gi-admin-mark{width:48px;height:48px;flex:none;border-radius:15px;background:#d9eadb;color:#356f50;display:grid;place-items:center;font-size:25px;font-weight:900;border:1px solid #c7dfca}'+
 '.gi-admin-kicker{font-size:10px;letter-spacing:.16em;font-weight:800;color:#66866d}'+
 '.gi-admin-hero h1{font-size:clamp(21px,4vw,29px);line-height:1.2;margin:4px 0 3px;color:#284a35}'+
 '.gi-admin-hero p{font-size:12px;color:#6e8674;margin:0;overflow-wrap:anywhere}'+
 '.gi-admin-logout{flex:none;min-height:42px;border:1px solid #b9d2bd!important;background:#ffffffd9!important;color:#356348!important;border-radius:12px;padding:9px 13px;font-size:13px;font-weight:750}'+
 '.gi-admin-logout:hover{background:#f4faf4!important}'+
 '.gi-admin-overview-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 1px 0}'+
 '.gi-admin-overview-title h2{font-size:19px;margin:0;color:var(--text)}'+
 '.gi-admin-overview-title span{font-size:10px;letter-spacing:.1em;color:var(--muted);font-weight:800}'+
 '.gi-admin-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}'+
 '.gi-admin-metric{min-width:0;padding:16px;border:1px solid var(--ga-line);border-radius:17px;background:var(--ga-card);box-shadow:0 7px 20px rgba(58,103,69,.045)}'+
 '.gi-admin-metric-top{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--muted);font-size:12px;font-weight:700}'+
 '.gi-admin-metric-icon{width:34px;height:34px;border-radius:11px;background:var(--surface2);display:grid;place-items:center;font-size:17px;color:var(--green)}'+
 '.gi-admin-metric-value{display:block;margin:11px 0 2px;font-size:25px;font-weight:850;letter-spacing:-.03em;color:var(--text)}'+
 '.gi-admin-metric-note{font-size:11px;line-height:1.45;color:var(--muted)}'+
 '.gi-admin-panel{border:1px solid var(--ga-line);border-radius:19px;background:var(--ga-card);padding:17px;box-shadow:0 7px 20px rgba(58,103,69,.045)}'+
 '.gi-admin-panel-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}'+
 '.gi-admin-panel-title{display:flex;align-items:center;gap:10px;min-width:0}'+
 '.gi-admin-panel-icon{width:38px;height:38px;flex:none;border-radius:12px;background:var(--surface2);display:grid;place-items:center;font-size:19px;color:var(--green)}'+
 '.gi-admin-panel h2{font-size:16px;margin:0;color:var(--text)}'+
 '.gi-admin-panel p{font-size:12px;line-height:1.6;color:var(--muted);margin:0}'+
 '.gi-admin-status{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border-radius:999px;background:var(--surface2);color:var(--muted);font-size:10px;font-weight:800;white-space:nowrap}'+
 '.gi-admin-status:before{content:"";width:7px;height:7px;border-radius:50%;background:#b58b42}'+
 '.gi-admin-action-row{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:15px;padding-top:13px;border-top:1px solid var(--ga-line)}'+
 '.gi-admin-disabled{min-height:40px;border:1px solid var(--ga-line);border-radius:11px;padding:8px 12px;background:var(--surface2);color:var(--muted);font-size:12px;font-weight:750;opacity:.8;cursor:not-allowed}'+
 '.gi-admin-hint{margin-top:12px!important;padding:10px 11px;border-radius:11px;background:var(--surface2);font-size:11px!important}'+
 '.gi-admin-audit{display:grid;gap:0;margin-top:5px}'+
 '.gi-admin-audit-item{display:flex;align-items:flex-start;gap:11px;padding:12px 0;border-top:1px solid var(--ga-line)}'+
 '.gi-admin-audit-item:first-child{border-top:0}'+
 '.gi-admin-audit-dot{width:28px;height:28px;flex:none;border-radius:9px;background:var(--surface2);display:grid;place-items:center;color:var(--green);font-size:13px}'+
 '.gi-admin-audit-copy{min-width:0;flex:1}'+
 '.gi-admin-audit-copy strong{display:block;font-size:12px;line-height:1.4;color:var(--text);text-transform:capitalize}'+
 '.gi-admin-audit-copy span{display:block;margin-top:3px;font-size:11px;color:var(--muted);overflow-wrap:anywhere}'+
 '.gi-admin-empty{padding:13px;border-radius:11px;background:var(--surface2);color:var(--muted);font-size:12px;line-height:1.5}'+
 '.gi-admin-session{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:11px;padding:0 3px 3px}'+
 '.gi-admin-session b{color:var(--text)}'+
 '@media(max-width:430px){.gi-admin-hero{padding:17px;border-radius:19px;align-items:flex-start}.gi-admin-mark{width:42px;height:42px}.gi-admin-logout{padding:8px 10px;font-size:12px}.gi-admin-metric{padding:13px}.gi-admin-panel{padding:14px}.gi-admin-metric-value{font-size:22px}}'+
 '</style>'+
 '<div class="gi-admin">'+
  '<header class="gi-admin-hero">'+
   '<div class="gi-admin-brand"><div class="gi-admin-mark" aria-hidden="true">GI</div><div><div class="gi-admin-kicker">DIGITAL MANA BADI · PLATFORM CONTROL</div><h1>GI SUPER ADMIN</h1><p>'+safe(admin?.email)+'</p></div></div>'+
   '<button type="button" class="gi-admin-logout" id="giAdminLogout">↪ '+T("Logout","Logout")+'</button>'+
  '</header>'+
  '<div class="gi-admin-overview-title"><h2>'+T("ప్లాట్‌ఫామ్ అవలోకనం","Platform Overview")+'</h2><span>'+T("సిస్టమ్ స్థితి","SYSTEM STATUS")+'</span></div>'+
  '<section class="gi-admin-metrics" aria-label="Platform metrics">'+
   '<article class="gi-admin-metric"><div class="gi-admin-metric-top"><span>'+T("స్టోరేజ్ వినియోగం","Storage Usage")+'</span><span class="gi-admin-metric-icon">▤</span></div><strong class="gi-admin-metric-value">—</strong><div class="gi-admin-metric-note">'+T("మొత్తం నిల్వ","Total capacity used")+'</div></article>'+
   '<article class="gi-admin-metric"><div class="gi-admin-metric-top"><span>Firebase Usage</span><span class="gi-admin-metric-icon">◫</span></div><strong class="gi-admin-metric-value">—</strong><div class="gi-admin-metric-note">Firestore Reads / Writes</div></article>'+
  '</section>'+
  '<section class="gi-admin-panel"><div class="gi-admin-panel-head"><div class="gi-admin-panel-title"><span class="gi-admin-panel-icon">⏻</span><h2>'+T("Global App Control","Global App Control")+'</h2></div><span class="gi-admin-status">'+T("స్థితి","STATUS")+'</span></div><p>'+T("ప్లాట్‌ఫామ్ యాక్సెస్ నియంత్రణ","Platform access control")+'</p><div class="gi-admin-action-row"><div><strong style="font-size:12px">'+T("Global Enable / Disable","Global Enable / Disable")+'</strong></div><button type="button" class="gi-admin-disabled" disabled>'+T("నియంత్రణ","Manage")+'</button></div></section>'+
  '<section class="gi-admin-panel"><div class="gi-admin-panel-head"><div class="gi-admin-panel-title"><span class="gi-admin-panel-icon">▥</span><h2>Firebase & Storage Analytics</h2></div></div><div class="gi-admin-action-row"><div><strong style="font-size:12px">Firestore Reads / Writes</strong></div><span class="gi-admin-status">—</span></div><div class="gi-admin-action-row"><div><strong style="font-size:12px">'+T("Storage Consumption","Storage Consumption")+'</strong><p>'+T("ఇంకా అనుసంధానం కాలేదు","Not connected")+'</p></div><span class="gi-admin-status">'+T("పెండింగ్","PENDING")+'</span></div></section>'+
  '<section class="gi-admin-panel"><div class="gi-admin-panel-head"><div class="gi-admin-panel-title"><span class="gi-admin-panel-icon">⬡</span><h2>'+T("Security Activity","Security Activity")+'</h2></div></div><div class="gi-admin-audit" id="giAdminAudit"><div class="gi-admin-empty">'+T("కార్యకలాపాల చరిత్రను లోడ్ చేస్తోంది…","Loading recent activity…")+'</div></div></section>'+
  ''+
 '</div>';

 main.querySelector("#giAdminLogout").onclick=beginLogout;
 try{
  const result=await getDocs(query(collection(db,"adminAudit"),orderBy("createdAt","desc"),limit(8)));
  const box=main.querySelector("#giAdminAudit");
  if(!box)return;
  const entries=result.docs.map(d=>({id:d.id,...d.data()}));
  box.innerHTML=entries.length?entries.map(item=>{
   const rawAction=String(item.action||"Platform activity").replaceAll("_"," ").toLowerCase();
   const action=currentLang()==="te"?({login:"లాగిన్",logout:"లాగ్‌అవుట్",app_enabled:"యాప్ ప్రారంభం",app_disabled:"యాప్ నిలిపివేత",password_reset:"పాస్‌వర్డ్ రీసెట్",admin_action:"అడ్మిన్ చర్య"})[rawAction]||rawAction:rawAction;
   const subject=item.email||item.schoolName||item.schoolId||"Platform";
   let when="";
   try{if(item.createdAt?.toDate)when=item.createdAt.toDate().toLocaleString(currentLang()==="te"?"te-IN":"en-IN",{dateStyle:"medium",timeStyle:"short"});}catch{}
   return '<article class="gi-admin-audit-item"><span class="gi-admin-audit-dot" aria-hidden="true">✓</span><div class="gi-admin-audit-copy"><strong>'+safe(action)+'</strong><span>'+safe(subject)+(when?" · "+safe(when):"")+'</span></div></article>';
  }).join(""):'<div class="gi-admin-empty">'+T("ఇంకా కార్యకలాపాల చరిత్ర లేదు.","No activity has been recorded yet.")+'</div>';
 }catch(error){
  const box=main.querySelector("#giAdminAudit");
  if(box)box.innerHTML='<div class="gi-admin-empty">'+T("భద్రతా చరిత్రను లోడ్ చేయలేకపోయాం. తర్వాత మళ్లీ ప్రయత్నించండి.","Could not load security activity. Please try again later.")+'</div>';
 }
}
