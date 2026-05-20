"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function OS() {
  const { lang } = useLang();
  const os = translations[lang].os;
  return (
    <section id="operativsystem" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">02 / 09</span>
            <span className="eyebrow"><span className="dot" />{os.eyebrow}</span>
          </div>
          <div>
            <h2 className="h-section">
              {lang === "no"
                ? <>Slik <span className="accent-italic">jobber</span> jeg.</>
                : <>How <span className="accent-italic">I work</span>.</>}
            </h2>
            <p className="body-l" style={{ marginTop: 18, maxWidth: 580 }}>{os.sub}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="pillars">
            {os.pillars.map((p, i) => (
              <div key={i} className="pillar">
                <div className="head">
                  <h3>{p.title}</h3>
                  <span className="num">{p.n}</span>
                </div>
                <p>{p.body}</p>
                <div className="proof">{p.proof}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
