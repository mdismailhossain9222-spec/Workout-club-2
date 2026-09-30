import { FACILITIES } from "@/config/branches";
import { motion } from "framer-motion";
import { EASE, STAGGER } from "@/config/motion";
import { cn } from "@/utils/cn";

const ICONS: Record<string, React.ReactNode> = {
  dumbbell: (
    <path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12" strokeWidth="1.6" strokeLinecap="round" />
  ),
  clipboard: (
    <>
      <path d="M8 4h8v3H8z" strokeWidth="1.6" />
      <path d="M6 6h2m8 0h2v14H6V6" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h4" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  wave: (
    <>
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 9c0-2 2-2 2-4M14 9c0-2 2-2 2-4" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  locker: (
    <>
      <path d="M5 3h14v18H5z" strokeWidth="1.6" />
      <path d="M12 3v18M8 9h1m6 0h1" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" strokeWidth="1.6" strokeLinejoin="round" />,
};

export default function Facilities({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", className)}>
      {FACILITIES.map((f, i) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: i * STAGGER.chips, ease: EASE.fmBlade }}
          whileHover={{ y: -6 }}
          className="group clip-notch border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-violet-400/50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7 text-violet-300 transition-transform duration-500 group-hover:scale-110">
            {ICONS[f.icon]}
          </svg>
          <div className="mt-3 font-[Chakra_Petch] text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
            {f.name}
          </div>
          {!compact && <p className="mt-1.5 text-[12px] leading-relaxed text-silver-dim">{f.desc}</p>}
          {f.id === "classes" && (
            <div className="mt-2 text-[10px] tracking-[0.18em] text-violet-300/80 uppercase">
              Zumba • Kickboxing • Yoga • HIIT • Aerobics
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
