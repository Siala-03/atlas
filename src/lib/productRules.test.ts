import { describe, expect, it } from "vitest";
import { isCaseOnly } from "./productRules";

describe("isCaseOnly", () => {
  it("treats beer as case-only", () => {
    expect(isCaseOnly("Beer")).toBe(true);
  });

  it("treats wine and spirits as not case-only", () => {
    expect(isCaseOnly("Wine")).toBe(false);
    expect(isCaseOnly("Whisky")).toBe(false);
    expect(isCaseOnly("Rum")).toBe(false);
    expect(isCaseOnly("Vodka")).toBe(false);
    expect(isCaseOnly("Gin")).toBe(false);
  });
});
