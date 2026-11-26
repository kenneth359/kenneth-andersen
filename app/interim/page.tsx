import type { Metadata } from "next";
import SubPage from "@/components/pt/SubPage";

export const metadata: Metadata = {
  title: "Interim ledelse og etablering | Kenneth Andersen",
  description: "Kenneth Andersen har vært konstituert daglig leder i Skagerak Mobil Energi og etablerte Otera Ratel i Norge som daglig leder. Erfaring fra oppbygging og eierskifte.",
  alternates: { canonical: "https://kennethandersen.no/interim" },
  openGraph: {
    type: "website",
    url: "https://kennethandersen.no/interim",
    title: "Interim ledelse og etablering — Kenneth Andersen",
    description: "Konstituert daglig leder i oppbyggingsfase og daglig leder ved etablering og eierskifte.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-tedx.jpg", width: 1200, height: 800 }],
  },
};

export default function Interim() {
  return (
    <SubPage
      eyebrow={"Interim ledelse"}
      title={["Ledelse i faser der", "alt er nytt."]}
      lede={"Mine lederroller har stort sett vært i faser der selskapet ennå ikke var ferdig: etablering, oppbygging og eierskifte. Der trengs det noen som både kan sette retning og gjøre jobben selv."}
      sections={[
  {
    "h2": "Erfaring",
    "items": [
      "Konstituert daglig leder i Skagerak Mobil Energi (jun.–nov. 2024): økonomi, budsjett, likviditet, kunder, partnere og styrerapportering i etableringsfasen",
      "Daglig leder i Otera Ratel AS (2017–2018): etablerte den norske virksomheten fra null, kvalifiserte selskapet hos Statnett og Hafslund Nett og fulgte det gjennom eierskifte",
      "Direktør og ledergruppemedlem i OneCo Sør (2018–2020) i en periode med kraftig vekst"
    ]
  },
  {
    "h2": "Hva jeg tar med inn",
    "paras": [
      "Tydelige mål for perioden, en KPI-struktur som gir styret innsyn, og en plan for hvem som tar over. Jeg prioriterer kunder og likviditet først, og bygger organisasjonen rundt det som faktisk må leveres."
    ]
  }
]}
      faq={[
  {
    "q": "Hvilken interim-erfaring har Kenneth Andersen?",
    "a": "Han var konstituert daglig leder i Skagerak Mobil Energi fra juni til november 2024, i selskapets etableringsfase. Tidligere var han daglig leder i Otera Ratel AS, der han etablerte den norske virksomheten og fulgte den gjennom eierskifte."
  },
  {
    "q": "Hvilke situasjoner passer han best for?",
    "a": "Etablering av nye selskaper og forretningsområder, oppbyggingsfaser og eierskifter i energi, kraft og teknologi."
  }
]}
    />
  );
}
