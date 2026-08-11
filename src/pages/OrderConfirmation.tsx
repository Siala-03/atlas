import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon, ArrowRightIcon, ClipboardListIcon, CreditCardIcon, TruckIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useStore } from "../store/StoreContext";
import { formatCurrency, formatDateTime } from "../lib/format";
import { Payment } from "../types";

export function OrderConfirmation() {
  const { id } = useParams();
  const { orders, getPaymentStatus } = useStore();
  const order = orders.find((o) => o.id === id);
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!order || order.paymentMethod !== "card") return;
    getPaymentStatus(order.id).then(setPayment).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, order?.paymentMethod, getPaymentStatus]);

  if (!order) {
    return (
      <div className="min-h-screen w-full bg-cream">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="font-serif text-3xl text-ink">Order not found</h1>
          <Link to="/shop" className="mt-6 inline-block text-burgundy-800 underline">
            Back to catalogue
          </Link>
        </div>
        <Footer />
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          
          <CheckCircleIcon className="h-11 w-11 text-emerald-600" />
        </motion.div>

        <h1 className="mt-6 text-center font-serif text-4xl font-semibold text-ink">
          Order received
        </h1>
        <p className="mt-3 text-center text-ink/60">
          Thank you, {order.contactName}. Your order has landed with the Atlas team and
          is now <span className="font-semibold text-amber2-700">pending confirmation</span>.
        </p>

        {order.paymentMethod === "card" &&
        <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
            <CreditCardIcon className="h-4 w-4 text-burgundy-700" />
            {payment?.status === "paid" ?
          <span className="text-emerald-700">Paid by card</span> :
          payment?.status === "failed" ?
          <span className="text-red-600">Payment failed</span> :

          <span className="text-amber2-700">Payment pending</span>}
          </div>
        }

        <div className="mt-8 rounded-2xl border border-burgundy-100 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-burgundy-100 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink/40">Reference</p>
              <p className="font-serif text-2xl font-semibold text-burgundy-800">
                {order.reference}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-ink/40">Placed</p>
              <p className="text-sm font-medium">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {order.lines.map((l) =>
            <li key={`${l.productId}-${l.mode}`} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {l.name} <span className="text-ink/40">× {l.quantity} {l.mode === "business" ? "case" : "piece"}{l.quantity > 1 ? "s" : ""}</span>
                </span>
                <span className="font-medium">{formatCurrency((l.mode === "business" ? l.casePrice : l.unitPrice) * l.quantity)}</span>
              </li>
            )}
          </ul>

          <div className="mt-4 flex justify-between border-t border-burgundy-100 pt-4">
            <span className="font-serif text-lg font-semibold">Total (inc. VAT)</span>
            <span className="font-serif text-lg font-semibold text-burgundy-800">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-burgundy-50 p-5">
          <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-burgundy-800" />
          <p className="text-sm text-ink/70">
            A member of our team will confirm stock and delivery slot shortly.
            Delivery updates will be sent to <span className="font-medium">{order.email}</span>.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={`/my-orders/${order.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-6 py-3 font-semibold text-cream hover:bg-burgundy-900">
            
            <ClipboardListIcon className="h-4 w-4" /> Track this order
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 px-6 py-3 font-semibold text-burgundy-800 hover:bg-burgundy-50">
            
            Continue shopping <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>);

}