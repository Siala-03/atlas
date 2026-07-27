import {
  CartItem,
  Order,
  OrderStatus,
  InvoiceStatus,
  PaymentMethod,
  Payment,
  Product,
  TradeAccount } from
"../types";
import type { CheckoutDetails } from "../store/StoreContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers }
    });
  } catch {
    throw new ApiError(0, "Cannot reach the Atlas backend. Is it running?");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.error ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  getProducts: () => request<Product[]>("/products"),

  updateProduct: (id: string, patch: Partial<Pick<Product, "casePrice" | "stockCases" | "lowStockThreshold">>) =>
  request<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  restockProduct: (id: string, cases: number) =>
  request<Product>(`/products/${id}/restock`, { method: "POST", body: JSON.stringify({ cases }) }),

  getAccount: (id: string) => request<TradeAccount>(`/accounts/${id}`),

  saveTradeAccount: (details: CheckoutDetails, accountId?: string) =>
  request<TradeAccount>("/accounts", { method: "PUT", body: JSON.stringify({ details, accountId }) }),

  getOrders: () => request<Order[]>("/orders"),

  placeOrder: (params: { details: CheckoutDetails; accountId?: string; cart: CartItem[]; paymentMethod: PaymentMethod }) =>
  request<Order>("/orders", { method: "POST", body: JSON.stringify(params) }),

  updateOrderStatus: (id: string, status: OrderStatus) =>
  request<Order>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  updateOrderInternalNotes: (id: string, internalNotes: string) =>
  request<Order>(`/orders/${id}/internal-notes`, { method: "PATCH", body: JSON.stringify({ internalNotes }) }),

  updateInvoiceStatus: (id: string, invoiceStatus: InvoiceStatus) =>
  request<Order>(`/orders/${id}/invoice-status`, { method: "PATCH", body: JSON.stringify({ invoiceStatus }) }),

  reorder: (id: string) =>
  request<{ cart: CartItem[]; addedCases: number; unavailable: string[] }>(`/orders/${id}/reorder`, { method: "POST" }),

  initiatePayment: (orderId: string) =>
  request<{ paymentId: string; redirectUrl: string; providerRef: string }>("/payments/initiate", {
    method: "POST",
    body: JSON.stringify({ orderId })
  }),

  mockPaymentCallback: (providerRef: string, outcome: "success" | "fail") =>
  request<{ status: "paid" | "failed" }>("/payments/mock-callback", {
    method: "POST",
    body: JSON.stringify({ providerRef, outcome })
  }),

  getPaymentStatus: (orderId: string) => request<Payment | null>(`/payments/order/${orderId}`)
};
