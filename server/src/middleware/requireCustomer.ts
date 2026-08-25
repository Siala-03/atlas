import { NextFunction, Request, Response } from "express";
import { verifyCustomerToken } from "../lib/customerAuth";

export function requireCustomer(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  const payload = verifyCustomerToken(token);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.locals.customerId = payload.customerId;
  next();
}
