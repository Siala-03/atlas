import React from "react";
import { PhoneIcon, MessageCircleIcon } from "lucide-react";
import { CONTACT_PHONE_INTL } from "../lib/contact";

export function AnnouncementBar() {
  return (
    <div className="w-full bg-burgundy-950 text-cream/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>We&apos;ve got you 24/7</span>
          <span className="hidden text-cream/30 sm:inline">·</span>
          <span className="hidden sm:inline">Business orders: Same-day delivery before 4PM</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-medium text-cream/90 sm:inline">Need help? Talk to us</span>
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
    </div>);

}
