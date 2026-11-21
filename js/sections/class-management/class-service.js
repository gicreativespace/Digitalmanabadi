import { auth, db } from "../../firebase-client.js";
import { collection, doc, getDoc, getDocs, query, where, runTransaction, serverTimestamp, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const CLASSES = new Set(["class-1","class-2","class-3","class-4","class-5"]);
const text = value => String(value ?? "").trim();
function normalizeDob(value) {
  const raw=text(value).replaceAll("/","");
  if(!/^\d{8}$/.test(raw)) throw new Error("Enter DOB in DD/MM/YYYY format.");
  const day=Number(raw.slice(0,2)),month=Number(raw.slice(2,4)),year=Number(raw.slice(4));
  const date=new Date(year,month-1,day);
  if(year<1900||date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day||date>new Date()) throw new Error("Enter a valid date of birth.");
  return raw;
}
function academicYearCode(){
  const parts=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",year:"2-digit"}).format(new Date());
  return parts;
}
function randomSecretCode(){
  const bytes=crypto.getRandomValues(new Uint32Array(1));
  return String(100000000000n + (BigInt(bytes[0]) * 900000000000n / 4294967296n)).padStart(12,"0");
}
async function sha256(value){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(value)));
  return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,"0")).join("");
}
async function requireHeadMaster(){
  const user=auth.currentUser;
  if(!user) throw new Error("Sign in as Head Master to continue.");
  const snap=await getDoc(doc(db,"platformAdmins",user.uid));
  if(!snap.exists()) throw new Error("Active Head Master access is required.");
  const profile=snap.data();
  if(profile.role!=="HEAD_MASTER"||profile.status!=="active"||!profile.schoolId) throw new Error("Active Head Master access is required.");
  return {uid:user.uid,schoolId:profile.schoolId};
}
export async function listClassrooms(){
  const hm=await requireHeadMaster();
  const result=[];
  for(let n=1;n<=5;n++){
    const id="class-"+n,snap=await getDoc(doc(db,"classrooms",hm.schoolId+"_"+id));
    result.push({classId:id,classNumber:n,exists:snap.exists(),...(snap.exists()?snap.data():{})});
  }
  return {classrooms:result};
}
export async function listClassStudents(classId){
  if(!CLASSES.has(classId)) throw new Error("Choose a valid class.");
  const hm=await requireHeadMaster();
  const q=query(collection(db,"students"),where("schoolId","==",hm.schoolId),where("classId","==",classId));
  const snap=await getDocs(q),students=[];
  for(const item of snap.docs){
    const data=item.data();
    const secret=await getDoc(doc(db,"studentSecrets",item.id));
    students.push({studentRecordId:item.id,...data,secretCode:secret.exists()?secret.data().secretCode:""});
  }
  students.sort((a,b)=>Number(a.rollNumber)-Number(b.rollNumber));
  return {students};
}
export async function createClassStudent(classId,payload){
  if(!CLASSES.has(classId)) throw new Error("Choose a valid class.");
  const hm=await requireHeadMaster();
  const name=text(payload.name).slice(0,100),gender=text(payload.gender),dob=normalizeDob(payload.dob);
  if(name.length<2||!["Male","Female","Other"].includes(gender)) throw new Error("Enter all required student details.");
  const classNumber=Number(classId.slice(-1)),year=academicYearCode(),recordRef=doc(collection(db,"students"));
  const secretCode=randomSecretCode(),secretCodeHash=await sha256(secretCode);
  const counterId=hm.schoolId+"_"+year+"_"+classId,counterRef=doc(db,"studentCounters",counterId);
  const lookupRefBase="studentLookup/";
  let created;
  await runTransaction(db,async tx=>{
    const counter=await tx.get(counterRef),roll=Number(counter.exists()?counter.data().lastRoll||0:0)+1;
    if(roll>99) throw new Error("This class sequence is full for the current academic year.");
    const rollNumber=String(roll).padStart(2,"0"),studentId=year+String(classNumber).padStart(2,"0")+rollNumber;
    const studentRef=recordRef,secretRef=doc(db,"studentSecrets",recordRef.id),lookupRef=doc(db,"studentLookup",studentId);
    const lookup=await tx.get(lookupRef);
    if(lookup.exists()) throw new Error("Student ID already exists. Please retry.");
    tx.set(studentRef,{studentRecordId:recordRef.id,schoolId:hm.schoolId,classId,classNumber,rollNumber,studentId,academicYear:year,name,gender,dob,status:"active",createdBy:hm.uid,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
    tx.set(secretRef,{schoolId:hm.schoolId,studentRecordId:recordRef.id,secretCode,secretCodeHash,createdAt:serverTimestamp()});
    tx.set(lookupRef,{studentRecordId:recordRef.id,studentId,classId,rollNumber,schoolId:hm.schoolId,status:"active"});
    tx.set(counterRef,{lastRoll:roll,schoolId:hm.schoolId,classId,academicYear:year,updatedAt:serverTimestamp()},{merge:true});
    tx.set(doc(db,"classrooms",hm.schoolId+"_"+classId),{schoolId:hm.schoolId,classId,classNumber,updatedBy:hm.uid,updatedAt:serverTimestamp()},{merge:true});
    created={studentRecordId:recordRef.id,studentId,rollNumber,secretCode};
  });
  return {student:created};
}


// Save a class register row-by-row through the existing transactional student
// creation path. Successful rows are retained if another row fails.
export async function createClassStudents(classId, entries){
  if(!Array.isArray(entries)||!entries.length) throw new Error("Add at least one student.");
  const created=[],failed=[];
  for(let index=0;index<entries.length;index++){
    try{
      const result=await createClassStudent(classId,entries[index]);
      created.push({...result.student,index});
    }catch(error){
      failed.push({index,payload:entries[index],message:error?.message||"Could not create student."});
    }
  }
  return {created,failed};
}


// Persist class strength and lifecycle only after the register submission attempt.
// Existing student identity, roll allocation, Secret Code and parent-link records are untouched.
export async function saveClassDetails(classId, strength, registeredCount){
  if(!CLASSES.has(classId)) throw new Error("Choose a valid class.");
  if(!Number.isInteger(strength)||strength<1||strength>99||!Number.isInteger(registeredCount)||registeredCount<0||registeredCount>strength) throw new Error("Enter a valid class strength.");
  const hm=await requireHeadMaster(),classNumber=Number(classId.slice(-1));
  const complete=registeredCount===strength;
  await setDoc(doc(db,"classrooms",hm.schoolId+"_"+classId),{
    schoolId:hm.schoolId,classId,classNumber,strength,registeredCount,
    status:complete?"complete":"draft",updatedBy:hm.uid,updatedAt:serverTimestamp(),
    ...(complete?{completedAt:serverTimestamp()}:{})
  },{merge:true});
  return {classId,strength,registeredCount,status:complete?"complete":"draft"};
}

export async function updateClassStudent(studentRecordId, payload){
  const hm=await requireHeadMaster();
  const name=text(payload.name).slice(0,100),gender=text(payload.gender),dob=normalizeDob(payload.dob);
  if(name.length<2||!["Male","Female","Other"].includes(gender)) throw new Error("Enter all required student details.");
  const studentRef=doc(db,"students",String(studentRecordId||""));
  const snap=await getDoc(studentRef);
  if(!snap.exists()||snap.data().schoolId!==hm.schoolId) throw new Error("Student record was not found in this school.");
  await updateDoc(studentRef,{name,gender,dob,updatedAt:serverTimestamp()});
  return {studentRecordId:String(studentRecordId),name,gender,dob};
}
