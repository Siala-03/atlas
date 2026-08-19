export const DELIVERY_FEE = 1500;

export function lineTotal(line: { mode: string; quantity: number; casePrice: number; unitPrice: number }) {
  return line.mode === "business" ? line.casePrice * line.quantity : line.unitPrice * line.quantity;
}

export function computeTotals(lines: { mode: string; quantity: number; casePrice: number; unitPrice: number }[]) {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}
