import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2Icon, LogOutIcon, ShieldCheckIcon } from "lucide-react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { endCustomerSession, getCustomerAccountId } from "../lib/customerAuth";
import { CheckoutDetails, useStore } from "../store/StoreContext";
import { TradeAccount } from "../types";

export function AccountSettings() {
  const { getAccount, saveTradeAccount } = useStore();
  const navigate = useNavigate();
  const accountId = getCustomerAccountId();
  const [account, setAccount] = useState<TradeAccount | undefined>(undefined);
  const [loadingAccount, setLoadingAccount] = useState(!!accountId);
  const [form, setForm] = useState<CheckoutDetails>({ business: "", contactName: "", email: "", phone: "", licenseNo: "", deliveryAddress: "", deliveryDate: "", notes: "" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutDetails, boolean>>>({});
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^[+\d][\d\s()-]{6,}$/;

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    getAccount(accountId).
    then((result) => {
      if (cancelled) return;
      setAccount(result);
      if (result) {
        setForm({ business: result.business, contactName: result.contactName, email: result.email, phone: result.phone, licenseNo: result.licenseNo, deliveryAddress: result.deliveryAddress, deliveryDate: "", notes: "" });
      }
    }).
    finally(() => { if (!cancelled) setLoadingAccount(false); });
    return () => {cancelled = true;};
  }, [accountId, getAccount]);

  if (loadingAccount) {
    return <div className="min-h-screen w-full bg-cream"><Navbar /><main className="mx-auto max-w-3xl px-4 py-28 text-center"><p className="text-ink/60">Loading account…</p></main><Footer /></div>;
  }

  if (!account || !accountId) {
    return <div className="min-h-screen w-full bg-cream"><Navbar /><main className="mx-auto max-w-3xl px-4 py-28 text-center"><h1 className="font-serif text-3xl text-ink">No active trade account</h1><p className="mt-2 text-ink/60">Save your account details at checkout to manage your profile and order history here.</p><Link to="/shop" className="mt-6 inline-block rounded-full bg-burgundy-800 px-5 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">Browse catalogue</Link></main><Footer /></div>;
  }

  const set = (key: keyof CheckoutDetails, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof CheckoutDetails, boolean>> = {};
    if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = true;
    if (!PHONE_PATTERN.test(form.phone.trim())) nextErrors.phone = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSaving(true);
    setSubmitError("");
    try {
      const updated = await saveTradeAccount(form, accountId);
      setAccount(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save account changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cream"><Navbar /><main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Trade account</p><h1 className="mt-2 font-serif text-4xl font-semibold text-ink">Account details</h1><p className="mt-2 text-ink/60">Keep your buying and delivery details current for faster ordering.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3"><form onSubmit={submit} className="rounded-2xl border border-burgundy-100 bg-white p-6 lg:col-span-2"><div className="grid gap-5 sm:grid-cols-2">{([['business', 'Business name'], ['contactName', 'Contact name'], ['email', 'Email'], ['phone', 'Phone'], ['licenseNo', 'Trading licence no.']] as [keyof CheckoutDetails, string][]).map(([key, label]) => <div key={key}><label className="mb-1.5 block text-sm font-medium text-ink/70">{label}</label><input type={key === 'email' ? 'email' : 'text'} value={form[key]} onChange={(event) => set(key, event.target.value)} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-burgundy-200 ${errors[key] ? 'border-red-400' : 'border-burgundy-200 focus:border-burgundy-500'}`} />{errors[key] && <p className="mt-1 text-xs text-red-600">{key === 'email' ? 'Enter a valid email address' : 'Enter a valid phone number'}</p>}</div>)}</div><div className="mt-5"><label className="mb-1.5 block text-sm font-medium text-ink/70">Default delivery address</label><textarea rows={3} value={form.deliveryAddress} onChange={(event) => set('deliveryAddress', event.target.value)} className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" /></div>{submitError && <p className="mt-4 text-sm font-medium text-red-600">{submitError}</p>}<button disabled={saving} className="mt-6 rounded-full bg-burgundy-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving…" : "Save account changes"}</button>{saved && <span className="ml-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700"><CheckCircle2Icon className="h-4 w-4" /> Saved</span>}</form>
      <aside className="space-y-5"><section className="rounded-2xl border border-burgundy-100 bg-white p-6"><ShieldCheckIcon className="h-5 w-5 text-burgundy-700" /><h2 className="mt-3 font-serif text-2xl font-semibold text-ink">Verification</h2><p className="mt-2 text-sm text-ink/60">Your account is <span className="font-semibold text-amber2-800">{account.verificationStatus}</span>. {account.verificationStatus === 'Pending review' && 'Atlas will confirm your trade licence before completing a first order.'}</p></section><Link to="/my-orders" className="block rounded-2xl bg-burgundy-50 p-5 text-sm font-semibold text-burgundy-800 hover:bg-burgundy-100">View my order history →</Link><button onClick={() => {endCustomerSession();navigate('/');}} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-burgundy-800"><LogOutIcon className="h-4 w-4" /> Sign out of trade account</button></aside></div>
    </main><Footer /></div>);

}
