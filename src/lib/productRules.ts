import { Category, ShoppingMode } from "../types";

// Spirits (whisky, rum, vodka, gin, cognac, liqueur, tequila, aperitif,
// bitters) aren't sold by the case in practice — only bottle pricing applies
// regardless of the shopper's Individual/Business toggle. Wine, Beer, RTDs
// and Mixers genuinely support both.
const CASE_OPTION_CATEGORIES: Category[] = ["Wine", "Beer", "RTD", "Mixer"];

export function hasCaseOption(category: Category): boolean {
  return CASE_OPTION_CATEGORIES.includes(category);
}

export function resolveMode(category: Category, shoppingMode: ShoppingMode): ShoppingMode {
  return hasCaseOption(category) ? shoppingMode : "individual";
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
