import React from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-burgundy-900/40 bg-burgundy-950 text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="inline-block rounded-xl bg-cream p-3">
            <Logo className="h-14" />
          </div>
          <p className="mt-4 max-w-xs font-serif text-lg italic text-cream/70">
            Stocking your shelves, one sip at a time.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-amber2-300">
            Shop
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop?category=Whisky" className="hover:text-cream">Whisky</Link></li>
            <li><Link to="/shop?category=Vodka" className="hover:text-cream">Vodka & Gin</Link></li>
            <li><Link to="/shop?category=Wine" className="hover:text-cream">Wine</Link></li>
            <li><Link to="/shop?category=Beer" className="hover:text-cream">Beer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-amber2-300">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-cream">About Atlas</Link></li>
            <li><Link to="/faq" className="hover:text-cream">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-cream">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-amber2-300">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 text-amber2-400" />
              KG 12 St, Kigali, Rwanda
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-amber2-400" />
              +250 788 123 456
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-amber2-400" />
              orders@atlassupplies.rw
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-cream/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Atlas Supplies Ltd. 18+.</p>
          <p>Please drink responsibly.</p>
        </div>
      </div>
    </footer>);

}