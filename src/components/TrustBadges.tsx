import React from "react";
import { ShieldCheckIcon, BadgeCheckIcon, LockIcon } from "lucide-react";

const BADGES = [
{ icon: BadgeCheckIcon, label: "Genuine import" },
{ icon: ShieldCheckIcon, label: "Trade-verified pricing" },
{ icon: LockIcon, label: "Secure checkout" }];


export function TrustBadges() {
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-burgundy-100 pt-4">
      {BADGES.map((badge) =>
      <div key={badge.label} className="flex items-center gap-1.5 text-xs font-medium text-ink/60">
          <badge.icon className="h-4 w-4 text-burgundy-700" />
          {badge.label}
        </div>
      )}
    </div>);

}
