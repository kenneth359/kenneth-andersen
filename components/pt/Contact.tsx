"use client";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Contact() {
  const { lang } = useLang();
  const c = translations[lang].contact;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="kontakt" className="pt-wrap pt-sec">
      <div className="pt-sec-head">
        <h2>{c.heading}</h2>
      </div>

      <div className="pt-contact-grid">
        <div className="pt-contact">
          <h3>{c.sub}</h3>

          <div className="acts">
            <a className="pt-btn" href="https://calendly.com/kenneth-andersen2/30min" target="_blank" rel="noopener noreferrer">
              {c.bookCta}
            </a>
            <a className="pt-btn-line" href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
          </div>

          {status === "success" ? (
            <p className="pt-form msg ok" role="status">{c.form.success}</p>
          ) : (
            <form className="pt-form" onSubmit={handleSubmit}>
              <p className="bd">{c.orLabel}</p>

              <div className="pt-field-row">
                <div className="pt-field">
                  <label htmlFor="pt-name">{c.form.name}</label>
                  <input
                    id="pt-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="pt-field">
                  <label htmlFor="pt-email">{c.form.email}</label>
                  <input
                    id="pt-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-field">
                <label htmlFor="pt-msg">{c.form.message}</label>
                <textarea
                  id="pt-msg"
                  required
                  rows={5}
                  placeholder={c.form.messagePlaceholder}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {status === "error" && (
                <p className="msg err" role="alert">{c.form.error}</p>
              )}

              <div>
                <button type="submit" className="pt-btn-quiet" disabled={status === "sending"}>
                  {status === "sending" ? c.form.sending : c.form.submit}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="pt-side">
          <div className="block">
            <h4>{c.availTitle}</h4>
            <p>{c.avail}</p>
          </div>

          <div className="lines">
            <a href={`mailto:${c.email}`}>{c.email}</a>
            <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
            <a href={`https://${c.linkedin}`} target="_blank" rel="noopener noreferrer">{c.linkedin}</a>
            <span className="place">{c.location}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
