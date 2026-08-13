import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2Icon, CreditCardIcon, XCircleIcon } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatCurrency } from "../lib/format";
import { api } from "../lib/api";
import { Order } from "../types";

export function MockPayment() {
  const { providerRef } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchOrder, initiatePayment } = useStore();
  const orderId = searchParams.get("orderId") ?? "";
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(orderId).then(setOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  const [status, setStatus] = useState<"choosing" | "processing" | "failed">("choosing");
  const [activeRef, setActiveRef] = useState(providerRef ?? "");
  const [error, setError] = useState("");

  const simulate = async (outcome: "success" | "fail") => {
    setStatus("processing");
    setError("");
    try {
      const result = await api.mockPaymentCallback(activeRef, outcome);
      if (result.status === "paid") {
        navigate(`/order-confirmed/${orderId}`);
      } else {
        setStatus("failed");
      }
    } catch {
      setError("Could not reach the Atlas backend to confirm this payment.");
      setStatus("failed");
    }
  };

  const retry = async () => {
    if (!orderId) return;
    setError("");
    try {
      const { redirectUrl, providerRef: newRef } = await initiatePayment(orderId);
      setActiveRef(newRef);
      setStatus("choosing");
      window.history.replaceState(null, "", redirectUrl.replace(window.location.origin, ""));
    } catch {
      setError("Could not start a new payment attempt.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-burgundy-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-cream/10 bg-white p-8 shadow-2xl shadow-black/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy-50 text-burgundy-800">
          <CreditCardIcon className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-amber2-600">
          Pesapal (sandbox mock)
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">Confirm card payment</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          This stands in for Pesapal's hosted checkout page. Once a real Pesapal
          merchant account is connected, this screen is replaced by Pesapal itself.
        </p>

        <div className="mt-6 rounded-2xl bg-cream p-5">
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">Order reference</span>
            <span className="font-semibold text-ink">{order?.reference ?? orderId}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-ink/60">Amount due</span>
            <span className="font-serif text-lg font-semibold text-burgundy-800">
              {order ? formatCurrency(order.total) : "—"}
            </span>
          </div>
        </div>

        {status === "processing" &&
        <p className="mt-6 text-center text-sm text-ink/60">Confirming payment…</p>
        }

        {status === "choosing" &&
        <div className="mt-6 flex flex-col gap-3">
            <button
            onClick={() => simulate("success")}
            className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-700">

              <CheckCircle2Icon className="h-4 w-4" /> Simulate successful payment
            </button>
            <button
            onClick={() => simulate("fail")}
            className="flex items-center justify-center gap-2 rounded-full border border-red-200 py-3.5 font-semibold text-red-600 transition-colors hover:bg-red-50">

              <XCircleIcon className="h-4 w-4" /> Simulate failed payment
            </button>
          </div>
        }

        {status === "failed" &&
        <div className="mt-6 text-center">
            <XCircleIcon className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-3 font-semibold text-ink">Payment failed</p>
            <p className="mt-1 text-sm text-ink/60">{error || "The payment was not completed."}</p>
            <button
            onClick={retry}
            className="mt-5 rounded-full bg-burgundy-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">

              Try again
            </button>
          </div>
        }
      </div>
    </div>);

}
