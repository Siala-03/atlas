import { Product } from "../types";

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
const HEINEKEN_CRATE = "/crate of heineken.avif";
const TUSKER_CRATE = "/crate of tusker.jpeg";
const SKOL_CRATE = "/skol crate beer.webp";
const BEEFEATER_PINK = "/beefeater gin.jpeg";
const GILBEYS_GIN = "/gilbeys gin.jpeg";
const HENDRICKS_GIN = "/hendricks gin.jpeg";
const TANQUERAY_GIN = "/tanqueray gin.jpeg";
const WILDJAC_GIN = "/wildjac gin.jpg";
const GORDONS_GIN = "/Gordons gin.jpeg";
const THE_BOTANIST_GIN = "/The_Botanist_-_70cl gin.webp";
const HENNESSY_VS = "/Hennessy-V.S-Cognac-3.jpeg";
const REMY_MARTIN_VSOP = "/remy martin cognac.png";
const REMY_MARTIN_XO = "/Remy-Martin-XO-cognac.jpeg";
const MARTELL_VSOP = "/martell_vsop_cognac.webp";
const MARTELL_XO = "/martell-xo-cognac-extra-old.webp";
const BAILEYS_ORIGINAL = "/baileys-irish-cream 70cl liquer.jpg";
const COINTREAU = "/cointreau.jpeg";
const APEROL = "/Aperol aperitif.jpg";
const CAMPARI = "/campari-bitter aperitif.jpg";
const ANGOSTURA_BITTERS = "/angostura bitters.jpeg";
const PEYCHAUDS_BITTERS = "/Peychauds bitters.jpg";
const SMIRNOFF_ICE = "/smirnoff ice 600ml.jpg";
const SMIRNOFF_ICE_GUARANA = "/smirnoff ice guarana can 330ml.jpg";
const SAVANNA_DRY = "/savanna-dry-cider-340ml- rtd.webp";
const PRIMUS_LAGER = "/primus 50cl knowless.jpg";
const MUTZIG_LAGER = "/mutzig.webp";
const JOSE_CUERVO_ESPECIAL = "/JOSE CUERVO ESPECIAL - TEQUILA.webp";
const PATRON_SILVER = "/PATRON SILVER-TEQUILA.png";
const FOUR_COUSINS_CABERNET = "/four cousins cabernet sauvignon.jpeg";
const FOUR_COUSINS_SWEET_RED = "/four cousins natural sweet red.png";
const SCHWEPPES_TONIC = "/schweppes tonic water pack.jpg";
const COCA_COLA_BOTTLE = "/coca-cola bottle.png";

export const SEED_PRODUCTS: Product[] = [
{
  id: "p-kwv-cabernet-sauvignon",
  name: "Classic Collection Cabernet Sauvignon",
  brand: "KWV",
  category: "Wine",
  subtype: "Red",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 32000,
  stockUnits: 252,
  lowStockThreshold: 90,
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
  subtype: "White",
  abv: 13,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 31000,
  stockUnits: 228,
  lowStockThreshold: 90,
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
  subtype: "Red",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 32000,
  stockUnits: 210,
  lowStockThreshold: 90,
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
  subtype: "Red",
  abv: 13.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 33000,
  stockUnits: 198,
  lowStockThreshold: 90,
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
  subtype: "Sparkling",
  abv: 11.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 36000,
  stockUnits: 144,
  lowStockThreshold: 72,
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
  subtype: "Sparkling",
  abv: 11.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 36000,
  stockUnits: 120,
  lowStockThreshold: 72,
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
  subtype: "White",
  abv: 12,
  volume: "5L",
  unitsPerCase: 4,
  casePrice: 43000,
  stockUnits: 72,
  lowStockThreshold: 32,
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
  subtype: "Red",
  abv: 12.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 18000,
  stockUnits: 276,
  lowStockThreshold: 108,
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
  subtype: "White",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 18000,
  stockUnits: 300,
  lowStockThreshold: 108,
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
  subtype: "Sparkling",
  abv: 7.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 17000,
  stockUnits: 240,
  lowStockThreshold: 90,
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
  subtype: "Red",
  abv: 8.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 16000,
  stockUnits: 216,
  lowStockThreshold: 90,
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
  subtype: "Rose",
  abv: 8.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 16000,
  stockUnits: 192,
  lowStockThreshold: 90,
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
  subtype: "White",
  abv: 8.5,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 16000,
  stockUnits: 204,
  lowStockThreshold: 90,
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
  subtype: "Red",
  abv: 14,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 35000,
  stockUnits: 132,
  lowStockThreshold: 60,
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
  casePrice: 57000,
  stockUnits: 240,
  lowStockThreshold: 90,
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
  casePrice: 42000,
  stockUnits: 264,
  lowStockThreshold: 90,
  image: BACARDI_SUPERIOR,
  description:
  "The original Bacardí carta blanca, light, clean and endlessly mixable. The world's best-known white rum.",
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
  casePrice: 84000,
  stockUnits: 180,
  lowStockThreshold: 72,
  image: JOHNNIE_WALKER_BLACK,
  description:
  "The benchmark blended Scotch, rich, smoky and well-rounded at 12 years old. A recognised name on any back bar.",
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
  casePrice: 156000,
  stockUnits: 96,
  lowStockThreshold: 48,
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
  casePrice: 90000,
  stockUnits: 120,
  lowStockThreshold: 60,
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
  casePrice: 51000,
  stockUnits: 216,
  lowStockThreshold: 90,
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
  casePrice: 45000,
  stockUnits: 300,
  lowStockThreshold: 108,
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
  casePrice: 78000,
  stockUnits: 108,
  lowStockThreshold: 60,
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
  casePrice: 102000,
  stockUnits: 144,
  lowStockThreshold: 60,
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
  casePrice: 60000,
  stockUnits: 132,
  lowStockThreshold: 60,
  image: SPIRIT_OF_YORK_VODKA,
  description:
  "Small-batch Canadian vodka in the same striking twisted bottle as its rye whisky sibling. A premium, distinctive call.",
  origin: "Canada"
},
{
  id: "p-heineken-case",
  name: "Heineken Lager",
  brand: "Heineken",
  category: "Beer",
  subtype: "Imported",
  abv: 5,
  volume: "25cl",
  unitsPerCase: 24,
  casePrice: 25000,
  stockUnits: 1440,
  lowStockThreshold: 480,
  image: HEINEKEN_CRATE,
  description:
  "The world's most recognised green bottle. A crisp, balanced pale lager that moves fast on any back bar.",
  origin: "Netherlands"
},
{
  id: "p-tusker-case",
  name: "Tusker Malt Lager",
  brand: "Tusker",
  category: "Beer",
  subtype: "Imported",
  abv: 4.5,
  volume: "50cl",
  unitsPerCase: 24,
  casePrice: 18000,
  stockUnits: 1152,
  lowStockThreshold: 432,
  image: TUSKER_CRATE,
  description:
  "East Africa's best-known lager, smooth and malt-forward. A strong regional favourite for on-trade fridges.",
  origin: "Kenya"
},
{
  id: "p-skol-case",
  name: "Skol Lager",
  brand: "Skol",
  category: "Beer",
  subtype: "Imported",
  abv: 5,
  volume: "33cl",
  unitsPerCase: 24,
  casePrice: 16000,
  stockUnits: 1320,
  lowStockThreshold: 480,
  image: SKOL_CRATE,
  description:
  "Light, easy-drinking mainstream lager. A dependable, value volume seller for high-turnover venues.",
  origin: "Portugal"
},
{
  id: "p-beefeater-pink",
  name: "Pink Strawberry Gin",
  brand: "Beefeater",
  category: "Gin",
  abv: 37.5,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 81000,
  stockUnits: 156,
  lowStockThreshold: 72,
  image: BEEFEATER_PINK,
  description:
  "London Dry Gin infused with natural strawberry flavour. A vibrant, approachable gin for spritzes and easy serves.",
  origin: "England"
},
{
  id: "p-gilbeys-gin",
  name: "Special Dry Gin",
  brand: "Gilbey's",
  category: "Gin",
  abv: 40,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 48000,
  stockUnits: 204,
  lowStockThreshold: 90,
  image: GILBEYS_GIN,
  description:
  "A delicate blend of 12 natural botanicals with a hint of citrus. A dependable, value-priced call gin.",
  origin: "England"
},
{
  id: "p-hendricks-gin",
  name: "Hendrick's Gin",
  brand: "Hendrick's",
  category: "Gin",
  abv: 41.4,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 99000,
  stockUnits: 120,
  lowStockThreshold: 60,
  image: HENDRICKS_GIN,
  description:
  "Infused with rose and cucumber alongside classic botanicals. A distinctive, premium gin with a devoted following.",
  origin: "Scotland"
},
{
  id: "p-tanqueray-gin",
  name: "London Dry Gin",
  brand: "Tanqueray",
  category: "Gin",
  abv: 43.1,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 87000,
  stockUnits: 168,
  lowStockThreshold: 72,
  image: TANQUERAY_GIN,
  description:
  "Bold, juniper-forward London Dry in the iconic green bottle. A classic, high-recognition call gin.",
  origin: "England"
},
{
  id: "p-wildjac-gin",
  name: "Natural Dry Gin",
  brand: "Wildjac",
  category: "Gin",
  abv: 37.5,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 72000,
  stockUnits: 90,
  lowStockThreshold: 48,
  image: WILDJAC_GIN,
  description:
  "Sustainably produced natural dry gin with elderberry, chamomile and juniper. A boutique choice for craft cocktail lists.",
  origin: "England"
},
{
  id: "p-gordons-london-dry-gin",
  name: "London Dry Gin",
  brand: "Gordon's",
  category: "Gin",
  abv: 37.5,
  volume: "70cl",
  unitsPerCase: 12,
  casePrice: 78996,
  stockUnits: 312,
  lowStockThreshold: 120,
  image: GORDONS_GIN,
  description:
  "The world's best-selling London Dry Gin, distilled to a recipe unchanged since 1769. Juniper-forward with a crisp, clean finish and the trade standard for gin cocktails.",
  origin: "United Kingdom"
},
{
  id: "p-the-botanist-islay-dry-gin",
  name: "Islay Dry Gin",
  brand: "The Botanist",
  category: "Gin",
  abv: 46,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 126000,
  stockUnits: 72,
  lowStockThreshold: 36,
  image: THE_BOTANIST_GIN,
  description:
  "Conceived, distilled and hand-crafted on the island of Islay using 22 foraged local botanicals alongside the traditional nine. A premium, distinctive gin for discerning cocktail programmes.",
  origin: "Scotland"
},
{
  id: "p-primus-lager",
  name: "Primus Lager",
  brand: "Primus",
  category: "Beer",
  subtype: "Local",
  abv: 5.5,
  volume: "72cl",
  unitsPerCase: 24,
  casePrice: 28800,
  stockUnits: 960,
  lowStockThreshold: 360,
  image: PRIMUS_LAGER,
  description:
  "Rwanda's original lager, malty and full-bodied. A steady, high-volume local favourite.",
  origin: "Rwanda"
},
{
  id: "p-mutzig-lager",
  name: "Mützig Lager",
  brand: "Mützig",
  category: "Beer",
  subtype: "Local",
  abv: 5.2,
  volume: "50cl",
  unitsPerCase: 24,
  casePrice: 15000,
  stockUnits: 864,
  lowStockThreshold: 288,
  image: MUTZIG_LAGER,
  description:
  "Crisp, premium-positioned Rwandan lager. A popular choice on local bar and restaurant menus.",
  origin: "Rwanda"
},
{
  id: "p-hennessy-vs",
  name: "Hennessy VS",
  brand: "Hennessy",
  category: "Cognac",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 288000,
  stockUnits: 60,
  lowStockThreshold: 24,
  image: HENNESSY_VS,
  description:
  "The world's best-selling Cognac. Fruity and full-bodied with a distinctive Hennessy character.",
  origin: "France"
},
{
  id: "p-remy-martin-vsop",
  name: "VSOP Cognac",
  brand: "Rémy Martin",
  category: "Cognac",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 450000,
  stockUnits: 36,
  lowStockThreshold: 18,
  image: REMY_MARTIN_VSOP,
  description:
  "A rich, well-balanced VSOP blend with notes of dried fruit and vanilla. A recognised premium Cognac label.",
  origin: "France"
},
{
  id: "p-baileys-original",
  name: "Original Irish Cream",
  brand: "Baileys",
  category: "Liqueur",
  abv: 17,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 132000,
  stockUnits: 84,
  lowStockThreshold: 36,
  image: BAILEYS_ORIGINAL,
  description:
  "The world's best-known Irish cream liqueur, blending fresh cream and Irish whiskey. A dependable dessert-list staple.",
  origin: "Ireland"
},
{
  id: "p-cointreau",
  name: "Cointreau Triple Sec",
  brand: "Cointreau",
  category: "Liqueur",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 228000,
  stockUnits: 48,
  lowStockThreshold: 24,
  image: COINTREAU,
  description:
  "A clean, orange-peel triple sec used across classic cocktails. A must-stock for any serious cocktail programme.",
  origin: "France"
},
{
  id: "p-jose-cuervo-especial",
  name: "Especial Gold",
  brand: "Jose Cuervo",
  category: "Tequila",
  abv: 38,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 168000,
  stockUnits: 72,
  lowStockThreshold: 30,
  image: JOSE_CUERVO_ESPECIAL,
  description:
  "The world's best-selling tequila. Smooth gold tequila for shots and classic cocktails alike.",
  origin: "Mexico"
},
{
  id: "p-patron-silver",
  name: "Silver",
  brand: "Patrón",
  category: "Tequila",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 432000,
  stockUnits: 36,
  lowStockThreshold: 18,
  image: PATRON_SILVER,
  description:
  "Ultra-premium 100% Weber blue agave tequila. Clean and smooth, made for sipping or an elevated margarita.",
  origin: "Mexico"
},
{
  id: "p-aperol",
  name: "Aperol",
  brand: "Aperol",
  category: "Aperitif",
  abv: 11,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 120000,
  stockUnits: 90,
  lowStockThreshold: 36,
  image: APEROL,
  description:
  "Bright orange, bittersweet Italian aperitivo. The essential base for an Aperol Spritz.",
  origin: "Italy"
},
{
  id: "p-campari",
  name: "Campari",
  brand: "Campari",
  category: "Aperitif",
  abv: 25,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 144000,
  stockUnits: 60,
  lowStockThreshold: 24,
  image: CAMPARI,
  description:
  "Deeply bitter, herbal Italian aperitivo with a signature red hue. A classic Negroni and spritz component.",
  origin: "Italy"
},
{
  id: "p-angostura-bitters",
  name: "Aromatic Bitters",
  brand: "Angostura",
  category: "Bitters",
  abv: 44.7,
  volume: "20cl",
  unitsPerCase: 12,
  casePrice: 108000,
  stockUnits: 96,
  lowStockThreshold: 36,
  image: ANGOSTURA_BITTERS,
  description:
  "The industry-standard aromatic bitters, dashed into cocktails worldwide. A back-bar essential.",
  origin: "Trinidad and Tobago"
},
{
  id: "p-peychauds-bitters",
  name: "Peychaud's Bitters",
  brand: "Peychaud's",
  category: "Bitters",
  abv: 35,
  volume: "15cl",
  unitsPerCase: 12,
  casePrice: 102000,
  stockUnits: 72,
  lowStockThreshold: 24,
  image: PEYCHAUDS_BITTERS,
  description:
  "Sweet, floral anise-forward bitters, the signature note in a Sazerac. A staple for classic cocktail lists.",
  origin: "USA"
},
{
  id: "p-smirnoff-ice",
  name: "Smirnoff Ice Original",
  brand: "Smirnoff",
  category: "RTD",
  abv: 4.5,
  volume: "27.5cl",
  unitsPerCase: 24,
  casePrice: 21000,
  stockUnits: 480,
  lowStockThreshold: 168,
  image: SMIRNOFF_ICE,
  description:
  "Crisp, refreshing premix vodka mixer. Ready to drink straight from the bottle, no mixing required.",
  origin: "South Africa"
},
{
  id: "p-savanna-dry",
  name: "Savanna Dry Cider",
  brand: "Savanna",
  category: "RTD",
  abv: 6,
  volume: "33cl",
  unitsPerCase: 24,
  casePrice: 26000,
  stockUnits: 384,
  lowStockThreshold: 144,
  image: SAVANNA_DRY,
  description:
  "Dry, crisp apple cider with a clean finish. A consistently strong seller in the ready-to-drink category.",
  origin: "South Africa"
},
{
  id: "p-schweppes-tonic",
  name: "Tonic Water",
  brand: "Schweppes",
  category: "Mixer",
  abv: 0,
  volume: "20cl",
  unitsPerCase: 24,
  casePrice: 12000,
  stockUnits: 600,
  lowStockThreshold: 216,
  image: SCHWEPPES_TONIC,
  description:
  "The classic quinine mixer for gin and tonics. Essential shelf stock alongside any gin selection.",
  origin: "United Kingdom"
},
{
  id: "p-coca-cola-original",
  name: "Coca-Cola Original",
  brand: "Coca-Cola",
  category: "Mixer",
  abv: 0,
  volume: "30cl",
  unitsPerCase: 24,
  casePrice: 10000,
  stockUnits: 720,
  lowStockThreshold: 240,
  image: COCA_COLA_BOTTLE,
  description:
  "The everyday mixer for rum and whisky serves. High-turnover stock for any bar setup.",
  origin: "Rwanda"
},
{
  id: "p-remy-martin-xo",
  name: "XO Cognac",
  brand: "Rémy Martin",
  category: "Cognac",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 870000,
  stockUnits: 24,
  lowStockThreshold: 12,
  image: REMY_MARTIN_XO,
  description:
  "A rich, complex XO blend of aged eaux-de-vie with notes of fig, plum and toasted spice. A top-shelf Cognac for serious collectors.",
  origin: "France"
},
{
  id: "p-martell-vsop",
  name: "VSOP Cognac",
  brand: "Martell",
  category: "Cognac",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 420000,
  stockUnits: 42,
  lowStockThreshold: 18,
  image: MARTELL_VSOP,
  description:
  "The world's oldest great Cognac house's signature VSOP, smooth and elegantly balanced. A widely recognised premium Cognac.",
  origin: "France"
},
{
  id: "p-martell-xo",
  name: "XO Extra Old Cognac",
  brand: "Martell",
  category: "Cognac",
  abv: 40,
  volume: "70cl",
  unitsPerCase: 6,
  casePrice: 840000,
  stockUnits: 24,
  lowStockThreshold: 12,
  image: MARTELL_XO,
  description:
  "A deep, opulent XO blend aged for decades, showing notes of candied fruit and oak. A prestige Cognac for special occasions.",
  origin: "France"
},
{
  id: "p-smirnoff-ice-guarana",
  name: "Smirnoff Ice Guaraná",
  brand: "Smirnoff",
  category: "RTD",
  abv: 4.5,
  volume: "33cl",
  unitsPerCase: 24,
  casePrice: 24000,
  stockUnits: 384,
  lowStockThreshold: 144,
  image: SMIRNOFF_ICE_GUARANA,
  description:
  "Smirnoff Ice with a tropical guaraná twist. A vibrant, fruity ready-to-drink can.",
  origin: "South Africa"
},
{
  id: "p-four-cousins-cabernet-sauvignon",
  name: "Collection Cabernet Sauvignon",
  brand: "Four Cousins",
  category: "Wine",
  subtype: "Red",
  abv: 13,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 33000,
  stockUnits: 180,
  lowStockThreshold: 72,
  image: FOUR_COUSINS_CABERNET,
  description:
  "An easy-drinking South African Cabernet Sauvignon from a family of wine lovers, soft tannins and ripe dark fruit.",
  origin: "South Africa"
},
{
  id: "p-four-cousins-natural-sweet-red",
  name: "Natural Sweet Red",
  brand: "Four Cousins",
  category: "Wine",
  subtype: "Red",
  abv: 8,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 27000,
  stockUnits: 216,
  lowStockThreshold: 90,
  image: FOUR_COUSINS_SWEET_RED,
  description:
  "A juicy, low-alcohol natural sweet red bursting with berry flavour. One of South Africa's most popular easy-drinking reds.",
  origin: "South Africa"
},
{
  id: "p-chateaux-gillet-bordeaux-red",
  name: "Bordeaux Red Wine",
  brand: "Châteaux Gillet",
  category: "Wine",
  subtype: "Red",
  abv: 12.5,
  volume: "75cl",
  unitsPerCase: 12,
  casePrice: 21000,
  stockUnits: 240,
  lowStockThreshold: 96,
  image: KWV_CABERNET,
  description: "Classic Bordeaux red blend with soft tannins and dark fruit.",
  origin: "France"
},
{
  id: "p-chateaux-gillet-bordeaux-white",
  name: "Bordeaux White Wine",
  brand: "Châteaux Gillet",
  category: "Wine",
  subtype: "White",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 12,
  casePrice: 21000,
  stockUnits: 240,
  lowStockThreshold: 96,
  image: KWV_CHARDONNAY,
  description: "Crisp, dry Bordeaux white blend with citrus and stone fruit.",
  origin: "France"
},
{
  id: "p-chateaux-perron-la-gourdine-red",
  name: "La Gourdine Red Wine",
  brand: "Châteaux Perron",
  category: "Wine",
  subtype: "Red",
  abv: 12.5,
  volume: "75cl",
  unitsPerCase: 12,
  casePrice: 21000,
  stockUnits: 240,
  lowStockThreshold: 96,
  image: KWV_MERLOT,
  description: "Approachable French red with ripe berry notes and a smooth finish.",
  origin: "France"
},
{
  id: "p-chateaux-perron-la-gourdine-white",
  name: "La Gourdine White Wine",
  brand: "Châteaux Perron",
  category: "Wine",
  subtype: "White",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 12,
  casePrice: 21000,
  stockUnits: 240,
  lowStockThreshold: 96,
  image: KWV_CHARDONNAY,
  description: "Light, food-friendly French white with clean fruit character.",
  origin: "France"
},
{
  id: "p-chateaux-maucru-bordeaux",
  name: "Bordeaux",
  brand: "Châteaux Maucru",
  category: "Wine",
  subtype: "Red",
  abv: 12.5,
  volume: "75cl",
  unitsPerCase: 12,
  casePrice: 25500,
  stockUnits: 216,
  lowStockThreshold: 96,
  image: KWV_SHIRAZ,
  description: "Well-structured Bordeaux red, a reliable house pour.",
  origin: "France"
},
{
  id: "p-chateaux-vignoble-bordeaux-superieur",
  name: "Bordeaux Supérieur",
  brand: "Châteaux Vignoble",
  category: "Wine",
  subtype: "Red",
  abv: 13,
  volume: "75cl",
  unitsPerCase: 12,
  casePrice: 28000,
  stockUnits: 216,
  lowStockThreshold: 96,
  image: BONNE_ESPERANCE_RED_750,
  description: "Fuller-bodied Bordeaux Supérieur with firmer tannins and depth.",
  origin: "France"
},
{
  id: "p-reserve-ronciere-cotes-du-rhone",
  name: "Côtes du Rhône",
  brand: "Réserve de la Roncière",
  category: "Wine",
  subtype: "Red",
  abv: 13,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 201000,
  stockUnits: 108,
  lowStockThreshold: 48,
  image: KWV_SHIRAZ,
  description: "Peppery, warm-climate Côtes du Rhône red blend.",
  origin: "France"
},
{
  id: "p-chateauneuf-du-pape-red",
  name: "Red Wine",
  brand: "Châteauneuf Du Pape",
  category: "Wine",
  subtype: "Red",
  abv: 14,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 444000,
  stockUnits: 36,
  lowStockThreshold: 12,
  image: KWV_SHIRAZ,
  description: "Prestigious Southern Rhône appellation red, rich and full-bodied.",
  origin: "France"
},
{
  id: "p-glamour-rose",
  name: "Rosé",
  brand: "Glamour",
  category: "Wine",
  subtype: "Rose",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 99000,
  stockUnits: 108,
  lowStockThreshold: 48,
  image: PEARLY_BAY_SWEET_ROSE,
  description: "Pale, easy-drinking French rosé with delicate red fruit.",
  origin: "France"
},
{
  id: "p-vollereaux-celebration-premier-cru",
  name: "Celebration Premier Cru",
  brand: "Champagne Vollereaux",
  category: "Wine",
  subtype: "Sparkling",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 79500,
  stockUnits: 72,
  lowStockThreshold: 24,
  image: KWV_CUVEE_BRUT,
  description: "Premier Cru Champagne, fine bead and elegant balance for celebrations.",
  origin: "France"
},
{
  id: "p-vollereaux-reserve-brut",
  name: "Réserve Brut",
  brand: "Champagne Vollereaux",
  category: "Wine",
  subtype: "Sparkling",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 79500,
  stockUnits: 72,
  lowStockThreshold: 24,
  image: KWV_CUVEE_BRUT,
  description: "Classic dry Champagne reserve blend, crisp and well-rounded.",
  origin: "France"
},
{
  id: "p-vollereaux-blanc-de-blancs-brut",
  name: "Blanc de Blancs Brut",
  brand: "Champagne Vollereaux",
  category: "Wine",
  subtype: "Sparkling",
  abv: 12,
  volume: "75cl",
  unitsPerCase: 6,
  casePrice: 97000,
  stockUnits: 60,
  lowStockThreshold: 24,
  image: KWV_DEMI_SEC,
  description: "100% Chardonnay Blanc de Blancs Champagne, refined and citrus-driven.",
  origin: "France"
}];