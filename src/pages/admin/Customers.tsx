import React, { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { useStore } from "../../store/StoreContext";
import { formatCurrency, formatDate, orderCategory } from "../../lib/format";
import { api } from "../../lib/api";
import { Customer } from "../../types";

type AccountFilter = "All" | "Registered" | "Guest";
type TypeFilter = "All" | "Individual" | "Business";

interface CustomerRow {
  email: string;
  name: string;
  phone?: string;
  registered: boolean;
  createdAt?: string;
  type: "Individual" | "Business";
  orderCount: number;
  totalSpent: number;
  lastOrderAt?: string;
}

export function Customers() {
  const { orders } = useStore();
  const [accounts, setAccounts] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState<AccountFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  useEffect(() => {
    api.getCustomers().
    then(setAccounts).
    catch(() => undefined).
    finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const byEmail = new Map<string, CustomerRow>();

    for (const account of accounts) {
      const email = account.email.toLowerCase();
      byEmail.set(email, {
        email,
        name: account.name,
        phone: account.phone,
        registered: true,
        createdAt: account.createdAt,
        type: "Individual",
        orderCount: 0,
        totalSpent: 0
      });
    }

    for (const order of orders) {
      const email = order.email.toLowerCase();
      const existing = byEmail.get(email);
      const type = orderCategory(order) === "Business" ? "Business" : "Individual";
      const isNewer = !existing?.lastOrderAt || new Date(order.createdAt) > new Date(existing.lastOrderAt);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
        if (isNewer) {
          existing.type = type;
          existing.lastOrderAt = order.createdAt;
          existing.name = existing.name || order.contactName;
        }
      } else {
        byEmail.set(email, {
          email,
          name: order.contactName,
          phone: order.phone,
          registered: false,
          type,
          orderCount: 1,
          totalSpent: order.total,
          lastOrderAt: order.createdAt
        });
      }
    }

    let list = [...byEmail.values()];
    if (accountFilter === "Registered") list = list.filter((c) => c.registered);
    if (accountFilter === "Guest") list = list.filter((c) => !c.registered);
    if (typeFilter !== "All") list = list.filter((c) => c.type === typeFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.includes(q));
    }
    return list.sort((a, b) => (b.lastOrderAt ?? b.createdAt ?? "").localeCompare(a.lastOrderAt ?? a.createdAt ?? ""));
  }, [accounts, orders, accountFilter, typeFilter, query]);

  const registeredCount = accounts.length;
  const businessCount = rows.filter((c) => c.type === "Business").length;

  return (
    <AdminLayout>
      <h1 className="font-serif text-4xl font-semibold text-ink">Customers</h1>
      <p className="mt-1 text-ink/60">
        {rows.length} total · {registeredCount} with an account · {businessCount} business.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", "Registered", "Guest"] as AccountFilter[]).map((a) =>
          <button
            key={a}
            onClick={() => setAccountFilter(a)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            accountFilter === a ?
            "bg-burgundy-800 text-cream" :
            "border border-burgundy-200 bg-white text-ink/60 hover:bg-burgundy-50"}`
            }>

              {a}
            </button>
          )}
          <span className="mx-1 text-ink/20">|</span>
          {(["All", "Individual", "Business"] as TypeFilter[]).map((t) =>
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            typeFilter === t ?
            "bg-amber2-500 text-white" :
            "border border-burgundy-200 bg-white text-ink/60 hover:bg-burgundy-50"}`
            }>

              {t}
            </button>
          )}
        </div>
        <div className="relative sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email..."
            className="w-full rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-burgundy-100 bg-white">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-burgundy-100 bg-cream/60 text-xs uppercase tracking-wider text-ink/50">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Total spent</th>
                <th className="px-5 py-3">Last order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy-50">
              {loading ?
              <tr><td colSpan={6} className="px-5 py-16 text-center text-ink/50">Loading…</td></tr> :
              rows.length === 0 ?
              <tr><td colSpan={6} className="px-5 py-16 text-center text-ink/50">No customers match your filters.</td></tr> :

              rows.map((c) =>
              <tr key={c.email} className="hover:bg-cream/50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{c.name}</p>
                      <p className="text-xs text-ink/50">{c.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    c.registered ? "bg-emerald-100 text-emerald-700" : "bg-cream text-ink/60"}`
                    }>
                        {c.registered ? "Registered" : "Guest"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.type === "Business" ? "bg-amber2-100 text-amber2-800" : "bg-cream text-ink/70"}`
                    }>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{c.orderCount}</td>
                    <td className="px-5 py-4 font-semibold text-ink">{formatCurrency(c.totalSpent)}</td>
                    <td className="px-5 py-4 text-ink/70">{c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}</td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>);

}
