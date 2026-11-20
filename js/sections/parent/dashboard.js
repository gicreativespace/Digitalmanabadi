export function renderParentDashboardIntro({state,escapeHtml,T}) {
 if(state.role!=="parent") return "";
 const t=(te,en)=>T?T(te,en):te;
 const esc=value=>escapeHtml?escapeHtml(String(value??"")):String(value??"");
 const classTitle=value=>{const match=/^class-([1-5])$/.exec(String(value||""));return match?t(match[1]+"వ తరగతి","Class "+match[1]):String(value||"")};
 const children=Array.isArray(state.parentChildren)&&state.parentChildren.length?state.parentChildren:(state.linkedStudent?[state.linkedStudent]:[]);
 return '<section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>'+t("లింక్ చేసిన విద్యార్థులు","Linked Students")+'</h3><p>'+t("మీ ఖాతాకు అనుసంధానమైన పిల్లల వివరాలు","Children connected to your Parent account")+'</p>'+
 (children.length?'<div class="parent-children-list">'+children.map(child=>'<div class="parent-child-item"><strong>'+esc(child.name||t("విద్యార్థి","Student"))+'</strong><span>'+esc(classTitle(child.classId||child.className||""))+' · '+t("రోల్ నంబర్","Roll Number")+' '+esc(child.rollNumber||"")+'</span><small>'+t("విద్యార్థి ID: ","Student ID: ")+esc(child.studentId||child.id||"")+'</small></div>').join("")+'</div>':t("ఇంకా విద్యార్థులు అనుసంధానం కాలేదు.","No students are linked yet."))+
 '</div></section>';
}
