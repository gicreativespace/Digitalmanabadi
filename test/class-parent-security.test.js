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


test("Class register supports explicit Submit Class, persisted strength and safe student edits", async () => {
  const service = await read("../js/sections/class-management/class-service.js");
  const register = await read("../js/sections/class-management/class-register.js");
  const page = await read("../js/modules/module-page.js");
  assert.match(register, /Submit Class/);
  assert.match(register, /saveClassDetails/);
  assert.match(register, /updateClassStudent/);
  assert.match(register, /const created=response.created\|\|\[\]/);
  assert.match(register, /studentId:item.studentId,rollNumber:item.rollNumber/);
  assert.match(register, /secretCode:item.secretCode/);
  assert.match(register, /renderStudents\(currentStudents\)/);
  assert.match(service, /status:complete\?"complete":"draft"/);
  assert.match(service, /updateDoc\(studentRef,\{name,gender,dob,updatedAt/);
  assert.match(page, /classManagementMarkup, bindClassManagement/);
});


test("Student Secret Code generator creates a six-digit numeric code", async () => {
  const service = await read("../js/sections/class-management/class-service.js");
  assert.match(service, /function randomSecretCode\(\)/);
  assert.match(service, /const range=900000/);
  assert.match(service, /return String\(100000\+\(value%range\)\)/);
  assert.doesNotMatch(service, /padStart\(12/);
});


test("Parent verification accepts six-digit student Secret Codes", async () => {
  const parentService = await read("../js/sections/parent/parent-service.js");
  const parentSection = await read("../js/sections/parent/parent-section.js");
  assert.ok(parentService.includes("!/\\d{6}$/.test(t(secretCode))"));
  assert.match(parentSection, /id="parentSecretCode" type="password" inputmode="numeric" maxlength="6"/);
  assert.doesNotMatch(parentService, /12-digit Permanent Secret Code/);
});
