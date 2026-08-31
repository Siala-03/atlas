import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./store/StoreContext";
import { ToastProvider } from "./store/ToastContext";
import { PortalGuard } from "./components/PortalGuard";
import { AdminOnlyGuard } from "./components/AdminOnlyGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CartDrawer } from "./components/CartDrawer";
import { AgeGate } from "./components/AgeGate";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { BrandDetail } from "./pages/BrandDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Account } from "./pages/Account";
import { FAQ } from "./pages/FAQ";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { MockPayment } from "./pages/MockPayment";
import { NotFound } from "./pages/NotFound";

// The admin portal is never visited by shoppers, so it's split into its own
// lazy-loaded chunk — customers browsing the shop don't pay for its weight.
const PortalLogin = lazy(() => import("./pages/PortalLogin").then((m) => ({ default: m.PortalLogin })));
const Dashboard = lazy(() => import("./pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })));
const Orders = lazy(() => import("./pages/admin/Orders").then((m) => ({ default: m.Orders })));
const Reports = lazy(() => import("./pages/admin/Reports").then((m) => ({ default: m.Reports })));
const Customers = lazy(() => import("./pages/admin/Customers").then((m) => ({ default: m.Customers })));
const OrderDetail = lazy(() => import("./pages/admin/OrderDetail").then((m) => ({ default: m.OrderDetail })));
const Inventory = lazy(() => import("./pages/admin/Inventory").then((m) => ({ default: m.Inventory })));
const Settings = lazy(() => import("./pages/admin/Settings").then((m) => ({ default: m.Settings })));

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ToastProvider>
        <BrowserRouter>
          <AgeGate />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/brands/:slug" element={<BrandDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmed/:id" element={<OrderConfirmation />} />
            <Route path="/my-orders/:id" element={<OrderConfirmation />} />
            <Route path="/mock-payment/:providerRef" element={<MockPayment />} />

            <Route
              path="/portal/login"
              element={<Suspense fallback={null}><PortalLogin /></Suspense>} />

            <Route element={<PortalGuard />}>
              <Route path="/portal" element={<Suspense fallback={null}><Dashboard /></Suspense>} />
              <Route path="/portal/orders" element={<Suspense fallback={null}><Orders /></Suspense>} />
              <Route path="/portal/reports" element={<Suspense fallback={null}><Reports /></Suspense>} />
              <Route path="/portal/customers" element={<Suspense fallback={null}><Customers /></Suspense>} />
              <Route path="/portal/orders/:id" element={<Suspense fallback={null}><OrderDetail /></Suspense>} />
              <Route element={<AdminOnlyGuard />}>
                <Route path="/portal/inventory" element={<Suspense fallback={null}><Inventory /></Suspense>} />
                <Route path="/portal/settings" element={<Suspense fallback={null}><Settings /></Suspense>} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </StoreProvider>
    </ErrorBoundary>);

}