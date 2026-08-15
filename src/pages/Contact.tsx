import React, { useState } from "react";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, SendIcon, CheckCircle2Icon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CONTACT_ADDRESS, CONTACT_PHONE_DISPLAY, CONTACT_EMAIL } from "../lib/contact";
import { useSEO } from "../lib/seo";

export function Contact() {
  useSEO({
    title: "Contact Us",
    description:
    "Get in touch with Atlas Supplies Ltd for orders, delivery questions or wholesale enquiries. Based in Kigali, Rwanda, reachable by phone, WhatsApp or email.",
    path: "/contact"
  });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
  setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />

      <div className="border-b border-burgundy-100 bg-burgundy-800">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber2-300">Get in touch</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cream sm:text-5xl">Contact Atlas</h1>
          <p className="mt-4 max-w-2xl text-cream/80">
            Questions about an order, delivery or anything else? Reach us directly, or send a message below.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-ink">Reach us directly</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-burgundy-700" />
                <span className="text-ink/70">{CONTACT_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-burgundy-700" />
                <span className="text-ink/70">{CONTACT_PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 shrink-0 text-burgundy-700" />
                <span className="text-ink/70">{CONTACT_EMAIL}</span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-burgundy-700" />
                <span className="text-ink/70">Monday – Saturday, 8am – 6pm (CAT)</span>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-burgundy-100 bg-white p-5">
              <h3 className="font-serif text-lg font-semibold text-ink">Pay us directly</h3>
              <p className="mt-1.5 text-sm text-ink/60">For one-off or invoiced payments outside a cart order.</p>
              <div className="mt-4">
                <iframe
                  title="Pay Atlas Supplies Ltd via Pesapal"
                  width="200"
                  height="40"
                  src="https://store.pesapal.com/embed-code?pageUrl=https://store.pesapal.com/atlassuppliesltdpayment"
                  style={{ border: 0 }}
                  allowFullScreen />

              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-burgundy-100 bg-white p-6 sm:p-8">
              {sent ?
              <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2Icon className="h-10 w-10 text-emerald-600" />
                  <p className="mt-4 font-serif text-2xl font-semibold text-ink">Message sent</p>
                  <p className="mt-2 text-sm text-ink/60">
                    Thanks for reaching out. The Atlas team will get back to you shortly.
                  </p>
                </div> :

              <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink/70">Your name</label>
                      <input
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className="w-full rounded-xl border border-burgundy-200 bg-white px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink/70">Email</label>
                    <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-burgundy-200 bg-white px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink/70">Message</label>
                    <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    className="w-full rounded-xl border border-burgundy-200 bg-white px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

                  </div>
                  <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-burgundy-900">

                    <SendIcon className="h-4 w-4" /> Send message
                  </button>
                </form>
              }
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">Find us</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-burgundy-100">
            <iframe
              title={`Atlas Supplies Ltd location, ${CONTACT_ADDRESS}`}
              src="https://www.google.com/maps?q=KK+15+Rd,+Kigali,+Rwanda&output=embed"
              className="h-96 w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" />

          </div>
        </div>
      </main>

      <Footer />
    </div>);

}
