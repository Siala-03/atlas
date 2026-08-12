import { describe, expect, it } from "vitest";
import { unitPrice } from "./types";

describe("unitPrice", () => {
  it("divides case price evenly across units per case", () => {
    expect(unitPrice({ casePrice: 6000, unitsPerCase: 6 })).toBe(1000);
  });

  it("rounds to the nearest whole unit", () => {
    expect(unitPrice({ casePrice: 1000, unitsPerCase: 3 })).toBe(333);
  });
});
