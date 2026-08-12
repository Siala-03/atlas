import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Invalid request", details: err.flatten() });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ->`, err);
  res.status(500).json({ error: "Internal server error" });
}
