import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShieldCheckIcon, MapPinIcon, ScaleIcon, TruckIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const VALUES = [
{
  icon: ShieldCheckIcon,
  title: "Genuine imports",
  text: "Every case we sell is sourced through verified, traceable supply routes — no grey-market stock."
},
{
  icon: ScaleIcon,
  title: "Trade-verified pricing",
  text: "Case pricing is built for licensed bars, restaurants and retailers — not adjusted after the fact."
},
{
  icon: MapPinIcon,
  title: "Rwanda-based",
  text: "Based in Kigali and built around the realities of the local trade — stock, delivery windows, and payment terms that fit."
},
{
  icon: TruckIcon,
  title: "Reliable delivery",
  text: "Orders are confirmed against real stock before dispatch, so what's promised is what arrives."
}];


export function About() {
  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      <div className="border-b border-burgundy-100 bg-burgundy-800">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-300">About Atlas</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cream sm:text-5xl">
            Stocking shelves across Rwanda, one trusted case at a time.
          </h1>
          <p className="mt-4 max-w-2xl text-cream/80">
            Atlas Supplies Ltd is a wholesale distributor of spirits, wine and beer,
            built for bars, restaurants and retailers who need dependable stock at
            genuine trade pricing — not the guesswork of informal sourcing.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Our story</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Why Atlas exists</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink/70">
            Licensed venues across Rwanda have long had to choose between slow,
            informal supply chains and pricing that doesn't reflect real wholesale
            volume. Atlas was built to close that gap — a single, accountable
            supplier offering transparent case pricing, verified stock levels, and
            a straightforward path from order to delivery, whether you're settling
            by trade invoice or paying by card.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl font-semibold text-ink">What sets us apart</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) =>
            <div key={value.title} className="rounded-2xl border border-burgundy-100 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-burgundy-50 text-burgundy-800">
                  <value.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold text-ink">{value.title}</p>
                <p className="mt-1.5 text-sm text-ink/60">{value.text}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-burgundy-800 px-8 py-14 text-center sm:px-16">
          <h2 className="font-serif text-3xl font-semibold text-cream">Ready to open a trade account?</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Browse the catalogue and check out — your first order doubles as your account application.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber2-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-amber2-600">

            Browse the catalogue <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>);

}
