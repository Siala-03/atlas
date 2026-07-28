import React from "react";
import { SearchIcon, ShoppingCartIcon, CreditCardIcon, TruckIcon } from "lucide-react";

const STEPS = [
{ icon: SearchIcon, title: "Browse the catalogue", text: "Live stock and trade case pricing on every product." },
{ icon: ShoppingCartIcon, title: "Add to your order", text: "Build your case order at your own pace, no minimums." },
{ icon: CreditCardIcon, title: "Checkout your way", text: "Settle by trade invoice on Net 30 terms, or pay now by card." },
{ icon: TruckIcon, title: "Delivery confirmed", text: "We verify stock and licence, then confirm your delivery date." }];


export function HowItWorks() {
  return (
    <section className="border-y border-burgundy-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Ordering</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">How it works</h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) =>
          <div key={step.title} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-800 text-cream">
                <step.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 font-serif text-xs font-semibold uppercase tracking-widest text-amber2-600">
                Step {index + 1}
              </p>
              <p className="mt-1 font-semibold text-ink">{step.title}</p>
              <p className="mt-1.5 text-sm text-ink/60">{step.text}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}
