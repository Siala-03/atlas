export const VAT_RATE = 0.18;

export function computeTotals(lines: { casePrice: number; cases: number }[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.casePrice * line.cases, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  return { subtotal, vat, total: subtotal + vat };
}
