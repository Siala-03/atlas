import React from "react";
import { motion } from "framer-motion";

interface FloatSpec {
  top: string;
  left: string;
  size: string;
  opacity: number;
  duration: number;
  rotate: number;
  delay: number;
}

const LAYOUT: FloatSpec[] = [
{ top: "4%", left: "6%", size: "5rem", opacity: 0.16, duration: 14, rotate: -8, delay: 0 },
{ top: "62%", left: "2%", size: "6.5rem", opacity: 0.12, duration: 19, rotate: 6, delay: 1.2 },
{ top: "10%", left: "38%", size: "4rem", opacity: 0.14, duration: 16, rotate: 10, delay: 0.6 },
{ top: "78%", left: "40%", size: "5.5rem", opacity: 0.13, duration: 21, rotate: -6, delay: 2 },
{ top: "6%", left: "88%", size: "6rem", opacity: 0.15, duration: 17, rotate: -10, delay: 0.4 },
{ top: "55%", left: "94%", size: "4.5rem", opacity: 0.12, duration: 15, rotate: 8, delay: 1.6 },
{ top: "88%", left: "82%", size: "5rem", opacity: 0.14, duration: 20, rotate: -5, delay: 0.9 }];


export function FloatingBottles({ images }: {images: string[];}) {
  if (images.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYOUT.map((spec, i) => {
        const src = images[i % images.length];
        return (
          <motion.img
            key={i}
            src={src}
            alt=""
            animate={{ y: [0, -18, 0], rotate: [spec.rotate, -spec.rotate, spec.rotate] }}
            transition={{ duration: spec.duration, delay: spec.delay, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: spec.top,
              left: spec.left,
              height: spec.size,
              width: "auto",
              opacity: spec.opacity
            }}
            className="object-contain" />);


      })}
    </div>);

}
