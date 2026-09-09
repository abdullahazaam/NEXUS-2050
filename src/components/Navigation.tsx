import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./ui/Common";
const links = [
  ["overview", "Overview"],
  ["systems", "City Systems"],
  ["intelligence", "Urban Intelligence"],
  ["simulation", "Simulation"],
  ["technology", "Technology"],
  ["vision", "Vision"],
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [progress, setProgress] = useState(0);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const scroll = () =>
      setProgress(
        window.scrollY /
          Math.max(1, document.documentElement.scrollHeight - innerHeight),
      );
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const items = nav.current?.querySelectorAll<HTMLElement>("a,button");
        if (!items) return;
        const visible = [...items].filter((el) => el.getClientRects().length);
        const first = visible[0],
          last = visible[visible.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <header
      className={`nav-shell ${progress > 0.01 || open ? "scrolled" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav ref={nav} aria-label="Main navigation" className="nav-inner">
        <a
          href="#overview"
          aria-label="Nexus 2050 home"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </a>
        <div className="desktop-links">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </div>
        <a href="#simulation" className="nav-cta">
          Launch Simulation <ArrowUpRight size={15} />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-navigation"
              className="mobile-links"
              initial={reduced ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {links.map(([id, label], i) => (
                <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                  <span>0{i + 1}</span>
                  {label}
                  <ArrowUpRight size={18} />
                </a>
              ))}
              <span className="mobile-note">
                A fictional city. A real possibility.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}
