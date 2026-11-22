"use client";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const LINKEDIN = "https://linkedin.com/in/kennethandersenstrategy";

const ARC_START = 2003;
const ARC_END = 2026;

function startYear(span: string): number {
  const m = span.match(/\d{4}/);
  return m ? Number(m[0]) : ARC_START;
}

function CareerArc({ points }: { points: { year: number; label: string }[] }) {
  return (
    <div className="pt-arc" aria-hidden="true">
      <div className="ends">
        <span>{ARC_START}</span>
        <span>{ARC_END}</span>
      </div>
      <div className="line">
        {points.map((p, i) => {
          const pct = ((p.year - ARC_START) / (ARC_END - ARC_START)) * 100;
          const last = i === points.length - 1;
          return (
            <span key={p.label}>
              <span className="node" style={{ left: `${pct}%` }} />
              <span className={`tick ${last ? "last" : ""}`} style={{ left: `${pct}%` }}>
                <b>{p.label}</b>
                {p.year}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function splitLede(lede: string): [string, string] {
  const i = lede.indexOf(". ");
  if (i === -1) return [lede, ""];
  return [lede.slice(0, i + 1), lede.slice(i + 2)];
}

export function Logos() {
  const { lang } = useLang();
  const { logos } = translations[lang];
  return (
    <section className="pt-logos">
      <div className="pt-wrap inner">
        <span className="label">{logos.label}</span>
        <ul>
          {logos.items.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function Origin() {
  const { lang } = useLang();
  const o = translations[lang].origin;
  const [big, after] = splitLede(o.lede);

  return (
    <section id="opprinnelse">
      <div className="pt-wrap pt-statement">
        <p className="big">{big}</p>
        <p className="after">{after}</p>
      </div>

      <div className="pt-wrap pt-sec">
        <div className="pt-sec-head">
          <h2>{o.heading}</h2>
          <span className="side">{ARC_START} &ndash; {lang === "no" ? "i dag" : "today"}</span>
        </div>

        <CareerArc points={o.chapters.map((c) => ({ year: startYear(c.year), label: c.label }))} />

        {o.chapters.map((c) => (
          <article className="pt-row" key={c.year + c.title}>
            <div className="meta">
              <div>{c.year}</div>
              <div>{c.label}</div>
            </div>
            <h3 className="ttl">{c.title}</h3>
            <p className="bd">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Principles() {
  const { lang } = useLang();
  const os = translations[lang].os;
  return (
    <section id="operativsystem" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{os.heading}</h2>
      </div>
      <p className="pt-sec-lede">{os.sub}</p>

      <div className="pt-princs">
        {os.pillars.map((p) => (
          <article className="pt-princ" key={p.title}>
            <h3>{p.title}</h3>
            <div>
              <p className="bd">{p.body}</p>
              <p className="proof">{p.proof}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Numbers() {
  const { lang } = useLang();
  const t = translations[lang].track;
  return (
    <section id="track" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{t.heading}</h2>
        <span className="side">{t.sub}</span>
      </div>
      <div className="pt-figs">
        {t.stats.map((s) => (
          <div className="pt-fig" key={s.label + s.value}>
            <div className="v">{s.value}</div>
            <div>
              <div className="l">{s.label}</div>
              <div className="n">{s.note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Cases() {
  const { lang } = useLang();
  const c = translations[lang].cases;
  return (
    <section id="cases" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{c.heading}</h2>
      </div>
      {c.items.map((it) => (
        <article className="pt-case" key={it.company}>
          <div className="left">
            <div className="company">{it.company}</div>
            <div className="tag">{it.tag}</div>
            <div className="period">{it.period}</div>
          </div>
          <div className="right">
            <h3>{it.title}</h3>
            <p className="bd">{it.body}</p>
            <ul>
              {it.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}

export function Services() {
  const { lang } = useLang();
  const s = translations[lang].services;
  return (
    <section id="tjenester" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{s.heading}</h2>
      </div>
      <p className="pt-sec-lede">{s.sub}</p>
      <div className="pt-svcs">
        {s.items.map((it) => (
          <article className="pt-svc" key={it.title}>
            <div className="tag">{it.tag}</div>
            <h3>{it.title}</h3>
            <p className="bd">{it.body}</p>
            <ul>
              {it.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Timeline() {
  const { lang } = useLang();
  const c = translations[lang].career;
  return (
    <section id="karriere" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{c.heading}</h2>
      </div>

      <div className="pt-tl">
        <div className="pt-tl-group">
          {c.roles.map((r, i) => (
            <div className={`pt-tl-row ${i === 0 ? "now" : ""}`} key={r.period + r.title}>
              <div className="p">{r.period}</div>
              <div className="t">{r.title}</div>
              <div className="c">{r.company}</div>
            </div>
          ))}
        </div>

        <div className="pt-tl-group">
          <h3>{c.boardLabel}</h3>
          {c.boards.map((b) => (
            <div className="pt-tl-row" key={b.period + b.company}>
              <div className="p">{b.period}</div>
              <div className="t">{b.title}</div>
              <div className="c">{b.company}</div>
            </div>
          ))}
        </div>

        <div className="pt-tl-group">
          <h3>{c.eduLabel}</h3>
          {c.edu.map((e) => (
            <div className="pt-tl-row" key={e.year + e.title}>
              <div className="p">{e.year}</div>
              <div className="t">{e.title}</div>
              <div className="c">{e.school}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function References() {
  const { lang } = useLang();
  const t = translations[lang].testimonials;
  return (
    <section id="referanser" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{t.heading}</h2>
        <span className="side">{t.sub}</span>
      </div>
      <div className="pt-refs">
        {t.items.map((r) => (
          <figure className="pt-ref" key={r.name + r.rel}>
            <blockquote>{r.quote}</blockquote>
            <figcaption className="who">
              <span className="n">{r.name}</span>
              <span className="r">{r.role}</span>
              <span className="r">{r.rel}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Notes() {
  const { lang } = useLang();
  const t = translations[lang].thoughts;
  return (
    <section id="tankegods" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{t.heading}</h2>
        <span className="side">{t.sub}</span>
      </div>
      <div className="pt-notes">
        {t.items.map((n) => (
          <article className="pt-note" key={n.title}>
            <div className="k">{n.tag}</div>
            <h3 className="t">{n.title}</h3>
            <div className="s">{n.date}</div>
          </article>
        ))}
      </div>
      <div style={{ marginTop: 36 }}>
        <a className="pt-btn-quiet" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          {t.cta}
        </a>
      </div>
    </section>
  );
}
