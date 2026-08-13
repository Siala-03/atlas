import { Category, ShoppingMode } from "../types";

// Beer (and future soft drinks) are packaged in crates and can genuinely be
// bought either as loose pieces or as a full case — the shopper's chosen
// individual/business mode applies. Everything else (wine, spirits) is
// always sold per bottle regardless of that toggle; there's no separate
// case price for those.
const CASE_OPTION_CATEGORIES: Category[] = ["Beer"];

export function hasCaseOption(category: Category): boolean {
  return CASE_OPTION_CATEGORIES.includes(category);
}

export function resolveMode(category: Category, shoppingMode: ShoppingMode): ShoppingMode {
  return hasCaseOption(category) ? shoppingMode : "individual";
}
