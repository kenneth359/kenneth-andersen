"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Services() {
  const { lang } = useLang();
  const t = translations[lang].services;

  return (
    <section id="tjenester" className="py-24 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">
            {lang === "no" ? "Tjenester" : "Services"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.heading}</h2>
          <p className="text-slate-400 text-lg max-w-2xl">{t.sub}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 rounded-xl border border-white/10 bg-[#1E293B]/50 hover:bg-[#1E293B] hover:border-[#D4AF37]/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                <span className="text-[#D4AF37] text-lg">{item.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
