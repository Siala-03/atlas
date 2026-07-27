let sequence = 0;

export function generateReference(): string {
  const year = new Date().getFullYear();
  sequence = (sequence + 1) % 1000;
  const timePart = Date.now().toString(36).slice(-5).toUpperCase();
  return `ATL-${year}-${timePart}${sequence.toString().padStart(3, "0")}`;
}
