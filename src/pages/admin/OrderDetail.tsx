import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  PrinterIcon,
  ReceiptIcon,
  SaveIcon,
  SmartphoneIcon,
  StickyNoteIcon,
  Trash2Icon,
  XIcon } from
"lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency, formatDate, formatDateTime, orderCategory } from "../../lib/format";
import { useStore } from "../../store/StoreContext";
import { INVOICE_STATUSES, InvoiceStatus, ORDER_STATUSES, ShoppingMode } from "../../types";
import { CONTACT_ADDRESS, CONTACT_PHONE_DISPLAY } from "../../lib/contact";

const TIMESTAMPS = [
{ key: "confirmedAt", label: "Confirmed" },
{ key: "packedAt", label: "Packed" },
{ key: "dispatchedAt", label: "Dispatched" },
{ key: "deliveredAt", label: "Delivered" }] as
const;

function Divider() {
  return <div className="my-2 border-t border-dashed border-ink/30" />;
}

function InvoiceView({ order, onBack }: {order: NonNullable<ReturnType<typeof useOrder>>;onBack: () => void;}) {
  return (
    <AdminLayout>
      <style>{`
        @page { size: 58mm 400mm; margin: 0; }
        @media print {
          html, body { width: 58mm; }
        }
      `}</style>

      <div className="flex flex-col items-start gap-3 print:hidden">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800">
          <ArrowLeftIcon className="h-4 w-4" /> Back to order
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-burgundy-900">

          <PrinterIcon className="h-4 w-4" /> Print receipt
        </button>
      </div>

      <div className="mx-auto mt-6 w-full max-w-xs rounded-xl border border-burgundy-100 bg-white p-6 font-mono text-[13px] leading-relaxed text-ink shadow-sm print:mt-0 print:w-full print:max-w-none print:rounded-none print:border-0 print:p-2 print:text-[11px] print:shadow-none">
        <div className="text-center">
          <p className="text-sm font-bold">Atlas Supplies Ltd</p>
          <p className="mt-0.5 text-ink/70">{CONTACT_ADDRESS}</p>
          <p className="text-ink/70">{CONTACT_PHONE_DISPLAY}</p>
        </div>

        <Divider />

        <div className="flex justify-between"><span className="font-bold">INVOICE</span><span>{order.reference}</span></div>
        <p className="text-ink/70">{formatDateTime(order.createdAt)}</p>

        <Divider />

        {order.companyName ?
        <>
            <p className="font-bold">{order.companyName}</p>
            <p className="text-ink/70">TIN: {order.tin}</p>
          </> :

        <p className="font-bold">{order.contactName}</p>
        }
        <p className="text-ink/70">{order.phone}</p>
        <p className="break-all text-ink/70">{order.email}</p>
        <p className="whitespace-pre-line text-ink/70">{order.deliveryAddress}</p>

        <Divider />

        {order.lines.map((line) => {
          const unitPrice = line.mode === "business" ? line.casePrice : line.unitPrice;
          const unitLabel = line.mode === "business" ? "case" : "pc";
          return (
            <div key={`${line.productId}-${line.mode}`} className="mb-1.5">
              <p className="font-medium">{line.name}</p>
              <div className="flex justify-between text-ink/70">
                <span>{line.quantity} {unitLabel} x {formatCurrency(unitPrice)}</span>
                <span className="shrink-0 pl-2 text-ink">{formatCurrency(unitPrice * line.quantity)}</span>
              </div>
            </div>);

        })}

        <Divider />

        <div className="flex justify-between text-ink/70"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
        <div className="flex justify-between text-ink/70"><span>Delivery</span><span>{formatCurrency(order.deliveryFee)}</span></div>
        <div className="mt-1 flex justify-between text-sm font-bold"><span>TOTAL</span><span>{formatCurrency(order.total)}</span></div>

        <Divider />

        <p>Payment: {order.paymentMethod === "card" ? "Card" : "MTN MoMo"}</p>
        <p className="text-ink/60">Prices are VAT-inclusive.</p>

        <p className="mt-4 text-center">Thank you for your order!</p>
      </div>
    </AdminLayout>);

}

function PackingSlipView({ order, onBack }: {order: NonNullable<ReturnType<typeof useOrder>>;onBack: () => void;}) {
  const totalUnits = order.lines.reduce((sum, line) => sum + (line.mode === "business" ? line.quantity * line.unitsPerCase : line.quantity), 0);

  return (
    <AdminLayout>
      <style>{`
        @page { size: 58mm 400mm; margin: 0; }
        @media print {
          html, body { width: 58mm; }
        }
      `}</style>

      <div className="flex flex-col items-start gap-3 print:hidden">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800">
          <ArrowLeftIcon className="h-4 w-4" /> Back to order
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-burgundy-900">

          <PrinterIcon className="h-4 w-4" /> Print packing slip
        </button>
      </div>

      <div className="mx-auto mt-6 w-full max-w-xs rounded-xl border border-burgundy-100 bg-white p-6 font-mono text-[13px] leading-relaxed text-ink shadow-sm print:mt-0 print:w-full print:max-w-none print:rounded-none print:border-0 print:p-2 print:text-[11px] print:shadow-none">
        <div className="text-center">
          <p className="text-sm font-bold">Atlas Supplies Ltd</p>
        </div>

        <Divider />

        <div className="flex justify-between"><span className="font-bold">PACKING SLIP</span><span>{order.reference}</span></div>
        <p className="text-ink/70">{formatDateTime(order.createdAt)}</p>

        <Divider />

        {order.companyName ?
        <p className="font-bold">{order.companyName}</p> :
        <p className="font-bold">{order.contactName}</p>
        }
        <p className="text-ink/70">{order.phone}</p>
        <p className="whitespace-pre-line text-ink/70">{order.deliveryAddress}</p>
        {order.deliveryDate && <p className="text-ink/70">Requested: {formatDate(order.deliveryDate)}</p>}

        <Divider />

        {order.lines.map((line) => {
          const unitLabel = line.mode === "business" ? "case(s)" : "pc(s)";
          return (
            <div key={`${line.productId}-${line.mode}`} className="mb-2 flex items-start gap-2">
              <span className="mt-0.5 h-3.5 w-3.5 shrink-0 border border-ink/50" />
              <div className="flex-1">
                <p className="font-medium">{line.name}</p>
                <div className="flex justify-between text-ink/70">
                  <span>{line.brand}</span>
                  <span className="shrink-0 pl-2 font-semibold text-ink">{line.quantity} {unitLabel}</span>
                </div>
              </div>
            </div>);

        })}

        <Divider />

        <p className="text-center text-ink/70">{totalUnits} pieces total</p>
      </div>
    </AdminLayout>);

}

function useOrder() {
  const { id } = useParams();
  const { orders } = useStore();
  return orders.find((item) => item.id === id);
}

export function OrderDetail() {
  const order = useOrder();
  const { products, updateInvoiceStatus, updateOrderInternalNotes, updateOrderStatus, updateOrderDetails, updateOrderLines } = useStore();
  const [notes, setNotes] = useState(order?.internalNotes ?? "");
  const [saved, setSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingInvoice, setUpdatingInvoice] = useState(false);
  const [actionError, setActionError] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPackingSlip, setShowPackingSlip] = useState(false);

  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsDraft, setDetailsDraft] = useState({
    contactName: order?.contactName ?? "",
    email: order?.email ?? "",
    phone: order?.phone ?? "",
    deliveryAddress: order?.deliveryAddress ?? "",
    deliveryDate: order?.deliveryDate ?? "",
    notes: order?.notes ?? ""
  });
  const [savingDetails, setSavingDetails] = useState(false);

  const [editingLines, setEditingLines] = useState(false);
  const [linesDraft, setLinesDraft] = useState<{productId: string;mode: ShoppingMode;quantity: number;}[]>([]);
  const [addProductId, setAddProductId] = useState("");
  const [savingLines, setSavingLines] = useState(false);
  const [linesError, setLinesError] = useState("");

  if (!order) {
    return <AdminLayout><h1 className="font-serif text-3xl text-ink">Order not found</h1><Link to="/portal/orders" className="mt-4 inline-block text-burgundy-800 underline">Back to orders</Link></AdminLayout>;
  }

  if (showInvoice) {
    return <InvoiceView order={order} onBack={() => setShowInvoice(false)} />;
  }

  if (showPackingSlip) {
    return <PackingSlipView order={order} onBack={() => setShowPackingSlip(false)} />;
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

  const startEditDetails = () => {
    setDetailsDraft({
      contactName: order.contactName,
      email: order.email,
      phone: order.phone,
      deliveryAddress: order.deliveryAddress,
      deliveryDate: order.deliveryDate ?? "",
      notes: order.notes ?? ""
    });
    setEditingDetails(true);
  };

  const saveDetails = async () => {
    setSavingDetails(true);
    setActionError("");
    try {
      await updateOrderDetails(order.id, detailsDraft);
      setEditingDetails(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not save order details.");
    } finally {
      setSavingDetails(false);
    }
  };

  const canEditLines = !["Dispatched", "Delivered", "Cancelled"].includes(order.status);

  const startEditLines = () => {
    setLinesDraft(order.lines.map((line) => ({ productId: line.productId, mode: line.mode, quantity: line.quantity })));
    setAddProductId("");
    setLinesError("");
    setEditingLines(true);
  };

  const setLineQuantity = (index: number, quantity: number) => {
    setLinesDraft((previous) => previous.map((line, i) => i === index ? { ...line, quantity: Math.max(1, quantity) } : line));
  };

  const removeLine = (index: number) => {
    setLinesDraft((previous) => previous.filter((_, i) => i !== index));
  };

  const addLine = () => {
    if (!addProductId) return;
    const product = products.find((p) => p.id === addProductId);
    if (!product) return;
    const existing = linesDraft.find((l) => l.productId === addProductId);
    if (existing) {
      setLinesDraft((previous) => previous.map((line) => line.productId === addProductId ? { ...line, quantity: line.quantity + 1 } : line));
    } else {
      // New items match how the rest of this order is being purchased —
      // business orders add by the case, not by the single bottle.
      const orderMode: ShoppingMode = linesDraft[0]?.mode ?? order.lines[0]?.mode ?? "individual";
      setLinesDraft((previous) => [...previous, { productId: addProductId, mode: orderMode, quantity: 1 }]);
    }
    setAddProductId("");
  };

  const saveLines = async () => {
    if (linesDraft.length === 0) {
      setLinesError("An order needs at least one item — remove the order instead of clearing every item.");
      return;
    }
    setSavingLines(true);
    setLinesError("");
    try {
      await updateOrderLines(order.id, linesDraft);
      setEditingLines(false);
    } catch (error) {
      setLinesError(error instanceof Error ? error.message : "Could not save item changes.");
    } finally {
      setSavingLines(false);
    }
  };

  return (
    <AdminLayout>
      <Link to="/portal/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-burgundy-800"><ArrowLeftIcon className="h-4 w-4" /> All orders</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Fulfilment order</p><div className="mt-1 flex items-center gap-3"><h1 className="font-serif text-4xl font-semibold text-ink">{order.reference}</h1><StatusBadge status={order.status} /><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${orderCategory(order) === "Business" ? "bg-amber2-100 text-amber2-800" : "bg-cream text-ink/70"}`}>{orderCategory(order)}</span></div><p className="mt-1 text-ink/60">Placed {formatDateTime(order.createdAt)}</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowPackingSlip(true)} className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50"><PrinterIcon className="h-4 w-4" /> Print packing slip</button>
          <button onClick={() => setShowInvoice(true)} className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50"><ReceiptIcon className="h-4 w-4" /> View invoice</button>
        </div>
      </div>

      {actionError && <p className="mt-4 text-sm font-medium text-red-600">{actionError}</p>}

      <section className="mt-6 rounded-2xl border border-burgundy-100 bg-white p-5">
        <p className="text-sm font-semibold text-ink">Advance fulfilment</p>
        <div className="mt-3 flex flex-wrap gap-2">{ORDER_STATUSES.map((status) => <button key={status} onClick={() => changeStatus(status)} disabled={updatingStatus} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${order.status === status ? "bg-burgundy-800 text-cream" : "border border-burgundy-200 text-ink/70 hover:bg-burgundy-50"}`}>{status}</button>)}</div>
        <div className="mt-5 grid gap-3 border-t border-burgundy-100 pt-4 sm:grid-cols-4">{TIMESTAMPS.map((timestamp) => <div key={timestamp.key}><p className="text-xs uppercase tracking-wider text-ink/40">{timestamp.label}</p><p className="mt-1 text-sm font-medium text-ink">{order[timestamp.key] ? formatDateTime(order[timestamp.key] as string) : "—"}</p></div>)}</div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-burgundy-100 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-ink">Pick list · {totalUnits} pieces</h2>
            {canEditLines && !editingLines &&
            <button onClick={startEditLines} className="inline-flex items-center gap-1.5 rounded-lg border border-burgundy-200 px-3 py-1.5 text-xs font-semibold text-burgundy-800 hover:bg-burgundy-50">
                <PencilIcon className="h-3.5 w-3.5" /> Edit items
              </button>
            }
          </div>

          {linesError && <p className="mt-3 text-sm font-medium text-red-600">{linesError}</p>}

          {editingLines ?
          <div className="mt-4">
              <div className="divide-y divide-burgundy-50">
                {linesDraft.map((line, index) => {
                  const product = products.find((p) => p.id === line.productId);
                  return (
                    <div key={`${line.productId}-${line.mode}-${index}`} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-medium text-ink">{product?.name ?? line.productId}</p>
                        <p className="text-xs text-ink/50">{product?.brand} · {line.mode === "business" ? "case(s)" : "piece(s)"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => setLineQuantity(index, parseInt(e.target.value, 10) || 1)}
                        className="w-16 rounded-lg border border-burgundy-200 px-2 py-1.5 text-sm outline-none focus:border-burgundy-500" />

                        <button onClick={() => removeLine(index)} aria-label="Remove item" className="rounded-lg border border-burgundy-200 p-1.5 text-red-600 hover:bg-red-50">
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>);

                })}
                {linesDraft.length === 0 && <p className="py-3 text-sm text-ink/50">No items — add one below or cancel.</p>}
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-burgundy-100 pt-4">
                <select
                value={addProductId}
                onChange={(e) => setAddProductId(e.target.value)}
                className="flex-1 rounded-lg border border-burgundy-200 bg-white px-3 py-2 text-sm outline-none focus:border-burgundy-500">

                  <option value="">Add a product...</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>)}
                </select>
                <button onClick={addLine} disabled={!addProductId} className="inline-flex items-center gap-1.5 rounded-lg border border-burgundy-200 px-3 py-2 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-60">
                  <PlusIcon className="h-4 w-4" /> Add
                </button>
              </div>

              <p className="mt-3 text-xs text-ink/50">Prices and stock are recalculated using current catalogue prices when you save.</p>

              <div className="mt-4 flex gap-2">
                <button onClick={saveLines} disabled={savingLines} className="inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:opacity-60">
                  <SaveIcon className="h-4 w-4" /> {savingLines ? "Saving…" : "Save changes"}
                </button>
                <button onClick={() => setEditingLines(false)} disabled={savingLines} className="rounded-full border border-burgundy-200 px-4 py-2 text-sm font-semibold text-ink/60 hover:bg-burgundy-50">Cancel</button>
              </div>
            </div> :

          <>
              <div className="mt-4 divide-y divide-burgundy-50">{order.lines.map((line) => <div key={`${line.productId}-${line.mode}`} className="flex items-center justify-between gap-5 py-4"><div><p className="font-medium text-ink">{line.name}</p><p className="text-xs text-ink/50">{line.brand} · {line.unitsPerCase} per case</p></div><div className="text-right"><p className="font-semibold text-ink">{line.quantity} {line.mode === "business" ? "case(s)" : "piece(s)"}</p><p className="text-xs text-ink/50">{formatCurrency((line.mode === "business" ? line.casePrice : line.unitPrice) * line.quantity)}</p></div></div>)}</div>
              <dl className="mt-4 space-y-2 border-t border-burgundy-100 pt-4 text-sm"><div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div><div className="flex justify-between"><dt className="text-ink/60">Delivery fee</dt><dd>{formatCurrency(order.deliveryFee)}</dd></div><div className="flex justify-between border-t border-burgundy-100 pt-2"><dt className="font-serif text-lg font-semibold">Total</dt><dd className="font-serif text-lg font-semibold text-burgundy-800">{formatCurrency(order.total)}</dd></div></dl>
            </>
          }

          <div className="mt-6 border-t border-burgundy-100 pt-5">
            <h3 className="font-semibold text-ink">Payment</h3>
            <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-cream p-3 text-sm">
              {order.paymentMethod === "card" ? <CreditCardIcon className="h-4 w-4 text-burgundy-700" /> : <SmartphoneIcon className="h-4 w-4 text-burgundy-700" />}
              <span className="text-ink/70">{order.paymentMethod === "card" ? "Card via Pesapal" : "MTN MoMo (customer dials manually)"}</span>
            </div>
            {order.payments && order.payments.length > 0 ?
            <ul className="mt-3 space-y-2">
                {order.payments.map((p) =>
              <li key={p.id} className="flex items-center justify-between rounded-xl border border-burgundy-100 px-3 py-2 text-sm">
                    <span className="text-ink/70">{p.provider} · {formatDateTime(p.createdAt)}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                p.status === "paid" ? "bg-emerald-100 text-emerald-700" : p.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber2-100 text-amber2-800"}`
                }>
                      {formatCurrency(p.amount)} · {p.status}
                    </span>
                  </li>
              )}
              </ul> :

            <p className="mt-2 text-xs text-ink/50">
                {order.paymentMethod === "momo" ?
              "No payment record — MoMo isn't automatically tracked yet. Confirm receipt with the customer directly." :
              "No payment record yet."}
              </p>
            }
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-burgundy-100 bg-white p-6 print:hidden">
            <h2 className="font-serif text-2xl font-semibold text-ink">Commercial</h2>
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

          <section className="rounded-2xl border border-burgundy-100 bg-white p-6">
            <div className="flex items-center justify-between print:hidden">
              <h2 className="font-serif text-2xl font-semibold text-ink">Customer & delivery</h2>
              {!editingDetails &&
              <button onClick={startEditDetails} aria-label="Edit customer & delivery" className="rounded-lg p-1.5 text-ink/50 hover:bg-burgundy-50 hover:text-burgundy-800">
                  <PencilIcon className="h-4 w-4" />
                </button>
              }
            </div>

            {editingDetails ?
            <div className="mt-4 space-y-3 print:hidden">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60">Full name</label>
                  <input value={detailsDraft.contactName} onChange={(e) => setDetailsDraft((d) => ({ ...d, contactName: e.target.value }))} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60">Email</label>
                  <input type="email" value={detailsDraft.email} onChange={(e) => setDetailsDraft((d) => ({ ...d, email: e.target.value }))} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60">Phone</label>
                  <input value={detailsDraft.phone} onChange={(e) => setDetailsDraft((d) => ({ ...d, phone: e.target.value }))} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60">Delivery address</label>
                  <textarea rows={2} value={detailsDraft.deliveryAddress} onChange={(e) => setDetailsDraft((d) => ({ ...d, deliveryAddress: e.target.value }))} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60">Delivery date</label>
                  <input type="date" value={detailsDraft.deliveryDate ?? ""} onChange={(e) => setDetailsDraft((d) => ({ ...d, deliveryDate: e.target.value }))} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveDetails} disabled={savingDetails} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-burgundy-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:opacity-60"><SaveIcon className="h-4 w-4" /> {savingDetails ? "Saving…" : "Save"}</button>
                  <button onClick={() => setEditingDetails(false)} disabled={savingDetails} className="rounded-full border border-burgundy-200 p-2 text-ink/60 hover:bg-burgundy-50" aria-label="Cancel"><XIcon className="h-4 w-4" /></button>
                </div>
              </div> :

            <>
                <ul className="mt-4 space-y-3 text-sm"><li className="flex items-start gap-2.5"><BuildingIcon className="mt-0.5 h-4 w-4 text-burgundy-700" /><div><p className="font-medium text-ink">{order.contactName}</p></div></li><li className="flex items-center gap-2.5"><MailIcon className="h-4 w-4 text-burgundy-700" />{order.email}</li><li className="flex items-center gap-2.5"><PhoneIcon className="h-4 w-4 text-burgundy-700" />{order.phone}</li><li className="flex items-start gap-2.5"><MapPinIcon className="mt-0.5 h-4 w-4 text-burgundy-700" /><span className="whitespace-pre-line">{order.deliveryAddress}</span></li>{order.deliveryLat != null && order.deliveryLng != null && <li className="pl-6"><a href={`https://www.openstreetmap.org/?mlat=${order.deliveryLat}&mlon=${order.deliveryLng}#map=17/${order.deliveryLat}/${order.deliveryLng}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-burgundy-800 underline underline-offset-2 print:hidden">View dropped pin on map</a></li>}{order.deliveryDate && <li className="flex items-center gap-2.5"><CalendarDaysIcon className="h-4 w-4 text-burgundy-700" />Requested {formatDate(order.deliveryDate)}</li>}</ul>
                {order.companyName && <div className="mt-4 rounded-xl bg-burgundy-50 p-4 text-sm"><p className="font-semibold text-ink">{order.companyName}</p><p className="text-ink/60">TIN: {order.tin}</p>{order.needsEbm && <p className="mt-2 text-xs text-burgundy-800">EBM invoice requested · Purchase code: {order.ebmPurchaseCode} · Invoice email: {order.ebmInvoiceEmail}</p>}</div>}
              </>
            }
          </section>
          {order.notes && <section className="rounded-2xl border border-amber2-200 bg-amber2-50 p-6"><h3 className="flex items-center gap-2 font-semibold text-amber2-900"><StickyNoteIcon className="h-4 w-4" /> Customer delivery notes</h3><p className="mt-2 text-sm text-amber2-900/80">{order.notes}</p></section>}
        </aside>
      </div>
    </AdminLayout>);

}
