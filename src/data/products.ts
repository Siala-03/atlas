import { Product } from "../types";
import { WHISKY, VODKA, REDWINE, BEER } from "../lib/categoryImages";

export const SEED_PRODUCTS: Product[] = [
{
  id: "p-highland-single-malt",
  name: "Highland Single Malt 12yr",
  brand: "Glen Atlas",
  category: "Whisky",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 210000,
  stockCases: 48,
  lowStockThreshold: 12,
  image: WHISKY,
  description:
  "A rich, honeyed Highland single malt aged twelve years in oak. Notes of dried fruit, vanilla and gentle spice. A dependable premium listing for any back bar.",
  origin: "Scotland"
},
{
  id: "p-blended-scotch",
  name: "Reserve Blended Scotch",
  brand: "Meridian",
  category: "Whisky",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 12,
  casePrice: 185000,
  stockCases: 9,
  lowStockThreshold: 12,
  image: WHISKY,
  description:
  "Smooth, versatile blended Scotch built for high-volume pours. Balanced malt-to-grain profile that mixes beautifully.",
  origin: "Scotland"
},
{
  id: "p-bourbon",
  name: "Small Batch Bourbon",
  brand: "Cedar Ridge",
  category: "Whisky",
  abv: 45,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 175000,
  stockCases: 30,
  lowStockThreshold: 8,
  image: WHISKY,
  description:
  "Caramel-forward small batch bourbon with a warm, lingering finish. A fast-moving spirit for cocktail programmes.",
  origin: "USA"
},
{
  id: "p-premium-vodka",
  name: "Premium Grain Vodka",
  brand: "Northwind",
  category: "Vodka",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 12,
  casePrice: 145000,
  stockCases: 64,
  lowStockThreshold: 15,
  image: VODKA,
  description:
  "Clean, crisp six-times distilled grain vodka. The workhorse of any well — neutral, smooth and endlessly mixable.",
  origin: "Poland"
},
{
  id: "p-craft-vodka",
  name: "Craft Wheat Vodka",
  brand: "Silverbirch",
  category: "Vodka",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 130000,
  stockCases: 4,
  lowStockThreshold: 10,
  image: VODKA,
  description:
  "A softer, subtly sweet craft wheat vodka. Ideal as a premium upsell for martinis and signature serves.",
  origin: "England"
},
{
  id: "p-london-dry-gin",
  name: "London Dry Gin",
  brand: "Kingsway",
  category: "Gin",
  abv: 43,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 155000,
  stockCases: 26,
  lowStockThreshold: 8,
  image: VODKA,
  description:
  "Classic juniper-led London Dry with citrus and coriander. A must-stock for the perennial G&T.",
  origin: "England"
},
{
  id: "p-spiced-rum",
  name: "Caribbean Spiced Rum",
  brand: "Tradewind",
  category: "Rum",
  abv: 37.5,
  volume: "70cl",
  unitsPerCase: 12,
  casePrice: 150000,
  stockCases: 21,
  lowStockThreshold: 10,
  image: WHISKY,
  description:
  "Warm vanilla and baking-spice spiced rum. A crowd-pleaser that drives strong margins in mixed serves.",
  origin: "Barbados"
},
{
  id: "p-cabernet",
  name: "Cabernet Sauvignon",
  brand: "Vallée Rouge",
  category: "Wine",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 78000,
  stockCases: 88,
  lowStockThreshold: 20,
  image: REDWINE,
  description:
  "Full-bodied Cabernet with blackcurrant, cedar and soft tannins. A reliable by-the-glass red.",
  origin: "France"
},
{
  id: "p-malbec",
  name: "Reserve Malbec",
  brand: "Alta Sierra",
  category: "Wine",
  abv: 14,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 92000,
  stockCases: 11,
  lowStockThreshold: 15,
  image: REDWINE,
  description:
  "Plush Argentinian Malbec bursting with dark plum and cocoa. A popular premium pour.",
  origin: "Argentina"
},
{
  id: "p-sauvignon-blanc",
  name: "Sauvignon Blanc",
  brand: "Bay Cellars",
  category: "Wine",
  abv: 12.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 72000,
  stockCases: 54,
  lowStockThreshold: 18,
  image: REDWINE,
  description:
  "Zesty, aromatic Sauvignon Blanc with gooseberry and citrus. High-turnover white for any list.",
  origin: "New Zealand"
},
{
  id: "p-craft-lager",
  name: "Craft Lager (Case)",
  brand: "Harbour Brew Co.",
  category: "Beer",
  abv: 4.8,
  volume: "330ml",
  unitsPerCase: 24,
  casePrice: 36000,
  stockCases: 120,
  lowStockThreshold: 30,
  image: BEER,
  description:
  "Crisp, sessionable craft lager in 24-bottle cases. The dependable volume seller.",
  origin: "England"
},
{
  id: "p-ipa",
  name: "West Coast IPA (Case)",
  brand: "Harbour Brew Co.",
  category: "Beer",
  abv: 5.6,
  volume: "330ml",
  unitsPerCase: 24,
  casePrice: 44000,
  stockCases: 7,
  lowStockThreshold: 20,
  image: BEER,
  description:
  "Bold, hop-forward IPA with tropical fruit and pine. A premium craft option that commands a higher pour price.",
  origin: "England"
}];