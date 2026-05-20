"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Services() {
  const { lang } = useLang();
  const s = translations[lang].services;
  return (
    <section id="tjenester" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">05 / 09</span>
            <span className="eyebrow"><span className="dot" />{s.eyebrow}</span>
          </div>
          <div>
            <h2 className="h-section">
              {lang === "no"
                ? <>Tre måter å <span className="accent-italic">jobbe sammen</span>.</>
                : <>Three ways to <span className="accent-italic">work together</span>.</>}
            </h2>
            <p className="body-l" style={{ marginTop: 18, maxWidth: 580 }}>{s.sub}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="services-grid">
            {s.items.map((it, i) => {
              const [num, label] = it.tag.split("/").map((x) => x.trim());
              return (
                <div key={i} className="service">
                  <div className="tag">
                    <span className="badge">{num}</span>
                    <span>{label}</span>
                  </div>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                  <ul>{it.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
