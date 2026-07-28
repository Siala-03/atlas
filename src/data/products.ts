import { Product } from "../types";
import { WHISKY, VODKA, REDWINE, BEER } from "../lib/categoryImages";

const KWV_CABERNET = "/KWV-CLA-CabSauv.jpg";
const KWV_CHARDONNAY = "/KWV-CLA-Chard-1.jpg";
const KWV_MERLOT = "/KWV-CLA-Merlot.jpg";
const KWV_SHIRAZ = "/KWV-CLA-Shiraz-5.jpg";
const KWV_CUVEE_BRUT = "/KWV-SPARKLING-CUVEE-BRUT-1.jpg";
const KWV_DEMI_SEC = "/KWV-Sparkling-Demi-Sec.jpg";
const BONNE_ESPERANCE_WHITE_5L = "/Bonne-Esperance_5L-BIB_Dry-White3.jpg";
const BONNE_ESPERANCE_RED_750 = "/New-Bonne-Esperance-750ml-Dry-Red.jpg";
const BONNE_ESPERANCE_WHITE_750 = "/New-Bonne-Esperance-750ml-Dry-White.jpg";
const PEARLY_BAY_CELEBRATION = "/Pearly-Bay-Celebration-Sparkling-Grape.jpg";
const PEARLY_BAY_SWEET_RED = "/Pearly-Bay-Sweet-Red.jpg";
const PEARLY_BAY_SWEET_ROSE = "/Pearly-Bay-Sweet-Rose.jpg";
const PEARLY_BAY_SWEET_WHITE = "/Pearly-Bay-Sweet-White-1.jpg";
const PINTA_NEGRA = "/adegamae_pinta_negra.jpg";
const ABSOLUT_VODKA = "/absolut vodka.jpeg";
const BACARDI_SUPERIOR = "/barcardi rum.jpg";
const JOHNNIE_WALKER_BLACK = "/black label whiskey.webp";
const CHIVAS_REGAL_18 = "/chivas regal whiskey.avif";
const BUMBU_XO = "/maison villevert bumbu xo rum 70cl.jpeg";
const SKYY_VODKA = "/skyy vodka.webp";
const SMIRNOFF_NO21 = "/smirnoff vodka.jpeg";
const SPIRIT_OF_YORK_RYE = "/spirit york whiskey.jpeg";
const GLENLIVET_12 = "/the-glenlivet-12-year-old-claymore-whisky-cocktail-scaled-1.avif";
const SPIRIT_OF_YORK_VODKA = "/vodkaa.jpeg";

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
},
{
  id: "p-kwv-cabernet-sauvignon",
  name: "Classic Collection Cabernet Sauvignon",
  brand: "KWV",
  category: "Wine",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 54000,
  stockCases: 42,
  lowStockThreshold: 15,
  image: KWV_CABERNET,
  description:
  "Structured Western Cape Cabernet Sauvignon with blackcurrant and cedar. A reliable, well-known label for by-the-glass lists.",
  origin: "South Africa"
},
{
  id: "p-kwv-chardonnay",
  name: "Classic Collection Chardonnay",
  brand: "KWV",
  category: "Wine",
  abv: 13,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 52000,
  stockCases: 38,
  lowStockThreshold: 15,
  image: KWV_CHARDONNAY,
  description:
  "Bright, unoaked Western Cape Chardonnay with citrus and green apple. A dependable, food-friendly white.",
  origin: "South Africa"
},
{
  id: "p-kwv-merlot",
  name: "Classic Collection Merlot",
  brand: "KWV",
  category: "Wine",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 54000,
  stockCases: 35,
  lowStockThreshold: 15,
  image: KWV_MERLOT,
  description:
  "Soft, plummy Merlot with gentle tannins. An easy-drinking red that suits most by-the-glass programmes.",
  origin: "South Africa"
},
{
  id: "p-kwv-shiraz",
  name: "Classic Collection Shiraz",
  brand: "KWV",
  category: "Wine",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 55000,
  stockCases: 33,
  lowStockThreshold: 15,
  image: KWV_SHIRAZ,
  description:
  "Peppery, full-bodied Shiraz with dark berry fruit. A well-known South African label trade buyers recognise on sight.",
  origin: "South Africa"
},
{
  id: "p-kwv-cuvee-brut",
  name: "Sparkling Cuvée Brut",
  brand: "KWV",
  category: "Wine",
  abv: 11.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 60000,
  stockCases: 24,
  lowStockThreshold: 12,
  image: KWV_CUVEE_BRUT,
  description:
  "Crisp, dry Méthode Cap Classique-style sparkling wine with fine bead. A dependable by-the-glass fizz option.",
  origin: "South Africa"
},
{
  id: "p-kwv-demi-sec",
  name: "Sparkling Demi-Sec",
  brand: "KWV",
  category: "Wine",
  abv: 11.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 60000,
  stockCases: 20,
  lowStockThreshold: 12,
  image: KWV_DEMI_SEC,
  description:
  "Off-dry sparkling wine with soft stone-fruit sweetness. A gentler alternative to Brut for celebration pours.",
  origin: "South Africa"
},
{
  id: "p-bonne-esperance-white-5l",
  name: "Dry White 5L (Bag-in-Box)",
  brand: "Bonne Espérance",
  category: "Wine",
  abv: 12,
  volume: "5L",
  unitsPerCase: 4,
  casePrice: 72000,
  stockCases: 18,
  lowStockThreshold: 8,
  image: BONNE_ESPERANCE_WHITE_5L,
  description:
  "Easy-drinking bag-in-box dry white with tropical fruit and a clean finish. Built for high-volume by-the-glass pouring.",
  origin: "South Africa"
},
{
  id: "p-bonne-esperance-red-750",
  name: "Dry Red 750ml",
  brand: "Bonne Espérance",
  category: "Wine",
  abv: 12.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 30000,
  stockCases: 46,
  lowStockThreshold: 18,
  image: BONNE_ESPERANCE_RED_750,
  description:
  "Soft, approachable dry red with ripe berry notes. An entry-level house red that moves quickly by the glass.",
  origin: "South Africa"
},
{
  id: "p-bonne-esperance-white-750",
  name: "Dry White 750ml",
  brand: "Bonne Espérance",
  category: "Wine",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 30000,
  stockCases: 50,
  lowStockThreshold: 18,
  image: BONNE_ESPERANCE_WHITE_750,
  description:
  "Light, slightly off-dry white with clean tropical notes. A reliable everyday house pour.",
  origin: "South Africa"
},
{
  id: "p-pearly-bay-celebration",
  name: "Celebration Sparkling",
  brand: "Pearly Bay",
  category: "Wine",
  abv: 7.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 28000,
  stockCases: 40,
  lowStockThreshold: 15,
  image: PEARLY_BAY_CELEBRATION,
  description:
  "Light, low-alcohol sparkling grape drink with a delicate mousse. A popular, easy-going celebration pour.",
  origin: "South Africa"
},
{
  id: "p-pearly-bay-sweet-red",
  name: "Sweet Red",
  brand: "Pearly Bay",
  category: "Wine",
  abv: 8.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 26000,
  stockCases: 36,
  lowStockThreshold: 15,
  image: PEARLY_BAY_SWEET_RED,
  description:
  "Juicy, low-alcohol sweet red with soft berry sweetness. A steady seller for guests who prefer easy-drinking reds.",
  origin: "South Africa"
},
{
  id: "p-pearly-bay-sweet-rose",
  name: "Sweet Rosé",
  brand: "Pearly Bay",
  category: "Wine",
  abv: 8.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 26000,
  stockCases: 32,
  lowStockThreshold: 15,
  image: PEARLY_BAY_SWEET_ROSE,
  description:
  "Sweet, floral rosé with a light, refreshing finish. A consistent warm-weather and by-the-glass favourite.",
  origin: "South Africa"
},
{
  id: "p-pearly-bay-sweet-white",
  name: "Sweet White",
  brand: "Pearly Bay",
  category: "Wine",
  abv: 8.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 26000,
  stockCases: 34,
  lowStockThreshold: 15,
  image: PEARLY_BAY_SWEET_WHITE,
  description:
  "Sweet, fruity white with a light body. An accessible entry-level white for casual by-the-glass service.",
  origin: "South Africa"
},
{
  id: "p-pinta-negra-tinto",
  name: "Pinta Negra Tinto",
  brand: "Adega Mãe",
  category: "Wine",
  abv: 14,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 58000,
  stockCases: 22,
  lowStockThreshold: 10,
  image: PINTA_NEGRA,
  description:
  "Full-bodied Portuguese red with dark fruit and firm structure. Also available from Adega Mãe in white and rosé on request.",
  origin: "Portugal"
},
{
  id: "p-absolut-vodka",
  name: "Absolut Vodka",
  brand: "Absolut",
  category: "Vodka",
  abv: 40,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 95000,
  stockCases: 40,
  lowStockThreshold: 15,
  image: ABSOLUT_VODKA,
  description:
  "Crafted from Swedish winter wheat and water, distilled since 1879. A globally recognised, no-surprises call vodka.",
  origin: "Sweden"
},
{
  id: "p-bacardi-superior",
  name: "Bacardí Superior White Rum",
  brand: "Bacardí",
  category: "Rum",
  abv: 40,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 70000,
  stockCases: 44,
  lowStockThreshold: 15,
  image: BACARDI_SUPERIOR,
  description:
  "The original Bacardí carta blanca — light, clean and endlessly mixable. The world's best-known white rum.",
  origin: "Puerto Rico"
},
{
  id: "p-johnnie-walker-black",
  name: "Black Label 12 Year",
  brand: "Johnnie Walker",
  category: "Whisky",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 140000,
  stockCases: 30,
  lowStockThreshold: 12,
  image: JOHNNIE_WALKER_BLACK,
  description:
  "The benchmark blended Scotch — rich, smoky and well-rounded at 12 years old. A recognised name on any back bar.",
  origin: "Scotland"
},
{
  id: "p-chivas-regal-18",
  name: "Chivas Regal 18 Year Gold Signature",
  brand: "Chivas Regal",
  category: "Whisky",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 260000,
  stockCases: 16,
  lowStockThreshold: 8,
  image: CHIVAS_REGAL_18,
  description:
  "Deep, luxurious 18-year-old blended Scotch with notes of dark chocolate and rich fruit. A premium top-shelf pour.",
  origin: "Scotland"
},
{
  id: "p-bumbu-xo",
  name: "Bumbu XO Rum",
  brand: "Bumbu (Maison Villevert)",
  category: "Rum",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 150000,
  stockCases: 20,
  lowStockThreshold: 10,
  image: BUMBU_XO,
  description:
  "Aged rum blend finished with vanilla and spice in a distinctive black ceramic bottle. A striking, premium back-bar addition.",
  origin: "Barbados"
},
{
  id: "p-skyy-vodka",
  name: "SKYY Vodka",
  brand: "SKYY",
  category: "Vodka",
  abv: 40,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 85000,
  stockCases: 36,
  lowStockThreshold: 15,
  image: SKYY_VODKA,
  description:
  "Quadruple-distilled American vodka with a clean, smooth profile. A dependable, well-priced call vodka.",
  origin: "USA"
},
{
  id: "p-smirnoff-no21",
  name: "Smirnoff No. 21 Vodka",
  brand: "Smirnoff",
  category: "Vodka",
  abv: 37.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 75000,
  stockCases: 50,
  lowStockThreshold: 18,
  image: SMIRNOFF_NO21,
  description:
  "Ten-times filtered for remarkable purity. The world's best-selling vodka and a reliable high-volume mover.",
  origin: "USA"
},
{
  id: "p-spirit-of-york-rye",
  name: "Spirit of York Rye Whisky",
  brand: "Spirit of York",
  category: "Whisky",
  abv: 40,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 130000,
  stockCases: 18,
  lowStockThreshold: 10,
  image: SPIRIT_OF_YORK_RYE,
  description:
  "A 100% rye whisky in a distinctive twisted bottle. A boutique, conversation-starting choice for premium cocktail lists.",
  origin: "Canada"
},
{
  id: "p-glenlivet-12",
  name: "The Glenlivet 12 Year Double Oak",
  brand: "The Glenlivet",
  category: "Whisky",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 170000,
  stockCases: 24,
  lowStockThreshold: 10,
  image: GLENLIVET_12,
  description:
  "The definitive single malt, matured in American and European oak casks for a smooth, fruit-forward finish.",
  origin: "Scotland"
},
{
  id: "p-spirit-of-york-vodka",
  name: "Spirit of York Vodka",
  brand: "Spirit of York",
  category: "Vodka",
  abv: 40,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 100000,
  stockCases: 22,
  lowStockThreshold: 10,
  image: SPIRIT_OF_YORK_VODKA,
  description:
  "Small-batch Canadian vodka in the same striking twisted bottle as its rye whisky sibling. A premium, distinctive call.",
  origin: "Canada"
}];