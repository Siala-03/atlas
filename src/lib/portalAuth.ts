const PORTAL_TOKEN_KEY = "atlas.operations.token.v1";
const PORTAL_ROLE_KEY = "atlas.operations.role.v1";
const PORTAL_NAME_KEY = "atlas.operations.name.v1";

export type PortalRole = "admin" | "staff";

export function getPortalToken(): string | null {
  return sessionStorage.getItem(PORTAL_TOKEN_KEY);
}

export function getPortalRole(): PortalRole {
  return sessionStorage.getItem(PORTAL_ROLE_KEY) === "staff" ? "staff" : "admin";
}

export function getPortalName(): string {
  return sessionStorage.getItem(PORTAL_NAME_KEY) ?? "Owner";
}

export function isPortalAdmin(): boolean {
  return getPortalRole() === "admin";
}

export function hasPortalSession(): boolean {
  return getPortalToken() !== null;
}

export function startPortalSession(token: string, role: PortalRole, name: string): void {
  sessionStorage.setItem(PORTAL_TOKEN_KEY, token);
  sessionStorage.setItem(PORTAL_ROLE_KEY, role);
  sessionStorage.setItem(PORTAL_NAME_KEY, name);
}

export function endPortalSession(): void {
  sessionStorage.removeItem(PORTAL_TOKEN_KEY);
  sessionStorage.removeItem(PORTAL_ROLE_KEY);
  sessionStorage.removeItem(PORTAL_NAME_KEY);
}
