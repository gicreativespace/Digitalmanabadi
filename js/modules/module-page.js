import { renderCalendarMarkup } from "./calendar.js";
import { createTeacherRecord, createTeacherLogin, listTeacherRecords, updateTeacherRecord, setTeacherStatus } from "../sections/teacher/teacher-service.js";
import { listClassrooms, listClassStudents, createClassStudents, createStudentLogin, updateClassroomSettings, updateStudentSection } from "../sections/class-management/class-service.js";
import { renderMidDayMealMarkup } from "./mid-day-meal.js";
import { renderPosterStudioMarkup, setupPosterStudio } from "./poster-studio.js";

export function createModulePage({main,state,T,APP_CONFIG,escapeHtml,render,alumniSponsorSection}) {
function toDateInputValue(value){const dob=String(value??"");if(/^\d{8}$/.test(dob))return dob.slice(0,2)+"/"+dob.slice(2,4)+"/"+dob.slice(4,8);if(/^\d{4}-\d{2}-\d{2}$/.test(dob))return dob.slice(8,10)+"/"+dob.slice(5,7)+"/"+dob.slice(0,4);return "";}
function fromDateInputValue(value){const dob=String(value??"").trim();if(/^\d{2}\/\d{2}\/\d{4}$/.test(dob))return dob.replaceAll("/","");if(/^\d{8}$/.test(dob))return dob;if(/^\d{4}-\d{2}-\d{2}$/.test(dob))return dob.slice(8,10)+dob.slice(5,7)+dob.slice(0,4);return "";}
function bindDobInputs(root){if(!root)return;root.querySelectorAll(".teacher-dob-control").forEach(control=>{const t=control.querySelector("[data-dob-text]"),p=control.querySelector("[data-dob-picker]");if(!t||!p||control.dataset.bound==="true")return;control.dataset.bound="true";const sync=()=>{const v=t.value.trim();p.value=/^\d{2}\/\d{2}\/\d{4}$/.test(v)?v.slice(6,10)+"-"+v.slice(3,5)+"-"+v.slice(0,2):"";};t.addEventListener("input",sync);p.addEventListener("change",()=>{if(p.value)t.value=p.value.slice(8,10)+"/"+p.value.slice(5,7)+"/"+p.value.slice(0,4);t.setCustomValidity("");});t.addEventListener("blur",()=>{const v=t.value.trim(),m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);let ok=false;if(m){const d=+m[1],mo=+m[2],y=+m[3],dt=new Date(y,mo-1,d);ok=y>=1900&&dt.getFullYear()===y&&dt.getMonth()===mo-1&&dt.getDate()===d&&dt<=new Date();}t.setCustomValidity(v&&!ok?"Enter a valid DOB as DD/MM/YYYY.":"");});sync();});}
function managementLandingMarkup(){
 const cards=[
  {key:"Teacher Management",icon:"♙",title:"Teacher Management",titleTe:"ఉపాధ్యాయుల నిర్వహణ"},
  {key:"Class Management",icon:"▦",title:"Class Management",titleTe:"తరగతుల నిర్వహణ"}
 ];
 return '<div class="backline"><button type="button" class="btn secondary" id="managementSelectionBack">← '+T("హెడ్ మాస్టర్ డాష్‌బోర్డ్","Head Master Dashboard")+'</button></div><style>'+
 '.hm-management-entry{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;width:100%;max-width:900px;margin:0 auto}'+
 '.hm-management-entry *{box-sizing:border-box}'+
 '.hm-management-card{display:flex;min-height:190px;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:26px 20px;border:1px solid #dce9de;border-radius:22px;background:linear-gradient(145deg,#ffffff,#f1f8f1);color:#294d35;text-align:center;cursor:pointer;box-shadow:0 10px 28px rgba(38,80,48,.08);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}'+
 '.hm-management-card:hover{transform:translateY(-3px);border-color:#a9c9ae;box-shadow:0 15px 32px rgba(38,80,48,.13)}'+
 '.hm-management-icon{display:grid;width:64px;height:64px;place-items:center;border-radius:19px;background:#e1f0e3;color:#2d7047;font-size:31px;font-weight:800}'+
 '.hm-management-card h3{margin:0;color:#284d34;font-size:19px;font-weight:850}'+
 '@media(max-width:560px){.hm-management-entry{grid-template-columns:1fr;gap:13px}.hm-management-card{min-height:145px;padding:20px}}'+
 '</style><div class="hm-management-entry">'+cards.map(card=>'<button type="button" class="hm-management-card" data-hm-submodule="'+card.key+'"><span class="hm-management-icon" aria-hidden="true">'+card.icon+'</span><h3>'+T(card.titleTe,card.title)+'</h3></button>').join("")+'</div>';
}
function classManagementMarkup(){
 const classes=["Class 1","Class 2","Class 3","Class 4","Class 5"];
 return '<style>'+
 '.class-admin{display:grid;gap:16px;margin-top:18px;color:var(--text)}'+
 '.class-admin *{box-sizing:border-box}'+
 '.class-admin-hero{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px;border:1px solid #d8e8db;border-radius:20px;background:linear-gradient(125deg,#eff8f0,#e5f1e6 62%,#faf8ee);color:#294d35}'+
 '.class-admin-kicker{font-size:11px;letter-spacing:.12em;font-weight:850;color:#66866d}.class-admin-hero h3{margin:5px 0;color:#294d35;font-size:22px}.class-admin-hero p{margin:0;color:#6c8572;font-size:14px;line-height:1.6}'+
 '.class-admin-mark{display:grid;width:48px;height:48px;flex:none;place-items:center;border-radius:15px;background:#d9eadb;color:#356f50;font-size:22px;font-weight:900}'+
 '.class-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.class-settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.class-settings-grid .field{min-width:0}'+
 '.class-admin-tile{display:flex;align-items:center;gap:13px;padding:16px;border:1px solid #e0eae1;border-radius:16px;background:var(--surface);box-shadow:0 7px 20px rgba(45,83,54,.045);cursor:pointer;text-align:left;width:100%;color:var(--text);min-width:0}'+
 '.class-admin-tile[aria-expanded="true"]{border-color:#8eb99a;background:#f3faf4}.class-admin-number{display:grid;width:44px;height:44px;flex:none;place-items:center;border-radius:13px;background:#e9f3e9;color:#39734b;font-size:13px;font-weight:900}'+
 '.class-admin-tile strong{display:block;color:var(--text);font-size:16px}.class-admin-tile small{display:block;margin-top:4px;color:var(--muted);font-size:13px;line-height:1.45}'+
 '.class-admin-panel{display:grid;gap:14px;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--surface);min-width:0}.class-admin-panel[hidden]{display:none}.class-admin-panel-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.class-admin-panel-head h4{margin:0;font-size:18px}.class-admin-status{font-size:13px;color:var(--muted)}'+
 '.class-strength-setup{display:grid;gap:9px;padding:15px;border:1px solid #dce9df;border-radius:14px;background:var(--surface2)}.class-strength-setup label{font-size:13px;font-weight:800;color:var(--text)}.class-strength-controls{display:flex;gap:9px;align-items:center;flex-wrap:wrap}.class-strength-controls input{width:140px;max-width:100%;min-height:44px;padding:9px 11px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font:inherit}.class-strength-setup small{font-size:11px;color:var(--muted);line-height:1.5}'+
 '.class-sheet-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.class-sheet-toolbar p{margin:0;color:var(--muted);font-size:12px;line-height:1.5}.class-sheet-actions{display:flex;gap:8px;flex-wrap:wrap}.class-sheet-actions .btn{min-height:40px}'+
 '.class-sheet-wrap{width:100%;min-width:0;overflow:visible;border:1px solid var(--border);border-radius:13px}.class-student-sheet{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed}.class-student-sheet th{padding:11px 9px;background:#edf5ee;color:#365d40;text-align:left;font-size:12px;font-weight:800;border-bottom:1px solid #dce9df}.class-student-sheet td{padding:8px;border-bottom:1px solid var(--border);vertical-align:middle}.class-student-sheet tr:last-child td{border-bottom:0}.class-student-sheet th:first-child,.class-student-sheet td:first-child{width:74px;text-align:center}.class-student-sheet th:last-child,.class-student-sheet td:last-child{width:76px;text-align:center}.class-student-sheet input,.class-student-sheet select{width:100%;min-width:0;min-height:42px;padding:8px 9px;border:1px solid var(--border);border-radius:9px;background:var(--surface2);color:var(--text);font:inherit;font-size:14px}.class-sheet-roll{display:inline-grid;place-items:center;min-width:36px;min-height:34px;border-radius:9px;background:#edf5ee;color:#356b45;font-weight:850;font-size:13px}.class-sheet-remove{width:34px;height:34px;border:1px solid #ead8d3;border-radius:9px;background:#fff7f5;color:#9a4b3b;font-size:18px;cursor:pointer}.class-sheet-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.class-sheet-footer small{color:var(--muted);font-size:12px}.class-admin-error{padding:10px 12px;border-radius:10px;background:#fff3ed;color:#984b36;font-size:13px}.class-admin-empty{padding:18px;border:1px dashed var(--border);border-radius:12px;text-align:center;color:var(--muted);font-size:13px}.class-student-list{display:grid;gap:10px}.class-student-card{padding:14px;border:1px solid #dce9df;border-radius:15px;background:var(--surface)}.class-student-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.class-student-head strong{font-size:16px;color:var(--text)}.class-student-head small{display:block;color:var(--muted);font-size:12px;margin-top:4px}.class-student-info{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}.class-student-info div{padding:9px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);min-width:0}.class-student-info span{display:block;color:var(--muted);font-size:11px}.class-student-info b{display:block;margin-top:3px;color:var(--text);font-size:13px;overflow-wrap:anywhere}.class-student-info select{width:100%;min-height:38px;padding:6px 8px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font:inherit;font-size:13px}.class-secret{background:#fff8e9!important;border-color:#eadbb7!important}.class-secret b{letter-spacing:.06em}'+
 '@media(max-width:640px){.class-admin-grid,.class-settings-grid{grid-template-columns:1fr}.class-admin-hero{padding:15px}.class-admin-panel{padding:11px}.class-admin-panel-head{align-items:flex-start}.class-sheet-toolbar{align-items:stretch}.class-sheet-actions{width:100%}.class-sheet-actions .btn{flex:1}.class-student-sheet,.class-student-sheet tbody{display:block;width:100%}.class-student-sheet thead{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.class-student-sheet tr{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:11px;border-bottom:1px solid var(--border)}.class-student-sheet tr:last-child{border-bottom:0}.class-student-sheet td,.class-student-sheet td:first-child,.class-student-sheet td:last-child{display:grid;grid-template-columns:78px minmax(0,1fr);align-items:center;gap:7px;width:auto;padding:0;text-align:left;border:0;min-width:0}.class-student-sheet td:before{content:attr(data-label);font-size:11px;font-weight:750;color:var(--muted)}.class-student-sheet td:first-child{grid-column:1/-1;grid-template-columns:78px minmax(0,1fr)}.class-student-sheet td:last-child{grid-column:1/-1;grid-template-columns:78px minmax(0,1fr)}.class-sheet-roll{justify-self:start}.class-sheet-remove{justify-self:start}.class-student-sheet input,.class-student-sheet select{font-size:16px;min-height:44px}.class-student-info{grid-template-columns:1fr 1fr}.class-student-head{flex-direction:column}.class-sheet-footer{align-items:stretch}.class-sheet-footer .btn{width:100%}}'+
 '</style><div class="class-admin"><header class="class-admin-hero"><div><div class="class-admin-kicker">MPMPS SCHOOL · ACADEMIC STRUCTURE</div><h3>'+T("తరగతుల నిర్వహణ","Class Management")+'</h3><p>'+T("తరగతిని ఎంచుకుని విద్యార్థుల వివరాలను ఒకే Sheet‌లో నమోదు చేయండి.","Choose a class and enter all student details in one sheet.")+'</p></div><div class="class-sheet-actions"><button type="button" class="btn secondary" id="copyStudentPortalLink">'+T("Student Portal Link Copy","Copy Student Portal Link")+'</button><div class="class-admin-mark" aria-hidden="true">CM</div></div></header>'+
 '<div class="class-admin-grid">'+classes.map((name,index)=>'<button type="button" class="class-admin-tile" data-class-open="class-'+(index+1)+'" aria-expanded="false"><span class="class-admin-number">'+String(index+1).padStart(2,"0")+'</span><span><strong>'+T(name.replace("Class ","")+"వ తరగతి",name)+'</strong><small>'+T("తరగతి Sheet తెరవండి · విద్యార్థుల రికార్డులు","Open class sheet · Student records")+'</small></span></button>').join("")+'</div>'+
 '<section class="class-admin-panel" id="classStudentPanel" hidden><div class="class-admin-panel-head"><h4 id="classStudentTitle"></h4><span id="classStudentStatus" class="class-admin-status" role="status" aria-live="polite"></span></div>'+
 '<div class="class-strength-setup" id="classSettingsPanel"><strong>'+T("తరగతి సెట్టింగ్స్","Class Settings")+'</strong><div class="class-settings-grid"><div class="field"><label for="classSectionsInput">'+T("విభాగాలు (ఐచ్ఛికం)","Sections (optional)")+'</label><input id="classSectionsInput" type="text" maxlength="60" placeholder="A, B, C"></div><div class="field"><label for="classTeacherSelect">'+T("తరగతి ఉపాధ్యాయుడు","Class Teacher")+'</label><select id="classTeacherSelect"><option value="">'+T("కేటాయించలేదు","Not assigned")+'</option></select></div></div><div class="class-sheet-actions"><button type="button" class="btn secondary" id="saveClassSettings">'+T("సెట్టింగ్స్ సేవ్ చేయండి","Save Class Settings")+'</button><span id="classSettingsStatus" class="class-admin-status" role="status"></span></div><small>'+T("Sections ఉంటే విద్యార్థులను వాటికి కేటాయించండి. Roll Number మాత్రం మొత్తం తరగతికి ఒకే క్రమంలో కొనసాగుతుంది.","Assign students to configured sections. Roll numbers continue in one shared sequence across the whole class.")+'</small></div>'+
 '<div class="class-strength-setup" id="classSectionFilterWrap"><label for="classSectionFilter">'+T("విభాగం వారీగా చూడండి","View by Section")+'</label><select id="classSectionFilter"><option value="">'+T("అన్ని Sections","All Sections")+'</option></select></div>'+
 '<div id="classStrengthSetup" class="class-strength-setup"><label for="classStrengthInput">'+T("ఈ తరగతి మొత్తం విద్యార్థుల సంఖ్య (Strength)","Total number of students in this class (Strength)")+'</label><div class="class-strength-controls"><input id="classStrengthInput" type="number" min="1" max="99" inputmode="numeric" placeholder="'+T("ఉదా: 35","e.g. 35")+'"><button type="button" class="btn" id="createClassSheet">'+T("Create Class Sheet","Create Class Sheet")+'</button></div><small>'+T("Strength 1 నుంచి 99 మధ్య నమోదు చేయండి. ఇప్పటికే ఉన్న విద్యార్థుల రికార్డులు అలాగే ఉంటాయి.","Enter a strength between 1 and 99. Existing student records will be preserved.")+'</small></div>'+
 '<div id="classSheetWorkspace" hidden>'+
 '<div class="class-sheet-toolbar"><p>'+T("ప్రతి Row ఒక విద్యార్థి. Save చేసినప్పుడు Roll Number, Student ID మరియు Secret Code ఆటోమేటిక్‌గా రూపొందుతాయి.","Each row is one student. Roll Number, Student ID and Secret Code are generated automatically when saved.")+'</p><div class="class-sheet-actions"><button type="button" class="btn secondary" id="addStudentRows">+ '+T("5 Rows జోడించండి","Add 5 Rows")+'</button><button type="button" class="btn" id="saveAllStudents">'+T("అన్ని వివరాలు సేవ్ చేయండి","Save All Students")+'</button></div></div>'+
 '<div class="class-sheet-wrap"><table class="class-student-sheet"><thead><tr><th>'+T("Roll No.","Roll No.")+'</th><th>'+T("విభాగం","Section")+'</th><th>'+T("విద్యార్థి పేరు","Student Name")+'</th><th>'+T("లింగం","Gender")+'</th><th>'+T("పుట్టిన తేదీ","Date of Birth")+'</th><th>'+T("తొలగించు","Remove")+'</th></tr></thead><tbody id="studentEntryRows"></tbody></table></div>'+
 '<div class="class-sheet-footer"><small>'+T("పేరు, లింగం, పుట్టిన తేదీ తప్పనిసరి. ఖాళీ Rows సేవ్ కావు.","Name, gender and date of birth are required. Empty rows are ignored.")+'</small><button type="button" class="btn secondary" id="addOneStudentRow">+ '+T("ఒక Row","Add One Row")+'</button></div></div>'+
 '<div id="classStudentList" class="class-student-list"><div class="class-admin-empty">'+T("విద్యార్థుల రికార్డులు లోడ్ అవుతాయి.","Student records will appear here.")+'</div></div></section></div>';
}
async function bindClassManagement(){
 const panel=main.querySelector("#classStudentPanel"),title=main.querySelector("#classStudentTitle"),status=main.querySelector("#classStudentStatus"),list=main.querySelector("#classStudentList"),rowsBox=main.querySelector("#studentEntryRows");
 if(!panel||!rowsBox)return;
 let activeClassId="",rowSequence=0,targetStrength=0,existingCount=0,activeSections=[],currentStudents=[],classroomConfig={},teacherRecords=[];
 const esc=v=>escapeHtml(String(v??""));
 const formatDob=v=>/^\d{8}$/.test(String(v||""))?String(v).slice(0,2)+"/"+String(v).slice(2,4)+"/"+String(v).slice(4):String(v||"—");
 const genderLabel=v=>({Male:T("పురుషుడు","Male"),Female:T("స్త్రీ","Female"),Other:T("ఇతర","Other")}[v]||v||"—");
 const say=(v,bad=false)=>{status.textContent=v;status.className=bad?"class-admin-error":"class-admin-status";};
 const addRow=(values={})=>{
  const key=String(++rowSequence);
  const sectionCell=activeSections.length
   ?'<td data-label="'+T("విభాగం","Section")+'"><select data-student-section required><option value="">'+T("ఎంచుకోండి","Select")+'</option>'+activeSections.map(section=>'<option value="'+esc(section)+'" '+(values.section===section?"selected":"")+'>'+esc(section)+'</option>').join("")+'</select></td>'
   :'<td data-label="Section">—<input type="hidden" data-student-section value=""></td>';
  const row='<tr data-entry-row="'+key+'"><td data-label="'+T("Roll No.","Roll No.")+'"><span class="class-sheet-roll">Auto</span></td>'+sectionCell+
   '<td data-label="'+T("పేరు","Name")+'"><input data-student-name maxlength="100" autocomplete="off" placeholder="'+T("విద్యార్థి పూర్తి పేరు","Student full name")+'" value="'+esc(values.name||"")+'"></td>'+
   '<td data-label="'+T("లింగం","Gender")+'"><select data-student-gender><option value="">'+T("ఎంచుకోండి","Select")+'</option><option value="Male" '+(values.gender==="Male"?"selected":"")+'>'+T("పురుషుడు","Male")+'</option><option value="Female" '+(values.gender==="Female"?"selected":"")+'>'+T("స్త్రీ","Female")+'</option><option value="Other" '+(values.gender==="Other"?"selected":"")+'>'+T("ఇతర","Other")+'</option></select></td>'+
   '<td data-label="'+T("పుట్టిన తేదీ","Date of Birth")+'"><input data-student-dob inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY" value="'+esc(values.dob||"")+'"></td>'+
   '<td data-label="'+T("తొలగించు","Remove")+'"><button type="button" class="class-sheet-remove" data-remove-row aria-label="'+T("ఈ Row తొలగించు","Remove this row")+'">×</button></td></tr>';
  rowsBox.insertAdjacentHTML("beforeend",row);
 };
 const emptyRows=(count=0)=>{rowsBox.innerHTML="";for(let i=0;i<count;i++)addRow();};
 const renderStudents=students=>{
  const sectionFilter=main.querySelector("#classSectionFilter")?.value||"";
  const visible=sectionFilter==="__unassigned__"?students.filter(st=>!st.section):sectionFilter?students.filter(st=>(st.section||"")===sectionFilter):students;
  if(!visible.length){list.innerHTML='<div class="class-admin-empty">'+T("ఈ విభాగంలో విద్యార్థులు లేరు.","No students are enrolled in this section.")+'</div>';return;}
  list.innerHTML='<h4>'+T("ఇప్పటికే నమోదైన విద్యార్థులు","Registered Students")+'</h4>'+visible.map(st=>'<article class="class-student-card"><div class="class-student-head"><div><strong>'+esc(st.name)+'</strong><small>'+T("Student ID: ","Student ID: ")+esc(st.studentId)+' · '+T("Roll No.","Roll No.")+' '+esc(st.rollNumber)+' · '+T("Section","Section")+' '+esc(st.section||"—")+'</small></div><span class="class-admin-status">'+(st.authUid?T("Login Created","Login Created"):T("Login Pending","Login Pending"))+'</span></div><div class="class-student-info"><div><span>'+T("లింగం","Gender")+'</span><b>'+esc(genderLabel(st.gender))+'</b></div><div><span>'+T("పుట్టిన తేదీ","Date of Birth")+'</span><b>'+esc(formatDob(st.dob))+'</b></div><div><span>'+T("Student Login ID","Student Login ID")+'</span><b>'+esc(st.loginId||"—")+'</b></div><div class="class-secret"><span>'+T("Permanent Secret Code · Head Master Only","Permanent Secret Code · Head Master Only")+'</span><b>'+esc(st.secretCode||"—")+'</b></div>'+(activeSections.length?'<div><span>'+T("Section కేటాయింపు","Section assignment")+'</span><select data-student-section-update data-student-record-id="'+esc(st.studentRecordId)+'"><option value="">'+T("కేటాయించలేదు","Unassigned")+'</option>'+activeSections.map(section=>'<option value="'+esc(section)+'" '+((st.section||"")===section?"selected":"")+'>'+esc(section)+'</option>').join("")+'</select></div>':'')+'</div><div class="class-sheet-actions" style="margin-top:12px"><button type="button" class="btn '+(st.authUid?'secondary':'')+'" data-create-student-login data-student-record-id="'+esc(st.studentRecordId)+'" '+(st.authUid?'disabled':'')+'>'+(st.authUid?T("Login Created","Login Created"):T("Create Student Login","Create Student Login"))+'</button></div></article>').join("");
 };
 list.addEventListener("change",async event=>{
  const select=event.target.closest("[data-student-section-update]");
  if(!select)return;
  const previous=currentStudents.find(item=>item.studentRecordId===select.dataset.studentRecordId)?.section||"";
  select.disabled=true;
  try{
   await updateStudentSection(select.dataset.studentRecordId,select.value);
   const refreshed=await listClassStudents(activeClassId);currentStudents=refreshed.students||[];existingCount=currentStudents.length;renderStudents(currentStudents);
   say(T("విద్యార్థి Section నవీకరించబడింది.","Student section updated."));
  }catch(error){
   select.value=previous;
   say(error?.message||T("Section మార్చలేకపోయాం.","Could not update section."),true);
   select.disabled=false;
  }
 });
 list.addEventListener("click",async event=>{
  const button=event.target.closest("[data-create-student-login]");
  if(!button||button.disabled)return;
  const recordId=button.dataset.studentRecordId;
  button.disabled=true;button.textContent=T("Login సృష్టిస్తోంది…","Creating Login…");
  try{
   const result=await createStudentLogin(recordId);
   const refreshed=await listClassStudents(activeClassId);
   renderStudents(refreshed.students||[]);
   say(T("Student Login విజయవంతంగా సృష్టించబడింది: ","Student Login created successfully: ")+result.loginId);
   toast(T("Student Login ID: ","Student Login ID: ")+result.loginId);
  }catch(error){
   button.disabled=false;button.textContent=T("మళ్లీ ప్రయత్నించండి","Retry Login Creation");
   say(error?.message||T("Student Login సృష్టించలేకపోయాం.","Could not create the Student Login."),true);
  }
 });

 const strengthSetup=main.querySelector("#classStrengthSetup"),workspace=main.querySelector("#classSheetWorkspace"),strengthInput=main.querySelector("#classStrengthInput");
 const settingsStatus=main.querySelector("#classSettingsStatus"),sectionsInput=main.querySelector("#classSectionsInput"),classTeacherSelect=main.querySelector("#classTeacherSelect"),sectionFilter=main.querySelector("#classSectionFilter");
 main.querySelector("#copyStudentPortalLink").onclick=async()=>{
  const portalUrl=new URL("?portal=student",window.location.href).href;
  try{
   if(!navigator.clipboard?.writeText)throw new Error("Clipboard is unavailable.");
   await navigator.clipboard.writeText(portalUrl);
   say(T("Student Portal Link కాపీ అయింది. విద్యార్థులకు పంపండి.","Student Portal link copied. Share it with students."));
  }catch{say(portalUrl);}
 };
 const loadClass=async classId=>{
  activeClassId=classId;targetStrength=0;existingCount=0;panel.hidden=false;workspace.hidden=true;strengthSetup.hidden=false;strengthInput.value="";title.textContent=T(classId.slice(-1)+"వ తరగతి","Class "+classId.slice(-1));say(T("విద్యార్థుల వివరాలు లోడ్ అవుతున్నాయి…","Loading student records…"));list.innerHTML='<div class="class-admin-empty">'+T("లోడ్ అవుతోంది…","Loading…")+'</div>';rowsBox.innerHTML="";
  main.querySelectorAll("[data-class-open]").forEach(btn=>btn.setAttribute("aria-expanded",String(btn.dataset.classOpen===classId)));
  try{
   const [classroomsResult,studentResult]=await Promise.all([listClassrooms(),listClassStudents(classId)]);
   classroomConfig=(classroomsResult.classrooms||[]).find(item=>item.classId===classId)||{};
   activeSections=Array.isArray(classroomConfig.sections)?classroomConfig.sections:[];
   currentStudents=studentResult.students||[];existingCount=currentStudents.length;
   sectionsInput.value=activeSections.join(", ");
   if(!teacherRecords.length){try{const teachers=await listTeacherRecords();teacherRecords=teachers.teachers||[];}catch{}}
   classTeacherSelect.innerHTML='<option value="">'+T("కేటాయించలేదు","Not assigned")+'</option>'+teacherRecords.filter(t=>t.status==="active").map(t=>'<option value="'+esc(t.teacherId)+'" '+(t.teacherId===classroomConfig.classTeacherId?"selected":"")+'>'+esc(t.name)+' · '+esc(t.teacherId)+'</option>').join("");
   if(classroomConfig.classTeacherId&&!teacherRecords.some(t=>t.teacherId===classroomConfig.classTeacherId))classTeacherSelect.insertAdjacentHTML("beforeend",'<option selected value="'+esc(classroomConfig.classTeacherId)+'">'+esc(classroomConfig.classTeacherName||classroomConfig.classTeacherId)+' · '+T("పాత కేటాయింపు","Existing assignment")+'</option>');
   sectionFilter.innerHTML='<option value="">'+T("అన్ని Sections","All Sections")+'</option>'+activeSections.map(section=>'<option value="'+esc(section)+'">'+esc(section)+'</option>').join("")+(currentStudents.some(st=>!st.section)?'<option value="__unassigned__">'+T("Section కేటాయించని వారు","Unassigned")+'</option>':'');
   renderStudents(currentStudents);say(T("ఇప్పటికే నమోదైన విద్యార్థులు: ","Existing students: ")+existingCount);
  }catch(error){list.innerHTML='<div class="class-admin-error">'+esc(error.message||T("వివరాలు లోడ్ కాలేదు.","Could not load records."))+'</div>';say(T("డేటా లోడ్ కాలేదు.","Could not load data."),true);}
  panel.scrollIntoView({behavior:"smooth",block:"start"});
 };
 main.querySelectorAll("[data-class-open]").forEach(btn=>btn.onclick=()=>loadClass(btn.dataset.classOpen));
 main.querySelector("#createClassSheet").onclick=()=>{
  const strength=Number(strengthInput.value);
  if(!Number.isInteger(strength)||strength<1||strength>99){say(T("దయచేసి 1 నుంచి 99 మధ్య సరైన Strength నమోదు చేయండి.","Enter a valid class strength between 1 and 99."),true);strengthInput.focus();return;}
  if(strength<existingCount){say(T("ఈ తరగతిలో ఇప్పటికే ","This class already has ")+existingCount+T(" మంది విద్యార్థులు ఉన్నారు. Strength అంతకంటే తక్కువగా ఉండకూడదు."," students. Strength cannot be lower than the existing count."),true);return;}
  targetStrength=strength;workspace.hidden=false;strengthSetup.hidden=true;emptyRows(Math.max(0,targetStrength-existingCount));say(T("Class Strength: ","Class Strength: ")+targetStrength+" · "+T("ఇప్పటికే నమోదు: ","Already registered: ")+existingCount+" · "+T("కొత్త Rows: ","New rows: ")+(targetStrength-existingCount));
 };
 sectionFilter.onchange=()=>renderStudents(currentStudents);
 main.querySelector("#saveClassSettings").onclick=async()=>{
  const button=main.querySelector("#saveClassSettings");button.disabled=true;
  if(settingsStatus)settingsStatus.textContent=T("సేవ్ చేస్తోంది…","Saving…");
  try{
   await updateClassroomSettings(activeClassId,{sections:sectionsInput.value,classTeacherId:classTeacherSelect.value});
   if(settingsStatus)settingsStatus.textContent=T("సెట్టింగ్స్ సేవ్ అయ్యాయి.","Settings saved.");
   await loadClass(activeClassId);
  }catch(error){if(settingsStatus)settingsStatus.textContent=error?.message||T("సెట్టింగ్స్ సేవ్ కాలేదు.","Could not save settings.");}
  finally{button.disabled=false;}
 };
 const addRowsWithinStrength=count=>{const remaining=Math.max(0,targetStrength-existingCount-rowsBox.querySelectorAll("[data-entry-row]").length);for(let i=0;i<Math.min(count,remaining);i++)addRow();if(remaining===0)say(T("నమోదు చేసిన Class Strength‌కు సరిపడా Rows ఇప్పటికే ఉన్నాయి.","All rows for the selected class strength are already present."),true);};
 main.querySelector("#addStudentRows").onclick=()=>addRowsWithinStrength(5);
 main.querySelector("#addOneStudentRow").onclick=()=>addRowsWithinStrength(1);
 rowsBox.addEventListener("click",event=>{const remove=event.target.closest("[data-remove-row]");if(remove){remove.closest("tr").remove();}});
 main.querySelector("#saveAllStudents").onclick=async()=>{
  if(!activeClassId)return;
  const entries=[...rowsBox.querySelectorAll("[data-entry-row]")].map(row=>({key:row.dataset.entryRow,name:row.querySelector("[data-student-name]").value.trim(),gender:row.querySelector("[data-student-gender]").value,dob:row.querySelector("[data-student-dob]").value.trim(),section:row.querySelector("[data-student-section]")?.value||""}));
  const filled=entries.filter(row=>row.name||row.gender||row.dob);
  if(!filled.length){say(T("ముందుగా కనీసం ఒక విద్యార్థి వివరాలు నమోదు చేయండి.","Enter at least one student before saving."),true);return;}
  const invalid=filled.filter(row=>row.name.length<2||!["Male","Female","Other"].includes(row.gender)||!/^\d{2}\/\d{2}\/\d{4}$/.test(row.dob)||(activeSections.length&&!activeSections.includes(row.section)));
  if(invalid.length){say(T("పేరు, లింగం మరియు DD/MM/YYYY పుట్టిన తేదీ అన్ని Rows‌లో సరిచూడండి.","Check name, gender and DD/MM/YYYY date of birth in every filled row."),true);return;}
  if(filled.length>Math.max(0,targetStrength-existingCount)){say(T("నమోదు చేయబోయే విద్యార్థుల సంఖ్య Class Strength‌లో మిగిలిన స్థానాలకంటే ఎక్కువగా ఉంది.","The number of students exceeds the remaining class strength."),true);return;}
  const button=main.querySelector("#saveAllStudents"),addButtons=[main.querySelector("#addStudentRows"),main.querySelector("#addOneStudentRow")];
  button.disabled=true;addButtons.forEach(b=>b.disabled=true);button.textContent=T("విద్యార్థులను సేవ్ చేస్తోంది…","Saving students…");
  const response=await createClassStudents(activeClassId,filled.map(row=>({name:row.name,gender:row.gender,dob:row.dob})));
  const created=response.created||[];
  const failed=(response.failed||[]).map(item=>({row:filled[item.index],error:{message:item.message}}));
  try{
   const result=await listClassStudents(activeClassId);currentStudents=result.students||[];existingCount=currentStudents.length;renderStudents(currentStudents);
  }catch(error){say(T("కొన్ని రికార్డులు సేవ్ అయ్యాయి, కానీ జాబితాను రీలోడ్ చేయలేకపోయాం.","Some records were saved, but the list could not be reloaded."),true);}
  rowsBox.innerHTML="";
  if(failed.length){failed.forEach(item=>addRow(item.row));say(T("విజయవంతంగా సేవ్: ","Saved successfully: ")+created.length+" · "+T("మళ్లీ ప్రయత్నించాల్సినవి: ","Need retry: ")+failed.length,true);}
  else{emptyRows(Math.max(0,targetStrength-existingCount));say(T("విజయవంతంగా సేవ్: ","Saved successfully: ")+created.length+" · "+T("ఇంకా ఖాళీ స్థానాలు: ","Remaining seats: ")+Math.max(0,targetStrength-existingCount));}
  if(created.length){const ids=created.map(item=>item.studentId).join(", ");toast(T("Student IDs: ","Student IDs: ")+ids);}
  button.disabled=false;addButtons.forEach(b=>b.disabled=false);button.textContent=T("అన్ని వివరాలు సేవ్ చేయండి","Save All Students");
 };
}
function teacherManagementMarkup(){
 const classes=["Class 1","Class 2","Class 3","Class 4","Class 5"];
 const subjects=["Telugu","English","Mathematics","EVS"];
 const displayChoice=value=>/^Class [1-5]$/.test(value)?T(value.replace("Class ","")+"వ తరగతి",value):({Telugu:T("తెలుగు","Telugu"),English:T("ఆంగ్లం","English"),Mathematics:T("గణితం","Mathematics"),EVS:T("పర్యావరణ శాస్త్రం","EVS")}[value]||value);
 const choiceGroup=(name,label,values,selected=[])=>'<fieldset class="teacher-choice-group"><legend>'+label+'</legend><div class="teacher-choice-grid">'+values.map(value=>'<label class="teacher-choice"><input type="checkbox" name="'+name+'" value="'+escapeHtml(value)+'" '+(selected.includes(value)?"checked":"")+'><span>'+escapeHtml(displayChoice(value))+'</span></label>').join("")+'</div></fieldset>';
 return '<style>'+
 '.teacher-admin{display:grid;gap:17px;margin-top:18px;color:var(--text)}'+'.teacher-dob-control{display:flex;gap:8px;align-items:center}.teacher-dob-control input[data-dob-text]{flex:1;min-width:0}.teacher-dob-control input[data-dob-picker]{width:52px!important;min-width:52px;padding:6px!important;cursor:pointer}'+'.teacher-admin-view-panel{margin-top:12px;padding:13px;border:1px solid #dce9de;border-radius:14px;background:var(--surface)}.teacher-admin-view-panel[hidden]{display:none}.teacher-admin-feedback{display:block;margin-top:9px;padding:9px 11px;border-radius:9px;background:#fff4e5;color:#8a4d12;font-size:12px;line-height:1.5}.teacher-admin-feedback:empty{display:none}'+
 '.teacher-admin *{box-sizing:border-box}'+
 '.teacher-admin-hero{padding:20px;border:1px solid #d8e8db;border-radius:20px;background:linear-gradient(125deg,#eff8f0,#e5f1e6 62%,#faf8ee);color:#294d35;display:flex;justify-content:space-between;align-items:center;gap:12px}'+
 '.teacher-admin-kicker{font-size:10px;letter-spacing:.15em;font-weight:850;color:#66866d}.teacher-admin-hero h3{margin:5px 0;font-size:22px;color:#294d35}.teacher-admin-hero p{margin:0;color:#6c8572;font-size:12px;line-height:1.5}'+
 '.teacher-admin-mark{width:48px;height:48px;flex:none;border-radius:15px;background:#d9eadb;color:#356f50;display:grid;place-items:center;font-size:23px;font-weight:900}'+
 '.teacher-admin-card{border:1px solid var(--border);border-radius:18px;padding:17px;background:var(--surface);box-shadow:0 7px 20px rgba(45,83,54,.045)}'+
 '.teacher-admin-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.teacher-admin-card-head h3{margin:0;font-size:17px;color:var(--text)}'+
 '.teacher-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}'+
 '.teacher-admin .field{display:grid;gap:6px;margin:0}.teacher-admin .field label,.teacher-choice-group legend{font-size:12px;font-weight:750;color:var(--text)}'+
 '.teacher-admin input:not([type=checkbox]),.teacher-admin select,.teacher-admin textarea{width:100%;min-height:44px;padding:10px 12px;border:1px solid var(--border);border-radius:11px;background:var(--surface2);color:var(--text);font:inherit}'+
 '.teacher-admin input[type=date]{min-height:44px}.teacher-admin textarea{min-height:72px;resize:vertical}'+
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
 '.teacher-profile-details{margin-top:10px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--surface)}.teacher-profile-details summary{font-size:12px;font-weight:800;color:var(--green);cursor:pointer}.teacher-profile-details small{display:block;margin-top:7px;color:var(--muted);font-size:12px;overflow-wrap:anywhere}'+
 '.teacher-admin-subform{padding:10px 0}.teacher-admin-subform .teacher-admin-action{margin-top:12px}'+
 '.teacher-admin-empty{padding:16px;border:1px dashed var(--border);border-radius:13px;color:var(--muted);font-size:13px;text-align:center}'+
 '@media(max-width:560px){.teacher-admin-grid{grid-template-columns:1fr}.teacher-admin-card{padding:13px}.teacher-admin-hero{padding:16px}.teacher-choice-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.teacher-admin-mark{width:42px;height:42px}}'+
 '.teacher-admin-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px 18px;padding:17px 18px;border:1px solid #dce9df;border-radius:16px;background:#fff;box-shadow:0 5px 16px rgba(35,76,47,.045);transition:border-color .18s ease,box-shadow .18s ease}.teacher-admin-row:hover{border-color:#a9cdb0;box-shadow:0 9px 22px rgba(35,76,47,.08)}'+
 '.teacher-admin-person{display:flex;align-items:center;gap:12px;min-width:0}.teacher-admin-avatar{width:48px;height:48px;flex:none;border-radius:16px;display:grid;place-items:center;background:linear-gradient(145deg,#e3f1e5,#cfe5d2);border:1px solid #c8dfcc;color:#2e6941;font-size:15px;font-weight:900;letter-spacing:.04em}.teacher-admin-person-copy{min-width:0}.teacher-admin-person-copy>strong{display:block;font-size:15px;font-weight:850;letter-spacing:-.01em}.teacher-admin-person-copy>small{font-size:11px!important;letter-spacing:.035em}.teacher-admin-id{display:grid;gap:4px;text-align:right;font-size:9px;letter-spacing:.12em;color:#829487}.teacher-admin-id b{font-size:13px;color:#356b45;letter-spacing:.04em}.teacher-admin-status{padding:5px 10px;border:1px solid #d1e8d5;letter-spacing:.07em}.teacher-admin-status.inactive{border-color:#f0d6ce}.teacher-admin-view-button{min-width:132px;justify-content:center;display:inline-flex;align-items:center;gap:7px}.teacher-admin-view-button span{font-size:16px;line-height:1}.teacher-admin-view-panel{margin-top:15px;padding:17px;border:1px solid #dce9df;border-radius:15px;background:linear-gradient(145deg,#fbfdfb,#f3f8f3)}.teacher-admin-section-label{margin:3px 0 12px;color:#58715e;font-size:12px;font-weight:850;letter-spacing:.10em;text-transform:uppercase}.teacher-admin-info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-bottom:16px}.teacher-admin-info-tile{min-width:0;padding:12px;border:1px solid #e0ebe2;border-radius:12px;background:#fff}.teacher-admin-info-tile span{display:block;color:#536b59;font-size:20px;font-weight:800;line-height:1.55;margin-bottom:9px}.teacher-admin-info-tile strong{display:block;color:#294b32;font-size:20px;font-weight:750;line-height:1.55;overflow-wrap:anywhere}.teacher-profile-details{background:#fff;border-color:#dce9df;padding:12px}.teacher-profile-details summary{padding:2px 0}.teacher-profile-details small{padding-top:6px;border-top:1px solid #eef3ee}.teacher-admin-management-actions{margin-top:15px;padding-top:14px;border-top:1px solid #dfe9e1}.teacher-admin-row details{border-color:#dfe9e1}.teacher-admin-row summary{padding:8px 0}.teacher-admin-inactive-note{margin:0 0 15px;padding:11px 13px;border:1px solid #f0ddd6;border-radius:11px;background:#fff8f5;color:#8a5547;font-size:11px;line-height:1.5}'+
 '@media(max-width:560px){.teacher-admin-person{gap:9px}.teacher-admin-avatar{width:42px;height:42px;border-radius:14px}.teacher-admin-info-grid{grid-template-columns:1fr}.teacher-admin-view-panel{padding:12px}.teacher-admin-row{grid-template-columns:1fr;padding:13px}.teacher-admin-row-top{align-items:center}.teacher-admin-quick-actions{margin-top:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.teacher-admin-quick-actions .btn{padding:8px 5px;min-width:0}}.teacher-admin-quick-actions{grid-column:1/-1;margin-top:0;padding-top:12px;border-top:1px solid #edf2ed}.teacher-admin-quick-actions .btn{flex:1;min-width:92px}.teacher-admin-quick-actions [data-view-teacher]{background:#edf6ee;border-color:#d6e8d9;color:#2d6740}'+
 '</style>'+
 '<div class="teacher-admin">'+
  '<header class="teacher-admin-hero"><div><div class="teacher-admin-kicker">MPMPS SCHOOL · STAFF DIRECTORY</div><h3>'+T("ఉపాధ్యాయుల నిర్వహణ","Teacher Management")+'</h3><p>'+T("ఉపాధ్యాయుల ప్రొఫైల్స్, తరగతి కేటాయింపులు మరియు లాగిన్ వివరాలను నిర్వహించండి","Manage teacher profiles, class assignments and login access")+'</p></div><div class="teacher-admin-mark" aria-hidden="true">TM</div></header>'+
  '<section class="teacher-admin-card"><div class="teacher-admin-card-head"><h3>'+T("ఉపాధ్యాయుల జాబితా","Teachers List")+'</h3><span class="teacher-admin-id">TEACHER DIRECTORY</span></div><div id="teacherList" class="teacher-admin-list"><div class="teacher-admin-empty">'+T("ఉపాధ్యాయుల వివరాలను లోడ్ చేస్తోంది…","Loading teachers…")+'</div></div></section>'+
  '<div class="teacher-admin-action teacher-create-entry"><button type="button" class="btn" id="showTeacherCreate">+ '+T("ఉపాధ్యాయుడిని చేర్చండి","Create Teacher")+'</button></div>'+
  '<section class="teacher-admin-card" id="teacherCreateCard" hidden><div class="teacher-admin-card-head"><h3>'+T("కొత్త ఉపాధ్యాయుడి వివరాలు","Create Teacher Profile")+'</h3><span class="teacher-admin-id">NEW PROFILE</span></div>'+
   '<form id="teacherCreateForm">'+
    '<div class="teacher-admin-grid">'+
     '<div class="field"><label for="teacherName">'+T("ఉపాధ్యాయుని పేరు","Teacher Name")+'</label><input id="teacherName" name="name" maxlength="100" required autocomplete="name" placeholder="'+T("పూర్తి పేరు నమోదు చేయండి","Enter full name")+'"></div>'+
     '<div class="field"><label for="teacherDob">'+T("పుట్టిన తేదీ (DD/MM/YYYY)","Date of Birth (DD/MM/YYYY)")+'</label><div class="teacher-dob-control"><input id="teacherDob" data-dob-text name="dob" type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY" autocomplete="bday" required><input data-dob-picker type="date" aria-label="'+T("క్యాలెండర్ ద్వారా తేదీ ఎంచుకోండి","Choose date from calendar")+'"></div></div>'+
     '<div class="field"><label for="teacherGender">'+T("లింగం","Gender")+'</label><select id="teacherGender" name="gender" required><option value="">'+T("ఎంచుకోండి","Select Gender")+'</option><option value="Female">'+T("స్త్రీ","Female")+'</option><option value="Male">'+T("పురుషుడు","Male")+'</option><option value="Other">'+T("ఇతర","Other")+'</option></select></div>'+
    '</div>'+
    choiceGroup("classes",T("కేటాయించిన తరగతులు","Assigned Classes"),classes)+
    choiceGroup("subjects",T("బోధనా సబ్జెక్టులు","Teaching Subjects"),subjects)+
    '<p class="teacher-admin-help">'+T("ఈ ఉపాధ్యాయునికి కేటాయించాల్సిన తరగతులు, సబ్జెక్టులను ఎంచుకోండి. Teacher ID ఆటోమేటిక్‌గా రూపొందుతుంది.","Select all classes and subjects assigned to this teacher. Teacher ID will be generated automatically.")+'</p>'+
    '<div class="teacher-admin-action"><button class="btn" id="teacherCreateButton" type="submit">'+T("Create Teacher","Create Teacher")+'</button><button class="btn secondary" id="cancelTeacherCreate" type="button">'+T("రద్దు","Cancel")+'</button><span id="teacherCreateStatus" class="teacher-admin-help" role="status"></span></div>'+
   '</form>'+
  '</section>'+
  '<div id="teacherManagementStatus" class="teacher-admin-help" role="status" aria-live="polite"></div>'+
  '<div id="teacherCreateResult" class="teacher-admin-result" aria-live="polite"></div>'+
 '</div>';
}
async function bindTeacherManagement(){
 const form=main.querySelector("#teacherCreateForm"),createCard=main.querySelector("#teacherCreateCard");
 const showCreateButton=main.querySelector("#showTeacherCreate"),cancelCreateButton=main.querySelector("#cancelTeacherCreate");
 const button=main.querySelector("#teacherCreateButton"),formStatus=main.querySelector("#teacherCreateStatus");
 const status=main.querySelector("#teacherManagementStatus"),resultBox=main.querySelector("#teacherCreateResult"),listBox=main.querySelector("#teacherList");
 const classes=["Class 1","Class 2","Class 3","Class 4","Class 5"],subjects=["Telugu","English","Mathematics","EVS"];
 const esc=value=>escapeHtml(String(value??""));
 const displayChoice=value=>/^Class [1-5]$/.test(value)?T(value.replace("Class ","")+"వ తరగతి",value):({Telugu:T("తెలుగు","Telugu"),English:T("ఆంగ్లం","English"),Mathematics:T("గణితం","Mathematics"),EVS:T("పర్యావరణ శాస్త్రం","EVS")}[value]||value);
 const checkedValues=(root,name)=>[...root.querySelectorAll('input[name="'+name+'"]:checked')].map(input=>input.value);
 const choiceGroup=(name,label,values,selected=[])=>'<fieldset class="teacher-choice-group"><legend>'+label+'</legend><div class="teacher-choice-grid">'+values.map(value=>'<label class="teacher-choice"><input type="checkbox" name="'+name+'" value="'+esc(value)+'" '+(selected.includes(value)?"checked":"")+'><span>'+esc(displayChoice(value))+'</span></label>').join("")+'</div></fieldset>';
 const shareMessage=credentials=>T("Digital Mana Badiకి స్వాగతం!\n\nమీ Teacher Login వివరాలు:\n\nTeacher ID: ","Welcome to Digital Mana Badi!\n\nYour Teacher Login Details:\n\nTeacher ID: ")+credentials.teacherId+"\nLogin ID: "+credentials.loginId+"\nLogin Password / Secret Code: "+credentials.password+"\n\n"+T("మొదటిసారి లాగిన్ చేసి సెటప్ పూర్తి చేయండి.\n\nభద్రతా సూచన: మీ Login ID మరియు Passwordను ఎవరికీ పంచవద్దు.\n\n– MPMPS School, Dagguluru","Please log in and complete your first-time setup.\n\nSecurity Notice: Do not share your Login ID or Password with anyone.\n\n– MPMPS School, Dagguluru");
 const renderCredentials=credentials=>{
  resultBox.innerHTML='<h4>'+T("Teacher Login విజయవంతంగా రూపొందించబడింది","Teacher login created successfully")+'</h4><p class="teacher-admin-help">'+T("ఈ వివరాలను గోప్యంగా పంచుకోండి. Secret Code ఈ Teacher Profileలో కూడా ఉంటుంది.","Share these credentials privately. The Secret Code is also available in this teacher profile.")+'</p><div class="teacher-admin-credential"><small>Teacher ID</small><strong>'+esc(credentials.teacherId)+'</strong><small>Login ID</small><strong>'+esc(credentials.loginId)+'</strong><small>Login Password / Secret Code</small><div class="teacher-password-row"><input id="teacherGeneratedPassword" type="password" readonly value="'+esc(credentials.password)+'" aria-label="Teacher login password and secret code"><button type="button" class="btn secondary" id="teacherTogglePassword">'+T("చూపించు","Show")+'</button></div></div><a class="teacher-admin-share" id="teacherShareWhatsApp" target="_blank" rel="noopener noreferrer">'+T("WhatsApp ద్వారా పంపండి","Share via WhatsApp")+' ↗</a>';
  resultBox.classList.add("is-visible");
  main.querySelector("#teacherTogglePassword").onclick=()=>{const input=main.querySelector("#teacherGeneratedPassword"),toggle=main.querySelector("#teacherTogglePassword");const visible=input.type==="password";input.type=visible?"text":"password";toggle.textContent=visible?T("దాచు","Hide"):T("చూపించు","Show");};
  main.querySelector("#teacherShareWhatsApp").href="https://wa.me/?text="+encodeURIComponent(shareMessage(credentials));
 };
 if(showCreateButton)showCreateButton.onclick=()=>{createCard.hidden=false;showCreateButton.hidden=true;main.querySelector("#teacherName")?.focus();};
 if(cancelCreateButton)cancelCreateButton.onclick=()=>{createCard.hidden=true;showCreateButton.hidden=false;form.reset();formStatus.textContent="";};
 const renderTeacherRow=teacher=>{
  const id=esc(teacher.teacherId),active=teacher.status==="active";
  const reasonLabel={school_transfer:T("పాఠశాల బదిలీ","School Transfer"),retired:T("పదవీ విరమణ","Retired"),other:T("ఇతర కారణం","Other Reason")}[teacher.deactivationReason]||"";
  const selectedClasses=teacher.assignedClasses||[],selectedSubjects=teacher.teachingSubjects||[];
  const editForm='<form class="teacher-admin-subform" data-edit-teacher="'+id+'"><div class="teacher-admin-grid"><div class="field"><label>'+T("ఉపాధ్యాయుని పేరు","Teacher Name")+'</label><input name="name" maxlength="100" required value="'+esc(teacher.name)+'"></div><div class="field"><label>'+T("పుట్టిన తేదీ (DD/MM/YYYY)","Date of Birth (DD/MM/YYYY)")+'</label><div class="teacher-dob-control"><input name="dob" data-dob-text type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY" required value="'+esc(toDateInputValue(teacher.dob))+'"><input data-dob-picker type="date" aria-label="'+T("క్యాలెండర్ ద్వారా తేదీ ఎంచుకోండి","Choose date from calendar")+'"></div></div><div class="field"><label>'+T("లింగం","Gender")+'</label><select name="gender" required><option value="Female" '+(teacher.gender==="Female"?"selected":"")+'>'+T("స్త్రీ","Female")+'</option><option value="Male" '+(teacher.gender==="Male"?"selected":"")+'>'+T("పురుషుడు","Male")+'</option><option value="Other" '+(teacher.gender==="Other"?"selected":"")+'>'+T("ఇతర","Other")+'</option></select></div></div>'+choiceGroup("classes",T("కేటాయించిన తరగతులు","Assigned Classes"),classes,selectedClasses)+choiceGroup("subjects",T("బోధనా సబ్జెక్టులు","Teaching Subjects"),subjects,selectedSubjects)+'<div class="teacher-admin-action"><button class="btn" type="submit">'+T("మార్పులను సేవ్ చేయండి","Save Changes")+'</button></div></form>';
  const loginAction=active&&!teacher.authUid?'<button type="button" class="btn" data-create-login="'+id+'">'+T("లాగిన్ సృష్టించండి","Create Login")+'</button>':"";
  const loginStatus=!teacher.authUid||!teacher.loginId?T("సృష్టించలేదు","Not Created"):active?T("క్రియాశీలం","Active"):T("నిలిపివేయబడింది","Blocked — Deactivated");
  const profileDetails='<div class="teacher-admin-info-grid"><div class="teacher-admin-info-tile"><span>'+T("ఉపాధ్యాయుని పేరు","Teacher Name")+'</span><strong>'+esc(teacher.name||"—")+'</strong></div><div class="teacher-admin-info-tile"><span>Teacher ID</span><strong>'+id+'</strong></div><div class="teacher-admin-info-tile"><span>'+T("పుట్టిన తేదీ","Date of Birth")+'</span><strong>'+esc(toDateInputValue(teacher.dob)||"—")+'</strong></div><div class="teacher-admin-info-tile"><span>'+T("లింగం","Gender")+'</span><strong>'+esc(teacher.gender||"—")+'</strong></div><div class="teacher-admin-info-tile"><span>'+T("కేటాయించిన తరగతులు","Assigned Classes")+'</span><strong>'+esc(selectedClasses.map(displayChoice).join(", ")||"—")+'</strong></div><div class="teacher-admin-info-tile"><span>'+T("బోధనా సబ్జెక్టులు","Teaching Subjects")+'</span><strong>'+esc(selectedSubjects.map(displayChoice).join(", ")||"—")+'</strong></div><div class="teacher-admin-info-tile"><span>Login ID</span><strong>'+esc(teacher.loginId||T("ఇంకా లేదు","Not created"))+'</strong></div><div class="teacher-admin-info-tile"><span>Secret Code</span><strong>'+esc(teacher.secretCode||T("ఇంకా రూపొందించలేదు","Not generated"))+'</strong></div><div class="teacher-admin-info-tile"><span>'+T("లాగిన్ స్థితి","Login Status")+'</span><strong>'+loginStatus+'</strong></div><div class="teacher-admin-info-tile"><span>'+T("ఉపాధ్యాయుని స్థితి","Teacher Status")+'</span><strong>'+ (active?T("క్రియాశీలం","Active"):T("నిలిపివేయబడింది","Deactivated"))+'</strong></div></div>';
  const statusAction=active?'<form class="teacher-admin-subform" data-deactivate-teacher="'+id+'"><div class="field"><label>'+T("నిలిపివేత కారణం","Reason for Deactivation")+'</label><select name="reason" required><option value="">'+T("కారణం ఎంచుకోండి","Select Reason")+'</option><option value="school_transfer">'+T("పాఠశాల బదిలీ","School Transfer")+'</option><option value="retired">'+T("పదవీ విరమణ","Retired")+'</option><option value="other">'+T("ఇతర కారణం","Other Reason")+'</option></select></div><div class="field" style="margin-top:10px"><label>'+T("అదనపు గమనిక (ఐచ్ఛికం)","Additional Note (optional)")+'</label><textarea name="note" maxlength="240" placeholder="'+T("చిన్న గమనిక నమోదు చేయండి","Add a short note")+'"></textarea></div><div class="teacher-admin-action"><button class="btn secondary" type="submit">'+T("నిలిపివేతను నిర్ధారించండి","Confirm Deactivation")+'</button></div></form>':'<button type="button" class="btn" data-reactivate-teacher="'+id+'">'+T("మళ్లీ క్రియాశీలం చేయండి","Reactivate")+'</button>';
  const initials=(teacher.name||"T").trim().split(/\\s+/).slice(0,2).map(part=>part.charAt(0)).join("").toUpperCase();
  return '<article class="teacher-admin-row"><div class="teacher-admin-row-top"><div class="teacher-admin-person"><span class="teacher-admin-avatar" aria-hidden="true">'+esc(initials)+'</span><div class="teacher-admin-person-copy"><strong>'+esc(teacher.name)+'</strong><small>Teacher ID · '+id+'</small><span class="teacher-admin-status '+(active?"":"inactive")+'">'+(active?T("క్రియాశీలం","ACTIVE"):T("నిలిపివేయబడింది","DEACTIVATED"))+'</span></div></div><span class="teacher-admin-id">'+T("STAFF ID","STAFF ID")+'<b>'+id+'</b></span></div><div class="teacher-admin-row-actions teacher-admin-quick-actions"><button type="button" class="btn secondary teacher-admin-view-button" data-view-teacher="'+id+'" aria-expanded="false">'+T("వివరాలు","View")+'</button><button type="button" class="btn secondary" data-edit-open="'+id+'" aria-expanded="false">'+T("సవరించండి","Edit")+'</button><button type="button" class="btn secondary" data-manage-open="'+id+'" aria-expanded="false">'+T("నిలిపివేయండి","Deactivate")+'</button></div><section class="teacher-admin-view-panel" data-teacher-panel="'+id+'" hidden>'+profileDetails+(active?"":'<div class="teacher-admin-inactive-note"><strong>'+T("నిలిపివేత కారణం","Deactivation Reason")+':</strong> '+esc(reasonLabel)+(teacher.deactivationNote?' · '+esc(teacher.deactivationNote):"")+'</div>')+'</section><section class="teacher-admin-view-panel teacher-admin-edit-panel" data-teacher-edit-panel="'+id+'" hidden>'+editForm+'</section><section class="teacher-admin-view-panel teacher-admin-management-panel" data-teacher-manage-panel="'+id+'" hidden><div class="teacher-admin-row-actions">'+loginAction+statusAction+'</div><div class="teacher-admin-feedback" data-teacher-feedback="'+id+'" role="status" aria-live="polite"></div></section></article>';
 };
 const refreshList=async()=>{
  listBox.innerHTML='<div class="teacher-admin-empty">'+T("ఉపాధ్యాయుల వివరాలను లోడ్ చేస్తోంది…","Loading teachers…")+'</div>';
  try{
   const response=await listTeacherRecords(),teachers=response.teachers||[];
   listBox.innerHTML=teachers.length?teachers.map(renderTeacherRow).join(""):'<div class="teacher-admin-empty">'+T("ఇంకా ఉపాధ్యాయులు నమోదు కాలేదు.","No teachers have been added yet.")+'</div>';
   const openTeacherPanel=(id,type)=>{const panels={view:"[data-teacher-panel]",edit:"[data-teacher-edit-panel]",manage:"[data-teacher-manage-panel]"},actions={view:"[data-view-teacher]",edit:"[data-edit-open]",manage:"[data-manage-open]"};const article=listBox.querySelector('[data-teacher-panel="'+id+'"]')?.closest(".teacher-admin-row");if(!article)return;Object.entries(panels).forEach(([key,selector])=>{const panel=article.querySelector(selector);if(panel)panel.hidden=key!==type;const action=article.querySelector(actions[key]);if(action){action.setAttribute("aria-expanded",String(key===type));}});const target=article.querySelector(panels[type]);if(target)target.scrollIntoView({behavior:"smooth",block:"nearest"});};
   listBox.querySelectorAll("[data-view-teacher]").forEach(action=>action.onclick=()=>{const id=action.dataset.viewTeacher,article=action.closest(".teacher-admin-row"),panel=article?.querySelector("[data-teacher-panel]");if(!panel)return;if(panel.hidden){openTeacherPanel(id,"view");}else{openTeacherPanel(id,"");action.setAttribute("aria-expanded","false");}});
   listBox.querySelectorAll("[data-edit-open]").forEach(action=>action.onclick=()=>{const id=action.dataset.editOpen,article=action.closest(".teacher-admin-row"),panel=article?.querySelector("[data-teacher-edit-panel]");if(!panel)return;const opening=panel.hidden;if(opening)openTeacherPanel(id,"edit");else{panel.hidden=true;action.setAttribute("aria-expanded","false");}});
   listBox.querySelectorAll("[data-manage-open]").forEach(action=>action.onclick=()=>{const id=action.dataset.manageOpen,article=action.closest(".teacher-admin-row"),panel=article?.querySelector("[data-teacher-manage-panel]");if(!panel)return;const opening=panel.hidden;if(opening)openTeacherPanel(id,"manage");else{panel.hidden=true;action.setAttribute("aria-expanded","false");}});
   listBox.querySelectorAll("[data-create-login]").forEach(action=>action.onclick=async()=>{const id=action.dataset.createLogin,feedback=listBox.querySelector('[data-teacher-feedback="'+id+'"]');action.disabled=true;action.textContent=T("లాగిన్ సృష్టిస్తోంది…","Creating Login…");if(feedback)feedback.textContent=T("Firebase Login సృష్టిస్తోంది…","Creating Firebase login…");try{const credentials=await createTeacherLogin(id);renderCredentials(credentials);status.textContent=T("Teacher Login విజయవంతంగా రూపొందించబడింది.","Teacher login created successfully.");await refreshList();const managePanel=listBox.querySelector('[data-teacher-manage-panel="'+id+'"]');if(managePanel)openTeacherPanel(id,"manage");resultBox.scrollIntoView({behavior:"smooth",block:"nearest"});}catch(error){const msg=error?.message||T("లాగిన్ సృష్టించలేకపోయాం.","Login creation failed.");if(feedback)feedback.textContent=msg;status.textContent=msg;action.disabled=false;action.textContent=T("లాగిన్ సృష్టించండి","Create Login");}});
   bindDobInputs(listBox);
   listBox.querySelectorAll("[data-edit-teacher]").forEach(editForm=>editForm.onsubmit=async event=>{
    event.preventDefault();const submit=editForm.querySelector('button[type="submit"]');submit.disabled=true;submit.textContent=T("సేవ్ చేస్తోంది…","Saving…");
    const payload={name:editForm.querySelector('[name="name"]').value.trim(),dob:fromDateInputValue(editForm.querySelector('[name="dob"]').value),gender:editForm.querySelector('[name="gender"]').value,assignedClasses:checkedValues(editForm,"classes"),teachingSubjects:checkedValues(editForm,"subjects")};
    try{await updateTeacherRecord(editForm.dataset.editTeacher,payload);status.textContent=T("Teacher Profile నవీకరించబడింది.","Teacher profile updated.");await refreshList();}
    catch(error){status.textContent=error?.message||T("Teacher వివరాలను నవీకరించలేకపోయాం.","Could not update teacher.");submit.disabled=false;submit.textContent=T("మార్పులను సేవ్ చేయండి","Save Changes");}
   });
   listBox.querySelectorAll("[data-deactivate-teacher]").forEach(deactivateForm=>deactivateForm.onsubmit=async event=>{
    event.preventDefault();const submit=deactivateForm.querySelector('button[type="submit"]');submit.disabled=true;submit.textContent=T("నిలిపివేస్తోంది…","Deactivating…");
    try{await setTeacherStatus(deactivateForm.dataset.deactivateTeacher,"inactive",deactivateForm.querySelector('[name="reason"]').value,deactivateForm.querySelector('[name="note"]').value);status.textContent=T("ఉపాధ్యాయుడు నిలిపివేయబడ్డారు. పాత రికార్డులు భద్రంగా ఉంటాయి.","Teacher deactivated. Historical records are retained.");await refreshList();}
    catch(error){status.textContent=error?.message||T("నిలిపివేయలేకపోయాం.","Could not deactivate teacher.");submit.disabled=false;submit.textContent=T("నిలిపివేతను నిర్ధారించండి","Confirm Deactivation");}
   });
   listBox.querySelectorAll("[data-reactivate-teacher]").forEach(action=>action.onclick=async()=>{
    action.disabled=true;action.textContent=T("మళ్లీ క్రియాశీలం చేస్తోంది…","Reactivating…");
    try{await setTeacherStatus(action.dataset.reactivateTeacher,"active");status.textContent=T("ఉపాధ్యాయుడు మళ్లీ క్రియాశీలమయ్యారు.","Teacher reactivated.");await refreshList();}
    catch(error){status.textContent=error?.message||T("మళ్లీ క్రియాశీలం చేయలేకపోయాం.","Could not reactivate teacher.");action.disabled=false;action.textContent=T("మళ్లీ క్రియాశీలం చేయండి","Reactivate");}
   });
  }catch(error){listBox.innerHTML='<div class="teacher-admin-empty">'+esc(error?.message||T("ఉపాధ్యాయుల జాబితాను లోడ్ చేయలేకపోయాం.","Could not load teacher list."))+'</div>';}
 };
 bindDobInputs(main);
 if(form)form.onsubmit=async event=>{
  event.preventDefault();formStatus.textContent="";resultBox.classList.remove("is-visible");
  const payload={name:main.querySelector("#teacherName").value.trim(),dob:fromDateInputValue(main.querySelector("#teacherDob").value),gender:main.querySelector("#teacherGender").value,assignedClasses:checkedValues(form,"classes"),teachingSubjects:checkedValues(form,"subjects")};
  if(!payload.assignedClasses.length||!payload.teachingSubjects.length){formStatus.textContent=T("తరగతులు మరియు సబ్జెక్టులను ఎంచుకోండి.","Select Classes and Subjects.");return;}
  button.disabled=true;button.textContent=T("సృష్టిస్తోంది…","Creating…");
  try{
   const created=await createTeacherRecord(payload);
   const loginButtonId="createLoginForNewTeacher";
   resultBox.innerHTML='<h4>'+T("Teacher Profile రూపొందించబడింది","Teacher profile created")+'</h4><p class="teacher-admin-help">Teacher ID: <strong>'+esc(created.teacherId)+'</strong><br>Login ID: <strong>'+esc(created.teacherId+'@dagguluruschool.in')+'</strong></p><p class="teacher-admin-help">'+T("ఇప్పుడు ఇదే పేజీలో Create Login నొక్కి Firebase Login సృష్టించండి. మళ్లీ Teacher record సృష్టించాల్సిన అవసరం లేదు.","Create the Firebase login here using the button below. Do not create another teacher record.")+'</p><div class="teacher-admin-action"><button type="button" class="btn" id="'+loginButtonId+'">'+T("Create Login","Create Login")+'</button><span id="newTeacherLoginStatus" class="teacher-admin-help" role="status" aria-live="polite"></span></div>';
   resultBox.classList.add("is-visible");form.reset();button.disabled=true;button.textContent=T("Teacher Created","Teacher Created");if(cancelCreateButton)cancelCreateButton.hidden=true;await refreshList();
   const loginButton=resultBox.querySelector("#"+loginButtonId),loginStatus=resultBox.querySelector("#newTeacherLoginStatus");
   loginButton.onclick=async()=>{
    loginButton.disabled=true;loginButton.textContent=T("లాగిన్ సృష్టిస్తోంది…","Creating Login…");loginStatus.textContent=T("Firebase Authenticationలో Login సృష్టిస్తోంది…","Creating Firebase Authentication login…");
    try{
     const credentials=await createTeacherLogin(created.teacherId);
     renderCredentials(credentials);
     status.textContent=T("Teacher Login విజయవంతంగా రూపొందించబడింది.","Teacher login created successfully.");
     await refreshList();
    }catch(error){
     const message=error?.message||T("లాగిన్ సృష్టించలేకపోయాం.","Could not create login.");
     loginStatus.textContent=message;status.textContent=message;
     loginButton.disabled=false;loginButton.textContent=T("మళ్లీ ప్రయత్నించండి","Retry Create Login");
    }
   };
   await refreshList();
  }catch(error){formStatus.textContent=error?.message||T("ఉపాధ్యాయుడిని నమోదు చేయలేకపోయాం. మళ్లీ ప్రయత్నించండి.","Could not create teacher. Please try again.");}
  finally{if(!resultBox.classList.contains("is-visible")){button.disabled=false;button.textContent=T("Create Teacher","Create Teacher");}}
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
 const managementLanding=title==="Class & Teacher Management"&&state.role==="hm";
 const teacherManagement=title==="Teacher Management"&&state.role==="hm";
 const classManagement=title==="Class Management"&&state.role==="hm";
 const managementDetail=teacherManagement||classManagement;
 const detailMarkup=teacherManagement?teacherManagementMarkup():classManagement?classManagementMarkup():`<div class="detail-list">${cfg.map((s,i)=>`<div class="detail-row"><span class="detail-icon">${i+1}</span><div><strong>${s}</strong><small>${i===0?"విభాగాన్ని తెరిచి వివరాలు చూడండి.":"అనుమతులకు అనుగుణంగా అందుబాటులో ఉంటుంది."}</small></div><span>›</span></div>`).join("")}</div>`;
 const previewNote=managementLanding||managementDetail?"":'<div class="demo-note">ఇది Frontend Preview. నిజమైన School Data, Authentication, Approval Writes ఇంకా Firebaseతో అనుసంధానం కాలేదు.</div>';
 if(managementLanding){
  main.innerHTML='<section class="management-picker-screen">'+managementLandingMarkup()+'</section>';
 }else{
  main.innerHTML=`<div class="backline"><button class="btn secondary" id="moduleBack">← Dashboard</button><span class="pill">${escapeHtml(title)}</span></div><section class="card module-detail">${managementDetail?"":'<h2>'+escapeHtml(title)+'</h2><p>ఈ విభాగానికి సంబంధించిన వివరాలు మరియు చర్యలు.</p>'}
   ${calendar?renderCalendarMarkup({state,T}):""}
   ${alumniSponsorSection.communityModuleMarkup(title)}
   ${groupMarkup}
   ${detailMarkup}
   ${title==="Mid-Day Meal"?renderMidDayMealMarkup({T}):""}
   ${title==="Poster Studio"?renderPosterStudioMarkup({T,APP_CONFIG,escapeHtml}):""}
   ${previewNote}</section>`;
 }
 const selectionBack=main.querySelector("#managementSelectionBack");
 if(selectionBack)selectionBack.onclick=()=>{state.module=null;state.view="dashboard";render();};
 const moduleBack=document.querySelector("#moduleBack");
 if(moduleBack){
  moduleBack.textContent=managementDetail?"← "+T("తరగతులు & ఉపాధ్యాయుల ఎంపిక","Teacher & Class Selection"):"← "+T("డాష్‌బోర్డ్","Dashboard");
  moduleBack.onclick=()=>{
   if(managementDetail){
    state.module="Class & Teacher Management";
    state.managementReturnTo=null;
    state.view="module";
   }else state.view="dashboard";
   render();
  };
 }
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
 if(classManagement)bindClassManagement();
}
 return { modulePage };
}
