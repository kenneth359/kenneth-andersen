"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Cases() {
  const { lang } = useLang();
  const c = translations[lang].cases;
  return (
    <section id="cases" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">04 / 09</span>
            <span className="eyebrow"><span className="dot" />{c.eyebrow}</span>
          </div>
          <h2 className="h-section">
            {lang === "no"
              ? <>Tre <span className="accent-italic">historier</span>.</>
              : <>Three <span className="accent-italic">stories</span>.</>}
          </h2>
        </Reveal>
        <div className="cases-list">
          {c.items.map((it, i) => (
            <Reveal key={i} delay={80}>
              <article className="case">
                <div className="meta">
                  <span className="tag">{it.tag}</span>
                  <span className="period">{it.period}</span>
                  <div className="company">{it.company}</div>
                </div>
                <div className="body">
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                  <ul>
                    {it.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
