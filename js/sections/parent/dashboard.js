export function renderParentDashboardIntro({state,escapeHtml}) {
 if(state.role!=="parent") return "";
 return '<section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>లింక్ చేసిన విద్యార్థి</h3><p>'+(state.linkedStudent?escapeHtml(state.linkedStudent.className+" • Roll "+state.linkedStudent.roll):"విద్యార్థి వివరాలు")+'</p></div></section>';
}
