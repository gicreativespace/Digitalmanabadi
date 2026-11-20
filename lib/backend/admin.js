import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import crypto from "node:crypto";

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Backend Firebase credentials are not configured.");
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  } catch {
    throw new Error("Backend Firebase credentials are invalid.");
  }
  return initializeApp({ credential: cert(serviceAccount) });
}

export function adminAuth() { return getAuth(getAdminApp()); }
export function adminDb() { return getFirestore(getAdminApp()); }
export { FieldValue };

export function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function applyCors(req, res) {
  const origin = String(req.headers.origin || "");
  const allowed = String(process.env.CORS_ALLOWED_ORIGINS || "").split(",").map(v => v.trim()).filter(Boolean);
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  }
  if (req.method === "OPTIONS") { res.status(204).end(); return true; }
  return false;
}

export async function requireHeadMaster(req) {
  const header = String(req.headers.authorization || "");
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) throw Object.assign(new Error("Sign in as Head Master to continue."), { status: 401 });
  let decoded;
  try { decoded = await adminAuth().verifyIdToken(match[1], true); }
  catch { throw Object.assign(new Error("Your session is invalid. Please sign in again."), { status: 401 }); }
  const db = adminDb();
  const profileSnap = await db.collection("platformAdmins").doc(decoded.uid).get();
  const schoolProfileSnap = await db.collection("headMasters").doc(decoded.uid).get();
  const profile = profileSnap.exists ? profileSnap.data() : null;
  const schoolProfile = schoolProfileSnap.exists ? schoolProfileSnap.data() : null;
  const schoolId = profile?.schoolId || profile?.school?.schoolId || profile?.school?.id || schoolProfile?.schoolId;
  if (!profile || profile.role !== "HEAD_MASTER" || profile.status !== "active" || !schoolId) {
    throw Object.assign(new Error("Active Head Master access is required for a school-linked account."), { status: 403 });
  }
  return { uid: decoded.uid, schoolId: String(schoolId), email: decoded.email || profile.email || "" };
}

export function normalizeMobile(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10) return "+91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  if (digits.length === 13 && digits.startsWith("+91")) return digits;
  throw Object.assign(new Error("Enter a valid 10-digit mobile number."), { status: 400 });
}

export function hmac(value, pepperName = "PARENT_SECRET_PEPPER") {
  const pepper = process.env[pepperName];
  if (!pepper || pepper.length < 32) throw new Error(pepperName + " must be configured with at least 32 characters.");
  return crypto.createHmac("sha256", pepper).update(String(value)).digest("hex");
}

export function generateSecretCode() {
  // 12 decimal digits, generated from a cryptographically secure source.
  const bytes = crypto.randomBytes(16);
  let number = BigInt("0x" + bytes.toString("hex")) % 1000000000000n;
  return number.toString().padStart(12, "0");
}

export function encryptSecretCode(code) {
  const raw = process.env.STUDENT_SECRET_ENCRYPTION_KEY || "";
  let key;
  try { key = /^[a-f0-9]{64}$/i.test(raw) ? Buffer.from(raw, "hex") : Buffer.from(raw, "base64"); }
  catch { key = Buffer.alloc(0); }
  if (key.length !== 32) throw new Error("STUDENT_SECRET_ENCRYPTION_KEY must be a 32-byte hex or base64 key.");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(code, "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64"), iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64") };
}

export function decryptSecretCode(record) {
  const raw = process.env.STUDENT_SECRET_ENCRYPTION_KEY || "";
  const key = /^[a-f0-9]{64}$/i.test(raw) ? Buffer.from(raw, "hex") : Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("Student Secret Code encryption is not configured.");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(record.secretCodeIv, "base64"));
  decipher.setAuthTag(Buffer.from(record.secretCodeTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(record.secretCodeCiphertext, "base64")),
    decipher.final()
  ]).toString("utf8");
}

export function safeError(res, error) {
  const status = Number(error?.status) || 500;
  const message = status < 500 ? error.message : "The request could not be completed. Please try again.";
  json(res, status, { error: message });
}
