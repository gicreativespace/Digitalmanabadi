import { findParentStudents, verifyParentStudent, saveParentPin, getParentChildren } from "./parent-service.js";
import { auth } from "../../firebase-client.js";

export function createParentSection({main,state,T,render,toast,escapeHtml}) {
 const t=(te,en)=>T?T(te,en):te;
 const esc=value=>escapeHtml?escapeHtml(String(value??"")):String(value??"");
 function linking(){
  main.innerHTML='<div class="backline"><button class="btn secondary" id="linkBack">← '+t("వెనక్కి","Back")+'</button></div><section class="form-card"><div class="login-symbol">♧</div><h2>'+t("తల్లిదండ్రి – విద్యార్థి అనుసంధానం","Parent–Student Verification")+'</h2><p>'+t("మీ నమోదిత మొబైల్ నంబర్‌తో పిల్లల వివరాలను కనుగొని, పుట్టిన తేదీ మరియు Permanent Secret Codeతో నిర్ధారించండి.","Find your child using the registered mobile number, then verify with date of birth and Permanent Secret Code.")+'</p>'+
  '<div class="stepper"><span class="active">'+t("1. మొబైల్","1. Mobile")+'</span><span>'+t("2. ధృవీకరణ","2. Verification")+'</span><span>'+t("3. PIN","3. PIN")+'</span></div>'+
  '<div class="field"><label>'+t("నమోదిత Parent Mobile Number","Registered Parent Mobile Number")+'</label><input id="parentVerifyMobile" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel" placeholder="'+t("10 అంకెల మొబైల్ నంబర్","10-digit mobile number")+'"></div>'+
  '<button class="btn full" id="findParentStudents">'+t("నా పిల్లల వివరాలు చూపించండి","Find My Children")+'</button><div id="parentStudentChoices"></div><div id="parentVerifyStatus" role="status" aria-live="polite"></div></section>';
  const status=main.querySelector("#parentVerifyStatus"),choices=main.querySelector("#parentStudentChoices");
  const say=(message,error=false)=>{status.className=error?"class-admin-error":"class-admin-status";status.textContent=message;};
  main.querySelector("#linkBack").onclick=()=>{state.view="login";render()};
  main.querySelector("#findParentStudents").onclick=async()=>{
   const mobile=main.querySelector("#parentVerifyMobile").value.trim(),button=main.querySelector("#findParentStudents");
   if(!/^\\d{10}$/.test(mobile)){say(t("సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.","Enter a valid 10-digit mobile number."),true);return;}
   button.disabled=true;button.textContent=t("విద్యార్థుల వివరాలు వెతుకుతోంది…","Finding students…");choices.innerHTML="";
   try{
    const result=await findParentStudents(mobile),students=result.students||[];
    if(!students.length){say(t("ఈ మొబైల్ నంబర్‌కు విద్యార్థుల వివరాలు అందుబాటులో లేవు. పాఠశాలను సంప్రదించండి.","No student records are available for this mobile number. Please contact the school."),true);return;}
    say(t("మీ పిల్లల్లో ఒకరిని ఎంచుకోండి.","Select one of your children."));
    choices.innerHTML='<div class="field"><label>'+t("విద్యార్థిని ఎంచుకోండి","Select Student")+'</label><select id="parentStudentChoice"><option value="">'+t("ఎంచుకోండి","Choose")+'</option>'+students.map(s=>'<option value="'+esc(s.studentRecordId)+'">'+esc(s.name)+' · '+esc(s.classId)+' · '+t("రోల్","Roll")+' '+esc(s.rollNumber)+'</option>').join("")+'</select></div>'+
    '<div class="field"><label>'+t("పుట్టిన తేదీ (DD/MM/YYYY)","Date of Birth (DD/MM/YYYY)")+'</label><input id="parentStudentDob" inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY"></div>'+
    '<div class="field"><label>'+t("Permanent Secret Code","Permanent Secret Code")+'</label><input id="parentSecretCode" type="password" inputmode="numeric" maxlength="12" autocomplete="off" placeholder="'+t("12 అంకెల Secret Code","12-digit Secret Code")+'"></div>'+
    '<button class="btn full" id="verifyParentStudent">'+t("ధృవీకరించి అనుసంధానించండి","Verify & Link Child")+'</button>';
    choices.querySelector("#verifyParentStudent").onclick=async()=>{
     const studentRecordId=choices.querySelector("#parentStudentChoice").value,dob=choices.querySelector("#parentStudentDob").value.trim(),secretCode=choices.querySelector("#parentSecretCode").value.trim(),verifyButton=choices.querySelector("#verifyParentStudent");
     if(!studentRecordId||!dob||!/^\\d{12}$/.test(secretCode)){say(t("విద్యార్థి, పుట్టిన తేదీ మరియు 12 అంకెల Secret Code నమోదు చేయండి.","Select a student and enter the date of birth and 12-digit Secret Code."),true);return;}
     verifyButton.disabled=true;verifyButton.textContent=t("ధృవీకరిస్తోంది…","Verifying…");
     try{
      await verifyParentStudent({mobile,studentRecordId,dob,secretCode});
      const user=auth.currentUser;if(!user)throw new Error("Parent session could not be started.");
      if(!localStorage.getItem("gim_parent_pin_v1:"+user.uid)){
       choices.innerHTML='<div class="field"><label>'+t("మీ 4 అంకెల Parent PIN సెట్ చేయండి","Set your 4-digit Parent PIN")+'</label><input id="newParentPin" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password"></div>'+
       '<div class="field"><label>'+t("Parent PIN నిర్ధారించండి","Confirm Parent PIN")+'</label><input id="confirmParentPin" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password"></div>'+
       '<button class="btn full" id="saveParentPin">'+t("PIN సేవ్ చేసి కొనసాగించండి","Save PIN & Continue")+'</button>';
       choices.querySelector("#saveParentPin").onclick=async()=>{
        const pin=choices.querySelector("#newParentPin").value,confirm=choices.querySelector("#confirmParentPin").value,save=choices.querySelector("#saveParentPin");
        if(!/^\\d{4}$/.test(pin)||pin!==confirm){say(t("ఒకే 4 అంకెల PINను రెండుసార్లు నమోదు చేయండి.","Enter the same 4-digit PIN twice."),true);return;}
        save.disabled=true;save.textContent=t("సేవ్ చేస్తోంది…","Saving…");
        try{await saveParentPin(user.uid,pin);await finishParentLogin(mobile);}
        catch(error){say(error.message||t("PIN సేవ్ కాలేదు.","Could not save PIN."),true);save.disabled=false;save.textContent=t("PIN సేవ్ చేసి కొనసాగించండి","Save PIN & Continue");}
       };
      }else{
       await finishParentLogin(mobile);
      }
     }catch(error){
      say(error.message||t("విద్యార్థి వివరాలు ధృవీకరించలేకపోయాం.","Could not verify student details."),true);
      verifyButton.disabled=false;verifyButton.textContent=t("మళ్లీ ప్రయత్నించండి","Try Again");
     }
    };
   }catch(error){say(error.message||t("వివరాలు పొందలేకపోయాం.","Could not retrieve student details."),true);}
   finally{button.disabled=false;button.textContent=t("నా పిల్లల వివరాలు చూపించండి","Find My Children");}
  };
 }
 async function finishParentLogin(mobile){
  const children=await getParentChildren();
  state.parentChildren=children;
  state.linkedStudent=children[0]||null;
  state.parentMobile=String(mobile).replace(/\\D/g,"").slice(-10);
  state.parentLinked=children.length>0;
  state.authenticated=children.length>0;
  if(!state.authenticated)throw new Error(t("ఇంకా విద్యార్థులు అనుసంధానం కాలేదు.","No linked students were found."));
  localStorage.setItem("gim_role","parent");
  localStorage.setItem("gim_authenticated","true");
  state.view="dashboard";
  toast(t("Parent Verification పూర్తయింది.","Parent verification completed."));
  render();
 }
 return {renderLinking:linking,finishParentLogin};
}
