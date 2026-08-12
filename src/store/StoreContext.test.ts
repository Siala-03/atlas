import { describe, expect, it } from "vitest";
import { lineUnitTotal } from "./StoreContext";

const beer = { casePrice: 6000, unitsPerCase: 6, category: "Beer" as const };
const wine = { casePrice: 6000, unitsPerCase: 6, category: "Wine" as const };

describe("lineUnitTotal", () => {
  it("always prices case-only categories (beer) by the case", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "business", quantity: 2 })).toBe(12000);
  });

  it("always prices non-case-only categories (wine) by the bottle", () => {
    expect(lineUnitTotal(wine, { productId: "p1", mode: "individual", quantity: 4 })).toBe(4000);
  });

  it("ignores a stale/incorrect stored mode and derives pricing from category instead", () => {
    // A wine item incorrectly stored as "business" mode (e.g. from before this
    // rule existed) must still price per bottle, not per case.
    expect(lineUnitTotal(wine, { productId: "p1", mode: "business", quantity: 3 })).toBe(3000);
    // A beer item incorrectly stored as "individual" must still price per case.
    expect(lineUnitTotal(beer, { productId: "p1", mode: "individual", quantity: 3 })).toBe(18000);
  });
});
