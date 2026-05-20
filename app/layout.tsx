import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kenneth Andersen | Strategisk rådgiver og leder",
  description:
    "Erfaren leder og rådgiver med 15+ år i strategi, teknologi og kommersiell gjennomføring. Tilgjengelig for rådgiverengasjementer, styrearbeid og C-nivå muligheter.",
  openGraph: {
    title: "Kenneth Andersen | Strategisk rådgiver og leder",
    description:
      "Erfaren leder med dokumentert track record — NOK 1 mrd+ sikret, 3 selskaper bygd fra grunnen.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-navy text-slate-100 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
