import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { Product, unitPrice } from "../types";
import { formatCurrency } from "../lib/format";
import { hasCaseOption } from "../lib/productRules";
import { useStore } from "../store/StoreContext";
import { useToast } from "../store/ToastContext";
import { usePopularity } from "../lib/popularity";
import { BestsellerBadge } from "./BestsellerBadge";

const AUTO_ADVANCE_MS = 4500;

export function HeroCarousel({ products }: {products: Product[];}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { addToCart, openCart, shoppingMode } = useStore();
  const { showToast } = useToast();
  const { bestsellerIds } = usePopularity();

  useEffect(() => {
    if (products.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [products.length, paused]);

  if (products.length === 0) return null;

  const product = products[index % products.length];
  const caseOption = hasCaseOption(product.category);
  const isBusiness = caseOption && shoppingMode === "business";
  const price = isBusiness ? product.casePrice : unitPrice(product);
  const out = product.stockUnits === 0;
  const low = !out && product.stockUnits <= product.lowStockThreshold;

  const go = (delta: number) => setIndex((i) => (i + delta + products.length) % products.length);

  const handleAdd = () => {
    addToCart(product.id, isBusiness ? "business" : "individual", 1);
    showToast(`Added ${product.name} to cart`);
    openCart();
  };

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl bg-burgundy-900/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4 }}
          className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center sm:p-10">

          <Link to={`/product/${product.id}`} className="relative flex h-64 items-center justify-center sm:h-[26rem]">
            {bestsellerIds.has(product.id) &&
            <span className="absolute -top-1 left-0"><BestsellerBadge /></span>
            }
            {out ?
            <span className="absolute -top-1 right-0 rounded-full bg-gray-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">Out of stock</span> :
            low &&
            <span className="absolute -top-1 right-0 rounded-full bg-amber2-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">Low stock</span>
            }
            <img src={product.image} alt={product.name} className="h-full w-auto object-contain drop-shadow-2xl" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber2-300">{product.brand}</p>
            <Link to={`/product/${product.id}`} className="mt-1 block font-serif text-2xl font-semibold text-cream hover:text-amber2-200 sm:text-3xl">
              {product.name}
            </Link>
            <div className="mt-3 flex items-center justify-center gap-4">
              <p className="font-serif text-xl font-semibold text-amber2-300">
                {formatCurrency(price)}
                <span className="ml-1 text-sm font-normal text-cream/60">{caseOption ? isBusiness ? "/case" : "/piece" : "/bottle"}</span>
              </p>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleAdd}
                disabled={out}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber2-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber2-600 disabled:cursor-not-allowed disabled:bg-gray-500">

                <PlusIcon className="h-4 w-4" /> Add
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => go(-1)}
        aria-label="Previous product"
        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition-colors hover:bg-cream/20">

        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next product"
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition-colors hover:bg-cream/20">

        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center justify-center gap-1.5 pb-4">
        {products.map((p, i) =>
        <button
          key={p.id}
          onClick={() => setIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-1.5 rounded-full transition-all ${
          i === index % products.length ?
          "w-6 bg-amber2-400" :
          "w-1.5 bg-cream/30 hover:bg-cream/50"}`
          } />

        )}
      </div>
    </div>);

}
