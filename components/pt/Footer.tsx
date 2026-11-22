"use client";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { lang } = useLang();
  const { footer, nav, contact } = translations[lang];

  return (
    <footer className="pt-footer">
      <div className="pt-wrap">
        <div className="pt-footer-inner">
          <div>
            <div className="name">Kenneth Andersen</div>
            <p className="tag">{footer.tag}</p>
          </div>

          <div className="col">
            <h4>{lang === "no" ? "Naviger" : "Navigate"}</h4>
            {nav.links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          <div className="col">
            <h4>{lang === "no" ? "Kontakt" : "Contact"}</h4>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="pt-footer-bottom">
          <div>© {new Date().getFullYear()} <a href="https://kennethandersen.no">kennethandersen.no</a></div>
          <div>{contact.location}</div>
        </div>
      </div>
    </footer>
  );
}
