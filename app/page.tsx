import "./portrett.css";
import Nav from "@/components/pt/Nav";
import Cover from "@/components/pt/Cover";
import Contact from "@/components/pt/Contact";
import Footer from "@/components/pt/Footer";
import OriginFootnote from "@/components/pt/OriginFootnote";
import RevealObserver from "@/components/pt/RevealObserver";
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
  Timeline,
  References,
} from "@/components/pt/Sections";

export default function Home() {
  return (
    <div className="pt">
      <Nav />
      <Cover />
      <main>
        <Logos />
        <Lenses />
        <Origin />

        <OriginFootnote />

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
        <Timeline />
        <References />
        <Services />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </div>
  );
}
