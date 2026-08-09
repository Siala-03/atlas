import React from "react";

const STEPS = [
{ title: "Browse the catalogue", text: "Live stock and case pricing on every product." },
{ title: "Add to your order", text: "Build your case order at your own pace, no minimums." },
{ title: "Checkout your way", text: "Pay securely by card or MTN MoMo." },
{ title: "Delivery confirmed", text: "We confirm stock and your delivery date." }];


export function HowItWorks() {
  return (
    <section className="border-y border-burgundy-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Ordering</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">How it works</h2>
        </div>
        <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-4 hidden h-px bg-burgundy-100 lg:block" aria-hidden="true" />
          {STEPS.map((step, index) =>
          <div key={step.title} className="relative">
              <p className="font-serif text-2xl font-semibold text-burgundy-200">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 font-semibold text-ink">{step.title}</p>
              <p className="mt-1.5 text-sm text-ink/60">{step.text}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}
