import { prisma } from "../db";
import { ValidationError } from "../errors";
import { hashPassword, verifyPasswordHash } from "../lib/customerAuth";

const PROFILE_SELECT = {
  id: true, name: true, email: true, phone: true,
  isBusiness: true, companyName: true, tin: true, createdAt: true
};

interface SignupParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  isBusiness?: boolean;
  companyName?: string;
  tin?: string;
}

export async function signup(params: SignupParams) {
  const email = params.email.toLowerCase().trim();
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) throw new ValidationError("An account with this email already exists.");
  return prisma.customer.create({
    data: {
      name: params.name,
      email,
      passwordHash: hashPassword(params.password),
      phone: params.phone,
      isBusiness: params.isBusiness ?? false,
      companyName: params.isBusiness ? params.companyName : undefined,
      tin: params.isBusiness ? params.tin : undefined
    },
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

export function listCustomers() {
  return prisma.customer.findMany({ select: PROFILE_SELECT, orderBy: { createdAt: "desc" } });
}
