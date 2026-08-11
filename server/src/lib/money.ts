export const VAT_RATE = 0.18;

export function lineTotal(line: { mode: string; quantity: number; casePrice: number; unitPrice: number }) {
  return line.mode === "business" ? line.casePrice * line.quantity : line.unitPrice * line.quantity;
}

export function computeTotals(lines: { mode: string; quantity: number; casePrice: number; unitPrice: number }[]) {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const vat = Math.round(subtotal * VAT_RATE);
  return { subtotal, vat, total: subtotal + vat };
}
