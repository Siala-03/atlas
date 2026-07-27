import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ClipboardListIcon, PackageOpenIcon } from "lucide-react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { StatusBadge } from "../components/StatusBadge";
import { getCustomerAccountId } from "../lib/customerAuth";
import { formatCurrency, formatDate } from "../lib/format";
import { useStore } from "../store/StoreContext";
import { TradeAccount } from "../types";

export function CustomerOrders() {
  const { orders, getAccount } = useStore();
  const accountId = getCustomerAccountId();
  const [account, setAccount] = useState<TradeAccount | undefined>(undefined);
  const accountOrders = accountId ? orders.filter((order) => order.accountId === accountId) : [];

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    getAccount(accountId).then((result) => { if (!cancelled) setAccount(result); });
    return () => {cancelled = true;};
  }, [accountId, getAccount]);

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Trade account</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-ink">My orders</h1>
            <p className="mt-2 text-ink/60">{account ? `${account.business} · ${account.paymentTerms}` : "Sign in through checkout to view your trade history."}</p>
          </div>
          <Link to="/account" className="text-sm font-semibold text-burgundy-800 hover:text-burgundy-900">Account details</Link>
        </div>

        {!account ?
        <section className="mt-8 rounded-2xl border border-dashed border-burgundy-200 bg-white p-10 text-center">
            <ClipboardListIcon className="mx-auto h-8 w-8 text-burgundy-700" />
            <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">No active trade account</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">Complete a trade order and save your account details to unlock order tracking and quick reorders.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-5 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">Browse catalogue <ArrowRightIcon className="h-4 w-4" /></Link>
          </section> :
        accountOrders.length === 0 ?
        <section className="mt-8 rounded-2xl border border-dashed border-burgundy-200 bg-white p-10 text-center">
            <PackageOpenIcon className="mx-auto h-8 w-8 text-burgundy-700" />
            <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">No orders yet</h2>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-5 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">Place an order <ArrowRightIcon className="h-4 w-4" /></Link>
          </section> :

        <section className="mt-8 overflow-hidden rounded-2xl border border-burgundy-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-left text-sm">
                <thead className="border-b border-burgundy-100 bg-cream/60 text-xs uppercase tracking-wider text-ink/50"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Placed</th><th className="px-5 py-3">Delivery</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr></thead>
                <tbody className="divide-y divide-burgundy-50">
                  {accountOrders.map((order) =>
                <tr key={order.id} className="hover:bg-cream/50">
                      <td className="px-5 py-4"><Link to={`/my-orders/${order.id}`} className="font-semibold text-burgundy-800 hover:underline">{order.reference}</Link></td>
                      <td className="px-5 py-4 text-ink/65">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4 text-ink/65">{order.deliveryDate ? formatDate(order.deliveryDate) : "To confirm"}</td>
                      <td className="px-5 py-4 font-semibold">{formatCurrency(order.total)}</td>
                      <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </section>
        }
      </main>
      <Footer />
    </div>);

}