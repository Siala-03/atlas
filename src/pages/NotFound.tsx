import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, CompassIcon } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function NotFound() {
  return (
    <div className="min-h-screen w-full bg-cream">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <CompassIcon className="mx-auto h-10 w-10 text-burgundy-700" />
        <h1 className="mt-6 font-serif text-4xl font-semibold text-ink">Page not found</h1>
        <p className="mt-3 text-ink/60">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy-800 px-6 py-3 font-semibold text-cream hover:bg-burgundy-900">
          Back to home <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </div>
  );
}
