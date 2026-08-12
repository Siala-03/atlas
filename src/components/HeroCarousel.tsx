import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "../types";

const AUTO_ADVANCE_MS = 4500;

export function HeroCarousel({ products }: {products: Product[];}) {
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

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      <AnimatePresence mode="sync">
        {products.map((product, i) =>
        i === index % products.length &&
        <motion.img
          key={product.id}
          src={product.image}
          alt={product.name}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-contain object-center p-8 drop-shadow-2xl sm:p-16" />

        )}
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {products.map((p, i) =>
        <button
          key={p.id}
          onClick={() => setIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-1.5 rounded-full transition-all ${
          i === index % products.length ?
          "w-6 bg-amber2-400" :
          "w-1.5 bg-cream/40 hover:bg-cream/60"}`
          } />

        )}
      </div>
    </div>);

}
