// Parent-only linking workflow. Current student verification remains a local preview.
export function createParentSection({main,state,T,render,toast,escapeHtml}) {
const t=(te,en)=>T?T(te,en):te;
function linking(){
 main.innerHTML='<div class="backline"><button class="btn secondary" id="linkBack">← '+t("వెనక్కి","Back")+'</button></div><section class="form-card"><div class="login-symbol">♧</div><h2>'+t("తల్లిదండ్రి – విద్యార్థి అనుసంధానం","Parent–Student Linking")+'</h2><p>'+t("విద్యార్థి వివరాలను నిర్ధారించి మీ Parent PIN సెట్ చేసుకోండి.","Verify student details and set your Parent PIN.")+'</p>'+
 '<div class="stepper"><span class="active">'+t("1. వివరాలు","1. Details")+'</span><span>'+t("2. పుట్టిన తేదీ","2. Date of Birth")+'</span><span>'+t("3. పిన్","3. PIN")+'</span></div>'+
 '<div class="field"><label>'+t("తరగతి","Class")+'</label><select id="linkClass"><option value="">'+t("తరగతి ఎంచుకోండి","Choose a class")+'</option>'+Array.from({length:10},(_,i)=>'<option>Class '+(i+1)+'</option>').join("")+'</select></div>'+
 '<div class="field"><label>Student ID</label><input id="studentId" placeholder="Student ID"></div><div class="field"><label>'+t("రోల్ నంబర్","Roll Number")+'</label><input id="rollNo" placeholder="'+t("రోల్ నంబర్","Roll Number")+'"></div>'+
 '<button class="btn full" id="verifyStudent">'+t("విద్యార్థి వివరాలు నిర్ధారించండి","Verify Student Details")+'</button><div id="studentVerifyArea"></div></section>';
 document.querySelector("#linkBack").onclick=()=>{state.view="login";render()};
 document.querySelector("#verifyStudent").onclick=()=>{
  const cls=document.querySelector("#linkClass").value,id=document.querySelector("#studentId").value.trim(),roll=document.querySelector("#rollNo").value.trim();
  if(!cls||!id||!roll){toast(t("తరగతి, Student ID, Roll Number నమోదు చేయండి.","Enter the class, Student ID and Roll Number."));return}
  document.querySelector("#studentVerifyArea").innerHTML='<div class="verified-student"><strong>'+t("విద్యార్థి వివరాలు","Student Details")+'</strong><p>'+t("నమూనా విద్యార్థి","Demo Student")+' • '+cls+' • '+t("రోల్ నంబర్","Roll Number")+': '+escapeHtml(roll)+'</p><div class="field"><label>'+t("పుట్టిన తేదీ","Date of Birth")+'</label><input id="studentDob" type="date"></div><div class="field"><label>'+t("మీ 4 అంకెల Parent PIN సెట్ చేయండి","Set your 4-digit Parent PIN")+'</label><input id="newParentPin" type="password" inputmode="numeric" maxlength="4" placeholder="4-digit PIN"></div><div class="field"><label>'+t("Parent PIN నిర్ధారించండి","Confirm Parent PIN")+'</label><input id="confirmParentPin" type="password" inputmode="numeric" maxlength="4" placeholder="'+t("మళ్లీ PIN నమోదు చేయండి","Enter PIN again")+'"></div><button class="btn full" id="completeLink">'+t("నిర్ధారించి అనుసంధానించండి","Confirm & Link Parent")+'</button></div>';
  document.querySelector("#completeLink").onclick=()=>{
   const dob=document.querySelector("#studentDob").value,pin=document.querySelector("#newParentPin").value,confirm=document.querySelector("#confirmParentPin").value;
   if(!dob||!/^[0-9]{4}$/.test(pin)||pin!==confirm){toast(t("పుట్టిన తేదీ నమోదు చేసి, ఒకే 4 అంకెల PINను రెండుసార్లు నమోదు చేయండి.","Enter the date of birth and the same 4-digit PIN twice."));return}
   state.linkedStudent={id,roll,className:cls,pin};state.parentLinked=true;toast(t("Parent Linking పూర్తయింది.","Parent linking completed."));state.view="login";render();
  };
 };
}
return {renderLinking:linking};
}
