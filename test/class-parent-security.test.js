import test from "node:test";
import assert from "node:assert/strict";
import { classNumberFromId, validateDob } from "../lib/backend/ids.js";
import { generateSecretCode, encryptSecretCode, decryptSecretCode, hmac } from "../lib/backend/admin.js";

process.env.STUDENT_SECRET_ENCRYPTION_KEY = "a".repeat(64);
process.env.PARENT_SECRET_PEPPER = "test-pepper-value-that-is-at-least-32-characters-long";

test("class IDs are restricted to the five approved classrooms", () => {
  assert.equal(classNumberFromId("class-1"), 1);
  assert.equal(classNumberFromId("class-5"), 5);
  assert.throws(() => classNumberFromId("class-6"));
});

test("DOB accepts valid DDMMYYYY and rejects impossible dates", () => {
  assert.equal(validateDob("29/02/2000"), "29022000");
  assert.throws(() => validateDob("29/02/2001"));
  assert.throws(() => validateDob("31131999"));
});

test("Permanent Secret Codes are 12 digits and encrypt/decrypt without storing plaintext", () => {
  const code = generateSecretCode();
  assert.match(code, /^\d{12}$/);
  const encrypted = encryptSecretCode(code);
  assert.equal(encrypted.ciphertext.includes(code), false);
  assert.equal(decryptSecretCode({
    secretCodeCiphertext: encrypted.ciphertext,
    secretCodeIv: encrypted.iv,
    secretCodeTag: encrypted.tag
  }), code);
});

test("Secret Code verifiers are deterministic keyed hashes", () => {
  assert.equal(hmac("secret:123456789012"), hmac("secret:123456789012"));
  assert.notEqual(hmac("secret:123456789012"), hmac("mobile:+919876543210"));
});
