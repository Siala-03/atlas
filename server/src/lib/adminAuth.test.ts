import { beforeEach, describe, expect, it } from "vitest";
import { checkAdminPassword, issueToken, verifyToken } from "./adminAuth";

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct-horse";
  process.env.ADMIN_SESSION_SECRET = "test-secret";
});

describe("checkAdminPassword", () => {
  it("accepts the configured password", () => {
    expect(checkAdminPassword("correct-horse")).toBe(true);
  });

  it("rejects the wrong password", () => {
    expect(checkAdminPassword("wrong")).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(checkAdminPassword("")).toBe(false);
  });
});

describe("issueToken / verifyToken", () => {
  it("accepts a freshly issued token", () => {
    const token = issueToken();
    expect(verifyToken(token)).toBe(true);
  });

  it("rejects a tampered token", () => {
    const token = issueToken();
    const [expiry] = token.split(".");
    expect(verifyToken(`${expiry}.deadbeef`)).toBe(false);
  });

  it("rejects an expired token", () => {
    const expiredExpiry = String(Date.now() - 1000);
    const token = issueToken().replace(/^\d+/, expiredExpiry);
    expect(verifyToken(token)).toBe(false);
  });

  it("rejects a missing token", () => {
    expect(verifyToken(undefined)).toBe(false);
  });

  it("rejects a malformed token", () => {
    expect(verifyToken("not-a-real-token")).toBe(false);
  });
});
