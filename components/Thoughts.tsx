"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Thoughts() {
  const { lang } = useLang();
  const t = translations[lang].thoughts;
  return (
    <section id="tankegods" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">08 / 09</span>
            <span className="eyebrow"><span className="dot" />{t.eyebrow}</span>
          </div>
          <div>
            <h2 className="h-section">
              {lang === "no"
                ? <>Notater jeg <span className="accent-italic">deler</span>.</>
                : <>Notes I <span className="accent-italic">share</span>.</>}
            </h2>
            <p className="body-l" style={{ marginTop: 18, maxWidth: 580 }}>{t.sub}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="thoughts-list">
            {t.items.map((it, i) => (
              <a
                key={i}
                href="https://linkedin.com/in/kennethandersenstrategy"
                target="_blank"
                rel="noopener noreferrer"
                className="thought"
              >
                <span className="t-tag">{it.tag}</span>
                <span className="t-title">{it.title}</span>
                <span className="t-date">{it.date}</span>
                <span className="t-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <div className="thoughts-cta">
            <a
              href="https://linkedin.com/in/kennethandersenstrategy"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              {t.cta}<span className="arrow" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
