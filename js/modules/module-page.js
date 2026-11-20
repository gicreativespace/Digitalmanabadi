import { renderCalendarMarkup } from "./calendar.js";
import { createTeacherRecord, listTeacherRecords } from "../sections/teacher/teacher-service.js";
import { renderMidDayMealMarkup } from "./mid-day-meal.js";
import { renderPosterStudioMarkup, setupPosterStudio } from "./poster-studio.js";

export function createModulePage({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection}) {
function teacherManagementMarkup(){
 return '<style>'+
 '.teacher-admin{display:grid;gap:16px;margin-top:18px}'+
 '.teacher-admin-card{border:1px solid var(--border);border-radius:16px;padding:16px;background:var(--surface)}'+
 '.teacher-admin-card h3{margin:0 0 12px;font-size:17px;color:var(--text)}'+
 '.teacher-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}'+
 '.teacher-admin .field{display:grid;gap:6px;margin:0}.teacher-admin .field label{font-size:13px;font-weight:700;color:var(--text)}'+
 '.teacher-admin input,.teacher-admin select{width:100%;min-height:45px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font:inherit}'+
 '.teacher-admin-help{font-size:12px;color:var(--muted);line-height:1.5;margin:6px 0 0}'+
 '.teacher-admin-action{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:14px}'+
 '.teacher-admin-result{display:none;margin-top:12px;padding:13px;border:1px solid var(--green);border-radius:12px;background:var(--surface2);overflow-wrap:anywhere}'+
 '.teacher-admin-result.is-visible{display:block}.teacher-admin-result strong{display:block;margin:4px 0;font-size:20px;letter-spacing:.06em}'+
 '.teacher-admin-list{display:grid;gap:10px}.teacher-admin-row{padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface2)}'+
 '.teacher-admin-row-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.teacher-admin-row strong{color:var(--text)}'+
 '.teacher-admin-row small{display:block;color:var(--muted);font-size:12px;line-height:1.55;margin-top:5px}'+
 '.teacher-admin-id{font-size:12px;font-weight:800;color:var(--green);letter-spacing:.06em}'+
 '.teacher-admin-empty{padding:14px;border:1px dashed var(--border);border-radius:12px;color:var(--muted);font-size:13px}'+
 '@media(max-width:560px){.teacher-admin-grid{grid-template-columns:1fr}.teacher-admin-card{padding:13px}}'+
 '</style>'+
 '<div class="teacher-admin">'+
  '<section class="teacher-admin-card"><h3>కొత్త ఉపాధ్యాయుడిని చేర్చండి</h3>'+
   '<form id="teacherCreateForm">'+
    '<div class="teacher-admin-grid">'+
     '<div class="field"><label for="teacherName">Teacher Name</label><input id="teacherName" name="name" maxlength="100" required autocomplete="name"></div>'+
     '<div class="field"><label for="teacherDob">Date of Birth</label><input id="teacherDob" name="dob" type="date" required></div>'+
     '<div class="field"><label for="teacherGender">Gender</label><select id="teacherGender" name="gender" required><option value="">Select Gender</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select></div>'+
     '<div class="field"><label for="teacherClasses">Assigned Classes</label><input id="teacherClasses" name="classes" placeholder="ఉదా: Class 1, Class 2" required></div>'+
     '<div class="field"><label for="teacherSubjects">Teaching Subjects</label><input id="teacherSubjects" name="subjects" placeholder="ఉదా: Telugu, Maths" required></div>'+
    '</div>'+
    '<p class="teacher-admin-help">Classes, Subjects‌ను commaతో వేరు చేసి నమోదు చేయండి.</p>'+
    '<div class="teacher-admin-action"><button class="btn" id="teacherCreateButton" type="submit">Create Teacher</button><span id="teacherCreateStatus" class="teacher-admin-help" role="status"></span></div>'+
   '</form>'+
   '<div id="teacherCreateResult" class="teacher-admin-result" aria-live="polite"></div>'+
  '</section>'+
  '<section class="teacher-admin-card"><h3>ఉపాధ్యాయుల జాబితా</h3><div id="teacherList" class="teacher-admin-list"><div class="teacher-admin-empty">ఉపాధ్యాయుల వివరాలను లోడ్ చేస్తోంది…</div></div></section>'+
 '</div>';
}
async function bindTeacherManagement(){
 const form=main.querySelector("#teacherCreateForm");
 const button=main.querySelector("#teacherCreateButton");
 const status=main.querySelector("#teacherCreateStatus");
 const resultBox=main.querySelector("#teacherCreateResult");
 const listBox=main.querySelector("#teacherList");
 const showError=error=>{status.textContent=error?.message||"ఉపాధ్యాయుడిని నమోదు చేయలేకపోయాం. మళ్లీ ప్రయత్నించండి.";};
 const refreshList=async()=>{
  listBox.innerHTML='<div class="teacher-admin-empty">ఉపాధ్యాయుల వివరాలను లోడ్ చేస్తోంది…</div>';
  try{
   const response=await listTeacherRecords();
   const teachers=response.teachers||[];
   listBox.innerHTML=teachers.length?teachers.map(teacher=>'<article class="teacher-admin-row"><div class="teacher-admin-row-top"><strong>'+escapeHtml(teacher.name)+'</strong><span class="teacher-admin-id">'+escapeHtml(teacher.teacherId)+'</span></div><small>Classes: '+escapeHtml((teacher.assignedClasses||[]).join(", "))+'</small><small>Subjects: '+escapeHtml((teacher.teachingSubjects||[]).join(", "))+'</small><small>Status: '+(teacher.linked?"Linked":"Not yet linked")+'</small></article>').join(""):'<div class="teacher-admin-empty">ఇంకా ఉపాధ్యాయులు నమోదు కాలేదు.</div>';
  }catch(error){listBox.innerHTML='<div class="teacher-admin-empty">'+escapeHtml(error?.message||"ఉపాధ్యాయుల జాబితాను లోడ్ చేయలేకపోయాం.")+'</div>';}
 };
 if(form)form.onsubmit=async event=>{
  event.preventDefault();status.textContent="";resultBox.classList.remove("is-visible");
  const split=value=>value.split(",").map(item=>item.trim()).filter(Boolean);
  const payload={
   name:main.querySelector("#teacherName").value.trim(),
   dob:main.querySelector("#teacherDob").value,
   gender:main.querySelector("#teacherGender").value,
   assignedClasses:split(main.querySelector("#teacherClasses").value),
   teachingSubjects:split(main.querySelector("#teacherSubjects").value)
  };
  if(!payload.assignedClasses.length||!payload.teachingSubjects.length){status.textContent="Classes మరియు Subjects నమోదు చేయండి.";return;}
  button.disabled=true;button.textContent="Creating…";
  try{
   const created=await createTeacherRecord(payload);
   resultBox.innerHTML='<span class="teacher-admin-help">Teacher నమోదు పూర్తయింది. ఈ Secret Code‌ను ఉపాధ్యాయుడికి వ్యక్తిగతంగా అందించండి. ఇది మళ్లీ చూపించబడదు.</span><small>Teacher ID</small><strong>'+escapeHtml(created.teacherId)+'</strong><small>Secret Code</small><strong>'+escapeHtml(created.secretCode)+'</strong><button type="button" class="btn secondary" id="teacherCopyCredentials">Copy Teacher ID & Secret Code</button>';
   resultBox.classList.add("is-visible");
   main.querySelector("#teacherCopyCredentials").onclick=async()=>{try{await navigator.clipboard.writeText("Teacher ID: "+created.teacherId+"\nSecret Code: "+created.secretCode);status.textContent="Credentials copied.";}catch{status.textContent="Copy unavailable. Please copy the details manually.";}};
   form.reset();await refreshList();
  }catch(error){showError(error);}
  finally{button.disabled=false;button.textContent="Create Teacher";}
 };
 await refreshList();
}
function modulePage(){
 const title=state.module||"Module";
 const cfg={
 "Attendance":["హాజరు నిర్వహణ","ఉదయం / సాయంత్రం Attendance","HM సవరణల ఆమోదం మరియు Audit History","తరగతి వారీగా హాజరు నివేదికలు"],
 "Teachers":["ఉపాధ్యాయుల జాబితా","కొత్త ఉపాధ్యాయుడిని చేర్చండి","ప్రొఫైల్ మరియు కేటాయించిన తరగతులు"],
 "Students":["విద్యార్థుల జాబితా","విద్యార్థిని చేర్చండి","Class / Roll Number నిర్వహణ"],
 "Daily Diary":["విషయాల వారీగా డైరీ","Teacher Submission","HM Review → Approve / Reject","Parentకు Approved Diary మాత్రమే"],
 "Homework":["హోంవర్క్ జాబితా","విషయం, తరగతి, Due Date","Parent View"],
 "Notice Board":["నోటీసు బోర్డు","Create Notice","HM Approval → Publish"],
 "Events & Calendar":["నెలవారీ క్యాలెండర్","Event Date Highlight","ఎంచుకున్న తేదీకి అన్ని ఈవెంట్లు"],
 "Mid-Day Meal":["ఎంచుకున్న తేదీకి భోజన వివరాలు","అదనపు ఆహారం / Sponsor వివరాలు","రోజువారీ రికార్డ్"],
 "Student Leaves":["విద్యార్థుల సెలవు అభ్యర్థనలు","తరగతి వారీగా Leave Status","Head Master పరిశీలన మరియు ఆమోదం"],
 "Class & Teacher Management":["Class Management","Teacher Management","తరగతులు మరియు ఉపాధ్యాయుల నిర్వహణ"],
 "Diary":["Class-wise Approved Diary","Subject-wise Class Work","Subject-wise Home Work"],
 "Great People & Quotes":["Great People","Great Quotes","విద్యార్థుల కోసం ప్రేరణాత్మక సమాచారం"],
 "Today Special":["పుట్టినరోజులు","జాతీయ / అంతర్జాతీయ ప్రత్యేక దినాలు","పాఠశాల ప్రత్యేకతలు"],
 "Great People":["గొప్ప వ్యక్తుల జాబితా","HM నిర్వహణ","Teacher / Parent View Only"],
 "Great Quotes":["గొప్ప సూక్తులు","HM నిర్వహణ","Teacher / Parent View Only"],
 "GI Knowledge World":["మన విజ్ఞాన ప్రపంచం","ఒకే GI Blog Link","వ్యాసాలు యాప్‌లో నిల్వ చేయబడవు"],
 "Poster Studio":["Poster Templates","Text / Color / Layout Edit","Local Preview → Share"],
 "Reports":["రోజువారీ నివేదికలు","నెలవారీ నివేదికలు","Attendance Summary"],
 "School Settings":["పాఠశాల ప్రాథమిక వివరాలు","అనుమతులు మరియు సెట్టింగ్స్"],
 "Alumni / Donor Management":["Registration approvals","Approved alumni and donors","School community records"],
 "Contact Inbox":["Messages from alumni and donors","Review and respond","Private school communication"],
 "School Requirements":["Post school needs","Review support offers","Track fulfilment"],
 "Student Adoption":["Full educational support","Specific student needs","Privacy-protected student support"],
 "School Sponsorship":["Financial sponsorship","Material sponsorship","School development support"],
 "Volunteer Management":["Mentorship requests","Volunteer offers","School approval"],
 "Volunteer & Mentorship":["Career guidance","Digital skills","Share your time and experience"],
 "Contact Head Master":["Direct school contact","Send a message","Request a meeting"],
 "Support a Requirement":["Open school needs","Express interest","Coordinate with Head Master"],
 "My Contributions":["My support history","Responses and status"],
 "Merit & Excellence Awards":["Last year class-wise best students","Academic and all-round excellence","Donor-sponsored recognition"],
 "My School":["School profile","School updates","Community information"]
 }[title]||["విభాగ వివరాలు","డెమో సమాచారం","ఈ స్క్రీన్ UI Preview దశలో ఉంది"];
 const calendar=title==="Events & Calendar";
 const hmGroupLinks={
  "Class & Teacher Management":[["Students","Class Management","తరగతులు, విద్యార్థుల జాబితా మరియు రోల్ వివరాలు"],["Teachers","Teacher Management","ఉపాధ్యాయుల వివరాలు మరియు తరగతి కేటాయింపులు"]],
  "Diary":[["Daily Diary","Class-wise Diary","ప్రతి Subjectకు Class Work వివరాలు"],["Homework","Home Work","ప్రతి Subjectకు Home Work వివరాలు"]],
  "Great People & Quotes":[["Great People","Great People","గొప్ప వ్యక్తుల జీవిత విశేషాలు"],["Great Quotes","Great Quotes","ప్రేరణాత్మక సూక్తులు"]],
  "Events & Calendar":[["Today Special","Birthdays & Special Days","పుట్టినరోజులు మరియు ప్రత్యేక దినాలు"]],
  "Alumni & Donor Management":[["Alumni / Donor Management","Login Approval Requests","నమోదు మరియు లాగిన్ అభ్యర్థనలు"],["Contact Inbox","Donor Details & Offerings","దాతల వివరాలు మరియు వారి సహాయం"],["School Requirements","School Requirements","పాఠశాల అవసరాలు"],["Student Adoption","Student Adoptions","విద్యార్థుల విద్యా సహాయం"],["School Sponsorship","Donor Offerings","ఆర్థిక మరియు వస్తు రూప సహాయం"],["Volunteer Management","Volunteers","బోధన మరియు ఇతర పాఠశాల సేవలు"],["Merit & Excellence Awards","Merit, Awards & Scholarships","మెరిట్ జాబితా, అవార్డులు, స్కాలర్‌షిప్‌లు"]]
 };
 const groupLinks=state.role==="hm"?hmGroupLinks[title]:null;
 const groupMarkup=groupLinks?'<div class="detail-list hm-group-links">'+groupLinks.map(([key,label,desc])=>'<button type="button" class="detail-row" data-hm-submodule="'+escapeHtml(key)+'"><span class="detail-icon">↗</span><div><strong>'+escapeHtml(label)+'</strong><small>'+escapeHtml(desc)+'</small></div><span>›</span></button>').join("")+'</div>':title==="GI Knowledge World"&&state.role==="hm"?'<div class="detail-list"><a class="detail-row" href="'+escapeHtml(APP_CONFIG.knowledgeBlogUrl)+'" target="_blank" rel="noopener"><span class="detail-icon">◎</span><div><strong>Open GI Knowledge World Blog</strong><small>One centrally managed GI Blog</small></div><span>↗</span></a></div>':"";
 const teacherManagement=title==="Teachers"&&state.role==="hm";
 const detailMarkup=teacherManagement?teacherManagementMarkup():`<div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>`;
 const previewNote=teacherManagement?"":'<div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div>';
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?renderCalendarMarkup({state,T}):""}
 ${alumniSponsorSection.communityModuleMarkup(title)}
 ${groupMarkup}
 ${detailMarkup}
 ${title==="Mid-Day Meal"?renderMidDayMealMarkup({T}):""}
 ${title==="Poster Studio"?renderPosterStudioMarkup({T,APP_CONFIG,escapeHtml}):""}
 ${previewNote}</section>`;
 document.querySelector("#moduleBack").onclick=()=>{state.view="dashboard";render()};
 main.querySelectorAll("[data-hm-submodule]").forEach(b=>b.onclick=()=>{state.module=b.dataset.hmSubmodule;state.view="module";render()});
 main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDate=Number(b.dataset.day);render()});
  const prev=main.querySelector("#calendarPrev"),next=main.querySelector("#calendarNext");
  if(prev)prev.onclick=()=>{state.selectedMonth--;if(state.selectedMonth<0){state.selectedMonth=11;state.selectedYear--}state.selectedDate=1;render()};
  if(next)next.onclick=()=>{state.selectedMonth++;if(state.selectedMonth>11){state.selectedMonth=0;state.selectedYear++}state.selectedDate=1;render()};
  
 setupPosterStudio();
 alumniSponsorSection.bindCommunityModuleActions();
 if(teacherManagement)bindTeacherManagement();
}
 return { modulePage };
}
