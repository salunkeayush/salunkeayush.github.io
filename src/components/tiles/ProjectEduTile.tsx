import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { parkSafeProject, education } from "../../data/resume";
import { useReducedMotion } from "../../lib/useReducedMotion";

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

export function ProjectEduTile() {
  const reduced = useReducedMotion();

  return (
    <section
      id="projedu"
      className="relative bg-light text-ink py-32"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <TiltCard>
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduced ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full rounded-3xl p-10 text-light overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a84ff 0%, #64d2ff 100%)" }}
          >
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-light/70 mb-4">
              Side project
            </p>
            <h3 className="display text-4xl md:text-5xl font-bold">
              {parkSafeProject.title}
            </h3>
            <p className="mt-6 text-lg text-light/90 leading-relaxed max-w-md">
              {parkSafeProject.blurb}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {parkSafeProject.stack.map((s) => (
                <li
                  key={s}
                  className="font-mono text-[11px] uppercase tracking-widest border border-light/30 rounded-full px-3 py-1"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.article>
        </TiltCard>

        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduced ? 0.15 : 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-10 bg-paper border border-ink/5"
        >
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-edu mb-4">
            Education
          </p>
          <ul className="space-y-8">
            {education.map((s) => (
              <li key={s.school} className="border-b border-ink/10 pb-6 last:border-0">
                <h3 className="display text-2xl md:text-3xl font-bold text-ink">
                  {s.school}
                </h3>
                <p className="mt-2 text-ink/70">{s.degree}</p>
                <div className="mt-3 flex gap-6 font-mono text-xs text-mute uppercase tracking-widest">
                  <span>GPA {s.gpa}</span>
                  <span>{s.years}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>
    </section>
  );
}
