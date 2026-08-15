const MOMO_MERCHANT_CODE = import.meta.env.VITE_MOMO_MERCHANT_CODE ?? "000000";

export function buildMomoUssdCode(amount: number): string {
  return `*182*8*1*${MOMO_MERCHANT_CODE}*${Math.round(amount)}#`;
}

export function buildMomoUssdLink(amount: number): string {
  return `tel:${encodeURIComponent(buildMomoUssdCode(amount))}`;
}
