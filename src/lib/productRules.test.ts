import { describe, expect, it } from "vitest";
import { resolveMode, unitLabels, isCaseStocked } from "./productRules";

describe("resolveMode", () => {
  it("honors the shopper's chosen mode for every category", () => {
    expect(resolveMode("Beer", "business")).toBe("business");
    expect(resolveMode("Beer", "individual")).toBe("individual");
    expect(resolveMode("Wine", "business")).toBe("business");
    expect(resolveMode("Whisky", "individual")).toBe("individual");
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
