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
