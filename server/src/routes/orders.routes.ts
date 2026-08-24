import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/requireAdmin";
import { verifyToken } from "../lib/adminAuth";
import * as orderService from "../services/orderService";
import {
  CreateOrderSchema,
  InternalNotesSchema,
  InvoiceStatusSchema,
  OrderDetailsPatchSchema,
  OrderStatusSchema } from
"../validation/schemas";

export const ordersRouter = Router();

ordersRouter.get("/orders", requireAdmin, asyncHandler(async (req, res) => {
  const { status, invoiceStatus, search } = req.query;
  res.json(await orderService.listOrders({
    status: typeof status === "string" ? status : undefined,
    invoiceStatus: typeof invoiceStatus === "string" ? invoiceStatus : undefined,
    search: typeof search === "string" ? search : undefined
  }));
}));

// Public: order confirmation pages look up their own order by id, which acts
// as an unguessable capability token. Internal notes are admin-only, so they
// get stripped unless the caller is authenticated as admin.
ordersRouter.get("/orders/:id", asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.params.id);
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!verifyToken(token)) {
    res.json({ ...order, internalNotes: undefined });
    return;
  }
  res.json(order);
}));

ordersRouter.post("/orders", asyncHandler(async (req, res) => {
  const body = CreateOrderSchema.parse(req.body);
  const order = await orderService.createOrder(body);
  res.status(201).json(order);
}));

ordersRouter.patch("/orders/:id/details", requireAdmin, asyncHandler(async (req, res) => {
  const patch = OrderDetailsPatchSchema.parse(req.body);
  res.json(await orderService.updateOrderDetails(req.params.id, patch));
}));

ordersRouter.patch("/orders/:id/status", requireAdmin, asyncHandler(async (req, res) => {
  const { status } = OrderStatusSchema.parse(req.body);
  res.json(await orderService.updateOrderStatus(req.params.id, status));
}));

ordersRouter.patch("/orders/:id/internal-notes", requireAdmin, asyncHandler(async (req, res) => {
  const { internalNotes } = InternalNotesSchema.parse(req.body);
  res.json(await orderService.updateInternalNotes(req.params.id, internalNotes));
}));

ordersRouter.patch("/orders/:id/invoice-status", requireAdmin, asyncHandler(async (req, res) => {
  const { invoiceStatus } = InvoiceStatusSchema.parse(req.body);
  res.json(await orderService.updateInvoiceStatus(req.params.id, invoiceStatus));
}));

ordersRouter.post("/orders/:id/reorder", requireAdmin, asyncHandler(async (req, res) => {
  res.json(await orderService.reorder(req.params.id));
}));
