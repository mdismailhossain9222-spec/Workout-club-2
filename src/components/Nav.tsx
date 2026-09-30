import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { WLogo, AngularButton } from "./ui";
import { OFFER } from "@/config/pricing";
import { BRAND } from "@/config/content";
import { EASE } from "@/config/motion";
import { cn } from "@/utils/cn";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/branches", label: "Branches" },
  { to: "/trainers", label: "Trainers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {OFFER.active && (
        <div className="relative z-[60] overflow-hidden bg-gradient-to-r from-violet-800 via-fuchsia-700 to-violet-800 py-2 text-center">
          <span className="font-[Chakra_Petch] text-[11px] tracking-[0.28em] uppercase text-white">
            {OFFER.headline}
          </span>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-[80] transition-all duration-500",
          scrolled ? "backdrop-blur-xl bg-[#06030d]/85 border-b border-white/10" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3" data-cursor="link">
            <WLogo className="h-8 w-9" />
            <span className="font-[Syncopate] text-[12px] font-bold tracking-[0.22em] text-white">
              THE WORKOUT<span className="text-violet-400"> CLUB</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-cursor="link"
                className={({ isActive }) =>
                  cn(
                    "relative px-4 py-2 font-[Chakra_Petch] text-[11px] tracking-[0.22em] uppercase transition-colors",
                    isActive ? "text-white" : "text-silver-dim hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-2 -bottom-0.5 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-400"
                        transition={{ duration: 0.4, ease: EASE.fmBlade }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <AngularButton to="/packages" variant="solid" className="px-5">
                Join Now
              </AngularButton>
            </div>
            <button
              className="lg:hidden grid h-11 w-11 place-items-center border border-white/15 clip-btn"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <span className="block h-[1.5px] w-5 bg-white shadow-[0_6px_0_#fff,0_-6px_0_#fff]" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE.fmBlade }}
              className="overflow-hidden border-t border-white/10 bg-[#06030d]/95 lg:hidden"
            >
              <div className="flex flex-col p-4">
                {LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/5 py-4 font-[Chakra_Petch] text-sm tracking-[0.2em] uppercase text-silver"
                  >
                    {l.label}
                  </Link>
                ))}
                <a href={`tel:${BRAND.phone}`} className="py-4 text-sm tracking-[0.2em] text-violet-300">
                  {BRAND.phone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
