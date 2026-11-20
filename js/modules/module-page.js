import { renderCalendarMarkup } from "./calendar.js";
import { createTeacherRecord, createTeacherLogin, listTeacherRecords, updateTeacherRecord, setTeacherStatus } from "../sections/teacher/teacher-service.js";
import { renderMidDayMealMarkup } from "./mid-day-meal.js";
import { renderPosterStudioMarkup, setupPosterStudio } from "./poster-studio.js";

export function createModulePage({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection}) {
function toDisplayDob(value){
 const dob=String(value??"");
 if(/^\\d{8}$/.test(dob))return dob;
 if(/^\\d{4}-\\d{2}-\\d{2}$/.test(dob))return dob.slice(8,10)+dob.slice(5,7)+dob.slice(0,4);
 return "";
}
function bindDobInputs(root){
 root.querySelectorAll("[data-dob-input]").forEach(input=>{
  input.addEventListener("input",()=>{input.value=input.value.replace(/\\D/g,"").slice(0,8)});
 });
}
function managementLandingMarkup(){
 const cards=[
  {key:"Teacher Management",number:"01",icon:"♙",title:"Teacher Management",description:"Teacher profiles, class assignments and secure login access",tone:"teacher"},
  {key:"Class Management",number:"02",icon:"▦",title:"Class Management",description:"Manage the school’s five classes and student records",tone:"class"}
 ];
 return '<style>'+
 '.hm-management-entry{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}'+
 '.hm-management-entry *{box-sizing:border-box}'+
 '.hm-management-card{position:relative;display:flex;min-height:190px;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:16px;padding:21px;border:1px solid #dce9de;border-radius:20px;background:linear-gradient(145deg,#ffffff,#f1f8f1);color:#294d35;text-align:left;cursor:pointer;box-shadow:0 9px 24px rgba(38,80,48,.07);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}'+
 '.hm-management-card:hover{transform:translateY(-3px);border-color:#a9c9ae;box-shadow:0 14px 28px rgba(38,80,48,.12)}'+
 '.hm-management-card-top{display:flex;width:100%;align-items:center;justify-content:space-between;gap:12px}'+
 '.hm-management-icon{display:grid;width:52px;height:52px;place-items:center;border-radius:16px;background:#e1f0e3;color:#2d7047;font-size:26px;font-weight:800}'+
 '.hm-management-number{color:#89a68d;font-size:11px;font-weight:850;letter-spacing:.13em}'+
 '.hm-management-card h3{margin:0;color:#284d34;font-size:19px;font-weight:850}'+
 '.hm-management-card p{margin:7px 0 0;color:#718776;font-size:12px;line-height:1.55}'+
 '.hm-management-open{display:flex;width:100%;align-items:center;justify-content:space-between;color:#39764b;font-size:12px;font-weight:850}'+
 '@media(max-width:560px){.hm-management-entry{grid-template-columns:1fr}.hm-management-card{min-height:160px;padding:18px}}'+
 '</style><div class="hm-management-entry">'+cards.map(card=>'<button type="button" class="hm-management-card" data-hm-submodule="'+card.key+'"><span class="hm-management-card-top"><span class="hm-management-icon" aria-hidden="true">'+card.icon+'</span><span class="hm-management-number">MANAGEMENT · '+card.number+'</span></span><span><h3>'+card.title+'</h3><p>'+card.description+'</p></span><span class="hm-management-open"><span>Open dashboard</span><span aria-hidden="true">↗</span></span></button>').join("")+'</div>';
}
function classManagementMarkup(){
 const classes=["Class 1","Class 2","Class 3","Class 4","Class 5"];
 return '<style>'+
 '.class-admin{display:grid;gap:16px;margin-top:18px}'+
 '.class-admin-hero{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px;border:1px solid #d8e8db;border-radius:20px;background:linear-gradient(125deg,#eff8f0,#e5f1e6 62%,#faf8ee);color:#294d35}'+
 '.class-admin-kicker{font-size:10px;letter-spacing:.15em;font-weight:850;color:#66866d}.class-admin-hero h3{margin:5px 0;color:#294d35;font-size:22px}.class-admin-hero p{margin:0;color:#6c8572;font-size:12px;line-height:1.5}'+
 '.class-admin-mark{display:grid;width:48px;height:48px;flex:none;place-items:center;border-radius:15px;background:#d9eadb;color:#356f50;font-size:22px;font-weight:900}'+
 '.class-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}'+
 '.class-admin-tile{display:flex;align-items:center;gap:13px;padding:16px;border:1px solid #e0eae1;border-radius:16px;background:var(--surface);box-shadow:0 7px 20px rgba(45,83,54,.045)}'+
 '.class-admin-number{display:grid;width:44px;height:44px;flex:none;place-items:center;border-radius:13px;background:#e9f3e9;color:#39734b;font-size:13px;font-weight:900}'+
 '.class-admin-tile strong{display:block;color:var(--text);font-size:14px}.class-admin-tile small{display:block;margin-top:4px;color:var(--muted);font-size:11px;line-height:1.45}'+
 '@media(max-width:560px){.class-admin-grid{grid-template-columns:1fr}.class-admin-hero{padding:16px}.class-admin-tile{padding:13px}}'+
 '</style><div class="class-admin"><header class="class-admin-hero"><div><div class="class-admin-kicker">MPMPS SCHOOL · ACADEMIC STRUCTURE</div><h3>Class Management</h3><p>School class structure for Classes 1 to 5</p></div><div class="class-admin-mark" aria-hidden="true">CM</div></header><div class="class-admin-grid">'+classes.map((name,index)=>'<article class="class-admin-tile"><span class="class-admin-number">'+String(index+1).padStart(2,"0")+'</span><span><strong>'+name+'</strong><small>Class structure and student records</small></span></article>').join("")+'</div></div>';
}
function teacherManagementMarkup(){
 const classes=["Class 1","Class 2","Class 3","Class 4","Class 5"];
 const subjects=["Telugu","English","Mathematics","EVS"];
 const choiceGroup=(name,label,values,selected=[])=>'<fieldset class="teacher-choice-group"><legend>'+label+'</legend><div class="teacher-choice-grid">'+values.map(value=>'<label class="teacher-choice"><input type="checkbox" name="'+name+'" value="'+escapeHtml(value)+'" '+(selected.includes(value)?"checked":"")+'><span>'+escapeHtml(value)+'</span></label>').join("")+'</div></fieldset>';
 return '<style>'+
 '.teacher-admin{display:grid;gap:17px;margin-top:18px;color:var(--text)}'+
 '.teacher-admin *{box-sizing:border-box}'+
 '.teacher-admin-hero{padding:20px;border:1px solid #d8e8db;border-radius:20px;background:linear-gradient(125deg,#eff8f0,#e5f1e6 62%,#faf8ee);color:#294d35;display:flex;justify-content:space-between;align-items:center;gap:12px}'+
 '.teacher-admin-kicker{font-size:10px;letter-spacing:.15em;font-weight:850;color:#66866d}.teacher-admin-hero h3{margin:5px 0;font-size:22px;color:#294d35}.teacher-admin-hero p{margin:0;color:#6c8572;font-size:12px;line-height:1.5}'+
 '.teacher-admin-mark{width:48px;height:48px;flex:none;border-radius:15px;background:#d9eadb;color:#356f50;display:grid;place-items:center;font-size:23px;font-weight:900}'+
 '.teacher-admin-card{border:1px solid var(--border);border-radius:18px;padding:17px;background:var(--surface);box-shadow:0 7px 20px rgba(45,83,54,.045)}'+
 '.teacher-admin-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.teacher-admin-card-head h3{margin:0;font-size:17px;color:var(--text)}'+
 '.teacher-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}'+
 '.teacher-admin .field{display:grid;gap:6px;margin:0}.teacher-admin .field label,.teacher-choice-group legend{font-size:12px;font-weight:750;color:var(--text)}'+
 '.teacher-admin input:not([type=checkbox]),.teacher-admin select,.teacher-admin textarea{width:100%;min-height:44px;padding:10px 12px;border:1px solid var(--border);border-radius:11px;background:var(--surface2);color:var(--text);font:inherit}'+
 '.teacher-admin textarea{min-height:72px;resize:vertical}'+
 '.teacher-choice-group{border:0;padding:0;margin:14px 0 0;min-width:0}.teacher-choice-group legend{margin-bottom:8px}'+
 '.teacher-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'+
 '.teacher-choice{display:flex!important;align-items:center;gap:8px;padding:10px;border:1px solid var(--border);border-radius:11px;background:var(--surface2);font-size:12px!important;font-weight:650!important;cursor:pointer}'+
 '.teacher-choice input{width:16px;height:16px;min-height:0;accent-color:var(--green);flex:none}'+
 '.teacher-admin-help{font-size:12px;color:var(--muted);line-height:1.55;margin:8px 0 0}'+
 '.teacher-admin-action{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:15px}'+
 '.teacher-admin-action .btn,.teacher-admin-row .btn,.teacher-admin-result .btn{min-height:39px;border-radius:10px;padding:8px 13px;font-size:12px}'+
 '.teacher-admin-result{display:none;margin-top:14px;padding:15px;border:1px solid #b9d8bf;border-radius:14px;background:var(--surface2);overflow-wrap:anywhere}'+
 '.teacher-admin-result.is-visible{display:block}.teacher-admin-result h4{margin:0 0 5px;font-size:15px}.teacher-admin-credential{margin-top:10px;padding:11px;border-radius:11px;background:var(--surface);border:1px solid var(--border)}'+
 '.teacher-admin-credential small{display:block;color:var(--muted);font-size:11px;margin:5px 0}.teacher-admin-credential strong{display:block;font-size:17px;letter-spacing:.02em;overflow-wrap:anywhere}'+
 '.teacher-password-row{display:flex;gap:7px;align-items:center}.teacher-password-row input{flex:1;min-width:0}.teacher-password-row button{flex:none}'+
 '.teacher-admin-share{display:inline-flex;align-items:center;justify-content:center;margin-top:12px;min-height:40px;padding:9px 14px;border-radius:10px;background:#16834b;color:#fff;text-decoration:none;font-size:12px;font-weight:800}'+
 '.teacher-admin-list{display:grid;gap:11px}.teacher-admin-row{padding:14px;border:1px solid var(--border);border-radius:14px;background:var(--surface2)}'+
 '.teacher-admin-row-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.teacher-admin-row strong{color:var(--text)}'+
 '.teacher-admin-row small{display:block;color:var(--muted);font-size:12px;line-height:1.55;margin-top:5px}'+
 '.teacher-admin-id{font-size:12px;font-weight:850;color:var(--green);letter-spacing:.06em;white-space:nowrap}'+
 '.teacher-admin-status{display:inline-flex;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:800;background:#e7f3e9;color:#28613b;margin-top:8px}.teacher-admin-status.inactive{background:#f8e9e5;color:#984633}'+
 '.teacher-admin-row-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.teacher-admin-row details{margin-top:10px;border-top:1px solid var(--border);padding-top:9px}.teacher-admin-row summary{font-size:12px;font-weight:750;color:var(--green);cursor:pointer;padding:5px 0}'+
 '.teacher-admin-subform{padding:10px 0}.teacher-admin-subform .teacher-admin-action{margin-top:12px}'+
 '.teacher-admin-empty{padding:16px;border:1px dashed var(--border);border-radius:13px;color:var(--muted);font-size:13px;text-align:center}'+
 '@media(max-width:560px){.teacher-admin-grid{grid-template-columns:1fr}.teacher-admin-card{padding:13px}.teacher-admin-hero{padding:16px}.teacher-choice-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.teacher-admin-mark{width:42px;height:42px}}'+
 '</style>'+
 '<div class="teacher-admin">'+
  '<header class="teacher-admin-hero"><div><div class="teacher-admin-kicker">MPMPS SCHOOL · STAFF DIRECTORY</div><h3>Teacher Management</h3><p>Manage teacher profiles, class assignments and secure login access</p></div><div class="teacher-admin-mark" aria-hidden="true">TM</div></header>'+
  '<section class="teacher-admin-card"><div class="teacher-admin-card-head"><h3>కొత్త ఉపాధ్యాయుడిని చేర్చండి</h3><span class="teacher-admin-id">NEW PROFILE</span></div>'+
   '<form id="teacherCreateForm">'+
    '<div class="teacher-admin-grid">'+
     '<div class="field"><label for="teacherName">Teacher Name</label><input id="teacherName" name="name" maxlength="100" required autocomplete="name" placeholder="Enter full name"></div>'+
     '<div class="field"><label for="teacherDob">Date of Birth</label><input id="teacherDob" name="dob" type="text" inputmode="numeric" maxlength="8" pattern="[0-9]{8}" placeholder="DDMMYYYY" data-dob-input autocomplete="bday" required></div>'+
     '<div class="field"><label for="teacherGender">Gender</label><select id="teacherGender" name="gender" required><option value="">Select Gender</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select></div>'+
    '</div>'+
    choiceGroup("classes","Assigned Classes",classes)+
    choiceGroup("subjects","Teaching Subjects",subjects)+
    '<p class="teacher-admin-help">Select all classes and subjects assigned to this teacher. Teacher ID will be generated automatically.</p>'+
    '<div class="teacher-admin-action"><button class="btn" id="teacherCreateButton" type="submit">Create Teacher</button><span id="teacherCreateStatus" class="teacher-admin-help" role="status"></span></div>'+
   '</form>'+
   '<div id="teacherCreateResult" class="teacher-admin-result" aria-live="polite"></div>'+
  '</section>'+
  '<section class="teacher-admin-card"><div class="teacher-admin-card-head"><h3>ఉపాధ్యాయుల జాబితా</h3><span class="teacher-admin-id">TEACHER DIRECTORY</span></div><div id="teacherList" class="teacher-admin-list"><div class="teacher-admin-empty">ఉపాధ్యాయుల వివరాలను లోడ్ చేస్తోంది…</div></div></section>'+
 '</div>';
}
async function bindTeacherManagement(){
 const form=main.querySelector("#teacherCreateForm");
 const button=main.querySelector("#teacherCreateButton");
 const status=main.querySelector("#teacherCreateStatus");
 const resultBox=main.querySelector("#teacherCreateResult");
 const listBox=main.querySelector("#teacherList");
 const classes=["Class 1","Class 2","Class 3","Class 4","Class 5"];
 const subjects=["Telugu","English","Mathematics","EVS"];
 const esc=value=>escapeHtml(String(value??""));
 const checkedValues=(root,name)=>[...root.querySelectorAll('input[name="'+name+'"]:checked')].map(input=>input.value);
 const choiceGroup=(name,label,values,selected=[])=>'<fieldset class="teacher-choice-group"><legend>'+label+'</legend><div class="teacher-choice-grid">'+values.map(value=>'<label class="teacher-choice"><input type="checkbox" name="'+name+'" value="'+esc(value)+'" '+(selected.includes(value)?"checked":"")+'><span>'+esc(value)+'</span></label>').join("")+'</div></fieldset>';
 const showError=error=>{status.textContent=error?.message||"ఉపాధ్యాయుడిని నమోదు చేయలేకపోయాం. మళ్లీ ప్రయత్నించండి.";};
 const shareMessage=credentials=>"Welcome to Digital Mana Badi!\n\nYour Teacher Login Details:\n\nTeacher ID: "+credentials.teacherId+"\nLogin ID: "+credentials.loginId+"\nTemporary Password: "+credentials.password+"\n\nPlease log in and complete your first-time setup.\n\nSecurity Notice:\nDo not share your Login ID or Password with anyone. Keep your login credentials strictly confidential.\n\n– MPMPS School, Dagguluru";
 const renderCredentials=credentials=>{
  resultBox.innerHTML='<h4>Teacher login created successfully</h4><p class="teacher-admin-help">Share these temporary credentials privately. The password is shown now and cannot be retrieved later.</p><div class="teacher-admin-credential"><small>Teacher ID</small><strong>'+esc(credentials.teacherId)+'</strong><small>Login ID</small><strong>'+esc(credentials.loginId)+'</strong><small>Temporary Password</small><div class="teacher-password-row"><input id="teacherGeneratedPassword" type="password" readonly value="'+esc(credentials.password)+'" aria-label="Temporary password"><button type="button" class="btn secondary" id="teacherTogglePassword">Show</button></div></div><a class="teacher-admin-share" id="teacherShareWhatsApp" target="_blank" rel="noopener noreferrer">Share via WhatsApp ↗</a>';
  resultBox.classList.add("is-visible");
  main.querySelector("#teacherTogglePassword").onclick=()=>{
   const input=main.querySelector("#teacherGeneratedPassword"),toggle=main.querySelector("#teacherTogglePassword");
   const visible=input.type==="password";input.type=visible?"text":"password";toggle.textContent=visible?"Hide":"Show";
  };
  main.querySelector("#teacherShareWhatsApp").href="https://wa.me/?text="+encodeURIComponent(shareMessage(credentials));
 };
 const renderTeacherRow=teacher=>{
  const id=esc(teacher.teacherId),active=teacher.status==="active";
  const reasonLabel={school_transfer:"School Transfer",retired:"Retired",other:"Other Reason"}[teacher.deactivationReason]||"";
  const selectedClasses=teacher.assignedClasses||[],selectedSubjects=teacher.teachingSubjects||[];
  const editForm='<details><summary>Edit Teacher Profile</summary><form class="teacher-admin-subform" data-edit-teacher="'+id+'"><div class="teacher-admin-grid"><div class="field"><label>Teacher Name</label><input name="name" maxlength="100" required value="'+esc(teacher.name)+'"></div><div class="field"><label>Date of Birth</label><input name="dob" type="text" inputmode="numeric" maxlength="8" pattern="[0-9]{8}" placeholder="DDMMYYYY" data-dob-input required value="'+esc(toDisplayDob(teacher.dob))+'"></div><div class="field"><label>Gender</label><select name="gender" required><option value="Female" '+(teacher.gender==="Female"?"selected":"")+'>Female</option><option value="Male" '+(teacher.gender==="Male"?"selected":"")+'>Male</option><option value="Other" '+(teacher.gender==="Other"?"selected":"")+'>Other</option></select></div></div>'+choiceGroup("classes","Assigned Classes",classes,selectedClasses)+choiceGroup("subjects","Teaching Subjects",subjects,selectedSubjects)+'<div class="teacher-admin-action"><button class="btn" type="submit">Save Changes</button></div></form></details>';
  const loginAction=active&&!teacher.authUid?'<button type="button" class="btn" data-create-login="'+id+'">Create Login</button>':teacher.loginId?'<small>Login ID: '+esc(teacher.loginId)+'</small>':'';
  const statusAction=active?'<details><summary>Deactivate Teacher</summary><form class="teacher-admin-subform" data-deactivate-teacher="'+id+'"><div class="field"><label>Reason for Deactivation</label><select name="reason" required><option value="">Select Reason</option><option value="school_transfer">School Transfer</option><option value="retired">Retired</option><option value="other">Other Reason</option></select></div><div class="field" style="margin-top:10px"><label>Additional Note (optional)</label><textarea name="note" maxlength="240" placeholder="Add a short note"></textarea></div><div class="teacher-admin-action"><button class="btn secondary" type="submit">Confirm Deactivation</button></div></form></details>':'<button type="button" class="btn" data-reactivate-teacher="'+id+'">Reactivate</button>';
  return '<article class="teacher-admin-row"><div class="teacher-admin-row-top"><div><strong>'+esc(teacher.name)+'</strong><small>Classes: '+esc(selectedClasses.join(", "))+'</small><small>Subjects: '+esc(selectedSubjects.join(", "))+'</small><small>Teacher ID: '+id+'</small><span class="teacher-admin-status '+(active?"":"inactive")+'">'+(active?"ACTIVE":"DEACTIVATED")+'</span>'+(active?"":'<small>Reason: '+esc(reasonLabel)+'</small>'+(teacher.deactivationNote?'<small>Note: '+esc(teacher.deactivationNote)+'</small>':""))+'</div><span class="teacher-admin-id">'+id+'</span></div><div class="teacher-admin-row-actions">'+loginAction+statusAction+'</div>'+editForm+'</article>';
 };
 const refreshList=async()=>{
  listBox.innerHTML='<div class="teacher-admin-empty">ఉపాధ్యాయుల వివరాలను లోడ్ చేస్తోంది…</div>';
  try{
   const response=await listTeacherRecords(),teachers=response.teachers||[];
   listBox.innerHTML=teachers.length?teachers.map(renderTeacherRow).join(""):'<div class="teacher-admin-empty">ఇంకా ఉపాధ్యాయులు నమోదు కాలేదు.</div>';
   bindDobInputs(listBox);
   listBox.querySelectorAll("[data-create-login]").forEach(action=>action.onclick=async()=>{
    action.disabled=true;action.textContent="Creating Login…";
    try{const credentials=await createTeacherLogin(action.dataset.createLogin);renderCredentials(credentials);await refreshList();resultBox.scrollIntoView({behavior:"smooth",block:"nearest"});}
    catch(error){status.textContent=error?.message||"Login creation failed.";action.disabled=false;action.textContent="Create Login";}
   });
   listBox.querySelectorAll("[data-edit-teacher]").forEach(editForm=>editForm.onsubmit=async event=>{
    event.preventDefault();const submit=editForm.querySelector('button[type="submit"]');submit.disabled=true;submit.textContent="Saving…";
    const payload={name:editForm.querySelector('[name="name"]').value.trim(),dob:editForm.querySelector('[name="dob"]').value,gender:editForm.querySelector('[name="gender"]').value,assignedClasses:checkedValues(editForm,"classes"),teachingSubjects:checkedValues(editForm,"subjects")};
    try{await updateTeacherRecord(editForm.dataset.editTeacher,payload);status.textContent="Teacher profile updated.";await refreshList();}
    catch(error){status.textContent=error?.message||"Could not update teacher.";submit.disabled=false;submit.textContent="Save Changes";}
   });
   listBox.querySelectorAll("[data-deactivate-teacher]").forEach(deactivateForm=>deactivateForm.onsubmit=async event=>{
    event.preventDefault();const submit=deactivateForm.querySelector('button[type="submit"]');submit.disabled=true;submit.textContent="Deactivating…";
    try{await setTeacherStatus(deactivateForm.dataset.deactivateTeacher,"inactive",deactivateForm.querySelector('[name="reason"]').value,deactivateForm.querySelector('[name="note"]').value);status.textContent="Teacher deactivated. Historical records are retained.";await refreshList();}
    catch(error){status.textContent=error?.message||"Could not deactivate teacher.";submit.disabled=false;submit.textContent="Confirm Deactivation";}
   });
   listBox.querySelectorAll("[data-reactivate-teacher]").forEach(action=>action.onclick=async()=>{
    action.disabled=true;action.textContent="Reactivating…";
    try{await setTeacherStatus(action.dataset.reactivateTeacher,"active");status.textContent="Teacher reactivated.";await refreshList();}
    catch(error){status.textContent=error?.message||"Could not reactivate teacher.";action.disabled=false;action.textContent="Reactivate";}
   });
  }catch(error){listBox.innerHTML='<div class="teacher-admin-empty">'+esc(error?.message||"ఉపాధ్యాయుల జాబితాను లోడ్ చేయలేకపోయాం.")+'</div>';}
 };
 bindDobInputs(main);
 if(form)form.onsubmit=async event=>{
  event.preventDefault();status.textContent="";resultBox.classList.remove("is-visible");
  const payload={name:main.querySelector("#teacherName").value.trim(),dob:main.querySelector("#teacherDob").value,gender:main.querySelector("#teacherGender").value,assignedClasses:checkedValues(form,"classes"),teachingSubjects:checkedValues(form,"subjects")};
  if(!payload.assignedClasses.length||!payload.teachingSubjects.length){status.textContent="Classes మరియు Subjects ఎంచుకోండి.";return;}
  button.disabled=true;button.textContent="Creating…";
  try{
   const created=await createTeacherRecord(payload);
   resultBox.innerHTML='<h4>Teacher profile created</h4><p class="teacher-admin-help">Teacher ID: <strong>'+esc(created.teacherId)+'</strong>. Next, select <b>Create Login</b> from this teacher card to generate Login ID and Password.</p>';
   resultBox.classList.add("is-visible");form.reset();await refreshList();
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
  "Class & Teacher Management":[["Teacher Management","Teacher Management","ఉపాధ్యాయుల వివరాలు మరియు తరగతి కేటాయింపులు"],["Class Management","Class Management","తరగతులు మరియు విద్యార్థుల నిర్వహణ"]],
  "Diary":[["Daily Diary","Class-wise Diary","ప్రతి Subjectకు Class Work వివరాలు"],["Homework","Home Work","ప్రతి Subjectకు Home Work వివరాలు"]],
  "Great People & Quotes":[["Great People","Great People","గొప్ప వ్యక్తుల జీవిత విశేషాలు"],["Great Quotes","Great Quotes","ప్రేరణాత్మక సూక్తులు"]],
  "Events & Calendar":[["Today Special","Birthdays & Special Days","పుట్టినరోజులు మరియు ప్రత్యేక దినాలు"]],
  "Alumni & Donor Management":[["Alumni / Donor Management","Login Approval Requests","నమోదు మరియు లాగిన్ అభ్యర్థనలు"],["Contact Inbox","Donor Details & Offerings","దాతల వివరాలు మరియు వారి సహాయం"],["School Requirements","School Requirements","పాఠశాల అవసరాలు"],["Student Adoption","Student Adoptions","విద్యార్థుల విద్యా సహాయం"],["School Sponsorship","Donor Offerings","ఆర్థిక మరియు వస్తు రూప సహాయం"],["Volunteer Management","Volunteers","బోధన మరియు ఇతర పాఠశాల సేవలు"],["Merit & Excellence Awards","Merit, Awards & Scholarships","మెరిట్ జాబితా, అవార్డులు, స్కాలర్‌షిప్‌లు"]]
 };
 const groupLinks=state.role==="hm"?hmGroupLinks[title]:null;
 const groupMarkup=title==="Class & Teacher Management"&&state.role==="hm"?managementLandingMarkup():groupLinks?'<div class="detail-list hm-group-links">'+groupLinks.map(([key,label,desc])=>'<button type="button" class="detail-row" data-hm-submodule="'+escapeHtml(key)+'"><span class="detail-icon">↗</span><div><strong>'+escapeHtml(label)+'</strong><small>'+escapeHtml(desc)+'</small></div><span>›</span></button>').join("")+'</div>':title==="GI Knowledge World"&&state.role==="hm"?'<div class="detail-list"><a class="detail-row" href="'+escapeHtml(APP_CONFIG.knowledgeBlogUrl)+'" target="_blank" rel="noopener"><span class="detail-icon">◎</span><div><strong>Open GI Knowledge World Blog</strong><small>One centrally managed GI Blog</small></div><span>↗</span></a></div>':"";
 const teacherManagement=title==="Teacher Management"&&state.role==="hm";
 const classManagement=title==="Class Management"&&state.role==="hm";
 const detailMarkup=teacherManagement?teacherManagementMarkup():classManagement?classManagementMarkup():`<div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>`;
 const previewNote=teacherManagement||classManagement||title==="Class & Teacher Management"?"":'<div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div>';
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail"><h2>${escapeHtml(title)}</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>
 ${calendar?renderCalendarMarkup({state,T}):""}
 ${alumniSponsorSection.communityModuleMarkup(title)}
 ${groupMarkup}
 ${detailMarkup}
 ${title==="Mid-Day Meal"?renderMidDayMealMarkup({T}):""}
 ${title==="Poster Studio"?renderPosterStudioMarkup({T,APP_CONFIG,escapeHtml}):""}
 ${previewNote}</section>`;
 document.querySelector("#moduleBack").textContent=(teacherManagement||classManagement)?"← Class & Teacher Management":"← Dashboard";
 document.querySelector("#moduleBack").onclick=()=>{
  if((teacherManagement||classManagement)&&state.managementReturnTo){state.module=state.managementReturnTo;state.managementReturnTo=null;state.view="module";}
  else state.view="dashboard";
  render();
 };
 main.querySelectorAll("[data-hm-submodule]").forEach(b=>b.onclick=()=>{
  if(title==="Class & Teacher Management")state.managementReturnTo=title;
  state.module=b.dataset.hmSubmodule;state.view="module";render();
 });
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
