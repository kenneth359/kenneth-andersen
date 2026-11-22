"use client";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function OriginFootnote() {
  const { lang } = useLang();
  return (
    <section className="pt-pull">
      <div className="inner">
        <p>{translations[lang].origin.footnote}</p>
      </div>
    </section>
  );
}
