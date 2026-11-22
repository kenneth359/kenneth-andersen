"use client";
import Image from "next/image";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const CALENDLY_URL = "https://calendly.com/kenneth-andersen2/30min";

export default function Cover() {
  const { lang } = useLang();
  const h = translations[lang].hero;

  return (
    <header className="pt-cover">
      <div className="shot" aria-hidden="true">
        <Image
          src="/assets/kenneth-studio.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={88}
        />
      </div>

      <div className="pt-wrap pt-cover-body">
        <h1>
          <span className="ln"><span>{h.title[0]}</span></span>
          <span className="ln"><span>{h.title[1]}</span></span>
        </h1>
        <p className="lede">{h.sub}</p>
        <div className="acts">
          <a className="pt-btn" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            {h.ctaPrimary}
          </a>
          <a className="pt-btn-line" href="#tjenester">{h.ctaSecondary}</a>
        </div>
      </div>

      <div className="pt-availbar">
        <div className="pt-wrap">
          <p className="pt-avail">{h.microProof}</p>
        </div>
      </div>
    </header>
  );
}
