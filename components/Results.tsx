"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Results() {
  const { lang } = useLang();
  const t = translations[lang].results;

  return (
    <section id="resultater" className="py-24 bg-[#0a1120]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">
            {lang === "no" ? "Track record" : "Track record"}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.heading}</h2>
          <p className="text-slate-400 text-lg">{t.sub}</p>
        </motion.div>

        {/* Big stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {t.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center"
            >
              <div className="text-xs text-[#D4AF37] font-medium uppercase tracking-wider mb-2 opacity-70">
                {stat.prefix}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
              <div className="text-xs text-[#D4AF37]/60">{stat.note}</div>
            </motion.div>
          ))}
        </div>

        {/* Results table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-white font-semibold text-lg mb-4">{t.tableHeading}</h3>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1E293B] border-b border-white/10">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium w-1/4">
                    {lang === "no" ? "Selskap" : "Company"}
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium w-1/6">
                    {lang === "no" ? "Rolle" : "Role"}
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    {lang === "no" ? "Resultat" : "Result"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.table.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 hover:bg-[#1E293B]/50 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-[#1E293B]/20"
                    }`}
                  >
                    <td className="px-5 py-4 text-white font-medium">{row.company}</td>
                    <td className="px-5 py-4 text-[#D4AF37] text-xs font-medium">{row.role}</td>
                    <td className="px-5 py-4 text-slate-300">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
