import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShieldCheckIcon, ScaleIcon, MapPinIcon } from "lucide-react";

const POINTS = [
{ icon: ShieldCheckIcon, title: "Genuine imports", text: "Traceable supply routes, never grey-market stock." },
{ icon: ScaleIcon, title: "Trade-verified pricing", text: "Wholesale case pricing, shown up front — no quotes to chase." },
{ icon: MapPinIcon, title: "Rwanda-based", text: "Built around Kigali dispatch times, local terms, and local trade realities." }];


export function WhyAtlas() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Why Atlas</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">
            Built for licensed trade buyers, not casual shoppers.
          </h2>
          <p className="mt-4 max-w-lg text-ink/60">
            Atlas Supplies Ltd exists to give bars, restaurants and retailers a single,
            accountable source for spirits, wine and beer — transparent pricing,
            verified stock, and a straightforward path from order to delivery.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-800 hover:text-burgundy-900">

            More about Atlas <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5">
          {POINTS.map((point) =>
          <div key={point.title} className="flex items-start gap-4 rounded-2xl border border-burgundy-100 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-burgundy-50 text-burgundy-800">
                <point.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{point.title}</p>
                <p className="mt-1 text-sm text-ink/60">{point.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}
