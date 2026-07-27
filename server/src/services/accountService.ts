import { prisma } from "../db";
import { NotFoundError } from "../errors";
import { z } from "zod";
import { CheckoutDetailsSchema } from "../validation/schemas";

type CheckoutDetails = z.infer<typeof CheckoutDetailsSchema>;

export async function getAccount(id: string) {
  const account = await prisma.tradeAccount.findUnique({ where: { id } });
  if (!account) throw new NotFoundError("Trade account");
  return account;
}

export async function saveTradeAccount(details: CheckoutDetails, accountId?: string) {
  const existing = accountId ?
  await prisma.tradeAccount.findUnique({ where: { id: accountId } }) :
  await prisma.tradeAccount.findUnique({ where: { email: details.email.toLowerCase() } });

  const data = {
    business: details.business,
    contactName: details.contactName,
    email: details.email.toLowerCase(),
    phone: details.phone,
    licenseNo: details.licenseNo,
    deliveryAddress: details.deliveryAddress
  };

  if (existing) {
    return prisma.tradeAccount.update({ where: { id: existing.id }, data });
  }
  return prisma.tradeAccount.create({ data });
}
