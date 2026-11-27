const STORAGE_KEY = "gim_student_pin_v1";
const PBKDF2_ITERATIONS = 310000;

function encode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function decode(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}
function readRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
export function getLocalStudentPinRecord(uid) {
  if (!uid) return null;
  const record = readRecords()[uid];
  if (!record || record.version !== 1 || !record.salt || !record.hash || record.iterations !== PBKDF2_ITERATIONS) return null;
  return record;
}
export function clearLocalStudentPinRecord(uid) {
  if (!uid) return;
  const records = readRecords();
  delete records[uid];
  if (Object.keys(records).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  else localStorage.removeItem(STORAGE_KEY);
}
async function derivePinHash(pin, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(String(pin)), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:PBKDF2_ITERATIONS}, material, 256);
  return new Uint8Array(bits);
}
export async function saveLocalStudentPin(uid, pin) {
  if (!uid || !/^\d{4}$/.test(String(pin))) throw new Error("PIN must contain exactly four digits.");
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) throw new Error("Secure PIN storage is not supported by this browser.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePinHash(pin, salt);
  const records = readRecords();
  records[uid] = {version:1,salt:encode(salt),hash:encode(hash),iterations:PBKDF2_ITERATIONS,createdAt:Date.now()};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
export async function verifyLocalStudentPin(uid, pin) {
  if (!/^\d{4}$/.test(String(pin))) return false;
  const record = getLocalStudentPinRecord(uid);
  if (!record) return false;
  try {
    const candidate = await derivePinHash(pin, decode(record.salt));
    const expected = decode(record.hash);
    if (candidate.length !== expected.length) return false;
    let difference = 0;
    for (let index = 0; index < candidate.length; index++) difference |= candidate[index] ^ expected[index];
    return difference === 0;
  } catch {
    return false;
  }
}
