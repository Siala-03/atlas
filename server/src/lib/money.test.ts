import { describe, expect, it } from "vitest";
import { computeTotals, lineTotal, DELIVERY_FEE } from "./money";

describe("lineTotal", () => {
  it("prices business-mode lines by the case", () => {
    const line = { mode: "business", quantity: 3, casePrice: 6000, unitPrice: 1000 };
    expect(lineTotal(line)).toBe(18000);
  });

  it("prices individual-mode lines by the piece", () => {
    const line = { mode: "individual", quantity: 5, casePrice: 6000, unitPrice: 1000 };
    expect(lineTotal(line)).toBe(5000);
  });
});

describe("computeTotals", () => {
  it("sums mixed-mode lines and adds the flat delivery fee", () => {
    const lines = [
      { mode: "business", quantity: 2, casePrice: 6000, unitPrice: 1000 },
      { mode: "individual", quantity: 4, casePrice: 6000, unitPrice: 1000 }
    ];
    const { subtotal, deliveryFee, total } = computeTotals(lines);
    expect(subtotal).toBe(16000);
    expect(deliveryFee).toBe(DELIVERY_FEE);
    expect(total).toBe(subtotal + deliveryFee);
  });

  it("returns zero totals for an empty cart", () => {
    expect(computeTotals([])).toEqual({ subtotal: 0, deliveryFee: 0, total: 0 });
  });
});
