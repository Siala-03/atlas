import React, { useMemo } from "react";
import { Product } from "../types";

export interface FilterState {
  priceMin: number | null;
  priceMax: number | null;
  abvMin: number | null;
  abvMax: number | null;
  brands: Set<string>;
  origins: Set<string>;
}

export const EMPTY_FILTERS: FilterState = {
  priceMin: null,
  priceMax: null,
  abvMin: null,
  abvMax: null,
  brands: new Set(),
  origins: new Set()
};

export function isFilterActive(filters: FilterState): boolean {
  return (
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.abvMin !== null ||
    filters.abvMax !== null ||
    filters.brands.size > 0 ||
    filters.origins.size > 0);

}

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    if (filters.priceMin !== null && product.casePrice < filters.priceMin) return false;
    if (filters.priceMax !== null && product.casePrice > filters.priceMax) return false;
    if (filters.abvMin !== null && product.abv < filters.abvMin) return false;
    if (filters.abvMax !== null && product.abv > filters.abvMax) return false;
    if (filters.brands.size > 0 && !filters.brands.has(product.brand)) return false;
    if (filters.origins.size > 0 && !filters.origins.has(product.origin)) return false;
    return true;
  });
}

interface ProductFiltersProps {
  products: Product[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ProductFilters({ products, filters, onChange }: ProductFiltersProps) {
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );
  const origins = useMemo(
    () => [...new Set(products.map((p) => p.origin))].sort(),
    [products]
  );

  const toggleBrand = (brand: string) => {
    const next = new Set(filters.brands);
    if (next.has(brand)) next.delete(brand);else next.add(brand);
    onChange({ ...filters, brands: next });
  };

  const toggleOrigin = (origin: string) => {
    const next = new Set(filters.origins);
    if (next.has(origin)) next.delete(origin);else next.add(origin);
    onChange({ ...filters, origins: next });
  };

  const numberField = (
  label: string,
  value: number | null,
  onSet: (value: number | null) => void,
  placeholder: string) =>

  <input
    type="number"
    min={0}
    value={value ?? ""}
    onChange={(e) => onSet(e.target.value === "" ? null : Number(e.target.value))}
    placeholder={placeholder}
    aria-label={label}
    className="w-full rounded-lg border border-burgundy-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />;


  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Case price (RWF)</p>
        <div className="mt-2 flex items-center gap-2">
          {numberField("Minimum price", filters.priceMin, (v) => onChange({ ...filters, priceMin: v }), "Min")}
          <span className="text-ink/40">–</span>
          {numberField("Maximum price", filters.priceMax, (v) => onChange({ ...filters, priceMax: v }), "Max")}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">ABV %</p>
        <div className="mt-2 flex items-center gap-2">
          {numberField("Minimum ABV", filters.abvMin, (v) => onChange({ ...filters, abvMin: v }), "Min")}
          <span className="text-ink/40">–</span>
          {numberField("Maximum ABV", filters.abvMax, (v) => onChange({ ...filters, abvMax: v }), "Max")}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Brand</p>
        <div className="mt-2 space-y-1.5">
          {brands.map((brand) =>
          <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
              type="checkbox"
              checked={filters.brands.has(brand)}
              onChange={() => toggleBrand(brand)}
              className="h-4 w-4 rounded border-burgundy-300 text-burgundy-800 focus:ring-burgundy-500" />

              {brand}
            </label>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Country of origin</p>
        <div className="mt-2 space-y-1.5">
          {origins.map((origin) =>
          <label key={origin} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
              type="checkbox"
              checked={filters.origins.has(origin)}
              onChange={() => toggleOrigin(origin)}
              className="h-4 w-4 rounded border-burgundy-300 text-burgundy-800 focus:ring-burgundy-500" />

              {origin}
            </label>
          )}
        </div>
      </div>

      {isFilterActive(filters) &&
      <button
        type="button"
        onClick={() => onChange(EMPTY_FILTERS)}
        className="text-sm font-semibold text-burgundy-800 underline hover:text-burgundy-900">

          Clear filters
        </button>
      }
    </div>);

}
