import { describe, expect, it } from "vitest";
import { lineUnitTotal } from "./StoreContext";

const beer = { casePrice: 6000, unitPrice: 1000 };
const wine = { casePrice: 18000, unitPrice: 1000 };
const whisky = { casePrice: 84000, unitPrice: 14000 };

describe("lineUnitTotal", () => {
  it("prices business orders by the case, independent of the piece price", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "business", quantity: 2 })).toBe(12000);
  });

  it("prices individual orders by the piece", () => {
    expect(lineUnitTotal(beer, { productId: "p1", mode: "individual", quantity: 3 })).toBe(3000);
  });

  it("prices wine by the piece in individual mode", () => {
    expect(lineUnitTotal(wine, { productId: "p1", mode: "individual", quantity: 4 })).toBe(4000);
  });

  it("prices wine by the case in business mode", () => {
    expect(lineUnitTotal(wine, { productId: "p1", mode: "business", quantity: 3 })).toBe(54000);
  });

  it("prices spirits by the piece in individual mode", () => {
    expect(lineUnitTotal(whisky, { productId: "p1", mode: "individual", quantity: 2 })).toBe(28000);
  });

  it("prices spirits by the case in business mode, independent of the piece price", () => {
    expect(lineUnitTotal(whisky, { productId: "p1", mode: "business", quantity: 2 })).toBe(168000);
  });
});
