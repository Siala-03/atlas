import React from "react";

const LOGO_URL = "/atlaslogo_(1).png";


interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
}

export function Logo({ className = "h-11", variant = "full" }: LogoProps) {
  if (variant === "mark") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-burgundy-800 font-serif font-semibold text-cream ${className}`}>
        
        A
      </span>);

  }
  return (
    <img
      src={LOGO_URL}
      alt="Atlas Supplies Ltd"
      className={`${className} w-auto object-contain`} />);


}