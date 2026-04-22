import { useEffect, useRef } from "react";
import { now } from "../../data/resume";
import { gsap, ScrollTrigger } from "../../lib/motion";
import { useReducedMotion } from "../../lib/useReducedMotion";

export function NowTile() {
  const ref = useRef<HTMLElement>(null);
  const bulletsRef = useRef<HTMLUListElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduced) return;

    const ctx = gsap.context(() => {
      const bullets = bulletsRef.current!.querySelectorAll("li");
      gsap.set(bullets, { opacity: 0, x: -20 });
      bullets.forEach((b, i) => {
        gsap.to(b, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: `top+=${200 + i * 200} center`,
            end: `top+=${400 + i * 200} center`,
            scrub: 0.8,
          },
        });
      });

      gsap.to(bgRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="now"
      ref={ref}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: "linear-gradient(140deg, #1a1a2e 0%, #3a1078 60%, #5e5ce6 110%)" }}
    >
      <div
        ref={bgRef}
        aria-hidden
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(94,92,230,0.5), transparent 50%), radial-gradient(circle at 80% 70%, rgba(10,132,255,0.35), transparent 55%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-light/60 mb-4">
          Now
        </p>
        <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)] font-bold text-light max-w-4xl">
          {now.title}
        </h2>
        <ul
          ref={bulletsRef}
          className="mt-14 space-y-6 max-w-2xl"
        >
          {now.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-4 text-lg md:text-xl text-light/90 leading-relaxed"
              style={reduced ? undefined : { opacity: 0 }}
            >
              <span
                aria-hidden
                className="font-mono text-now text-xs pt-2 shrink-0"
              >
                0{i + 1}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
