import type { Metadata } from "next";
import SubPage from "@/components/pt/SubPage";

export const metadata: Metadata = {
  title: "AI-foredrag og kurs for styrer og ledergrupper | Kenneth Andersen",
  description: "Kenneth Andersen holder foredrag og interne kurs om praktisk AI for styrer og ledergrupper. Basert på egen daglig bruk i forretningsutvikling og produktbygging.",
  alternates: { canonical: "https://kennethandersen.no/ai-foredrag" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/ai-foredrag",
    title: "AI-foredrag og kurs for styrer og ledergrupper — Kenneth Andersen",
    description: "Foredrag, interne kurs og styreseminar om praktisk kunstig intelligens.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

export default function AiForedrag() {
  return (
    <SubPage
      eyebrow={"Foredrag og kurs · Kunstig intelligens"}
      title={["Praktisk AI", "for styrer og ledere."]}
      lede={"Jeg bruker AI hver dag i markedsanalyse, beslutningsstøtte og produktutvikling, og har laget både denne siden og prototyper for Fundel med AI. Foredragene handler om hva det faktisk endrer for strategi, drift og beslutninger."}
      sections={[
  {
    "h2": "Temaer",
    "items": [
      "AI i styrerommet: hvilke spørsmål bør styret stille, og hvor ligger risikoen?",
      "Fra hype til drift: hva som faktisk gir verdi i en norsk virksomhet",
      "Fra idé til prototype på dager: hvordan AI endrer innovasjonsarbeidet",
      "AI i energi og industri",
      "Hva ledergruppen faktisk må beslutte om AI"
    ]
  },
  {
    "h2": "Format",
    "items": [
      "Foredrag på 30–60 minutter til kick-off, samling eller konferanse",
      "Internt kurs eller workshop på en halv eller hel dag, der dere jobber med egne problemstillinger",
      "Styreseminar spisset mot styrets rolle og ansvar"
    ]
  },
  {
    "h2": "Hvorfor meg",
    "items": [
      "Lager selv prototyper og arbeidsverktøy med AI. Denne siden er skrevet og bygget med Claude Code",
      "Ledet utviklingen av Fundel fra konsept til publisert plattform, og fordypet meg gjennom VibeLabs Masterclass",
      "Bruker AI i go-to-market, analyse og beslutningsgrunnlag i egen lederrolle",
      "Erfaring fra styre og ledelse, så foredraget handler om beslutninger, ikke verktøydemonstrasjoner"
    ]
  }
]}
      faq={[
  {
    "q": "Hva koster et AI-foredrag?",
    "a": "Det avhenger av format og lengde. Et foredrag koster mindre enn et internt kurs eller et styreseminar over en halv eller hel dag. Ta kontakt for et konkret tilbud."
  },
  {
    "q": "Passer dette for en ledergruppe uten teknisk bakgrunn?",
    "a": "Ja. Kursene er laget for ledere og styremedlemmer som skal beslutte, ikke for utviklere."
  },
  {
    "q": "Hva er forskjellen på foredrag og internt kurs?",
    "a": "Et foredrag på 30–60 minutter gir retning og felles forståelse. Et internt kurs er en workshop på en halv eller hel dag der dere jobber med egne problemstillinger."
  }
]}
    />
  );
}
