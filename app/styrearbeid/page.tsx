import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styrearbeid og styremedlemskap | Kenneth Andersen",
  description:
    "Kenneth Andersen er sertifisert styremedlem med erfaring fra energi, teknologi og infrastruktur i Norge. Tilgjengelig for nye styreverv.",
  alternates: { canonical: "https://kennethandersen.no/styrearbeid" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/styrearbeid",
    title: "Styremedlem Kenneth Andersen — Energi og teknologi, Norge",
    description: "Sertifisert styremedlem med M&A-erfaring, kommersiell tyngde og gjennomføringskraft. Tilgjengelig for nye styreverv.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Hva bidrar Kenneth Andersen med som styremedlem?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kenneth Andersen bidrar med kommersiell tyngde, gjennomføringserfaring og governance-kompetanse. Spesialisert på energi, teknologi og infrastruktur. Har erfaring fra M&A-prosesser, fisjoner og strategiprosesser i norske vekstselskaper."
      }
    },
    {
      "@type": "Question",
      "name": "Hvilke selskaper passer Kenneth Andersen som styremedlem for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vekstselskaper i energi, teknologi og infrastruktur som trenger et aktivt styremedlem med operasjonell erfaring — særlig ved eierskifter, ekspansjon eller strategiske veivalg."
      }
    },
    {
      "@type": "Question",
      "name": "Er Kenneth Andersen sertifisert styremedlem?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja. Kenneth Andersen er sertifisert styremedlem gjennom Styreforeningen Norge."
      }
    }
  ]
};

export default function Styrearbeid() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <main style={{ background: "#0A0A0B", color: "#F2F2F0", minHeight: "100vh", padding: "120px 32px 80px", fontFamily: "var(--font-ibm-plex-sans, sans-serif)", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8E8E94", marginBottom: 24 }}>
          Styrearbeid
        </p>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, color: "#F2F2F0" }}>
          Aktivt <em style={{ fontFamily: "var(--font-instrument-serif, serif)", color: "#FF6B35", fontStyle: "italic", fontWeight: 400 }}>styremedlem</em>.<br />Ikke bare et navn på listen.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#D4D4D2", maxWidth: 680, marginBottom: 48 }}>
          Sertifisert styremedlem med erfaring fra energi-, teknologi- og infrastrukturselskaper. Bidrar med kommersiell tyngde, gjennomføringserfaring og aktiv utfordring av ledelsens antagelser.
        </p>
        <section style={{ marginBottom: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { title: "M&A og fisjon", desc: "Erfaring fra begge sider av transaksjoner — due diligence, forhandling og integrasjon." },
            { title: "Strategiprosesser", desc: "Setter krav til strategi som tåler operasjonell virkelighet, ikke bare styrerommet." },
            { title: "Kommersiell utfordring", desc: "Stiller de ubehagelige spørsmålene om inntektsmodell, marked og gjennomføringskraft." },
            { title: "Governance", desc: "Kjenn til NUES og norsk corporate governance. Erfaring fra vekstfaser og eierskifter." },
          ].map((card, i) => (
            <div key={i} style={{ padding: "28px 24px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, background: "#131316" }}>
              <h3 style={{ fontSize: 17, fontWeight: 500, color: "#FF6B35", marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: "#8E8E94", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
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
          Ta kontakt om styreverv →
        </a>
      </main>
    </>
  );
}
