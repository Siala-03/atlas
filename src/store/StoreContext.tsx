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
  ShoppingMode } from
"../types";
import { api } from "../lib/api";
import { SEED_PRODUCTS } from "../data/products";
import { bottlePrice, caseTotalPrice } from "../lib/productRules";

const DELIVERY_FEE = 1500;
const CART_KEY = "atlas.cart.v2";
const MODE_KEY = "atlas.shoppingMode.v1";

export function lineUnitTotal(product: Pick<Product, "casePrice" | "unitsPerCase" | "category">, item: CartItem): number {
  const isBusiness = item.mode === "business";
  return isBusiness ? caseTotalPrice(product) * item.quantity : bottlePrice(product) * item.quantity;
}

export interface CheckoutDetails {
  contactName: string;
  email: string;
  phone: string;
  neighborhood: string;
  streetNumber: string;
  houseNumber: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryDate: string;
  notes: string;
  isBusinessCheckout: boolean;
  companyName: string;
  tin: string;
  needsEbm: boolean;
  ebmPurchaseCode: string;
  ebmInvoiceEmail: string;
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
  updateOrderDetails: (
  orderId: string,
  patch: Partial<Pick<Order, "contactName" | "email" | "phone" | "deliveryAddress" | "deliveryDate" | "notes">>)
  => Promise<void>;
  updateOrderLines: (orderId: string, lines: {productId: string;mode: ShoppingMode;quantity: number;}[]) => Promise<void>;
  updateInvoiceStatus: (orderId: string, status: InvoiceStatus) => Promise<void>;
  updateProduct: (
  id: string,
  patch: Partial<
    Pick<
      Product,
      "name" | "brand" | "category" | "subtype" | "abv" | "volume" | "origin" | "description" |
      "casePrice" | "unitsPerCase" | "stockUnits" | "lowStockThreshold" | "image" | "published">>)
  => Promise<void>;
  createProduct: (data: Omit<Product, "id">) => Promise<void>;
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

  const updateOrderDetails = async (
  orderId: string,
  patch: Partial<Pick<Order, "contactName" | "email" | "phone" | "deliveryAddress" | "deliveryDate" | "notes">>) =>
  {
    const order = await api.updateOrderDetails(orderId, patch);
    setOrders((previous) => previous.map((item) => item.id === orderId ? order : item));
  };

  const updateOrderLines = async (orderId: string, lines: {productId: string;mode: ShoppingMode;quantity: number;}[]) => {
    const order = await api.updateOrderLines(orderId, lines);
    setOrders((previous) => previous.map((item) => item.id === orderId ? order : item));
    api.getProducts().then(setProducts).catch(() => undefined);
  };

  const updateProduct = async (
  id: string,
  patch: Partial<
    Pick<
      Product,
      "name" | "brand" | "category" | "subtype" | "abv" | "volume" | "origin" | "description" |
      "casePrice" | "unitsPerCase" | "stockUnits" | "lowStockThreshold" | "image" | "published">>) =>
  {
    const product = await api.updateProduct(id, patch);
    setProducts((previous) => previous.map((item) => item.id === id ? product : item));
  };

  const createProduct = async (data: Omit<Product, "id">) => {
    const product = await api.createProduct(data);
    setProducts((previous) => [...previous, product]);
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
      reorderOrder, updateOrderStatus, updateOrderInternalNotes, updateOrderDetails, updateOrderLines, updateInvoiceStatus,
      updateProduct, createProduct, restockProduct, initiatePayment, getPaymentStatus
    }}>
      {children}
    </StoreContext.Provider>);

}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}

export { DELIVERY_FEE };
