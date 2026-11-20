const STORAGE_KEY = "gim_hm_pin_v1";
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

export function getLocalHeadMasterPinRecord(uid) {
  if (!uid) return null;
  const record = readRecords()[uid];
  if (!record || record.version !== 1 || !record.salt || !record.hash || record.iterations !== PBKDF2_ITERATIONS) return null;
  return record;
}

async function derivePinHash(pin, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:PBKDF2_ITERATIONS}, material, 256);
  return new Uint8Array(bits);
}

export async function saveLocalHeadMasterPin(uid, pin) {
  if (!uid || !/^\d{4}$/.test(String(pin))) throw new Error("PIN must contain exactly four digits.");
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) throw new Error("Secure PIN storage is not supported by this browser.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePinHash(String(pin), salt);
  const records = readRecords();
  records[uid] = {version:1, salt:encode(salt), hash:encode(hash), iterations:PBKDF2_ITERATIONS, createdAt:Date.now()};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export async function verifyLocalHeadMasterPin(uid, pin) {
  if (!/^\d{4}$/.test(String(pin))) return false;
  const record = getLocalHeadMasterPinRecord(uid);
  if (!record) return false;
  try {
    const candidate = await derivePinHash(String(pin), decode(record.salt));
    const expected = decode(record.hash);
    if (candidate.length !== expected.length) return false;
    let diff = 0;
    for (let i=0;i<candidate.length;i++) diff |= candidate[i] ^ expected[i];
    return diff === 0;
  } catch {
    return false;
  }
}

export async function getCurrentHeadMasterProfile() {
  const {auth, db} = await import("../../firebase-client.js");
  const {doc, getDoc} = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js");
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return null;
  const snapshot = await getDoc(doc(db, "platformAdmins", user.uid));
  if (!snapshot.exists()) return null;
  const profile = snapshot.data();
  if (profile.role !== "HEAD_MASTER" || profile.email?.trim().toLowerCase() !== user.email?.toLowerCase() || profile.status !== "active") return null;
  return {...profile, uid:user.uid};
}
