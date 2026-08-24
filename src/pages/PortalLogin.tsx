import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRightIcon, LockKeyholeIcon, ShieldCheckIcon } from "lucide-react";
import { Logo } from "../components/Logo";
import { startPortalSession } from "../lib/portalAuth";
import { api, ApiError } from "../lib/api";

interface LocationState {
  from?: string;
}

export function PortalLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isStaff, setIsStaff] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim() || (isStaff && !email.trim())) {
      setError(isStaff ? "Enter your email and password." : "Enter your operations password.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { token, role, name } = await api.portalLogin(password, isStaff ? email : undefined);
      startPortalSession(token, role, name);
      const state = location.state as LocationState | null;
      navigate(state?.from ?? "/portal", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401 ?
        isStaff ? "Incorrect email or password." : "Incorrect password." :
        "Could not sign in. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-burgundy-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-cream p-4 shadow-2xl shadow-black/20">
          <Logo className="h-11" />
        </div>

        <section className="mt-5 rounded-3xl border border-cream/10 bg-white p-7 shadow-2xl shadow-black/20 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy-50 text-burgundy-800">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-amber2-600">
            Private workspace
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">
            Atlas Operations
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Sign in to manage incoming orders, fulfilment and warehouse stock.
          </p>

          <div className="mt-6 flex rounded-full border border-burgundy-200 bg-burgundy-50/50 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setIsStaff(false)}
              className={`flex-1 rounded-full py-2 transition-colors ${!isStaff ? "bg-burgundy-800 text-cream" : "text-ink/60"}`}>

              Owner
            </button>
            <button
              type="button"
              onClick={() => setIsStaff(true)}
              className={`flex-1 rounded-full py-2 transition-colors ${isStaff ? "bg-burgundy-800 text-cream" : "text-ink/60"}`}>

              Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            {isStaff &&
            <div>
                <label htmlFor="portal-email" className="mb-1.5 block text-sm font-medium text-ink/70">
                  Email
                </label>
                <input
                id="portal-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none transition focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100"
                placeholder="you@atlassupplies.rw" />

              </div>
            }
            <div>
              <label htmlFor="portal-password" className="mb-1.5 block text-sm font-medium text-ink/70">
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-burgundy-200 px-4 py-3 text-sm outline-none transition focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100"
                placeholder="••••••••" />

            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-3.5 font-semibold text-cream transition-colors hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:bg-burgundy-800/60">

              <LockKeyholeIcon className="h-4 w-4" />
              {submitting ? "Signing in…" : "Sign in to operations"}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-cream/55">
          Atlas Supplies Ltd · Internal systems access only
        </p>
      </div>
    </main>);

}
