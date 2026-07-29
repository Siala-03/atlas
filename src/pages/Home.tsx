import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductStrip } from "../components/ProductStrip";
import { BrandPortfolio } from "../components/BrandPortfolio";
import { WhyAtlas } from "../components/WhyAtlas";
import { HowItWorks } from "../components/HowItWorks";
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
{ title: "Next-day delivery", text: "Order by 4pm across the region." },
{ title: "Case pricing", text: "True wholesale rates, no minimums." },
{ title: "Trade accounts", text: "Verified licensed buyers only." },
{ title: "Live stock", text: "Real-time availability at checkout." }];


export function Home() {
  const { bestsellerIds, topProducts } = usePopularity(4);
  const featuredHeading = bestsellerIds.size > 0 ? "Popular with trade buyers" : "Featured selection";

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-burgundy-950/80" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <h1 className="font-serif text-5xl font-semibold leading-tight text-cream sm:text-6xl">
              Stocking your shelves, one sip at a time.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream/80">
              Atlas Supplies Ltd delivers premium spirits, wine and beer to bars,
              restaurants and retailers — at genuine wholesale case pricing with
              next-day delivery.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-amber2-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-amber2-600">

                Browse the catalogue
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-burgundy-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-8 divide-burgundy-100 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-8">
          {PERKS.map((p, index) =>
          <div key={p.title} className={index > 0 ? "lg:pl-8" : ""}>
              <p className="font-serif text-lg font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-sm text-ink/60">{p.text}</p>
            </div>
          )}
        </div>
      </section>

      <WhyAtlas />

      <HowItWorks />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">
              Our range
            </p>
            <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">
              Shop by category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 text-sm font-semibold text-burgundy-800 hover:text-burgundy-900 sm:inline-flex">

            View all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) =>
          <Link
            key={c.name}
            to={`/shop?category=${c.name}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-burgundy-100 bg-white transition-all hover:border-burgundy-300 hover:shadow-md">

              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                <img
                src={CATEGORY_IMAGES[c.name]}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/70 via-burgundy-950/10 to-transparent" />
                <p className="absolute bottom-3 left-4 font-serif text-xl font-semibold text-cream">{c.name}</p>
              </div>
              <p className="px-4 py-3 text-xs text-ink/55">{c.blurb}</p>
            </Link>
          )}
        </div>
      </section>

      <BrandPortfolio />

      <ProductStrip title={featuredHeading} products={topProducts} viewAllHref="/shop" />

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-burgundy-800 px-8 py-14 text-center sm:px-16">
          <h2 className="font-serif text-4xl font-semibold text-cream">
            Open a trade account today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Get access to full wholesale pricing, dedicated account support and
            flexible delivery scheduling.
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
