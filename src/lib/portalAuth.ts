const PORTAL_TOKEN_KEY = "atlas.operations.token.v1";

export function getPortalToken(): string | null {
  return sessionStorage.getItem(PORTAL_TOKEN_KEY);
}

export function hasPortalSession(): boolean {
  return getPortalToken() !== null;
}

export function startPortalSession(token: string): void {
  sessionStorage.setItem(PORTAL_TOKEN_KEY, token);
}

export function endPortalSession(): void {
  sessionStorage.removeItem(PORTAL_TOKEN_KEY);
}
