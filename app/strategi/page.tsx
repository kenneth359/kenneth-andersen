import type { Metadata } from "next";
import SubPage from "@/components/pt/SubPage";

export const metadata: Metadata = {
  title: "Strategi og forretningsutvikling | Kenneth Andersen",
  description: "Kenneth Andersen jobber med strategi, forretningsmodeller og go-to-market for nye forretningsområder i energi og teknologi. Fra business case til selskap i drift.",
  alternates: { canonical: "https://kennethandersen.no/strategi" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/strategi",
    title: "Strategi og forretningsutvikling — Kenneth Andersen",
    description: "Strategi, business case og go-to-market for nye forretningsområder i energi og teknologi.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

export default function Strategi() {
  return (
    <SubPage
      eyebrow={"Strategi og forretningsutvikling"}
      title={["Strategi som ender", "i et selskap i drift."]}
      lede={"Jeg har brukt de siste årene på å ta nye forretningsområder fra idé til egne virksomheter. Strategiarbeidet mitt starter derfor med kunden og regnestykket, og slutter ikke før noen faktisk leverer."}
      sections={[
  {
    "h2": "Hva jeg jobber med",
    "items": [
      "Forretningsmodeller og investeringscase med CAPEX, OPEX, NPV, IRR og risiko",
      "Go-to-market og partnerstrategi i markeder som ikke er etablert ennå",
      "Sammenligning av kjøp, leie og energi som tjeneste",
      "Beslutningsgrunnlag for ledelse og styre som skiller dokumentert fra antatt",
      "Praktisk bruk av AI i analyse, markedsarbeid og beslutningsstøtte"
    ]
  },
  {
    "h2": "Hvor erfaringen kommer fra",
    "paras": [
      "I Skagerak Energi bygde jeg Skagerak Mobil Energi fra pilot i 2021 til eget selskap i kommersiell drift, omtalt i TU som verdens største offgrid-batteri for byggeplasser, og vant konkurransen hos Avinor om lading av elfly. I OneCo ledet jeg marked og forretningsutvikling i en periode med vekst på mer enn det dobbelte av budsjett. I Otera Ratel etablerte jeg en ny virksomhet i Norge fra null.",
      "Ved siden av lederrollen tar jeg et begrenset antall sparringsoppdrag for eiere, ledere og vekstselskaper."
    ]
  }
]}
      faq={[
  {
    "q": "Hva slags strategioppdrag tar Kenneth Andersen?",
    "a": "Avgrensede oppdrag for eiere, ledere og vekstselskaper som skal ta et produkt eller nytt forretningsområde til marked: forretningsmodell, investeringscase, go-to-market og kommersiell due diligence."
  },
  {
    "q": "Hvilke bransjer?",
    "a": "Energi, kraft, elektrifisering, industri og teknologi, særlig der teknisk løsning og kommersiell modell må utvikles samtidig."
  },
  {
    "q": "Hvordan starter et samarbeid?",
    "a": "Med en samtale på 30 minutter. Ta kontakt via skjemaet på forsiden, på e-post eller telefon."
  }
]}
    />
  );
}
