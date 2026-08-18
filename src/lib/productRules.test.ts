import { describe, expect, it } from "vitest";
import { bottlePrice, caseTotalPrice, hasCaseOption, resolveMode, unitLabels, isCaseStocked } from "./productRules";

describe("hasCaseOption", () => {
  it("gives wine, beer, RTDs and mixers the case option", () => {
    expect(hasCaseOption("Wine")).toBe(true);
    expect(hasCaseOption("Beer")).toBe(true);
    expect(hasCaseOption("RTD")).toBe(true);
    expect(hasCaseOption("Mixer")).toBe(true);
  });

  it("does not give spirits a case option", () => {
    expect(hasCaseOption("Whisky")).toBe(false);
    expect(hasCaseOption("Rum")).toBe(false);
    expect(hasCaseOption("Vodka")).toBe(false);
    expect(hasCaseOption("Gin")).toBe(false);
    expect(hasCaseOption("Cognac")).toBe(false);
    expect(hasCaseOption("Liqueur")).toBe(false);
    expect(hasCaseOption("Tequila")).toBe(false);
    expect(hasCaseOption("Aperitif")).toBe(false);
    expect(hasCaseOption("Bitters")).toBe(false);
  });
});

describe("resolveMode", () => {
  it("honors the shopper's chosen mode for every category, including spirits", () => {
    expect(resolveMode("Beer", "business")).toBe("business");
    expect(resolveMode("Beer", "individual")).toBe("individual");
    expect(resolveMode("Wine", "business")).toBe("business");
    expect(resolveMode("Whisky", "business")).toBe("business");
    expect(resolveMode("Whisky", "individual")).toBe("individual");
    expect(resolveMode("Rum", "business")).toBe("business");
  });
});

describe("unitLabels", () => {
  it("uses bottle/case for wine and spirits", () => {
    expect(unitLabels("Wine")).toEqual({ individual: "bottle", business: "case" });
    expect(unitLabels("Whisky")).toEqual({ individual: "bottle", business: "case" });
  });

  it("uses piece/crate for beer", () => {
    expect(unitLabels("Beer")).toEqual({ individual: "piece", business: "crate" });
  });

  it("uses can/pack for RTDs", () => {
    expect(unitLabels("RTD")).toEqual({ individual: "can", business: "pack" });
  });
});

describe("isCaseStocked", () => {
  it("only stocks beer in whole cases", () => {
    expect(isCaseStocked("Beer")).toBe(true);
    expect(isCaseStocked("Wine")).toBe(false);
    expect(isCaseStocked("RTD")).toBe(false);
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

describe("caseTotalPrice", () => {
  it("uses the stored price directly for case-option categories (already a real case total)", () => {
    expect(caseTotalPrice({ category: "Wine", casePrice: 32000, unitsPerCase: 6 })).toBe(32000);
  });

  it("multiplies the undivided bottle price by units per case for spirits", () => {
    expect(caseTotalPrice({ category: "Whisky", casePrice: 14000, unitsPerCase: 6 })).toBe(84000);
  });
});
