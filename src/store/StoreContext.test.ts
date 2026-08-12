import { describe, expect, it } from "vitest";
import { lineUnitTotal } from "./StoreContext";

const product = { casePrice: 6000, unitsPerCase: 6 };

describe("lineUnitTotal", () => {
  it("prices business-mode cart items by the case", () => {
    expect(lineUnitTotal(product, { productId: "p1", mode: "business", quantity: 2 })).toBe(12000);
  });

  it("prices individual-mode cart items by the piece", () => {
    expect(lineUnitTotal(product, { productId: "p1", mode: "individual", quantity: 4 })).toBe(4000);
  });
});
