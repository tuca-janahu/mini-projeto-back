import { Router } from "express";
import db from "../database/configdb";

const r = Router();

r.get("/db", async (_req, res) => {
  try {
    const conn = await db.connect();
    const admin = conn?.connection?.db?.admin?.();
    const ping = admin ? await admin.ping() : null;
    res.json({ ok: true, db: conn?.connection?.name ?? null, mongo: ping });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message });
  }
});

r.get("/", (_req, res) => res.json({ ok: true }));

export default r;
