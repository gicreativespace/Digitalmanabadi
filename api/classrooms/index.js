import { adminDb, applyCors, json, requireHeadMaster, safeError, FieldValue } from "../../lib/backend/admin.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    const hm = await requireHeadMaster(req);
    const db = adminDb();
    if (req.method === "GET") {
      const snap = await db.collection("classrooms").where("schoolId", "==", hm.schoolId).get();
      const byId = new Map(snap.docs.map(d => [d.id, { id: d.id, ...d.data() }]));
      const classes = Array.from({ length: 5 }, (_, i) => {
        const classId = "class-" + (i + 1);
        const saved = byId.get(classId) || {};
        return { id: classId, classNumber: i + 1, title: "Class " + (i + 1), sectionsEnabled: Boolean(saved.sectionsEnabled), updatedAt: saved.updatedAt || null };
      });
      return json(res, 200, { classes });
    }
    if (req.method === "POST") {
      const classId = String(req.body?.classId || "");
      if (!/^class-[1-5]$/.test(classId)) return json(res, 400, { error: "Choose a valid class." });
      const sectionsEnabled = Boolean(req.body?.sectionsEnabled);
      await db.collection("classrooms").doc(classId).set({
        schoolId: hm.schoolId,
        classId,
        classNumber: Number(classId.slice(-1)),
        sectionsEnabled,
        createdBy: hm.uid,
        updatedBy: hm.uid,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      return json(res, 200, { classId, sectionsEnabled });
    }
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return json(res, 405, { error: "Method not allowed." });
  } catch (error) { return safeError(res, error); }
}
