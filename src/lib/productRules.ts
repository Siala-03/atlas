import { Category, Product, ShoppingMode } from "../types";

// Business/wholesale buying (quantity = number of cases) is available for
// every category, so this is now just an identity pass-through. Kept as a
// named function since it's the one place that would change if that ever
// stopped being true.
export function resolveMode(_category: Category, shoppingMode: ShoppingMode): ShoppingMode {
  return shoppingMode;
}

// The per-piece price a shopper sees/pays, set independently from the case
// price (a case isn't required to be a flat multiple of the piece price —
// e.g. a genuine case discount).
export function bottlePrice(product: Pick<Product, "unitPrice">): number {
  return product.unitPrice;
}

// The wholesale per-case total a business buyer pays, set independently
// from the piece price.
export function caseTotalPrice(product: Pick<Product, "casePrice">): number {
  return product.casePrice;
}

export interface UnitLabels {
  individual: string;
  business: string;
}

const UNIT_LABELS: Partial<Record<Category, UnitLabels>> = {
  Beer: { individual: "piece", business: "crate" },
  RTD: { individual: "can", business: "pack" },
  Mixer: { individual: "bottle", business: "pack" },
  Bitters: { individual: "bottle", business: "pack" }
};

const DEFAULT_UNIT_LABELS: UnitLabels = { individual: "bottle", business: "case" };

export function unitLabels(category: Category): UnitLabels {
  return UNIT_LABELS[category] ?? DEFAULT_UNIT_LABELS;
}

// Warehouse stocking granularity: whether this category is counted and
// restocked in whole cases (crates) rather than individual bottles. This is
// an inventory-management concern, independent of piece/case pricing.
const CASE_STOCKED_CATEGORIES: Category[] = ["Beer"];

export function isCaseStocked(category: Category): boolean {
  return CASE_STOCKED_CATEGORIES.includes(category);
}
