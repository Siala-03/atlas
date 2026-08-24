import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkAdminPassword,
  changeAdminPassword,
  checkStaffLogin,
  hashPassword,
  verifyPasswordHash,
  issueToken,
  verifyToken } from
"./adminAuth";

const settingStore = new Map<string, string>();
const staffStore = new Map<string, { id: string; name: string; email: string; passwordHash: string; role: string }>();
let nextId = 1;

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
    },
    adminUser: {
      findUnique: vi.fn(async ({ where }: { where: { email: string } }) => staffStore.get(where.email) ?? null),
      create: vi.fn(
        async ({ data }: { data: { name: string; email: string; passwordHash: string; role: string } }) => {
          const user = { id: `u${nextId++}`, ...data };
          staffStore.set(data.email, user);
          return user;
        }
      )
    }
  }
}));

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct-horse";
  process.env.ADMIN_SESSION_SECRET = "test-secret";
  settingStore.clear();
  staffStore.clear();
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

describe("checkStaffLogin", () => {
  it("returns null for an email with no staff account", async () => {
    expect(await checkStaffLogin("nobody@atlas.rw", "whatever")).toBeNull();
  });

  it("returns the user for correct credentials", async () => {
    staffStore.set("staff@atlas.rw", {
      id: "u1",
      name: "Staff One",
      email: "staff@atlas.rw",
      passwordHash: hashPassword("s3cret"),
      role: "staff"
    });
    expect(await checkStaffLogin("staff@atlas.rw", "s3cret")).toEqual({ id: "u1", name: "Staff One", role: "staff" });
  });

  it("rejects the wrong password for an existing account", async () => {
    staffStore.set("staff@atlas.rw", {
      id: "u1",
      name: "Staff One",
      email: "staff@atlas.rw",
      passwordHash: hashPassword("s3cret"),
      role: "staff"
    });
    expect(await checkStaffLogin("staff@atlas.rw", "wrong")).toBeNull();
  });

  it("is case-insensitive on email", async () => {
    staffStore.set("staff@atlas.rw", {
      id: "u1",
      name: "Staff One",
      email: "staff@atlas.rw",
      passwordHash: hashPassword("s3cret"),
      role: "staff"
    });
    expect(await checkStaffLogin("STAFF@atlas.rw", "s3cret")).not.toBeNull();
  });
});

describe("issueToken / verifyToken", () => {
  it("accepts a freshly issued token and carries the role through", () => {
    const token = issueToken({ role: "admin" });
    expect(verifyToken(token)).toEqual({ role: "admin" });
  });

  it("carries a staff userId through", () => {
    const token = issueToken({ role: "staff", userId: "u1" });
    expect(verifyToken(token)).toEqual({ role: "staff", userId: "u1" });
  });

  it("rejects a tampered token", () => {
    const token = issueToken();
    const [expiry] = token.split(".");
    expect(verifyToken(`${expiry}.deadbeef.deadbeef`)).toBeNull();
  });

  it("rejects an expired token", () => {
    const expiredExpiry = String(Date.now() - 1000);
    const token = issueToken().replace(/^\d+/, expiredExpiry);
    expect(verifyToken(token)).toBeNull();
  });

  it("rejects a missing token", () => {
    expect(verifyToken(undefined)).toBeNull();
  });

  it("rejects a malformed token", () => {
    expect(verifyToken("not-a-real-token")).toBeNull();
  });
});
