import { z } from "zod";

export const CATEGORIES = ["Whisky", "Vodka", "Wine", "Beer", "Gin", "Rum"] as const;
export const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Dispatched", "Delivered", "Cancelled"] as const;
export const INVOICE_STATUSES = ["To invoice", "Invoiced", "Paid"] as const;
export const PAYMENT_METHODS = ["invoice", "card", "momo"] as const;

export const CheckoutDetailsSchema = z.object({
  business: z.string().optional().default(""),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  licenseNo: z.string().optional().default(""),
  deliveryAddress: z.string().min(1),
  deliveryDate: z.string().optional(),
  notes: z.string().optional().default("")
});

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  cases: z.number().int().positive()
});

export const CreateOrderSchema = z.object({
  details: CheckoutDetailsSchema,
  accountId: z.string().optional(),
  cart: z.array(CartItemSchema).min(1),
  paymentMethod: z.enum(PAYMENT_METHODS).default("invoice")
});

export const ProductPatchSchema = z.object({
  casePrice: z.number().int().nonnegative().optional(),
  stockCases: z.number().int().nonnegative().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional()
});

export const RestockSchema = z.object({
  cases: z.number().int().positive()
});

export const OrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES)
});

export const InternalNotesSchema = z.object({
  internalNotes: z.string()
});

export const InvoiceStatusSchema = z.object({
  invoiceStatus: z.enum(INVOICE_STATUSES)
});

export const InitiatePaymentSchema = z.object({
  orderId: z.string().min(1)
});

export const MockCallbackSchema = z.object({
  providerRef: z.string().min(1),
  outcome: z.enum(["success", "fail"])
});
