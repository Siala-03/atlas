import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/adminAuth";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
