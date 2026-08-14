import { describe, expect, it } from "vitest";
import { resolveMode } from "./productRules";

describe("resolveMode", () => {
  it("trusts the client's requested mode for every category", () => {
    expect(resolveMode("Beer", "business")).toBe("business");
    expect(resolveMode("Beer", "individual")).toBe("individual");
    expect(resolveMode("Wine", "business")).toBe("business");
    expect(resolveMode("Whisky", "business")).toBe("business");
  });
});
