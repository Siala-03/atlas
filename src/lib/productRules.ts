import { Category, ShoppingMode } from "../types";

// Every product carries both a per-unit and a case price, so switching
// between Individual and Business mode always changes pricing and
// quantities — it's valid for every category, not just beer.
export function resolveMode(_category: Category, shoppingMode: ShoppingMode): ShoppingMode {
  return shoppingMode;
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
// an inventory-management concern, independent of whether shoppers can buy
// the category by the case.
const CASE_STOCKED_CATEGORIES: Category[] = ["Beer"];

export function isCaseStocked(category: Category): boolean {
  return CASE_STOCKED_CATEGORIES.includes(category);
}
