// Teacher dashboard displays only Firebase-verified assignments.
export function renderTeacherDashboardIntro({state}) {
 if(state.role!=="teacher") return "";
 const profile=state.teacherProfile;
 if(!profile) return '<section class="card assigned"><h3>నా తరగతులు</h3><p>Teacher వివరాలను ధృవీకరిస్తోంది…</p></section>';
 const classes=Array.isArray(profile.assignedClasses)?profile.assignedClasses:[];
 const subjects=Array.isArray(profile.teachingSubjects)?profile.teachingSubjects:[];
 const safe=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
 const chips=items=>items.length?items.map(item=>'<span>'+safe(item)+'</span>').join(""):'<span>ఇంకా కేటాయించలేదు</span>';
 return '<section class="card assigned"><h3>నమస్కారం, '+safe(profile.name)+'</h3><p>Teacher ID: '+safe(profile.teacherId)+'</p><h4>నా తరగతులు</h4><div class="chips">'+chips(classes)+'</div><h4>నా బోధనా విషయాలు</h4><div class="chips">'+chips(subjects)+'</div></section>';
}
