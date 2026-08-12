import { Category } from "../types";

// Beer (and future soft drinks) are only ever packaged and sold as a sealed
// case/crate — there is no loose individual-can purchase, so these ignore
// the shopper's individual/business mode and are always priced/sold by the case.
const CASE_ONLY_CATEGORIES: Category[] = ["Beer"];

export function isCaseOnly(category: Category): boolean {
  return CASE_ONLY_CATEGORIES.includes(category);
}
