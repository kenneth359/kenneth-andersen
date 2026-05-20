import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interim CEO og interim ledelse | Kenneth Andersen",
  description:
    "Kenneth Andersen tar på seg interim CEO og COO-oppdrag i kritiske faser — eierskifter, snuoperasjoner og skalering. Erfaren norsk interimledelse i energi og teknologi.",
  alternates: { canonical: "https://kennethandersen.no/interim" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/interim",
    title: "Interim CEO Norge — Kenneth Andersen",
    description: "Interim CEO og COO med dokumentert track record. Operativ leder i kritiske faser for norske selskaper i energi og teknologi.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Hva er en interim CEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En interim CEO er en erfaren leder som midlertidig tar topplederstillingen i en organisasjon gjennom en kritisk fase — typisk ved eierskifte, snuoperasjon, plutselig lederavgang eller en ny strategisk satsing. Kenneth Andersen tilbyr interim CEO-tjenester med typisk mandat på 3–18 måneder."
      }
    },
    {
      "@type": "Question",
      "name": "Når passer interim ledelse fra Kenneth Andersen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Interim ledelse passer når selskapet trenger en operativ leder med tung erfaring raskt — ved eierskifter, når selskapet skal skaleres, ved en snuoperasjon, eller som bro mellom to permanente ledere. Kenneth Andersen har erfaring fra alle disse situasjonene i norsk energi og teknologi."
      }
    },
    {
      "@type": "Question",
      "name": "Hva koster en interim CEO i Norge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kostnaden for en interim CEO varierer med mandatets omfang og varighet. Kenneth Andersen tilbyr tydelig definerte engasjementer med klare KPI-er og overlevering til permanent ledelse. Ta kontakt for en innledende samtale."
      }
    }
  ]
};

export default function Interim() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <main style={{ background: "#0A0A0B", color: "#F2F2F0", minHeight: "100vh", padding: "120px 32px 80px", fontFamily: "var(--font-ibm-plex-sans, sans-serif)", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8E8E94", marginBottom: 24 }}>
          Interim ledelse
        </p>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24 }}>
          Operativ leder<br /><em style={{ fontFamily: "var(--font-instrument-serif, serif)", color: "#FF6B35", fontStyle: "italic", fontWeight: 400 }}>når det teller.</em>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#D4D4D2", maxWidth: 680, marginBottom: 48 }}>
          Når selskapet trenger en operativ leder gjennom en kritisk fase — eierskifte, snuoperasjon, ny satsing eller skalering. Korte, definerte mandater med tydelige resultatmål.
        </p>
        <section style={{ marginBottom: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { n: "3–18", label: "måneder", note: "Typisk mandatvarighet" },
            { n: "3", label: "selskaper", note: "Bygd fra grunnen av" },
            { n: "2×", label: "budsjett", note: "OneCo Elkraft, 12 mnd" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "28px 20px 24px 0", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <div style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1, color: "#F2F2F0" }}>{s.n}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#F2F2F0", marginTop: 8 }}>{s.label}</div>
              <div style={{ fontSize: 12, fontFamily: "var(--font-jetbrains-mono, monospace)", color: "#8E8E94", marginTop: 4 }}>{s.note}</div>
            </div>
          ))}
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
          Diskuter interim-oppdrag →
        </a>
      </main>
    </>
  );
}
