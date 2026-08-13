import React, { useMemo, useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  PencilIcon,
  AlertTriangleIcon } from
"lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { useStore } from "../../store/StoreContext";
import { formatCurrency } from "../../lib/format";
import { Product, unitPrice } from "../../types";
import { hasCaseOption } from "../../lib/productRules";

export function Inventory() {
  const { products, updateProduct, restockProduct } = useStore();
  const [query, setQuery] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{price: string;stock: string;lowStockThreshold: string;}>({
    price: "",
    stock: "",
    lowStockThreshold: ""
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const rows = useMemo(() => {
    let list = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (onlyLow) list = list.filter((p) => p.stockUnits <= p.lowStockThreshold);
    return list;
  }, [products, query, onlyLow]);

  const startEdit = (p: Product) => {
    const caseOnly = hasCaseOption(p.category);
    setEditId(p.id);
    setDraft({
      price: String(caseOnly ? p.casePrice : unitPrice(p)),
      stock: String(caseOnly ? Math.floor(p.stockUnits / p.unitsPerCase) : p.stockUnits),
      lowStockThreshold: String(caseOnly ? Math.floor(p.lowStockThreshold / p.unitsPerCase) : p.lowStockThreshold)
    });
  };

  const saveEdit = async (p: Product) => {
    const caseOnly = hasCaseOption(p.category);
    setSavingId(p.id);
    setRowError(null);
    try {
      const enteredPrice = parseFloat(draft.price) || 0;
      const enteredStock = parseInt(draft.stock, 10) || 0;
      const enteredThreshold = parseInt(draft.lowStockThreshold, 10) || 0;
      await updateProduct(p.id, {
        casePrice: caseOnly ? enteredPrice : Math.round(enteredPrice * p.unitsPerCase),
        stockUnits: caseOnly ? enteredStock * p.unitsPerCase : enteredStock,
        lowStockThreshold: caseOnly ? enteredThreshold * p.unitsPerCase : enteredThreshold
      });
      setEditId(null);
    } catch (error) {
      setRowError(error instanceof Error ? error.message : "Could not save changes.");
    } finally {
      setSavingId(null);
    }
  };

  const restock = async (p: Product) => {
    const caseOnly = hasCaseOption(p.category);
    setRestockingId(p.id);
    setRowError(null);
    try {
      // Case-only products restock 12 whole cases at a time; bottle-only
      // products restock one case's worth of bottles at a time.
      await restockProduct(p.id, caseOnly ? 12 * p.unitsPerCase : p.unitsPerCase);
    } catch (error) {
      setRowError(error instanceof Error ? error.message : "Could not restock.");
    } finally {
      setRestockingId(null);
    }
  };

  const totalStockValue = products.reduce(
    (s, p) => s + (hasCaseOption(p.category) ? p.casePrice * (p.stockUnits / p.unitsPerCase) : unitPrice(p) * p.stockUnits),
    0
  );
  const lowCount = products.filter((p) => p.stockUnits <= p.lowStockThreshold).
  length;

  return (
    <AdminLayout>
      <h1 className="font-serif text-4xl font-semibold text-ink">Inventory</h1>
      <p className="mt-1 text-ink/60">
        {products.length} products · stock value {formatCurrency(totalStockValue)}
      </p>
      <p className="mt-1 text-xs text-ink/40">
        Wine &amp; spirits are priced and stocked per bottle · Beer is priced and stocked per case.
      </p>
      {rowError && <p className="mt-3 text-sm font-medium text-red-600">{rowError}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setOnlyLow((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          onlyLow ?
          "bg-amber2-500 text-white" :
          "border border-burgundy-200 bg-white text-ink/70 hover:bg-burgundy-50"}`
          }>

          <AlertTriangleIcon className="h-4 w-4" />
          Low stock only ({lowCount})
        </button>
        <div className="relative sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-burgundy-100 bg-white">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-burgundy-100 bg-cream/60 text-xs uppercase tracking-wider text-ink/50">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Low at</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy-50">
              {rows.map((p) => {
                const editing = editId === p.id;
                const caseOnly = hasCaseOption(p.category);
                const unitLabel = caseOnly ? "case" : "bottle";
                const low = p.stockUnits <= p.lowStockThreshold;
                const out = p.stockUnits === 0;
                const displayPrice = caseOnly ? p.casePrice : unitPrice(p);
                const displayStock = caseOnly ? Math.floor(p.stockUnits / p.unitsPerCase) : p.stockUnits;
                const displayThreshold = caseOnly ? Math.floor(p.lowStockThreshold / p.unitsPerCase) : p.lowStockThreshold;
                return (
                  <tr key={p.id} className="align-middle hover:bg-cream/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream p-1">
                          <img src={p.image} alt="" className="h-full w-auto object-contain" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-ink/50">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{p.category}</td>
                    <td className="px-5 py-4">
                      {editing ?
                      <input
                        value={draft.price}
                        onChange={(e) =>
                        setDraft((d) => ({ ...d, price: e.target.value }))
                        }
                        className="w-24 rounded-lg border border-burgundy-300 px-2 py-1 text-sm outline-none focus:border-burgundy-500" /> :


                      <>
                          <span className="font-medium">{formatCurrency(displayPrice)}</span>
                          <span className="ml-1 text-xs text-ink/40">/{unitLabel}</span>
                        </>
                      }
                    </td>
                    <td className="px-5 py-4">
                      {editing ?
                      <input
                        value={draft.stock}
                        onChange={(e) =>
                        setDraft((d) => ({ ...d, stock: e.target.value }))
                        }
                        className="w-20 rounded-lg border border-burgundy-300 px-2 py-1 text-sm outline-none focus:border-burgundy-500" /> :


                      <>
                          <span className="font-medium">{displayStock}</span>
                          <span className="ml-1 text-xs text-ink/40">{unitLabel}{displayStock === 1 ? "" : "s"}</span>
                        </>
                      }
                    </td>
                    <td className="px-5 py-4">
                      {editing ?
                      <input
                        value={draft.lowStockThreshold}
                        onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          lowStockThreshold: e.target.value
                        }))
                        }
                        className="w-20 rounded-lg border border-burgundy-300 px-2 py-1 text-sm outline-none focus:border-burgundy-500" /> :


                      <span className="text-ink/60">{displayThreshold} {unitLabel}{displayThreshold === 1 ? "" : "s"}</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        out ?
                        "bg-red-100 text-red-700" :
                        low ?
                        "bg-amber2-100 text-amber2-800" :
                        "bg-emerald-100 text-emerald-700"}`
                        }>

                        {out ? "Out" : low ? "Low" : "In stock"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {editing ?
                        <>
                            <button
                            onClick={() => saveEdit(p)}
                            disabled={savingId === p.id}
                            className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Save">

                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                            onClick={() => setEditId(null)}
                            disabled={savingId === p.id}
                            className="rounded-lg border border-burgundy-200 p-2 text-ink/60 hover:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Cancel">

                              <XIcon className="h-4 w-4" />
                            </button>
                          </> :

                        <>
                            <button
                            onClick={() => restock(p)}
                            disabled={restockingId === p.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-burgundy-200 px-2.5 py-2 text-xs font-semibold text-burgundy-800 hover:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-60">

                              <PlusIcon className="h-3.5 w-3.5" /> {caseOnly ? "+12 cases" : `+${p.unitsPerCase} bottles`}
                            </button>
                            <button
                            onClick={() => startEdit(p)}
                            className="rounded-lg border border-burgundy-200 p-2 text-ink/60 hover:bg-burgundy-50"
                            aria-label="Edit">

                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
              {rows.length === 0 &&
              <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-ink/50">
                    No products match your filters.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>);

}
