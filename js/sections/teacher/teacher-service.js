import { auth } from "../../firebase-client.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-functions.js";

const functions = getFunctions(auth.app);

async function call(name, payload = {}) {
  const callable = httpsCallable(functions, name);
  const response = await callable(payload);
  return response.data;
}

export async function createTeacherRecord(payload) {
  return call("createTeacher", payload);
}

export async function listTeacherRecords() {
  return call("listTeachers");
}

export async function lookupTeacherName(teacherId) {
  return call("lookupTeacherName", { teacherId });
}

export async function verifyTeacherIdentity(payload) {
  return call("verifyTeacherIdentity", payload);
}

export async function completeTeacherEnrollment() {
  return call("completeTeacherEnrollment");
}

export async function getTeacherProfile() {
  return call("getTeacherProfile");
}
