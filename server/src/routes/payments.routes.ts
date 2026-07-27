import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as paymentService from "../services/paymentService";
import { InitiatePaymentSchema, MockCallbackSchema } from "../validation/schemas";

export const paymentsRouter = Router();

paymentsRouter.post("/payments/initiate", asyncHandler(async (req, res) => {
  const { orderId } = InitiatePaymentSchema.parse(req.body);
  res.json(await paymentService.initiatePayment(orderId));
}));

paymentsRouter.post("/payments/mock-callback", asyncHandler(async (req, res) => {
  const { providerRef, outcome } = MockCallbackSchema.parse(req.body);
  res.json(await paymentService.recordCallback(providerRef, outcome));
}));

paymentsRouter.get("/payments/order/:orderId", asyncHandler(async (req, res) => {
  res.json(await paymentService.getPaymentForOrder(req.params.orderId));
}));
