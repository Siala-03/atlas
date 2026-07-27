import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasPortalSession } from "../lib/portalAuth";

export function PortalGuard() {
  const location = useLocation();

  if (!hasPortalSession()) {
    return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}