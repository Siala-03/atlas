import { Customer } from "../types";

const TOKEN_KEY = "atlas.customer.token.v1";
const PROFILE_KEY = "atlas.customer.profile.v1";

export function getCustomerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCustomerProfile(): Customer | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) as Customer : null;
  } catch {
    return null;
  }
}

export function startCustomerSession(token: string, customer: Customer): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(customer));
}

export function endCustomerSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
}
