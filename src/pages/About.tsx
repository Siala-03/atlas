import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VODKA, REDWINE, BEER } from "../lib/categoryImages";

const HERO = "/c76d1c17-8922-4717-b20e-ae6d0135e87f.jpg";

const VALUES = [
{ title: "Genuine imports", text: "Every case is sourced through verified, traceable supply routes — no grey-market stock." },
{ title: "Trade-verified pricing", text: "Case pricing built for licensed bars, restaurants and retailers, not adjusted after the fact." },
{ title: "Rwanda-based", text: "Built in Kigali, around the realities of local trade — stock, delivery windows, terms that fit." },
{ title: "Reliable delivery", text: "Orders are confirmed against real stock before dispatch, so what's promised is what arrives." }];


const STEPS = [
{ title: "You order", text: "Browse trade case pricing and check out — by invoice or by card." },
{ title: "We verify", text: "Licence and stock confirmed before anything leaves the warehouse." },
{ title: "You receive", text: "Delivery scheduled and confirmed, not left to guesswork." }];


export function About() {
  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/60 to-burgundy-950/20" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-300">About Atlas</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Stocking shelves across Rwanda, one trusted case at a time.
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Story */}
        <section className="grid gap-10 lg:grid-cols-5">
          <blockquote className="lg:col-span-2">
            <p className="font-serif text-3xl italic leading-snug text-burgundy-800">
              "Licensed venues deserve one accountable supplier — not a patchwork
              of informal sourcing."
            </p>
          </blockquote>
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Our story</p>
            <p className="mt-3 leading-relaxed text-ink/70">
              Licensed venues across Rwanda have long had to choose between slow,
              informal supply chains and pricing that doesn't reflect real wholesale
              volume. Atlas Supplies Ltd was built to close that gap — a single,
              accountable distributor of spirits, wine and beer, offering
              transparent case pricing, verified stock levels, and a straightforward
              path from order to delivery, whether you're settling by trade invoice
              or paying by card.
            </p>
          </div>
        </section>

        {/* Bento: photography + differentiators */}
        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold text-ink">What sets us apart</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="overflow-hidden rounded-2xl sm:col-span-1 sm:row-span-2">
              <img src={REDWINE} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl border border-burgundy-100 bg-white p-6 sm:col-span-1">
              <p className="font-serif text-3xl font-semibold text-burgundy-200">01</p>
              <p className="mt-2 font-semibold text-ink">{VALUES[0].title}</p>
              <p className="mt-1 text-sm text-ink/60">{VALUES[0].text}</p>
            </div>
            <div className="rounded-2xl border border-burgundy-100 bg-white p-6 sm:col-span-2">
              <p className="font-serif text-3xl font-semibold text-burgundy-200">02</p>
              <p className="mt-2 font-semibold text-ink">{VALUES[1].title}</p>
              <p className="mt-1 text-sm text-ink/60">{VALUES[1].text}</p>
            </div>
            <div className="rounded-2xl border border-burgundy-100 bg-white p-6 sm:col-span-2">
              <p className="font-serif text-3xl font-semibold text-burgundy-200">03</p>
              <p className="mt-2 font-semibold text-ink">{VALUES[2].title}</p>
              <p className="mt-1 text-sm text-ink/60">{VALUES[2].text}</p>
            </div>
            <div className="rounded-2xl border border-burgundy-100 bg-white p-6 sm:col-span-1">
              <p className="font-serif text-3xl font-semibold text-burgundy-200">04</p>
              <p className="mt-2 font-semibold text-ink">{VALUES[3].title}</p>
              <p className="mt-1 text-sm text-ink/60">{VALUES[3].text}</p>
            </div>
            <div className="overflow-hidden rounded-2xl sm:col-span-1">
              <img src={BEER} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold text-ink">How we work</h2>
          <div className="relative mt-10 grid gap-10 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-burgundy-100 sm:block" aria-hidden="true" />
            {STEPS.map((step, index) =>
            <div key={step.title} className="relative">
                <p className="font-serif text-2xl font-semibold text-burgundy-800">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-sm text-ink/60">{step.text}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-20 overflow-hidden rounded-3xl bg-burgundy-800">
          <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
            <div className="px-8 py-14 sm:px-12">
              <h2 className="font-serif text-3xl font-semibold text-cream">Ready to open a trade account?</h2>
              <p className="mt-3 max-w-md text-cream/80">
                Browse the catalogue and check out — your first order doubles as your account application.
              </p>
              <Link
                to="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber2-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-amber2-600">

                Browse the catalogue <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden h-full sm:block">
              <img src={VODKA} alt="" className="h-full max-h-72 w-full object-cover" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>);

}
