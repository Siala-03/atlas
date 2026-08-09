import React, { useState } from "react";
import { Product } from "../types";

const TABS = ["Description", "Specifications", "Delivery info"] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ product }: {product: Product;}) {
  const [active, setActive] = useState<Tab>("Description");

  const specs: [string, string][] = [
  ["Brand", product.brand],
  ["Category", product.category],
  ["ABV", `${product.abv}%`],
  ["Volume", product.volume],
  ["Units per case", String(product.unitsPerCase)],
  ["Origin", product.origin]];


  return (
    <div>
      <div className="flex gap-1 border-b border-burgundy-100">
        {TABS.map((tab) =>
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
          active === tab ?
          "border-burgundy-800 text-burgundy-800" :
          "border-transparent text-ink/50 hover:text-ink"}`
          }>

            {tab}
          </button>
        )}
      </div>

      <div className="py-6">
        {active === "Description" &&
        <p className="leading-relaxed text-ink/70">{product.description}</p>
        }

        {active === "Specifications" &&
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {specs.map(([label, value]) =>
          <div key={label} className="flex justify-between border-b border-burgundy-50 pb-2 text-sm">
                <dt className="text-ink/50">{label}</dt>
                <dd className="font-medium text-ink">{value}</dd>
              </div>
          )}
          </dl>
        }

        {active === "Delivery info" &&
        <div className="space-y-3 text-sm leading-relaxed text-ink/70">
            <p>Orders placed before 4pm are typically dispatched the next working day within Kigali and surrounding regions.</p>
            <p>There's no minimum order value, though case pricing applies from a single case upward.</p>
            <p>Stock and delivery dates are confirmed by the Atlas team after checkout, before invoicing or card capture.</p>
          </div>
        }
      </div>
    </div>);

}
