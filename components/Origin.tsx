"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Origin() {
  const { lang } = useLang();
  const o = translations[lang].origin;
  return (
    <section id="opprinnelse" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">01 / 09</span>
            <span className="eyebrow"><span className="dot" />{o.eyebrow}</span>
          </div>
          <h2 className="h-section">
            {lang === "no"
              ? <>Fem kapitler.<br /><span className="accent-italic">Én leder.</span></>
              : <>Five chapters.<br /><span className="accent-italic">One leader.</span></>}
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="origin-lede">
            {lang === "no"
              ? <>Sjeldent å finne en konsernsjef som har <span className="quoted">lagt kabel selv</span>. Den bredden gjør at jeg leser organisasjoner annerledes — og at de leser meg annerledes tilbake.</>
              : <>Rare to find a CEO who has actually <span className="quoted">laid cable himself</span>. That breadth makes me read organisations differently — and they read me differently back.</>}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="chapters">
            {o.chapters.map((c, i) => (
              <div key={i} className="chapter">
                <div className="num">{c.n}</div>
                <div className="label">{c.label}</div>
                <div className="year">{c.year}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <p className="origin-footnote">— {o.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
