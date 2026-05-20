"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Nav() {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#" className="brand" aria-label="Kenneth Andersen">
          <span className="logomark">K</span>
          <span>
            kennethandersen<span style={{ color: "var(--accent)" }}>.no</span>
          </span>
        </a>
        <div className="nav-links">
          {t.links.map((l) => (
            <a key={l.href} href={l.href}>{l.label.toLowerCase()}</a>
          ))}
        </div>
        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === "no" ? "active" : ""} onClick={() => setLang("no")}>NO</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <a href="#kontakt" className="btn btn-primary btn-small">
            {t.cta}
            <span className="arrow" aria-hidden="true" />
          </a>
          <button className="btn-burger" aria-label="Menu" onClick={() => setOpen(!open)}>
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <path
                d={open ? "M2 2L20 12M2 12L20 2" : "M2 2H20M2 7H20M2 12H20"}
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          {t.links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label.toLowerCase()}</a>
          ))}
          <a
            href="#kontakt"
            className="btn btn-primary"
            style={{ marginTop: 12, justifyContent: "center" }}
            onClick={() => setOpen(false)}
          >
            {t.cta}<span className="arrow" aria-hidden="true" />
          </a>
        </div>
      )}
    </nav>
  );
}
