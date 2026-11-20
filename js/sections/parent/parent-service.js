import { auth } from "../../firebase-client.js";
import { APP_CONFIG } from "../../../config/school-config.js";
import { signInWithCustomToken } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const apiBase = () => String(APP_CONFIG.backendApiBaseUrl || "").replace(/\/$/, "");
const te = () => localStorage.getItem("gim_lang") !== "en";
const messages = {
 "Enter a valid 10-digit mobile number.": "సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.",
 "Too many attempts. Please try again later.": "చాలా ప్రయత్నాలు జరిగాయి. కొంత సమయం తర్వాత మళ్లీ ప్రయత్నించండి.",
 "Too many incorrect attempts. Try again in 60 seconds.": "ఐదు తప్పు ప్రయత్నాలు పూర్తయ్యాయి. 60 సెకన్ల తర్వాత మళ్లీ ప్రయత్నించండి.",
 "Verification is locked for 60 seconds.": "భద్రత కోసం ధృవీకరణ 60 సెకన్ల పాటు నిలిపివేయబడింది.",
 "Student details could not be verified.": "విద్యార్థి వివరాలు సరిపోలలేదు. మళ్లీ పరిశీలించండి.",
 "Already Linked. This student is connected to another Parent Mobile Account.": "ఈ విద్యార్థి ఇప్పటికే మరో Parent Mobile Accountకు అనుసంధానమయ్యారు. Head Masterను సంప్రదించండి.",
 "Parent sign-in is required.": "Parentగా ప్రవేశించాలి.",
 "Parent session is invalid. Please verify again.": "Parent Session చెల్లుబాటు కావడం లేదు. మళ్లీ ధృవీకరించండి.",
 "Parent access is required.": "Parent ప్రవేశ అనుమతి అవసరం."
};
function localize(message) { return te() ? (messages[message] || "ధృవీకరణ పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.") : message; }
async function publicRequest(path, payload) {
  const base = apiBase();
  if (!base) throw new Error(te() ? "Parent Verification Backend ఇంకా కనెక్ట్ కాలేదు." : "Parent Verification backend is not connected yet.");
  const response = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(localize(body.error || "Verification failed."));
    error.status = response.status;
    error.retryAfterSeconds = body.retryAfterSeconds || 0;
    throw error;
  }
  return body;
}
export async function findParentStudents(mobile) { return publicRequest("/api/parent/students", { mobile }); }
export async function verifyParentStudent(payload) {
  const result = await publicRequest("/api/parent/verify", payload);
  await signInWithCustomToken(auth, result.customToken);
  localStorage.setItem("gim_parent_mobile", String(payload.mobile).replace(/\D/g, "").slice(-10));
  return result;
}
export async function getParentChildren() {
  const base = apiBase();
  const user = auth.currentUser;
  if (!base || !user) throw new Error(te() ? "Parent Session సక్రియంగా లేదు." : "Parent session is not active.");
  const token = await user.getIdToken();
  const response = await fetch(base + "/api/parent/children", { headers: { Authorization: "Bearer " + token } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(localize(body.error || "Could not load linked children."));
  return body.children || [];
}
function bytesToBase64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))); }
function base64ToBytes(value) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
export async function saveParentPin(uid, pin) {
  if (!/^\d{4}$/.test(String(pin))) throw new Error(te() ? "4 అంకెల PIN నమోదు చేయండి." : "Enter a 4-digit PIN.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, material, 256);
  localStorage.setItem("gim_parent_pin_v1:" + uid, JSON.stringify({ salt: bytesToBase64(salt), hash: bytesToBase64(bits), iterations: 210000 }));
}
export async function verifyParentPin(uid, pin) {
  const raw = localStorage.getItem("gim_parent_pin_v1:" + uid);
  if (!raw || !/^\d{4}$/.test(String(pin))) return false;
  try {
    const record = JSON.parse(raw);
    const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: base64ToBytes(record.salt), iterations: Number(record.iterations) || 210000, hash: "SHA-256" }, material, 256);
    const actual = new Uint8Array(bits), expected = base64ToBytes(record.hash);
    return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
  } catch { return false; }
}
