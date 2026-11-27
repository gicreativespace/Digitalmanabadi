import { auth, db } from "../../firebase-client.js";
import { collection, doc, getDoc, getDocs, query, where, runTransaction, serverTimestamp, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, getAuth, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

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
export function getStudentLoginId(studentId){return String(studentId)+"@dagguluruschool.in";}
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
    const data=snap.exists()?snap.data():{};
    result.push({classId:id,classNumber:n,exists:snap.exists(),sections:Array.isArray(data.sections)?data.sections:[],classTeacherId:data.classTeacherId||"",classTeacherName:data.classTeacherName||"",...data});
  }
  return {classrooms:result};
}
export async function listClassStudents(classId, sectionFilter=""){
  if(!CLASSES.has(classId)) throw new Error("Choose a valid class.");
  const hm=await requireHeadMaster();
  const q=query(collection(db,"students"),where("schoolId","==",hm.schoolId),where("classId","==",classId));
  const snap=await getDocs(q),students=[];
  for(const item of snap.docs){
    const data=item.data();
    const secret=await getDoc(doc(db,"studentSecrets",item.id));
    students.push({studentRecordId:item.id,...data,secretCode:secret.exists()?secret.data().secretCode:"",loginId:data.loginId||getStudentLoginId(data.studentId)});
  }
  const filtered=sectionFilter?students.filter(student=>(student.section||"")===sectionFilter):students;
  filtered.sort((a,b)=>Number(a.rollNumber)-Number(b.rollNumber));
  return {students:filtered};
}
export async function createClassStudent(classId,payload){
  if(!CLASSES.has(classId)) throw new Error("Choose a valid class.");
  const hm=await requireHeadMaster();
  const name=text(payload.name).slice(0,100),gender=text(payload.gender),dob=normalizeDob(payload.dob);
  if(name.length<2||!["Male","Female","Other"].includes(gender)) throw new Error("Enter all required student details.");
  const classNumber=Number(classId.slice(-1)),year=academicYearCode(),recordRef=doc(collection(db,"students"));
  const secretCode=randomSecretCode(),secretCodeHash=await sha256(secretCode);
  const classroomRef=doc(db,"classrooms",hm.schoolId+"_"+classId);
  const classroomSnapshot=await getDoc(classroomRef);
  const configuredSections=classroomSnapshot.exists()&&Array.isArray(classroomSnapshot.data().sections)?classroomSnapshot.data().sections:[];
  const section=text(payload.section).toUpperCase();
  if(section&&!configuredSections.includes(section)) throw new Error("Choose a section configured for this class.");
  if(configuredSections.length&&!section) throw new Error("Choose a section for every student.");
  const counterId=hm.schoolId+"_"+year+"_"+classId,counterRef=doc(db,"studentCounters",counterId);
  let created;
  await runTransaction(db,async tx=>{
    const latestClassroom=await tx.get(classroomRef);
    const latestSections=latestClassroom.exists()&&Array.isArray(latestClassroom.data().sections)?latestClassroom.data().sections:[];
    if(section&&!latestSections.includes(section)) throw new Error("This section is no longer configured. Refresh the class and try again.");
    if(latestSections.length&&!section) throw new Error("Choose a section for every student.");
    const counter=await tx.get(counterRef),roll=Number(counter.exists()?counter.data().lastRoll||0:0)+1;
    if(roll>99) throw new Error("This class sequence is full for the current academic year.");
    const rollNumber=String(roll).padStart(2,"0"),studentId=year+String(classNumber).padStart(2,"0")+rollNumber;
    const studentRef=recordRef,secretRef=doc(db,"studentSecrets",recordRef.id),lookupRef=doc(db,"studentLookup",studentId);
    const lookup=await tx.get(lookupRef);
    if(lookup.exists()) throw new Error("Student ID already exists. Please retry.");
    tx.set(studentRef,{studentRecordId:recordRef.id,schoolId:hm.schoolId,classId,classNumber,section,rollNumber,studentId,academicYear:year,name,gender,dob,status:"active",createdBy:hm.uid,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
    tx.set(secretRef,{schoolId:hm.schoolId,studentRecordId:recordRef.id,secretCode,secretCodeHash,createdAt:serverTimestamp()});
    tx.set(lookupRef,{studentRecordId:recordRef.id,studentId,classId,section,rollNumber,schoolId:hm.schoolId,status:"active"});
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


export async function updateClassroomSettings(classId, payload={}){
  if(!CLASSES.has(classId)) throw new Error("Choose a valid class.");
  const hm=await requireHeadMaster();
  const classNumber=Number(classId.slice(-1));
  const rawSections=Array.isArray(payload.sections)?payload.sections:String(payload.sections||"").split(",");
  const sections=[...new Set(rawSections.map(value=>text(value).toUpperCase()).filter(Boolean))];
  if(sections.length>12||sections.some(value=>!/^[A-Z0-9]{1,4}$/.test(value))) throw new Error("Use up to 12 section names, each containing 1–4 letters or numbers.");
  const classTeacherId=text(payload.classTeacherId);
  let classTeacherName="";
  if(classTeacherId){
    const teacherSnapshot=await getDoc(doc(db,"teachers",classTeacherId));
    if(!teacherSnapshot.exists()) throw new Error("The selected Class Teacher was not found.");
    const teacher=teacherSnapshot.data();
    if(teacher.status!=="active"||!(teacher.assignedClasses||[]).includes("Class "+classNumber)) throw new Error("Choose an active teacher assigned to this class.");
    classTeacherName=text(teacher.name);
  }
  const studentsSnapshot=await getDocs(query(collection(db,"students"),where("schoolId","==",hm.schoolId),where("classId","==",classId)));
  const invalidExisting=studentsSnapshot.docs.some(item=>{
    const assigned=text(item.data().section).toUpperCase();
    return assigned&&!sections.includes(assigned);
  });
  if(invalidExisting) throw new Error("A section currently has enrolled students. Move those students before removing that section.");
  await setDoc(doc(db,"classrooms",hm.schoolId+"_"+classId),{
    schoolId:hm.schoolId,classId,classNumber,sections,classTeacherId,classTeacherName,
    updatedBy:hm.uid,updatedAt:serverTimestamp()
  },{merge:true});
  return {classId,sections,classTeacherId,classTeacherName};
}

export async function getStudentProfileForAuth(user=auth.currentUser){
  if(!user||!user.email) throw new Error("Student sign-in is required.");
  const match=/^(\d{6})@dagguluruschool\.in$/i.exec(String(user.email));
  if(!match) throw new Error("This account is not a Student Login.");
  const studentId=match[1];
  const lookupSnapshot=await getDoc(doc(db,"studentLookup",studentId));
  if(!lookupSnapshot.exists()) throw new Error("Student profile could not be verified. Contact the Head Master.");
  const lookup=lookupSnapshot.data();
  const studentSnapshot=await getDoc(doc(db,"students",String(lookup.studentRecordId||"")));
  if(!studentSnapshot.exists()) throw new Error("Student profile could not be verified. Contact the Head Master.");
  const student=studentSnapshot.data();
  if(student.studentId!==studentId||student.authUid!==user.uid||student.status!=="active") throw new Error("This Student account is inactive or not linked. Contact the Head Master.");
  return {
    studentRecordId:lookup.studentRecordId,studentId:student.studentId,name:student.name,
    classId:student.classId,classNumber:student.classNumber,section:student.section||"",
    rollNumber:student.rollNumber,academicYear:student.academicYear,schoolId:student.schoolId,
    status:student.status,linked:true
  };
}

export async function createStudentLogin(studentRecordId){
  const hm=await requireHeadMaster();
  const studentRef=doc(db,"students",String(studentRecordId));
  const studentSnapshot=await getDoc(studentRef);
  if(!studentSnapshot.exists()) throw new Error("Student record was not found.");
  const student=studentSnapshot.data();
  if(student.schoolId!==hm.schoolId) throw new Error("This student belongs to another school.");
  if(student.status!=="active") throw new Error("Reactivate this student before creating a login.");
  if(student.authUid||student.loginCreatedAt) throw new Error("A login already exists for this student.");
  const secretSnapshot=await getDoc(doc(db,"studentSecrets",String(studentRecordId)));
  if(!secretSnapshot.exists()) throw new Error("Student Secret Code was not found.");
  const secretCode=String(secretSnapshot.data().secretCode||"");
  if(!/^\d{12}$/.test(secretCode)) throw new Error("The student's Secret Code is invalid. Please contact GI Support.");
  const loginId=getStudentLoginId(student.studentId);
  const secondaryApp=initializeApp(auth.app.options,"student-provision-"+String(studentRecordId)+"-"+crypto.randomUUID());
  const secondaryAuth=getAuth(secondaryApp);
  let createdUser=null,profileLinked=false;
  try{
    try{
      const credential=await createUserWithEmailAndPassword(secondaryAuth,loginId,secretCode);
      createdUser=credential.user;
      await updateProfile(createdUser,{displayName:student.name});
      await updateDoc(studentRef,{authUid:createdUser.uid,loginId,loginCreatedAt:serverTimestamp(),loginCreatedBy:hm.uid,updatedAt:serverTimestamp()});
      profileLinked=true;
      return {studentId:student.studentId,loginId,secretCode};
    }catch(error){
      if(error?.code==="auth/email-already-in-use"&&!createdUser){
        try{
          const existingCredential=await signInWithEmailAndPassword(secondaryAuth,loginId,secretCode);
          const existingUser=existingCredential.user;
          const linked=await getDocs(query(collection(db,"students"),where("authUid","==",existingUser.uid)));
          if(linked.docs.some(item=>item.id!==String(studentRecordId))) throw new Error("This Firebase Login ID is already linked to another student. Please contact GI Support; no records were changed.");
          await updateProfile(existingUser,{displayName:student.name});
          await updateDoc(studentRef,{authUid:existingUser.uid,loginId,loginCreatedAt:student.loginCreatedAt||serverTimestamp(),loginCreatedBy:hm.uid,updatedAt:serverTimestamp()});
          profileLinked=true;
          return {studentId:student.studentId,loginId,secretCode};
        }catch(reuseError){
          if(reuseError?.message?.includes("already linked to another student")) throw reuseError;
          if(["auth/invalid-credential","auth/wrong-password","auth/user-not-found"].includes(reuseError?.code)) throw new Error("This Login ID already exists in Firebase, but its Secret Code does not match. No account was changed. Please contact GI Support.");
          throw new Error("The existing Firebase account could not be safely linked. No records were changed. Please contact GI Support. Details: "+(reuseError?.message||reuseError?.code||"Unknown error"));
        }
      }
      if(createdUser&&!profileLinked){try{await deleteUser(createdUser);}catch{}}
      const messages={
        "auth/operation-not-allowed":"Firebase Email/Password sign-in is disabled. Enable the Email/Password provider in Firebase Authentication.",
        "auth/weak-password":"Firebase rejected the student's Secret Code as a password. Check the Firebase Authentication password policy.",
        "auth/password-does-not-meet-requirements":"Firebase password policy rejected the student's Secret Code. Review the Firebase password policy.",
        "auth/network-request-failed":"Network connection failed while creating the student login. Check the connection and try again.",
        "auth/too-many-requests":"Firebase temporarily blocked login creation. Wait and try again."
      };
      if(error?.code&&messages[error.code]) throw new Error(messages[error.code]);
      throw new Error("Student login could not be created: "+(error?.message||error?.code||"Unknown error"));
    }
  }finally{
    try{await signOut(secondaryAuth);}catch{}
    try{await deleteApp(secondaryApp);}catch{}
  }
}
