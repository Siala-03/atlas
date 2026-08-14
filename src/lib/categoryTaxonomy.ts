import { Category } from "../types";
import { WHISKY, VODKA, REDWINE, BEER } from "./categoryImages";

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
{ label: "Sparkling", to: "/shop?category=Wine&subtype=Sparkling" },
{ label: "Champagne & Sparkling", to: "/shop?category=Wine&subtype=Sparkling" }];


export const BEER_DROPDOWN: NavLinkSpec[] = [
{ label: "Imported", to: "/shop?category=Beer&subtype=Imported" },
{ label: "Local", to: "/shop?category=Beer&subtype=Local" }];


export interface CategoryTile {
  label: string;
  to: string;
  image: string;
}

export const SHOP_BY_CATEGORY: CategoryTile[] = [
{ label: "Spirits", to: "/shop?family=Spirits", image: WHISKY },
{ label: "Wine", to: "/shop?category=Wine", image: REDWINE },
{ label: "Champagnes", to: "/shop?category=Wine&subtype=Sparkling", image: REDWINE },
{ label: "Beer", to: "/shop?category=Beer", image: BEER },
{ label: "RTDs & Ciders", to: "/shop?category=RTD", image: BEER },
{ label: "Mixers", to: "/shop?category=Mixer", image: VODKA }];
