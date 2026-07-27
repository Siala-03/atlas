import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: {items: BreadcrumbItem[];}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
      {items.map((item, index) =>
      <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRightIcon className="h-3.5 w-3.5 text-ink/30" />}
          {item.to ?
          <Link to={item.to} className="hover:text-burgundy-800">{item.label}</Link> :

          <span className="text-ink/70">{item.label}</span>
          }
        </span>
      )}
    </nav>);

}
