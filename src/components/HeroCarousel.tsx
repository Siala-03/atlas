import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Product, unitPrice } from "../types";
import { formatCurrency } from "../lib/format";
import { useStore } from "../store/StoreContext";

const AUTO_ADVANCE_MS = 4500;

export function HeroCarousel({ products }: {products: Product[];}) {
  const { shoppingMode } = useStore();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (products.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [products.length, paused]);

  if (products.length === 0) return null;

  const product = products[index % products.length];
  const isBusiness = shoppingMode === "business";
  const price = isBusiness ? product.casePrice : unitPrice(product);

  const go = (delta: number) => setIndex((i) => (i + delta + products.length) % products.length);

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

          <Link to={`/product/${product.id}`} className="flex h-40 items-center justify-center sm:h-56">
            <img src={product.image} alt={product.name} className="h-full w-auto object-contain drop-shadow-2xl" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber2-300">{product.brand}</p>
            <Link to={`/product/${product.id}`} className="mt-1 block font-serif text-2xl font-semibold text-cream hover:text-amber2-200 sm:text-3xl">
              {product.name}
            </Link>
            <p className="mt-2 font-serif text-xl font-semibold text-amber2-300">
              {formatCurrency(price)}
              <span className="ml-1 text-sm font-normal text-cream/60">{isBusiness ? "/case" : "/piece"}</span>
            </p>
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
