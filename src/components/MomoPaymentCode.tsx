import React from "react";
import { SmartphoneIcon } from "lucide-react";
import { formatCurrency } from "../lib/format";
import { buildMomoUssdLink } from "../lib/momo";

export function MomoPaymentCode({ amount }: { amount: number }) {
  return (
    <div className="rounded-2xl border border-burgundy-200 bg-burgundy-50 p-5">
      <a
        href={buildMomoUssdLink(amount)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-3.5 font-semibold text-cream transition-colors hover:bg-burgundy-900">

        <SmartphoneIcon className="h-4 w-4" /> Pay {formatCurrency(amount)} with MTN MoMo
      </a>
      <p className="mt-2 text-xs text-ink/60">
        Opens your dialer with our MoMo code and this amount ready. Tap call to confirm.
      </p>
      <p className="mt-3 text-xs text-ink/50">
        Delivery is scheduled once we confirm your payment has come through.
      </p>
    </div>);

}
