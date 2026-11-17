import {auth,db} from "./firebase-client.js";
import {signInWithEmailAndPassword,signOut} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {collection,addDoc,getDoc,getDocs,doc,setDoc,updateDoc,serverTimestamp,query,orderBy,limit} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const errMsg=e=>{const c=e?.code||"";if(c.includes("invalid-credential")||c.includes("user-not-found")||c.includes("wrong-password"))return "Email లేదా Password సరిపోలలేదు.";if(c.includes("too-many-requests"))return "చాలా ప్రయత్నాలు జరిగాయి. కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.";return e?.message||"ప్రస్తుతం చర్య పూర్తి కాలేదు.";};
export async function signOutPortal(){if(auth.currentUser)await signOut(auth);}
export async function authenticateHeadMaster(email,password){
 const cred=await signInWithEmailAndPassword(auth,email,password);if(!cred.user.emailVerified){await signOut(auth);throw Error("దయచేసి మీ అధికారిక Emailను ముందుగా Verify చేయండి.");}const uid=cred.user.uid,s=await getDoc(doc(db,"headMasters",uid));
 if(!s.exists()||s.data().email?.toLowerCase()!==cred.user.email?.toLowerCase()||s.data().status!=="active"){await signOut(auth);throw Error("ఈ Head Master ఖాతా ఇంకా సక్రియం కాలేదు. GI Super Adminను సంప్రదించండి.");}
 const profile=s.data(),school=await getDoc(doc(db,"schools",profile.schoolId));
 if(!school.exists()||school.data().status!=="active"){await signOut(auth);throw Error("ఈ పాఠశాల ఖాతా ప్రస్తుతం సక్రియంగా లేదు.");}
 return {profile:{...profile,uid,school:school.data()}};
}
export function renderSuperAdminLogin(main,{onSuccess,onBack}){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="superBack">← Back</button></div><section class="form-card super-card"><div class="login-symbol">⬡</div><h2>GI Super Admin</h2><p>Authorized GI Administrator Only</p><div class="field"><label>Registered Email</label><input id="superEmail" type="email" autocomplete="username" placeholder="GI Super Admin Email"></div><div class="field"><label>Password</label><input id="superPassword" type="password" autocomplete="current-password" placeholder="Enter password"></div><button class="btn full" id="superContinue">Secure Login</button><div class="demo-note">Firebase Authentication + GI Super Admin authorization verification.</div><p id="superError" class="admin-inline-note" hidden></p></section>`;
 main.querySelector("#superBack").onclick=onBack;
 main.querySelector("#superContinue").onclick=async()=>{const email=main.querySelector("#superEmail").value.trim(),password=main.querySelector("#superPassword").value,btn=main.querySelector("#superContinue"),box=main.querySelector("#superError");if(!email||!password){box.hidden=false;box.textContent="Email మరియు Password నమోదు చేయండి.";return;}btn.disabled=true;btn.textContent="Verifying…";box.hidden=true;try{const c=await signInWithEmailAndPassword(auth,email,password);if(!c.user.emailVerified){await signOut(auth);throw Error("GI Super Admin Email ఇంకా Verify కాలేదు.");}const s=await getDoc(doc(db,"platformAdmins",c.user.uid));if(!s.exists()||s.data().role!=="GI_SUPER_ADMIN"||s.data().status!=="active"){await signOut(auth);throw Error("ఈ ఖాతాకు GI Super Admin అనుమతి లేదు.");}onSuccess({uid:c.user.uid,email:c.user.email,role:"GI_SUPER_ADMIN"});}catch(e){box.hidden=false;box.textContent=errMsg(e);btn.disabled=false;btn.textContent="Secure Login";}};
}
export async function renderSuperAdminDashboard(main,admin,{onLogout,onRefresh}){
 main.innerHTML =
 '<div class="admin-shell">'+
  '<section class="admin-hero"><div class="admin-hero-copy"><span class="admin-kicker">GI SUPER ADMIN</span><h1>Welcome to your Admin Dashboard</h1><p>Signed in as <strong>'+safe(admin?.email)+'</strong></p></div><button class="btn secondary admin-logout" id="adminLogout">↪ Logout</button></section>'+
  '<nav class="admin-quick-nav" aria-label="Dashboard sections"><a href="#adminOverview">Overview</a><a href="#adminSchoolSection">Create School</a><a href="#adminHeadMasterSection">Head Master</a><a href="#adminActivitySection">Activity</a></nav>'+
  '<section class="admin-overview" id="adminOverview"><div class="admin-section-title"><div><span class="admin-step">OVERVIEW</span><h2>Platform Summary</h2></div><button class="btn secondary admin-refresh" id="adminRefresh">↻ Refresh</button></div><div class="admin-card-grid" id="adminStats"><div class="admin-stat"><strong>—</strong><span>Schools</span></div><div class="admin-stat"><strong>—</strong><span>Head Master Accounts</span></div><div class="admin-stat"><strong>—</strong><span>Active Head Masters</span></div></div></section>'+
  '<section class="admin-section" id="adminSchoolSection"><div class="admin-section-title"><div><span class="admin-step">01 · SCHOOL SETUP</span><h2>Create a School</h2><p>Add the official school details to the platform.</p></div><span class="admin-section-icon" aria-hidden="true">🏫</span></div><div class="admin-form-grid">'+
   '<div class="field"><label for="schoolName">School Name <span class="required-mark">*</span></label><input id="schoolName" autocomplete="organization" placeholder="Enter official school name"></div>'+
   '<div class="field"><label for="schoolCode">School Code <span class="required-mark">*</span></label><input id="schoolCode" maxlength="12" autocapitalize="characters" placeholder="Example: MPMP"></div>'+
   '<div class="field"><label for="schoolAddress">School Address <span class="required-mark">*</span></label><input id="schoolAddress" placeholder="Village, Mandal, District"></div>'+
   '<div class="field"><label for="academicYear">Academic Year <span class="required-mark">*</span></label><input id="academicYear" placeholder="Example: 2026–2027"></div>'+
  '</div><div class="admin-actions"><button class="btn admin-primary-action" id="createSchool">＋ Create School</button></div><p class="admin-inline-note"><strong>Note:</strong> School Code is the permanent unique identity of the school. Please check it carefully before saving.</p></section>'+
  '<section class="admin-section" id="adminHeadMasterSection"><div class="admin-section-title"><div><span class="admin-step">02 · ACCOUNT SETUP</span><h2>Add a Head Master</h2><p>Connect an existing Firebase Authentication account to a school.</p></div><span class="admin-section-icon" aria-hidden="true">👤</span></div>'+
   '<div class="admin-inline-note admin-instructions"><strong>Before you begin:</strong> On the Firebase Spark Free plan, create the Head Master account first in Firebase Console → Authentication → Users. Then enter its exact UID below.</div>'+
   '<div class="admin-form-grid">'+
    '<div class="field"><label for="hmName">Head Master Full Name <span class="required-mark">*</span></label><input id="hmName" autocomplete="name" placeholder="Enter full name"></div>'+
    '<div class="field"><label for="hmEmail">Official School Email <span class="required-mark">*</span></label><input id="hmEmail" type="email" autocomplete="email" placeholder="Enter registered email"></div>'+
    '<div class="field"><label for="hmUid">Firebase Authentication UID <span class="required-mark">*</span></label><input id="hmUid" autocapitalize="off" placeholder="Paste the exact Firebase UID"></div>'+
    '<div class="field"><label for="hmSchool">Assign School <span class="required-mark">*</span></label><select id="hmSchool"><option value="">Choose a school</option></select></div>'+
   '</div><div class="admin-actions"><button class="btn admin-primary-action" id="addHeadMaster">＋ Save Head Master Account</button></div>'+
   '<p class="admin-inline-note"><strong>Access control:</strong> Enable / Disable changes this app’s protected school access through Firestore Rules. It does not disable the Firebase Authentication identity itself.</p></section>'+
  '<section class="admin-section" id="adminAccountsSection"><div class="admin-section-title"><div><span class="admin-step">03 · ACCOUNT MANAGEMENT</span><h2>Head Master Accounts</h2><p>Search accounts and manage school access.</p></div><span class="admin-section-icon" aria-hidden="true">🔐</span></div>'+
   '<div class="field admin-search-field"><label for="hmSearch">Search by name, email, or school</label><input id="hmSearch" type="search" placeholder="Type to find a Head Master…"></div>'+
   '<div class="admin-record-list" id="hmRows" aria-live="polite"><div class="admin-empty-state">Loading Head Master accounts…</div></div></section>'+
  '<section class="admin-section" id="adminSchoolsSection"><div class="admin-section-title"><div><span class="admin-step">04 · SCHOOL DIRECTORY</span><h2>Registered Schools</h2><p>All schools created on this platform.</p></div><span class="admin-section-icon" aria-hidden="true">📚</span></div>'+
   '<div class="admin-record-list" id="schoolRows"><div class="admin-empty-state">Loading schools…</div></div></section>'+
  '<section class="admin-section" id="adminActivitySection"><div class="admin-section-title"><div><span class="admin-step">05 · MONITORING</span><h2>Recent Admin Activity</h2><p>A record of recent school and account changes.</p></div><span class="admin-section-icon" aria-hidden="true">🕘</span></div><div class="admin-record-list admin-activity-list" id="adminAuditRows"><div class="admin-empty-state">Loading activity…</div></div></section>'+
 '</div>';
 main.querySelector("#adminLogout").onclick=onLogout;
 main.querySelector("#adminRefresh").onclick=onRefresh;
 const createButton=main.querySelector("#createSchool"),addButton=main.querySelector("#addHeadMaster");
 const setBusy=(button,busy,label)=>{button.disabled=busy;button.textContent=busy?"Please wait…":label;};
 let schools=[],hms=[];
 const renderSchools=()=>{
  const box=main.querySelector("#schoolRows");
  box.innerHTML=schools.length?schools.map(s=>'<article class="admin-record-card"><div class="admin-record-main"><strong>'+safe(s.schoolName)+'</strong><span class="admin-record-sub">'+safe(s.address||"Address not added")+'</span><div class="admin-record-meta"><span>Code: <b>'+safe(s.schoolCode||s.id)+'</b></span><span>Academic Year: <b>'+safe(s.academicYear||"—")+'</b></span></div></div><span class="admin-status '+(s.status==="active"?"active":"disabled")+'">'+safe(s.status||"active")+'</span></article>').join(""):'<div class="admin-empty-state">No schools created yet. Use “Create a School” above to get started.</div>';
  const select=main.querySelector("#hmSchool"),selected=select.value;
  select.innerHTML='<option value="">Choose a school</option>'+schools.map(s=>'<option value="'+safe(s.id)+'">'+safe(s.schoolName)+' · '+safe(s.schoolCode||s.id)+'</option>').join("");
  if(schools.some(s=>s.id===selected))select.value=selected;
 };
 const renderHeadMasters=()=>{
  const box=main.querySelector("#hmRows"),term=main.querySelector("#hmSearch").value.trim().toLowerCase();
  const filtered=hms.filter(h=>[h.name,h.email,h.schoolName].some(v=>String(v||"").toLowerCase().includes(term)));
  box.innerHTML=filtered.length?filtered.map(h=>'<article class="admin-record-card admin-hm-card"><div class="admin-record-main"><strong>'+safe(h.name||"Head Master")+'</strong><span class="admin-record-sub">'+safe(h.email)+'</span><div class="admin-record-meta"><span>School: <b>'+safe(h.schoolName||h.schoolId||"Not assigned")+'</b></span></div></div><div class="admin-record-controls"><span class="admin-status '+(h.status==="active"?"active":"disabled")+'">'+(h.status==="active"?"Active":"Disabled")+'</span><button type="button" class="btn '+(h.status==="active"?"danger":"secondary")+' admin-toggle" data-hm-toggle="'+safe(h.id)+'">'+(h.status==="active"?"Disable Access":"Enable Access")+'</button></div></article>').join(""):(term?'<div class="admin-empty-state">No matching Head Master accounts found.</div>':'<div class="admin-empty-state">No Head Master accounts added yet. Create a school first, then add its Head Master.</div>');
  box.querySelectorAll("[data-hm-toggle]").forEach(button=>button.onclick=async()=>{
   const h=hms.find(item=>item.id===button.dataset.hmToggle),next=h.status==="active"?"disabled":"active";
   if(!confirm((next==="disabled"?"Disable":"Enable")+" this Head Master’s Digital Mana Badi school access?"))return;
   button.disabled=true;button.textContent="Updating…";
   try{
    await updateDoc(doc(db,"headMasters",h.id),{status:next,updatedAt:serverTimestamp(),updatedBy:admin.uid});
    await addDoc(collection(db,"adminAudit"),{action:next==="disabled"?"HEAD_MASTER_DISABLED":"HEAD_MASTER_ENABLED",headMasterUid:h.id,email:h.email,schoolId:h.schoolId,actorUid:admin.uid,createdAt:serverTimestamp()});
    h.status=next;renderHeadMasters();
    main.querySelector("#adminStats").innerHTML='<div class="admin-stat"><strong>'+schools.length+'</strong><span>Schools</span></div><div class="admin-stat"><strong>'+hms.length+'</strong><span>Head Master Accounts</span></div><div class="admin-stat"><strong>'+hms.filter(x=>x.status==="active").length+'</strong><span>Active Head Masters</span></div>';
    alert("Head Master app access updated.");
   }catch(e){alert(errMsg(e));button.disabled=false;button.textContent=next==="disabled"?"Disable Access":"Enable Access";}
  });
 };
 try{
  const results=await Promise.all([getDocs(collection(db,"schools")),getDocs(collection(db,"headMasters")),getDocs(query(collection(db,"adminAudit"),orderBy("createdAt","desc"),limit(10)))]);
  schools=results[0].docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.schoolName||"").localeCompare(b.schoolName||""));
  hms=results[1].docs.map(d=>({id:d.id,...d.data()}));
  renderSchools();renderHeadMasters();
  main.querySelector("#adminStats").innerHTML='<div class="admin-stat"><strong>'+schools.length+'</strong><span>Schools</span></div><div class="admin-stat"><strong>'+hms.length+'</strong><span>Head Master Accounts</span></div><div class="admin-stat"><strong>'+hms.filter(h=>h.status==="active").length+'</strong><span>Active Head Masters</span></div>';
  const audit=results[2].docs;
  main.querySelector("#adminAuditRows").innerHTML=audit.length?audit.map(d=>{const item=d.data();return '<article class="admin-activity-item"><span class="admin-activity-dot" aria-hidden="true">✓</span><div><strong>'+safe((item.action||"").replaceAll("_"," "))+'</strong><span>'+safe(item.email||item.schoolName||item.schoolId||"Platform update")+'</span></div></article>';}).join(""):'<div class="admin-empty-state">No admin activity recorded yet.</div>';
 }catch(e){
  const notice='<div class="admin-empty-state admin-load-error">Could not load dashboard data. Please confirm that the latest Firestore Rules have been published, then refresh.</div>';
  ["hmRows","schoolRows","adminAuditRows"].forEach(id=>{const el=main.querySelector("#"+id);if(el)el.innerHTML=notice;});
  main.querySelector("#adminStats").innerHTML='<div class="admin-stat admin-stat-error"><strong>!</strong><span>Data unavailable</span></div>';
 }
 main.querySelector("#hmSearch").addEventListener("input",renderHeadMasters);
 main.querySelector("#createSchool").onclick=async()=>{
  setBusy(createButton,true,"＋ Create School");
  try{
   const name=main.querySelector("#schoolName").value.trim(),code=main.querySelector("#schoolCode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,""),address=main.querySelector("#schoolAddress").value.trim(),year=main.querySelector("#academicYear").value.trim();
   if(!name||!code||!address||!year)throw Error("Please complete all four required school fields.");
   const ref=doc(db,"schools",code);if((await getDoc(ref)).exists())throw Error("This School Code is already in use. Please choose another code.");
   await setDoc(ref,{schoolName:name,schoolCode:code,address,academicYear:year,status:"active",createdAt:serverTimestamp(),createdBy:admin.uid});
   await addDoc(collection(db,"adminAudit"),{action:"SCHOOL_CREATED",schoolId:code,schoolName:name,actorUid:admin.uid,createdAt:serverTimestamp()});
   alert("School created successfully.");onRefresh();
  }catch(e){alert(errMsg(e));setBusy(createButton,false,"＋ Create School");}
 };
 main.querySelector("#addHeadMaster").onclick=async()=>{
  setBusy(addButton,true,"＋ Save Head Master Account");
  try{
   const name=main.querySelector("#hmName").value.trim(),email=main.querySelector("#hmEmail").value.trim().toLowerCase(),uid=main.querySelector("#hmUid").value.trim(),schoolId=main.querySelector("#hmSchool").value;
   if(!name||!email||!uid||!schoolId)throw Error("Please complete all four required Head Master fields.");
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error("Please enter a valid official email address.");
   if((await getDoc(doc(db,"headMasters",uid))).exists())throw Error("This Firebase UID is already assigned to a Head Master.");
   const school=schools.find(s=>s.id===schoolId);if(!school)throw Error("Please select a valid school.");
   await setDoc(doc(db,"headMasters",uid),{uid,email,name,role:"HEAD_MASTER",schoolId,schoolName:school.schoolName,status:"active",createdAt:serverTimestamp(),updatedAt:serverTimestamp(),createdBy:admin.uid});
   await addDoc(collection(db,"adminAudit"),{action:"HEAD_MASTER_CREATED",headMasterUid:uid,email,schoolId,actorUid:admin.uid,createdAt:serverTimestamp()});
   alert("Head Master profile linked successfully. The Firebase Authentication account must already exist.");onRefresh();
  }catch(e){alert(errMsg(e));setBusy(addButton,false,"＋ Save Head Master Account");}
 };
}
