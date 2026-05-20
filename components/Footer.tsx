"use client";

import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { lang } = useLang();
  const t = translations[lang].footer;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#080E1A] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-bold">KA</span>
          <span>· Kenneth Andersen · © {year} · {t.rights}</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/in/kennethandersenstrategy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:kenneth.andersen2@gmail.com"
            className="hover:text-white transition-colors"
          >
            E-post
          </a>
          <a
            href="tel:+4740237351"
            className="hover:text-white transition-colors"
          >
            +47 402 37 351
          </a>
        </div>
      </div>
    </footer>
  );
}
