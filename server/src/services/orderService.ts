import { prisma } from "../db";
import { NotFoundError, StockConflictError } from "../errors";
import { computeTotals } from "../lib/money";
import { generateReference } from "../lib/reference";
import { bottlePrice, caseTotalPrice, resolveMode } from "../lib/productRules";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from "../lib/mailer";
import { z } from "zod";
import { CartItemSchema, CheckoutDetailsSchema } from "../validation/schemas";

type CheckoutDetails = z.infer<typeof CheckoutDetailsSchema>;
type CartItem = z.infer<typeof CartItemSchema>;

const ORDER_INCLUDE = { lines: true, payments: { orderBy: { createdAt: "desc" as const } } };

export function listOrders(filters: { status?: string; invoiceStatus?: string; search?: string }) {
  return prisma.order.findMany({
    where: {
      status: filters.status || undefined,
      invoiceStatus: filters.invoiceStatus || undefined,
      ...(filters.search ?
      {
        OR: [
        { reference: { contains: filters.search } },
        { contactName: { contains: filters.search } }]

      } :
      {})
    },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" }
  });
}

export async function getOrder(id: string) {
  const order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  if (!order) throw new NotFoundError("Order");
  return order;
}

export async function createOrder(params: {
  details: CheckoutDetails;
  cart: CartItem[];
  paymentMethod: "card" | "momo";
}) {
  const { details, cart, paymentMethod } = params;

  return prisma.$transaction(async (tx) => {
    const lines: {
      productId: string;
      name: string;
      brand: string;
      mode: string;
      quantity: number;
      unitsPerCase: number;
      casePrice: number;
      unitPrice: number;
    }[] = [];

    for (const item of cart) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new StockConflictError([item.productId]);

      const mode = resolveMode(product.category, item.mode);
      const unitsNeeded = mode === "business" ? item.quantity * product.unitsPerCase : item.quantity;

      const result = await tx.product.updateMany({
        where: { id: item.productId, stockUnits: { gte: unitsNeeded } },
        data: { stockUnits: { decrement: unitsNeeded } }
      });
      if (result.count === 0) throw new StockConflictError([product.name]);

      lines.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        mode,
        quantity: item.quantity,
        unitsPerCase: product.unitsPerCase,
        casePrice: caseTotalPrice(product),
        unitPrice: bottlePrice(product)
      });
    }

    const { subtotal, deliveryFee, total } = computeTotals(lines);

    const deliveryAddress = [
    details.neighborhood,
    `Street ${details.streetNumber}`,
    details.houseNumber ? `House ${details.houseNumber}` : null].
    filter(Boolean).join(", ");

    const order = await tx.order.create({
      data: {
        reference: generateReference(),
        status: "Pending",
        contactName: details.contactName,
        email: details.email,
        phone: details.phone,
        deliveryAddress,
        deliveryLat: details.deliveryLat,
        deliveryLng: details.deliveryLng,
        deliveryDate: details.deliveryDate || undefined,
        notes: details.notes || "",
        invoiceStatus: "To invoice",
        paymentMethod,
        companyName: details.isBusinessCheckout ? details.companyName : undefined,
        tin: details.isBusinessCheckout ? details.tin : undefined,
        needsEbm: details.needsEbm ?? false,
        ebmPurchaseCode: details.needsEbm ? details.ebmPurchaseCode : undefined,
        ebmInvoiceEmail: details.needsEbm ? details.ebmInvoiceEmail : undefined,
        subtotal,
        deliveryFee,
        total,
        lines: { create: lines }
      },
      include: ORDER_INCLUDE
    });

    sendOrderConfirmationEmail(order).catch((error) => {
      console.error(`Failed to send order confirmation email for ${order.reference}:`, error);
    });
    sendOrderNotificationEmail(order).catch((error) => {
      console.error(`Failed to send order notification email for ${order.reference}:`, error);
    });

    return order;
  });
}

const TIMESTAMP_FIELD: Record<string, string> = {
  Confirmed: "confirmedAt",
  Packed: "packedAt",
  Dispatched: "dispatchedAt",
  Delivered: "deliveredAt"
};

export async function updateOrderStatus(id: string, status: string) {
  await getOrder(id);
  const timestampField = TIMESTAMP_FIELD[status];
  return prisma.order.update({
    where: { id },
    data: { status, ...(timestampField ? { [timestampField]: new Date() } : {}) },
    include: ORDER_INCLUDE
  });
}

export async function updateInternalNotes(id: string, internalNotes: string) {
  await getOrder(id);
  return prisma.order.update({ where: { id }, data: { internalNotes }, include: ORDER_INCLUDE });
}

export async function updateInvoiceStatus(id: string, invoiceStatus: string) {
  await getOrder(id);
  return prisma.order.update({ where: { id }, data: { invoiceStatus }, include: ORDER_INCLUDE });
}

export async function reorder(id: string) {
  const order = await getOrder(id);
  const unavailable: string[] = [];
  const cart: CartItem[] = [];

  for (const line of order.lines) {
    const product = await prisma.product.findUnique({ where: { id: line.productId } });
    if (!product || product.stockUnits === 0) {
      unavailable.push(line.name);
      continue;
    }
    const requestedUnits = line.mode === "business" ? line.quantity * line.unitsPerCase : line.quantity;
    const availableUnits = Math.min(requestedUnits, product.stockUnits);
    const quantity = line.mode === "business" ? Math.max(1, Math.floor(availableUnits / line.unitsPerCase)) : availableUnits;
    cart.push({ productId: line.productId, mode: line.mode as "individual" | "business", quantity });
  }

  const addedUnits = cart.reduce((sum, item) => {
    const unitsPerCase = order.lines.find((l) => l.productId === item.productId)?.unitsPerCase ?? 1;
    return sum + (item.mode === "business" ? item.quantity * unitsPerCase : item.quantity);
  }, 0);
  return { cart, addedUnits, unavailable };
}
