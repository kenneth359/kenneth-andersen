"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Career() {
  const { lang } = useLang();
  const c = translations[lang].career;
  return (
    <section id="karriere" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">06 / 09</span>
            <span className="eyebrow"><span className="dot" />{c.eyebrow}</span>
          </div>
          <h2 className="h-section">{c.heading}</h2>
        </Reveal>
        <div className="career-grid">
          <Reveal>
            <div className="timeline">
              {c.roles.map((r, i) => (
                <div key={i} className={`timeline-row ${i < 3 ? "featured" : ""}`}>
                  <div className="period">{r.period}</div>
                  <div>
                    <div className="role-title">{r.title}</div>
                    <div className="role-comp">{r.company}</div>
                  </div>
                  <div className="pill">
                    {i < 3 ? (lang === "no" ? "Aktiv" : "Active") : "—"}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="aside-block">
              <div className="head">{c.boardLabel}</div>
              {c.boards.map((b, i) => (
                <div key={i} className="item">
                  <div className="y">{b.period}</div>
                  <div className="t">{b.title}</div>
                  <div className="s">{b.company}</div>
                </div>
              ))}
            </div>
            <div className="aside-block">
              <div className="head">{c.eduLabel}</div>
              {c.edu.map((e, i) => (
                <div key={i} className="item">
                  <div className="y">{e.year}</div>
                  <div className="t">{e.title}</div>
                  <div className="s">{e.school}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
