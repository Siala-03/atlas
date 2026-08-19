import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
  SaveIcon,
  StickyNoteIcon } from
"lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "../../lib/format";
import { useStore } from "../../store/StoreContext";
import { INVOICE_STATUSES, InvoiceStatus, Payment, ORDER_STATUSES } from "../../types";

const TIMESTAMPS = [
{ key: "confirmedAt", label: "Confirmed" },
{ key: "packedAt", label: "Packed" },
{ key: "dispatchedAt", label: "Dispatched" },
{ key: "deliveredAt", label: "Delivered" }] as
const;

export function OrderDetail() {
  const { id } = useParams();
  const { orders, updateInvoiceStatus, updateOrderInternalNotes, updateOrderStatus, getPaymentStatus } = useStore();
  const order = orders.find((item) => item.id === id);
  const [notes, setNotes] = useState(order?.internalNotes ?? "");
  const [saved, setSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingInvoice, setUpdatingInvoice] = useState(false);
  const [actionError, setActionError] = useState("");
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!order || order.paymentMethod !== "card") return;
    getPaymentStatus(order.id).then(setPayment).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, order?.paymentMethod, getPaymentStatus]);

  if (!order) {
    return <AdminLayout><h1 className="font-serif text-3xl text-ink">Order not found</h1><Link to="/portal/orders" className="mt-4 inline-block text-burgundy-800 underline">Back to orders</Link></AdminLayout>;
  }

  const totalUnits = order.lines.reduce((sum, line) => sum + (line.mode === "business" ? line.quantity * line.unitsPerCase : line.quantity), 0);

  const changeStatus = async (status: typeof ORDER_STATUSES[number]) => {
    setUpdatingStatus(true);
    setActionError("");
    try {
      await updateOrderStatus(order.id, status);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const changeInvoiceStatus = async (invoiceStatus: InvoiceStatus) => {
    setUpdatingInvoice(true);
    setActionError("");
    try {
      await updateInvoiceStatus(order.id, invoiceStatus);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not update invoice status.");
    } finally {
      setUpdatingInvoice(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    setActionError("");
    try {
      await updateOrderInternalNotes(order.id, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not save note.");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <AdminLayout>
      <Link to="/portal/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800"><ArrowLeftIcon className="h-4 w-4" /> All orders</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Fulfilment order</p><div className="mt-1 flex items-center gap-3"><h1 className="font-serif text-4xl font-semibold text-ink">{order.reference}</h1><StatusBadge status={order.status} /></div><p className="mt-1 text-ink/60">Placed {formatDateTime(order.createdAt)}</p></div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50"><PrinterIcon className="h-4 w-4" /> Print packing slip</button>
      </div>

      {actionError && <p className="mt-4 text-sm font-medium text-red-600 print:hidden">{actionError}</p>}

      <section className="mt-6 rounded-2xl border border-burgundy-100 bg-white p-5 print:hidden">
        <p className="text-sm font-semibold text-ink">Advance fulfilment</p>
        <div className="mt-3 flex flex-wrap gap-2">{ORDER_STATUSES.map((status) => <button key={status} onClick={() => changeStatus(status)} disabled={updatingStatus} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${order.status === status ? "bg-burgundy-800 text-cream" : "border border-burgundy-200 text-ink/70 hover:bg-burgundy-50"}`}>{status}</button>)}</div>
        <div className="mt-5 grid gap-3 border-t border-burgundy-100 pt-4 sm:grid-cols-4">{TIMESTAMPS.map((timestamp) => <div key={timestamp.key}><p className="text-xs uppercase tracking-wider text-ink/40">{timestamp.label}</p><p className="mt-1 text-sm font-medium text-ink">{order[timestamp.key] ? formatDateTime(order[timestamp.key] as string) : "—"}</p></div>)}</div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-burgundy-100 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold text-ink">Pick list · {totalUnits} pieces</h2></div>
          <div className="mt-4 divide-y divide-burgundy-50">{order.lines.map((line) => <div key={`${line.productId}-${line.mode}`} className="flex items-center justify-between gap-5 py-4"><div><p className="font-medium text-ink">{line.name}</p><p className="text-xs text-ink/50">{line.brand} · {line.unitsPerCase} per case</p></div><div className="text-right"><p className="font-semibold text-ink">{line.quantity} {line.mode === "business" ? "case(s)" : "piece(s)"}</p><p className="text-xs text-ink/50">{formatCurrency((line.mode === "business" ? line.casePrice : line.unitPrice) * line.quantity)}</p></div></div>)}</div>
          <dl className="mt-4 space-y-2 border-t border-burgundy-100 pt-4 text-sm"><div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div><div className="flex justify-between"><dt className="text-ink/60">Delivery fee</dt><dd>{formatCurrency(order.deliveryFee)}</dd></div><div className="flex justify-between border-t border-burgundy-100 pt-2"><dt className="font-serif text-lg font-semibold">Total</dt><dd className="font-serif text-lg font-semibold text-burgundy-800">{formatCurrency(order.total)}</dd></div></dl>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-burgundy-100 bg-white p-6 print:hidden">
            <h2 className="font-serif text-2xl font-semibold text-ink">Commercial</h2>
            {order.paymentMethod === "card" &&
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-cream p-3 text-sm">
                <CreditCardIcon className="h-4 w-4 text-burgundy-700" />
                <span className="text-ink/70">Paid by card{payment ? ` · ${payment.status}` : ""}</span>
              </div>
            }
            <label className="mt-4 block text-sm font-medium text-ink/70">Invoice status</label>
            <select
              value={order.invoiceStatus ?? "To invoice"}
              onChange={(event) => changeInvoiceStatus(event.target.value as InvoiceStatus)}
              disabled={updatingInvoice}
              className="mt-1.5 w-full rounded-xl border border-burgundy-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-burgundy-500 disabled:opacity-60">
              {INVOICE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <p className="mt-3 text-xs leading-relaxed text-ink/50">Customer account payment terms are handled separately from fulfilment status.</p>
          </section>
          <section className="rounded-2xl border border-burgundy-100 bg-white p-6 print:hidden"><h2 className="font-serif text-2xl font-semibold text-ink">Internal handover</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Substitutions, picker notes, delivery call outcome..." className="mt-4 w-full rounded-xl border border-burgundy-200 px-3 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100" /><button onClick={saveNotes} disabled={savingNotes} className="mt-3 inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:opacity-60"><SaveIcon className="h-4 w-4" /> {saved ? "Saved" : savingNotes ? "Saving…" : "Save note"}</button></section>
          <section className="rounded-2xl border border-burgundy-100 bg-white p-6"><h2 className="font-serif text-2xl font-semibold text-ink">Customer & delivery</h2><ul className="mt-4 space-y-3 text-sm"><li className="flex items-start gap-2.5"><BuildingIcon className="mt-0.5 h-4 w-4 text-burgundy-700" /><div><p className="font-medium text-ink">{order.contactName}</p></div></li><li className="flex items-center gap-2.5"><MailIcon className="h-4 w-4 text-burgundy-700" />{order.email}</li><li className="flex items-center gap-2.5"><PhoneIcon className="h-4 w-4 text-burgundy-700" />{order.phone}</li><li className="flex items-start gap-2.5"><MapPinIcon className="mt-0.5 h-4 w-4 text-burgundy-700" /><span className="whitespace-pre-line">{order.deliveryAddress}</span></li>{order.deliveryLat != null && order.deliveryLng != null && <li className="pl-6"><a href={`https://www.openstreetmap.org/?mlat=${order.deliveryLat}&mlon=${order.deliveryLng}#map=17/${order.deliveryLat}/${order.deliveryLng}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-burgundy-800 underline underline-offset-2">View dropped pin on map</a></li>}{order.deliveryDate && <li className="flex items-center gap-2.5"><CalendarDaysIcon className="h-4 w-4 text-burgundy-700" />Requested {formatDate(order.deliveryDate)}</li>}</ul>{order.companyName && <div className="mt-4 rounded-xl bg-burgundy-50 p-4 text-sm"><p className="font-semibold text-ink">{order.companyName}</p><p className="text-ink/60">TIN: {order.tin}</p>{order.needsEbm && <p className="mt-2 text-xs text-burgundy-800">EBM invoice requested · Purchase code: {order.ebmPurchaseCode} · Invoice email: {order.ebmInvoiceEmail}</p>}</div>}</section>
          {order.notes && <section className="rounded-2xl border border-amber2-200 bg-amber2-50 p-6"><h3 className="flex items-center gap-2 font-semibold text-amber2-900"><StickyNoteIcon className="h-4 w-4" /> Customer delivery notes</h3><p className="mt-2 text-sm text-amber2-900/80">{order.notes}</p></section>}
        </aside>
      </div>
    </AdminLayout>);

}
