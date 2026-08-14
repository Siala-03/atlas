// Mirrors src/lib/productRules.ts on the frontend. Spirits aren't sold by
// the case in practice, so the server forces individual pricing for them
// regardless of what the client sends; Wine, Beer, RTDs and Mixers honor
// the requested mode.
const CASE_OPTION_CATEGORIES = ["Wine", "Beer", "RTD", "Mixer"];

export function hasCaseOption(category: string): boolean {
  return CASE_OPTION_CATEGORIES.includes(category);
}

export function resolveMode(category: string, requestedMode: "individual" | "business"): "individual" | "business" {
  return hasCaseOption(category) ? requestedMode : "individual";
}

// The per-bottle price. For case-option categories the stored price is a
// real case total, so it's divided by unitsPerCase. For spirits there's no
// case concept at all — the stored price already *is* the bottle price.
export function bottlePrice(product: { category: string; casePrice: number; unitsPerCase: number }): number {
  return hasCaseOption(product.category) ? Math.round(product.casePrice / product.unitsPerCase) : product.casePrice;
}
