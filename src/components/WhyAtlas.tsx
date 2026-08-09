import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { VODKA_LINEUP } from "../lib/categoryImages";

const POINTS = [
{ title: "Genuine imports", text: "Traceable supply routes, never grey-market stock." },
{ title: "Straightforward pricing", text: "Case pricing, shown up front — no quotes to chase." },
{ title: "Rwanda-based", text: "Built around Kigali dispatch times and local delivery realities." }];


export function WhyAtlas() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={VODKA_LINEUP}
            alt=""
            className="aspect-[4/3] w-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-tr from-burgundy-950/40 via-transparent to-transparent" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Why Atlas</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">
            Genuine stock, straightforward pricing, delivered.
          </h2>
          <p className="mt-4 max-w-lg text-ink/60">
            Atlas Supplies Ltd exists to give bars, restaurants and retailers a single,
            accountable source for spirits, wine and beer — transparent pricing,
            verified stock, and a straightforward path from order to delivery.
          </p>

          <dl className="mt-8 space-y-5 border-t border-burgundy-100 pt-6">
            {POINTS.map((point) =>
            <div key={point.title}>
                <dt className="font-serif text-lg font-semibold text-ink">{point.title}</dt>
                <dd className="mt-1 text-sm text-ink/60">{point.text}</dd>
              </div>
            )}
          </dl>

          <Link
            to="/about"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-800 hover:text-burgundy-900">

            More about Atlas <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>);

}
