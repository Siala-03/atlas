import { prisma } from "../db";
import { NotFoundError, StockConflictError } from "../errors";
import { computeTotals } from "../lib/money";
import { generateReference } from "../lib/reference";
import { z } from "zod";
import { CartItemSchema, CheckoutDetailsSchema } from "../validation/schemas";

type CheckoutDetails = z.infer<typeof CheckoutDetailsSchema>;
type CartItem = z.infer<typeof CartItemSchema>;

const ORDER_INCLUDE = { lines: true, payments: { orderBy: { createdAt: "desc" as const } } };

export function listOrders(filters: { status?: string; invoiceStatus?: string; accountId?: string; search?: string }) {
  return prisma.order.findMany({
    where: {
      status: filters.status || undefined,
      invoiceStatus: filters.invoiceStatus || undefined,
      accountId: filters.accountId || undefined,
      ...(filters.search ?
      {
        OR: [
        { reference: { contains: filters.search } },
        { business: { contains: filters.search } },
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
  accountId?: string;
  cart: CartItem[];
  paymentMethod: "invoice" | "card";
}) {
  const { details, accountId, cart, paymentMethod } = params;

  return prisma.$transaction(async (tx) => {
    const lines: { productId: string; name: string; brand: string; cases: number; unitsPerCase: number; casePrice: number }[] = [];

    for (const item of cart) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new StockConflictError([item.productId]);

      const result = await tx.product.updateMany({
        where: { id: item.productId, stockCases: { gte: item.cases } },
        data: { stockCases: { decrement: item.cases } }
      });
      if (result.count === 0) throw new StockConflictError([product.name]);

      lines.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        cases: item.cases,
        unitsPerCase: product.unitsPerCase,
        casePrice: product.casePrice
      });
    }

    const { subtotal, vat, total } = computeTotals(lines);

    const order = await tx.order.create({
      data: {
        reference: generateReference(),
        status: "Pending",
        accountId: accountId || undefined,
        business: details.business,
        contactName: details.contactName,
        email: details.email,
        phone: details.phone,
        licenseNo: details.licenseNo,
        deliveryAddress: details.deliveryAddress,
        deliveryDate: details.deliveryDate || undefined,
        notes: details.notes || "",
        invoiceStatus: "To invoice",
        paymentMethod,
        subtotal,
        vat,
        total,
        lines: { create: lines }
      },
      include: ORDER_INCLUDE
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
    if (!product || product.stockCases === 0) {
      unavailable.push(line.name);
      continue;
    }
    cart.push({ productId: line.productId, cases: Math.min(line.cases, product.stockCases) });
  }

  const addedCases = cart.reduce((sum, item) => sum + item.cases, 0);
  return { cart, addedCases, unavailable };
}
