export function createAccountScreens({main,state,roleNames,APP_CONFIG,render,toggleLanguage,toggleTheme,signOutPortal,T}) {
const t=(te,en)=>T?T(te,en):te;
function profilePage(){
 main.innerHTML='<div class="backline"><button class="btn secondary" id="profileBack">← '+t("డాష్‌బోర్డ్","Dashboard")+'</button></div><section class="form-card"><div class="login-symbol">◉</div><h2>'+t("ప్రొఫైల్","Profile")+'</h2><p>'+t(roleNames[state.role][0],roleNames[state.role][1])+' • '+APP_CONFIG.schoolName+'</p><div class="detail-list"><div class="detail-row"><div><strong>'+t("వ్యక్తిగత సమాచారం","Personal Information")+'</strong><small>'+t("పేరు మరియు ప్రాథమిక వివరాలు","Name and basic details")+'</small></div>›</div><div class="detail-row"><div><strong>'+t("పాత్ర మరియు అనుమతులు","Role & Access")+'</strong><small>'+t("మీకు అనుమతించిన విభాగాలు","Sections available to you")+'</small></div>›</div><div class="detail-row"><div><strong>'+t("పాఠశాల సమాచారం","School Information")+'</strong><small>'+t("పాఠశాల వివరాలు","School details")+'</small></div>›</div></div></section>';
 document.querySelector("#profileBack").onclick=()=>{state.view="dashboard";render()};
}
function settingsPage(){
 main.innerHTML='<div class="backline"><button class="btn secondary" id="settingsBack">← '+t("డాష్‌బోర్డ్","Dashboard")+'</button></div><section class="card module-detail"><h2>'+t("సెట్టింగులు","Settings")+'</h2><div class="detail-list"><div class="detail-row"><div><strong>'+t("భాష","Language")+'</strong><small>'+t("తెలుగు / English","Telugu / English")+'</small></div><button class="btn secondary" id="settingsLang">'+t("మార్చండి","Change")+'</button></div><div class="detail-row"><div><strong>'+t("రంగుల అమరిక","Theme")+'</strong><small>'+t("తెలుపు / ముదురు","Light / Dark")+'</small></div><button class="btn secondary" id="settingsTheme">'+t("మార్చండి","Change")+'</button></div><div class="detail-row"><div><strong>'+t("పాత్ర మార్చండి","Switch Role")+'</strong><small>'+t("స్వాగతం పేజీకి తిరిగి వెళ్లండి","Return to the Welcome screen")+'</small></div><button class="btn secondary" id="switchRole">'+t("మార్చండి","Switch")+'</button></div><div class="detail-row"><div><strong>'+t("లాగ్ అవుట్","Logout")+'</strong><small>'+t("ప్రస్తుత సెషన్ ముగించండి","End the current session")+'</small></div><button class="btn danger" id="logout">'+t("లాగ్ అవుట్","Logout")+'</button></div></div></section>';
 document.querySelector("#settingsBack").onclick=()=>{state.view="dashboard";render()};
 document.querySelector("#settingsLang").onclick=toggleLanguage;
 document.querySelector("#settingsTheme").onclick=toggleTheme;
 document.querySelector("#switchRole").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#logout").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
}
return {profilePage,settingsPage};
}
