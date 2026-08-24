import React, { useEffect, useState } from "react";
import { KeyRoundIcon, UsersIcon, TrashIcon, PlusIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { api, ApiError } from "../../lib/api";
import { StaffUser, AdminRole } from "../../types";

function ChangePasswordCard() {
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
    <div className="max-w-md rounded-2xl border border-burgundy-100 bg-white p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-burgundy-50 text-burgundy-800">
        <KeyRoundIcon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">Owner password</h2>
      <p className="mt-1 text-sm text-ink/60">
        This is the single owner login (no email). Changing it doesn't affect staff accounts below.
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
    </div>);

}

function TeamCard() {
  const [team, setTeam] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("staff");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.getTeam().then(setTeam).catch(() => undefined).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || password.length < 4) {
      setError("Fill in a name, email, and a password of at least 4 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await api.addTeamMember({ name: name.trim(), email: email.trim(), password, role });
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await api.removeTeamMember(id);
      load();
    } catch {
      // no-op — the row just stays, they can retry
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-md rounded-2xl border border-burgundy-100 bg-white p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-burgundy-50 text-burgundy-800">
        <UsersIcon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-ink">Team</h2>
      <p className="mt-1 text-sm text-ink/60">
        Staff can view and process orders. Admins also get inventory, prices, and settings.
      </p>

      {!loading && team.length > 0 &&
      <ul className="mt-4 space-y-2">
          {team.map((member) =>
        <li key={member.id} className="flex items-center justify-between gap-3 rounded-xl border border-burgundy-100 px-3 py-2.5 text-sm">
              <div>
                <p className="font-medium text-ink">{member.name}</p>
                <p className="text-xs text-ink/50">{member.email} · {member.role === "admin" ? "Admin" : "Staff"}</p>
              </div>
              <button
            type="button"
            onClick={() => handleRemove(member.id)}
            disabled={removingId === member.id}
            aria-label={`Remove ${member.name}`}
            className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60">

                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
        )}
        </ul>
      }

      <form onSubmit={handleAdd} className="mt-5 space-y-3 border-t border-burgundy-100 pt-5" noValidate>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Temporary password"
          className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200" />

        <select
          value={role}
          onChange={(event) => setRole(event.target.value as AdminRole)}
          className="w-full rounded-xl border border-burgundy-200 px-4 py-2.5 text-sm outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200">

          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-3 text-sm font-semibold text-cream transition-colors hover:bg-burgundy-900 disabled:cursor-not-allowed disabled:bg-burgundy-800/60">

          <PlusIcon className="h-4 w-4" />
          {submitting ? "Adding…" : "Add team member"}
        </button>
      </form>
    </div>);

}

export function Settings() {
  return (
    <AdminLayout>
      <h1 className="font-serif text-4xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-ink/60">Manage sign-in access to this operations area.</p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <ChangePasswordCard />
        <TeamCard />
      </div>
    </AdminLayout>);

}
