import { listClassrooms, listClassStudents, createClassStudents, saveClassDetails, updateClassStudent } from "./class-service.js";

export function classManagementMarkup({T}){
 const classes=[1,2,3,4,5];
 return '<style>'+
 '.class-admin{display:grid;gap:16px;margin-top:18px;color:var(--text)}.class-admin *{box-sizing:border-box}.class-admin-hero{padding:20px;border:1px solid #d8e8db;border-radius:20px;background:linear-gradient(125deg,#eff8f0,#e5f1e6 62%,#faf8ee);color:#294d35}.class-admin-hero h3{margin:5px 0;font-size:22px}.class-admin-hero p{margin:0;font-size:14px;line-height:1.6}.class-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.class-admin-tile{display:flex;align-items:center;gap:13px;padding:16px;border:1px solid #e0eae1;border-radius:16px;background:var(--surface);cursor:pointer;text-align:left;width:100%;color:var(--text)}.class-admin-tile[aria-expanded=true]{border-color:#8eb99a;background:#f3faf4}.class-admin-number{display:grid;width:44px;height:44px;place-items:center;border-radius:13px;background:#e9f3e9;color:#39734b;font-weight:900}.class-admin-panel{display:grid;gap:14px;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--surface)}.class-admin-panel[hidden],.class-sheet-workspace[hidden],.class-edit-form[hidden]{display:none}.class-admin-panel-head,.class-sheet-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.class-admin-panel-head h4{margin:0}.class-admin-status{font-size:13px;color:var(--muted)}.class-strength-setup{display:grid;gap:9px;padding:15px;border:1px solid #dce9df;border-radius:14px;background:var(--surface2)}.class-strength-controls{display:flex;gap:9px;align-items:center;flex-wrap:wrap}.class-strength-controls input,.class-student-sheet input,.class-student-sheet select,.class-edit-form input,.class-edit-form select{min-height:42px;padding:8px 10px;border:1px solid var(--border);border-radius:9px;background:var(--surface2);color:var(--text);font:inherit}.class-strength-controls input{width:130px}.class-sheet-wrap{width:100%;overflow:auto;border:1px solid var(--border);border-radius:13px}.class-student-sheet{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed}.class-student-sheet th,.class-student-sheet td{padding:8px;border-bottom:1px solid var(--border);text-align:left}.class-student-sheet th{background:#edf5ee;color:#365d40;font-size:12px}.class-student-sheet th:first-child,.class-student-sheet td:first-child{width:76px;text-align:center}.class-student-sheet input,.class-student-sheet select{width:100%;min-width:0}.class-sheet-roll{display:inline-grid;place-items:center;min-width:36px;min-height:34px;border-radius:9px;background:#edf5ee;color:#356b45;font-weight:850}.class-admin-error{padding:10px 12px;border-radius:10px;background:#fff3ed;color:#984b36;font-size:13px}.class-admin-empty{padding:18px;border:1px dashed var(--border);border-radius:12px;text-align:center;color:var(--muted);font-size:13px}.class-student-list{display:grid;gap:10px}.class-student-card{padding:14px;border:1px solid #dce9df;border-radius:15px;background:var(--surface)}.class-student-head{display:flex;justify-content:space-between;gap:12px}.class-student-head small{display:block;color:var(--muted);font-size:12px;margin-top:4px}.class-student-info{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}.class-student-info div{padding:9px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);min-width:0}.class-student-info span{display:block;color:var(--muted);font-size:11px}.class-student-info b{display:block;margin-top:3px;font-size:13px;overflow-wrap:anywhere}.class-secret{background:#fff8e9!important;border-color:#eadbb7!important}.class-edit-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}.class-edit-form button{grid-column:1/-1;justify-self:start}@media(max-width:640px){.class-admin-grid{grid-template-columns:1fr}.class-admin-panel{padding:11px}.class-student-sheet,.class-student-sheet tbody{display:block;width:100%}.class-student-sheet thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.class-student-sheet tr{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:10px;border-bottom:1px solid var(--border)}.class-student-sheet td{display:grid;grid-template-columns:70px minmax(0,1fr);align-items:center;gap:6px;padding:0;border:0}.class-student-sheet td:before{content:attr(data-label);font-size:11px;color:var(--muted)}.class-student-sheet td:first-child,.class-student-sheet td:not(:first-child){grid-column:1/-1}.class-student-info,.class-edit-form{grid-template-columns:1fr}}'+
 '</style><div class="class-admin"><header class="class-admin-hero"><div><div class="class-admin-kicker">MPMPS SCHOOL · ACADEMIC STRUCTURE</div><h3>'+T("తరగతుల నిర్వహణ","Class Management")+'</h3><p>'+T("తరగతిని ఎంచుకుని విద్యార్థుల రిజిస్టర్ పూర్తి చేసి Submit Class చేయండి.","Choose a class, complete the student register and submit the class.")+'</p></div></header>'+
 '<div class="class-admin-grid">'+classes.map(n=>'<button type="button" class="class-admin-tile" data-class-open="class-'+n+'" aria-expanded="false"><span class="class-admin-number">'+String(n).padStart(2,"0")+'</span><span><strong>'+T(n+"వ తరగతి","Class "+n)+'</strong><small>'+T("తరగతి రిజిస్టర్ తెరవండి","Open class register")+'</small></span></button>').join("")+'</div>'+
 '<section class="class-admin-panel" id="classStudentPanel" hidden><div class="class-admin-panel-head"><h4 id="classStudentTitle"></h4><span id="classStudentStatus" class="class-admin-status" role="status" aria-live="polite"></span></div>'+
 '<div id="classStrengthSetup" class="class-strength-setup"><label for="classStrengthInput">'+T("తరగతి మొత్తం Strength","Total Class Strength")+'</label><div class="class-strength-controls"><input id="classStrengthInput" type="number" min="1" max="99" inputmode="numeric" placeholder="e.g. 35"><button type="button" class="btn" id="createClassSheet">'+T("Create Class Sheet","Create Class Sheet")+'</button></div><small>'+T("1 నుంచి 99 మధ్య నమోదు చేయండి. ఇప్పటికే నమోదైన విద్యార్థుల వివరాలు అలాగే ఉంటాయి.","Enter 1–99. Existing student records are preserved.")+'</small></div>'+
 '<div id="classSheetWorkspace" class="class-sheet-workspace" hidden><div class="class-sheet-toolbar"><p id="classSheetSummary"></p><button type="button" class="btn" id="submitClass">'+T("Submit Class","Submit Class")+'</button></div><div class="class-sheet-wrap"><table class="class-student-sheet"><thead><tr><th>Roll No.</th><th>'+T("విద్యార్థి పేరు","Student Name")+'</th><th>'+T("లింగం","Gender")+'</th><th>'+T("పుట్టిన తేదీ","Date of Birth")+'</th></tr></thead><tbody id="studentEntryRows"></tbody></table></div></div>'+
 '<div id="classStudentList" class="class-student-list"></div></section></div>';
}

export async function bindClassManagement({main,T,escapeHtml}){
 const panel=main.querySelector("#classStudentPanel"),title=main.querySelector("#classStudentTitle"),status=main.querySelector("#classStudentStatus"),list=main.querySelector("#classStudentList"),rowsBox=main.querySelector("#studentEntryRows");
 if(!panel||!rowsBox)return;
 let activeClassId="",targetStrength=0,existingCount=0;
 const esc=v=>escapeHtml(String(v??""));
 const say=(message,bad=false)=>{status.textContent=message;status.className=bad?"class-admin-error":"class-admin-status";};
 const dobText=v=>/^\d{8}$/.test(String(v||""))?String(v).slice(0,2)+"/"+String(v).slice(2,4)+"/"+String(v).slice(4):String(v||"");
 const strengthSetup=main.querySelector("#classStrengthSetup"),workspace=main.querySelector("#classSheetWorkspace"),strengthInput=main.querySelector("#classStrengthInput"),summary=main.querySelector("#classSheetSummary");
 const renderStudents=students=>{
  if(!students.length){list.innerHTML='<div class="class-admin-empty">'+T("ఇంకా విద్యార్థులు నమోదు కాలేదు.","No students registered yet.")+'</div>';return;}
  list.innerHTML='<h4>'+T("విద్యార్థుల జాబితా · Edit / Update","Student Register · Edit / Update")+'</h4>'+students.map(st=>'<article class="class-student-card"><div class="class-student-head"><div><strong>'+esc(st.name)+'</strong><small>Student ID: '+esc(st.studentId)+' · Roll No. '+esc(st.rollNumber)+'</small></div><span>'+T("నమోదైంది","Registered")+'</span></div><div class="class-student-info"><div><span>'+T("లింగం","Gender")+'</span><b>'+esc(T(st.gender==="Male"?"పురుషుడు":st.gender==="Female"?"స్త్రీ":"ఇతర",st.gender))+'</b></div><div><span>'+T("పుట్టిన తేదీ","Date of Birth")+'</span><b>'+esc(dobText(st.dob))+'</b></div><div class="class-secret"><span>Permanent Secret Code · Head Master Only</span><b>'+esc(st.secretCode||"—")+'</b></div></div><button type="button" class="btn secondary" data-edit-student="'+esc(st.studentRecordId)+'">'+T("Edit Student","Edit Student")+'</button><form class="class-edit-form" data-edit-form="'+esc(st.studentRecordId)+'" hidden><input name="name" maxlength="100" required value="'+esc(st.name)+'"><select name="gender" required><option value="Male" '+(st.gender==="Male"?"selected":"")+'>'+T("పురుషుడు","Male")+'</option><option value="Female" '+(st.gender==="Female"?"selected":"")+'>'+T("స్త్రీ","Female")+'</option><option value="Other" '+(st.gender==="Other"?"selected":"")+'>'+T("ఇతర","Other")+'</option></select><input name="dob" required maxlength="10" placeholder="DD/MM/YYYY" value="'+esc(dobText(st.dob))+'"><button class="btn" type="submit">'+T("Update Student","Update Student")+'</button></form></article>').join("");
 };
 const refresh=async()=>{
  const [sr,cr]=await Promise.all([listClassStudents(activeClassId),listClassrooms()]);
  const students=sr.students||[],record=(cr.classrooms||[]).find(item=>item.classId===activeClassId);
  existingCount=students.length;renderStudents(students);return {students,record};
 };
 const loadClass=async classId=>{
  activeClassId=classId;targetStrength=0;existingCount=0;panel.hidden=false;workspace.hidden=true;strengthSetup.hidden=false;rowsBox.innerHTML="";strengthInput.value="";
  title.textContent=T(classId.slice(-1)+"వ తరగతి","Class "+classId.slice(-1));say(T("వివరాలు లోడ్ అవుతున్నాయి…","Loading records…"));
  list.innerHTML='<div class="class-admin-empty">'+T("లోడ్ అవుతోంది…","Loading…")+'</div>';
  main.querySelectorAll("[data-class-open]").forEach(btn=>btn.setAttribute("aria-expanded",String(btn.dataset.classOpen===classId)));
  try{const {students,record}=await refresh();strengthInput.value=String(record?.strength||Math.max(1,students.length));say(T("నమోదైన విద్యార్థులు: ","Registered students: ")+students.length+(record?.status==="complete"?" · "+T("Class Created","Class Created"):""));}
  catch(error){say(error.message||T("డేటా లోడ్ కాలేదు.","Could not load data."),true);}
  panel.scrollIntoView({behavior:"smooth",block:"start"});
 };
 main.querySelectorAll("[data-class-open]").forEach(btn=>btn.onclick=()=>loadClass(btn.dataset.classOpen));
 main.querySelector("#createClassSheet").onclick=()=>{
  const strength=Number(strengthInput.value);
  if(!Number.isInteger(strength)||strength<1||strength>99){say(T("1 నుంచి 99 మధ్య సరైన Strength నమోదు చేయండి.","Enter a valid strength from 1 to 99."),true);return;}
  if(strength<existingCount){say(T("Strength ఇప్పటికే నమోదైన విద్యార్థుల సంఖ్య కంటే తక్కువగా ఉండకూడదు.","Strength cannot be lower than registered students."),true);return;}
  targetStrength=strength;rowsBox.innerHTML="";
  for(let i=0;i<targetStrength-existingCount;i++){
   const roll=String(existingCount+i+1).padStart(2,"0");
   rowsBox.insertAdjacentHTML("beforeend",'<tr><td data-label="Roll No."><span class="class-sheet-roll">'+roll+'</span></td><td data-label="'+T("పేరు","Name")+'"><input data-student-name maxlength="100" required></td><td data-label="'+T("లింగం","Gender")+'"><select data-student-gender required><option value="">'+T("ఎంచుకోండి","Select")+'</option><option value="Male">'+T("పురుషుడు","Male")+'</option><option value="Female">'+T("స్త్రీ","Female")+'</option><option value="Other">'+T("ఇతర","Other")+'</option></select></td><td data-label="'+T("పుట్టిన తేదీ","DOB")+'"><input data-student-dob required maxlength="10" inputmode="numeric" placeholder="DD/MM/YYYY"></td></tr>');
  }
  summary.textContent=T("మొత్తం Strength: ","Total Strength: ")+targetStrength+" · "+T("ఇప్పటికే నమోదు: ","Already registered: ")+existingCount+" · "+T("కొత్త Rows: ","New rows: ")+(targetStrength-existingCount);
  workspace.hidden=false;strengthSetup.hidden=true;say(T("అన్ని Rows పూర్తి చేసి Submit Class నొక్కండి.","Complete every row and click Submit Class."));
 };
 main.querySelector("#submitClass").onclick=async()=>{
  if(!activeClassId||!targetStrength)return;
  const entries=[...rowsBox.querySelectorAll("tr")].map(row=>({name:row.querySelector("[data-student-name]").value.trim(),gender:row.querySelector("[data-student-gender]").value,dob:row.querySelector("[data-student-dob]").value.trim()}));
  if(entries.length!==targetStrength-existingCount||entries.some(r=>r.name.length<2||!["Male","Female","Other"].includes(r.gender)||!/^\d{2}\/\d{2}\/\d{4}$/.test(r.dob))){say(T("ప్రతి Rowలో పేరు, లింగం, సరైన DD/MM/YYYY పుట్టిన తేదీ నమోదు చేయండి.","Every row needs a name, gender and valid DD/MM/YYYY date of birth."),true);return;}
  const button=main.querySelector("#submitClass");button.disabled=true;button.textContent=T("తరగతి నమోదు అవుతోంది…","Submitting class…");
  try{
   const response=entries.length?await createClassStudents(activeClassId,entries):{created:[],failed:[]};
   const created=response.created||[],failed=response.failed||[];
   // Use the exact values returned by the Firestore transaction. Do not depend
   // on a second read to reveal Student ID, Roll Number or the one-time Secret Code.
   const createdStudents=created.map(item=>({
    studentRecordId:item.studentRecordId,studentId:item.studentId,rollNumber:item.rollNumber,
    secretCode:item.secretCode,...entries[item.index]
   }));
   const totalRegistered=existingCount+createdStudents.length;
   existingCount=totalRegistered;
   const currentStudents=[...createdStudents];
   renderStudents(currentStudents);
   const saved=await saveClassDetails(activeClassId,targetStrength,totalRegistered);
   if(failed.length){
    rowsBox.innerHTML="";
    for(let failedIndex=0;failedIndex<failed.length;failedIndex++){const item=failed[failedIndex],r=entries[item.index],roll=String(students.length+failedIndex+1).padStart(2,"0");rowsBox.insertAdjacentHTML("beforeend",'<tr><td><span class="class-sheet-roll">'+roll+'</span></td><td><input data-student-name value="'+esc(r.name)+'"></td><td><select data-student-gender><option value="Male" '+(r.gender==="Male"?"selected":"")+' >Male</option><option value="Female" '+(r.gender==="Female"?"selected":"")+' >Female</option><option value="Other" '+(r.gender==="Other"?"selected":"")+' >Other</option></select></td><td><input data-student-dob value="'+esc(r.dob)+'" maxlength="10"></td></tr>');}
    say(T("కొన్ని Rows సేవ్ కాలేదు. ఇప్పటికే సృష్టించిన విద్యార్థుల Student ID, Roll Number, Secret Code క్రింద చూపించబడ్డాయి. మిగిలిన Rows మళ్లీ Submit చేయండి.","Some rows failed. Generated Student IDs, Roll Numbers and Secret Codes for successful rows are shown below. Submit the remaining rows again."),true);
   }else{
    workspace.hidden=true;strengthSetup.hidden=false;strengthInput.value=String(targetStrength);
    say(saved.status==="complete"?T("Class Created Successfully","Class Created Successfully"):T("విద్యార్థులు సేవ్ అయ్యారు. మిగిలిన Strength పూర్తి చేయండి.","Students saved. Complete the remaining strength."),saved.status!=="complete");
   }
  }catch(error){say(error.message||T("Class Submit కాలేదు.","Class submission failed."),true);}
  finally{button.disabled=false;button.textContent=T("Submit Class","Submit Class");}
 };
 list.addEventListener("click",event=>{
  const btn=event.target.closest("[data-edit-student]");if(!btn)return;
  const form=list.querySelector('[data-edit-form="'+CSS.escape(btn.dataset.editStudent)+'"]');if(form)form.hidden=!form.hidden;
 });
 list.addEventListener("submit",async event=>{
  const form=event.target.closest("[data-edit-form]");if(!form)return;event.preventDefault();
  const btn=form.querySelector("button[type=submit]");btn.disabled=true;
  try{await updateClassStudent(form.dataset.editForm,{name:form.elements.name.value,gender:form.elements.gender.value,dob:form.elements.dob.value});await refresh();say(T("విద్యార్థి వివరాలు Update అయ్యాయి.","Student details updated."));}
  catch(error){say(error.message||T("Update కాలేదు.","Update failed."),true);}
  finally{btn.disabled=false;}
 });
}
