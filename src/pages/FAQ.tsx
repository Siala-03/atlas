import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const FAQS: { question: string; answer: string }[] = [
{
  question: "What's the minimum order size?",
  answer: "There's no minimum order value — case pricing applies from a single case upward, though larger orders make the most of trade delivery scheduling."
},
{
  question: "How does delivery work?",
  answer: "Orders placed before 4pm are typically dispatched the next working day within Kigali and surrounding regions. A delivery date is confirmed by the Atlas team once your order is verified."
},
{
  question: "How do I pay?",
  answer: "At checkout you can pay immediately by card via Pesapal, or with MTN MoMo. Payment is confirmed before your order is dispatched."
},
{
  question: "What if an item is out of stock?",
  answer: "Stock levels shown at checkout are live. If something sells out between browsing and checkout, you'll see it clearly marked before you complete your order — never after."
},
{
  question: "Can I reorder a previous order?",
  answer: "Yes — every past order has a \"Reorder items\" option that rebuilds your cart from whatever's currently available, adjusting quantities automatically if stock has changed."
},
{
  question: "Who can I contact with a question about my order?",
  answer: "Reach the Atlas team directly through the Contact page, or call during business hours — Monday to Saturday, 8am to 6pm."
}];


export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      <div className="border-b border-burgundy-100 bg-burgundy-800">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-300">Support</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cream sm:text-5xl">Frequently asked questions</h1>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-burgundy-100 bg-white">
                <button
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}>

                  <span className="font-semibold text-ink">{faq.question}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 shrink-0 text-burgundy-700 transition-transform ${open ? "rotate-180" : ""}`} />

                </button>
                {open &&
                <p className="border-t border-burgundy-50 px-5 py-4 text-sm leading-relaxed text-ink/70">
                    {faq.answer}
                  </p>
                }
              </div>);

          })}
        </div>
      </main>

      <Footer />
    </div>);

}
