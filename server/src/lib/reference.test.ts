import { describe, expect, it } from "vitest";
import { generateReference } from "./reference";

describe("generateReference", () => {
  it("matches the ATL-<year>-<code> format", () => {
    const ref = generateReference();
    expect(ref).toMatch(/^ATL-\d{4}-[A-Z0-9]{5}\d{3}$/);
  });

  it("produces unique values across consecutive calls", () => {
    const refs = new Set(Array.from({ length: 20 }, () => generateReference()));
    expect(refs.size).toBe(20);
  });
});
