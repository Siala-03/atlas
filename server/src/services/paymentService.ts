import { Payment } from "@prisma/client";
import { prisma } from "../db";
import { NotFoundError } from "../errors";
import { paymentProvider } from "../payments/providerRegistry";

export async function initiatePayment(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order");

  const { redirectUrl, providerRef } = await paymentProvider.initiate({
    orderId: order.id,
    reference: order.reference,
    amount: order.total,
    email: order.email,
    phone: order.phone,
    contactName: order.contactName
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: paymentProvider.name,
      providerRef,
      status: "pending",
      amount: order.total,
      redirectUrl
    }
  });

  return { paymentId: payment.id, redirectUrl, providerRef };
}

export async function recordCallback(providerRef: string, outcome: "success" | "fail") {
  const payment = await prisma.payment.findUnique({ where: { providerRef } });
  if (!payment) throw new NotFoundError("Payment");

  const status = outcome === "success" ? "paid" : "failed";

  await prisma.payment.update({ where: { providerRef }, data: { status } });

  if (status === "paid") {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { invoiceStatus: "Paid" }
    });
  }

  return { status };
}

export async function getPaymentForOrder(orderId: string) {
  const payment = await prisma.payment.findFirst({ where: { orderId }, orderBy: { createdAt: "desc" } });
  if (!payment || payment.status !== "pending") return payment;
  return applyVerification(payment);
}

export async function recordProviderVerification(providerRef: string) {
  const payment = await prisma.payment.findUnique({ where: { providerRef } });
  if (!payment) {
    console.warn(`[${new Date().toISOString()}] Pesapal IPN referenced unknown payment: ${providerRef}`);
    return;
  }
  await applyVerification(payment);
}

async function applyVerification(payment: Payment): Promise<Payment> {
  const { status } = await paymentProvider.verify(payment.providerRef);
  if (status === payment.status) return payment;

  const updated = await prisma.payment.update({ where: { id: payment.id }, data: { status } });

  if (status === "paid") {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { invoiceStatus: "Paid" }
    });
  }

  return updated;
}
