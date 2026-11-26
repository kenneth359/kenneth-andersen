"use client";
import { useEffect, useRef, useState } from "react";

/* Teller opp det første tallet i en verdi som «146 MWh» eller «3 av 4».
   Serveren rendrer sluttverdien (for søkemotorer og uten JS). Animasjonen
   starter først når tallet kommer inn i bildet, og hoppes over ved
   redusert bevegelse. */
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = value.match(/(\d+(?:[.,]\d+)?)/);
    const el = ref.current;
    if (!m || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = parseFloat(m[1].replace(",", "."));
    const decimals = (m[1].split(/[.,]/)[1] || "").length;
    const before = value.slice(0, m.index);
    const after = value.slice((m.index ?? 0) + m[1].length);
    const fmt = (n: number) => before + n.toFixed(decimals).replace(".", ",") + after;

    let raf = 0;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // allerede synlig: ikke flimre

    setText(fmt(0));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setText(fmt(target * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setText(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
