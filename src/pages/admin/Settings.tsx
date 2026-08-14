import React, { useState } from "react";
import { KeyRoundIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { api, ApiError } from "../../lib/api";

export function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.changePortalPassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not change password. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-4xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-ink/60">Change the password used to sign in to this operations area.</p>

      <div className="mt-6 max-w-md rounded-2xl border border-burgundy-100 bg-white p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-burgundy-50 text-burgundy-800">
          <KeyRoundIcon className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-serif text-xl font-semibold text-ink">Change password</h2>
        <p className="mt-1 text-sm text-ink/60">
          Everyone with portal access uses this one password, so changing it signs out anyone who doesn't know the new one.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium text-ink/70">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

          </div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-ink/70">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-ink/70">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {success && <p className="text-sm font-medium text-emerald-600">Password changed.</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-burgundy-800 py-3 text-sm font-semibold text-cream transition-colors hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:bg-burgundy-800/60">

            {submitting ? "Saving…" : "Save new password"}
          </button>
        </form>
      </div>
    </AdminLayout>);

}
