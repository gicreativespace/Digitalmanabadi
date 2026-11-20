import { adminDb, applyCors, json, requireHeadMaster, safeError, FieldValue, normalizeMobile, generateSecretCode, encryptSecretCode, hmac } from "../../../lib/backend/admin.js";
import { classNumberFromId, currentAcademicYearCode, validateDob } from "../../../lib/backend/ids.js";
import crypto from "node:crypto";

function clean(value, max = 120) { return String(value ?? "").trim().slice(0, max); }

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    const hm = await requireHeadMaster(req);
    const classId = String(req.query?.classId || "");
    const classNumber = classNumberFromId(classId);
    const db = adminDb();
    const classroomRef = db.collection("classrooms").doc(classId);

    if (req.method === "GET") {
      const snap = await db.collection("students")
        .where("schoolId", "==", hm.schoolId)
        .where("classId", "==", classId).get();
      const students = [];
      const batch = db.batch();
      for (const doc of snap.docs) {
        const data = doc.data();
        let secretCode = null;
        if (data.secretCodeCiphertext && data.secretCodeIv && data.secretCodeTag) {
          const { decryptSecretCode } = await import("../../../lib/backend/admin.js");
          secretCode = decryptSecretCode(data);
        }
        students.push({
          studentRecordId: doc.id,
          name: data.name,
          gender: data.gender,
          dob: data.dob,
          guardianName: data.guardianName,
          relationship: data.relationship,
          parentMobile: data.parentMobile,
          classId: data.classId,
          section: data.section || "",
          rollNumber: data.rollNumber,
          studentId: data.studentId,
          permanentStudentId: data.permanentStudentId,
          secretCode,
          status: data.status || "active"
        });
        batch.set(db.collection("securityAudit").doc(), {
          action: "HEAD_MASTER_VIEWED_STUDENT_SECRET",
          actorUid: hm.uid,
          schoolId: hm.schoolId,
          studentRecordId: doc.id,
          createdAt: FieldValue.serverTimestamp()
        });
      }
      if (students.length) await batch.commit();
      return json(res, 200, { students });
    }

    if (req.method === "POST") {
      const name = clean(req.body?.name);
      const gender = clean(req.body?.gender, 20);
      const dob = validateDob(req.body?.dob);
      const guardianName = clean(req.body?.guardianName);
      const relationship = clean(req.body?.relationship, 40);
      const parentMobile = normalizeMobile(req.body?.parentMobile);
      const section = clean(req.body?.section, 2).toUpperCase();
      if (name.length < 2 || guardianName.length < 2 || !["Male", "Female", "Other"].includes(gender) || !relationship) {
        return json(res, 400, { error: "Enter all required student and guardian details." });
      }
      if (section && !/^[A-Z]$/.test(section)) return json(res, 400, { error: "Enter a valid section letter." });

      const year = currentAcademicYearCode();
      const counterRef = db.collection("studentCounters").doc(hm.schoolId + "_" + year + "_" + classId + (section || ""));
      const recordId = crypto.randomUUID();
      let created = null;
      let collisionResolved = false;
      for (let attempt = 0; attempt < 3 && !collisionResolved; attempt++) {
        try {
          await db.runTransaction(async tx => {
            const counterSnap = await tx.get(counterRef);
            const secretCode = generateSecretCode();
            const encrypted = encryptSecretCode(secretCode);
            const secretCodeHash = hmac("secret:" + secretCode);
            const secretCodeRef = db.collection("studentSecretCodes").doc(secretCodeHash);
            const secretCodeSnap = await tx.get(secretCodeRef);
            if (secretCodeSnap.exists) throw Object.assign(new Error("Secret Code collision. Please retry."), { code: "SECRET_CODE_COLLISION", status: 409 });
            const lastRoll = Number(counterSnap.exists ? counterSnap.data().lastRoll || 0 : 0);
            const roll = lastRoll + 1;
            if (roll > 99) throw Object.assign(new Error("This class sequence is full for the current academic year."), { status: 409 });
            const rollNumber = String(roll).padStart(2, "0");
            const studentId = year + String(classNumber).padStart(2, "0") + rollNumber + (section || "");
            const studentRef = db.collection("students").doc(recordId);
            tx.create(studentRef, {
              permanentStudentId: recordId,
              schoolId: hm.schoolId,
              classId,
              section,
              rollNumber,
              studentId,
              academicYear: year,
              name, gender, dob, guardianName, relationship, parentMobile,
              parentMobileHash: hmac("mobile:" + parentMobile),
              secretCodeCiphertext: encrypted.ciphertext,
              secretCodeIv: encrypted.iv,
              secretCodeTag: encrypted.tag,
              secretCodeHash,
              status: "active",
              createdBy: hm.uid,
              createdAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp()
            });
            tx.create(secretCodeRef, { studentRecordId: recordId, schoolId: hm.schoolId, createdAt: FieldValue.serverTimestamp() });
            tx.set(counterRef, { lastRoll: roll, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
            tx.set(classroomRef, {
              schoolId: hm.schoolId,
              classId,
              classNumber,
              updatedBy: hm.uid,
              updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });
            created = { studentRecordId: recordId, studentId, rollNumber, secretCode };
          });
          collisionResolved = true;
        } catch (error) {
          if (error?.code !== "SECRET_CODE_COLLISION" || attempt === 2) throw error;
        }
      }
      return json(res, 201, { student: created });
    }

    res.setHeader("Allow", "GET, POST, OPTIONS");
    return json(res, 405, { error: "Method not allowed." });
  } catch (error) { return safeError(res, error); }
}
