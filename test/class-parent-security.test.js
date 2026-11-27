import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("Class Management uses Firestore client and generates annual IDs", async () => {
  const service = await read("../js/sections/class-management/class-service.js");
  assert.match(service, /firebase-firestore\.js/);
  assert.match(service, /studentId=year\+String\(classNumber\)/);
  assert.match(service, /crypto\.getRandomValues/);
  assert.doesNotMatch(service, /fetch\(|backendApiBaseUrl|\/api\//);
});

test("Student enrollment persists generated roll, ID and school email", async () => {
  const service = await read("../js/sections/class-management/class-service.js");
  assert.match(service, /const rollNumber=String\(roll\)\.padStart\(2,"0"\),studentId=year\+String\(classNumber\)\.padStart\(2,"0"\)\+rollNumber/);
  assert.match(service, /const loginId=getStudentLoginId\(studentId\)/);
  assert.match(service, /section,rollNumber,studentId,loginId,academicYear/);
  assert.match(service, /studentId,loginId,classId,section,rollNumber/);
});

test("Class register passes each selected section to transactional enrollment", async () => {
  const modulePage = await read("../js/modules/module-page.js");
  assert.match(modulePage, /createClassStudents\(activeClassId,filled\.map\(row=>\(\{name:row\.name,gender:row\.gender,dob:row\.dob,section:row\.section\}\)\)\)/);
  assert.match(modulePage, /Teacher list could not be loaded/);
  assert.match(modulePage, /eligibleTeachers=teacherRecords\.filter\(t=>t\.status==="active"&&Array\.isArray\(t\.assignedClasses\)&&t\.assignedClasses\.includes\(classLabel\)\)/);
});

test("Sections share one class-wide transactional roll sequence", async () => {
  const service = await read("../js/sections/class-management/class-service.js");
  assert.match(service, /counterId=hm\.schoolId\+"_"\+year\+"_"\+classId/);
  assert.match(service, /classNumber,section,rollNumber,studentId/);
  assert.match(service, /latestSections/);
  assert.doesNotMatch(service, /counterId=.*section/);
});

test("Parent verification uses anonymous Firebase identity and private verifier claims", async () => {
  const service = await read("../js/sections/parent/parent-service.js");
  const rules = await read("../firestore.rules");
  assert.match(service, /signInAnonymously/);
  assert.match(service, /SHA-256/);
  assert.match(service, /parentClaims/);
  assert.match(service, /gim_parent_device_pin_v1/);
  assert.doesNotMatch(service, /signInWithCustomToken|fetch\(|backendApiBaseUrl/);
  assert.match(rules, /match \/studentSecrets/);
  assert.match(rules, /match \/parentClaims/);
  assert.match(rules, /getAfter\(/);
  assert.match(rules, /function linkedParent/);
});

test("Parent PIN is a local device lock, not a server credential", async () => {
  const service = await read("../js/sections/parent/parent-service.js");
  const section = await read("../js/sections/parent/parent-section.js");
  const login = await read("../js/sections/parent/login.js");
  assert.match(service, /localStorage\.setItem\(PIN_KEY/);
  assert.doesNotMatch(service, /setDoc\(.*PIN|parentProfiles.*pin/i);
  assert.match(section, /saveParentPin/);
  assert.match(login, /App Lock PIN/);
});

test("Legacy API and Firebase Admin source are not present", async () => {
  const { access } = await import("node:fs/promises");
  await assert.rejects(access(new URL("../api", import.meta.url)));
  await assert.rejects(access(new URL("../lib/backend", import.meta.url)));
});
