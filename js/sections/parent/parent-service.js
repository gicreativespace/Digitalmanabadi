import { auth, db } from "../../firebase-client.js";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { collection, doc, getDoc, getDocs, query, where, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const t=value=>String(value??"").trim();
const te=()=>localStorage.getItem("gim_lang")!=="en";
function msg(en,teText){return new Error(te()?teText:en);}
async function ensureParentSession(){
  if(typeof auth.authStateReady==="function") await auth.authStateReady();
  const user=auth.currentUser;
  if(!user||user.isAnonymous) throw msg("Sign in with your Parent Login ID and password.","Parent Login ID మరియు Passwordతో Sign In చేయండి.");
  const profile=await getDoc(doc(db,"parentProfiles",user.uid));
  if(!profile.exists()||profile.data().role!=="PARENT"||profile.data().status!=="active") throw msg("This Parent account is not active. Contact the Head Master.","ఈ Parent ఖాతా క్రియాశీలంగా లేదు. Head Masterను సంప్రదించండి.");
  return user;
}
export async function signInParentAccount(mobile,password){
  const phone=t(mobile).replace(/\D/g,"");
  if(!/^\d{10}$/.test(phone)||!t(password)) throw msg("Enter your 10-digit mobile number and password.","10 అంకెల మొబైల్ నంబర్ మరియు Password నమోదు చేయండి.");
  await setPersistence(auth,browserLocalPersistence);
  const email=phone+"@parents.dagguluruschool.in";
  try{
    const credential=await signInWithEmailAndPassword(auth,email,t(password));
    const profile=await getDoc(doc(db,"parentProfiles",credential.user.uid));
    if(!profile.exists()||profile.data().role!=="PARENT"||profile.data().status!=="active"){
      await signOut(auth);
      throw msg("Parent account is not registered with this school.","ఈ పాఠశాలలో Parent ఖాతా నమోదు కాలేదు.");
    }
    localStorage.setItem("gim_parent_name",String(profile.data().parentName||""));
    return profile.data();
  }catch(error){
    if(error?.message?.includes("Parent account is not registered"))throw error;
    if(["auth/invalid-credential","auth/user-not-found","auth/wrong-password"].includes(error?.code)) throw msg("Mobile number or password is incorrect.","మొబైల్ నంబర్ లేదా Password సరిపోలలేదు.");
    throw error;
  }
}
export async function getParentProfile(){
  const user=await ensureParentSession();
  const snap=await getDoc(doc(db,"parentProfiles",user.uid));
  return {uid:user.uid,...snap.data()};
}
async function sha256(value){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(value)));
  return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,"0")).join("");
}
export async function findParentStudent(studentId){
  const id=t(studentId);
  if(!/^\d{6,8}[A-Z]?$/.test(id)) throw msg("Enter a valid Student ID.","సరైన Student ID నమోదు చేయండి.");
  await ensureParentSession();
  const snap=await getDoc(doc(db,"studentLookup",id));
  if(!snap.exists()||snap.data().status!=="active") throw msg("Student record was not found.","విద్యార్థి వివరాలు కనబడలేదు.");
  return snap.data();
}
export async function registerParent({studentRecordId,studentId,classId,rollNumber,schoolId,dob,secretCode,parentName,relationship}){
  const user=await ensureParentSession(),profile=await getParentProfile();
  const relation=t(relationship),normalizedDob=t(dob).replaceAll("/","");
  if(!["Father","Mother","Guardian","Other"].includes(relation)) throw msg("Choose your relationship to the student.","విద్యార్థితో మీ సంబంధాన్ని ఎంచుకోండి.");
  if(!/^\d{8}$/.test(normalizedDob)||!/^\d{12}$/.test(t(secretCode))) throw msg("Enter DOB and the 12-digit Student Secret Code.","పుట్టిన తేదీ మరియు 12 అంకెల Student Secret Code నమోదు చేయండి.");
  const secretCodeHash=await sha256(t(secretCode));
  const claimRef=doc(db,"parentClaims",user.uid+"_"+studentRecordId);
  const linkRef=doc(db,"parentLinks",studentRecordId+"_"+user.uid);
  await runTransaction(db,async tx=>{
    tx.set(claimRef,{parentUid:user.uid,studentRecordId,studentId,dob:normalizedDob,secretCodeHash,createdAt:serverTimestamp()});
    tx.set(linkRef,{parentUid:user.uid,studentRecordId,studentId,classId,rollNumber,schoolId,relationship:relation,parentName:profile.parentName||t(parentName),linkedAt:serverTimestamp()});
  });
  localStorage.setItem("gim_parent_name",String(profile.parentName||""));
  return await getParentChildren();
}
export async function addParentChild({studentId,dob,secretCode,relationship}){
  const user=await ensureParentSession();
  const lookup=await findParentStudent(studentId);
  const profile=await getParentProfile();
  return registerParent({studentRecordId:lookup.studentRecordId,studentId:lookup.studentId,classId:lookup.classId,rollNumber:lookup.rollNumber,schoolId:lookup.schoolId,dob,secretCode,parentName:profile.parentName,relationship});
}
export async function getParentChildren(){
  const user=await ensureParentSession();
  const links=await getDocs(query(collection(db,"parentLinks"),where("parentUid","==",user.uid))),children=[];
  for(const link of links.docs){
    const data=link.data(),student=await getDoc(doc(db,"students",data.studentRecordId));
    if(student.exists()&&student.data().status==="active") children.push({...student.data(),studentRecordId:student.id,relationship:data.relationship});
  }
  return children;
}
const PIN_KEY="gim_parent_device_pin_v2";
function b64(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes)));}
function unb64(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}
export async function saveParentPin(pin){
  if(!/^\d{4}$/.test(String(pin))) throw msg("Enter a 4-digit PIN.","4 అంకెల PIN నమోదు చేయండి.");
  if(!crypto?.subtle) throw msg("Secure PIN storage is unavailable.","సురక్షిత PIN నిల్వ అందుబాటులో లేదు.");
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(String(pin)),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:210000},key,256);
  localStorage.setItem(PIN_KEY,JSON.stringify({salt:b64(salt),hash:b64(bits),iterations:210000}));
}
export async function verifyParentPin(pin){
  if(!/^\d{4}$/.test(String(pin))) return false;
  try{
    const record=JSON.parse(localStorage.getItem(PIN_KEY)||"null");if(!record)return false;
    const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(String(pin)),"PBKDF2",false,["deriveBits"]);
    const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:unb64(record.salt),iterations:record.iterations},key,256);
    const a=new Uint8Array(bits),b=unb64(record.hash);return a.length===b.length&&a.every((v,i)=>v===b[i]);
  }catch{return false;}
}
export function hasParentPin(){return Boolean(localStorage.getItem(PIN_KEY));}
