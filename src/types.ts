export type Category =
"Whisky" | "Vodka" | "Wine" | "Beer" | "Gin" | "Rum" |
"Cognac" | "Liqueur" | "Tequila" | "Aperitif" | "Bitters" | "RTD" | "Mixer";

export type ShoppingMode = "individual" | "business";

export type WineSubtype = "Red" | "White" | "Rose" | "Sparkling";
export type BeerSubtype = "Imported" | "Local";
export type Subtype = WineSubtype | BeerSubtype;

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subtype?: Subtype;
  abv: number;
  volume: string;
  unitsPerCase: number;
  casePrice: number;
  stockUnits: number;
  lowStockThreshold: number;
  image: string;
  description: string;
  origin: string;
}

export function unitPrice(product: Pick<Product, "casePrice" | "unitsPerCase">): number {
  return Math.round(product.casePrice / product.unitsPerCase);
}

export interface CartItem {
  productId: string;
  mode: ShoppingMode;
  quantity: number;
}

export type OrderStatus =
"Pending" |
"Confirmed" |
"Packed" |
"Dispatched" |
"Delivered" |
"Cancelled";

export type InvoiceStatus = "To invoice" | "Invoiced" | "Paid";

export type PaymentMethod = "card" | "momo";

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
  mode: ShoppingMode;
  quantity: number;
  unitsPerCase: number;
  casePrice: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  status: OrderStatus;
  contactName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryDate?: string;
  notes: string;
  internalNotes?: string;
  invoiceStatus: InvoiceStatus;
  paymentMethod: PaymentMethod;
  companyName?: string;
  tin?: string;
  needsEbm: boolean;
  ebmPurchaseCode?: string;
  ebmInvoiceEmail?: string;
  confirmedAt?: string;
  packedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  lines: OrderLine[];
  payments?: Payment[];
  subtotal: number;
  vat: number;
  deliveryFee: number;
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

export type AdminRole = "admin" | "staff";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}