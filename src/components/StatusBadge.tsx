import React from "react";
import { OrderStatus } from "../types";

const STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber2-100 text-amber2-800 ring-amber2-200",
  Confirmed: "bg-burgundy-100 text-burgundy-800 ring-burgundy-200",
  Packed: "bg-blue-100 text-blue-800 ring-blue-200",
  Dispatched: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  Delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-gray-200 text-gray-600 ring-gray-300"
};

export function StatusBadge({ status }: {status: OrderStatus;}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STYLES[status]}`}>
      
      {status}
    </span>);

}