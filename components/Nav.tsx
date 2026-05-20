"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Nav() {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#om", label: t.about },
    { href: "#tjenester", label: t.services },
    { href: "#resultater", label: t.results },
    { href: "#kontakt", label: t.contact },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-xl font-bold tracking-wider text-white"
          style={{ fontFamily: "var(--font-inter), serif", letterSpacing: "0.15em" }}
        >
          <span className="text-[#D4AF37]">K</span>A
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-300 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/20 overflow-hidden text-xs">
            <button
              onClick={() => setLang("no")}
              className={`px-3 py-1 transition-colors duration-200 ${
                lang === "no"
                  ? "bg-[#D4AF37] text-[#0F172A] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              NO
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 transition-colors duration-200 ${
                lang === "en"
                  ? "bg-[#D4AF37] text-[#0F172A] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="#kontakt"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0F172A] text-sm font-semibold rounded-full hover:bg-[#E8CC6A] transition-colors duration-200"
          >
            {t.cta}
          </a>

          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0F172A]/95 backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#D4AF37] text-[#0F172A] text-sm font-semibold rounded-full hover:bg-[#E8CC6A] transition-colors mt-2"
          >
            {t.cta}
          </a>
        </div>
      )}
    </nav>
  );
}
