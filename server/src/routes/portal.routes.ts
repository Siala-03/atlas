import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { checkAdminPassword, issueToken } from "../lib/adminAuth";

export const portalRouter = Router();

const LoginSchema = z.object({
  password: z.string().min(1)
});

portalRouter.post("/portal/login", asyncHandler(async (req, res) => {
  const { password } = LoginSchema.parse(req.body);

  if (!checkAdminPassword(password)) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  res.json({ token: issueToken() });
}));
