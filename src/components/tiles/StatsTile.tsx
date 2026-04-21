import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "../../data/resume";
import { useReducedMotion } from "../../lib/useReducedMotion";

function Counter({ target, reduced }: { target: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  return <span ref={ref}>{value}</span>;
}

export function StatsTile() {
  const reduced = useReducedMotion();

  return (
    <section
      id="stats"
      className="relative min-h-screen bg-light text-ink flex items-center"
    >
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-stats mb-4">
          Impact
        </p>
        <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)] font-bold text-ink mb-16 max-w-4xl">
          Numbers that moved the teams I was on.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reduced ? 0.15 : 0.6,
                delay: reduced ? 0 : i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative bg-paper border border-ink/5 rounded-3xl p-10 overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(48,209,88,0.08), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="num text-[clamp(3rem,8vw,6rem)] font-bold text-ink leading-none">
                  <Counter target={s.target} reduced={reduced} />
                  <span className="text-stats">{s.suffix ?? ""}</span>
                </div>
                <p className="mt-4 text-mute uppercase tracking-widest text-xs font-mono">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
