import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { DUR, EASE } from "@/config/motion";
import { ScrollTrigger } from "@/motion/gsap";

/**
 * DIAGONAL SLICE WIPE.
 * Two angled panels (cut at the W's angle) sweep in from opposite sides,
 * cover the screen, then sweep off as the new route mounts.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    setWiping(true);
    window.scrollTo(0, 0);
    const t = setTimeout(() => {
      setWiping(false);
      ScrollTrigger.refresh();
    }, DUR.pageWipe * 1000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {wiping && (
          <motion.div key={location.pathname} className="pointer-events-none fixed inset-0 z-[9000]">
            <motion.div
              className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-br from-violet-800 to-[#0b0518]"
              style={{ clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)" }}
              initial={{ x: "-105%" }}
              animate={{ x: ["-105%", "0%", "-105%"] }}
              transition={{ duration: DUR.pageWipe, times: [0, 0.45, 1], ease: EASE.fmInOut }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-[62%] bg-gradient-to-bl from-[#161022] to-[#06030d]"
              style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
              initial={{ x: "105%" }}
              animate={{ x: ["105%", "0%", "105%"] }}
              transition={{ duration: DUR.pageWipe, times: [0, 0.45, 1], ease: EASE.fmInOut }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
      >
        {children}
      </motion.div>
    </>
  );
}
