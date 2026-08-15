import React, { useState } from "react";
import { CopyIcon, CheckIcon, SmartphoneIcon } from "lucide-react";
import { buildMomoUssdCode, buildMomoUssdLink } from "../lib/momo";

export function MomoPaymentCode({ amount }: { amount: number }) {
  const [copied, setCopied] = useState(false);
  const code = buildMomoUssdCode(amount);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable - the code is still shown and selectable
    }
  };

  return (
    <div className="rounded-2xl border border-burgundy-200 bg-burgundy-50 p-5">
      <p className="flex items-center gap-1.5 font-semibold text-ink">
        <SmartphoneIcon className="h-4 w-4" /> Pay with MTN MoMo
      </p>
      <a
        href={buildMomoUssdLink(amount)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy-800 py-3.5 font-semibold text-cream transition-colors hover:bg-burgundy-900">

        <SmartphoneIcon className="h-4 w-4" /> Open dialer with code ready
      </a>
      <p className="mt-2 text-xs text-ink/60">
        On the phone you&apos;re paying from, this opens your dialer with the code below ready to call.
        If it doesn&apos;t open, dial the code yourself or copy it in.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 select-all rounded-xl border border-burgundy-200 bg-white px-4 py-3 text-center font-mono text-base font-semibold tracking-wide text-burgundy-800">
          {code}
        </code>
        <button
          type="button"
          onClick={copy}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-burgundy-200 bg-white text-burgundy-800 transition-colors hover:bg-burgundy-50"
          aria-label="Copy MoMo code">

          {copied ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : <CopyIcon className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink/50">
        Delivery is scheduled once we confirm your payment has come through.
      </p>
    </div>);

}
