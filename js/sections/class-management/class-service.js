import { auth } from "../../firebase-client.js";
import { APP_CONFIG } from "../../../config/school-config.js";

const apiBase = () => String(APP_CONFIG.backendApiBaseUrl || "").replace(/\\/$/, "");
const te = () => localStorage.getItem("gim_lang") !== "en";
const messages = {
 "Trusted Backend ఇంకా కనెక్ట్ కాలేదు. Backend URL సెట్టింగ్ అవసరం.": "Trusted Backend is not connected yet. Backend URL configuration is required.",
 "Head Master Session ముగిసింది. మళ్లీ Login చేయండి.": "Your Head Master session has expired. Please sign in again.",
 "Sign in as Head Master to continue.": "కొనసాగడానికి Head Masterగా Login చేయండి.",
 "Your session is invalid. Please sign in again.": "మీ Session చెల్లుబాటు కావడం లేదు. మళ్లీ Login చేయండి.",
 "Active Head Master access is required for a school-linked account.": "పాఠశాలకు అనుసంధానమైన Active Head Master ఖాతా అవసరం.",
 "Choose a valid class.": "సరైన తరగతిని ఎంచుకోండి.",
 "Enter DOB in DDMMYYYY format.": "పుట్టిన తేదీని DD/MM/YYYY రూపంలో నమోదు చేయండి.",
 "Enter a valid date of birth.": "సరైన పుట్టిన తేదీ నమోదు చేయండి.",
 "Enter all required student and guardian details.": "విద్యార్థి మరియు తల్లిదండ్రుల అవసరమైన వివరాలన్నీ నమోదు చేయండి.",
 "Enter a valid section letter.": "సరైన సెక్షన్ అక్షరాన్ని నమోదు చేయండి.",
 "This class sequence is full for the current academic year.": "ఈ విద్యా సంవత్సరానికి ఈ తరగతి Roll Numberలు పూర్తయ్యాయి.",
 "Student record was not found.": "విద్యార్థి రికార్డు కనబడలేదు.",
 "The request could not be completed. Please try again.": "అభ్యర్థన పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి."
};
function localize(message) { return te() ? (messages[message] || "అభ్యర్థన పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.") : message; }

async function request(path, options = {}) {
  const base = apiBase();
  if (!base) throw new Error(te() ? "Trusted Backend ఇంకా కనెక్ట్ కాలేదు. Backend URL సెట్టింగ్ అవసరం." : "Trusted Backend is not connected yet. Backend URL configuration is required.");
  const user = auth.currentUser;
  if (!user) throw new Error(te() ? "Head Master Session ముగిసింది. మళ్లీ Login చేయండి." : "Your Head Master session has expired. Please sign in again.");
  const token = await user.getIdToken();
  const response = await fetch(base + path, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token, ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(localize(body.error || "The request could not be completed. Please try again."));
  return body;
}
export async function listClassrooms() { return request("/api/classrooms"); }
export async function listClassStudents(classId) { return request("/api/classrooms/" + encodeURIComponent(classId) + "/students"); }
export async function createClassStudent(classId, payload) {
  return request("/api/classrooms/" + encodeURIComponent(classId) + "/students", { method: "POST", body: JSON.stringify(payload) });
}
export async function updateStudentParentMobile(studentRecordId, parentMobile) {
  return request("/api/students/" + encodeURIComponent(studentRecordId), { method: "PATCH", body: JSON.stringify({ parentMobile }) });
}
