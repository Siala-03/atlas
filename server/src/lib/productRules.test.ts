import { describe, expect, it } from "vitest";
import { hasCaseOption, resolveMode } from "./productRules";

describe("hasCaseOption", () => {
  it("gives beer the case option", () => {
    expect(hasCaseOption("Beer")).toBe(true);
  });

  it("does not give wine and spirits a case option", () => {
    expect(hasCaseOption("Wine")).toBe(false);
    expect(hasCaseOption("Whisky")).toBe(false);
  });
});

describe("resolveMode", () => {
  it("trusts the client's requested mode for beer", () => {
    expect(resolveMode("Beer", "business")).toBe("business");
    expect(resolveMode("Beer", "individual")).toBe("individual");
  });

  it("ignores a manipulated 'business' request for wine/spirits, forcing individual", () => {
    expect(resolveMode("Wine", "business")).toBe("individual");
    expect(resolveMode("Whisky", "business")).toBe("individual");
  });
});
