import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { changeAdminPassword, checkAdminPassword, issueToken } from "../lib/adminAuth";
import { requireAdmin } from "../middleware/requireAdmin";
import { ChangePasswordSchema } from "../validation/schemas";

export const portalRouter = Router();

const LoginSchema = z.object({
  password: z.string().min(1)
});

portalRouter.post("/portal/login", asyncHandler(async (req, res) => {
  const { password } = LoginSchema.parse(req.body);

  if (!(await checkAdminPassword(password))) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  res.json({ token: issueToken() });
}));

portalRouter.post("/portal/change-password", requireAdmin, asyncHandler(async (req, res) => {
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
