import { Category, Product, ShoppingMode, unitPrice } from "../types";

// Wine, Beer, RTDs and Mixers are stocked with a genuine case SKU, so their
// stored `casePrice` is already a real case total. Spirits (whisky, rum,
// vodka, gin, cognac, liqueur, tequila, aperitif, bitters) have no separate
// case SKU — their stored `casePrice` is actually the bottle price. This
// only affects how the per-bottle and per-case prices are *derived*; every
// category supports wholesale/business buying (minimum 1 case).
const CASE_OPTION_CATEGORIES: Category[] = ["Wine", "Beer", "RTD", "Mixer"];

export function hasCaseOption(category: Category): boolean {
  return CASE_OPTION_CATEGORIES.includes(category);
}

// Business/wholesale buying (quantity = number of cases) is available for
// every category, so this is now just an identity pass-through. Kept as a
// named function since it's the one place that would change if that ever
// stopped being true.
export function resolveMode(_category: Category, shoppingMode: ShoppingMode): ShoppingMode {
  return shoppingMode;
}

// The per-bottle price a shopper sees/pays. For case-option categories the
// stored price is a real case total, so it's divided by unitsPerCase. For
// everything else (spirits) there's no case concept at all — the stored
// price already *is* the bottle price, so it's used directly.
export function bottlePrice(product: Pick<Product, "casePrice" | "unitsPerCase" | "category">): number {
  return hasCaseOption(product.category) ? unitPrice(product) : product.casePrice;
}

// The wholesale per-case total a business buyer pays. For case-option
// categories the stored price already *is* the real case total. For spirits
// there's no separate case SKU, so the case total is the original, undivided
// bottle price multiplied by the number of bottles in a case.
export function caseTotalPrice(product: Pick<Product, "casePrice" | "unitsPerCase" | "category">): number {
  return hasCaseOption(product.category) ? product.casePrice : bottlePrice(product) * product.unitsPerCase;
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
