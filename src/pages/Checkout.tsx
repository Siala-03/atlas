import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDaysIcon, CreditCardIcon, LockIcon, ArrowLeftIcon, SmartphoneIcon, UserIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useStore, VAT_RATE, CheckoutDetails } from "../store/StoreContext";
import { formatCurrency } from "../lib/format";
import { buildMomoUssdLink } from "../lib/momo";
import { PaymentMethod, unitPrice } from "../types";

const EMPTY: CheckoutDetails = {
  contactName: "",
  email: "",
  phone: "",
  deliveryAddress: "",
  deliveryDate: "",
  notes: ""
};

export function Checkout() {
  const { cart, getProduct, cartSubtotal, placeOrder, initiatePayment } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutDetails>(EMPTY);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutDetails, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const vat = cartSubtotal * VAT_RATE;
  const total = cartSubtotal + vat;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen w-full bg-cream">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="font-serif text-3xl text-ink">Nothing to checkout</h1>
          <Link to="/shop" className="mt-6 inline-block text-burgundy-800 underline">Browse catalogue</Link>
        </div>
        <Footer />
      </div>);

  }

  const set = (key: keyof CheckoutDetails, value: string) =>
  setForm((previous) => ({ ...previous, [key]: value }));

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^[+\d][\d\s()-]{6,}$/;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const required: (keyof CheckoutDetails)[] = [
    "contactName", "email", "phone", "deliveryAddress"];

    const nextErrors: Partial<Record<keyof CheckoutDetails, boolean>> = {};
    required.forEach((key) => {if (!form[key].trim()) nextErrors[key] = true;});
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = true;
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) nextErrors.phone = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const order = await placeOrder(form, paymentMethod);

      if (paymentMethod === "card") {
        const { redirectUrl } = await initiatePayment(order.id);
        window.location.assign(redirectUrl);
        return;
      }
      if (paymentMethod === "momo") {
        window.location.assign(buildMomoUssdLink(total));
      }
      navigate(`/order-confirmed/${order.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
  key: keyof CheckoutDetails,
  label: string,
  props: React.InputHTMLAttributes<HTMLInputElement> = {}) =>

  <div>
      <label className="mb-1.5 block text-sm font-medium text-ink/70">{label}</label>
      <input
      value={form[key]}
      onChange={(event) => set(key, event.target.value)}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-burgundy-200 ${
      errors[key] ? "border-red-400" : "border-burgundy-200 focus:border-burgundy-500"}`
      }
      {...props} />

      {errors[key] &&
      <p className="mt-1 text-xs text-red-600">
          {form[key].trim() && key === "email" ? "Enter a valid email address" :
          form[key].trim() && key === "phone" ? "Enter a valid phone number" :
          "This field is required"}
        </p>
      }
    </div>;


  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800">
          <ArrowLeftIcon className="h-4 w-4" /> Back to order
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-ink">Checkout</h1>
        <p className="mt-2 text-ink/60">Complete your details below to place your order.</p>

        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-burgundy-100 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Your details</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">Contact & delivery</h2>
                </div>
                <UserIcon className="h-6 w-6 text-burgundy-700" />
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {field("contactName", "Full name")}
                {field("email", "Email", { type: "email" })}
                {field("phone", "Phone", { type: "tel" })}
              </div>
            </section>

            <section className="rounded-2xl border border-burgundy-100 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Settlement</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">How would you like to pay?</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${paymentMethod === "card" ? "border-burgundy-500 bg-burgundy-50" : "border-burgundy-200 bg-white hover:bg-burgundy-50/50"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-0.5 h-4 w-4 border-burgundy-300 text-burgundy-800 focus:ring-burgundy-500" />
                  <span>
                    <span className="flex items-center gap-1.5 font-semibold text-ink"><CreditCardIcon className="h-4 w-4" /> Pay by card now</span>
                    <span className="mt-1 block text-ink/60">Visa, via Pesapal. You'll be redirected to complete payment securely.</span>
                  </span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${paymentMethod === "momo" ? "border-burgundy-500 bg-burgundy-50" : "border-burgundy-200 bg-white hover:bg-burgundy-50/50"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="mt-0.5 h-4 w-4 border-burgundy-300 text-burgundy-800 focus:ring-burgundy-500" />
                  <span>
                    <span className="flex items-center gap-1.5 font-semibold text-ink"><SmartphoneIcon className="h-4 w-4" /> Pay with MTN MoMo</span>
                    <span className="mt-1 block text-ink/60">Opens your phone dialer with our MoMo code and your total pre-filled. Tap call to confirm.</span>
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-burgundy-100 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Fulfilment</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">Delivery preference</h2>
                </div>
                <CalendarDaysIcon className="h-6 w-6 text-burgundy-700" />
              </div>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">Delivery address</label>
                  <textarea
                    value={form.deliveryAddress}
                    onChange={(event) => set("deliveryAddress", event.target.value)}
                    rows={3}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-burgundy-200 ${errors.deliveryAddress ? "border-red-400" : "border-burgundy-200 focus:border-burgundy-500"}`} />

                  {errors.deliveryAddress && <p className="mt-1 text-xs text-red-600">This field is required</p>}
                </div>
                <div className="max-w-xs">{field("deliveryDate", "Preferred delivery date", { type: "date", min: new Date().toISOString().slice(0, 10) })}</div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">Delivery notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(event) => set("notes", event.target.value)}
                    rows={2}
                    placeholder="Access instructions, receiving hours, preferred slot..."
                    className="w-full rounded-xl border border-burgundy-200 bg-white px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-burgundy-100 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl font-semibold text-ink">Order summary</h2>
            <ul className="mt-5 space-y-3">
              {cart.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                const isBusiness = item.mode === "business";
                const price = isBusiness ? product.casePrice : unitPrice(product);
                return (
                <li key={`${item.productId}-${item.mode}`} className="flex justify-between gap-4 text-sm">
                    <span className="text-ink/70">
                      {product.name} <span className="text-ink/40">× {item.quantity} {isBusiness ? "case" : "piece"}{item.quantity > 1 ? "s" : ""}</span>
                    </span>
                    <span className="shrink-0 font-medium">{formatCurrency(price * item.quantity)}</span>
                  </li>);
              })}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-burgundy-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{formatCurrency(cartSubtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">VAT ({Math.round(VAT_RATE * 100)}%)</dt><dd>{formatCurrency(vat)}</dd></div>
              <div className="flex justify-between border-t border-burgundy-100 pt-2"><dt className="font-serif text-lg font-semibold">Total</dt><dd className="font-serif text-lg font-semibold text-burgundy-800">{formatCurrency(total)}</dd></div>
            </dl>
            {submitError && <p className="mt-4 text-sm font-medium text-red-600">{submitError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-4 font-semibold text-cream transition-colors hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:bg-burgundy-800/60">
              <LockIcon className="h-4 w-4" />
              {submitting ?
              "Placing order…" :
              paymentMethod === "card" ? "Continue to payment" : "Place order & pay with MoMo"}
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink/50">
              {paymentMethod === "card" ?
              "You'll be redirected to complete a secure card payment." :
              "Your order is placed, then your phone dialer opens with our MoMo code and total pre-filled."}
            </p>
          </aside>
        </form>
      </main>
      <Footer />
    </div>);

}
