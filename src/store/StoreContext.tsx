import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState } from
"react";
import {
  CartItem,
  InvoiceStatus,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  Product } from
"../types";
import { api } from "../lib/api";
import { SEED_PRODUCTS } from "../data/products";

const VAT_RATE = 0.18;
const CART_KEY = "atlas.cart.v1";

export interface CheckoutDetails {
  contactName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  deliveryDate: string;
  notes: string;
}

interface StoreContextValue {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  loading: boolean;
  backendError: string | null;
  addToCart: (productId: string, cases: number) => void;
  updateCartQty: (productId: string, cases: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getProduct: (id: string) => Product | undefined;
  placeOrder: (details: CheckoutDetails, paymentMethod?: PaymentMethod) => Promise<Order>;
  reorderOrder: (orderId: string) => Promise<{ addedCases: number; unavailable: string[] }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderInternalNotes: (orderId: string, notes: string) => Promise<void>;
  updateInvoiceStatus: (orderId: string, status: InvoiceStatus) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Pick<Product, "casePrice" | "stockCases" | "lowStockThreshold">>) => Promise<void>;
  restockProduct: (id: string, cases: number) => Promise<void>;
  initiatePayment: (orderId: string) => Promise<{ redirectUrl: string; providerRef: string }>;
  getPaymentStatus: (orderId: string) => Promise<Payment | null>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) as CartItem[] : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: {children: ReactNode;}) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getOrders()]).
    then(([fetchedProducts, fetchedOrders]) => {
      const nextProducts = fetchedProducts.length > 0 ? fetchedProducts : SEED_PRODUCTS;
      setProducts(nextProducts);
      setOrders(fetchedOrders);
      setBackendError(null);
    }).
    catch(() => {
      setProducts(SEED_PRODUCTS);
      setBackendError("Cannot reach the Atlas backend. Make sure the server is running (cd server && npm run dev).");
    }).
    finally(() => setLoading(false));
  }, []);

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  const getProduct = (id: string) => products.find((product) => product.id === id);

  const addToCart = (productId: string, cases: number) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.productId === productId);
      if (existing) {
        return previous.map((item) =>
        item.productId === productId ? { ...item, cases: item.cases + cases } : item
        );
      }
      return [...previous, { productId, cases }];
    });
  };

  const removeFromCart = (productId: string) =>
  setCart((previous) => previous.filter((item) => item.productId !== productId));

  const updateCartQty = (productId: string, cases: number) => {
    if (cases <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((previous) =>
    previous.map((item) => item.productId === productId ? { ...item, cases } : item)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.cases, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (getProduct(item.productId)?.casePrice ?? 0) * item.cases, 0),
    [cart, products]
  );

  const placeOrder = async (
  details: CheckoutDetails,
  paymentMethod: PaymentMethod = "card")
  : Promise<Order> => {
    const order = await api.placeOrder({ details, cart, paymentMethod });
    setOrders((previous) => [order, ...previous]);
    clearCart();
    // Stock was decremented authoritatively on the server; refetch to stay in sync
    // (also picks up any concurrent changes from other buyers/admins).
    api.getProducts().then(setProducts).catch(() => undefined);
    return order;
  };

  const reorderOrder = async (orderId: string) => {
    const result = await api.reorder(orderId);
    setCart(result.cart);
    return { addedCases: result.addedCases, unavailable: result.unavailable };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = await api.updateOrderStatus(orderId, status);
    setOrders((previous) => previous.map((item) => item.id === orderId ? order : item));
  };

  const updateOrderInternalNotes = async (orderId: string, internalNotes: string) => {
    const order = await api.updateOrderInternalNotes(orderId, internalNotes);
    setOrders((previous) => previous.map((item) => item.id === orderId ? order : item));
  };

  const updateInvoiceStatus = async (orderId: string, invoiceStatus: InvoiceStatus) => {
    const order = await api.updateInvoiceStatus(orderId, invoiceStatus);
    setOrders((previous) => previous.map((item) => item.id === orderId ? order : item));
  };

  const updateProduct = async (id: string, patch: Partial<Pick<Product, "casePrice" | "stockCases" | "lowStockThreshold">>) => {
    const product = await api.updateProduct(id, patch);
    setProducts((previous) => previous.map((item) => item.id === id ? product : item));
  };

  const restockProduct = async (id: string, cases: number) => {
    const product = await api.restockProduct(id, cases);
    setProducts((previous) => previous.map((item) => item.id === id ? product : item));
  };

  const initiatePayment = (orderId: string) => api.initiatePayment(orderId);
  const getPaymentStatus = (orderId: string) => api.getPaymentStatus(orderId);

  return (
    <StoreContext.Provider value={{
      products, orders, cart, cartCount, cartSubtotal, loading, backendError, addToCart, updateCartQty,
      removeFromCart, clearCart, getProduct, placeOrder,
      reorderOrder, updateOrderStatus, updateOrderInternalNotes, updateInvoiceStatus,
      updateProduct, restockProduct, initiatePayment, getPaymentStatus
    }}>
      {children}
    </StoreContext.Provider>);

}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}

export { VAT_RATE };
