import {
  CartItem,
  Order,
  OrderStatus,
  InvoiceStatus,
  PaymentMethod,
  Payment,
  Product,
  StaffUser } from
"../types";
import type { CheckoutDetails } from "../store/StoreContext";
import { endPortalSession, getPortalToken } from "./portalAuth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getPortalToken();
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers
      }
    });
  } catch {
    throw new ApiError(0, "Cannot reach the Atlas backend. Is it running?");
  }

  if (response.status === 401 && token) {
    endPortalSession();
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

  updateProduct: (
  id: string,
  patch: Partial<
    Pick<
      Product,
      "name" | "brand" | "category" | "subtype" | "abv" | "volume" | "origin" | "description" |
      "casePrice" | "unitsPerCase" | "stockUnits" | "lowStockThreshold" | "image">>)
  : Promise<Product> =>
  request<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  createProduct: (data: Omit<Product, "id">) =>
  request<Product>("/products", { method: "POST", body: JSON.stringify(data) }),

  restockProduct: (id: string, units: number) =>
  request<Product>(`/products/${id}/restock`, { method: "POST", body: JSON.stringify({ units }) }),

  getOrders: () => request<Order[]>("/orders"),

  getOrder: (id: string) => request<Order>(`/orders/${id}`),

  portalLogin: (password: string, email?: string) =>
  request<{ token: string; role: "admin" | "staff"; name: string }>("/portal/login", {
    method: "POST",
    body: JSON.stringify(email ? { email, password } : { password })
  }),

  changePortalPassword: (currentPassword: string, newPassword: string) =>
  request<{ ok: boolean }>("/portal/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }),

  getTeam: () => request<StaffUser[]>("/portal/team"),

  addTeamMember: (params: { name: string; email: string; password: string; role: "admin" | "staff" }) =>
  request<StaffUser>("/portal/team", { method: "POST", body: JSON.stringify(params) }),

  removeTeamMember: (id: string) =>
  request<{ ok: boolean }>(`/portal/team/${id}`, { method: "DELETE" }),

  placeOrder: (params: { details: CheckoutDetails; cart: CartItem[]; paymentMethod: PaymentMethod }) =>
  request<Order>("/orders", { method: "POST", body: JSON.stringify(params) }),

  updateOrderDetails: (
  id: string,
  patch: Partial<Pick<Order, "contactName" | "email" | "phone" | "deliveryAddress" | "deliveryDate" | "notes">>) =>
  request<Order>(`/orders/${id}/details`, { method: "PATCH", body: JSON.stringify(patch) }),

  updateOrderStatus: (id: string, status: OrderStatus) =>
  request<Order>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  updateOrderInternalNotes: (id: string, internalNotes: string) =>
  request<Order>(`/orders/${id}/internal-notes`, { method: "PATCH", body: JSON.stringify({ internalNotes }) }),

  updateInvoiceStatus: (id: string, invoiceStatus: InvoiceStatus) =>
  request<Order>(`/orders/${id}/invoice-status`, { method: "PATCH", body: JSON.stringify({ invoiceStatus }) }),

  reorder: (id: string) =>
  request<{ cart: CartItem[]; addedUnits: number; unavailable: string[] }>(`/orders/${id}/reorder`, { method: "POST" }),

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
