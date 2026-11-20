import { auth } from "../../firebase-client.js";
import { APP_CONFIG } from "../../../config/school-config.js";

const apiBase = () => String(APP_CONFIG.backendApiBaseUrl || "").replace(/\\/$/, "");
async function request(path, options = {}) {
  const base = apiBase();
  if (!base) throw new Error("Trusted Backend ఇంకా కనెక్ట్ కాలేదు. Backend URL సెట్టింగ్ అవసరం.");
  const user = auth.currentUser;
  if (!user) throw new Error("Head Master Session ముగిసింది. మళ్లీ Login చేయండి.");
  const token = await user.getIdToken();
  const response = await fetch(base + path, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token, ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "అభ్యర్థన పూర్తి కాలేదు.");
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
