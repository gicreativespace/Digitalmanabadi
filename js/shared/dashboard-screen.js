export function createDashboardScreen({main,state,T,roleMeta,modules,iconSvg,render,roleDashboardIntro,APP_CONFIG,escapeHtml,renderSuperAdminDashboard,signOutPortal}) {
function dashboard(){
 if(state.role==="superadmin"){
  renderSuperAdminDashboard(main,state.superAdminProfile,{
   onLogout:async()=>{await signOutPortal();state.role=null;state.authenticated=false;state.superAdminProfile=null;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render();},
   onRefresh:()=>render()
  });
  return;
 }
 // The Head Master gets a dedicated daily-operations dashboard. Other roles
 // continue through the original shared dashboard rendering path unchanged.
 if(state.role==="hm"){
  const meta=roleMeta.hm;
  main.innerHTML=`<div class="dashboard-actions hm-dashboard-actions"><button class="btn secondary" id="switchRoleHome">${T("పాత్ర మార్చండి","Switch Role")}</button><button class="btn secondary" id="profileBtn">◉ ${T("ప్రొఫైల్","Profile")}</button></div>
  ${roleDashboardIntro.hm?.({state,T,APP_CONFIG,escapeHtml})||""}`;
  main.querySelectorAll("[data-module]").forEach(button=>button.onclick=()=>{state.module=button.dataset.module;state.view="module";render()});
  document.querySelector("#switchRoleHome").onclick=async()=>{await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
  document.querySelector("#profileBtn").onclick=()=>{state.view="profile";render()};
  return;
 }
 const meta=roleMeta[state.role],list=modules[state.role]||[];
 main.innerHTML=`<div class="dashboard-head"><div><span class="pill">${T("నమస్కారం!","Welcome!")}</span><h1>${T(meta.titleTe||meta.title,meta.titleEn||meta.title)}</h1><p>${state.role==="hm"&&state.headMasterProfile?.school?.schoolName?escapeHtml(state.headMasterProfile.school.schoolName):T(meta.sub,meta.sub)}</p></div><div class="dashboard-actions"><button class="btn secondary" id="switchRoleHome">${T("Role మార్చు","Switch Role")}</button><button class="btn secondary" id="profileBtn">◉ ${T("ప్రొఫైల్","Profile")}</button></div></div>
 ${roleDashboardIntro[state.role]?.({state,T,escapeHtml})||""}
 <div class="section-head"><div><h2>${T("మీ విభాగాలు","Your Sections")}</h2><p>${T("మీ పాత్రకు అనుమతించిన సేవలు","Services available for your role")}</p></div></div><section class="module-grid">${list.map(m=>`<button class="module-card" data-module="${m[2]}"><span class="card-icon">${iconSvg(m[0])}</span><strong>${T(m[1],m[2])}</strong><small>${T(m[3],m[4]||m[3])}</small><span class="module-arrow">›</span></button>`).join("")}</section>
 ${commonHighlights()}`;
 main.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{state.module=b.dataset.module;state.view="module";render()});
 document.querySelector("#switchRoleHome").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#profileBtn").onclick=()=>{state.view="profile";render()};
}
function commonHighlights(){return `<section class="knowledge-card"><div class="knowledge-icon">◎</div><div><h2>${T("మన విజ్ఞాన ప్రపంచం","GI Knowledge World")}</h2><p>${T("జి.ఐ. నిర్వహించే ఒకే విజ్ఞాన బ్లాగ్ లింక్.","One centrally managed GI blog link.")}</p></div><a href="${APP_CONFIG.knowledgeBlogUrl}" target="_blank" rel="noopener">${T("బ్లాగ్ తెరవండి","Open Blog")} ↗</a></section>`}

 return {render:dashboard};
}
