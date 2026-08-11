import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductStrip } from "../components/ProductStrip";
import { BrandPortfolio } from "../components/BrandPortfolio";
import { WhyAtlas } from "../components/WhyAtlas";
import { ShopModeToggle } from "../components/ShopModeToggle";
import { useStore } from "../store/StoreContext";
import { usePopularity } from "../lib/popularity";
import { CATEGORY_IMAGES } from "../lib/categoryImages";
import { Category } from "../types";

const HERO = "/c76d1c17-8922-4717-b20e-ae6d0135e87f.jpg";

const CATEGORIES: {name: Category;blurb: string;}[] = [
{ name: "Whisky", blurb: "Single malts, blends & bourbon" },
{ name: "Wine", blurb: "Reds, whites & sparkling" },
{ name: "Vodka", blurb: "Premium & craft distillations" },
{ name: "Beer", blurb: "Craft lager, IPA & more" },
{ name: "Gin", blurb: "London Dry & botanical" },
{ name: "Rum", blurb: "Spiced, dark & golden" }];


const PERKS = [
{ icon: TruckIcon, title: "Next-day delivery", text: "Order by 4pm across the region." },
{ icon: CreditCardIcon, title: "Secure payment", text: "Pay by card or MTN MoMo." },
{ icon: ShieldCheckIcon, title: "Genuine stock", text: "Traceable supply, live availability." }];


export function Home() {
  const { products, shoppingMode } = useStore();
  const { bestsellerIds, topProducts } = usePopularity(8);
  const featuredHeading = bestsellerIds.size > 0 ? "Popular right now" : "Featured selection";

  const wineProducts = products.filter((p) => p.category === "Wine").slice(0, 4);
  const beerProducts = products.filter((p) => p.category === "Beer").slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      {/* Compact hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-burgundy-950/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <h1 className="font-serif text-3xl font-semibold leading-tight text-cream sm:text-4xl">
                Premium drinks, delivered to your door.
              </h1>
              <p className="mt-3 max-w-lg text-cream/80">
                Buy by the piece or by the case — genuine stock, straightforward pricing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ShopModeToggle />
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-amber2-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-amber2-600">

                Shop now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="border-b border-burgundy-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {PERKS.map((p) =>
          <div key={p.title} className="flex items-center gap-3">
              <p.icon className="h-5 w-5 shrink-0 text-burgundy-700" />
              <div>
                <p className="text-sm font-semibold text-ink">{p.title}</p>
                <p className="text-xs text-ink/55">{p.text}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category quick-nav */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CATEGORIES.map((c) =>
          <Link
            key={c.name}
            to={`/shop?category=${c.name}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-burgundy-100 bg-white transition-all hover:border-burgundy-300 hover:shadow-md">

              <div className="relative aspect-square overflow-hidden bg-cream">
                <img
                src={CATEGORY_IMAGES[c.name]}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/70 via-burgundy-950/5 to-transparent" />
                <p className="absolute bottom-2 left-3 font-serif text-sm font-semibold text-cream sm:text-base">{c.name}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <ProductStrip title={featuredHeading} products={topProducts} viewAllHref="/shop" />

      {wineProducts.length > 0 &&
      <ProductStrip title="Wine selection" products={wineProducts} viewAllHref="/shop?category=Wine" />
      }

      {beerProducts.length > 0 &&
      <ProductStrip title="Beer & crates" products={beerProducts} viewAllHref="/shop?category=Beer" />
      }

      <BrandPortfolio />

      <WhyAtlas />

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-burgundy-800 px-8 py-14 text-center sm:px-16">
          <h2 className="font-serif text-4xl font-semibold text-cream">
            Order today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            {shoppingMode === "business" ?
            "Buy by the case with straightforward pricing, no minimums." :
            "Buy exactly what you need, by the piece."}
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber2-500 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-amber2-600">

            Start ordering <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>);

}
