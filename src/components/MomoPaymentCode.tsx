import React, { useState } from "react";
import { CheckIcon, CopyIcon, SmartphoneIcon } from "lucide-react";
import { formatCurrency } from "../lib/format";
import { buildMomoUssdCode, buildMomoUssdLink, MOMO_MERCHANT_CODE } from "../lib/momo";

export function MomoPaymentCode({ amount }: {amount: number;}) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(buildMomoUssdCode(amount));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard access can fail silently (permissions, insecure context); the
      // code is still shown on screen so the user can select and copy manually.
    }
  };

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

      <div className="mt-4 border-t border-burgundy-200 pt-4">
        <p className="text-xs font-medium text-ink/60">On a computer and can&apos;t open a dialer? Dial this manually from your phone:</p>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-burgundy-200 bg-white px-3 py-2.5">
          <span className="font-mono text-sm text-ink">{buildMomoUssdCode(amount)}</span>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-burgundy-200 px-3 py-1.5 text-xs font-semibold text-burgundy-800 hover:bg-burgundy-50">

            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-ink/50">Merchant code: <span className="font-medium text-ink">{MOMO_MERCHANT_CODE}</span></p>
      </div>

      <p className="mt-3 text-xs text-ink/50">
        Delivery is scheduled once we confirm your payment has come through.
      </p>
    </div>);

}
