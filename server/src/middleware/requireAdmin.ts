import { NextFunction, Request, Response } from "express";
import { Role, TokenPayload, verifyToken } from "../lib/adminAuth";

function extractPayload(req: Request): TokenPayload | null {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  return verifyToken(token);
}

// Any authenticated staff or admin session.
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const payload = extractPayload(req);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.locals.session = payload;
  next();
}

// A specific role only - e.g. requireRole("admin") for price/stock/team
// changes that staff accounts shouldn't be able to make.
export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = extractPayload(req);
    if (!payload) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (payload.role !== role) {
      res.status(403).json({ error: "You don't have permission to do that." });
      return;
    }
    res.locals.session = payload;
    next();
  };
}
