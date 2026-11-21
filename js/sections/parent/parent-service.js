import { auth, db } from "../../firebase-client.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { collection, doc, getDoc, getDocs, query, where, setDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const t=value=>String(value??"").trim();
const te=()=>localStorage.getItem("gim_lang")!=="en";
function msg(en,teText){return new Error(te()?teText:en);}
async function ensureParentSession(){
  if(!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser;
}
async function sha256(value){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(value)));
  return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,"0")).join("");
}
export async function findParentStudent(studentId){
  const id=t(studentId);
  if(!/^\\d{6,8}[A-Z]?$/.test(id)) throw msg("Enter a valid Student ID.","సరైన Student ID నమోదు చేయండి.");
  await ensureParentSession();
  const snap=await getDoc(doc(db,"studentLookup",id));
  if(!snap.exists()||snap.data().status!=="active") throw msg("Student record was not found.","విద్యార్థి వివరాలు కనబడలేదు.");
  return snap.data();
}
export async function registerParent({studentRecordId,studentId,dob,secretCode,parentName,relationship}){
  const user=await ensureParentSession();
  const name=t(parentName).slice(0,80),relation=t(relationship);
  if(name.length<2||!["Father","Mother","Guardian","Other"].includes(relation)) throw msg("Enter your name and relationship.","మీ పేరు మరియు విద్యార్థితో సంబంధం నమోదు చేయండి.");
  const normalizedDob=t(dob).replaceAll("/","");
  if(!/^\\d{8}$/.test(normalizedDob)||!/^\\d{12}$/.test(t(secretCode))) throw msg("Enter DOB and the 12-digit Permanent Secret Code.","పుట్టిన తేదీ మరియు 12 అంకెల Permanent Secret Code నమోదు చేయండి.");
  const secretCodeHash=await sha256(t(secretCode));
  const profileRef=doc(db,"parentProfiles",user.uid);
  const claimRef=doc(db,"parentClaims",user.uid+"_"+studentRecordId);
  const linkRef=doc(db,"parentLinks",studentRecordId);
  await runTransaction(db,async tx=>{
    const studentRef=doc(db,"students",studentRecordId),studentSnap=await tx.get(studentRef);
    if(!studentSnap.exists()||studentSnap.data().studentId!==studentId||studentSnap.data().dob!==normalizedDob) throw msg("Student details could not be verified.","విద్యార్థి వివరాలు సరిపోలలేదు.");
    tx.set(profileRef,{uid:user.uid,parentName:name,createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
    tx.set(claimRef,{parentUid:user.uid,studentRecordId,studentId,dob:normalizedDob,secretCodeHash,createdAt:serverTimestamp()});
    tx.set(linkRef,{parentUid:user.uid,studentRecordId,studentId,classId:studentSnap.data().classId,rollNumber:studentSnap.data().rollNumber,relationship:relation,linkedAt:serverTimestamp()});
  });
  localStorage.setItem("gim_parent_name",name);
  return await getParentChildren();
}
export async function addParentChild({studentId,dob,secretCode,relationship}){
  const user=await ensureParentSession();
  const lookup=await findParentStudent(studentId);
  const profile=await getDoc(doc(db,"parentProfiles",user.uid));
  if(!profile.exists()) throw msg("Parent registration is required.","ముందుగా Parent Registration పూర్తి చేయండి.");
  return registerParent({studentRecordId:lookup.studentRecordId,studentId:lookup.studentId,dob,secretCode,parentName:profile.data().parentName,relationship});
}
export async function getParentChildren(){
  const user=await ensureParentSession();
  const q=query(collection(db,"parentLinks"),where("parentUid","==",user.uid));
  const links=await getDocs(q),children=[];
  for(const link of links.docs){
    const data=link.data(),student=await getDoc(doc(db,"students",data.studentRecordId));
    if(student.exists()) children.push({...student.data(),studentRecordId:student.id,relationship:data.relationship});
  }
  return children;
}
const PIN_KEY="gim_parent_device_pin_v1";
function b64(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes)));}
function unb64(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}
export async function saveParentPin(pin){
  if(!/^\\d{4}$/.test(String(pin))) throw msg("Enter a 4-digit PIN.","4 అంకెల PIN నమోదు చేయండి.");
  if(!crypto?.subtle) throw msg("Secure PIN storage is unavailable.","సురక్షిత PIN నిల్వ అందుబాటులో లేదు.");
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(String(pin)),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:210000},key,256);
  localStorage.setItem(PIN_KEY,JSON.stringify({salt:b64(salt),hash:b64(bits),iterations:210000}));
}
export async function verifyParentPin(pin){
  if(!/^\\d{4}$/.test(String(pin))) return false;
  try{
    const record=JSON.parse(localStorage.getItem(PIN_KEY)||"null");if(!record)return false;
    const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(String(pin)),"PBKDF2",false,["deriveBits"]);
    const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:unb64(record.salt),iterations:record.iterations},key,256);
    const a=new Uint8Array(bits),b=unb64(record.hash);return a.length===b.length&&a.every((v,i)=>v===b[i]);
  }catch{return false;}
}
export function hasParentPin(){return Boolean(localStorage.getItem(PIN_KEY));}
