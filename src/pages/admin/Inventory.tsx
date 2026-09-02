import React, { useMemo, useRef, useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  PencilIcon,
  FilterIcon,
  ImageUpIcon,
  EyeIcon,
  EyeOffIcon } from
"lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { useStore } from "../../store/StoreContext";
import { formatCurrency } from "../../lib/format";
import { Category, Product, Subtype } from "../../types";
import { bottlePrice, isCaseStocked } from "../../lib/productRules";

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

const ALL_CATEGORIES: Category[] = [
"Whisky", "Vodka", "Wine", "Beer", "Gin", "Rum",
"Cognac", "Liqueur", "Tequila", "Aperitif", "Bitters", "RTD", "Mixer"];

const SUBTYPE_OPTIONS: Partial<Record<Category, string[]>> = {
  Wine: ["Red", "White", "Rose", "Sparkling"],
  Beer: ["Imported", "Local"]
};

type StatusFilter = "All" | "In stock" | "Low" | "Out";
type SortKey = "name" | "stock-asc" | "stock-desc" | "price-asc" | "price-desc";

interface ProductDraft {
  name: string;
  brand: string;
  category: Category;
  subtype: string;
  abv: string;
  volume: string;
  unitsPerCase: string;
  origin: string;
  description: string;
  piecePrice: string;
  casePrice: string;
  stock: string;
  lowStockThreshold: string;
  image: string;
}

function draftFromProduct(p: Product): ProductDraft {
  const caseOnly = isCaseStocked(p.category);
  return {
    name: p.name,
    brand: p.brand,
    category: p.category,
    subtype: p.subtype ?? "",
    abv: String(p.abv),
    volume: p.volume,
    unitsPerCase: String(p.unitsPerCase),
    origin: p.origin,
    description: p.description,
    piecePrice: String(p.unitPrice),
    casePrice: String(p.casePrice),
    stock: String(caseOnly ? Math.floor(p.stockUnits / p.unitsPerCase) : p.stockUnits),
    lowStockThreshold: String(caseOnly ? Math.floor(p.lowStockThreshold / p.unitsPerCase) : p.lowStockThreshold),
    image: p.image
  };
}

const BLANK_DRAFT: ProductDraft = {
  name: "",
  brand: "",
  category: "Whisky",
  subtype: "",
  abv: "",
  volume: "",
  unitsPerCase: "12",
  origin: "",
  description: "",
  piecePrice: "",
  casePrice: "",
  stock: "",
  lowStockThreshold: "",
  image: ""
};

function draftToFields(draft: ProductDraft) {
  const unitsPerCase = parseInt(draft.unitsPerCase, 10) || 1;
  const caseOnly = isCaseStocked(draft.category);
  const enteredStock = parseInt(draft.stock, 10) || 0;
  const enteredThreshold = parseInt(draft.lowStockThreshold, 10) || 0;
  return {
    name: draft.name.trim(),
    brand: draft.brand.trim(),
    category: draft.category,
    subtype: draft.subtype ? draft.subtype as Subtype : undefined,
    abv: parseFloat(draft.abv) || 0,
    volume: draft.volume.trim(),
    unitsPerCase,
    origin: draft.origin.trim(),
    description: draft.description.trim(),
    unitPrice: parseFloat(draft.piecePrice) || 0,
    casePrice: parseFloat(draft.casePrice) || 0,
    stockUnits: caseOnly ? enteredStock * unitsPerCase : enteredStock,
    lowStockThreshold: caseOnly ? enteredThreshold * unitsPerCase : enteredThreshold,
    image: draft.image
  };
}

function ProductFormModal({
  mode,
  draft,
  setDraft,
  saving,
  error,
  onSave,
  onClose



}: {mode: "create" | "edit";draft: ProductDraft;setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;saving: boolean;error: string | null;onSave: () => void;onClose: () => void;}) {
  const subtypes = SUBTYPE_OPTIONS[draft.category];
  const caseOnly = isCaseStocked(draft.category);
  const stockUnit = caseOnly ? "case" : "bottle";
  const field = (key: keyof ProductDraft, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImageUploading(true);
    setImageError(null);
    try {
      const dataUrl = await resizeImageFile(file);
      setDraft((d) => ({ ...d, image: dataUrl }));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Could not read image.");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4">
      <div className="thin-scroll max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">{mode === "create" ? "Add product" : "Edit product"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-cream" aria-label="Close"><XIcon className="h-5 w-5" /></button>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        {imageError && <p className="mt-3 text-sm font-medium text-red-600">{imageError}</p>}

        <div className="mt-4 flex items-center gap-4">
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream p-1">
            {draft.image ?
            <img src={draft.image} alt="" className="h-full w-full object-contain" /> :

            <ImageUpIcon className="h-6 w-6 text-ink/30" />
            }
          </div>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={imageUploading}
            className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 px-4 py-2 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-60">

            <ImageUpIcon className="h-4 w-4" /> {imageUploading ? "Uploading…" : draft.image ? "Change photo" : "Upload photo"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-ink/60">Name</label>
            <input value={draft.name} onChange={(e) => field("name", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Brand</label>
            <input value={draft.brand} onChange={(e) => field("brand", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Origin</label>
            <input value={draft.origin} onChange={(e) => field("origin", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Category</label>
            <select value={draft.category} onChange={(e) => field("category", e.target.value)} className="w-full rounded-lg border border-burgundy-200 bg-white px-3 py-2 text-sm outline-none focus:border-burgundy-500">
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Subtype</label>
            <select value={draft.subtype} onChange={(e) => field("subtype", e.target.value)} disabled={!subtypes} className="w-full rounded-lg border border-burgundy-200 bg-white px-3 py-2 text-sm outline-none focus:border-burgundy-500 disabled:bg-cream disabled:text-ink/40">
              <option value="">None</option>
              {subtypes?.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">ABV %</label>
            <input value={draft.abv} onChange={(e) => field("abv", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Volume (e.g. 750ml)</label>
            <input value={draft.volume} onChange={(e) => field("volume", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Units per case</label>
            <input value={draft.unitsPerCase} onChange={(e) => field("unitsPerCase", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-ink/60">Description</label>
            <textarea rows={3} value={draft.description} onChange={(e) => field("description", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Price / piece (RWF)</label>
            <input value={draft.piecePrice} onChange={(e) => field("piecePrice", e.target.value)} placeholder="For individual buyers" className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Price / case ({draft.unitsPerCase || "?"} pcs, RWF)</label>
            <input value={draft.casePrice} onChange={(e) => field("casePrice", e.target.value)} placeholder="For business buyers" className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Stock ({stockUnit}s)</label>
            <input value={draft.stock} onChange={(e) => field("stock", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Low stock at ({stockUnit}s)</label>
            <input value={draft.lowStockThreshold} onChange={(e) => field("lowStockThreshold", e.target.value)} className="w-full rounded-lg border border-burgundy-200 px-3 py-2 text-sm outline-none focus:border-burgundy-500" />
          </div>
        </div>
        <p className="mt-2 text-xs text-ink/40">Piece price applies to individual-account checkout; case price applies to business-account checkout. They don&apos;t have to be a flat multiple of each other.</p>

        <div className="mt-5 flex gap-2">
          <button onClick={onSave} disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-burgundy-800 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:opacity-60">
            <CheckIcon className="h-4 w-4" /> {saving ? "Saving…" : mode === "create" ? "Add product" : "Save changes"}
          </button>
          <button onClick={onClose} disabled={saving} className="rounded-full border border-burgundy-200 px-4 py-2.5 text-sm font-semibold text-ink/60 hover:bg-burgundy-50">Cancel</button>
        </div>
      </div>
    </div>);

}

export function Inventory() {
  const { products, updateProduct, createProduct, restockProduct } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [brand, setBrand] = useState<string>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortKey>("name");
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetId = useRef<string | null>(null);

  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [formTargetId, setFormTargetId] = useState<string | null>(null);
  const [formDraft, setFormDraft] = useState<ProductDraft>(BLANK_DRAFT);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const openCreate = () => {
    setFormMode("create");
    setFormTargetId(null);
    setFormDraft(BLANK_DRAFT);
    setFormError(null);
  };

  const openEdit = (p: Product) => {
    setFormMode("edit");
    setFormTargetId(p.id);
    setFormDraft(draftFromProduct(p));
    setFormError(null);
  };

  const closeForm = () => {
    if (formSaving) return;
    setFormMode(null);
    setFormTargetId(null);
  };

  const saveForm = async () => {
    setFormSaving(true);
    setFormError(null);
    try {
      const fields = draftToFields(formDraft);
      if (!fields.name || !fields.brand) throw new Error("Name and brand are required.");
      if (formMode === "create") {
        await createProduct({ ...fields, image: fields.image || "/products/placeholder.jpg" });
      } else if (formTargetId) {
        await updateProduct(formTargetId, fields);
      }
      setFormMode(null);
      setFormTargetId(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setFormSaving(false);
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

  const togglePublish = async (p: Product) => {
    setTogglingId(p.id);
    setRowError(null);
    try {
      await updateProduct(p.id, { published: p.published === false });
    } catch (error) {
      setRowError(error instanceof Error ? error.message : "Could not update product.");
    } finally {
      setTogglingId(null);
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

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-ink">Inventory</h1>
          <p className="mt-1 text-ink/60">
            {products.length} products · stock value {formatCurrency(totalStockValue)}
          </p>
          <p className="mt-1 text-xs text-ink/40">
            Every product has an independent piece price (individual accounts) and case price (business accounts) · Beer is stocked and restocked by the case, everything else by the piece. Hover a product photo to replace it — changes show on the storefront immediately.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-burgundy-900">

          <PlusIcon className="h-4 w-4" /> Add product
        </button>
      </div>
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
                const caseOnly = isCaseStocked(p.category);
                const unitLabel = caseOnly ? "case" : "bottle";
                const low = p.stockUnits <= p.lowStockThreshold;
                const out = p.stockUnits === 0;
                const displayStock = caseOnly ? Math.floor(p.stockUnits / p.unitsPerCase) : p.stockUnits;
                const displayThreshold = caseOnly ? Math.floor(p.lowStockThreshold / p.unitsPerCase) : p.lowStockThreshold;
                const unpublished = p.published === false;
                return (
                  <tr key={p.id} className={`align-middle hover:bg-cream/50 ${unpublished ? "opacity-50" : ""}`}>
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
                    <td className="px-5 py-4 text-ink/70">{p.category}{p.subtype ? ` · ${p.subtype}` : ""}</td>
                    <td className="px-5 py-4">
                      <p><span className="font-medium">{formatCurrency(bottlePrice(p))}</span><span className="ml-1 text-xs text-ink/40">/piece</span></p>
                      <p className="mt-0.5"><span className="font-medium">{formatCurrency(p.casePrice)}</span><span className="ml-1 text-xs text-ink/40">/case</span></p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium">{displayStock}</span>
                      <span className="ml-1 text-xs text-ink/40">{unitLabel}{displayStock === 1 ? "" : "s"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-ink/60">{displayThreshold} {unitLabel}{displayThreshold === 1 ? "" : "s"}</span>
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
                      {unpublished &&
                      <span className="ml-1.5 inline-flex rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink/60">
                          Unpublished
                        </span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => restock(p)}
                          disabled={restockingId === p.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-burgundy-200 px-2.5 py-2 text-xs font-semibold text-burgundy-800 hover:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-60">

                          <PlusIcon className="h-3.5 w-3.5" /> {caseOnly ? "+12 cases" : `+${p.unitsPerCase} bottles`}
                        </button>
                        <button
                          onClick={() => togglePublish(p)}
                          disabled={togglingId === p.id}
                          aria-label={unpublished ? "Publish" : "Unpublish"}
                          title={unpublished ? "Publish to storefront" : "Unpublish from storefront"}
                          className="rounded-lg border border-burgundy-200 p-2 text-ink/60 hover:bg-burgundy-50 disabled:cursor-not-allowed disabled:opacity-60">

                          {unpublished ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg border border-burgundy-200 p-2 text-ink/60 hover:bg-burgundy-50"
                          aria-label="Edit">

                          <PencilIcon className="h-4 w-4" />
                        </button>
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

      {formMode &&
      <ProductFormModal
        mode={formMode}
        draft={formDraft}
        setDraft={setFormDraft}
        saving={formSaving}
        error={formError}
        onSave={saveForm}
        onClose={closeForm} />

      }
    </AdminLayout>);

}
