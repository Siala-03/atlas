import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangleIcon, ArrowRightIcon, ClipboardListIcon, PackageCheckIcon, PoundSterlingIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency, formatDate } from "../../lib/format";
import { useStore } from "../../store/StoreContext";
import { ORDER_STATUSES } from "../../types";

export function Dashboard() {
  const { orders, products } = useStore();
  const revenue = orders.filter((order) => order.status !== "Cancelled").reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => order.status === "Pending").length;
  const lowStock = products.filter((product) => product.stockCases <= product.lowStockThreshold);
  const activeOrders = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  const stats = [
  { label: "Revenue (inc. VAT)", value: formatCurrency(revenue), icon: PoundSterlingIcon, accent: "bg-burgundy-800" },
  { label: "Pending orders", value: String(pending), icon: ClipboardListIcon, accent: "bg-amber2-500" },
  { label: "Active orders", value: String(activeOrders), icon: PackageCheckIcon, accent: "bg-emerald-600" },
  { label: "Low stock items", value: String(lowStock.length), icon: AlertTriangleIcon, accent: "bg-red-500" }];


  return (
    <AdminLayout>
      <div><h1 className="font-serif text-4xl font-semibold text-ink">Operations dashboard</h1><p className="mt-1 text-ink/60">Incoming trade orders, fulfilment workload and warehouse availability.</p></div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="rounded-2xl border border-burgundy-100 bg-white p-5"><span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${stat.accent}`}><stat.icon className="h-5 w-5" /></span><p className="mt-4 font-serif text-3xl font-semibold text-ink">{stat.value}</p><p className="text-sm text-ink/55">{stat.label}</p></div>)}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-burgundy-100 bg-white p-6 lg:col-span-2"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold text-ink">Fulfilment queue</h2><Link to="/portal/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-burgundy-800 hover:text-burgundy-900">View all <ArrowRightIcon className="h-4 w-4" /></Link></div>{orders.length === 0 ? <p className="mt-6 text-sm text-ink/50">No orders yet. Submitted trade orders will land here.</p> : <div className="mt-4 divide-y divide-burgundy-50">{orders.slice(0, 6).map((order) => <Link key={order.id} to={`/portal/orders/${order.id}`} className="flex items-center justify-between py-3 hover:bg-cream/60"><div><p className="font-medium text-ink">{order.reference}</p><p className="text-xs text-ink/50">{order.business} · {formatDate(order.createdAt)}</p></div><div className="flex items-center gap-4"><span className="hidden text-sm font-semibold sm:inline">{formatCurrency(order.total)}</span><StatusBadge status={order.status} /></div></Link>)}</div>}</section>
        <section className="rounded-2xl border border-burgundy-100 bg-white p-6"><h2 className="font-serif text-2xl font-semibold text-ink">Orders by stage</h2><div className="mt-5 space-y-3">{ORDER_STATUSES.filter((status) => status !== "Cancelled").map((status) => {const count = orders.filter((order) => order.status === status).length;const width = orders.length ? Math.max(count / orders.length * 100, count ? 8 : 0) : 0;return <div key={status}><div className="flex justify-between text-sm"><span className="text-ink/65">{status}</span><span className="font-semibold">{count}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-burgundy-50"><div className="h-full rounded-full bg-burgundy-700" style={{ width: `${width}%` }} /></div></div>;})}</div></section>
        <section className="rounded-2xl border border-burgundy-100 bg-white p-6 lg:col-span-3"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold text-ink">Low stock watchlist</h2><Link to="/portal/inventory" className="text-sm font-semibold text-burgundy-800 hover:text-burgundy-900">Manage inventory</Link></div>{lowStock.length === 0 ? <p className="mt-5 text-sm text-ink/50">All items are above their stock threshold.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{lowStock.map((product) => <div key={product.id} className="rounded-xl bg-amber2-50 p-4"><p className="font-medium text-ink">{product.name}</p><p className="mt-1 text-xs text-ink/55">{product.brand}</p><p className="mt-3 text-sm font-bold text-amber2-800">{product.stockCases} cases left</p></div>)}</div>}</section>
      </div>
    </AdminLayout>);

}