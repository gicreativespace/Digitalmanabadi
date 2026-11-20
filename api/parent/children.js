import { adminAuth, adminDb, applyCors, json, safeError, hmac } from "../../lib/backend/admin.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    if (req.method !== "GET") { res.setHeader("Allow", "GET, OPTIONS"); return json(res, 405, { error: "Method not allowed." }); }
    const header = String(req.headers.authorization || "");
    const match = /^Bearer\\s+(.+)$/i.exec(header);
    if (!match) return json(res, 401, { error: "Parent sign-in is required." });
    let decoded;
    try { decoded = await adminAuth().verifyIdToken(match[1], true); }
    catch { return json(res, 401, { error: "Parent session is invalid. Please verify again." }); }
    if (decoded.role !== "parent" || !decoded.mobileHash) return json(res, 403, { error: "Parent access is required." });
    const links = await adminDb().collection("parentLinks").where("parentUid", "==", decoded.uid).get();
    const children = [];
    for (const link of links.docs) {
      const snap = await adminDb().collection("students").doc(link.id).get();
      if (!snap.exists) continue;
      const s = snap.data();
      if (s.status !== "active" || s.parentMobileHash !== decoded.mobileHash) continue;
      children.push({ studentRecordId: link.id, name: s.name, studentId: s.studentId, classId: s.classId, section: s.section || "", rollNumber: s.rollNumber, guardianName: s.guardianName });
    }
    return json(res, 200, { children });
  } catch (error) { return safeError(res, error); }
}
