import { adminDb, applyCors, json, safeError, normalizeMobile, hmac, FieldValue } from "../../lib/backend/admin.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    if (req.method !== "POST") { res.setHeader("Allow", "POST, OPTIONS"); return json(res, 405, { error: "Method not allowed." }); }
    const mobile = normalizeMobile(req.body?.mobile);
    const db = adminDb();
    const lookupId = hmac("lookup:" + mobile);
    const ip = String(req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim().slice(0, 100);
    const ipLookupId = hmac("lookup-ip:" + ip);
    const attemptRef = db.collection("parentLookupAttempts").doc(lookupId);
    const ipAttemptRef = db.collection("parentLookupIpAttempts").doc(ipLookupId);
    const result = await db.runTransaction(async tx => {
      const [snap, ipSnap] = await Promise.all([tx.get(attemptRef), tx.get(ipAttemptRef)]);
      const now = Date.now();
      const data = snap.exists ? snap.data() : {};
      const ipData = ipSnap.exists ? ipSnap.data() : {};
      const windowMs = 15 * 60 * 1000;
      if (Number(data.lockUntilMs || 0) > now || Number(ipData.lockUntilMs || 0) > now) return { locked: true };
      const started = Number(data.windowStartedAtMs || 0);
      const priorCount = started && now - started < windowMs ? Number(data.count || 0) : 0;
      const windowStartedAtMs = priorCount ? started : now;
      const count = priorCount + 1;
      const ipStarted = Number(ipData.windowStartedAtMs || 0);
      const ipPriorCount = ipStarted && now - ipStarted < windowMs ? Number(ipData.count || 0) : 0;
      const ipWindowStartedAtMs = ipPriorCount ? ipStarted : now;
      const ipCount = ipPriorCount + 1;
      tx.set(attemptRef, { count, windowStartedAtMs, lockUntilMs: count >= 10 ? now + windowMs : 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      tx.set(ipAttemptRef, { count: ipCount, windowStartedAtMs: ipWindowStartedAtMs, lockUntilMs: ipCount >= 120 ? now + windowMs : 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return { allowed: count < 10 && ipCount < 120 };
    });
    if (result.locked || !result.allowed) return json(res, 429, { error: "Too many attempts. Please try again later." });
    const snap = await db.collection("students").where("parentMobileHash", "==", hmac("mobile:" + mobile)).get();
    const students = snap.docs.filter(d => d.data().status === "active").map(d => {
      const s = d.data();
      return { studentRecordId: d.id, name: s.name, studentId: s.studentId, classId: s.classId, section: s.section || "", rollNumber: s.rollNumber };
    });
    return json(res, 200, { students });
  } catch (error) { return safeError(res, error); }
}
