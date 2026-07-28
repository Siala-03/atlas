import type { CSSProperties } from "react";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Only 4 base product photos exist, reused across 12 products. This derives a
 * deterministic (same product always gets the same look), subtle color/tone
 * variation per product id so repeated photos don't render pixel-identical.
 */
export function getProductImageFilter(productId: string): CSSProperties {
  const hash = hashString(productId);
  const hue = (hash % 41) - 20;
  const saturate = 80 + hash % 50;
  const brightness = 90 + (hash >> 3) % 26;
  const contrast = 92 + (hash >> 6) % 20;
  return {
    filter: `hue-rotate(${hue}deg) saturate(${saturate}%) brightness(${brightness}%) contrast(${contrast}%)`
  };
}
