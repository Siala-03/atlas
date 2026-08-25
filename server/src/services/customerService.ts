import { prisma } from "../db";
import { ValidationError } from "../errors";
import { hashPassword, verifyPasswordHash } from "../lib/customerAuth";

const PROFILE_SELECT = { id: true, name: true, email: true, phone: true, createdAt: true };

export async function signup(name: string, email: string, password: string, phone?: string) {
  const existing = await prisma.customer.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) throw new ValidationError("An account with this email already exists.");
  return prisma.customer.create({
    data: { name, email: email.toLowerCase().trim(), passwordHash: hashPassword(password), phone },
    select: PROFILE_SELECT
  });
}

export async function login(email: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!customer || !verifyPasswordHash(password, customer.passwordHash)) return null;
  return customer;
}

export function getCustomer(id: string) {
  return prisma.customer.findUnique({ where: { id }, select: PROFILE_SELECT });
}
