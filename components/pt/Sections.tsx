"use client";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import CountUp from "./CountUp";
import Plate from "./Plate";

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
    <section className="pt-logos" aria-label={logos.label}>
      <div className="pt-wrap">
        <span className="label">{logos.label}</span>
      </div>
      <div className="pt-marquee">
        <ul className="pt-marquee-track">
          {logos.items.map((n) => <li key={n}>{n}</li>)}
        </ul>
        <ul className="pt-marquee-track" aria-hidden="true">
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

export function Lenses() {
  const { lang } = useLang();
  const l = translations[lang].lenses;
  return (
    <section id="bredde" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{l.heading}</h2>
        <span className="side">{l.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{l.sub}</p>
      <div className="pt-lenses">
        {l.items.map((it) => (
          <article className="pt-lens pt-reveal" key={it.role}>
            <div className="role">{it.role}</div>
            <h3>{it.q}</h3>
            <p className="bd">{it.body}</p>
            <p className="proof">{it.proof}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Role() {
  const { lang } = useLang();
  const r = translations[lang].role;
  const cols = [r.build, r.lead];
  return (
    <section id="rolle" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{r.heading}</h2>
        <span className="side">{r.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{r.sub}</p>

      <div className="pt-role">
        {cols.map((c) => (
          <div className="pt-role-col pt-reveal" key={c.title}>
            <h3>{c.title}</h3>
            <ol>
              {c.items.map((it) => <li key={it}>{it}</li>)}
            </ol>
            <p className="note">{c.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AiWork() {
  const { lang } = useLang();
  const a = translations[lang].ai;
  return (
    <section id="ai" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{a.heading}</h2>
        <span className="side">{a.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{a.sub}</p>

      <dl className="pt-ai">
        {a.areas.map((x) => (
          <div className="pt-reveal" key={x.k}>
            <dt>{x.k}</dt>
            <dd>{x.v}</dd>
          </div>
        ))}
      </dl>

      <div className="pt-ai-ex">
        <h3>{a.examplesTitle}</h3>
        <ul>
          {a.examples.map((x) => (
            <li className="pt-reveal" key={x.from}>
              <span className="from">{x.from}</span>
              <span className="arrow" aria-hidden="true">→</span>
              <span className="to">{x.to}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-ai-tools">
        <span className="label">{a.toolsLabel}</span>
        <ul>
          {a.tools.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <div className="pt-recr-acts">
        <p className="pt-ai-note">{a.note}</p>
        <a className="pt-btn-line" href="/ai-foredrag">{a.cta}</a>
      </div>
    </section>
  );
}

export function Personal() {
  const { lang } = useLang();
  const p = translations[lang].personal;
  return (
    <section id="personlig" className="pt-wrap pt-sec pt-personal">
      <div className="pt-sec-head">
        <h2>{p.heading}</h2>
        <span className="side">{p.eyebrow}</span>
      </div>
      <p className="pt-personal-body pt-reveal">{p.body}</p>
    </section>
  );
}

export function PersonalPlate() {
  const { lang } = useLang();
  return (
    <Plate
      src="/assets/kenneth-tedx.jpg"
      position="50% 2%"
      line={translations[lang].personal.plateLine}
    />
  );
}

export function Press() {
  const { lang } = useLang();
  const p = translations[lang].press;
  return (
    <section id="omtale" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{p.heading}</h2>
        <span className="side">{p.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{p.sub}</p>
      <ul className="pt-press">
        {p.items.map((it) => (
          <li className="pt-reveal" key={it.url}>
            <a href={it.url} target="_blank" rel="noopener noreferrer">
              <span className="meta">{it.outlet} · {it.date}</span>
              <span className="t">{it.title}</span>
              <span className="n">{it.note}</span>
              <span className="go" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Ventures() {
  const { lang } = useLang();
  const v = translations[lang].ventures;
  return (
    <section id="selskapsbygging" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{v.heading}</h2>
        <span className="side">{v.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{v.sub}</p>
      <div className="pt-svcs">
        {v.items.map((it) => (
          <article className="pt-svc pt-reveal" key={it.title}>
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

export function Recruiters() {
  const { lang } = useLang();
  const r = translations[lang].recruiters;
  return (
    <section id="rekrutterere" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{r.heading}</h2>
        <span className="side">{r.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{r.sub}</p>

      <div className="pt-recr">
        <div>
          <h3>{r.fitTitle}</h3>
          <ul className="fit">
            {r.fit.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div>
          <h3>{r.factsTitle}</h3>
          <dl className="facts">
            {r.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pt-recr-acts">
        <a className="pt-btn" href="/cv">{r.cta}</a>
        <a className="pt-btn-line" href="/cv?print=1">{r.ctaPrint}</a>
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
          <article className="pt-princ pt-reveal" key={p.title}>
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
          <div className="pt-fig pt-reveal" key={s.label + s.value}>
            <div className="v"><CountUp value={s.value} /></div>
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
        <article className="pt-case pt-reveal" key={it.company}>
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
        <span className="side">{s.eyebrow}</span>
      </div>
      <p className="pt-sec-lede">{s.sub}</p>
      <div className="pt-svcs pt-svcs-3">
        {s.items.map((it) => (
          <article className="pt-svc pt-reveal" key={it.title}>
            <div className="tag">{it.tag}</div>
            <h3>{it.title}</h3>
            <p className="bd">{it.body}</p>
            <ul>
              {it.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a className="pt-btn-line pt-svc-link" href={it.link.href}>{it.link.label}</a>
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
