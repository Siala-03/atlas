import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "../db";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_SETTING_KEY = "adminPasswordHash";

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

// The password lives in the database once someone changes it from the
// default; until then, the ADMIN_PASSWORD environment variable is the
// bootstrap password.
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

export function issueToken(): string {
  const expiry = String(Date.now() + TOKEN_TTL_MS);
  return `${expiry}.${sign(expiry)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !(process.env.ADMIN_SESSION_SECRET ?? "")) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  if (Number(expiry) < Date.now()) return false;

  return safeEqual(signature, sign(expiry));
}
