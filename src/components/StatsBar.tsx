import React from "react";
import { LayersIcon, MapPinIcon, BanknoteIcon, TagsIcon } from "lucide-react";

interface StatsBarProps {
  productCount: number;
  categoryCount: number;
}

export function StatsBar({ productCount, categoryCount }: StatsBarProps) {
  const stats = [
  { icon: LayersIcon, value: String(productCount), label: "Labels in stock" },
  { icon: TagsIcon, value: String(categoryCount), label: "Categories" },
  { icon: BanknoteIcon, value: "RWF", label: "Trade pricing" },
  { icon: MapPinIcon, value: "Kigali", label: "Based delivery" }];


  return (
    <section className="border-b border-burgundy-100 bg-burgundy-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) =>
        <div key={stat.label} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream/10 text-amber2-300">
              <stat.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-xl font-semibold text-cream">{stat.value}</p>
              <p className="text-xs text-cream/60">{stat.label}</p>
            </div>
          </div>
        )}
      </div>
    </section>);

}
