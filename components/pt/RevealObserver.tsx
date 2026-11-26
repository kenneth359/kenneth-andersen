"use client";
import { useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";

/* Legger klassen «in» på .pt-reveal-elementer når de kommer inn i bildet.
   Uten JS, eller med redusert bevegelse, vises alt med en gang (se CSS). */
export default function RevealObserver() {
  const { lang } = useLang();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("pt-js");

    const els = Array.from(document.querySelectorAll<HTMLElement>(".pt-reveal:not(.in)"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [lang]);

  return null;
}
