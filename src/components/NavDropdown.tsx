import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { NavLinkSpec } from "../lib/categoryTaxonomy";

export function NavDropdown({ label, to, items }: {label: string;to: string;items: NavLinkSpec[];}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>

      <Link
        to={to}
        className="flex items-center gap-1 text-sm font-medium tracking-wide text-ink/70 transition-colors hover:text-burgundy-700">

        {label}
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3">

            <div className="overflow-hidden rounded-xl border border-burgundy-100 bg-white py-2 shadow-lg">
              {items.map((item) =>
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-ink/70 transition-colors hover:bg-burgundy-50 hover:text-burgundy-800">

                  {item.label}
                </Link>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
