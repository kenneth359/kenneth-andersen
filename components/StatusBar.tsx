"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function StatusBar() {
  const { lang } = useLang();
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = d.toLocaleTimeString(lang === "no" ? "nb-NO" : "en-US", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Oslo",
      });
      setClock(`${time} OSL`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <div className="status-bar">
      <div className="left">
        <span>KA / SYS v3.0</span>
        <span className="sep">|</span>
        <span className="dot-live">{lang === "no" ? "aktiv" : "active"}</span>
      </div>
      <div className="right">
        <span>{lang === "no" ? "Engasjement 2026" : "Engagement 2026"}</span>
        <span className="sep">|</span>
        <span className="clock">{clock}</span>
      </div>
    </div>
  );
}
