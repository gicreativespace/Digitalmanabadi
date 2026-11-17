// Parent-only linking workflow. Current student verification remains a local preview.
export function createParentSection({main,state,render,toast,escapeHtml}) {
function linking(){
 main.innerHTML=`<div class="backline"><button class="btn secondary" id="linkBack">← వెనక్కి</button></div><section class="form-card"><div class="login-symbol">♧</div><h2>Parent–Student Linking</h2><p>విద్యార్థి వివరాలను నిర్ధారించి మీ Parent PIN సెట్ చేసుకోండి.</p>
 <div class="stepper"><span class="active">1. వివరాలు</span><span>2. DOB</span><span>3. PIN</span></div>
 <div class="field"><label>Class / తరగతి</label><select id="linkClass"><option value="">తరగతి ఎంచుకోండి</option>${Array.from({length:10},(_,i)=>'<option>Class '+(i+1)+'</option>').join("")}</select></div>
 <div class="field"><label>Student ID</label><input id="studentId" placeholder="Student ID"></div>
 <div class="field"><label>Roll Number</label><input id="rollNo" placeholder="Roll Number"></div>
 <button class="btn full" id="verifyStudent">విద్యార్థి వివరాలు నిర్ధారించు</button>
 <div id="studentVerifyArea"></div></section>`;
 document.querySelector("#linkBack").onclick=()=>{state.view="login";render()};
 document.querySelector("#verifyStudent").onclick=()=>{
  const cls=document.querySelector("#linkClass").value,id=document.querySelector("#studentId").value.trim(),roll=document.querySelector("#rollNo").value.trim();
  if(!cls||!id||!roll){toast("Class, Student ID, Roll Number నమోదు చేయండి.");return}
  document.querySelector("#studentVerifyArea").innerHTML=`<div class="verified-student"><strong>విద్యార్థి వివరాలు</strong><p>డెమో విద్యార్థి • ${cls} • Roll No: ${escapeHtml(roll)}</p><div class="field"><label>Date of Birth</label><input id="studentDob" type="date"></div><div class="field"><label>మీ 4-digit Parent PIN సెట్ చేయండి</label><input id="newParentPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><div class="field"><label>Confirm Parent PIN</label><input id="confirmParentPin" type="password" inputmode="numeric" maxlength="4" placeholder="మళ్లీ PIN నమోదు చేయండి"></div><button class="btn full" id="completeLink">Confirm & Link Parent</button></div>`;
  document.querySelector("#completeLink").onclick=()=>{
   const dob=document.querySelector("#studentDob").value,pin=document.querySelector("#newParentPin").value,confirm=document.querySelector("#confirmParentPin").value;
   if(!dob||!/^[0-9]{4}$/.test(pin)||pin!==confirm){toast("DOB నమోదు చేసి ఒకే 4-digit PIN రెండుసార్లు నమోదు చేయండి.");return}
   state.linkedStudent={id,roll,className:cls,pin};state.parentLinked=true;toast("Parent Linking పూర్తయింది.");state.view="login";render();
  };
 };
}
  return { renderLinking: linking };
}

export function renderParentDashboardIntro({state,escapeHtml}) {
 if(state.role!=="parent") return "";
 return '<section class="feature-card blue parent-student"><div class="card-icon">♙</div><div><h3>లింక్ చేసిన విద్యార్థి</h3><p>'+(state.linkedStudent?escapeHtml(state.linkedStudent.className+" • Roll "+state.linkedStudent.roll):"విద్యార్థి వివరాలు")+'</p></div></section>';
}
