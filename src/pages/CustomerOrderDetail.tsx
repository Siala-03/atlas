import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, RefreshCwIcon, TruckIcon, CalendarDaysIcon, CheckIcon } from "lucide-react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { StatusBadge } from "../components/StatusBadge";
import { getCustomerAccountId } from "../lib/customerAuth";
import { formatCurrency, formatDate, formatDateTime } from "../lib/format";
import { useStore } from "../store/StoreContext";

const STEPS = ["Pending", "Confirmed", "Packed", "Dispatched", "Delivered"] as const;

export function CustomerOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, reorderOrder } = useStore();
  const [message, setMessage] = useState("");
  const [reordering, setReordering] = useState(false);
  const accountId = getCustomerAccountId();
  const order = orders.find((item) => item.id === id && item.accountId === accountId);

  if (!order) {
    return (
      <div className="min-h-screen w-full bg-cream"><Navbar /><main className="mx-auto max-w-3xl px-4 py-28 text-center"><h1 className="font-serif text-3xl text-ink">Order unavailable</h1><p className="mt-2 text-ink/60">This order is not linked to the active trade account.</p><Link to="/my-orders" className="mt-6 inline-block text-burgundy-800 underline">Back to my orders</Link></main><Footer /></div>);

  }

  const activeStep = STEPS.indexOf(order.status as (typeof STEPS)[number]);
  const reorder = async () => {
    setReordering(true);
    setMessage("");
    try {
      const result = await reorderOrder(order.id);
      if (!result.addedCases) {
        setMessage("None of these items are currently available to reorder.");
        return;
      }
      navigate("/cart");
    } catch {
      setMessage("Could not reorder right now. Please try again.");
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/my-orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800"><ArrowLeftIcon className="h-4 w-4" /> My orders</Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Order reference</p><h1 className="mt-1 font-serif text-4xl font-semibold text-ink">{order.reference}</h1><p className="mt-2 text-ink/60">Placed {formatDateTime(order.createdAt)}</p></div>
          <StatusBadge status={order.status} />
        </div>

        <section className="mt-8 rounded-2xl border border-burgundy-100 bg-white p-6">
          <h2 className="font-serif text-2xl font-semibold text-ink">Fulfilment progress</h2>
          {order.status === "Cancelled" ? <p className="mt-3 text-sm text-red-600">This order was cancelled. Contact our trade team for assistance.</p> :
          <ol className="mt-7 grid gap-4 sm:grid-cols-5">
              {STEPS.map((step, index) => {
              const complete = index <= activeStep;
              return <li key={step} className="relative flex items-center gap-2 sm:block">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${complete ? "bg-burgundy-800 text-cream" : "bg-burgundy-50 text-burgundy-300"}`}>{complete ? <CheckIcon className="h-4 w-4" /> : index + 1}</span>
                  <p className={`mt-0 text-xs font-semibold sm:mt-2 ${complete ? "text-ink" : "text-ink/40"}`}>{step}</p>
                </li>;
            })}
            </ol>
          }
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-burgundy-100 bg-white p-6 lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-ink">Order items</h2>
            <ul className="mt-4 divide-y divide-burgundy-50">
              {order.lines.map((line) => <li key={line.productId} className="flex justify-between gap-5 py-3"><div><p className="font-medium text-ink">{line.name}</p><p className="text-xs text-ink/50">{line.brand} · {line.cases} case(s) · {line.unitsPerCase} per case</p></div><p className="shrink-0 font-semibold">{formatCurrency(line.casePrice * line.cases)}</p></li>)}
            </ul>
            <div className="mt-4 flex justify-between border-t border-burgundy-100 pt-4"><span className="font-serif text-lg font-semibold">Total inc. VAT</span><span className="font-serif text-lg font-semibold text-burgundy-800">{formatCurrency(order.total)}</span></div>
          </section>
          <aside className="space-y-5">
            <section className="rounded-2xl border border-burgundy-100 bg-white p-6"><CalendarDaysIcon className="h-5 w-5 text-burgundy-700" /><h2 className="mt-3 font-semibold text-ink">Delivery</h2><p className="mt-1 text-sm text-ink/60">{order.deliveryDate ? `Requested ${formatDate(order.deliveryDate)}` : "Date to be confirmed by Atlas"}</p><p className="mt-4 whitespace-pre-line text-sm text-ink/65">{order.deliveryAddress}</p></section>
            <section className="rounded-2xl bg-burgundy-800 p-6 text-cream"><TruckIcon className="h-5 w-5 text-amber2-300" /><h2 className="mt-3 font-serif text-2xl font-semibold">Need this order again?</h2><p className="mt-1 text-sm text-cream/75">We’ll rebuild your basket from available stock.</p><button onClick={reorder} disabled={reordering} className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber2-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber2-600 disabled:cursor-not-allowed disabled:opacity-60"><RefreshCwIcon className="h-4 w-4" /> {reordering ? "Reordering…" : "Reorder items"}</button>{message && <p className="mt-3 text-xs text-amber2-200">{message}</p>}</section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>);

}