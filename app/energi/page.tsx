import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energisektoren i Norge — rådgivning og kompetanse | Kenneth Andersen",
  description:
    "Kenneth Andersen er strategisk rådgiver med dyp ekspertise i norsk energisektor — fornybar energi, elkraft, offshore og energiomstilling. Bakgrunn fra ABB Marine, Skagerak Energi, OneCo og Otera Ratel.",
  alternates: { canonical: "https://kennethandersen.no/energi" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/energi",
    title: "Energirådgiver Norge — Kenneth Andersen",
    description: "Strategisk rådgiver og styremedlem i norsk energisektor. Bakgrunn fra elkraft, offshore og fornybar energi.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Norsk energisektor i transformasjon — hva ledere og styrer må forstå",
  "author": {
    "@type": "Person",
    "@id": "https://kennethandersen.no/#person",
    "name": "Kenneth Andersen"
  },
  "publisher": {
    "@type": "Person",
    "name": "Kenneth Andersen",
    "url": "https://kennethandersen.no"
  },
  "url": "https://kennethandersen.no/energi",
  "inLanguage": "nb",
  "about": ["Norsk energisektor", "Energiomstilling", "Fornybar energi", "Elkraft"],
  "keywords": "energirådgiver Norge, norsk energisektor, fornybar energi strategi, elkraft kompetanse, energiomstilling"
};

export default function Energi() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
      />
      <main style={{ background: "#0A0A0B", color: "#F2F2F0", minHeight: "100vh", padding: "120px 32px 80px", fontFamily: "var(--font-ibm-plex-sans, sans-serif)", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8E8E94", marginBottom: 24 }}>
          Energisektoren i Norge
        </p>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24 }}>
          Fra montørhender<br /><em style={{ fontFamily: "var(--font-instrument-serif, serif)", color: "#FF6B35", fontStyle: "italic", fontWeight: 400 }}>til styrerommet.</em>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#D4D4D2", maxWidth: 680, marginBottom: 48 }}>
          Kenneth Andersen kombinerer ingeniørens tekniske grunnlag med strategens helikopterblikk. Sjeldent å finne en rådgiver som har lagt kabel selv — og som forstår hva som faktisk driver verdiskaping i norsk energisektor.
        </p>

        <article style={{ maxWidth: 720 }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 20 }}>Norsk energisektor i transformasjon</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#D4D4D2", marginBottom: 20 }}>
            Norsk energisektor er midt i en historisk transformasjon. Elektrifisering av industri og transport, kraftunderskudd i Sør-Norge, vekst i havvind og datasentre — alt skjer samtidig. Ledere og styrer som mangler teknisk forståelse av kraftsystemet tar beslutninger på feil grunnlag.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#D4D4D2", marginBottom: 20 }}>
            Kenneth Andersen bringer en unik kombinasjon: fagbrev som energimontør, bachelor i elkraftteknikk, internasjonal erfaring fra maritime kraftsystemer (ABB Marine, Sør-Korea), og 15 år i kommersielle lederroller i sektoren. Det betyr at strategiske anbefalinger er forankret i teknisk virkelighet — ikke bare i konsulentmodeller.
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 16, marginTop: 40 }}>Nøkkelkompetanse i energisektoren</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Elkraft og kraftnett — fra distribusjon til HVDC-prosjekter",
              "Fornybar energi og energiomstilling — strategi og kommersialisering",
              "Mobile og utslippsfrie energiløsninger for bygg og anlegg",
              "Energy-as-a-Service og digitale plattformer for energistyring",
              "Partnerskap og distribusjonskanaler i energibransjen",
              "Offentlige anbudsprosesser og kvalifisering (Statnett, Hafslund Nett)",
            ].map((item, i) => (
              <li key={i} style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 13, color: "#D4D4D2", paddingLeft: 24, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#FF6B35" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 48, padding: "28px 32px", background: "#131316", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 14, borderLeft: "3px solid #FF6B35" }}>
            <p style={{ fontSize: 17, fontStyle: "italic", fontFamily: "var(--font-instrument-serif, serif)", color: "#D4D4D2", lineHeight: 1.5, margin: 0 }}>
              "Sjeldent å finne en konsernsjef som har lagt kabel selv. Den bredden gjør at jeg leser organisasjoner annerledes — og at de leser meg annerledes tilbake."
            </p>
            <p style={{ marginTop: 12, fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, color: "#8E8E94", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Kenneth Andersen
            </p>
          </div>
        </article>

        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/#kontakt" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", background: "#FF6B35", color: "#16100B", fontWeight: 600, borderRadius: 999, textDecoration: "none", fontSize: 14 }}>
            Book 30 min sparring →
          </a>
        </div>
      </main>
    </>
  );
}
