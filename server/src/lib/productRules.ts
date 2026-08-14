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
