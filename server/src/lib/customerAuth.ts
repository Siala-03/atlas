import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update(`customer:${payload}`).digest("hex");
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

export function issueCustomerToken(customerId: string): string {
  const expiry = String(Date.now() + TOKEN_TTL_MS);
  const encoded = Buffer.from(JSON.stringify({ customerId })).toString("base64url");
  return `${expiry}.${encoded}.${sign(`${expiry}.${encoded}`)}`;
}

export function verifyCustomerToken(token: string | undefined): {customerId: string;} | null {
  if (!token || !(process.env.ADMIN_SESSION_SECRET ?? "")) return null;
  const [expiry, encoded, signature] = token.split(".");
  if (!expiry || !encoded || !signature) return null;
  if (Number(expiry) < Date.now()) return null;
  if (!safeEqual(signature, sign(`${expiry}.${encoded}`))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return typeof parsed?.customerId === "string" ? parsed : null;
  } catch {
    return null;
  }
}
