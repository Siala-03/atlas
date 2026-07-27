export type Category = "Whisky" | "Vodka" | "Wine" | "Beer" | "Gin" | "Rum";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  abv: number;
  volume: string;
  unitsPerCase: number;
  casePrice: number;
  stockCases: number;
  lowStockThreshold: number;
  image: string;
  description: string;
  origin: string;
}

export interface CartItem {
  productId: string;
  cases: number;
}

export interface TradeAccount {
  id: string;
  business: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNo: string;
  deliveryAddress: string;
  verificationStatus: "Pending review" | "Verified";
  paymentTerms: string;
  createdAt: string;
}

export type OrderStatus =
"Pending" |
"Confirmed" |
"Packed" |
"Dispatched" |
"Delivered" |
"Cancelled";

export type InvoiceStatus = "To invoice" | "Invoiced" | "Paid";

export type PaymentMethod = "invoice" | "card";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerRef: string;
  status: PaymentStatus;
  amount: number;
  redirectUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderLine {
  productId: string;
  name: string;
  brand: string;
  cases: number;
  unitsPerCase: number;
  casePrice: number;
}

export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  status: OrderStatus;
  accountId?: string;
  business: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNo: string;
  deliveryAddress: string;
  deliveryDate?: string;
  notes: string;
  internalNotes?: string;
  invoiceStatus: InvoiceStatus;
  paymentMethod: PaymentMethod;
  confirmedAt?: string;
  packedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  lines: OrderLine[];
  payments?: Payment[];
  subtotal: number;
  vat: number;
  total: number;
}

export const ORDER_STATUSES: OrderStatus[] = [
"Pending",
"Confirmed",
"Packed",
"Dispatched",
"Delivered",
"Cancelled"];


export const INVOICE_STATUSES: InvoiceStatus[] = [
"To invoice",
"Invoiced",
"Paid"];