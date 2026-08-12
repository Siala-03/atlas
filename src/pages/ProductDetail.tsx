import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon,
  ShoppingCartIcon } from
"lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductTabs } from "../components/ProductTabs";
import { TrustBadges } from "../components/TrustBadges";
import { BestsellerBadge } from "../components/BestsellerBadge";
import { ProductStrip } from "../components/ProductStrip";
import { useStore } from "../store/StoreContext";
import { useToast } from "../store/ToastContext";
import { usePopularity } from "../lib/popularity";
import { formatCurrency } from "../lib/format";
import { unitPrice } from "../types";
import { isCaseOnly } from "../lib/productRules";
import { ShopModeToggle } from "../components/ShopModeToggle";

export function ProductDetail() {
  const { id } = useParams();
  const { getProduct, addToCart, products, shoppingMode, openCart } = useStore();
  const { showToast } = useToast();
  const { bestsellerIds } = usePopularity();
  const navigate = useNavigate();
  const product = id ? getProduct(id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const caseOnly = product ? isCaseOnly(product.category) : false;
  const isBusiness = caseOnly || shoppingMode === "business";

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.
    filter((p) => p.category === product.category && p.id !== product.id).
    slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="min-h-screen w-full bg-cream">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="font-serif text-3xl text-ink">Product not found</h1>
          <Link to="/shop" className="mt-6 inline-block text-burgundy-800 underline">
            Back to catalogue
          </Link>
        </div>
        <Footer />
      </div>);

  }

  const out = product.stockUnits === 0;
  const availableCases = Math.floor(product.stockUnits / product.unitsPerCase);
  const maxQuantity = isBusiness ? Math.max(availableCases, 1) : Math.max(product.stockUnits, 1);
  const price = isBusiness ? product.casePrice : unitPrice(product);
  const lineTotal = price * quantity;

  const handleAdd = () => {
    addToCart(product.id, isBusiness ? "business" : "individual", quantity);
    setAdded(true);
    showToast(`Added ${product.name} to cart`);
    openCart();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            items={[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/shop" },
            { label: product.category, to: `/shop?category=${product.category}` },
            { label: product.name }]} />


          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800">

            <ArrowLeftIcon className="h-4 w-4" /> Back
          </button>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="flex items-center justify-center overflow-hidden rounded-3xl border border-burgundy-100 bg-white p-12">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[520px] w-auto object-contain" />

          </div>

          <div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">
                {product.brand} · {product.origin}
              </p>
              {bestsellerIds.has(product.id) && <BestsellerBadge />}
            </div>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-ink sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
              product.category,
              `${product.abv}% ABV`,
              product.volume,
              `${product.unitsPerCase} per case`].
              map((chip) =>
              <span
                key={chip}
                className="rounded-full bg-burgundy-50 px-3 py-1 text-xs font-medium text-burgundy-800">

                  {chip}
                </span>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-burgundy-100 bg-white p-6">
              {caseOnly ?
              <p className="mb-5 inline-flex items-center rounded-full border border-burgundy-200 bg-burgundy-50 px-3.5 py-1.5 text-xs font-semibold text-burgundy-800">
                  Sold by the case only
                </p> :

              <ShopModeToggle className="mb-5" />
              }
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-serif text-4xl font-semibold text-burgundy-800">
                    {formatCurrency(price)}
                  </p>
                  <p className="text-sm text-ink/50">
                    {isBusiness ?
                    `per case of ${product.unitsPerCase} · ${formatCurrency(unitPrice(product))}/piece` :
                    `per piece · ${formatCurrency(product.casePrice)}/case of ${product.unitsPerCase}`}
                  </p>
                </div>
                <div className="text-right">
                  {out ?
                  <span className="font-semibold text-gray-500">Out of stock</span> :


                  <span className="text-sm font-medium text-emerald-700">
                      {isBusiness ? `${availableCases} cases available` : `${product.stockUnits} pieces available`}
                    </span>
                  }
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-full border border-burgundy-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-burgundy-800 hover:bg-burgundy-50 rounded-l-full"
                    aria-label="Decrease">

                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-ink">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="flex h-11 w-11 items-center justify-center text-burgundy-800 hover:bg-burgundy-50 rounded-r-full"
                    aria-label="Increase">

                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-ink/50">
                  {isBusiness ? `= ${quantity * product.unitsPerCase} pieces` : `${quantity} piece${quantity > 1 ? "s" : ""}`}
                </span>
              </div>

              <button
                onClick={handleAdd}
                disabled={out}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-4 text-base font-semibold text-cream transition-colors hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:bg-gray-300">

                {added ?
                <>
                    <CheckIcon className="h-5 w-5" /> Added to order
                  </> :


                <>
                    <ShoppingCartIcon className="h-5 w-5" /> Add {quantity} {isBusiness ? "case" : "piece"}
                    {quantity > 1 ? "s" : ""} · {formatCurrency(lineTotal)}
                  </>
                }
              </button>

              <TrustBadges />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-burgundy-100 bg-white px-6">
          <ProductTabs product={product} />
        </div>
      </div>

      <ProductStrip title="More from this category" products={relatedProducts} />

      <Footer />
    </div>);

}
