// Teacher dashboard displays only Firebase-verified assignments.
export function renderTeacherDashboardIntro({state,T}) {
 if(state.role!=="teacher") return "";
 const t=(te,en)=>T?T(te,en):te;
 const profile=state.teacherProfile;
 if(!profile) return '<section class="card assigned"><h3>'+t("నా తరగతులు","My Classes")+'</h3><p>'+t("Teacher వివరాలను ధృవీకరిస్తోంది…","Verifying teacher details…")+'</p></section>';
 const classes=Array.isArray(profile.assignedClasses)?profile.assignedClasses:[];
 const subjects=Array.isArray(profile.teachingSubjects)?profile.teachingSubjects:[];
 const safe=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
 const chips=items=>items.length?items.map(item=>'<span>'+safe(item)+'</span>').join(""):'<span>'+t("ఇంకా కేటాయించలేదు","Not assigned yet")+'</span>';
 return '<section class="card assigned"><h3>'+t("నమస్కారం","Hello")+', '+safe(profile.name)+'</h3><p>Teacher ID: '+safe(profile.teacherId)+'</p><h4>'+t("నా తరగతులు","My Classes")+'</h4><div class="chips">'+chips(classes)+'</div><h4>'+t("నా బోధనా విషయాలు","My Teaching Subjects")+'</h4><div class="chips">'+chips(subjects)+'</div></section>';
}
