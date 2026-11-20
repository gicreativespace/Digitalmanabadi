import { adminDb, applyCors, json, safeError, normalizeMobile, hmac, FieldValue } from "../_lib/admin.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    if (req.method !== "POST") { res.setHeader("Allow", "POST, OPTIONS"); return json(res, 405, { error: "Method not allowed." }); }
    const mobile = normalizeMobile(req.body?.mobile);
    const db = adminDb();
    const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
    const lookupId = hmac("lookup:" + mobile);
    const attemptRef = db.collection("parentLookupAttempts").doc(lookupId);
    const result = await db.runTransaction(async tx => {
      const snap = await tx.get(attemptRef);
      const now = Date.now();
      const data = snap.exists ? snap.data() : {};
      if (Number(data.lockUntilMs || 0) > now) return { locked: true };
      const windowMs = 15 * 60 * 1000;
      const started = Number(data.windowStartedAtMs || 0);
      const priorCount = started && now - started < windowMs ? Number(data.count || 0) : 0;
      const windowStartedAtMs = priorCount ? started : now;
      const count = priorCount + 1;
      tx.set(attemptRef, { count, windowStartedAtMs, lockUntilMs: count >= 10 ? now + windowMs : 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return { allowed: count < 10 };
    });
    if (result.locked || !result.allowed) return json(res, 429, { error: "Too many attempts. Please try again later." });
    const snap = await db.collection("students").where("parentMobileHash", "==", hmac("mobile:" + mobile)).get();
    const students = snap.docs.map(d => {
      const s = d.data();
      return { studentRecordId: d.id, name: s.name, studentId: s.studentId, classId: s.classId, section: s.section || "", rollNumber: s.rollNumber };
    });
    return json(res, 200, { students });
  } catch (error) { return safeError(res, error); }
}
