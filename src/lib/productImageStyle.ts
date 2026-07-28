import type { CSSProperties } from "react";
import { WHISKY, VODKA, REDWINE, BEER } from "./categoryImages";

const SHARED_STOCK_IMAGES = new Set<string>([WHISKY, VODKA, REDWINE, BEER]);

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * A handful of products still share one of the 4 old stock photos. This
 * derives a deterministic (same product always gets the same look, not
 * random) color/tone variation per product id so those repeated photos don't
 * render pixel-identical. Products with their own real photo are returned
 * untouched — only the shared stock images need differentiating.
 */
export function getProductImageFilter(productId: string, imagePath: string): CSSProperties {
  if (!SHARED_STOCK_IMAGES.has(imagePath)) return {};

  const hash = hashString(productId);
  const hue = (hash % 41) - 20;
  const saturate = 80 + hash % 50;
  const brightness = 90 + (hash >> 3) % 26;
  const contrast = 92 + (hash >> 6) % 20;
  return {
    filter: `hue-rotate(${hue}deg) saturate(${saturate}%) brightness(${brightness}%) contrast(${contrast}%)`
  };
}
