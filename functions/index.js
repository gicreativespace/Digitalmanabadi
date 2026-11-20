const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { randomBytes, scryptSync, timingSafeEqual, createHash } = require("node:crypto");

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();
const FieldValue = admin.firestore.FieldValue;
const TEACHERS = "teachers";
const COUNTERS = "teacherCounters";
const ATTEMPTS = "teacherAccessAttempts";

function fail(code, message) {
  throw new HttpsError(code, message);
}

async function requireHeadMaster(request) {
  if (!request.auth?.uid) fail("unauthenticated", "Head Master sign-in is required.");
  const snapshot = await db.collection("platformAdmins").doc(request.auth.uid).get();
  if (!snapshot.exists) fail("permission-denied", "Active Head Master access is required.");
  const profile = snapshot.data();
  if (profile.role !== "HEAD_MASTER" || profile.status !== "active") {
    fail("permission-denied", "Active Head Master access is required.");
  }
  return profile;
}

function cleanText(value, maxLength = 100) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function validDob(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    parsed.getTime() <= Date.now();
}

function cleanList(value, fieldName) {
  if (!Array.isArray(value)) fail("invalid-argument", fieldName + " must be a list.");
  const result = [...new Set(value.map(item => cleanText(item, 60)).filter(Boolean))];
  if (!result.length || result.length > 20) {
    fail("invalid-argument", "Provide between 1 and 20 " + fieldName + ".");
  }
  return result;
}

function indiaYear() {
  return new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kolkata",
    year: "numeric"
  }).format(new Date());
}

// The calculation stays on the server. Example: 15-08-1992 and 2601 => 6684.
function makeSecretCode(dob, teacherId) {
  const [year, month, day] = dob.split("-");
  const source = "9" + year.slice(-1) + month.slice(-1) + day.slice(-1);
  const value = Number(source) - Number(teacherId);
  if (!Number.isInteger(value) || value < 0 || value > 9999) {
    fail("failed-precondition", "Could not generate the teacher verification code.");
  }
  return String(value).padStart(4, "0");
}

function hashSecretCode(code, salt) {
  return scryptSync(code, salt, 32);
}

function matchesSecretCode(code, storedSalt, storedHash) {
  try {
    const salt = Buffer.from(storedSalt, "base64");
    const expected = Buffer.from(storedHash, "base64");
    const candidate = hashSecretCode(code, salt);
    return expected.length === candidate.length && timingSafeEqual(expected, candidate);
  } catch {
    return false;
  }
}

async function applyRateLimit(request, teacherId, action, maximum, windowMs) {
  const ip = cleanText(request.rawRequest?.ip || "unknown", 80);
  const keys = [
    createHash("sha256").update(ip + "|" + action).digest("hex"),
    createHash("sha256").update(ip + "|" + teacherId + "|" + action).digest("hex"),
    createHash("sha256").update("teacher|" + teacherId + "|" + action).digest("hex")
  ];
  const refs = keys.map(key => db.collection(ATTEMPTS).doc(key));
  const now = Date.now();
  let blocked = false;

  await db.runTransaction(async transaction => {
    const snapshots = await transaction.getAll(...refs);
    const windows = snapshots.map(snapshot => {
      const current = snapshot.exists ? snapshot.data() : {};
      const started = Number(current.windowStartedAt || 0);
      const inWindow = started > 0 && now - started < windowMs;
      return { started: inWindow ? started : now, count: inWindow ? Number(current.count || 0) : 0 };
    });
    if (windows.some(window => window.count >= maximum)) {
      blocked = true;
      return;
    }
    refs.forEach((ref, index) => transaction.set(ref, {
      action,
      windowStartedAt: windows[index].started,
      count: windows[index].count + 1,
      updatedAt: FieldValue.serverTimestamp()
    }));
  });

  if (blocked) fail("resource-exhausted", "Too many attempts. Please wait and try again.");
}

async function findTeacherForUid(uid) {
  const result = await db.collection(TEACHERS).where("authUid", "==", uid).limit(1).get();
  if (result.empty) return null;
  return result.docs[0];
}

function publicTeacherProfile(data, teacherId) {
  return {
    teacherId,
    name: data.name,
    gender: data.gender,
    assignedClasses: data.assignedClasses || [],
    teachingSubjects: data.teachingSubjects || [],
    status: data.status,
    linked: Boolean(data.linkedAt),
    pinSetupComplete: Boolean(data.pinSetupComplete)
  };
}

exports.createTeacher = onCall(async request => {
  await requireHeadMaster(request);
  const name = cleanText(request.data?.name, 100);
  const dob = cleanText(request.data?.dob, 10);
  const gender = cleanText(request.data?.gender, 20);
  if (name.length < 2) fail("invalid-argument", "Enter the teacher's full name.");
  if (!validDob(dob)) fail("invalid-argument", "Enter a valid date of birth.");
  if (!["Female", "Male", "Other"].includes(gender)) fail("invalid-argument", "Select a valid gender.");

  const assignedClasses = cleanList(request.data?.assignedClasses, "assigned classes");
  const teachingSubjects = cleanList(request.data?.teachingSubjects, "teaching subjects");
  const yy = indiaYear().slice(-2);
  const counterRef = db.collection(COUNTERS).doc(yy);
  let created;

  await db.runTransaction(async transaction => {
    const counterSnapshot = await transaction.get(counterRef);
    const lastSerial = counterSnapshot.exists ? Number(counterSnapshot.data().lastSerial || 0) : 0;
    const serial = lastSerial + 1;
    if (serial > 99) fail("resource-exhausted", "The yearly Teacher ID sequence is full.");
    const teacherId = yy + String(serial).padStart(2, "0");
    const secretCode = makeSecretCode(dob, teacherId);
    const salt = randomBytes(16);
    const hash = hashSecretCode(secretCode, salt);
    const teacherRef = db.collection(TEACHERS).doc(teacherId);

    transaction.create(teacherRef, {
      teacherId,
      name,
      dob,
      gender,
      assignedClasses,
      teachingSubjects,
      status: "active",
      authUid: null,
      secretCodeSalt: salt.toString("base64"),
      secretCodeHash: hash.toString("base64"),
      linkedAt: null,
      pinSetupComplete: false,
      createdBy: request.auth.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    transaction.set(counterRef, {
      lastSerial: serial,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    created = { teacherId, secretCode };
  });

  return created;
});

exports.listTeachers = onCall(async request => {
  await requireHeadMaster(request);
  const snapshot = await db.collection(TEACHERS).orderBy("createdAt", "desc").limit(200).get();
  return {
    teachers: snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        teacherId: doc.id,
        name: data.name,
        gender: data.gender,
        assignedClasses: data.assignedClasses || [],
        teachingSubjects: data.teachingSubjects || [],
        status: data.status,
        linked: Boolean(data.linkedAt),
        createdAt: data.createdAt?.toDate?.().toISOString?.() || null
      };
    })
  };
});

exports.lookupTeacherName = onCall(async request => {
  const teacherId = cleanText(request.data?.teacherId, 8);
  if (!/^\d{4}$/.test(teacherId)) fail("invalid-argument", "Enter a valid Teacher ID.");
  await applyRateLimit(request, teacherId, "lookup", 20, 15 * 60 * 1000);
  const snapshot = await db.collection(TEACHERS).doc(teacherId).get();
  if (!snapshot.exists || snapshot.data().status !== "active") {
    fail("not-found", "Teacher ID was not found. Please check it and try again.");
  }
  return { name: snapshot.data().name };
});

exports.verifyTeacherIdentity = onCall(async request => {
  const teacherId = cleanText(request.data?.teacherId, 8);
  const secretCode = cleanText(request.data?.secretCode, 8);
  const dob = cleanText(request.data?.dob, 10);
  if (!/^\d{4}$/.test(teacherId) || !/^\d{4}$/.test(secretCode) || !validDob(dob)) {
    fail("invalid-argument", "Enter the Teacher ID, Secret Code and Date of Birth.");
  }
  await applyRateLimit(request, teacherId, "verify", 5, 15 * 60 * 1000);

  const teacherRef = db.collection(TEACHERS).doc(teacherId);
  const snapshot = await teacherRef.get();
  if (!snapshot.exists) fail("not-found", "Teacher details could not be verified.");
  const data = snapshot.data();
  if (data.status !== "active" || data.dob !== dob ||
      !matchesSecretCode(secretCode, data.secretCodeSalt, data.secretCodeHash)) {
    fail("permission-denied", "The verification details do not match.");
  }
  if (data.linkedAt) fail("already-exists", "This teacher account has already been linked. Contact the Head Master for help.");

  const uid = "teacher_" + teacherId;
  try {
    await auth.getUser(uid);
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error;
    await auth.createUser({ uid, displayName: data.name, disabled: false });
  }

  await teacherRef.update({
    authUid: uid,
    pendingEnrollmentAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  const customToken = await auth.createCustomToken(uid, { role: "TEACHER", teacherId });
  return { customToken, teacherId };
});

exports.completeTeacherEnrollment = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid || request.auth.token?.role !== "TEACHER") {
    fail("unauthenticated", "Teacher authentication is required.");
  }
  const teacherDoc = await findTeacherForUid(uid);
  if (!teacherDoc) fail("permission-denied", "Teacher profile was not found.");
  const data = teacherDoc.data();
  if (data.status !== "active") fail("permission-denied", "This teacher account is inactive.");
  if (data.linkedAt) return { success: true };
  if (!data.pendingEnrollmentAt) fail("failed-precondition", "Complete identity verification first.");

  await teacherDoc.ref.update({
    linkedAt: FieldValue.serverTimestamp(),
    pinSetupComplete: true,
    pendingEnrollmentAt: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp()
  });
  return { success: true };
});

exports.getTeacherProfile = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid || request.auth.token?.role !== "TEACHER") {
    fail("unauthenticated", "Teacher authentication is required.");
  }
  const teacherDoc = await findTeacherForUid(uid);
  if (!teacherDoc) fail("permission-denied", "Teacher profile was not found.");
  const data = teacherDoc.data();
  if (data.status !== "active" || !data.linkedAt) {
    fail("permission-denied", "Teacher account setup is not complete.");
  }
  return publicTeacherProfile(data, teacherDoc.id);
});
