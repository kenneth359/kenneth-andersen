import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Results from "@/components/Results";
import Expertise from "@/components/Expertise";
import Career from "@/components/Career";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Results />
        <Expertise />
        <Career />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
