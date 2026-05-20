"use client";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function LogoTicker() {
  const { lang } = useLang();
  const { logos } = translations[lang];
  const items = [...logos.items, ...logos.items];
  return (
    <section className="logos">
      <div className="logos-label-row">
        <span className="label">{logos.label}</span>
        <span className="line" />
      </div>
      <div className="logos-track">
        {items.map((n, i) => <span key={i}>{n}</span>)}
      </div>
    </section>
  );
}
