"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function About() {
  const { lang } = useLang();
  const t = translations[lang].about;

  return (
    <section id="om" className="py-24 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">
            {lang === "no" ? "Bakgrunn" : "Background"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{t.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left — photo + badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Photo placeholder */}
            <div className="aspect-[4/5] rounded-xl border border-white/10 bg-[#1E293B]/50 flex flex-col items-center justify-center gap-3 text-center p-6">
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#D4AF37]">KA</span>
              </div>
              <p className="text-slate-500 text-sm">
                {lang === "no" ? "Profilbilde kommer" : "Profile photo coming"}
              </p>
            </div>

            {/* Author badge */}
            <div className="p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-wider mb-2">
                {t.authorBadge.label}
              </p>
              <p className="text-white text-sm font-semibold italic mb-1">
                {t.authorBadge.title}
              </p>
              <p className="text-slate-400 text-xs">{t.authorBadge.sub}</p>
            </div>

            {/* Certifications badge */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#1E293B]/30">
              <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-wider mb-2">
                {t.certBadge.label}
              </p>
              {t.certBadge.items.map((item, i) => (
                <p key={i} className="text-slate-300 text-sm mb-1 flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  {item}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right — text + education */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-5">
              <p className="text-slate-300 text-lg leading-relaxed">{t.p1}</p>
              <p className="text-slate-400 leading-relaxed">{t.p2}</p>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-[#D4AF37]" />
                {t.educationHeading}
              </h3>
              <div className="flex flex-col gap-4">
                {t.education.map((edu, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-[#1E293B]/20 hover:border-[#D4AF37]/20 transition-colors"
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#D4AF37] text-xs font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{edu.degree}</p>
                      <p className="text-slate-400 text-sm">{edu.school}</p>
                      <p className="text-[#D4AF37]/60 text-xs mt-0.5">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
