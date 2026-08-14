import { describe, expect, it } from "vitest";
import { bottlePrice, hasCaseOption, resolveMode } from "./productRules";

describe("hasCaseOption", () => {
  it("gives wine, beer, RTDs and mixers the case option", () => {
    expect(hasCaseOption("Wine")).toBe(true);
    expect(hasCaseOption("Beer")).toBe(true);
  });

  it("does not give spirits a case option", () => {
    expect(hasCaseOption("Whisky")).toBe(false);
    expect(hasCaseOption("Rum")).toBe(false);
  });
});

describe("resolveMode", () => {
  it("trusts the client's requested mode for case-option categories", () => {
    expect(resolveMode("Beer", "business")).toBe("business");
    expect(resolveMode("Beer", "individual")).toBe("individual");
    expect(resolveMode("Wine", "business")).toBe("business");
  });

  it("ignores a manipulated 'business' request for spirits, forcing individual", () => {
    expect(resolveMode("Whisky", "business")).toBe("individual");
    expect(resolveMode("Rum", "business")).toBe("individual");
  });
});

describe("bottlePrice", () => {
  it("divides the stored price for case-option categories", () => {
    expect(bottlePrice({ category: "Wine", casePrice: 32000, unitsPerCase: 6 })).toBe(5333);
  });

  it("uses the stored price directly for spirits (no case concept to divide)", () => {
    expect(bottlePrice({ category: "Whisky", casePrice: 14000, unitsPerCase: 6 })).toBe(14000);
  });
});
