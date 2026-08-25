import React, { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { useStore } from "../../store/StoreContext";
import { formatCurrency } from "../../lib/format";

type PeriodType = "day" | "week" | "month" | "year";

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function periodRange(type: PeriodType, anchor: Date): {start: Date;end: Date;label: string;} {
  if (type === "day") {
    const start = new Date(anchor);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end, label: start.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) };
  }
  if (type === "week") {
    const start = startOfWeek(anchor);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const endLabel = new Date(end);
    endLabel.setDate(endLabel.getDate() - 1);
    return {
      start, end,
      label: `${start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${endLabel.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
    };
  }
  if (type === "month") {
    const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
    return { start, end, label: start.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) };
  }
  const start = new Date(anchor.getFullYear(), 0, 1);
  const end = new Date(anchor.getFullYear() + 1, 0, 1);
  return { start, end, label: String(anchor.getFullYear()) };
}

function shiftAnchor(type: PeriodType, anchor: Date, direction: 1 | -1): Date {
  const next = new Date(anchor);
  if (type === "day") next.setDate(next.getDate() + direction);
  else if (type === "week") next.setDate(next.getDate() + 7 * direction);
  else if (type === "month") next.setMonth(next.getMonth() + direction);
  else next.setFullYear(next.getFullYear() + direction);
  return next;
}

const PERIOD_OPTIONS: {value: PeriodType;label: string;}[] = [
{ value: "day", label: "Day" },
{ value: "week", label: "Week" },
{ value: "month", label: "Month" },
{ value: "year", label: "Year" }];


export function Reports() {
  const { orders } = useStore();
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [anchor, setAnchor] = useState(new Date());

  const { start, end, label } = useMemo(() => periodRange(periodType, anchor), [periodType, anchor]);

  const stats = useMemo(() => {
    const inRange = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= start && created < end && o.status !== "Cancelled";
    });
    const totalSales = inRange.reduce((sum, o) => sum + o.total, 0);
    const orderCount = inRange.length;
    const uniqueCustomers = new Set(inRange.map((o) => o.email.toLowerCase())).size;
    const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

    const productTotals = new Map<string, {name: string;units: number;}>();
    inRange.forEach((o) => {
      o.lines.forEach((line) => {
        const units = line.mode === "business" ? line.quantity * line.unitsPerCase : line.quantity;
        const existing = productTotals.get(line.name);
        productTotals.set(line.name, { name: line.name, units: (existing?.units ?? 0) + units });
      });
    });
    const topProducts = [...productTotals.values()].sort((a, b) => b.units - a.units).slice(0, 5);

    return { totalSales, orderCount, uniqueCustomers, avgOrderValue, topProducts };
  }, [orders, start, end]);

  return (
    <AdminLayout>
      <h1 className="font-serif text-4xl font-semibold text-ink">Reports</h1>
      <p className="mt-1 text-ink/60">Sales, orders and customers for the selected period.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-burgundy-200 bg-white p-1 text-sm font-semibold">
          {PERIOD_OPTIONS.map((opt) =>
          <button
            key={opt.value}
            onClick={() => { setPeriodType(opt.value); setAnchor(new Date()); }}
            className={`rounded-full px-4 py-1.5 transition-colors ${
            periodType === opt.value ? "bg-burgundy-800 text-cream" : "text-ink/60 hover:bg-burgundy-50"}`
            }>

              {opt.label}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-burgundy-200 bg-white px-2 py-1.5">
          <button onClick={() => setAnchor((a) => shiftAnchor(periodType, a, -1))} aria-label="Previous period" className="rounded-full p-1.5 text-ink/60 hover:bg-burgundy-50">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="min-w-[10rem] text-center text-sm font-semibold text-ink">{label}</span>
          <button onClick={() => setAnchor((a) => shiftAnchor(periodType, a, 1))} aria-label="Next period" className="rounded-full p-1.5 text-ink/60 hover:bg-burgundy-50">
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <button onClick={() => setAnchor(new Date())} className="text-sm font-semibold text-burgundy-800 underline underline-offset-2 hover:text-burgundy-900">
          Today
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-burgundy-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Total sales</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-burgundy-800">{formatCurrency(stats.totalSales)}</p>
        </div>
        <div className="rounded-2xl border border-burgundy-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Orders</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.orderCount}</p>
        </div>
        <div className="rounded-2xl border border-burgundy-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Customers</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.uniqueCustomers}</p>
        </div>
        <div className="rounded-2xl border border-burgundy-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">Avg. order value</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-ink">{formatCurrency(stats.avgOrderValue)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-burgundy-100 bg-white p-6">
        <h2 className="font-serif text-xl font-semibold text-ink">Top products</h2>
        {stats.topProducts.length === 0 ?
        <p className="mt-3 text-sm text-ink/50">No sales in this period.</p> :

        <div className="mt-4 divide-y divide-burgundy-50">
            {stats.topProducts.map((p) =>
          <div key={p.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-ink">{p.name}</span>
                <span className="font-semibold text-ink/70">{p.units} units</span>
              </div>
          )}
          </div>
        }
      </div>
    </AdminLayout>);

}
