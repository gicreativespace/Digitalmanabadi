import { auth, db } from "../../firebase-client.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  getAuth,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const TEACHERS = "teachers";
const COUNTERS = "teacherCounters";
const LOGIN_DOMAIN = "dagguluruschool.in";
const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
const SUBJECTS = ["Telugu", "English", "Mathematics", "EVS"];

function cleanText(value, max = 100) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanList(value, allowed, label) {
  if (!Array.isArray(value)) throw new Error("Select at least one " + label + ".");
  const result = [...new Set(value.map(item => cleanText(item, 40)).filter(item => allowed.includes(item)))];
  if (!result.length) throw new Error("Select at least one " + label + ".");
  return result;
}

function validateTeacher(payload) {
  const name = cleanText(payload.name, 100);
  const dob = cleanText(payload.dob, 8);
  const gender = cleanText(payload.gender, 20);
  if (name.length < 2) throw new Error("Enter the teacher's full name.");
  const dobParts = /^(\d{2})(\d{2})(\d{4})$/.exec(dob);
  if (!dobParts) throw new Error("Enter date of birth in DDMMYYYY format.");
  const day = Number(dobParts[1]);
  const month = Number(dobParts[2]);
  const year = Number(dobParts[3]);
  const parsedDob = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (
    year < 1900 ||
    parsedDob.getFullYear() !== year ||
    parsedDob.getMonth() !== month - 1 ||
    parsedDob.getDate() !== day ||
    parsedDob > today
  ) {
    throw new Error("Enter a valid date of birth in DDMMYYYY format.");
  }
  if (!["Female", "Male", "Other"].includes(gender)) throw new Error("Select a valid gender.");
  return {
    name,
    dob,
    gender,
    assignedClasses: cleanList(payload.assignedClasses, CLASSES, "class"),
    teachingSubjects: cleanList(payload.teachingSubjects, SUBJECTS, "subject")
  };
}

async function requireActiveHeadMaster() {
  const user = auth.currentUser;
  if (!user) throw new Error("Head Master sign-in is required.");
  const snapshot = await getDoc(doc(db, "platformAdmins", user.uid));
  if (!snapshot.exists()) throw new Error("Active Head Master access is required.");
  const profile = snapshot.data();
  if (profile.role !== "HEAD_MASTER" || profile.status !== "active") {
    throw new Error("Active Head Master access is required.");
  }
  return user;
}

function currentAcademicYearCode() {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "2-digit"
  }).format(new Date());
  return parts;
}

function createTeacherSecretCode(dob) {
  const value = String(dob ?? "");
  if (!/^\d{8}$/.test(value)) throw new Error("A valid teacher date of birth is required to generate the login code.");
  const dobDDMMYY = value.slice(0, 4) + value.slice(6, 8);
  const code = 919720 - Number(dobDDMMYY);
  if (!Number.isInteger(code) || code < 100000 || code > 999999) {
    throw new Error("Could not generate a valid six-digit teacher code.");
  }
  return String(code);
}

function randomPassword(length = 16) {
  const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%&*"];
  const all = groups.join("");
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  const chars = groups.map((group, index) => group[bytes[index] % group.length]);
  for (let index = groups.length; index < length; index++) chars.push(all[bytes[index] % all.length]);
  for (let index = chars.length - 1; index > 0; index--) {
    const j = crypto.getRandomValues(new Uint8Array(1))[0] % (index + 1);
    [chars[index], chars[j]] = [chars[j], chars[index]];
  }
  return chars.join("");
}

export function getTeacherLoginId(teacherId) {
  return String(teacherId) + "@" + LOGIN_DOMAIN;
}

export async function createTeacherRecord(payload) {
  const user = await requireActiveHeadMaster();
  const teacher = validateTeacher(payload);
  const yy = currentAcademicYearCode();
  const counterRef = doc(db, COUNTERS, yy);
  let createdTeacherId = "";

  const secretCode = createTeacherSecretCode(teacher.dob);

  await runTransaction(db, async transaction => {
    const counterSnapshot = await transaction.get(counterRef);
    const lastSerial = counterSnapshot.exists() ? Number(counterSnapshot.data().lastSerial || 0) : 0;
    const serial = lastSerial + 1;
    if (serial > 99) throw new Error("This year's Teacher ID sequence is full.");
    const teacherId = yy + String(serial).padStart(2, "0");
    const teacherRef = doc(db, TEACHERS, teacherId);
    transaction.set(teacherRef, {
      teacherId,
      ...teacher,
      secretCode,
      status: "active",
      authUid: null,
      loginId: null,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    transaction.set(counterRef, {
      lastSerial: serial,
      updatedAt: serverTimestamp()
    }, { merge: true });
    createdTeacherId = teacherId;
  });

  return { teacherId: createdTeacherId };
}

export async function createTeacherLogin(teacherId) {
  const headMaster = await requireActiveHeadMaster();
  if (!/^\d{4}$/.test(String(teacherId))) throw new Error("Invalid Teacher ID.");
  const teacherRef = doc(db, TEACHERS, String(teacherId));
  const teacherSnapshot = await getDoc(teacherRef);
  if (!teacherSnapshot.exists()) throw new Error("Teacher record was not found.");
  const teacher = teacherSnapshot.data();
  if (teacher.status !== "active") throw new Error("Reactivate this teacher before creating a login.");
  if (teacher.authUid || teacher.loginId) throw new Error("A login already exists for this teacher.");

  const loginId = getTeacherLoginId(teacherId);
  const secretCode = /^\d{6}$/.test(String(teacher.secretCode || "")) ? String(teacher.secretCode) : createTeacherSecretCode(teacher.dob);
  const password = secretCode;
  if (teacher.secretCode !== secretCode) {
    await updateDoc(teacherRef, { secretCode, updatedAt: serverTimestamp() });
  }
  const secondaryApp = initializeApp(auth.app.options, "teacher-provision-" + teacherId + "-" + crypto.randomUUID());
  const secondaryAuth = getAuth(secondaryApp);
  let createdUser = null;
  let profileLinked = false;

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, loginId, password);
    createdUser = credential.user;
    await updateProfile(createdUser, { displayName: teacher.name });
    await updateDoc(teacherRef, {
      authUid: createdUser.uid,
      loginId,
      secretCode,
      loginCreatedAt: serverTimestamp(),
      loginCreatedBy: headMaster.uid,
      updatedAt: serverTimestamp()
    });
    profileLinked = true;
    return { teacherId: String(teacherId), loginId, password, secretCode };
  } catch (error) {
    if (error?.code === "auth/email-already-in-use" && !createdUser) {
      try {
        const existingCredential = await signInWithEmailAndPassword(secondaryAuth, loginId, password);
        const existingUser = existingCredential.user;
        const linkedTeachers = await getDocs(query(collection(db, TEACHERS), where("authUid", "==", existingUser.uid)));
        const linkedElsewhere = linkedTeachers.docs.some(item => item.id !== String(teacherId));
        if (linkedElsewhere) {
          try { await signOut(secondaryAuth); } catch {}
          throw new Error("This Firebase Login ID is already linked to another Teacher profile. Please contact GI Support; no account or teacher record was changed.");
        }
        await updateProfile(existingUser, { displayName: teacher.name });
        await updateDoc(teacherRef, {
          authUid: existingUser.uid,
          loginId,
          secretCode,
          loginCreatedAt: teacher.loginCreatedAt || serverTimestamp(),
          loginCreatedBy: headMaster.uid,
          updatedAt: serverTimestamp()
        });
        profileLinked = true;
        return { teacherId: String(teacherId), loginId, password, secretCode };
      } catch (reuseError) {
        if (reuseError?.message?.includes("already linked to another Teacher profile")) throw reuseError;
        if (reuseError?.code === "auth/invalid-credential" || reuseError?.code === "auth/wrong-password" || reuseError?.code === "auth/user-not-found") {
          throw new Error("This Login ID already exists in Firebase Authentication, but the approved Secret Code did not match its existing password. No new account was created and no password was changed. Please contact GI Support to verify the existing account.");
        }
        throw new Error("Firebase already has this Login ID, but the existing account could not be safely linked. No new account was created and no password was changed. Please contact GI Support. Details: " + (reuseError?.message || reuseError?.code || "Unknown error"));
      }
    }
    if (createdUser && !profileLinked) {
      try { await deleteUser(createdUser); } catch {}
    }
    const authMessages = {
      "auth/email-already-in-use": "This Login ID already exists in Firebase Authentication. Please contact GI Support; do not create another teacher record.",
      "auth/operation-not-allowed": "Firebase Email/Password sign-in is disabled. Enable the Email/Password provider in Firebase Authentication.",
      "auth/weak-password": "Firebase rejected this six-digit Secret Code as a password. Check the Firebase Authentication password policy.",
      "auth/password-does-not-meet-requirements": "Firebase password policy requires characters beyond digits. The approved six-digit Secret Code cannot satisfy that policy; review the Firebase password policy.",
      "auth/network-request-failed": "Network connection failed while creating the teacher login. Check the connection and try again.",
      "auth/too-many-requests": "Firebase temporarily blocked login creation due to too many attempts. Wait and try again."
    };
    if (error?.code && authMessages[error.code]) {
      throw new Error(authMessages[error.code]);
    }
    if (createdUser && !profileLinked) {
      throw new Error("Firebase created the login, but linking it to the teacher profile failed. Automatic cleanup was attempted. Please refresh the teacher list and contact GI Support before retrying. Details: " + (error?.message || "Unknown Firestore error."));
    }
    throw new Error("Teacher login could not be created: " + (error?.message || error?.code || "Unknown error"));
  } finally {
    try { await signOut(secondaryAuth); } catch {}
    try { await deleteApp(secondaryApp); } catch {}
  }
}

export async function listTeacherRecords() {
  await requireActiveHeadMaster();
  const snapshot = await getDocs(query(collection(db, TEACHERS), orderBy("createdAt", "desc")));
  return {
    teachers: snapshot.docs.map(item => ({ ...item.data(), teacherId: item.id }))
  };
}

export async function updateTeacherRecord(teacherId, payload) {
  const user = await requireActiveHeadMaster();
  const teacher = validateTeacher(payload);
  const teacherRef = doc(db, TEACHERS, String(teacherId));
  const snapshot = await getDoc(teacherRef);
  if (!snapshot.exists()) throw new Error("Teacher record was not found.");
  await updateDoc(teacherRef, {
    ...teacher,
    updatedBy: user.uid,
    updatedAt: serverTimestamp()
  });
  return { teacherId: String(teacherId) };
}

export async function setTeacherStatus(teacherId, status, reason = "", note = "") {
  const user = await requireActiveHeadMaster();
  const teacherRef = doc(db, TEACHERS, String(teacherId));
  const snapshot = await getDoc(teacherRef);
  if (!snapshot.exists()) throw new Error("Teacher record was not found.");

  if (status === "inactive") {
    if (!["school_transfer", "retired", "other"].includes(reason)) {
      throw new Error("Select a reason for deactivation.");
    }
    await updateDoc(teacherRef, {
      status: "inactive",
      deactivationReason: reason,
      deactivationNote: cleanText(note, 240),
      deactivationHistory: arrayUnion({ reason, note: cleanText(note, 240), at: new Date().toISOString(), by: user.uid }),
      deactivatedAt: serverTimestamp(),
      deactivatedBy: user.uid,
      updatedAt: serverTimestamp()
    });
  } else if (status === "active") {
    await updateDoc(teacherRef, {
      status: "active",
      lastReactivatedAt: serverTimestamp(),
      lastReactivatedBy: user.uid,
      updatedAt: serverTimestamp()
    });
  } else {
    throw new Error("Invalid teacher status.");
  }
  return { teacherId: String(teacherId), status };
}

export async function getTeacherProfile() {
  const user = auth.currentUser;
  const loginId = user?.email || "";
  const teacherId = loginId.toLowerCase().endsWith("@" + LOGIN_DOMAIN)
    ? loginId.slice(0, loginId.lastIndexOf("@"))
    : "";
  if (!user || !/^\d{4}$/.test(teacherId)) throw new Error("Teacher account could not be identified.");
  const snapshot = await getDoc(doc(db, TEACHERS, teacherId));
  if (!snapshot.exists()) throw new Error("Teacher profile was not found.");
  const profile = snapshot.data();
  if (profile.authUid !== user.uid || profile.status !== "active") {
    throw new Error("This teacher account is inactive or not linked. Please contact the Head Master.");
  }
  return {
    teacherId,
    name: profile.name,
    gender: profile.gender,
    assignedClasses: profile.assignedClasses || [],
    teachingSubjects: profile.teachingSubjects || [],
    status: profile.status,
    linked: true
  };
}
