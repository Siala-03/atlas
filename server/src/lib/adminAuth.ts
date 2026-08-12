import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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

  const expectedSignature = sign(expiry);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
