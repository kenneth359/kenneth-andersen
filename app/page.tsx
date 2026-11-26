import "./portrett.css";
import Nav from "@/components/pt/Nav";
import Cover from "@/components/pt/Cover";
import Contact from "@/components/pt/Contact";
import Footer from "@/components/pt/Footer";
import RevealObserver from "@/components/pt/RevealObserver";
import { translations } from "@/lib/translations";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: translations.no.faq.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
import {
  Logos,
  Origin,
  Role,
  Lenses,
  AiWork,
  Personal,
  PersonalPlate,
  Ventures,
  Press,
  Recruiters,
  Principles,
  Numbers,
  Cases,
  Services,
  Faq,
  References,
} from "@/components/pt/Sections";

export default function Home() {
  return (
    <div className="pt">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <Cover />
      <main>
        <Logos />
        <Lenses />
        <Origin />

        <Role />
        <Principles />

        {/* Beviset ligger på papir: siden snur, og snur tilbake etterpå. */}
        <div className="pt-light">
          <Numbers />
          <Cases />
          <Press />
        </div>

        <Recruiters />

        <AiWork />
        <Ventures />
        <PersonalPlate />
        <Personal />
        <References />
        <Services />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </div>
  );
}
