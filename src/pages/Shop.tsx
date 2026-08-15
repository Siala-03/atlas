import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters, EMPTY_FILTERS, FilterState, applyFilters, isFilterActive } from "../components/ProductFilters";
import { staggerContainer, staggerItem } from "../components/Reveal";
import { useStore } from "../store/StoreContext";
import { usePopularity } from "../lib/popularity";
import { CATEGORY_HERO_IMAGES } from "../lib/categoryImages";
import { SPIRIT_CATEGORIES } from "../lib/categoryTaxonomy";
import { Category, Subtype } from "../types";
import { useSEO } from "../lib/seo";

const CATEGORIES: (Category | "All")[] = [
"All",
"Whisky",
"Gin",
"Cognac",
"Vodka",
"Rum",
"Liqueur",
"Tequila",
"Aperitif",
"Bitters",
"Wine",
"Beer",
"RTD",
"Mixer"];


type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function Shop() {
  const { products } = useStore();
  const { bestsellerIds } = usePopularity();
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") as Category | null ?? "All";
  const activeFamily = params.get("family");
  const activeSubtype = params.get("subtype") as Subtype | null;
  const [query, setQuery] = useState(() => params.get("q") ?? "");

  useSEO({
    title: activeCategory !== "All" ? `${activeCategory} for sale in Rwanda` : "Shop all drinks online",
    description:
    activeCategory !== "All" ?
    `Browse and order ${activeCategory} online from Atlas Supplies Ltd, with wholesale case pricing for businesses and single-bottle pricing for individuals. Delivery across Kigali and Rwanda.` :
    "Browse the full Atlas Supplies catalogue: whisky, wine, beer, vodka, gin, rum and more, with wholesale and retail pricing and delivery across Rwanda.",
    path: activeCategory !== "All" ? `/shop?category=${encodeURIComponent(activeCategory)}` : "/shop"
  });

  useEffect(() => {
    const urlQuery = params.get("q") ?? "";
    setQuery((current) => current === urlQuery ? current : urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q")]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const setCategory = (c: Category | "All") => {
    if (c === "All") {
      params.delete("category");
    } else {
      params.set("category", c);
    }
    params.delete("family");
    params.delete("subtype");
    setParams(params, { replace: true });
  };

  const heroImage = activeCategory !== "All" ? CATEGORY_HERO_IMAGES[activeCategory] : undefined;
  const pageTitle = activeFamily === "Spirits" ?
  "Spirits" :
  activeCategory === "All" ?
  "The Catalogue" :
  activeSubtype ?
  `${activeCategory} · ${activeSubtype}` :
  activeCategory;

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeFamily === "Spirits") return SPIRIT_CATEGORIES.includes(p.category);
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (activeSubtype && p.subtype !== activeSubtype) return false;
      return true;
    });
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      );
    }
    list = applyFilters(list, filters);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.casePrice - b.casePrice);
      case "price-desc":
        return [...list].sort((a, b) => b.casePrice - a.casePrice);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, activeCategory, activeFamily, activeSubtype, query, sort, filters]);

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      <div className={`relative overflow-hidden border-b border-burgundy-100 ${heroImage ? "" : "bg-burgundy-800"}`}>
        {heroImage &&
        <>
            <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-burgundy-950/75" />
          </>
        }
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold text-cream sm:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-2 text-cream/70">
            {filtered.length} products{pageTitle === "The Catalogue" ? " in stock" : ` in ${pageTitle}`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
          <aside className="lg:sticky lg:top-24">
            <div className="hidden rounded-2xl border border-burgundy-100 bg-white p-5 lg:block">
              <p className="mb-4 font-serif text-lg font-semibold text-ink">Filters</p>
              <ProductFilters products={products} filters={filters} onChange={setFilters} />
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink/70 hover:bg-burgundy-50 lg:hidden">

              <SlidersHorizontalIcon className="h-4 w-4" />
              Filters {isFilterActive(filters) && <span className="rounded-full bg-amber2-500 px-2 py-0.5 text-[11px] font-bold text-white">On</span>}
            </button>
            {showFilters &&
            <div className="mb-6 rounded-2xl border border-burgundy-100 bg-white p-5 lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-serif text-lg font-semibold text-ink">Filters</p>
                  <button onClick={() => setShowFilters(false)} aria-label="Close filters" className="text-ink/50 hover:text-ink">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                <ProductFilters products={products} filters={filters} onChange={setFilters} />
              </div>
            }
          </aside>

          <div>
            {/* Controls */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) =>
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === c ?
                  "bg-burgundy-800 text-cream" :
                  "border border-burgundy-200 bg-white text-ink/70 hover:bg-burgundy-50"}`
                  }>

                    {c}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 lg:w-64">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search brand, name..."
                    className="w-full rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

                </div>
                <div className="relative">
                  <SlidersHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-burgundy-500">

                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ?
            <div className="mt-16 rounded-2xl border border-dashed border-burgundy-200 bg-white py-20 text-center">
                <p className="font-serif text-2xl text-ink">No products found</p>
                <p className="mt-2 text-ink/60">Try a different category, search term or filter.</p>
              </div> :

            // key forces a remount (and fresh viewport trigger) whenever the
            // filtered list changes — `products` loads async and can
            // reorder/replace items after first mount; without this, cards
            // swapped in post-fetch would keep their hidden initial state
            // forever since a once:true trigger only fires once per mount.
            <motion.div
              key={filtered.map((p) => p.id).join(",")}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {filtered.map((p) =>
              <motion.div key={p.id} variants={staggerItem}>
                    <ProductCard product={p} isBestseller={bestsellerIds.has(p.id)} />
                  </motion.div>
              )}
              </motion.div>
            }
          </div>
        </div>
      </div>

      <Footer />
    </div>);

}
