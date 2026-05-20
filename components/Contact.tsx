"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Contact() {
  const { lang } = useLang();
  const t = translations[lang].contact;
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
    <section id="kontakt" className="py-24 bg-[#0a1120]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">
            {lang === "no" ? "Kontakt" : "Contact"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.heading}</h2>
          <p className="text-slate-400 text-lg max-w-2xl">{t.sub}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {status === "success" ? (
              <div className="p-8 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-center">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-white font-semibold text-lg">{t.form.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">{t.form.name}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                      placeholder="Kenneth Andersen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">{t.form.email}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                      placeholder="navn@selskap.no"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">{t.form.message}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1E293B] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm resize-none"
                    placeholder={t.form.messagePlaceholder}
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">{t.form.error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="self-start px-8 py-3 bg-[#D4AF37] text-[#0F172A] font-bold text-sm rounded-full hover:bg-[#E8CC6A] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  {status === "sending" ? t.form.sending : t.form.submit}
                </button>
              </form>
            )}
          </motion.div>

          {/* Direct contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="p-6 rounded-xl border border-white/10 bg-[#1E293B]/30">
              <h3 className="text-white font-semibold mb-5">{t.direct.heading}</h3>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${t.direct.email}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-colors flex-shrink-0">
                    @
                  </span>
                  <span className="text-sm break-all">{t.direct.email}</span>
                </a>
                <a
                  href={`tel:${t.direct.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-colors flex-shrink-0">
                    ✆
                  </span>
                  <span className="text-sm">{t.direct.phone}</span>
                </a>
                <a
                  href="https://linkedin.com/in/kennethandersenstrategy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-colors flex-shrink-0">
                    in
                  </span>
                  <span className="text-sm">LinkedIn</span>
                </a>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    ◎
                  </span>
                  <span className="text-sm">{t.direct.location}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <p className="text-[#D4AF37] text-sm font-medium mb-2">
                {lang === "no" ? "Tilgjengelighet" : "Availability"}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {lang === "no"
                  ? "Åpen for rådgiverengasjementer, styrearbeid og C-nivå muligheter fra og med nå."
                  : "Open for advisory engagements, board positions and C-level opportunities starting now."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
