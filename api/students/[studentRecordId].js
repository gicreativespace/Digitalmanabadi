import { adminDb, applyCors, json, requireHeadMaster, safeError, normalizeMobile, hmac, FieldValue } from "../../lib/backend/admin.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    if (req.method !== "PATCH") { res.setHeader("Allow", "PATCH, OPTIONS"); return json(res, 405, { error: "Method not allowed." }); }
    const hm = await requireHeadMaster(req);
    const id = String(req.query?.studentRecordId || "");
    if (!/^[a-f0-9-]{36}$/i.test(id)) return json(res, 400, { error: "Invalid student record." });
    const mobile = normalizeMobile(req.body?.parentMobile);
    const db = adminDb();
    const studentRef = db.collection("students").doc(id);
    const linkRef = db.collection("parentLinks").doc(id);
    const outcome = await db.runTransaction(async tx => {
      const studentSnap = await tx.get(studentRef);
      const linkSnap = await tx.get(linkRef);
      if (!studentSnap.exists || studentSnap.data().schoolId !== hm.schoolId) return { missing: true };
      const previousHash = studentSnap.data().parentMobileHash;
      const nextHash = hmac("mobile:" + mobile);
      tx.update(studentRef, { parentMobile: mobile, parentMobileHash: nextHash, parentLinked: previousHash !== nextHash ? false : Boolean(studentSnap.data().parentLinked), updatedBy: hm.uid, updatedAt: FieldValue.serverTimestamp() });
      if (linkSnap.exists && linkSnap.data().parentMobileHash !== nextHash) tx.delete(linkRef);
      return { changed: previousHash !== nextHash };
    });
    if (outcome.missing) return json(res, 404, { error: "Student record was not found." });
    await db.collection("securityAudit").add({ action: "HEAD_MASTER_CHANGED_PARENT_MOBILE", actorUid: hm.uid, schoolId: hm.schoolId, studentRecordId: id, createdAt: FieldValue.serverTimestamp() });
    return json(res, 200, { updated: true, parentLinkReset: outcome.changed });
  } catch (error) { return safeError(res, error); }
}
