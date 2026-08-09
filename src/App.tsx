import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./store/StoreContext";
import { PortalGuard } from "./components/PortalGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { BrandDetail } from "./pages/BrandDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { MockPayment } from "./pages/MockPayment";
import { PortalLogin } from "./pages/PortalLogin";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/admin/Dashboard";
import { Orders } from "./pages/admin/Orders";
import { OrderDetail } from "./pages/admin/OrderDetail";
import { Inventory } from "./pages/admin/Inventory";

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/brands/:slug" element={<BrandDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmed/:id" element={<OrderConfirmation />} />
            <Route path="/mock-payment/:providerRef" element={<MockPayment />} />

            <Route path="/portal/login" element={<PortalLogin />} />
            <Route element={<PortalGuard />}>
              <Route path="/portal" element={<Dashboard />} />
              <Route path="/portal/orders" element={<Orders />} />
              <Route path="/portal/orders/:id" element={<OrderDetail />} />
              <Route path="/portal/inventory" element={<Inventory />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>);

}