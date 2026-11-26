import type { Metadata } from "next";
import SubPage from "@/components/pt/SubPage";

export const metadata: Metadata = {
  title: "Styrearbeid og styremedlemskap | Kenneth Andersen",
  description: "Kenneth Andersen er sertifisert styremedlem med erfaring fra strategi, vekst og kapitalbeslutninger i energi, teknologi og infrastruktur.",
  alternates: { canonical: "https://kennethandersen.no/styrearbeid" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/styrearbeid",
    title: "Styremedlem Kenneth Andersen — energi og teknologi",
    description: "Sertifisert styremedlem med erfaring fra strategi, vekst og selskapsbygging.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

export default function Styrearbeid() {
  return (
    <SubPage
      eyebrow={"Styrearbeid"}
      title={["Styremedlem med", "erfaring fra drift."]}
      lede={"Sertifisert styremedlem gjennom Styreforeningen. Jeg har sittet i styret i en elektroentreprenør og en næringsklynge, og har selv vært daglig leder og rapportert til styrer. Jeg vet hvilke spørsmål som er nyttige å få fra et styre, og hvilke som bare skaper arbeid."}
      sections={[
  {
    "h2": "Hva jeg bidrar med",
    "items": [
      "Kommersiell vurdering av strategi, marked og inntektsmodell",
      "Erfaring fra etablering, vekst og eierskifte, både fra styret og fra ledelsen",
      "Kapitalbeslutninger og investeringscase som tåler gjennomgang",
      "Teknisk forståelse av kraftsystem, batteri, lading og energiinfrastruktur",
      "Praktisk AI-forståelse for styrets risiko- og mulighetsbilde"
    ]
  },
  {
    "h2": "Styreverv",
    "items": [
      "Laugstol AS, styremedlem 2021–2024: strategi, økonomisk oppfølging og forretningsutvikling",
      "Vindmuligheter AS, styremedlem 2019–2021: næringsklynge for vindkraftindustrien",
      "Fundel AS, gründer 2025 – i dag"
    ]
  }
]}
      faq={[
  {
    "q": "Er Kenneth Andersen sertifisert styremedlem?",
    "a": "Ja, gjennom Styreforeningen."
  },
  {
    "q": "Hvilke selskaper passer han for?",
    "a": "Vekstselskaper og etablerte selskaper i energi, teknologi og infrastruktur som trenger et aktivt styremedlem med kommersiell og operativ erfaring, særlig ved vekst, eierskifte eller strategiske veivalg."
  },
  {
    "q": "Er han åpen for nye styreverv?",
    "a": "Ja, for et begrenset antall verv der erfaringen er relevant. Ta kontakt for en samtale."
  }
]}
    />
  );
}
