import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkAdminPassword, changeAdminPassword, hashPassword, verifyPasswordHash, issueToken, verifyToken } from "./adminAuth";

const settingStore = new Map<string, string>();

vi.mock("../db", () => ({
  prisma: {
    setting: {
      findUnique: vi.fn(async ({ where }: { where: { key: string } }) => {
        const value = settingStore.get(where.key);
        return value ? { key: where.key, value } : null;
      }),
      upsert: vi.fn(async ({ where, create }: { where: { key: string }; create: { value: string } }) => {
        settingStore.set(where.key, create.value);
        return { key: where.key, value: create.value };
      })
    }
  }
}));

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct-horse";
  process.env.ADMIN_SESSION_SECRET = "test-secret";
  settingStore.clear();
});

describe("hashPassword / verifyPasswordHash", () => {
  it("verifies a matching password against its own hash", () => {
    const hash = hashPassword("battery-staple");
    expect(verifyPasswordHash("battery-staple", hash)).toBe(true);
  });

  it("rejects a non-matching password", () => {
    const hash = hashPassword("battery-staple");
    expect(verifyPasswordHash("wrong", hash)).toBe(false);
  });
});

describe("checkAdminPassword", () => {
  it("falls back to the env password when none has been set in the database", async () => {
    expect(await checkAdminPassword("correct-horse")).toBe(true);
  });

  it("rejects the wrong password", async () => {
    expect(await checkAdminPassword("wrong")).toBe(false);
  });

  it("rejects an empty password", async () => {
    expect(await checkAdminPassword("")).toBe(false);
  });

  it("prefers a database password over the env password once one is set", async () => {
    await changeAdminPassword("correct-horse", "new-password");
    expect(await checkAdminPassword("correct-horse")).toBe(false);
    expect(await checkAdminPassword("new-password")).toBe(true);
  });
});

describe("changeAdminPassword", () => {
  it("refuses to change the password without the correct current password", async () => {
    expect(await changeAdminPassword("wrong-current", "new-password")).toBe(false);
    expect(await checkAdminPassword("correct-horse")).toBe(true);
  });

  it("updates the password when the current password is correct", async () => {
    expect(await changeAdminPassword("correct-horse", "new-password")).toBe(true);
    expect(await checkAdminPassword("new-password")).toBe(true);
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
