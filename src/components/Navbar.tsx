import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCartIcon, MenuIcon, XIcon, SearchIcon } from "lucide-react";
import { Logo } from "./Logo";
import { ShopModeToggle } from "./ShopModeToggle";
import { useStore } from "../store/StoreContext";

const NAV = [
{ to: "/", label: "Home" },
{ to: "/shop", label: "Shop" },
{ to: "/shop?category=Whisky", label: "Spirits" },
{ to: "/shop?category=Wine", label: "Wine" },
{ to: "/shop?category=Beer", label: "Beer" },
{ to: "/about", label: "About" },
{ to: "/contact", label: "Contact" }];


export function Navbar() {
  const { cartCount, openCart } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

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

        <div className="flex items-center gap-3">
          <ShopModeToggle className="hidden sm:inline-flex" />
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-burgundy-800 hover:bg-burgundy-50"
            aria-label="Search">

            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            onClick={openCart}
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

      <AnimatePresence>
        {searchOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-burgundy-100 bg-cream">

            <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <SearchIcon className="h-4 w-4 shrink-0 text-ink/40" />
              <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the catalogue..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/40" />

              <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="text-ink/40 hover:text-ink">

                <XIcon className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-burgundy-100 bg-cream lg:hidden">

            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
              <div className="px-3 py-2 sm:hidden"><ShopModeToggle /></div>
              {NAV.map((item) =>
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-ink/80 hover:bg-burgundy-50">

                  {item.label}
                </Link>
            )}
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}
