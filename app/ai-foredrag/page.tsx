import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-foredrag og kurs for styrer og ledergrupper | Kenneth Andersen",
  description:
    "Kenneth Andersen holder AI-foredrag og internkurs for styrer og ledergrupper i Norge. Praktisk kunstig intelligens fra en som selv har sittet i styrerommet og konsernledelsen.",
  alternates: { canonical: "https://kennethandersen.no/ai-foredrag" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/ai-foredrag",
    title: "AI-foredrag og kurs for styrer og ledergrupper — Kenneth Andersen",
    description: "Foredrag, internkurs og styreseminar om praktisk kunstig intelligens — for styrer og ledergrupper i norske virksomheter.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Hva koster et AI-foredrag i Norge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prisen varierer med format og lengde — et keynote-foredrag er typisk rimeligere enn et internkurs eller styreseminar over en halv eller hel dag. Ta kontakt for et konkret tilbud tilpasset deres ledergruppe eller styre."
      }
    },
    {
      "@type": "Question",
      "name": "Passer AI-kurs for vår ledergruppe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja — kursene er bygget for ledere og styremedlemmer som skal beslutte, ikke for utviklere som skal kode. Fokuset er hva AI faktisk endrer for strategi, drift og beslutninger, ikke teknisk implementasjon."
      }
    },
    {
      "@type": "Question",
      "name": "Foredrag vs. internkurs — hva er forskjellen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Et foredrag er en keynote på 30-60 minutter som gir retning og forståelse — typisk til kick-off, samling eller konferanse. Et internkurs er en workshop på halv eller hel dag der ledergruppen eller styret jobber med egne problemstillinger underveis."
      }
    },
    {
      "@type": "Question",
      "name": "Holder Kenneth foredrag om AI for styrer spesifikt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja — dette er kjernevinkelen. Kenneth har selv sittet i styrerom og konsernledelse, og foredragene er bygget for styrets perspektiv: hvilke spørsmål bør styret stille, hvor er risikoen, og hvor skaper AI faktisk verdi."
      }
    },
    {
      "@type": "Question",
      "name": "Kan Kenneth bygge en MVP eller prototype for oss, ikke bare snakke om det?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja — der det er relevant kombineres foredrag eller internkurs med praktisk MVP-bygging og rask markedstesting med AI-verktøy, som en del av et rådgivningsoppdrag. Dette gjøres gjennom den ordinære vekstrådgivningen, ikke som en del av selve foredraget."
      }
    }
  ]
};

export default function AiForedrag() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <main style={{ background: "#0A0A0B", color: "#F2F2F0", minHeight: "100vh", padding: "120px 32px 80px", fontFamily: "var(--font-ibm-plex-sans, sans-serif)", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8E8E94", marginBottom: 24 }}>
          Foredrag &amp; kurs · Kunstig intelligens
        </p>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, color: "#F2F2F0" }}>
          Kunstig intelligens<br /><em style={{ fontFamily: "var(--font-instrument-serif, serif)", color: "#FF6B35", fontStyle: "italic", fontWeight: 400 }}>for styrer og ledelse.</em>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#D4D4D2", maxWidth: 680, marginBottom: 48 }}>
          Kenneth Andersen holder AI-foredrag og internkurs for styrer, ledergrupper og bransjeorganisasjoner — bygget på 15 år operativ erfaring og eget styrearbeid, ikke generisk AI-hype.
        </p>
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 20 }}>Foredrag og temaer</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {["AI for styrerommet — hvilke spørsmål bør styret stille?", "Fra hype til drift — praktisk AI-implementering i virksomheten", "Fra idé til MVP — hvordan AI endrer innovasjonstrakten", "AI i energi- og industrisektoren", "Lederteamet og KI — hva må dere faktisk beslutte"].map((item, i) => (
              <li key={i} style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 14, color: "#D4D4D2", paddingLeft: 24, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#FF6B35" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ marginBottom: 56, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 20 }}>Format</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {["Keynote-foredrag (30–60 min) — til kick-off, samling eller konferanse", "Internkurs / workshop (halv- eller heldag) — ledergruppen jobber med egne problemstillinger", "Styreseminar — AI-forståelse spisset mot styrets rolle og ansvar"].map((item, i) => (
              <li key={i} style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 14, color: "#D4D4D2", paddingLeft: 24, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#FF6B35" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ marginBottom: 56, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 20 }}>Hvorfor Kenneth</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#D4D4D2", maxWidth: 680, marginBottom: 24 }}>
            Ikke bare foredrag om AI — Kenneth bruker det selv, i egne prosjekter, og kan vise til konkrete resultater:
          </p>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "AI-assistert produktutvikling: bygger og drifter selv produksjonskode med AI-kodeagenter (Claude Code) — denne nettsiden og Fundel-plattformen er begge utviklet på den måten",
              "MVP fra idé til marked: grunnla og bygde Fundel — sponsormarkedsplass for norske idrettslag — fra konsept til live plattform med Vipps- og kortbetaling",
              "Rask innovasjonstrakt: bruker AI til å gå fra idé til testbar prototype på dager i stedet for måneder, for å validere markedsrespons før full utvikling",
              "AI i go-to-market og markedsarbeid: samme metodikk som ligger bak posisjonering, innhold og SEO på denne siden",
            ].map((item, i) => (
              <li key={i} style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 14, color: "#D4D4D2", paddingLeft: 24, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#FF6B35" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ marginBottom: 56, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 20 }}>Spørsmål og svar</h2>
          {faqSchema.mainEntity.map((q, i) => (
            <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < faqSchema.mainEntity.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <h3 style={{ fontSize: 17, fontWeight: 500, color: "#F2F2F0", marginBottom: 10 }}>{q.name}</h3>
              <p style={{ fontSize: 15, color: "#8E8E94", lineHeight: 1.6, margin: 0 }}>{q.acceptedAnswer.text}</p>
            </div>
          ))}
        </section>
        <a href="/#kontakt" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", background: "#FF6B35", color: "#16100B", fontWeight: 600, borderRadius: 999, textDecoration: "none", fontSize: 14 }}>
          Book en prat om foredrag →
        </a>
      </main>
    </>
  );
}
