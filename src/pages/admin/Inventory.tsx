import React, { useMemo, useRef, useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  PencilIcon,
  FilterIcon,
  ImageUpIcon } from
"lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { useStore } from "../../store/StoreContext";
import { formatCurrency } from "../../lib/format";
import { Category, Product } from "../../types";
import { bottlePrice, hasCaseOption, isCaseStocked } from "../../lib/productRules";

// Resizes/compresses an image file client-side before it's sent to the
// server, so a raw multi-megabyte phone photo doesn't blow up the DB row
// or the /products response size. Returns a JPEG data URL.
function resizeImageFile(file: File, maxDim = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      img.onerror = () => reject(new Error("Could not read image"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

type StatusFilter = "All" | "In stock" | "Low" | "Out";
type SortKey = "name" | "stock-asc" | "stock-desc" | "price-asc" | "price-desc";

export function Inventory() {
  const { products, updateProduct, restockProduct } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [brand, setBrand] = useState<string>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortKey>("name");
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{price: string;stock: string;lowStockThreshold: string;}>({
    price: "",
    stock: "",
    lowStockThreshold: ""
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetId = useRef<string | null>(null);

  const triggerUpload = (productId: string) => {
    uploadTargetId.current = productId;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const productId = uploadTargetId.current;
    event.target.value = "";
    if (!file || !productId) return;

    setUploadingId(productId);
    setRowError(null);
    try {
      const dataUrl = await resizeImageFile(file);
      await updateProduct(productId, { image: dataUrl });
    } catch (error) {
      setRowError(error instanceof Error ? error.message : "Could not upload image.");
    } finally {
      setUploadingId(null);
    }
  };

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  const rows = useMemo(() => {
    let list = products;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (brand !== "All") list = list.filter((p) => p.brand === brand);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (status === "Out") list = list.filter((p) => p.stockUnits === 0);
    else if (status === "Low") list = list.filter((p) => p.stockUnits > 0 && p.stockUnits <= p.lowStockThreshold);
    else if (status === "In stock") list = list.filter((p) => p.stockUnits > p.lowStockThreshold);

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "stock-asc") return a.stockUnits - b.stockUnits;
      if (sort === "stock-desc") return b.stockUnits - a.stockUnits;
      if (sort === "price-asc") return bottlePrice(a) - bottlePrice(b);
      return bottlePrice(b) - bottlePrice(a);
    });
    return sorted;
  }, [products, query, category, brand, status, sort]);

  const startEdit = (p: Product) => {
    const caseOnly = isCaseStocked(p.category);
    setEditId(p.id);
    setDraft({
      price: String(caseOnly ? p.casePrice : bottlePrice(p)),
      stock: String(caseOnly ? Math.floor(p.stockUnits / p.unitsPerCase) : p.stockUnits),
      lowStockThreshold: String(caseOnly ? Math.floor(p.lowStockThreshold / p.unitsPerCase) : p.lowStockThreshold)
    });
  };

  const saveEdit = async (p: Product) => {
    const caseOnly = isCaseStocked(p.category);
    setSavingId(p.id);
    setRowError(null);
    try {
      const enteredPrice = parseFloat(draft.price) || 0;
      const enteredStock = parseInt(draft.stock, 10) || 0;
      const enteredThreshold = parseInt(draft.lowStockThreshold, 10) || 0;
      // Categories with a real case price (Wine/Beer/RTD/Mixer) store
      // casePrice as a true case total, so a bottle-entered price needs
      // multiplying back up. Spirits have no case concept at all — the
      // entered bottle price is stored directly.
      const nextCasePrice = caseOnly ?
      enteredPrice :
      hasCaseOption(p.category) ?
      Math.round(enteredPrice * p.unitsPerCase) :
      enteredPrice;
      await updateProduct(p.id, {
        casePrice: nextCasePrice,
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
    const caseOnly = isCaseStocked(p.category);
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
    (s, p) => s + (isCaseStocked(p.category) ? p.casePrice * (p.stockUnits / p.unitsPerCase) : bottlePrice(p) * p.stockUnits),
    0
  );
  const lowCount = products.filter((p) => p.stockUnits <= p.lowStockThreshold).
  length;

  return (
    <AdminLayout>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden" />

      <h1 className="font-serif text-4xl font-semibold text-ink">Inventory</h1>
      <p className="mt-1 text-ink/60">
        {products.length} products · stock value {formatCurrency(totalStockValue)}
      </p>
      <p className="mt-1 text-xs text-ink/40">
        Wine &amp; spirits are priced and stocked per bottle · Beer is priced and stocked per case. Hover a product photo to replace it — changes show on the storefront immediately.
      </p>
      {rowError && <p className="mt-3 text-sm font-medium text-red-600">{rowError}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or brand..."
            className="w-full rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

        </div>

        <div className="relative">
          <FilterIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "All")}
            className="appearance-none rounded-full border border-burgundy-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-ink/70 outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200">

            <option value="All">All categories</option>
            {categories.map((c) =>
            <option key={c} value={c}>{c}</option>
            )}
          </select>
        </div>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="appearance-none rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-medium text-ink/70 outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200">

          <option value="All">All brands</option>
          {brands.map((b) =>
          <option key={b} value={b}>{b}</option>
          )}
        </select>

        <div className="flex rounded-full border border-burgundy-200 bg-white p-1 text-sm font-semibold">
          {(["All", "In stock", "Low", "Out"] as StatusFilter[]).map((s) =>
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1.5 transition-colors ${
            status === s ?
            "bg-amber2-500 text-white" :
            "text-ink/60 hover:bg-burgundy-50"}`
            }>

              {s === "Low" ? `Low (${lowCount})` : s}
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="appearance-none rounded-full border border-burgundy-200 bg-white px-4 py-2.5 text-sm font-medium text-ink/70 outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200">

          <option value="name">Sort: Name A-Z</option>
          <option value="stock-asc">Sort: Stock low-high</option>
          <option value="stock-desc">Sort: Stock high-low</option>
          <option value="price-asc">Sort: Price low-high</option>
          <option value="price-desc">Sort: Price high-low</option>
        </select>

        {(query || category !== "All" || brand !== "All" || status !== "All" || sort !== "name") &&
        <button
          onClick={() => {
            setQuery("");
            setCategory("All");
            setBrand("All");
            setStatus("All");
            setSort("name");
          }}
          className="text-sm font-semibold text-burgundy-800 underline underline-offset-2 hover:text-burgundy-900">

            Clear filters
          </button>
        }
      </div>

      <p className="mt-3 text-xs text-ink/40">{rows.length} of {products.length} products shown</p>

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
                const caseOnly = isCaseStocked(p.category);
                const unitLabel = caseOnly ? "case" : "bottle";
                const low = p.stockUnits <= p.lowStockThreshold;
                const out = p.stockUnits === 0;
                const displayPrice = caseOnly ? p.casePrice : bottlePrice(p);
                const displayStock = caseOnly ? Math.floor(p.stockUnits / p.unitsPerCase) : p.stockUnits;
                const displayThreshold = caseOnly ? Math.floor(p.lowStockThreshold / p.unitsPerCase) : p.lowStockThreshold;
                return (
                  <tr key={p.id} className="align-middle hover:bg-cream/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                        type="button"
                        onClick={() => triggerUpload(p.id)}
                        disabled={uploadingId === p.id}
                        aria-label="Change product image"
                        className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream p-1 disabled:cursor-not-allowed">

                          <img src={p.image} alt="" className="h-full w-auto object-contain" />
                          <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/50 group-hover:opacity-100">
                            {uploadingId === p.id ?
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> :

                            <ImageUpIcon className="h-4 w-4 text-white" />
                            }
                          </span>
                        </button>
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
