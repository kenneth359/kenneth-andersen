import "./portrett.css";
import Nav from "@/components/pt/Nav";
import Cover from "@/components/pt/Cover";
import Plate from "@/components/pt/Plate";
import Contact from "@/components/pt/Contact";
import Footer from "@/components/pt/Footer";
import OriginFootnote from "@/components/pt/OriginFootnote";
import {
  Logos,
  Origin,
  Principles,
  Numbers,
  Cases,
  Services,
  Timeline,
  References,
  Notes,
} from "@/components/pt/Sections";

export default function Home() {
  return (
    <div className="pt">
      <Nav />
      <Cover />
      <main>
        <Logos />
        <Origin />

        <OriginFootnote />

        <Principles />

        {/* Beviset ligger på papir: siden snur, og snur tilbake etterpå. */}
        <div className="pt-light">
          <Numbers />
          <Cases />
        </div>

        <Services />
        <Plate src="/assets/kenneth-tedx.jpg" position="50% 2%" />
        <Timeline />
        <References />
        <Notes />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
