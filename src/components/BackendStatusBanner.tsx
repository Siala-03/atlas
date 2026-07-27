import React from "react";
import { AlertTriangleIcon } from "lucide-react";
import { useStore } from "../store/StoreContext";

export function BackendStatusBanner() {
  const { backendError } = useStore();
  if (!backendError) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-center text-sm font-medium text-white">
      <AlertTriangleIcon className="h-4 w-4 shrink-0" />
      {backendError}
    </div>
  );
}
