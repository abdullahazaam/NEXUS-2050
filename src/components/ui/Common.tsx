import { useEffect, useRef, useState } from "react";
import type { ReactNode, PointerEvent } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M9 34V14l15 20V14M24 14h15v20H24M9 14l15-7 15 7M39 34l-15 7-15-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span>
        NEXUS <em>2050</em>
        {!compact && <small>URBAN INTELLIGENCE</small>}
      </span>
    </span>
  );
}
export function Eyebrow({
  children,
  index,
}: {
  children: ReactNode;
  index?: string;
}) {
  return (
    <div className="eyebrow">
      {index && <span className="section-index">{index}</span>}
      <span className="tiny-square" />
      {children}
    </div>
  );
}
export function Demo({ short = false }: { short?: boolean }) {
  return (
    <span className="demo">
      <span />
      {short ? "SIMULATED" : "DEMO SIMULATION DATA"}
    </span>
  );
}
export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  const reduced = useReducedMotion();
  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "mouse" && !reduced) {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.045}px, ${(e.clientY - r.top - r.height / 2) * 0.06}px)`;
    }
  };
  return (
    <a
      className={`button ${secondary ? "secondary" : "primary"}`}
      href={href}
      onPointerMove={move}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
    >
      {children}
      {secondary ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}
    </a>
  );
}
export function Counter({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!seen || reduced) return;
    const control = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: setDisplay,
    });
    return () => control.stop();
  }, [seen, value, reduced]);
  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
