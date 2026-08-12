import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { usePopularity } from "../lib/popularity";
import { staggerContainer, staggerItem } from "./Reveal";

export function ProductStrip({ title, products, viewAllHref }: {
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const { bestsellerIds } = usePopularity();

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-3xl font-semibold text-ink">{title}</h2>
        {viewAllHref &&
        <Link
          to={viewAllHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-800 hover:text-burgundy-900">

            View all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        }
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((product) =>
        <motion.div key={product.id} variants={staggerItem}>
            <ProductCard product={product} isBestseller={bestsellerIds.has(product.id)} />
          </motion.div>
        )}
      </motion.div>
    </section>);

}
