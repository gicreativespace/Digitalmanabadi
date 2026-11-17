export function createAccountScreens({main,state,roleNames,APP_CONFIG,render,toggleLanguage,toggleTheme,signOutPortal}) {
function profilePage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="profileBack">← Dashboard</button></div><section class="form-card"><div class="login-symbol">◉</div><h2>Profile</h2><p>${roleNames[state.role][0]} • ${APP_CONFIG.schoolName}</p><div class="detail-list"><div class="detail-row"><div><strong>Personal Information</strong><small>పేరు మరియు ప్రాథమిక వివరాలు</small></div>›</div><div class="detail-row"><div><strong>Role & Access</strong><small>మీకు అనుమతించిన విభాగాలు</small></div>›</div><div class="detail-row"><div><strong>School Information</strong><small>పాఠశాల వివరాలు</small></div>›</div></div></section>`;
 document.querySelector("#profileBack").onclick=()=>{state.view="dashboard";render()};
}
function settingsPage(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="settingsBack">← Dashboard</button></div><section class="card module-detail"><h2>Settings</h2><div class="detail-list"><div class="detail-row"><div><strong>Language</strong><small>తెలుగు / English</small></div><button class="btn secondary" id="settingsLang">Change</button></div><div class="detail-row"><div><strong>Theme</strong><small>Light / Dark</small></div><button class="btn secondary" id="settingsTheme">Change</button></div><div class="detail-row"><div><strong>Switch Role</strong><small>Welcome Screen‌కు తిరిగి వెళ్లండి</small></div><button class="btn secondary" id="switchRole">Switch</button></div><div class="detail-row"><div><strong>Logout</strong><small>ప్రస్తుత Session ముగించండి</small></div><button class="btn danger" id="logout">Logout</button></div></div></section>`;
 document.querySelector("#settingsBack").onclick=()=>{state.view="dashboard";render()};
 document.querySelector("#settingsLang").onclick=toggleLanguage;
 document.querySelector("#settingsTheme").onclick=toggleTheme;
 document.querySelector("#switchRole").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
 document.querySelector("#logout").onclick=async()=>{if(["hm","superadmin"].includes(state.role))await signOutPortal();state.role=null;state.authenticated=false;localStorage.removeItem("gim_role");localStorage.removeItem("gim_authenticated");state.view="welcome";render()};
}

 return {profilePage,settingsPage};
}
