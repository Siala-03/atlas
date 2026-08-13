import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { Product, unitPrice } from "../types";
import { formatCurrency } from "../lib/format";
import { useStore } from "../store/StoreContext";
import { useToast } from "../store/ToastContext";
import { hasCaseOption } from "../lib/productRules";
import { BestsellerBadge } from "./BestsellerBadge";

export function ProductCard({ product, isBestseller = false }: {product: Product;isBestseller?: boolean;}) {
  const { addToCart, openCart, shoppingMode } = useStore();
  const { showToast } = useToast();
  const out = product.stockUnits === 0;
  const low = !out && product.stockUnits <= product.lowStockThreshold;

  const caseOption = hasCaseOption(product.category);
  const isBusiness = caseOption && shoppingMode === "business";
  const price = isBusiness ? product.casePrice : unitPrice(product);
  const availableToAdd = isBusiness ?
  Math.floor(product.stockUnits / product.unitsPerCase) === 0 :
  false;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-burgundy-100 bg-white shadow-sm">

      <Link
        to={`/product/${product.id}`}
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-cream p-6">

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" />

        <span className="absolute left-3 top-3 rounded-full bg-burgundy-800 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cream">
          {product.category}
        </span>
        {out ?
        <span className="absolute right-3 top-3 rounded-full bg-gray-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Out of stock
          </span> :
        low ?
        <span className="absolute right-3 top-3 rounded-full bg-amber2-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Low stock
          </span> :
        null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-amber2-600">
            {product.brand}
          </p>
          {isBestseller && <BestsellerBadge />}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-ink hover:text-burgundy-800">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-ink/50">
          {product.volume} · {product.abv}%{caseOption ? ` · ${product.unitsPerCase}/case` : ""}
        </p>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="font-serif text-2xl font-semibold text-burgundy-800">
              {formatCurrency(price)}
            </p>
            <p className="text-xs text-ink/50">{caseOption ? isBusiness ? "per case" : "per piece" : "per bottle"}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              addToCart(product.id, isBusiness ? "business" : "individual", 1);
              showToast(`Added ${product.name} to cart`);
              openCart();
            }}
            disabled={out || availableToAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-burgundy-800 px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500">

            <PlusIcon className="h-4 w-4" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>);

}
