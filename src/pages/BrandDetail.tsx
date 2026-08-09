import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../store/StoreContext";
import { usePopularity } from "../lib/popularity";
import { slugify } from "../lib/slug";

export function BrandDetail() {
  const { slug } = useParams();
  const { products } = useStore();
  const { bestsellerIds } = usePopularity();

  const brandProducts = useMemo(
    () => products.filter((p) => slugify(p.brand) === slug),
    [products, slug]
  );
  const brand = brandProducts[0]?.brand;
  const categories = useMemo(
    () => [...new Set(brandProducts.map((p) => p.category))],
    [brandProducts]
  );

  if (!brand) {
    return (
      <div className="min-h-screen w-full bg-cream">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="font-serif text-3xl text-ink">Brand not found</h1>
          <Link to="/" className="mt-6 inline-block text-burgundy-800 underline">Back to home</Link>
        </div>
        <Footer />
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Brands", to: "/" }, { label: brand }]} />
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800">
            <ArrowLeftIcon className="h-4 w-4" /> All products
          </Link>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">
            {categories.join(" · ")}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink sm:text-5xl">{brand}</h1>
          <p className="mt-3 max-w-2xl text-ink/60">
            {brandProducts.length} {brandProducts.length === 1 ? "product" : "products"} from {brand}, stocked and ready to order.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brandProducts.map((product) =>
          <ProductCard key={product.id} product={product} isBestseller={bestsellerIds.has(product.id)} />
          )}
        </div>
      </div>
      <Footer />
    </div>);

}
