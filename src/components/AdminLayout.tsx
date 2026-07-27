import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  BoxesIcon,
  StoreIcon,
  MenuIcon,
  XIcon,
  LogOutIcon } from
"lucide-react";
import { Logo } from "./Logo";
import { BackendStatusBanner } from "./BackendStatusBanner";
import { endPortalSession } from "../lib/portalAuth";
import { useStore } from "../store/StoreContext";

const LINKS = [
{ to: "/portal", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
{ to: "/portal/orders", label: "Orders", icon: ClipboardListIcon },
{ to: "/portal/inventory", label: "Inventory", icon: BoxesIcon }];


export function AdminLayout({ children }: {children: React.ReactNode;}) {
  const { orders, products } = useStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter(
    (p) => p.stockCases <= p.lowStockThreshold
  ).length;

  const nav =
  <nav className="flex flex-col gap-1 px-3">
      {LINKS.map((l) =>
    <NavLink
      key={l.to}
      to={l.to}
      end={l.end}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
      `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      isActive ?
      "bg-burgundy-800 text-cream" :
      "text-cream/70 hover:bg-burgundy-800/50 hover:text-cream"}`

      }>
      
          <span className="flex items-center gap-3">
            <l.icon className="h-5 w-5" />
            {l.label}
          </span>
          {l.label === "Orders" && pendingCount > 0 &&
      <span className="rounded-full bg-amber2-500 px-2 py-0.5 text-[11px] font-bold text-white">
              {pendingCount}
            </span>
      }
          {l.label === "Inventory" && lowStock > 0 &&
      <span className="rounded-full bg-amber2-500 px-2 py-0.5 text-[11px] font-bold text-white">
              {lowStock}
            </span>
      }
        </NavLink>
    )}
    </nav>;


  return (
    <div className="flex min-h-screen w-full bg-cream">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-burgundy-950 py-6 lg:flex">
        <div className="mx-4 mb-8 rounded-xl bg-cream p-3">
          <Logo className="h-9" />
        </div>
        {nav}
        <div className="mt-auto space-y-1 px-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cream/70 hover:bg-burgundy-800/50 hover:text-cream">
            
            <StoreIcon className="h-5 w-5" />
            View storefront
          </Link>
          <button
            onClick={() => {
              endPortalSession();
              navigate("/portal/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-cream/70 hover:bg-burgundy-800/50 hover:text-cream">
            
            <LogOutIcon className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-burgundy-950 px-4 lg:hidden">
        <div className="rounded-lg bg-cream px-2 py-1">
          <Logo className="h-7" />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-cream"
          aria-label="Menu">
          
          {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {open &&
      <div className="fixed inset-0 top-16 z-40 bg-burgundy-950 pt-4 lg:hidden">
          {nav}
          <div className="mt-4 space-y-1 px-3">
            <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cream/70">
            
              <StoreIcon className="h-5 w-5" /> View storefront
            </Link>
            <button
            onClick={() => {
              endPortalSession();
              navigate("/portal/login");
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-cream/70">
            
              <LogOutIcon className="h-5 w-5" /> Sign out
            </button>
          </div>
        </div>
      }

      <main
        key={location.pathname}
        className="w-full flex-1 pt-16 lg:ml-64 lg:pt-0">

        <BackendStatusBanner />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </div>
      </main>
    </div>);

}