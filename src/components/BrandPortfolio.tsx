import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { Category } from "../types";

const CATEGORIES: (Category | "All")[] = [
"All",
"Whisky",
"Wine",
"Vodka",
"Gin",
"Rum",
"Beer"];


export function BrandPortfolio() {
  const { products } = useStore();
  const [active, setActive] = useState<Category | "All">("All");

  const filtered = useMemo(
    () => active === "All" ? products : products.filter((p) => p.category === active),
    [products, active]
  );

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Our portfolio</p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">Partners we work with</h2>
        <p className="mt-3 text-ink/60">
          A trusted selection of spirits, wine and beer brands — stocked, genuine and ready for wholesale ordering.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) =>
        <button
          key={c}
          onClick={() => setActive(c)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          active === c ?
          "bg-burgundy-800 text-cream" :
          "border border-burgundy-200 bg-white text-ink/70 hover:bg-burgundy-50"}`
          }>

            {c}
          </button>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {filtered.map((product) =>
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-burgundy-100 bg-white transition-all hover:border-burgundy-300 hover:shadow-md">

            <div className="flex aspect-square items-center justify-center bg-cream p-4">
              <img
              src={product.image}
              alt={product.name}
              className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" />

            </div>
            <div className="p-3 text-center">
              <p className="font-serif text-base font-semibold text-ink group-hover:text-burgundy-800">
                {product.brand}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink/50">{product.name}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-amber2-600">
                {product.category}
              </p>
            </div>
          </Link>
        )}
      </div>

      {filtered.length === 0 &&
      <p className="mt-10 text-center text-sm text-ink/50">No brands in this category yet.</p>
      }
    </section>);

}
