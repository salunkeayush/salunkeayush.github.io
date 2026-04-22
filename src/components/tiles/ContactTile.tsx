import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { contact } from "../../data/resume";
import { useReducedMotion } from "../../lib/useReducedMotion";

function MagneticButton({
  children,
  href,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18 });
  const sy = useSpring(y, { stiffness: 280, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 120) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    }
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = `inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-medium transition-colors ${
    primary
      ? "bg-hero text-light hover:bg-hero/90"
      : "border border-ink/15 text-ink hover:border-ink/40"
  }`;

  const MotionComp = href ? motion.a : motion.button;
  return (
    <MotionComp
      ref={ref as React.RefObject<HTMLAnchorElement & HTMLButtonElement>}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={classes}
      data-cursor="hover"
    >
      {children}
    </MotionComp>
  );
}

export function ContactTile() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen bg-light text-ink flex items-center"
    >
      <div className="max-w-5xl mx-auto px-6 py-32 w-full text-center">
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-hero mb-4">
          Say hi
        </p>
        <h2 className="display text-[clamp(3rem,10vw,8rem)] font-bold text-ink leading-none">
          Let&rsquo;s build.
        </h2>
        <p className="mt-8 text-lg md:text-xl text-ink/70 max-w-xl mx-auto">
          Open to senior / staff engineering roles. Fastest reply by email — I read every message.
        </p>
        <div className="mt-14 flex flex-wrap gap-4 justify-center items-center">
          <MagneticButton href={`mailto:${contact.email}`} primary>
            Email me
          </MagneticButton>
          <MagneticButton onClick={copy}>
            <span className="relative inline-flex items-center gap-2">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-stats"
                >
                  ✓ Copied
                </motion.span>
              ) : (
                <span>Copy email</span>
              )}
            </span>
          </MagneticButton>
          <MagneticButton href={contact.linkedin}>LinkedIn</MagneticButton>
        </div>
        <p className="mt-20 font-mono text-xs text-mute tracking-widest uppercase">
          {contact.phone} · {contact.email}
        </p>
      </div>
    </section>
  );
}
