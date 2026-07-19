import type { Metadata } from "next";
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PersonSchema from "@/components/PersonSchema";

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

const BASE = "https://kennethandersen.no";

export const metadata: Metadata = {
  title: "Kenneth Andersen | Strategisk rådgiver og styremedlem — Norge",
  description:
    "Kenneth Andersen er strategisk rådgiver og styremedlem med 15 år erfaring innen energi og teknologi i Norge. Tilgjengelig for styrearbeid, strategi og interim ledelse.",
  keywords: [
    "strategisk rådgiver Norge",
    "styremedlem energi Norge",
    "strategic advisor Norway energy",
    "board member Norway",
    "Kenneth Andersen",
    "energirådgiver Norge",
    "styremedlem rekruttering",
    "interim leder Norge",
    "rådgiver fornybar energi",
    "AI foredragsholder Norge",
    "AI foredrag bedrift",
    "AI kurs for ledergrupper",
  ],
  authors: [{ name: "Kenneth Andersen", url: BASE }],
  creator: "Kenneth Andersen",
  publisher: "Kenneth Andersen",
  alternates: {
    canonical: BASE,
    languages: {
      "nb-NO": BASE,
      "en-US": `${BASE}/en`,
      "x-default": BASE,
    },
  },
  openGraph: {
    type: "profile",
    url: BASE,
    siteName: "Kenneth Andersen",
    locale: "nb_NO",
    alternateLocale: "en_US",
    title: "Kenneth Andersen — Strategisk rådgiver og styremedlem",
    description:
      "Strategisk rådgiver og styremedlem med ekspertise innen energi og teknologi i Norge. 15 år fra montørhender til konsernledelse.",
    images: [
      {
        url: `${BASE}/assets/kenneth-studio.jpg`,
        width: 1200,
        height: 800,
        alt: "Kenneth Andersen — Strategisk rådgiver, styremedlem",
      },
    ],
    firstName: "Kenneth",
    lastName: "Andersen",
    username: "kennethandersenstrategy",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenneth Andersen — Strategisk rådgiver og styremedlem, Norge",
    description:
      "Strategisk rådgivning, styrearbeid og interim ledelse. Spesialist på energi og teknologi i Norge.",
    images: [`${BASE}/assets/kenneth-studio.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nb"
      className={`${ibmPlexSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif" }}
    >
      <head>
        <PersonSchema />
        {/* Profile meta tags */}
        <meta property="profile:first_name" content="Kenneth" />
        <meta property="profile:last_name" content="Andersen" />
        <meta property="profile:username" content="kennethandersenstrategy" />
        {/* Geo signals */}
        <meta name="geo.region" content="NO" />
        <meta name="geo.country" content="Norway" />
        <meta name="geo.placename" content="Langesund, Telemark" />
        {/* Dublin Core */}
        <meta name="DC.creator" content="Kenneth Andersen" />
        <meta name="DC.subject" content="Strategisk rådgivning, styrearbeid, energisektoren, Norge" />
        <meta name="DC.language" content="nb" />
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
