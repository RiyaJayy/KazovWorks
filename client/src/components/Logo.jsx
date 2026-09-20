import { motion } from "framer-motion";

/**
 * KAZOV WORKS mark: a wheel/rim emblem — a circular rim with a light-catch
 * arc, a mitred "K" at its center, and three trailing speed-lines — paired
 * with a two-line condensed wordmark. Pure SVG, no external image asset.
 */
export default function Logo({ variant = "full", className = "", animated = false }) {
  const Mark = (
    <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0 overflow-visible" aria-hidden="true">
      <circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" strokeWidth="2.25" className="text-burgundy" />
      <path
        d="M32 11 A21 21 0 0 1 50.2 22.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="text-burgundy-light"
      />
      <path
        d="M23 20 V44 M23 32 L36.5 20 M23 32 L36.5 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="text-alloy"
      />
      <g className="text-burgundy">
        <line x1="6" y1="27" x2="13" y2="27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="4" y1="32" x2="12" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6" y1="37" x2="13" y2="37" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      </g>
    </svg>
  );

  if (variant === "mark") return <span className={className}>{Mark}</span>;

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
    : {};

  return (
    <Wrapper className={`flex items-center gap-3 ${className}`} {...wrapperProps}>
      {Mark}
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight text-alloy">
          KAZOV<span className="text-burgundy">.</span>
        </span>
        <span className="font-display text-[10px] font-medium tracking-[0.35em] text-ash">WORKS</span>
      </span>
    </Wrapper>
  );
}
