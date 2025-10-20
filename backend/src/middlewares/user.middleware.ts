import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token faltando" });

  try {
    const payload = jwt.verify(token, SECRET);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token Inválido" });
  }
}
