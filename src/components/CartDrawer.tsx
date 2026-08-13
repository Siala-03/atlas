import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon, XIcon } from "lucide-react";
import { useStore, VAT_RATE } from "../store/StoreContext";
import { formatCurrency } from "../lib/format";
import { unitPrice } from "../types";
import { hasCaseOption } from "../lib/productRules";

export function CartDrawer() {
  const { cart, getProduct, updateCartQty, removeFromCart, cartSubtotal, isCartOpen, closeCart } = useStore();
  const navigate = useNavigate();

  const vat = cartSubtotal * VAT_RATE;
  const total = cartSubtotal + vat;

  const goTo = (path: string) => {
    closeCart();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isCartOpen &&
      <>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 z-50 bg-burgundy-950/50 backdrop-blur-sm" />


          <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl">

            <div className="flex items-center justify-between border-b border-burgundy-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
                <ShoppingBagIcon className="h-5 w-5" /> Your order
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-2 text-ink/50 hover:bg-burgundy-50 hover:text-ink">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ?
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBagIcon className="h-10 w-10 text-ink/20" />
                <p className="text-ink/60">Your order is empty.</p>
                <button
              onClick={() => goTo("/shop")}
              className="mt-2 rounded-full bg-burgundy-800 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-burgundy-900">

                  Browse catalogue
                </button>
              </div> :

          <>
                <div className="thin-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {cart.map((item) => {
                const p = getProduct(item.productId);
                if (!p) return null;
                const isBusiness = hasCaseOption(p.category) && item.mode === "business";
                const price = isBusiness ? p.casePrice : unitPrice(p);
                return (
                  <div key={`${item.productId}-${item.mode}`} className="flex gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
                          <img src={p.image} alt={p.name} className="h-full w-auto object-contain" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold leading-tight text-ink">{p.name}</p>
                            <button
                          onClick={() => removeFromCart(p.id, item.mode)}
                          aria-label="Remove"
                          className="shrink-0 text-ink/30 hover:text-red-600">

                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-ink/50">{formatCurrency(price)}/{isBusiness ? "case" : hasCaseOption(p.category) ? "piece" : "bottle"}</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-burgundy-200">
                              <button
                            onClick={() => updateCartQty(p.id, item.mode, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-l-full text-burgundy-800 hover:bg-burgundy-50"
                            aria-label="Decrease">

                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                              <button
                            onClick={() => updateCartQty(p.id, item.mode, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-r-full text-burgundy-800 hover:bg-burgundy-50"
                            aria-label="Increase">

                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-burgundy-800">{formatCurrency(price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>);

              })}
                </div>

                <div className="border-t border-burgundy-100 px-5 py-4">
                  <div className="flex justify-between text-sm text-ink/60">
                    <span>Subtotal</span>
                    <span className="font-medium text-ink">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm text-ink/60">
                    <span>VAT ({Math.round(VAT_RATE * 100)}%)</span>
                    <span className="font-medium text-ink">{formatCurrency(vat)}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-burgundy-100 pt-2 font-serif text-lg font-semibold text-ink">
                    <span>Total</span>
                    <span className="text-burgundy-800">{formatCurrency(total)}</span>
                  </div>
                  <button
                onClick={() => goTo("/checkout")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-3.5 font-semibold text-cream transition-colors hover:bg-burgundy-900">

                    Checkout <ArrowRightIcon className="h-4 w-4" />
                  </button>
                  <Link
                to="/cart"
                onClick={closeCart}
                className="mt-2 block text-center text-sm font-medium text-burgundy-800 hover:text-burgundy-900">

                    View full cart
                  </Link>
                </div>
              </>
          }
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}
