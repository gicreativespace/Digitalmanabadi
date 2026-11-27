import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";

const values=new Map();
globalThis.crypto=globalThis.crypto||webcrypto;
globalThis.localStorage={
  getItem:key=>values.has(key)?values.get(key):null,
  setItem:(key,value)=>values.set(key,String(value)),
  removeItem:key=>values.delete(key)
};

const {saveLocalStudentPin,verifyLocalStudentPin,getLocalStudentPinRecord}=await import("../js/sections/student/pin-auth.js");

test("Student PIN is stored as a salted PBKDF2 verifier and verifies correctly",async()=>{
  await saveLocalStudentPin("student-uid-1","0427");
  const record=getLocalStudentPinRecord("student-uid-1");
  assert.ok(record);
  assert.equal(record.version,1);
  assert.equal(record.iterations,310000);
  assert.notEqual(record.hash,"0427");
  assert.notEqual(record.salt,"0427");
  assert.equal(values.get("gim_student_pin_v1").includes("0427"),false);
  assert.equal(await verifyLocalStudentPin("student-uid-1","0427"),true);
  assert.equal(await verifyLocalStudentPin("student-uid-1","0428"),false);
});

test("Student PIN rejects non-four-digit values",async()=>{
  await assert.rejects(saveLocalStudentPin("student-uid-2","123"));
  await assert.rejects(saveLocalStudentPin("student-uid-2","12345"));
  assert.equal(await verifyLocalStudentPin("student-uid-2","1234"),false);
});
