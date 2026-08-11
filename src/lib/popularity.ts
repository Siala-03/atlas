import { useMemo } from "react";
import { Order, Product } from "../types";
import { useStore } from "../store/StoreContext";

export interface PopularityStats {
  unitsSold: number;
  orderCount: number;
}

export function computePopularity(orders: Order[]): Map<string, PopularityStats> {
  const stats = new Map<string, PopularityStats>();
  for (const order of orders) {
    if (order.status === "Cancelled") continue;
    for (const line of order.lines) {
      const current = stats.get(line.productId) ?? { unitsSold: 0, orderCount: 0 };
      current.unitsSold += line.mode === "business" ? line.quantity * line.unitsPerCase : line.quantity;
      current.orderCount += 1;
      stats.set(line.productId, current);
    }
  }
  return stats;
}

export function usePopularity(topN = 4) {
  const { orders, products } = useStore();

  return useMemo(() => {
    const stats = computePopularity(orders);
    const ranked = products.
    map((product) => ({ product, sold: stats.get(product.id)?.unitsSold })).
    filter((entry): entry is {product: Product;sold: number;} => entry.sold !== undefined).
    sort((a, b) => b.sold - a.sold).
    map((entry) => entry.product);
    const fallback = products.filter((product) => !stats.has(product.id));
    const topProducts: Product[] = [...ranked, ...fallback].slice(0, topN);
    const bestsellerIds = new Set(ranked.slice(0, topN).map((product) => product.id));

    return { stats, bestsellerIds, topProducts };
  }, [orders, products, topN]);
}
