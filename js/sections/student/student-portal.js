import { auth } from "../../firebase-client.js";
import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getStudentProfileForAuth, getStudentLoginId } from "../class-management/class-service.js";
import { getLocalStudentPinRecord, saveLocalStudentPin, verifyLocalStudentPin, clearLocalStudentPinRecord } from "./pin-auth.js";

export function createStudentPortal({main,state,T,render}){
 const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
 const setNotice=(message,type="error")=>{const node=main.querySelector("#studentPortalNotice");if(node){node.hidden=!message;node.dataset.type=type;node.textContent=message||"";}};
 const setAuthenticated=()=>{
  state.role="student";state.authenticated=true;state.studentPinMode=null;
  localStorage.setItem("gim_role","student");localStorage.setItem("gim_authenticated","true");
  state.view="dashboard";render();
 };
 const backHome=async()=>{
  try{if(auth.currentUser)await signOut(auth);}catch{}
  state.role=null;state.authenticated=false;state.studentProfile=null;state.studentPinMode=null;
  localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");
  window.history.replaceState(null,"",window.location.pathname);
  state.view="welcome";render();
 };
 function renderLogin(){
  const current=auth.currentUser;
  if(current&&state.studentProfile&&state.studentPinMode){
   renderPinGate();return;
  }
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="studentBackHome">← '+T("ముఖ్య పేజీ","Home")+'</button><span class="pill">STUDENT PORTAL</span></div>'+
   '<section class="role-login-layout login-unified" data-role="student"><section class="role-login-panel"><div class="role-login-panel-heading"><img class="login-hero-image" src="assets/branding/school/school-building.jpg" alt="'+T("పాఠశాల భవనం","School building")+'"><span class="role-login-panel-kicker">DIGITAL MANA BADI · STUDENT ACCESS</span><h2>'+T("విద్యార్థి ప్రవేశం","Student Login")+'</h2><p>'+T("మీ Student ID మరియు Head Master అందించిన Secret Code నమోదు చేయండి.","Enter your Student ID and the Secret Code provided by the Head Master.")+'</p></div><div class="role-login-alert" id="studentPortalNotice" role="alert" aria-live="assertive" hidden></div>'+
   (current?'<p class="teacher-flow-hint">'+T("ఈ Browserలో మరో ఖాతా సక్రియంగా ఉంది. Student Loginకు ముందు దాన్ని Sign out చేయండి.","Another account is active in this browser. Sign out before using Student Login.")+'</p><button type="button" class="btn full role-login-submit" id="studentOtherAccountSignout">'+T("ప్రస్తుత ఖాతా నుంచి Sign out","Sign out current account")+'</button>':
   '<form id="studentLoginForm"><div class="field"><label for="studentIdInput">Student ID</label><input id="studentIdInput" name="studentId" inputmode="numeric" autocomplete="username" maxlength="6" pattern="[0-9]{6}" placeholder="260101" required></div><div class="field"><label for="studentSecretInput">'+T("Permanent Secret Code","Permanent Secret Code")+'</label><input id="studentSecretInput" name="secretCode" type="password" inputmode="numeric" autocomplete="current-password" maxlength="12" pattern="[0-9]{12}" placeholder="••••••••••••" required></div><button type="submit" class="btn full role-login-submit" id="studentLoginSubmit">'+T("ధృవీకరించి కొనసాగండి","Verify & Continue")+'</button></form>')+
   '<p class="teacher-flow-hint">'+T("మొదటి ప్రవేశం తర్వాత ఈ పరికరంలో 4 అంకెల PIN సెట్ చేసుకోవచ్చు. కొత్త పరికరంలో Secret Codeతో మళ్లీ ధృవీకరించాలి.","After verification, set a 4-digit PIN on this device. A new device requires the Secret Code again.")+'</p></section></section>';
  main.querySelector("#studentBackHome").onclick=backHome;
  const otherSignout=main.querySelector("#studentOtherAccountSignout");
  if(otherSignout)otherSignout.onclick=async()=>{otherSignout.disabled=true;try{await signOut(auth);state.studentProfile=null;state.studentPinMode=null;renderLogin();}catch{setNotice(T("ప్రస్తుత ఖాతా నుంచి Sign out చేయలేకపోయాం.","Could not sign out the current account."));otherSignout.disabled=false;}};
  const form=main.querySelector("#studentLoginForm");
  if(form)form.onsubmit=async event=>{
   event.preventDefault();
   const studentId=main.querySelector("#studentIdInput").value.trim(),secretCode=main.querySelector("#studentSecretInput").value.trim(),button=main.querySelector("#studentLoginSubmit");
   if(!/^\d{6}$/.test(studentId)||!/^\d{12}$/.test(secretCode)){setNotice(T("Student ID 6 అంకెలు, Secret Code 12 అంకెలు ఉండాలి.","Student ID must contain 6 digits and Secret Code must contain 12 digits."),"warning");return;}
   button.disabled=true;button.textContent=T("ధృవీకరిస్తోంది…","Verifying…");
   try{
    await setPersistence(auth,browserLocalPersistence);
    await signInWithEmailAndPassword(auth,getStudentLoginId(studentId),secretCode);
    const profile=await getStudentProfileForAuth(auth.currentUser);
    state.studentProfile=profile;
    state.studentPinMode=getLocalStudentPinRecord(auth.currentUser.uid)?"unlock":"setup";
    state.authenticated=false;localStorage.setItem("gim_role","student");localStorage.removeItem("gim_authenticated");
    renderLogin();
   }catch(error){
    if(auth.currentUser?.email===getStudentLoginId(studentId)){
     try{await signOut(auth);}catch{}
    }
    setNotice(error?.code==="auth/invalid-credential"||error?.code==="auth/user-not-found"||error?.code==="auth/wrong-password"
      ?T("వివరాలు ధృవీకరించబడలేదు. Student ID మరియు Secret Code సరిచూసి మళ్లీ ప్రయత్నించండి.","Details could not be verified. Check the Student ID and Secret Code and try again.")
      :T(error?.message||"Student Login విఫలమైంది.","Student sign-in failed."));
    button.disabled=false;button.textContent=T("మళ్లీ ప్రయత్నించండి","Try Again");
   }
  };
 }
 function renderPinGate(){
  const setup=state.studentPinMode==="setup";
  const title=setup?T("మీ 4 అంకెల PIN సెట్ చేయండి","Set your 4-digit PIN"):T("Student PIN","Student PIN");
  const description=setup?T("ఈ పరికరంలో త్వరగా ప్రవేశించడానికి మీ PINను రెండుసార్లు నమోదు చేయండి.","Enter and confirm a PIN for quick access on this device."):T("మీ సురక్షిత Student Session కొనసాగుతోంది. మీ PIN నమోదు చేయండి.","Your secure Student session is active. Enter your PIN.");
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="studentBackHome">← '+T("ముఖ్య పేజీ","Home")+'</button><span class="pill">STUDENT · '+esc(state.studentProfile?.studentId||"")+'</span></div><section class="role-login-layout login-unified" data-role="student"><section class="role-login-panel"><div class="role-login-panel-heading"><span class="role-login-panel-kicker">DIGITAL MANA BADI · STUDENT ACCESS</span><h2>'+title+'</h2><p>'+esc(state.studentProfile?.name||"")+' · '+description+'</p></div><div class="role-login-alert" id="studentPortalNotice" role="alert" aria-live="assertive" hidden></div><div class="field"><label for="studentPinInput">'+T("4 అంకెల PIN","4-digit PIN")+'</label><input id="studentPinInput" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" autocomplete="off" placeholder="••••"></div>'+
   (setup?'<div class="field"><label for="studentPinConfirm">'+T("PIN మళ్లీ నమోదు చేయండి","Confirm PIN")+'</label><input id="studentPinConfirm" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" autocomplete="off" placeholder="••••"></div>':'')+
   '<button type="button" class="btn full role-login-submit" id="studentPinContinue">'+(setup?T("PIN సేవ్ చేయండి","Save PIN"):T("కొనసాగించండి","Continue"))+'</button>'+
   (setup?'':'<div class="link-row"><button type="button" class="text-link" id="studentUseSecretCode">'+T("Secret Codeతో మళ్లీ ధృవీకరించండి","Verify again with Secret Code")+'</button></div>')+
   '<p class="teacher-flow-hint">'+T("PIN ఈ పరికరంలో మాత్రమే salted hash రూపంలో నిల్వ అవుతుంది. కొత్త పరికరానికి Secret Code అవసరం.","The PIN is stored only on this device as a salted hash. A new device requires the Secret Code.")+'</p></section></section>';
  main.querySelector("#studentBackHome").onclick=backHome;
  main.querySelector("#studentPinContinue").onclick=async()=>{
   const pin=main.querySelector("#studentPinInput").value,button=main.querySelector("#studentPinContinue");
   if(!/^\d{4}$/.test(pin)){setNotice(T("4 అంకెల PIN నమోదు చేయండి.","Enter a valid 4-digit PIN."),"warning");return;}
   button.disabled=true;
   try{
    if(setup){
     const confirm=main.querySelector("#studentPinConfirm").value;
     if(pin!==confirm){setNotice(T("రెండు PINలు సరిపోలలేదు.","The PINs do not match."),"warning");button.disabled=false;return;}
     await saveLocalStudentPin(auth.currentUser.uid,pin);
    }else if(!await verifyLocalStudentPin(auth.currentUser.uid,pin)){
     setNotice(T("PIN సరిపోలలేదు. మళ్లీ ప్రయత్నించండి.","Incorrect PIN. Please try again."));
     button.disabled=false;return;
    }
    setAuthenticated();
   }catch(error){
    setNotice(T(error?.message||"Secure PIN setup failed.","Secure PIN setup failed."));
    button.disabled=false;
   }
  };
  const useSecret=main.querySelector("#studentUseSecretCode");
  if(useSecret)useSecret.onclick=async()=>{clearLocalStudentPinRecord(auth.currentUser?.uid);try{await signOut(auth);}catch{}state.studentProfile=null;state.studentPinMode=null;state.authenticated=false;localStorage.removeItem("gim_authenticated");renderLogin();};
 }
 function renderDashboard(){
  const student=state.studentProfile;
  if(!student||!auth.currentUser){state.authenticated=false;state.view="login";render();return;}
  const className=T(student.classNumber+"వ తరగతి","Class "+student.classNumber)+(student.section?" · "+student.section:"");
  main.innerHTML='<section class="hm-dashboard"><header class="hm-welcome"><span class="hm-eyebrow">DIGITAL MANA BADI · STUDENT PORTAL</span><h1>'+T("స్వాగతం, ","Welcome, ")+esc(student.name)+'</h1><p>'+T("మీ విద్యార్థి వివరాలు","Your student profile")+'</p></header><section class="hm-panel" style="padding:18px"><div class="hm-section-title"><div><h2>'+T("నా వివరాలు","My Details")+'</h2><p>'+T("పాఠశాల రికార్డులో ఉన్న మీ వివరాలు","Details recorded by your school")+'</p></div></div><div class="hm-stats"><article class="hm-stat" style="padding:14px"><span>Student ID</span><strong>'+esc(student.studentId)+'</strong></article><article class="hm-stat" style="padding:14px"><span>'+T("తరగతి / విభాగం","Class / Section")+'</span><strong>'+esc(className)+'</strong></article><article class="hm-stat" style="padding:14px"><span>'+T("Roll Number","Roll Number")+'</span><strong>'+esc(student.rollNumber)+'</strong></article><article class="hm-stat" style="padding:14px"><span>'+T("Academic Year","Academic Year")+'</span><strong>'+esc(student.academicYear)+'</strong></article></div><p>'+T("Attendance, Diary మరియు Homework వంటి విభాగాలు పాఠశాల డేటా అనుసంధానం పూర్తయ్యాక ఇక్కడ అందుబాటులో ఉంటాయి.","Attendance, Diary and Homework will appear here when those school data modules are connected.")+'</p><button type="button" class="btn secondary" id="studentSignOut">'+T("Sign out","Sign out")+'</button></section></section>';
  main.querySelector("#studentSignOut").onclick=async()=>{try{await signOut(auth);}catch{}state.role="student";state.authenticated=false;state.studentProfile=null;state.studentPinMode=null;localStorage.setItem("gim_role","student");localStorage.removeItem("gim_authenticated");state.view="login";render();};
 }
 return {renderLogin,renderPinGate,renderDashboard,backHome};
}
