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
{ top: "3%", left: "1%", size: "5.5rem", opacity: 0.2, duration: 14, rotate: -8, delay: 0 },
{ top: "60%", left: "-1%", size: "7rem", opacity: 0.16, duration: 19, rotate: 6, delay: 1.2 },
{ top: "8%", left: "18%", size: "4rem", opacity: 0.16, duration: 16, rotate: 10, delay: 0.6 },
{ top: "80%", left: "20%", size: "5rem", opacity: 0.15, duration: 21, rotate: -6, delay: 2 },
{ top: "2%", left: "97%", size: "6.5rem", opacity: 0.2, duration: 17, rotate: -10, delay: 0.4 },
{ top: "52%", left: "99%", size: "5.5rem", opacity: 0.17, duration: 15, rotate: 8, delay: 1.6 },
{ top: "86%", left: "95%", size: "5.5rem", opacity: 0.18, duration: 20, rotate: -5, delay: 0.9 },
{ top: "30%", left: "8%", size: "3.5rem", opacity: 0.13, duration: 18, rotate: 12, delay: 2.4 },
{ top: "35%", left: "90%", size: "4rem", opacity: 0.14, duration: 23, rotate: -12, delay: 1 },
{ top: "68%", left: "70%", size: "4.5rem", opacity: 0.12, duration: 19, rotate: 7, delay: 1.8 }];


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
