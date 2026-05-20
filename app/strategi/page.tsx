import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strategisk rådgivning | Kenneth Andersen",
  description:
    "Kenneth Andersen tilbyr strategisk rådgivning til styrer og ledelse i energi og teknologi. Strategi som lander i drift — fra veikart til gjennomføring.",
  alternates: { canonical: "https://kennethandersen.no/strategi" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/strategi",
    title: "Strategisk rådgivning — Kenneth Andersen",
    description: "Strategisk rådgivning, kommersiell modellering og go-to-market for norske selskaper i energi og teknologi.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Hva gjør en strategisk rådgiver i Norge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En strategisk rådgiver hjelper styrer og ledelse med langsiktig retning, prioriteringer og beslutningsgrunnlag. Kenneth Andersen tilbyr strategisk rådgivning med spesiell kompetanse på energi og teknologi — strategi som lander i drift, ikke bare på papiret."
      }
    },
    {
      "@type": "Question",
      "name": "Hvilke selskaper passer strategisk rådgivning fra Kenneth Andersen for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kenneth Andersen jobber med selskaper i energi, teknologi og infrastruktur som har høye ambisjoner og reelle utfordringer å løse — eierskifter, vekstfaser, digital transformasjon og go-to-market i nye markeder."
      }
    },
    {
      "@type": "Question",
      "name": "Hva koster strategisk rådgivning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Engasjementer skreddersys per oppdrag — typisk som månedlig retainer eller prosjektbasert. Ta kontakt for en innledende 30-minutters samtale."
      }
    }
  ]
};

export default function Strategi() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <main style={{ background: "#0A0A0B", color: "#F2F2F0", minHeight: "100vh", padding: "120px 32px 80px", fontFamily: "var(--font-ibm-plex-sans, sans-serif)", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8E8E94", marginBottom: 24 }}>
          Strategisk rådgivning
        </p>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, color: "#F2F2F0" }}>
          Strategi som lander<br /><em style={{ fontFamily: "var(--font-instrument-serif, serif)", color: "#FF6B35", fontStyle: "italic", fontWeight: 400 }}>i drift.</em>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#D4D4D2", maxWidth: 680, marginBottom: 48 }}>
          Kenneth Andersen er strategisk rådgiver for selskaper som vil koble ambisjon til gjennomføring — særlig der teknologi, energi og industri møter kommersiell vekst.
        </p>
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 20 }}>Hva tilbys</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {["Strategiutvikling og operasjonalisering fra veikart til gjennomføring", "Kommersiell modellering og forretningscaser som tåler due diligence", "Go-to-market og partnerstrategi i markeder uten fasit", "Digital transformasjon og AI som vekstdriver", "M&A-forberedelse og integrasjonsstøtte"].map((item, i) => (
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
          Book 30 min sparring →
        </a>
      </main>
    </>
  );
}
