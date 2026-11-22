"use client";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Nav() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const t = translations[lang].nav;

  return (
    <nav className="pt-nav">
      <div className="pt-nav-inner">
        <a href="#" className="name">Kenneth Andersen</a>

        <div className="pt-nav-links">
          {t.links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>

        <div className="pt-nav-right">
          <div className="pt-lang" role="group" aria-label={lang === "no" ? "Språk" : "Language"}>
            <button
              className={lang === "no" ? "on" : ""}
              aria-pressed={lang === "no"}
              onClick={() => setLang("no")}
            >
              NO
            </button>
            <button
              className={lang === "en" ? "on" : ""}
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>

          <a href="#kontakt" className="pt-btn pt-nav-cta">{t.cta}</a>

          <button
            className="pt-burger"
            aria-label={open ? (lang === "no" ? "Lukk meny" : "Close menu") : (lang === "no" ? "Åpne meny" : "Open menu")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
              <path
                d={open ? "M2 2L20 12M2 12L20 2" : "M2 2H20M2 7H20M2 12H20"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="pt-mobile">
          {t.links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#kontakt" className="pt-btn" onClick={() => setOpen(false)}>{t.cta}</a>
        </div>
      )}
    </nav>
  );
}
