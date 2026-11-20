export function renderParentDashboardIntro({state,escapeHtml,T}) {
 if(state.role!=="parent") return "";
 const t=(te,en)=>T?T(te,en):te;
 return '<section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>'+t("లింక్ చేసిన విద్యార్థి","Linked Student")+'</h3><p>'+(state.linkedStudent?escapeHtml(state.linkedStudent.className+" • "+t("రోల్ నంబర్","Roll Number")+" "+state.linkedStudent.roll):t("విద్యార్థి వివరాలు","Student Details"))+'</p></div></section>';
}
