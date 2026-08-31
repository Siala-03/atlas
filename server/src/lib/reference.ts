function datePart(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

// Prefix shared by every order placed on the same calendar day, used to
// count how many references have already been issued today.
export function referencePrefix(date = new Date()): string {
  return `ATL-${datePart(date)}-`;
}

// Sequential, date-based reference so filing/record-keeping sorts naturally:
// ATL-20260831-001, ATL-20260831-002, ...
export function generateReference(sequence: number, date = new Date()): string {
  return `${referencePrefix(date)}${String(sequence).padStart(3, "0")}`;
}
