const MOMO_MERCHANT_CODE = import.meta.env.VITE_MOMO_MERCHANT_CODE ?? "000000";

export function buildMomoUssdLink(amount: number): string {
  const ussd = `*182*8*1*${MOMO_MERCHANT_CODE}*${Math.round(amount)}#`;
  return `tel:${encodeURIComponent(ussd)}`;
}
