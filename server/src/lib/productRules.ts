// Mirrors src/lib/productRules.ts on the frontend. Wine, Beer, RTDs and
// Mixers have a real case SKU, so their stored casePrice is a genuine case
// total. Spirits have no case SKU - their stored casePrice is actually the
// bottle price. Every category supports wholesale/business buying (minimum
// 1 case); this only affects how the per-bottle and per-case prices are
// derived.
const CASE_OPTION_CATEGORIES = ["Wine", "Beer", "RTD", "Mixer"];

export function hasCaseOption(category: string): boolean {
  return CASE_OPTION_CATEGORIES.includes(category);
}

// Business/wholesale buying is available for every category, so this is now
// just an identity pass-through. Kept as a named function since it's the one
// place that would change if that ever stopped being true.
export function resolveMode(_category: string, requestedMode: "individual" | "business"): "individual" | "business" {
  return requestedMode;
}

// The per-bottle price. For case-option categories the stored price is a
// real case total, so it's divided by unitsPerCase. For spirits there's no
// case concept at all — the stored price already *is* the bottle price.
export function bottlePrice(product: { category: string; casePrice: number; unitsPerCase: number }): number {
  return hasCaseOption(product.category) ? Math.round(product.casePrice / product.unitsPerCase) : product.casePrice;
}

// The wholesale per-case total. For case-option categories the stored price
// already *is* the real case total. For spirits there's no separate case
// SKU, so the case total is the original, undivided bottle price multiplied
// by the number of bottles in a case.
export function caseTotalPrice(product: { category: string; casePrice: number; unitsPerCase: number }): number {
  return hasCaseOption(product.category) ? product.casePrice : bottlePrice(product) * product.unitsPerCase;
}
