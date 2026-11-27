import { getCurrentHeadMasterProfile, getLocalHeadMasterPinRecord, saveLocalHeadMasterPin, verifyLocalHeadMasterPin } from "../sections/head-master/pin-auth.js";
import { auth } from "../firebase-client.js";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getTeacherProfile } from "../sections/teacher/teacher-service.js";
import { getLocalTeacherPinRecord, saveLocalTeacherPin, verifyLocalTeacherPin } from "../sections/teacher/pin-auth.js";
import { verifyParentPin, saveParentPin, hasParentPin, getParentChildren, signInParentAccount } from "../sections/parent/parent-service.js";

export function createLoginScreen({main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,sendPortalPasswordReset,signOutPortal,roleLoginViews}) {
 async function renderParentPinGate(setup){
  const title=setup?T("మీ 4 అంకెల Parent PIN సెట్ చేయండి","Set your 4-digit Parent PIN"):T("Parent App Lock","Parent App Lock");
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="parentPinBack">← '+T("వెనక్కి","Back")+'</button><span class="pill">PARENT</span></div><section class="role-login-layout login-unified" data-role="parent"><section class="role-login-panel"><div class="role-login-panel-heading"><span class="role-login-panel-kicker">FAMILY & SCHOOL · SECURE ACCESS</span><h2>'+title+'</h2><p>'+T("మీ పిల్లల పాఠశాల వివరాలను సురక్షితంగా చూడండి.","Securely access your child school information.")+'</p></div><div class="role-login-alert" id="parentPinAlert" role="alert" aria-live="polite" hidden></div><div class="field"><label>'+T("4 అంకెల PIN","4-digit PIN")+'</label><input id="parentPinValue" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••"></div>'+(setup?'<div class="field"><label>'+T("PIN నిర్ధారించండి","Confirm PIN")+'</label><input id="parentPinConfirm" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••"></div>':'')+'<button type="button" class="btn full role-login-submit" id="parentPinContinue">'+(setup?T("PIN సేవ్ చేయండి","Save PIN"):T("అన్‌లాక్ చేయండి","Unlock"))+'</button></section></section>';
  const alert=main.querySelector("#parentPinAlert"),button=main.querySelector("#parentPinContinue");
  const show=message=>{alert.hidden=false;alert.textContent=message;};
  main.querySelector("#parentPinBack").onclick=async()=>{try{await signOut(auth)}catch{}state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render();};
  button.onclick=async()=>{
   const pin=main.querySelector("#parentPinValue").value;
   if(!/^\d{4}$/.test(pin)){show(T("4 అంకెల PIN నమోదు చేయండి.","Enter a valid 4-digit PIN."));return;}
   button.disabled=true;
   try{
    if(setup){if(pin!==main.querySelector("#parentPinConfirm").value){show(T("రెండు PINలు సరిపోలలేదు.","The PINs do not match."));button.disabled=false;return;}await saveParentPin(pin);}
    else if(!await verifyParentPin(pin)){show(T("PIN సరిపోలలేదు.","Incorrect PIN."));button.disabled=false;return;}
    const children=await getParentChildren();
    state.parentChildren=children;state.linkedStudent=children[0]||null;state.parentName=localStorage.getItem("gim_parent_name")||"";state.parentLinked=children.length>0;state.authenticated=children.length>0;
    localStorage.setItem("gim_role","parent");
    if(children.length){localStorage.setItem("gim_authenticated","true");state.view="dashboard";}else{localStorage.removeItem("gim_authenticated");state.view="link";}
    render();
   }catch(error){show(error?.message||T("Parent వివరాలు లోడ్ కాలేదు.","Could not load Parent details."));button.disabled=false;}
  };
 }
 async function renderHmPinGate(){
  const setup=state.hmPinMode==="setup";
  const title=setup?T("కొత్త 4 అంకెల PIN సెట్ చేయండి","Set your 4-digit PIN"):T("Head Master PIN","Head Master PIN");
  const description=setup?T("ఈ పరికరంలో త్వరిత ప్రవేశం కోసం PIN సెట్ చేయండి.","Create a PIN for quick access on this device."):T("మీ Firebase Session సక్రియంగా ఉంది. కొనసాగడానికి PIN నమోదు చేయండి.","Your Firebase session is active. Enter your PIN to continue.");
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="hmPinBack">← '+T("వెనక్కి","Back to Home")+'</button><span class="pill">HEAD MASTER</span></div><section class="role-login-layout login-unified" data-role="hm"><section class="role-login-panel"><div class="role-login-panel-heading"><span class="role-login-panel-kicker">SCHOOL LEADERSHIP · SECURE ACCESS</span><h2>'+title+'</h2><p>'+description+'</p></div><div class="role-login-alert" id="hmPinAlert" role="alert" aria-live="assertive" hidden></div><div class="field"><label for="hmPinValue">'+T("4 అంకెల PIN","4-digit PIN")+'</label><input id="hmPinValue" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" autocomplete="off" placeholder="••••"></div>'+(setup?'<div class="field"><label for="hmPinConfirm">'+T("PIN మళ్లీ నమోదు చేయండి","Confirm PIN")+'</label><input id="hmPinConfirm" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" autocomplete="off" placeholder="••••"></div>':'')+'<button class="btn full role-login-submit" id="hmPinContinue">'+(setup?T("PIN సేవ్ చేయండి","Save PIN"):T("కొనసాగించండి","Continue"))+'</button>'+(setup?'':'<div class="link-row"><button type="button" class="text-link" id="hmForgotPin">'+T("PIN మర్చిపోయారా? Email & Passwordతో ధృవీకరించండి","Forgot PIN? Verify with Email & Password")+'</button></div>')+'</section></section>';
  const alert=main.querySelector("#hmPinAlert");
  const show=(message,type="error")=>{alert.hidden=false;alert.dataset.type=type;alert.textContent=message;};
  main.querySelector("#hmPinBack").onclick=async()=>{try{await signOutPortal?.()}catch{}state.role=null;state.authenticated=false;state.hmPinMode=null;state.hmPinReset=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render();};
  main.querySelector("#hmPinContinue").onclick=async()=>{
   const pin=main.querySelector("#hmPinValue").value;
   const button=main.querySelector("#hmPinContinue");
   if(!/^\d{4}$/.test(pin)){show(T("దయచేసి 4 అంకెల PIN నమోదు చేయండి.","Enter a valid 4-digit PIN."),"warning");return;}
   button.disabled=true;
   try{
    if(setup){
     const confirm=main.querySelector("#hmPinConfirm").value;
     if(pin!==confirm){show(T("రెండు PINలు సరిపోలలేదు.","The PINs do not match."),"warning");button.disabled=false;return;}
     await saveLocalHeadMasterPin(state.headMasterProfile.uid,pin);
    }else{
     const activeProfile=await getCurrentHeadMasterProfile();
     if(!activeProfile||activeProfile.uid!==state.headMasterProfile?.uid){
      state.authenticated=false;state.hmPinMode=null;state.headMasterProfile=null;
      localStorage.removeItem("gim_authenticated");state.view="login";render();return;
     }
     const valid=await verifyLocalHeadMasterPin(activeProfile.uid,pin);
     if(!valid){show(T("PIN సరిపోలలేదు. మళ్లీ ప్రయత్నించండి.","Incorrect PIN. Please try again."));button.disabled=false;return}
    }
    state.hmPinMode=null;state.hmPinReset=false;state.authenticated=true;
    localStorage.setItem("gim_role","hm");localStorage.setItem("gim_authenticated","true");
    state.view="dashboard";render();
   }catch(error){show(T("సురక్షిత PIN సేవ్ చేయలేకపోయాం. ఈ Browserను Update చేసి మళ్లీ ప్రయత్నించండి.","Could not securely save the PIN. Update your browser and try again."));button.disabled=false;}
  };
  const forgot=main.querySelector("#hmForgotPin");
  if(forgot)forgot.onclick=async()=>{forgot.disabled=true;try{await signOutPortal?.();}catch{}state.authenticated=false;state.hmPinMode=null;state.hmPinReset=true;localStorage.setItem("gim_role","hm");localStorage.removeItem("gim_authenticated");state.view="login";render();};
 }
 function setupTeacherFlow(){
  const flow=main.querySelector("#teacherFlow");
  const alert=main.querySelector("#loginAlert");
  const show=(message,type="error")=>{alert.hidden=false;alert.dataset.type=type;alert.textContent=message;};
  const clear=()=>{alert.hidden=true;alert.textContent="";alert.dataset.type="";};
  const buttonBusy=(button,label)=>{button.disabled=true;button.textContent=label;};
  const inputField=(id,label,type="text",extra="")=>'<div class="field"><label for="'+id+'">'+label+'</label><input id="'+id+'" type="'+type+'" '+extra+'></div>';
  const renderStage=()=>{
   clear();
   if(state.teacherPinMode==="unlock"){
    flow.innerHTML='<h3>'+T("Teacher PIN","Teacher PIN")+'</h3><p class="teacher-flow-hint">'+T("మీ Firebase Session సక్రియంగా ఉంది. కొనసాగడానికి మీ PIN నమోదు చేయండి.","Your secure session is active. Enter your PIN to continue.")+'</p>'+inputField("teacherUnlockPin",T("4 అంకెల PIN","4-digit PIN"),"password",'inputmode="numeric" maxlength="4" autocomplete="current-password" placeholder="••••"')+'<button type="button" class="btn full role-login-submit" id="teacherUnlock">'+T("కొనసాగించండి","Continue")+'</button>';
    main.querySelector("#teacherUnlock").onclick=async()=>{
     const pin=main.querySelector("#teacherUnlockPin").value,button=main.querySelector("#teacherUnlock");
     if(!/^\d{4}$/.test(pin)){show(T("4 అంకెల PIN నమోదు చేయండి.","Enter your 4-digit PIN."),"warning");return;}
     buttonBusy(button,T("ధృవీకరిస్తోంది…","Verifying…"));
     try{
      const user=auth.currentUser;
      if(!user)throw new Error("Session expired. Please sign in again.");
      if(!await verifyLocalTeacherPin(user.uid,pin)){show(T("PIN సరిపోలలేదు. మళ్లీ ప్రయత్నించండి.","Incorrect PIN. Please try again."));button.disabled=false;button.textContent=T("కొనసాగించండి","Continue");return;}
      state.teacherProfile=await getTeacherProfile();
      state.teacherPinMode=null;state.authenticated=true;
      localStorage.setItem("gim_role","teacher");localStorage.setItem("gim_authenticated","true");
      state.view="dashboard";render();
     }catch(error){show(error?.message||T("Login సాధ్యం కాలేదు.","Unable to sign in."));button.disabled=false;button.textContent=T("కొనసాగించండి","Continue");}
    };
    return;
   }
   if(state.teacherLoginStep==="pin"){
    flow.innerHTML='<h3>'+T("మీ 4 అంకెల PIN సెట్ చేయండి","Set your 4-digit PIN")+'</h3><p class="teacher-flow-hint">'+T("తదుపరి సారి ఈ పరికరంలో త్వరగా ప్రవేశించడానికి PIN ఉపయోగించండి.","Use this PIN for quick access on this device next time.")+'</p>'+inputField("teacherNewPin",T("కొత్త PIN","New PIN"),"password",'inputmode="numeric" maxlength="4" autocomplete="new-password" placeholder="••••"')+inputField("teacherConfirmPin",T("PIN మళ్లీ నమోదు చేయండి","Confirm PIN"),"password",'inputmode="numeric" maxlength="4" autocomplete="new-password" placeholder="••••"')+'<button type="button" class="btn full role-login-submit" id="teacherSavePin">'+T("PIN సేవ్ చేయండి","Save PIN")+'</button>';
    main.querySelector("#teacherSavePin").onclick=async()=>{
     const pin=main.querySelector("#teacherNewPin").value,confirm=main.querySelector("#teacherConfirmPin").value,button=main.querySelector("#teacherSavePin");
     if(!/^\d{4}$/.test(pin)){show(T("4 అంకెల PIN నమోదు చేయండి.","Enter a 4-digit PIN."),"warning");return;}
     if(pin!==confirm){show(T("రెండు PINలు సరిపోలలేదు.","The PINs do not match."),"warning");return;}
     buttonBusy(button,T("సేవ్ చేస్తోంది…","Saving…"));
     try{
      const user=auth.currentUser;if(!user)throw new Error("Secure session expired. Please sign in again.");
      await saveLocalTeacherPin(user.uid,pin);
      state.teacherProfile=await getTeacherProfile();
      state.teacherEnrollmentInProgress=false;state.teacherPinMode=null;state.teacherLoginStep="id";state.authenticated=true;
      localStorage.setItem("gim_role","teacher");localStorage.setItem("gim_authenticated","true");
      state.view="dashboard";render();
     }catch(error){show(error?.message||T("PIN సేవ్ కాలేదు. మళ్లీ ప్రయత్నించండి.","Could not save the PIN. Please try again."));button.disabled=false;button.textContent=T("PIN సేవ్ చేయండి","Save PIN");}
    };
    return;
   }
   state.teacherLoginStep="id";
   flow.innerHTML='<h3>'+T("Teacher Login","Teacher Login")+'</h3>'+inputField("teacherIdInput",T("Login ID","Login ID"),"email",'inputmode="email" maxlength="40" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="2601@dagguluruschool.in"')+inputField("teacherPassword",T("Password","Password"),"password",'inputmode="numeric" maxlength="6" pattern="[0-9]{6}" autocomplete="current-password" placeholder="6-digit password"')+'<button type="button" class="btn full role-login-submit" id="teacherSignIn">'+T("ప్రవేశించండి","Sign In")+'</button>';
   const passwordInput=main.querySelector("#teacherPassword");
   passwordInput.addEventListener("input",()=>{passwordInput.value=passwordInput.value.replace(/\D/g,"").slice(0,6);});
   main.querySelector("#teacherSignIn").onclick=async()=>{
    const loginId=main.querySelector("#teacherIdInput").value.trim().toLowerCase(),password=main.querySelector("#teacherPassword").value,button=main.querySelector("#teacherSignIn");
    if(!/^\d{4}@dagguluruschool\.in$/.test(loginId)||!/^\d{6}$/.test(password)){show(T("సరైన Login ID మరియు 6 అంకెల Password నమోదు చేయండి.","Enter a valid Login ID and a 6-digit password."),"warning");return;}
    buttonBusy(button,T("ప్రవేశిస్తోంది…","Signing in…"));
    state.teacherEnrollmentInProgress=true;
    try{
     await setPersistence(auth,browserLocalPersistence);
     await signInWithEmailAndPassword(auth,loginId,password);
     state.teacherProfile=await getTeacherProfile();
     state.teacherEnrollmentInProgress=false;
     if(getLocalTeacherPinRecord(auth.currentUser.uid)){
      state.teacherPinMode="unlock";state.teacherLoginStep="id";
     }else{
      state.teacherPinMode="setup";state.teacherLoginStep="pin";
     }
     renderStage();
    }catch(error){
     state.teacherEnrollmentInProgress=false;
     if(auth.currentUser?.email===loginId){try{await signOut(auth);}catch{}}
     const code=error?.code||"";
     const message=code.includes("invalid-credential")||code.includes("user-not-found")||code.includes("wrong-password")
      ?T("Login ID లేదా Password సరిపోలలేదు.","Login ID or password is incorrect.")
      :code.includes("user-disabled")||code.includes("permission-denied")
       ?T("ఈ Teacher ఖాతా క్రియాశీలంగా లేదు. Head Master‌ను సంప్రదించండి.","This teacher account is inactive. Please contact the Head Master.")
       :error?.message||T("Login పూర్తి కాలేదు. మళ్లీ ప్రయత్నించండి.","Unable to sign in. Please try again.");
     show(message);
     button.disabled=false;button.textContent=T("ప్రవేశించండి","Sign In");
    }
   };
  };
  renderStage();
  if(state.teacherLoginNotice){show(state.teacherLoginNotice,"info");state.teacherLoginNotice=null;}
 }
 function login(){
  if(state.role==="parent"&&auth.currentUser&&!auth.currentUser.isAnonymous&&String(auth.currentUser.email||"").endsWith("@parents.dagguluruschool.in")){renderParentPinGate(!hasParentPin());return;}
  const role=roleNames[state.role],view=roleLoginViews[state.role]({T,state}),community=view.kind==="community",teacher=view.kind==="teacher";
  const meta={
   hm:{kicker:"SCHOOL LEADERSHIP",title:T("ప్రధానోపాధ్యాయుల ప్రవేశం","Head Master Access"),note:T("పాఠశాల నిర్వహణకు ఒకే సురక్షిత ప్రవేశం.","One secure gateway for school leadership."),quote:T("నాయకత్వం అభ్యాసానికి స్ఫూర్తినిస్తేనే పాఠశాల మరింత బలపడుతుంది.","A school grows stronger when leadership inspires learning.")},
   teacher:{kicker:"TEACHING & LEARNING",title:T("ఉపాధ్యాయుల ప్రవేశం","Teachers' Workspace"),note:T("మీ తరగతులు, బోధన, విద్యార్థుల పురోగతికి ఒకే వేదిక.","Your space for classes, teaching and student progress."),quote:T("మంచి ఉపాధ్యాయులు పాఠాలు మాత్రమే కాదు… భవిష్యత్తును నిర్మిస్తారు.","Great teachers don't just teach lessons… they shape the future.")},
   parent:{kicker:"FAMILY & SCHOOL",title:T("తల్లిదండ్రుల ప్రవేశం","Parent Connect"),note:T("మీ పిల్లల పాఠశాల ప్రయాణాన్ని దగ్గరగా తెలుసుకోండి.","Stay connected with your child's school journey."),quote:T("పిల్లల కలలకు తొలి బలం… తల్లిదండ్రుల ప్రోత్సాహం.","Every child's dreams begin with the encouragement of parents.")},
   community:{kicker:"SCHOOL COMMUNITY",title:T("పూర్వ విద్యార్థులు & ప్రోత్సాహకుల ప్రవేశం","Alumni & Sponsors"),note:T("మీ పాఠశాలతో అనుబంధం కొనసాగించండి. భవిష్యత్తుకు తోడ్పడండి.","Stay connected with your school. Help shape its future."),quote:T("మన బడి… మన గర్వం. దాని అభివృద్ధి… మన బాధ్యత.","Our School, Our Pride. Its Growth, Our Responsibility.")}
  }[state.role]||{};
  const title=view.title||meta.title||T(role[0]+" లాగిన్",role[1]+" Login");
  const isHm=state.role==="hm";
  if(isHm&&state.hmPinMode){renderHmPinGate();return;}
  state.loginAttempts=state.loginAttempts||{};
  const show=(message,type)=>{const el=main.querySelector("#loginAlert");if(el){el.hidden=false;el.dataset.type=type||"error";el.textContent=message}};
  const clear=()=>{const el=main.querySelector("#loginAlert");if(el){el.hidden=true;el.textContent="";el.dataset.type=""}};
  const fail=key=>(state.loginAttempts[key]=(state.loginAttempts[key]||0)+1);
  const errorText=(e,key)=>{const c=e&&e.code||"";if(c.includes("network-request-failed")||c.includes("unavailable")||c.includes("timeout"))return T("ఇంటర్నెట్ కనెక్షన్‌ను పరిశీలించి మళ్లీ ప్రయత్నించండి.","Connection issue. Please check and try again.");if(c.includes("too-many-requests"))return T("కొద్దిసేపు వేచి ఉండి మళ్లీ ప్రయత్నించండి.","Please wait a moment and try again.");if(c.includes("user-disabled"))return T("ప్రస్తుతం Login సాధ్యం కావడం లేదు. పాఠశాల నిర్వాహకులను సంప్రదించండి.","Unable to sign in right now. Please contact your school administrator.");if(c.includes("invalid-credential")||c.includes("wrong-password")||c.includes("user-not-found")){fail(key);return T("Login వివరాలు సరిపోలలేదు. మళ్లీ నమోదు చేయండి.","Login failed. Please check your details and try again.");}if(c.includes("user-token-expired")||c.includes("requires-recent-login")||c.includes("invalid-user-token"))return T("మీ Session గడువు ముగిసింది. మళ్లీ Login చేయండి.","Your session has expired. Please sign in again.");return T("Login పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.","Sign-in failed. Please try again.");};
  const actions=community
   ? '<div class="link-row"><button type="button" class="text-link" id="communityHelp">'+T("Account సహాయం కావాలా?","Need account help?")+'</button></div>'
   : (teacher||state.role==="parent") ? "" : '<div class="link-row"><button type="button" class="text-link" id="forgotAccess">'+T("Password మర్చిపోయారా?","Forgot Password?")+'</button></div>';
  const image=APP_CONFIG.schoolImage||"assets/branding/school/school-building.jpg";
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="backWelcome">← '+T("వెనక్కి","Back to Home")+'</button><span class="pill">'+T(role[0],role[1])+'</span></div>'+
   '<section class="role-login-layout login-unified" data-role="'+state.role+'" aria-label="'+title+'">'+
    '<section class="role-login-panel"><div class="role-login-panel-heading">'+
     '<img class="login-hero-image" src="'+image+'" alt="'+(APP_CONFIG.schoolName||T("పాఠశాల","School"))+' '+T("భవనం","building")+'">'+
     '<span class="role-login-panel-kicker">'+(meta.kicker||"DIGITAL MANA BADI")+'</span>'+
     '<h2>'+ T("స్వాగతం","Welcome") +'</h2>'+
     '<p class="login-role-quote">“'+(meta.quote||meta.note||"")+'”</p>'+
     '<h3 class="login-role-heading">'+title+'</h3>'+
     '<p>'+ (isHm?T("మీ పాఠశాల ఖాతాతో కొనసాగండి.","Sign in to your school account."):view.description) +'</p>'+
    '</div><div class="role-login-alert" id="loginAlert" role="alert" aria-live="assertive" hidden></div>'+view.formMarkup+actions+'</section></section>';
  main.querySelector("#backWelcome").onclick=async()=>{if(state.role==="teacher"){const keepLinkedSession=state.teacherPinMode==="unlock"&&auth.currentUser?.uid?.startsWith("teacher_");if(!keepLinkedSession&&auth.currentUser?.uid?.startsWith("teacher_")){try{await signOut(auth)}catch{}}state.teacherLoginStep="id";state.teacherLoginRecord=null;state.teacherEnrollmentInProgress=false;state.teacherLoginNotice=null;if(!keepLinkedSession){state.teacherPinMode=null;state.teacherProfile=null;}}state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
  if(teacher){setupTeacherFlow();return;}
  if(community){
   main.querySelector("#communityRegister").onclick=()=>{state.view="communityRegister";render()};
   main.querySelector("#communityHelp").onclick=()=>show(T("నమోదు అభ్యర్థన ప్రస్తుతం Preview Modeలో ఉంది. నిజమైన ఖాతా అనుమతి మరియు Sign-in ఇంకా అనుసంధానం కాలేదు. Head Master‌ను సంప్రదించండి.","Registration requests are currently in Preview Mode. Account approval and secure sign-in are not connected yet. Please contact the Head Master."),"info");
   return;
  }
  const forgotButton=main.querySelector("#forgotAccess");
  if(forgotButton)forgotButton.onclick=async()=>{
   clear();
   if(state.role==="teacher"){show(T("Teacher PIN Recovery ప్రస్తుతం అందుబాటులో లేదు. సురక్షిత ధృవీకరణ అనుసంధానం అయ్యే వరకు Head Master‌ను సంప్రదించండి.","Teacher PIN recovery is not available yet. Please contact the Head Master until secure verification is connected."),"info");return}
   if(state.role==="parent"){state.view="link";render();return}
   const email=main.querySelector("#loginId").value.trim();
   if(!email){show(T("ముందుగా మీ అధికారిక School Email నమోదు చేయండి.","Enter your official school email first."),"warning");main.querySelector("#loginId").focus();return}
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){show(T("దయచేసి సరైన Email నమోదు చేయండి.","Please enter a valid email address."),"warning");return}
   const b=main.querySelector("#forgotAccess");b.disabled=true;b.textContent=T("పంపిస్తోంది…","Sending…");
   try{await sendPortalPasswordReset(email);show(T("ఈ Email ఖాతా నమోదై ఉంటే Password Reset లింక్ పంపబడుతుంది. Inbox / Spam పరిశీలించండి.","If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder."),"success")}
   catch(e){show(errorText(e,"hm-reset"),"error")}
   finally{b.disabled=false;b.textContent=T("Password మర్చిపోయారా?","Forgot Password?")}
  };
  main.querySelector("#loginGo").onclick=async()=>{
   clear();const id=main.querySelector("#loginId").value.trim();
   if(state.role==="parent"){
    const password=main.querySelector("#loginPassword").value,b=main.querySelector("#loginGo");
    if(!id||!password){show(T("మొబైల్ నంబర్ మరియు Password నమోదు చేయండి.","Enter your mobile number and password."),"warning");return;}
    b.disabled=true;b.textContent=T("ప్రవేశిస్తోంది…","Signing in…");
    try{await signInParentAccount(id,password);await renderParentPinGate(!hasParentPin());}
    catch(error){show(error?.message||T("Parent Login పూర్తి కాలేదు.","Parent sign-in failed."));b.disabled=false;b.textContent=T("సురక్షితంగా ప్రవేశించండి","Sign In Securely");}
    return;
   }
   const pin=main.querySelector("#loginPin").value;
   if(!id||!pin){show(T("దయచేసి అవసరమైన రెండు వివరాలూ నమోదు చేయండి.","Please enter both required fields."),"warning");return}
   if(state.role==="hm"){
    const b=main.querySelector("#loginGo");b.disabled=true;b.textContent=T("ధృవీకరిస్తోంది…","Verifying…");
    try{
     state.hmPasswordJustVerified=true;
     const result=await authenticateHeadMaster(id,pin);
     state.hmPasswordJustVerified=false;
     state.loginAttempts.hm=0;state.headMasterProfile=result.profile;
     localStorage.setItem("gim_role","hm");
     if(state.hmPinReset||!getLocalHeadMasterPinRecord(result.profile.uid)){
      state.authenticated=false;state.hmPinMode="setup";state.hmPinReset=false;localStorage.removeItem("gim_authenticated");state.view="login";render();
     }else{
      state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
     }
    }
    catch(e){state.hmPasswordJustVerified=false;show(errorText(e,"hm"));b.disabled=false;b.textContent=T("సురక్షితంగా ప్రవేశించండి","Secure Login")}
    return;
   }

   show(T("ఈ Roleకు సురక్షిత Login ఇంకా అందుబాటులో లేదు.","Secure sign-in is not available for this role yet."),"info");
  };
 }
 return {render:login};
}