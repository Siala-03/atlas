import React from "react";
import { Link } from "react-router-dom";
import { UserIcon, ArrowRightIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function Account() {
  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-50 text-burgundy-800">
          <UserIcon className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-serif text-3xl font-semibold text-ink">Accounts are coming soon</h1>
        <p className="mt-3 text-ink/60">
          Sign in and saved order history aren&apos;t live yet. For now, every order is a quick
          guest checkout, no account needed.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">

          Continue shopping <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </div>);

}
