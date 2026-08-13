import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrashIcon, MinusIcon, PlusIcon, ArrowRightIcon, SmartphoneIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductStrip } from "../components/ProductStrip";
import { useStore, VAT_RATE } from "../store/StoreContext";
import { formatCurrency } from "../lib/format";
import { buildMomoUssdLink } from "../lib/momo";
import { unitPrice } from "../types";
import { hasCaseOption } from "../lib/productRules";

export function Cart() {
  const { cart, products, getProduct, updateCartQty, removeFromCart, cartSubtotal } =
  useStore();

  const vat = cartSubtotal * VAT_RATE;
  const total = cartSubtotal + vat;

  const crossSell = useMemo(() => {
    const cartCategories = new Set(
      cart.map((item) => getProduct(item.productId)?.category).filter(Boolean)
    );
    const cartIds = new Set(cart.map((item) => item.productId));
    return products.filter((p) => cartCategories.has(p.category) && !cartIds.has(p.id)).slice(0, 4);
  }, [cart, products, getProduct]);

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-semibold text-ink">Your Order</h1>

        {cart.length === 0 ?
        <div className="mt-10 rounded-2xl border border-dashed border-burgundy-200 bg-white py-20 text-center">
            <p className="font-serif text-2xl text-ink">Your order is empty</p>
            <p className="mt-2 text-ink/60">Browse the catalogue to start building an order.</p>
            <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-6 py-3 font-semibold text-cream hover:bg-burgundy-900">
            
              Browse catalogue <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div> :

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => {
              const p = getProduct(item.productId);
              if (!p) return null;
              const isBusiness = hasCaseOption(p.category) && item.mode === "business";
              const price = isBusiness ? p.casePrice : unitPrice(p);
              const unitLabel = isBusiness ? "case" : hasCaseOption(p.category) ? "piece" : "bottle";
              return (
                <div
                  key={`${item.productId}-${item.mode}`}
                  className="flex gap-4 rounded-2xl border border-burgundy-100 bg-white p-4">

                    <Link
                    to={`/product/${p.id}`}
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-cream p-2">

                      <img src={p.image} alt={p.name} className="h-full w-auto object-contain" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-amber2-600">
                            {p.brand}
                          </p>
                          <Link
                          to={`/product/${p.id}`}
                          className="font-serif text-lg font-semibold text-ink hover:text-burgundy-800">

                            {p.name}
                          </Link>
                          <p className="text-xs text-ink/50">
                            {formatCurrency(price)}/{unitLabel}{isBusiness ? ` · ${p.unitsPerCase} per case` : ""}
                          </p>
                        </div>
                        <button
                        onClick={() => removeFromCart(p.id, item.mode)}
                        className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove">

                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-burgundy-200">
                            <button
                            onClick={() => updateCartQty(p.id, item.mode, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-l-full text-burgundy-800 hover:bg-burgundy-50"
                            aria-label="Decrease">

                              <MinusIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                            onClick={() => updateCartQty(p.id, item.mode, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-r-full text-burgundy-800 hover:bg-burgundy-50"
                            aria-label="Increase">

                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-xs uppercase tracking-wide text-ink/40">{unitLabel}{item.quantity > 1 ? "s" : ""}</span>
                        </div>
                        <p className="font-serif text-xl font-semibold text-burgundy-800">
                          {formatCurrency(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>);

            })}
            </div>

            <div className="h-fit rounded-2xl border border-burgundy-100 bg-white p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-2xl font-semibold text-ink">Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Subtotal</dt>
                  <dd className="font-medium">{formatCurrency(cartSubtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">VAT ({Math.round(VAT_RATE * 100)}%)</dt>
                  <dd className="font-medium">{formatCurrency(vat)}</dd>
                </div>
                <div className="flex justify-between border-t border-burgundy-100 pt-3">
                  <dt className="font-serif text-lg font-semibold text-ink">Total</dt>
                  <dd className="font-serif text-lg font-semibold text-burgundy-800">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
              <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-4 font-semibold text-cream transition-colors hover:bg-burgundy-900">
              
                Proceed to checkout <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
              href={buildMomoUssdLink(total)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-burgundy-800 py-4 font-semibold text-burgundy-800 transition-colors hover:bg-burgundy-50">

                <SmartphoneIcon className="h-5 w-5" /> Pay {formatCurrency(total)} with MTN MoMo
              </a>
              <p className="mt-3 text-center text-xs text-ink/50">
                MoMo opens your phone dialer with the code pre-filled — tap call to confirm. Delivery scheduled after order confirmation.
              </p>
            </div>
          </div>
        }
      </div>
      <ProductStrip title="You might also want" products={crossSell} />
      <Footer />
    </div>);

}