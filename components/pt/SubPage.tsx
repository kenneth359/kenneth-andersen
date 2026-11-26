import "@/app/portrett.css";

export type SubSection = {
  h2: string;
  paras?: string[];
  items?: string[];
};

export type SubPageProps = {
  eyebrow: string;
  title: [string, string];
  lede: string;
  sections: SubSection[];
  faq?: { q: string; a: string }[];
  schema?: object;
};

/* Undersider i samme designsystem som forsiden (Portrettet).
   Server-komponent: alt innhold ligger i HTML-en for søkemotorer og AI. */
export default function SubPage({ eyebrow, title, lede, sections, faq, schema }: SubPageProps) {
  const faqSchema = faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="pt">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
      )}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      )}

      <nav className="pt-nav">
        <div className="pt-nav-inner">
          <a href="/" className="name">Kenneth Andersen</a>
          <div className="pt-nav-right">
            <a href="/cv" className="pt-btn-line pt-sub-cv">Se full CV</a>
            <a href="/#kontakt" className="pt-btn pt-sub-cta">Kontakt</a>
          </div>
        </div>
      </nav>

      <main>
        <header className="pt-wrap pt-sub-head">
          <p className="pt-sub-eyebrow">{eyebrow}</p>
          <h1>
            {title[0]}
            <br />
            <span className="soft">{title[1]}</span>
          </h1>
          <p className="pt-sub-lede">{lede}</p>
        </header>

        {sections.map((s) => (
          <section className="pt-wrap pt-sec pt-sub-sec" key={s.h2}>
            <div className="pt-sec-head">
              <h2>{s.h2}</h2>
            </div>
            {s.paras?.map((p) => (
              <p className="pt-sec-lede" key={p.slice(0, 32)}>{p}</p>
            ))}
            {s.items && (
              <ul className="pt-sub-list">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            )}
          </section>
        ))}

        {faq && faq.length > 0 && (
          <section className="pt-wrap pt-sec pt-sub-sec">
            <div className="pt-sec-head">
              <h2>Spørsmål og svar</h2>
            </div>
            <div className="pt-sub-faq">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pt-wrap pt-sec pt-sub-end">
          <div className="pt-recr-acts">
            <a className="pt-btn" href="/#kontakt">Ta kontakt</a>
            <a className="pt-btn-line" href="/cv">Se full CV</a>
            <a className="pt-btn-line" href="/">Til forsiden</a>
          </div>
        </section>
      </main>

      <footer className="pt-footer">
        <div className="pt-wrap">
          <div className="pt-footer-bottom" style={{ marginTop: 0 }}>
            <div>© Kenneth Andersen · <a href="/">kennethandersen.no</a></div>
            <div>
              <a href="/strategi">Strategi</a> · <a href="/styrearbeid">Styrearbeid</a> · <a href="/interim">Interim</a> · <a href="/energi">Energi</a> · <a href="/ai-foredrag">AI-foredrag</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
