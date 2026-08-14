import { describe, expect, it } from "vitest";
import { lineUnitTotal } from "./StoreContext";

const beer = { casePrice: 6000, unitsPerCase: 6, category: "Beer" as const };
const wine = { casePrice: 6000, unitsPerCase: 6, category: "Wine" as const };
const whisky = { casePrice: 14000, unitsPerCase: 6, category: "Whisky" as const };

describe("lineUnitTotal", () => {
  it("honors the shopper's chosen mode for beer — business prices by the case", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "business", quantity: 2 })).toBe(12000);
  });

  it("honors the shopper's chosen mode for beer — individual prices by the piece", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "individual", quantity: 3 })).toBe(3000);
  });

  it("prices wine by the bottle in individual mode", () => {
    expect(lineUnitTotal(wine, { productId: "p1", mode: "individual", quantity: 4 })).toBe(4000);
  });

  it("prices wine by the case in business mode", () => {
    expect(lineUnitTotal(wine, { productId: "p1", mode: "business", quantity: 3 })).toBe(18000);
  });

  it("prices spirits by the stored price directly, ignoring business mode and unitsPerCase", () => {
    expect(lineUnitTotal(whisky, { productId: "p1", mode: "individual", quantity: 2 })).toBe(28000);
    expect(lineUnitTotal(whisky, { productId: "p1", mode: "business", quantity: 2 })).toBe(28000);
  });
});
