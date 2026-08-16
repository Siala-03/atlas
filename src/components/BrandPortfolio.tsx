import React from "react";
import { Link } from "react-router-dom";

interface BrandLogo {
  name: string;
  image: string;
  to?: string;
}

const BRANDS: BrandLogo[] = [
{ name: "Johnnie Walker", image: "/johnnie walker-brands.jpg", to: "/brands/johnnie-walker" },
{ name: "Hennessy", image: "/hennessy logo.png", to: "/brands/hennessy" },
{ name: "Chivas Regal", image: "/chivas regal logo.jpg", to: "/brands/chivas-regal" },
{ name: "Campari", image: "/campari logo.png", to: "/brands/campari" },
{ name: "KWV", image: "/kwv logo.jpg", to: "/brands/kwv" },
{ name: "Bacardi", image: "/Bacardi-Logo.png", to: "/brands/bacardi" },
{ name: "Four Cousins", image: "/four cousins logo.jpg", to: "/brands/four-cousins" },
{ name: "Tusker", image: "/Tusker logo.png", to: "/brands/tusker" },
{ name: "Bralirwa", image: "/Rwanda-Bralirwa-logo.png", to: "/shop?category=Beer&subtype=Local" }];


const PARTNERS: BrandLogo[] = [
{ name: "Tusker", image: "/Tusker logo.png" },
{ name: "Bralirwa", image: "/Rwanda-Bralirwa-logo.png" }];


function LogoCard({ brand }: { brand: BrandLogo }) {
  const content = (
    <div className="flex h-28 items-center justify-center rounded-2xl border border-burgundy-100 bg-white p-6 transition-all hover:border-burgundy-300 hover:shadow-md">
      <img
        src={brand.image}
        alt={brand.name}
        className="h-full w-full object-contain" />

    </div>);


  if (brand.to) {
    return (
      <Link to={brand.to} className="group">
        {content}
      </Link>);

  }
  return content;
}

export function BrandPortfolio() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Our portfolio</p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">Shop by favorite brands</h2>
        <p className="mt-3 text-ink/60">
          A trusted selection of spirits, wine and beer brands, stocked, genuine and ready to order.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-7">
        {BRANDS.map((brand) =>
        <LogoCard key={brand.name} brand={brand} />
        )}
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber2-600">Who we work with</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Our supply partners</h2>
      </div>

      <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-5">
        {PARTNERS.map((partner) =>
        <LogoCard key={partner.name} brand={partner} />
        )}
      </div>
    </section>);

}
