import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, MenuIcon, XIcon, UserRoundIcon } from "lucide-react";
import { Logo } from "./Logo";
import { getCustomerAccountId } from "../lib/customerAuth";
import { useStore } from "../store/StoreContext";
import { TradeAccount } from "../types";

const NAV = [
{ to: "/", label: "Home" },
{ to: "/shop", label: "Shop" },
{ to: "/shop?category=Whisky", label: "Spirits" },
{ to: "/shop?category=Wine", label: "Wine" },
{ to: "/shop?category=Beer", label: "Beer" },
{ to: "/about", label: "About" },
{ to: "/contact", label: "Contact" }];


export function Navbar() {
  const { cartCount, getAccount } = useStore();
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<TradeAccount | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const accountId = getCustomerAccountId();
    if (!accountId) return;
    let cancelled = false;
    getAccount(accountId).then((result) => { if (!cancelled) setAccount(result); });
    return () => {cancelled = true;};
  }, [getAccount]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-burgundy-100 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <Logo className="h-16" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) =>
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
            `text-sm font-medium tracking-wide transition-colors hover:text-burgundy-700 ${
            isActive && item.to === "/" ?
            "text-burgundy-800" :
            "text-ink/70"}`

            }
            end={item.to === "/"}>
            
              {item.label}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={account ? "/my-orders" : "/account"}
            className="hidden items-center gap-2 rounded-full border border-burgundy-200 px-3.5 py-2 text-sm font-medium text-burgundy-800 transition-colors hover:bg-burgundy-50 sm:inline-flex">
            
            <UserRoundIcon className="h-4 w-4" />
            {account ? "My orders" : "Trade account"}
          </Link>
          <button
            onClick={() => navigate("/cart")}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-burgundy-800 text-cream transition-colors hover:bg-burgundy-900"
            aria-label="Cart">
            
            <ShoppingCartIcon className="h-5 w-5" />
            {cartCount > 0 &&
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber2-500 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            }
          </button>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-burgundy-800 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu">
            
            {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open &&
      <div className="border-t border-burgundy-100 bg-cream lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {NAV.map((item) =>
          <Link
            key={item.label}
            to={item.to}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 text-sm font-medium text-ink/80 hover:bg-burgundy-50">
            
                {item.label}
              </Link>
          )}
            <Link to={account ? "/my-orders" : "/account"} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-burgundy-800 hover:bg-burgundy-50">
              {account ? "My orders" : "Trade account"}
            </Link>
          </nav>
        </div>
      }
    </header>);

}