import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangleIcon, ArrowRightIcon, ClipboardListIcon, PackageCheckIcon, PoundSterlingIcon } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency, formatDate } from "../../lib/format";
import { useStore } from "../../store/StoreContext";
import { ORDER_STATUSES } from "../../types";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

export function Dashboard() {
  const { orders, products } = useStore();
  const revenue = orders.filter((order) => order.status !== "Cancelled").reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => order.status === "Pending").length;
  const lowStock = products.filter((product) => product.stockUnits <= product.lowStockThreshold);
  const activeOrders = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  const stats = [
  { label: "Revenue (inc. VAT)", value: formatCurrency(revenue), icon: PoundSterlingIcon, gradient: "from-burgundy-700 to-burgundy-900" },
  { label: "Pending orders", value: String(pending), icon: ClipboardListIcon, gradient: "from-amber2-400 to-amber2-600" },
  { label: "Active orders", value: String(activeOrders), icon: PackageCheckIcon, gradient: "from-emerald-500 to-emerald-700" },
  { label: "Low stock items", value: String(lowStock.length), icon: AlertTriangleIcon, gradient: "from-red-400 to-red-600" }];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-serif text-4xl font-semibold text-ink">Operations dashboard</h1>
        <p className="mt-1 text-ink/60">Incoming trade orders, fulfilment workload and warehouse availability.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) =>
        <motion.div
          key={stat.label}
          variants={staggerItem}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-burgundy-100 bg-white p-5 shadow-sm shadow-burgundy-900/5 transition-shadow hover:shadow-md hover:shadow-burgundy-900/10">

            <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${stat.gradient}`}>
              <stat.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-serif text-3xl font-semibold text-ink">{stat.value}</p>
            <p className="text-sm text-ink/55">{stat.label}</p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="mt-6 grid gap-6 lg:grid-cols-3">

        <motion.section
          variants={staggerItem}
          className="rounded-2xl border border-burgundy-100 bg-white p-6 shadow-sm shadow-burgundy-900/5 lg:col-span-2">

          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-ink">Fulfilment queue</h2>
            <Link to="/portal/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-burgundy-800 transition-colors hover:text-burgundy-900">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {orders.length === 0 ?
          <p className="mt-6 text-sm text-ink/50">No orders yet. Submitted orders will land here.</p> :

          <div className="mt-4 divide-y divide-burgundy-50">
              {orders.slice(0, 6).map((order) =>
            <Link
              key={order.id}
              to={`/portal/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-cream/70">

                  <div>
                    <p className="font-medium text-ink">{order.reference}</p>
                    <p className="text-xs text-ink/50">{order.contactName} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-sm font-semibold sm:inline">{formatCurrency(order.total)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
            )}
            </div>
          }
        </motion.section>

        <motion.section variants={staggerItem} className="rounded-2xl border border-burgundy-100 bg-white p-6 shadow-sm shadow-burgundy-900/5">
          <h2 className="font-serif text-2xl font-semibold text-ink">Orders by stage</h2>
          <div className="mt-5 space-y-4">
            {ORDER_STATUSES.filter((status) => status !== "Cancelled").map((status) => {
              const count = orders.filter((order) => order.status === status).length;
              const width = orders.length ? Math.max(count / orders.length * 100, count ? 8 : 0) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/65">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-burgundy-50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-burgundy-600 to-burgundy-800" />

                  </div>
                </div>);

            })}
          </div>
        </motion.section>

        <motion.section
          variants={staggerItem}
          className="rounded-2xl border border-burgundy-100 bg-white p-6 shadow-sm shadow-burgundy-900/5 lg:col-span-3">

          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-ink">Low stock watchlist</h2>
            <Link to="/portal/inventory" className="text-sm font-semibold text-burgundy-800 transition-colors hover:text-burgundy-900">
              Manage inventory
            </Link>
          </div>
          {lowStock.length === 0 ?
          <p className="mt-5 text-sm text-ink/50">All items are above their stock threshold.</p> :

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {lowStock.map((product) =>
            <div
              key={product.id}
              className="rounded-xl border border-amber2-100 bg-gradient-to-br from-amber2-50 to-amber2-100/60 p-4 transition-transform hover:-translate-y-0.5">

                  <p className="font-medium text-ink">{product.name}</p>
                  <p className="mt-1 text-xs text-ink/55">{product.brand}</p>
                  <p className="mt-3 text-sm font-bold text-amber2-800">{product.stockUnits} pieces left</p>
                </div>
            )}
            </div>
          }
        </motion.section>
      </motion.div>
    </AdminLayout>);

}
