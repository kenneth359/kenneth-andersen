"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/contexts/LanguageContext";
import { cv } from "@/lib/cv";
import { translations } from "@/lib/translations";

export default function CvPage() {
  const { lang, setLang } = useLang();
  const c = cv[lang];
  const figs = translations[lang].track.stats;

  useEffect(() => {
    document.documentElement.lang = lang === "no" ? "nb" : "en";
  }, [lang]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("lang") === "en") setLang("en");
    if (p.get("print") === "1") {
      const t = window.setTimeout(() => window.print(), 600);
      return () => window.clearTimeout(t);
    }
  }, [setLang]);

  return (
    <div className="cvp">
      <div className="cvp-bar">
        <div className="cvp-bar-inner">
          <a href="/" className="cvp-home">← {c.back}</a>
          <div className="cvp-bar-right">
            <div className="cvp-lang" role="group" aria-label={lang === "no" ? "Språk" : "Language"}>
              <button className={lang === "no" ? "on" : ""} aria-pressed={lang === "no"} onClick={() => setLang("no")}>NO</button>
              <button className={lang === "en" ? "on" : ""} aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
            </div>
            <button className="cvp-print" onClick={() => window.print()} title={c.printHint}>
              {c.print}
            </button>
          </div>
        </div>
      </div>

      <main className="cvp-sheet">
        <header className="cvp-head">
          <div className="cvp-photo">
            <Image src="/assets/kenneth-portrett.jpg" alt="Kenneth Andersen" fill sizes="120px" style={{ objectFit: "cover", objectPosition: "50% 18%" }} />
          </div>
          <div>
            <h1>Kenneth Andersen</h1>
            <p className="cvp-title">{c.title}</p>
            <p className="cvp-contact">
              {c.contact.map((x, i) => (
                <span key={x}>
                  {i > 0 && <span className="sep" aria-hidden="true">·</span>}
                  {x.includes("@") ? <a href={`mailto:${x}`}>{x}</a>
                    : x.startsWith("+") ? <a href={`tel:${x.replace(/\s/g, "")}`}>{x}</a>
                    : x.includes(".") ? <a href={`https://${x}`}>{x}</a>
                    : x}
                </span>
              ))}
            </p>
          </div>
        </header>

        <section className="cvp-sec">
          <h2>{c.profileTitle}</h2>
          {c.profile.map((p) => <p key={p.slice(0, 20)} className="cvp-lede">{p}</p>)}
        </section>

        <section className="cvp-sec">
          <h2>{c.figuresTitle}</h2>
          <div className="cvp-figs">
            {figs.map((f) => (
              <div key={f.label} className="cvp-fig">
                <div className="v">{f.value}</div>
                <div className="l">{f.label}</div>
                <div className="n">{f.note}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cvp-sec">
          <h2>{c.expTitle}</h2>
          {c.experience.map((e) => (
            <article key={e.org + e.period} className="cvp-job">
              <div className="cvp-job-head">
                <h3>{e.role}</h3>
                <span className="period">{e.period}</span>
              </div>
              <div className="org">{e.org}</div>
              <p>{e.summary}</p>
              {e.bullets.length > 0 && (
                <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              )}
            </article>
          ))}
          <p className="cvp-earlier">{c.earlier}</p>
        </section>

        <section className="cvp-sec">
          <h2>{c.venturesTitle}</h2>
          <dl className="cvp-dl">
            {c.ventures.map((v) => (<div key={v.k}><dt>{v.k}</dt><dd>{v.v}</dd></div>))}
          </dl>
        </section>

        <div className="cvp-two">
          <section className="cvp-sec">
            <h2>{c.eduTitle}</h2>
            <dl className="cvp-dl">
              {c.education.map((v) => (<div key={v.k}><dt>{v.k}</dt><dd>{v.v}</dd></div>))}
            </dl>
          </section>
          <section className="cvp-sec">
            <h2>{c.skillsTitle}</h2>
            <dl className="cvp-dl">
              {c.skills.map((v) => (<div key={v.k}><dt>{v.k}</dt><dd>{v.v}</dd></div>))}
            </dl>
          </section>
        </div>

        <section className="cvp-sec">
          <h2>{c.langTitle}</h2>
          <p>{c.lang}</p>
        </section>

        <section className="cvp-sec">
          <h2>{c.personalTitle}</h2>
          <p>{c.personal}</p>
          <p className="cvp-refs">{c.refs}</p>
        </section>
      </main>
    </div>
  );
}
