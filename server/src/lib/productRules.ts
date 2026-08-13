// Mirrors src/lib/productRules.ts on the frontend. Beer (and future soft
// drinks) can genuinely be bought either loose or by the case, so the server
// trusts the client's chosen mode for these. Everything else is forced to
// "individual" regardless of what a client sends — there's no case price
// for wine/spirits, so a modified request can't force case pricing on them.
const CASE_OPTION_CATEGORIES = ["Beer"];

export function hasCaseOption(category: string): boolean {
  return CASE_OPTION_CATEGORIES.includes(category);
}

export function resolveMode(category: string, requestedMode: "individual" | "business"): "individual" | "business" {
  return hasCaseOption(category) ? requestedMode : "individual";
}
