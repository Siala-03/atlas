import { Category, Subtype } from "../types";

export const SPIRIT_CATEGORIES: Category[] = [
"Whisky", "Gin", "Cognac", "Vodka", "Rum", "Liqueur", "Tequila", "Aperitif", "Bitters"];

// Categories whose products use a genuine photo of that exact bottle. Cognac,
// Liqueur, Tequila, Aperitif, Bitters, RTD and Mixer currently borrow a
// stand-in photo from another category (no real product photography exists
// yet), so they're excluded from prominent, cosmetic showcases like the
// homepage's featured strip until real photos are supplied.
export const PHOTO_VERIFIED_CATEGORIES: Category[] = ["Whisky", "Vodka", "Wine", "Beer", "Gin", "Rum"];


export interface NavLinkSpec {
  label: string;
  to: string;
}

export const SPIRITS_DROPDOWN: NavLinkSpec[] = [
{ label: "Bourbon & Whisky", to: "/shop?category=Whisky" },
{ label: "Gin", to: "/shop?category=Gin" },
{ label: "Cognac", to: "/shop?category=Cognac" },
{ label: "Vodka", to: "/shop?category=Vodka" },
{ label: "Rum", to: "/shop?category=Rum" },
{ label: "Liqueur", to: "/shop?category=Liqueur" },
{ label: "Tequila", to: "/shop?category=Tequila" },
{ label: "Apéritifs", to: "/shop?category=Aperitif" },
{ label: "Bitters", to: "/shop?category=Bitters" }];


export const WINE_DROPDOWN: NavLinkSpec[] = [
{ label: "Red Wine", to: "/shop?category=Wine&subtype=Red" },
{ label: "White Wine", to: "/shop?category=Wine&subtype=White" },
{ label: "Rosé", to: "/shop?category=Wine&subtype=Rose" },
{ label: "Champagne & Sparkling", to: "/shop?category=Wine&subtype=Sparkling" }];


export const BEER_DROPDOWN: NavLinkSpec[] = [
{ label: "Imported", to: "/shop?category=Beer&subtype=Imported" },
{ label: "Local", to: "/shop?category=Beer&subtype=Local" }];


export interface CategoryTile {
  label: string;
  to: string;
  categories: Category[];
  subtype?: Subtype;
  image?: string;
}

// If `image` is set, it's used directly. Otherwise the image is resolved at
// render time from an actual product in `categories` (optionally narrowed by
// `subtype`), so the tile still shows a genuine photo rather than nothing.
export const SHOP_BY_CATEGORY: CategoryTile[] = [
{ label: "Spirits", to: "/shop?family=Spirits", categories: SPIRIT_CATEGORIES, image: "/spirits.jpg" },
{ label: "Wine", to: "/shop?category=Wine", categories: ["Wine"], image: "/wines.jpg" },
{ label: "Champagnes", to: "/shop?category=Wine&subtype=Sparkling", categories: ["Wine"], subtype: "Sparkling", image: "/champaigns.jpg" },
{ label: "Beer", to: "/shop?category=Beer", categories: ["Beer"], image: "/beers.jpeg" },
{ label: "RTDs & Ciders", to: "/shop?category=RTD", categories: ["RTD"], image: "/ciders rtda.jpg" },
{ label: "Mixers", to: "/shop?category=Mixer", categories: ["Mixer"] }];
