import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { useStore } from "../../store/StoreContext";
import { formatCurrency, formatDate } from "../../lib/format";
import { ORDER_STATUSES, OrderStatus } from "../../types";

type SortField = "createdAt" | "total" | "contactName" | "status";
type SortDir = "asc" | "desc";

export function Orders() {
  const { orders } = useStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const rows = useMemo(() => {
    let list = orders.filter((o) =>
    statusFilter === "All" ? true : o.status === statusFilter
    );
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
        o.reference.toLowerCase().includes(q) ||
        o.contactName.toLowerCase().includes(q)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sortField) {
        case "total":
          return (a.total - b.total) * dir;
        case "contactName":
          return a.contactName.localeCompare(b.contactName) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        default:
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
            dir);

      }
    });
  }, [orders, query, statusFilter, sortField, sortDir]);

  const SortHeader = ({ field, label }: {field: SortField;label: string;}) =>
  <button
    onClick={() => toggleSort(field)}
    className="inline-flex items-center gap-1 font-semibold hover:text-burgundy-800">
    
      {label}
      {sortField === field && (
    sortDir === "asc" ?
    <ChevronUpIcon className="h-3.5 w-3.5" /> :

    <ChevronDownIcon className="h-3.5 w-3.5" />)
    }
    </button>;


  return (
    <AdminLayout>
      <h1 className="font-serif text-4xl font-semibold text-ink">Orders</h1>
      <p className="mt-1 text-ink/60">
        {orders.length} total · manage and track fulfilment.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", ...ORDER_STATUSES] as (OrderStatus | "All")[]).map((s) =>
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            statusFilter === s ?
            "bg-burgundy-800 text-cream" :
            "border border-burgundy-200 bg-white text-ink/60 hover:bg-burgundy-50"}`
            }>
            
              {s}
            </button>
          )}
        </div>
        <div className="relative sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ref, customer..."
            className="w-full rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />
          
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-burgundy-100 bg-white">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-burgundy-100 bg-cream/60 text-xs uppercase tracking-wider text-ink/50">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3"><SortHeader field="contactName" label="Customer" /></th>
                <th className="px-5 py-3"><SortHeader field="createdAt" label="Date" /></th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3"><SortHeader field="total" label="Total" /></th>
                <th className="px-5 py-3"><SortHeader field="status" label="Status" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy-50">
              {rows.length === 0 ?
              <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-ink/50">
                    No orders match your filters.
                  </td>
                </tr> :

              rows.map((o) =>
              <tr key={o.id} className="hover:bg-cream/50">
                    <td className="px-5 py-4">
                      <Link
                    to={`/portal/orders/${o.id}`}
                    className="font-semibold text-burgundy-800 hover:underline">
                    
                        {o.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{o.contactName}</p>
                      <p className="text-xs text-ink/50">{o.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-4 text-ink/70">
                      {o.lines.reduce((s, l) => s + (l.mode === "business" ? l.quantity * l.unitsPerCase : l.quantity), 0)} pieces
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>);

}