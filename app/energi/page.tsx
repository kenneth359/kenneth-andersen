import type { Metadata } from "next";
import SubPage from "@/components/pt/SubPage";

export const metadata: Metadata = {
  title: "Energi og elektrifisering | Kenneth Andersen",
  description: "Kenneth Andersen har over 20 års erfaring fra norsk energisektor: fagbrev, elkraftingeniør, ABB Marine, Statnett-leveranser, Kvilldal HVDC og mobil energi i Skagerak Energi.",
  alternates: { canonical: "https://kennethandersen.no/energi" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/energi",
    title: "Energi og elektrifisering — Kenneth Andersen",
    description: "Fra fagbrev som energimontør til selskapsbygging innen elektrifisering, batteri og lading.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

export default function Energi() {
  return (
    <SubPage
      eyebrow={"Energi og elektrifisering"}
      title={["Fra montørfaget", "til nye energiselskaper."]}
      lede={"Jeg har jobbet med kraftsystemet fra stolpen, fra verftene i Korea, fra entreprenørsiden mot Statnett og fra et energikonsern som bygger nye forretningsområder. Det gir et sjeldent helhetsbilde av hvordan teknologi, nett og kommersielle modeller henger sammen."}
      sections={[
  {
    "h2": "Norsk energisektor i endring",
    "paras": [
      "Elektrifisering av industri og transport, knapphet på nettkapasitet og nye krav til utslippsfrie byggeplasser skjer samtidig. Det åpner for nye forretningsmodeller der batteri, lading og fleksibilitet selges som tjeneste, ikke bare som utstyr.",
      "Ledere og styrer som skal ta beslutninger her, trenger både å forstå kraftsystemet og å kunne regne på kapitalbinding, utnyttelse og kontraktsrisiko."
    ]
  },
  {
    "h2": "Erfaring i sektoren",
    "items": [
      "Mobil energi for utslippsfrie byggeplasser: fra pilot i 2021 til eget selskap, samarbeid med Circle K fra 2023",
      "Vunnet konkurranse om batteri og lading for elfly på Bergen lufthavn Flesland",
      "Depotlading for tungtransport, energistyringssystemer (EMS) og fleksibilitetsmarkeder, med algotrader-pilot i Danmark",
      "To kontrakter på over 70 MNOK hver i OneCo: Kvilldal HVDC (tilbudsleder) og Songkjølen/Engerfjellet i konsortium med ABB",
      "Kvalifisering hos Statnett og Hafslund Nett, 145 kV gassisolert koblingsanlegg på Sildvik",
      "Idriftsettelse av kraft- og fremdriftssystemer for ABB Marine i Sør-Korea"
    ]
  }
]}
      faq={[
  {
    "q": "Hvilken teknisk bakgrunn har Kenneth Andersen?",
    "a": "Fagbrev som energimontør, bachelor i elkraftteknikk fra Universitetet i Sørøst-Norge og fire år som commissioning engineer for ABB Marine i Sør-Korea."
  },
  {
    "q": "Hva jobber han med i dag?",
    "a": "Han er senior forretningsutvikler for elektrifisering i Norden i Skagerak Energi, med ansvar for nye forretningsområder som mobil energi og depotlading for tungtransport."
  }
]}
      schema={{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Norsk energisektor i endring: hva ledere og styrer må forstå",
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
  "about": [
    "Norsk energisektor",
    "Elektrifisering",
    "Batterilagring",
    "Elkraft"
  ]
}}
    />
  );
}
