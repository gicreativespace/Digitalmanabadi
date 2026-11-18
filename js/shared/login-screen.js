export function createLoginScreen({main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,roleLoginViews}) {
 function login(){
  const role=roleNames[state.role],view=roleLoginViews[state.role]({T,state}),community=view.kind==="community";
  const roleTitle=view.title||T(role[0]+" లాగిన్",role[1]+" Login");
  main.innerHTML=`<div class="backline role-login-backline"><button class="btn secondary" id="backWelcome">← ${T("వెనక్కి","Back to Home")}</button><span class="pill">${T(role[0],role[1])}</span></div>
  <section class="role-login-layout" data-role="${state.role}" aria-label="${roleTitle}">
   <aside class="role-login-visual">
    <div class="role-login-orbit role-login-orbit-one" aria-hidden="true"></div><div class="role-login-orbit role-login-orbit-two" aria-hidden="true"></div>
    <div class="role-login-visual-content">
     <span class="role-login-visual-icon" aria-hidden="true">${iconSvg(roleMeta[state.role].icon)}</span>
     <span class="role-login-eyebrow">${view.eyebrow||"DIGITAL MANA BADI"}</span>
     <h1>${roleTitle}</h1>
     <p>${view.visualNote||view.description}</p>
     <span class="role-login-brandline">DIGITAL MANA BADI <i>•</i> ${T("మన భవిష్యత్తు… మన గర్వం!","Our Future… Our Pride!")}</span>
    </div>
   </aside>
   <section class="role-login-panel">
    <div class="role-login-panel-heading">
     <span class="role-login-panel-kicker">${T("స్వాగతం","WELCOME BACK")}</span>
     <h2>${community?T("మీ పాఠశాల సమాజంలో భాగమవ్వండి","Be Part of Your School Community"):T("మీ ఖాతాలోకి ప్రవేశించండి","Sign in to your account")}</h2>
     <p>${view.description}</p>
    </div>
    ${view.formMarkup}
    <div class="role-login-secure-note"><span aria-hidden="true">◈</span><span>${T("మీ పాత్రకు సంబంధించిన సేవలు మాత్రమే అందుబాటులో ఉంటాయి.","Access is limited to services assigned to your role.")}</span></div>
   </section>
  </section>`;
  document.querySelector("#backWelcome").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
  if(view.kind==="parent")document.querySelector("#startLink").onclick=()=>{state.view="link";render()};
  if(community){document.querySelector("#communityRegister").onclick=()=>{state.view="communityRegister";render()};document.querySelector("#communityPreview").onclick=()=>{state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()};return}
  document.querySelector("#loginGo").onclick=async()=>{
   const id=document.querySelector("#loginId").value.trim(),pin=document.querySelector("#loginPin").value;
   if(!id||!pin){toast(T("రెండు వివరాలు నమోదు చేయండి.","Please enter both fields."));return}
   if(state.role==="hm"){const button=document.querySelector("#loginGo");button.disabled=true;button.textContent="Verifying…";try{const result=await authenticateHeadMaster(id,pin);state.headMasterProfile=result.profile;state.authenticated=true;localStorage.setItem("gim_role","hm");localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()}catch(error){toast(error.message||"లాగిన్ ధృవీకరణ విఫలమైంది.");button.disabled=false;button.textContent=T("ప్రవేశించండి","Sign In")}return}
   if(APP_CONFIG.demoMode && !id && !pin){state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();return}
   if(view.kind==="parent"&&!state.parentLinked){toast("ముందుగా మీ పిల్లలను లింక్ చేయండి.");return}
   if(view.kind==="parent"&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){toast("Student ID లేదా PIN సరిపోలలేదు.");return}
   state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
  };
 }
 return {render:login};
}
