import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as orderService from "../services/orderService";
import {
  CreateOrderSchema,
  InternalNotesSchema,
  InvoiceStatusSchema,
  OrderStatusSchema } from
"../validation/schemas";

export const ordersRouter = Router();

ordersRouter.get("/orders", asyncHandler(async (req, res) => {
  const { status, invoiceStatus, accountId, search } = req.query;
  res.json(await orderService.listOrders({
    status: typeof status === "string" ? status : undefined,
    invoiceStatus: typeof invoiceStatus === "string" ? invoiceStatus : undefined,
    accountId: typeof accountId === "string" ? accountId : undefined,
    search: typeof search === "string" ? search : undefined
  }));
}));

ordersRouter.get("/orders/:id", asyncHandler(async (req, res) => {
  res.json(await orderService.getOrder(req.params.id));
}));

ordersRouter.post("/orders", asyncHandler(async (req, res) => {
  const body = CreateOrderSchema.parse(req.body);
  const order = await orderService.createOrder(body);
  res.status(201).json(order);
}));

ordersRouter.patch("/orders/:id/status", asyncHandler(async (req, res) => {
  const { status } = OrderStatusSchema.parse(req.body);
  res.json(await orderService.updateOrderStatus(req.params.id, status));
}));

ordersRouter.patch("/orders/:id/internal-notes", asyncHandler(async (req, res) => {
  const { internalNotes } = InternalNotesSchema.parse(req.body);
  res.json(await orderService.updateInternalNotes(req.params.id, internalNotes));
}));

ordersRouter.patch("/orders/:id/invoice-status", asyncHandler(async (req, res) => {
  const { invoiceStatus } = InvoiceStatusSchema.parse(req.body);
  res.json(await orderService.updateInvoiceStatus(req.params.id, invoiceStatus));
}));

ordersRouter.post("/orders/:id/reorder", asyncHandler(async (req, res) => {
  res.json(await orderService.reorder(req.params.id));
}));
