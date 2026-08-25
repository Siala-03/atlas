import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon, LogOutIcon, PackageIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StatusBadge } from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../lib/format";
import { api } from "../lib/api";
import { endCustomerSession, getCustomerProfile, getCustomerToken, startCustomerSession } from "../lib/customerAuth";
import { Order } from "../types";

export function Account() {
  const [profile, setProfile] = useState(getCustomerProfile());
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!profile || !getCustomerToken()) return;
    setLoadingOrders(true);
    api.getMyOrders().
    then(setOrders).
    catch(() => undefined).
    finally(() => setLoadingOrders(false));
  }, [profile]);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = mode === "signup" ?
      await api.customerSignup({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined }) :
      await api.customerLogin(form.email, form.password);
      startCustomerSession(result.token, result.customer);
      setProfile(result.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = () => {
    endCustomerSession();
    setProfile(null);
    setOrders([]);
  };

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-cream">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-50 text-burgundy-800">
            <UserIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center font-serif text-3xl font-semibold text-ink">
            {mode === "login" ? "Sign in" : "Create an account"}
          </h1>
          <p className="mt-2 text-center text-sm text-ink/60">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="font-semibold text-burgundy-800 underline underline-offset-2">
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-burgundy-100 bg-white p-6">
            {mode === "signup" &&
            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Full name</label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />
              </div>
            }
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Email</label>
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />
            </div>
            {mode === "signup" &&
            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Phone (optional)</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />
              </div>
            }
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Password</label>
              <input required type="password" minLength={4} value={form.password} onChange={(e) => set("password", e.target.value)} className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full rounded-full bg-burgundy-800 py-3.5 text-sm font-semibold text-cream hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/50">
            Prefer not to sign up? <Link to="/shop" className="font-semibold text-burgundy-800 underline underline-offset-2">Continue as guest</Link>
          </p>
        </div>
        <Footer />
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-burgundy-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-50 text-burgundy-800">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-xl font-semibold text-ink">{profile.name}</p>
              <p className="text-sm text-ink/60">{profile.email}</p>
            </div>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-burgundy-200 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-burgundy-50">
            <LogOutIcon className="h-4 w-4" /> Sign out
          </button>
        </div>

        <h2 className="mt-8 font-serif text-2xl font-semibold text-ink">My orders</h2>
        {loadingOrders ?
        <p className="mt-3 text-sm text-ink/50">Loading…</p> :
        orders.length === 0 ?
        <div className="mt-3 rounded-2xl border border-burgundy-100 bg-white p-8 text-center">
            <PackageIcon className="mx-auto h-8 w-8 text-ink/30" />
            <p className="mt-3 text-sm text-ink/60">No orders yet.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-burgundy-800 underline underline-offset-2">Browse the catalogue</Link>
          </div> :

        <div className="mt-3 divide-y divide-burgundy-50 overflow-hidden rounded-2xl border border-burgundy-100 bg-white">
            {orders.map((order) =>
          <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold text-ink">{order.reference}</p>
                  <p className="text-xs text-ink/50">{formatDate(order.createdAt)} · {order.lines.length} item{order.lines.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-ink">{formatCurrency(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
          )}
          </div>
        }
      </div>
      <Footer />
    </div>);

}
