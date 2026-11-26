"use client";
import Image from "next/image";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Cover() {
  const { lang } = useLang();
  const h = translations[lang].hero;

  return (
    <header className="pt-cover">
      <div className="shot" aria-hidden="true">
        <Image
          src="/assets/kenneth-portrett.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={88}
        />
      </div>

      <div className="pt-wrap pt-cover-body">
        <p className="eyebrow"><span className="nm">Kenneth Andersen</span> · {h.eyebrow}</p>
        <h1>
          <span className="sr-only">Kenneth Andersen: </span>
          <span className="ln"><span>{h.title[0]}</span></span>{" "}
          <span className="ln"><span>{h.title[1]}</span></span>
        </h1>
        <p className="lede">{h.sub}</p>
        <p className="pt-speaks">
          <span className="lbl">{h.speaksLabel}</span>{" "}
          <span className="rot" aria-hidden="true">
            <span className="rot-inner">
              {[...h.speaks, h.speaks[0]].map((w, i) => <span key={w + i}>{w}</span>)}
            </span>
          </span>
          <span className="sr-only">{h.speaks.join(", ")}</span>
        </p>
        <div className="acts">
          <a className="pt-btn" href="/cv">
            {h.ctaPrimary}
          </a>
          <a className="pt-btn-line" href="https://calendly.com/kenneth-andersen2/30min" target="_blank" rel="noopener noreferrer">{h.ctaSecondary}</a>
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
