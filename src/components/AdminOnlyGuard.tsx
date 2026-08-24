import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isPortalAdmin } from "../lib/portalAuth";

// Nested inside PortalGuard: gates admin-only pages (Inventory, Settings)
// from staff sessions. The real security boundary is server-side
// (requireRole("admin")) - this is just so staff aren't shown a page
// they can't actually act on.
export function AdminOnlyGuard() {
  if (!isPortalAdmin()) {
    return <Navigate to="/portal" replace />;
  }
  return <Outlet />;
}
