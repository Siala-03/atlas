import { describe, expect, it } from "vitest";
import { lineUnitTotal } from "./StoreContext";

const beer = { casePrice: 6000, unitsPerCase: 6, category: "Beer" as const };
const wine = { casePrice: 6000, unitsPerCase: 6, category: "Wine" as const };

describe("lineUnitTotal", () => {
  it("honors the shopper's chosen mode for beer — business prices by the case", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "business", quantity: 2 })).toBe(12000);
  });

  it("honors the shopper's chosen mode for beer — individual prices by the piece", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "individual", quantity: 3 })).toBe(3000);
  });

  it("always prices wine/spirits by the bottle regardless of requested mode", () => {
    expect(lineUnitTotal(wine, { productId: "p1", mode: "individual", quantity: 4 })).toBe(4000);
  });

  it("ignores a stale/incorrect stored business mode on wine — still prices per bottle", () => {
    // A wine item incorrectly stored as "business" mode (e.g. from before this
    // rule existed) must still price per bottle, not per case.
    expect(lineUnitTotal(wine, { productId: "p1", mode: "business", quantity: 3 })).toBe(3000);
  });
});
