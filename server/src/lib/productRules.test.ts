import { describe, expect, it } from "vitest";
import { bottlePrice, caseTotalPrice, resolveMode } from "./productRules";

describe("resolveMode", () => {
  it("trusts the client's requested mode for every category, including spirits", () => {
    expect(resolveMode("Beer", "business")).toBe("business");
    expect(resolveMode("Beer", "individual")).toBe("individual");
    expect(resolveMode("Wine", "business")).toBe("business");
    expect(resolveMode("Whisky", "business")).toBe("business");
    expect(resolveMode("Rum", "business")).toBe("business");
  });
});

describe("bottlePrice", () => {
  it("reads the piece price directly", () => {
    expect(bottlePrice({ unitPrice: 5333 })).toBe(5333);
  });
});

describe("caseTotalPrice", () => {
  it("reads the case price directly, independent of the piece price", () => {
    expect(caseTotalPrice({ casePrice: 32000 })).toBe(32000);
  });
});
