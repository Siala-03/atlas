const PORTAL_SESSION_KEY = "atlas.operations.session.v1";

export function hasPortalSession(): boolean {
  return sessionStorage.getItem(PORTAL_SESSION_KEY) === "active";
}

export function startPortalSession(): void {
  sessionStorage.setItem(PORTAL_SESSION_KEY, "active");
}

export function endPortalSession(): void {
  sessionStorage.removeItem(PORTAL_SESSION_KEY);
}