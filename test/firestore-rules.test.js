import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, writeBatch, collection, getDocs, query, where } from "firebase/firestore";

let env;
const projectId="demo-digital-mana-badi";
const parentToken={email:"parent-a@parents.dagguluruschool.in"};

before(async()=>{
  const rules=await readFile(new URL("../firestore.rules",import.meta.url),"utf8");
  env=await initializeTestEnvironment({projectId,firestore:{host:"127.0.0.1",port:8080,rules}});
  await env.withSecurityRulesDisabled(async context=>{
    const db=context.firestore();
    await setDoc(doc(db,"platformAdmins/hm-a"),{role:"HEAD_MASTER",status:"active",schoolId:"school-a"});
    await setDoc(doc(db,"platformAdmins/hm-b"),{role:"HEAD_MASTER",status:"active",schoolId:"school-b"});
    await setDoc(doc(db,"students/student-a"),{studentRecordId:"student-a",schoolId:"school-a",classId:"class-1",studentId:"260101",name:"Student A",dob:"01012015",parentMobile:"9999999999",status:"active",authUid:"student-a",createdBy:"hm-a"});
    await setDoc(doc(db,"studentSecrets/student-a"),{schoolId:"school-a",studentRecordId:"student-a",secretCode:"123456789012",secretCodeHash:"hash-a"});
    await setDoc(doc(db,"studentLookup/260101"),{studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",status:"active"});\n    await setDoc(doc(db,"parentProfiles/parent-a"),{uid:"parent-a",role:"PARENT",status:"active",schoolId:"school-a",mobile:"9999999999",parentName:"Parent A"});
    await setDoc(doc(db,"students/student-b"),{studentRecordId:"student-b",schoolId:"school-b",classId:"class-1",studentId:"260101",name:"Student B",dob:"02022015",status:"active",createdBy:"hm-b"});
    await setDoc(doc(db,"studentSecrets/student-b"),{schoolId:"school-b",studentRecordId:"student-b",secretCode:"210987654321",secretCodeHash:"hash-b"});
  });
});

after(async()=>{if(env)await env.cleanup();});

test("Head Master access is school-scoped and private Secret Codes stay private",async()=>{
  const hmA=env.authenticatedContext("hm-a").firestore();
  await assertSucceeds(getDoc(doc(hmA,"students/student-a")));
  await assertSucceeds(getDoc(doc(hmA,"studentSecrets/student-a")));
  await assertFails(getDoc(doc(hmA,"students/student-b")));
  await assertFails(getDoc(doc(hmA,"studentSecrets/student-b")));
  const rows=await assertSucceeds(getDocs(query(collection(hmA,"students"),where("schoolId","==","school-a"),where("classId","==","class-1"))));
  assert.equal(rows.size,1);
});

test("A Student can read only their own active profile and lookup, never Secret Codes or other students",async()=>{
  const student=env.authenticatedContext("student-a",{email:"260101@dagguluruschool.in"}).firestore();
  await assertSucceeds(getDoc(doc(student,"studentLookup/260101")));
  await assertSucceeds(getDoc(doc(student,"students/student-a")));
  await assertFails(getDoc(doc(student,"students/student-b")));
  await assertFails(getDoc(doc(student,"studentSecrets/student-a")));
  await assertFails(getDocs(collection(student,"students")));
});

test("A school-provisioned Parent must prove DOB and Secret Code before linking",async()=>{
  const parentA=env.authenticatedContext("parent-a",parentToken).firestore();
  await assertSucceeds(getDoc(doc(parentA,"parentProfiles/parent-a")));
  await assertSucceeds(getDoc(doc(parentA,"studentLookup/260101")));
  await assertFails(getDoc(doc(parentA,"studentSecrets/student-a")));
  const batch=writeBatch(parentA);
  batch.set(doc(parentA,"parentClaims/parent-a_student-a"),{parentUid:"parent-a",studentRecordId:"student-a",studentId:"260101",dob:"01012015",secretCodeHash:"hash-a"});
  batch.set(doc(parentA,"parentLinks/student-a_parent-a"),{parentUid:"parent-a",studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",relationship:"Mother"});
  await assertSucceeds(batch.commit());
  await assertSucceeds(getDoc(doc(parentA,"students/student-a")));
  await assertFails(getDoc(doc(parentA,"students/student-b")));
  await assertFails(getDocs(collection(parentA,"students")));
  const links=await assertSucceeds(getDocs(query(collection(parentA,"parentLinks"),where("parentUid","==","parent-a"))));
  assert.equal(links.size,1);
});

test("A wrong Secret Code hash cannot create a Parent claim",async()=>{
  await env.withSecurityRulesDisabled(async context=>{
    await setDoc(doc(context.firestore(),"parentProfiles/parent-wrong"),{uid:"parent-wrong",role:"PARENT",status:"active",schoolId:"school-a",mobile:"9999999999",parentName:"Wrong Parent"});
  });
  const parent=env.authenticatedContext("parent-wrong",{email:"9999999999@parents.dagguluruschool.in"}).firestore();
  const batch=writeBatch(parent);
  batch.set(doc(parent,"parentClaims/parent-wrong_student-a"),{parentUid:"parent-wrong",studentRecordId:"student-a",studentId:"260101",dob:"01012015",secretCodeHash:"not-the-verifier"});
  batch.set(doc(parent,"parentLinks/student-a_parent-wrong"),{parentUid:"parent-wrong",studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",relationship:"Other"});
  await assertFails(batch.commit());
});
