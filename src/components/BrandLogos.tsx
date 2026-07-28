import React, { useMemo } from "react";
import { useStore } from "../store/StoreContext";

export function BrandLogos() {
  const { products } = useStore();
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  if (brands.length === 0) return null;

  return (
    <section className="border-y border-burgundy-100 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-amber2-600">
          Trusted brands
        </p>
        <h2 className="mt-2 text-center font-serif text-3xl font-semibold text-ink">
          Brands we represent
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) =>
          <div key={brand} className="group flex items-center justify-center px-2">
              <span className="text-center font-serif text-lg font-semibold uppercase tracking-widest text-ink/35 transition-colors duration-300 group-hover:text-burgundy-800">
                {brand}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>);

}
