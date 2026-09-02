// Mirrors src/lib/productRules.ts on the frontend. Piece price and case
// price are independent, admin-editable values on every product — a case
// isn't required to be a flat multiple of the piece price.

// Business/wholesale buying is available for every category, so this is now
// just an identity pass-through. Kept as a named function since it's the one
// place that would change if that ever stopped being true.
export function resolveMode(_category: string, requestedMode: "individual" | "business"): "individual" | "business" {
  return requestedMode;
}

export function bottlePrice(product: { unitPrice: number }): number {
  return product.unitPrice;
}

export function caseTotalPrice(product: { casePrice: number }): number {
  return product.casePrice;
}
