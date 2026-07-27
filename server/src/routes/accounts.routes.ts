import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import * as accountService from "../services/accountService";
import { CheckoutDetailsSchema } from "../validation/schemas";

export const accountsRouter = Router();

const SaveAccountSchema = z.object({
  details: CheckoutDetailsSchema,
  accountId: z.string().optional()
});

accountsRouter.get("/accounts/:id", asyncHandler(async (req, res) => {
  res.json(await accountService.getAccount(req.params.id));
}));

accountsRouter.put("/accounts", asyncHandler(async (req, res) => {
  const { details, accountId } = SaveAccountSchema.parse(req.body);
  res.json(await accountService.saveTradeAccount(details, accountId));
}));
