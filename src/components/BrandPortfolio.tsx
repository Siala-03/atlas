import React from "react";
import { Link } from "react-router-dom";
import { slugify } from "../lib/slug";

interface BrandLogo {
  name: string;
  image: string;
  inCatalogue?: boolean;
}

const BRANDS: BrandLogo[] = [
{ name: "Johnnie Walker", image: "/johnnie walker-brands.jpg", inCatalogue: true },
{ name: "Hennessy", image: "/hennessy logo.png", inCatalogue: true },
{ name: "Chivas Regal", image: "/chivas regal logo.jpg", inCatalogue: true },
{ name: "Campari", image: "/campari logo.png", inCatalogue: true },
{ name: "KWV", image: "/kwv logo.jpg", inCatalogue: true },
{ name: "Bacardi", image: "/Bacardi-Logo.png" },
{ name: "Four Cousins", image: "/four cousins logo.jpg" }];


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


  if (brand.inCatalogue) {
    return (
      <Link to={`/brands/${slugify(brand.name)}`} className="group">
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
        <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">Brands we supply</h2>
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
