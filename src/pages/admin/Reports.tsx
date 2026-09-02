import React, { useMemo, useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, PrinterIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { useStore } from "../../store/StoreContext";
import { formatCurrency, formatDate, orderCategory } from "../../lib/format";

type PeriodType = "day" | "week" | "month" | "year" | "custom";

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function periodRange(
type: PeriodType,
anchor: Date,
customStart: Date,
customEnd: Date)
: {start: Date;end: Date;label: string;} {
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
  if (type === "custom") {
    const start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(customEnd);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    return {
      start, end,
      label: `${start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${customEnd.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
    };
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
{ value: "year", label: "Year" },
{ value: "custom", label: "Custom" }];


function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function Reports() {
  const { orders } = useStore();
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [anchor, setAnchor] = useState(new Date());
  const [customStart, setCustomStart] = useState(new Date());
  const [customEnd, setCustomEnd] = useState(new Date());

  const { start, end, label } = useMemo(
    () => periodRange(periodType, anchor, customStart, customEnd),
    [periodType, anchor, customStart, customEnd]
  );

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

    return { inRange, totalSales, orderCount, uniqueCustomers, avgOrderValue, topProducts };
  }, [orders, start, end]);

  const downloadCsv = () => {
    const rows = [
    ["Report period", label],
    ["Total sales", String(stats.totalSales)],
    ["Orders", String(stats.orderCount)],
    ["Customers", String(stats.uniqueCustomers)],
    ["Avg. order value", String(Math.round(stats.avgOrderValue))],
    [],
    ["Reference", "Date", "Customer", "Email", "Type", "Payment", "Status", "Total (RWF)"],
    ...stats.inRange.map((o) => [
    o.reference,
    formatDate(o.createdAt),
    o.contactName,
    o.email,
    orderCategory(o),
    o.paymentMethod === "card" ? "Card" : "MTN MoMo",
    o.status,
    String(o.total)]
    )];

    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    downloadFile(`atlas-report-${toDateInputValue(start)}-to-${toDateInputValue(new Date(end.getTime() - 1))}.csv`, csv, "text/csv;charset=utf-8;");
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-ink">Reports</h1>
          <p className="mt-1 text-ink/60">Sales, orders and customers for the selected period.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50">
            <DownloadIcon className="h-4 w-4" /> Download CSV
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50">
            <PrinterIcon className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <p className="hidden font-serif text-2xl font-semibold text-ink print:block">Reports · {label}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
        <div className="flex flex-wrap rounded-full border border-burgundy-200 bg-white p-1 text-sm font-semibold">
          {PERIOD_OPTIONS.map((opt) =>
          <button
            key={opt.value}
            onClick={() => { setPeriodType(opt.value); if (opt.value !== "custom") setAnchor(new Date()); }}
            className={`rounded-full px-4 py-1.5 transition-colors ${
            periodType === opt.value ? "bg-burgundy-800 text-cream" : "text-ink/60 hover:bg-burgundy-50"}`
            }>

              {opt.label}
            </button>
          )}
        </div>

        {periodType === "custom" ?
        <div className="flex items-center gap-2 rounded-full border border-burgundy-200 bg-white px-3 py-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-ink/40" />
            <input
            type="date"
            value={toDateInputValue(customStart)}
            max={toDateInputValue(customEnd)}
            onChange={(e) => e.target.value && setCustomStart(fromDateInputValue(e.target.value))}
            className="bg-transparent text-sm font-semibold text-ink outline-none [color-scheme:light]" />

            <span className="text-ink/40">to</span>
            <input
            type="date"
            value={toDateInputValue(customEnd)}
            min={toDateInputValue(customStart)}
            onChange={(e) => e.target.value && setCustomEnd(fromDateInputValue(e.target.value))}
            className="bg-transparent text-sm font-semibold text-ink outline-none [color-scheme:light]" />

          </div> :

        <div className="flex items-center gap-1.5 rounded-full border border-burgundy-200 bg-white px-2 py-1.5">
            <button onClick={() => setAnchor((a) => shiftAnchor(periodType, a, -1))} aria-label="Previous period" className="rounded-full p-1.5 text-ink/60 hover:bg-burgundy-50">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {periodType === "day" ?
          <label className="flex min-w-[10rem] items-center justify-center gap-1.5 text-sm font-semibold text-ink">
                <CalendarIcon className="h-3.5 w-3.5 text-ink/40" />
                <input
              type="date"
              value={toDateInputValue(anchor)}
              onChange={(e) => e.target.value && setAnchor(fromDateInputValue(e.target.value))}
              className="bg-transparent text-sm font-semibold text-ink outline-none [color-scheme:light]" />

              </label> :

          <span className="min-w-[10rem] text-center text-sm font-semibold text-ink">{label}</span>
          }
            <button onClick={() => setAnchor((a) => shiftAnchor(periodType, a, 1))} aria-label="Next period" className="rounded-full p-1.5 text-ink/60 hover:bg-burgundy-50">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        }

        <button onClick={() => { setPeriodType("day"); setAnchor(new Date()); }} className="rounded-full border border-burgundy-200 bg-white px-4 py-1.5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50">
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
