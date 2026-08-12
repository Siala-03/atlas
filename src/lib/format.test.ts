import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats whole numbers with thousands separators and RWF prefix", () => {
    expect(formatCurrency(57000)).toBe("RWF 57,000");
  });

  it("rounds fractional values", () => {
    expect(formatCurrency(999.6)).toBe("RWF 1,000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("RWF 0");
  });
});
