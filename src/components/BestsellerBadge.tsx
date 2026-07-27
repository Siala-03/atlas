import React from "react";
import { FlameIcon } from "lucide-react";

export function BestsellerBadge({ className = "" }: {className?: string;}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-amber2-500 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white ${className}`}>
      <FlameIcon className="h-3 w-3" /> Bestseller
    </span>);

}
