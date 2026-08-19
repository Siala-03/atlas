import React from "react";
import { PhoneIcon, MessageCircleIcon } from "lucide-react";
import { CONTACT_PHONE_INTL } from "../lib/contact";

export function AnnouncementBar() {
  return (
    <div className="w-full bg-burgundy-950 text-cream">
      <div className="mx-auto max-w-7xl px-4 py-2 text-sm sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:hidden">
          <span className="font-semibold text-cream">We&apos;ve got you 24/7</span>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT_PHONE_INTL}`}
              aria-label="Call us"
              className="inline-flex items-center gap-1 text-amber2-400 transition-colors hover:text-amber2-300">

              <PhoneIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://wa.me/${CONTACT_PHONE_INTL.replace("+", "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp us"
              className="inline-flex items-center gap-1 text-amber2-400 transition-colors hover:text-amber2-300">

              <MessageCircleIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <span className="font-semibold text-cream">We&apos;ve got you 24/7</span>
          <div className="flex items-center justify-end gap-3">
            <span className="font-semibold text-cream">Need help? Talk to us</span>
            <a
              href={`tel:${CONTACT_PHONE_INTL}`}
              aria-label="Call us"
              className="inline-flex items-center gap-1 text-amber2-400 transition-colors hover:text-amber2-300">

              <PhoneIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://wa.me/${CONTACT_PHONE_INTL.replace("+", "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp us"
              className="inline-flex items-center gap-1 text-amber2-400 transition-colors hover:text-amber2-300">

              <MessageCircleIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>);

}
