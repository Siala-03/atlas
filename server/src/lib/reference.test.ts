import { describe, expect, it } from "vitest";
import { generateReference, referencePrefix } from "./reference";

describe("generateReference", () => {
  it("matches the ATL-<yyyymmdd>-<seq> format", () => {
    const ref = generateReference(1, new Date(2026, 7, 31));
    expect(ref).toBe("ATL-20260831-001");
  });

  it("pads the sequence to 3 digits and grows past it", () => {
    expect(generateReference(7, new Date(2026, 0, 5))).toBe("ATL-20260105-007");
    expect(generateReference(1234, new Date(2026, 0, 5))).toBe("ATL-20260105-1234");
  });

  it("sorts sequentially within a day as the sequence increases", () => {
    const day = new Date(2026, 7, 31);
    const refs = Array.from({ length: 5 }, (_, i) => generateReference(i + 1, day));
    expect(refs).toEqual([...refs].sort());
  });
});

describe("referencePrefix", () => {
  it("matches the date part generateReference uses", () => {
    const day = new Date(2026, 7, 31);
    expect(generateReference(1, day).startsWith(referencePrefix(day))).toBe(true);
  });
});
