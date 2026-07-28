import { Category } from "../types";

export const WHISKY = "/1eb23bba-1e95-4859-8196-fcfbedbc1ecb.jpg";
export const VODKA = "/4fdc7a7e-6731-4f2b-a4bc-b1d910a9b646.jpg";
export const REDWINE = "/ca83476e-267d-437f-b1a9-2d420797b0c9.jpg";
export const BEER = "/65e17f27-387d-4e8b-a37f-4886d88503f6.jpg";

export const CATEGORY_IMAGES: Record<Category, string> = {
  Whisky: WHISKY,
  Rum: WHISKY,
  Vodka: VODKA,
  Gin: VODKA,
  Wine: REDWINE,
  Beer: BEER
};

export const VODKA_LINEUP = "/vodkas.webp";
export const RUM_LINEUP = "/rums .jpg";
export const WINE_CELLAR = "/c76d1c17-8922-4717-b20e-ae6d0135e87f.jpg";

export const CATEGORY_HERO_IMAGES: Partial<Record<Category, string>> = {
  Vodka: VODKA_LINEUP,
  Rum: RUM_LINEUP,
  Wine: WINE_CELLAR
};
