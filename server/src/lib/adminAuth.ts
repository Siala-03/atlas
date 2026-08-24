import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "../db";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_SETTING_KEY = "adminPasswordHash";

export type Role = "admin" | "staff";

export interface TokenPayload {
  role: Role;
  userId?: string;
}

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(candidate, hash);
}

function checkAgainstEnvPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

// The owner password lives in the database once someone changes it from
// the default; until then, the ADMIN_PASSWORD environment variable is the
// bootstrap password. This is the single "owner" login (no email), which
// always grants the admin role.
export async function checkAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const stored = await prisma.setting.findUnique({ where: { key: PASSWORD_SETTING_KEY } });
  if (stored) return verifyPasswordHash(password, stored.value);
  return checkAgainstEnvPassword(password);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const valid = await checkAdminPassword(currentPassword);
  if (!valid) return false;

  await prisma.setting.upsert({
    where: { key: PASSWORD_SETTING_KEY },
    update: { value: hashPassword(newPassword) },
    create: { key: PASSWORD_SETTING_KEY, value: hashPassword(newPassword) }
  });
  return true;
}

// Named staff accounts, separate from the owner login above.
export async function checkStaffLogin(
  email: string,
  password: string
): Promise<{ id: string; name: string; role: Role } | null> {
  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !verifyPasswordHash(password, user.passwordHash)) return null;
  return { id: user.id, name: user.name, role: user.role as Role };
}

export async function createStaffUser(name: string, email: string, password: string, role: Role) {
  return prisma.adminUser.create({
    data: { name, email: email.toLowerCase().trim(), passwordHash: hashPassword(password), role },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
}

export function listStaffUsers() {
  return prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });
}

export async function deleteStaffUser(id: string) {
  await prisma.adminUser.delete({ where: { id } });
}

function encodePayload(payload: TokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded: string): TokenPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (parsed?.role === "admin" || parsed?.role === "staff") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function issueToken(payload: TokenPayload = { role: "admin" }): string {
  const expiry = String(Date.now() + TOKEN_TTL_MS);
  const encoded = encodePayload(payload);
  return `${expiry}.${encoded}.${sign(`${expiry}.${encoded}`)}`;
}

export function verifyToken(token: string | undefined): TokenPayload | null {
  if (!token || !(process.env.ADMIN_SESSION_SECRET ?? "")) return null;
  const [expiry, encoded, signature] = token.split(".");
  if (!expiry || !encoded || !signature) return null;
  if (Number(expiry) < Date.now()) return null;
  if (!safeEqual(signature, sign(`${expiry}.${encoded}`))) return null;
  return decodePayload(encoded);
}
