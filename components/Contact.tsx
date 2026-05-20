"use client";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const CALENDLY_URL = "https://calendly.com/kenneth-andersen2/30min";

function CalendarPreview() {
  const { lang } = useLang();
  const today = new Date();
  const monthName = today.toLocaleString(lang === "no" ? "nb-NO" : "en-US", { month: "long", year: "numeric" });
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const dows = lang === "no" ? ["M", "T", "O", "T", "F", "L", "S"] : ["M", "T", "W", "T", "F", "S", "S"];
  const availDays = new Set<number>();
  for (let d = today.getDate() + 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 2 || dow === 3 || dow === 4) availDays.add(d);
  }
  return (
    <div className="calendar-preview">
      <div className="head">
        <span>{monthName}</span>
        <span>{lang === "no" ? "neste slots" : "next slots"}</span>
      </div>
      <div className="calendar-grid">
        {dows.map((d, i) => <div key={`dow${i}`} className="dow">{d}</div>)}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} className="day muted" />;
          const isToday = d === today.getDate();
          const isAvail = availDays.has(d);
          const cls = isToday ? "today" : isAvail ? "avail" : "muted";
          return (
            <a key={`d${d}`} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
              className={`day ${cls}`} style={{ textDecoration: "none" }}>
              {d}
            </a>
          );
        })}
      </div>
    </div>
  );
}

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
    <section id="kontakt" className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="label-col">
            <span className="num">09 / 09</span>
            <span className="eyebrow"><span className="dot" />{c.eyebrow}</span>
          </div>
          <h2 className="h-section">
            {lang === "no"
              ? <>La oss <span className="accent-italic">snakke</span>.</>
              : <>Let&apos;s <span className="accent-italic">talk</span>.</>}
          </h2>
        </Reveal>
        <div className="contact-grid">
          <Reveal>
            <div className="contact-card">
              <h3>
                {lang === "no"
                  ? <>Den enkleste veien inn er en <span className="it">30-minutters samtale</span>.</>
                  : <>Easiest way in is a <span className="it">30-minute call</span>.</>}
              </h3>
              <p>{c.sub}</p>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                {c.bookCta}<span className="arrow" aria-hidden="true" />
              </a>
              <div className="or-label">{c.orLabel}</div>

              {/* Contact form */}
              {status === "success" ? (
                <div style={{ padding: "20px 0", color: "var(--ok)", fontFamily: "var(--mono)", fontSize: 13 }}>
                  ✓ {c.form.success}
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{c.form.name}</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-elev-2)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius)", color: "var(--ink)", fontFamily: "var(--sans)", fontSize: 14, outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{c.form.email}</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={{ width: "100%", padding: "12px 14px", background: "var(--bg-elev-2)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius)", color: "var(--ink)", fontFamily: "var(--sans)", fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{c.form.message}</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={c.form.messagePlaceholder}
                      style={{ width: "100%", padding: "12px 14px", background: "var(--bg-elev-2)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius)", color: "var(--ink)", fontFamily: "var(--sans)", fontSize: 14, outline: "none", resize: "none" }} />
                  </div>
                  {status === "error" && <p style={{ color: "#F87171", fontFamily: "var(--mono)", fontSize: 12 }}>{c.form.error}</p>}
                  <button type="submit" disabled={status === "sending"}
                    className="btn btn-ghost btn-small" style={{ alignSelf: "flex-start" }}>
                    {status === "sending" ? c.form.sending : c.form.submit}
                    {status !== "sending" && <span className="arrow" aria-hidden="true" />}
                  </button>
                </form>
              )}

              <div className="or-label" style={{ marginTop: 8 }}>{c.orLabel}</div>
              <div className="contact-details">
                <a href={`mailto:${c.email}`}><span className="ico">@</span><span>{c.email}</span></a>
                <a href={`tel:${c.phone.replace(/\s/g, "")}`}><span className="ico">☎</span><span>{c.phone}</span></a>
                <a href={`https://${c.linkedin}`} target="_blank" rel="noopener noreferrer"><span className="ico">in</span><span>{c.linkedin}</span></a>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", color: "var(--ink-dim)" }}>
                  <span className="ico">⊙</span><span style={{ fontFamily: "var(--mono)", fontSize: 14.5 }}>{c.location}</span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="contact-side">
              <div className="avail-card">
                <div className="head">{c.availTitle}</div>
                <div className="body">{c.avail}</div>
              </div>
              <CalendarPreview />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
