"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Testimonials() {
  const { lang } = useLang();
  const t = translations[lang].testimonials;
  return (
    <section id="referanser" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">07 / 09</span>
            <span className="eyebrow"><span className="dot" />{t.eyebrow}</span>
          </div>
          <div>
            <h2 className="h-section">
              {lang === "no"
                ? <>Hva andre <span className="accent-italic">sier</span>.</>
                : <>What others <span className="accent-italic">say</span>.</>}
            </h2>
            <p className="small" style={{ marginTop: 14 }}>{t.sub}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="testimonials-grid">
            {t.items.map((q, i) => (
              <div key={i} className="testimonial">
                <div className="source-tag">
                  {q.source === "ref" ? (
                    <span className="ref-mark">R</span>
                  ) : (
                    <span className="in-mark">in</span>
                  )}
                  <span>{q.source === "ref" ? (lang === "no" ? "Referanse" : "Reference") : "LinkedIn"}</span>
                </div>
                <blockquote>{q.quote}</blockquote>
                <div className="person">
                  <div className="avatar">{q.initials}</div>
                  <div className="info">
                    <div className="n">{q.name}</div>
                    <div className="r">{q.role}</div>
                    <div className="rel">{q.rel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
