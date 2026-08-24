import { z } from "zod";

export const CATEGORIES = ["Whisky", "Vodka", "Wine", "Beer", "Gin", "Rum"] as const;
export const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Dispatched", "Delivered", "Cancelled"] as const;
export const INVOICE_STATUSES = ["To invoice", "Invoiced", "Paid"] as const;
export const PAYMENT_METHODS = ["card", "momo"] as const;

export const CheckoutDetailsSchema = z.object({
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  neighborhood: z.string().min(1),
  streetNumber: z.string().min(1),
  houseNumber: z.string().optional(),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
  deliveryDate: z.string().optional(),
  notes: z.string().optional().default(""),
  isBusinessCheckout: z.boolean().optional().default(false),
  companyName: z.string().optional(),
  tin: z.string().optional(),
  needsEbm: z.boolean().optional().default(false),
  ebmPurchaseCode: z.string().optional(),
  ebmInvoiceEmail: z.string().optional()
}).
refine((data) => !data.isBusinessCheckout || !!data.companyName?.trim(), {
  message: "Company name is required for business orders",
  path: ["companyName"]
}).
refine((data) => !data.isBusinessCheckout || !!data.tin?.trim(), {
  message: "TIN is required for business orders",
  path: ["tin"]
}).
refine((data) => !data.needsEbm || !!data.ebmPurchaseCode?.trim(), {
  message: "Purchase code is required when an EBM invoice is requested",
  path: ["ebmPurchaseCode"]
}).
refine((data) => !data.needsEbm || z.string().email().safeParse(data.ebmInvoiceEmail).success, {
  message: "A valid invoice email is required when an EBM invoice is requested",
  path: ["ebmInvoiceEmail"]
});

export const SHOPPING_MODES = ["individual", "business"] as const;

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  mode: z.enum(SHOPPING_MODES),
  quantity: z.number().int().positive()
});

export const CreateOrderSchema = z.object({
  details: CheckoutDetailsSchema,
  cart: z.array(CartItemSchema).min(1),
  paymentMethod: z.enum(PAYMENT_METHODS).default("card")
});

export const ProductPatchSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  subtype: z.string().min(1).optional().nullable(),
  abv: z.number().nonnegative().optional(),
  volume: z.string().min(1).optional(),
  origin: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  casePrice: z.number().int().nonnegative().optional(),
  unitsPerCase: z.number().int().positive().optional(),
  stockUnits: z.number().int().nonnegative().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  image: z.string().min(1).optional()
});

export const ProductCreateSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  subtype: z.string().min(1).optional(),
  abv: z.number().nonnegative(),
  volume: z.string().min(1),
  origin: z.string().min(1),
  description: z.string().min(1),
  casePrice: z.number().int().nonnegative(),
  unitsPerCase: z.number().int().positive(),
  stockUnits: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative(),
  image: z.string().min(1)
});

export const RestockSchema = z.object({
  units: z.number().int().positive()
});

export const OrderDetailsPatchSchema = z.object({
  contactName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  deliveryAddress: z.string().min(1).optional(),
  deliveryDate: z.string().optional().nullable(),
  notes: z.string().optional()
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

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(4, "New password must be at least 4 characters")
});

export const CreateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["admin", "staff"])
});
