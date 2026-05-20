"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Career() {
  const { lang } = useLang();
  const t = translations[lang].career;

  return (
    <section className="py-24 bg-[#0a1120]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">
            {lang === "no" ? "Erfaring" : "Experience"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{t.heading}</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-[140px] top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/20 to-transparent" />

          <div className="flex flex-col gap-10">
            {t.roles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col md:flex-row gap-4 md:gap-8 pl-6 md:pl-0"
              >
                {/* Period */}
                <div className="md:w-32 md:text-right flex-shrink-0">
                  <span className="text-[#D4AF37] text-sm font-medium">{role.period}</span>
                </div>

                {/* Dot */}
                <div className="hidden md:flex items-start justify-center w-8 flex-shrink-0 pt-1">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-[#0a1120] z-10 flex-shrink-0" />
                </div>
                {/* Mobile dot */}
                <div className="absolute left-0 mt-1 md:hidden">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <h3 className="text-white font-bold text-base mb-0.5">{role.title}</h3>
                  <p className="text-[#D4AF37] text-sm mb-2">{role.company}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{role.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
