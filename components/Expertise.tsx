"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Expertise() {
  const { lang } = useLang();
  const t = translations[lang].expertise;

  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">
            {lang === "no" ? "Kompetanse" : "Expertise"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{t.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-xl border border-white/10 bg-[#1E293B]/30 hover:border-[#D4AF37]/20 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 flex-shrink-0 rounded border border-[#D4AF37]/40 flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
