import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PersonSchema from "@/components/PersonSchema";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE = "https://kennethandersen.no";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Kenneth Andersen | Kommersiell leder, selskapsbygger og styremedlem i energi og teknologi",
  description:
    "Kommersiell leder og selskapsbygger i energi og teknologi. Tidligere daglig leder og direktør, bygde Skagerak Mobil Energi fra pilot til eget selskap.",
  keywords: [
    "Kenneth Andersen",
    "kommersiell leder",
    "corporate venture builder",
    "kommersiell direktør energi",
    "daglig leder vekstselskap",
    "forretningsutvikling elektrifisering",
    "styremedlem energi Norge",
    "Skagerak Mobil Energi",
    "batteri og lading",
    "depotlading tungtransport",
    "AI foredrag ledergruppe",
  ],
  authors: [{ name: "Kenneth Andersen", url: BASE }],
  creator: "Kenneth Andersen",
  publisher: "Kenneth Andersen",
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    type: "profile",
    url: BASE,
    siteName: "Kenneth Andersen",
    locale: "nb_NO",
    alternateLocale: "en_US",
    title: "Kenneth Andersen — det komplekse, gjort forståelig",
    description:
      "Kommersiell leder, selskapsbygger og styremedlem i energi og teknologi. Snakker språket til CEO, CFO, CMO og CTO.",
    images: [
      {
        url: `${BASE}/assets/kenneth-studio.jpg`,
        width: 1200,
        height: 800,
        alt: "Kenneth Andersen",
      },
    ],
    firstName: "Kenneth",
    lastName: "Andersen",
    username: "kennethandersenstrategy",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenneth Andersen — det komplekse, gjort forståelig",
    description:
      "Kommersiell leder, selskapsbygger og styremedlem i energi og teknologi.",
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
      className={schibsted.variable}
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
        <meta name="DC.subject" content="Selskapsbygging, forretningsutvikling, elektrifisering, styrearbeid, Norge" />
        <meta name="DC.language" content="nb" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
