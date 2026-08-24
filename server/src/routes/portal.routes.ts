import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  changeAdminPassword,
  checkAdminPassword,
  checkStaffLogin,
  createStaffUser,
  deleteStaffUser,
  issueToken,
  listStaffUsers } from
"../lib/adminAuth";
import { requireAdmin, requireRole } from "../middleware/requireAdmin";
import { ChangePasswordSchema, CreateStaffSchema } from "../validation/schemas";
import { AppError } from "../errors";

export const portalRouter = Router();

const LoginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(1)
});

portalRouter.post("/portal/login", asyncHandler(async (req, res) => {
  const { email, password } = LoginSchema.parse(req.body);

  if (email) {
    const user = await checkStaffLogin(email, password);
    if (!user) {
      res.status(401).json({ error: "Incorrect email or password" });
      return;
    }
    res.json({ token: issueToken({ role: user.role, userId: user.id }), role: user.role, name: user.name });
    return;
  }

  if (!(await checkAdminPassword(password))) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }
  res.json({ token: issueToken({ role: "admin" }), role: "admin", name: "Owner" });
}));

portalRouter.post("/portal/change-password", requireRole("admin"), asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);

  const changed = await changeAdminPassword(currentPassword, newPassword);
  if (!changed) {
    // 400, not 401 — a wrong *current* password is a form validation error,
    // not an invalid session. The frontend treats any 401 as "session
    // expired" and force-logs-out the admin, which would be the wrong
    // behavior for a simple typo here.
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }

  res.json({ ok: true });
}));

portalRouter.get("/portal/team", requireRole("admin"), asyncHandler(async (_req, res) => {
  res.json(await listStaffUsers());
}));

portalRouter.post("/portal/team", requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, email, password, role } = CreateStaffSchema.parse(req.body);
  try {
    res.status(201).json(await createStaffUser(name, email, password, role));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      throw new AppError(400, "That email already has a staff account.");
    }
    throw error;
  }
}));

portalRouter.delete("/portal/team/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  await deleteStaffUser(req.params.id);
  res.json({ ok: true });
}));

portalRouter.get("/portal/me", requireAdmin, asyncHandler(async (_req, res) => {
  res.json(res.locals.session);
}));
