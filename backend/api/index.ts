import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import db from "../src/database/configdb";

// Conecta no Mongo (cache global dentro do connect)
let bootstrapped = false;
async function ensureBoot() {
  if (!bootstrapped) {
    await db.connect();
    bootstrapped = true;
  }
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureBoot();
  return (app as any)(req, res);
}
