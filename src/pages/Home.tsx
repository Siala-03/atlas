import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductStrip } from "../components/ProductStrip";
import { BrandPortfolio } from "../components/BrandPortfolio";
import { ShopModeToggle } from "../components/ShopModeToggle";
import { HeroCarousel } from "../components/HeroCarousel";
import { RotatingTagline } from "../components/RotatingTagline";
import { FloatingBottles } from "../components/FloatingBottles";
import { Reveal, staggerContainer, staggerItem } from "../components/Reveal";
import { useStore } from "../store/StoreContext";
import { usePopularity } from "../lib/popularity";
import { CATEGORY_IMAGES } from "../lib/categoryImages";
import { Category } from "../types";

const CATEGORIES: {name: Category;blurb: string;}[] = [
{ name: "Whisky", blurb: "Single malts, blends & bourbon" },
{ name: "Wine", blurb: "Reds, whites & sparkling" },
{ name: "Vodka", blurb: "Premium & craft distillations" },
{ name: "Beer", blurb: "Craft lager, IPA & more" },
{ name: "Gin", blurb: "London Dry & botanical" },
{ name: "Rum", blurb: "Spiced, dark & golden" }];


const TAGLINES = [
"Genuine imports, traceable supply",
"Next-day delivery across the region",
"Pay by card or MTN MoMo",
"Live stock, no surprises at checkout"];


const HERO_CHIPS: Category[] = ["Whisky", "Wine", "Beer", "Gin", "Vodka", "Rum"];

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
  const carouselProducts = topProducts.length > 0 ? topProducts : products.slice(0, 8);
  const floatingImages = HERO_CHIPS.
  map((c) => products.find((p) => p.category === c)?.image).
  filter((src): src is string => Boolean(src));

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-burgundy-950 via-burgundy-900 to-burgundy-800">
        <FloatingBottles images={floatingImages} />
        {/* Ambient floating background shapes */}
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber2-500/20 blur-3xl" />

        <motion.div
          aria-hidden="true"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-burgundy-500/20 blur-3xl" />

        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-amber2-300/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[220px] flex-col justify-center lg:min-h-[720px]">

            <h1 className="font-serif text-4xl font-semibold leading-tight text-cream sm:text-5xl">
              Premium drinks, delivered to your door.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-cream/80">
              Buy by the piece or by the case — genuine stock, straightforward pricing.
            </p>
            <RotatingTagline items={TAGLINES} className="mt-3 max-w-lg text-sm font-medium text-amber2-300" />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ShopModeToggle />
              <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}>
                <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-amber2-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-amber2-600">

                  Shop now
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {HERO_CHIPS.map((c, i) =>
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}>

                  <Link
                  to={`/shop?category=${c}`}
                  className="group flex flex-col items-center gap-2">

                    <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-cream/15 bg-cream/5 p-2 transition-colors group-hover:border-amber2-400/60 sm:h-24 sm:w-24">
                      <img
                      src={CATEGORY_IMAGES[c]}
                      alt=""
                      className="h-full w-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />

                    </span>
                    <span className="text-xs font-medium text-cream/70 group-hover:text-cream">{c}</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="h-[480px] py-8 sm:h-[620px] lg:h-[720px] lg:py-12">
            <HeroCarousel products={carouselProducts} />
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="border-b border-burgundy-100 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">

          {PERKS.map((p) =>
          <motion.div key={p.title} variants={staggerItem} className="flex items-center gap-3">
              <p.icon className="h-5 w-5 shrink-0 text-burgundy-700" />
              <div>
                <p className="text-sm font-semibold text-ink">{p.title}</p>
                <p className="text-xs text-ink/55">{p.text}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Category quick-nav — auto-scrolling marquee, pauses on hover */}
      <Reveal className="overflow-hidden py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Our range</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">Shop by category</h2>
        </div>
        <div className="group/marquee relative mt-6">
          <div className="animate-marquee flex w-max gap-4 px-4 sm:px-6 lg:px-8">
            {[...CATEGORIES, ...CATEGORIES].map((c, i) =>
            <Link
              key={`${c.name}-${i}`}
              to={`/shop?category=${c.name}`}
              className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-burgundy-100 bg-white transition-all hover:border-burgundy-300 hover:shadow-md sm:w-48">

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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-cream to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-cream to-transparent sm:w-20" />
        </div>
      </Reveal>

      <Reveal>
        <ProductStrip title={featuredHeading} products={topProducts} viewAllHref="/shop" />
      </Reveal>

      {wineProducts.length > 0 &&
      <Reveal>
          <ProductStrip title="Wine selection" products={wineProducts} viewAllHref="/shop?category=Wine" />
        </Reveal>
      }

      {beerProducts.length > 0 &&
      <Reveal>
          <ProductStrip title="Beer & crates" products={beerProducts} viewAllHref="/shop?category=Beer" />
        </Reveal>
      }

      <Reveal><BrandPortfolio /></Reveal>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="overflow-hidden rounded-3xl bg-burgundy-800 px-8 py-14 text-center sm:px-16">
          <h2 className="font-serif text-4xl font-semibold text-cream">
            Order today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            {shoppingMode === "business" ?
            "Buy by the case with straightforward pricing, no minimums." :
            "Buy exactly what you need, by the piece."}
          </p>
          <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
            <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber2-500 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-amber2-600">

              Start ordering <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </Reveal>
      </section>

      <Footer />
    </div>);

}
