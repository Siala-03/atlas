import React from "react";
import { UserIcon, Building2Icon } from "lucide-react";
import { useStore } from "../store/StoreContext";

export function ShopModeToggle({ className = "" }: {className?: string;}) {
  const { shoppingMode, setShoppingMode } = useStore();

  return (
    <div className={`inline-flex items-center rounded-full border border-burgundy-200 bg-white p-1 text-sm ${className}`}>
      <button
        type="button"
        onClick={() => setShoppingMode("individual")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-colors ${
        shoppingMode === "individual" ?
        "bg-burgundy-800 text-cream" :
        "text-ink/60 hover:text-burgundy-800"}`
        }>

        <UserIcon className="h-3.5 w-3.5" /> Individual
      </button>
      <button
        type="button"
        onClick={() => setShoppingMode("business")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-colors ${
        shoppingMode === "business" ?
        "bg-burgundy-800 text-cream" :
        "text-ink/60 hover:text-burgundy-800"}`
        }>

        <Building2Icon className="h-3.5 w-3.5" /> Business
      </button>
    </div>);

}
