import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "./ui/Common";
function visited() {
  try {
    return sessionStorage.getItem("nexus-visited") === "1";
  } catch {
    return false;
  }
}
export default function Preloader() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => !visited());
  useEffect(() => {
    try {
      sessionStorage.setItem("nexus-visited", "1");
    } catch {
      /* Storage can be unavailable in private contexts. */
    }
    const timer = setTimeout(() => setShow(false), reduced ? 80 : 1500);
    return () => clearTimeout(timer);
  }, [reduced]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          aria-hidden="true"
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
        >
          <Logo />
          <p>Initializing Urban Intelligence</p>
          <div className="loading-track">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
          <span>BOOT SEQUENCE / CONNECTING 24 DISTRICTS</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
