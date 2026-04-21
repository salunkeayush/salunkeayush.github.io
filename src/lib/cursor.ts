export function initCustomCursor(reducedMotion: boolean): () => void {
  if (reducedMotion || matchMedia("(pointer: coarse)").matches) return () => {};

  const cursor = document.createElement("div");
  cursor.setAttribute("aria-hidden", "true");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;
  let hovered = false;
  let rafId = 0;

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };

  const onOver = (e: MouseEvent) => {
    const t = (e.target as HTMLElement | null)?.closest("[data-cursor='hover'], a, button");
    hovered = !!t;
    cursor.classList.toggle("is-hover", hovered);
  };

  const tick = () => {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${hovered ? 2.5 : 1})`;
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseover", onOver);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseover", onOver);
    cursor.remove();
  };
}
