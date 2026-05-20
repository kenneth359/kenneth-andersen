import StatusBar from "@/components/StatusBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogoTicker from "@/components/LogoTicker";
import Origin from "@/components/Origin";
import OS from "@/components/OS";
import Track from "@/components/Track";
import Cases from "@/components/Cases";
import Services from "@/components/Services";
import Career from "@/components/Career";
import Testimonials from "@/components/Testimonials";
import Thoughts from "@/components/Thoughts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      <StatusBar />
      <Nav />
      <main style={{ paddingTop: 30 }}>
        <Hero />
        <LogoTicker />
        <Origin />
        <OS />
        <Track />
        <Cases />
        <Services />
        <Career />
        <Testimonials />
        <Thoughts />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
