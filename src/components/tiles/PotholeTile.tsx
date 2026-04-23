import { useEffect, useRef } from "react";
import { potholeProject } from "../../data/resume";
import { gsap, ScrollTrigger } from "../../lib/motion";
import { useReducedMotion } from "../../lib/useReducedMotion";

export function PotholeTile() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduced) return;

    const ctx = gsap.context(() => {
      const phases = ref.current!.querySelectorAll<HTMLElement>("[data-phase]");
      gsap.set(phases, { opacity: 0, y: 30 });
      gsap.set(phases[0], { opacity: 1, y: 0 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const active = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
          phases.forEach((el, i) => {
            gsap.to(el, {
              opacity: i === active ? 1 : 0,
              y: i === active ? 0 : 30,
              duration: 0.4,
              overwrite: "auto",
            });
          });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="pothole"
      ref={ref}
      className="relative min-h-screen bg-dark text-light flex items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 75% 25%, rgba(255,159,10,0.2), transparent 55%), radial-gradient(circle at 25% 75%, rgba(255,55,95,0.12), transparent 60%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full grid md:grid-cols-[0.4fr_0.6fr] gap-12 items-center">
        <div>
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-pothole mb-4">
            Featured · Research
          </p>
          <a
            href={potholeProject.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group inline-block"
          >
            <h2 className="display text-[clamp(2.5rem,6vw,5rem)] font-bold text-light group-hover:text-pothole transition-colors">
              {potholeProject.title}
            </h2>
            <p className="mt-3 font-mono text-sm text-light/60 group-hover:text-light/90 transition-colors inline-flex items-center gap-2">
              {potholeProject.subtitle}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">↗</span>
            </p>
          </a>
        </div>
        <div className="relative min-h-[320px]">
          {potholeProject.phases.map((ph, i) => (
            <div
              key={ph.label}
              data-phase
              className="absolute inset-0 flex flex-col justify-center"
              style={reduced ? { position: "relative", marginBottom: 48 } : undefined}
            >
              <span className="inline-flex w-fit font-mono text-[11px] tracking-[0.25em] uppercase text-light/60 border border-light/20 rounded-full px-3 py-1 mb-6">
                Phase {i + 1} · {ph.label}
              </span>
              <p className="text-xl md:text-2xl text-light/90 leading-relaxed max-w-xl">
                {ph.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
