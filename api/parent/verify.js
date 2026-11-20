import { adminDb, adminAuth, applyCors, json, safeError, normalizeMobile, hmac, FieldValue } from "../_lib/admin.js";
import crypto from "node:crypto";
import { validateDob } from "../_lib/ids.js";

function sameHash(a, b) {
  const left = Buffer.from(String(a || ""), "hex");
  const right = Buffer.from(String(b || ""), "hex");
  return left.length === right.length && left.length > 0 && crypto.timingSafeEqual(left, right);
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    if (req.method !== "POST") { res.setHeader("Allow", "POST, OPTIONS"); return json(res, 405, { error: "Method not allowed." }); }
    const mobile = normalizeMobile(req.body?.mobile);
    const studentRecordId = String(req.body?.studentRecordId || "");
    const dob = validateDob(req.body?.dob);
    const secretCode = String(req.body?.secretCode || "").trim();
    if (!/^[0-9]{12}$/.test(secretCode) || !/^[a-f0-9-]{36}$/i.test(studentRecordId)) {
      return json(res, 400, { error: "Student details could not be verified." });
    }

    const db = adminDb();
    const studentRef = db.collection("students").doc(studentRecordId);
    const linkRef = db.collection("parentLinks").doc(studentRecordId);
    const attemptRef = db.collection("parentVerificationAttempts").doc(hmac("verify:" + mobile + ":" + studentRecordId));
    const verification = await db.runTransaction(async tx => {
      const [studentSnap, linkSnap, attemptSnap] = await Promise.all([tx.get(studentRef), tx.get(linkRef), tx.get(attemptRef)]);
      const now = Date.now();
      const attempt = attemptSnap.exists ? attemptSnap.data() : {};
      if (Number(attempt.lockUntilMs || 0) > now) return { kind: "locked" };
      if (!studentSnap.exists) {
        const failures = Number(attempt.failures || 0) + 1;
        tx.set(attemptRef, { failures, lockUntilMs: failures >= 5 ? now + 60000 : 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        return { kind: "invalid" };
      }
      const student = studentSnap.data();
      const valid = student.status === "active"
        && student.parentMobileHash === hmac("mobile:" + mobile)
        && String(student.dob || "") === dob
        && sameHash(student.secretCodeHash, hmac("secret:" + secretCode));
      if (!valid) {
        const failures = Number(attempt.failures || 0) + 1;
        tx.set(attemptRef, { failures, lockUntilMs: failures >= 5 ? now + 60000 : 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        return { kind: "invalid", lockedAfter: failures >= 5 };
      }
      if (linkSnap.exists && linkSnap.data().parentMobileHash !== hmac("mobile:" + mobile)) return { kind: "already-linked" };
      tx.set(linkRef, {
        studentRecordId,
        schoolId: student.schoolId,
        parentMobileHash: hmac("mobile:" + mobile),
        parentUid: "parent_" + hmac("account:" + mobile),
        linkedAt: linkSnap.exists ? linkSnap.data().linkedAt : FieldValue.serverTimestamp(),
        lastVerifiedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      tx.set(studentRef, { parentLinked: true, parentLinkedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      tx.set(attemptRef, { failures: 0, lockUntilMs: 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return { kind: "verified", parentUid: "parent_" + hmac("account:" + mobile), student: { studentRecordId, schoolId: student.schoolId, name: student.name, studentId: student.studentId, classId: student.classId } };
    });

    if (verification.kind === "locked") return json(res, 429, { error: "Too many incorrect attempts. Try again in 60 seconds.", retryAfterSeconds: 60 });
    if (verification.kind === "already-linked") return json(res, 409, { error: "Already Linked. This student is connected to another Parent Mobile Account." });
    if (verification.kind !== "verified") return json(res, 401, { error: verification.lockedAfter ? "Verification is locked for 60 seconds." : "Student details could not be verified.", retryAfterSeconds: verification.lockedAfter ? 60 : 0 });

    const customToken = await adminAuth().createCustomToken(verification.parentUid, { role: "parent", mobileHash: hmac("mobile:" + mobile) });
    await db.collection("securityAudit").add({
      action: "PARENT_STUDENT_VERIFIED",
      studentRecordId,
      parentUid: verification.parentUid,
      schoolId: verification.student.schoolId || null,
      createdAt: FieldValue.serverTimestamp()
    });
    return json(res, 200, { customToken, student: verification.student });
  } catch (error) { return safeError(res, error); }
}
