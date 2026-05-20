"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";

const CALENDLY_URL = "https://calendly.com/kenneth-andersen2/30min";

export default function FloatingCTA() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => {
      const heroBottom = window.innerHeight;
      const contactEl = document.getElementById("kontakt");
      const contactTop = contactEl ? contactEl.getBoundingClientRect().top + window.scrollY : Infinity;
      const y = window.scrollY;
      setVisible(y > heroBottom * 0.8 && y < contactTop - window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`floating-cta btn btn-primary ${visible ? "visible" : ""}`}
    >
      {lang === "no" ? "Book 30 min" : "Book 30 min"}
      <span className="arrow" aria-hidden="true" />
    </a>
  );
}
