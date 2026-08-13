import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const INTERVAL_MS = 2800;

export function RotatingTagline({ items, className = "" }: {items: string[];className?: string;}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className={`relative h-5 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.p
          key={items[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-x-0">

          {items[index]}
        </motion.p>
      </AnimatePresence>
    </div>);

}
