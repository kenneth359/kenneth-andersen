"use client";
import { useRef, useState, useEffect } from "react";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

function useCountUp(target: number, duration = 1400, trigger: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) return;
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else setVal(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return val;
}

function StatCell({ stat, idx, triggered }: { stat: { value: string; label: string; note: string }; idx: number; triggered: boolean }) {
  const isPlain = /^\d+$/.test(stat.value);
  const num = isPlain ? parseInt(stat.value) : 0;
  const val = useCountUp(num, 1400, triggered && isPlain);
  const display = isPlain && triggered ? `${val}` : stat.value;
  return (
    <div className="stat-cell">
      <div className="id">M.{String(idx + 1).padStart(2, "0")}</div>
      <div className="v">{display}</div>
      <div className="l">{stat.label}</div>
      <div className="n">{stat.note}</div>
    </div>
  );
}

export default function Track() {
  const { lang } = useLang();
  const t = translations[lang].track;
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setTriggered(true); io.disconnect(); } }),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id="track" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">03 / 09</span>
            <span className="eyebrow"><span className="dot" />{t.eyebrow}</span>
          </div>
          <div>
            <h2 className="h-section">
              {lang === "no"
                ? <>Tall som har <span className="accent-italic">fulgt med</span>.</>
                : <>Numbers that <span className="accent-italic">followed</span>.</>}
            </h2>
            <p className="body-l" style={{ marginTop: 18, maxWidth: 580 }}>{t.sub}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="stats-grid" ref={ref}>
            {t.stats.map((s, i) => (
              <StatCell key={i} stat={s} idx={i} triggered={triggered} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
