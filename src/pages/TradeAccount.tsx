import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  FileCheckIcon,
  CalendarClockIcon,
  PercentIcon,
  CreditCardIcon } from
"lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const STEPS = [
{
  icon: FileCheckIcon,
  title: "Place your first order",
  text: "Add your business and licence details at checkout — this doubles as your trade account application."
},
{
  icon: CalendarClockIcon,
  title: "We verify your licence",
  text: "Our team confirms your trading licence before your first order is dispatched. Most accounts clear within one business day."
},
{
  icon: PercentIcon,
  title: "Order at trade pricing",
  text: "Every case price shown is already wholesale — no separate quote process, no negotiating per order."
},
{
  icon: CreditCardIcon,
  title: "Pay by invoice or card",
  text: "Settle on Net 30 trade terms, or pay immediately by card via Pesapal — your choice at checkout, every time."
}];


export function TradeAccount() {
  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      <div className="border-b border-burgundy-100 bg-burgundy-800">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-300">Wholesale</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cream sm:text-5xl">Trade accounts, explained</h1>
          <p className="mt-4 max-w-2xl text-cream/80">
            Everything a licensed bar, restaurant or retailer needs to know before ordering with Atlas — no separate sign-up process required.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-serif text-3xl font-semibold text-ink">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step, index) =>
            <div key={step.title} className="relative rounded-2xl border border-burgundy-100 bg-white p-6">
                <span className="absolute right-6 top-6 font-serif text-3xl font-semibold text-burgundy-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-burgundy-50 text-burgundy-800">
                  <step.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold text-ink">{step.title}</p>
                <p className="mt-1.5 text-sm text-ink/60">{step.text}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-burgundy-100 bg-white p-8">
          <h2 className="font-serif text-2xl font-semibold text-ink">What you'll need</h2>
          <ul className="mt-5 space-y-3 text-sm text-ink/70">
            <li>• A valid trading or alcohol licence number for your business</li>
            <li>• A registered business name and delivery address</li>
            <li>• A contact person for order confirmations and delivery scheduling</li>
          </ul>
          <p className="mt-5 text-sm text-ink/50">
            New accounts show as <span className="font-medium text-amber2-700">Pending review</span> until
            your licence is confirmed. You can browse and add to cart at any time — verification only affects
            when your first order is dispatched.
          </p>
        </section>

        <section className="mt-16 rounded-3xl bg-burgundy-800 px-8 py-14 text-center sm:px-16">
          <h2 className="font-serif text-3xl font-semibold text-cream">Ready to start your account?</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Browse the catalogue and check out — there's no separate application form.
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
