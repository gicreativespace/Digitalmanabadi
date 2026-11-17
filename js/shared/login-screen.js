export function createLoginScreen({main,state,T,roleNames,roleMeta,iconSvg,render,toast,APP_CONFIG,authenticateHeadMaster,roleLoginViews}) {
 function login(){
  const role=roleNames[state.role],view=roleLoginViews[state.role]({T,state}),community=view.kind==="community";
  main.innerHTML=`<div class="backline"><button class="btn secondary" id="backWelcome">← ${T("వెనక్కి","Back")}</button><span class="pill">${T(role[0],role[1])}</span></div><section class="form-card"><div class="login-symbol">${iconSvg(roleMeta[state.role].icon)}</div><h2>${community?T("Alumni / Donor ప్రవేశం","Alumni / Donor Access"):T(role[0]+" లాగిన్",role[1]+" Login")}</h2><p>${view.description}</p>${view.formMarkup}</section>`;
  document.querySelector("#backWelcome").onclick=()=>{state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
  if(view.kind==="parent")document.querySelector("#startLink").onclick=()=>{state.view="link";render()};
  if(community){document.querySelector("#communityRegister").onclick=()=>{state.view="communityRegister";render()};document.querySelector("#communityPreview").onclick=()=>{state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()};return}
  document.querySelector("#loginGo").onclick=async()=>{
   const id=document.querySelector("#loginId").value.trim(),pin=document.querySelector("#loginPin").value;
   if(!id||!pin){toast(T("రెండు వివరాలు నమోదు చేయండి.","Please enter both fields."));return}
   if(state.role==="hm"){const button=document.querySelector("#loginGo");button.disabled=true;button.textContent="Verifying…";try{const result=await authenticateHeadMaster(id,pin);state.headMasterProfile=result.profile;state.authenticated=true;localStorage.setItem("gim_role","hm");localStorage.setItem("gim_authenticated","true");state.view="dashboard";render()}catch(error){toast(error.message||"లాగిన్ ధృవీకరణ విఫలమైంది.");button.disabled=false;button.textContent=T("లాగిన్","Login")}return}
   if(APP_CONFIG.demoMode && !id && !pin){state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();return}
   if(view.kind==="parent"&&!state.parentLinked){toast("ముందుగా మీ పిల్లలను లింక్ చేయండి.");return}
   if(view.kind==="parent"&&(id!==state.linkedStudent?.id||pin!==state.linkedStudent?.pin)){toast("Student ID లేదా PIN సరిపోలలేదు.");return}
   state.authenticated=true;localStorage.setItem("gim_authenticated","true");state.view="dashboard";render();
  };
 }
 return {render:login};
}
