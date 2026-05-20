"use client";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const CALENDLY_URL = "https://calendly.com/kenneth-andersen2/30min";

function HeroEyebrow({ text }: { text: string }) {
  const parts = text.split("·").map((s) => s.trim());
  return (
    <div className="hero-eyebrow">
      <span className="pulse" aria-hidden="true" />
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <span className="sep"> · </span>}
        </span>
      ))}
    </div>
  );
}

function HeroCTAs({ ctaPrimary, ctaSecondary }: { ctaPrimary: string; ctaSecondary: string; microProof: string }) {
  return (
    <>
      <div className="hero-ctas">
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {ctaPrimary}
          <span className="arrow" aria-hidden="true" />
        </a>
        <a href="#cases" className="btn btn-ghost">{ctaSecondary}</a>
      </div>
    </>
  );
}

function PhotoFrame({ src }: { src: string }) {
  const { lang } = useLang();
  return (
    <div className="photo-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Kenneth Andersen" loading="eager" />
      <div className="telemetry">REC · LIVE</div>
      <div className="corner tl" /><div className="corner tr" />
      <div className="corner bl" /><div className="corner br" />
      <div className="photo-meta">
        <span className="l">KA · 2024</span>
        <span className="l">{lang === "no" ? "PORTRETT" : "PORTRAIT"}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { lang } = useLang();
  const h = translations[lang].hero;

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="grid" />
        <div className="glow" />
        <div className="glow b" />
      </div>
      <div className="container">
        <div className="hero-v1">
          <div>
            <Reveal><HeroEyebrow text={h.eyebrow} /></Reveal>
            <Reveal delay={80} as="h1" className="">
              <span>{h.title[0]} </span>
              <span className="ital">{h.title[1]}</span>
            </Reveal>
            <Reveal delay={160}><p className="sub">{h.sub}</p></Reveal>
            <Reveal delay={240}>
              <HeroCTAs ctaPrimary={h.ctaPrimary} ctaSecondary={h.ctaSecondary} microProof={h.microProof} />
              <div className="hero-micro">
                <span className="dot" aria-hidden="true" />
                {h.microProof}
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <PhotoFrame src="/assets/kenneth-tedx.jpg" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
