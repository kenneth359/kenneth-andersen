"use client";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { lang } = useLang();
  const { footer, nav, contact } = translations[lang];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="brand-block">
          <div className="brand">
            <span className="logomark">K</span>
            <span>kennethandersen<span style={{ color: "var(--accent)" }}>.no</span></span>
          </div>
          <p>{footer.tag}</p>
        </div>
        <div className="footer-col">
          <h4>{lang === "no" ? "Naviger" : "Navigate"}</h4>
          {nav.links.map((l) => <a key={l.href} href={l.href}>{l.label.toLowerCase()}</a>)}
        </div>
        <div className="footer-col">
          <h4>{lang === "no" ? "Kontakt" : "Contact"}</h4>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} <a href="https://kennethandersen.no">kennethandersen.no</a></div>
        <div>{lang === "no" ? "Langesund · Norge" : "Langesund · Norway"}</div>
      </div>
    </footer>
  );
}
