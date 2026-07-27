const CUSTOMER_SESSION_KEY = "atlas.customer.account.v1";

export function getCustomerAccountId(): string | null {
  return localStorage.getItem(CUSTOMER_SESSION_KEY);
}

export function startCustomerSession(accountId: string): void {
  localStorage.setItem(CUSTOMER_SESSION_KEY, accountId);
}

export function endCustomerSession(): void {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
}