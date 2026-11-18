export function createLoginScreen({main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,sendPortalPasswordReset,roleLoginViews}) {
 function login(){
  const role=roleNames[state.role],view=roleLoginViews[state.role]({T,state}),community=view.kind==="community";
  const meta={
   hm:{kicker:"SCHOOL LEADERSHIP",title:T("ప్రధానోపాధ్యాయుల ప్రవేశం","Head Master Access"),note:T("పాఠశాల నిర్వహణకు ఒకే సురక్షిత ప్రవేశం.","One secure gateway for school leadership."),quote:T("నాయకత్వం అభ్యాసానికి స్ఫూర్తినిస్తేనే పాఠశాల మరింత బలపడుతుంది.","A school grows stronger when leadership inspires learning.")},
   teacher:{kicker:"TEACHING & LEARNING",title:T("ఉపాధ్యాయుల ప్రవేశం","Teachers' Workspace"),note:T("మీ తరగతులు, బోధన, విద్యార్థుల పురోగతికి ఒకే వేదిక.","Your space for classes, teaching and student progress."),quote:T("మంచి ఉపాధ్యాయులు పాఠాలు మాత్రమే కాదు… భవిష్యత్తును నిర్మిస్తారు.","Great teachers don't just teach lessons… they shape the future.")},
   parent:{kicker:"FAMILY & SCHOOL",title:T("తల్లిదండ్రుల ప్రవేశం","Parent Connect"),note:T("మీ పిల్లల పాఠశాల ప్రయాణాన్ని దగ్గరగా తెలుసుకోండి.","Stay connected with your child's school journey."),quote:T("పిల్లల కలలకు తొలి బలం… తల్లిదండ్రుల ప్రోత్సాహం.","Every child's dreams begin with the encouragement of parents.")},
   community:{kicker:"SCHOOL COMMUNITY",title:T("పూర్వ విద్యార్థులు & ప్రోత్సాహకుల ప్రవేశం","Alumni & Sponsors"),note:T("మీ పాఠశాలతో అనుబంధం కొనసాగించండి. భవిష్యత్తుకు తోడ్పడండి.","Stay connected with your school. Help shape its future."),quote:T("మన బడి… మన గర్వం. దాని అభివృద్ధి… మన బాధ్యత.","Our School, Our Pride. Its Growth, Our Responsibility.")}
  }[state.role]||{};
  const title=view.title||meta.title||T(role[0]+" లాగిన్",role[1]+" Login");
  const isHm=state.role==="hm";
  state.loginAttempts=state.loginAttempts||{};
  const show=(message,type)=>{const el=main.querySelector("#loginAlert");if(el){el.hidden=false;el.dataset.type=type||"error";el.textContent=message}};
  const clear=()=>{const el=main.querySelector("#loginAlert");if(el){el.hidden=true;el.textContent="";el.dataset.type=""}};
  const fail=key=>(state.loginAttempts[key]=(state.loginAttempts[key]||0)+1);
  const errorText=(e,key)=>{const c=e&&e.code||"";if(c.includes("network-request-failed")||c.includes("unavailable")||c.includes("timeout"))return T("ఇంటర్నెట్ కనెక్షన్‌ను పరిశీలించి మళ్లీ ప్రయత్నించండి.","Connection issue. Please check and try again.");if(c.includes("too-many-requests"))return T("కొద్దిసేపు వేచి ఉండి మళ్లీ ప్రయత్నించండి.","Please wait a moment and try again.");if(c.includes("user-disabled"))return T("ప్రస్తుతం Login సాధ్యం కావడం లేదు. పాఠశాల నిర్వాహకులను సంప్రదించండి.","Unable to sign in right now. Please contact your school administrator.");if(c.includes("invalid-credential")||c.includes("wrong-password")||c.includes("user-not-found")){fail(key);return T("Login వివరాలు సరిపోలలేదు. మళ్లీ నమోదు చేయండి.","Login failed. Please check your details and try again.");}if(c.includes("user-token-expired")||c.includes("requires-recent-login")||c.includes("invalid-user-token"))return T("మీ Session గడువు ముగిసింది. మళ్లీ Login చేయండి.","Your session has expired. Please sign in again.");return T("Login పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.","Sign-in failed. Please try again.");};
  const actions=community
   ? '<div class="link-row"><button type="button" class="text-link" id="communityHelp">'+T("Account సహాయం కావాలా?","Need account help?")+'</button></div>'
   : '<div class="link-row"><button type="button" class="text-link" id="forgotAccess">'+(state.role==="parent"?T("Parent PIN మర్చిపోయారా?","Forgot Parent PIN?"):T("Password మర్చిపోయారా?","Forgot Password?"))+'</button></div>';
  const image=APP_CONFIG.schoolImage||"assets/branding/school/school-building.jpg";
  main.innerHTML='<div class="backline role-login-backline"><button class="btn secondary" id="backWelcome">← '+T("వెనక్కి","Back to Home")+'</button><span class="pill">'+T(role[0],role[1])+'</span></div>'+
   '<section class="role-login-layout login-unified" data-role="'+state.role+'" aria-label="'+title+'">'+
    '<section class="role-login-panel"><div class="role-login-panel-heading">'+
     '<img class="login-hero-image" src="'+image+'" alt="'+(APP_CONFIG.schoolName||T("పాఠశాల","School"))+' '+T("భవనం","building")+'">'+
     '<span class="role-login-panel-kicker">'+(meta.kicker||"DIGITAL MANA BADI")+'</span>'+
     '<h2>'+ (isHm?T("స్వాగతం గౌరవనీయ ప్రధానోపాధ్యాయులవారికి","Welcome, Respected Head Master"):T("స్వాగతం","Welcome")) +'</h2>'+
     '<p class="login-role-quote">“'+(meta.quote||meta.note||"")+'”</p>'+
     '<h3 class="login-role-heading">'+title+'</h3>'+
     '<p>'+ (isHm?T("మీ పాఠశాల ఖాతాతో కొనసాగండి.","Sign in to your school account."):view.description) +'</p>'+
    '</div><div class="role-login-alert" id="loginAlert" role="alert" aria-live="assertive" hidden></div>'+view.formMarkup+actions+'</section></section>';
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
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){show(T("దయచేసి సరైన Email నమోదు చేయండి.","Please enter a valid email address."),"warning");return}
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
   if(state.role==="parent"&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){fail("parent");show(T("వివరాలు సరిపోలలేదు. మళ్లీ నమోదు చేయండి.","Login failed. Please check your details and try again."),"error");return}
   if(state.role==="parent")state.loginAttempts.parent=0;state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
  };
 }
 return {render:login};
}