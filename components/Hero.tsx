"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Hero() {
  const { lang } = useLang();
  const t = translations[lang].hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#0F172A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Tag pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 rounded-full text-[#D4AF37] text-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          {t.tag}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {t.headline.map((line, i) => (
            <span key={i} className="block">
              {i === 0 ? (
                <>{line}</>
              ) : (
                <span className="text-[#D4AF37]">{line}</span>
              )}
            </span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed"
        >
          {t.sub}
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mb-12"
        >
          {t.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Divider dots */}
        <div className="hidden sm:flex items-center justify-center gap-2 mb-12 -mt-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`rounded-full bg-[#D4AF37] ${i === 1 ? "w-1.5 h-1.5" : "w-1 h-1 opacity-40"}`} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#kontakt"
            className="px-8 py-4 bg-[#D4AF37] text-[#0F172A] font-bold text-base rounded-full hover:bg-[#E8CC6A] transition-all duration-200 hover:scale-105"
          >
            {t.cta}
          </a>
          <a
            href="#tjenester"
            className="px-8 py-4 border border-white/20 text-white font-medium text-base rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            {lang === "no" ? "Se hva jeg tilbyr" : "See what I offer"}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-0.5 h-8 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </motion.div>
    </section>
  );
}
