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
  Product,
  ShoppingMode,
  unitPrice } from
"../types";
import { api } from "../lib/api";
import { SEED_PRODUCTS } from "../data/products";
import { hasCaseOption } from "../lib/productRules";

const VAT_RATE = 0.18;
const CART_KEY = "atlas.cart.v2";
const MODE_KEY = "atlas.shoppingMode.v1";

// Wine/spirits have no case price at all, so their stored mode is never
// trusted for pricing — always per bottle regardless of what's stored (guards
// against stale cart entries from before this rule existed). Beer/crates
// genuinely support either mode, so the shopper's choice (item.mode) is honored.
export function lineUnitTotal(product: Pick<Product, "casePrice" | "unitsPerCase" | "category">, item: CartItem): number {
  const isBusiness = hasCaseOption(product.category) && item.mode === "business";
  return isBusiness ? product.casePrice * item.quantity : unitPrice(product) * item.quantity;
}

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
  shoppingMode: ShoppingMode;
  setShoppingMode: (mode: ShoppingMode) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  loading: boolean;
  backendError: string | null;
  addToCart: (productId: string, mode: ShoppingMode, quantity: number) => void;
  updateCartQty: (productId: string, mode: ShoppingMode, quantity: number) => void;
  removeFromCart: (productId: string, mode: ShoppingMode) => void;
  clearCart: () => void;
  getProduct: (id: string) => Product | undefined;
  loadOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<Order | undefined>;
  placeOrder: (details: CheckoutDetails, paymentMethod?: PaymentMethod) => Promise<Order>;
  reorderOrder: (orderId: string) => Promise<{ addedUnits: number; unavailable: string[] }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderInternalNotes: (orderId: string, notes: string) => Promise<void>;
  updateInvoiceStatus: (orderId: string, status: InvoiceStatus) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Pick<Product, "casePrice" | "stockUnits" | "lowStockThreshold">>) => Promise<void>;
  restockProduct: (id: string, units: number) => Promise<void>;
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

function loadMode(): ShoppingMode {
  try {
    const raw = localStorage.getItem(MODE_KEY);
    return raw === "business" ? "business" : "individual";
  } catch {
    return "individual";
  }
}

export function StoreProvider({ children }: {children: ReactNode;}) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [shoppingMode, setShoppingModeState] = useState<ShoppingMode>(() => loadMode());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  const setShoppingMode = (mode: ShoppingMode) => {
    setShoppingModeState(mode);
    localStorage.setItem(MODE_KEY, mode);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    api.getProducts().
    then((fetchedProducts) => {
      setProducts(fetchedProducts.length > 0 ? fetchedProducts : SEED_PRODUCTS);
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

  const addToCart = (productId: string, mode: ShoppingMode, quantity: number) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.productId === productId && item.mode === mode);
      if (existing) {
        return previous.map((item) =>
        item.productId === productId && item.mode === mode ?
        { ...item, quantity: item.quantity + quantity } :
        item
        );
      }
      return [...previous, { productId, mode, quantity }];
    });
  };

  const removeFromCart = (productId: string, mode: ShoppingMode) =>
  setCart((previous) => previous.filter((item) => !(item.productId === productId && item.mode === mode)));

  const updateCartQty = (productId: string, mode: ShoppingMode, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, mode);
      return;
    }
    setCart((previous) =>
    previous.map((item) => item.productId === productId && item.mode === mode ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + (product ? lineUnitTotal(product, item) : 0);
    }, 0),
    [cart, products]
  );

  const loadOrders = async () => {
    const fetchedOrders = await api.getOrders();
    setOrders(fetchedOrders);
  };

  const fetchOrder = async (id: string): Promise<Order | undefined> => {
    const existing = orders.find((order) => order.id === id);
    if (existing) return existing;
    try {
      const order = await api.getOrder(id);
      setOrders((previous) => [order, ...previous.filter((o) => o.id !== order.id)]);
      return order;
    } catch {
      return undefined;
    }
  };

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
    return { addedUnits: result.addedUnits, unavailable: result.unavailable };
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

  const updateProduct = async (id: string, patch: Partial<Pick<Product, "casePrice" | "stockUnits" | "lowStockThreshold">>) => {
    const product = await api.updateProduct(id, patch);
    setProducts((previous) => previous.map((item) => item.id === id ? product : item));
  };

  const restockProduct = async (id: string, units: number) => {
    const product = await api.restockProduct(id, units);
    setProducts((previous) => previous.map((item) => item.id === id ? product : item));
  };

  const initiatePayment = (orderId: string) => api.initiatePayment(orderId);
  const getPaymentStatus = (orderId: string) => api.getPaymentStatus(orderId);

  return (
    <StoreContext.Provider value={{
      products, orders, cart, cartCount, cartSubtotal, shoppingMode, setShoppingMode,
      isCartOpen, openCart, closeCart,
      loading, backendError, addToCart, updateCartQty,
      removeFromCart, clearCart, getProduct, loadOrders, fetchOrder, placeOrder,
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
