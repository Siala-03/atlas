import { describe, expect, it } from "vitest";
import { bottlePrice, caseTotalPrice, resolveMode, unitLabels, isCaseStocked } from "./productRules";

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
  it("reads the piece price directly", () => {
    expect(bottlePrice({ unitPrice: 5333 })).toBe(5333);
  });
});

describe("caseTotalPrice", () => {
  it("reads the case price directly, independent of the piece price", () => {
    expect(caseTotalPrice({ casePrice: 32000 })).toBe(32000);
  });
});
