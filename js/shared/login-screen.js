export function createLoginScreen({main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,sendPortalPasswordReset,roleLoginViews}) {
 function login(){
  const role=roleNames[state.role],view=roleLoginViews[state.role]({T,state}),community=view.kind==="community";
  const meta={
   hm:{kicker:"SCHOOL LEADERSHIP",title:T("ప్రధానోపాధ్యాయుల ప్రవేశం","Head Master Access"),note:T("పాఠశాల నిర్వహణకు ఒకే సురక్షిత ప్రవేశం.","One secure gateway for school leadership.")},
   teacher:{kicker:"TEACHING & LEARNING",title:T("ఉపాధ్యాయుల ప్రవేశం","Teacher Workspace"),note:T("మీ తరగతులు, బోధన, విద్యార్థుల పురోగతికి ఒకే వేదిక.","Your space for classes, teaching and student progress.")},
   parent:{kicker:"FAMILY & SCHOOL",title:T("తల్లిదండ్రుల ప్రవేశం","Parent Connect"),note:T("మీ పిల్లల పాఠశాల ప్రయాణాన్ని దగ్గరగా తెలుసుకోండి.","Stay connected with your child's school journey.")},
   community:{kicker:"SCHOOL COMMUNITY",title:T("పూర్వ విద్యార్థి / స్పాన్సర్","Alumni & Sponsor"),note:T("మీ పాఠశాలతో అనుబంధం కొనసాగించండి. భవిష్యత్తుకు తోడ్పడండి.","Stay connected with your school. Help shape its future.")}
  }[state.role]||{};
  const title=view.title||meta.title||T(role[0]+" లాగిన్",role[1]+" Login");
  state.loginAttempts=state.loginAttempts||{};
  const show=(message,type)=>{const el=main.querySelector("#loginAlert");if(el){el.hidden=false;el.dataset.type=type||"error";el.textContent=message}};
  const clear=()=>{const el=main.querySelector("#loginAlert");if(el){el.hidden=true;el.textContent="";el.dataset.type=""}};
  const fail=key=>(state.loginAttempts[key]=(state.loginAttempts[key]||0)+1);
  const errorText=(e,key)=>{
   const c=e&&e.code||"";
   if(c.includes("network-request-failed")||c.includes("unavailable")||c.includes("timeout"))return T("ఇంటర్నెట్ కనెక్షన్‌ను పరిశీలించి మళ్లీ ప్రయత్నించండి.","Network issue. Check your internet connection and try again.");
   if(c.includes("too-many-requests"))return T("చాలా ప్రయత్నాలు జరిగాయి. భద్రత కోసం కొద్దిసేపు వేచి ఉండండి.","Too many attempts. Please wait before trying again.");
   if(c.includes("user-disabled"))return T("ఈ ఖాతా నిలిపివేయబడింది. Head Master / GI Support‌ను సంప్రదించండి.","This account is disabled. Contact the Head Master or GI Support.");
   if(c.includes("invalid-credential")||c.includes("wrong-password")||c.includes("user-not-found")){const n=fail(key);return T("Email లేదా Password సరిపోలలేదు. తప్పు ప్రయత్నం: "+n+".","Email or password is incorrect. Failed attempt: "+n+".")+(n>=3?T(" మరిన్ని ప్రయత్నాలపై భద్రతా పరిమితులు వర్తించవచ్చు."," Further attempts may be security-limited."):"")}
   if(c.includes("user-token-expired")||c.includes("requires-recent-login")||c.includes("invalid-user-token"))return T("మీ Session గడువు ముగిసింది. మళ్లీ Login చేయండి.","Your session has expired. Please sign in again.");
   return e&&e.message||T("లాగిన్ ధృవీకరణ పూర్తికాలేదు. మళ్లీ ప్రయత్నించండి.","Sign-in could not be completed. Please try again.");
  };
  const actions=community
   ? '<div class="link-row"><button type="button" class="text-link" id="communityHelp">'+T("Account సహాయం కావాలా?","Need account help?")+'</button></div>'
   : '<div class="link-row"><button type="button" class="text-link" id="forgotAccess">'+(state.role==="parent"?T("Parent PIN మర్చిపోయారా?","Forgot Parent PIN?"):T("Password మర్చిపోయారా?","Forgot Password?"))+'</button></div>';
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="backWelcome">← '+T("వెనక్కి","Back to Home")+'</button><span class="pill">'+T(role[0],role[1])+'</span></div>'+
   '<section class="role-login-layout" data-role="'+state.role+'" aria-label="'+title+'">'+
    '<aside class="role-login-visual"><div class="role-login-orbit role-login-orbit-one" aria-hidden="true"></div><div class="role-login-orbit role-login-orbit-two" aria-hidden="true"></div><div class="role-login-visual-content">'+
     '<span class="role-login-visual-icon" aria-hidden="true">'+iconSvg(roleMeta[state.role].icon)+'</span><span class="role-login-eyebrow">'+(view.eyebrow||meta.kicker||"DIGITAL MANA BADI")+'</span><h1>'+title+'</h1><p>'+(view.visualNote||meta.note||view.description)+'</p><span class="role-login-brandline">DIGITAL MANA BADI <i>•</i> '+T("మన భవిష్యత్తు… మన గర్వం!","Our Future… Our Pride!")+'</span></div></aside>'+
    '<section class="role-login-panel"><div class="role-login-panel-heading"><span class="role-login-panel-kicker">'+T("స్వాగతం","WELCOME BACK")+'</span><h2>'+(community?T("మీ పాఠశాల సమాజంలో భాగమవ్వండి","Be Part of Your School Community"):T("మీ ఖాతాలోకి ప్రవేశించండి","Sign in to your account"))+'</h2><p>'+view.description+'</p></div>'+
     '<div class="role-login-alert" id="loginAlert" role="alert" aria-live="assertive" hidden></div>'+view.formMarkup+actions+
     '<div class="role-login-secure-note"><span aria-hidden="true">◈</span><span>'+T("మీ పాత్రకు సంబంధించిన సేవలు మాత్రమే అందుబాటులో ఉంటాయి.","Access is limited to services assigned to your role.")+'</span></div></section></section>';
  main.querySelector("#backWelcome").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
  if(community){
   main.querySelector("#communityRegister").onclick=()=>{state.view="communityRegister";render()};
   main.querySelector("#communityPreview").onclick=()=>{state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()};
   main.querySelector("#communityHelp").onclick=()=>show(T("Registration ఇంకా Preview Modeలో ఉంది. Account approval లేదా sign-in సహాయం కోసం Head Master‌ను సంప్రదించండి.","Registration is currently in Preview Mode. Contact the Head Master for account approval or sign-in assistance."),"info");
   return;
  }
  if(state.role==="parent")main.querySelector("#startLink").onclick=()=>{state.view="link";render()};
  main.querySelector("#forgotAccess").onclick=async()=>{
   clear();
   if(state.role==="teacher"){show(T("Teacher Login ప్రస్తుతం Preview Modeలో ఉంది. Password Recovery ఇంకా అనుసంధానం కాలేదు; Head Master‌ను సంప్రదించండి.","Teacher login is currently in Preview Mode. Password recovery is not connected yet; contact the Head Master."),"info");return}
   if(state.role==="parent"){state.view="link";render();return}
   const email=main.querySelector("#loginId").value.trim();
   if(!email){show(T("ముందుగా మీ అధికారిక School Email నమోదు చేయండి.","Enter your official school email first."),"warning");main.querySelector("#loginId").focus();return}
   if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){show(T("దయచేసి సరైన Email నమోదు చేయండి.","Please enter a valid email address."),"warning");return}
   const b=main.querySelector("#forgotAccess");b.disabled=true;b.textContent=T("పంపిస్తోంది…","Sending…");
   try{await sendPortalPasswordReset(email);show(T("ఈ Email ఖాతా నమోదై ఉంటే Password Reset లింక్ పంపబడుతుంది. Inbox / Spam పరిశీలించండి.","If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder."),"success")}
   catch(e){show(errorText(e,"hm-reset"),"error")}
   finally{b.disabled=false;b.textContent=T("Password మర్చిపోయారా?","Forgot Password?")}
  };
  main.querySelector("#loginGo").onclick=async()=>{
   clear();const id=main.querySelector("#loginId").value.trim(),pin=main.querySelector("#loginPin").value;
   if(!id||!pin){show(T("దయచేసి అవసరమైన రెండు వివరాలూ నమోదు చేయండి.","Please enter both required fields."),"warning");return}
   if(state.role==="hm"){
    const b=main.querySelector("#loginGo");b.disabled=true;b.textContent=T("ధృవీకరిస్తోంది…","Verifying…");
    try{const result=await authenticateHeadMaster(id,pin);state.loginAttempts.hm=0;state.headMasterProfile=result.profile;state.authenticated=true;localStorage.setItem("gim_role","hm");localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()}
    catch(e){show(errorText(e,"hm"));b.disabled=false;b.textContent=T("సురక్షితంగా ప్రవేశించండి","Secure Login")}
    return;
   }
   if(state.role==="parent"&&!state.parentLinked){show(T("ముందుగా మీ పిల్లల వివరాలను Link చేయండి.","Please link your child before signing in."),"warning");return}
   if(state.role==="parent"&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){const n=fail("parent");show(T("Student ID లేదా Parent PIN సరిపోలలేదు. తప్పు ప్రయత్నం: "+n+".","Student ID or Parent PIN is incorrect. Failed attempt: "+n+".")+(n>=3?T(" దయచేసి వివరాలు మళ్లీ పరిశీలించండి."," Please double-check your details."):""),"error");return}
   state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
  };
 }
 return {render:login};
}