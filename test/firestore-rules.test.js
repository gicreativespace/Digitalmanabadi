import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, writeBatch, collection, getDocs, query, where } from "firebase/firestore";

let env;
const projectId="demo-digital-mana-badi-rules";
const parentToken={firebase:{sign_in_provider:"anonymous"}};

before(async()=>{
  const rules=await readFile(new URL("../firestore.rules",import.meta.url),"utf8");
  env=await initializeTestEnvironment({projectId,firestore:{host:"127.0.0.1",port:8080,rules}});
  await env.withSecurityRulesDisabled(async context=>{
    const db=context.firestore();
    await setDoc(doc(db,"platformAdmins/hm-a"),{role:"HEAD_MASTER",status:"active",schoolId:"school-a"});
    await setDoc(doc(db,"platformAdmins/hm-b"),{role:"HEAD_MASTER",status:"active",schoolId:"school-b"});
    await setDoc(doc(db,"students/student-a"),{studentRecordId:"student-a",schoolId:"school-a",classId:"class-1",studentId:"260101",name:"Student A",dob:"01012015",status:"active",createdBy:"hm-a"});
    await setDoc(doc(db,"studentSecrets/student-a"),{schoolId:"school-a",studentRecordId:"student-a",secretCode:"123456789012",secretCodeHash:"hash-a"});
    await setDoc(doc(db,"studentLookup/260101"),{studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",status:"active"});
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

test("A Parent must prove DOB and Secret Code before linking; links are isolated per device",async()=>{
  const parentA=env.authenticatedContext("parent-a",parentToken).firestore();
  await assertSucceeds(getDoc(doc(parentA,"studentLookup/260101")));
  await assertFails(getDoc(doc(parentA,"studentSecrets/student-a")));
  const batch=writeBatch(parentA);
  batch.set(doc(parentA,"parentProfiles/parent-a"),{uid:"parent-a",parentName:"Parent A"});
  batch.set(doc(parentA,"parentClaims/parent-a_student-a"),{parentUid:"parent-a",studentRecordId:"student-a",studentId:"260101",dob:"01012015",secretCodeHash:"hash-a"});
  batch.set(doc(parentA,"parentLinks/student-a"),{parentUid:"parent-a",studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",relationship:"Mother"});
  await assertSucceeds(batch.commit());
  await assertSucceeds(getDoc(doc(parentA,"students/student-a")));
  await assertFails(getDoc(doc(parentA,"students/student-b")));
  await assertFails(getDocs(collection(parentA,"students")));

  const parentB=env.authenticatedContext("parent-b",parentToken).firestore();
  const newDevice=writeBatch(parentB);
  newDevice.set(doc(parentB,"parentProfiles/parent-b"),{uid:"parent-b",parentName:"Parent B"});
  newDevice.set(doc(parentB,"parentClaims/parent-b_student-a"),{parentUid:"parent-b",studentRecordId:"student-a",studentId:"260101",dob:"01012015",secretCodeHash:"hash-a"});
  newDevice.set(doc(parentB,"parentLinks/student-a"),{parentUid:"parent-b",studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",relationship:"Father"});
  await assertSucceeds(newDevice.commit());
  await assertFails(getDoc(doc(parentA,"students/student-a")));
  await assertSucceeds(getDoc(doc(parentB,"students/student-a")));
});

test("A wrong Secret Code hash cannot create a Parent claim",async()=>{
  const parent=env.authenticatedContext("parent-wrong",parentToken).firestore();
  const batch=writeBatch(parent);
  batch.set(doc(parent,"parentProfiles/parent-wrong"),{uid:"parent-wrong",parentName:"Wrong Parent"});
  batch.set(doc(parent,"parentClaims/parent-wrong_student-a"),{parentUid:"parent-wrong",studentRecordId:"student-a",studentId:"260101",dob:"01012015",secretCodeHash:"not-the-verifier"});
  batch.set(doc(parent,"parentLinks/student-a"),{parentUid:"parent-wrong",studentRecordId:"student-a",studentId:"260101",classId:"class-1",rollNumber:"01",schoolId:"school-a",relationship:"Other"});
  await assertFails(batch.commit());
});
