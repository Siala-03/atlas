// Mirrors src/lib/productRules.ts on the frontend. Beer (and future soft
// drinks) are only ever sold as a sealed case, so the server forces
// business-mode pricing/stock math for these regardless of what a client sends.
const CASE_ONLY_CATEGORIES = ["Beer"];

export function isCaseOnly(category: string): boolean {
  return CASE_ONLY_CATEGORIES.includes(category);
}
