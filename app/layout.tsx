import type { Metadata } from "next";
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kenneth Andersen — Strategisk rådgiver, styremedlem og operativ leder",
  description: "Strategi som lander i drift. Kenneth Andersen er strategisk rådgiver og styremedlem for selskaper som vil koble ambisjon til gjennomføring — særlig der teknologi, energi og industri møter kommersiell vekst.",
  openGraph: {
    title: "Kenneth Andersen — Strategisk rådgiver",
    description: "Strategi som lander i drift. 15 år fra montørhender til konsernledelse.",
    type: "website",
    url: "https://kennethandersen.no",
  },
  alternates: { canonical: "https://kennethandersen.no" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="no"
      className={`${ibmPlexSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      style={{
        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
      }}
    >
      <head>
        <style>{`
          :root {
            --sans: var(--font-ibm-plex-sans), "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
            --serif: var(--font-instrument-serif), "Instrument Serif", Georgia, serif;
            --mono: var(--font-jetbrains-mono), "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace;
          }
        `}</style>
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
